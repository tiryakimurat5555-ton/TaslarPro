// ==== VAHŞİ YAŞAM: AŞAMA 8 GENİŞLEME (saf mantık) ====
// Briften henüz yapılmamış kararlar:
//  39 genetik ve koruma, 83 aile ağacı  → DNA (dışkı numunesi), akrabalık, çeşitlilik, kalıtsal hastalık, popülasyon riski
//  73 bölgesel hâkimiyet               → yırtıcıların bölge varlığı, hâkim tür, rekabet, liderlik mücadelesi
//  24 araç çeşitliliği                 → araştırma dronu, nehir teknesi
//  41 kamp sistemi                     → saha kampı (saklanak, dinlenme, şarj)
//  84 canlı ekosistem haritası         → gözlem, GPS, kamera tuzağı ve dronla açılan bilgiler
// mantik ve ekosistemi kullanır; mantik bunu içe aktarmaz. Sayılar ÖNERİ (Murat onaylamadı).
import { TURLER, ISTASYON, GOLET, KAYALIK, TERMITLER, YARICAP, nehirY, BOLGE_ADLARI, DAVRANISLAR } from './veri.js';
import * as M from './mantik.js';
import * as E from './ekosistem.js';
import * as Iz from './izler.js';

const kucuk = (s) => s.toLocaleLowerCase('tr-TR');
const yuzde = (v) => `yüzde ${Math.round(v * 100)}`;
const sinirla = (v, a, b) => Math.max(a, Math.min(b, v));

// =====================================================================
// 1. GENETİK VE AİLE AĞACI
// =====================================================================
export const cesitlilikSozu = (h) => (h >= 0.7 ? 'yüksek' : h >= 0.55 ? 'orta' : h >= 0.4 ? 'düşük' : 'çok düşük');

// Dışkı numunesi analizinde çağrılır (merkez): bireyin genetik profili çıkar, ebeveynlik doğrulanır
export function dnaAnalizi(d, b) {
  if (!b) return '';
  b.dna = true;
  const g = b.gen || { h: 0.6, tasiyici: false };
  let m = ` DNA profili çıkarıldı: genetik çeşitliliği ${cesitlilikSozu(g.h)} (${yuzde(g.h)}).`;
  m += g.tasiyici ? ' Kalıtsal bir zayıflık genini taşıyor; kendisi sağlıklı ama taşıyıcı bir eşle yavrularının dörtte biri zayıf doğabilir.' : ' Bilinen kalıtsal hastalık geni taşımıyor.';
  const baba = b.baba ? M.kayitliBirey(d, b.baba) : null;
  if (baba) m += ` Babası doğrulandı: ${M.taninmisMi(baba) ? M.bireyAdi(baba) : 'henüz tanımlanmamış bir erkek'}.`;
  else if (b.anne) m += ' Babası bölgeden geçen, kayıtlarda olmayan bir erkek.';
  if (b.akrabalik >= 0.0625) m += ` Ebeveynleri akraba: akrabalı yetişme katsayısı ${b.akrabalik.toLocaleString('tr-TR')}.`;
  if (b.kalitsal === 'zayiflik') m += ' Kalıtsal zayıflık taşıyor: iki taşıyıcı ebeveynden doğmuş.';
  return m;
}

// Bir türün popülasyon genetiği (karar 39): çeşitlilik, akrabalı doğumlar, yok olma riski
export function popGenetik(d, tur) {
  const k = d.k;
  const canli = k.hayvanlar.filter((b) => b.tur === tur && !b.olu);
  const dnali = canli.filter((b) => b.dna);
  const n = canli.length;
  const ortH = n ? canli.reduce((t, b) => t + ((b.gen && b.gen.h) || 0.6), 0) / n : 0;
  const yavrular = k.hayvanlar.filter((b) => b.tur === tur && b.dogumDk && typeof b.akrabalik === 'number');
  const akraba = yavrular.filter((b) => b.akrabalik >= 0.0625).length;
  const akrabaOrani = yavrular.length ? akraba / yavrular.length : 0;
  const tasiyici = dnali.filter((b) => b.gen && b.gen.tasiyici).length;
  let puan = 0;
  if (n < 5) puan += 3;
  else if (n < 10) puan += 2;
  else if (n < 16) puan += 1;
  if (ortH < 0.45) puan += 2;
  else if (ortH < 0.6) puan += 1;
  if (akrabaOrani > 0.3) puan += 1;
  const risk = puan >= 5 ? 'çok yüksek' : puan >= 3 ? 'yüksek' : puan >= 2 ? 'orta' : 'düşük';
  return { n, dnaSayisi: dnali.length, ortH, akrabaOrani, akraba, yavruSayisi: yavrular.length, tasiyici, risk, puan };
}
export const GENETIK_ESIK = 3; // güvenilir rapor için gereken DNA örneği
export function genetikSatirlari(d, tur) {
  const p = popGenetik(d, tur);
  const ad = kucuk(M.SOZ[tur]);
  if (p.dnaSayisi < GENETIK_ESIK) {
    return [`Genetik: ${p.dnaSayisi} bireyin DNA'sı var; güvenilir bir popülasyon raporu için en az ${GENETIK_ESIK} birey gerekir. Tanımlı bireylerden dışkı numunesi al.`];
  }
  const l = [
    `Popülasyon: bölgede ${p.n} ${ad}. Genetik çeşitlilik ${cesitlilikSozu(p.ortH)} (${yuzde(p.ortH)}), ${p.dnaSayisi} DNA örneğine göre.`,
    p.yavruSayisi ? `İzlenen ${p.yavruSayisi} doğumun ${p.akraba} tanesi akraba ebeveynlerden.` : 'Henüz izlenen doğum yok.',
    `Kalıtsal zayıflık geni taşıyan: ${p.tasiyici} birey. Yok olma riski: ${p.risk}.`,
  ];
  if (p.puan >= 3) l.push('Öneri: başka bir popülasyondan birey getirmek (translokasyon) çeşitliliği artırır. Araştırma merkezi, Koruma projelerinde.');
  return l;
}

// Aile ağacı (karar 83): anne, baba, kardeşler, yavrular, torunlar. Tanınmış akrabalar kendi sayfasına bağlanır.
export function aile(d, b) {
  const k = d.k;
  const hepsi = [...k.hayvanlar, ...k.disari.hayvanlar, ...k.rehab.map((r) => r.b)];
  const anne = b.anne ? M.kayitliBirey(d, b.anne) : null;
  const babaBilinir = b.dna || (b.baba && hepsi.some((x) => x.baba === b.baba && x.dna));
  const baba = b.baba ? M.kayitliBirey(d, b.baba) : null;
  const kardesler = b.anne ? hepsi.filter((x) => x !== b && x.anne === b.anne) : [];
  const yavrular = hepsi.filter((x) => x.anne === b.id || (x.baba === b.id && x.dna));
  const torunlar = hepsi.filter((x) => yavrular.some((y) => x.anne === y.id || (x.baba === y.id && x.dna)));
  return { anne, baba, babaBilinir, kardesler, yavrular, torunlar };
}
const kisaAd = (b) => `${M.taninmisMi(b) ? M.BuyukHarf(M.bireyAdi(b)) : `Tanımlanmamış ${kucuk(M.SOZ[b.tur])}`}${b.olu ? ', öldü' : ''}`;
// Menü satırları: { metin, bireyId } (bireyId tanınmışsa sayfasına gidilir)
export function aileSatirlari(d, b) {
  const a = aile(d, b);
  const l = [];
  const ekle = (on, x) => l.push({ metin: `${on}: ${kisaAd(x)}${x.cinsiyet ? `, ${x.cinsiyet === 'disi' ? 'dişi' : 'erkek'}` : ''}`, bireyId: M.taninmisMi(x) ? x.id : null });
  if (a.anne) ekle('Anne', a.anne);
  else l.push({ metin: b.gocmen ? 'Anne: bilinmiyor; bölgeye dışarıdan geldi.' : 'Anne: kayıt yok; bu hayvan izlemeden önce doğmuş.' });
  if (a.baba && a.babaBilinir) ekle('Baba', a.baba);
  else if (b.baba) l.push({ metin: 'Baba: DNA doğrulaması yok. Dışkı numunesiyle bulunabilir.' });
  else l.push({ metin: b.dna ? 'Baba: bölgeden geçen, kayıtlarda olmayan bir erkek.' : 'Baba: bilinmiyor.' });
  a.kardesler.slice(0, 8).forEach((x) => ekle('Kardeş', x));
  a.yavrular.slice(0, 10).forEach((x) => ekle('Yavru', x));
  if (a.torunlar.length) l.push({ metin: `Torun: ${a.torunlar.length} birey.` });
  if (b.dna && typeof b.akrabalik === 'number') l.push({ metin: `Akrabalı yetişme katsayısı ${b.akrabalik.toLocaleString('tr-TR')}${b.akrabalik >= 0.0625 ? '; ebeveynleri akraba' : '; ebeveynleri akraba değil'}.` });
  return l;
}

// Koruma projesi adımı: en riskli türe dışarıdan iki birey getirilir (translokasyon)
export function translokasyon(d) {
  const k = d.k;
  const turler = [...new Set(k.hayvanlar.filter((b) => !b.olu && !TURLER[b.tur].kus).map((b) => b.tur))];
  const aday = turler
    .map((t) => ({ t, p: popGenetik(d, t), g: k.gruplar.find((g) => g.tur === t && !g.goc) }))
    .filter((x) => x.g && x.p.dnaSayisi >= 1)
    .sort((a, b) => b.p.puan - a.p.puan || a.p.ortH - b.p.ortH)[0];
  if (!aday) return null;
  const yeni = M.gocmenEkle(d, aday.g, 2, ['erkek', 'disi']);
  k.koruma.translokasyon = { tur: aday.t, idler: yeni.map((b) => b.id), dk: k.dk };
  return `Başka bir koruma alanından iki ${kucuk(M.SOZ[aday.t])} (bir erkek, bir dişi) uyuşturularak getirildi ve ${M.bolgeAdi(aday.g.x, aday.g.y)} yakınında sürüye bırakıldı. Genetik çeşitlilikleri yüksek.`;
}

// =====================================================================
// 2. BÖLGESEL HÂKİMİYET VE REKABET (karar 73)
// =====================================================================
export const YIRTICI_GUC = { aslan: 3, sirtlan: 1.6, leopar: 1.4, yabanKopegi: 1.3, cita: 0.8 };
export const HAKIM_BOLGELER = ['golet', 'nehir', 'sulak', 'kayalik', 'galeri', 'termit', 'agaclik', 'otlak'];
const LIDERLI = ['aslan', 'zebra', 'impala'];
const grupGucu = (d, g) => {
  const u = M.uyeler(d, g);
  if (!u.length) return 0;
  const kon = u.reduce((t, b) => t + b.kondisyon, 0) / u.length;
  return u.length * (0.5 + kon) * (YIRTICI_GUC[g.tur] || 0);
};

function rekabetDenetle(d) {
  const k = d.k;
  const yirticilar = k.gruplar.filter((g) => YIRTICI_GUC[g.tur] && !g.goc && M.uyeler(d, g).length);
  if (!d.rekabetSon) d.rekabetSon = {};
  for (let i = 0; i < yirticilar.length; i++) {
    for (let j = i + 1; j < yirticilar.length; j++) {
      const a = yirticilar[i];
      const b = yirticilar[j];
      if (M.mesafe(a, b) > 28) continue;
      const anahtar = `${a.id}-${b.id}`;
      if (d.zaman - (d.rekabetSon[anahtar] || -999) < 120) continue;
      d.rekabetSon[anahtar] = d.zaman;
      d.say8 = d.say8 || {};
      d.say8.rekabet = (d.say8.rekabet || 0) + 1;
      const ga = grupGucu(d, a);
      const gb = grupGucu(d, b);
      const [guclu, zayif] = ga >= gb ? [a, b] : [b, a];
      M.grupAlarm(d, zayif, { x: guclu.x, y: guclu.y }, 8);
      const savunan = M.uyeler(d, guclu).sort((x, y) => M.mesafe(x, zayif) - M.mesafe(y, zayif))[0];
      if (savunan) {
        savunan.ozel = { davranis: 'bolgeKoruyor', bitis: d.zaman + 10 };
        savunan.kosu = d.zaman + 4;
      }
      M.uyeler(d, zayif).forEach((x) => (x.kosu = d.zaman + 4));
      const gor = savunan && M.mesafe(d.oyuncu, savunan) <= M.durbunMenzili(k.dk, k) && !k.magara;
      const m = `${M.BuyukHarf(cogul(guclu.tur))} ${cogulAkuzatif(zayif.tur)} bölgelerinden kovalıyor`;
      if (gor) {
        M.olay(d, 'rekabet', `Nadir an! ${m}, ${M.yerTarifi(d.oyuncu, savunan)}.`, 4, { id: savunan.id, hayvanTur: guclu.tur });
        M.arsivOlay(d, `${m}; ${M.bolgeAdi(savunan.x, savunan.y)}.`);
        M.itibarEkle(d, 4);
      }
    }
  }
}
const COGUL = { aslan: 'aslanlar', sirtlan: 'sırtlanlar', leopar: 'leopar', yabanKopegi: 'yaban köpekleri', cita: 'çitalar' };
const COGUL_I = { aslan: 'aslanları', sirtlan: 'sırtlanları', leopar: 'leoparı', yabanKopegi: 'yaban köpeklerini', cita: 'çitaları' };
const cogul = (t) => COGUL[t] || kucuk(M.SOZ[t]);
const cogulAkuzatif = (t) => COGUL_I[t] || kucuk(M.SOZ[t]);

// Her 2 saniyede bir: yırtıcı grupların bulunduğu bölgelere varlık puanı işlenir (kurak mevsimde su başları daha değerli)
function varlikIsle(d, sn) {
  const k = d.k;
  const kurak = E.takvim(M.gunNo(k.dk)).mevsim === 'kurak';
  for (const g of k.gruplar) {
    if (!YIRTICI_GUC[g.tur] || g.goc) continue;
    const bolge = M.bolgeBul(g.x, g.y);
    if (!HAKIM_BOLGELER.includes(bolge)) continue;
    const w = grupGucu(d, g) * (kurak && (bolge === 'golet' || bolge === 'nehir') ? 1.5 : 1) * (sn / 60);
    if (!w) continue;
    const v = k.hakimiyet.varlik[bolge] || (k.hakimiyet.varlik[bolge] = {});
    v[g.tur] = (v[g.tur] || 0) + w;
  }
}
// Günde bir: bölgelerin hâkim yırtıcısı belirlenir, değişenler duyurulur
function hakimiyetGunluk(d) {
  const k = d.k;
  const h = k.hakimiyet;
  const degisen = [];
  for (const bolge of HAKIM_BOLGELER) {
    const v = h.varlik[bolge] || {};
    const sira = Object.entries(v).sort((a, b) => b[1] - a[1]);
    let yeni = sira.length && sira[0][1] > 2 ? sira[0][0] : null;
    const eski = h.bolgeler[bolge] || null;
    // Eşik: yeni tür eski hâkimden belirgin biçimde güçlü olmalı (her gün el değiştirmesin)
    if (yeni && eski && yeni !== eski && sira[0][1] < (v[eski] || 0) * 1.4) yeni = eski;
    if (yeni && yeni !== eski) {
      h.bolgeler[bolge] = yeni;
      degisen.push({ bolge, eski, yeni });
      h.gecmis.unshift({ gun: M.gunNo(k.dk), bolge, eski, yeni });
    }
    // Eski varlık yavaşça unutulur
    Object.keys(v).forEach((t) => (v[t] *= 0.5));
  }
  if (h.gecmis.length > 30) h.gecmis.length = 30;
  const bilinen = (t) => !!k.arsiv.turler[t];
  const duyuru = degisen.filter((x) => x.eski && bilinen(x.yeni));
  if (duyuru.length) {
    const m = duyuru.map((x) => `${BOLGE_ADLARI[x.bolge]} artık ${cogul(x.yeni)} hâkimiyetinde${bilinen(x.eski) ? `; ${cogul(x.eski)} geri çekildi` : ''}`).join('. ');
    M.mesajEkle(k, `Bölge hâkimiyeti değişti: ${m}.`, 'ekosistem');
  }
}
export function hakimiyetSatirlari(d) {
  const k = d.k;
  const l = [];
  for (const bolge of HAKIM_BOLGELER) {
    const t = k.hakimiyet.bolgeler[bolge];
    if (t && k.arsiv.turler[t]) l.push(`${BOLGE_ADLARI[bolge]}: ${cogul(t)}`);
  }
  if (!l.length) return ['Bölge hâkimiyeti: henüz yeterli gözlem yok. Yırtıcılar birkaç gün izlendikçe hangi bölgenin kimde olduğu ortaya çıkar.'];
  const son = k.hakimiyet.gecmis.find((x) => x.eski && k.arsiv.turler[x.yeni]);
  return [`Bölge hâkimiyeti: ${l.join('; ')}.`, ...(son ? [`Son değişiklik ${son.gun}. gün: ${BOLGE_ADLARI[son.bolge]} ${cogul(son.yeni)} eline geçti.`] : [])];
}

// Liderlik mücadelesi (aslan, zebra, impala): sürüden ayrılmış genç bir erkek geri dönüp lidere meydan okur
const yasPuani = (b) => {
  const Y = E.YASAM[b.tur];
  if (!Y) return 0.5;
  const yil = (b.yas || 0) / E.yilGun(1);
  const orta = (Y.genc + Y.yasli) / 2; // en güçlü çağ: gençlikle yaşlılık arası
  return 1 - Math.min(1, Math.abs(yil - orta) / orta);
};
function liderBelirle(d, g) {
  const erkekler = M.uyeler(d, g).filter((b) => b.cinsiyet === 'erkek' && b.evre === 'yetiskin');
  if (!erkekler.length) {
    g.lider = null;
    return null;
  }
  const mevcut = erkekler.find((b) => b.id === g.lider);
  if (mevcut) return mevcut;
  const en = erkekler.sort((a, b) => b.kondisyon + yasPuani(b) - (a.kondisyon + yasPuani(a)))[0];
  g.lider = en.id;
  return en;
}
function meydanPlanla(d) {
  const k = d.k;
  for (const g of k.gruplar) {
    if (!LIDERLI.includes(g.tur) || g.goc || g.meydan) continue;
    const lider = liderBelirle(d, g);
    if (!lider || d.rng() > 0.1) continue;
    // Rakip: sürüden ayrılmış bir genç erkek ya da bölgeye dışarıdan gelen göçebe bir erkek
    const rakip = k.disari.hayvanlar.find((b) => b.tur === g.tur && b.cinsiyet === 'erkek' && !b.olu && b.disari === 'ayrildi' && (b.kondisyon || 0.6) > 0.45);
    g.meydan = { rakipId: rakip ? rakip.id : null, gocebe: !rakip, dk: k.dk + 60 + d.rng() * 600, evre: 'bekliyor' };
  }
}
function meydanGuncelle(d) {
  const k = d.k;
  for (const g of k.gruplar) {
    const m = g.meydan;
    if (!m) continue;
    if (m.evre === 'bekliyor') {
      if (k.dk < m.dk) continue;
      const lider = liderBelirle(d, g);
      const i = m.gocebe ? -1 : k.disari.hayvanlar.findIndex((b) => b.id === m.rakipId);
      if (!lider || (!m.gocebe && i < 0)) {
        g.meydan = null;
        continue;
      }
      // Rakip bölgeye döner (ya da dışarıdan gelir), liderin yanına gelir
      let rakip;
      if (m.gocebe) {
        rakip = M.gocmenEkle(d, g, 1, ['erkek'])[0];
        m.rakipId = rakip.id;
      } else {
        rakip = k.disari.hayvanlar.splice(i, 1)[0];
        rakip.disari = null;
        rakip.grup = g.id;
        rakip.evre = 'yetiskin';
        rakip.olu = false;
        k.hayvanlar.push(rakip);
        d.hayvanMap.set(rakip.id, rakip);
      }
      rakip.x = lider.x + 6;
      rakip.y = lider.y + 4;
      [lider, rakip].forEach((b) => {
        b.ozel = { davranis: 'meydanOkuyor', bitis: d.zaman + 14 };
        b.kosu = d.zaman + 3;
      });
      Object.assign(m, { evre: 'kavga', bitis: d.zaman + 14, liderId: lider.id });
      d.say8 = d.say8 || {};
      d.say8.meydan = (d.say8.meydan || 0) + 1;
      if (M.mesafe(d.oyuncu, lider) <= M.durbunMenzili(k.dk, k) && !k.magara) {
        m.goruldu = true;
        M.olay(d, 'meydan', `Nadir an! ${m.gocebe ? 'Bölgeye dışarıdan gelen bir' : 'Sürüden ayrılmış genç bir'} erkek ${kucuk(M.SOZ[g.tur])} geldi ve ${M.taninmisMi(lider) ? M.bireyAdi(lider) : 'sürünün liderine'}${M.taninmisMi(lider) ? "'e" : ''} meydan okuyor, ${M.yerTarifi(d.oyuncu, lider)}.`.replace("'e'e", "'e"), 4, { id: lider.id, hayvanTur: g.tur });
      }
      continue;
    }
    if (m.evre === 'kavga' && d.zaman >= m.bitis) {
      g.meydan = null;
      const lider = M.birey(d, m.liderId);
      const rakip = M.birey(d, m.rakipId);
      if (!lider || !rakip) continue;
      const guc = (b) => b.kondisyon * 0.6 + yasPuani(b) * 0.5 + d.rng() * 0.35;
      const kazanan = guc(rakip) > guc(lider) ? rakip : lider;
      const kaybeden = kazanan === rakip ? lider : rakip;
      g.lider = kazanan.id;
      if (d.rng() < 0.4) M.hastalikVer(d, kaybeden, 'yara', 0.3, 'Liderlik kavgasında yaralandı');
      M.gecmisEkle(k, kazanan, kazanan === rakip ? 'Liderlik mücadelesini kazanıp sürünün lideri oldu' : 'Meydan okuyan genç erkeği yendi, liderliğini korudu');
      M.gecmisEkle(k, kaybeden, kaybeden === lider ? 'Liderliği kaybetti, sürüden ayrıldı' : 'Liderlik mücadelesini kaybedip uzaklaştı');
      M.haritadanCikar(d, [kaybeden]);
      M.disariEkle(k, kaybeden, 'ayrildi');
      const ad = (b) => (M.taninmisMi(b) ? M.bireyAdi(b) : null);
      const sonuc =
        kazanan === rakip
          ? `Liderlik değişti: yeni gelen erkek kazandı${ad(lider) ? `; ${ad(lider)} sürüden ayrıldı` : ''}. Sürünün yeni lideri o.`
          : `${ad(lider) ? M.BuyukHarf(ad(lider)) : 'Sürünün lideri'} liderliğini korudu; rakip erkek kaçıp uzaklaştı.`;
      if (m.goruldu) {
        M.olay(d, 'meydanSonuc', sonuc, 4, { id: kazanan.id });
        M.arsivOlay(d, `${M.SOZ[g.tur]} sürüsünde liderlik mücadelesi: ${sonuc}`);
        M.itibarEkle(d, 5);
      } else if (k.arsiv.turler[g.tur] && (ad(lider) || ad(rakip))) {
        M.mesajEkle(k, `Saha raporu: ${kucuk(M.SOZ[g.tur])} sürüsünde liderlik mücadelesi oldu. ${sonuc}`, 'ekosistem');
      }
    }
  }
}

// =====================================================================
// 3. DRON, TEKNE, SAHA KAMPI (karar 24, 41)
// =====================================================================
const DRON_MENZIL = 110;
const DRON_HIZ = 22;
const DRON_TARAMA = 45;
export const dronVar = (k) => !!k.ekipman.drone;
export function dronBaslat(d) {
  const k = d.k;
  if (!dronVar(k)) return 'Dronun yok. Araştırma merkezinden alabilirsin.';
  if (k.magara) return k.magara.alan ? 'Dron istasyonda kaldı.' : 'Mağarada dron uçurulmaz.';
  if (d.dron) return 'Dron zaten havada.';
  if (k.drone.sarj <= 0) return 'Dronun bataryası bitti. İstasyonda ya da saha kampında kendiliğinden dolar.';
  if (k.eko && k.eko.yagmurVar && k.eko.siddet > 0.8) return 'Sağanakta dron uçurulmaz.';
  const o = d.oyuncu;
  let hx = o.x + Math.sin(o.yon) * DRON_MENZIL;
  let hy = o.y + Math.cos(o.yon) * DRON_MENZIL;
  const r = Math.hypot(hx, hy);
  if (r > YARICAP - 10) {
    hx *= (YARICAP - 10) / r;
    hy *= (YARICAP - 10) / r;
  }
  k.drone.sarj -= 1;
  k.drone.ucus = (k.drone.ucus || 0) + 1;
  d.dron = { x: o.x, y: o.y, hx, hy, evre: 'gidis', t: 0, ses: 0 };
  M.olay(d, 'dron', `Dron havalandı; ${M.yerTarifi(o, { x: hx, y: hy })} uzaklığa uçuyor. Kalan batarya: ${k.drone.sarj} uçuş.`, 3);
  return null;
}
export function dronGuncelle(d, dt) {
  const k = d.k;
  const r = d.dron;
  if (!r) return;
  const git = (tx, ty) => {
    const m = Math.hypot(tx - r.x, ty - r.y);
    const a = Math.min(m, DRON_HIZ * dt);
    if (m > 0.01) {
      r.x += ((tx - r.x) / m) * a;
      r.y += ((ty - r.y) / m) * a;
    }
    return m - a;
  };
  if (r.evre === 'gidis') {
    if (git(r.hx, r.hy) < 0.5) Object.assign(r, { evre: 'tarama', t: 0 });
  } else if (r.evre === 'tarama') {
    r.t += dt;
    if (r.t > 3) {
      M.olay(d, 'dronRapor', dronRaporu(d, r), 3);
      r.evre = 'donus';
    }
  } else if (r.evre === 'donus') {
    if (git(d.oyuncu.x, d.oyuncu.y) < 1) {
      d.dron = null;
      M.olay(d, 'dronIndi', 'Dron yanına indi.', 2);
      return;
    }
  }
  // Alçaktan geçen dron ürkek hayvanları ürkütebilir
  r.urkutme = (r.urkutme || 0) + dt;
  if (r.urkutme > 0.5) {
    r.urkutme = 0;
    for (const g of k.gruplar) {
      if (g.goc || g.alarm > 0 || M.mesafe(g, r) > 14) continue;
      const t = TURLER[g.tur];
      if (t.yirtici || t.kus || t.kacis < 28) continue;
      if (d.rng() < 0.25) M.grupAlarm(d, g, { x: r.x, y: r.y }, 5);
    }
  }
}
function dronRaporu(d, r) {
  const k = d.k;
  const yer = { x: r.hx, y: r.hy };
  const parcalar = [];
  for (const g of k.gruplar) {
    const u = M.uyeler(d, g).filter((b) => M.mesafe(b, yer) <= DRON_TARAMA);
    if (!u.length) continue;
    M.turKaydi(d, g.tur);
    haritaIsle(k, g, u.length, 'dron');
    const dv = DAVRANISLAR[u[0].davranis];
    parcalar.push({ m: M.mesafe(yer, u[0]), s: `${u.length} ${kucuk(M.SOZ[g.tur])} ${dv ? dv.fiil : ''}`.trim() });
  }
  (k.yuvalar || []).filter((y) => !y.bulundu && M.mesafe(y, yer) <= DRON_TARAMA && y.tur !== 'timsah').forEach((y) => Iz.yuvaBul(d, y, 'dron'));
  const tuzak = k.kacak.tuzaklar.filter((t) => !t.bulundu && M.mesafe(t, yer) <= DRON_TARAMA);
  tuzak.forEach((t) => (t.bulundu = true));
  const lesler = k.lesler.filter((l) => l.kalan > 0.05 && M.mesafe(l, yer) <= DRON_TARAMA).length;
  let m = `Dron raporu, ${M.yerTarifi(d.oyuncu, yer)}, ${M.bolgeAdi(yer.x, yer.y)}: `;
  m += parcalar.length ? parcalar.sort((a, b) => a.m - b.m).map((p) => p.s).join('; ') + '.' : 'görünürde hayvan yok.';
  if (lesler) m += ` ${lesler} leş görüldü.`;
  if (tuzak.length) m += ` ${tuzak.length} kaçak avcı tel tuzağı görüldü; yeri işaretlendi, gidip sökebilirsin.`;
  if (k.eko && k.eko.yanan && E.yangindaMi(k.eko, E.hucre(yer.x, yer.y))) m += ' Aşağıda yangın var!';
  return m;
}
function sarjDenetle(d) {
  const k = d.k;
  if (!dronVar(k) || k.drone.sarj >= 3 || d.dron) return;
  const istasyonda = M.mesafe(d.oyuncu, ISTASYON) < ISTASYON.r + 8;
  const kampta = k.kamp && M.mesafe(d.oyuncu, k.kamp) < 10;
  if (istasyonda || kampta) {
    k.drone.sarj = 3;
    M.olay(d, 'bilgi', `Dronun bataryası ${istasyonda ? 'istasyonda' : 'kamptaki güneş panelinden'} doldu: üç uçuş.`, 2);
  }
}

export const tekneVar = (k) => !!k.ekipman.tekne;
export const tekneYakin = (d) => tekneVar(d.k) && !d.k.teknede && !d.k.aracta && !d.k.magara && M.mesafe(d.oyuncu, d.k.tekne) < 7;
export function tekneyeBin(d) {
  const k = d.k;
  if (!tekneVar(k)) return 'Teknen yok. Araştırma merkezinden alabilirsin.';
  if (!tekneYakin(d)) return `Tekne ${M.yerTarifi(d.oyuncu, k.tekne)} uzakta. Yerler bölümünden Tekne'yi seçip yanına yürüyebilirsin.`;
  k.teknede = true;
  d.rota = null;
  d.yaklasId = null;
  d.oyuncu.x = k.tekne.x;
  d.oyuncu.y = k.tekne.y;
  d.oyuncu.yon = k.tekne.yon;
  M.olay(d, 'tekne', 'Tekneye bindin. Tek parmakla sürükleyerek nehir boyunca kürek çekersin; tekne akıntı yönünde kayar. Su aygırlarına çok yaklaşma: tekneye saldırabilirler.', 3, { bindi: true });
  return null;
}
export function tekneden(d) {
  const k = d.k;
  if (!k.teknede) return 'Teknede değilsin.';
  const o = d.oyuncu;
  const kuzey = o.y >= nehirY(o.x);
  const yan = kuzey ? 1 : -1;
  k.teknede = false;
  Object.assign(k.tekne, { x: o.x, y: o.y, yon: o.yon });
  o.y = nehirY(o.x) + yan * 6.5;
  M.olay(d, 'tekne', `Tekneyi ${kuzey ? 'kuzey' : 'güney'} kıyıya bağlayıp karaya çıktın. Tekne burada kalır.`, 3, { indi: true });
  return null;
}

export const kampVar = (k) => !!k.ekipman.kampTakimi;
export function kampKur(d) {
  const k = d.k;
  const o = d.oyuncu;
  if (!kampVar(k)) return 'Saha kampı takımın yok. Araştırma merkezinden alabilirsin.';
  if (k.magara || k.aracta || k.teknede) return 'Kampı ancak yayayken ve açık arazide kurabilirsin.';
  if (M.mesafe(o, ISTASYON) < 40) return 'İstasyona çok yakınsın; kamp uzak bir araştırma noktası olmalı (en az 40 metre).';
  if (M.nehirdeMi(o.x, o.y) || (GOLET.su > 0 && Math.hypot(o.x - GOLET.x, o.y - GOLET.y) < GOLET.su + 6)) return 'Suya bu kadar yakın kamp kurulmaz; hayvanların su yolunu kesersin.';
  if (Math.hypot(o.x, o.y) > YARICAP - 8) return 'Araştırma alanının sınırındasın; biraz içeri gel.';
  const tasindi = !!k.kamp;
  k.kamp = { x: o.x, y: o.y, bolge: M.bolgeAdi(o.x, o.y), gun: M.gunNo(k.dk) };
  M.olay(d, 'kamp', `${tasindi ? 'Eski kampını söküp' : 'Çadırını, gözlem saklanağını ve güneş panelini kurdun:'} saha kampın artık ${k.kamp.bolge} bölgesinde. Kamptayken hayvanlar seni daha az fark eder; burada dinlenebilir, dronunu şarj edebilirsin.`, 3);
  return null;
}
export const dinlenebilirMi = (d) => {
  const k = d.k;
  if (k.magara || k.aracta || k.teknede) return false;
  return M.mesafe(d.oyuncu, ISTASYON) < ISTASYON.r + 8 || (k.kamp && M.mesafe(d.oyuncu, k.kamp) < 10);
};
// Dinlenme hedefi: oyun dakikası
export function dinlenmeHedefi(k, tur) {
  const gunDk = M.gunDakikasi(k.dk);
  const bas = k.dk - gunDk;
  if (tur === 'iki') return k.dk + 120;
  if (tur === 'aksam') return gunDk < 17 * 60 + 30 ? bas + 17 * 60 + 30 : bas + 1440 + 17 * 60 + 30;
  return gunDk < 5 * 60 + 30 ? bas + 5 * 60 + 30 : bas + 1440 + 5 * 60 + 30; // sabah
}
// Dinlenirken olanların özeti (App biriktirir)
const OZET_TURLERI = ['tanik', 'avBasladi', 'meydan', 'meydanSonuc', 'rekabet', 'hava', 'mevsim', 'yangin', 'gorevBitti', 'analizBitti', 'kacakTuzak', 'saldiri', 'belirti', 'basari', 'gizem', 'gizemCozuldu', 'insan', 'yonetim', 'grupSavunma', 'yas', 'ozelBirey'];
export const dinlenmeOzetiSec = (o) => OZET_TURLERI.includes(o.tur);

// =====================================================================
// 4. CANLI EKOSİSTEM HARİTASI (karar 38, 84)
// =====================================================================
export const BOLGE_MERKEZ = {
  istasyon: { x: ISTASYON.x, y: ISTASYON.y },
  golet: { x: GOLET.x, y: GOLET.y },
  nehir: { x: 0, y: nehirY(0) + 10 },
  sulak: { x: -10, y: -145 },
  kayalik: { x: KAYALIK.x, y: KAYALIK.y },
  galeri: { x: 145, y: nehirY(145) + 18 },
  termit: { x: TERMITLER.x, y: TERMITLER.y },
  agaclik: { x: 40, y: 125 },
  otlak: { x: -70, y: 10 },
};
export function haritaIsle(k, g, sayi, kaynak) {
  if (!k.harita || !g) return;
  k.harita.gruplar[g.id] = { tur: g.tur, x: Math.round(g.x), y: Math.round(g.y), sayi, dk: k.dk, kaynak };
}
function haritaGuncelle(d) {
  const k = d.k;
  if (k.magara) return;
  const gorulen = new Map();
  for (const { b } of M.gorunurler(d)) gorulen.set(b.grup, (gorulen.get(b.grup) || 0) + 1);
  gorulen.forEach((n, gid) => haritaIsle(k, k.gruplar.find((g) => g.id === gid), n, 'gözlem'));
  for (const id of k.gpsli || []) {
    const b = M.birey(d, id);
    if (b && !b.olu) haritaIsle(k, k.gruplar.find((g) => g.id === b.grup), M.uyeler(d, { id: b.grup }).length, 'GPS');
  }
  // Silinen grupların bilgisi temizlenir
  Object.keys(k.harita.gruplar).forEach((gid) => {
    if (!k.gruplar.some((g) => String(g.id) === gid)) delete k.harita.gruplar[gid];
  });
}
const sureSozu = (dk) => (dk < 2 ? 'şu an' : dk < 60 ? `${Math.round(dk)} dakika önce` : dk < 1440 ? `${Math.round(dk / 60)} saat önce` : `${Math.round(dk / 1440)} gün önce`);
export function haritaBolgeleri(d) {
  const o = d.oyuncu;
  return Object.entries(BOLGE_MERKEZ)
    .map(([id, p]) => ({ id, ad: BOLGE_ADLARI[id], p, m: M.mesafe(o, p) }))
    .sort((a, b) => a.m - b.m);
}
export function haritaBolgeSatirlari(d, id) {
  const k = d.k;
  const p = BOLGE_MERKEZ[id];
  const l = [`${BOLGE_ADLARI[id]}: ${M.yerTarifi(d.oyuncu, p)}.`];
  if (k.eko && id !== 'istasyon') {
    const ot = E.otDegeri(k.eko, p.x, p.y);
    l.push(`Otlak ${ot > 0.6 ? 'gür' : ot > 0.35 ? 'orta' : ot > 0.15 ? 'seyrek' : 'neredeyse tükenmiş'}${k.eko.yanik && k.eko.yanik[E.hucre(p.x, p.y)] ? '; yakın zamanda yandı' : ''}${k.eko.yanan && E.yangindaMi(k.eko, E.hucre(p.x, p.y)) ? '; ŞU AN YANIYOR' : ''}.`);
  }
  if (id === 'golet' && k.eko) l.push(`Gölet ${E.goletSozu(k.eko)}.`);
  const hakim = k.hakimiyet.bolgeler[id];
  if (hakim && k.arsiv.turler[hakim]) l.push(`Hâkim yırtıcı: ${cogul(hakim)}.`);
  const bilinen = Object.values(k.harita.gruplar)
    .filter((x) => M.bolgeBul(x.x, x.y) === id && k.arsiv.turler[x.tur])
    .sort((a, b) => b.dk - a.dk);
  if (bilinen.length) bilinen.forEach((x) => l.push(`${M.BuyukHarf(kucuk(M.SOZ[x.tur]))}: ${x.sayi} birey, ${sureSozu(k.dk - x.dk)}, ${x.kaynak} ile.`));
  else l.push('Bu bölgede bilinen bir sürü yok. Gözlem, dron, kamera tuzağı ya da GPS tasmasıyla bilgi toplanır.');
  const tuzaklar = k.tuzaklar.filter((t) => M.bolgeBul(t.x, t.y) === id).length;
  if (tuzaklar) l.push(`${tuzaklar} kamera tuzağın burada.`);
  const tel = k.kacak.tuzaklar.filter((t) => t.bulundu && M.bolgeBul(t.x, t.y) === id).length;
  if (tel) l.push(`${tel} işaretli tel tuzak sökülmeyi bekliyor.`);
  if (k.kamp && M.bolgeBul(k.kamp.x, k.kamp.y) === id) l.push('Saha kampın bu bölgede.');
  Iz.bilinenYuvalar(k)
    .filter((y) => M.bolgeBul(y.x, y.y) === id)
    .forEach((y) => l.push(`${M.YUVA_TURLERI[y.tur].ad}: ${M.yerTarifi(d.oyuncu, y)}.`));
  return l;
}
export function haritaOzeti(d) {
  const k = d.k;
  const n = Object.values(k.harita.gruplar).filter((x) => k.arsiv.turler[x.tur]).length;
  const gocte = k.gruplar.filter((g) => g.goc).length + k.disari.gruplar.length;
  return `Haritada bilinen ${n} sürü${gocte ? `, göçte ${gocte} sürü` : ''}.`;
}

// =====================================================================
// Her karede (App döngüsünden): seyrek işler zamanlayıcıyla
// =====================================================================
export function guncelle(d, dt) {
  const k = d.k;
  dronGuncelle(d, dt);
  d.g8 = (d.g8 || 0) + dt;
  if (d.g8 < 2) return;
  const sn = d.g8;
  d.g8 = 0;
  varlikIsle(d, sn);
  rekabetDenetle(d);
  meydanGuncelle(d);
  haritaGuncelle(d);
  sarjDenetle(d);
  if (k.koruma && k.koruma.translokasyonIste) {
    k.koruma.translokasyonIste = false;
    const m = translokasyon(d);
    M.mesajEkle(k, m || 'Translokasyon yapılamadı: DNA örneği alınmış ve grubu bölgede olan bir tür gerekir.', 'koruma');
  }
  const gun = M.gunNo(k.dk);
  if (k.hakimiyet.gun !== gun) {
    if (k.hakimiyet.gun) {
      hakimiyetGunluk(d);
      meydanPlanla(d);
    }
    k.hakimiyet.gun = gun;
  }
}
