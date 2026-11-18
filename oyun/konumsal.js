// ==== KONUMSAL SES MOTORU (WebView + Web Audio, HRTF) ====
// Demir 1919'da Murat'ın iPhone'da doğruladığı yöntem (18 Kasım 2026, "Ses işi süper oldu"): Expo Go'nun ses kütüphanesinde
// gerçek 3B ses yok; bu yüzden görünmez bir WebView içinde tarayıcının Web Audio API'si çalışır. Her konumlu ses bir PannerNode'dan
// (panningModel 'HRTF': insan başının ve kulak kepçesinin ölçülmüş süzgeçleri) geçer: önde, arkada, sağda, solda olan ses kulaklıkta
// gerçekten oradan gelir. Uzaklık kısması, havanın tizleri yutması, engel ve mağara yankısı burada (JS tarafında) hesaplanır,
// motor yalnızca uygular.
// Ortam katmanları da burada çalar: Web Audio döngüleri örnek doğruluğunda kesintisizdir (expo-audio döngüsü başa dönerken boşluk
// bırakabiliyordu). Yönlü katmanlar (nehir, galeri ormanı, kayalık) kaynağın en yakın noktasına konur; içindeyken yönsüz çalar.
//
// Koordinatlar: oyunda x doğu, y kuzey, yon 0 kuzey ve saat yönünde artar. Web Audio'da X sağ (doğu), Y yukarı, Z güney.
// Dosyalar paketteki ses varlığından base64 olarak okunup WebView'e gönderilir, orada decodeAudioData ile çözülür.
// WebView yoksa (eski APK'larda yerel modül yok: require hata verir) ya da motor 6 saniyede açılmazsa hazir() false kalır ve efekt.js
// eski yollara düşer (APK'da react-native-audio-api, Expo Go'da yönsüz oynatıcı).
import React, { useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';

let WebViewBilesen = null;
try {
  const w = require('react-native-webview');
  WebViewBilesen = w.WebView || w.default || null;
} catch (e) {
  WebViewBilesen = null;
}
let Varlik = null;
try {
  Varlik = require('expo-asset').Asset;
} catch (e) {
  Varlik = null;
}
let Dosya = null;
try {
  Dosya = require('expo-file-system');
} catch (e) {
  Dosya = null;
}

// ---------- WebView içinde çalışan motor ----------
const MOTOR_HTML = `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body><script>
(function(){
  var ctx = null, ana = null, yankiGiris = null, tamponlar = {}, teker = {}, kaynaklar = {}, katmanlar = {}, bekleyen = [];
  function bildir(o){ try { window.ReactNativeWebView.postMessage(JSON.stringify(o)); } catch(e){} }
  function durtu(){
    var sr = ctx.sampleRate, n = Math.floor(sr * 1.6), b = ctx.createBuffer(2, n, sr);
    for (var k = 0; k < 2; k++){
      var v = b.getChannelData(k), s = 12345 + k * 777;
      for (var i = 0; i < n; i++){
        s = (s * 1103515245 + 12345) & 0x7fffffff;
        v[i] = ((s / 0x7fffffff) * 2 - 1) * Math.pow(1 - i / n, 3.2) * (i < sr * 0.012 ? i / (sr * 0.012) : 1);
      }
    }
    return b;
  }
  function baglam(){
    if (ctx) return ctx;
    try { if (navigator.audioSession) navigator.audioSession.type = 'playback'; } catch(e){}
    var C = window.AudioContext || window.webkitAudioContext;
    ctx = new C();
    ana = ctx.createGain(); ana.gain.value = 1; ana.connect(ctx.destination);
    var y = ctx.createConvolver(); y.buffer = durtu(); y.connect(ana);
    yankiGiris = ctx.createGain(); yankiGiris.gain.value = 1; yankiGiris.connect(y);
    var l = ctx.listener;
    if (l.forwardX){ l.forwardX.value = 0; l.forwardY.value = 0; l.forwardZ.value = -1; l.upX.value = 0; l.upY.value = 1; l.upZ.value = 0; }
    return ctx;
  }
  function uyan(){
    baglam();
    if (ctx.state !== 'running' && ctx.resume) ctx.resume().then(function(){ bildir({ t: 'durum', d: ctx.state }); }, function(){});
  }
  setInterval(function(){ if (ctx && ctx.state !== 'running') uyan(); }, 2000);
  function hedefle(p, v, sabit){ var t = ctx.currentTime; try { p.cancelScheduledValues(t); p.setTargetAtTime(v, t, sabit || 0.03); } catch(e){ p.value = v; } }
  function konumla(p, x, y){
    if (p.positionX){ hedefle(p.positionX, x, 0.02); hedefle(p.positionY, 0, 0.02); hedefle(p.positionZ, -y, 0.02); }
    else p.setPosition(x, 0, -y);
  }
  function panner(){
    var p = ctx.createPanner();
    p.panningModel = 'HRTF'; p.distanceModel = 'inverse'; p.refDistance = 1; p.maxDistance = 10000; p.rolloffFactor = 0;
    p.coneInnerAngle = 360; p.coneOuterAngle = 360;
    p.connect(ana);
    return p;
  }
  function teke(ad){
    if (teker[ad]) return teker[ad];
    var t = tamponlar[ad]; if (!t) return null;
    if (t.numberOfChannels < 2){ teker[ad] = t; return t; }
    var m = ctx.createBuffer(1, t.length, t.sampleRate), c = m.getChannelData(0), a = t.getChannelData(0), b = t.getChannelData(1);
    for (var j = 0; j < c.length; j++) c[j] = (a[j] + b[j]) * 0.5;
    teker[ad] = m; return m;
  }
  function yukle(ad, b64){
    baglam();
    var ikili = atob(b64), dizi = new Uint8Array(ikili.length);
    for (var i = 0; i < ikili.length; i++) dizi[i] = ikili.charCodeAt(i);
    var bitti = function(t){
      tamponlar[ad] = t; delete teker[ad];
      bildir({ t: 'yh', ad: ad, sure: t.duration });
      var simdi = Date.now(), kalan = [];
      for (var k = 0; k < bekleyen.length; k++){
        var c = bekleyen[k];
        if (c.ad !== ad) { kalan.push(c); continue; }
        if (c.a === 'o') ortam(c);
        else if (simdi - c.zaman < 2500) cal(c);
      }
      bekleyen = kalan;
    };
    var hata = function(e){ bildir({ t: 'hata', ad: ad, metin: 'Çözülemedi: ' + ad + ' ' + String(e) }); };
    try { var s = ctx.decodeAudioData(dizi.buffer, bitti, hata); if (s && s.catch) s.catch(function(){}); } catch(e){ hata(e); }
  }
  // Tek seferlik konumlu ses: kaynak → alçak geçiren (uzaklık/engel) → kazanç → HRTF → ana; kazançtan yankıya gönderim
  function cal(c){
    var buf = teke(c.ad);
    if (!buf){ c.zaman = Date.now(); bekleyen.push(c); return; }
    sil(c.id);
    var s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain(), y = ctx.createGain(), p = panner();
    s.buffer = buf; s.playbackRate.value = c.h || 1;
    f.type = 'lowpass'; f.Q.value = 0.5; f.frequency.value = c.z || 18000;
    g.gain.value = c.s; y.gain.value = c.r || 0;
    konumla(p, c.x, c.y);
    s.connect(f); f.connect(g); g.connect(p); g.connect(y); y.connect(yankiGiris);
    var k = { s: s, f: f, g: g, y: y, p: p };
    kaynaklar[c.id] = k;
    s.onended = function(){ if (kaynaklar[c.id] === k) sil(c.id); };
    s.start();
  }
  function guncelle(c){
    var k = kaynaklar[c.id]; if (!k) return;
    konumla(k.p, c.x, c.y);
    hedefle(k.g.gain, c.s); hedefle(k.f.frequency, c.z || 18000); hedefle(k.y.gain, c.r || 0, 0.05);
    if (c.h) hedefle(k.s.playbackRate, c.h, 0.05);
  }
  function sil(id){
    var k = kaynaklar[id]; if (!k) return;
    delete kaynaklar[id];
    try { k.s.stop(); } catch(e){}
    try { k.s.disconnect(); k.f.disconnect(); k.g.disconnect(); k.y.disconnect(); k.p.disconnect(); } catch(e){}
  }
  // Ortam katmanı: döngü. Doğrudan yol (kaydın kendi stereo hâli, yönsüz) ve konumlu yol (tek kanal, HRTF) birlikte çalar;
  // g (0-1) konumlu payıdır: kaynağın içindeyken 0, uzaklaştıkça 1.
  function ortam(c){
    var x = katmanlar[c.ad];
    if (!x){
      if (!(c.s > 0.001)) return;
      var buf = tamponlar[c.ad];
      if (!buf){
        // Ortam katmanında yalnız son istek beklesin (yükleme uzun sürse de katman sonunda açılır)
        bekleyen = bekleyen.filter(function(b){ return !(b.a === 'o' && b.ad === c.ad); });
        bekleyen.push(c); return;
      }
      var t0 = ctx.currentTime + 0.05;
      var s = ctx.createBufferSource(), d = ctx.createGain();
      s.buffer = buf; s.loop = true; d.gain.value = 0; s.connect(d); d.connect(ana); s.start(t0);
      x = katmanlar[c.ad] = { s: s, d: d, t0: t0, sure: buf.duration, sifir: 0 };
    }
    var g = c.x == null ? 0 : Math.max(0, Math.min(1, c.g || 0));
    if (g > 0 && !x.pk){
      var m = teke(c.ad), s2 = ctx.createBufferSource(), pg = ctx.createGain(), p = panner();
      s2.buffer = m; s2.loop = true; pg.gain.value = 0; s2.connect(pg); pg.connect(p);
      var t = ctx.currentTime + 0.02, ofs = ((t - x.t0) % x.sure + x.sure) % x.sure;
      s2.start(t, ofs);
      x.pk = s2; x.pg = pg; x.p = p;
    }
    if (x.p && c.x != null) konumla(x.p, c.x, c.y);
    var a = g * Math.PI / 2;
    hedefle(x.d.gain, c.s * Math.cos(a), 0.6);
    if (x.pg) hedefle(x.pg.gain, c.s * Math.sin(a), 0.6);
    x.sifir = c.s > 0.001 ? 0 : (x.sifir || Date.now());
  }
  function katmanBirak(ad){
    var x = katmanlar[ad]; if (!x) return;
    delete katmanlar[ad];
    try { x.s.stop(); x.s.disconnect(); x.d.disconnect(); } catch(e){}
    if (x.pk) try { x.pk.stop(); x.pk.disconnect(); x.pg.disconnect(); x.p.disconnect(); } catch(e){}
    // Ortam kayıtları büyük (30 saniyelik stereo kayıt çözülünce ~10 MB): susunca bellekten atılır, gerekince yeniden yüklenir
    delete tamponlar[ad]; delete teker[ad];
    bildir({ t: 'yx', ad: ad });
  }
  setInterval(function(){
    var simdi = Date.now();
    for (var ad in katmanlar){ var x = katmanlar[ad]; if (x.sifir && simdi - x.sifir > 15000) katmanBirak(ad); }
  }, 3000);
  function dinleyici(c){
    var l = ctx.listener, fx = Math.sin(c.o), fz = -Math.cos(c.o);
    if (l.positionX){
      hedefle(l.positionX, c.x, 0.02); hedefle(l.positionY, 0, 0.02); hedefle(l.positionZ, -c.y, 0.02);
      hedefle(l.forwardX, fx, 0.02); hedefle(l.forwardY, 0, 0.02); hedefle(l.forwardZ, fz, 0.02);
    } else { l.setPosition(c.x, 0, -c.y); l.setOrientation(fx, 0, fz, 0, 1, 0); }
  }
  function tani(){
    var o = {};
    for (var ad in katmanlar){ var x = katmanlar[ad]; o[ad] = { d: Math.round(x.d.gain.value * 100) / 100, p: x.pg ? Math.round(x.pg.gain.value * 100) / 100 : 0 }; }
    var k = {};
    for (var id in kaynaklar) k[id] = Math.round(kaynaklar[id].g.gain.value * 100) / 100;
    bildir({ t: 'tani', katmanlar: o, kaynaklar: k, durum: ctx ? ctx.state : 'yok', tampon: Object.keys(tamponlar).length });
  }
  window.motor = function(liste){
    for (var i = 0; i < liste.length; i++){
      var c = liste[i];
      try {
        if (c.a === 'b') { uyan(); bildir({ t: 'durum', d: ctx.state }); }
        else if (!ctx) { baglam(); }
        if (c.a === 'y') yukle(c.ad, c.v);
        else if (c.a === 'd') dinleyici(c);
        else if (c.a === 'c') { if (ctx.state !== 'running') uyan(); cal(c); }
        else if (c.a === 'u') guncelle(c);
        else if (c.a === 'x') sil(c.id);
        else if (c.a === 'o') ortam(c);
        else if (c.a === 'ox') { for (var ad in katmanlar) katmanBirak(ad); }
        else if (c.a === 'sus') { for (var id in kaynaklar) sil(id); }
        else if (c.a === 'tani') tani();
      } catch(e){ bildir({ t: 'hata', metin: String(e && e.message || e) }); }
    }
  };
  bildir({ t: 'yuklendi' });
})();
</script></body></html>`;

// ---------- JS tarafı ----------
const durum = { etkin: true, genel: 1, magara: false, motor: WebViewBilesen && Varlik && Dosya ? 'aciliyor' : 'yok' }; // motor: yok | aciliyor | hazir | hata
let web = null; // WebView ref
let hazirMi = false;
let kuyruk = [];
let sayac = null;
let sonDinleyici = null;
let acilisSuresi = null;
const yuklenen = new Map(); // ad → 'yukleniyor' | 'hazir' | 'hata'
const sureler = new Map(); // ad → saniye
const calanlar = new Map(); // id → { ad, kim, hedef, ses, engelF, engel, engelZaman, bitis, sonM, sonZaman, hizOrt }
let idSayac = 0;
let taniDinle = null;
const hataDinleyiciler = [];
const EN_COK_SES = 16;
const TIZ = 18000;

export const basarisiz = (ad) => yuklenen.get(ad) === 'hata';
export const hazir = () => hazirMi && durum.etkin;
export const motorDurumu = () => (durum.etkin ? durum.motor : 'kapali');
export const kullanilabilir = () => !!(WebViewBilesen && Varlik && Dosya);
export function ayarla({ etkin, genel, magara } = {}) {
  if (typeof etkin === 'boolean') {
    if (!etkin && durum.etkin) {
      gonder({ a: 'sus' });
      gonder({ a: 'ox' });
      calanlar.clear();
    }
    durum.etkin = etkin;
  }
  if (typeof genel === 'number') durum.genel = genel;
  if (typeof magara === 'boolean') durum.magara = magara;
}
export function hataDinle(f) {
  hataDinleyiciler.push(f);
}

function gonder(c) {
  // Motor yoksa ya da açılamadıysa komut biriktirme (büyük ses dosyaları bellekte kalmasın)
  if (!WebViewBilesen || durum.motor === 'hata' || durum.motor === 'yok') return;
  kuyruk.push(c);
  if (!sayac) sayac = setInterval(adim, 60);
}
function bosalt() {
  if (!kuyruk.length || !web) return;
  const l = kuyruk;
  kuyruk = [];
  try {
    web.injectJavaScript('window.motor && window.motor(' + JSON.stringify(l) + '); true;');
  } catch (e) {}
}

// Paketteki ses varlığını base64 olarak okur (Expo Go'da varlık önce telefona indirilir)
async function base64Oku(kaynak) {
  const v = Varlik.fromModule(kaynak);
  await v.downloadAsync();
  const uri = v.localUri || v.uri;
  if (Dosya.File) return new Dosya.File(uri).base64();
  return Dosya.readAsStringAsync(uri, { encoding: 'base64' });
}
function yukle(ad, kaynak) {
  const d = yuklenen.get(ad);
  if (d === 'hazir' || d === 'yukleniyor') return;
  if (!kaynak || !Varlik || !Dosya || durum.motor === 'hata' || durum.motor === 'yok') return;
  yuklenen.set(ad, 'yukleniyor');
  base64Oku(kaynak)
    .then((v) => {
      // Motor çözünce 'yh' bildirir; o zamana kadar 'yukleniyor' kalır
      gonder({ a: 'y', ad, v });
    })
    .catch((e) => {
      yuklenen.set(ad, 'hata');
      hataBildir('Ses dosyası okunamadı: ' + ad + ' ' + String((e && e.message) || e));
    });
}
export function onYukle(liste) {
  // liste: [[ad, kaynak], ...]
  for (const [ad, k] of liste) yukle(ad, k);
}
function hataBildir(m) {
  hataDinleyiciler.forEach((f) => {
    try {
      f(m);
    } catch (e) {}
  });
}

const uzaklikDuzeyi = (m) => (m < 3 ? 1 : Math.max(0.05, Math.pow(3 / m, 0.85)));
function degerler(x, m) {
  const engel = x.engel;
  const v = x.ses * uzaklikDuzeyi(m) * durum.genel * (engel ? 0.6 : 1);
  let tiz = TIZ * Math.pow(0.5, m / 90);
  if (engel) tiz = Math.min(tiz, 850);
  if (durum.magara) tiz = Math.min(tiz, 9000);
  const yanki = Math.min(0.6, (durum.magara ? 0.45 : 0.04 + 0.22 * Math.min(1, m / 90)) * v * (engel ? 1.4 : 1));
  return { s: Math.round(v * 1000) / 1000, z: Math.round(Math.max(300, tiz)), r: Math.round(yanki * 1000) / 1000 };
}
function kaynakKomutu(id, x, ilk) {
  const dx = x.hedef.x - x.kim.x;
  const dy = x.hedef.y - x.kim.y;
  const m = Math.hypot(dx, dy);
  if (x.engelF && (ilk || Date.now() - (x.engelZaman || 0) > 250)) {
    try {
      x.engel = !!x.engelF();
    } catch (e) {
      x.engel = false;
    }
    x.engelZaman = Date.now();
  }
  const c = { a: ilk ? 'c' : 'u', id, x: Math.round(x.hedef.x * 100) / 100, y: Math.round(x.hedef.y * 100) / 100, ...degerler(x, m) };
  // Doppler: yaklaşan kaynağın perdesi yükselir, uzaklaşanınki düşer (oyunun hızlarına göre biraz abartılı)
  const sn = Date.now() / 1000;
  if (x.sonM != null && sn > x.sonZaman + 0.03) {
    const vr = (m - x.sonM) / (sn - x.sonZaman);
    const hiz = Math.max(0.9, Math.min(1.1, 1 - (vr / 340) * 2));
    x.hizOrt = x.hizOrt * 0.7 + hiz * 0.3;
    c.h = Math.round(x.hizOrt * 1000) / 1000;
  }
  if (ilk) c.ad = x.ad;
  x.sonM = m;
  x.sonZaman = sn;
  x.durum = { m: Math.round(m * 10) / 10, duzey: c.s, tiz: c.z, engel: !!x.engel };
  return c;
}
function adim() {
  const simdi = Date.now();
  if (hazirMi && calanlar.size) {
    let kim = null;
    for (const [id, x] of calanlar) {
      if (simdi > x.bitis) {
        calanlar.delete(id);
        continue;
      }
      kim = x.kim;
      gonder(kaynakKomutu(id, x, false));
    }
    if (kim) dinleyiciGonder(kim);
  }
  bosalt();
  if (!calanlar.size && !kuyruk.length) {
    clearInterval(sayac);
    sayac = null;
  }
}
function dinleyiciGonder(kim) {
  const c = { a: 'd', x: Math.round(kim.x * 100) / 100, y: Math.round(kim.y * 100) / 100, o: Math.round((kim.yon || 0) * 1000) / 1000 };
  if (sonDinleyici && sonDinleyici.x === c.x && sonDinleyici.y === c.y && sonDinleyici.o === c.o) return;
  sonDinleyici = c;
  kuyruk.push(c);
}

// Konumlu sesi çalar. ad: ses adı, kaynak: require numarası, kim { x, y, yon } (oyuncu), hedef { x, y } (çalarken izlenir).
// Döndürür: çalma isteği gönderildiyse true.
export function cal(ad, kaynak, kim, hedef, { ses = 1, engelF = null, hiz = 1 } = {}) {
  if (!hazir() || !kaynak || !kim || !hedef) return false;
  if (yuklenen.get(ad) === 'hata') return false;
  yukle(ad, kaynak);
  // Aynı ses aynı anda iki kez çalmasın; en eski ses sınırı aşınca kesilir
  for (const [id, x] of calanlar)
    if (x.ad === ad) {
      calanlar.delete(id);
      gonder({ a: 'x', id });
    }
  if (calanlar.size >= EN_COK_SES) {
    const [ilk] = calanlar.keys();
    calanlar.delete(ilk);
    gonder({ a: 'x', id: ilk });
  }
  const id = 's' + ++idSayac;
  const sure = sureler.get(ad) || 5;
  const x = { ad, kim, hedef, ses, engelF, engel: false, bitis: Date.now() + (sure / Math.max(0.5, hiz)) * 1000 + 1800, sonM: null, sonZaman: 0, hizOrt: hiz };
  dinleyiciGonder(kim);
  const c = kaynakKomutu(id, x, true);
  c.h = hiz;
  gonder(c);
  calanlar.set(id, x);
  if (!sayac) sayac = setInterval(adim, 60);
  return true;
}
export function hepsiniSustur() {
  calanlar.clear();
  gonder({ a: 'sus' });
}
export const ortamSon = () => Object.fromEntries([...ortamOnceki].map(([a, c]) => [a, c.s]));
export const durumTani = () => Object.fromEntries([...calanlar.values()].map((x) => [x.ad, x.durum || {}]));

// Ortam katmanları. liste: [{ ad, kaynak, ses (0-1, son düzey), x, y (konum, yoksa yönsüz), guc (0-1 konumlu payı) }]
// Listede olmayan katmanlar kısılır; 15 saniye susan katman motor tarafından bırakılır.
let ortamOnceki = new Map(); // ad → son gönderilen
export function ortam(liste, kim) {
  if (!hazir()) return;
  const simdiki = new Map();
  for (const k of liste) {
    if (!(k.ses > 0.001) && !ortamOnceki.has(k.ad)) continue;
    yukle(k.ad, k.kaynak);
    const c = { a: 'o', ad: k.ad, s: Math.round(Math.max(0, Math.min(1, k.ses)) * 1000) / 1000 };
    if (k.x != null) {
      c.x = Math.round(k.x * 10) / 10;
      c.y = Math.round(k.y * 10) / 10;
      c.g = Math.round(Math.max(0, Math.min(1, k.guc || 0)) * 100) / 100;
    }
    simdiki.set(k.ad, c);
  }
  for (const [ad] of ortamOnceki) if (!simdiki.has(ad)) simdiki.set(ad, { a: 'o', ad, s: 0 });
  for (const [ad, c] of simdiki) {
    const o = ortamOnceki.get(ad);
    if (o && o.s === c.s && o.x === c.x && o.y === c.y && o.g === c.g) continue;
    gonder(c);
  }
  // Susturulmuş katmanlar bir kez 0 gönderildikten sonra izlenmez
  ortamOnceki = new Map([...simdiki].filter(([, c]) => c.s > 0.001));
  if (kim) dinleyiciGonder(kim);
}
export function ortamDurdur() {
  if (!ortamOnceki.size) return;
  ortamOnceki = new Map();
  gonder({ a: 'ox' });
}
// Tarayıcı denemeleri için: motordan çalanların düzeylerini ister; cevap taniDinle'ye gelir
export function tani(f) {
  taniDinle = f;
  gonder({ a: 'tani' });
}

function mesaj(e) {
  let o = null;
  try {
    o = JSON.parse(e.nativeEvent.data);
  } catch (er) {
    return;
  }
  if (!o) return;
  if (o.t === 'yuklendi') {
    durum.motor = 'aciliyor';
    kuyruk.unshift({ a: 'b' });
    bosalt();
  } else if (o.t === 'durum') {
    if (o.d === 'running') {
      if (!hazirMi) {
        // Geç açıldıysa (6 saniyeden sonra) yarım kalan yüklemeler yeniden istenebilsin
        if (durum.motor === 'hata') yuklenen.clear();
        hazirMi = true;
        durum.motor = 'hazir';
        clearTimeout(acilisSuresi);
      }
    }
  } else if (o.t === 'yh') {
    yuklenen.set(o.ad, 'hazir');
    if (o.sure) sureler.set(o.ad, o.sure);
  } else if (o.t === 'yx') {
    yuklenen.delete(o.ad);
  } else if (o.t === 'hata') {
    if (o.ad) yuklenen.set(o.ad, 'hata');
    hataBildir('3B ses motoru: ' + o.metin);
  } else if (o.t === 'tani') {
    if (taniDinle) taniDinle(o);
  }
}

// Görünmez WebView. App'in kökünde bir kez kurulur.
export function Motor() {
  const ref = useRef(null);
  useEffect(() => {
    if (!WebViewBilesen) return undefined;
    durum.motor = 'aciliyor';
    acilisSuresi = setTimeout(() => {
      if (!hazirMi) {
        durum.motor = 'hata';
        kuyruk = [];
        yuklenen.clear();
        hataBildir('3B ses motoru 6 saniyede açılmadı; eski ses yolu kullanılıyor.');
      }
    }, 6000);
    return () => {
      clearTimeout(acilisSuresi);
      hazirMi = false;
      web = null;
    };
  }, []);
  if (!WebViewBilesen || !Varlik || !Dosya) return null;
  return (
    <View style={stiller.gizli} pointerEvents="none" importantForAccessibility="no-hide-descendants" accessibilityElementsHidden>
      <WebViewBilesen
        ref={(r) => {
          ref.current = r;
          web = r;
        }}
        originWhitelist={['*']}
        source={{ html: MOTOR_HTML }}
        javaScriptEnabled
        mediaPlaybackRequiresUserAction={false}
        allowsInlineMediaPlayback
        onMessage={mesaj}
        onError={() => {
          durum.motor = 'hata';
          hazirMi = false;
        }}
        onContentProcessDidTerminate={() => {
          // iOS ses işlemini sonlandırırsa (bellek) motor yeniden yüklenir; o arada eski yol çalar
          hazirMi = false;
          durum.motor = 'aciliyor';
          yuklenen.clear();
          ortamOnceki = new Map();
          calanlar.clear();
          try {
            ref.current && ref.current.reload();
          } catch (er) {}
        }}
      />
    </View>
  );
}

const stiller = StyleSheet.create({
  gizli: { position: 'absolute', width: 2, height: 2, opacity: 0, left: 0, top: 0 },
});
