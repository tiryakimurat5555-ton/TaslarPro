// ==== VAHŞİ YAŞAM: SESLİ BETİMLEME (brif Aşama 7, karar 31, 85) ====
// Görme engelli oyuncu için sahnenin sözlü anlatımı: ışık ve hava, zemin ve bitki örtüsü, önündeki engel,
// yakındaki yer işaretleri, duyulan sesler ve görülen hayvanlar. Bütün bilgiler oyunun gerçek durumundan hesaplanır.
import { GOLET, nehirY, ISTASYON, MAGARA, TERMITLER, KAYALIK, TURLER, YERLER } from './veri.js';
import * as M from './mantik.js';
import * as E from './ekosistem.js';
import { MAGARA_ODALARI, UZAK_ALANLAR, aktifOda } from './kucukler.js';

const yt = (o, h) => `${M.saatSozu(M.saatYonu(o, h))}, ${M.metreSozu(M.mesafe(o, h))}`;
const kucuk = (s) => s.toLocaleLowerCase('tr-TR');

function isikSozu(k) {
  const e = M.gunEvresi(k.dk);
  const saat = M.gunDakikasi(k.dk) / 60;
  const bulut = k.eko && k.eko.hava && ['bulutlu', 'yagmurlu', 'saganak'].includes(k.eko.hava.tur);
  if (e === 'gece') return saat > 23 || saat < 4 ? 'Gecenin ortası, her yer zifiri karanlık.' : 'Gece; yıldızların altında savan karanlık.';
  if (e === 'safak') return 'Şafak; doğu ufku kızıla dönüyor, hava serin.';
  if (e === 'aksam') return 'Akşam; güneş batıda alçaldı, gölgeler uzadı.';
  if (bulut) return 'Gündüz, ama gökyüzü bulutlarla kaplı; ışık yumuşak.';
  return saat < 10 ? 'Sabah; güneş henüz alçaktan vuruyor.' : saat < 15 ? 'Öğle; güneş tepede, ışık sert.' : 'İkindi; güneş batıya kayıyor.';
}
function havaSozu(k) {
  const e = k.eko;
  if (!e || !e.hava) return '';
  const h = e.hava;
  const r = h.ruzgarHiz > 1.7 ? 'sert' : h.ruzgarHiz > 1.2 ? 'orta' : 'hafif';
  const yag = e.yagmurVar ? (e.siddet > 0.8 ? 'Sağanak yağıyor, gök gürlüyor. ' : 'Yağmur yağıyor. ') : '';
  const sicak = h.sicaklik >= 34 ? ' Hava çok sıcak.' : h.sicaklik <= 25 ? ' Hava ılık.' : '';
  return `${yag}${M.pusulaYonu(h.ruzgarYon).replace(/^./, (c) => c.toLocaleUpperCase('tr-TR'))} yönünden ${r} bir rüzgâr esiyor.${sicak}`;
}
function zeminSozu(d) {
  const k = d.k;
  const o = d.oyuncu;
  const e = k.eko;
  const b = M.bolgeBul(o.x, o.y);
  const yesil = e ? e.yesil : 0.7;
  const ot = e ? E.otDegeri(e, o.x, o.y) : 0.6;
  const otTarif = yesil > 0.65 ? (ot > 0.55 ? 'diz boyu yemyeşil otlar' : 'kısa, yeşil otlar') : yesil > 0.35 ? 'sararmaya başlamış otlar' : ot > 0.3 ? 'kuru, sarı otlar' : 'neredeyse çıplak, tozlu bir toprak';
  const yanik = e && e.yanik && e.yanik[E.hucre(o.x, o.y)] ? (ot > 0.25 ? ' Yanmış toprağın arasından taze sürgünler çıkıyor.' : ' Burası yakın zamanda yandı; yer kapkara, kül kokuyor.') : '';
  switch (b) {
    case 'istasyon':
      return 'Araştırma istasyonundasın: laboratuvar, garaj ve çadırın arasında.';
    case 'golet':
      return `Gölet kıyısındasın. Gölet ${E.goletSozu(e)}; kıyıda çamur ve hayvan izleri var.`;
    case 'nehir':
      return `Nehir kıyısındasın. Nehir ${E.nehirSozu(e ? e.nehir : 0.5)}${e && e.taskin ? '; sular taşmış' : ''}. Kıyıda ${otTarif}.`;
    case 'sulak':
      return `Nehrin güneyindeki sulak alandasın: sazlıklar, çamur gölcükleri ve ${otTarif}.`;
    case 'kayalik':
      return 'Büyük granit kayaların arasındasın; kayaların üstü güneşte ısınmış.';
    case 'agaclik':
      return `Şemsiye akasyaların arasındasın; dalların gölgesi yere desen çiziyor, yerde ${otTarif}.${yanik}`;
    case 'galeri':
      return 'Galeri ormanındasın: sık ağaçların altında hava nemli ve gölgeli, yaprak hışırtıları her yanda.';
    case 'termit':
      return `Termit tepelerinin arasındasın; insan boyunu aşan kızıl toprak kuleler yükseliyor. Yerde ${otTarif}.`;
    default:
      return `Açık otlaktasın; çevrende ${otTarif} uzanıyor.${yanik}`;
  }
}
// Önündeki engel: bakış yönünde 12 metreye kadar
function onSozu(d) {
  const o = d.oyuncu;
  for (let m = 2; m <= 12; m += 1) {
    const x = o.x + Math.sin(o.yon) * m;
    const y = o.y + Math.cos(o.yon) * m;
    const e = d.engeller.find((e2) => Math.hypot(e2.x - x, e2.y - y) < e2.r + 0.4);
    if (e) {
      const ad = { agac: e.agacTur === 'kiyi' ? 'bir kıyı ağacı' : 'bir akasya', kaya: e.magara ? 'mağaranın kayası' : 'bir kaya', bina: e.ad ? `istasyonun ${kucuk(e.ad)} binası` : 'bir bina', termit: 'bir termit tepesi' }[e.tur] || 'bir engel';
      return `Tam önünde, ${M.metreSozu(m)} ileride ${ad} var.`;
    }
    if (Math.abs(y - nehirY(x)) < 4.2 && !M.gecitteMi(x)) return `Önünde, ${M.metreSozu(m)} ileride nehir var.`;
    if (GOLET.su > 0 && Math.hypot(x - GOLET.x, y - GOLET.y) < GOLET.su) return `Önünde, ${M.metreSozu(m)} ileride gölet var.`;
  }
  return 'Önün açık.';
}
// Yakındaki yer işaretleri (80 metre)
function isaretSozu(d) {
  const k = d.k;
  const o = d.oyuncu;
  const l = [];
  const ekle = (ad, h, sinir = 80) => {
    const m = M.mesafe(o, h);
    if (m < sinir && m > 6) l.push({ ad, h, m });
  };
  if (GOLET.su > 0) ekle('gölet', { x: GOLET.x, y: GOLET.y });
  const nx = o.x;
  ekle('nehir', { x: nx, y: nehirY(nx) }, 60);
  ekle('istasyon', ISTASYON, 90);
  if (!k.aracta) ekle(M.aracAdi(k).toLocaleLowerCase('tr-TR').replace(/^atv$/, 'ATV'), k.arac, 60);
  ekle('mağaranın ağzı', MAGARA);
  ekle('kayalık', KAYALIK, 70);
  ekle('termit tepeleri', TERMITLER, 70);
  const z = k.hikaye && k.hikaye.ziyaretci; // Aşama 10: nadir ziyaretçi
  if (z && k.dk < z.bitis) {
    const zm = M.mesafe(o, z);
    if (zm < 90) l.push({ ad: z.kim === 'korucu' ? 'bir korucu' : z.kim === 'coban' ? 'bir çoban' : 'bir araştırmacı', h: z, m: Math.max(zm, 0.1) });
  }
  const y = M.yanginYakin(d);
  if (y && y.m < 120) l.push({ ad: 'yangın', h: y, m: y.m });
  l.sort((a, b) => a.m - b.m);
  if (!l.length) return '';
  return 'Yakınında: ' + l.slice(0, 3).map((x) => `${x.ad} ${yt(o, x.h)}`).join('; ') + '.';
}
// Duyulan sesler: türlere göre en yakın hayvan, artı ortam sesleri
function sesSozu(d) {
  const k = d.k;
  const o = d.oyuncu;
  const turler = new Map();
  k.hayvanlar.forEach((b) => {
    if (b.olu || TURLER[b.tur].sesSik > 200) return;
    const m = M.mesafe(o, b);
    if (m > 80) return;
    const v = turler.get(b.tur);
    if (!v || m < v.m) turler.set(b.tur, { b, m });
  });
  const parca = [...turler.values()]
    .sort((a, b) => a.m - b.m)
    .slice(0, 3)
    .map((x) => `${kucuk(M.SOZ[x.b.tur])} ${M.saatSozu(M.saatYonu(o, x.b))}`);
  const ortam = [];
  const e = M.gunEvresi(k.dk);
  if (e === 'gece' || e === 'aksam') ortam.push('cırcır böcekleri');
  else ortam.push('kuş cıvıltıları');
  if (Math.abs(o.y - nehirY(o.x)) < 30) ortam.push('nehrin akışı');
  if (k.eko && k.eko.yagmurVar) ortam.push('yağmurun sesi');
  const y = M.yanginYakin(d);
  if (y && y.m < 70) ortam.push('alevlerin çıtırtısı');
  return `Duyduğun sesler: ${[...parca, ...ortam].join(', ')}.`;
}
function hayvanSozu(d) {
  const k = d.k;
  const menzil = M.durbunMenzili(k.dk, k);
  const l = M.gorunurler(d, menzil);
  if (!l.length) return `Dürbünle görebileceğin ${menzil} metre içinde hayvan yok.`;
  const turSayisi = new Set(l.map((x) => x.b.tur)).size;
  return `Dürbünle görebileceğin uzaklıkta ${turSayisi} tür, ${l.length} hayvan var; en yakını ${M.bireyAdi(l[0].b)}, ${yt(d.oyuncu, l[0].b)}.`;
}

// Tam betimleme (uzun bas, menüdeki Çevreyi betimle)
export function betimle(d, aletAdi) {
  const k = d.k;
  d.betimlemeSayisi = (d.betimlemeSayisi || 0) + 1;
  if (k.magara && k.magara.alan) {
    const n = aktifOda(k);
    return `${UZAK_ALANLAR[k.magara.alan].ad}, ${n.ad}. ${M.saatMetni(k.dk)}. ${n.tarif}${aletAdi ? ` Elindeki alet: ${aletAdi}.` : ''}`;
  }
  if (k.magara) {
    const oda = MAGARA_ODALARI[k.magara.oda];
    return `${oda.ad}. ${oda.tarif} Kafa lambanın ışığı birkaç metreyi aydınlatıyor; ötesi karanlık. Duyduğun sesler: damlaların suya düşüşü${oda.id === 'yarasa' ? ', tepende binlerce yarasanın kıpırtısı' : ''}.${aletAdi ? ` Elindeki alet: ${aletAdi}.` : ''}`;
  }
  const p = [`${M.saatMetni(k.dk)}. ${isikSozu(k)}`, havaSozu(k), zeminSozu(d), onSozu(d), isaretSozu(d), sesSozu(d), hayvanSozu(d)];
  const g = M.gozlenen(d);
  if (g) p.push(`Gözlediğin: ${M.gozlemTarifi(d, g)}.${M.ruzgarUyarisi(d, g)}`);
  if (k.aracta) p.push('Araçtasın.');
  if (aletAdi) p.push(`Elindeki alet: ${aletAdi}.`);
  return p.filter(Boolean).join(' ');
}
// Kısa betimleme: yeni bir bölgeye girince (ayar: Otomatik betimleme)
export function kisaBetimle(d) {
  if (d.k.magara) return '';
  return `${zeminSozu(d)} ${isaretSozu(d)}`.trim();
}
export { onSozu };
