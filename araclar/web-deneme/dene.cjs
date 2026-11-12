// Vahşi Yaşam'ı Chromium'da baştan oynar: kip seçimi, yeni araştırma, gölete git, gözlemle, yaklaş, fotoğraf, ses kaydı,
// araç, gece, arşiv sekmeleri, kayıttan devam. Ekran görüntüleri ve konuşulanlar yazılır.
// Kullanım: bash araclar/web-deneme/yap.sh /tmp/claude-0/web && NODE_PATH=/opt/npm-tools/node_modules node araclar/web-deneme/dene.cjs /tmp/claude-0/web /tmp/claude-0/ekran
const { chromium } = require('playwright');
const fs = require('fs');
const O = process.argv[3] || '/tmp/claude-0/ekran';
fs.mkdirSync(O, { recursive: true });
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'] });
  const c = await b.newContext({ viewport: { width: 390, height: 844 } });
  const s = await c.newPage();
  const h = [];
  s.on('pageerror', (e) => h.push('PE ' + e.message + ' ' + (e.stack || '').split('\n').slice(1, 3).join(' ')));
  s.on('console', (m) => m.type() === 'error' && h.push('CE ' + m.text().slice(0, 300)));
  await s.goto('file://' + require('path').resolve(process.argv[2] || '/tmp/claude-0/web') + '/index.html');
  await s.waitForTimeout(1200);
  const et = async () => s.$$eval('[aria-label]', (els) => els.filter((e) => e.offsetParent !== null || e.getClientRects().length).map((e) => e.getAttribute('aria-label')));
  const tik = async (bas) => {
    const l = s.locator(`[aria-label^="${bas}"]`).first();
    if (!(await l.count())) {
      console.log('YOK:', bas);
      return false;
    }
    await l.click({ timeout: 3000 }).catch(() => l.click({ force: true, timeout: 3000 }).catch(() => console.log('TIKLANAMADI', bas)));
    await s.waitForTimeout(400);
    return true;
  };
  const yaz = async (ad) => {
    await s.screenshot({ path: `${O}/${ad}.png` });
    console.log('\n##', ad, '\n', (await et()).slice(0, 40).map((x) => x.slice(0, 80)).join(' | '));
    console.log('KONUŞMA:', (await s.evaluate(() => window.__konusmalar.splice(0).slice(-8).join(' // '))).slice(0, 1500));
    if (h.length) console.log('HATALAR:', h.splice(0).slice(0, 5).join('\n'));
  };
  const bekle = (ms) => s.waitForTimeout(ms);
  await tik('Görerek oyna');
  await tik('Yeni araştırma');
  await tik('Defne');
  await bekle(1500);
  await yaz('1-baslangic');
  await tik('Neredeyim');
  await tik('Etrafı tara');
  await yaz('2-tara');
  await tik('Araca bin');
  await bekle(300);
  await tik('Yerler');
  await tik('Gölet');
  await bekle(40000);
  await yaz('3-golette');
  await tik('Araçtan in');
  await tik('Gözlemle');
  await bekle(7500);
  await yaz('4-gozlem');
  await tik('Yaklaş');
  await bekle(6000);
  await tik('Fotoğraf çek');
  await tik('Ses kaydı');
  await bekle(7000);
  await yaz('5-foto-ses');
  // Gece
  await s.evaluate(() => {
    const d = window.__vahsiDunya;
    d.k.dk += 15 * 60;
  });
  await bekle(1500);
  await yaz('6-gece');
  await tik('Arşiv');
  await yaz('7-arsiv');
  for (const sk of ['Bireyler', 'Fotoğraflar', 'Sesler', 'Günlük']) {
    await tik(sk);
    await yaz('8-' + sk);
  }
  await tik('Türler');
  const tur = (await et()).find((x) => /davranış/.test(x));
  if (tur) {
    await tik(tur);
    await yaz('9-tur');
    const birey = (await et()).find((x) => /^(Zebra|Fil|Zürafa|Aslan|Ceylan|Gergedan|Su aygırı|Yaban domuzu) \d/.test(x));
    if (birey) {
      await tik(birey);
      await yaz('10-birey');
    }
  }
  await s.reload();
  await bekle(1500);
  await yaz('11-yeniden');
  await tik('Devam et');
  await bekle(1500);
  await yaz('12-devam');
  const ozet = await s.evaluate(() => {
    const d = window.__vahsiDunya;
    return { dk: d.k.dk, tur: Object.keys(d.k.arsiv.turler), birey: Object.keys(d.k.arsiv.bireyler).length, foto: d.k.arsiv.fotolar.length };
  });
  console.log('ÖZET', JSON.stringify(ozet));
  console.log('SESLER', (await s.evaluate(() => [...new Set(window.__sesler)].join(' '))).slice(0, 800));
  fs.writeFileSync(O + '/hatalar.txt', h.join('\n'));
  await b.close();
})();
