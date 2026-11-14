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
import * as Iz from '../oyun/izler.js';
import * as H from '../oyun/hikaye.js';
import * as S from '../oyun/su.js';
import * as Y from '../oyun/yonetim.js';
import * as Sy from '../oyun/sosyal.js';
import * as Il from '../oyun/iletisim.js';
import * as Ps from '../oyun/psikoloji.js';
import * as Bo from '../oyun/botanik.js';
import * as Ur from '../oyun/ureme.js';
import * as Ya from '../oyun/yayin.js';
import * as Ik from '../oyun/iklim.js';
import * as Gc from '../oyun/gece.js';
import * as Hd from '../oyun/hedefler.js';
import * as Bg from '../oyun/baglar.js';
import { BITKI_SIRASI } from '../oyun/ekosistem.js';

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
    Iz.guncelle(d, 0.1);
    H.guncelle(d, 0.1);
    S.guncelle(d, 0.1);
    Y.guncelle(d, 0.1);
    Sy.guncelle(d, 0.1);
    Il.guncelle(d, 0.1);
    Ps.guncelle(d, 0.1);
    Bo.guncelle(d, 0.1);
    Ur.guncelle(d, 0.1);
    Ya.guncelle(d, 0.1);
    Ik.guncelle(d, 0.1);
    Hd.guncelle(d, 0.1);
    Bg.guncelle(d, 0.1);
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
      // Aşama 9
      metinDenetle(Iz.izAra(d), 'iz');
      metinDenetle(Iz.izTakip(d), 'iz takip');
      metinDenetle(Iz.videoBaslat(d), 'video');
      Iz.yuvaSatirlari(d).forEach((x) => metinDenetle(x.metin, 'yuva'));
      d.k.hayvanlar.slice(0, 3).forEach((b) => metinDenetle(M.ruzgarUyarisi(d, b).trim(), 'rüzgâr'));
      G.haritaBolgeleri(d).forEach((x) => G.haritaBolgeSatirlari(d, x.id).forEach((m) => metinDenetle(m, 'harita bölgesi')));
      G.hakimiyetSatirlari(d).forEach((m) => metinDenetle(m, 'hâkimiyet'));
      // Aşama 10: ziyaretçi oyuncunun yanına konur, konuşulur; gizem ve başarı satırları
      const kimler = Object.keys(H.KISILER);
      d.k.hikaye.ziyaretci = { kim: kimler[i % 3], x: d.oyuncu.x + 2, y: d.oyuncu.y, yer: 'Gölet', bitis: d.k.dk + 60, konusuldu: false };
      metinDenetle(H.ziyaretciTarifi(d), 'ziyaretçi');
      metinDenetle(H.konus(d), 'konuşma');
      metinDenetle(H.konus(d), 'konuşma 2');
      H.GIZEM_SIRASI.forEach((id) => H.gizemBaslat(d, id));
      H.gizemSatirlari(d.k).forEach((x) => metinDenetle(x.metin, 'gizem'));
      // Aşama 11: her su noktasına ışınlanıp ölç, gözle, geçiş say
      const eskiKonum = { x: d.oyuncu.x, y: d.oyuncu.y };
      for (const n of S.SU_NOKTALARI) {
        const p = S.noktaKonumu(n);
        d.oyuncu.x = p.x;
        d.oyuncu.y = p.y + (n.tip === 'nehir' || n.tip === 'gecit' ? 6 : 0);
        metinDenetle(S.suOlc(d), 'su ölçüm');
        metinDenetle(S.suyuGozle(d), 'su gözlem');
        metinDenetle(S.gecisSay(d), 'geçiş');
      }
      Object.assign(d.oyuncu, eskiKonum);
      S.noktaSatirlari(d).forEach((x) => metinDenetle(x.metin, 'su noktası'));
      metinDenetle(S.suRaporu(d.k), 'su raporu');
      // Aşama 12: saha gezisi ve ekolojik yönetim
      const eskiK = { x: d.oyuncu.x, y: d.oyuncu.y, b: d.k.butce, i: d.k.itibar };
      d.k.magara = null;
      d.oyuncu.x = 2;
      d.oyuncu.y = 2;
      d.k.butce = 50000;
      d.k.itibar = 500;
      K.uzakSatirlari(d.k).forEach((x) => metinDenetle(x.metin, 'gezi satırı'));
      const alan = ['tuzla', 'dag', 'bataklik'][i % 3];
      const hz = K.uzakHazirla(d, alan);
      if (hz) metinDenetle(hz, 'gezi hazırlık');
      else {
        metinDenetle(K.uzagaVar(d, alan), 'gezi varış');
        for (let j = 0; j < 6; j++) {
          metinDenetle(K.magaraIlerle(d), 'gezi ilerle');
          d.sonArama = -9;
          metinDenetle(K.kucukAra(d), 'gezi ara');
          M.fotografCek(d);
          metinDenetle(B.betimle(d, 'Dürbün'), 'gezi betimle');
          metinDenetle(K.odaTarifi(d.k), 'gezi tarif');
        }
        for (let j = 0; j < 6; j++) metinDenetle(K.magaraGeri(d), 'gezi geri');
        metinDenetle(K.uzaktanDon(d), 'gezi dönüş');
      }
      Object.keys(Y.EYLEMLER).forEach((id) => metinDenetle(Y.eylemYap(d, id), 'yönetim'));
      const lh = Y.istilaciSatirlari(d)[0];
      if (lh) {
        d.oyuncu.x = lh.p.x;
        d.oyuncu.y = lh.p.y;
        metinDenetle(Y.eylemYap(d, 'istilaci'), 'lantana');
      }
      Y.nufusSatirlari(d).forEach((m) => metinDenetle(m, 'nüfus'));
      d.k.hayvanlar.slice(0, 20).forEach((b) => Sy.bireySatirlari(d, b).forEach((m) => metinDenetle(m, 'sosyal birey')));
      d.k.hayvanlar.slice(0, 30).forEach((b) => Sy.saglikDosyasi(d, b).forEach((m) => metinDenetle(m, 'sağlık')));
      Y.gocSatirlari(d).forEach((m) => metinDenetle(m, 'göç'));
      d.k.gruplar.forEach((g) => metinDenetle(M.rutinMetni(d, g), 'rutin'));
      // Aşama 20: koloniler, tohumlar, bitki satırları
      {
        const ek = { x: d.oyuncu.x, y: d.oyuncu.y };
        Bo.KOLONI_SIRASI.forEach((id) => {
          d.oyuncu.x = Bo.KOLONILER[id].x + 3;
          d.oyuncu.y = Bo.KOLONILER[id].y;
          metinDenetle(Bo.koloniIncele(d, id), 'koloni');
          metinDenetle(Bo.koloniSatiri(d, id), 'koloni satırı');
        });
        const b = Bo.botanikAlani(d.k);
        b.tohumlar.slice(0, 4).forEach((t) => {
          d.oyuncu.x = t.x;
          d.oyuncu.y = t.y;
          metinDenetle(Bo.tohumIncele(d, t), 'tohum');
          metinDenetle(Bo.tohumAdi(t), 'tohum adı');
        });
        Bo.yayilimSatirlari(d.k).forEach((m) => metinDenetle(m, 'yayılım'));
        BITKI_SIRASI.forEach((id) => Bo.bitkiSatirlari(d.k, id).forEach((m) => metinDenetle(m, 'bitki botanik')));
        Object.assign(d.oyuncu, ek);
      }
      // Aşama 21: üreme ve yayınlar
      d.k.hayvanlar.slice(0, 40).forEach((b) => {
        Ur.bireySatirlari(d, b).forEach((m) => metinDenetle(m, 'üreme'));
        metinDenetle(M.gozlemTarifi(d, b), 'gözlem tarifi');
      });
      Ya.yazilabilirler(d.k).slice(0, 2).forEach((a) => metinDenetle(Ya.gonder(d, a.id, 'yerel'), 'makale'));
      Ya.yayinAlani(d.k).makaleler.forEach((m) => {
        metinDenetle(Ya.makaleSatiri(m), 'makale satırı');
        metinDenetle(Ya.duzeltmeGonder(d, m.konu), 'düzeltme');
      });
      Ya.ISBIRLIGI_SIRASI.forEach((id) => metinDenetle(Ya.isbirligiYap(d, id), 'iş birliği'));
      metinDenetle(Ya.ozet(d.k), 'yayın özeti');
      // Aşama 22: iklim, fırtına, fırsatlar
      Ik.iklimSatirlari(d.k).forEach((m) => metinDenetle(m, 'iklim'));
      metinDenetle(Ik.sabitle(d), 'sabitle');
      d.k.tuzaklar.forEach((t) => (t.devrik = true));
      Ik.devrikTuzaklar(d.k).forEach((t) => metinDenetle(Ik.tuzakDuzelt(d, t), 'tuzak düzelt'));
      metinDenetle(Ik.kampOnar(d), 'kamp onar');
      d.k.teklifler.forEach((t) => metinDenetle(Mz.teklifMetni(d.k, t), 'teklif'));
      // Aşama 23
      metinDenetle(Gc.gozTara(d), 'göz');
      d.k.dk += 840; metinDenetle(Gc.gozTara(d), 'göz gece'); d.k.dk -= 840;
      Hd.HEDEFLER.forEach((h) => { metinDenetle(Hd.hedefSatiri(d.k, h), 'hedef'); Hd.hedefDetay(d.k, h).forEach((m) => metinDenetle(m, 'hedef detay')); });
      Y.gocSatirlari(d).forEach((m) => metinDenetle(m, 'göç 2'));
      d.k.hayvanlar.slice(0, 40).forEach((b) => Bg.bireySatirlari(d, b).forEach((m) => metinDenetle(m, 'bağ')));
      // Aşama 25: toprak ve kıl numuneleri, analizleri hemen bitir
      metinDenetle(Mz.toprakNumunesi(d), 'toprak');
      metinDenetle(Mz.kilNumunesi(d), 'kıl');
      d.k.numuneKutusu.forEach((n) => (n.durum = 'kutuda'));
      S.kameraSatirlari(d.k).forEach((m) => metinDenetle(m, 'kamera'));
      d.k.hayvanlar.filter((b) => b.ozellik).forEach((b) => metinDenetle(M.gozlemTarifi(d, b), 'özel birey'));
      ['aslan', 'cita', 'manda', 'babun'].forEach((t) => Sy.turSatirlari(d, t).forEach((m) => metinDenetle(m, 'sosyal tür')));
      Y.raporSatirlari(d.k).forEach((m) => metinDenetle(m, 'rapor'));
      Object.assign(d.oyuncu, { x: eskiK.x, y: eskiK.y });
      d.k.butce = eskiK.b;
      d.k.itibar = eskiK.i;
      const bs = H.basariSatirlari(d.k);
      [...bs.kazanilan, ...bs.kalan].forEach((x) => metinDenetle(x.metin, 'başarı'));
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
