# TaslarPro deposu — çalışma notları

Depo artık **Diyarın Kaderi** için kullanılıyor (7 Kasım 2026): Bahtiyar'ın Android (Kotlin + Jetpack Compose) gladyatör
RPG'si "Silahşör: Diyarın Kaderi"nin Expo'ya birebir taşınması. Murat: "MMORPG'nin yerine", "hepsi birden", 18+ eşlikçi
sahneleri "olduğu gibi taşı". Görünen ad "Diyarın Kaderi", slug/EAS projesi aynı (taslarpro), dikey ekran.
Önceki oyunlar: İki Sancak `arsiv/iki-sancak/` (App.js, oyun/, efektler, araçlar), Renkli Taşlar `arsiv/renkli-taslar/`.

## Murat ile çalışma
- Murat'ın yalnızca iPhone'u var; kodu elle düzenleyemez. Bütün dosyaları ben yazar, depoya gönderirim.
  Asla "şu satırı değiştir" türü talimat verme.
- Her şey Türkçe: arayüz, VoiceOver etiketleri, kod içi adlar ve yorumlar.
- Oyun dengesi (puan hedefleri, hamle sayıları) Murat'a önerilir, onaylarsa uygulanır.
- Test edilmemiş bir özelliği çalışıyor diye sunma. Görüntü ve ses ancak Murat Expo Go'da denediğinde doğrulanır.
- Murat'a belge verirken Claude Docs kullanma (VoiceOver ile erişilebilirliği kötü dedi); sade, başlıklı, tablo başlıklı HTML sayfası yap.

## Diyarın Kaderi
- Kotlin kaynağı depoda yok (Murat'ın gönderdiği DiyarinKaderi_Proje.zip). Taşıma kuralları: `src/TASIMA_KURALLARI.md`
  (Kotlin → JS eşlemeleri; adlar Kotlin ile AYNI, İngilizce kalır; metinler birebir). Çalışma zamanı `src/kt.js`:
  Data (data class: static T, defaults(), copy, register), defineEnum, MutableStateFlow, idiv, Random, koleksiyonlar, toJson/fromJson.
- Dosyalar (Kotlin paketlerinin aynası): `src/domain/model.js` (tüm modeller), `src/domain/engine/*` (CombatEngine, DuoCombatEngine,
  AestheticCombatEngine, LabyrinthGenerator, anlatım motorları, TextTemplateEngine), `src/data/*` (GameRepository: oyun durumu merkezi;
  SaveManager: AsyncStorage 'diyarinkaderi-kayit-v1', açılışta initialize() ile belleğe alınır; dükkân/karakter/eşlikçi verileri),
  `src/ui/viewmodel/GameViewModel.js` (getGameViewModel() tekil), `src/ui/screens/*`, `src/ui/kit.js` (Compose→RN bileşenleri, VoiceOver),
  `src/ui/theme.js`, `src/audio/SoundManager.js` (expo-audio, keepAudioSessionActive, mixWithOthers; ayarlar 'diyarinkaderi-ses-v1'),
  `src/R.js` (R.raw.x / R.drawable.x), `App.js` (MainActivity).
- Sesler: `assets/ses/*.m4a` (Kotlin res/raw'dan AAC'ye sıkıştırıldı: müzik 56k, efekt 96k; 160 MB → 47 MB). Görsel `assets/gorsel/`.
- VoiceOver: sekmeler "Ad, seçili, sekme 1 / 5"; dövüşte her hamle duyurulur; pencereler modal ve iki parmak Z ile kapanır;
  düğme içeren kartlarda etiket başlıkta (iOS'ta etiketli kap içini gizler); dükkân satırı = bilgi düğmesi + "Satın Al: ad".
- Bilinçli değişiklikler: ayarlar metninde "TalkBack" → "VoiceOver ve TalkBack"; boş çanta yuvaları VoiceOver'dan gizli;
  hamle etiketinde hasar iki kez yazılmaz. Kotlin'den gelen tuhaflıklar korunur (ör. "Deneme'ın" eki, Estetik düelloda nesne yazdırma).
- Testler: `bun test` (Kotlin testlerinin taşınmışı, 34 dosya 192 test; DeepCombat.. testExecutionTraitBonusDamage Kotlin'de de rastgele, ara sıra düşer).
  Tarayıcı: `bash araclar/web-deneme/yap.sh /tmp/claude-0/web && NODE_PATH=/opt/npm-tools/node_modules node araclar/web-deneme/dene.cjs /tmp/claude-0/web /tmp/claude-0/ekran`
  (yeni oyun → hikaye → isim → 5 sekme → dövüş → demirci → han → görev → gün → kayıttan devam).
- Paket denetimi: `bun build index.js --outdir <geçici> --target=browser -e react -e react-native -e expo -e 'expo-*' -e '@react-native-async-storage/*' -e react-native-safe-area-context -e '*.m4a' -e '*.jpg' -e '*.png'`
- 8 Kasım, Murat: "Görev ödülünü alınca VoiceOver hiç okumuyor". Sebep (Yoga): kit Scroll/LazyList `flex: 1` (taban 0) idi;
  yüksekliği belirsiz pencere içinde 0 yüksekliğe iniyor, pencere boş ama modal kalıyordu. Artık flexGrow 1 + flexShrink 1 (taban auto).
  Ayrıca kit Dialog: aynı anda tek üst düzey pencere (sıra; iOS iki Modal'ı birden sunamaz), pencere içindeki pencereler her zaman açılır.
  8 Kasım, Murat: "emojileri kaldır". Tüm src/ ve test/ metinlerinden emojiler betikle silindi (Extended_Pictographic +
  yanındaki tek boşluk; sayı/`}` ardındaki 🪙 → "Altın"; birim olarak kullanılan 🪙/👑 elle "Altın"/"Şöhret" yapıldı). İkon alanları
  (icon, avatarIcon) artık boş dize; `${x.icon} ` kalıpları silindi; kit Ikon hiçbir şey çizmez. Silahsız gösteride kritik atış
  artık '⚡' ile değil anlatım parçasıyla tanınır (GameViewModel KRITIK_ATIS_IPUCLARI). Kilitli arena sekmeleri "(Kilitli)" der.
  Yeni metin yazarken emoji KULLANMA.
- Görseller (8 Kasım, Murat: "görsel koyulacak yerlere görsel koy, butonları görselleştir, düzyazı bırakma; ekran okuyucudan
  gizlenebilir"; seçim: oyun simgeleri). game-icons.net (CC BY 3.0; künye Ayarlar ekranının altında) 224 simge
  `src/ui/gorseller.js` (üretim: `node araclar/gorsel-uret.cjs <game-icons klasörü> araclar/gorsel-secim.txt`; klasör:
  `git clone --depth 1 https://github.com/game-icons/icons`). react-native-svg 15.16.0 (SDK 58). Kit: Gorsel, GorselRozet,
  GorselBaslik, GorselDeger; Btn/Chip `gorsel` prop; Tabs başlığı { baslik, gorsel }. Hepsi VoiceOver'dan gizli, etiketler aynı.
  Eşleme: `src/ui/gorsel-esleme.js` (esyaGorseli+nadirlikRengi, tasGorseli+tasRengi, npcGorseli, odaGorseli, arenaGorseli...).
  Ortak eylem simgeleri: kapat/ayrıl 'kapi', satın al 'sikkeler', sat 'para-kesesi', yükselt 'yukselt', dinlen 'yatak',
  dövüş 'capraz-kilic', yola çık 'patika', ödül 'hediye', kilitli 'kilit', incele 'bilgi'/'gozlemci'.
- Otomatik kayıt (8 Kasım, Murat "yap"): Kotlin yalnız ad/gün/ev/altın-eşya anlarında kaydediyordu. Artık GameRepository
  `_otomatikKayitKur`: player/dayState/leagueState/rooms/enemies değişince en geç 1,5 sn içinde kaydeder (zamanlayıcı kuruluyken
  yeniden kurulmaz); quests/adventures saniyede bir yenilendiği için yalnız durum imzası (id + başladı/bitti/alındı) değişince.
  Oyun başlamadan (startNewGame / loadGame / ilk autoSave öncesi) yazmaz. App arka plana geçince `kaydiHemenYaz()`.
- Arena sesleri (8 Kasım, Murat: "1v1 için ElevenLabs ile temaya uygun efektler, desibelleri ayarla"): 16 ses, ElevenLabs
  eleven_text_to_sound_v2 (akış "Diyarın Kaderi arena sesleri"). Bu ortam elevenlabsusercontent.com'a erişemez: bağlantılar
  `.sesler/liste.txt`'e yazılıp gönderilir, `.github/workflows/sesleri-indir.yml` ham dosyaları `.sesler/ham/`'a indirir;
  `bash araclar/arena-sesleri-isle.sh` sessizliği kırpar, LUFS eşitler (vuruş -14, kanama -18, sıyrılma -17, kritik/nakavt -12,
  seyirci tepkisi -15, döngü -20), -2 dB tepe sınırı, 128k m4a → `assets/ses/arena/`. Tablo `src/audio/ArenaSesleri.js`
  (silahVurusSesi: kılıç/gürz/balta/hançer-mızrak/ok/asa; hamleSesleri: CombatEvent'e göre kritik+seyirci coşkusu, blok,
  sıyrılma, kanama ("KAN KAYBI"), nakavt+zafer/yenilgi, beraberlik). SoundManager: ortam kanalı playAmbience/stopAmbience
  (efektte yarıya kısılır), playSfx 4. parametre düzey, seyirci ayarları (isCrowdEnabled, crowdVolume; Ayarlar ekranında).
  Yalnız 1v1 (GameViewModel.startCombat): seyirci dövüş başında başlar, dismissCombatModal'da söner; efekt çalar, 450 ms sonra
  metin gelir; aralık = efekt + harf/30 sn, en az 4,5 en çok 7 sn (eskiden 3 sn). Tarayıcı taklidi m4a'yı çalmaz (dize kaynak).
  Tarayıcı taklidi CSS ile çizdiği için bu tür Yoga yükseklik hatalarını göstermez; pencerelerde Scroll kullanırken dikkat.

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
