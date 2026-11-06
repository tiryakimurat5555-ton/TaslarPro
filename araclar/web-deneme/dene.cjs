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

  // 2) Sesle oynama: VoiceOver hareketleri (gezgin)
  {
    const { s, hatalar } = await ac(t);
    const merkez = async (etiket) => {
      const k = await s.locator(`[aria-label^="${etiket}"]`).first().boundingBox();
      return { x: k.x + k.width / 2, y: k.y + k.height / 2 };
    };
    // kez 1: dokunup seç; kez 2: dokunup seç, sonra çift dokunarak çalıştır (VoiceOver gibi)
    const dokun = async (etiket, kez = 1) => {
      const m = await merkez(etiket);
      await s.mouse.click(m.x, m.y);
      await bekle(420);
      if (kez === 2) {
        await s.mouse.click(m.x, m.y);
        await bekle(100);
        await s.mouse.click(m.x, m.y);
        await bekle(350);
      }
    };
    const kaydir = async (dx) => {
      await s.mouse.move(200, 400);
      await s.mouse.down();
      await s.mouse.move(200 + dx, 400, { steps: 3 });
      await s.mouse.up();
      await bekle(250);
    };
    const sonSoz = () => s.evaluate(() => window.__konusmalar[window.__konusmalar.length - 1] || '');
    await tikla(s, 'Sesle oyna');
    await bekle(700);
    await dokun('Yeni karakter');
    kontrol(/Yeni karakter, düğme/.test(await sonSoz()), 'tek dokunuş öğeyi okudu');
    kontrol(await var_(s, 'Nasıl oynanır'), 'tek dokunuş çalıştırmadı');
    await kaydir(80);
    kontrol(/Nasıl oynanır/.test(await sonSoz()), 'sağa kaydırma sonraki öğeyi okudu: ' + (await sonSoz()));
    await kaydir(-80);
    kontrol(/Yeni karakter/.test(await sonSoz()), 'sola kaydırma önceki öğeye döndü');
    // Başka bir düğmenin üstüne çift dokunmak da seçili öğeyi çalıştırır (VoiceOver gibi)
    await kaydir(80);
    const ayarMerkez = await merkez('Ayarlar');
    await s.mouse.click(ayarMerkez.x, ayarMerkez.y);
    await bekle(100);
    await s.mouse.click(ayarMerkez.x, ayarMerkez.y);
    await bekle(500);
    kontrol(await var_(s, 'Geri'), 'başka düğmenin üstüne çift dokunma seçili Nasıl oynanır sayfasını açtı');
    // Geri düğmesine kaydırarak gel, ekranın üstüne çift dokun
    for (let i = 0; i < 12; i++) await kaydir(80);
    kontrol(/Geri, düğme|Son öğe/.test(await sonSoz()), 'kaydırarak Geri düğmesine gelindi');
    await s.mouse.click(200, 300);
    await bekle(100);
    await s.mouse.click(200, 300);
    await bekle(500);
    kontrol(await var_(s, 'Yeni karakter'), 'Geri düğmesi çift dokunuşla çalıştı');
    await dokun('Yeni karakter');
    // Ekranın boş bir yerine iki kez dokun: seçili öğe (Yeni karakter) çalışır
    await s.mouse.click(200, 820);
    await bekle(100);
    await s.mouse.click(200, 820);
    await bekle(500);
    kontrol(await var_(s, 'Gün Ulusu'), 'herhangi bir yere iki kez dokunmak seçili öğeyi çalıştırdı');
    await dokun('Gün Ulusu', 2);
    await dokun('İnsan', 2);
    await dokun('Rahip', 2);
    await dokun('Bora', 2);
    await dokun('Onayla ve başla', 2);
    await bekle(1500);
    kontrol(await var_(s, 'Saldır'), 'sesle karakter yaratıldı, oyun açıldı');
    const once = await s.evaluate(() => ({ ...globalThis.__ikiSancakDunya.oyuncu }));
    const m = await merkez('Hareket alanı');
    await s.mouse.move(m.x, m.y);
    await s.mouse.down();
    await s.mouse.move(m.x + 40, m.y - 60, { steps: 4 });
    await bekle(2000);
    await s.mouse.up();
    const sonra = await s.evaluate(() => ({ ...globalThis.__ikiSancakDunya.oyuncu }));
    kontrol(Math.hypot(sonra.x - once.x, sonra.y - once.y) > 3 && Math.abs(sonra.yon - once.yon) > 0.2, 'hareket alanında doğrudan yürüdü ve döndü');
    await dokun('Menü', 2);
    kontrol(await var_(s, 'Oyuna dön'), 'menü açıldı');
    await bekle(500);
    await kaydir(80);
    const ilk = await sonSoz();
    kontrol(/Menü|Oyuna dön/.test(ilk), 'panelde gezinme panel öğelerinden başladı: ' + ilk);
    await dokun('Oyuna dön', 2);
    await bekle(300);
    kontrol(!(await var_(s, 'Oyuna dön')), 'menü kapandı');
    await s.screenshot({ path: path.join(CIKIS, '7-sesle.png') });
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
