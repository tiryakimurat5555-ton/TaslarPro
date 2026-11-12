# TaslarPro deposu — çalışma notları

Depo artık **Vahşi Yaşam** için kullanılıyor (12 Kasım 2026, akşam): Murat başka bir yapay zekâyla hazırladığı 113 kararlık
tasarım brifini (PDF "Vahşi Yaşam — Oyun Tasarımı ve Proje Brifi") verdi, "bunu hayata geçir, Taslarpro depomuzu kullanabilirsin" dedi.
Brif ana karar kaynağıdır: kararları kendiliğinden değiştirme, kapsamı daraltma; teknik sınırlamayı Murat'a açıkla.
Aynı gün yapılan savaş oyunu Vahşi Topraklar `arsiv/vahsi-topraklar/` altına taşındı (sesleri assets/efekt'te, yeniden kullanılıyor).
Önceki oyunlar: İki Sancak `arsiv/iki-sancak/`, Renkli Taşlar `arsiv/renkli-taslar/`, Diyarın Kaderi (commit da1e9e1).
Slug/EAS projesi aynı (taslarpro), app.json'daki görünen ad "Vahşi Yaşam".
DİKEY ekran (12 Kasım, Murat "dikey ekran istiyorum, bu oyun aslında Kayıp Okyanus'un karada geçen versiyonu" dedi):
app.json portrait + açılışta lockAsync(PORTRAIT_UP). Oyun ekranı yukarıdan aşağıya: durum kutusu (tam genişlik), bağlam düğmeleri
satırı, 3B görüntü, altyazı, 3×3 eylem ızgarası (her biri %32 × 54), en altta hareket alanı (165 yüksek; VoiceOver kipinde 4 düğmelik
satır). Kip seçimi üst yarı görerek, alt yarı sesle. Sahne dikeyde fov 74, görüntü merkezi %14 yukarı, kamera 1,35 kat geri ve yüksek.
Tarayıcı denemesi 390×844. Kayıp Okyanus (ayrı depo tiryakimurat5555-ton/kayip-okyanus) tam ekran dokunma hareketleriyle oynanır
(tek parmak sürükle yüz/dön, dokun tarif, çift dokun fotoğraf, iki parmak çift dokun menü).
KAYIP OKYANUS DENETİMİ (12 Kasım, Murat "isterim" dedi): VoiceOver kipi dışında (kendi ve görerek) sahada düğme yok; bütün ekran
`oyun/jestler.js` (Kayıp Okyanus'tan aynen, useJestler, dokunmaBekle) katmanı. Tek parmak sürükle = yürü/dön (araçta sür; olcekle 90 px
tam, ölü bölge 0,12), dokun = gözlenen hayvanın tarifi ya da Etrafı tara (+ rota), uzun bas = durum + alet, çift dokun = aletin kullanımı,
iki parmak sağa/sola kaydır = alet değiştir (ALETLER: Dürbün = gozlemBaslat, Fotoğraf makinesi, Ses kayıt cihazı, Yaklaşma),
iki parmak yukarı = araca bin/in (uzaksa araca yürü), aşağı = dur + gözlemi bitir, iki parmak dokun = sus, iki parmak çift dokun = menü.
Sahadayken App `sahada` true olur ve Gezgin kapanır (iki dokunma katmanı çakışmasın; Kayıp Okyanus'ta da tek katman). Menü/panellerde
Gezgin VoiceOver gibi çalışır; iki parmak çift dokunuş (sihirli eylem) bir önceki sayfaya döner (menüde sahaya). Menüye Etrafı tara,
Araca bin/in/git, Dur ve gözlemi bitir, Alet değiştir eklendi. Ekranda yalnız durum kutusu, altyazı ve hareket ipucu yazısı görünür.
VoiceOver kipinde eski düğmeli dikey düzen kalır. Tarayıcıda hareket denemesi: `araclar/web-deneme/jest-dene.cjs` (window.__parmak
parmak sayısı; rn-taklit View onResponder* destekler; hızlı kaydırma sayfa içinde olay gönderir, başsız tarayıcı yavaş).
`dene.cjs` düğmeli düzene göreydi (görerek kip artık hareketli; VoiceOver kipini denemek için uyarlanmalı).

## Murat ile çalışma
- Murat'ın yalnızca iPhone'u var; kodu elle düzenleyemez. Bütün dosyaları ben yazar, depoya gönderirim.
  Asla "şu satırı değiştir" türü talimat verme.
- Her şey Türkçe: arayüz, VoiceOver etiketleri, kod içi adlar ve yorumlar.
- Oyun dengesi (puan hedefleri, hamle sayıları) Murat'a önerilir, onaylarsa uygulanır.
- Test edilmemiş bir özelliği çalışıyor diye sunma. Görüntü ve ses ancak Murat Expo Go'da denediğinde doğrulanır.
- Murat'a belge verirken Claude Docs kullanma (VoiceOver ile erişilebilirliği kötü dedi); sade, başlıklı, tablo başlıklı HTML sayfası yap.

## Vahşi Yaşam (brif Aşama 1-3 yapıldı: teknik temel, saha prototipi, ilk hayvan ve gözlem döngüsü)
- Dosyalar: `oyun/veri.js` (arazi: YARICAP 200, ISTASYON merkezde, GOLET (48,38), nehir y=nehirY(x)=-100+8sin(x/35) yarı genişlik 4,
  GECITLER x=-60 ve 70 (yalnız buradan geçilir), KAYALIK (-115,45), MAGARA, YERLER 10 nokta; DAVRANISLAR 24; TURLER 14: aslan leopar sirtlan
  fil zurafa zebra ceylan domuz suAygiri timsah gergedan kartal piton manda (kisa kimlik öneki, ses, sekil, aktif gunduz/gece/karma,
  kacis m, tehlikeli, yirtici+avlar, habitat, grup boyu); KISILIKLER 4; EKIPMAN menzilleri), `oyun/mantik.js` (saf mantık), `oyun/sahne.js`
  (savan, nehir şeridi, gölet, kayalık, mağara ağzı, istasyon binaları, arazi aracı, 13 hayvan biçimi, yavru/genç ölçeği, gün-gece ışığı,
  ölü hayvan leş durdukça yatık), `App.js`. `ses.js`, `efekt.js`, `gezgin.js` öncekinden aynen.
- Her şey araştırmacı nesnesinde (k) kalıcı: dk (oyun dakikası), oyuncu, arac, aracta, hayvanlar, gruplar, lesler, sayac, arsiv
  {turler, bireyler, fotolar, sesler, olaylar}, itibar. Kayıt AsyncStorage 'vahsi-yasam-kayit-v1' (~50 KB), ayar 'vahsi-yasam-ayar-v1'.
  Otomatik kayıt 20 sn'de bir, önemli olaylarda ~1 sn içinde, panel açılınca ve uygulama arka plana geçince.
- Zaman (karar 10/44): yalnız oyun açıkken akar; gerçek 1 sn = 30 oyun saniyesi, gün 48 dk (ÖNERİ, Murat onaylamadı). Panel açıkken durur.
  Evreler şafak 5:30, gündüz 7, akşam 18, gece 20. Dürbün menzili gündüz 70, şafak/akşam 50, gece 22 m (gece dürbünü Aşama 4'te).
- Hayvanlar: grup (sürü) planı + birey. Plan: otla, gez, dinlen, uyu, su (susuzluk), camur, av (yırtıcı açlığı), beslen, les (sırtlan),
  suda/gunes/pusu (su aygırı, timsah), tunemis/suzuluyor/balikAvi (kartal), bekle (piton). Birey alt davranışı: emzirme, oyun, tımar.
  Av: ava sinsice yaklaş, 24 m'de kovala, 13 sn'de yakalayamazsa vazgeç; timsah su içen ava pusudan. Ölünce leş (2 gün). Her gün doğum
  şansı; grup en az boyunun altına düşerse göç. Bot testi 10 günde nüfus dengede.
- Bireysel kimlik (karar 37/55): oyuncu isim vermez; 6 sn gözlenen birey kimlik numarası alır (FIL-01, konuşmada "Fil 1").
  Cinsiyet, evre, kişilik, anne, grup, alışma (0-1; sakin uzaktan izlenince artar, ürkütünce azalır, kaçış mesafesini %60'a kadar kısaltır).
- Oyuncuya tepki: kaçış mesafesi = tür × kişilik × (1-0,6 alışma) × araçta 0,45 (hızlıysa 0,85) × gece 0,8. Tehlikeli türler (aslan, fil,
  su aygırı, timsah, gergedan, manda) yayaya önce uyarır, 3,5 sn sonra sahte saldırı (oyuncu geri sıçrar, itibar -2, 25 sn sakin).
  Otomatik yürüyüş tehlikeli hayvanların çevresinden dolaşır (tehlikedenKacan). Timsahlar ürkünce suya dalar.
- Eylemler: Gözlemle (sıradaki görünen hayvan), Yaklaş (kaçış+5 m'de durur), Fotoğraf (kalite: uzaklık, davranış, nadirlik, gece),
  Ses kaydı (6 sn; yakındaki 3 türü seslendirir; tür, yön, mesafe, ses türü), Etrafı tara (sürüleri tek cümlede), Neredeyim, Yerler
  (yol bulma nehir geçitlerinden), Arşiv (Türler/Bireyler/Fotoğraflar/Sesler/Günlük, tür ve birey sayfaları birbirine bağlı). Araç: 6,5 m
  içindeyken Araca bin; Yerler araçla sürülür. İki parmak çift dokunuş = Fotoğraf çek.
- İtibar (sayılar oyuncuya söylenmez): yeni tür 8, birey 2, davranış 2 (nadir 6), nadir davranışın iyi fotoğrafı 5, tanıklık 4-6, ilk ses 3.
- Sesler: mevcut ElevenLabs sesleri (aslan, leopar, sirtlan, timsah, gergedan, domuz, kartal, yilan) + bu oturumda üretilenler (fil,
  zebra, suaygiri, manda, ceylan, zurafa; akış "Vahşi Yaşam sesleri"). Ortam: savan; nehir ve sulak alanda ortam_bataklik.
  Ayak sesi her 1,5 m; foto 'etkinles', gözlem seçilince hayvan yönünden sonar.
- Testler: `bun araclar/oyun-testi.js [gün]` (bot gözlemler, yürür, kaydı yükler; nüfus raporu).
  Tarayıcı: `bash araclar/web-deneme/yap.sh /tmp/claude-0/web && NODE_PATH=/opt/npm-tools/node_modules node araclar/web-deneme/dene.cjs /tmp/claude-0/web /tmp/claude-0/ekran`
  (three r166 /tmp/claude-0/three/build/three.module.js, nasıl alınacağı aşağıda İki Sancak'ta).
- Sıradaki aşamalar (brif bölüm 6): Aşama 4 araştırma merkezi (ekipman: gece dürbünü, GPS tasma, kamera tuzağı; personel; bütçe),
  Aşama 5 ekosistem (bitki/su/iklim, hastalık, göç, yaşlanma), Aşama 6 100+ tür, mağara içi, afetler, koruma projeleri,
  Aşama 7 uçtan uca erişilebilirlik testleri. Hiçbiri Murat'a sorulmadan başlanmadı.

## Vahşi Topraklar (arşivde: arsiv/vahsi-topraklar/; yollar artık oraya göre)
- Dosyalar: `oyun/veri.js` (HARITALAR 5, HAYVANLAR 20 (her haritada 3 tür + lider), SILAHLAR 11, ZIRHLAR, YETENEKLER 4, IKSIR),
  `oyun/mantik.js` (saf mantık: avcı, hesapla, gerekenXp 60×sv^1.7, hayvanStat, hasar, dunyaOlustur(k, haritaId), guncelle,
  tüccar satinAl, kampaDon, patronaGit, yön tarifleri), `oyun/sahne.js` (expo-gl + three: hayvan biçimleri dortayak/ayi/kedi/gergedan/
  timsah/yilan/akrep/kus, bacak ve kanat hareketi, ağaç türleri cam/karcam/mese/olu/kaktus/saz/akasya, kamp, göller, silah modeli
  silaha göre değişir, yayla ok uçar), `oyun/efekt.js`, `oyun/ses.js` ve `oyun/gezgin.js` (İki Sancak'tan aynen), `App.js`.
- Haritalar (seviye): Yeşil Orman 1-7 (lider Boz Ayı sv8, kuzey), Kavurucu Çöl 7-13 (Dev Kum Akrebi sv14, doğu), Sisli Bataklık 12-18
  (Yaşlı Timsah sv19, güney; göller geçilmez), Karlı Dağlar 17-24 (Kutup Ayısı sv25, batı), Altın Savan 22-30 (Aslan Kral sv30, kuzeydoğu).
  Her harita yarıçap 110 m, ortada kamp (13 m, hayvan girmez, can hızlı dolar, Tüccar). Harita değişince Oyun yeniden kurulur (key).
  Menü > Haritalar; kilitli olanlar seviyeyle açılır. Liderler 240 sn'de yeniden çıkar. Tilki ve gergedan sen saldırmadıkça saldırmaz.
- Denge (Murat'a sorulmadan seçildi, "bana bir şey sorma" dedi; değiştirmek isterse öneri yapılır): bot testi
  `bun araclar/oyun-testi.js 90` 65 dk'da sv 30, 0 ölüm (bot iksir ve yeteneği kusursuz kullanıyor).
- Sesler (ElevenLabs eleven_text_to_sound_v2, akış "Vahşi Topraklar sesleri"): 12 hayvan, 6 silah, ıska, yaralı, düştü, altın, seviye,
  5 ortam. Ham dosyalar `.sesler/ham/` (vahsi-sesler dalındaki indirme iş akışıyla alındı). `bash araclar/sesleri-isle.sh <ham>`:
  LUFS eşitler, hayvanlar ve "dustu" 3B olur: 5 konum eşit güçlü pan + kulaklar arası 0,6 ms gecikme, arka sürüm alçak geçiren + yankı
  (`ad_0..4`, `ad_0a..4a`, en çok 2,6 sn), `oyun/sesler.js`'i yazar. Bu bağlayıcı ElevenLabs'te en çok ~1-2 sn ses üretiyor; ortam sesleri
  bu yüzden `python3 araclar/ortam-yap.py <ham> assets/efekt` ile 24 sn'lik döngüye çevrildi (süzülmüş gürültü rüzgârı + kısa sesin rastgele
  yön ve zamanlarda tekrarları). Kırpılmış sentez sesler (adim, odak, sinir, sonar, kalp...) İki Sancak'tan.
- 3B ses kullanımı: efekt.yonlu(ses, oyuncu, hayvan, düzey, duyma) uzaklığa göre (3/m)^0,85 kısar. Kovalayan en yakın 2 hayvan 2,5 sn'de
  bir, gezinen en yakın 3 hayvandan biri 7-16 sn'de bir sesini çıkarır (40 m); hedef menzil dışındaysa sonar; hayvan ölünce yönünden
  "dustu". Ortam döngüsü ayrı kanal (ses 0,35, Ayarlar > Ortam sesi). Telefonda doğrulanmadı.
- Kayıt: AsyncStorage 'vahsi-avci-v1', ayarlar 'vahsi-ayar-v1'. araclar/web-deneme hâlâ Diyarın Kaderi'ne göre; Vahşi Topraklar'a uyarlanmadı.

## İki Sancak (arşivde: yollar artık arsiv/iki-sancak/ altında)
- Tasarım kararları (6 Kasım, Murat): fantastik dünya, 4 sınıf (Savaşçı, Okçu, Büyücü, Rahip), deneme için seviye sınırı 30,
  oyunun kendi ses motoru. Tasarım belgesi: claude.ai artifact "Karakter Sistemi" (karakter, nitelik, gelişim, yetenek, basma).
- Dosyalar: `oyun/veri.js` (sınıf, ırk, ulus, yetenek, canavar, görev tabloları), `oyun/mantik.js` (saf mantık: karakter,
  hasar, deneyim 100×sv^2.2, dünya, canavar yapay zekâsı, görevler, yön tarifleri), `oyun/ses.js` (expo-speech konuşma motoru:
  öncelik 0-5, 3+ keser, kuyruk 4, 4 sn bayatlama; kipler kendi / voiceover / gorerek), `oyun/sahne.js` (expo-gl + three 0.166.1,
  düşük poligonlu ilkel şekiller, üçüncü şahıs kamera, setViewOffset ile görüntü merkezi yukarıda), `App.js` (arayüz).
- Koordinat: x doğu, y kuzey; yön 0 = kuzey, saat yönünde artar. three'de (x, 0, -y), rotation.y = -yon.
  Yönler saat gibi söylenir (saatYonu/saatSozu): 12 önde, 3 sağda.
- Kipler: ilk açılışta seçilir (VoiceOver açıksa VoiceOver/kendi seçimi). Kendi seste `oyun/gezgin.js` (oyunun ekran okuyucusu,
  Murat "VoiceOver hareketleriyle aynı olsun" dedi) tüm ekranı saran bir dokunma katmanıyla çalışır: dokun/gezdir = altındakini oku,
  sağa/sola (ve yukarı/aşağı) hızlı kaydır = sonraki/önceki öğe, herhangi bir yere iki kez dokun = seçili öğeyi çalıştır (tek dokunuş 300 ms bekletilir; çift dokunuşun ilk dokunuşu odağı değiştirmez,
  çift dokunuş olay zaman damgasıyla anlaşılır — Murat "Geri çalışmıyor" dedi, sebep buydu), iki parmak
  dokunuş = sus, iki parmak çift dokunuş = sihirli eylem (oyunda Saldır), üç parmakla kaydır = sayfa kaydır. Öğeler useOdak ile
  kaydolur (Dugme, Okunur, Baslik, DogrudanAlan); sıra ekrandaki konuma göre (400 ms'de bir measureInWindow). Katman: panel
  seviye 1, yalnız en üst katman gezilir; ekran/katman değişince odak sessizce ilk öğeye geçer. Hareket alanı DogrudanAlan:
  dokunuş doğrudan joystick'e gider. Sayfa (ScrollView) seçili öğeyi görünür tutar. Panel açıkken 3B çizim de durur. VoiceOver kipinde joystick yerine İleri yürü / Sola dön / Sağa dön / Geri git düğmeleri.
  Panel açıkken alttaki oyun öğeleri erişilebilirlikten gizlenir, panel accessibilityViewIsModal; panel açıkken dünya durur.
- Dünya (6 Kasım, Murat "haritaları detaylandır" dedi): yarıçap 285 m, köy ortada, 4 yol. veri.js BOLGELER: köyden dışa halkalar
  (Akpınar Köyü 0-18, Çayır Yamaçları -76,5, Gümüş Çay 76,5-81,5, Meşe Korusu -112, Goblin Tepeleri -140, Haydut Geçidi -165,
  Kızıl Sınır -190, Örümcek Kayalıkları -212, Golem Harabeleri -235, Sisli Kıyı -258, kuzeyde (±0,6 rad) Ejder Bataklığı, gerisi
  Sınır Dağları); her bölgenin zemin rengi, ağaç sayısı ve türü (cam/mese/olu), kaya sayısı, sis (0-1), canavarı ve tarifi var.
  bolgeBul(x,y). Gümüş Çay geçilmez (nehirde), köprüler yolların üstünde (|x| ya da |y| < 2,8). yolNoktasi: hedef karşı yakadaysa
  en uygun köprüye, köprüdeyken yol çizgisine hizalanıp karşıya; iki uç dış yakadayken düz çizgi çaydan geçiyorsa halka boyunca dolaşır.
  Takılma kurtarma (1,5 sn'de 0,5 m ilerlemezse 1,3 sn yana sapar). YERLER: 15 önemli yer (köprüler, kule, ağıl, Yaşlı Meşe, kamplar,
  kervan, ork kampı, örümcek yuvası, kale harabesi, batık tapınak, ejder yuvası); 13 m'de keşfedilir (k.kesif), deneyim =
  gerekenXp(bölge seviyesi)×0,12. Canavarların %40'ı kendi yuvalarının (CANAVAR_YUVASI) çevresinde doğar. Bölgeye girince duyuru
  (ilk kez tarifiyle, k.gezilen). Menüde Harita paneli. Sahne: bölge halkaları, mavi çay, taş köprüler, üç ağaç türü, yer modelleri
  (yerModeli), bölgeye göre sis. Çaya yaklaşınca su sesi; bölge ve keşif sesleri. Görev metinleri bölge adlarını söyler.
  Harita anlatımı: claude.ai artifact "İki Sancak Haritası". Muhtar (0,5), oyuncu (0,1)'de doğar. Tüccar: iksir alır, eşya satar.
- Hedefe yürürken engeldenKacan ağaç/kayanın yanından dolaşır (bot bunun için takılıyordu).
- Ekran yatay (6 Kasım, Murat onayladı): app.json orientation landscape + açılışta expo-screen-orientation lockAsync(LANDSCAPE).
  Oyun ekranı: üst satır solda durum (290 geniş), sağda bağlam düğmeleri (sütun); alt satır solda hareket alanı 250×208
  (VoiceOver kipinde hareket düğmeleri), ortada altyazı (6 sn sonra silinir), sağda 3×3 eylem ızgarası (84×66). Kamera ofseti %6.
  Sayfalar en çok 720 geniş, ortalı. Kip seçimi sol yarı görerek, sağ yarı sesle. Tarayıcı denemesi 844×390.
- Kayıt: AsyncStorage 'ikisancak-karakter-v1' (karakter + konum), ayarlar 'ikisancak-ayar-v1'.
- Testler: `bun araclar/oyun-testi.js [dakika]` (her sınıf için bot oynatır; 60 dk'da bot 30'a ulaşıyor, deneme için bilerek hızlı).
  Tarayıcı: `bash araclar/web-deneme/yap.sh /tmp/oyun-web && NODE_PATH=/opt/npm-tools/node_modules node araclar/web-deneme/dene.cjs /tmp/oyun-web /tmp/oyun-ekran`
  (three'yi /tmp/claude-0/three/build/three.module.js'den alır: `git clone --depth 1 --filter=blob:none --sparse -b r166 https://github.com/mrdoob/three.js`
  ve `git sparse-checkout set --no-cone /build/three.module.js`; THREE_YOLU ile değiştirilebilir). expo-gl taklidi gerçek WebGL tuvali kullanır,
  yani 3B sahne de denenir. Görerek, sesle (çift dokunuş) ve VoiceOver kipleri denenir.
- Sözdizimi denetimi: `bun build index.js --outdir <geçici> $(node -e "const p=require('./package.json');console.log(Object.keys(p.dependencies).map(d=>'-e '+d).join(' '))") -e 'react-native/*' -e '*.mp3' -e '*.png'`
- Ses efektleri (6 Kasım, Murat "ElevenLabs şimdilik kullanma" dedi): `araclar/efekt-uret.py` numpy/scipy ile sentezler →
  assets/efekt/*.mp3 (137 dosya, 1,3 MB) ve oyun/sesler.js (require tablosu, elle düzenlenmez; script yeniden üretir).
  Yönlü sesler (aldin, sonar, kurt, domuz, goblin, insan, ork, orumcek, golem, golge, ejder) 5 konum × önde/arkada (arka boğuk):
  `ad_0`..`ad_4`, `ad_4a`. `oyun/efekt.js`: cal(ad, ses), yonlu(taban, oyuncu, hedef) (pan = sin(göreli açı), uzaklıkla kısılır),
  oynatıcılar ilk çalışta yaratılır (expo-audio createAudioPlayer + seekTo(0) + play). CANAVARLAR[tur].efekt hangi sesi kullanır.
  App döngüsü: olay → efektCal; ayak sesi her 1,6 m; kovalayan en yakın 2 canavar ~2,6 sn'de bir yönlü ses; hedef menzil dışındaysa
  sonar (yaklaştıkça sıklaşır); can %30 altında kalp. Gezgin: odak tıkı, sınır ve çalıştırma sesi. Ayar: Ses efektleri aç/kapa.
  Murat "TTS dalgalanıyor, konuşurken sesi kısılıyor" dedi (6 Kasım): ses oturumu interruptionMode 'doNotMix' (ilk sürüm).
  Murat "halen dalgalanıyor, efektlerle karışıyor" deyince: konuşma ve efekt artık hiç üst üste binmez. Konuşurken efekt çalınmaz;
  efekt çalınca süresi (efekt.js SURE, en çok 0,6 sn) ses.js'e bildirilir (efektCalindi), konuşma o bitince başlar (en çok 600 ms bekler);
  konuşma başlarken uzun efektler (su, ışınlanma, ejder...) durdurulur. Ayar "Efektleri konuşmayla karıştırma" (efektKis, varsayılan açık).
  VoiceOver kipinde bu kural yok (Murat "VoiceOver ile efektler aynı anda çalsın" dedi): efektler VoiceOver konuşurken de çalar;
  VoiceOver'ın kendi "Ses Kısma" (Audio Ducking) ayarı açıksa iOS efektleri kısar, o oyunun elinde değil.
  Asıl sebep (expo-audio sdk-58 kaynağından): oynatıcı bitince (onPlaybackComplete) ve pause'da 100 ms sonra AVAudioSession
  kapatılıyor; her efektte oturum açılıp kapanınca VoiceOver/konuşma sesi dalgalanıyor. Çözüm: createAudioPlayer(k,
  { keepAudioSessionActive: true }), interruptionMode 'mixWithOthers', açılışta setIsAudioActiveAsync(true).
  Speech.speak volume 1; ayak sesi 0,22, sonar 0,45. Telefonda doğrulanmadı.
- Oynanabilirlik (aynı gün): öldürünce seni kovalayan başka canavar varsa hedef ona geçer (d.otoHedef); hedefin yokken saldıran
  canavar hedefin olur; bağlam satırında "Görev hedefini bul" (gorevHedefiBul: görev türünden en yakın canavara yürür) ve görev
  bitince "Ödül için köye dön"; seviye atlayınca puanlar otomatik dağıtılır (ayar otoPuan, varsayılan açık).
- Sıradakiler (Murat onaylamadı, öneri): ElevenLabs ile daha gerçekçi sesler, eşya basma, ikinci ulus köyü, çok oyunculu sunucu.

## Ortak
- Expo SDK 58. Sürümler expo deposunun sdk-58 dalındaki packages/expo/bundledNativeModules.json'dan (expo-gl ~58.0.4, expo-speech ~58.0.3).
- Yayın: main'e push → .github/workflows/expo-guncelleme.yml → eas update (branch main). EXPO_TOKEN gizli anahtarı gerekir.
  Kayıt: `git fetch -q origin yayin-kaydi && git show FETCH_HEAD:yayin-kaydi.txt`. docs/** yayını tetiklemez.
- assets/sounds: Renkli Taşlar'ın ses efektleri (kullanılmıyor). İki Sancak'ın sesleri arsiv/iki-sancak/assets/efekt altında.

## Sokağın Şarkısı (6 Kasım 2026)
- docs/index.html: yürüyüşü anlık müziğe çeviren tek dosyalık web prototipi (Web Audio, mikrofon analizi, adım sensörü,
  pentatonik dizi, VoiceOver duyuruları, MediaRecorder kaydı). GitHub Pages ile main dalının /docs klasöründen yayınlanır.
  docs/** Expo güncelleme iş akışını tetiklemez. Beğenilirse ileride Expo uygulamasına taşınacak.
- Gerçek enstrümanlar (6 Kasım): docs/sesler/ altında kırpılmış mono mp3 örnekleri (piyano, arp, gitar, kontrbas, viyolonsel,
  ksilofon: tonejs-instruments, MIT; davul/bongo: Tonejs/audio drum-samples). Notalar en yakın örnekten playbackRate ile.
  Setler SETLER/NOTALAR tablolarında; "sentez" seti eski osilatör sesleri ve yükleme hatasında yedek. GitHub Pages'te
  charset/viewport meta etiketleri dosyanın başında olmalı (artifact iskeleti yok).
- Besteci (6 Kasım, ikinci sürüm; Murat "hazır kalıp olmasın, duyduğu frekanslardan sıfırdan melodi üretsin" dedi):
  hazır ilerleme/motif YOK. perdeBul: FFT (4096) 150-8000 Hz en belirgin tepe, çevresinden 30/hassasiyet dB yüksekse perdeli ses;
  parabolik ara değerle frekans → midi. Olay takibi (B.olay): yeni perde = kuyruğa 'bas', susunca 'bit'. playStep her 16'lıkta
  kuyruğu tüketir: en güçlü olay nota olur (perdeyiNotala: oktavla 62-86 aralığına, tona; ölçü başında akor tonuna yaslanır),
  'bit' gelince nota bırakılır (notaBirak). B.kroma (6 sn) → her ölçü akorSec (dizi akorları içinden en uygun), B.uzunKroma (45 sn)
  → tonTahmin (Krumhansl profilleri, 8 ölçüde bir, belirgin iyileşmede geçer, VoiceOver duyurur). "Ton türü" seçimi: ortama göre /
  saate göre / hep majör / hep minör. Ritim ve bas ritmi adımlardan, bas notası akor kökünden, eşlik akor arpeji/tıngırdatma.
  Deneme ortamı (ORTAM, ortamUret) gerçekten ses üretir (kuş şarkıları, motor, korna, martı, dalga) ve çözümleyiciye girer;
  yani deneme de aynı algı yolundan geçer. "Deneme ortamının sesini de duy" ile ortam sesi kulağa da verilir.
