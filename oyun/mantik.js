// ==== VAHŞİ YAŞAM: SAF OYUN MANTIĞI ====
// Arayüzden bağımsız: zaman, arazi, hayvan bireyleri ve sürüleri, günlük rutinler, av-avcı, doğum,
// oyuncuya tepki ve alışma, gözlem / fotoğraf / ses kaydı, arşiv, araç, yol bulma, sesli özetler.
// Kalıcı her şey araştırmacı nesnesinde (k) durur; d yalnızca o anki oturumun geçici durumunu tutar.
import {
  YARICAP, ISTASYON, ARAC_YERI, OYUN_DK_SN, BASLANGIC_SAATI, GOLET, NEHIR_YARI, nehirY, GECITLER, KAYALIK, MAGARA, YERLER,
  BOLGE_ADLARI, DAVRANISLAR, SES_TURLERI, TURLER, TUR_SIRASI, KISILIKLER, EVRELER, EKIPMAN, ARAC, YURUME,
} from './veri.js';
import * as E from './ekosistem.js';

export const KAYIT_SURUMU = 1;
if (GOLET.su === undefined) GOLET.su = GOLET.r; // göletin o anki su yarıçapı (ekosistem.goletAyarla günceller)

// Konuşmada kullanılan kısa tür adları
export const SOZ = {
  aslan: 'Aslan', leopar: 'Leopar', sirtlan: 'Sırtlan', fil: 'Fil', zurafa: 'Zürafa', zebra: 'Zebra', ceylan: 'Ceylan',
  domuz: 'Yaban domuzu', suAygiri: 'Su aygırı', timsah: 'Timsah', gergedan: 'Gergedan', kartal: 'Balık kartalı', piton: 'Piton', manda: 'Manda',
};
const kucuk = (s) => s.toLocaleLowerCase('tr-TR');

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
const sec = (rng, l) => l[Math.floor(rng() * l.length)];

// ---------- Yön ve uzaklık ----------
const PUSULA = ['kuzey', 'kuzeydoğu', 'doğu', 'güneydoğu', 'güney', 'güneybatı', 'batı', 'kuzeybatı'];
export function aciNormal(a) {
  while (a > Math.PI) a -= 2 * Math.PI;
  while (a < -Math.PI) a += 2 * Math.PI;
  return a;
}
export const mesafe = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
export const yonAcisi = (a, b) => Math.atan2(b.x - a.x, b.y - a.y);
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
  if (m < 20) return `${Math.round(m)} metre`;
  return `${Math.round(m / 5) * 5} metre`;
}
const yerTarifi = (o, h) => `${saatSozu(saatYonu(o, h))}, ${metreSozu(mesafe(o, h))}`;

// ---------- Zaman ----------
export const gunNo = (dk) => Math.floor(dk / 1440) + 1;
export const gunDakikasi = (dk) => ((dk % 1440) + 1440) % 1440;
export function saatMetni(dk) {
  const g = Math.floor(gunDakikasi(dk));
  return `${String(Math.floor(g / 60)).padStart(2, '0')}:${String(g % 60).padStart(2, '0')}`;
}
export function gunEvresi(dk) {
  const s = gunDakikasi(dk) / 60;
  if (s >= 5.5 && s < 7) return 'safak';
  if (s >= 7 && s < 18) return 'gunduz';
  if (s >= 18 && s < 20) return 'aksam';
  return 'gece';
}
const EVRE_ADI = { safak: 'şafak', gunduz: 'gündüz', aksam: 'akşam', gece: 'gece' };
// Işık 0 (gece) .. 1 (öğle); sahne bunu kullanır
export function isikDuzeyi(dk) {
  const s = gunDakikasi(dk) / 60;
  if (s < 5 || s > 20.5) return 0;
  if (s < 7) return (s - 5) / 2;
  if (s > 18.5) return (20.5 - s) / 2;
  return 1;
}
export const zamanSozu = (dk) => `${gunNo(dk)}. gün, saat ${saatMetni(dk)}, ${EVRE_ADI[gunEvresi(dk)]}`;
export const geceMi = (dk) => gunEvresi(dk) === 'gece';
// Dürbün menzili gün evresine ve ekipmana göre (gece görüş dürbünü, termal kamera; Aşama 4)
export function durbunMenzili(dk, k) {
  return Math.round(durbunTaban(dk, k) * (k && k.eko ? E.gorusCarpani(k.eko) : 1));
}
function durbunTaban(dk, k) {
  const e = (k && k.ekipman) || {};
  if (geceMi(dk)) return e.termal ? 70 : e.geceDurbunu ? 55 : EKIPMAN.durbunGece;
  if (gunEvresi(dk) === 'gunduz') return EKIPMAN.durbunGunduz;
  return e.geceDurbunu || e.termal ? 65 : 50;
}
export const kameraMenzili = (k) => (k && k.ekipman && k.ekipman.teleobjektif ? 80 : EKIPMAN.kamera);
export const sesKayitMenzili = (k) => (k && k.ekipman && k.ekipman.parabolik ? 100 : EKIPMAN.sesKayit);
export const personelVar = (k, rol) => !!(k && k.personel && k.personel.some((p) => p.rol === rol));

// ---------- Arazi ----------
export const nehirdeMi = (x, y) => Math.abs(y - nehirY(x)) < NEHIR_YARI;
export const gecitteMi = (x) => GECITLER.some((g) => Math.abs(x - g.x) < g.yari);
export const guneydeMi = (x, y) => y < nehirY(x);
export const golettemi = (x, y, pay = 0) => GOLET.su > 0 && Math.hypot(x - GOLET.x, y - GOLET.y) < GOLET.su + pay;
const goletCanagi = (x, y, pay = 0) => Math.hypot(x - GOLET.x, y - GOLET.y) < GOLET.r + pay;
export function bolgeBul(x, y) {
  if (Math.hypot(x - ISTASYON.x, y - ISTASYON.y) < ISTASYON.r + 2) return 'istasyon';
  if (Math.hypot(x - GOLET.x, y - GOLET.y) < GOLET.r + 14) return 'golet';
  if (Math.abs(y - nehirY(x)) < 16) return 'nehir';
  if (guneydeMi(x, y)) return 'sulak';
  if (Math.hypot(x - KAYALIK.x, y - KAYALIK.y) < KAYALIK.r + 6) return 'kayalik';
  if (y > 78 && x > -50) return 'agaclik';
  return 'otlak';
}
export const bolgeAdi = (x, y) => BOLGE_ADLARI[bolgeBul(x, y)];

// Bir türün bir noktada durabilmesi
function uygunMu(tur, x, y, habitat) {
  const t = TURLER[tur];
  if (Math.hypot(x, y) > YARICAP - 6) return false;
  if (!t.kus && Math.hypot(x - ISTASYON.x, y - ISTASYON.y) < ISTASYON.r + 6) return false;
  if (goletCanagi(x, y, 0.5)) return false;
  if (!t.suCanlisi && nehirdeMi(x, y)) return false;
  if (!t.kus && !t.suCanlisi && habitat) {
    const guney = !!habitat.guneyde;
    if (guneydeMi(x, y) !== guney) return false;
  }
  return true;
}

// ---------- Araştırmacı ----------
export function arastirmaciOlustur(ad) {
  return {
    surum: KAYIT_SURUMU,
    ad,
    itibar: 0,
    dk: BASLANGIC_SAATI,
    oyuncu: { x: 1, y: -2.5, yon: Math.PI / 2 },
    arac: { ...ARAC_YERI },
    aracta: false,
    sayac: {}, // türlere verilen son kimlik numarası
    gezilen: [],
    arsiv: { turler: {}, bireyler: {}, fotolar: [], sesler: [], olaylar: [], bitkiler: {} },
    hayvanlar: null,
    gruplar: null,
    lesler: [],
    sonrakiId: 1,
    egitim: 0,
    // Aşama 4: araştırma merkezi
    butce: 15000,
    ekipman: {},
    stok: { tuzak: 0, tasma: 0 },
    tesisler: [],
    personel: [],
    arastirmalar: {},
    teklifler: [],
    mesajlar: [],
    tuzaklar: [],
    gpsli: [],
    merkezGun: 0,
    // Aşama 5: ekosistem
    eko: null,
    numuneKutusu: [], // sahada alınmış, laboratuvara teslim edilmemiş numuneler
    numuneler: [], // laboratuvardaki numuneler
    rehab: [], // rehabilitasyondaki hayvanlar
    disari: { gruplar: [], hayvanlar: [] }, // göçte ya da bölgeden ayrılmış olanlar
  };
}

function bireyOlustur(k, rng, tur, grup, evre, cinsiyet, x, y, anne) {
  const b = {
    id: k.sonrakiId++,
    tur,
    no: 0, // tanımlanınca verilir
    grup: grup.id,
    cinsiyet,
    evre,
    kisilik: sec(rng, Object.keys(KISILIKLER)),
    anne: anne || null,
    x,
    y,
    yon: rng() * Math.PI * 2,
    ofs: { x: 0, y: 0 },
    davranis: 'dinleniyor',
    alt: null, // dönemlik alt davranış (tımar, oyun, emzirme)
    altBitis: 0,
    alisma: 0,
    olu: false,
    olumNedeni: null,
    olumDk: 0,
    dogumDk: null,
    sesSayac: 5 + rng() * 30,
    tehdit: 0,
    yas: E.evreyeGoreYas(tur, evre, rng), // gün
    kondisyon: 0.75,
    hastalik: null, // {id, siddet, gun, tedavi, goruldu}
    teshis: null,
    yetim: false,
  };
  const yay = TURLER[tur].grup[1] > 2 ? 3 + TURLER[tur].grup[1] * 0.7 : 2.5;
  b.ofs = { x: arasi(rng, -yay, yay), y: arasi(rng, -yay, yay) };
  return b;
}

function nufusOlustur(k) {
  const rng = tohumluUretec(4242);
  k.hayvanlar = [];
  k.gruplar = [];
  let gid = 1;
  TUR_SIRASI.forEach((tur) => {
    const t = TURLER[tur];
    const h = t.habitat;
    // İlk sabah zebralar ve filler gölete su içmeye gelir (ilk görev oradadır)
    const susuz = tur === 'zebra' || tur === 'fil' ? 0.8 : rng() * 0.5;
    const g = { id: gid++, tur, x: h.x, y: h.y, plan: null, planBitis: 0, hedef: null, susuzluk: susuz, aclik: rng() * 0.6, alarm: 0, kaynak: null, av: null };
    for (let i = 0; i < 40; i++) {
      const x = h.x + arasi(rng, -h.r * 0.4, h.r * 0.4);
      const y = h.nehirde ? nehirY(h.x) + arasi(rng, -2, 2) : h.y + arasi(rng, -h.r * 0.4, h.r * 0.4);
      if (uygunMu(tur, x, y, h)) {
        g.x = x;
        g.y = y;
        break;
      }
    }
    k.gruplar.push(g);
    const n = t.grup[0] + Math.floor(rng() * (t.grup[1] - t.grup[0] + 1));
    const uyeler = [];
    for (let i = 0; i < n; i++) {
      let evre = 'yetiskin';
      const r = rng();
      if (n >= 4 && i >= 2) evre = r < 0.25 ? 'yavru' : r < 0.45 ? 'genc' : r < 0.9 ? 'yetiskin' : 'yasli';
      if (tur === 'gergedan' && i === 1) evre = 'genc';
      let cinsiyet = rng() < (t.erkekOran ?? 0.5) ? 'erkek' : 'disi';
      if (i === 0 && n > 1) cinsiyet = ['zebra', 'aslan'].includes(tur) ? 'erkek' : 'disi';
      if (i === 1 && n > 2) cinsiyet = 'disi';
      const b = bireyOlustur(k, rng, tur, g, evre, cinsiyet, g.x, g.y);
      if (evre === 'yavru') {
        const anneler = uyeler.filter((u) => u.cinsiyet === 'disi' && u.evre === 'yetiskin');
        if (anneler.length) b.anne = sec(rng, anneler).id;
      }
      b.x = g.x + b.ofs.x;
      b.y = g.y + b.ofs.y;
      uyeler.push(b);
      k.hayvanlar.push(b);
    }
  });
}

// ---------- Dünya ----------
export function dunyaOlustur(k) {
  const rng = tohumluUretec(77); // arazi sabittir: her açılışta aynı
  if (!k.hayvanlar || !k.gruplar) nufusOlustur(k);
  const d = {
    k,
    rng: tohumluUretec((Date.now() & 0xffff) + 13),
    zaman: 0,
    oyuncu: k.oyuncu,
    engeller: [],
    suslar: [],
    olaylar: [],
    hayvanMap: new Map(),
    gozlemId: null,
    gozlem: null,
    rota: null,
    yaklasId: null,
    sesKayit: null,
    sonFoto: -9,
    sonSes: -9,
    sonUyari: -99,
    aracHiz: 0,
    bolge: null,
    sonEvre: gunEvresi(k.dk),
    sonGun: gunNo(k.dk),
  };
  k.hayvanlar.forEach((b) => d.hayvanMap.set(b.id, b));
  const bos = (x, y, r) => {
    if (Math.hypot(x, y) > YARICAP - 4) return false;
    if (Math.hypot(x, y) < ISTASYON.r + 6) return false;
    if (goletCanagi(x, y, r + 3)) return false;
    if (Math.abs(y - nehirY(x)) < NEHIR_YARI + r + 2) return false;
    if (gecitteMi(x) && Math.abs(y - nehirY(x)) < 18) return false;
    for (const e of d.engeller) if (Math.hypot(x - e.x, y - e.y) < e.r + r + 1.5) return false;
    return true;
  };
  const yerlestir = (sayi, uret, tur, r0, r1, ek = {}) => {
    for (let i = 0; i < sayi; i++) {
      for (let deneme = 0; deneme < 25; deneme++) {
        const [x, y] = uret();
        const boy = arasi(rng, 0.8, 1.3);
        const r = arasi(rng, r0, r1) * (tur === 'kaya' ? 1 : boy);
        if (!bos(x, y, r)) continue;
        if (tur === 'agac' && YERLER.some((yy) => Math.hypot(x - yy.x, y - yy.y) < 9)) continue; // varış noktalarında görüşü kapatmasın
        d.engeller.push({ tur, x, y, r, boy, ...ek });
        break;
      }
    }
  };
  const halkada = () => {
    const a = rng() * Math.PI * 2;
    const r = Math.sqrt(rng()) * YARICAP;
    return [Math.sin(a) * r, Math.cos(a) * r];
  };
  // İstasyon binaları (engel)
  d.engeller.push({ tur: 'bina', x: -6, y: 4, r: 2.6, ad: 'Laboratuvar' });
  d.engeller.push({ tur: 'bina', x: 7, y: 2, r: 2.4, ad: 'Garaj' });
  d.engeller.push({ tur: 'bina', x: -2, y: -7, r: 1.8, ad: 'Çadır' });
  // Kayalık: büyük granit kayalar
  yerlestir(42, () => {
    const a = rng() * Math.PI * 2;
    const r = Math.sqrt(rng()) * KAYALIK.r;
    return [KAYALIK.x + Math.sin(a) * r, KAYALIK.y + Math.cos(a) * r];
  }, 'kaya', 1.2, 3.8);
  d.engeller.push({ tur: 'kaya', x: MAGARA.x - 4, y: MAGARA.y + 2, r: 4.2, boy: 1, magara: true });
  d.engeller.push({ tur: 'kaya', x: MAGARA.x + 4, y: MAGARA.y + 2, r: 4.0, boy: 1, magara: true });
  // Akasya ağaçlığı (kuzey) ve dağınık akasyalar
  yerlestir(130, () => [arasi(rng, -45, 150), arasi(rng, 80, 190)], 'agac', 0.5, 0.65, { agacTur: 'akasya' });
  yerlestir(45, halkada, 'agac', 0.5, 0.65, { agacTur: 'akasya' });
  // Gölet ve nehir kıyısında yüksek ağaçlar
  yerlestir(10, () => [GOLET.x + arasi(rng, -22, 22), GOLET.y + arasi(rng, -22, 22)], 'agac', 0.45, 0.55, { agacTur: 'kiyi' });
  yerlestir(26, () => {
    const x = arasi(rng, -180, 180);
    return [x, nehirY(x) + (rng() < 0.5 ? 1 : -1) * arasi(rng, 8, 16)];
  }, 'agac', 0.45, 0.55, { agacTur: 'kiyi' });
  // Dağınık kayalar
  yerlestir(18, halkada, 'kaya', 0.6, 1.4);
  // Geçilebilir süs bitkileri: sazlık, çalı (engel değil)
  for (let i = 0; i < 140; i++) {
    const x = arasi(rng, -190, 190);
    const y = arasi(rng, -195, nehirY(x) - 6);
    if (Math.hypot(x, y) < YARICAP - 4) d.suslar.push({ tur: 'saz', x, y, boy: arasi(rng, 0.7, 1.3) });
  }
  for (let i = 0; i < 40; i++) {
    const a = rng() * Math.PI * 2;
    const r = GOLET.r + arasi(rng, 0.5, 3);
    d.suslar.push({ tur: 'saz', x: GOLET.x + Math.sin(a) * r, y: GOLET.y + Math.cos(a) * r, boy: arasi(rng, 0.7, 1.2) });
  }
  for (let i = 0; i < 110; i++) {
    const [x, y] = halkada();
    if (!guneydeMi(x, y) && Math.hypot(x, y) > ISTASYON.r + 4) d.suslar.push({ tur: 'cali', x, y, boy: arasi(rng, 0.6, 1.3) });
  }
  // Sulak alanda küçük çamur gölcükleri (süs)
  for (let i = 0; i < 12; i++) {
    const x = arasi(rng, -150, 150);
    const y = arasi(rng, nehirY(x) - 70, nehirY(x) - 15);
    if (Math.hypot(x, y) < YARICAP - 10) d.suslar.push({ tur: 'camur', x, y, boy: arasi(rng, 2, 5) });
  }
  // Ekosistem (Aşama 5): otlak kapasitesi arazi sabit olduğu için her açılışta yeniden hesaplanır
  d.kap = E.kapasiteHesapla(bolgeBul, d.engeller.filter((e) => e.tur === 'agac'));
  if (!k.eko || !Array.isArray(k.eko.ot) || k.eko.ot.length !== d.kap.ot.length) k.eko = E.ekoOlustur(d.kap);
  const bugun = gunNo(k.dk);
  if (!k.eko.hava || k.eko.hava.gun !== bugun) E.havaUret(k.eko, bugun, d.rng);
  if (!k.eko.mevsim) k.eko.mevsim = E.takvim(bugun).mevsim;
  E.goletAyarla(k.eko);
  k.eko.yagmurVar = E.yagisSiddeti(k.eko, gunDakikasi(k.dk)) > 0;
  k.hayvanlar.forEach((b) => {
    if (typeof b.yas !== 'number') b.yas = E.evreyeGoreYas(b.tur, b.evre, d.rng);
    if (typeof b.kondisyon !== 'number') b.kondisyon = 0.75;
    if (b.hastalik === undefined) b.hastalik = null;
  });
  // Kayıtlı konum bozuksa istasyona koy
  if (!(Math.hypot(d.oyuncu.x, d.oyuncu.y) < YARICAP)) Object.assign(d.oyuncu, { x: 0, y: -2, yon: 0 });
  d.bolge = bolgeBul(d.oyuncu.x, d.oyuncu.y);
  if (k.aracta) Object.assign(d.oyuncu, { x: k.arac.x, y: k.arac.y, yon: k.arac.yon });
  return d;
}

export function olay(d, tur, metin, oncelik = 1, ek = {}) {
  d.olaylar.push({ tur, metin, oncelik, zaman: d.zaman, ...ek });
}
export function olaylariAl(d) {
  const l = d.olaylar;
  d.olaylar = [];
  return l;
}

// ---------- Bireyler: ad ve tarif ----------
export const birey = (d, id) => (id ? d.hayvanMap.get(id) || null : null);
export const taninmisMi = (b) => b && b.no > 0;
export const kod = (b) => `${TURLER[b.tur].kisa}-${String(b.no).padStart(2, '0')}`;
export function bireyAdi(b) {
  if (taninmisMi(b)) return `${SOZ[b.tur]} ${b.no}`;
  return `tanımlanmamış ${kucuk(SOZ[b.tur])}${b.evre === 'yavru' ? ' yavrusu' : ''}`;
}
export const BuyukHarf = (s) => s.charAt(0).toLocaleUpperCase('tr-TR') + s.slice(1);
export function bireyKunye(d, b) {
  const t = TURLER[b.tur];
  const grup = d.k.gruplar.find((g) => g.id === b.grup);
  const uye = d.k.hayvanlar.filter((x) => x.grup === b.grup && !x.olu).length;
  let m = `${t.ad}, kimlik ${kod(b)}. ${b.cinsiyet === 'erkek' ? 'Erkek' : 'Dişi'}, ${EVRELER[b.evre]}, ${E.yasSozu(b.yas || 0)}, kişiliği ${KISILIKLER[b.kisilik].ad}.`;
  if (!b.olu) {
    m += ` Kondisyonu ${E.kondisyonSozu(b.kondisyon ?? 0.7)}.`;
    if (b.hastalik && b.teshis === b.hastalik.id) m += ` Teşhis: ${E.HASTALIKLAR[b.hastalik.id].ad}${b.hastalik.tedavi ? ', tedavi edildi' : ''}.`;
    else if (b.hastalik && b.hastalik.goruldu) m += ` Sağlık sorunu var: ${E.HASTALIKLAR[b.hastalik.id].belirti}.`;
    if (b.yetim) m += ' Yetim.';
    if (b.disari === 'goc') m += ' Şu an sürüsüyle göçte.';
    if (b.disari === 'ayrildi') m += ' Bölgeden ayrıldı.';
  }
  if (uye > 1 && grup) m += ` Grubunda ${uye} birey var.`;
  const anne = birey(d, b.anne);
  if (anne) m += taninmisMi(anne) ? ` Annesi ${bireyAdi(anne)}.` : ' Annesi henüz tanımlanmadı.';
  const yavrular = d.k.hayvanlar.filter((x) => x.anne === b.id && !x.olu);
  if (yavrular.length) m += ` ${yavrular.length} yavrusu var.`;
  return m;
}
const gozlenebilirMi = (b) => !b.olu;

// ---------- Gruplar: plan seçimi ----------
function aktifMi(t, dk) {
  const e = gunEvresi(dk);
  if (t.aktif === 'gece') return e !== 'gunduz' || gunDakikasi(dk) / 60 > 16.5;
  if (t.aktif === 'gunduz') return e !== 'gece';
  return true;
}
function uyeler(d, g) {
  return d.k.hayvanlar.filter((b) => b.grup === g.id && !b.olu);
}
function habitattaNokta(d, g, yaricapCarpani = 1) {
  const t = TURLER[g.tur];
  const h = t.habitat;
  for (let i = 0; i < 25; i++) {
    const a = d.rng() * Math.PI * 2;
    const r = Math.sqrt(d.rng()) * h.r * yaricapCarpani;
    let x = h.x + Math.sin(a) * r;
    let y = h.nehirde ? nehirY(x) + NEHIR_YARI + 4 + Math.abs(Math.cos(a)) * 22 : h.y + Math.cos(a) * r;
    if (uygunMu(g.tur, x, y, h)) return { x, y };
  }
  return { x: g.x, y: g.y };
}
function yakinNokta(d, g, r) {
  const t = TURLER[g.tur];
  for (let i = 0; i < 12; i++) {
    const x = g.x + arasi(d.rng, -r, r);
    const y = g.y + arasi(d.rng, -r, r);
    if (uygunMu(g.tur, x, y, t.habitat) && Math.hypot(x - t.habitat.x, y - t.habitat.y) < t.habitat.r * 1.4) return { x, y };
  }
  return { x: g.x, y: g.y };
}
function nehirNoktasi(x, guney, uzak = 2) {
  return { x, y: nehirY(x) + (guney ? -1 : 1) * (NEHIR_YARI + uzak) };
}
function suNoktasi(g) {
  const t = TURLER[g.tur];
  const guney = !!t.habitat.guneyde;
  const nehir = nehirNoktasi(sinirla(g.x, -170, 170), guney, 1.8);
  if (guney) return nehir;
  const dx = g.x - GOLET.x;
  const dy = g.y - GOLET.y;
  const m = Math.hypot(dx, dy) || 1;
  if (!GOLET.su) return nehir; // gölet kurudu: su nehirde
  const golet = { x: GOLET.x + (dx / m) * (GOLET.su + 2.2), y: GOLET.y + (dy / m) * (GOLET.su + 2.2) };
  return mesafe(g, golet) < mesafe(g, nehir) ? golet : nehir;
}
function planSec(d, g) {
  const k = d.k;
  const t = TURLER[g.tur];
  const dk = k.dk;
  const aktif = aktifMi(t, dk);
  const r = d.rng();
  g.hedef = null;
  g.av = null;
  const sure = (a, b) => dk + arasi(d.rng, a, b);
  // Su canlıları: gündüz suda, gece kıyıda (su aygırı) ya da pusuda (timsah)
  if (g.tur === 'suAygiri') {
    if (aktif) {
      g.plan = 'otla';
      g.hedef = habitattaNokta(d, g, 0.8);
    } else {
      g.plan = 'suda';
      g.hedef = { x: sinirla(g.x, t.habitat.x - 25, t.habitat.x + 25), y: 0 };
      g.hedef.y = nehirY(g.hedef.x);
    }
    g.planBitis = sure(60, 120);
    return;
  }
  if (g.tur === 'timsah') {
    const saat = gunDakikasi(dk) / 60;
    const pusuX = k.eko && k.eko.gecitPusu;
    if (pusuX != null) {
      // Göç eden sürü nehre yaklaşıyor: timsahlar geçidin kıyısında bekler (karar 111)
      const x = pusuX + arasi(d.rng, -5, 5);
      g.plan = 'pusu';
      g.hedef = { x, y: nehirY(x) + NEHIR_YARI - 0.8 };
      g.planBitis = sure(40, 70);
      return;
    }
    const kiyiX = sinirla(g.x + arasi(d.rng, -15, 15), t.habitat.x - 25, t.habitat.x + 25);
    if (saat >= 7 && saat < 11 && r < 0.8) {
      g.plan = 'gunes';
      g.hedef = nehirNoktasi(kiyiX, false, 1.2);
    } else if (g.aclik > 0.45 && r < 0.7) {
      g.plan = 'pusu';
      g.hedef = { x: kiyiX, y: nehirY(kiyiX) + NEHIR_YARI - 0.8 };
    } else {
      g.plan = 'suda';
      g.hedef = { x: kiyiX, y: nehirY(kiyiX) };
    }
    g.planBitis = sure(50, 110);
    return;
  }
  if (g.tur === 'kartal') {
    if (!aktif) g.plan = 'tunemis';
    else g.plan = r < 0.5 ? 'tunemis' : r < 0.85 ? 'suzuluyor' : 'balikAvi';
    g.hedef = habitattaNokta(d, g, 0.9);
    g.planBitis = sure(30, 80);
    return;
  }
  if (g.tur === 'piton') {
    g.plan = aktif && r < 0.4 ? 'gez' : 'bekle';
    g.hedef = g.plan === 'gez' ? yakinNokta(d, g, 10) : null;
    g.planBitis = sure(90, 200);
    return;
  }
  if (!aktif) {
    g.plan = t.aktif === 'gunduz' ? 'uyu' : 'dinlen';
    g.planBitis = sure(60, 120);
    return;
  }
  // Sağanakta otçulların çoğu ağaç altında bekler
  if (k.eko && k.eko.yagmurVar && k.eko.siddet > 0.8 && !t.yirtici && r < 0.6) {
    g.plan = 'dinlen';
    const agac = d.engeller.filter((e) => e.tur === 'agac' && mesafe(e, g) < 35).sort((a, b) => mesafe(a, g) - mesafe(b, g))[0];
    if (agac && uygunMu(g.tur, agac.x + 2.5, agac.y + 2.5, t.habitat)) g.hedef = { x: agac.x + 2.5, y: agac.y + 2.5 };
    g.planBitis = sure(20, 40);
    return;
  }
  // Leşçi: yakında leş varsa oraya
  if (t.lesci && g.aclik > 0.3) {
    const les = k.lesler.filter((l) => l.kalan > 0.1).sort((a, b) => mesafe(a, g) - mesafe(b, g))[0];
    if (les && mesafe(les, g) < 220) {
      g.plan = 'les';
      g.hedef = { x: les.x, y: les.y };
      g.lesId = les.id;
      g.planBitis = sure(80, 120);
      return;
    }
  }
  if (!t.suYok && !['leopar', 'piton', 'kartal'].includes(g.tur) && g.susuzluk > 0.62) {
    g.plan = 'su';
    g.hedef = suNoktasi(g);
    g.planBitis = sure(70, 110);
    g.icti = false;
    return;
  }
  if (t.yirtici && g.aclik > 0.55 && (gunEvresi(dk) !== 'gunduz' || g.tur === 'leopar' || g.aclik > 0.9)) {
    g.plan = 'av';
    g.av = null;
    g.planBitis = sure(120, 200);
    return;
  }
  if (t.camur && r < 0.1) {
    g.plan = 'camur';
    g.hedef = suNoktasi(g);
    g.planBitis = sure(30, 60);
    return;
  }
  const r2 = d.rng();
  const besinDegeri = (p) => (!k.eko ? 1 : t.yeme === 'yapraklaBesleniyor' ? E.yaprakDegeri(k.eko, p.x, p.y) : E.otDegeri(k.eko, p.x, p.y));
  const enGur = (uret, n) => {
    let en = null;
    for (let i = 0; i < n; i++) {
      const p = uret();
      if (!en || besinDegeri(p) > besinDegeri(en)) en = p;
    }
    return en;
  };
  const otcul = !t.yirtici && !t.kus && t.sinif === 'Memeli';
  if (r2 < 0.55) {
    g.plan = 'otla';
    g.hedef = otcul ? enGur(() => yakinNokta(d, g, 14), 4) : yakinNokta(d, g, 12);
    g.planBitis = sure(40, 90);
  } else if (r2 < 0.82) {
    g.plan = 'gez';
    g.hedef = otcul ? enGur(() => habitattaNokta(d, g), 3) : habitattaNokta(d, g);
    g.planBitis = sure(40, 80);
  } else {
    g.plan = 'dinlen';
    // Gölgede dinlen: en yakın ağaç
    const agac = d.engeller.filter((e) => e.tur === 'agac' && mesafe(e, g) < 40).sort((a, b) => mesafe(a, g) - mesafe(b, g))[0];
    if (agac && uygunMu(g.tur, agac.x + 2.5, agac.y + 2.5, t.habitat)) g.hedef = { x: agac.x + 2.5, y: agac.y + 2.5 };
    g.planBitis = sure(30, 80);
  }
}

// ---------- Hareket yardımcıları ----------
function engelleItele(d, o, pay, nehirSerbest, goletSerbest) {
  for (const e of d.engeller) {
    const ex = o.x - e.x;
    const ey = o.y - e.y;
    const min = e.r + pay;
    if (Math.abs(ex) > min || Math.abs(ey) > min) continue;
    const m = Math.hypot(ex, ey);
    if (m < min && m > 0.0001) {
      o.x = e.x + (ex / m) * min;
      o.y = e.y + (ey / m) * min;
    }
  }
  if (!goletSerbest && GOLET.su > 0) {
    const gx = o.x - GOLET.x;
    const gy = o.y - GOLET.y;
    const gm = Math.hypot(gx, gy);
    const gmin = GOLET.su + pay;
    if (gm < gmin && gm > 0.0001) {
      o.x = GOLET.x + (gx / gm) * gmin;
      o.y = GOLET.y + (gy / gm) * gmin;
    }
  }
  const r = Math.hypot(o.x, o.y);
  if (r > YARICAP - 1) {
    o.x = (o.x / r) * (YARICAP - 1);
    o.y = (o.y / r) * (YARICAP - 1);
  }
}
// Bireyi hedefe doğru yürütür; nehir ve gölet sınırlarına uyar. Döndürür: kalan mesafe
function bireyYuru(d, b, hx, hy, hiz, dt) {
  const t = TURLER[b.tur];
  const dx = hx - b.x;
  const dy = hy - b.y;
  const m = Math.hypot(dx, dy);
  if (m < 0.3) return m;
  const adim = Math.min(m, hiz * dt);
  const nx = b.x + (dx / m) * adim;
  const ny = b.y + (dy / m) * adim;
  b.yon = Math.atan2(dx, dy);
  if (!t.kus && !t.suCanlisi && nehirdeMi(nx, ny) && !(b.gecis && gecitteMi(nx))) {
    // Nehre giremez: kıyı boyunca kay
    if (!nehirdeMi(nx, b.y)) b.x = nx;
    return m;
  }
  b.x = nx;
  b.y = ny;
  if (!t.kus) {
    engelleItele(d, b, 0.4, t.suCanlisi, false);
    const ir = Math.hypot(b.x - ISTASYON.x, b.y - ISTASYON.y);
    if (ir < ISTASYON.r + 4) {
      b.x = ISTASYON.x + ((b.x - ISTASYON.x) / (ir || 1)) * (ISTASYON.r + 4);
      b.y = ISTASYON.y + ((b.y - ISTASYON.y) / (ir || 1)) * (ISTASYON.r + 4);
    }
  }
  return m - adim;
}

// ---------- Kaçış ve tepki mesafesi (karar 19, 47, 70) ----------
export function kacisMesafesi(d, b) {
  const t = TURLER[b.tur];
  let m = t.kacis * KISILIKLER[b.kisilik].kacis * (1 - 0.6 * b.alisma);
  if (d.k.aracta) m *= d.aracHiz > 4 ? 0.85 : 0.45; // araç içindeki insanı daha az tehdit sayarlar
  if (geceMi(d.k.dk)) m *= 0.8;
  if (b.evre === 'yavru') m *= 1.2;
  return Math.max(4, m);
}
function grupAlarm(d, g, kaynak, sure = 6, gecikme = 0) {
  if (g.alarm > 0.5 && g.kaynak && mesafe(g.kaynak, kaynak) < 3) return;
  g.alarm = sure;
  g.alarmGecikme = gecikme;
  g.kaynak = { x: kaynak.x, y: kaynak.y };
  if (g.plan === 'av') {
    g.av = null;
    g.plan = 'dinlen';
    g.planBitis = d.k.dk + 30;
  }
}

// ---------- Av ve ölüm (karar 40, 46, 102) ----------
function hayvanOldu(d, b, neden, avci) {
  b.olu = true;
  b.olumNedeni = neden;
  b.olumDk = d.k.dk;
  const les = { id: d.k.sonrakiId++, x: b.x, y: b.y, tur: b.tur, bireyId: b.id, dk: d.k.dk, kalan: 1, neden, hastalik: b.hastalik ? b.hastalik.id : null };
  d.k.lesler.push(les);
  gecmisEkle(d.k, b, `Öldü: ${neden}`);
  // Annesini kaybeden küçük yavrular yetim kalır (karar 106)
  d.k.hayvanlar.forEach((y) => {
    if (y.anne === b.id && !y.olu && y.evre === 'yavru') {
      y.yetim = true;
      gecmisEkle(d.k, y, 'Annesi öldü, yetim kaldı');
    }
  });
  // Tanık olduysan ya da hayvan tasmalıysa arşive
  const kayitli = d.k.arsiv.bireyler[b.id];
  if (kayitli && (d.k.gpsli || []).includes(b.id)) kayitli.olum = `${neden}, ${zamanSozu(d.k.dk)} (GPS tasması hareketsiz kaldı)`;
  if (mesafe(d.oyuncu, b) <= durbunMenzili(d.k.dk, d.k)) {
    const metin = avciMetni(b, avci);
    arsivOlay(d, metin);
    olay(d, 'tanik', `${metin} ${BuyukHarf(yerTarifi(d.oyuncu, b))}.`, 4, { id: b.id });
    itibarEkle(d, 4);
    if (kayitli) kayitli.olum = `${neden}, ${zamanSozu(d.k.dk)}`;
  }
  return les;
}
function avciMetni(av, avci) {
  const avAdi = taninmisMi(av) ? bireyAdi(av) : `bir ${kucuk(SOZ[av.tur])}${av.evre === 'yavru' ? ' yavrusu' : ''}`;
  if (!avci) return `${BuyukHarf(avAdi)} öldü.`;
  const avciAdi = taninmisMi(avci) ? bireyAdi(avci) : `bir ${kucuk(SOZ[avci.tur])}`;
  return `Avlanma gözlendi. Avcı: ${avciAdi}. Av: ${avAdi}.`;
}

function avGuncelle(d, g, uyelerListe, dt) {
  const k = d.k;
  const t = TURLER[g.tur];
  if (!g.av) {
    // Av seç: zayıf olanları (yavru, yaşlı) yeğler
    let en = null;
    let enPuan = Infinity;
    for (const b of k.hayvanlar) {
      if (b.olu || !t.avlar.includes(b.tur)) continue;
      const m = mesafe(g, b);
      if (m > 170) continue;
      if (Math.hypot(b.x, b.y) < ISTASYON.r + 8) continue;
      const puan = m * (b.evre === 'yavru' || b.evre === 'yasli' ? 0.6 : 1) * (b.tur === 'manda' ? 2.2 : 1) * (b.hastalik || b.kondisyon < 0.35 ? 0.55 : 1);
      if (puan < enPuan) {
        enPuan = puan;
        en = b;
      }
    }
    if (!en) {
      g.plan = 'gez';
      g.hedef = habitattaNokta(d, g);
      return;
    }
    g.av = { id: en.id, evre: 'yaklas', t: 0, avciId: null };
  }
  const av = birey(d, g.av.id);
  if (!av || av.olu) {
    g.av = null;
    return;
  }
  if (g.av.evre === 'yaklas') {
    // Sinsice yaklaş (grubun merkezi ava doğru yavaşça kayar)
    const m = mesafe(g, av);
    const adim = Math.min(m, 1.5 * dt);
    const a = yonAcisi(g, av);
    const nx = g.x + Math.sin(a) * adim;
    const ny = g.y + Math.cos(a) * adim;
    if (!nehirdeMi(nx, ny) && !golettemi(nx, ny, 1)) {
      g.x = nx;
      g.y = ny;
    } else {
      g.av = null;
      g.plan = 'dinlen';
      g.planBitis = k.dk + 40;
      return;
    }
    if (m < 24) {
      const yetiskin = uyelerListe.filter((b) => b.evre === 'yetiskin' || b.evre === 'genc');
      const avci = (yetiskin.length ? yetiskin : uyelerListe).slice().sort((a2, b2) => mesafe(a2, av) - mesafe(b2, av))[0];
      if (!avci) return;
      g.av.evre = 'kovala';
      g.av.t = 0;
      g.av.avciId = avci.id;
      const avGrup = k.gruplar.find((x) => x.id === av.grup);
      if (avGrup) grupAlarm(d, avGrup, avci, 9, 1.1);
      if (mesafe(d.oyuncu, avci) <= durbunMenzili(k.dk, k)) {
        olay(d, 'avBasladi', `Dikkat! ${taninmisMi(avci) ? bireyAdi(avci) : 'Bir ' + kucuk(SOZ[avci.tur])} avını kovalamaya başladı, ${yerTarifi(d.oyuncu, avci)}.`, 3, { id: avci.id });
      }
    }
    return;
  }
  // Kovalama
  const avci = birey(d, g.av.avciId);
  if (!avci || avci.olu) {
    g.av = null;
    return;
  }
  g.av.t += dt;
  bireyYuru(d, avci, av.x, av.y, t.hiz, dt);
  avci.davranis = 'kovaliyor';
  const m = mesafe(avci, av);
  if (m < 1.6) {
    const les = hayvanOldu(d, av, `avlandı (${kucuk(SOZ[g.tur])})`, avci);
    g.aclik = 0;
    g.plan = 'beslen';
    g.hedef = { x: av.x, y: av.y };
    g.lesId = les.id;
    g.planBitis = k.dk + 90;
    g.av = null;
    return;
  }
  if (g.av.t > 13 || m > 55) {
    // Kaçan av ya da (manda gibi güçlü avlarda) avcı yaralanabilir (karar 28)
    if (!av.hastalik && d.rng() < 0.12) yaraVer(d, av, 'avcıdan kaçarken yaralandı');
    if (!avci.hastalik && d.rng() < (av.tur === 'manda' ? 0.25 : 0.05)) yaraVer(d, avci, `av sırasında ${kucuk(SOZ[av.tur])} tarafından yaralandı`);
    g.av = null;
    g.aclik = Math.max(0.55, g.aclik - 0.05);
    g.plan = 'dinlen';
    g.planBitis = k.dk + arasi(d.rng, 30, 60);
    g.x = avci.x;
    g.y = avci.y;
    if (mesafe(d.oyuncu, avci) <= durbunMenzili(k.dk, k)) olay(d, 'avBitti', `${taninmisMi(avci) ? bireyAdi(avci) : BuyukHarf(kucuk(SOZ[avci.tur]))} avını kaçırdı.`, 2, { id: avci.id });
  }
}

// ---------- Doğum (karar 20) ----------
function gunlukDogumlar(d) {
  const k = d.k;
  gunlukEkosistem(d);
  for (const g of k.gruplar) {
    const t = TURLER[g.tur];
    const u = uyeler(d, g);
    if (g.goc) continue;
    // Araştırma alanı açık bir sistemdir: azalan ya da tükenen gruplara çevreden yeni bireyler gelir (karar 53)
    if (u.length < t.grup[0] && d.rng() < (u.length ? 0.6 : 0.35)) {
      const n = u.length ? 1 + (d.rng() < 0.4 ? 1 : 0) : t.grup[0];
      const p = habitattaNokta(d, g, 0.6);
      if (!u.length) Object.assign(g, { x: p.x, y: p.y, plan: null, planBitis: 0, av: null, alarm: 0 });
      for (let i = 0; i < n; i++) {
        const evre = !u.length && i >= 2 && d.rng() < 0.4 ? (d.rng() < 0.5 ? 'yavru' : 'genc') : 'yetiskin';
        const yeni = bireyOlustur(k, d.rng, g.tur, g, evre, i === 1 || d.rng() < 0.6 ? 'disi' : 'erkek', g.x, g.y);
        yeni.x = p.x + yeni.ofs.x;
        yeni.y = p.y + yeni.ofs.y;
        k.hayvanlar.push(yeni);
        d.hayvanMap.set(yeni.id, yeni);
      }
      if (!u.length && Object.keys(k.arsiv.turler).includes(g.tur)) {
        mesajEkle(k, `Saha raporu: bölgeye çevreden yeni bir ${kucuk(SOZ[g.tur])} grubu geldi, ${n} birey. Son görüldükleri yer ${bolgeAdi(p.x, p.y)}.`, 'ekosistem');
      }
      continue;
    }
    if (!u.length) continue;
    const anneler = u.filter((b) => b.cinsiyet === 'disi' && b.evre === 'yetiskin' && b.kondisyon > 0.35 && !b.hastalik && !u.some((y) => y.anne === b.id && y.evre === 'yavru'));
    if (!anneler.length || u.length >= t.grup[1] + 3) continue;
    const kucukGrup = u.length < t.grup[1];
    // Otçullar çoğunlukla yağışlı mevsimde, otlar gürken doğurur (karar 43)
    const yagisli = E.takvim(gunNo(k.dk)).mevsim === 'yagisli';
    let sans = t.yirtici ? 0.1 : ['fil', 'gergedan', 'zurafa'].includes(g.tur) ? 0.06 : ['piton', 'timsah', 'kartal'].includes(g.tur) ? 0 : kucukGrup ? 0.5 : 0.3;
    if (!t.yirtici && !yagisli) sans *= 0.15;
    if (d.rng() >= sans) continue;
    const anne = sec(d.rng, anneler);
    const y = bireyOlustur(k, d.rng, g.tur, g, 'yavru', d.rng() < 0.5 ? 'erkek' : 'disi', anne.x + 0.8, anne.y + 0.8, anne.id);
    y.dogumDk = k.dk;
    y.yas = 0;
    y.kondisyon = 0.7;
    y.ofs = { x: anne.ofs.x + 0.8, y: anne.ofs.y + 0.6 };
    gecmisEkle(k, anne, 'Yavruladı');
    k.hayvanlar.push(y);
    d.hayvanMap.set(y.id, y);
    anne.alt = 'dogum';
    anne.altBitis = k.dk + 240;
    if (mesafe(d.oyuncu, anne) <= durbunMenzili(k.dk, k)) {
      olay(d, 'tanik', `Bir doğuma tanık oldun! ${taninmisMi(anne) ? bireyAdi(anne) : 'Bir ' + kucuk(SOZ[g.tur])} yavruladı, ${yerTarifi(d.oyuncu, anne)}.`, 4, { id: anne.id });
      arsivOlay(d, `${taninmisMi(anne) ? bireyAdi(anne) : 'Bir ' + kucuk(SOZ[g.tur])} yavruladı.`);
      itibarEkle(d, 6);
    }
  }
  // Eski leşler kaybolur
  k.lesler = k.lesler.filter((l) => k.dk - l.dk < 2 * 1440 && l.kalan > 0.05);
  // Ölü bireyler arşivde kalır; nüfus listesinden 5 gün sonra çıkar (tanınmışlar hep kalır)
  k.hayvanlar = k.hayvanlar.filter((b) => !b.olu || b.no > 0 || k.dk - b.olumDk < 5 * 1440);
  d.hayvanMap = new Map(k.hayvanlar.map((b) => [b.id, b]));
}

// ---------- Ekosistem: sağlık, yaşam döngüsü, göç (Aşama 5) ----------
// Yırtıcıların acıkma süresi (oyun dakikası): büyük av birkaç gün doyurur, timsah haftalarca aç kalabilir
const ACLIK_SURESI = { aslan: 4300, leopar: 5200, sirtlan: 3600, timsah: 12000 };
// Otlayan bir bireyin saatlik tüketimi (zebra = 1)
const TUKETIM = { fil: 3, manda: 1.5, zebra: 1, ceylan: 0.4, domuz: 0.5, gergedan: 2, suAygiri: 2, zurafa: 1.5 };

export function gecmisEkle(k, b, metin) {
  if (!b) return;
  if (!Array.isArray(b.gecmis)) b.gecmis = [];
  b.gecmis.unshift({ dk: k.dk, metin });
  if (b.gecmis.length > 12) b.gecmis.length = 12;
}
function hastalikVer(d, b, id, siddet, neden) {
  if (b.olu || b.hastalik) return false;
  if (Array.isArray(b.bagisik) && b.bagisik.includes(id)) return false;
  const h = E.HASTALIKLAR[id];
  if (h.turler && !h.turler.includes(b.tur)) return false;
  b.hastalik = { id, siddet, gun: gunNo(d.k.dk), tedavi: false, goruldu: false };
  gecmisEkle(d.k, b, neden || BuyukHarf(h.ad));
  return true;
}
function yaraVer(d, b, neden) {
  return hastalikVer(d, b, 'yara', 0.3 + d.rng() * 0.3, BuyukHarf(neden));
}
const AYRILAN_ERKEK = { aslan: true, zebra: true, fil: true, zurafa: true, manda: true };

function ekoDuyurusu(d, e) {
  const k = d.k;
  const m = {
    yagmurBasladi: 'Yağmur başladı. Dürbünle görüş biraz kısaldı.',
    saganakBasladi: 'Sağanak başladı, gök gürlüyor. Görüş çok azaldı; otçulların çoğu ağaç altına sığınıyor.',
    yagmurDindi: 'Yağmur dindi.',
    goletCekildi: 'Gölet yarısından fazla çekildi. Kıyıda çamurlu bir şerit kaldı.',
    goletKurudu: 'Gölet kurudu, yalnızca çatlak bir çamur kaldı. Hayvanlar suyu artık nehirde arayacak; nehir kıyısında timsahlar daha tehlikeli olacak.',
    goletDoldu: 'Yağmurlarla gölet yeniden doldu.',
    algCogaldi: 'Gölette alg çoğaldı, su yeşile döndü. Kirli su hayvanlarda parazit riskini artırır. Bir su numunesi alıp laboratuvarda inceletebilirsin.',
  }[e];
  if (!m) return;
  const yagmurlu = e.startsWith('yagmur') || e === 'saganakBasladi';
  olay(d, 'hava', m, yagmurlu ? 2 : 3, { hava: e });
  if (!yagmurlu) {
    mesajEkle(k, `Ekosistem: ${m}`, 'ekosistem');
    arsivOlay(d, m);
  }
}

// Göçteki ve bölgeden ayrılmış hayvanlar da arşivde aranabilir
export function kayitliBirey(d, id) {
  const k = d.k;
  return birey(d, id) || k.disari.hayvanlar.find((b) => b.id === id) || (k.rehab.find((r) => r.b.id === id) || {}).b || null;
}
export const disaridaMi = (k, b) => k.disari.hayvanlar.includes(b);
export const rehabdaMi = (k, b) => k.rehab.some((r) => r.b === b);

export function haritadanCikar(d, liste) {
  const k = d.k;
  const set = new Set(liste);
  k.hayvanlar = k.hayvanlar.filter((b) => !set.has(b));
  d.hayvanMap = new Map(k.hayvanlar.map((b) => [b.id, b]));
  if (d.gozlemId && !d.hayvanMap.has(d.gozlemId)) {
    d.gozlemId = null;
    d.gozlem = null;
    d.yaklasId = null;
  }
}
function disariEkle(k, b, neden) {
  b.disari = neden;
  b.disariDk = k.dk;
  k.disari.hayvanlar.push(b);
  // Tanınmamış ayrılanlar çok birikmesin
  const ayrilan = k.disari.hayvanlar.filter((x) => x.disari === 'ayrildi' && !x.no);
  if (ayrilan.length > 30) k.disari.hayvanlar = k.disari.hayvanlar.filter((x) => x !== ayrilan[0]);
}
const gocAdi = (g) => `${SOZ[g.tur].toLocaleLowerCase('tr-TR')} sürüsü`;

// Göç: sürü geçide, nehrin karşı yakasına ve haritanın dışına yürür; dönüşte tersini (karar 43, 111)
function gocBaslat(d, g, u) {
  const k = d.k;
  const gc = E.GOCMENLER[g.tur];
  const x = gc.gecit;
  g.goc = { durum: 'gidiyor', yol: [{ x, y: nehirY(x) + 12 }, { x, y: nehirY(x) - 12 }, { ...gc.cikis }], i: 0, basDk: k.dk, sayi: u.length };
  g.plan = 'goc';
  g.av = null;
  k.eko.gocler.unshift({ gun: gunNo(k.dk), tur: g.tur, olay: 'cikis', sayi: u.length });
  if (k.eko.gocler.length > 20) k.eko.gocler.length = 20;
  const gecit = GECITLER.find((x2) => x2.x === x);
  const m = `${BuyukHarf(gocAdi(g))}, ${u.length} birey, otlar azaldığı için ${gc.yon} yönüne göçe başladı. Nehri ${gecit ? gecit.ad.toLocaleLowerCase('tr-TR') + 'nden' : 'geçitten'} geçecekler.`;
  mesajEkle(k, `Saha raporu: ${m}`, 'ekosistem');
  arsivOlay(d, m);
  olay(d, 'goc', m, 3, { tur: g.tur });
}
function gocGuncelle(d, g, u, dt) {
  const k = d.k;
  const w = g.goc.yol[g.goc.i];
  const m = mesafe(g, w);
  const hiz = 1.7;
  if (m > 1.5) {
    const adim = Math.min(m, hiz * dt);
    const a = yonAcisi(g, w);
    g.x += Math.sin(a) * adim;
    g.y += Math.cos(a) * adim;
  } else {
    // Bir sonraki noktaya geçmeden önce geride kalanları bekle
    const geride = u.filter((b) => mesafe(b, g) > 9).length;
    if (geride > u.length * 0.25 && (g.goc.bekle = (g.goc.bekle || 0) + dt) < 25) return;
    g.goc.bekle = 0;
    g.goc.i += 1;
    if (g.goc.i >= g.goc.yol.length) {
      if (g.goc.durum === 'gidiyor') gocCikis(d, g, u);
      else {
        g.goc = null;
        g.plan = null;
        g.planBitis = 0;
      }
      return;
    }
  }
  // Timsahlar geçidin başında bekler
  const yaklasan = k.gruplar.find((x) => x.goc && x.goc.i <= 1);
  k.eko.gecitPusu = yaklasan ? E.GOCMENLER[yaklasan.tur].gecit : null;
}
function gocCikis(d, g, u) {
  const k = d.k;
  u.forEach((b) => disariEkle(k, b, 'goc'));
  haritadanCikar(d, u);
  k.gruplar = k.gruplar.filter((x) => x !== g);
  g.goc.durum = 'disarida';
  g.goc.cikisDk = k.dk;
  k.disari.gruplar.push(g);
  if (!k.gruplar.some((x) => x.goc)) k.eko.gecitPusu = null;
  mesajEkle(k, `Saha raporu: ${gocAdi(g)} araştırma alanından çıktı. Yağmurlarla dönmeleri bekleniyor.`, 'ekosistem');
}
function gocDonus(d, g) {
  const k = d.k;
  const gc = E.GOCMENLER[g.tur];
  const uyeler2 = k.disari.hayvanlar.filter((b) => b.grup === g.id && b.disari === 'goc');
  let kayip = 0;
  let yeni = 0;
  const donenler = [];
  uyeler2.forEach((b) => {
    const risk = (b.evre === 'yavru' ? 0.18 : b.evre === 'yasli' ? 0.15 : 0.06) + (b.hastalik ? 0.2 : 0);
    k.disari.hayvanlar = k.disari.hayvanlar.filter((x) => x !== b);
    if (d.rng() < risk) {
      kayip++;
      b.olu = true;
      b.olumNedeni = 'göç sırasında öldü';
      b.olumDk = k.dk;
      const ab = k.arsiv.bireyler[b.id];
      if (ab) ab.olum = `göçten dönmedi, ${zamanSozu(k.dk)}`;
      b.disari = null;
      if (b.no) donenler.push(b); // tanınmışlar ölü olarak kayıtta kalır
      return;
    }
    b.disari = null;
    donenler.push(b);
  });
  // Göçte, yağmurlu otlaklarda doğan yavrular
  donenler
    .filter((b) => !b.olu && b.cinsiyet === 'disi' && b.evre === 'yetiskin')
    .forEach((anne) => {
      if (d.rng() < 0.35) {
        const y = bireyOlustur(k, d.rng, g.tur, g, 'yavru', d.rng() < 0.5 ? 'erkek' : 'disi', anne.x, anne.y, anne.id);
        y.yas = 2 + Math.floor(d.rng() * 6);
        y.dogumDk = k.dk - y.yas * 1440;
        donenler.push(y);
        yeni++;
      }
    });
  const p = { x: gc.cikis.x, y: gc.cikis.y };
  donenler.forEach((b) => {
    b.x = p.x + b.ofs.x;
    b.y = p.y + b.ofs.y;
    k.hayvanlar.push(b);
  });
  d.hayvanMap = new Map(k.hayvanlar.map((b) => [b.id, b]));
  k.disari.gruplar = k.disari.gruplar.filter((x) => x !== g);
  const x = gc.gecit;
  const h = TURLER[g.tur].habitat;
  Object.assign(g, { x: p.x, y: p.y, plan: 'goc', alarm: 0, av: null, susuzluk: 0.5 });
  g.goc = { durum: 'donuyor', yol: [{ x, y: nehirY(x) - 12 }, { x, y: nehirY(x) + 12 }, { x: h.x, y: h.y }], i: 0 };
  k.gruplar.push(g);
  const sag = donenler.filter((b) => !b.olu).length;
  k.eko.gocler.unshift({ gun: gunNo(k.dk), tur: g.tur, olay: 'donus', sayi: sag, kayip, yeni });
  const m = `${BuyukHarf(gocAdi(g))} göçten dönüyor: ${sag} birey${yeni ? `, aralarında göçte doğmuş ${yeni} yavru` : ''}. ${kayip ? `Gidenlerden ${kayip} birey dönmedi.` : 'Gidenlerin hepsi dönüyor.'} Nehri yeniden geçecekler.`;
  mesajEkle(k, `Saha raporu: ${m}`, 'ekosistem');
  arsivOlay(d, m);
  olay(d, 'goc', m, 3, { tur: g.tur });
}

// Her yeni günün başında: hava, mevsim, yaşlanma, beslenme, hastalık, göç kararları
function gunlukEkosistem(d) {
  const k = d.k;
  const eko = k.eko;
  if (!eko) return;
  const gun = gunNo(k.dk);
  const tk = E.takvim(gun);
  E.havaUret(eko, gun, d.rng);
  eko.yagisBugun = 0;
  if (eko.mevsim !== tk.mevsim) {
    eko.mevsim = tk.mevsim;
    eko.yagisMevsim = 0;
    const gecik = tk.mevsim === 'yagisli' && eko.yil && eko.yil.gecikme ? ' Ama bu yıl yağmurlar gecikebilir.' : '';
    const m =
      tk.mevsim === 'yagisli'
        ? `Yağışlı mevsim başladı. Yağmurlarla otlar yeşerecek, gölet dolacak; otçulların çoğu bu mevsimde doğurur.${gecik}`
        : 'Kurak mevsim başladı. Otlar sararacak, gölet çekilecek. Göçmen sürüler bir süre sonra suyu bol otlaklara gidebilir.';
    mesajEkle(k, `Mevsim: ${m}`, 'ekosistem');
    arsivOlay(d, m);
    olay(d, 'mevsim', m, 3, { mevsim: tk.mevsim });
  }
  const gMap = new Map(k.gruplar.map((g) => [g.id, g]));
  // Grupların günlük beslenmesi
  const besin = new Map();
  k.gruplar.forEach((g) => {
    besin.set(g.id, g.besinDk ? g.besinTop / g.besinDk : E.otDegeri(eko, g.x, g.y) + 0.35);
    g.besinTop = 0;
    g.besinDk = 0;
  });
  const olecekler = [];
  const ayrilanlar = [];
  // Uyuzlu grup arkadaşı olan grup
  const uyuzlu = new Set(k.hayvanlar.filter((b) => !b.olu && b.hastalik && b.hastalik.id === 'uyuz').map((b) => b.grup));
  const sarbonLes = k.lesler.filter((l) => l.hastalik === 'sarbon' && k.dk - l.dk < 2 * 1440);
  for (const b of k.hayvanlar) {
    if (b.olu) continue;
    const g = gMap.get(b.grup);
    const t = TURLER[b.tur];
    // Yaşlanma ve evreler
    b.yas = (b.yas || 0) + 1;
    const yeniEvre = E.evreBul(b.tur, b.yas);
    if (yeniEvre !== b.evre) {
      b.evre = yeniEvre;
      gecmisEkle(k, b, `${BuyukHarf(EVRELER[yeniEvre])} oldu`);
      // Erginleşen genç erkek doğduğu sürüden ayrılır (karar 68)
      if (yeniEvre === 'yetiskin' && b.cinsiyet === 'erkek' && AYRILAN_ERKEK[b.tur] && g) {
        const baskaErkek = k.hayvanlar.some((x) => x !== b && !x.olu && x.grup === b.grup && x.cinsiyet === 'erkek' && x.evre !== 'yavru' && x.evre !== 'genc');
        if (baskaErkek && d.rng() < 0.7) ayrilanlar.push(b);
      }
    }
    // Kondisyon: otçulda beslenme, yırtıcıda açlık; hasta ve susuz hayvan zayıflar
    let hedef;
    if (t.yirtici || t.kus || t.sinif === 'Sürüngen') hedef = g ? 1 - g.aclik * 0.7 : 0.6;
    else hedef = 0.2 + 0.7 * Math.min(1, besin.get(b.grup) ?? 0.6);
    const anne = b.evre === 'yavru' ? d.hayvanMap.get(b.anne) : null;
    if (b.evre === 'yavru' && b.yas < E.yilGun(E.YASAM[b.tur].yavru) * 0.5) hedef = anne && !anne.olu ? Math.max(0.3, anne.kondisyon) : 0.2;
    if (b.hastalik) hedef -= b.hastalik.siddet * 0.4;
    if (g && g.susuzluk > 0.95) hedef -= 0.15;
    b.kondisyon = sinirla(b.kondisyon + (hedef - b.kondisyon) * 0.35, 0.02, 1);
    // Hastalığın seyri
    if (b.hastalik) {
      const h = b.hastalik;
      const tanim = E.HASTALIKLAR[h.id];
      if (h.tedavi) h.siddet -= 0.5;
      else h.siddet += tanim.gunluk * (b.kondisyon < 0.4 ? 1.5 : 1) + (b.kondisyon < 0.3 && tanim.gunluk < 0 ? 0.1 : 0) + (d.rng() - 0.5) * 0.06;
      if (h.siddet <= 0 || (!tanim.olumcul && d.rng() < tanim.iyilesme)) {
        if (['uyuz', 'sarbon'].includes(h.id)) b.bagisik = [...(b.bagisik || []), h.id];
        gecmisEkle(k, b, `${BuyukHarf(tanim.ad)} iyileşti`);
        b.hastalik = null;
        b.teshis = null;
      } else if (h.siddet >= 1 && (tanim.olumcul || d.rng() < 0.4)) {
        olecekler.push([b, `${tanim.ad} nedeniyle öldü`]);
        continue;
      } else h.siddet = Math.min(1, h.siddet);
    }
    // Yeni hastalıklar (karar 28)
    if (!b.hastalik) {
      if (g && g.kirliSu < 0.55 && d.rng() < 0.08) hastalikVer(d, b, 'parazit', 0.2, 'Kirli sudan parazit kaptı');
      else if (d.rng() < 0.003) hastalikVer(d, b, 'parazit', 0.15, 'Parazit kaptı');
      else if (uyuzlu.has(b.grup) && d.rng() < 0.12) hastalikVer(d, b, 'uyuz', 0.15, 'Grup arkadaşından uyuz bulaştı');
      else if (d.rng() < 0.0015) hastalikVer(d, b, 'uyuz', 0.15, 'Uyuz oldu');
      else if (sarbonLes.length && eko.salgin && sarbonLes.some((l) => mesafe(l, g || b) < 60) && d.rng() < 0.15) {
        if (hastalikVer(d, b, 'sarbon', 0.3, 'Şarbon leşinin çevresinde otlarken şarbon kaptı')) eko.salgin.vaka += 1;
      }
    }
    // Açlık, yaşlılık ve yetimlik
    if (b.kondisyon < 0.15 && d.rng() < (b.evre === 'yavru' || b.evre === 'yasli' ? 0.12 : 0.03)) {
      olecekler.push([b, 'açlık ve susuzluktan zayıf düşüp öldü']);
      continue;
    }
    if (d.rng() < E.yaslilikOlumu(b.tur, b.yas)) {
      olecekler.push([b, 'yaşlılıktan öldü']);
      continue;
    }
    if (b.yetim && b.evre === 'yavru') {
      if (['fil', 'aslan', 'sirtlan', 'manda'].includes(b.tur) && d.rng() < 0.2) {
        b.yetim = false;
        gecmisEkle(k, b, 'Sürüden bir dişi yetimi sahiplendi');
      } else if (b.yas < E.yilGun(E.YASAM[b.tur].yavru) * 0.7 && d.rng() < 0.1) {
        olecekler.push([b, 'annesiz kalan yavru hayatta kalamadı']);
        continue;
      }
    }
  }
  // Göçteki hayvanlar da yaşlanır
  k.disari.hayvanlar.forEach((b) => {
    if (b.disari !== 'goc') return;
    b.yas = (b.yas || 0) + 1;
    b.evre = E.evreBul(b.tur, b.yas);
  });
  olecekler.forEach(([b, neden]) => hayvanOldu(d, b, neden, null));
  // Genç erkekler bölgeden ayrılır
  if (ayrilanlar.length) {
    ayrilanlar.forEach((b) => {
      disariEkle(k, b, 'ayrildi');
      gecmisEkle(k, b, 'Doğduğu sürüden ayrılıp bölgeyi terk etti');
      if (b.no) {
        const ab = k.arsiv.bireyler[b.id];
        if (ab) ab.ayrildi = zamanSozu(k.dk);
        mesajEkle(k, `Saha raporu: ${bireyAdi(b)} erginleşti ve doğduğu sürüden ayrılıp araştırma alanını terk etti. Genç erkekler kendi sürülerini kurmak için uzaklara gider.`, 'ekosistem');
      }
    });
    haritadanCikar(d, ayrilanlar);
  }
  // Şarbon salgını: kurak mevsimde, su azaldığında (karar 28, 74)
  if (!eko.salgin && tk.mevsim === 'kurak' && tk.mevsimGunu >= 5 && eko.golet < 0.45 && eko.sarbonYil !== tk.yil && d.rng() < 0.25) {
    const adaylar = k.gruplar.filter((g) => !g.goc && E.HASTALIKLAR.sarbon.turler.includes(g.tur));
    const g = adaylar[Math.floor(d.rng() * adaylar.length)];
    const u = g ? uyeler(d, g) : [];
    if (u.length) {
      const b = u[Math.floor(d.rng() * u.length)];
      if (hastalikVer(d, b, 'sarbon', 0.35, 'Topraktaki sporlardan şarbon kaptı')) {
        eko.salgin = { hastalik: 'sarbon', basGun: gun, vaka: 1, bilinen: false };
        eko.sarbonYil = tk.yil;
      }
    }
  } else if (eko.salgin) {
    const aktif = k.hayvanlar.some((b) => !b.olu && b.hastalik && b.hastalik.id === eko.salgin.hastalik);
    const les = k.lesler.some((l) => l.hastalik === eko.salgin.hastalik);
    if (!aktif && !les) {
      if (eko.salgin.bilinen) mesajEkle(k, `Salgın takibi: ${E.HASTALIKLAR[eko.salgin.hastalik].ad} salgını sona erdi. Toplam ${eko.salgin.vaka} vaka kaydedildi.`, 'ekosistem');
      eko.salgin = null;
    }
  }
  // Göç kararları ve dönüşler
  k.gruplar.forEach((g) => {
    if (!E.GOCMENLER[g.tur] || g.goc) return;
    const h = TURLER[g.tur].habitat;
    if (E.gocGerekli(eko, tk, E.ortalamaOt(eko, h.x, h.y, h.r)) && d.rng() < 0.5) {
      const u = uyeler(d, g);
      if (u.length) gocBaslat(d, g, u);
    }
  });
  k.disari.gruplar.slice().forEach((g) => {
    if (g.goc && g.goc.durum === 'disarida' && E.donusZamani(eko, tk) && (d.rng() < 0.5 || tk.mevsimGunu >= 6)) gocDonus(d, g);
  });
}

// ---------- Grup ve birey güncellemesi ----------
function grupGuncelle(d, g, dt, dtDk) {
  const k = d.k;
  const t = TURLER[g.tur];
  const u = uyeler(d, g);
  if (!u.length) return;
  g.susuzluk = Math.min(1, g.susuzluk + dtDk / (g.tur === 'fil' ? 520 : 680));
  if (t.yirtici) g.aclik = Math.min(1, g.aclik + dtDk / (ACLIK_SURESI[g.tur] || 3000));
  if (g.alarm > 0) {
    g.alarm -= dt;
    if (g.alarmGecikme > 0) g.alarmGecikme -= dt;
    if (g.alarm <= 0) {
      g.alarm = 0;
      // Kaçış bitti: grubun merkezi bireylerin ortasına taşınır
      g.x = u.reduce((s, b) => s + b.x, 0) / u.length;
      g.y = u.reduce((s, b) => s + b.y, 0) / u.length;
      g.planBitis = Math.min(g.planBitis, k.dk + 5);
    }
  }
  if (g.goc) {
    if (g.alarm <= 0) gocGuncelle(d, g, u, dt);
    return;
  }
  if (!g.plan || k.dk >= g.planBitis) planSec(d, g);
  if (g.alarm > 0) return;
  // Otlayan ve yaprak yiyen sürüler bitki örtüsünü tüketir; günlük beslenme kondisyonu belirler (karar 40, 103)
  if (k.eko && !t.yirtici && !t.kus && t.sinif === 'Memeli' && (g.plan === 'otla' || g.plan === 'gez')) {
    const yaprak = t.yeme === 'yapraklaBesleniyor';
    const iste = u.length * (TUKETIM[g.tur] || 1) * 0.004 * (dtDk / 60);
    const yenen = E.otYe(k.eko, g.x, g.y, iste, yaprak);
    g.besinTop = (g.besinTop || 0) + (iste > 0 ? Math.min(1, yenen / iste) * (yaprak ? E.yaprakDegeri(k.eko, g.x, g.y) + 0.5 : E.otDegeri(k.eko, g.x, g.y) + 0.35) : 0) * dtDk;
    g.besinDk = (g.besinDk || 0) + dtDk;
  }
  if (g.plan === 'av') {
    avGuncelle(d, g, u, dt);
    return;
  }
  // Merkezi hedefe yürüt
  if (g.hedef) {
    const hiz = g.plan === 'otla' ? 0.35 : g.plan === 'suzuluyor' ? 3 : g.plan === 'su' || g.plan === 'les' ? 1.6 : 1.2;
    const m = mesafe(g, g.hedef);
    if (m > 0.5) {
      const adim = Math.min(m, hiz * dt);
      const a = yonAcisi(g, g.hedef);
      g.x += Math.sin(a) * adim;
      g.y += Math.cos(a) * adim;
    } else if (g.plan === 'otla' && d.rng() < dt * 0.05) {
      g.hedef = yakinNokta(d, g, 10);
    } else if (g.plan === 'su' && !g.icti) {
      g.icti = true;
      // Gölette içtiyse suyun kalitesi kaydedilir (kirli su parazit getirir, karar 74)
      g.kirliSu = k.eko && GOLET.su && mesafe(g, GOLET) < GOLET.r + 8 ? E.suKalitesi(k.eko) : 1;
      g.planBitis = Math.min(g.planBitis, k.dk + arasi(d.rng, 12, 22));
      g.susuzluk = 0;
    } else if (g.plan === 'gez') {
      g.planBitis = Math.min(g.planBitis, k.dk + 3);
    }
  }
  if ((g.plan === 'beslen' || g.plan === 'les') && g.lesId) {
    const les = k.lesler.find((l) => l.id === g.lesId);
    if (les && mesafe(g, les) < 5) {
      les.kalan -= dtDk / (g.plan === 'les' ? 120 : 200);
      if (g.plan === 'les') g.aclik = Math.max(0, g.aclik - dtDk / 60);
    }
    if (!les || les.kalan <= 0) g.planBitis = k.dk;
  }
}

// Bireyin o anki davranışı (gözlemde söylenen)
function davranisBelirle(d, b, g, hareketli) {
  const t = TURLER[b.tur];
  const k = d.k;
  if (b.tehdit > 0) return 'uyariyor';
  if (g.alarm > 0 && g.alarmGecikme <= 0 && !t.yirtici) return 'kaciyor';
  if (b.alt && k.dk < b.altBitis) return b.alt;
  if (g.goc) return nehirdeMi(b.x, b.y) ? 'nehirGeciyor' : hareketli ? 'gocEdiyor' : 'otluyor';
  // Çok hasta hayvan yatar
  if (b.hastalik && b.hastalik.siddet > 0.65 && g.alarm <= 0) return 'dinleniyor';
  switch (g.plan) {
    case 'av':
      if (g.av && g.av.evre === 'kovala') return g.av.avciId === b.id ? 'kovaliyor' : 'yuruyor';
      return g.av ? 'pusuda' : 'yuruyor';
    case 'beslen':
      return hareketli ? 'yuruyor' : 'besleniyor';
    case 'les':
      return hareketli ? 'yuruyor' : 'lesteBesleniyor';
    case 'su':
      return hareketli ? 'yuruyor' : 'suIciyor';
    case 'camur':
      return hareketli ? 'yuruyor' : 'camurBanyosu';
    case 'uyu':
      return 'uyuyor';
    case 'dinlen':
      return hareketli ? 'yuruyor' : 'dinleniyor';
    case 'suda':
      return 'suda';
    case 'gunes':
      return hareketli ? 'yuruyor' : 'gunesleniyor';
    case 'pusu':
      return 'pusuda';
    case 'tunemis':
      return 'tunemis';
    case 'suzuluyor':
      return 'suzuluyor';
    case 'balikAvi':
      return 'balikAvliyor';
    case 'bekle':
      return 'bekliyor';
    case 'gez':
      return hareketli ? 'yuruyor' : t.yeme || (t.yirtici ? 'kolluyor' : 'otluyor');
    default:
      return t.yeme || (t.yirtici ? 'kolluyor' : 'otluyor');
  }
}

function altDavranisSec(d, b, g) {
  const k = d.k;
  if (b.alt && k.dk < b.altBitis) return;
  b.alt = null;
  if (d.rng() > 0.35) {
    b.altBitis = k.dk + arasi(d.rng, 15, 40);
    return;
  }
  const t = TURLER[b.tur];
  const yavru = k.hayvanlar.find((y) => y.anne === b.id && !y.olu && y.evre === 'yavru');
  const sakin = ['otla', 'dinlen', 'gez'].includes(g.plan) && aktifMi(t, k.dk);
  if (!sakin || t.kus || t.sinif === 'Sürüngen') {
    b.altBitis = k.dk + 30;
    return;
  }
  if (yavru && t.sinif === 'Memeli' && d.rng() < 0.6) b.alt = 'emziriyor';
  else if (b.evre === 'yavru' && d.rng() < 0.7) b.alt = 'oynuyor';
  else if (t.grup[1] > 2 && d.rng() < 0.5) b.alt = 'timarlaniyor';
  b.altBitis = k.dk + arasi(d.rng, 8, 20);
}

function bireyGuncelle(d, b, g, dt) {
  const k = d.k;
  const t = TURLER[b.tur];
  const ox = b.x;
  const oy = b.y;
  if (b.tehdit > 0) b.tehdit -= dt;
  b.gecis = !!g.goc;
  const hDef = b.hastalik ? E.HASTALIKLAR[b.hastalik.id] : null;
  const saglikHiz = hDef && hDef.yavaslatir && b.hastalik.siddet > 0.25 ? hDef.yavaslatir : 1;
  altDavranisSec(d, b, g);
  const anne = b.evre === 'yavru' ? birey(d, b.anne) : null;
  const yavruKarsi = anne && !anne.olu;
  // Kaçış
  if (g.alarm > 0 && g.alarmGecikme <= 0 && !(g.plan === 'av' && t.yirtici) && g.kaynak) {
    const a = yonAcisi(g.kaynak, b) + (b.ofs.x * 0.04);
    const hiz = t.hiz * saglikHiz * (b.evre === 'yavru' || b.evre === 'yasli' ? 0.8 : 1) * (t.suCanlisi && nehirdeMi(b.x, b.y) ? 0.6 : 1);
    if (t.suCanlisi) bireyYuru(d, b, b.x + Math.sin(a) * 6, nehirY(b.x + Math.sin(a) * 6), hiz, dt); // suya dalar
    else bireyYuru(d, b, b.x + Math.sin(a) * 20, b.y + Math.cos(a) * 20, hiz, dt);
  } else if (g.plan === 'av' && g.av && g.av.evre === 'kovala' && g.av.avciId === b.id) {
    // avGuncelle yürütüyor
  } else {
    const sik = g.goc ? 0.35 : 1; // göçte sürü sıkışık yürür (geçitten birlikte geçsin)
    let hx = g.x + b.ofs.x * sik;
    let hy = g.y + b.ofs.y * sik;
    if (yavruKarsi) {
      hx = anne.x + 1.2;
      hy = anne.y - 1;
    }
    if (g.plan === 'suda' || (g.plan === 'pusu' && t.suCanlisi)) {
      hx = g.x + b.ofs.x * 1.5;
      hy = g.hedef ? g.hedef.y + sinirla(b.ofs.y * 0.3, -1.5, 1.5) : g.y;
    }
    if (t.kus) {
      if (g.plan === 'suzuluyor') {
        const a = d.zaman * 0.25 + b.id;
        hx = g.x + Math.sin(a) * 18;
        hy = g.y + Math.cos(a) * 18;
      } else if (g.plan === 'balikAvi') {
        hx = g.x;
        hy = nehirY(g.x) + 1;
      }
    }
    const m = Math.hypot(hx - b.x, hy - b.y);
    const hiz = (m > 15 ? Math.min(t.hiz, 4.5) : m > 4 ? 2.2 : 1.1) * saglikHiz;
    if (m > 0.6) bireyYuru(d, b, hx, hy, hiz, dt);
    else if (d.rng() < dt * 0.1) b.yon += arasi(d.rng, -0.6, 0.6);
  }
  const hareketli = Math.hypot(b.x - ox, b.y - oy) / Math.max(dt, 0.001) > 0.6;
  b.hareketli = hareketli;
  b.davranis = davranisBelirle(d, b, g, hareketli);

  // Oyuncuya tepki
  const mo = mesafe(b, d.oyuncu);
  if (mo < 70 && !t.kus) {
    const kac = kacisMesafesi(d, b);
    if (mo < kac && g.alarm <= 0.5 && b.tehdit <= 0) {
      const tehlikeli = t.tehlikeli && !k.aracta && (b.kisilik === 'cesur' || b.evre === 'yetiskin') && b.evre !== 'yavru';
      if (tehlikeli && mo < kac * 0.7) {
        tehditGoster(d, b);
      } else if (!(t.tehlikeli && t.yirtici && b.kisilik === 'cesur')) {
        grupAlarm(d, g, d.oyuncu, arasi(d.rng, 5, 8));
        b.alisma = Math.max(0, b.alisma - 0.04);
        if (d.zaman - d.sonUyari > 20 && mo < durbunMenzili(k.dk, k)) {
          d.sonUyari = d.zaman;
          olay(d, 'urktu', `${grupAdi(d, g, b)} seni fark edip uzaklaştı. Daha uzaktan izlemelisin.`, 2, { id: b.id });
        }
      }
    } else if (mo >= kac && !d.oyuncuHareketli && mo < durbunMenzili(k.dk, k)) {
      // Sakin ve uzaktan izlenmeye alışır (karar 19)
      b.alisma = Math.min(1, b.alisma + dt * 0.0015 * KISILIKLER[b.kisilik].alisma * (d.gozlemId === b.id ? 2 : 1));
    }
  }
  // Sesler: 70 metre içindekiler arada bir ses çıkarır (3B ses App'te çalınır)
  if (mo < 70) {
    b.sesSayac -= dt * (g.alarm > 0 ? 3 : 1);
    if (b.sesSayac <= 0) {
      b.sesSayac = t.sesSik * arasi(d.rng, 0.6, 1.4) * (b.evre === 'yavru' ? 1.5 : 1);
      const zorla = d.sesKayit && d.sesKayit.zorla.has(b.id);
      if (zorla) d.sesKayit.zorla.delete(b.id);
      if (zorla || (!(b.davranis === 'uyuyor' && d.rng() < 0.8) && d.zaman - d.sonSes > 1.2)) {
        d.sonSes = d.zaman;
        olay(d, 'hayvanSesi', '', 0, { id: b.id, sesTuru: sesTuruBul(b, g) });
      }
    }
  }
}
function sesTuruBul(b, g) {
  const t = TURLER[b.tur];
  if (b.tehdit > 0 || b.davranis === 'uyariyor') return 'tehdit';
  if (g.alarm > 0 && !t.yirtici) return 'alarm';
  if (b.evre === 'yavru') return 'yavru';
  return t.sesTuru || 'iletisim';
}
function grupAdi(d, g, b) {
  const n = uyeler(d, g).length;
  if (n >= 3) return `${SOZ[g.tur]} ${['zebra', 'ceylan', 'manda', 'fil'].includes(g.tur) ? 'sürüsü' : 'grubu'}`;
  return taninmisMi(b) ? bireyAdi(b) : `Bir ${kucuk(SOZ[b.tur])}`;
}

// Tehlikeli hayvan: önce uyarır, sen geri çekilmezsen sahte saldırı yapar (karar 11: hayvan refahı, çatışma yok)
function tehditGoster(d, b) {
  const t = TURLER[b.tur];
  const ad = taninmisMi(b) ? bireyAdi(b) : `Bir ${kucuk(SOZ[b.tur])}`;
  if (b.sakin && d.zaman < b.sakin) return; // hamleden sonra bir süre yeniden saldırmaz
  if (!b.uyardi || d.zaman - b.uyardi > 15) {
    b.uyardi = d.zaman;
    b.tehdit = 3;
    b.yon = yonAcisi(b, d.oyuncu);
    const nasil = { fil: 'kulaklarını açıp hortumunu kaldırdı', manda: 'başını kaldırıp toynaklarıyla yeri eşeledi', suAygiri: 'ağzını kocaman açtı', gergedan: 'başını eğip burnundan soludu', aslan: 'kulaklarını yatırıp hırladı', leopar: 'dişlerini gösterip tısladı', timsah: 'tıslayarak ağzını açtı' }[b.tur] || 'sana döndü';
    olay(d, 'tehdit', `Dikkat! ${ad} ${nasil}, seni uyarıyor. ${BuyukHarf(yerTarifi(d.oyuncu, b))}. Hemen geri çekil.`, 4, { id: b.id });
    return;
  }
  if (d.zaman - b.uyardi > 3.5) {
    // Sahte saldırı: hayvan birkaç metre atılır, sen geri sıçrarsın
    b.uyardi = d.zaman;
    b.sakin = d.zaman + 25;
    b.tehdit = 2;
    const a = yonAcisi(b, d.oyuncu);
    b.x += Math.sin(a) * 4;
    b.y += Math.cos(a) * 4;
    const o = d.oyuncu;
    for (let i = 0; i < 6; i++) {
      const nx = o.x + Math.sin(a) * 1;
      const ny = o.y + Math.cos(a) * 1;
      if (nehirdeMi(nx, ny) && !gecitteMi(nx)) break;
      o.x = nx;
      o.y = ny;
    }
    engelleItele(d, o, 0.45, false, false);
    b.alisma = Math.max(0, b.alisma - 0.15);
    d.rota = null;
    d.yaklasId = null;
    olay(d, 'saldiri', `${ad} sana doğru hamle yaptı! Geri sıçrayıp kurtuldun. Bu kadar yaklaşmak hem senin hem hayvan için tehlikeli. Bilimsel itibarın biraz düştü.`, 5, { id: b.id });
    itibarEkle(d, -2);
  }
}

// ---------- Mesajlar (karar 82: teklif, sonuç ve bildirimler tek ekranda) ----------
export function mesajEkle(k, metin, tur = 'bilgi', ek = {}) {
  if (!Array.isArray(k.mesajlar)) k.mesajlar = [];
  k.mesajlar.unshift({ id: k.sonrakiId++, dk: k.dk, metin, tur, okundu: false, ...ek });
  if (k.mesajlar.length > 60) k.mesajlar.length = 60;
  k.yeniMesaj = true;
}

// ---------- Arşiv ve itibar ----------
export function itibarEkle(d, n) {
  if (!n) return;
  d.k.itibar = Math.max(0, d.k.itibar + n);
}
export function arsivOlay(d, metin) {
  const l = d.k.arsiv.olaylar;
  l.unshift({ metin, dk: d.k.dk, bolge: bolgeAdi(d.oyuncu.x, d.oyuncu.y) });
  if (l.length > 150) l.length = 150;
}
export function turKaydi(d, tur) {
  const a = d.k.arsiv.turler;
  if (!a[tur]) {
    a[tur] = { ilkDk: d.k.dk, gozlemSn: 0, davranislar: [], sesKaydi: false, ilkBolge: bolgeAdi(d.oyuncu.x, d.oyuncu.y) };
    itibarEkle(d, 8);
    const t = TURLER[tur];
    olay(d, 'yeniTur', `Yeni tür ansiklopediye eklendi: ${t.ad}, bilimsel adı ${t.bilimsel}. ${t.tarif}`, 4, { tur });
  }
  return a[tur];
}

// ---------- Gözlem (karar 11, 45, 58) ----------
export function gorunurler(d, menzil) {
  const m = menzil ?? durbunMenzili(d.k.dk, d.k);
  return d.k.hayvanlar
    .filter((b) => gozlenebilirMi(b))
    .map((b) => ({ b, m: mesafe(d.oyuncu, b) }))
    .filter((x) => x.m <= m)
    .sort((a, b) => a.m - b.m);
}
export const gozlenen = (d) => {
  const b = birey(d, d.gozlemId);
  return b && !b.olu ? b : null;
};
export function gozlemTarifi(d, b) {
  const dv = DAVRANISLAR[b.davranis] || DAVRANISLAR.dinleniyor;
  return `${BuyukHarf(bireyAdi(b))} ${dv.fiil}${saglikGorunusu(b)}, ${yerTarifi(d.oyuncu, b)}`;
}
// Dürbünle görülen sağlık belirtisi (karar 28)
export function saglikGorunusu(b) {
  if (b.hastalik && E.belirtiGorunur(b.hastalik)) return `, ${E.HASTALIKLAR[b.hastalik.id].belirti}`;
  if (b.kondisyon < 0.3) return ', çok zayıf görünüyor';
  return '';
}
export function gozlemBaslat(d, id) {
  let b = id ? birey(d, id) : null;
  if (!b) {
    const liste = gorunurler(d);
    if (!liste.length) {
      d.gozlemId = null;
      olay(d, 'gozlemYok', `Dürbünle görebileceğin ${durbunMenzili(d.k.dk, d.k)} metre içinde hayvan yok.${geceMi(d.k.dk) ? ' Gece görüş kısa.' : ''} Seslere kulak ver ya da Etrafı tara.`, 3);
      return null;
    }
    const i = liste.findIndex((x) => x.b.id === d.gozlemId);
    b = liste[(i + 1) % liste.length].b;
  }
  d.gozlemId = b.id;
  d.gozlem = { sn: 0, davranis: b.davranis, davranisSn: 0, duyurulan: b.davranis };
  turKaydi(d, b.tur);
  let m = `Gözlem: ${gozlemTarifi(d, b)}.`;
  if (taninmisMi(b)) m += ` ${b.cinsiyet === 'erkek' ? 'Erkek' : 'Dişi'}, ${EVRELER[b.evre]}.`;
  else m += ' Tanımlamak için bir süre izle.';
  olay(d, 'gozlem', m, 3, { id: b.id });
  return b;
}
export function gozlemBitir(d) {
  d.gozlemId = null;
  d.gozlem = null;
  d.yaklasId = null;
}
function gozlemGuncelle(d, dt) {
  const b = gozlenen(d);
  if (!d.gozlemId) return;
  const k = d.k;
  const menzil = durbunMenzili(k.dk, k);
  if (!b || mesafe(d.oyuncu, b) > menzil + 5) {
    const ad = b ? BuyukHarf(bireyAdi(b)) : 'Hayvan';
    if (!d.yaklasId) {
      olay(d, 'gozlemBitti', `Gözlem bitti: ${ad} görüş alanından çıktı.`, 2);
      d.gozlemId = null;
      d.gozlem = null;
    }
    return;
  }
  const g = d.gozlem;
  g.sn += dt;
  const tk = turKaydi(d, b.tur);
  tk.gozlemSn += dt;
  // Tanımlama: 6 saniye izleyince kimlik numarası verilir
  if (!taninmisMi(b) && g.sn > 6) {
    k.sayac[b.tur] = (k.sayac[b.tur] || 0) + 1;
    b.no = k.sayac[b.tur];
    k.arsiv.bireyler[b.id] = { ilkDk: k.dk, gozlemSn: 0, sonDk: k.dk, sonBolge: bolgeAdi(b.x, b.y) };
    itibarEkle(d, 2);
    olay(d, 'tanimlandi', `Tanımlandı: ${bireyKunye(d, b)}`, 3, { id: b.id });
  }
  if (b.hastalik && E.belirtiGorunur(b.hastalik) && !b.hastalik.goruldu && g.sn > 2) {
    b.hastalik.goruldu = true;
    gecmisEkle(k, b, `Gözlemde görüldü: ${E.HASTALIKLAR[b.hastalik.id].belirti}`);
    olay(d, 'belirti', `${BuyukHarf(bireyAdi(b))} ${E.HASTALIKLAR[b.hastalik.id].belirti}. Sağlığı bozuk görünüyor. Menüde Numune ve veteriner bölümünden dışkı numunesi alabilir ya da veteriner çağırabilirsin.`, 3, { id: b.id });
  }
  const ab = k.arsiv.bireyler[b.id];
  if (ab) {
    ab.gozlemSn += dt;
    ab.sonDk = k.dk;
    ab.sonBolge = bolgeAdi(b.x, b.y);
  }
  // Davranış kaydı: aynı davranışı 3 saniye görünce
  if (b.davranis !== g.davranis) {
    g.davranis = b.davranis;
    g.davranisSn = 0;
  } else g.davranisSn += dt;
  if (g.davranisSn > 1.2 && g.duyurulan !== b.davranis) {
    g.duyurulan = b.davranis;
    olay(d, 'davranis', `${BuyukHarf(bireyAdi(b))} artık ${DAVRANISLAR[b.davranis].fiil}.`, 1, { id: b.id });
  }
  if (g.davranisSn > 3 && !tk.davranislar.includes(b.davranis)) {
    tk.davranislar.push(b.davranis);
    const dv = DAVRANISLAR[b.davranis];
    itibarEkle(d, dv.nadir ? 6 : 2);
    olay(d, 'yeniDavranis', `${dv.nadir ? 'Nadir davranış! ' : ''}Yeni davranış kaydı: ${SOZ[b.tur]}, ${kucuk(dv.ad)}.`, 3, { id: b.id, nadir: !!dv.nadir });
    if (dv.nadir) arsivOlay(d, `${BuyukHarf(bireyAdi(b))} gözlendi: ${kucuk(dv.ad)}.`);
  }
}

// Gözlenen hayvanın güvenli izleme mesafesine kadar yürü
export function yaklas(d) {
  const b = gozlenen(d);
  if (!b) {
    olay(d, 'hata', 'Önce Gözlemle ile bir hayvan seç.', 3);
    return;
  }
  d.yaklasId = b.id;
  d.rota = null;
  const hedefM = Math.max(kacisMesafesi(d, b) + 5, 12);
  if (mesafe(d.oyuncu, b) <= hedefM + 1) {
    olay(d, 'yaklas', `Zaten iyi bir izleme mesafesindesin: ${metreSozu(mesafe(d.oyuncu, b))}. Daha yaklaşırsan ürker.`, 3);
    d.yaklasId = null;
    return;
  }
  olay(d, 'yaklas', `Yaklaşıyorsun: ${bireyAdi(b)}. Ürkütmeden ${metreSozu(hedefM)} uzakta duracaksın.`, 3, { id: b.id });
}
export function dur(d) {
  d.rota = null;
  d.yaklasId = null;
}

// ---------- Fotoğraf (karar 25, 86: basit çekim) ----------
export function fotografCek(d) {
  const k = d.k;
  if (d.zaman - d.sonFoto < 1.2) return;
  let b = gozlenen(d);
  const menzil = Math.min(kameraMenzili(k), durbunMenzili(k.dk, k) + 4);
  if (!b || mesafe(d.oyuncu, b) > menzil) {
    const l = gorunurler(d, menzil);
    if (!l.length) {
      olay(d, 'foto', `Fotoğraf makinesinin menzilinde (${menzil} metre) hayvan yok.`, 3, { cekildi: false });
      return;
    }
    b = l[0].b;
    d.gozlemId = b.id;
    d.gozlem = { sn: 0, davranis: b.davranis, davranisSn: 0, duyurulan: b.davranis };
  }
  d.sonFoto = d.zaman;
  if (!k.aracta) d.oyuncu.yon = yonAcisi(d.oyuncu, b); // makineyi hayvana çevir
  turKaydi(d, b.tur);
  const m = mesafe(d.oyuncu, b);
  const dv = DAVRANISLAR[b.davranis];
  let puan = 1 - m / menzil;
  if (b.davranis === 'kaciyor' || b.davranis === 'kovaliyor') puan -= 0.35;
  if (dv.nadir) puan += 0.3;
  if (geceMi(k.dk)) puan -= k.ekipman && k.ekipman.termal ? 0.08 : 0.25;
  puan += b.alisma * 0.2;
  if (k.ekipman && k.ekipman.teleobjektif) puan += 0.1;
  if (personelVar(k, 'fotografci')) puan += 0.12;
  const kalite = puan > 0.75 ? 'çok iyi' : puan > 0.4 ? 'iyi' : puan > 0.1 ? 'orta' : 'bulanık';
  const foto = { id: k.sonrakiId++, bireyId: b.id, kod: taninmisMi(b) ? kod(b) : null, tur: b.tur, davranis: b.davranis, bolge: bolgeAdi(b.x, b.y), dk: k.dk, kalite };
  k.arsiv.fotolar.unshift(foto);
  if (k.arsiv.fotolar.length > 300) k.arsiv.fotolar.length = 300;
  let metin = `Fotoğraf çekildi: ${bireyAdi(b)}, ${dv.fiil}. Kalite ${kalite}.`;
  const onceki = k.arsiv.fotolar.slice(1).some((f) => f.tur === b.tur && f.davranis === b.davranis && (f.kalite === 'iyi' || f.kalite === 'çok iyi'));
  if (!onceki && (kalite === 'iyi' || kalite === 'çok iyi')) {
    itibarEkle(d, dv.nadir ? 5 : 1);
    if (dv.nadir) {
      metin += ' Belgesel değerinde bir kare!';
      arsivOlay(d, `Fotoğraflandı: ${bireyAdi(b)}, ${kucuk(dv.ad)}.`);
    }
  }
  // Belgesel değerindeki kareler (nadir davranış, çok iyi) lisanslanır: gelir (karar 25)
  if (dv.nadir && kalite === 'çok iyi' && typeof k.butce === 'number') {
    const gelir = personelVar(k, 'fotografci') ? 1600 : 800;
    k.butce += gelir;
    mesajEkle(k, `Bir doğa dergisi ${bireyAdi(b)} fotoğrafının yayın hakkını satın aldı: ${gelir} lira.`, 'gelir');
    metin += ` Bir dergi bu kareyi ${gelir} liraya satın aldı.`;
  }
  // Çok yakından çekim hayvanı rahatsız eder
  if (m < kacisMesafesi(d, b) * 1.15 && !TURLER[b.tur].kus) b.alisma = Math.max(0, b.alisma - 0.03);
  olay(d, 'foto', metin, 3, { cekildi: true, id: b.id });
}

// ---------- Ses kaydı ve analizi (karar 49, 87) ----------
export function sesKaydiBaslat(d) {
  if (d.sesKayit) {
    olay(d, 'hata', 'Kayıt zaten sürüyor.', 2);
    return;
  }
  d.sesKayit = { bitis: d.zaman + 6, duyulan: [], zorla: new Set() };
  // Yakındaki ses çıkaran hayvanlardan birkaçı kayıt sırasında ses verir
  const yakin = d.k.hayvanlar.filter((b) => !b.olu && mesafe(b, d.oyuncu) < sesKayitMenzili(d.k)).sort((a, b) => mesafe(a, d.oyuncu) - mesafe(b, d.oyuncu));
  const turler = new Set();
  let gec = 0.6;
  for (const b of yakin) {
    if (turler.has(b.tur) || turler.size >= 3) continue;
    turler.add(b.tur);
    b.sesSayac = gec;
    d.sesKayit.zorla.add(b.id);
    gec += 1.4;
  }
  d.sonSes = -9;
  olay(d, 'sesKayit', 'Ses kaydı başladı. 6 saniye kıpırdamadan dinle.', 3, { basladi: true });
}
function sesKaydiGuncelle(d, sesOlaylari) {
  const s = d.sesKayit;
  if (!s) return;
  for (const o of sesOlaylari) {
    const b = birey(d, o.id);
    if (b && mesafe(b, d.oyuncu) < sesKayitMenzili(d.k) && !s.duyulan.some((x) => x.tur === b.tur)) {
      s.duyulan.push({ id: b.id, tur: b.tur, saat: saatYonu(d.oyuncu, b), m: mesafe(d.oyuncu, b), sesTuru: o.sesTuru });
    }
  }
  if (d.zaman < s.bitis) return;
  d.sesKayit = null;
  const k = d.k;
  if (!s.duyulan.length) {
    olay(d, 'sesKayit', 'Kayıt bitti. Kayıtta yalnızca rüzgâr ve böcek sesleri var; yakında ses veren hayvan yok.', 3, { bitti: true });
    return;
  }
  const parcalar = s.duyulan.map((x) => {
    const tk = turKaydi(d, x.tur);
    if (!tk.sesKaydi) {
      tk.sesKaydi = true;
      itibarEkle(d, 3);
    }
    k.arsiv.sesler.unshift({ id: k.sonrakiId++, tur: x.tur, bireyId: x.id, sesTuru: x.sesTuru, saat: x.saat, m: Math.round(x.m), bolge: bolgeAdi(d.oyuncu.x, d.oyuncu.y), dk: k.dk });
    return `${SOZ[x.tur]}, ${SES_TURLERI[x.sesTuru]}, saat ${x.saat} yönünden, yaklaşık ${metreSozu(x.m)}`;
  });
  if (k.arsiv.sesler.length > 300) k.arsiv.sesler.length = 300;
  olay(d, 'sesKayit', `Ses analizi: ${parcalar.join('; ')}.`, 4, { bitti: true });
}

// ---------- Yerler ve yol bulma ----------
export function yerGit(d, id) {
  let hedef;
  if (id === 'arac') hedef = { x: d.k.arac.x, y: d.k.arac.y, ad: 'Arazi aracı', yakin: 2.5 };
  else {
    const y = YERLER.find((x) => x.id === id);
    if (!y) return;
    hedef = { x: y.x, y: y.y, ad: y.ad, yakin: 4 };
  }
  d.rota = hedef;
  d.yaklasId = null;
  olay(d, 'rota', `${hedef.ad} yönüne ${d.k.aracta ? 'sürüyorsun' : 'yürüyorsun'}. ${BuyukHarf(yerTarifi(d.oyuncu, hedef))}.`, 3);
}
function yolNoktasi(d, hedef) {
  const o = d.oyuncu;
  const benGuney = guneydeMi(o.x, o.y);
  const oGuney = guneydeMi(hedef.x, hedef.y);
  if (benGuney === oGuney) return hedef;
  // Karşı kıyı: en uygun geçide git
  const gec = GECITLER.slice().sort((a, b) => Math.abs(a.x - o.x) + Math.abs(a.x - hedef.x) - (Math.abs(b.x - o.x) + Math.abs(b.x - hedef.x)))[0];
  const yakaNokta = nehirNoktasi(gec.x, benGuney, 6);
  if (Math.abs(o.x - gec.x) < gec.yari - 2 && Math.abs(o.y - nehirY(o.x)) < 9) return nehirNoktasi(gec.x, !benGuney, 7);
  return yakaNokta;
}
function engelVar(d, x, y) {
  for (const e of d.engeller) if (Math.abs(x - e.x) < e.r + 0.6 && Math.abs(y - e.y) < e.r + 0.6 && Math.hypot(x - e.x, y - e.y) < e.r + 0.6) return true;
  if (golettemi(x, y, 0.6)) return true;
  if (nehirdeMi(x, y) && !gecitteMi(x)) return true;
  return false;
}
function engeldenKacan(d, aci, uzak) {
  const o = d.oyuncu;
  const yokla = (a) => !engelVar(d, o.x + Math.sin(a) * uzak, o.y + Math.cos(a) * uzak) && !engelVar(d, o.x + Math.sin(a) * uzak * 0.5, o.y + Math.cos(a) * uzak * 0.5);
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

// Otomatik yürüyüşte tehlikeli hayvanların çevresinden dolaş (karar 11: hayvan refahı)
function tehlikedenKacan(d, aci, hedef) {
  const o = d.oyuncu;
  let vx = Math.sin(aci);
  let vy = Math.cos(aci);
  let itti = false;
  for (const b of d.k.hayvanlar) {
    if (b.olu || b === hedef) continue;
    const t = TURLER[b.tur];
    if (!t.tehlikeli) continue;
    const dx = o.x - b.x;
    const dy = o.y - b.y;
    if (Math.abs(dx) > 45 || Math.abs(dy) > 45) continue;
    const m = Math.hypot(dx, dy) || 0.1;
    const r = kacisMesafesi(d, b) + 8;
    if (m > r) continue;
    const g = ((r - m) / r) * 2.2;
    vx += (dx / m) * g;
    vy += (dy / m) * g;
    itti = true;
  }
  if (itti && d.zaman - (d.sonDolasma || -99) > 60) {
    d.sonDolasma = d.zaman;
    olay(d, 'dolas', 'Yolunda tehlikeli bir hayvan var; çevresinden dolaşıyorsun.', 2);
  }
  return Math.atan2(vx, vy);
}

// ---------- Oyuncu hareketi ----------
function oyuncuHareket(d, dx, dy) {
  const o = d.oyuncu;
  let nx = o.x + dx;
  let ny = o.y + dy;
  let nehir = false;
  if (nehirdeMi(nx, ny) && !gecitteMi(nx)) {
    nehir = true;
    if (!nehirdeMi(nx, o.y)) ny = o.y;
    else if (!nehirdeMi(o.x, ny)) nx = o.x;
    else {
      nx = o.x;
      ny = o.y;
    }
  }
  const p = { x: nx, y: ny };
  engelleItele(d, p, d.k.aracta ? 1.3 : 0.45, false, false);
  const carpti = nehir || Math.hypot(p.x - (o.x + dx), p.y - (o.y + dy)) > 0.05;
  const gol = golettemi(o.x + dx, o.y + dy, d.k.aracta ? 1.3 : 0.45);
  o.x = p.x;
  o.y = p.y;
  return { carpti, nehir, gol };
}

// ---------- Araç (karar 4, 24, 42: sınırsız yakıt, bakım yok) ----------
export const aracYakinMi = (d) => !d.k.aracta && mesafe(d.oyuncu, d.k.arac) < 6.5;
export function aracaBin(d) {
  if (d.k.aracta) return aractanIn(d);
  if (!aracYakinMi(d)) {
    olay(d, 'hata', `Araç ${yerTarifi(d.oyuncu, d.k.arac)}. Araca git ile yanına yürüyebilirsin.`, 3);
    return;
  }
  d.k.aracta = true;
  d.aracHiz = 0;
  Object.assign(d.oyuncu, { x: d.k.arac.x, y: d.k.arac.y, yon: d.k.arac.yon });
  d.rota = null;
  olay(d, 'arac', 'Araca bindin. Hayvanlar araçtaki insandan daha az ürker.', 3, { bindi: true });
}
export function aractanIn(d) {
  if (!d.k.aracta) return;
  if (Math.abs(d.aracHiz) > 1) {
    olay(d, 'hata', 'Önce dur.', 3);
    return;
  }
  d.k.aracta = false;
  d.aracHiz = 0;
  const o = d.oyuncu;
  Object.assign(d.k.arac, { x: o.x, y: o.y, yon: o.yon });
  const a = o.yon - Math.PI / 2;
  o.x += Math.sin(a) * 2.2;
  o.y += Math.cos(a) * 2.2;
  engelleItele(d, o, 0.45, false, false);
  if (nehirdeMi(o.x, o.y) && !gecitteMi(o.x)) Object.assign(o, { x: d.k.arac.x, y: d.k.arac.y });
  olay(d, 'arac', 'Araçtan indin. Yayasın. Tehlikeli hayvanlara yaya yaklaşma.', 3, { indi: true });
}

// ---------- Ana döngü ----------
// girdi: { ileri: -1..1, don: -1..1 }. Döndürür: { carpti, nehir, gol, yurudu }
export function guncelle(d, dt, girdi = {}) {
  dt = Math.min(dt, 0.1);
  d.zaman += dt;
  const k = d.k;
  const dtDk = dt * OYUN_DK_SN;
  k.dk += dtDk;
  const o = d.oyuncu;
  const ox = o.x;
  const oy = o.y;
  let sonuc = { carpti: false, nehir: false, gol: false };

  // --- Oyuncu ---
  const ileri = sinirla(girdi.ileri || 0, -1, 1);
  const don = sinirla(girdi.don || 0, -1, 1);
  const elle = Math.abs(ileri) > 0.08 || Math.abs(don) > 0.08;
  if (elle) {
    d.rota = null;
    d.yaklasId = null;
  }
  // Otomatik yürüyüş: yer rotası ya da hayvana yaklaşma
  let oto = null;
  if (d.yaklasId) {
    const b = gozlenen(d);
    if (!b) d.yaklasId = null;
    else {
      const hedefM = Math.max(kacisMesafesi(d, b) + 5, 12);
      if (mesafe(o, b) <= hedefM) {
        d.yaklasId = null;
        olay(d, 'vardin', `İzleme mesafesindesin. ${gozlemTarifi(d, b)}.`, 3, { id: b.id });
      } else oto = b;
    }
  } else if (d.rota) {
    if (mesafe(o, d.rota) <= d.rota.yakin) {
      olay(d, 'vardin', `${d.rota.ad} yerine vardın.`, 3);
      d.rota = null;
    } else oto = d.rota;
  }
  if (k.aracta) {
    let hedefHiz = ileri * (ileri > 0 ? ARAC.hiz : ARAC.geri);
    let donus = don;
    if (oto) {
      const yn = yolNoktasi(d, oto);
      const aci = engeldenKacan(d, yonAcisi(o, yn), 4);
      const fark = aciNormal(aci - o.yon);
      donus = sinirla(fark * 2, -1, 1);
      const kalan = mesafe(o, oto);
      hedefHiz = Math.min(ARAC.hiz, Math.max(2.5, kalan * 0.6)) * (Math.abs(fark) > 1.2 ? 0.3 : 1);
    }
    d.aracHiz += sinirla(hedefHiz - d.aracHiz, -9 * dt, 6 * dt);
    if (Math.abs(d.aracHiz) > 0.2) o.yon = aciNormal(o.yon + donus * ARAC.don * dt * Math.sign(d.aracHiz) * Math.min(1, Math.abs(d.aracHiz) / 3));
    else if (!oto) o.yon = aciNormal(o.yon + donus * 0.8 * dt);
    const v = d.aracHiz * dt;
    if (Math.abs(v) > 0.0001) {
      sonuc = oyuncuHareket(d, Math.sin(o.yon) * v, Math.cos(o.yon) * v);
      if (sonuc.carpti) d.aracHiz *= 0.3;
    }
    Object.assign(k.arac, { x: o.x, y: o.y, yon: o.yon });
  } else {
    if (elle) {
      o.yon = aciNormal(o.yon + don * YURUME.don * dt);
      const v = ileri * YURUME.hiz * (ileri < 0 ? 0.55 : 1) * dt;
      sonuc = oyuncuHareket(d, Math.sin(o.yon) * v, Math.cos(o.yon) * v);
    } else if (oto) {
      if (!d.ilerleme || d.zaman - d.ilerleme.zaman > 1.5) {
        const kalan = mesafe(o, oto);
        if (d.ilerleme && d.ilerleme.kalan - kalan < 0.5 && !(d.sapma && d.sapma.bitis > d.zaman)) {
          d.sapma = { aci: (d.rng() < 0.5 ? -1 : 1) * (1 + d.rng() * 0.8), bitis: d.zaman + 1.3 };
        }
        d.ilerleme = { zaman: d.zaman, kalan };
      }
      let aci = tehlikedenKacan(d, yonAcisi(o, yolNoktasi(d, oto)), oto);
      if (d.sapma && d.sapma.bitis > d.zaman) aci += d.sapma.aci;
      o.yon = engeldenKacan(d, aci, 1.4);
      const v = YURUME.hiz * dt;
      sonuc = oyuncuHareket(d, Math.sin(o.yon) * v, Math.cos(o.yon) * v);
    }
  }
  const yol = Math.hypot(o.x - ox, o.y - oy);
  d.oyuncuHareketli = yol / Math.max(dt, 0.001) > 0.5;
  sonuc.yurudu = k.aracta ? 0 : yol;
  sonuc.surdu = k.aracta ? yol : 0;

  // --- Hayvanlar ---
  for (const g of k.gruplar) grupGuncelle(d, g, dt, dtDk);
  const gMap = new Map(k.gruplar.map((g) => [g.id, g]));
  const sesOncesi = d.olaylar.length;
  for (const b of k.hayvanlar) {
    if (b.olu) continue;
    const g = gMap.get(b.grup);
    if (!g) continue;
    bireyGuncelle(d, b, g, dt);
  }
  // Timsah pususu: su içen ava kıyıda saldırabilir (karar 102)
  for (const g of k.gruplar) {
    if (g.tur !== 'timsah' || g.plan !== 'pusu') continue;
    for (const c of k.hayvanlar) {
      if (c.olu || c.grup !== g.id) continue;
      for (const b of k.hayvanlar) {
        const geciyor = b.gecis && nehirdeMi(b.x, b.y);
        if (b.olu || (b.davranis !== 'suIciyor' && !geciyor) || !TURLER.timsah.avlar.includes(b.tur)) continue;
        if (mesafe(b, c) < (geciyor ? 7 : 6) && d.rng() < dt * (geciyor ? 0.03 : 0.02)) {
          const avGrup = gMap.get(b.grup);
          hayvanOldu(d, b, geciyor ? 'göçte nehir geçerken timsah yakaladı' : 'avlandı (timsah)', c);
          if (avGrup) grupAlarm(d, avGrup, c, 8);
          g.aclik = 0;
          g.plan = 'suda';
          g.planBitis = k.dk + 240;
        }
      }
    }
  }
  sesKaydiGuncelle(d, d.olaylar.slice(sesOncesi).filter((x) => x.tur === 'hayvanSesi'));
  gozlemGuncelle(d, dt);

  // --- Ekosistem: hava, su, bitki örtüsü (Aşama 5) ---
  if (k.eko) {
    for (const e of E.ekoAdim(k.eko, d.kap, gunNo(k.dk), gunDakikasi(k.dk), dtDk)) ekoDuyurusu(d, e);
  }

  // --- Zaman duyuruları ---
  const evre = gunEvresi(k.dk);
  if (evre !== d.sonEvre) {
    d.sonEvre = evre;
    const m = { safak: 'Şafak söküyor. Gece hayvanları dinlenmeye çekiliyor.', gunduz: 'Güneş doğdu. Gündüz hayvanları otlamaya başladı.', aksam: 'Güneş batıyor. Yırtıcılar uyanıyor.', gece: `Gece oldu. Dürbünle görüş ${EKIPMAN.durbunGece} metreye indi; çevreyi daha çok seslerden takip edeceksin.` }[evre];
    olay(d, 'zaman', m, 2, { evre });
  }
  const gun = gunNo(k.dk);
  if (gun !== d.sonGun) {
    d.sonGun = gun;
    gunlukDogumlar(d);
    const tk = E.takvim(gun);
    olay(d, 'zaman', `${gun}. gün başladı. ${BuyukHarf(E.MEVSIM_ADI[tk.mevsim])}, ${tk.mevsimGunu}. gün. ${E.havaTahmini(k.eko, gunDakikasi(k.dk))}`, 2);
  }

  // --- Bölge duyurusu ---
  const bolge = bolgeBul(o.x, o.y);
  if (bolge !== d.bolge) {
    d.bolge = bolge;
    const ilk = !k.gezilen.includes(bolge);
    if (ilk) k.gezilen.push(bolge);
    const yer = bolge === 'otlak' ? null : YERLER.find((y) => bolgeBul(y.x, y.y) === bolge);
    olay(d, 'bolge', `${BOLGE_ADLARI[bolge]}.${ilk && yer ? ' ' + yer.tarif : ''}`, 1, { bolge });
  }
  k.oyuncu = o;
  return sonuc;
}

// ---------- Sesli özetler ----------
export function durumOzeti(d) {
  const k = d.k;
  const tanin = Object.keys(k.arsiv.bireyler).length;
  const tur = Object.keys(k.arsiv.turler).length;
  const tk = E.takvim(gunNo(k.dk));
  const hava = k.eko && k.eko.hava ? ` Hava ${k.eko.yagmurVar ? (k.eko.siddet > 0.8 ? 'sağanak' : 'yağmurlu') : E.HAVA_ADI[k.eko.hava.tur]}.` : '';
  let m = `${zamanSozu(k.dk)}, ${E.MEVSIM_ADI[tk.mevsim]}.${hava} ${bolgeAdi(d.oyuncu.x, d.oyuncu.y)}. ${k.aracta ? 'Araçtasın. ' : ''}Bilimsel itibar ${k.itibar}. Keşfedilen tür ${tur} / ${TUR_SIRASI.length}, tanımlanan birey ${tanin}.`;
  const b = gozlenen(d);
  if (b) m += ` Gözlenen: ${gozlemTarifi(d, b)}.`;
  return m;
}
export function konumOzeti(d) {
  const o = d.oyuncu;
  const k = d.k;
  let m = `${bolgeAdi(o.x, o.y)}.`;
  const ist = { x: 0, y: 0 };
  if (Math.hypot(o.x, o.y) > ISTASYON.r) m += ` İstasyon ${yerTarifi(o, ist)}.`;
  else m += ' İstasyondasın.';
  if (!k.aracta) m += ` Araç ${yerTarifi(o, k.arac)}.`;
  const nm = Math.abs(o.y - nehirY(o.x));
  if (nm < 40) m += ` Nehir ${guneydeMi(o.x, o.y) ? 'kuzeyinde' : 'güneyinde'}, ${metreSozu(nm)}.`;
  if (YARICAP - Math.hypot(o.x, o.y) < 15) m += ' Araştırma alanının sınırındasın.';
  return `${m} Yüzün ${pusulaYonu(o.yon)} yönüne dönük.`;
}
export function etrafiTara(d) {
  const k = d.k;
  const menzil = durbunMenzili(k.dk, k);
  const liste = gorunurler(d, menzil);
  if (!liste.length) {
    const duyulan = gorunurler(d, 70).filter((x) => x.m > menzil);
    let m = `${menzil} metre içinde gördüğün hayvan yok.`;
    if (duyulan.length) {
      const turler = [...new Set(duyulan.map((x) => SOZ[x.b.tur]))].slice(0, 3);
      m += ` Daha uzaktan sesler geliyor: ${turler.join(', ')}.`;
    }
    return m;
  }
  // Sürüleri tek cümlede söyle
  const gruplar = new Map();
  liste.forEach((x) => {
    const l = gruplar.get(x.b.grup) || [];
    l.push(x);
    gruplar.set(x.b.grup, l);
  });
  const parcalar = [];
  [...gruplar.values()]
    .sort((a, b) => a[0].m - b[0].m)
    .slice(0, 5)
    .forEach((l) => {
      const b = l[0].b;
      if (l.length >= 3) {
        const yavru = l.filter((x) => x.b.evre === 'yavru').length;
        parcalar.push(`${SOZ[b.tur]} sürüsü, ${l.length} birey${yavru ? `, ${yavru} yavru` : ''}, ${DAVRANISLAR[b.davranis].fiil}, en yakını ${yerTarifi(d.oyuncu, b)}`);
      } else {
        l.forEach((x) => parcalar.push(`${BuyukHarf(bireyAdi(x.b))}, ${DAVRANISLAR[x.b.davranis].fiil}, ${yerTarifi(d.oyuncu, x.b)}`));
      }
    });
  return parcalar.join('. ') + '.';
}

// ---------- Arşiv listeleri (arayüz için) ----------
export function turListesi(k) {
  return TUR_SIRASI.map((tur) => ({ tur, t: TURLER[tur], kayit: k.arsiv.turler[tur] || null }));
}
export function taninanBireyler(k, tur) {
  const tum = [...k.hayvanlar, ...((k.disari && k.disari.hayvanlar) || []), ...((k.rehab || []).map((r) => r.b))];
  return tum.filter((b) => b.no > 0 && (!tur || b.tur === tur)).sort((a, b) => (a.tur === b.tur ? a.no - b.no : TUR_SIRASI.indexOf(a.tur) - TUR_SIRASI.indexOf(b.tur)));
}
export function davranisAdi(id) {
  return (DAVRANISLAR[id] || {}).ad || id;
}
export function sesTuruAdi(id) {
  return SES_TURLERI[id] || id;
}

// ---------- Kayıt ----------
export function kayitHazirla(k) {
  return JSON.parse(JSON.stringify(k));
}
export function kayittanYukle(v) {
  if (!v || typeof v !== 'object' || !v.ad || v.surum !== KAYIT_SURUMU) return null;
  const k = { ...arastirmaciOlustur(v.ad), ...v };
  k.arsiv = { turler: {}, bireyler: {}, fotolar: [], sesler: [], olaylar: [], ...(v.arsiv || {}) };
  if (!Array.isArray(k.lesler)) k.lesler = [];
  const bos = arastirmaciOlustur(v.ad);
  ['ekipman', 'stok', 'arastirmalar'].forEach((a) => {
    if (!k[a] || typeof k[a] !== 'object' || Array.isArray(k[a])) k[a] = bos[a];
  });
  if (!k.arsiv.bitkiler || typeof k.arsiv.bitkiler !== 'object') k.arsiv.bitkiler = {};
  if (!k.disari || !Array.isArray(k.disari.gruplar) || !Array.isArray(k.disari.hayvanlar)) k.disari = { gruplar: [], hayvanlar: [] };
  if (k.eko && typeof k.eko !== 'object') k.eko = null;
  ['tesisler', 'personel', 'teklifler', 'mesajlar', 'tuzaklar', 'gpsli', 'numuneKutusu', 'numuneler', 'rehab'].forEach((a) => {
    if (!Array.isArray(k[a])) k[a] = [];
  });
  if (typeof k.butce !== 'number') k.butce = bos.butce;
  if (!Array.isArray(k.gezilen)) k.gezilen = [];
  if (!Array.isArray(k.hayvanlar) || !Array.isArray(k.gruplar)) {
    k.hayvanlar = null;
    k.gruplar = null;
  }
  return k;
}
