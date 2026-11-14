// Bot testi: araştırmacıyı oynatır (yerlere git, gözlemle, yaklaş, fotoğraf, ses kaydı, araç).
// Kullanım: bun araclar/oyun-testi.js [oyun günü]
import * as M from '../oyun/mantik.js';
import * as Mz from '../oyun/merkez.js';
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
import { TURLER, YERLER } from '../oyun/veri.js';
import * as K from '../oyun/kesif.js';

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

const KOTU = /undefined|NaN|\[object|null\b|  |\.\.(?!\.)| ,/;
const efektSay = {};
const kotu = new Set();
let sureTop = 0;
let sureSayi = 0;
let sureEnCok = 0;
for (let t = 0; t < toplam; t += adim) {
  const t0 = performance.now();
  M.guncelle(d, adim, {});
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
  const gecen = performance.now() - t0;
  sureTop += gecen;
  sureSayi++;
  if (gecen > sureEnCok) sureEnCok = gecen;
  for (const e of M.efektleriAl(d)) efektSay[e.ad] = (efektSay[e.ad] || 0) + 1;
  for (const o of M.olaylariAl(d)) {
    if (o.metin && KOTU.test(o.metin)) kotu.add(o.metin.slice(0, 160));
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
    // Aşama 12: istasyondayken açık bir saha gezisine "ışınlanarak" git, noktaları gez, canlı ara, dön; yönetim eylemleri
    if (K.istasyondaMi(d) && Math.random() < 0.3) {
      const acik = K.uzakSatirlari(k).filter((x) => x.dur.acik);
      if (acik.length && !K.uzakHazirla(d, acik[0].id)) {
        const alan = acik[Math.floor(Math.random() * acik.length)].id;
        K.uzagaVar(d, alan);
        for (let j = 0; j < 5; j++) { d.sonArama = -9; K.kucukAra(d); M.fotografCek(d); K.magaraIlerle(d); }
        say('gezi:' + K.uzaktanDon(d).slice(0, 20));
      }
    }
    Object.keys(Y.EYLEMLER).forEach((id) => Y.eylemDurumu(d, id).yapilir && k.butce > 12000 && say('yon:' + Y.eylemYap(d, id).slice(0, 25)));
    if (k.stok.tasma && M.gozlenen(d)) { const r = Mz.tasmaTak(d); if (r.startsWith('Veteriner ekip')) console.log(r); }
  }
  if (t - sonEylem > 4) {
    sonEylem = t;
    // Aşama 10: ziyaretçi varsa yanına git ve konuş
    const zy = H.ziyaretci(d);
    if (zy && !zy.konusuldu) {
      if (H.konusulabilir(d)) say('konus:' + H.konus(d).slice(0, 40));
      else if (!d.rota || d.rota.ad !== 'Ziyaretçi') M.yerGit(d, 'ziyaretci');
    }
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
        // Aşama 6: küçük canlı, tel tuzak, koruma, mağara
        K.kucukAra(d);
        const tz = K.yakinTuzak(d, 6);
        if (tz && tz.bulundu) say('tz:' + (tz.hayvanId ? K.tuzaktanKurtar(d) : K.tuzakSok(d)).slice(0, 25));
        Mz.KORUMA.forEach((p) => {
          if (!k.koruma.projeler[p.id]) Mz.korumaBaslat(k, p.id);
          Mz.korumaSatirlari(k, p.id).forEach((x) => x.eylem && k.butce > 20000 && say('ke:' + Mz.korumaEylem(k, p.id, x.i).slice(0, 25)));
        });
        if (K.magaraYakin(d) && k.ekipman.magaraTakimi && !k.magara) {
          K.magarayaGir(d);
          for (let i = 0; i < 5; i++) { K.magaraIlerle(d); d.sonArama = -9; K.kucukAra(d); }
          K.magaradanCik(d);
          for (let i = 0; i < 5; i++) K.magaraGeri(d);
        }
        if (Math.random() < 0.3) M.sesKaydiBaslat(d);
        // Aşama 11: su noktasındaysa ölç, gözle, geçiş say
        if (S.yakinNokta(d)) {
          say('su:' + S.suOlc(d).slice(0, 20));
          S.suyuGozle(d);
          if (S.yakinNokta(d).tip === 'gecit') say('gecis:' + S.gecisSay(d).slice(0, 25));
        }
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
console.log(`Aşama 6: küçük ${K.kucukSayisi(k)}, mağara ${k.arsiv.magara.odalar.length}, kaçak ${JSON.stringify(k.kacak.tuzaklar.length)} kalan ${k.kacak.bulunan} söküldü ${k.kacak.kurtarilan} kurtarıldı, koruma ${JSON.stringify(Object.fromEntries(Object.entries(k.koruma.projeler).map(([a, b]) => [a, b.durum])))}, yangın ${k.eko.yanginlar}`);
console.log(`Bitti: ${M.zamanSozu(k.dk)}; itibar ${k.itibar}; tür ${Object.keys(k.arsiv.turler).length}; birey ${Object.keys(k.arsiv.bireyler).length}; foto ${k.arsiv.fotolar.length}; ses ${k.arsiv.sesler.length}; olay ${k.arsiv.olaylar.length}`);
Object.entries(k.arsiv.turler).forEach(([t, v]) => console.log(`  ${t}: ${v.davranislar.join(', ')}`));
console.log(`Performans: kare başına mantık ortalama ${(sureTop / sureSayi).toFixed(2)} ms, en çok ${sureEnCok.toFixed(1)} ms (hayvan ${k.hayvanlar.filter((b) => !b.olu).length})`);
k.mesajlar.forEach((m) => KOTU.test(m.metin) && kotu.add(m.metin.slice(0, 160)));
console.log(`Hikâye: gizemler ${JSON.stringify(Object.fromEntries(Object.entries(k.hikaye.gizemler).map(([a, g]) => [a, g.bitti ? 'çözüldü' : g.adim + 1 + '. adım'])))}, başarılar ${Object.keys(k.hikaye.basarilar).join(',')}, görüşme ${k.hikaye.gorusmeler}, sayaç ${JSON.stringify(k.hikaye.sayac)}`);
console.log(`Su: ${S.suRaporu(k)}`);
console.log(`Rutin: ${k.gruplar.slice(0, 4).map((g) => M.rutinMetni(d, g)).join(' | ')}; kamera ${S.kameraSatirlari(k).join(', ')}`);
console.log(`Özel bireyler: ${JSON.stringify(k.ozelBireyler)}; tanınan ${k.hayvanlar.filter((b) => b.ozellik && b.no).map((b) => b.ozellik).join(',')}; göç: ${Y.gocSatirlari(d).join(' ')}`);
console.log(`Sosyal: ${['aslan', 'sirtlan', 'yabanKopegi', 'cita', 'leopar'].map((t) => t + ' ' + Sy.turSatirlari(d, t).join(' ')).join(' | ')}`);
console.log(`Beceri: ${k.hayvanlar.filter((b) => !b.olu && Number.isFinite(b.beceri)).map((b) => b.tur + ':' + b.beceri.toFixed(2)).join(' ')}; anneler ${k.hayvanlar.filter((b) => b.yavruBuyuttu).length}; savunma ${k.gruplar.filter((g) => g.savunmaDeneyim).map((g) => g.tur + ':' + g.savunmaDeneyim.toFixed(2)).join(' ')}`);
console.log(`Gezi: ${K.uzakSatirlari(k).map((x) => x.metin).join(' | ')}`);
console.log(`Yönetim: lantana ${Object.keys(k.eko.istilaci || {}).length}, yakma ${k.eko.kontrolluYakmaYil}, gölet ${!!k.eko.goletRestore}, raporlar ${JSON.stringify(Y.raporSatirlari(k))}`);
console.log(`Eylem ve hayvan sesleri: ${JSON.stringify(efektSay)}`);
console.log(`Bozuk metin: ${kotu.size}`);
[...kotu].slice(0, 10).forEach((m) => console.log('  ' + m));
if (process.env.KAYIT_YAZ) require('fs').writeFileSync(process.env.KAYIT_YAZ, JSON.stringify(M.kayitHazirla(k)));
console.log('Örnek metinler:');
Object.entries(ornekler).forEach(([t, m]) => console.log(`  [${t}] ${m}`));
