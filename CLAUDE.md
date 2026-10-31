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
- Özel taşlar: 4'lü → çizgili (yatay eşleşme satırı, dikey eşleşme sütunu temizler), L/T → bomba (3x3),
  5'li → renk bombası. Özel+özel takas kombinasyonları ozelKombo'da.
- Zorluk eğrisi (31 Ekim, Murat "kolaydan zora" istedi): DENGE tablosu + egri() doğrusal ara değer. Renk sayısı 1-3: 4,
  4-19: 5, 20+: 6 (20'de hedefler bir kez düşer). bolumTipi: 1 puan, 2 renk, 3 puan, 4 özel; 5'ten sonra puan/renk/özel/buz
  döngüsü (5 buz). Engeller: buz 5+, kalın buz 13+, zincir 10+, taş blok 15+ (22+ iki vuruşluk).
  araclar/denge-simulasyonu.js (akıllı oyuncu, %25 rastgele): 1-12 ~%90-100, 20 civarı %60-80, 40 civarı %40-50.
- Yıldız: kalan hamle oranı ≥0,3 → 3, ≥0,12 → 2, yoksa 1 (yildizHesapla). Kalan hamle × 60 bonus puan (istatistiğe).
- Bölüm haritası (açılan bölümler, yıldızlar, istenen bölüm tekrar oynanır), enYuksek, yildizlar.
- Bonuslar: ipucu, karıştır, bomba, renk, 2x puan. 11 başarım, günlük 3 görev (8'lik havuz), istatistikler, koyu/açık tema.
  "Baştan Başla" Menü > Ayarlar > Oyun grubunda; her şeyi siler (ayarlar kalır).
- Menü (31 Ekim): 4 sekme (MENU_SEKMELERI) tek satır; VoiceOver etiketi "Ayarlar, seçili, sekme 1 / 4" (seçili bilgisi
  etikette, accessibilityState yok ki iki kez okunmasın). İçerik MenuGrubu kutularında, başlıklar header rolünde:
  Ayarlar (Ses, Dokunuş, Görünüm, Oyun), Görevler (x / 3 tamamlandı), Başarımlar (Kazanılanlar / Kazanılacaklar),
  İstatistik (İlerleme, Oyun, Özel taşlar, Bonuslar). Anahtarlar AnahtarSatiri: satırın tamamı switch rolünde.
- Kayıt: AsyncStorage 'taslarpro-kayit-v1' (bölüm, bonuslar, istatistik, başarımlar, günlük, ayarlar, enYuksek, yildizlar,
  devam = yarım kalan bölümün tahtası/puanı/hamlesi; açılışta kimlikAyarla + tahtaGecerliMi ile geri yüklenir).
- Görsel: expo-linear-gradient. Hareketli degrade arka plan + kabarcıklar, degrade taşlar, renge göre şekil (TAS_SEKIL:
  kare/daire/elmas), özel taşlar ortak parilti/donus döngüleriyle canlı, bölüm giriş afişi, kombo yazısı, konfeti ve
  sırayla gelen yıldızlar, sayan puan (useSayac), bomba/renk bombasında sarsıntı, buz/blok/zincir kırık parçaları,
  son 5 hamlede nabız + uyari sesi, 14 sn boşta kalınca sessiz ipucu parlaması.

## Yapı
- App.js tek dosya. Oyun mantığı `// ==== MANTIK BASLANGIC ====` ile `// ==== MANTIK BITIS ====` arasında, saf JS.
  Test: `node araclar/mantik-testi.js App.js` (rastgele oyun simülasyonu + özel taş/engel testleri).
- Sözdizimi denetimi: `bun build index.js --outdir <geçici> $(node -e "const p=require('./package.json');console.log(Object.keys(p.dependencies).map(d=>'-e '+d).join(' '))") -e 'react-native/*' -e '*.mp3' -e '*.png'`
- Sesler assets/sounds: 21 efekt (ikinci parti: yildiz, bolumbasla (1,8 sn'ye kesildi), uyari, sayma, konfeti, tasblok, karistirma) ElevenLabs eleven_text_to_sound_v2 (indirme .github/workflows/sesleri-indir.yml ile;
  bu ortam ElevenLabs depolamasına erişemez, .sesler/liste.txt push edilince Actions indirir). buton.mp3 ve muzik.mp3
  araclar/muzik-ve-buton-sesi.py ile üretildi (ElevenLabs bağlantısı müzik üretmiyor).
- Expo SDK 58. Sürümler expo deposunun sdk-58 dalındaki packages/expo/bundledNativeModules.json'dan.
- Yayın: main'e push → .github/workflows/expo-guncelleme.yml → eas update (branch main). EXPO_TOKEN gizli anahtarı gerekir.
  Kayıt: `git fetch -q origin yayin-kaydi && git show FETCH_HEAD:yayin-kaydi.txt`
