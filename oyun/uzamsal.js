// ==== GERÇEK ZAMANLI 3B SES (oyunun kendi derlemesinde: APK / iPhone derlemesi) ====
// react-native-audio-api (Web Audio API'nin telefondaki karşılığı) ile her konumlu ses TEK bir kayıttan çalar ve
// çalarken gerçek zamanlı işlenir. Kütüphanenin kendi HRTF'i henüz açık değil (yalnız eşit güçlü pan var); bu yüzden
// baş yönlü sesi burada basit bir "baş modeli" ile kuruyoruz. Her kaynak için iki kulak yolu:
//   kaynak → uzaklık kazancı → [sol kulak: gecikme → alçak geçiren → kazanç] ┐
//                             → [sağ kulak: gecikme → alçak geçiren → kazanç] ┴→ birleştirici (2 kanal) → ana çıkış
//                             → yankı gönderimi → ortak yankı (mağarada güçlü, uzak seste biraz)
// Yön ipuçları:
//  - Kulaklar arası zaman farkı (ITD): ses yandan gelince uzak kulağa 0,66 ms'ye kadar geç varır (beyin en çok buna bakar).
//  - Kulaklar arası düzey farkı ve baş gölgesi (ILD): uzak kulakta ses hem kısılır hem tizleri kaybolur.
//  - Arka: arkadan gelen seste kulak kepçesi tizleri keser; ön-arka ayrımı bununla yapılır.
//  - Uzaklık: ses kısılır, havada tizler azalır, yankının payı artar.
//  - Engel (kaya, ağaç, bina) ve mağara: güçlü alçak geçiren ve kısma.
//  - Doppler: yaklaşan kaynağın perdesi yükselir, uzaklaşanınki düşer (oyunun hızlarına göre biraz abartılı).
// Expo Go'da bu kütüphane yoktur: hazir() false döner, efekt.js eski oynatıcıya düşer.
let AA = null;
try {
  AA = require('react-native-audio-api');
} catch (e) {
  AA = null;
}

let ctx = null;
let ana = null;
let yankiGiris = null;
let kurulamadi = false;
const tamponlar = new Map(); // ses kaynağı (require numarası) → Promise<AudioBuffer>
const calanlar = new Set();
let sayac = null;
const EN_COK_SES = 14;
const ITD_EN_COK = 0.00066;
const TIZ = 18000;

function yankiDurtusu(c) {
  // Yapay oda/mağara yankısı: 1,6 sn sönen gürültü, iki kanal ayrı (geniş duyulsun)
  const sr = c.sampleRate || 44100;
  const n = Math.floor(sr * 1.6);
  const b = c.createBuffer(2, n, sr);
  for (let ch = 0; ch < 2; ch++) {
    const v = b.getChannelData(ch);
    let s = 12345 + ch * 777;
    for (let i = 0; i < n; i++) {
      s = (s * 1103515245 + 12345) & 0x7fffffff;
      const g = (s / 0x7fffffff) * 2 - 1;
      v[i] = g * Math.pow(1 - i / n, 3.2) * (i < sr * 0.012 ? i / (sr * 0.012) : 1);
    }
    if (typeof b.copyToChannel === 'function') b.copyToChannel(v, ch);
  }
  return b;
}

// Kütüphaneyi ve ses bağlamını ilk kullanımda kurar. Kurulamazsa (Expo Go) bir daha denemez.
export function hazir() {
  if (ctx) return true;
  if (kurulamadi || !AA || !AA.AudioContext) return false;
  try {
    // iPhone'da konuşma (expo-speech), VoiceOver ve öbür oynatıcılarla karışabilsin
    try {
      if (AA.AudioManager && typeof AA.AudioManager.setSystemOptions === 'function') AA.AudioManager.setSystemOptions({ ios: { category: 'playback', options: ['mixWithOthers'] } });
    } catch (e) {}
    ctx = new AA.AudioContext();
    ana = ctx.createGain();
    ana.gain.value = 1;
    ana.connect(ctx.destination);
    const yanki = ctx.createConvolver();
    yanki.buffer = yankiDurtusu(ctx);
    yankiGiris = ctx.createGain();
    yankiGiris.gain.value = 1;
    yankiGiris.connect(yanki);
    yanki.connect(ana);
    return true;
  } catch (e) {
    kurulamadi = true;
    ctx = null;
    return false;
  }
}
export const motor = () => (ctx ? 'gercek3B' : AA ? 'kurulamadi' : 'yok');

function tampon(kaynak) {
  let p = tamponlar.get(kaynak);
  if (!p) {
    p = ctx.decodeAudioData(kaynak).catch(() => null);
    tamponlar.set(kaynak, p);
  }
  return p;
}
export function onYukle(kaynaklar) {
  if (!hazir()) return;
  kaynaklar.forEach((k) => k && tampon(k));
}

let genelDuzey = 1;
let magarada = false;
export function ayarla({ genel, magara } = {}) {
  if (typeof genel === 'number') genelDuzey = genel;
  if (typeof magara === 'boolean') magarada = magara;
}

// Bir kaynağın o anki kulak değerleri (baş modeli). rel: başa göre açı (0 önde, + sağda), m: uzaklık (metre)
export function kulakDegerleri(rel, m, engel, ses = 1) {
  const s = Math.sin(rel);
  const c = Math.cos(rel);
  const as = Math.abs(s);
  const uzaklik = m < 3 ? 1 : Math.max(0.05, Math.pow(3 / m, 0.85));
  let v = ses * uzaklik * genelDuzey * (engel ? 0.6 : 1);
  if (c < 0) v *= 1 - 0.18 * -c; // arkadaki ses biraz kısık gelir
  // Tizler: uzaklıkta hava yutar, arkada kulak kepçesi keser, engel ve mağara boğar
  let tiz = TIZ * Math.pow(0.5, m / 90);
  if (c < 0) tiz *= Math.pow(0.32, -c);
  if (engel) tiz = Math.min(tiz, 850);
  // Uzak kulak: baş gölgesi (düzey ve tiz kaybı), yakın kulak biraz güçlü
  const yakin = 1 + 0.12 * as;
  const uzak = 1 - 0.55 * as;
  const golge = tiz * Math.pow(1500 / TIZ, as);
  const sagda = s >= 0;
  const itd = ITD_EN_COK * as;
  return {
    sol: { kazanc: v * (sagda ? uzak : yakin), tiz: Math.max(300, sagda ? golge : tiz), gecikme: sagda ? itd : 0 },
    sag: { kazanc: v * (sagda ? yakin : uzak), tiz: Math.max(300, sagda ? tiz : golge), gecikme: sagda ? 0 : itd },
    yanki: Math.min(0.6, (magarada ? 0.45 : 0.04 + 0.22 * Math.min(1, m / 90)) * v * (engel ? 1.4 : 1)),
  };
}

function gec(p, deger, simdi, sure = 0.03) {
  try {
    p.setTargetAtTime(deger, simdi, sure);
  } catch (e) {
    try {
      p.value = deger;
    } catch (er) {}
  }
}

function guncelleBir(x, simdi, ilk) {
  const dx = x.hedef.x - x.kim.x;
  const dy = x.hedef.y - x.kim.y;
  const m = Math.hypot(dx, dy);
  let rel = m < 0.01 ? 0 : Math.atan2(dx, dy) - (x.kim.yon || 0);
  while (rel > Math.PI) rel -= 2 * Math.PI;
  while (rel < -Math.PI) rel += 2 * Math.PI;
  // Engel denetimi pahalı (bütün ağaç ve kayalar): 250 ms'de bir yenilenir
  if (x.engelF && (ilk || Date.now() - (x.engelZaman || 0) > 250)) {
    x.engel = !!x.engelF();
    x.engelZaman = Date.now();
  }
  const engel = x.engel;
  const k = kulakDegerleri(rel, m, engel, x.ses);
  const t = ilk ? 0 : 0.03;
  for (const yan of ['sol', 'sag']) {
    const y = x[yan];
    const d = k[yan];
    if (ilk) {
      y.kazanc.gain.value = d.kazanc;
      y.suzgec.frequency.value = d.tiz;
      y.gecikme.delayTime.value = d.gecikme;
    } else {
      gec(y.kazanc.gain, d.kazanc, simdi, t);
      gec(y.suzgec.frequency, d.tiz, simdi, t);
      gec(y.gecikme.delayTime, d.gecikme, simdi, 0.02);
    }
  }
  if (ilk) x.yanki.gain.value = k.yanki;
  else gec(x.yanki.gain, k.yanki, simdi, 0.05);
  // Doppler: uzaklık değişim hızına göre perde
  const sn = Date.now() / 1000;
  if (x.sonM != null && sn > x.sonZaman) {
    const vr = (m - x.sonM) / (sn - x.sonZaman);
    const hiz = Math.max(0.9, Math.min(1.1, 1 - (vr / 340) * 2));
    x.hizOrt = x.hizOrt * 0.7 + hiz * 0.3;
    gec(x.kaynak.playbackRate, x.hizOrt * x.temelHiz, simdi, 0.05);
  }
  x.sonM = m;
  x.sonZaman = sn;
  x.durum = { m: Math.round(m * 10) / 10, rel: Math.round(rel * 100) / 100, sol: Math.round(k.sol.kazanc * 100) / 100, sag: Math.round(k.sag.kazanc * 100) / 100, tizSol: Math.round(k.sol.tiz), tizSag: Math.round(k.sag.tiz), engel };
}

function adim() {
  if (!ctx) return;
  const simdi = ctx.currentTime;
  for (const x of calanlar) {
    if (Date.now() > x.bitis) {
      birak(x);
      continue;
    }
    try {
      guncelleBir(x, simdi, false);
    } catch (e) {
      birak(x);
    }
  }
  if (!calanlar.size) {
    clearInterval(sayac);
    sayac = null;
  }
}

function birak(x) {
  calanlar.delete(x);
  try {
    x.kaynak.stop();
  } catch (e) {}
  for (const n of x.dugumler) {
    try {
      n.disconnect();
    } catch (e) {}
  }
}

// Konumlu sesi çalar. kaynak: require numarası; kim { x, y, yon }, hedef { x, y } (çalarken izlenir; hayvan nesnesi olabilir).
// engelF: () => bool (arada engel var mı; çalarken yeniden sorulur). Döndürür: çalma başladıysa true.
export function cal(taban, kaynak, kim, hedef, { ses = 1, engel = false, engelF = null, hiz = 1 } = {}) {
  if (!hazir() || !kaynak) return false;
  try {
    if (ctx.state === 'suspended' && typeof ctx.resume === 'function') ctx.resume();
  } catch (e) {}
  // Aynı ses aynı anda iki kez çalmasın (eski sürümle aynı davranış); en eski sesler sınırı aşınca kesilir
  for (const x of calanlar) if (x.taban === taban) birak(x);
  if (calanlar.size >= EN_COK_SES) birak(calanlar.values().next().value);
  const bekleyen = { taban, iptal: false };
  tampon(kaynak).then((buf) => {
    if (!buf || bekleyen.iptal || !ctx) return;
    try {
      const kaynakDugum = ctx.createBufferSource();
      kaynakDugum.buffer = buf;
      const giris = ctx.createGain();
      giris.gain.value = 1;
      kaynakDugum.connect(giris);
      const birlestir = ctx.createChannelMerger(2);
      const yol = (kanal) => {
        const gecikme = ctx.createDelay(0.01);
        const suzgec = ctx.createBiquadFilter();
        suzgec.type = 'lowpass';
        suzgec.Q.value = 0.5;
        const kazanc = ctx.createGain();
        giris.connect(gecikme);
        gecikme.connect(suzgec);
        suzgec.connect(kazanc);
        kazanc.connect(birlestir, 0, kanal);
        return { gecikme, suzgec, kazanc };
      };
      const sol = yol(0);
      const sag = yol(1);
      birlestir.connect(ana);
      const yanki = ctx.createGain();
      giris.connect(yanki);
      yanki.connect(yankiGiris);
      const x = {
        taban,
        kim,
        hedef,
        ses,
        engel,
        engelF,
        kaynak: kaynakDugum,
        sol,
        sag,
        yanki,
        temelHiz: hiz,
        hizOrt: 1,
        sonM: null,
        sonZaman: 0,
        bitis: Date.now() + ((buf.duration || 4) / Math.max(0.5, hiz)) * 1000 + 300,
        dugumler: [kaynakDugum, giris, sol.gecikme, sol.suzgec, sol.kazanc, sag.gecikme, sag.suzgec, sag.kazanc, birlestir, yanki],
      };
      kaynakDugum.playbackRate.value = hiz;
      guncelleBir(x, ctx.currentTime, true);
      kaynakDugum.onended = () => birak(x);
      kaynakDugum.start();
      calanlar.add(x);
      if (!sayac) sayac = setInterval(adim, 50);
    } catch (e) {}
  });
  return true;
}

export function hepsiniSustur() {
  for (const x of [...calanlar]) birak(x);
}
// Tarayıcı denemeleri ve tanı için: çalan konumlu sesler ve kulak değerleri
export const durum = () => Object.fromEntries([...calanlar].map((x) => [x.taban, x.durum || {}]));
