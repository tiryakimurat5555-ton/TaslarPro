// İki Sancak (çalışma adı) — erişilebilir, kendi sesiyle konuşan 3B fantastik RPG.
// Yapı: oyun/veri.js (veri), oyun/mantik.js (saf mantık), oyun/ses.js (ses motoru), oyun/sahne.js (3B çizim)
import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
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
import { ULUSLAR, IRKLAR, SINIFLAR, YETENEKLER, NITELIKLER, GOREVLER, YUVALAR, NADIRLIK, IKSIR, SEVIYE_SINIRI } from './oyun/veri.js';
import { sahneKur } from './oyun/sahne.js';
import * as Efekt from './oyun/efekt.js';
import { CANAVARLAR, BOLGELER, YERLER, DUNYA } from './oyun/veri.js';
import { Gezgin, Katman, Okunur, Sayfa, DogrudanAlan, useOdak, useSihirliEylem } from './oyun/gezgin.js';

const OYUN_ADI = 'İki Sancak';
const AYAR_ANAHTAR = 'ikisancak-ayar-v1';
const KAYIT_ANAHTAR = 'ikisancak-karakter-v1';
const VARSAYILAN_AYAR = { kip: null, hiz: 1.0, titresim: true, rehber: true, efekt: true, otoPuan: true };
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
  mana: '#3f7fe0',
  xp: '#8d6be8',
  iyi: '#5dbb63',
};

const KipBaglam = createContext('kendi');

function titret(tur, ayar) {
  if (!ayar || !ayar.titresim) return;
  try {
    if (tur === 'hafif') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    else if (tur === 'orta') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    else if (tur === 'iyi') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    else if (tur === 'kotu') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  } catch (e) {}
}

// Düğme. Sesle oynarken dokunuşları gezgin (oyunun ekran okuyucusu) yönetir:
// dokun ya da kaydırarak seç, iki kez dokunarak çalıştır. Görerek ve VoiceOver kipinde tek dokunuş çalıştırır.
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

// ---------------- Kip seçimi (ilk açılış) ----------------
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
    Ses.soyle(`${OYUN_ADI}, ana menü. ${kayitVar ? 'Devam et, ' : ''}Yeni karakter, Nasıl oynanır, Ayarlar.`, 3);
  }, [kayitVar]);
  return (
    <Sayfa contentContainerStyle={st.sayfa}>
      <Text style={st.oyunAdi} accessibilityRole="header">
        {OYUN_ADI}
      </Text>
      <Okunur stil={st.soluk}>Deneme sürümü, seviye sınırı {SEVIYE_SINIRI}</Okunur>
      {kayitVar && <Dugme etiket={`Devam et: ${kayitOzet}`} onEtkin={devam} stil={st.buyukDugme} />}
      <Dugme etiket="Yeni karakter" ipucu={kayitVar ? 'Kayıtlı karakterin silinir' : undefined} onEtkin={yeni} stil={st.buyukDugme} />
      <Dugme etiket="Nasıl oynanır" onEtkin={nasil} stil={st.buyukDugme} />
      <Dugme etiket="Ayarlar" onEtkin={ayarlar} stil={st.buyukDugme} />
    </Sayfa>
  );
}

const NASIL = [
  'Amaç: köydeki Muhtar’dan görev al, canavar avla, seviye atla, en sonunda kuzeydeki bataklıkta yaşayan ejderi yen.',
  'Telefonu yatay tut. Hareket: ekranın sol altındaki hareket alanına parmağını koyup kaydır. Yukarı ileri yürür, aşağı geri gider, sağa ve sola kaydırmak o yöne döndürür. Bir şeye çarparsan oyun söyler.',
  'Savaş: Hedef düğmesi en yakın düşmanı seçer ve yerini söyler. Saldır düğmesi seni hedefe yürütür ve otomatik saldırtır. Yetenek düğmeleri mana harcar ve bir süre beklemeye girer.',
  'Yönler saat gibi söylenir: saat 12 tam önün, 3 sağın, 6 arkan, 9 solun.',
  'Kulaklıkla oynamak en iyisi: sana saldıran canavarlar bulundukları yönden ses verir, arkadakiler boğuk duyulur. Hedef seçiliyken menzil dışındaysa hedefin yönünden bip sesi gelir, yaklaştıkça sıklaşır. Canın azalınca kalp atışı duyarsın.',
  'Dünya köyden dışa doğru halka halka bölgelere ayrılır: Çayır Yamaçları, Gümüş Çay, Meşe Korusu, Goblin Tepeleri, Haydut Geçidi, Kızıl Sınır, Örümcek Kayalıkları, Golem Harabeleri, Sisli Kıyı ve en kuzeyde Ejder Bataklığı. Uzaklaştıkça canavarlar güçlenir. Köyü saran Gümüş Çay yalnız dört yolun üzerindeki köprülerden geçilir; Saldır ve Görev hedefini bul seni köprüye kendisi götürür.',
  'Önemli yerlere yaklaşınca keşfedersin ve deneyim kazanırsın. Menüdeki Harita, bölgeleri ve yerleri yönleri ve uzaklıklarıyla okur.',
  'Görev hedefini bul düğmesi, görevin istediği en yakın canavara seni yürütür. Bir canavarı öldürünce sana saldıran başka biri varsa hedef otomatik ona geçer.',
  'Etrafı tara düğmesi yakındaki herkesi söyler. Üstteki durum çubuğuna dokununca canın, manan ve deneyimin okunur.',
  'Canın azalırsa İksir düğmesiyle iksir iç. Köydeki Tüccar’dan iksir alabilir, ganimetleri satabilirsin. Menüdeki Köye dön, 5 saniye kıpırdamazsan seni köye ışınlar.',
  'Sesle oynarken oyun VoiceOver gibi çalışır: dokunduğun ya da parmağını gezdirdiğin öğeyi okur, sağa sola kaydırınca sonraki ve önceki öğeye geçer, ekranın herhangi bir yerine iki kez dokununca seçili öğe çalışır. İki parmakla bir kez dokunmak konuşmayı susturur, iki parmakla iki kez dokunmak saldırtır. Üç parmakla yukarı ya da aşağı kaydırmak sayfayı kaydırır.',
  'Hareket alanı doğrudan dokunma alanıdır: parmağını oraya koyunca okunmaz, doğrudan yürürsün.',
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
      <Dugme
        etiket={`Titreşim: ${ayar.titresim ? 'açık' : 'kapalı'}`}
        onEtkin={() => {
          degistir({ titresim: !ayar.titresim });
          Ses.hemen(`Titreşim ${!ayar.titresim ? 'açık' : 'kapalı'}`);
        }}
      />
      <Dugme
        etiket={`Ses efektleri: ${ayar.efekt !== false ? 'açık' : 'kapalı'}`}
        ipucu="Vuruş, ayak, canavar ve hedef sesleri"
        onEtkin={() => {
          const yeni = ayar.efekt === false;
          degistir({ efekt: yeni });
          Efekt.efektAyarla({ acik: yeni });
          Ses.hemen(`Ses efektleri ${yeni ? 'açık' : 'kapalı'}`);
        }}
      />
      <Dugme
        etiket={`Efektleri konuşmayla karıştırma: ${ayar.efektKis !== false ? 'açık' : 'kapalı'}`}
        ipucu="Açıkken oyun konuşurken efekt çalmaz, konuşma kısa bir efektin bitmesini bekler. Ses dalgalanmasını önler"
        onEtkin={() => {
          const yeni = ayar.efektKis === false;
          degistir({ efektKis: yeni });
          Efekt.efektAyarla({ kis: yeni });
          Ses.hemen(`Efektleri konuşmayla karıştırma ${yeni ? 'açık' : 'kapalı'}`);
        }}
      />
      <Dugme
        etiket={`Nitelik puanlarını otomatik dağıt: ${ayar.otoPuan !== false ? 'açık' : 'kapalı'}`}
        ipucu="Seviye atlayınca puanlar sınıfına göre dağıtılır"
        onEtkin={() => {
          const yeni = ayar.otoPuan === false;
          degistir({ otoPuan: yeni });
          Ses.hemen(`Otomatik dağıtma ${yeni ? 'açık' : 'kapalı'}`);
        }}
      />
      <Dugme
        etiket={`Hedef rehberi: ${ayar.rehber ? 'açık' : 'kapalı'}`}
        ipucu="Hedefe yürürken yönünü ve uzaklığını aralıklarla söyler"
        onEtkin={() => {
          degistir({ rehber: !ayar.rehber });
          Ses.hemen(`Hedef rehberi ${!ayar.rehber ? 'açık' : 'kapalı'}`);
        }}
      />
      <Dugme etiket="Geri" onEtkin={geri} stil={st.buyukDugme} />
    </Sayfa>
  );
}

// ---------------- Karakter yaratma ----------------
function Yarat({ bitti, iptal }) {
  const [adim, setAdim] = useState('ulus');
  const [s, setS] = useState({ ulus: null, irk: null, sinif: null, ad: '' });
  const kip = useContext(KipBaglam);
  const soz = {
    ulus: 'Ulusunu seç. Gün Ulusu ya da Ay Ulusu.',
    irk: 'Irkını seç.',
    sinif: 'Sınıfını seç: Savaşçı, Okçu, Büyücü ya da Rahip.',
    ad: kip === 'kendi' ? 'Adını seç. Hazır adlardan birini seçebilirsin.' : 'Adını yaz ya da hazır adlardan birini seç.',
    onay: '',
  };
  useEffect(() => {
    if (adim === 'onay') {
      Ses.soyle(
        `${s.ad}, ${IRKLAR[s.irk].ad} ${SINIFLAR[s.sinif].ad}, ${ULUSLAR[s.ulus].ad}. Onaylarsan maceran başlar.`,
        3
      );
    } else Ses.soyle(soz[adim], 3);
  }, [adim]);
  const secenek = (anahtar, deger, sonraki) => {
    setS((x) => ({ ...x, [anahtar]: deger }));
    setAdim(sonraki);
  };
  return (
    <Sayfa contentContainerStyle={st.sayfa} keyboardShouldPersistTaps="handled">
      <Baslik>Yeni karakter</Baslik>
      {adim === 'ulus' && (
        <>
          <Okunur stil={st.altBaslik}>Ulus</Okunur>
          {Object.entries(ULUSLAR).map(([k, u]) => (
            <Dugme key={k} etiket={u.ad} ipucu={u.aciklama} onEtkin={() => secenek('ulus', k, 'irk')} stil={st.secenek}>
              <Text style={[st.secenekAd, { color: u.renk }]}>{u.ad}</Text>
              <Text style={st.secenekAciklama}>{u.aciklama}</Text>
            </Dugme>
          ))}
        </>
      )}
      {adim === 'irk' && (
        <>
          <Okunur stil={st.altBaslik}>Irk</Okunur>
          {ULUSLAR[s.ulus].irklar.map((k) => (
            <Dugme key={k} etiket={IRKLAR[k].ad} ipucu={IRKLAR[k].aciklama} onEtkin={() => secenek('irk', k, 'sinif')} stil={st.secenek}>
              <Text style={st.secenekAd}>{IRKLAR[k].ad}</Text>
              <Text style={st.secenekAciklama}>{IRKLAR[k].aciklama}</Text>
            </Dugme>
          ))}
        </>
      )}
      {adim === 'sinif' && (
        <>
          <Okunur stil={st.altBaslik}>Sınıf</Okunur>
          {Object.entries(SINIFLAR).map(([k, c]) => (
            <Dugme key={k} etiket={c.ad} ipucu={c.aciklama} onEtkin={() => secenek('sinif', k, 'ad')} stil={st.secenek}>
              <Text style={[st.secenekAd, { color: c.renk }]}>{c.ad}</Text>
              <Text style={st.secenekAciklama}>{c.aciklama}</Text>
            </Dugme>
          ))}
        </>
      )}
      {adim === 'ad' && (
        <>
          <Okunur stil={st.altBaslik}>Ad</Okunur>
          {kip !== 'kendi' && (
            <TextInput
              value={s.ad}
              onChangeText={(t) => setS((x) => ({ ...x, ad: t.slice(0, 16) }))}
              placeholder="Karakterinin adı"
              placeholderTextColor={R.soluk}
              style={st.girdi}
              accessibilityLabel="Karakterinin adı"
              returnKeyType="done"
              onSubmitEditing={() => s.ad.trim() && setAdim('onay')}
            />
          )}
          {kip !== 'kendi' && <Dugme etiket="Bu adla devam et" devre={!s.ad.trim()} onEtkin={() => setAdim('onay')} stil={st.buyukDugme} />}
          <Okunur stil={st.soluk}>Hazır adlar</Okunur>
          <View style={st.sarmal}>
            {ADLAR.map((a) => (
              <Dugme key={a} etiket={a} onEtkin={() => secenek('ad', a, 'onay')} stil={st.adDugme} />
            ))}
          </View>
        </>
      )}
      {adim === 'onay' && (
        <>
          <Okunur stil={st.metin}>
            {s.ad}, {IRKLAR[s.irk].ad} {SINIFLAR[s.sinif].ad}, {ULUSLAR[s.ulus].ad}
          </Okunur>
          <Dugme etiket="Onayla ve başla" onEtkin={() => bitti(s)} stil={st.buyukDugme} />
          <Dugme etiket="Baştan seç" onEtkin={() => setAdim('ulus')} />
        </>
      )}
      <Dugme etiket="Vazgeç, ana menüye dön" onEtkin={iptal} />
    </Sayfa>
  );
}

// ---------------- Oyun ekranı ----------------
function Cubuk({ oran, renk }) {
  return (
    <View style={st.cubuk}>
      <View style={[st.cubukDolu, { width: `${Math.max(0, Math.min(1, oran)) * 100}%`, backgroundColor: renk }]} />
    </View>
  );
}

function Oyun({ karakter, ayar, cikis, ayarDegistir }) {
  const kip = useContext(KipBaglam);
  const dRef = useRef(null);
  if (!dRef.current) dRef.current = M.dunyaOlustur(karakter);
  const d = dRef.current;
  globalThis.__ikiSancakDunya = d; // denemeler için
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
    Efekt.onYukle(['kilic', 'ok', 'ates', 'topuz', 'iska', 'oldur', 'altin', 'adim1', 'adim2', 'sonar_2', 'aldin_2', 'odak', 'etkinles']);
    let silici;
    setAltyazi('');
    Ses.altyaziDinle((m) => {
      setAltyazi(m);
      clearTimeout(silici);
      silici = setTimeout(() => setAltyazi(''), 6000);
    });
    Ses.soyle(`Maceraya hoş geldin, ${d.k.ad}. ${M.konumOzeti(d)} ${M.gorevDurumu(d.k).metin}`, 3);
    const alt = AppState.addEventListener('change', (s) => {
      if (s !== 'active') kaydet();
    });
    return () => {
      Ses.altyaziDinle(null);
      alt.remove();
      kaydet();
    };
  }, []);

  // Olaylara göre ses efekti
  const efektCal = (o) => {
    const k = d.k;
    const canavar = o.id ? d.canavarlar.find((c) => c.id === o.id) : null;
    switch (o.tur) {
      case 'hasarVerdin': {
        let ad = { savasci: 'kilic', okcu: 'ok', buyucu: 'ates', rahip: 'topuz' }[k.sinif];
        if (o.kaynak === 'buzOku') ad = 'buz';
        if (o.kaynak === 'zehir') return;
        Efekt.cal(o.kritik ? 'kritik' : ad, 0.8);
        return;
      }
      case 'iska':
      case 'kacindin':
        Efekt.cal('iska', 0.6);
        return;
      case 'hasarAldin':
        if (canavar) Efekt.yonlu('aldin', d.oyuncu, canavar, 1);
        else Efekt.cal('aldin_2', 1);
        return;
      case 'oldurdun':
        Efekt.cal('oldur', 0.9);
        setTimeout(() => Efekt.cal(o.ganimet ? 'ganimet' : 'altin', 0.8), 350);
        return;
      case 'saldiriyor':
        if (canavar) {
          canavar.__sesZaman = d.zaman;
          Efekt.yonlu(CANAVARLAR[canavar.tur].efekt, d.oyuncu, canavar, 1);
        }
        return;
      case 'hedef':
        if (canavar) Efekt.yonlu('sonar', d.oyuncu, canavar, 0.8);
        else Efekt.cal('hata', 0.5);
        return;
      case 'seviye':
        Efekt.cal('seviye', 1);
        return;
      case 'gorev':
        Efekt.cal('gorev', 1);
        return;
      case 'iyilestin':
        Efekt.cal('iyiles', 0.9);
        return;
      case 'iksir':
        Efekt.cal(/içtin/.test(o.metin) ? 'iksir' : 'hata', 0.8);
        return;
      case 'yetenek':
        if (['kalkanDuvari', 'manaKalkani', 'kutsalKalkan', 'savasNarasi'].includes(o.id)) Efekt.cal('kalkan', 0.9);
        else if (o.id === 'arinmaIsigi') Efekt.cal('iyiles', 0.7);
        return;
      case 'menzil':
      case 'yetenekHazirDegil':
        Efekt.cal('hata', 0.6);
        return;
      case 'oldun':
        Efekt.cal('olum', 1);
        return;
      case 'dogdun':
        Efekt.cal('dogus', 0.9);
        return;
      case 'isinlanma':
        if (/başladı/.test(o.metin)) Efekt.cal('isinlan', 0.8);
        else if (/Köydesin/.test(o.metin)) Efekt.cal('dogus', 0.7);
        return;
      case 'konusma':
        Efekt.cal('etkinles', 0.5);
        return;
      case 'bolge':
        Efekt.cal('bolge', o.yeni ? 0.9 : 0.5);
        return;
      case 'kesif':
        Efekt.cal('kesif', 0.9);
        return;
      default:
    }
  };

  // Ana döngü: mantık, olaylar, çizim
  useEffect(() => {
    let son = Date.now();
    let hudSayac = 0;
    let kayitSayac = 0;
    let carpmaSon = 0;
    let rehberSon = 0;
    let adimYol = 0;
    let adimSira = false;
    let canavarSesSayac = 0;
    let sonarSayac = 0;
    let kalpSayac = 0;
    let suSayac = 0;
    let rehberMesafe = 0;
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
        const yurunen = Math.hypot(d.oyuncu.x - oncekiX, d.oyuncu.y - oncekiY);
        if (sonuc.carpti && simdi - carpmaSon > 1500) {
          carpmaSon = simdi;
          titret('hafif', a);
          if (sonuc.nehir) {
            Efekt.cal('su', 0.9);
            if (a.kip !== 'gorerek') Ses.soyle('Önünde Gümüş Çay akıyor. Köprüler dört yolun üzerinde.', 2);
          } else {
            Efekt.cal('carpma', 0.7);
            if (a.kip !== 'gorerek') Ses.soyle('Önün kapalı.', 2);
          }
        }
        // Çayın sesi: yaklaştıkça duyulur
        suSayac -= dt;
        if (suSayac <= 0) {
          suSayac = 2.2;
          const uz = Math.abs(Math.hypot(d.oyuncu.x, d.oyuncu.y) - (DUNYA.nehirIc + DUNYA.nehirDis) / 2);
          if (uz < 14) Efekt.cal('su', Math.max(0.12, 0.7 - uz / 20));
        }
        // Ayak sesleri: yürüdükçe
        adimYol += yurunen;
        if (adimYol > 1.6) {
          adimYol = 0;
          adimSira = !adimSira;
          Efekt.cal(adimSira ? 'adim1' : 'adim2', 0.22);
        }
        for (const o of M.olaylariAl(d)) {
          if (sahneRef.current) sahneRef.current.efekt(o);
          efektCal(o);
          if (o.tur === 'hasarAldin') titret('hafif', a);
          else if (o.tur === 'seviye' || o.tur === 'gorev') titret('iyi', a);
          else if (o.tur === 'oldun') titret('kotu', a);
          else if (o.tur === 'oldurdun' || o.tur === 'saldiriyor') titret('orta', a);
          if (o.tur === 'seviye' && a.otoPuan && d.k.serbestPuan) {
            M.otomatikDagit(d.k);
            Ses.soyle('Nitelik puanların sınıfına göre dağıtıldı.', 1);
          }
          if (o.metin) Ses.soyle(o.metin, o.oncelik);
        }
        // Seni kovalayan canavarlar, bulundukları yönden ses verir (en yakın 2)
        canavarSesSayac -= dt;
        if (canavarSesSayac <= 0) {
          canavarSesSayac = 1.1;
          d.canavarlar
            .filter((c) => !c.olu && c.durum === 'kovala')
            .map((c) => ({ c, m: M.mesafe(c, d.oyuncu) }))
            .filter((x) => x.m < 24)
            .sort((x, y) => x.m - y.m)
            .slice(0, 2)
            .forEach(({ c }) => {
              if (!c.__sesZaman || d.zaman - c.__sesZaman > 2.6) {
                c.__sesZaman = d.zaman + Math.random() * 0.6;
                Efekt.yonlu(CANAVARLAR[c.tur].efekt, d.oyuncu, c, 0.85);
              }
            });
        }
        // Hedef sonarı: hedef menzil dışındayken yönünden bip sesi gelir, yaklaştıkça sıklaşır
        const hs = M.hedef(d);
        if (hs && !d.olu) {
          const m = M.mesafe(d.oyuncu, hs);
          const menzil = M.hesapla(d.k).menzil;
          sonarSayac -= dt;
          if (m > menzil && sonarSayac <= 0) {
            sonarSayac = Math.max(0.45, Math.min(1.6, m / 25));
            Efekt.yonlu('sonar', d.oyuncu, hs, 0.45);
          }
        }
        // Can azken kalp atışı
        const hh = M.hesapla(d.k);
        if (!d.olu && d.k.can < hh.enCan * 0.3) {
          kalpSayac -= dt;
          if (kalpSayac <= 0) {
            kalpSayac = d.k.can < hh.enCan * 0.15 ? 0.6 : 0.9;
            Efekt.cal('kalp', 0.8);
          }
        }
        // Hedef rehberi: yürürken hedefin yönünü ve uzaklığını söyler
        const h = M.hedef(d);
        if (a.rehber && a.kip !== 'gorerek' && h && simdi - rehberSon > 6000) {
          const m = M.mesafe(d.oyuncu, h);
          const hareketli = d.yaklas || Math.abs(girdi.current.ileri) > 0.1;
          if (hareketli && m > M.hesapla(d.k).menzil && Math.abs(m - rehberMesafe) > 2.5) {
            rehberSon = simdi;
            rehberMesafe = m;
            Ses.soyle(`${h.ad} ${M.saatSozu(M.saatYonu(d.oyuncu, h))}, ${M.metreSozu(m)}.`, 1);
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

  // Sol yarı: parmakla kaydırma (joystick)
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

  // İki parmakla iki kez dokunma: Saldır
  useSihirliEylem(() => {
    if (!panelRef.current) M.saldir(d);
  });

  // VoiceOver kipinde adım adım hareket
  const adimAt = (ileri, don, sure, soz) => {
    girdi.current = { ileri, don };
    adimBitis.current = Date.now() + sure;
    if (soz) Ses.soyle(soz, 2);
  };

  const k = d.k;
  const h = M.hesapla(k);
  const hedef = M.hedef(d);
  const npc = M.yakinNpc(d);
  const yetenekler = YETENEKLER[k.sinif];

  const panelAc = (p, soz) => {
    setPanel(p);
    if (soz) Ses.soyle(soz, 3);
  };
  const panelKapat = () => {
    setPanel(null);
    kaydet();
    Ses.soyle('Oyuna dönüldü.', 2);
  };

  const npcKonus = () => {
    if (!npc) return;
    if (npc.id === 'muhtar') {
      M.muhtarlaKonus(d);
    } else {
      panelAc('tuccar', `Tüccar. ${k.altin} altının, ${k.iksir} iksirin var. Can iksiri ${IKSIR.fiyat} altın.`);
    }
  };

  const yetenekEtiketi = (y) => {
    if (y.seviye > k.seviye) return `${y.ad}, kilitli, seviye ${y.seviye}`;
    const dur = M.yetenekDurumu(d, y);
    if (dur.kalan) return `${y.ad}, ${Math.ceil(dur.kalan)} saniye`;
    return `${y.ad}, ${y.mana} mana`;
  };

  const xpOran = k.seviye >= SEVIYE_SINIRI ? 1 : k.xp / M.gerekenXp(k.seviye);

  return (
    <View style={{ flex: 1, backgroundColor: '#9cc7e8' }}>
      <GLView style={StyleSheet.absoluteFill} onContextCreate={glHazir} accessible={false} importantForAccessibility="no-hide-descendants" accessibilityElementsHidden />
      <SafeAreaView
        style={{ flex: 1 }}
        edges={['top', 'bottom', 'left', 'right']}
        accessibilityElementsHidden={!!panel}
        importantForAccessibility={panel ? 'no-hide-descendants' : 'auto'}
      >
        {/* Üst: solda durum, sağda duruma göre çıkan düğmeler */}
        <View style={st.ustSatir}>
          {/* Durum çubuğu */}
          <Dugme etiket={`Durum. ${M.durumOzeti(d)}`} onEtkin={() => Ses.hemen(M.durumOzeti(d))} stil={st.hud}>
            <View style={st.satir}>
              <Text style={st.hudAd}>
                {k.ad} · Sv {k.seviye}
              </Text>
              <Text style={st.hudKucuk}>
                {k.altin} altın · {k.iksir} iksir{k.serbestPuan ? ` · ${k.serbestPuan} puan` : ''}
              </Text>
            </View>
            <Cubuk oran={k.can / h.enCan} renk={R.can} />
            <Cubuk oran={k.mana / h.enMana} renk={R.mana} />
            <Cubuk oran={xpOran} renk={R.xp} />
            {hedef && (
              <Text style={st.hudHedef} numberOfLines={1}>
                Hedef: {hedef.ad} Sv {hedef.seviye} · %{Math.round((hedef.can / hedef.enCan) * 100)} · {Math.round(M.mesafe(d.oyuncu, hedef))} m
              </Text>
            )}
          </Dugme>
          <View style={{ flex: 1 }} />
          <View style={st.baglamSatir}>
            {d.olu && <Dugme etiket="Yeniden doğ" onEtkin={() => M.yenidenDog(d)} stil={st.baglamDugme} />}
            {!d.olu && npc && <Dugme etiket={`${npc.ad} ile konuş`} onEtkin={npcKonus} stil={st.baglamDugme} />}
            {!d.olu && !npc && k.gorev.durum === 'aktif' && !hedef && (
              <Dugme etiket="Görev hedefini bul" ipucu="Görevin istediği en yakın canavara yürür" onEtkin={() => M.gorevHedefiBul(d)} stil={st.baglamDugme} />
            )}
            {!d.olu && !npc && k.gorev.durum === 'tamam' && Math.hypot(d.oyuncu.x, d.oyuncu.y) > 20 && !d.isinlanma && (
              <Dugme etiket="Ödül için köye dön" ipucu="5 saniye kıpırdamazsan köye ışınlanırsın" onEtkin={() => M.koyeDon(d)} stil={st.baglamDugme} />
            )}
            {!d.olu && (d.otoSaldiri || d.yaklas) && <Dugme etiket="Dur" ipucu="Saldırıyı ve yürüyüşü durdurur" onEtkin={() => { M.dur(d); Ses.soyle('Durdun.', 2); }} stil={st.baglamDugme} />}
          </View>

        </View>

        <View style={{ flex: 1 }} />

        {/* Alt: solda hareket, ortada altyazı, sağda eylemler */}
        <View style={st.alt}>
          {kip === 'voiceover' ? (
            <View style={st.solVo}>
              <Dugme etiket="İleri yürü" ipucu="Yaklaşık 4 metre ilerler" onEtkin={() => adimAt(1, 0, 800)} kisa stil={st.voDugme} />
              <View style={st.satir}>
                <Dugme etiket="Sola dön" onEtkin={() => adimAt(0, -1, 330, null)} kisa stil={[st.voDugme, { flex: 1 }]} />
                <Dugme etiket="Sağa dön" onEtkin={() => adimAt(0, 1, 330, null)} kisa stil={[st.voDugme, { flex: 1 }]} />
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
              {[yetenekler[0], yetenekler[1]].map((y) => (
                <Dugme key={y.id} etiket={yetenekEtiketi(y)} ipucu={y.aciklama} devre={!M.yetenekDurumu(d, y).hazir} onEtkin={() => M.yetenekKullan(d, y.id)} kisa stil={st.eylem} />
              ))}
              <Dugme etiket="Saldır" ipucu="Hedefe yürür ve saldırır" onEtkin={() => M.saldir(d)} kisa stil={[st.eylem, st.saldir]} />
              {[yetenekler[2], yetenekler[3]].map((y) => (
                <Dugme key={y.id} etiket={yetenekEtiketi(y)} ipucu={y.aciklama} devre={!M.yetenekDurumu(d, y).hazir} onEtkin={() => M.yetenekKullan(d, y.id)} kisa stil={st.eylem} />
              ))}
              <Dugme etiket="Hedef" ipucu="Sıradaki yakın düşmanı seçer" onEtkin={() => M.hedefDegistir(d, 40)} kisa stil={st.eylem} />
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
                  <Dugme etiket={`Karakter${k.serbestPuan ? `, ${k.serbestPuan} puan dağıtılabilir` : ''}`} onEtkin={() => panelAc('karakter', `Karakter. ${k.ad}, ${IRKLAR[k.irk].ad} ${SINIFLAR[k.sinif].ad}, seviye ${k.seviye}.`)} />
                  <Dugme etiket={`Çanta, ${k.envanter.length} eşya`} onEtkin={() => panelAc('canta', `Çanta. ${k.envanter.length} eşya.`)} />
                  <Dugme etiket="Görev" onEtkin={() => panelAc('gorev', M.gorevDurumu(k).metin)} />
                  <Dugme etiket="Harita" ipucu="Bölgeler ve önemli yerler, yönleri ve uzaklıklarıyla" onEtkin={() => panelAc('harita', `Harita. ${M.konumOzeti(d)}`)} />
                  <Dugme
                    etiket="Köye dön"
                    ipucu="5 saniye kıpırdamazsan köye ışınlanırsın"
                    onEtkin={() => {
                      setPanel(null);
                      M.koyeDon(d);
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
              {panel === 'karakter' && <KarakterPaneli d={d} geri={() => panelAc('menu', 'Menü.')} />}
              {panel === 'canta' && <CantaPaneli d={d} tuccarda={npc && npc.id === 'tuccar'} geri={() => panelAc('menu', 'Menü.')} />}
              {panel === 'tuccar' && <TuccarPaneli d={d} canta={() => panelAc('canta', 'Çanta. Satmak istediğin eşyayı seç.')} geri={panelKapat} />}
              {panel === 'gorev' && <GorevPaneli k={k} geri={() => panelAc('menu', 'Menü.')} />}
              {panel === 'harita' && <HaritaPaneli d={d} geri={() => panelAc('menu', 'Menü.')} />}
              {panel === 'ayarlar' && <Ayarlar ayar={ayar} degistir={ayarDegistir} geri={() => panelAc('menu', 'Menü.')} />}
            </Sayfa>
          </SafeAreaView>
          </Katman>
        </View>
      )}
    </View>
  );
}

function KarakterPaneli({ d, geri }) {
  const [, yenile] = useState(0);
  const k = d.k;
  const h = M.hesapla(k);
  const ver = (n) => {
    if (M.niteligeVer(k, n.ad)) {
      Ses.hemen(`${n.baslik} ${k.nitelik[n.ad]}. ${k.serbestPuan} puan kaldı.`);
      yenile((x) => x + 1);
    }
  };
  return (
    <>
      <Baslik>
        {k.ad}, seviye {k.seviye}
      </Baslik>
      <Okunur stil={st.metin}>
        {IRKLAR[k.irk].ad} {SINIFLAR[k.sinif].ad}, {ULUSLAR[k.ulus].ad}
      </Okunur>
      <Okunur stil={st.altBaslik}>Nitelikler{k.serbestPuan ? `, ${k.serbestPuan} puan dağıtılabilir` : ''}</Okunur>
      {NITELIKLER.map((n) => (
        <Dugme
          key={n.ad}
          etiket={`${n.baslik} ${h.nitelik[n.ad]}${k.serbestPuan ? ', artır' : ''}`}
          ipucu={n.aciklama}
          devre={!k.serbestPuan}
          onEtkin={() => ver(n)}
        />
      ))}
      {k.serbestPuan > 0 && (
        <Dugme
          etiket="Puanları sınıfıma göre otomatik dağıt"
          onEtkin={() => {
            M.otomatikDagit(k);
            Ses.hemen('Puanlar dağıtıldı.');
            yenile((x) => x + 1);
          }}
        />
      )}
      <Okunur stil={st.altBaslik}>Değerler</Okunur>
      <Okunur stil={st.metin}>
        Can {h.enCan}, mana {h.enMana}, saldırı {h.saldiri}, savunma {h.savunma}, kritik vuruş yüzde {Math.round(h.kritik * 100)}, saldırı menzili {h.menzil} metre.
      </Okunur>
      <Okunur stil={st.altBaslik}>Yetenekler</Okunur>
      {YETENEKLER[k.sinif].map((y) => (
        <Okunur key={y.id} stil={st.metin}>
          {y.ad}: {y.seviye > k.seviye ? `seviye ${y.seviye}'te açılır. ` : ''}
          {y.aciklama} {y.mana} mana, {y.bekleme} saniye bekleme.
        </Okunur>
      ))}
      <Dugme etiket="Geri" onEtkin={geri} stil={st.buyukDugme} />
    </>
  );
}

function CantaPaneli({ d, tuccarda, geri }) {
  const [, yenile] = useState(0);
  const k = d.k;
  return (
    <>
      <Baslik>Çanta</Baslik>
      <Okunur stil={st.altBaslik}>Kuşandıkların</Okunur>
      {Object.keys(YUVALAR).map((y) => (
        <Okunur key={y} stil={st.metin}>
          {YUVALAR[y]}: {k.kusanilan[y] ? M.esyaTarifi(k.kusanilan[y]) : 'boş'}
        </Okunur>
      ))}
      <Okunur stil={st.altBaslik}>Çantadakiler, {k.envanter.length} eşya</Okunur>
      {!k.envanter.length && <Okunur stil={st.soluk}>Çantan boş. Canavarlardan ganimet düşer.</Okunur>}
      {k.envanter.map((e) => {
        const eski = k.kusanilan[e.yuva];
        const fark = eski ? e.deger - eski.deger : e.deger;
        return (
          <View key={e.id} style={st.esya}>
            <Text style={[st.metin, { color: NADIRLIK[e.nadirlik].renk }]} accessible>
              {M.esyaTarifi(e)}. {fark > 0 ? `Kuşandığından ${fark} daha iyi.` : fark < 0 ? `Kuşandığından ${-fark} daha zayıf.` : 'Kuşandığınla aynı.'}
            </Text>
            <View style={st.satir}>
              <Dugme
                etiket={`${e.ad} kuşan`}
                devre={e.seviye > k.seviye}
                stil={{ flex: 1 }}
                onEtkin={() => {
                  const r = M.kusan(k, e.id);
                  if (r && r.hata) Ses.hemen(r.hata);
                  else if (r) Ses.hemen(`${e.ad} kuşandın.`);
                  yenile((x) => x + 1);
                }}
              />
              {tuccarda && (
                <Dugme
                  etiket={`${e.ad} sat, ${M.esyaSatisFiyati(e)} altın`}
                  stil={{ flex: 1 }}
                  onEtkin={() => {
                    const f = M.esyaSat(k, e.id);
                    Ses.hemen(`${f} altına sattın. ${k.altin} altının var.`);
                    yenile((x) => x + 1);
                  }}
                />
              )}
            </View>
          </View>
        );
      })}
      {!tuccarda && k.envanter.length > 0 && <Okunur stil={st.soluk}>Eşya satmak için köydeki Tüccar ile konuş.</Okunur>}
      <Dugme etiket="Geri" onEtkin={geri} stil={st.buyukDugme} />
    </>
  );
}

function TuccarPaneli({ d, canta, geri }) {
  const [, yenile] = useState(0);
  const k = d.k;
  const al = (n) => {
    if (M.iksirAl(k, n)) Ses.hemen(`${n} iksir aldın. ${k.iksir} iksirin, ${k.altin} altının var.`);
    else Ses.hemen('Altının yetmiyor.');
    yenile((x) => x + 1);
  };
  return (
    <>
      <Baslik>Tüccar</Baslik>
      <Okunur stil={st.metin}>
        {k.altin} altının, {k.iksir} iksirin var.
      </Okunur>
      <Dugme etiket={`1 can iksiri al, ${IKSIR.fiyat} altın`} devre={k.altin < IKSIR.fiyat} onEtkin={() => al(1)} />
      <Dugme etiket={`5 can iksiri al, ${IKSIR.fiyat * 5} altın`} devre={k.altin < IKSIR.fiyat * 5} onEtkin={() => al(5)} />
      <Dugme etiket={`Eşya sat, çantada ${k.envanter.length} eşya`} onEtkin={canta} />
      <Dugme etiket="Oyuna dön" onEtkin={geri} stil={st.buyukDugme} />
    </>
  );
}

function HaritaPaneli({ d, geri }) {
  const k = d.k;
  const b = M.bolgeBul(d.oyuncu.x, d.oyuncu.y);
  const gezilen = k.gezilen || [];
  const kesif = k.kesif || [];
  const yerler = YERLER.map((yr) => ({ yr, m: M.mesafe(yr, d.oyuncu) })).sort((a, c) => a.m - c.m);
  return (
    <>
      <Baslik>Harita</Baslik>
      <Okunur stil={st.metin}>{M.konumOzeti(d)}</Okunur>
      <Okunur stil={st.altBaslik}>Bulunduğun bölge: {b.ad}</Okunur>
      <Okunur stil={st.metin}>{b.tarif}</Okunur>
      <Okunur stil={st.altBaslik}>Bölgeler, köyden dışa doğru</Okunur>
      {BOLGELER.map((x) => (
        <Okunur key={x.id} stil={[st.metin, !gezilen.includes(x.id) && { color: R.soluk }]}>
          {x.ad}, köyden {Math.round(x.ic)} ile {Math.round(x.dis)} metre arası{x.aci ? ', yalnız kuzeyde' : ''}
          {x.canavar ? `, ${CANAVARLAR[x.canavar].ad} seviye ${CANAVARLAR[x.canavar].seviye.join(' ile ')}` : ''}. {gezilen.includes(x.id) ? 'Gezildi.' : 'Henüz gidilmedi.'}
        </Okunur>
      ))}
      <Okunur stil={st.altBaslik}>
        Önemli yerler, yakından uzağa. {kesif.length} / {YERLER.length} keşfedildi
      </Okunur>
      {yerler.map(({ yr, m }) => (
        <Okunur key={yr.id} stil={[st.metin, !kesif.includes(yr.id) && { color: R.soluk }]}>
          {yr.ad}: {M.saatSozu(M.saatYonu(d.oyuncu, yr))}, {Math.round(m)} metre. {kesif.includes(yr.id) ? yr.tarif : 'Henüz keşfedilmedi.'}
        </Okunur>
      ))}
      <Dugme etiket="Geri" onEtkin={geri} stil={st.buyukDugme} />
    </>
  );
}

function GorevPaneli({ k, geri }) {
  const g = M.gorevDurumu(k);
  return (
    <>
      <Baslik>Görev</Baslik>
      <Okunur stil={st.metin}>{g.metin}</Okunur>
      <Okunur stil={st.altBaslik}>Görev zinciri</Okunur>
      {GOREVLER.map((x, i) => (
        <Okunur key={x.id} stil={[st.metin, i > k.gorev.sira && { color: R.soluk }]}>
          {i + 1}. {x.ad}: {i < k.gorev.sira ? 'bitti' : i === k.gorev.sira ? 'şu anki görev' : 'sırada'}
        </Okunur>
      ))}
      <Dugme etiket="Geri" onEtkin={geri} stil={st.buyukDugme} />
    </>
  );
}

// ---------------- Uygulama ----------------
export default function App() {
  const [ekran, setEkran] = useState('yukleniyor');
  const [ayar, setAyar] = useState(VARSAYILAN_AYAR);
  const [kayit, setKayit] = useState(null);
  const [karakter, setKarakter] = useState(null);

  useEffect(() => {
    // Sessiz moddayken de konuşsun
    // Efektler VoiceOver ile karışarak çalar; oturum açılışta bir kez açılır ve açık kalır
    setAudioModeAsync({ playsInSilentMode: true, interruptionMode: 'mixWithOthers', shouldPlayInBackground: false })
      .then(() => setIsAudioActiveAsync(true))
      .catch(() => {});
    // Oyun yatay ekranda oynanır
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
    Efekt.efektAyarla({ acik: ayar.efekt !== false, kis: ayar.efektKis !== false });
  }, [ayar.efekt, ayar.efektKis]);

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
    Ses.hemen(kip === 'gorerek' ? 'Görerek oyna seçildi.' : kip === 'voiceover' ? 'VoiceOver ile oyna seçildi.' : 'Sesle oyna seçildi. Oyun VoiceOver gibi çalışır: parmağını ekranda gezdir ya da sağa sola kaydırarak öğeler arasında dolaş. Seçili öğeyi çalıştırmak için ekranın herhangi bir yerine iki kez dokun. İki parmakla dokununca konuşma susar.');
    setEkran('menu');
  };

  const basla = (k) => {
    setKarakter(k);
    setEkran('oyun');
  };

  let icerik = null;
  if (ekran === 'yukleniyor') icerik = <View style={{ flex: 1 }} />;
  else if (ekran === 'kip') icerik = <KipSecim sec={kipSec} />;
  else if (ekran === 'menu')
    icerik = (
      <AnaMenu
        kayitVar={!!kayit}
        kayitOzet={kayit ? `${kayit.ad}, ${SINIFLAR[kayit.sinif].ad}, seviye ${kayit.seviye}` : ''}
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
        bitti={(s) => {
          const k = M.karakterOlustur(s);
          AsyncStorage.setItem(KAYIT_ANAHTAR, JSON.stringify(k)).catch(() => {});
          setKayit(k);
          basla(k);
        }}
      />
    );
  else if (ekran === 'oyun')
    icerik = (
      <Oyun
        karakter={karakter}
        ayar={ayar}
        ayarDegistir={ayarDegistir}
        cikis={() => {
          setKayit(M.kayitHazirla(karakter));
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
  secenek: { paddingVertical: 16 },
  secenekAd: { color: R.yazi, fontSize: 20, fontWeight: '800' },
  secenekAciklama: { color: R.soluk, fontSize: 15, marginTop: 4 },
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
  esya: { backgroundColor: R.panel, borderRadius: 12, padding: 10, gap: 8 },
});
