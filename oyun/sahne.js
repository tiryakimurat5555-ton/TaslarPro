// ==== 3B SAHNE (expo-gl + three) ====
// Afrika savanı: otlaklar, gölet, nehir ve geçitleri, sulak alan, kayalık ve mağara, akasya ağaçlığı, istasyon, arazi aracı,
// hayvanlar (düşük poligonlu, sanatsal), gün ve gece ışığı. Mantık koordinatı (x doğu, y kuzey) three'de (x, 0, -y);
// yön (0 = kuzey) three'de rotation.y = -yon. Kamera araştırmacının arkasından ve üstünden bakar (üçüncü şahıs).
import * as THREE from 'three';
import { TURLER, YARICAP, GOLET, NEHIR_YARI, nehirY, GECITLER, MAGARA, OZEL_BIREYLER, TUZ_YALAGI, KUTUP } from './veri.js';
import { isikDuzeyi, kutupHavasi } from './mantik.js';
import * as Kt from './kutup.js';

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
// Aşama 18 (karar 24): garajdaki öteki araçlar. Önü -z (arazi aracıyla aynı).
const teker = (g, r, en, x, y, z) => parca(g, new THREE.CylinderGeometry(r, r, en, 10), '#222', x, y, z, 0, 0, Math.PI / 2);
function atvModeli() {
  const g = new THREE.Group();
  parca(g, new THREE.BoxGeometry(1.0, 0.45, 1.9), '#8a3a2a', 0, 0.75, 0); // gövde
  parca(g, new THREE.BoxGeometry(1.15, 0.12, 0.6), '#5a5a5a', 0, 1.02, -0.7); // ön raf
  parca(g, new THREE.BoxGeometry(1.15, 0.12, 0.6), '#5a5a5a', 0, 1.02, 0.7); // arka raf
  parca(g, new THREE.BoxGeometry(0.5, 0.18, 0.7), '#222', 0, 1.06, 0.05); // sele
  parca(g, new THREE.BoxGeometry(0.8, 0.05, 0.05), '#333', 0, 1.3, -0.45); // gidon
  parca(g, new THREE.BoxGeometry(0.45, 0.3, 0.4), '#4a5a3a', 0, 1.25, 0.75); // çanta
  [-1, 1].forEach((sx) => [-1, 1].forEach((sz) => teker(g, 0.36, 0.3, sx * 0.62, 0.36, sz * 0.62)));
  parca(g, new THREE.BoxGeometry(0.22, 0.14, 0.05), '#fff6c8', 0, 0.85, -0.97);
  return g;
}
function motosikletModeli() {
  const g = new THREE.Group();
  teker(g, 0.36, 0.12, 0, 0.36, -0.75);
  teker(g, 0.36, 0.14, 0, 0.36, 0.72);
  parca(g, new THREE.BoxGeometry(0.28, 0.35, 1.2), '#c8a020', 0, 0.78, 0); // depo ve gövde
  parca(g, new THREE.BoxGeometry(0.26, 0.12, 0.6), '#222', 0, 0.98, 0.25); // sele
  parca(g, new THREE.CylinderGeometry(0.03, 0.03, 0.8, 5), '#888', 0, 0.75, -0.62, 0.45, 0, 0); // ön çatal
  parca(g, new THREE.BoxGeometry(0.75, 0.04, 0.04), '#333', 0, 1.12, -0.48); // gidon
  parca(g, new THREE.BoxGeometry(0.16, 0.12, 0.05), '#fff6c8', 0, 1.0, -0.62);
  parca(g, new THREE.CylinderGeometry(0.05, 0.06, 0.6, 6), '#777', 0.16, 0.55, 0.45, Math.PI / 2, 0, 0); // egzoz
  return g;
}
function kamyonModeli() {
  const g = new THREE.Group();
  parca(g, new THREE.BoxGeometry(2.3, 1.2, 1.9), '#d8cfae', 0, 1.25, -2.1); // kabin
  parca(g, new THREE.BoxGeometry(2.0, 0.55, 0.05), '#3a4a5a', 0, 1.55, -3.06); // ön cam
  parca(g, new THREE.BoxGeometry(2.5, 2.1, 3.9), '#e8e4d4', 0, 1.75, 0.95); // laboratuvar kasası
  parca(g, new THREE.BoxGeometry(2.52, 0.18, 3.92), '#2f6a4a', 0, 1.3, 0.95); // yeşil şerit
  parca(g, new THREE.BoxGeometry(0.9, 0.08, 1.4), '#2a3a5a', 0, 2.84, 1.2); // güneş paneli
  parca(g, new THREE.CylinderGeometry(0.05, 0.05, 0.9, 5), '#888', 0.9, 3.2, 0.2); // anten
  parca(g, new THREE.BoxGeometry(0.05, 1.1, 0.7), '#6a6a5a', 1.27, 1.6, 2.1); // yan kapı
  [-1, 1].forEach((sx) => [-2.1, 0.3, 1.9].forEach((z) => teker(g, 0.5, 0.4, sx * 1.1, 0.5, z)));
  parca(g, new THREE.BoxGeometry(0.3, 0.2, 0.05), '#fff6c8', -0.75, 1.0, -3.06);
  parca(g, new THREE.BoxGeometry(0.3, 0.2, 0.05), '#fff6c8', 0.75, 1.0, -3.06);
  return g;
}
function araclarModeli() {
  const g = new THREE.Group();
  g.userData.turler = { arazi: aracModeli(), atv: atvModeli(), motosiklet: motosikletModeli(), kamyon: kamyonModeli() };
  Object.values(g.userData.turler).forEach((m) => g.add(m));
  return g;
}

// ---- Aşama 8: tekne, dron, saha kampı ----
function tekneModeli() {
  const g = new THREE.Group();
  parca(g, new THREE.BoxGeometry(1.3, 0.45, 4.0), '#7a5a3a', 0, 0.12, 0); // gövde
  parca(g, new THREE.BoxGeometry(1.1, 0.1, 3.6), '#5a4028', 0, 0.36, 0); // iç
  parca(g, new THREE.BoxGeometry(0.9, 0.38, 0.9), '#7a5a3a', 0, 0.12, -2.2, 0, Math.PI / 4, 0); // burun
  parca(g, new THREE.BoxGeometry(1.25, 0.08, 0.3), '#a08060', 0, 0.42, 0.9); // oturak
  parca(g, new THREE.CylinderGeometry(0.04, 0.04, 2.4, 5), '#c8b080', 0.8, 0.5, 0.2, 0.3, 0, 1.2); // kürek
  return g;
}
function dronModeli() {
  const g = new THREE.Group();
  parca(g, new THREE.BoxGeometry(0.4, 0.15, 0.4), '#e8e8e8', 0, 0, 0);
  const pervaneler = [];
  [-1, 1].forEach((sx) =>
    [-1, 1].forEach((sz) => {
      parca(g, new THREE.BoxGeometry(0.06, 0.05, 0.5), '#333', sx * 0.22, 0, sz * 0.22, 0, (sx * sz * Math.PI) / 4, 0);
      pervaneler.push(parca(g, new THREE.BoxGeometry(0.42, 0.02, 0.05), '#555', sx * 0.38, 0.08, sz * 0.38));
    })
  );
  parca(g, new THREE.BoxGeometry(0.12, 0.1, 0.12), '#222', 0, -0.12, -0.12); // kamera
  g.userData.pervaneler = pervaneler;
  g.scale.setScalar(2.2);
  return g;
}
function kampModeli() {
  const g = new THREE.Group();
  const cadir = parca(g, new THREE.ConeGeometry(1.6, 1.8, 4), '#6b7a3a', 0, 0.9, 0);
  cadir.rotation.y = Math.PI / 4;
  parca(g, new THREE.BoxGeometry(0.7, 0.9, 0.05), '#2a2a20', 0, 0.45, -1.13); // kapı
  parca(g, new THREE.BoxGeometry(1.2, 0.05, 0.8), '#1f2a4a', 2.3, 0.9, 0, -0.6, 0, 0); // güneş paneli
  parca(g, new THREE.CylinderGeometry(0.04, 0.04, 0.9, 5), '#555', 2.3, 0.45, 0.3);
  parca(g, new THREE.BoxGeometry(2.2, 1.3, 1.8), '#7d6f4a', -2.6, 0.65, 0.5); // gözlem saklanağı
  parca(g, new THREE.BoxGeometry(1.4, 0.25, 0.06), '#1a1a14', -2.6, 0.95, -0.42); // gözetleme yarığı
  parca(g, new THREE.CylinderGeometry(0.35, 0.4, 0.15, 8), '#3a3028', 0.6, 0.08, 2.4); // ateş yeri
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
  const ozelRenk = b.ozellik && OZEL_BIREYLER[b.ozellik] && OZEL_BIREYLER[b.ozellik].renk; // Aşama 14: kara leopar, beyaz zürafa, benekli zebra
  const ton = b.gen && Number.isFinite(b.gen.ton) ? b.gen.ton : 0; // Aşama 19: kalıtsal renk tonu
  const r = ozelRenk || '#' + new THREE.Color(t.renk).offsetHSL(0, 0, -ton * 0.07).getHexString();
  const g = new THREE.Group();
  const erkek = b.cinsiyet === 'erkek';
  switch (t.sekil) {
    case 'kedi':
      parca(g, new THREE.BoxGeometry(0.5 * s, 0.45 * s, 1.4 * s), r, 0, 0.75 * s, 0);
      parca(g, new THREE.BoxGeometry(0.42 * s, 0.4 * s, 0.42 * s), r, 0, 0.98 * s, -0.82 * s);
      if (b.tur === 'aslan' && erkek && b.evre !== 'yavru') parca(g, new THREE.DodecahedronGeometry(0.42 * s, 0), '#' + new THREE.Color('#7a4a1e').offsetHSL(0, 0, -ton * 0.12).getHexString(), 0, 0.98 * s, -0.68 * s);
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
    // ---------- Kuzey Kutbu ----------
    case 'ayi':
      parca(g, new THREE.BoxGeometry(0.85 * s, 0.85 * s, 1.75 * s), r, 0, 0.95 * s, 0);
      parca(g, new THREE.BoxGeometry(0.75 * s, 0.75 * s, 0.6 * s), r, 0, 1.05 * s, 0.55 * s); // iri arka
      parca(g, new THREE.BoxGeometry(0.42 * s, 0.4 * s, 0.6 * s), r, 0, 1.05 * s, -1.05 * s, 0.25); // uzun boyun
      parca(g, new THREE.BoxGeometry(0.36 * s, 0.32 * s, 0.45 * s), r, 0, 1.0 * s, -1.42 * s);
      parca(g, new THREE.BoxGeometry(0.16 * s, 0.14 * s, 0.14 * s), '#1a1a1a', 0, 0.98 * s, -1.68 * s); // burun
      parca(g, new THREE.SphereGeometry(0.07 * s, 5, 4), r, -0.14 * s, 1.2 * s, -1.32 * s);
      parca(g, new THREE.SphereGeometry(0.07 * s, 5, 4), r, 0.14 * s, 1.2 * s, -1.32 * s);
      gozler(g, s, 0.1, 1.08, -1.6);
      dortAyak(g, s, r, 0.6, 0.3, 0.62, 0.2);
      break;
    case 'fok': {
      // Yerde yatan iğ biçimli gövde, ön yüzgeçler, arkada yüzgeç kuyruk
      const fg = parca(g, new THREE.SphereGeometry(0.5 * s, 8, 6), r, 0, 0.32 * s, 0);
      fg.scale.set(0.75, 0.62, 1.9);
      for (let i = 0; i < 6; i++) parca(g, new THREE.TorusGeometry(0.06 * s, 0.015 * s, 3, 6), '#c8c0b0', ((i % 2) - 0.5) * 0.3 * s, 0.6 * s, (-0.4 + i * 0.16) * s, Math.PI / 2, 0, 0); // halkalar
      parca(g, new THREE.SphereGeometry(0.24 * s, 7, 5), r, 0, 0.42 * s, -0.95 * s);
      parca(g, new THREE.BoxGeometry(0.1 * s, 0.04 * s, 0.3 * s), r, -0.36 * s, 0.12 * s, -0.4 * s, 0, 0.4, 0);
      parca(g, new THREE.BoxGeometry(0.1 * s, 0.04 * s, 0.3 * s), r, 0.36 * s, 0.12 * s, -0.4 * s, 0, -0.4, 0);
      parca(g, new THREE.BoxGeometry(0.45 * s, 0.04 * s, 0.25 * s), r, 0, 0.2 * s, 1.05 * s);
      gozler(g, s, 0.1, 0.5, -1.15);
      break;
    }
    case 'mors': {
      const mg = parca(g, new THREE.SphereGeometry(0.7 * s, 8, 6), r, 0, 0.6 * s, 0.1 * s);
      mg.scale.set(0.95, 0.75, 1.6);
      parca(g, new THREE.SphereGeometry(0.42 * s, 7, 5), r, 0, 0.85 * s, -0.95 * s);
      parca(g, new THREE.BoxGeometry(0.4 * s, 0.22 * s, 0.2 * s), '#b89a80', 0, 0.72 * s, -1.28 * s); // bıyıklı ağız
      if (b.evre !== 'yavru') {
        parca(g, new THREE.ConeGeometry(0.04 * s, 0.6 * s, 5), '#f0ead8', -0.1 * s, 0.4 * s, -1.32 * s, Math.PI);
        parca(g, new THREE.ConeGeometry(0.04 * s, 0.6 * s, 5), '#f0ead8', 0.1 * s, 0.4 * s, -1.32 * s, Math.PI);
      }
      parca(g, new THREE.BoxGeometry(0.15 * s, 0.05 * s, 0.4 * s), r, -0.55 * s, 0.1 * s, -0.5 * s, 0, 0.5, 0);
      parca(g, new THREE.BoxGeometry(0.15 * s, 0.05 * s, 0.4 * s), r, 0.55 * s, 0.1 * s, -0.5 * s, 0, -0.5, 0);
      parca(g, new THREE.BoxGeometry(0.6 * s, 0.05 * s, 0.35 * s), r, 0, 0.18 * s, 1.15 * s);
      gozler(g, s, 0.16, 1.0, -1.18);
      break;
    }
    case 'balina': {
      const bg = parca(g, new THREE.SphereGeometry(0.6 * s, 9, 7), r, 0, 0.4 * s, 0);
      bg.scale.set(0.9, 0.8, 2.6);
      parca(g, new THREE.SphereGeometry(0.33 * s, 7, 5), r, 0, 0.62 * s, -1.25 * s); // kavun biçimli alın
      parca(g, new THREE.BoxGeometry(0.2 * s, 0.05 * s, 0.4 * s), r, -0.5 * s, 0.25 * s, -0.6 * s, 0, 0.5, 0.3);
      parca(g, new THREE.BoxGeometry(0.2 * s, 0.05 * s, 0.4 * s), r, 0.5 * s, 0.25 * s, -0.6 * s, 0, -0.5, -0.3);
      const kuyruk = parca(g, new THREE.BoxGeometry(0.9 * s, 0.05 * s, 0.35 * s), r, 0, 0.4 * s, 1.65 * s);
      kuyruk.userData.kuyruk = true;
      gozler(g, s, 0.25, 0.5, -1.3);
      break;
    }
    case 'geyik':
      parca(g, new THREE.BoxGeometry(0.5 * s, 0.55 * s, 1.3 * s), r, 0, 1.15 * s, 0);
      parca(g, new THREE.BoxGeometry(0.52 * s, 0.4 * s, 0.4 * s), '#e8e2d4', 0, 1.15 * s, -0.55 * s); // açık renk boyun yelesi
      parca(g, new THREE.BoxGeometry(0.22 * s, 0.55 * s, 0.25 * s), r, 0, 1.55 * s, -0.7 * s, -0.4);
      parca(g, new THREE.BoxGeometry(0.24 * s, 0.26 * s, 0.5 * s), r, 0, 1.82 * s, -0.98 * s);
      if (b.evre !== 'yavru')
        for (const yan of [-1, 1]) {
          parca(g, new THREE.CylinderGeometry(0.025 * s, 0.035 * s, 0.7 * s, 4), '#d8c8a8', yan * 0.12 * s, 2.25 * s, -0.85 * s, 0.4, 0, yan * 0.3);
          parca(g, new THREE.CylinderGeometry(0.02 * s, 0.025 * s, 0.35 * s, 4), '#d8c8a8', yan * 0.24 * s, 2.45 * s, -1.0 * s, -0.6, 0, yan * 0.4);
          parca(g, new THREE.CylinderGeometry(0.02 * s, 0.025 * s, 0.3 * s, 4), '#d8c8a8', yan * 0.2 * s, 2.55 * s, -0.7 * s, 0.2, 0, yan * 0.6);
        }
      gozler(g, s, 0.1, 1.88, -1.18);
      dortAyak(g, s, r, 0.85, 0.17, 0.48, 0.1);
      break;
    case 'misk':
      // Yere kadar sarkan uzun tüyler: gövdenin altına uzanan geniş bir etek
      parca(g, new THREE.BoxGeometry(0.95 * s, 0.85 * s, 1.5 * s), r, 0, 1.0 * s, 0);
      parca(g, new THREE.BoxGeometry(1.05 * s, 0.55 * s, 1.55 * s), '#2e241c', 0, 0.5 * s, 0); // tüy eteği
      parca(g, new THREE.BoxGeometry(0.6 * s, 0.4 * s, 0.45 * s), '#9a8a70', 0, 1.42 * s, -0.35 * s); // açık renk sırt eyeri
      parca(g, new THREE.BoxGeometry(0.45 * s, 0.45 * s, 0.5 * s), r, 0, 0.95 * s, -0.95 * s);
      if (b.evre !== 'yavru') {
        parca(g, new THREE.TorusGeometry(0.22 * s, 0.07 * s, 4, 8, Math.PI), '#d8ccb0', -0.22 * s, 1.1 * s, -0.95 * s, 0, Math.PI / 2, 0);
        parca(g, new THREE.TorusGeometry(0.22 * s, 0.07 * s, 4, 8, Math.PI), '#d8ccb0', 0.22 * s, 1.1 * s, -0.95 * s, 0, -Math.PI / 2, 0);
      }
      gozler(g, s, 0.17, 1.02, -1.21);
      dortAyak(g, s, '#2e241c', 0.3, 0.3, 0.55, 0.16);
      break;
    case 'kurt':
      parca(g, new THREE.BoxGeometry(0.4 * s, 0.45 * s, 1.15 * s), r, 0, 0.9 * s, 0);
      parca(g, new THREE.BoxGeometry(0.42 * s, 0.48 * s, 0.4 * s), r, 0, 0.98 * s, -0.5 * s); // kalın boyun tüyü
      parca(g, new THREE.BoxGeometry(0.32 * s, 0.3 * s, 0.38 * s), r, 0, 1.1 * s, -0.82 * s);
      parca(g, new THREE.BoxGeometry(0.16 * s, 0.15 * s, 0.25 * s), r, 0, 1.03 * s, -1.08 * s);
      parca(g, new THREE.BoxGeometry(0.06 * s, 0.06 * s, 0.06 * s), '#1a1a1a', 0, 1.06 * s, -1.21 * s);
      parca(g, new THREE.ConeGeometry(0.07 * s, 0.16 * s, 4), r, -0.1 * s, 1.3 * s, -0.78 * s);
      parca(g, new THREE.ConeGeometry(0.07 * s, 0.16 * s, 4), r, 0.1 * s, 1.3 * s, -0.78 * s);
      {
        const kuyruk = parca(g, new THREE.CylinderGeometry(0.07 * s, 0.1 * s, 0.6 * s, 5), r, 0, 0.8 * s, 0.75 * s, 1.0);
        kuyruk.userData.kuyruk = true;
      }
      gozler(g, s, 0.08, 1.15, -1.0, '#c8a040');
      dortAyak(g, s, r, 0.68, 0.14, 0.42, 0.09);
      break;
    case 'tavsan':
      parca(g, new THREE.BoxGeometry(0.4 * s, 0.45 * s, 0.75 * s), r, 0, 0.5 * s, 0.05 * s);
      parca(g, new THREE.BoxGeometry(0.3 * s, 0.3 * s, 0.35 * s), r, 0, 0.72 * s, -0.42 * s);
      parca(g, new THREE.BoxGeometry(0.07 * s, 0.5 * s, 0.12 * s), r, -0.08 * s, 1.08 * s, -0.36 * s, 0.25);
      parca(g, new THREE.BoxGeometry(0.07 * s, 0.5 * s, 0.12 * s), r, 0.08 * s, 1.08 * s, -0.36 * s, 0.25);
      parca(g, new THREE.BoxGeometry(0.05 * s, 0.1 * s, 0.05 * s), '#1a1a1a', -0.08 * s, 1.34 * s, -0.4 * s); // kulak uçları siyah
      parca(g, new THREE.BoxGeometry(0.05 * s, 0.1 * s, 0.05 * s), '#1a1a1a', 0.08 * s, 1.34 * s, -0.4 * s);
      gozler(g, s, 0.12, 0.8, -0.6);
      dortAyak(g, s, r, 0.3, 0.13, 0.3, 0.07);
      break;
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

// Kayıp Okyanus'tan (telefonda çalıştığı doğrulanmış): expo-gl bağlamını three.js'e uydurur.
// 1) Bazı sürümlerde bağlam özellikleri boş döner; three.js bunu okuyup hata verir.
// 2) three.js (r163 ve sonrası) WebGL 1 bağlamlarını genel WebGLRenderingContext türüne bakarak reddeder; expo-gl bağlamı
//    WebGL 2 işlevlerini sağladığı halde bu denetime takılabildiği için denetim sırasında bu ad geçici olarak gizlenir.
function cizerOlustur(gl, tuval) {
  try {
    const ozellik = gl.getContextAttributes && gl.getContextAttributes();
    if (!ozellik) throw new Error('bos');
  } catch (e) {
    try {
      gl.getContextAttributes = () => ({
        alpha: true,
        antialias: false,
        depth: true,
        stencil: false,
        premultipliedAlpha: true,
        preserveDrawingBuffer: false,
        powerPreference: 'default',
        failIfMajorPerformanceCaveat: false,
      });
    } catch (e2) {}
  }
  const kok = globalThis;
  const eski = kok.WebGLRenderingContext;
  let gizlendi = false;
  try {
    kok.WebGLRenderingContext = undefined;
    gizlendi = true;
  } catch (e) {}
  try {
    return new THREE.WebGLRenderer({ canvas: tuval, context: gl, antialias: false, alpha: false });
  } finally {
    if (gizlendi) {
      try {
        kok.WebGLRenderingContext = eski;
      } catch (e) {}
    }
  }
}
export function sahneKur(gl, d, secenek = {}) {
  // Düşük grafik (Aşama 7, zayıf cihazlar): hayvanlar daha yakından çizilir, sis daha yakın
  const DUSUK = !!secenek.dusuk;
  const CIZIM = DUSUK ? 70 : 120;
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
  const ciz = cizerOlustur(gl, tuval);
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
  // Termit tepeleri: kızıl topraktan sivri bacalı kuleler
  ornekle(new THREE.ConeGeometry(1, 2.6, 7), '#a0603a', d.engeller.filter((e) => e.tur === 'termit'), (e) => {
    q.setFromEuler(new THREE.Euler(0, e.x, 0));
    olcek.set(e.r, e.r * 1.1, e.r);
    yer.set(e.x, 1.3 * e.r * 1.1, R(e.y));
  });
  ornekle(new THREE.ConeGeometry(0.12, 1.4, 3), '#7c8a4a', d.suslar.filter((s) => s.tur === 'saz'), dik(0.7));
  ornekle(new THREE.IcosahedronGeometry(0.7, 0), '#7a7a3a', d.suslar.filter((s) => s.tur === 'cali'), (e) => {
    q.identity();
    olcek.set(e.boy, e.boy * 0.6, e.boy);
    yer.set(e.x, 0.35 * e.boy, R(e.y));
  });
  // Mağara ağzı
  // Tuz yalağı (Aşama 14): çiğnenmiş, kızılımsı çıplak toprak
  const yalak = new THREE.Mesh(new THREE.CircleGeometry(TUZ_YALAGI.r, 18), mat('#9a6a4a'));
  yalak.rotation.x = -Math.PI / 2;
  yalak.position.set(TUZ_YALAGI.x, 0.04, R(TUZ_YALAGI.y));
  sahne.add(yalak);
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

  // Sonradan kurulan tesisler (karar 80: merkez görsel olarak büyür) ve kamera tuzakları
  const tesisModelleri = new Map();
  const tesisModeli = (id) => {
    const g = new THREE.Group();
    if (id === 'konaklama') {
      parca(g, new THREE.BoxGeometry(5, 2.6, 3.2), '#d8cfb8', 10, 1.3, R(-9));
      parca(g, new THREE.BoxGeometry(5.4, 0.25, 3.6), '#6a4a30', 10, 2.7, R(-9));
    } else if (id === 'kule') {
      [-1, 1].forEach((sx) => [-1, 1].forEach((sz) => parca(g, new THREE.CylinderGeometry(0.12, 0.12, 7, 5), '#7a5a3a', -10 + sx, 3.5, R(-8) + sz)));
      parca(g, new THREE.BoxGeometry(2.8, 0.2, 2.8), '#8a6a44', -10, 7, R(-8));
      parca(g, new THREE.ConeGeometry(2.2, 1.2, 4), '#6a4a30', -10, 8.2, R(-8), 0, Math.PI / 4, 0);
    } else if (id === 'gelismisLab') {
      parca(g, new THREE.BoxGeometry(3.6, 2.4, 3.6), '#eef0ea', -11.5, 1.2, R(5));
      parca(g, new THREE.CylinderGeometry(0.5, 0.5, 0.1, 10), '#9ab0c0', -11.5, 2.45, R(5), Math.PI / 2.5, 0, 0); // çanak anten
    } else if (id === 'klinik') {
      parca(g, new THREE.BoxGeometry(4, 2.6, 3.2), '#f2f2ee', 10, 1.3, R(8));
      parca(g, new THREE.BoxGeometry(0.9, 0.25, 0.05), '#c83a3a', 10, 2.0, R(8) + 1.62);
      parca(g, new THREE.BoxGeometry(0.25, 0.9, 0.05), '#c83a3a', 10, 2.0, R(8) + 1.62);
    } else if (id === 'rehab') {
      // Rehabilitasyon alanı: çitle çevrili bölme ve gölgelik
      for (let i = 0; i < 10; i++) {
        const a = (i / 10) * Math.PI * 2;
        parca(g, new THREE.CylinderGeometry(0.07, 0.07, 1.3, 5), '#7a5a3a', 1 + Math.sin(a) * 3, 0.65, R(9.5 + Math.cos(a) * 2.2));
      }
      parca(g, new THREE.TorusGeometry(2.6, 0.04, 4, 20), '#8a6a44', 1, 1.1, R(9.5), Math.PI / 2, 0, 0).scale.set(1.15, 0.85, 1);
      parca(g, new THREE.BoxGeometry(2, 0.1, 1.4), '#5a6a3a', 1, 1.6, R(10.5));
    }
    sahne.add(g);
    return g;
  };
  const tuzakModelleri = new Map();
  const tuzakModeli = (t) => {
    const g = new THREE.Group();
    parca(g, new THREE.CylinderGeometry(0.05, 0.05, 1.1, 5), '#5a4a38', 0, 0.55, 0);
    parca(g, new THREE.BoxGeometry(0.22, 0.3, 0.14), '#3f4a30', 0, 1.0, 0);
    g.position.set(t.x, 0, R(t.y));
    sahne.add(g);
    return g;
  };

  // Araç ve araştırmacı
  const arac = araclarModeli();
  sahne.add(arac);
  const insan = insanModeli('#8a8058');
  sahne.add(insan);
  const tekne = tekneModeli();
  tekne.visible = false;
  sahne.add(tekne);
  const dron = dronModeli();
  dron.visible = false;
  sahne.add(dron);
  const kamp = kampModeli();
  kamp.visible = false;
  sahne.add(kamp);
  // Aşama 10: nadir ziyaretçi (korucu, çoban, araştırmacı); giysi rengi kişiye göre
  const ziyaretciler = {
    korucu: insanModeli('#4f5a2a'),
    coban: insanModeli('#a02a24'),
    arastirmaci: insanModeli('#3a5f8a'),
  };
  Object.values(ziyaretciler).forEach((m) => {
    m.visible = false;
    sahne.add(m);
  });

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
  // Yağmur (Aşama 5): oyuncunun çevresinde düşen damla çizgileri
  const DAMLA = 700;
  const damlaKonum = new Float32Array(DAMLA * 6);
  const damlaGeo = new THREE.BufferGeometry();
  damlaGeo.setAttribute('position', new THREE.BufferAttribute(damlaKonum, 3));
  const damlalar = new THREE.LineSegments(damlaGeo, new THREE.LineBasicMaterial({ color: '#c8d4e0', transparent: true, opacity: 0.55 }));
  damlalar.frustumCulled = false;
  damlalar.visible = false;
  sahne.add(damlalar);
  const damlaY = new Float32Array(DAMLA).map(() => Math.random() * 14);
  const damlaX = new Float32Array(DAMLA).map(() => (Math.random() - 0.5) * 40);
  const damlaZ = new Float32Array(DAMLA).map(() => (Math.random() - 0.5) * 40);
  const kuruZemin = new THREE.Color('#bda55c');
  const yesilZemin = new THREE.Color('#8e9c4c');
  const bulutGok = new THREE.Color('#7d8790');
  zemin.material = zemin.material.clone(); // malzemeler renge göre paylaşılıyor; bunlar değişeceği için ayrı
  goletKiyi.material = goletKiyi.material.clone();
  const goletKiyiRenk = goletKiyi.material.color.clone();
  const kuruCamur = new THREE.Color('#9a8458');
  // ---- Mağara (Aşama 6): dünyadan uzakta ayrı bir tünel; mağaradayken kamera buraya geçer ----
  const MZ = 3000; // mağaranın z konumu (ana sahnenin çok dışında)
  const magaraGrup = new THREE.Group();
  magaraGrup.visible = false;
  sahne.add(magaraGrup);
  const kayaIc = new THREE.MeshLambertMaterial({ color: '#8a7a68', side: THREE.BackSide, flatShading: true });
  const odaBoyu = [6, 9, 3.2, 7, 6]; // giriş, yarasa salonu, dar geçit, göl, derin oda
  const odaZ = odaBoyu.map((_, i) => MZ - i * 16);
  odaBoyu.forEach((r, i) => {
    const kure = new THREE.Mesh(new THREE.IcosahedronGeometry(r, 1), kayaIc);
    kure.scale.set(1.3, 0.7, 1.2);
    kure.position.set(0, r * 0.45, odaZ[i]);
    magaraGrup.add(kure);
    if (i < odaBoyu.length - 1) {
      const tunel = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 2.2, 16, 8, 1, true), kayaIc);
      tunel.rotation.x = Math.PI / 2;
      tunel.position.set(0, 1.6, odaZ[i] - 8);
      magaraGrup.add(tunel);
    }
    // Sarkıtlar
    for (let j = 0; j < 7; j++) {
      const a = (j / 7) * Math.PI * 2 + i;
      const sk = new THREE.Mesh(new THREE.ConeGeometry(0.18, 1.2, 5), mat('#8a7a66'));
      sk.rotation.x = Math.PI;
      sk.position.set(Math.sin(a) * r * 0.6, r * 0.75, odaZ[i] + Math.cos(a) * r * 0.5);
      magaraGrup.add(sk);
    }
  });
  // Yarasa salonunun tavanında asılı yarasalar
  const yarasaIm = new THREE.InstancedMesh(new THREE.BoxGeometry(0.12, 0.22, 0.1), mat('#2a2220'), 160);
  for (let i = 0; i < 160; i++) {
    const a = Math.random() * Math.PI * 2;
    const r = Math.random() * 7;
    m4.makeTranslation(Math.sin(a) * r * 1.2, 7.4 - Math.random() * 0.6, odaZ[1] + Math.cos(a) * r);
    yarasaIm.setMatrixAt(i, m4);
  }
  magaraGrup.add(yarasaIm);
  // Yeraltı gölü
  const yeraltiGol = new THREE.Mesh(new THREE.CircleGeometry(4.5, 20), new THREE.MeshLambertMaterial({ color: '#16303a' }));
  yeraltiGol.rotation.x = -Math.PI / 2;
  yeraltiGol.position.set(0, 0.05, odaZ[3] - 1);
  magaraGrup.add(yeraltiGol);
  // ---- Uzak araştırma alanları (Aşama 12): ana sahneden uzakta ayrı küçük dünyalar; noktalar -z boyunca 30 m arayla ----
  const UX = 6000;
  const uzakGruplar = {};
  const uzakKur = (alan, zeminRenk, kur) => {
    const g = new THREE.Group();
    g.visible = false;
    const z = new THREE.Mesh(new THREE.PlaneGeometry(260, 260), mat(zeminRenk));
    z.rotation.x = -Math.PI / 2;
    z.position.set(UX, 0, -60);
    g.add(z);
    kur(g);
    sahne.add(g);
    uzakGruplar[alan] = g;
  };
  const rs = (n) => {
    const x = Math.sin(n * 127.1) * 43758.5453;
    return x - Math.floor(x);
  };
  uzakKur('tuzla', '#ddd3c2', (g) => {
    const su = new THREE.Mesh(new THREE.PlaneGeometry(70, 170), new THREE.MeshLambertMaterial({ color: '#b56552' }));
    su.rotation.x = -Math.PI / 2;
    su.position.set(UX - 43, 0.03, -70);
    g.add(su);
    const flamingo = new THREE.InstancedMesh(new THREE.ConeGeometry(0.18, 0.9, 5), mat('#f08aa0'), 240);
    for (let i = 0; i < 240; i++) {
      m4.makeTranslation(UX - 14 - rs(i) * 50, 0.6, -10 - rs(i + 99) * 120);
      flamingo.setMatrixAt(i, m4);
    }
    g.add(flamingo);
    const yanardag = new THREE.Mesh(new THREE.ConeGeometry(40, 55, 10), mat('#6a5a4a'));
    yanardag.position.set(UX + 60, 27, -150);
    g.add(yanardag);
  });
  uzakKur('dag', '#34432a', (g) => {
    for (let i = 0; i < 140; i++) {
      const x = UX + (rs(i) - 0.5) * 70;
      if (Math.abs(x - UX) < 4) continue;
      const zz = 10 - rs(i + 7) * 150;
      const boy = 8 + rs(i + 3) * 10;
      const govde = parca(g, new THREE.CylinderGeometry(0.3, 0.45, boy, 6), '#4a3b2a', x, boy / 2, zz);
      parca(g, new THREE.SphereGeometry(2.6 + rs(i + 5) * 1.5, 7, 5), '#2f5a2c', x, boy, zz);
    }
    for (let i = 0; i < 60; i++) parca(g, new THREE.CylinderGeometry(0.06, 0.06, 5, 4), '#7a9a4a', UX + (rs(i + 300) - 0.5) * 20, 2.5, -55 - rs(i + 301) * 25); // bambu
  });
  uzakKur('bataklik', '#2f3b2a', (g) => {
    const su = new THREE.Mesh(new THREE.PlaneGeometry(30, 170), new THREE.MeshLambertMaterial({ color: '#3d4a3c' }));
    su.rotation.x = -Math.PI / 2;
    su.position.set(UX, 0.03, -65);
    g.add(su);
    const sap = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.04, 0.05, 4, 4), mat('#5f7a35'), 420);
    const pus = new THREE.InstancedMesh(new THREE.SphereGeometry(0.45, 6, 4), mat('#7f9a45'), 420);
    for (let i = 0; i < 420; i++) {
      const yan = rs(i) < 0.5 ? -1 : 1;
      const x = UX + yan * (4 + rs(i + 11) * 30);
      const zz = 10 - rs(i + 17) * 160;
      m4.makeTranslation(x, 2, zz);
      sap.setMatrixAt(i, m4);
      m4.makeTranslation(x, 4.1, zz);
      pus.setMatrixAt(i, m4);
    }
    g.add(sap, pus);
  });
  // ---- Kuzey Kutbu (kuzeydoğu Grönland): savandan 6 km kuzeyde ayrı bir harita; kuzeyi deniz, güneyi tundra ----
  const kutupGrup = new THREE.Group();
  kutupGrup.visible = false;
  sahne.add(kutupGrup);
  const KX = KUTUP.x;
  const KY = KUTUP.y;
  const kp = (lx, ly) => [KX + lx, R(KY + ly)];
  // Deniz (en altta), deniz buzu (mevsime göre kayar), kara (kıyı çizgisine kadar), polinya
  const deniz = new THREE.Mesh(new THREE.PlaneGeometry(700, 700), new THREE.MeshLambertMaterial({ color: '#1f3f55' }));
  deniz.rotation.x = -Math.PI / 2;
  deniz.position.set(KX, -0.25, R(KY + 120));
  kutupGrup.add(deniz);
  const denizBuzu = new THREE.Mesh(new THREE.PlaneGeometry(700, 400), mat('#e6eef3'));
  denizBuzu.rotation.x = -Math.PI / 2;
  kutupGrup.add(denizBuzu);
  const karaSekli = new THREE.Shape();
  karaSekli.moveTo(-360, -360);
  for (let lx = -360; lx <= 360; lx += 6) karaSekli.lineTo(lx, Kt.kiyiY(lx));
  karaSekli.lineTo(360, -360);
  karaSekli.lineTo(-360, -360);
  const kara = new THREE.Mesh(new THREE.ShapeGeometry(karaSekli), new THREE.MeshLambertMaterial({ color: '#8a8460' }));
  kara.rotation.x = -Math.PI / 2; // şekil düzleminde y = kuzey; döndürünce -z'ye düşer
  kara.position.set(KX, 0.04, R(KY));
  kutupGrup.add(kara);
  const kiyiSeridi = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), mat('#6e6a5c'));
  kiyiSeridi.visible = false;
  const polinya = new THREE.Mesh(new THREE.CircleGeometry(Kt.POLINYA.r, 24), new THREE.MeshLambertMaterial({ color: '#173548' }));
  polinya.rotation.x = -Math.PI / 2;
  polinya.position.set(...(() => { const [x, z] = kp(Kt.POLINYA.lx, Kt.POLINYA.ly); return [x, 0.07, z]; })());
  kutupGrup.add(polinya);
  // Tundra lekeleri: yazın yeşil-kahve yosun ve söğüt yamaları (kışın karla örtülür)
  const LEKE = 220;
  const lekeIm = new THREE.InstancedMesh(new THREE.CircleGeometry(4, 8), new THREE.MeshLambertMaterial({ color: '#ffffff' }), LEKE);
  const lekeRenk = [new THREE.Color('#566a34'), new THREE.Color('#6f5a38'), new THREE.Color('#8a8a5a'), new THREE.Color('#9a6a3a')];
  for (let i = 0; i < LEKE; i++) {
    lekeIm.setColorAt(i, lekeRenk[i % 4]);
    const lx = (rs(i + 700) - 0.5) * 420;
    const ly = -230 + rs(i + 701) * (Kt.kiyiY(lx) + 200);
    q.setFromEuler(new THREE.Euler(-Math.PI / 2, 0, 0));
    olcek.set(1 + rs(i + 702) * 2, 1 + rs(i + 703), 1);
    const [x, z] = kp(lx, ly);
    yer.set(x, 0.06, z);
    m4.compose(yer, q, olcek);
    lekeIm.setMatrixAt(i, m4);
  }
  kutupGrup.add(lekeIm);
  // Taşlar ve kayalar
  const tasIm = new THREE.InstancedMesh(new THREE.DodecahedronGeometry(0.7, 0), mat('#5d5a54'), 120);
  for (let i = 0; i < 120; i++) {
    const lx = (rs(i + 800) - 0.5) * 440;
    const ly = -230 + rs(i + 801) * (Kt.kiyiY(lx) + 225);
    if (Math.hypot(lx - Kt.ISTASYON_K.lx, ly - Kt.ISTASYON_K.ly) < 14) continue;
    q.identity();
    olcek.setScalar(0.5 + rs(i + 802) * 2);
    const [x, z] = kp(lx, ly);
    yer.set(x, 0.2, z);
    m4.compose(yer, q, olcek);
    tasIm.setMatrixAt(i, m4);
  }
  kutupGrup.add(tasIm);
  // Güneyde ve batıda karlı dağlar (haritanın sınırı)
  const dagIm = new THREE.InstancedMesh(new THREE.ConeGeometry(30, 45, 6), mat('#7c7f84'), 26);
  const zirveIm = new THREE.InstancedMesh(new THREE.ConeGeometry(12, 18, 6), mat('#f4f6f8'), 26);
  for (let i = 0; i < 26; i++) {
    const a = Math.PI * 0.55 + (i / 25) * Math.PI * 1.0; // güney yarım çember
    const r = KUTUP.r + 40 + rs(i + 900) * 30;
    const s2 = 0.8 + rs(i + 901) * 0.9;
    const [x, z] = kp(Math.sin(a) * r, Math.cos(a) * r);
    q.identity();
    olcek.setScalar(s2);
    yer.set(x, 22 * s2, z);
    m4.compose(yer, q, olcek);
    dagIm.setMatrixAt(i, m4);
    yer.set(x, 22 * s2 + 14.5 * s2, z);
    m4.compose(yer, q, olcek);
    zirveIm.setMatrixAt(i, m4);
  }
  kutupGrup.add(dagIm, zirveIm);
  // Buzul dili: batıda denize dökülen buz duvarı
  {
    const g2 = parca(kutupGrup, new THREE.BoxGeometry(Kt.BUZUL.lx1 - Kt.BUZUL.lx0 + 80, 16, 70), '#cfe3ee', ...(() => { const [x, z] = kp((Kt.BUZUL.lx0 + Kt.BUZUL.lx1) / 2 - 40, 15); return [x, 8, z]; })());
    g2.material = new THREE.MeshLambertMaterial({ color: '#cfe3ee' });
    for (let i = 0; i < 6; i++) parca(kutupGrup, new THREE.BoxGeometry(2, 15, 70), '#8ab4cc', ...(() => { const [x, z] = kp(Kt.BUZUL.lx1 + 0.8, 15 + (i - 2.5) * 0.1); return [x - i * 14, 8.2, z]; })()); // mavi çatlaklar
  }
  // Kuş yarları: doğuda koyu kaya duvarı, üstünde kuş lekeleri
  for (let i = 0; i < 7; i++) {
    const lx = Kt.KUS_YARI.lx - 24 + i * 8;
    const [x, z] = kp(lx, Kt.KUS_YARI.ly + 6 + rs(i + 950) * 6);
    parca(kutupGrup, new THREE.BoxGeometry(9, 18 + rs(i + 951) * 10, 10), '#3e3a36', x, 10, z);
  }
  const kusIm = new THREE.InstancedMesh(new THREE.BoxGeometry(0.25, 0.25, 0.25), mat('#f2f2ee'), 160);
  for (let i = 0; i < 160; i++) {
    const [x, z] = kp(Kt.KUS_YARI.lx - 26 + rs(i + 960) * 56, Kt.KUS_YARI.ly + 0.5);
    m4.makeTranslation(x, 3 + rs(i + 961) * 22, z);
    kusIm.setMatrixAt(i, m4);
  }
  kutupGrup.add(kusIm);
  // Araştırma kulübesi: ahşap kulübe, telsiz direği, yakıt varilleri
  {
    const [x, z] = kp(Kt.ISTASYON_K.lx, Kt.ISTASYON_K.ly);
    parca(kutupGrup, new THREE.BoxGeometry(6, 3, 4.5), '#8a3a2a', x, 1.5, z);
    parca(kutupGrup, new THREE.ConeGeometry(4.6, 1.8, 4), '#3a3632', x, 3.9, z, 0, Math.PI / 4, 0);
    parca(kutupGrup, new THREE.BoxGeometry(1, 1.8, 0.1), '#4a2a1a', x, 0.9, z - 2.3);
    parca(kutupGrup, new THREE.BoxGeometry(0.9, 0.7, 0.1), '#e8d890', x + 1.8, 1.8, z - 2.3);
    parca(kutupGrup, new THREE.CylinderGeometry(0.06, 0.06, 9, 4), '#bdbdbd', x + 4, 4.5, z + 1);
    for (let i = 0; i < 4; i++) parca(kutupGrup, new THREE.CylinderGeometry(0.3, 0.3, 0.9, 8), i % 2 ? '#b03a2a' : '#2a5a8a', x - 4 - (i % 2) * 0.7, 0.45, z + 1 - Math.floor(i / 2) * 0.7);
  }
  // Buzdağları ve yüzen buz parçaları
  const buzdagIm = new THREE.InstancedMesh(new THREE.DodecahedronGeometry(1, 0), new THREE.MeshLambertMaterial({ color: '#dceef6' }), 30);
  const buzdagLy = [];
  for (let i = 0; i < 30; i++) buzdagLy.push({ lx: (rs(i + 980) - 0.5) * 420, ly: 70 + rs(i + 981) * 170, s: i < 5 ? 6 + rs(i + 982) * 8 : 0.8 + rs(i + 983) * 2.2 });
  kutupGrup.add(buzdagIm);
  // Kuzey ışıkları (kutup gecesinde): kuzey gökyüzünde dalgalanan yeşil perdeler
  const auroraMat = new THREE.MeshBasicMaterial({ color: '#59f2a0', transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false, fog: false });
  const auroralar = [];
  for (let i = 0; i < 5; i++) {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(160, 26, 16, 1), auroraMat);
    m.userData.taban = m.geometry.attributes.position.array.slice();
    kutupGrup.add(m);
    auroralar.push(m);
  }
  // Kar taneleri (kar yağarken ve tipide)
  const KAR = 900;
  const karGeo = new THREE.BufferGeometry();
  const karKonum = new Float32Array(KAR * 3);
  const karOfs = new Float32Array(KAR * 3);
  for (let i = 0; i < KAR; i++) {
    karOfs[i * 3] = (Math.random() - 0.5) * 40;
    karOfs[i * 3 + 1] = Math.random() * 14;
    karOfs[i * 3 + 2] = (Math.random() - 0.5) * 40;
  }
  karGeo.setAttribute('position', new THREE.BufferAttribute(karKonum, 3));
  const karlar = new THREE.Points(karGeo, new THREE.PointsMaterial({ color: '#ffffff', size: 0.12, transparent: true, opacity: 0.85 }));
  karlar.frustumCulled = false;
  karlar.visible = false;
  sahne.add(karlar);
  const karTundra = new THREE.Color('#e9eef2');
  const yazTundra = new THREE.Color('#7f7a56');
  const guzTundra = new THREE.Color('#8c6a44');
  const kutupGunduzGok = new THREE.Color('#a9c8e4');
  const kutupGeceGok = new THREE.Color('#060b18');
  const geceYarisiGunesi = new THREE.Color('#f0b080');
  const tipiGok = new THREE.Color('#dfe6ec');
  let kutupSon = -1;
  const kutupGuncelle = (k, o, dt) => {
    const dk = k.dk;
    const tk = Kt.kutupTakvim(Math.floor(dk / 1440) + 1);
    // Mevsime göre kara rengi: yazın kahve-yeşil tundra, sonbaharda kızıl-kahve, kışın ve ilkbaharda kar
    const tKar = tk.mevsim === 'kis' || tk.mevsim === 'ilkbahar' ? 1 : tk.mevsim === 'sonbahar' ? Math.min(1, Math.max(0, (tk.mevsimGunu - 1.5) / 2)) : tk.mevsimGunu < 2 ? 1 - tk.mevsimGunu / 2 : 0;
    kara.material.color.copy(tk.mevsim === 'sonbahar' ? guzTundra : yazTundra).lerp(karTundra, tKar);
    lekeIm.visible = tKar < 0.6;
    // Deniz buzu: güney kenarı buzKenari'nde
    const bk = Kt.buzKenari(dk);
    denizBuzu.visible = bk < KUTUP.r + 60;
    denizBuzu.position.set(KX, 0.02, R(KY + bk + 200));
    // Buzdağları: büyükler hep, küçük parçalar açık suda yüzer
    if (Math.abs(dk - kutupSon) > 5) {
      kutupSon = dk;
      buzdagLy.forEach((b, i) => {
        const [x, z] = kp(b.lx, b.ly);
        q.identity();
        olcek.set(b.s, b.s * (i < 5 ? 1.2 : 0.35), b.s * 0.9);
        yer.set(x, i < 5 ? b.s * 0.5 : 0.1, z);
        m4.compose(yer, q, olcek);
        buzdagIm.setMatrixAt(i, m4);
      });
      buzdagIm.instanceMatrix.needsUpdate = true;
    }
    // Kar yağışı ve tipi
    const h = kutupHavasi(k);
    const tipi = Kt.tipideMi(h, dk);
    karlar.visible = tipi || (h && h.tur === 'kar');
    if (karlar.visible) {
      const ruz = tipi ? 9 : 1.2;
      const ry = (h && h.ruzgarYon) || 0;
      for (let i = 0; i < KAR; i++) {
        karOfs[i * 3 + 1] -= dt * (tipi ? 3 : 1.4);
        karOfs[i * 3] += Math.sin(ry) * ruz * dt;
        karOfs[i * 3 + 2] -= Math.cos(ry) * ruz * dt;
        if (karOfs[i * 3 + 1] < 0) karOfs[i * 3 + 1] += 14;
        if (karOfs[i * 3] > 20) karOfs[i * 3] -= 40;
        if (karOfs[i * 3] < -20) karOfs[i * 3] += 40;
        if (karOfs[i * 3 + 2] > 20) karOfs[i * 3 + 2] -= 40;
        if (karOfs[i * 3 + 2] < -20) karOfs[i * 3 + 2] += 40;
        karKonum[i * 3] = o.x + karOfs[i * 3];
        karKonum[i * 3 + 1] = karOfs[i * 3 + 1];
        karKonum[i * 3 + 2] = R(o.y) + karOfs[i * 3 + 2];
      }
      karGeo.attributes.position.needsUpdate = true;
    }
    // Kuzey ışıkları: karanlıkta ve açık havada görünür
    const l = Kt.isik(dk);
    const aurora = l < 0.2 && h && (h.tur === 'acik' || h.tur === 'bulutlu') ? (0.2 - l) / 0.2 * (h.tur === 'acik' ? 0.55 : 0.2) : 0;
    auroraMat.opacity = aurora;
    auroralar.forEach((m, i) => {
      m.visible = aurora > 0.01;
      if (!m.visible) return;
      m.position.set(o.x - 120 + i * 60, 24 + i * 3, R(o.y + 105 + (i % 2) * 20));
      m.rotation.set(-0.15, (i - 2) * 0.12, 0);
      const p = m.geometry.attributes.position.array;
      const t0 = m.userData.taban;
      for (let j = 0; j < p.length; j += 3) p[j + 2] = t0[j + 2] + Math.sin(t0[j] * 0.05 + saat * 0.4 + i) * 9;
      m.geometry.attributes.position.needsUpdate = true;
    });
    auroraMat.color.setHSL(0.42 + Math.sin(saat * 0.1) * 0.04, 0.85, 0.6);
    return { l, tipi, h };
  };
  const fener = new THREE.PointLight('#fff1d0', 0, 22, 1.6);
  sahne.add(fener);
  // ---- Yangın: alev konileri ve dumanlar; yanmış alanlar koyu yamalar ----
  const ALEV = 72;
  const alevler = [];
  for (let i = 0; i < ALEV; i++) {
    const m = new THREE.Mesh(new THREE.ConeGeometry(0.9, 2.4, 6), new THREE.MeshBasicMaterial({ color: i % 2 ? '#ff7a1a' : '#ffb020' }));
    m.visible = false;
    sahne.add(m);
    alevler.push(m);
  }
  const dumanMat = new THREE.MeshBasicMaterial({ color: '#6a6660', transparent: true, opacity: 0.35, depthWrite: false });
  const dumanlar = [];
  for (let i = 0; i < 24; i++) {
    const m = new THREE.Mesh(new THREE.SphereGeometry(3, 7, 5), dumanMat);
    m.visible = false;
    sahne.add(m);
    dumanlar.push(m);
  }
  const yanikIm = new THREE.InstancedMesh(new THREE.CircleGeometry(13, 14), new THREE.MeshLambertMaterial({ color: '#3a3328' }), 256);
  yanikIm.count = 0;
  sahne.add(yanikIm);
  let yanikImza = '';
  const nehirRenk = new THREE.Color('#4a7a8a');
  const selRenk = new THREE.Color('#7a6a48');
  const HUCRE_K = 25;
  const hucreMerkez = (h) => ({ x: (h % 16) * HUCRE_K - YARICAP + HUCRE_K / 2, y: Math.floor(h / 16) * HUCRE_K - YARICAP + HUCRE_K / 2 });
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
      // Gün ışığı (kutupta kutup takvimine göre: yazın güneş batmaz, kışın doğmaz)
      const kutupta = Kt.kutupNoktaMi(o) && !k.magara;
      kutupGrup.visible = kutupta;
      const ku = kutupta ? kutupGuncelle(k, o, dt) : null;
      if (!kutupta) karlar.visible = false;
      const l = kutupta ? ku.l : isikDuzeyi(k.dk);
      const alaca = Math.max(0, 1 - Math.abs(l - 0.45) * 3) * (l < 1 ? 1 : 0);
      if (kutupta) {
        // Gece yarısı güneşi alçaktayken turuncu, kutup gecesinde lacivert-siyah
        gokRenk.copy(kutupGeceGok).lerp(kutupGunduzGok, Math.min(1, l * 1.15)).lerp(geceYarisiGunesi, l > 0.55 && l < 0.7 ? 0.35 : alaca * 0.4);
      } else gokRenk.copy(geceGok).lerp(gunduzGok, l).lerp(alacaGok, alaca * 0.5);
      const eko = k.eko;
      const kh = ku && ku.h;
      const bulut = kutupta ? (ku.tipi ? 0.9 : kh && kh.tur === 'sis' ? 0.7 : kh && kh.tur === 'kar' ? 0.55 : kh && kh.tur === 'bulutlu' ? 0.35 : 0) : eko ? (eko.yagmurVar ? (eko.siddet > 0.8 ? 0.75 : 0.5) : eko.hava && eko.hava.tur === 'bulutlu' ? 0.35 : 0) : 0;
      if (bulut) gokRenk.lerp((kutupta ? tipiGok : bulutGok).clone().multiplyScalar(0.25 + l * 0.75), bulut);
      sahne.background.copy(gokRenk);
      sahne.fog.color.copy(gokRenk);
      sahne.fog.near = (20 + l * 50) * (1 - bulut * 0.5);
      sahne.fog.far = (80 + l * 100) * (1 - bulut * 0.45) * (DUSUK ? 0.6 : 1);
      if (kutupta && ku.tipi) {
        sahne.fog.near = 2;
        sahne.fog.far = 28;
      } else if (kutupta && kh && kh.tur === 'sis') {
        sahne.fog.near = 6;
        sahne.fog.far = 60;
      }
      // Zemin yağmurla yeşerir, kurakta sararır; gölet çekilir
      if (eko) {
        zemin.material.color.copy(kuruZemin).lerp(yesilZemin, Math.min(1, Math.max(0, (eko.yesil - 0.15) / 0.8)));
        const gs = (GOLET.su === undefined ? GOLET.r : GOLET.su) / GOLET.r;
        golet.visible = gs > 0.01;
        golet.scale.set(Math.max(0.01, gs), Math.max(0.01, gs), 1);
        goletKiyi.material.color.copy(goletKiyiRenk).lerp(kuruCamur, 1 - Math.min(1, eko.golet * 1.5));
      }
      // Yağmur damlaları
      damlalar.visible = !kutupta && !!(eko && eko.yagmurVar);
      if (damlalar.visible) {
        const n = eko.siddet > 0.8 ? DAMLA : Math.floor(DAMLA * 0.45);
        const hiz = 18 * dt;
        for (let i = 0; i < DAMLA; i++) {
          damlaY[i] -= hiz;
          if (damlaY[i] < 0) {
            damlaY[i] += 14;
            damlaX[i] = (Math.random() - 0.5) * 40;
            damlaZ[i] = (Math.random() - 0.5) * 40;
          }
          const x = i < n ? o.x + damlaX[i] : 0;
          const z = i < n ? R(o.y) + damlaZ[i] : 0;
          const y = i < n ? damlaY[i] : -50;
          damlaKonum.set([x, y, z, x + 0.05, y + 0.7, z], i * 6);
        }
        damlaGeo.attributes.position.needsUpdate = true;
      }
      gok.intensity = 0.28 + l * 0.85;
      gunes.intensity = 0.12 + l * 1.2;
      gunes.color.copy(renkKarisim('#9aaad8', '#fff3dd', l));
      isik.visible = l < 0.5;

      // Araç ve araştırmacı
      arac.position.set(k.arac.x, 0, R(k.arac.y));
      arac.rotation.y = -k.arac.yon;
      const aracTuru = arac.userData.turler[k.aracTuru] ? k.aracTuru : 'arazi';
      Object.keys(arac.userData.turler).forEach((t) => (arac.userData.turler[t].visible = t === aracTuru));
      const acikArac = aracTuru === 'atv' || aracTuru === 'motosiklet'; // açık araçta sürücü görünür, selede oturur
      insan.visible = !k.aracta || acikArac;
      insan.position.set(o.x, k.teknede ? -0.35 : k.aracta && acikArac ? 0.55 : 0, R(o.y));
      insan.rotation.y = -o.yon;
      // Aşama 8: tekne (teknedeyken araştırmacı oturur), dron (uçarken 10 metrede), saha kampı
      tekne.visible = !!(k.ekipman && k.ekipman.tekne);
      if (tekne.visible) {
        tekne.position.set(k.tekne.x, -0.1 + Math.sin(d.zaman * 1.3) * 0.04, R(k.tekne.y));
        tekne.rotation.y = -k.tekne.yon;
        tekne.rotation.z = Math.sin(d.zaman * 0.9) * 0.03;
      }
      dron.visible = !!d.dron;
      if (d.dron) {
        const yukselis = Math.min(1, Math.hypot(d.dron.x - o.x, d.dron.y - o.y) / 8);
        dron.position.set(d.dron.x, 1.5 + yukselis * 9, R(d.dron.y));
        dron.userData.pervaneler.forEach((p, i) => (p.rotation.y = d.zaman * 40 * (i % 2 ? 1 : -1)));
      }
      kamp.visible = !!k.kamp;
      if (k.kamp) kamp.position.set(k.kamp.x, 0, R(k.kamp.y));
      const zy = k.hikaye && k.hikaye.ziyaretci && k.dk < k.hikaye.ziyaretci.bitis ? k.hikaye.ziyaretci : null;
      for (const [kim, m] of Object.entries(ziyaretciler)) {
        m.visible = !!zy && zy.kim === kim && !k.magara;
        if (m.visible) {
          m.position.set(zy.x, 0, R(zy.y));
          m.rotation.y = -Math.atan2(o.x - zy.x, o.y - zy.y); // oyuncuya dönük
        }
      }

      // Uzak alan: kamera o alanın noktasında, gün ışığıyla
      const uzakAlan = k.magara && k.magara.alan;
      for (const [a, g] of Object.entries(uzakGruplar)) g.visible = a === uzakAlan;
      if (uzakAlan) {
        magaraGrup.visible = false;
        fener.intensity = 0;
        const z = -k.magara.oda * 30 + 4;
        kamKonum.set(UX, 1.7, z);
        kamera.position.lerp(kamKonum, Math.min(1, dt * 2.5));
        kamera.lookAt(UX, 1.5, z - 20);
        sahne.fog.near = uzakAlan === 'dag' ? 4 : 20;
        sahne.fog.far = uzakAlan === 'dag' ? 45 : 160;
        insan.visible = false;
        arac.visible = false;
        ciz.render(sahne, kamera);
        if (gl.endFrameEXP) gl.endFrameEXP();
        return;
      }
      // Mağara: kamera tünelin içinde, fener ışığıyla
      magaraGrup.visible = !!k.magara;
      fener.intensity = k.magara ? 45 : 0;
      if (k.magara) {
        const z = odaZ[k.magara.oda] + 3;
        kamKonum.set(0, 1.6, z);
        kamera.position.lerp(kamKonum, Math.min(1, dt * 3));
        kamera.lookAt(0, 1.4, z - 10);
        fener.position.copy(kamera.position);
        sahne.background.set('#050403');
        sahne.fog.color.set('#050403');
        sahne.fog.near = 3;
        sahne.fog.far = 24;
        gok.intensity = 0.15;
        gunes.intensity = 0;
        insan.visible = false;
        arac.visible = false;
        ciz.render(sahne, kamera);
        if (gl.endFrameEXP) gl.endFrameEXP();
        return;
      }
      arac.visible = !kutupta;
      // Alevler, duman, yanık alanlar ve taşkın
      if (eko && eko.yanan) {
        const yanan = Object.keys(eko.yanan).map(Number);
        let ai = 0;
        let di = 0;
        for (const h of yanan) {
          const c = hucreMerkez(h);
          if (Math.abs(c.x - o.x) > 130 || Math.abs(c.y - o.y) > 130) continue;
          for (let j = 0; j < 4 && ai < ALEV; j++, ai++) {
            const m = alevler[ai];
            m.visible = true;
            const ox = ((h * 7 + j * 13) % 20) - 10;
            const oz = ((h * 11 + j * 5) % 20) - 10;
            const titre = 0.7 + Math.abs(Math.sin(saat * 9 + h + j)) * 0.6;
            m.scale.set(1, titre, 1);
            m.position.set(c.x + ox, 1.2 * titre, R(c.y + oz));
          }
          if (di < dumanlar.length) {
            const m = dumanlar[di++];
            m.visible = true;
            const yuk = (saat * 2 + h) % 12;
            m.position.set(c.x, 4 + yuk, R(c.y));
            m.scale.setScalar(1 + yuk * 0.25);
          }
        }
        for (; ai < ALEV; ai++) alevler[ai].visible = false;
        for (; di < dumanlar.length; di++) dumanlar[di].visible = false;
        const yanikH = Object.keys(eko.yanik || {});
        const imza = yanikH.length + ':' + yanikH.slice(-3).join(',');
        if (imza !== yanikImza) {
          yanikImza = imza;
          yanikIm.count = Math.min(256, yanikH.length);
          yanikH.slice(0, 256).forEach((hs, i) => {
            const c = hucreMerkez(Number(hs));
            q.setFromEuler(new THREE.Euler(-Math.PI / 2, 0, 0));
            olcek.set(1, 1, 1);
            yer.set(c.x, 0.04, R(c.y));
            m4.compose(yer, q, olcek);
            yanikIm.setMatrixAt(i, m4);
          });
          yanikIm.instanceMatrix.needsUpdate = true;
        }
        su.material.color.copy(nehirRenk).lerp(selRenk, eko.taskin ? 0.8 : 0);
      }
      // Kamera
      const dikey = kamera.aspect < 1 ? 1.35 : 1; // dikey ekranda kamera biraz daha geride ve yüksekte
      // Aşama 24 (karar 13): kamera uzaklığı ve açısı ayarlardan; araç sürerken alçak, uzun bir takip açısı
      const ka = d.kameraAyar || {};
      const uzK = { yakin: 0.6, normal: 1, uzak: 1.55 }[ka.uzak] || 1;
      const aciK = { arka: 0, sag: Math.PI / 2, sol: -Math.PI / 2, on: Math.PI, yuksek: 0 }[ka.aci] || 0;
      const yuksek = ka.aci === 'yuksek';
      const aracHizli = k.aracta && Math.abs(d.aracHiz || 0) > 3;
      const geri = (k.aracta ? (aracHizli ? 14 : 12) : 8) * dikey * uzK * (yuksek ? 0.55 : 1);
      const ay = o.yon + aciK;
      const boy = (k.aracta ? (aracHizli ? 4.2 : 6) : 4.4) * dikey * Math.sqrt(uzK) * (yuksek ? 3.2 : 1);
      kamKonum.set(o.x - Math.sin(ay) * geri, boy, R(o.y - Math.cos(ay) * geri));
      if (aciK) kamHedef.set(o.x, 1.2, R(o.y));
      else kamHedef.set(o.x + Math.sin(o.yon) * 1.5, 1.5, R(o.y + Math.cos(o.yon) * 1.5));
      // Keşif anı (Aşama 9, karar 85): kamera birkaç saniye hayvana yaklaşır, sonra geri döner
      const sn = d.sinematik;
      let hiz = 5;
      if (sn && d.zaman < sn.bitis) {
        const hb = sn.id ? d.hayvanMap.get(sn.id) : null;
        const tx = hb ? hb.x : sn.x;
        const ty = hb ? hb.y : sn.y;
        const dx = o.x - tx;
        const dy = o.y - ty;
        const m = Math.hypot(dx, dy) || 1;
        const uz = Math.min(7, m * 0.6 + 3);
        kamKonum.set(tx + (dx / m) * uz + (dy / m) * 2, 2.6, R(ty + (dy / m) * uz - (dx / m) * 2));
        kamHedef.set(tx, 1.1, R(ty));
        hiz = 1.6;
      } else if (sn) d.sinematik = null;
      if (ilk) {
        kamera.position.copy(kamKonum);
        ilk = false;
      } else kamera.position.lerp(kamKonum, Math.min(1, dt * hiz));
      kamera.lookAt(kamHedef);

      // Hayvanlar
      const lesVar = new Set(k.lesler.map((x) => x.bireyId));
      const goruldu = new Set();
      for (const b of k.hayvanlar) {
        const uzak = Math.abs(b.x - o.x) > CIZIM || Math.abs(b.y - o.y) > CIZIM;
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
        if (t.kutup && t.suCanlisi && kutupta && Kt.sudaMi(b.x, b.y, k.dk)) {
          // Kutup denizinde: belugalar yüzeyde sırtı görünür, dalan fok ve mors su altında kaybolur
          const dalgin = b.davranis === 'dalisYapiyor' || b.davranis === 'dipteBesleniyor';
          yuk = (dalgin ? -1.6 : b.tur === 'beluga' ? -0.42 + Math.sin(saat * 0.9 + b.id) * 0.12 : -0.35) * t.boy * m.userData.olcek;
        }
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
      modeller.forEach((mm, id) => {
        if (!goruldu.has(id)) mm.m.visible = false;
      });
      const gb = d.gozlemId ? d.hayvanMap.get(d.gozlemId) : null;
      halka.visible = !!(gb && !gb.olu && goruldu.has(gb.id));
      if (halka.visible) {
        halka.position.set(gb.x, 0.08, R(gb.y));
        const bb = Math.max(0.8, TURLER[gb.tur].boy * 1.3);
        halka.scale.set(bb, bb, bb);
        halka.rotation.z = saat;
      }
      golet.material.color.setHSL(0.52, 0.28, 0.2 + l * 0.22);
      (k.tesisler || []).forEach((id) => {
        if (!tesisModelleri.has(id)) tesisModelleri.set(id, tesisModeli(id));
      });
      const tuzakIdler = new Set((k.tuzaklar || []).map((t) => t.id));
      (k.tuzaklar || []).forEach((t) => {
        if (!tuzakModelleri.has(t.id)) tuzakModelleri.set(t.id, tuzakModeli(t));
      });
      tuzakModelleri.forEach((m, id) => {
        if (!tuzakIdler.has(id)) {
          sahne.remove(m);
          tuzakModelleri.delete(id);
        }
      });
      ciz.render(sahne, kamera);
      if (gl.endFrameEXP) gl.endFrameEXP();
    },
    birak() {
      ciz.dispose();
    },
  };
}
