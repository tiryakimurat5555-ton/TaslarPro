// React Native'in en temel parcalarinin tarayicida calisan basit taklidi.
// Yalnizca deneme icin: oyunun cokup cokmedigini ve pencerelerin acildigini Playwright ile denetler.
import React from 'react';

function deger(x) {
  return x && typeof x.__al === 'function' ? x.__al() : x;
}

class AnimDeger {
  constructor(v) {
    this._v = v;
  }
  __al() {
    return this._v;
  }
  setValue(v) {
    this._v = v;
  }
  stopAnimation() {}
  interpolate(cfg) {
    return new AraDeger(this, cfg);
  }
}

function sayiVeEk(o) {
  if (typeof o === 'number') return [o, ''];
  const m = String(o).match(/^(-?[\d.]+)(.*)$/);
  return m ? [parseFloat(m[1]), m[2]] : [0, ''];
}

class AraDeger {
  constructor(kaynak, cfg) {
    this.k = kaynak;
    this.cfg = cfg;
  }
  __al() {
    const x = deger(this.k);
    const i = this.cfg.inputRange;
    const o = this.cfg.outputRange;
    let j = 0;
    while (j < i.length - 2 && x > i[j + 1]) j++;
    const t = i[j + 1] === i[j] ? 0 : Math.max(0, Math.min(1, (x - i[j]) / (i[j + 1] - i[j])));
    const [a, ek] = sayiVeEk(o[j]);
    const [b] = sayiVeEk(o[j + 1]);
    const v = a + (b - a) * t;
    return ek ? v + ek : v;
  }
  interpolate(cfg) {
    return new AraDeger(this, cfg);
  }
}

class Carpim {
  constructor(a, b) {
    this.a = a;
    this.b = b;
  }
  __al() {
    return deger(this.a) * deger(this.b);
  }
  interpolate(cfg) {
    return new AraDeger(this, cfg);
  }
}

class AnimDegerXY {
  constructor(v) {
    this.x = new AnimDeger(v.x);
    this.y = new AnimDeger(v.y);
  }
  setValue(v) {
    this.x.setValue(v.x);
    this.y.setValue(v.y);
  }
}

// Canlandirma degerleri degisince Animated bilesenleri yeniden cizilsin
const dinleyiciler = new Set();
let yayinBekliyor = false;
function yay() {
  if (yayinBekliyor) return;
  yayinBekliyor = true;
  setTimeout(() => {
    yayinBekliyor = false;
    dinleyiciler.forEach((f) => f());
  }, 0);
}
function useYenile() {
  const [, set] = React.useReducer((x) => x + 1, 0);
  React.useEffect(() => {
    dinleyiciler.add(set);
    return () => dinleyiciler.delete(set);
  }, []);
}

function anim(fn) {
  return {
    start(cb) {
      fn();
      yay();
      setTimeout(() => cb && cb({ finished: true }), 0);
    },
    stop() {},
  };
}

function hedefAta(v, to) {
  if (v instanceof AnimDegerXY) v.setValue(to);
  else v.setValue(to);
}

const Animated = {
  Value: AnimDeger,
  ValueXY: AnimDegerXY,
  multiply: (a, b) => new Carpim(a, b),
  timing: (v, cfg) => anim(() => hedefAta(v, cfg.toValue)),
  spring: (v, cfg) => anim(() => hedefAta(v, cfg.toValue)),
  delay: () => anim(() => {}),
  sequence: (list) => ({
    start(cb) {
      let i = 0;
      const ileri = () => {
        if (i >= list.length) return cb && cb({ finished: true });
        list[i++].start(ileri);
      };
      ileri();
    },
    stop() {},
  }),
  parallel: (list) => ({
    start(cb) {
      if (!list.length) return setTimeout(() => cb && cb({ finished: true }), 0);
      let kalan = list.length;
      list.forEach((a) => a.start(() => --kalan === 0 && cb && cb({ finished: true })));
    },
    stop() {},
  }),
  loop: () => ({ start() {}, stop() {} }),
};

const kimlik = (t) => t;
const Easing = {
  linear: kimlik,
  quad: kimlik,
  cubic: kimlik,
  sin: kimlik,
  bounce: kimlik,
  back: () => kimlik,
  in: () => kimlik,
  out: () => kimlik,
  inOut: () => kimlik,
};

function duzlestir(st) {
  if (!st) return {};
  if (Array.isArray(st)) return Object.assign({}, ...st.map(duzlestir));
  return st;
}

const PX = new Set(['opacity', 'flex', 'fontWeight', 'zIndex', 'lineHeight', 'flexGrow', 'flexShrink']);
function css(st, kutu) {
  const s = duzlestir(st);
  const o = kutu ? { display: 'flex', flexDirection: 'column', position: 'relative', boxSizing: 'border-box', flexShrink: 0 } : {};
  for (const [k, v0] of Object.entries(s)) {
    let v = deger(v0);
    if (k === 'transform') {
      o.transform = (v || [])
        .map((t) => {
          const [ad, d0] = Object.entries(t)[0];
          const d = deger(d0);
          if (ad.startsWith('translate')) return `${ad}(${d}px)`;
          return `${ad}(${d})`;
        })
        .join(' ');
      continue;
    }
    if (k.startsWith('textShadow') || k.startsWith('shadow')) continue;
    if (k === 'paddingVertical') {
      o.paddingTop = o.paddingBottom = v;
      continue;
    }
    if (k === 'paddingHorizontal') {
      o.paddingLeft = o.paddingRight = v;
      continue;
    }
    if (k === 'marginVertical') {
      o.marginTop = o.marginBottom = v;
      continue;
    }
    if (k === 'marginHorizontal') {
      o.marginLeft = o.marginRight = v;
      continue;
    }
    if (k === 'flex' && typeof v === 'number') {
      o.flex = `${v} ${v} 0%`;
      continue;
    }
    if (k === 'lineHeight' && typeof v === 'number') {
      o.lineHeight = v + 'px';
      continue;
    }
    o[k] = v;
  }
  if (o.borderWidth || o.borderBottomWidth || o.borderTopWidth) o.borderStyle = 'solid';
  return o;
}

function erisim(p) {
  const a = {};
  if (p.accessibilityLabel) a['aria-label'] = p.accessibilityLabel;
  if (p.accessibilityRole) a['data-rol'] = p.accessibilityRole;
  if (p.accessibilityState) a['data-durum'] = JSON.stringify(p.accessibilityState);
  if (p.accessibilityElementsHidden) a['aria-hidden'] = 'true';
  if (p.accessibilityActions) a['data-eylemler'] = p.accessibilityActions.map((x) => x.name).join(',');
  return a;
}

function dokunma(p) {
  return p.pointerEvents === 'none' ? { pointerEvents: 'none' } : {};
}

function panOlaylari(p) {
  const cfg = p.__pan;
  if (!cfg) return {};
  return {
    onMouseDown: (e) => {
      const r = e.currentTarget.getBoundingClientRect();
      const x0 = e.clientX;
      const y0 = e.clientY;
      if (cfg.onStartShouldSetPanResponder && !cfg.onStartShouldSetPanResponder()) return;
      const parmak = window.__parmak || 1;
      const ne = { locationX: x0 - r.left, locationY: y0 - r.top, pageX: x0, pageY: y0, touches: new Array(parmak).fill({}) };
      cfg.onPanResponderGrant && cfg.onPanResponderGrant({ nativeEvent: ne });
      let son = { dx: 0, dy: 0, numberActiveTouches: parmak };
      const tasi = (m) => {
        son = { dx: m.clientX - x0, dy: m.clientY - y0, numberActiveTouches: parmak };
        cfg.onPanResponderMove && cfg.onPanResponderMove({ nativeEvent: {} }, son);
      };
      const birak = () => {
        window.removeEventListener('mousemove', tasi);
        window.removeEventListener('mouseup', birak);
        cfg.onPanResponderRelease && cfg.onPanResponderRelease({ nativeEvent: {} }, son);
      };
      window.addEventListener('mousemove', tasi);
      window.addEventListener('mouseup', birak);
    },
  };
}

const View = React.forwardRef(function View(p, ref) {
  return (
    <div ref={ref} style={{ ...css(p.style, true), ...dokunma(p) }} {...erisim(p)} {...panOlaylari(p)}>
      {p.children}
    </div>
  );
});

const Text = React.forwardRef(function Text(p, ref) {
  return (
    <span ref={ref} style={{ display: 'block', whiteSpace: 'pre-wrap', ...css(p.style), ...dokunma(p) }} {...erisim(p)}>
      {p.children}
    </span>
  );
});

// Eylemler (VoiceOver ozel eylemleri) denemede pencereden cagrilabilsin
let eylemSayac = 0;
const Pressable = React.forwardRef(function Pressable(p, ref) {
  const id = React.useMemo(() => 'p' + eylemSayac++, []);
  if (p.onAccessibilityAction) {
    window.__eylemler = window.__eylemler || {};
    window.__eylemler[id] = p.onAccessibilityAction;
  }
  return (
    <div
      ref={ref}
      data-dugme={id}
      onClick={() => p.onPress && p.onPress()}
      onMouseDown={() => p.onPressIn && p.onPressIn()}
      onMouseUp={() => p.onPressOut && p.onPressOut()}
      style={{ cursor: 'pointer', ...css(typeof p.style === 'function' ? p.style({}) : p.style, true) }}
      {...erisim(p)}
    >
      {p.children}
    </div>
  );
});

const ScrollView = React.forwardRef(function ScrollView(p, ref) {
  const dis = React.useRef(null);
  React.useImperativeHandle(ref, () => ({
    scrollTo: ({ y }) => {
      if (dis.current) dis.current.scrollTop = y;
    },
  }));
  return (
    <div
      ref={dis}
      onScroll={(e) => p.onScroll && p.onScroll({ nativeEvent: { contentOffset: { y: e.currentTarget.scrollTop } } })}
      style={{ ...css(p.style, true), overflow: 'auto', flexShrink: 1, minHeight: 0 }}
    >
      <div style={css(p.contentContainerStyle, true)}>{p.children}</div>
    </div>
  );
});
const Dimensions = { get: () => ({ width: window.innerWidth, height: window.innerHeight }) };

function Modal(p) {
  if (!p.visible) return null;
  return <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex' }}>{p.children}</div>;
}

function Switch(p) {
  return <input type="checkbox" checked={!!p.value} onChange={(e) => p.onValueChange && p.onValueChange(e.target.checked)} />;
}

function AnimatedView(p) {
  useYenile();
  return <View {...p} />;
}
function AnimatedText(p) {
  useYenile();
  return <Text {...p} />;
}
Animated.View = AnimatedView;
Animated.Text = AnimatedText;

const StyleSheet = {
  create: (x) => x,
  absoluteFill: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 },
  absoluteFillObject: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 },
};

const PanResponder = { create: (cfg) => ({ panHandlers: { __pan: cfg } }) };
const AppState = { addEventListener: () => ({ remove() {} }) };
const Platform = { OS: 'ios' };
function TextInput(p) {
  return <input aria-label={p.accessibilityLabel} placeholder={p.placeholder} value={p.value} onChange={(e) => p.onChangeText && p.onChangeText(e.target.value)} style={css(p.style)} />;
}

window.__duyurular = [];
const AccessibilityInfo = {
  announceForAccessibility: (m) => window.__duyurular.push(m),
  isReduceMotionEnabled: async () => false,
  isScreenReaderEnabled: async () => !!window.__voiceover,
};

function useWindowDimensions() {
  return { width: 390, height: 844 };
}

export { View, Text, Pressable, StyleSheet, Animated, Easing, Modal, ScrollView, Switch, AccessibilityInfo, useWindowDimensions, PanResponder, AppState, Platform, TextInput, Dimensions };
