// Aşama 23: büyük hedefler (karar 51). Sonsuz serbest oyunun içinde uzun soluklu bilimsel ve koruma hedefleri. Her hedefin birkaç
// adımı vardır; tamamlanınca büyük ödül ve bir anlatım gelir. Hepsi bitince araştırma sürer. Saf mantık; Hd.guncelle 5 sn'de bir.
// Sayılar ÖNERİDİR.
import * as M from './mantik.js';
import * as Mz from './merkez.js';
import { TUR_SIRASI } from './veri.js';
import { KUCUK_SIRASI } from './kucukler.js';
import { BITKI_SIRASI } from './ekosistem.js';
import { SU_NOKTALARI } from './su.js';

const sayi = (x) => (Number.isFinite(x) ? x : 0);
function kusakSayisi(k) {
  const harita = new Map(k.hayvanlar.map((b) => [b.id, b]));
  let en = 0;
  for (const b of k.hayvanlar) {
    if (!(b.no > 0)) continue;
    let n = 1;
    let x = b;
    while (x.anne && harita.get(x.anne) && harita.get(x.anne).no > 0 && n < 6) {
      x = harita.get(x.anne);
      n++;
    }
    en = Math.max(en, n);
  }
  return en;
}
export const HEDEFLER = [
  {
    id: 'atlas', ad: 'Savan Atlası', tarif: 'Araştırma alanının bütün büyük hayvanlarını, küçük canlılarının çoğunu ve bitkilerini kayda geçir.',
    adimlar: [
      { metin: 'Bütün büyük hayvan türlerini kaydet', olc: (k) => [Object.keys(k.arsiv.turler).filter((t) => TUR_SIRASI.includes(t)).length, TUR_SIRASI.length] },
      { metin: '80 küçük canlı türü kaydet', olc: (k) => [Object.keys(k.arsiv.kucukler || {}).filter((t) => KUCUK_SIRASI.includes(t)).length, 80] },
      { metin: 'Bütün bitki türlerini incele', olc: (k) => [Object.keys(k.arsiv.bitkiler || {}).filter((t) => BITKI_SIRASI.includes(t)).length, BITKI_SIRASI.length] },
    ],
    odul: { itibar: 25, fon: 12000 },
    son: 'Savan Atlası tamamlandı. Kayıtların, bölgenin ilk bütünlüklü canlı envanteri olarak yayımlandı; koruma planları artık bu atlasa dayanacak.',
  },
  {
    id: 'nesil', ad: 'Nesiller boyu', tarif: 'Aynı ailenin kuşaklarını izle: tanıdığın bir hayvanın torununu da tanı.',
    adimlar: [
      { metin: '30 bireyi tanımla', olc: (k) => [k.hayvanlar.filter((b) => b.no > 0).length, 30] },
      { metin: 'Üç kuşağı tanımlı bir aile: büyükanne, anne ve yavru', olc: (k) => [Math.min(3, kusakSayisi(k)), 3] },
    ],
    odul: { itibar: 20, fon: 8000 },
    son: 'Üç kuşak boyunca bir aileyi izledin. Uzun süreli birey takibi, davranışın ve kişiliğin nesiller boyunca nasıl aktarıldığını gösteriyor; bu, saha biyolojisinin en değerli verisidir.',
  },
  {
    id: 'koruma', ad: 'Koruma programı', tarif: 'Bütün koruma projelerini tamamla.',
    adimlar: [{ metin: 'Bütün koruma projelerini tamamla', olc: (k) => [Mz.KORUMA.filter((p) => k.koruma && k.koruma.projeler[p.id] && k.koruma.projeler[p.id].durum === 'tamam').length, Mz.KORUMA.length] }],
    odul: { itibar: 30, fon: 15000 },
    son: 'Koruma programının bütün projeleri tamamlandı. Bölge, ulusal koruma ağına örnek alan olarak alındı.',
  },
  {
    id: 'bilim', ad: 'Bilim insanı', tarif: 'Bulgularını yayımla; başka araştırmacılar onları kullansın.',
    adimlar: [
      { metin: '6 makale yayımla', olc: (k) => [((k.yayin && k.yayin.makaleler) || []).filter((m) => m.durum === 'yayimlandi').length, 6] },
      { metin: 'Toplam 40 atıf al', olc: (k) => [((k.yayin && k.yayin.makaleler) || []).reduce((s, m) => s + sayi(m.atif), 0), 40] },
    ],
    odul: { itibar: 25, fon: 10000 },
    son: 'Makalelerin bilim dünyasında yer edindi. Üniversiteler öğrencilerini senin istasyonuna staja göndermeye başladı.',
  },
  {
    id: 'harita', ad: 'Yaşam alanları haritası', tarif: 'Hayvanların gizli yuvalarını, böcek kolonilerini ve su noktalarını haritaya işle.',
    adimlar: [
      { metin: 'Bütün in ve yuvaları bul', olc: (k) => [(k.yuvalar || []).filter((y) => y.bulundu).length, (k.yuvalar || []).length || 1] },
      { metin: 'Dört böcek kolonisini incele', olc: (k) => [Object.keys((k.botanik && k.botanik.koloniler) || {}).length, 4] },
      { metin: 'Bütün su noktalarını ölç', olc: (k) => [Object.keys((k.su && k.su.olcumler) || {}).length, SU_NOKTALARI.length] },
    ],
    odul: { itibar: 20, fon: 9000 },
    son: 'Yaşam alanları haritası tamamlandı. İnler, yuvalar, koloniler ve su noktaları bir araya gelince savanın hangi parçasının kimin için hayati olduğu görünür oldu.',
  },
  {
    id: 'zaman', ad: 'Uzun soluklu izleme', tarif: 'Yıllar boyunca izle; hiçbir büyük tür bölgeden silinmesin.',
    adimlar: [
      { metin: 'Üç yıllık iklim kaydı', olc: (k) => [((k.iklim && k.iklim.yillar) || []).length, 3] },
      { metin: 'Bütün büyük türler bölgede ya da göçte yaşıyor', olc: (k) => [TUR_SIRASI.filter((t) => k.hayvanlar.some((b) => b.tur === t && !b.olu) || ((k.disari && k.disari.hayvanlar) || []).some((b) => b && b.tur === t && !b.olu)).length, TUR_SIRASI.length] },
    ],
    odul: { itibar: 25, fon: 10000 },
    son: 'Üç yıl boyunca savanı kesintisiz izledin ve hiçbir büyük tür bölgeden silinmedi. Uzun süreli izleme, iklimin ve insan etkisinin ekosistemi nasıl değiştirdiğini anlamanın tek yoludur.',
  },
];

export function hedefAlani(k) {
  if (!k.hedefler || typeof k.hedefler !== 'object') k.hedefler = {};
  for (const id of Object.keys(k.hedefler)) if (!HEDEFLER.some((h) => h.id === id) || !Number.isFinite(k.hedefler[id])) delete k.hedefler[id];
  return k.hedefler;
}
export function hedefDurumu(k, h) {
  const adimlar = h.adimlar.map((a) => {
    let [n, hedef] = a.olc(k);
    n = sayi(n);
    hedef = Math.max(1, sayi(hedef));
    return { metin: a.metin, n: Math.min(n, hedef), hedef, tamam: n >= hedef };
  });
  return { adimlar, tamam: adimlar.every((a) => a.tamam), bitti: !!hedefAlani(k)[h.id] };
}
export function hedefSatiri(k, h) {
  const du = hedefDurumu(k, h);
  if (du.bitti) return `${h.ad}: tamamlandı`;
  return `${h.ad}: ${du.adimlar.filter((a) => a.tamam).length} / ${du.adimlar.length} adım`;
}
export function hedefDetay(k, h) {
  const du = hedefDurumu(k, h);
  return [h.tarif, ...du.adimlar.map((a) => `${a.metin}: ${a.tamam ? 'tamam' : `${a.n} / ${a.hedef}`}`), du.bitti ? `Tamamlandı. ${h.son}` : `Ödül: ${h.odul.itibar} itibar ve ${Mz.liraSozu(h.odul.fon)} fon.`];
}

let sayac = 0;
export function guncelle(d, dt) {
  sayac += dt;
  if (sayac < 5) return;
  sayac = 0;
  const k = d.k;
  const ha = hedefAlani(k);
  for (const h of HEDEFLER) {
    if (ha[h.id]) continue;
    if (!hedefDurumu(k, h).tamam) continue;
    ha[h.id] = k.dk;
    M.itibarEkle(d, h.odul.itibar);
    k.butce += h.odul.fon;
    const hepsi = HEDEFLER.every((x) => ha[x.id]);
    const m = `Büyük hedef tamamlandı: ${h.ad}. ${h.son} Ödül: ${Mz.liraSozu(h.odul.fon)} fon.${hepsi ? ' Bütün büyük hedefleri tamamladın. Savan yaşamaya devam ediyor; araştırman da sürüyor: her yıl yeni doğumlar, göçler ve sürprizler getirecek.' : ''}`;
    M.mesajEkle(k, m, 'sonuc');
    M.arsivOlay(d, `Büyük hedef: ${h.ad}.`);
    M.olay(d, 'basari', m, 4);
  }
}
