// Silahşör: Diyarın Kaderi - Merkezi Ses ve Müzik Yöneticisi (KT/audio/SoundManager.kt karşılığı, aynı API).
// Arka plan müziği (BGM) ve ses efektleri (SFX). expo-audio ile çalışır; bun testlerinde sessizce hiçbir şey yapmaz.
import { R } from '../R.js';

let ses = null; // expo-audio modülü
try {
  ses = require('expo-audio');
} catch (e) {
  ses = null;
}
let depo = null;
try {
  depo = require('@react-native-async-storage/async-storage').default;
} catch (e) {
  depo = null;
}

const AYAR_ANAHTARI = 'diyarinkaderi-ses-v1';
const BGM_MASTER_SCALE = 0.45;

let baslatildi = false;
let bgmPlayer = null;
let currentBgmResId = null;
let isDucked = false;
let duckZamanlayici = null;
let bgmDuraklatildi = false;
const efektOynaticilari = new Map(); // kaynak -> oynatıcı (bir kez yaratılır, yeniden kullanılır)
const bekleyenBitisler = new Set();
let ortamPlayer = null; // arena seyirci döngüsü gibi ortam sesleri (müzikten ayrı kanal)
let ortamKaynak = null;
let ortamTaban = 0.35;
let ortamSonduruluyor = null;
let kesmeKusagi = 0; // stopAllSfx sonrası eski efektlerin bitiş işlevleri çağrılmasın

function oynaticiYarat(kaynak) {
  if (!ses || kaynak == null || typeof kaynak === 'string') return null;
  try {
    // keepAudioSessionActive: her efekt bitince ses oturumu kapanmasın; yoksa VoiceOver sesi dalgalanır.
    return ses.createAudioPlayer(kaynak, { keepAudioSessionActive: true });
  } catch (e) {
    try {
      return ses.createAudioPlayer(kaynak);
    } catch (e2) {
      return null;
    }
  }
}

function ayarlariKaydet() {
  if (!depo) return;
  const v = {
    bgmVolume: SoundManager.bgmVolume,
    sfxVolume: SoundManager.sfxVolume,
    isBgmEnabled: SoundManager.isBgmEnabled,
    isSfxEnabled: SoundManager.isSfxEnabled,
    isCrowdEnabled: SoundManager.isCrowdEnabled,
    crowdVolume: SoundManager.crowdVolume,
  };
  depo.setItem(AYAR_ANAHTARI, JSON.stringify(v)).catch(() => {});
}

function coerce01(v) {
  return Math.max(0, Math.min(1, Number(v) || 0));
}

function calculateEffectiveBgmVolume() {
  if (!SoundManager.isBgmEnabled) return 0;
  // İnsan kulağının logaritmik algısına uygun kuadratik eğri + arka plan müzik ölçeği
  const norm = coerce01(SoundManager.bgmVolume);
  return norm * norm * BGM_MASTER_SCALE;
}

function applyBgmVolume() {
  let v = calculateEffectiveBgmVolume();
  if (isDucked) v *= 0.3;
  try {
    if (bgmPlayer) bgmPlayer.volume = v;
  } catch (e) {}
  applyOrtamVolume();
}

/** Ortam (seyirci) sesi düzeyi: ayar × taban; efekt çalarken yarıya iner (müzikle birlikte kısılır). */
function ortamDuzeyi() {
  if (!SoundManager.isCrowdEnabled) return 0;
  const n = coerce01(SoundManager.crowdVolume);
  let v = n * n * ortamTaban;
  if (isDucked) v *= 0.5;
  return v;
}
function applyOrtamVolume() {
  try {
    if (ortamPlayer && !ortamSonduruluyor) ortamPlayer.volume = ortamDuzeyi();
  } catch (e) {}
}

function duckBgmTemporarily(durationMs) {
  if (!SoundManager.isBgmEnabled && !ortamPlayer) return;
  if (duckZamanlayici) clearTimeout(duckZamanlayici);
  isDucked = true;
  applyBgmVolume();
  duckZamanlayici = setTimeout(() => {
    duckZamanlayici = null;
    isDucked = false;
    applyBgmVolume();
  }, durationMs);
}

export const SoundManager = {
  bgmVolume: 0.75,
  sfxVolume: 1.0,
  isBgmEnabled: true,
  isSfxEnabled: true,
  // Arena seyirci sesi (8 Kasım): ayrı açma/kapama ve düzey
  isCrowdEnabled: true,
  crowdVolume: 0.8,

  /** Uygulama açılışında bir kez: ses oturumunu ayarlar ve kayıtlı ses ayarlarını yükler. */
  async initialize() {
    if (baslatildi) return;
    baslatildi = true;
    if (ses) {
      try {
        await ses.setAudioModeAsync({ playsInSilentMode: true, interruptionMode: 'mixWithOthers', shouldPlayInBackground: false });
        await ses.setIsAudioActiveAsync(true);
      } catch (e) {}
    }
    if (depo) {
      try {
        const s = await depo.getItem(AYAR_ANAHTARI);
        if (s) {
          const v = JSON.parse(s);
          if (typeof v.bgmVolume === 'number') SoundManager.bgmVolume = v.bgmVolume;
          if (typeof v.sfxVolume === 'number') SoundManager.sfxVolume = v.sfxVolume;
          if (typeof v.crowdVolume === 'number') SoundManager.crowdVolume = v.crowdVolume;
          if (typeof v.isCrowdEnabled === 'boolean') SoundManager.isCrowdEnabled = v.isCrowdEnabled;
          if (typeof v.isBgmEnabled === 'boolean') SoundManager.isBgmEnabled = v.isBgmEnabled;
          if (typeof v.isSfxEnabled === 'boolean') SoundManager.isSfxEnabled = v.isSfxEnabled;
        }
      } catch (e) {}
    }
    applyBgmVolume();
  },

  setBgmVolume(volume) {
    SoundManager.bgmVolume = coerce01(volume);
    ayarlariKaydet();
    applyBgmVolume();
  },
  setSfxVolume(volume) {
    SoundManager.sfxVolume = coerce01(volume);
    ayarlariKaydet();
  },
  setBgmEnabled(enabled) {
    SoundManager.isBgmEnabled = !!enabled;
    ayarlariKaydet();
    applyBgmVolume();
    if (enabled && bgmPlayer && !bgmDuraklatildi) {
      try {
        bgmPlayer.play();
      } catch (e) {}
    }
  },
  setCrowdEnabled(enabled) {
    SoundManager.isCrowdEnabled = !!enabled;
    ayarlariKaydet();
    applyOrtamVolume();
  },
  setCrowdVolume(volume) {
    SoundManager.crowdVolume = coerce01(volume);
    ayarlariKaydet();
    applyOrtamVolume();
  },

  /** Döngüsel ortam sesi başlatır (müzikten ayrı kanal). taban: 0..1 ek ölçek. Aynı ses çalıyorsa dokunmaz. */
  playAmbience(resId, taban = 0.35) {
    ortamTaban = taban;
    if (ortamSonduruluyor) {
      clearInterval(ortamSonduruluyor);
      ortamSonduruluyor = null;
    }
    if (ortamPlayer && ortamKaynak === resId) {
      applyOrtamVolume();
      try {
        if (!ortamPlayer.playing && !bgmDuraklatildi) ortamPlayer.play();
      } catch (e) {}
      return;
    }
    SoundManager.stopAmbience(0);
    const p = oynaticiYarat(resId);
    if (!p) return;
    ortamPlayer = p;
    ortamKaynak = resId;
    try {
      p.loop = true;
      p.volume = ortamDuzeyi();
      if (!bgmDuraklatildi) p.play();
    } catch (e) {}
  },

  /** Ortam sesini (isteğe bağlı yavaşça kısarak) durdurur. */
  stopAmbience(sondurmeMs = 1200) {
    const p = ortamPlayer;
    if (!p) return;
    if (ortamSonduruluyor) clearInterval(ortamSonduruluyor);
    const bitir = () => {
      try {
        p.pause();
        p.release();
      } catch (e) {}
      if (ortamPlayer === p) {
        ortamPlayer = null;
        ortamKaynak = null;
      }
      ortamSonduruluyor = null;
    };
    if (!sondurmeMs) {
      bitir();
      return;
    }
    const adim = 12;
    let kalan = adim;
    let baslangic = 0;
    try {
      baslangic = p.volume;
    } catch (e) {}
    ortamSonduruluyor = setInterval(() => {
      kalan--;
      try {
        p.volume = (baslangic * kalan) / adim;
      } catch (e) {}
      if (kalan <= 0) {
        clearInterval(ortamSonduruluyor);
        bitir();
      }
    }, sondurmeMs / adim);
  },

  setSfxEnabled(enabled) {
    SoundManager.isSfxEnabled = !!enabled;
    ayarlariKaydet();
  },

  /** Döngüsel arka plan müziği. Aynı müzik zaten çalıyorsa baştan başlatmaz. */
  playBgm(resId, loop = true) {
    if (currentBgmResId === resId && bgmPlayer) {
      if (SoundManager.isBgmEnabled && !bgmDuraklatildi) {
        try {
          if (!bgmPlayer.playing) bgmPlayer.play();
        } catch (e) {}
      }
      return;
    }
    SoundManager.stopBgm();
    const p = oynaticiYarat(resId);
    currentBgmResId = resId;
    if (!p) return;
    bgmPlayer = p;
    try {
      p.loop = loop;
      applyBgmVolume();
      if (!bgmDuraklatildi) p.play();
    } catch (e) {
      currentBgmResId = null;
    }
  },

  /** Dövüş ekranında savaş müziklerinden rastgele birini döngüsel çalar. */
  playRandomBattleMusic() {
    const havuz = [R.raw.savas1, R.raw.savas2, R.raw.savas3, R.raw.savas4, R.raw.savas5];
    SoundManager.playBgm(havuz[Math.floor(Math.random() * havuz.length)], true);
  },

  /**
   * Tek seferlik ses efekti. Efekt çalarken arka plan müziği kısılır (ducking).
   * onCompletion efekt bitince (ya da çalınamazsa hemen) çağrılır.
   */
  playSfx(resId, duckDurationMs = null, onCompletion = null, duzey = 1) {
    if (!SoundManager.isSfxEnabled || SoundManager.sfxVolume <= 0) {
      if (onCompletion) onCompletion();
      return;
    }
    let p = efektOynaticilari.get(resId);
    if (!p) {
      p = oynaticiYarat(resId);
      if (p) efektOynaticilari.set(resId, p);
    }
    if (!p) {
      if (onCompletion) setTimeout(onCompletion, 0);
      return;
    }
    let sureMs = 900;
    try {
      if (p.duration && p.duration > 0) sureMs = Math.max(400, Math.min(5500, Math.round(p.duration * 1000)));
    } catch (e) {}
    duckBgmTemporarily(duckDurationMs != null ? duckDurationMs : sureMs);
    try {
      p.volume = coerce01(SoundManager.sfxVolume) * coerce01(duzey);
      p.seekTo(0);
      p.play();
    } catch (e) {
      if (onCompletion) onCompletion();
      return;
    }
    if (onCompletion) {
      let bitti = false;
      let abone = null;
      const kusak = kesmeKusagi;
      const bitir = () => {
        if (bitti) return;
        bitti = true;
        bekleyenBitisler.delete(bitir);
        try {
          if (abone) abone.remove();
        } catch (e) {}
        if (kusak === kesmeKusagi) onCompletion();
      };
      bekleyenBitisler.add(bitir);
      try {
        abone = p.addListener('playbackStatusUpdate', (d) => {
          if (d && d.didJustFinish) bitir();
        });
      } catch (e) {}
      // Olay gelmezse güvenlik: süre dolunca bitmiş say
      setTimeout(bitir, (duckDurationMs != null ? Math.max(duckDurationMs, sureMs) : sureMs) + 400);
    }
  },

  playPageTurnSound(isFirstPage = false) {
    if (isFirstPage) SoundManager.playSfx(R.raw.sayfacevir3);
    else SoundManager.playSfx(Math.random() < 0.5 ? R.raw.sayfacevir : R.raw.sayfacevir2);
  },

  playLetterSound() {
    SoundManager.playSfx(R.raw.mektup);
  },

  pauseBgm() {
    bgmDuraklatildi = true;
    try {
      if (bgmPlayer) bgmPlayer.pause();
      if (ortamPlayer) ortamPlayer.pause();
    } catch (e) {}
  },
  resumeBgm() {
    bgmDuraklatildi = false;
    try {
      if (ortamPlayer) ortamPlayer.play();
    } catch (e) {}
    if (!SoundManager.isBgmEnabled) return;
    try {
      if (bgmPlayer) bgmPlayer.play();
    } catch (e) {}
  },
  stopBgm() {
    if (duckZamanlayici) clearTimeout(duckZamanlayici);
    duckZamanlayici = null;
    isDucked = false;
    try {
      if (bgmPlayer) {
        bgmPlayer.pause();
        bgmPlayer.release();
      }
    } catch (e) {}
    bgmPlayer = null;
    currentBgmResId = null;
  },
  stopAllSfx() {
    for (const p of efektOynaticilari.values()) {
      try {
        p.pause();
      } catch (e) {}
    }
    // Kotlin'de durdurulan efektlerin bitiş işlevi çağrılmaz; burada da çağrılmaz.
    kesmeKusagi++;
    bekleyenBitisler.clear();
  },
};

export default SoundManager;
