// Vahşi Yaşam'ı "Sesle oyna" kipinde dokunma hareketleriyle oynar (Kayıp Okyanus düzeni):
// menülerde oyunun gezgini (dokun = seç, çift dokun = çalıştır), sahada tam ekran hareketler.
// Kullanım: bash araclar/web-deneme/yap.sh /tmp/claude-0/web && NODE_PATH=/opt/npm-tools/node_modules node araclar/web-deneme/jest-dene.cjs /tmp/claude-0/web /tmp/claude-0/ekran
const { chromium } = require('playwright');
const fs = require('fs');
const O = process.argv[3] || '/tmp/claude-0/ekran';
fs.mkdirSync(O, { recursive: true });
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'] });
  const s = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage();
  const h = [];
  s.on('pageerror', (e) => h.push('PE ' + e.message + ' ' + (e.stack || '').split('\n').slice(1, 3).join(' ')));
  s.on('console', (m) => m.type() === 'error' && h.push('CE ' + m.text().slice(0, 300)));
  await s.goto('file://' + require('path').resolve(process.argv[2] || '/tmp/claude-0/web') + '/index.html');
  await s.waitForTimeout(1000);
  const bekle = (ms) => s.waitForTimeout(ms);
  const parmak = (n) => s.evaluate((n) => (window.__parmak = n), n);
  const dokun = async (x = 195, y = 420) => {
    await s.mouse.move(x, y);
    await s.mouse.down();
    await bekle(40);
    await s.mouse.up();
  };
  const ciftDokun = async (x = 195, y = 420) => {
    await dokun(x, y);
    await bekle(120);
    await dokun(x, y);
  };
  const surukle = async (dx, dy, sure = 300, x = 195, y = 500) => {
    await s.mouse.move(x, y);
    await s.mouse.down();
    const adim = 10;
    for (let i = 1; i <= adim; i++) {
      await s.mouse.move(x + (dx * i) / adim, y + (dy * i) / adim);
      await bekle(sure / adim);
    }
    await s.mouse.up();
  };
  // Hızlı kaydırma: başsız tarayıcıda 3B çizim yavaş olduğundan fare olayları sayfa içinde tek seferde gönderilir
  const kaydir = (dx, dy) =>
    s.evaluate(
      ([dx, dy]) => {
        const x = 195;
        const y = 500;
        const hedef = document.elementFromPoint(x, y);
        const ol = (tur, cx, cy, h) => h.dispatchEvent(new MouseEvent(tur, { bubbles: true, clientX: cx, clientY: cy }));
        ol('mousedown', x, y, hedef);
        for (let i = 1; i <= 6; i++) ol('mousemove', x + (dx * i) / 6, y + (dy * i) / 6, window);
        ol('mouseup', x + dx, y + dy, window);
      },
      [dx, dy]
    );
  const uzunBas = async () => {
    await s.mouse.move(195, 420);
    await s.mouse.down();
    await bekle(900);
    await s.mouse.up();
  };
  const kutu = (etiket) =>
    s.evaluate((et) => {
      const e = [...document.querySelectorAll('[aria-label]')].find((x) => x.getAttribute('aria-label').startsWith(et) && x.getClientRects().length);
      if (!e) return null;
      const r = e.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    }, etiket);
  // Gezgin: öğeye dokun (seç), sonra herhangi bir yere çift dokun (çalıştır)
  const sec = async (etiket) => {
    const k = await kutu(etiket);
    if (!k) return console.log('YOK:', etiket);
    await dokun(k.x, k.y);
    await bekle(450);
    await ciftDokun(k.x, k.y);
    await bekle(500);
  };
  const yaz = async (ad) => {
    await s.screenshot({ path: `${O}/j-${ad}.png` });
    console.log('\n##', ad);
    console.log('KONUŞMA:', (await s.evaluate(() => window.__konusmalar.splice(0).join(' // '))).slice(0, 1600));
    if (h.length) console.log('HATALAR:', h.splice(0).slice(0, 5).join('\n'));
  };
  const btn = s.locator('[aria-label="Sesle oyna"]');
  await btn.click();
  await bekle(600);
  await sec('Yeni araştırma');
  await sec('Defne');
  await bekle(1500);
  await yaz('1-saha');
  await parmak(1);
  await dokun();
  await bekle(800);
  await yaz('2-dokun-anlat');
  await uzunBas();
  await bekle(500);
  await yaz('3-uzun-bas-durum');
  await parmak(2);
  await kaydir(0, -150);
  await bekle(600);
  await yaz('4-iki-parmak-yukari-araca-bin');
  await ciftDokun();
  await bekle(800);
  await yaz('5-iki-parmak-cift-menu');
  await parmak(1);
  await sec('Yerler');
  await sec('Gölet');
  await bekle(35000);
  await yaz('6-golete-vardi');
  await parmak(2);
  await kaydir(0, -150);
  await parmak(1);
  await bekle(500);
  await ciftDokun();
  await bekle(8000);
  await yaz('7-durbun-gozlem');
  await parmak(2);
  await kaydir(150, 0);
  await parmak(1);
  await bekle(600);
  await ciftDokun();
  await bekle(1500);
  await yaz('8-kamera-foto');
  await parmak(2);
  await kaydir(150, 0);
  await parmak(1);
  await bekle(600);
  await ciftDokun();
  await bekle(7500);
  await yaz('9-ses-kaydi');
  const once = await s.evaluate(() => ({ x: window.__vahsiDunya.oyuncu.x, y: window.__vahsiDunya.oyuncu.y }));
  await surukle(0, -120, 2500);
  const sonra = await s.evaluate(() => ({ x: window.__vahsiDunya.oyuncu.x, y: window.__vahsiDunya.oyuncu.y }));
  console.log('YÜRÜDÜ:', Math.hypot(sonra.x - once.x, sonra.y - once.y).toFixed(1), 'metre');
  await parmak(2);
  await ciftDokun();
  await bekle(800);
  await parmak(1);
  await sec('Arşiv');
  await parmak(2);
  await bekle(500);
  await yaz('10-arsiv');
  await parmak(2);
  await ciftDokun();
  await bekle(800);
  await yaz('11-geri-menu');
  await ciftDokun();
  await bekle(800);
  await yaz('12-geri-saha');
  const ozet = await s.evaluate(() => {
    const d = window.__vahsiDunya;
    return { tur: Object.keys(d.k.arsiv.turler), birey: Object.keys(d.k.arsiv.bireyler).length, foto: d.k.arsiv.fotolar.length, ses: d.k.arsiv.sesler.length, aracta: d.k.aracta };
  });
  console.log('ÖZET', JSON.stringify(ozet));
  await b.close();
})();
