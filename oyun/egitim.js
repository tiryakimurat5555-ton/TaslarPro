// ==== VAHŞİ YAŞAM: REHBERLİ EĞİTİM (brif karar 35, Aşama 7) ====
// Kısa hikâyeli başlangıç ve gerçek görevlerle temel mekanikler. k.egitim: 1..ADIMLAR.length sıradaki adım, 99 bitti.
// Eğitim Ayarlar ya da Yardım'dan yeniden başlatılabilir. Her adımın metni oynama biçimine göre (hareket ya da VoiceOver düğmeleri).
import * as M from './mantik.js';
import * as K from './kesif.js';

export const ADIMLAR = [
  {
    ad: 'Çevreni tanı',
    hareket: 'Önce çevreni tanı: ekrana bir süre basılı tut, sana çevreni betimleyeyim.',
    vo: 'Önce çevreni tanı: Çevreyi betimle düğmesine dokun.',
    tamam: (k, d) => (d.betimlemeSayisi || 0) > 0,
  },
  {
    ad: 'Gölete git',
    hareket: "Hayvanlar suya gelir. İki parmakla iki kez dokunup menüyü aç, Yerler ve yolculuk bölümünden Gölet'i seç. Oraya kendin yürür ya da sürersin.",
    vo: "Hayvanlar suya gelir. Yerler düğmesinden Gölet'i seç.",
    tamam: (k, d) => M.bolgeBul(d.oyuncu.x, d.oyuncu.y) === 'golet' || !!d.gozlemId || Object.keys(k.arsiv.bireyler).length > 0,
  },
  {
    ad: 'Dürbünle gözlemle',
    hareket: 'Elinde dürbün var. Çift dokun: en yakın hayvanı seçip izlemeye başlarsın.',
    vo: 'Gözlemle düğmesine dokun: en yakın hayvanı seçip izlemeye başlarsın.',
    tamam: (k, d) => !!d.gozlemId || Object.keys(k.arsiv.bireyler).length > 0,
  },
  {
    ad: 'Bireyi tanımla',
    hareket: 'Hayvanı birkaç saniye kıpırdamadan izle. Tanımlanınca kimlik numarası alır, örneğin Zebra 1. Dokunursan izlediğin hayvanı anlatırım.',
    vo: 'Hayvanı birkaç saniye izle. Tanımlanınca kimlik numarası alır.',
    tamam: (k) => Object.keys(k.arsiv.bireyler).length > 0,
  },
  {
    ad: 'Fotoğraf çek',
    hareket: 'İki parmakla sağa kaydırarak fotoğraf makinesine geç, sonra çift dokunarak izlediğin hayvanın fotoğrafını çek.',
    vo: 'Fotoğraf çek düğmesine dokun.',
    tamam: (k) => k.arsiv.fotolar.length > 0,
  },
  {
    ad: 'Ses kaydı yap',
    hareket: 'İki parmakla bir kez daha sağa kaydır: ses kayıt cihazı. Çift dokununca 6 saniye dinler ve duyduğu sesleri çözümler.',
    vo: 'Ses kaydı düğmesine dokun; 6 saniye dinler ve sesleri çözümler.',
    tamam: (k) => k.arsiv.sesler.length > 0,
  },
  {
    ad: 'Küçük canlı ara',
    hareket: 'Savanda büyük hayvanlardan çok daha fazlası var. İki parmakla sağa kaydırıp Büyüteç ve fenere geç ve çift dokunarak küçük canlı ara.',
    vo: 'Menüyü açıp Küçük canlı ara satırını seç.',
    tamam: (k) => K.kucukSayisi(k) > 0,
  },
  {
    ad: 'Bir görev kabul et',
    hareket: 'Son adım: menüyü aç, Araştırma merkezi, Görevler bölümünde bir teklifi seçip kabul et. Görevler bütçeni büyütür.',
    vo: 'Son adım: Merkez düğmesine dokun, Görevler bölümünde bir teklifi kabul et.',
    tamam: (k) => k.teklifler.some((t) => t.durum === 'kabul') || k.arsiv.olaylar.length > 30,
  },
];
export const egitimSuruyor = (k) => k.egitim >= 1 && k.egitim <= ADIMLAR.length;
export const adimMetni = (k, kip) => {
  if (!egitimSuruyor(k)) return '';
  const a = ADIMLAR[k.egitim - 1];
  return `Eğitim, ${k.egitim}. adım / ${ADIMLAR.length}: ${kip === 'voiceover' ? a.vo : a.hareket}`;
};
export function egitimBaslat(k) {
  k.egitim = 1;
  k.egitimSoylenen = 0;
}
// Her saniye çağrılır: adım tamamlanınca sıradakini söyler. Söylenecek metni döndürür (yoksa boş).
export function egitimDenetle(d, kip) {
  const k = d.k;
  if (!egitimSuruyor(k)) return '';
  let m = '';
  // Birden çok adım birden tamamlanmış olabilir
  let tamam = false;
  while (egitimSuruyor(k) && ADIMLAR[k.egitim - 1].tamam(k, d)) {
    k.egitim += 1;
    tamam = true;
  }
  if (!egitimSuruyor(k)) {
    k.egitim = 99;
    return 'Eğitim tamamlandı, aferin! Artık savan senin. Hayvanları tanımla, davranışlarını kaydet, araştırma merkezini büyüt. Yardım menüsünde bütün hareketler ve sistemler anlatılıyor; eğitimi Ayarlar bölümünden yeniden başlatabilirsin.';
  }
  if (tamam || k.egitimSoylenen !== k.egitim) {
    k.egitimSoylenen = k.egitim;
    m = (tamam ? 'Güzel. ' : '') + adimMetni(k, kip);
  }
  return m;
}
