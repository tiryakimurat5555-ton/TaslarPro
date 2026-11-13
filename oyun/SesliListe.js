// Kendi kendini seslendiren liste (menüler, ayarlar, arşiv). Kayıp Okyanus'taki SesliListe'den uyarlandı.
// VoiceOver'a benzer şekilde çalışır:
//   sağa kaydır: sonraki öğe, sola kaydır: önceki öğe
//   bir öğeye dokun: o öğeyi seç ve oku (parmağını ekranda yavaşça gezdirmek de öğeleri okur)
//   ekranın herhangi bir yerine çift dokun: okunan (odaktaki) öğeyi etkinleştir
//   uzun bas: odaktaki öğeyi ve varsa açıklamasını yeniden oku
//   iki parmakla dokun: konuşmayı sustur
//   iki parmakla çift dokun: geri
// Görerek oynarken tek dokunuş öğeyi doğrudan etkinleştirir.
// VoiceOver ile oynarken aynı öğeler VoiceOver'ın kendi düğmeleri olarak çizilir (VoiceListe).
//
// Öğe: { id, etiket (yazı ya da işlev), ipucu, sec () => 'sessiz' | undefined, ikincil }
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated, Easing, Pressable, AccessibilityInfo, findNodeHandle } from 'react-native';
import { useJestler } from './jestler.js';
import * as Ses from './ses.js';
import * as Efekt from './efekt.js';

// Görünüm ayarları (Aşama 7, karar 31): yüksek kontrast ve büyük yazı. App ayarlardan değiştirir.
export const GORUNUM = { kontrast: false, buyukYazi: false };
const g_ = (ad) => [GORUNUM.kontrast ? kst[ad] : null, GORUNUM.buyukYazi ? byz[ad] : null];
export const RENK = {
  zemin: '#15171a',
  kutu: '#23281f',
  kutuIkincil: '#1b1f19',
  kutuOdak: '#3a4524',
  vurgu: '#d6c05a',
  yazi: '#f2eee2',
  soluk: '#a9ad9e',
};
export const UST_BOSLUK = 54;

const metinAl = (deger) => (typeof deger === 'function' ? deger() : deger);
const soyle = (m) => Ses.hemen(m);

// disaridanJest: true ise liste kendi dokunma katmanını kurmaz; dokunuşları dışarıdaki tek katman ref ile iletir
// (Kayıp Okyanus dalış ekranı gibi: iki üst üste dokunma katmanı menünün dokunuş almamasına yol açıyordu).
function SesliListeIc({ baslik, giris, ogeler, onGeri, rehberAcik = true, ilkOdak = 0, onOdak, ust = null, disaridanJest = false }, ref) {
  const [odak, setOdak] = useState(Math.max(0, Math.min(ilkOdak, ogeler.length - 1)));
  const odakRef = useRef(odak);
  odakRef.current = Math.max(0, Math.min(odakRef.current, ogeler.length - 1));
  const ogeRef = useRef(ogeler);
  ogeRef.current = ogeler;
  const satirlar = useRef([]);
  const listeY = useRef(0);
  const kaydirma = useRef(null);
  const kaydirmaY = useRef(0);
  const yukseklik = useRef(600);
  const [, yenile] = useState(0);
  const belir = useRef(new Animated.Value(0)).current;
  const nabiz = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.timing(belir, { toValue: 1, duration: 220, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start();
  }, []);
  useEffect(() => {
    nabiz.setValue(0.965);
    Animated.spring(nabiz, { toValue: 1, friction: 5, tension: 160, useNativeDriver: true }).start();
  }, [odak]);

  const oku = (i, onEk, ipucuyla) => {
    const oge = ogeRef.current[i];
    if (!oge) {
      if (onEk) soyle(onEk);
      return;
    }
    const n = ogeRef.current.length;
    const sira = n > 1 ? ', ' + (i + 1) + ' / ' + n : '';
    const ipucu = ipucuyla && oge.ipucu ? '. ' + metinAl(oge.ipucu) : '';
    soyle((onEk ? onEk.replace(/[.\s]+$/, '') + '. ' : '') + metinAl(oge.etiket) + sira + ipucu);
  };

  useEffect(() => {
    // Başlık değişince (yeni ekran) baştan okunur
    const z = setTimeout(() => oku(odakRef.current, [baslik, giris].filter(Boolean).join('. ')), 150);
    return () => clearTimeout(z);
  }, [baslik]);

  const gorunurYap = (i) => {
    const s = satirlar.current[i];
    if (!s || !kaydirma.current) return;
    const ust2 = kaydirmaY.current;
    const alt = ust2 + yukseklik.current;
    let y = null;
    if (s.y < ust2 + 10) y = Math.max(0, s.y - 20);
    else if (s.y + s.h > alt - 10) y = Math.max(0, s.y + s.h - yukseklik.current + 40);
    if (y === null) return;
    kaydirmaY.current = y;
    kaydirma.current.scrollTo({ y, animated: false });
  };

  const odakla = (i, sesli = true) => {
    const n = ogeRef.current.length;
    if (n === 0) return;
    const yeni = Math.max(0, Math.min(n - 1, i));
    const degisti = yeni !== odakRef.current;
    odakRef.current = yeni;
    setOdak(yeni);
    gorunurYap(yeni);
    if (onOdak) onOdak(yeni);
    if (sesli) {
      if (degisti) Efekt.cal('menu_odak', 0.45);
      oku(yeni);
    }
  };

  const etkinlestir = (i) => {
    const oge = ogeRef.current[i];
    if (!oge) return;
    if (!oge.sec) {
      oku(i, null, true);
      return;
    }
    Efekt.cal(oge.id === 'geri' ? 'menu_geri' : 'menu_sec', 0.55);
    const sonuc = oge.sec();
    if (sonuc !== 'sessiz') {
      yenile((v) => v + 1);
      setTimeout(() => oku(odakRef.current), 80);
    }
  };

  const satirBul = (y) => {
    if (y < listeY.current) return -2;
    const icerikY = y - listeY.current + kaydirmaY.current;
    for (let i = 0; i < satirlar.current.length; i++) {
      const s = satirlar.current[i];
      if (s && icerikY >= s.y && icerikY <= s.y + s.h) return i;
    }
    return -1;
  };

  const kenar = () => {
    Efekt.cal('menu_sinir', 0.45);
    oku(odakRef.current);
  };

  const isleyiciler = {
    onKaydir: (yon, parmak) => {
      if (parmak >= 2) return;
      const n = ogeRef.current.length;
      if (yon === 'sag') {
        if (odakRef.current >= n - 1) kenar();
        else odakla(odakRef.current + 1);
      } else if (yon === 'sol') {
        if (odakRef.current <= 0) kenar();
        else odakla(odakRef.current - 1);
      } else if (yon === 'yukari') {
        // Hızlı atlama: ilk satır
        if (odakRef.current === 0) kenar();
        else odakla(0);
      } else if (yon === 'asagi') {
        // Hızlı atlama: son satır (çoğunlukla Geri)
        if (odakRef.current === n - 1) kenar();
        else odakla(n - 1);
      }
    },
    onSurukle: (mod, dx, dy, bilgi) => {
      if (mod !== 'tek' || bilgi.sure < 450) return;
      const i = satirBul(bilgi.y);
      if (i >= 0 && i !== odakRef.current) odakla(i);
    },
    onDokun: (parmak, konum) => {
      if (parmak >= 2) {
        Ses.sus();
        return;
      }
      const i = satirBul(konum.y);
      if (i === -2) {
        soyle([baslik, giris].filter(Boolean).join('. '));
        return;
      }
      if (i < 0) return;
      if (!rehberAcik) {
        odakla(i, false);
        etkinlestir(i);
      } else odakla(i);
    },
    onCiftDokun: (parmak) => {
      if (parmak >= 2) {
        if (onGeri) {
          Efekt.cal('menu_geri', 0.55);
          onGeri();
        } else soyle('Bu ekrandan geri dönülmez.');
        return;
      }
      etkinlestir(odakRef.current);
    },
    onUzunBas: () => oku(odakRef.current, null, true),
  };
  const isleyiciRef = useRef(isleyiciler);
  isleyiciRef.current = isleyiciler;
  const jest = useJestler(isleyiciler, { dokunmaBekle: true });
  useImperativeHandle(ref, () => ({
    kaydir: (yon, parmak) => isleyiciRef.current.onKaydir(yon, parmak),
    surukle: (mod, dx, dy, bilgi) => isleyiciRef.current.onSurukle(mod, dx, dy, bilgi),
    dokun: (parmak, konum) => isleyiciRef.current.onDokun(parmak, konum),
    ciftDokun: (parmak) => isleyiciRef.current.onCiftDokun(parmak),
    uzunBas: (konum) => isleyiciRef.current.onUzunBas(konum),
  }));

  return (
    <Animated.View style={[st.kap, ...g_('kap'), { opacity: belir, transform: [{ translateY: belir.interpolate({ inputRange: [0, 1], outputRange: [10, 0] }) }] }]}>
      {ust}
      {baslik ? <Text style={[st.baslik, ...g_('baslik')]}>{baslik}</Text> : null}
      {giris ? <Text style={[st.giris, ...g_('giris')]}>{giris}</Text> : null}
      <View
        style={st.liste}
        onLayout={(e) => {
          listeY.current = e.nativeEvent.layout.y;
          yukseklik.current = e.nativeEvent.layout.height;
        }}
      >
        <ScrollView
          ref={kaydirma}
          scrollEnabled={false}
          contentContainerStyle={st.icerik}
          onScroll={(e) => {
            kaydirmaY.current = e.nativeEvent.contentOffset.y;
          }}
          scrollEventThrottle={32}
        >
          {ogeler.map((oge, i) => (
            <Animated.View
              key={oge.id || String(i)}
              onLayout={(e) => {
                const { y, height } = e.nativeEvent.layout;
                satirlar.current[i] = { y, h: height };
              }}
              style={[st.satir, ...g_('satir'), oge.ikincil && st.ikincil, ...(oge.ikincil ? g_('ikincil') : []), i === odak && st.odakli, ...(i === odak ? g_('odakli') : []), i === odak && { transform: [{ scale: nabiz }] }]}
            >
              <Text style={[st.satirYazi, ...g_('satirYazi'), i === odak && st.odakliYazi, ...(i === odak ? g_('odakliYazi') : [])]}>{metinAl(oge.etiket)}</Text>
            </Animated.View>
          ))}
        </ScrollView>
      </View>
      {disaridanJest ? null : <View style={StyleSheet.absoluteFill} {...jest} accessible={false} />}
    </Animated.View>
  );
}
const SesliListeRef = forwardRef(SesliListeIc);

// VoiceOver ile oynarken: aynı öğeler VoiceOver'ın kendi düğmeleri; Z hareketi (geri kaçış) geri götürür
// Liste açılınca VoiceOver odağı listeye taşınır (yoksa odak kapanan ekranda kalır, listeye gidilemez):
// alt menüden dönülünce onu açan satıra, yoksa başlığa.
function VoiceListe({ baslik, giris, ogeler, onGeri, ilkOdak = 0, onOdak }) {
  const [, yenile] = useState(0);
  const baslikRef = useRef(null);
  const satirRef = useRef([]);
  useEffect(() => {
    const odakla = () => {
      const hedef = (ilkOdak > 0 && satirRef.current[ilkOdak]) || baslikRef.current || satirRef.current[0];
      const n = hedef && findNodeHandle(hedef);
      if (n) AccessibilityInfo.setAccessibilityFocus(n);
    };
    // VoiceOver ekran değişimini işledikten sonra odaklanmak için iki deneme
    const z1 = setTimeout(odakla, 250);
    const z2 = setTimeout(odakla, 700);
    return () => {
      clearTimeout(z1);
      clearTimeout(z2);
    };
  }, []);
  return (
    <View style={[st.kap, ...g_('kap')]} accessibilityViewIsModal onAccessibilityEscape={onGeri}>
      {baslik ? (
        <Text ref={baslikRef} style={st.baslik} accessibilityRole="header">
          {baslik}
        </Text>
      ) : null}
      {giris ? <Text style={st.giris}>{giris}</Text> : null}
      <ScrollView contentContainerStyle={st.icerik}>
        {ogeler.map((oge, i) =>
          oge.sec ? (
            <Pressable
              key={oge.id || String(i)}
              ref={(r) => (satirRef.current[i] = r)}
              accessibilityRole="button"
              accessibilityLabel={metinAl(oge.etiket)}
              accessibilityHint={oge.ipucu ? metinAl(oge.ipucu) : undefined}
              onPress={() => {
                if (onOdak) onOdak(i);
                oge.sec();
                yenile((v) => v + 1);
              }}
              style={({ pressed }) => [st.satir, ...g_('satir'), oge.ikincil && st.ikincil, pressed && st.odakli, ...(pressed ? g_('odakli') : [])]}
            >
              <Text style={[st.satirYazi, ...g_('satirYazi')]}>{metinAl(oge.etiket)}</Text>
            </Pressable>
          ) : (
            <View key={oge.id || String(i)} ref={(r) => (satirRef.current[i] = r)} style={[st.satir, ...g_('satir'), st.ikincil, ...g_('ikincil')]} accessible accessibilityLabel={metinAl(oge.etiket) + (oge.ipucu ? '. ' + metinAl(oge.ipucu) : '')}>
              <Text style={[st.satirYazi, ...g_('satirYazi')]}>{metinAl(oge.etiket)}</Text>
            </View>
          )
        )}
      </ScrollView>
    </View>
  );
}

// kip: 'kendi' | 'gorerek' | 'voiceover'
export const Liste = forwardRef(function Liste(p, ref) {
  // Denemeler için: son çizilen liste (menü taraması, araclar/web-deneme/menu-tara.cjs)
  globalThis.__sonListe = { baslik: p.baslik, giris: p.giris, ogeler: p.ogeler };
  if (p.kip === 'voiceover') return <VoiceListe {...p} />;
  return <SesliListeRef ref={ref} {...p} rehberAcik={p.kip !== 'gorerek'} />;
});

// Alt menü yığını (Kayıp Okyanus menuYigini): alt menüden geri dönülünce odak onu açan satıra döner.
export function useMenuYigini(baslangic = []) {
  const [yol, setYol] = useState(baslangic);
  const odaklar = useRef({});
  return {
    yol,
    ust: yol.length ? yol[yol.length - 1] : null,
    ac: (id) => {
      odaklar.current[id] = 0;
      setYol((y) => [...y, id]);
    },
    geri: () => setYol((y) => y.slice(0, -1)),
    kapat: () => setYol([]),
    odak: (anahtar) => ({
      ilkOdak: odaklar.current[anahtar] || 0,
      onOdak: (i) => {
        odaklar.current[anahtar] = i;
      },
    }),
  };
}

export function altMenu(id, etiket, ac, ipucu) {
  return { id, etiket, alt: true, ipucu: ipucu || 'Alt menü. Açmak için seç; geri dönmek için iki parmakla çift dokun.', sec: () => (ac(id), 'sessiz') };
}

// Uzun listeyi sayfa alt menülerine böler (Kayıp Okyanus sayfali)
export function sayfali(anahtar, ogeler, menu, boyut = 12) {
  if (ogeler.length <= boyut + 4) return { ogeler, sayfa: null };
  const s = [];
  for (let i = 0; i < ogeler.length; i += boyut) s.push({ bas: i + 1, son: Math.min(ogeler.length, i + boyut), ogeler: ogeler.slice(i, i + boyut) });
  const ad = (o) => String(metinAl(o.etiket)).split(/[,:.]/)[0].trim().slice(0, 32);
  const satirlar = s.map((p, i) => altMenu(anahtar + '~' + i, p.bas + '-' + p.son + ': ' + ad(p.ogeler[0]) + ' ile ' + ad(p.ogeler[p.ogeler.length - 1]) + ' arası', menu.ac));
  let sayfa = null;
  if (menu.ust && menu.ust.startsWith(anahtar + '~')) {
    const i = Number(menu.ust.slice(anahtar.length + 1));
    if (s[i]) sayfa = { anahtar: menu.ust, baslik: s[i].bas + ' ile ' + s[i].son + ' arası', ogeler: s[i].ogeler };
  }
  return { ogeler: satirlar, sayfa };
}

const st = StyleSheet.create({
  kap: { flex: 1, paddingTop: UST_BOSLUK, backgroundColor: RENK.zemin },
  baslik: { color: RENK.yazi, fontSize: 30, fontWeight: '700', paddingHorizontal: 20, paddingTop: 8, paddingBottom: 8 },
  giris: { color: RENK.soluk, fontSize: 16, paddingHorizontal: 20, paddingBottom: 10 },
  liste: { flex: 1 },
  icerik: { paddingHorizontal: 14, paddingBottom: 80 },
  satir: {
    minHeight: 64,
    justifyContent: 'center',
    paddingHorizontal: 18,
    paddingVertical: 12,
    marginBottom: 10,
    borderRadius: 14,
    backgroundColor: RENK.kutu,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  ikincil: { backgroundColor: RENK.kutuIkincil },
  odakli: { borderColor: RENK.vurgu, backgroundColor: RENK.kutuOdak },
  satirYazi: { color: RENK.yazi, fontSize: 19, lineHeight: 25 },
  odakliYazi: { color: '#FFFFFF', fontWeight: '600' },
});

// Yüksek kontrast: siyah zemin, beyaz yazı, sarı odak
const kst = StyleSheet.create({
  kap: { backgroundColor: '#000000' },
  baslik: { color: '#FFFFFF' },
  giris: { color: '#FFFFFF' },
  satir: { backgroundColor: '#000000', borderColor: '#FFFFFF', borderWidth: 2 },
  ikincil: { backgroundColor: '#000000', borderColor: '#BBBBBB' },
  odakli: { backgroundColor: '#FFD400', borderColor: '#FFD400' },
  satirYazi: { color: '#FFFFFF' },
  odakliYazi: { color: '#000000', fontWeight: '800' },
});
// Büyük yazı
const byz = StyleSheet.create({
  baslik: { fontSize: 36 },
  giris: { fontSize: 20 },
  satir: { minHeight: 80 },
  satirYazi: { fontSize: 25, lineHeight: 32 },
});
