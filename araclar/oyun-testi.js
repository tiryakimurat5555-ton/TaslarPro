// Bot testi: araştırmacıyı oynatır (yerlere git, gözlemle, yaklaş, fotoğraf, ses kaydı, araç).
// Kullanım: bun araclar/oyun-testi.js [oyun günü]
import * as M from '../oyun/mantik.js';
import * as Mz from '../oyun/merkez.js';
import { TURLER, YERLER } from '../oyun/veri.js';

const gun = +(process.argv[2] || 3);
const k = M.arastirmaciOlustur('Bot');
let d = M.dunyaOlustur(k);
Mz.baslat(d);
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
  Mz.guncelle(d);
  for (const o of M.olaylariAl(d)) {
    say(o.tur);
    if (o.metin && !ornekler[o.tur]) ornekler[o.tur] = o.metin;
    if (o.tur === 'tehdit') M.yerGit(d, 'istasyon'); // uyarılınca geri çekil
  }
  // Merkez: her oyun saatinde teklifleri kabul et, hazır analizleri başlat, alınabileni al
  if (Math.floor(t * 10) % 1200 === 0) {
    k.teklifler.filter((x) => x.durum === 'teklif').forEach((x) => Mz.teklifKabul(k, x.id));
    Mz.ARASTIRMALAR.forEach((a) => Mz.analizBaslat(k, a.id));
    Object.keys(Mz.TESISLER).forEach((id) => k.butce > 30000 && Mz.tesisKur(k, id));
    Object.keys(Mz.EKIPMANLAR).forEach((id) => k.butce > 15000 && !Mz.EKIPMANLAR[id].adet && Mz.ekipmanAl(k, id));
    ['sahaArastirmacisi', 'biyolog', 'veteriner', 'botanikUzmani'].forEach((r) => !M.personelVar(k, r) && k.butce > 20000 && Mz.personelIslem(k, r));
    if (k.ekipman && Mz.ekipmanDurumu(k, 'tuzak').alinir && k.stok.tuzak + k.tuzaklar.length < 3 && k.butce > 10000) Mz.ekipmanAl(k, 'tuzak');
    if (k.stok.tuzak && k.tuzaklar.length < 3 && Math.hypot(d.oyuncu.x, d.oyuncu.y) > 20) console.log(Mz.tuzakKur(d));
    if (Mz.ekipmanDurumu(k, 'tasma').alinir && !k.stok.tasma && k.butce > 10000) Mz.ekipmanAl(k, 'tasma');
    if (k.stok.tasma && M.gozlenen(d)) { const r = Mz.tasmaTak(d); if (r.startsWith('Veteriner ekip')) console.log(r); }
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
        // Aşama 5: numune, bitki, veteriner
        if (Math.random() < 0.3) say('n:' + Mz.diskiNumunesi(d).slice(0, 30));
        if (Mz.yakinSu(d)) say('n:' + Mz.suNumunesi(d).slice(0, 30));
        if (Mz.yakinLes(d)) say('n:' + Mz.lesNumunesi(d).slice(0, 30));
        Mz.cevredekiBitkiler(d).forEach((id) => {
          say('b:' + Mz.bitkiIncele(d, id).slice(0, 20));
          if (Math.random() < 0.3) say('bn:' + Mz.bitkiNumunesi(d, id).slice(0, 25));
        });
        if (g.hastalik && g.hastalik.goruldu) say('v:' + Mz.veterinerMudahale(d).slice(0, 40));
        if (Mz.rehabUygunMu(g)) say('r:' + Mz.rehabaAl(d).slice(0, 40));
        k.rehab.filter((r) => r.hazir).forEach((r) => say('rb:' + Mz.rehabBirak(d, r.b.id).slice(0, 30)));
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
console.log(`Merkez: bütçe ${k.butce}, tesisler ${k.tesisler.join(',')}, ekipman ${Object.keys(k.ekipman).join(',')}, personel ${k.personel.map((p) => p.rol).join(',')}, araştırma ${Object.entries(k.arastirmalar).map(([a, v]) => a + ':' + v.durum).join(',')}, görev ${k.teklifler.map((x) => x.tip + ':' + x.durum).join(',')}, tuzak ${k.tuzaklar.map((x) => x.foto).join(',')}, gps ${k.gpsli.length}, mesaj ${k.mesajlar.length}`);
console.log(`Ekosistem: gölet ${k.eko.golet.toFixed(2)}, göç ${JSON.stringify(k.eko.gocler.map((g) => g.tur + ':' + g.olay))}, teşhis ${k.eko.teshisler.map((t) => t.hastalik).join(',')}, numune ${k.numuneler.map((n) => n.tip + ':' + n.durum).join(',')}, bitki ${Object.keys(k.arsiv.bitkiler).length}, rehab ${k.rehab.length}`);
console.log(`Bitti: ${M.zamanSozu(k.dk)}; itibar ${k.itibar}; tür ${Object.keys(k.arsiv.turler).length}; birey ${Object.keys(k.arsiv.bireyler).length}; foto ${k.arsiv.fotolar.length}; ses ${k.arsiv.sesler.length}; olay ${k.arsiv.olaylar.length}`);
Object.entries(k.arsiv.turler).forEach(([t, v]) => console.log(`  ${t}: ${v.davranislar.join(', ')}`));
console.log('Örnek metinler:');
Object.entries(ornekler).forEach(([t, m]) => console.log(`  [${t}] ${m}`));
