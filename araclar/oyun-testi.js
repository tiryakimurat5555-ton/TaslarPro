// Bot testi: araştırmacıyı oynatır (yerlere git, gözlemle, yaklaş, fotoğraf, ses kaydı, araç).
// Kullanım: bun araclar/oyun-testi.js [oyun günü]
import * as M from '../oyun/mantik.js';
import { TURLER, YERLER } from '../oyun/veri.js';

const gun = +(process.argv[2] || 3);
const k = M.arastirmaciOlustur('Bot');
let d = M.dunyaOlustur(k);
const sayac = {};
const say = (t) => (sayac[t] = (sayac[t] || 0) + 1);
const ornekler = {};
const adim = 0.1;
const toplam = (gun * 1440) / 0.5; // gerçek saniye
let yerSira = 0;
let sonEylem = 0;
const baslangicNufus = {};
k.hayvanlar.forEach((b) => (baslangicNufus[b.tur] = (baslangicNufus[b.tur] || 0) + 1));

for (let t = 0; t < toplam; t += adim) {
  M.guncelle(d, adim, {});
  for (const o of M.olaylariAl(d)) {
    say(o.tur);
    if (o.metin && !ornekler[o.tur]) ornekler[o.tur] = o.metin;
    if (o.tur === 'tehdit') M.yerGit(d, 'istasyon'); // uyarılınca geri çekil
  }
  if (t - sonEylem > 4) {
    sonEylem = t;
    if (!d.rota && !d.yaklasId) {
      const g = M.gozlenen(d);
      if (!g) {
        if (!M.gozlemBaslat(d)) {
          const y = YERLER[yerSira++ % YERLER.length];
          M.yerGit(d, y.id);
        }
      } else if (d.gozlem && d.gozlem.sn > 25) {
        M.fotografCek(d);
        if (Math.random() < 0.3) M.sesKaydiBaslat(d);
        M.gozlemBitir(d);
        const y = YERLER[yerSira++ % YERLER.length];
        M.yerGit(d, y.id);
      } else if (Math.random() < 0.3) M.yaklas(d);
    }
  }
  // Kayıt ve yeniden yükleme denemesi (gün ortasında)
  if (Math.abs(t - toplam / 2) < adim / 2) {
    const ham = JSON.stringify(M.kayitHazirla(k));
    const k2 = M.kayittanYukle(JSON.parse(ham));
    if (!k2) throw new Error('Kayıt yüklenemedi');
    console.log(`Kayıt boyutu: ${(ham.length / 1024).toFixed(1)} KB`);
    Object.assign(k, k2);
    d = M.dunyaOlustur(k);
  }
}
const nufus = {};
k.hayvanlar.filter((b) => !b.olu).forEach((b) => (nufus[b.tur] = (nufus[b.tur] || 0) + 1));
console.log('Olaylar:', JSON.stringify(sayac));
console.log('Nüfus (başta → sonda):', Object.keys(TURLER).map((t) => `${t} ${baslangicNufus[t] || 0}→${nufus[t] || 0}`).join(', '));
console.log(`Bitti: ${M.zamanSozu(k.dk)}; itibar ${k.itibar}; tür ${Object.keys(k.arsiv.turler).length}; birey ${Object.keys(k.arsiv.bireyler).length}; foto ${k.arsiv.fotolar.length}; ses ${k.arsiv.sesler.length}; olay ${k.arsiv.olaylar.length}`);
Object.entries(k.arsiv.turler).forEach(([t, v]) => console.log(`  ${t}: ${v.davranislar.join(', ')}`));
console.log('Örnek metinler:');
Object.entries(ornekler).forEach(([t, m]) => console.log(`  [${t}] ${m}`));
