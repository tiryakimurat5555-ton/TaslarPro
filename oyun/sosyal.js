// Aşama 13: sosyal yaşam, ebeveynlik ve öğrenme (karar 68, 102, 106, 107). Saf mantık; Sy.guncelle(d, dt) her karede.
// Av becerisi (b.beceri 0-1) ve grubun av deneyimi (g.avDeneyim) mantik.js avGuncelle içinde değişir; burada nesiller arası
// aktarım, anne deneyimi, sıralama kavgaları ve uzlaşma, yırtıcı annelerin av öğretmesi işlenir. Sayılar ÖNERİDİR.
import * as M from './mantik.js';
import { TURLER, KISILIKLER } from './veri.js';
import * as E from './ekosistem.js';

const KAVGA_TURLERI = { babun: 0.006, aslan: 0.002, zebra: 0.002, fil: 0.001, impala: 0.002 }; // 2 sn başına grup olasılığı
const OGRETEN = ['cita', 'leopar', 'aslan'];
const sinirla = (x, a, b) => Math.max(a, Math.min(b, x));

// Günlük: yavrular annelerinden öğrenir, anne deneyimi yavrunun kondisyonunu etkiler
function gunluk(d) {
  const k = d.k;
  const harita = new Map(k.hayvanlar.map((b) => [b.id, b]));
  for (const b of k.hayvanlar) {
    if (b.olu) continue;
    if (!Number.isFinite(b.beceri)) delete b.beceri;
    const anne = b.anne ? harita.get(b.anne) : null;
    // Büyüyen yavru annenin deneyimine yazılır
    if (b.evre !== 'yavru' && !b.buyudu && b.anne) {
      b.buyudu = true;
      if (anne) anne.yavruBuyuttu = Math.min(9, (anne.yavruBuyuttu || 0) + 1);
    }
    if (!anne || anne.olu || (b.evre !== 'yavru' && b.evre !== 'genc')) continue;
    // Yırtıcılarda av becerisi anneden yavruya kısmen geçer (izleyerek öğrenme)
    if (TURLER[b.tur].yirtici && Number.isFinite(anne.beceri)) {
      const hedef = anne.beceri * 0.8;
      const simdi = b.beceri ?? 0.3;
      if (hedef > simdi) b.beceri = Math.round((simdi + (hedef - simdi) * 0.15) * 1000) / 1000;
    }
    // Savunma: annenin ürkekliği yavruya geçer (tehlikeden kaçmayı öğrenir)
    if ((anne.korku || 0) > (b.korku || 0)) b.korku = Math.min(1, (b.korku || 0) + ((anne.korku || 0) - (b.korku || 0)) * 0.3);
    // Ebeveynlik: deneyimli ve sakin anne yavrusunu daha iyi besler; ilk kez doğuran ve ürkek anne zorlanır
    if (b.evre === 'yavru') {
      const deneyim = anne.yavruBuyuttu || 0;
      const kisilik = anne.kisilik === 'sakin' ? 0.005 : anne.kisilik === 'urkek' ? -0.006 : 0;
      const etki = (deneyim === 0 ? -0.012 : deneyim >= 2 ? 0.012 : 0.004) + kisilik;
      if (Number.isFinite(b.kondisyon)) b.kondisyon = sinirla(b.kondisyon + etki, 0.05, 1);
    }
  }
}

// Ara sıra: sıralama kavgası ve ardından uzlaşma; yırtıcı annelerin yavrularına av öğretmesi
function anlik(d) {
  const k = d.k;
  for (const g of k.gruplar) {
    const p = KAVGA_TURLERI[g.tur];
    if (p && Math.random() < p) {
      const y = M.uyeler(d, g).filter((b) => b.evre === 'yetiskin' && !(b.ozel && b.ozel.bitis > d.zaman));
      if (y.length >= 2) {
        const [a, b] = y.sort(() => Math.random() - 0.5);
        a.ozel = { davranis: 'siraKavgasi', bitis: d.zaman + 8 };
        b.ozel = { davranis: 'siraKavgasi', bitis: d.zaman + 8 };
        // Babunlar ve filler kavgadan sonra barışır (uzlaşma), kaybeden kazananı tımar eder
        if (g.tur === 'babun' || g.tur === 'fil' || g.tur === 'aslan') setTimeoutYerine(d, b, 'uzlasma', 8, 12);
        if (M.mesafe(d.oyuncu, a) <= M.durbunMenzili(k.dk, k) && !k.magara)
          M.olay(d, 'sosyal', `${M.BuyukHarf(M.SOZ[g.tur])} grubunda iki yetişkin sıralama için kavga ediyor${g.tur === 'babun' ? '; çığlıklar, dişler gösteriliyor' : ''}. ${M.BuyukHarf(M.yerTarifi(d.oyuncu, a))}.`, 2, { id: a.id });
      }
    }
    if (OGRETEN.includes(g.tur) && g.plan === 'beslen' && Math.random() < 0.02) {
      const anneler = M.uyeler(d, g).filter((b) => b.cinsiyet === 'disi' && b.evre === 'yetiskin' && k.hayvanlar.some((y) => !y.olu && y.anne === b.id && (y.evre === 'yavru' || y.evre === 'genc')));
      const anne = anneler[0];
      if (anne && !(anne.ozel && anne.ozel.bitis > d.zaman)) {
        anne.ozel = { davranis: 'avOgretiyor', bitis: d.zaman + 20 };
        k.hayvanlar.forEach((y) => {
          if (!y.olu && y.anne === anne.id && (y.evre === 'yavru' || y.evre === 'genc')) y.beceri = Math.min(1, (y.beceri ?? 0.3) + 0.04);
        });
        if (M.mesafe(d.oyuncu, anne) <= M.durbunMenzili(k.dk, k) && !k.magara)
          M.olay(d, 'sosyal', `${M.taninmisMi(anne) ? M.bireyAdi(anne) : 'Bir ' + M.kucukHarf(M.SOZ[g.tur]) + ' annesi'} yavrularına avlanmayı öğretiyor: ${g.tur === 'cita' ? 'yaralı bir ceylan yavrusunu onlara bırakıyor, yavrular yakalamayı deniyor' : 'avı onların önüne bırakıp yakalamalarını bekliyor'}.`, 3, { id: anne.id });
      }
    }
  }
}
// Kavganın ardından gecikmeli uzlaşma (oyun saatiyle; zamanlayıcı kullanmadan)
// (kayda yazılmaz: d.sonrakiler oturumluk)
function setTimeoutYerine(d, b, davranis, gecikme, sure) {
  (d.sonrakiler = d.sonrakiler || []).push({ b, davranis, bas: d.zaman + gecikme, bitis: d.zaman + gecikme + sure });
}
function sonrakileriIsle(d) {
  if (!d.sonrakiler || !d.sonrakiler.length) return;
  d.sonrakiler = d.sonrakiler.filter((x) => {
    if (d.zaman < x.bas) return true;
    if (!x.b.olu) x.b.ozel = { davranis: x.davranis, bitis: x.bitis };
    return false;
  });
}

// Birey sayfası satırları
export function bireySatirlari(d, b) {
  const l = [];
  if (TURLER[b.tur].yirtici && Number.isFinite(b.beceri)) l.push(`Av becerisi ${b.beceri > 0.75 ? 'çok yüksek' : b.beceri > 0.55 ? 'yüksek' : b.beceri > 0.35 ? 'orta' : 'düşük'}; her denemeyle, başarısız olsa da öğreniyor.`);
  if (b.cinsiyet === 'disi' && (b.yavruBuyuttu || 0) > 0) l.push(`Deneyimli anne: ${b.yavruBuyuttu} yavru büyüttü. Yavruları daha iyi beslenir.`);
  else if (b.cinsiyet === 'disi' && d.k.hayvanlar.some((y) => !y.olu && y.anne === b.id && y.evre === 'yavru')) l.push('İlk yavrusunu büyütüyor; deneyimsiz anneler daha çok zorlanır.');
  if (b.kisilik && KISILIKLER[b.kisilik] && b.evre === 'yetiskin' && b.cinsiyet === 'disi') l.push(`Kişiliği ${KISILIKLER[b.kisilik].ad}; bu, yavrularına bakışını da etkiler.`);
  return l;
}
// Tür sayfası: av stratejisi ve grubun deneyimi
export function turSatirlari(d, tur) {
  const l = [];
  const st = M.AV_STRATEJI[tur];
  if (st) {
    l.push(`Av stratejisi: ${st.ad}.`);
    const dn = {};
    for (const g of d.k.gruplar) if (g.tur === tur && g.avDeneyim) for (const [t, x] of Object.entries(g.avDeneyim)) if (TURLER[t] && Array.isArray(x)) dn[t] = [(dn[t] || [0, 0])[0] + x[0], (dn[t] || [0, 0])[1] + x[1]];
    const p = Object.entries(dn).filter(([, x]) => x[0] >= 2).sort((a, b) => b[1][0] - a[1][0]).slice(0, 4).map(([t, x]) => `${M.kucukHarf(M.SOZ[t])} ${x[0]} denemede ${x[1]} başarı`);
    if (p.length) l.push(`Bölgedeki av kayıtları: ${p.join(', ')}. Hangi avda başarılıysalar onu daha çok seçerler.`);
  }
  const sv = d.k.gruplar.filter((g) => g.tur === tur && (g.savunmaDeneyim || 0) > 0);
  if (sv.length) l.push(`Bu türün sürüleri saldırılara karşı ${sv.some((g) => g.savunmaDeneyim > 0.4) ? 'deneyimli; yetişkinler hızla saf tutuyor' : 'birlikte savunmayı öğreniyor'}.`);
  return l;
}

let sayac = 0;
export function guncelle(d, dt) {
  sayac += dt;
  if (sayac < 2) return;
  sayac = 0;
  const k = d.k;
  const gun = M.gunNo(k.dk);
  if (k.sosyalGun !== gun) {
    k.sosyalGun = gun;
    gunluk(d);
  }
  anlik(d);
  sonrakileriIsle(d);
}

// ---------- Bireysel sağlık dosyası (karar 112) ----------
export function saglikDosyasi(d, b) {
  const l = [];
  const kond = Number.isFinite(b.kondisyon) ? b.kondisyon : 0.7;
  l.push(`Beslenme durumu: ${kond > 0.75 ? 'çok iyi' : kond > 0.55 ? 'iyi' : kond > 0.35 ? 'zayıf' : 'çok zayıf'}.`);
  if (b.hastalik && b.hastalik.goruldu && E.HASTALIKLAR[b.hastalik.id]) l.push(`Şu anki sorun: ${E.HASTALIKLAR[b.hastalik.id].ad}${b.hastalik.tedavi ? ', tedavi edildi, iyileşiyor' : ''}.`);
  else if (b.teshis && E.HASTALIKLAR[b.teshis]) l.push(`Laboratuvar teşhisi: ${E.HASTALIKLAR[b.teshis].ad}.`);
  else l.push('Görünür bir hastalık belirtisi yok.');
  const gecmis = Array.isArray(b.gecmis) ? b.gecmis.filter((x) => x && typeof x.metin === 'string' && /yaral|parazit|uyuz|tuzak|tedavi|hasta|şarbon|distemper/i.test(x.metin)) : [];
  if (gecmis.length) l.push(`Sağlık geçmişi: ${gecmis.slice(0, 4).map((x) => `${x.metin.replace(/\.$/, '')} (${M.gunNo(x.dk)}. gün)`).join('; ')}.`);
  if (b.kalitsal) l.push('Kalıtsal zayıflık taşıyor.');
  if ((b.korku || 0) > 0.4) l.push('Stres düzeyi yüksek: yakın zamanda bir tehlike atlatmış, ürkek davranıyor.');
  if (Array.isArray(b.bagisik) && b.bagisik.length) l.push(`Bağışık olduğu hastalıklar: ${b.bagisik.filter((h) => E.HASTALIKLAR[h]).map((h) => E.HASTALIKLAR[h].ad).join(', ')}.`);
  return l;
}
