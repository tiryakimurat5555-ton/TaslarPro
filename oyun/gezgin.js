// ==== SESLİ GEZGİN: oyunun kendi ekran okuyucusu ====
// VoiceOver kapalıyken, VoiceOver hareketleriyle aynı şekilde çalışır:
//   Bir parmakla dokun ya da parmağını gezdir  → altındaki öğeyi seçer ve okur
//   Sağa / sola hızlı kaydır                   → sonraki / önceki öğe
//   Herhangi bir yere iki kez dokun            → seçili öğeyi çalıştırır
//   İki parmakla dokun                          → konuşmayı susturur
//   İki parmakla iki kez dokun                  → sihirli eylem (oyunda: Saldır)
//   Üç parmakla yukarı / aşağı kaydır           → sayfayı kaydırır
// "Doğrudan" alanlarda (hareket alanı) dokunuşlar alana geçer; orada parmakla yürünür.
import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, ScrollView, PanResponder, StyleSheet, Dimensions } from 'react-native';
import * as Ses from './ses.js';

const GezginBaglam = createContext(null);
const KatmanBaglam = createContext(0);
let kimlikSayac = 1;
let ipucuSayac = 0;

function cocuklardanMetin(c) {
  let m = '';
  React.Children.forEach(c, (x) => {
    if (x === null || x === undefined || x === false) return;
    if (typeof x === 'string' || typeof x === 'number') m += x;
    else if (x.props && x.props.children !== undefined) m += cocuklardanMetin(x.props.children);
  });
  return m;
}

function olc(ref) {
  return new Promise((coz) => {
    const n = ref && ref.current;
    if (!n) return coz(null);
    if (typeof n.measureInWindow === 'function') {
      n.measureInWindow((x, y, w, h) => coz(w || h ? { x, y, w, h } : null));
    } else if (typeof n.getBoundingClientRect === 'function') {
      const r = n.getBoundingClientRect();
      coz(r.width || r.height ? { x: r.left, y: r.top, w: r.width, h: r.height } : null);
    } else coz(null);
  });
}

export function Katman({ seviye, children }) {
  return <KatmanBaglam.Provider value={seviye}>{children}</KatmanBaglam.Provider>;
}

// Bir öğeyi gezgine kaydeder. bilgi: { etiket, ipucu, tur, etkin, devre, dogrudan }
export function useOdak(ref, bilgi) {
  const g = useContext(GezginBaglam);
  const katman = useContext(KatmanBaglam);
  const id = useMemo(() => 'o' + kimlikSayac++, []);
  const son = useRef(bilgi);
  son.current = bilgi;
  useEffect(() => {
    if (!g) return;
    g.kaydet(id, { ref, katman, bilgi: () => son.current });
    return () => g.sil(id);
  }, [g, katman]);
  return g && g.acik;
}

// Okunabilir yazı (VoiceOver'daki metin öğesi gibi)
export function Okunur({ stil, baslik, children, satirSayisi }) {
  const ref = useRef(null);
  const metin = cocuklardanMetin(children);
  useOdak(ref, { etiket: metin, tur: baslik ? 'baslik' : 'metin' });
  return (
    <Text ref={ref} style={stil} accessibilityRole={baslik ? 'header' : undefined} numberOfLines={satirSayisi}>
      {children}
    </Text>
  );
}

// Kaydırılabilir sayfa: gezgin seçili öğeyi görünür tutar, üç parmakla kaydırılır
export function Sayfa({ children, ...p }) {
  const g = useContext(GezginBaglam);
  const ref = useRef(null);
  const ofset = useRef(0);
  useEffect(() => {
    if (!g) return;
    const k = { ref, ofset };
    g.kaydiriciEkle(k);
    return () => g.kaydiriciSil(k);
  }, [g]);
  return (
    <ScrollView
      ref={ref}
      scrollEventThrottle={32}
      onScroll={(e) => {
        ofset.current = e.nativeEvent.contentOffset.y;
      }}
      {...p}
    >
      {children}
    </ScrollView>
  );
}

// Doğrudan dokunulan alan (hareket alanı). Gezgin açıkken dokunuşlar ona geçer.
export function DogrudanAlan({ etiket, basla, tasi, birak, stil, children }) {
  const ref = useRef(null);
  const el = useRef({ basla, tasi, birak });
  el.current = { basla, tasi, birak };
  const gezginAcik = useOdak(ref, { etiket, tur: 'dogrudan', dogrudan: el });
  const pan = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: (e) => el.current.basla(e.nativeEvent.locationX, e.nativeEvent.locationY),
        onPanResponderMove: (e, s) => el.current.tasi(s.dx, s.dy),
        onPanResponderRelease: () => el.current.birak(),
        onPanResponderTerminate: () => el.current.birak(),
      }),
    []
  );
  return (
    <View ref={ref} style={stil} {...(gezginAcik ? {} : pan.panHandlers)} accessible accessibilityLabel={etiket}>
      {children}
    </View>
  );
}

export function useSihirliEylem(f) {
  const g = useContext(GezginBaglam);
  const son = useRef(f);
  son.current = f;
  useEffect(() => {
    if (!g) return;
    const fn = () => son.current && son.current();
    g.sihirli.current = fn;
    return () => {
      if (g.sihirli.current === fn) g.sihirli.current = null;
    };
  }, [g]);
}

function seslendir(b, ipucuEkle) {
  let m = b.etiket || '';
  if (b.tur === 'dugme') m += b.devre ? ', düğme, soluk' : ', düğme';
  else if (b.tur === 'baslik') m += ', başlık';
  else if (b.tur === 'dogrudan') m += ', doğrudan dokunma alanı';
  if (b.ipucu) m += '. ' + b.ipucu;
  if (ipucuEkle && b.tur === 'dugme' && !b.devre && ipucuSayac < 3) {
    ipucuSayac++;
    m += '. Çalıştırmak için iki kez dokun.';
  }
  return m;
}

export function Gezgin({ acik, children, titresim }) {
  const kayit = useRef(new Map());
  const kutular = useRef(new Map()); // id -> rect
  const kaydiricilar = useRef([]);
  const sihirli = useRef(null);
  const odak = useRef(null);
  const [odakKutu, setOdakKutu] = useState(null);
  const acikRef = useRef(acik);
  acikRef.current = acik;

  const api = useMemo(
    () => ({
      acik,
      sihirli,
      kaydet: (id, k) => kayit.current.set(id, k),
      sil: (id) => {
        kayit.current.delete(id);
        kutular.current.delete(id);
        if (odak.current === id) {
          odak.current = null;
          setOdakKutu(null);
        }
      },
      kaydiriciEkle: (k) => kaydiricilar.current.push(k),
      kaydiriciSil: (k) => (kaydiricilar.current = kaydiricilar.current.filter((x) => x !== k)),
    }),
    [acik]
  );

  // Öğelerin ekrandaki yerlerini düzenli ölç
  const olcHepsi = async () => {
    const isler = [];
    kayit.current.forEach((k, id) =>
      isler.push(
        olc(k.ref).then((r) => {
          if (r) kutular.current.set(id, r);
          else kutular.current.delete(id);
        })
      )
    );
    await Promise.all(isler);
    // Ekran ya da katman değişince odak yeni ekranın ilk öğesine geçer (VoiceOver gibi, sessizce)
    let ust = 0;
    kayit.current.forEach((k) => (ust = Math.max(ust, k.katman)));
    const odakKayit = odak.current && kayit.current.get(odak.current);
    if (!odakKayit || odakKayit.katman !== ust) {
      const l = gezilebilir().filter((o) => o.ekranda);
      odak.current = l.length ? l[0].id : null;
    }
    setOdakKutu(odak.current ? kutular.current.get(odak.current) || null : null);
  };
  useEffect(() => {
    if (!acik) {
      setOdakKutu(null);
      return;
    }
    olcHepsi();
    const t = setInterval(olcHepsi, 400);
    return () => clearInterval(t);
  }, [acik]);

  const gezilebilir = () => {
    let ust = 0;
    kayit.current.forEach((k) => (ust = Math.max(ust, k.katman)));
    const ekranY = Dimensions.get('window').height;
    const l = [];
    kayit.current.forEach((k, id) => {
      const r = kutular.current.get(id);
      if (k.katman !== ust || !r) return;
      const b = k.bilgi();
      if (!b || !b.etiket) return;
      l.push({ id, r, b, ekranda: r.y + r.h > 0 && r.y < ekranY });
    });
    l.sort((a, b) => (Math.abs(a.r.y - b.r.y) > 12 ? a.r.y - b.r.y : a.r.x - b.r.x));
    return l;
  };

  globalThis.__gezginListe = () => gezilebilir().map((o) => `${o.b.etiket.slice(0, 20)}@${Math.round(o.r.y)}k${kayit.current.get(o.id).katman}`);
  globalThis.__gezginOdak = () => {
    const k = odak.current && kayit.current.get(odak.current);
    return k ? k.bilgi().etiket : null;
  };

  const altindaki = (x, y) => {
    const l = gezilebilir().filter((o) => o.ekranda && x >= o.r.x && x <= o.r.x + o.r.w && y >= o.r.y && y <= o.r.y + o.r.h);
    // İç içe öğelerde en küçük olanı seç
    l.sort((a, b) => a.r.w * a.r.h - b.r.w * b.r.h);
    return l[0] || null;
  };

  const odakla = (o, ipucu) => {
    if (!o) return;
    odak.current = o.id;
    setOdakKutu(o.r);
    Ses.hemen(seslendir(o.b, ipucu));
    gorunurYap(o);
  };

  const gorunurYap = (o) => {
    const H = Dimensions.get('window').height;
    if (o.r.y > 70 && o.r.y + o.r.h < H - 40) return;
    const k = kaydiricilar.current[kaydiricilar.current.length - 1];
    if (!k || !k.ref.current || !k.ref.current.scrollTo) return;
    const yeni = Math.max(0, k.ofset.current + o.r.y - H / 3);
    k.ref.current.scrollTo({ y: yeni, animated: false });
    k.ofset.current = yeni;
    setTimeout(olcHepsi, 60);
  };

  const sayfaKaydir = (yon) => {
    const k = kaydiricilar.current[kaydiricilar.current.length - 1];
    if (!k || !k.ref.current || !k.ref.current.scrollTo) {
      Ses.hemen('Kaydırılacak sayfa yok.');
      return;
    }
    const H = Dimensions.get('window').height;
    const yeni = Math.max(0, k.ofset.current + yon * H * 0.7);
    k.ref.current.scrollTo({ y: yeni, animated: false });
    k.ofset.current = yeni;
    Ses.hemen(yon > 0 ? 'Sayfa aşağı kaydı.' : 'Sayfa yukarı kaydı.');
    setTimeout(olcHepsi, 60);
  };

  const sirayla = (yon) => {
    const l = gezilebilir();
    if (!l.length) return;
    let i = l.findIndex((o) => o.id === odak.current);
    if (i < 0) i = yon > 0 ? -1 : l.length;
    const j = i + yon;
    if (j < 0 || j >= l.length) {
      Ses.hemen(yon > 0 ? 'Son öğe.' : 'İlk öğe.');
      return;
    }
    odakla(l[j], true);
  };

  const etkinlestir = () => {
    const k = odak.current && kayit.current.get(odak.current);
    if (!k) {
      Ses.hemen('Seçili öğe yok. Parmağını ekranda gezdir ya da sağa kaydır.');
      return;
    }
    const b = k.bilgi();
    if (b.tur !== 'dugme') {
      Ses.hemen(b.etiket);
      return;
    }
    if (b.devre) {
      Ses.hemen(`${b.etiket}, şu an kullanılamaz.`);
      return;
    }
    if (titresim) titresim();
    b.etkin && b.etkin();
  };

  const durum = useRef({});
  const pan = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => acikRef.current,
        onMoveShouldSetPanResponder: () => acikRef.current,
        onPanResponderTerminationRequest: () => false,
        onPanResponderGrant: (e) => {
          const n = e.nativeEvent;
          const x = n.pageX;
          const y = n.pageY;
          const d = { t0: Date.now(), x0: x, y0: y, parmak: (n.touches && n.touches.length) || 1, kip: 'bekle', dogrudan: null };
          durum.current = d;
          const o = altindaki(x, y);
          if (o && o.b.tur === 'dogrudan' && d.parmak === 1) {
            d.kip = 'dogrudan';
            d.dogrudan = o.b.dogrudan.current;
            d.dogrudan.basla(x - o.r.x, y - o.r.y);
            return;
          }
          // Parmak bir süre durursa altındakini okur (dokunarak keşif)
          d.zamanlayici = setTimeout(() => {
            if (durum.current === d && d.kip === 'bekle' && d.parmak === 1) {
              d.kip = 'kesif';
              const a = altindaki(d.x, d.y);
              if (a && a.id !== odak.current) odakla(a, true);
            }
          }, 350);
          d.x = x;
          d.y = y;
        },
        onPanResponderMove: (e, s) => {
          const d = durum.current;
          d.parmak = Math.max(d.parmak, s.numberActiveTouches || 1);
          d.x = d.x0 + s.dx;
          d.y = d.y0 + s.dy;
          if (d.kip === 'dogrudan') return d.dogrudan.tasi(s.dx, s.dy);
          const gecen = Date.now() - d.t0;
          const yol = Math.hypot(s.dx, s.dy);
          if (d.kip === 'bekle' && d.parmak === 1 && gecen > 350 && yol > 8) d.kip = 'kesif';
          if (d.kip === 'kesif') {
            const a = altindaki(d.x, d.y);
            if (a && a.id !== odak.current) odakla(a, true);
          }
        },
        onPanResponderRelease: (e, s) => {
          const d = durum.current;
          clearTimeout(d.zamanlayici);
          if (d.kip === 'dogrudan') return d.dogrudan.birak();
          const gecen = Date.now() - d.t0;
          const yol = Math.hypot(s.dx, s.dy);
          const simdi = Date.now();
          if (d.parmak >= 3 && Math.abs(s.dy) > 40) return sayfaKaydir(s.dy < 0 ? 1 : -1);
          if (d.parmak === 2 && yol < 20 && gecen < 400) {
            if (simdi - (durum.sonIkiParmak || 0) < 400) {
              durum.sonIkiParmak = 0;
              if (sihirli.current) sihirli.current();
              else Ses.hemen('Bu ekranda sihirli eylem yok.');
            } else {
              durum.sonIkiParmak = simdi;
              Ses.sus();
            }
            return;
          }
          if (d.kip === 'kesif') return;
          if (yol < 15 && gecen < 350) {
            // Dokunuş. VoiceOver gibi: tek dokunuş biraz beklenir; ikinci dokunuş gelirse seçimi DEĞİŞTİRMEDEN
            // seçili öğe çalışır. Böylece ekranın herhangi bir yerine çift dokunmak, o noktadaki öğeyi değil seçili öğeyi çalıştırır.
            const zaman = (e.nativeEvent && e.nativeEvent.timestamp) || simdi;
            const bekleyen = durum.tekDokunus;
            if (bekleyen && zaman - bekleyen.zaman < 330) {
              clearTimeout(bekleyen.zamanlayici);
              durum.tekDokunus = null;
              etkinlestir();
            } else {
              // Gecikmiş bir tek dokunuş varsa önce onu uygula
              if (bekleyen) {
                clearTimeout(bekleyen.zamanlayici);
                bekleyen.uygula();
              }
              const tx = d.x0;
              const ty = d.y0;
              const yeni = {
                zaman,
                uygula: () => {
                  if (durum.tekDokunus === yeni) durum.tekDokunus = null;
                  const a = altindaki(tx, ty);
                  if (a) odakla(a, false);
                },
              };
              yeni.zamanlayici = setTimeout(yeni.uygula, 300);
              durum.tekDokunus = yeni;
            }
            return;
          }
          if (yol > 30 && gecen < 600) {
            if (Math.abs(s.dx) > Math.abs(s.dy)) sirayla(s.dx > 0 ? 1 : -1);
            else sirayla(s.dy > 0 ? 1 : -1);
          }
        },
        onPanResponderTerminate: () => {
          const d = durum.current;
          clearTimeout(d.zamanlayici);
          if (d.kip === 'dogrudan' && d.dogrudan) d.dogrudan.birak();
        },
      }),
    []
  );

  return (
    <GezginBaglam.Provider value={api}>
      <View style={{ flex: 1 }}>
        {children}
        {acik && odakKutu && (
          <View
            pointerEvents="none"
            style={[st.odak, { left: odakKutu.x - 3, top: odakKutu.y - 3, width: odakKutu.w + 6, height: odakKutu.h + 6 }]}
          />
        )}
        {acik && <View style={StyleSheet.absoluteFill} {...pan.panHandlers} accessible={false} />}
      </View>
    </GezginBaglam.Provider>
  );
}

const st = StyleSheet.create({
  odak: { position: 'absolute', borderWidth: 3, borderColor: '#ffd34d', borderRadius: 14 },
});
