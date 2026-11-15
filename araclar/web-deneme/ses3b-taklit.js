// Tarayıcı denemesi için react-native-audio-api taklidi: tarayıcının kendi Web Audio API'sini kullanır (aynı arayüz).
// decodeAudioData telefondaki gibi require sonucunu (burada dosya adresi) kabul eder.
class TaklitAudioContext extends (globalThis.AudioContext || class {}) {
  decodeAudioData(girdi) {
    if (typeof girdi === 'string') return fetch(girdi).then((r) => r.arrayBuffer()).then((b) => super.decodeAudioData(b));
    return super.decodeAudioData(girdi);
  }
}
export const AudioContext = globalThis.AudioContext ? TaklitAudioContext : undefined;
export const AudioManager = { setSystemOptions() {} };
