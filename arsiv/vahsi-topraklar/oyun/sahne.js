// ==== 3B SAHNE (expo-gl + three) ====
// Haritayı düşük poligonlu şekillerle çizer. Mantık koordinatı (x doğu, y kuzey) three'de (x, 0, -y);
// yön (0 = kuzey) three'de rotation.y = -yon. Kamera avcının arkasından ve üstünden bakar.
import * as THREE from 'three';
import { HAYVANLAR } from './veri.js';
import { hesapla } from './mantik.js';

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

// ---- Avcı ----
function silahModeli(sekil) {
  const g = new THREE.Group();
  switch (sekil) {
    case 'yay':
      parca(g, new THREE.TorusGeometry(0.45, 0.035, 4, 12, Math.PI), '#7a5230', 0, 0, 0, 0, 0, Math.PI / 2);
      parca(g, new THREE.BoxGeometry(0.01, 0.9, 0.01), '#e8e2d0', 0, 0, 0);
      break;
    case 'mizrak':
      parca(g, new THREE.CylinderGeometry(0.03, 0.03, 2.0, 5), '#6b4a2e', 0, 0.3, 0);
      parca(g, new THREE.ConeGeometry(0.07, 0.3, 4), '#cfd4da', 0, 1.45, 0);
      break;
    case 'balta':
      parca(g, new THREE.CylinderGeometry(0.035, 0.035, 1.0, 5), '#6b4a2e', 0, 0.2, 0);
      parca(g, new THREE.BoxGeometry(0.36, 0.28, 0.04), '#b8bec6', 0.14, 0.62, 0);
      break;
    case 'kilic':
      parca(g, new THREE.BoxGeometry(0.07, 0.95, 0.03), '#d6dbe2', 0, 0.45, 0);
      parca(g, new THREE.BoxGeometry(0.28, 0.05, 0.06), '#8a6a3a', 0, -0.05, 0);
      break;
    case 'bicak':
      parca(g, new THREE.BoxGeometry(0.05, 0.35, 0.02), '#d6dbe2', 0, 0.2, 0);
      break;
    default:
      parca(g, new THREE.CylinderGeometry(0.05, 0.09, 0.9, 6), '#7a5532', 0, 0.3, 0);
  }
  return g;
}

function avciModeli(zirhRengi) {
  const g = new THREE.Group();
  parca(g, new THREE.CylinderGeometry(0.32, 0.36, 0.95, 8), zirhRengi, 0, 0.95, 0);
  parca(g, new THREE.SphereGeometry(0.24, 10, 8), '#e0b48c', 0, 1.62, 0);
  parca(g, new THREE.ConeGeometry(0.34, 0.25, 8), '#5a3d26', 0, 1.86, 0); // şapka
  parca(g, new THREE.BoxGeometry(0.16, 0.5, 0.18), '#3a2e26', -0.13, 0.25, 0);
  parca(g, new THREE.BoxGeometry(0.16, 0.5, 0.18), '#3a2e26', 0.13, 0.25, 0);
  parca(g, new THREE.BoxGeometry(0.13, 0.6, 0.13), zirhRengi, -0.43, 1.05, 0);
  const kol = parca(g, new THREE.BoxGeometry(0.13, 0.6, 0.13), zirhRengi, 0.43, 1.05, 0);
  const el = new THREE.Group();
  el.position.set(0.5, 0.85, -0.2);
  el.rotation.x = -0.9;
  g.add(el);
  return { g, el, kol };
}

// ---- Hayvanlar ----
function gozler(g, b, x, y, z, renk = '#ffd34d') {
  parca(g, new THREE.BoxGeometry(0.07 * b, 0.07 * b, 0.04 * b), renk, -x * b, y * b, z * b);
  parca(g, new THREE.BoxGeometry(0.07 * b, 0.07 * b, 0.04 * b), renk, x * b, y * b, z * b);
}
function dortAyak(g, b, renk, gx, gy, gz, bacak, araX, araZ) {
  [-1, 1].forEach((sx) =>
    [-1, 1].forEach((sz) => {
      const a = parca(g, new THREE.BoxGeometry(0.14 * b, bacak * b, 0.14 * b), renk, sx * araX * b, (bacak / 2) * b, sz * araZ * b);
      a.userData.bacak = sx * sz;
    })
  );
}
function hayvanModeli(tur) {
  const t = HAYVANLAR[tur];
  const b = t.boy;
  const r = t.renk;
  const g = new THREE.Group();
  switch (t.sekil) {
    case 'ayi':
      parca(g, new THREE.BoxGeometry(0.9 * b, 0.75 * b, 1.4 * b), r, 0, 0.85 * b, 0);
      parca(g, new THREE.BoxGeometry(0.55 * b, 0.5 * b, 0.5 * b), r, 0, 1.05 * b, -0.85 * b);
      parca(g, new THREE.BoxGeometry(0.25 * b, 0.2 * b, 0.2 * b), '#3a2a1c', 0, 0.95 * b, -1.15 * b);
      parca(g, new THREE.SphereGeometry(0.1 * b, 5, 4), r, -0.2 * b, 1.35 * b, -0.8 * b);
      parca(g, new THREE.SphereGeometry(0.1 * b, 5, 4), r, 0.2 * b, 1.35 * b, -0.8 * b);
      gozler(g, b, 0.13, 1.12, -1.11, '#1a1a1a');
      dortAyak(g, b, r, 0, 0, 0, 0.5, 0.3, 0.5);
      break;
    case 'kedi':
      parca(g, new THREE.BoxGeometry(0.5 * b, 0.45 * b, 1.4 * b), r, 0, 0.75 * b, 0);
      parca(g, new THREE.BoxGeometry(0.42 * b, 0.4 * b, 0.42 * b), r, 0, 0.98 * b, -0.82 * b);
      if (tur === 'aslan' || tur === 'aslanKral') parca(g, new THREE.DodecahedronGeometry(0.42 * b, 0), '#7a4a1e', 0, 0.98 * b, -0.68 * b);
      parca(g, new THREE.BoxGeometry(0.08 * b, 0.08 * b, 0.9 * b), r, 0, 0.85 * b, 1.05 * b, 0.5);
      gozler(g, b, 0.11, 1.05, -1.04, '#c8f05a');
      dortAyak(g, b, r, 0, 0, 0, 0.55, 0.18, 0.5);
      break;
    case 'gergedan':
      parca(g, new THREE.BoxGeometry(0.9 * b, 0.75 * b, 1.6 * b), r, 0, 0.85 * b, 0);
      parca(g, new THREE.BoxGeometry(0.5 * b, 0.5 * b, 0.65 * b), r, 0, 0.8 * b, -1.05 * b);
      parca(g, new THREE.ConeGeometry(0.1 * b, 0.45 * b, 5), '#e6e0cf', 0, 1.15 * b, -1.3 * b, -0.4);
      gozler(g, b, 0.2, 0.9, -1.2, '#1a1a1a');
      dortAyak(g, b, r, 0, 0, 0, 0.5, 0.3, 0.55);
      break;
    case 'timsah':
      parca(g, new THREE.BoxGeometry(0.6 * b, 0.3 * b, 1.8 * b), r, 0, 0.3 * b, 0);
      parca(g, new THREE.BoxGeometry(0.4 * b, 0.22 * b, 0.9 * b), r, 0, 0.28 * b, -1.3 * b);
      parca(g, new THREE.ConeGeometry(0.25 * b, 1.4 * b, 4), r, 0, 0.25 * b, 1.55 * b, Math.PI / 2);
      gozler(g, b, 0.12, 0.45, -0.95);
      dortAyak(g, b, r, 0, 0, 0, 0.2, 0.36, 0.55);
      break;
    case 'yilan':
      for (let i = 0; i < 7; i++) {
        const p = parca(g, new THREE.SphereGeometry((0.16 - i * 0.012) * b, 6, 5), r, Math.sin(i * 1.1) * 0.22 * b, 0.14 * b, (-0.5 + i * 0.28) * b);
        p.userData.yilan = i;
      }
      parca(g, new THREE.BoxGeometry(0.22 * b, 0.14 * b, 0.28 * b), r, 0, 0.22 * b, -0.75 * b);
      gozler(g, b, 0.07, 0.3, -0.88, '#ff4d4d');
      break;
    case 'akrep':
      parca(g, new THREE.BoxGeometry(0.6 * b, 0.25 * b, 0.9 * b), r, 0, 0.3 * b, 0);
      for (let i = 0; i < 4; i++) parca(g, new THREE.BoxGeometry(0.22 * b, 0.2 * b, 0.22 * b), r, 0, (0.4 + i * 0.22) * b, (0.5 + i * 0.12) * b);
      parca(g, new THREE.ConeGeometry(0.08 * b, 0.25 * b, 4), '#2a1a0a', 0, 1.3 * b, 0.65 * b, 2.6);
      [-1, 1].forEach((s) => {
        parca(g, new THREE.BoxGeometry(0.12 * b, 0.1 * b, 0.5 * b), r, s * 0.3 * b, 0.3 * b, -0.65 * b);
        parca(g, new THREE.BoxGeometry(0.2 * b, 0.12 * b, 0.22 * b), r, s * 0.32 * b, 0.3 * b, -0.95 * b);
        for (let i = 0; i < 3; i++) parca(g, new THREE.BoxGeometry(0.6 * b, 0.05 * b, 0.05 * b), r, s * 0.45 * b, 0.18 * b, (-0.25 + i * 0.25) * b, 0, 0, s * 0.4);
      });
      gozler(g, b, 0.1, 0.45, -0.46, '#1a1a1a');
      break;
    case 'kus': {
      const govde = new THREE.Group();
      parca(govde, new THREE.BoxGeometry(0.35 * b, 0.3 * b, 0.8 * b), r, 0, 0, 0);
      parca(govde, new THREE.BoxGeometry(0.22 * b, 0.22 * b, 0.25 * b), '#f2f0ea', 0, 0.1 * b, -0.48 * b);
      parca(govde, new THREE.ConeGeometry(0.06 * b, 0.18 * b, 4), '#e8b33a', 0, 0.08 * b, -0.67 * b, -Math.PI / 2);
      const k1 = parca(govde, new THREE.BoxGeometry(1.1 * b, 0.04 * b, 0.4 * b), r, -0.7 * b, 0.05 * b, 0);
      const k2 = parca(govde, new THREE.BoxGeometry(1.1 * b, 0.04 * b, 0.4 * b), r, 0.7 * b, 0.05 * b, 0);
      k1.userData.kanat = -1;
      k2.userData.kanat = 1;
      govde.position.y = 2.2;
      govde.userData.kusGovde = true;
      g.add(govde);
      break;
    }
    default:
      // Kurt, tilki, domuz, sırtlan
      parca(g, new THREE.BoxGeometry(0.5 * b, 0.5 * b, 1.25 * b), r, 0, 0.75 * b, 0);
      parca(g, new THREE.BoxGeometry(0.38 * b, 0.36 * b, 0.48 * b), r, 0, 0.95 * b, -0.8 * b);
      if (tur === 'domuz') {
        parca(g, new THREE.BoxGeometry(0.22 * b, 0.18 * b, 0.12 * b), '#d8a9a0', 0, 0.88 * b, -1.08 * b);
        parca(g, new THREE.ConeGeometry(0.04 * b, 0.2 * b, 4), '#f0ead8', -0.14 * b, 0.82 * b, -1.05 * b, -1.2);
        parca(g, new THREE.ConeGeometry(0.04 * b, 0.2 * b, 4), '#f0ead8', 0.14 * b, 0.82 * b, -1.05 * b, -1.2);
      } else {
        parca(g, new THREE.BoxGeometry(0.2 * b, 0.16 * b, 0.25 * b), r, 0, 0.88 * b, -1.12 * b);
        parca(g, new THREE.ConeGeometry(0.08 * b, 0.22 * b, 4), r, -0.12 * b, 1.22 * b, -0.75 * b);
        parca(g, new THREE.ConeGeometry(0.08 * b, 0.22 * b, 4), r, 0.12 * b, 1.22 * b, -0.75 * b);
        parca(g, new THREE.BoxGeometry(0.1 * b, 0.1 * b, 0.6 * b), tur === 'tilki' ? '#f2e6d8' : r, 0, 0.85 * b, 0.85 * b, 0.6);
      }
      gozler(g, b, 0.1, 1.02, -1.05);
      dortAyak(g, b, r, 0, 0, 0, 0.5, 0.18, 0.45);
  }
  // Seviye/patron işareti: patronların başında kırmızı halka
  if (t.patron) {
    const halka = parca(g, new THREE.TorusGeometry(0.35, 0.05, 4, 12), '#ff3b30', 0, (t.sekil === 'kus' ? 3.0 : 1.9) * b, 0, Math.PI / 2);
    halka.userData.patron = true;
  }
  return g;
}

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
  const H = d.harita;
  ciz.setClearColor(H.gok);

  const sahne = new THREE.Scene();
  sahne.background = new THREE.Color(H.gok);
  sahne.fog = new THREE.Fog(H.gok, H.sis[0], H.sis[1]);
  const kamera = new THREE.PerspectiveCamera(60, genislik / yukseklik, 0.1, 220);
  const merkezKaydir = (w, h) => {
    const o = Math.round(h * 0.06);
    kamera.setViewOffset(w, h + 2 * o, 0, 2 * o, w, h);
  };
  merkezKaydir(genislik, yukseklik);

  sahne.add(new THREE.HemisphereLight('#eaf4ff', '#4d5b3a', 1.1));
  const gunes = new THREE.DirectionalLight('#fff3dd', 1.3);
  gunes.position.set(40, 80, 20);
  sahne.add(gunes);

  // Zemin ve sınır
  const zemin = new THREE.Mesh(new THREE.CircleGeometry(H.yaricap + 80, 64), mat(H.zemin));
  zemin.rotation.x = -Math.PI / 2;
  sahne.add(zemin);
  // Kamp alanı: açık toprak
  const kampZemin = new THREE.Mesh(new THREE.CircleGeometry(13, 32), mat('#8a7350'));
  kampZemin.rotation.x = -Math.PI / 2;
  kampZemin.position.y = 0.01;
  sahne.add(kampZemin);
  // Haritanın kenarı: kayalık bir sırt
  const sinirGeo = new THREE.DodecahedronGeometry(3, 0);
  const sinirSayi = 90;
  const sinir = new THREE.InstancedMesh(sinirGeo, mat(H.id === 'dag' ? '#a9b3bc' : H.id === 'col' ? '#b88f55' : '#6d6b65'), sinirSayi);
  const m4 = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const olcek = new THREE.Vector3();
  const yer = new THREE.Vector3();
  for (let i = 0; i < sinirSayi; i++) {
    const a = (i / sinirSayi) * Math.PI * 2;
    const s = 1 + ((i * 37) % 7) / 6;
    q.identity();
    olcek.set(s * 1.4, s * 1.2, s * 1.4);
    yer.set(Math.sin(a) * (H.yaricap + 3), 1.5 * s, R(Math.cos(a) * (H.yaricap + 3)));
    m4.compose(yer, q, olcek);
    sinir.setMatrixAt(i, m4);
  }
  sahne.add(sinir);

  // Göller
  d.goller.forEach((gol) => {
    const su = new THREE.Mesh(new THREE.CircleGeometry(gol.r, 20), new THREE.MeshLambertMaterial({ color: '#3d6a6a' }));
    su.rotation.x = -Math.PI / 2;
    su.position.set(gol.x, 0.03, R(gol.y));
    sahne.add(su);
  });

  // Ağaçlar ve kayalar: örneklenmiş çizim
  const ornekle = (geo, renk, liste, yerlestir) => {
    if (!liste.length) return;
    const im = new THREE.InstancedMesh(geo, mat(renk), liste.length);
    liste.forEach((e, i) => {
      yerlestir(e);
      m4.compose(yer, q, olcek);
      im.setMatrixAt(i, m4);
    });
    sahne.add(im);
  };
  const agaclar = d.engeller.filter((e) => e.tur === 'agac');
  const turu = (t) => agaclar.filter((e) => e.agacTur === t);
  const dik = (y) => (e) => {
    q.identity();
    olcek.set(e.boy, e.boy, e.boy);
    yer.set(e.x, y * e.boy, R(e.y));
  };
  ornekle(new THREE.CylinderGeometry(0.18, 0.25, 1.6, 6), '#6b4a2e', turu('cam'), dik(0.8));
  ornekle(new THREE.ConeGeometry(1.4, 3.2, 7), '#2f6b32', turu('cam'), dik(2.9));
  ornekle(new THREE.CylinderGeometry(0.18, 0.25, 1.6, 6), '#5a4030', turu('karcam'), dik(0.8));
  ornekle(new THREE.ConeGeometry(1.4, 3.2, 7), '#3f6a52', turu('karcam'), dik(2.9));
  ornekle(new THREE.ConeGeometry(0.9, 1.0, 7), '#f4f7fa', turu('karcam'), dik(4.1));
  ornekle(new THREE.CylinderGeometry(0.3, 0.4, 2.2, 7), '#5e4128', turu('mese'), dik(1.1));
  ornekle(new THREE.IcosahedronGeometry(1.9, 0), '#3f6e2c', turu('mese'), dik(3.2));
  ornekle(new THREE.CylinderGeometry(0.12, 0.22, 3.2, 5), '#4a3b30', turu('olu'), dik(1.6));
  ornekle(new THREE.BoxGeometry(0.12, 1.4, 0.12), '#4a3b30', turu('olu'), (e) => {
    q.setFromEuler(new THREE.Euler(0, e.x, 0.8));
    olcek.set(e.boy, e.boy, e.boy);
    yer.set(e.x + 0.4 * e.boy, 2.4 * e.boy, R(e.y));
  });
  ornekle(new THREE.CylinderGeometry(0.28, 0.32, 2.2, 8), '#4f8a3c', turu('kaktus'), dik(1.1));
  ornekle(new THREE.CylinderGeometry(0.14, 0.16, 0.9, 6), '#4f8a3c', turu('kaktus'), (e) => {
    q.identity();
    olcek.set(e.boy, e.boy, e.boy);
    yer.set(e.x + 0.45 * e.boy, 1.4 * e.boy, R(e.y));
  });
  ornekle(new THREE.CylinderGeometry(0.03, 0.05, 1.6, 4), '#7c8a4a', turu('saz'), dik(0.8));
  ornekle(new THREE.CylinderGeometry(0.18, 0.26, 3.0, 6), '#5e4128', turu('akasya'), dik(1.5));
  ornekle(new THREE.CylinderGeometry(2.6, 2.0, 0.6, 9), '#6e8a32', turu('akasya'), dik(3.2));
  ornekle(new THREE.DodecahedronGeometry(1, 0), H.id === 'dag' ? '#9aa3ab' : H.id === 'col' ? '#b7935d' : '#8a8780', d.engeller.filter((e) => e.tur === 'kaya'), (e) => {
    q.identity();
    olcek.set(e.r, e.r * 0.7, e.r);
    yer.set(e.x, e.r * 0.3, R(e.y));
  });

  // Kamp: çadırlar, ateş, tüccar
  const kamp = new THREE.Group();
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2 + 0.8;
    parca(kamp, new THREE.ConeGeometry(1.6, 2.4, 6), '#8a6a3a', Math.sin(a) * 8, 1.2, Math.cos(a) * 8);
  }
  parca(kamp, new THREE.CylinderGeometry(0.9, 0.9, 0.2, 8), '#3a3330', -3, 0.1, 3);
  const ates = parca(kamp, new THREE.OctahedronGeometry(0.5), '#ff8a3d', -3, 0.6, 3);
  sahne.add(kamp);
  const tuccar = avciModeli('#2c5aa0').g;
  tuccar.position.set(d.tuccar.x, 0, R(d.tuccar.y));
  tuccar.rotation.y = -d.tuccar.yon;
  const isaret = parca(tuccar, new THREE.OctahedronGeometry(0.25), '#ffd34d', 0, 2.4, 0);
  sahne.add(tuccar);

  // Avcı
  const avci = avciModeli('#6b5a3a');
  sahne.add(avci.g);
  let silahAdi = null;
  let silahGrup = null;
  let zirhAdi = null;
  const silahGuncelle = () => {
    const h = hesapla(d.k);
    if (h.silah.id !== silahAdi) {
      if (silahGrup) avci.el.remove(silahGrup);
      silahGrup = silahModeli(h.silah.sekil);
      avci.el.add(silahGrup);
      silahAdi = h.silah.id;
    }
    if (h.zirh.id !== zirhAdi) {
      zirhAdi = h.zirh.id;
      const renk = { yok: '#6b5a3a', deriYelek: '#7a5532', kalinPost: '#5a4632', pulluZirh: '#7d8a8f', kemikZirh: '#d8d0bc', ejderPulu: '#8a2b2b' }[zirhAdi] || '#6b5a3a';
      avci.g.children.forEach((c) => {
        if (c.material && (c.position.y > 0.6 && c.position.y < 1.4)) c.material = mat(renk);
      });
    }
  };
  silahGuncelle();

  // Hayvanlar
  const modeller = new Map();
  d.hayvanlar.forEach((c) => {
    const m = hayvanModeli(c.tur);
    m.position.set(c.x, 0, R(c.y));
    sahne.add(m);
    modeller.set(c.id, { m, vurus: 0, adim: Math.random() * 6 });
  });

  // Hedef halkası
  const halka = new THREE.Mesh(new THREE.RingGeometry(0.9, 1.15, 24), new THREE.MeshBasicMaterial({ color: '#ff3b30', side: THREE.DoubleSide }));
  halka.rotation.x = -Math.PI / 2;
  halka.position.y = 0.05;
  halka.visible = false;
  sahne.add(halka);

  // Oklar
  const mermiler = [];
  const okGeo = new THREE.BoxGeometry(0.04, 0.04, 0.8);
  function ok(bas, son) {
    const m = new THREE.Mesh(okGeo, mat('#e8d9a8'));
    m.position.copy(bas);
    m.lookAt(son);
    sahne.add(m);
    mermiler.push({ m, bas: bas.clone(), son: son.clone(), t: 0 });
  }

  const kamHedef = new THREE.Vector3();
  const kamKonum = new THREE.Vector3();
  let ilk = true;
  let saat = 0;
  let savurma = 0;

  return {
    boyut(w, h) {
      ciz.setSize(w, h, false);
      kamera.aspect = w / h;
      merkezKaydir(w, h);
      kamera.updateProjectionMatrix();
    },
    efekt(o) {
      if (o.tur === 'hasarVerdin' || o.tur === 'iska') {
        const mm = modeller.get(o.id);
        if (mm && o.tur === 'hasarVerdin') mm.vurus = 0.25;
        savurma = 0.3;
        const c = d.hayvanlar.find((x) => x.id === o.id);
        if (c && hesapla(d.k).silah.sekil === 'yay') {
          ok(new THREE.Vector3(d.oyuncu.x, 1.3, R(d.oyuncu.y)), new THREE.Vector3(c.x, 0.8, R(c.y)));
        }
      }
    },
    kare(dt) {
      saat += dt;
      const o = d.oyuncu;
      silahGuncelle();
      avci.g.position.set(o.x, 0, R(o.y));
      avci.g.rotation.y = -o.yon;
      avci.g.visible = !d.olu;
      if (savurma > 0) {
        savurma -= dt;
        avci.el.rotation.x = -0.9 - Math.sin((1 - savurma / 0.3) * Math.PI) * 1.2;
      } else avci.el.rotation.x = -0.9;
      const geri = 8;
      kamKonum.set(o.x - Math.sin(o.yon) * geri, 4.4, R(o.y - Math.cos(o.yon) * geri));
      kamHedef.set(o.x + Math.sin(o.yon) * 1.5, 1.4, R(o.y + Math.cos(o.yon) * 1.5));
      if (ilk) {
        kamera.position.copy(kamKonum);
        ilk = false;
      } else kamera.position.lerp(kamKonum, Math.min(1, dt * 6));
      kamera.lookAt(kamHedef);
      ates.rotation.y = saat * 3;
      ates.scale.setScalar(1 + Math.sin(saat * 12) * 0.12);
      isaret.rotation.y = saat * 2;

      for (const c of d.hayvanlar) {
        const mm = modeller.get(c.id);
        if (!mm) continue;
        const m = mm.m;
        const uzak = Math.abs(c.x - o.x) > 95 || Math.abs(c.y - o.y) > 95;
        m.visible = !c.olu && !uzak;
        if (!m.visible) continue;
        const dx = c.x - m.position.x;
        const dz = R(c.y) - m.position.z;
        const hareket = Math.hypot(dx, dz) / Math.max(dt, 0.001);
        m.position.set(c.x, 0, R(c.y));
        m.rotation.y = -c.yon;
        mm.adim += dt * Math.min(12, hareket * 2.2);
        const sal = Math.sin(mm.adim) * Math.min(0.6, hareket * 0.12);
        m.children.forEach((p) => {
          if (p.userData.bacak) p.rotation.x = sal * p.userData.bacak;
          if (p.userData.yilan !== undefined) p.position.x = Math.sin(mm.adim + p.userData.yilan * 1.1) * 0.2 * HAYVANLAR[c.tur].boy;
          if (p.userData.kusGovde) {
            p.position.y = c.durum === 'kovala' ? 1.2 + Math.sin(saat * 3) * 0.2 : 2.6 + Math.sin(saat * 1.5 + c.id) * 0.4;
            p.children.forEach((k) => {
              if (k.userData.kanat) k.rotation.z = Math.sin(saat * 10 + c.id) * 0.5 * k.userData.kanat;
            });
          }
          if (p.userData.patron) p.rotation.z = saat * 2;
        });
        if (mm.vurus > 0) {
          mm.vurus -= dt;
          const s2 = 1 + Math.max(0, mm.vurus) * 0.6;
          m.scale.set(s2, 1 / s2, s2);
        } else m.scale.set(1, 1, 1);
      }
      const h = d.hedefId ? d.hayvanlar.find((c) => c.id === d.hedefId && !c.olu) : null;
      halka.visible = !!h;
      if (h) {
        halka.position.set(h.x, 0.05, R(h.y));
        const b = Math.max(0.7, HAYVANLAR[h.tur].boy);
        halka.scale.set(b, b, b);
      }
      for (let i = mermiler.length - 1; i >= 0; i--) {
        const p = mermiler[i];
        p.t += dt / 0.25;
        p.m.position.lerpVectors(p.bas, p.son, Math.min(1, p.t));
        if (p.t >= 1) {
          sahne.remove(p.m);
          mermiler.splice(i, 1);
        }
      }
      ciz.render(sahne, kamera);
      if (gl.endFrameEXP) gl.endFrameEXP();
    },
    birak() {
      ciz.dispose();
    },
  };
}
