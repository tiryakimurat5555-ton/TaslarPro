// Expo modullerinin deneme taklitleri
import React from 'react';

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
export function createAudioPlayer(kaynak) {
  return {
    loop: false,
    volume: 1,
    play() {
      window.__sesler.push(kaynak && kaynak.ad);
    },
    pause() {},
    seekTo() {},
    release() {},
  };
}
export async function setAudioModeAsync() {}

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
export function SafeAreaView(p) {
  return <div style={{ display: 'flex', flexDirection: 'column', flex: '1 1 0%', overflow: 'auto' }}>{p.children}</div>;
}

const AsyncStorage = {
  getItem: async (k) => localStorage.getItem(k),
  setItem: async (k, v) => localStorage.setItem(k, v),
};
export default AsyncStorage;
