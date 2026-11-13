// Aşama 18: hayvan iletişimi (karar 108). Saf mantık; Il.guncelle(d, dt) her karede, işleri 2 sn'de bir.
// Koku işaretleme (yerde koku işareti bırakır; İzleri incele bunu da bulur), selamlaşma (yaban köpekleri avdan önce),
// aslanların gece kükreme korosu (uzaktan duyulur), fillerin uzak çağrıyı dinlemesi, otçulların beden diliyle uyarısı.
// Olasılıklar ÖNERİDİR.
import * as M from './mantik.js';
import { TURLER } from './veri.js';

const ISARET_OMRU = 2 * 1440; // oyun dakikası
const ISARET_SINIRI = 40;

export const ILETISIM = {
  kokuIsaretleme: {
    p: 0.004,
    planlar: ['gez', 'dinlen', 'otla'],
    sure: 14,
    turler: {
      aslan: 'bir çalıya idrar püskürtüp toprağı arka ayaklarıyla eşeliyor',
      leopar: 'bir ağaç gövdesini tırmalayıp yanağını sürtüyor',
      cita: 'eğik bir ağaca tırmanıp kokusunu bırakıyor; çitalar bu ağaçları birbirine mesaj panosu gibi kullanır',
      sirtlan: 'kuyruğunun altındaki bezden bir ot sapına macun gibi koku sürüyor',
      yabanKopegi: 'idrarıyla sürünün bölgesini işaretliyor',
      gergedan: 'ortak dışkı yığınına dışkılayıp ayaklarıyla dağıtıyor; bu yığınlar komşu gergedanların haber panosudur',
    },
    isaret: {
      aslan: 'idrar kokusu sinmiş bir çalı, yanında eşelenmiş toprak',
      leopar: 'tırmık izli bir ağaç gövdesi',
      cita: 'kabuğu cilalanmış eğik bir ağaç',
      sirtlan: 'ot saplarına sürülmüş koyu, keskin kokulu macun',
      yabanKopegi: 'keskin idrar kokusu',
      gergedan: 'dağıtılmış büyük bir dışkı yığını',
    },
  },
  selamlasma: {
    p: 0.003,
    planlar: ['dinlen', 'gez', 'otla', 'su'],
    sure: 10,
    turler: {
      fil: 'hortumlarını birbirine dolayıp ağızlarına uzatıyor, kulak çırpıp gürlüyorlar',
      yabanKopegi: 'kuyruk sallayıp birbirlerinin ağzını yalıyor, cıvıltılı seslerle selamlaşıyorlar',
      sirtlan: 'yan yana durup bacağını kaldırarak birbirini kokluyor',
      zebra: 'burun buruna gelip kokluyor, başlarını sallıyorlar',
      aslan: 'başlarını ve boyunlarını birbirine sürtüyorlar; bu, grubun bağını tazeler',
    },
  },
  kukremeKorosu: {
    p: 0.004,
    planlar: ['dinlen', 'uyu', 'gez'],
    gece: true,
    sure: 16,
    turler: { aslan: 'hep birlikte kükrüyorlar; bu ses kilometrelerce duyulur ve bölgenin sahibi olduklarını ilan eder' },
  },
  infrasesDinleme: {
    p: 0.003,
    planlar: ['otla', 'gez', 'dinlen'],
    gunduz: true,
    sure: 18,
    turler: { fil: 'durup kulaklarını açtılar, bir ayaklarını hafifçe kaldırdılar; insan kulağının duyamadığı alçak gürlemelerle uzaktaki bir sürüyle haberleşiyorlar, yerdeki titreşimi de ayaklarıyla algılarlar' },
  },
  bedenDiliUyari: {
    p: 0.02, // yalnızca yakında yırtıcı varken
    planlar: ['otla', 'gez', 'dinlen', 'su'],
    yirticiYakin: 60,
    sure: 8,
    turler: {
      impala: 'kuyruğunu kaldırıp beyaz arka lekesini gösteriyor; sürüye tehlikeyi sessizce bildiriyor',
      ceylan: 'dört ayağı birden yerden kesilerek sekiyor; avcıya seni gördüm, boşuna kovalama diyor',
      zebra: 'başını kaldırıp kulaklarını tehlikeye çeviriyor, kuyruğunu sertçe sallıyor; sürü aynı yöne bakıyor',
      gnu: 'başını sallayıp toynağını yere vuruyor; sürü uyanık',
    },
  },
};
export const ILETISIM_DAVRANISLARI = Object.keys(ILETISIM);

export function isaretAlani(k) {
  if (!Array.isArray(k.isaretler)) k.isaretler = [];
  k.isaretler = k.isaretler.filter((x) => x && TURLER[x.tur] && Number.isFinite(x.x) && Number.isFinite(x.y) && Number.isFinite(x.dk) && k.dk - x.dk < ISARET_OMRU);
  return k.isaretler;
}

function yirticiYakinMi(d, g, menzil) {
  return d.k.gruplar.some((x) => x !== g && TURLER[x.tur] && TURLER[x.tur].yirtici && (TURLER[x.tur].avlar || []).includes(g.tur) && M.mesafe(x, g) < menzil && M.uyeler(d, x).length);
}
function gorunurMu(d, b) {
  return !d.k.magara && M.mesafe(d.oyuncu, b) <= M.durbunMenzili(d.k.dk, d.k);
}

function dene(d, g, id) {
  const k = d.k;
  const tanim = ILETISIM[id];
  const metin = tanim.turler[g.tur];
  if (!metin || !tanim.planlar.includes(g.plan) || g.alarm > 0) return false;
  const evre = M.gunEvresi(k.dk);
  if (tanim.gece && evre !== 'gece' && evre !== 'aksam') return false;
  if (tanim.gunduz && evre === 'gece') return false;
  if (tanim.yirticiYakin && !yirticiYakinMi(d, g, tanim.yirticiYakin)) return false;
  if (Math.random() >= tanim.p) return false;
  const u = M.uyeler(d, g).filter((b) => b.evre !== 'yavru' && !(b.ozel && b.ozel.bitis > d.zaman));
  if (!u.length) return false;
  const katilan = id === 'kokuIsaretleme' ? u.slice(0, 1) : id === 'selamlasma' ? u.slice(0, Math.min(u.length, 4)) : u;
  if (id === 'selamlasma' && katilan.length < 2) return false;
  katilan.forEach((b) => (b.ozel = { davranis: id, bitis: d.zaman + tanim.sure + Math.random() * 6 }));
  const b = katilan[0];
  if (id === 'kokuIsaretleme') {
    const l = isaretAlani(k);
    l.push({ tur: g.tur, x: Math.round(b.x * 10) / 10, y: Math.round(b.y * 10) / 10, dk: k.dk });
    if (l.length > ISARET_SINIRI) l.splice(0, l.length - ISARET_SINIRI);
  }
  const ad = katilan.length === 1 ? (M.taninmisMi(b) ? M.bireyAdi(b) : `Bir ${M.kucukHarf(M.SOZ[g.tur])}`) : `${M.BuyukHarf(M.SOZ[g.tur])} grubundakiler`;
  const yer = M.BuyukHarf(M.yerTarifi(d.oyuncu, b));
  if (id === 'kukremeKorosu') {
    // Kükreme uzaktan duyulur: görünmese de 400 metreye kadar haber verilir ve yönünden sesi gelir
    const m = M.mesafe(d.oyuncu, b);
    if (m < 400 && !k.magara) M.olay(d, 'iletisim', gorunurMu(d, b) ? `${ad} ${metin}. ${yer}.` : `Uzaktan aslan kükremeleri geliyor: bir grup ${metin}. ${yer}.`, 3, { id: b.id, ses: true, duyma: 400 });
    return true;
  }
  if (gorunurMu(d, b)) M.olay(d, 'iletisim', `${ad} ${metin}. ${yer}.`, 2, { id: b.id, ses: id === 'selamlasma' && (g.tur === 'fil' || g.tur === 'yabanKopegi'), duyma: 120 });
  return true;
}

// Yaban köpekleri avdan hemen önce selamlaşma töreni yapar (gerçekte avı başlatan bu törendir)
function avOncesi(d, g) {
  if (g.tur !== 'yabanKopegi') return;
  if (g.plan === 'av' && !g.avSelam) {
    g.avSelam = true;
    const u = M.uyeler(d, g).filter((b) => b.evre !== 'yavru');
    if (u.length < 2) return;
    u.forEach((b) => (b.ozel = { davranis: 'selamlasma', bitis: d.zaman + 8 }));
    if (gorunurMu(d, u[0])) M.olay(d, 'iletisim', `Yaban köpekleri avdan önce selamlaşma törenine başladı: ${ILETISIM.selamlasma.turler.yabanKopegi}. Birazdan ava çıkacaklar. ${M.BuyukHarf(M.yerTarifi(d.oyuncu, u[0]))}.`, 3, { id: u[0].id, ses: true, duyma: 120 });
  } else if (g.plan !== 'av') g.avSelam = false;
}

// İzleri incelerken bulunan koku işaretleri (karar 93: izler, sesler ve işaretler yaşam alanı bulmaya yardım eder)
export function isaretSatiri(d) {
  const k = d.k;
  const o = d.oyuncu;
  const l = isaretAlani(k).filter((x) => Math.hypot(x.x - o.x, x.y - o.y) < 12).sort((a, b) => b.dk - a.dk);
  if (!l.length) return '';
  const x = l[0];
  const yas = k.dk - x.dk;
  const tanidik = !!k.arsiv.turler[x.tur];
  const kim = tanidik ? M.kucukHarf(M.SOZ[x.tur]) : 'tanımadığın bir hayvan';
  const tazelik = yas < 120 ? 'çok taze' : yas < 720 ? 'birkaç saatlik' : 'bir günü geçmiş';
  return ` Ayrıca bir koku işareti var: ${ILETISIM.kokuIsaretleme.isaret[x.tur]}. ${M.BuyukHarf(kim)} bırakmış, ${tazelik}. Bu bölgenin sahipli olduğunu gösterir.`;
}

// Tür sayfası: türün iletişim biçimleri, gözlenenler işaretli
export function turSatirlari(d, tur) {
  const tk = d.k.arsiv.turler[tur];
  const l = ILETISIM_DAVRANISLARI.filter((id) => ILETISIM[id].turler[tur]);
  if (!l.length) return [];
  const goruldu = l.filter((id) => tk && tk.davranislar.includes(id));
  const adlar = { kokuIsaretleme: 'koku işaretleme', selamlasma: 'selamlaşma', kukremeKorosu: 'kükreme korosu', infrasesDinleme: 'alçak gürlemelerle uzak iletişim', bedenDiliUyari: 'beden diliyle uyarı' };
  return [`İletişim biçimleri: ${l.map((id) => adlar[id] + (goruldu.includes(id) ? ' (gözledin)' : '')).join(', ')}.`];
}

let sayac = 0;
export function guncelle(d, dt) {
  sayac += dt;
  if (sayac < 2) return;
  sayac = 0;
  if (d.dinleniyor) return;
  for (const g of d.k.gruplar) {
    if (!TURLER[g.tur] || g.goc) continue;
    avOncesi(d, g);
    for (const id of ILETISIM_DAVRANISLARI) if (dene(d, g, id)) break;
  }
}
