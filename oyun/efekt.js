// ==== SES EFEKTLERİ (3B konumlu) ====
// Hayvan sesleri ElevenLabs ile üretildi. Konumlu sesler (yonlu) tek kayıttan, çalarken gerçek zamanlı yönlendirilir: aşağıdaki
// KONUMLU SES MOTORU bölümüne ve uzamsal.js'e bakın.
// Ortam sesi (haritanın rüzgârı, kuşları...) ayrı bir döngü kanalında çalar.
import { createAudioPlayer } from 'expo-audio';
import { SESLER } from './sesler.js';
import { konusuyorMu, efektCalindi, konusmaBaslarken, ayarlar as sesAyarlari } from './ses.js';
import * as U from './uzamsal.js';
import * as K from './konumsal.js';

const durum = { acik: true, genel: 0.9, kis: true, ortam: 0.35 };
const oynaticilar = {};

// Yaklaşık süreler (saniye). Konuşma, çalan kısa efekt bitince başlar.
const SURE = {
  sopa: 0.5, bicak: 0.45, kilic: 0.6, balta: 0.55, mizrak: 0.5, yay: 0.7, iska: 0.35, kritik: 0.45, altin: 0.6, dustu: 0.8,
  seviye: 1.8, yarali: 0.45, adim1: 0.07, adim2: 0.07, carpma: 0.15, hata: 0.18, olum: 1.4, dogus: 0.9, odak: 0.02,
  sinir: 0.12, etkinles: 0.1, kalp: 0.32, isinlan: 1.2, iksir: 0.6, hedef: 0.18, sonar: 0.09,
  adim_ot: 0.05, adim_toprak: 0.05, adim_camur: 0.05, adim_su: 0.05, adim_kaya: 0.05, adim_yaprak: 0.05, adim_magara: 0.05,
  donus_tik: 0.02, hedef_onde: 0.1,
  kosu_toynak: 0.05, kosu_hafif: 0.05, kosu_agir: 0.05, kosu_pati: 0.05,
  dron: 0.05, kurek: 0.1,
  // Ses efektleri genişlemesi: hayvanların gündelik sesleri ve eylem sesleri arka planda çalar (konuşmayı bekletmez)
  menu_odak: 0.02, menu_sec: 0.1, menu_geri: 0.1, menu_sinir: 0.12, deklansor: 0.2, durbun_odak: 0.05,
  kayit_bas: 0.15, kayit_bit: 0.15, video_kamera: 0.15, bildirim_mesaj: 0.3, bildirim_gorev: 0.4, telsiz: 0.3, kesif: 0.6, kapi_bin: 0.5, kapi_in: 0.5,
  gok: 0.3, // gök gürültüsü uzun ama arka plan sesi; konuşmayı bekletmesin
  gnu: 1.5, cita: 1.2, impala: 1.4, yabankopegi: 1.6, babun: 1.4, yarasa: 0.4,
  fil: 0.7, zebra: 0.8, suaygiri: 0.8, manda: 1.8, ceylan: 1.4, zurafa: 0.8,
  kurt: 1.6, tilki: 0.9, domuz: 1.4, ayi: 1.4, yilan: 1.2, akrep: 1.0, sirtlan: 1.2, timsah: 1.8, leopar: 1.4, kartal: 1.2, aslan: 1.8, gergedan: 1.2,
};
// Küçük canlı çağrıları (k_) arka plan sesidir; konuşmayı bekletmez (Aşama 17)
const sure = (ad) => SURE[ad] || SURE[ad.replace(/_\d+a?$/, '')] || (ad.startsWith('k_') || ad.startsWith('h_') ? 0.05 : 0.4);

konusmaBaslarken(() => {
  Object.entries(oynaticilar).forEach(([ad, p]) => {
    if (sure(ad) > 0.9) {
      try {
        p.pause();
      } catch (e) {}
    }
  });
});

export function efektAyarla({ acik, genel, kis, ortam, hrtf } = {}) {
  if (typeof acik === 'boolean') {
    durum.acik = acik;
    if (!acik) K.hepsiniSustur();
  }
  if (typeof hrtf === 'boolean') K.ayarla({ etkin: hrtf });
  if (typeof kis === 'boolean') durum.kis = kis;
  if (typeof genel === 'number') {
    durum.genel = genel;
    K.ayarla({ genel });
  }
  if (typeof ortam === 'number') durum.ortam = ortam;
  if (Object.keys(katmanlar).length && !katmanSayac) katmanSayac = setInterval(katmanAdim, 100);
}

function oynatici(ad) {
  let p = oynaticilar[ad];
  if (p) return p;
  const k = SESLER[ad];
  if (!k) return null;
  try {
    // keepAudioSessionActive: her efektte ses oturumu açılıp kapanınca konuşma ve VoiceOver sesi dalgalanıyordu.
    p = createAudioPlayer(k, { keepAudioSessionActive: true });
    oynaticilar[ad] = p;
  } catch (e) {
    p = null;
  }
  return p;
}

export function onYukle(adlar) {
  adlar.forEach((a) => oynatici(a));
}

// Oynatıcıyı başa sarıp çalar. iOS'ta seekTo eşzamansızdır: sona varmış bir oynatıcıda seekTo(0) bitmeden play() denenirse
// AVPlayer dosyanın sonunda kalıp hiç ses vermeyebiliyordu. Murat (13 Kasım) yürürken "üç dört adım, yarım saniye boşluk, yine üç
// dört adım" duydu: dört adım dosyası sırayla yeniden kullanıldığı için bazı adımlar bu yüzden düşüyordu. Artık başa sarma
// bittikten sonra çalınır (en geç 120 ms), çalma bitince de oynatıcı bir sonraki sefer için önceden başa sarılır.
const geriSarZaman = new Map(); // oynatıcı → bekleyen başa sarma
function basaSarVeCal(p) {
  let oldu = false;
  const oynat = () => {
    if (oldu) return;
    oldu = true;
    try {
      p.play();
    } catch (e) {}
  };
  try {
    if (p.playing) p.pause();
    const s = p.seekTo(0);
    if (s && typeof s.then === 'function') {
      s.then(oynat, oynat);
      setTimeout(oynat, 120);
    } else oynat();
  } catch (e) {
    oynat();
  }
  // Önceden başa sar: çalma bittikten hemen sonra (oynatıcı sonda beklemesin)
  const sure = Number.isFinite(p.duration) && p.duration > 0 ? p.duration : 1;
  clearTimeout(geriSarZaman.get(p));
  geriSarZaman.set(p, setTimeout(() => {
    try {
      if (!p.playing) p.seekTo(0);
    } catch (e) {}
  }, sure * 1000 + 150));
}

// arkaPlan: adım gibi kısa ve sürekli sesler oyun konuşurken de çalar (yoksa yürürken rehber konuştukça adımlar kesiliyordu)
export function cal(ad, ses = 1, arkaPlan = false) {
  if (!durum.acik) return;
  const voiceover = sesAyarlari().kip === 'voiceover';
  if (durum.kis && !voiceover && !arkaPlan && konusuyorMu()) return;
  const p = oynatici(ad);
  if (!p) return;
  try {
    p.volume = Math.max(0, Math.min(1, ses * durum.genel));
    basaSarVeCal(p);
    if (durum.kis && !voiceover && !arkaPlan) efektCalindi(Math.min(sure(ad), 0.6) * 1000);
  } catch (e) {}
}

// ==== KONUMLU SES MOTORU ====
// Her konumlu ses tek bir kayıttan (ad.m4a) gelir. Oyunun kendi derlemesinde (APK, iPhone derlemesi) gerçek zamanlı 3B ses
// motoru çalar: uzamsal.js (kulaklar arası zaman ve düzey farkı, baş gölgesi, arkadan gelen sesin boğukluğu, engel, mağara
// yankısı, Doppler). Expo Go'da o kütüphane yoktur: ses yalnız uzaklığa göre kısılarak yönsüz çalar.
let engelDenetle = null; // (kim, hedef) => true: arada sesi boğan bir engel var
export function engelAyarla(f) {
  engelDenetle = typeof f === 'function' ? f : null;
}
export function magaraAyarla(acik) {
  U.ayarla({ magara: !!acik });
  K.ayarla({ magara: !!acik });
}
// 'hrtf' (WebView + Web Audio, kulaklıkta gerçek 3B), 'gercek3B' (APK'daki react-native-audio-api), 'yok' (yönsüz)
export const sesMotoru = () => (K.hazir() ? 'hrtf' : U.motor());
export const konumsalMotorDurumu = () => K.motorDurumu();
export const KonumsalMotor = K.Motor;
export const konumsalHataDinle = (f) => K.hataDinle(f);
export const konumsalDurumSozu = () => K.durumSozu();
export const konumsalDeneme = (ad, adim) => K.deneme(ad, SESLER[ad], adim);
const calanYonsuz = new Map(); // Expo Go: taban → { kim, hedef, ses, p, bitis }
let yonsuzSayac = null;
const uzaklikDuzeyi = (m) => (m < 3 ? 1 : Math.max(0.06, Math.pow(3 / m, 0.85)));
function yonsuzAdim() {
  const simdi = Date.now();
  for (const [taban, x] of calanYonsuz) {
    if (simdi > x.bitis) {
      calanYonsuz.delete(taban);
      continue;
    }
    try {
      x.p.volume = Math.min(1, x.ses * uzaklikDuzeyi(Math.hypot(x.hedef.x - x.kim.x, x.hedef.y - x.kim.y)) * durum.genel);
    } catch (e) {}
  }
  if (!calanYonsuz.size) {
    clearInterval(yonsuzSayac);
    yonsuzSayac = null;
  }
}
// Konumlu ses. kim: { x, y, yon } (çoğunlukla oyuncu nesnesinin kendisi), hedef: { x, y } (hayvan nesnesi olabilir; çalarken
// izlenir). Döndürür: duyulduysa true
export function yonlu(taban, kim, hedef, ses = 1, duyma = 45, zorla = false) {
  if (!durum.acik || !kim || !hedef) return false;
  const m = Math.hypot(hedef.x - kim.x, hedef.y - kim.y);
  if (!(m <= duyma)) return false;
  const voiceover = sesAyarlari().kip === 'voiceover';
  const arkaPlan = taban.startsWith('k_') || taban.startsWith('h_') || taban.startsWith('kosu_');
  if (durum.kis && !voiceover && !arkaPlan && !zorla && konusuyorMu()) return true;
  const kaynak = SESLER[taban];
  if (!kaynak) return false;
  let uzun = 1;
  const engelK = engelDenetle ? () => m > 2 && engelDenetle(kim, hedef) : null;
  if (K.hazir() && K.cal(taban, kaynak, kim, hedef, { ses, engelF: engelK })) {
    // 3B (HRTF) motorunda çaldı
  } else if (U.hazir()) {
    U.ayarla({ genel: durum.genel });
    const engelF = engelDenetle ? () => m > 2 && engelDenetle(kim, hedef) : null;
    if (!U.cal(taban, kaynak, kim, hedef, { ses, engelF })) return false;
  } else {
    const p = oynatici(taban);
    if (!p) return false;
    try {
      p.volume = Math.min(1, ses * uzaklikDuzeyi(m) * durum.genel);
      basaSarVeCal(p);
      uzun = Number.isFinite(p.duration) && p.duration > 0 ? p.duration : 4;
      calanYonsuz.set(taban, { kim, hedef, ses, p, bitis: Date.now() + uzun * 1000 + 200 });
      if (!yonsuzSayac) yonsuzSayac = setInterval(yonsuzAdim, 100);
    } catch (e) {
      return false;
    }
  }
  if (!/^(sonar|adim|kapi|tel_|tuzak|tasma)/.test(taban)) sonKonumlu = { taban, hedef, x: hedef.x, y: hedef.y, zaman: Date.now() };
  if (durum.kis && !voiceover && !arkaPlan && !zorla) efektCalindi(Math.min(sure(taban), 0.6) * 1000);
  return true;
}
// Sık çalınacak konumlu seslerin kayıtlarını önceden çözer (gerçek 3B motorunda ilk çalışta gecikme olmasın)
export function konumluOnYukle(adlar) {
  if (K.kullanilabilir()) K.onYukle(adlar.filter((a) => SESLER[a]).map((a) => [a, SESLER[a]]));
  U.onYukle(adlar.map((a) => SESLER[a]).filter(Boolean));
}
// Son duyulan konumlu ses (oyuncu "Sese dön" diyebilsin diye): { taban, hedef, x, y, zaman }
let sonKonumlu = null;
export const sonDuyulan = () => sonKonumlu;
// Tarayıcı denemeleri için: çalan konumlu seslerin kulak düzeyleri
export const konumluDurum = () => (K.hazir() ? K.durumTani() : U.hazir() ? U.durum() : Object.fromEntries([...calanYonsuz].map(([a, x]) => [a, { duzey: Math.round(x.p.volume * 100) / 100 }])));

// Haritanın ortam sesi: katmanlı döngüler. Savanın (ya da yağmurun) temel sesi her zaman çalar; nehir, galeri ormanı ve
// kayalık katmanları oraya uzaklığa göre yükselir ve birbirine karışır. Yönlü katmanlar (<ad>_sol / <ad>_sag) birlikte
// başlatılır, düzeyleri kaynağın yönüne göre ayarlanır. Düzey değişimleri 100 ms'lik adımlarla, tam geçiş 2 saniyede.
const ORTAM_ADIM = 0.05;
const katmanlar = {}; // ad -> { p, ses, sifir (ms) }
let katmanHedef = {};
let katmanSayac = null;
const esi = (ad) => (ad.endsWith('_sol') ? ad.slice(0, -4) + '_sag' : ad.endsWith('_sag') ? ad.slice(0, -4) + '_sol' : null);
function katmanAdim() {
  const simdi = Date.now();
  let devam = false;
  for (const [ad, x] of Object.entries(katmanlar)) {
    const hedef = durum.acik ? Math.max(0, Math.min(1, katmanHedef[ad] || 0)) * durum.ortam : 0;
    const yeni = x.ses + Math.max(-ORTAM_ADIM, Math.min(ORTAM_ADIM, hedef - x.ses));
    if (Math.abs(yeni - x.ses) > 1e-4) {
      x.ses = yeni;
      try {
        x.p.volume = yeni;
      } catch (e) {}
    }
    if (x.ses !== hedef) devam = true;
    if (x.ses <= 0.001 && hedef === 0) x.sifir = x.sifir || simdi;
    else x.sifir = 0;
  }
  // 15 saniyedir susan katmanlar bırakılır (yönlü çiftin ikisi birlikte, eşzamanlı kalsınlar)
  for (const [ad, x] of Object.entries(katmanlar)) {
    if (!x.sifir || simdi - x.sifir < 15000) continue;
    const e = esi(ad);
    if (e && katmanlar[e] && (!katmanlar[e].sifir || simdi - katmanlar[e].sifir < 15000)) continue;
    for (const a of [ad, e]) {
      if (!a || !katmanlar[a]) continue;
      try {
        katmanlar[a].p.pause();
        katmanlar[a].p.release();
      } catch (er) {}
      delete katmanlar[a];
    }
  }
  if (!devam && !Object.values(katmanlar).some((x) => x.sifir)) {
    clearInterval(katmanSayac);
    katmanSayac = null;
  }
}
function katmanKur(ad) {
  const k = SESLER[ad];
  if (!k) return null;
  try {
    const p = createAudioPlayer(k, { keepAudioSessionActive: true });
    p.loop = true;
    p.volume = 0;
    return { p, ses: 0, sifir: 0 };
  } catch (e) {
    return null;
  }
}
// hedef: { ortam_gunduz: 0.4, ortam_nehir_sol: 0.7, ortam_nehir_sag: 0.3, ... } (0-1; ortam düzeyiyle çarpılır)
// hedef.__konum (sayılmayan alan): { <ad>: { x, y, guc } } yönlü katmanların kaynak noktası. 3B motorda (HRTF) yönlü çift
// (_sol/_sag) yerine tek kayıt o noktaya konur.
function hrtfOrtam(hedef, kim) {
  const konum = (hedef && hedef.__konum) || {};
  const tablo = {};
  const eski = {}; // 3B motorda yüklenemeyen katmanlar eski oynatıcılarla çalar
  for (const [ad, v] of Object.entries(hedef || {})) {
    const e = esi(ad);
    const taban = e ? ad.slice(0, -4) : ad;
    if (K.basarisiz(taban) || !SESLER[taban]) {
      eski[ad] = v;
      continue;
    }
    if (!tablo[taban]) tablo[taban] = { ad: taban, guc2: 0 };
    tablo[taban].guc2 += v * v;
  }
  const liste = [];
  for (const t of Object.values(tablo)) {
    const k = konum[t.ad];
    liste.push({ ad: t.ad, kaynak: SESLER[t.ad], ses: durum.acik ? Math.sqrt(t.guc2) * durum.ortam : 0, ...(k ? { x: k.x, y: k.y, guc: k.guc } : {}) });
  }
  K.ortam(liste, kim);
  return eski;
}
export function ortamKatmanlar(hedef, kim) {
  if (K.hazir()) hedef = hrtfOrtam(hedef, kim);
  katmanHedef = hedef || {};
  // Yeni katmanlar aynı anda başlatılır (yönlü çiftin iki yarısı eşzamanlı çalsın)
  const yeniler = [];
  for (const [ad, v] of Object.entries(katmanHedef)) {
    if (v > 0 && !katmanlar[ad]) {
      const x = katmanKur(ad);
      if (x) {
        katmanlar[ad] = x;
        yeniler.push(x);
      }
      const e = esi(ad);
      if (e && !katmanlar[e]) {
        const y = katmanKur(e);
        if (y) {
          katmanlar[e] = y;
          yeniler.push(y);
        }
      }
    }
  }
  yeniler.forEach((x) => {
    try {
      x.p.play();
    } catch (e) {}
  });
  if (!katmanSayac) katmanSayac = setInterval(katmanAdim, 100);
}
export function ortamBaslat(ad) {
  ortamKatmanlar({ [ad]: 1 });
}
export function ortamDurdur(yavas) {
  K.ortamDurdur();
  katmanHedef = {};
  if (yavas) {
    if (!katmanSayac) katmanSayac = setInterval(katmanAdim, 100);
    return;
  }
  for (const a of Object.keys(katmanlar)) {
    try {
      katmanlar[a].p.pause();
      katmanlar[a].p.release();
    } catch (e) {}
    delete katmanlar[a];
  }
}
// Test ve tanı için: çalan katmanlar ve düzeyleri
export const ortamDurumu = () => ({ ...(K.hazir() ? K.ortamSon() : {}), ...Object.fromEntries(Object.entries(katmanlar).map(([a, x]) => [a, Math.round(x.ses * 100) / 100])) });

// Aracın motor sesi (Kayıp Okyanus'taki itici döngüsü gibi): sürerken sürekli çalar, düzeyi ve perdesi hıza göre.
let motorOynatici = null;
let motorSon = { ses: -1, hiz: -1 };
export function motorDuzey(oran, perde = 1, duzey = 1) {
  if (!durum.acik) return motorDurdur();
  try {
    if (!motorOynatici) {
      const k = SESLER.motor;
      if (!k) return;
      motorOynatici = createAudioPlayer(k, { keepAudioSessionActive: true });
      motorOynatici.loop = true;
      motorOynatici.volume = 0;
      motorSon = { ses: -1, hiz: -1 };
    }
    const p = motorOynatici;
    const ses = Math.min(1, Math.max(0, Math.min(1, oran)) * 0.55 * duzey * durum.genel);
    if (Math.abs(ses - motorSon.ses) > 0.02) {
      p.volume = ses;
      motorSon.ses = ses;
    }
    // Hızlandıkça motor perdesi yükselir (0,8-1,25); desteklemeyen sürümde yalnız düzey değişir
    const hiz = Math.round(Math.min(2, (0.8 + 0.45 * Math.max(0, Math.min(1, oran))) * perde) * 20) / 20;
    if (hiz !== motorSon.hiz) {
      motorSon.hiz = hiz;
      try {
        if (typeof p.setPlaybackRate === 'function') p.setPlaybackRate(hiz, 'low');
        else p.playbackRate = hiz;
      } catch (e) {}
    }
    if (!p.playing) p.play();
  } catch (e) {
    motorOynatici = null;
  }
}
export function motorDurdur() {
  const p = motorOynatici;
  if (!p) return;
  try {
    if (p.playing) p.pause();
    p.volume = 0;
    motorSon.ses = 0;
  } catch (e) {}
}

// Konumlu sürekli sesler (nehir geçidi, şelale, jeneratör, kamp ateşi): her biri kendi döngüsünde, düzeyi uzaklığa göre.
// dongu(ad, oran): oran 0 ya da daha az ise durur. Döngüler yumuşakça açılıp kısılır (kare başına en çok %4).
const donguler = {};
export function dongu(ad, oran) {
  let x = donguler[ad];
  const hedef = durum.acik ? Math.max(0, Math.min(1, oran)) * durum.genel : 0;
  if (!x) {
    if (hedef <= 0.005) return;
    const k = SESLER[ad];
    if (!k) return;
    try {
      const p = createAudioPlayer(k, { keepAudioSessionActive: true });
      p.loop = true;
      p.volume = 0;
      x = donguler[ad] = { p, ses: 0 };
    } catch (e) {
      return;
    }
  }
  const yeni = x.ses + Math.max(-0.04, Math.min(0.04, hedef - x.ses));
  try {
    if (Math.abs(yeni - x.ses) > 0.003 || yeni === 0) {
      x.ses = yeni;
      x.p.volume = yeni;
    }
    if (x.ses > 0.005 && !x.p.playing) x.p.play();
    else if (x.ses <= 0.005 && x.p.playing) x.p.pause();
  } catch (e) {
    delete donguler[ad];
  }
}
export function donguleriDurdur() {
  Object.values(donguler).forEach((x) => {
    try {
      x.p.pause();
      x.p.volume = 0;
      x.ses = 0;
    } catch (e) {}
  });
}

// Hareket eden kaynağın sürekli sesi (dron pervanesi): sola ve sağa yatık iki sürüm (<ad>_sol/_sag) birlikte döner;
// düzey uzaklığa, iki yarının oranı yöne, çalma hızı yaklaşma/uzaklaşmaya (Doppler) göre. oran 0 → susar.
const yonluDonguler = {};
export function yonluDongu(ad, oran, pan = 0, hiz = 1) {
  let x = yonluDonguler[ad];
  const acik = durum.acik && oran > 0.003;
  if (!x) {
    if (!acik) return;
    const yap = (yon) => {
      const k = SESLER[`${ad}_${yon}`];
      if (!k) return null;
      const p = createAudioPlayer(k, { keepAudioSessionActive: true });
      p.loop = true;
      p.volume = 0;
      return p;
    };
    try {
      const sol = yap('sol');
      const sag = yap('sag');
      if (!sol || !sag) return;
      x = yonluDonguler[ad] = { sol, sag, hiz: 1 };
      sol.play();
      sag.play();
    } catch (e) {
      return;
    }
  }
  const v = acik ? Math.min(1, oran) * durum.genel : 0;
  const p = Math.max(-0.9, Math.min(0.9, pan));
  const a = ((p + 1) * Math.PI) / 4;
  try {
    x.sol.volume = v * Math.cos(a);
    x.sag.volume = v * Math.sin(a);
    const h = Math.round(Math.max(0.85, Math.min(1.15, hiz)) * 50) / 50;
    if (h !== x.hiz) {
      x.hiz = h;
      for (const q of [x.sol, x.sag]) {
        if (typeof q.setPlaybackRate === 'function') q.setPlaybackRate(h, 'low');
        else q.playbackRate = h;
      }
    }
    if (!acik) {
      x.sol.pause();
      x.sag.pause();
      x.sol.release();
      x.sag.release();
      delete yonluDonguler[ad];
    }
  } catch (e) {
    delete yonluDonguler[ad];
  }
}
export function yonluDonguDurdur(ad) {
  if (yonluDonguler[ad]) yonluDongu(ad, 0);
}

// Aşama 25 (karar 30): dinamik müzik. Ortam ve efektlerden ayrı kanal; parçalar yavaşça (yaklaşık 5 sn) birbirine geçer.
// hedef: { muzik_gunduz: 1, muzik_gerilim: 0.3 } (0-1), duzey: genel müzik düzeyi (0 kapalı).
const muzikler = {};
let muzikHedef = {};
let muzikDuzey = 0;
let muzikSayac = null;
function muzikAdim() {
  const simdi = Date.now();
  let devam = false;
  for (const [ad, x] of Object.entries(muzikler)) {
    const hedef = Math.max(0, Math.min(1, muzikHedef[ad] || 0)) * muzikDuzey;
    const yeni = x.ses + Math.max(-0.006, Math.min(0.006, hedef - x.ses));
    if (Math.abs(yeni - x.ses) > 1e-4) {
      x.ses = yeni;
      try {
        x.p.volume = yeni;
      } catch (e) {}
    }
    if (Math.abs(x.ses - hedef) > 1e-4) devam = true;
    if (x.ses <= 0.001 && hedef === 0) {
      x.sifir = x.sifir || simdi;
      if (simdi - x.sifir > 20000) {
        try {
          x.p.pause();
          x.p.release();
        } catch (e) {}
        delete muzikler[ad];
      } else devam = true;
    } else x.sifir = 0;
  }
  if (!devam) {
    clearInterval(muzikSayac);
    muzikSayac = null;
  }
}
export function muzikAyarla(hedef, duzey) {
  muzikHedef = hedef || {};
  muzikDuzey = Math.max(0, Math.min(1, duzey || 0));
  for (const [ad, v] of Object.entries(muzikHedef)) {
    if (!(v > 0) || muzikler[ad] || !muzikDuzey) continue;
    const k = SESLER[ad];
    if (!k) continue;
    try {
      const p = createAudioPlayer(k, { keepAudioSessionActive: true });
      p.loop = true;
      p.volume = 0;
      p.play();
      muzikler[ad] = { p, ses: 0, sifir: 0 };
    } catch (e) {}
  }
  if (!muzikSayac) muzikSayac = setInterval(muzikAdim, 100);
}
export const muzikDurumu = () => Object.fromEntries(Object.entries(muzikler).map(([a, x]) => [a, Math.round(x.ses * 1000) / 1000]));
export function birak() {
  U.hepsiniSustur();
  ortamDurdur();
  muzikAyarla({}, 0);
  Object.keys(muzikler).forEach((a) => {
    try {
      muzikler[a].p.release();
    } catch (e) {}
    delete muzikler[a];
  });
  Object.keys(yonluDonguler).forEach((a) => yonluDonguDurdur(a));
  Object.keys(donguler).forEach((a) => {
    try {
      donguler[a].p.release();
    } catch (e) {}
    delete donguler[a];
  });
  if (motorOynatici) {
    try {
      motorOynatici.release();
    } catch (e) {}
    motorOynatici = null;
  }
  Object.keys(oynaticilar).forEach((a) => {
    try {
      oynaticilar[a].release();
    } catch (e) {}
    delete oynaticilar[a];
  });
}
// Tarayıcı denemeleri için (telefonda etkisiz)
try {
  globalThis.__ortamDurumu = ortamDurumu;
  globalThis.__konumluDurum = () => konumluDurum();
  globalThis.__sesMotoru = () => sesMotoru();
  globalThis.__hrtfSoz = () => K.durumSozu();
  globalThis.__hrtfDeneme = () => K.deneme("zebra", SESLER.zebra, (i, y) => (globalThis.__denemeAdim = (globalThis.__denemeAdim || []).concat(y)));
  globalThis.__hrtfTani = () => new Promise((r) => (K.hazir() ? K.tani(r) : r(null)));
  globalThis.__muzikDurumu = () => muzikDurumu();
  globalThis.__yonluDurum = () => Object.fromEntries(Object.entries(yonluDonguler).map(([a, x]) => [a, { sol: Math.round(x.sol.volume * 100) / 100, sag: Math.round(x.sag.volume * 100) / 100, hiz: x.hiz }]));
} catch (e) {}
