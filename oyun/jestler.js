// Kayıp Okyanus'tan (src/arayuz/jestler.js) aynen alındı: sahada bütün kontroller bu dokunma hareketleriyle yapılır.
// Dokunma hareketlerini tanıyan küçük yardımcı. VoiceOver kapalıyken oyunun bütün
// kontrolleri bu hareketlerle yapılır.
//
// Tanınan hareketler:
//   onDokun(parmak, konum)       tek dokunuş (1 ya da 2 parmak). konum: dokunulan yer (bileşene göre)
//   onCiftDokun(parmak, konum)   çift dokunuş
//   onUzunBas(konum)             tek parmakla basılı tutma
//   onKaydir(yon, parmak)        hızlı kaydırma: 'sag', 'sol', 'yukari', 'asagi'
//   onSurukle(mod, dx, dy, bilgi) sürükleme sürerken ('tek' ya da 'iki' parmak).
//                                bilgi: { x, y (parmağın şu anki yeri), sure (ms) }
//   onSurukleBitti(mod)          sürükleme bitince
//
// dokunmaBekle: true ise tek dokunuş, çift dokunuş olmadığı anlaşılana kadar bekletilir.
// Böylece çift dokunuşun ilk dokunuşu yanlışlıkla başka bir şey yapmaz.
import { useRef } from 'react';

const HAREKET_ESIGI = 18; // piksel; bundan az kayan dokunuş "dokunma" sayılır
const UZUN_BASMA = 650;
// Çift dokunuş: ilk dokunuşun bitişiyle ikinci dokunuşun başlangıcı arasındaki en uzun süre (ms).
// İkinci dokunuş başladıysa, parmaklar ne zaman kalkarsa kalksın bekleme sürer.
const CIFT_ARALIK = 450;
const CIFT_UZAKLIK = 90; // tek parmakla çift dokunuşun iki dokunuşu en çok bu kadar uzak olabilir
const CIFT_UZAKLIK_IKI = 170; // iki parmakla çift dokunuşta (parmakların ortası ölçülür)

function ortalama(dokunuslar) {
  let x = 0;
  let y = 0;
  for (const d of dokunuslar) {
    x += d.pageX;
    y += d.pageY;
  }
  const n = Math.max(1, dokunuslar.length);
  return { x: x / n, y: y / n };
}

export function useJestler(geriCagirmalar, secenekler = {}) {
  const cb = useRef(geriCagirmalar);
  cb.current = geriCagirmalar;
  const sec = useRef(secenekler);
  sec.current = secenekler;
  const d = useRef(null);
  const bekleyen = useRef(null); // çift dokunuş için bekleyen ilk dokunuş

  const uzunIptal = (s) => {
    if (s && s.uzunZamanlayici) {
      clearTimeout(s.uzunZamanlayici);
      s.uzunZamanlayici = null;
    }
  };

  // Bekleyen tek dokunuşu hemen tek dokunuş olarak işler
  const bekleyeniBosalt = () => {
    const b = bekleyen.current;
    if (!b) return;
    if (b.zamanlayici) clearTimeout(b.zamanlayici);
    bekleyen.current = null;
    if (sec.current.dokunmaBekle && cb.current.onDokun) cb.current.onDokun(b.parmak, b.konum);
  };

  const basla = (e) => {
    // Yeni dokunuş başladı: bekleyen tek dokunuş, bu dokunuşun ne olduğu anlaşılana kadar bekler
    const bk = bekleyen.current;
    if (bk && bk.zamanlayici) {
      clearTimeout(bk.zamanlayici);
      bk.zamanlayici = null;
    }
    const dokunuslar = e.nativeEvent.touches || [];
    const m = ortalama(dokunuslar);
    const s = {
      t0: Date.now(),
      bazX: m.x,
      bazY: m.y,
      merkezX: m.x,
      merkezY: m.y,
      sonSayi: dokunuslar.length,
      yerelX: e.nativeEvent.locationX,
      yerelY: e.nativeEvent.locationY,
      enCokParmak: Math.max(1, dokunuslar.length),
      mod: null,
      tuketildi: false,
      dx: 0,
      dy: 0,
      uzunZamanlayici: null,
    };
    d.current = s;
    s.uzunZamanlayici = setTimeout(() => {
      if (d.current === s && !s.mod && !s.tuketildi && s.enCokParmak === 1 && cb.current.onUzunBas) {
        s.tuketildi = true;
        cb.current.onUzunBas({ x: s.yerelX, y: s.yerelY });
      }
    }, UZUN_BASMA);
  };

  const parmakEklendi = (e) => {
    const s = d.current;
    if (!s) return;
    const dokunuslar = e.nativeEvent.touches || [];
    if (dokunuslar.length > 1 && !s.mod) {
      // İkinci parmak değince dokunuşun yeri iki parmağın ortası olur
      const m = ortalama(dokunuslar);
      s.merkezX = m.x;
      s.merkezY = m.y;
      s.bazX = m.x - s.dx;
      s.bazY = m.y - s.dy;
      s.sonSayi = dokunuslar.length;
    }
    s.enCokParmak = Math.max(s.enCokParmak, dokunuslar.length);
    if (s.enCokParmak > 1) uzunIptal(s);
  };

  const hareket = (e) => {
    const s = d.current;
    if (!s) return;
    const dokunuslar = e.nativeEvent.touches || [];
    if (dokunuslar.length === 0) return;
    s.enCokParmak = Math.max(s.enCokParmak, dokunuslar.length);
    const m = ortalama(dokunuslar);
    // Parmak sayısı değişince ortalama nokta zıplamasın diye taban noktası kaydırılır
    if (dokunuslar.length !== s.sonSayi) {
      s.bazX = m.x - s.dx;
      s.bazY = m.y - s.dy;
      s.sonSayi = dokunuslar.length;
    }
    s.dx = m.x - s.bazX;
    s.dy = m.y - s.bazY;
    if (!s.mod && !s.tuketildi && Math.hypot(s.dx, s.dy) > HAREKET_ESIGI) {
      s.mod = s.enCokParmak >= 2 ? 'iki' : 'tek';
      uzunIptal(s);
    }
    if (s.mod && cb.current.onSurukle) {
      cb.current.onSurukle(s.mod, s.dx, s.dy, { x: s.yerelX + s.dx, y: s.yerelY + s.dy, sure: Date.now() - s.t0 });
    }
  };

  const tekDokunusIsle = (parmak, konum) => {
    if (cb.current.onDokun) cb.current.onDokun(parmak, konum);
  };

  const bitir = () => {
    const s = d.current;
    d.current = null;
    if (!s) return;
    uzunIptal(s);
    const sure = Date.now() - s.t0;
    if (s.mod) {
      bekleyeniBosalt();
      const uz = Math.hypot(s.dx, s.dy);
      if (sure < 450 && uz > 40 && cb.current.onKaydir) {
        const yon = Math.abs(s.dx) > Math.abs(s.dy) ? (s.dx > 0 ? 'sag' : 'sol') : s.dy > 0 ? 'asagi' : 'yukari';
        cb.current.onKaydir(yon, s.enCokParmak);
      }
      if (cb.current.onSurukleBitti) cb.current.onSurukleBitti(s.mod);
      return;
    }
    if (s.tuketildi || sure > UZUN_BASMA) {
      bekleyeniBosalt();
      return;
    }
    const parmak = Math.min(2, s.enCokParmak);
    const konum = { x: s.yerelX, y: s.yerelY };
    const merkez = { x: s.merkezX, y: s.merkezY };
    const ciftVar = !!cb.current.onCiftDokun;
    const b = bekleyen.current;
    const simdi = Date.now();

    const sinir = parmak >= 2 ? CIFT_UZAKLIK_IKI : CIFT_UZAKLIK;
    if (ciftVar && b && b.parmak === parmak && s.t0 - b.zaman < CIFT_ARALIK && Math.hypot(b.merkez.x - merkez.x, b.merkez.y - merkez.y) < sinir) {
      if (b.zamanlayici) clearTimeout(b.zamanlayici);
      bekleyen.current = null;
      cb.current.onCiftDokun(parmak, b.konum);
      return;
    }
    // Farklı türde bir dokunuş geldi; bekleyen tek dokunuşu hemen işle
    bekleyeniBosalt();
    if (!ciftVar) {
      tekDokunusIsle(parmak, konum);
      return;
    }
    if (!sec.current.dokunmaBekle) tekDokunusIsle(parmak, konum);
    const yeni = { zaman: simdi, parmak, konum, merkez, zamanlayici: null };
    yeni.zamanlayici = setTimeout(() => {
      if (bekleyen.current !== yeni || d.current) return; // ikinci dokunuş sürüyorsa bekle
      bekleyen.current = null;
      if (sec.current.dokunmaBekle) tekDokunusIsle(parmak, konum);
    }, CIFT_ARALIK);
    bekleyen.current = yeni;
  };

  const iptal = () => {
    const s = d.current;
    d.current = null;
    uzunIptal(s);
    bekleyeniBosalt();
    if (s && s.mod && cb.current.onSurukleBitti) cb.current.onSurukleBitti(s.mod);
  };

  return {
    onStartShouldSetResponder: () => true,
    onMoveShouldSetResponder: () => true,
    onResponderTerminationRequest: () => false,
    onResponderGrant: basla,
    onResponderStart: parmakEklendi,
    onResponderMove: hareket,
    onResponderRelease: bitir,
    onResponderTerminate: iptal,
  };
}
