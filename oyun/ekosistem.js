// ==== VAHŞİ YAŞAM: EKOSİSTEM (brif Aşama 5) ====
// Saf mantık ve tablolar: takvim ve mevsimler, günlük hava (karar 75), su kaynakları ve su kalitesi (74, 104),
// otlak ve yaprak ızgarası ile bitki yenilenmesi (40, 103), bitkiler ve botanik (29, 96), hastalıklar (28),
// yaşam döngüsü (46, 53) ve mevsimsel göç (43, 111).
// Hayvanlarla ilgili kısım mantik.js'te bu modülün işlevlerini kullanır; bu modül mantik.js'i içe aktarmaz.
// Sayılar öneridir; Murat onaylamadı.
import { YARICAP, GOLET, ISTASYON, nehirY } from './veri.js';

// ---------- Takvim ----------
// Oyun yılı 24 gün: 10 gün yağışlı mevsim, 14 gün kurak mevsim (gerçek savanda yağışlı dönem kabaca yılın %40'ı).
export const YIL_GUN = 24;
export const YAGISLI_GUN = 10;
export const MEVSIM_ADI = { yagisli: 'yağışlı mevsim', kurak: 'kurak mevsim' };
export function takvim(gun) {
  const yil = Math.floor((gun - 1) / YIL_GUN) + 1;
  const yilGunu = ((gun - 1) % YIL_GUN) + 1;
  const yagisli = yilGunu <= YAGISLI_GUN;
  const uzunluk = yagisli ? YAGISLI_GUN : YIL_GUN - YAGISLI_GUN;
  const mevsimGunu = yagisli ? yilGunu : yilGunu - YAGISLI_GUN;
  return { yil, yilGunu, mevsim: yagisli ? 'yagisli' : 'kurak', mevsimGunu, uzunluk, erken: mevsimGunu <= uzunluk / 2, kalan: uzunluk - mevsimGunu };
}

// ---------- Izgara (otlak biyokütlesi ve ağaç yaprağı) ----------
export const HUCRE = 25;
export const KENAR = Math.ceil((YARICAP * 2) / HUCRE); // 16
export function hucre(x, y) {
  const i = Math.floor((x + YARICAP) / HUCRE);
  const j = Math.floor((y + YARICAP) / HUCRE);
  if (i < 0 || j < 0 || i >= KENAR || j >= KENAR) return -1;
  return j * KENAR + i;
}
export const hucreMerkezi = (h) => ({ x: (h % KENAR) * HUCRE - YARICAP + HUCRE / 2, y: Math.floor(h / KENAR) * HUCRE - YARICAP + HUCRE / 2 });
// Bölgeye göre otlak taşıma kapasitesi
const OT_KAPASITE = { otlak: 1, agaclik: 0.7, golet: 0.9, nehir: 0.8, sulak: 1, kayalik: 0.35, istasyon: 0.5, galeri: 0.55, termit: 0.9 };

// Arazi sabittir; kapasiteler her açılışta aynı hesaplanır (kayda girmez)
export function kapasiteHesapla(bolgeBul, agaclar) {
  const ot = [];
  const yaprak = [];
  const yanmaz = [];
  const agacSayisi = new Array(KENAR * KENAR).fill(0);
  agaclar.forEach((a) => {
    const h = hucre(a.x, a.y);
    if (h >= 0) agacSayisi[h] += 1;
  });
  for (let h = 0; h < KENAR * KENAR; h++) {
    const m = hucreMerkezi(h);
    if (Math.hypot(m.x, m.y) > YARICAP + 8) {
      ot.push(0);
      yaprak.push(0);
      yanmaz[h] = true;
      continue;
    }
    ot.push(OT_KAPASITE[bolgeBul(m.x, m.y)] ?? 0.8);
    // Yanmaz hücreler: nehir, gölet ve istasyonun çevresindeki yangın kesici şerit
    yanmaz[h] = Math.abs(m.y - nehirY(m.x)) < 14 || Math.hypot(m.x - GOLET.x, m.y - GOLET.y) < GOLET.r + 8 || Math.hypot(m.x - ISTASYON.x, m.y - ISTASYON.y) < ISTASYON.r + 16;
    yaprak.push(Math.min(1, agacSayisi[h] / 5));
  }
  return { ot, yaprak, yanmaz };
}

// ---------- Ekosistem durumu (k.eko, kayda girer) ----------
export function ekoOlustur(kap) {
  return {
    surum: 1,
    hava: null,
    yil: null,
    islaklik: 0.55, // toprak nemi (0-1): yağmurla artar, kurakta düşer
    yesil: 0.7, // otların yeşilliği (görüntü ve tarif)
    golet: 0.85, // göletin doluluğu (0-1)
    alg: 0.05,
    nehir: 0.5, // nehir akışı (0-1)
    yagisBugun: 0,
    yagisMevsim: 0,
    yagmurVar: false,
    ot: kap.ot.map((v) => +(v * 0.8).toFixed(3)),
    yaprak: kap.yaprak.map((v) => +(v * 0.9).toFixed(3)),
    sonAdim: null,
    mevsim: null,
    goletUyari: 0, // 0 dolu, 1 yarıya indi, 2 kurudu
    algUyari: false,
    gocler: [], // göç kayıtları {gun, tur, olay: 'cikis'|'donus', sayi}
    salgin: null, // {hastalik, basGun, vaka, bilinen}
    teshisler: [], // laboratuvar ya da veteriner teşhisleri {hastalik, tur, gun}
    gecitPusu: null, // göç eden sürü bir geçide yaklaşırken timsahların beklediği x
    // Aşama 6: afetler (karar 23, 76)
    yanan: {}, // yanan hücre -> tutuştuğu dakika
    yanik: {}, // yanmış hücre -> yandığı dakika (yeniden filizlenme)
    yanginPlan: null, // {dk, h, neden}
    yanginSayac: 0,
    yanginlar: 0,
    taskin: false,
    taskinBitis: 0,
  };
}

// Göletin o anki su yarıçapı (mantık, çarpışma ve görüntü bunu kullanır)
export function goletAyarla(eko) {
  const s = eko.golet;
  GOLET.su = s < 0.08 ? 0 : GOLET.r * (0.35 + 0.65 * Math.sqrt(s));
  return GOLET.su;
}
export const goletKurudu = (eko) => eko.golet < 0.08;

// ---------- Hava (karar 75) ----------
export const HAVA_ADI = {
  acik: 'açık ve güneşli',
  parcali: 'parçalı bulutlu',
  bulutlu: 'kapalı',
  yagmurlu: 'yağmurlu',
  saganak: 'sağanak ve gök gürültülü',
  sicak: 'çok sıcak',
};
function secAgirlik(rng, l) {
  const t = l.reduce((s, x) => s + x[1], 0);
  let r = rng() * t;
  for (const [a, w] of l) {
    r -= w;
    if (r <= 0) return a;
  }
  return l[0][0];
}
// Yıl başında yılın özellikleri: yağmurlar bazen gecikir, bazen yıl kurak geçer
function yilOzellikleri(eko, yil, rng) {
  if (eko.yil && eko.yil.no === yil) return eko.yil;
  eko.yil = { no: yil, gecikme: yil > 1 && rng() < 0.25 ? 2 + Math.floor(rng() * 3) : 0, kuraklik: yil > 1 && rng() < 0.2 };
  return eko.yil;
}
export function havaUret(eko, gun, rng) {
  const tk = takvim(gun);
  const yil = yilOzellikleri(eko, tk.yil, rng);
  const yagmurlar = tk.mevsim === 'yagisli' && tk.mevsimGunu > yil.gecikme;
  let tur;
  if (gun === 1) tur = 'parcali'; // ilk gün öğretici: açık hava
  else if (yagmurlar) {
    const az = yil.kuraklik ? 0.45 : 1;
    tur = secAgirlik(rng, [['acik', 0.12], ['parcali', 0.2], ['bulutlu', 0.18], ['yagmurlu', 0.33 * az], ['saganak', 0.17 * az]]);
  } else if (tk.mevsim === 'yagisli') tur = secAgirlik(rng, [['acik', 0.3], ['parcali', 0.35], ['bulutlu', 0.3], ['yagmurlu', 0.05]]);
  else tur = secAgirlik(rng, [['acik', 0.45], ['parcali', 0.25], ['bulutlu', 0.08], ['sicak', yil.kuraklik ? 0.3 : 0.18], ['yagmurlu', tk.mevsimGunu > tk.uzunluk - 2 ? 0.12 : 0.02]]);
  const yagmur = [];
  const saat = (a, b) => Math.round((a + rng() * (b - a)) * 60);
  if (tur === 'yagmurlu') {
    const n = rng() < 0.5 ? 1 : 2;
    for (let i = 0; i < n; i++) {
      const bas = saat(i === 0 ? 8 : 15, i === 0 ? 13 : 21);
      yagmur.push({ bas, bit: bas + saat(1, 3), siddet: 0.35 + rng() * 0.3 });
    }
  } else if (tur === 'saganak') {
    const bas = saat(13.5, 17.5);
    yagmur.push({ bas, bit: bas + saat(0.8, 2), siddet: 1 });
    if (rng() < 0.4) {
      const g = saat(21, 23);
      yagmur.push({ bas: g, bit: g + saat(1, 2.5), siddet: 0.4 });
    }
  }
  const sicaklik = tur === 'sicak' ? 36 : tk.mevsim === 'kurak' ? 31 : tur === 'saganak' || tur === 'yagmurlu' ? 25 : 28;
  // Rüzgâr: kurak mevsimde çoğunlukla doğudan (alize), yağışlıda değişken
  const ruzgarYon = tk.mevsim === 'kurak' ? Math.PI / 2 + (rng() - 0.5) * 1.2 : rng() * Math.PI * 2;
  const ruzgarHiz = tur === 'saganak' ? 2 : tur === 'sicak' || tk.mevsim === 'kurak' ? 1.4 : 1;
  eko.hava = { gun, tur, yagmur, sicaklik, ruzgarYon, ruzgarHiz };
  return eko.hava;
}
// Şu anki yağış şiddeti (0-1)
export function yagisSiddeti(eko, gunDk) {
  if (!eko.hava) return 0;
  for (const y of eko.hava.yagmur) if (gunDk >= y.bas && gunDk < y.bit) return y.siddet;
  return 0;
}
const saatYazi = (dk) => `${String(Math.floor(dk / 60) % 24).padStart(2, '0')}:${String(Math.round(dk % 60)).padStart(2, '0')}`;
export function havaTahmini(eko, gunDk) {
  const h = eko.hava;
  if (!h) return '';
  let m = `Hava ${HAVA_ADI[h.tur]}, en yüksek sıcaklık ${h.sicaklik} derece.`;
  const gelecek = h.yagmur.filter((y) => y.bit > gunDk);
  if (gelecek.length) {
    const y = gelecek[0];
    m += y.bas <= gunDk ? ` Yağmur yağıyor, saat ${saatYazi(y.bit)} sularında dinecek.` : ` Saat ${saatYazi(y.bas)} sularında ${y.siddet > 0.8 ? 'sağanak' : 'yağmur'} bekleniyor.`;
  }
  return m;
}
// Yağmurda görüş ve ses kaydı kısalır
export function gorusCarpani(eko) {
  if (!eko || !eko.yagmurVar) return 1;
  return eko.siddet > 0.8 ? 0.55 : 0.75;
}

// ---------- Sözlü düzeyler ----------
export const otSozu = (v) => (v > 0.65 ? 'bol ve gür' : v > 0.4 ? 'yeterli' : v > 0.2 ? 'seyrek' : 'tükenmek üzere');
export const goletSozu = (eko) =>
  goletKurudu(eko) ? 'kurumuş, yalnızca çatlak çamur kaldı' : eko.golet > 0.75 ? 'dolu' : eko.golet > 0.45 ? 'biraz çekilmiş' : eko.golet > 0.2 ? 'yarıdan fazla çekilmiş' : 'kurumak üzere';
export function suKalitesi(eko) {
  if (goletKurudu(eko)) return 0;
  return Math.max(0, Math.min(1, 1 - eko.alg * 0.8 - (eko.golet < 0.2 ? 0.25 : 0)));
}
export const kaliteSozu = (q) => (q > 0.75 ? 'temiz' : q > 0.5 ? 'biraz bulanık' : q > 0.3 ? 'bulanık, alg çoğalmış' : 'kirli ve yeşil, alg kaplamış');
export const nehirSozu = (v) => (v > 0.8 ? 'kabarmış, hızlı ve çamurlu akıyor' : v > 0.45 ? 'normal akıyor' : v > 0.25 ? 'yavaş akıyor' : 'çok azalmış, yer yer durgun gölcüklere bölünmüş');

// Bir dairenin içindeki ortalama ot (habitat, bölge raporu)
export function ortalamaOt(eko, x, y, r) {
  let t = 0;
  let n = 0;
  for (let h = 0; h < eko.ot.length; h++) {
    const m = hucreMerkezi(h);
    if (Math.hypot(m.x - x, m.y - y) > r + HUCRE / 2) continue;
    if (Math.hypot(m.x, m.y) > YARICAP) continue;
    t += eko.ot[h];
    n++;
  }
  return n ? t / n : 0;
}
export const otDegeri = (eko, x, y) => {
  const h = hucre(x, y);
  return h < 0 ? 0 : eko.ot[h];
};
export const yaprakDegeri = (eko, x, y) => {
  const h = hucre(x, y);
  return h < 0 ? 0 : eko.yaprak[h];
};
// Otlayan hayvan yer: miktar hücre biyokütlesinden düşülür, yenen miktar döner
export function otYe(eko, x, y, miktar, yaprak = false) {
  const h = hucre(x, y);
  if (h < 0) return 0;
  const l = yaprak ? eko.yaprak : eko.ot;
  const yenen = Math.min(l[h], miktar);
  l[h] = Math.max(0, l[h] - yenen);
  return yenen;
}

// ---------- Ekosistemin zaman içindeki değişimi ----------
// Her karede çağrılır; dtDk oyun dakikası. Dönen olaylar mantik.js'te duyurulur.
export function ekoAdim(eko, kap, gun, gunDk, dtDk, rng = Math.random) {
  const olaylar = [];
  const tk = takvim(gun);
  const siddet = yagisSiddeti(eko, gunDk);
  const yagiyor = siddet > 0;
  if (yagiyor !== eko.yagmurVar) {
    eko.yagmurVar = yagiyor;
    eko.siddet = siddet;
    olaylar.push(yagiyor ? (siddet > 0.8 ? 'saganakBasladi' : 'yagmurBasladi') : 'yagmurDindi');
  }
  eko.siddet = siddet;
  const gunOrani = dtDk / 1440;
  // Yağış (mm): sağanak saatte ~30 mm, hafif yağmur 6-12 mm
  const mm = siddet * 30 * (dtDk / 60);
  eko.yagisBugun += mm;
  eko.yagisMevsim += mm;
  eko.islaklik = Math.min(1, eko.islaklik + mm * 0.018);
  eko.golet = Math.min(1, eko.golet + mm * 0.006);
  eko.alg = Math.max(0, eko.alg - mm * 0.012);
  // Buharlaşma ve kuruma
  const sicak = eko.hava ? eko.hava.sicaklik : 28;
  const buhar = 0.025 + Math.max(0, sicak - 26) * 0.005 + (tk.mevsim === 'kurak' ? 0.008 : 0);
  eko.golet = Math.max(0, eko.golet - buhar * gunOrani);
  eko.islaklik = Math.max(0, eko.islaklik - (0.08 + Math.max(0, sicak - 26) * 0.012) * gunOrani);
  // Sıcak ve sığ suda alg çoğalır
  if (eko.golet < 0.45 && sicak >= 31) eko.alg = Math.min(1, eko.alg + 0.1 * gunOrani);
  else eko.alg = Math.max(0, eko.alg - 0.02 * gunOrani);
  // Nehir akışı toprak nemini izler
  const nehirHedef = 0.18 + 0.82 * eko.islaklik;
  eko.nehir += (nehirHedef - eko.nehir) * Math.min(1, gunOrani * 3);
  // Yeşillik: yağmurdan birkaç gün sonra artar, kurakta solar
  const yesilHedef = Math.min(1, 0.15 + eko.islaklik * 1.1);
  eko.yesil += (yesilHedef - eko.yesil) * Math.min(1, gunOrani * 0.8);
  // Ot ve yaprak büyümesi (karar 40: bitki yenilenmesi ve otçul baskısı)
  const buyume = (0.13 * eko.islaklik - (eko.islaklik < 0.2 ? 0.025 : 0)) * gunOrani;
  for (let h = 0; h < eko.ot.length; h++) {
    const kp = kap.ot[h];
    if (!kp) continue;
    // Yanmış alanda yağmurla taze sürgünler daha hızlı çıkar (karar 76)
    if (buyume > 0) eko.ot[h] = Math.min(kp, eko.ot[h] + buyume * (1 - eko.ot[h] / kp) * 1.4 * (eko.yanik && eko.yanik[h] ? 1.8 : 1));
    else eko.ot[h] = Math.max(0, eko.ot[h] + buyume);
    const ky = kap.yaprak[h];
    if (ky) eko.yaprak[h] = Math.min(ky, eko.yaprak[h] + (0.03 + eko.islaklik * 0.05) * gunOrani);
  }
  // Gölet duyuruları
  if (eko.golet < 0.08 && eko.goletUyari < 2) {
    eko.goletUyari = 2;
    olaylar.push('goletKurudu');
  } else if (eko.golet < 0.42 && eko.goletUyari < 1) {
    eko.goletUyari = 1;
    olaylar.push('goletCekildi');
  } else if (eko.golet > 0.6 && eko.goletUyari > 0) {
    eko.goletUyari = 0;
    olaylar.push('goletDoldu');
  }
  if (!eko.algUyari && eko.alg > 0.45 && !goletKurudu(eko)) {
    eko.algUyari = true;
    olaylar.push('algCogaldi');
  } else if (eko.algUyari && eko.alg < 0.2) eko.algUyari = false;
  goletAyarla(eko);
  const dkMutlak = (gun - 1) * 1440 + gunDk;
  yanginAdim(eko, kap, dkMutlak, dtDk, rng, olaylar);
  // Sel: büyük sağanakta nehir taşar, geçitler birkaç saat geçilmez
  if (!eko.taskin && eko.nehir > 0.96 && eko.yagisBugun > 50 && !(eko.selSayisi >= 1) && (eko.afetCarpani ?? 1) >= 0.5) {
    eko.taskin = true;
    eko.selSayisi = (eko.selSayisi || 0) + 1;
    eko.taskinBitis = dkMutlak + 6 * 60 + rng() * 6 * 60;
    olaylar.push('selBasladi');
  } else if (eko.taskin && dkMutlak > eko.taskinBitis && !eko.yagmurVar) {
    eko.taskin = false;
    olaylar.push('selBitti');
  }
  return olaylar;
}

// ---------- Bitkiler ve botanik (karar 29, 57, 96) ----------
// evre: [yağışlı erken, yağışlı geç, kurak erken, kurak geç]; tohum: o evrede tohum numunesi alınabilir mi
export const BITKILER = {
  semsiyeAkasya: {
    ad: 'Şemsiye akasya', bilimsel: 'Vachellia tortilis', bicim: 'ağaç', bolge: ['agaclik', 'otlak'], ozellik: 'besin',
    tarif: 'Savanın simgesi olan şemsiye biçimli, dikenli ağaç. Kökleri yerin çok derinine iner; kurakta bile yaprak tutar.',
    evre: ['beyaz top çiçekleri açmış, arılar çevresinde', 'taze yapraklı, genç baklalar oluşuyor', 'kıvrık baklaları olgunlaşmış', 'yapraklarının bir kısmını dökmüş, baklalar yere düşüyor'],
    tohum: [false, false, true, true],
    analiz: 'Yaprak ve baklalarında yüksek protein bulundu. Kurak mevsimde zürafalar ve filler için en önemli besin. Hayvanların sindiriminden geçen tohumlar daha kolay çimleniyor.',
  },
  sariAkasya: {
    ad: 'Sarı ateş ağacı', bilimsel: 'Vachellia xanthophloea', bicim: 'ağaç', bolge: ['golet', 'nehir'], ozellik: 'besin',
    tarif: 'Su kenarlarında yetişen, sarımsı yeşil kabuklu bir akasya. Kabuğu da yaprak gibi fotosentez yapar. Balık kartalları bu ağaçlara tüner.',
    evre: ['yeni yapraklar sürmüş', 'sarı top çiçekler açmış', 'baklaları olgunlaşıyor', 'tohumlarını döküyor'],
    tohum: [false, false, true, true],
    analiz: 'Kabuğunda yeşil fotosentez pigmentleri ve tanen bulundu. Yaprakları filler için besleyici; kökleri kıyı toprağını tutuyor.',
  },
  kirmiziYulaf: {
    ad: 'Kırmızı yulaf otu', bilimsel: 'Themeda triandra', bicim: 'ot', bolge: ['otlak', 'agaclik'], ozellik: 'besin',
    tarif: 'Doğu Afrika çayırlarının baskın otu. Yağmurla yeşerir, kurakta kızıl kahverengiye döner.',
    evre: ['taze yeşil sürgünler veriyor', 'boy atmış, kızıl başaklar çıkarıyor', 'tohumlarını döküyor, sararıyor', 'kurumuş, kızıl kahverengi'],
    tohum: [false, true, true, false],
    analiz: 'Genç sürgünleri çok besleyici; kuruyunca besin değeri düşüyor. Önce zebralar uzun otu keser, ardından ceylanlar taze sürgünleri yer. Bu otlama sırası türlerin aynı çayırı paylaşmasını sağlıyor.',
  },
  kopekdisi: {
    ad: 'Köpekdişi ayrığı', bilimsel: 'Cynodon dactylon', bicim: 'ot', bolge: ['golet', 'nehir', 'sulak', 'istasyon'], ozellik: 'besin',
    tarif: 'Toprağın üstünde sürünerek yayılan kısa bir çim. Sık otlatılan yerlerde bile yeniden çıkar.',
    evre: ['yemyeşil, hızla yayılıyor', 'ince çiçek başakları açmış', 'kısa ve seyrek ama yeşil', 'yer yer kurumuş'],
    tohum: [false, true, true, false],
    analiz: 'Otlatmaya çok dayanıklı; nemli toprakta kurak mevsimde de yeşil kalıyor. Su aygırlarının gece otladığı kıyı çayırlarının temel bitkisi.',
  },
  papirus: {
    ad: 'Papirüs', bilimsel: 'Cyperus papyrus', bicim: 'saz', bolge: ['sulak', 'nehir'], ozellik: 'su',
    tarif: 'Sığ suda yetişen, boyu insan boyunu aşan saz. Sapların tepesinde püskül gibi ince saplar taşır.',
    evre: ['yeni sürgünler veriyor', 'püskülleri çiçek açmış', 'tohum veriyor', 'su çekildiği için kenarları kuruyor'],
    tohum: [false, false, true, false],
    analiz: 'Kökleri çamuru tutup suyu süzüyor, sulak alanın suyunu temizliyor. Mandalara ve kuşlara sığınak oluşturuyor.',
  },
  samdanSutlegen: {
    ad: 'Şamdan sütleğeni', bilimsel: 'Euphorbia candelabrum', bicim: 'ağaç', bolge: ['kayalik'], ozellik: 'zehirli',
    tarif: 'Kayalıkta yükselen, şamdan biçimli kollu, kaktüse benzeyen bir ağaç. Dalı kırılınca beyaz süt akar.',
    evre: ['etli kolları dolgun ve yeşil', 'sarımsı yeşil çiçekler açmış', 'kırmızımsı meyveler vermiş', 'meyveleri patlayıp tohum saçıyor'],
    tohum: [false, false, false, true],
    analiz: 'Beyaz özsuyu yakıcı ve zehirli; gözle teması körlüğe yol açabilir. Hayvanların çoğu dokunmuyor, bu yüzden kayalıkta güvenli bir gölge oluşturuyor. Bazı kuşlar meyvelerini yiyor.',
  },
  aloe: {
    ad: 'Savan aloesi', bilimsel: 'Aloe secundiflora', bicim: 'çalı', bolge: ['kayalik', 'otlak'], ozellik: 'şifalı',
    tarif: 'Etli, kenarları dikenli yaprakları rozet biçiminde dizilmiş küçük bir bitki. Kurak mevsimde kırmızı çiçek salkımı açar.',
    evre: ['yaprakları su dolu ve dolgun', 'yaprakları dolgun, tomurcuk vermiş', 'kırmızı çiçek salkımları açmış', 'çiçekleri tohuma dönüyor, yaprakları kırışmış'],
    tohum: [false, false, false, true],
    analiz: 'Yaprak özünde yara iyileşmesini hızlandıran ve mikrop öldüren maddeler bulundu. Yerel halk hayvan yaralarında geleneksel olarak kullanıyor. Çiçekleri güneş kuşlarını ve arıları çekiyor.',
  },
  colHurmasi: {
    ad: 'Çöl hurması', bilimsel: 'Balanites aegyptiaca', bicim: 'ağaç', bolge: ['otlak', 'agaclik'], ozellik: 'besin',
    tarif: 'Uzun yeşil dikenli, kurağa çok dayanıklı bir ağaç. Hurmaya benzeyen sarı meyveler verir.',
    evre: ['beyazımsı yeşil küçük çiçekler açmış', 'yeşil meyveler vermiş', 'meyveleri sararıp olgunlaşmış', 'meyveleri yere dökülmüş'],
    tohum: [false, false, true, true],
    analiz: 'Meyveleri tatlı ve besleyici. Filler meyveyi bütün yutuyor; tohumlar dışkıyla uzaklara taşınıp orada çimleniyor. Fil ile ağaç birbirine bağlı yaşıyor.',
  },
};
export const BITKI_SIRASI = Object.keys(BITKILER);
export const OZELLIK_ADI = { besin: 'önemli bir besin bitkisi', su: 'suyu temizleyen bir bitki', zehirli: 'zehirli', 'şifalı': 'şifalı' };
export function bitkiEvresi(id, gun, eko) {
  const tk = takvim(gun);
  const i = (tk.mevsim === 'yagisli' ? 0 : 2) + (tk.erken ? 0 : 1);
  let metin = BITKILER[id].evre[i];
  if (eko && eko.yil && eko.yil.kuraklik && tk.mevsim === 'kurak' && !tk.erken) metin += '; kuraklıktan solmuş';
  return { anahtar: ['yE', 'yG', 'kE', 'kG'][i], mevsim: tk.mevsim, metin, tohum: BITKILER[id].tohum[i] };
}
export const bolgedekiBitkiler = (bolge) => BITKI_SIRASI.filter((id) => BITKILER[id].bolge.includes(bolge));

// ---------- Hastalıklar (karar 28) ----------
// gunluk: tedavisiz günlük şiddet değişimi; iyilesme: günlük kendiliğinden iyileşme şansı
export const HASTALIKLAR = {
  yara: {
    ad: 'yaralanma', etken: 'av, kavga ya da düşme', belirti: 'topallıyor', tedavi: true, bulasici: false, gunluk: -0.06, iyilesme: 0.2, yavaslatir: 0.7,
    tarif: 'Av, kavga ya da düşmeden kaynaklanan yara. Hayvan yavaşlar ve avcılara karşı savunmasız kalır. Çoğu birkaç günde kendiliğinden iyileşir; kondisyonu düşük hayvanlarda kötüleşebilir.',
  },
  parazit: {
    ad: 'bağırsak paraziti', etken: 'yuvarlak solucanlar (nematodlar)', belirti: 'zayıf görünüyor, tüyleri mat', tedavi: true, bulasici: false, gunluk: 0.04, iyilesme: 0.1,
    tarif: 'Kirli sudan ve otlardan geçen parazitler. Su azalıp kirlendiğinde artar, hayvanın kondisyonunu düşürür.',
  },
  uyuz: {
    ad: 'uyuz', etken: 'Sarcoptes scabiei akarı', belirti: 'tüyleri yer yer dökülmüş, sürekli kaşınıyor', tedavi: true, bulasici: true, gunluk: 0.07, iyilesme: 0.06,
    turler: ['aslan', 'sirtlan', 'leopar', 'ceylan', 'zebra', 'domuz', 'yabanKopegi', 'babun', 'cita'],
    tarif: 'Deri altına yerleşen akarların yol açtığı bulaşıcı deri hastalığı. Yakın temasla sürü içinde yayılır; tedavi edilmezse hayvanı tüketebilir.',
  },
  sarbon: {
    ad: 'şarbon', etken: 'Bacillus anthracis bakterisi', belirti: 'halsiz ve titriyor, burnundan kan geliyor', tedavi: false, bulasici: true, gunluk: 0.55, iyilesme: 0.02, yavaslatir: 0.5, olumcul: true,
    turler: ['zebra', 'manda', 'fil', 'zurafa', 'ceylan', 'gergedan', 'suAygiri', 'domuz', 'gnu', 'impala'],
    tarif: 'Toprakta yıllarca canlı kalan sporlarla bulaşan ölümcül bir bakteri hastalığı. Kurak mevsimde hayvanlar azalan su ve kısa otların çevresinde toplanınca salgın yapar. Leşler sporları yayar; sırtlanlar ve akbabalar büyük ölçüde dayanıklıdır.',
  },
  distemper: {
    ad: 'köpek gençlik hastalığı', etken: 'köpek distemper virüsü (evcil köpeklerden bulaşır)', belirti: 'gözleri ve burnu akıyor, öksürüyor', tedavi: false, bulasici: true, gunluk: 0.1, iyilesme: 0.07,
    turler: ['yabanKopegi', 'sirtlan', 'aslan'],
    tarif: 'Evcil köpeklerden yaban köpeklerine, sırtlanlara ve aslanlara bulaşan ölümcül bir virüs hastalığı. Bir yaban köpeği sürüsünü birkaç haftada yok edebilir. Hastalanan hayvan tedavi edilemez; korunmanın yolu aşıdır.',
  },
};
// Belirti dürbünle ancak hastalık ilerleyince görülür
export const belirtiGorunur = (h) => !!h && h.siddet > 0.25;

// ---------- Yaşam döngüsü (karar 46): yıl olarak; oyun yılı YIL_GUN gün ----------
// yavru: bağımsızlığa kadar, genc: erginliğe kadar, yasli: yaşlılığın başı, omur: en uzun ömür
export const YASAM = {
  aslan: { yavru: 1.5, genc: 4, yasli: 12, omur: 16 },
  leopar: { yavru: 1.5, genc: 3, yasli: 11, omur: 15 },
  sirtlan: { yavru: 1.5, genc: 3, yasli: 15, omur: 20 },
  fil: { yavru: 4, genc: 12, yasli: 45, omur: 62 },
  zurafa: { yavru: 1.5, genc: 4, yasli: 18, omur: 25 },
  zebra: { yavru: 1, genc: 3, yasli: 16, omur: 22 },
  ceylan: { yavru: 0.6, genc: 1.5, yasli: 8, omur: 11 },
  domuz: { yavru: 1, genc: 2, yasli: 10, omur: 14 },
  suAygiri: { yavru: 2, genc: 7, yasli: 35, omur: 45 },
  timsah: { yavru: 3, genc: 12, yasli: 50, omur: 70 },
  gergedan: { yavru: 3, genc: 7, yasli: 35, omur: 45 },
  kartal: { yavru: 1, genc: 5, yasli: 18, omur: 24 },
  piton: { yavru: 2, genc: 4, yasli: 22, omur: 30 },
  manda: { yavru: 2, genc: 5, yasli: 16, omur: 22 },
  gnu: { yavru: 1, genc: 3, yasli: 15, omur: 20 },
  cita: { yavru: 1.5, genc: 3, yasli: 9, omur: 13 },
  impala: { yavru: 0.7, genc: 2, yasli: 10, omur: 13 },
  yabanKopegi: { yavru: 1, genc: 2, yasli: 8, omur: 11 },
  babun: { yavru: 1.5, genc: 6, yasli: 20, omur: 28 },
};
export const yilGun = (yil) => yil * YIL_GUN;
export function evreBul(tur, yasGun) {
  const y = YASAM[tur];
  const yil = yasGun / YIL_GUN;
  if (yil < y.yavru) return 'yavru';
  if (yil < y.genc) return 'genc';
  if (yil < y.yasli) return 'yetiskin';
  return 'yasli';
}
// Mevcut evreye uygun rastgele yaş (gün)
export function evreyeGoreYas(tur, evre, rng) {
  const y = YASAM[tur];
  const ar = { yavru: [0.05, y.yavru * 0.9], genc: [y.yavru, y.genc], yetiskin: [y.genc, y.yasli], yasli: [y.yasli, y.yasli + (y.omur - y.yasli) * 0.6] }[evre];
  return Math.round((ar[0] + rng() * (ar[1] - ar[0])) * YIL_GUN);
}
export function yasSozu(yasGun) {
  const yil = yasGun / YIL_GUN;
  if (yil < 1) {
    const ay = Math.max(1, Math.round(yil * 12));
    return `yaklaşık ${ay} aylık`;
  }
  return `yaklaşık ${Math.round(yil)} yaşında`;
}
// Yaşlılıkta günlük doğal ölüm olasılığı
export function yaslilikOlumu(tur, yasGun) {
  const y = YASAM[tur];
  const yil = yasGun / YIL_GUN;
  if (yil < y.yasli) return 0;
  const x = (yil - y.yasli) / (y.omur - y.yasli);
  return Math.min(0.2, 0.002 + 0.03 * x * x * x);
}
export const kondisyonSozu = (v) => (v > 0.7 ? 'iyi' : v > 0.45 ? 'orta' : v > 0.25 ? 'zayıf' : 'çok zayıf');

// ---------- Mevsimsel göç (karar 43, 111) ----------
// Göçmen sürüler kurak mevsimde güneye, haritanın dışındaki sulak otlaklara gider; yağmurlarla döner.
export const GOCMENLER = {
  zebra: { gecit: 70, cikis: { x: 128, y: -146 }, yon: 'güneydoğu' },
  gnu: { gecit: 70, cikis: { x: 118, y: -154 }, yon: 'güneydoğu' },
  ceylan: { gecit: -60, cikis: { x: -128, y: -146 }, yon: 'güneybatı' },
};
// Göç kararı: kurak mevsimin ortasında otlak ve su azaldıysa
export function gocGerekli(eko, tk, habitatOt) {
  if (tk.mevsim !== 'kurak' || tk.mevsimGunu < 4) return false;
  return habitatOt < 0.32 || eko.golet < 0.18 || tk.mevsimGunu >= 10;
}
// Dönüş: yağmurlar başlayıp otlar yeşerince
export function donusZamani(eko, tk) {
  return tk.mevsim === 'yagisli' && tk.mevsimGunu >= 2 + (eko.yil ? eko.yil.gecikme : 0) && eko.yesil > 0.45;
}

// ---------- Yangın (karar 23, 76) ----------
export const yangindaMi = (eko, h) => !!(eko.yanan && eko.yanan[h] !== undefined);
export const yananHucreler = (eko) => Object.keys(eko.yanan || {}).map(Number);
export function yanginBaslat(eko, kap, h, dk) {
  if (h < 0 || kap.yanmaz[h] || yangindaMi(eko, h) || eko.ot[h] < 0.2) return false;
  eko.yanan[h] = dk;
  return true;
}
function yanginAdim(eko, kap, dk, dtDk, rng, olaylar) {
  if (!eko.yanan) return;
  // Planlanan tutuşma (kuru fırtınada yıldırım ya da kurak mevsimin sonunda)
  if (eko.yanginPlan && dk >= eko.yanginPlan.dk) {
    const p = eko.yanginPlan;
    eko.yanginPlan = null;
    if (yanginBaslat(eko, kap, p.h, dk)) {
      eko.yanginlar += 1;
      eko.sonYangin = { h: p.h, neden: p.neden, dk, yanan: 1 };
      olaylar.push('yanginBasladi');
    }
  }
  const yanan = yananHucreler(eko);
  if (!yanan.length) return;
  eko.yanginSayac += dtDk;
  if (eko.yanginSayac < 8) return;
  const adim = eko.yanginSayac;
  eko.yanginSayac = 0;
  const yag = eko.yagmurVar;
  const ruzgar = eko.hava ? eko.hava.ruzgarYon : 0;
  const hizR = eko.hava ? eko.hava.ruzgarHiz : 1;
  for (const h of yanan) {
    // Yağmur söndürür
    if (yag && rng() < 0.6) {
      delete eko.yanan[h];
      continue;
    }
    const yas = dk - eko.yanan[h];
    if (yas > 40) {
      delete eko.yanan[h];
      eko.ot[h] = 0.02;
      eko.yaprak[h] = eko.yaprak[h] * 0.6;
      eko.yanik[h] = dk;
      if (eko.sonYangin) eko.sonYangin.yanan = (eko.sonYangin.yanan || 0) + 1;
      continue;
    }
    if (yas < 12) continue;
    const i = h % KENAR;
    const j = Math.floor(h / KENAR);
    for (let di = -1; di <= 1; di++)
      for (let dj = -1; dj <= 1; dj++) {
        if (!di && !dj) continue;
        const ni = i + di;
        const nj = j + dj;
        if (ni < 0 || nj < 0 || ni >= KENAR || nj >= KENAR) continue;
        const n = nj * KENAR + ni;
        if (kap.yanmaz[n] || yangindaMi(eko, n) || (eko.yanik[n] && dk - eko.yanik[n] < 4 * 1440) || eko.ot[n] < 0.25) continue;
        // Rüzgârın estiği yöne doğru daha hızlı yayılır (yön: rüzgârın geldiği taraf)
        const a = Math.atan2(di, dj);
        const ruzgarCarpani = 1 + 0.8 * hizR * Math.cos(a - (ruzgar + Math.PI));
        const p = 0.2 * eko.ot[n] * Math.max(0.05, 1 - eko.islaklik * 2.5) * Math.max(0.2, ruzgarCarpani) * (adim / 10);
        if (rng() < p) eko.yanan[n] = dk;
      }
  }
  if (!yananHucreler(eko).length) olaylar.push('yanginBitti');
}
// Günlük yangın riski: kurak mevsimin sonunda kuru ot ve sıcakta, ya da yağmurların başında kuru fırtınada yıldırım
export function yanginRiski(eko, kap, gun, rng) {
  const tk = takvim(gun);
  if (eko.yanginPlan || yananHucreler(eko).length) return;
  let p = 0;
  let neden = '';
  if (tk.mevsim === 'kurak' && tk.mevsimGunu >= 7 && eko.islaklik < 0.12) {
    p = (eko.hava && eko.hava.tur === 'sicak' ? 0.18 : 0.08) * (eko.yil && eko.yil.kuraklik ? 1.6 : 1);
    neden = 'kuru otlar tutuştu';
  } else if (tk.mevsim === 'yagisli' && tk.mevsimGunu <= 3 && eko.hava && eko.hava.tur === 'saganak' && eko.islaklik < 0.3) {
    p = 0.45;
    neden = 'kuru otlara yıldırım düştü';
  }
  if (rng() >= p * (eko.afetCarpani ?? 1)) return;
  const adaylar = [];
  for (let h = 0; h < eko.ot.length; h++) if (!kap.yanmaz[h] && eko.ot[h] > 0.45) adaylar.push(h);
  if (!adaylar.length) return;
  const h = adaylar[Math.floor(rng() * adaylar.length)];
  const saat = neden.includes('yıldırım') && eko.hava.yagmur[0] ? eko.hava.yagmur[0].bas - 20 : (11 + rng() * 6) * 60;
  eko.yanginPlan = { dk: (gun - 1) * 1440 + saat, h, neden };
}
export function yanginSoz(eko) {
  const n = yananHucreler(eko).length;
  if (!n) return eko.sonYangin ? `Son yangın ${Math.max(0, Object.keys(eko.yanik).length)} hücrelik bir alanı yaktı.` : 'Yangın yok.';
  return `Yangın sürüyor: yaklaşık ${Math.round((n * HUCRE * HUCRE) / 10000 * 10) / 10} hektar alev hattı.`;
}
