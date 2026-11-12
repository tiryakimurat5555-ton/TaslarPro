// Vahşi Yaşam — erişilebilir, kendi sesiyle konuşan 3B doğa araştırması ve ekosistem simülasyonu (Afrika savanı).
// Tasarım: 113 kararlık proje brifi. Bu sürüm brifin Aşama 1-3'ü: teknik temel, saha prototipi, ilk hayvan ve gözlem döngüsü.
// Yapı: oyun/veri.js (arazi, türler, davranışlar), oyun/mantik.js (saf mantık), oyun/ses.js (konuşma),
// oyun/efekt.js (3B konumlu sesler), oyun/sahne.js (3B çizim), oyun/gezgin.js (oyunun ekran okuyucusu).
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
import { TURLER, TUR_SIRASI, YERLER, DAVRANISLAR, EVRELER, KISILIKLER } from './oyun/veri.js';
import { Gezgin, Katman, Okunur, Sayfa, DogrudanAlan, useOdak, useSihirliEylem } from './oyun/gezgin.js';
import { useJestler } from './oyun/jestler.js';

const OYUN_ADI = 'Vahşi Yaşam';
const AYAR_ANAHTAR = 'vahsi-yasam-ayar-v1';
const KAYIT_ANAHTAR = 'vahsi-yasam-kayit-v1';
const VARSAYILAN_AYAR = { kip: null, hiz: 1.0, titresim: true, rehber: true, efekt: true, efektKis: true, ortam: true };
const ADLAR = ['Defne', 'Kaan', 'Ada', 'Deniz', 'Ilgaz', 'Elif', 'Atlas', 'Zeynep', 'Toprak', 'Yağmur', 'Mert', 'Selin'];

const R = {
  zemin: '#15171a',
  panel: '#1f2320',
  panel2: '#2a2f2a',
  cizgi: '#3d4538',
  yazi: '#f2eee2',
  soluk: '#a9ad9e',
  vurgu: '#e2c069',
  yesil: '#7fb069',
};

const KipBaglam = createContext('kendi');
// Sahadaki aletler (Kayıp Okyanus'taki gibi iki parmakla sağa/sola kaydırarak değişir, çift dokunuş kullanır)
const ALETLER = [
  { id: 'durbun', ad: 'Dürbün', ipucu: 'Çift dokununca sıradaki hayvanı gözlemlersin.', kullan: (d) => M.gozlemBaslat(d) },
  { id: 'kamera', ad: 'Fotoğraf makinesi', ipucu: 'Çift dokununca gözlediğin hayvanın fotoğrafını çekersin.', kullan: (d) => M.fotografCek(d) },
  { id: 'ses', ad: 'Ses kayıt cihazı', ipucu: 'Çift dokununca 6 saniye kayıt yapıp sesleri çözümlersin.', kullan: (d) => M.sesKaydiBaslat(d) },
  { id: 'yaklas', ad: 'Yaklaşma', ipucu: 'Çift dokununca gözlediğin hayvana ürkütmeden yaklaşırsın.', kullan: (d) => M.yaklas(d) },
];
const OLU_BOLGE = 0.12;
const TAM_SURUKLEME = 90; // bu kadar piksel sürükleyince tam hız
function olcekle(piksel) {
  const v = Math.max(-1, Math.min(1, piksel / TAM_SURUKLEME));
  if (Math.abs(v) < OLU_BOLGE) return 0;
  return Math.sign(v) * ((Math.abs(v) - OLU_BOLGE) / (1 - OLU_BOLGE));
}
const KALICI_OLAYLAR = ['tanimlandi', 'yeniTur', 'yeniDavranis', 'foto', 'tanik', 'sesKayit', 'saldiri'];

function titret(tur, ayar) {
  if (!ayar || !ayar.titresim) return;
  try {
    if (tur === 'hafif') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    else if (tur === 'orta') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    else if (tur === 'agir') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    else if (tur === 'iyi') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    else if (tur === 'kotu') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
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
          Ses.hemen(`${OYUN_ADI}'a hoş geldin. Ekranın üst yarısına dokunursan görerek oynarsın. Alt yarısına dokunursan oyun kendi sesiyle konuşur ve sesle oynarsın.`);
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
        <Okunur stil={st.metin}>VoiceOver açık. İstersen VoiceOver ile oynayabilirsin. Oyunun kendi sesini tercih edersen önce VoiceOver'ı kapat, sonra ekranın alt yarısına dokun.</Okunur>
        <View style={st.kipSatir}>
          <Pressable accessibilityRole="button" accessibilityLabel="VoiceOver ile oyna" onPress={() => sec('voiceover')} style={[st.kipYari, { backgroundColor: '#24342a' }]}>
            <Text style={st.kipYazi}>VoiceOver ile oyna</Text>
          </Pressable>
          <Pressable accessibilityRole="button" accessibilityLabel="Oyunun kendi sesiyle oyna" onPress={() => sec('kendi')} style={[st.kipYari, { backgroundColor: '#3a2e1c' }]}>
            <Text style={st.kipYazi}>Oyunun kendi sesiyle oyna</Text>
          </Pressable>
        </View>
      </View>
    );
  }
  return (
    <View style={{ flex: 1, flexDirection: 'column' }}>
      <Pressable accessibilityRole="button" accessibilityLabel="Görerek oyna" onPress={() => sec('gorerek')} style={[st.kipYari, { backgroundColor: '#24342a' }]}>
        <Text style={st.kipBuyuk}>{OYUN_ADI}</Text>
        <Text style={st.kipYazi}>Görerek oyna</Text>
        <Text style={st.kipAlt}>Ekranın üst yarısı</Text>
      </Pressable>
      <Pressable accessibilityRole="button" accessibilityLabel="Sesle oyna" onPress={() => sec('kendi')} style={[st.kipYari, { backgroundColor: '#3a2e1c' }]}>
        <Text style={st.kipYazi}>Sesle oyna</Text>
        <Text style={st.kipAlt}>Oyun kendi sesiyle konuşur. Ekranın alt yarısı.</Text>
      </Pressable>
    </View>
  );
}

// ---------------- Ana menü ----------------
function AnaMenu({ kayitVar, kayitOzet, devam, yeni, ayarlar, nasil }) {
  useEffect(() => {
    Ses.soyle(`${OYUN_ADI}, ana menü. ${kayitVar ? 'Devam et, ' : ''}Yeni araştırma, Nasıl oynanır, Ayarlar.`, 3);
  }, [kayitVar]);
  return (
    <Sayfa contentContainerStyle={st.sayfa}>
      <Text style={st.oyunAdi} accessibilityRole="header">
        {OYUN_ADI}
      </Text>
      <Okunur stil={st.soluk}>Afrika savanında bağımsız bir doğa araştırmacısısın. Hayvanları izle, tanımla, fotoğrafla, seslerini kaydet. Kulaklıkla oyna.</Okunur>
      {kayitVar && <Dugme etiket={`Devam et: ${kayitOzet}`} onEtkin={devam} stil={st.buyukDugme} />}
      <Dugme etiket="Yeni araştırma" ipucu={kayitVar ? 'Kayıtlı araştırman silinir' : undefined} onEtkin={yeni} stil={st.buyukDugme} />
      <Dugme etiket="Nasıl oynanır" onEtkin={nasil} stil={st.buyukDugme} />
      <Dugme etiket="Ayarlar" onEtkin={ayarlar} stil={st.buyukDugme} />
    </Sayfa>
  );
}

const NASIL = [
  'Amaç: Afrika savanındaki hayvanları gözlemlemek, her bireyi tanımlayıp kimlik numarasıyla kaydetmek, davranışlarını belgelemek, fotoğraflarını çekmek ve seslerini kaydetmek. Avlanma ya da savaş yoktur; hayvanları rahatsız etmeden izlersin.',
  'Telefonu dik tut ve kulaklık tak. Hayvanlar bulundukları yönden ses verir: soldaki sol kulaktan, arkadaki boğuk gelir, uzaktaki kısık duyulur.',
  'Sahada her şey Kayıp Okyanus gibi dokunma hareketleriyle yapılır, düğme yoktur. Tek parmakla sürükle: yukarı ileri yürür, aşağı geri gider, sağa ve sola döndürür; araçtayken sürersin. Dokun: çevreni ya da izlediğin hayvanı anlatır. Uzun bas: durumunu söyler. Çift dokun: elindeki aleti kullanır. İki parmakla sağa ya da sola kaydır: alet değiştirir. Aletler dürbün, fotoğraf makinesi, ses kayıt cihazı ve yaklaşmadır.',
  'İki parmakla yukarı kaydır: araca biner ya da inersin; araç uzaktaysa yanına yürürsün. İki parmakla aşağı kaydır: otomatik yürüyüşü durdurur ve gözlemi bitirir. İki parmakla dokun: konuşmayı susturur. İki parmakla iki kez dokun: menüyü açar. Yerler, Arşiv, Etrafı tara ve Ayarlar menüdedir.',
  'Dürbün: görebildiğin en yakın hayvanı seçer; her kullanışta sıradakine geçer. Bir hayvanı birkaç saniye izleyince tanımlanır ve kimlik numarası alır, örneğin Zebra 3. Yeni davranışları izledikçe ansiklopedine kaydedilir.',
  'Yaklaşma: seçili hayvana ürkütmeden yürür ve güvenli izleme mesafesinde durur. Çok yaklaşırsan hayvanlar kaçar. Fil, manda, su aygırı, gergedan ve aslan gibi tehlikeli hayvanlar önce uyarır; geri çekilmezsen sana doğru hamle yapar.',
  'Fotoğraf makinesi: seçili hayvanı fotoğraflar. İyi bir fotoğraf için yeterince yakın ama ürkütmeyecek kadar uzak ol. Nadir davranışların fotoğrafı çok değerlidir.',
  'Ses kayıt cihazı: 6 saniye çevreyi dinler. Analiz hangi türün, hangi yönden, ne kadar uzaktan ve ne tür bir ses çıkardığını söyler: iletişim, alarm, bölge ya da yavru çağrısı.',
  'Hayvanlar seni zamanla tanır. Uzaktan, sakin ve sık izlediğin bireyler sana alışır ve daha az kaçar. Araçtan izlemek hayvanları yayadan daha az ürkütür.',
  'Zaman oyun açıkken akar, oyun kapalıyken durur. Bir gün 48 dakika sürer. Gündüz otçullar otlar, akşam ve gece yırtıcılar avlanır. Gece dürbünle görüş kısalır.',
  'Menüdeki Yerler seni gölete, nehir geçitlerine, kayalığa, mağara girişine, ağaçlığa, sulak alana ya da araca götürür. Nehir yalnızca iki geçitten geçilir. Menüdeki Neredeyim konumunu, Etrafı tara çevrendeki hayvanları söyler. Saat yönleri: 12 tam önün, 3 sağın, 6 arkan, 9 solun.',
  'Arşiv: keşfettiğin türler, tanımladığın bireyler ve aileleri, fotoğrafların, ses kayıtların ve tanık olduğun olaylar birbirine bağlı olarak saklanır. Oyun kendini otomatik kaydeder.',
  'Menülerde oyun VoiceOver gibi çalışır: dokunduğun ya da parmağını gezdirdiğin öğeyi okur, sağa sola kaydırınca sonraki ve önceki öğeye geçer, ekranın herhangi bir yerine iki kez dokununca seçili öğe çalışır. İki parmakla bir kez dokunmak konuşmayı susturur, iki parmakla iki kez dokunmak bir önceki sayfaya döner. Üç parmakla yukarı ya da aşağı kaydırmak sayfayı kaydırır. VoiceOver ile oynarken sahada düğmeler vardır.',
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
    <>
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
      <Dugme etiket={`Ses efektleri: ${durum('efekt')}`} ipucu="Hayvan sesleri ve ayak sesleri" onEtkin={() => ac('efekt', 'Ses efektleri', (y) => Efekt.efektAyarla({ acik: y }))} />
      <Dugme etiket={`Ortam sesi: ${durum('ortam')}`} ipucu="Savanın rüzgâr, kuş ve böcek sesleri" onEtkin={() => ac('ortam', 'Ortam sesi', (y) => Efekt.efektAyarla({ ortam: y ? 0.35 : 0 }))} />
      <Dugme
        etiket={`Efektleri konuşmayla karıştırma: ${durum('efektKis')}`}
        ipucu="Açıkken oyun konuşurken efekt çalmaz. Ses dalgalanmasını önler"
        onEtkin={() => ac('efektKis', 'Efektleri konuşmayla karıştırma', (y) => Efekt.efektAyarla({ kis: y }))}
      />
      <Dugme etiket={`Yön rehberi: ${durum('rehber')}`} ipucu="Bir yere ya da hayvana yürürken yönünü ve uzaklığını aralıklarla söyler" onEtkin={() => ac('rehber', 'Yön rehberi')} />
      <Dugme etiket="Geri" onEtkin={geri} stil={st.buyukDugme} />
    </>
  );
}

// ---------------- Araştırmacı yaratma ----------------
function Yarat({ bitti, iptal }) {
  const [ad, setAd] = useState('');
  const kip = useContext(KipBaglam);
  useEffect(() => {
    Ses.soyle(kip === 'kendi' ? 'Yeni araştırma. Araştırmacının adını seç.' : 'Yeni araştırma. Araştırmacının adını yaz ya da hazır adlardan birini seç.', 3);
  }, []);
  return (
    <Sayfa contentContainerStyle={st.sayfa} keyboardShouldPersistTaps="handled">
      <Baslik>Yeni araştırma</Baslik>
      {kip !== 'kendi' && (
        <>
          <TextInput
            value={ad}
            onChangeText={(t) => setAd(t.slice(0, 16))}
            placeholder="Araştırmacının adı"
            placeholderTextColor={R.soluk}
            style={st.girdi}
            accessibilityLabel="Araştırmacının adı"
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
function Oyun({ arastirmaci, ayar, cikis, ayarDegistir, sahadaBildir }) {
  const kip = useContext(KipBaglam);
  const dRef = useRef(null);
  if (!dRef.current) dRef.current = M.dunyaOlustur(arastirmaci);
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
  // VoiceOver dışında sahada bütün ekran dokunma hareketleriyle oynanır (Kayıp Okyanus gibi); menüde oyunun gezgini çalışır
  const jestli = kip !== 'voiceover';
  const aletRef = useRef(0);
  useEffect(() => {
    if (sahadaBildir) sahadaBildir(jestli && !panel);
  }, [panel, jestli]);
  useEffect(() => () => sahadaBildir && sahadaBildir(false), []);

  const kaydet = useCallback(() => {
    AsyncStorage.setItem(KAYIT_ANAHTAR, JSON.stringify(M.kayitHazirla(d.k))).catch(() => {});
  }, []);

  const ortamSec = () => {
    if (ayarRef.current.ortam === false) return Efekt.ortamDurdur();
    // Nehir, sulak alan ve gölet kıyısında su; başka yerde gündüz ya da gece savanı (30 sn'lik kesintisiz döngüler)
    const b = M.bolgeBul(d.oyuncu.x, d.oyuncu.y);
    if (b === 'sulak' || b === 'nehir' || b === 'golet') Efekt.ortamBaslat('ortam_nehir');
    else Efekt.ortamBaslat(M.geceMi(d.k.dk) || M.gunEvresi(d.k.dk) === 'aksam' ? 'ortam_gece' : 'ortam_gunduz');
  };

  useEffect(() => {
    Efekt.onYukle(['adim1', 'adim2', 'sonar_2', 'odak', 'etkinles', 'altin', 'seviye', 'hata', 'carpma']);
    ortamSec();
    let silici;
    setAltyazi('');
    Ses.altyaziDinle((m) => {
      setAltyazi(m);
      clearTimeout(silici);
      silici = setTimeout(() => setAltyazi(''), 6000);
    });
    const k = d.k;
    if (k.egitim === 0) {
      k.egitim = 1;
      Ses.soyle(
        `${M.zamanSozu(k.dk)}. Afrika savanındaki küçük araştırma istasyonundasın. Yanında bir arazi aracı, dürbün, fotoğraf makinesi ve ses kayıt cihazı var. İlk görevin: göletin çevresindeki hayvanları gözlemle.${kip === 'voiceover' ? " Yerler düğmesinden Gölet'i seç ya da Araca bin." : ' Tek parmakla sürükleyerek yürürsün. Dokununca çevreni anlatırım, çift dokununca elindeki dürbünü kullanırsın. İki parmakla iki kez dokununca menü açılır; Yerler menüsünden Gölet\'i seçebilirsin.'}`,
        3
      );
    } else Ses.soyle(`${M.zamanSozu(k.dk)}. ${M.konumOzeti(d)}`, 3);
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
    ortamSec();
  }, [ayar.ortam]);

  const efektCal = (o) => {
    const b = o.id ? M.birey(d, o.id) : null;
    switch (o.tur) {
      case 'hayvanSesi':
        if (b) Efekt.yonlu(TURLER[b.tur].ses, d.oyuncu, b, 0.95, 70);
        return;
      case 'gozlem':
      case 'vardin':
        if (b) Efekt.yonlu('sonar', d.oyuncu, b, 0.6, 200);
        return;
      case 'foto':
        Efekt.cal(o.cekildi ? 'etkinles' : 'hata', 0.9);
        return;
      case 'tanimlandi':
      case 'tanik':
        Efekt.cal('altin', 0.8);
        return;
      case 'yeniTur':
      case 'yeniDavranis':
        Efekt.cal('seviye', 0.8);
        return;
      case 'sesKayit':
        Efekt.cal('odak', 0.8);
        return;
      case 'tehdit':
      case 'avBasladi':
        if (b) Efekt.yonlu(TURLER[b.tur].ses, d.oyuncu, b, 1, 90);
        return;
      case 'saldiri':
        Efekt.cal('carpma', 1);
        return;
      case 'gozlemYok':
      case 'hata':
        Efekt.cal('hata', 0.6);
        return;
      case 'bolge':
      case 'zaman':
        ortamSec();
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
        const sonuc = M.guncelle(d, dt, girdi.current);
        const a = ayarRef.current;
        if (sonuc.carpti && simdi - carpmaSon > 1500) {
          carpmaSon = simdi;
          titret('hafif', a);
          Efekt.cal('carpma', 0.6);
          if (a.kip !== 'gorerek') Ses.soyle(sonuc.nehir ? 'Önünde nehir var. Karşıya yalnızca geçitlerden geçilir.' : sonuc.gol ? 'Önünde gölet var.' : 'Önün kapalı.', 2);
        }
        adimYol += sonuc.yurudu;
        if (adimYol > 1.5) {
          adimYol = 0;
          adimSira = !adimSira;
          Efekt.cal(adimSira ? 'adim1' : 'adim2', 0.2);
        }
        for (const o of M.olaylariAl(d)) {
          if (sahneRef.current) sahneRef.current.efekt(o);
          efektCal(o);
          if (o.tur === 'tehdit') titret('kotu', a);
          else if (o.tur === 'saldiri') titret('agir', a);
          else if (o.tur === 'yeniTur' || o.tur === 'tanimlandi' || o.tur === 'yeniDavranis') titret('iyi', a);
          else if (o.tur === 'foto' && o.cekildi) titret('hafif', a);
          if (o.metin) Ses.soyle(o.metin, o.oncelik);
          if (KALICI_OLAYLAR.includes(o.tur)) kayitSayac = 19; // önemli kayıtlar 1 saniye içinde saklanır
        }
        // Yön rehberi: bir yere ya da hayvana giderken
        const hedef = d.yaklasId ? M.gozlenen(d) : d.rota;
        if (a.rehber && a.kip !== 'gorerek' && hedef && simdi - rehberSon > 7000) {
          const m = M.mesafe(d.oyuncu, hedef);
          if (Math.abs(m - rehberMesafe) > 4) {
            rehberSon = simdi;
            rehberMesafe = m;
            Ses.soyle(`${hedef.ad || M.bireyAdi(hedef)}, ${M.saatSozu(M.saatYonu(d.oyuncu, hedef))}, ${M.metreSozu(m)}.`, 1);
          }
        }
        kayitSayac += dt;
        if (kayitSayac > 20) {
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

  // Menüde iki parmakla çift dokunuş bir önceki sayfaya döner (Kayıp Okyanus'taki gibi)
  useSihirliEylem(() => {
    const p = panelRef.current;
    if (!p) M.fotografCek(d);
    else if (p === 'menu') panelKapat();
    else panelAc('menu', 'Menü.');
  });

  const adimAt = (ileri, don, sure) => {
    girdi.current = { ileri, don };
    adimBitis.current = Date.now() + sure;
  };

  const k = d.k;
  const gb = M.gozlenen(d);
  const aracYakin = M.aracYakinMi(d);
  const alet = ALETLER[aletRef.current];

  const aracIslemi = () => {
    if (k.aracta) M.aractanIn(d);
    else if (M.aracYakinMi(d)) M.aracaBin(d);
    else M.yerGit(d, 'arac');
  };
  const durVeBitir = () => {
    const vardi = d.rota || d.yaklasId || M.gozlenen(d);
    M.dur(d);
    M.gozlemBitir(d);
    Ses.hemen(vardi ? 'Durdun, gözlem bitti.' : 'Zaten duruyorsun.');
  };
  const sahaJest = useJestler(
    {
      onSurukle: (mod, dx, dy) => {
        if (panelRef.current) return;
        if (mod === 'tek') {
          adimBitis.current = 0;
          girdi.current = { ileri: olcekle(-dy), don: olcekle(dx) };
        }
      },
      onSurukleBitti: () => {
        girdi.current = { ileri: 0, don: 0 };
      },
      onKaydir: (yon, parmak) => {
        if (panelRef.current || parmak < 2) return;
        if (yon === 'sag' || yon === 'sol') {
          aletRef.current = (aletRef.current + (yon === 'sag' ? 1 : ALETLER.length - 1)) % ALETLER.length;
          const a = ALETLER[aletRef.current];
          Efekt.cal('odak', 0.6);
          Ses.hemen(`${a.ad}. ${a.ipucu}`);
          yenile((x) => x + 1);
        } else if (yon === 'yukari') aracIslemi();
        else durVeBitir();
      },
      onDokun: (parmak) => {
        if (panelRef.current) return;
        if (parmak >= 2) return Ses.sus();
        const b = M.gozlenen(d);
        let m = b ? `${M.gozlemTarifi(d, b)}.` : M.etrafiTara(d);
        if (d.rota) m += ` ${d.rota.ad} yolundasın, ${M.saatSozu(M.saatYonu(d.oyuncu, d.rota))}, ${M.metreSozu(M.mesafe(d.oyuncu, d.rota))}.`;
        Ses.hemen(m);
      },
      onCiftDokun: (parmak) => {
        if (panelRef.current) return;
        if (parmak >= 2) {
          Efekt.cal('etkinles', 0.5);
          panelAc('menu', 'Menü. Zaman durdu.');
          return;
        }
        ALETLER[aletRef.current].kullan(d);
      },
      onUzunBas: () => {
        if (panelRef.current) return;
        Ses.hemen(`${M.durumOzeti(d)} Elindeki alet: ${ALETLER[aletRef.current].ad}.`);
      },
    },
    { dokunmaBekle: true }
  );

  const panelAc = (p, soz) => {
    if (!panelRef.current) kaydet();
    setPanel(p);
    if (soz) Ses.soyle(soz, 3);
  };
  const panelKapat = () => {
    setPanel(null);
    kaydet();
    Ses.soyle('Sahaya dönüldü.', 2);
  };
  const menuyeDon = () => panelAc('menu', 'Menü.');

  return (
    <View style={{ flex: 1, backgroundColor: '#0d1626' }}>
      <GLView style={StyleSheet.absoluteFill} onContextCreate={glHazir} accessible={false} importantForAccessibility="no-hide-descendants" accessibilityElementsHidden />
      <SafeAreaView
        style={{ flex: 1 }}
        edges={['top', 'bottom', 'left', 'right']}
        accessibilityElementsHidden={!!panel}
        importantForAccessibility={panel ? 'no-hide-descendants' : 'auto'}
      >
        {jestli ? (
          <>
            <View style={st.ust} pointerEvents="none">
              <View style={st.hud}>
                <View style={st.satir}>
                  <Text style={st.hudAd} numberOfLines={1}>
                    {k.ad} · {M.gunNo(k.dk)}. gün {M.saatMetni(k.dk)}
                  </Text>
                  <Text style={st.hudKucuk} numberOfLines={1}>
                    itibar {k.itibar}
                  </Text>
                </View>
                <Text style={st.hudKucuk} numberOfLines={1}>
                  {M.bolgeAdi(d.oyuncu.x, d.oyuncu.y)}
                  {k.aracta ? ' · araçta' : ''} · Alet: {alet.ad}
                </Text>
                {gb && (
                  <Text style={st.hudHedef} numberOfLines={2}>
                    {M.gozlemTarifi(d, gb)}
                  </Text>
                )}
                {d.sesKayit && <Text style={st.hudHedef}>Ses kaydı sürüyor…</Text>}
              </View>
            </View>
            <View style={{ flex: 1 }} pointerEvents="none" />
            <View style={st.altyaziKap} pointerEvents="none">
              {!!altyazi && (
                <Text style={st.altyazi} numberOfLines={4}>
                  {altyazi}
                </Text>
              )}
              <Text style={st.jestIpucu}>
                Sürükle: yürü · Dokun: anlat · Uzun bas: durum · Çift dokun: {alet.ad.toLocaleLowerCase('tr-TR')}
                {'\n'}İki parmak sağa/sola: alet · yukarı: araç · aşağı: dur · iki parmak çift dokun: menü
              </Text>
            </View>
            <View style={StyleSheet.absoluteFill} {...sahaJest} accessible accessibilityLabel="Saha. Tek parmakla sürükleyerek yürü, dokununca çevre anlatılır, iki parmakla iki kez dokununca menü açılır." />
          </>
        ) : (
          <>
        <View style={st.ust}>
          <Dugme etiket={`Durum. ${M.durumOzeti(d)}`} onEtkin={() => Ses.hemen(M.durumOzeti(d))} stil={st.hud}>
            <View style={st.satir}>
              <Text style={st.hudAd} numberOfLines={1}>
                {k.ad} · {M.gunNo(k.dk)}. gün {M.saatMetni(k.dk)}
              </Text>
              <Text style={st.hudKucuk} numberOfLines={1}>
                itibar {k.itibar}
              </Text>
            </View>
            <Text style={st.hudKucuk} numberOfLines={1}>
              {M.bolgeAdi(d.oyuncu.x, d.oyuncu.y)}
              {k.aracta ? ' · araçta' : ''}
            </Text>
            {gb && (
              <Text style={st.hudHedef} numberOfLines={2}>
                {M.gozlemTarifi(d, gb)}
              </Text>
            )}
            {d.sesKayit && <Text style={st.hudHedef}>Ses kaydı sürüyor…</Text>}
          </Dugme>
          <View style={st.baglamSatir}>
            {k.aracta && <Dugme etiket="Araçtan in" onEtkin={() => M.aractanIn(d)} stil={st.baglamDugme} kisa />}
            {!k.aracta && aracYakin && <Dugme etiket="Araca bin" onEtkin={() => M.aracaBin(d)} stil={st.baglamDugme} kisa />}
            {!k.aracta && !aracYakin && !d.rota && <Dugme etiket="Araca git" ipucu="Arazi aracının yanına yürür" onEtkin={() => M.yerGit(d, 'arac')} stil={st.baglamDugme} kisa />}
            {(d.rota || d.yaklasId) && (
              <Dugme
                etiket="Dur"
                ipucu="Otomatik yürüyüşü durdurur"
                onEtkin={() => {
                  M.dur(d);
                  Ses.soyle('Durdun.', 2);
                }}
                stil={st.baglamDugme}
                kisa
              />
            )}
            {gb && !d.yaklasId && (
              <Dugme
                etiket="Gözlemi bitir"
                onEtkin={() => {
                  M.gozlemBitir(d);
                  Ses.soyle('Gözlem bitti.', 2);
                }}
                stil={st.baglamDugme}
                kisa
              />
            )}
          </View>
        </View>

        <View style={{ flex: 1 }} />

        <View style={st.altyaziKap}>
          {!!altyazi && (
            <Text style={st.altyazi} numberOfLines={3} accessibilityElementsHidden importantForAccessibility="no">
              {altyazi}
            </Text>
          )}
        </View>
        <View style={st.izgara}>
          <Dugme etiket="Gözlemle" ipucu="Dürbünle sıradaki hayvanı seçer ve izler" onEtkin={() => M.gozlemBaslat(d)} kisa stil={[st.eylem, st.ana]} />
          <Dugme etiket="Yaklaş" ipucu="Seçili hayvana ürkütmeden yaklaşır" onEtkin={() => M.yaklas(d)} kisa stil={st.eylem} />
          <Dugme etiket="Fotoğraf çek" onEtkin={() => M.fotografCek(d)} kisa stil={st.eylem} />
          <Dugme etiket={d.sesKayit ? 'Kayıt sürüyor' : 'Ses kaydı'} devre={!!d.sesKayit} ipucu="6 saniye dinler ve sesleri çözümler" onEtkin={() => M.sesKaydiBaslat(d)} kisa stil={st.eylem} />
          <Dugme etiket="Etrafı tara" onEtkin={() => Ses.hemen(M.etrafiTara(d))} kisa stil={st.eylem} />
          <Dugme etiket="Neredeyim" onEtkin={() => Ses.hemen(M.konumOzeti(d))} kisa stil={st.eylem} />
          <Dugme etiket="Yerler" ipucu="Bir yere yürür ya da sürer" onEtkin={() => panelAc('yerler', 'Yerler. Gitmek istediğin yeri seç.')} kisa stil={st.eylem} />
          <Dugme etiket="Arşiv" ipucu="Ansiklopedi, bireyler, fotoğraflar, ses kayıtları" onEtkin={() => panelAc('arsiv', 'Arşiv.')} kisa stil={st.eylem} />
          <Dugme etiket="Menü" onEtkin={() => panelAc('menu', 'Menü. Zaman durdu.')} kisa stil={st.eylem} />
        </View>
        {kip === 'voiceover' ? (
          <View style={st.voSatir}>
            <Dugme etiket="Sola dön" onEtkin={() => adimAt(k.aracta ? 0.5 : 0, -1, k.aracta ? 900 : 360)} kisa stil={st.voDugme} />
            <Dugme etiket={k.aracta ? 'İleri sür' : 'İleri yürü'} ipucu={k.aracta ? 'Bir süre ileri sürer' : 'Yaklaşık 4 metre ilerler'} onEtkin={() => adimAt(1, 0, k.aracta ? 1500 : 900)} kisa stil={st.voDugme} />
            <Dugme etiket="Sağa dön" onEtkin={() => adimAt(k.aracta ? 0.5 : 0, 1, k.aracta ? 900 : 360)} kisa stil={st.voDugme} />
            <Dugme etiket="Geri git" onEtkin={() => adimAt(-1, 0, 800)} kisa stil={st.voDugme} />
          </View>
        ) : (
          <DogrudanAlan
            etiket={`Hareket alanı. Parmağını koyup kaydır: yukarı ileri, aşağı geri, sağ ve sol döndürür${k.aracta ? '. Araçtasın' : ''}`}
            basla={jBasla}
            tasi={jTasi}
            birak={jBirak}
            stil={st.hareket}
          >
            {topuz ? (
              <View pointerEvents="none" style={[st.topuzKap, { left: topuz.x - 55, top: topuz.y - 55 }]}>
                <View style={[st.topuz, { transform: [{ translateX: topuz.dx }, { translateY: topuz.dy }] }]} />
              </View>
            ) : (
              <Text style={st.solYazi} pointerEvents="none">
                {k.aracta ? 'Sürmek için' : 'Yürümek için'}
                {'\n'}parmağını koyup kaydır
              </Text>
            )}
          </DogrudanAlan>
        )}
          </>
        )}
      </SafeAreaView>

      {panel && (
        <View style={st.panelOrt} accessibilityViewIsModal>
          <Katman seviye={1}>
            <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
              <Sayfa contentContainerStyle={st.sayfa}>
                {panel === 'menu' && (
                  <>
                    <Baslik>Menü</Baslik>
                    <Dugme etiket="Sahaya dön" onEtkin={panelKapat} stil={st.buyukDugme} />
                    <Dugme etiket="Etrafı tara" onEtkin={() => Ses.hemen(M.etrafiTara(d))} />
                    <Dugme etiket="Neredeyim" onEtkin={() => Ses.hemen(M.konumOzeti(d))} />
                    <Dugme etiket="Durumumu oku" onEtkin={() => Ses.hemen(M.durumOzeti(d))} />
                    {jestli && (
                      <>
                        <Dugme
                          etiket={k.aracta ? 'Araçtan in' : aracYakin ? 'Araca bin' : 'Araca git'}
                          onEtkin={() => {
                            setPanel(null);
                            aracIslemi();
                          }}
                        />
                        {(d.rota || d.yaklasId || gb) && (
                          <Dugme
                            etiket="Dur ve gözlemi bitir"
                            onEtkin={() => {
                              setPanel(null);
                              durVeBitir();
                            }}
                          />
                        )}
                        <Dugme etiket={`Alet: ${alet.ad}. Değiştir`} ipucu="Sahada iki parmakla sağa ya da sola kaydırarak da değişir" onEtkin={() => {
                          aletRef.current = (aletRef.current + 1) % ALETLER.length;
                          Ses.hemen(`${ALETLER[aletRef.current].ad}. ${ALETLER[aletRef.current].ipucu}`);
                          yenile((x) => x + 1);
                        }} />
                      </>
                    )}
                    <Dugme etiket="Yerler" onEtkin={() => panelAc('yerler', 'Yerler.')} />
                    <Dugme etiket="Arşiv" onEtkin={() => panelAc('arsiv', 'Arşiv.')} />
                    <Dugme etiket="Nasıl oynanır" onEtkin={() => panelAc('nasil', null)} />
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
                {panel === 'yerler' && (
                  <YerlerPaneli
                    d={d}
                    git={(id) => {
                      setPanel(null);
                      M.yerGit(d, id);
                    }}
                    geri={panelKapat}
                  />
                )}
                {panel === 'arsiv' && <ArsivPaneli d={d} geri={panelKapat} />}
                {panel === 'nasil' && (
                  <>
                    <Baslik>Nasıl oynanır</Baslik>
                    {NASIL.map((m, i) => (
                      <Okunur key={i} stil={st.metin}>
                        {m}
                      </Okunur>
                    ))}
                    <Dugme etiket="Geri" onEtkin={menuyeDon} stil={st.buyukDugme} />
                  </>
                )}
                {panel === 'ayarlar' && <Ayarlar ayar={ayar} degistir={ayarDegistir} geri={menuyeDon} />}
              </Sayfa>
            </SafeAreaView>
          </Katman>
        </View>
      )}
    </View>
  );
}

function YerlerPaneli({ d, git, geri }) {
  const o = d.oyuncu;
  const tarif = (h) => `${M.saatSozu(M.saatYonu(o, h))}, ${M.metreSozu(M.mesafe(o, h))}`;
  return (
    <>
      <Baslik>Yerler</Baslik>
      <Okunur stil={st.soluk}>{d.k.aracta ? 'Araçla sürersin.' : 'Yürürsün. Uzak yerler için önce araca binebilirsin.'}</Okunur>
      {!d.k.aracta && <Dugme etiket={`Arazi aracı, ${tarif(d.k.arac)}`} onEtkin={() => git('arac')} />}
      {YERLER.map((y) => (
        <Dugme key={y.id} etiket={`${y.ad}, ${tarif(y)}`} ipucu={y.tarif} onEtkin={() => git(y.id)} />
      ))}
      <Dugme etiket="Geri" onEtkin={geri} stil={st.buyukDugme} />
    </>
  );
}

// ---------------- Arşiv: ansiklopedi, bireyler, fotoğraflar, sesler, günlük ----------------
const zamanKisa = (dk) => `${M.gunNo(dk)}. gün ${M.saatMetni(dk)}`;

function ArsivPaneli({ d, geri }) {
  const k = d.k;
  const a = k.arsiv;
  const [sekme, setSekme] = useState('turler');
  const [secili, setSecili] = useState(null); // { tur } ya da { birey }
  const sekmeler = [
    ['turler', 'Türler'],
    ['bireyler', 'Bireyler'],
    ['fotolar', 'Fotoğraflar'],
    ['sesler', 'Sesler'],
    ['gunluk', 'Günlük'],
  ];
  const ac = (s) => {
    setSecili(s);
    if (s && s.tur) Ses.soyle(`${TURLER[s.tur].ad}.`, 3);
    if (s && s.birey) Ses.soyle(`${M.bireyAdi(M.birey(d, s.birey))}.`, 3);
  };
  if (secili && secili.tur) return <TurDetay d={d} tur={secili.tur} ac={ac} geri={() => ac(null)} />;
  if (secili && secili.birey) return <BireyDetay d={d} id={secili.birey} ac={ac} geri={() => ac(null)} />;

  const kesfedilen = Object.keys(a.turler).length;
  const bireyler = M.taninanBireyler(k);
  return (
    <>
      <Baslik>Arşiv</Baslik>
      <Okunur stil={st.soluk}>
        {kesfedilen} / {TUR_SIRASI.length} tür, {bireyler.length} birey, {a.fotolar.length} fotoğraf, {a.sesler.length} ses kaydı. Bilimsel itibar {k.itibar}.
      </Okunur>
      <View style={st.sarmal}>
        {sekmeler.map(([id, ad], i) => (
          <Dugme
            key={id}
            etiket={`${ad}${sekme === id ? ', seçili' : ''}, sekme ${i + 1} / ${sekmeler.length}`}
            onEtkin={() => {
              setSekme(id);
              Ses.hemen(ad);
            }}
            stil={[st.sekme, sekme === id && { borderColor: R.vurgu }]}
          >
            <Text style={[st.dugmeYazi, { textAlign: 'center', fontSize: 15 }]}>{ad}</Text>
          </Dugme>
        ))}
      </View>
      {sekme === 'turler' &&
        M.turListesi(k).map(({ tur, t, kayit }) =>
          kayit ? (
            <Dugme
              key={tur}
              etiket={`${t.ad}, ${kayit.davranislar.length} davranış, ${M.taninanBireyler(k, tur).length} birey${kayit.sesKaydi ? ', ses kaydı var' : ''}`}
              onEtkin={() => ac({ tur })}
            />
          ) : (
            <Okunur key={tur} stil={st.soluk}>
              Henüz keşfedilmemiş bir {t.sinif.toLocaleLowerCase('tr-TR')}
            </Okunur>
          )
        )}
      {sekme === 'bireyler' &&
        (bireyler.length ? (
          bireyler.map((b) => {
            const ab = a.bireyler[b.id];
            return (
              <Dugme
                key={b.id}
                etiket={`${M.bireyAdi(b)}, ${M.kod(b)}, ${b.cinsiyet === 'erkek' ? 'erkek' : 'dişi'} ${EVRELER[b.evre]}${ab && ab.olum ? ', öldü' : ab ? `, son görülme ${zamanKisa(ab.sonDk)}` : ''}`}
                onEtkin={() => ac({ birey: b.id })}
              />
            );
          })
        ) : (
          <Okunur stil={st.metin}>Henüz tanımlanmış birey yok. Bir hayvanı Gözlemle ile birkaç saniye izle.</Okunur>
        ))}
      {sekme === 'fotolar' &&
        (a.fotolar.length ? (
          a.fotolar.slice(0, 80).map((f) => <FotoSatiri key={f.id} d={d} f={f} ac={ac} />)
        ) : (
          <Okunur stil={st.metin}>Henüz fotoğraf yok.</Okunur>
        ))}
      {sekme === 'sesler' &&
        (a.sesler.length ? (
          a.sesler.slice(0, 80).map((s) => (
            <Okunur key={s.id} stil={st.metin}>
              {M.SOZ[s.tur]}, {M.sesTuruAdi(s.sesTuru)}, saat {s.saat} yönünden yaklaşık {s.m} metre. {s.bolge}, {zamanKisa(s.dk)}.
            </Okunur>
          ))
        ) : (
          <Okunur stil={st.metin}>Henüz ses kaydı yok. Ses kaydı düğmesiyle çevreyi dinle.</Okunur>
        ))}
      {sekme === 'gunluk' &&
        (a.olaylar.length ? (
          a.olaylar.slice(0, 80).map((o, i) => (
            <Okunur key={i} stil={st.metin}>
              {zamanKisa(o.dk)}, {o.bolge}: {o.metin}
            </Okunur>
          ))
        ) : (
          <Okunur stil={st.metin}>Günlükte henüz kayıt yok. Nadir davranışlar, doğumlar ve avlanmalar burada saklanır.</Okunur>
        ))}
      <Dugme etiket="Arşivi kapat" onEtkin={geri} stil={st.buyukDugme} />
    </>
  );
}

function FotoSatiri({ d, f, ac }) {
  const b = M.birey(d, f.bireyId);
  const ad = b && M.taninmisMi(b) ? M.bireyAdi(b) : M.SOZ[f.tur];
  const etiket = `${ad}, ${M.davranisAdi(f.davranis).toLocaleLowerCase('tr-TR')}, kalite ${f.kalite}. ${f.bolge}, ${zamanKisa(f.dk)}`;
  if (b && M.taninmisMi(b)) return <Dugme etiket={etiket} ipucu="Bireyin kaydını açar" onEtkin={() => ac({ birey: b.id })} />;
  return <Okunur stil={st.metin}>{etiket}</Okunur>;
}

function TurDetay({ d, tur, ac, geri }) {
  const k = d.k;
  const t = TURLER[tur];
  const kayit = k.arsiv.turler[tur];
  const bireyler = M.taninanBireyler(k, tur);
  const fotolar = k.arsiv.fotolar.filter((f) => f.tur === tur);
  return (
    <>
      <Baslik>{t.ad}</Baslik>
      <Okunur stil={st.soluk}>
        {t.bilimsel}, {t.sinif.toLocaleLowerCase('tr-TR')}
      </Okunur>
      <Okunur stil={st.metin}>{t.tarif}</Okunur>
      {kayit && (
        <Okunur stil={st.metin}>
          İlk keşif: {zamanKisa(kayit.ilkDk)}, {kayit.ilkBolge}. Toplam gözlem {Math.max(1, Math.round(kayit.gozlemSn / 60))} dakika. {kayit.sesKaydi ? 'Sesi kayıtlı.' : 'Henüz ses kaydı yok.'} {fotolar.length} fotoğraf.
        </Okunur>
      )}
      <Okunur stil={st.altBaslik}>Kaydedilen davranışlar</Okunur>
      {kayit && kayit.davranislar.length ? (
        kayit.davranislar.map((dv) => (
          <Okunur key={dv} stil={st.metin}>
            {M.davranisAdi(dv)}
            {DAVRANISLAR[dv] && DAVRANISLAR[dv].nadir ? ', nadir' : ''}
          </Okunur>
        ))
      ) : (
        <Okunur stil={st.metin}>Henüz yok. Bu türü daha uzun izle.</Okunur>
      )}
      <Okunur stil={st.altBaslik}>Tanımlanan bireyler: {bireyler.length}</Okunur>
      {bireyler.map((b) => (
        <Dugme key={b.id} etiket={`${M.bireyAdi(b)}, ${b.cinsiyet === 'erkek' ? 'erkek' : 'dişi'} ${EVRELER[b.evre]}`} onEtkin={() => ac({ birey: b.id })} />
      ))}
      <Dugme etiket="Geri" onEtkin={geri} stil={st.buyukDugme} />
    </>
  );
}

function BireyDetay({ d, id, ac, geri }) {
  const k = d.k;
  const b = M.birey(d, id);
  if (!b) {
    return (
      <>
        <Okunur stil={st.metin}>Bu bireyin kaydı bulunamadı.</Okunur>
        <Dugme etiket="Geri" onEtkin={geri} stil={st.buyukDugme} />
      </>
    );
  }
  const ab = k.arsiv.bireyler[b.id] || {};
  const anne = M.birey(d, b.anne);
  const yavrular = k.hayvanlar.filter((x) => x.anne === b.id && M.taninmisMi(x));
  const grup = k.hayvanlar.filter((x) => x.grup === b.grup && x.id !== b.id && M.taninmisMi(x) && !x.olu && x.id !== b.anne && x.anne !== b.id);
  const fotolar = k.arsiv.fotolar.filter((f) => f.bireyId === b.id);
  return (
    <>
      <Baslik>{M.bireyAdi(b)}</Baslik>
      <Okunur stil={st.metin}>{M.bireyKunye(d, b)}</Okunur>
      <Okunur stil={st.metin}>
        İlk tanımlama {ab.ilkDk !== undefined ? zamanKisa(ab.ilkDk) : 'bilinmiyor'}. Son görülme {ab.sonDk !== undefined ? `${zamanKisa(ab.sonDk)}, ${ab.sonBolge}` : 'bilinmiyor'}. Toplam gözlem {Math.max(1, Math.round((ab.gozlemSn || 0) / 60))} dakika. Sana alışması: {b.alisma > 0.6 ? 'yüksek' : b.alisma > 0.25 ? 'orta' : 'düşük'}.
      </Okunur>
      {ab.olum && <Okunur stil={st.metin}>Ölüm kaydı: {ab.olum}.</Okunur>}
      <Okunur stil={st.altBaslik}>Aile ve grup</Okunur>
      {anne && M.taninmisMi(anne) && <Dugme etiket={`Annesi: ${M.bireyAdi(anne)}`} onEtkin={() => ac({ birey: anne.id })} />}
      {yavrular.map((y) => (
        <Dugme key={y.id} etiket={`Yavrusu: ${M.bireyAdi(y)}`} onEtkin={() => ac({ birey: y.id })} />
      ))}
      {grup.map((x) => (
        <Dugme key={x.id} etiket={`Grup arkadaşı: ${M.bireyAdi(x)}`} onEtkin={() => ac({ birey: x.id })} />
      ))}
      {!(anne && M.taninmisMi(anne)) && !yavrular.length && !grup.length && <Okunur stil={st.metin}>Grubundan henüz tanımlanan başka birey yok.</Okunur>}
      <Okunur stil={st.altBaslik}>Fotoğrafları: {fotolar.length}</Okunur>
      {fotolar.slice(0, 20).map((f) => (
        <Okunur key={f.id} stil={st.metin}>
          {M.davranisAdi(f.davranis)}, kalite {f.kalite}. {f.bolge}, {zamanKisa(f.dk)}.
        </Okunur>
      ))}
      <Dugme etiket={`Tür kaydı: ${TURLER[b.tur].ad}`} onEtkin={() => ac({ tur: b.tur })} />
      <Dugme etiket="Geri" onEtkin={geri} stil={st.buyukDugme} />
    </>
  );
}

// ---------------- Uygulama ----------------
export default function App() {
  const [ekran, setEkran] = useState('yukleniyor');
  const [ayar, setAyar] = useState(VARSAYILAN_AYAR);
  const [kayit, setKayit] = useState(null);
  const [arastirmaci, setArastirmaci] = useState(null);
  const [oyunAnahtar, setOyunAnahtar] = useState(0);
  const [sahada, setSahada] = useState(false); // sahada dokunma hareketleri çalışır, oyunun gezgini kapanır

  useEffect(() => {
    setAudioModeAsync({ playsInSilentMode: true, interruptionMode: 'mixWithOthers', shouldPlayInBackground: false })
      .then(() => setIsAudioActiveAsync(true))
      .catch(() => {});
    try {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP).catch(() => {});
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
    setArastirmaci(k);
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
        kayitOzet={kayit ? `${kayit.ad}, ${M.gunNo(kayit.dk)}. gün, ${Object.keys(kayit.arsiv.turler).length} tür` : ''}
        devam={() => basla(kayit)}
        yeni={() => setEkran('yarat')}
        ayarlar={() => setEkran('ayarlar')}
        nasil={() => setEkran('nasil')}
      />
    );
  else if (ekran === 'nasil') icerik = <Nasil geri={() => setEkran('menu')} />;
  else if (ekran === 'ayarlar')
    icerik = (
      <Sayfa contentContainerStyle={st.sayfa}>
        <Ayarlar ayar={ayar} degistir={ayarDegistir} geri={() => setEkran('menu')} />
      </Sayfa>
    );
  else if (ekran === 'yarat')
    icerik = (
      <Yarat
        iptal={() => setEkran('menu')}
        bitti={(ad) => {
          const k = M.arastirmaciOlustur(ad);
          AsyncStorage.setItem(KAYIT_ANAHTAR, JSON.stringify(k)).catch(() => {});
          setKayit(k);
          basla(k);
        }}
      />
    );
  else if (ekran === 'oyun')
    icerik = (
      <Oyun
        key={oyunAnahtar}
        arastirmaci={arastirmaci}
        ayar={ayar}
        ayarDegistir={ayarDegistir}
        sahadaBildir={setSahada}
        cikis={() => {
          setKayit(M.kayitHazirla(arastirmaci));
          setEkran('menu');
        }}
      />
    );

  return (
    <SafeAreaProvider>
      <KipBaglam.Provider value={ayar.kip || 'kendi'}>
        <Gezgin acik={ayar.kip === 'kendi' && !sahada} titresim={() => titret('hafif', ayar)}>
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
  oyunAdi: { color: R.vurgu, fontSize: 40, fontWeight: '800', marginTop: 24, letterSpacing: 1 },
  baslik: { color: R.yazi, fontSize: 28, fontWeight: '800', marginBottom: 6 },
  altBaslik: { color: R.vurgu, fontSize: 18, fontWeight: '700', marginTop: 10 },
  metin: { color: R.yazi, fontSize: 17, lineHeight: 24 },
  soluk: { color: R.soluk, fontSize: 15 },
  satir: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  sarmal: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  sekme: { paddingVertical: 10, paddingHorizontal: 12, minWidth: 110 },
  dugme: { backgroundColor: R.panel2, borderRadius: 12, paddingVertical: 14, paddingHorizontal: 14, borderWidth: 1, borderColor: R.cizgi, justifyContent: 'center' },
  dugmeBasili: { opacity: 0.7 },
  dugmeDevre: { opacity: 0.45 },
  dugmeYazi: { color: R.yazi, fontSize: 17, fontWeight: '600' },
  dugmeYaziKisa: { fontSize: 13, textAlign: 'center' },
  buyukDugme: { paddingVertical: 18, backgroundColor: '#33381f', borderColor: '#6b6a2e' },
  adDugme: { paddingVertical: 12, paddingHorizontal: 16 },
  girdi: { backgroundColor: R.panel, color: R.yazi, fontSize: 18, borderRadius: 10, padding: 14, borderWidth: 1, borderColor: R.cizgi },
  kipKap: { flex: 1, padding: 18, gap: 12, justifyContent: 'center' },
  kipSatir: { flex: 1, flexDirection: 'column', gap: 12 },
  kipYari: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  kipBuyuk: { color: R.vurgu, fontSize: 40, fontWeight: '800', marginBottom: 16 },
  kipYazi: { color: R.yazi, fontSize: 28, fontWeight: '800', textAlign: 'center' },
  kipAlt: { color: R.soluk, fontSize: 16, marginTop: 8, textAlign: 'center' },
  ust: { paddingHorizontal: 8, paddingTop: 4, gap: 6 },
  hud: { padding: 10, backgroundColor: 'rgba(21,23,26,0.82)', borderRadius: 12, gap: 3 },
  hudAd: { color: R.yazi, fontSize: 16, fontWeight: '800', flexShrink: 1 },
  hudKucuk: { color: R.soluk, fontSize: 13 },
  hudHedef: { color: '#ffe08a', fontSize: 14, fontWeight: '700' },
  baglamSatir: { flexDirection: 'row', gap: 6 },
  baglamDugme: { flex: 1, backgroundColor: '#33381f', borderColor: '#6b6a2e', paddingVertical: 10 },
  altyaziKap: { paddingHorizontal: 8, paddingBottom: 6, minHeight: 4 },
  jestIpucu: { color: 'rgba(255,255,255,0.75)', fontSize: 12, textAlign: 'center', marginTop: 6, backgroundColor: 'rgba(0,0,0,0.35)', borderRadius: 8, padding: 6, marginBottom: 6 },
  altyazi: { color: '#fff', backgroundColor: 'rgba(0,0,0,0.6)', padding: 8, borderRadius: 8, fontSize: 14 },
  izgara: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, paddingHorizontal: 8, justifyContent: 'space-between' },
  eylem: { width: '32%', height: 54, paddingHorizontal: 4, paddingVertical: 4, alignItems: 'center', backgroundColor: 'rgba(31,35,32,0.9)' },
  ana: { backgroundColor: 'rgba(60,72,32,0.95)', borderColor: '#9aa84a' },
  hareket: { height: 165, marginHorizontal: 8, marginTop: 6, marginBottom: 6, backgroundColor: 'rgba(21,23,26,0.35)', borderRadius: 16, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  voSatir: { flexDirection: 'row', gap: 6, paddingHorizontal: 8, marginTop: 6, marginBottom: 6 },
  voDugme: { flex: 1, height: 64, backgroundColor: 'rgba(31,35,32,0.9)', alignItems: 'center' },
  solYazi: { color: 'rgba(255,255,255,0.75)', fontSize: 15, textAlign: 'center' },
  topuzKap: { position: 'absolute', width: 110, height: 110, borderRadius: 55, borderWidth: 2, borderColor: 'rgba(255,255,255,0.5)', alignItems: 'center', justifyContent: 'center' },
  topuz: { width: 50, height: 50, borderRadius: 25, backgroundColor: 'rgba(255,255,255,0.7)' },
  panelOrt: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(21,23,26,0.97)' },
});
