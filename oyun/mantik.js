// ==== VAHŞİ YAŞAM: SAF OYUN MANTIĞI ====
// Arayüzden bağımsız: zaman, arazi, hayvan bireyleri ve sürüleri, günlük rutinler, av-avcı, doğum,
// oyuncuya tepki ve alışma, gözlem / fotoğraf / ses kaydı, arşiv, araç, yol bulma, sesli özetler.
// Kalıcı her şey araştırmacı nesnesinde (k) durur; d yalnızca o anki oturumun geçici durumunu tutar.
import {
  YARICAP, ISTASYON, ARAC_YERI, OYUN_DK_SN, BASLANGIC_SAATI, GOLET, NEHIR_YARI, nehirY, GECITLER, KAYALIK, MAGARA, YERLER,
  BOLGE_ADLARI, DAVRANISLAR, GALERI, TERMITLER, SES_TURLERI, TURLER, TUR_SIRASI, KISILIKLER, EVRELER, EKIPMAN, ARAC, ARACLAR, YURUME, TUZ_YALAGI, MINERAL_TURLERI, OZEL_BIREYLER } from './veri.js';
import * as E from './ekosistem.js';
import { UZAK_ALANLAR } from './kucukler.js';

export const KAYIT_SURUMU = 1;
const LOD_UZAKLIK = 130; // bu uzaklığın ötesindeki gruplar seyrek güncellenir
const LOD_ARALIK = 0.3; // saniye

// ---------- Zorluk (karar 33): keşif, ekonomi, hayvan davranışı/tehlike, araştırma ve afetler ayrı ayrı ----------
export const ZORLUK_ALANLARI = {
  kesif: { ad: 'Keşif', tarif: 'Kolayda dürbünle daha uzağı görür, küçük canlıları daha kolay bulursun.' },
  tehlike: { ad: 'Hayvan davranışı ve tehlike', tarif: 'Kolayda hayvanlar daha az ürker, tehlikeli hayvanlar yalnızca uyarır, hamle yapmaz.' },
  ekonomi: { ad: 'Ekonomi', tarif: 'Kolayda giderler azalır, kurumların desteği artar.' },
  arastirma: { ad: 'Araştırma', tarif: 'Kolayda analizler daha kısa sürer.' },
  afet: { ad: 'Afetler', tarif: 'Yangın, sel, salgın ve kaçak avcı tuzakları. Kolayda çok seyrek, zorda daha sık.' },
};
export const ZORLUK_ADI = { kolay: 'kolay', normal: 'normal', zor: 'zor' };
export const zorluk = (k, alan) => {
  const z = k && k.zorluk && typeof k.zorluk === 'object' ? k.zorluk[alan] : null;
  return z === 'kolay' || z === 'zor' ? z : 'normal';
};
// [kolay, normal, zor] değerlerinden seçer
export const zorlukCarpani = (k, alan, degerler) => degerler[['kolay', 'normal', 'zor'].indexOf(zorluk(k, alan))];
if (GOLET.su === undefined) GOLET.su = GOLET.r; // göletin o anki su yarıçapı (ekosistem.goletAyarla günceller)

// Konuşmada kullanılan kısa tür adları
export const SOZ = {
  aslan: 'Aslan', leopar: 'Leopar', sirtlan: 'Sırtlan', fil: 'Fil', zurafa: 'Zürafa', zebra: 'Zebra', ceylan: 'Ceylan',
  domuz: 'Yaban domuzu', suAygiri: 'Su aygırı', timsah: 'Timsah', gergedan: 'Gergedan', kartal: 'Balık kartalı', piton: 'Piton', manda: 'Manda',
  gnu: 'Gnu', cita: 'Çita', impala: 'İmpala', yabanKopegi: 'Yaban köpeği', babun: 'Babun',
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
  return Math.round(durbunTaban(dk, k) * (k && k.eko ? E.gorusCarpani(k.eko) : 1) * zorlukCarpani(k, 'kesif', [1.25, 1, 0.85]));
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
let taskinVar = false; // nehir taştığında geçitler geçilmez (Aşama 6, sel)
export const gecitteMi = (x) => !taskinVar && GECITLER.some((g) => Math.abs(x - g.x) < g.yari);
export const guneydeMi = (x, y) => y < nehirY(x);
export const golettemi = (x, y, pay = 0) => GOLET.su > 0 && Math.hypot(x - GOLET.x, y - GOLET.y) < GOLET.su + pay;
const goletCanagi = (x, y, pay = 0) => Math.hypot(x - GOLET.x, y - GOLET.y) < GOLET.r + pay;
export function bolgeBul(x, y) {
  if (Math.hypot(x - ISTASYON.x, y - ISTASYON.y) < ISTASYON.r + 2) return 'istasyon';
  if (Math.hypot(x - GOLET.x, y - GOLET.y) < GOLET.r + 14) return 'golet';
  if (Math.abs(y - nehirY(x)) < 16) return 'nehir';
  if (guneydeMi(x, y)) return 'sulak';
  if (Math.hypot(x - KAYALIK.x, y - KAYALIK.y) < KAYALIK.r + 6) return 'kayalik';
  if (x > GALERI.x0 && x < GALERI.x1 && y - nehirY(x) < GALERI.derinlik && y > nehirY(x)) return 'galeri';
  if (Math.hypot(x - TERMITLER.x, y - TERMITLER.y) < TERMITLER.r) return 'termit';
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
    // Aşama 6
    kacak: { tuzaklar: [], bulunan: 0, kurtarilan: 0, olen: 0, izler: 0 },
    koruma: { projeler: {}, devriye: false, asi: false },
    asili: [],
    magara: null,
    zorluk: { kesif: 'normal', tehlike: 'normal', ekonomi: 'normal', arastirma: 'normal', afet: 'normal' },
    egitimV: 2,
    ...asama8Alanlari(),
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
    // Aşama 8 genetik (karar 39): baba DNA ile doğrulanır; h = genetik çeşitlilik (heterozigotluk), tasiyici = kalıtsal hastalık geni
    baba: null,
    gen: { h: 0.55 + rng() * 0.3, tasiyici: rng() < 0.06, ton: Math.round((rng() * 2 - 1) * 0.8 * 100) / 100 },
    dna: false,
    kalitsal: null,
  };
  const yay = TURLER[tur].grup[1] > 2 ? 3 + TURLER[tur].grup[1] * 0.7 : 2.5;
  b.ofs = { x: arasi(rng, -yay, yay), y: arasi(rng, -yay, yay) };
  return b;
}

function nufusOlustur(k) {
  const rng = tohumluUretec(4242);
  k.hayvanlar = [];
  k.gruplar = [];
  TUR_SIRASI.forEach((tur) => turGrubuKur(k, rng, tur));
}
// Bir türün grubunu habitatında kurar (yeni oyun ya da eski kayda sonradan eklenen türler)
function turGrubuKur(k, rng, tur) {
  const gid = Math.max(0, ...k.gruplar.map((g) => g.id), ...((k.disari && k.disari.gruplar) || []).map((g) => g.id)) + 1;
  {
    const t = TURLER[tur];
    const h = t.habitat;
    // İlk sabah zebralar ve filler gölete su içmeye gelir (ilk görev oradadır)
    const susuz = tur === 'zebra' || tur === 'fil' ? 0.8 : rng() * 0.5;
    const g = { id: gid, tur, x: h.x, y: h.y, plan: null, planBitis: 0, hedef: null, susuzluk: susuz, aclik: rng() * 0.6, alarm: 0, kaynak: null, av: null };
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
  }
}

// ---------- Dünya ----------
// Aşama 8 alanları (tekne, kamp, drone, harita bilgisi, bölge hâkimiyeti)
export function asama8Alanlari() {
  return {
    teknede: false,
    tekne: { x: 22, y: nehirY(22) + 1.5, yon: Math.PI / 2 },
    kamp: null,
    drone: { sarj: 3, ucus: 0 },
    aracTuru: 'arazi',
    harita: { gruplar: {} },
    hakimiyet: { bolgeler: {}, varlik: {}, gun: 0, gecmis: [] },
  };
}
function asama8Onar(k) {
  const v = asama8Alanlari();
  if (typeof k.teknede !== 'boolean') k.teknede = false;
  if (!k.tekne || !sayiMi(k.tekne.x) || !sayiMi(k.tekne.y)) k.tekne = v.tekne;
  if (k.teknede && !nehirdeMi(k.oyuncu.x, k.oyuncu.y)) k.teknede = false;
  if (k.kamp && (!sayiMi(k.kamp.x) || !sayiMi(k.kamp.y))) k.kamp = null;
  if (k.kamp === undefined) k.kamp = null;
  if (!k.drone || !sayiMi(k.drone.sarj)) k.drone = v.drone;
  if (!ARACLAR[k.aracTuru] || (k.aracTuru !== 'arazi' && !(k.ekipman && k.ekipman[k.aracTuru]))) k.aracTuru = 'arazi'; // Aşama 18
  if (!k.harita || typeof k.harita.gruplar !== 'object' || !k.harita.gruplar) k.harita = v.harita;
  if (!k.hakimiyet || typeof k.hakimiyet.bolgeler !== 'object' || !k.hakimiyet.bolgeler || !Array.isArray(k.hakimiyet.gecmis)) k.hakimiyet = v.hakimiyet;
  if (!k.hakimiyet.varlik || typeof k.hakimiyet.varlik !== 'object') k.hakimiyet.varlik = {};
  // Bozuk harita ve hâkimiyet kayıtları atılır
  Object.keys(k.harita.gruplar).forEach((id) => {
    const x = k.harita.gruplar[id];
    if (!x || !TURLER[x.tur] || !sayiMi(x.x) || !sayiMi(x.y) || !sayiMi(x.dk) || !sayiMi(x.sayi) || typeof x.kaynak !== 'string') delete k.harita.gruplar[id];
  });
  Object.keys(k.hakimiyet.bolgeler).forEach((b) => {
    if (!TURLER[k.hakimiyet.bolgeler[b]]) delete k.hakimiyet.bolgeler[b];
  });
  Object.keys(k.hakimiyet.varlik).forEach((b) => {
    const v = k.hakimiyet.varlik[b];
    if (!v || typeof v !== 'object') return void delete k.hakimiyet.varlik[b];
    Object.keys(v).forEach((t) => {
      if (!TURLER[t] || !sayiMi(v[t])) delete v[t];
    });
  });
  k.hakimiyet.gecmis = k.hakimiyet.gecmis.filter((x) => x && sayiMi(x.gun) && BOLGE_ADLARI[x.bolge] && TURLER[x.yeni]);
  if (!sayiMi(k.hakimiyet.gun)) k.hakimiyet.gun = 0;
  if (!sayiMi(k.drone.ucus)) k.drone.ucus = 0;
  k.drone.sarj = Math.max(0, Math.min(3, Math.round(k.drone.sarj)));
  if (!k.tekne || !sayiMi(k.tekne.yon)) k.tekne = { ...k.tekne, yon: Math.PI / 2 };
  if (k.kamp && typeof k.kamp.bolge !== 'string') k.kamp.bolge = bolgeAdi(k.kamp.x, k.kamp.y);
  const genVer = (b) => {
    if (!b || typeof b !== 'object') return;
    if (!b.gen || !sayiMi(b.gen.h)) b.gen = { h: 0.6 + ((b.id * 37) % 25) / 100, tasiyici: (b.id * 13) % 17 === 0 };
    if (!sayiMi(b.gen.ton)) b.gen.ton = Math.round((((b.id * 53) % 161) / 100 - 0.8) * 100) / 100; // Aşama 19: görünüş geni (eski kayıtlarda kimlikten)
    if (b.stres !== undefined && !sayiMi(b.stres)) b.stres = 0;
    if (b.baba === undefined) b.baba = null;
    if (b.korku !== undefined && !sayiMi(b.korku)) b.korku = 0;
    if (b.aracAlisma !== undefined && !sayiMi(b.aracAlisma)) b.aracAlisma = 0;
  };
  (k.gruplar || []).forEach((g) => {
    if (g && g.tehlikeYerleri && !Array.isArray(g.tehlikeYerleri)) g.tehlikeYerleri = [];
    if (g && Array.isArray(g.tehlikeYerleri)) g.tehlikeYerleri = g.tehlikeYerleri.filter((y) => y && sayiMi(y.x) && sayiMi(y.y) && sayiMi(y.dk));
    if (g && g.iz !== undefined) g.iz = Array.isArray(g.iz) ? g.iz.filter((p) => p && sayiMi(p.x) && sayiMi(p.y) && sayiMi(p.dk)) : [];
  });
  (k.hayvanlar || []).forEach(genVer);
  ((k.disari && k.disari.hayvanlar) || []).forEach(genVer);
  ((k.rehab || []).map((r) => r && r.b) || []).forEach(genVer);
}

// ---------- Yuvalar ve inler (Aşama 9, karar 93, 105, 110): gizlidir, izle, GPS ya da dronla bulunur ----------
export const YUVA_TURLERI = {
  sirtlan: { ad: 'Sırtlan ini', tarif: 'Eski bir termit tepesinin altına kazılmış, birkaç girişli bir in. Yavrular girişlerin önünde oynar; yetişkinler avdan buraya döner.' },
  yabanKopegi: { ad: 'Yaban köpeği ini', tarif: 'Terk edilmiş bir yerdomuzu yuvasını genişletip kullandıkları in. Yavru dönemi boyunca sürü buraya bağlıdır; avdan dönenler yavrulara yiyecek kusarak getirir.' },
  leopar: { ad: 'Leoparın avını sakladığı ağaç', tarif: 'Kalın dallı yalnız bir ağaç. Leopar avını sırtlan ve aslanlardan korumak için dişleriyle buraya taşır; dallarda kemik artıkları var.' },
  aslan: { ad: 'Aslanların yavru sığınağı', tarif: 'Kayaların arasında gizli, gölgeli bir kovuk. Dişi aslanlar yeni doğan yavrularını ilk haftalarda burada saklar.' },
  kartal: { ad: 'Balık kartalı yuvası', tarif: 'Nehre bakan yüksek bir ağacın tepesinde, dallardan örülmüş büyük bir yuva. Çift her yıl aynı yuvaya döner ve onu büyütür.' },
  timsah: { ad: 'Timsah yuvası', tarif: 'Nehir kıyısında kuma gömülmüş yumurtalar. Dişi yuvanın yakınında bekler; yavrular çıkınca onları ağzında suya taşır.' },
  babun: { ad: 'Babunların uyku ağaçları', tarif: 'Galeri ormanında birkaç yüksek ağaç. Babun sürüsü her akşam leoparlardan korunmak için buraya tırmanır.' },
};
function yuvalariKur(k) {
  const rng = tohumluUretec(31337);
  k.yuvalar = [];
  Object.keys(YUVA_TURLERI).forEach((tur) => {
    const t = TURLER[tur];
    if (!t) return;
    const h = t.habitat;
    let p = null;
    for (let i = 0; i < 60 && !p; i++) {
      let x = h.x + arasi(rng, -h.r * 0.5, h.r * 0.5);
      let y = h.nehirde ? nehirY(x) + (rng() < 0.5 ? 7 : -7) : h.y + arasi(rng, -h.r * 0.5, h.r * 0.5);
      if (tur === 'sirtlan' || tur === 'yabanKopegi') {
        x = TERMITLER.x + arasi(rng, -TERMITLER.r * 0.7, TERMITLER.r * 0.7);
        y = TERMITLER.y + arasi(rng, -TERMITLER.r * 0.7, TERMITLER.r * 0.7);
      }
      if (Math.hypot(x, y) > YARICAP - 15 || nehirdeMi(x, y) || goletCanagi(x, y, 3) || Math.hypot(x - ISTASYON.x, y - ISTASYON.y) < 50) continue;
      p = { x: Math.round(x), y: Math.round(y) };
    }
    if (p) k.yuvalar.push({ id: 'yuva-' + tur, tur, x: p.x, y: p.y, bulundu: false, bulunmaDk: 0, nasil: null });
  });
}

// Aşama 14 (karar 100): her özel birey bir kez, uygun bir canlı bireye atanır (öldüyse yenisi gelmez)
function ozelBireyleriAta(k) {
  if (!k.ozelBireyler || typeof k.ozelBireyler !== 'object' || Array.isArray(k.ozelBireyler)) k.ozelBireyler = {};
  const rng = tohumluUretec(9091 + (k.hayvanlar || []).length);
  for (const [id, o] of Object.entries(OZEL_BIREYLER)) {
    if (k.ozelBireyler[id] !== undefined) continue;
    const adaylar = k.hayvanlar.filter((b) => !b.olu && b.tur === o.tur && !b.ozellik && (b.evre === 'yetiskin' || b.evre === 'yasli') && (!o.cinsiyet || b.cinsiyet === o.cinsiyet));
    const tercih = o.evre ? adaylar.filter((b) => b.evre === o.evre) : [];
    const l = tercih.length ? tercih : adaylar;
    if (!l.length) continue;
    const b = l[Math.floor(rng() * l.length)];
    b.ozellik = id;
    k.ozelBireyler[id] = b.id;
  }
  for (const b of k.hayvanlar) if (b.ozellik && !OZEL_BIREYLER[b.ozellik]) delete b.ozellik;
}

// Oturum saatine (d.zaman, her açılışta 0'dan başlar) bağlı alanlar kayıtta kalırsa yeniden açılışta bayatlar:
// eski oturumdan b.kosu = 5000 gibi bir değer, yeni oturumda saatlerce "koşuyor" sayılıp koşu sesi durmadan çalıyordu
// (Murat, 13 Kasım: nehir tarafında hiç durmayan su/adım sesi). Kısa süreli davranışlar ve meydan kavgası da sıfırlanır.
function oturumZamanlariniSifirla(k) {
  for (const b of k.hayvanlar || []) {
    if (!b) continue;
    delete b.kosu;
    delete b.uyardi;
    delete b.sakin;
    delete b.tehdit;
    delete b.ozel;
  }
  for (const g of k.gruplar || []) if (g && g.meydan && g.meydan.evre === 'kavga') g.meydan = null;
  for (const g of k.gruplar || []) if (g && g.suBekle) g.suBekle = 0; // Aşama 18: oturum saatine bağlı
}
export function dunyaOlustur(k) {
  const rng = tohumluUretec(77); // arazi sabittir: her açılışta aynı
  if (!k.hayvanlar || !k.gruplar) nufusOlustur(k);
  asama8Onar(k);
  oturumZamanlariniSifirla(k);
  ozelBireyleriAta(k);
  if (!Array.isArray(k.yuvalar) || k.yuvalar.some((y) => !y || !TURLER[y.tur] || !sayiMi(y.x) || !sayiMi(y.y))) yuvalariKur(k);
  k.yuvalar.forEach((y) => {
    y.bulundu = y.bulundu === true;
    if (!sayiMi(y.bulunmaDk)) y.bulunmaDk = 0;
  });
  if (!k.arsiv || typeof k.arsiv !== 'object') k.arsiv = {};
  if (!Array.isArray(k.arsiv.videolar)) k.arsiv.videolar = [];
  k.arsiv.videolar = k.arsiv.videolar.filter((v) => v && TURLER[v.tur] && Array.isArray(v.davranislar) && sayiMi(v.dk) && sayiMi(v.sure));
  // Sonradan eklenen türler (Aşama 6) eski kayıtlara da yerleşir
  TUR_SIRASI.forEach((tur) => {
    if (!k.gruplar.some((g) => g.tur === tur) && !((k.disari && k.disari.gruplar) || []).some((g) => g.tur === tur)) turGrubuKur(k, tohumluUretec(900 + TUR_SIRASI.indexOf(tur)), tur);
  });
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
  // Galeri ormanı: nehrin doğu kıyısında sık ağaç şeridi (Aşama 6)
  yerlestir(70, () => {
    const x = arasi(rng, GALERI.x0 + 2, GALERI.x1 - 4);
    return [x, nehirY(x) + arasi(rng, 9, GALERI.derinlik)];
  }, 'agac', 0.45, 0.6, { agacTur: 'kiyi' });
  // Termit tepeleri (geçilmez; küçük canlıların yuvası)
  yerlestir(16, () => {
    const a = rng() * Math.PI * 2;
    const r = Math.sqrt(rng()) * TERMITLER.r;
    return [TERMITLER.x + Math.sin(a) * r, TERMITLER.y + Math.cos(a) * r];
  }, 'termit', 0.9, 1.6);
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
  // Ekteki hayvan türü olayın türünü ezmesin (eskiden 'yeniTur' ve 'goc' olayları hayvan adına dönüşüp sessiz kalıyordu)
  const { tur: hayvanTur, ...geri } = ek || {};
  d.olaylar.push({ ...geri, ...(hayvanTur ? { hayvanTur } : {}), tur, metin, oncelik, zaman: d.zaman });
}
// Eylem sesleri (dürbün, deklanşör, numune şişesi...): App her karede çalar, konuşma beklemez
// konum verilirse ses o noktadan 3B duyulur (duyma metre içinde)
export function efekt(d, ad, duzey = 0.8, konum = null, duyma = 60) {
  if (d.dinleniyor) return;
  const q = (d.efektKuyruk = d.efektKuyruk || []);
  if (q.length < 20) q.push(konum ? { ad, duzey, x: konum.x, y: konum.y, duyma } : { ad, duzey });
}
// Alarm sesi veren otçullar (Ses efektleri genişlemesi): impala ve ceylan havlar gibi homurdanır, zebra ve gnu kişner
const ALARM_SESI = { impala: 'h_alarm_impala', ceylan: 'h_alarm_impala', zebra: 'h_alarm_zebra', gnu: 'h_alarm_zebra' };
export function efektleriAl(d) {
  const l = d.efektKuyruk || [];
  d.efektKuyruk = [];
  return l;
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
  // Aşama 15 (karar 72): sürünün alıştığı su başı, çok uzak değilse yeğlenir
  const gm = mesafe(g, golet);
  const nm = mesafe(g, nehir);
  if (g.rutin && g.rutin.su === 'nehir' && nm < gm * 1.7) return nehir;
  if (g.rutin && g.rutin.su === 'golet' && gm < nm * 1.7) return golet;
  return gm < nm ? golet : nehir;
}
// Aşama 15 (karar 72): her sürünün kendi alışkanlıkları: su başı, su saati, gölgede dinlendiği ağaç
const SU_SAATLERI = { sabah: [6.5, 10], oglen: [11, 15], aksam: [16, 19.5] };
export const SU_SAATI_ADI = { sabah: 'sabahları', oglen: 'öğle saatlerinde', aksam: 'akşamüstü' };
function rutinKur(d, g) {
  const t = TURLER[g.tur];
  const h = (n) => {
    const x = Math.sin((g.id + 1) * 91.7 + n * 13.3) * 43758.5;
    return x - Math.floor(x);
  };
  const r = { su: h(1) < 0.5 ? 'golet' : 'nehir', suSaat: ['sabah', 'oglen', 'aksam'][Math.floor(h(2) * 3)], agac: null };
  const merkez = t.habitat || g;
  const agac = (d.engeller || []).filter((e) => e.tur === 'agac' && Math.hypot(e.x - merkez.x, e.y - merkez.y) < (merkez.r || 60) * 0.9 && uygunMu(g.tur, e.x + 2.5, e.y + 2.5, t.habitat));
  if (agac.length) {
    const a = agac[Math.floor(h(3) * agac.length)];
    r.agac = { x: Math.round(a.x + 2.5), y: Math.round(a.y + 2.5) };
  }
  g.rutin = r;
}
function planSec(d, g) {
  const k = d.k;
  const t = TURLER[g.tur];
  const dk = k.dk;
  if (!g.rutin || typeof g.rutin !== 'object' || !SU_SAATLERI[g.rutin.suSaat] || (g.rutin.agac && !(Number.isFinite(g.rutin.agac.x) && Number.isFinite(g.rutin.agac.y)))) rutinKur(d, g);
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
    // Uyku ve dinlenme yeri: türün ini, yuvası ya da uyku ağaçları (Aşama 9, karar 105 ve 110)
    const yv = (k.yuvalar || []).find((y) => y.tur === g.tur);
    if (yv && mesafe(yv, g) < 140) g.hedef = { x: yv.x + arasi(d.rng, -3, 3), y: yv.y + arasi(d.rng, -3, 3) };
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
  // Mineral ihtiyacı (karar 103): otçul sürüler birkaç günde bir tuz yalağına gider
  if (MINERAL_TURLERI.includes(g.tur) && (g.mineral || 0) > 0.75 && !g.goc && r < 0.6) {
    g.plan = 'gez';
    g.yalak = true;
    g.hedef = { x: TUZ_YALAGI.x + arasi(d.rng, -4, 4), y: TUZ_YALAGI.y + arasi(d.rng, -4, 4) };
    g.planBitis = sure(90, 140);
    return;
  }
  const saatNow = gunDakikasi(dk) / 60;
  const suSaati = SU_SAATLERI[g.rutin.suSaat];
  const suEsik = saatNow >= suSaati[0] && saatNow < suSaati[1] ? 0.42 : 0.62;
  if (!t.suYok && !['leopar', 'piton', 'kartal'].includes(g.tur) && g.susuzluk > suEsik) {
    g.plan = 'su';
    g.hedef = suNoktasi(g);
    g.planBitis = sure(70, 110);
    g.icti = false;
    g.suBekle = 0;
    g.suDegisti = false;
    return;
  }
  const evreSimdi = gunEvresi(dk);
  const avZamani = t.gunduzAvcisi
    ? evreSimdi === 'gunduz'
    : t.alacaAvcisi
      ? evreSimdi === 'safak' || evreSimdi === 'aksam' || g.aclik > 0.85
      : evreSimdi !== 'gunduz' || g.tur === 'leopar' || g.aclik > 0.9;
  if (t.yirtici && g.aclik > 0.55 && avZamani) {
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
  // Sıcak günün öğlesinde otçullar alıştıkları gölgeye çekilir (hava rutini etkiler)
  if (!t.yirtici && k.eko && k.eko.hava && (k.eko.hava.tur === 'sicak' || k.eko.hava.sicaklik >= 33) && saatNow >= 12 && saatNow < 15.5 && g.rutin.agac && mesafe(g.rutin.agac, g) < 110 && d.rng() < 0.6) {
    g.plan = 'dinlen';
    g.hedef = { ...g.rutin.agac };
    g.planBitis = sure(50, 90);
    return;
  }
  const r2 = d.rng();
  const besinDegeri = (p) => (!k.eko ? 1 : t.yeme === 'yapraklaBesleniyor' ? E.yaprakDegeri(k.eko, p.x, p.y) : E.otDegeri(k.eko, p.x, p.y));
  // Sürü hafızası (karar 47): yakın zamanda avlanılan yerler kaçınılır
  const tehlike = (p) => (g.tehlikeYerleri || []).some((y) => k.dk - y.dk < 2 * 1440 && Math.hypot(p.x - y.x, p.y - y.y) < 30);
  const enGur = (uret, n) => {
    let en = null;
    for (let i = 0; i < n; i++) {
      const p = uret();
      const deger = (q) => besinDegeri(q) - (tehlike(q) ? 0.6 : 0);
      if (!en || deger(p) > deger(en)) en = p;
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
    // Gölgede dinlen: alıştığı ağaç (yakınsa), yoksa en yakın ağaç
    const fav = g.rutin && g.rutin.agac;
    const agac = d.engeller.filter((e) => e.tur === 'agac' && mesafe(e, g) < 40).sort((a, b) => mesafe(a, g) - mesafe(b, g))[0];
    if (fav && mesafe(fav, g) < 110 && d.rng() < 0.7) g.hedef = { x: fav.x, y: fav.y };
    else if (agac && uygunMu(g.tur, agac.x + 2.5, agac.y + 2.5, t.habitat)) g.hedef = { x: agac.x + 2.5, y: agac.y + 2.5 };
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
  if (d.k.aracta) m *= d.aracHiz > 4 ? aracOzellik(d.k).kacisHizli : aracOzellik(d.k).kacis; // araç içindeki insanı daha az tehdit sayarlar (açık araçlarda daha çok)
  else if (d.k.teknede) m *= 0.55; // sessiz kürekli tekne
  else if (d.k.kamp && !d.k.kamp.hasarli && mesafe(d.oyuncu, d.k.kamp) < 10) m *= 0.6; // kamptaki gözlem çadırı saklar
  if (geceMi(d.k.dk)) m *= 0.8;
  if (b.evre === 'yavru') m *= 1.2;
  m *= duyuCarpani(d, b);
  if (b.korku) m *= 1 + 0.6 * b.korku; // öğrenilmiş korku (karar 109)
  if (b.stres) m *= 1 + 0.25 * b.stres; // Aşama 19: stresli hayvan daha tetikte
  if (d.k.aracta && b.aracAlisma) m *= 1 - 0.4 * b.aracAlisma; // araçları tanır (karar 47)
  m *= zorlukCarpani(d.k, 'tehlike', [0.7, 1, 1.2]);
  return Math.max(4, m);
}
// ---------- Duyular (Aşama 9, karar 71) ----------
// Türlerin koku, görme ve işitme duyarlılığı (1 ortalama)
export const DUYULAR = {
  aslan: { koku: 1.1, gorme: 1.1, isitme: 1.2 }, leopar: { koku: 1, gorme: 1.2, isitme: 1.3 }, sirtlan: { koku: 1.5, gorme: 0.9, isitme: 1.3 },
  fil: { koku: 1.6, gorme: 0.6, isitme: 1.3 }, zurafa: { koku: 0.8, gorme: 1.6, isitme: 1 }, zebra: { koku: 1, gorme: 1.1, isitme: 1.2 },
  ceylan: { koku: 1, gorme: 1.2, isitme: 1.2 }, domuz: { koku: 1.4, gorme: 0.7, isitme: 1.1 }, suAygiri: { koku: 1, gorme: 0.8, isitme: 1 },
  timsah: { koku: 0.7, gorme: 1, isitme: 1.1 }, gergedan: { koku: 1.6, gorme: 0.4, isitme: 1.3 }, manda: { koku: 1.3, gorme: 0.8, isitme: 1.1 },
  gnu: { koku: 1.1, gorme: 1, isitme: 1.1 }, cita: { koku: 0.8, gorme: 1.4, isitme: 1 }, impala: { koku: 1.1, gorme: 1.1, isitme: 1.3 },
  yabanKopegi: { koku: 1.4, gorme: 1, isitme: 1.3 }, babun: { koku: 0.8, gorme: 1.4, isitme: 1.1 },
};
// Rüzgâr: oyuncu hayvanın rüzgâr üstündeyse koku ona taşınır. Döndürür -1 (rüzgâr altındasın, iyi) .. 1 (kokun ona gidiyor)
export function ruzgarDurumu(d, b) {
  const h = d.k.eko && d.k.eko.hava;
  if (!h || !(h.ruzgarHiz > 0.3)) return 0;
  const esme = h.ruzgarYon + Math.PI; // rüzgârın gittiği yön
  return Math.cos(yonAcisi(d.oyuncu, b) - esme);
}
// Gözlem ve yaklaşmada rüzgâr tavsiyesi (koku duyusu güçlü türler için önemli)
export function ruzgarUyarisi(d, b) {
  const r = ruzgarDurumu(d, b);
  const du = DUYULAR[b.tur];
  if (!du || d.k.aracta) return '';
  if (r > 0.4) return ` Dikkat: rüzgâr arkandan esiyor, kokunu ona taşıyor${du.koku >= 1.3 ? '; koku duyusu çok güçlü, uzaktan fark eder' : ''}. Rüzgâr yüzüne gelecek biçimde yandan dolaşırsan daha yakına sokulabilirsin.`;
  if (r < -0.4) return ' Rüzgâr ondan sana doğru esiyor; kokunu alamaz, bu iyi.';
  return '';
}
function duyuCarpani(d, b) {
  const du = DUYULAR[b.tur];
  if (!du || d.k.aracta) return 1;
  const h = d.k.eko && d.k.eko.hava;
  let c = 1;
  const r = ruzgarDurumu(d, b);
  if (r > 0.4) c *= 1 + 0.45 * r * Math.min(1.5, (h ? h.ruzgarHiz : 1) / 1.2) * (du.koku - 0.3);
  else if (r < -0.4) c *= 0.82;
  if (d.oyuncuHareketli) c *= 1 + 0.15 * (du.isitme - 0.5); // ayak sesi
  else c *= 0.92; // kıpırdamadan duran insan daha az fark edilir
  if (d.k.eko && !geceMi(d.k.dk) && E.otDegeri(d.k.eko, d.oyuncu.x, d.oyuncu.y) > 0.6) c *= 1 - 0.12 * du.gorme; // uzun ot gizler
  return sinirla(c, 0.6, 1.8);
}
function grupAlarm(d, g, kaynak, sure = 6, gecikme = 0, zincir = true) {
  if (g.alarm > 0.5 && g.kaynak && mesafe(g.kaynak, kaynak) < 3) return;
  if (ALARM_SESI[g.tur] && !(g.alarm > 0.5)) efekt(d, ALARM_SESI[g.tur], 0.9, g, 120);
  g.alarm = sure;
  g.alarmGecikme = gecikme;
  g.kaynak = { x: kaynak.x, y: kaynak.y };
  if (g.plan === 'av') {
    g.av = null;
    g.plan = 'dinlen';
    g.planBitis = d.k.dk + 30;
  }
  // Türler arası uyarı: otçulların alarm sesi yakındaki başka otçul sürüleri de kaçırır (karar 108)
  const t = TURLER[g.tur];
  if (zincir && !t.yirtici && !t.kus) {
    for (const g2 of d.k.gruplar) {
      if (g2 === g || g2.alarm > 0.5 || g2.goc || TURLER[g2.tur].yirtici || TURLER[g2.tur].kus || mesafe(g, g2) > 38) continue;
      grupAlarm(d, g2, kaynak, sure * 0.8, gecikme + 0.6 + d.rng() * 0.8, false);
      if (g2.tur !== g.tur && mesafe(d.oyuncu, g2) < durbunMenzili(d.k.dk, d.k) && d.zaman - (d.sonZincir || -99) > 40 && !d.k.magara) {
        d.sonZincir = d.zaman;
        olay(d, 'alarmZinciri', `${BuyukHarf(SOZ[g.tur])} sürüsünün alarm sesi üzerine ${kucuk(SOZ[g2.tur])} sürüsü de kaçıyor; türler birbirinin uyarısını anlıyor.`, 2, { id: (uyeler(d, g2)[0] || {}).id });
        if (!d.k.zincirGoruldu) {
          d.k.zincirGoruldu = true;
          itibarEkle(d, 3);
          arsivOlay(d, `Türler arası alarm iletişimi gözlendi: ${kucuk(SOZ[g.tur])} uyardı, ${kucuk(SOZ[g2.tur])} kaçtı.`);
        }
      }
    }
  }
}

// ---------- Av ve ölüm (karar 40, 46, 102) ----------
export const hayvanOldur = (d, b, neden) => hayvanOldu(d, b, neden, null);
export function rutinMetni(d, g) {
  if (!g || !g.rutin || !SU_SAATLERI[g.rutin.suSaat] || TURLER[g.tur].suYok || ['leopar', 'piton', 'kartal', 'timsah', 'suAygiri'].includes(g.tur)) return '';
  const r = g.rutin;
  let m = `Sürünün alışkanlığı: ${SU_SAATI_ADI[r.suSaat]} ${r.su === 'golet' ? 'gölete' : 'nehre'} su içmeye iner`;
  if (r.agac && Number.isFinite(r.agac.x) && Number.isFinite(r.agac.y)) m += `; dinlenmek için ${bolgeAdi(r.agac.x, r.agac.y).toLocaleLowerCase('tr-TR')} bölgesindeki belli bir ağacın gölgesini seçer, buradan ${saatSozu(saatYonu(d.oyuncu, r.agac))}, ${metreSozu(mesafe(d.oyuncu, r.agac))}`;
  return m + '.';
}
const YAS_TURLERI = ['fil', 'babun', 'zurafa'];
function hayvanOldu(d, b, neden, avci) {
  b.olu = true;
  b.olumNedeni = neden;
  b.olumDk = d.k.dk;
  const les = { id: d.k.sonrakiId++, x: b.x, y: b.y, tur: b.tur, bireyId: b.id, dk: d.k.dk, kalan: 1, neden, hastalik: b.hastalik ? b.hastalik.id : null };
  d.k.lesler.push(les);
  gecmisEkle(d.k, b, `Öldü: ${neden}`);
  // Av anı: avcının yakaladığı yerden boğuşma sesi
  if (avci) efekt(d, 'h_bogusma', 1, b, 110);
  // Yas (karar 68): fil, babun ve zürafa grubu ölenin başında toplanır
  if (YAS_TURLERI.includes(b.tur) && !/avlandı/.test(neden)) {
    const g = d.k.gruplar.find((x) => x.id === b.grup);
    const yakin = d.k.hayvanlar.filter((y) => !y.olu && y.grup === b.grup && mesafe(y, b) < 70);
    if (g && yakin.length) {
      g.hedef = { x: b.x, y: b.y };
      g.plan = 'dinlen';
      g.planBitis = d.k.dk + 90;
      g.yas = { id: b.id, bitis: d.k.dk + 90 };
      yakin.forEach((y) => {
        y.ozel = { davranis: 'yasTutuyor', bitis: d.zaman + 140 };
        gecmisEkle(d.k, y, `${taninmisMi(b) ? bireyAdi(b) : 'Grubundan bir hayvan'} öldü; başında bekledi`);
      });
      if (mesafe(d.oyuncu, b) <= durbunMenzili(d.k.dk, d.k) + 20)
        olay(d, 'yas', `${BuyukHarf(SOZ[b.tur])} grubu ölen ${taninmisMi(b) ? bireyAdi(b) : 'üyesinin'} başında toplandı. ${b.tur === 'fil' ? 'Hortumlarıyla ona dokunuyor, ayaklarıyla kımıldatmaya çalışıyorlar.' : b.tur === 'babun' ? 'Yakınları sessizce yanında oturuyor, ara sıra tüylerine dokunuyor.' : 'Uzun süre başında, kıpırdamadan bekliyorlar.'} ${BuyukHarf(yerTarifi(d.oyuncu, b))}.`, 3, { id: yakin[0].id });
    }
  }
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

// Aşama 13: türlere göre av stratejisi (karar 102). sure: kovalamadan vazgeçme (sn), yardimci: kuşatmaya katılan yetişkin sayısı
export const AV_STRATEJI = {
  aslan: { ad: 'pusu ve ortak kuşatma', sure: 13, yardimci: 2 },
  leopar: { ad: 'tek başına sinsice yaklaşıp kısa atılış', sure: 8, yardimci: 0 },
  cita: { ad: 'yakına sokulup çok hızlı kısa koşu', sure: 8, yardimci: 0, hiz: 1.15 },
  yabanKopegi: { ad: 'sürüyle uzun soluklu takip', sure: 32, yardimci: 3 },
  sirtlan: { ad: 'grup hâlinde dayanıklı takip', sure: 24, yardimci: 2 },
  varsayilan: { ad: 'kovalama', sure: 13, yardimci: 0 },
};
// Grup savunması olasılığı (saniyede, temel): güçlü ve sürü hâlinde yaşayan otçullar ve babunlar
const GRUP_SAVUNMA = { manda: 0.14, fil: 0.3, babun: 0.1, zebra: 0.05, gnu: 0.04, zurafa: 0.05 };
function avciDeneyimi(g, tur, basari) {
  if (!g.avDeneyim || typeof g.avDeneyim !== 'object') g.avDeneyim = {};
  const x = (g.avDeneyim[tur] = Array.isArray(g.avDeneyim[tur]) && g.avDeneyim[tur].every(Number.isFinite) ? g.avDeneyim[tur] : [0, 0]);
  x[0] = Math.min(60, x[0] + 1);
  if (basari) x[1] = Math.min(x[0], x[1] + 1);
}

function avGuncelle(d, g, uyelerListe, dt) {
  const k = d.k;
  const t = TURLER[g.tur];
  if (!g.av) {
    // Av seç: zayıf olanları (yavru, yaşlı) yeğler
    let en = null;
    let enPuan = Infinity;
    // Av değiştirme: bölgede çok azalmış bir türü avlamazlar (yoğunluğa bağlı av seçimi)
    const sayi = {};
    k.hayvanlar.forEach((b) => !b.olu && (sayi[b.tur] = (sayi[b.tur] || 0) + 1));
    for (const b of k.hayvanlar) {
      if (b.olu || !t.avlar.includes(b.tur) || b.tuzakta || (sayi[b.tur] || 0) <= 4) continue;
      const m = mesafe(g, b);
      if (m > 170) continue;
      if (Math.hypot(b.x, b.y) < ISTASYON.r + 8) continue;
      // Aşama 13 (karar 102): grup hangi türde başarılıysa onu yeğler (av deneyimi)
      const dn = g.avDeneyim && Array.isArray(g.avDeneyim[b.tur]) ? g.avDeneyim[b.tur] : [0, 0];
      const oran = Number.isFinite(dn[0]) && Number.isFinite(dn[1]) ? (dn[1] + 1) / (dn[0] + 2) : 0.5;
      // Av değiştirme: azalmış türü daha az, kalabalık türü daha çok avlarlar (Aşama 15, denge)
      const puan = m * (b.evre === 'yavru' || b.evre === 'yasli' ? 0.6 : 1) * (b.tur === 'manda' ? 2.2 : 1) * (b.hastalik || b.kondisyon < 0.35 ? 0.55 : 1) * (1.15 - 0.3 * oran) * ((sayi[b.tur] || 0) < 8 ? 1.7 : (sayi[b.tur] || 0) > 14 ? 0.85 : 1);
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
      // Sürü hâlinde avlanma: türün stratejisine göre birkaç yetişkin yandan kuşatır
      const st = AV_STRATEJI[g.tur] || AV_STRATEJI.varsayilan;
      g.av.yardimcilar = yetiskin.filter((b) => b.id !== avci.id).slice(0, st.yardimci).map((b) => b.id);
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
  const st = AV_STRATEJI[g.tur] || AV_STRATEJI.varsayilan;
  const bec = (b) => (Number.isFinite(b.beceri) ? b.beceri : 0.4);
  const beceri = bec(avci);
  bireyYuru(d, avci, av.x, av.y, t.hiz * (st.hiz || 1) * (0.92 + 0.16 * beceri), dt);
  avci.davranis = 'kovaliyor';
  avci.kosu = d.zaman + 0.6;
  av.kosu = d.zaman + 0.6;
  // Yardımcılar avın önüne ve yanlarına koşar (kuşatma)
  let katil = avci;
  let m = mesafe(avci, av);
  (g.av.yardimcilar || []).forEach((id, i) => {
    const y = birey(d, id);
    if (!y || y.olu) return;
    const yan = i % 2 ? 1 : -1;
    const a = (av.yon || 0) + yan * 0.9;
    bireyYuru(d, y, av.x + Math.sin(a) * 6, av.y + Math.cos(a) * 6, t.hiz * 0.95, dt);
    y.davranis = 'kusatiyor';
    y.kosu = d.zaman + 0.6;
    const my = mesafe(y, av);
    if (my < m) {
      m = my;
      katil = y;
    }
  });
  // Grup savunması (karar 107): güçlü otçul sürüsünün yetişkinleri saldırgana karşı saf tutar; deneyimli sürü daha kararlı
  const avGrubu = k.gruplar.find((x) => x.id === av.grup);
  const sv = GRUP_SAVUNMA[av.tur];
  if (sv && avGrubu && !Number.isFinite(avGrubu.savunmaDeneyim)) avGrubu.savunmaDeneyim = 0;
  if (sv && avGrubu && (av.evre === 'yavru' || av.evre === 'genc' || av.tur === 'manda' || av.tur === 'fil')) {
    const savunanlar = k.hayvanlar.filter((b) => !b.olu && b.grup === av.grup && b.id !== av.id && (b.evre === 'yetiskin' || b.evre === 'yasli') && mesafe(b, av) < 22);
    if (savunanlar.length >= 2 && d.rng() < sv * (1 + (avGrubu.savunmaDeneyim || 0)) * dt) {
      savunanlar.slice(0, 4).forEach((b) => {
        b.ozel = { davranis: 'grupSavunmasi', bitis: d.zaman + 12 };
        b.kosu = d.zaman + 1;
      });
      avGrubu.savunmaDeneyim = Math.min(1, (avGrubu.savunmaDeneyim || 0) + 0.15);
      avciDeneyimi(g, av.tur, false);
      avci.beceri = Math.min(1, beceri + 0.01);
      if (!avci.hastalik && d.rng() < (av.tur === 'manda' || av.tur === 'fil' ? 0.2 : 0.05)) yaraVer(d, avci, `${kucuk(SOZ[av.tur])} sürüsünün savunmasında yaralandı`);
      g.av = null;
      g.plan = 'dinlen';
      g.planBitis = k.dk + arasi(d.rng, 40, 80);
      g.x = avci.x;
      g.y = avci.y;
      if (mesafe(d.oyuncu, av) <= durbunMenzili(k.dk, k)) {
        olay(d, 'grupSavunma', `${BuyukHarf(SOZ[av.tur])} sürüsü saf tuttu! Yetişkinler ${kucuk(SOZ[g.tur])} grubunun üstüne yürüdü, ${av.evre === 'yavru' ? 'yavru' : 'av'} kurtuldu. ${BuyukHarf(yerTarifi(d.oyuncu, av))}.`, 4, { id: savunanlar[0].id });
        arsivOlay(d, `Grup savunması: ${kucuk(SOZ[av.tur])} sürüsü ${kucuk(SOZ[g.tur])} saldırısını püskürttü.`);
      }
      return;
    }
  }
  if (m < (st.yakala || 1.6)) {
    avciDeneyimi(g, av.tur, true);
    katil.beceri = Math.min(1, bec(katil) + 0.05);
    (g.av.yardimcilar || []).forEach((id) => {
      const y = birey(d, id);
      if (y && y !== katil) y.beceri = Math.min(1, bec(y) + 0.03);
    });
    const les = hayvanOldu(d, av, `avlandı (${kucuk(SOZ[g.tur])})`, katil);
    const avg = k.gruplar.find((x) => x.id === av.grup);
    if (avg) tehlikeYeriEkle(k, avg, av);
    g.aclik = 0;
    g.plan = 'beslen';
    g.hedef = { x: av.x, y: av.y };
    g.lesId = les.id;
    g.planBitis = k.dk + 90;
    g.av = null;
    return;
  }
  if (g.av.t > st.sure || m > 55) {
    avciDeneyimi(g, av.tur, false);
    avci.beceri = Math.min(1, beceri + 0.02); // başarısız denemeden de öğrenir
    // Kaçan av ya da (manda gibi güçlü avlarda) avcı yaralanabilir (karar 28)
    if (!av.hastalik && d.rng() < 0.12) yaraVer(d, av, 'avcıdan kaçarken yaralandı');
    av.korku = Math.min(1, (av.korku || 0) + 0.5); // kurtulan av bir süre ürkek olur
    // Sürü hafızası: av alanı bir süre tehlikeli sayılır
    const avg = k.gruplar.find((x) => x.id === av.grup);
    if (avg) tehlikeYeriEkle(k, avg, av);
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
function tehlikeYeriEkle(k, g, p) {
  g.tehlikeYerleri = (g.tehlikeYerleri || []).filter((y) => k.dk - y.dk < 2 * 1440);
  g.tehlikeYerleri.push({ x: Math.round(p.x), y: Math.round(p.y), dk: k.dk });
  if (g.tehlikeYerleri.length > 4) g.tehlikeYerleri.shift();
}
// ---------- Genetik (Aşama 8, karar 39) ----------
// Ataları ve yol uzunluklarını bulur (en çok 4 kuşak)
function atalar(d, b, derinlik = 4, yol = 0, l = new Map()) {
  if (!b || yol > derinlik) return l;
  if (!l.has(b.id) || l.get(b.id) > yol) l.set(b.id, yol);
  if (b.anne) atalar(d, kayitliBirey(d, b.anne), derinlik, yol + 1, l);
  if (b.baba) atalar(d, kayitliBirey(d, b.baba), derinlik, yol + 1, l);
  return l;
}
// Wright akrabalık katsayısı: iki bireyin yavrusunun akrabalı yetişme katsayısı (0 akraba değil, 0,25 kardeş/ebeveyn)
export function akrabalik(d, a, b) {
  if (!a || !b) return 0;
  const A = atalar(d, a);
  const B = atalar(d, b);
  let f = 0;
  A.forEach((n1, id) => {
    if (B.has(id)) f += Math.pow(0.5, n1 + B.get(id) + 1);
  });
  return Math.min(0.5, f);
}
// Babayı seçer: grubun lideri ya da yetişkin bir erkek; yoksa bölgeden geçen tanınmayan bir erkek (null)
function babaSec(d, g, u, anne) {
  const erkekler = u.filter((b) => b.cinsiyet === 'erkek' && b.evre === 'yetiskin' && !b.olu && b.id !== anne.id);
  if (!erkekler.length) return null;
  const lider = g.lider && erkekler.find((b) => b.id === g.lider);
  if (lider && d.rng() < 0.75) return lider;
  return erkekler[Math.floor(d.rng() * erkekler.length)];
}
function kalitim(d, y, anne, baba) {
  const ag = anne.gen || { h: 0.7, tasiyici: false };
  const bg = baba ? baba.gen || { h: 0.7, tasiyici: false } : { h: 0.78, tasiyici: d.rng() < 0.05 };
  const f = baba ? akrabalik(d, anne, baba) : 0;
  y.baba = baba ? baba.id : null;
  y.akrabalik = Math.round(f * 1000) / 1000;
  const h = ((ag.h + bg.h) / 2) * (1 - f) + (d.rng() - 0.5) * 0.06;
  const geciA = ag.tasiyici && d.rng() < 0.5;
  const geciB = bg.tasiyici && d.rng() < 0.5;
  // Aşama 19 (karar 113): görünüş (renk tonu, yele, çizgi, diş) iki ebeveynin ortalaması + küçük sapma; kişilik çoğunlukla anneden
  const at = sayiMi(ag.ton) ? ag.ton : 0;
  const bt = baba && sayiMi(bg.ton) ? bg.ton : (d.rng() * 2 - 1) * 0.6;
  const ton = sinirla((at + bt) / 2 + (d.rng() - 0.5) * 0.5, -1, 1);
  y.gen = { h: sinirla(h, 0.1, 0.95), tasiyici: geciA || geciB, ton: Math.round(ton * 100) / 100 };
  const r = d.rng();
  if (r < 0.5 && anne.kisilik) y.kisilik = anne.kisilik;
  else if (r < 0.75 && baba && baba.kisilik) y.kisilik = baba.kisilik;
  y.kisilikKaynak = r < 0.5 ? 'anne' : r < 0.75 && baba ? 'baba' : null;
  if (geciA && geciB) {
    y.kalitsal = 'zayiflik';
    y.kondisyon = 0.5;
  }
  if (f >= 0.125) y.kondisyon = Math.max(0.3, y.kondisyon - 0.15); // akrabalı yetişme zayıf doğurur
}

// Doğum: gebeliğin sonunda (Aşama 21)
export const GEBE_GUN = { aslan: 3, leopar: 3, sirtlan: 3, cita: 3, yabanKopegi: 2, fil: 7, zurafa: 5, zebra: 4, gnu: 3, impala: 3, ceylan: 2, domuz: 2, suAygiri: 4, gergedan: 6, manda: 4, babun: 3 };
function dogumYap(d, g, anne, baba) {
  const k = d.k;
  const y = bireyOlustur(k, d.rng, g.tur, g, 'yavru', d.rng() < 0.5 ? 'erkek' : 'disi', anne.x + 0.8, anne.y + 0.8, anne.id);
  y.dogumDk = k.dk;
  y.yas = 0;
  y.kondisyon = 0.7;
  kalitim(d, y, anne, baba);
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
  return y;
}
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
        yeni.gen = { h: 0.72 + d.rng() * 0.18, tasiyici: d.rng() < 0.04 }; // başka popülasyondan gelen: çeşitliliği yüksek
        yeni.gocmen = true;
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
    // Aşama 21 (karar 20): gebelik. Doğum günü gelen gebe dişiler doğurur; çok zayıf düşen yavrusunu kaybeder.
    const bugun = gunNo(k.dk);
    for (const anne of u) {
      if (!anne.gebe) continue;
      if (anne.kondisyon < 0.2) {
        delete anne.gebe;
        gecmisEkle(k, anne, 'Gebeliği açlık yüzünden sona erdi');
        continue;
      }
      if (anne.gebe.dogum > bugun) continue;
      const baba = (anne.gebe.baba && birey(d, anne.gebe.baba)) || babaSec(d, g, u, anne);
      delete anne.gebe;
      dogumYap(d, g, anne, baba);
    }
    const anneler = u.filter((b) => b.cinsiyet === 'disi' && b.evre === 'yetiskin' && b.kondisyon > 0.35 && !b.hastalik && !b.gebe && !u.some((y) => y.anne === b.id && y.evre === 'yavru'));
    if (!anneler.length || u.length >= t.grup[1] + 3) continue;
    const kucukGrup = u.length < t.grup[1];
    // Otçullar çoğunlukla yağışlı mevsimde, otlar gürken gebe kalır ve doğurur (karar 43)
    const yagisli = E.takvim(gunNo(k.dk)).mevsim === 'yagisli';
    let sans = t.yirtici ? 0.1 : ['fil', 'gergedan', 'zurafa'].includes(g.tur) ? 0.06 : ['piton', 'timsah', 'kartal'].includes(g.tur) ? 0 : kucukGrup ? 0.5 : 0.3;
    if (!t.yirtici && !yagisli) sans *= 0.15;
    // Büyük otçul sürülerinde yağmurlarla birden çok dişi aynı günlerde gebe kalır (gnu, zebra, impala...)
    const kalabalik = !t.yirtici && t.grup[1] >= 8 && yagisli;
    const gebeSayisi = kalabalik ? anneler.filter(() => d.rng() < (kucukGrup ? 0.16 : 0.09)).length : d.rng() < sans ? 1 : 0;
    const anneSirasi = anneler.slice().sort(() => d.rng() - 0.5).slice(0, gebeSayisi);
    for (const anne of anneSirasi) {
      const baba = babaSec(d, g, u, anne);
      anne.gebe = { baba: baba ? baba.id : null, bas: bugun, dogum: bugun + (GEBE_GUN[g.tur] || 3) };
      // Kur davranışı günün bir saatinde görünür (ureme.js)
      g.kur = { disi: anne.id, erkek: baba ? baba.id : null, dk: k.dk + Math.floor(60 + d.rng() * 660) };
    }
  }
  // Korku zamanla söner (karar 109: psikolojik iyileşme); kişiliğe göre hızı değişir
  for (const b of k.hayvanlar) {
    if (!b.korku) continue;
    b.korku *= b.kisilik === 'cesur' ? 0.5 : b.kisilik === 'urkek' ? 0.8 : 0.65;
    if (b.korku < 0.03) b.korku = 0;
  }
  for (const g of k.gruplar) if (g.tehlikeYerleri) g.tehlikeYerleri = g.tehlikeYerleri.filter((y) => k.dk - y.dk < 2 * 1440);
  // Kalıtsal zayıflık: iki taşıyıcı ebeveynden gelen yavruların bir kısmı ilk haftalarda ölür (karar 39)
  for (const b of k.hayvanlar) {
    if (b.olu || b.kalitsal !== 'zayiflik' || b.evre !== 'yavru') continue;
    if (d.rng() < 0.05) hayvanOldu(d, b, 'doğuştan zayıflık (kalıtsal)');
  }
  // Eski leşler kaybolur
  k.lesler = k.lesler.filter((l) => k.dk - l.dk < 2 * 1440 && l.kalan > 0.05);
  // Ölü bireyler arşivde kalır; nüfus listesinden 5 gün sonra çıkar (tanınmışlar hep kalır)
  k.hayvanlar = k.hayvanlar.filter((b) => !b.olu || b.no > 0 || k.dk - b.olumDk < 5 * 1440);
  d.hayvanMap = new Map(k.hayvanlar.map((b) => [b.id, b]));
}

// ---------- Ekosistem: sağlık, yaşam döngüsü, göç (Aşama 5) ----------
// Yırtıcıların acıkma süresi (oyun dakikası): büyük av birkaç gün doyurur, timsah haftalarca aç kalabilir
const ACLIK_SURESI = { aslan: 4300, leopar: 7000, sirtlan: 3600, timsah: 12000, cita: 5000, yabanKopegi: 4500 };
// Otlayan bir bireyin saatlik tüketimi (zebra = 1)
const TUKETIM = { fil: 3, manda: 1.5, zebra: 1, ceylan: 0.4, domuz: 0.5, gergedan: 2, suAygiri: 2, zurafa: 1.5, gnu: 1.1, impala: 0.5, babun: 0.3 };

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
const AYRILAN_ERKEK = { aslan: true, zebra: true, fil: true, zurafa: true, manda: true, gnu: true, impala: true, babun: true };

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
    selBasladi: 'Sel! Sağanakla nehir taştı; iki geçit de sular altında kaldı. Sular çekilene kadar karşı kıyıya geçilemez.',
    selBitti: 'Nehrin suları çekildi, geçitler yeniden geçilebilir.',
    yanginBasladi: yanginMetni(d),
    yanginBitti: `Yangın söndü. ${k.eko.sonYangin ? `Yaklaşık ${Math.round(((k.eko.sonYangin.yanan || 1) * 625) / 1000) / 10} hektar alan yandı.` : ''} Yanan otlaklar ilk yağmurlarla taze sürgün verecek.`,
  }[e];
  if (!m) return;
  if (e === 'yanginBasladi') k.eko.yanginUyari = 0;
  const yagmurlu = e.startsWith('yagmur') || e === 'saganakBasladi';
  olay(d, 'hava', m, yagmurlu ? 2 : 3, { hava: e });
  if (!yagmurlu) {
    mesajEkle(k, `Ekosistem: ${m}`, 'ekosistem');
    arsivOlay(d, m);
  }
}

// ---------- Yangın etkisi (karar 23, 76): hayvanlar kaçar, oyuncu uyarılır ----------
function yanginMetni(d) {
  const k = d.k;
  const y = k.eko.sonYangin;
  if (!y) return 'Savanda yangın çıktı!';
  const c = E.hucreMerkezi(y.h);
  const r = k.eko.hava ? pusulaYonu(k.eko.hava.ruzgarYon) : '';
  return `Yangın! ${BuyukHarf(y.neden)}: ${bolgeAdi(c.x, c.y)} bölgesinde alevler yükseliyor, ${yerTarifi(d.oyuncu, c)}. Rüzgâr ${r} yönünden esiyor; yangın rüzgârın estiği yöne doğru yayılır.`;
}
export function yanginYakin(d) {
  const k = d.k;
  if (!k.eko || !k.eko.yanan) return null;
  let en = null;
  let enM = Infinity;
  for (const h of E.yananHucreler(k.eko)) {
    const c = E.hucreMerkezi(h);
    const m = mesafe(d.oyuncu, c);
    if (m < enM) {
      enM = m;
      en = c;
    }
  }
  return en ? { ...en, m: enM } : null;
}
function yanginEtkisi(d, dt) {
  const k = d.k;
  const yanan = E.yananHucreler(k.eko);
  if (!yanan.length) return;
  d.yanginKontrol = (d.yanginKontrol || 0) + dt;
  if (d.yanginKontrol < 1) return;
  d.yanginKontrol = 0;
  const merkezler = yanan.map((h) => E.hucreMerkezi(h));
  // Sürüler alevlerden kaçar
  for (const g of k.gruplar) {
    const t = TURLER[g.tur];
    if (t.kus || g.goc) continue;
    const c = merkezler.find((m) => Math.abs(m.x - g.x) < 40 && Math.abs(m.y - g.y) < 40);
    if (c && g.alarm <= 0.5) grupAlarm(d, g, c, 8);
  }
  // Alevin içinde kalan yavaş hayvanlar ölebilir
  for (const b of k.hayvanlar) {
    if (b.olu || TURLER[b.tur].kus || b.tuzakta) continue;
    if (!E.yangindaMi(k.eko, E.hucre(b.x, b.y))) continue;
    if ((b.evre === 'yavru' || b.evre === 'yasli' || b.hastalik) && d.rng() < 0.03) hayvanOldu(d, b, 'yangında öldü', null);
  }
  if (k.magara) return;
  // Oyuncu
  const y = yanginYakin(d);
  if (!y) return;
  if (y.m < 60) k.eko.yanginGoruldu = true;
  if (E.yangindaMi(k.eko, E.hucre(d.oyuncu.x, d.oyuncu.y))) {
    const a = yonAcisi(y, d.oyuncu);
    d.oyuncu.x += Math.sin(a) * 6;
    d.oyuncu.y += Math.cos(a) * 6;
    d.rota = null;
    olay(d, 'yangin', 'Alevlerin içindesin! Dumandan nefes alamıyorsun; hızla geri çekildin. Yangından uzak dur.', 5);
  } else if (y.m < 45 && d.zaman - (d.sonYanginUyari || -99) > 15) {
    d.sonYanginUyari = d.zaman;
    olay(d, 'yangin', `Dikkat, yangın yakın: ${yerTarifi(d.oyuncu, y)}. Alevlerin sesi ve duman geliyor.`, 4);
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
// Aşama 23 (karar 43, 111): göç yolu her seferinde seçilir. Sürü geçitleri uzaklığa, geçitte bekleyen timsahlara, çevredeki yangına
// ve önceki göçlerde o geçitte yaşadığı kayıplara (g.gocHafiza) göre değerlendirir; taşkındaki geçidi seçmez.
const GOC_CIKIS = { 70: { x: 124, y: -150, yon: 'güneydoğu' }, '-60': { x: -126, y: -148, yon: 'güneybatı' } };
export function gocGecitSec(d, g, donus = false) {
  const k = d.k;
  const gc = E.GOCMENLER[g.tur];
  const hafiza = g.gocHafiza && typeof g.gocHafiza === 'object' ? g.gocHafiza : {};
  let en = null;
  for (const gt of GECITLER) {
    const nokta = { x: gt.x, y: nehirY(gt.x) };
    const uzak = mesafe(g, nokta) / 120;
    const timsah = k.gruplar.filter((x) => x.tur === 'timsah' && mesafe(x, nokta) < 40).reduce((s, x) => s + uyeler(d, x).length, 0) * 0.12;
    const yangin = k.eko ? E.yananHucreler(k.eko).filter((h) => mesafe(E.hucreMerkezi(h), nokta) < 60).length * 0.5 : 0;
    const hafizaRisk = (Number.isFinite(hafiza[gt.x]) ? hafiza[gt.x] : 0) * 4;
    const alisma = gt.x === gc.gecit ? -0.4 : 0; // atalarının yolu
    const sel = k.eko && k.eko.taskin ? 3 : 0;
    const puan = uzak + timsah + yangin + hafizaRisk + alisma + sel + d.rng() * 0.3;
    if (!en || puan < en.puan) en = { gecit: gt.x, puan, timsah: timsah > 0.3, hafiza: hafizaRisk > 0.3 };
  }
  return en;
}
function gocBaslat(d, g, u) {
  const k = d.k;
  const gc = E.GOCMENLER[g.tur];
  const sec = gocGecitSec(d, g);
  const x = sec.gecit;
  const cikis = GOC_CIKIS[x] || { ...gc.cikis, yon: gc.yon };
  g.goc = { durum: 'gidiyor', yol: [{ x, y: nehirY(x) + 12 }, { x, y: nehirY(x) - 12 }, { x: cikis.x, y: cikis.y }], i: 0, basDk: k.dk, sayi: u.length, gecit: x, cikis: { x: cikis.x, y: cikis.y } };
  g.plan = 'goc';
  g.av = null;
  k.eko.gocler.unshift({ gun: gunNo(k.dk), tur: g.tur, olay: 'cikis', sayi: u.length, gecit: x });
  if (k.eko.gocler.length > 20) k.eko.gocler.length = 20;
  const gecit = GECITLER.find((x2) => x2.x === x);
  const neden = x !== gc.gecit ? (sec.hafiza ? ' Alışık oldukları geçitte önceki göçte kayıp verdikleri için bu kez başka yolu seçtiler.' : sec.timsah ? ' Alışık oldukları geçitte timsahlar beklediği için başka yolu seçtiler.' : ' Bu kez alışılmış yoldan farklı bir yol seçtiler.') : '';
  const m = `${BuyukHarf(gocAdi(g))}, ${u.length} birey, otlar azaldığı için ${cikis.yon} yönüne göçe başladı. Nehri ${gecit ? gecit.ad.toLocaleLowerCase('tr-TR') + 'nden' : 'geçitten'} geçecekler.${neden}`;
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
    if (g.goc.i === 1) gecisTehlikesi(d, g, u);
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
  k.eko.gecitPusu = yaklasan ? (Number.isFinite(yaklasan.goc.gecit) ? yaklasan.goc.gecit : E.GOCMENLER[yaklasan.tur].gecit) : null;
}
// Nehir geçişinde izdiham: bazıları ezilip yaralanır, akıntı yüksekken yavrular sürüklenebilir (karar 111)
function gecisTehlikesi(d, g, u) {
  const k = d.k;
  const yuksek = k.eko && Number.isFinite(k.eko.nehir) && k.eko.nehir > 0.8;
  let yarali = 0;
  let bogulan = 0;
  for (const b of u) {
    if (b.olu) continue;
    if (yuksek && b.evre === 'yavru' && d.rng() < 0.08) {
      hayvanOldu(d, b, 'göçte nehir geçerken akıntıya kapıldı');
      bogulan++;
    } else if (d.rng() < 0.05 && yaraVer(d, b, 'Göçte nehir geçerken izdihamda ezildi')) yarali++;
  }
  g.goc.gecisKayip = (g.goc.gecisKayip || 0) + bogulan;
  if ((yarali || bogulan) && mesafe(d.oyuncu, g) < 160)
    olay(d, 'goc', `${BuyukHarf(gocAdi(g))} nehri geçerken izdiham oldu: ${[yarali ? `${yarali} hayvan ezilip yaralandı` : '', bogulan ? `${bogulan} yavru akıntıya kapıldı` : ''].filter(Boolean).join(', ')}. ${BuyukHarf(yerTarifi(d.oyuncu, g))}.`, 3, { tur: g.tur });
}
function gocCikis(d, g, u) {
  const k = d.k;
  if (Number.isFinite(g.goc.gecit) && g.goc.sayi > 0) {
    if (!g.gocHafiza || typeof g.gocHafiza !== 'object') g.gocHafiza = {};
    g.gocHafiza[g.goc.gecit] = Math.round(Math.max(0, (g.goc.sayi - u.length) / g.goc.sayi) * 100) / 100;
  }
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
  // Göç tehlikeleri (karar 111): yolda avcılar, susuzluk (kurak yılda), hastalık, zayıflık ve insan faaliyetleri
  const kurakYil = !!(k.eko && k.eko.yil && k.eko.yil.kuraklik);
  const nedenler = {};
  uyeler2.forEach((b) => {
    const parca = {
      avci: b.evre === 'yavru' ? 0.1 : b.evre === 'yasli' ? 0.07 : 0.03,
      susuzluk: (kurakYil ? 0.06 : 0.015) * (b.evre === 'yavru' || b.evre === 'yasli' ? 1.5 : 1),
      hastalik: b.hastalik ? 0.2 : 0,
      zayiflik: Number.isFinite(b.kondisyon) && b.kondisyon < 0.35 ? 0.08 : 0,
      insan: 0.012,
    };
    const risk = Object.values(parca).reduce((s2, x) => s2 + x, 0);
    k.disari.hayvanlar = k.disari.hayvanlar.filter((x) => x !== b);
    if (d.rng() < risk) {
      let z = d.rng() * risk;
      const neden = Object.keys(parca).find((a) => (z -= parca[a]) <= 0) || 'avci';
      nedenler[neden] = (nedenler[neden] || 0) + 1;
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
  const sec = gocGecitSec(d, Object.assign({}, g, { x: gc.cikis.x, y: gc.cikis.y }), true);
  const cikis = GOC_CIKIS[sec.gecit] || gc.cikis;
  const p = { x: cikis.x, y: cikis.y };
  donenler.forEach((b) => {
    b.x = p.x + b.ofs.x;
    b.y = p.y + b.ofs.y;
    k.hayvanlar.push(b);
  });
  d.hayvanMap = new Map(k.hayvanlar.map((b) => [b.id, b]));
  k.disari.gruplar = k.disari.gruplar.filter((x) => x !== g);
  const x = sec.gecit;
  const h = TURLER[g.tur].habitat;
  Object.assign(g, { x: p.x, y: p.y, plan: 'goc', alarm: 0, av: null, susuzluk: 0.5 });
  g.goc = { durum: 'donuyor', yol: [{ x, y: nehirY(x) - 12 }, { x, y: nehirY(x) + 12 }, { x: h.x, y: h.y }], i: 0, gecit: x };
  k.gruplar.push(g);
  const sag = donenler.filter((b) => !b.olu).length;
  k.eko.gocler.unshift({ gun: gunNo(k.dk), tur: g.tur, olay: 'donus', sayi: sag, kayip, yeni, nedenler, gecit: x });
  const NEDEN_ADI = { avci: 'yolda avcılara', susuzluk: 'susuzluğa', hastalik: 'hastalığa', zayiflik: 'açlık ve zayıflığa', insan: 'insan faaliyetlerine (çit, yol, kaçak avcılık)' };
  const nedenMetni = kayip ? ` Tahmini kayıp nedenleri: ${Object.keys(nedenler).map((a) => `${nedenler[a]} birey ${NEDEN_ADI[a]}`).join(', ')}.` : '';
  const gecitAdi = (GECITLER.find((x2) => x2.x === x) || { ad: 'geçit' }).ad.toLocaleLowerCase('tr-TR');
  const m = `${BuyukHarf(gocAdi(g))} göçten dönüyor: ${sag} birey${yeni ? `, aralarında göçte doğmuş ${yeni} yavru` : ''}. ${kayip ? `Gidenlerden ${kayip} birey dönmedi.` : 'Gidenlerin hepsi dönüyor.'}${nedenMetni} Nehri ${gecitAdi}nden geçecekler.`;
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
  eko.afetCarpani = zorlukCarpani(k, 'afet', [0.25, 1, 1.6]);
  E.yanginRiski(eko, d.kap, gun, d.rng);
  Object.keys(eko.yanik || {}).forEach((h) => {
    if (k.dk - eko.yanik[h] > 12 * 1440) delete eko.yanik[h];
  });
  if (eko.mevsim !== tk.mevsim) eko.selSayisi = 0;
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
  const bulasan = { uyuz: new Set(), distemper: new Set() };
  k.hayvanlar.forEach((b) => {
    if (!b.olu && b.hastalik && bulasan[b.hastalik.id]) bulasan[b.hastalik.id].add(b.grup);
  });
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
      else if (bulasan.uyuz.has(b.grup) && d.rng() < 0.06) hastalikVer(d, b, 'uyuz', 0.15, 'Grup arkadaşından uyuz bulaştı');
      else if (bulasan.distemper.has(b.grup) && !(k.asili || []).includes(b.id) && d.rng() < 0.18) hastalikVer(d, b, 'distemper', 0.2, 'Grup arkadaşından köpek gençlik hastalığı bulaştı');
      else if (d.rng() < 0.0006 * (k.koruma && k.koruma.asi ? 0.2 : 1) && !(k.asili || []).includes(b.id)) hastalikVer(d, b, 'distemper', 0.2, 'Köpek gençlik hastalığı kaptı');
      else if (d.rng() < 0.0008) hastalikVer(d, b, 'uyuz', 0.15, 'Uyuz oldu');
      else if (tk.mevsim === 'kurak' && sarbonLes.length && eko.salgin && sarbonLes.some((l) => mesafe(l, g || b) < 40) && d.rng() < 0.08) {
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
  if (!eko.salgin && tk.mevsim === 'kurak' && tk.mevsimGunu >= 5 && eko.golet < 0.45 && eko.sarbonYil !== tk.yil && d.rng() < 0.25 * eko.afetCarpani) {
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

// ---------- Aşama 18: su içme davranışı (karar 104) ----------
// Su ihtiyacı sıcaklığa, mevsime, emziren annelere ve hastalığa göre değişir.
function suIhtiyaci(d, g, u) {
  const h = d.k.eko && d.k.eko.hava;
  let c = 1;
  if (h) {
    if (h.tur === 'sicak' || h.sicaklik >= 33) c *= 1.45;
    else if (h.sicaklik >= 29) c *= 1.15;
    if (h.tur === 'yagmurlu' || h.tur === 'saganak') c *= 0.7;
  }
  if (d.k.eko && d.k.eko.islaklik < 0.25) c *= 1.15; // kuruyan otlar daha az su taşır
  if (u.some((b) => b.evre === 'yavru')) c *= 1.1; // emziren anneler daha çok içer
  if (u.some((b) => b.hastalik)) c *= 1.1;
  return c;
}
const SUDA_RAHAT = ['timsah', 'suAygiri', 'fil', 'manda', 'piton', 'kartal'];
// Su başına varan sürü timsah görürse ya da orada yakında av olmuşsa önce bekler; susuzluk ağırsa hızlıca içer,
// değilse başka suya yönelir. true dönerse o karede içmezler.
function suBasiTehlikesi(d, g, u) {
  const k = d.k;
  if (SUDA_RAHAT.includes(g.tur) || TURLER[g.tur].yirtici) return false;
  if (g.suBekle === -1) return false; // bekleme bitti, içiyorlar
  const timsah = k.gruplar.find((x) => x.tur === 'timsah' && mesafe(x, g) < 20 && uyeler(d, x).length);
  const avYeri = (g.tehlikeYerleri || []).find((y) => k.dk - y.dk < 1440 && mesafe(y, g) < 30);
  if (!timsah && !avYeri) return false;
  if (!g.suBekle) {
    g.suBekle = d.zaman + 18 + d.rng() * 14;
    g.planBitis = Math.max(g.planBitis, k.dk + 25);
    u.forEach((b) => b.evre !== 'yavru' && !(b.ozel && b.ozel.bitis > d.zaman) && (b.ozel = { davranis: 'suBasindaTedirgin', bitis: g.suBekle }));
    if (mesafe(d.oyuncu, g) <= durbunMenzili(k.dk, k) && !k.magara)
      olay(d, 'sosyal', `${BuyukHarf(SOZ[g.tur])} sürüsü su başında durdu, içmeden bekliyor: ${timsah ? 'yakında timsah var; kulaklar dikili, suya bakıyorlar' : 'burada kısa süre önce av olmuş, ürkekler'}. ${BuyukHarf(yerTarifi(d.oyuncu, g))}.`, 2, { id: (u[0] || {}).id });
    return true;
  }
  if (d.zaman < g.suBekle) return true;
  // Bekleme bitti: çok susamışlarsa hızlıca içerler, değilse öbür su kaynağına giderler
  if (g.susuzluk < 0.85 && timsah) {
    const ote = mesafe(g, GOLET) < GOLET.r + 25 ? nehirNoktasi(sinirla(g.x, -170, 170), !!TURLER[g.tur].habitat.guneyde, 1.8) : GOLET.su ? { x: GOLET.x + GOLET.su + 2.2, y: GOLET.y } : null;
    if (ote && mesafe(ote, g) < 160 && !g.suDegisti) {
      g.suDegisti = true;
      g.suBekle = 0;
      g.hedef = ote;
      g.planBitis = k.dk + 60;
      return true;
    }
  }
  g.suBekle = -1;
  u.forEach((b) => b.evre !== 'yavru' && (b.ozel = { davranis: 'tedirginIciyor', bitis: d.zaman + 14 }));
  g.planBitis = Math.min(g.planBitis, k.dk + 8); // tedirgin olanlar kısa içip uzaklaşır
  return false;
}

// ---------- Grup ve birey güncellemesi ----------
function grupGuncelle(d, g, dt, dtDk) {
  const k = d.k;
  const t = TURLER[g.tur];
  const u = uyeler(d, g);
  if (!u.length) return;
  g.susuzluk = Math.min(1, g.susuzluk + (dtDk / (g.tur === 'fil' ? 520 : 680)) * suIhtiyaci(d, g, u)); // Aşama 18 (karar 104)
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
    } else if (g.plan === 'su' && !g.icti && suBasiTehlikesi(d, g, u)) {
      // Aşama 18 (karar 104): timsahlı ya da yakında avlanılmış su başında tedirgin beklerler, gerekirse başka suya giderler
    } else if (g.plan === 'su' && !g.icti) {
      g.icti = true;
      g.suBekle = 0;
      // Gölette içtiyse suyun kalitesi kaydedilir (kirli su parazit getirir, karar 74)
      g.kirliSu = (k.eko && GOLET.su && mesafe(g, GOLET) < GOLET.r + 8 ? E.suKalitesi(k.eko) : 1) - 0.8 * E.kirlilikAt(k.eko, g.x, g.y, 30);
      g.planBitis = Math.min(g.planBitis, k.dk + arasi(d.rng, 12, 22));
      g.susuzluk = 0;
    } else if (g.plan === 'gez' && g.yalak) {
      // Tuz yalağına vardı: bir süre toprağı yalarlar
      g.yalak = false;
      g.mineral = 0;
      g.planBitis = k.dk + arasi(d.rng, 25, 45);
      uyeler(d, g).forEach((b) => b.evre !== 'yavru' && (b.ozel = { davranis: 'topragiYaliyor', bitis: d.zaman + 70 + d.rng() * 30 }));
      if (mesafe(d.oyuncu, g) <= durbunMenzili(k.dk, k)) olay(d, 'yalak', `${BuyukHarf(SOZ[g.tur])} sürüsü tuz yalağına geldi; toprağı yalıyorlar. Bitkilerden alamadıkları sodyumu ve mineralleri topraktan alırlar.`, 2, { id: (uyeler(d, g)[0] || {}).id });
    } else if (g.plan === 'gez') {
      g.planBitis = Math.min(g.planBitis, k.dk + 3);
    }
  }
  if (MINERAL_TURLERI.includes(g.tur)) g.mineral = Math.min(1, (Number.isFinite(g.mineral) ? g.mineral : d.rng() * 0.7) + dtDk / (1440 * 2.5));
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
  if (b.ozel && b.ozel.bitis > d.zaman) return b.ozel.davranis; // Aşama 8: meydan okuma, rekabet
  if (g.alarm > 0 && g.alarmGecikme <= 0 && !t.yirtici) return 'kaciyor';
  if (b.alt && DAVRANISLAR[b.alt] && k.dk < b.altBitis) return b.alt;
  if (g.goc) return nehirdeMi(b.x, b.y) ? 'nehirGeciyor' : hareketli ? 'gocEdiyor' : 'otluyor';
  // Çok hasta hayvan yatar
  if (b.hastalik && b.hastalik.siddet > 0.65 && g.alarm <= 0) return 'dinleniyor';
  switch (g.plan) {
    case 'av':
      if (g.av && g.av.evre === 'kovala') return g.av.avciId === b.id ? 'kovaliyor' : (g.av.yardimcilar || []).includes(b.id) ? 'kusatiyor' : 'yuruyor';
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
  if (b.tuzakta) {
    // Tel tuzağa takılmış hayvan yerinden kıpırdayamaz (karar 60)
    b.davranis = 'tuzaktaKaldi';
    b.hareketli = false;
    return;
  }
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
    b.kosu = d.zaman + 0.6; // koşu sesi için (App)
    if (b.tur === 'timsah' && !nehirdeMi(b.x, b.y)) {
      // Kıyıdan suya kayan timsahın sıçratması (oturumluk; kayda yazılmaz)
      const ds = (d.timsahDalis = d.timsahDalis || {});
      if (d.zaman - (ds[b.id] || -99) > 25) {
        ds[b.id] = d.zaman;
        efekt(d, 'h_timsah_dalis', 0.9, b, 60);
      }
    }
    if (t.suCanlisi) bireyYuru(d, b, b.x + Math.sin(a) * 6, nehirY(b.x + Math.sin(a) * 6), hiz, dt); // suya dalar
    else bireyYuru(d, b, b.x + Math.sin(a) * 20, b.y + Math.cos(a) * 20, hiz, dt);
  } else if (g.plan === 'av' && g.av && g.av.evre === 'kovala' && (g.av.avciId === b.id || (g.av.yardimcilar || []).includes(b.id))) {
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

  // Oyuncuya tepki (mağaradayken oyuncu dışarıda yok sayılır)
  const mo = k.magara ? 999 : mesafe(b, d.oyuncu);
  if (mo < 70 && !t.kus) {
    const kac = kacisMesafesi(d, b);
    if (mo < kac && g.alarm <= 0.5 && b.tehdit <= 0) {
      const tehlikeli = t.tehlikeli && !k.aracta && !d.dinleniyor && (b.kisilik === 'cesur' || b.evre === 'yetiskin') && b.evre !== 'yavru';
      if (tehlikeli && mo < kac * 0.7) {
        tehditGoster(d, b);
      } else if (!(t.tehlikeli && t.yirtici && b.kisilik === 'cesur')) {
        grupAlarm(d, g, d.oyuncu, arasi(d.rng, 5, 8));
        b.alisma = Math.max(0, b.alisma - 0.04);
        b.korku = Math.min(1, (b.korku || 0) + 0.04);
        if (d.zaman - d.sonUyari > 20 && mo < durbunMenzili(k.dk, k)) {
          d.sonUyari = d.zaman;
          olay(d, 'urktu', `${grupAdi(d, g, b)} seni fark edip uzaklaştı. Daha uzaktan izlemelisin.`, 2, { id: b.id });
        }
      }
    } else if (mo >= kac && !d.oyuncuHareketli && mo < durbunMenzili(k.dk, k)) {
      // Sakin ve uzaktan izlenmeye alışır (karar 19); araçtan izlenince araçlara da alışır (karar 47)
      b.alisma = Math.min(1, b.alisma + dt * 0.0015 * KISILIKLER[b.kisilik].alisma * (d.gozlemId === b.id ? 2 : 1));
      if (k.aracta) b.aracAlisma = Math.min(1, (b.aracAlisma || 0) + dt * 0.002);
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
  if (b.ozel && b.ozel.davranis === 'kurYapiyor') return 'kur';
  if (b.ozel && b.ozel.davranis === 'yavruyuCagiriyor') return 'anne';
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
  if (d.zaman - b.uyardi > 3.5 && zorluk(d.k, 'tehlike') !== 'kolay') {
    // Sahte saldırı: hayvan birkaç metre atılır, sen geri sıçrarsın
    b.uyardi = d.zaman;
    b.sakin = d.zaman + 25;
    b.tehdit = 2;
    b.kosu = d.zaman + 1.2;
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
  const oz = b.ozellik && OZEL_BIREYLER[b.ozellik];
  const gr = !oz && gorunusSozu(b);
  return `${BuyukHarf(bireyAdi(b))}${oz ? `, ${oz.gorunus},` : gr ? `, ${gr},` : ''} ${dv.fiil}${saglikGorunusu(b)}${gebeSozu(d, b)}, ${yerTarifi(d.oyuncu, b)}`;
}
// Aşama 19 (karar 113): kalıtsal görünüş. ton -1 (açık) .. +1 (koyu); belirgin olanlar dürbünde söylenir ve bireyi tanımayı kolaylaştırır.
export const GORUNUS = {
  aslan: { erkek: ['açık sarı yeleli', 'kara yeleli'], disi: ['açık tüylü', 'koyu tüylü'] },
  leopar: ['açık zeminli, seyrek benekli', 'koyu zeminli, sık benekli'],
  cita: ['açık tüylü', 'koyu, sık benekli'],
  sirtlan: ['açık, seyrek benekli', 'koyu, sık benekli'],
  fil: { erkek: ['kısa dişli', 'uzun, kalın dişli'], disi: ['kısa dişli', 'uzun dişli'] },
  zurafa: ['açık, küçük lekeli', 'koyu, iri lekeli'],
  zebra: ['ince, açık çizgili', 'kalın, koyu çizgili'],
  gnu: ['açık gri', 'koyu, belirgin çizgili'],
  impala: { erkek: ['kısa boynuzlu', 'uzun, kıvrık boynuzlu'], disi: ['açık kızıl tüylü', 'koyu kızıl tüylü'] },
  ceylan: ['açık tüylü', 'belirgin kara yan çizgili'],
  manda: { erkek: ['ince boynuzlu', 'kalın, kalkan gibi boynuzlu'], disi: ['ince boynuzlu', 'geniş boynuzlu'] },
  gergedan: ['kısa boynuzlu', 'uzun ön boynuzlu'],
  yabanKopegi: ['açık lekeli', 'koyu lekeli'],
  babun: ['açık tüylü', 'koyu tüylü'],
  domuz: ['kısa dişli', 'uzun, kıvrık dişli'],
};
export function gorunusSozu(b) {
  const g = GORUNUS[b.tur];
  const ton = b.gen && sayiMi(b.gen.ton) ? b.gen.ton : 0;
  if (!g || Math.abs(ton) < 0.45 || b.evre === 'yavru') return '';
  const l = Array.isArray(g) ? g : g[b.cinsiyet] || g.disi;
  return ton < 0 ? l[0] : l[1];
}
export function gorunusSatiri(d, b) {
  const s = gorunusSozu(b);
  const anne = b.anne ? birey(d, b.anne) : null;
  const baba = b.baba ? birey(d, b.baba) : null;
  let m = s ? `Görünüş: ${s}.` : 'Görünüş: türünün ortalamasında, belirgin bir özelliği yok.';
  if (s && ((anne && gorunusSozu(anne) === s) || (baba && gorunusSozu(baba) === s))) m += ` Bu özelliği ${anne && gorunusSozu(anne) === s ? 'annesinden' : 'babasından'} almış.`;
  if (b.kisilikKaynak && KISILIKLER[b.kisilik]) m += ` ${BuyukHarf(KISILIKLER[b.kisilik].ad)} mizacı ${b.kisilikKaynak === 'anne' ? 'annesine' : 'babasına'} benziyor.`;
  return m;
}
// Dürbünle görülen sağlık belirtisi (karar 28)
// Gebelik ilk yarısında görünmez; ikinci yarısında karın belirginleşir (Aşama 21)
export function gebeSozu(d, b) {
  const gb = b.gebe;
  if (!gb || !sayiMi(gb.bas) || !sayiMi(gb.dogum)) return '';
  const gun = gunNo(d.k.dk);
  if (gun - gb.bas < (gb.dogum - gb.bas) / 2) return '';
  return gb.dogum - gun <= 1 ? ', karnı çok iri, doğumu yakın görünüyor' : ', karnı belirgin, gebe görünüyor';
}
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
    const oz = b.ozellik && OZEL_BIREYLER[b.ozellik];
    if (oz) {
      itibarEkle(d, 10);
      arsivOlay(d, `Özel birey bulundu: ${bireyAdi(b)}, ${oz.ad}.`);
      gecmisEkle(k, b, `Araştırmacı tarafından bulundu: ${oz.ad}`);
      olay(d, 'ozelBirey', `Olağanüstü bir keşif! ${BuyukHarf(bireyAdi(b))} bir ${oz.ad}. ${oz.tarif}`, 4, { id: b.id, kesif: true });
    }
  }
  if (b.hastalik && E.belirtiGorunur(b.hastalik) && !b.hastalik.goruldu && g.sn > 2) {
    b.hastalik.goruldu = true;
    gecmisEkle(k, b, `Gözlemde görüldü: ${E.HASTALIKLAR[b.hastalik.id].belirti}`);
    olay(d, 'belirti', `${BuyukHarf(bireyAdi(b))} ${E.HASTALIKLAR[b.hastalik.id].belirti}. Sağlığı bozuk görünüyor. Menüde Doğa, Numune ve veteriner bölümünden dışkı numunesi alabilir ya da veteriner çağırabilirsin.`, 3, { id: b.id });
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
    olay(d, 'davranis', `${BuyukHarf(bireyAdi(b))} artık ${(DAVRANISLAR[b.davranis] || DAVRANISLAR.dinleniyor).fiil}.`, 1, { id: b.id });
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
  olay(d, 'yaklas', `Yaklaşıyorsun: ${bireyAdi(b)}. Ürkütmeden ${metreSozu(hedefM)} uzakta duracaksın.${ruzgarUyarisi(d, b)}`, 3, { id: b.id });
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
  // Az önce bulunan küçük canlının fotoğrafı (Aşama 6)
  if ((!b || k.magara) && d.sonKucuk && d.zaman - d.sonKucuk.zaman < 25) {
    d.sonFoto = d.zaman;
    const id = d.sonKucuk.id;
    const kalite = d.rng() < 0.5 ? 'iyi' : d.rng() < 0.6 ? 'çok iyi' : 'orta';
    k.arsiv.fotolar.unshift({ id: k.sonrakiId++, kucuk: id, tur: null, davranis: null, bolge: k.magara ? (k.magara.alan ? UZAK_ALANLAR[k.magara.alan].ad : 'Mağara') : bolgeAdi(d.oyuncu.x, d.oyuncu.y), dk: k.dk, kalite });
    if (k.arsiv.fotolar.length > 300) k.arsiv.fotolar.length = 300;
    olay(d, 'foto', `Fotoğraf çekildi: ${d.sonKucukAd || 'küçük canlı'}, yakın çekim. Kalite ${kalite}.`, 3, { cekildi: true });
    return;
  }
  if (k.magara) {
    olay(d, 'foto', k.magara.alan ? 'Önce dürbünle bir canlı bul, sonra fotoğrafını çek.' : 'Mağarada önce fenerinle bir canlı bul, sonra fotoğrafını çek.', 3, { cekildi: false });
    return;
  }
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
  if (d.k.magara) {
    olay(d, 'hata', d.k.magara.alan ? 'Ses kayıt cihazı savandaki büyük hayvanlar için ayarlı. Buradaki canlıların seslerini bulduğunda tarifleri anlatır.' : 'Mağarada yankı çok güçlü; kayıt çözümlenemiyor. Yarasaların seslerini dışarıda, akşam çıkışında kaydedebilirsin.', 3);
    return;
  }
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
  if (d.k.teknede) {
    olay(d, 'hata', 'Teknedesin. Nehir boyunca kürek çek ya da önce tekneden in.', 3);
    return;
  }
  if (id === 'arac') hedef = { x: d.k.arac.x, y: d.k.arac.y, ad: aracAdi(d.k), yakin: 2.5 };
  else if (id === 'kamp' && d.k.kamp) hedef = { x: d.k.kamp.x, y: d.k.kamp.y, ad: 'Saha kampı', yakin: 3 };
  else if (id === 'ziyaretci') {
    // Aşama 10: nadir ziyaretçinin yanına
    const z = d.k.hikaye && d.k.hikaye.ziyaretci;
    if (!z || d.k.dk >= z.bitis) return;
    hedef = { x: z.x, y: z.y, ad: 'Ziyaretçi', yakin: 3 };
  }
  else if (id === 'tekne') {
    const t = d.k.tekne;
    const yan = t.y >= nehirY(t.x) ? 1 : -1;
    hedef = { x: t.x, y: nehirY(t.x) + yan * 6, ad: 'Tekne', yakin: 2.5 };
  } else {
    const y = YERLER.find((x) => x.id === id);
    if (!y) return;
    hedef = { x: y.x, y: y.y, ad: y.ad, yakin: 4 };
  }
  if (taskinVar && guneydeMi(hedef.x, hedef.y) !== guneydeMi(d.oyuncu.x, d.oyuncu.y)) {
    olay(d, 'hata', 'Nehir taştı, geçitler sular altında. Sular çekilene kadar karşı kıyıya geçemezsin.', 3);
    return;
  }
  if (d.k.magara) {
    olay(d, 'hata', d.k.magara.alan ? 'Saha gezisindesin. Önce istasyona dön.' : 'Önce mağaradan çıkmalısın.', 3);
    return;
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

const TEKNE_HIZ = 2.6;
// Aşama 18 (karar 24): garajdaki araçlardan seçili olanın özellikleri
export const aracOzellik = (k) => ARACLAR[k && k.aracTuru] || ARACLAR.arazi;
export const aracAdi = (k) => aracOzellik(k).ad;
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
  olay(d, 'arac', `${aracAdi(d.k)}: bindin. ${aracOzellik(d.k).kacis < 0.5 ? 'Hayvanlar araçtaki insandan daha az ürker.' : 'Açık araçta hayvanlar seni yine de fark eder; yavaş sür.'}`, 3, { bindi: true });
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
  taskinVar = !!(k.eko && k.eko.taskin);
  const ileri = k.magara ? 0 : sinirla(girdi.ileri || 0, -1, 1);
  const don = k.magara ? 0 : sinirla(girdi.don || 0, -1, 1);
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
  if (k.teknede) {
    // Tekne (Aşama 8): nehrin akışı boyunca kürek çekilir; kıyıya çarpmaz, haritanın kenarında durur
    if (elle) {
      o.yon = aciNormal(o.yon + don * YURUME.don * dt);
      const v = ileri * TEKNE_HIZ * (ileri < 0 ? 0.6 : 1) * dt;
      const nx = sinirla(o.x + Math.sin(o.yon) * v, -YARICAP + 12, YARICAP - 12);
      const yan = sinirla(o.y + Math.cos(o.yon) * v - nehirY(nx), -NEHIR_YARI + 1.2, NEHIR_YARI - 1.2);
      o.x = nx;
      o.y = nehirY(nx) + yan;
    }
    Object.assign(k.tekne, { x: o.x, y: o.y, yon: o.yon });
  } else if (k.aracta) {
    const AR = aracOzellik(k);
    let hedefHiz = ileri * (ileri > 0 ? AR.hiz : AR.geri);
    let donus = don;
    if (oto) {
      const yn = yolNoktasi(d, oto);
      const aci = engeldenKacan(d, yonAcisi(o, yn), 4);
      const fark = aciNormal(aci - o.yon);
      donus = sinirla(fark * 2, -1, 1);
      const kalan = mesafe(o, oto);
      hedefHiz = Math.min(AR.hiz, Math.max(2.5, kalan * 0.6)) * (Math.abs(fark) > 1.2 ? 0.3 : 1);
    }
    d.aracHiz += sinirla(hedefHiz - d.aracHiz, -9 * dt, 6 * dt);
    if (Math.abs(d.aracHiz) > 0.2) o.yon = aciNormal(o.yon + donus * AR.don * dt * Math.sign(d.aracHiz) * Math.min(1, Math.abs(d.aracHiz) / 3));
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
  sonuc.yurudu = k.aracta || k.teknede ? 0 : yol;
  sonuc.kurek = k.teknede ? yol : 0;
  sonuc.surdu = k.aracta ? yol : 0;

  // --- Hayvanlar ---
  // Ayrıntı düzeyi (Aşama 7, performans): oyuncudan uzak gruplar seyrek ama birikmiş süreyle güncellenir
  if (!d.lod) d.lod = new Map();
  const grupDt = new Map();
  for (const g of k.gruplar) {
    const uzak = !g.goc && !(g.plan === 'av' && g.av && g.av.evre === 'kovala') && (k.magara || Math.abs(g.x - o.x) > LOD_UZAKLIK || Math.abs(g.y - o.y) > LOD_UZAKLIK);
    if (uzak) {
      const birikim = (d.lod.get(g.id) || 0) + dt;
      if (birikim < LOD_ARALIK) {
        d.lod.set(g.id, birikim);
        continue;
      }
      d.lod.set(g.id, 0);
      grupDt.set(g.id, Math.min(0.5, birikim));
    } else grupDt.set(g.id, dt);
    const gdt = grupDt.get(g.id);
    grupGuncelle(d, g, gdt, gdt * OYUN_DK_SN);
  }
  const gMap = new Map(k.gruplar.map((g) => [g.id, g]));
  const sesOncesi = d.olaylar.length;
  for (const b of k.hayvanlar) {
    if (b.olu) continue;
    const g = gMap.get(b.grup);
    if (!g || !grupDt.has(g.id)) continue;
    bireyGuncelle(d, b, g, grupDt.get(g.id));
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
    for (const e of E.ekoAdim(k.eko, d.kap, gunNo(k.dk), gunDakikasi(k.dk), dtDk, d.rng)) ekoDuyurusu(d, e);
    yanginEtkisi(d, dt);
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
        parcalar.push(`${SOZ[b.tur]} sürüsü, ${l.length} birey${yavru ? `, ${yavru} yavru` : ''}, ${(DAVRANISLAR[b.davranis] || DAVRANISLAR.dinleniyor).fiil}, en yakını ${yerTarifi(d.oyuncu, b)}`);
      } else {
        l.forEach((x) => parcalar.push(`${BuyukHarf(bireyAdi(x.b))}, ${(DAVRANISLAR[x.b.davranis] || DAVRANISLAR.dinleniyor).fiil}, ${yerTarifi(d.oyuncu, x.b)}`));
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
// Bozuk ya da eksik değerleri onarır (çevrim dışı dayanıklılık, Aşama 7). Yapılan onarımları döndürür.
const sayiMi = (v) => typeof v === 'number' && Number.isFinite(v);
export function kayitOnar(k) {
  const onarim = [];
  if (k.gruplar && !Array.isArray(k.gruplar)) k.gruplar = null;
  if (k.hayvanlar && !Array.isArray(k.hayvanlar)) k.hayvanlar = null;
  if (!k.gruplar || !k.hayvanlar) {
    if (k.gruplar || k.hayvanlar) onarim.push('nüfus yeniden kuruldu');
    k.gruplar = null;
    k.hayvanlar = null;
  }
  if (!sayiMi(k.dk) || k.dk < 0) {
    k.dk = BASLANGIC_SAATI;
    onarim.push('zaman');
  }
  if (!sayiMi(k.butce)) {
    k.butce = 15000;
    onarim.push('bütçe');
  }
  if (!sayiMi(k.itibar) || k.itibar < 0) {
    k.itibar = 0;
    onarim.push('itibar');
  }
  if (!k.oyuncu || !sayiMi(k.oyuncu.x) || !sayiMi(k.oyuncu.y) || !sayiMi(k.oyuncu.yon) || Math.hypot(k.oyuncu.x, k.oyuncu.y) > YARICAP) {
    k.oyuncu = { x: 1, y: -2.5, yon: Math.PI / 2 };
    onarim.push('oyuncu konumu');
  }
  if (!k.arac || !sayiMi(k.arac.x) || !sayiMi(k.arac.y) || !sayiMi(k.arac.yon)) {
    k.arac = { ...ARAC_YERI };
    k.aracta = false;
    onarim.push('araç');
  }
  if (Array.isArray(k.gruplar)) {
    k.gruplar = k.gruplar.filter((g) => g && TURLER[g.tur]);
    k.gruplar.forEach((g) => {
      if (!sayiMi(g.x) || !sayiMi(g.y)) {
        Object.assign(g, { x: TURLER[g.tur].habitat.x, y: TURLER[g.tur].habitat.y, plan: null, hedef: null, goc: null });
        onarim.push('grup konumu');
      }
      if (!sayiMi(g.susuzluk)) g.susuzluk = 0.3;
      if (!sayiMi(g.aclik)) g.aclik = 0.3;
    });
  }
  if (Array.isArray(k.hayvanlar)) {
    const once = k.hayvanlar.length;
    k.hayvanlar = k.hayvanlar.filter((b) => b && TURLER[b.tur] && sayiMi(b.id));
    if (k.hayvanlar.length !== once) onarim.push('bozuk hayvan kaydı');
    const gruplar = new Map((k.gruplar || []).map((g) => [g.id, g]));
    k.hayvanlar.forEach((b) => {
      if (!sayiMi(b.x) || !sayiMi(b.y)) {
        const g = gruplar.get(b.grup);
        b.x = g ? g.x : TURLER[b.tur].habitat.x;
        b.y = g ? g.y : TURLER[b.tur].habitat.y;
        onarim.push('hayvan konumu');
      }
      if (!b.ofs || !sayiMi(b.ofs.x) || !sayiMi(b.ofs.y)) b.ofs = { x: 0, y: 0 };
      if (!sayiMi(b.yon)) b.yon = 0;
      if (!sayiMi(b.alisma)) b.alisma = 0;
      if (!sayiMi(b.kondisyon)) b.kondisyon = 0.7;
      if (!sayiMi(b.yas)) b.yas = 0;
      if (!EVRELER[b.evre]) b.evre = 'yetiskin';
      if (!KISILIKLER[b.kisilik]) b.kisilik = 'sakin';
      if (b.hastalik && !E.HASTALIKLAR[b.hastalik.id]) b.hastalik = null;
      if (!sayiMi(b.sesSayac)) b.sesSayac = 10;
    });
    if (!k.gruplar || !k.gruplar.length) {
      k.hayvanlar = null;
      k.gruplar = null;
      onarim.push('nüfus yeniden kuruldu');
    }
  }
  if (k.eko && (!Array.isArray(k.eko.ot) || k.eko.ot.some((v) => !sayiMi(v)))) {
    k.eko = null;
    onarim.push('ekosistem yeniden kuruldu');
  }
  if (k.eko) {
    ['islaklik', 'yesil', 'golet', 'alg', 'nehir'].forEach((a) => {
      if (!sayiMi(k.eko[a])) {
        k.eko[a] = 0.5;
        onarim.push('ekosistem değeri');
      }
    });
    const hv = k.eko.hava;
    if (hv && (typeof hv !== 'object' || !E.HAVA_ADI[hv.tur] || !Array.isArray(hv.yagmur) || !sayiMi(hv.gun) || !sayiMi(hv.ruzgarYon) || !sayiMi(hv.ruzgarHiz) || !sayiMi(hv.sicaklik))) k.eko.hava = null;
    if (!Array.isArray(k.eko.yaprak) || k.eko.yaprak.length !== k.eko.ot.length) k.eko.yaprak = k.eko.ot.map(() => 0.5);
    if (!Array.isArray(k.eko.gocler)) k.eko.gocler = [];
    if (!Array.isArray(k.eko.teshisler)) k.eko.teshisler = [];
    if (!k.eko.yanan || typeof k.eko.yanan !== 'object') k.eko.yanan = {};
    if (!k.eko.yanik || typeof k.eko.yanik !== 'object') k.eko.yanik = {};
  }
  ['fotolar', 'sesler', 'olaylar'].forEach((a) => {
    if (!Array.isArray(k.arsiv[a])) {
      k.arsiv[a] = [];
      onarim.push('arşiv');
    }
    k.arsiv[a] = k.arsiv[a].filter((x) => x && typeof x === 'object' && sayiMi(x.dk));
  });
  k.arsiv.olaylar = k.arsiv.olaylar.filter((x) => typeof x.metin === 'string');
  ['turler', 'bireyler', 'bitkiler', 'kucukler'].forEach((a) => {
    if (!k.arsiv[a] || typeof k.arsiv[a] !== 'object' || Array.isArray(k.arsiv[a])) k.arsiv[a] = {};
    Object.keys(k.arsiv[a]).forEach((id) => {
      const v = k.arsiv[a][id];
      if (!v || typeof v !== 'object') delete k.arsiv[a][id];
    });
  });
  Object.values(k.arsiv.turler).forEach((t) => {
    if (!Array.isArray(t.davranislar)) t.davranislar = [];
    if (!sayiMi(t.gozlemSn)) t.gozlemSn = 0;
    if (!sayiMi(t.ilkDk)) t.ilkDk = k.dk;
    if (typeof t.ilkBolge !== 'string') t.ilkBolge = 'bilinmiyor';
  });
  Object.values(k.arsiv.bireyler).forEach((b) => {
    if (!sayiMi(b.gozlemSn)) b.gozlemSn = 0;
    if (!sayiMi(b.sonDk)) b.sonDk = k.dk;
    if (!sayiMi(b.ilkDk)) b.ilkDk = k.dk;
    if (typeof b.sonBolge !== 'string') b.sonBolge = 'bilinmiyor';
  });
  Object.values(k.arsiv.bitkiler).forEach((b) => {
    if (!Array.isArray(b.evreler)) b.evreler = [];
  });
  Object.values(k.arsiv.kucukler).forEach((c) => {
    if (!sayiMi(c.sayi)) c.sayi = 1;
    if (typeof c.ilkBolge !== 'string') c.ilkBolge = 'bilinmiyor';
  });
  // Nesne listeleri: bozuk öğeler atılır
  ['mesajlar', 'teklifler', 'tuzaklar', 'numuneler', 'numuneKutusu', 'lesler', 'rehab', 'personel'].forEach((a) => {
    if (!Array.isArray(k[a])) k[a] = [];
    k[a] = k[a].filter((x) => x && typeof x === 'object');
  });
  k.mesajlar = k.mesajlar.filter((m) => typeof m.metin === 'string');
  k.lesler = k.lesler.filter((l) => sayiMi(l.x) && sayiMi(l.y) && TURLER[l.tur]);
  k.tuzaklar = k.tuzaklar.filter((t) => sayiMi(t.x) && sayiMi(t.y));
  k.rehab = k.rehab.filter((r) => r.b && TURLER[r.b.tur]);
  k.personel = k.personel.filter((p) => typeof p.rol === 'string');
  k.teklifler = k.teklifler.filter((t) => typeof t.metin === 'string' && sayiMi(t.hedef));
  if (!k.zorluk || typeof k.zorluk !== 'object') k.zorluk = {};
  if (!k.ekipman || typeof k.ekipman !== 'object' || Array.isArray(k.ekipman)) k.ekipman = {};
  if (!k.stok || typeof k.stok !== 'object') k.stok = { tuzak: 0, tasma: 0 };
  ['tuzak', 'tasma'].forEach((a) => {
    if (!sayiMi(k.stok[a]) || k.stok[a] < 0) k.stok[a] = 0;
  });
  if (!Array.isArray(k.gpsli)) k.gpsli = [];
  if (!Array.isArray(k.tesisler)) k.tesisler = [];
  if (!k.sayac || typeof k.sayac !== 'object') k.sayac = {};
  if (k.disari) {
    k.disari.hayvanlar = (k.disari.hayvanlar || []).filter((b) => b && TURLER[b.tur]);
    k.disari.gruplar = (k.disari.gruplar || []).filter((g) => g && TURLER[g.tur] && g.goc);
  }
  if (k.magara && !sayiMi(k.magara.oda)) k.magara = null;
  // Tanınmış ölü hayvanlar nüfus listesinde birikmesin (arşiv kaydı kalır)
  if (Array.isArray(k.hayvanlar)) {
    const olu = k.hayvanlar.filter((b) => b.olu);
    if (olu.length > 80) {
      const sil = new Set(olu.sort((a, b) => a.olumDk - b.olumDk).slice(0, olu.length - 80));
      k.hayvanlar = k.hayvanlar.filter((b) => !sil.has(b));
    }
  }
  k.onarim = onarim;
  return onarim;
}
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
  if (!k.koruma || typeof k.koruma !== 'object' || !k.koruma.projeler) k.koruma = { projeler: {}, devriye: false, asi: false };
  if (!Array.isArray(k.asili)) k.asili = [];
  if (!k.zorluk || typeof k.zorluk !== 'object') k.zorluk = { ...bos.zorluk };
  // Aşama 7'den önceki kayıtlarda rehberli eğitim gösterilmez
  if (k.egitimV !== 2) {
    k.egitimV = 2;
    if (k.egitim > 0) k.egitim = 99;
  }
  kayitOnar(k);
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

// ---------- Adım ve dönüş sesleri ----------
// Ayağının altındaki zemin: adım sesi buna göre seçilir (assets/efekt/adim_<zemin>_<n>.mp3)
// p verilirse o noktanın zemini (hayvanların koşu sesi için); verilmezse oyuncunun
export function zeminTuru(d, p) {
  const k = d.k;
  if (k.magara && !p) return k.magara.alan ? UZAK_ALANLAR[k.magara.alan].zemin : 'magara';
  const o = p || d.oyuncu;
  if (nehirdeMi(o.x, o.y) || (GOLET.su > 0 && Math.hypot(o.x - GOLET.x, o.y - GOLET.y) < GOLET.su + 0.5)) return 'su';
  const b = bolgeBul(o.x, o.y);
  if (b === 'kayalik') return 'kaya';
  if (b === 'galeri') return 'yaprak';
  if (b === 'istasyon') return 'toprak';
  const islak = k.eko && (k.eko.yagmurVar || k.eko.islaklik > 0.75);
  if (b === 'golet' || b === 'sulak') return 'camur';
  const kiyiUzak = o.y - nehirY(o.x);
  if (b === 'nehir' && Math.abs(kiyiUzak) < 9) return 'camur';
  if (o.x > GALERI.x0 && o.x < GALERI.x1 && kiyiUzak > 0 && kiyiUzak < GALERI.derinlik) return 'yaprak';
  if (b === 'nehir') return 'ot';
  if (islak) return 'camur';
  // Kurak mevsimde otun bittiği yerlerde çıplak toprak
  if (k.eko && E.otDegeri(k.eko, o.x, o.y) < 0.2) return 'toprak';
  if (b === 'agaclik' && k.eko && k.eko.yesil > 0.5) return 'yaprak';
  return 'ot';
}

// Dönüş tıkırtısı (Kayıp Okyanus dalis.js donusTikirtisi): hedef varsa hedefin yönüne göre, yoksa baktığın yöne göre
// 30 derecelik dilimler; yarım dilimden fazla geçince 'tik' (ana yönlerde güçlü), hedef tam önüne gelince 'hedefOnde'.
// d.donus durumu tutar. Döndürür: null | { ses: 'donus_tik' | 'hedef_onde', duzey }
const DILIM = Math.PI / 6;
export function donusTikirtisi(d) {
  const o = d.oyuncu;
  const h = gozlenen(d) || d.rota || null;
  const kip = h ? 'hedef' : 'pusula';
  const aciFark = (a) => Math.atan2(Math.sin(a), Math.cos(a));
  const v = h ? aciFark(Math.atan2(h.x - o.x, h.y - o.y) - o.yon) / DILIM : (((o.yon % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)) / DILIM;
  const s = d.donus || (d.donus = {});
  if (s.kip !== kip || s.hedef !== (h && (h.id || h.ad)) || s.dilim === undefined) {
    s.kip = kip;
    s.hedef = h && (h.id || h.ad);
    s.dilim = Math.round(v);
    return null;
  }
  let fark = v - s.dilim;
  while (fark > 6) fark -= 12;
  while (fark < -6) fark += 12;
  if (Math.abs(fark) < 0.6) return null;
  s.dilim = Math.round(v);
  const yeni = ((s.dilim % 12) + 12) % 12;
  if (kip === 'hedef' && yeni === 0) return { ses: 'hedef_onde', duzey: 0.8 };
  return { ses: 'donus_tik', duzey: kip === 'pusula' && yeni % 3 === 0 ? 0.6 : 0.3 };
}

// Koşu sesi türü (kaçarken, kovalarken, sahte saldırıda; App 3B çalar): toynak orta boy, hafif toynak, ağır, pati
export const KOSU_SESI = {
  zebra: 'kosu_toynak', gnu: 'kosu_toynak', zurafa: 'kosu_toynak',
  ceylan: 'kosu_hafif', impala: 'kosu_hafif', domuz: 'kosu_hafif',
  fil: 'kosu_agir', gergedan: 'kosu_agir', suAygiri: 'kosu_agir', manda: 'kosu_agir',
  aslan: 'kosu_pati', leopar: 'kosu_pati', cita: 'kosu_pati', sirtlan: 'kosu_pati', yabanKopegi: 'kosu_pati', babun: 'kosu_pati',
};
// Koşu sesinin zemini: ot ve yaprak yumuşak (ot), toprak ve kaya sert toprak (toprak), su ve çamur (su)
const KOSU_ZEMIN = { ot: 'ot', yaprak: 'ot', toprak: 'toprak', kaya: 'toprak', istasyon: 'toprak', su: 'su', camur: 'su' };
export function kosuSesiAdi(d, b) {
  const t = KOSU_SESI[b.tur];
  return t ? `${t}_${KOSU_ZEMIN[zeminTuru(d, b)] || 'ot'}` : null;
}
// Yakında koşan hayvanlar (en yakın önce): sesleri için
export function kosanlar(d, menzil = 55) {
  if (d.k.magara) return [];
  const l = [];
  for (const b of d.k.hayvanlar) {
    if (b.olu || !b.kosu || b.kosu < d.zaman || !KOSU_SESI[b.tur] || b.tuzakta) continue;
    if (TURLER[b.tur].suCanlisi && nehirdeMi(b.x, b.y)) continue; // suda koşu sesi olmaz
    const m = mesafe(b, d.oyuncu);
    if (m <= menzil) l.push({ b, m });
  }
  return l.sort((a, b) => a.m - b.m);
}

// ---------- Aşama 8 için dışa açılanlar (oyun/genisleme.js kullanır) ----------
// Aşama 25: müziğin gerilime geçmesi için: yayaya yakın tehlikeli hayvan, yakında süren kovalamaca ya da yakın yangın
export function gerilimVar(d) {
  const k = d.k;
  if (k.magara || d.dinleniyor) return false;
  const o = d.oyuncu;
  // Yalnızca seni uyaran ya da çok yakındaki tehlikeli hayvan (suda dinlenen timsahlar sürekli gerilim yaratmasın)
  if (!k.aracta && !k.teknede && k.hayvanlar.some((b) => !b.olu && TURLER[b.tur] && TURLER[b.tur].tehlikeli && Math.abs(b.x - o.x) < 26 && Math.abs(b.y - o.y) < 26 && (b.tehdit > 0 || b.davranis === 'uyariyor' || mesafe(b, o) < 12))) return true;
  if (k.gruplar.some((g) => g.av && g.av.evre === 'kovala' && mesafe(g, o) < 80)) return true;
  const y = yanginYakin(d);
  return !!(y && y.m < 70);
}
export { grupAlarm, uyeler, disariEkle, yerTarifi, hastalikVer, kucuk as kucukHarf };
// Başka bir popülasyondan getirilen (translokasyon) ya da çevreden gelen yetişkinler: genetik çeşitliliği yüksek
export function gocmenEkle(d, g, n, cinsiyetler) {
  const k = d.k;
  const yeni = [];
  for (let i = 0; i < n; i++) {
    const cins = (cinsiyetler && cinsiyetler[i]) || (i % 2 ? 'erkek' : 'disi');
    const b = bireyOlustur(k, d.rng, g.tur, g, 'yetiskin', cins, g.x, g.y);
    b.gen = { h: 0.8 + d.rng() * 0.12, tasiyici: false };
    b.gocmen = true;
    b.x = g.x + b.ofs.x;
    b.y = g.y + b.ofs.y;
    k.hayvanlar.push(b);
    d.hayvanMap.set(b.id, b);
    yeni.push(b);
  }
  return yeni;
}
