// SaveManager.js — KT/data/SaveManager.kt taşıması.
// Android dosya G/Ç yerine AsyncStorage kullanır. Kotlin API'si eşzamanlı olduğu için bellek içi bir önbellek tutulur:
//   await SaveManager.initialize()  -> kaydı bir kez önbelleğe yükler
//   hasSaveFile() / loadGame()      -> önbellekten eşzamanlı okur
//   saveGame(data)                  -> önbelleği hemen günceller, AsyncStorage'a arka planda yazar
// AsyncStorage yoksa (bun testleri) ya da SaveManager.useMemoryStorage() çağrıldıysa yalnız bellek kullanılır.
import * as kt from '../kt.js';
import { Data } from '../kt.js';

/**
 * Otomatik Kayıt Veri Modeli (Single Slot Save Data)
 */
export class SaveGameData extends Data {
  static T = 'SaveGameData';
  static defaults() {
    return {
      saveTimestamp: Date.now(),
      player: undefined,
      dayState: undefined,
      leagueState: undefined,
      quests: undefined,
      adventures: undefined,
      rooms: undefined,
      enemies: undefined,
    };
  }
}
Data.register(SaveGameData);

const SAVE_KEY = 'diyarinkaderi-kayit-v1';

let _depo = null; // AsyncStorage ya da null
let _depoYuklendi = false;
let _yalnizBellek = false;
let _onbellek = null; // JSON metni ya da null
let _hazir = false;
let _yazmaZinciri = Promise.resolve();

async function depoyuGetir() {
  if (_yalnizBellek) return null;
  if (_depoYuklendi) return _depo;
  _depoYuklendi = true;
  try {
    // Metro bu require'ı paketlerken çözer; bun testlerinde paket yoksa catch'e düşer ve bellek kullanılır.
    // eslint-disable-next-line no-undef
    const m = require('@react-native-async-storage/async-storage');
    _depo = (m && (m.default || m)) || null;
    if (_depo && typeof _depo.getItem !== 'function') _depo = null;
  } catch (e) {
    _depo = null;
  }
  return _depo;
}

function arkaPlandaYaz(islem) {
  _yazmaZinciri = _yazmaZinciri
    .then(async () => {
      const depo = await depoyuGetir();
      if (depo) await islem(depo);
    })
    .catch((e) => console.warn('Kayıt yazılamadı', e));
  return _yazmaZinciri;
}

/**
 * Tek Yuvalı (Single Slot) Oyun Kayıt & Yükleme Yöneticisi
 */
export const SaveManager = {
  SAVE_FILE_NAME: SAVE_KEY,

  /** Kotlin initialize(context) karşılığı. Kaydı AsyncStorage'dan önbelleğe bir kez yükler. */
  async initialize() {
    if (_hazir) return;
    const depo = await depoyuGetir();
    if (depo) {
      try {
        const metin = await depo.getItem(SAVE_KEY);
        // initialize sürerken saveGame çağrıldıysa yeni önbelleği ezme
        if (!_hazir && _onbellek == null) _onbellek = metin != null && metin.length > 0 ? metin : null;
      } catch (e) {
        console.warn('Kayıt okunamadı', e);
      }
    }
    _hazir = true;
  },

  /** Testler için: AsyncStorage'ı hiç kullanmadan saf bellek içi depolama. */
  useMemoryStorage() {
    _yalnizBellek = true;
    _depo = null;
    _depoYuklendi = true;
    _onbellek = null;
    _hazir = true;
  },

  /** Bekleyen arka plan yazmalarının bitmesini bekler. */
  async flush() {
    await _yazmaZinciri;
  },

  hasSaveFile() {
    return _onbellek != null && _onbellek.length > 0;
  },

  saveGame(data) {
    try {
      const json = kt.toJson(data);
      _onbellek = json;
      arkaPlandaYaz((depo) => depo.setItem(SAVE_KEY, json));
      return true;
    } catch (e) {
      console.warn(e);
      return false;
    }
  },

  loadGame() {
    try {
      if (_onbellek == null) return null;
      const veri = kt.fromJson(_onbellek);
      if (veri instanceof SaveGameData) return veri;
      return veri != null ? new SaveGameData(veri) : null;
    } catch (e) {
      console.warn(e);
      return null;
    }
  },

  deleteSave() {
    try {
      _onbellek = null;
      arkaPlandaYaz((depo) => depo.removeItem(SAVE_KEY));
      return true;
    } catch (e) {
      console.warn(e);
      return false;
    }
  },
};
