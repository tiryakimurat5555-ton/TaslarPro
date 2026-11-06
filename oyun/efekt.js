// ==== SES EFEKTLERİ ====
// Sentezle üretilmiş kısa sesler (araclar/efekt-uret.py). Yönlü sesler 5 konum × önde/arkada çalınır:
// ses solda ise sol kulaktan, arkadaysa boğuk gelir; uzaklaştıkça kısılır.
import { createAudioPlayer } from 'expo-audio';
import { SESLER } from './sesler.js';

const durum = { acik: true, genel: 0.9 };
const oynaticilar = {};

export function efektAyarla({ acik, genel } = {}) {
  if (typeof acik === 'boolean') durum.acik = acik;
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
  const p = oynatici(ad);
  if (!p) return;
  try {
    p.volume = Math.max(0, Math.min(1, ses * durum.genel));
    p.seekTo(0);
    p.play();
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
