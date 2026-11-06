// ==== SES MOTORU ====
// Oyunun kendi konuşma motoru. Üç kip:
//   'kendi'     : oyun kendi sesiyle konuşur (VoiceOver kapalı oynanır)
//   'voiceover' : duyurular VoiceOver'a gönderilir
//   'gorerek'   : yalnızca önemli olaylar konuşulur
// Öncelik 0-5: 0 hiç konuşulmaz, 3 ve üstü konuşmakta olanı keser, 5 en acil.
import * as Speech from 'expo-speech';
import { AccessibilityInfo, Platform } from 'react-native';

const motor = {
  kip: 'kendi',
  hiz: 1.0,
  acik: true,
  konusuyor: null, // { metin, oncelik, baslangic }
  kuyruk: [],
  ses: undefined, // seçilen Türkçe ses kimliği
  dinleyici: null, // altyazı için
};

async function turkceSesBul() {
  try {
    const sesler = await Speech.getAvailableVoicesAsync();
    const tr = (sesler || []).filter((s) => (s.language || '').toLowerCase().startsWith('tr'));
    // Geliştirilmiş (Enhanced) ses varsa onu seç
    const iyi = tr.find((s) => /enhanced|premium/i.test(s.quality || '') || /enhanced|premium/i.test(s.identifier || ''));
    motor.ses = (iyi || tr[0] || {}).identifier;
  } catch (e) {
    motor.ses = undefined;
  }
}
turkceSesBul();

export function ayarla({ kip, hiz, acik } = {}) {
  if (kip) motor.kip = kip;
  if (typeof hiz === 'number') motor.hiz = hiz;
  if (typeof acik === 'boolean') motor.acik = acik;
}
export function ayarlar() {
  return { kip: motor.kip, hiz: motor.hiz, acik: motor.acik };
}
export function altyaziDinle(f) {
  motor.dinleyici = f;
}

function sonraki() {
  motor.konusuyor = null;
  // Bayatlamış (4 saniyeden eski) düşük öncelikli sözleri at
  const simdi = Date.now();
  motor.kuyruk = motor.kuyruk.filter((s) => s.oncelik >= 3 || simdi - s.zaman < 4000);
  const s = motor.kuyruk.shift();
  if (s) baslat(s);
}

function baslat(s) {
  motor.konusuyor = { ...s, baslangic: Date.now() };
  if (motor.dinleyici) motor.dinleyici(s.metin);
  if (motor.kip === 'voiceover') {
    try {
      if (AccessibilityInfo.announceForAccessibilityWithOptions && Platform.OS === 'ios') {
        AccessibilityInfo.announceForAccessibilityWithOptions(s.metin, { queue: s.oncelik < 3 });
      } else AccessibilityInfo.announceForAccessibility(s.metin);
    } catch (e) {}
    // VoiceOver kendi sırasını tutar; bizim kuyruk kısa bir aradan sonra devam etsin
    setTimeout(sonraki, Math.min(4000, 400 + s.metin.length * 45));
    return;
  }
  Speech.speak(s.metin, {
    language: 'tr-TR',
    voice: motor.ses,
    rate: motor.hiz,
    onDone: sonraki,
    onStopped: () => {},
    onError: sonraki,
  });
}

// Söyle: kuyruğa ekler ya da önceliğe göre keser
export function soyle(metin, oncelik = 2) {
  if (!metin || !motor.acik || oncelik <= 0) return;
  if (motor.kip === 'gorerek' && oncelik < 3) {
    if (motor.dinleyici) motor.dinleyici(metin);
    return;
  }
  const s = { metin, oncelik, zaman: Date.now() };
  if (!motor.konusuyor) return baslat(s);
  if (oncelik >= 3 && oncelik >= motor.konusuyor.oncelik) {
    // Kes ve hemen söyle
    motor.kuyruk = motor.kuyruk.filter((x) => x.oncelik > oncelik);
    if (motor.kip !== 'voiceover') Speech.stop();
    motor.konusuyor = null;
    return baslat(s);
  }
  // Aynı söz zaten sıradaysa ekleme
  if (motor.kuyruk.some((x) => x.metin === metin)) return;
  motor.kuyruk.push(s);
  motor.kuyruk.sort((a, b) => b.oncelik - a.oncelik);
  if (motor.kuyruk.length > 4) motor.kuyruk.length = 4;
}

// Dokunulan düğmenin adını hemen söyle (her şeyi keser)
export function hemen(metin) {
  if (!metin || !motor.acik) return;
  motor.kuyruk = [];
  if (motor.kip !== 'voiceover') Speech.stop();
  motor.konusuyor = null;
  baslat({ metin, oncelik: 4, zaman: Date.now() });
}

export function sus() {
  motor.kuyruk = [];
  motor.konusuyor = null;
  try {
    Speech.stop();
  } catch (e) {}
}

export function konusuyorMu() {
  return !!motor.konusuyor;
}
