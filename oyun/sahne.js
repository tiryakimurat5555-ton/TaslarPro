// ==== 3B SAHNE (expo-gl + three) ====
// Oyun dünyasını düşük poligonlu şekillerle çizer. Mantık koordinatı (x doğu, y kuzey)
// three'de (x, 0, -y) olur; yön (0 = kuzey) three'de rotation.y = -yon.
import * as THREE from 'three';
import { CANAVARLAR, SINIFLAR, IRKLAR, DUNYA } from './veri.js';

const R = (x) => -x; // y → three z

function mat(renk) {
  return new THREE.MeshLambertMaterial({ color: renk, flatShading: true });
}

// İki ayaklı basit beden: gövde, baş, kollar
function insansi({ govde, ten, boy = 1.8, silahRengi, silah }) {
  const g = new THREE.Group();
  const o = boy / 1.8;
  const beden = new THREE.Mesh(new THREE.CylinderGeometry(0.32 * o, 0.38 * o, 0.95 * o, 8), mat(govde));
  beden.position.y = 0.95 * o;
  const bas = new THREE.Mesh(new THREE.SphereGeometry(0.24 * o, 10, 8), mat(ten));
  bas.position.y = 1.62 * o;
  const ayak1 = new THREE.Mesh(new THREE.BoxGeometry(0.16 * o, 0.5 * o, 0.18 * o), mat('#3a2e26'));
  ayak1.position.set(-0.13 * o, 0.25 * o, 0);
  const ayak2 = ayak1.clone();
  ayak2.position.x = 0.13 * o;
  const kol1 = new THREE.Mesh(new THREE.BoxGeometry(0.13 * o, 0.6 * o, 0.13 * o), mat(govde));
  kol1.position.set(-0.43 * o, 1.05 * o, 0);
  const kol2 = kol1.clone();
  kol2.position.x = 0.43 * o;
  g.add(beden, bas, ayak1, ayak2, kol1, kol2);
  if (silah) {
    let s;
    if (silah === 'Yay') {
      s = new THREE.Mesh(new THREE.TorusGeometry(0.42 * o, 0.035 * o, 4, 10, Math.PI), mat(silahRengi || '#7a5230'));
      s.rotation.z = Math.PI / 2;
      s.position.set(0.5 * o, 1.05 * o, -0.15 * o);
    } else if (silah === 'Asa') {
      s = new THREE.Mesh(new THREE.CylinderGeometry(0.04 * o, 0.04 * o, 1.6 * o, 5), mat('#6b4a2e'));
      s.position.set(0.5 * o, 1.0 * o, -0.15 * o);
      const tas = new THREE.Mesh(new THREE.OctahedronGeometry(0.12 * o), mat(silahRengi || '#7fb0ff'));
      tas.position.y = 0.85 * o;
      s.add(tas);
    } else if (silah === 'Topuz') {
      s = new THREE.Mesh(new THREE.CylinderGeometry(0.04 * o, 0.04 * o, 0.8 * o, 5), mat('#6b4a2e'));
      s.position.set(0.5 * o, 0.95 * o, -0.25 * o);
      s.rotation.x = -0.6;
      const bas2 = new THREE.Mesh(new THREE.DodecahedronGeometry(0.13 * o), mat(silahRengi || '#d9c27a'));
      bas2.position.y = 0.45 * o;
      s.add(bas2);
    } else {
      s = new THREE.Mesh(new THREE.BoxGeometry(0.07 * o, 0.95 * o, 0.04 * o), mat(silahRengi || '#d6dbe2'));
      s.position.set(0.5 * o, 1.05 * o, -0.35 * o);
      s.rotation.x = -0.9;
    }
    g.add(s);
  }
  return g;
}

function dortAyakli({ renk, boy = 1 }) {
  const g = new THREE.Group();
  const govde = new THREE.Mesh(new THREE.BoxGeometry(0.6 * boy, 0.55 * boy, 1.3 * boy), mat(renk));
  govde.position.y = 0.75 * boy;
  const bas = new THREE.Mesh(new THREE.BoxGeometry(0.42 * boy, 0.4 * boy, 0.5 * boy), mat(renk));
  bas.position.set(0, 0.95 * boy, -0.8 * boy);
  const gozRengi = mat('#ffd34d');
  const goz1 = new THREE.Mesh(new THREE.BoxGeometry(0.07 * boy, 0.07 * boy, 0.04 * boy), gozRengi);
  goz1.position.set(-0.11 * boy, 1.03 * boy, -1.06 * boy);
  const goz2 = goz1.clone();
  goz2.position.x = 0.11 * boy;
  g.add(govde, bas, goz1, goz2);
  [-1, 1].forEach((sx) =>
    [-1, 1].forEach((sz) => {
      const a = new THREE.Mesh(new THREE.BoxGeometry(0.14 * boy, 0.5 * boy, 0.14 * boy), mat(renk));
      a.position.set(sx * 0.2 * boy, 0.25 * boy, sz * 0.45 * boy);
      g.add(a);
    })
  );
  return g;
}

function orumcek({ renk, boy = 1 }) {
  const g = new THREE.Group();
  const govde = new THREE.Mesh(new THREE.SphereGeometry(0.55 * boy, 8, 6), mat(renk));
  govde.position.set(0, 0.6 * boy, 0.3 * boy);
  const bas = new THREE.Mesh(new THREE.SphereGeometry(0.32 * boy, 8, 6), mat(renk));
  bas.position.set(0, 0.5 * boy, -0.4 * boy);
  g.add(govde, bas);
  for (let i = 0; i < 4; i++)
    [-1, 1].forEach((s) => {
      const b = new THREE.Mesh(new THREE.BoxGeometry(1.1 * boy, 0.06 * boy, 0.06 * boy), mat(renk));
      b.position.set(s * 0.6 * boy, 0.4 * boy, -0.3 * boy + i * 0.22 * boy);
      b.rotation.z = s * 0.5;
      g.add(b);
    });
  const goz = new THREE.Mesh(new THREE.BoxGeometry(0.3 * boy, 0.06 * boy, 0.05 * boy), mat('#ff4d4d'));
  goz.position.set(0, 0.6 * boy, -0.7 * boy);
  g.add(goz);
  return g;
}

function canavarModeli(tur) {
  const c = CANAVARLAR[tur];
  if (c.sekil === 'dortayak') return dortAyakli({ renk: c.renk, boy: c.boy });
  if (c.sekil === 'orumcek') return orumcek({ renk: c.renk, boy: c.boy });
  return insansi({ govde: c.renk, ten: c.renk, boy: c.boy, silah: 'Kılıç', silahRengi: '#9a9a9a' });
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
  ciz.setClearColor('#9cc7e8');

  const sahne = new THREE.Scene();
  sahne.background = new THREE.Color('#9cc7e8');
  sahne.fog = new THREE.Fog('#9cc7e8', 45, 120);
  const kamera = new THREE.PerspectiveCamera(60, genislik / yukseklik, 0.1, 200);
  // Görüntünün merkezini yukarı kaydır: alt kısım düğmelerle kaplı, oyuncu ekranın üst üçte birinde görünsün
  const merkezKaydir = (w, h) => {
    const o = Math.round(h * 0.06);
    kamera.setViewOffset(w, h + 2 * o, 0, 2 * o, w, h);
  };
  merkezKaydir(genislik, yukseklik);

  sahne.add(new THREE.HemisphereLight('#eaf4ff', '#4d5b3a', 1.1));
  const gunes = new THREE.DirectionalLight('#fff3dd', 1.3);
  gunes.position.set(40, 80, 20);
  sahne.add(gunes);

  // Zemin: çimen, köy meydanı, yollar
  const zemin = new THREE.Mesh(new THREE.CircleGeometry(DUNYA.yaricap + 40, 64), mat('#5f8a3c'));
  zemin.rotation.x = -Math.PI / 2;
  sahne.add(zemin);
  const meydan = new THREE.Mesh(new THREE.CircleGeometry(DUNYA.koyYaricap, 32), mat('#a88a5c'));
  meydan.rotation.x = -Math.PI / 2;
  meydan.position.y = 0.02;
  sahne.add(meydan);
  const yolMat = mat('#9c8358');
  [0, Math.PI / 2].forEach((a) => {
    const yol = new THREE.Mesh(new THREE.PlaneGeometry(4, DUNYA.yaricap * 2), yolMat);
    yol.rotation.x = -Math.PI / 2;
    yol.rotation.z = a;
    yol.position.y = 0.015;
    sahne.add(yol);
  });
  // Bataklık: kuzeyde koyu yeşil halka parçası
  const bataklik = new THREE.Mesh(new THREE.RingGeometry(240, DUNYA.yaricap, 48, 1, Math.PI / 2 - 0.6, 1.2), mat('#2f4a35'));
  bataklik.rotation.x = -Math.PI / 2;
  bataklik.position.y = 0.03;
  sahne.add(bataklik);
  // Dünyanın sınırı: alçak taş duvar
  const duvar = new THREE.Mesh(new THREE.TorusGeometry(DUNYA.yaricap + 1, 0.8, 4, 96), mat('#7d7a70'));
  duvar.rotation.x = Math.PI / 2;
  sahne.add(duvar);

  // Ağaçlar ve kayalar: örneklenmiş (instanced) çizim
  const agaclar = d.engeller.filter((e) => e.tur === 'agac');
  const kayalar = d.engeller.filter((e) => e.tur === 'kaya');
  const evler = d.engeller.filter((e) => e.tur === 'ev');
  const m4 = new THREE.Matrix4();
  const gov = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.18, 0.25, 1.6, 6), mat('#6b4a2e'), agaclar.length);
  const yap = new THREE.InstancedMesh(new THREE.ConeGeometry(1.4, 3.2, 7), mat('#2f6b32'), agaclar.length);
  agaclar.forEach((e, i) => {
    const o = e.boy;
    m4.makeScale(o, o, o).setPosition(e.x, 0.8 * o, R(e.y));
    gov.setMatrixAt(i, m4);
    m4.makeScale(o, o, o).setPosition(e.x, 2.9 * o, R(e.y));
    yap.setMatrixAt(i, m4);
  });
  sahne.add(gov, yap);
  const kaya = new THREE.InstancedMesh(new THREE.DodecahedronGeometry(1, 0), mat('#8a8780'), kayalar.length);
  kayalar.forEach((e, i) => {
    m4.makeScale(e.r, e.r * 0.7, e.r).setPosition(e.x, e.r * 0.3, R(e.y));
    kaya.setMatrixAt(i, m4);
  });
  sahne.add(kaya);
  evler.forEach((e) => {
    const ev = new THREE.Group();
    const duvarlar = new THREE.Mesh(new THREE.BoxGeometry(5, 3, 5), mat('#d8c7a1'));
    duvarlar.position.y = 1.5;
    const cati = new THREE.Mesh(new THREE.ConeGeometry(4.2, 2.4, 4), mat('#8c3b2b'));
    cati.position.y = 4.2;
    cati.rotation.y = Math.PI / 4;
    const kapi = new THREE.Mesh(new THREE.BoxGeometry(1, 1.8, 0.1), mat('#5a3a22'));
    kapi.position.set(0, 0.9, 2.55);
    ev.add(duvarlar, cati, kapi);
    ev.position.set(e.x, 0, R(e.y));
    ev.rotation.y = e.x > 0 ? -Math.PI / 2 : Math.PI / 2;
    sahne.add(ev);
  });
  // Meydandaki kuyu
  const kuyu = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 0.9, 10), mat('#8f8b84'));
  kuyu.position.set(6, 0.45, R(-5));
  sahne.add(kuyu);

  // NPC'ler
  d.npcler.forEach((n) => {
    const g = insansi({ govde: n.id === 'muhtar' ? '#2c5aa0' : '#8a5a2b', ten: '#e0b48c', boy: 1.8 });
    g.position.set(n.x, 0, R(n.y));
    g.rotation.y = -n.yon;
    // Başının üstünde işaret
    const isaret = new THREE.Mesh(new THREE.OctahedronGeometry(0.25), mat(n.id === 'muhtar' ? '#ffd34d' : '#7cd67c'));
    isaret.position.y = 2.4;
    g.add(isaret);
    n.__isaret = isaret;
    sahne.add(g);
  });

  // Oyuncu
  const s = SINIFLAR[d.k.sinif];
  const oyuncu = insansi({ govde: s.renk, ten: IRKLAR[d.k.irk].ten, boy: d.k.irk === 'ork' ? 1.95 : 1.8, silah: s.silah });
  sahne.add(oyuncu);

  // Canavarlar
  const modeller = new Map();
  d.canavarlar.forEach((c) => {
    const m = canavarModeli(c.tur);
    m.position.set(c.x, 0, R(c.y));
    sahne.add(m);
    modeller.set(c.id, { m, vurus: 0 });
  });

  // Hedef halkası
  const halka = new THREE.Mesh(new THREE.RingGeometry(0.9, 1.15, 24), new THREE.MeshBasicMaterial({ color: '#ff3b30', side: THREE.DoubleSide }));
  halka.rotation.x = -Math.PI / 2;
  halka.position.y = 0.05;
  halka.visible = false;
  sahne.add(halka);

  // Mermiler (ok, büyü)
  const mermiler = [];
  const mermiGeo = new THREE.SphereGeometry(0.18, 6, 5);
  function mermi(renk, bas, son) {
    const m = new THREE.Mesh(mermiGeo, new THREE.MeshBasicMaterial({ color: renk }));
    m.position.copy(bas);
    sahne.add(m);
    mermiler.push({ m, bas: bas.clone(), son: son.clone(), t: 0 });
  }

  const kamHedef = new THREE.Vector3();
  const kamKonum = new THREE.Vector3();
  let ilk = true;
  let saat = 0;

  return {
    boyut(w, h) {
      ciz.setSize(w, h, false);
      kamera.aspect = w / h;
      merkezKaydir(w, h);
      kamera.updateProjectionMatrix();
    },
    // Olaylara göre görsel efekt
    efekt(o) {
      if (o.tur === 'hasarVerdin' || o.tur === 'iska') {
        const mm = modeller.get(o.id);
        if (mm) mm.vurus = 0.25;
        const c = d.canavarlar.find((x) => x.id === o.id);
        if (c && (d.k.sinif === 'okcu' || d.k.sinif === 'buyucu') && o.kaynak !== 'zehir') {
          const renk = d.k.sinif === 'okcu' ? '#e8d9a8' : o.kaynak === 'buzOku' ? '#9fe3ff' : '#ff8a3d';
          mermi(renk, new THREE.Vector3(d.oyuncu.x, 1.3, R(d.oyuncu.y)), new THREE.Vector3(c.x, 1, R(c.y)));
        }
      }
    },
    kare(dt) {
      saat += dt;
      const o = d.oyuncu;
      oyuncu.position.set(o.x, 0, R(o.y));
      oyuncu.rotation.y = -o.yon;
      oyuncu.visible = !d.olu;
      // Kamera: oyuncunun arkasından ve üstünden
      const geri = 8;
      kamKonum.set(o.x - Math.sin(o.yon) * geri, 4.4, R(o.y - Math.cos(o.yon) * geri));
      kamHedef.set(o.x + Math.sin(o.yon) * 1.5, 1.4, R(o.y + Math.cos(o.yon) * 1.5));
      if (ilk) {
        kamera.position.copy(kamKonum);
        ilk = false;
      } else kamera.position.lerp(kamKonum, Math.min(1, dt * 6));
      kamera.lookAt(kamHedef);

      for (const c of d.canavarlar) {
        const mm = modeller.get(c.id);
        if (!mm) continue;
        const m = mm.m;
        // Uzaktakileri çizme
        const uzak = Math.abs(c.x - o.x) > 90 || Math.abs(c.y - o.y) > 90;
        m.visible = !c.olu && !uzak;
        if (!m.visible) continue;
        m.position.set(c.x, 0, R(c.y));
        m.rotation.y = -c.yon;
        if (mm.vurus > 0) {
          mm.vurus -= dt;
          const s2 = 1 + Math.max(0, mm.vurus) * 0.6;
          m.scale.set(s2, 1 / s2, s2);
        } else m.scale.set(1, 1, 1);
      }
      const h = d.hedefId ? d.canavarlar.find((c) => c.id === d.hedefId && !c.olu) : null;
      halka.visible = !!h;
      if (h) {
        halka.position.set(h.x, 0.05, R(h.y));
        const b = CANAVARLAR[h.tur].boy;
        halka.scale.set(b, b, b);
      }
      d.npcler.forEach((n) => {
        if (n.__isaret) n.__isaret.rotation.y = saat * 2;
      });
      for (let i = mermiler.length - 1; i >= 0; i--) {
        const p = mermiler[i];
        p.t += dt / 0.25;
        p.m.position.lerpVectors(p.bas, p.son, Math.min(1, p.t));
        if (p.t >= 1) {
          sahne.remove(p.m);
          p.m.material.dispose();
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
