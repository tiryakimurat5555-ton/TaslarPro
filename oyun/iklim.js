// Aşama 22: iklim kaydı ve sıcak dalgası (karar 75), fırtına (karar 23), ekosistem olaylarından doğan araştırma fırsatları (karar 90),
// grup hâlinde uyku ve nöbet (karar 110). Saf mantık; Ik.guncelle(d, dt) her karede, işleri 2 sn'de bir, günlük işler gün dönünce.
// Hava üretimi (sıcak dalgası, fırtına, iklim eğilimi) ekosistem.js havaUret'te. Sayılar ÖNERİDİR.
import * as M from './mantik.js';
import * as E from './ekosistem.js';
import * as Mz from './merkez.js';
import { TURLER } from './veri.js';

const sinirla = (x, a, b) => Math.max(a, Math.min(b, x));
const SABITLEME_UCRETI = 300;
const FIRTINA_ONARIM = 600;

export function iklimAlani(k) {
  if (!k.iklim || typeof k.iklim !== 'object') k.iklim = {};
  const ik = k.iklim;
  if (!Array.isArray(ik.yillar)) ik.yillar = [];
  ik.yillar = ik.yillar.filter((y) => y && Number.isFinite(y.yil) && Number.isFinite(y.yagis) && Number.isFinite(y.sicakGun) && Number.isFinite(y.ortSicaklik)).slice(-12);
  if (!ik.bu || typeof ik.bu !== 'object' || !Number.isFinite(ik.bu.yil)) ik.bu = { yil: E.takvim(M.gunNo(k.dk)).yil, yagis: 0, sicakGun: 0, sicaklikTop: 0, gun: 0, firtina: 0, dalga: 0 };
  for (const a of ['yagis', 'sicakGun', 'sicaklikTop', 'gun', 'firtina', 'dalga']) if (!Number.isFinite(ik.bu[a])) ik.bu[a] = 0;
  ik.yillar.forEach((y) => ['firtina', 'dalga', 'gecikme'].forEach((a) => !Number.isFinite(y[a]) && (y[a] = 0)));
  if (!ik.firsatSon || typeof ik.firsatSon !== 'object') ik.firsatSon = {};
  if (Array.isArray(k.teklifler)) k.teklifler = k.teklifler.filter((t) => t && Number.isFinite(t.odul) && Number.isFinite(t.hedef) && typeof t.metin === 'string' && typeof t.kurum === 'string');
  if (!Number.isFinite(ik.kacakBulunan)) ik.kacakBulunan = (k.kacak && k.kacak.bulunan) || 0;
  if (!Number.isFinite(ik.yanikSon)) ik.yanikSon = 0;
  if (!Number.isFinite(ik.sabitGun)) ik.sabitGun = 0;
  if (!Number.isFinite(ik.firtinaGun)) ik.firtinaGun = 0;
  if (!Number.isFinite(ik.uyariGun)) ik.uyariGun = 0;
  if (!Number.isFinite(ik.yagisBugun)) ik.yagisBugun = 0;
  return ik;
}

// ---------- Araştırma fırsatları (karar 90) ----------
const FIRSATLAR = {
  salgin: (k, x) => ({ kurum: 'Yaban Hayatı Sağlığı Enstitüsü', tip: 'numune', hedef: 3, metin: `Salgın araştırması: ${x.ad} salgınının yayılışını anlamak için 3 numuneyi laboratuvarda analiz et`, odul: 5000 }),
  goc: (k, x) => ({ kurum: 'Göç Yolları İzleme Ağı', tip: 'video', tur: x.tur, hedef: 1, metin: `Göç belgeleme: göç eden ${M.kucukHarf(M.SOZ[x.tur])} sürüsünün videosunu çek`, odul: 4500 }),
  yangin: () => ({ kurum: 'Savan Ekolojisi Enstitüsü', tip: 'kucuk', hedef: 3, metin: 'Yangın sonrası canlanma: yangından sonra 3 yeni küçük canlı türü kaydet', odul: 4000 }),
  kacak: () => ({ kurum: 'Ulusal Doğa Koruma Fonu', tip: 'gece', hedef: 3, metin: 'Kaçak avcılık izlemesi: kaçak avcıların çalıştığı gece saatlerinde 3 fotoğraf çek', odul: 4000 }),
  kuraklik: () => ({ kurum: 'Afrika Su Kaynakları Programı', tip: 'suOlcum', hedef: 3, metin: 'Kuraklık izlemesi: nehir ve gölette 3 su ölçümü yap', odul: 3500 }),
  dalga: () => ({ kurum: 'İklim ve Ekosistem Araştırma Merkezi', tip: 'suOlcum', hedef: 2, metin: 'Sıcak dalgası: hayvanların su başına baskısını anlamak için 2 su ölçümü yap', odul: 3000 }),
  dogum: (k, x) => ({ kurum: 'Afrika Yaban Hayatı Vakfı', tip: 'foto', tur: x.tur, hedef: 2, metin: `Yavru gelişimi: yeni doğan ${M.kucukHarf(M.SOZ[x.tur])} yavrularının büyüdüğü sürüden 2 iyi fotoğraf çek`, odul: 3000 }),
};
const FIRSAT_ARALIK = 3; // aynı tür fırsat en erken kaç gün sonra yeniden

function firsatAc(d, id, x = {}) {
  const k = d.k;
  const ik = iklimAlani(k);
  const gun = M.gunNo(k.dk);
  if (gun - (ik.firsatSon[id] || -99) < FIRSAT_ARALIK) return;
  if (x.tur && !TURLER[x.tur]) return;
  ik.firsatSon[id] = gun;
  const s = FIRSATLAR[id](k, x);
  if (k.teklifler.some((t) => t.metin === s.metin && t.durum !== 'tamam')) return;
  const bekleyen = k.teklifler.filter((t) => t.durum === 'teklif');
  if (bekleyen.length >= 4) {
    const eski = bekleyen.find((t) => !t.firsat) || bekleyen[0];
    k.teklifler = k.teklifler.filter((t) => t !== eski);
  }
  const t = { id: k.sonrakiId++, ...s, durum: 'teklif', dk: k.dk, firsat: true };
  k.teklifler.push(t);
  M.mesajEkle(k, `Araştırma fırsatı. ${Mz.teklifMetni(k, t)}. Kabul etmek için Araştırma merkezi, Görevler.`, 'teklif', { teklifId: t.id });
  M.olay(d, 'mesaj', `Yeni araştırma fırsatı: ${s.kurum}. ${s.metin}. Merkez, Görevler bölümünden kabul edebilirsin.`, 2);
}

function olaylariTara(d) {
  for (const o of d.olaylar) {
    if (o._ik) continue;
    o._ik = true;
    if (o.tur === 'goc' && o.hayvanTur && /göçe başladı|göçten dönüyor/.test(o.metin || '')) firsatAc(d, 'goc', { tur: o.hayvanTur });
    if (o.tur === 'tanik' && o.id && /doğum|yavruladı/i.test(o.metin || '')) {
      const b = M.birey(d, o.id);
      if (b) firsatAc(d, 'dogum', { tur: b.tur });
    }
  }
}

function durumTara(d) {
  const k = d.k;
  const ik = iklimAlani(k);
  const eko = k.eko || {};
  if (eko.salgin && eko.salgin.bilinen && ik.salginGun !== eko.salgin.basGun) {
    ik.salginGun = eko.salgin.basGun;
    const h = E.HASTALIKLAR[eko.salgin.hastalik];
    firsatAc(d, 'salgin', { ad: h ? h.ad : 'hastalık' });
  }
  const yanikEn = Math.max(0, ...Object.values(eko.yanik || {}).filter(Number.isFinite));
  if (yanikEn > ik.yanikSon) {
    ik.yanikSon = yanikEn;
    firsatAc(d, 'yangin');
  }
  const bulunan = (k.kacak && k.kacak.bulunan) || 0;
  if (bulunan > ik.kacakBulunan) {
    ik.kacakBulunan = bulunan;
    firsatAc(d, 'kacak');
  }
}

// ---------- Fırtına (karar 23) ----------
export function firtinaBugun(k) {
  const h = k.eko && k.eko.hava;
  return h && h.firtina && h.gun === M.gunNo(k.dk) ? h.firtina : null;
}
export function sabitleDurumu(k) {
  const f = firtinaBugun(k);
  const ik = iklimAlani(k);
  if (!f) return null;
  const gunDk = M.gunDakikasi(k.dk);
  if (gunDk >= f.bas) return null;
  return { f, sabit: ik.sabitGun === M.gunNo(k.dk) };
}
export function sabitle(d) {
  const k = d.k;
  const du = sabitleDurumu(k);
  if (!du) return 'Bugün fırtına beklenmiyor.';
  if (du.sabit) return 'Ekipmanı zaten sabitledin.';
  if (k.butce < SABITLEME_UCRETI) return 'Bütçen yetmiyor.';
  k.butce -= SABITLEME_UCRETI;
  iklimAlani(k).sabitGun = M.gunNo(k.dk);
  return `Saha ekibine telsizle haber verdin: istasyonun çatıları ve depoları bağlandı, kamera tuzakları kazıklara sabitlendi${k.kamp ? ', kamp çadırının ipleri gerildi' : ''}. Malzeme gideri ${Mz.liraSozu(SABITLEME_UCRETI)}.`;
}
function firtinaDenetle(d) {
  const k = d.k;
  const ik = iklimAlani(k);
  const f = firtinaBugun(k);
  if (!f) return;
  const gun = M.gunNo(k.dk);
  const gunDk = M.gunDakikasi(k.dk);
  if (ik.uyariGun !== gun && gunDk >= f.bas - 120 && gunDk < f.bas) {
    ik.uyariGun = gun;
    const m = `Fırtına uyarısı: yaklaşık ${Math.max(1, Math.round((f.bas - gunDk) / 60))} saat içinde sert rüzgârlı bir fırtına bekleniyor. Kamera tuzakları devrilebilir, kamp ve istasyon zarar görebilir. Doğa menüsünden ekipmanı sabitleyebilirsin.`;
    M.mesajEkle(k, m, 'ekosistem');
    M.olay(d, 'hava', m, 4);
  }
  if (ik.firtinaGun !== gun && gunDk >= f.bas && gunDk < f.bit) {
    ik.firtinaGun = gun;
    ik.bu.firtina++;
    const sabit = ik.sabitGun === gun;
    const zararlar = [];
    if (!sabit) {
      const devrik = k.tuzaklar.filter((t) => Math.random() < 0.45);
      devrik.forEach((t) => (t.devrik = true));
      if (devrik.length) zararlar.push(`${devrik.length} kamera tuzağı devrildi (${[...new Set(devrik.map((t) => t.bolge))].join(', ')}); düzeltilene kadar fotoğraf çekemez`);
      if (k.kamp && Math.random() < 0.6) {
        k.kamp.hasarli = true;
        zararlar.push('kamp çadırı ve gözlem saklanağı yırtıldı; onarılana kadar kamp seni saklamaz');
      }
      k.butce -= FIRTINA_ONARIM;
      zararlar.push(`istasyonun çatısında hasar var, onarım ${Mz.liraSozu(FIRTINA_ONARIM)}`);
    }
    const m = `Fırtına başladı! Sert rüzgâr ağaçları büküyor, toz ve yağmur savruluyor; hayvanlar sığınak arıyor.${sabit ? ' Ekipmanı önceden sabitlediğin için zarar görmedi.' : ` ${M.BuyukHarf(zararlar.join('; '))}.`}`;
    M.mesajEkle(k, m, 'ekosistem');
    M.arsivOlay(d, 'Fırtına geçirildi.');
    M.olay(d, 'hava', m, 4);
  }
}
export const devrikTuzaklar = (k) => k.tuzaklar.filter((t) => t.devrik);
export function tuzakDuzelt(d, t) {
  if (!t || !t.devrik) return 'Bu tuzak devrik değil.';
  if (M.mesafe(d.oyuncu, t) > 8) return 'Tuzağı düzeltmek için 8 metre içinde olmalısın.';
  t.devrik = false;
  return `Devrilen kamera tuzağını yeniden kazığına bağlayıp merceğini sildin; ${t.bolge} tuzağı yeniden çalışıyor.`;
}
export function kampOnar(d) {
  const k = d.k;
  if (!k.kamp || !k.kamp.hasarli) return 'Kampta onarılacak bir şey yok.';
  if (M.mesafe(d.oyuncu, k.kamp) > 10) return 'Kampı onarmak için kampa gitmelisin.';
  k.kamp.hasarli = false;
  return 'Yırtılan çadırı yamadın, ipleri yeniden gerdin. Kamp yeniden kullanılabilir.';
}

// ---------- Sıcak dalgası ve iklim kaydı (karar 75) ----------
function gunluk(d) {
  const k = d.k;
  const ik = iklimAlani(k);
  const eko = k.eko || {};
  const h = eko.hava || {};
  // dünün kaydı
  ik.bu.yagis += ik.yagisBugun;
  ik.yagisBugun = 0;
  const tk = E.takvim(M.gunNo(k.dk));
  if (tk.yil !== ik.bu.yil) {
    const y = ik.bu;
    if (y.gun >= 6) {
      const ort = Math.round((y.sicaklikTop / Math.max(1, y.gun)) * 10) / 10;
      ik.yillar.push({ yil: y.yil, yagis: Math.round(y.yagis), sicakGun: y.sicakGun, ortSicaklik: ort, firtina: y.firtina, dalga: y.dalga, kuraklik: !!y.kuraklik, gecikme: y.gecikme || 0 });
      if (ik.yillar.length > 12) ik.yillar.shift();
      M.mesajEkle(k, `İklim kaydı: ${y.yil}. yıl kapandı. ${yilMetni(ik.yillar[ik.yillar.length - 1], ik.yillar[ik.yillar.length - 2])}`, 'ekosistem');
    }
    ik.bu = { yil: tk.yil, yagis: 0, sicakGun: 0, sicaklikTop: 0, gun: 0, firtina: 0, dalga: 0 };
  }
  // bugünün havası
  if (Number.isFinite(h.sicaklik)) {
    ik.bu.sicaklikTop += h.sicaklik;
    ik.bu.gun++;
  }
  if (h.tur === 'sicak') ik.bu.sicakGun++;
  if (h.dalga) {
    ik.bu.dalga++;
    const ilk = ik.dalgaGun !== M.gunNo(k.dk) - 1;
    ik.dalgaGun = M.gunNo(k.dk);
    if (Number.isFinite(eko.golet)) eko.golet = sinirla(eko.golet - 0.04, 0, 1);
    for (const b of k.hayvanlar) {
      if (b.olu || !Number.isFinite(b.kondisyon)) continue;
      const t = TURLER[b.tur];
      if (!t || t.suCanlisi) continue;
      b.kondisyon = sinirla(b.kondisyon - (b.evre === 'yavru' || b.evre === 'yasli' ? 0.035 : 0.015), 0.05, 1);
    }
    if (ilk) {
      const m = `Olağan dışı sıcak dalgası: sıcaklık ${h.sicaklik} dereceye çıkıyor ve birkaç gün sürecek. Hayvanlar daha sık su içecek, gölgede bekleyecek; yavrular ve yaşlılar zorlanır. Gölet hızla çekilecek. Su başlarını gözlemek için iyi bir zaman, ama öğle sıcağında sen de dikkatli ol.`;
      M.mesajEkle(k, m, 'ekosistem');
      M.arsivOlay(d, 'Sıcak dalgası başladı.');
      M.olay(d, 'hava', m, 4);
      firsatAc(d, 'dalga');
    }
  }
  if (eko.yil && eko.yil.no === ik.bu.yil) {
    ik.bu.kuraklik = !!eko.yil.kuraklik;
    ik.bu.gecikme = eko.yil.gecikme || 0;
  }
  if (eko.yil && eko.yil.kuraklik && tk.mevsim === 'kurak' && tk.mevsimGunu === 3) firsatAc(d, 'kuraklik');
}
function yilMetni(y, once) {
  if (!y) return '';
  let m = `Toplam yağış yaklaşık ${y.yagis} milimetre, ortalama gündüz sıcaklığı ${String(y.ortSicaklik).replace('.', ',')} derece, ${y.sicakGun} çok sıcak gün`;
  if (y.firtina) m += `, ${y.firtina} fırtına`;
  if (y.dalga) m += `, ${y.dalga} günlük sıcak dalgası`;
  m += '.';
  if (y.kuraklik) m += ' Kurak bir yıldı.';
  if (y.gecikme) m += ` Yağmurlar ${y.gecikme} gün gecikti.`;
  if (once) {
    const fark = Math.round((y.ortSicaklik - once.ortSicaklik) * 10) / 10;
    const yf = y.yagis - once.yagis;
    m += ` Önceki yıla göre ${Math.abs(fark) < 0.3 ? 'sıcaklık benzer' : fark > 0 ? `${String(fark).replace('.', ',')} derece daha sıcak` : `${String(-fark).replace('.', ',')} derece daha serin`}, yağış ${Math.abs(yf) < 30 ? 'benzer' : yf > 0 ? 'daha fazla' : 'daha az'}.`;
  }
  return m;
}
export function iklimSatirlari(k) {
  const ik = iklimAlani(k);
  const l = [];
  const b = ik.bu;
  const ort = b.gun ? Math.round((b.sicaklikTop / b.gun) * 10) / 10 : null;
  l.push(`Bu yıl (${b.yil}. yıl, ${b.gun} gün): yağış yaklaşık ${Math.round(b.yagis + ik.yagisBugun)} milimetre${ort !== null ? `, ortalama sıcaklık ${String(ort).replace('.', ',')} derece` : ''}, ${b.sicakGun} çok sıcak gün${b.firtina ? `, ${b.firtina} fırtına` : ''}${b.dalga ? `, ${b.dalga} günlük sıcak dalgası` : ''}.`);
  ik.yillar
    .slice()
    .reverse()
    .forEach((y, i, a) => l.push(`${y.yil}. yıl: ${yilMetni(y, a[i + 1])}`));
  if (ik.yillar.length >= 3) {
    const ilk = ik.yillar[0];
    const son = ik.yillar[ik.yillar.length - 1];
    const fark = Math.round((son.ortSicaklik - ilk.ortSicaklik) * 10) / 10;
    l.push(`Uzun vadeli eğilim: ${ik.yillar.length} yılda ortalama sıcaklık ${Math.abs(fark) < 0.5 ? 'belirgin değişmedi' : fark > 0 ? `${String(fark).replace('.', ',')} derece yükseldi` : `${String(-fark).replace('.', ',')} derece düştü`}.`);
  } else l.push('Uzun vadeli eğilimi görmek için en az üç yıllık kayıt gerekir.');
  return l;
}

// ---------- Grup hâlinde uyku ve nöbet (karar 110) ----------
const NOBET_TUTAN = ['zebra', 'impala', 'gnu', 'ceylan', 'manda', 'babun', 'yabanKopegi', 'zurafa'];
function uykuDenetle(d) {
  const k = d.k;
  for (const g of k.gruplar) {
    if (!NOBET_TUTAN.includes(g.tur) || (g.plan !== 'uyu' && g.plan !== 'dinlen') || g.alarm > 0) continue;
    const u = M.uyeler(d, g);
    if (u.length < 3) continue;
    if (u.some((b) => b.ozel && b.ozel.davranis === 'nobetTutuyor' && b.ozel.bitis > d.zaman)) continue;
    if (Math.random() > 0.15) continue;
    const adaylar = u.filter((b) => b.evre !== 'yavru' && !(b.ozel && b.ozel.bitis > d.zaman));
    if (!adaylar.length) continue;
    const b = adaylar[Math.floor(Math.random() * adaylar.length)];
    b.ozel = { davranis: 'nobetTutuyor', bitis: d.zaman + 30 + Math.random() * 30 };
  }
}
export const UYKU_NOTU = {
  zebra: 'Zebralar ayakta kısa kısa uyur; sürüde hep biri uyanık kalır.',
  fil: 'Filler çoğunlukla ayakta uyur, gecede yalnızca iki saat kadar; arada bir yere yatarlar.',
  zurafa: 'Zürafalar günde birkaç dakikalık kısa uykular uyur; derin uykuda boyunlarını kalçalarına dayarlar.',
  aslan: 'Aslanlar günde yirmi saate yakın dinlenir ve uyur; grup üyeleri birbirine yaslanarak uyur.',
  babun: 'Babunlar geceyi yırtıcılardan uzak, yüksek uyku ağaçlarında geçirir.',
  impala: 'İmpalalar uyurken sürünün bir kısmı nöbet tutar; tehlikede ilk havlayan nöbetçidir.',
  gnu: 'Gnular açıkta, sıkı gruplar hâlinde dinlenir; kenardakiler nöbet tutar.',
  manda: 'Mandalar gece birlikte yatar; birkaç yetişkin başı dik nöbet bekler.',
  yabanKopegi: 'Yaban köpekleri inlerinin çevresinde birbirine sokularak uyur; biri hep uyanıktır.',
  suAygiri: 'Su aygırları gündüz suyun içinde uyur; uyurken bile nefes almak için kendiliğinden yüzeye çıkarlar.',
  leopar: 'Leoparlar gündüzü bir ağaç dalında yayılarak uyuyarak geçirir.',
  cita: 'Çitalar gece açıkta uyumaz, yüksek otların arasında saklanır.',
};

let sayac = 0;
let sonGun = 0;
let sonDk = null;
export function guncelle(d, dt) {
  sayac += dt;
  if (sayac < 2) return;
  sayac = 0;
  const k = d.k;
  const ik = iklimAlani(k);
  // yağış birikimi (oyun dakikası başına, şiddete göre)
  if (sonDk !== null && k.dk > sonDk && k.dk - sonDk < 600 && k.eko && k.eko.yagmurVar) ik.yagisBugun += ((k.eko.siddet || 0.5) * (k.dk - sonDk)) / 1.2;
  sonDk = k.dk;
  const gun = M.gunNo(k.dk);
  if (gun !== sonGun) {
    if (sonGun) gunluk(d);
    sonGun = gun;
  }
  olaylariTara(d);
  durumTara(d);
  firtinaDenetle(d);
  if (!d.dinleniyor) uykuDenetle(d);
}
