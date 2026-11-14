// Aşama 26: su kirliliği (karar 74) ve hayvanların kendini tedavi etmesi (karar 29, hayvan-bitki ilişkileri). Saf mantık;
// Kr.guncelle(d, dt) her karede, işleri 3 sn'de bir. Kaynaklar k.eko.kirlilik'te durur (ekosistem.js kirlilikKaynagi/kirlilikAt okur):
//  - les: suyun içinde ya da kıyısında çürüyen leş bakteri yükü getirir; leş tükenince kirlilik yavaşça azalır.
//  - diski: kurak mevsimde sığ nehirde toplanan su aygırlarının dışkısı oksijeni tüketir (Mara Nehri'nde belgelenen balık ölümleri).
//  - kul: yangından sonraki ilk yağmur, yanık alanın külünü yakındaki suya taşır.
// Nehir akarak kendini temizler (debiye bağlı); gölet daha yavaş. Kirli su içen hayvanlar parazit kapabilir (mantik g.kirliSu).
// Kendini tedavi: parazitli babunlar çöl hurması (Balanites) meyvesi ve yaprağı yer; parazitli ya da ishal olan filler kil yer.
// Sayılar ÖNERİDİR.
import * as M from './mantik.js';
import * as E from './ekosistem.js';
import { GOLET, nehirY, NEHIR_YARI } from './veri.js';

const EN_COK = 12;
const BUYUK = { fil: true, suAygiri: true, manda: true, zurafa: true, gergedan: true, gnu: true, zebra: true };
export const KAYNAK_ADI = { les: 'suda çürüyen leş', diski: 'su aygırı dışkısının biriktiği sığ su', kul: 'yağmurun taşıdığı yangın külü' };
const KAYNAK_ETKI = {
  les: 'Bakteri yükü artar; bu sudan içen hayvanlar hastalık ve parazit kapabilir. Leşi akbabalar, sırtlanlar ve timsahlar tükettikçe su temizlenir.',
  diski: 'Dışkı suda çürürken oksijeni tüketir. Akış çok azalırsa balıklar havasız kalıp ölebilir. Yağmurla nehir kabarınca su yenilenir.',
  kul: 'Kül suyun asitliğini değiştirir ve bulanıklaştırır; birkaç gün içinde akıntıyla dağılır. Kül aynı zamanda suya besin taşır.',
};

export function kirlilikAlani(k) {
  const eko = k.eko;
  if (!eko) return [];
  if (!Array.isArray(eko.kirlilik)) eko.kirlilik = [];
  const gecerli = (s) => s && typeof s === 'object' && KAYNAK_ADI[s.tur] && Number.isFinite(s.x) && Number.isFinite(s.y) && Number.isFinite(s.v);
  if (eko.kirlilik.length > EN_COK || !eko.kirlilik.every(gecerli)) eko.kirlilik = eko.kirlilik.filter(gecerli).slice(0, EN_COK);
  for (const s of eko.kirlilik) s.v = Math.min(1, s.v);
  if (!eko.kirlilikIz || typeof eko.kirlilikIz !== 'object' || Array.isArray(eko.kirlilikIz)) eko.kirlilikIz = {};
  return eko.kirlilik;
}

// Noktanın yakınındaki su: gölet ya da nehrin kendisi (kıyıdan 6 m)
function suYakini(k, x, y) {
  if (!E.goletKurudu(k.eko) && GOLET.su && Math.hypot(x - GOLET.x, y - GOLET.y) < GOLET.su + 6) return { x: GOLET.x, y: GOLET.y, golet: true };
  if (Math.abs(y - nehirY(x)) < NEHIR_YARI + 6) return { x, y: nehirY(x), golet: false };
  return null;
}
function kaynakEkle(d, l, id, tur, yer, v) {
  let s = l.find((x) => x.id === id);
  if (s) {
    s.v = Math.max(s.v, v);
    return s;
  }
  if (l.length >= EN_COK) {
    l.sort((a, b) => b.v - a.v);
    l.length = EN_COK - 1;
  }
  s = { id, tur, x: Math.round(yer.x * 10) / 10, y: Math.round(yer.y * 10) / 10, v: Math.min(1, v), golet: !!yer.golet, dk: Math.round(d.k.dk) };
  l.push(s);
  const o = d.oyuncu;
  if (M.mesafe(o, s) < 90 && !d.k.magara)
    M.olay(d, 'kirlilik', `Su kirleniyor: ${KAYNAK_ADI[tur]}. ${M.BuyukHarf(M.yerTarifi(o, s))}. Suyu ölçer ya da numune alırsan etkisini belirleyebilirsin.`, 2);
  return s;
}

let sonDk = null;
function adim(d) {
  const k = d.k;
  const eko = k.eko;
  if (!eko) return;
  const l = kirlilikAlani(k);
  const iz = eko.kirlilikIz;
  const fark = sonDk === null ? 0 : Math.max(0, Math.min(240, k.dk - sonDk));
  sonDk = k.dk;
  const tk = E.takvim(M.gunNo(k.dk));
  // 1) Suyun içindeki ya da kıyısındaki leşler
  const lesIdleri = new Set();
  for (const les of k.lesler || []) {
    if (!(les.kalan > 0.1)) continue;
    const yer = suYakini(k, les.x, les.y);
    if (!yer) continue;
    const id = `les:${les.dk}:${les.tur}`;
    lesIdleri.add(id);
    kaynakEkle(d, l, id, 'les', { x: les.x, y: les.y, golet: yer.golet }, (BUYUK[les.tur] ? 0.65 : 0.4) * Math.min(1, les.kalan + 0.2));
  }
  // 2) Kurak mevsimde sığ nehirde toplanan su aygırları
  if (tk.mevsim === 'kurak' && eko.nehir < 0.4) {
    for (const g of k.gruplar) {
      if (g.tur !== 'suAygiri' || g.goc || !(g.plan === 'suda' || g.plan === 'dinlen' || g.plan === 'uyu')) continue;
      if (Math.abs(g.y - nehirY(g.x)) > NEHIR_YARI + 4) continue;
      const n = M.uyeler(d, g).length;
      if (n < 2) continue;
      const id = `diski:${g.id}`;
      const s = l.find((x) => x.id === id);
      const artis = (fark / 1440) * 0.12 * n * (1.4 - eko.nehir * 2);
      if (s) {
        s.v = Math.min(1, s.v + artis);
        s.x = Math.round(g.x * 10) / 10;
        s.y = Math.round(nehirY(g.x) * 10) / 10;
      } else if (artis > 0) kaynakEkle(d, l, id, 'diski', { x: g.x, y: nehirY(g.x), golet: false }, 0.12);
    }
  }
  // 3) Yangından sonraki yağmur külü suya taşır (yanık hücre başına bir kez)
  if (eko.yagmurVar && eko.yanik) {
    for (const h of Object.keys(eko.yanik)) {
      if (iz['kul:' + h] || k.dk - eko.yanik[h] > 6 * 1440) continue;
      const m = E.hucreMerkezi(Number(h));
      const nehir = Math.abs(m.y - nehirY(m.x)) < 40;
      const golet = !E.goletKurudu(eko) && Math.hypot(m.x - GOLET.x, m.y - GOLET.y) < GOLET.r + 35;
      iz['kul:' + h] = 1;
      if (!nehir && !golet) continue;
      const yer = golet ? { x: GOLET.x, y: GOLET.y, golet: true } : { x: m.x, y: nehirY(m.x), golet: false };
      const id = golet ? 'kul:golet' : `kul:${Math.round(m.x / 25)}`;
      const s = l.find((x) => x.id === id);
      if (s) s.v = Math.min(0.8, s.v + 0.12);
      else kaynakEkle(d, l, id, 'kul', yer, 0.35);
    }
    const anahtar = Object.keys(iz);
    if (anahtar.length > 300) for (const a of anahtar.slice(0, anahtar.length - 300)) delete iz[a];
  }
  // 4) Temizlenme: nehir akarak (debiyle), gölet yavaş; leşi sürerken kirlilik azalmaz
  for (const s of l) {
    if (s.tur === 'les' && lesIdleri.has(s.id)) continue;
    if (s.tur === 'diski' && tk.mevsim === 'kurak' && eko.nehir < 0.4 && k.gruplar.some((g) => `diski:${g.id}` === s.id && !g.goc)) {
      s.v -= (fark / 1440) * 0.05;
      continue;
    }
    const hiz = s.golet ? 0.22 : 0.45 + eko.nehir * 1.2 + (eko.taskin ? 1 : 0);
    s.v -= (fark / 1440) * hiz;
  }
  for (let i = l.length - 1; i >= 0; i--) if (l[i].v <= 0.03) l.splice(i, 1);
  // 5) Balık ölümü: oksijeni tükenen sığ su (yılda en çok bir kez)
  const yil = tk.yil;
  for (const s of l) {
    if (s.tur !== 'diski' || s.v < 0.6 || eko.nehir > 0.32 || iz.balikYil === yil) continue;
    iz.balikYil = yil;
    s.balik = true;
    const m = `Balık ölümü: su aygırlarının toplandığı sığ nehir kesiminde dışkı suyun oksijenini tüketti; balıklar yüzeye çıkıp hava yutuyor, bir kısmı ölmüş. Kuru mevsimde Mara Nehri'nde de böyle ölümler görülür. Akbabalar ve marabu leylekleri toplanıyor. ${M.BuyukHarf(M.yerTarifi(d.oyuncu, s))}.`;
    if (M.mesafe(d.oyuncu, s) < 150 && !k.magara) M.olay(d, 'kirlilik', m, 3);
    else M.mesajEkle(k, `Saha notu: ${m}`, 'ekosistem');
    M.arsivOlay(d, 'Kurak mevsimde sığ nehirde balık ölümü.');
  }
}

// Kendini tedavi (karar 29): hasta birey şifalı bir bitkiyi ya da kili yer, hastalığı biraz hafifler
const TEDAVI = {
  babun: { hastalik: ['parazit'], davranis: 'sifaliBitkiYiyor', bitki: 'colHurmasi', sure: 30, etki: 0.12 },
  fil: { hastalik: ['parazit'], davranis: 'kilYiyor', sure: 35, etki: 0.08 },
};
function tedaviAnlik(d) {
  const k = d.k;
  const gun = M.gunNo(k.dk);
  for (const b of k.hayvanlar) {
    const t = TEDAVI[b.tur];
    if (!t || b.olu || !b.hastalik || !t.hastalik.includes(b.hastalik.id) || b.tuzakta) continue;
    if (b._tedaviGun === gun || (b.ozel && b.ozel.bitis > d.zaman) || Math.random() > 0.02) continue;
    const g = k.gruplar.find((x) => x.id === b.grup);
    if (!g || g.goc || g.av || g.plan === 'uyu') continue;
    b._tedaviGun = gun;
    b.ozel = { davranis: t.davranis, bitis: d.zaman + t.sure };
    b.hastalik.siddet = Math.max(0.05, (b.hastalik.siddet || 0.3) - t.etki);
    if (!b._tedaviIlk) {
      b._tedaviIlk = true;
      M.gecmisEkle(k, b, t.bitki ? 'Hastalığına karşı şifalı bitki yedi' : 'Hastalığına karşı kil yedi');
    }
  }
}

export function kirlilikSatirlari(d) {
  const k = d.k;
  const l = kirlilikAlani(k);
  if (!l.length) return [];
  return l
    .slice()
    .sort((a, b) => b.v - a.v)
    .map((s) => ({ s, metin: `${M.BuyukHarf(KAYNAK_ADI[s.tur])}, ${s.golet ? 'gölette' : 'nehirde'}: kirlilik ${s.v > 0.6 ? 'yüksek' : s.v > 0.3 ? 'orta' : 'az'}. ${M.BuyukHarf(M.yerTarifi(d.oyuncu, s))}`, tarif: KAYNAK_ETKI[s.tur] }));
}
export function kirlilikOzeti(k) {
  const l = kirlilikAlani(k);
  if (!l.length) return 'Bilinen bir kirlilik kaynağı yok; su kendi doğal düzeninde.';
  const g = l.filter((s) => s.golet).length;
  return `${l.length} kirlilik kaynağı var${g ? `, ${g} tanesi gölette` : ''}. En güçlüsü: ${KAYNAK_ADI[l.slice().sort((a, b) => b.v - a.v)[0].tur]}.`;
}
// Ölçüm ve numune için: noktadaki kaynağın etkisi
export function olcumNotu(k, x, y, r = 30) {
  const s = E.kirlilikKaynagi(k.eko, x, y, r);
  if (!s || s.v < 0.08) return null;
  return { s, metin: `Bu noktada suyu kirleten bir kaynak var: ${KAYNAK_ADI[s.tur]}. ${KAYNAK_ETKI[s.tur]}` };
}

let sayac = 0;
export function guncelle(d, dt) {
  sayac += dt;
  if (sayac < 3) return;
  sayac = 0;
  adim(d);
  if (!d.dinleniyor) tedaviAnlik(d);
}
