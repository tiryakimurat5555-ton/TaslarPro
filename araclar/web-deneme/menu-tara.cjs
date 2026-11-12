// Menü taraması (Aşama 7, ekran okuyucuyla uçtan uca deneme): zengin bir kayıtla oyunu açar, oyun menüsünün
// ulaşılabilen bütün sayfalarını gezer; her satırın okunabilir etiketi olduğunu, bozuk metin ("undefined", "NaN"...)
// ve yinelenen satır kimliği olmadığını denetler. VoiceOver kipinde her düğmenin erişilebilirlik etiketi de denetlenir.
// Kullanım: KAYIT_YAZ=/tmp/claude-0/zengin-kayit.json bun araclar/oyun-testi.js 20
//   NODE_PATH=/opt/npm-tools/node_modules node araclar/web-deneme/menu-tara.cjs /tmp/claude-0/web /tmp/claude-0/zengin-kayit.json kendi|voiceover
const { chromium } = require('playwright');
const fs = require('fs');
const [, , WEB = '/tmp/claude-0/web', KAYIT = '/tmp/claude-0/zengin-kayit.json', KIP = 'kendi'] = process.argv;
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'] });
  const s = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage();
  const hatalar = [];
  s.on('pageerror', (e) => hatalar.push('PE ' + e.message));
  s.on('console', (m) => m.type() === 'error' && hatalar.push('CE ' + m.text().slice(0, 200)));
  const kayit = fs.readFileSync(KAYIT, 'utf8');
  await s.addInitScript(
    ([kayit, kip]) => {
      localStorage.setItem('vahsi-yasam-kayit-v1', kayit);
      localStorage.setItem('vahsi-yasam-ayar-v1', JSON.stringify({ kip, grafik: 'kapali' }));
    },
    [kayit, KIP]
  );
  await s.goto('file://' + require('path').resolve(WEB) + '/index.html');
  await s.waitForTimeout(1500);
  // Devam et
  if (KIP === 'voiceover') await s.locator('[aria-label^="Devam et"]').first().click();
  else
    await s.evaluate(() => {
      const ol = (tur) => (tur === 'mousedown' ? document.elementFromPoint(195, 420) : window).dispatchEvent(new MouseEvent(tur, { bubbles: true, clientX: 195, clientY: 420 }));
      ol('mousedown');
      ol('mouseup');
      setTimeout(() => {
        ol('mousedown');
        ol('mouseup');
      }, 80);
    });
  await s.waitForTimeout(2500);
  const oyunda = await s.evaluate(() => !!globalThis.__oyunMenu);
  if (!oyunda) {
    console.log('Oyun açılamadı', hatalar.join('\n'));
    process.exit(1);
  }
  const KOTU = /undefined|NaN|\[object|null\b|  |\.\.(?!\.)| ,/;
  const sorunlar = [];
  const gezilen = new Set();
  const kuyruk = ['ana'];
  let satirSayisi = 0;
  while (kuyruk.length && gezilen.size < 400) {
    const id = kuyruk.shift();
    if (gezilen.has(id)) continue;
    gezilen.add(id);
    await s.evaluate((id) => {
      globalThis.__oyunMenu.kapat();
      globalThis.__oyunMenu.ac(id);
    }, id);
    await s.waitForTimeout(KIP === 'voiceover' ? 120 : 90);
    const l = await s.evaluate(() => {
      const x = globalThis.__sonListe;
      if (!x) return null;
      const yazi = (v) => (typeof v === 'function' ? v() : v);
      return { baslik: x.baslik, ogeler: (x.ogeler || []).map((o) => ({ id: o.id, etiket: String(yazi(o.etiket)), ipucu: o.ipucu ? String(yazi(o.ipucu)) : '', alt: !!o.alt, secilir: !!o.sec })) };
    });
    if (!l) {
      sorunlar.push(`${id}: liste çizilmedi`);
      continue;
    }
    if (!l.baslik) sorunlar.push(`${id}: başlık yok`);
    const kimlikler = new Set();
    for (const o of l.ogeler) {
      satirSayisi++;
      if (!o.etiket || o.etiket === 'undefined') sorunlar.push(`${id}: etiketsiz satır (${o.id})`);
      if (KOTU.test(o.etiket)) sorunlar.push(`${id}: bozuk metin: ${o.etiket.slice(0, 140)}`);
      if (o.ipucu && KOTU.test(o.ipucu)) sorunlar.push(`${id}: bozuk ipucu: ${o.ipucu.slice(0, 140)}`);
      if (kimlikler.has(o.id)) sorunlar.push(`${id}: yinelenen satır kimliği ${o.id}`);
      kimlikler.add(o.id);
      if (o.alt && !gezilen.has(o.id)) kuyruk.push(o.id);
    }
    if (KIP === 'voiceover') {
      const etiketsiz = await s.evaluate(() => [...document.querySelectorAll('[data-rol="button"]')].filter((e) => e.getClientRects().length && !(e.getAttribute('aria-label') || '').trim()).length);
      if (etiketsiz) sorunlar.push(`${id}: ${etiketsiz} etiketsiz düğme`);
    }
  }
  // Sahadaki VoiceOver düğmeleri
  if (KIP === 'voiceover') {
    await s.evaluate(() => globalThis.__oyunMenu.kapat());
    await s.waitForTimeout(400);
    const dugmeler = await s.evaluate(() => [...document.querySelectorAll('[data-rol="button"]')].filter((e) => e.getClientRects().length).map((e) => e.getAttribute('aria-label') || ''));
    console.log(`Sahada ${dugmeler.length} düğme: ${dugmeler.join(' | ')}`);
    dugmeler.filter((x) => !x.trim()).forEach(() => sorunlar.push('saha: etiketsiz düğme'));
  }
  console.log(`Kip ${KIP}: ${gezilen.size} menü sayfası, ${satirSayisi} satır gezildi.`);
  console.log(`Sorun: ${sorunlar.length}`);
  [...new Set(sorunlar)].slice(0, 40).forEach((x) => console.log('  ' + x));
  const h = [...new Set(hatalar)].filter((x) => !x.includes('WebGL'));
  if (h.length) console.log('Sayfa hataları:\n  ' + h.slice(0, 10).join('\n  '));
  await b.close();
})();
