// Vahşi Topraklar — erişilebilir, kendi sesiyle konuşan 3B hayvan avı ve savaş oyunu.
// Kayıp Okyanus'un karada geçen kardeşi. Yapı: oyun/veri.js (haritalar, hayvanlar, silahlar), oyun/mantik.js (saf mantık),
// oyun/ses.js (konuşma), oyun/efekt.js (3B konumlu sesler), oyun/sahne.js (3B çizim), oyun/gezgin.js (oyunun ekran okuyucusu).
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { View, Text, Pressable, StyleSheet, TextInput, AccessibilityInfo, AppState } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { GLView } from 'expo-gl';
import * as Haptics from 'expo-haptics';
import { setAudioModeAsync, setIsAudioActiveAsync } from 'expo-audio';
import * as ScreenOrientation from 'expo-screen-orientation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Ses from './oyun/ses.js';
import * as M from './oyun/mantik.js';
import * as Efekt from './oyun/efekt.js';
import { sahneKur } from './oyun/sahne.js';
import { HAYVANLAR, HARITALAR, SILAHLAR, ZIRHLAR, YETENEKLER, IKSIR, SEVIYE_SINIRI } from './oyun/veri.js';
import { Gezgin, Katman, Okunur, Sayfa, DogrudanAlan, useOdak, useSihirliEylem } from './oyun/gezgin.js';

const OYUN_ADI = 'Vahşi Topraklar';
const AYAR_ANAHTAR = 'vahsi-ayar-v1';
const KAYIT_ANAHTAR = 'vahsi-avci-v1';
const VARSAYILAN_AYAR = { kip: null, hiz: 1.0, titresim: true, rehber: true, efekt: true, efektKis: true, ortam: true };
const ADLAR = ['Alpay', 'Tuğrul', 'Ilgaz', 'Bora', 'Ayaz', 'Aybike', 'Toygar', 'Erkut', 'Yağmur', 'Atlas', 'Selvi', 'Kaya'];

const R = {
  zemin: '#14161b',
  panel: '#1f232b',
  panel2: '#2a2f39',
  cizgi: '#3a404c',
  yazi: '#f1ede4',
  soluk: '#a8adb7',
  altin: '#e8c25a',
  can: '#d9443a',
  xp: '#8d6be8',
};

const KipBaglam = createContext('kendi');

function titret(tur, ayar) {
  if (!ayar || !ayar.titresim) return;
  try {
    if (tur === 'hafif') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    else if (tur === 'orta') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    else if (tur === 'agir') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    else if (tur === 'iyi') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    else if (tur === 'kotu') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  } catch (e) {}
}

function Dugme({ etiket, ipucu, onEtkin, stil, yaziStil, devre, children, kisa }) {
  const kip = useContext(KipBaglam);
  const ref = useRef(null);
  useOdak(ref, { etiket, ipucu, tur: 'dugme', devre: !!devre, etkin: onEtkin });
  const bas = () => {
    if (devre) {
      if (kip === 'voiceover') Ses.soyle(`${etiket}, şu an kullanılamaz.`, 3);
      return;
    }
    onEtkin && onEtkin();
  };
  return (
    <Pressable
      ref={ref}
      onPress={bas}
      accessibilityRole="button"
      accessibilityLabel={etiket}
      accessibilityHint={ipucu}
      accessibilityState={{ disabled: !!devre }}
      style={({ pressed }) => [st.dugme, stil, devre && st.dugmeDevre, pressed && st.dugmeBasili]}
    >
      {children || (
        <Text style={[st.dugmeYazi, kisa && st.dugmeYaziKisa, yaziStil]} numberOfLines={3}>
          {etiket}
        </Text>
      )}
    </Pressable>
  );
}

function Baslik({ children }) {
  return (
    <Okunur stil={st.baslik} baslik>
      {children}
    </Okunur>
  );
}

// ---------------- Kip seçimi ----------------
function KipSecim({ sec }) {
  const [vo, setVo] = useState(false);
  useEffect(() => {
    let iptal = false;
    AccessibilityInfo.isScreenReaderEnabled()
      .then((acik) => {
        if (iptal) return;
        setVo(acik);
        if (!acik) {
          Ses.ayarla({ kip: 'kendi' });
          Ses.hemen(`${OYUN_ADI}'a hoş geldin. Ekranın sol yarısına dokunursan görerek oynarsın. Sağ yarısına dokunursan oyun kendi sesiyle konuşur ve sesle oynarsın.`);
        }
      })
      .catch(() => {});
    return () => {
      iptal = true;
    };
  }, []);
  if (vo) {
    return (
      <View style={st.kipKap}>
        <Baslik>{OYUN_ADI}</Baslik>
        <Okunur stil={st.metin}>VoiceOver açık. İstersen VoiceOver ile oynayabilirsin. Oyunun kendi sesini tercih edersen önce VoiceOver'ı kapat, sonra ekranın sağ yarısına dokun.</Okunur>
        <View style={st.kipSatir}>
          <Pressable accessibilityRole="button" accessibilityLabel="VoiceOver ile oyna" onPress={() => sec('voiceover')} style={[st.kipYari, { backgroundColor: '#24324a' }]}>
            <Text style={st.kipYazi}>VoiceOver ile oyna</Text>
          </Pressable>
          <Pressable accessibilityRole="button" accessibilityLabel="Oyunun kendi sesiyle oyna" onPress={() => sec('kendi')} style={[st.kipYari, { backgroundColor: '#3a2a1c' }]}>
            <Text style={st.kipYazi}>Oyunun kendi sesiyle oyna</Text>
          </Pressable>
        </View>
      </View>
    );
  }
  return (
    <View style={{ flex: 1, flexDirection: 'row' }}>
      <Pressable accessibilityRole="button" accessibilityLabel="Görerek oyna" onPress={() => sec('gorerek')} style={[st.kipYari, { backgroundColor: '#24324a' }]}>
        <Text style={st.kipBuyuk}>{OYUN_ADI}</Text>
        <Text style={st.kipYazi}>Görerek oyna</Text>
        <Text style={st.kipAlt}>Ekranın sol yarısı</Text>
      </Pressable>
      <Pressable accessibilityRole="button" accessibilityLabel="Sesle oyna" onPress={() => sec('kendi')} style={[st.kipYari, { backgroundColor: '#3a2a1c' }]}>
        <Text style={st.kipYazi}>Sesle oyna</Text>
        <Text style={st.kipAlt}>Oyun kendi sesiyle konuşur. Ekranın sağ yarısı.</Text>
      </Pressable>
    </View>
  );
}

// ---------------- Ana menü ----------------
function AnaMenu({ kayitVar, kayitOzet, devam, yeni, ayarlar, nasil }) {
  useEffect(() => {
    Ses.soyle(`${OYUN_ADI}, ana menü. ${kayitVar ? 'Devam et, ' : ''}Yeni avcı, Nasıl oynanır, Ayarlar.`, 3);
  }, [kayitVar]);
  return (
    <Sayfa contentContainerStyle={st.sayfa}>
      <Text style={st.oyunAdi} accessibilityRole="header">
        {OYUN_ADI}
      </Text>
      <Okunur stil={st.soluk}>Beş harita, yirmi hayvan, basitten güçlüye on bir silah. Kulaklıkla oyna: hayvanları bulundukları yönden duyarsın.</Okunur>
      {kayitVar && <Dugme etiket={`Devam et: ${kayitOzet}`} onEtkin={devam} stil={st.buyukDugme} />}
      <Dugme etiket="Yeni avcı" ipucu={kayitVar ? 'Kayıtlı avcın silinir' : undefined} onEtkin={yeni} stil={st.buyukDugme} />
      <Dugme etiket="Nasıl oynanır" onEtkin={nasil} stil={st.buyukDugme} />
      <Dugme etiket="Ayarlar" onEtkin={ayarlar} stil={st.buyukDugme} />
    </Sayfa>
  );
}

const NASIL = [
  'Amaç: vahşi topraklarda hayvanlarla savaş, seviye atla, daha güçlü silahlar al ve beş haritanın liderlerini yen. Haritalar: Yeşil Orman, Kavurucu Çöl, Sisli Bataklık, Karlı Dağlar ve Altın Savan. Her biri belli bir seviyede açılır.',
  'Telefonu yatay tut. Hareket: ekranın sol altındaki hareket alanına parmağını koyup kaydır. Yukarı ileri yürür, aşağı geri gider, sağa ve sola kaydırmak o yöne döndürür.',
  'Kulaklık tak: sesler üç boyutludur. Hayvanlar bulundukları yönden ses verir; soldaki hayvan sol kulağından, sağdaki sağ kulağından duyulur, arkandakiler boğuk gelir, uzaktakiler kısık duyulur. Sana saldıranlar daha sık ses çıkarır.',
  'Savaş: Hedef düğmesi en yakın hayvanı seçer ve yerini söyler. Saldır düğmesi seni hedefe yürütür ve otomatik saldırtır. Hedef menzil dışındaysa yönünden bip sesi gelir, yaklaştıkça sıklaşır.',
  'Yönler saat gibi söylenir: saat 12 tam önün, 3 sağın, 6 arkan, 9 solun.',
  'Yetenekler: Güçlü Vuruş, Sargı, Avcı Nidası ve Kasırga. Seviye atladıkça açılır. Her biri kullanılınca bir süre bekler.',
  'Haritanın ortasında kamp var. Kampta hayvanlar sana saldırmaz ve canın hızla dolar. Kamptaki Tüccar silah, zırh ve şifa iksiri satar. Menüdeki Kampa dön, 5 saniye kıpırdamazsan seni kampa ışınlar.',
  'Her haritanın bir lideri var: Boz Ayı, Dev Kum Akrebi, Yaşlı Timsah, Kutup Ayısı ve Aslan Kral. Lidere git düğmesi seni ona yürütür. Liderler çok güçlüdür; iyi silah ve iksirle git.',
  'Etrafı tara düğmesi yakındaki hayvanları söyler. Üstteki durum çubuğuna dokununca canın, seviyen ve silahın okunur.',
  'Sesle oynarken oyun VoiceOver gibi çalışır: dokunduğun ya da parmağını gezdirdiğin öğeyi okur, sağa sola kaydırınca sonraki ve önceki öğeye geçer, ekranın herhangi bir yerine iki kez dokununca seçili öğe çalışır. İki parmakla bir kez dokunmak konuşmayı susturur, iki parmakla iki kez dokunmak saldırtır. Üç parmakla yukarı ya da aşağı kaydırmak sayfayı kaydırır.',
];

function Nasil({ geri }) {
  useEffect(() => {
    Ses.soyle('Nasıl oynanır. ' + NASIL.join(' '), 3);
  }, []);
  return (
    <Sayfa contentContainerStyle={st.sayfa}>
      <Baslik>Nasıl oynanır</Baslik>
      {NASIL.map((m, i) => (
        <Okunur key={i} stil={st.metin}>
          {m}
        </Okunur>
      ))}
      <Dugme etiket="Geri" onEtkin={geri} stil={st.buyukDugme} />
    </Sayfa>
  );
}

// ---------------- Ayarlar ----------------
function Ayarlar({ ayar, degistir, geri }) {
  const kipAdi = { kendi: 'Oyunun kendi sesi', voiceover: 'VoiceOver', gorerek: 'Görerek' };
  useEffect(() => {
    Ses.soyle(`Ayarlar. Oynama biçimi ${kipAdi[ayar.kip]}. Konuşma hızı ${Math.round(ayar.hiz * 100)}.`, 3);
  }, []);
  const hiz = (f) => {
    const h = Math.max(0.6, Math.min(1.8, Math.round((ayar.hiz + f) * 10) / 10));
    degistir({ hiz: h });
    Ses.ayarla({ hiz: h });
    Ses.hemen(`Konuşma hızı ${Math.round(h * 100)}`);
  };
  const ac = (anahtar, ad, sonra) => {
    const yeni = ayar[anahtar] === false;
    degistir({ [anahtar]: yeni });
    if (sonra) sonra(yeni);
    Ses.hemen(`${ad} ${yeni ? 'açık' : 'kapalı'}`);
  };
  const durum = (a) => (ayar[a] !== false ? 'açık' : 'kapalı');
  return (
    <Sayfa contentContainerStyle={st.sayfa}>
      <Baslik>Ayarlar</Baslik>
      <Okunur stil={st.altBaslik}>Oynama biçimi: {kipAdi[ayar.kip]}</Okunur>
      {Object.entries(kipAdi).map(([k, ad]) => (
        <Dugme
          key={k}
          etiket={`${ad}${ayar.kip === k ? ', seçili' : ''}`}
          onEtkin={() => {
            degistir({ kip: k });
            Ses.ayarla({ kip: k });
            Ses.hemen(`${ad} seçildi.`);
          }}
        />
      ))}
      <Okunur stil={st.altBaslik}>Konuşma hızı: {Math.round(ayar.hiz * 100)}</Okunur>
      <View style={st.satir}>
        <Dugme etiket="Yavaşlat" onEtkin={() => hiz(-0.1)} stil={{ flex: 1 }} />
        <Dugme etiket="Hızlandır" onEtkin={() => hiz(0.1)} stil={{ flex: 1 }} />
      </View>
      <Dugme etiket={`Titreşim: ${durum('titresim')}`} onEtkin={() => ac('titresim', 'Titreşim')} />
      <Dugme etiket={`Ses efektleri: ${durum('efekt')}`} ipucu="Hayvan, silah ve ayak sesleri" onEtkin={() => ac('efekt', 'Ses efektleri', (y) => Efekt.efektAyarla({ acik: y }))} />
      <Dugme etiket={`Ortam sesi: ${durum('ortam')}`} ipucu="Haritanın rüzgâr, kuş ve böcek sesleri" onEtkin={() => ac('ortam', 'Ortam sesi', (y) => Efekt.efektAyarla({ ortam: y ? 0.35 : 0 }))} />
      <Dugme
        etiket={`Efektleri konuşmayla karıştırma: ${durum('efektKis')}`}
        ipucu="Açıkken oyun konuşurken efekt çalmaz. Ses dalgalanmasını önler"
        onEtkin={() => ac('efektKis', 'Efektleri konuşmayla karıştırma', (y) => Efekt.efektAyarla({ kis: y }))}
      />
      <Dugme etiket={`Hedef rehberi: ${durum('rehber')}`} ipucu="Hedefe yürürken yönünü ve uzaklığını aralıklarla söyler" onEtkin={() => ac('rehber', 'Hedef rehberi')} />
      <Dugme etiket="Geri" onEtkin={geri} stil={st.buyukDugme} />
    </Sayfa>
  );
}

// ---------------- Avcı yaratma ----------------
function Yarat({ bitti, iptal }) {
  const [ad, setAd] = useState('');
  const kip = useContext(KipBaglam);
  useEffect(() => {
    Ses.soyle(kip === 'kendi' ? 'Yeni avcı. Adını seç.' : 'Yeni avcı. Adını yaz ya da hazır adlardan birini seç.', 3);
  }, []);
  return (
    <Sayfa contentContainerStyle={st.sayfa} keyboardShouldPersistTaps="handled">
      <Baslik>Yeni avcı</Baslik>
      {kip !== 'kendi' && (
        <>
          <TextInput
            value={ad}
            onChangeText={(t) => setAd(t.slice(0, 16))}
            placeholder="Avcının adı"
            placeholderTextColor={R.soluk}
            style={st.girdi}
            accessibilityLabel="Avcının adı"
            returnKeyType="done"
            onSubmitEditing={() => ad.trim() && bitti(ad.trim())}
          />
          <Dugme etiket="Bu adla başla" devre={!ad.trim()} onEtkin={() => bitti(ad.trim())} stil={st.buyukDugme} />
        </>
      )}
      <Okunur stil={st.altBaslik}>Hazır adlar</Okunur>
      <View style={st.sarmal}>
        {ADLAR.map((a) => (
          <Dugme key={a} etiket={a} onEtkin={() => bitti(a)} stil={st.adDugme} />
        ))}
      </View>
      <Dugme etiket="Vazgeç, ana menüye dön" onEtkin={iptal} />
    </Sayfa>
  );
}

// ---------------- Oyun ----------------
function Cubuk({ oran, renk }) {
  return (
    <View style={st.cubuk}>
      <View style={[st.cubukDolu, { width: `${Math.max(0, Math.min(1, oran)) * 100}%`, backgroundColor: renk }]} />
    </View>
  );
}

function Oyun({ avci, ayar, cikis, ayarDegistir, haritaDegistir }) {
  const kip = useContext(KipBaglam);
  const dRef = useRef(null);
  if (!dRef.current) dRef.current = M.dunyaOlustur(avci, avci.harita);
  const d = dRef.current;
  globalThis.__vahsiDunya = d; // denemeler için
  const sahneRef = useRef(null);
  const girdi = useRef({ ileri: 0, don: 0 });
  const adimBitis = useRef(0);
  const panelRef = useRef(null);
  const [panel, setPanel] = useState(null);
  const [, yenile] = useState(0);
  const [altyazi, setAltyazi] = useState('');
  const [topuz, setTopuz] = useState(null);
  const ayarRef = useRef(ayar);
  ayarRef.current = ayar;
  panelRef.current = panel;

  const kaydet = useCallback(() => {
    AsyncStorage.setItem(KAYIT_ANAHTAR, JSON.stringify(M.kayitHazirla(d.k))).catch(() => {});
  }, []);

  useEffect(() => {
    Efekt.onYukle(['sopa', 'iska', 'adim1', 'adim2', 'sonar_2', 'yarali', 'odak', 'etkinles', 'dustu', 'altin']);
    if (ayar.ortam !== false) Efekt.ortamBaslat(d.harita.ortam);
    let silici;
    setAltyazi('');
    Ses.altyaziDinle((m) => {
      setAltyazi(m);
      clearTimeout(silici);
      silici = setTimeout(() => setAltyazi(''), 6000);
    });
    Ses.soyle(`${d.harita.ad}. ${d.k.avlanan === 0 ? d.harita.tarif + ' ' : ''}${M.konumOzeti(d)}`, 3);
    const alt = AppState.addEventListener('change', (s) => {
      if (s !== 'active') kaydet();
    });
    return () => {
      Ses.altyaziDinle(null);
      Efekt.ortamDurdur();
      alt.remove();
      kaydet();
    };
  }, []);

  useEffect(() => {
    if (ayar.ortam === false) Efekt.ortamDurdur();
    else Efekt.ortamBaslat(d.harita.ortam);
  }, [ayar.ortam]);

  const efektCal = (o) => {
    const c = o.id ? d.hayvanlar.find((x) => x.id === o.id) : null;
    switch (o.tur) {
      case 'hasarVerdin':
        Efekt.cal(M.hesapla(d.k).silah.ses, o.kritik ? 1 : 0.8);
        return;
      case 'iska':
      case 'kacindin':
        Efekt.cal('iska', 0.6);
        return;
      case 'hasarAldin':
        Efekt.cal('yarali', 0.9);
        if (c && Math.random() < 0.5) setTimeout(() => Efekt.yonlu(HAYVANLAR[c.tur].ses, d.oyuncu, c, 0.8), 120);
        return;
      case 'oldurdun':
        if (c) Efekt.yonlu('dustu', d.oyuncu, c, 1);
        else Efekt.cal('dustu_2', 1);
        setTimeout(() => Efekt.cal('altin', 0.7), 700);
        return;
      case 'saldiriyor':
        if (c) {
          c.__sesZaman = d.zaman;
          Efekt.yonlu(HAYVANLAR[c.tur].ses, d.oyuncu, c, 1);
        }
        return;
      case 'hedef':
        if (c) Efekt.yonlu('sonar', d.oyuncu, c, 0.8);
        else Efekt.cal('hata', 0.5);
        return;
      case 'seviye':
        Efekt.cal('seviye', 1);
        return;
      case 'iyilestin':
        Efekt.cal('iksir', 0.8);
        return;
      case 'iksir':
        Efekt.cal(o.icildi ? 'iksir' : 'hata', 0.8);
        return;
      case 'menzil':
      case 'yetenekHazirDegil':
      case 'hata':
        Efekt.cal('hata', 0.6);
        return;
      case 'oldun':
        Efekt.cal('olum', 1);
        return;
      case 'dogdun':
        Efekt.cal('dogus', 0.9);
        return;
      case 'kampa':
        if (o.basladi) Efekt.cal('isinlan', 0.8);
        else if (o.vardin) Efekt.cal('dogus', 0.7);
        return;
      default:
    }
  };

  // Ana döngü
  useEffect(() => {
    let son = Date.now();
    let hudSayac = 0;
    let kayitSayac = 0;
    let carpmaSon = 0;
    let rehberSon = 0;
    let rehberMesafe = 0;
    let adimYol = 0;
    let adimSira = false;
    let sonarSayac = 0;
    let kalpSayac = 0;
    let cevreSayac = 2;
    let calisiyor = true;
    let raf;
    const dongu = () => {
      if (!calisiyor) return;
      const simdi = Date.now();
      const dt = Math.min(0.1, (simdi - son) / 1000);
      son = simdi;
      if (adimBitis.current && simdi > adimBitis.current) {
        adimBitis.current = 0;
        girdi.current = { ileri: 0, don: 0 };
      }
      if (!panelRef.current) {
        const oncekiX = d.oyuncu.x;
        const oncekiY = d.oyuncu.y;
        const sonuc = M.guncelle(d, dt, girdi.current);
        const a = ayarRef.current;
        if (sonuc.carpti && simdi - carpmaSon > 1500) {
          carpmaSon = simdi;
          titret('hafif', a);
          Efekt.cal('carpma', 0.7);
          if (a.kip !== 'gorerek') Ses.soyle(sonuc.gol ? 'Önünde su var.' : 'Önün kapalı.', 2);
        }
        adimYol += Math.hypot(d.oyuncu.x - oncekiX, d.oyuncu.y - oncekiY);
        if (adimYol > 1.6) {
          adimYol = 0;
          adimSira = !adimSira;
          Efekt.cal(adimSira ? 'adim1' : 'adim2', 0.22);
        }
        for (const o of M.olaylariAl(d)) {
          if (sahneRef.current) sahneRef.current.efekt(o);
          efektCal(o);
          if (o.tur === 'hasarAldin') titret('hafif', a);
          else if (o.tur === 'seviye') titret('iyi', a);
          else if (o.tur === 'oldun') titret('kotu', a);
          else if (o.tur === 'oldurdun') titret(o.patron ? 'agir' : 'orta', a);
          else if (o.tur === 'saldiriyor') titret('orta', a);
          if (o.metin) Ses.soyle(o.metin, o.oncelik);
        }
        // 3B ses: sana saldıranlar ~2,5 sn'de bir, çevrede gezenler arada bir, bulundukları yönden ses verir
        cevreSayac -= dt;
        if (cevreSayac <= 0) {
          cevreSayac = 0.5;
          const canli = d.hayvanlar.filter((c) => !c.olu).map((c) => ({ c, m: M.mesafe(c, d.oyuncu) }));
          canli
            .filter((x) => x.c.durum === 'kovala' && x.m < 30)
            .sort((x, y) => x.m - y.m)
            .slice(0, 2)
            .forEach(({ c }) => {
              if (!c.__sesZaman || d.zaman - c.__sesZaman > 2.5) {
                c.__sesZaman = d.zaman + Math.random() * 0.6;
                Efekt.yonlu(HAYVANLAR[c.tur].ses, d.oyuncu, c, 0.9);
              }
            });
          // Gezinen hayvanlar: en yakın 3'ten biri, kendi zamanlayıcısı dolunca
          const gezen = canli.filter((x) => x.c.durum !== 'kovala' && x.m < 40).sort((x, y) => x.m - y.m).slice(0, 3);
          for (const { c } of gezen) {
            if (c.sesSayac <= 0) {
              c.sesSayac = 7 + Math.random() * 9;
              Efekt.yonlu(HAYVANLAR[c.tur].ses, d.oyuncu, c, 0.75, 40);
              break;
            }
          }
        }
        // Hedef sonarı
        const hs = M.hedef(d);
        if (hs && !d.olu) {
          const m = M.mesafe(d.oyuncu, hs);
          sonarSayac -= dt;
          if (m > M.hesapla(d.k).menzil && sonarSayac <= 0) {
            sonarSayac = Math.max(0.45, Math.min(1.6, m / 25));
            Efekt.yonlu('sonar', d.oyuncu, hs, 0.5, 200);
          }
        }
        const hh = M.hesapla(d.k);
        if (!d.olu && d.k.can < hh.enCan * 0.3) {
          kalpSayac -= dt;
          if (kalpSayac <= 0) {
            kalpSayac = d.k.can < hh.enCan * 0.15 ? 0.6 : 0.9;
            Efekt.cal('kalp', 0.8);
          }
        }
        if (a.rehber && a.kip !== 'gorerek' && hs && simdi - rehberSon > 6000) {
          const m = M.mesafe(d.oyuncu, hs);
          const hareketli = d.yaklas || Math.abs(girdi.current.ileri) > 0.1;
          if (hareketli && m > M.hesapla(d.k).menzil && Math.abs(m - rehberMesafe) > 2.5) {
            rehberSon = simdi;
            rehberMesafe = m;
            Ses.soyle(`${hs.ad} ${M.saatSozu(M.saatYonu(d.oyuncu, hs))}, ${M.metreSozu(m)}.`, 1);
          }
        }
        kayitSayac += dt;
        if (kayitSayac > 15) {
          kayitSayac = 0;
          kaydet();
        }
      }
      if (sahneRef.current && !panelRef.current) {
        try {
          sahneRef.current.kare(dt);
        } catch (e) {
          sahneRef.current = null;
        }
      }
      hudSayac += dt;
      if (hudSayac > 0.25) {
        hudSayac = 0;
        yenile((x) => x + 1);
      }
      raf = requestAnimationFrame(dongu);
    };
    raf = requestAnimationFrame(dongu);
    return () => {
      calisiyor = false;
      cancelAnimationFrame(raf);
      if (sahneRef.current) sahneRef.current.birak();
    };
  }, []);

  const glHazir = useCallback((gl) => {
    try {
      sahneRef.current = sahneKur(gl, d);
    } catch (e) {
      sahneRef.current = null;
    }
  }, []);

  const jBasla = useCallback((x, y) => {
    setTopuz({ x, y, dx: 0, dy: 0 });
    adimBitis.current = 0;
  }, []);
  const jTasi = useCallback((dx, dy) => {
    const ileri = Math.max(-1, Math.min(1, -dy / 60));
    const don = Math.max(-1, Math.min(1, dx / 70));
    girdi.current = { ileri: Math.abs(ileri) < 0.15 ? 0 : ileri, don: Math.abs(don) < 0.15 ? 0 : don };
    setTopuz((t) => (t ? { ...t, dx: Math.max(-50, Math.min(50, dx)), dy: Math.max(-50, Math.min(50, dy)) } : t));
  }, []);
  const jBirak = useCallback(() => {
    girdi.current = { ileri: 0, don: 0 };
    setTopuz(null);
  }, []);

  useSihirliEylem(() => {
    if (!panelRef.current) M.saldir(d);
  });

  const adimAt = (ileri, don, sure) => {
    girdi.current = { ileri, don };
    adimBitis.current = Date.now() + sure;
  };

  const k = d.k;
  const h = M.hesapla(k);
  const hedef = M.hedef(d);
  const tuccarda = M.tuccarYakinMi(d);

  const panelAc = (p, soz) => {
    setPanel(p);
    if (soz) Ses.soyle(soz, 3);
  };
  const panelKapat = () => {
    setPanel(null);
    kaydet();
    Ses.soyle('Oyuna dönüldü.', 2);
  };

  const yetenekEtiketi = (y) => {
    const dur = M.yetenekDurumu(d, y);
    if (dur.kilitli) return `${y.ad}, kilitli, seviye ${y.seviye}`;
    if (dur.kalan) return `${y.ad}, ${Math.ceil(dur.kalan)} saniye`;
    return y.ad;
  };
  const xpOran = k.seviye >= SEVIYE_SINIRI ? 1 : k.xp / M.gerekenXp(k.seviye);

  return (
    <View style={{ flex: 1, backgroundColor: d.harita.gok }}>
      <GLView style={StyleSheet.absoluteFill} onContextCreate={glHazir} accessible={false} importantForAccessibility="no-hide-descendants" accessibilityElementsHidden />
      <SafeAreaView
        style={{ flex: 1 }}
        edges={['top', 'bottom', 'left', 'right']}
        accessibilityElementsHidden={!!panel}
        importantForAccessibility={panel ? 'no-hide-descendants' : 'auto'}
      >
        <View style={st.ustSatir}>
          <Dugme etiket={`Durum. ${M.durumOzeti(d)}`} onEtkin={() => Ses.hemen(M.durumOzeti(d))} stil={st.hud}>
            <View style={st.satir}>
              <Text style={st.hudAd}>
                {k.ad} · Sv {k.seviye}
              </Text>
              <Text style={st.hudKucuk}>
                {k.altin} altın · {k.iksir} iksir
              </Text>
            </View>
            <Cubuk oran={k.can / h.enCan} renk={R.can} />
            <Cubuk oran={xpOran} renk={R.xp} />
            <Text style={st.hudKucuk} numberOfLines={1}>
              {d.harita.ad} · {h.silah.ad}
            </Text>
            {hedef && (
              <Text style={st.hudHedef} numberOfLines={1}>
                {hedef.ad} Sv {hedef.seviye} · %{Math.round((hedef.can / hedef.enCan) * 100)} · {Math.round(M.mesafe(d.oyuncu, hedef))} m
              </Text>
            )}
          </Dugme>
          <View style={{ flex: 1 }} />
          <View style={st.baglamSatir}>
            {d.olu && <Dugme etiket="Yeniden doğ" onEtkin={() => M.yenidenDog(d)} stil={st.baglamDugme} />}
            {!d.olu && tuccarda && <Dugme etiket="Tüccar ile konuş" onEtkin={() => panelAc('tuccar', `Tüccar. ${k.altin} altının var.`)} stil={st.baglamDugme} />}
            {!d.olu && !tuccarda && M.kamptaMi(d) && (
              <Dugme etiket="Tüccara git" onEtkin={() => { d.oyuncu.x = d.tuccar.x; d.oyuncu.y = d.tuccar.y - 2.2; d.oyuncu.yon = 0; Ses.soyle('Tüccarın yanındasın.', 3); }} stil={st.baglamDugme} />
            )}
            {!d.olu && !hedef && !M.kamptaMi(d) && <Dugme etiket="Lidere git" ipucu="Haritanın liderine yürür" onEtkin={() => M.patronaGit(d)} stil={st.baglamDugme} />}
            {!d.olu && (d.otoSaldiri || d.yaklas) && (
              <Dugme etiket="Dur" ipucu="Saldırıyı ve yürüyüşü durdurur" onEtkin={() => { M.dur(d); Ses.soyle('Durdun.', 2); }} stil={st.baglamDugme} />
            )}
          </View>
        </View>

        <View style={{ flex: 1 }} />

        <View style={st.alt}>
          {kip === 'voiceover' ? (
            <View style={st.solVo}>
              <Dugme etiket="İleri yürü" ipucu="Yaklaşık 4 metre ilerler" onEtkin={() => adimAt(1, 0, 800)} kisa stil={st.voDugme} />
              <View style={st.satir}>
                <Dugme etiket="Sola dön" onEtkin={() => adimAt(0, -1, 330)} kisa stil={[st.voDugme, { flex: 1 }]} />
                <Dugme etiket="Sağa dön" onEtkin={() => adimAt(0, 1, 330)} kisa stil={[st.voDugme, { flex: 1 }]} />
              </View>
              <Dugme etiket="Geri git" onEtkin={() => adimAt(-1, 0, 700)} kisa stil={st.voDugme} />
            </View>
          ) : (
            <DogrudanAlan etiket="Hareket alanı. Parmağını koyup kaydır: yukarı ileri, aşağı geri, sağ ve sol döndürür" basla={jBasla} tasi={jTasi} birak={jBirak} stil={st.sol}>
              {topuz ? (
                <View pointerEvents="none" style={[st.topuzKap, { left: topuz.x - 55, top: topuz.y - 55 }]}>
                  <View style={[st.topuz, { transform: [{ translateX: topuz.dx }, { translateY: topuz.dy }] }]} />
                </View>
              ) : (
                <Text style={st.solYazi} pointerEvents="none">
                  Hareket{'\n'}parmağını kaydır
                </Text>
              )}
            </DogrudanAlan>
          )}
          <View style={st.orta}>
            {!!altyazi && (
              <Text style={st.altyazi} numberOfLines={3} accessibilityElementsHidden importantForAccessibility="no">
                {altyazi}
              </Text>
            )}
          </View>
          <View style={st.sag}>
            <View style={st.izgara}>
              {[YETENEKLER[0], YETENEKLER[1]].map((y) => (
                <Dugme key={y.id} etiket={yetenekEtiketi(y)} ipucu={y.aciklama} devre={!M.yetenekDurumu(d, y).hazir} onEtkin={() => M.yetenekKullan(d, y.id)} kisa stil={st.eylem} />
              ))}
              <Dugme etiket="Saldır" ipucu="Hedefe yürür ve saldırır" onEtkin={() => M.saldir(d)} kisa stil={[st.eylem, st.saldir]} />
              {[YETENEKLER[2], YETENEKLER[3]].map((y) => (
                <Dugme key={y.id} etiket={yetenekEtiketi(y)} ipucu={y.aciklama} devre={!M.yetenekDurumu(d, y).hazir} onEtkin={() => M.yetenekKullan(d, y.id)} kisa stil={st.eylem} />
              ))}
              <Dugme etiket="Hedef" ipucu="Sıradaki yakın hayvanı seçer" onEtkin={() => M.hedefDegistir(d, 45)} kisa stil={st.eylem} />
              <Dugme etiket={`İksir, ${k.iksir}`} onEtkin={() => M.iksirIc(d)} kisa stil={st.eylem} />
              <Dugme etiket="Etrafı tara" onEtkin={() => Ses.hemen(M.etrafiTara(d))} kisa stil={st.eylem} />
              <Dugme etiket="Menü" onEtkin={() => panelAc('menu', 'Menü. Oyun duraklatıldı.')} kisa stil={st.eylem} />
            </View>
          </View>
        </View>
      </SafeAreaView>

      {panel && (
        <View style={st.panelOrt} accessibilityViewIsModal>
          <Katman seviye={1}>
            <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
              <Sayfa contentContainerStyle={st.sayfa}>
                {panel === 'menu' && (
                  <>
                    <Baslik>Menü</Baslik>
                    <Dugme etiket="Oyuna dön" onEtkin={panelKapat} stil={st.buyukDugme} />
                    <Dugme etiket="Durumumu oku" onEtkin={() => Ses.hemen(M.durumOzeti(d))} />
                    <Dugme etiket="Neredeyim" onEtkin={() => Ses.hemen(M.konumOzeti(d))} />
                    <Dugme etiket="Haritalar" ipucu="Başka bir haritaya git" onEtkin={() => panelAc('haritalar', 'Haritalar.')} />
                    <Dugme etiket="Avcı bilgisi" onEtkin={() => panelAc('avci', `${k.ad}, seviye ${k.seviye}.`)} />
                    <Dugme
                      etiket="Kampa dön"
                      ipucu="5 saniye kıpırdamazsan kampa ışınlanırsın"
                      onEtkin={() => {
                        setPanel(null);
                        M.kampaDon(d);
                      }}
                    />
                    <Dugme etiket="Ayarlar" onEtkin={() => panelAc('ayarlar', null)} />
                    <Dugme
                      etiket="Kaydet ve ana menüye dön"
                      onEtkin={() => {
                        kaydet();
                        cikis();
                      }}
                    />
                  </>
                )}
                {panel === 'haritalar' && (
                  <HaritaPaneli
                    k={k}
                    git={(id) => {
                      kaydet();
                      haritaDegistir(id);
                    }}
                    geri={() => panelAc('menu', 'Menü.')}
                  />
                )}
                {panel === 'avci' && <AvciPaneli d={d} geri={() => panelAc('menu', 'Menü.')} />}
                {panel === 'tuccar' && <TuccarPaneli k={k} geri={panelKapat} />}
                {panel === 'ayarlar' && <Ayarlar ayar={ayar} degistir={ayarDegistir} geri={() => panelAc('menu', 'Menü.')} />}
              </Sayfa>
            </SafeAreaView>
          </Katman>
        </View>
      )}
    </View>
  );
}

function HaritaPaneli({ k, git, geri }) {
  return (
    <>
      <Baslik>Haritalar</Baslik>
      {HARITALAR.map((hr) => {
        const dur = M.haritaDurumu(k, hr);
        return (
          <Dugme
            key={hr.id}
            etiket={dur.metin}
            ipucu={dur.acik ? hr.tarif : undefined}
            devre={!dur.acik || k.harita === hr.id}
            onEtkin={() => {
              Ses.hemen(`${hr.ad} haritasına gidiyorsun.`);
              git(hr.id);
            }}
          />
        );
      })}
      <Dugme etiket="Geri" onEtkin={geri} stil={st.buyukDugme} />
    </>
  );
}

function AvciPaneli({ d, geri }) {
  const k = d.k;
  const h = M.hesapla(k);
  return (
    <>
      <Baslik>
        {k.ad}, seviye {k.seviye}
      </Baslik>
      <Okunur stil={st.metin}>
        Can {Math.round(k.can)} / {h.enCan}. Saldırı {h.saldiri}, savunma {h.savunma}, menzil {h.menzil} metre.
      </Okunur>
      <Okunur stil={st.metin}>
        Silah: {h.silah.ad}. Zırh: {h.zirh.id === 'yok' ? 'yok' : h.zirh.ad}.
      </Okunur>
      <Okunur stil={st.metin}>
        Avlanan hayvan: {k.avlanan}. Yenilen lider: {k.patronlar.length} / {HARITALAR.length}.
      </Okunur>
      <Okunur stil={st.altBaslik}>Yetenekler</Okunur>
      {YETENEKLER.map((y) => (
        <Okunur key={y.id} stil={st.metin}>
          {y.ad}: {y.seviye > k.seviye ? `seviye ${y.seviye}'te açılır. ` : ''}
          {y.aciklama} {y.bekleme} saniye bekleme.
        </Okunur>
      ))}
      <Dugme etiket="Geri" onEtkin={geri} stil={st.buyukDugme} />
    </>
  );
}

function TuccarPaneli({ k, geri }) {
  const [, yenile] = useState(0);
  const [sekme, setSekme] = useState('silah');
  const al = (tur, id) => {
    const r = M.satinAl(k, tur, id);
    Ses.hemen(r.hata || r.metin);
    yenile((x) => x + 1);
  };
  const sekmeler = [
    ['silah', 'Silahlar'],
    ['zirh', 'Zırhlar'],
    ['iksir', 'İksir'],
  ];
  const satir = (tur, e) => {
    const sahip = (tur === 'silah' ? k.silahlar : k.zirhlar).includes(e.id);
    const kusanili = (tur === 'silah' ? k.silah : k.zirh) === e.id;
    const deger = tur === 'silah' ? `hasar ${e.hasar}, menzil ${e.menzil} metre` : `savunma ${e.savunma}, can artı ${e.can}`;
    let etiket;
    if (kusanili) etiket = `${e.ad}, kuşanılı, ${deger}`;
    else if (sahip) etiket = `${e.ad}, sende var, kuşan. ${deger}`;
    else if (e.seviye > k.seviye) etiket = `${e.ad}, kilitli, seviye ${e.seviye}. ${deger}`;
    else etiket = `${e.ad}, ${e.fiyat} altın, satın al. ${deger}`;
    return <Dugme key={e.id} etiket={etiket} devre={kusanili || (!sahip && e.seviye > k.seviye)} onEtkin={() => al(tur, e.id)} />;
  };
  return (
    <>
      <Baslik>Tüccar</Baslik>
      <Okunur stil={st.metin}>
        {k.altin} altının, {k.iksir} iksirin var.
      </Okunur>
      <View style={st.satir}>
        {sekmeler.map(([id, ad], i) => (
          <Dugme
            key={id}
            etiket={`${ad}${sekme === id ? ', seçili' : ''}, sekme ${i + 1} / ${sekmeler.length}`}
            onEtkin={() => {
              setSekme(id);
              Ses.hemen(`${ad}`);
            }}
            stil={[{ flex: 1 }, sekme === id && { borderColor: R.altin }]}
          >
            <Text style={[st.dugmeYazi, { textAlign: 'center' }]}>{ad}</Text>
          </Dugme>
        ))}
      </View>
      {sekme === 'silah' && SILAHLAR.map((e) => satir('silah', e))}
      {sekme === 'zirh' && ZIRHLAR.filter((z) => z.id !== 'yok').map((e) => satir('zirh', e))}
      {sekme === 'iksir' && (
        <Dugme etiket={`Şifa iksiri al, ${IKSIR.fiyat} altın. Canının yüzde ${Math.round(IKSIR.iyilestir * 100)}'ini doldurur`} onEtkin={() => al('iksir')} />
      )}
      <Dugme etiket="Tüccardan ayrıl" onEtkin={geri} stil={st.buyukDugme} />
    </>
  );
}

// ---------------- Uygulama ----------------
export default function App() {
  const [ekran, setEkran] = useState('yukleniyor');
  const [ayar, setAyar] = useState(VARSAYILAN_AYAR);
  const [kayit, setKayit] = useState(null);
  const [avci, setAvci] = useState(null);
  const [oyunAnahtar, setOyunAnahtar] = useState(0);

  useEffect(() => {
    setAudioModeAsync({ playsInSilentMode: true, interruptionMode: 'mixWithOthers', shouldPlayInBackground: false })
      .then(() => setIsAudioActiveAsync(true))
      .catch(() => {});
    try {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE).catch(() => {});
    } catch (e) {}
    (async () => {
      let a = VARSAYILAN_AYAR;
      try {
        const ham = await AsyncStorage.getItem(AYAR_ANAHTAR);
        if (ham) a = { ...VARSAYILAN_AYAR, ...JSON.parse(ham) };
      } catch (e) {}
      let kk = null;
      try {
        const ham = await AsyncStorage.getItem(KAYIT_ANAHTAR);
        if (ham) kk = M.kayittanYukle(JSON.parse(ham));
      } catch (e) {}
      setAyar(a);
      setKayit(kk);
      if (a.kip) Ses.ayarla({ kip: a.kip, hiz: a.hiz });
      setEkran(a.kip ? 'menu' : 'kip');
    })();
  }, []);

  useEffect(() => {
    Efekt.efektAyarla({ acik: ayar.efekt !== false, kis: ayar.efektKis !== false, ortam: ayar.ortam !== false ? 0.35 : 0 });
  }, [ayar.efekt, ayar.efektKis, ayar.ortam]);

  const ayarDegistir = useCallback((deg) => {
    setAyar((a) => {
      const yeni = { ...a, ...deg };
      AsyncStorage.setItem(AYAR_ANAHTAR, JSON.stringify(yeni)).catch(() => {});
      return yeni;
    });
  }, []);

  const kipSec = (kip) => {
    ayarDegistir({ kip });
    Ses.ayarla({ kip });
    Ses.hemen(
      kip === 'gorerek'
        ? 'Görerek oyna seçildi.'
        : kip === 'voiceover'
          ? 'VoiceOver ile oyna seçildi.'
          : 'Sesle oyna seçildi. Oyun VoiceOver gibi çalışır: parmağını ekranda gezdir ya da sağa sola kaydırarak öğeler arasında dolaş. Seçili öğeyi çalıştırmak için ekranın herhangi bir yerine iki kez dokun. İki parmakla dokununca konuşma susar.'
    );
    setEkran('menu');
  };

  const basla = (k) => {
    setAvci(k);
    setOyunAnahtar((x) => x + 1);
    setEkran('oyun');
  };

  let icerik = null;
  if (ekran === 'yukleniyor') icerik = <View style={{ flex: 1 }} />;
  else if (ekran === 'kip') icerik = <KipSecim sec={kipSec} />;
  else if (ekran === 'menu')
    icerik = (
      <AnaMenu
        kayitVar={!!kayit}
        kayitOzet={kayit ? `${kayit.ad}, seviye ${kayit.seviye}, ${M.haritaBul(kayit.harita).ad}` : ''}
        devam={() => basla(kayit)}
        yeni={() => setEkran('yarat')}
        ayarlar={() => setEkran('ayarlar')}
        nasil={() => setEkran('nasil')}
      />
    );
  else if (ekran === 'nasil') icerik = <Nasil geri={() => setEkran('menu')} />;
  else if (ekran === 'ayarlar') icerik = <Ayarlar ayar={ayar} degistir={ayarDegistir} geri={() => setEkran('menu')} />;
  else if (ekran === 'yarat')
    icerik = (
      <Yarat
        iptal={() => setEkran('menu')}
        bitti={(ad) => {
          const k = M.avciOlustur(ad);
          AsyncStorage.setItem(KAYIT_ANAHTAR, JSON.stringify(k)).catch(() => {});
          setKayit(k);
          Ses.soyle(`Hoş geldin avcı ${ad}. Elinde bir sopa, kesende 30 altın var. Yeşil Orman'dasın. Kamptaki Tüccar'dan av bıçağı alabilirsin.`, 3);
          basla(k);
        }}
      />
    );
  else if (ekran === 'oyun')
    icerik = (
      <Oyun
        key={oyunAnahtar}
        avci={avci}
        ayar={ayar}
        ayarDegistir={ayarDegistir}
        haritaDegistir={(id) => {
          avci.harita = id;
          avci.konum = null;
          AsyncStorage.setItem(KAYIT_ANAHTAR, JSON.stringify(avci)).catch(() => {});
          setOyunAnahtar((x) => x + 1);
        }}
        cikis={() => {
          setKayit(M.kayitHazirla(avci));
          setEkran('menu');
        }}
      />
    );

  return (
    <SafeAreaProvider>
      <KipBaglam.Provider value={ayar.kip || 'kendi'}>
        <Gezgin acik={ayar.kip === 'kendi'} titresim={() => titret('hafif', ayar)}>
          <View style={{ flex: 1, backgroundColor: R.zemin }}>
            <StatusBar style="light" />
            {ekran === 'oyun' || ekran === 'kip' ? icerik : <SafeAreaView style={{ flex: 1 }}>{icerik}</SafeAreaView>}
          </View>
        </Gezgin>
      </KipBaglam.Provider>
    </SafeAreaProvider>
  );
}

const st = StyleSheet.create({
  sayfa: { padding: 18, gap: 10, paddingBottom: 40, width: '100%', maxWidth: 720, alignSelf: 'center' },
  oyunAdi: { color: R.altin, fontSize: 40, fontWeight: '800', marginTop: 24, letterSpacing: 1 },
  baslik: { color: R.yazi, fontSize: 28, fontWeight: '800', marginBottom: 6 },
  altBaslik: { color: R.altin, fontSize: 18, fontWeight: '700', marginTop: 10 },
  metin: { color: R.yazi, fontSize: 17, lineHeight: 24 },
  soluk: { color: R.soluk, fontSize: 15 },
  satir: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  sarmal: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  dugme: { backgroundColor: R.panel2, borderRadius: 12, paddingVertical: 14, paddingHorizontal: 14, borderWidth: 1, borderColor: R.cizgi, justifyContent: 'center' },
  dugmeBasili: { opacity: 0.7 },
  dugmeDevre: { opacity: 0.45 },
  dugmeYazi: { color: R.yazi, fontSize: 17, fontWeight: '600' },
  dugmeYaziKisa: { fontSize: 13, textAlign: 'center' },
  buyukDugme: { paddingVertical: 18, backgroundColor: '#3a3220', borderColor: '#6b5a2e' },
  adDugme: { paddingVertical: 12, paddingHorizontal: 16 },
  girdi: { backgroundColor: R.panel, color: R.yazi, fontSize: 18, borderRadius: 10, padding: 14, borderWidth: 1, borderColor: R.cizgi },
  kipKap: { flex: 1, padding: 18, gap: 12, justifyContent: 'center' },
  kipSatir: { flex: 1, flexDirection: 'row', gap: 12 },
  kipYari: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  kipBuyuk: { color: R.altin, fontSize: 40, fontWeight: '800', marginBottom: 16 },
  kipYazi: { color: R.yazi, fontSize: 28, fontWeight: '800', textAlign: 'center' },
  kipAlt: { color: R.soluk, fontSize: 16, marginTop: 8, textAlign: 'center' },
  ustSatir: { flexDirection: 'row', alignItems: 'flex-start', paddingHorizontal: 8, paddingTop: 6, gap: 8 },
  hud: { width: 290, padding: 10, backgroundColor: 'rgba(20,22,27,0.82)', borderRadius: 12, gap: 5 },
  hudAd: { color: R.yazi, fontSize: 16, fontWeight: '800' },
  hudKucuk: { color: R.soluk, fontSize: 13 },
  hudHedef: { color: '#ffb3a8', fontSize: 14, fontWeight: '700' },
  cubuk: { height: 8, backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 4, overflow: 'hidden' },
  cubukDolu: { height: 8, borderRadius: 4 },
  altyazi: { color: '#fff', backgroundColor: 'rgba(0,0,0,0.55)', padding: 8, borderRadius: 8, fontSize: 14 },
  orta: { flex: 1, justifyContent: 'flex-end', paddingBottom: 4 },
  baglamSatir: { flexDirection: 'column', gap: 6, width: 230 },
  baglamDugme: { backgroundColor: '#3a3220', borderColor: '#6b5a2e', paddingVertical: 10 },
  alt: { flexDirection: 'row', height: 214, paddingHorizontal: 8, paddingBottom: 6, gap: 10, alignItems: 'flex-end' },
  sol: { width: 250, height: 208, backgroundColor: 'rgba(20,22,27,0.25)', borderRadius: 16, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  solVo: { width: 250, gap: 6, justifyContent: 'flex-end' },
  voDugme: { backgroundColor: 'rgba(31,35,43,0.9)' },
  solYazi: { color: 'rgba(255,255,255,0.7)', fontSize: 14, textAlign: 'center' },
  topuzKap: { position: 'absolute', width: 110, height: 110, borderRadius: 55, borderWidth: 2, borderColor: 'rgba(255,255,255,0.5)', alignItems: 'center', justifyContent: 'center' },
  topuz: { width: 50, height: 50, borderRadius: 25, backgroundColor: 'rgba(255,255,255,0.7)' },
  sag: { width: 262, justifyContent: 'flex-end' },
  izgara: { flexDirection: 'row', flexWrap: 'wrap', gap: 5, justifyContent: 'flex-end' },
  eylem: { width: 84, height: 66, paddingHorizontal: 4, paddingVertical: 4, alignItems: 'center', backgroundColor: 'rgba(31,35,43,0.9)' },
  saldir: { backgroundColor: 'rgba(120,32,26,0.95)', borderColor: '#c4473b' },
  panelOrt: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(20,22,27,0.97)' },
});
