// Aşama 21: bilimsel yayınlar (karar 12) ve bilimsel kuruluşlarla sınırlı araştırma alışverişi (karar 61, 62).
// Saf mantık; Ya.guncelle(d, dt) her karede, işleri 3 sn'de bir. Tamamlanan her araştırma bir makaleye dönüşebilir: dergi seçilir,
// hakem süreci sürer, kabul, düzeltme ya da ret gelir; yayımlanan makaleler zamanla atıf alır. Kuruluşlar belirli verileri bir kez
// karşılıklı paylaşmayı önerir. Sayılar ÖNERİDİR.
import * as M from './mantik.js';
import * as Mz from './merkez.js';

export const DERGILER = {
  yerel: { ad: 'Doğu Afrika Yaban Hayatı Dergisi', itibar: 0, kabul: 0.72, odul: { itibar: 5, fon: 1000 }, atif: 0.2, hakem: [1, 1.5] },
  savan: { ad: 'Savan Ekolojisi Dergisi', itibar: 40, kabul: 0.52, odul: { itibar: 9, fon: 2200 }, atif: 0.35, hakem: [1.2, 2] },
  dunya: { ad: 'Uluslararası Koruma Biyolojisi', itibar: 100, kabul: 0.34, odul: { itibar: 15, fon: 4500 }, atif: 0.6, hakem: [1.5, 2.5] },
};
export const DERGI_SIRASI = Object.keys(DERGILER);

export const ISBIRLIKLERI = {
  universite: {
    ad: 'Bölge Üniversitesi Zooloji Bölümü', istek: '15 ses kaydı', ilerleme: (d) => [d.k.arsiv.sesler.length, 15],
    odul: { itibar: 4, fon: 3000 },
    metin: 'Ses arşivini öğrencilerin hayvan seslerini tanıma derslerinde kullanacaklar. Karşılığında bölüm, araştırmana destek fonu ayırdı.',
  },
  genetik: {
    ad: 'Yaban Hayatı Genetik Enstitüsü', istek: '3 hayvanın DNA profili', ilerleme: (d) => [d.k.hayvanlar.filter((b) => b.dna).length, 3],
    odul: { itibar: 5, fon: 4000 },
    metin: 'DNA profillerini bölgedeki öteki popülasyonlarla karşılaştırdılar; savandaki sürülerin komşu bölgelerle gen alışverişi yaptığını doğruladılar.',
  },
  herbaryum: {
    ad: 'Ulusal Herbaryum', istek: '4 bitkinin laboratuvar analizi', ilerleme: (d) => [Object.values(d.k.arsiv.bitkiler || {}).filter((x) => x && x.analiz).length, 4],
    odul: { itibar: 4, fon: 2500 },
    metin: 'Bitki örneklerin ulusal koleksiyona eklendi. Herbaryum, mevsimsel evre kayıtlarını iklim araştırmasında kullanacak.',
  },
  muze: {
    ad: 'Doğa Tarihi Müzesi', istek: '25 fotoğraf', ilerleme: (d) => [d.k.arsiv.fotolar.length, 25],
    odul: { itibar: 4, fon: 3000 },
    metin: 'Fotoğrafların müzenin savan sergisinde gösterilecek. Müze, sergi gelirinden araştırmana pay ayırdı.',
  },
};
export const ISBIRLIGI_SIRASI = Object.keys(ISBIRLIKLERI);

const sinirla = (x, a, b) => Math.max(a, Math.min(b, x));
const lira = (n) => Mz.liraSozu(n);

export function yayinAlani(k) {
  if (!k.yayin || typeof k.yayin !== 'object') k.yayin = {};
  const y = k.yayin;
  if (!Array.isArray(y.makaleler)) y.makaleler = [];
  y.makaleler = y.makaleler.filter((m) => m && Mz.ARASTIRMALAR.some((a) => a.id === m.konu) && DERGILER[m.dergi] && Number.isFinite(m.dk) && ['hakem', 'duzeltme', 'ret', 'yayimlandi'].includes(m.durum));
  for (const m of y.makaleler) if (!Number.isFinite(m.atif)) m.atif = 0;
  if (!y.isbirlik || typeof y.isbirlik !== 'object') y.isbirlik = {};
  for (const id of Object.keys(y.isbirlik)) if (!ISBIRLIKLERI[id]) delete y.isbirlik[id];
  if (!Number.isFinite(y.sonGun)) y.sonGun = M.gunNo(k.dk);
  return y;
}

const veriSayisi = (k) => k.arsiv.fotolar.length + k.arsiv.sesler.length + (k.arsiv.videolar || []).length;
const arastirma = (id) => Mz.ARASTIRMALAR.find((a) => a.id === id);
export const makaleBasligi = (m) => `${arastirma(m.konu).ad}`;

// Yazılabilecek makaleler: tamamlanmış ve henüz yayımlanmamış, hakemde olmayan araştırmalar
export function yazilabilirler(k) {
  const y = yayinAlani(k);
  return Mz.ARASTIRMALAR.filter((a) => k.arastirmalar[a.id] && k.arastirmalar[a.id].durum === 'tamam' && !y.makaleler.some((m) => m.konu === a.id && m.durum !== 'ret'));
}
export function kabulOlasiligi(k, dergiId, duzeltme = false) {
  const dg = DERGILER[dergiId];
  let p = dg.kabul + (M.personelVar(k, 'biyolog') ? 0.1 : 0) + Math.min(0.15, veriSayisi(k) / 200);
  if (duzeltme) p += 0.3;
  return sinirla(p, 0.05, 0.95);
}
export function dergiAcikMi(k, dergiId) {
  return k.itibar >= DERGILER[dergiId].itibar;
}

export function gonder(d, konu, dergiId) {
  const k = d.k;
  const y = yayinAlani(k);
  const a = arastirma(konu);
  const dg = DERGILER[dergiId];
  if (!a || !dg) return 'Böyle bir makale ya da dergi yok.';
  if (!yazilabilirler(k).includes(a)) return 'Bu araştırma için zaten bir makale süreçte ya da yayımlandı.';
  if (!dergiAcikMi(k, dergiId)) return `${dg.ad} için bilimsel itibarın yetersiz.`;
  const ret = y.makaleler.find((m) => m.konu === konu && m.durum === 'ret');
  if (ret && ret.dergi === dergiId) return 'Bu makale bu dergiden ret aldı; başka bir dergiye gönder.';
  y.makaleler = y.makaleler.filter((m) => !(m.konu === konu && m.durum === 'ret'));
  const sure = Math.round((dg.hakem[0] + Math.random() * (dg.hakem[1] - dg.hakem[0])) * 1440);
  y.makaleler.push({ konu, dergi: dergiId, durum: 'hakem', dk: k.dk, karar: k.dk + sure, atif: 0, duzeltme: false, veri: veriSayisi(k) });
  M.efekt(d, 'bildirim_mesaj', 0.6);
  return `Makaleni yazdın ve ${dg.ad} dergisine gönderdin: ${a.ad}. Hakemler yaklaşık ${Math.max(1, Math.round(sure / 1440))} gün içinde karar verecek. Bu sırada sahada çalışmaya devam edebilirsin.`;
}

export function duzeltmeGonder(d, konu) {
  const k = d.k;
  const y = yayinAlani(k);
  const m = y.makaleler.find((x) => x.konu === konu && x.durum === 'duzeltme');
  if (!m) return 'Düzeltme bekleyen böyle bir makale yok.';
  if (veriSayisi(k) <= m.veri) return 'Hakemler ek saha verisi istiyor. Sahada en az bir yeni fotoğraf, ses ya da video kaydı topladıktan sonra düzeltmeyi gönder.';
  m.durum = 'hakem';
  m.duzeltme = true;
  m.karar = k.dk + 1440;
  m.veri = veriSayisi(k);
  return `Hakemlerin istediği ek verileri ekleyip düzeltilmiş makaleyi ${DERGILER[m.dergi].ad} dergisine yeniden gönderdin. Karar yaklaşık bir gün sonra gelir.`;
}

function karar(d, m) {
  const k = d.k;
  const dg = DERGILER[m.dergi];
  const a = arastirma(m.konu);
  if (Math.random() < kabulOlasiligi(k, m.dergi, m.duzeltme)) {
    m.durum = 'yayimlandi';
    m.yayinDk = k.dk;
    M.itibarEkle(d, dg.odul.itibar);
    k.butce += dg.odul.fon;
    const metin = `Makalen yayımlandı! ${a.ad}, ${dg.ad}. Bilim çevrelerinde ilgi gördü; bir vakıf araştırmana ${lira(dg.odul.fon)} destek verdi.`;
    M.mesajEkle(k, metin, 'sonuc');
    M.arsivOlay(d, `Makale yayımlandı: ${a.ad} (${dg.ad}).`);
    M.olay(d, 'basari', metin, 4);
  } else if (!m.duzeltme && Math.random() < 0.65) {
    m.durum = 'duzeltme';
    m.veri = veriSayisi(k);
    const metin = `Hakem kararı: ${a.ad} makalesi için düzeltme istendi. Hakemler daha fazla saha verisi görmek istiyor. Yeni bir fotoğraf, ses ya da video kaydı topla, sonra Merkez, Yayınlar bölümünden düzeltmeyi gönder.`;
    M.mesajEkle(k, metin, 'bilgi');
    M.olay(d, 'mesaj', metin, 3);
  } else {
    m.durum = 'ret';
    const metin = `Hakem kararı: ${a.ad} makalesi ${dg.ad} dergisinden ret aldı. Hakemlerin yorumlarını dikkate alıp başka bir dergiye gönderebilirsin.`;
    M.mesajEkle(k, metin, 'bilgi');
    M.olay(d, 'mesaj', metin, 3);
  }
}

function gunluk(d) {
  const k = d.k;
  const y = yayinAlani(k);
  for (const m of y.makaleler) {
    if (m.durum !== 'yayimlandi') continue;
    const once = m.atif;
    const hiz = DERGILER[m.dergi].atif;
    if (Math.random() < hiz) m.atif++;
    if (Math.random() < hiz / 2) m.atif++;
    if (Math.floor(m.atif / 5) > Math.floor(once / 5)) {
      M.itibarEkle(d, 1);
      if (m.atif === 5 || m.atif % 20 === 0) M.mesajEkle(k, `${makaleBasligi(m)} makalen ${m.atif} kez atıf aldı; başka araştırmacılar senin bulgularını kullanıyor.`, 'bilgi');
    }
  }
}

export function isbirligiDurumu(d, id) {
  const ib = ISBIRLIKLERI[id];
  const [n, hedef] = ib.ilerleme(d);
  const y = yayinAlani(d.k);
  return { yapildi: !!y.isbirlik[id], n: Math.min(n, hedef), hedef, hazir: !y.isbirlik[id] && n >= hedef };
}
export function isbirligiYap(d, id) {
  const k = d.k;
  const ib = ISBIRLIKLERI[id];
  if (!ib) return 'Böyle bir kuruluş yok.';
  const du = isbirligiDurumu(d, id);
  if (du.yapildi) return `${ib.ad} ile veri alışverişini zaten yaptın.`;
  if (!du.hazir) return `${ib.ad} senden ${ib.istek} istiyor; şu an ${du.n} / ${du.hedef}.`;
  yayinAlani(k).isbirlik[id] = k.dk;
  M.itibarEkle(d, ib.odul.itibar);
  k.butce += ib.odul.fon;
  M.arsivOlay(d, `Veri alışverişi: ${ib.ad}.`);
  M.efekt(d, 'bildirim_gorev', 0.6);
  return `${ib.ad} ile verilerini paylaştın. ${ib.metin} Gelen destek: ${lira(ib.odul.fon)}.`;
}

export function makaleSatiri(m) {
  const dg = DERGILER[m.dergi];
  const baslik = makaleBasligi(m);
  if (m.durum === 'hakem') return `${baslik}: ${dg.ad} dergisinde hakem incelemesinde`;
  if (m.durum === 'duzeltme') return `${baslik}: ${dg.ad} düzeltme istedi`;
  if (m.durum === 'ret') return `${baslik}: ${dg.ad} reddetti; başka dergiye gönderilebilir`;
  return `${baslik}: ${dg.ad} dergisinde yayımlandı, ${m.atif} atıf`;
}
export function ozet(k) {
  const y = yayinAlani(k);
  const yay = y.makaleler.filter((m) => m.durum === 'yayimlandi');
  return `${yay.length} yayın, ${yay.reduce((s, m) => s + m.atif, 0)} atıf`;
}

let sayac = 0;
export function guncelle(d, dt) {
  sayac += dt;
  if (sayac < 3) return;
  sayac = 0;
  const k = d.k;
  const y = yayinAlani(k);
  for (const m of y.makaleler) if (m.durum === 'hakem' && k.dk >= m.karar) karar(d, m);
  const gun = M.gunNo(k.dk);
  if (gun !== y.sonGun) {
    y.sonGun = gun;
    gunluk(d);
  }
}
