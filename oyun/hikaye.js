// Aşama 10: gizemler (karar 26), nadir insan karşılaşmaları (karar 27), bilimsel başarı ödülleri (karar 58 ve 91).
// Saf mantık: d (dünya) ve d.k (kalıcı kayıt) üzerinde çalışır; App ve testler guncelle(d, dt)'yi her karede çağırır.
// Bütün sayılar ÖNERİDİR (Murat onaylamadı).
import * as M from './mantik.js';
import { TURLER, TUR_SIRASI, YERLER, GOLET, GALERI, ISTASYON } from './veri.js';
import { KUCUKLER } from './kucukler.js';

const gunu = (k) => M.gunNo(k.dk);
const tuzaklar = (k) => (k.kacak && Array.isArray(k.kacak.tuzaklar) ? k.kacak.tuzaklar.filter((t) => t && Number.isFinite(t.x) && Number.isFinite(t.y)) : []);
const lira = (n) => `${Math.round(n).toLocaleString('tr-TR')} lira`;

// ---------- Kayıt alanı ----------
export function hikayeAlani(k) {
  const h = k.hikaye;
  const bos = { gizemler: {}, basarilar: {}, sayac: {}, ziyaretci: null, sonZiyaretGun: 0, zarGun: 0, gorusmeler: 0 };
  if (!h || typeof h !== 'object') return (k.hikaye = bos);
  for (const a of ['gizemler', 'basarilar', 'sayac']) if (!h[a] || typeof h[a] !== 'object' || Array.isArray(h[a])) h[a] = {};
  for (const [id, g] of Object.entries(h.gizemler)) {
    if (!GIZEMLER[id] || !g || typeof g !== 'object' || !Number.isFinite(g.adim) || !Number.isFinite(g.bas)) delete h.gizemler[id];
    else {
      const n = GIZEMLER[id].adimlar.length;
      g.adim = Math.max(0, Math.min(n, Math.floor(g.adim)));
      if (typeof g.bitti !== 'boolean') g.bitti = g.adim >= n;
      if (!g.bitti && g.adim >= n) g.adim = n - 1;
    }
  }
  for (const [id, b] of Object.entries(h.basarilar)) if (!BASARILAR.some((x) => x.id === id) || !Number.isFinite(b)) delete h.basarilar[id];
  for (const [id, n] of Object.entries(h.sayac)) if (!Number.isFinite(n)) delete h.sayac[id];
  const z = h.ziyaretci;
  if (z && (!KISILER[z.kim] || !Number.isFinite(z.x) || !Number.isFinite(z.y) || !Number.isFinite(z.bitis))) h.ziyaretci = null;
  for (const a of ['sonZiyaretGun', 'zarGun', 'gorusmeler']) if (!Number.isFinite(h[a])) h[a] = 0;
  return h;
}

// ---------- Olay sayaçları (başarılar ve gizemler için) ----------
const SAYILAN = ['izSonu', 'goc', 'tanik', 'meydan', 'rekabet', 'yeniDavranis', 'yuvaBulundu', 'alarmZinciri', 'videoBitti', 'yeniKucuk'];
function olaylariSay(d) {
  const s = d.k.hikaye.sayac;
  for (const o of d.olaylar) {
    if (o._sayildi) continue;
    o._sayildi = true;
    if (SAYILAN.includes(o.tur)) s[o.tur] = (s[o.tur] || 0) + 1;
    if (o.tur === 'yeniDavranis' && o.nadir) s.nadirDavranis = (s.nadirDavranis || 0) + 1;
  }
}

// ---------- Bilimsel başarılar (karar 58, 91) ----------
// odul: itibar, fon, ekipman (yoksa bedava verilir, varsa fiyatı fon olarak), personel (bir aylık maaş bağışı) ve araştırma imkânı metni
const turSayisi = (k) => Object.keys(k.arsiv.turler).filter((t) => TURLER[t]).length;
const bireySayisi = (k) => Object.keys(k.arsiv.bireyler).length;
const davranisSayisi = (k) => Object.values(k.arsiv.turler).reduce((t, x) => t + ((x && x.davranislar) || []).length, 0);
const kucukSayisi = (k) => Object.keys(k.arsiv.kucukler || {}).filter((id) => KUCUKLER[id]).length;
const iyiFoto = (k) => k.arsiv.fotolar.filter((f) => f && (f.kalite === 'iyi' || f.kalite === 'çok iyi')).length;
const sesTuru = (k) => new Set(k.arsiv.sesler.map((x) => x && x.tur)).size;
const yuvaSayisi = (k) => (k.yuvalar || []).filter((y) => y.bulundu).length;
const teshis = (k) => new Set(((k.eko && k.eko.teshisler) || []).map((t) => t.hastalik)).size;
const gozlemSaat = (k) => Object.values(k.arsiv.turler).reduce((t, x) => t + ((x && x.gozlemSn) || 0), 0) / 3600;
const say = (k, a) => k.hikaye.sayac[a] || 0;
const gizemBitti = (k) => Object.values(k.hikaye.gizemler).filter((g) => g.bitti).length;

export const BASARILAR = [
  { id: 'ilkTur', ad: 'İlk adım', alan: 'Tür keşfi', kosul: 'İlk büyük memeli ya da kuş türünü arşive kaydet', ilerleme: (k) => [turSayisi(k), 1], odul: { fon: 500 } },
  { id: 'tur8', ad: 'Savanın sakinleri', alan: 'Tür keşfi', kosul: '8 büyük türü arşive kaydet', ilerleme: (k) => [turSayisi(k), 8], odul: { itibar: 5, fon: 2000 } },
  { id: 'turHepsi', ad: 'Eksiksiz tür listesi', alan: 'Tür keşfi', kosul: 'Bölgedeki bütün büyük türleri arşive kaydet', ilerleme: (k) => [turSayisi(k), TUR_SIRASI.length], odul: { itibar: 15, fon: 8000, ekipman: 'termal' } },
  { id: 'birey20', ad: 'Yüzleri tanıyan', alan: 'Bireysel kimlik', kosul: '20 bireye kimlik ver', ilerleme: (k) => [bireySayisi(k), 20], odul: { itibar: 5, fon: 2500, ekipman: 'teleobjektif' } },
  { id: 'davranis25', ad: 'Davranış kataloğu', alan: 'Davranış', kosul: '25 davranış kaydı topla (türler toplamında)', ilerleme: (k) => [davranisSayisi(k), 25], odul: { itibar: 6, fon: 3000 } },
  { id: 'nadir3', ad: 'Nadir anların tanığı', alan: 'Nadir davranış', kosul: '3 nadir davranış gözle', ilerleme: (k) => [say(k, 'nadirDavranis'), 3], odul: { itibar: 8, fon: 4000, personel: 'fotografci' } },
  { id: 'goc', ad: 'Göçün tanığı', alan: 'Göç', kosul: 'Bir sürünün göçe çıkışını ya da dönüşünü yaşa', ilerleme: (k) => [say(k, 'goc'), 1], odul: { itibar: 6, fon: 3000 } },
  { id: 'yuva3', ad: 'Gizli yuvalar', alan: 'Üreme', kosul: '3 in ya da yuva bul', ilerleme: (k) => [yuvaSayisi(k), 3], odul: { itibar: 6, fon: 3000, ekipman: 'drone' } },
  { id: 'teshis2', ad: 'Saha hekimliği', alan: 'Hastalık', kosul: '2 farklı hastalığı laboratuvarda teşhis et', ilerleme: (k) => [teshis(k), 2], odul: { itibar: 6, fon: 3500, personel: 'veteriner' } },
  { id: 'foto15', ad: 'Belgesel kareler', alan: 'Fotoğraf ve video', kosul: '15 iyi ya da çok iyi fotoğraf çek', ilerleme: (k) => [iyiFoto(k), 15], odul: { itibar: 5, fon: 2500 } },
  { id: 'video5', ad: 'Hareketli belge', alan: 'Fotoğraf ve video', kosul: '5 video kaydet', ilerleme: (k) => [k.arsiv.videolar ? k.arsiv.videolar.length : 0, 5], odul: { itibar: 5, fon: 2500 } },
  { id: 'ses8', ad: 'Savanın sesleri', alan: 'Ses', kosul: '8 türün sesini kaydet', ilerleme: (k) => [sesTuru(k), 8], odul: { itibar: 5, fon: 2500, ekipman: 'parabolik' } },
  { id: 'kucuk25', ad: 'Küçük dünyalar', alan: 'Küçük canlılar', kosul: '25 küçük canlı türü bul', ilerleme: (k) => [kucukSayisi(k), 25], odul: { itibar: 6, fon: 3000 } },
  { id: 'saat10', ad: 'Sabırlı gözlemci', alan: 'Uzun süreli gözlem', kosul: 'Hayvanları toplam 10 saat gözle', ilerleme: (k) => [Math.floor(gozlemSaat(k)), 10], odul: { itibar: 8, fon: 4000 } },
  { id: 'yil', ad: 'Bir tam yıl', alan: 'Ekolojik değişim', kosul: 'Sahada bir yılı (24 gün, iki mevsim) tamamla', ilerleme: (k) => [Math.min(gunu(k) - 1, 24), 24], odul: { itibar: 10, fon: 6000, arastirma: 'Uzun dönem ekoloji fonu: günlük destek kalıcı olarak artar.' } },
  { id: 'gizem3', ad: 'Sırların çözücüsü', alan: 'Gizemler', kosul: '3 gizemi çöz', ilerleme: (k) => [gizemBitti(k), 3], odul: { itibar: 10, fon: 5000 } },
];

function odulVer(d, odul) {
  const k = d.k;
  const parcalar = [];
  if (odul.itibar) M.itibarEkle(d, odul.itibar);
  let fon = odul.fon || 0;
  if (odul.ekipman) {
    // Teknoloji ödülü: merkezin ekipman tablosu App'ten değil, kayıttaki k.ekipman alanından okunur
    if (!k.ekipman[odul.ekipman]) {
      k.ekipman[odul.ekipman] = true;
      parcalar.push(`${EKIPMAN_ADI[odul.ekipman] || odul.ekipman} bağış olarak istasyona gönderildi`);
    } else fon += 2000;
  }
  if (odul.personel) {
    // Personel ödülü: kurum bir aylık maaşı (12 gün) karşılar; personel yoksa ilk maaşı kadar fon
    fon += 1500;
    parcalar.push(`${PERSONEL_ADI[odul.personel] || 'bir uzman'} için personel bursu verildi`);
  }
  if (fon) {
    k.butce += fon;
    parcalar.unshift(`${lira(fon)} fon`);
  }
  if (odul.arastirma) parcalar.push(odul.arastirma);
  return parcalar.join('; ');
}
const EKIPMAN_ADI = { termal: 'Termal kamera', teleobjektif: 'Teleobjektif', drone: 'Araştırma dronu', parabolik: 'Parabolik mikrofon' };
const PERSONEL_ADI = { fotografci: 'Doğa fotoğrafçısı', veteriner: 'Veteriner' };

function basariDenetle(d) {
  const k = d.k;
  const h = k.hikaye;
  for (const b of BASARILAR) {
    if (h.basarilar[b.id]) continue;
    let ok = false;
    try {
      const [n, hedef] = b.ilerleme(k);
      ok = n >= hedef;
    } catch (e) {}
    if (!ok) continue;
    h.basarilar[b.id] = k.dk;
    const odul = odulVer(d, b.odul);
    const m = `Bilimsel başarı: ${b.ad}. ${b.kosul}. Ödül: ${odul}.`;
    M.mesajEkle(k, m, 'gelir');
    M.arsivOlay(d, `Başarı kazanıldı: ${b.ad}.`);
    M.olay(d, 'basari', m, 3);
    return; // aynı anda birden çok başarı birikirse 2 sn arayla duyurulur
  }
}
// "Bir tam yıl" ödülünün kalıcı desteği merkez.js gunlukDestek içinde okunur

export function basariSatirlari(k) {
  hikayeAlani(k);
  const kazanilan = [];
  const kalan = [];
  for (const b of BASARILAR) {
    let [n, hedef] = [0, 1];
    try {
      [n, hedef] = b.ilerleme(k);
    } catch (e) {}
    if (k.hikaye.basarilar[b.id]) kazanilan.push({ b, metin: `${b.ad}, kazanıldı, ${M.gunNo(k.hikaye.basarilar[b.id])}. gün. ${b.alan}: ${b.kosul}.` });
    else kalan.push({ b, metin: `${b.ad}, ${Math.min(n, hedef)} / ${hedef}. ${b.alan}: ${b.kosul}. Ödül: ${odulMetni(b.odul)}.` });
  }
  return { kazanilan, kalan };
}
function odulMetni(o) {
  const p = [];
  if (o.fon) p.push(lira(o.fon));
  if (o.ekipman) p.push(EKIPMAN_ADI[o.ekipman].toLocaleLowerCase('tr-TR'));
  if (o.personel) p.push('personel bursu');
  if (o.arastirma) p.push('yeni araştırma imkânı');
  if (o.itibar) p.push('itibar');
  return p.join(', ');
}

// ---------- Gizemler (karar 26) ----------
// Her gizemin adımları sırayla çözülür; adım tamam(d, g) doğru olunca bir sonrakine geçilir. Baslat: kendiliğinden başlama koşulu.
const yakin = (d, p, r) => Math.hypot(d.oyuncu.x - p.x, d.oyuncu.y - p.y) < r;
const GALERI_ORTA = { x: (GALERI.x0 + GALERI.x1) / 2, y: 0 };
const numuneVar = (k, g, f) => [...(k.numuneKutusu || []), ...(k.numuneler || [])].some((n) => n && n.dk >= g.bas && f(n));

export const GIZEMLER = {
  golet: {
    ad: 'Gölet kıyısındaki ölü kuşlar',
    giris: 'Gölet kıyısında üç ölü kuş ve kıyıya vurmuş ölü balıklar görüldüğü söyleniyor. Bir hastalık mı, zehir mi?',
    baslat: (k) => gunu(k) >= 3 && k.eko && k.eko.alg > 0.3,
    adimlar: [
      { metin: 'Göletin kıyısına git ve çevreyi incele.', tamam: (d) => yakin(d, GOLET, GOLET.r + 14), sonra: 'Kıyıda yeşil bir köpük var; su ılık ve bulanık. Su kokusu ağır.' },
      { metin: 'Göletten bir su numunesi al. Ana menüde Doğa, Numune ve veteriner.', tamam: (d, g) => numuneVar(d.k, g, (n) => n.tip === 'su'), sonra: 'Numune kutunda. İstasyona dönünce laboratuvara teslim edilir.' },
      { metin: 'Su numunesini istasyona götür ve laboratuvarda analiz ettir.', tamam: (d, g) => (d.k.numuneler || []).some((n) => n && n.dk >= g.bas && n.tip === 'su' && n.durum === 'tamam') },
    ],
    cozum: 'Laboratuvar sonucu: sığ ve ısınan gölette siyanobakteriler (mavi-yeşil algler) patlama yapmış, suya toksin salmış. Kuşlar bu sudan içmiş. Yağmurlar gölü tazeleyince tehlike geçer; o zamana kadar hayvanlar nehri yeğler.',
    odul: { itibar: 8, fon: 2000 },
  },
  gece: {
    ad: 'Ormandaki gece çığlıkları',
    giris: 'Nehrin kuzeyindeki galeri ormanından geceleri insan çığlığını andıran, giderek yükselen sesler geliyor. Yerel halk bunun bir ruh olduğunu anlatıyor.',
    baslat: (k) => gunu(k) >= 2 && M.gunEvresi(k.dk) === 'gece',
    adimlar: [
      { metin: 'Gece, nehrin kuzeyindeki galeri ormanına git. Yerler menüsünde galeri ormanı var.', tamam: (d) => M.gunEvresi(d.k.dk) !== 'gunduz' && M.bolgeBul(d.oyuncu.x, d.oyuncu.y) === 'galeri', sonra: 'Ağaçların tepesinden, karanlıkta tiz, hırıltılı çığlıklar geliyor; ses ağaçtan ağaca yanıtlanıyor.' },
      { metin: 'Galeri ormanında, karanlıkta, küçük canlı ara (Doğa menüsünde Küçük canlı ara). Sesin sahibini fenerle bul.', tamam: (d) => !!(d.k.arsiv.kucukler || {}).agacDamani },
    ],
    cozum: 'Çığlıkların sahibi ağaç damanı: kedi büyüklüğünde, filin uzak akrabası bir memeli. Erkekler geceleri bölgelerini bu çığlıklarla ilan eder. Ruh değil, ama Afrika gecesinin en ürkütücü seslerinden biri.',
    odul: { itibar: 8, fon: 1500 },
  },
  leopar: {
    ad: 'Kaybolan dişi leopar',
    giris: 'Kayalık çevresinde sık görülen bir dişi leopar birkaç gündür ortada yok. Kamera tuzaklarına da yakalanmıyor. Öldü mü, bölgeden mi gitti?',
    baslat: (k) => gunu(k) >= 5 && !!k.arsiv.turler.leopar,
    adimlar: [
      { metin: 'Bir leoparı gözle ve tanı (dürbünle 6 saniye izle).', tamam: (d) => !!d.k.arsiv.turler.leopar },
      { metin: 'Leopar izlerini incele ve takip et (Doğa menüsü, İzleri incele, İzi takip et).', tamam: (d, g) => (d.k.hikaye.sayac.izSonu || 0) > (g.ek || 0) || (d.k.yuvalar || []).some((y) => y.tur === 'leopar' && y.bulundu), basla: (d, g) => (g.ek = d.k.hikaye.sayac.izSonu || 0) },
      { metin: 'Leoparın inini bul. İzler, gece GPS ya da dron yardımcı olur.', tamam: (d) => (d.k.yuvalar || []).some((y) => y.tur === 'leopar' && y.bulundu) },
    ],
    cozum: 'Dişi ölmemiş: inde iki yavrusuyla saklanıyor. Leopar anneler doğumdan sonraki haftalarda yavrularını gizler, avlanmaya kısa çıkar ve yuvayı sık değiştirir. Bu yüzden görülmüyordu.',
    odul: { itibar: 10, fon: 2500 },
  },
  kacak: {
    ad: 'Tel tuzaklarının izi',
    giris: 'Söktüğün tel tuzak tek değil gibi. Aynı tür tel, aynı düğüm. Birisi bölgeye düzenli olarak tuzak kuruyor.',
    baslat: (k) => k.kacak && k.kacak.bulunan >= 1,
    adimlar: [
      { metin: 'Toplam 3 tel tuzağı bul ve sök.', tamam: (d) => d.k.kacak.bulunan >= 3, sonra: 'Tuzaklar hep geçitlere ve su yollarına yakın kurulmuş; avcılar nehirden geliyor.' },
      { metin: 'Bir korucuyla konuş ya da merkezden devriye başlat (Merkez, Koruma projeleri).', tamam: (d) => !!(d.k.koruma && d.k.koruma.devriye) || (d.k.hikaye.sayac.korucu || 0) > 0 },
    ],
    cozum: 'Korucuların izlediği iz, nehrin batısındaki eski bir balıkçı kampına çıktı. Kamp boşaltıldı, tel stoklarına el konuldu. Tuzak kurulma olasılığı bir süre çok azalacak.',
    odul: { itibar: 10, fon: 2500 },
    bitince: (k) => {
      k.hikaye.sayac.kacakBaski = gunu(k) + 6; // 6 gün tel tuzak çok seyrek (kesif tuzak üretiminde okunur)
    },
  },
};
export const GIZEM_SIRASI = Object.keys(GIZEMLER);

export function gizemBaslat(d, id, kaynak) {
  const k = d.k;
  const h = hikayeAlani(k);
  if (!GIZEMLER[id] || h.gizemler[id]) return false;
  const g = (h.gizemler[id] = { adim: 0, bas: k.dk, bitti: false });
  const gz = GIZEMLER[id];
  if (gz.adimlar[0].basla) gz.adimlar[0].basla(d, g);
  const m = `Yeni gizem: ${gz.ad}. ${kaynak ? kaynak + ' ' : ''}${gz.giris} İlk adım: ${gz.adimlar[0].metin}`;
  M.mesajEkle(k, m, 'bilgi');
  M.arsivOlay(d, `Gizem başladı: ${gz.ad}.`);
  M.olay(d, 'gizem', m, 3);
  return true;
}

function gizemDenetle(d) {
  const k = d.k;
  const h = k.hikaye;
  // Kendiliğinden başlayanlar: aynı anda en çok 2 çözülmemiş gizem
  const acik = Object.values(h.gizemler).filter((g) => !g.bitti).length;
  if (acik < 2 && !d.k.magara) {
    for (const id of GIZEM_SIRASI) {
      if (h.gizemler[id]) continue;
      let ok = false;
      try {
        ok = GIZEMLER[id].baslat(k);
      } catch (e) {}
      if (ok) {
        gizemBaslat(d, id);
        return;
      }
    }
  }
  for (const [id, g] of Object.entries(h.gizemler)) {
    if (g.bitti) continue;
    const gz = GIZEMLER[id];
    const a = gz.adimlar[g.adim];
    if (!a) continue;
    let ok = false;
    try {
      ok = a.tamam(d, g);
    } catch (e) {}
    if (!ok) continue;
    g.adim += 1;
    const sonraki = gz.adimlar[g.adim];
    if (sonraki) {
      if (sonraki.basla) sonraki.basla(d, g);
      M.olay(d, 'gizem', `${gz.ad}: ${a.sonra ? a.sonra + ' ' : ''}Sıradaki: ${sonraki.metin}`, 3);
    } else {
      g.bitti = true;
      g.bitisDk = k.dk;
      const odul = odulVer(d, gz.odul);
      if (gz.bitince) gz.bitince(k);
      const m = `Gizem çözüldü: ${gz.ad}. ${gz.cozum} Ödül: ${odul}.`;
      M.mesajEkle(k, m, 'sonuc');
      M.arsivOlay(d, `Gizem çözüldü: ${gz.ad}.`);
      M.olay(d, 'gizemCozuldu', m, 4);
    }
    return;
  }
}

export function gizemSatirlari(k) {
  hikayeAlani(k);
  const l = [];
  for (const id of GIZEM_SIRASI) {
    const g = k.hikaye.gizemler[id];
    if (!g) continue;
    const gz = GIZEMLER[id];
    if (g.bitti || !gz.adimlar[g.adim]) l.push({ id, bitti: true, metin: `${gz.ad}, çözüldü. ${gz.cozum}` });
    else l.push({ id, bitti: false, metin: `${gz.ad}, ${g.adim + 1}. adım / ${gz.adimlar.length}. ${gz.adimlar[g.adim].metin}` });
  }
  return l.sort((a, b) => a.bitti - b.bitti);
}
export const acikGizemSayisi = (k) => (k.hikaye ? Object.values(k.hikaye.gizemler).filter((g) => !g.bitti).length : 0);

// ---------- Nadir insan karşılaşmaları (karar 27) ----------
// Günde en çok bir ziyaretçi, gündüz birkaç saat bir yerde bekler. İnsan yoğunluğu doğanın önüne geçmesin diye seyrek.
export const ZIYARET_SANSI = 0.3; // ÖNERİ: günlük olasılık
const KALIS_DK = 180;
export const KISILER = {
  korucu: { ad: 'Korucu Baraka', unvan: 'yaban hayatı servisinden bir korucu', renk: '#4f5a2a' },
  coban: { ad: 'Lemayan', unvan: 'sürüsünü sınırdan geçiren yerli bir Maasai çobanı', renk: '#a02a24' },
  arastirmaci: { ad: 'Doktor Amani Okello', unvan: 'kuzeydeki komşu istasyondan bir araştırmacı', renk: '#3a5f8a' },
};

function ziyaretPlanla(d) {
  const k = d.k;
  const h = k.hikaye;
  const g = gunu(k);
  const saat = M.gunDakikasi(k.dk) / 60;
  if (h.zarGun === g || saat < 8 || saat > 15) return;
  h.zarGun = g;
  if (g < 2 || h.ziyaretci || Math.random() > ZIYARET_SANSI) return;
  const adaylar = ['korucu', 'coban', 'arastirmaci'];
  if (tuzaklar(k).some((t) => !t.bulundu)) adaylar.push('korucu');
  const kim = adaylar[Math.floor(Math.random() * adaylar.length)];
  const yerler = YERLER.filter((y) => y.id !== 'istasyon' && y.id !== 'magara' && Math.hypot(y.x, y.y) < 190 && (kim !== 'coban' || Math.hypot(y.x - ISTASYON.x, y.y - ISTASYON.y) > 60));
  const y = yerler[Math.floor(Math.random() * yerler.length)] || YERLER[0];
  const a = Math.random() * Math.PI * 2;
  h.ziyaretci = { kim, x: y.x + Math.cos(a) * 4, y: y.y + Math.sin(a) * 4, yer: y.ad, bitis: k.dk + KALIS_DK, konusuldu: false, yon: a };
  h.sonZiyaretGun = g;
  const p = KISILER[kim];
  const m = `Telsiz: ${p.ad}, ${p.unvan}, bugün ${y.ad} yakınında olacak; yaklaşık üç saat kalacak. Yanına gidip konuşabilirsin.`;
  M.mesajEkle(k, m, 'bilgi');
  M.olay(d, 'insan', m, 2);
}

export function ziyaretci(d) {
  const z = d.k.hikaye && d.k.hikaye.ziyaretci;
  return z && d.k.dk < z.bitis ? z : null;
}
export function konusulabilir(d) {
  const z = ziyaretci(d);
  return z && !d.k.magara && Math.hypot(d.oyuncu.x - z.x, d.oyuncu.y - z.y) < 7 ? z : null;
}
export function ziyaretciTarifi(d) {
  const z = ziyaretci(d);
  if (!z) return null;
  return `${KISILER[z.kim].ad}, ${z.yer} yakınında, ${M.yerTarifi(d.oyuncu, z)}`;
}

// Konuşma: her kişi işine yarar bir bilgi verir; bazen bir gizem başlatır.
export function konus(d) {
  const z = konusulabilir(d);
  if (!z) return 'Yakında konuşabileceğin kimse yok.';
  const k = d.k;
  const h = k.hikaye;
  const p = KISILER[z.kim];
  if (z.konusuldu) return `${p.ad}: "Söyleyeceklerimi söyledim. Yolun açık olsun." Biraz sonra buradan ayrılacak.`;
  z.konusuldu = true;
  h.gorusmeler += 1;
  M.itibarEkle(d, 1);
  let soz = '';
  if (z.kim === 'korucu') {
    h.sayac.korucu = (h.sayac.korucu || 0) + 1;
    const t = tuzaklar(k).filter((x) => !x.bulundu).sort((a, b) => M.mesafe(d.oyuncu, a) - M.mesafe(d.oyuncu, b))[0];
    if (t) {
      t.ipucu = true;
      soz = `"Merhaba, araştırmacı. Dün devriyede ${M.bolgeAdi(t.x, t.y)} tarafında taze tel izi ve kesilmiş dallar gördüm. Buradan ${M.saatSozu(M.saatYonu(d.oyuncu, t))}, ${M.metreSozu(M.mesafe(d.oyuncu, t))} kadar. Bir tuzak olabilir; görürsen sök, ben servise bildiririm."`;
      if (!h.gizemler.kacak) gizemBaslat(d, 'kacak', `${p.ad} anlattı.`);
    } else {
      const tehlike = enYakinGrup(d, (tur) => TURLER[tur].tehlikeli);
      soz = tehlike
        ? `"Bu sıralar bölge sakin, kaçak avcı izi yok. Ama dikkat et: ${M.kucukHarf(M.SOZ[tehlike.tur])} sürüsü ${M.bolgeAdi(tehlike.x, tehlike.y)} tarafında, buradan ${M.saatSozu(M.saatYonu(d.oyuncu, tehlike))}. Yayayken rüzgârı arkana alma; kokunu alırlar."`
        : '"Bölge sakin. Devriyemize devam ediyoruz. Bir şey görürsen telsizle haber ver."';
    }
  } else if (z.kim === 'coban') {
    const yeni = enYakinGrup(d, (tur) => !k.arsiv.turler[tur]);
    if (yeni)
      soz = `"Sürümü sulamaya götürürken ${M.kucukHarf(M.SOZ[yeni.tur])} gördüm, ${M.bolgeAdi(yeni.x, yeni.y)} yakınında. Buradan ${M.saatSozu(M.saatYonu(d.oyuncu, yeni))}, ${M.metreSozu(M.mesafe(d.oyuncu, yeni))} kadar. Biz onlarla yüzyıllardır bu toprağı paylaşırız; sen de saygıyla izle."`;
    else soz = '"Yaşlılar, akasyalar çiçek açınca yağmurun yakın olduğunu söyler. Hayvanlar bunu bizden önce bilir; sürüler yön değiştirince biz de göç ederiz."';
    if (!h.gizemler.gece) gizemBaslat(d, 'gece', `${p.ad} anlattı: geceleri galeri ormanından gelen çığlıkları "orman ruhu" diye bilirler.`);
  } else {
    // Komşu istasyondan araştırmacı: veri alışverişi ve küçük bir fon
    const yuva = (k.yuvalar || []).filter((y) => !y.bulundu).sort((a, b) => M.mesafe(d.oyuncu, a) - M.mesafe(d.oyuncu, b))[0];
    k.butce += 600;
    soz = `"Verilerimizi paylaşalım; ortak makale için kurumum ${lira(600)} gönderecek."`;
    if (yuva) soz += ` "Bizim tasmalı hayvanlardan biri ${M.kucukHarf(M.SOZ[yuva.tur])} yuvasının ${M.bolgeAdi(yuva.x, yuva.y)} tarafında olduğunu gösteriyor. Buradan ${M.saatSozu(M.saatYonu(d.oyuncu, yuva))}, ${M.metreSozu(M.mesafe(d.oyuncu, yuva))}. Kesin yerini sen bulmalısın."`;
    if (!h.gizemler.leopar && k.arsiv.turler.leopar) gizemBaslat(d, 'leopar', `${p.ad} sordu.`);
  }
  M.arsivOlay(d, `${p.ad} ile konuştun.`);
  return `${p.ad}, ${p.unvan}: ${soz}`;
}

function enYakinGrup(d, f) {
  let en = null;
  let enM = Infinity;
  for (const g of d.k.gruplar) {
    if (!TURLER[g.tur] || !f(g.tur)) continue;
    const u = M.uyeler(d, g)[0];
    if (!u) continue;
    const m = M.mesafe(d.oyuncu, u);
    if (m < enM && m < 260) {
      enM = m;
      en = { tur: g.tur, x: u.x, y: u.y };
    }
  }
  return en;
}

function ziyaretGuncelle(d) {
  const h = d.k.hikaye;
  const z = h.ziyaretci;
  if (z && d.k.dk >= z.bitis) {
    h.ziyaretci = null;
    if (!z.konusuldu) M.olay(d, 'insan', `${KISILER[z.kim].ad} bölgeden ayrıldı.`, 1);
  }
  ziyaretPlanla(d);
}

// ---------- Döngü ----------
let sayac = 0;
export function guncelle(d, dt) {
  const k = d.k;
  if (!d._hikayeOnarildi || !k.hikaye || typeof k.hikaye !== 'object') {
    hikayeAlani(k); // kayıttan gelen bozuk alanlar ilk karede onarılır
    d._hikayeOnarildi = true;
  }
  olaylariSay(d);
  sayac += dt;
  if (sayac < 2) return;
  sayac = 0;
  basariDenetle(d);
  gizemDenetle(d);
  ziyaretGuncelle(d);
}
