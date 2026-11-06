// Oyunu Chromium'da acip tiklayarak dener. Kullanim:
//   node araclar/web-deneme/dene.cjs <paket-klasoru> <ekran-goruntusu-klasoru>
// Paket: bash araclar/web-deneme/yap.sh <paket-klasoru>
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const PAKET = path.resolve(process.argv[2] || '/tmp/taslar-web');
const CIKIS = path.resolve(process.argv[3] || '/tmp/taslar-ekran');
fs.mkdirSync(CIKIS, { recursive: true });
const URL = 'file://' + path.join(PAKET, 'index.html');

let hata = 0;
const kontrol = (k, m) => {
  if (!k) {
    hata++;
    console.log('HATA:', m);
  } else console.log('tamam:', m);
};
const bekle = (ms) => new Promise((r) => setTimeout(r, ms));

// Tarayicidaki gunle ayni bicim
const BUGUN_BETIGI = `(() => { const d = new Date(); return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); })()`;

async function sayfaAc(tarayici, kayit) {
  const ctx = await tarayici.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  if (kayit) {
    await ctx.addInitScript(
      ([k, betik]) => {
        const bugun = eval(betik);
        const v = JSON.parse(k.replace(/__BUGUN__/g, bugun));
        localStorage.setItem('taslarpro-kayit-v1', JSON.stringify(v));
      },
      [JSON.stringify(kayit), BUGUN_BETIGI]
    );
  }
  const sayfa = await ctx.newPage();
  const hatalar = [];
  sayfa.on('pageerror', (e) => hatalar.push('sayfa: ' + e.message));
  sayfa.on('console', (m) => {
    if (m.type() === 'error' && !/Warning:|key prop|unique "key"|non-boolean attribute|React does not recognize/.test(m.text())) hatalar.push('konsol: ' + m.text().slice(0, 300));
  });
  await sayfa.goto(URL);
  await bekle(900);
  return { ctx, sayfa, hatalar };
}

const etiketli = (sayfa, bas) => sayfa.locator(`[aria-label^="${bas}"]`).first();

async function hamleSayisi(sayfa) {
  const e = await sayfa.locator('[aria-label^="Kalan hamle"]').first().getAttribute('aria-label');
  return parseInt(e.replace(/\D+/g, ' ').trim().split(' ')[0], 10);
}

// VoiceOver eylemleriyle gecerli bir hamle bul (gecersiz takas hamle harcamaz)
async function hamleYap(sayfa, tercih) {
  const once = await hamleSayisi(sayfa);
  const hucreler = await sayfa.$$eval('[data-eylemler]', (l) => l.map((e) => ({ id: e.getAttribute('data-dugme'), et: e.getAttribute('aria-label'), ey: e.getAttribute('data-eylemler') })));
  const sira = tercih ? [...hucreler.filter(tercih), ...hucreler] : hucreler;
  for (const h of sira) {
    for (const yon of tercih ? ['asagi', 'sag', 'sol'] : ['sag', 'asagi']) {
      if (!h.ey.split(',').includes(yon)) continue;
      await sayfa.evaluate(([id, y]) => window.__eylemler[id]({ nativeEvent: { actionName: y } }), [h.id, yon]);
      await bekle(250);
      const simdi = await hamleSayisi(sayfa).catch(() => once);
      if (simdi !== once) {
        await bekle(1500);
        return true;
      }
      if (await sayfa.getByText('Hamleler Bitti').count()) return true;
    }
  }
  return false;
}

async function tahtaImzasi(sayfa) {
  return (await sayfa.$$eval('[data-eylemler]', (l) => l.map((e) => e.getAttribute('aria-label').split(',')[0]))).join('|');
}

(async () => {
  const tarayici = await chromium.launch();
  const tumHatalar = [];

  // 1) Ilk acilis, ogretici, hamle, eylemler, magaza, menu, gunluk bulmaca
  {
    const { ctx, sayfa, hatalar } = await sayfaAc(tarayici);
    await sayfa.screenshot({ path: path.join(CIKIS, '01-ogretici.png') });
    kontrol(await sayfa.locator('text=Hoş Geldin').count(), 'öğretici penceresi açıldı');
    await etiketli(sayfa, 'Başla').click();
    await bekle(600);
    const hucre = await sayfa.locator('[data-eylemler]').count();
    kontrol(hucre === 36, `tahtada 36 hücre var (${hucre})`);
    await sayfa.screenshot({ path: path.join(CIKIS, '02-tahta.png') });
    const altinOnce = await sayfa.locator('[aria-label^="Mağaza,"]').first().getAttribute('aria-label');
    kontrol(/50 altın/.test(altinOnce), 'başlangıçta 50 altın: ' + altinOnce);
    kontrol(await hamleYap(sayfa), 'VoiceOver eylemiyle hamle yapıldı');
    const duy = await sayfa.evaluate(() => window.__duyurular.slice(-1)[0]);
    kontrol(/Kalan hamle 17/.test(duy || ''), 'hamle sonrası duyuru: ' + duy);
    const ilk = await sayfa.$eval('[data-eylemler]', (e) => e.getAttribute('data-dugme'));
    await sayfa.evaluate((id) => window.__eylemler[id]({ nativeEvent: { actionName: 'satir' } }), ilk);
    await sayfa.evaluate((id) => window.__eylemler[id]({ nativeEvent: { actionName: 'sutun' } }), ilk);
    const d2 = await sayfa.evaluate(() => window.__duyurular.slice(-2));
    kontrol(/^1\. satır: /.test(d2[0]) && /^1\. sütun, yukarıdan aşağı: /.test(d2[1]), 'satır/sütun okuma: ' + d2.join(' / '));
    // magaza
    await etiketli(sayfa, 'Mağaza,').click();
    await bekle(300);
    await sayfa.screenshot({ path: path.join(CIKIS, '03-magaza.png') });
    await etiketli(sayfa, 'İpucu, 20 altın').click();
    await bekle(200);
    kontrol(/Kalan altın 30/.test(await sayfa.evaluate(() => window.__duyurular.slice(-1)[0])), 'mağazadan ipucu alındı');
    await etiketli(sayfa, 'Mağazayı kapat').click();
    // menu
    await etiketli(sayfa, 'Menü').click();
    await bekle(300);
    kontrol(await sayfa.locator('[aria-label="Ayarlar, seçili, sekme 1 / 4"]').count(), 'menü sekme etiketi');
    await sayfa.screenshot({ path: path.join(CIKIS, '04-menu.png'), fullPage: true });
    await etiketli(sayfa, 'Kısa duyurular').click();
    await etiketli(sayfa, 'İstatistik').click();
    await bekle(200);
    await sayfa.screenshot({ path: path.join(CIKIS, '05-istatistik.png') });
    await etiketli(sayfa, 'Menüyü kapat').click();
    await bekle(200);
    kontrol(await hamleYap(sayfa), 'kısa duyuruyla hamle');
    const kisa = await sayfa.evaluate(() => window.__duyurular.slice(-1)[0]);
    kontrol(/^\d+ puan\./.test(kisa) && !/taş patladı/.test(kisa), 'kısa duyuru: ' + kisa);
    // gunluk bulmaca
    await etiketli(sayfa, 'Günlük bulmaca').click();
    await bekle(300);
    await sayfa.screenshot({ path: path.join(CIKIS, '06-gunluk-giris.png') });
    await etiketli(sayfa, 'Günlük bulmacayı oyna').click();
    await bekle(900);
    kontrol(await sayfa.locator('[aria-label="Günlük bulmaca oynuyorsun"]').count(), 'günlük bulmaca başladı');
    const imza1 = await tahtaImzasi(sayfa);
    await sayfa.screenshot({ path: path.join(CIKIS, '07-gunluk-tahta.png') });
    await etiketli(sayfa, 'Günlük bulmacayı baştan başlat').click();
    await bekle(700);
    const imza2 = await tahtaImzasi(sayfa);
    kontrol(imza1 === imza2, 'günlük bulmaca her seferinde aynı tahta');
    tumHatalar.push(...hatalar);
    await ctx.close();
  }

  // 2) Kiraz bolumu: tanitim penceresi ve kiraz indirme
  {
    const kayit = { level: 7, enYuksek: 7, ogretici: true, tanitimlar: [], settings: { ses: true, muzik: false, titresim: true, tema: 'koyu' } };
    const { ctx, sayfa, hatalar } = await sayfaAc(tarayici, kayit);
    kontrol(await sayfa.locator('text=Yeni: Kirazlar').count(), 'kiraz tanıtımı açıldı');
    kontrol(await sayfa.locator('text=Yeni: Buzlu taşlar').count(), 'buz tanıtımı açıldı');
    await sayfa.screenshot({ path: path.join(CIKIS, '08-tanitim.png') });
    await etiketli(sayfa, 'Anladım').click();
    await bekle(500);
    const kirazlar = await sayfa.locator('[aria-label^="Kiraz,"], [aria-label*="buzlu kiraz"]').count();
    kontrol(kirazlar === 2, `tahtada 2 kiraz var (${kirazlar})`);
    await sayfa.screenshot({ path: path.join(CIKIS, '09-kiraz-tahta.png') });
    tumHatalar.push(...hatalar);
    await ctx.close();
  }

  // 2b) Kiraz toplanmasi: 5. satirdaki kirazin altina bomba bonusu
  {
    const tahta = JSON.parse(fs.readFileSync(path.join(PAKET, 'ornek-tahta.json'), 'utf8'));
    tahta[4][2].gem = { id: 9999, color: -3, special: 'meyve' };
    const kayit = {
      level: 7,
      enYuksek: 7,
      ogretici: true,
      tanitimlar: ['buz', 'kiraz'],
      settings: { ses: true, muzik: false, titresim: true, tema: 'koyu' },
      devam: { level: 7, board: tahta, score: 0, moves: 20, obj: { type: 'drop', target: 2, color: null, current: 0 }, ayar: { type: 'drop', target: 2, moves: 22, ncolors: 4, ice: 0, chains: 0, stones: 0, stoneHp: 1 }, ikiKat: 0, uyarildi: false, mod: 'bolum', tarih: '__BUGUN__' },
    };
    const { ctx, sayfa, hatalar } = await sayfaAc(tarayici, kayit);
    kontrol(await sayfa.locator('[aria-label="Kiraz, 5. satır, 3. sütun"]').count(), 'kiraz 5. satırda');
    await sayfa.screenshot({ path: path.join(CIKIS, '09-kiraz-tahta.png') });
    await etiketli(sayfa, 'Bonuslar').click();
    await bekle(300);
    await etiketli(sayfa, 'Bomba, 1 adet').click();
    await bekle(300);
    await sayfa.locator('[data-eylemler][aria-label$=", 6. satır, 3. sütun"]').first().click();
    await bekle(2500);
    const e = await sayfa.locator('[aria-label^="Kiraz indir:"]').first().getAttribute('aria-label');
    kontrol(/: 1 \/ 2/.test(e), 'kiraz toplandı: ' + e);
    const tum = await sayfa.evaluate(() => window.__duyurular.join(' '));
    kontrol(/1 kiraz indirildi/.test(tum), 'kiraz duyurusu');
    const kirazSayi = await sayfa.locator('[data-eylemler][aria-label*="iraz,"]').count();
    kontrol(kirazSayi === 1, `yerine yeni kiraz geldi, tahtada ${kirazSayi} kiraz`);
    await sayfa.screenshot({ path: path.join(CIKIS, '10-kiraz-sonra.png') });
    tumHatalar.push(...hatalar);
    await ctx.close();
  }

  // 3) Kaybetme: 5 hamle daha satin al
  {
    const tahta = JSON.parse(fs.readFileSync(path.join(PAKET, 'ornek-tahta.json'), 'utf8'));
    const kayit = {
      level: 3,
      enYuksek: 3,
      ogretici: true,
      altin: 100,
      tanitimlar: ['buz'],
      settings: { ses: true, muzik: false, titresim: true, tema: 'koyu' },
      devam: { level: 3, board: tahta, score: 0, moves: 1, obj: { type: 'score', target: 99999, color: null, current: 0 }, ayar: { type: 'score', target: 99999, moves: 18, ncolors: 4, ice: 0, chains: 0, stones: 0, stoneHp: 1 }, ikiKat: 0, uyarildi: true, mod: 'bolum', tarih: '__BUGUN__' },
    };
    const { ctx, sayfa, hatalar } = await sayfaAc(tarayici, kayit);
    kontrol(await hamleYap(sayfa), 'son hamle yapıldı');
    await bekle(800);
    kontrol(await sayfa.locator('text=Hamleler Bitti').count(), 'kaybetme penceresi');
    await sayfa.screenshot({ path: path.join(CIKIS, '11-kaybetti.png') });
    await etiketli(sayfa, '5 hamle daha al').click();
    await bekle(300);
    kontrol((await hamleSayisi(sayfa)) === 5, '5 hamle eklendi');
    kontrol(/Mağaza, 60 altın/.test(await etiketli(sayfa, 'Mağaza,').getAttribute('aria-label')), '40 altın düştü');
    tumHatalar.push(...hatalar);
    await ctx.close();
  }

  // 4) Kazanma: yildiz, altin; gunluk bulmaca kazanma ve seri
  for (const mod of ['bolum', 'gunluk']) {
    const tahta = JSON.parse(fs.readFileSync(path.join(PAKET, 'ornek-tahta.json'), 'utf8'));
    const kayit = {
      level: 3,
      enYuksek: 3,
      ogretici: true,
      altin: 50,
      tanitimlar: ['buz'],
      gb: { cozulen: mod === 'gunluk' ? 'dun' : '', seri: 2 },
      settings: { ses: true, muzik: false, titresim: true, tema: 'koyu' },
      devam: { level: 3, board: tahta, score: 0, moves: 15, obj: { type: 'score', target: 1, color: null, current: 0 }, ayar: { type: 'score', target: 1, moves: 18, ncolors: 4, ice: 0, chains: 0, stones: 0, stoneHp: 1 }, ikiKat: 0, uyarildi: false, mod, gunlukL: 10, tarih: '__BUGUN__' },
    };
    const { ctx, sayfa, hatalar } = await sayfaAc(tarayici, kayit);
    kontrol(await hamleYap(sayfa), `${mod}: kazandıran hamle`);
    await bekle(2600);
    if (mod === 'bolum') {
      kontrol(await sayfa.locator('text=Bölüm 3 Tamamlandı!').count(), 'kazanma penceresi');
      kontrol(await sayfa.locator('[aria-label="3 yıldız"]').count(), '3 yıldız');
      kontrol(await sayfa.locator('[aria-label="25 altın kazandın"]').count(), '25 altın kazanıldı');
      await sayfa.screenshot({ path: path.join(CIKIS, '12-kazandi.png') });
      await etiketli(sayfa, 'Devam, Bölüm 4').click();
      await bekle(500);
      kontrol(await sayfa.locator('[aria-label="Bölüm 4"]').count(), 'Bölüm 4 başladı');
    } else {
      kontrol(await sayfa.locator('text=Günlük Bulmaca Çözüldü!').count(), 'günlük bulmaca kazanma penceresi');
      await sayfa.screenshot({ path: path.join(CIKIS, '13-gunluk-kazandi.png') });
      const k = JSON.parse(await sayfa.evaluate(() => localStorage.getItem('taslarpro-kayit-v1')));
      kontrol(k.gb.seri === 1 && k.altin === 50 + 45, `seri ve altın kaydedildi (seri ${k.gb.seri}, altın ${k.altin})`);
    }
    tumHatalar.push(...hatalar);
    await ctx.close();
  }

  // 5) Acik tema ve hareketi azalt
  {
    const kayit = { level: 1, enYuksek: 1, ogretici: true, settings: { ses: true, muzik: false, titresim: true, tema: 'acik', azHareket: true, hizli: true } };
    const { ctx, sayfa, hatalar } = await sayfaAc(tarayici, kayit);
    await sayfa.screenshot({ path: path.join(CIKIS, '14-acik-tema.png') });
    kontrol(await hamleYap(sayfa), 'açık tema / hareketi azalt ile hamle');
    tumHatalar.push(...hatalar);
    await ctx.close();
  }

  await tarayici.close();
  if (tumHatalar.length) {
    console.log('Tarayıcı hataları:');
    [...new Set(tumHatalar)].forEach((h) => console.log('  ' + h));
  }
  console.log(hata === 0 && !tumHatalar.length ? 'WEB DENEMESI GECTI' : `${hata} kontrol hatası, ${tumHatalar.length} tarayıcı hatası`);
  process.exit(hata || tumHatalar.length ? 1 : 0);
})();
