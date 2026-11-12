// ==== SES EFEKTLERİ (3B konumlu) ====
// Hayvan sesleri ElevenLabs ile üretildi; araclar/sesleri-isle.sh her birini 5 konuma (soldan sağa) ve
// arkadan gelen boğuk sürümüne ayırır: ad_0 .. ad_4, ad_0a .. ad_4a. yonlu() hayvanın oyuncuya göre
// yönünü ve uzaklığını hesaplar: soldaki ses sol kulaktan, arkadaki boğuk gelir, uzaktaki kısık duyulur.
// Ortam sesi (haritanın rüzgârı, kuşları...) ayrı bir döngü kanalında çalar.
import { createAudioPlayer } from 'expo-audio';
import { SESLER } from './sesler.js';
import { konusuyorMu, efektCalindi, konusmaBaslarken, ayarlar as sesAyarlari } from './ses.js';

const durum = { acik: true, genel: 0.9, kis: true, ortam: 0.35 };
const oynaticilar = {};
let ortamOynatici = null;
let ortamAdi = null;

// Yaklaşık süreler (saniye). Konuşma, çalan kısa efekt bitince başlar.
const SURE = {
  sopa: 0.5, bicak: 0.45, kilic: 0.6, balta: 0.55, mizrak: 0.5, yay: 0.7, iska: 0.35, kritik: 0.45, altin: 0.6, dustu: 0.8,
  seviye: 1.8, yarali: 0.45, adim1: 0.07, adim2: 0.07, carpma: 0.15, hata: 0.18, olum: 1.4, dogus: 0.9, odak: 0.02,
  sinir: 0.12, etkinles: 0.1, kalp: 0.32, isinlan: 1.2, iksir: 0.6, hedef: 0.18, sonar: 0.09,
  adim_ot: 0.05, adim_toprak: 0.05, adim_camur: 0.05, adim_su: 0.05, adim_kaya: 0.05, adim_yaprak: 0.05, adim_magara: 0.05,
  donus_tik: 0.02, hedef_onde: 0.1,
  kosu_toynak: 0.05, kosu_hafif: 0.05, kosu_agir: 0.05, kosu_pati: 0.05,
  dron: 0.05, kurek: 0.1,
  gok: 0.3, // gök gürültüsü uzun ama arka plan sesi; konuşmayı bekletmesin
  gnu: 1.5, cita: 1.2, impala: 1.4, yabankopegi: 1.6, babun: 1.4, yarasa: 0.4,
  fil: 0.7, zebra: 0.8, suaygiri: 0.8, manda: 1.8, ceylan: 1.4, zurafa: 0.8,
  kurt: 1.6, tilki: 0.9, domuz: 1.4, ayi: 1.4, yilan: 1.2, akrep: 1.0, sirtlan: 1.2, timsah: 1.8, leopar: 1.4, kartal: 1.2, aslan: 1.8, gergedan: 1.2,
};
const sure = (ad) => SURE[ad] || SURE[ad.replace(/_\d+a?$/, '')] || 0.4;

konusmaBaslarken(() => {
  Object.entries(oynaticilar).forEach(([ad, p]) => {
    if (sure(ad) > 0.9) {
      try {
        p.pause();
      } catch (e) {}
    }
  });
});

export function efektAyarla({ acik, genel, kis, ortam } = {}) {
  if (typeof acik === 'boolean') durum.acik = acik;
  if (typeof kis === 'boolean') durum.kis = kis;
  if (typeof genel === 'number') durum.genel = genel;
  if (typeof ortam === 'number') durum.ortam = ortam;
  if (ortamOynatici) {
    try {
      ortamOynatici.volume = durum.acik ? durum.ortam : 0;
    } catch (e) {}
  }
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

export function cal(ad, ses = 1) {
  if (!durum.acik) return;
  const voiceover = sesAyarlari().kip === 'voiceover';
  if (durum.kis && !voiceover && konusuyorMu()) return;
  const p = oynatici(ad);
  if (!p) return;
  try {
    p.volume = Math.max(0, Math.min(1, ses * durum.genel));
    p.seekTo(0);
    p.play();
    if (durum.kis && !voiceover) efektCalindi(Math.min(sure(ad), 0.6) * 1000);
  } catch (e) {}
}

// Konumlu ses. kim: { x, y, yon }, hedef: { x, y }. Döndürür: duyulduysa true
export function yonlu(taban, kim, hedef, ses = 1, duyma = 45) {
  const dx = hedef.x - kim.x;
  const dy = hedef.y - kim.y;
  const m = Math.hypot(dx, dy);
  if (m > duyma) return false;
  let rel = Math.atan2(dx, dy) - kim.yon;
  while (rel > Math.PI) rel -= 2 * Math.PI;
  while (rel < -Math.PI) rel += 2 * Math.PI;
  const pan = Math.sin(rel);
  const i = Math.max(0, Math.min(4, Math.round((pan + 1) * 2)));
  const arka = Math.abs(rel) > Math.PI / 2 + 0.2;
  // Uzaklık: 3 metreye kadar tam, sonra ters kareye yakın bir eğriyle kısılır
  const uzaklik = m < 3 ? 1 : Math.max(0.06, Math.pow(3 / m, 0.85));
  cal(`${taban}_${i}${arka ? 'a' : ''}`, ses * uzaklik);
  return true;
}

// Haritanın ortam sesi: sürekli döngü. Bölge ya da gün değişince eskisi 2 saniyede kısılır, yenisi yavaşça açılır.
const GECIS_MS = 2000;
let gecisSayac = null;
function sesiKaydir(p, bas, son, sure, bitince) {
  const t0 = Date.now();
  const t = setInterval(() => {
    const k = Math.min(1, (Date.now() - t0) / sure);
    try {
      p.volume = bas + (son - bas) * k;
    } catch (e) {}
    if (k >= 1) {
      clearInterval(t);
      if (bitince) bitince();
    }
  }, 50);
  return t;
}
export function ortamBaslat(ad) {
  if (ortamAdi === ad && ortamOynatici) return;
  const k = SESLER[ad];
  ortamDurdur(true);
  if (!k) return;
  try {
    const p = createAudioPlayer(k, { keepAudioSessionActive: true });
    p.loop = true;
    p.volume = 0;
    p.play();
    ortamOynatici = p;
    ortamAdi = ad;
    gecisSayac = sesiKaydir(p, 0, durum.acik ? durum.ortam : 0, GECIS_MS);
  } catch (e) {
    ortamOynatici = null;
  }
}
export function ortamDurdur(yavas) {
  if (gecisSayac) clearInterval(gecisSayac);
  gecisSayac = null;
  const p = ortamOynatici;
  ortamOynatici = null;
  ortamAdi = null;
  if (!p) return;
  const kapat = () => {
    try {
      p.pause();
      p.release();
    } catch (e) {}
  };
  if (!yavas) return kapat();
  let v = 0;
  try {
    v = p.volume;
  } catch (e) {}
  sesiKaydir(p, v, 0, GECIS_MS, kapat);
}

export function birak() {
  ortamDurdur();
  Object.keys(oynaticilar).forEach((a) => {
    try {
      oynaticilar[a].release();
    } catch (e) {}
    delete oynaticilar[a];
  });
}
