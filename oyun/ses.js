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
  efektBitis: 0, // çalan son efektin biteceği an (ms)
  bekleyen: null, // efekt bitsin diye bekleyen konuşmanın zamanlayıcısı
  basliyor: null, // konuşma başlarken çağrılır (uzun efektleri durdurmak için)
};

// Efekt motoru çaldığı sesin süresini bildirir; konuşma o bitince başlar.
// Böylece konuşma ile efekt hiç üst üste binmez (iPhone üst üste binince konuşmanın sesini dalgalandırıyor).
export function efektCalindi(ms) {
  motor.efektBitis = Math.max(motor.efektBitis, Date.now() + ms);
}
export function konusmaBaslarken(f) {
  motor.basliyor = f;
}
function bekleyeniIptal() {
  if (motor.bekleyen) {
    clearTimeout(motor.bekleyen);
    motor.bekleyen = null;
  }
}

const ANDROID = Platform.OS === 'android';
// Android'de expo-speech dili Locale.Builder().setLanguage(...) ile kurar: 'tr-TR' orada geçersizdir ve telefonun
// varsayılan diline (ör. İngilizce) düşer; bu yüzden Android'de yalnızca 'tr' verilir.
const DIL = ANDROID ? 'tr' : 'tr-TR';
// Türkçe ses durumu: null bilinmiyor, true var, false yok (Android'de konuşma motorunda Türkçe yüklü değil)
let turkceSesVar = null;
async function turkceSesBul() {
  try {
    const sesler = await Speech.getAvailableVoicesAsync();
    const tr = (sesler || []).filter((s) => (s.language || '').toLowerCase().startsWith('tr'));
    turkceSesVar = (sesler || []).length ? tr.length > 0 : null;
    // Android: internet isteyen (network) sesler bağlantı yokken susar ya da gecikir; telefonda yüklü (local) sesi yeğle
    const yerel = ANDROID ? tr.filter((s) => !/network/i.test(s.identifier || '') && !/notinstalled/i.test(s.identifier || '')) : tr;
    const havuz = yerel.length ? yerel : tr;
    // Geliştirilmiş (Enhanced) ses varsa onu seç
    const iyi = havuz.find((s) => /enhanced|premium/i.test(s.quality || '') || /enhanced|premium/i.test(s.identifier || ''));
    motor.ses = (iyi || havuz[0] || {}).identifier;
  } catch (e) {
    motor.ses = undefined;
  }
}
turkceSesBul();
// Android'de konuşma motoru açılışta hazır olmayabilir: birkaç saniye sonra bir kez daha bak
if (ANDROID) setTimeout(() => turkceSesVar === true || turkceSesBul(), 4000);
// Telefonda Türkçe konuşma sesi var mı (Android'de yoksa oyun yazıyı başka dilde okur)
export async function turkceSesDurumu() {
  if (turkceSesVar === null) await turkceSesBul();
  return turkceSesVar;
}

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
  // Kısa bir efekt çalıyorsa bitmesini bekle (en çok 600 ms); uzun süren efektler durdurulur
  const bekle = Math.min(600, motor.efektBitis - Date.now());
  if (bekle > 15) {
    bekleyeniIptal();
    motor.bekleyen = setTimeout(() => {
      motor.bekleyen = null;
      if (motor.konusuyor && motor.konusuyor.metin === s.metin) konus(s);
    }, bekle);
    return;
  }
  konus(s);
}

function konus(s) {
  if (motor.basliyor) {
    try {
      motor.basliyor();
    } catch (e) {}
  }
  motor.efektBitis = 0;
  // Android konuşma motoru tek seferde en çok ~4000 harf okur; uzun metin cümle sınırlarından parçalanır,
  // parçalar sırayla okunur, sıradaki söz son parça bitince başlar.
  const parcalar = parcala(s.metin, ANDROID ? 3000 : 100000);
  parcalar.forEach((p, i) => {
    const son = i === parcalar.length - 1;
    Speech.speak(p, {
      language: DIL,
      voice: motor.ses,
      rate: motor.hiz,
      volume: 1.0,
      pitch: 1.0,
      onDone: son ? sonraki : undefined,
      onStopped: () => {},
      onError: son ? sonraki : undefined,
    });
  });
}

function parcala(metin, sinir) {
  if (metin.length <= sinir) return [metin];
  const cumleler = metin.match(/[^.!?]+[.!?]*\s*/g) || [metin];
  const sonuc = [];
  let p = '';
  for (const c of cumleler) {
    if ((p + c).length > sinir && p) {
      sonuc.push(p);
      p = '';
    }
    if (c.length > sinir) {
      for (let i = 0; i < c.length; i += sinir) sonuc.push(c.slice(i, i + sinir));
    } else p += c;
  }
  if (p) sonuc.push(p);
  return sonuc;
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
    bekleyeniIptal();
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
  bekleyeniIptal();
  motor.kuyruk = [];
  if (motor.kip !== 'voiceover') Speech.stop();
  motor.konusuyor = null;
  baslat({ metin, oncelik: 4, zaman: Date.now() });
}

export function sus() {
  bekleyeniIptal();
  motor.kuyruk = [];
  motor.konusuyor = null;
  try {
    Speech.stop();
  } catch (e) {}
}

export function konusuyorMu() {
  return !!motor.konusuyor;
}
