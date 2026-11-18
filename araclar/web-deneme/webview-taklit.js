// Tarayıcı denemesi için react-native-webview, expo-asset ve expo-file-system taklidi.
// WebView: gizli bir iframe (srcdoc); injectJavaScript iframe'in penceresinde çalışır, ReactNativeWebView.postMessage onMessage'e gelir.
// window.__webviewYok = true ise WebView hiç kurulmaz (eski ses yoluna düşmeyi denemek için).
import React from 'react';

export class WebView extends React.Component {
  constructor(p) {
    super(p);
    this.cerceve = null;
  }
  injectJavaScript(kod) {
    try {
      const w = this.cerceve && this.cerceve.contentWindow;
      if (w) w.eval(kod);
    } catch (e) {
      console.warn('webview taklidi', e);
    }
  }
  reload() {
    if (this.cerceve) this.cerceve.srcdoc = this.props.source.html;
  }
  render() {
    if (typeof window !== 'undefined' && window.__webviewYok) return null;
    return React.createElement('iframe', {
      ref: (r) => {
        this.cerceve = r;
        if (r && !r.__kuruldu) {
          r.__kuruldu = true;
          r.addEventListener('load', () => {
            const w = r.contentWindow;
            w.ReactNativeWebView = { postMessage: (v) => this.props.onMessage && this.props.onMessage({ nativeEvent: { data: v } }) };
          });
        }
      },
      srcDoc: (this.props.source && this.props.source.html || '').replace('<script>', '<script>window.ReactNativeWebView = window.ReactNativeWebView || { postMessage: function(v){ parent.__webviewMesaj && parent.__webviewMesaj(v); } };'),
      style: { width: 2, height: 2, border: 0, opacity: 0 },
      allow: 'autoplay',
    });
  }
  componentDidMount() {
    // iframe yüklenmeden önce gelen ilk mesaj için yedek kanal
    window.__webviewMesaj = (v) => this.props.onMessage && this.props.onMessage({ nativeEvent: { data: v } });
  }
}
export default WebView;

export const Asset = {
  fromModule(u) {
    return { uri: u, localUri: u, async downloadAsync() {} };
  },
};
export class File {
  constructor(u) {
    this.u = u;
  }
  async base64() {
    // file:// sayfada fetch çalışmaz (telefonda okunamayan dosya gibi davranır; eski ses yoluna düşüş denenir)
    if (location.protocol === 'file:') throw new Error('dosya okunamadı (file://)');
    const b = new Uint8Array(await (await fetch(this.u)).arrayBuffer());
    let s = '';
    for (let i = 0; i < b.length; i += 0x8000) s += String.fromCharCode.apply(null, b.subarray(i, i + 0x8000));
    window.__okunanSes = (window.__okunanSes || 0) + 1;
    return btoa(s);
  }
}
export async function readAsStringAsync(u) {
  return new File(u).base64();
}
