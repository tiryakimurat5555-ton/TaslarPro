// Vahşi Yaşam — erişilebilir, kendi sesiyle konuşan 3B doğa araştırması ve ekosistem simülasyonu (Afrika savanı).
// Tasarım: 113 kararlık proje brifi. Aşama 1-4: teknik temel, saha, hayvanlar ve gözlem, araştırma merkezi.
// Kayıp Okyanus düzeni: sahada tam ekran dokunma hareketleri, menüler kendi kendini okuyan listeler (oyun/SesliListe.js)
// ve alt menü yığını. VoiceOver ile oynarken aynı menüler VoiceOver düğmeleri olarak çizilir.
// Yapı: oyun/veri.js, oyun/mantik.js (saf mantık), oyun/merkez.js (araştırma merkezi), oyun/ses.js (konuşma),
// oyun/efekt.js (3B konumlu sesler), oyun/sahne.js (3B çizim), oyun/jestler.js (dokunma hareketleri).
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { View, Text, Pressable, StyleSheet, AccessibilityInfo, AppState } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { GLView } from 'expo-gl';
import * as Haptics from 'expo-haptics';
import { setAudioModeAsync, setIsAudioActiveAsync } from 'expo-audio';
import * as ScreenOrientation from 'expo-screen-orientation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Ses from './oyun/ses.js';
import * as M from './oyun/mantik.js';
import * as Mz from './oyun/merkez.js';
import * as Efekt from './oyun/efekt.js';
import { sahneKur } from './oyun/sahne.js';
import { TURLER, TUR_SIRASI, YERLER, DAVRANISLAR, EVRELER } from './oyun/veri.js';
import { useJestler } from './oyun/jestler.js';
import { Liste, useMenuYigini, altMenu, sayfali, RENK } from './oyun/SesliListe.js';

const OYUN_ADI = 'Vahşi Yaşam';
const AYAR_ANAHTAR = 'vahsi-yasam-ayar-v1';
const KAYIT_ANAHTAR = 'vahsi-yasam-kayit-v1';
const VARSAYILAN_AYAR = { kip: null, hiz: 1.0, titresim: true, rehber: true, efekt: true, efektKis: true, ortam: true };
const ADLAR = ['Defne', 'Kaan', 'Ada', 'Deniz', 'Ilgaz', 'Elif', 'Atlas', 'Zeynep', 'Toprak', 'Yağmur', 'Mert', 'Selin'];

const KipBaglam = createContext('kendi');
const KALICI_OLAYLAR = ['tanimlandi', 'yeniTur', 'yeniDavranis', 'foto', 'tanik', 'sesKayit', 'saldiri', 'analizBitti', 'gorevBitti'];

// Sahadaki aletler (iki parmakla sağa/sola kaydırarak değişir, çift dokunuş kullanır)
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

// VoiceOver kipinde sahadaki düğmeler
function Dugme({ etiket, ipucu, onEtkin, stil, devre }) {
  return (
    <Pressable
      onPress={() => !devre && onEtkin && onEtkin()}
      accessibilityRole="button"
      accessibilityLabel={etiket}
      accessibilityHint={ipucu}
      accessibilityState={{ disabled: !!devre }}
      style={({ pressed }) => [st.dugme, stil, devre && st.dugmeDevre, pressed && st.dugmeBasili]}
    >
      <Text style={st.dugmeYazi} numberOfLines={3}>
        {etiket}
      </Text>
    </Pressable>
  );
}

const geriOgesi = (f) => ({ id: 'geri', etiket: 'Geri', ikincil: true, sec: () => (f(), 'sessiz') });
const zamanKisa = (dk) => `${M.gunNo(dk)}. gün ${M.saatMetni(dk)}`;
const kucuk = (s) => s.toLocaleLowerCase('tr-TR');

// ---------------- Nasıl oynanır (Kayıp Okyanus Yardım gibi konu konu) ----------------
const YARDIM = [
  {
    id: 'amac',
    baslik: 'Oyunun amacı',
    satirlar: [
      'Afrika savanında bağımsız bir doğa araştırmacısısın. Avlanma ya da savaş yoktur; hayvanları rahatsız etmeden izlersin.',
      'Hayvanları gözlemle, her bireyi tanımlayıp kimlik numarasıyla kaydet, davranışlarını belgele, fotoğraflarını çek ve seslerini kaydet.',
      'Araştırma merkezinde verilerini analiz et, kurumların görevlerini tamamla, bütçeni büyüt; ekipman, tesis ve personelle merkezini geliştir.',
    ],
  },
  {
    id: 'saha',
    baslik: 'Sahada hareketler',
    satirlar: [
      'Telefonu dik tut ve kulaklık tak. Hayvanlar bulundukları yönden ses verir: soldaki sol kulaktan, arkadaki boğuk, uzaktaki kısık duyulur.',
      'Tek parmakla sürükle: yukarı ileri yürür, aşağı geri gider, sağa ve sola döndürür. Araçtayken sürersin.',
      'Dokun: izlediğin hayvanı ya da çevreni anlatır. Uzun bas: durumunu ve elindeki aleti söyler.',
      'Çift dokun: elindeki aleti kullanır. İki parmakla sağa ya da sola kaydır: alet değiştirir. Aletler dürbün, fotoğraf makinesi, ses kayıt cihazı ve yaklaşmadır.',
      'İki parmakla yukarı kaydır: araca biner ya da inersin; araç uzaktaysa yanına yürürsün. İki parmakla aşağı kaydır: durur ve gözlemi bitirirsin.',
      'İki parmakla dokun: konuşmayı susturur. İki parmakla iki kez dokun: menüyü açar.',
    ],
  },
  {
    id: 'menu',
    baslik: 'Menülerde gezinme',
    satirlar: [
      'Sağa kaydır: sonraki satır. Sola kaydır: önceki satır. Bir satıra dokun: o satırı okur. Parmağını yavaşça gezdirmek de satırları okur.',
      'Ekranın herhangi bir yerine çift dokun: okunan satırı seçer. Uzun bas: satırı açıklamasıyla yeniden okur.',
      'İki parmakla çift dokun: bir önceki menüye döner; ana menüdeysen sahaya döndürür. Menü açıkken zaman durur.',
      'VoiceOver ile oynarken menüler VoiceOver düğmeleridir; Z hareketi bir önceki menüye döndürür.',
    ],
  },
  {
    id: 'gozlem',
    baslik: 'Gözlem, fotoğraf ve ses',
    satirlar: [
      'Dürbün: görebildiğin en yakın hayvanı seçer; her kullanışta sıradakine geçer. Bir hayvanı birkaç saniye izleyince tanımlanır ve kimlik numarası alır, örneğin Zebra 3.',
      'Yeni davranışları izledikçe ansiklopedine kaydedilir. Pusuya yatma, avlanma, emzirme gibi nadir davranışlar bilimsel itibarını çok artırır.',
      'Yaklaşma: seçili hayvana ürkütmeden yürür ve güvenli izleme mesafesinde durur. Çok yaklaşırsan hayvanlar kaçar.',
      'Fil, manda, su aygırı, gergedan, aslan ve timsah önce uyarır; geri çekilmezsen sana doğru hamle yapar.',
      'Fotoğraf makinesi: yeterince yakın ama ürkütmeyecek kadar uzaktan çek. Nadir davranışların çok iyi kareleri dergilere satılır.',
      'Ses kayıt cihazı: 6 saniye dinler; hangi türün, hangi yönden, ne kadar uzaktan ve ne tür bir ses çıkardığını söyler.',
      'Hayvanlar seni zamanla tanır: uzaktan ve sakin izlediğin bireyler sana alışır. Araçtan izlemek daha az ürkütür.',
    ],
  },
  {
    id: 'dunya',
    baslik: 'Savan, zaman ve yerler',
    satirlar: [
      'Zaman oyun açıkken akar, kapalıyken durur. Bir gün 48 dakika sürer. Gündüz otçullar otlar; akşam ve gece yırtıcılar avlanır. Gece dürbünle görüş kısalır.',
      'Savanda gölet, nehir, nehrin güneyinde sulak alan, batıda kayalık ve mağara girişi, kuzeyde akasya ağaçlığı var. Nehir yalnızca iki geçitten geçilir.',
      'Menüdeki Yerler seni istediğin yere yürütür ya da araçla götürür. Saat yönleri: 12 tam önün, 3 sağın, 6 arkan, 9 solun.',
    ],
  },
  {
    id: 'merkez',
    baslik: 'Araştırma merkezi',
    satirlar: [
      'Menüdeki Araştırma merkezinde bütçeni, mesajlarını, görevlerini, araştırmalarını, ekipmanını, tesislerini ve personelini yönetirsin.',
      'Her gün personel maaşı ve tesis bakımı kendiliğinden ödenir. Bilimsel itibarın arttıkça kuruluşlar her gün destek gönderir.',
      'Görevler: üniversiteler ve vakıflar her gün teklif gönderir. Kabul edip tamamlayınca ödül hesabına yatar.',
      'Araştırmalar: gereken veriyi topladığında analizi başlat. Analiz bitince fon, itibar ya da yeni ekipman açılır.',
      'Kamera tuzakları önünden geçen hayvanları gece gündüz fotoğraflar. GPS tasmasını veterinerin takar; tasmalı hayvanın yerini her an bilirsin.',
    ],
  },
];

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
        <Text style={st.oyunAdi} accessibilityRole="header">
          {OYUN_ADI}
        </Text>
        <Text style={st.metin}>VoiceOver açık. İstersen VoiceOver ile oynayabilirsin. Oyunun kendi sesini tercih edersen önce VoiceOver'ı kapat, sonra ekranın alt yarısına dokun.</Text>
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

// ---------------- Ayar ve yardım listeleri (hem ana menüde hem oyun menüsünde) ----------------
function ayarOgeleri(ayar, degistir) {
  const kipAdi = { kendi: 'oyunun kendi sesi', voiceover: 'VoiceOver', gorerek: 'görerek' };
  const ac = (anahtar, ad, sonra) => {
    const yeni = ayar[anahtar] === false;
    degistir({ [anahtar]: yeni });
    if (sonra) sonra(yeni);
    Ses.hemen(`${ad} ${yeni ? 'açık' : 'kapalı'}`);
    return 'sessiz';
  };
  const durum = (a) => (ayar[a] !== false ? 'açık' : 'kapalı');
  const kipler = ['kendi', 'gorerek', 'voiceover'];
  return [
    {
      id: 'kip',
      etiket: `Oynama biçimi: ${kipAdi[ayar.kip]}. Değiştir`,
      ipucu: 'Oyunun kendi sesi, görerek ve VoiceOver arasında geçer.',
      sec: () => {
        const y = kipler[(kipler.indexOf(ayar.kip) + 1) % kipler.length];
        degistir({ kip: y });
        Ses.ayarla({ kip: y });
        Ses.hemen(`Oynama biçimi: ${kipAdi[y]}.`);
        return 'sessiz';
      },
    },
    {
      id: 'hizArt',
      etiket: `Konuşma hızı: ${Math.round(ayar.hiz * 100)}. Hızlandır`,
      sec: () => {
        const h = Math.min(1.8, Math.round((ayar.hiz + 0.1) * 10) / 10);
        degistir({ hiz: h });
        Ses.ayarla({ hiz: h });
        Ses.hemen(`Konuşma hızı ${Math.round(h * 100)}`);
        return 'sessiz';
      },
    },
    {
      id: 'hizAz',
      etiket: 'Konuşmayı yavaşlat',
      sec: () => {
        const h = Math.max(0.6, Math.round((ayar.hiz - 0.1) * 10) / 10);
        degistir({ hiz: h });
        Ses.ayarla({ hiz: h });
        Ses.hemen(`Konuşma hızı ${Math.round(h * 100)}`);
        return 'sessiz';
      },
    },
    { id: 'titresim', etiket: `Titreşim: ${durum('titresim')}. Değiştir`, sec: () => ac('titresim', 'Titreşim') },
    { id: 'efekt', etiket: `Ses efektleri: ${durum('efekt')}. Değiştir`, ipucu: 'Hayvan sesleri ve ayak sesleri.', sec: () => ac('efekt', 'Ses efektleri', (y) => Efekt.efektAyarla({ acik: y })) },
    { id: 'ortam', etiket: `Ortam sesi: ${durum('ortam')}. Değiştir`, ipucu: 'Savanın rüzgâr, böcek ve nehir sesleri.', sec: () => ac('ortam', 'Ortam sesi', (y) => Efekt.efektAyarla({ ortam: y ? 0.35 : 0 })) },
    {
      id: 'efektKis',
      etiket: `Efektleri konuşmayla karıştırma: ${durum('efektKis')}. Değiştir`,
      ipucu: 'Açıkken oyun konuşurken efekt çalmaz; ses dalgalanmasını önler.',
      sec: () => ac('efektKis', 'Efektleri konuşmayla karıştırma', (y) => Efekt.efektAyarla({ kis: y })),
    },
    { id: 'rehber', etiket: `Yön rehberi: ${durum('rehber')}. Değiştir`, ipucu: 'Bir yere ya da hayvana giderken yönünü ve uzaklığını aralıklarla söyler.', sec: () => ac('rehber', 'Yön rehberi') },
  ];
}
// Yardım menüsü: konular alt menü, her satır okunur
function yardimListesi(menu, onek) {
  if (menu.ust && menu.ust.startsWith(onek + 'y-')) {
    const y = YARDIM.find((x) => onek + 'y-' + x.id === menu.ust);
    return { baslik: y.baslik, ogeler: [...y.satirlar.map((m, i) => ({ id: 's' + i, etiket: m })), geriOgesi(menu.geri)] };
  }
  return null;
}
const yardimKonulari = (menu, onek) => YARDIM.map((y) => altMenu(onek + 'y-' + y.id, y.baslik, menu.ac));

// ---------------- Ana menü (oyun dışı) ----------------
function AnaMenu({ kip, kayit, devam, yeni, ayar, ayarDegistir }) {
  const menu = useMenuYigini();
  const [, yenile] = useState(0);
  const y = yardimListesi(menu, '');
  if (y) return <Liste key={menu.ust} kip={kip} baslik={y.baslik} ogeler={y.ogeler} onGeri={menu.geri} {...menu.odak(menu.ust)} />;
  if (menu.ust === 'yardim') return <Liste key="yardim" kip={kip} baslik="Nasıl oynanır" ogeler={[...yardimKonulari(menu, ''), geriOgesi(menu.geri)]} onGeri={menu.geri} {...menu.odak('yardim')} />;
  if (menu.ust === 'ayarlar')
    return (
      <Liste
        key="ayarlar"
        kip={kip}
        baslik="Ayarlar"
        ogeler={[
          ...ayarOgeleri(ayar, (d) => {
            ayarDegistir(d);
            yenile((x) => x + 1);
          }),
          geriOgesi(menu.geri),
        ]}
        onGeri={menu.geri}
        {...menu.odak('ayarlar')}
      />
    );
  if (menu.ust === 'adlar')
    return (
      <Liste
        key="adlar"
        kip={kip}
        baslik="Yeni araştırma"
        giris={kayit ? 'Dikkat: kayıtlı araştırman silinir. Araştırmacının adını seç.' : 'Araştırmacının adını seç.'}
        ogeler={[...ADLAR.map((a) => ({ id: a, etiket: a, sec: () => (yeni(a), 'sessiz') })), geriOgesi(menu.geri)]}
        onGeri={menu.geri}
      />
    );
  const ogeler = [];
  if (kayit)
    ogeler.push({
      id: 'devam',
      etiket: `Devam et: ${kayit.ad}, ${M.gunNo(kayit.dk)}. gün, ${Object.keys(kayit.arsiv.turler).length} tür, ${Object.keys(kayit.arsiv.bireyler).length} birey`,
      sec: () => (devam(), 'sessiz'),
    });
  ogeler.push(altMenu('adlar', 'Yeni araştırma', menu.ac, kayit ? 'Kayıtlı araştırman silinir.' : undefined));
  ogeler.push(altMenu('yardim', 'Nasıl oynanır', menu.ac));
  ogeler.push(altMenu('ayarlar', 'Ayarlar', menu.ac));
  return (
    <Liste
      key="ana"
      kip={kip}
      baslik={OYUN_ADI}
      giris="Afrika savanında doğa araştırması. Kulaklıkla oyna."
      ogeler={ogeler}
      {...menu.odak('ana')}
    />
  );
}

// ---------------- Oyun ----------------
function Oyun({ arastirmaci, ayar, cikis, ayarDegistir }) {
  const kip = useContext(KipBaglam);
  const dRef = useRef(null);
  if (!dRef.current) {
    dRef.current = M.dunyaOlustur(arastirmaci);
    Mz.baslat(dRef.current);
  }
  const d = dRef.current;
  globalThis.__vahsiDunya = d; // denemeler için
  const sahneRef = useRef(null);
  const girdi = useRef({ ileri: 0, don: 0 });
  const adimBitis = useRef(0);
  const menu = useMenuYigini();
  const menuRef = useRef(null);
  menuRef.current = menu.ust;
  const [, yenile] = useState(0);
  const [altyazi, setAltyazi] = useState('');
  const ayarRef = useRef(ayar);
  ayarRef.current = ayar;
  // VoiceOver dışında sahada bütün ekran dokunma hareketleriyle oynanır (Kayıp Okyanus gibi)
  const jestli = kip !== 'voiceover';
  const aletRef = useRef(0);

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
    Efekt.onYukle(['adim1', 'adim2', 'sonar_2', 'odak', 'etkinles', 'altin', 'seviye', 'hata', 'carpma', 'sinir']);
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
        `${M.zamanSozu(k.dk)}. Afrika savanındaki küçük araştırma istasyonundasın. Yanında bir arazi aracı, dürbün, fotoğraf makinesi ve ses kayıt cihazı var. İlk görevin: göletin çevresindeki hayvanları gözlemle.${
          kip === 'voiceover'
            ? " Yerler düğmesinden Gölet'i seç ya da Araca bin."
            : " Tek parmakla sürükleyerek yürürsün. Dokununca çevreni anlatırım, çift dokununca elindeki dürbünü kullanırsın. İki parmakla iki kez dokununca menü açılır; menüdeki Yerler'den Gölet'i seçebilirsin."
        }`,
        3
      );
    } else Ses.soyle(`${M.zamanSozu(k.dk)}. ${M.konumOzeti(d)}${Mz.okunmamis(k) ? ` ${Mz.okunmamis(k)} okunmamış mesajın var.` : ''}`, 3);
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
      case 'gorevBitti':
        Efekt.cal('altin', 0.8);
        return;
      case 'yeniTur':
      case 'yeniDavranis':
      case 'analizBitti':
        Efekt.cal('seviye', 0.8);
        return;
      case 'sesKayit':
      case 'mesaj':
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
      if (!menuRef.current) {
        const sonuc = M.guncelle(d, dt, girdi.current);
        Mz.guncelle(d);
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
          else if (['yeniTur', 'tanimlandi', 'yeniDavranis', 'analizBitti', 'gorevBitti'].includes(o.tur)) titret('iyi', a);
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
      if (sahneRef.current && !menuRef.current) {
        try {
          sahneRef.current.kare(dt);
        } catch (e) {
          sahneRef.current = null;
        }
      }
      hudSayac += dt;
      if (hudSayac > 0.25) {
        hudSayac = 0;
        if (!menuRef.current) yenile((x) => x + 1);
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

  const adimAt = (ileri, don, sure) => {
    girdi.current = { ileri, don };
    adimBitis.current = Date.now() + sure;
  };

  const k = d.k;
  const gb = M.gozlenen(d);
  const aracYakin = M.aracYakinMi(d);
  const alet = ALETLER[aletRef.current];

  const menuAc = (id, soz) => {
    if (!menuRef.current) kaydet();
    girdi.current = { ileri: 0, don: 0 };
    menu.ac(id);
    if (soz) Ses.hemen(soz);
  };
  const menuKapat = (soz = 'Sahaya dönüldü.') => {
    menu.kapat();
    kaydet();
    if (soz) Ses.soyle(soz, 3);
  };
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
  const aletSec = (i) => {
    aletRef.current = i;
    const a = ALETLER[i];
    Efekt.cal('odak', 0.6);
    Ses.hemen(`${a.ad}. ${a.ipucu}`);
    yenile((x) => x + 1);
  };
  const sahaJest = useJestler(
    {
      onSurukle: (mod, dx, dy) => {
        if (menuRef.current) return;
        if (mod === 'tek') {
          adimBitis.current = 0;
          girdi.current = { ileri: olcekle(-dy), don: olcekle(dx) };
        }
      },
      onSurukleBitti: () => {
        girdi.current = { ileri: 0, don: 0 };
      },
      onKaydir: (yon, parmak) => {
        if (menuRef.current || parmak < 2) return;
        if (yon === 'sag' || yon === 'sol') aletSec((aletRef.current + (yon === 'sag' ? 1 : ALETLER.length - 1)) % ALETLER.length);
        else if (yon === 'yukari') aracIslemi();
        else durVeBitir();
      },
      onDokun: (parmak) => {
        if (menuRef.current) return;
        if (parmak >= 2) return Ses.sus();
        const b = M.gozlenen(d);
        let m = b ? `${M.gozlemTarifi(d, b)}.` : M.etrafiTara(d);
        if (d.rota) m += ` ${d.rota.ad} yolundasın, ${M.saatSozu(M.saatYonu(d.oyuncu, d.rota))}, ${M.metreSozu(M.mesafe(d.oyuncu, d.rota))}.`;
        Ses.hemen(m);
      },
      onCiftDokun: (parmak) => {
        if (menuRef.current) return;
        if (parmak >= 2) {
          Efekt.cal('etkinles', 0.5);
          menuAc('ana');
          return;
        }
        ALETLER[aletRef.current].kullan(d);
      },
      onUzunBas: () => {
        if (menuRef.current) return;
        Ses.hemen(`${M.durumOzeti(d)} Elindeki alet: ${ALETLER[aletRef.current].ad}.`);
      },
    },
    { dokunmaBekle: true }
  );

  // ---------- Oyun menüsü (Kayıp Okyanus dalış ve gemi menüleri gibi) ----------
  const geri = () => (menu.yol.length <= 1 ? menuKapat() : menu.geri());
  const kapatVe = (f) => () => {
    menu.kapat();
    kaydet();
    f();
    return 'sessiz';
  };
  const liste = (anahtar, baslik, ogeler, giris) => (
    <Liste key={anahtar} kip={kip} baslik={baslik} giris={giris} ogeler={[...ogeler, geriOgesi(geri)]} onGeri={geri} {...menu.odak(anahtar)} />
  );
  const bilgi = (id, etiket, ipucu) => ({ id, etiket, ipucu });
  // Menüde bir işlem yapar, sonucunu söyler ve menüyü yeni değerlerle yeniden çizer
  const yap = (f) => () => {
    Ses.hemen(f());
    yenile((x) => x + 1);
    return 'sessiz';
  };
  const yerTarifi = (h) => `${M.saatSozu(M.saatYonu(d.oyuncu, h))}, ${M.metreSozu(M.mesafe(d.oyuncu, h))}`;

  const menuIcerigi = () => {
    const u = menu.ust;
    if (!u) return null;
    const yardim = yardimListesi(menu, 'o');
    if (yardim) return liste(u, yardim.baslik, yardim.ogeler.slice(0, -1));
    if (u === 'ana') {
      const ogeler = [
        { id: 'saha', etiket: 'Sahaya dön', sec: () => (menuKapat(), 'sessiz') },
        bilgi('durum', `Durum: ${M.durumOzeti(d)}`),
        altMenu('cevre', `Görüş alanındaki hayvanlar: ${M.gorunurler(d).length}`, menu.ac),
        altMenu('yerler', 'Yerler ve yolculuk', menu.ac),
        { id: 'arac', etiket: k.aracta ? 'Araçtan in' : aracYakin ? 'Araca bin' : `Araca git: ${yerTarifi(k.arac)}`, sec: kapatVe(aracIslemi) },
        altMenu('alet', `Alet: ${alet.ad}. Değiştir`, menu.ac),
      ];
      if (d.rota || d.yaklasId || gb) ogeler.push({ id: 'dur', etiket: 'Dur ve gözlemi bitir', sec: kapatVe(durVeBitir) });
      const sahaVar = k.stok.tuzak || k.tuzaklar.length || k.stok.tasma || k.gpsli.length;
      if (sahaVar) ogeler.push(altMenu('saha', `Saha ekipmanı: ${k.tuzaklar.length} kamera tuzağı kurulu, ${k.gpsli.length} tasmalı hayvan`, menu.ac));
      const ok = Mz.okunmamis(k);
      ogeler.push(altMenu('merkez', `Araştırma merkezi: bütçe ${Mz.liraSozu(k.butce)}${ok ? `, ${ok} okunmamış mesaj` : ''}`, menu.ac));
      ogeler.push(altMenu('arsiv', `Arşiv: ${Object.keys(k.arsiv.turler).length} / ${TUR_SIRASI.length} tür, ${M.taninanBireyler(k).length} birey`, menu.ac));
      ogeler.push(altMenu('ayarlar', 'Ayarlar', menu.ac));
      ogeler.push(altMenu('yardim', 'Nasıl oynanır', menu.ac));
      ogeler.push({
        id: 'cik',
        etiket: 'Kaydet ve ana menüye dön',
        ikincil: true,
        sec: () => {
          kaydet();
          cikis();
          return 'sessiz';
        },
      });
      return <Liste key="ana" kip={kip} baslik="Menü" giris={`${M.zamanSozu(k.dk)}. ${M.bolgeAdi(d.oyuncu.x, d.oyuncu.y)}. Zaman durdu.`} ogeler={ogeler} onGeri={geri} {...menu.odak('ana')} />;
    }
    if (u === 'cevre') {
      const l = M.gorunurler(d).slice(0, 20);
      const ogeler = l.map(({ b }) => ({ id: 'h' + b.id, etiket: M.gozlemTarifi(d, b), ipucu: 'Seçince bu hayvanı gözlemlersin.', sec: kapatVe(() => M.gozlemBaslat(d, b.id)) }));
      const kule = Mz.kuleTaramasi(d);
      if (kule) ogeler.unshift(bilgi('kule', kule));
      if (!ogeler.length) ogeler.push(bilgi('bos', `Dürbünle görebileceğin ${M.durbunMenzili(k.dk, k)} metre içinde hayvan yok. ${M.etrafiTara(d)}`));
      return liste(u, 'Görüş alanındaki hayvanlar', ogeler);
    }
    if (u === 'yerler') {
      const ogeler = [];
      if (!k.aracta) ogeler.push({ id: 'arac', etiket: `Arazi aracı, ${yerTarifi(k.arac)}`, sec: kapatVe(() => M.yerGit(d, 'arac')) });
      YERLER.forEach((y) => ogeler.push({ id: y.id, etiket: `${y.ad}, ${yerTarifi(y)}`, ipucu: y.tarif, sec: kapatVe(() => M.yerGit(d, y.id)) }));
      Mz.gpsListesi(d)
        .filter((b) => !b.olu)
        .forEach((b) =>
          ogeler.push({
            id: 'g' + b.id,
            etiket: `GPS: ${Mz.gpsTarifi(d, b)}. Yanına git`,
            sec: kapatVe(() => {
              M.gozlemBaslat(d, b.id);
              M.yaklas(d);
            }),
          })
        );
      return liste(u, 'Yerler ve yolculuk', ogeler, k.aracta ? 'Araçla sürersin.' : 'Yürürsün. Uzak yerler için önce araca binebilirsin.');
    }
    if (u === 'alet') {
      return liste(
        u,
        'Alet seç',
        ALETLER.map((a, i) => ({ id: a.id, etiket: `${a.ad}${i === aletRef.current ? ', elinde' : ''}`, ipucu: a.ipucu, sec: () => (aletSec(i), menu.geri(), 'sessiz') }))
      );
    }
    if (u === 'saha') {
      const ogeler = [
        {
          id: 'kur',
          etiket: `Buraya kamera tuzağı kur: ${k.stok.tuzak} stokta, ${k.tuzaklar.length} / ${Mz.tuzakKapasitesi(k)} kurulu`,
          sec: yap(() => Mz.tuzakKur(d)),
        },
        ...k.tuzaklar.map((t) => ({
          id: 't' + t.id,
          etiket: `Tuzak, ${t.bolge}: ${t.foto} fotoğraf, ${yerTarifi(t)}. Topla`,
          ipucu: 'Toplamak için 8 metre içinde olmalısın.',
          sec: yap(() => Mz.tuzakTopla(d, t.id)),
        })),
        {
          id: 'tasma',
          etiket: `GPS tasması tak${gb ? `: ${M.bireyAdi(gb)}` : ''}. ${k.stok.tasma} stokta`,
          ipucu: 'Gözlediğin tanımlı yetişkin hayvana veteriner takar.',
          sec: yap(() => Mz.tasmaTak(d)),
        },
        ...Mz.gpsListesi(d).map((b) => bilgi('g' + b.id, `GPS: ${Mz.gpsTarifi(d, b)}`)),
      ];
      return liste(u, 'Saha ekipmanı', ogeler);
    }
    // ----- Araştırma merkezi -----
    if (u === 'merkez') {
      const suren = Mz.ARASTIRMALAR.filter((a) => Mz.arastirmaDurumu(k, a).analiz).length;
      const hazir = Mz.ARASTIRMALAR.filter((a) => Mz.arastirmaDurumu(k, a).hazir).length;
      const ogeler = [
        bilgi('butce', `Bütçe ${Mz.liraSozu(k.butce)}. Günlük gider ${Mz.liraSozu(Mz.gunlukGider(k))}, günlük destek ${Mz.liraSozu(Mz.gunlukDestek(k))}. Bilimsel itibar ${k.itibar}.`),
        altMenu('mesajlar', `Mesajlar: ${Mz.okunmamis(k)} okunmamış, toplam ${k.mesajlar.length}`, menu.ac),
        altMenu('gorevler', `Görevler: ${k.teklifler.filter((t) => t.durum === 'kabul').length} süren, ${k.teklifler.filter((t) => t.durum === 'teklif').length} teklif`, menu.ac),
        altMenu('arastirmalar', `Araştırmalar: ${hazir} analize hazır, ${suren} analizde`, menu.ac),
        altMenu('ekipman', 'Ekipman', menu.ac),
        altMenu('tesisler', `Tesisler: ${k.tesisler.length} / ${Object.keys(Mz.TESISLER).length} kurulu`, menu.ac),
        altMenu('personel', `Personel: ${k.personel.length} / ${Mz.personelKapasitesi(k)}`, menu.ac),
      ];
      return liste(u, 'Araştırma merkezi', ogeler);
    }
    if (u === 'mesajlar' || u.startsWith('mesajlar~')) {
      const tum = k.mesajlar.map((m) => {
        const t = m.teklifId ? k.teklifler.find((x) => x.id === m.teklifId && x.durum === 'teklif') : null;
        return {
          id: 'm' + m.id,
          etiket: `${m.okundu ? '' : 'Yeni. '}${zamanKisa(m.dk)}: ${m.metin}`,
          ipucu: t ? 'Seçince teklifi kabul edersin.' : undefined,
          sec: () => {
            m.okundu = true;
            if (t) Ses.hemen(Mz.teklifKabul(k, t.id));
            else Ses.hemen(m.metin);
            return 'sessiz';
          },
        };
      });
      k.mesajlar.forEach((m) => (m.okundu = true));
      const s = sayfali('mesajlar', tum, menu, 10);
      if (s.sayfa) return liste(s.sayfa.anahtar, s.sayfa.baslik, s.sayfa.ogeler);
      return liste(u, 'Mesajlar', s.ogeler.length ? s.ogeler : [bilgi('bos', 'Mesaj yok.')]);
    }
    if (u === 'gorevler') {
      const ogeler = [];
      k.teklifler
        .filter((t) => t.durum === 'kabul')
        .forEach((t) => ogeler.push(bilgi('k' + t.id, `Süren görev. ${Mz.teklifMetni(k, t)}`)));
      k.teklifler
        .filter((t) => t.durum === 'teklif')
        .forEach((t) => ogeler.push(altMenu('teklif-' + t.id, `Teklif. ${Mz.teklifMetni(k, t)}`, menu.ac, 'Kabul etmek ya da geri çevirmek için seç.')));
      if (!ogeler.length) ogeler.push(bilgi('bos', 'Şu an görev ya da teklif yok. Her gün yeni teklif gelir.'));
      return liste(u, 'Görevler', ogeler, 'Aynı anda en çok 3 görev yürütebilirsin.');
    }
    if (u.startsWith('teklif-')) {
      const t = k.teklifler.find((x) => 'teklif-' + x.id === u);
      if (!t) return liste(u, 'Teklif', [bilgi('yok', 'Bu teklif artık geçerli değil.')]);
      return liste(u, t.kurum, [
        bilgi('t', Mz.teklifMetni(k, t)),
        { id: 'kabul', etiket: 'Kabul et', sec: () => (Ses.hemen(Mz.teklifKabul(k, t.id)), menu.geri(), yenile((x) => x + 1), 'sessiz') },
        { id: 'red', etiket: 'Geri çevir', sec: () => (Ses.hemen(Mz.teklifReddet(k, t.id)), menu.geri(), yenile((x) => x + 1), 'sessiz') },
      ]);
    }
    if (u === 'arastirmalar') {
      const ogeler = Mz.ARASTIRMALAR.map((a) => {
        const dur = Mz.arastirmaDurumu(k, a);
        return { id: a.id, etiket: dur.metin, sec: dur.hazir ? yap(() => Mz.analizBaslat(k, a.id)) : undefined };
      });
      return liste(u, 'Araştırmalar', ogeler, `Laboratuvarda aynı anda ${Mz.analizKapasitesi(k)} analiz yapılabilir.`);
    }
    if (u === 'ekipman') {
      const ogeler = Object.keys(Mz.EKIPMANLAR).map((id) => {
        const dur = Mz.ekipmanDurumu(k, id);
        return { id, etiket: dur.metin, ipucu: Mz.EKIPMANLAR[id].tarif, sec: dur.sahip ? undefined : yap(() => Mz.ekipmanAl(k, id)) };
      });
      return liste(u, 'Ekipman', ogeler, `Bütçe ${Mz.liraSozu(k.butce)}.`);
    }
    if (u === 'tesisler') {
      const ogeler = Object.keys(Mz.TESISLER).map((id) => {
        const dur = Mz.tesisDurumu(k, id);
        return { id, etiket: dur.metin, ipucu: Mz.TESISLER[id].tarif, sec: dur.sahip ? undefined : yap(() => Mz.tesisKur(k, id)) };
      });
      return liste(u, 'Tesisler', [bilgi('var', 'İstasyonda temel laboratuvar, garaj ve çadır var.'), ...ogeler], `Bütçe ${Mz.liraSozu(k.butce)}.`);
    }
    if (u === 'personel') {
      const ogeler = Object.keys(Mz.PERSONEL).map((rol) => {
        const dur = Mz.personelDurumu(k, rol);
        return { id: rol, etiket: dur.metin, ipucu: Mz.PERSONEL[rol].tarif, sec: dur.kilit ? undefined : yap(() => Mz.personelIslem(k, rol, d.rng)) };
      });
      return liste(u, 'Personel', ogeler, `Kapasite ${k.personel.length} / ${Mz.personelKapasitesi(k)}. Personel sahada görünmez, işini merkezden yapar.`);
    }
    // ----- Arşiv -----
    if (u === 'arsiv') {
      const a = k.arsiv;
      return liste(u, 'Arşiv', [
        altMenu('turler', `Ansiklopedi: ${Object.keys(a.turler).length} / ${TUR_SIRASI.length} tür`, menu.ac),
        altMenu('bireyler', `Tanımlanan bireyler: ${M.taninanBireyler(k).length}`, menu.ac),
        altMenu('fotolar', `Fotoğraflar: ${a.fotolar.length}`, menu.ac),
        altMenu('sesler', `Ses kayıtları: ${a.sesler.length}`, menu.ac),
        altMenu('gunluk', `Günlük: ${a.olaylar.length} kayıt`, menu.ac),
      ]);
    }
    if (u === 'turler') {
      const bilinen = M.turListesi(k).filter((x) => x.kayit);
      const ogeler = bilinen.map(({ tur, t, kayit }) =>
        altMenu('tur-' + tur, `${t.ad}: ${kayit.davranislar.length} davranış, ${M.taninanBireyler(k, tur).length} birey${kayit.sesKaydi ? ', sesi kayıtlı' : ''}`, menu.ac)
      );
      const kalan = TUR_SIRASI.length - bilinen.length;
      if (kalan) ogeler.push(bilgi('kalan', `Henüz keşfedilmemiş ${kalan} tür var.`));
      return liste(u, 'Ansiklopedi', ogeler);
    }
    if (u.startsWith('tur-')) {
      const tur = u.slice(4);
      const t = TURLER[tur];
      const kayit = k.arsiv.turler[tur];
      const ogeler = [bilgi('ad', `${t.ad}, bilimsel adı ${t.bilimsel}, ${kucuk(t.sinif)}.`), bilgi('tarif', t.tarif)];
      if (kayit) {
        ogeler.push(
          bilgi('ilk', `İlk keşif ${zamanKisa(kayit.ilkDk)}, ${kayit.ilkBolge}. Toplam gözlem ${Math.max(1, Math.round(kayit.gozlemSn / 60))} dakika. ${kayit.sesKaydi ? 'Sesi kayıtlı.' : 'Henüz ses kaydı yok.'} ${k.arsiv.fotolar.filter((f) => f.tur === tur).length} fotoğraf.`)
        );
        ogeler.push(bilgi('dv', kayit.davranislar.length ? `Kaydedilen davranışlar: ${kayit.davranislar.map((x) => kucuk(M.davranisAdi(x)) + (DAVRANISLAR[x] && DAVRANISLAR[x].nadir ? ' (nadir)' : '')).join(', ')}.` : 'Henüz davranış kaydı yok.'));
      }
      M.taninanBireyler(k, tur).forEach((b) => ogeler.push(altMenu('birey-' + b.id, `${M.bireyAdi(b)}, ${b.cinsiyet === 'erkek' ? 'erkek' : 'dişi'} ${EVRELER[b.evre]}`, menu.ac)));
      return liste(u, t.ad, ogeler);
    }
    if (u === 'bireyler' || u.startsWith('bireyler~')) {
      const tum = M.taninanBireyler(k).map((b) => {
        const ab = k.arsiv.bireyler[b.id];
        return altMenu('birey-' + b.id, `${M.bireyAdi(b)}, ${M.kod(b)}${ab && ab.olum ? ', öldü' : ab ? `, son görülme ${zamanKisa(ab.sonDk)}` : ''}${k.gpsli.includes(b.id) ? ', GPS tasmalı' : ''}`, menu.ac);
      });
      const s = sayfali('bireyler', tum, menu);
      if (s.sayfa) return liste(s.sayfa.anahtar, s.sayfa.baslik, s.sayfa.ogeler);
      return liste(u, 'Tanımlanan bireyler', s.ogeler.length ? s.ogeler : [bilgi('bos', 'Henüz tanımlanmış birey yok. Bir hayvanı dürbünle birkaç saniye izle.')]);
    }
    if (u.startsWith('birey-')) {
      const b = M.birey(d, Number(u.slice(6)));
      if (!b) return liste(u, 'Birey', [bilgi('yok', 'Bu bireyin kaydı bulunamadı.')]);
      const ab = k.arsiv.bireyler[b.id] || {};
      const ogeler = [
        bilgi('kunye', M.bireyKunye(d, b)),
        bilgi(
          'gozlem',
          `İlk tanımlama ${ab.ilkDk !== undefined ? zamanKisa(ab.ilkDk) : 'bilinmiyor'}. Son görülme ${ab.sonDk !== undefined ? `${zamanKisa(ab.sonDk)}, ${ab.sonBolge}` : 'bilinmiyor'}. Toplam gözlem ${Math.max(1, Math.round((ab.gozlemSn || 0) / 60))} dakika. Sana alışması ${b.alisma > 0.6 ? 'yüksek' : b.alisma > 0.25 ? 'orta' : 'düşük'}.`
        ),
      ];
      if (k.gpsli.includes(b.id)) ogeler.push(bilgi('gps', `GPS: ${Mz.gpsTarifi(d, b)}.`));
      if (ab.olum) ogeler.push(bilgi('olum', `Ölüm kaydı: ${ab.olum}.`));
      const anne = M.birey(d, b.anne);
      if (anne && M.taninmisMi(anne)) ogeler.push(altMenu('birey-' + anne.id, `Annesi: ${M.bireyAdi(anne)}`, menu.ac));
      k.hayvanlar.filter((x) => x.anne === b.id && M.taninmisMi(x)).forEach((y) => ogeler.push(altMenu('birey-' + y.id, `Yavrusu: ${M.bireyAdi(y)}`, menu.ac)));
      k.hayvanlar
        .filter((x) => x.grup === b.grup && x.id !== b.id && M.taninmisMi(x) && !x.olu && x.id !== b.anne && x.anne !== b.id)
        .forEach((x) => ogeler.push(altMenu('birey-' + x.id, `Grup arkadaşı: ${M.bireyAdi(x)}`, menu.ac)));
      const fotolar = k.arsiv.fotolar.filter((f) => f.bireyId === b.id);
      if (fotolar.length) ogeler.push(bilgi('foto', `${fotolar.length} fotoğraf: ${fotolar.slice(0, 5).map((f) => `${kucuk(M.davranisAdi(f.davranis))}, ${f.kalite}`).join('; ')}.`));
      ogeler.push(altMenu('tur-' + b.tur, `Tür kaydı: ${TURLER[b.tur].ad}`, menu.ac));
      return liste(u, M.bireyAdi(b), ogeler);
    }
    if (u === 'fotolar' || u.startsWith('fotolar~')) {
      const tum = k.arsiv.fotolar.map((f) => {
        const b = M.birey(d, f.bireyId);
        const ad = b && M.taninmisMi(b) ? M.bireyAdi(b) : M.SOZ[f.tur];
        return bilgi('f' + f.id, `${ad}, ${kucuk(M.davranisAdi(f.davranis))}, kalite ${f.kalite}${f.kaynak === 'tuzak' ? ', kamera tuzağı' : ''}. ${f.bolge}, ${zamanKisa(f.dk)}`);
      });
      const s = sayfali('fotolar', tum, menu, 10);
      if (s.sayfa) return liste(s.sayfa.anahtar, s.sayfa.baslik, s.sayfa.ogeler);
      return liste(u, 'Fotoğraflar', s.ogeler.length ? s.ogeler : [bilgi('bos', 'Henüz fotoğraf yok.')]);
    }
    if (u === 'sesler' || u.startsWith('sesler~')) {
      const tum = k.arsiv.sesler.map((x) => bilgi('s' + x.id, `${M.SOZ[x.tur]}, ${M.sesTuruAdi(x.sesTuru)}, saat ${x.saat} yönünden yaklaşık ${x.m} metre. ${x.bolge}, ${zamanKisa(x.dk)}`));
      const s = sayfali('sesler', tum, menu, 10);
      if (s.sayfa) return liste(s.sayfa.anahtar, s.sayfa.baslik, s.sayfa.ogeler);
      return liste(u, 'Ses kayıtları', s.ogeler.length ? s.ogeler : [bilgi('bos', 'Henüz ses kaydı yok.')]);
    }
    if (u === 'gunluk' || u.startsWith('gunluk~')) {
      const tum = k.arsiv.olaylar.map((o, i) => bilgi('o' + i, `${zamanKisa(o.dk)}, ${o.bolge}: ${o.metin}`));
      const s = sayfali('gunluk', tum, menu, 10);
      if (s.sayfa) return liste(s.sayfa.anahtar, s.sayfa.baslik, s.sayfa.ogeler);
      return liste(u, 'Günlük', s.ogeler.length ? s.ogeler : [bilgi('bos', 'Günlükte henüz kayıt yok. Nadir davranışlar, doğumlar ve avlanmalar burada saklanır.')]);
    }
    if (u === 'ayarlar') {
      return liste(
        u,
        'Ayarlar',
        ayarOgeleri(ayar, (x) => {
          ayarDegistir(x);
          yenile((v) => v + 1);
        })
      );
    }
    if (u === 'yardim') return liste(u, 'Nasıl oynanır', yardimKonulari(menu, 'o'));
    return liste(u, 'Menü', []);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#0d1626' }}>
      <GLView style={StyleSheet.absoluteFill} onContextCreate={glHazir} accessible={false} importantForAccessibility="no-hide-descendants" accessibilityElementsHidden />
      <SafeAreaView
        style={{ flex: 1 }}
        edges={['top', 'bottom', 'left', 'right']}
        accessibilityElementsHidden={!!menu.ust}
        importantForAccessibility={menu.ust ? 'no-hide-descendants' : 'auto'}
      >
        <View style={st.ust} pointerEvents={jestli ? 'none' : 'auto'}>
          <View style={st.hud} accessible accessibilityLabel={`Durum. ${M.durumOzeti(d)}`}>
            <View style={st.satir}>
              <Text style={st.hudAd} numberOfLines={1}>
                {k.ad} · {M.gunNo(k.dk)}. gün {M.saatMetni(k.dk)}
              </Text>
              <Text style={st.hudKucuk} numberOfLines={1}>
                {Mz.liraSozu(k.butce)} · itibar {k.itibar}
              </Text>
            </View>
            <Text style={st.hudKucuk} numberOfLines={1}>
              {M.bolgeAdi(d.oyuncu.x, d.oyuncu.y)}
              {k.aracta ? ' · araçta' : ''}
              {jestli ? ` · Alet: ${alet.ad}` : ''}
            </Text>
            {gb && (
              <Text style={st.hudHedef} numberOfLines={2}>
                {M.gozlemTarifi(d, gb)}
              </Text>
            )}
            {d.sesKayit && <Text style={st.hudHedef}>Ses kaydı sürüyor…</Text>}
          </View>
          {!jestli && (
            <View style={st.baglamSatir}>
              <Dugme etiket={k.aracta ? 'Araçtan in' : aracYakin ? 'Araca bin' : 'Araca git'} onEtkin={aracIslemi} stil={st.baglamDugme} />
              {(d.rota || d.yaklasId || gb) && <Dugme etiket="Dur ve gözlemi bitir" onEtkin={durVeBitir} stil={st.baglamDugme} />}
            </View>
          )}
        </View>

        <View style={{ flex: 1 }} pointerEvents="none" />

        <View style={st.altyaziKap} pointerEvents="none">
          {!!altyazi && (
            <Text style={st.altyazi} numberOfLines={4} accessibilityElementsHidden importantForAccessibility="no">
              {altyazi}
            </Text>
          )}
          {jestli && (
            <Text style={st.jestIpucu} accessibilityElementsHidden importantForAccessibility="no">
              Sürükle: yürü · Dokun: anlat · Uzun bas: durum · Çift dokun: {kucuk(alet.ad)}
              {'\n'}İki parmak sağa/sola: alet · yukarı: araç · aşağı: dur · iki parmak çift dokun: menü
            </Text>
          )}
        </View>
        {!jestli && (
          <>
            <View style={st.izgara}>
              <Dugme etiket="Gözlemle" ipucu="Dürbünle sıradaki hayvanı seçer ve izler" onEtkin={() => M.gozlemBaslat(d)} stil={[st.eylem, st.ana]} />
              <Dugme etiket="Yaklaş" ipucu="Seçili hayvana ürkütmeden yaklaşır" onEtkin={() => M.yaklas(d)} stil={st.eylem} />
              <Dugme etiket="Fotoğraf çek" onEtkin={() => M.fotografCek(d)} stil={st.eylem} />
              <Dugme etiket={d.sesKayit ? 'Kayıt sürüyor' : 'Ses kaydı'} devre={!!d.sesKayit} ipucu="6 saniye dinler ve sesleri çözümler" onEtkin={() => M.sesKaydiBaslat(d)} stil={st.eylem} />
              <Dugme etiket="Etrafı tara" onEtkin={() => Ses.hemen(Mz.kuleTaramasi(d) || M.etrafiTara(d))} stil={st.eylem} />
              <Dugme etiket="Neredeyim" onEtkin={() => Ses.hemen(M.konumOzeti(d))} stil={st.eylem} />
              <Dugme etiket="Yerler" onEtkin={() => menuAc('yerler')} stil={st.eylem} />
              <Dugme etiket="Merkez" ipucu="Araştırma merkezi: mesajlar, görevler, araştırmalar" onEtkin={() => menuAc('merkez')} stil={st.eylem} />
              <Dugme etiket="Menü" onEtkin={() => menuAc('ana')} stil={st.eylem} />
            </View>
            <View style={st.voSatir}>
              <Dugme etiket="Sola dön" onEtkin={() => adimAt(k.aracta ? 0.5 : 0, -1, k.aracta ? 900 : 360)} stil={st.voDugme} />
              <Dugme etiket={k.aracta ? 'İleri sür' : 'İleri yürü'} ipucu={k.aracta ? 'Bir süre ileri sürer' : 'Yaklaşık 4 metre ilerler'} onEtkin={() => adimAt(1, 0, k.aracta ? 1500 : 900)} stil={st.voDugme} />
              <Dugme etiket="Sağa dön" onEtkin={() => adimAt(k.aracta ? 0.5 : 0, 1, k.aracta ? 900 : 360)} stil={st.voDugme} />
              <Dugme etiket="Geri git" onEtkin={() => adimAt(-1, 0, 800)} stil={st.voDugme} />
            </View>
          </>
        )}
        {jestli && !menu.ust && (
          <View style={StyleSheet.absoluteFill} {...sahaJest} accessible accessibilityLabel="Saha. Tek parmakla sürükleyerek yürü, dokununca çevre anlatılır, iki parmakla iki kez dokununca menü açılır." />
        )}
      </SafeAreaView>

      {menu.ust && <View style={st.menuOrt}>{menuIcerigi()}</View>}
    </View>
  );
}

// ---------------- Uygulama ----------------
export default function App() {
  const [ekran, setEkran] = useState('yukleniyor');
  const [ayar, setAyar] = useState(VARSAYILAN_AYAR);
  const [kayit, setKayit] = useState(null);
  const [arastirmaci, setArastirmaci] = useState(null);
  const [oyunAnahtar, setOyunAnahtar] = useState(0);

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
          : 'Sesle oyna seçildi. Menülerde sağa ve sola kaydırarak satırlar arasında gezinirsin; ekranın herhangi bir yerine iki kez dokununca okunan satır seçilir. İki parmakla iki kez dokunmak geri götürür.'
    );
    setEkran('menu');
  };

  const basla = (k) => {
    setArastirmaci(k);
    setOyunAnahtar((x) => x + 1);
    setEkran('oyun');
  };

  const kip = ayar.kip || 'kendi';
  let icerik = null;
  if (ekran === 'yukleniyor') icerik = <View style={{ flex: 1 }} />;
  else if (ekran === 'kip') icerik = <KipSecim sec={kipSec} />;
  else if (ekran === 'menu')
    icerik = (
      <AnaMenu
        kip={kip}
        kayit={kayit}
        ayar={ayar}
        ayarDegistir={ayarDegistir}
        devam={() => basla(kayit)}
        yeni={(ad) => {
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
        cikis={() => {
          setKayit(M.kayitHazirla(arastirmaci));
          setEkran('menu');
        }}
      />
    );

  return (
    <SafeAreaProvider>
      <KipBaglam.Provider value={kip}>
        <View style={{ flex: 1, backgroundColor: RENK.zemin }}>
          <StatusBar style="light" />
          {icerik}
        </View>
      </KipBaglam.Provider>
    </SafeAreaProvider>
  );
}

const st = StyleSheet.create({
  oyunAdi: { color: RENK.vurgu, fontSize: 40, fontWeight: '800', marginTop: 24, letterSpacing: 1 },
  metin: { color: RENK.yazi, fontSize: 17, lineHeight: 24 },
  satir: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  dugme: { backgroundColor: '#2a2f2a', borderRadius: 12, paddingVertical: 12, paddingHorizontal: 10, borderWidth: 1, borderColor: '#3d4538', justifyContent: 'center', alignItems: 'center' },
  dugmeBasili: { opacity: 0.7 },
  dugmeDevre: { opacity: 0.45 },
  dugmeYazi: { color: RENK.yazi, fontSize: 14, fontWeight: '600', textAlign: 'center' },
  kipKap: { flex: 1, padding: 18, paddingTop: 60, gap: 12 },
  kipSatir: { flex: 1, flexDirection: 'column', gap: 12 },
  kipYari: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  kipBuyuk: { color: RENK.vurgu, fontSize: 40, fontWeight: '800', marginBottom: 16 },
  kipYazi: { color: RENK.yazi, fontSize: 28, fontWeight: '800', textAlign: 'center' },
  kipAlt: { color: RENK.soluk, fontSize: 16, marginTop: 8, textAlign: 'center' },
  ust: { paddingHorizontal: 8, paddingTop: 4, gap: 6 },
  hud: { padding: 10, backgroundColor: 'rgba(21,23,26,0.82)', borderRadius: 12, gap: 3 },
  hudAd: { color: RENK.yazi, fontSize: 16, fontWeight: '800', flexShrink: 1 },
  hudKucuk: { color: RENK.soluk, fontSize: 13 },
  hudHedef: { color: '#ffe08a', fontSize: 14, fontWeight: '700' },
  baglamSatir: { flexDirection: 'row', gap: 6 },
  baglamDugme: { flex: 1, backgroundColor: '#33381f', borderColor: '#6b6a2e' },
  altyaziKap: { paddingHorizontal: 8, paddingBottom: 6, minHeight: 4 },
  altyazi: { color: '#fff', backgroundColor: 'rgba(0,0,0,0.6)', padding: 8, borderRadius: 8, fontSize: 14 },
  jestIpucu: { color: 'rgba(255,255,255,0.75)', fontSize: 12, textAlign: 'center', marginTop: 6, backgroundColor: 'rgba(0,0,0,0.35)', borderRadius: 8, padding: 6, marginBottom: 6 },
  izgara: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, paddingHorizontal: 8, justifyContent: 'space-between' },
  eylem: { width: '32%', height: 54 },
  ana: { backgroundColor: 'rgba(60,72,32,0.95)', borderColor: '#9aa84a' },
  voSatir: { flexDirection: 'row', gap: 6, paddingHorizontal: 8, marginTop: 6, marginBottom: 6 },
  voDugme: { flex: 1, height: 64 },
  menuOrt: { ...StyleSheet.absoluteFillObject, backgroundColor: RENK.zemin },
});
