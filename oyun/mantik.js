// ==== VAHŞİ TOPRAKLAR: SAF OYUN MANTIĞI ====
// Arayüzden bağımsız: avcı, hayvanlar, savaş, seviye, harita, yön tarifleri.
import { HAYVANLAR, HARITALAR, SILAHLAR, ZIRHLAR, YETENEKLER, IKSIR, SEVIYE_SINIRI, KAMP_YARICAP } from './veri.js';

export function tohumluUretec(tohum) {
  let s = tohum >>> 0 || 1;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const arasi = (rng, a, b) => a + rng() * (b - a);
const sinirla = (v, a, b) => Math.max(a, Math.min(b, v));

export const haritaBul = (id) => HARITALAR.find((h) => h.id === id) || HARITALAR[0];
export const silahBul = (id) => SILAHLAR.find((s) => s.id === id) || SILAHLAR[0];
export const zirhBul = (id) => ZIRHLAR.find((s) => s.id === id) || ZIRHLAR[0];

// ---------- Avcı ----------
export function gerekenXp(seviye) {
  return Math.round(60 * Math.pow(seviye, 1.7));
}

export function avciOlustur(ad) {
  return {
    ad,
    seviye: 1,
    xp: 0,
    altin: 30,
    iksir: 3,
    can: 100,
    silah: 'sopa',
    zirh: 'yok',
    silahlar: ['sopa'],
    zirhlar: ['yok'],
    harita: 'orman',
    avlanan: 0,
    patronlar: [],
    olum: 0,
  };
}

export function hesapla(k) {
  const s = silahBul(k.silah);
  const z = zirhBul(k.zirh);
  return {
    enCan: Math.round(100 + 18 * (k.seviye - 1) + z.can),
    saldiri: Math.round(s.hasar * (1 + 0.04 * (k.seviye - 1))),
    savunma: z.savunma + k.seviye,
    hiz: s.hiz,
    menzil: s.menzil,
    silah: s,
    zirh: z,
  };
}

export function xpEkle(k, miktar) {
  const atlananlar = [];
  if (k.seviye >= SEVIYE_SINIRI) return atlananlar;
  k.xp += miktar;
  while (k.seviye < SEVIYE_SINIRI && k.xp >= gerekenXp(k.seviye)) {
    k.xp -= gerekenXp(k.seviye);
    k.seviye += 1;
    k.can = hesapla(k).enCan;
    const yeni = YETENEKLER.filter((y) => y.seviye === k.seviye).map((y) => y.ad);
    const harita = HARITALAR.find((h) => h.seviye[0] === k.seviye);
    atlananlar.push({ seviye: k.seviye, yeniYetenek: yeni, yeniHarita: harita ? harita.ad : null });
  }
  if (k.seviye >= SEVIYE_SINIRI) k.xp = 0;
  return atlananlar;
}

export function hayvanStat(tur, seviye) {
  const t = HAYVANLAR[tur];
  return {
    enCan: Math.round(t.can * (1 + 0.18 * (seviye - 1))),
    saldiri: Math.round(t.saldiri * 1.35 * (1 + 0.17 * (seviye - 1))),
    savunma: Math.round(seviye * 1.2),
  };
}

export function hasarHesapla({ saldiri, savunma, saldiranSeviye, hedefSeviye, carpan = 1, kritik = 0.07, rng = Math.random }) {
  const fark = hedefSeviye - saldiranSeviye;
  const iskaSans = sinirla(0.06 + Math.max(0, fark - 3) * 0.06, 0.03, 0.6);
  if (rng() < iskaSans) return { hasar: 0, iska: true, kritik: false };
  const oran = Math.min(0.7, savunma / (savunma + 50));
  let hasar = saldiri * carpan * arasi(rng, 0.9, 1.1) * (1 - oran);
  const krit = rng() < kritik;
  if (krit) hasar *= 1.8;
  return { hasar: Math.max(1, Math.round(hasar)), iska: false, kritik: krit };
}

// ---------- Yön tarifi ----------
const PUSULA = ['kuzey', 'kuzeydoğu', 'doğu', 'güneydoğu', 'güney', 'güneybatı', 'batı', 'kuzeybatı'];
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
export function dunyaOlustur(k, haritaId, tohum = 11) {
  const harita = haritaBul(haritaId || k.harita);
  k.harita = harita.id;
  const rng = tohumluUretec(tohum + harita.id.length * 97 + harita.id.charCodeAt(0));
  const d = {
    k,
    harita,
    rng,
    zaman: 0,
    oyuncu: { x: 0, y: 2, yon: 0 },
    engeller: [],
    goller: [],
    hayvanlar: [],
    olaylar: [],
    hedefId: null,
    otoSaldiri: false,
    yaklas: false,
    saldiriSayac: 0,
    bekleme: {},
    etki: {},
    olu: false,
    kampa: null,
    sonCatisma: -99,
  };
  const R = harita.yaricap;
  const bosMu = (x, y, r) => {
    if (Math.hypot(x, y) < KAMP_YARICAP + 3) return false;
    if (Math.hypot(x, y) > R - 3) return false;
    for (const e of d.engeller) if (Math.hypot(x - e.x, y - e.y) < e.r + r + 1.2) return false;
    return true;
  };
  // Göller (bataklıkta): geçilmez su
  for (let i = 0; i < (harita.gol || 0); i++) {
    for (let deneme = 0; deneme < 30; deneme++) {
      const a = rng() * Math.PI * 2;
      const r = arasi(rng, 24, R - 12);
      const x = Math.sin(a) * r;
      const y = Math.cos(a) * r;
      const yr = arasi(rng, 3, 7);
      if (!bosMu(x, y, yr + 2)) continue;
      d.goller.push({ x, y, r: yr });
      d.engeller.push({ tur: 'gol', x, y, r: yr });
      break;
    }
  }
  harita.agac.forEach(({ tur, sayi }) => {
    for (let i = 0; i < sayi; i++) {
      for (let deneme = 0; deneme < 20; deneme++) {
        const a = rng() * Math.PI * 2;
        const r = arasi(rng, KAMP_YARICAP + 4, R - 4);
        const x = Math.sin(a) * r;
        const y = Math.cos(a) * r;
        const boy = arasi(rng, 0.8, 1.35);
        const er = tur === 'saz' ? 0.3 : tur === 'kaktus' ? 0.5 : tur === 'akasya' ? 0.6 : 0.55;
        if (!bosMu(x, y, er)) continue;
        d.engeller.push({ tur: 'agac', agacTur: tur, x, y, r: er * boy, boy });
        break;
      }
    }
  });
  for (let i = 0; i < harita.kaya; i++) {
    for (let deneme = 0; deneme < 20; deneme++) {
      const a = rng() * Math.PI * 2;
      const r = arasi(rng, KAMP_YARICAP + 4, R - 4);
      const x = Math.sin(a) * r;
      const y = Math.cos(a) * r;
      const kr = arasi(rng, 0.6, 1.8);
      if (!bosMu(x, y, kr)) continue;
      d.engeller.push({ tur: 'kaya', x, y, r: kr });
      break;
    }
  }
  // Tüccar kampın içinde
  d.tuccar = { x: 4, y: 5, yon: Math.PI, ad: 'Tüccar' };
  // Hayvanlar
  let id = 1;
  const ekle = (tur, seviye, x, y) => {
    const st = hayvanStat(tur, seviye);
    d.hayvanlar.push({
      id: id++,
      tur,
      ad: HAYVANLAR[tur].ad,
      seviye,
      x,
      y,
      dogX: x,
      dogY: y,
      yon: rng() * Math.PI * 2,
      can: st.enCan,
      enCan: st.enCan,
      st,
      durum: 'bos',
      sayac: rng() * 3,
      sesSayac: 3 + rng() * 10,
      olu: false,
      dirilme: 0,
      kizgin: false,
    });
  };
  harita.hayvanlar.forEach(({ tur, sayi, halka }) => {
    for (let i = 0; i < sayi; i++) {
      for (let deneme = 0; deneme < 30; deneme++) {
        const a = rng() * Math.PI * 2;
        const r = arasi(rng, halka[0], halka[1]);
        const x = Math.sin(a) * r;
        const y = Math.cos(a) * r;
        if (!bosMu(x, y, 1)) continue;
        const oran = sinirla((r - 18) / (R - 26), 0, 1);
        const sv = Math.round(harita.seviye[0] + (harita.seviye[1] - harita.seviye[0]) * oran);
        ekle(tur, sv, x, y);
        break;
      }
    }
  });
  const p = harita.patron;
  ekle(p.tur, p.seviye, p.x, p.y);
  // Kayıttaki konumda başla (aynı haritadaysa)
  if (k.konum && k.konum.harita === harita.id) {
    d.oyuncu.x = k.konum.x;
    d.oyuncu.y = k.konum.y;
    d.oyuncu.yon = k.konum.yon || 0;
  }
  k.can = Math.min(k.can, hesapla(k).enCan);
  if (k.can <= 0) k.can = Math.round(hesapla(k).enCan * 0.6);
  return d;
}

function olay(d, tur, metin, oncelik = 1, ek = {}) {
  d.olaylar.push({ tur, metin, oncelik, zaman: d.zaman, ...ek });
}
export function olaylariAl(d) {
  const l = d.olaylar;
  d.olaylar = [];
  return l;
}

export function hedef(d) {
  const c = d.hedefId ? d.hayvanlar.find((h) => h.id === d.hedefId) : null;
  return c && !c.olu ? c : null;
}
export function yakindakiler(d, menzil = 40) {
  return d.hayvanlar
    .filter((c) => !c.olu)
    .map((c) => ({ c, m: mesafe(d.oyuncu, c) }))
    .filter((o) => o.m <= menzil)
    .sort((a, b) => a.m - b.m);
}
export function hedefTarifi(d, c) {
  const yuzde = Math.round((c.can / c.enCan) * 100);
  return `${c.ad}, seviye ${c.seviye}, ${saatSozu(saatYonu(d.oyuncu, c))}, ${metreSozu(mesafe(d.oyuncu, c))}${yuzde < 100 ? `, canı yüzde ${yuzde}` : ''}`;
}
export function hedefDegistir(d, menzil = 45) {
  const liste = yakindakiler(d, menzil);
  if (!liste.length) {
    d.hedefId = null;
    olay(d, 'hedef', `${menzil} metre içinde hayvan yok.`, 2);
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
export function patronaGit(d) {
  const p = d.hayvanlar.find((h) => HAYVANLAR[h.tur].patron);
  if (!p || p.olu) {
    olay(d, 'hata', 'Bölgenin lideri şu an ortalıkta yok. Biraz sonra yeniden çıkar.', 3);
    return;
  }
  d.hedefId = p.id;
  d.yaklas = true;
  d.otoSaldiri = false;
  d.kampa = null;
  olay(d, 'hedef', `${p.ad}e doğru yürüyorsun. ${saatSozu(saatYonu(d.oyuncu, p))}, ${metreSozu(mesafe(d.oyuncu, p))}.`, 3, { id: p.id });
}
export function saldir(d) {
  if (d.olu) return;
  let c = hedef(d);
  if (!c) c = hedefDegistir(d, 45);
  if (!c) return;
  d.otoSaldiri = true;
  d.yaklas = true;
  d.kampa = null;
}
export function dur(d) {
  d.otoSaldiri = false;
  d.yaklas = false;
}
export function kamptaMi(d) {
  return Math.hypot(d.oyuncu.x, d.oyuncu.y) < KAMP_YARICAP;
}
export function tuccarYakinMi(d) {
  return mesafe(d.oyuncu, d.tuccar) < 5;
}

// ---------- Savaş ----------
function oyuncuyaHasar(d, c, ham) {
  const k = d.k;
  let hasar = ham;
  if (d.etki.nida && d.etki.nida > d.zaman) hasar *= 0.5;
  hasar = Math.max(1, Math.round(hasar));
  const enCan = hesapla(k).enCan;
  const once = k.can / enCan;
  k.can = Math.max(0, k.can - hasar);
  d.sonCatisma = d.zaman;
  const sonra = k.can / enCan;
  olay(d, 'hasarAldin', '', 0, { miktar: hasar, id: c.id });
  if (once > 0.5 && sonra <= 0.5) olay(d, 'canUyari', 'Canın yarıya indi.', 3);
  if (once > 0.25 && sonra <= 0.25) olay(d, 'canUyari', 'Canın çok az! İksir iç ya da kaç.', 4);
  if (k.can <= 0) oyuncuOldu(d, c);
}

function oyuncuOldu(d, c) {
  const k = d.k;
  d.olu = true;
  d.otoSaldiri = false;
  d.yaklas = false;
  d.hedefId = null;
  k.olum += 1;
  const kayip = Math.floor(k.altin * 0.1);
  k.altin -= kayip;
  d.hayvanlar.forEach((h) => {
    if (h.durum === 'kovala') h.durum = 'don';
  });
  olay(d, 'oldun', `${c.ad} seni yere serdi.${kayip ? ` ${kayip} altın düşürdün.` : ''} Kampta yeniden doğmak için Yeniden doğ düğmesine dokun.`, 5);
}

export function yenidenDog(d) {
  if (!d.olu) return;
  const k = d.k;
  k.can = Math.round(hesapla(k).enCan * 0.7);
  d.oyuncu.x = 0;
  d.oyuncu.y = 2;
  d.oyuncu.yon = 0;
  d.olu = false;
  d.etki = {};
  olay(d, 'dogdun', 'Kampta yeniden doğdun.', 4);
}

function hayvanOldu(d, c) {
  const k = d.k;
  const t = HAYVANLAR[c.tur];
  c.olu = true;
  c.dirilme = d.zaman + (t.patron ? 240 : 30);
  c.durum = 'bos';
  c.kizgin = false;
  k.avlanan += 1;
  const xp = Math.round(14 * Math.pow(c.seviye, 1.2) * t.xp * (c.seviye < k.seviye - 6 ? 0.3 : 1));
  const altin = Math.round((c.seviye * 3 + d.rng() * c.seviye * 2) * (t.patron ? 8 : 1));
  k.altin += altin;
  let metin = `${c.ad} yere düştü. ${xp} deneyim, ${altin} altın.`;
  if (t.patron && !k.patronlar.includes(c.tur)) {
    k.patronlar.push(c.tur);
    metin = `Büyük av! ${c.ad} yere düştü. Bölgenin lideri yenildi. ${xp} deneyim, ${altin} altın.`;
  }
  if (d.rng() < 0.12 && k.iksir < IKSIR.enCok) {
    k.iksir += 1;
    metin += ' Bir şifa iksiri buldun.';
  }
  if (d.hedefId === c.id) d.hedefId = null;
  // Sana saldıran başka biri varsa hedef ona geçer
  const sonraki = d.hayvanlar.filter((h) => !h.olu && h.durum === 'kovala').sort((a, b) => mesafe(a, d.oyuncu) - mesafe(b, d.oyuncu))[0];
  if (sonraki) {
    d.hedefId = sonraki.id;
    metin += ` Sıradaki: ${hedefTarifi(d, sonraki)}.`;
  } else {
    d.otoSaldiri = false;
    d.yaklas = false;
  }
  olay(d, 'oldurdun', metin, 4, { id: c.id, patron: !!t.patron });
  xpEkle(k, xp).forEach((s) => {
    let m = `Seviye atladın! Artık seviye ${s.seviye}.`;
    if (s.yeniYetenek.length) m += ` Yeni yetenek: ${s.yeniYetenek.join(', ')}.`;
    if (s.yeniHarita) m += ` Yeni harita açıldı: ${s.yeniHarita}.`;
    const yeniSilah = SILAHLAR.find((x) => x.seviye === s.seviye);
    if (yeniSilah) m += ` Tüccarda yeni silah: ${yeniSilah.ad}.`;
    olay(d, 'seviye', m, 5, { seviye: s.seviye });
  });
}

function hayvanaHasar(d, c, hasar, kritik) {
  c.can = Math.max(0, c.can - hasar);
  c.kizgin = true;
  if (c.durum !== 'kovala') c.durum = 'kovala';
  d.sonCatisma = d.zaman;
  olay(d, 'hasarVerdin', '', 0, { id: c.id, miktar: hasar, kritik });
  if (c.can <= 0) hayvanOldu(d, c);
}

function oyuncuVurusu(d, c, carpan = 1) {
  const k = d.k;
  const h = hesapla(k);
  const r = hasarHesapla({ saldiri: h.saldiri, savunma: c.st.savunma, saldiranSeviye: k.seviye, hedefSeviye: c.seviye, carpan, rng: d.rng });
  if (r.iska) {
    olay(d, 'iska', '', 0, { id: c.id });
    if (c.durum !== 'kovala') c.durum = 'kovala';
    c.kizgin = true;
    return;
  }
  hayvanaHasar(d, c, r.hasar, r.kritik);
}

export function yetenekDurumu(d, y) {
  if (y.seviye > d.k.seviye) return { hazir: false, kilitli: true, kalan: 0 };
  const kalan = Math.max(0, (d.bekleme[y.id] || 0) - d.zaman);
  return { hazir: kalan <= 0 && !d.olu, kalan };
}

export function yetenekKullan(d, id) {
  const y = YETENEKLER.find((x) => x.id === id);
  if (!y || d.olu) return;
  const dur = yetenekDurumu(d, y);
  if (dur.kilitli) return olay(d, 'yetenekHazirDegil', `${y.ad} seviye ${y.seviye}'te açılır.`, 3);
  if (!dur.hazir) return olay(d, 'yetenekHazirDegil', `${y.ad} ${Math.ceil(dur.kalan)} saniye sonra hazır.`, 3);
  const k = d.k;
  const h = hesapla(k);
  if (id === 'gucluVurus') {
    const c = hedef(d);
    if (!c) return olay(d, 'yetenekHazirDegil', 'Önce bir hedef seç.', 3);
    if (mesafe(d.oyuncu, c) > h.menzil + 0.5) {
      d.yaklas = true;
      d.otoSaldiri = true;
      return olay(d, 'menzil', `Hedef menzil dışında, ${metreSozu(mesafe(d.oyuncu, c))}. Yaklaşıyorsun.`, 3);
    }
    d.bekleme[id] = d.zaman + y.bekleme;
    d.oyuncu.yon = yonAcisi(d.oyuncu, c);
    olay(d, 'yetenek', 'Güçlü vuruş!', 2, { id });
    oyuncuVurusu(d, c, 2.3);
    d.otoSaldiri = true;
  } else if (id === 'sargi') {
    d.bekleme[id] = d.zaman + y.bekleme;
    const once = k.can;
    k.can = Math.min(h.enCan, k.can + h.enCan * 0.34);
    olay(d, 'iyilestin', `Yaralarını sardın, ${Math.round(k.can - once)} can.`, 3);
  } else if (id === 'avciNidasi') {
    d.bekleme[id] = d.zaman + y.bekleme;
    d.etki.nida = d.zaman + 8;
    olay(d, 'yetenek', 'Avcı nidası! 8 saniye daha az hasar alırsın.', 3, { id });
  } else if (id === 'okYagmuru') {
    const yakin = yakindakiler(d, Math.max(4, h.menzil + 1));
    if (!yakin.length) return olay(d, 'yetenekHazirDegil', 'Çevrende hayvan yok.', 3);
    d.bekleme[id] = d.zaman + y.bekleme;
    olay(d, 'yetenek', `Kasırga! ${yakin.length} hayvana vurdun.`, 3, { id });
    yakin.forEach(({ c }) => oyuncuVurusu(d, c, 1.4));
  }
}

export function iksirIc(d) {
  const k = d.k;
  if (d.olu) return;
  if (!k.iksir) return olay(d, 'iksir', 'Hiç iksirin yok. Tüccardan alabilirsin.', 3);
  const h = hesapla(k);
  if (k.can >= h.enCan) return olay(d, 'iksir', 'Canın zaten dolu.', 3);
  k.iksir -= 1;
  k.can = Math.min(h.enCan, k.can + h.enCan * IKSIR.iyilestir);
  olay(d, 'iksir', `İksir içtin. Can ${Math.round(k.can)} / ${h.enCan}. ${k.iksir} iksir kaldı.`, 3, { icildi: true });
}

export function kampaDon(d) {
  if (d.olu) return;
  if (kamptaMi(d)) return olay(d, 'kampa', 'Zaten kamptasın.', 3);
  d.kampa = d.zaman + 5;
  d.otoSaldiri = false;
  d.yaklas = false;
  olay(d, 'kampa', 'Kampa dönüş başladı. 5 saniye kıpırdama.', 3, { basladi: true });
}

// ---------- Tüccar ----------
export function satinAl(k, tur, id) {
  if (tur === 'iksir') {
    if (k.iksir >= IKSIR.enCok) return { hata: `En çok ${IKSIR.enCok} iksir taşıyabilirsin.` };
    if (k.altin < IKSIR.fiyat) return { hata: 'Altının yetmiyor.' };
    k.altin -= IKSIR.fiyat;
    k.iksir += 1;
    return { metin: `İksir aldın. ${k.iksir} iksirin, ${k.altin} altının var.` };
  }
  const liste = tur === 'silah' ? SILAHLAR : ZIRHLAR;
  const sahip = tur === 'silah' ? k.silahlar : k.zirhlar;
  const e = liste.find((x) => x.id === id);
  if (!e) return { hata: 'Bulunamadı.' };
  if (sahip.includes(id)) {
    if (tur === 'silah') k.silah = id;
    else k.zirh = id;
    k.can = Math.min(k.can, hesapla(k).enCan);
    return { metin: `${e.ad} kuşandın.` };
  }
  if (e.seviye > k.seviye) return { hata: `${e.ad} için seviye ${e.seviye} olmalısın.` };
  if (k.altin < e.fiyat) return { hata: `Altının yetmiyor. ${e.fiyat - k.altin} altın daha gerekli.` };
  k.altin -= e.fiyat;
  sahip.push(id);
  if (tur === 'silah') k.silah = id;
  else k.zirh = id;
  return { metin: `${e.ad} satın aldın ve kuşandın. ${k.altin} altının kaldı.` };
}

// ---------- Hareket ----------
export const HIZ = { yuru: 5.4, don: 2.4 };

function hareketEt(d, dx, dy) {
  const o = d.oyuncu;
  let nx = o.x + dx;
  let ny = o.y + dy;
  for (const e of d.engeller) {
    const ex = nx - e.x;
    const ey = ny - e.y;
    const m = Math.hypot(ex, ey);
    const min = e.r + 0.45;
    if (m < min && m > 0.0001) {
      nx = e.x + (ex / m) * min;
      ny = e.y + (ey / m) * min;
      if (e.tur === 'gol') d.golCarpti = true;
    }
  }
  const R = d.harita.yaricap;
  const r = Math.hypot(nx, ny);
  if (r > R) {
    nx = (nx / r) * R;
    ny = (ny / r) * R;
  }
  const carpti = Math.hypot(nx - (o.x + dx), ny - (o.y + dy)) > 0.05;
  o.x = nx;
  o.y = ny;
  return carpti;
}
function engelVar(d, x, y) {
  for (const e of d.engeller) if (Math.hypot(x - e.x, y - e.y) < e.r + 0.55) return true;
  return false;
}
function engeldenKacan(d, aci) {
  const o = d.oyuncu;
  const yokla = (a) => !engelVar(d, o.x + Math.sin(a) * 1.4, o.y + Math.cos(a) * 1.4) && !engelVar(d, o.x + Math.sin(a) * 0.7, o.y + Math.cos(a) * 0.7);
  if (yokla(aci)) {
    d.kacis = 0;
    return aci;
  }
  const taraf = d.kacis || 1;
  for (const f of [0.4, 0.8, 1.2, 1.6, 2.0, 2.4]) {
    for (const t of [taraf, -taraf]) {
      if (yokla(aci + f * t)) {
        d.kacis = t;
        return aci + f * t;
      }
    }
  }
  return aci;
}
// Hayvanlar da engellerin içinden geçmesin
function hayvanItele(d, c) {
  for (const e of d.engeller) {
    const ex = c.x - e.x;
    const ey = c.y - e.y;
    const m = Math.hypot(ex, ey);
    const min = e.r + 0.4;
    if (m < min && m > 0.0001) {
      c.x = e.x + (ex / m) * min;
      c.y = e.y + (ey / m) * min;
    }
  }
  const r = Math.hypot(c.x, c.y);
  if (r < KAMP_YARICAP) {
    c.x = (c.x / (r || 1)) * KAMP_YARICAP;
    c.y = (c.y / (r || 1)) * KAMP_YARICAP;
  }
}

// ---------- Ana döngü ----------
export function guncelle(d, dt, girdi = {}) {
  dt = Math.min(dt, 0.1);
  d.zaman += dt;
  const k = d.k;
  const h = hesapla(k);
  const o = d.oyuncu;
  let carpti = false;

  if (!d.olu) {
    const ileri = sinirla(girdi.ileri || 0, -1, 1);
    const don = sinirla(girdi.don || 0, -1, 1);
    const elle = Math.abs(ileri) > 0.08 || Math.abs(don) > 0.08;
    if (elle) {
      d.yaklas = false;
      if (d.kampa) {
        d.kampa = null;
        olay(d, 'kampa', 'Kampa dönüş iptal oldu.', 2);
      }
      o.yon = aciNormal(o.yon + don * HIZ.don * dt);
      const v = ileri * HIZ.yuru * (ileri < 0 ? 0.55 : 1) * dt;
      carpti = hareketEt(d, Math.sin(o.yon) * v, Math.cos(o.yon) * v);
    }
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
          if (!d.ilerleme || d.zaman - d.ilerleme.zaman > 1.5) {
            if (d.ilerleme && d.ilerleme.kalan - m < 0.5 && !(d.sapma && d.sapma.bitis > d.zaman)) {
              d.sapma = { aci: (d.rng() < 0.5 ? -1 : 1) * (1 + d.rng() * 0.8), bitis: d.zaman + 1.3 };
            }
            d.ilerleme = { zaman: d.zaman, kalan: m };
          }
          let aci = yonAcisi(o, c);
          if (d.sapma && d.sapma.bitis > d.zaman) aci += d.sapma.aci;
          o.yon = engeldenKacan(d, aci);
          const v = HIZ.yuru * dt;
          carpti = hareketEt(d, Math.sin(o.yon) * v, Math.cos(o.yon) * v) || carpti;
        }
      } else if (d.otoSaldiri) {
        if (!elle) o.yon = yonAcisi(o, c);
        d.saldiriSayac -= dt;
        if (d.saldiriSayac <= 0) {
          d.saldiriSayac = h.hiz;
          oyuncuVurusu(d, c, 1);
        }
      }
    }
    if (d.saldiriSayac > 0 && !d.otoSaldiri) d.saldiriSayac -= dt;

    // Yenilenme: kampta hızlı, çatışma dışında yavaş
    const oran = kamptaMi(d) ? 0.08 : d.zaman - d.sonCatisma < 6 ? 0 : 0.012;
    k.can = Math.min(h.enCan, k.can + h.enCan * oran * dt);

    if (d.kampa && d.zaman >= d.kampa) {
      d.kampa = null;
      d.hedefId = null;
      o.x = 0;
      o.y = 2;
      o.yon = 0;
      olay(d, 'kampa', 'Kamptasın. Tüccar sağ önünde.', 3, { vardin: true });
    }
  }

  // Hayvanlar
  const kampta = kamptaMi(d);
  for (const c of d.hayvanlar) {
    const t = HAYVANLAR[c.tur];
    if (c.olu) {
      if (d.zaman >= c.dirilme && mesafe(o, { x: c.dogX, y: c.dogY }) > 25) {
        c.olu = false;
        c.can = c.enCan;
        c.x = c.dogX;
        c.y = c.dogY;
        c.durum = 'bos';
      }
      continue;
    }
    const mOyuncu = mesafe(c, o);
    const mDog = Math.hypot(c.x - c.dogX, c.y - c.dogY);
    c.sesSayac -= dt;
    if (c.durum === 'bos') {
      const algi = t.patron ? 14 : 9;
      const saldirir = t.saldirgan && (c.seviye >= k.seviye - 6 || t.patron);
      if (!d.olu && !kampta && saldirir && mOyuncu < algi) {
        c.durum = 'kovala';
        if (!hedef(d)) d.hedefId = c.id;
        olay(d, 'saldiriyor', `${c.ad} sana saldırıyor, ${saatSozu(saatYonu(o, c))}.${d.hedefId === c.id ? ' Hedefin oldu.' : ''}`, 3, { id: c.id });
      } else {
        c.sayac -= dt;
        if (c.sayac <= 0) {
          c.sayac = 3 + d.rng() * 4;
          const a = d.rng() * Math.PI * 2;
          c.gezHedef = d.rng() < 0.4 ? null : { x: c.dogX + Math.sin(a) * 7, y: c.dogY + Math.cos(a) * 7 };
        }
        if (c.gezHedef) {
          const m = Math.hypot(c.gezHedef.x - c.x, c.gezHedef.y - c.y);
          if (m > 0.3) {
            c.yon = Math.atan2(c.gezHedef.x - c.x, c.gezHedef.y - c.y);
            const v = Math.min(m, t.hiz * 0.28 * dt);
            c.x += Math.sin(c.yon) * v;
            c.y += Math.cos(c.yon) * v;
          }
        }
      }
    } else if (c.durum === 'kovala') {
      if (d.olu || mDog > (t.patron ? 34 : 42) || kampta) {
        c.durum = 'don';
      } else {
        c.yon = yonAcisi(c, o);
        if (mOyuncu > 1.4 + t.boy * 0.5) {
          const v = t.hiz * dt;
          c.x += Math.sin(c.yon) * v;
          c.y += Math.cos(c.yon) * v;
        } else {
          c.sayac -= dt;
          if (c.sayac <= 0) {
            c.sayac = t.patron ? 2.0 : 1.7;
            const r = hasarHesapla({ saldiri: c.st.saldiri, savunma: h.savunma, saldiranSeviye: c.seviye, hedefSeviye: k.seviye, kritik: 0.05, rng: d.rng });
            if (r.iska) olay(d, 'kacindin', '', 0, { id: c.id });
            else oyuncuyaHasar(d, c, r.hasar);
          }
        }
      }
    } else if (c.durum === 'don') {
      const m = Math.hypot(c.dogX - c.x, c.dogY - c.y);
      if (m < 0.6) {
        c.durum = 'bos';
        c.can = c.enCan;
        c.kizgin = false;
      } else {
        c.yon = Math.atan2(c.dogX - c.x, c.dogY - c.y);
        const v = Math.min(m, t.hiz * 1.2 * dt);
        c.x += Math.sin(c.yon) * v;
        c.y += Math.cos(c.yon) * v;
        c.can = Math.min(c.enCan, c.can + c.enCan * 0.2 * dt);
      }
    }
    hayvanItele(d, c);
  }

  // Kampa giriş/çıkış duyurusu
  if (kampta !== d.kamptaydi) {
    if (d.kamptaydi !== undefined) olay(d, 'bolge', kampta ? 'Kampa girdin. Burada hayvanlar sana saldırmaz.' : `Kamptan çıktın. ${d.harita.ad}.`, 2);
    d.kamptaydi = kampta;
  }

  k.konum = { harita: d.harita.id, x: o.x, y: o.y, yon: o.yon };
  const gol = !!d.golCarpti;
  d.golCarpti = false;
  return { carpti, gol };
}

// ---------- Sesli özetler ----------
export function durumOzeti(d) {
  const k = d.k;
  const h = hesapla(k);
  const xpYuzde = k.seviye >= SEVIYE_SINIRI ? 100 : Math.floor((k.xp / gerekenXp(k.seviye)) * 100);
  return `Seviye ${k.seviye}, deneyim yüzde ${xpYuzde}. Can ${Math.round(k.can)} / ${h.enCan}. Silah ${h.silah.ad}, zırh ${h.zirh.id === 'yok' ? 'yok' : h.zirh.ad}. ${k.iksir} iksir, ${k.altin} altın.`;
}

export function konumOzeti(d) {
  const o = d.oyuncu;
  const r = Math.hypot(o.x, o.y);
  let m = `${d.harita.ad}.`;
  if (r < KAMP_YARICAP) m += ' Kamptasın.';
  else m += ` Kamp ${saatSozu(saatYonu(o, { x: 0, y: 0 }))}, ${Math.round(r)} metre.`;
  const sinir = d.harita.yaricap - r;
  if (sinir < 12) m += ' Haritanın kenarındasın.';
  return `${m} Yüzün ${pusulaYonu(o.yon)} yönüne dönük.`;
}

export function etrafiTara(d, menzil = 35) {
  const liste = yakindakiler(d, menzil).slice(0, 5);
  const parcalar = [];
  if (Math.hypot(d.oyuncu.x, d.oyuncu.y) < 30) {
    parcalar.push(`Tüccar, ${saatSozu(saatYonu(d.oyuncu, d.tuccar))}, ${metreSozu(mesafe(d.oyuncu, d.tuccar))}`);
  }
  liste.forEach(({ c, m }) => parcalar.push(`${c.ad} seviye ${c.seviye}${c.durum === 'kovala' ? ', sana saldırıyor' : ''}, ${saatSozu(saatYonu(d.oyuncu, c))}, ${metreSozu(m)}`));
  if (!parcalar.length) return `${menzil} metre içinde hayvan yok. ${konumOzeti(d)}`;
  return parcalar.join('. ') + '.';
}

export function haritaDurumu(k, h) {
  if (k.seviye < h.seviye[0]) return { acik: false, metin: `${h.ad}, kilitli, seviye ${h.seviye[0]}'te açılır` };
  const lider = HAYVANLAR[h.patron.tur].ad;
  const yenildi = k.patronlar.includes(h.patron.tur);
  return { acik: true, metin: `${h.ad}, hayvanlar seviye ${h.seviye[0]} ile ${h.seviye[1]} arası, lider ${lider}${yenildi ? ' yenildi' : ''}${k.harita === h.id ? ', buradasın' : ''}` };
}

export function kayitHazirla(k) {
  return JSON.parse(JSON.stringify(k));
}
export function kayittanYukle(v) {
  if (!v || typeof v !== 'object' || !v.ad) return null;
  const k = { ...avciOlustur(v.ad), ...v };
  if (!Array.isArray(k.silahlar)) k.silahlar = ['sopa'];
  if (!Array.isArray(k.zirhlar)) k.zirhlar = ['yok'];
  if (!Array.isArray(k.patronlar)) k.patronlar = [];
  return k;
}
