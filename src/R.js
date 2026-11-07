// Android R kaynak tablosu karşılığı: R.raw.<ad> ve R.drawable.<ad> (Kotlin kodu aynen kullanabilsin diye).
// Ses dosyaları KT/res/raw'dan AAC (m4a) olarak sıkıştırıldı: assets/ses/. Bun testlerinde require çalışmazsa adlar döner.
function yukle() {
  try {
    return {
      raw: {
        anamuzik: require('../assets/ses/anamuzik.m4a'),
        arena: require('../assets/ses/arena.m4a'),
        arenabasla: require('../assets/ses/arenabasla.m4a'),
        bolge: require('../assets/ses/bolge.m4a'),
        demirci: require('../assets/ses/demirci.m4a'),
        digeraltin: require('../assets/ses/digeraltin.m4a'),
        dovusbasla: require('../assets/ses/dovusbasla.m4a'),
        dukkangiris: require('../assets/ses/dukkangiris.m4a'),
        envanter: require('../assets/ses/envanter.m4a'),
        ev: require('../assets/ses/ev.m4a'),
        gelistir: require('../assets/ses/gelistir.m4a'),
        gorevkabul: require('../assets/ses/gorevkabul.m4a'),
        gorevler: require('../assets/ses/gorevler.m4a'),
        gorevodul: require('../assets/ses/gorevodul.m4a'),
        gungecir: require('../assets/ses/gungecir.m4a'),
        hikayegiris: require('../assets/ses/hikayegiris.m4a'),
        mektup: require('../assets/ses/mektup.m4a'),
        sarkialtin: require('../assets/ses/sarkialtin.m4a'),
        satinal: require('../assets/ses/satinal.m4a'),
        savas1: require('../assets/ses/savas1.m4a'),
        savas2: require('../assets/ses/savas2.m4a'),
        savas3: require('../assets/ses/savas3.m4a'),
        savas4: require('../assets/ses/savas4.m4a'),
        savas5: require('../assets/ses/savas5.m4a'),
        sayfacevir: require('../assets/ses/sayfacevir.m4a'),
        sayfacevir2: require('../assets/ses/sayfacevir2.m4a'),
        sayfacevir3: require('../assets/ses/sayfacevir3.m4a'),
        simyaci: require('../assets/ses/simyaci.m4a'),
        tashisar: require('../assets/ses/tashisar.m4a'),
        tashisarhan: require('../assets/ses/tashisarhan.m4a'),
        zarat: require('../assets/ses/zarat.m4a'),
      },
      drawable: {
        main_menu_bg: require('../assets/gorsel/main_menu_bg.jpg'),
      },
    };
  } catch (e) {
    const raw = {};
    const drawable = { main_menu_bg: 'main_menu_bg' };
    raw.anamuzik = 'anamuzik';
    raw.arena = 'arena';
    raw.arenabasla = 'arenabasla';
    raw.bolge = 'bolge';
    raw.demirci = 'demirci';
    raw.digeraltin = 'digeraltin';
    raw.dovusbasla = 'dovusbasla';
    raw.dukkangiris = 'dukkangiris';
    raw.envanter = 'envanter';
    raw.ev = 'ev';
    raw.gelistir = 'gelistir';
    raw.gorevkabul = 'gorevkabul';
    raw.gorevler = 'gorevler';
    raw.gorevodul = 'gorevodul';
    raw.gungecir = 'gungecir';
    raw.hikayegiris = 'hikayegiris';
    raw.mektup = 'mektup';
    raw.sarkialtin = 'sarkialtin';
    raw.satinal = 'satinal';
    raw.savas1 = 'savas1';
    raw.savas2 = 'savas2';
    raw.savas3 = 'savas3';
    raw.savas4 = 'savas4';
    raw.savas5 = 'savas5';
    raw.sayfacevir = 'sayfacevir';
    raw.sayfacevir2 = 'sayfacevir2';
    raw.sayfacevir3 = 'sayfacevir3';
    raw.simyaci = 'simyaci';
    raw.tashisar = 'tashisar';
    raw.tashisarhan = 'tashisarhan';
    raw.zarat = 'zarat';
    return { raw, drawable };
  }
}
export const R = yukle();
/** Kaynak kimliğinden okunur ad (deneme ve günlük için) */
export function kaynakAdi(k) {
  for (const [ad, v] of Object.entries(R.raw)) if (v === k) return ad;
  return String(k);
}
