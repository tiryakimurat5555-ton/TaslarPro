import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Animated,
  Easing,
  Modal,
  ScrollView,
  Switch,
  AccessibilityInfo,
  useWindowDimensions,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { createAudioPlayer, setAudioModeAsync } from 'expo-audio';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ==== MANTIK BASLANGIC ====
const N = 6;

const RENK_ADLARI = ['Kırmızı', 'Turuncu', 'Sarı', 'Yeşil', 'Mavi', 'Mor'];
const OZEL_ADLARI = {
  'striped-h': 'yatay çizgili',
  'striped-v': 'dikey çizgili',
  bomb: 'bomba',
  colorbomb: 'renk bombası',
};

let sonrakiId = 1;
function yeniTas(color, special = null) {
  return { id: sonrakiId++, color, special };
}

function rastgele(n) {
  return Math.floor(Math.random() * n);
}

function bosHucre() {
  return { gem: null, ice: 0, chain: false, stone: 0 };
}

function tahtaKopyala(bd) {
  return bd.map((row) => row.map((c) => ({ ...c, gem: c.gem ? { ...c.gem } : null })));
}

function sabitMi(cell) {
  return cell.stone > 0 || cell.chain;
}

function hareketEdebilir(cell) {
  return !!cell.gem && !cell.chain && cell.stone === 0;
}

function bolumAyari(L) {
  const tipler = ['score', 'color', 'special'];
  const type = tipler[(L - 1) % 3];
  const ncolors = L <= 6 ? 5 : 6;
  let target;
  if (type === 'score') target = 300 + (L - 1) * 80;
  else if (type === 'color') target = 18 + L * 2;
  else target = 2 + Math.floor((L - 1) / 6);
  return {
    type,
    target,
    color: type === 'color' ? rastgele(ncolors) : null,
    moves: Math.min(32, 22 + Math.floor((L - 1) / 2)),
    ncolors,
    ice: L >= 5 ? Math.min(12, 3 + (L - 5)) : 0,
    iceStrong: L >= 12,
    chains: L >= 10 ? Math.min(6, 2 + Math.floor((L - 10) / 2)) : 0,
    stones: L >= 15 ? Math.min(5, 1 + Math.floor((L - 15) / 3)) : 0,
    stoneHp: L >= 20 ? 2 : 1,
  };
}

function eslesmeleriBul(bd) {
  const runs = [];
  const renk = (r, c) => {
    const cell = bd[r][c];
    if (!cell.gem || cell.stone > 0) return -2;
    return cell.gem.color;
  };
  for (let r = 0; r < N; r++) {
    let c = 0;
    while (c < N) {
      const col = renk(r, c);
      let e = c + 1;
      while (e < N && col >= 0 && renk(r, e) === col) e++;
      if (col >= 0 && e - c >= 3) {
        const cells = [];
        for (let k = c; k < e; k++) cells.push([r, k]);
        runs.push({ dir: 'h', cells, color: col, len: e - c });
      }
      c = col >= 0 ? e : c + 1;
    }
  }
  for (let c = 0; c < N; c++) {
    let r = 0;
    while (r < N) {
      const col = renk(r, c);
      let e = r + 1;
      while (e < N && col >= 0 && renk(e, c) === col) e++;
      if (col >= 0 && e - r >= 3) {
        const cells = [];
        for (let k = r; k < e; k++) cells.push([k, c]);
        runs.push({ dir: 'v', cells, color: col, len: e - r });
      }
      r = col >= 0 ? e : r + 1;
    }
  }
  return runs;
}

function enCokRenk(bd) {
  const say = {};
  let en = -1;
  let enSay = 0;
  for (let r = 0; r < N; r++)
    for (let c = 0; c < N; c++) {
      const g = bd[r][c].gem;
      if (g && g.color >= 0) {
        say[g.color] = (say[g.color] || 0) + 1;
        if (say[g.color] > enSay) {
          enSay = say[g.color];
          en = g.color;
        }
      }
    }
  return en;
}

function etkiHucreleri(bd, special, r, c, renkSecimi) {
  const out = [];
  if (special === 'striped-h') for (let k = 0; k < N; k++) out.push([r, k]);
  else if (special === 'striped-v') for (let k = 0; k < N; k++) out.push([k, c]);
  else if (special === 'bomb') {
    for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) out.push([r + dr, c + dc]);
  } else if (special === 'colorbomb') {
    const col = renkSecimi != null ? renkSecimi : enCokRenk(bd);
    for (let rr = 0; rr < N; rr++)
      for (let cc = 0; cc < N; cc++) {
        const g = bd[rr][cc].gem;
        if (g && g.color === col) out.push([rr, cc]);
      }
  }
  return out.filter(([a, b]) => a >= 0 && b >= 0 && a < N && b < N);
}

function plandanEslesme(bd, runs, swapPos) {
  const cells = [];
  const create = [];
  const key = (r, c) => r * N + c;
  const swapKeys = new Set((swapPos || []).map((p) => key(p.r, p.c)));
  const hMap = new Map();
  const vMap = new Map();
  runs.forEach((run) => {
    run.used = false;
    run.cells.forEach(([r, c]) => {
      (run.dir === 'h' ? hMap : vMap).set(key(r, c), run);
      cells.push([r, c]);
    });
  });
  const olusmus = new Set();
  hMap.forEach((rh, k) => {
    if (!vMap.has(k)) return;
    const rv = vMap.get(k);
    if (rh.used || rv.used) return;
    rh.used = true;
    rv.used = true;
    const special = rh.len >= 5 || rv.len >= 5 ? 'colorbomb' : 'bomb';
    let yer = k;
    const birlesik = [...rh.cells, ...rv.cells];
    for (const [r, c] of birlesik) if (swapKeys.has(key(r, c))) yer = key(r, c);
    if (olusmus.has(yer)) return;
    olusmus.add(yer);
    create.push({
      r: Math.floor(yer / N),
      c: yer % N,
      special,
      color: special === 'colorbomb' ? -1 : rh.color,
    });
  });
  runs.forEach((run) => {
    if (run.used || run.len < 4) return;
    const special = run.len >= 5 ? 'colorbomb' : run.dir === 'h' ? 'striped-h' : 'striped-v';
    let sec = run.cells[1];
    for (const [r, c] of run.cells) if (swapKeys.has(key(r, c))) sec = [r, c];
    const k = key(sec[0], sec[1]);
    if (olusmus.has(k)) return;
    olusmus.add(k);
    create.push({ r: sec[0], c: sec[1], special, color: special === 'colorbomb' ? -1 : run.color });
  });
  return { cells, forced: [], create, noTrigger: new Set(), colorPick: null };
}

// a ve b takastan sonraki konumlar. Ozel kombinasyon degilse null doner.
function ozelKombo(bd, a, b) {
  const X = bd[a.r][a.c].gem;
  const Y = bd[b.r][b.c].gem;
  if (!X || !Y) return null;
  const tum = [];
  for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) tum.push([r, c]);
  const noTrigger = new Set([a.r * N + a.c, b.r * N + b.c]);
  const plan = (forced, extra = {}) => ({ cells: [], forced, create: [], noTrigger, colorPick: null, ...extra });
  const xs = X.special;
  const ys = Y.special;
  if (xs === 'colorbomb' && ys === 'colorbomb') return { board: bd, plan: plan(tum), effect: 'colorbomb' };
  if (xs === 'colorbomb' || ys === 'colorbomb') {
    const cb = xs === 'colorbomb' ? a : b;
    const O = xs === 'colorbomb' ? Y : X;
    if (!O.special) {
      const forced = etkiHucreleri(bd, 'colorbomb', cb.r, cb.c, O.color);
      forced.push([cb.r, cb.c]);
      return { board: bd, plan: plan(forced), effect: 'colorbomb' };
    }
    const yeni = tahtaKopyala(bd);
    const forced = [[cb.r, cb.c]];
    for (let r = 0; r < N; r++)
      for (let c = 0; c < N; c++) {
        const g = yeni[r][c].gem;
        if (g && g.color === O.color && !yeni[r][c].chain) {
          if (!g.special) {
            g.special = O.special === 'bomb' ? 'bomb' : Math.random() < 0.5 ? 'striped-h' : 'striped-v';
          }
          forced.push([r, c]);
        }
      }
    const p = plan(forced);
    p.noTrigger = new Set([cb.r * N + cb.c]);
    return { board: yeni, plan: p, effect: 'colorbomb', converted: true };
  }
  const cizgili = (s) => s === 'striped-h' || s === 'striped-v';
  if (cizgili(xs) && cizgili(ys)) {
    const forced = [...etkiHucreleri(bd, 'striped-h', b.r, b.c), ...etkiHucreleri(bd, 'striped-v', b.r, b.c)];
    return { board: bd, plan: plan(forced), effect: 'striped' };
  }
  if (xs === 'bomb' && ys === 'bomb') {
    const forced = [];
    for (let dr = -2; dr <= 2; dr++) for (let dc = -2; dc <= 2; dc++) forced.push([b.r + dr, b.c + dc]);
    return { board: bd, plan: plan(forced.filter(([r, c]) => r >= 0 && c >= 0 && r < N && c < N)), effect: 'bomb' };
  }
  if ((xs === 'bomb' && cizgili(ys)) || (ys === 'bomb' && cizgili(xs))) {
    const forced = [];
    for (let d = -1; d <= 1; d++) {
      if (b.r + d >= 0 && b.r + d < N) for (let k = 0; k < N; k++) forced.push([b.r + d, k]);
      if (b.c + d >= 0 && b.c + d < N) for (let k = 0; k < N; k++) forced.push([k, b.c + d]);
    }
    return { board: bd, plan: plan(forced), effect: 'bomb' };
  }
  return null;
}

function temizlikHesapla(bd, plan) {
  const hit = new Map();
  const kuyruk = [];
  const ekle = (r, c, tur) => {
    if (r < 0 || c < 0 || r >= N || c >= N) return;
    const k = r * N + c;
    if (hit.has(k)) return;
    hit.set(k, tur);
    kuyruk.push([r, c]);
  };
  plan.cells.forEach(([r, c]) => ekle(r, c, 'match'));
  plan.forced.forEach(([r, c]) => ekle(r, c, 'effect'));
  const effects = [];
  while (kuyruk.length) {
    const [r, c] = kuyruk.shift();
    const cell = bd[r][c];
    const g = cell.gem;
    if (!g || !g.special || cell.chain) continue;
    if (plan.noTrigger.has(r * N + c)) continue;
    effects.push({ type: g.special, r, c });
    etkiHucreleri(bd, g.special, r, c, null).forEach(([rr, cc]) => ekle(rr, cc, 'effect'));
  }
  const pops = [];
  const chainBreaks = [];
  const iceHits = [];
  const stoneHits = new Map();
  hit.forEach((tur, k) => {
    const r = Math.floor(k / N);
    const c = k % N;
    const cell = bd[r][c];
    if (cell.stone > 0) {
      stoneHits.set(k, true);
      return;
    }
    if (!cell.gem) return;
    if (cell.chain) {
      chainBreaks.push([r, c]);
      return;
    }
    pops.push({ id: cell.gem.id, r, c, color: cell.gem.color, special: cell.gem.special, byEffect: tur === 'effect' });
    if (cell.ice > 0) iceHits.push([r, c]);
    if (tur === 'match') {
      [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dr, dc]) => {
        const rr = r + dr;
        const cc = c + dc;
        if (rr >= 0 && cc >= 0 && rr < N && cc < N && bd[rr][cc].stone > 0) stoneHits.set(rr * N + cc, true);
      });
    }
  });
  const create = plan.create.filter((cr) => !bd[cr.r][cr.c].chain && bd[cr.r][cr.c].stone === 0);
  return { pops, chainBreaks, iceHits, stoneHits: [...stoneHits.keys()], create, effects };
}

function sonucUygula(bd, res) {
  const yeni = tahtaKopyala(bd);
  res.pops.forEach(({ r, c }) => {
    yeni[r][c].gem = null;
  });
  res.iceHits.forEach(([r, c]) => {
    yeni[r][c].ice = Math.max(0, yeni[r][c].ice - 1);
  });
  res.chainBreaks.forEach(([r, c]) => {
    yeni[r][c].chain = false;
  });
  res.stoneHits.forEach((k) => {
    const r = Math.floor(k / N);
    const c = k % N;
    yeni[r][c].stone = Math.max(0, yeni[r][c].stone - 1);
  });
  const olusan = [];
  res.create.forEach((cr) => {
    if (yeni[cr.r][cr.c].gem) return;
    const g = yeniTas(cr.color, cr.special);
    yeni[cr.r][cr.c].gem = g;
    olusan.push({ ...cr, id: g.id });
  });
  return { board: yeni, olusan };
}

function yercekimi(bd, ncolors) {
  const yeni = tahtaKopyala(bd);
  const spawned = [];
  for (let c = 0; c < N; c++) {
    let alt = N - 1;
    while (alt >= 0) {
      if (sabitMi(yeni[alt][c])) {
        alt--;
        continue;
      }
      let ust = alt;
      while (ust - 1 >= 0 && !sabitMi(yeni[ust - 1][c])) ust--;
      const taslar = [];
      for (let r = alt; r >= ust; r--) if (yeni[r][c].gem) taslar.push(yeni[r][c].gem);
      let r = alt;
      taslar.forEach((g) => {
        yeni[r][c].gem = g;
        r--;
      });
      let k = 1;
      while (r >= ust) {
        const g = yeniTas(rastgele(ncolors));
        yeni[r][c].gem = g;
        spawned.push({ id: g.id, startRow: ust - k, r, c });
        k++;
        r--;
      }
      alt = ust - 1;
    }
  }
  return { board: yeni, spawned };
}

function takasla(bd, a, b) {
  const t = bd[a.r][a.c].gem;
  bd[a.r][a.c].gem = bd[b.r][b.c].gem;
  bd[b.r][b.c].gem = t;
}

function hamleGecerliMi(bd, a, b) {
  if (!hareketEdebilir(bd[a.r][a.c]) || !hareketEdebilir(bd[b.r][b.c])) return false;
  const ga = bd[a.r][a.c].gem;
  const gb = bd[b.r][b.c].gem;
  if (ga.special === 'colorbomb' || gb.special === 'colorbomb') return true;
  if (ga.special && gb.special) return true;
  takasla(bd, a, b);
  const ok = eslesmeleriBul(bd).length > 0;
  takasla(bd, a, b);
  return ok;
}

function ipucuBul(bd) {
  for (let r = 0; r < N; r++)
    for (let c = 0; c < N; c++) {
      if (c + 1 < N && hamleGecerliMi(bd, { r, c }, { r, c: c + 1 })) return [{ r, c }, { r, c: c + 1 }];
      if (r + 1 < N && hamleGecerliMi(bd, { r, c }, { r: r + 1, c })) return [{ r, c }, { r: r + 1, c }];
    }
  return null;
}

function karistir(bd, ncolors) {
  for (let deneme = 0; deneme < 200; deneme++) {
    const yeni = tahtaKopyala(bd);
    const yerler = [];
    const taslar = [];
    for (let r = 0; r < N; r++)
      for (let c = 0; c < N; c++)
        if (hareketEdebilir(yeni[r][c])) {
          yerler.push([r, c]);
          taslar.push(yeni[r][c].gem);
        }
    for (let i = taslar.length - 1; i > 0; i--) {
      const j = rastgele(i + 1);
      [taslar[i], taslar[j]] = [taslar[j], taslar[i]];
    }
    if (deneme > 100) taslar.forEach((g) => {
      if (!g.special) g.color = rastgele(ncolors);
    });
    yerler.forEach(([r, c], i) => {
      yeni[r][c].gem = taslar[i];
    });
    if (eslesmeleriBul(yeni).length === 0 && ipucuBul(yeni)) return yeni;
  }
  return tahtaKopyala(bd);
}

function tahtaOlustur(ayar) {
  for (let deneme = 0; deneme < 300; deneme++) {
    const bd = [];
    for (let r = 0; r < N; r++) {
      const row = [];
      for (let c = 0; c < N; c++) row.push(bosHucre());
      bd.push(row);
    }
    const bosYerler = [];
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) bosYerler.push([r, c]);
    for (let i = bosYerler.length - 1; i > 0; i--) {
      const j = rastgele(i + 1);
      [bosYerler[i], bosYerler[j]] = [bosYerler[j], bosYerler[i]];
    }
    let idx = 0;
    for (let i = 0; i < ayar.stones; i++) {
      const [r, c] = bosYerler[idx++];
      bd[r][c].stone = ayar.stoneHp;
    }
    for (let i = 0; i < ayar.chains; i++) {
      const [r, c] = bosYerler[idx++];
      bd[r][c].chain = true;
    }
    const buzYer = bosYerler.slice(idx).sort(() => Math.random() - 0.5);
    for (let i = 0; i < ayar.ice; i++) {
      const [r, c] = buzYer[i];
      bd[r][c].ice = ayar.iceStrong && Math.random() < 0.4 ? 2 : 1;
    }
    for (let r = 0; r < N; r++)
      for (let c = 0; c < N; c++) {
        if (bd[r][c].stone > 0) continue;
        const yasak = new Set();
        if (c >= 2 && bd[r][c - 1].gem && bd[r][c - 2].gem && bd[r][c - 1].gem.color === bd[r][c - 2].gem.color)
          yasak.add(bd[r][c - 1].gem.color);
        if (r >= 2 && bd[r - 1][c].gem && bd[r - 2][c].gem && bd[r - 1][c].gem.color === bd[r - 2][c].gem.color)
          yasak.add(bd[r - 1][c].gem.color);
        const secenek = [];
        for (let k = 0; k < ayar.ncolors; k++) if (!yasak.has(k)) secenek.push(k);
        bd[r][c].gem = yeniTas(secenek[rastgele(secenek.length)]);
      }
    if (eslesmeleriBul(bd).length === 0 && ipucuBul(bd)) return bd;
  }
  return karistir(tahtaOlustur({ ...ayar, stones: 0, chains: 0 }), ayar.ncolors);
}

function puanHesapla(res, zincir, ikiKat) {
  let p = 0;
  res.pops.forEach((x) => {
    p += (x.byEffect ? 20 : 10) * zincir;
  });
  p += res.create.length * 50;
  p += res.iceHits.length * 20 + res.chainBreaks.length * 20 + res.stoneHits.length * 30;
  return ikiKat ? p * 2 : p;
}
// ==== MANTIK BITIS ====

// ---------- Sesler ----------
const SES_DOSYALARI = {
  secim: require('./assets/sounds/secim.mp3'),
  takas: require('./assets/sounds/takas.mp3'),
  gecersiz: require('./assets/sounds/gecersiz.mp3'),
  eslesme: require('./assets/sounds/eslesme.mp3'),
  kombo: require('./assets/sounds/kombo.mp3'),
  cizgili: require('./assets/sounds/cizgili.mp3'),
  bomba: require('./assets/sounds/bomba.mp3'),
  renkbombasi: require('./assets/sounds/renkbombasi.mp3'),
  kazandi: require('./assets/sounds/kazandi.mp3'),
  kaybetti: require('./assets/sounds/kaybetti.mp3'),
  buton: require('./assets/sounds/buton.mp3'),
  buz: require('./assets/sounds/buz.mp3'),
  zincir: require('./assets/sounds/zincir.mp3'),
  bonus: require('./assets/sounds/bonus.mp3'),
};
const MUZIK = require('./assets/sounds/muzik.mp3');

// ---------- Gorunum sabitleri ----------
const TAS_RENKLERI = ['#FF4D5E', '#FF9F2E', '#FFD93D', '#3DDC84', '#3D9BFF', '#B06CFF'];
const TAS_KOYU = ['#B3202F', '#C0660A', '#C99A00', '#16955A', '#1560C0', '#7232C4'];
const TAS_SEMBOL = ['♥', '●', '★', '▲', '◆', '■'];

const TEMALAR = {
  koyu: {
    bg: '#141A33',
    card: '#1F2748',
    text: '#FFFFFF',
    sub: '#AAB3D9',
    board: '#0E1328',
    cell: '#1B2242',
    accent: '#FFD84D',
    bar: '#2B3563',
    danger: '#FF5A6E',
    warn: '#FFD84D',
  },
  acik: {
    bg: '#EEF1FB',
    card: '#FFFFFF',
    text: '#1B2040',
    sub: '#5B6390',
    board: '#C9D1EE',
    cell: '#E3E8FA',
    accent: '#D99A00',
    bar: '#D6DCF2',
    danger: '#D61F3A',
    warn: '#B87F00',
  },
};

const BONUSLAR = [
  { id: 'ipucu', ad: 'İpucu', aciklama: 'Yapılabilecek bir hamleyi gösterir.' },
  { id: 'karistir', ad: 'Karıştır', aciklama: 'Taşları karıştırır. Hamle harcamaz.' },
  { id: 'bomba', ad: 'Bomba', aciklama: 'Seçtiğin taşın çevresindeki 3x3 alanı patlatır.' },
  { id: 'renk', ad: 'Renk', aciklama: 'Seçtiğin taşın rengindeki bütün taşları patlatır.' },
  { id: 'ikikat', ad: '2x Puan', aciklama: 'Sonraki 3 hamlede puanlar iki katı.' },
];

const BASARIMLAR = [
  { id: 'ilk', ad: 'İlk Patlama', aciklama: 'İlk eşleşmeni yap', kontrol: (s) => s.gems >= 3, odul: 'ipucu' },
  { id: 'kombo4', ad: 'Kombo Ustası', aciklama: 'Bir hamlede 4 kombo yap', kontrol: (s) => s.maxCombo >= 4, odul: 'karistir' },
  { id: 'cizgili10', ad: 'Çizgi Ustası', aciklama: '10 çizgili taş oluştur', kontrol: (s) => s.stripedMade >= 10, odul: 'bomba' },
  { id: 'bomba5', ad: 'Bombacı', aciklama: '5 bomba taşı oluştur', kontrol: (s) => s.bombsMade >= 5, odul: 'bomba' },
  { id: 'renk1', ad: 'Gökkuşağı', aciklama: 'Bir renk bombası oluştur', kontrol: (s) => s.colorBombsMade >= 1, odul: 'renk' },
  { id: 'bolum5', ad: 'Yolun Başı', aciklama: '5 bölüm tamamla', kontrol: (s) => s.levelsDone >= 5, odul: 'ikikat' },
  { id: 'bolum10', ad: 'Kararlı', aciklama: '10 bölüm tamamla', kontrol: (s) => s.levelsDone >= 10, odul: 'renk' },
  { id: 'puan10k', ad: 'Puan Avcısı', aciklama: 'Toplam 10.000 puana ulaş', kontrol: (s) => s.totalScore >= 10000, odul: 'ikikat' },
];

const GUNLUK_HAVUZ = [
  { id: 'tas150', ad: '150 taş patlat', stat: 'gems', hedef: 150 },
  { id: 'ozel5', ad: '5 özel taş oluştur', stat: 'specials', hedef: 5 },
  { id: 'bolum2', ad: '2 bölüm tamamla', stat: 'levels', hedef: 2 },
  { id: 'kombo3', ad: '3 kez kombo yap', stat: 'combos', hedef: 3 },
  { id: 'puan2000', ad: '2.000 puan topla', stat: 'score', hedef: 2000 },
  { id: 'bonus2', ad: '2 bonus kullan', stat: 'bonuses', hedef: 2 },
];

const KAYIT_ANAHTARI = 'taslarpro-kayit-v1';

function bugun() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

function gunlukSec(tarih) {
  let h = 0;
  for (const ch of tarih) h = (h * 31 + ch.charCodeAt(0)) % 100003;
  const ids = GUNLUK_HAVUZ.map((g) => g.id);
  const secilen = [];
  while (secilen.length < 3) {
    const i = h % ids.length;
    secilen.push(ids.splice(i, 1)[0]);
    h = (h * 17 + 7) % 100003;
  }
  return { date: tarih, picks: secilen, progress: {}, claimed: [] };
}

function bosIstatistik() {
  return {
    totalScore: 0,
    gems: 0,
    maxCombo: 0,
    levelsDone: 0,
    movesMade: 0,
    stripedMade: 0,
    bombsMade: 0,
    colorBombsMade: 0,
    bonusesUsed: 0,
    bestLevel: 1,
  };
}

function hedefMetni(obj) {
  if (!obj) return '';
  if (obj.type === 'score') return `${obj.target} puan`;
  if (obj.type === 'color') return `${RENK_ADLARI[obj.color]}: ${obj.current} / ${obj.target}`;
  return `Özel taş: ${obj.current} / ${obj.target}`;
}

function hedefCumlesi(obj) {
  if (!obj) return '';
  if (obj.type === 'score') return `${obj.target} puan topla`;
  if (obj.type === 'color') return `${obj.target} ${RENK_ADLARI[obj.color]} taş patlat`;
  return `${obj.target} özel taş oluştur`;
}

function hucreEtiketi(cell, r, c) {
  const yer = `${r + 1}. satır, ${c + 1}. sütun`;
  if (cell.stone > 0) return `Taş blok, ${yer}`;
  if (!cell.gem) return `Boş, ${yer}`;
  const g = cell.gem;
  let ad = g.special === 'colorbomb' ? 'Renk bombası' : RENK_ADLARI[g.color];
  if (g.special && g.special !== 'colorbomb') ad += ' ' + OZEL_ADLARI[g.special];
  let ek = '';
  if (cell.ice === 2) ek += ', kalın buzlu';
  else if (cell.ice === 1) ek += ', buzlu';
  if (cell.chain) ek += ', zincirli';
  return `${ad}, ${yer}${ek}`;
}

function kisaAd(cell) {
  const g = cell.gem;
  if (!g) return 'taş';
  if (g.special === 'colorbomb') return 'Renk bombası';
  return RENK_ADLARI[g.color] + (g.special ? ' ' + OZEL_ADLARI[g.special] : '');
}

const bekle = (ms) => new Promise((r) => setTimeout(r, ms));
const calistir = (anim) => new Promise((r) => anim.start(() => r()));

function soyle(metin) {
  if (metin) AccessibilityInfo.announceForAccessibility(metin);
}

// ---------- Tas gorunumu ----------
const TasGorunum = React.memo(function TasGorunum({ gem, anim, cell }) {
  const tx = useMemo(() => Animated.multiply(anim.x, cell), [anim, cell]);
  const ty = useMemo(() => Animated.multiply(anim.y, cell), [anim, cell]);
  const p = Math.max(3, Math.round(cell * 0.08));
  const ic = cell - p * 2;
  const renk = gem.special === 'colorbomb' ? '#2A2340' : TAS_RENKLERI[gem.color];
  const koyu = gem.special === 'colorbomb' ? '#120E20' : TAS_KOYU[gem.color];
  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: 'absolute',
        width: cell,
        height: cell,
        padding: p,
        opacity: anim.o,
        transform: [{ translateX: tx }, { translateY: ty }, { scale: anim.s }],
      }}
    >
      <View
        style={{
          width: ic,
          height: ic,
          borderRadius: ic * 0.3,
          backgroundColor: renk,
          borderBottomWidth: 3,
          borderColor: koyu,
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        <View
          style={{
            position: 'absolute',
            top: ic * 0.08,
            left: ic * 0.12,
            width: ic * 0.38,
            height: ic * 0.22,
            borderRadius: ic * 0.2,
            backgroundColor: 'rgba(255,255,255,0.35)',
          }}
        />
        {gem.special === 'striped-h' &&
          [0.28, 0.5, 0.72].map((y) => (
            <View
              key={y}
              style={{ position: 'absolute', left: 0, right: 0, top: ic * y - 2, height: 4, backgroundColor: 'rgba(255,255,255,0.75)' }}
            />
          ))}
        {gem.special === 'striped-v' &&
          [0.28, 0.5, 0.72].map((x) => (
            <View
              key={x}
              style={{ position: 'absolute', top: 0, bottom: 0, left: ic * x - 2, width: 4, backgroundColor: 'rgba(255,255,255,0.75)' }}
            />
          ))}
        {gem.special === 'bomb' && (
          <View
            style={{
              position: 'absolute',
              width: ic * 0.62,
              height: ic * 0.62,
              borderRadius: ic,
              backgroundColor: '#1A1A24',
              borderWidth: 2,
              borderColor: '#FFFFFF',
            }}
          />
        )}
        {gem.special === 'colorbomb' &&
          TAS_RENKLERI.map((rk, i) => {
            const aci = (i / 6) * Math.PI * 2;
            const yar = ic * 0.3;
            const d = ic * 0.18;
            return (
              <View
                key={rk}
                style={{
                  position: 'absolute',
                  width: d,
                  height: d,
                  borderRadius: d,
                  backgroundColor: rk,
                  left: ic / 2 + Math.cos(aci) * yar - d / 2,
                  top: ic / 2 + Math.sin(aci) * yar - d / 2,
                }}
              />
            );
          })}
        <Text
          style={{
            color: gem.special === 'bomb' || gem.special === 'colorbomb' ? '#FFFFFF' : 'rgba(255,255,255,0.92)',
            fontSize: ic * (gem.special ? 0.34 : 0.42),
            fontWeight: '900',
            textShadowColor: 'rgba(0,0,0,0.35)',
            textShadowRadius: 2,
          }}
        >
          {gem.special === 'colorbomb' ? '✦' : gem.special === 'bomb' ? '✸' : TAS_SEMBOL[gem.color]}
        </Text>
      </View>
    </Animated.View>
  );
});

// ---------- Parcacik patlamasi ----------
function Patlama({ x, y, color, cell, buyuk, bitti }) {
  const t = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(t, { toValue: 1, duration: buyuk ? 650 : 480, easing: Easing.out(Easing.quad), useNativeDriver: true }).start(bitti);
  }, []);
  const sayi = buyuk ? 12 : 8;
  const mesafe = cell * (buyuk ? 1.4 : 0.8);
  return (
    <View pointerEvents="none" style={{ position: 'absolute', left: x * cell + cell / 2, top: y * cell + cell / 2 }}>
      {Array.from({ length: sayi }).map((_, i) => {
        const aci = (i / sayi) * Math.PI * 2;
        const boy = buyuk ? 9 : 7;
        return (
          <Animated.View
            key={i}
            style={{
              position: 'absolute',
              width: boy,
              height: boy,
              borderRadius: boy,
              left: -boy / 2,
              top: -boy / 2,
              backgroundColor: color,
              opacity: t.interpolate({ inputRange: [0, 0.7, 1], outputRange: [1, 0.8, 0] }),
              transform: [
                { translateX: t.interpolate({ inputRange: [0, 1], outputRange: [0, Math.cos(aci) * mesafe] }) },
                { translateY: t.interpolate({ inputRange: [0, 1], outputRange: [0, Math.sin(aci) * mesafe] }) },
                { scale: t.interpolate({ inputRange: [0, 1], outputRange: [1, 0.3] }) },
              ],
            }}
          />
        );
      })}
    </View>
  );
}

function UcanYazi({ x, y, text, cell, color, bitti }) {
  const t = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(t, { toValue: 1, duration: 900, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start(bitti);
  }, []);
  return (
    <Animated.Text
      pointerEvents="none"
      style={{
        position: 'absolute',
        left: x * cell - cell,
        width: cell * 3,
        top: y * cell,
        textAlign: 'center',
        color,
        fontSize: 20,
        fontWeight: '900',
        textShadowColor: 'rgba(0,0,0,0.6)',
        textShadowRadius: 4,
        opacity: t.interpolate({ inputRange: [0, 0.75, 1], outputRange: [1, 1, 0] }),
        transform: [
          { translateY: t.interpolate({ inputRange: [0, 1], outputRange: [0, -cell * 1.2] }) },
          { scale: t.interpolate({ inputRange: [0, 0.2, 1], outputRange: [0.6, 1.15, 1] }) },
        ],
      }}
    >
      {text}
    </Animated.Text>
  );
}

function CizgiIsigi({ tip, r, c, cell, bitti }) {
  const t = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(t, { toValue: 1, duration: 380, useNativeDriver: true }).start(bitti);
  }, []);
  const yatay = tip === 'striped-h';
  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: 'absolute',
        left: yatay ? 0 : c * cell + cell * 0.3,
        top: yatay ? r * cell + cell * 0.3 : 0,
        width: yatay ? cell * N : cell * 0.4,
        height: yatay ? cell * 0.4 : cell * N,
        borderRadius: cell,
        backgroundColor: '#FFFFFF',
        opacity: t.interpolate({ inputRange: [0, 0.3, 1], outputRange: [0, 0.9, 0] }),
        transform: [yatay ? { scaleX: t.interpolate({ inputRange: [0, 0.4, 1], outputRange: [0.1, 1, 1] }) } : { scaleY: t.interpolate({ inputRange: [0, 0.4, 1], outputRange: [0.1, 1, 1] }) }],
      }}
    />
  );
}

function Dalga({ r, c, cell, boyut, bitti }) {
  const t = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(t, { toValue: 1, duration: 520, easing: Easing.out(Easing.quad), useNativeDriver: true }).start(bitti);
  }, []);
  const d = cell * boyut;
  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: 'absolute',
        left: c * cell + cell / 2 - d / 2,
        top: r * cell + cell / 2 - d / 2,
        width: d,
        height: d,
        borderRadius: d,
        borderWidth: 6,
        borderColor: '#FFE27A',
        opacity: t.interpolate({ inputRange: [0, 1], outputRange: [0.95, 0] }),
        transform: [{ scale: t.interpolate({ inputRange: [0, 1], outputRange: [0.2, 1] }) }],
      }}
    />
  );
}

// ---------- Uygulama ----------
export default function App() {
  return (
    <SafeAreaProvider>
      <Oyun />
    </SafeAreaProvider>
  );
}

function Oyun() {
  const { width } = useWindowDimensions();
  const tahtaGenislik = Math.min(width - 24, 440);
  const cell = tahtaGenislik / N;

  const [, setTik] = useState(0);
  const yenile = useCallback(() => setTik((t) => t + 1), []);

  const G = useRef(null);
  if (!G.current) {
    G.current = {
      board: null,
      level: 1,
      score: 0,
      moves: 22,
      obj: null,
      ayar: null,
      bonuslar: { ipucu: 3, karistir: 2, bomba: 1, renk: 1, ikikat: 1 },
      ikiKat: 0,
      stats: bosIstatistik(),
      basarimlar: [],
      gunluk: gunlukSec(bugun()),
      settings: { ses: true, muzik: true, titresim: true, tema: 'koyu' },
      ogretici: false,
      yuklendi: false,
    };
  }
  const g = G.current;
  const tema = TEMALAR[g.settings.tema] || TEMALAR.koyu;

  const anims = useRef({});
  const mesgul = useRef(false);
  const [secili, setSecili] = useState(null);
  const [mod, setMod] = useState(null);
  const [ipucu, setIpucu] = useState(null);
  const [efektler, setEfektler] = useState([]);
  const [mesaj, setMesaj] = useState('Bir taş seç, sonra yanındaki taşla yer değiştir.');
  const [modal, setModal] = useState(null);
  const [ayarSekme, setAyarSekme] = useState('ayarlar');
  const [kombo, setKombo] = useState(null);

  const sarsinti = useRef(new Animated.Value(0)).current;
  const ilerleme = useRef(new Animated.Value(0)).current;
  const komboAnim = useRef(new Animated.Value(0)).current;
  const ipucuAnim = useRef(new Animated.Value(0)).current;
  const seciliAnim = useRef(new Animated.Value(0)).current;

  // ----- Sesler -----
  const sesler = useRef({});
  const muzik = useRef(null);
  useEffect(() => {
    setAudioModeAsync({ playsInSilentMode: true, interruptionMode: 'mixWithOthers' }).catch(() => {});
    Object.entries(SES_DOSYALARI).forEach(([ad, kaynak]) => {
      try {
        sesler.current[ad] = createAudioPlayer(kaynak);
      } catch (e) {}
    });
    try {
      muzik.current = createAudioPlayer(MUZIK);
      muzik.current.loop = true;
      muzik.current.volume = 0.35;
    } catch (e) {}
    return () => {
      Object.values(sesler.current).forEach((p) => {
        try {
          p.release();
        } catch (e) {}
      });
      try {
        muzik.current && muzik.current.release();
      } catch (e) {}
    };
  }, []);

  const cal = useCallback((ad, ses = 1) => {
    if (!G.current.settings.ses) return;
    const p = sesler.current[ad];
    if (!p) return;
    try {
      p.volume = ses;
      p.seekTo(0);
      p.play();
    } catch (e) {}
  }, []);

  const titret = useCallback((tur) => {
    if (!G.current.settings.titresim) return;
    try {
      if (tur === 'hata') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      else if (tur === 'basari') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      else if (tur === 'guclu') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      else Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (e) {}
  }, []);

  const muzikAyarla = useCallback(() => {
    const m = muzik.current;
    if (!m) return;
    try {
      if (G.current.settings.muzik) m.play();
      else m.pause();
    } catch (e) {}
  }, []);

  // ----- Kayit -----
  const kaydet = useCallback(() => {
    const s = G.current;
    if (!s.yuklendi) return;
    const veri = {
      level: s.level,
      bonuslar: s.bonuslar,
      stats: s.stats,
      basarimlar: s.basarimlar,
      gunluk: s.gunluk,
      settings: s.settings,
      ogretici: s.ogretici,
    };
    AsyncStorage.setItem(KAYIT_ANAHTARI, JSON.stringify(veri)).catch(() => {});
  }, []);

  // ----- Animasyon yardimcilari -----
  const animAl = useCallback((id, r, c) => {
    let a = anims.current[id];
    if (!a) {
      a = { x: new Animated.Value(c), y: new Animated.Value(r), s: new Animated.Value(1), o: new Animated.Value(1), tr: r, tc: c };
      anims.current[id] = a;
    }
    return a;
  }, []);

  const konumlariCanlandir = useCallback(
    (bd, sure, dusme) => {
      const list = [];
      for (let r = 0; r < N; r++)
        for (let c = 0; c < N; c++) {
          const gm = bd[r][c].gem;
          if (!gm) continue;
          const a = animAl(gm.id, r, c);
          if (a.tr === r && a.tc === c) continue;
          const mesafe = Math.abs(a.tr - r) + Math.abs(a.tc - c);
          a.tr = r;
          a.tc = c;
          const d = dusme ? 140 + mesafe * 55 : sure;
          const easing = dusme ? Easing.out(Easing.back(1.1)) : Easing.inOut(Easing.quad);
          list.push(Animated.timing(a.x, { toValue: c, duration: d, easing, useNativeDriver: true }));
          list.push(Animated.timing(a.y, { toValue: r, duration: d, easing, useNativeDriver: true }));
        }
      if (!list.length) return Promise.resolve();
      return calistir(Animated.parallel(list));
    },
    [animAl]
  );

  const tahtaAyarla = useCallback(
    (bd) => {
      G.current.board = bd;
      for (let r = 0; r < N; r++)
        for (let c = 0; c < N; c++) {
          const gm = bd[r][c].gem;
          if (gm) animAl(gm.id, r, c);
        }
      yenile();
    },
    [animAl, yenile]
  );

  const efektEkle = useCallback((list) => {
    if (!list.length) return;
    setEfektler((e) => [...e, ...list]);
  }, []);
  const efektSil = useCallback((id) => setEfektler((e) => e.filter((x) => x.id !== id)), []);
  const efektId = useRef(1);

  const ilerlemeGuncelle = useCallback(() => {
    const s = G.current;
    if (!s.obj) return;
    const deger = s.obj.type === 'score' ? s.score / s.obj.target : s.obj.current / s.obj.target;
    Animated.timing(ilerleme, { toValue: Math.min(1, deger), duration: 400, easing: Easing.out(Easing.quad), useNativeDriver: false }).start();
  }, [ilerleme]);

  // ----- Bolum baslat -----
  const bolumBaslat = useCallback(
    (L, duyur = true) => {
      const s = G.current;
      const ayar = bolumAyari(L);
      s.level = L;
      s.ayar = ayar;
      s.score = 0;
      s.moves = ayar.moves;
      s.ikiKat = 0;
      s.obj = { type: ayar.type, target: ayar.target, color: ayar.color, current: 0 };
      anims.current = {};
      const bd = tahtaOlustur(ayar);
      // Taslar yukaridan dusuyor gibi baslasin
      for (let r = 0; r < N; r++)
        for (let c = 0; c < N; c++) {
          const gm = bd[r][c].gem;
          if (!gm) continue;
          const a = animAl(gm.id, r - N - 1, c);
          a.tr = r - N - 1;
          a.o.setValue(1);
        }
      setSecili(null);
      setMod(null);
      setIpucu(null);
      setEfektler([]);
      tahtaAyarla(bd);
      ilerleme.setValue(0);
      mesgul.current = true;
      setTimeout(() => {
        konumlariCanlandir(bd, 0, true).then(() => {
          mesgul.current = false;
        });
      }, 60);
      const metin = `Bölüm ${L}. Hedef: ${hedefCumlesi(s.obj)}. ${s.moves} hamle.`;
      setMesaj(metin);
      if (duyur) soyle(metin);
      kaydet();
    },
    [animAl, tahtaAyarla, konumlariCanlandir, ilerleme, kaydet]
  );

  // ----- Yukleme -----
  useEffect(() => {
    (async () => {
      const s = G.current;
      try {
        const ham = await AsyncStorage.getItem(KAYIT_ANAHTARI);
        if (ham) {
          const v = JSON.parse(ham);
          s.level = v.level || 1;
          s.bonuslar = { ...s.bonuslar, ...(v.bonuslar || {}) };
          s.stats = { ...bosIstatistik(), ...(v.stats || {}) };
          s.basarimlar = v.basarimlar || [];
          s.settings = { ...s.settings, ...(v.settings || {}) };
          s.ogretici = !!v.ogretici;
          s.gunluk = v.gunluk && v.gunluk.date === bugun() ? v.gunluk : gunlukSec(bugun());
        }
      } catch (e) {}
      s.yuklendi = true;
      bolumBaslat(s.level, false);
      muzikAyarla();
      if (!s.ogretici) setModal({ tip: 'ogretici' });
    })();
  }, []);

  // ----- Secili tas nabzi ve ipucu parlamasi -----
  useEffect(() => {
    seciliAnim.setValue(0);
    if (!secili) return;
    const a = anims.current[G.current.board?.[secili.r]?.[secili.c]?.gem?.id];
    const dongu = Animated.loop(
      Animated.sequence([
        Animated.timing(seciliAnim, { toValue: 1, duration: 420, useNativeDriver: true }),
        Animated.timing(seciliAnim, { toValue: 0, duration: 420, useNativeDriver: true }),
      ])
    );
    let olcek;
    if (a) {
      olcek = Animated.loop(
        Animated.sequence([
          Animated.timing(a.s, { toValue: 1.12, duration: 420, useNativeDriver: true }),
          Animated.timing(a.s, { toValue: 1, duration: 420, useNativeDriver: true }),
        ])
      );
      olcek.start();
    }
    dongu.start();
    return () => {
      dongu.stop();
      if (olcek) olcek.stop();
      if (a) a.s.setValue(1);
    };
  }, [secili]);

  useEffect(() => {
    if (!ipucu) return;
    const dongu = Animated.loop(
      Animated.sequence([
        Animated.timing(ipucuAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.timing(ipucuAnim, { toValue: 0.2, duration: 500, useNativeDriver: true }),
      ])
    );
    dongu.start();
    const t = setTimeout(() => setIpucu(null), 6000);
    return () => {
      dongu.stop();
      clearTimeout(t);
    };
  }, [ipucu]);

  // ----- Istatistik, basarim, gunluk -----
  const gunlukIlerlet = useCallback((stat, miktar, bildirimler) => {
    const s = G.current;
    if (s.gunluk.date !== bugun()) s.gunluk = gunlukSec(bugun());
    s.gunluk.progress[stat] = (s.gunluk.progress[stat] || 0) + miktar;
    s.gunluk.picks.forEach((id) => {
      const gorev = GUNLUK_HAVUZ.find((x) => x.id === id);
      if (!gorev || s.gunluk.claimed.includes(id)) return;
      if ((s.gunluk.progress[gorev.stat] || 0) >= gorev.hedef) {
        s.gunluk.claimed.push(id);
        const odul = BONUSLAR[rastgele(BONUSLAR.length)];
        s.bonuslar[odul.id] = (s.bonuslar[odul.id] || 0) + 1;
        bildirimler.push(`Günlük görev tamamlandı: ${gorev.ad}. Ödül: ${odul.ad} bonusu.`);
      }
    });
  }, []);

  const basarimKontrol = useCallback((bildirimler) => {
    const s = G.current;
    BASARIMLAR.forEach((b) => {
      if (s.basarimlar.includes(b.id)) return;
      if (b.kontrol(s.stats)) {
        s.basarimlar.push(b.id);
        s.bonuslar[b.odul] = (s.bonuslar[b.odul] || 0) + 1;
        const bonusAd = BONUSLAR.find((x) => x.id === b.odul).ad;
        bildirimler.push(`Başarım: ${b.ad}! Ödül: ${bonusAd} bonusu.`);
      }
    });
  }, []);

  const komboGoster = useCallback(
    (zincir) => {
      const yazilar = ['', '', 'Güzel!', 'Süper!', 'Muhteşem!', 'İnanılmaz!'];
      const yazi = yazilar[Math.min(zincir, 5)];
      if (!yazi) return;
      setKombo(yazi);
      komboAnim.setValue(0);
      Animated.sequence([
        Animated.spring(komboAnim, { toValue: 1, friction: 4, tension: 120, useNativeDriver: true }),
        Animated.delay(450),
        Animated.timing(komboAnim, { toValue: 2, duration: 250, useNativeDriver: true }),
      ]).start(() => setKombo(null));
    },
    [komboAnim]
  );

  // ----- Ana zincirleme dongu -----
  const zincirle = useCallback(
    async (bdBaslangic, ilkPlan, takasYerleri, hamleMi) => {
      const s = G.current;
      let bd = bdBaslangic;
      let zincir = 0;
      let toplamPuan = 0;
      let toplamTas = 0;
      let toplamOzel = 0;
      let ilkHamle = true;
      while (true) {
        zincir++;
        let plan;
        if (ilkHamle && ilkPlan) plan = ilkPlan;
        else {
          const runs = eslesmeleriBul(bd);
          if (!runs.length) break;
          plan = plandanEslesme(bd, runs, ilkHamle ? takasYerleri : []);
        }
        ilkHamle = false;
        const res = temizlikHesapla(bd, plan);
        if (!res.pops.length && !res.chainBreaks.length && !res.stoneHits.length) break;

        // Sesler ve gorsel efektler
        const yeniEfekt = [];
        const efektTurleri = new Set(res.effects.map((e) => e.type));
        if (efektTurleri.has('colorbomb') || (plan.forced.length > 15 && zincir === 1)) {
          cal('renkbombasi');
          titret('guclu');
        } else if (efektTurleri.has('bomb')) {
          cal('bomba');
          titret('guclu');
        } else if (efektTurleri.has('striped-h') || efektTurleri.has('striped-v')) {
          cal('cizgili');
          titret();
        } else if (zincir > 1) {
          cal('kombo');
          titret();
        } else {
          cal('eslesme');
          titret();
        }
        if (res.iceHits.length) setTimeout(() => cal('buz', 0.8), 90);
        if (res.chainBreaks.length) setTimeout(() => cal('zincir', 0.9), 120);
        res.effects.forEach((e) => {
          if (e.type === 'striped-h' || e.type === 'striped-v') yeniEfekt.push({ id: efektId.current++, tur: 'cizgi', tip: e.type, r: e.r, c: e.c });
          else if (e.type === 'bomb') yeniEfekt.push({ id: efektId.current++, tur: 'dalga', r: e.r, c: e.c, boyut: 3.2 });
          else if (e.type === 'colorbomb') yeniEfekt.push({ id: efektId.current++, tur: 'dalga', r: e.r, c: e.c, boyut: 6 });
        });
        res.pops.slice(0, 14).forEach((p) => {
          yeniEfekt.push({
            id: efektId.current++,
            tur: 'patlama',
            r: p.r,
            c: p.c,
            color: p.color >= 0 ? TAS_RENKLERI[p.color] : '#FFFFFF',
            buyuk: !!p.special,
          });
        });

        const puan = puanHesapla(res, zincir, s.ikiKat > 0);
        if (puan > 0 && res.pops.length) {
          const orta = res.pops[Math.floor(res.pops.length / 2)];
          yeniEfekt.push({ id: efektId.current++, tur: 'yazi', r: orta.r, c: orta.c, text: `+${puan}` });
        }
        efektEkle(yeniEfekt);
        if (zincir >= 2) komboGoster(zincir);

        // Patlama animasyonu
        const popAnim = res.pops.map((p) => {
          const a = anims.current[p.id];
          if (!a) return null;
          return Animated.parallel([
            Animated.sequence([
              Animated.timing(a.s, { toValue: 1.25, duration: 90, useNativeDriver: true }),
              Animated.timing(a.s, { toValue: 0, duration: 170, easing: Easing.in(Easing.quad), useNativeDriver: true }),
            ]),
            Animated.timing(a.o, { toValue: 0, duration: 260, useNativeDriver: true }),
          ]);
        });
        await calistir(Animated.parallel(popAnim.filter(Boolean)));

        // Hedef, puan, istatistik
        s.score += puan;
        toplamPuan += puan;
        toplamTas += res.pops.length;
        s.stats.gems += res.pops.length;
        s.stats.totalScore += puan;
        res.create.forEach((cr) => {
          if (cr.special === 'colorbomb') s.stats.colorBombsMade++;
          else if (cr.special === 'bomb') s.stats.bombsMade++;
          else s.stats.stripedMade++;
        });
        toplamOzel += res.create.length;
        if (s.obj.type === 'color') s.obj.current = Math.min(s.obj.target, s.obj.current + res.pops.filter((p) => p.color === s.obj.color).length);
        if (s.obj.type === 'special') s.obj.current = Math.min(s.obj.target, s.obj.current + res.create.length);

        // Tahtayi guncelle, yeni ozel taslari belirt
        const { board: temiz, olusan } = sonucUygula(bd, res);
        res.pops.forEach((p) => {
          delete anims.current[p.id];
        });
        olusan.forEach((o) => {
          const a = animAl(o.id, o.r, o.c);
          a.s.setValue(0);
        });
        tahtaAyarla(temiz);
        ilerlemeGuncelle();
        if (olusan.length) {
          cal('bonus', 0.7);
          await calistir(
            Animated.parallel(
              olusan.map((o) => Animated.spring(anims.current[o.id].s, { toValue: 1, friction: 4, tension: 140, useNativeDriver: true }))
            )
          );
        }

        // Yercekimi
        const { board: dusmus, spawned } = yercekimi(temiz, s.ayar.ncolors);
        spawned.forEach((sp) => {
          const a = animAl(sp.id, sp.startRow, sp.c);
          a.tr = sp.startRow;
          a.tc = sp.c;
        });
        tahtaAyarla(dusmus);
        await bekle(16);
        await konumlariCanlandir(dusmus, 0, true);
        bd = dusmus;
      }
      zincir--;

      // Istatistikler
      const bildirimler = [];
      if (zincir > s.stats.maxCombo) s.stats.maxCombo = zincir;
      gunlukIlerlet('gems', toplamTas, bildirimler);
      gunlukIlerlet('score', toplamPuan, bildirimler);
      gunlukIlerlet('specials', toplamOzel, bildirimler);
      if (zincir >= 2) gunlukIlerlet('combos', 1, bildirimler);
      basarimKontrol(bildirimler);

      // Hamle yoksa karistir
      if (!ipucuBul(bd)) {
        const k = karistir(bd, s.ayar.ncolors);
        tahtaAyarla(k);
        await konumlariCanlandir(k, 380, false);
        bd = k;
        bildirimler.push('Yapılacak hamle kalmadı, taşlar karıştırıldı.');
      }

      // Duyuru
      let metin = toplamTas ? `${toplamTas} taş patladı, ${toplamPuan} puan.` : '';
      if (zincir >= 2) metin += ` ${zincir} kombo!`;
      if (toplamOzel === 1) metin += ' Özel taş oluştu.';
      else if (toplamOzel > 1) metin += ` ${toplamOzel} özel taş oluştu.`;
      if (s.obj.type !== 'score') metin += ` Hedef ${s.obj.current} / ${s.obj.target}.`;
      else metin += ` Puan ${s.score} / ${s.obj.target}.`;
      if (hamleMi) metin += ` Kalan hamle ${s.moves}.`;
      if (s.ikiKat > 0 && hamleMi) metin += ` İki kat puan: ${s.ikiKat} hamle kaldı.`;
      metin = metin.trim();
      setMesaj(metin);
      const tum = [metin, ...bildirimler].join(' ');

      // Kazanma / kaybetme
      const kazandi = s.obj.type === 'score' ? s.score >= s.obj.target : s.obj.current >= s.obj.target;
      kaydet();
      if (kazandi) {
        await bekle(350);
        bolumBitti(bildirimler);
        return;
      }
      if (bildirimler.length) cal('bonus');
      soyle(tum);
      if (s.moves <= 0) {
        await bekle(400);
        cal('kaybetti');
        titret('hata');
        setModal({ tip: 'kaybetti' });
        return;
      }
    },
    [cal, titret, efektEkle, komboGoster, animAl, tahtaAyarla, konumlariCanlandir, ilerlemeGuncelle, gunlukIlerlet, basarimKontrol, kaydet]
  );

  const bolumBitti = useCallback(
    (oncekiBildirimler) => {
      const s = G.current;
      cal('kazandi');
      titret('basari');
      const bildirimler = [...(oncekiBildirimler || [])];
      s.stats.levelsDone++;
      s.stats.bestLevel = Math.max(s.stats.bestLevel, s.level + 1);
      gunlukIlerlet('levels', 1, bildirimler);
      basarimKontrol(bildirimler);
      const odul = BONUSLAR[rastgele(BONUSLAR.length)];
      s.bonuslar[odul.id] = (s.bonuslar[odul.id] || 0) + 1;
      const sonraki = bolumAyari(s.level + 1);
      const sonrakiHedef = { type: sonraki.type, target: sonraki.target, color: sonraki.color, current: 0 };
      setModal({
        tip: 'kazandi',
        level: s.level,
        odul: odul.ad,
        kalanHamle: s.moves,
        sonraki: s.level + 1,
        sonrakiHedef,
        sonrakiHamle: sonraki.moves,
        sonrakiAyar: sonraki,
        bildirimler,
      });
      kaydet();
    },
    [cal, titret, gunlukIlerlet, basarimKontrol, kaydet]
  );

  // ----- Hamle -----
  const hamleYap = useCallback(
    async (a, b) => {
      const s = G.current;
      if (mesgul.current) return;
      mesgul.current = true;
      setSecili(null);
      setIpucu(null);
      try {
        if (!hareketEdebilir(s.board[b.r][b.c])) {
          cal('gecersiz');
          titret('hata');
          soyle(s.board[b.r][b.c].stone > 0 ? 'Taş blokla yer değiştirilemez.' : 'Zincirli taş hareket ettirilemez.');
          return;
        }
        const bd = tahtaKopyala(s.board);
        takasla(bd, a, b);
        cal('takas', 0.8);
        tahtaAyarla(bd);
        await konumlariCanlandir(bd, 170, false);
        const kombo = ozelKombo(bd, a, b);
        const runs = eslesmeleriBul(bd);
        if (!kombo && !runs.length) {
          cal('gecersiz');
          titret('hata');
          const geri = tahtaKopyala(bd);
          takasla(geri, a, b);
          tahtaAyarla(geri);
          await konumlariCanlandir(geri, 170, false);
          Animated.sequence([
            Animated.timing(sarsinti, { toValue: 1, duration: 50, useNativeDriver: true }),
            Animated.timing(sarsinti, { toValue: -1, duration: 50, useNativeDriver: true }),
            Animated.timing(sarsinti, { toValue: 1, duration: 50, useNativeDriver: true }),
            Animated.timing(sarsinti, { toValue: 0, duration: 50, useNativeDriver: true }),
          ]).start();
          setMesaj('Geçersiz hamle. Bu takas eşleşme oluşturmuyor.');
          soyle('Geçersiz hamle.');
          return;
        }
        s.moves--;
        s.stats.movesMade++;
        const ikiKatAktif = s.ikiKat > 0;
        let baslangic = bd;
        let plan = null;
        if (kombo) {
          if (kombo.converted) {
            kombo.board.forEach((row, r) =>
              row.forEach((cl, c) => {
                if (cl.gem && bd[r][c].gem && cl.gem.special !== bd[r][c].gem.special) {
                  const an = anims.current[cl.gem.id];
                  if (an) an.s.setValue(0.6);
                }
              })
            );
            tahtaAyarla(kombo.board);
            cal('bonus', 0.8);
            await calistir(
              Animated.parallel(
                Object.values(anims.current).map((an) => Animated.spring(an.s, { toValue: 1, friction: 5, useNativeDriver: true }))
              )
            );
            await bekle(200);
          }
          baslangic = kombo.board;
          plan = kombo.plan;
        }
        yenile();
        await zincirle(baslangic, plan, [a, b], true);
        if (ikiKatAktif) s.ikiKat = Math.max(0, s.ikiKat - 1);
        yenile();
      } finally {
        mesgul.current = false;
      }
    },
    [cal, titret, tahtaAyarla, konumlariCanlandir, zincirle, sarsinti, yenile]
  );

  // ----- Bonus uygula (tahta uzerinde) -----
  const bonusUygula = useCallback(
    async (tur, r, c) => {
      const s = G.current;
      const cl = s.board[r][c];
      if (mesgul.current) return;
      if (!cl.gem || cl.stone > 0) {
        soyle('Bir taş seçmelisin.');
        return;
      }
      if (tur === 'renk' && cl.gem.color < 0) {
        soyle('Renkli bir taş seçmelisin.');
        return;
      }
      mesgul.current = true;
      setMod(null);
      try {
        s.bonuslar[tur]--;
        s.stats.bonusesUsed++;
        const bild = [];
        gunlukIlerlet('bonuses', 1, bild);
        let forced = [];
        if (tur === 'bomba') {
          for (let dr = -1; dr <= 1; dr++)
            for (let dc = -1; dc <= 1; dc++) {
              const rr = r + dr;
              const cc = c + dc;
              if (rr >= 0 && cc >= 0 && rr < N && cc < N) forced.push([rr, cc]);
            }
        } else {
          forced = etkiHucreleri(s.board, 'colorbomb', r, c, cl.gem.color);
        }
        const plan = { cells: [], forced, create: [], noTrigger: new Set(), colorPick: null };
        efektEkle([{ id: efektId.current++, tur: 'dalga', r, c, boyut: tur === 'bomba' ? 3.2 : 6 }]);
        await zincirle(s.board, plan, [], false);
        if (bild.length) soyle(bild.join(' '));
      } finally {
        mesgul.current = false;
        yenile();
      }
    },
    [zincirle, efektEkle, gunlukIlerlet, yenile]
  );

  // ----- Hucre dokunusu -----
  const hucreDokun = useCallback(
    (r, c) => {
      const s = G.current;
      if (mesgul.current || !s.board) return;
      if (mod === 'bomba' || mod === 'renk') {
        bonusUygula(mod, r, c);
        return;
      }
      const cl = s.board[r][c];
      if (!secili) {
        if (cl.stone > 0) {
          cal('gecersiz', 0.6);
          soyle('Taş blok. Yanındaki taşları patlatarak kırabilirsin.');
          return;
        }
        if (cl.chain) {
          cal('gecersiz', 0.6);
          soyle('Zincirli taş hareket ettirilemez. Eşleştirerek zinciri kırabilirsin.');
          return;
        }
        if (!cl.gem) return;
        cal('secim');
        titret();
        setSecili({ r, c });
        soyle(`${kisaAd(cl)} seçildi.`);
        return;
      }
      if (secili.r === r && secili.c === c) {
        setSecili(null);
        cal('buton', 0.6);
        soyle('Seçim kaldırıldı.');
        return;
      }
      const komsu = Math.abs(secili.r - r) + Math.abs(secili.c - c) === 1;
      if (komsu) {
        hamleYap(secili, { r, c });
        return;
      }
      if (hareketEdebilir(cl)) {
        cal('secim');
        setSecili({ r, c });
        soyle(`${kisaAd(cl)} seçildi.`);
      } else {
        cal('gecersiz', 0.6);
        soyle('Sadece yan yana ya da alt alta taşlar yer değiştirebilir.');
      }
    },
    [mod, secili, cal, titret, hamleYap, bonusUygula]
  );

  // ----- Bonus menusu -----
  const bonusSec = useCallback(
    async (id) => {
      const s = G.current;
      if ((s.bonuslar[id] || 0) <= 0) {
        cal('gecersiz');
        soyle('Bu bonustan kalmadı.');
        return;
      }
      setModal(null);
      cal('bonus');
      if (id === 'ipucu') {
        const h = ipucuBul(s.board);
        if (!h) return;
        s.bonuslar.ipucu--;
        s.stats.bonusesUsed++;
        const bild = [];
        gunlukIlerlet('bonuses', 1, bild);
        setIpucu(h);
        const [a, b] = h;
        const yon = b.c > a.c ? 'sağındaki' : 'altındaki';
        const metin = `İpucu: ${a.r + 1}. satır ${a.c + 1}. sütundaki ${kisaAd(s.board[a.r][a.c])}, ${yon} ${kisaAd(s.board[b.r][b.c])} ile yer değiştirsin.`;
        setMesaj(metin);
        soyle([metin, ...bild].join(' '));
        kaydet();
        yenile();
      } else if (id === 'karistir') {
        if (mesgul.current) return;
        mesgul.current = true;
        s.bonuslar.karistir--;
        s.stats.bonusesUsed++;
        const bild = [];
        gunlukIlerlet('bonuses', 1, bild);
        const k = karistir(s.board, s.ayar.ncolors);
        tahtaAyarla(k);
        await konumlariCanlandir(k, 420, false);
        mesgul.current = false;
        setMesaj('Taşlar karıştırıldı.');
        soyle(['Taşlar karıştırıldı.', ...bild].join(' '));
        kaydet();
      } else if (id === 'bomba' || id === 'renk') {
        setSecili(null);
        setMod(id);
        const metin = id === 'bomba' ? 'Bomba hazır. Patlatmak istediğin taşı seç.' : 'Renk bonusu hazır. Patlatmak istediğin rengin bir taşını seç.';
        setMesaj(metin);
        soyle(metin);
      } else if (id === 'ikikat') {
        s.bonuslar.ikikat--;
        s.stats.bonusesUsed++;
        const bild = [];
        gunlukIlerlet('bonuses', 1, bild);
        s.ikiKat = 3;
        setMesaj('Sonraki 3 hamlede puanlar iki katı.');
        soyle(['İki kat puan açıldı. Sonraki 3 hamle.', ...bild].join(' '));
        kaydet();
        yenile();
      }
    },
    [cal, gunlukIlerlet, tahtaAyarla, konumlariCanlandir, kaydet, yenile]
  );

  const ayarDegistir = useCallback(
    (anahtar, deger) => {
      G.current.settings = { ...G.current.settings, [anahtar]: deger };
      if (anahtar === 'muzik') muzikAyarla();
      kaydet();
      yenile();
    },
    [muzikAyarla, kaydet, yenile]
  );

  // ----- Cizim -----
  const s = g;
  const bd = s.board;
  const kalanRenk = s.moves <= 5 ? tema.danger : s.moves <= 10 ? tema.warn : tema.text;

  const hucreler = [];
  const ustKatman = [];
  const taslar = [];
  if (bd) {
    for (let r = 0; r < N; r++)
      for (let c = 0; c < N; c++) {
        const cl = bd[r][c];
        hucreler.push(
          <View
            key={`h${r}-${c}`}
            style={{
              position: 'absolute',
              left: c * cell + 1,
              top: r * cell + 1,
              width: cell - 2,
              height: cell - 2,
              borderRadius: cell * 0.18,
              backgroundColor: (r + c) % 2 === 0 ? tema.cell : tema.board,
            }}
          >
            {cl.stone > 0 && (
              <View
                style={{
                  flex: 1,
                  margin: 3,
                  borderRadius: cell * 0.15,
                  backgroundColor: cl.stone > 1 ? '#4E5266' : '#767B92',
                  borderWidth: 2,
                  borderColor: '#3A3D4D',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <View style={{ width: cell * 0.5, height: 3, backgroundColor: '#3A3D4D', transform: [{ rotate: '35deg' }] }} />
                {cl.stone > 1 && <View style={{ width: cell * 0.5, height: 3, marginTop: 6, backgroundColor: '#3A3D4D', transform: [{ rotate: '-30deg' }] }} />}
              </View>
            )}
          </View>
        );
        if (cl.gem) {
          const a = animAl(cl.gem.id, r, c);
          taslar.push(<TasGorunum key={cl.gem.id} gem={cl.gem} anim={a} cell={cell} />);
        }
        if (cl.ice > 0) {
          ustKatman.push(
            <View
              key={`i${r}-${c}`}
              pointerEvents="none"
              style={{
                position: 'absolute',
                left: c * cell + 2,
                top: r * cell + 2,
                width: cell - 4,
                height: cell - 4,
                borderRadius: cell * 0.22,
                backgroundColor: cl.ice > 1 ? 'rgba(200,235,255,0.62)' : 'rgba(200,235,255,0.38)',
                borderWidth: cl.ice > 1 ? 3 : 2,
                borderColor: 'rgba(255,255,255,0.9)',
              }}
            />
          );
        }
        if (cl.chain) {
          ustKatman.push(
            <View
              key={`z${r}-${c}`}
              pointerEvents="none"
              style={{ position: 'absolute', left: c * cell, top: r * cell, width: cell, height: cell, alignItems: 'center', justifyContent: 'center' }}
            >
              <View style={{ position: 'absolute', width: cell * 1.0, height: 5, borderRadius: 3, backgroundColor: '#C9CCD8', borderWidth: 1, borderColor: '#555A6E', transform: [{ rotate: '45deg' }] }} />
              <View style={{ position: 'absolute', width: cell * 1.0, height: 5, borderRadius: 3, backgroundColor: '#C9CCD8', borderWidth: 1, borderColor: '#555A6E', transform: [{ rotate: '-45deg' }] }} />
            </View>
          );
        }
      }
  }

  const efektCizim = efektler.map((e) => {
    if (e.tur === 'patlama') return <Patlama key={e.id} x={e.c} y={e.r} color={e.color} cell={cell} buyuk={e.buyuk} bitti={() => efektSil(e.id)} />;
    if (e.tur === 'yazi') return <UcanYazi key={e.id} x={e.c} y={e.r} text={e.text} cell={cell} color={s.ikiKat > 0 ? '#FFB3F0' : '#FFE27A'} bitti={() => efektSil(e.id)} />;
    if (e.tur === 'cizgi') return <CizgiIsigi key={e.id} tip={e.tip} r={e.r} c={e.c} cell={cell} bitti={() => efektSil(e.id)} />;
    if (e.tur === 'dalga') return <Dalga key={e.id} r={e.r} c={e.c} cell={cell} boyut={e.boyut} bitti={() => efektSil(e.id)} />;
    return null;
  });

  const erisimHucreleri = [];
  if (bd) {
    for (let r = 0; r < N; r++) {
      const satir = [];
      for (let c = 0; c < N; c++) {
        const cl = bd[r][c];
        const seciliMi = secili && secili.r === r && secili.c === c;
        satir.push(
          <Pressable
            key={`p${r}-${c}`}
            onPress={() => hucreDokun(r, c)}
            accessible
            accessibilityRole="button"
            accessibilityLabel={hucreEtiketi(cl, r, c)}
            accessibilityState={{ selected: !!seciliMi }}
            style={{ width: cell, height: cell }}
          />
        );
      }
      erisimHucreleri.push(
        <View key={`s${r}`} style={{ flexDirection: 'row' }}>
          {satir}
        </View>
      );
    }
  }

  const ipucuCizim =
    ipucu &&
    ipucu.map((p, i) => (
      <Animated.View
        key={`ip${i}`}
        pointerEvents="none"
        style={{
          position: 'absolute',
          left: p.c * cell + 1,
          top: p.r * cell + 1,
          width: cell - 2,
          height: cell - 2,
          borderRadius: cell * 0.25,
          borderWidth: 3,
          borderColor: '#7CFFB2',
          opacity: ipucuAnim,
        }}
      />
    ));

  const seciliCizim = secili && (
    <Animated.View
      pointerEvents="none"
      style={{
        position: 'absolute',
        left: secili.c * cell,
        top: secili.r * cell,
        width: cell,
        height: cell,
        borderRadius: cell * 0.25,
        borderWidth: 3,
        borderColor: tema.accent,
        opacity: seciliAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 0.45] }),
      }}
    />
  );

  const modCizim = mod && (
    <View pointerEvents="none" style={{ position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, borderRadius: 14, borderWidth: 3, borderColor: '#FF7AD9' }} />
  );

  const komboCizim = kombo && (
    <Animated.Text
      pointerEvents="none"
      importantForAccessibility="no"
      accessibilityElementsHidden
      style={{
        position: 'absolute',
        top: tahtaGenislik / 2 - 30,
        left: 0,
        right: 0,
        textAlign: 'center',
        fontSize: 40,
        fontWeight: '900',
        color: '#FFE27A',
        textShadowColor: '#7A2BFF',
        textShadowRadius: 10,
        opacity: komboAnim.interpolate({ inputRange: [0, 1, 2], outputRange: [0, 1, 0] }),
        transform: [{ scale: komboAnim.interpolate({ inputRange: [0, 1, 2], outputRange: [0.3, 1, 1.4] }) }],
      }}
    >
      {kombo}
    </Animated.Text>
  );

  const stil = useMemo(() => olusturStil(tema), [tema]);
  const objEtiket = s.obj ? (s.obj.type === 'score' ? 'Hedef' : s.obj.type === 'color' ? `${RENK_ADLARI[s.obj.color]} topla` : 'Özel taş oluştur') : 'Hedef';

  return (
    <SafeAreaView style={[stil.kok]} edges={['top', 'bottom', 'left', 'right']}>
      <StatusBar style={g.settings.tema === 'acik' ? 'dark' : 'light'} />
      <ScrollView contentContainerStyle={{ alignItems: 'center', paddingBottom: 24 }} scrollEnabled={!mesgul.current}>
        <View style={[stil.ust, { width: tahtaGenislik }]}>
          <Pressable
            onPress={() => {
              cal('buton');
              ayarDegistir('muzik', !g.settings.muzik);
              soyle(g.settings.muzik ? 'Müzik açık' : 'Müzik kapalı');
            }}
            accessibilityRole="switch"
            accessibilityLabel="Müzik"
            accessibilityState={{ checked: g.settings.muzik }}
            style={stil.ikonBtn}
          >
            <Text style={[stil.ikon, { opacity: g.settings.muzik ? 1 : 0.4 }]}>♪</Text>
          </Pressable>
          <Text style={stil.baslik} accessibilityRole="header">
            Renkli Taşlar
          </Text>
          <Pressable
            onPress={() => {
              cal('buton');
              setAyarSekme('ayarlar');
              setModal({ tip: 'ayarlar' });
            }}
            accessibilityRole="button"
            accessibilityLabel="Ayarlar"
            style={stil.ikonBtn}
          >
            <Text style={stil.ikon}>⚙</Text>
          </Pressable>
        </View>

        <View style={[stil.satir, { width: tahtaGenislik }]}>
          <View style={stil.kutu} accessible accessibilityLabel={`Puan ${s.score}`}>
            <Text style={stil.kutuEtiket}>Puan</Text>
            <Text style={stil.kutuDeger}>{s.score}</Text>
          </View>
          <View style={stil.kutu} accessible accessibilityLabel={`Bölüm ${s.level}`}>
            <Text style={stil.kutuEtiket}>Bölüm</Text>
            <Text style={stil.kutuDeger}>{s.level}</Text>
          </View>
        </View>
        <View style={[stil.satir, { width: tahtaGenislik }]}>
          <View style={stil.kutu} accessible accessibilityLabel={`Hedef: ${s.obj ? (s.obj.type === 'score' ? s.obj.target + ' puan' : objEtiket + ', ' + s.obj.current + ' / ' + s.obj.target) : ''}`}>
            <Text style={stil.kutuEtiket}>{objEtiket}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {s.obj && s.obj.type === 'color' && (
                <View style={{ width: 16, height: 16, borderRadius: 5, marginRight: 6, backgroundColor: TAS_RENKLERI[s.obj.color] }} />
              )}
              <Text style={stil.kutuDeger}>{s.obj ? (s.obj.type === 'score' ? `${s.obj.target} puan` : `${s.obj.current} / ${s.obj.target}`) : ''}</Text>
            </View>
          </View>
          <View style={stil.kutu} accessible accessibilityLabel={`Kalan hamle ${s.moves}${s.ikiKat > 0 ? `, iki kat puan ${s.ikiKat} hamle` : ''}`}>
            <Text style={stil.kutuEtiket}>Kalan Hamle</Text>
            <Text style={[stil.kutuDeger, { color: kalanRenk }]}>{s.moves}</Text>
            {s.ikiKat > 0 && <Text style={[stil.kutuEtiket, { color: '#FF7AD9', fontWeight: '800' }]}>2x puan · {s.ikiKat}</Text>}
          </View>
        </View>

        <View
          style={[stil.cubuk, { width: tahtaGenislik }]}
          accessible
          accessibilityRole="progressbar"
          accessibilityLabel="Hedef ilerlemesi"
          accessibilityValue={{
            min: 0,
            max: 100,
            now: s.obj ? Math.round(Math.min(1, s.obj.type === 'score' ? s.score / s.obj.target : s.obj.current / s.obj.target) * 100) : 0,
          }}
        >
          <Animated.View
            style={{
              height: '100%',
              borderRadius: 10,
              backgroundColor: tema.accent,
              width: ilerleme.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }),
            }}
          />
        </View>

        <Animated.View
          style={[
            stil.tahta,
            {
              width: tahtaGenislik + 8,
              height: tahtaGenislik + 8,
              transform: [{ translateX: sarsinti.interpolate({ inputRange: [-1, 1], outputRange: [-8, 8] }) }],
            },
          ]}
        >
          <View style={{ width: tahtaGenislik, height: tahtaGenislik, overflow: 'hidden', borderRadius: 12 }}>
            <View style={StyleSheet.absoluteFill} accessibilityElementsHidden importantForAccessibility="no-hide-descendants" pointerEvents="none">
              {hucreler}
              {taslar}
              {ustKatman}
              {ipucuCizim}
              {seciliCizim}
            </View>
            <View style={StyleSheet.absoluteFill} pointerEvents="none" accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
              {efektCizim}
            </View>
            <View style={StyleSheet.absoluteFill}>{erisimHucreleri}</View>
            {komboCizim}
            {modCizim}
          </View>
        </Animated.View>

        <Text style={[stil.mesaj, { width: tahtaGenislik }]} accessibilityLiveRegion="polite">
          {mesaj}
        </Text>

        {mod && (
          <Pressable
            onPress={() => {
              setMod(null);
              cal('buton');
              setMesaj('Bonus iptal edildi.');
              soyle('Bonus iptal edildi.');
            }}
            style={[stil.btn, { width: tahtaGenislik, backgroundColor: '#FF7AD9', marginBottom: 8 }]}
            accessibilityRole="button"
            accessibilityLabel={mod === 'bomba' ? 'Bomba bonusunu iptal et' : 'Renk bonusunu iptal et'}
          >
            <Text style={[stil.btnYazi, { color: '#1B1030' }]}>Bonusu İptal Et</Text>
          </Pressable>
        )}

        <View style={[stil.satir, { width: tahtaGenislik }]}>
          <Pressable
            style={stil.btn}
            onPress={() => {
              cal('buton');
              setModal({ tip: 'sifirla' });
            }}
            accessibilityRole="button"
            accessibilityLabel="Seviye 1, oyunu baştan başlat"
          >
            <Text style={stil.btnYazi}>↻ Seviye 1</Text>
          </Pressable>
          <Pressable
            style={stil.btn}
            onPress={() => {
              if (mesgul.current) return;
              cal('buton');
              bolumBaslat(s.level);
            }}
            accessibilityRole="button"
            accessibilityLabel="Bölümü tekrarla"
          >
            <Text style={stil.btnYazi}>↩ Bölümü Tekrarla</Text>
          </Pressable>
          <Pressable
            style={[stil.btn, { backgroundColor: tema.accent }]}
            onPress={() => {
              cal('buton');
              setModal({ tip: 'bonuslar' });
            }}
            accessibilityRole="button"
            accessibilityLabel="Bonuslar"
          >
            <Text style={[stil.btnYazi, { color: '#1B1030' }]}>★ Bonuslar</Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* ----- Pencereler ----- */}
      <Modal visible={!!modal} transparent animationType="fade" onRequestClose={() => setModal(null)}>
        <View style={stil.perde}>
          <View style={stil.pencere} accessibilityViewIsModal>
            {modal && modal.tip === 'ogretici' && (
              <ScrollView>
                <Text style={stil.pBaslik} accessibilityRole="header">
                  Renkli Taşlar'a Hoş Geldin
                </Text>
                <Text style={stil.pYazi}>
                  Bir taşa dokun, sonra yanındaki ya da altındaki bir taşa dokun. İki taş yer değiştirir. Aynı renkten en az 3 taş yan yana ya da alt alta gelirse patlar.
                </Text>
                <Text style={stil.pYazi}>Sadece eşleşme oluşturan hamleler yapılabilir. Her bölümün bir hedefi ve sınırlı hamlesi vardır.</Text>
                <Text style={stil.pYazi}>4 taş eşleştirirsen çizgili taş, L ya da T şeklinde eşleştirirsen bomba, 5 taş eşleştirirsen renk bombası oluşur.</Text>
                <Text style={stil.pYazi}>VoiceOver ile parmağını tahtada gezdirerek taşları dinleyebilir, çift dokunarak seçebilirsin.</Text>
                <Pressable
                  style={[stil.btn, stil.pBtn, { backgroundColor: tema.accent }]}
                  onPress={() => {
                    cal('buton');
                    g.ogretici = true;
                    kaydet();
                    setModal(null);
                    soyle(`Bölüm ${s.level}. Hedef: ${hedefCumlesi(s.obj)}. ${s.moves} hamle.`);
                  }}
                  accessibilityRole="button"
                >
                  <Text style={[stil.btnYazi, { color: '#1B1030' }]}>Başla</Text>
                </Pressable>
              </ScrollView>
            )}

            {modal && modal.tip === 'kazandi' && (
              <ScrollView>
                <Text style={stil.pBaslik} accessibilityRole="header">
                  Bölüm {modal.level} Tamamlandı!
                </Text>
                <Text style={[stil.pYazi, { fontSize: 26, fontWeight: '900', color: tema.accent, textAlign: 'center' }]}>Bölüm {modal.sonraki}</Text>
                <Text style={[stil.pYazi, { textAlign: 'center' }]}>Yeni hedef:</Text>
                <Text style={[stil.pYazi, { textAlign: 'center', fontWeight: '800', color: '#3DDC84', fontSize: 20 }]}>{hedefCumlesi(modal.sonrakiHedef)}</Text>
                <Text style={[stil.pYazi, { textAlign: 'center' }]}>Hamle: {modal.sonrakiHamle}</Text>
                {modal.sonrakiAyar.ice > 0 && modal.level + 1 === 5 && <Text style={stil.pYazi}>Yeni engel: Buzlu taşlar. Buzu kırmak için o taşı patlat.</Text>}
                {modal.sonrakiAyar.chains > 0 && modal.level + 1 === 10 && <Text style={stil.pYazi}>Yeni engel: Zincirli taşlar. Hareket etmezler, eşleştirerek zinciri kırabilirsin.</Text>}
                {modal.sonrakiAyar.stones > 0 && modal.level + 1 === 15 && <Text style={stil.pYazi}>Yeni engel: Taş bloklar. Yanlarında eşleşme yaparak kırabilirsin.</Text>}
                <Text style={[stil.pYazi, { textAlign: 'center' }]}>Kazanılan bonus: {modal.odul}</Text>
                {modal.bildirimler.map((b, i) => (
                  <Text key={i} style={[stil.pYazi, { color: tema.accent }]}>
                    {b}
                  </Text>
                ))}
                <Pressable
                  style={[stil.btn, stil.pBtn, { backgroundColor: tema.accent }]}
                  onPress={() => {
                    cal('buton');
                    setModal(null);
                    bolumBaslat(modal.sonraki);
                  }}
                  accessibilityRole="button"
                >
                  <Text style={[stil.btnYazi, { color: '#1B1030' }]}>Devam</Text>
                </Pressable>
              </ScrollView>
            )}

            {modal && modal.tip === 'kaybetti' && (
              <View>
                <Text style={stil.pBaslik} accessibilityRole="header">
                  Hamleler Bitti
                </Text>
                <Text style={[stil.pYazi, { textAlign: 'center' }]}>Hedef: {hedefCumlesi(s.obj)}</Text>
                <Text style={[stil.pYazi, { textAlign: 'center' }]}>
                  {s.obj && s.obj.type === 'score' ? `Toplanan puan: ${s.score}` : s.obj ? `Ulaşılan: ${s.obj.current} / ${s.obj.target}` : ''}
                </Text>
                <Pressable
                  style={[stil.btn, stil.pBtn, { backgroundColor: tema.accent }]}
                  onPress={() => {
                    cal('buton');
                    setModal(null);
                    bolumBaslat(s.level);
                  }}
                  accessibilityRole="button"
                >
                  <Text style={[stil.btnYazi, { color: '#1B1030' }]}>Tekrar Dene</Text>
                </Pressable>
              </View>
            )}

            {modal && modal.tip === 'sifirla' && (
              <View>
                <Text style={stil.pBaslik} accessibilityRole="header">
                  Baştan Başla
                </Text>
                <Text style={stil.pYazi}>Oyun Seviye 1'e dönecek. Bonusların, başarımların ve istatistiklerin korunur.</Text>
                <View style={stil.satir}>
                  <Pressable
                    style={[stil.btn, stil.pBtn]}
                    onPress={() => {
                      cal('buton');
                      setModal(null);
                    }}
                    accessibilityRole="button"
                  >
                    <Text style={stil.btnYazi}>Vazgeç</Text>
                  </Pressable>
                  <Pressable
                    style={[stil.btn, stil.pBtn, { backgroundColor: tema.danger }]}
                    onPress={() => {
                      cal('buton');
                      setModal(null);
                      bolumBaslat(1);
                    }}
                    accessibilityRole="button"
                  >
                    <Text style={[stil.btnYazi, { color: '#FFFFFF' }]}>Seviye 1'e Dön</Text>
                  </Pressable>
                </View>
              </View>
            )}

            {modal && modal.tip === 'bonuslar' && (
              <ScrollView>
                <Text style={stil.pBaslik} accessibilityRole="header">
                  Bonuslar
                </Text>
                {BONUSLAR.map((b) => {
                  const adet = g.bonuslar[b.id] || 0;
                  return (
                    <Pressable
                      key={b.id}
                      onPress={() => bonusSec(b.id)}
                      style={[stil.liste, { opacity: adet > 0 ? 1 : 0.5 }]}
                      accessibilityRole="button"
                      accessibilityLabel={`${b.ad}, ${adet} adet. ${b.aciklama}`}
                      accessibilityState={{ disabled: adet <= 0 }}
                    >
                      <View style={{ flex: 1 }}>
                        <Text style={stil.listeBaslik}>{b.ad}</Text>
                        <Text style={stil.listeAlt}>{b.aciklama}</Text>
                      </View>
                      <Text style={[stil.listeBaslik, { color: tema.accent, fontSize: 22 }]}>{adet}</Text>
                    </Pressable>
                  );
                })}
                <Pressable
                  style={[stil.btn, stil.pBtn]}
                  onPress={() => {
                    cal('buton');
                    setModal(null);
                  }}
                  accessibilityRole="button"
                >
                  <Text style={stil.btnYazi}>Kapat</Text>
                </Pressable>
              </ScrollView>
            )}

            {modal && modal.tip === 'ayarlar' && (
              <View style={{ maxHeight: '100%' }}>
                <Text style={stil.pBaslik} accessibilityRole="header">
                  Menü
                </Text>
                <View style={[stil.satir, { flexWrap: 'wrap' }]} accessibilityRole="tablist">
                  {[
                    ['ayarlar', 'Ayarlar'],
                    ['gorevler', 'Görevler'],
                    ['basarimlar', 'Başarımlar'],
                    ['istatistik', 'İstatistik'],
                  ].map(([id, ad]) => (
                    <Pressable
                      key={id}
                      onPress={() => {
                        cal('buton');
                        setAyarSekme(id);
                      }}
                      style={[stil.sekme, ayarSekme === id && { backgroundColor: tema.accent }]}
                      accessibilityRole="tab"
                      accessibilityState={{ selected: ayarSekme === id }}
                    >
                      <Text style={[stil.sekmeYazi, ayarSekme === id && { color: '#1B1030' }]}>{ad}</Text>
                    </Pressable>
                  ))}
                </View>
                <ScrollView style={{ maxHeight: 380 }}>
                  {ayarSekme === 'ayarlar' && (
                    <View>
                      {[
                        ['ses', 'Ses efektleri'],
                        ['muzik', 'Müzik'],
                        ['titresim', 'Titreşim'],
                      ].map(([k, ad]) => (
                        <View key={k} style={stil.liste}>
                          <Text style={[stil.listeBaslik, { flex: 1 }]}>{ad}</Text>
                          <Switch value={!!g.settings[k]} onValueChange={(v) => ayarDegistir(k, v)} accessibilityLabel={ad} />
                        </View>
                      ))}
                      <Text style={[stil.listeBaslik, { marginTop: 8 }]}>Tema</Text>
                      <View style={stil.satir}>
                        {[
                          ['koyu', 'Koyu'],
                          ['acik', 'Açık'],
                        ].map(([k, ad]) => (
                          <Pressable
                            key={k}
                            onPress={() => {
                              cal('buton');
                              ayarDegistir('tema', k);
                            }}
                            style={[stil.sekme, { flex: 1 }, g.settings.tema === k && { backgroundColor: tema.accent }]}
                            accessibilityRole="radio"
                            accessibilityLabel={`${ad} tema`}
                            accessibilityState={{ checked: g.settings.tema === k }}
                          >
                            <Text style={[stil.sekmeYazi, g.settings.tema === k && { color: '#1B1030' }]}>{ad}</Text>
                          </Pressable>
                        ))}
                      </View>
                      <Pressable
                        onPress={() => {
                          cal('buton');
                          setModal({ tip: 'ogretici' });
                        }}
                        style={[stil.btn, stil.pBtn]}
                        accessibilityRole="button"
                      >
                        <Text style={stil.btnYazi}>Nasıl Oynanır</Text>
                      </Pressable>
                    </View>
                  )}
                  {ayarSekme === 'gorevler' && (
                    <View>
                      <Text style={stil.listeAlt}>Her gün 3 yeni görev. Tamamlanan her görev bir bonus kazandırır.</Text>
                      {g.gunluk.picks.map((id) => {
                        const gorev = GUNLUK_HAVUZ.find((x) => x.id === id);
                        const ilerle = Math.min(gorev.hedef, g.gunluk.progress[gorev.stat] || 0);
                        const bitti = g.gunluk.claimed.includes(id);
                        return (
                          <View key={id} style={stil.liste} accessible accessibilityLabel={`${gorev.ad}, ${bitti ? 'tamamlandı' : `${ilerle} / ${gorev.hedef}`}`}>
                            <Text style={[stil.listeBaslik, { flex: 1 }]}>{gorev.ad}</Text>
                            <Text style={[stil.listeBaslik, { color: bitti ? '#3DDC84' : tema.sub }]}>{bitti ? 'Tamam' : `${ilerle} / ${gorev.hedef}`}</Text>
                          </View>
                        );
                      })}
                    </View>
                  )}
                  {ayarSekme === 'basarimlar' && (
                    <View>
                      {BASARIMLAR.map((b) => {
                        const acik = g.basarimlar.includes(b.id);
                        return (
                          <View key={b.id} style={[stil.liste, { opacity: acik ? 1 : 0.55 }]} accessible accessibilityLabel={`${b.ad}, ${b.aciklama}, ${acik ? 'kazanıldı' : 'kazanılmadı'}`}>
                            <View style={{ flex: 1 }}>
                              <Text style={stil.listeBaslik}>{b.ad}</Text>
                              <Text style={stil.listeAlt}>{b.aciklama}</Text>
                            </View>
                            <Text style={[stil.listeBaslik, { color: acik ? tema.accent : tema.sub }]}>{acik ? '★' : '☆'}</Text>
                          </View>
                        );
                      })}
                    </View>
                  )}
                  {ayarSekme === 'istatistik' && (
                    <View>
                      {[
                        ['Toplam puan', g.stats.totalScore],
                        ['Patlatılan taş', g.stats.gems],
                        ['En uzun kombo', g.stats.maxCombo],
                        ['Tamamlanan bölüm', g.stats.levelsDone],
                        ['En yüksek bölüm', g.stats.bestLevel],
                        ['Yapılan hamle', g.stats.movesMade],
                        ['Çizgili taş', g.stats.stripedMade],
                        ['Bomba taşı', g.stats.bombsMade],
                        ['Renk bombası', g.stats.colorBombsMade],
                        ['Kullanılan bonus', g.stats.bonusesUsed],
                      ].map(([ad, d]) => (
                        <View key={ad} style={stil.liste} accessible accessibilityLabel={`${ad}: ${d}`}>
                          <Text style={[stil.listeBaslik, { flex: 1 }]}>{ad}</Text>
                          <Text style={[stil.listeBaslik, { color: tema.accent }]}>{d}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                </ScrollView>
                <Pressable
                  style={[stil.btn, stil.pBtn]}
                  onPress={() => {
                    cal('buton');
                    setModal(null);
                  }}
                  accessibilityRole="button"
                >
                  <Text style={stil.btnYazi}>Kapat</Text>
                </Pressable>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function olusturStil(t) {
  return StyleSheet.create({
    kok: { flex: 1, backgroundColor: t.bg },
    ust: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8, marginBottom: 8 },
    ikonBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: t.card, alignItems: 'center', justifyContent: 'center' },
    ikon: { fontSize: 22, color: t.text },
    baslik: { fontSize: 24, fontWeight: '900', color: t.text },
    satir: { flexDirection: 'row', gap: 8, marginBottom: 8 },
    kutu: { flex: 1, backgroundColor: t.card, borderRadius: 14, paddingVertical: 8, alignItems: 'center' },
    kutuEtiket: { fontSize: 12, color: t.sub },
    kutuDeger: { fontSize: 22, fontWeight: '800', color: t.text },
    cubuk: { height: 14, borderRadius: 10, backgroundColor: t.bar, overflow: 'hidden', marginBottom: 10 },
    tahta: { backgroundColor: t.board, borderRadius: 16, padding: 4, marginBottom: 8 },
    mesaj: { color: t.sub, fontSize: 15, textAlign: 'center', minHeight: 40, marginBottom: 8 },
    btn: { flex: 1, backgroundColor: t.card, borderRadius: 14, paddingVertical: 14, paddingHorizontal: 6, alignItems: 'center', justifyContent: 'center' },
    btnYazi: { color: t.text, fontWeight: '800', fontSize: 14, textAlign: 'center' },
    perde: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', alignItems: 'center', justifyContent: 'center', padding: 20 },
    pencere: { width: '100%', maxWidth: 440, maxHeight: '88%', backgroundColor: t.card, borderRadius: 20, padding: 20 },
    pBaslik: { fontSize: 24, fontWeight: '900', color: t.text, textAlign: 'center', marginBottom: 12 },
    pYazi: { fontSize: 16, color: t.text, marginBottom: 10, lineHeight: 22 },
    pBtn: { marginTop: 12, backgroundColor: t.bar, flex: 0, minHeight: 50 },
    liste: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderColor: t.bar, gap: 10 },
    listeBaslik: { fontSize: 17, fontWeight: '800', color: t.text },
    listeAlt: { fontSize: 13, color: t.sub, marginTop: 2 },
    sekme: { paddingVertical: 10, paddingHorizontal: 12, borderRadius: 12, backgroundColor: t.bar, alignItems: 'center' },
    sekmeYazi: { color: t.text, fontWeight: '800' },
  });
}
