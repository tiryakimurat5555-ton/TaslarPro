// ==== 3B SAHNE (expo-gl + three) ====
// Afrika savanı: otlaklar, gölet, nehir ve geçitleri, sulak alan, kayalık ve mağara, akasya ağaçlığı, istasyon, arazi aracı,
// hayvanlar (düşük poligonlu, sanatsal), gün ve gece ışığı. Mantık koordinatı (x doğu, y kuzey) three'de (x, 0, -y);
// yön (0 = kuzey) three'de rotation.y = -yon. Kamera araştırmacının arkasından ve üstünden bakar (üçüncü şahıs).
import * as THREE from 'three';
import { TURLER, YARICAP, GOLET, NEHIR_YARI, nehirY, GECITLER, MAGARA } from './veri.js';
import { isikDuzeyi } from './mantik.js';

const R = (y) => -y;
const malzemeler = new Map();
function mat(renk) {
  let m = malzemeler.get(renk);
  if (!m) {
    m = new THREE.MeshLambertMaterial({ color: renk, flatShading: true });
    malzemeler.set(renk, m);
  }
  return m;
}
function parca(g, geo, renk, x, y, z, rx = 0, ry = 0, rz = 0) {
  const m = new THREE.Mesh(geo, mat(renk));
  m.position.set(x, y, z);
  m.rotation.set(rx, ry, rz);
  g.add(m);
  return m;
}

// ---- İnsan ve araç ----
function insanModeli(govdeRengi) {
  const g = new THREE.Group();
  parca(g, new THREE.CylinderGeometry(0.3, 0.34, 0.9, 8), govdeRengi, 0, 0.95, 0);
  parca(g, new THREE.SphereGeometry(0.23, 10, 8), '#c99a72', 0, 1.6, 0);
  parca(g, new THREE.CylinderGeometry(0.42, 0.42, 0.05, 10), '#a08a5a', 0, 1.78, 0); // safari şapkası
  parca(g, new THREE.CylinderGeometry(0.22, 0.24, 0.18, 10), '#a08a5a', 0, 1.86, 0);
  parca(g, new THREE.BoxGeometry(0.16, 0.5, 0.18), '#5a4e3a', -0.13, 0.25, 0);
  parca(g, new THREE.BoxGeometry(0.16, 0.5, 0.18), '#5a4e3a', 0.13, 0.25, 0);
  parca(g, new THREE.BoxGeometry(0.12, 0.58, 0.12), govdeRengi, -0.4, 1.02, 0);
  parca(g, new THREE.BoxGeometry(0.12, 0.58, 0.12), govdeRengi, 0.4, 1.02, 0);
  parca(g, new THREE.BoxGeometry(0.22, 0.12, 0.14), '#222', 0, 1.3, -0.3); // boyundaki dürbün
  parca(g, new THREE.BoxGeometry(0.32, 0.42, 0.18), '#6a5a40', 0, 1.0, 0.3); // sırt çantası
  return g;
}
function aracModeli() {
  const g = new THREE.Group();
  parca(g, new THREE.BoxGeometry(2.0, 0.9, 4.2), '#d8cfae', 0, 0.95, 0);
  parca(g, new THREE.BoxGeometry(1.85, 0.75, 2.0), '#cfc6a4', 0, 1.75, 0.35);
  parca(g, new THREE.BoxGeometry(1.7, 0.5, 0.05), '#3a4a5a', 0, 1.8, -0.66); // ön cam
  parca(g, new THREE.BoxGeometry(1.95, 0.08, 2.1), '#5a5040', 0, 2.17, 0.35); // tavan rafı
  parca(g, new THREE.BoxGeometry(0.4, 0.3, 0.6), '#4a5a3a', 0.5, 2.36, 0.6); // kamp malzemesi
  [-1, 1].forEach((sx) =>
    [-1, 1].forEach((sz) => parca(g, new THREE.CylinderGeometry(0.45, 0.45, 0.35, 10), '#222', sx * 1.0, 0.45, sz * 1.35, 0, 0, Math.PI / 2))
  );
  parca(g, new THREE.BoxGeometry(0.3, 0.2, 0.05), '#fff6c8', -0.65, 1.0, -2.11);
  parca(g, new THREE.BoxGeometry(0.3, 0.2, 0.05), '#fff6c8', 0.65, 1.0, -2.11);
  return g;
}

// ---- Hayvanlar ----
function gozler(g, b, x, y, z, renk = '#1a1a1a') {
  parca(g, new THREE.BoxGeometry(0.07 * b, 0.07 * b, 0.04 * b), renk, -x * b, y * b, z * b);
  parca(g, new THREE.BoxGeometry(0.07 * b, 0.07 * b, 0.04 * b), renk, x * b, y * b, z * b);
}
function dortAyak(g, b, renk, bacak, araX, araZ, kalin = 0.14) {
  [-1, 1].forEach((sx) =>
    [-1, 1].forEach((sz) => {
      const a = parca(g, new THREE.BoxGeometry(kalin * b, bacak * b, kalin * b), renk, sx * araX * b, (bacak / 2) * b, sz * araZ * b);
      a.userData.bacak = sx * sz;
    })
  );
}
function hayvanModeli(b) {
  const t = TURLER[b.tur];
  const s = t.boy;
  const r = t.renk;
  const g = new THREE.Group();
  const erkek = b.cinsiyet === 'erkek';
  switch (t.sekil) {
    case 'kedi':
      parca(g, new THREE.BoxGeometry(0.5 * s, 0.45 * s, 1.4 * s), r, 0, 0.75 * s, 0);
      parca(g, new THREE.BoxGeometry(0.42 * s, 0.4 * s, 0.42 * s), r, 0, 0.98 * s, -0.82 * s);
      if (b.tur === 'aslan' && erkek && b.evre !== 'yavru') parca(g, new THREE.DodecahedronGeometry(0.42 * s, 0), '#7a4a1e', 0, 0.98 * s, -0.68 * s);
      if (b.tur === 'leopar') for (let i = 0; i < 6; i++) parca(g, new THREE.BoxGeometry(0.1 * s, 0.03 * s, 0.1 * s), '#3a2a18', (i % 2 ? 0.12 : -0.12) * s, 0.99 * s, (-0.5 + i * 0.2) * s);
      parca(g, new THREE.BoxGeometry(0.08 * s, 0.08 * s, 0.9 * s), r, 0, 0.85 * s, 1.05 * s, 0.5);
      gozler(g, s, 0.11, 1.05, -1.04, '#c8f05a');
      dortAyak(g, s, r, 0.55, 0.18, 0.5);
      break;
    case 'fil':
      parca(g, new THREE.BoxGeometry(1.3 * s, 1.2 * s, 2.0 * s), r, 0, 1.6 * s, 0);
      parca(g, new THREE.BoxGeometry(0.8 * s, 0.8 * s, 0.7 * s), r, 0, 1.9 * s, -1.25 * s);
      parca(g, new THREE.BoxGeometry(0.9 * s, 0.9 * s, 0.08 * s), '#7a7570', -0.65 * s, 1.95 * s, -1.05 * s, 0, 0.5, 0); // kulak
      parca(g, new THREE.BoxGeometry(0.9 * s, 0.9 * s, 0.08 * s), '#7a7570', 0.65 * s, 1.95 * s, -1.05 * s, 0, -0.5, 0);
      parca(g, new THREE.CylinderGeometry(0.12 * s, 0.2 * s, 1.3 * s, 6), r, 0, 1.15 * s, -1.65 * s, 0.25); // hortum
      if (b.evre !== 'yavru') {
        parca(g, new THREE.ConeGeometry(0.06 * s, 0.6 * s, 5), '#f0ead8', -0.25 * s, 1.45 * s, -1.65 * s, -1.2);
        parca(g, new THREE.ConeGeometry(0.06 * s, 0.6 * s, 5), '#f0ead8', 0.25 * s, 1.45 * s, -1.65 * s, -1.2);
      }
      gozler(g, s, 0.3, 2.05, -1.61);
      dortAyak(g, s, r, 1.05, 0.45, 0.7, 0.32);
      break;
    case 'zurafa':
      parca(g, new THREE.BoxGeometry(0.7 * s, 0.75 * s, 1.5 * s), r, 0, 2.1 * s, 0);
      parca(g, new THREE.BoxGeometry(0.28 * s, 2.0 * s, 0.3 * s), r, 0, 3.2 * s, -0.75 * s, -0.35);
      parca(g, new THREE.BoxGeometry(0.3 * s, 0.3 * s, 0.6 * s), r, 0, 4.15 * s, -1.25 * s);
      parca(g, new THREE.CylinderGeometry(0.04 * s, 0.04 * s, 0.25 * s, 4), '#5a3a1a', -0.08 * s, 4.4 * s, -1.15 * s);
      parca(g, new THREE.CylinderGeometry(0.04 * s, 0.04 * s, 0.25 * s, 4), '#5a3a1a', 0.08 * s, 4.4 * s, -1.15 * s);
      for (let i = 0; i < 8; i++) parca(g, new THREE.BoxGeometry(0.2 * s, 0.03 * s, 0.2 * s), '#7a4a1a', ((i % 3) - 1) * 0.22 * s, 2.49 * s, (-0.55 + i * 0.15) * s);
      gozler(g, s, 0.16, 4.2, -1.35);
      dortAyak(g, s, r, 1.75, 0.25, 0.55, 0.13);
      break;
    case 'zebra':
      parca(g, new THREE.BoxGeometry(0.55 * s, 0.6 * s, 1.4 * s), r, 0, 1.15 * s, 0);
      for (let i = 0; i < 6; i++) parca(g, new THREE.BoxGeometry(0.57 * s, 0.62 * s, 0.07 * s), '#1a1a1a', 0, 1.15 * s, (-0.55 + i * 0.22) * s);
      parca(g, new THREE.BoxGeometry(0.25 * s, 0.75 * s, 0.3 * s), r, 0, 1.65 * s, -0.7 * s, -0.5);
      parca(g, new THREE.BoxGeometry(0.26 * s, 0.3 * s, 0.6 * s), r, 0, 1.95 * s, -1.05 * s);
      parca(g, new THREE.BoxGeometry(0.06 * s, 0.6 * s, 0.25 * s), '#1a1a1a', 0, 1.9 * s, -0.68 * s, -0.5); // yele
      gozler(g, s, 0.13, 2.0, -1.2);
      dortAyak(g, s, '#d8d6d0', 0.85, 0.18, 0.5, 0.12);
      break;
    case 'ceylan':
      parca(g, new THREE.BoxGeometry(0.4 * s, 0.45 * s, 1.0 * s), r, 0, 0.95 * s, 0);
      parca(g, new THREE.BoxGeometry(0.42 * s, 0.08 * s, 0.9 * s), '#1a1a1a', 0, 0.92 * s, 0); // yan şerit
      parca(g, new THREE.BoxGeometry(0.38 * s, 0.15 * s, 0.9 * s), '#f2ece0', 0, 0.75 * s, 0);
      parca(g, new THREE.BoxGeometry(0.18 * s, 0.5 * s, 0.2 * s), r, 0, 1.3 * s, -0.5 * s, -0.3);
      parca(g, new THREE.BoxGeometry(0.2 * s, 0.22 * s, 0.4 * s), r, 0, 1.55 * s, -0.7 * s);
      parca(g, new THREE.ConeGeometry(0.03 * s, 0.4 * s, 4), '#2a2018', -0.06 * s, 1.85 * s, -0.62 * s, 0.3);
      parca(g, new THREE.ConeGeometry(0.03 * s, 0.4 * s, 4), '#2a2018', 0.06 * s, 1.85 * s, -0.62 * s, 0.3);
      gozler(g, s, 0.1, 1.6, -0.86);
      dortAyak(g, s, r, 0.75, 0.13, 0.38, 0.08);
      break;
    case 'domuz':
      parca(g, new THREE.BoxGeometry(0.55 * s, 0.55 * s, 1.15 * s), r, 0, 0.75 * s, 0);
      parca(g, new THREE.BoxGeometry(0.45 * s, 0.4 * s, 0.5 * s), r, 0, 0.7 * s, -0.75 * s);
      parca(g, new THREE.ConeGeometry(0.05 * s, 0.3 * s, 4), '#f0ead8', -0.2 * s, 0.68 * s, -1.0 * s, -1.0);
      parca(g, new THREE.ConeGeometry(0.05 * s, 0.3 * s, 4), '#f0ead8', 0.2 * s, 0.68 * s, -1.0 * s, -1.0);
      parca(g, new THREE.BoxGeometry(0.06 * s, 0.25 * s, 0.4 * s), '#2a2018', 0, 1.05 * s, -0.2 * s); // yele
      const kuyruk = parca(g, new THREE.BoxGeometry(0.04 * s, 0.4 * s, 0.04 * s), r, 0, 1.0 * s, 0.6 * s);
      kuyruk.userData.kuyruk = true;
      gozler(g, s, 0.15, 0.85, -0.99);
      dortAyak(g, s, r, 0.48, 0.18, 0.42);
      break;
    case 'suaygiri':
      parca(g, new THREE.BoxGeometry(1.1 * s, 0.85 * s, 1.9 * s), r, 0, 0.85 * s, 0);
      parca(g, new THREE.BoxGeometry(0.8 * s, 0.6 * s, 0.8 * s), r, 0, 0.9 * s, -1.25 * s);
      parca(g, new THREE.BoxGeometry(0.85 * s, 0.35 * s, 0.4 * s), '#a08080', 0, 0.75 * s, -1.6 * s);
      parca(g, new THREE.SphereGeometry(0.08 * s, 5, 4), r, -0.25 * s, 1.25 * s, -1.1 * s);
      parca(g, new THREE.SphereGeometry(0.08 * s, 5, 4), r, 0.25 * s, 1.25 * s, -1.1 * s);
      gozler(g, s, 0.25, 1.15, -1.5);
      dortAyak(g, s, r, 0.45, 0.4, 0.65, 0.26);
      break;
    case 'manda':
      parca(g, new THREE.BoxGeometry(0.9 * s, 0.85 * s, 1.6 * s), r, 0, 1.05 * s, 0);
      parca(g, new THREE.BoxGeometry(0.5 * s, 0.5 * s, 0.55 * s), r, 0, 1.0 * s, -1.0 * s);
      if (b.evre !== 'yavru') {
        parca(g, new THREE.TorusGeometry(0.3 * s, 0.06 * s, 4, 8, Math.PI), '#3a3430', -0.25 * s, 1.25 * s, -0.95 * s, 0, Math.PI / 2, 0);
        parca(g, new THREE.TorusGeometry(0.3 * s, 0.06 * s, 4, 8, Math.PI), '#3a3430', 0.25 * s, 1.25 * s, -0.95 * s, 0, -Math.PI / 2, 0);
      }
      gozler(g, s, 0.18, 1.08, -1.28, '#7a0a0a');
      dortAyak(g, s, r, 0.65, 0.3, 0.6, 0.18);
      break;
    case 'gergedan':
      parca(g, new THREE.BoxGeometry(0.95 * s, 0.8 * s, 1.7 * s), r, 0, 0.95 * s, 0);
      parca(g, new THREE.BoxGeometry(0.55 * s, 0.5 * s, 0.75 * s), r, 0, 0.8 * s, -1.1 * s);
      parca(g, new THREE.ConeGeometry(0.11 * s, 0.55 * s, 5), '#e6e0cf', 0, 1.2 * s, -1.38 * s, -0.4);
      parca(g, new THREE.ConeGeometry(0.07 * s, 0.25 * s, 5), '#e6e0cf', 0, 1.15 * s, -1.05 * s, -0.2);
      gozler(g, s, 0.22, 0.95, -1.25);
      dortAyak(g, s, r, 0.55, 0.32, 0.58, 0.2);
      break;
    case 'timsah':
      parca(g, new THREE.BoxGeometry(0.6 * s, 0.3 * s, 1.8 * s), r, 0, 0.3 * s, 0);
      parca(g, new THREE.BoxGeometry(0.4 * s, 0.22 * s, 0.9 * s), r, 0, 0.28 * s, -1.3 * s);
      parca(g, new THREE.ConeGeometry(0.25 * s, 1.4 * s, 4), r, 0, 0.25 * s, 1.55 * s, Math.PI / 2);
      gozler(g, s, 0.12, 0.45, -0.95, '#d8c040');
      dortAyak(g, s, r, 0.2, 0.36, 0.55);
      break;
    case 'yilan':
      for (let i = 0; i < 9; i++) {
        const p = parca(g, new THREE.SphereGeometry((0.18 - i * 0.012) * s, 6, 5), i % 2 ? '#4a3a24' : r, Math.sin(i * 1.1) * 0.25 * s, 0.14 * s, (-0.6 + i * 0.28) * s);
        p.userData.yilan = i;
      }
      parca(g, new THREE.BoxGeometry(0.24 * s, 0.14 * s, 0.3 * s), r, 0, 0.2 * s, -0.85 * s);
      gozler(g, s, 0.07, 0.28, -0.98, '#e0c040');
      break;
    case 'kus': {
      const govde = new THREE.Group();
      parca(govde, new THREE.BoxGeometry(0.35 * s, 0.3 * s, 0.8 * s), r, 0, 0, 0);
      parca(govde, new THREE.BoxGeometry(0.26 * s, 0.26 * s, 0.3 * s), '#f4f2ec', 0, 0.12 * s, -0.48 * s);
      parca(govde, new THREE.BoxGeometry(0.3 * s, 0.1 * s, 0.3 * s), '#f4f2ec', 0, 0.05 * s, 0.45 * s);
      parca(govde, new THREE.ConeGeometry(0.06 * s, 0.18 * s, 4), '#e8b33a', 0, 0.1 * s, -0.7 * s, -Math.PI / 2);
      const k1 = parca(govde, new THREE.BoxGeometry(1.2 * s, 0.04 * s, 0.45 * s), r, -0.75 * s, 0.05 * s, 0);
      const k2 = parca(govde, new THREE.BoxGeometry(1.2 * s, 0.04 * s, 0.45 * s), r, 0.75 * s, 0.05 * s, 0);
      k1.userData.kanat = -1;
      k2.userData.kanat = 1;
      govde.userData.kusGovde = true;
      g.add(govde);
      break;
    }
    default:
      // Sırtlan: önü yüksek, arkası alçak
      parca(g, new THREE.BoxGeometry(0.5 * s, 0.55 * s, 1.2 * s), r, 0, 0.8 * s, 0, 0.12);
      for (let i = 0; i < 5; i++) parca(g, new THREE.BoxGeometry(0.1 * s, 0.03 * s, 0.1 * s), '#3a3020', (i % 2 ? 0.12 : -0.1) * s, 1.1 * s, (-0.4 + i * 0.2) * s);
      parca(g, new THREE.BoxGeometry(0.38 * s, 0.38 * s, 0.48 * s), r, 0, 1.0 * s, -0.8 * s);
      parca(g, new THREE.BoxGeometry(0.22 * s, 0.18 * s, 0.25 * s), '#3a3020', 0, 0.92 * s, -1.12 * s);
      parca(g, new THREE.SphereGeometry(0.1 * s, 5, 4), r, -0.14 * s, 1.25 * s, -0.75 * s);
      parca(g, new THREE.SphereGeometry(0.1 * s, 5, 4), r, 0.14 * s, 1.25 * s, -0.75 * s);
      gozler(g, s, 0.1, 1.05, -1.05);
      dortAyak(g, s, r, 0.55, 0.18, 0.45);
  }
  const olcek = b.evre === 'yavru' ? 0.5 : b.evre === 'genc' ? 0.78 : 1;
  g.scale.setScalar(olcek);
  g.userData.olcek = olcek;
  return g;
}

// Nehir şeridi: nehirY eğrisini izleyen düz bir şerit
function seritGeo(yari, x0, x1, adim, yKaydir = 0) {
  const noktalar = [];
  const indisler = [];
  let i = 0;
  for (let x = x0; x <= x1; x += adim) {
    const y = nehirY(x) + yKaydir;
    noktalar.push(x, 0, R(y + yari), x, 0, R(y - yari));
    if (i > 0) {
      const a = (i - 1) * 2;
      indisler.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
    }
    i++;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(noktalar, 3));
  geo.setIndex(indisler);
  geo.computeVertexNormals();
  return geo;
}

const renkKarisim = (a, b, t) => new THREE.Color(a).lerp(new THREE.Color(b), t);

export function sahneKur(gl, d) {
  const genislik = gl.drawingBufferWidth;
  const yukseklik = gl.drawingBufferHeight;
  const tuval = {
    width: genislik,
    height: yukseklik,
    clientWidth: genislik,
    clientHeight: yukseklik,
    style: {},
    addEventListener() {},
    removeEventListener() {},
    getContext: () => gl,
  };
  const ciz = new THREE.WebGLRenderer({ canvas: tuval, context: gl, antialias: false });
  ciz.setPixelRatio(1);
  ciz.setSize(genislik, yukseklik, false);

  const sahne = new THREE.Scene();
  sahne.background = new THREE.Color('#9ec9ea');
  sahne.fog = new THREE.Fog('#9ec9ea', 60, 170);
  // Dikey ekran: alt yarıyı düğmeler kapladığı için görüntünün merkezi yukarı kaydırılır, görüş açısı genişletilir
  const kamera = new THREE.PerspectiveCamera(60, genislik / yukseklik, 0.1, 260);
  const merkezKaydir = (w, h) => {
    const dikey = h > w;
    kamera.fov = dikey ? 74 : 60;
    const o = Math.round(h * (dikey ? 0.14 : 0.06));
    kamera.setViewOffset(w, h + 2 * o, 0, 2 * o, w, h);
    kamera.updateProjectionMatrix();
  };
  merkezKaydir(genislik, yukseklik);

  const gok = new THREE.HemisphereLight('#eaf4ff', '#6a5a3a', 1.1);
  sahne.add(gok);
  const gunes = new THREE.DirectionalLight('#fff3dd', 1.3);
  gunes.position.set(40, 80, 20);
  sahne.add(gunes);

  // Zemin: savan otu; kuzeyde ağaçlık, güneyde sulak alan biraz farklı tonda
  const zemin = new THREE.Mesh(new THREE.CircleGeometry(YARICAP + 90, 72), mat('#b8a05a'));
  zemin.rotation.x = -Math.PI / 2;
  sahne.add(zemin);
  const yama = (x, y, r, renk, sx = 1, sy = 1) => {
    const m = new THREE.Mesh(new THREE.CircleGeometry(r, 28), mat(renk));
    m.rotation.x = -Math.PI / 2;
    m.position.set(x, 0.01, R(y));
    m.scale.set(sx, sy, 1);
    sahne.add(m);
  };
  yama(50, 135, 95, '#93924a', 1.4, 0.7);
  yama(0, -160, 120, '#6f7a44', 1.6, 0.6);
  yama(-115, 45, 38, '#a39070');
  yama(0, 0, 14, '#9a7e55');
  // Sulak alan çamur gölcükleri
  d.suslar.filter((s) => s.tur === 'camur').forEach((s) => yama(s.x, s.y, s.boy, '#5a5034'));

  // Nehir, kıyıları ve geçitleri
  const kiyi = new THREE.Mesh(seritGeo(NEHIR_YARI + 3, -YARICAP - 60, YARICAP + 60, 4), mat('#8a7a50'));
  kiyi.position.y = 0.02;
  sahne.add(kiyi);
  const su = new THREE.Mesh(seritGeo(NEHIR_YARI, -YARICAP - 60, YARICAP + 60, 4), new THREE.MeshLambertMaterial({ color: '#4a7a8a' }));
  su.position.y = 0.04;
  sahne.add(su);
  GECITLER.forEach((gc) => {
    const tas = new THREE.Mesh(new THREE.PlaneGeometry(gc.yari * 2, NEHIR_YARI * 2 + 1), mat('#9a9070'));
    tas.rotation.x = -Math.PI / 2;
    tas.position.set(gc.x, 0.06, R(nehirY(gc.x)));
    sahne.add(tas);
  });
  // Gölet
  const goletKiyi = new THREE.Mesh(new THREE.CircleGeometry(GOLET.r + 2.5, 28), mat('#7a6a44'));
  goletKiyi.rotation.x = -Math.PI / 2;
  goletKiyi.position.set(GOLET.x, 0.03, R(GOLET.y));
  sahne.add(goletKiyi);
  const golet = new THREE.Mesh(new THREE.CircleGeometry(GOLET.r, 28), new THREE.MeshLambertMaterial({ color: '#4d7f86' }));
  golet.rotation.x = -Math.PI / 2;
  golet.position.set(GOLET.x, 0.05, R(GOLET.y));
  sahne.add(golet);

  // Haritanın kenarı: uzak tepeler
  const m4 = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const olcek = new THREE.Vector3();
  const yer = new THREE.Vector3();
  const sinirSayi = 70;
  const sinir = new THREE.InstancedMesh(new THREE.DodecahedronGeometry(6, 0), mat('#8a7a5a'), sinirSayi);
  for (let i = 0; i < sinirSayi; i++) {
    const a = (i / sinirSayi) * Math.PI * 2;
    const s = 1 + ((i * 37) % 7) / 5;
    q.identity();
    olcek.set(s * 1.6, s * 0.8, s * 1.6);
    yer.set(Math.sin(a) * (YARICAP + 14), 1.5 * s, R(Math.cos(a) * (YARICAP + 14)));
    m4.compose(yer, q, olcek);
    sinir.setMatrixAt(i, m4);
  }
  sahne.add(sinir);

  // Ağaçlar, kayalar, otlar: örneklenmiş çizim
  const ornekle = (geo, renk, liste, yerlestir) => {
    if (!liste.length) return;
    const im = new THREE.InstancedMesh(geo, mat(renk), liste.length);
    liste.forEach((e, i) => {
      yerlestir(e, i);
      m4.compose(yer, q, olcek);
      im.setMatrixAt(i, m4);
    });
    sahne.add(im);
  };
  const dik = (y) => (e) => {
    q.identity();
    olcek.set(e.boy, e.boy, e.boy);
    yer.set(e.x, y * e.boy, R(e.y));
  };
  const agaclar = d.engeller.filter((e) => e.tur === 'agac');
  const akasya = agaclar.filter((e) => e.agacTur === 'akasya');
  const kiyiAgac = agaclar.filter((e) => e.agacTur === 'kiyi');
  ornekle(new THREE.CylinderGeometry(0.18, 0.28, 3.2, 6), '#5e4128', akasya, dik(1.6));
  ornekle(new THREE.CylinderGeometry(3.0, 2.2, 0.7, 9), '#6e8a32', akasya, dik(3.4));
  ornekle(new THREE.CylinderGeometry(0.25, 0.35, 4.2, 6), '#5a4a38', kiyiAgac, dik(2.1));
  ornekle(new THREE.IcosahedronGeometry(2.2, 0), '#4d7a34', kiyiAgac, dik(4.8));
  ornekle(new THREE.DodecahedronGeometry(1, 0), '#9a9184', d.engeller.filter((e) => e.tur === 'kaya'), (e) => {
    q.setFromEuler(new THREE.Euler(0, e.x * 0.37, 0));
    olcek.set(e.r, e.r * (e.magara ? 1.4 : 0.85), e.r);
    yer.set(e.x, e.r * (e.magara ? 0.9 : 0.4), R(e.y));
  });
  ornekle(new THREE.ConeGeometry(0.12, 1.4, 3), '#7c8a4a', d.suslar.filter((s) => s.tur === 'saz'), dik(0.7));
  ornekle(new THREE.IcosahedronGeometry(0.7, 0), '#7a7a3a', d.suslar.filter((s) => s.tur === 'cali'), (e) => {
    q.identity();
    olcek.set(e.boy, e.boy * 0.6, e.boy);
    yer.set(e.x, 0.35 * e.boy, R(e.y));
  });
  // Mağara ağzı
  const magara = new THREE.Mesh(new THREE.BoxGeometry(3.2, 2.6, 0.4), new THREE.MeshBasicMaterial({ color: '#0e0c0a' }));
  magara.position.set(MAGARA.x, 1.3, R(MAGARA.y + 0.4));
  sahne.add(magara);

  // İstasyon
  const ist = new THREE.Group();
  d.engeller
    .filter((e) => e.tur === 'bina')
    .forEach((e) => {
      if (e.ad === 'Çadır') parca(ist, new THREE.ConeGeometry(2.2, 2.4, 4), '#7a6a44', e.x, 1.2, R(e.y), 0, Math.PI / 4, 0);
      else {
        parca(ist, new THREE.BoxGeometry(e.r * 1.6, 2.6, e.r * 1.6), e.ad === 'Garaj' ? '#8a8270' : '#e8e2d0', e.x, 1.3, R(e.y));
        parca(ist, new THREE.BoxGeometry(e.r * 1.8, 0.2, e.r * 1.8), '#5a4a38', e.x, 2.7, R(e.y));
      }
    });
  parca(ist, new THREE.CylinderGeometry(0.06, 0.06, 6, 4), '#aaa', -8, 3, R(6)); // telsiz anteni
  parca(ist, new THREE.SphereGeometry(0.25, 6, 4), '#d84a3a', -8, 6.1, R(6));
  const isik = parca(ist, new THREE.SphereGeometry(0.2, 6, 4), '#fff3c0', -2, 2.3, R(-5.5));
  sahne.add(ist);

  // Araç ve araştırmacı
  const arac = aracModeli();
  sahne.add(arac);
  const insan = insanModeli('#8a8058');
  sahne.add(insan);

  // Hayvanlar: gerektikçe kurulur (doğumlar sonradan eklenir)
  const modeller = new Map();
  const modelAl = (b) => {
    let mm = modeller.get(b.id);
    if (!mm) {
      const m = hayvanModeli(b);
      m.position.set(b.x, 0, R(b.y));
      sahne.add(m);
      mm = { m, adim: Math.random() * 6, evre: b.evre };
      modeller.set(b.id, mm);
    }
    return mm;
  };

  // Gözlem halkası (görerek oynayan için)
  const halka = new THREE.Mesh(new THREE.RingGeometry(1.1, 1.35, 24), new THREE.MeshBasicMaterial({ color: '#ffd34d', side: THREE.DoubleSide }));
  halka.rotation.x = -Math.PI / 2;
  halka.visible = false;
  sahne.add(halka);

  const kamHedef = new THREE.Vector3();
  const kamKonum = new THREE.Vector3();
  let ilk = true;
  let saat = 0;
  const gunduzGok = new THREE.Color('#9ec9ea');
  const geceGok = new THREE.Color('#0d1626');
  const alacaGok = new THREE.Color('#e8a070');
  const gokRenk = new THREE.Color();

  return {
    boyut(w, h) {
      ciz.setSize(w, h, false);
      kamera.aspect = w / h;
      merkezKaydir(w, h);
      kamera.updateProjectionMatrix();
    },
    efekt() {},
    kare(dt) {
      saat += dt;
      const o = d.oyuncu;
      const k = d.k;
      // Gün ışığı
      const l = isikDuzeyi(k.dk);
      const alaca = Math.max(0, 1 - Math.abs(l - 0.45) * 3) * (l < 1 ? 1 : 0);
      gokRenk.copy(geceGok).lerp(gunduzGok, l).lerp(alacaGok, alaca * 0.5);
      sahne.background.copy(gokRenk);
      sahne.fog.color.copy(gokRenk);
      sahne.fog.near = 20 + l * 50;
      sahne.fog.far = 80 + l * 100;
      gok.intensity = 0.28 + l * 0.85;
      gunes.intensity = 0.12 + l * 1.2;
      gunes.color.copy(renkKarisim('#9aaad8', '#fff3dd', l));
      isik.visible = l < 0.5;

      // Araç ve araştırmacı
      arac.position.set(k.arac.x, 0, R(k.arac.y));
      arac.rotation.y = -k.arac.yon;
      insan.visible = !k.aracta;
      insan.position.set(o.x, 0, R(o.y));
      insan.rotation.y = -o.yon;

      // Kamera
      const dikey = kamera.aspect < 1 ? 1.35 : 1; // dikey ekranda kamera biraz daha geride ve yüksekte
      const geri = (k.aracta ? 12 : 8) * dikey;
      kamKonum.set(o.x - Math.sin(o.yon) * geri, (k.aracta ? 6 : 4.4) * dikey, R(o.y - Math.cos(o.yon) * geri));
      kamHedef.set(o.x + Math.sin(o.yon) * 1.5, 1.5, R(o.y + Math.cos(o.yon) * 1.5));
      if (ilk) {
        kamera.position.copy(kamKonum);
        ilk = false;
      } else kamera.position.lerp(kamKonum, Math.min(1, dt * 5));
      kamera.lookAt(kamHedef);

      // Hayvanlar
      const lesVar = new Set(k.lesler.map((x) => x.bireyId));
      const goruldu = new Set();
      for (const b of k.hayvanlar) {
        const uzak = Math.abs(b.x - o.x) > 120 || Math.abs(b.y - o.y) > 120;
        if (uzak || (b.olu && !lesVar.has(b.id))) {
          const mm0 = modeller.get(b.id);
          if (mm0) mm0.m.visible = false;
          continue;
        }
        const mm = modelAl(b);
        goruldu.add(b.id);
        const m = mm.m;
        m.visible = true;
        const t = TURLER[b.tur];
        const dx = b.x - m.position.x;
        const dz = R(b.y) - m.position.z;
        const hareket = Math.hypot(dx, dz) / Math.max(dt, 0.001);
        let yuk = 0;
        if (t.suCanlisi && Math.abs(b.y - nehirY(b.x)) < NEHIR_YARI) yuk = -0.55 * t.boy * m.userData.olcek; // suyun içinde
        if (t.kus) yuk = b.davranis === 'suzuluyor' ? 14 + Math.sin(saat * 0.5 + b.id) : b.davranis === 'balikAvliyor' ? 1.5 + Math.abs(Math.sin(saat * 0.8)) * 8 : 4.6;
        m.position.set(b.x, yuk, R(b.y));
        m.rotation.y = -b.yon;
        m.rotation.z = b.olu ? Math.PI / 2 : 0;
        if (b.olu) m.position.y = 0.3;
        const yatik = b.davranis === 'uyuyor' || b.davranis === 'dinleniyor';
        mm.adim += dt * Math.min(14, hareket * 2.2);
        const sal = Math.sin(mm.adim) * Math.min(0.6, hareket * 0.12);
        m.children.forEach((p) => {
          if (p.userData.bacak) p.rotation.x = sal * p.userData.bacak;
          if (p.userData.yilan !== undefined) p.position.x = Math.sin(mm.adim + saat * 1.5 + p.userData.yilan * 1.1) * 0.25 * t.boy;
          if (p.userData.kuyruk) p.rotation.x = b.davranis === 'kaciyor' ? 0 : 0.9;
          if (p.userData.kusGovde) {
            p.children.forEach((kn) => {
              if (kn.userData.kanat) kn.rotation.z = (b.davranis === 'tunemis' ? 0.6 : Math.sin(saat * (b.davranis === 'suzuluyor' ? 2 : 9) + b.id) * 0.5) * kn.userData.kanat;
            });
          }
        });
        if (!b.olu && !t.kus) m.position.y += yatik ? -0.15 * t.boy * m.userData.olcek : 0;
      }
      const gb = d.gozlemId ? d.hayvanMap.get(d.gozlemId) : null;
      halka.visible = !!(gb && !gb.olu && goruldu.has(gb.id));
      if (halka.visible) {
        halka.position.set(gb.x, 0.08, R(gb.y));
        const bb = Math.max(0.8, TURLER[gb.tur].boy * 1.3);
        halka.scale.set(bb, bb, bb);
        halka.rotation.z = saat;
      }
      golet.material.color.setHSL(0.52, 0.28, 0.2 + l * 0.22);
      ciz.render(sahne, kamera);
      if (gl.endFrameEXP) gl.endFrameEXP();
    },
    birak() {
      ciz.dispose();
    },
  };
}
