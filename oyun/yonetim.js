// Aşama 12: ekolojik yönetim (karar 64) ve nesli tükenme tehlikesindeki türler için uzun vadeli hedefler (karar 65).
// Saf mantık. Eylemlerin etkisi ekosistem.js içinde okunur: eko.istilaci (otlak kapasitesi), eko.kontrolluYakmaYil (yangın riski),
// eko.goletRestore (buharlaşma). Sayılar ÖNERİDİR.
import * as M from './mantik.js';
import * as E from './ekosistem.js';
import { TURLER, TUR_SIRASI } from './veri.js';

const lira = (n) => `${Math.round(n).toLocaleString('tr-TR')} lira`;
const gunu = (k) => M.gunNo(k.dk);

// IUCN Kırmızı Liste durumu (Doğu Afrika'daki alt türlere göre, 2026 bilgisiyle; yalnızca bilgi)
export const IUCN = {
  aslan: 'VU', leopar: 'VU', sirtlan: 'LC', fil: 'EN', zurafa: 'VU', zebra: 'NT', ceylan: 'NT', domuz: 'LC', suAygiri: 'VU', timsah: 'LC',
  gergedan: 'CR', kartal: 'LC', piton: 'LC', manda: 'NT', gnu: 'LC', cita: 'VU', impala: 'LC', yabanKopegi: 'EN', babun: 'LC',
  kutupAyisi: 'VU', halkaliFok: 'LC', mors: 'VU', beluga: 'LC', renGeyigi: 'VU', miskOkuzu: 'LC', kutupKurdu: 'LC', kutupTilkisi: 'LC', kutupTavsani: 'LC',
};
export const IUCN_ADI = { LC: 'düşük riskli', NT: 'tehdide yakın', VU: 'hassas', EN: 'tehlikede', CR: 'kritik tehlikede' };
export const TEHDITLI = TUR_SIRASI.filter((t) => ['VU', 'EN', 'CR'].includes(IUCN[t]));
export const iucnSozu = (tur) => (IUCN[tur] ? `Kırmızı Liste: ${IUCN_ADI[IUCN[tur]]}` : '');

export function yonetimAlani(k) {
  if (!k.yonetim || typeof k.yonetim !== 'object') k.yonetim = {};
  const y = k.yonetim;
  if (!y.taban || typeof y.taban !== 'object' || Array.isArray(y.taban)) y.taban = {};
  for (const [t, n] of Object.entries(y.taban)) if (!TURLER[t] || !Number.isFinite(n)) delete y.taban[t];
  if (!Array.isArray(y.raporlar)) y.raporlar = [];
  y.raporlar = y.raporlar.filter((r) => r && Number.isFinite(r.yil) && Array.isArray(r.satirlar)).slice(0, 10);
  if (!Number.isFinite(y.yil)) y.yil = 0;
  if (!Number.isFinite(y.temizlenen)) y.temizlenen = 0;
  const eko = k.eko;
  if (eko) {
    // İstilacı lantana: yeni oyunda ya da eski kayıtta bir kez, otlak ve akasyalık hücrelerinin bir kısmına yerleşir
    if (!eko.istilaci || typeof eko.istilaci !== 'object' || Array.isArray(eko.istilaci)) {
      eko.istilaci = {};
      if (!y.istilaciKuruldu) {
        let tohum = 4242;
        const r = () => ((tohum = (tohum * 16807) % 2147483647) / 2147483647);
        for (let h = 0; h < (eko.ot || []).length; h++) {
          const m = E.hucreMerkezi(h);
          const b = M.bolgeBul(m.x, m.y);
          if ((b === 'otlak' || b === 'agaclik') && Math.hypot(m.x, m.y) < 185 && r() < 0.14) eko.istilaci[h] = 1;
        }
      }
    }
    for (const h of Object.keys(eko.istilaci)) if (!(h >= 0 && h < (eko.ot || []).length)) delete eko.istilaci[h];
    y.istilaciKuruldu = true;
  }
  return y;
}

const canliSayisi = (k, tur) => k.hayvanlar.filter((b) => !b.olu && b.tur === tur).length;

// ---------- Yönetim eylemleri ----------
export const EYLEMLER = {
  istilaci: { ad: 'İstilacı bitki temizliği', ucret: 1500, tarif: 'Bulunduğun yerdeki lantana çalılarını işçilerle söküp yakarsın. Lantana Güney Amerika\'dan gelmiş, otlakları boğan, otçulların yemediği zehirli bir çalıdır. Temizlenen yerde ot yeniden gürleşir.' },
  yakma: { ad: 'Kontrollü erken yakma', ucret: 1000, tarif: 'Kurak mevsimin ilk günlerinde, otlar henüz tam kurumamışken, rüzgârsız bir günde küçük parçalar hâlinde planlı yakma. Kuru yakıt azalır; büyük ve yıkıcı yangın olasılığı o yıl düşer. Yanan yerde taze sürgünler çıkar.' },
  golet: { ad: 'Gölet restorasyonu', ucret: 4000, tarif: 'Gölette biriken çamur temizlenip kıyısına gölge veren yerli ağaçlar dikilir. Gölet kurak mevsimde daha geç kurur; hayvanların su başında sıkışması azalır. Bir kez yapılır.' },
};

// Bulunduğun hücre
const oyuncuHucresi = (d) => E.hucre(d.oyuncu.x, d.oyuncu.y);

export function eylemDurumu(d, id) {
  const k = d.k;
  const eko = k.eko;
  const e = EYLEMLER[id];
  if (!e || !eko) return { yapilir: false, neden: 'Bu eylem şu an yapılamaz.' };
  if (k.magara) return { yapilir: false, neden: 'Önce savana dön.' };
  if (id === 'istilaci') {
    const h = oyuncuHucresi(d);
    if (!(h >= 0) || !eko.istilaci || !eko.istilaci[h]) {
      const kalan = Object.keys(eko.istilaci || {}).length;
      return { yapilir: false, neden: kalan ? `Bulunduğun yerde lantana yok. Lantanalı ${kalan} alan kaldı; Ekosistem haritasında ya da aşağıdaki listede yazılı.` : 'Bölgedeki bütün lantanalar temizlendi.' };
    }
  }
  if (id === 'yakma') {
    const tk = E.takvim(gunu(k));
    if (tk.mevsim !== 'kurak' || tk.mevsimGunu > 5) return { yapilir: false, neden: 'Kontrollü yakma yalnızca kurak mevsimin ilk beş gününde yapılır; sonra otlar fazla kurur, yangın kontrolden çıkar.' };
    if (eko.kontrolluYakmaYil === tk.yil) return { yapilir: false, neden: 'Bu yıl kontrollü yakma yapıldı.' };
    if (eko.hava && eko.hava.tur === 'sicak') return { yapilir: false, neden: 'Bugün hava çok sıcak; ateş kontrolden çıkabilir. Daha serin bir gün bekle.' };
    if (eko.yagmurVar) return { yapilir: false, neden: 'Yağmur yağıyor; otlar yanmaz.' };
  }
  if (id === 'golet' && eko.goletRestore) return { yapilir: false, neden: 'Gölet restorasyonu yapıldı.' };
  if (k.butce < e.ucret) return { yapilir: false, neden: `Bütçe yetmiyor; ${lira(e.ucret)} gerekli.` };
  return { yapilir: true, neden: '' };
}

export function eylemYap(d, id) {
  const k = d.k;
  const eko = k.eko;
  const e = EYLEMLER[id];
  const dur = eylemDurumu(d, id);
  if (!dur.yapilir) return dur.neden;
  k.butce -= e.ucret;
  const y = yonetimAlani(k);
  let m = '';
  if (id === 'istilaci') {
    const h = oyuncuHucresi(d);
    delete eko.istilaci[h];
    y.temizlenen += 1;
    M.itibarEkle(d, 2);
    const kalan = Object.keys(eko.istilaci).length;
    m = `İşçiler lantana çalılarını söküp yaktı. Bu otlak birkaç günde gürleşecek. ${kalan ? `Lantanalı ${kalan} alan kaldı.` : 'Bölgede lantana kalmadı!'}`;
  } else if (id === 'yakma') {
    const tk = E.takvim(gunu(k));
    eko.kontrolluYakmaYil = tk.yil;
    // Birkaç kuru otlak hücresi yanık sayılır: ot düşer, sonra hızla sürer
    let n = 0;
    if (!eko.yanik || typeof eko.yanik !== 'object') eko.yanik = {};
    for (let h = 0; h < eko.ot.length && n < 6; h++) {
      const c = E.hucreMerkezi(h);
      if (M.bolgeBul(c.x, c.y) === 'otlak' && eko.ot[h] > 0.4 && (h * 7) % 5 === 0) {
        eko.ot[h] *= 0.25;
        eko.yanik[h] = k.dk;
        n++;
      }
    }
    M.itibarEkle(d, 3);
    m = `Korucularla birlikte ${n} küçük otlak parçası kontrollü olarak yakıldı. Bu yıl büyük bir yangın olasılığı çok düştü; yanan yerlerde birkaç gün içinde taze sürgünler çıkacak ve otçullar oraya gelecek.`;
  } else if (id === 'golet') {
    eko.goletRestore = true;
    M.itibarEkle(d, 5);
    m = 'Göletin dibindeki çamur temizlendi, kıyısına yerli akasya ve incir fidanları dikildi. Gölet bundan sonra kurak mevsimde daha geç kuruyacak.';
  }
  M.arsivOlay(d, `Yönetim: ${e.ad}.`);
  M.olay(d, 'yonetim', m, 3);
  return m;
}

// Lantanalı alanlar (en yakından)
export function istilaciSatirlari(d) {
  const eko = d.k.eko;
  return Object.keys((eko && eko.istilaci) || {})
    .map((h) => ({ h: +h, p: E.hucreMerkezi(+h) }))
    .sort((a, b) => M.mesafe(d.oyuncu, a.p) - M.mesafe(d.oyuncu, b.p));
}

// ---------- Nüfus dengesi raporu ----------
export function nufusSatirlari(d) {
  const k = d.k;
  const y = yonetimAlani(k);
  const eko = k.eko;
  const satirlar = [];
  // Otlak yükü: toplam ot / otçul sayısı
  const otcul = k.hayvanlar.filter((b) => !b.olu && !TURLER[b.tur].yirtici && !['timsah', 'piton', 'kartal'].includes(b.tur)).length;
  const yirtici = k.hayvanlar.filter((b) => !b.olu && TURLER[b.tur].yirtici).length;
  const ot = eko && eko.ot ? eko.ot.reduce((a, b) => a + b, 0) / eko.ot.length : 0;
  const yuk = otcul / Math.max(1, ot * 100);
  satirlar.push(`Otçul ${otcul}, yırtıcı ${yirtici}. Ortalama otlak ${Math.round(ot * 100)} birim. ${yuk > 1.6 ? 'Otlak aşırı yükte; kurak mevsimde açlık ölümleri artabilir.' : yuk > 1 ? 'Otlak yükü yüksek ama dengede.' : 'Otlak rahat; otçullara yetecek ot var.'}`);
  if (otcul && yirtici / otcul > 0.35) satirlar.push('Yırtıcı oranı yüksek: av hayvanları azalabilir, yırtıcılar başka bölgelere dağılabilir.');
  for (const t of TEHDITLI) {
    const n = canliSayisi(k, t);
    const taban = y.taban[t];
    const fark = taban !== undefined ? n - taban : null;
    satirlar.push(`${M.BuyukHarf(M.SOZ[t])}, ${IUCN_ADI[IUCN[t]]}: ${n} birey${fark === null ? '' : fark === 0 ? ', yıl başındaki kadar' : fark > 0 ? `, yıl başından beri ${fark} artış` : `, yıl başından beri ${-fark} kayıp`}.`);
  }
  return satirlar;
}

// ---------- Yıllık koruma raporu (karar 65) ----------
// Yıl başında tehditli türlerin nüfusu kaydedilir; yıl dönünce karşılaştırılır. Korunan her tür itibar ve fon getirir.
function yilDenetle(d) {
  const k = d.k;
  const y = k.yonetim;
  const yil = E.takvim(gunu(k)).yil;
  if (y.yil === yil) return;
  if (y.yil > 0 && Object.keys(y.taban).length) {
    const satirlar = [];
    let korunan = 0;
    for (const t of TEHDITLI) {
      if (y.taban[t] === undefined) continue;
      const n = canliSayisi(k, t);
      const ok = n >= y.taban[t];
      if (ok) korunan++;
      satirlar.push(`${M.SOZ[t]} ${y.taban[t]} → ${n}${ok ? '' : ', azaldı'}`);
    }
    const fon = korunan * 800;
    if (korunan) {
      M.itibarEkle(d, korunan * 3);
      k.butce += fon;
    }
    y.raporlar.unshift({ yil: y.yil, korunan, toplam: satirlar.length, satirlar });
    if (y.raporlar.length > 10) y.raporlar.length = 10;
    const m = `Yıllık koruma raporu, ${y.yil}. yıl: tehdit altındaki ${satirlar.length} türün ${korunan} tanesinin nüfusu korundu ya da arttı. ${satirlar.join('; ')}.${fon ? ` Uluslararası koruma fonundan ${lira(fon)} geldi.` : ''}`;
    M.mesajEkle(k, m, korunan ? 'gelir' : 'bilgi');
    M.arsivOlay(d, `Yıllık koruma raporu: ${korunan} / ${satirlar.length} tür korundu.`);
    M.olay(d, 'yonetim', m, 3);
  }
  y.yil = yil;
  for (const t of TEHDITLI) y.taban[t] = canliSayisi(k, t);
}
export const raporSatirlari = (k) => ((k.yonetim && k.yonetim.raporlar) || []).map((r) => `${r.yil}. yıl: ${r.korunan} / ${r.toplam} tür korundu. ${r.satirlar.join('; ')}.`);

let sayac = 0;
export function guncelle(d, dt) {
  sayac += dt;
  if (sayac < 4) return;
  sayac = 0;
  if (!d._yonetimOnarildi) {
    yonetimAlani(d.k);
    d._yonetimOnarildi = true;
  }
  yilDenetle(d);
}

// ---------- Göç takibi (karar 101): göç geçmişi, bölgede olup olmama, kayıplar, GPS ----------
export function gocSatirlari(d) {
  const k = d.k;
  const l = [];
  const gocler = ((k.eko && k.eko.gocler) || []).filter((g) => g && TURLER[g.tur] && Number.isFinite(g.gun));
  for (const tur of Object.keys(E.GOCMENLER)) {
    const disarida = ((k.disari && k.disari.gruplar) || []).some((g) => g && g.tur === tur);
    const gocte = k.gruplar.some((g) => g.tur === tur && g.goc);
    const kendi = gocler.filter((g) => g.tur === tur);
    const cikis = kendi.find((g) => g.olay === 'cikis');
    const donus = kendi.find((g) => g.olay === 'donus');
    const kayip = kendi.filter((g) => g.olay === 'donus').reduce((a, g) => a + (Number.isFinite(g.kayip) ? g.kayip : 0), 0);
    const yeni = kendi.filter((g) => g.olay === 'donus').reduce((a, g) => a + (Number.isFinite(g.yeni) ? g.yeni : 0), 0);
    const durum = gocte ? 'şu an göç yolunda, nehre doğru' : disarida ? 'göçte, bölgenin dışında' : 'bölgede';
    let m = `${M.BuyukHarf(M.SOZ[tur])}: ${durum}.`;
    const gAdi = (x) => (x === -60 ? ', batı geçidinden' : x === 70 ? ', doğu geçidinden' : '');
    if (cikis) m += ` Son çıkış ${cikis.gun}. gün, ${cikis.sayi} birey${gAdi(cikis.gecit)}.`;
    if (donus) m += ` Son dönüş ${donus.gun}. gün, ${donus.sayi} birey${gAdi(donus.gecit)}.`;
    const yollar = [...new Set(kendi.filter((g) => Number.isFinite(g.gecit)).map((g) => g.gecit))];
    if (yollar.length > 1) m += ' Bu tür farklı göçlerde iki geçidi de kullandı; göç yolu koşullara göre değişiyor.';
    const NA = { avci: 'avcılar', susuzluk: 'susuzluk', hastalik: 'hastalık', zayiflik: 'açlık', insan: 'insan faaliyetleri' };
    const top = {};
    kendi.filter((g) => g.olay === 'donus' && g.nedenler && typeof g.nedenler === 'object').forEach((g) => Object.keys(g.nedenler).forEach((a) => NA[a] && Number.isFinite(g.nedenler[a]) && (top[a] = (top[a] || 0) + g.nedenler[a])));
    if (Object.keys(top).length) m += ` Göç kayıplarının tahmini nedenleri: ${Object.keys(top).map((a) => `${NA[a]} ${top[a]}`).join(', ')}.`;
    if (kayip || yeni) m += ` Göçlerde toplam ${kayip} kayıp, ${yeni} yeni doğan.`;
    if (!cikis && !donus) m += ' Henüz göç kaydı yok; kurak mevsimde bölgeden ayrılırlar.';
    l.push(m);
  }
  const gps = (k.gpsli || []).map((id) => k.hayvanlar.find((b) => b.id === id) || ((k.disari && k.disari.hayvanlar) || []).find((b) => b && b.id === id)).filter((b) => b && E.GOCMENLER[b.tur]);
  if (gps.length) l.push(`GPS tasmalı göçmenler: ${gps.map((b) => M.bireyAdi(b)).join(', ')}. Konumları Yerler menüsünde.`);
  else l.push('Göç yollarını izlemenin en iyi yolu göçmen bir türe GPS tasması taktırmak; kamera tuzakları ve geçit sayımları da göçün ne zaman geçtiğini gösterir.');
  return l;
}
