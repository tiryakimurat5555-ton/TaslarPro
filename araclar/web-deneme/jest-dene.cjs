// Vahşi Yaşam'ı "Sesle oyna" kipinde Kayıp Okyanus düzeniyle oynar: menüler sesli liste (dokun = oku, çift dokun = seç,
// iki parmakla çift dokun = geri), sahada tam ekran hareketler. Araştırma merkezi menüleri de denenir.
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
  // Dokunuşlar sayfa içinde olay olarak gönderilir (başsız tarayıcı yavaş; zamanlama bozulmasın)
  const olaylar = (liste) =>
    s.evaluate((liste) => {
      const ol = (tur, x, y, h) => h.dispatchEvent(new MouseEvent(tur, { bubbles: true, clientX: x, clientY: y }));
      for (const [tur, x, y] of liste) ol(tur, x, y, tur === 'mousedown' ? document.elementFromPoint(x, y) : window);
    }, liste);
  const dokun = (x = 195, y = 420) => olaylar([['mousedown', x, y], ['mouseup', x, y]]);
  const ciftDokun = async (x = 195, y = 420) => {
    await dokun(x, y);
    await bekle(80);
    await dokun(x, y);
  };
  const kaydir = (dx, dy, x = 195, y = 500) => olaylar([['mousedown', x, y], ...[1, 2, 3, 4, 5, 6].map((i) => ['mousemove', x + (dx * i) / 6, y + (dy * i) / 6]), ['mouseup', x + dx, y + dy]]);
  const uzunBas = async () => {
    await olaylar([['mousedown', 195, 420]]);
    await bekle(900);
    await olaylar([['mouseup', 195, 420]]);
  };
  const surukle = async (dx, dy, sure) => {
    await olaylar([['mousedown', 195, 500], ['mousemove', 195 + dx, 500 + dy]]);
    await bekle(sure);
    await olaylar([['mouseup', 195 + dx, 500 + dy]]);
  };
  // Sesli listede yazısı verilen satıra sağa kaydırarak gider (VoiceOver gibi; liste kendini kaydırır), sonra çift dokunup seçer
  const sonSoz = () => s.evaluate(() => window.__konusmalar[window.__konusmalar.length - 1] || '');
  const menuSec = async (yazi) => {
    await parmak(1);
    for (let i = 0; i < 6; i++) {
      await kaydir(-120, 0, 300, 400);
      await bekle(120);
    }
    let bulundu = false;
    for (let i = 0; i < 40; i++) {
      const m = await sonSoz();
      if (m.includes(yazi) && !m.startsWith('Menü') ? m.split('. ').some((p) => p.startsWith(yazi)) || m.startsWith(yazi) : m.startsWith(yazi)) {
        bulundu = true;
        break;
      }
      await kaydir(120, 0, 100, 400);
      await bekle(150);
    }
    if (!bulundu) return console.log('YOK:', yazi);
    await ciftDokun();
    await bekle(500);
  };
  const geri = async () => {
    await parmak(2);
    await ciftDokun();
    await parmak(1);
    await bekle(500);
  };
  const satirlar = () => s.evaluate(() => [...document.querySelectorAll('span')].filter((x) => x.getClientRects().length).map((x) => x.textContent.slice(0, 70)).slice(0, 30));
  const yaz = async (ad, satirGoster) => {
    await s.screenshot({ path: `${O}/j-${ad}.png` });
    console.log('\n##', ad);
    if (satirGoster) console.log('SATIRLAR:', (await satirlar()).join(' | '));
    console.log('KONUŞMA:', (await s.evaluate(() => window.__konusmalar.splice(0).join(' // '))).slice(0, 1400));
    if (h.length) console.log('HATALAR:', h.splice(0).slice(0, 5).join('\n'));
  };
  await s.locator('[aria-label="Sesle oyna"]').click();
  await bekle(800);
  await yaz('0-ana-menu', true);
  await menuSec('Yeni araştırma');
  await menuSec('Defne');
  await bekle(1500);
  await yaz('1-saha');
  await parmak(1);
  await dokun();
  await bekle(900);
  await yaz('2-dokun');
  await uzunBas();
  await bekle(400);
  await yaz('3-uzun-bas');
  await parmak(2);
  await kaydir(0, -150);
  await parmak(1);
  await bekle(500);
  await yaz('4-araca-bin');
  await parmak(2);
  await ciftDokun();
  await parmak(1);
  await bekle(800);
  await yaz('5-menu', true);
  await menuSec('Yerler ve yolculuk');
  await menuSec('Gölet');
  await bekle(35000);
  await yaz('6-golet');
  await parmak(2);
  await kaydir(0, -150);
  await parmak(1);
  await bekle(500);
  await ciftDokun();
  await bekle(8000);
  await yaz('7-durbun');
  await parmak(2);
  await kaydir(150, 0);
  await parmak(1);
  await bekle(500);
  await ciftDokun();
  await bekle(1500);
  await yaz('8-foto');
  // Araştırma merkezi
  await parmak(2);
  await ciftDokun();
  await parmak(1);
  await bekle(800);
  await menuSec('Araştırma merkezi');
  await yaz('9-merkez', true);
  await menuSec('Görevler');
  await yaz('10-gorevler', true);
  await menuSec('Teklif');
  await menuSec('Kabul et');
  await yaz('11-kabul', true);
  await geri();
  await menuSec('Ekipman');
  await menuSec('Gece görüş dürbünü');
  await yaz('12-ekipman', true);
  await geri();
  await menuSec('Mesajlar');
  await yaz('13-mesajlar', true);
  await geri();
  await menuSec('Araştırmalar');
  await yaz('14-arastirmalar', true);
  await geri();
  await geri();
  await menuSec('Arşiv');
  await menuSec('Ansiklopedi');
  await yaz('15-ansiklopedi', true);
  await menuSec('Afrika Fili');
  await yaz('16-fil', true);
  await geri();
  await geri();
  await geri();
  await yaz('17-ana-menuye', true);
  await geri();
  await yaz('18-sahaya');
  const once = await s.evaluate(() => ({ x: window.__vahsiDunya.oyuncu.x, y: window.__vahsiDunya.oyuncu.y }));
  await surukle(0, -120, 2500);
  const sonra = await s.evaluate(() => ({ x: window.__vahsiDunya.oyuncu.x, y: window.__vahsiDunya.oyuncu.y }));
  console.log('YÜRÜDÜ:', Math.hypot(sonra.x - once.x, sonra.y - once.y).toFixed(1), 'metre');
  const ozet = await s.evaluate(() => {
    const k = window.__vahsiDunya.k;
    return { tur: Object.keys(k.arsiv.turler), birey: Object.keys(k.arsiv.bireyler).length, foto: k.arsiv.fotolar.length, butce: k.butce, ekipman: k.ekipman, gorev: k.teklifler.map((t) => t.durum) };
  });
  console.log('ÖZET', JSON.stringify(ozet));
  if (h.length) console.log('HATALAR:', h.join('\n'));
  await b.close();
})();
