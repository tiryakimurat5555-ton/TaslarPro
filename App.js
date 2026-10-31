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
import { LinearGradient } from 'expo-linear-gradient';
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

// Bolum ayarlari: kolaydan zora. Sayilar araclar/denge-simulasyonu.js ile ayarlandi.
const DENGE = {
  // [bolum, deger] noktalari arasinda dogrusal artis. 20. bolumde renk sayisi 6'ya cikar, hedefler buna gore ayarlidir.
  puan: [[1, 600], [3, 900], [6, 1300], [10, 1800], [19, 2500], [20, 1700], [30, 2000], [45, 2400]],
  puanHamle: [[1, 18], [10, 20], [19, 21], [20, 22], [45, 24]],
  renk: [[2, 14], [7, 20], [19, 25], [20, 17], [30, 19], [45, 22]],
  renkHamle: [[2, 18], [15, 20], [19, 20], [20, 22], [45, 24]],
  ozel: [[4, 2], [8, 3], [16, 4], [19, 4], [20, 3], [32, 4], [45, 5]],
  ozelHamle: [[4, 20], [16, 22], [30, 24], [45, 26]],
  buzHamle: [[5, 17], [13, 20], [19, 22], [20, 24], [45, 28]],
  buz: [[5, 6], [13, 10], [19, 12], [20, 9], [35, 12], [45, 14]],
  zincir: [[10, 2], [20, 3], [35, 5]],
  blok: [[15, 1], [25, 2], [40, 4]],
};

function egri(noktalar, L) {
  if (L <= noktalar[0][0]) return noktalar[0][1];
  for (let i = 1; i < noktalar.length; i++) {
    const [l1, d1] = noktalar[i - 1];
    const [l2, d2] = noktalar[i];
    if (L <= l2) return d1 + ((d2 - d1) * (L - l1)) / (l2 - l1);
  }
  const [la, da] = noktalar[noktalar.length - 2];
  const [lb, db] = noktalar[noktalar.length - 1];
  return db + ((db - da) * (L - lb)) / (lb - la) * 0.5;
}

function bolumTipi(L) {
  if (L <= 4) return ['score', 'color', 'score', 'special'][L - 1];
  return ['score', 'color', 'special', 'ice'][(L - 2) % 4];
}

function bolumAyari(L) {
  const type = bolumTipi(L);
  const ncolors = L <= 3 ? 4 : L <= 19 ? 5 : 6;
  let target = 0;
  let moves = 20;
  if (type === 'score') {
    target = Math.round(egri(DENGE.puan, L) / 50) * 50;
    moves = Math.round(egri(DENGE.puanHamle, L));
  } else if (type === 'color') {
    target = Math.round(egri(DENGE.renk, L));
    moves = Math.round(egri(DENGE.renkHamle, L));
  } else if (type === 'special') {
    target = Math.round(egri(DENGE.ozel, L));
    moves = Math.round(egri(DENGE.ozelHamle, L));
  } else {
    moves = Math.round(egri(DENGE.buzHamle, L));
  }
  const buzVar = L >= 5;
  let ice = buzVar ? Math.min(20, Math.round(egri(DENGE.buz, L))) : 0;
  // Buz hedefi olmayan bolumlerde buz daha az
  if (type !== 'ice') ice = buzVar ? Math.round(ice * 0.5) : 0;
  return {
    type,
    target,
    color: type === 'color' ? rastgele(ncolors) : null,
    moves,
    ncolors,
    ice,
    iceStrong: L >= 13,
    chains: L >= 10 ? Math.min(7, Math.round(egri(DENGE.zincir, L))) : 0,
    stones: L >= 15 ? Math.min(6, Math.round(egri(DENGE.blok, L))) : 0,
    stoneHp: L >= 22 ? 2 : 1,
  };
}

function buzToplami(bd) {
  let t = 0;
  for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) t += bd[r][c].ice;
  return t;
}

function hedefOlustur(ayar, bd) {
  const obj = { type: ayar.type, target: ayar.target, color: ayar.color, current: 0 };
  if (ayar.type === 'ice') obj.target = Math.max(1, buzToplami(bd));
  return obj;
}

function hedefIlerlet(obj, res) {
  if (obj.type === 'color') obj.current = Math.min(obj.target, obj.current + res.pops.filter((p) => p.color === obj.color).length);
  else if (obj.type === 'special') obj.current = Math.min(obj.target, obj.current + res.create.length);
  else if (obj.type === 'ice') obj.current = Math.min(obj.target, obj.current + res.iceHits.length);
}

function hedefTamam(obj, score) {
  return obj.type === 'score' ? score >= obj.target : obj.current >= obj.target;
}

function yildizHesapla(kalan, toplam) {
  const oran = kalan / toplam;
  if (oran >= 0.3) return 3;
  if (oran >= 0.12) return 2;
  return 1;
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

// Kayittan geri yuklenen tahtadan sonra yeni taslarin kimlikleri cakismasin
function kimlikAyarla(bd) {
  let en = 0;
  for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) if (bd[r][c].gem) en = Math.max(en, bd[r][c].gem.id);
  sonrakiId = Math.max(sonrakiId, en + 1);
}

function tahtaGecerliMi(bd) {
  if (!Array.isArray(bd) || bd.length !== N) return false;
  for (let r = 0; r < N; r++) {
    if (!Array.isArray(bd[r]) || bd[r].length !== N) return false;
    for (let c = 0; c < N; c++) {
      const cl = bd[r][c];
      if (!cl || typeof cl.ice !== 'number' || typeof cl.stone !== 'number') return false;
      if (cl.stone === 0 && !cl.gem) return false;
    }
  }
  return true;
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
  yildiz: require('./assets/sounds/yildiz.mp3'),
  bolumbasla: require('./assets/sounds/bolumbasla.mp3'),
  uyari: require('./assets/sounds/uyari.mp3'),
  sayma: require('./assets/sounds/sayma.mp3'),
  konfeti: require('./assets/sounds/konfeti.mp3'),
  tasblok: require('./assets/sounds/tasblok.mp3'),
  karistirma: require('./assets/sounds/karistirma.mp3'),
};
const MUZIK = require('./assets/sounds/muzik.mp3');

// ---------- Gorunum sabitleri ----------
const TAS_RENKLERI = ['#FF4D5E', '#FF9F2E', '#FFD93D', '#3DDC84', '#3D9BFF', '#B06CFF'];
const TAS_ACIK = ['#FFA3AC', '#FFD08F', '#FFF3A6', '#9CF5C4', '#9FD0FF', '#DDB5FF'];
const TAS_KOYU = ['#B3202F', '#C0660A', '#C99A00', '#16955A', '#1560C0', '#7232C4'];
const TAS_SEMBOL = ['♥', '●', '★', '▲', '◆', '■'];
// Her rengin kendi sekli var: renk ayirt edemeyen de taslari secebilsin
const TAS_SEKIL = ['kare', 'daire', 'elmas', 'daire', 'elmas', 'kare'];

const TEMALAR = {
  koyu: {
    arka: ['#1A1446', '#1B2A63', '#0E1B3A'],
    card: 'rgba(255,255,255,0.09)',
    kart: '#222B57',
    cizgi: 'rgba(255,255,255,0.14)',
    text: '#FFFFFF',
    sub: '#B8C0E8',
    board: ['#2E3A7A', '#1A2150'],
    cell: 'rgba(255,255,255,0.07)',
    cell2: 'rgba(255,255,255,0.03)',
    accent: '#FFD84D',
    accent2: '#FF9F2E',
    bar: 'rgba(255,255,255,0.12)',
    danger: '#FF5A6E',
    warn: '#FFD84D',
    kabarcik: 'rgba(160,190,255,0.16)',
  },
  acik: {
    arka: ['#FDF2FF', '#E6EEFF', '#D9F1FF'],
    card: 'rgba(255,255,255,0.75)',
    kart: '#FFFFFF',
    cizgi: 'rgba(40,50,110,0.12)',
    text: '#1B2040',
    sub: '#545C8A',
    board: ['#B9C4F2', '#93A2E0'],
    cell: 'rgba(255,255,255,0.45)',
    cell2: 'rgba(255,255,255,0.25)',
    accent: '#E0A000',
    accent2: '#FF7A2E',
    bar: 'rgba(40,50,110,0.12)',
    danger: '#D61F3A',
    warn: '#B87F00',
    kabarcik: 'rgba(120,140,255,0.16)',
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
  { id: 'buz50', ad: 'Buz Kıran', aciklama: '50 buz kır', kontrol: (s) => s.iceBroken >= 50, odul: 'bomba' },
  { id: 'bolum5', ad: 'Yolun Başı', aciklama: '5 bölüm tamamla', kontrol: (s) => s.levelsDone >= 5, odul: 'ikikat' },
  { id: 'bolum10', ad: 'Kararlı', aciklama: '10 bölüm tamamla', kontrol: (s) => s.levelsDone >= 10, odul: 'renk' },
  { id: 'bolum25', ad: 'Taş Ustası', aciklama: '25 bölüm tamamla', kontrol: (s) => s.levelsDone >= 25, odul: 'renk' },
  { id: 'yildiz30', ad: 'Yıldız Avcısı', aciklama: '30 yıldız topla', kontrol: (s) => s.stars >= 30, odul: 'ikikat' },
  { id: 'puan10k', ad: 'Puan Avcısı', aciklama: 'Toplam 10.000 puana ulaş', kontrol: (s) => s.totalScore >= 10000, odul: 'ikikat' },
];

const GUNLUK_HAVUZ = [
  { id: 'tas150', ad: '150 taş patlat', stat: 'gems', hedef: 150 },
  { id: 'ozel5', ad: '5 özel taş oluştur', stat: 'specials', hedef: 5 },
  { id: 'bolum2', ad: '2 bölüm tamamla', stat: 'levels', hedef: 2 },
  { id: 'kombo3', ad: '3 kez kombo yap', stat: 'combos', hedef: 3 },
  { id: 'puan2000', ad: '2.000 puan topla', stat: 'score', hedef: 2000 },
  { id: 'bonus2', ad: '2 bonus kullan', stat: 'bonuses', hedef: 2 },
  { id: 'buz20', ad: '20 buz kır', stat: 'ice', hedef: 20 },
  { id: 'yildiz5', ad: '5 yıldız kazan', stat: 'stars', hedef: 5 },
];

const KAYIT_ANAHTARI = 'taslarpro-kayit-v1';
const KALAN_HAMLE_PUANI = 60;

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
    iceBroken: 0,
    stars: 0,
  };
}

function hedefEtiketi(obj) {
  if (!obj) return 'Hedef';
  if (obj.type === 'score') return 'Hedef';
  if (obj.type === 'color') return `${RENK_ADLARI[obj.color]} topla`;
  if (obj.type === 'ice') return 'Buzları kır';
  return 'Özel taş oluştur';
}

function hedefDegeri(obj) {
  if (!obj) return '';
  if (obj.type === 'score') return `${obj.target} puan`;
  return `${obj.current} / ${obj.target}`;
}

function hedefCumlesi(obj) {
  if (!obj) return '';
  if (obj.type === 'score') return `${obj.target} puan topla`;
  if (obj.type === 'color') return `${obj.target} ${RENK_ADLARI[obj.color]} taş patlat`;
  if (obj.type === 'ice') return `Bütün buzları kır (${obj.target} kat)`;
  return `${obj.target} özel taş oluştur`;
}

function hucreEtiketi(cell, r, c) {
  const yer = `${r + 1}. satır, ${c + 1}. sütun`;
  if (cell.stone > 0) return `${cell.stone > 1 ? 'Sağlam taş blok' : 'Taş blok'}, ${yer}`;
  if (!cell.gem) return `Boş, ${yer}`;
  const g = cell.gem;
  let ad = g.special === 'colorbomb' ? 'renk bombası' : RENK_ADLARI[g.color];
  if (g.special && g.special !== 'colorbomb') ad += ' ' + OZEL_ADLARI[g.special];
  // Engel bilgisi en basta: dokunur dokunmaz duyulsun
  const onEk = [];
  if (cell.chain) onEk.push('Zincirli');
  if (cell.ice === 2) onEk.push(onEk.length ? 'kalın buzlu' : 'Kalın buzlu');
  else if (cell.ice === 1) onEk.push(onEk.length ? 'buzlu' : 'Buzlu');
  const metin = onEk.length ? `${onEk.join(' ')} ${ad}` : ad.charAt(0).toUpperCase() + ad.slice(1);
  return `${metin}, ${yer}`;
}

function kisaAd(cell) {
  const g = cell.gem;
  if (!g) return 'taş';
  if (g.special === 'colorbomb') return 'Renk bombası';
  return RENK_ADLARI[g.color] + (g.special ? ' ' + OZEL_ADLARI[g.special] : '');
}

function yildizMetni(n) {
  return n === 1 ? '1 yıldız' : `${n} yıldız`;
}

const bekle = (ms) => new Promise((r) => setTimeout(r, ms));
const calistir = (anim) => new Promise((r) => anim.start(() => r()));

function soyle(metin) {
  if (metin) AccessibilityInfo.announceForAccessibility(metin);
}

const gizli = { accessibilityElementsHidden: true, importantForAccessibility: 'no-hide-descendants' };

// ---------- Sayan sayi ----------
function useSayac(hedef, sure = 500) {
  const [deger, setDeger] = useState(hedef);
  const onceki = useRef(hedef);
  useEffect(() => {
    const bas = onceki.current;
    onceki.current = hedef;
    if (bas === hedef) return;
    if (hedef < bas) {
      setDeger(hedef);
      return;
    }
    let iptal = false;
    const t0 = Date.now();
    const adim = () => {
      if (iptal) return;
      const k = Math.min(1, (Date.now() - t0) / sure);
      const e = 1 - Math.pow(1 - k, 3);
      setDeger(Math.round(bas + (hedef - bas) * e));
      if (k < 1) requestAnimationFrame(adim);
    };
    requestAnimationFrame(adim);
    return () => {
      iptal = true;
    };
  }, [hedef]);
  return deger;
}

// ---------- Hareketli arka plan ----------
function Kabarcik({ genislik, yukseklik, renk, gecikme, boy, x }) {
  const t = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const d = Animated.loop(
      Animated.sequence([
        Animated.delay(gecikme),
        Animated.timing(t, { toValue: 1, duration: 14000 + boy * 300, easing: Easing.linear, useNativeDriver: true }),
        Animated.timing(t, { toValue: 0, duration: 0, useNativeDriver: true }),
      ])
    );
    d.start();
    return () => d.stop();
  }, []);
  return (
    <Animated.View
      style={{
        position: 'absolute',
        left: x * genislik,
        top: yukseklik,
        width: boy,
        height: boy,
        borderRadius: boy,
        backgroundColor: renk,
        opacity: t.interpolate({ inputRange: [0, 0.1, 0.85, 1], outputRange: [0, 1, 1, 0] }),
        transform: [
          { translateY: t.interpolate({ inputRange: [0, 1], outputRange: [0, -yukseklik - boy * 2] }) },
          { translateX: t.interpolate({ inputRange: [0, 0.25, 0.5, 0.75, 1], outputRange: [0, 14, 0, -14, 0] }) },
        ],
      }}
    />
  );
}

const KABARCIKLAR = Array.from({ length: 14 }).map((_, i) => ({
  x: ((i * 37) % 100) / 100,
  boy: 10 + ((i * 53) % 40),
  gecikme: (i * 1300) % 9000,
}));

const Arkaplan = React.memo(function Arkaplan({ tema, genislik, yukseklik }) {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none" {...gizli}>
      <LinearGradient colors={tema.arka} style={StyleSheet.absoluteFill} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />
      {KABARCIKLAR.map((k, i) => (
        <Kabarcik key={i} genislik={genislik} yukseklik={yukseklik} renk={tema.kabarcik} {...k} />
      ))}
    </View>
  );
});

// ---------- Tas gorunumu ----------
const TasGorunum = React.memo(function TasGorunum({ gem, anim, cell, parilti, donus }) {
  const tx = useMemo(() => Animated.multiply(anim.x, cell), [anim, cell]);
  const ty = useMemo(() => Animated.multiply(anim.y, cell), [anim, cell]);
  const p = Math.max(3, Math.round(cell * 0.07));
  const ic = cell - p * 2;
  const rb = gem.special === 'colorbomb';
  const renkler = rb ? ['#4B3C7A', '#2A2340', '#120E20'] : [TAS_ACIK[gem.color], TAS_RENKLERI[gem.color], TAS_KOYU[gem.color]];
  const sekil = rb || gem.special === 'bomb' ? 'daire' : TAS_SEKIL[gem.color];
  let govde;
  if (sekil === 'elmas') {
    const k = ic * 0.76;
    govde = (
      <View style={{ width: ic, height: ic, alignItems: 'center', justifyContent: 'center' }}>
        <View style={{ width: k, height: k, transform: [{ rotate: '45deg' }], borderRadius: k * 0.22, overflow: 'hidden', borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.35)' }}>
          <LinearGradient colors={renkler} style={StyleSheet.absoluteFill} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />
        </View>
      </View>
    );
  } else {
    govde = (
      <View
        style={{
          width: ic,
          height: ic,
          borderRadius: sekil === 'daire' ? ic : ic * 0.28,
          overflow: 'hidden',
          borderWidth: 1.5,
          borderColor: 'rgba(255,255,255,0.35)',
        }}
      >
        <LinearGradient colors={renkler} style={StyleSheet.absoluteFill} start={{ x: 0.15, y: 0 }} end={{ x: 0.85, y: 1 }} />
      </View>
    );
  }
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
      <View style={{ width: ic, height: ic, alignItems: 'center', justifyContent: 'center' }}>
        <View style={{ position: 'absolute', top: 3, left: 0 }}>
          <View style={{ width: ic, height: ic, borderRadius: ic * 0.4, backgroundColor: 'rgba(0,0,0,0.22)', transform: [{ scale: 0.9 }] }} />
        </View>
        <View style={{ position: 'absolute' }}>{govde}</View>
        <View
          style={{
            position: 'absolute',
            top: ic * 0.12,
            left: ic * 0.2,
            width: ic * 0.32,
            height: ic * 0.16,
            borderRadius: ic * 0.2,
            backgroundColor: 'rgba(255,255,255,0.55)',
            transform: [{ rotate: '-20deg' }],
          }}
        />
        {(gem.special === 'striped-h' || gem.special === 'striped-v') && (
          <Animated.View
            style={{
              position: 'absolute',
              width: ic,
              height: ic,
              alignItems: 'center',
              justifyContent: 'center',
              opacity: parilti.interpolate({ inputRange: [0, 1], outputRange: [0.55, 1] }),
              transform: gem.special === 'striped-v' ? [{ rotate: '90deg' }] : [],
            }}
          >
            {[-0.24, 0, 0.24].map((y) => (
              <View key={y} style={{ position: 'absolute', width: ic * 0.86, height: 4, borderRadius: 2, top: ic / 2 + ic * y - 2, backgroundColor: '#FFFFFF' }} />
            ))}
          </Animated.View>
        )}
        {gem.special === 'bomb' && (
          <>
            <View style={{ position: 'absolute', width: ic * 0.6, height: ic * 0.6, borderRadius: ic, backgroundColor: '#1C1A28', borderWidth: 2, borderColor: '#FFFFFF' }} />
            <Animated.View
              style={{
                position: 'absolute',
                top: ic * 0.06,
                right: ic * 0.16,
                width: ic * 0.2,
                height: ic * 0.2,
                borderRadius: ic,
                backgroundColor: '#FFB347',
                transform: [{ scale: parilti.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1.25] }) }],
              }}
            />
          </>
        )}
        {rb && (
          <Animated.View
            style={{
              position: 'absolute',
              width: ic,
              height: ic,
              transform: [{ rotate: donus.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] }) }],
            }}
          >
            {TAS_RENKLERI.map((rk, i) => {
              const aci = (i / 6) * Math.PI * 2;
              const yar = ic * 0.3;
              const d = ic * 0.19;
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
          </Animated.View>
        )}
        <Text
          style={{
            color: '#FFFFFF',
            fontSize: ic * (gem.special ? 0.32 : 0.38),
            fontWeight: '900',
            textShadowColor: 'rgba(0,0,0,0.4)',
            textShadowRadius: 3,
            textShadowOffset: { width: 0, height: 1 },
          }}
        >
          {rb ? '✦' : gem.special === 'bomb' ? '✸' : TAS_SEMBOL[gem.color]}
        </Text>
      </View>
    </Animated.View>
  );
});

// ---------- Efektler ----------
function Patlama({ x, y, color, cell, buyuk, bitti }) {
  const t = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(t, { toValue: 1, duration: buyuk ? 700 : 520, easing: Easing.out(Easing.quad), useNativeDriver: true }).start(bitti);
  }, []);
  const sayi = buyuk ? 12 : 8;
  const mesafe = cell * (buyuk ? 1.5 : 0.85);
  return (
    <View pointerEvents="none" style={{ position: 'absolute', left: x * cell + cell / 2, top: y * cell + cell / 2 }}>
      <Animated.View
        style={{
          position: 'absolute',
          left: -cell * 0.45,
          top: -cell * 0.45,
          width: cell * 0.9,
          height: cell * 0.9,
          borderRadius: cell,
          borderWidth: 3,
          borderColor: color,
          opacity: t.interpolate({ inputRange: [0, 1], outputRange: [0.8, 0] }),
          transform: [{ scale: t.interpolate({ inputRange: [0, 1], outputRange: [0.3, 1.4] }) }],
        }}
      />
      {Array.from({ length: sayi }).map((_, i) => {
        const aci = (i / sayi) * Math.PI * 2 + (i % 2) * 0.3;
        const boy = buyuk ? 9 : 7;
        const yildiz = i % 3 === 0;
        return (
          <Animated.View
            key={i}
            style={{
              position: 'absolute',
              width: boy,
              height: boy,
              borderRadius: yildiz ? 1 : boy,
              left: -boy / 2,
              top: -boy / 2,
              backgroundColor: yildiz ? '#FFFFFF' : color,
              opacity: t.interpolate({ inputRange: [0, 0.7, 1], outputRange: [1, 0.8, 0] }),
              transform: [
                { translateX: t.interpolate({ inputRange: [0, 1], outputRange: [0, Math.cos(aci) * mesafe] }) },
                { translateY: t.interpolate({ inputRange: [0, 1], outputRange: [0, Math.sin(aci) * mesafe + cell * 0.2] }) },
                { rotate: t.interpolate({ inputRange: [0, 1], outputRange: ['0deg', `${180 + i * 30}deg`] }) },
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
    Animated.timing(t, { toValue: 1, duration: 950, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start(bitti);
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
        fontSize: 22,
        fontWeight: '900',
        textShadowColor: 'rgba(0,0,0,0.7)',
        textShadowRadius: 5,
        opacity: t.interpolate({ inputRange: [0, 0.75, 1], outputRange: [1, 1, 0] }),
        transform: [
          { translateY: t.interpolate({ inputRange: [0, 1], outputRange: [0, -cell * 1.3] }) },
          { scale: t.interpolate({ inputRange: [0, 0.2, 1], outputRange: [0.5, 1.25, 1] }) },
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
    Animated.timing(t, { toValue: 1, duration: 420, useNativeDriver: true }).start(bitti);
  }, []);
  const yatay = tip === 'striped-h';
  const olcek = t.interpolate({ inputRange: [0, 0.4, 1], outputRange: [0.05, 1, 1] });
  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: 'absolute',
        left: yatay ? 0 : c * cell + cell * 0.25,
        top: yatay ? r * cell + cell * 0.25 : 0,
        width: yatay ? cell * N : cell * 0.5,
        height: yatay ? cell * 0.5 : cell * N,
        opacity: t.interpolate({ inputRange: [0, 0.3, 1], outputRange: [0, 1, 0] }),
        transform: [yatay ? { scaleX: olcek } : { scaleY: olcek }],
      }}
    >
      <LinearGradient
        colors={['rgba(255,255,255,0)', '#FFFFFF', 'rgba(255,255,255,0)']}
        start={yatay ? { x: 0, y: 0 } : { x: 0, y: 0 }}
        end={yatay ? { x: 0, y: 1 } : { x: 1, y: 0 }}
        style={{ flex: 1, borderRadius: cell }}
      />
    </Animated.View>
  );
}

function Dalga({ r, c, cell, boyut, renk, bitti }) {
  const t = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(t, { toValue: 1, duration: 600, easing: Easing.out(Easing.quad), useNativeDriver: true }).start(bitti);
  }, []);
  const d = cell * boyut;
  return (
    <>
      <Animated.View
        pointerEvents="none"
        style={{
          position: 'absolute',
          left: c * cell + cell / 2 - d / 2,
          top: r * cell + cell / 2 - d / 2,
          width: d,
          height: d,
          borderRadius: d,
          backgroundColor: renk || '#FFE27A',
          opacity: t.interpolate({ inputRange: [0, 0.2, 1], outputRange: [0.0, 0.45, 0] }),
          transform: [{ scale: t.interpolate({ inputRange: [0, 1], outputRange: [0.1, 1] }) }],
        }}
      />
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
          borderColor: '#FFFFFF',
          opacity: t.interpolate({ inputRange: [0, 1], outputRange: [0.95, 0] }),
          transform: [{ scale: t.interpolate({ inputRange: [0, 1], outputRange: [0.2, 1.05] }) }],
        }}
      />
    </>
  );
}

function KirikParca({ r, c, cell, renk, bitti }) {
  const t = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(t, { toValue: 1, duration: 650, easing: Easing.in(Easing.quad), useNativeDriver: true }).start(bitti);
  }, []);
  return (
    <View pointerEvents="none" style={{ position: 'absolute', left: c * cell + cell / 2, top: r * cell + cell / 2 }}>
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const yon = (i - 2.5) * 0.5;
        const b = cell * 0.18;
        return (
          <Animated.View
            key={i}
            style={{
              position: 'absolute',
              width: b,
              height: b * 0.7,
              left: -b / 2,
              top: -b / 2,
              backgroundColor: renk,
              borderRadius: 2,
              opacity: t.interpolate({ inputRange: [0, 0.8, 1], outputRange: [1, 1, 0] }),
              transform: [
                { translateX: t.interpolate({ inputRange: [0, 1], outputRange: [0, yon * cell * 0.6] }) },
                { translateY: t.interpolate({ inputRange: [0, 0.3, 1], outputRange: [0, -cell * 0.35, cell * 0.9] }) },
                { rotate: t.interpolate({ inputRange: [0, 1], outputRange: ['0deg', `${(i % 2 ? 1 : -1) * 220}deg`] }) },
              ],
            }}
          />
        );
      })}
    </View>
  );
}

// ---------- Konfeti ----------
const KONFETI_RENK = ['#FF4D5E', '#FFD93D', '#3DDC84', '#3D9BFF', '#B06CFF', '#FF9F2E', '#FFFFFF'];
function Konfeti({ genislik, yukseklik }) {
  const parcalar = useMemo(
    () =>
      Array.from({ length: 44 }).map((_, i) => ({
        x: Math.random() * genislik,
        gecikme: Math.random() * 600,
        sure: 1800 + Math.random() * 1400,
        renk: KONFETI_RENK[i % KONFETI_RENK.length],
        boy: 6 + Math.random() * 8,
        salinim: 20 + Math.random() * 40,
        donus: 360 + Math.random() * 720,
      })),
    [genislik]
  );
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill} {...gizli}>
      {parcalar.map((p, i) => (
        <KonfetiParca key={i} p={p} yukseklik={yukseklik} />
      ))}
    </View>
  );
}

function KonfetiParca({ p, yukseklik }) {
  const t = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.sequence([
      Animated.delay(p.gecikme),
      Animated.timing(t, { toValue: 1, duration: p.sure, easing: Easing.in(Easing.quad), useNativeDriver: true }),
    ]).start();
  }, []);
  return (
    <Animated.View
      style={{
        position: 'absolute',
        left: p.x,
        top: -20,
        width: p.boy,
        height: p.boy * 0.5,
        backgroundColor: p.renk,
        borderRadius: 1,
        opacity: t.interpolate({ inputRange: [0, 0.9, 1], outputRange: [1, 1, 0] }),
        transform: [
          { translateY: t.interpolate({ inputRange: [0, 1], outputRange: [0, yukseklik + 40] }) },
          { translateX: t.interpolate({ inputRange: [0, 0.25, 0.5, 0.75, 1], outputRange: [0, p.salinim, 0, -p.salinim, 0] }) },
          { rotate: t.interpolate({ inputRange: [0, 1], outputRange: ['0deg', `${p.donus}deg`] }) },
        ],
      }}
    />
  );
}

// ---------- Yildizlar ----------
function YildizSatiri({ sayi, boy, cal, gecikme = 400 }) {
  const animler = useRef([0, 1, 2].map(() => new Animated.Value(0))).current;
  useEffect(() => {
    const zaman = [];
    animler.forEach((a, i) => {
      a.setValue(0);
      if (i < sayi) {
        zaman.push(
          setTimeout(() => {
            if (cal) cal('yildiz', 0.9);
            Animated.spring(a, { toValue: 1, friction: 4, tension: 120, useNativeDriver: true }).start();
          }, gecikme + i * 380)
        );
      }
    });
    return () => zaman.forEach(clearTimeout);
  }, [sayi]);
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-end' }} accessible accessibilityLabel={yildizMetni(sayi)}>
      {[0, 1, 2].map((i) => (
        <View key={i} style={{ width: boy * 1.1, height: boy * 1.1, alignItems: 'center', justifyContent: 'center', marginBottom: i === 1 ? boy * 0.25 : 0 }}>
          <Text style={{ position: 'absolute', fontSize: boy, color: 'rgba(255,255,255,0.18)' }}>★</Text>
          <Animated.Text
            style={{
              position: 'absolute',
              fontSize: boy,
              color: '#FFD84D',
              textShadowColor: '#FF9F2E',
              textShadowRadius: 10,
              opacity: animler[i],
              transform: [
                { scale: animler[i].interpolate({ inputRange: [0, 1], outputRange: [2.2, 1] }) },
                { rotate: animler[i].interpolate({ inputRange: [0, 1], outputRange: ['-90deg', '0deg'] }) },
              ],
            }}
          >
            ★
          </Animated.Text>
        </View>
      ))}
    </View>
  );
}

// ---------- Kucuk dugme ----------
function Dugme({ onPress, etiket, yazi, renkler, yaziRengi, stil, tema, rol = 'button', durum }) {
  const s = useRef(new Animated.Value(1)).current;
  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => Animated.spring(s, { toValue: 0.94, useNativeDriver: true, friction: 6 }).start()}
      onPressOut={() => Animated.spring(s, { toValue: 1, useNativeDriver: true, friction: 4 }).start()}
      accessibilityRole={rol}
      accessibilityLabel={etiket}
      accessibilityState={durum}
      style={[{ flex: 1 }, stil]}
    >
      <Animated.View style={{ flex: 1, transform: [{ scale: s }], borderRadius: 16, overflow: 'hidden' }}>
        <LinearGradient
          colors={renkler || [tema.kart, tema.kart]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={{ flex: 1, minHeight: 50, paddingVertical: 12, paddingHorizontal: 6, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: tema.cizgi, borderRadius: 16 }}
        >
          <Text style={{ color: yaziRengi || tema.text, fontWeight: '800', fontSize: 14, textAlign: 'center' }}>{yazi}</Text>
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
}

// ---------- Menu yardimcilari ----------
const MENU_SEKMELERI = [
  ['ayarlar', 'Ayarlar'],
  ['gorevler', 'Görevler'],
  ['basarimlar', 'Başarımlar'],
  ['istatistik', 'İstatistik'],
];

function MenuGrubu({ baslik, stil, children }) {
  return (
    <View style={stil.grup}>
      <Text style={stil.grupBaslik} accessibilityRole="header">
        {baslik}
      </Text>
      {children}
    </View>
  );
}

function AnahtarSatiri({ ad, deger, degistir, stil }) {
  return (
    <Pressable
      onPress={() => degistir(!deger)}
      style={stil.liste}
      accessibilityRole="switch"
      accessibilityLabel={ad}
      accessibilityState={{ checked: deger }}
    >
      <Text style={[stil.listeBaslik, { flex: 1 }]}>{ad}</Text>
      <View {...gizli} pointerEvents="none">
        <Switch value={deger} />
      </View>
    </Pressable>
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
  const { width, height } = useWindowDimensions();
  const tahtaGenislik = Math.min(width - 28, 440);
  const cell = tahtaGenislik / N;

  const [, setTik] = useState(0);
  const yenile = useCallback(() => setTik((t) => t + 1), []);

  const G = useRef(null);
  if (!G.current) {
    G.current = {
      board: null,
      level: 1,
      score: 0,
      moves: 18,
      obj: null,
      ayar: null,
      bonuslar: { ipucu: 3, karistir: 2, bomba: 1, renk: 1, ikikat: 1 },
      ikiKat: 0,
      stats: bosIstatistik(),
      basarimlar: [],
      gunluk: gunlukSec(bugun()),
      settings: { ses: true, muzik: true, titresim: true, tema: 'koyu' },
      ogretici: false,
      enYuksek: 1,
      yildizlar: {},
      devam: null,
      oynaniyor: false,
      uyarildi: false,
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
  const [afis, setAfis] = useState(null);
  const [eylem, setEylem] = useState(0);

  const sarsinti = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const ilerleme = useRef(new Animated.Value(0)).current;
  const komboAnim = useRef(new Animated.Value(0)).current;
  const ipucuAnim = useRef(new Animated.Value(0)).current;
  const seciliAnim = useRef(new Animated.Value(0)).current;
  const afisAnim = useRef(new Animated.Value(0)).current;
  const hamleNabiz = useRef(new Animated.Value(0)).current;
  const parilti = useRef(new Animated.Value(0)).current;
  const donus = useRef(new Animated.Value(0)).current;
  const pencereAnim = useRef(new Animated.Value(0)).current;

  // Ozel taslarin ortak canlandirmalari (tek dongu, butun taslar paylasir)
  useEffect(() => {
    const p = Animated.loop(
      Animated.sequence([
        Animated.timing(parilti, { toValue: 1, duration: 600, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(parilti, { toValue: 0, duration: 600, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    );
    const d = Animated.loop(Animated.timing(donus, { toValue: 1, duration: 4000, easing: Easing.linear, useNativeDriver: true }));
    p.start();
    d.start();
    return () => {
      p.stop();
      d.stop();
    };
  }, []);

  // Pencereler acilirken buyuyerek gelsin
  useEffect(() => {
    if (!modal) return;
    pencereAnim.setValue(0);
    Animated.spring(pencereAnim, { toValue: 1, friction: 6, tension: 90, useNativeDriver: true }).start();
  }, [modal && modal.tip]);

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
      muzik.current.volume = 0.3;
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
      else if (tur === 'orta') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
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
      level: s.sonrakiKayit || s.level,
      bonuslar: s.bonuslar,
      stats: s.stats,
      basarimlar: s.basarimlar,
      gunluk: s.gunluk,
      settings: s.settings,
      ogretici: s.ogretici,
      enYuksek: s.enYuksek,
      yildizlar: s.yildizlar,
      devam: s.oynaniyor && s.board
        ? { level: s.level, board: s.board, score: s.score, moves: s.moves, obj: s.obj, ayar: s.ayar, ikiKat: s.ikiKat, uyarildi: s.uyarildi }
        : null,
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
          if (dusme) {
            const d = 150 + mesafe * 55;
            list.push(Animated.timing(a.x, { toValue: c, duration: d, easing: Easing.out(Easing.quad), useNativeDriver: true }));
            list.push(
              Animated.sequence([
                Animated.delay(c * 18),
                Animated.timing(a.y, { toValue: r, duration: d, easing: Easing.bounce, useNativeDriver: true }),
              ])
            );
          } else {
            list.push(Animated.timing(a.x, { toValue: c, duration: sure, easing: Easing.inOut(Easing.quad), useNativeDriver: true }));
            list.push(Animated.timing(a.y, { toValue: r, duration: sure, easing: Easing.inOut(Easing.quad), useNativeDriver: true }));
          }
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

  const sars = useCallback(
    (guc) => {
      const a = [];
      for (let i = 0; i < 6; i++) {
        const k = guc * (1 - i / 6);
        a.push(Animated.timing(sarsinti, { toValue: { x: (i % 2 ? -1 : 1) * k, y: (i % 3 === 0 ? 1 : -1) * k * 0.6 }, duration: 45, useNativeDriver: true }));
      }
      a.push(Animated.timing(sarsinti, { toValue: { x: 0, y: 0 }, duration: 45, useNativeDriver: true }));
      Animated.sequence(a).start();
    },
    [sarsinti]
  );

  const ilerlemeGuncelle = useCallback(() => {
    const s = G.current;
    if (!s.obj) return;
    const deger = s.obj.type === 'score' ? s.score / s.obj.target : s.obj.current / s.obj.target;
    Animated.spring(ilerleme, { toValue: Math.min(1, deger), friction: 7, tension: 50, useNativeDriver: false }).start();
  }, [ilerleme]);

  const afisGoster = useCallback(
    (L, obj, moves) => {
      setAfis({ L, metin: hedefCumlesi(obj), moves });
      afisAnim.setValue(0);
      cal('bolumbasla', 0.8);
      Animated.sequence([
        Animated.spring(afisAnim, { toValue: 1, friction: 7, tension: 70, useNativeDriver: true }),
        Animated.delay(1300),
        Animated.timing(afisAnim, { toValue: 2, duration: 320, easing: Easing.in(Easing.quad), useNativeDriver: true }),
      ]).start(() => setAfis(null));
    },
    [afisAnim, cal]
  );

  // ----- Bolum baslat -----
  const tahtayiDusur = useCallback(
    (bd) => {
      anims.current = {};
      for (let r = 0; r < N; r++)
        for (let c = 0; c < N; c++) {
          const gm = bd[r][c].gem;
          if (!gm) continue;
          const a = animAl(gm.id, r - N - 1, c);
          a.tr = r - N - 1;
        }
      tahtaAyarla(bd);
      mesgul.current = true;
      setTimeout(() => {
        konumlariCanlandir(bd, 0, true).then(() => {
          mesgul.current = false;
        });
      }, 80);
    },
    [animAl, tahtaAyarla, konumlariCanlandir]
  );

  const bolumBaslat = useCallback(
    (L, duyur = true) => {
      const s = G.current;
      const ayar = bolumAyari(L);
      const bd = tahtaOlustur(ayar);
      s.level = L;
      s.ayar = ayar;
      s.score = 0;
      s.moves = ayar.moves;
      s.ikiKat = 0;
      s.uyarildi = false;
      s.oynaniyor = true;
      s.sonrakiKayit = null;
      s.obj = hedefOlustur(ayar, bd);
      setSecili(null);
      setMod(null);
      setIpucu(null);
      setEfektler([]);
      ilerleme.setValue(0);
      tahtayiDusur(bd);
      const metin = `Bölüm ${L}. Hedef: ${hedefCumlesi(s.obj)}. ${s.moves} hamle.`;
      setMesaj(metin);
      if (duyur) {
        afisGoster(L, s.obj, s.moves);
        soyle(metin);
      }
      setEylem((e) => e + 1);
      kaydet();
    },
    [tahtayiDusur, ilerleme, kaydet, afisGoster]
  );

  // ----- Yukleme -----
  useEffect(() => {
    (async () => {
      const s = G.current;
      let devam = null;
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
          s.yildizlar = v.yildizlar || {};
          s.enYuksek = Math.max(v.enYuksek || 1, s.level, s.stats.bestLevel || 1);
          if (v.devam && v.devam.level === s.level && tahtaGecerliMi(v.devam.board) && v.devam.ayar && v.devam.obj) devam = v.devam;
        }
      } catch (e) {}
      s.yuklendi = true;
      if (devam) {
        kimlikAyarla(devam.board);
        s.ayar = devam.ayar;
        s.score = devam.score;
        s.moves = devam.moves;
        s.obj = devam.obj;
        s.ikiKat = devam.ikiKat || 0;
        s.uyarildi = !!devam.uyarildi;
        s.oynaniyor = true;
        tahtayiDusur(devam.board);
        ilerlemeGuncelle();
        const metin = `Bölüm ${s.level}, kaldığın yerden devam. Hedef: ${hedefCumlesi(s.obj)}. Kalan hamle ${s.moves}.`;
        setMesaj(metin);
      } else {
        bolumBaslat(s.level, false);
      }
      muzikAyarla();
      if (!s.ogretici) setModal({ tip: 'ogretici' });
      else afisGoster(s.level, s.obj, s.moves);
    })();
  }, []);

  // ----- Secili tas nabzi, ipucu parlamasi, az hamle uyarisi -----
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
          Animated.timing(a.s, { toValue: 1.14, duration: 420, useNativeDriver: true }),
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
        Animated.timing(ipucuAnim, { toValue: 0.15, duration: 500, useNativeDriver: true }),
      ])
    );
    dongu.start();
    const t = setTimeout(() => setIpucu(null), 6000);
    return () => {
      dongu.stop();
      clearTimeout(t);
    };
  }, [ipucu]);

  const azHamle = g.moves <= 5 && g.moves > 0 && g.oynaniyor;
  useEffect(() => {
    hamleNabiz.setValue(0);
    if (!azHamle) return;
    const d = Animated.loop(
      Animated.sequence([
        Animated.timing(hamleNabiz, { toValue: 1, duration: 450, useNativeDriver: true }),
        Animated.timing(hamleNabiz, { toValue: 0, duration: 450, useNativeDriver: true }),
      ])
    );
    d.start();
    return () => d.stop();
  }, [azHamle]);

  // Bir sure hamle yapilmazsa yapilabilecek hamle sessizce parlar
  useEffect(() => {
    const t = setTimeout(() => {
      const s = G.current;
      if (mesgul.current || modal || secili || mod || !s.board || !s.oynaniyor) return;
      const h = ipucuBul(s.board);
      if (h) setIpucu(h);
    }, 14000);
    return () => clearTimeout(t);
  }, [eylem, modal, secili, mod]);

  // ----- Istatistik, basarim, gunluk -----
  const gunlukIlerlet = useCallback((stat, miktar, bildirimler) => {
    const s = G.current;
    if (!miktar) return;
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
      const yazilar = ['', '', 'Güzel!', 'Süper!', 'Muhteşem!', 'İnanılmaz!', 'Efsane!'];
      const yazi = yazilar[Math.min(zincir, 6)];
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

  const bolumBitti = useCallback(
    (oncekiBildirimler) => {
      const s = G.current;
      s.oynaniyor = false;
      s.sonrakiKayit = s.level + 1;
      const kalan = s.moves;
      const yildiz = yildizHesapla(kalan, s.ayar.moves);
      const bonusPuan = kalan * KALAN_HAMLE_PUANI;
      const eskiYildiz = s.yildizlar[s.level] || 0;
      if (yildiz > eskiYildiz) s.yildizlar[s.level] = yildiz;
      s.stats.stars = Object.values(s.yildizlar).reduce((a, b) => a + b, 0);
      s.stats.totalScore += bonusPuan;
      s.stats.levelsDone++;
      s.enYuksek = Math.max(s.enYuksek, s.level + 1);
      s.stats.bestLevel = Math.max(s.stats.bestLevel, s.enYuksek);
      const bildirimler = [...(oncekiBildirimler || [])];
      gunlukIlerlet('levels', 1, bildirimler);
      gunlukIlerlet('stars', Math.max(0, yildiz - eskiYildiz), bildirimler);
      basarimKontrol(bildirimler);
      const odul = BONUSLAR[rastgele(BONUSLAR.length)];
      s.bonuslar[odul.id] = (s.bonuslar[odul.id] || 0) + 1;
      const sonraki = bolumAyari(s.level + 1);
      cal('kazandi');
      setTimeout(() => cal('konfeti', 0.8), 250);
      titret('basari');
      setModal({
        tip: 'kazandi',
        level: s.level,
        yildiz,
        puan: s.score,
        bonusPuan,
        kalan,
        odul: odul.ad,
        sonraki: s.level + 1,
        sonrakiTip: sonraki.type,
        sonrakiAyar: sonraki,
        bildirimler,
      });
      kaydet();
    },
    [cal, titret, gunlukIlerlet, basarimKontrol, kaydet]
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
      let toplamBuz = 0;
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

        // Sesler, titresim ve gorsel efektler
        const yeniEfekt = [];
        const efektTurleri = new Set(res.effects.map((e) => e.type));
        if (efektTurleri.has('colorbomb') || (plan.forced.length > 15 && zincir === 1)) {
          cal('renkbombasi');
          titret('guclu');
          sars(9);
        } else if (efektTurleri.has('bomb')) {
          cal('bomba');
          titret('guclu');
          sars(7);
        } else if (efektTurleri.has('striped-h') || efektTurleri.has('striped-v')) {
          cal('cizgili');
          titret('orta');
          sars(3);
        } else if (zincir > 1) {
          cal('kombo');
          titret();
        } else {
          cal('eslesme');
          titret();
        }
        if (res.iceHits.length) setTimeout(() => cal('buz', 0.8), 90);
        if (res.chainBreaks.length) setTimeout(() => cal('zincir', 0.9), 120);
        if (res.stoneHits.length) setTimeout(() => cal('tasblok', 0.9), 60);
        res.effects.forEach((e) => {
          if (e.type === 'striped-h' || e.type === 'striped-v') yeniEfekt.push({ id: efektId.current++, tur: 'cizgi', tip: e.type, r: e.r, c: e.c });
          else if (e.type === 'bomb') yeniEfekt.push({ id: efektId.current++, tur: 'dalga', r: e.r, c: e.c, boyut: 3.4, renk: '#FFB347' });
          else if (e.type === 'colorbomb') yeniEfekt.push({ id: efektId.current++, tur: 'dalga', r: e.r, c: e.c, boyut: 7, renk: '#C9A6FF' });
        });
        res.pops.slice(0, 16).forEach((p) => {
          yeniEfekt.push({
            id: efektId.current++,
            tur: 'patlama',
            r: p.r,
            c: p.c,
            color: p.color >= 0 ? TAS_RENKLERI[p.color] : '#FFFFFF',
            buyuk: !!p.special,
          });
        });
        res.iceHits.forEach(([r, c]) => yeniEfekt.push({ id: efektId.current++, tur: 'kirik', r, c, renk: 'rgba(220,245,255,0.95)' }));
        res.stoneHits.forEach((k) => yeniEfekt.push({ id: efektId.current++, tur: 'kirik', r: Math.floor(k / N), c: k % N, renk: '#8A8FA8' }));
        res.chainBreaks.forEach(([r, c]) => yeniEfekt.push({ id: efektId.current++, tur: 'kirik', r, c, renk: '#D5D8E4' }));

        const puan = puanHesapla(res, zincir, s.ikiKat > 0);
        if (puan > 0 && (res.pops.length || res.iceHits.length)) {
          const orta = res.pops.length ? res.pops[Math.floor(res.pops.length / 2)] : { r: res.iceHits[0][0], c: res.iceHits[0][1] };
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
              Animated.timing(a.s, { toValue: 1.3, duration: 90, useNativeDriver: true }),
              Animated.timing(a.s, { toValue: 0, duration: 180, easing: Easing.in(Easing.back(2)), useNativeDriver: true }),
            ]),
            Animated.timing(a.o, { toValue: 0, duration: 270, useNativeDriver: true }),
          ]);
        });
        await calistir(Animated.parallel(popAnim.filter(Boolean)));

        // Hedef, puan, istatistik
        s.score += puan;
        toplamPuan += puan;
        toplamTas += res.pops.length;
        toplamBuz += res.iceHits.length;
        s.stats.gems += res.pops.length;
        s.stats.iceBroken += res.iceHits.length;
        s.stats.totalScore += puan;
        res.create.forEach((cr) => {
          if (cr.special === 'colorbomb') s.stats.colorBombsMade++;
          else if (cr.special === 'bomb') s.stats.bombsMade++;
          else s.stats.stripedMade++;
        });
        toplamOzel += res.create.length;
        hedefIlerlet(s.obj, res);

        // Tahtayi guncelle, yeni ozel taslar parlayarak belirsin
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
          efektEkle(olusan.map((o) => ({ id: efektId.current++, tur: 'dalga', r: o.r, c: o.c, boyut: 1.6, renk: '#FFFFFF' })));
          await calistir(
            Animated.parallel(
              olusan.map((o) =>
                Animated.sequence([
                  Animated.spring(anims.current[o.id].s, { toValue: 1.35, friction: 3, tension: 160, useNativeDriver: true }),
                  Animated.spring(anims.current[o.id].s, { toValue: 1, friction: 4, useNativeDriver: true }),
                ])
              )
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
      gunlukIlerlet('ice', toplamBuz, bildirimler);
      if (zincir >= 2) gunlukIlerlet('combos', 1, bildirimler);
      basarimKontrol(bildirimler);

      // Hamle yoksa karistir
      if (!ipucuBul(bd)) {
        const k = karistir(bd, s.ayar.ncolors);
        cal('karistirma');
        tahtaAyarla(k);
        await konumlariCanlandir(k, 420, false);
        bd = k;
        bildirimler.push('Yapılacak hamle kalmadı, taşlar karıştırıldı.');
      }

      // Duyuru
      let metin = toplamTas ? `${toplamTas} taş patladı, ${toplamPuan} puan.` : '';
      if (zincir >= 2) metin += ` ${zincir} kombo!`;
      if (toplamOzel === 1) metin += ' Özel taş oluştu.';
      else if (toplamOzel > 1) metin += ` ${toplamOzel} özel taş oluştu.`;
      if (toplamBuz) metin += ` ${toplamBuz} buz kırıldı.`;
      if (s.obj.type !== 'score') metin += ` Hedef ${s.obj.current} / ${s.obj.target}.`;
      else metin += ` Puan ${s.score} / ${s.obj.target}.`;
      if (hamleMi) metin += ` Kalan hamle ${s.moves}.`;
      if (s.ikiKat > 0 && hamleMi) metin += ` İki kat puan: ${s.ikiKat} hamle kaldı.`;
      metin = metin.trim();
      setMesaj(metin);

      // Kazanma / kaybetme
      const kazandi = hedefTamam(s.obj, s.score);
      if (kazandi) {
        await bekle(350);
        bolumBitti(bildirimler);
        return;
      }
      let uyari = '';
      if (hamleMi && s.moves === 5 && !s.uyarildi) {
        s.uyarildi = true;
        cal('uyari');
        titret('orta');
        uyari = ' Son 5 hamle!';
      }
      if (bildirimler.length) cal('bonus');
      soyle([metin + uyari, ...bildirimler].join(' '));
      if (s.moves <= 0) {
        s.oynaniyor = false;
        await bekle(450);
        cal('kaybetti');
        titret('hata');
        setModal({ tip: 'kaybetti' });
      }
      kaydet();
    },
    [cal, titret, sars, efektEkle, komboGoster, animAl, tahtaAyarla, konumlariCanlandir, ilerlemeGuncelle, gunlukIlerlet, basarimKontrol, kaydet, bolumBitti]
  );

  // ----- Hamle -----
  const hamleYap = useCallback(
    async (a, b) => {
      const s = G.current;
      if (mesgul.current) return;
      mesgul.current = true;
      setSecili(null);
      setIpucu(null);
      setEylem((e) => e + 1);
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
        const ozel = ozelKombo(bd, a, b);
        const runs = eslesmeleriBul(bd);
        if (!ozel && !runs.length) {
          cal('gecersiz');
          titret('hata');
          const geri = tahtaKopyala(bd);
          takasla(geri, a, b);
          tahtaAyarla(geri);
          await konumlariCanlandir(geri, 170, false);
          sars(6);
          setMesaj('Geçersiz hamle. Bu takas eşleşme oluşturmuyor.');
          soyle('Geçersiz hamle.');
          return;
        }
        s.moves--;
        s.stats.movesMade++;
        const ikiKatAktif = s.ikiKat > 0;
        let baslangic = bd;
        let plan = null;
        if (ozel) {
          if (ozel.converted) {
            ozel.board.forEach((row, r) =>
              row.forEach((cl, c) => {
                if (cl.gem && bd[r][c].gem && cl.gem.special !== bd[r][c].gem.special) {
                  const an = anims.current[cl.gem.id];
                  if (an) an.s.setValue(0.5);
                }
              })
            );
            tahtaAyarla(ozel.board);
            cal('bonus', 0.8);
            await calistir(
              Animated.parallel(
                Object.values(anims.current).map((an) => Animated.spring(an.s, { toValue: 1, friction: 5, useNativeDriver: true }))
              )
            );
            await bekle(200);
          }
          baslangic = ozel.board;
          plan = ozel.plan;
        }
        yenile();
        await zincirle(baslangic, plan, [a, b], true);
        if (ikiKatAktif) s.ikiKat = Math.max(0, s.ikiKat - 1);
        yenile();
      } finally {
        mesgul.current = false;
      }
    },
    [cal, titret, sars, tahtaAyarla, konumlariCanlandir, zincirle, yenile]
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
      setEylem((e) => e + 1);
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
        efektEkle([{ id: efektId.current++, tur: 'dalga', r, c, boyut: tur === 'bomba' ? 3.4 : 7, renk: tur === 'bomba' ? '#FFB347' : '#C9A6FF' }]);
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
      if (mesgul.current || !s.board || !s.oynaniyor) return;
      setEylem((e) => e + 1);
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
      if (!s.oynaniyor) return;
      setModal(null);
      setEylem((e) => e + 1);
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
        cal('karistirma');
        tahtaAyarla(k);
        await konumlariCanlandir(k, 480, false);
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

  const pencereKapat = useCallback(() => {
    cal('buton');
    setModal(null);
  }, [cal]);

  // ----- Cizim -----
  const s = g;
  const bd = s.board;
  const gosterilenPuan = useSayac(s.score);
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
              left: c * cell + 1.5,
              top: r * cell + 1.5,
              width: cell - 3,
              height: cell - 3,
              borderRadius: cell * 0.22,
              backgroundColor: (r + c) % 2 === 0 ? tema.cell : tema.cell2,
            }}
          >
            {cl.stone > 0 && (
              <View style={{ flex: 1, margin: 2, borderRadius: cell * 0.18, overflow: 'hidden', borderWidth: 2, borderColor: '#3A3D4D' }}>
                <LinearGradient
                  colors={cl.stone > 1 ? ['#6E7388', '#4A4E60', '#33364A'] : ['#9CA1B8', '#767B92', '#5A5F75']}
                  style={StyleSheet.absoluteFill}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                />
                <View style={{ position: 'absolute', left: cell * 0.18, top: cell * 0.3, width: cell * 0.45, height: 3, backgroundColor: '#3A3D4D', transform: [{ rotate: '35deg' }] }} />
                <View style={{ position: 'absolute', left: cell * 0.4, top: cell * 0.55, width: cell * 0.3, height: 3, backgroundColor: '#3A3D4D', transform: [{ rotate: '-25deg' }] }} />
                {cl.stone > 1 && (
                  <View style={{ position: 'absolute', left: cell * 0.12, top: cell * 0.62, width: cell * 0.35, height: 3, backgroundColor: '#2A2C38', transform: [{ rotate: '-40deg' }] }} />
                )}
              </View>
            )}
          </View>
        );
        if (cl.gem) {
          const a = animAl(cl.gem.id, r, c);
          taslar.push(<TasGorunum key={cl.gem.id} gem={cl.gem} anim={a} cell={cell} parilti={parilti} donus={donus} />);
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
                borderRadius: cell * 0.24,
                overflow: 'hidden',
                borderWidth: cl.ice > 1 ? 3 : 2,
                borderColor: 'rgba(255,255,255,0.9)',
              }}
            >
              <LinearGradient
                colors={cl.ice > 1 ? ['rgba(230,248,255,0.85)', 'rgba(170,220,255,0.6)'] : ['rgba(230,248,255,0.55)', 'rgba(170,220,255,0.3)']}
                style={StyleSheet.absoluteFill}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              />
              <View style={{ position: 'absolute', left: cell * 0.12, top: cell * 0.1, width: cell * 0.35, height: 3, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.9)', transform: [{ rotate: '-35deg' }] }} />
              <View style={{ position: 'absolute', right: cell * 0.12, bottom: cell * 0.14, width: cell * 0.2, height: 2, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.8)', transform: [{ rotate: '-35deg' }] }} />
            </View>
          );
        }
        if (cl.chain) {
          ustKatman.push(
            <View
              key={`z${r}-${c}`}
              pointerEvents="none"
              style={{ position: 'absolute', left: c * cell, top: r * cell, width: cell, height: cell, alignItems: 'center', justifyContent: 'center' }}
            >
              {['45deg', '-45deg'].map((d) => (
                <View key={d} style={{ position: 'absolute', flexDirection: 'row', transform: [{ rotate: d }] }}>
                  {[0, 1, 2, 3].map((i) => (
                    <View key={i} style={{ width: cell * 0.26, height: cell * 0.14, marginHorizontal: -1, borderRadius: cell * 0.07, borderWidth: 3, borderColor: '#D5D8E4', backgroundColor: 'rgba(60,64,84,0.35)' }} />
                  ))}
                </View>
              ))}
              <View style={{ width: cell * 0.22, height: cell * 0.22, borderRadius: 4, backgroundColor: '#F2C14E', borderWidth: 2, borderColor: '#8A6A12' }} />
            </View>
          );
        }
      }
  }

  const efektCizim = efektler.map((e) => {
    if (e.tur === 'patlama') return <Patlama key={e.id} x={e.c} y={e.r} color={e.color} cell={cell} buyuk={e.buyuk} bitti={() => efektSil(e.id)} />;
    if (e.tur === 'yazi') return <UcanYazi key={e.id} x={e.c} y={e.r} text={e.text} cell={cell} color={s.ikiKat > 0 ? '#FFB3F0' : '#FFE27A'} bitti={() => efektSil(e.id)} />;
    if (e.tur === 'cizgi') return <CizgiIsigi key={e.id} tip={e.tip} r={e.r} c={e.c} cell={cell} bitti={() => efektSil(e.id)} />;
    if (e.tur === 'dalga') return <Dalga key={e.id} r={e.r} c={e.c} cell={cell} boyut={e.boyut} renk={e.renk} bitti={() => efektSil(e.id)} />;
    if (e.tur === 'kirik') return <KirikParca key={e.id} r={e.r} c={e.c} cell={cell} renk={e.renk} bitti={() => efektSil(e.id)} />;
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
          borderRadius: cell * 0.28,
          borderWidth: 3,
          borderColor: '#7CFFB2',
          backgroundColor: 'rgba(124,255,178,0.12)',
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
        borderRadius: cell * 0.28,
        borderWidth: 3,
        borderColor: tema.accent,
        backgroundColor: 'rgba(255,216,77,0.15)',
        opacity: seciliAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 0.5] }),
      }}
    />
  );

  const komboCizim = kombo && (
    <Animated.Text
      pointerEvents="none"
      {...gizli}
      style={{
        position: 'absolute',
        top: tahtaGenislik / 2 - 34,
        left: 0,
        right: 0,
        textAlign: 'center',
        fontSize: 44,
        fontWeight: '900',
        color: '#FFE27A',
        textShadowColor: '#7A2BFF',
        textShadowRadius: 14,
        opacity: komboAnim.interpolate({ inputRange: [0, 1, 2], outputRange: [0, 1, 0] }),
        transform: [
          { scale: komboAnim.interpolate({ inputRange: [0, 1, 2], outputRange: [0.3, 1, 1.5] }) },
          { rotate: komboAnim.interpolate({ inputRange: [0, 1, 2], outputRange: ['-12deg', '-4deg', '0deg'] }) },
        ],
      }}
    >
      {kombo}
    </Animated.Text>
  );

  const afisCizim = afis && (
    <Animated.View
      pointerEvents="none"
      {...gizli}
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: tahtaGenislik / 2 - 70,
        alignItems: 'center',
        opacity: afisAnim.interpolate({ inputRange: [0, 0.4, 1, 2], outputRange: [0, 1, 1, 0] }),
        transform: [
          { translateX: afisAnim.interpolate({ inputRange: [0, 1, 2], outputRange: [-width, 0, width] }) },
          { rotate: afisAnim.interpolate({ inputRange: [0, 1, 2], outputRange: ['-6deg', '0deg', '6deg'] }) },
        ],
      }}
    >
      <LinearGradient
        colors={['#7A2BFF', '#FF4D9E', '#FF9F2E']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ paddingVertical: 16, paddingHorizontal: 26, borderRadius: 24, alignItems: 'center', borderWidth: 3, borderColor: 'rgba(255,255,255,0.8)' }}
      >
        <Text style={{ color: '#FFFFFF', fontSize: 34, fontWeight: '900', textShadowColor: 'rgba(0,0,0,0.3)', textShadowRadius: 6 }}>Bölüm {afis.L}</Text>
        <Text style={{ color: '#FFFFFF', fontSize: 17, fontWeight: '700', marginTop: 4, textAlign: 'center' }}>{afis.metin}</Text>
        <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 15, marginTop: 2 }}>{afis.moves} hamle</Text>
      </LinearGradient>
    </Animated.View>
  );

  const stil = useMemo(() => olusturStil(tema), [tema]);
  const objEtiket = hedefEtiketi(s.obj);
  const ilerlemeYuzde = s.obj ? Math.round(Math.min(1, s.obj.type === 'score' ? s.score / s.obj.target : s.obj.current / s.obj.target) * 100) : 0;
  const pencereStil = {
    opacity: pencereAnim,
    transform: [{ scale: pencereAnim.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1] }) }],
  };

  // Bolum haritasi satirlari
  const haritaBolumleri = [];
  for (let L = 1; L <= s.enYuksek; L++) haritaBolumleri.push(L);

  return (
    <View style={{ flex: 1 }}>
      <Arkaplan tema={tema} genislik={width} yukseklik={height} />
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom', 'left', 'right']}>
        <StatusBar style={g.settings.tema === 'acik' ? 'dark' : 'light'} />
        <ScrollView contentContainerStyle={{ alignItems: 'center', paddingBottom: 24 }}>
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
              <Text style={[stil.ikon, { opacity: g.settings.muzik ? 1 : 0.35 }]}>♪</Text>
            </Pressable>
            <View style={{ alignItems: 'center' }}>
              <Text style={stil.baslik} accessibilityRole="header">
                Renkli Taşlar
              </Text>
              <Text style={stil.altBaslik} {...gizli}>
                ★ {s.stats.stars || 0}
              </Text>
            </View>
            <Pressable
              onPress={() => {
                cal('buton');
                setAyarSekme('ayarlar');
                setModal({ tip: 'ayarlar' });
              }}
              accessibilityRole="button"
              accessibilityLabel="Menü"
              style={stil.ikonBtn}
            >
              <Text style={stil.ikon}>⚙</Text>
            </Pressable>
          </View>

          <View style={[stil.satir, { width: tahtaGenislik }]}>
            <View style={stil.kutu} accessible accessibilityLabel={`Puan ${s.score}`}>
              <Text style={stil.kutuEtiket}>Puan</Text>
              <Text style={stil.kutuDeger}>{gosterilenPuan}</Text>
            </View>
            <View style={stil.kutu} accessible accessibilityLabel={`Bölüm ${s.level}`}>
              <Text style={stil.kutuEtiket}>Bölüm</Text>
              <Text style={stil.kutuDeger}>{s.level}</Text>
            </View>
          </View>
          <View style={[stil.satir, { width: tahtaGenislik }]}>
            <View style={[stil.kutu, { flex: 1.4 }]} accessible accessibilityLabel={`${objEtiket}: ${hedefDegeri(s.obj)}`}>
              <Text style={stil.kutuEtiket}>{objEtiket}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {s.obj && s.obj.type === 'color' && (
                  <View style={{ width: 18, height: 18, borderRadius: TAS_SEKIL[s.obj.color] === 'daire' ? 9 : 5, marginRight: 6, overflow: 'hidden' }}>
                    <LinearGradient colors={[TAS_ACIK[s.obj.color], TAS_RENKLERI[s.obj.color], TAS_KOYU[s.obj.color]]} style={StyleSheet.absoluteFill} />
                  </View>
                )}
                {s.obj && s.obj.type === 'ice' && <View style={{ width: 16, height: 16, borderRadius: 5, marginRight: 6, backgroundColor: 'rgba(200,240,255,0.9)', borderWidth: 2, borderColor: '#FFFFFF' }} />}
                <Text style={stil.kutuDeger}>{hedefDegeri(s.obj)}</Text>
              </View>
            </View>
            <Animated.View
              style={[stil.kutu, { transform: [{ scale: hamleNabiz.interpolate({ inputRange: [0, 1], outputRange: [1, 1.07] }) }] }]}
              accessible
              accessibilityLabel={`Kalan hamle ${s.moves}${s.ikiKat > 0 ? `, iki kat puan ${s.ikiKat} hamle` : ''}`}
            >
              <Text style={stil.kutuEtiket}>Kalan Hamle</Text>
              <Text style={[stil.kutuDeger, { color: kalanRenk }]}>{s.moves}</Text>
              {s.ikiKat > 0 && <Text style={[stil.kutuEtiket, { color: '#FF7AD9', fontWeight: '800' }]}>2x puan · {s.ikiKat}</Text>}
            </Animated.View>
          </View>

          <View
            style={[stil.cubuk, { width: tahtaGenislik }]}
            accessible
            accessibilityRole="progressbar"
            accessibilityLabel="Hedef ilerlemesi"
            accessibilityValue={{ min: 0, max: 100, now: ilerlemeYuzde }}
          >
            <Animated.View style={{ height: '100%', borderRadius: 10, overflow: 'hidden', width: ilerleme.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }) }}>
              <LinearGradient colors={['#3DDC84', '#FFD84D', '#FF9F2E']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ flex: 1 }} />
            </Animated.View>
          </View>

          <Animated.View style={{ marginBottom: 8, transform: [{ translateX: sarsinti.x }, { translateY: sarsinti.y }] }}>
            <LinearGradient colors={tema.board} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[stil.tahta, { width: tahtaGenislik + 10, height: tahtaGenislik + 10 }]}>
              <View style={{ width: tahtaGenislik, height: tahtaGenislik, overflow: 'hidden', borderRadius: 14 }}>
                <View style={StyleSheet.absoluteFill} pointerEvents="none" {...gizli}>
                  {hucreler}
                  {taslar}
                  {ustKatman}
                  {ipucuCizim}
                  {seciliCizim}
                </View>
                <View style={StyleSheet.absoluteFill} pointerEvents="none" {...gizli}>
                  {efektCizim}
                </View>
                <View style={StyleSheet.absoluteFill}>{erisimHucreleri}</View>
                {mod && <View pointerEvents="none" style={{ position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, borderRadius: 14, borderWidth: 3, borderColor: '#FF7AD9' }} />}
              </View>
              {komboCizim}
              {afisCizim}
            </LinearGradient>
          </Animated.View>

          <Text style={[stil.mesaj, { width: tahtaGenislik }]} accessibilityLiveRegion="polite">
            {mesaj}
          </Text>

          {mod && (
            <View style={{ width: tahtaGenislik, marginBottom: 8, flexDirection: 'row' }}>
              <Dugme
                tema={tema}
                onPress={() => {
                  setMod(null);
                  cal('buton');
                  setMesaj('Bonus iptal edildi.');
                  soyle('Bonus iptal edildi.');
                }}
                etiket={mod === 'bomba' ? 'Bomba bonusunu iptal et' : 'Renk bonusunu iptal et'}
                yazi="Bonusu İptal Et"
                renkler={['#FF9AE6', '#FF7AD9']}
                yaziRengi="#1B1030"
              />
            </View>
          )}

          <View style={[stil.satir, { width: tahtaGenislik }]}>
            <Dugme
              tema={tema}
              onPress={() => {
                cal('buton');
                setModal({ tip: 'harita' });
              }}
              etiket="Bölümler"
              yazi="◎ Bölümler"
            />
            <Dugme
              tema={tema}
              onPress={() => {
                if (mesgul.current) return;
                cal('buton');
                bolumBaslat(s.level);
              }}
              etiket="Bölümü tekrarla"
              yazi="↩ Tekrarla"
            />
            <Dugme
              tema={tema}
              onPress={() => {
                cal('buton');
                setModal({ tip: 'bonuslar' });
              }}
              etiket="Bonuslar"
              yazi="★ Bonuslar"
              renkler={['#FFE27A', '#FFB347']}
              yaziRengi="#1B1030"
            />
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* ----- Pencereler ----- */}
      <Modal visible={!!modal} transparent animationType="fade" onRequestClose={() => setModal(null)}>
        <View style={stil.perde}>
          {modal && modal.tip === 'kazandi' && <Konfeti genislik={width} yukseklik={height} />}
          <Animated.View style={[stil.pencere, pencereStil]} accessibilityViewIsModal>
            {modal && modal.tip === 'ogretici' && (
              <ScrollView>
                <Text style={stil.pBaslik} accessibilityRole="header">
                  Renkli Taşlar'a Hoş Geldin
                </Text>
                <Text style={stil.pYazi}>
                  Bir taşa dokun, sonra yanındaki ya da altındaki bir taşa dokun. İki taş yer değiştirir. Aynı renkten en az 3 taş yan yana ya da alt alta gelirse patlar.
                </Text>
                <Text style={stil.pYazi}>Sadece eşleşme oluşturan hamleler yapılabilir. Her bölümün bir hedefi ve sınırlı hamlesi var. Bölümler gittikçe zorlaşır.</Text>
                <Text style={stil.pYazi}>4 taş eşleştirirsen çizgili taş, L ya da T şeklinde eşleştirirsen bomba, 5 taş eşleştirirsen renk bombası oluşur. Az hamleyle bitirirsen daha çok yıldız kazanırsın.</Text>
                <Text style={stil.pYazi}>VoiceOver ile parmağını tahtada gezdirerek taşları dinleyebilir, çift dokunarak seçebilirsin.</Text>
                <View style={{ flexDirection: 'row', marginTop: 8 }}>
                  <Dugme
                    tema={tema}
                    onPress={() => {
                      cal('buton');
                      g.ogretici = true;
                      kaydet();
                      setModal(null);
                      afisGoster(s.level, s.obj, s.moves);
                      soyle(`Bölüm ${s.level}. Hedef: ${hedefCumlesi(s.obj)}. ${s.moves} hamle.`);
                    }}
                    etiket="Başla"
                    yazi="Başla"
                    renkler={['#FFE27A', '#FFB347']}
                    yaziRengi="#1B1030"
                  />
                </View>
              </ScrollView>
            )}

            {modal && modal.tip === 'kazandi' && (
              <ScrollView>
                <Text style={stil.pBaslik} accessibilityRole="header">
                  Bölüm {modal.level} Tamamlandı!
                </Text>
                <YildizSatiri sayi={modal.yildiz} boy={54} cal={cal} />
                <View style={{ marginTop: 12 }} accessible accessibilityLabel={`Puan ${modal.puan}. Kalan ${modal.kalan} hamle bonusu ${modal.bonusPuan} puan.`}>
                  <Text style={[stil.pYazi, { textAlign: 'center', fontSize: 18 }]}>Puan: {modal.puan}</Text>
                  {modal.kalan > 0 && (
                    <Text style={[stil.pYazi, { textAlign: 'center', color: tema.accent, fontWeight: '800' }]}>
                      Kalan {modal.kalan} hamle bonusu: +{modal.bonusPuan}
                    </Text>
                  )}
                </View>
                <Text style={[stil.pYazi, { textAlign: 'center' }]}>Kazanılan bonus: {modal.odul}</Text>
                {modal.sonrakiAyar.ice > 0 && modal.sonraki === 5 && <Text style={stil.pYazi}>Sırada yeni engel var: Buzlu taşlar. Buzu kırmak için o taşı patlat.</Text>}
                {modal.sonrakiAyar.chains > 0 && modal.sonraki === 10 && <Text style={stil.pYazi}>Sırada yeni engel var: Zincirli taşlar. Hareket etmezler, eşleştirerek zinciri kırabilirsin.</Text>}
                {modal.sonrakiAyar.stones > 0 && modal.sonraki === 15 && <Text style={stil.pYazi}>Sırada yeni engel var: Taş bloklar. Yanlarında eşleşme yaparak kırabilirsin.</Text>}
                {modal.sonraki === 20 && <Text style={stil.pYazi}>Bundan sonra tahtada 6 renk var. Eşleşme bulmak zorlaşıyor.</Text>}
                {modal.bildirimler.map((b, i) => (
                  <Text key={i} style={[stil.pYazi, { color: tema.accent }]}>
                    {b}
                  </Text>
                ))}
                <View style={[stil.satir, { marginTop: 8 }]}>
                  <Dugme
                    tema={tema}
                    onPress={() => {
                      cal('buton');
                      setModal(null);
                      bolumBaslat(modal.level);
                    }}
                    etiket="Bölümü tekrar oyna"
                    yazi="↩ Tekrar"
                  />
                  <Dugme
                    tema={tema}
                    onPress={() => {
                      cal('buton');
                      setModal(null);
                      bolumBaslat(modal.sonraki);
                    }}
                    etiket={`Devam, Bölüm ${modal.sonraki}`}
                    yazi={`Bölüm ${modal.sonraki} ›`}
                    renkler={['#FFE27A', '#FFB347']}
                    yaziRengi="#1B1030"
                  />
                </View>
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
                <Text style={[stil.pYazi, { textAlign: 'center', color: tema.sub }]}>Bonusları kullanmayı unutma. İpucu ve bombalar zor bölümlerde çok işe yarar.</Text>
                <View style={[stil.satir, { marginTop: 8 }]}>
                  <Dugme
                    tema={tema}
                    onPress={() => {
                      cal('buton');
                      setModal({ tip: 'harita' });
                    }}
                    etiket="Bölümler"
                    yazi="Bölümler"
                  />
                  <Dugme
                    tema={tema}
                    onPress={() => {
                      cal('buton');
                      setModal(null);
                      bolumBaslat(s.level);
                    }}
                    etiket="Tekrar dene"
                    yazi="Tekrar Dene"
                    renkler={['#FFE27A', '#FFB347']}
                    yaziRengi="#1B1030"
                  />
                </View>
              </View>
            )}

            {modal && modal.tip === 'harita' && (
              <View style={{ maxHeight: '100%' }}>
                <Text style={stil.pBaslik} accessibilityRole="header">
                  Bölümler
                </Text>
                <Text style={[stil.listeAlt, { textAlign: 'center', marginBottom: 8 }]}>Toplam {yildizMetni(s.stats.stars || 0)}</Text>
                <ScrollView style={{ maxHeight: 420 }} contentContainerStyle={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
                  {haritaBolumleri.map((L) => {
                    const y = s.yildizlar[L] || 0;
                    const simdiki = L === s.level;
                    const tip = bolumTipi(L);
                    const tipAd = tip === 'score' ? 'puan' : tip === 'color' ? 'renk' : tip === 'special' ? 'özel taş' : 'buz';
                    return (
                      <Pressable
                        key={L}
                        onPress={() => {
                          if (mesgul.current) return;
                          cal('buton');
                          setModal(null);
                          bolumBaslat(L);
                        }}
                        accessibilityRole="button"
                        accessibilityLabel={`Bölüm ${L}, ${tipAd} hedefi, ${y ? yildizMetni(y) : 'henüz geçilmedi'}${simdiki ? ', şu an oynanan' : ''}`}
                        style={{ width: 64, alignItems: 'center', margin: 4 }}
                      >
                        <LinearGradient
                          colors={simdiki ? ['#FFE27A', '#FF9F2E'] : y ? ['#7A5CFF', '#4A35C8'] : [tema.kart, tema.kart]}
                          style={{ width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: 'rgba(255,255,255,0.5)' }}
                        >
                          <Text style={{ color: simdiki ? '#1B1030' : '#FFFFFF', fontWeight: '900', fontSize: 18 }}>{L}</Text>
                        </LinearGradient>
                        <Text style={{ color: '#FFD84D', fontSize: 12, marginTop: 2 }}>{'★'.repeat(y)}<Text style={{ color: tema.sub }}>{'☆'.repeat(3 - y)}</Text></Text>
                      </Pressable>
                    );
                  })}
                </ScrollView>
                <View style={{ flexDirection: 'row', marginTop: 10 }}>
                  <Dugme tema={tema} onPress={pencereKapat} etiket="Kapat" yazi="Kapat" />
                </View>
              </View>
            )}

            {modal && modal.tip === 'sifirla' && (
              <View>
                <Text style={stil.pBaslik} accessibilityRole="header">
                  Baştan Başla
                </Text>
                <Text style={stil.pYazi}>Bütün bölümler, yıldızlar, bonuslar, başarımlar ve istatistikler silinecek. Oyun Bölüm 1'den başlayacak. Ayarların korunur.</Text>
                <View style={[stil.satir, { marginTop: 8 }]}>
                  <Dugme tema={tema} onPress={pencereKapat} etiket="Vazgeç" yazi="Vazgeç" />
                  <Dugme
                    tema={tema}
                    onPress={() => {
                      cal('buton');
                      setModal(null);
                      g.bonuslar = { ipucu: 3, karistir: 2, bomba: 1, renk: 1, ikikat: 1 };
                      g.stats = bosIstatistik();
                      g.basarimlar = [];
                      g.yildizlar = {};
                      g.enYuksek = 1;
                      g.gunluk = gunlukSec(bugun());
                      bolumBaslat(1);
                    }}
                    etiket="Her şeyi sil ve baştan başla"
                    yazi="Baştan Başla"
                    renkler={[tema.danger, tema.danger]}
                    yaziRengi="#FFFFFF"
                  />
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
                      <View style={{ minWidth: 36, height: 36, borderRadius: 18, overflow: 'hidden' }}>
                        <LinearGradient colors={['#FFE27A', '#FFB347']} style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                          <Text style={{ color: '#1B1030', fontWeight: '900', fontSize: 17 }}>{adet}</Text>
                        </LinearGradient>
                      </View>
                    </Pressable>
                  );
                })}
                <View style={{ flexDirection: 'row', marginTop: 10 }}>
                  <Dugme tema={tema} onPress={pencereKapat} etiket="Kapat" yazi="Kapat" />
                </View>
              </ScrollView>
            )}

            {modal && modal.tip === 'ayarlar' && (
              <View style={{ maxHeight: '100%' }}>
                <Text style={stil.pBaslik} accessibilityRole="header">
                  Menü
                </Text>
                <View style={stil.sekmeCubugu} accessibilityRole="tablist">
                  {MENU_SEKMELERI.map(([id, ad], i) => {
                    const seciliSekme = ayarSekme === id;
                    return (
                      <Pressable
                        key={id}
                        onPress={() => {
                          if (seciliSekme) return;
                          cal('buton');
                          setAyarSekme(id);
                        }}
                        style={[stil.sekme, seciliSekme && { backgroundColor: tema.accent }]}
                        accessibilityRole="tab"
                        accessibilityLabel={`${ad}, ${seciliSekme ? 'seçili, ' : ''}sekme ${i + 1} / ${MENU_SEKMELERI.length}`}
                      >
                        <Text style={[stil.sekmeYazi, seciliSekme && { color: '#1B1030' }]} numberOfLines={1} adjustsFontSizeToFit>
                          {ad}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
                <ScrollView style={{ maxHeight: 400 }}>
                  {ayarSekme === 'ayarlar' && (
                    <View>
                      <MenuGrubu baslik="Ses" stil={stil}>
                        {[
                          ['ses', 'Ses efektleri'],
                          ['muzik', 'Müzik'],
                        ].map(([k, ad]) => (
                          <AnahtarSatiri key={k} ad={ad} deger={!!g.settings[k]} degistir={(v) => ayarDegistir(k, v)} stil={stil} />
                        ))}
                      </MenuGrubu>
                      <MenuGrubu baslik="Dokunuş" stil={stil}>
                        <AnahtarSatiri ad="Titreşim" deger={!!g.settings.titresim} degistir={(v) => ayarDegistir('titresim', v)} stil={stil} />
                      </MenuGrubu>
                      <MenuGrubu baslik="Görünüm" stil={stil}>
                        <View style={stil.satir}>
                          {[
                            ['koyu', 'Koyu tema'],
                            ['acik', 'Açık tema'],
                          ].map(([k, ad], i) => {
                            const secik = g.settings.tema === k;
                            return (
                              <Pressable
                                key={k}
                                onPress={() => {
                                  cal('buton');
                                  ayarDegistir('tema', k);
                                }}
                                style={[stil.sekme, { flex: 1 }, secik && { backgroundColor: tema.accent }]}
                                accessibilityRole="radio"
                                accessibilityLabel={`${ad}, seçenek ${i + 1} / 2`}
                                accessibilityState={{ checked: secik }}
                              >
                                <Text style={[stil.sekmeYazi, secik && { color: '#1B1030' }]}>{ad}</Text>
                              </Pressable>
                            );
                          })}
                        </View>
                      </MenuGrubu>
                      <MenuGrubu baslik="Oyun" stil={stil}>
                        <View style={stil.satir}>
                          <Dugme tema={tema} onPress={() => { cal('buton'); setModal({ tip: 'ogretici' }); }} etiket="Nasıl oynanır" yazi="Nasıl Oynanır" />
                          <Dugme tema={tema} onPress={() => { cal('buton'); setModal({ tip: 'sifirla' }); }} etiket="Baştan başla, bütün ilerleme silinir" yazi="Baştan Başla" />
                        </View>
                      </MenuGrubu>
                    </View>
                  )}
                  {ayarSekme === 'gorevler' && (() => {
                    const biten = g.gunluk.claimed.length;
                    return (
                      <View>
                        <MenuGrubu baslik={`Bugünün görevleri, ${biten} / ${g.gunluk.picks.length} tamamlandı`} stil={stil}>
                          <Text style={[stil.listeAlt, { marginBottom: 4 }]}>Her gün 3 yeni görev gelir. Tamamlanan her görev bir bonus kazandırır.</Text>
                          {g.gunluk.picks.map((id, i) => {
                            const gorev = GUNLUK_HAVUZ.find((x) => x.id === id);
                            if (!gorev) return null;
                            const ilerle = Math.min(gorev.hedef, g.gunluk.progress[gorev.stat] || 0);
                            const bitti = g.gunluk.claimed.includes(id);
                            return (
                              <View
                                key={id}
                                style={stil.liste}
                                accessible
                                accessibilityLabel={`${gorev.ad}, ${bitti ? 'tamamlandı' : `${ilerle} / ${gorev.hedef}`}, görev ${i + 1} / ${g.gunluk.picks.length}`}
                              >
                                <View style={{ flex: 1 }}>
                                  <Text style={stil.listeBaslik}>{gorev.ad}</Text>
                                  <View style={{ height: 6, borderRadius: 3, backgroundColor: tema.bar, marginTop: 6, overflow: 'hidden' }}>
                                    <View style={{ width: `${(ilerle / gorev.hedef) * 100}%`, height: '100%', backgroundColor: bitti ? '#3DDC84' : tema.accent }} />
                                  </View>
                                </View>
                                <Text style={[stil.listeBaslik, { color: bitti ? '#3DDC84' : tema.sub }]}>{bitti ? 'Tamam' : `${ilerle} / ${gorev.hedef}`}</Text>
                              </View>
                            );
                          })}
                        </MenuGrubu>
                      </View>
                    );
                  })()}
                  {ayarSekme === 'basarimlar' && (() => {
                    const kazanilan = BASARIMLAR.filter((b) => g.basarimlar.includes(b.id));
                    const kalan = BASARIMLAR.filter((b) => !g.basarimlar.includes(b.id));
                    const satir = (b, acik) => (
                      <View key={b.id} style={[stil.liste, { opacity: acik ? 1 : 0.6 }]} accessible accessibilityLabel={`${b.ad}, ${b.aciklama}`}>
                        <View style={{ flex: 1 }}>
                          <Text style={stil.listeBaslik}>{b.ad}</Text>
                          <Text style={stil.listeAlt}>{b.aciklama}</Text>
                        </View>
                        <Text style={[stil.listeBaslik, { color: acik ? tema.accent : tema.sub, fontSize: 22 }]}>{acik ? '★' : '☆'}</Text>
                      </View>
                    );
                    return (
                      <View>
                        <MenuGrubu baslik={`Kazanılanlar, ${kazanilan.length} / ${BASARIMLAR.length}`} stil={stil}>
                          {kazanilan.length ? kazanilan.map((b) => satir(b, true)) : <Text style={stil.listeAlt}>Henüz başarım kazanmadın.</Text>}
                        </MenuGrubu>
                        {kalan.length > 0 && (
                          <MenuGrubu baslik={`Kazanılacaklar, ${kalan.length}`} stil={stil}>
                            {kalan.map((b) => satir(b, false))}
                          </MenuGrubu>
                        )}
                      </View>
                    );
                  })()}
                  {ayarSekme === 'istatistik' && (
                    <View>
                      {[
                        ['İlerleme', [
                          ['Tamamlanan bölüm', g.stats.levelsDone],
                          ['En yüksek bölüm', g.enYuksek],
                          ['Toplam yıldız', g.stats.stars || 0],
                          ['Toplam puan', g.stats.totalScore],
                        ]],
                        ['Oyun', [
                          ['Yapılan hamle', g.stats.movesMade],
                          ['Patlatılan taş', g.stats.gems],
                          ['Kırılan buz', g.stats.iceBroken || 0],
                          ['En uzun kombo', g.stats.maxCombo],
                        ]],
                        ['Özel taşlar', [
                          ['Çizgili taş', g.stats.stripedMade],
                          ['Bomba taşı', g.stats.bombsMade],
                          ['Renk bombası', g.stats.colorBombsMade],
                        ]],
                        ['Bonuslar', [['Kullanılan bonus', g.stats.bonusesUsed]]],
                      ].map(([baslik, satirlar]) => (
                        <MenuGrubu key={baslik} baslik={baslik} stil={stil}>
                          {satirlar.map(([ad, d]) => (
                            <View key={ad} style={stil.liste} accessible accessibilityLabel={`${ad}: ${d}`}>
                              <Text style={[stil.listeBaslik, { flex: 1, fontSize: 16 }]}>{ad}</Text>
                              <Text style={[stil.listeBaslik, { color: tema.accent }]}>{d}</Text>
                            </View>
                          ))}
                        </MenuGrubu>
                      ))}
                    </View>
                  )}
                </ScrollView>
                <View style={{ flexDirection: 'row', marginTop: 10 }}>
                  <Dugme tema={tema} onPress={pencereKapat} etiket="Menüyü kapat" yazi="Kapat" />
                </View>
              </View>
            )}
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
}

function olusturStil(t) {
  return StyleSheet.create({
    ust: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8, marginBottom: 10 },
    ikonBtn: { width: 46, height: 46, borderRadius: 23, backgroundColor: t.card, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: t.cizgi },
    ikon: { fontSize: 22, color: t.text },
    baslik: { fontSize: 26, fontWeight: '900', color: t.text, textShadowColor: 'rgba(122,43,255,0.6)', textShadowRadius: 12 },
    altBaslik: { fontSize: 13, fontWeight: '800', color: t.accent, marginTop: 1 },
    satir: { flexDirection: 'row', gap: 8, marginBottom: 8 },
    kutu: { flex: 1, backgroundColor: t.card, borderRadius: 16, paddingVertical: 8, alignItems: 'center', borderWidth: 1, borderColor: t.cizgi },
    kutuEtiket: { fontSize: 12, color: t.sub, fontWeight: '600' },
    kutuDeger: { fontSize: 22, fontWeight: '900', color: t.text },
    cubuk: { height: 14, borderRadius: 10, backgroundColor: t.bar, overflow: 'hidden', marginBottom: 12 },
    tahta: { borderRadius: 18, padding: 5, alignItems: 'center', justifyContent: 'center' },
    mesaj: { color: t.sub, fontSize: 15, textAlign: 'center', minHeight: 40, marginBottom: 8 },
    perde: { flex: 1, backgroundColor: 'rgba(5,6,25,0.7)', alignItems: 'center', justifyContent: 'center', padding: 20 },
    pencere: { width: '100%', maxWidth: 440, maxHeight: '88%', backgroundColor: t.kart, borderRadius: 24, padding: 20, borderWidth: 1, borderColor: t.cizgi },
    pBaslik: { fontSize: 25, fontWeight: '900', color: t.text, textAlign: 'center', marginBottom: 12 },
    pYazi: { fontSize: 16, color: t.text, marginBottom: 10, lineHeight: 22 },
    liste: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderColor: t.cizgi, gap: 10 },
    listeBaslik: { fontSize: 17, fontWeight: '800', color: t.text },
    listeAlt: { fontSize: 13, color: t.sub, marginTop: 2 },
    sekme: { flex: 1, paddingVertical: 11, paddingHorizontal: 4, borderRadius: 12, backgroundColor: t.bar, alignItems: 'center', justifyContent: 'center' },
    sekmeCubugu: { flexDirection: 'row', gap: 6, marginBottom: 10, padding: 4, borderRadius: 16, backgroundColor: t.card },
    grup: { marginBottom: 14, padding: 12, borderRadius: 16, backgroundColor: t.card, borderWidth: 1, borderColor: t.cizgi },
    grupBaslik: { fontSize: 13, fontWeight: '900', color: t.accent, textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 4 },
    sekmeYazi: { color: t.text, fontWeight: '800' },
  });
}
