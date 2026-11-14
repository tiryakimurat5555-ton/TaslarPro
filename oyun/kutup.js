// ==== VAHŞİ YAŞAM: KUZEY KUTBU BÖLGESİ (Kuzeydoğu Grönland kıyısı) ====
// Brif karar 16 ("sonradan kutup ekosistemi eklenebilir") ve 17 (büyük harita + ayrı bölümler). Savanla aynı dünya koordinatlarında,
// ama çok uzakta (KUTUP merkezi), kendi coğrafyası, mevsimi, ışığı ve havası olan ikinci bir ana harita.
// Saf modül: yalnızca veri.js ve ekosistem.js'i kullanır; mantik.js, betimleme, sahne ve App bunu içe aktarır.
// Yerel koordinat: lx = x - KUTUP.x (doğu), ly = y - KUTUP.y (kuzey). Kuzeyde deniz (deniz buzu ya da açık su), güneyde kara (tundra).
// Sayılar ÖNERİDİR.
import { KUTUP } from './veri.js';
import { YIL_GUN } from './ekosistem.js';

export const KUTUP_SINIR = KUTUP.y - 600; // bu y'den kuzeyi kutup haritası
export const kutuptaMi = (x, y) => Number.isFinite(y) && y > KUTUP_SINIR;
export const kutupNoktaMi = (p) => !!p && kutuptaMi(p.x, p.y);
export const yerel = (p) => ({ x: p.x - KUTUP.x, y: p.y - KUTUP.y });
export const dunya = (lx, ly) => ({ x: KUTUP.x + lx, y: KUTUP.y + ly });

// ---------- Coğrafya ----------
// Kıyı çizgisi (yerel y): kuzeyi deniz, güneyi kara
export const kiyiY = (lx) => 40 + 9 * Math.sin(lx / 38) + 5 * Math.sin(lx / 13 + 1);
export const ISTASYON_K = { lx: 0, ly: -150, r: 9 }; // Zackenberg yakınındaki araştırma kulübesi
export const BUZUL = { lx0: -230, lx1: -150 }; // batıda denize inen buzul
export const KUS_YARI = { lx: 168, ly: 22, r: 26 }; // doğuda kıyı yarları: deniz kuşu kolonisi
export const MORS_KIYISI = { lx: 120, ly: kiyiY(120) - 4 }; // morsların karaya çıktığı çakıllı kıyı
export const POLINYA = { lx: 70, ly: 150, r: 15 }; // kışın da donmayan açık su gölü (rüzgâr ve akıntı buzu açık tutar)

// ---------- Takvim: yılın 24 gününde kutup mevsimleri ----------
// 1-8 yaz (gece yarısı güneşi, deniz buzu geri çekilir), 9-12 sonbahar, 13-20 kış (kutup gecesi), 21-24 ilkbahar (güneş döner)
export const MEVSIM_ADI = { yaz: 'kutup yazı', sonbahar: 'sonbahar', kis: 'kutup kışı', ilkbahar: 'ilkbahar' };
export function kutupTakvim(gun) {
  const yg = ((((gun - 1) % YIL_GUN) + YIL_GUN) % YIL_GUN) + 1;
  if (yg <= 8) return { mevsim: 'yaz', mevsimGunu: yg, uzunluk: 8, yilGunu: yg };
  if (yg <= 12) return { mevsim: 'sonbahar', mevsimGunu: yg - 8, uzunluk: 4, yilGunu: yg };
  if (yg <= 20) return { mevsim: 'kis', mevsimGunu: yg - 12, uzunluk: 8, yilGunu: yg };
  return { mevsim: 'ilkbahar', mevsimGunu: yg - 20, uzunluk: 4, yilGunu: yg };
}
// Yıl içindeki sürekli konum (0..24) dakikadan
const yilKonumu = (dk) => {
  const g = dk / 1440; // 0 = 1. günün başı
  return ((g % YIL_GUN) + YIL_GUN) % YIL_GUN;
};
// Gün ışığı süresi (saat): yazın 24, kışın 0; ilkbahar ve sonbaharda hızla değişir
export function gunIsigiSaat(dk) {
  const f = yilKonumu(dk);
  if (f < 8) return 24;
  if (f < 12) return 24 * (1 - (f - 8) / 4);
  if (f < 20) return 0;
  return (24 * (f - 20)) / 4;
}
// Işık 0 (karanlık) .. 1 (öğle güneşi)
export function isik(dk) {
  const L = gunIsigiSaat(dk);
  const s = (((dk % 1440) + 1440) % 1440) / 60;
  const ogle = Math.cos(((s - 12) / 24) * Math.PI * 2); // öğlende 1, gece yarısında -1
  if (L >= 23.9) return 0.78 + 0.18 * ogle; // gece yarısı güneşi: güneş hiç batmaz, gece yarısı alçakta
  if (L <= 0.1) {
    // Kutup gecesi: öğleye doğru ufukta kısa bir alacakaranlık (kışın ortasında neredeyse hiç)
    const f = yilKonumu(dk);
    const derinlik = Math.min(1, Math.min(f - 12, 20 - f) / 3);
    return Math.max(0.03, 0.03 + (0.2 - 0.17 * derinlik) * Math.max(0, ogle));
  }
  const yarim = L / 2;
  const fark = Math.abs(s - 12);
  if (fark < yarim - 1) return Math.min(1, 0.5 + 0.5 * Math.min(1, (yarim - 1 - fark) / 3));
  if (fark < yarim + 1) return 0.12 + (0.38 * (yarim + 1 - fark)) / 2; // gün doğumu ve batımı (kutupta uzun sürer)
  return 0.06;
}
// Gün evresi (aktiflik, dürbün menzili ve betimleme için): ışığa göre
export function evre(dk) {
  const l = isik(dk);
  const s = (((dk % 1440) + 1440) % 1440) / 60;
  if (l >= 0.5) return 'gunduz';
  if (l >= 0.12) return s < 12 ? 'safak' : 'aksam';
  return 'gece';
}
export function isikSozu(dk) {
  const t = kutupTakvim(Math.floor(dk / 1440) + 1);
  const L = gunIsigiSaat(dk);
  const l = isik(dk);
  if (L >= 23.9) return l < 0.7 ? 'Gece yarısı güneşi ufkun hemen üstünde, her şey turuncu bir ışığa boğulmuş; güneş hiç batmıyor.' : 'Güneş gökyüzünde; kutup yazında hiç batmıyor.';
  if (L <= 0.1) return l > 0.08 ? 'Kutup gecesi; öğle olmasına rağmen güney ufkunda yalnızca soluk mavi bir alacakaranlık var.' : 'Kutup gecesi: güneş haftalardır doğmadı, her yer karanlık. Kar yıldızların ve ayın ışığıyla soluk parlıyor.';
  if (l >= 0.5) return `${t.mevsim === 'ilkbahar' ? 'Güneş kutup gecesinden sonra yeniden yükseliyor; günler hızla uzuyor.' : 'Güneş alçakta ilerliyor; günler hızla kısalıyor.'}`;
  if (l >= 0.12) return 'Güneş ufkun hemen altında; uzun bir kutup alacakaranlığı.';
  return 'Karanlık; kutup gecesi yaklaşıyor.';
}

// ---------- Deniz buzu ----------
// Buz kenarının yerel y'si: kışın kıyıya dayalı (fiyort donar), ilkbaharda kıyıda kırılmaya başlar, yazın kuzeye çekilir.
export function buzKenari(dk) {
  const f = yilKonumu(dk);
  let acik;
  if (f < 8) acik = 45 + (f / 8) * 120; // yaz: 45 → 165
  else if (f < 12) acik = 165 - ((f - 8) / 4) * 175; // sonbahar: 165 → -10 (deniz donar)
  else if (f < 20) acik = -10; // kış: fiyort buzla kaplı
  else acik = -10 + ((f - 20) / 4) * 55; // ilkbahar: -10 → 45 (kıyıda çatlaklar açılır)
  return 44 + acik;
}
// Kışın polinya (açık su gölü) dışında her yer donar; yazın polinya zaten açık denizin parçası
export const polinyadaMi = (lx, ly, pay = 0) => Math.hypot(lx - POLINYA.lx, ly - POLINYA.ly) < POLINYA.r + pay;
// Noktanın yüzeyi: 'kara' | 'buz' | 'su'
export function yuzey(x, y, dk) {
  const lx = x - KUTUP.x;
  const ly = y - KUTUP.y;
  if (ly <= kiyiY(lx)) return 'kara';
  if (polinyadaMi(lx, ly)) return 'su';
  return ly > buzKenari(dk) ? 'buz' : 'su';
}
export const sudaMi = (x, y, dk) => yuzey(x, y, dk) === 'su';
export const karadaMi = (x, y) => y - KUTUP.y <= kiyiY(x - KUTUP.x);
// En yakın açık su noktası (fokun kaçacağı yer): buz kenarı, polinya ya da kendi nefes deliği
export function enYakinSu(x, y, dk, delik) {
  const lx = x - KUTUP.x;
  const ly = y - KUTUP.y;
  const aday = [];
  const bk = buzKenari(dk);
  const kenarY = Math.max(kiyiY(lx) + 2, bk - 2);
  if (kenarY < KUTUP.r - 5) aday.push(dunya(lx, kenarY));
  aday.push(dunya(POLINYA.lx, POLINYA.ly));
  if (delik) aday.push(delik);
  aday.sort((a, b) => Math.hypot(a.x - x, a.y - y) - Math.hypot(b.x - x, b.y - y));
  return aday[0];
}

// ---------- Bölgeler ----------
export const BOLGE_ADLARI_K = {
  kutupIstasyon: 'Araştırma kulübesi',
  tundra: 'Tundra',
  kiyi: 'Kıyı',
  buz: 'Deniz buzu',
  acikSu: 'Açık su',
  buzul: 'Buzul',
  kusYari: 'Kuş yarları',
  polinya: 'Polinya',
};
export function bolge(x, y, dk) {
  const lx = x - KUTUP.x;
  const ly = y - KUTUP.y;
  if (Math.hypot(lx - ISTASYON_K.lx, ly - ISTASYON_K.ly) < ISTASYON_K.r + 12) return 'kutupIstasyon';
  if (Math.hypot(lx - KUS_YARI.lx, ly - KUS_YARI.ly) < KUS_YARI.r) return 'kusYari';
  if (lx < BUZUL.lx1 && ly <= kiyiY(lx) + 25) return 'buzul';
  if (polinyadaMi(lx, ly, 4) && ly > kiyiY(lx)) return 'polinya';
  if (ly > kiyiY(lx)) return ly > buzKenari(dk) ? 'buz' : 'acikSu';
  if (ly > kiyiY(lx) - 16) return 'kiyi';
  return 'tundra';
}

// ---------- Yerler (Yerler paneli, betimleme) ----------
export const KUTUP_YERLER = [
  { id: 'k_kulube', ad: 'Araştırma kulübesi', lx: 0, ly: -132, tarif: 'Zackenberg yakınlarında, tundranın ortasında küçük ahşap bir araştırma kulübesi. Isıtıcı, telsiz ve laboratuvar kutusu burada.' },
  { id: 'k_tundra', ad: 'Tundra vadisi', lx: -60, ly: -80, tarif: 'Yosun, liken, cüce söğüt ve kutup çiçekleriyle kaplı geniş bir vadi. Ren geyikleri ve misk öküzleri burada otlar.' },
  { id: 'k_kiyi', ad: 'Kıyı', lx: -10, ly: kiyiY(-10) - 8, tarif: 'Çakıllı, rüzgâr savrulmuş bir kıyı. Kışın deniz buzu buraya dayanır, yazın küçük dalgalar buz parçalarını kıyıya vurur.' },
  { id: 'k_mors', ad: 'Mors kıyısı', lx: MORS_KIYISI.lx - 14, ly: MORS_KIYISI.ly - 12, tarif: 'Morsların karaya çıkıp sırt sırta yattığı çakıllı bir burun.' },
  { id: 'k_kusyari', ad: 'Kuş yarları', lx: KUS_YARI.lx - 30, ly: KUS_YARI.ly - 18, tarif: 'Denize dik inen kayalık yarlar. Yazın binlerce küçük alk ve üç parmaklı martı burada yuvalar.' },
  { id: 'k_buzul', ad: 'Buzul cephesi', lx: BUZUL.lx1 + 12, ly: 10, tarif: 'Batıda denize dökülen bir buzulun mavi buz duvarı. Arada bir buz kütleleri kopup denize düşer.' },
  { id: 'k_buz', ad: 'Deniz buzu', lx: -20, ly: 130, buz: true, tarif: 'Donmuş fiyordun düz, karlı yüzeyi. Halkalı foklar buzun altında nefes delikleri açar; kutup ayıları onları burada avlar.' },
  { id: 'k_polinya', ad: 'Polinya', lx: POLINYA.lx - 6, ly: POLINYA.ly - POLINYA.r - 6, buz: true, tarif: 'Akıntı ve rüzgârın kışın bile açık tuttuğu bir su gölü. Belugalar ve morslar kışı burada geçirir.' },
];
export const yerKonumu = (y) => dunya(y.lx, y.ly);

// ---------- Hava (günlük) ----------
const SICAKLIK = { yaz: [2, 9], sonbahar: [-14, -3], kis: [-34, -20], ilkbahar: [-20, -8] };
const TIPI_SANSI = { yaz: 0.03, sonbahar: 0.18, kis: 0.25, ilkbahar: 0.18 };
export function havaUret(gun, rng) {
  const t = kutupTakvim(gun);
  const [a, b] = SICAKLIK[t.mevsim];
  const sicaklik = Math.round(a + rng() * (b - a));
  const r = rng();
  let tur = 'acik';
  if (r < TIPI_SANSI[t.mevsim]) tur = 'tipi';
  else if (t.mevsim === 'yaz' && r < 0.25) tur = 'sis';
  else if (r < 0.45) tur = 'bulutlu';
  else if (t.mevsim !== 'yaz' && r < 0.62) tur = 'kar';
  const h = { gun, tur, sicaklik, ruzgarYon: rng() * Math.PI * 2, ruzgarHiz: tur === 'tipi' ? 3.4 : 0.5 + rng() * 1.6 };
  if (tur === 'tipi') {
    const bas = Math.floor(rng() * 16) * 60;
    h.tipi = { bas, bit: bas + 240 + Math.floor(rng() * 360) };
  }
  return h;
}
export const tipideMi = (h, dk) => !!(h && h.tur === 'tipi' && h.tipi && (dk % 1440) >= h.tipi.bas && (dk % 1440) < h.tipi.bit);
export function gorusCarpani(h, dk) {
  if (!h) return 1;
  if (tipideMi(h, dk)) return 0.32;
  if (h.tur === 'sis') return 0.55;
  if (h.tur === 'kar') return 0.75;
  return 1;
}
export function havaSozu(h, dk) {
  if (!h) return '';
  const derece = `${h.sicaklik < 0 ? 'eksi ' + -h.sicaklik : h.sicaklik} derece`;
  const r = h.ruzgarHiz > 2.5 ? 'sert' : h.ruzgarHiz > 1.2 ? 'orta' : 'hafif';
  if (tipideMi(h, dk)) return `Tipi var: rüzgâr uğulduyor, savrulan kar görüşü birkaç metreye indiriyor. Hava ${derece}, rüzgârla hissedilen çok daha soğuk.`;
  const t = { acik: 'Hava açık', bulutlu: 'Gökyüzü bulutlu', sis: 'Deniz sisi kıyıyı örtmüş', kar: 'Hafif kar yağıyor', tipi: 'Gün içinde tipi bekleniyor' }[h.tur];
  return `${t}, ${derece}, ${r} rüzgâr.`;
}

// Kutup haritasında tek tip "otçul besin" değeri (tundra bitki örtüsü mevsime göre): yazın bol, kışın karın altında az
export function tundraBesin(dk, h) {
  const t = kutupTakvim(Math.floor(dk / 1440) + 1).mevsim;
  const taban = { yaz: 0.9, sonbahar: 0.6, kis: 0.3, ilkbahar: 0.38 }[t];
  return taban * (tipideMi(h, dk) ? 0.5 : 1);
}
