// Aşama 21: üreme (karar 20) ve ses analizinde davranış türleri (karar 49, 87). Saf mantık; Ur.guncelle(d, dt) her karede,
// işleri 2 sn'de bir. Gebeliği mantik.js gunlukDogumlar başlatır (anne.gebe {baba, bas, dogum}, g.kur); burada kur davranışı
// zamanı gelince görünür olur, anneler uzaklaşan yavrularını çağırır, birey sayfası üreme satırlarını verir. Sayılar ÖNERİDİR.
import * as M from './mantik.js';
import { TURLER } from './veri.js';

export const KUR = {
  aslan: 'dişinin yanından ayrılmıyor; ona sürtünüyor, alçak sesle hırıldıyor. Aslan çiftleri günlerce birlikte kalır',
  leopar: 'dişiyle birlikte dolaşıyor; ikisi de birbirine yumuşak öksürük gibi seslerle sesleniyor',
  cita: 'dişinin kokusunu izleyip ona yaklaşıyor, kesik kesik cıvıldıyor',
  sirtlan: 'baskın dişinin çevresinde çekingen adımlarla dolaşıyor, başını eğip yaklaşmaya çalışıyor; sırtlanlarda dişiler güçlüdür',
  yabanKopegi: 'baskın dişiyle yan yana yürüyor, onu kokluyor ve yalıyor; sürüde yalnızca baskın çift yavrular',
  fil: 'kızgınlık dönemindeki dişinin yanında; hortumunu onun sırtına koyuyor. Sürünün öteki dişileri heyecanla gürlüyor',
  zurafa: 'dişinin arkasından yürüyüp kokluyor, başını onun sırtına dayıyor',
  zebra: 'dişinin peşinden koşuyor, dudağını kıvırıp havayı kokluyor; aygır öteki erkekleri uzak tutuyor',
  gnu: 'boğa dişileri kendi küçük toprağına toplamaya çalışıyor, böğürüp çevrelerinde dönüyor',
  impala: 'erkek kükremeye benzer bir böğürmeyle dişileri topluyor, başını alçaltıp onları yönlendiriyor',
  ceylan: 'erkek dişinin arkasında, ön ayağıyla hafifçe onun bacağına dokunuyor',
  domuz: 'erkek dişinin peşinde, burnuyla onu dürtüp homurdanıyor',
  suAygiri: 'suyun içinde dişiye yaklaşıyor, ikisi de suyu çalkalayarak homurdanıyor',
  gergedan: 'dişinin yanından ayrılmıyor; ikisi kısa koşular yapıp birbirine burun sürtüyor',
  manda: 'boğa dişiyi koklayıp başını onun sırtına dayıyor, sürünün kenarında birlikte kalıyorlar',
  babun: 'erkek dişiye eşlik ediyor, tüylerini ayıklıyor; dişinin kızarmış, şişmiş arka bölgesi çiftleşmeye hazır olduğunu gösterir',
};
const CAGIRAN = ['fil', 'zebra', 'gnu', 'impala', 'ceylan', 'manda', 'zurafa', 'babun', 'aslan', 'sirtlan', 'gergedan', 'suAygiri'];

export function gebelikOnar(k) {
  for (const b of k.hayvanlar || []) {
    if (!b.gebe) continue;
    const g = b.gebe;
    if (b.olu || b.cinsiyet !== 'disi' || typeof g !== 'object' || !Number.isFinite(g.bas) || !Number.isFinite(g.dogum)) delete b.gebe;
  }
  for (const g of k.gruplar || []) if (g.kur && (typeof g.kur !== 'object' || !Number.isFinite(g.kur.dk))) delete g.kur;
}

const gorunurMu = (d, b) => !d.k.magara && M.mesafe(d.oyuncu, b) <= M.durbunMenzili(d.k.dk, d.k);
const serbest = (d, b) => b && !b.olu && !(b.ozel && b.ozel.bitis > d.zaman);
const ad = (b) => (M.taninmisMi(b) ? M.bireyAdi(b) : `bir ${M.kucukHarf(M.SOZ[b.tur])}`);

function kurDenetle(d) {
  const k = d.k;
  for (const g of k.gruplar) {
    if (!g.kur || k.dk < g.kur.dk) continue;
    const kur = g.kur;
    delete g.kur;
    if (k.dk - kur.dk > 720) continue; // oyun kapalıyken kaçırıldı
    const disi = M.birey(d, kur.disi);
    const erkek = kur.erkek ? M.birey(d, kur.erkek) : null;
    if (!serbest(d, disi) || !KUR[g.tur]) continue;
    const sure = 40 + Math.random() * 30;
    disi.ozel = { davranis: 'kurYapiyor', bitis: d.zaman + sure };
    if (serbest(d, erkek)) erkek.ozel = { davranis: 'kurYapiyor', bitis: d.zaman + sure };
    const yapan = erkek && TURLER[g.tur] ? erkek : disi;
    if (gorunurMu(d, yapan)) {
      const kim = erkek ? `${M.BuyukHarf(ad(erkek))}, ${ad(disi)} ile` : `${M.BuyukHarf(ad(disi))}`;
      M.olay(d, 'ureme', `Kur davranışı: ${kim}; ${KUR[g.tur]}. ${M.BuyukHarf(M.yerTarifi(d.oyuncu, yapan))}.`, 3, { id: yapan.id, ses: true, duyma: 120 });
    }
  }
}

// Yavrusu uzaklaşan anne onu çağırır; yavru sesi tanıyıp koşar
function yavruCagrisi(d) {
  const k = d.k;
  if (Math.random() > 0.03) return;
  const adaylar = k.hayvanlar.filter((y) => !y.olu && y.evre === 'yavru' && y.anne && CAGIRAN.includes(y.tur));
  if (!adaylar.length) return;
  const y = adaylar[Math.floor(Math.random() * adaylar.length)];
  const anne = M.birey(d, y.anne);
  if (!serbest(d, anne) || M.mesafe(anne, y) < 12) return;
  anne.ozel = { davranis: 'yavruyuCagiriyor', bitis: d.zaman + 10 };
  if (gorunurMu(d, anne) || M.mesafe(d.oyuncu, anne) < 90)
    M.olay(d, 'ureme', `${M.BuyukHarf(ad(anne))} uzaklaşan yavrusunu çağırıyor; yavru annesinin sesini tanıyıp ona koşuyor. Anneler ve yavrular birbirini sesinden tanır. ${M.BuyukHarf(M.yerTarifi(d.oyuncu, anne))}.`, 2, { id: anne.id, ses: true, duyma: 90 });
}

// Birey sayfası satırları
export function bireySatirlari(d, b) {
  const l = [];
  const gun = M.gunNo(d.k.dk);
  if (b.gebe && Number.isFinite(b.gebe.bas) && Number.isFinite(b.gebe.dogum)) {
    const yarim = gun - b.gebe.bas >= (b.gebe.dogum - b.gebe.bas) / 2;
    if (yarim) {
      const kalan = Math.max(0, b.gebe.dogum - gun);
      l.push(`Üreme: gebe; ${kalan <= 0 ? 'doğum her an olabilir' : `yaklaşık ${kalan} gün içinde doğurması bekleniyor`}.`);
    } else l.push('Üreme: bu dönemde eşleşti; gebeliği henüz dışarıdan belli değil.');
  }
  const hepsi = d.k.hayvanlar;
  const yavrular = hepsi.filter((x) => x.anne === b.id || (x.baba === b.id && x.dna));
  if (yavrular.length) {
    const yasayan = yavrular.filter((x) => !x.olu);
    const buyuyen = yavrular.filter((x) => x.evre !== 'yavru' && !x.olu).length;
    l.push(`Yavruları: bilinen ${yavrular.length}, yaşayan ${yasayan.length}${buyuyen ? `, ${buyuyen} tanesi yavruluktan çıktı` : ''}.`);
  }
  return l;
}

// Ekosistem raporu ve Yardım için: gözlenebilen gebelikler
export function gebeSayisi(k) {
  return (k.hayvanlar || []).filter((b) => !b.olu && b.gebe).length;
}

let sayac = 0;
export function guncelle(d, dt) {
  sayac += dt;
  if (sayac < 2) return;
  sayac = 0;
  gebelikOnar(d.k);
  if (d.dinleniyor) return;
  kurDenetle(d);
  yavruCagrisi(d);
}
