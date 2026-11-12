// Ekosistem testi (Aşama 5): oyuncu istasyonda beklerken dünyayı günlerce işletir; her gün hava, su, otlak,
// nüfus, hastalık, göç ve ölüm nedenlerini yazar. Kullanım: bun araclar/ekosistem-testi.js [gün]
import * as M from '../oyun/mantik.js';
import * as Mz from '../oyun/merkez.js';
import * as E from '../oyun/ekosistem.js';
import { TURLER, TUR_SIRASI } from '../oyun/veri.js';

const gunSayisi = +(process.argv[2] || 30);
const k = M.arastirmaciOlustur('Ekosistem');
let d = M.dunyaOlustur(k);
Mz.baslat(d);
const olumler = {};
const olaySay = {};
let sonGun = M.gunNo(k.dk);
const bas = Date.now();
const nufus = () => {
  const n = {};
  k.hayvanlar.filter((b) => !b.olu).forEach((b) => (n[b.tur] = (n[b.tur] || 0) + 1));
  return n;
};
const ilk = nufus();
for (let t = 0; t < (gunSayisi * 1440) / 0.5; t += 0.1) {
  M.guncelle(d, 0.1, {});
  Mz.guncelle(d);
  for (const o of M.olaylariAl(d)) {
    olaySay[o.tur] = (olaySay[o.tur] || 0) + 1;
    if (['goc', 'mevsim'].includes(o.tur)) console.log('   >', o.metin.slice(0, 160));
  }
  const gun = M.gunNo(k.dk);
  if (gun !== sonGun) {
    sonGun = gun;
    const e = k.eko;
    const tk = E.takvim(gun);
    const hasta = {};
    k.hayvanlar.filter((b) => !b.olu && b.hastalik).forEach((b) => (hasta[b.hastalik.id] = (hasta[b.hastalik.id] || 0) + 1));
    const n = nufus();
    const top = Object.values(n).reduce((a, b) => a + b, 0);
    const otOrt = e.ot.reduce((a, b) => a + b, 0) / e.ot.filter((x, i) => d.kap.ot[i]).length;
    const kon = k.hayvanlar.filter((b) => !b.olu).reduce((a, b) => a + b.kondisyon, 0) / Math.max(1, top);
    console.log(
      `Gün ${gun} ${tk.mevsim[0]}${tk.mevsimGunu} ${e.hava.tur.padEnd(8)} gölet ${e.golet.toFixed(2)} alg ${e.alg.toFixed(2)} nem ${e.islaklik.toFixed(2)} ot ${otOrt.toFixed(2)} yeşil ${e.yesil.toFixed(2)} | nüfus ${top} (dışarıda ${k.disari.hayvanlar.length}) kondisyon ${kon.toFixed(2)} | hasta ${JSON.stringify(hasta)}${e.salgin ? ' SALGIN ' + e.salgin.vaka : ''} | bütçe ${k.butce}`
    );
  }
}
k.hayvanlar.filter((b) => b.olu).forEach((b) => (olumler[b.olumNedeni] = (olumler[b.olumNedeni] || 0) + 1));
const son = nufus();
console.log('Nüfus:', TUR_SIRASI.map((t) => `${t} ${ilk[t] || 0}→${son[t] || 0}`).join(', '));
console.log('Ölüm nedenleri (son 5 gün + tanınmışlar):', JSON.stringify(olumler));
console.log('Olaylar:', JSON.stringify(olaySay));
console.log('Göçler:', JSON.stringify(k.eko.gocler));
console.log('Kayıt boyutu:', (JSON.stringify(M.kayitHazirla(k)).length / 1024).toFixed(1), 'KB; süre', ((Date.now() - bas) / 1000).toFixed(0), 'sn');
const k2 = M.kayittanYukle(JSON.parse(JSON.stringify(M.kayitHazirla(k))));
d = M.dunyaOlustur(k2);
console.log('Yeniden yükleme:', k2 ? 'tamam' : 'HATA', k2.eko.golet.toFixed(2));
