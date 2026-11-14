// Aşama 20: bitki ve böcek ekolojisi (karar 95 böcek kolonileri, 96 botanik). Saf mantık; Bo.guncelle(d, dt) her karede,
// anlık işler 2 sn'de bir, günlük işler gün dönünce.
// Tozlaşma: bitki çiçek evresindeyken bölgesinde arılar, güneş kuşları ya da rüzgârla tozlaşma görülür.
// Tohum yayılımı: meyve ve bakla yiyen hayvanlar (fil, zürafa, impala, babun) tohumları dışkılarıyla uzağa taşır; bok böcekleri
// dışkıyı gömer; yağmurlar gelince tohum filizlenir, fide fidana, fidan genç ağaca döner. Oyuncu bunları bulup inceler.
// Böcek kolonileri: termit tepeleri, yabani bal arısı kovanı, ordu karıncaları, ağaç karıncaları. Durumları saat, mevsim ve
// yağmura göre değişir; farklı durumları gözlemek kayda geçer. Sayılar ÖNERİDİR.
import * as M from './mantik.js';
import * as E from './ekosistem.js';
import { TURLER, YARICAP, TERMITLER } from './veri.js';

const sinirla = (x, a, b) => Math.max(a, Math.min(b, x));
const gunu = (k) => M.gunNo(k.dk);
const evreNo = (id, k) => ['yE', 'yG', 'kE', 'kG'].indexOf(E.bitkiEvresi(id, gunu(k), k.eko).anahtar);

// ---------- Tozlaşma ----------
// i: çiçek evresi (0 yağışlı erken, 1 yağışlı geç, 2 kurak erken, 3 kurak geç)
export const TOZLASMA = {
  semsiyeAkasya: { i: 0, kim: 'arılar', metin: 'Şemsiye akasyanın beyaz top çiçekleri arılarla dolu; bal arıları ve küçük yaban arıları çiçekten çiçeğe konup polen taşıyor. Ağacın altında hafif bir bal kokusu var.' },
  sariAkasya: { i: 1, kim: 'arılar ve sinekler', metin: 'Sarı ateş ağacının sarı top çiçekleri vızıldıyor: arılar ve çiçek sinekleri polen topluyor. Bacaklarındaki sarı polen keseleri dolmuş.' },
  kirmiziYulaf: { i: 1, kim: 'rüzgâr', metin: 'Rüzgâr kırmızı yulaf otunun başaklarını sallıyor; başakların üstünden ince, sarımsı bir polen tozu kalkıyor. Otlar arılara gerek duymadan rüzgârla tozlaşır.' },
  kopekdisi: { i: 1, kim: 'rüzgâr', metin: 'Köpekdişi ayrığının ince çiçek başakları rüzgârda titriyor; polenini havaya bırakıyor. Rüzgârla tozlaşan otların çiçekleri gösterişsizdir, çünkü böcek çekmeleri gerekmez.' },
  papirus: { i: 1, kim: 'rüzgâr', metin: 'Papirüs püsküllerinden rüzgârla ince bir polen savruluyor. Sazların çiçekleri de rüzgârla tozlaşır.' },
  samdanSutlegen: { i: 1, kim: 'arılar ve sinekler', metin: 'Şamdan sütleğeninin sarımsı yeşil çiçeklerinde arılar ve sinekler dolaşıyor; çiçekler bol nektar verir. Bu nektardan yapılan bal acı ve yakıcıdır.' },
  aloe: { i: 2, kim: 'güneş kuşları', metin: 'Bir güneş kuşu aloenin kırmızı çiçek salkımına asıldı; uzun, kıvrık gagasını tüp biçimli çiçeklere sokup nektar içiyor. Alnına bulaşan polenle bir sonraki çiçeği tozlaştıracak.' },
  colHurmasi: { i: 0, kim: 'arılar ve sinekler', metin: 'Çöl hurmasının küçük beyazımsı çiçeklerinde arılar ve sinekler kaynaşıyor. Dikenlerin arasından dikkatle yaklaşan böcekler nektar alıyor.' },
};

// ---------- Tohum yayılımı ----------
export const YAYANLAR = {
  semsiyeAkasya: ['zurafa', 'fil', 'impala'],
  sariAkasya: ['fil', 'babun'],
  colHurmasi: ['fil', 'impala', 'babun'],
};
const YAYAN_TURLER = [...new Set(Object.values(YAYANLAR).flat())];
const AYAK_SOZ = { fil: 'fil', zurafa: 'zürafa', impala: 'impala', babun: 'babun' };
const IZ_SINIRI = 24;
const EVRE_ADI = { tohum: 'tohumlu dışkı', fide: 'fideler', fidan: 'fidan' };
const FIDE_SURE = 14; // fideden fidana gün
const FIDAN_SURE = 22; // fidandan genç ağaca gün

export function botanikAlani(k) {
  if (!k.botanik || typeof k.botanik !== 'object') k.botanik = {};
  const b = k.botanik;
  if (!b.tozlasma || typeof b.tozlasma !== 'object') b.tozlasma = {};
  if (!b.yayilim || typeof b.yayilim !== 'object') b.yayilim = {};
  if (!b.koloniler || typeof b.koloniler !== 'object') b.koloniler = {};
  if (!Number.isFinite(b.yetisen)) b.yetisen = 0;
  if (!Number.isFinite(b.sayac)) b.sayac = 0;
  if (!Array.isArray(b.tohumlar)) b.tohumlar = [];
  b.tohumlar = b.tohumlar.filter((t) => t && E.BITKILER[t.bitki] && TURLER[t.tasiyan] && Number.isFinite(t.x) && Number.isFinite(t.y) && Number.isFinite(t.gun) && EVRE_ADI[t.evre]);
  for (const id of Object.keys(b.koloniler)) if (!KOLONILER[id] || !Array.isArray(b.koloniler[id])) delete b.koloniler[id];
  return b;
}

function uygunYer(x, y) {
  if (Math.hypot(x, y) > YARICAP - 12) return false;
  const bolge = M.bolgeBul(x, y);
  return !['nehir', 'golet', 'istasyon'].includes(bolge);
}

function tohumBirak(d, g) {
  const k = d.k;
  const b = botanikAlani(k);
  const bolge = M.bolgeBul(g.x, g.y);
  const adaylar = Object.keys(YAYANLAR).filter((id) => YAYANLAR[id].includes(g.tur) && E.BITKILER[id].bolge.includes(bolge) && E.bitkiEvresi(id, gunu(k), k.eko).tohum);
  if (!adaylar.length) return;
  const bitki = adaylar[Math.floor(Math.random() * adaylar.length)];
  // Tohum yenildiği yerden uzağa taşınır: sindirim saatler sürer, hayvan bu arada yürür
  for (let i = 0; i < 6; i++) {
    const a = Math.random() * Math.PI * 2;
    const r = 25 + Math.random() * 45;
    const x = g.x + Math.cos(a) * r;
    const y = g.y + Math.sin(a) * r;
    if (!uygunYer(x, y)) continue;
    b.tohumlar.push({ no: ++b.sayac, bitki, tasiyan: g.tur, x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10, gun: gunu(k), evre: 'tohum', adet: 2 + Math.floor(Math.random() * (g.tur === 'fil' ? 9 : 4)), gomuldu: false });
    break;
  }
  if (b.tohumlar.length > IZ_SINIRI) {
    const i = b.tohumlar.findIndex((t) => t.evre === 'tohum');
    b.tohumlar.splice(i >= 0 ? i : 0, 1);
  }
}

function gunluk(d) {
  const k = d.k;
  const b = botanikAlani(k);
  const gun = gunu(k);
  const tk = E.takvim(gun);
  const nem = k.eko && Number.isFinite(k.eko.islaklik) ? k.eko.islaklik : 0.3;
  for (const g of k.gruplar) {
    if (!YAYAN_TURLER.includes(g.tur) || g.goc || !M.uyeler(d, g).length) continue;
    if (Math.random() < (g.tur === 'fil' ? 0.45 : 0.25)) tohumBirak(d, g);
  }
  const kalan = [];
  for (const t of b.tohumlar) {
    const yas = gun - t.gun;
    if (t.evre === 'tohum') {
      if (!t.gomuldu && Math.random() < 0.4) t.gomuldu = true; // bok böcekleri
      if (tk.mevsim === 'yagisli' && nem > 0.45 && Math.random() < (t.gomuldu ? 0.55 : 0.3)) {
        t.evre = 'fide';
        t.evreGun = gun;
        t.adet = Math.max(1, Math.round(t.adet * (t.gomuldu ? 0.7 : 0.4)));
      } else if (yas > 30 || (!t.gomuldu && Math.random() < 0.04)) continue; // kemirgenler ve kuşlar yedi ya da çürüdü
    } else if (t.evre === 'fide') {
      const olum = (tk.mevsim === 'kurak' ? 0.08 : 0.03) + (nem < 0.2 ? 0.05 : 0);
      for (let i = t.adet; i > 0; i--) if (Math.random() < olum) t.adet--;
      if (t.adet <= 0) continue;
      if (gun - t.evreGun >= FIDE_SURE) {
        t.evre = 'fidan';
        t.evreGun = gun;
        t.adet = 1; // en güçlüsü kalır
      }
    } else if (t.evre === 'fidan') {
      if (Math.random() < 0.015) continue; // otçullar kemirdi
      if (gun - t.evreGun >= FIDAN_SURE) {
        b.yetisen++;
        if (Math.hypot(d.oyuncu.x - t.x, d.oyuncu.y - t.y) < 200) M.mesajEkle(k, `${E.BITKILER[t.bitki].ad} fidanı genç bir ağaca dönüştü; tohumunu bir ${AYAK_SOZ[t.tasiyan]} taşımıştı. Savanda hayvanların taşıdığı tohumlardan yetişen ağaç sayısı: ${b.yetisen}.`, 'ekosistem');
        continue;
      }
    }
    kalan.push(t);
  }
  b.tohumlar = kalan;
}

export function yakinTohumlar(d, menzil = 80) {
  const o = d.oyuncu;
  return botanikAlani(d.k)
    .tohumlar.map((t) => ({ t, m: Math.hypot(t.x - o.x, t.y - o.y) }))
    .filter((x) => x.m <= menzil)
    .sort((a, b) => a.m - b.m)
    .map((x) => x.t);
}
export function tohumAdi(t) {
  const bitki = M.kucukHarf(E.BITKILER[t.bitki].ad);
  if (t.evre === 'tohum') return `${AYAK_SOZ[t.tasiyan]} dışkısında ${bitki} tohumları`;
  if (t.evre === 'fide') return t.adet > 1 ? `${t.adet} ${bitki} fidesi` : `bir ${bitki} fidesi`;
  return `genç bir ${bitki} fidanı`;
}
export function tohumIncele(d, t) {
  const k = d.k;
  const b = botanikAlani(k);
  if (!t || Math.hypot(d.oyuncu.x - t.x, d.oyuncu.y - t.y) > 12) return 'İncelemek için 12 metre içinde olmalısın.';
  const bitki = E.BITKILER[t.bitki];
  const kim = AYAK_SOZ[t.tasiyan];
  const yas = gunu(k) - t.gun;
  let metin;
  if (t.evre === 'tohum')
    metin = `Bir ${kim} dışkısı; içinde ${t.adet} ${M.kucukHarf(bitki.ad)} tohumu görünüyor. ${t.gomuldu ? 'Bok böcekleri dışkının bir kısmını toprağa gömmüş; gömülü tohumlar nemli toprakta korunur, kemirgenlerden kurtulur.' : 'Bok böcekleri henüz gelmemiş; açıkta kalan tohumları kemirgenler ve kuşlar yiyebilir.'} Hayvanın sindiriminden geçen tohumun kabuğu incelir; yağmurlar gelince daha kolay çimlenir.${yas > 0 ? ` Dışkı yaklaşık ${yas} günlük.` : ' Dışkı taze.'}`;
  else if (t.evre === 'fide')
    metin = `Eski bir ${kim} dışkısının kalıntısından ${t.adet > 1 ? t.adet + ' küçük' : 'küçük bir'} ${M.kucukHarf(bitki.ad)} fidesi filizlenmiş. Dışkı fidelere gübre olmuş. Hepsi yaşamayacak: kurakta ve otçulların dişleri arasında çoğu kaybolur.`;
  else metin = `Diz boyu bir ${M.kucukHarf(bitki.ad)} fidanı; tohumunu yaklaşık ${yas} gün önce bir ${kim} buraya taşımış. Kardeş fidelerin en güçlüsü kalmış. Birkaç hafta daha otçullardan kurtulursa genç bir ağaca dönüşecek.`;
  const anahtar = `${t.bitki}:${t.tasiyan}`;
  const kayit = (b.yayilim[anahtar] = b.yayilim[anahtar] || []);
  if (!kayit.length) {
    M.itibarEkle(d, 4);
    M.arsivOlay(d, `Tohum yayılımı kaydedildi: ${bitki.ad} tohumlarını ${kim} taşıyor.`);
    M.olay(d, 'yeniBitki', '', 0);
    metin += ` Yeni kayıt: ${bitki.ad} tohumlarını ${kim} taşıyor.`;
  }
  if (!kayit.includes(t.evre)) {
    if (kayit.length) {
      M.itibarEkle(d, 2);
      M.olay(d, 'yeniBitki', '', 0);
      metin += ` Bu yayılımın yeni bir evresini kaydettin: ${EVRE_ADI[t.evre]}.`;
    }
    kayit.push(t.evre);
  }
  return metin;
}
export function yayilimSatirlari(k) {
  const b = botanikAlani(k);
  const l = Object.keys(b.yayilim).map((a) => {
    const [bitki, tur] = a.split(':');
    return `${E.BITKILER[bitki] ? E.BITKILER[bitki].ad : bitki}, taşıyan ${AYAK_SOZ[tur] || tur}: ${b.yayilim[a].map((e) => EVRE_ADI[e]).join(', ')} gözlendi.`;
  });
  return l;
}

// ---------- Tozlaşma (anlık) ----------
let sonTozlasma = -1e9;
function tozlasmaDene(d) {
  const k = d.k;
  if (k.magara || d.zaman - sonTozlasma < 180 || Math.random() > 0.012) return;
  const evre = M.gunEvresi(k.dk);
  if (evre === 'gece' || k.eko.yagmurVar) return;
  const bolge = M.bolgeBul(d.oyuncu.x, d.oyuncu.y);
  const l = E.bolgedekiBitkiler(bolge).filter((id) => TOZLASMA[id] && evreNo(id, k) === TOZLASMA[id].i && (TOZLASMA[id].kim === 'rüzgâr' || evre !== 'aksam'));
  if (!l.length) return;
  const id = l[Math.floor(Math.random() * l.length)];
  sonTozlasma = d.zaman;
  const b = botanikAlani(k);
  if (b.tozlasma[id] && Math.random() < 0.6) return; // bilinen tozlaşma daha seyrek anlatılır
  let ek = '';
  if (!b.tozlasma[id]) {
    b.tozlasma[id] = k.dk;
    M.itibarEkle(d, 3);
    M.arsivOlay(d, `Tozlaşma gözlendi: ${E.BITKILER[id].ad}, ${TOZLASMA[id].kim}.`);
    ek = ' Tozlaşma kaydedildi.';
  }
  M.olay(d, 'bitki', `${TOZLASMA[id].metin}${ek}`, 2);
}
export function tozlasmaSatiri(k, id) {
  const t = TOZLASMA[id];
  if (!t) return '';
  const b = botanikAlani(k);
  const evre = ['yağışlı mevsimin başında', 'yağışlı mevsimin sonunda', 'kurak mevsimin başında', 'kurak mevsimin sonunda'][t.i];
  return b.tozlasma[id] ? `Tozlaşma: ${t.kim}, ${evre}; gözledin.` : `Tozlaşma: ${evre} çiçek açar; henüz tozlaşmasını görmedin.`;
}

// ---------- Böcek kolonileri (karar 95) ----------
// durum(ctx): ctx = { evre: şafak/gündüz/akşam/gece, mevsim, erken, yagmur, nem, ciceklenme }
export const KOLONILER = {
  termit: {
    ad: 'Termit tepeleri', x: TERMITLER.x + 6, y: TERMITLER.y - 4, tur: 'Mantar yetiştiren termitler (Macrotermes)',
    tarif: 'İnsan boyunu aşan kızıl toprak kuleleri. Her kulenin altında milyonlarca termit yaşar; kraliçe derinlerdeki odasında günde binlerce yumurta bırakır.',
    durumlar: [
      { id: 'ucus', sart: (c) => c.mevsim === 'yagisli' && c.erken && (c.evre === 'aksam' || c.evre === 'gece') && c.nem > 0.4, metin: 'Yağmurdan sonra tepelerin yanlarında delikler açılmış; kanatlı termitler bulut gibi havalanıyor. Bu çiftleşme uçuşudur: her çift yere inince kanatlarını atıp yeni bir koloni kurmaya çalışır. Kuşlar, kurbağalar ve çakallar bu şölene koşar.' },
      { id: 'gece', sart: (c) => c.evre === 'gece', metin: 'Gece serinliğinde işçi termitler toprak tünellerden çıkıp kuru ot sapları kesiyor ve içeri taşıyor. Otları yemezler: tepenin içindeki mantar bahçelerine gübre yaparlar, besinleri bu mantardır.' },
      { id: 'onarim', sart: (c) => c.yagmur, metin: 'Yağmur tepenin yüzeyini yumuşatmış; işçiler ıslak toprağı tükürükleriyle karıştırıp kuleyi onarıyor. Yeni sıvanmış koyu kızıl lekeler görünüyor.' },
      { id: 'kurak', sart: (c) => c.mevsim === 'kurak' && (c.evre === 'gunduz'), metin: 'Kuru sıcakta tepe dışarıdan ölü gibi sessiz. Ama elini havalandırma deliklerine yaklaştırınca ılık, nemli bir hava akımı hissediyorsun: kule bir baca gibi çalışır, içeriyi hep aynı sıcaklıkta tutar.' },
      { id: 'gunduz', sart: () => true, metin: 'Tepede kimse görünmüyor; termitler güneşten kaçar. Kulenin dibinde eski bir giriş deliği var; terk edilmiş tepeler sırtlanlara, yaban köpeklerine ve kertenkelelere in olur.' },
    ],
  },
  ari: {
    ad: 'Yabani bal arısı kovanı', x: 22, y: 132, tur: 'Afrika bal arısı (Apis mellifera scutellata)',
    tarif: 'Yaşlı bir akasyanın gövdesindeki kovukta yabani bir arı kovanı. Afrika bal arıları savunmalarıyla ünlüdür; fazla yaklaşma.',
    durumlar: [
      { id: 'bal', sart: (c) => c.ciceklenme && c.evre === 'gunduz', metin: 'Akasyalar çiçekte; kovuğun ağzı arılarla dolup taşıyor. Toplayıcı arılar bacaklarında polen keseleriyle dönüyor; bazıları kovuk ağzında yerinde dans ederek çiçeklerin yerini arkadaşlarına anlatıyor. Kovan bal yapıyor.' },
      { id: 'oğul', sart: (c) => c.mevsim === 'yagisli' && !c.erken && c.evre === 'gunduz', metin: 'Kovuktan uğultuyla bir arı bulutu çıktı ve yakındaki bir dala salkım gibi asıldı: bu bir oğul. Kovan kalabalıklaşınca eski kraliçe işçilerin yarısıyla ayrılır, öncü arılar yeni bir kovuk arar.' },
      { id: 'kilavuz', sart: (c) => c.evre === 'gunduz' && c.zar < 0.35, metin: 'Yakındaki daldan bir kuş ötüp kanat çırpıyor, sonra kovana doğru uçup bekliyor: bu bir bal kılavuzu kuşu. Kovanları bulup insanları ve bal porsuklarını oraya götürür; kovan açılınca petek artıklarını ve balmumunu yer.' },
      { id: 'gece', sart: (c) => c.evre === 'gece' || c.evre === 'safak', metin: 'Kovan sessiz. Arılar kovuğun içinde kümelenmiş; kanatlarını titreterek peteğin sıcaklığını koruyorlar. Kulağını yaklaştırsan derinden bir uğultu duyarsın.' },
      { id: 'yagmur', sart: (c) => c.yagmur, metin: 'Yağmurda arılar dışarı çıkmıyor; kovuğun ağzında birkaç bekçi arı duruyor. Islak kanatla uçmak tehlikelidir.' },
      { id: 'kurak', sart: () => true, metin: 'Çiçek az; birkaç arı su arıyor. Arılar sıcakta kovanı serinletmek için su taşır, kanatlarıyla buharlaştırır. Kurak mevsimde kovan bal stoğuyla yaşar.' },
    ],
  },
  ordu: {
    ad: 'Ordu karıncaları', x: -48, y: -32, tur: 'Safari karıncaları (Dorylus)',
    tarif: 'Sabit bir yuvası olmayan, milyonlarca bireylik göçebe karınca kolonileri. Toprağın altında geçici kamplarda dinlenir, sonra yollara dökülür.',
    durumlar: [
      { id: 'akin', sart: (c) => c.nem > 0.4 && (c.evre === 'safak' || c.evre === 'gece' || c.evre === 'aksam'), metin: 'Yerde parmak kalınlığında kara bir nehir akıyor: ordu karıncalarının akını. Kocaman çeneli asker karıncalar kolonun iki yanında dizilmiş, işçiler ortadan geçiyor. Yolları üstündeki her böceği, solucanı parçalayıp taşıyorlar. Ayağını kenarda tut.' },
      { id: 'kopru', sart: (c) => c.yagmur, metin: 'Yağmur suyu bir oluk açmış; karıncalar birbirine tutunarak canlı bir köprü kurmuş, kolon bu köprünün üstünden suyu geçiyor.' },
      { id: 'kamp', sart: (c) => c.evre === 'gunduz' && c.mevsim === 'yagisli', metin: 'Gündüz sıcağında kolon görünmüyor; karıncalar toprağın altındaki geçici kampına çekilmiş. Toprakta taze kazılmış küçük delikler ve karınca taşıyan kuşlar var.' },
      { id: 'kurak', sart: () => true, metin: 'Kuru toprakta karınca izi yok; koloni kurakta yerin derinine iner, yağmurları bekler.' },
    ],
  },
  agac: {
    ad: 'Dokumacı ağaç karıncaları', x: 148, y: -86, tur: 'Afrika dokumacı karıncası (Oecophylla longinoda)',
    tarif: 'Galeri ormanında ağaçların yapraklarını ipekle birbirine örerek yuva yapan karıncalar. Bir koloninin onlarca yuvası birkaç ağaca yayılır.',
    durumlar: [
      { id: 'orgu', sart: (c) => c.evre === 'gunduz' && c.mevsim === 'yagisli', metin: 'İşçi karıncalar zincir olup bir yaprağın kenarını öbür yaprağa çekiyor. Başka işçiler ağızlarında tuttukları larvaları sıkıyor; larvaların çıkardığı ipekle yaprakları birbirine dikiyorlar. Gözünün önünde yeni bir yuva örülüyor.' },
      { id: 'av', sart: (c) => c.evre === 'gunduz', metin: 'Turuncu karıncalar dallarda devriye geziyor; bir tırtılı birlikte yakalamışlar, gergin tutup yuvaya sürüklüyorlar. Ağaçlarını yabancı böceklerden temizledikleri için çiftçiler onları meyve bahçelerine taşır.' },
      { id: 'gece', sart: () => true, metin: 'Yuvalar sessiz; yaprak keselerinin içinde karıncalar dinleniyor. Dalda bekçi işçiler duruyor, dokunsan hemen saldırırlar.' },
    ],
  },
};
export const KOLONI_SIRASI = Object.keys(KOLONILER);
const KOLONI_MENZIL = 15;

function koloniDurumu(k, id, zar = Math.random()) {
  const tk = E.takvim(gunu(k));
  const nem = k.eko && Number.isFinite(k.eko.islaklik) ? k.eko.islaklik : 0.3;
  const c = {
    evre: M.gunEvresi(k.dk),
    mevsim: tk.mevsim,
    erken: tk.erken,
    yagmur: !!(k.eko && k.eko.yagmurVar),
    nem,
    ciceklenme: ['semsiyeAkasya', 'colHurmasi'].some((b) => TOZLASMA[b] && evreNo(b, k) === TOZLASMA[b].i),
    zar,
  };
  return KOLONILER[id].durumlar.find((x) => x.sart(c));
}
export function yakinKoloni(d) {
  return KOLONI_SIRASI.find((id) => M.mesafe(d.oyuncu, KOLONILER[id]) <= KOLONI_MENZIL) || null;
}
export function koloniIncele(d, id) {
  const k = d.k;
  const b = botanikAlani(k);
  const kol = KOLONILER[id];
  if (!kol) return 'Böyle bir koloni yok.';
  if (k.magara) return 'Mağaradasın.';
  if (M.mesafe(d.oyuncu, kol) > KOLONI_MENZIL) return `${kol.ad} çok uzakta; ${KOLONI_MENZIL} metre içinde olmalısın.`;
  const dur = koloniDurumu(k, id);
  const kayit = (b.koloniler[id] = b.koloniler[id] || []);
  let metin = '';
  if (!kayit.length) {
    M.itibarEkle(d, 5);
    M.arsivOlay(d, `Böcek kolonisi kaydedildi: ${kol.ad}.`);
    M.olay(d, 'yeniBitki', '', 0);
    metin = `Yeni koloni kaydı: ${kol.ad}, ${kol.tur}. ${kol.tarif} `;
  }
  metin += dur.metin;
  if (!kayit.includes(dur.id)) {
    kayit.push(dur.id);
    if (kayit.length > 1) {
      M.itibarEkle(d, 2);
      M.olay(d, 'yeniBitki', '', 0);
    }
    metin += ` Kolonide ${kayit.length} / ${kol.durumlar.length} farklı durum gözledin.`;
  }
  if (id === 'ari') metin += ' Arılar seni fark etti; uzaklaşmak iyi olur.';
  return metin;
}
export function koloniSatiri(d, id) {
  const kol = KOLONILER[id];
  const kayit = botanikAlani(d.k).koloniler[id] || [];
  const m = M.mesafe(d.oyuncu, kol);
  const yer = m <= KOLONI_MENZIL ? 'yanındasın' : M.yerTarifi(d.oyuncu, kol);
  return `${kol.ad}: ${kayit.length ? `${kayit.length} / ${kol.durumlar.length} durum gözlendi` : 'henüz incelenmedi'}; ${yer}`;
}

// Bitki sayfası: tozlaşma ve tohum yayılımı
export function bitkiSatirlari(k, id) {
  const l = [];
  const t = tozlasmaSatiri(k, id);
  if (t) l.push(t);
  if (YAYANLAR[id]) {
    const b = botanikAlani(k);
    const gorulen = YAYANLAR[id].filter((tur) => b.yayilim[`${id}:${tur}`]);
    l.push(`Tohumlarını taşıyan hayvanlar: ${YAYANLAR[id].map((tur) => AYAK_SOZ[tur] + (gorulen.includes(tur) ? ' (gözledin)' : '')).join(', ')}.`);
  }
  return l;
}

let sayac = 0;
let sonGun = 0;
export function guncelle(d, dt) {
  sayac += dt;
  if (sayac < 2) return;
  sayac = 0;
  botanikAlani(d.k);
  const gun = gunu(d.k);
  if (gun !== sonGun) {
    if (sonGun) gunluk(d);
    sonGun = gun;
  }
  if (!d.dinleniyor) tozlasmaDene(d);
}
