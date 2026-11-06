// ==== OYUN MANTIĞI (saf JS, arayüzden bağımsız) ====
// Koordinatlar: x doğu, y kuzey (metre). Yön (yon): radyan, 0 = kuzey, artı = saat yönü.
// Test: bun araclar/oyun-testi.js
import {
  SEVIYE_SINIRI,
  NITELIKLER,
  IRKLAR,
  SINIFLAR,
  YETENEKLER,
  CANAVARLAR,
  DUNYA,
  NADIRLIK,
  SILAH_ADLARI,
  ZIRH_ADLARI,
  ESYA_KATSAYI,
  IKSIR,
  GOREVLER,
  PUSULA,
  YUVALAR,
  BOLGELER,
  YERLER,
} from './veri.js';

// ---------- Rastgelelik ----------
export function tohumluUretec(tohum) {
  let a = tohum >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const arasi = (rng, a, b) => a + rng() * (b - a);
const tamArasi = (rng, a, b) => Math.floor(a + rng() * (b - a + 1));
const sinirla = (v, a, b) => Math.max(a, Math.min(b, v));

// ---------- Karakter ----------
export function gerekenXp(seviye) {
  return Math.round(100 * Math.pow(seviye, 2.2));
}

let esyaSayac = 1;
function esyaKimlik() {
  return 'e' + Date.now().toString(36) + (esyaSayac++).toString(36);
}

export function karakterOlustur({ ad, ulus, irk, sinif }) {
  const nitelik = { guc: 10, ceviklik: 10, zeka: 10, bilgelik: 10, dayaniklilik: 10 };
  const ekle = (b) => Object.entries(b || {}).forEach(([k, v]) => (nitelik[k] += v));
  ekle(IRKLAR[irk].bonus);
  ekle(SINIFLAR[sinif].bonus);
  const silah = {
    id: esyaKimlik(),
    yuva: 'silah',
    ad: SILAH_ADLARI[sinif][0],
    seviye: 1,
    nadirlik: 0,
    deger: 4,
    ek: {},
  };
  const k = {
    surum: 1,
    ad: (ad || '').trim() || 'Gezgin',
    ulus,
    irk,
    sinif,
    seviye: 1,
    xp: 0,
    nitelik,
    serbestPuan: 0,
    altin: 20,
    iksir: 3,
    envanter: [],
    kusanilan: { silah },
    gorev: { sira: 0, sayac: 0, durum: 'yok' },
    konum: { x: 0, y: 1, yon: 0 },
    oldurulen: 0,
    olum: 0,
    kesif: [],
    gezilen: ['koy'],
  };
  const h = hesapla(k);
  k.can = h.enCan;
  k.mana = h.enMana;
  return k;
}

// Kuşanılan eşyaların ek nitelikleri dahil toplam nitelikler
export function toplamNitelik(k) {
  const t = { ...k.nitelik };
  Object.values(k.kusanilan || {}).forEach((e) => {
    if (!e) return;
    Object.entries(e.ek || {}).forEach(([n, v]) => (t[n] = (t[n] || 0) + v));
  });
  return t;
}

export function hesapla(k) {
  const s = SINIFLAR[k.sinif];
  const n = toplamNitelik(k);
  const kus = k.kusanilan || {};
  const silahDeger = kus.silah ? kus.silah.deger : 0;
  let zirh = 0;
  Object.entries(kus).forEach(([yuva, e]) => {
    if (e && yuva !== 'silah') zirh += e.deger;
  });
  const ana = n[s.ana];
  return {
    nitelik: n,
    enCan: Math.round(50 + n.dayaniklilik * 10 + k.seviye * s.canCarpan),
    enMana: Math.round(20 + n.zeka * 8 + n.bilgelik * 4),
    saldiri: Math.round(ana * 2 + silahDeger + k.seviye * 1.5),
    savunma: Math.round(zirh + n.dayaniklilik * 0.6 + k.seviye),
    isabet: n.ceviklik,
    kritik: 0.05 + n.ceviklik * 0.003,
    kacinma: Math.min(0.25, 0.02 + n.ceviklik * 0.002),
    menzil: s.menzil,
    saldiriHizi: s.saldiriHizi,
  };
}

// Seviye atlama: dönen olay listesi
export function xpEkle(k, miktar) {
  const olaylar = [];
  if (k.seviye >= SEVIYE_SINIRI) return olaylar;
  k.xp += Math.round(miktar);
  while (k.seviye < SEVIYE_SINIRI && k.xp >= gerekenXp(k.seviye)) {
    k.xp -= gerekenXp(k.seviye);
    k.seviye += 1;
    k.nitelik[SINIFLAR[k.sinif].ana] += 1;
    k.serbestPuan += 3;
    const h = hesapla(k);
    k.can = h.enCan;
    k.mana = h.enMana;
    const yeni = YETENEKLER[k.sinif].filter((y) => y.seviye === k.seviye).map((y) => y.ad);
    olaylar.push({ tur: 'seviye', seviye: k.seviye, yeniYetenek: yeni });
  }
  if (k.seviye >= SEVIYE_SINIRI) k.xp = 0;
  return olaylar;
}

export function niteligeVer(k, nitelikAdi, miktar = 1) {
  if (k.serbestPuan < miktar || !NITELIKLER.some((n) => n.ad === nitelikAdi)) return false;
  k.nitelik[nitelikAdi] += miktar;
  k.serbestPuan -= miktar;
  return true;
}

// Sınıfa uygun otomatik dağıtım: 2 ana nitelik, 1 dayanıklılık
export function otomatikDagit(k) {
  const ana = SINIFLAR[k.sinif].ana;
  while (k.serbestPuan > 0) {
    const n = k.serbestPuan % 3 === 1 ? 'dayaniklilik' : ana;
    niteligeVer(k, n, 1);
  }
}

export function acikYetenekler(k) {
  return YETENEKLER[k.sinif].filter((y) => y.seviye <= k.seviye);
}

// ---------- Eşya ----------
export function esyaUret(yuva, seviye, sinif, rng = Math.random) {
  const r = rng();
  const nadirlik = r < 0.06 ? 2 : r < 0.3 ? 1 : 0;
  const nd = NADIRLIK[nadirlik];
  const adlar = yuva === 'silah' ? SILAH_ADLARI[sinif] : ZIRH_ADLARI[yuva];
  const kademe = Math.min(adlar.length - 1, Math.floor((seviye - 1) / (SEVIYE_SINIRI / adlar.length)));
  const deger = Math.max(1, Math.round(ESYA_KATSAYI[yuva] * (2 + seviye * 1.6) * nd.carpan));
  const ek = {};
  for (let i = 0; i < nd.ek; i++) {
    const n = NITELIKLER[Math.floor(rng() * NITELIKLER.length)].ad;
    ek[n] = (ek[n] || 0) + 1 + Math.floor(seviye / 6);
  }
  return { id: esyaKimlik(), yuva, ad: adlar[kademe], seviye, nadirlik, deger, ek };
}

export function esyaTarifi(e) {
  const nd = NADIRLIK[e.nadirlik].ad;
  const tur = e.yuva === 'silah' ? `saldırı ${e.deger}` : `savunma ${e.deger}`;
  const ekler = Object.entries(e.ek || {})
    .map(([n, v]) => `artı ${v} ${NITELIKLER.find((x) => x.ad === n).baslik}`)
    .join(', ');
  return `${nd} ${e.ad}, ${YUVALAR[e.yuva].toLowerCase()}, seviye ${e.seviye}, ${tur}${ekler ? ', ' + ekler : ''}`;
}

export function esyaSatisFiyati(e) {
  return Math.max(1, Math.round(e.deger * 1.5 * (1 + e.nadirlik)));
}

// Kuşan: eski eşya çantaya döner
export function kusan(k, esyaId) {
  const i = k.envanter.findIndex((e) => e.id === esyaId);
  if (i < 0) return null;
  const e = k.envanter[i];
  if (e.seviye > k.seviye) return { hata: `Bu eşya için seviye ${e.seviye} gerekiyor.` };
  k.envanter.splice(i, 1);
  const eski = k.kusanilan[e.yuva];
  if (eski) k.envanter.push(eski);
  k.kusanilan[e.yuva] = e;
  const h = hesapla(k);
  k.can = Math.min(k.can, h.enCan);
  k.mana = Math.min(k.mana, h.enMana);
  return { esya: e, eski };
}

export function esyaSat(k, esyaId) {
  const i = k.envanter.findIndex((e) => e.id === esyaId);
  if (i < 0) return 0;
  const fiyat = esyaSatisFiyati(k.envanter[i]);
  k.envanter.splice(i, 1);
  k.altin += fiyat;
  return fiyat;
}

export function iksirAl(k, adet = 1) {
  const tutar = IKSIR.fiyat * adet;
  if (k.altin < tutar) return false;
  k.altin -= tutar;
  k.iksir += adet;
  return true;
}

// ---------- Canavar ----------
export function canavarStat(tur, seviye) {
  const c = CANAVARLAR[tur];
  const p = c.patron ? 1 : 0;
  return {
    enCan: Math.round((40 + 30 * seviye) * (p ? 10 : 1)),
    saldiri: Math.round((5 + 4.4 * seviye) * (p ? 1.6 : 1)),
    savunma: Math.round(3 * seviye * (p ? 1.5 : 1)),
    xp: Math.round(25 * Math.pow(seviye, 1.8) * (p ? 12 : 1)),
    altin: Math.round((2 + seviye * 1.5) * (p ? 30 : 1)),
  };
}

// ---------- Hasar ----------
export function hasarHesapla({ saldiri, savunma, saldiranSeviye, hedefSeviye, carpan = 1, kritik = 0.05, kacinma = 0.03, rng = Math.random }) {
  const fark = (hedefSeviye || saldiranSeviye) - saldiranSeviye;
  const iskaSans = sinirla(0.05 + kacinma + Math.max(0, fark - 4) * 0.06, 0.02, 0.6);
  if (rng() < iskaSans) return { hasar: 0, iska: true, kritik: false };
  const oran = Math.min(0.75, savunma / (savunma + 40 + 8 * saldiranSeviye));
  let hasar = saldiri * carpan * arasi(rng, 0.9, 1.1) * (1 - oran);
  const krit = rng() < kritik;
  if (krit) hasar *= 1.8;
  return { hasar: Math.max(1, Math.round(hasar)), iska: false, kritik: krit };
}

// ---------- Yön tarifi ----------
export function aciNormal(a) {
  while (a > Math.PI) a -= 2 * Math.PI;
  while (a < -Math.PI) a += 2 * Math.PI;
  return a;
}
export function mesafe(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}
export function yonAcisi(a, b) {
  return Math.atan2(b.x - a.x, b.y - a.y);
}
// "saat 2 yönünde" (12 = tam önde, 6 = arkada)
export function saatYonu(kim, hedef) {
  const rel = aciNormal(yonAcisi(kim, hedef) - kim.yon);
  let s = Math.round(rel / (Math.PI / 6));
  if (s <= 0) s += 12;
  return s;
}
export function saatSozu(s) {
  if (s === 12) return 'tam önünde';
  if (s === 6) return 'tam arkanda';
  if (s === 3) return 'sağında';
  if (s === 9) return 'solunda';
  return `saat ${s} yönünde`;
}
export function pusulaYonu(yon) {
  const i = Math.round((((yon % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)) / (Math.PI / 4)) % 8;
  return PUSULA[i];
}
export function metreSozu(m) {
  if (m < 1.5) return 'dibinde';
  return `${Math.round(m)} metre`;
}

// ---------- Dünya ----------
// Bölge bulma: köyden uzaklık halkaları; Ejder Bataklığı yalnız kuzeyde
export function bolgeBul(x, y) {
  const r = Math.hypot(x, y);
  const a = Math.atan2(x, y);
  for (const b of BOLGELER) {
    if (r < b.ic || r >= b.dis) continue;
    if (b.aci && Math.abs(a) > b.aci) continue;
    return b;
  }
  return BOLGELER[BOLGELER.length - 1];
}
export function bolgeSeviyesi(b) {
  return b.canavar ? CANAVARLAR[b.canavar].seviye[0] : 1;
}
const CANAVAR_YUVASI = { kurt: 'agil', goblin: 'goblinKamp', haydut: 'haydutKamp', orkAkinci: 'orkKamp', orumcek: 'orumcekYuva', golem: 'kale', golge: 'tapinak', ejder: 'yuva' };
const KOPRULER = [0, Math.PI / 2, Math.PI, -Math.PI / 2];
// Çayın içinde mi? (köprüler yolların üstünde)
export function nehirde(x, y) {
  const r = Math.hypot(x, y);
  if (r < DUNYA.nehirIc || r > DUNYA.nehirDis) return false;
  return Math.min(Math.abs(x), Math.abs(y)) > DUNYA.kopruYari;
}

export function dunyaOlustur(karakter, tohum = 7) {
  const rng = tohumluUretec(tohum);
  const engeller = [];
  // Ağaçlar ve kayalar: her bölgenin kendi sıklığı ve ağaç türüyle
  const yerlereYakin = (x, y, m) => YERLER.some((yr) => Math.hypot(x - yr.x, y - yr.y) < m);
  BOLGELER.forEach((b) => {
    const koy = (adet, kaya) => {
      let konan = 0;
      for (let deneme = 0; konan < adet && deneme < adet * 6; deneme++) {
        let a = rng() * Math.PI * 2;
        if (b.aci) a = (rng() * 2 - 1) * b.aci;
        const r = arasi(rng, b.ic + 2, b.dis - 2);
        const x = Math.sin(a) * r;
        const y = Math.cos(a) * r;
        if (bolgeBul(x, y) !== b) continue;
        if (Math.min(Math.abs(x), Math.abs(y)) < 3.5) continue; // yollar açık kalsın
        if (yerlereYakin(x, y, 9)) continue;
        engeller.push(
          kaya
            ? { x, y, r: arasi(rng, 0.8, 1.9), tur: 'kaya', boy: arasi(rng, 0.8, 1.4) }
            : { x, y, r: b.agacTur === 'mese' ? arasi(rng, 0.7, 1.1) : arasi(rng, 0.5, 0.9), tur: 'agac', agacTur: b.agacTur, boy: arasi(rng, 0.8, 1.4) }
        );
        konan++;
      }
    };
    if (b.agac) koy(b.agac, false);
    if (b.kaya) koy(b.kaya, true);
  });
  YERLER.forEach((yr) => {
    if (yr.r) engeller.push({ x: yr.x, y: yr.y, r: yr.r, tur: 'yer', boy: 1 });
  });
  // Köy evleri
  const evler = [
    { x: -11, y: 8, r: 3.2, tur: 'ev', boy: 1 },
    { x: 11, y: 8, r: 3.2, tur: 'ev', boy: 1.1 },
    { x: -11, y: -9, r: 3.2, tur: 'ev', boy: 0.9 },
    { x: 11, y: -9, r: 3.2, tur: 'ev', boy: 1 },
  ];
  engeller.push(...evler, { x: 6, y: -5, r: 1.1, tur: 'kuyu', boy: 1 });
  const npcler = [
    { id: 'muhtar', ad: 'Muhtar', x: 0, y: 5, yon: Math.PI, gorev: 'gorev' },
    { id: 'tuccar', ad: 'Tüccar', x: -5, y: -1, yon: Math.PI / 2, gorev: 'tuccar' },
  ];
  const canavarlar = [];
  let id = 1;
  Object.entries(CANAVARLAR).forEach(([tur, c]) => {
    for (let i = 0; i < c.sayi; i++) {
      // Canavarlar kendi bölgelerine dağılır; bir kısmı bölgedeki kampın ya da yuvanın çevresinde toplanır
      const yuva = YERLER.find((yr) => yr.id === CANAVAR_YUVASI[tur]);
      let x;
      let y;
      if (yuva && (c.patron || rng() < 0.4)) {
        const a = rng() * Math.PI * 2;
        const r = c.patron ? 2 : arasi(rng, 4, 12);
        x = yuva.x + Math.sin(a) * r;
        y = yuva.y + Math.cos(a) * r;
      } else {
        const a = rng() * Math.PI * 2;
        const r = arasi(rng, c.bolge[0], c.bolge[1]);
        x = Math.sin(a) * r;
        y = Math.cos(a) * r;
      }
      const seviye = tamArasi(rng, c.seviye[0], c.seviye[1]);
      const st = canavarStat(tur, seviye);
      canavarlar.push({
        id: 'c' + id++,
        tur,
        ad: c.ad,
        seviye,
        x,
        y,
        yon: rng() * Math.PI * 2,
        dogX: x,
        dogY: y,
        can: st.enCan,
        enCan: st.enCan,
        st,
        durum: 'bos',
        sayac: rng() * 2,
        gezHedef: null,
        olu: false,
        dirilme: 0,
        etki: {},
      });
    }
  });
  const k = karakter;
  return {
    k,
    oyuncu: { x: k.konum.x, y: k.konum.y, yon: k.konum.yon },
    engeller,
    npcler,
    canavarlar,
    zaman: 0,
    hedefId: null,
    otoSaldiri: false,
    yaklas: false,
    saldiriSayac: 0,
    bekleme: {},
    etki: {},
    sonCatisma: -99,
    iksirBekleme: 0,
    isinlanma: null,
    olu: false,
    olumZamani: 0,
    olaylar: [],
    rng: Math.random,
  };
}

function olay(d, tur, metin, oncelik = 1, ek = {}) {
  d.olaylar.push({ tur, metin, oncelik, zaman: d.zaman, ...ek });
}

export function canavarBul(d, id) {
  return d.canavarlar.find((c) => c.id === id) || null;
}
export function hedef(d) {
  const c = d.hedefId ? canavarBul(d, d.hedefId) : null;
  return c && !c.olu ? c : null;
}

// Yakındaki canlı canavarlar, en yakın önce
export function yakindakiler(d, menzil = 40) {
  return d.canavarlar
    .filter((c) => !c.olu)
    .map((c) => ({ c, m: mesafe(d.oyuncu, c) }))
    .filter((o) => o.m <= menzil)
    .sort((a, b) => a.m - b.m);
}

export function hedefTarifi(d, c) {
  const m = mesafe(d.oyuncu, c);
  const yuzde = Math.round((c.can / c.enCan) * 100);
  return `${c.ad}, seviye ${c.seviye}, ${saatSozu(saatYonu(d.oyuncu, c))}, ${metreSozu(m)}, canı yüzde ${yuzde}`;
}

// Sıradaki hedef: en yakından başlayarak döner
export function hedefDegistir(d, menzil = 40) {
  const liste = yakindakiler(d, menzil);
  if (!liste.length) {
    d.hedefId = null;
    olay(d, 'hedef', `${menzil} metre içinde düşman yok.`, 2);
    return null;
  }
  const i = liste.findIndex((o) => o.c.id === d.hedefId);
  const sec = liste[(i + 1) % liste.length].c;
  d.hedefId = sec.id;
  d.otoSaldiri = false;
  d.yaklas = false;
  olay(d, 'hedef', 'Hedef: ' + hedefTarifi(d, sec), 2, { id: sec.id });
  return sec;
}

export function saldir(d) {
  if (d.olu) return;
  let c = hedef(d);
  if (!c) c = hedefDegistir(d, 40);
  if (!c) return;
  d.otoSaldiri = true;
  d.yaklas = true;
  d.isinlanma = null;
}

export function dur(d) {
  d.otoSaldiri = false;
  d.yaklas = false;
}

function catismada(d) {
  return d.zaman - d.sonCatisma < 6;
}

function oyuncuyaHasar(d, c, ham) {
  const k = d.k;
  let hasar = ham;
  if (d.etki.kalkan && d.etki.kalkan.bitis > d.zaman) hasar *= 1 - d.etki.kalkan.hasarAzalt;
  if (d.etki.manaKalkani && d.etki.manaKalkani.bitis > d.zaman) {
    const pay = hasar * 0.5;
    const karsila = Math.min(k.mana, pay);
    k.mana -= karsila;
    hasar -= karsila;
  }
  if (d.etki.kutsalKalkan && d.etki.kutsalKalkan.bitis > d.zaman && d.etki.kutsalKalkan.kalan > 0) {
    const em = Math.min(d.etki.kutsalKalkan.kalan, hasar);
    d.etki.kutsalKalkan.kalan -= em;
    hasar -= em;
    if (d.etki.kutsalKalkan.kalan <= 0) olay(d, 'etkiBitti', 'Kutsal kalkan kırıldı.', 2);
  }
  hasar = Math.round(hasar);
  const enCan = hesapla(k).enCan;
  const once = k.can / enCan;
  k.can = Math.max(0, k.can - hasar);
  d.sonCatisma = d.zaman;
  const sonra = k.can / enCan;
  olay(d, 'hasarAldin', '', 0, { miktar: hasar, kaynak: c.ad, id: c.id });
  // Eşik uyarıları
  if (once > 0.5 && sonra <= 0.5) olay(d, 'canUyari', 'Canın yarıya indi.', 3);
  if (once > 0.25 && sonra <= 0.25) olay(d, 'canUyari', 'Canın çok az! İksir iç ya da kaç.', 4);
  if (k.can <= 0) oyuncuOldu(d, c);
}

function oyuncuOldu(d, c) {
  const k = d.k;
  d.olu = true;
  d.olumZamani = d.zaman;
  d.otoSaldiri = false;
  d.yaklas = false;
  d.hedefId = null;
  k.olum += 1;
  let ceza = 0;
  if (k.seviye >= 10 && k.seviye < SEVIYE_SINIRI) {
    ceza = Math.round(gerekenXp(k.seviye) * 0.02);
    k.xp = Math.max(0, k.xp - ceza);
  }
  d.canavarlar.forEach((m) => {
    if (m.durum === 'kovala') m.durum = 'don';
  });
  olay(d, 'oldun', `${c.ad} seni yere serdi.${ceza ? ` ${ceza} deneyim kaybettin.` : ''} Köyde yeniden doğmak için Yeniden doğ düğmesine dokun.`, 5);
}

export function yenidenDog(d) {
  if (!d.olu) return;
  const k = d.k;
  const h = hesapla(k);
  k.can = Math.round(h.enCan * 0.6);
  k.mana = Math.round(h.enMana * 0.6);
  d.oyuncu.x = 0;
  d.oyuncu.y = 1;
  d.oyuncu.yon = 0;
  d.olu = false;
  d.etki = {};
  olay(d, 'dogdun', 'Köyde, meydanda yeniden doğdun. Muhtar tam önünde.', 4);
}

function canavarOldu(d, c) {
  const k = d.k;
  c.olu = true;
  c.dirilme = d.zaman + (CANAVARLAR[c.tur].patron ? 300 : 25);
  c.durum = 'bos';
  k.oldurulen += 1;
  let sonraki = null;
  if (d.hedefId === c.id) {
    d.hedefId = null;
    // Sana saldıran başka bir canavar varsa ona geç (otomatik hedef)
    if (d.otoHedef !== false) {
      sonraki = d.canavarlar
        .filter((m) => !m.olu && m.id !== c.id && m.durum === 'kovala' && mesafe(m, d.oyuncu) < 16)
        .sort((a, b) => mesafe(a, d.oyuncu) - mesafe(b, d.oyuncu))[0];
    }
    if (sonraki) d.hedefId = sonraki.id;
    else {
      d.otoSaldiri = false;
      d.yaklas = false;
    }
  }
  // Seviye farkı çok büyükse deneyim azalır
  const fark = k.seviye - c.seviye;
  const xpCarpan = fark > 5 ? Math.max(0.1, 1 - (fark - 5) * 0.2) : 1;
  const xp = Math.round(c.st.xp * xpCarpan);
  const altin = c.st.altin + tamArasi(d.rng, 0, c.seviye);
  k.altin += altin;
  let metin = `${c.ad} öldü. ${xp} deneyim, ${altin} altın.`;
  // Ganimet
  const sans = CANAVARLAR[c.tur].patron ? 1 : 0.22;
  if (d.rng() < sans) {
    const yuvalar = Object.keys(YUVALAR);
    const yuva = yuvalar[Math.floor(d.rng() * yuvalar.length)];
    const e = esyaUret(yuva, c.seviye, k.sinif, d.rng);
    k.envanter.push(e);
    metin += ` Ganimet: ${esyaTarifi(e)}.`;
  }
  if (d.rng() < 0.08) {
    k.iksir += 1;
    metin += ' Bir can iksiri buldun.';
  }
  olay(d, 'oldurdun', metin, 3, { id: c.id, ganimet: metin.includes('Ganimet') });
  if (sonraki) olay(d, 'hedef', `Sıradaki hedef: ${sonraki.ad}, ${saatSozu(saatYonu(d.oyuncu, sonraki))}.`, 2, { id: sonraki.id, otomatik: true });
  // Görev
  const g = GOREVLER[k.gorev.sira];
  if (g && k.gorev.durum === 'aktif' && g.hedef === c.tur) {
    k.gorev.sayac += 1;
    if (k.gorev.sayac >= g.sayi) {
      k.gorev.durum = 'tamam';
      olay(d, 'gorev', `Görev tamam: ${g.ad}. Ödül için köye, Muhtar'a dön.`, 4);
    } else olay(d, 'gorevSayac', `${g.ad}: ${k.gorev.sayac} / ${g.sayi}`, 1);
  }
  xpEkle(k, xp).forEach((o) => {
    let m = `Seviye atladın! Artık seviye ${o.seviye}. 3 nitelik puanın var.`;
    if (o.yeniYetenek.length) m += ` Yeni yetenek: ${o.yeniYetenek.join(', ')}.`;
    olay(d, 'seviye', m, 5, { seviye: o.seviye });
  });
}

function canavaraHasar(d, c, hasar, kritik, kaynak) {
  c.can = Math.max(0, c.can - hasar);
  d.sonCatisma = d.zaman;
  if (c.durum !== 'kovala') {
    c.durum = 'kovala';
  }
  const once = (c.can + hasar) / c.enCan;
  const sonra = c.can / c.enCan;
  olay(d, 'hasarVerdin', '', 0, { miktar: hasar, kritik, id: c.id, kaynak });
  if (c.can <= 0) return canavarOldu(d, c);
  if (d.hedefId === c.id) {
    if (once > 0.5 && sonra <= 0.5) olay(d, 'hedefCan', `${c.ad} yarı canda.`, 1);
    else if (once > 0.2 && sonra <= 0.2) olay(d, 'hedefCan', `${c.ad} ölmek üzere.`, 2);
  }
}

function oyuncuVurusu(d, c, carpan = 1, kaynak = 'saldiri') {
  const k = d.k;
  const h = hesapla(k);
  let saldiri = h.saldiri;
  if (d.etki.nara && d.etki.nara.bitis > d.zaman) saldiri *= 1 + d.etki.nara.saldiriArt;
  const r = hasarHesapla({
    saldiri,
    savunma: c.st.savunma,
    saldiranSeviye: k.seviye,
    hedefSeviye: c.seviye,
    carpan,
    kritik: h.kritik,
    kacinma: 0.02,
    rng: d.rng,
  });
  if (r.iska) {
    d.sonCatisma = d.zaman;
    if (c.durum !== 'kovala') c.durum = 'kovala';
    olay(d, 'iska', '', 0, { id: c.id });
    return r;
  }
  canavaraHasar(d, c, r.hasar, r.kritik, kaynak);
  return r;
}

// ---------- Yetenekler ----------
export function yetenekDurumu(d, y) {
  const k = d.k;
  if (y.seviye > k.seviye) return { hazir: false, neden: `seviye ${y.seviye} gerekir` };
  const b = d.bekleme[y.id] || 0;
  if (b > d.zaman) return { hazir: false, neden: `${Math.ceil(b - d.zaman)} saniye bekleme`, kalan: b - d.zaman };
  if (k.mana < y.mana) return { hazir: false, neden: 'mana yetmiyor' };
  return { hazir: true };
}

export function yetenekKullan(d, yetenekId) {
  const k = d.k;
  if (d.olu) return false;
  const y = YETENEKLER[k.sinif].find((x) => x.id === yetenekId);
  if (!y) return false;
  const dur = yetenekDurumu(d, y);
  if (!dur.hazir) {
    olay(d, 'yetenekHazirDegil', `${y.ad}: ${dur.neden}.`, 2);
    return false;
  }
  const h = hesapla(k);
  const hedefGerekli = ['hasar', 'coklu', 'zaman'].includes(y.tur) || (y.tur === 'alan' && y.merkez === 'hedef') || y.tur === 'sicra';
  let c = hedef(d);
  if (hedefGerekli && !c) {
    c = hedefDegistir(d, Math.max(14, h.menzil + 4));
    if (!c) return false;
  }
  if (hedefGerekli && y.tur !== 'sicra') {
    const m = mesafe(d.oyuncu, c);
    const menzil = Math.max(h.menzil, y.tur === 'alan' ? 13 : h.menzil);
    if (m > menzil + 0.5) {
      olay(d, 'menzil', `${y.ad} için çok uzak: ${c.ad} ${metreSozu(m)} ötede. Yaklaşıyorsun.`, 2);
      d.yaklas = true;
      d.otoSaldiri = true;
      return false;
    }
    d.oyuncu.yon = yonAcisi(d.oyuncu, c);
  }
  k.mana -= y.mana;
  d.bekleme[y.id] = d.zaman + y.bekleme;
  d.isinlanma = null;
  if (y.tur === 'hasar') {
    const r = oyuncuVurusu(d, c, y.carpan, y.id);
    if (y.yavaslat && !r.iska && !c.olu) c.etki.yavas = d.zaman + y.yavaslat;
    olay(d, 'yetenek', `${y.ad}${r.iska ? ', ıska' : r.kritik ? ', kritik' : ''}.`, 1, { id: y.id });
  } else if (y.tur === 'coklu') {
    const yakin = d.canavarlar.filter((m) => !m.olu && m.id !== c.id && mesafe(m, c) < 6).slice(0, y.hedef - 1);
    [c, ...yakin].forEach((m) => oyuncuVurusu(d, m, y.carpan, y.id));
    olay(d, 'yetenek', `${y.ad}, ${1 + yakin.length} hedef.`, 1, { id: y.id });
  } else if (y.tur === 'zaman') {
    const r = oyuncuVurusu(d, c, 0.6, y.id);
    if (!r.iska && !c.olu) c.etki.zehir = { bitis: d.zaman + y.sure, tik: d.zaman + 1, hasar: Math.max(1, Math.round(h.saldiri * y.carpan * 0.5)) };
    olay(d, 'yetenek', `${y.ad}${r.iska ? ', ıska' : ', zehirlendi'}.`, 1, { id: y.id });
  } else if (y.tur === 'alan') {
    const merkez = y.merkez === 'ben' ? d.oyuncu : c;
    const etkilenen = d.canavarlar.filter((m) => !m.olu && mesafe(m, merkez) <= y.yaricap);
    etkilenen.forEach((m) => oyuncuVurusu(d, m, y.carpan, y.id));
    if (y.iyilesOran) k.can = Math.min(h.enCan, k.can + Math.round(h.enCan * y.iyilesOran));
    olay(d, 'yetenek', `${y.ad}, ${etkilenen.length} düşmana çarptı.`, 1, { id: y.id });
  } else if (y.tur === 'iyiles') {
    const once = k.can;
    k.can = Math.min(h.enCan, k.can + Math.round(h.enCan * y.oran * (1 + h.nitelik.bilgelik * 0.01)));
    olay(d, 'iyilestin', `${y.ad}: ${k.can - once} can.`, 2, { id: y.id });
  } else if (y.tur === 'etki') {
    const e = { ...y.etki, bitis: d.zaman + y.etki.sure };
    if (e.emme) e.kalan = Math.round(h.enCan * e.emme);
    d.etki[e.ad] = e;
    olay(d, 'yetenek', `${y.ad}, ${y.etki.sure} saniye.`, 2, { id: y.id });
  } else if (y.tur === 'sicra') {
    const a = yonAcisi(c, d.oyuncu);
    hareketEt(d, Math.sin(a) * y.mesafe, Math.cos(a) * y.mesafe);
    d.oyuncu.yon = yonAcisi(d.oyuncu, c);
    olay(d, 'yetenek', `${y.ad}. ${c.ad} ${metreSozu(mesafe(d.oyuncu, c))} ötede.`, 2, { id: y.id });
  }
  return true;
}

export function iksirIc(d) {
  const k = d.k;
  if (d.olu) return false;
  if (k.iksir <= 0) {
    olay(d, 'iksir', 'İksirin kalmadı. Köydeki tüccardan alabilirsin.', 3);
    return false;
  }
  if (d.iksirBekleme > d.zaman) {
    olay(d, 'iksir', `İksir için ${Math.ceil(d.iksirBekleme - d.zaman)} saniye bekle.`, 2);
    return false;
  }
  const h = hesapla(k);
  k.iksir -= 1;
  const once = k.can;
  k.can = Math.min(h.enCan, k.can + Math.round(h.enCan * IKSIR.oran));
  d.iksirBekleme = d.zaman + IKSIR.bekleme;
  olay(d, 'iksir', `İksir içtin, ${k.can - once} can. ${k.iksir} iksir kaldı.`, 2);
  return true;
}

export function koyeDon(d) {
  if (d.olu) return;
  if (catismada(d)) {
    olay(d, 'isinlanma', 'Çatışmadayken köye dönemezsin.', 3);
    return;
  }
  d.isinlanma = d.zaman + 5;
  d.otoSaldiri = false;
  d.yaklas = false;
  olay(d, 'isinlanma', 'Köye dönüş başladı, 5 saniye kıpırdama.', 2);
}

// ---------- NPC ve görev ----------
// Görevin istediği en yakın canavarı hedefle ve ona yürü
export function gorevHedefiBul(d) {
  const k = d.k;
  const g = GOREVLER[k.gorev.sira];
  if (!g || k.gorev.durum !== 'aktif') {
    olay(d, 'hedef', 'Etkin bir av görevin yok.', 2);
    return null;
  }
  const c = d.canavarlar
    .filter((m) => !m.olu && m.tur === g.hedef)
    .sort((a, b) => mesafe(a, d.oyuncu) - mesafe(b, d.oyuncu))[0];
  if (!c) {
    olay(d, 'hedef', `Şu an hiç ${CANAVARLAR[g.hedef].ad} yok, biraz sonra yeniden doğarlar.`, 2);
    return null;
  }
  d.hedefId = c.id;
  d.otoSaldiri = true;
  d.yaklas = true;
  d.isinlanma = null;
  olay(d, 'hedef', `Görev hedefi: ${hedefTarifi(d, c)}. Ona yürüyorsun.`, 3, { id: c.id });
  return c;
}

export function yakinNpc(d, menzil = 4) {
  return d.npcler.find((n) => mesafe(n, d.oyuncu) <= menzil) || null;
}

export function gorevDurumu(k) {
  const g = GOREVLER[k.gorev.sira];
  if (!g) return { metin: 'Bütün görevleri bitirdin. Krallık sana minnettar.', g: null };
  if (k.gorev.durum === 'yok') return { g, metin: `Yeni görev hazır: ${g.ad}. Muhtar ile konuş.` };
  if (k.gorev.durum === 'aktif') return { g, metin: `${g.ad}: ${g.metin} İlerleme ${k.gorev.sayac} / ${g.sayi}.` };
  return { g, metin: `${g.ad} tamamlandı. Ödül için Muhtar'a dön.` };
}

// Muhtar ile konuş: görevi al ya da teslim et
export function muhtarlaKonus(d) {
  const k = d.k;
  const g = GOREVLER[k.gorev.sira];
  if (!g) {
    olay(d, 'konusma', 'Muhtar: Sen bu krallığın kahramanısın. Verecek başka işim yok.', 3);
    return;
  }
  if (k.gorev.durum === 'yok') {
    k.gorev.durum = 'aktif';
    k.gorev.sayac = 0;
    olay(d, 'konusma', `Muhtar: ${g.metin} Görev alındı: ${g.ad}.`, 3);
  } else if (k.gorev.durum === 'aktif') {
    olay(d, 'konusma', `Muhtar: ${g.ad} sürüyor. ${k.gorev.sayac} / ${g.sayi}.`, 3);
  } else {
    k.altin += g.altin;
    k.gorev = { sira: k.gorev.sira + 1, sayac: 0, durum: 'yok' };
    let m = `Muhtar: Aferin! Ödülün ${g.xp} deneyim ve ${g.altin} altın.`;
    const sonraki = GOREVLER[k.gorev.sira];
    if (sonraki) m += ' Benimle yeniden konuşursan sana yeni bir iş veririm.';
    olay(d, 'konusma', m, 4);
    xpEkle(k, g.xp).forEach((o) => {
      let s = `Seviye atladın! Artık seviye ${o.seviye}. 3 nitelik puanın var.`;
      if (o.yeniYetenek.length) s += ` Yeni yetenek: ${o.yeniYetenek.join(', ')}.`;
      olay(d, 'seviye', s, 5, { seviye: o.seviye });
    });
  }
}

// ---------- Hareket ----------
export const HIZ = { yuru: 5.2, don: 2.4 };

function hareketEt(d, dx, dy) {
  const o = d.oyuncu;
  let nx = o.x + dx;
  let ny = o.y + dy;
  // Engellerden it
  for (const e of d.engeller) {
    const ex = nx - e.x;
    const ey = ny - e.y;
    const m = Math.hypot(ex, ey);
    const min = e.r + 0.45;
    if (m < min && m > 0.0001) {
      nx = e.x + (ex / m) * min;
      ny = e.y + (ey / m) * min;
    }
  }
  // Çay: köprü dışında geçilmez
  if (nehirde(nx, ny)) {
    d.nehirCarpti = true;
    return true;
  }
  const r = Math.hypot(nx, ny);
  if (r > DUNYA.yaricap) {
    nx = (nx / r) * DUNYA.yaricap;
    ny = (ny / r) * DUNYA.yaricap;
  }
  const carpti = Math.hypot(nx - (o.x + dx), ny - (o.y + dy)) > 0.05;
  o.x = nx;
  o.y = ny;
  return carpti;
}

// Hedefe yürürken önündeki ağaç ya da kayanın yanından dolaş
function engelVar(d, x, y) {
  if (nehirde(x, y)) return true;
  for (const e of d.engeller) if (Math.hypot(x - e.x, y - e.y) < e.r + 0.55) return true;
  return false;
}
// Hedef çayın öbür yakasındaysa önce köprüye yürü
function yolNoktasi(d, hedefNokta) {
  const o = d.oyuncu;
  const ro = Math.hypot(o.x, o.y);
  const rh = Math.hypot(hedefNokta.x, hedefNokta.y);
  const orta = (DUNYA.nehirIc + DUNYA.nehirDis) / 2;
  // Köprünün üstündeyken: köprü doğrultusunda hedefin yakasına çık
  if (ro > DUNYA.nehirIc - 0.6 && ro < DUNYA.nehirDis + 0.6) {
    const a = KOPRULER.reduce((en, k) => (Math.abs(aciNormal(Math.atan2(o.x, o.y) - k)) < Math.abs(aciNormal(Math.atan2(o.x, o.y) - en)) ? k : en), 0);
    // Önce köprünün ortasına (yol çizgisine) gel, sonra karşıya ya da geri çık
    const dik = Math.abs(o.x * Math.cos(a) - o.y * Math.sin(a));
    if (dik > 1.2) return { x: Math.sin(a) * ro, y: Math.cos(a) * ro };
    const cik = rh > orta ? DUNYA.nehirDis + 4 : DUNYA.nehirIc - 4;
    return { x: Math.sin(a) * cik, y: Math.cos(a) * cik };
  }
  if (ro >= orta && rh >= orta) {
    // İkisi de dış yakada ama düz çizgi çayın içinden geçiyorsa halka boyunca dolaş
    const dx = hedefNokta.x - o.x;
    const dy = hedefNokta.y - o.y;
    const L2 = dx * dx + dy * dy || 1;
    const t = Math.max(0, Math.min(1, -(o.x * dx + o.y * dy) / L2));
    const enYakin = Math.hypot(o.x + dx * t, o.y + dy * t);
    if (enYakin > DUNYA.nehirDis + 1.5) return hedefNokta;
    const ao = Math.atan2(o.x, o.y);
    const fark = aciNormal(Math.atan2(hedefNokta.x, hedefNokta.y) - ao);
    const a = ao + Math.sign(fark) * Math.min(Math.abs(fark), 0.45);
    const rr = Math.max(ro, DUNYA.nehirDis + 7);
    return { x: Math.sin(a) * rr, y: Math.cos(a) * rr };
  }
  if ((ro < orta) === (rh < orta)) return hedefNokta;
  // En kısa yolu veren köprü
  let enA = 0;
  let enM = 1e9;
  for (const a of KOPRULER) {
    const k = { x: Math.sin(a) * orta, y: Math.cos(a) * orta };
    const m = mesafe(o, k) + mesafe(k, hedefNokta);
    if (m < enM) {
      enM = m;
      enA = a;
    }
  }
  const icNokta = { x: Math.sin(enA) * (DUNYA.nehirIc - 5), y: Math.cos(enA) * (DUNYA.nehirIc - 5) };
  const disNokta = { x: Math.sin(enA) * (DUNYA.nehirDis + 5), y: Math.cos(enA) * (DUNYA.nehirDis + 5) };
  const yakin = ro < orta ? icNokta : disNokta;
  const uzak = ro < orta ? disNokta : icNokta;
  // Köprü yolunun üstündeysek karşıya geç, değilsek köprünün bu yakasına git
  const yolaUzaklik = Math.abs(Math.cos(enA)) > 0.5 ? Math.abs(o.x) : Math.abs(o.y);
  if (yolaUzaklik < 2.2 && Math.abs(ro - orta) < 10) return uzak;
  return yakin;
}
function engeldenKacan(d, aci) {
  const o = d.oyuncu;
  const yoklama = (a) => !engelVar(d, o.x + Math.sin(a) * 1.4, o.y + Math.cos(a) * 1.4) && !engelVar(d, o.x + Math.sin(a) * 0.7, o.y + Math.cos(a) * 0.7);
  if (yoklama(aci)) {
    d.kacis = 0;
    return aci;
  }
  const taraf = d.kacis || 1;
  for (const f of [0.4, 0.8, 1.2, 1.6, 2.0, 2.4]) {
    for (const t of [taraf, -taraf]) {
      if (yoklama(aci + f * t)) {
        d.kacis = t;
        return aci + f * t;
      }
    }
  }
  return aci;
}

// ---------- Ana döngü ----------
// girdi: { ileri: -1..1, don: -1..1 }
export function guncelle(d, dt, girdi = {}) {
  dt = Math.min(dt, 0.1);
  d.zaman += dt;
  const k = d.k;
  const h = hesapla(k);
  const o = d.oyuncu;
  let carpti = false;

  // Etkilerin bitişi
  Object.entries(d.etki).forEach(([ad, e]) => {
    if (e.bitis <= d.zaman) {
      delete d.etki[ad];
      olay(d, 'etkiBitti', '', 0, { ad });
    }
  });

  if (!d.olu) {
    const ileri = sinirla(girdi.ileri || 0, -1, 1);
    const don = sinirla(girdi.don || 0, -1, 1);
    const elle = Math.abs(ileri) > 0.08 || Math.abs(don) > 0.08;
    if (elle) {
      d.yaklas = false;
      if (d.isinlanma) {
        d.isinlanma = null;
        olay(d, 'isinlanma', 'Köye dönüş iptal oldu.', 2);
      }
      o.yon = aciNormal(o.yon + don * HIZ.don * dt);
      const v = ileri * HIZ.yuru * (ileri < 0 ? 0.55 : 1) * dt;
      carpti = hareketEt(d, Math.sin(o.yon) * v, Math.cos(o.yon) * v);
    }

    // Hedefe yaklaş ve saldır
    const c = hedef(d);
    if (d.hedefId && !c) {
      d.hedefId = null;
      d.otoSaldiri = false;
      d.yaklas = false;
    }
    if (c && (d.yaklas || d.otoSaldiri)) {
      const m = mesafe(o, c);
      if (m > h.menzil) {
        if (d.yaklas) {
          const yn = yolNoktasi(d, c);
          // Takılma kurtarma: 1,5 saniyede yarım metre yaklaşamadıysan bir süre yana sap
          const kalan = mesafe(o, yn);
          if (!d.ilerleme || d.zaman - d.ilerleme.zaman > 1.5) {
            if (d.ilerleme && d.ilerleme.kalan - kalan < 0.5 && !(d.sapma && d.sapma.bitis > d.zaman)) {
              d.sapma = { aci: (d.rng() < 0.5 ? -1 : 1) * (1 + d.rng() * 0.8), bitis: d.zaman + 1.3 };
            }
            d.ilerleme = { zaman: d.zaman, kalan };
          }
          let aci = yonAcisi(o, yn);
          if (d.sapma && d.sapma.bitis > d.zaman) aci += d.sapma.aci;
          o.yon = engeldenKacan(d, aci);
          const v = HIZ.yuru * dt;
          carpti = hareketEt(d, Math.sin(o.yon) * v, Math.cos(o.yon) * v) || carpti;
        }
      } else if (d.otoSaldiri) {
        if (!elle) o.yon = yonAcisi(o, c);
        d.saldiriSayac -= dt;
        if (d.saldiriSayac <= 0) {
          d.saldiriSayac = h.saldiriHizi;
          oyuncuVurusu(d, c, 1, 'saldiri');
        }
      }
    }
    if (d.saldiriSayac > 0 && !d.otoSaldiri) d.saldiriSayac -= dt;

    // Yenilenme
    const r = catismada(d) ? 0.004 : 0.03;
    k.can = Math.min(h.enCan, k.can + h.enCan * r * dt);
    k.mana = Math.min(h.enMana, k.mana + (h.enMana * r + h.nitelik.bilgelik * 0.05) * dt);

    // Işınlanma
    if (d.isinlanma && d.zaman >= d.isinlanma) {
      d.isinlanma = null;
      d.hedefId = null;
      o.x = 0;
      o.y = 1;
      o.yon = 0;
      olay(d, 'isinlanma', 'Köydesin. Muhtar tam önünde.', 3);
    }
  }

  // Canavarlar
  for (const c of d.canavarlar) {
    if (c.olu) {
      if (d.zaman >= c.dirilme) {
        c.olu = false;
        c.can = c.enCan;
        c.x = c.dogX;
        c.y = c.dogY;
        c.durum = 'bos';
        c.etki = {};
      }
      continue;
    }
    // Zehir
    if (c.etki.zehir) {
      if (c.etki.zehir.bitis < d.zaman) delete c.etki.zehir;
      else if (d.zaman >= c.etki.zehir.tik) {
        c.etki.zehir.tik += 1;
        canavaraHasar(d, c, c.etki.zehir.hasar, false, 'zehir');
        if (c.olu) continue;
      }
    }
    const hizCarpan = c.etki.yavas && c.etki.yavas > d.zaman ? 0.45 : 1;
    const tip = CANAVARLAR[c.tur];
    const mOyuncu = mesafe(c, o);
    const mDog = Math.hypot(c.x - c.dogX, c.y - c.dogY);
    if (c.durum === 'bos') {
      const saldirgan = c.seviye >= k.seviye - 5 || tip.patron;
      const algi = tip.patron ? 14 : 7;
      if (!d.olu && saldirgan && mOyuncu < algi && Math.hypot(o.x, o.y) > 22) {
        c.durum = 'kovala';
        // Hedefin yoksa saldıran canavar hedefin olur
        if (!hedef(d) && d.otoHedef !== false) d.hedefId = c.id;
        olay(d, 'saldiriyor', `${c.ad} sana saldırıyor, ${saatSozu(saatYonu(o, c))}.${d.hedefId === c.id ? ' Hedefin oldu.' : ''}`, 3, { id: c.id });
      } else {
        // Gezinme
        c.sayac -= dt;
        if (c.sayac <= 0) {
          c.sayac = 3 + d.rng() * 4;
          const a = d.rng() * Math.PI * 2;
          c.gezHedef = d.rng() < 0.5 ? null : { x: c.dogX + Math.sin(a) * 5, y: c.dogY + Math.cos(a) * 5 };
        }
        if (c.gezHedef) {
          const m = Math.hypot(c.gezHedef.x - c.x, c.gezHedef.y - c.y);
          if (m > 0.3) {
            c.yon = Math.atan2(c.gezHedef.x - c.x, c.gezHedef.y - c.y);
            const v = Math.min(m, tip.hiz * 0.3 * dt);
            c.x += Math.sin(c.yon) * v;
            c.y += Math.cos(c.yon) * v;
          }
        }
      }
    } else if (c.durum === 'kovala') {
      if (d.olu || mDog > (tip.patron ? 30 : 38) || Math.hypot(o.x, o.y) < 20) {
        c.durum = 'don';
      } else {
        c.yon = yonAcisi(c, o);
        if (mOyuncu > 1.7 + tip.boy * 0.3) {
          const v = tip.hiz * hizCarpan * dt;
          c.x += Math.sin(c.yon) * v;
          c.y += Math.cos(c.yon) * v;
        } else {
          c.sayac -= dt;
          if (c.sayac <= 0) {
            c.sayac = tip.patron ? 2.2 : 1.8;
            const r = hasarHesapla({
              saldiri: c.st.saldiri,
              savunma: h.savunma,
              saldiranSeviye: c.seviye,
              hedefSeviye: k.seviye,
              kritik: 0.04,
              kacinma: h.kacinma,
              rng: d.rng,
            });
            if (r.iska) olay(d, 'kacindin', '', 0, { id: c.id });
            else oyuncuyaHasar(d, c, r.hasar);
          }
        }
      }
    } else if (c.durum === 'don') {
      const m = Math.hypot(c.dogX - c.x, c.dogY - c.y);
      if (m < 0.5) {
        c.durum = 'bos';
        c.can = c.enCan;
      } else {
        c.yon = Math.atan2(c.dogX - c.x, c.dogY - c.y);
        const v = Math.min(m, tip.hiz * 1.3 * dt);
        c.x += Math.sin(c.yon) * v;
        c.y += Math.cos(c.yon) * v;
        c.can = Math.min(c.enCan, c.can + c.enCan * 0.2 * dt);
      }
    }
  }

  // Bölge değişimi ve keşif
  const b = bolgeBul(o.x, o.y);
  if (b.id !== d.bolgeId) {
    const ilk = d.bolgeId === undefined;
    d.bolgeId = b.id;
    k.gezilen = k.gezilen || [];
    if (!ilk && b.id !== 'nehir') {
      if (!k.gezilen.includes(b.id)) {
        k.gezilen.push(b.id);
        olay(d, 'bolge', `${b.ad}. ${b.tarif}`, 3, { bolge: b.id, yeni: true });
      } else olay(d, 'bolge', `${b.ad}.`, 2, { bolge: b.id });
    } else if (!k.gezilen.includes(b.id)) k.gezilen.push(b.id);
  }
  k.kesif = k.kesif || [];
  for (const yr of YERLER) {
    if (k.kesif.includes(yr.id)) continue;
    if (Math.abs(yr.x - o.x) > 13 || Math.abs(yr.y - o.y) > 13 || mesafe(yr, o) > 13) continue;
    k.kesif.push(yr.id);
    const xp = Math.round(gerekenXp(Math.min(SEVIYE_SINIRI, bolgeSeviyesi(bolgeBul(yr.x, yr.y)))) * 0.12);
    olay(d, 'kesif', `Keşif: ${yr.ad}. ${yr.tarif} ${xp} deneyim.`, 3, { yer: yr.id });
    xpEkle(k, xp).forEach((s) => olay(d, 'seviye', `Seviye atladın! Artık seviye ${s.seviye}.${s.yeniYetenek.length ? ` Yeni yetenek: ${s.yeniYetenek.join(', ')}.` : ''}`, 5, { seviye: s.seviye }));
  }

  // Konumu karaktere yaz (kayıt için)
  k.konum = { x: o.x, y: o.y, yon: o.yon };
  const nehir = !!d.nehirCarpti;
  d.nehirCarpti = false;
  return { carpti, nehir };
}

// Olayları al ve listeyi boşalt
export function olaylariAl(d) {
  const l = d.olaylar;
  d.olaylar = [];
  return l;
}

// ---------- Sesli özetler ----------
export function durumOzeti(d) {
  const k = d.k;
  const h = hesapla(k);
  const xpYuzde = k.seviye >= SEVIYE_SINIRI ? 100 : Math.floor((k.xp / gerekenXp(k.seviye)) * 100);
  let m = `Seviye ${k.seviye}, deneyim yüzde ${xpYuzde}. Can ${Math.round(k.can)} / ${h.enCan}. Mana ${Math.round(k.mana)} / ${h.enMana}. ${k.iksir} iksir, ${k.altin} altın.`;
  if (k.serbestPuan) m += ` Dağıtılacak ${k.serbestPuan} nitelik puanın var.`;
  return m;
}

export function enYakinYer(d, menzil = 60) {
  return YERLER.map((yr) => ({ yr, m: mesafe(yr, d.oyuncu) }))
    .filter((x) => x.m < menzil)
    .sort((a, b) => a.m - b.m)[0] || null;
}

export function konumOzeti(d) {
  const o = d.oyuncu;
  const r = Math.hypot(o.x, o.y);
  const b = bolgeBul(o.x, o.y);
  let m = `Bölge: ${b.ad}.`;
  if (r >= DUNYA.koyYaricap) m += ` Köy ${saatSozu(saatYonu(o, { x: 0, y: 0 }))}, ${Math.round(r)} metre.`;
  const yy = enYakinYer(d);
  if (yy && yy.m > 3) m += ` En yakın yer: ${yy.yr.ad}, ${saatSozu(saatYonu(o, yy.yr))}, ${metreSozu(yy.m)}.`;
  if (b.id === 'cayir' && r > 60) m += ' Gümüş Çay yakında; köprüler dört yolun üzerinde.';
  return `${m} Yüzün ${pusulaYonu(o.yon)} yönüne dönük.`;
}

export function etrafiTara(d, menzil = 35) {
  const liste = yakindakiler(d, menzil).slice(0, 4);
  const npc = d.npcler
    .map((n) => ({ n, m: mesafe(n, d.oyuncu) }))
    .filter((x) => x.m < 25)
    .sort((a, b) => a.m - b.m);
  const parcalar = [];
  npc.forEach(({ n, m }) => parcalar.push(`${n.ad}, ${saatSozu(saatYonu(d.oyuncu, n))}, ${metreSozu(m)}`));
  liste.forEach(({ c, m }) => parcalar.push(`${c.ad} seviye ${c.seviye}, ${saatSozu(saatYonu(d.oyuncu, c))}, ${metreSozu(m)}`));
  const yy = enYakinYer(d, 40);
  if (yy) parcalar.push(`${yy.yr.ad}, ${saatSozu(saatYonu(d.oyuncu, yy.yr))}, ${metreSozu(yy.m)}`);
  if (!parcalar.length) return `${menzil} metre içinde kimse yok. ${konumOzeti(d)}`;
  return parcalar.join('. ') + '.';
}

// Kayıt için sade kopya
export function kayitHazirla(k) {
  return JSON.parse(JSON.stringify(k));
}
export function kayittanYukle(veri) {
  if (!veri || veri.surum !== 1 || !SINIFLAR[veri.sinif]) return null;
  const k = veri;
  k.kesif = k.kesif || [];
  k.gezilen = k.gezilen || [];
  const h = hesapla(k);
  k.can = Math.min(h.enCan, Math.max(1, k.can || h.enCan));
  k.mana = Math.min(h.enMana, k.mana || 0);
  return k;
}
