// Bot testi: avcıyı oynatır (hedef seç, saldır, iksir iç, tüccardan al, harita değiştir). Kullanım: bun araclar/oyun-testi.js [dakika]
import * as M from '../oyun/mantik.js';
import { SILAHLAR, ZIRHLAR, HARITALAR } from '../oyun/veri.js';
const dakika = +(process.argv[2] || 60);
const k = M.avciOlustur('Bot');
let d = M.dunyaOlustur(k, 'orman');
let olum = 0;
const rapor = [];
for (let t = 0; t < dakika * 60; t += 0.1) {
  M.guncelle(d, 0.1, {});
  for (const o of M.olaylariAl(d)) {
    if (o.tur === 'oldun') olum++;
    if (o.tur === 'seviye') rapor.push(`${(t / 60).toFixed(1)} dk: sv ${k.seviye}, ${d.harita.ad}, ${M.hesapla(k).silah.ad}`);
  }
  if (d.olu) { M.yenidenDog(d); continue; }
  const h = M.hesapla(k);
  if (k.can < h.enCan * 0.35) M.iksirIc(d);
  M.yetenekKullan(d, 'sargi'); M.yetenekKullan(d, 'avciNidasi');
  if (M.hedef(d)) { M.yetenekKullan(d, 'gucluVurus'); if (!d.otoSaldiri) M.saldir(d); }
  else if (Math.floor(t * 10) % 20 === 0) {
    // Seviyesine uygun hedef seç
    const l = M.yakindakiler(d, 80).filter((x) => x.c.seviye <= k.seviye + 2 && !(x.c.enCan > 300 && k.seviye < x.c.seviye));
    if (l.length) { d.hedefId = l[0].c.id; M.saldir(d); }
  }
  // Alışveriş ve harita: dakikada bir
  if (Math.floor(t * 10) % 600 === 0) {
    for (const s of SILAHLAR) if (!k.silahlar.includes(s.id) && s.seviye <= k.seviye && s.menzil < 10 && k.altin >= s.fiyat) M.satinAl(k, 'silah', s.id);
    for (const z of ZIRHLAR) if (!k.zirhlar.includes(z.id) && z.seviye <= k.seviye && k.altin >= z.fiyat) M.satinAl(k, 'zirh', z.id);
    while (k.iksir < 5 && k.altin > 200) M.satinAl(k, 'iksir');
    const uygun = [...HARITALAR].reverse().find((hr) => hr.seviye[0] <= k.seviye);
    if (uygun.id !== d.harita.id) { k.konum = null; d = M.dunyaOlustur(k, uygun.id); }
  }
}
console.log(rapor.join('\n'));
console.log(`Bitti: sv ${k.seviye}, ${k.avlanan} av, ${olum} ölüm, ${k.altin} altın, liderler: ${k.patronlar.join(', ')}`);
