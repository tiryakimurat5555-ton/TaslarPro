// ==== VAHŞİ YAŞAM: KUTUP HARİTALARI (Kuzey Kutbu ve Antarktika) ====
// Brif karar 16 ("sonradan kutup ekosistemi eklenebilir") ve 17 (büyük harita + ayrı bölümler). Savanla aynı dünya koordinatlarında,
// ama çok uzakta, kendi coğrafyası, mevsimi, ışığı ve havası olan iki harita:
//   KUZEY: kuzeydoğu Grönland kıyısı (KUTUP merkezi, y +6000). Kuzeyde deniz, güneyde tundra.
//   GUNEY: Antarktika, Adélie Kıyısı (ANTARKTIKA merkezi, y -6000). Kuzeyde Güney Okyanusu, güneyde kıta buz örtüsü; mevsimleri
//          kuzeyin tersidir (12 gün kaydırılmış): kuzeyde yaz iken Antarktika'da kıştır.
// Her harita aynı arayüzü sunar (haritaYap). Konum alan işlevler (yuzey, bolge, sudaMi...) noktanın hangi haritada olduğunu kendisi bulur;
// yalnız zaman alan işlevlerin (isik, evre, buzKenari, kutupTakvim...) üst düzey sürümleri Kuzey içindir: Antarktika için harita(p).isik(dk).
// Saf modül: yalnızca veri.js ve ekosistem.js'i kullanır. Sayılar ÖNERİDİR.
import { KUTUP, ANTARKTIKA, AVUSTRALYA, HINDISTAN, MOGOLISTAN, AMAZON, YELLOWSTONE, BORNEO, MADAGASKAR } from './veri.js';
import { YIL_GUN } from './ekosistem.js';

function haritaYap(c) {
  const M = c.merkez;
  const H = { ad: c.ad, baslik: c.baslik, MERKEZ: M, kayma: c.kayma || 0, sicak: !!c.sicak, aurora: c.aurora !== false };
  H.ek = !!c.ek;
  H.kar = !!c.kar;
  H.icinde = (x, y) => Number.isFinite(y) && Math.abs(y - M.y) < 600 && Math.abs(x - M.x) < 600;
  H.noktaMi = (p) => !!p && H.icinde(p.x, p.y);
  H.yerel = (p) => ({ x: p.x - M.x, y: p.y - M.y });
  H.dunya = (lx, ly) => ({ x: M.x + lx, y: M.y + ly });
  H.kiyiY = c.kiyiY;
  H.ISTASYON_K = c.ISTASYON_K;
  H.BUZUL = c.BUZUL;
  H.POLINYA = c.POLINYA;
  Object.assign(H, c.ozel || {});
  // ---------- Takvim ----------
  H.MEVSIM_ADI = c.MEVSIM_ADI;
  H.kutupTakvim = (gun) => {
    const yg = ((((gun - 1 + H.kayma) % YIL_GUN) + YIL_GUN) % YIL_GUN) + 1;
    if (yg <= 8) return { mevsim: 'yaz', mevsimGunu: yg, uzunluk: 8, yilGunu: yg };
    if (yg <= 12) return { mevsim: 'sonbahar', mevsimGunu: yg - 8, uzunluk: 4, yilGunu: yg };
    if (yg <= 20) return { mevsim: 'kis', mevsimGunu: yg - 12, uzunluk: 8, yilGunu: yg };
    return { mevsim: 'ilkbahar', mevsimGunu: yg - 20, uzunluk: 4, yilGunu: yg };
  };
  H.yilKonumu = (dk) => {
    const g = dk / 1440 + H.kayma;
    return ((g % YIL_GUN) + YIL_GUN) % YIL_GUN;
  };
  // Gün ışığı süresi (saat): yazın 24, kışın 0 (Antarktika kıyısında kışın da öğleye doğru kısa bir alacakaranlık olur)
  H.gunIsigiSaat = (dk) => {
    const f = H.yilKonumu(dk);
    if (c.gunIsigi) return c.gunIsigi(f);
    if (f < 8) return 24;
    if (f < 12) return 24 * (1 - (f - 8) / 4);
    if (f < 20) return 0;
    return (24 * (f - 20)) / 4;
  };
  H.isik = (dk) => {
    const L = H.gunIsigiSaat(dk);
    const s = (((dk % 1440) + 1440) % 1440) / 60;
    const ogle = Math.cos(((s - 12) / 24) * Math.PI * 2);
    if (L >= 23.9) return 0.78 + 0.18 * ogle;
    if (L <= 0.1) {
      const f = H.yilKonumu(dk);
      const derinlik = Math.min(1, Math.min(f - 12, 20 - f) / 3);
      return Math.max(0.03, 0.03 + (0.2 - 0.17 * derinlik) * Math.max(0, ogle));
    }
    const yarim = L / 2;
    const fark = Math.abs(s - 12);
    if (fark < yarim - 1) return Math.min(1, 0.5 + 0.5 * Math.min(1, (yarim - 1 - fark) / 3));
    if (fark < yarim + 1) return 0.12 + (0.38 * (yarim + 1 - fark)) / 2;
    return 0.06;
  };
  H.evre = (dk) => {
    const l = H.isik(dk);
    const s = (((dk % 1440) + 1440) % 1440) / 60;
    if (l >= 0.5) return 'gunduz';
    if (l >= 0.12) return s < 12 ? 'safak' : 'aksam';
    return 'gece';
  };
  H.isikSozu = (dk) => {
    if (c.isikSozu) return c.isikSozu(H, dk);
    const t = H.kutupTakvim(Math.floor(dk / 1440) + 1);
    const L = H.gunIsigiSaat(dk);
    const l = H.isik(dk);
    const ufuk = c.ad === 'guney' ? 'kuzey' : 'güney'; // kutup gecesinde alacakaranlık ekvatora bakan ufukta
    if (L >= 23.9) return l < 0.7 ? 'Gece yarısı güneşi ufkun hemen üstünde, her şey turuncu bir ışığa boğulmuş; güneş hiç batmıyor.' : 'Güneş gökyüzünde; kutup yazında hiç batmıyor.';
    if (L <= 0.1) return l > 0.08 ? `Kutup gecesi; öğle olmasına rağmen ${ufuk} ufkunda yalnızca soluk mavi bir alacakaranlık var.` : 'Kutup gecesi: güneş haftalardır doğmadı, her yer karanlık. Kar yıldızların ve ayın ışığıyla soluk parlıyor.';
    if (l >= 0.5) return `${t.mevsim === 'ilkbahar' ? 'Güneş kutup gecesinden sonra yeniden yükseliyor; günler hızla uzuyor.' : 'Güneş alçakta ilerliyor; günler hızla kısalıyor.'}`;
    if (l >= 0.12) return 'Güneş ufkun hemen altında; uzun bir kutup alacakaranlığı.';
    return 'Karanlık; kutup gecesi yaklaşıyor.';
  };
  // ---------- Deniz buzu ----------
  H.buzKenari = (dk) => {
    if (c.buzYok) return 9999;
    const f = H.yilKonumu(dk);
    let acik;
    if (f < 8) acik = 45 + (f / 8) * 120;
    else if (f < 12) acik = 165 - ((f - 8) / 4) * 175;
    else if (f < 20) acik = -10;
    else acik = -10 + ((f - 20) / 4) * 55;
    return c.buzTaban + acik;
  };
  H.polinyadaMi = (lx, ly, pay = 0) => Math.hypot(lx - H.POLINYA.lx, ly - H.POLINYA.ly) < H.POLINYA.r + pay;
  H.yuzey = (x, y, dk) => {
    const lx = x - M.x;
    const ly = y - M.y;
    if (c.yuzey) return c.yuzey(H, lx, ly, dk);
    if (ly <= H.kiyiY(lx)) return 'kara';
    if (H.polinyadaMi(lx, ly)) return 'su';
    return ly > H.buzKenari(dk) ? 'buz' : 'su';
  };
  H.sudaMi = (x, y, dk) => H.yuzey(x, y, dk) === 'su';
  H.karadaMi = (x, y) => y - M.y <= H.kiyiY(x - M.x);
  H.enYakinSu = (x, y, dk, delik) => {
    if (c.enYakinSu) return c.enYakinSu(H, x, y, dk);
    const lx = x - M.x;
    const aday = [];
    const bk = H.buzKenari(dk);
    const kenarY = Math.max(H.kiyiY(lx) + 2, bk - 2);
    if (kenarY < M.r - 5) aday.push(H.dunya(lx, kenarY));
    aday.push(H.dunya(H.POLINYA.lx, H.POLINYA.ly));
    if (delik) aday.push(delik);
    aday.sort((a, b) => Math.hypot(a.x - x, a.y - y) - Math.hypot(b.x - x, b.y - y));
    return aday[0];
  };
  // ---------- Bölgeler ve yerler ----------
  H.BOLGE_ADLARI_K = c.BOLGE_ADLARI_K;
  H.bolge = (x, y, dk) => c.bolge(H, x - M.x, y - M.y, dk);
  H.KUTUP_YERLER = c.YERLER;
  H.yerKonumu = (y) => H.dunya(y.lx, y.ly);
  H.istasyonBolgesi = c.istasyonBolgesi;
  // ---------- Hava ----------
  H.havaUret = (gun, rng) => {
    if (c.havaUret) return c.havaUret(H, gun, rng);
    const t = H.kutupTakvim(gun);
    const [a, b] = c.SICAKLIK[t.mevsim];
    const sicaklik = Math.round(a + rng() * (b - a));
    const r = rng();
    let tur = 'acik';
    if (r < c.TIPI_SANSI[t.mevsim]) tur = 'tipi';
    else if (t.mevsim === 'yaz' && r < 0.25) tur = 'sis';
    else if (r < 0.45) tur = 'bulutlu';
    else if (t.mevsim !== 'yaz' && r < 0.62) tur = 'kar';
    const h = { gun, tur, sicaklik, ruzgarYon: c.ruzgarYon !== undefined && rng() < 0.6 ? c.ruzgarYon + (rng() - 0.5) * 0.6 : rng() * Math.PI * 2, ruzgarHiz: tur === 'tipi' ? 3.4 : 0.5 + rng() * 1.6 };
    if (tur === 'tipi') {
      const bas = Math.floor(rng() * 16) * 60;
      h.tipi = { bas, bit: bas + 240 + Math.floor(rng() * 360) };
    }
    return h;
  };
  H.tipideMi = tipideMi;
  H.gorusCarpani = gorusCarpani;
  H.havaSozu = (h, dk) => (c.havaSozu ? c.havaSozu(h, dk) : havaSozuGenel(h, dk, c.ad));
  // Kutup haritasında tek tip "otçul besin" değeri (bitki örtüsü mevsime göre)
  H.tundraBesin = (dk, h) => {
    if (c.besin) return c.besin(H, dk, h);
    const t = H.kutupTakvim(Math.floor(dk / 1440) + 1).mevsim;
    const taban = { yaz: 0.9, sonbahar: 0.6, kis: 0.3, ilkbahar: 0.38 }[t];
    return taban * (tipideMi(h, dk) ? 0.5 : 1);
  };
  // ---------- Deniz buzu kalınlığı (araştırma ölçümü) ----------
  H.buzKalinligi = (x, y, dk, isinma = 0) => {
    const lx = x - M.x;
    const ly = y - M.y;
    const f = H.yilKonumu(dk);
    let cm;
    if (f >= 10.5 && f < 20) cm = 15 + (f - 10.5) * 16.5;
    else if (f >= 20) cm = 172 - (f - 20) * 28;
    else if (f < 8) cm = 260 - f * 4;
    else cm = 230;
    if (ly - H.kiyiY(lx) < 25) cm *= 1.15;
    const mp = Math.hypot(lx - H.POLINYA.lx, ly - H.POLINYA.ly) - H.POLINYA.r;
    if (mp < 25) cm *= 0.35 + (0.65 * Math.max(0, mp)) / 25;
    cm -= isinma * 9;
    return Math.max(5, Math.round(cm));
  };
  return H;
}

// ---------- Ortak hava yardımcıları ----------
export const tipideMi = (h, dk) => !!(h && h.tur === 'tipi' && h.tipi && (dk % 1440) >= h.tipi.bas && (dk % 1440) < h.tipi.bit);
export function gorusCarpani(h, dk) {
  if (!h) return 1;
  if (tipideMi(h, dk)) return 0.32;
  if (h.tur === 'sis') return 0.55;
  if (h.tur === 'kar') return 0.75;
  if (h.tur === 'yagmurlu') return 0.75;
  if (h.tur === 'toz') return 0.45;
  return 1;
}
function havaSozuGenel(h, dk, ad) {
  if (!h) return '';
  const derece = `${h.sicaklik < 0 ? 'eksi ' + -h.sicaklik : h.sicaklik} derece`;
  const r = h.ruzgarHiz > 2.5 ? 'sert' : h.ruzgarHiz > 1.2 ? 'orta' : 'hafif';
  if (tipideMi(h, dk)) return ad === 'guney' ? `Kar fırtınası var: buz örtüsünden inen katabatik rüzgâr uğulduyor, savrulan kar görüşü birkaç metreye indiriyor. Hava ${derece}.` : `Tipi var: rüzgâr uğulduyor, savrulan kar görüşü birkaç metreye indiriyor. Hava ${derece}, rüzgârla hissedilen çok daha soğuk.`;
  const t = { acik: 'Hava açık', bulutlu: 'Gökyüzü bulutlu', sis: 'Deniz sisi kıyıyı örtmüş', kar: 'Hafif kar yağıyor', tipi: 'Gün içinde kar fırtınası bekleniyor' }[h.tur];
  return `${t}, ${derece}, ${r} rüzgâr.`;
}
export const buzSozu = (cm) => (cm < 10 ? 'çok ince, üstünde yürümek tehlikeli' : cm < 30 ? 'ince ve esnek' : cm < 80 ? 'orta kalınlıkta' : cm < 150 ? 'kalın' : 'çok kalın, eski buz');

// =====================================================================
// KUZEY KUTBU: kuzeydoğu Grönland kıyısı
// =====================================================================
const kiyiYK = (lx) => 40 + 9 * Math.sin(lx / 38) + 5 * Math.sin(lx / 13 + 1);
const KUS_YARI_K = { lx: 168, ly: 22, r: 26 };
const POLINYA_K = { lx: 70, ly: 150, r: 15 };
const ISTASYON_KK = { lx: 0, ly: -150, r: 9 };
const BUZUL_K = { lx0: -230, lx1: -150 };
const MORS_KIYISI_K = { lx: 120, ly: kiyiYK(120) - 4 };
export const KUZEY = haritaYap({
  ad: 'kuzey',
  baslik: 'Kuzey Kutbu',
  merkez: KUTUP,
  kayma: 0,
  kiyiY: kiyiYK,
  buzTaban: 44,
  ISTASYON_K: ISTASYON_KK,
  BUZUL: BUZUL_K,
  POLINYA: POLINYA_K,
  ozel: { KUS_YARI: KUS_YARI_K, MORS_KIYISI: MORS_KIYISI_K, FOK_KIYISI: MORS_KIYISI_K },
  MEVSIM_ADI: { yaz: 'kutup yazı', sonbahar: 'sonbahar', kis: 'kutup kışı', ilkbahar: 'ilkbahar' },
  BOLGE_ADLARI_K: { kutupIstasyon: 'Araştırma kulübesi', tundra: 'Tundra', kiyi: 'Kıyı', buz: 'Deniz buzu', acikSu: 'Açık su', buzul: 'Buzul', kusYari: 'Kuş yarları', polinya: 'Polinya' },
  istasyonBolgesi: 'kutupIstasyon',
  bolge(H, lx, ly, dk) {
    if (Math.hypot(lx - ISTASYON_KK.lx, ly - ISTASYON_KK.ly) < ISTASYON_KK.r + 12) return 'kutupIstasyon';
    if (Math.hypot(lx - KUS_YARI_K.lx, ly - KUS_YARI_K.ly) < KUS_YARI_K.r) return 'kusYari';
    if (lx < BUZUL_K.lx1 && ly <= kiyiYK(lx) + 25) return 'buzul';
    if (H.polinyadaMi(lx, ly, 4) && ly > kiyiYK(lx)) return 'polinya';
    if (ly > kiyiYK(lx)) return ly > H.buzKenari(dk) ? 'buz' : 'acikSu';
    if (ly > kiyiYK(lx) - 16) return 'kiyi';
    return 'tundra';
  },
  YERLER: [
    { id: 'k_kulube', ad: 'Araştırma kulübesi', lx: 0, ly: -132, tarif: 'Zackenberg yakınlarında, tundranın ortasında küçük ahşap bir araştırma kulübesi. Isıtıcı, telsiz ve laboratuvar kutusu burada.' },
    { id: 'k_tundra', ad: 'Tundra vadisi', lx: -60, ly: -80, tarif: 'Yosun, liken, cüce söğüt ve kutup çiçekleriyle kaplı geniş bir vadi. Ren geyikleri ve misk öküzleri burada otlar.' },
    { id: 'k_kiyi', ad: 'Kıyı', lx: -10, ly: kiyiYK(-10) - 8, tarif: 'Çakıllı, rüzgâr savrulmuş bir kıyı. Kışın deniz buzu buraya dayanır, yazın küçük dalgalar buz parçalarını kıyıya vurur.' },
    { id: 'k_mors', ad: 'Mors kıyısı', lx: MORS_KIYISI_K.lx - 14, ly: MORS_KIYISI_K.ly - 12, tarif: 'Morsların karaya çıkıp sırt sırta yattığı çakıllı bir burun.' },
    { id: 'k_kusyari', ad: 'Kuş yarları', lx: KUS_YARI_K.lx - 30, ly: KUS_YARI_K.ly - 18, tarif: 'Denize dik inen kayalık yarlar. Yazın binlerce küçük alk ve üç parmaklı martı burada yuvalar.' },
    { id: 'k_buzul', ad: 'Buzul cephesi', lx: BUZUL_K.lx1 + 12, ly: 10, tarif: 'Batıda denize dökülen bir buzulun mavi buz duvarı. Arada bir buz kütleleri kopup denize düşer.' },
    { id: 'k_buz', ad: 'Deniz buzu', lx: -20, ly: 130, buz: true, tarif: 'Donmuş fiyordun düz, karlı yüzeyi. Halkalı foklar buzun altında nefes delikleri açar; kutup ayıları onları burada avlar.' },
    { id: 'k_polinya', ad: 'Polinya', lx: POLINYA_K.lx - 6, ly: POLINYA_K.ly - POLINYA_K.r - 6, buz: true, tarif: 'Akıntı ve rüzgârın kışın bile açık tuttuğu bir su gölü. Belugalar ve morslar kışı burada geçirir.' },
  ],
  SICAKLIK: { yaz: [2, 9], sonbahar: [-14, -3], kis: [-34, -20], ilkbahar: [-20, -8] },
  TIPI_SANSI: { yaz: 0.03, sonbahar: 0.18, kis: 0.25, ilkbahar: 0.18 },
});

// =====================================================================
// ANTARKTİKA: Adélie Kıyısı (Dumont d'Urville yakınları)
// Kuzeyde Güney Okyanusu, güneyde kıta buz örtüsü. Kıyı boyunca buzsuz kayalık bir şerit; doğuda Adélie penguenlerinin
// kayalık burnu, batıda denize uzanan buz sahanlığı. İmparator penguenler kışın kıyıya yapışık deniz buzunda ürer.
// =====================================================================
const kiyiTabanG = (lx) => 30 + 10 * Math.sin(lx / 45) + 4 * Math.sin(lx / 11 + 2);
// Batıda buz sahanlığı denize 45 metre taşar (yürünebilir buz düzlüğü; kenarı dik bir buz yarı)
const sahanlikPayi = (lx) => (lx < -150 ? 45 : lx < -120 ? (45 * (-120 - lx)) / 30 : 0);
const kiyiYG = (lx) => kiyiTabanG(lx) + sahanlikPayi(lx);
const ISTASYON_G = { lx: 0, ly: -70, r: 9 };
const KAYA_BURNU = { lx: 110, ly: 5, r: 34 };
const FILFOK_KIYISI = { lx: -40, ly: kiyiTabanG(-40) - 4 };
const IMPARATOR_KOLONISI = { lx: -70, ly: 95, r: 18 };
const POLINYA_G = { lx: 80, ly: 168, r: 16 };
const BUZ_ORTUSU_Y = -115; // bunun güneyi kıta buz örtüsü
export const GUNEY = haritaYap({
  ad: 'guney',
  baslik: 'Antarktika',
  merkez: ANTARKTIKA,
  kayma: 12,
  kiyiY: kiyiYG,
  buzTaban: 34,
  ISTASYON_K: ISTASYON_G,
  BUZUL: { lx0: -230, lx1: -120 },
  POLINYA: POLINYA_G,
  ruzgarYon: Math.PI, // katabatik rüzgâr buz örtüsünden, güneyden eser (rüzgârın geldiği yön)
  ozel: { KAYA_BURNU, FOK_KIYISI: FILFOK_KIYISI, MORS_KIYISI: FILFOK_KIYISI, IMPARATOR_KOLONISI, BUZ_ORTUSU_Y, sahanlikta: (lx) => lx < -120 },
  MEVSIM_ADI: { yaz: 'Antarktika yazı', sonbahar: 'sonbahar', kis: 'Antarktika kışı', ilkbahar: 'ilkbahar' },
  BOLGE_ADLARI_K: { antUs: 'Araştırma üssü', buzOrtusu: 'Kıta buz örtüsü', kayaBurnu: 'Kayalık burun', antKiyi: 'Kıyı', antBuz: 'Deniz buzu', antSu: 'Açık deniz', sahanlik: 'Buz sahanlığı', antPolinya: 'Polinya' },
  istasyonBolgesi: 'antUs',
  bolge(H, lx, ly, dk) {
    if (Math.hypot(lx - ISTASYON_G.lx, ly - ISTASYON_G.ly) < ISTASYON_G.r + 12) return 'antUs';
    if (Math.hypot(lx - KAYA_BURNU.lx, ly - KAYA_BURNU.ly) < KAYA_BURNU.r && ly <= kiyiYG(lx)) return 'kayaBurnu';
    if (lx < -120 && ly <= kiyiYG(lx) && ly > kiyiTabanG(lx) - 20) return 'sahanlik';
    if (H.polinyadaMi(lx, ly, 4) && ly > kiyiYG(lx)) return 'antPolinya';
    if (ly > kiyiYG(lx)) return ly > H.buzKenari(dk) ? 'antBuz' : 'antSu';
    if (ly < BUZ_ORTUSU_Y) return 'buzOrtusu';
    return 'antKiyi';
  },
  YERLER: [
    { id: 'a_us', ad: 'Araştırma üssü', lx: 0, ly: -52, tarif: 'Kayalık kıyı şeridinde, rüzgâra karşı sağlam bağlanmış kırmızı bir araştırma üssü. Isıtıcı, telsiz ve laboratuvar kutusu burada.' },
    { id: 'a_burun', ad: 'Adélie kolonisi', lx: KAYA_BURNU.lx - 20, ly: KAYA_BURNU.ly - 14, tarif: 'Doğuda buzsuz, çakıllı bir kayalık burun. Yazın binlerce Adélie pengueni burada çakıl taşından yuva yapar; hava keskin bir guano kokusuyla dolu.' },
    { id: 'a_imparator', ad: 'İmparator penguen kolonisi', lx: IMPARATOR_KOLONISI.lx + 6, ly: IMPARATOR_KOLONISI.ly - IMPARATOR_KOLONISI.r - 6, buz: true, tarif: 'Kıyıya yapışık deniz buzunun üstünde, kışın imparator penguenlerin ürediği yer. Erkekler yumurtaları ayaklarının üstünde taşıyarak fırtınalarda birbirine sokulur.' },
    { id: 'a_kumsal', ad: 'Fil foku kumsalı', lx: FILFOK_KIYISI.lx - 4, ly: FILFOK_KIYISI.ly - 14, tarif: 'Kıyıda çakıllı küçük bir kumsal. Yazın güney fil fokları tüy değiştirmek için buraya çıkıp üst üste yatar.' },
    { id: 'a_sahanlik', ad: 'Buz sahanlığı', lx: -175, ly: 40, tarif: 'Batıda kıta buzunun denize uzanan yüzen düz ucu. Kenarı denizden on metreler yükselen dik, mavi bir buz yarıdır; ondan kopan dev düz buzdağları açıkta yüzer.' },
    { id: 'a_buzOrtusu', ad: 'Kıta buz örtüsü', lx: 20, ly: -170, tarif: 'Kıyının güneyinde ufka kadar yükselen sonsuz buz. Kalınlığı içerilere doğru kilometreleri bulur; katabatik rüzgârlar buradan kıyıya iner.' },
    { id: 'a_buz', ad: 'Deniz buzu', lx: 10, ly: 120, buz: true, tarif: 'Donmuş denizin düz, karlı yüzeyi. Weddell fokları buzun altında, dişleriyle açık tuttukları nefes deliklerinin yanında yaşar.' },
    { id: 'a_polinya', ad: 'Polinya', lx: POLINYA_G.lx - 6, ly: POLINYA_G.ly - POLINYA_G.r - 6, buz: true, tarif: 'Rüzgârın kışın bile açık tuttuğu bir su gölü. Orkalar, leopar fokları ve penguenler kışın burada beslenir.' },
  ],
  SICAKLIK: { yaz: [-4, 2], sonbahar: [-18, -8], kis: [-32, -18], ilkbahar: [-22, -10] },
  TIPI_SANSI: { yaz: 0.06, sonbahar: 0.22, kis: 0.3, ilkbahar: 0.22 },
});

// =====================================================================
// AVUSTRALYA ÇALILIĞI: Queensland iç kesimi (AVUSTRALYA merkezi, x +6000). Deniz ve buz yok: açık otlak, ortada bir billabong
// (eski nehir kolundan kalmış su gölü) ve batıya uzanan kuru dere yatağı, kuzeyde okaliptüs ormanı, batıda kızıl kumtaşı kayalık,
// güneydoğuda spinifex çalılığı, doğuda termit tepeleri. Güney yarıküre: mevsimler savanın kutup takvimine göre 12 gün kayık.
// Kutup altyapısını (ayrı harita, kendi takvimi ve havası) kullanır; buz, tipi ve kutup ışıkları yoktur.
// =====================================================================
const BILLABONG = { lx: 60, ly: 40, r: 18 };
const dereY = (lx) => 40 + 9 * Math.sin(lx / 32) + 5 * Math.sin(lx / 11);
const KUMTASI = { lx: -125, ly: -70, r: 38 };
const SPINIFEX = { lx: 120, ly: -140, r: 75 };
const AV_TERMIT = { lx: 145, ly: -20, r: 30 };
const OKALIPTUS_Y = 85; // bunun kuzeyi okaliptüs ormanı
const ISTASYON_A = { lx: 0, ly: -40, r: 9 };
export const AVUS = haritaYap({
  ad: 'avustralya',
  baslik: 'Avustralya çalılığı',
  merkez: AVUSTRALYA,
  kayma: 12,
  sicak: true,
  aurora: false,
  buzYok: true,
  kiyiY: () => 9999,
  buzTaban: 0,
  ISTASYON_K: ISTASYON_A,
  BUZUL: { lx0: -9999, lx1: -9998 },
  POLINYA: BILLABONG,
  ozel: { BILLABONG, KUMTASI, SPINIFEX, AV_TERMIT, OKALIPTUS_Y, dereY },
  MEVSIM_ADI: { yaz: 'Avustralya yazı (yağışlı)', sonbahar: 'sonbahar', kis: 'Avustralya kışı (kurak)', ilkbahar: 'ilkbahar' },
  BOLGE_ADLARI_K: { avUs: 'Saha istasyonu', billabong: 'Billabong', kuruDere: 'Kuru dere yatağı', okaliptus: 'Okaliptüs ormanı', kumtasi: 'Kızıl kumtaşı kayalık', spinifex: 'Spinifex çalılığı', avTermit: 'Termit tepeleri', avOtlak: 'Açık otlak' },
  istasyonBolgesi: 'avUs',
  bolge(H, lx, ly) {
    if (Math.hypot(lx - ISTASYON_A.lx, ly - ISTASYON_A.ly) < ISTASYON_A.r + 12) return 'avUs';
    if (Math.hypot(lx - BILLABONG.lx, ly - BILLABONG.ly) < BILLABONG.r + 8) return 'billabong';
    if (lx < BILLABONG.lx - 10 && Math.abs(ly - dereY(lx)) < 7) return 'kuruDere';
    if (Math.hypot(lx - KUMTASI.lx, ly - KUMTASI.ly) < KUMTASI.r) return 'kumtasi';
    if (Math.hypot(lx - AV_TERMIT.lx, ly - AV_TERMIT.ly) < AV_TERMIT.r) return 'avTermit';
    if (Math.hypot(lx - SPINIFEX.lx, ly - SPINIFEX.ly) < SPINIFEX.r) return 'spinifex';
    if (ly > OKALIPTUS_Y) return 'okaliptus';
    return 'avOtlak';
  },
  yuzey: (H, lx, ly) => (Math.hypot(lx - BILLABONG.lx, ly - BILLABONG.ly) < BILLABONG.r ? 'su' : 'kara'),
  enYakinSu: (H, x, y) => {
    const m = H.dunya(BILLABONG.lx, BILLABONG.ly);
    const a = Math.atan2(x - m.x, y - m.y);
    return { x: m.x + Math.sin(a) * (BILLABONG.r - 1), y: m.y + Math.cos(a) * (BILLABONG.r - 1) };
  },
  gunIsigi: (f) => (f < 8 ? 13.5 : f < 12 ? 13.5 - ((f - 8) / 4) * 3 : f < 20 ? 10.5 : 10.5 + ((f - 20) / 4) * 3),
  isikSozu: (H, dk) => {
    const l = H.isik(dk);
    const s = (((dk % 1440) + 1440) % 1440) / 60;
    if (l >= 0.5) return s > 11 && s < 15 ? 'Güneş tepede; çalılık sıcaktan titreşiyor, gölgeler kısa.' : 'Güneşli bir gündüz.';
    if (l >= 0.12) return s < 12 ? 'Şafak: ufuk kızıla dönüyor, kuşların sabah korosu başlıyor.' : 'Akşam: güneş kızıl toprağı turuncuya boyayarak batıyor.';
    return 'Gece: güney yarıkürenin yıldızları ve Samanyolu bütün gökyüzünü kaplıyor.';
  },
  havaUret: (H, gun, rng) => {
    const t = H.kutupTakvim(gun);
    const [a, b] = { yaz: [27, 39], sonbahar: [20, 31], kis: [9, 23], ilkbahar: [18, 32] }[t.mevsim];
    const sicaklik = Math.round(a + rng() * (b - a));
    const r = rng();
    let tur = 'acik';
    if (t.mevsim === 'yaz' && r < 0.35) tur = 'yagmurlu';
    else if (t.mevsim !== 'kis' && r < 0.08) tur = 'yagmurlu';
    else if ((t.mevsim === 'kis' || t.mevsim === 'ilkbahar') && r < 0.18) tur = 'toz';
    else if (r < 0.45) tur = 'bulutlu';
    else if (sicaklik >= 35) tur = 'sicak';
    return { gun, tur, sicaklik, ruzgarYon: rng() < 0.6 ? Math.PI * 1.5 + (rng() - 0.5) * 0.8 : rng() * Math.PI * 2, ruzgarHiz: tur === 'toz' ? 3 : 0.4 + rng() * 1.5 };
  },
  havaSozu: (h) => {
    if (!h) return '';
    const r = h.ruzgarHiz > 2.5 ? 'sert' : h.ruzgarHiz > 1.2 ? 'orta' : 'hafif';
    const t = { acik: 'Hava açık', bulutlu: 'Gökyüzü bulutlu', yagmurlu: 'Muson yağmuru yağıyor; kuru dere yatağında su sesleri', sicak: 'Kavurucu sıcak; hava titreşiyor', toz: 'Batıdan kızıl bir toz fırtınası esiyor; görüş azalmış' }[h.tur] || 'Hava açık';
    return `${t}, ${h.sicaklik} derece, ${r} rüzgâr.`;
  },
  besin: (H, dk, h) => {
    const m = H.kutupTakvim(Math.floor(dk / 1440) + 1).mevsim;
    return { yaz: 0.95, sonbahar: 0.75, kis: 0.5, ilkbahar: 0.6 }[m] * (h && h.tur === 'yagmurlu' ? 1.1 : 1);
  },
  YERLER: [
    { id: 'v_istasyon', ad: 'Saha istasyonu', lx: 0, ly: -26, tarif: 'Okaliptüs direkli, oluklu sac çatılı küçük bir araştırma barakası; yanında yağmur suyu tankı ve rüzgâr gülü.' },
    { id: 'v_billabong', ad: 'Billabong', lx: BILLABONG.lx - BILLABONG.r - 6, ly: BILLABONG.ly - 8, tarif: 'Eski bir dere kolundan kalmış, kurak mevsimde de kurumayan bir su gölü. Kıyısında nehir kırmızı okaliptüsleri var; kanguru, emu ve dingo içmeye gelir.' },
    { id: 'v_dere', ad: 'Kuru dere yatağı', lx: -60, ly: dereY(-60) - 9, tarif: 'Yalnız muson yağmurlarında akan kumlu bir dere yatağı. Kıyıları dev nehir okaliptüsleriyle sıralı.' },
    { id: 'v_okaliptus', ad: 'Okaliptüs ormanı', lx: 10, ly: 115, tarif: 'Beyaz ve gri gövdeli okaliptüslerin seyrek ormanı. Koalalar dalların çatalında uyur; yaprakların kâfuru andıran kokusu her yere sinmiş.' },
    { id: 'v_kumtasi', ad: 'Kızıl kumtaşı kayalık', lx: KUMTASI.lx + KUMTASI.r + 6, ly: KUMTASI.ly, tarif: 'Rüzgârın oyduğu kızıl kumtaşı kayalar. Vombatların inleri ve dingoların gözcü yerleri burada.' },
    { id: 'v_spinifex', ad: 'Spinifex çalılığı', lx: SPINIFEX.lx - 40, ly: SPINIFEX.ly + 30, tarif: 'Dikenli, tepecikler hâlinde büyüyen spinifex otlarıyla kaplı kurak bir düzlük. Emular burada dolaşır.' },
    { id: 'v_termit', ad: 'Termit tepeleri', lx: AV_TERMIT.lx - AV_TERMIT.r - 6, ly: AV_TERMIT.ly, tarif: 'İnsan boyunu aşan kızıl termit kuleleri. Kulelerin hepsi kuzey-güney doğrultusunda yassı; öğle güneşinden korunmak için.' },
    { id: 'v_otlak', ad: 'Açık otlak', lx: 0, ly: -110, tarif: 'Mitchell otu ve seyrek akasyalarla kaplı geniş bir düzlük. Kırmızı kanguru sürüleri burada otlar.' },
  ],
  SICAKLIK: { yaz: [27, 39], sonbahar: [20, 31], kis: [9, 23], ilkbahar: [18, 32] },
  TIPI_SANSI: { yaz: 0, sonbahar: 0, kis: 0, ilkbahar: 0 },
});

// =====================================================================
// HİNDİSTAN ORMANI: Kanha (Orta Hindistan). Ortada geniş bir çayır (maidan) ve orman dinlenme evi, doğuda bir göl (talab) ve batıya
// uzanan dere yatağı, kuzeyde sal ormanı, batıda bambu ormanı, güneybatıda kayalık yayla (dadar). Mevsimler: muson (yağışlı),
// muson sonrası, serin kış, kavurucu yaz. Kayma yok. Buz, kar ve kutup ışığı yoktur.
// =====================================================================
const TALAB = { lx: 70, ly: 30, r: 22 };
const hnDereY = (lx) => 26 + 10 * Math.sin(lx / 36) + 4 * Math.sin(lx / 13 + 1);
const DADAR = { lx: -115, ly: -130, r: 52 };
const SAL_Y = 75; // bunun kuzeyi sal ormanı
const BAMBU_X = -120; // bunun batısı (dadarın kuzeyi) bambu ormanı
const ISTASYON_H = { lx: 0, ly: -40, r: 9 };
export const HIND = haritaYap({
  ad: 'hindistan',
  baslik: 'Hindistan ormanı',
  merkez: HINDISTAN,
  kayma: 0,
  sicak: true,
  aurora: false,
  buzYok: true,
  kiyiY: () => 9999,
  buzTaban: 0,
  ISTASYON_K: ISTASYON_H,
  BUZUL: { lx0: -9999, lx1: -9998 },
  POLINYA: TALAB,
  ozel: { TALAB, DADAR, SAL_Y, BAMBU_X, hnDereY },
  MEVSIM_ADI: { yaz: 'muson', sonbahar: 'muson sonrası', kis: 'serin kış', ilkbahar: 'kavurucu yaz' },
  BOLGE_ADLARI_K: { hnUs: 'Orman dinlenme evi', maidan: 'Çayır (maidan)', salOrmani: 'Sal ormanı', bambuluk: 'Bambu ormanı', talab: 'Göl kıyısı', dadar: 'Kayalık yayla (dadar)', hnDere: 'Dere yatağı' },
  istasyonBolgesi: 'hnUs',
  bolge(H, lx, ly) {
    if (Math.hypot(lx - ISTASYON_H.lx, ly - ISTASYON_H.ly) < ISTASYON_H.r + 12) return 'hnUs';
    if (Math.hypot(lx - TALAB.lx, ly - TALAB.ly) < TALAB.r + 8) return 'talab';
    if (lx < TALAB.lx - 12 && Math.abs(ly - hnDereY(lx)) < 7) return 'hnDere';
    if (Math.hypot(lx - DADAR.lx, ly - DADAR.ly) < DADAR.r) return 'dadar';
    if (ly > SAL_Y) return 'salOrmani';
    if (lx < BAMBU_X) return 'bambuluk';
    return 'maidan';
  },
  yuzey: (H, lx, ly) => (Math.hypot(lx - TALAB.lx, ly - TALAB.ly) < TALAB.r ? 'su' : 'kara'),
  enYakinSu: (H, x, y) => {
    const m = H.dunya(TALAB.lx, TALAB.ly);
    const a = Math.atan2(x - m.x, y - m.y);
    return { x: m.x + Math.sin(a) * (TALAB.r - 1), y: m.y + Math.cos(a) * (TALAB.r - 1) };
  },
  gunIsigi: (f) => (f < 8 ? 13 : f < 12 ? 12 : f < 20 ? 11 : 12.5),
  isikSozu: (H, dk) => {
    const l = H.isik(dk);
    const s = (((dk % 1440) + 1440) % 1440) / 60;
    if (l >= 0.5) return s > 11 && s < 15 ? 'Güneş tepede; sal ağaçlarının altı serin ve gölgeli, çayır ışıl ışıl.' : 'Güneşli bir gündüz; ışık ağaçların arasından süzülüyor.';
    if (l >= 0.12) return s < 12 ? 'Şafak: çayırın üstünde ince bir sis, tavus kuşları ve horoz sesli yaban tavukları ötüyor.' : 'Akşam: güneş sal ağaçlarının arkasında batıyor, ormana turuncu bir ışık vuruyor.';
    return 'Gece: orman karanlık; ateş böcekleri ve yıldızlar.';
  },
  havaUret: (H, gun, rng) => {
    const t = H.kutupTakvim(gun);
    const [a, b] = { yaz: [25, 32], sonbahar: [22, 30], kis: [8, 24], ilkbahar: [33, 44] }[t.mevsim];
    const sicaklik = Math.round(a + rng() * (b - a));
    const r = rng();
    let tur = 'acik';
    if (t.mevsim === 'yaz' && r < 0.6) tur = 'yagmurlu';
    else if (t.mevsim === 'sonbahar' && r < 0.2) tur = 'yagmurlu';
    else if (t.mevsim === 'kis' && r < 0.25) tur = 'sis';
    else if (r < 0.4) tur = 'bulutlu';
    else if (sicaklik >= 38) tur = 'sicak';
    return { gun, tur, sicaklik, ruzgarYon: rng() < 0.6 ? Math.PI * 1.2 + (rng() - 0.5) * 0.8 : rng() * Math.PI * 2, ruzgarHiz: 0.4 + rng() * 1.4 };
  },
  havaSozu: (h) => {
    if (!h) return '';
    const r = h.ruzgarHiz > 2.5 ? 'sert' : h.ruzgarHiz > 1.2 ? 'orta' : 'hafif';
    const t = { acik: 'Hava açık', bulutlu: 'Gökyüzü bulutlu', yagmurlu: 'Muson yağmuru bardaktan boşanırcasına yağıyor', sicak: 'Kavurucu sıcak; yapraklar kuru, hava titreşiyor', sis: 'Çayırın üstünde sabah sisi' }[h.tur] || 'Hava açık';
    return `${t}, ${h.sicaklik} derece, ${r} rüzgâr.`;
  },
  besin: (H, dk, h) => {
    const m = H.kutupTakvim(Math.floor(dk / 1440) + 1).mevsim;
    return { yaz: 1, sonbahar: 0.9, kis: 0.7, ilkbahar: 0.5 }[m];
  },
  YERLER: [
    { id: 'h_ev', ad: 'Orman dinlenme evi', lx: 0, ly: -26, tarif: 'Taş duvarlı, kiremit çatılı eski bir orman dinlenme evi; verandası çayıra bakıyor. Araştırma ekibi burada kalıyor.' },
    { id: 'h_maidan', ad: 'Çayır (maidan)', lx: 0, ly: -110, tarif: 'Ormanın ortasında açık, geniş bir çayır. Benekli geyik sürüleri burada otlar; kaplan çayırın kenarında, uzun otların içinde bekler.' },
    { id: 'h_talab', ad: 'Göl (talab)', lx: TALAB.lx - TALAB.r - 6, ly: TALAB.ly - 8, tarif: 'Çayırın doğusunda nilüferli bir göl. Kurak mevsimde bütün hayvanlar buraya gelir; sambar geyikleri su bitkilerini yemek için suya girer.' },
    { id: 'h_dere', ad: 'Dere yatağı', lx: -50, ly: hnDereY(-50) - 9, tarif: 'Muson dışında kuru olan kumlu bir dere yatağı. Kumda kaplan ve geyik izleri kolay okunur.' },
    { id: 'h_sal', ad: 'Sal ormanı', lx: 0, ly: 110, tarif: 'Uzun, düz gövdeli sal ağaçlarının ormanı. Gölgeli ve serin; gaur sürüleri ve filler burada dolaşır, langurlar dallarda.' },
    { id: 'h_bambu', ad: 'Bambu ormanı', lx: BAMBU_X - 30, ly: 0, tarif: 'Sık bambu kümelerinin ormanı. Rüzgârda bambular birbirine sürtünüp gıcırdar; filler burada beslenir.' },
    { id: 'h_dadar', ad: 'Kayalık yayla (dadar)', lx: DADAR.lx + DADAR.r + 6, ly: DADAR.ly, tarif: 'Ağaçsız, kayalık, düz bir yayla. Buradan çayırın büyük bölümü görülür.' },
  ],
  SICAKLIK: { yaz: [25, 32], sonbahar: [22, 30], kis: [8, 24], ilkbahar: [33, 44] },
  TIPI_SANSI: { yaz: 0, sonbahar: 0, kis: 0, ilkbahar: 0 },
});

// =====================================================================
// MOĞOL BOZKIRI: Hustai (Orta Moğolistan). Ortada ger kampı ve uçsuz bucaksız bozkır, kuzeydoğuda pınar ve sazlık (tek su), batıya
// uzanan kuru dere yatağı, kuzeybatıda kayalık dağ (kar leoparı ve argali), güneydoğuda Gobi'nin kenarındaki kum tepeleri.
// Mevsimler: kısa yeşil yaz, sonbahar, sert kış (−30 dereceye iner, kar fırtınası "buran"), rüzgârlı ilkbahar (toz fırtınası, doğumlar).
// Kayma yok. Buz ve kutup ışığı yoktur; kışın kar yağar (sicak bayrağı burada "kutup buzu yok" demektir).
// =====================================================================
const PINAR = { lx: 60, ly: 40, r: 12 };
const mgDereY = (lx) => 34 + 9 * Math.sin(lx / 40) + 3 * Math.sin(lx / 11 + 2);
const DAG = { lx: -120, ly: 110, r: 75 };
const KUMUL = { lx: 130, ly: -120, r: 58 };
const HUS = { lx: 40, ly: 150, r: 50 }; // kuzey yamacında huş ormanı (geyik, karaca, domuz)
const ISTASYON_M = { lx: 0, ly: -40, r: 9 };
export const MOGOL = haritaYap({
  ad: 'mogol',
  baslik: 'Moğol bozkırı',
  merkez: MOGOLISTAN,
  kayma: 0,
  sicak: true,
  aurora: false,
  buzYok: true,
  kiyiY: () => 9999,
  buzTaban: 0,
  ISTASYON_K: ISTASYON_M,
  BUZUL: { lx0: -9999, lx1: -9998 },
  POLINYA: PINAR,
  ozel: { PINAR, DAG, KUMUL, HUS, mgDereY },
  MEVSIM_ADI: { yaz: 'bozkır yazı', sonbahar: 'sonbahar', kis: 'sert Moğol kışı', ilkbahar: 'rüzgârlı ilkbahar' },
  BOLGE_ADLARI_K: { mgUs: 'Ger kampı', bozkir: 'Açık bozkır', mgDag: 'Kayalık dağ', pinar: 'Pınar ve sazlık', kumul: 'Kum tepeleri', mgDere: 'Kuru dere yatağı', husOrman: 'Huş ormanı' },
  istasyonBolgesi: 'mgUs',
  bolge(H, lx, ly) {
    if (Math.hypot(lx - ISTASYON_M.lx, ly - ISTASYON_M.ly) < ISTASYON_M.r + 12) return 'mgUs';
    if (Math.hypot(lx - PINAR.lx, ly - PINAR.ly) < PINAR.r + 10) return 'pinar';
    if (Math.hypot(lx - DAG.lx, ly - DAG.ly) < DAG.r) return 'mgDag';
    if (lx < PINAR.lx - 12 && Math.abs(ly - mgDereY(lx)) < 6) return 'mgDere';
    if (Math.hypot(lx - KUMUL.lx, ly - KUMUL.ly) < KUMUL.r) return 'kumul';
    if (Math.hypot(lx - HUS.lx, ly - HUS.ly) < HUS.r) return 'husOrman';
    return 'bozkir';
  },
  yuzey: (H, lx, ly) => (Math.hypot(lx - PINAR.lx, ly - PINAR.ly) < PINAR.r ? 'su' : 'kara'),
  enYakinSu: (H, x, y) => {
    const m = H.dunya(PINAR.lx, PINAR.ly);
    const a = Math.atan2(x - m.x, y - m.y);
    return { x: m.x + Math.sin(a) * (PINAR.r - 1), y: m.y + Math.cos(a) * (PINAR.r - 1) };
  },
  gunIsigi: (f) => (f < 8 ? 16 : f < 12 ? 16 - ((f - 8) / 4) * 7 : f < 20 ? 9 : 9 + ((f - 20) / 4) * 7),
  isikSozu: (H, dk) => {
    const l = H.isik(dk);
    const s = (((dk % 1440) + 1440) % 1440) / 60;
    const kis = H.kutupTakvim(Math.floor(dk / 1440) + 1).mevsim === 'kis';
    if (l >= 0.5) return s > 11 && s < 15 ? (kis ? 'Güneş alçak ama gökyüzü masmavi; karın üstünde göz alıcı bir parıltı var.' : 'Güneş tepede; bozkırın üstünde koca, masmavi bir gökyüzü. Moğollar ona "Sonsuz Mavi Gök" der.') : 'Açık, aydınlık bir gündüz; ufuk çok uzakta.';
    if (l >= 0.12) return s < 12 ? 'Şafak: ufuk pembeleşiyor, tarlakuşları ötmeye başlıyor; hava çok soğuk.' : 'Akşam: güneş bozkırın sonsuz düzlüğünde batıyor, gölgeler yüzlerce metre uzuyor.';
    return 'Gece: hiç ışık yok; gökyüzü yıldızlarla dolu, Samanyolu ufuktan ufka uzanıyor.';
  },
  havaUret: (H, gun, rng) => {
    const t = H.kutupTakvim(gun);
    const [a, b] = { yaz: [14, 28], sonbahar: [-4, 12], kis: [-32, -12], ilkbahar: [-6, 12] }[t.mevsim];
    const sicaklik = Math.round(a + rng() * (b - a));
    const r = rng();
    let tur = 'acik';
    if (t.mevsim === 'yaz' && r < 0.22) tur = 'yagmurlu';
    else if (t.mevsim === 'kis' && r < 0.14) tur = 'tipi';
    else if (t.mevsim !== 'yaz' && r < 0.32) tur = 'kar';
    else if (t.mevsim === 'ilkbahar' && r < 0.55) tur = 'toz';
    else if (r < 0.62) tur = 'bulutlu';
    const h = { gun, tur, sicaklik, ruzgarYon: rng() < 0.65 ? Math.PI * 1.75 + (rng() - 0.5) * 0.7 : rng() * Math.PI * 2, ruzgarHiz: tur === 'tipi' ? 3.4 : tur === 'toz' ? 3 : 0.8 + rng() * 1.8 };
    if (tur === 'tipi') {
      const bas = Math.floor(rng() * 16) * 60;
      h.tipi = { bas, bit: bas + 240 + Math.floor(rng() * 300) };
    }
    return h;
  },
  havaSozu: (h) => {
    if (!h) return '';
    const r = h.ruzgarHiz > 2.5 ? 'sert' : h.ruzgarHiz > 1.2 ? 'orta' : 'hafif';
    const t = { acik: 'Hava açık', bulutlu: 'Gökyüzü bulutlu', yagmurlu: 'Kısa, sert bir yaz sağanağı yağıyor', kar: 'İnce, kuru kar yağıyor', tipi: 'Buran: rüzgâr karı yatay savuruyor, birkaç metre ötesi görünmüyor', toz: 'Gobi\'den gelen toz fırtınası; gökyüzü sarıya döndü' }[h.tur] || 'Hava açık';
    return `${t}, ${h.sicaklik} derece, ${r} rüzgâr.`;
  },
  besin: (H, dk) => {
    const m = H.kutupTakvim(Math.floor(dk / 1440) + 1).mevsim;
    return { yaz: 1, sonbahar: 0.75, kis: 0.4, ilkbahar: 0.55 }[m];
  },
  YERLER: [
    { id: 'm_ger', ad: 'Ger kampı', lx: 0, ly: -26, tarif: 'Keçe kaplı, yuvarlak beyaz çadırlardan (ger) oluşan araştırma kampı. Ortadaki gerin sobası gece gündüz yanar; dışarıda güneş paneli ve bir rüzgâr türbini var.' },
    { id: 'm_bozkir', ad: 'Açık bozkır', lx: 40, ly: -100, tarif: 'Ufka kadar uzanan, ağaçsız, otlu düzlük. Ceylan sürüleri ve yaban atı haremleri burada otlar; kurtlar onları buradan izler.' },
    { id: 'm_pinar', ad: 'Pınar ve sazlık', lx: PINAR.lx - PINAR.r - 6, ly: PINAR.ly - 6, tarif: 'Bozkırın ortasında yıl boyu akan küçük bir pınar ve çevresinde sazlık. Bütün hayvanlar su içmeye buraya gelir; kışın donar, yalnızca kaynağın ağzı açık kalır.' },
    { id: 'm_dere', ad: 'Kuru dere yatağı', lx: -40, ly: mgDereY(-40) - 8, tarif: 'Yazın birkaç gün akan, sonra kuruyan çakıllı bir dere yatağı. İzleri okumak için iyi bir yer.' },
    { id: 'm_dag', ad: 'Kayalık dağın eteği', lx: DAG.lx + DAG.r * 0.7, ly: DAG.ly - DAG.r * 0.7, tarif: 'Granit kayalıkların başladığı yer. Yukarıda argali yaban koyunları ve onları izleyen kar leoparı yaşar; leopar kayalarla aynı renkte, görmek çok zordur.' },
    { id: 'm_hus', ad: 'Huş ormanı', lx: HUS.lx, ly: HUS.ly - HUS.r + 6, tarif: 'Kuzey yamacındaki beyaz gövdeli huş ağaçlarının ormanı; bozkırın ortasında serin bir ada. Kızıl geyikler, karacalar ve yaban domuzları burada saklanır.' },
    { id: 'm_kumul', ad: 'Kum tepeleri', lx: KUMUL.lx - KUMUL.r - 4, ly: KUMUL.ly + 10, tarif: 'Gobi Çölü\'nün kuzey kenarındaki kum tepeleri. Rüzgâr kumu sürekli yeniden şekillendirir; saiga antilopları çevresinde dolaşır.' },
  ],
  SICAKLIK: { yaz: [14, 28], sonbahar: [-4, 12], kis: [-32, -12], ilkbahar: [-6, 12] },
  TIPI_SANSI: { yaz: 0, sonbahar: 0, kis: 0.14, ilkbahar: 0 },
});


// =====================================================================
// YENİ HARİTALAR (15 Kasım 2026): Amazon, Yellowstone, Borneo, Madagaskar. Hepsi "ek" haritadır: genel kod (mantik, kesif, App,
// betimleme, sahne) bunları H.ek ile tanır ve aşağıdaki alanlarla çalışır:
//   gezi {ad, itibar, ucret, yol, donus}, istAd, istIcinde, suAdi, yagisli (doğum mevsimleri), MEVSIM_MESAJ, zemin(b, mev, h),
//   sesler(ev, mev, suYakin, h), tanitim (ilk geliş), raporAdi, yolculuk/donusMetni, ortam.
// =====================================================================
const ekHava = (o) => (H, gun, rng) => {
  const t = H.kutupTakvim(gun);
  const [a, b] = o.sicaklik[t.mevsim];
  const sicaklik = Math.round(a + rng() * (b - a));
  const r = rng();
  let tur = 'acik';
  const y = o.yagmur[t.mevsim] || 0;
  if (r < y) tur = 'yagmurlu';
  else if (o.kar && r < y + (o.kar[t.mevsim] || 0)) tur = 'kar';
  else if (o.sis && r < y + (o.sis[t.mevsim] || 0)) tur = 'sis';
  else if (r < y + 0.3) tur = 'bulutlu';
  else if (o.sicakEsik && sicaklik >= o.sicakEsik) tur = 'sicak';
  return { gun, tur, sicaklik, ruzgarYon: rng() * Math.PI * 2, ruzgarHiz: 0.3 + rng() * (o.ruzgar || 1.4) };
};
const ekHavaSozu = (adlar) => (h) => {
  if (!h) return '';
  const r = h.ruzgarHiz > 2.5 ? 'sert' : h.ruzgarHiz > 1.2 ? 'orta' : 'hafif';
  const derece = `${h.sicaklik < 0 ? 'eksi ' + -h.sicaklik : h.sicaklik} derece`;
  return `${adlar[h.tur] || 'Hava açık'}, ${derece}, ${r} rüzgâr.`;
};
const kenarNoktasi = (H, G, x, y) => {
  const m = H.dunya(G.lx, G.ly);
  const a = Math.atan2(x - m.x, y - m.y);
  return { x: m.x + Math.sin(a) * (G.r - 1), y: m.y + Math.cos(a) * (G.r - 1) };
};
const daireIci = (lx, ly, G, pay = 0) => Math.hypot(lx - G.lx, ly - G.ly) < G.r + pay;
const ORTAK_EK = { sicak: true, aurora: false, buzYok: true, kiyiY: () => 9999, buzTaban: 0, BUZUL: { lx0: -9999, lx1: -9998 }, ek: true };

// ---- AMAZON: Mamirauá benzeri várzea; kuzeyde geniş kara su nehri, güneyde terra firme ----
const amNehirY = (lx) => 115 + 10 * Math.sin(lx / 50) + 4 * Math.sin(lx / 17 + 1);
const AM_COCHA = { lx: -110, ly: -60, r: 24 };
const AM_KIL = { lx: 130, ly: -60, r: 10 };
const ISTASYON_AZ = { lx: 0, ly: -40, r: 9 };
const amTaskin = (H, dk) => ({ yaz: 22, sonbahar: 10, kis: 0, ilkbahar: 12 })[H.kutupTakvim(Math.floor(dk / 1440) + 1).mevsim];
export const AMAZON_H = haritaYap({
  ...ORTAK_EK,
  ad: 'amazon',
  baslik: 'Amazon yağmur ormanı',
  merkez: AMAZON,
  kayma: 0,
  ISTASYON_K: ISTASYON_AZ,
  POLINYA: AM_COCHA,
  ozel: { amNehirY, AM_COCHA, AM_KIL, amTaskin },
  MEVSIM_ADI: { yaz: 'yüksek su (sel mevsimi)', sonbahar: 'çekilen su', kis: 'alçak su', ilkbahar: 'yükselen su' },
  BOLGE_ADLARI_K: { amUs: 'Nehir kıyısı araştırma istasyonu', varzea: 'Várzea (sel ormanı)', terraFirme: 'Terra firme ormanı', cocha: 'Göl kıyısı (cocha)', kilYalak: 'Kil yalağı (collpa)', amNehir: 'Kara su nehri' },
  istasyonBolgesi: 'amUs',
  bolge(H, lx, ly, dk) {
    const kiyi = amNehirY(lx) - amTaskin(H, dk || 0);
    if (ly > kiyi) return 'amNehir';
    if (daireIci(lx, ly, ISTASYON_AZ, 12)) return 'amUs';
    if (daireIci(lx, ly, AM_COCHA, 10)) return 'cocha';
    if (daireIci(lx, ly, AM_KIL, 8)) return 'kilYalak';
    if (ly > kiyi - 60) return 'varzea';
    return 'terraFirme';
  },
  yuzey: (H, lx, ly, dk) => (ly > amNehirY(lx) - amTaskin(H, dk || 0) || daireIci(lx, ly, AM_COCHA) ? 'su' : 'kara'),
  enYakinSu: (H, x, y, dk) => {
    const lx = x - H.MERKEZ.x;
    const ny = { x, y: H.MERKEZ.y + amNehirY(lx) - amTaskin(H, dk || 0) + 1 };
    const c = kenarNoktasi(H, AM_COCHA, x, y);
    return Math.hypot(c.x - x, c.y - y) < Math.hypot(ny.x - x, ny.y - y) ? c : ny;
  },
  gunIsigi: () => 12,
  isikSozu: (H, dk) => {
    const l = H.isik(dk);
    const s = (((dk % 1440) + 1440) % 1440) / 60;
    if (l >= 0.5) return s > 11 && s < 15 ? 'Güneş tepede ama orman tabanına ışık ancak delik deşik ulaşıyor; hava sıcak ve nemli.' : 'Yeşil, loş bir gündüz; ağaç tepelerinden süzülen ışık huzmeleri.';
    if (l >= 0.12) return s < 12 ? 'Şafak: nehrin üstünde sis, uluyan maymunların korosu ormanı dolduruyor.' : 'Akşam: gökyüzü turuncu, papağanlar sürüler hâlinde tüneme ağaçlarına dönüyor.';
    return 'Gece: zifiri karanlık orman; ateş böcekleri, kurbağalar ve binlerce böceğin sesi.';
  },
  havaUret: ekHava({ sicaklik: { yaz: [24, 31], sonbahar: [25, 33], kis: [26, 34], ilkbahar: [24, 31] }, yagmur: { yaz: 0.55, sonbahar: 0.35, kis: 0.25, ilkbahar: 0.6 }, sis: { yaz: 0.1, sonbahar: 0.1, kis: 0.1, ilkbahar: 0.1 }, sicakEsik: 33, ruzgar: 1 }),
  havaSozu: ekHavaSozu({ acik: 'Gökyüzü açık, hava bunaltıcı', bulutlu: 'Kalın bulutlar; her an yağabilir', yagmurlu: 'Tropik sağanak: yapraklar şakır şakır, her yer su', sicak: 'Kurak mevsimin yakıcı sıcağı', sis: 'Nehrin üstünde yoğun sabah sisi' }),
  besin: () => 0.95,
  YERLER: [
    { id: 'az_istasyon', ad: 'Araştırma istasyonu', lx: 0, ly: -26, tarif: 'Taşkına karşı kazıklar üstüne kurulmuş ahşap bir istasyon; sel aylarında kapısına kadar su gelir. Önünde bir iskele ve kano var.' },
    { id: 'az_iskele', ad: 'Nehir kıyısı', lx: 30, ly: 70, tarif: 'Kara su nehrinin kıyısı. Su çay renginde ve aynı zamanda ayna gibi; pembe yunuslar burada nefes almak için yüzeye çıkar.' },
    { id: 'az_cocha', ad: 'Cocha gölü', lx: AM_COCHA.lx + AM_COCHA.r + 6, ly: AM_COCHA.ly, tarif: 'Eski bir nehir kolundan kalmış hilal biçimli bir göl. Dev su samurları, kara kaymanlar ve dev nilüferler burada yaşar.' },
    { id: 'az_collpa', ad: 'Kil yalağı (collpa)', lx: AM_KIL.lx - AM_KIL.r - 5, ly: AM_KIL.ly, tarif: 'Kızıl, ıslak bir toprak yarı. Tapirler gece, maymunlar ve papağanlar gündüz buraya kil yemeye gelir.' },
    { id: 'az_varzea', ad: 'Várzea ormanı', lx: -40, ly: 50, tarif: 'Her yıl aylarca su altında kalan sel ormanı. Ağaç gövdelerinde suyun yükseldiği yerde koyu bir çizgi var.' },
    { id: 'az_terra', ad: 'Terra firme ormanı', lx: 20, ly: -140, tarif: 'Sel suyunun hiç ulaşmadığı yüksek orman. Dev ağaçlar, kök payandaları, kalın yaprak örtüsü; pekari sürüleri burada dolaşır.' },
  ],
  SICAKLIK: { yaz: [24, 31], sonbahar: [25, 33], kis: [26, 34], ilkbahar: [24, 31] },
  TIPI_SANSI: { yaz: 0, sonbahar: 0, kis: 0, ilkbahar: 0 },
});
Object.assign(AMAZON_H, {
  zeminTuru(bg, mev) {
    if (bg === 'amUs') return 'toprak';
    if (bg === 'cocha' || bg === 'kilYalak' || bg === 'amNehir') return 'camur';
    if (bg === 'varzea') return mev === 'yaz' || mev === 'ilkbahar' ? 'camur' : 'yaprak';
    return 'yaprak';
  },
  gezi: { ad: 'Amazon yağmur ormanı, Mamirauá', itibar: 80, ucret: 4000, yol: 360, donus: 360 },
  istAd: 'Araştırma istasyonu',
  istIcinde: 'Araştırma istasyonundasın.',
  istYer: 'az_istasyon',
  suAdi: 'Nehir ya da göl',
  raporAdi: 'Orman raporu',
  yagisli: ['ilkbahar', 'yaz'],
  tanitim: 'Brezilya\'da, Amazon havzasının ortasında, Mamirauá\'daki nehir kıyısı istasyonuna geldin. Kuzeyinde çay renginde geniş bir kara su nehri akıyor; nehrin hemen güneyi her yıl aylarca su altında kalan várzea ormanı, daha güneyde selin ulaşmadığı terra firme ormanı var. Batıda eski bir nehir kolundan kalan cocha gölü, doğuda hayvanların kil yemeye geldiği kil yalağı. Burada mevsimleri suyun yüksekliği belirler: sel mevsiminde nehir ormanın içine kadar yükselir. Araç yok; yürüyerek araştırırsın. Kıyıda kaymanlara dikkat.',
  donus: 'Kano seni nehirden havaalanına götürdü; uçakla savandaki istasyona dönüyorsun.',
  yolculuk: 'Uçakla Manaus\'a, oradan teknede saatlerce nehir yukarı gittin.',
  MEVSIM_MESAJ: {
    yaz: 'Yüksek su: nehir ormanın içine kadar yükseldi, várzea ağaçlarının gövdeleri suda. Yunuslar su basmış ormanda balık avlıyor; kara hayvanları yüksek terra firmeye çekildi.',
    sonbahar: 'Su çekiliyor: kıyıda çamurlu düzlükler açıldı, göllerde balık sıkıştı. Kaymanlar ve dev su samurları için bolluk zamanı.',
    kis: 'Alçak su: nehir en dar hâlinde, kumsallar ortaya çıktı. Hava daha sıcak ve kuru; hayvanlar suya daha sık iniyor.',
    ilkbahar: 'Yükselen su: yağmurlar başladı, nehir her gün biraz daha yükseliyor. Birçok ağaç meyve veriyor; maymunlar ve pekariler bolluk içinde.',
  },
  zemin(b, mev) {
    return {
      amUs: 'Araştırma istasyonunun önündesin: kazıklar üstünde ahşap bir yapı, iskele ve bağlı bir kano; her yer nemli.',
      varzea: mev === 'yaz' ? 'Várzea ormanındasın: yer çamur ve su birikintileriyle dolu; ağaç gövdelerinde selin bıraktığı koyu çizgi başının üstünde.' : 'Várzea ormanındasın: sel çekilince kalan ince, ıslak çamur ve yaprak tabakası; ağaç gövdelerinde suyun izi.',
      terraFirme: 'Terra firme ormanındasın: dev ağaçlar, kalın kök payandaları, yerde kalın bir yaprak örtüsü; ışık loş, hava sıcak ve rutubetli.',
      cocha: 'Cocha gölünün kıyısındasın: durgun, koyu su, kıyıda dev nilüfer yaprakları ve sazlar; çamurda kayman ve samur izleri.',
      kilYalak: 'Kil yalağındasın: kızıl, ıslak bir toprak yarı; hayvanların dişleriyle kazdığı oyuklar ve toynak izleri.',
      amNehir: 'Suyun kenarındasın.',
    }[b];
  },
  sesler(ev, mev, suYakin, h) {
    const l = [ev === 'gece' ? 'ağaç kurbağalarının ve çekirgelerin gece korosu' : 'böceklerin vızıltısı, papağanların ve tukanların sesleri'];
    if (ev === 'safak') l.push('uzakta uluyan maymunların kükremesi');
    if (suYakin) l.push('nehrin sessiz akışı ve arada yunus nefesleri');
    if (h && h.tur === 'yagmurlu') l.push('yağmurun yapraklara vuruşu');
    return l;
  },
});

// ---- YELLOWSTONE: Lamar Vadisi; ortadan sığ Lamar Nehri geçer, kuzeyde çam ormanı ve kayalık sırt, güneydoğuda sıcak kaynaklar ----
const ysNehirY = (lx) => -10 + 14 * Math.sin(lx / 48);
const YS_GOL = { lx: -140, ly: -130, r: 30 };
const YS_GAYZER = { lx: 130, ly: -120, r: 42 };
const YS_DAG = { lx: -130, ly: 110, r: 60 };
const YS_CAM_Y = 95;
const ISTASYON_YS = { lx: 0, ly: -50, r: 9 };
export const YELLOW_H = haritaYap({
  ...ORTAK_EK,
  ad: 'yellowstone',
  baslik: 'Yellowstone, Lamar Vadisi',
  merkez: YELLOWSTONE,
  kayma: 0,
  ISTASYON_K: ISTASYON_YS,
  POLINYA: YS_GOL,
  ozel: { ysNehirY, YS_GOL, YS_GAYZER, YS_DAG, YS_CAM_Y },
  MEVSIM_ADI: { yaz: 'dağ yazı', sonbahar: 'sonbahar', kis: 'karlı Yellowstone kışı', ilkbahar: 'erken ilkbahar' },
  BOLGE_ADLARI_K: { ysUs: 'Lamar araştırma çiftliği', lamar: 'Lamar Vadisi', lamarNehri: 'Lamar Nehri kıyısı', pelinlik: 'Pelin çalılığı', camOrmani: 'Çam ormanı', ysDag: 'Kayalık sırt', gayzer: 'Sıcak su kaynakları', ysGol: 'Göl kıyısı' },
  istasyonBolgesi: 'ysUs',
  bolge(H, lx, ly) {
    if (daireIci(lx, ly, ISTASYON_YS, 12)) return 'ysUs';
    if (daireIci(lx, ly, YS_GOL, 8)) return 'ysGol';
    if (daireIci(lx, ly, YS_GAYZER)) return 'gayzer';
    if (daireIci(lx, ly, YS_DAG)) return 'ysDag';
    if (Math.abs(ly - ysNehirY(lx)) < 7) return 'lamarNehri';
    if (ly > YS_CAM_Y) return 'camOrmani';
    if (ly < -70) return 'pelinlik';
    return 'lamar';
  },
  yuzey: (H, lx, ly) => (daireIci(lx, ly, YS_GOL) ? 'su' : 'kara'),
  enYakinSu: (H, x, y) => {
    const lx = x - H.MERKEZ.x;
    const n = { x, y: H.MERKEZ.y + ysNehirY(lx) };
    const g = kenarNoktasi(H, YS_GOL, x, y);
    return Math.hypot(g.x - x, g.y - y) < Math.hypot(n.x - x, n.y - y) ? g : n;
  },
  gunIsigi: (f) => (f < 8 ? 15 : f < 12 ? 12 : f < 20 ? 9 : 12),
  isikSozu: (H, dk) => {
    const l = H.isik(dk);
    const s = (((dk % 1440) + 1440) % 1440) / 60;
    const kis = H.kutupTakvim(Math.floor(dk / 1440) + 1).mevsim === 'kis';
    if (l >= 0.5) return kis ? 'Parlak, soğuk bir kış günü; karın üstünde göz kamaştırıcı bir ışık, sıcak kaynaklardan buhar yükseliyor.' : s > 11 && s < 15 ? 'Güneş tepede; vadinin üstünde koca bir mavi gökyüzü, uzakta karlı dağlar.' : 'Aydınlık bir gündüz; vadinin otları rüzgârda dalgalanıyor.';
    if (l >= 0.12) return s < 12 ? 'Şafak: vadinin dibinde sis, nehrin üstünde buhar; kurtların en etkin olduğu saat.' : 'Akşam: güneş batı sırtlarının arkasına iniyor, vadi pembeye boyanıyor.';
    return 'Gece: soğuk ve karanlık; gökyüzü yıldızlarla dolu, uzaktan kurt ulumaları geliyor.';
  },
  havaUret: ekHava({ sicaklik: { yaz: [8, 28], sonbahar: [-4, 16], kis: [-28, -6], ilkbahar: [-8, 12] }, yagmur: { yaz: 0.2, sonbahar: 0.12, kis: 0, ilkbahar: 0.1 }, kar: { yaz: 0, sonbahar: 0.15, kis: 0.4, ilkbahar: 0.3 }, ruzgar: 2 }),
  havaSozu: ekHavaSozu({ acik: 'Hava açık', bulutlu: 'Gökyüzü bulutlu', yagmurlu: 'Dağ sağanağı; gök gürlüyor', kar: 'Kar yağıyor; vadi beyaza bürünmüş', sicak: 'Sıcak bir dağ günü' }),
  besin: (H, dk) => ({ yaz: 1, sonbahar: 0.7, kis: 0.35, ilkbahar: 0.55 })[H.kutupTakvim(Math.floor(dk / 1440) + 1).mevsim],
  YERLER: [
    { id: 'ys_ciftlik', ad: 'Lamar araştırma çiftliği', lx: 0, ly: -36, tarif: 'Eski "Buffalo Ranch": ahşap ahırlar ve kütük evlerden oluşan bir araştırma istasyonu. Bizonları yok olmaktan kurtarma çalışmaları 1900\'lerin başında burada yapıldı.' },
    { id: 'ys_nehir', ad: 'Lamar Nehri', lx: 40, ly: ysNehirY(40) - 6, tarif: 'Vadinin ortasından kıvrılarak akan sığ, çakıllı bir nehir. Kıyıdaki söğütlükler kurtlar geri geldikten sonra yeniden büyüdü; sığınlar burada otlar.' },
    { id: 'ys_vadi', ad: 'Vadinin ortası', lx: 60, ly: 30, tarif: 'Geniş, otlu Lamar Vadisi: bizon sürüleri ve wapiti geyikleri burada otlar, kurtlar onları buradan izler. "Amerika\'nın Serengeti\'si" denir.' },
    { id: 'ys_gayzer', ad: 'Sıcak su kaynakları', lx: YS_GAYZER.lx - YS_GAYZER.r - 4, ly: YS_GAYZER.ly, tarif: 'Fokurdayan çamur kazanları, buhar çıkan yarıklar ve renkli sıcak su havuzları. Kışın burada kar tutmaz; bizonlar ısınmak için gelir. Kenardaki ince kabuğa basma.' },
    { id: 'ys_gol', ad: 'Göl', lx: YS_GOL.lx + YS_GOL.r + 6, ly: YS_GOL.ly, tarif: 'Dağların arasında soğuk, berrak bir göl. Kışın donar.' },
    { id: 'ys_sirt', ad: 'Kayalık sırtın eteği', lx: YS_DAG.lx + YS_DAG.r * 0.7, ly: YS_DAG.ly - YS_DAG.r * 0.7, tarif: 'Taşlaşmış ağaç gövdeleriyle ünlü kayalık sırt. Pumanın en sevdiği yer; avlarını yamaçtan izler.' },
    { id: 'ys_orman', ad: 'Çam ormanı', lx: 0, ly: 130, tarif: 'Sık, ince gövdeli çam ormanı. 1988 yangınından sonra yeniden büyüyen genç ağaçlar; ayılar burada çam fıstığı arar.' },
  ],
  SICAKLIK: { yaz: [8, 28], sonbahar: [-4, 16], kis: [-28, -6], ilkbahar: [-8, 12] },
  TIPI_SANSI: { yaz: 0, sonbahar: 0, kis: 0, ilkbahar: 0 },
});
Object.assign(YELLOW_H, {
  zeminTuru(bg, mev, hv, lx, ly) {
    if (bg === 'ysDag' || bg === 'gayzer') return 'kaya';
    if (mev === 'kis' || (hv && hv.tur === 'kar')) return 'kar';
    if (bg === 'lamarNehri') return Math.abs(ly - ysNehirY(lx)) < 3 ? 'su' : 'camur';
    if (bg === 'camOrmani') return 'yaprak';
    if (bg === 'ysUs' || bg === 'pelinlik') return 'toprak';
    if (bg === 'ysGol') return 'camur';
    return 'ot';
  },
  gezi: { ad: 'Yellowstone, Lamar Vadisi', itibar: 85, ucret: 4200, yol: 360, donus: 360 },
  istAd: 'Lamar araştırma çiftliği',
  istIcinde: 'Araştırma çiftliğindesin.',
  istYer: 'ys_ciftlik',
  suAdi: 'Nehir ya da göl',
  raporAdi: 'Vadi raporu',
  yagisli: ['ilkbahar', 'yaz'],
  kar: true,
  tanitim: 'ABD\'de, Yellowstone Ulusal Parkı\'nın Lamar Vadisi\'ndeki araştırma çiftliğine geldin. Önünde geniş, otlu bir vadi uzanıyor; ortasından sığ, çakıllı Lamar Nehri geçiyor, yürüyerek geçebilirsin. Kuzeyde çam ormanı ve kayalık bir sırt, güneybatıda soğuk bir göl, güneydoğuda buhar tüten sıcak su kaynakları var. Kışı uzun ve karlı, −30 dereceye iner. Araç yok; yürüyerek araştırırsın. Bizonlar ve ayılar tehlikelidir; mesafeni koru.',
  donus: 'Araçla havaalanına, oradan uçakla savandaki istasyona dönüyorsun.',
  yolculuk: 'Uçakla Montana\'ya, oradan araçla parkın kuzeydoğu kapısına gittin.',
  MEVSIM_MESAJ: {
    yaz: 'Dağ yazı: vadi yemyeşil, bizon sürüleri kalabalık; ayılar ot, kök ve böcek yiyor, sığınlar söğütlükte.',
    sonbahar: 'Sonbahar: wapiti erkekleri tiz sesleriyle dişileri topluyor, boynuz çarpışmaları vadide yankılanıyor. Ayılar kış uykusundan önce durmadan yiyor.',
    kis: 'Karlı Yellowstone kışı: vadi derin karla örtüldü, sıcaklık −30 dereceye iniyor. Ayılar ininde uyuyor; bizonlar başlarıyla karı süpürüyor, sıcak kaynakların çevresine toplanıyor. Kurtlar için en iyi av mevsimi.',
    ilkbahar: 'Erken ilkbahar: kar eriyor, ayılar zayıf ve aç uyandı. Bizon buzağıları turuncu tüylerle doğuyor; kurtlar ve ayılar onları izliyor.',
  },
  zemin(b, mev) {
    const kar = mev === 'kis' || mev === 'ilkbahar';
    return {
      ysUs: `Araştırma çiftliğindesin: kütük evler, eski ahşap ahırlar ve tel çitler${kar ? '; her şey karla örtülü' : ''}.`,
      lamar: kar ? 'Lamar Vadisi\'ndesin: dizine kadar kar, bizonların süpürdüğü yerlerde kuru ot görünüyor.' : mev === 'sonbahar' ? 'Lamar Vadisi\'ndesin: sararmış otlar, geniş bir düzlük; uzakta karlı dağlar.' : 'Lamar Vadisi\'ndesin: yeşil, dalgalı bir otlak, kır çiçekleri; ufukta dağlar.',
      lamarNehri: kar ? 'Lamar Nehri\'nin kıyısındasın: kenarları buz tutmuş, ortası hâlâ akan sığ bir nehir; çevresinde çıplak söğüt dalları.' : 'Lamar Nehri\'nin kıyısındasın: çakıllı, sığ, berrak bir nehir; kıyıda sık söğütler.',
      pelinlik: kar ? 'Pelin çalılığındasın: kar arasından gri-yeşil pelin çalıları çıkıyor.' : 'Pelin çalılığındasın: gri-yeşil, keskin kokulu pelin çalıları ve kuru toprak.',
      camOrmani: 'Çam ormanındasın: ince, düz gövdeli çamlar; yerde iğne yapraklar ve devrilmiş kütükler. Reçine kokusu var.',
      ysDag: 'Kayalık sırttasın: volkanik kayalar, taşlaşmış ağaç gövdeleri ve dik yamaçlar.',
      gayzer: 'Sıcak su kaynaklarındasın: fokurdayan çamur kazanları, buhar çıkan yarıklar, kükürt kokusu; yer ılık ve beyaz bir kabukla kaplı.',
      ysGol: kar ? 'Gölün kıyısındasın: göl donmuş, üstü karla örtülü.' : 'Gölün kıyısındasın: soğuk, berrak su ve çakıllı bir kıyı.',
    }[b];
  },
  sesler(ev, mev, suYakin) {
    const l = [ev === 'gece' ? 'rüzgârın çamlardaki uğultusu ve uzaktan bir baykuş' : mev === 'kis' ? 'karın üstünde esen rüzgâr ve derin bir sessizlik' : 'çayır kuşlarının şarkıları ve rüzgârın otlardaki hışırtısı'];
    if (suYakin) l.push('nehrin çakıllar üstündeki şırıltısı');
    return l;
  },
});

// ---- BORNEO: Kinabatangan Nehri; kuzeyde geniş, bulanık nehir, kıyıda nehir ormanı, güneyde ova yağmur ormanı ve palmiye tarlası ----
const bnNehirY = (lx) => 105 + 9 * Math.sin(lx / 45) + 3 * Math.sin(lx / 14);
const BN_OKSBOV = { lx: -120, ly: -30, r: 20 };
const BN_KIREC = { lx: 130, ly: -110, r: 40 };
const BN_PALMIYE_Y = -170;
const ISTASYON_BN = { lx: 0, ly: -40, r: 9 };
const bnTaskin = (H, dk) => ({ yaz: 0, sonbahar: 8, kis: 18, ilkbahar: 8 })[H.kutupTakvim(Math.floor(dk / 1440) + 1).mevsim];
export const BORNEO_H = haritaYap({
  ...ORTAK_EK,
  ad: 'borneo',
  baslik: 'Borneo yağmur ormanı',
  merkez: BORNEO,
  kayma: 0,
  ISTASYON_K: ISTASYON_BN,
  POLINYA: BN_OKSBOV,
  ozel: { bnNehirY, BN_OKSBOV, BN_KIREC, BN_PALMIYE_Y, bnTaskin },
  MEVSIM_ADI: { yaz: 'güneybatı musonu (kurak dönem)', sonbahar: 'mevsim geçişi', kis: 'kuzeydoğu musonu (yağışlı)', ilkbahar: 'mevsim geçişi, meyve zamanı' },
  BOLGE_ADLARI_K: { bnUs: 'Nehir kıyısı araştırma kampı', bnKiyi: 'Nehir kıyısı ormanı', dipterokarp: 'Ova yağmur ormanı', oksbov: 'Oksbov gölü', kirectasi: 'Kireçtaşı tepesi', palmiye: 'Yağ palmiyesi tarlası kenarı', bnNehir: 'Kinabatangan Nehri' },
  istasyonBolgesi: 'bnUs',
  bolge(H, lx, ly, dk) {
    const kiyi = bnNehirY(lx) - bnTaskin(H, dk || 0);
    if (ly > kiyi) return 'bnNehir';
    if (daireIci(lx, ly, ISTASYON_BN, 12)) return 'bnUs';
    if (daireIci(lx, ly, BN_OKSBOV, 9)) return 'oksbov';
    if (daireIci(lx, ly, BN_KIREC)) return 'kirectasi';
    if (ly > kiyi - 50) return 'bnKiyi';
    if (ly < BN_PALMIYE_Y) return 'palmiye';
    return 'dipterokarp';
  },
  yuzey: (H, lx, ly, dk) => (ly > bnNehirY(lx) - bnTaskin(H, dk || 0) || daireIci(lx, ly, BN_OKSBOV) ? 'su' : 'kara'),
  enYakinSu: (H, x, y, dk) => {
    const lx = x - H.MERKEZ.x;
    const ny = { x, y: H.MERKEZ.y + bnNehirY(lx) - bnTaskin(H, dk || 0) + 1 };
    const c = kenarNoktasi(H, BN_OKSBOV, x, y);
    return Math.hypot(c.x - x, c.y - y) < Math.hypot(ny.x - x, ny.y - y) ? c : ny;
  },
  gunIsigi: () => 12,
  isikSozu: (H, dk) => {
    const l = H.isik(dk);
    const s = (((dk % 1440) + 1440) % 1440) / 60;
    if (l >= 0.5) return s > 11 && s < 15 ? 'Öğle: ağaç tepelerinin altı loş ve buhar gibi nemli; ışık yer yer yeşil huzmeler hâlinde iniyor.' : 'Yeşil, loş bir gündüz; dev ağaçların arasından süzülen ışık.';
    if (l >= 0.12) return s < 12 ? 'Şafak: nehrin üstünde sis, gibonların şarkısı ormanda yankılanıyor.' : 'Akşam: hortumlu maymunlar geceyi geçirmek için nehre bakan ağaçlara toplanıyor; boynuzgagalar kanat sesleriyle tüneklere dönüyor.';
    return 'Gece: zifiri karanlık; ateş böcekleri kıyıdaki ağaçlarda topluca yanıp sönüyor.';
  },
  havaUret: ekHava({ sicaklik: { yaz: [24, 33], sonbahar: [24, 32], kis: [23, 30], ilkbahar: [24, 32] }, yagmur: { yaz: 0.3, sonbahar: 0.45, kis: 0.7, ilkbahar: 0.4 }, sis: { yaz: 0.1, sonbahar: 0.1, kis: 0.1, ilkbahar: 0.1 }, sicakEsik: 33, ruzgar: 1 }),
  havaSozu: ekHavaSozu({ acik: 'Hava açık ve bunaltıcı', bulutlu: 'Kalın, alçak bulutlar', yagmurlu: 'Tropik sağanak; nehrin yüzeyi damlalarla köpürüyor', sicak: 'Yakıcı, nemli bir sıcak', sis: 'Nehrin üstünde yoğun sabah sisi' }),
  besin: () => 0.95,
  YERLER: [
    { id: 'bn_kamp', ad: 'Araştırma kampı', lx: 0, ly: -26, tarif: 'Nehrin kıyısında, kazıklar üstünde ahşap bir kamp; sivrisinek tülleriyle kaplı odalar ve küçük bir iskele.' },
    { id: 'bn_nehir', ad: 'Nehir kıyısı', lx: 30, ly: 70, tarif: 'Kinabatangan Nehri\'nin bulanık, kahverengi suyunun kıyısı. Akşamüstü hortumlu maymunlar ve filler buraya gelir; suda timsahlar bekler.' },
    { id: 'bn_oksbov', ad: 'Oksbov gölü', lx: BN_OKSBOV.lx + BN_OKSBOV.r + 6, ly: BN_OKSBOV.ly, tarif: 'Nehrin eski bir kıvrımından kalmış durgun bir göl; çevresi sık ve bataklık.' },
    { id: 'bn_kirec', ad: 'Kireçtaşı tepesi', lx: BN_KIREC.lx - BN_KIREC.r - 4, ly: BN_KIREC.ly, tarif: 'Ormanın içinden yükselen sarp bir kireçtaşı tepesi; içinde salanganların yuva yaptığı mağaralar var.' },
    { id: 'bn_orman', ad: 'Ova yağmur ormanı', lx: -40, ly: -90, tarif: 'Dipterokarp ağaçlarının oluşturduğu yüksek orman; bazı ağaçlar 60 metreyi geçer. Orangutanlar burada yaşar.' },
    { id: 'bn_palmiye', ad: 'Palmiye tarlası kenarı', lx: 0, ly: -185, tarif: 'Ormanın bittiği, uçsuz bucaksız yağ palmiyesi tarlasının başladığı yer. Ormanın büyük bölümü bu tarlalara dönüştü; hayvanlar burada sıkışıp kalır.' },
  ],
  SICAKLIK: { yaz: [24, 33], sonbahar: [24, 32], kis: [23, 30], ilkbahar: [24, 32] },
  TIPI_SANSI: { yaz: 0, sonbahar: 0, kis: 0, ilkbahar: 0 },
});
Object.assign(BORNEO_H, {
  zeminTuru(bg) {
    if (bg === 'bnUs' || bg === 'palmiye') return 'toprak';
    if (bg === 'bnKiyi' || bg === 'oksbov' || bg === 'bnNehir') return 'camur';
    if (bg === 'kirectasi') return 'kaya';
    return 'yaprak';
  },
  gezi: { ad: 'Borneo yağmur ormanı, Kinabatangan', itibar: 90, ucret: 4400, yol: 390, donus: 390 },
  istAd: 'Araştırma kampı',
  istIcinde: 'Araştırma kampındasın.',
  istYer: 'bn_kamp',
  suAdi: 'Nehir ya da göl',
  raporAdi: 'Orman raporu',
  yagisli: ['kis', 'ilkbahar'],
  tanitim: 'Malezya\'da, Borneo adasının kuzeyinde, Kinabatangan Nehri\'nin kıyısındaki araştırma kampına geldin. Kuzeyinde geniş, bulanık bir nehir akıyor; kıyı boyunca nehir ormanı, güneyde dev ağaçlı ova yağmur ormanı var. Batıda eski bir nehir kolundan kalan oksbov gölü, doğuda kireçtaşı bir tepe, en güneyde ormanın bitip yağ palmiyesi tarlalarının başladığı yer. Kuzeydoğu musonunda nehir taşar. Araç yok; yürüyerek araştırırsın. Orangutanları ağaçlarda ara; kıyıda timsahlara dikkat.',
  donus: 'Tekneyle kasabaya, oradan uçakla savandaki istasyona dönüyorsun.',
  yolculuk: 'Uçakla Sandakan\'a, oradan tekneyle nehir yukarı gittin.',
  MEVSIM_MESAJ: {
    yaz: 'Kurak dönem: nehir alçaldı, kıyıda çamurlu kumsallar açıldı. Filler nehir boyunca dolaşıyor.',
    sonbahar: 'Mevsim geçişi: yağmurlar sıklaşıyor; orman sessizce yeni yaprak veriyor.',
    kis: 'Kuzeydoğu musonu: her gün sağanak, nehir taşıp kıyı ormanına yayıldı. Hayvanlar yüksek yerlere çekildi; hortumlu maymunlar nehri yüzerek geçiyor.',
    ilkbahar: 'Meyve zamanı: dipterokarp ağaçları ve incirler topluca meyve verdi. Orangutanlar, boynuzgagalar ve sakallı domuzlar bolluk içinde.',
  },
  zemin(b, mev) {
    return {
      bnUs: 'Araştırma kampındasın: kazıklar üstünde ahşap odalar, sivrisinek tülleri, küçük bir iskele; her yer nemli.',
      bnKiyi: mev === 'kis' ? 'Nehir kıyısı ormanındasın: taşkın suyu ağaçların arasına yayılmış, yer bataklık gibi.' : 'Nehir kıyısı ormanındasın: sarmaşıklarla örtülü ağaçlar, çamurlu yer; nehir yakında.',
      dipterokarp: 'Ova yağmur ormanındasın: dev, düz gövdeli dipterokarp ağaçları, kök payandaları, sarmaşıklar ve sülükler; hava sıcak ve buğulu.',
      oksbov: 'Oksbov gölünün kıyısındasın: durgun, koyu su, kıyıda pandanuslar ve sazlar.',
      kirectasi: 'Kireçtaşı tepesinin dibindesin: gri, keskin kayalar, mağara ağızları; içeriden salangan kuşlarının tıkırtıları geliyor.',
      palmiye: 'Palmiye tarlasının kenarındasın: düzgün sıralar hâlinde dikilmiş yağ palmiyeleri, çıplak toprak; ormanın sesi burada birden kesiliyor.',
      bnNehir: 'Suyun kenarındasın.',
    }[b];
  },
  sesler(ev, mev, suYakin, h) {
    const l = [ev === 'gece' ? 'ağustos böceklerinin ve kurbağaların gece korosu' : 'gibonların şarkısı, ağustos böceklerinin cızırtısı ve boynuzgagaların kanat sesleri'];
    if (suYakin) l.push('nehrin akışı');
    if (h && h.tur === 'yagmurlu') l.push('sağanağın yapraklara vuruşu');
    return l;
  },
});

// ---- MADAGASKAR: güneybatı (Berenty ve Kirindy benzeri); ortadan mevsimlik bir nehir yatağı geçer, kuzeyi galeri ormanı, güneyi dikenli orman ----
const mdNehirY = (lx) => 30 + 8 * Math.sin(lx / 40);
const MD_HAVUZ = { lx: 60, ly: 60, r: 10 };
const MD_BAOBAB = { lx: -130, ly: -120, r: 50 };
const ISTASYON_MD = { lx: 0, ly: -25, r: 9 };
export const MADAG_H = haritaYap({
  ...ORTAK_EK,
  ad: 'madagaskar',
  baslik: 'Madagaskar',
  merkez: MADAGASKAR,
  kayma: 0,
  ISTASYON_K: ISTASYON_MD,
  POLINYA: MD_HAVUZ,
  ozel: { mdNehirY, MD_HAVUZ, MD_BAOBAB },
  MEVSIM_ADI: { yaz: 'yağışlı sıcak mevsim', sonbahar: 'kurak mevsim başı', kis: 'serin kurak mevsim', ilkbahar: 'sıcak kurak mevsim' },
  BOLGE_ADLARI_K: { mdUs: 'Saha istasyonu', galeriMd: 'Galeri ormanı', dikenli: 'Dikenli orman', baobabMd: 'Baobab düzlüğü', mdNehir: 'Mevsimlik nehir yatağı', mdHavuz: 'Su birikintisi' },
  istasyonBolgesi: 'mdUs',
  bolge(H, lx, ly) {
    if (daireIci(lx, ly, ISTASYON_MD, 12)) return 'mdUs';
    if (daireIci(lx, ly, MD_HAVUZ, 8)) return 'mdHavuz';
    if (Math.abs(ly - mdNehirY(lx)) < 6) return 'mdNehir';
    if (ly > mdNehirY(lx)) return 'galeriMd';
    if (daireIci(lx, ly, MD_BAOBAB)) return 'baobabMd';
    return 'dikenli';
  },
  yuzey: (H, lx, ly) => (daireIci(lx, ly, MD_HAVUZ) ? 'su' : 'kara'),
  enYakinSu: (H, x, y) => kenarNoktasi(H, MD_HAVUZ, x, y),
  gunIsigi: (f) => (f < 8 ? 13 : f < 12 ? 12 : f < 20 ? 11 : 12),
  isikSozu: (H, dk) => {
    const l = H.isik(dk);
    const s = (((dk % 1440) + 1440) % 1440) / 60;
    if (l >= 0.5) return s > 11 && s < 15 ? 'Güneş tepede; dikenli ormanın altında gölge yok, hava titriyor.' : 'Aydınlık bir gündüz; ışık demirhindi ağaçlarının arasından süzülüyor.';
    if (l >= 0.12) return s < 12 ? 'Şafak: lemurlar ağaçlardan inip yüzlerini doğan güneşe dönüyor.' : 'Akşam: baobabların siluetleri turuncu gökyüzüne karşı kapkara.';
    return 'Gece: karanlık; fenerin ışığında küçük lemurların gözleri parlıyor.';
  },
  havaUret: ekHava({ sicaklik: { yaz: [24, 36], sonbahar: [18, 30], kis: [10, 26], ilkbahar: [22, 38] }, yagmur: { yaz: 0.45, sonbahar: 0.08, kis: 0.02, ilkbahar: 0.05 }, sicakEsik: 35, ruzgar: 1.6 }),
  havaSozu: ekHavaSozu({ acik: 'Hava açık', bulutlu: 'Gökyüzü bulutlu', yagmurlu: 'Yaz sağanağı; kurumuş nehir yatağı hızla doluyor', sicak: 'Kavurucu sıcak; dikenli ormanda hava titriyor' }),
  besin: (H, dk) => ({ yaz: 1, sonbahar: 0.75, kis: 0.5, ilkbahar: 0.45 })[H.kutupTakvim(Math.floor(dk / 1440) + 1).mevsim],
  YERLER: [
    { id: 'md_istasyon', ad: 'Saha istasyonu', lx: 0, ly: -12, tarif: 'Sazdan damlı birkaç küçük kulübe ve bir yağmur suyu tankı. Lemurlar sık sık çatıya çıkar.' },
    { id: 'md_galeri', ad: 'Galeri ormanı', lx: -20, ly: 80, tarif: 'Nehir yatağının kuzeyindeki demirhindi ağaçlarının ormanı. Halka kuyruklu lemurlar ve sifakalar burada yaşar; ağaçlar gölgeli ve serin.' },
    { id: 'md_nehir', ad: 'Nehir yatağı', lx: 30, ly: mdNehirY(30) - 7, tarif: 'Yağışlı mevsimde birkaç gün akan, sonra kuruyan kumlu bir nehir yatağı. Kumda lemur ve fossa izleri.' },
    { id: 'md_havuz', ad: 'Su birikintisi', lx: MD_HAVUZ.lx - MD_HAVUZ.r - 5, ly: MD_HAVUZ.ly, tarif: 'Galeri ormanının içinde, kurak mevsimde de kurumayan küçük bir su birikintisi. Bütün hayvanlar buraya su içmeye gelir.' },
    { id: 'md_dikenli', ad: 'Dikenli orman', lx: 60, ly: -100, tarif: 'Dünyanın başka hiçbir yerinde bulunmayan bitkilerden oluşan bir orman: dikenli, kaktüse benzeyen Didierea ağaçları, şişkin gövdeli bitkiler. Işınsal kaplumbağalar burada yaşar.' },
    { id: 'md_baobab', ad: 'Baobab düzlüğü', lx: MD_BAOBAB.lx + MD_BAOBAB.r + 6, ly: MD_BAOBAB.ly, tarif: 'Dev, düz gövdeli Madagaskar baobablarının yükseldiği açıklık. Altı türlü baobabın altısı da yalnız bu adada yaşar.' },
  ],
  SICAKLIK: { yaz: [24, 36], sonbahar: [18, 30], kis: [10, 26], ilkbahar: [22, 38] },
  TIPI_SANSI: { yaz: 0, sonbahar: 0, kis: 0, ilkbahar: 0 },
});
Object.assign(MADAG_H, {
  zeminTuru(bg, mev) {
    if (bg === 'galeriMd') return 'yaprak';
    if (bg === 'mdHavuz') return 'camur';
    if (bg === 'mdNehir') return mev === 'yaz' ? 'su' : 'toprak';
    return 'toprak';
  },
  gezi: { ad: 'Madagaskar, güneybatı ormanları', itibar: 95, ucret: 4600, yol: 390, donus: 390 },
  istAd: 'Saha istasyonu',
  istIcinde: 'Saha istasyonundasın.',
  istYer: 'md_istasyon',
  suAdi: 'Su birikintisi',
  raporAdi: 'Orman raporu',
  yagisli: ['yaz', 'sonbahar'],
  tanitim: 'Madagaskar\'ın güneybatısındaki saha istasyonuna geldin. Ortadan mevsimlik bir nehir yatağı geçiyor; kuzeyinde demirhindi ağaçlarının gölgeli galeri ormanı ve tek kalıcı su birikintisi, güneyinde dünyada başka hiçbir yerde olmayan dikenli orman, güneybatıda dev baobabların yükseldiği bir düzlük var. Adadaki hayvanların çoğu yalnız burada yaşar: lemurlar, fossa, ay-ay. Yağışlı mevsim kısa, kurak mevsim uzundur. Araç yok; yürüyerek araştırırsın.',
  donus: 'Araçla havaalanına, oradan uçakla savandaki istasyona dönüyorsun.',
  yolculuk: 'Uçakla Antananarivo\'ya, oradan küçük bir uçakla güneye ve araçla istasyona gittin.',
  MEVSIM_MESAJ: {
    yaz: 'Yağışlı sıcak mevsim: kısa ama sert sağanaklar, nehir yatağı birkaç gün akıyor; ağaçlar yapraklandı, lemur yavruları annelerinin sırtında.',
    sonbahar: 'Kurak mevsim başı: nehir yatağı kurudu, demirhindiler meyve veriyor.',
    kis: 'Serin kurak mevsim: geceler soğuk, birçok ağaç yapraklarını döktü. Lemurlar sabahları uzun uzun güneşleniyor; halka kuyruklu lemurların çiftleşme dönemi, erkekler koku dövüşüne tutuşuyor.',
    ilkbahar: 'Sıcak kurak mevsim: her şey kupkuru; hayvanlar su birikintisine bağımlı. Halka kuyruklu lemurlar doğuruyor.',
  },
  zemin(b, mev) {
    return {
      mdUs: 'Saha istasyonundasın: sazdan damlı küçük kulübeler, bir yağmur suyu tankı ve kızıl toprak bir avlu.',
      galeriMd: mev === 'kis' || mev === 'ilkbahar' ? 'Galeri ormanındasın: demirhindi ağaçları, yerde kuru yapraklar ve dökülmüş meyveler; gölgeli ve serin.' : 'Galeri ormanındasın: yemyeşil demirhindi ağaçları, sarmaşıklar ve gölge.',
      dikenli: 'Dikenli ormandasın: kaktüse benzeyen, dikenli, uzun Didierea gövdeleri, şişkin gövdeli bitkiler ve kızıl, kumlu toprak.',
      baobabMd: 'Baobab düzlüğündesin: düz, kalın gövdeli dev baobablar, tepelerinde kısa dallar; aralarda kuru otlar.',
      mdNehir: mev === 'yaz' ? 'Nehir yatağındasın: sağanaktan sonra sığ, bulanık bir su akıyor.' : 'Nehir yatağındasın: ince, sıcak kum; kumda izler kolay okunuyor.',
      mdHavuz: 'Su birikintisinin kıyısındasın: bulanık bir su, kıyıda çamur ve izler.',
    }[b];
  },
  sesler(ev, mev, suYakin) {
    const l = [ev === 'gece' ? 'cırcır böcekleri ve uzaktan bir baykuş' : 'ağustos böcekleri, coua ve vanga kuşlarının sesleri, kuru yaprakların hışırtısı'];
    if (suYakin) l.push('su birikintisindeki kurbağalar');
    return l;
  },
});
export const EK_HARITALAR = { amazon: AMAZON_H, yellowstone: YELLOW_H, borneo: BORNEO_H, madagaskar: MADAG_H };
export const EK_LISTE = Object.values(EK_HARITALAR);

export const HARITALAR = { kuzey: KUZEY, guney: GUNEY, avustralya: AVUS, hindistan: HIND, mogol: MOGOL, ...EK_HARITALAR };
// Noktanın kutup haritası (yoksa null)
export const haritaBul = (p) => (p ? (KUZEY.noktaMi(p) ? KUZEY : GUNEY.noktaMi(p) ? GUNEY : AVUS.noktaMi(p) ? AVUS : HIND.noktaMi(p) ? HIND : MOGOL.noktaMi(p) ? MOGOL : EK_LISTE.find((H) => H.noktaMi(p)) || null) : null);
// Noktanın kutup haritası; kutupta değilse Kuzey (eski çağrılar için)
export const harita = (p) => haritaBul(p) || KUZEY;

// ---------- Geriye uyumlu üst düzey adlar ----------
// Konum alanlar noktanın haritasını kendisi bulur; yalnız zaman alanlar Kuzey içindir.
export const KUTUP_SINIR = KUTUP.y - 600;
export const kutuptaMi = (x, y) => KUZEY.icinde(x, y) || GUNEY.icinde(x, y) || AVUS.icinde(x, y) || HIND.icinde(x, y) || MOGOL.icinde(x, y) || EK_LISTE.some((H) => H.icinde(x, y));
export const avustralyaMi = (p) => AVUS.noktaMi(p);
export const hindistanMi = (p) => HIND.noktaMi(p);
export const mogolMu = (p) => MOGOL.noktaMi(p);
// Yeni haritalar: noktanın ek haritası (yoksa null)
export const ekHarita = (p) => (p ? EK_LISTE.find((H) => H.noktaMi(p)) || null : null);
export const ekMi = (p) => !!ekHarita(p);
// Sıcak haritalar (Avustralya, Hindistan): kar, buz ve kutup ışığı yok
export const sicakMi = (p) => !!(haritaBul(p) && haritaBul(p).sicak);
export const kutupNoktaMi = (p) => !!p && kutuptaMi(p.x, p.y);
export const guneyMi = (p) => GUNEY.noktaMi(p);
export const yerel = (p) => harita(p).yerel(p);
// Oyuncunun bulunduğu kutup haritası ("etkin"): zaman ve oyuncu bağlamındaki adlar ona göre değişir (mantik her karede etkinAyarla çağırır).
// Hayvanlar için her zaman harita(g) kullanılır.
export let ETKIN = KUZEY;
export let dunya = KUZEY.dunya;
export let kiyiY = KUZEY.kiyiY;
export let ISTASYON_K = KUZEY.ISTASYON_K;
export let BUZUL = KUZEY.BUZUL;
export let POLINYA = KUZEY.POLINYA;
export let MEVSIM_ADI = KUZEY.MEVSIM_ADI;
export let kutupTakvim = KUZEY.kutupTakvim;
export let yilKonumu = KUZEY.yilKonumu;
export let gunIsigiSaat = KUZEY.gunIsigiSaat;
export let isik = KUZEY.isik;
export let evre = KUZEY.evre;
export let isikSozu = KUZEY.isikSozu;
export let buzKenari = KUZEY.buzKenari;
export let polinyadaMi = KUZEY.polinyadaMi;
export let KUTUP_YERLER = KUZEY.KUTUP_YERLER;
export let tundraBesin = KUZEY.tundraBesin;
export let havaSozu = KUZEY.havaSozu;
export let havaUret = KUZEY.havaUret;
export const KUS_YARI = KUS_YARI_K;
export const MORS_KIYISI = MORS_KIYISI_K;
export function etkinAyarla(p) {
  const H = haritaBul(p) || KUZEY;
  if (H === ETKIN) return H;
  ETKIN = H;
  dunya = H.dunya;
  kiyiY = H.kiyiY;
  ISTASYON_K = H.ISTASYON_K;
  BUZUL = H.BUZUL;
  POLINYA = H.POLINYA;
  MEVSIM_ADI = H.MEVSIM_ADI;
  kutupTakvim = H.kutupTakvim;
  yilKonumu = H.yilKonumu;
  gunIsigiSaat = H.gunIsigiSaat;
  isik = H.isik;
  evre = H.evre;
  isikSozu = H.isikSozu;
  buzKenari = H.buzKenari;
  polinyadaMi = H.polinyadaMi;
  KUTUP_YERLER = H.KUTUP_YERLER;
  tundraBesin = H.tundraBesin;
  havaSozu = H.havaSozu;
  havaUret = H.havaUret;
  return H;
}
export const yuzey = (x, y, dk) => harita({ x, y }).yuzey(x, y, dk);
export const sudaMi = (x, y, dk) => yuzey(x, y, dk) === 'su';
export const karadaMi = (x, y) => harita({ x, y }).karadaMi(x, y);
export const enYakinSu = (x, y, dk, delik) => harita({ x, y }).enYakinSu(x, y, dk, delik);
export const BOLGE_ADLARI_K = { ...KUZEY.BOLGE_ADLARI_K, ...GUNEY.BOLGE_ADLARI_K, ...AVUS.BOLGE_ADLARI_K, ...HIND.BOLGE_ADLARI_K, ...MOGOL.BOLGE_ADLARI_K, ...Object.assign({}, ...EK_LISTE.map((H) => H.BOLGE_ADLARI_K)) };
export const bolge = (x, y, dk) => harita({ x, y }).bolge(x, y, dk);
export const TUM_KUTUP_YERLER = [...KUZEY.KUTUP_YERLER, ...GUNEY.KUTUP_YERLER, ...AVUS.KUTUP_YERLER, ...HIND.KUTUP_YERLER, ...MOGOL.KUTUP_YERLER, ...EK_LISTE.flatMap((H) => H.KUTUP_YERLER)];
export const kutupYeriHarita = (y) => (GUNEY.KUTUP_YERLER.includes(y) ? GUNEY : AVUS.KUTUP_YERLER.includes(y) ? AVUS : HIND.KUTUP_YERLER.includes(y) ? HIND : MOGOL.KUTUP_YERLER.includes(y) ? MOGOL : EK_LISTE.find((H) => H.KUTUP_YERLER.includes(y)) || KUZEY);
export const yerKonumu = (y) => kutupYeriHarita(y).yerKonumu(y);
export const buzKalinligi = (x, y, dk, isinma = 0) => harita({ x, y }).buzKalinligi(x, y, dk, isinma);
