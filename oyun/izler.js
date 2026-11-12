// ==== VAHŞİ YAŞAM: AŞAMA 9 — İZLER, YUVALAR, VİDEO, KEŞİF ANLARI (saf mantık) ====
// Karar 93: hareketler, izler ve kayıtlar birleştirilerek bilinmeyen yaşam alanları bulunur.
// Karar 105/110: inler, yuvalar, uyku yerleri. Karar 86: basit video kaydı. Karar 85: keşif anlarının sunumu.
// M ve veri'yi kullanır; mantik bunu içe aktarmaz. Sayılar ÖNERİ.
import { TURLER, DAVRANISLAR } from './veri.js';
import * as M from './mantik.js';

const kucuk = (s) => s.toLocaleLowerCase('tr-TR');
const IZ_ARALIK = 8; // oyun dakikası
const IZ_OMRU = 240; // izler 4 oyun saati okunabilir (yağmur siler)

// İz türleri
const IZ_TARIF = {
  pati: 'yumuşak pati izleri, tırnak izi yok',
  pati_tirnak: 'pati izleri, önlerinde tırnak çizikleri',
  toynak: 'yarık toynak izleri',
  toynak_tek: 'tek parçalı, yuvarlak toynak izleri',
  agir: 'iri, yuvarlak, derin ayak izleri',
  surunme: 'kumda sürünme izi, iki yanında pençe izleri ve ortada kuyruk izi',
  yilan: 'yerde S biçiminde kıvrımlı bir sürünme izi',
  el: 'insan eline benzeyen el ve ayak izleri',
};
const TUR_IZ = {
  aslan: 'pati', leopar: 'pati', cita: 'pati_tirnak', sirtlan: 'pati_tirnak', yabanKopegi: 'pati_tirnak',
  fil: 'agir', gergedan: 'agir', suAygiri: 'agir', zebra: 'toynak_tek', zurafa: 'toynak', ceylan: 'toynak', impala: 'toynak',
  gnu: 'toynak', manda: 'toynak', domuz: 'toynak', timsah: 'surunme', piton: 'yilan', babun: 'el',
};
const sureSozu = (dk) => (dk < 20 ? 'çok taze, birkaç dakikalık' : dk < 60 ? `taze, yaklaşık ${Math.round(dk / 10) * 10} dakikalık` : `yaklaşık ${Math.max(1, Math.round(dk / 60))} saatlik`);

// Her 2 saniyede: grupların geçtiği yerlere iz noktası bırakılır
function izBirak(d) {
  const k = d.k;
  for (const g of k.gruplar) {
    if (!TUR_IZ[g.tur] || g.goc) continue;
    if (!Array.isArray(g.iz)) g.iz = [];
    const son = g.iz[g.iz.length - 1];
    if (son && (k.dk - son.dk < IZ_ARALIK || Math.hypot(g.x - son.x, g.y - son.y) < 6)) continue;
    g.iz.push({ x: Math.round(g.x), y: Math.round(g.y), dk: Math.round(k.dk) });
    if (g.iz.length > 30) g.iz.shift();
  }
  // Yağmur izleri siler
  if (k.eko && k.eko.yagmurVar && k.eko.siddet > 0.6) for (const g of k.gruplar) if (g.iz) g.iz = g.iz.filter((p) => k.dk - p.dk < 20);
}

// "İzleri incele": 12 metre içindeki en taze izler
export function izAra(d) {
  const k = d.k;
  if (k.magara) return 'Mağaranın taş zemininde iz kalmıyor.';
  if (k.aracta || k.teknede) return 'İzleri incelemek için yere inmelisin.';
  const o = d.oyuncu;
  const bulunan = [];
  for (const g of k.gruplar) {
    if (!g.iz || !g.iz.length) continue;
    for (let i = g.iz.length - 1; i >= 0; i--) {
      const p = g.iz[i];
      const yas = k.dk - p.dk;
      if (yas > IZ_OMRU) break;
      if (Math.hypot(p.x - o.x, p.y - o.y) <= 12) {
        bulunan.push({ g, i, p, yas });
        break;
      }
    }
  }
  if (!bulunan.length) {
    d.sonIz = null;
    return k.eko && k.eko.yagmurVar ? 'Yağmur izleri silmiş; yerde okunacak bir iz yok.' : 'Yakında taze bir iz yok. Hayvanların geçtiği yerlerde, su yolu ve otlak kenarlarında ara.';
  }
  bulunan.sort((a, b) => a.yas - b.yas);
  const en = bulunan[0];
  d.sonIz = { grupId: en.g.id, i: en.i };
  const yon = izYonu(d, en.g, en.i);
  const tanidik = !!k.arsiv.turler[en.g.tur];
  const tur = tanidik ? kucuk(M.SOZ[en.g.tur]) : 'tanımadığın bir hayvan';
  let m = `İz buldun: ${IZ_TARIF[TUR_IZ[en.g.tur]]}. ${M.BuyukHarf(tur)} izi, ${sureSozu(en.yas)}.`;
  if (M.uyeler(d, en.g).length > 2) m += ' Birden çok hayvan birlikte geçmiş.';
  if (yon) m += ` İzler ${M.saatSozu(M.saatYonu(o, yon))} gidiyor.`;
  if (bulunan.length > 1) m += ` Yakında ${bulunan.length - 1} türün daha izi var.`;
  m += ' Menüden İzi takip et ile peşine düşebilirsin.';
  return m;
}
function izYonu(d, g, i) {
  const sonraki = g.iz[i + 1] || { x: g.x, y: g.y };
  if (Math.hypot(sonraki.x - g.iz[i].x, sonraki.y - g.iz[i].y) < 2) return null;
  return sonraki;
}
// İzi takip et: izin gittiği yöne; iz bir ine çıkıyorsa ine
export function izTakip(d) {
  const k = d.k;
  const s = d.sonIz;
  if (!s) return 'Önce İzleri incele ile bir iz bul.';
  const g = k.gruplar.find((x) => x.id === s.grupId);
  if (!g || !g.iz || !g.iz[s.i]) return 'İz kayboldu.';
  // En yeni iz noktasına kadar takip; en yeni noktadan sonra hayvanlar oradadır
  const hedefNokta = g.iz[g.iz.length - 1];
  const yv = (k.yuvalar || []).find((y) => y.tur === g.tur && !y.bulundu && g.iz.slice(s.i).some((p) => Math.hypot(p.x - y.x, p.y - y.y) < 25));
  const h = yv ? { x: yv.x, y: yv.y, ad: 'izlerin vardığı yer', yakin: 6 } : { x: hedefNokta.x, y: hedefNokta.y, ad: 'izlerin en tazesi', yakin: 5 };
  d.rota = h;
  d.yaklasId = null;
  d.izTakip = { grupId: g.id, yuva: yv ? yv.id : null };
  return `İzi takip ediyorsun: ${M.saatSozu(M.saatYonu(d.oyuncu, h))}, ${M.metreSozu(M.mesafe(d.oyuncu, h))}.${yv ? ' İzler hep aynı yere gidip geliyor; orada bir in ya da yuva olabilir.' : ''}`;
}

// ---------- Yuvalar ----------
export function yuvaBul(d, y, nasil) {
  if (!y || y.bulundu) return;
  const k = d.k;
  y.bulundu = true;
  y.bulunmaDk = k.dk;
  y.nasil = nasil;
  const t = M.YUVA_TURLERI[y.tur];
  M.itibarEkle(d, 6);
  M.arsivOlay(d, `Keşif: ${t.ad}, ${M.bolgeAdi(y.x, y.y)} (${nasil}).`);
  const yer = M.mesafe(d.oyuncu, y) < 200 ? ` ${M.BuyukHarf(M.saatSozu(M.saatYonu(d.oyuncu, y)))}, ${M.metreSozu(M.mesafe(d.oyuncu, y))}.` : '';
  M.olay(d, 'yuvaBulundu', `Keşif! ${t.ad} buldun${nasil === 'GPS' ? ' (GPS kayıtları her gece aynı noktaya dönüşü gösterdi)' : nasil === 'dron' ? ' (dron görüntüsünde)' : ''}.${yer} ${t.tarif}`, 4, { yuvaTur: y.tur, x: y.x, y: y.y, kesif: true });
}
function yuvaDenetle(d) {
  const k = d.k;
  if (!k.yuvalar) return;
  const gece = M.gunEvresi(k.dk) === 'gece';
  for (const y of k.yuvalar) {
    if (y.bulundu) continue;
    if (!k.magara && M.mesafe(d.oyuncu, y) < 14) yuvaBul(d, y, 'saha');
    else if (gece && (k.gpsli || []).some((id) => {
      const b = M.birey(d, id);
      return b && !b.olu && b.tur === y.tur && M.mesafe(b, y) < 15;
    })) yuvaBul(d, y, 'GPS');
  }
}
export const bilinenYuvalar = (k) => (k.yuvalar || []).filter((y) => y.bulundu);
export function yuvaSatirlari(d) {
  const k = d.k;
  return bilinenYuvalar(k).map((y) => {
    const t = M.YUVA_TURLERI[y.tur];
    const sakin = M.uyeler(d, { id: (k.gruplar.find((g) => g.tur === y.tur) || {}).id }).filter((b) => M.mesafe(b, y) < 20).length;
    return { y, metin: `${t.ad}, ${M.bolgeAdi(y.x, y.y)}, ${M.saatSozu(M.saatYonu(d.oyuncu, y))}, ${M.metreSozu(M.mesafe(d.oyuncu, y))}${sakin ? `; şu an yanında ${sakin} ${kucuk(M.SOZ[y.tur])}` : ''}.`, tarif: t.tarif };
  });
}

// ---------- Video (karar 86: basit çekim) ----------
const VIDEO_SURE = 10;
export function videoBaslat(d) {
  const k = d.k;
  if (d.video) return 'Kayıt zaten sürüyor.';
  const b = M.gozlenen(d);
  if (!b) return 'Önce dürbünle bir hayvanı gözlemle; video gözlediğin hayvanı çeker.';
  const menzil = k.ekipman.teleobjektif ? 80 : 50;
  if (M.mesafe(d.oyuncu, b) > menzil) return `Çok uzak: ${M.metreSozu(M.mesafe(d.oyuncu, b))}. Video için en çok ${menzil} metre.`;
  d.video = { id: b.id, t: 0, davranislar: [b.davranis], kesildi: false };
  M.olay(d, 'videoBasladi', `Video kaydı başladı: ${M.bireyAdi(b)}. ${VIDEO_SURE} saniye; kıpırdamadan bekle.`, 2);
  return null;
}
function videoGuncelle(d, dt) {
  const v = d.video;
  if (!v) return;
  const k = d.k;
  const b = M.birey(d, v.id);
  v.t += dt;
  if (!b || b.olu || M.mesafe(d.oyuncu, b) > (k.ekipman.teleobjektif ? 90 : 60)) {
    v.kesildi = true;
  } else if (!v.davranislar.includes(b.davranis)) v.davranislar.push(b.davranis);
  if (v.kesildi || v.t >= VIDEO_SURE) {
    d.video = null;
    const sure = Math.round(v.t);
    if (sure < 3) {
      M.olay(d, 'videoBitti', 'Video kesildi: hayvan görüş alanından çıktı, kayıt çok kısa.', 2);
      return;
    }
    const nadirler = v.davranislar.filter((x) => DAVRANISLAR[x] && DAVRANISLAR[x].nadir);
    const once = new Set(k.arsiv.videolar.filter((x) => x.tur === b.tur).flatMap((x) => x.davranislar));
    const yeniNadir = nadirler.filter((x) => !once.has(x));
    const m = M.mesafe(d.oyuncu, b);
    const kalite = m < 25 ? 'çok iyi' : m < 45 ? 'iyi' : 'orta';
    k.arsiv.videolar.unshift({ id: k.sonrakiId++, bireyId: b.id, kod: M.taninmisMi(b) ? M.kod(b) : null, tur: b.tur, sure, davranislar: v.davranislar.slice(0, 6), dk: k.dk, bolge: M.bolgeAdi(b.x, b.y), kalite });
    if (k.arsiv.videolar.length > 120) k.arsiv.videolar.length = 120;
    if (yeniNadir.length) M.itibarEkle(d, 5 * yeniNadir.length);
    else if (!once.size) M.itibarEkle(d, 2);
    const dv = v.davranislar.map((x) => kucuk(M.davranisAdi(x))).join(', ');
    M.olay(d, 'videoBitti', `Video kaydedildi: ${sure} saniye, ${M.bireyAdi(b)}, kalite ${kalite}. Görüntüde: ${dv}.${yeniNadir.length ? ' Nadir bir davranışın ilk videosu! Bilimsel değeri yüksek.' : ''}${v.kesildi ? ' Hayvan uzaklaşınca kayıt erken bitti.' : ''}`, 3, { id: b.id, kesif: yeniNadir.length > 0 });
  }
}

// ---------- Keşif anları (karar 85) ----------
// Hangi olaylar sinematik sunulur: App kısa bir müzik vurgusu çalar, titreşir, görüntüde kamera hayvana yaklaşır
const KESIF_OLAYLARI = ['yeniTur', 'tanik', 'meydan', 'yuvaBulundu', 'rekabet'];
export function kesifAni(o) {
  if (o.kesif) return true;
  if (KESIF_OLAYLARI.includes(o.tur)) return true;
  return o.tur === 'yeniDavranis' && !!o.nadir;
}

export function guncelle(d, dt) {
  videoGuncelle(d, dt);
  d.g9 = (d.g9 || 0) + dt;
  if (d.g9 < 2) return;
  d.g9 = 0;
  izBirak(d);
  yuvaDenetle(d);
  // İz takibi bitince: hayvanlar yakındaysa söyle
  if (d.izTakip && !d.rota) {
    const g = d.k.gruplar.find((x) => x.id === d.izTakip.grupId);
    d.izTakip = null;
    if (g) {
      const u = M.uyeler(d, g).sort((a, b) => M.mesafe(a, d.oyuncu) - M.mesafe(b, d.oyuncu))[0];
      if (u && M.mesafe(u, d.oyuncu) < 80) M.olay(d, 'izSonu', `İzlerin sahibi yakında: ${d.k.arsiv.turler[g.tur] ? kucuk(M.SOZ[g.tur]) : 'bir hayvan'}, ${M.saatSozu(M.saatYonu(d.oyuncu, u))}, ${M.metreSozu(M.mesafe(d.oyuncu, u))}.`, 3, { id: u.id });
      else M.olay(d, 'izSonu', 'İzler burada belirsizleşiyor. Biraz çevreyi dinle ya da yeniden iz ara.', 3);
    }
  }
}
