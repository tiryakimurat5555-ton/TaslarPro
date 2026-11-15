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
  kutupAyisi: { renk: 'soluk yeşil', boy: 'bel hizasında, iri bir gövdenin önünde', ipucu: 'çok iri bir yırtıcı' },
  halkaliFok: { renk: 'kırmızımsı', boy: 'buzun hemen üstünde', ipucu: 'buzda yatan bir deniz memelisi' },
  mors: { renk: 'kırmızımsı', boy: 'yere çok yakın, birbirine sokulmuş birçok çift', ipucu: 'iri, sürü hâlinde deniz memelisi' },
  beluga: { renk: null, boy: 'suda', ipucu: 'balina', karalti: 'suyun yüzünde kayan beyaz sırtlar ve nefes sesleri' },
  renGeyigi: { renk: 'mavimsi yeşil', boy: 'omuz hizasında, birçok çift', ipucu: 'boynuzlu, sürü hâlinde otçul' },
  miskOkuzu: { renk: 'turuncumsu', boy: 'omuz hizasında, kalabalık bir öbek', ipucu: 'iri, sürü hâlinde otçul' },
  kutupKurdu: { renk: 'sarımsı yeşil', boy: 'diz hizasında, birkaç çift', ipucu: 'sürü hâlindeki köpekgiller' },
  kutupTilkisi: { renk: 'sarımsı yeşil', boy: 'yere yakın, tek ya da iki çift', ipucu: 'küçük bir köpekgil' },
  kutupTavsani: { renk: 'kırmızımsı', boy: 'yere çok yakın', ipucu: 'küçük bir otçul' },
  imparatorPengueni: { renk: null, boy: 'bel hizasında, sıkı bir kalabalık', ipucu: 'kuş; gözleri ışığı yansıtmaz', karalti: 'buzun üstünde dik duran, kıpırdayan karaltılar' },
  adeliPengueni: { renk: null, boy: 'diz hizasında, kalabalık', ipucu: 'kuş; gözleri ışığı yansıtmaz', karalti: 'kayaların arasında dik duran, kıpırdayan küçük karaltılar' },
  weddellFoku: { renk: 'kırmızımsı', boy: 'buzun hemen üstünde', ipucu: 'buzda yatan bir fok' },
  yengecYiyenFok: { renk: 'kırmızımsı', boy: 'buz parçalarının üstünde, birkaç çift', ipucu: 'buzda yatan foklar' },
  rossFoku: { renk: 'parlak kırmızımsı', boy: 'buzun hemen üstünde, tek bir iri çift', ipucu: 'iri gözlü bir fok' },
  kurkluFok: { renk: 'yeşilimsi', boy: 'kayaların üstünde, birkaç çift', ipucu: 'kıyıda foklar' },
  minkeBalina: { renk: null, boy: 'denizde', ipucu: 'balina', karalti: 'suyun yüzünde kayan karanlık bir sırt ve bir nefes sesi' },
  kamburBalina: { renk: null, boy: 'denizde', ipucu: 'balina', karalti: 'suyun yüzünde kayan karanlık bir sırt ve bir nefes sesi' },
  maviBalina: { renk: null, boy: 'denizde', ipucu: 'balina', karalti: 'suyun yüzünde kayan karanlık bir sırt ve bir nefes sesi' },
  leoparFoku: { renk: 'kırmızımsı', boy: 'buz kenarında, tek bir çift', ipucu: 'iri, tek başına bir fok' },
  orka: { renk: null, boy: 'suda', ipucu: 'balina', karalti: 'suyun yüzünde kayan karanlık sırtlar ve nefes sesleri' },
  filFoku: { renk: 'kırmızımsı', boy: 'yere çok yakın, iri gövdeler', ipucu: 'dev, sürü hâlinde fok' },
  kirmiziKanguru: { renk: 'kırmızımsı turuncu', boy: 'insan boyunda, birçok çift', ipucu: 'zıplayan, sürü hâlinde otçul' },
  koala: { renk: 'kırmızı', boy: 'ağacın dallarında, yerden yüksekte', ipucu: 'ağaçta yaşayan bir keseli' },
  emu: { renk: null, boy: 'insan boyunda', ipucu: 'iri, uçamayan bir kuş', karalti: 'insan boyunda, ağır ağır yürüyen karaltılar' },
  vombat: { renk: 'kırmızımsı', boy: 'yere çok yakın', ipucu: 'tıknaz, kazıcı bir keseli' },
  dingo: { renk: 'sarımsı yeşil', boy: 'diz hizasında, birkaç çift', ipucu: 'sürü hâlindeki köpekgiller' },
  kizilGeyik: { renk: 'parlak yeşil', boy: 'insan boyunda, birkaç çift', ipucu: 'iri bir geyik' },
  karaca: { renk: 'yeşilimsi', boy: 'bel hizasında, bir iki çift', ipucu: 'küçük bir geyik' },
  yabanDomuzu: { renk: 'soluk kırmızı', boy: 'diz hizasında, birkaç çift', ipucu: 'yaban domuzu' },
  vasak: { renk: 'parlak sarı-yeşil', boy: 'diz hizasında, tek bir çift', ipucu: 'orta boy bir kedi' },
  kizilTilki: { renk: 'parlak sarı', boy: 'diz altında, tek bir çift', ipucu: 'tilki' },
  porsuk: { renk: 'kırmızımsı', boy: 'yere çok yakın', ipucu: 'tıknaz, kazıcı bir hayvan' },
  dagKecisi: { renk: 'turuncu-sarı', boy: 'kayalıkta, bel hizasında', ipucu: 'yaban keçisi' },
  kulan: { renk: 'yeşilimsi', boy: 'insan boyunda, birkaç çift', ipucu: 'yaban eşeği' },
  takhi: { renk: 'yeşilimsi', boy: 'insan boyunda, birkaç çift', ipucu: 'at' },
  karLeopari: { renk: 'parlak yeşil-sarı', boy: 'kayaların üstünde, tek bir çift', ipucu: 'iri bir kedi' },
  saiga: { renk: 'turuncu', boy: 'diz hizasında, kalabalık', ipucu: 'sürü hâlinde antilop' },
  mogolKurdu: { renk: 'sarımsı yeşil', boy: 'diz-bel hizasında, birkaç çift', ipucu: 'sürü hâlindeki köpekgiller' },
  dzeren: { renk: 'parlak beyaz-yeşil', boy: 'diz hizasında, kalabalık bir sürü', ipucu: 'sürü hâlinde ceylan' },
  argali: { renk: 'turuncu-sarı', boy: 'kayalıkta, bel hizasında', ipucu: 'iri yaban koyunu' },
  kaplan: { renk: 'parlak yeşil', boy: 'diz-bel hizasında, tek bir iri çift', ipucu: 'çok iri bir kedi' },
  bozKanguru: { renk: 'soluk turuncu', boy: 'bel hizasında, birçok çift', ipucu: 'bir kanguru grubu' },
  euro: { renk: 'soluk turuncu', boy: 'diz-bel hizasında, kayalıkta bir iki çift', ipucu: 'kayalıkta bir kanguru' },
  kayaValabisi: { renk: 'turuncu', boy: 'diz hizasında, kayaların arasında birkaç çift', ipucu: 'küçük kangurular' },
  bilbi: { renk: 'kırmızımsı', boy: 'yere çok yakın, tek bir çift', ipucu: 'küçük bir keseli' },
  kuol: { renk: 'yeşilimsi', boy: 'yere yakın, tek bir çift', ipucu: 'küçük bir yırtıcı' },
  perentie: { renk: null, boy: 'yerde', ipucu: 'iri sürüngen', yerde: true },
  avTilkisi: { renk: 'parlak sarı-yeşil', boy: 'diz altında, tek bir çift', ipucu: 'bir tilki' },
  yabaniDeve: { renk: 'parlak yeşil', boy: 'çok yüksekte, birkaç çift', ipucu: 'çok uzun boylu hayvanlar' },
  avrupaTavsani: { renk: 'kırmızımsı', boy: 'yere çok yakın, birçok çift', ipucu: 'tavşanlar' },
  hintLeopari: { renk: 'parlak sarı-yeşil', boy: 'diz hizasında ya da bir ağaç dalında, tek bir çift', ipucu: 'iri bir kedi' },
  tembelAyi: { renk: 'soluk turuncu', boy: 'diz hizasında, alçakta bir çift', ipucu: 'iri, yere yakın bir hayvan' },
  hintYabanKopegi: { renk: 'parlak yeşil', boy: 'diz hizasında, birçok çift', ipucu: 'bir köpek sürüsü' },
  cizgiliSirtlan: { renk: 'parlak yeşil', boy: 'diz hizasında, tek bir çift', ipucu: 'bir sırtlan' },
  altinCakal: { renk: 'sarı-yeşil', boy: 'diz altında, iki üç çift', ipucu: 'küçük köpek ailesi' },
  barasingha: { renk: 'parlak yeşil', boy: 'bel hizasında, birçok çift', ipucu: 'bir geyik sürüsü' },
  nilgay: { renk: 'soluk yeşil', boy: 'göğüs hizasında, birkaç çift', ipucu: 'iri bir antilop' },
  muntjak: { renk: 'yeşil', boy: 'diz hizasında, tek bir çift', ipucu: 'küçük bir geyik' },
  hintYabanDomuzu: { renk: 'soluk kırmızı', boy: 'diz altında, birçok çift', ipucu: 'bir domuz sürüsü' },
  dortBoynuzlu: { renk: 'yeşil', boy: 'diz hizasında, bir çift', ipucu: 'küçük bir antilop' },
  rhesus: { renk: 'parlak turuncu', boy: 'ağaçlarda, birçok çift', ipucu: 'bir maymun grubu' },
  hintFili: { renk: 'soluk kırmızı', boy: 'çok yüksekte, birkaç çift', ipucu: 'dev bir otçul' },
  cital: { renk: 'parlak beyaz-yeşil', boy: 'omuz hizasında, kalabalık bir sürü', ipucu: 'sürü hâlinde geyik' },
  sambar: { renk: 'turuncu', boy: 'insan boyunda, birkaç çift', ipucu: 'iri bir geyik' },
  gaur: { renk: 'mavimsi', boy: 'insan boyunda, kalabalık', ipucu: 'iri, sürü hâlinde sığır' },
  langur: { renk: null, boy: 'ağaçların dallarında', ipucu: 'maymun; gözleri pek parlamaz' },
};
const MENZIL = 45;

export function gozTara(d) {
  const k = d.k;
  if (k.magara) return 'Mağaradasın; burada fenerle zaten etrafı görüyorsun.';
  const evre = M.evreSimdi(k);
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
      parcalar.push(`${yer}: ${g.karalti || (g.yerde ? 'yerde sürünen bir karaltı' : 'ağaçlarda kıpırdanan karaltılar')} var ama göz parlaması yok; gözünde yansıtıcı katman olmayan bir ${g.ipucu}${tanidik ? `, büyük olasılıkla ${M.kucukHarf(M.SOZ[yakin.tur])}` : ''}`);
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
