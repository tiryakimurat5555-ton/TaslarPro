// ==== SES EFEKTLERİ ====
// Sentezle üretilmiş kısa sesler (araclar/efekt-uret.py). Yönlü sesler 5 konum × önde/arkada çalınır:
// ses solda ise sol kulaktan, arkadaysa boğuk gelir; uzaklaştıkça kısılır.
import { createAudioPlayer } from 'expo-audio';
import { SESLER } from './sesler.js';
import { konusuyorMu, efektCalindi, konusmaBaslarken, ayarlar as sesAyarlari } from './ses.js';

const durum = { acik: true, genel: 0.9, kis: true };
const oynaticilar = {};
// Seslerin yaklaşık süreleri (saniye). Konuşma, çalan kısa efekt bitince başlar.
const SURE = {
  kilic: 0.43, topuz: 0.25, ok: 0.25, ates: 0.45, buz: 0.5, iyiles: 0.85, iska: 0.22, kritik: 0.45, oldur: 0.55, altin: 0.34,
  seviye: 1.35, gorev: 0.85, iksir: 0.6, ganimet: 0.5, adim1: 0.07, adim2: 0.07, carpma: 0.15, hata: 0.18, olum: 1.4, dogus: 0.9,
  odak: 0.02, sinir: 0.12, etkinles: 0.1, kalp: 0.32, isinlan: 1.2, kalkan: 0.6, hedef: 0.18, su: 2.4, bolge: 1.0, kesif: 0.8,
  aldin: 0.28, sonar: 0.09, kurt: 0.7, domuz: 0.49, goblin: 0.42, insan: 0.35, ork: 0.45, orumcek: 0.25, golem: 1.0, golge: 0.8, ejder: 1.4,
};
const sure = (ad) => SURE[ad] || SURE[ad.replace(/_\d+a?$/, '')] || 0.4;

// Konuşma başlarken hâlâ çalan uzun efektleri sustur
konusmaBaslarken(() => {
  Object.entries(oynaticilar).forEach(([ad, p]) => {
    if (sure(ad) > 0.6) {
      try {
        p.pause();
      } catch (e) {}
    }
  });
});

export function efektAyarla({ acik, genel, kis } = {}) {
  if (typeof acik === 'boolean') durum.acik = acik;
  if (typeof kis === 'boolean') durum.kis = kis;
  if (typeof genel === 'number') durum.genel = genel;
}

function oynatici(ad) {
  let p = oynaticilar[ad];
  if (p) return p;
  const k = SESLER[ad];
  if (!k) return null;
  try {
    p = createAudioPlayer(k);
    oynaticilar[ad] = p;
  } catch (e) {
    p = null;
  }
  return p;
}

// Sık kullanılanları önceden yükle (ilk çalışta gecikme olmasın)
export function onYukle(adlar) {
  adlar.forEach((a) => oynatici(a));
}

export function cal(ad, ses = 1) {
  if (!durum.acik) return;
  // Oyunun kendi sesi konuşurken efekt çalınmaz: ikisi üst üste binince iPhone konuşmanın sesini dalgalandırıyor.
  // VoiceOver kipinde bu kural yok: VoiceOver ayrı bir sistem sesidir, efektler onunla birlikte çalar.
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

// kim: {x, y, yon}, hedef: {x, y}. taban: 'kurt', 'aldin', 'sonar' ...
export function yonlu(taban, kim, hedef, ses = 1) {
  const dx = hedef.x - kim.x;
  const dy = hedef.y - kim.y;
  const m = Math.hypot(dx, dy);
  let rel = Math.atan2(dx, dy) - kim.yon;
  while (rel > Math.PI) rel -= 2 * Math.PI;
  while (rel < -Math.PI) rel += 2 * Math.PI;
  const pan = Math.sin(rel);
  const i = Math.max(0, Math.min(4, Math.round((pan + 1) * 2)));
  const arka = Math.abs(rel) > Math.PI / 2 + 0.2;
  const uzaklik = Math.max(0.15, Math.min(1, 1.15 - m / 32));
  cal(`${taban}_${i}${arka ? 'a' : ''}`, ses * uzaklik);
}

export function birak() {
  Object.keys(oynaticilar).forEach((a) => {
    try {
      oynaticilar[a].release();
    } catch (e) {}
    delete oynaticilar[a];
  });
}
