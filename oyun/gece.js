// Aşama 23: gece araştırması (karar 88). Fenerle göz parıltısı taraması: geceleri hayvanların çoğunun gözünün arkasındaki yansıtıcı
// katman (tapetum lucidum) fener ışığını geri yansıtır. Rengi, yerden yüksekliği ve göz çiftlerinin sayısı türü tahmin ettirir.
// Primatlarda (babun) bu katman yoktur. Saf mantık. Sayılar ÖNERİDİR.
import * as M from './mantik.js';
import { TURLER } from './veri.js';

export const GOZ = {
  aslan: { renk: 'sarımsı yeşil', boy: 'diz hizasının biraz üstünde', ipucu: 'iri bir kedi' },
  leopar: { renk: 'parlak yeşil', boy: 'yerden alçak, bazen bir ağaç dalında yüksekte', ipucu: 'tek başına dolaşan bir kedi' },
  cita: { renk: 'sarı', boy: 'diz hizasında', ipucu: 'ince yapılı bir kedi' },
  sirtlan: { renk: 'sarımsı yeşil', boy: 'alçak, başı öne eğik', ipucu: 'leşçil bir yırtıcı' },
  yabanKopegi: { renk: 'sarımsı yeşil', boy: 'alçak, birbirine yakın birçok çift', ipucu: 'sürü hâlindeki köpekgiller' },
  fil: { renk: 'soluk, zor seçilen', boy: 'çok yüksek, insan boyunun üstünde', ipucu: 'dev bir otçul' },
  zurafa: { renk: 'beyazımsı yeşil', boy: 'çok yüksekte, ağaç tepeleri hizasında', ipucu: 'uzun boyunlu bir otçul' },
  zebra: { renk: 'beyazımsı yeşil', boy: 'omuz hizasında', ipucu: 'atgiller' },
  gnu: { renk: 'beyazımsı yeşil', boy: 'omuz hizasında, birçok çift', ipucu: 'büyük bir antilop sürüsü' },
  impala: { renk: 'yeşil', boy: 'bel hizasında, birçok çift', ipucu: 'orta boy antilop' },
  ceylan: { renk: 'yeşil', boy: 'diz hizasında', ipucu: 'küçük bir antilop' },
  manda: { renk: 'turuncumsu', boy: 'omuz hizasında, iri başlarda', ipucu: 'iri, sürü hâlinde otçul' },
  domuz: { renk: 'zayıf, kırmızımsı', boy: 'yere çok yakın', ipucu: 'kısa bacaklı bir otçul' },
  gergedan: { renk: 'zayıf, kırmızımsı', boy: 'bel hizasında, iri bir gövdenin önünde', ipucu: 'çok iri bir otçul' },
  suAygiri: { renk: 'kırmızımsı', boy: 'su yüzeyinde ya da kıyıda alçakta', ipucu: 'suda yaşayan iri bir memeli' },
  timsah: { renk: 'parlak kırmızı', boy: 'tam su yüzeyinde', ipucu: 'bir sürüngen' },
  babun: { renk: null, boy: 'ağaçlarda', ipucu: 'primat' },
};
const MENZIL = 45;

export function gozTara(d) {
  const k = d.k;
  if (k.magara) return 'Mağaradasın; burada fenerle zaten etrafı görüyorsun.';
  const evre = M.gunEvresi(k.dk);
  if (evre !== 'gece' && evre !== 'aksam') return 'Göz parıltısı ancak karanlıkta görünür. Akşam karanlığını ya da geceyi bekle.';
  if (!k.gece || typeof k.gece !== 'object') k.gece = {};
  if (!k.gece.goz || typeof k.gece.goz !== 'object') k.gece.goz = {};
  const o = d.oyuncu;
  const gruplar = new Map();
  for (const b of k.hayvanlar) {
    if (b.olu || !GOZ[b.tur] || TURLER[b.tur].kus) continue;
    const m = M.mesafe(o, b);
    if (m > MENZIL) continue;
    const l = gruplar.get(b.grup) || [];
    l.push({ b, m });
    gruplar.set(b.grup, l);
  }
  M.efekt(d, 'fener_tik', 0.6);
  const l = [...gruplar.values()].sort((a, b) => Math.min(...a.map((x) => x.m)) - Math.min(...b.map((x) => x.m))).slice(0, 5);
  if (!l.length) return `Fenerini yavaşça çevrende gezdirdin; ${MENZIL} metre içinde parlayan göz yok. Biraz yürüyüp yeniden dene.`;
  const parcalar = [];
  let yeni = 0;
  for (const grup of l) {
    const yakin = grup.sort((a, b) => a.m - b.m)[0].b;
    const g = GOZ[yakin.tur];
    const cift = grup.length;
    const yer = M.yerTarifi(o, yakin);
    const tanidik = !!k.arsiv.turler[yakin.tur];
    if (!g.renk) {
      parcalar.push(`${yer}: ağaçlarda kıpırdanan karaltılar var ama göz parlaması yok; gözünde yansıtıcı katman olmayan bir ${g.ipucu}${tanidik ? `, büyük olasılıkla ${M.kucukHarf(M.SOZ[yakin.tur])}` : ''}`);
      continue;
    }
    let tahmin = tanidik ? `büyük olasılıkla ${M.kucukHarf(M.SOZ[yakin.tur])}` : `tanımadığın ${g.ipucu}`;
    if (tanidik && !k.gece.goz[yakin.tur]) {
      k.gece.goz[yakin.tur] = k.dk;
      yeni++;
    }
    parcalar.push(`${yer}: ${cift > 1 ? `${cift} çift` : 'bir çift'} ${g.renk} göz, ${g.boy}; ${tahmin}`);
  }
  let son = '';
  if (yeni) {
    M.itibarEkle(d, yeni);
    const n = Object.keys(k.gece.goz).length;
    son = ` Göz parıltısı kataloğuna ${yeni} tür eklendi; toplam ${n} tür.`;
    if (n >= 10 && !k.gece.katalog) {
      k.gece.katalog = true;
      M.itibarEkle(d, 5);
      M.arsivOlay(d, 'Gece göz parıltısı kataloğu: 10 tür.');
      son += ' On türün göz parıltısını tanıyorsun; gece sayımlarında bunu kullanabilirsin.';
    }
  }
  return `Fenerle taradın. ${parcalar.map(M.BuyukHarf).join('. ')}.${son} Fenerini hayvanların gözüne uzun tutma; ışık onları rahatsız eder.`;
}
export const gozKatalogu = (k) => Object.keys((k.gece && k.gece.goz) || {}).filter((t) => GOZ[t]);
