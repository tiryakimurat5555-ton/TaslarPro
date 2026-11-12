// Expo modullerinin deneme taklitleri
import React, { useEffect, useRef } from 'react';

export function LinearGradient(p) {
  const renk = (p.colors || []).join(', ');
  const st = Array.isArray(p.style) ? Object.assign({}, ...p.style.filter(Boolean)) : p.style || {};
  const o = { display: 'flex', flexDirection: 'column', position: 'relative', boxSizing: 'border-box', background: `linear-gradient(135deg, ${renk})` };
  for (const [k, v] of Object.entries(st)) {
    if (k === 'paddingVertical') o.paddingTop = o.paddingBottom = v;
    else if (k === 'paddingHorizontal') o.paddingLeft = o.paddingRight = v;
    else if (k === 'flex' && typeof v === 'number') o.flex = `${v} ${v} 0%`;
    else o[k] = v;
  }
  if (o.borderWidth) o.borderStyle = 'solid';
  return <div style={o}>{p.children}</div>;
}

window.__sesler = [];
export function setAudioModeAsyncX() {}
export function createAudioPlayer(kaynak) {
  return {
    loop: false,
    volume: 1,
    play() {
      window.__sesler.push(typeof kaynak === 'string' ? kaynak.replace(/^.*\//, '').replace('.mp3', '') : kaynak && kaynak.ad);
    },
    pause() {},
    seekTo() {},
    release() {},
    addListener() { return { remove() {} }; },
    playing: false,
    duration: 1,
  };
}
export async function setAudioModeAsync() {}
export async function setIsAudioActiveAsync() {}

export function impactAsync() {}
export function notificationAsync() {}
export const ImpactFeedbackStyle = { Light: 'l', Medium: 'm', Heavy: 'h' };
export const NotificationFeedbackType = { Error: 'e', Success: 's' };

export function StatusBar() {
  return null;
}

export function SafeAreaProvider(p) {
  return <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>{p.children}</div>;
}
// iPhone'daki gibi kenar boşlukları (çentik ve alt çubuk)
export const useSafeAreaInsets = () => ({ top: 47, bottom: 34, left: 0, right: 0 });
export function SafeAreaView(p) {
  return <div style={{ display: 'flex', flexDirection: 'column', flex: '1 1 0%', overflow: 'auto' }}>{p.children}</div>;
}

const AsyncStorage = {
  getItem: async (k) => localStorage.getItem(k),
  setItem: async (k, v) => localStorage.setItem(k, v),
  removeItem: async (k) => localStorage.removeItem(k),
};
export default AsyncStorage;

// expo-gl: tarayıcıdaki gerçek WebGL tuvali
export function GLView(p) {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current;
    c.width = c.clientWidth;
    c.height = c.clientHeight;
    const gl = c.getContext('webgl2');
    if (!gl) return;
    gl.endFrameEXP = () => {};
    p.onContextCreate && p.onContextCreate(gl);
  }, []);
  return <canvas ref={ref} style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} />;
}

// expo-speech: söylenenler pencereye yazılır
window.__konusmalar = [];
export function speak(metin, o) {
  window.__konusmalar.push(metin);
  setTimeout(() => o && o.onDone && o.onDone(), Math.min(1500, 200 + metin.length * 10));
}
export function stop() {}
export async function getAvailableVoicesAsync() {
  return [{ identifier: 'tr-deneme', language: 'tr-TR', quality: 'Default' }];
}

// expo-screen-orientation
export const OrientationLock = { LANDSCAPE: 'yatay', PORTRAIT_UP: 'dikey' };
export async function lockAsync() {}
