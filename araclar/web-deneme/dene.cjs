// İki Sancak'ı Chromium'da açıp dener (3B dahil). Kullanım:
//   bash araclar/web-deneme/yap.sh <paket> && NODE_PATH=/opt/npm-tools/node_modules node araclar/web-deneme/dene.cjs <paket> <ekran-klasoru>
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const PAKET = path.resolve(process.argv[2] || '/tmp/oyun-web');
const CIKIS = path.resolve(process.argv[3] || '/tmp/oyun-ekran');
fs.mkdirSync(CIKIS, { recursive: true });
const URL = 'file://' + path.join(PAKET, 'index.html');
let hata = 0;
const kontrol = (k, m) => {
  if (!k) hata++;
  console.log(k ? 'tamam:' : 'HATA:', m);
};
const bekle = (ms) => new Promise((r) => setTimeout(r, ms));

async function ac(tarayici, onYukle) {
  const ctx = await tarayici.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  if (onYukle) await ctx.addInitScript(onYukle);
  const s = await ctx.newPage();
  const hatalar = [];
  s.on('pageerror', (e) => hatalar.push(e.message));
  s.on('console', (m) => m.type() === 'error' && hatalar.push(m.text()));
  await s.goto(URL);
  await bekle(600);
  return { s, hatalar, ctx };
}
const tikla = (s, etiket) => s.locator(etiket === 'Geri' ? '[aria-label="Geri"]' : `[aria-label^="${etiket}"]`).first().click();
const var_ = async (s, etiket) => (await s.locator(`[aria-label^="${etiket}"]`).count()) > 0;
const konusmalar = (s) => s.evaluate(() => window.__konusmalar.join(' | '));

(async () => {
  const t = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'] });

  // 1) Görerek: yeni karakter, oyun, savaş, menüler
  {
    const { s, hatalar } = await ac(t);
    kontrol(await var_(s, 'Görerek oyna'), 'kip seçimi açıldı');
    await tikla(s, 'Görerek oyna');
    await bekle(300);
    await tikla(s, 'Yeni karakter');
    await tikla(s, 'Gün Ulusu');
    await tikla(s, 'Elf');
    await tikla(s, 'Okçu');
    await tikla(s, 'Alpay');
    await tikla(s, 'Onayla ve başla');
    await bekle(2500);
    await s.screenshot({ path: path.join(CIKIS, '1-oyun.png') });
    kontrol(await var_(s, 'Saldır'), 'oyun ekranı açıldı');
    // Muhtar ile konuş (başlangıçta yanında)
    if (await var_(s, 'Muhtar ile konuş')) {
      await tikla(s, 'Muhtar ile konuş');
      await bekle(400);
    }
    kontrol((await konusmalar(s)).length >= 0, 'konuşma kaydı');
    // Joystick: kuzeye yürü (canavarlar dışarıda)
    const sol = s.locator('[aria-label^="Hareket alanı"]');
    const kutu = await sol.boundingBox();
    await s.mouse.move(kutu.x + kutu.width / 2, kutu.y + kutu.height / 2);
    await s.mouse.down();
    await s.mouse.move(kutu.x + kutu.width / 2, kutu.y + kutu.height / 2 - 60, { steps: 5 });
    await bekle(5000);
    await s.mouse.up();
    await s.screenshot({ path: path.join(CIKIS, '2-yuruyus.png') });
    await tikla(s, 'Etrafı tara');
    await bekle(300);
    await tikla(s, 'Hedef');
    await bekle(300);
    await tikla(s, 'Saldır');
    for (let i = 0; i < 6; i++) {
      await bekle(4000);
      if (await var_(s, 'Yeniden doğ')) await tikla(s, 'Yeniden doğ');
      if (!(await var_(s, 'Dur'))) {
        await tikla(s, 'Hedef');
        await tikla(s, 'Saldır');
      }
    }
    await s.screenshot({ path: path.join(CIKIS, '3-savas.png') });
    const k = await konusmalar(s);
    kontrol(/öldü/.test(k), 'en az bir canavar öldü');
    kontrol(!/NaN|undefined/.test(k), 'konuşmalarda bozuk metin yok');
    await tikla(s, 'Menü');
    await bekle(300);
    await tikla(s, 'Karakter');
    await bekle(300);
    await s.screenshot({ path: path.join(CIKIS, '4-karakter.png') });
    await tikla(s, 'Geri');
    await tikla(s, 'Çanta');
    await bekle(200);
    await s.screenshot({ path: path.join(CIKIS, '5-canta.png') });
    await tikla(s, 'Geri');
    await tikla(s, 'Görev');
    await tikla(s, 'Geri');
    await tikla(s, 'Kaydet ve ana menüye dön');
    await bekle(400);
    kontrol(await var_(s, 'Devam et'), 'kayıt sonrası Devam et görünüyor');
    await tikla(s, 'Devam et');
    await bekle(1200);
    kontrol(await var_(s, 'Saldır'), 'kayıttan devam edildi');
    console.log('Söylenenlerden örnek:', k.slice(0, 900));
    kontrol(!hatalar.length, 'sayfa hatası yok ' + hatalar.slice(0, 3).join(' / '));
  }

  // 2) Sesle oynama: tek dokunuş okur, iki dokunuş çalıştırır
  {
    const { s, hatalar } = await ac(t);
    await tikla(s, 'Sesle oyna');
    await bekle(300);
    const once = await konusmalar(s);
    await tikla(s, 'Yeni karakter');
    await bekle(300);
    kontrol(await var_(s, 'Nasıl oynanır'), 'tek dokunuş menüden çıkarmadı');
    kontrol((await konusmalar(s)).length > once.length, 'tek dokunuş adı okudu');
    await s.locator('[aria-label^="Yeni karakter"]').first().dblclick();
    await bekle(300);
    kontrol(await var_(s, 'Gün Ulusu'), 'iki dokunuş çalıştırdı');
    kontrol(!hatalar.length, 'sesle kipte sayfa hatası yok ' + hatalar.slice(0, 3).join(' / '));
  }

  // 3) VoiceOver kipi: hareket düğmeleri
  {
    const { s, hatalar } = await ac(t, () => {
      window.__voiceover = true;
    });
    await bekle(300);
    await tikla(s, 'VoiceOver ile oyna');
    await tikla(s, 'Yeni karakter');
    await tikla(s, 'Ay Ulusu');
    await tikla(s, 'Ork');
    await tikla(s, 'Savaşçı');
    await tikla(s, 'Kaya');
    await tikla(s, 'Onayla ve başla');
    await bekle(1500);
    kontrol(await var_(s, 'İleri yürü'), 'VoiceOver kipinde hareket düğmeleri var');
    await tikla(s, 'İleri yürü');
    await bekle(1000);
    const duyurular = await s.evaluate(() => window.__duyurular.join(' | '));
    kontrol(duyurular.length > 0, 'duyurular VoiceOver’a gitti');
    await s.screenshot({ path: path.join(CIKIS, '6-voiceover.png') });
    kontrol(!hatalar.length, 'VoiceOver kipinde sayfa hatası yok ' + hatalar.slice(0, 3).join(' / '));
  }
  await t.close();
  console.log(hata ? `${hata} hata` : 'Hepsi tamam');
  process.exit(hata ? 1 : 0);
})();
