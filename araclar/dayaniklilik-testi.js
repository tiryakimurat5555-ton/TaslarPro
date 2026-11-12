// Çevrim dışı dayanıklılık testi (Aşama 7): kaydı yüzlerce kez rastgele bozar (alan silme, yanlış tür, NaN, boş dizi,
// eski sürüm alanları), her bozuk kaydı yükler, dünyayı kurar ve bir süre oynatır. Hiçbiri çökmemeli.
// Ayrıca oyunun ürettiği bütün metinlerde "undefined", "NaN", "[object" gibi bozuklukları arar.
// Kullanım: bun araclar/dayaniklilik-testi.js [deneme sayısı]
import * as M from '../oyun/mantik.js';
import * as Mz from '../oyun/merkez.js';
import * as K from '../oyun/kesif.js';
import * as B from '../oyun/betimleme.js';
import * as Eg from '../oyun/egitim.js';
import * as G from '../oyun/genisleme.js';

const deneme = +(process.argv[2] || 200);
const KOTU = /undefined|NaN|\[object|null\b|  |\.\.(?!\.)| ,|^ /;
const kotuMetinler = new Map();
const metinDenetle = (m, yer) => {
  if (typeof m !== 'string' || !m) return;
  const e = KOTU.exec(m);
  if (e && !kotuMetinler.has(m)) kotuMetinler.set(m, `${yer}, "${e[0]}" yakınında: ${m.slice(Math.max(0, e.index - 50), e.index + 30)}`);
};
function oynat(d, adim) {
  for (let i = 0; i < adim; i++) {
    M.guncelle(d, 0.1, { ileri: i % 50 < 25 ? 1 : 0, don: i % 70 < 10 ? 0.5 : 0 });
    Mz.guncelle(d);
    G.guncelle(d, 0.1);
    for (const o of M.olaylariAl(d)) metinDenetle(o.metin, o.tur);
    if (i % 60 === 0) {
      metinDenetle(B.betimle(d, 'Dürbün'), 'betimleme');
      metinDenetle(Eg.egitimDenetle(d, 'kendi'), 'eğitim');
      M.gozlemBaslat(d);
      M.fotografCek(d);
      metinDenetle(K.kucukAra(d), 'küçük canlı');
      metinDenetle(M.durumOzeti(d), 'durum');
      metinDenetle(M.etrafiTara(d), 'etraf');
      metinDenetle(M.konumOzeti(d), 'konum');
      // Aşama 8
      d.k.ekipman.drone = d.k.ekipman.tekne = d.k.ekipman.kampTakimi = true;
      metinDenetle(G.dronBaslat(d), 'dron');
      metinDenetle(G.kampKur(d), 'kamp');
      metinDenetle(G.haritaOzeti(d), 'harita');
      G.haritaBolgeleri(d).forEach((x) => G.haritaBolgeSatirlari(d, x.id).forEach((m) => metinDenetle(m, 'harita bölgesi')));
      G.hakimiyetSatirlari(d).forEach((m) => metinDenetle(m, 'hâkimiyet'));
      const b0 = d.k.hayvanlar.find((b) => !b.olu);
      if (b0) {
        b0.dna = true;
        G.aileSatirlari(d, b0).forEach((x) => metinDenetle(x.metin, 'aile'));
        G.genetikSatirlari(d, b0.tur).forEach((m) => metinDenetle(m, 'genetik'));
        metinDenetle(G.dnaAnalizi(d, b0).trim(), 'dna');
      }
    }
  }
  d.k.mesajlar.forEach((m) => metinDenetle(m.metin, 'mesaj'));
}

// 1) Sağlam bir kayıt: 2 oyun günü oyna
const k0 = M.arastirmaciOlustur('Dayanıklılık');
const d0 = M.dunyaOlustur(k0);
Mz.baslat(d0);
Eg.egitimBaslat(k0);
oynat(d0, (2 * 1440) / 0.5 / 0.1 / 8); // hızlı: çeyrek gün
const saglam = JSON.stringify(M.kayitHazirla(k0));
console.log('Sağlam kayıt', (saglam.length / 1024).toFixed(1), 'KB');

// 2) Rastgele bozma
let rnd = 12345;
const r = () => ((rnd = (rnd * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff);
const BOZUK = [undefined, null, NaN, 'yazı', -5, 1e12, [], {}, true];
function yollar(o, on = '', l = [], derinlik = 0) {
  if (!o || typeof o !== 'object' || derinlik > 4) return l;
  const anahtarlar = Array.isArray(o) ? o.slice(0, 3).map((_, i) => i) : Object.keys(o);
  for (const a of anahtarlar) {
    const y = on ? `${on}.${a}` : String(a);
    l.push(y);
    yollar(o[a], y, l, derinlik + 1);
  }
  return l;
}
const tumYollar = yollar(JSON.parse(saglam)).filter((y) => y !== 'ad' && y !== 'surum');
let basarili = 0;
let reddedilen = 0;
const hatalar = [];
for (let i = 0; i < deneme; i++) {
  const v = JSON.parse(saglam);
  const n = 1 + Math.floor(r() * 4);
  const bozulan = [];
  for (let j = 0; j < n; j++) {
    const y = tumYollar[Math.floor(r() * tumYollar.length)];
    const parcalar = y.split('.');
    let o = v;
    for (let p = 0; p < parcalar.length - 1 && o; p++) o = o[parcalar[p]];
    if (!o || typeof o !== 'object') continue;
    const son = parcalar[parcalar.length - 1];
    if (r() < 0.3) delete o[son];
    else o[son] = BOZUK[Math.floor(r() * BOZUK.length)];
    bozulan.push(y);
  }
  try {
    const k = M.kayittanYukle(JSON.parse(JSON.stringify(v)));
    if (!k) {
      reddedilen++;
      continue;
    }
    const d = M.dunyaOlustur(k);
    Mz.baslat(d);
    oynat(d, 400);
    JSON.stringify(M.kayitHazirla(k));
    basarili++;
  } catch (e) {
    hatalar.push(`${bozulan.join(', ')}: ${e.message} ${String(e.stack).split('\n')[1]}`);
  }
}
console.log(`Bozuk kayıt denemesi: ${deneme}, sorunsuz ${basarili}, reddedilen (ad/sürüm bozuk) ${reddedilen}, ÇÖKEN ${hatalar.length}`);
[...new Set(hatalar)].slice(0, 15).forEach((h) => console.log('  ÇÖKME:', h));
console.log(`Bozuk metin: ${kotuMetinler.size}`);
[...new Set(kotuMetinler.values())].slice(0, 20).forEach((yer) => console.log(`  ${yer}`));
if (hatalar.length || kotuMetinler.size) process.exitCode = 1;
