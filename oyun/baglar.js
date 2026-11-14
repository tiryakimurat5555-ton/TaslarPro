// Aşama 24: sosyal bağlar, ittifaklar ve dışlanma (karar 67, 68). Saf mantık; Bg.guncelle(d, dt) her karede, işleri 2 sn'de bir,
// günlük işler gün dönünce. b.baglar {bireyId: güç 0-1}: tımarlaşma, oyun, teselli ve akrabalık bağı güçlendirir; zamanla zayıflar.
// Aslan erkekleri koalisyon kurar; bağsız ve alt sıradaki birey bazen sürüden dışlanır; yakın bağını kaybeden yas tutar, stres alır.
// Sayılar ÖNERİDİR.
import * as M from './mantik.js';
import { TURLER } from './veri.js';

export const BAG_TURLERI = ['babun', 'fil', 'aslan', 'zebra', 'yabanKopegi', 'sirtlan', 'manda', 'zurafa', 'impala', 'gnu'];
const DISLAYAN = ['babun', 'aslan', 'zebra', 'yabanKopegi', 'sirtlan', 'fil'];
const EN_COK_BAG = 4;
const sinirla = (x, a, b) => Math.max(a, Math.min(b, x));

function baglar(b) {
  if (!b.baglar || typeof b.baglar !== 'object' || Array.isArray(b.baglar)) b.baglar = {};
  return b.baglar;
}
function bagEkle(b1, b2, miktar) {
  if (!b1 || !b2 || b1 === b2 || b1.olu || b2.olu) return;
  for (const [a, c] of [
    [b1, b2],
    [b2, b1],
  ]) {
    const l = baglar(a);
    l[c.id] = sinirla((l[c.id] || 0) + miktar, 0, 1);
    const anahtarlar = Object.keys(l);
    if (anahtarlar.length > EN_COK_BAG) {
      const en = anahtarlar.sort((x, y) => l[x] - l[y])[0];
      delete l[en];
    }
  }
}
export const bagGucu = (a, b) => (a && b && a.baglar && Number.isFinite(a.baglar[b.id]) ? a.baglar[b.id] : 0);
const akrabaMi = (a, b) => a.anne === b.id || b.anne === a.id || (a.anne && a.anne === b.anne);

export function baglarOnar(k) {
  const ids = new Set((k.hayvanlar || []).map((b) => String(b.id)));
  for (const b of k.hayvanlar || []) {
    if (!b.baglar) continue;
    if (typeof b.baglar !== 'object' || Array.isArray(b.baglar)) {
      b.baglar = {};
      continue;
    }
    for (const id of Object.keys(b.baglar)) if (!ids.has(id) || !Number.isFinite(b.baglar[id])) delete b.baglar[id];
  }
}

const gorunurMu = (d, b) => !d.k.magara && M.mesafe(d.oyuncu, b) <= M.durbunMenzili(d.k.dk, d.k);
const ad = (b) => (M.taninmisMi(b) ? M.bireyAdi(b) : `bir ${M.kucukHarf(M.SOZ[b.tur])}`);

// Anlık: birlikte tımarlaşan ya da oynayan yakın bireyler bağ kurar; dışlanan birey sürünün kenarında görünür
function anlik(d) {
  const k = d.k;
  for (const g of k.gruplar) {
    if (!BAG_TURLERI.includes(g.tur)) continue;
    const u = M.uyeler(d, g);
    if (u.length < 2) continue;
    for (const b of u) {
      if (b.alt !== 'timarlaniyor' && b.alt !== 'oynuyor' && !(b.ozel && /teselli/.test(b.ozel.davranis || ''))) continue;
      let en = null;
      let em = 4;
      for (const c of u) {
        if (c === b) continue;
        const m = M.mesafe(b, c);
        if (m < em) {
          em = m;
          en = c;
        }
      }
      if (en) bagEkle(b, en, 0.01);
    }
    const gun = M.gunNo(k.dk);
    for (const b of u) {
      if (!Number.isFinite(b.dislanmis) || gun - b.dislanmis > 3 || (b.ozel && b.ozel.bitis > d.zaman) || Math.random() > 0.02) continue;
      b.ozel = { davranis: 'dislaniyor', bitis: d.zaman + 25 };
      if (gorunurMu(d, b) && !b._dislanmaGoruldu) {
        b._dislanmaGoruldu = true;
        M.olay(d, 'sosyal', `Dışlanma: ${M.BuyukHarf(ad(b))} sürünün kenarında tek başına; yaklaşınca öbürleri onu kovalıyor, aralarına almıyorlar. Grupta yakın bağı olmayan, alt sıradaki bireyler böyle dışlanabilir. ${M.BuyukHarf(M.yerTarifi(d.oyuncu, b))}.`, 3, { id: b.id });
      }
    }
  }
}

function gunluk(d) {
  const k = d.k;
  const gun = M.gunNo(k.dk);
  baglarOnar(k);
  const harita = new Map(k.hayvanlar.map((b) => [b.id, b]));
  // Zayıflama ve kayıp
  for (const b of k.hayvanlar) {
    if (b.olu || !b.baglar) continue;
    for (const id of Object.keys(b.baglar)) {
      const c = harita.get(Number(id)) || harita.get(id);
      if (!c) {
        delete b.baglar[id];
        continue;
      }
      if (c.olu) {
        const guc = b.baglar[id];
        delete b.baglar[id];
        if (guc > 0.35) {
          b.stres = sinirla((b.stres || 0) + 0.25 * guc, 0, 1);
          M.gecmisEkle(k, b, `Yakın bağı olan ${M.taninmisMi(c) ? M.bireyAdi(c) : 'bir grup arkadaşını'} kaybetti`);
        }
        continue;
      }
      b.baglar[id] = Math.round(b.baglar[id] * 0.97 * 1000) / 1000;
      if (b.baglar[id] < 0.05) delete b.baglar[id];
    }
  }
  for (const g of k.gruplar) {
    if (!BAG_TURLERI.includes(g.tur) || g.goc) continue;
    const u = M.uyeler(d, g);
    if (u.length < 2) continue;
    // Gündelik yakınlık: akrabalar ve yaşıtlar arasında bağ güçlenir
    for (const b of u) {
      const akraba = u.filter((c) => c !== b && akrabaMi(b, c));
      const yasit = u.filter((c) => c !== b && c.evre === b.evre && c.cinsiyet === b.cinsiyet);
      const havuz = akraba.length && Math.random() < 0.6 ? akraba : yasit.length ? yasit : u.filter((c) => c !== b);
      const c = havuz[Math.floor(Math.random() * havuz.length)];
      if (c && Math.random() < 0.5) bagEkle(b, c, akrabaMi(b, c) ? 0.08 : 0.05);
    }
    // Aslan erkek koalisyonu (ittifak): bağlı iki ya da daha çok yetişkin erkek
    if (g.tur === 'aslan') {
      const erkek = u.filter((b) => b.cinsiyet === 'erkek' && b.evre === 'yetiskin');
      const koalisyon = erkek.length >= 2 && erkek.some((a) => erkek.some((c) => c !== a && bagGucu(a, c) > 0.45));
      if (koalisyon && !g.koalisyon) {
        g.koalisyon = gun;
        M.mesajEkle(k, `Saha notu: aslan grubundaki erkekler bir koalisyon kurdu. Çoğu zaman kardeş olan erkekler birlikte bölge korur ve meydan okuyanlara karşı birbirini destekler.`, 'ekosistem');
      } else if (!koalisyon) delete g.koalisyon;
    }
    // Dışlanma: yakın bağı olmayan, alt sıradaki yetişkin bazen dışlanır; dışlanmışken stres artar
    if (DISLAYAN.includes(g.tur) && u.length >= 4) {
      for (const b of u) {
        if (b.evre !== 'yetiskin' || b.id === g.lider) continue;
        const toplam = Object.values(baglar(b)).reduce((s, x) => s + x, 0);
        if (Number.isFinite(b.dislanmis)) {
          if (toplam > 0.5 || gun - b.dislanmis > 3) {
            delete b.dislanmis;
            delete b._dislanmaGoruldu;
            M.gecmisEkle(k, b, 'Sürüye yeniden kabul edildi');
          } else b.stres = sinirla((b.stres || 0) + 0.1, 0, 1);
        } else if (toplam < 0.12 && Math.random() < 0.08) {
          b.dislanmis = gun;
          M.gecmisEkle(k, b, 'Sürüden dışlandı');
        }
      }
    }
  }
}

// Birey sayfası
export function bireySatirlari(d, b) {
  const l = [];
  const bl = b.baglar && typeof b.baglar === 'object' ? b.baglar : {};
  const harita = d.hayvanMap;
  const liste = Object.keys(bl)
    .map((id) => ({ c: harita.get(Number(id)) || harita.get(id), g: bl[id] }))
    .filter((x) => x.c && Number.isFinite(x.g))
    .sort((a, c) => c.g - a.g);
  if (liste.length) {
    const tanimli = liste.filter((x) => M.taninmisMi(x.c));
    const metin = tanimli.map((x) => `${M.bireyAdi(x.c)} (${x.g > 0.6 ? 'çok yakın' : x.g > 0.3 ? 'yakın' : 'tanıdık'}${akrabaMi(b, x.c) ? ', akrabası' : ''})`);
    const diger = liste.length - tanimli.length;
    l.push(`Sosyal bağları: ${[...metin, diger ? `${diger} tanımlanmamış birey` : ''].filter(Boolean).join(', ')}.`);
  } else if (BAG_TURLERI.includes(b.tur)) l.push('Sosyal bağları: henüz belirgin bir yakın bağı gözlenmedi.');
  if (Number.isFinite(b.dislanmis)) l.push('Şu sıralar sürüden dışlanmış; grubun kenarında yalnız kalıyor.');
  const g = d.k.gruplar.find((x) => x.id === b.grup);
  if (g && g.koalisyon && b.tur === 'aslan' && b.cinsiyet === 'erkek' && b.evre === 'yetiskin') l.push('Erkek koalisyonunun üyesi: bölgeyi öteki erkeklerle birlikte koruyor.');
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
