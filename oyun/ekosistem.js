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
const OT_KAPASITE = { otlak: 1, agaclik: 0.7, golet: 0.9, nehir: 0.8, sulak: 1, kayalik: 0.35, istasyon: 0.5, galeri: 0.55, termit: 0.9, tepeler: 0.3, calilik: 0.55, baobab: 0.6, dere: 0.5, ova: 1.05, kuzeyOtlak: 0.95 };

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

// Harita büyüyünce (15 Kasım 2026: yarıçap 200 → 320, ızgara 16 → 26) eski kaydın ızgarası yerine göre yeni ızgaraya taşınır.
// Her yeni hücre, eski haritada aynı yere düşen hücrenin değerini alır; eski haritanın dışındaki yeni hücreler kapasitenin %80'iyle başlar.
export function izgaraGoc(eko, kap, eskiKenar = 16, eskiYaricap = 200) {
  const eskiHucre = (x, y) => {
    const i = Math.floor((x + eskiYaricap) / HUCRE);
    const j = Math.floor((y + eskiYaricap) / HUCRE);
    return i < 0 || j < 0 || i >= eskiKenar || j >= eskiKenar ? -1 : j * eskiKenar + i;
  };
  const yeniyeTasi = (eh) => {
    const m = { x: (eh % eskiKenar) * HUCRE - eskiYaricap + HUCRE / 2, y: Math.floor(eh / eskiKenar) * HUCRE - eskiYaricap + HUCRE / 2 };
    return hucre(m.x, m.y);
  };
  const dizi = (eski, kapasite, oran) =>
    kapasite.map((v, h) => {
      const m = hucreMerkezi(h);
      const eh = Math.hypot(m.x, m.y) <= eskiYaricap ? eskiHucre(m.x, m.y) : -1;
      const ev = eh >= 0 && Array.isArray(eski) ? eski[eh] : undefined;
      return Number.isFinite(ev) ? +ev.toFixed(3) : +(v * oran).toFixed(3);
    });
  eko.ot = dizi(eko.ot, kap.ot, 0.8);
  eko.yaprak = dizi(eko.yaprak, kap.yaprak, 0.9);
  ['yanik', 'yanan', 'istilaci'].forEach((alan) => {
    const o = eko[alan];
    if (!o || typeof o !== 'object' || Array.isArray(o)) return;
    const yeni = {};
    Object.keys(o).forEach((h) => {
      const n = yeniyeTasi(Number(h));
      if (n >= 0) yeni[n] = o[h];
    });
    eko[alan] = yeni;
  });
  return eko;
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
  // Aşama 22 (karar 75): uzun vadeli iklim eğilimi (hafif ısınma eğilimli rastgele yürüyüş) ve olağan dışı sıcak dalgası
  if (yil > 1) eko.iklimEgilim = Math.max(-1, Math.min(2.5, (Number.isFinite(eko.iklimEgilim) ? eko.iklimEgilim : 0) + (rng() - 0.4) * 0.6));
  eko.yil.sicakDalga = yil > 1 && rng() < (eko.yil.kuraklik ? 0.5 : 0.25) ? 4 + Math.floor(rng() * 6) : 0; // kurak mevsimin kaçıncı günü başlar
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
  const dalga = tk.mevsim === 'kurak' && yil.sicakDalga && tk.mevsimGunu >= yil.sicakDalga && tk.mevsimGunu < yil.sicakDalga + 3;
  if (dalga) {
    tur = 'sicak';
    yagmur.length = 0;
  }
  const egilim = Number.isFinite(eko.iklimEgilim) ? Math.round(eko.iklimEgilim) : 0;
  const sicaklik = (dalga ? 40 : tur === 'sicak' ? 36 : tk.mevsim === 'kurak' ? 31 : tur === 'saganak' || tur === 'yagmurlu' ? 25 : 28) + egilim;
  // Aşama 22 (karar 23): sağanakların bir kısmı fırtınaya döner (sert rüzgâr, ekipman ve kampa zarar)
  const firtina = tur === 'saganak' && yagmur.length && rng() < 0.3 ? { bas: yagmur[0].bas - 20, bit: yagmur[0].bit } : null;
  // Rüzgâr: kurak mevsimde çoğunlukla doğudan (alize), yağışlıda değişken
  const ruzgarYon = tk.mevsim === 'kurak' ? Math.PI / 2 + (rng() - 0.5) * 1.2 : rng() * Math.PI * 2;
  const ruzgarHiz = firtina ? 3.2 : tur === 'saganak' ? 2 : tur === 'sicak' || tk.mevsim === 'kurak' ? 1.4 : 1;
  eko.hava = { gun, tur, yagmur, sicaklik, ruzgarYon, ruzgarHiz, ...(dalga ? { dalga: true } : {}), ...(firtina ? { firtina } : {}) };
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
// Aşama 26 (karar 74): kirlilik kaynakları eko.kirlilik [{id, tur les|diski|kul, x, y, v, golet}]; bir noktadaki en güçlü kaynak
export function kirlilikKaynagi(eko, x, y, r = 40) {
  if (!eko || !Array.isArray(eko.kirlilik)) return null;
  let en = null;
  for (const s of eko.kirlilik) {
    if (!s || !Number.isFinite(s.v) || !Number.isFinite(s.x) || !Number.isFinite(s.y)) continue;
    if (Math.hypot(s.x - x, s.y - y) > r) continue;
    if (!en || s.v > en.v) en = s;
  }
  return en;
}
export const kirlilikAt = (eko, x, y, r) => {
  const s = kirlilikKaynagi(eko, x, y, r);
  return s ? Math.max(0, Math.min(1, s.v)) : 0;
};
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
  eko.golet = Math.max(0, eko.golet - buhar * gunOrani * (eko.goletRestore ? 0.8 : 1)); // Aşama 12: dibi temizlenip kıyısı ağaçlandırılan gölet daha geç kurur
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
    // Aşama 12: istilacı bitkinin (lantana) yayıldığı hücrede otlak kapasitesi düşer; temizlenince geri gelir
    const kp = kap.ot[h] * (eko.istilaci && eko.istilaci[h] ? 0.65 : 1);
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
  baobab: {
    ad: 'Baobab', bilimsel: 'Adansonia digitata', bicim: 'ağaç', bolge: ['baobab'], ozellik: 'besin',
    tarif: 'Gövdesi bir arabadan geniş, binlerce yıl yaşayabilen dev bir ağaç. Süngerimsi gövdesinde yağmur suyunu depolar; kurakta yapraklarını döker ve çıplak dalları kök gibi göğe uzanır.',
    evre: ['yeni yapraklanmış; gece açan iri beyaz çiçekleri yarasaları çağırıyor', 'tüylü, yeşil meyveleri büyüyor', 'kadife kabuklu, kalın meyveleri dallarda sallanıyor', 'yapraksız; gövdesi biriktirdiği suyla şişkin'],
    tohum: [false, false, true, true],
    analiz: 'Gövde dokusunun büyük kısmı su. Kabuğu soyulsa bile yeniden kabuk bağlıyor; fillerin açtığı derin yaralar yıllarca görülüyor. Meyvesinin kuru özü C vitamini bakımından çok zengin; babunlar ve filler tohumları yayıyor.',
  },
  murAgaci: {
    ad: 'Mür ağacı', bilimsel: 'Commiphora africana', bicim: 'çalı', bolge: ['calilik'], ozellik: 'şifalı',
    tarif: 'Kurak çalılıkların dikenli, kısa boylu ağacı. Kabuğu ince yaprak yaprak soyulur; yarıldığında güzel kokulu bir reçine sızar. Yağmurlar başlayınca yapraktan önce küçük kırmızı çiçekler açar.',
    evre: ['küçük kırmızı çiçekler açmış, ardından yapraklanıyor', 'yeşil yapraklı; gergedanlar ve gerenuklar dallarını kemiriyor', 'küçük kırmızı meyveler olgunlaşıyor', 'yapraklarını dökmüş; kabuğundan reçine sızıyor'],
    tohum: [false, false, true, true],
    analiz: 'Reçinesinde böcek kovucu ve mikrop öldürücü maddeler bulundu. Kara gergedanlar kurakta dallarıyla besleniyor; meyvelerini yiyen kuşlar tohumlarını çalılığa yayıyor.',
  },
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
  // Aşama 25 (karar 98): mağaranın bitkileri
  baldirikara: {
    ad: 'Baldıran kara eğreltisi', bilimsel: 'Adiantum capillus-veneris', bicim: 'eğrelti', bolge: ['magara'], ozellik: 'şifalı', tohumAdi: 'spor',
    tarif: 'Mağaranın ağzında, kayadan su sızan nemli duvarlara tutunmuş, ince kara saplı, yelpaze yapraklı narin bir eğrelti. Işığın yettiği son yerde biter.',
    evre: ['taze yeşil yaprakları kayayı örtmüş', 'yaprak altlarında spor keseleri olgunlaşıyor', 'sporlarını saçıyor', 'sızıntı azaldığı için yaprak uçları kahverengileşmiş'],
    tohum: [false, true, true, false],
    analiz: 'Yapraklarında öksürüğe karşı geleneksel olarak kullanılan maddeler bulundu. Yalnızca sürekli su sızan, gölgeli kayalarda yaşayabiliyor; mağara ağzındaki su sızıntısının yıl boyu sürdüğünü gösteren bir işaret bitkisi.',
  },
  kayaInciri: {
    ad: 'Kaya inciri', bilimsel: 'Ficus abutilifolia', bicim: 'ağaç', bolge: ['magara'], ozellik: 'besin',
    tarif: 'Mağaranın üstündeki kayalara tutunmuş bir incir ağacı. Kökleri çatlaklardan aşağı inip mağara tavanından perde gibi sarkar, yerde su arar.',
    evre: ['tavandan sarkan kökleri ıslak ve parlak', 'yukarıda küçük yeşil incirler oluşmuş', 'olgun kırmızı incirleri meyve yarasalarını çekiyor; yerde çekirdekli dışkılar var', 'kökler kurumuş, birkaç yaprak dökülmüş'],
    tohum: [false, false, true, true],
    analiz: 'Meyveleri şekerce zengin. Tohumların çoğunu meyve yarasaları ve kuşlar taşıyor; kökleri kayayı yavaş yavaş çatlatarak mağaraya su ve besin taşıyor. Mağaradaki böcekler sarkan köklerle besleniyor.',
  },
  // ---------- Kuzey Kutbu (Grönland) ----------
  // kutup: true olanlarda evre sırası [kutup yazı, sonbahar, kutup kışı, ilkbahar]
  kutupSogudu: {
    ad: 'Kutup söğüdü', bilimsel: 'Salix arctica', bicim: 'cüce çalı', bolge: ['tundra', 'kutupIstasyon', 'kiyi'], ozellik: 'besin', kutup: true,
    tarif: 'Yerde sürünen, boyu bir karışı geçmeyen bir söğüt. Gövdesi taşların arasından yayılır; yüz yaşındaki bir kutup söğüdü ancak bilek kalınlığındadır.',
    evre: ['tüylü kedicik çiçekleri pamuk gibi açılmış, yaprakları parlak yeşil', 'yaprakları sararmış, tüylü tohumlarını rüzgâra bırakıyor', 'karın altında; misk öküzleri ve ren geyikleri karı eşeleyip dallarını kemiriyor', 'tomurcukları kar kalkar kalkmaz kabarmış, kutup tavşanları kemiriyor'],
    tohum: [false, true, false, false], tohumAdi: 'tüylü tohum',
    analiz: 'Yaprak ve tomurcuklarında yüksek protein bulundu. Kutup tavşanının, misk öküzünün ve ren geyiğinin en önemli besini. Halkalarına göre bu bitki yaklaşık 80 yaşında; yazlar ısındıkça yıllık büyümesi artıyor.',
  },
  dagAveni: {
    ad: 'Dağ aveni', bilimsel: 'Dryas integrifolia', bicim: 'cüce çalı', bolge: ['tundra', 'buzul'], ozellik: 'besin', kutup: true,
    tarif: 'Taşlık tundrada halı gibi yayılan, beyaz sekiz yapraklı çiçekli bir bitki. Çiçekleri güneşi izler; çanak biçimiyle içini ısıtıp böcekleri çeker.',
    evre: ['beyaz çiçekleri güneşe dönmüş, içinde böcekler ısınıyor', 'çiçekleri tüylü, kıvrık tohum başlarına dönüşmüş', 'karın altında, yaprakları kahverengi ama yeşil kalıyor', 'kar kenarlarında ilk yeşil yapraklar görünüyor'],
    tohum: [false, true, false, false], tohumAdi: 'tüylü tohum başı',
    analiz: 'Kökleri azot bağlayan bakterilerle ortak yaşıyor; buzulun çekildiği çıplak toprağı ilk o yerleşip besler. Çiçeğinin içi dışarıdan birkaç derece sıcak ölçüldü.',
  },
  kutupGelincigi: {
    ad: 'Kutup gelinciği', bilimsel: 'Papaver radicatum', bicim: 'ot', bolge: ['tundra', 'buzul', 'kusYari'], ozellik: 'besin', kutup: true,
    tarif: 'Taşların arasında tek tek açan sarı bir gelincik. İnce sapı rüzgârda eğilir ama kırılmaz; çiçek güneşi gün boyu izler.',
    evre: ['sarı çiçekleri güneşi izliyor', 'kapsülleri kurumuş, rüzgârda sallandıkça tohum serpiyor', 'karın altında, yalnızca kuru kapsüller görünüyor', 'yaprak rozeti kar kalkınca yeşermiş'],
    tohum: [false, true, false, false],
    analiz: 'Dünyanın en kuzeyde açan çiçeklerinden biri. Çanak biçimi güneş ışığını içeriye yoğunlaştırıyor; tohumlar ancak bu ısıyla olgunlaşıyor.',
  },
  pamukOtu: {
    ad: 'Pamuk otu', bilimsel: 'Eriophorum scheuchzeri', bicim: 'ot', bolge: ['kiyi', 'tundra'], ozellik: 'besin', kutup: true,
    tarif: 'Islak tundrada ve kıyı bataklıklarında yetişen, tepesinde beyaz pamuk topu taşıyan bir saz.',
    evre: ['beyaz pamuk topları rüzgârda dalgalanıyor', 'pamuklar dağılıyor, tohumlar uçuşuyor', 'donmuş bataklıkta kuru sapları görünüyor', 'taze sürgünleri kar suyunda yeşermiş'],
    tohum: [false, true, false, false], tohumAdi: 'pamuklu tohum',
    analiz: 'Islak tundranın turba tabakasını oluşturan başlıca bitki. Kökleri donmuş toprağın üst yüzünde yayılıyor; çözülen buzlu toprakta karbon salınımını izlemek için iyi bir gösterge.',
  },
  morTaskiran: {
    ad: 'Mor taşkıran', bilimsel: 'Saxifraga oppositifolia', bicim: 'yastık bitkisi', bolge: ['tundra', 'kusYari', 'buzul', 'kiyi'], ozellik: 'besin', kutup: true,
    tarif: 'Kayaların üstünde mor çiçekli küçük yastıklar oluşturan bir bitki. Baharda çiçek açan ilk bitkidir; karın hemen kenarında açar.',
    evre: ['mor çiçekleri solmuş, küçük kapsüller oluşmuş', 'yastıkları koyu yeşil, kışa hazırlanıyor', 'karın altında, yastığın içinde tomurcuklar bekliyor', 'kar daha erimeden mor çiçeklerle kaplanmış; ilk bombus arıları geliyor'],
    tohum: [true, false, false, false],
    analiz: 'Grönland\'ın en kuzey kıyılarında bile yetişiyor. Yastık biçimi içini dışarıdan birkaç derece sıcak tutuyor. Çiçeklerinin şekeri baharda uyanan bombus arılarının ilk besini.',
  },
  denizYosunu: {
    ad: 'Buz algi', bilimsel: 'Melosira arctica', bicim: 'alg', bolge: ['buz', 'polinya'], ozellik: 'besin', kutup: true,
    tarif: 'Deniz buzunun alt yüzünde metrelerce sarkan yeşil-kahverengi alg perdeleri. Buzun içinden süzülen ışıkla büyür.',
    evre: ['buz eriyip kopan alg perdeleri dibe çöküyor', 'yeni buz oluşurken ilk hücreler buzun içine kapanıyor', 'karanlıkta buzun içinde uyuyor', 'güneş dönünce buzun altında perdeler hızla uzuyor'],
    tohum: [false, false, false, false],
    analiz: 'Kutup denizindeki yıllık üretimin önemli bir kısmı buzun altındaki bu alglerden geliyor. Kopepodlar ve arktik morinalar onlarla, foklar ve belugalar onlarla beslenir. Buz azaldıkça bu üretim de azalıyor.',
  },
  // ---- Antarktika (guney: true; evre güney takvimine göre) ----
  antCimeni: {
    ad: 'Antarktika çimeni', bilimsel: 'Deschampsia antarctica', bicim: 'ot', bolge: ['kayaBurnu', 'antKiyi'], ozellik: 'besin', kutup: true, guney: true,
    tarif: 'Antarktika\'da yetişen yalnızca iki çiçekli bitkiden biri. Kayaların arasındaki korunaklı köşelerde küçük, sık öbekler oluşturur.',
    evre: ['kısa yaz güneşinde yeşermiş, rüzgârda küçük başaklar sallıyor', 'başakları sararmış, tohumlarını döküyor', 'kar ve buz altında; donmuş hâlde bekliyor', 'kar kalkınca yaprakları birkaç gün içinde yeşeriyor'],
    tohum: [false, true, false, false],
    analiz: 'Hücrelerinde donmayı önleyen şekerler ve proteinler var; yaprakları eksi 25 dereceye dayanıyor. Isınan yazlarda yayılış alanının genişlediği gözleniyor.',
  },
  antInciotu: {
    ad: 'Antarktika inci otu', bilimsel: 'Colobanthus quitensis', bicim: 'yastık bitkisi', bolge: ['kayaBurnu'], ozellik: 'besin', kutup: true, guney: true,
    tarif: 'Kıtanın öbür çiçekli bitkisi: yere yapışık, sarımsı yeşil küçük bir yastık. Çiçekleri çok küçüktür ve çoğu zaman açmadan kendi kendini döller.',
    evre: ['yastığın üstünde küçük sarı çiçekler', 'tohum kapsülleri olgunlaşmış', 'kar altında', 'yeni sürgünler veriyor'],
    tohum: [false, true, false, false],
    analiz: 'Güçlü morötesi ışığa karşı yapraklarında koruyucu boyalar biriktiriyor. Penguen kolonilerinin guanoyla gübrelediği kayalar çevresinde daha gür.',
  },
  karAlgi: {
    ad: 'Kırmızı kar algi', bilimsel: 'Chlamydomonas nivalis', bicim: 'alg', bolge: ['antKiyi', 'buzOrtusu', 'antUs', 'sahanlik'], ozellik: 'besin', kutup: true, guney: true,
    tarif: 'Yazın eriyen karın yüzeyinde yeşil, turuncu ya da kan kırmızısı lekeler oluşturan tek hücreli bir alg. Kırmızı rengi, güneşten korunmak için biriktirdiği boyadan gelir.',
    evre: ['karın yüzeyi kıpkırmızı lekelerle kaplı', 'lekeler solmuş; hücreler kalın çeperli dinlenme evresine geçiyor', 'karın içinde uyuyor', 'ilk eriyen karda yeşil lekeler beliriyor'],
    tohum: [false, false, false, false],
    analiz: 'Koyu renkli lekeler güneşi daha çok soğurup karın daha hızlı erimesine yol açıyor; ısınan yazlarda kar algi alanlarının genişlediği ölçülüyor.',
  },
  turuncuLiken: {
    ad: 'Turuncu kaya likeni', bilimsel: 'Xanthoria elegans', bicim: 'liken', bolge: ['kayaBurnu', 'antKiyi', 'antUs'], ozellik: 'besin', kutup: true, guney: true,
    tarif: 'Kayaları turuncuya boyayan bir liken: bir mantar ile bir algin ortak yaşamı. Kuşların konduğu, guanoyla gübrelenen kayalarda en parlaktır.',
    evre: ['ıslak ve parlak turuncu', 'kurumuş, rengi koyulaşmış', 'donmuş ama canlı; birkaç saatlik güneşte bile fotosentez yapabiliyor', 'kar suyuyla yeniden canlanıyor'],
    tohum: [false, false, false, false],
    analiz: 'Yılda yalnızca birkaç milimetre büyüyor; çapından kayanın buzdan ne zaman kurtulduğu hesaplanabiliyor. Antarktika kayalarında yüzlerce yaşında likenler var.',
  },
  // ---- Hindistan ormanı (hindistan: true; mevsimler muson, muson sonrası, serin kış, kavurucu yaz) ----
  sal: {
    ad: 'Sal ağacı', bilimsel: 'Shorea robusta', bicim: 'ağaç', bolge: ['salOrmani', 'hnUs', 'maidan'], ozellik: 'besin', kutup: true, hindistan: true,
    tarif: 'Uzun, düz gövdeli, iri yapraklı bir orman ağacı. Orta Hindistan ormanlarının çoğunu oluşturur. Yaprakları köylülerin tabağı olur.',
    evre: ['muson yağmurlarıyla yemyeşil', 'kanatlı tohumları rüzgârla dönerek düşüyor', 'yaprakları sertleşmiş, gölgesi serin', 'yapraklarını döküp yenilerini sürüyor; kremsi çiçek salkımları açmış'],
    tohum: [true, false, false, false],
    analiz: 'Sal tohumları muson başlarken düşer ve hemen çimlenir; kuru toprakta birkaç gün içinde canlılığını yitirir. Bu yüzden ormanın yenilenmesi musonun zamanında gelmesine bağlı.',
  },
  bambu: {
    ad: 'Kalın bambu', bilimsel: 'Dendrocalamus strictus', bicim: 'ot', bolge: ['bambuluk', 'hnDere'], ozellik: 'besin', kutup: true, hindistan: true,
    tarif: 'Sık kümeler hâlinde büyüyen, ağaç boyuna ulaşan bir ot. Filler ve gaurlar sürgünlerini yer.',
    evre: ['muson yağmurlarıyla yeni sürgünler günde yarım metre uzuyor', 'yeni sürgünler sertleşiyor', 'kuru yapraklar dökülüyor', 'gövdeler sararmış, rüzgârda gıcırdıyor'],
    tohum: [false, false, false, false],
    analiz: 'Bu bambu onlarca yılda bir, bütün bölgede aynı anda çiçek açıp tohum verir ve sonra kurur. O yıllarda tohumla beslenen fareler patlar.',
  },
  mahua: {
    ad: 'Mahua', bilimsel: 'Madhuca longifolia', bicim: 'ağaç', bolge: ['maidan', 'hnUs', 'salOrmani'], ozellik: 'besin', kutup: true, hindistan: true,
    tarif: 'Çayırların kenarında, tatlı kokulu etli çiçekler açan bir ağaç. Çiçekleri yere döküldüğünde ayılar, geyikler, maymunlar ve insanlar toplamaya gelir.',
    evre: ['yeşil ve gür', 'meyveleri olgunlaşıyor', 'yapraklarını döküyor', 'gece boyunca krem rengi çiçeklerini yere döküyor; altı geyiklerle dolu'],
    tohum: [false, true, false, false],
    analiz: 'Çiçeklerin şeker oranı çok yüksek; kavurucu yazın başında ormanın en önemli besin kaynaklarından biri.',
  },
  // ---- Moğol bozkırı (mogol: true; mevsimler bozkır yazı, sonbahar, sert kış, rüzgârlı ilkbahar) ----
  tuyluOt: {
    ad: 'Tüylü sorguç otu', bilimsel: 'Stipa krylovii', bicim: 'ot', bolge: ['bozkir', 'mgUs', 'mgDere'], ozellik: 'besin', kutup: true, mogol: true,
    tarif: 'Bozkırın asıl otu: ince, sert yapraklı tutamlar hâlinde büyür, rüzgârda gümüşi dalgalar yapar. Atların, ceylanların ve antilopların başlıca besini.',
    evre: ['yemyeşil ve boylu; tüylü uzun kılçıkları rüzgârda savruluyor', 'sararmış; tohumlarını rüzgâra bırakıyor', 'kuru ve karın altında; hayvanlar karı kazıp onu yiyor', 'yeni yeşil sürgünler kuru tutamların arasından çıkıyor'],
    tohum: [true, true, false, false],
    analiz: 'Kuru otun bile besin değeri yüksek; kurumuş hâliyle de kışın bütün otçulları taşıyor. Aşırı otlatılan yerlerde yerini acı otlara bırakıyor.',
  },
  bozkirPelini: {
    ad: 'Bozkır pelini', bilimsel: 'Artemisia frigida', bicim: 'çalı', bolge: ['bozkir', 'kumul', 'mgDag'], ozellik: 'ilac', kutup: true, mogol: true,
    tarif: 'Gümüşi yapraklı, keskin kokulu küçük bir çalı. Ezince ortalığa bir ilaç kokusu yayılır. Göçebeler onu gerlerinde tütsü olarak yakar.',
    evre: ['gümüşi yaprakları gür', 'küçük sarı çiçekleri açmış', 'kurumuş, karın altında kokusunu koruyor', 'yeniden sürüyor'],
    tohum: [false, true, false, false],
    analiz: 'Yapraklarındaki acı maddeler böcekleri uzak tutuyor. Kışın aç kalan otçullar ondan da yiyor; bazı hayvanlarda bağırsak parazitlerini azaltıyor olabilir.',
  },
  sibiryaKayisisi: {
    ad: 'Sibirya kayısısı', bilimsel: 'Prunus sibirica', bicim: 'çalı', bolge: ['mgDag', 'mgDere'], ozellik: 'besin', kutup: true, mogol: true,
    tarif: 'Kayalık yamaçlarda büyüyen, soğuğa çok dayanıklı küçük bir kayısı ağacı. İlkbaharda yaprak açmadan pembe-beyaz çiçeklerle örtülür.',
    evre: ['küçük, ekşi meyveleri olgunlaşıyor', 'yaprakları kızıla döndü', 'çıplak dalları karla kaplı', 'yapraksız dallarında pembe-beyaz çiçekler'],
    tohum: [true, false, false, false],
    analiz: 'Meyvelerini kemirgenler ve kuşlar taşıyıp saklıyor; yamaçtaki kayısıların çoğu unutulmuş saklama yerlerinden çıkmış.',
  },
  // ---- Yeni haritalar (harita: '<id>'; mevsimler o haritanın takvimine göre: yaz, sonbahar, kış, ilkbahar) ----
  kauçukAgaci: {
    ad: 'Kapok ağacı', bilimsel: 'Ceiba pentandra', bicim: 'ağaç', bolge: ['varzea', 'terraFirme'], ozellik: 'besin', kutup: true, harita: 'amazon',
    tarif: 'Ormanın üstünden yükselen dev bir ağaç; gövdesinin dibinde duvar gibi kök payandaları var. Tohumlarını pamuksu liflerle rüzgâra bırakır. Amazon halkları onu kutsal sayar.',
    evre: ['su gövdesinin dibine kadar yükselmiş', 'pamuksu tohum kapsülleri açılıyor', 'yapraklarını döktü; çıplak dallarında çiçekler, yarasalar nektarını içiyor', 'yeni yapraklar açtı'],
    tohum: [false, true, false, false],
    analiz: 'Gece açan çiçekleri yarasalarla tozlaşıyor; dallarındaki bromelyalar yüzlerce hayvana ev oluyor.',
  },
  devNilufer: {
    ad: 'Dev nilüfer (Victoria)', bilimsel: 'Victoria amazonica', bicim: 'ot', bolge: ['cocha'], ozellik: 'su', kutup: true, harita: 'amazon',
    tarif: 'Yaprakları iki metreyi bulan, kenarları kalkık dev bir nilüfer; yaprağın altı dikenlidir. Çiçeği ilk gece beyaz açar, ikinci gece pembeleşir.',
    evre: ['yapraklar göl yüzeyini kaplamış', 'beyaz-pembe çiçekler açıyor', 'göl alçaldı, yapraklar küçüldü', 'yeni yapraklar kıvrık hâlde suyun yüzüne çıkıyor'],
    tohum: [false, true, false, false],
    analiz: 'Çiçeği ilk gece ısınıp hoş kokar, içine giren böcekleri bir gece hapseder; ertesi gün çiçek polenle kaplı böcekleri bırakır.',
  },
  pelinYs: {
    ad: 'Büyük pelin (sagebrush)', bilimsel: 'Artemisia tridentata', bicim: 'çalı', bolge: ['pelinlik', 'lamar', 'ysUs'], ozellik: 'besin', kutup: true, harita: 'yellowstone',
    tarif: 'Gri-yeşil, keskin kokulu, diz boyu bir çalı; Amerikan batısının simgesi. Kışın karın üstünde kalan yapraklarıyla çatal boynuzlu antiloplar onunla beslenir.',
    evre: ['gri-yeşil yaprakları gür', 'küçük sarı çiçekleri açtı', 'karın üstünden çıkan dalları antiloplara besin', 'yeni yaprak sürüyor'],
    tohum: [false, true, false, false],
    analiz: 'Yapraklarındaki kokulu yağlar birçok hayvanı uzak tutar; çatal boynuzlu antilopun midesi bu yağları sindirmeye uyum sağlamıştır.',
  },
  kavakYs: {
    ad: 'Titrek kavak', bilimsel: 'Populus tremuloides', bicim: 'ağaç', bolge: ['lamarNehri', 'camOrmani', 'ysDag'], ozellik: 'besin', kutup: true, harita: 'yellowstone',
    tarif: 'Beyaz gövdeli, yaprakları en hafif rüzgârda titreyen bir kavak. Yüzlerce gövde aslında tek bir kökten çıkan tek bir canlıdır.',
    evre: ['yeşil yapraklar rüzgârda titriyor', 'yapraklar altın sarısına döndü', 'çıplak dallar; geyikler kabuğunu kemiriyor', 'yeni yapraklar açıyor'],
    tohum: [true, false, false, false],
    analiz: 'Kurtlar dönmeden önce geyikler genç kavakları yiyip büyütmüyordu; kurtlardan sonra kıyılarda yeni kavaklar boy attı. Bu, "korku manzarası"nın en ünlü örneği.',
  },
  dipterokarpAgaci: {
    ad: 'Dipterokarp ağacı', bilimsel: 'Dipterocarpaceae', bicim: 'ağaç', bolge: ['dipterokarp', 'bnKiyi'], ozellik: 'besin', kutup: true, harita: 'borneo',
    tarif: 'Altmış metreyi aşan, düz gövdeli dev orman ağaçları. Tohumlarının iki kanadı vardır; düşerken helikopter gibi döner.',
    evre: ['yapraklar koyu yeşil', 'yeni pembe yapraklar açtı', 'yaprakları yeşil, sessiz', 'yıllar sonra topluca çiçek açtı ve tohum yağdırıyor'],
    tohum: [false, false, false, true],
    analiz: 'Birkaç yılda bir bütün orman aynı anda tohum verir; tohum yiyen hayvanlar hepsini yetiştiremez ve bir kısmı filizlenir. Sakallı domuzlar bu bolluğu izleyerek göç eder.',
  },
  bogucuIncir: {
    ad: 'Boğucu incir', bilimsel: 'Ficus', bicim: 'ağaç', bolge: ['dipterokarp', 'bnKiyi', 'kirectasi'], ozellik: 'besin', kutup: true, harita: 'borneo',
    tarif: 'Başka bir ağacın tepesinde filizlenip köklerini aşağı salan, zamanla konak ağacı sarıp boğan bir incir. Yıl boyu meyve verir.',
    evre: ['meyveli', 'meyveli; boynuzgagalar ve orangutanlar toplanıyor', 'meyveli', 'meyveli'],
    tohum: [true, true, true, true],
    analiz: 'Başka meyvelerin olmadığı aylarda bile meyve verdiği için ormanın "can simidi"dir; orangutanlar ve boynuzgagalar kıtlıkta ona bağlıdır.',
  },
  demirhindi: {
    ad: 'Demirhindi', bilimsel: 'Tamarindus indica', bicim: 'ağaç', bolge: ['galeriMd', 'mdUs', 'mdNehir'], ozellik: 'besin', kutup: true, harita: 'madagaskar',
    tarif: 'Galeri ormanının en önemli ağacı: geniş tepeli, ince yapraklı. Kahverengi baklalarındaki ekşi tatlı meyveyi lemurlar çok sever.',
    evre: ['yemyeşil', 'baklalar olgunlaşıyor', 'baklalar dökülüyor; halka kuyruklu lemurların başlıca besini', 'yeni yapraklar'],
    tohum: [false, true, true, false],
    analiz: 'Kurak mevsimde halka kuyruklu lemurların beslenmesinin yarısı bu ağaçtan geliyor; ağaçlar kesildikçe lemur sürüleri küçülüyor.',
  },
  didierea: {
    ad: 'Ahtapot ağacı (Didierea)', bilimsel: 'Didierea madagascariensis', bicim: 'çalı', bolge: ['dikenli', 'baobabMd'], ozellik: 'besin', kutup: true, harita: 'madagaskar',
    tarif: 'Gövdesi baştan aşağı uzun dikenlerle kaplı, kaktüse benzeyen ama kaktüs olmayan, yalnız Madagaskar\'da yetişen bir bitki. Dalları ahtapot kolları gibi kıvrılır.',
    evre: ['dikenlerinin arasında küçük yapraklar', 'yapraklar dökülüyor', 'çıplak, yalnız dikenli gövde', 'küçük çiçekler açtı'],
    tohum: [false, true, false, false],
    analiz: 'Sifakalar dikenlere hiç takılmadan bu gövdelerin arasında sıçrar; avuçlarındaki kalın deri onları korur.',
  },
  madagaskarBaobabi: {
    ad: 'Grandidier baobabı', bilimsel: 'Adansonia grandidieri', bicim: 'ağaç', bolge: ['baobabMd'], ozellik: 'su', kutup: true, harita: 'madagaskar',
    tarif: 'Otuz metreye yükselen, sütun gibi düz gövdeli dev bir baobab; dalları yalnız tepesinde. Gövdesinde yüz binlerce litre su depolar.',
    evre: ['tepesi yapraklı', 'çiçekleri gece açıyor; fare lemurları nektar içiyor', 'yapraksız', 'yapraklanıyor'],
    tohum: [false, true, false, false],
    analiz: 'Çiçekleri geceleri lemurlar ve şahin güveleriyle tozlaşıyor. Eskiden tohumlarını yayan dev hayvanlar tükendiği için genç baobab çok az.',
  },
  // ---- Avustralya çalılığı (avustralya: true; mevsimleri güney takvimine göre) ----
  nehirOkaliptusu: {
    ad: 'Nehir kırmızı okaliptüsü', bilimsel: 'Eucalyptus camaldulensis', bicim: 'ağaç', bolge: ['kuruDere', 'billabong', 'okaliptus'], ozellik: 'su', kutup: true, avustralya: true,
    tarif: 'Dere yataklarını sıralayan, beyaz ve gri benekli gövdeli dev bir okaliptüs. Kökleri derin yeraltı suyuna ulaşır; taşkınlarda haftalarca suda kalabilir.',
    evre: ['muson yağmurlarıyla yeni yapraklar sürmüş', 'kabuğunu şeritler hâlinde döküyor', 'kuraklıkta yaprakları sarkık, gölgesi hayvanlarla dolu', 'kremsi çiçekler açmış; kuşlar ve yarasalar nektarını içiyor'],
    tohum: [false, true, false, false],
    analiz: 'Kovukları papağanların, kookaburraların ve yarasaların yuvası. Dere boyundaki bu ağaçlar olmasa billabong kıyısı yazın kavrulurdu.',
  },
  spinifex: {
    ad: 'Spinifex', bilimsel: 'Triodia', bicim: 'ot', bolge: ['spinifex', 'avTermit'], ozellik: 'besin', kutup: true, avustralya: true,
    tarif: 'Tepecikler hâlinde büyüyen, iğne gibi sert yapraklı bir çöl otu. Kum ve rüzgârı tutar; içi kertenkelelere ve küçük keselilere sığınak olur.',
    evre: ['yağmurla yeşermiş, başaklanmış', 'tohumlarını döküyor', 'kuru ve reçineli; yangına çok yatkın', 'kuru tepeciklerin dibinden yeni sürgünler'],
    tohum: [false, true, false, false],
    analiz: 'Yapraklarındaki reçine Aborjin halklarının yapıştırıcısıydı. Spinifex yangından sonra köklerinden hızla yeniden sürer.',
  },
  mitchellOtu: {
    ad: 'Mitchell otu', bilimsel: 'Astrebla lappacea', bicim: 'ot', bolge: ['avOtlak', 'avUs'], ozellik: 'besin', kutup: true, avustralya: true,
    tarif: 'İç kesimlerin kurağa dayanıklı, besleyici yem otu. Kanguru sürülerinin başlıca besini.',
    evre: ['yemyeşil ve gür; kangurular yavrularını büyütüyor', 'başakları olgunlaşmış', 'saman rengi, kuru ama yine de besleyici', 'kök boğazından taze sürgünler'],
    tohum: [false, true, false, false],
    analiz: 'Kurakta kuruyup "ayakta saman" olur, besin değerini kaybetmez; bu sayede otlak kuraklıkta da hayvanları besler.',
  },
  mulga: {
    ad: 'Mulga akasyası', bilimsel: 'Acacia aneura', bicim: 'ağaç', bolge: ['avOtlak', 'kumtasi', 'spinifex'], ozellik: 'besin', kutup: true, avustralya: true,
    tarif: 'Yaprakları yağmuru gövdeye doğru akıtan, huni gibi dallı küçük bir akasya. Kuraklıkta hayvanların yaprak yediği son ağaçtır.',
    evre: ['yağmur suyunu köklerine topluyor', 'kanatlı tohumlu baklalar sarkıyor', 'gri yapraklarıyla kuraklığa dayanıyor', 'altın sarısı çiçek başakları açmış'],
    tohum: [false, true, false, false],
    analiz: 'Kökleri havadaki azotu bağlayan bakterilerle yaşar; mulga altındaki toprak çevresinden daha verimli ölçülür.',
  },
  nilufer: {
    ad: 'Mavi nilüfer', bilimsel: 'Nymphaea violacea', bicim: 'su bitkisi', bolge: ['billabong'], ozellik: 'su', kutup: true, avustralya: true,
    tarif: 'Billabongun yüzeyini kaplayan yuvarlak yapraklı, mor-mavi çiçekli bir nilüfer. Jakanalar yapraklarının üstünde yürür.',
    evre: ['su yüzeyi çiçeklerle kaplı', 'tohum kapsülleri suya gömülüyor', 'su çekildi; yumru kökleriyle çamurda bekliyor', 'ilk yapraklar suyun yüzüne çıkıyor'],
    tohum: [false, true, false, false],
    analiz: 'Yaprakları suyu gölgeleyip sıcağı azaltıyor; billabongun yazın balıklar için yaşanabilir kalmasına yardım ediyor.',
  },
  antBuzAlgi: {
    ad: 'Deniz buzu diatomları', bilimsel: 'Fragilariopsis cylindrus', bicim: 'alg', bolge: ['antBuz', 'antPolinya'], ozellik: 'besin', kutup: true, guney: true,
    tarif: 'Deniz buzunun alt yüzünü kahverengiye boyayan tek hücreli algler. Kışın krillerin başlıca besini.',
    evre: ['buz çözülürken suya dökülüyor', 'yeni buzun içine kapanıyor', 'karanlıkta buzun içinde yavaşça yaşıyor', 'güneş dönünce buzun altı kahverengi bir perdeyle kaplanıyor'],
    tohum: [false, false, false, false],
    analiz: 'Kriller kışı bu alglerle geçiriyor; deniz buzu azaldığı yıllarda kril, dolayısıyla Adélie pengueni sayıları da düşüyor.',
  },
};
export const BITKI_SIRASI = Object.keys(BITKILER);
// Kutup bitkilerinin evresi kutup takvimine göre (yıl 24 gün: 1-8 yaz, 9-12 sonbahar, 13-20 kış, 21-24 ilkbahar)
const kutupEvreNo = (gun) => {
  const yg = ((((gun - 1) % YIL_GUN) + YIL_GUN) % YIL_GUN) + 1;
  return yg <= 8 ? 0 : yg <= 12 ? 1 : yg <= 20 ? 2 : 3;
};
export const KUTUP_EVRE_ADI = { yE: 'kutup yazı', yG: 'sonbahar', kE: 'kutup kışı', kG: 'ilkbahar' };
export const OZELLIK_ADI = { besin: 'önemli bir besin bitkisi', su: 'suyu temizleyen bir bitki', zehirli: 'zehirli', 'şifalı': 'şifalı' };
export function bitkiEvresi(id, gun, eko) {
  if (BITKILER[id].kutup) {
    const i = kutupEvreNo(gun + (BITKILER[id].guney || BITKILER[id].avustralya ? 12 : 0)); // Hindistan kaymasız // güney yarıkürede mevsimler tersine

    return { anahtar: ['yE', 'yG', 'kE', 'kG'][i], mevsim: ['yaz', 'sonbahar', 'kis', 'ilkbahar'][i], metin: BITKILER[id].evre[i], tohum: BITKILER[id].tohum[i] };
  }
  const tk = takvim(gun);
  const i = (tk.mevsim === 'yagisli' ? 0 : 2) + (tk.erken ? 0 : 1);
  let metin = BITKILER[id].evre[i];
  if (eko && eko.yil && eko.yil.kuraklik && tk.mevsim === 'kurak' && !tk.erken) metin += '; kuraklıktan solmuş';
  return { anahtar: ['yE', 'yG', 'kE', 'kG'][i], mevsim: tk.mevsim, metin, tohum: BITKILER[id].tohum[i] };
}
// Dış bölgelerde, kendi bitkilerinin yanında benzer eski bölgenin bitkileri de yetişir (tepeler kayalık gibi, ova otlak gibi)
const BITKI_BENZER = { tepeler: 'kayalik', calilik: 'agaclik', baobab: 'otlak', dere: 'nehir', ova: 'otlak', kuzeyOtlak: 'otlak' };
export const bolgedekiBitkiler = (bolge) => BITKI_SIRASI.filter((id) => BITKILER[id].bolge.includes(bolge) || (BITKI_BENZER[bolge] && BITKILER[id].bolge.includes(BITKI_BENZER[bolge])));

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
  jaguar: { yavru: 1.5, genc: 3, yasli: 11, omur: 15 }, tapir: { yavru: 1, genc: 3, yasli: 20, omur: 28 }, kapibara: { yavru: 0.5, genc: 1.5, yasli: 7, omur: 9 },
  pekari: { yavru: 0.5, genc: 1.5, yasli: 10, omur: 13 }, uluyanMaymun: { yavru: 1, genc: 4, yasli: 14, omur: 18 }, pembeYunus: { yavru: 2, genc: 5, yasli: 25, omur: 32 },
  karaKaiman: { yavru: 2, genc: 6, yasli: 50, omur: 60 }, devSuSamuru: { yavru: 0.7, genc: 2, yasli: 10, omur: 13 },
  bozAyi: { yavru: 2, genc: 4, yasli: 20, omur: 26 }, griKurt: { yavru: 0.8, genc: 2, yasli: 8, omur: 11 }, bizon: { yavru: 1, genc: 3, yasli: 15, omur: 20 },
  wapiti: { yavru: 1, genc: 2, yasli: 14, omur: 18 }, sigin: { yavru: 1, genc: 3, yasli: 14, omur: 18 }, catalBoynuz: { yavru: 0.8, genc: 1.5, yasli: 9, omur: 12 },
  puma: { yavru: 1.5, genc: 2.5, yasli: 10, omur: 13 }, coyote: { yavru: 0.8, genc: 1.5, yasli: 9, omur: 12 },
  orangutan: { yavru: 7, genc: 12, yasli: 40, omur: 50 }, hortumluMaymun: { yavru: 1, genc: 4, yasli: 16, omur: 20 }, borneoFili: { yavru: 3, genc: 12, yasli: 50, omur: 60 },
  bulutluLeopar: { yavru: 1, genc: 2, yasli: 10, omur: 14 }, gunesAyisi: { yavru: 2, genc: 3, yasli: 20, omur: 25 }, sakalliDomuz: { yavru: 0.5, genc: 1.5, yasli: 10, omur: 14 },
  tuzluSuTimsahi: { yavru: 2, genc: 10, yasli: 60, omur: 70 },
  halkaKuyruk: { yavru: 1, genc: 2.5, yasli: 15, omur: 18 }, sifaka: { yavru: 1, genc: 4, yasli: 18, omur: 22 }, kizilAlinliLemur: { yavru: 1, genc: 2, yasli: 15, omur: 20 },
  fossa: { yavru: 1, genc: 3, yasli: 15, omur: 20 }, ayAy: { yavru: 2, genc: 3, yasli: 18, omur: 23 }, radyalKaplumbaga: { yavru: 5, genc: 15, yasli: 80, omur: 100 },
  caliDomuzu: { yavru: 0.5, genc: 1.5, yasli: 12, omur: 15 },
  oselo: { yavru: 1, genc: 2, yasli: 10, omur: 13 }, aguti: { yavru: 0.3, genc: 1, yasli: 10, omur: 13 }, paka: { yavru: 0.5, genc: 1, yasli: 10, omur: 13 },
  kirmiziMazama: { yavru: 0.7, genc: 1.5, yasli: 10, omur: 14 }, beyazUakari: { yavru: 1, genc: 4, yasli: 15, omur: 20 }, tukuxi: { yavru: 1.5, genc: 6, yasli: 25, omur: 35 },
  amazonManati: { yavru: 2, genc: 8, yasli: 25, omur: 30 }, gozlukluKayman: { yavru: 1.5, genc: 5, yasli: 30, omur: 40 },
  karaAyi: { yavru: 1.5, genc: 3, yasli: 18, omur: 23 }, katirGeyigi: { yavru: 0.7, genc: 1.5, yasli: 9, omur: 12 }, dagKoyunu: { yavru: 1, genc: 2, yasli: 10, omur: 14 },
  karKecisi: { yavru: 1, genc: 2.5, yasli: 11, omur: 15 }, kuzeySuSamuru: { yavru: 0.7, genc: 2, yasli: 10, omur: 13 }, kizilVasak: { yavru: 0.8, genc: 1.5, yasli: 9, omur: 12 },
  domuzKuyrukluMakak: { yavru: 1, genc: 3, yasli: 20, omur: 26 }, gumusLangur: { yavru: 1, genc: 3, yasli: 16, omur: 20 }, suVarani: { yavru: 1, genc: 3, yasli: 12, omur: 15 },
  borneoSambari: { yavru: 1, genc: 2, yasli: 14, omur: 18 }, fareGeyigi: { yavru: 0.3, genc: 0.6, yasli: 9, omur: 12 }, binturong: { yavru: 1, genc: 2.5, yasli: 15, omur: 20 },
  duzTuyluSamur: { yavru: 0.7, genc: 2, yasli: 10, omur: 13 },
  devSican: { yavru: 0.7, genc: 1.5, yasli: 9, omur: 12 }, darCizgiliMongoz: { yavru: 0.5, genc: 1, yasli: 10, omur: 13 }, dumerilBoasi: { yavru: 1, genc: 3, yasli: 18, omur: 22 },
  orumcekKaplumbagasi: { yavru: 4, genc: 12, yasli: 60, omur: 70 }, mirza: { yavru: 0.5, genc: 1.5, yasli: 12, omur: 15 },
  devekusu: { yavru: 1, genc: 3, yasli: 30, omur: 40 }, eland: { yavru: 1, genc: 3, yasli: 15, omur: 20 },
  topi: { yavru: 0.8, genc: 2, yasli: 11, omur: 15 }, kongoni: { yavru: 0.8, genc: 2, yasli: 12, omur: 16 },
  suAntilopu: { yavru: 0.8, genc: 2, yasli: 13, omur: 18 }, grantCeylani: { yavru: 0.7, genc: 1.5, yasli: 10, omur: 13 },
  karakulak: { yavru: 0.7, genc: 1.5, yasli: 12, omur: 16 }, beisaOriks: { yavru: 0.8, genc: 2, yasli: 15, omur: 20 },
  yabanKopegi: { yavru: 1, genc: 2, yasli: 8, omur: 11 },
  babun: { yavru: 1.5, genc: 6, yasli: 20, omur: 28 },
  kutupAyisi: { yavru: 2.5, genc: 5, yasli: 20, omur: 28 },
  halkaliFok: { yavru: 1, genc: 5, yasli: 25, omur: 32 },
  mors: { yavru: 2, genc: 8, yasli: 30, omur: 40 },
  beluga: { yavru: 2, genc: 6, yasli: 30, omur: 40 },
  renGeyigi: { yavru: 1, genc: 3, yasli: 12, omur: 16 },
  miskOkuzu: { yavru: 1, genc: 3, yasli: 15, omur: 22 },
  kutupKurdu: { yavru: 1, genc: 2, yasli: 9, omur: 13 },
  kutupTilkisi: { yavru: 0.5, genc: 1, yasli: 4, omur: 6 },
  kutupTavsani: { yavru: 0.4, genc: 1, yasli: 4, omur: 5 },
  imparatorPengueni: { yavru: 0.5, genc: 4, yasli: 18, omur: 22 },
  adeliPengueni: { yavru: 0.3, genc: 3, yasli: 13, omur: 17 },
  weddellFoku: { yavru: 1, genc: 4, yasli: 22, omur: 28 },
  yengecYiyenFok: { yavru: 1, genc: 3, yasli: 20, omur: 25 },
  gronlandBalinasi: { yavru: 2, genc: 20, yasli: 150, omur: 200 },
  gronlandFoku: { yavru: 0.5, genc: 4, yasli: 25, omur: 30 },
  kapucinFok: { yavru: 0.5, genc: 4, yasli: 25, omur: 30 },
  kurtPorsugu: { yavru: 1, genc: 2, yasli: 10, omur: 13 },
  rossFoku: { yavru: 1, genc: 3, yasli: 16, omur: 20 },
  kurkluFok: { yavru: 1, genc: 3, yasli: 18, omur: 23 },
  minkeBalina: { yavru: 1.5, genc: 7, yasli: 40, omur: 50 },
  kamburBalina: { yavru: 1.5, genc: 8, yasli: 45, omur: 55 },
  maviBalina: { yavru: 1.5, genc: 9, yasli: 70, omur: 85 },
  leoparFoku: { yavru: 1, genc: 4, yasli: 20, omur: 26 },
  orka: { yavru: 2, genc: 10, yasli: 45, omur: 60 },
  filFoku: { yavru: 1, genc: 4, yasli: 16, omur: 20 },
  kirmiziKanguru: { yavru: 0.5, genc: 2, yasli: 12, omur: 16 },
  koala: { yavru: 0.6, genc: 2, yasli: 11, omur: 14 },
  emu: { yavru: 0.5, genc: 2, yasli: 12, omur: 16 },
  vombat: { yavru: 0.7, genc: 2, yasli: 13, omur: 17 },
  dingo: { yavru: 0.5, genc: 1, yasli: 8, omur: 11 },
  kaplan: { yavru: 1, genc: 2.5, yasli: 12, omur: 16 },
  hintLeopari: { yavru: 1, genc: 2, yasli: 12, omur: 15 },
  bozKanguru: { yavru: 1, genc: 2, yasli: 15, omur: 20 },
  euro: { yavru: 1, genc: 2, yasli: 14, omur: 18 },
  kayaValabisi: { yavru: 0.5, genc: 1.5, yasli: 10, omur: 14 },
  bilbi: { yavru: 0.3, genc: 0.6, yasli: 5, omur: 7 },
  kuol: { yavru: 0.3, genc: 0.8, yasli: 3, omur: 5 },
  perentie: { yavru: 1, genc: 4, yasli: 15, omur: 20 },
  avTilkisi: { yavru: 0.5, genc: 1, yasli: 6, omur: 8 },
  yabaniDeve: { yavru: 1.5, genc: 4, yasli: 30, omur: 40 },
  avrupaTavsani: { yavru: 0.2, genc: 0.4, yasli: 4, omur: 6 },
  tembelAyi: { yavru: 1.5, genc: 3, yasli: 20, omur: 25 },
  hintYabanKopegi: { yavru: 0.5, genc: 1, yasli: 8, omur: 10 },
  cizgiliSirtlan: { yavru: 1, genc: 2, yasli: 12, omur: 15 },
  altinCakal: { yavru: 0.5, genc: 1, yasli: 9, omur: 12 },
  barasingha: { yavru: 1, genc: 2, yasli: 15, omur: 20 },
  nilgay: { yavru: 1, genc: 2, yasli: 15, omur: 20 },
  muntjak: { yavru: 0.5, genc: 1, yasli: 12, omur: 16 },
  hintYabanDomuzu: { yavru: 0.5, genc: 1.5, yasli: 12, omur: 15 },
  dortBoynuzlu: { yavru: 0.5, genc: 1, yasli: 8, omur: 10 },
  rhesus: { yavru: 1, genc: 3, yasli: 20, omur: 25 },
  hintFili: { yavru: 2, genc: 10, yasli: 45, omur: 60 },
  cital: { yavru: 0.5, genc: 1.5, yasli: 9, omur: 12 },
  sambar: { yavru: 0.6, genc: 2, yasli: 12, omur: 16 },
  gaur: { yavru: 1, genc: 3, yasli: 16, omur: 22 },
  langur: { yavru: 0.8, genc: 3, yasli: 15, omur: 20 },
  takhi: { yavru: 1, genc: 3, yasli: 18, omur: 25 },
  kizilGeyik: { yavru: 0.8, genc: 2, yasli: 12, omur: 16 },
  karaca: { yavru: 0.6, genc: 1.2, yasli: 8, omur: 11 },
  yabanDomuzu: { yavru: 0.5, genc: 1.5, yasli: 8, omur: 11 },
  vasak: { yavru: 0.8, genc: 2, yasli: 12, omur: 15 },
  kizilTilki: { yavru: 0.5, genc: 1, yasli: 6, omur: 9 },
  porsuk: { yavru: 0.6, genc: 1.5, yasli: 10, omur: 14 },
  dagKecisi: { yavru: 0.8, genc: 2, yasli: 11, omur: 15 },
  kulan: { yavru: 1, genc: 3, yasli: 16, omur: 22 },
  karLeopari: { yavru: 1, genc: 2, yasli: 12, omur: 16 },
  saiga: { yavru: 0.5, genc: 1, yasli: 7, omur: 10 },
  mogolKurdu: { yavru: 0.6, genc: 1.5, yasli: 9, omur: 13 },
  dzeren: { yavru: 0.5, genc: 1.5, yasli: 9, omur: 12 },
  argali: { yavru: 0.8, genc: 3, yasli: 10, omur: 14 },
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
  zebra: { gecit: 70, cikis: { x: 160, y: -262 }, yon: 'güneydoğu' },
  gnu: { gecit: 70, cikis: { x: 148, y: -270 }, yon: 'güneydoğu' },
  ceylan: { gecit: -60, cikis: { x: -158, y: -264 }, yon: 'güneybatı' },
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
    p = (eko.hava && eko.hava.tur === 'sicak' ? 0.18 : 0.08) * (eko.yil && eko.yil.kuraklik ? 1.6 : 1) * (eko.kontrolluYakmaYil === tk.yil ? 0.3 : 1); // Aşama 12: erken kontrollü yakma kuru yakıtı azaltır
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
