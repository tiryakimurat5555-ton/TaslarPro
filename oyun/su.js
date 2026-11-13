// Aşama 11: nehir ve gölet araştırmaları (karar 94, 99) ve istasyon çevresindeki yaşam (karar 92).
// Saf mantık. Dalış ya da sualtı mekaniği yok (karar 94): kıyıdan ya da tekneden ölçüm, gözlem ve hayvan geçiş noktaları.
// Sayılar ÖNERİDİR.
import * as M from './mantik.js';
import * as E from './ekosistem.js';
import * as K from './kesif.js';
import { GOLET, nehirY, NEHIR_YARI, TURLER } from './veri.js';
import { KUCUKLER } from './kucukler.js';

// Ölçüm noktaları: nehrin farklı habitatları, gölet ve güneydeki sulak alan
export const SU_NOKTALARI = [
  { id: 'batiYatak', ad: 'Batı nehir yatağı', tip: 'nehir', x: -150, akis: 0.6, golge: 0.2, tarif: 'Nehrin geniş ve derin kıvrımı. Su yavaş akar, dipte çamur birikir; su aygırları gündüzleri burada dinlenir.' },
  { id: 'batiGecit', ad: 'Batı geçidi sığlığı', tip: 'gecit', x: -60, akis: 1.3, golge: 0, tarif: 'Çakıllı, diz boyu bir sığlık. Su hızlı ve oksijenli akar; karadaki hayvanlar karşıya buradan geçer.' },
  { id: 'kumKivrim', ad: 'Kumsal kıvrım', tip: 'nehir', x: 10, akis: 0.8, golge: 0.1, tarif: 'Nehrin iç kıvrımında kumlu bir yarım ay. Timsahlar burada güneşlenir, kum kırlangıçları yarlara yuva kazar.' },
  { id: 'doguGecit', ad: 'Doğu geçidi sığlığı', tip: 'gecit', x: 70, akis: 1.3, golge: 0, tarif: 'İkinci sığ geçit. Göç eden zebra ve gnu sürüleri nehri burada aşar; timsahlar pusuya yatar.' },
  { id: 'galeriKiyi', ad: 'Galeri ormanı kıyısı', tip: 'nehir', x: 145, akis: 0.7, golge: 0.7, tarif: 'Ağaçların gölgelediği serin kıyı. Kökler suya sarkar; balıklar ve kurbağalar gölgede saklanır.' },
  { id: 'golet', ad: 'Gölet', tip: 'golet', x: GOLET.x, y: GOLET.y, akis: 0, golge: 0.1, tarif: 'Yağmurla dolan, kurakta çekilen durgun su. Bütün savan buraya su içmeye gelir.' },
  { id: 'sulak', ad: 'Güney sulak alanı', tip: 'sulak', x: -20, y: nehirY(-20) - 35, akis: 0.1, golge: 0.15, tarif: 'Nehrin güneyinde sazlık ve papirüslerle örtülü sığ bataklık. Su kuşları ve kurbağaların cenneti.' },
];
const NOKTA = Object.fromEntries(SU_NOKTALARI.map((n) => [n.id, n]));
const noktaY = (n) => (n.y !== undefined ? n.y : nehirY(n.x));
export const noktaKonumu = (n) => ({ x: n.x, y: noktaY(n) });
const MENZIL = 16;

export function suAlani(k) {
  if (!k.su || typeof k.su !== 'object') k.su = {};
  if (!k.su.olcumler || typeof k.su.olcumler !== 'object' || Array.isArray(k.su.olcumler)) k.su.olcumler = {};
  if (!k.su.gecisler || typeof k.su.gecisler !== 'object' || Array.isArray(k.su.gecisler)) k.su.gecisler = {};
  for (const [id, l] of Object.entries(k.su.olcumler)) {
    if (!NOKTA[id] || !Array.isArray(l)) delete k.su.olcumler[id];
    else k.su.olcumler[id] = l.filter((o) => o && ['dk', 'sicaklik', 'bulaniklik', 'akis', 'duzey', 'oksijen'].every((a) => Number.isFinite(o[a])) && (o.mevsim === 'yagisli' || o.mevsim === 'kurak')).slice(0, 12);
  }
  for (const [id, t] of Object.entries(k.su.gecisler)) {
    if (!NOKTA[id] || !t || typeof t !== 'object') delete k.su.gecisler[id];
    else for (const [tur, n] of Object.entries(t)) if (!TURLER[tur] || !Number.isFinite(n)) delete t[tur];
  }
  if (!Number.isFinite(k.su.istasyonSon)) k.su.istasyonSon = k.dk || 0; // açılışta hoş geldin konuşmasını bölmesin
  return k.su;
}

// Oyuncunun yanındaki ölçüm noktası (teknedeyken nehir noktalarına daha uzaktan)
export function yakinNokta(d) {
  if (d.k.magara) return null;
  const o = d.oyuncu;
  let en = null;
  let enM = Infinity;
  for (const n of SU_NOKTALARI) {
    const m = Math.hypot(o.x - n.x, o.y - noktaY(n));
    const sinir = n.tip === 'sulak' ? 30 : n.tip === 'golet' ? GOLET.r + 14 : d.k.teknede ? 30 : MENZIL;
    if (m < sinir && m < enM) {
      en = n;
      enM = m;
    }
  }
  return en;
}

// Suyun o anki ölçümü: oyunun gerçek ekosistem durumundan (hava, mevsim, nehir debisi, gölet düzeyi, alg)
export function olcumHesapla(k, n) {
  const eko = k.eko;
  const tk = E.takvim(M.gunNo(k.dk));
  const hava = eko.hava || { sicaklik: 28, tur: 'acik' };
  const saat = M.gunDakikasi(k.dk) / 60;
  const gunes = saat > 7 && saat < 18 ? Math.sin(((saat - 7) / 11) * Math.PI) : 0;
  let sicaklik;
  let bulaniklik;
  let akis = 0;
  let duzey;
  if (n.tip === 'golet') {
    const sig = 1 - Math.min(1, eko.golet);
    sicaklik = hava.sicaklik - 5 + sig * 6 + gunes * 3;
    bulaniklik = Math.min(1, 0.25 + eko.alg * 0.8 + (eko.yagmurVar ? 0.2 : 0));
    duzey = eko.golet;
  } else if (n.tip === 'sulak') {
    sicaklik = hava.sicaklik - 4 + gunes * 2;
    bulaniklik = Math.min(1, 0.35 + (tk.mevsim === 'kurak' ? 0.2 : 0));
    duzey = Math.min(1, eko.islaklik * 0.6 + eko.nehir * 0.4);
  } else {
    sicaklik = hava.sicaklik - 7 - n.golge * 2 + gunes * 1.5;
    bulaniklik = Math.min(1, 0.15 + eko.nehir * 0.45 + (eko.yagmurVar ? 0.25 : 0) + (eko.taskin ? 0.3 : 0));
    akis = n.akis * (0.25 + eko.nehir * 0.9);
    duzey = eko.nehir;
  }
  // Oksijen sıcakla ve algle azalır, akışla artar (mg/l)
  const oksijen = Math.max(1.5, Math.min(9.5, 9.2 - (sicaklik - 20) * 0.22 + akis * 1.2 - (n.tip === 'golet' ? eko.alg * 4 : 0) - (n.tip === 'sulak' ? 1.5 : 0)));
  return {
    dk: Math.round(k.dk),
    mevsim: tk.mevsim,
    sicaklik: Math.round(sicaklik * 10) / 10,
    bulaniklik: Math.round(bulaniklik * 100) / 100,
    akis: Math.round(akis * 100) / 100,
    duzey: Math.round(duzey * 100) / 100,
    oksijen: Math.round(oksijen * 10) / 10,
  };
}
const yuzde = (x) => `%${Math.round(x * 100)}`;
const berraklikSozu = (b) => (b < 0.3 ? 'berrak' : b < 0.55 ? 'biraz bulanık' : b < 0.8 ? 'bulanık' : 'çamurlu, çok bulanık');
const oksijenSozu = (o) => (o >= 6 ? 'balıklar için iyi' : o >= 4 ? 'yeterli' : 'düşük; balıklar yüzeye çıkıp hava yutar');
const fmt = (x) => String(x).replace('.', ',');

// "Suyu ölç": sıcaklık, berraklık, akış, oksijen; noktanın ilk ölçümü itibar verir, aynı noktada aynı gün bir kez
export function suOlc(d) {
  const k = d.k;
  const su = suAlani(k);
  const n = yakinNokta(d);
  if (!n) return 'Yakında bir ölçüm noktası yok. Nehrin kıyısına, geçitlere, gölete ya da güneydeki sulak alana git. Yerler menüsünde su ölçüm noktaları var.';
  if (n.tip === 'golet' && E.goletKurudu(k.eko)) return 'Gölet kurumuş; ölçülecek su kalmadı. Çatlamış çamurda hayvan izleri var.';
  const l = (su.olcumler[n.id] = su.olcumler[n.id] || []);
  const bugun = M.gunNo(k.dk);
  if (l.length && M.gunNo(l[0].dk) === bugun) return `${n.ad} bugün ölçüldü: su ${fmt(l[0].sicaklik)} derece, ${berraklikSozu(l[0].bulaniklik)}. Yarın yeniden ölçebilirsin.`;
  const o = olcumHesapla(k, n);
  const ilk = !l.length;
  const yeniMevsim = !l.some((x) => x.mevsim === o.mevsim);
  l.unshift(o);
  if (l.length > 12) l.length = 12;
  if (ilk) M.itibarEkle(d, 3);
  else if (yeniMevsim) M.itibarEkle(d, 2);
  const parcalar = [`${n.ad} ölçüldü. Su sıcaklığı ${fmt(o.sicaklik)} derece`, `su ${berraklikSozu(o.bulaniklik)}`];
  if (n.tip === 'nehir' || n.tip === 'gecit') parcalar.push(`akış saniyede ${fmt(o.akis)} metre`);
  parcalar.push(`çözünmüş oksijen litrede ${fmt(o.oksijen)} miligram, ${oksijenSozu(o.oksijen)}`);
  parcalar.push(`su düzeyi ${yuzde(o.duzey)}`);
  let m = parcalar.join(', ') + '.';
  if (l.length > 1) {
    const once = l.find((x) => x.mevsim !== o.mevsim) || l[1];
    const fark = o.sicaklik - once.sicaklik;
    if (Math.abs(fark) >= 0.5) m += ` ${once.mevsim !== o.mevsim ? 'Öbür mevsime' : 'Önceki ölçüme'} göre ${fmt(Math.abs(Math.round(fark * 10) / 10))} derece ${fark > 0 ? 'daha sıcak' : 'daha serin'}.`;
  }
  if (ilk) m += ` ${n.tarif}`;
  M.arsivOlay(d, `Su ölçümü: ${n.ad}, ${fmt(o.sicaklik)} derece.`);
  M.olay(d, 'suOlcum', m, 2);
  return m;
}

// Suda yaşayanları gözle: noktanın tipine uyan balık, kurbağa ve su kuşlarından biri (küçük canlı arşivine yazılır)
const SU_GRUPLARI = ['Balık', 'Amfibi', 'Kuş', 'Sürüngen', 'Böcek'];
export function sudakiler(d, n) {
  const k = d.k;
  const yer = n.tip === 'gecit' ? 'nehir' : n.tip;
  const evre = M.gunEvresi(k.dk);
  const tk = E.takvim(M.gunNo(k.dk));
  return Object.keys(KUCUKLER).filter((id) => {
    const c = KUCUKLER[id];
    if (!c.yer.includes(yer) || !SU_GRUPLARI.includes(c.grup)) return false;
    if (c.mevsim && c.mevsim !== tk.mevsim) return false;
    if (c.zaman === 'gunduz' && evre === 'gece') return false;
    if (c.zaman === 'gece' && evre === 'gunduz') return false;
    if (c.zaman === 'alaca' && evre !== 'safak' && evre !== 'aksam') return false;
    return true;
  });
}
export function suyuGozle(d) {
  const k = d.k;
  const n = yakinNokta(d);
  if (!n) return 'Yakında su yok. Bir ölçüm noktasına git.';
  if (n.tip === 'golet' && E.goletKurudu(k.eko)) return 'Gölet kurumuş. Çamurun altında kurbağalar yağmuru bekliyor olmalı.';
  const l = sudakiler(d, n);
  if (!l.length) return `${n.ad} şu an sessiz. Başka bir saatte ya da mevsimde yeniden bak.`;
  // Arşivde olmayanlar ve sık görülenler öne
  const agirlik = l.map((id) => (KUCUKLER[id].sik || 1) * (k.arsiv.kucukler && k.arsiv.kucukler[id] ? 1 : 2) * (KUCUKLER[id].nadir ? 0.3 : 1));
  let r = Math.random() * agirlik.reduce((a, b) => a + b, 0);
  let i = 0;
  while (i < l.length - 1 && (r -= agirlik[i]) > 0) i++;
  if (!k.arsiv.kucukler || typeof k.arsiv.kucukler !== 'object') k.arsiv.kucukler = {};
  return K.kucukKaydet(d, l[i], `${n.ad}: `);
}

// Hayvan geçiş noktaları (karar 99): geçitlerde son bir günün iz noktaları türlere göre sayılır
export function gecisSay(d) {
  const k = d.k;
  const su = suAlani(k);
  const n = yakinNokta(d);
  if (!n) return 'Yakında bir ölçüm noktası yok.';
  if (n.tip !== 'gecit') return 'Geçiş sayımı nehrin iki geçidinde yapılır; karadaki hayvanlar nehri oradan aşar.';
  const yer = noktaKonumu(n);
  const sayim = {};
  for (const g of k.gruplar) {
    if (!TURLER[g.tur] || !Array.isArray(g.iz)) continue;
    const izler = g.iz.filter((p) => p && k.dk - p.dk < 1440 && Math.abs(p.x - yer.x) < 14 && Math.abs(p.y - yer.y) < 14);
    if (izler.length) sayim[g.tur] = (sayim[g.tur] || 0) + 1;
  }
  // Göç geçişleri de sayılır (b.gecis)
  for (const b of k.hayvanlar) if (!b.olu && b.gecis && Math.abs(b.x - yer.x) < 14) sayim[b.tur] = sayim[b.tur] || 1;
  const t = (su.gecisler[n.id] = su.gecisler[n.id] || {});
  const turler = Object.keys(sayim);
  if (!turler.length) return `${n.ad}: son bir günde buradan geçen hayvan izi yok. Yağmur izleri silmiş olabilir.`;
  let yeni = 0;
  for (const tur of turler) {
    if (!t[tur]) yeni++;
    t[tur] = (t[tur] || 0) + sayim[tur];
  }
  if (yeni) M.itibarEkle(d, Math.min(4, yeni));
  const m = `${n.ad}, son bir günde geçenler: ${turler.map((tur) => M.kucukHarf(M.SOZ[tur]) + (sayim[tur] > 1 ? ` (${sayim[tur]} sürü)` : '')).join(', ')}. Bu geçitte bugüne kadar ${Object.keys(t).length} türün geçişi kayıtlı.`;
  M.arsivOlay(d, `Geçiş sayımı: ${n.ad}, ${turler.length} tür.`);
  M.olay(d, 'gecisSayim', m, 2);
  return m;
}

// Merkezin araştırmaları için ilerleme
export const olcumIlerleme = (k) => {
  const su = k.su || {};
  let n = 0;
  for (const p of SU_NOKTALARI) {
    const l = (su.olcumler || {})[p.id] || [];
    if (l.some((x) => x.mevsim === 'yagisli')) n++;
    if (l.some((x) => x.mevsim === 'kurak')) n++;
  }
  return n;
};
export const gecisTurSayisi = (k) => new Set(Object.values((k.su && k.su.gecisler) || {}).flatMap((t) => Object.keys(t))).size;
export const suCanlisiSayisi = (k) =>
  Object.keys(k.arsiv.kucukler || {}).filter((id) => KUCUKLER[id] && ['Balık', 'Amfibi'].includes(KUCUKLER[id].grup)).length;

// Menü satırları
export function noktaSatirlari(d) {
  const k = d.k;
  const su = suAlani(k);
  return SU_NOKTALARI.map((n) => {
    const l = su.olcumler[n.id] || [];
    const g = su.gecisler[n.id];
    let durum = l.length ? `son ölçüm ${M.gunNo(l[0].dk)}. gün, ${fmt(l[0].sicaklik)} derece, ${berraklikSozu(l[0].bulaniklik)}` : 'henüz ölçülmedi';
    const mevsimler = ['yagisli', 'kurak'].filter((m) => l.some((x) => x.mevsim === m)).map((m) => (m === 'yagisli' ? 'yağışlı' : 'kurak'));
    if (mevsimler.length) durum += `; ölçülen mevsimler: ${mevsimler.join(' ve ')}`;
    if (g && Object.keys(g).length) durum += `; geçiş kaydı ${Object.keys(g).length} tür`;
    return { n, konum: noktaKonumu(n), metin: `${n.ad}: ${durum}` };
  });
}
export function suRaporu(k) {
  const su = k.su || {};
  const p = [`Ölçüm: ${olcumIlerleme(k)} / ${SU_NOKTALARI.length * 2} nokta ve mevsim`, `geçitlerde ${gecisTurSayisi(k)} türün geçişi`, `${suCanlisiSayisi(k)} balık ve kurbağa türü`];
  const g = (su.olcumler || {}).golet;
  if (g && g.length) p.push(`gölet son ölçümde ${fmt(g[0].sicaklik)} derece, oksijen ${fmt(g[0].oksijen)}`);
  return p.join(', ') + '.';
}

// ---------- İstasyonun çevresindeki yaşam (karar 92) ----------
// İstasyondayken ara sıra çevredeki küçük bir canlı fark edilir; ilk kez görülen arşive yazılır.
const ISTASYON_ANLARI = {
  dokumaci: 'Garajın yanındaki akasyada köy dokumacıları yeşil otlardan yuva örüyor; erkekler yuvanın altında baş aşağı sarkıp kanat çırpıyor.',
  sigircik: 'Görkemli sığırcıklar laboratuvarın basamağında, düşen kırıntıları kapışıyor; tüyleri güneşte mavi ve turuncu parlıyor.',
  becTavugu: 'Bir miğferli beç tavuğu sürüsü çadırın arkasından tıkırdayarak geçiyor, yerdeki böcekleri eşeliyor.',
  kordonMavisi: 'Kırmızı yanaklı kordonmavileri su deposunun damlayan musluğunda sırayla su içiyor.',
  fareKusu: 'Mavi enseli fare kuşları bir çalının dalında yan yana sıkışmış, birbirlerini tımar ediyor.',
  kayaAgamasi: 'Kırmızı başlı bir erkek kaya agaması garajın çatısında başını sallayarak bölgesini ilan ediyor.',
  balArisi: 'Afrika bal arıları su deposunun yoğuşmasından su topluyor; yakında bir kovan olmalı.',
  kralKelebegi: 'Turuncu bir Afrika kral kelebeği istasyonun çiçekli çalısında süzülüyor.',
  vervet: 'Bir vervet maymunu ailesi çadırın yanında dolaşıyor; yavru, açık kalmış bir kutuyu karıştırmaya çalışıyor.',
  ishakkusu: 'Karanlıkta bir Afrika ishakkuşunun yumuşak, kesik ötüşü duyuluyor; garajın çatısından avlanıyor.',
  evGeckosu: 'Laboratuvarın lambasının çevresinde toplanan böcekleri iki ev geckosu avlıyor; ayakları camda yapışkan izler bırakıyor.',
  gurultuKurbagasi: 'Su deposunun dibindeki ıslak toprakta bir kara kurbağası gırtlaktan, horlar gibi ötüyor.',
  circir: 'Çadırın çevresinde tarla cırcır böcekleri durmadan ötüyor; gece onların sesiyle doluyor.',
  savanTavsani: 'Bir savan tavşanı garaj ışığının kenarında ot kemiriyor, kulakları sana dönük.',
  akKarinliKirpi: 'Ak karınlı bir kirpi çadırın önünden hızla geçiyor; burnunu yere sürterek böcek arıyor.',
};
export function istasyonYasami(d) {
  const k = d.k;
  const su = k.su;
  if (!su || k.magara || k.aracta || M.bolgeBul(d.oyuncu.x, d.oyuncu.y) !== 'istasyon') return;
  if (k.dk - su.istasyonSon < 40) return;
  su.istasyonSon = k.dk + Math.random() * 30;
  const evre = M.gunEvresi(k.dk);
  const gece = evre === 'gece' || evre === 'aksam';
  const l = Object.keys(ISTASYON_ANLARI).filter((id) => KUCUKLER[id] && (KUCUKLER[id].zaman === 'gece') === gece);
  if (!l.length) return;
  const id = l[Math.floor(Math.random() * l.length)];
  if (!k.arsiv.kucukler || typeof k.arsiv.kucukler !== 'object') k.arsiv.kucukler = {};
  if (!k.arsiv.kucukler[id]) {
    K.kucukKaydet(d, id, 'İstasyonun çevresinde: ');
    return;
  }
  k.arsiv.kucukler[id].sayi = (k.arsiv.kucukler[id].sayi || 0) + 1;
  M.olay(d, 'istasyonAni', ISTASYON_ANLARI[id], 1);
}

let sayac = 0;
export function guncelle(d, dt) {
  sayac += dt;
  if (sayac < 3) return;
  sayac = 0;
  if (!d._suOnarildi) {
    suAlani(d.k);
    d._suOnarildi = true;
  }
  istasyonYasami(d);
}
