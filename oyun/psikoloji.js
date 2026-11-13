// Aşama 19: stres ve psikoloji (karar 109). Saf mantık; Ps.guncelle(d, dt) her karede, işleri 2 sn'de bir, günlük işler gün dönünce.
// b.stres (0-1): yavaş değişen genel stres. Kaynakları: yalnızlık (sosyal türde sürüsünden tek kalmak), annesini kaybetmek,
// sosyal baskı (sıralama kavgasını kaybetmek), travma (avdan kıl payı kurtulmak, tel tuzağa düşmek). b.korku anlık öğrenilmiş
// korkudur (mantik.js); travma onu her gün biraz besler. Başa çıkma kişiliğe göre değişir; grup arkadaşları stresli bireyi
// teselli eder (fil, babun, aslan, zebra). Etkileri: kaçış mesafesi büyür, kondisyon yavaş düşer, yalnız kalan çağrı yapar.
// Sayılar ÖNERİDİR.
import * as M from './mantik.js';
import { TURLER, KISILIKLER } from './veri.js';

const TOPARLANMA = { cesur: 0.68, sakin: 0.74, merakli: 0.8, urkek: 0.88 }; // günlük stres çarpanı
export const BASA_CIKMA = {
  cesur: 'çabuk toparlanıyor; tehlikeyi kısa sürede unutup işine dönüyor',
  sakin: 'dengeli; sürüsünün yanında kalarak toparlanıyor',
  merakli: 'oyalanarak, çevresini keşfederek toparlanıyor',
  urkek: 'yavaş toparlanıyor; uzun süre tetikte kalıyor, sürünün ortasından ayrılmıyor',
};
const TESELLI_EDEN = ['fil', 'babun', 'aslan', 'zebra', 'yabanKopegi'];
const CAGRI_YAPAN = ['fil', 'zebra', 'babun', 'yabanKopegi', 'sirtlan', 'gnu', 'impala', 'manda', 'aslan'];
const TRAVMA_ADI = { avci: 'avcıdan kıl payı kurtuldu', tuzak: 'tel tuzağa düştü', anne: 'annesini kaybetti', kavga: 'sıralama kavgasını kaybetti' };
const TRAVMA_SIFAT = { avci: 'avcıdan kıl payı kurtulmuş', tuzak: 'tuzaktan kurtulmuş', anne: 'annesini kaybetmiş', kavga: 'kavgayı kaybetmiş' };
const sinirla = (x, a, b) => Math.max(a, Math.min(b, x));
const sosyalMi = (tur) => TURLER[tur] && TURLER[tur].grup && TURLER[tur].grup[1] > 2;

export function travmaEkle(d, b, neden, siddet = 0.3) {
  if (!b || b.olu) return;
  b.stres = sinirla((b.stres || 0) + siddet, 0, 1);
  b.travma = { neden, gun: M.gunNo(d.k.dk) };
}

// Anlık izleme: korku birden yükselen birey (kurtulan av, tuzaktan kurtarılan) travma yaşamıştır
function anlik(d) {
  const k = d.k;
  for (const b of k.hayvanlar) {
    if (b.olu) continue;
    const korku = b.korku || 0;
    const onceki = b._oncekiKorku || 0;
    if (korku - onceki > 0.35) travmaEkle(d, b, b.tuzakta || onceki === 0 && korku >= 0.75 ? 'tuzak' : 'avci', 0.25 + (korku - onceki) * 0.3);
    b._oncekiKorku = korku;
  }
  // Teselli: stresli bir bireyin yanına grup arkadaşı gelip dokunur, tımarlar (fil hortumuyla, babun tüylerini ayıklayarak)
  for (const g of k.gruplar) {
    if (!TESELLI_EDEN.includes(g.tur) || g.alarm > 0 || Math.random() > 0.01) continue;
    const u = M.uyeler(d, g);
    const stresli = u.find((b) => (b.stres || 0) > 0.3 && !(b.ozel && b.ozel.bitis > d.zaman));
    const yardimci = stresli && u.find((b) => b !== stresli && b.evre !== 'yavru' && (b.stres || 0) < 0.25 && !(b.ozel && b.ozel.bitis > d.zaman));
    if (!yardimci) continue;
    yardimci.ozel = { davranis: 'teselliEdiyor', bitis: d.zaman + 14 };
    stresli.ozel = { davranis: 'teselliEdiliyor', bitis: d.zaman + 14 };
    stresli.stres = Math.max(0, stresli.stres - 0.2);
    if (!k.magara && M.mesafe(d.oyuncu, stresli) <= M.durbunMenzili(k.dk, k)) {
      const nasil = g.tur === 'fil' ? 'hortumuyla ona dokunuyor, ağzına uzatıyor ve alçak sesle gürlüyor' : g.tur === 'babun' ? 'yanına oturup tüylerini ayıklıyor' : g.tur === 'aslan' ? 'başını onun başına sürtüyor' : g.tur === 'zebra' ? 'boynunu onun boynuna yaslıyor' : 'yanına sokulup onu yalıyor';
      M.olay(d, 'sosyal', `Teselli: ${M.taninmisMi(yardimci) ? M.bireyAdi(yardimci) : 'bir grup arkadaşı'}, ${stresli.travma ? (TRAVMA_SIFAT[stresli.travma.neden] || 'tedirgin') + ' ' : 'tedirgin '}${M.taninmisMi(stresli) ? M.bireyAdi(stresli) : M.kucukHarf(M.SOZ[g.tur])} için ${nasil}. ${M.BuyukHarf(M.yerTarifi(d.oyuncu, stresli))}.`, 3, { id: stresli.id });
    }
  }
  // Yalnız kalan sosyal hayvan zaman zaman sürüsünü çağırır
  for (const g of k.gruplar) {
    if (!CAGRI_YAPAN.includes(g.tur) || g.goc || Math.random() > 0.004) continue;
    const u = M.uyeler(d, g);
    if (u.length !== 1 || !sosyalMi(g.tur)) continue;
    const b = u[0];
    if (b.ozel && b.ozel.bitis > d.zaman) continue;
    b.ozel = { davranis: 'arkadasCagiriyor', bitis: d.zaman + 10 };
    const m = M.mesafe(d.oyuncu, b);
    if (!k.magara && m < 160) M.olay(d, 'iletisim', `${M.taninmisMi(b) ? M.bireyAdi(b) : 'Yalnız bir ' + M.kucukHarf(M.SOZ[g.tur])} sürüsünden ayrı düşmüş; durup uzun uzun çağırıyor, yanıt bekliyor. ${M.BuyukHarf(M.yerTarifi(d.oyuncu, b))}.`, 2, { id: b.id, ses: true, duyma: 160 });
  }
}

// Günlük: yalnızlık, yetimlik ve travma stresi besler; kişiliğe göre toparlanılır; stres kondisyonu yavaşça düşürür
function gunluk(d) {
  const k = d.k;
  const gun = M.gunNo(k.dk);
  const harita = new Map(k.hayvanlar.map((b) => [b.id, b]));
  const sayi = new Map();
  for (const b of k.hayvanlar) if (!b.olu) sayi.set(b.grup, (sayi.get(b.grup) || 0) + 1);
  for (const b of k.hayvanlar) {
    if (b.olu) continue;
    let s = Number.isFinite(b.stres) ? b.stres : 0;
    s *= TOPARLANMA[b.kisilik] || 0.78;
    if (sosyalMi(b.tur) && (sayi.get(b.grup) || 0) <= 1) {
      s += 0.18; // yalnızlık
      b.yalniz = true;
    } else b.yalniz = false;
    const anne = b.anne ? harita.get(b.anne) : null;
    if (b.yetim && (b.evre === 'yavru' || b.evre === 'genc')) {
      s += 0.12;
      if (!b.travma || b.travma.neden !== 'anne') b.travma = { neden: 'anne', gun };
    } else if (anne && anne.olu && b.evre === 'yavru' && !b.travma) b.travma = { neden: 'anne', gun };
    if (b.travma) {
      const yas = gun - b.travma.gun;
      if (yas <= 3) b.korku = Math.min(1, (b.korku || 0) + (b.kisilik === 'urkek' ? 0.08 : 0.04)); // öğrenilmiş korku canlı kalır
      if (yas > (b.kisilik === 'urkek' ? 10 : 6) && s < 0.25) {
        b.iyilesti = b.travma.neden;
        delete b.travma; // psikolojik iyileşme
      }
    }
    s = sinirla(s, 0, 1);
    if (s > 0.5 && Number.isFinite(b.kondisyon)) b.kondisyon = sinirla(b.kondisyon - 0.02 * s, 0.05, 1);
    b.stres = Math.round(s * 1000) / 1000;
  }
}

// Sağlık dosyası ve birey sayfası satırları
export function bireySatirlari(d, b) {
  const l = [];
  const s = b.stres || 0;
  const neden = [];
  if (b.yalniz) neden.push('sürüsünden ayrı, yalnız');
  if (b.yetim) neden.push('yetim');
  if (b.travma) neden.push(`${M.gunNo(d.k.dk) - b.travma.gun <= 1 ? 'yakın zamanda ' : ''}${TRAVMA_ADI[b.travma.neden] || 'bir tehlike atlattı'}`);
  if (s > 0.15 || neden.length) l.push(`Stres: ${s > 0.65 ? 'çok yüksek' : s > 0.4 ? 'yüksek' : s > 0.15 ? 'orta' : 'düşük'}${neden.length ? ` (${neden.join(', ')})` : ''}.`);
  else l.push('Stres: düşük; rahat görünüyor.');
  if (KISILIKLER[b.kisilik] && BASA_CIKMA[b.kisilik]) l.push(`Başa çıkma biçimi: ${BASA_CIKMA[b.kisilik]}.`);
  if (b.iyilesti && !b.travma) l.push(`Geçmişte ${TRAVMA_ADI[b.iyilesti] || 'bir sarsıntı yaşadı'}; artık toparlandı.`);
  return l;
}

let sayac = 0;
let sonGun = 0;
export function guncelle(d, dt) {
  sayac += dt;
  if (sayac < 2) return;
  sayac = 0;
  const gun = M.gunNo(d.k.dk);
  if (gun !== sonGun) {
    if (sonGun) gunluk(d);
    sonGun = gun;
  }
  if (!d.dinleniyor) anlik(d);
}
