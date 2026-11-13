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
MENÜLER (12 Kasım, Murat "menü yapısını Kayıp Okyanus'a bakarak düzenle" dedi): Gezgin kaldırıldı. `oyun/SesliListe.js` Kayıp
Okyanus'un SesliListe'sinin uyarlaması: sağa/sola kaydır = satır, dokun = oku, çift dokun = seç, uzun bas = ipucuyla yeniden oku,
iki parmak dokun = sus, iki parmak çift dokun = geri; görerek kipte dokunmak seçer; VoiceOver kipinde Pressable satırlar (VoiceListe).
`Liste` kipine göre seçer. useMenuYigini (yol + düzey başına odak), altMenu(id, etiket, ac, ipucu), sayfali(anahtar, ogeler, menu, 12),
her listenin sonunda Geri. App'te menuIcerigi(id): ana, cevre, yerler, alet, saha, merkez, mesajlar, gorevler, teklif-<id>, arastirmalar,
ekipman, tesisler, personel, arsiv, turler, tur-<tur>, bireyler, birey-<id>, fotolar, sesler, gunluk, ayarlar, yardim, oy-<konu>.
Ana menü, kip seçimi ve ad seçimi de Liste. Menü açıkken dünya durur.
VoiceOver kipinde eski düğmeli dikey düzen kalır. Tarayıcıda hareket denemesi: `araclar/web-deneme/jest-dene.cjs` (window.__parmak
parmak sayısı; rn-taklit View onResponder* destekler; hızlı kaydırma sayfa içinde olay gönderir, başsız tarayıcı yavaş).
`dene.cjs` eski düğmeli düzene göreydi (artık geçersiz); denemeler jest-dene.cjs ile.

## Murat ile çalışma
- Murat'ın yalnızca iPhone'u var; kodu elle düzenleyemez. Bütün dosyaları ben yazar, depoya gönderirim.
  Asla "şu satırı değiştir" türü talimat verme.
- Her şey Türkçe: arayüz, VoiceOver etiketleri, kod içi adlar ve yorumlar.
- Oyun dengesi (puan hedefleri, hamle sayıları) Murat'a önerilir, onaylarsa uygulanır.
- Test edilmemiş bir özelliği çalışıyor diye sunma. Görüntü ve ses ancak Murat Expo Go'da denediğinde doğrulanır.
- Murat'a belge verirken Claude Docs kullanma (VoiceOver ile erişilebilirliği kötü dedi); sade, başlıklı, tablo başlıklı HTML sayfası yap.

## Vahşi Yaşam (brif Aşama 1-6 yapıldı: teknik temel, saha, gözlem, araştırma merkezi, ekosistem, içerik ve ölçekleme)
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
  zebra, suaygiri, manda, ceylan, zurafa; akış "Vahşi Yaşam sesleri").
  Ortam (12 Kasım, Murat "ortam sesleri çok kısa, döngüde sağdan soldan atlıyor, rahatsız ediyor" dedi): eski 1-2 sn'den kurulmuş
  rastgele yönlü 24 sn döngüler silindi. Yeni: ElevenLabs add_flow_node model_parameters {duration_seconds 30, loop true,
  prompt_influence 0.5} + run_flow_nodes (generate_in_flow süre almaz) → ortam_gunduz, ortam_gece (cırcır böcekleri), ortam_nehir.
  `araclar/ortam-dongu.py`: kanal gücü eşitlenir, son 1,5 sn başa çapraz geçiş (28,5 sn kesintisiz), -22 LUFS. App ortamSec:
  nehir/sulak/gölet kıyısı → nehir, akşam ve gece → gece, yoksa gündüz; bölge ve gün evresi değişince. efekt.js ortamBaslat
  eskisini 2 sn'de kısıp yenisini 2 sn'de açar.
  Ayak sesi her 1,5 m; foto 'etkinles', gözlem seçilince hayvan yönünden sonar.
- Testler: `bun araclar/oyun-testi.js [gün]` (bot gözlemler, yürür, kaydı yükler; nüfus raporu).
  Tarayıcı: `bash araclar/web-deneme/yap.sh /tmp/claude-0/web && NODE_PATH=/opt/npm-tools/node_modules node araclar/web-deneme/dene.cjs /tmp/claude-0/web /tmp/claude-0/ekran`
  (three r166 /tmp/claude-0/three/build/three.module.js, nasıl alınacağı aşağıda İki Sancak'ta).
- Aşama 4 araştırma merkezi (12 Kasım, `oyun/merkez.js`, saf; sayılar ÖNERİ, Murat onaylamadı): başlangıç bütçesi 15.000 lira,
  günlük gider 300 + maaş + tesis bakımı, günlük destek itibar/10 × 100 (en çok 2.500). EKIPMANLAR geceDurbunu 6000, teleobjektif 5000,
  parabolik 4000, termal 12000, tuzak 2500/adet, tasma 4000/adet (itibar ve araştırma koşulları). TESISLER konaklama, kule (istasyondan
  150 m tarama), gelismisLab, klinik. PERSONEL sahaArastirmacisi, biyolog, fotografci, teknisyen, veteriner (GPS tasmayı o takar).
  ARASTIRMALAR 9 (ilerleme → analiz 8 oyun saati → itibar, fon, ekipman açılır). Kurum teklifleri (en çok 3). Kamera tuzakları 15 m'de
  20 oyun dakikasında bir fotoğraf; GPS'li hayvanlar Yerler'de. Mesajlar (k.mesajlar, son 60). Mz.guncelle(d) her karede.
  Sahnede tesis ve tuzak modelleri. Bot testi merkez işlerini de yapar. Tarayıcı denemesi jest-dene.cjs menülerde sağa kaydırarak gezer.
- Aşama 5 ekosistem (12 Kasım akşam, Murat "devam" dedi; sayılar ÖNERİ): `oyun/ekosistem.js` (saf, mantik'i içe aktarmaz; mantik ve merkez
  onu kullanır). Takvim: yıl 24 gün = 10 gün yağışlı + 14 gün kurak (takvim(gun)); yıl başında bazen yağmur gecikmesi (2-4 gün) ya da
  kurak yıl. Günlük hava havaUret (acik/parcali/bulutlu/yagmurlu/saganak/sicak, yağmur dilimleri saat aralığıyla), yağışta dürbün ×0,75,
  sağanakta ×0,55 (gorusCarpani, durbunMenzili içinde). k.eko: islaklik (toprak nemi), yesil, golet (0-1), alg, nehir, ot/yaprak ızgarası
  (16×16, 25 m hücre; kapasite bölgeye ve ağaç sayısına göre, d.kap her açılışta hesaplanır), salgin, teshisler, gocler, gecitPusu.
  ekoAdim her karede: yağış → nem, gölet, alg temizliği; buharlaşma; sıcak ve sığ gölette alg; ot büyümesi neme bağlı.
  GOLET.su = o anki su yarıçapı (goletAyarla): golettemi/engelleItele/suNoktasi bunu kullanır, kuruyunca su nehirde; yerleşim için
  goletCanagi (tam r). Otlayan gruplar hücreden yer (TUKETIM), günlük besin → kondisyon. Planda en gür otu/yaprağı seçer; sağanakta ağaç
  altına sığınır. Birey: yas (gün; evre YASAM tablosundan, yıl×24), kondisyon, hastalik {id, siddet, tedavi, goruldu}, teshis, yetim,
  bagisik, gecmis (son 12 olay). gunlukEkosistem (gunlukDogumlar başında): hava, mevsim duyurusu, yaşlanma, erginleşen genç erkek
  ayrılır (k.disari), kondisyon, hastalık seyri ve bulaşma (yara: av kaçışı; parazit: kirli gölet suyu; uyuz: grup içi; şarbon: kurak
  mevsimde yılda bir olası salgın, leşten 60 m), açlık/yaşlılık/yetim ölümleri, göç kararı ve dönüşü. Doğum çoğunlukla yağışlı mevsimde.
  Göç (GOCMENLER zebra doğu geçidi, ceylan batı geçidi): g.goc yol noktaları → geçitte b.gecis ile nehir geçilir, timsahlar gecitPusu'da
  bekler (geçenleri %3/sn yakalayabilir) → alan dışına çıkınca k.disari'ya taşınır → yağmurla döner (kayıp ve göçte doğan yavrular).
  Açık sistem: azalan/tükenen gruba çevreden birey gelir (yoksa tür bölgeden silinirdi). Yırtıcı acıkma ACLIK_SURESI.
  Merkez: numuneler (su, dışkı, leş, bitki yaprak/tohum; kutu 6, istasyona dönünce teslim, laboratuvar 3 saat, sırayla), teşhis ve salgın
  doğrulama, veteriner müdahalesi (yara/parazit/uyuz; sağlıklıya ve zayıfa dokunmaz), şarbonlu leşi yakma, rehab tesisi (klinik +
  hastalikEkolojisi araştırması; karantina, tedavi, beslenme, uyum, sonra Bırak), botanikUzmani personeli, BITKILER 8 (bölgeye göre,
  4 mevsim evresi, analiz metni), 6 yeni araştırma, numune/bitki görevleri. GPS göçtekinin uzaklığını söyler.
  App: ana menüde Ekosistem raporu, Çevredeki bitkiler, Numune ve veteriner; merkezde Laboratuvar, Hayvan sağlığı, Rehabilitasyon;
  arşivde Bitkiler; birey sayfasında yaşam kaydı; Yardım "Mevsimler ve ekosistem". Sahne: yağmur çizgileri, bulutlu gök ve sis, zemin
  yeşilliği, gölet küçülür ve kıyısı kurur, rehab çiti, haritadan çıkan modeller gizlenir. Sesler (akış "Vahşi Yaşam sesleri"): ortam_yagmur
  (30 sn döngü, -24 LUFS; yağarken ortamSec bunu seçer), gok (6 sn; sağanak başında ve 18-48 sn'de bir). sesler.js tablosu assets/efekt
  listesinden üretilir. Test: `bun araclar/ekosistem-testi.js [gün]` (50 gün ~2 dk: nüfus dengede, gölet kurak sonunda 0,1-0,3, göç ve
  dönüş, salgın). Bilerek yapılmayanlar (Aşama 6): yangın, sel, bölgesel hâkimiyet, genetik, mağara, yeni türler.
- Aşama 6 içerik (12 Kasım gece, Murat "devam" dedi; sayılar ÖNERİ). Toplam 124 tür = 19 büyük (TURLER) + 105 küçük.
  Yeni büyük türler: gnu (göçmen, doğu geçidi), cita (gündüz avcısı, gunduzAvcisi), impala (akasyalık kenarı), yabanKopegi (alacaAvcisi,
  nadir), babun (galeri ormanı, yeme yiyecekAriyor); sesleri ElevenLabs (3B, UC_B listesinde). Yeni bölgeler: galeri (GALERI: nehrin kuzeyinde
  x 100-190, 36 m şerit, sık kıyı ağaçları), termit (TERMITLER (-140,-40) r 30; engel tür 'termit', sahnede kızıl koniler); YERLER +2.
  Eski kayıtlara eksik türlerin grubu dunyaOlustur'da turGrubuKur ile eklenir. Av: yoğunluğa bağlı (bölgede ≤4 kalan türü avlamazlar);
  kalabalık otçul sürülerinde yağışlı mevsimde birden çok doğum. HASTALIKLAR + distemper (köpek gençlik hastalığı; yaban köpeği, sırtlan,
  aslan; k.asili aşılananlar). `oyun/kucukler.js`: KUCUKLER 105 (kuş 32, sürüngen 11, amfibi 6, balık 6, böcek 20, örümcek/akrep 5,
  diğer 4, memeli 22 (Aşama 10'da ağaç damanı); Aşama 12'de uzak alanların 19 canlısı; yer, oda, zaman gunduz/gece/her/alaca, mevsim, sik, yagmur, ses, nadir), MAGARA_ODALARI 5, bulunabilirler().
  `oyun/kesif.js` (mantik'i ve ekosistemi kullanır; merkez onu çağırır): kucukAra (alet "Büyüteç ve fener", menüde Küçük canlı ara;
  bölge/saat/mevsim/yağmura göre ağırlıklı, 3,5 sn bekleme, %75 başarı, gece ekipmansız %50; özel anlar: termitlerin çiftleşme uçuşu,
  yarasaların akşam çıkışı 18:20-19:10), ardından fotoğraf (d.sonKucuk, 25 sn). Mağara: ekipman magaraTakimi (2.500), girişin 14 m'sinde
  Mağaraya gir; k.magara {oda}; mağarada tek parmak yukarı/aşağı kaydır = ilerle/geri (0. odada çık), dokun = oda tarifi, dürbün/yaklaşma
  çift dokunuşu = ara; dışarıdaki hayvanlar oyuncuyu yok sayar; sahnede MZ 3000'de ayrı tünel ve fener ışığı; ortam_magara.
  Kaçak avcılık (k.kacak): günde %30 (devriyeyle ×0,35) yeni tel tuzak (en çok 4), 7 m'de fark edilir, kamera tuzağı yakınındakini
  bildirir; otçul takılırsa b.tuzakta (kıpırdayamaz, yara), 2 günde ölür; tuzakSok, tuzaktanKurtar (veteriner hemen, yoksa servis ertesi gün).
  Afetler (ekosistem.js): rüzgâr (hava.ruzgarYon/Hiz); yangın yanginRiski (kurak mevsim 7. gün sonrası kuru ve sıcak, ya da yağışlı
  ilk günlerde kuru sağanakta yıldırım) → yanginPlan → hücre hücre rüzgâr yönüne yayılır (yanmaz: nehir, gölet, istasyon şeridi),
  40 dk yanar, yağmur söndürür, yanık alanda ot 1,8 kat hızlı büyür (12 gün). Hayvanlar kaçar, yavaşlar ölebilir, oyuncu uyarılır/geri
  itilir, kamera tuzakları yanar; ortam_yangin 70 m'de; Ekosistem raporunda Yangın söndürme ekibi (3.000). Sel: nehir > 0,96 ve günlük
  yağış > 50 mm, mevsimde en çok bir kez, 6-12 saat taşkın: gecitteMi false, yerGit karşı kıyıyı reddeder, nehir kahverengi.
  Koruma projeleri (merkez KORUMA; k.koruma {projeler, devriye, asi, kampanya}): gergedan, yabanKopegi (aşı), kacakMucadele, akbaba;
  adımlar tamam(k, p) + eylem (ücretli); devriye günlük 200 lira. 3 yeni araştırma (kucukCanlilar, magaraEkosistemi, yanginEkolojisi).
  App: ana menüde Mağaraya gir / Mağaradasın, Tel tuzağı sök, Küçük canlı ara; numune menüsünde Tuzaktaki hayvanı kurtar; merkezde
  Koruma projeleri; arşivde Küçük canlılar (gruplara göre); Yardım "Küçük canlılar, mağara, afetler ve koruma". VoiceOver kipinde
  mağarada hareket satırı Geri dön / İlerle / Odayı anlat / Mağaradan çık. Sesler: gnu, cita, impala, yabankopegi, babun (3B), yarasa,
  ortam_magara (-24), ortam_yangin. Kayıt ~100 KB. Ekosistem testi 50 gün ~4,5 dk.
- Aşama 7 erişilebilirlik ve kalite (12 Kasım gece, Murat "devam" dedi; sayılar ÖNERİ). `oyun/betimleme.js` (saf): betimle(d, alet)
  ışık, hava/rüzgâr, zemin (bölgeye göre), önündeki engel 12 m (onSozu), yakın yer işaretleri 80 m, duyulan sesler, dürbünle görülenler,
  gözlenen; mağarada oda; kisaBetimle bölgeye girince (ayar otoBetimle). Uzun bas ve ana menü "Çevreyi betimle" (VO bağlam düğmesi de).
  `oyun/egitim.js`: ADIMLAR 8 (betimle, gölet, gözlemle, tanımla, foto, ses, küçük canlı, görev), metin kipe göre (hareket/vo),
  k.egitim 1..8, 99 bitti; App 1,2 sn'de bir egitimDenetle; Ayarlar'dan baştan başlatılır. Zorluk (mantik ZORLUK_ALANLARI, k.zorluk,
  zorlukCarpani kolay/normal/zor): tehlike (kaçış, kolayda sahte saldırı yok), kesif (dürbün, küçük canlı), afet [0.25,1,1.6]
  (yangın, sel, tel tuzak), ekonomi gider [0.6,1,1.3] destek [1.4,1,0.8], arastirma süreleri [0.5,1,1.5]. LOD: 130 m'den uzak gruplar
  0,3 sn'de bir güncellenir. kayitOnar(k) kayittanYukle'de bozuk alanları onarır (k.onarim duyurulur); yedek 'vahsi-yasam-yedek-v1'
  5 dk'da bir, ana kayıt okunamazsa yedekten açılır; hata günlüğü 'vahsi-yasam-hata-v1' (döngü try/catch + HataSiniri). Ayarlar
  grupları: Ses ve konuşma (ortam düzeyi, ses altyazısı, otomatik betimleme), Kontroller (hassasiyet, sürekli yürüme, büyük düğme,
  sol el), Görünüm ve grafik (yüksek kontrast, büyük yazı: SesliListe GORUNUM; grafik yuksek/dusuk/kapali: düşükte yarı kare,
  CIZIM 70, kapalıda GLView yok), Zorluk, Eğitim, Hata kayıtları. Sesli komut: Expo Go'da konuşma tanıma yok, iOS Sesle Denetim önerilir.
  Testler: `bun araclar/dayaniklilik-testi.js [n]` (bozuk kayıt + metin denetimi; 400/400), oyun-testi Performans ve Bozuk metin satırı
  (KAYIT_YAZ=dosya kaydı yazar), `node araclar/web-deneme/menu-tara.cjs <web> <kayit.json> kendi|voiceover` (bütün menüleri gezer:
  210 sayfa, 1829 satır, sorun 0). Telefonda doğrulanmadı.
- VoiceOver odağı (12 Kasım, Murat "VoiceOver menü açıldığında menüye odaklanamıyor, Kayıp Okyanus'ta da olmuştu" dedi; kendi ses
  kipindeyken VoiceOver açıktı): App voAcik (screenReaderChanged); VoiceOver açıkken seçilen kip ne olursa olsun etkin kip 'voiceover'
  (düğmeli düzen + VoiceListe), kapanınca seçilene döner, geçişler duyurulur. VoiceListe açılınca AccessibilityInfo.setAccessibilityFocus
  (250 ve 700 ms) başlığa ya da alt menüden dönülünce onu açan satıra (onOdak basılınca). Telefonda doğrulanmadı.
- Tek dokunma katmanı (12 Kasım gece, Murat oyunun kendi ekran okuyucusuyla "menüye odaklanmıyor, hareketlerim alt ekrana gidiyor"
  dedi; ekran görüntüsünde menü konuşuyordu ama görünmüyordu): Kayıp Okyanus DalisEkrani çözümü. Hareketli kiplerde sahaJest katmanı
  Oyun kökünde en üstte (zIndex 20) hep kurulu; menü açıkken (menuOrt zIndex 10) dokunuşları listeRef'e iletir (surukle, kaydir, dokun,
  ciftDokun, uzunBas); oyun içi Liste'ler disaridanJest (SesliListe kendi katmanını kurmaz). Ana menü/kip seçimi listeleri kendi katmanlı.
  3B tanı: 8 sn'de GLView bağlamı ya da sahne kurulmazsa hata kayıtlarına yazılır (Murat'ın görüntülerinde 3B alan boş, lacivertti).
  Murat'ın hata kaydı "Üç boyutlu sahne kurulmadı" (bağlam oluşuyor, sahneKur atıyor) → sahne.js cizerOlustur Kayıp Okyanus'tan
  (getContextAttributes yedeği + WebGLRenderer kurulurken globalThis.WebGLRenderingContext gizlenir; three r163+ WebGL 1 reddi).
  Menü telefonda konuşup görünmüyordu: oyun ekranındaki SafeAreaView kaldırıldı (useSafeAreaInsets dolgusu), menü katmanı
  pointerEvents none (Kayıp Okyanus gibi). Web taklidinde useSafeAreaInsets 47/34.
- Adım ve dönüş sesleri (12 Kasım gece, Murat "yürüme ve dönme sesini üret; dönmeyi Kayıp Okyanus'tan al, adımları çevreye göre
  yeni ürettir" dedi): ElevenLabs (akış "Vahşi Yaşam sesleri", 5 sn "altı ağır adım", prompt_influence 0.6) adim_ot/toprak/camur/su/
  kaya/yaprak/magara → `python3 araclar/adim-bol.py <ham> assets/efekt` başlangıçlardan böler, her zeminden 4 adım (adim_<z>_0..3,
  rms eşit). M.zeminTuru(d): mağara, nehir/gölet suyu (geçitte su), kayalık kaya, galeri şeridi yaprak, istasyon toprak, gölet/sulak/
  nehir kıyısı 9 m/yağmur ya da ıslaklık>0,75 çamur, ot<0,2 toprak, yeşil ağaçlık yaprak, yoksa ot. App adimCal (aynısı art arda yok,
  ADIM_DUZEY), mağarada oda değişince 4 yankılı adım. Dönüş: Kayıp Okyanus tik.wav/hedefOnde.wav → donus_tik, hedef_onde (mp3);
  M.donusTikirtisi(d) Kayıp Okyanus algoritması (30° dilim, 0,6 histerezis, ana yön 0,6 düzey, hedef = gözlenen ya da d.rota,
  önüne gelince hedef_onde + Haptics.selectionAsync). Ayar donusTiki (Ses ve konuşma). Yardım "Sahada hareketler" 7. satır.
- Menü ve koşu sesleri (13 Kasım gece, Murat "menüyü daha efektif hale getir; adım seslerini kara hayvanlarına da uygula, kaçarken
  koşarken 3B duyalım" dedi). Ana menü 18 → ~11 satır: Sahaya dön, o an yapılabilenler (tel tuzağı, mağara, dur, eğitim), Çevreyi
  betimle, Görüş alanı, Yerler, Araç, Alet, 'doga' (Doğa: ekosistem, küçük canlı ara, bitkiler, numune, saha ekipmanı), Merkez, Arşiv,
  'oyun' (Durum, Ayarlar, Nasıl oynanır, Kaydet ve ana menüye dön); giriş yalnız saat ve bölge. SesliListe: tek parmak yukarı kaydır
  = ilk satır, aşağı = son satır (Geri). Yardım "Menülerde gezinme" 4. satır. Koşu: mantik KOSU_SESI (kosu_toynak zebra/gnu/zürafa,
  kosu_hafif ceylan/impala/domuz, kosu_agir fil/gergedan/su aygırı/manda, kosu_pati kediler/sırtlan/yaban köpeği/babun), b.kosu
  (kaçış dalı, kovalayan avcı ve av, sahte saldırı), kosanlar(d, 55) (suda olan su canlısı hariç). App: en yakın 3 koşan, her biri
  1,85 sn'de bir Efekt.yonlu (KOSU_DUZEY). Sesler ElevenLabs 2 sn loop (pati ilk deneme çok kısık çıktı, prompt_influence 0.8 ile
  yeniden), sesleri-isle.sh UC_B'de (3B, 10 dosya). Bot 20 dk'da karelerin %6'sında koşu sesi var. jest-dene Doğa alt menüsünden geçer.
- Aşama 8 genişleme (13 Kasım gece, Murat "geliştir genişlet" dedi; briften yapılmamış kararlar 24, 39, 41, 73, 83, 84; sayılar ÖNERİ).
  `oyun/genisleme.js` (saf; M ve E'yi kullanır, merkez ve App onu çağırır; G.guncelle(d, dt) her karede, işleri 2 sn'de bir).
  Genetik (mantik): birey baba, gen {h çeşitlilik, tasiyici}, dna, kalitsal, akrabalik; akrabalik(d,a,b) Wright katsayısı (4 kuşak);
  doğumda babaSec (g.lider %75) + kalitim (h ortalama×(1-F), iki taşıyıcı → kalıtsal zayıflık, yavruyken günlük %5 ölüm; F≥0,125
  kondisyon -0,15); göçmenler h 0,72-0,9. dışkı numunesi analizi G.dnaAnalizi (profil + baba doğrulama). G.popGenetik/genetikSatirlari
  (en az 3 DNA; risk puanı), aileSatirlari (aile-<id> menüsü). Koruma projesi 'genetik' (3 DNA, translokasyon 8.000 → G.translokasyon
  en riskli türe iki göçmen, yavru doğsun). Hâkimiyet: YIRTICI_GUC, varlık puanı bölge başına (kurakta su başı ×1,5), günlük hâkim
  (eskinin 1,4 katı gerek), değişim mesajı; rekabet: iki yırtıcı grup 28 m'de → zayıf kaçar, güçlü 'bolgeKoruyor' (görülürse olay,
  itibar 4); liderlik: aslan/zebra/impala günde %10 meydan (ayrılmış genç erkek ya da gocmenEkle göçebe), 14 sn 'meydanOkuyor',
  kazanan g.lider, kaybeden disari, %40 yara. Dron (ekipman drone 9.000): alet 'dron' (aletlerAl ile yalnız sahipken), 110 m'ye
  22 m/sn, 3 sn tarama 45 m (sürüler sayılır, turKaydi, haritaya, tel tuzak bulunur, leş, yangın), ürkekleri (kacis≥28) %25 ürkütür,
  3 şarj istasyon/kampta dolar; 3B 'dron' sesi 1,7 sn'de bir. Tekne (7.000): k.tekne iskelede (YER 'iskele'), k.teknede: mantik
  guncelle nehir boyunca (TEKNE_HIZ 2,6), kaçış ×0,55, kurek sesi 2,4 m'de; iki parmak yukarı/aracIslemi bin/in; yerGit 'tekne'.
  Kamp (kampTakimi 3.000): Doğa'da kur/taşı (istasyondan ≥40 m, sudan uzak), kaçış ×0,6 (10 m), Dinlen menüsü (kamp ya da istasyon):
  iki saat / 17:30 / 05:30; App dinlenRef karede 400 adım, d.dinleniyor (sahte saldırı yok), dokunuş bırakır, özet (OZET_TURLERI).
  Harita: k.harita.gruplar {tur,x,y,sayi,dk,kaynak} gözlem/GPS/kamera tuzağı/dron; ana menüde Ekosistem haritası, hb-<bölge>
  (otlak, gölet, hâkim, bilinen sürüler, tuzaklar, kamp, "Bu bölgeye yürü"). Sahne: tekne, dron (10 m'de, pervaneler), kamp modeli.
  Kayıt: asama8Alanlari / asama8Onar (dunyaOlustur'da; bozuk harita/hâkimiyet atılır). Yardım "Genetik, bölgeler, dron, tekne ve kamp".
  Sesler dron (3B), kurek. Testler: dayanıklılık 300/300 (Aşama 8 metinleri dahil), bot 6 gün, ekosistem 30 gün dengede,
  menu-tara 198 sayfa iki kipte sorun 0, /tmp/claude-0/g8-dene.js 24 gün: rekabet ~5/gün, meydan nadir. Telefonda doğrulanmadı.
- Aşama 9 davranış ve keşif (13 Kasım gece, Murat "devam" dedi; kararlar 47, 69, 70, 71, 85, 86, 93, 105, 108, 109, 110; sayılar ÖNERİ).
  mantik: DUYULAR (tür başına koku/görme/işitme), ruzgarDurumu (hava.ruzgarYon rüzgârın geldiği yön; +1 kokun hayvana gidiyor),
  duyuCarpani kacisMesafesi'nde (rüzgâr üstü ×1+0,45r·hız·(koku-0,3), rüzgâr altı ×0,82, yürürken ×1+0,15(işitme-0,5), dururken
  ×0,92, gündüz uzun ot ×1-0,12·görme; 0,6-1,8), ruzgarUyarisi (yaklaş ve betimlemede). b.korku (kurtulan av +0,5, tel tuzaktan
  kurtarılan +0,8, oyuncudan ürken +0,04; günlük ×0,5/0,65/0,8 kişiliğe göre) kaçış ×(1+0,6 korku); b.aracAlisma (araçtan sakin izleme)
  araçta kaçış ×(1-0,4); g.tehlikeYerleri (avlanılan/kovalanan yer 2 gün, 30 m, enGur -0,6). grupAlarm zincir: otçul alarmı 38 m'deki
  otçul sürüleri gecikmeli kaçırır (olay 'alarmZinciri', ilk görülüşte itibar 3). Kamera tuzağı ilk gün hayvanların yarısı çekinir.
  YUVA_TURLERI 7 (sırtlan/yaban köpeği ini termitlerde, leopar ağacı, aslan sığınağı, kartal yuvası, timsah yuvası, babun uyku ağaçları),
  k.yuvalar (yuvalariKur, tohum 31337); aktif olmayan saatlerde grup yuvaya gider. `oyun/izler.js` (saf; Iz.guncelle her karede, 2 sn'de
  bir): g.iz iz noktaları (8 dk/6 m, 30 nokta, 4 saat okunur, yağmur siler), izAra (12 m, iz tarifi tür tipine göre, tazelik, yön),
  izTakip (en taze ize ya da izler ine gidiyorsa ine; varınca sahibi söylenir), yuvaBul (14 m saha, gece GPS'li birey 15 m, dron 45 m;
  itibar 6), video (alet 'video', 10 sn, 50/80 m teleobjektifle, k.arsiv.videolar, nadir davranışın ilk videosu +5), kesifAni (yeniTur,
  tanik, meydan, yuvaBulundu, rekabet, nadir yeniDavranis, video nadir): App 'kesif' vurgu sesi + titreşim + d.sinematik (sahne kamerası
  4,5 sn hayvana yaklaşır), ayar kesifAnlari. App: Doğa'da İzleri incele / İzi takip et / Bilinen inler ve yuvalar (yuvalar), Arşiv'de
  Videolar; harita bölgesinde bilinen yuvalar. HATA DÜZELTMESİ: olay() ekindeki `tur` olay türünü eziyordu ('yeniTur' ve 'goc' olayları
  hayvan adına dönüşüp sessiz kalıyordu); artık ek.tur → hayvanTur. Ses: kesif (ElevenLabs, kalimba vurgusu). Testler: dayanıklılık
  300/300, bot 5 gün, ekosistem 25 gün, menu-tara 146 sayfa iki kipte sorun 0, /tmp/claude-0/g9-dene.js. Telefonda doğrulanmadı.
- Aşama 10 hikâye ve sesler (13 Kasım, Murat "devam; araca binme/inme kapı sesi ve sürerken araç sesi" dedi; kararlar 26, 27, 58, 91;
  sayılar ÖNERİ). Araç sesleri (ElevenLabs akış "Vahşi Yaşam sesleri"): kapi_bin, kapi_in (sesleri-isle.sh, 3B değil), motor (6 sn loop,
  ortam-dongu.py ile 4,5 sn kesintisiz döngü). efekt.js motorDuzey(oran) / motorDurdur (KO itici döngüsü gibi; düzey ve setPlaybackRate
  0,8-1,25 hıza göre), App olay 'arac' bindi/indi → kapı sesi; araçtayken oran 0,28 + 0,72·|aracHiz|/ARAC.hiz; menü, dinlenme, araç dışı
  ya da efekt kapalıyken durur. `oyun/hikaye.js` (saf; M'yi kullanır, App ve testler H.guncelle(d, dt) her karede; d.olaylar'ı sayar
  (_sayildi), işleri 2 sn'de bir): k.hikaye {gizemler, basarilar, sayac, ziyaretci, sonZiyaretGun, zarGun, gorusmeler}, hikayeAlani onarır.
  BASARILAR 16 (tür, birey, davranış, nadir davranış, göç, yuva, teşhis, foto, video, ses, küçük canlı, gözlem saati, bir yıl, 3 gizem):
  ödül itibar + fon + bağış ekipman (varsa +2.000 fon) + personel bursu (1.500) ; "Bir tam yıl" merkez gunlukDestek'e +400.
  GIZEMLER 4 (adım adım tamam(d, g)): golet (alg > 0,3 → kıyı, su numunesi, analiz; siyanobakteri), gece (2. gün gece → galeri ormanı
  gece, küçük canlı ara → yeni kucuk agacDamani; 106 küçük canlı), leopar (5. gün, leopar kayıtlı → iz takibi sonu (sayac.izSonu), leopar
  ini), kacak (ilk tel tuzak → 3 tuzak, devriye ya da korucuyla konuşma; çözülünce 6 gün tuzak olasılığı ×0,2, kesif tuzakKurulumu
  sayac.kacakBaski). Aynı anda en çok 2 açık gizem. Ziyaretçi (karar 27): günde bir zar 8-15 arası, ZIYARET_SANSI 0,3, 2. günden;
  KISILER korucu (en yakın tel tuzağın yönü + kacak gizemi; yoksa tehlikeli sürü uyarısı), coban (kaydedilmemiş türün yönü + gece gizemi),
  arastirmaci (600 lira, bulunmamış yuvanın yönü + leopar gizemi); bir YER yakınında 180 oyun dk; 7 m'de ana menüde "Konuş: ...";
  Yerler'de "Ziyaretçi:" (yerGit 'ziyaretci'); betimlemede "bir korucu" vb.; sahnede giysi rengi kişiye göre insanModeli, oyuncuya dönük.
  Merkez'de Gizemler ve Bilimsel başarılar; Yardım "Gizemler, insanlar ve bilimsel başarılar". Olaylar basari/gizemCozuldu (kesif sesi +
  titreşim), gizem/insan (odak); dinlenme özetinde. Testler: dayanıklılık 300/300 (konuşma, gizem, başarı metinleri), bot 6 gün
  (leopar gizemi çözüldü, 10 başarı), menu-tara 149 sayfa iki kipte sorun 0. Telefonda doğrulanmadı.
- Aşama 11 su ve istasyon çevresi (13 Kasım, Murat "devam" dedi; kararlar 92, 94, 99; sayılar ÖNERİ). Durum kutusunda ad/gün/saat ve
  bütçe/itibar artık ayrı satırlarda (Expo Go dişlisi itibarı kapatıyordu). `oyun/su.js` (saf; M, E, K'yı kullanır, merkez onu içe
  aktarır; S.guncelle 3 sn'de bir): SU_NOKTALARI 7 (batiYatak, batiGecit, kumKivrim, doguGecit, galeriKiyi nehirde y = nehirY(x);
  golet; sulak (-20, nehirY-35)), yakinNokta (16 m, teknede 30, gölet r+14, sulak 30). k.su {olcumler {id: son 12}, gecisler {id: {tur: n}},
  istasyonSon}, suAlani onarır. suOlc: olcumHesapla hava sıcaklığı, güneş, gölge, gölet düzeyi, alg, nehir debisi, yağmur, taşkından
  sıcaklık/bulanıklık/akış/oksijen/düzey; nokta başına günde bir; ilk ölçüm itibar 3, yeni mevsim 2. suyuGozle: noktanın tipine uyan
  Balık/Amfibi/Kuş/Sürüngen/Böcek küçük canlılarından ağırlıklı seçim → K.kucukKaydet (artık dışa aktarılıyor). gecisSay (yalnız
  geçitlerde): son 24 saatin grup iz noktaları ±14 m + göçte b.gecis. Merkez ARASTIRMALAR + suAtlasi (7 nokta × 2 mevsim) ve
  gecisNoktalari (6 tür geçiş + 6 balık/kurbağa). İstasyon çevresi: ISTASYON_ANLARI 15 küçük canlı sahnesi, istasyondayken 40-70 oyun dk'da
  bir ('istasyonAni' ya da ilk kez görülürse kucukKaydet). App: Doğa > Su araştırması (Suyu ölç, Suda yaşayanları gözle, Hayvan
  geçişlerini say, rapor, noktalara rota), Yardım "Nehir, gölet ve istasyonun çevresi". Testler: dayanıklılık 300/300, bot 5 gün,
  menu-tara 236 sayfa iki kipte sorun 0 (/tmp/claude-0/zengin10.json). Telefonda doğrulanmadı.
- Aşama 12 uzak alanlar ve ekolojik yönetim (13 Kasım, Murat "devam" dedi; kararlar 17, 64, 65; sayılar ÖNERİ). Uzak araştırma alanları
  mağara altyapısını kullanır: k.magara = {oda, alan}; kucukler.js UZAK_ALANLAR (tuzla Kızıl Tuz Gölü itibar 40 / 800 lira / yol 120 dk,
  dag Bulutlu Dağ Ormanı 70 / 1.000 / 150, bataklik Papirüs Bataklığı 100 / 1.200 / 150; her biri 5 nokta, zemin, ortam), odaListesi(alan),
  aktifOda(k), bolumAdi(k); UZAK_CANLILAR 19 küçük canlı (alan alanı, yer [], yalnız orada; KUCUKLER'e eklenir, toplam 125; mevcut
  kimliklerle çakışmasın: uzunbacak, karaSirtliCakal, kolobus, akcigerliBalik, jakana savanda var). bulunabilirler({alan}) alan canlıları
  ve saat filtresi. kesif: odaGir alanda noktaGir, uzakDurumu/uzakHazirla (istasyondaMi 30 m, ücret, araçtan iner)/uzagaVar/uzaktanDon,
  uzakSatirlari, uzakIlerleme, k.arsiv.uzak {alan: [nokta]}; magaraGeri ilk noktada dönmez (menüden). App: Merkez > Saha gezileri
  (Yola çık → dinlenBaslat(hedef, {metin, bitince}) yolculuk dinlenme döngüsüyle; dokunuş iptal etmez), alan menüsü (Dürbünle canlı
  ara, sonraki/önceki/Git, bulunanlar, İstasyona dön), ortam UZAK_ALANLAR[alan].ortam, adım zemini, VoiceOver satırı İstasyona dön.
  Sahne: UX 6000'de alan başına grup (tuz gölü kızıl su + flamingolar + yanardağ, dağ ormanı ağaçlar + bambu + yoğun sis, bataklık
  papirüsler), kamera nokta i'de z = -30i. Merkez 3 araştırma (tuzGolu, dagOrmani, papirusBatakligi: 5 nokta + 4 canlı). Sesler
  ortam_tuzla/dag/bataklik (ElevenLabs 30 sn loop, ortam-dongu.py). `oyun/yonetim.js` (saf; Y.guncelle 4 sn'de bir): IUCN tablosu (tür
  sayfasında), TEHDITLI 8 tür; k.yonetim {taban, raporlar, yil, temizlenen}; yıl dönünce yıllık koruma raporu (korunan tür başına itibar 3,
  800 lira). EYLEMLER: istilaci (lantana, eko.istilaci hücreleri yeni/eski kayıtta tohum 4242 %14 otlak/akasyalık; hücrede ot kapasitesi
  ×0,65; 1.500), yakma (kurak mevsim 1-5. gün, sıcak/yağmurlu değil; eko.kontrolluYakmaYil → o yıl yangın olasılığı ×0,3; 6 otlak hücresi
  yanık; 1.000), golet (eko.goletRestore → buharlaşma ×0,8; 4.000). Merkez > Ekolojik yönetim (eylemler, lantanalı alanlara rota, nüfus
  dengesi, raporlar); Yardım "Saha gezileri ve ekolojik yönetim". Testler: dayanıklılık 300/300 (gezi ve yönetim metinleri), bot,
  menu-tara 196 sayfa iki kipte sorun 0, uzak sahne görüntüleri (scratchpad uzak-goruntu.cjs). Telefonda doğrulanmadı.
- Aşama 13 avlanma, savunma, sosyal yaşam (13 Kasım, Murat "devam" dedi; kararlar 68, 102, 106, 107; sayılar ÖNERİ). mantik: AV_STRATEJI
  (aslan pusu+2 yardımcı 13 sn, leopar 8 sn tek, çita 8 sn hız ×1,15, yaban köpeği 3 yardımcı 32 sn, sırtlan 2 yardımcı 24 sn);
  g.av.yardimcilar avın önüne/yanına koşar ('kusatiyor', koşu sesi), yakalayan en yakın avcı; b.beceri (0-1, varsayılan 0,4; hız
  ×0,92+0,16·beceri; başarı +0,05, yardımcı +0,03, başarısız +0,02); g.avDeneyim {tür: [deneme, başarı]} av seçimini etkiler (×1,15-0,3·oran).
  GRUP_SAVUNMA (manda, fil, babun, zebra, gnu, zürafa; yavru/genç ya da manda/fil): 22 m'de ≥2 yetişkin → saniyede olasılık ×(1+
  g.savunmaDeneyim) kovalamayı keser, 'grupSavunmasi', olay 'grupSavunma' (3B tür sesi, keşif anı), avcı yaralanabilir. Yas (YAS_TURLERI
  fil/babun/zürafa, av dışı ölüm): grup leşe gider, 'yasTutuyor', olay 'yas'. veri DAVRANISLAR + kusatiyor, grupSavunmasi, yasTutuyor,
  siraKavgasi, uzlasma, avOgretiyor. `oyun/sosyal.js` (Sy.guncelle 2 sn'de bir): günlük beceri ve korku anneden yavruya, anne
  yavruBuyuttu (büyüyen yavru), deneyim/kişilik yavru kondisyonu (ilk anne -0,012, ≥2 yavru +0,012, sakin +0,005, ürkek -0,006);
  sıralama kavgası (babun, aslan, zebra, fil, impala) + uzlaşma (d.sonrakiler, kayda yazılmaz); çita/leopar/aslan annesi beslenirken av
  öğretir (yavru becerisi +0,04). bireySatirlari / turSatirlari (birey ve tür sayfası). Yardım "Avlanma, savunma ve sosyal yaşam".
  Testler: dayanıklılık 300/300, bot 8 gün, ekosistem 30 gün (nüfus dengede; impala 12→6 en çok avlanan), menu-tara 241 sayfa sorun 0.
- Aşama 14 özel bireyler, tuz yalağı, sağlık dosyası, göç takibi (13 Kasım, Murat "devam" dedi; kararlar 100, 101, 103, 112; sayılar
  ÖNERİ). veri: OZEL_BIREYLER 5 (benekliZebra, karaLeopar, beyazZurafa renkli; disliFil yaşlı erkek; ucBacakliAslan erkek; gerçek
  vakalardan); mantik ozelBireyleriAta (dunyaOlustur'da, k.ozelBireyler {id: bireyId}, bir kez; b.ozellik), gozlemTarifi görünüşü
  söyler, tanımlanınca olay 'ozelBirey' (kesif, itibar 10); sahne hayvanModeli b.ozellik rengini kullanır. TUZ_YALAGI (-32,58) r 7 + YER
  'tuzYalagi', MINERAL_TURLERI 7: g.mineral 2,5 günde dolar, >0,75 → plan 'gez' + g.yalak → varınca 'topragiYaliyor' (b.ozel), olay
  'yalak'; sahnede kızıl toprak dairesi. sosyal.js saglikDosyasi (beslenme, hastalık/teşhis, geçmişten yaralanma vb., kalıtsal, stres,
  bağışıklık) birey sayfasında; yonetim.js gocSatirlari (GOCMENLER durumu, son çıkış/dönüş, kayıp/yeni, GPS) Merkez > Ekolojik yönetim >
  Göç takibi. Yardım "Avlanma, savunma ve sosyal yaşam" +3 satır. Testler: dayanıklılık 300/300, bot 8 gün (5 özel birey tanındı, yalak
  2), menu-tara 302 sayfa iki kipte sorun 0. Telefonda doğrulanmadı.
- Aşama 15 rutinler, istasyon kamerası, av dengesi (13 Kasım, Murat "devam" dedi; kararlar 72, 78; sayılar ÖNERİ). Av seçiminde av
  değiştirme: türün bölgedeki sayısı < 8 ise puan ×1,7, > 14 ise ×0,85 (impala 30 günde 12→6 düşüyordu). mantik rutinKur (planSec
  başında, grup kimliğinden belirlenimli): g.rutin {su gölet/nehir, suSaat sabah/oglen/aksam (SU_SAATLERI), agac (habitattaki bir ağacın
  gölgesi)}; suNoktasi alıştığı su başını yeğler (1,7 kat uzağa kadar), su saatinde susuzluk eşiği 0,62 → 0,42, dinlenmede %70 alıştığı
  ağaç (110 m), sıcak günün 12-15,5 arasında otçullar o gölgeye çekilir. rutinMetni(d, g) birey sayfasında. su.js kameraDenetle:
  istasyonun 45 m çevresine giren kuş olmayan hayvan, grup başına 2 saatte bir kayıt (k.su.kamera son 20), gece istasyondayken tehlikeli
  hayvan → anında olay 'kamera'; sabah 7'de gecenin özeti mesaj; Merkez > Ekolojik yönetim > İstasyon güvenlik kamerası. Yardım +2 satır.
- Aşama 16 deneme kolaylığı (13 Kasım, Murat "devam" dedi): App YENILIKLER tablosu (en yeniler üstte, her satır "Nerede:") → ana menü
  'oyun' > Yenilikler; 'deneme' Deneme araçları: zamanı 1/6/24 saat ileri al (dinlenBaslat), bütçe +20.000, itibar 120 (saha gezileri
  açılır), bütün ekipman (adetliler stok +2); k.denemeKullanildi. Yeni özellik eklenince YENILIKLER'e satır ekle. Tarayıcıda uçtan uca:
  scratchpad deneme-arac.cjs (itibar → ekipman → Saha gezileri → Yola çık → yolculuk sonunda Kızıl Tuz Gölü'nde) hatasız.
- Aşama 17 küçük canlı sesleri (13 Kasım, Murat "ses üretimi" dedi): ElevenLabs (akış "Vahşi Yaşam sesleri", 2,5-4 sn,
  prompt_influence 0.6) 24 küçük canlı k_<id> (kucukler.js KUCUK_SESLI) → sesleri-isle.sh k_* 3B (en çok 3,6 sn, -17 LUFS) + ortam_galeri,
  ortam_kayalik (ortam-dongu.py). efekt.js sure(): k_ 0,05 (konuşmayı bekletmez). App: 9-23 sn'de bir bulunabilirler(bölge/oda/alan,
  evre, mevsim, yağmur) ∩ KUCUK_SESLI'den biri oyuncunun 14-44 m çevresinde rastgele yönde Efekt.yonlu (KUCUK_DUZEY 0,5), d.sonDuyulan
  (kesif kucukAra 60 sn içinde o canlının ağırlığı ×5), altyazı; bulununca (olay yeniKucuk/kucuk ek.kucuk) sesi önünden; ayar
  canliSesleri (Ses ve konuşma); ortamSec gündüz galeri → ortam_galeri, kayalık → ortam_kayalik. Tarayıcıda (scratchpad ses-dene.cjs)
  gece gölette kurbağalar, gündüz galeride kolobus/vervet + ortam_galeri çaldı. YENILIKLER ve Yardım satırı. Telefonda doğrulanmadı.
- Adım sesi düzeltmesi (13 Kasım, Murat "sürekli yürürken iki adım atıp duraksıyor, sonra üç adım" dedi): sebep efekt.cal'ın oyun
  konuşurken efekt çalmaması (efektKis); yürürken rehber 7 sn'de bir konuştuğu için adımlar düşüyordu (tarayıcıda 15 sn'de 31 adım,
  740/1100 ms boşluklar). Efekt.cal(ad, ses, arkaPlan) arkaPlan=true konuşmada da çalar, efektCalindi bildirmez; adimCal bunu kullanır,
  dört adım karışık torbadan (her oynatıcı ≥3 adım dinlenir), adimYol artanı bir sonrakine aktarır (ADIM_ARALIK 1,5 m), ADIM_DUZEY ot/yaprak
  artırıldı. araclar/adim-esitle.py en yüksek 80 ms pencereyi eşitler (+1-3 dB). Sonra: 15 sn'de 42 adım, aralıklar 340-380 ms
  (scratchpad adim-dene.cjs). Telefonda doğrulanmadı.
- Ses efektleri genişlemesi (13 Kasım, Murat "başka ne ses efektleri ekleyebiliriz" → "hepsini yap"): ElevenLabs (akış "Vahşi Yaşam
  sesleri") 41 ses. h_* hayvan gündelik sesleri 3B (sesleri-isle.sh h_* en çok 4 sn, -16 LUFS): h_suIcme, h_otlama, h_yavru_fil/zebra/
  aslan, h_sirtlan_les, h_suaygiri_su, h_fil_hortum (App gundelikSesSec: saniyede bir en yakın uygun grup, grup başına 9-20 sn), h_alarm_
  impala (impala, ceylan) / h_alarm_zebra (zebra, gnu) mantik grupAlarm'da, h_bogusma hayvanOldu avcılıysa, h_timsah_dalis kıyıdan kaçan
  timsah. M.efekt(d, ad, duzey, konum, duyma) → d.efektKuyruk (en çok 20; dinlenmede yok) → App her karede (menü açıkken de) çalar, aynı ses
  2,5 sn'de bir; konumluysa yonlu. Eylem sesleri: durbun_odak (olay gozlem), deklansor (foto), kayit_bas/bit (sesKayit basladi), video_kamera
  (videoBasladi; ElevenLabs'inki hışırtıydı, numpy ile bip + lens motoru), numune_sise (numuneEkle), fener_tik (kucukAra), tuzak_kur, tasma,
  tel_sok (tuzakSok, tuzaktanKurtar), dron_kalkis/inis (olay dron/dronIndi), telsiz (olay insan), fermuar (kamp kurulunca, kampta dinlenince),
  bildirim_mesaj/gorev (mesaj, gorevBitti). Menü: SesliListe menu_odak/menu_sec/menu_geri (geri satırı ve iki parmak çift dokunuş)/menu_sinir
  (-24 LUFS). Doğa: ortam_safak/ortam_aksam (ortamSec evre), yagmur_baslangic (yağmur başlayınca), gok_uzak (bulutlu/yağmurlu, 60-120 sn),
  yangin_citirti 3B (UC_B; yangının yönünden 2,5-4 sn'de bir, 90 m). efekt.js dongu(ad, oran)/donguleriDurdur: konumlu döngüler
  (KONUMLU_DONGULER su_akis geçitlerde 45 m, jenerator istasyon 50 m, kamp_ates akşam/gece 25 m, selale dağ ormanı şelale noktası;
  ortam-dongu.py ile), menüde ve dinlenmede durur. Tarayıcıda (jest-dene SESLER satırı, scratchpad ses2/ses3-dene.cjs) menü, deklanşör,
  dürbün, fener, numune, h_suIcme, h_yavru_fil, jeneratör, su_akis, kamp ateşi, ortam_safak/aksam, yağmur başlangıcı, yangın çıtırtısı
  çaldı. Bot 4 günde: zebra alarmı 351, impala 129, boğuşma 8 (App 2,5 sn sınırı). Telefonda doğrulanmadı.
- Katmanlı ortam (13 Kasım, Murat "nehrin sesi uzaktan duyuluyor mu, ambiyanslar yaklaştıkça karışsın" dedi): efekt.js tek ortam kanalı
  yerine ortamKatmanlar({ad: 0-1}) (katman başına oynatıcı, 100 ms'de 0,05 adımla geçiş, 15 sn susan bırakılır; yönlü çiftler <ad>_sol/_sag
  birlikte başlatılır ve birlikte bırakılır; ortamBaslat(ad) = tek katman, mağara/uzak alan; globalThis.__ortamDurumu tanı). App
  ortamHedefleri(d) 0,25 sn'de bir: su (enYakinSu: nehir eğrisi ±70 m tarama ya da gölet suyu; 60 m'den, ^1,6; güney yakada en az 0,35;
  teknede 1), galeri (gündüz/şafak, şerit kenarından 40 m) ve kayalık (40 m) yönlü (yonluKatman eşit güçlü pan, |p| ≤ 0,85; içindeyken
  yönsüz), yangın 100 m'den; temel (evre ya da yağmur) 1-0,75·baskın, en az 0,2; yağmurda diğerleri ×0,55; güç toplamı 1'i geçerse ölçeklenir.
  araclar/ortam-yon.py ortam_nehir/galeri/kayalik → _sol/_sag (karşı kanal %30). Tarayıcı: scratchpad ortam-dene.cjs (doğuya bakarken güneydeki
  nehir sağda). Telefonda doğrulanmadı.
- Zemine göre koşu sesleri (13 Kasım, Murat "ormanda koşuyorlar ama adım sesleri metal yüzeyden geliyor gibi" dedi): eski kosu_<tür> silindi;
  kosu_<toynak|hafif|agir|pati>_<ot|toprak|su> (M.kosuSesiAdi(d, b): zeminTuru(d, nokta) → KOSU_ZEMIN ot/yaprak→ot, toprak/kaya→toprak,
  su/çamur→su). ElevenLabs toprak ve su kayıtları iyi; ot kayıtları neredeyse yalnız hışırtıydı (-35..-45 LUFS) → ot = toprak kaydı alçak
  geçiren (1100 Hz, ağırda 800) + ot kaydının tizi %30 (scipy, /tmp'de). sesleri-isle.sh kosu_*: 3B 2,2 sn, arka sürümde aecho yok (35 ms yankı
  metalik çınlatıyordu; başka sesler hâlâ yankılı). Telefonda doğrulanmadı.
- Durmayan su sesi (13 Kasım, Murat "nehir tarafında sürekli döngü halinde bir ses var, hiç durmuyor, döngü güzel yapılmamış" dedi):
  (1) asıl sebep: b.kosu (ve b.ozel, uyardi, sakin, tehdit, g.meydan kavga) oturum saatine (d.zaman, her açılışta 0) göre yazılıp kayıtta
  kalıyordu; yeniden açılınca eski b.kosu yeni d.zaman'dan çok büyük → hayvan saatlerce kosanlar'da (gölet kıyısındaki filler çamurda koşu
  sesi). mantik oturumZamanlariniSifirla(k) dunyaOlustur'da siler (tanı: /tmp/claude-0/kosu-neden.js). (2) su_akis (8,5 sn) kaldırıldı.
  (3) ortam-dongu.py: crossfade n ve döngü uzunluğu 1024'ün katı (AAC sona 10-20 ms sessizlik ekliyordu); bütün döngüler yeniden üretildi
  (ortam_*, motor, jenerator, kamp_ates, selale; yangın -24), _sol/_sag yeniden. (4) gündelik sesler: grup 20-40 sn, aynı ses 15 sn, herhangi
  biri 5 sn; su içme 20 m ve %50. Telefonda doğrulanmadı (expo-audio döngüsünün kendisi de dönerken kısa boşluk bırakabilir).
- Motor ve dron (13 Kasım, Murat "araç sesi güzel luplansın; dron uzaklaşırken/yaklaşırken giderek" dedi; ElevenLabs bağlayıcısı o an
  koptu, mevcut ham seslerle yapıldı): eski motor döngüsü ham kaydın 3-4,6 sn'deki hızlanma tepesini içeriyordu (her turda "vrum").
  araclar/dongu-kes.py <ad> <bas> <bit> <cikti> [hedef sn] [LUFS]: kaydın sabit bölümünden, sonu başla en ilintili noktadan (1024 katı)
  seçilir; ilinti ≥0,5 doğrusal, değilse eşit güçlü 0,12 sn geçiş; gövde ~hedef sn'ye kadar art arda (oynatıcı başa seyrek dönsün).
  motor = motor 0,85-2,85 sn (gövde 1,39 sn, ilinti 0,94, 15,3 sn). Dron: dron_dongu (dron 0,2-2,1, 11,9 sn, -20) + ortam-yon.py _sol/_sag;
  efekt.js yonluDongu(ad, oran, pan, hiz) iki yarı birlikte, düzey/pan/setPlaybackRate (0,85-1,15); App her karede: m = hypot(yatay, 10 m
  yükseklik), oran 0,85·min(1,(12/m)^1,1), kalkış 1,5 sn'de açılır, Doppler 1 - vr/340·1,6; menü/dinlenmede durur. Eski 3B 'dron' parçaları
  silindi (UC_B'den çıktı). Tarayıcı: scratchpad dron-dene.cjs (11 m 0,2 → 110 m 0,07, dönüşte 0,39; hız 0,9/1,1). Telefonda doğrulanmadı.
- Adım sesleri denetimi (13 Kasım, Murat "karakter adım seslerini de kontrol et" dedi): eski adim_*_n.mp3'lerde vuruş geç (camur, su,
  kaya, yaprak 140-320 ms), sonu sert kesik (su/camur son 10 ms -30..-50 dB), kesik kısa parçalar (kaya_3 0,11 sn, magara_3 0,12), ot/yaprak
  yalnız tiz hışırtı (merkez 7-8 kHz). araclar/adim-yap.py <ham> (ham adim_<zemin>.mp3 ses-dal'da): vuruş başlangıcı (tepeye 10 dB) 5. ms'ye,
  3 ms giriş, 40 ms karesel çıkış, en çok 0,45 sn (mağara 0,7), kısa (<%55 ortanca) ve çift vuruşlu adımlar elenir/iki vuruş arasından
  kesilir, ot ve yaprağa toprak adımının 260 Hz alçak geçiren gövdesi (×0,7 / ×0,55), hepsi 80 ms tepe -14 dB; çıktı WAV (mp3/AAC
  dolgu gecikmesi yok; yap.sh .wav yükleyicisi eklendi; sözdizimi denetimine -e '*.wav'). ADIM_DUZEY 0,26-0,3. adim-bol.py/adim-esitle.py
  eskidi. Tarayıcı adim-dene.cjs: 15 sn'de 42 adım, 340-361 ms. Telefonda doğrulanmadı.
- Orman adımı (13 Kasım akşam, Murat "orman adım ses efektini kontrol et" dedi): yaprak adımları >6 kHz baskın, kuyruk 0,3-0,4 sn -25 dB
  (adım aralığı 0,36 sn → sürekli hışırtı). ElevenLabs'ten 3 yeni "orman tabanı adım" denemesi (adim_yaprak_a/b/c, ses-dal ham) daha da tiz
  çıktı, kullanılmadı. adim-yap.py yaprak: 6,5 kHz alçak geçiren, 1-4 kHz bant +, vuruştan 30 ms sonra 90 ms üstel sönüm, en çok 0,3 sn, toprak
  gövdesi ×0,85 → kuyruk 100-150 ms'de -34 dB, >6 kHz -12..-17 dB. Ot adımlarında benzer uzun kuyruk var (dokunulmadı). Telefonda doğrulanmadı.
- Kesik adım (13 Kasım akşam, Murat ekran görüntüsüyle, açık otlak gece: "üç dört adım, 1/2 sn boşluk, yine üç dört adım"; tarayıcıda
  adımlar düzenli): olası sebep iOS'ta expo-audio seekTo'nun eşzamansız olması; sona varmış oynatıcıda seekTo(0) bitmeden play() → sessiz.
  efekt.js basaSarVeCal(p): çalıyorsa pause, seekTo(0).then(play) (en geç 120 ms'de play), bitişten 150 ms sonra önceden seekTo(0)
  (geriSarZaman Map). Bütün cal/yonlu bundan geçer. Telefonda doğrulanmadı; düzelmezse sebep hareketin kendisi (kare takılması/yurudu) olabilir.
- Tasarım brifinin 7 aşaması bitti. Sıradaki: Murat'ın Expo Go denemelerinden gelen geri bildirim; denge sayılarının onayı.

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
