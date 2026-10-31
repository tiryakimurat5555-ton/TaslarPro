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
- Hedefler sırayla: puan, renk toplama, özel taş oluşturma (bolumAyari). Engeller: buz (5+), zincir (10+), taş blok (15+).
- Bonuslar: ipucu, karıştır, bomba, renk, 2x puan. 8 başarım, günlük 3 görev, istatistikler, koyu/açık tema.
- Kayıt: AsyncStorage 'taslarpro-kayit-v1' (bölüm, bonuslar, istatistik, başarımlar, günlük, ayarlar). Tahta kaydedilmez.

## Yapı
- App.js tek dosya. Oyun mantığı `// ==== MANTIK BASLANGIC ====` ile `// ==== MANTIK BITIS ====` arasında, saf JS.
  Test: `node araclar/mantik-testi.js App.js` (rastgele oyun simülasyonu + özel taş/engel testleri).
- Sözdizimi denetimi: `bun build index.js --outdir <geçici> $(node -e "const p=require('./package.json');console.log(Object.keys(p.dependencies).map(d=>'-e '+d).join(' '))") -e 'react-native/*' -e '*.mp3' -e '*.png'`
- Sesler assets/sounds: 14 efekt ElevenLabs eleven_text_to_sound_v2 (indirme .github/workflows/sesleri-indir.yml ile;
  bu ortam ElevenLabs depolamasına erişemez, .sesler/liste.txt push edilince Actions indirir). buton.mp3 ve muzik.mp3
  araclar/muzik-ve-buton-sesi.py ile üretildi (ElevenLabs bağlantısı müzik üretmiyor).
- Expo SDK 58. Sürümler expo deposunun sdk-58 dalındaki packages/expo/bundledNativeModules.json'dan.
- Yayın: main'e push → .github/workflows/expo-guncelleme.yml → eas update (branch main). EXPO_TOKEN gizli anahtarı gerekir.
  Kayıt: `git fetch -q origin yayin-kaydi && git show FETCH_HEAD:yayin-kaydi.txt`
