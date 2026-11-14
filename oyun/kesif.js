// ==== VAHŞİ YAŞAM: KEŞİF (brif Aşama 6) ====
// Küçük canlıları arama (karar 48, 94, 95), mağara ekosistemi (karar 98), yarasaların akşam çıkışı,
// kaçak avcıların tel tuzakları ve izleri (karar 60: sınırlı kapsam; oyuncu bulur, söker, bildirir, hayvanı kurtarır).
import { TURLER, MAGARA, ISTASYON, YARICAP, nehirY, NEHIR_YARI, KUTUP, KUTUP_SIRASI } from './veri.js';
import * as Kt from './kutup.js';
import * as M from './mantik.js';
import * as E from './ekosistem.js';
import { KUCUKLER, MAGARA_ODALARI, UZAK_ALANLAR, UZAK_SIRASI, bulunabilirler, odaListesi, aktifOda, bolumAdi, alanCanlilari } from './kucukler.js';

const kucukHarf = (s) => s.toLocaleLowerCase('tr-TR');
const yerTarifi = (o, h) => `${M.saatSozu(M.saatYonu(o, h))}, ${M.metreSozu(M.mesafe(o, h))}`;

export function kesifHazirla(k) {
  if (!k.arsiv.kucukler || typeof k.arsiv.kucukler !== 'object') k.arsiv.kucukler = {};
  if (!k.arsiv.magara || !Array.isArray(k.arsiv.magara.odalar)) k.arsiv.magara = { odalar: [] };
  if (!k.kacak || !Array.isArray(k.kacak.tuzaklar)) k.kacak = { tuzaklar: [], bulunan: 0, kurtarilan: 0, olen: 0, izler: 0 };
  if (k.magara && (typeof k.magara.oda !== 'number' || (k.magara.alan && !UZAK_ALANLAR[k.magara.alan]))) k.magara = null;
  if (k.magara) k.magara.oda = Math.max(0, Math.min(odaListesi(k.magara.alan).length - 1, Math.floor(k.magara.oda) || 0));
  if (!k.arsiv.uzak || typeof k.arsiv.uzak !== 'object' || Array.isArray(k.arsiv.uzak)) k.arsiv.uzak = {};
  for (const a of Object.keys(k.arsiv.uzak)) if (!UZAK_ALANLAR[a] || !Array.isArray(k.arsiv.uzak[a])) delete k.arsiv.uzak[a];
}

// ---------- Küçük canlılar ----------
export function kucukKaydet(d, id, metinOn = '') {
  const k = d.k;
  const c = KUCUKLER[id];
  const yer = k.magara ? (k.magara.alan ? `${bolumAdi(k)}, ${aktifOda(k).ad}` : aktifOda(k).ad) : M.bolgeAdi(d.oyuncu.x, d.oyuncu.y);
  let a = k.arsiv.kucukler[id];
  d.sonKucuk = { id, zaman: d.zaman };
  d.sonKucukAd = c.ad;
  if (!a) {
    a = k.arsiv.kucukler[id] = { ilkDk: k.dk, ilkBolge: yer, sayi: 1 };
    M.itibarEkle(d, c.nadir ? 6 : 3);
    M.arsivOlay(d, `Yeni küçük canlı: ${c.ad}${c.nadir ? ' (nadir)' : ''}, ${yer}.`);
    const ses = c.ses ? ` Sesi: ${c.ses}` : '';
    const m = `${metinOn}${c.nadir ? 'Nadir bir keşif! ' : ''}Yeni tür: ${c.ad}, bilimsel adı ${c.bilimsel}, ${kucukHarf(c.grup)}. ${c.tarif}${ses}`;
    M.olay(d, 'yeniKucuk', m, 4, { nadir: !!c.nadir, kucuk: id });
    return m;
  }
  a.sayi += 1;
  const m = `${metinOn}${c.ad}. ${c.tarif.split('. ')[0].replace(/\.$/, '')}.`;
  M.olay(d, 'kucuk', m, 3, { kucuk: id });
  return m;
}
export function kucukAra(d) {
  const k = d.k;
  if (d.sonArama && d.zaman - d.sonArama < 3.5) {
    const m = 'Sessizce bekleyip çevreni dinliyorsun. Biraz sonra yeniden ara.';
    M.olay(d, 'kucuk', m, 2);
    return m;
  }
  d.sonArama = d.zaman;
  M.efekt(d, 'fener_tik', 0.7);
  const evre = M.evreSimdi(k);
  const tk = E.takvim(M.gunNo(k.dk));
  const yagmur = M.kucukYagmur(k);
  const oda = k.magara ? aktifOda(k).id : null;
  const alan = k.magara ? k.magara.alan || null : null;
  const bolge = M.bolgeBul(d.oyuncu.x, d.oyuncu.y);
  // Termitlerin çiftleşme uçuşu: yağmurdan sonraki gece termit tepelerinde
  if (!oda && bolge === 'termit' && evre === 'gece' && k.eko && k.eko.yagisBugun > 3 && !k.arsiv.kucukler.termitUcusu) {
    k.arsiv.kucukler.termitUcusu = { ilkDk: k.dk, ilkBolge: 'Termit tepeleri', sayi: 1, ozel: true };
    M.itibarEkle(d, 6);
    const o = KUCUKLER.termit.ozel;
    M.arsivOlay(d, `Gözlendi: ${o.ad}.`);
    const m = `Nadir bir an! ${o.ad}. ${o.tarif}`;
    M.olay(d, 'yeniKucuk', m, 4, { nadir: true });
    return m;
  }
  const liste = bulunabilirler({ bolge, oda, evre, mevsim: M.kucukMevsimi(k), yagmur, alan });
  let basari = oda ? 0.85 : 0.75;
  if (!oda && evre === 'gece' && !(k.ekipman.geceDurbunu || k.ekipman.termal)) basari = 0.5;
  basari += M.zorlukCarpani(k, 'kesif', [0.12, 0, -0.1]);
  if (!liste.length || d.rng() > basari) {
    const m = alan ? 'Dürbünle ve sabırla çevreni taradın ama bu kez bir şey göremedin. Başka bir noktada ya da başka bir saatte dene.' : oda ? 'Fenerinle kayaların çatlaklarına baktın ama bu kez bir şey göremedin.' : M.oyuncuKutupta(k) ? 'Karın, taşların ve kıyının çevresine baktın ama bu kez bir şey göremedin. Başka bir yerde ya da başka bir saatte dene.' : evre === 'gece' ? 'Karanlıkta otların arasına baktın; yalnızca cırcır böceklerini duyuyorsun.' : 'Otların ve taşların arasına baktın ama bu kez bir şey göremedin. Başka bir yerde ya da başka bir saatte dene.';
    M.olay(d, 'kucuk', m, 2);
    return m;
  }
  const agirlik = liste.map((id) => {
    const c = KUCUKLER[id];
    // Az önce sesini duyduğun canlıyı aramak onu bulmayı kolaylaştırır (Aşama 17)
    const duyulan = d.sonDuyulan && d.sonDuyulan.id === id && d.zaman - d.sonDuyulan.zaman < 60 ? 5 : 1;
    return c.sik * (yagmur && c.yagmur ? 3 : 1) * (k.arsiv.kucukler[id] ? 1 : 1.6) * duyulan;
  });
  let r = d.rng() * agirlik.reduce((a, b) => a + b, 0);
  let id = liste[0];
  for (let i = 0; i < liste.length; i++) {
    r -= agirlik[i];
    if (r <= 0) {
      id = liste[i];
      break;
    }
  }
  return kucukKaydet(d, id);
}
export const kucukSayisi = (k) => Object.keys(k.arsiv.kucukler || {}).filter((id) => KUCUKLER[id]).length;

// ---------- Mağara ----------
export const magaraYakin = (d) => !d.k.magara && !d.k.aracta && M.mesafe(d.oyuncu, { x: MAGARA.x + 2, y: MAGARA.y + 8 }) < 14;
export function magarayaGir(d) {
  const k = d.k;
  if (k.magara) return 'Zaten mağaradasın.';
  if (k.aracta) return 'Araçla mağaraya girilmez; önce in.';
  if (!magaraYakin(d)) return `Mağara girişi ${yerTarifi(d.oyuncu, MAGARA)} uzakta. Yerler menüsünden Mağara girişi'ne git.`;
  if (!k.ekipman.magaraTakimi) return 'Mağaraya güvenle girmek için mağara takımı gerekir: kask, kafa lambası ve maske. Araştırma merkezinden alabilirsin.';
  d.rota = null;
  d.yaklasId = null;
  M.gozlemBitir(d);
  k.magara = { oda: 0 };
  return odaGir(d, 0);
}
function odaGir(d, i) {
  const k = d.k;
  if (k.magara.alan) return noktaGir(d, i);
  const oda = MAGARA_ODALARI[i];
  k.magara.oda = i;
  let ek = '';
  if (!k.arsiv.magara.odalar.includes(oda.id)) {
    k.arsiv.magara.odalar.push(oda.id);
    M.itibarEkle(d, 3);
    M.arsivOlay(d, `Mağara keşfi: ${oda.ad}.`);
    ek = ' Bu odaya ilk kez girdin.';
  }
  const yarasaUyur = oda.id === 'yarasa' && M.gunEvresi(k.dk) === 'gunduz' ? ' Yarasalar tavanda uyuyor; yüksek sesle konuşma.' : oda.id === 'yarasa' && M.geceMi(k.dk) ? ' Yarasaların çoğu şimdi dışarıda, meyve aramaya çıkmış.' : '';
  const m = `${oda.ad}, ${i + 1}. oda.${ek} ${oda.tarif}${yarasaUyur}${i < MAGARA_ODALARI.length - 1 ? ' Yukarı kaydırırsan ilerlersin.' : ' Burası mağaranın sonu.'}`;
  M.olay(d, 'magara', m, 3, { oda: oda.id });
  return m;
}
export function magaraIlerle(d) {
  const k = d.k;
  if (!k.magara) return 'Mağarada değilsin.';
  if (k.magara.oda >= odaListesi(k.magara.alan).length - 1) {
    const m = k.magara.alan ? 'Bu alanın son noktasındasın; geri dönebilirsin.' : 'Mağaranın en iç noktasındasın; daha ileri gidilmiyor.';
    M.olay(d, 'hata', m, 2);
    return m;
  }
  return odaGir(d, k.magara.oda + 1);
}
export function magaraGeri(d) {
  const k = d.k;
  if (!k.magara) return 'Mağarada değilsin.';
  if (k.magara.oda === 0) {
    if (k.magara.alan) {
      const m = 'Bu alanın ilk noktasındasın. İstasyona dönmek için menüde İstasyona dön satırını seç.';
      M.olay(d, 'hata', m, 2);
      return m;
    }
    return magaradanCik(d);
  }
  return odaGir(d, k.magara.oda - 1);
}
export function magaradanCik(d) {
  const k = d.k;
  if (!k.magara) return 'Mağarada değilsin.';
  k.magara = null;
  const m = 'Mağaradan çıktın. Gözlerin yeniden gün ışığına alışıyor.';
  M.olay(d, 'magara', m, 3, { cikis: true });
  return m;
}
export const odaTarifi = (k) => (k.magara ? `${k.magara.alan ? bolumAdi(k) + ', ' : ''}${aktifOda(k).ad}. ${aktifOda(k).tarif}` : '');

// ---------- Uzak araştırma alanları (Aşama 12, karar 17) ----------
// Ayrı bölümler: istasyondan araçla yolculuk (zaman akar, App bunu dinlenme döngüsüyle hesaplar), orada nokta nokta gezilir.
export const istasyondaMi = (d) => !d.k.magara && !d.k.teknede && M.mesafe(d.oyuncu, ISTASYON) < 30;
export function uzakDurumu(k, alan) {
  const a = UZAK_ALANLAR[alan];
  if (!a) return { acik: false, neden: 'Böyle bir alan yok.' };
  if (k.itibar < a.itibar) return { acik: false, neden: 'Bu alana izin için bilimsel itibarın henüz yetmiyor.' };
  return { acik: true, neden: '' };
}
// Yola çıkmadan önceki denetim ve izin/konaklama ücreti (yakıt sınırsız, karar 42); hata metni ya da null
export function uzakHazirla(d, alan) {
  const k = d.k;
  const a = UZAK_ALANLAR[alan];
  const dur = uzakDurumu(k, alan);
  if (!dur.acik) return dur.neden;
  if (!istasyondaMi(d)) return 'Saha gezilerine istasyondan çıkılır. Önce istasyona dön.';
  if (k.butce < a.ucret) return `Alan izni ve konaklama için ${a.ucret.toLocaleString('tr-TR')} lira gerekli; bütçe yetmiyor.`;
  k.butce -= a.ucret;
  d.rota = null;
  d.yaklasId = null;
  M.gozlemBitir(d);
  if (k.aracta) {
    k.aracta = false;
    d.aracHiz = 0;
  }
  return null;
}
export function uzagaVar(d, alan) {
  const k = d.k;
  k.magara = { oda: 0, alan };
  const ilk = !k.arsiv.uzak[alan];
  const a = UZAK_ALANLAR[alan];
  const m0 = noktaGir(d, 0, true);
  const m = `${a.ad} alanına vardın. ${ilk ? a.tarif + ' ' : ''}${m0}`;
  M.arsivOlay(d, `Saha gezisi: ${a.ad}.`);
  M.olay(d, 'magara', m, 3, { oda: a.noktalar[0].id, alan });
  return m;
}
function noktaGir(d, i, sessiz) {
  const k = d.k;
  const l = odaListesi(k.magara.alan);
  const n = l[i];
  k.magara.oda = i;
  const ziyaret = (k.arsiv.uzak[k.magara.alan] = k.arsiv.uzak[k.magara.alan] || []);
  let ek = '';
  if (!ziyaret.includes(n.id)) {
    ziyaret.push(n.id);
    M.itibarEkle(d, 3);
    ek = ' İlk kez buradasın.';
  }
  const bulunan = alanCanlilari(k.magara.alan).filter((id) => KUCUKLER[id].oda.includes(n.id) && k.arsiv.kucukler[id]).length;
  const toplam = alanCanlilari(k.magara.alan).filter((id) => KUCUKLER[id].oda.includes(n.id)).length;
  const m = `${n.ad}, ${i + 1}. nokta, ${l.length} noktadan.${ek} ${n.tarif} Burada bulduğun canlı: ${bulunan} / ${toplam}.${i < l.length - 1 ? ' Yukarı kaydırırsan sonraki noktaya geçersin.' : ' Burası son nokta.'}`;
  if (!sessiz) M.olay(d, 'magara', m, 3, { oda: n.id, alan: k.magara.alan });
  return m;
}
export function uzaktanDon(d) {
  const k = d.k;
  if (!k.magara || !k.magara.alan) return 'Saha gezisinde değilsin.';
  const a = UZAK_ALANLAR[k.magara.alan];
  k.magara = null;
  const m = `${a.ad} gezisinden istasyona döndün.`;
  M.olay(d, 'magara', m, 3, { cikis: true });
  return m;
}
// ---------- Kuzey Kutbu gezisi ----------
// Savandaki istasyondan uçakla kuzeydoğu Grönland'daki araştırma kulübesine gidilir; orası serbestçe dolaşılan ayrı bir haritadır.
export const KUTUP_GEZI = { ad: 'Kuzey Kutbu, kuzeydoğu Grönland kıyısı', itibar: 50, ucret: 2500, yol: 300, donus: 300 };
export const KULUBE_KAPI = Kt.dunya(Kt.ISTASYON_K.lx, Kt.ISTASYON_K.ly + 18); // kulübenin kuzeyindeki açıklık (kamera kulübenin içine düşmesin)
export function kutupDurumu(k) {
  if (k.itibar < KUTUP_GEZI.itibar) return { acik: false, neden: 'Kutup araştırma iznine bilimsel itibarın henüz yetmiyor.' };
  return { acik: true, neden: '' };
}
export function kutupHazirla(d) {
  const k = d.k;
  const dur = kutupDurumu(k);
  if (!dur.acik) return dur.neden;
  if (M.oyuncuKutupta(k)) return 'Zaten kutuptasın.';
  if (!istasyondaMi(d)) return 'Kutup gezisine istasyondan çıkılır. Önce istasyona dön.';
  if (k.butce < KUTUP_GEZI.ucret) return `Uçak, izin ve kulübe kirası için ${KUTUP_GEZI.ucret.toLocaleString('tr-TR')} lira gerekli; bütçe yetmiyor.`;
  k.butce -= KUTUP_GEZI.ucret;
  d.rota = null;
  d.yaklasId = null;
  d.dron = null;
  M.gozlemBitir(d);
  if (k.aracta) {
    k.aracta = false;
    d.aracHiz = 0;
  }
  return null;
}
export function kutbaVar(d) {
  const k = d.k;
  const ilk = !(k.kutup && k.kutup.ziyaret);
  if (!k.kutup || typeof k.kutup !== 'object') k.kutup = {};
  k.kutup.ziyaret = true;
  k.kutup.gelis = k.dk;
  k.kutup.gezi = (k.kutup.gezi || 0) + 1;
  k.teknede = false;
  Object.assign(d.oyuncu, { x: KULUBE_KAPI.x, y: KULUBE_KAPI.y, yon: 0 });
  const mev = Kt.MEVSIM_ADI[M.kutupMevsimi(k)];
  M.arsivOlay(d, 'Saha gezisi: Kuzey Kutbu.');
  const tanitim = ilk
    ? 'Kuzeydoğu Grönland kıyısındaki araştırma kulübesine indin. Kuzeyin deniz: yazın açık su ve yüzen buz parçaları, kışın donmuş deniz buzu. Güneyin taşlık tundra, batıda bir buzul dili, doğuda deniz kuşlarının yuvaladığı kayalık yar. Burada araç yok; yürüyerek araştırırsın. Kutup ayısına dikkat et: denizin buzunda fok avlar, karada da dolaşır. '
    : 'Grönland\'daki araştırma kulübesine döndün. ';
  const m = `${tanitim}Şimdi ${mev}. ${Kt.isikSozu(k.dk)} ${Kt.havaSozu(M.kutupHavasi(k), k.dk)}`;
  M.olay(d, 'kutup', m, 3, { gelis: true });
  return m;
}
export const kulubedeMi = (d) => M.oyuncuKutupta(d.k) && Math.hypot(d.oyuncu.x - KULUBE_KAPI.x, d.oyuncu.y - KULUBE_KAPI.y) < 30;
export function kutuptanHazirla(d) {
  if (!M.oyuncuKutupta(d.k)) return 'Kutupta değilsin.';
  if (!kulubedeMi(d)) return 'Dönüş uçağı kulübenin yanındaki pistten kalkar. Önce kulübeye dön.';
  d.rota = null;
  d.yaklasId = null;
  M.gozlemBitir(d);
  return null;
}
export function kutuptanDon(d) {
  const k = d.k;
  Object.assign(d.oyuncu, { x: ISTASYON.x + 1, y: ISTASYON.y - 2.5, yon: 0 });
  const m = 'Kutup gezisinden savandaki istasyona döndün. Kutupta topladığın numuneler laboratuvara teslim edilebilir.';
  M.olay(d, 'kutup', m, 3, { cikis: true });
  return m;
}
export function kutupSatiri(k) {
  const dur = kutupDurumu(k);
  const kayitli = KUTUP_SIRASI.filter((t) => k.arsiv.turler[t]).length;
  return `Kuzey Kutbu: ${dur.acik ? `uçakla ${String(KUTUP_GEZI.yol / 60).replace('.', ',')} saat, uçak, izin ve kulübe ${KUTUP_GEZI.ucret.toLocaleString('tr-TR')} lira` : 'kilitli'}. Kaydedilen kutup türü ${kayitli} / ${KUTUP_SIRASI.length}.`;
}
export function uzakSatirlari(k) {
  return UZAK_SIRASI.map((id) => {
    const a = UZAK_ALANLAR[id];
    const dur = uzakDurumu(k, id);
    const z = (k.arsiv.uzak && k.arsiv.uzak[id]) || [];
    const c = alanCanlilari(id);
    const bulunan = c.filter((x) => k.arsiv.kucukler[x]).length;
    return { id, a, dur, metin: `${a.ad}: ${dur.acik ? `yol ${String(Math.round((a.yol / 60) * 10) / 10).replace('.', ',')} saat, izin ve konaklama ${a.ucret.toLocaleString('tr-TR')} lira` : 'kilitli'}. Gezilen nokta ${z.length} / ${a.noktalar.length}, bulunan canlı ${bulunan} / ${c.length}.` };
  });
}
export const uzakIlerleme = (k, alan) => {
  const z = (k.arsiv.uzak && k.arsiv.uzak[alan]) || [];
  const bulunan = alanCanlilari(alan).filter((x) => k.arsiv.kucukler && k.arsiv.kucukler[x]).length;
  return Math.min(5, z.length) + Math.min(4, bulunan);
};

// ---------- Kaçak avcılık: tel tuzaklar (karar 60) ----------
const OTCULLAR = ['zebra', 'ceylan', 'impala', 'gnu', 'domuz', 'manda', 'zurafa'];
export function tuzakKurulumu(d) {
  // Günde bir çağrılır: kaçak avcılar bazen otçulların yollarına tel tuzak kurar
  const k = d.k;
  const devriye = k.koruma && k.koruma.devriye;
  const mucadele = k.koruma && k.koruma.projeler && k.koruma.projeler.kacakMucadele && k.koruma.projeler.kacakMucadele.durum === 'tamam';
  const baski = k.hikaye && k.hikaye.sayac && k.hikaye.sayac.kacakBaski >= M.gunNo(k.dk); // Aşama 10: gizem çözülünce kamp boşaltıldı
  const sans = 0.3 * (devriye ? 0.35 : 1) * (mucadele ? 0.5 : 1) * (baski ? 0.2 : 1) * M.zorlukCarpani(k, 'afet', [0.25, 1, 1.5]);
  if (k.kacak.tuzaklar.length >= 4 || d.rng() > sans) return;
  const tur = OTCULLAR[Math.floor(d.rng() * OTCULLAR.length)];
  const h = TURLER[tur].habitat;
  for (let i = 0; i < 20; i++) {
    const a = d.rng() * Math.PI * 2;
    const r = h.r * (0.6 + d.rng() * 0.6);
    const x = h.x + Math.sin(a) * r;
    const y = h.y + Math.cos(a) * r;
    if (Math.hypot(x, y) > YARICAP - 8 || Math.hypot(x - ISTASYON.x, y - ISTASYON.y) < 40) continue;
    if (Math.abs(y - nehirY(x)) < NEHIR_YARI + 3) continue;
    k.kacak.tuzaklar.push({ id: k.sonrakiId++, x, y, dk: k.dk, bulundu: false, hayvanId: null, yakalanmaDk: 0 });
    return;
  }
}
export const yakinTuzak = (d, r = 6) => d.k.kacak.tuzaklar.filter((t) => M.mesafe(d.oyuncu, t) < r).sort((a, b) => M.mesafe(d.oyuncu, a) - M.mesafe(d.oyuncu, b))[0] || null;
// Her karede: tuzağı fark etme, tuzağa hayvan takılması, takılı kalan hayvanın ölümü
export function kacakGuncelle(d) {
  const k = d.k;
  if (!k.kacak) return;
  const o = d.oyuncu;
  for (const t of k.kacak.tuzaklar) {
    const m = M.mesafe(o, t);
    if (!t.bulundu && m < 7 && !k.magara) {
      t.bulundu = true;
      const b = t.hayvanId ? M.birey(d, t.hayvanId) : null;
      const durum = b && !b.olu ? ` ${M.BuyukHarf(M.bireyAdi(b))} tuzağa takılmış!` : '';
      const iz = d.rng() < 0.5 ? ' Çevrede insan ayak izleri ve söndürülmüş bir kamp ateşi var.' : '';
      if (iz) k.kacak.izler += 1;
      M.olay(d, 'kacakTuzak', `Dikkat! Yerde, otların arasına gizlenmiş bir kaçak avcı tel tuzağı var, ${yerTarifi(o, t)}.${durum}${iz} Menüden tuzağı söküp yaban hayatı servisine bildirebilirsin.`, 4, { id: t.id });
      M.arsivOlay(d, `Kaçak avcı tel tuzağı bulundu, ${M.bolgeAdi(t.x, t.y)}.`);
    }
    // Kamera tuzağı yakınındaki kaçak avcı izlerini fotoğraflar
    if (!t.bulundu && !t.kamera) {
      const kt = k.tuzaklar.find((c) => M.mesafe(c, t) < 18);
      if (kt) {
        t.kamera = true;
        M.mesajEkle(k, `Kamera tuzağı (${kt.bolge}) gece fenerli iki insanın tel tuzak kurduğunu görüntüledi. Tuzak kamerasının yakınında, ${M.bolgeAdi(t.x, t.y)} bölgesinde olmalı.`, 'ekosistem');
      }
    }
  }
  // Hayvan takılması: oyun saatinde bir kez denenir
  if (!d.sonTuzakDk || k.dk - d.sonTuzakDk >= 60) {
    d.sonTuzakDk = k.dk;
    for (const t of k.kacak.tuzaklar) {
      if (t.hayvanId) {
        const b = M.birey(d, t.hayvanId);
        if (!b || b.olu) {
          t.hayvanId = null;
          continue;
        }
        if (k.dk - t.yakalanmaDk > 2 * 1440) {
          b.tuzakta = null;
          M.hayvanOldur(d, b, 'kaçak avcı tel tuzağında öldü');
          k.kacak.olen += 1;
          t.hayvanId = null;
          M.mesajEkle(k, `Yaban hayatı servisi: bir ${kucukHarf(M.SOZ[b.tur])} tel tuzakta öldü. Tuzakları bulmak için sahayı dolaş, devriye başlat.`, 'ekosistem');
        }
        continue;
      }
      const av = k.hayvanlar.find((b) => !b.olu && !b.tuzakta && OTCULLAR.includes(b.tur) && Math.abs(b.x - t.x) < 3 && Math.abs(b.y - t.y) < 3);
      if (av && d.rng() < 0.35) {
        av.tuzakta = t.id;
        t.hayvanId = av.id;
        t.yakalanmaDk = k.dk;
        av.hastalik = av.hastalik || { id: 'yara', siddet: 0.5, gun: M.gunNo(k.dk), tedavi: false, goruldu: true };
        M.gecmisEkle(k, av, 'Kaçak avcı tel tuzağına takıldı');
        if (k.gpsli.includes(av.id)) M.mesajEkle(k, `GPS uyarısı: ${M.bireyAdi(av)} saatlerdir aynı yerde, ${M.bolgeAdi(av.x, av.y)}. Tuzağa takılmış olabilir!`, 'ekosistem');
      }
    }
  }
}
export function tuzakSok(d) {
  const k = d.k;
  const t = yakinTuzak(d, 6);
  if (!t) return 'Yakında bulunmuş bir tel tuzak yok.';
  if (t.hayvanId) {
    const b = M.birey(d, t.hayvanId);
    if (b && !b.olu) return `Önce tuzağa takılmış ${M.bireyAdi(b)} hayvanı kurtarılmalı. Numune ve veteriner menüsünden hayvanı kurtar.`;
  }
  k.kacak.tuzaklar = k.kacak.tuzaklar.filter((x) => x !== t);
  k.kacak.bulunan += 1;
  M.efekt(d, 'tel_sok', 0.9);
  M.itibarEkle(d, 4);
  M.arsivOlay(d, 'Kaçak avcı tel tuzağı söküldü ve bildirildi.');
  return `Tel tuzağı söktün, konumuyla birlikte yaban hayatı servisine bildirdin. Servis bölgedeki devriyeyi artıracak. Şimdiye kadar ${k.kacak.bulunan} tuzak söktün.`;
}
// Tuzağa takılmış hayvanı kurtarma: veterinerle hemen, yoksa servis ekibi ertesi gün
export function tuzaktanKurtar(d) {
  const k = d.k;
  const t = k.kacak.tuzaklar.find((x) => x.hayvanId && M.mesafe(d.oyuncu, x) < 40);
  if (!t) return 'Yakında tuzağa takılmış bir hayvan yok.';
  const b = M.birey(d, t.hayvanId);
  if (!b || b.olu) return 'Tuzaktaki hayvan yaşamıyor.';
  if (!M.personelVar(k, 'veteriner')) {
    if (t.servis) return 'Yaban hayatı servisi haberdar; ekip yolda.';
    t.servis = true;
    return `Tuzağa takılmış, korkmuş bir hayvana yalnız yaklaşmak senin için de onun için de tehlikeli. Yaban hayatı servisine haber verdin; veteriner ekipleri yarın gelecek. Kendi veterinerin olsaydı hemen müdahale edebilirdi.`;
  }
  b.tuzakta = null;
  b.korku = Math.min(1, (b.korku || 0) + 0.8); // tuzak travması: bir süre çok ürkek (karar 109)
  t.hayvanId = null;
  k.kacak.tuzaklar = k.kacak.tuzaklar.filter((x) => x !== t);
  k.kacak.kurtarilan += 1;
  k.kacak.bulunan += 1;
  if (b.hastalik && b.hastalik.id === 'yara') b.hastalik.tedavi = true;
  b.alisma = Math.max(0, b.alisma - 0.2);
  M.gecmisEkle(k, b, 'Tel tuzaktan kurtarıldı, yarası tedavi edildi');
  M.itibarEkle(d, 8);
  M.arsivOlay(d, `${M.BuyukHarf(M.bireyAdi(b))} tel tuzaktan kurtarıldı.`);
  M.efekt(d, 'tel_sok', 0.9);
  return `Veteriner ekip ${M.bireyAdi(b)} hayvanını uyuttu, bacağına dolanan teli kesti, yarasını temizleyip ilaç verdi. Hayvan uyanınca topallayarak sürüsüne döndü. Tuzak söküldü ve bildirildi.`;
}
// Günlük: servis ekibinin müdahalesi, yeni tuzaklar
export function kacakGunluk(d) {
  const k = d.k;
  k.kacak.tuzaklar.forEach((t) => {
    if (t.servis && t.hayvanId) {
      const b = M.birey(d, t.hayvanId);
      t.hayvanId = null;
      if (b && !b.olu) {
        b.tuzakta = null;
        b.korku = Math.min(1, (b.korku || 0) + 0.8);
        if (b.hastalik && b.hastalik.id === 'yara') b.hastalik.tedavi = true;
        M.gecmisEkle(k, b, 'Yaban hayatı servisi tel tuzaktan kurtardı');
        k.kacak.kurtarilan += 1;
        M.mesajEkle(k, `Yaban hayatı servisi: ekiplerimiz ${M.bireyAdi(b)} hayvanını tel tuzaktan kurtardı ve tuzağı söktü. Bildirimin için teşekkürler.`, 'ekosistem');
      }
      t.sokuldu = true;
    }
  });
  k.kacak.tuzaklar = k.kacak.tuzaklar.filter((t) => !t.sokuldu);
  tuzakKurulumu(d);
}

// ---------- Yarasaların akşam çıkışı ----------
export function yarasaGuncelle(d) {
  const k = d.k;
  const gun = M.gunNo(k.dk);
  const saat = M.gunDakikasi(k.dk) / 60;
  if (saat < 18.3 || saat > 19.2 || k.yarasaGunu === gun) return;
  k.yarasaGunu = gun;
  const m = M.mesafe(d.oyuncu, MAGARA);
  if (k.magara && !k.magara.alan && aktifOda(k).id === 'yarasa') {
    M.olay(d, 'yarasaCikisi', 'Tepende bir hışırtı başladı: binlerce yarasa uyanıp mağaranın ağzına doğru akın ediyor. Kanat rüzgârı yüzüne vuruyor.', 4);
    kucukKaydet(d, 'misirYarasasi');
  } else if (m < 60 && !k.magara) {
    M.olay(d, 'yarasaCikisi', `Akşam oldu: mağaranın ağzından binlerce meyve yarasası kara bir bulut gibi çıkıyor, ${yerTarifi(d.oyuncu, MAGARA)}. Gece boyunca kilometrelerce uçup meyve arayacaklar.`, 4);
    if (!k.arsiv.kucukler.yarasaCikisi) {
      k.arsiv.kucukler.yarasaCikisi = { ilkDk: k.dk, ilkBolge: 'Mağara girişi', sayi: 1, ozel: true };
      M.itibarEkle(d, 5);
      M.arsivOlay(d, 'Gözlendi: yarasaların akşam çıkışı.');
    }
    kucukKaydet(d, 'misirYarasasi', '');
  } else if (m < 140 && !k.magara) M.olay(d, 'yarasaCikisi', '', 0);
}
