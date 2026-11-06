# TaslarPro — çalışma notları

## Murat ile çalışma
- Murat'ın yalnızca iPhone'u var; kodu elle düzenleyemez. Bütün dosyaları ben yazar, depoya gönderirim.
  Asla "şu satırı değiştir" türü talimat verme.
- Her şey Türkçe: arayüz, VoiceOver etiketleri, kod içi adlar ve yorumlar.
- Oyun dengesi (puan hedefleri, hamle sayıları) Murat'a önerilir, onaylarsa uygulanır.
- Test edilmemiş bir özelliği çalışıyor diye sunma. Görüntü ve ses ancak Murat Expo Go'da denediğinde doğrulanır.

## Oyun
- Renkli Taşlar: Murat'ın HTML oyunu (renkli-taslar-pro.html) sıfırdan React Native'e yazıldı (31 Ekim 2026).
- 6x6 tahta, dokun-seç-dokun-takas; yalnız eşleşme oluşturan takaslar geçerli. VoiceOver ile oynanır
  (oyun kendi sesini kullanmaz): tahtanın üstünde sabit, şeffaf 36 Pressable katmanı vardır, görsel taşlar altta
  ve erişilebilirlikten gizlidir; böylece animasyonlar VoiceOver odağını kaydırmaz. Sonuçlar announceForAccessibility ile.
  Hücre etiketinde engel başta (Murat istedi): "Buzlu Kırmızı, 6. satır, 5. sütun", "Zincirli kalın buzlu Mavi yatay çizgili, ...".
- Özel taşlar: 4'lü → çizgili (yatay eşleşme satırı, dikey eşleşme sütunu temizler), L/T → bomba (3x3),
  5'li → renk bombası. Özel+özel takas kombinasyonları ozelKombo'da.
- Zorluk eğrisi (31 Ekim, Murat "kolaydan zora" istedi): DENGE tablosu + egri() doğrusal ara değer. Renk sayısı 1-3: 4,
  4-19: 5, 20+: 6 (20'de hedefler bir kez düşer). bolumTipi: 1 puan, 2 renk, 3 puan, 4 özel; 5'ten sonra
  buz/puan/kiraz/renk/özel döngüsü (5 buz, 7 kiraz). Engeller: buz 5+, kalın buz 13+, zincir 10+, taş blok 15+ (22+ iki vuruşluk).
  araclar/denge-simulasyonu.js (akıllı oyuncu, %25 rastgele): 1-12 ~%75-100, 20 civarı %40-80, 40 civarı %25-60
  (simülasyon oyuncusu kirazda zayıf; gerçek oyuncu daha iyi).
- Kiraz hedefi (1 Kasım): gem {color: -3, special: 'meyve'} (KIRAZ, kirazMi). Eşleşmez, patlamaz (temizlikHesapla atlar),
  özel kombo yapmaz. En alt satıra inince kirazTopla; tahtada en çok 2 kiraz, kirazEkle üst satıra koyar. Kiraz bölümlerinde
  zincir ve taş blok yok, üst satırda buz yok. Uygulamada kirazlariIsle (zincirle içinde, her yerçekiminden sonra).
  Tahtanın altında yanıp sönen ▼ okları.
- Günlük bulmaca (1 Kasım): gunlukBulmacaHazirla(tarih) → rastgeleKaynak(tohumluUretec(metinTohumu(...))); bölüm 8-32
  arasından, herkese aynı tahta. Oyun boyunca tohumlu rng kalır (bolumBaslat Math.random'a döner; ödül seçimleri hep
  Math.random). s.oyunModu 'bolum' | 'gunluk'. İlk çözüş: 40 + 5×seri (en çok 90) altın + bonus; s.gb {cozulen, seri, enIyi, enIyiTarih}.
- Altın ve mağaza (1 Kasım): başlangıç 50; bölüm 10 + 5×yıldız. MAGAZA_FIYAT ipucu 20, karıştır 30, bomba 50, renk 70, 2x 40.
  Hamle bitince bir kez "+5 hamle" 40 altın (s.ekHamleAlindi). Sayılar Murat'a önerildi, onayı beklenmeden uygulandı
  ("her açıdan geliştir" dedi); değiştirmek isterse DENGE/MAGAZA_FIYAT/EK_HAMLE_FIYAT.
- Tanıtım pencereleri: TANITIMLAR + tanitimlariBul(ayar); s.tanitimlar'da olmayan öğe bölüm başında bir kez anlatılır.
  Eski kayıtlarda geçilmiş bölümlerin öğeleri sessizce görülmüş sayılır.
- VoiceOver hızlı eylemleri: her hücrede accessibilityActions (sag/sol/yukari/asagi = yer değiştir, satir/sutun = oku),
  hucreEylemi. satirMetni/sutunMetni hucreKisa ile ("buzlu kiraz").
- Ayarlar: hizli (HIZ 0.55, sn() ile süreler), azHareket (AZ_HAREKET: sarsıntı, konfeti, kabarcık, afiş kayması yok;
  ilk açılışta sistem "Hareketi Azalt" ayarından), kisaDuyuru (hamle duyurusu yalnız puan/hedef/hamle).
- Bölüm başına en iyi puan s.enIyi (haritada ve "Yeni rekor!").
- Yıldız: kalan hamle oranı ≥0,3 → 3, ≥0,12 → 2, yoksa 1 (yildizHesapla). Kalan hamle × 60 bonus puan (istatistiğe).
- Ana ekran düğmeleri: Bölümler, Tekrarla (mod bilir: tekrarla()), Bonuslar; Günlük Bulmaca, Mağaza.
- Bölüm haritası (açılan bölümler, yıldızlar, istenen bölüm tekrar oynanır), enYuksek, yildizlar.
- Bonuslar: ipucu, karıştır, bomba, renk, 2x puan. 14 başarım, günlük 3 görev (9'luk havuz), istatistikler, koyu/açık tema.
  "Baştan Başla" Menü > Ayarlar > Oyun grubunda; her şeyi siler (ayarlar kalır).
- Menü (31 Ekim): 4 sekme (MENU_SEKMELERI) tek satır; VoiceOver etiketi "Ayarlar, seçili, sekme 1 / 4" (seçili bilgisi
  etikette, accessibilityState yok ki iki kez okunmasın). İçerik MenuGrubu kutularında, başlıklar header rolünde:
  Ayarlar (Ses, Dokunuş, Görünüm, Oyun), Görevler (x / 3 tamamlandı), Başarımlar (Kazanılanlar / Kazanılacaklar),
  İstatistik (İlerleme, Oyun, Özel taşlar, Bonuslar). Anahtarlar AnahtarSatiri: satırın tamamı switch rolünde.
- Kayıt: AsyncStorage 'taslarpro-kayit-v1' (bölüm, bonuslar, istatistik, başarımlar, günlük, ayarlar, enYuksek, yildizlar,
  enIyi, altin, tanitimlar, gb, devam = yarım kalan bölümün tahtası/puanı/hamlesi + mod/gunlukL/tarih/ekHamleAlindi;
  açılışta kimlikAyarla + tahtaGecerliMi ile geri yüklenir; günlük devam yalnızca aynı gün).
- Görsel: expo-linear-gradient. Hareketli degrade arka plan + kabarcıklar, degrade taşlar, renge göre şekil (TAS_SEKIL:
  kare/daire/elmas), özel taşlar ortak parilti/donus döngüleriyle canlı, bölüm giriş afişi, kombo yazısı, konfeti ve
  sırayla gelen yıldızlar, sayan puan (useSayac), bomba/renk bombasında sarsıntı, buz/blok/zincir kırık parçaları,
  son 5 hamlede nabız + uyari sesi, 14 sn boşta kalınca sessiz ipucu parlaması.

## Yapı
- App.js tek dosya. Oyun mantığı `// ==== MANTIK BASLANGIC ====` ile `// ==== MANTIK BITIS ====` arasında, saf JS.
  Test: `node araclar/mantik-testi.js App.js` (rastgele oyun simülasyonu + özel taş/engel/kiraz/tohum testleri).
- Tarayıcı denemesi (arayüz çöküyor mu, pencereler, akışlar): `bash araclar/web-deneme/yap.sh <klasör>` sonra
  `node araclar/web-deneme/dene.cjs <klasör> <ekran-klasörü>`. rn-taklit.js / expo-taklit.js basit web taklitleridir
  (React /opt/npm-tools'tan, esbuild ile). Görüntü yaklaşıktır (sembol yazı tipi yok); asıl amaç hata yakalamak.
  Kayıt ön yüklemesiyle kiraz toplama, kaybetme (+5 hamle), kazanma, günlük bulmaca kazanma denenir.
- Statik denetim: eslint no-undef / no-use-before-define (yapılandırma geçici klasörde; JSX adlarını denetlemez).
- Sözdizimi denetimi: `bun build index.js --outdir <geçici> $(node -e "const p=require('./package.json');console.log(Object.keys(p.dependencies).map(d=>'-e '+d).join(' '))") -e 'react-native/*' -e '*.mp3' -e '*.png'`
- Sesler assets/sounds: 24 efekt (ikinci parti: yildiz, bolumbasla (1,8 sn'ye kesildi), uyari, sayma, konfeti, tasblok, karistirma;
  üçüncü parti: altin, kiraz, satinal) ElevenLabs eleven_text_to_sound_v2 (indirme .github/workflows/sesleri-indir.yml ile;
  bu ortam ElevenLabs depolamasına erişemez, .sesler/liste.txt push edilince Actions indirir). buton.mp3 ve muzik.mp3
  araclar/muzik-ve-buton-sesi.py ile üretildi (ElevenLabs bağlantısı müzik üretmiyor).
- Expo SDK 58. Sürümler expo deposunun sdk-58 dalındaki packages/expo/bundledNativeModules.json'dan.
- Yayın: main'e push → .github/workflows/expo-guncelleme.yml → eas update (branch main). EXPO_TOKEN gizli anahtarı gerekir.
  Kayıt: `git fetch -q origin yayin-kaydi && git show FETCH_HEAD:yayin-kaydi.txt`

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
