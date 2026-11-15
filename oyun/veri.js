// ==== VAHŞİ YAŞAM: OYUN VERİSİ ====
// Afrika savanı test bölgesi, türler, davranışlar. Koordinat: x doğu, y kuzey (metre). Haritanın ortasında araştırma istasyonu.
// Tasarım brifi: 113 karar (Vahşi Yaşam Oyun Tasarım Dosyası). Bu sürüm Aşama 1-3: teknik temel, saha prototipi,
// ilk hayvan ve gözlem döngüsü.

export const YARICAP = 320; // haritanın yarıçapı (15 Kasım 2026: 200'den büyütüldü; dış halkada yeni bölgeler)
export const ISTASYON = { x: 0, y: 0, r: 12 }; // hayvanlar istasyona girmez (kuşlar hariç)
export const ARAC_YERI = { x: 5, y: -5, yon: Math.PI / 2 }; // garajın önü

// Zaman: oyun açıkken akar, kapalıyken durur (karar 10, 44). Gerçek 1 saniye = oyunda 30 saniye; bir gün 48 dakika sürer.
// (Öneri; Murat onaylamadı.)
export const OYUN_DK_SN = 0.5;
export const BASLANGIC_SAATI = 6 * 60 + 30; // 1. gün 06:30

// Su ve arazi (değiştirilemez, karar 56)
export const GOLET = { x: 48, y: 38, r: 9 };
export const NEHIR_YARI = 4; // nehrin yarı genişliği
export const nehirY = (x) => -100 + 8 * Math.sin(x / 35);
export const GECITLER = [
  { ad: 'Batı geçidi', x: -60, yari: 6 },
  { ad: 'Doğu geçidi', x: 70, yari: 6 },
];
export const KAYALIK = { x: -115, y: 45, r: 32 };
// Kuzey Kutbu haritası (Kuzeydoğu Grönland kıyısı): savandan çok uzakta, kendi coğrafyası ve mevsimi olan ikinci ana harita (kutup.js)
export const KUTUP = { x: 0, y: 6000, r: 230 };
// Antarktika haritası (Adélie Kıyısı): savanın çok güneyinde, Kuzey Kutbu ile aynı kurallarla işleyen ama mevsimleri ters üçüncü ana harita (kutup.js GUNEY)
export const ANTARKTIKA = { x: 0, y: -6000, r: 230 };
// Avustralya çalılığı (Queensland iç kesimi): savanın çok doğusunda, kendi mevsimi ve havası olan dördüncü ana harita (kutup.js AVUS)
export const AVUSTRALYA = { x: 6000, y: 0, r: 230 };
// Hindistan ormanı (Kanha, Orta Hindistan): savanın çok batısında, sal ormanı, çayır ve göl; beşinci ana harita (kutup.js HIND)
export const HINDISTAN = { x: -6000, y: 0, r: 230 };
// Moğol bozkırı (Hustai, Orta Moğolistan): savanın çok kuzeybatısında, uçsuz bucaksız bozkır, kayalık dağ, pınar ve kum tepeleri; altıncı ana harita (kutup.js MOGOL)
export const MOGOLISTAN = { x: -6000, y: 6000, r: 230 };
export const MAGARA = { x: -128, y: 64 };

// ---------- Dış halkanın bölgeleri (15 Kasım 2026, harita genişlemesi) ----------
// Granit tepeler (kopje): kuzeybatıda iri kaya yığınları; tepedeki Gözcü Kayası'ndan dürbün daha uzağı görür
export const TEPELER = { x: -195, y: 175, r: 50 };
export const GOZCU_KAYASI = { x: -195, y: 175, r: 9 };
// Sık çalılık (Commiphora ve dikenli çalılar): kuzeydoğuda görüşün kısaldığı, gergedanların gizlendiği yer
export const CALILIK = { x: 200, y: 185, r: 58 };
// Baobab düzlüğü: doğuda, kum derenin batısında dev baobabların seyrek durduğu kurak düzlük
export const BAOBAB = { x: 205, y: 10, r: 42 };
// Kum dere (lugga): doğuda kuzeyden nehre inen kuru dere yatağı. Yağışlı mevsimde akar, kurakta filler kumu kazıp su bulur.
export const DERE_YARI = 5; // dere yatağının yarı genişliği
export const dereX = (y) => 265 + 18 * Math.sin(y / 45);
export const DERE_UST = 182; // derenin kuzey ucu (haritanın sınırına yakın)
export const dereYatagindaMi = (x, y) => y > nehirY(x) + 6 && y < DERE_UST && Math.abs(x - dereX(y)) < DERE_YARI;
// Güney ovası: nehrin güneyinde, sulak alanın ötesinde kısa otlu geniş düzlük
export const OVA = { x: 130, y: -240, r: 80 };
export const OVA_SINIR = 85; // nehirden bu kadar güneyden sonrası ova
// Kuzey otlakları: akasya ağaçlığının ötesindeki uzun otlu düzlük
export const AGACLIK_UST = 232;
// Dış bölgelerde yaşayan ikinci gruplar: aynı türün başka bir yaşam alanındaki sürüsü (g.hab)
export const EK_HABITAT = {
  tepeBabun: { tur: 'babun', habitat: { x: -200, y: 168, r: 42 }, grup: [8, 10], ad: 'tepelerin babun sürüsü' },
  tepeLeopar: { tur: 'leopar', habitat: { x: -188, y: 182, r: 40 }, grup: [1, 1], erkekOran: 1, ad: 'tepelerin leoparı' },
  caliGergedan: { tur: 'gergedan', habitat: { x: 205, y: 180, r: 45 }, grup: [2, 2], erkekOran: 0, ad: 'çalılığın gergedanları' },
  dereFil: { tur: 'fil', habitat: { x: 240, y: 35, r: 65, dere: true }, grup: [3, 4], erkekOran: 1, ad: 'bekâr erkek fil sürüsü' },
  baobabZurafa: { tur: 'zurafa', habitat: { x: 200, y: 12, r: 40 }, grup: [3, 5], erkekOran: 0.3, ad: 'baobab düzlüğünün zürafaları' },
  ovaZebra: { tur: 'zebra', habitat: { x: 120, y: -235, r: 60, guneyde: true }, grup: [6, 8], erkekOran: 0.2, yerli: true, ad: 'güney ovasının zebraları' },
  ovaCeylan: { tur: 'ceylan', habitat: { x: 165, y: -250, r: 55, guneyde: true }, grup: [8, 10], erkekOran: 0.25, yerli: true, ad: 'güney ovasının ceylanları' },
  ovaCita: { tur: 'cita', habitat: { x: 140, y: -245, r: 65, guneyde: true }, grup: [2, 2], erkekOran: 1, ad: 'güney ovasının çita kardeşleri' },
};
// Gidilebilecek yerler (Yerler paneli). y değeri işlev olabilir (nehir boyu).
export const YERLER = [
  { id: 'istasyon', ad: 'Araştırma istasyonu', x: 0, y: 2, tarif: 'Küçük laboratuvar, garaj ve çadırdan oluşan istasyonun.' },
  { id: 'golet', ad: 'Gölet', x: GOLET.x - 13, y: GOLET.y - 8, tarif: 'Otlakların ortasında bir gölet. Pek çok hayvan su içmeye gelir.' },
  { id: 'batiGecit', ad: 'Nehrin batı geçidi', x: -60, y: nehirY(-60) + 9, tarif: 'Nehrin sığ yeri. Araçla ya da yaya karşıya geçilebilir.' },
  { id: 'doguGecit', ad: 'Nehrin doğu geçidi', x: 70, y: nehirY(70) + 9, tarif: 'Nehrin ikinci sığ geçidi.' },
  { id: 'nehirKiyisi', ad: 'Nehir kıyısı', x: 12, y: nehirY(12) + 24, tarif: 'Su aygırlarının ve timsahların yaşadığı geniş nehrin kuzey kıyısı.' },
  { id: 'sulakAlan', ad: 'Sulak alan', x: -20, y: -135, tarif: 'Nehrin güneyinde sazlık ve çamurlu bir sulak alan. Mandalar burada otlar.' },
  { id: 'kayalik', ad: 'Kayalık', x: -88, y: 40, tarif: 'Büyük granit kayalardan oluşan bir tepe. Leopar ve piton burada yaşar.' },
  { id: 'magara', ad: 'Mağara girişi', x: -116, y: 74, tarif: 'Kayalığın kuzeyinde karanlık bir mağara ağzı. İçi henüz araştırılmadı.' },
  { id: 'agaclik', ad: 'Akasya ağaçlığı', x: 30, y: 100, tarif: 'Kuzeyde sık akasya ağaçları. Filler ve zürafalar burada beslenir.' },
  { id: 'dogOtlak', ad: 'Doğu otlakları', x: 95, y: 0, tarif: 'Uçsuz bucaksız açık çayırlar. Zebralar burada otlar.' },
  { id: 'galeri', ad: 'Galeri ormanı', x: 140, y: -82, tarif: 'Nehrin doğu kıyısı boyunca uzanan sık, gölgeli bir orman şeridi. Babunlar, maymunlar ve orman kuşları burada yaşar.' },
  { id: 'iskele', ad: 'İskele', x: 22, y: nehirY(22) + 7, tarif: 'Nehrin kuzey kıyısında küçük ahşap bir iskele. Araştırma teknesi burada bağlanır.' },
  { id: 'termitler', ad: 'Termit tepeleri', x: -140, y: -40, tarif: 'Batı otlaklarında boyu insanı aşan termit tepeleri. Eski tepelerde firavunfareleri ve yerdomuzu yuvaları var.' },
  { id: 'tepeler', ad: 'Granit tepeler', x: -168, y: 160, tarif: 'Kuzeybatıda ovadan yükselen dev granit kaya yığınları. Babunlar kayaların tepesinde uyur, bir leopar kovuklarda saklanır.' },
  { id: 'gozcuKayasi', ad: 'Gözcü Kayası', x: GOZCU_KAYASI.x + 4, y: GOZCU_KAYASI.y - 4, tarif: 'Granit tepelerin en yüksek kayası. Üstünden dürbünle ovanın çok uzağı görülür.' },
  { id: 'calilik', ad: 'Sık çalılık', x: 168, y: 160, tarif: 'Kuzeydoğuda dikenli çalıların ve kısa ağaçların sık büyüdüğü bir çalılık. İçinde görüş kısalır; gergedanlar burada saklanır. Burada kulağına güven.' },
  { id: 'dere', ad: 'Kum dere yatağı', x: dereX(40) - 8, y: 40, tarif: 'Doğuda kuzeyden nehre inen kumlu bir dere yatağı. Yağışlı mevsimde akar, kurakta kurur; o zaman filler kumu kazıp altındaki suya ulaşır.' },
  { id: 'baobab', ad: 'Baobab düzlüğü', x: 178, y: 10, tarif: 'Doğuda, kum derenin batısında dev gövdeli baobabların seyrek durduğu kurak bir düzlük. Zürafalar burada beslenir; bekâr erkek filler baobab kabuğunu soyup sulu iç dokusunu çiğner.' },
  { id: 'ova', ad: 'Güney ovası', x: 120, y: -215, tarif: 'Nehrin güneyinde, sulak alanın ötesinde ufka kadar uzanan kısa otlu bir ova. Zebralar, ceylanlar ve iki çita burada yaşar; göç eden sürüler buradan geçer.' },
  { id: 'kuzeyOtlak', ad: 'Kuzey otlakları', x: 20, y: 255, tarif: 'Akasya ağaçlığının ötesinde, haritanın kuzey ucunda uzun otlu açık bir düzlük.' },
  { id: 'tuzYalagi', ad: 'Tuz yalağı', x: -32, y: 58, tarif: 'Toprağı tuz ve mineral bakımından zengin, çiğnenmiş, çukurlaşmış bir açıklık. Filler, mandalar ve zürafalar buraya toprağı yalamaya gelir.' },
];
// Aşama 14 (karar 103): otçulların mineral ihtiyacını karşıladığı tuz yalağı
export const TUZ_YALAGI = { x: -32, y: 58, r: 7 };
export const MINERAL_TURLERI = ['fil', 'manda', 'zurafa', 'zebra', 'gnu', 'impala', 'gergedan'];
// Aşama 14 (karar 100): nadir özel bireyler; gerçek vakalardan esinlenildi
export const OZEL_BIREYLER = {
  benekliZebra: { tur: 'zebra', ad: 'benekli zebra', renk: '#2a2420', gorunus: 'çizgileri yerine koyu zemin üzerinde beyaz benekler taşıyor', tarif: 'Çizgileri yerine koyu zemin üzerinde beyaz benekler taşıyan çok nadir bir zebra. Pigment hücreleri normal, ama melanin dağılımı bozuk; buna psödomelanizm denir. 2019\'da Masai Mara\'da böyle bir tay fotoğraflanınca dünya bu desenle ilk kez tanıştı.' },
  karaLeopar: { tur: 'leopar', ad: 'kara leopar', renk: '#151313', gorunus: 'kapkara; benekleri ancak ışıkta, siyahın içinde seçiliyor', tarif: 'Melanizm nedeniyle kapkara bir leopar; yakından bakınca benekleri siyahın içinde görünür. Afrika\'da son derece nadirdir; 2019\'da Kenya\'da bir asırdır ilk kez fotoğraflandı.' },
  beyazZurafa: { tur: 'zurafa', ad: 'beyaz zürafa', renk: '#ece6da', gorunus: 'bembeyaz; yalnızca gözleri koyu', tarif: 'Lösizm nedeniyle bembeyaz bir zürafa. Gözleri koyu kaldığı için albino değildir. Kenya\'da bilinen birkaç beyaz zürafanın çoğu kaçak avcılarca öldürüldü; bu birey korunmalı.' },
  disliFil: { tur: 'fil', cinsiyet: 'erkek', evre: 'yasli', ad: 'büyük dişli fil', gorunus: 'dişleri neredeyse yere değiyor', tarif: 'Dişleri neredeyse yere değen yaşlı bir erkek fil. Böyle büyük dişliler bir zamanlar yaygındı; fildişi avcılığı yüzünden bugün Afrika\'da yalnızca birkaç düzine kaldı.' },
  ucBacakliAslan: { tur: 'aslan', cinsiyet: 'erkek', ad: 'üç bacaklı aslan', gorunus: 'sol ön bacağı yok, aksayarak yürüyor', tarif: 'Yıllar önce bir tel tuzakta sol ön bacağını kaybetmiş erkek aslan. Üç bacağıyla yaşamayı ve grubuyla birlikte avlanmayı öğrenmiş; kaçak avcılığın canlı bir tanığı.' },
};
export const GALERI = { x0: 100, x1: 190, derinlik: 36 }; // nehrin kuzey kıyısında orman şeridi
export const TERMITLER = { x: -140, y: -40, r: 30 };

// Bölgeler: bolgeBul (mantik.js) konuma göre adını verir.
export const BOLGE_ADLARI = {
  istasyon: 'Araştırma istasyonu',
  golet: 'Gölet kıyısı',
  nehir: 'Nehir kıyısı',
  sulak: 'Sulak alan',
  kayalik: 'Kayalık',
  agaclik: 'Akasya ağaçlığı',
  otlak: 'Açık otlak',
  galeri: 'Galeri ormanı',
  termit: 'Termit tepeleri',
  magara: 'Mağara',
  tepeler: 'Granit tepeler',
  calilik: 'Sık çalılık',
  baobab: 'Baobab düzlüğü',
  dere: 'Kum dere yatağı',
  ova: 'Güney ovası',
  kuzeyOtlak: 'Kuzey otlakları',
  // Kuzey Kutbu
  kutupIstasyon: 'Araştırma kulübesi',
  tundra: 'Tundra',
  kiyi: 'Kıyı',
  buz: 'Deniz buzu',
  acikSu: 'Açık su',
  buzul: 'Buzul',
  kusYari: 'Kuş yarları',
  polinya: 'Polinya',
  // Antarktika
  hnUs: 'Orman dinlenme evi',
  maidan: 'Çayır (maidan)',
  salOrmani: 'Sal ormanı',
  bambuluk: 'Bambu ormanı',
  talab: 'Göl kıyısı',
  dadar: 'Kayalık yayla (dadar)',
  hnDere: 'Dere yatağı',
  // Moğol bozkırı
  mgUs: 'Ger kampı',
  bozkir: 'Açık bozkır',
  mgDag: 'Kayalık dağ',
  pinar: 'Pınar ve sazlık',
  kumul: 'Kum tepeleri',
  mgDere: 'Kuru dere yatağı',
  husOrman: 'Huş ormanı',
  avUs: 'Saha istasyonu',
  billabong: 'Billabong',
  kuruDere: 'Kuru dere yatağı',
  okaliptus: 'Okaliptüs ormanı',
  kumtasi: 'Kızıl kumtaşı kayalık',
  spinifex: 'Spinifex çalılığı',
  avTermit: 'Termit tepeleri',
  avOtlak: 'Açık otlak',
  // Antarktika
  antUs: 'Araştırma üssü',
  buzOrtusu: 'Kıta buz örtüsü',
  kayaBurnu: 'Kayalık burun',
  antKiyi: 'Kıyı',
  antBuz: 'Deniz buzu',
  antSu: 'Açık deniz',
  sahanlik: 'Buz sahanlığı',
  antPolinya: 'Polinya',
};

// Davranışlar: fiil (konuşmada "Zebra 4 otluyor"), ad (arşivde), nadir (bilimsel değeri yüksek)
export const DAVRANISLAR = {
  otluyor: { fiil: 'otluyor', ad: 'Otlama' },
  yapraklaBesleniyor: { fiil: 'ağaç yapraklarıyla besleniyor', ad: 'Yaprakla beslenme' },
  dinleniyor: { fiil: 'dinleniyor', ad: 'Dinlenme' },
  uyuyor: { fiil: 'uyuyor', ad: 'Uyku' },
  suIciyor: { fiil: 'su içiyor', ad: 'Su içme' },
  yuruyor: { fiil: 'yürüyor', ad: 'Yer değiştirme' },
  kaciyor: { fiil: 'kaçıyor', ad: 'Kaçış' },
  uyariyor: { fiil: 'tehdit gösterisi yapıyor', ad: 'Tehdit gösterisi', nadir: true },
  pusuda: { fiil: 'pusuya yatmış, avını izliyor', ad: 'Pusuya yatma', nadir: true },
  kovaliyor: { fiil: 'avını kovalıyor', ad: 'Av kovalamacası', nadir: true },
  besleniyor: { fiil: 'avıyla besleniyor', ad: 'Avla beslenme', nadir: true },
  lesteBesleniyor: { fiil: 'leşle besleniyor', ad: 'Leşle beslenme', nadir: true },
  emziriyor: { fiil: 'yavrusunu emziriyor', ad: 'Yavru emzirme', nadir: true },
  oynuyor: { fiil: 'oyun oynuyor', ad: 'Yavruların oyunu', nadir: true },
  timarlaniyor: { fiil: 'sürü arkadaşını tımarlıyor', ad: 'Sosyal tımar' },
  camurBanyosu: { fiil: 'çamur banyosu yapıyor', ad: 'Çamur banyosu' },
  suda: { fiil: 'suyun içinde dinleniyor', ad: 'Suda dinlenme' },
  gunesleniyor: { fiil: 'kıyıda güneşleniyor', ad: 'Güneşlenme' },
  tunemis: { fiil: 'bir ağaca tünemiş', ad: 'Tüneme' },
  suzuluyor: { fiil: 'havada süzülüyor', ad: 'Süzülme' },
  balikAvliyor: { fiil: 'balık avlıyor', ad: 'Balık avı', nadir: true },
  dogum: { fiil: 'yeni doğmuş yavrusuyla', ad: 'Doğum', nadir: true },
  bekliyor: { fiil: 'hareketsiz bekliyor', ad: 'Hareketsiz bekleme' },
  kolluyor: { fiil: 'çevreyi kolluyor', ad: 'Çevreyi gözetleme' },
  yiyecekAriyor: { fiil: 'yerde yiyecek arıyor', ad: 'Yiyecek arama' },
  tuzaktaKaldi: { fiil: 'bir tel tuzağa takılmış, çırpınıyor', ad: 'Tel tuzağa takılma', nadir: true },
  gocEdiyor: { fiil: 'sürüsüyle göç ediyor', ad: 'Mevsimsel göç', nadir: true },
  nehirGeciyor: { fiil: 'göç sırasında nehri geçiyor', ad: 'Göçte nehir geçişi', nadir: true },
  meydanOkuyor: { fiil: 'grubun liderine meydan okuyor', ad: 'Liderlik mücadelesi', nadir: true },
  bolgeKoruyor: { fiil: 'bölgesinden rakip yırtıcıları kovalıyor', ad: 'Bölge savunması', nadir: true },
  kumKaziyor: { fiil: 'kuru dere yatağında ön ayakları ve hortumuyla kumu kazıyor, altındaki suya ulaşmaya çalışıyor', ad: 'Kumda su kuyusu kazma', nadir: true },
  kuyudanIciyor: { fiil: 'filin kazdığı kum kuyusundan su içiyor', ad: 'Kum kuyusundan su içme', nadir: true },
  kabukSoyuyor: { fiil: 'bir baobabın kabuğunu dişleriyle soyup lifli, sulu iç dokusunu çiğniyor', ad: 'Baobab kabuğu soyma', nadir: true },
  topragiYaliyor: { fiil: 'tuz yalağında mineralli toprağı yalıyor', ad: 'Mineral yalama', nadir: true },
  // Aşama 13: avlanma, savunma ve sosyal yaşam (karar 68, 102, 106, 107)
  kusatiyor: { fiil: 'avın önünü keserek kuşatıyor', ad: 'Sürü hâlinde kuşatma', nadir: true },
  grupSavunmasi: { fiil: 'sürünün diğer yetişkinleriyle birlikte saldırgana karşı saf tutuyor', ad: 'Grup savunması', nadir: true },
  yasTutuyor: { fiil: 'ölen grup üyesinin başında bekliyor', ad: 'Yas davranışı', nadir: true },
  siraKavgasi: { fiil: 'grup içinde sıralama için kavga ediyor', ad: 'Sıralama kavgası' },
  uzlasma: { fiil: 'kavgadan sonra rakibini tımar ederek barışıyor', ad: 'Uzlaşma', nadir: true },
  avOgretiyor: { fiil: 'yavrularına avlanmayı öğretiyor', ad: 'Av öğretme', nadir: true },
  // Aşama 18: su başında tedirginlik (karar 104) ve iletişim (karar 108)
  suBasindaTedirgin: { fiil: 'su başında içmeden, tedirgin bekliyor', ad: 'Su başında tedirginlik' },
  tedirginIciyor: { fiil: 'başını sık sık kaldırarak, hızlı hızlı su içiyor', ad: 'Tedirgin su içme' },
  kokuIsaretleme: { fiil: 'bölgesini kokusuyla işaretliyor', ad: 'Koku işaretleme' },
  selamlasma: { fiil: 'sürü arkadaşlarıyla selamlaşıyor', ad: 'Selamlaşma' },
  kukremeKorosu: { fiil: 'sürüsüyle birlikte kükrüyor', ad: 'Kükreme korosu', nadir: true },
  infrasesDinleme: { fiil: 'kulaklarını açmış, kıpırdamadan uzaktaki sürüleri dinliyor', ad: 'Uzak çağrıyı dinleme', nadir: true },
  teselliEdiyor: { fiil: 'stresli bir grup arkadaşını teselli ediyor', ad: 'Teselli etme', nadir: true },
  teselliEdiliyor: { fiil: 'grup arkadaşının yanında sakinleşiyor', ad: 'Teselli görme' },
  arkadasCagiriyor: { fiil: 'sürüsünden ayrı düşmüş, uzun uzun çağırıyor', ad: 'Sürüyü çağırma' },
  dislaniyor: { fiil: 'sürünün kenarında tek başına; öbürleri onu aralarına almıyor', ad: 'Dışlanma', nadir: true },
  sifaliBitkiYiyor: { fiil: 'çöl hurmasının acı meyvesini ve yaprağını yiyor; parazitli babunlar bunu ilaç gibi kullanıyor olabilir', ad: 'Şifalı bitki yeme', nadir: true },
  kilYiyor: { fiil: 'hortumuyla yer kazıp kil yiyor; kil bağırsaktaki zehirleri ve parazitleri bağlayabilir', ad: 'Kil yeme', nadir: true },
  nobetTutuyor: { fiil: 'nöbet tutuyor; sürü dinlenirken başı dik, çevreyi kolluyor', ad: 'Nöbet tutma' },
  kurYapiyor: { fiil: 'kur yapıyor', ad: 'Kur ve eşleşme', nadir: true },
  yavruyuCagiriyor: { fiil: 'yavrusunu çağırıyor', ad: 'Yavruyu çağırma' },
  // Kuzey Kutbu davranışları
  buzdaDinleniyor: { fiil: 'buzun üstünde, nefes deliğinin yanında güneşleniyor', ad: 'Buzda dinlenme' },
  dalisYapiyor: { fiil: 'suya dalıp çıkıyor, besleniyor', ad: 'Dalış ve beslenme' },
  nefesDeligiPusu: { fiil: 'bir fok nefes deliğinin başında kıpırdamadan bekliyor', ad: 'Nefes deliği pususu', nadir: true },
  yigilmis: { fiil: 'kıyıda sürüyle sırt sırta yatmış', ad: 'Kıyıda yığılma' },
  dipteBesleniyor: { fiil: 'dibe dalıp bıyıklarıyla midye arıyor', ad: 'Dipte beslenme' },
  yuzuyor: { fiil: 'yüzeyde yüzüyor, arada bir soluk alıyor', ad: 'Yüzme' },
  karEseliyor: { fiil: 'toynaklarıyla karı eşeleyip altındaki likeni arıyor', ad: 'Kar eşeleme' },
  savunmaHalkasi: { fiil: 'sürüyle yavruları ortaya alıp boynuzları dışa dönük bir halka kurmuş', ad: 'Savunma halkası', nadir: true },
  ayiyiTakipEdiyor: { fiil: 'kutup ayısını uzaktan izliyor, artıklarını bekliyor', ad: 'Ayıyı takip etme', nadir: true },
  karaDaliyor: { fiil: 'kulaklarını dikip dinliyor, sonra havaya sıçrayıp burnuyla kara dalıyor', ad: 'Kara dalarak avlanma', nadir: true },
  ulumaKorosu: { fiil: 'sürüsüyle birlikte uluyor', ad: 'Uluma korosu', nadir: true },
  // Antarktika
  sokuluyor: { fiil: 'fırtınaya karşı yüzlercesiyle birbirine sokulmuş; sırayla rüzgârlı dış kenardan sıcak ortaya geçiyor', ad: 'Isınmak için sokulma', nadir: true },
  kolonide: { fiil: 'kolonide yuvasının başında bekliyor', ad: 'Kolonide bekleme' },
  tasTopluyor: { fiil: 'gagasıyla çakıl taşı taşıyıp yuvasını yükseltiyor; arada komşusunun taşını çalıyor', ad: 'Yuva taşı toplama', nadir: true },
  penguenPususu: { fiil: 'buz kenarının altında, penguenlerin suya girdiği yerde pusuya yatmış', ad: 'Penguen pususu', nadir: true },
  dalgaYapiyor: { fiil: 'ailesiyle yan yana hızla yüzüp bir dalga yaratıyor; buz parçasının üstündeki foku suya düşürmeye çalışıyor', ad: 'Dalga yaparak avlanma', nadir: true },
  bogaKavgasi: { fiil: 'göğsünü kaldırıp rakibine kükrüyor; iki erkek boyunlarını birbirine çarpıyor', ad: 'Erkeklerin kumsal kavgası', nadir: true },
  // Hindistan
  suyaYatmis: { fiil: 'öğle sıcağında göle girmiş, yalnızca başı sudan çıkıyor; serinliyor', ad: 'Suda serinleme', nadir: true },
  alarmVeriyor: { fiil: 'kaplanı fark etmiş; başını kaldırıp tiz bir alarm havlaması çıkarıyor, kuyruğunu dikmiş', ad: 'Kaplan alarmı', nadir: true },
  dallardaBesleniyor: { fiil: 'ağacın dallarında yaprak ve meyve yiyor; yere düşürdükleri yaprakları altında bekleyen geyikler topluyor', ad: 'Ağaçta beslenme' },
  sudaOtluyor: { fiil: 'göle karnına kadar girmiş, su bitkilerini yiyor', ad: 'Suda otlama', nadir: true },
  kokuIsaretliyor: { fiil: 'ağaç gövdesine yanağını sürtüp pençeleriyle kabuğu tırmalıyor; bölgesini işaretliyor', ad: 'Bölge işaretleme', nadir: true },
  // Moğol bozkırı
  tozBanyosu: { fiil: 'yere yatıp sırt üstü yuvarlanıyor; toz banyosuyla tüylerindeki sinekleri ve parazitleri atıyor', ad: 'Toz banyosu' },
  karKaziyor: { fiil: 'ön toynağıyla karı kazıp altındaki kuru otlara ulaşıyor', ad: 'Kar kazıp otlama', nadir: true },
  haremKoruyor: { fiil: 'kulaklarını geri yatırıp başını yere eğmiş; kısraklarını bir araya topluyor, yaklaşan genç aygırı uzaklaştırıyor', ad: 'Harem koruma', nadir: true },
  boynuzCarpisiyor: { fiil: 'rakibiyle karşılıklı şaha kalkıp kıvrık boynuzlarını gürültüyle çarpıştırıyor; ses vadide yankılanıyor', ad: 'Boynuz çarpışması', nadir: true },
  kokEseliyor: { fiil: 'burnuyla toprağı sürüp kök ve yumru arıyor; arkasında sürülmüş gibi bir toprak şeridi kalıyor', ad: 'Toprağı eşeleme' },
  bogurme: { fiil: 'başını kaldırıp derin, yankılanan bir böğürmeyle dişileri çağırıyor, rakiplerine meydan okuyor', ad: 'Kur böğürmesi', nadir: true },
  kabarcikAgi: { fiil: 'balık ve kril sürüsünün altında daireler çizip hava kabarcıklarından bir ağ örüyor, sonra ağzı açık yukarı fırlıyor', ad: 'Kabarcık ağıyla avlanma', nadir: true },
  karincaYiyor: { fiil: 'burnunu bir karınca yuvasına sokmuş, yapışkan diliyle karıncaları topluyor', ad: 'Karınca yeme', nadir: true },
  guneslenmis: { fiil: 'güneşli bir kayanın üstüne yayılmış, vücudunu ısıtıyor; arada dilini çıkarıp havayı kokluyor', ad: 'Güneşlenme' },
  termitEmiyor: { fiil: 'pençeleriyle bir termit yuvasını yarıp dudaklarını boru gibi uzatarak termitleri gürültüyle emiyor; sesi uzaktan duyuluyor', ad: 'Termit emme', nadir: true },
  sirtindaYavru: { fiil: 'yavrusu sırtındaki uzun tüylere tutunmuş, onu taşıyarak ilerliyor', ad: 'Yavruyu sırtında taşıma', nadir: true },
  fareAvliyor: { fiil: 'kulaklarını dikip otların arasını dinliyor, sonra kavis çizerek havaya sıçrayıp ön ayaklarıyla bir fareyi bastırıyor', ad: 'Fare avlama', nadir: true },
  kayadaBekliyor: { fiil: 'kayalığın kenarında, rengi taşlarla neredeyse aynı, kımıldamadan aşağıyı izliyor', ad: 'Kayalıkta gözetleme' },
  // Avustralya
  boksYapiyor: { fiil: 'kuyruğuna yaslanıp rakibiyle ön ayaklarıyla güreşiyor, arka ayaklarıyla tekme savuruyor', ad: 'Kanguru boksu', nadir: true },
  golgedeYatiyor: { fiil: 'öğle sıcağında bir ağacın gölgesine uzanmış, ön kollarını yalayarak serinliyor', ad: 'Gölgede serinleme' },
  agactaUyuyor: { fiil: 'bir okaliptüs dalının çatalına sıkışmış, uyuyor; günün çoğunu böyle geçirir', ad: 'Ağaçta uyuma' },
  yaprakYiyor: { fiil: 'okaliptüs yapraklarını tek tek koklayıp seçerek yiyor', ad: 'Okaliptüs yaprağı yeme' },
  davulCaliyor: { fiil: 'göğsündeki keseyi şişirip uzaklara yayılan alçak, davul gibi gümbürtüler çıkarıyor', ad: 'Davul sesi', nadir: true },
  yuvaKaziyor: { fiil: 'güçlü pençeleriyle toprağı kazıp inini genişletiyor', ad: 'İn kazma', nadir: true },
  bedenDiliUyari: { fiil: 'kuyruğunu dikip başını kaldırarak sürüye tehlikeyi bildiriyor', ad: 'Beden diliyle uyarı' },
};

// Hayvan sesinin anlamı (ses analizi, karar 49 ve 87)
export const SES_TURLERI = {
  iletisim: 'sürüyle iletişim',
  alarm: 'alarm çağrısı',
  bolge: 'bölge çağrısı',
  yavru: 'yavru çağrısı',
  tehdit: 'tehdit sesi',
  kur: 'kur ve eşleşme çağrısı',
  anne: 'annenin yavrusunu çağırması',
};

// Türler. kisa: kimlik öneki. ses: 3B ses dosyası (yoksa sessiz). aktif: gunduz | gece | karma.
// kacis: yaya yaklaşınca kaçtığı mesafe (m). tehlikeli: çok yaklaşınca tehdit gösterisi ve sahte saldırı yapar.
// yirtici: avlar listesindeki türleri avlar. habitat: grubun yaşadığı alan. grup: [en az, en çok] birey.
export const TURLER = {
  aslan: {
    ad: 'Aslan', bilimsel: 'Panthera leo', kisa: 'ASL', sinif: 'Memeli', ses: 'aslan', sekil: 'kedi', boy: 1.15, renk: '#c9a050',
    hiz: 9, aktif: 'gece', kacis: 20, tehlikeli: true, yirtici: true, avlar: ['zebra', 'ceylan', 'domuz', 'manda', 'gnu', 'impala'], sesSik: 60,
    sesTuru: 'bolge', habitat: { x: 62, y: 76, r: 40 }, grup: [5, 6], erkekOran: 0.2,
    tarif: 'Sürü hâlinde yaşayan tek büyük kedi. Gündüzün çoğunu gölgede dinleyerek geçirir, alacakaranlıkta ve gece avlanır. Erkeklerin kükremesi kilometrelerce uzaktan duyulur.',
  },
  leopar: {
    ad: 'Leopar', bilimsel: 'Panthera pardus', kisa: 'LEO', sinif: 'Memeli', ses: 'leopar', sekil: 'kedi', boy: 0.85, renk: '#d4b06a',
    hiz: 9, aktif: 'gece', kacis: 30, yirtici: true, avlar: ['ceylan', 'domuz', 'impala', 'babun'], sesSik: 90,
    sesTuru: 'bolge', habitat: { x: -112, y: 48, r: 26 }, grup: [1, 1],
    tarif: 'Yalnız yaşayan, gizlenmede usta bir kedi. Kayalıklarda ve ağaçlarda dinlenir, geceleri sessizce avlanır. Testere sesine benzer hırıltılı bir çağrısı vardır.',
  },
  sirtlan: {
    ad: 'Benekli Sırtlan', bilimsel: 'Crocuta crocuta', kisa: 'SRT', sinif: 'Memeli', ses: 'sirtlan', sekil: 'dortayak', boy: 0.85, renk: '#8f7a4f',
    hiz: 8, aktif: 'gece', kacis: 22, yirtici: true, lesci: true, avlar: ['ceylan', 'domuz', 'gnu', 'impala'], sesSik: 45,
    sesTuru: 'iletisim', habitat: { x: -40, y: -55, r: 35 }, grup: [4, 5], erkekOran: 0.4,
    tarif: 'Dişilerin yönettiği klanlar hâlinde yaşar. Hem usta bir avcı hem de leşçidir. Gülmeye benzeyen sesleriyle klan üyeleri birbirini bulur.',
  },
  fil: {
    ad: 'Afrika Fili', bilimsel: 'Loxodonta africana', kisa: 'FIL', sinif: 'Memeli', ses: 'fil', sekil: 'fil', boy: 1.6, renk: '#8a8580',
    hiz: 5, aktif: 'karma', kacis: 28, tehlikeli: true, sesSik: 70, sesTuru: 'iletisim', yeme: 'yapraklaBesleniyor', camur: true,
    habitat: { x: 22, y: 118, r: 38 }, grup: [5, 6], erkekOran: 0.15,
    tarif: 'Karada yaşayan en büyük hayvan. Sürüyü yaşlı bir dişi, yani anaç yönetir. Ağaç yaprakları, kabuk ve otla beslenir; her gün su içmeye gelir.',
  },
  zurafa: {
    ad: 'Zürafa', bilimsel: 'Giraffa camelopardalis', kisa: 'ZRF', sinif: 'Memeli', ses: 'zurafa', sekil: 'zurafa', boy: 1.0, renk: '#d0a15a',
    hiz: 7, aktif: 'gunduz', kacis: 32, sesSik: 200, sesTuru: 'iletisim', yeme: 'yapraklaBesleniyor',
    habitat: { x: 82, y: 112, r: 32 }, grup: [3, 4], erkekOran: 0.3,
    tarif: 'Dünyanın en uzun boylu hayvanı. Akasya yapraklarını uzun diliyle koparır. Çok az ses çıkarır; gece alçak bir uğultuyla iletişim kurduğu düşünülür.',
  },
  zebra: {
    ad: 'Bozkır Zebrası', bilimsel: 'Equus quagga', kisa: 'ZEB', sinif: 'Memeli', ses: 'zebra', sekil: 'zebra', boy: 0.95, renk: '#e8e6e0',
    hiz: 8, aktif: 'gunduz', kacis: 28, sesSik: 50, sesTuru: 'iletisim', alarmSesi: true,
    habitat: { x: 92, y: 2, r: 42 }, grup: [8, 10], erkekOran: 0.2,
    tarif: 'Her bireyin çizgi deseni parmak izi gibi kendine özgüdür. Aileler bir aygır ve kısraklardan oluşur. Tehlikeyi havlamaya benzer bir sesle duyururlar.',
  },
  ceylan: {
    ad: 'Thomson Ceylanı', bilimsel: 'Eudorcas thomsonii', kisa: 'CEY', sinif: 'Memeli', ses: 'ceylan', sekil: 'ceylan', boy: 0.6, renk: '#c08a50',
    hiz: 10, aktif: 'gunduz', kacis: 30, sesSik: 120, sesTuru: 'alarm', alarmSesi: true,
    habitat: { x: -62, y: -8, r: 40 }, grup: [8, 10], erkekOran: 0.25,
    tarif: 'Küçük ve çok hızlı bir antilop. Tehlike anında dört ayağıyla birden havaya sıçrar. Kısa otları sever, büyük sürüler hâlinde gezer.',
  },
  domuz: {
    ad: 'Afrika Yaban Domuzu', bilimsel: 'Phacochoerus africanus', kisa: 'DMZ', sinif: 'Memeli', ses: 'domuz', sekil: 'domuz', boy: 0.75, renk: '#5a4636',
    hiz: 7, aktif: 'gunduz', kacis: 22, sesSik: 70, sesTuru: 'iletisim', camur: true,
    habitat: { x: 25, y: -42, r: 30 }, grup: [4, 5], erkekOran: 0.25,
    tarif: 'Yüzündeki siğil benzeri çıkıntılardan adını alır. Otları ve kökleri dizlerinin üstüne çökerek yer. Kaçarken kuyruğunu anten gibi dik tutar; geceyi yer altı yuvalarında geçirir.',
  },
  suAygiri: {
    ad: 'Su Aygırı', bilimsel: 'Hippopotamus amphibius', kisa: 'SAY', sinif: 'Memeli', ses: 'suaygiri', sekil: 'suaygiri', boy: 1.3, renk: '#7a6a6a',
    hiz: 6, aktif: 'gece', kacis: 25, tehlikeli: true, suCanlisi: true, sesSik: 40, sesTuru: 'bolge',
    habitat: { x: 30, y: nehirY(30), r: 24, nehirde: true }, grup: [4, 5], erkekOran: 0.25,
    tarif: 'Gündüzü nehirde suyun içinde geçirir, gece karaya çıkıp otlar. Afrika\'nın en tehlikeli hayvanlarından biridir; kıyıda ona asla yol kesme.',
  },
  timsah: {
    ad: 'Nil Timsahı', bilimsel: 'Crocodylus niloticus', kisa: 'TMS', sinif: 'Sürüngen', ses: 'timsah', sekil: 'timsah', boy: 1.1, renk: '#4a5a32',
    hiz: 5, aktif: 'karma', kacis: 10, tehlikeli: true, suCanlisi: true, yirtici: true, pusucu: true, avlar: ['ceylan', 'zebra', 'domuz', 'gnu', 'impala'], sesSik: 240,
    sesTuru: 'tehdit', habitat: { x: -20, y: nehirY(-20), r: 20, nehirde: true }, grup: [2, 3],
    tarif: 'Suyun kenarında saatlerce kıpırdamadan bekleyen bir pusu avcısı. Sabahları kıyıda güneşlenerek ısınır.',
  },
  gergedan: {
    ad: 'Ak Gergedan', bilimsel: 'Ceratotherium simum', kisa: 'GRG', sinif: 'Memeli', ses: 'gergedan', sekil: 'gergedan', boy: 1.35, renk: '#8a8884',
    hiz: 7, aktif: 'karma', kacis: 25, tehlikeli: true, sesSik: 110, sesTuru: 'iletisim', camur: true, nadirTur: true,
    habitat: { x: 122, y: 48, r: 30 }, grup: [2, 2], erkekOran: 0,
    tarif: 'Nesli tehlike altındaki büyük bir otçul. Geniş, düz dudağıyla kısa otları biçer gibi yer. Gözleri zayıftır, koku ve işitmesi çok güçlüdür.',
  },
  kartal: {
    ad: 'Afrika Balık Kartalı', bilimsel: 'Haliaeetus vocifer', kisa: 'KRT', sinif: 'Kuş', ses: 'kartal', sekil: 'kus', boy: 0.8, renk: '#3a2c22',
    hiz: 9, aktif: 'gunduz', kacis: 25, kus: true, sesSik: 50, sesTuru: 'bolge',
    habitat: { x: 42, y: nehirY(42) + 8, r: 35 }, grup: [2, 2], erkekOran: 0.5,
    tarif: 'Beyaz başlı, çığlığı Afrika\'nın simgesi sayılan bir kartal. Kıyıdaki ağaçlara tüner, sudan balık kapar.',
  },
  piton: {
    ad: 'Afrika Kaya Pitonu', bilimsel: 'Python sebae', kisa: 'PTN', sinif: 'Sürüngen', ses: 'yilan', sekil: 'yilan', boy: 1.3, renk: '#6a5a3a',
    hiz: 2, aktif: 'gece', kacis: 5, sesSik: 300, sesTuru: 'tehdit', yeme: 'bekliyor',
    habitat: { x: -122, y: 30, r: 18 }, grup: [1, 1],
    tarif: 'Afrika\'nın en büyük yılanı. Zehirsizdir; avını sararak yakalar. Kaya kovuklarında saklanır, çoğu zaman hiç fark edilmez.',
  },
  manda: {
    ad: 'Afrika Mandası', bilimsel: 'Syncerus caffer', kisa: 'MND', sinif: 'Memeli', ses: 'manda', sekil: 'manda', boy: 1.1, renk: '#2e2a28',
    hiz: 7, aktif: 'karma', kacis: 30, tehlikeli: true, sesSik: 80, sesTuru: 'iletisim', camur: true,
    habitat: { x: -20, y: -140, r: 40, guneyde: true }, grup: [7, 8], erkekOran: 0.3,
    tarif: 'Sürü hâlinde yaşayan, öfkelendiğinde çok tehlikeli bir yaban sığırı. Sürü üyeleri tehlikede birbirini korur; yaralı birini yalnız bırakmaz.',
  },
  // Aşama 6: yeni türler
  gnu: {
    ad: 'Ak sakallı gnu', bilimsel: 'Connochaetes taurinus', kisa: 'GNU', sinif: 'Memeli', ses: 'gnu', sekil: 'manda', boy: 0.85, renk: '#5e5a52',
    hiz: 9, aktif: 'gunduz', kacis: 30, sesSik: 40, sesTuru: 'iletisim', alarmSesi: true,
    habitat: { x: 112, y: -32, r: 36 }, grup: [10, 14], erkekOran: 0.3,
    tarif: 'Doğu Afrika\'nın büyük göçünün yıldızı. Zebralarla birlikte dolaşır: zebralar uzun otu, gnular arkadan kısa otu yer. Yavrular doğduktan birkaç dakika sonra koşabilir.',
  },
  cita: {
    ad: 'Çita', bilimsel: 'Acinonyx jubatus', kisa: 'CIT', sinif: 'Memeli', ses: 'cita', sekil: 'kedi', boy: 0.8, renk: '#d9b770',
    hiz: 13, aktif: 'gunduz', kacis: 38, yirtici: true, gunduzAvcisi: true, avlar: ['ceylan', 'impala', 'domuz', 'gnu'], sesSik: 110, sesTuru: 'iletisim', nadirTur: true,
    habitat: { x: -45, y: 58, r: 38 }, grup: [1, 3], erkekOran: 0.45,
    tarif: 'Karadaki en hızlı hayvan; birkaç saniyede saatte 100 kilometreye ulaşır. Aslanlar ve sırtlanlarla karşılaşmamak için gündüz avlanır. Kükreyemez; kuş gibi cıvıldar. Nesli tehlike altında.',
  },
  impala: {
    ad: 'İmpala', bilimsel: 'Aepyceros melampus', kisa: 'IMP', sinif: 'Memeli', ses: 'impala', sekil: 'ceylan', boy: 0.85, renk: '#b8743c',
    hiz: 10, aktif: 'gunduz', kacis: 30, sesSik: 90, sesTuru: 'alarm', alarmSesi: true,
    habitat: { x: -20, y: 118, r: 32 }, grup: [8, 12], erkekOran: 0.15,
    tarif: 'Akasyalık kenarında yaşayan zarif bir antilop. Hem ot hem yaprak yer, bu yüzden kurak mevsimde de bölgeden ayrılmaz. Kaçarken üç metre yükseğe sıçrar.',
  },
  yabanKopegi: {
    ad: 'Afrika yaban köpeği', bilimsel: 'Lycaon pictus', kisa: 'YKP', sinif: 'Memeli', ses: 'yabankopegi', sekil: 'dortayak', boy: 0.7, renk: '#6a5a3c',
    hiz: 11, aktif: 'gunduz', alacaAvcisi: true, kacis: 40, yirtici: true, avlar: ['impala', 'ceylan', 'gnu', 'domuz', 'zebra'], sesSik: 60, sesTuru: 'iletisim', nadirTur: true,
    habitat: { x: 58, y: -48, r: 55 }, grup: [5, 8], erkekOran: 0.6,
    tarif: 'Her bireyin benekli deseni farklıdır. Sürü birlikte avlanır ve avını yaşlılarla yavrularla paylaşır. Evcil köpeklerden bulaşan hastalıklar ve yaşam alanı kaybı yüzünden nesli tehlikede.',
  },
  babun: {
    ad: 'Zeytin babunu', bilimsel: 'Papio anubis', kisa: 'BBN', sinif: 'Memeli', ses: 'babun', sekil: 'dortayak', boy: 0.62, renk: '#6e6649',
    hiz: 7, aktif: 'gunduz', kacis: 30, sesSik: 70, sesTuru: 'alarm', alarmSesi: true, yeme: 'yiyecekAriyor',
    habitat: { x: 148, y: -80, r: 26 }, grup: [8, 12], erkekOran: 0.35,
    tarif: 'Galeri ormanında ve kayalıklarda yaşayan büyük bir maymun. Sürüde karmaşık bir hiyerarşi ve dostluklar vardır; tımarlaşma bağları güçlendirir. Hemen her şeyi yer.',
  },
};

// ---------- Kuzey Kutbu türleri (kutup: true; habitatlar KUTUP merkezine göre) ----------
const KY = 6000;
Object.assign(TURLER, {
  kutupAyisi: {
    ad: 'Kutup Ayısı', bilimsel: 'Ursus maritimus', kisa: 'KAY', sinif: 'Memeli', ses: 'kutupayisi', sekil: 'ayi', boy: 1.3, renk: '#ece6d6', kutup: true,
    hiz: 8, aktif: 'karma', kacis: 30, tehlikeli: true, yirtici: true, lesci: true, yuzer: true, avlar: ['halkaliFok'], sesSik: 150, sesTuru: 'tehdit',
    habitat: { x: 10, y: KY + 120, r: 90 }, grup: [1, 3], erkekOran: 0.35,
    tarif: 'Karadaki en büyük yırtıcı. Neredeyse bütün hayatını deniz buzunun üstünde geçirir ve halkalı fokları avlar: fokun nefes deliğinin başında saatlerce kıpırdamadan bekler. Buz eriyince karada aç kalır; iklim ısındıkça buzsuz mevsim uzuyor.',
  },
  halkaliFok: {
    ad: 'Halkalı Fok', bilimsel: 'Pusa hispida', kisa: 'HFK', sinif: 'Memeli', ses: 'fok', sekil: 'fok', boy: 0.7, renk: '#6e6a60', kutup: true,
    hiz: 5, aktif: 'karma', kacis: 34, suCanlisi: true, sesSik: 110, sesTuru: 'iletisim',
    habitat: { x: -30, y: KY + 135, r: 60 }, grup: [3, 5], erkekOran: 0.4,
    tarif: 'Arktiğin en yaygın foku. Ön yüzgeçlerindeki pençelerle buzda nefes delikleri açar ve kış boyu açık tutar. Yavrularını buzun üstündeki kar mağaralarında doğurur. Çok ürkektir: kutup ayısı yüzünden en küçük tıkırtıda deliğine dalar.',
  },
  mors: {
    ad: 'Atlantik Morsu', bilimsel: 'Odobenus rosmarus', kisa: 'MRS', sinif: 'Memeli', ses: 'mors', sekil: 'mors', boy: 1.35, renk: '#9a7860', kutup: true,
    hiz: 3, aktif: 'karma', kacis: 22, tehlikeli: true, suCanlisi: true, sesSik: 45, sesTuru: 'iletisim',
    habitat: { x: 120, y: KY + 55, r: 32 }, grup: [6, 9], erkekOran: 0.45,
    tarif: 'Uzun dişleri ve bıyıklarıyla deniz dibinde midye arayan iri bir yüzgeçayaklı. Kıyıya ya da buza kalabalık sürüler hâlinde çıkıp sırt sırta yatar. Dişlerini buza saplayarak sudan çıkar; erkekler dişleriyle sıralama kavgası yapar.',
  },
  beluga: {
    ad: 'Beyaz Balina (Beluga)', bilimsel: 'Delphinapterus leucas', kisa: 'BLG', sinif: 'Memeli', ses: 'beluga', sekil: 'balina', boy: 1.5, renk: '#e4eaea', kutup: true,
    hiz: 5, aktif: 'karma', kacis: 18, suCanlisi: true, deniz: true, sesSik: 28, sesTuru: 'iletisim',
    habitat: { x: -40, y: KY + 95, r: 60 }, grup: [4, 6], erkekOran: 0.4,
    tarif: 'Bembeyaz, sırt yüzgeci olmayan bir balina. Islığa, cıvıltıya ve tıkırtıya benzeyen sesleri yüzünden "deniz kanaryası" denir. Yazın kıyı sularına ve fiyortlara gelir, kışı buzların arasındaki açık su göllerinde geçirir.',
  },
  renGeyigi: {
    ad: 'Ren Geyiği', bilimsel: 'Rangifer tarandus', kisa: 'RNG', sinif: 'Memeli', ses: 'rengeyigi', sekil: 'geyik', boy: 0.95, renk: '#8a7a64', kutup: true,
    hiz: 9, aktif: 'karma', kacis: 34, sesSik: 90, sesTuru: 'iletisim',
    habitat: { x: -80, y: KY - 85, r: 60 }, grup: [5, 8], erkekOran: 0.3,
    tarif: 'Hem erkeği hem dişisi boynuzlu tek geyik. Kışın toynaklarıyla karı eşeleyip altındaki likenleri bulur. Yürürken dizlerinden gelen tıkırtı sürünün birbirini bulmasına yardım eder. Gözleri kışın maviye döner, karanlıkta daha iyi görür.',
  },
  miskOkuzu: {
    ad: 'Misk Öküzü', bilimsel: 'Ovibos moschatus', kisa: 'MSK', sinif: 'Memeli', ses: 'miskokuzu', sekil: 'misk', boy: 1.0, renk: '#3a2e24', kutup: true,
    hiz: 7, aktif: 'karma', kacis: 38, tehlikeli: true, sesSik: 100, sesTuru: 'iletisim',
    habitat: { x: 60, y: KY - 110, r: 55 }, grup: [6, 10], erkekOran: 0.3,
    tarif: 'Buzul çağından kalma, uzun tüylü iri bir otçul. Altındaki yünü, kiviut, koyun yününden sekiz kat sıcaktır. Kurtlar saldırınca yetişkinler yavruları ortaya alıp boynuzları dışa dönük bir halka kurar.',
  },
  kutupKurdu: {
    ad: 'Kutup Kurdu', bilimsel: 'Canis lupus arctos', kisa: 'KKR', sinif: 'Memeli', ses: 'kutupkurdu', sekil: 'kurt', boy: 0.85, renk: '#e8e4d8', kutup: true,
    hiz: 11, aktif: 'karma', kacis: 45, yirtici: true, avlar: ['renGeyigi', 'miskOkuzu', 'kutupTavsani'], sesSik: 70, sesTuru: 'bolge',
    habitat: { x: -20, y: KY - 60, r: 100 }, grup: [4, 6], erkekOran: 0.5,
    tarif: 'Bembeyaz bir kurt alt türü. İnsanla çok az karşılaştığı için korkusuzdur, araştırmacıları merakla izleyebilir. Sürü uzun mesafeler boyunca ren geyiklerini ve misk öküzlerini takip eder; uluyarak birbirini bulur.',
  },
  kutupTilkisi: {
    ad: 'Kutup Tilkisi', bilimsel: 'Vulpes lagopus', kisa: 'KTL', sinif: 'Memeli', ses: 'kutuptilkisi', sekil: 'kurt', boy: 0.45, renk: '#f2efe6', kutup: true,
    hiz: 9, aktif: 'karma', kacis: 18, yirtici: true, lesci: true, avlar: ['kutupTavsani'], sesSik: 80, sesTuru: 'iletisim',
    habitat: { x: 20, y: KY - 10, r: 80 }, grup: [1, 2], erkekOran: 0.5,
    tarif: 'Kışın bembeyaz, yazın kahverengi kürklü küçük bir tilki. Karın altındaki lemmingleri sesinden bulup kara dalarak yakalar. Kışın kutup ayılarını takip edip artıklarıyla beslenir; eksi 50 derecede bile üşümez.',
  },
  kutupTavsani: {
    ad: 'Kutup Tavşanı', bilimsel: 'Lepus arcticus', kisa: 'KTV', sinif: 'Memeli', ses: 'kutuptavsani', sekil: 'tavsan', boy: 0.42, renk: '#f4f4f0', kutup: true,
    hiz: 12, aktif: 'karma', kacis: 26, sesSik: 220, sesTuru: 'alarm',
    habitat: { x: -125, y: KY - 40, r: 45 }, grup: [4, 8], erkekOran: 0.5,
    tarif: 'Kısa kulaklı, kalın kürklü iri bir tavşan. Bazen yüzlerce bir arada dolaşır; tehlikede arka ayakları üstünde dikilip kanguru gibi zıplayarak kaçar.',
  },
});
// ---------- Antarktika türleri (kutup: true, guney: true; habitatlar ANTARKTIKA merkezine göre) ----------
const AY = -6000;
Object.assign(TURLER, {
  imparatorPengueni: {
    ad: 'İmparator Pengueni', bilimsel: 'Aptenodytes forsteri', kisa: 'IPG', sinif: 'Kuş', ses: 'imparatorpengueni', sekil: 'penguen', boy: 1.0, renk: '#1c1e24', kutup: true, guney: true,
    hiz: 2.5, aktif: 'karma', kacis: 7, suCanlisi: true, sesSik: 40, sesTuru: 'iletisim', penguen: true,
    habitat: { x: -70, y: AY + 95, r: 55 }, grup: [10, 14], erkekOran: 0.5,
    tarif: 'Penguenlerin en büyüğü. Antarktika kışının ortasında, donmuş deniz buzunun üstünde ürer: dişi tek yumurtasını erkeğe bırakıp denize gider, erkek yumurtayı ayaklarının üstünde, karın kıvrımının altında iki ay aç kalarak kuluçkaya yatar. Fırtınada binlerce erkek birbirine sokulup dönerek ısınır.',
  },
  adeliPengueni: {
    ad: 'Adélie Pengueni', bilimsel: 'Pygoscelis adeliae', kisa: 'ADL', sinif: 'Kuş', ses: 'adelipengueni', sekil: 'penguen', boy: 0.62, renk: '#202228', kutup: true, guney: true,
    hiz: 3, aktif: 'karma', kacis: 6, yuzer: true, sesSik: 30, sesTuru: 'iletisim', penguen: true, karaKolonisi: true,
    habitat: { x: 110, y: AY + 5, r: 30 }, grup: [10, 14], erkekOran: 0.5,
    tarif: 'Gözünün çevresinde beyaz halka olan küçük, meraklı bir penguen. Yazın buzsuz kayalık burunlarda kalabalık koloniler kurar; yuvasını çakıl taşlarından yapar, komşusunun taşlarını çalmaktan da çekinmez. Kışı açık denizde, buz kenarında geçirir.',
  },
  weddellFoku: {
    ad: 'Weddell Foku', bilimsel: 'Leptonychotes weddellii', kisa: 'WDF', sinif: 'Memeli', ses: 'weddellfoku', sekil: 'fok', boy: 1.0, renk: '#4a5058', kutup: true, guney: true,
    hiz: 4, aktif: 'karma', kacis: 5, suCanlisi: true, sesSik: 60, sesTuru: 'iletisim', fok: true,
    habitat: { x: 20, y: AY + 130, r: 60 }, grup: [3, 5], erkekOran: 0.4,
    tarif: 'Yeryüzünün en güneyinde yaşayan memeli. Bütün kış kıyıya yapışık deniz buzunun altında kalır, nefes deliklerini dişleriyle buzu kemirerek açık tutar. Buzun altından yükselen uzay seslerine benzeyen çağrıları buzun üstünden bile duyulur. İnsandan neredeyse hiç korkmaz.',
  },
  leoparFoku: {
    ad: 'Leopar Foku', bilimsel: 'Hydrurga leptonyx', kisa: 'LPF', sinif: 'Memeli', ses: 'leoparfoku', sekil: 'fok', boy: 1.3, renk: '#7a7e84', kutup: true, guney: true,
    hiz: 5, aktif: 'karma', kacis: 14, tehlikeli: true, suCanlisi: true, yirtici: true, avlar: ['adeliPengueni', 'imparatorPengueni'], sesSik: 120, sesTuru: 'bolge',
    habitat: { x: 60, y: AY + 75, r: 70 }, grup: [1, 1], erkekOran: 0.4,
    tarif: 'Benekli gri postu ve sürüngeni andıran iri başıyla Antarktika\'nın tepe yırtıcılarından. Buz kenarının altında pusuya yatar, suya giren ya da sudan çıkan penguenleri yakalar. Kurbağa adamlara bile meraklı yaklaştığı bilinir; ona asla yaklaşma.',
  },
  orka: {
    ad: 'Orka (Katil Balina)', bilimsel: 'Orcinus orca', kisa: 'ORK', sinif: 'Memeli', ses: 'orka', sekil: 'balina', boy: 2.0, renk: '#16181c', kutup: true, guney: true,
    hiz: 7, aktif: 'karma', kacis: 20, suCanlisi: true, deniz: true, yirtici: true, avlar: ['weddellFoku', 'adeliPengueni', 'yengecYiyenFok'], sesSik: 50, sesTuru: 'iletisim',
    habitat: { x: 0, y: AY + 175, r: 55 }, grup: [4, 6], erkekOran: 0.4,
    tarif: 'Yunusların en büyüğü. Aileler hâlinde yaşar, her ailenin kendine özgü bir "lehçesi" vardır. Antarktika\'daki bazı orkalar buz parçası üstünde dinlenen fokları, hep birlikte yüzerek yaptıkları bir dalgayla buzdan suya düşürür.',
  },
  filFoku: {
    ad: 'Güney Fil Foku', bilimsel: 'Mirounga leonina', kisa: 'FLF', sinif: 'Memeli', ses: 'filfoku', sekil: 'mors', boy: 1.55, renk: '#7a6a5a', kutup: true, guney: true,
    hiz: 2.5, aktif: 'karma', kacis: 10, tehlikeli: true, suCanlisi: true, karayaCikar: true, sesSik: 40, sesTuru: 'bolge',
    habitat: { x: -40, y: AY + 30, r: 30 }, grup: [6, 9], erkekOran: 0.35,
    tarif: 'Dünyanın en büyük foku: erkekleri dört tonu aşar. Erkeklerin hortum gibi sarkan burnu, gürültülü kükremelerini yükseltir. Yazın kumsallara çıkıp tüy değiştirir ve sırt sırta yatar; erkekler kumsal için kanlı kavgalar yapar. Bin metreden derine dalabilir.',
  },
});
// ---------- Avustralya çalılığı türleri (kutup: true harita altyapısını kullanır, avustralya: true; habitatlar AVUSTRALYA merkezine göre) ----------
const AX = 6000;
Object.assign(TURLER, {
  kirmiziKanguru: {
    ad: 'Kırmızı Kanguru', bilimsel: 'Osphranter rufus', kisa: 'KNG', sinif: 'Memeli', ses: 'kanguru', sekil: 'kanguru', boy: 1.35, renk: '#b4643c', kutup: true, avustralya: true,
    hiz: 13, aktif: 'karma', kacis: 32, sesSik: 160, sesTuru: 'alarm',
    habitat: { x: AX + 0, y: -110, r: 90 }, grup: [5, 9], erkekOran: 0.3,
    tarif: 'Dünyanın en büyük keseli hayvanı; erkekleri insan boyunu aşar. Arka ayaklarıyla saatte 50 kilometreye kadar sıçrar, kuyruğunu denge için kullanır. Sıcağın en yüksek olduğu saatlerde gölgede yatar, ön kollarını yalayarak serinler. Yavru, ilk aylarını annesinin kesesinde geçirir.',
  },
  koala: {
    ad: 'Koala', bilimsel: 'Phascolarctos cinereus', kisa: 'KOA', sinif: 'Memeli', ses: 'koala', sekil: 'koala', boy: 0.6, renk: '#9a9894', kutup: true, avustralya: true,
    hiz: 3, aktif: 'gece', kacis: 7, sesSik: 260, sesTuru: 'bolge',
    habitat: { x: AX + 20, y: 135, r: 65 }, grup: [1, 2], erkekOran: 0.5,
    tarif: 'Neredeyse yalnızca okaliptüs yaprağıyla beslenen keseli bir hayvan. Yapraklar az besleyici ve zehirli olduğu için günde 18-20 saat ağaçta uyuyarak enerji biriktirir. Erkekler üreme döneminde domuz homurtusunu andıran şaşırtıcı derecede derin bir sesle böğürür.',
  },
  emu: {
    ad: 'Emu', bilimsel: 'Dromaius novaehollandiae', kisa: 'EMU', sinif: 'Kuş', ses: 'emu', sekil: 'emu', boy: 1.6, renk: '#5c4c3c', kutup: true, avustralya: true,
    hiz: 13, aktif: 'gunduz', kacis: 34, sesSik: 200, sesTuru: 'iletisim',
    habitat: { x: AX + 120, y: -140, r: 70 }, grup: [2, 5], erkekOran: 0.5,
    tarif: 'Uçamayan, insan boyunda bir kuş. Saatte 50 kilometreyle koşar. Dişi boğazındaki keseyle kilometrelerce duyulan davul gibi sesler çıkarır. Yumurtaları erkek kuluçkaya yatırır ve yaklaşık iki ay hiç yemeden yuvada bekler; yavruları da o büyütür.',
  },
  vombat: {
    ad: 'Vombat', bilimsel: 'Vombatus ursinus', kisa: 'VMB', sinif: 'Memeli', ses: 'vombat', sekil: 'vombat', boy: 0.7, renk: '#7a6a5a', kutup: true, avustralya: true,
    hiz: 6, aktif: 'gece', kacis: 12, sesSik: 260, sesTuru: 'alarm',
    habitat: { x: AX - 120, y: -60, r: 50 }, grup: [1, 2], erkekOran: 0.5,
    tarif: 'Tıknaz, kısa bacaklı, kazıcı bir keseli. Gündüzü kazdığı uzun tünellerde geçirir, gece otlar. Kesesi arkaya doğru açılır, kazarken içine toprak dolmaz. Dışkısı küp biçimindedir; bunları kayaların üstüne bırakarak bölgesini işaretler.',
  },
  dingo: {
    ad: 'Dingo', bilimsel: 'Canis dingo', kisa: 'DNG', sinif: 'Memeli', ses: 'dingo', sekil: 'kurt', boy: 0.72, renk: '#c88c48', kutup: true, avustralya: true,
    hiz: 12, aktif: 'karma', kacis: 40, yirtici: true, avlar: ['kirmiziKanguru', 'vombat', 'emu', 'bozKanguru', 'euro', 'avrupaTavsani'], sesSik: 90, sesTuru: 'bolge',
    habitat: { x: AX - 60, y: 20, r: 120 }, grup: [3, 5], erkekOran: 0.5,
    tarif: 'Avustralya\'nın en büyük kara yırtıcısı; binlerce yıl önce insanlarla kıtaya gelmiş vahşi bir köpek. Havlamaz; uluyarak iletişim kurar. Sürüyle kangurulara bayırlarda pusu kurar, yorulana kadar kovalar.',
  },
});
// ---------- Hindistan ormanı türleri (kutup: true harita altyapısı, hindistan: true; habitatlar HINDISTAN merkezine göre) ----------
const HX = -6000;
Object.assign(TURLER, {
  kaplan: {
    ad: 'Bengal Kaplanı', bilimsel: 'Panthera tigris tigris', kisa: 'KPL', sinif: 'Memeli', ses: 'kaplan', sekil: 'kedi', boy: 1.3, renk: '#d0782c', kutup: true, hindistan: true,
    hiz: 12, aktif: 'karma', kacis: 30, tehlikeli: true, yirtici: true, avlar: ['cital', 'sambar', 'gaur', 'barasingha', 'hintYabanDomuzu', 'nilgay'], sesSik: 160, sesTuru: 'bolge',
    habitat: { x: HX - 20, y: 40, r: 140 }, grup: [1, 2], erkekOran: 0.4,
    tarif: 'Dünyanın en büyük kedilerinden biri. Tek başına yaşar ve avlanır; çizgileri parmak izi gibi her bireyde farklıdır. Sinsice yaklaşıp son birkaç metrede atılır. Sıcakta suya girmeyi sever. Ormandaki varlığını en çok geyiklerin ve maymunların alarm çağrıları ele verir.',
  },
  hintFili: {
    ad: 'Hint Fili', bilimsel: 'Elephas maximus indicus', kisa: 'HFL', sinif: 'Memeli', ses: 'hintfili', sekil: 'fil', boy: 1.15, renk: '#6e6a66', kutup: true, hindistan: true,
    hiz: 5, aktif: 'karma', kacis: 30, tehlikeli: true, sesSik: 80, sesTuru: 'iletisim',
    habitat: { x: HX + 40, y: 110, r: 80 }, grup: [4, 7], erkekOran: 0.3,
    tarif: 'Afrika filinden küçük, kulakları daha küçük ve sırtı kamburdur; dişilerin çoğunun fildişi yoktur. Yaşlı bir dişinin önderliğinde aile hâlinde dolaşır. Günde 150 kilogram bitki yer, bambu ve sal ormanının yollarını açar.',
  },
  cital: {
    ad: 'Benekli Geyik (Çital)', bilimsel: 'Axis axis', kisa: 'CTL', sinif: 'Memeli', ses: 'cital', sekil: 'geyik', boy: 0.85, renk: '#b8743a', kutup: true, hindistan: true,
    hiz: 12, aktif: 'karma', kacis: 30, sesSik: 160, sesTuru: 'alarm',
    habitat: { x: HX + 0, y: -100, r: 90 }, grup: [8, 14], erkekOran: 0.35,
    tarif: 'Kızıl sırtı ömür boyu beyaz benekli kalan zarif bir geyik. Çayırlarda kalabalık sürülerle otlar; langur maymunlarının ağaçtan düşürdüğü yaprak ve meyveleri toplamak için onların altında dolaşır. Kaplanı görünce tiz bir alarm havlaması çıkarır.',
  },
  sambar: {
    ad: 'Sambar Geyiği', bilimsel: 'Rusa unicolor', kisa: 'SMB', sinif: 'Memeli', ses: 'sambar', sekil: 'geyik', boy: 1.15, renk: '#5c4a38', kutup: true, hindistan: true,
    hiz: 10, aktif: 'gece', kacis: 32, sesSik: 200, sesTuru: 'alarm',
    habitat: { x: HX + 60, y: 40, r: 70 }, grup: [2, 4], erkekOran: 0.4,
    tarif: 'Hindistan\'ın en iri geyiği; koyu kahverengi, kaba tüylü. Geceleri ve alacakaranlıkta beslenir, göl kıyısında su bitkileri yemek için suya girer. Tehlikede ayağını yere vurup kornaya benzeyen yüksek bir "dank" sesi çıkarır.',
  },
  gaur: {
    ad: 'Gaur (Hint Bizonu)', bilimsel: 'Bos gaurus', kisa: 'GAR', sinif: 'Memeli', ses: 'gaur', sekil: 'manda', boy: 1.25, renk: '#2e2620', kutup: true, hindistan: true,
    hiz: 8, aktif: 'karma', kacis: 30, tehlikeli: true, sesSik: 140, sesTuru: 'iletisim',
    habitat: { x: HX - 80, y: 120, r: 80 }, grup: [5, 9], erkekOran: 0.3,
    tarif: 'Dünyanın en büyük yabani sığırı; sırtında bir tümsek, bacakları dizden aşağı beyaz "çoraplı". Sal ormanının kenarlarında ve yamaçlarda otlar. Yetişkin bir boğaya kaplan bile nadiren saldırır.',
  },
  langur: {
    ad: 'Gri Langur', bilimsel: 'Semnopithecus entellus', kisa: 'LNG', sinif: 'Memeli', ses: 'langur', sekil: 'dortayak', boy: 0.6, renk: '#b4b0a8', kutup: true, hindistan: true,
    hiz: 8, aktif: 'gunduz', kacis: 20, sesSik: 90, sesTuru: 'alarm',
    habitat: { x: HX + 10, y: -20, r: 90 }, grup: [8, 14], erkekOran: 0.25,
    tarif: 'Gri tüylü, siyah yüzlü, uzun kuyruklu bir maymun. Gününün çoğunu ağaçlarda yaprak, çiçek ve meyve yiyerek geçirir. Ağaçtan çevreyi iyi görür; kaplanı ya da leoparı fark edince yüksek sesle alarm verir, bunu duyan geyikler de kaçar.',
  },
});
// Adélie Kıyısı'nda ve çevresindeki denizde gerçekten yaşayan öbür büyük hayvanlar: yengeçyiyen fok, Ross foku, kürklü fok ve yazın gelen balinalar (15 Kasım 2026)
Object.assign(TURLER, {
  yengecYiyenFok: {
    ad: 'Yengeçyiyen Fok', bilimsel: 'Lobodon carcinophaga', kisa: 'YYF', sinif: 'Memeli', ses: 'yengecyiyenfok', sekil: 'fok', boy: 1.0, renk: '#b8b0a4', kutup: true, guney: true,
    hiz: 5, aktif: 'karma', kacis: 10, suCanlisi: true, sesSik: 160, sesTuru: 'iletisim', fok: true,
    habitat: { x: 60, y: AY + 115, r: 70 }, grup: [4, 8], erkekOran: 0.45,
    tarif: 'Dünyanın en kalabalık foku; sayılarının on milyonları bulduğu düşünülür. Adına karşın yengeç değil kril yer: dişlerinin ince çıkıntıları süzgeç gibi çalışır. Açık denizdeki kayan buz parçalarının üstünde dinlenir; yetişkinlerin çoğunun sırtında leopar foklarından kalma yara izleri vardır.',
  },
  rossFoku: {
    ad: 'Ross Foku', bilimsel: 'Ommatophoca rossii', kisa: 'RSF', sinif: 'Memeli', ses: 'rossfoku', sekil: 'fok', boy: 0.95, renk: '#5a5e64', kutup: true, guney: true,
    hiz: 4, aktif: 'karma', kacis: 6, suCanlisi: true, sesSik: 220, sesTuru: 'iletisim', fok: true,
    habitat: { x: -40, y: AY + 160, r: 50 }, grup: [1, 1], erkekOran: 0.5,
    tarif: 'Antarktika foklarının en az görüleni; sık kayan buzun derinliklerinde tek başına yaşar. Başı kısa, gözleri çok iridir; derin ve karanlık suda kalamar avlamaya uyum sağlamıştır. Tehlikede başını kaldırıp boğazını şişirir, kuşa benzeyen tuhaf trilli sesler çıkarır.',
  },
  kurkluFok: {
    ad: 'Antarktika Kürklü Foku', bilimsel: 'Arctocephalus gazella', kisa: 'KRF', sinif: 'Memeli', ses: 'kurklufok', sekil: 'fok', boy: 0.85, renk: '#5a4e44', kutup: true, guney: true,
    hiz: 6, aktif: 'karma', kacis: 10, tehlikeli: true, suCanlisi: true, karayaCikar: true, sesSik: 120, sesTuru: 'bolge',
    habitat: { x: 90, y: AY + 20, r: 30 }, grup: [3, 6], erkekOran: 0.4,
    tarif: 'Dış kulağı olan, arka yüzgeçlerini öne çevirip karada dört ayak üstünde koşabilen bir fok. Kalın kürkü yüzünden 1800\'lerde neredeyse tükenecek kadar avlandı, bugün yeniden çoğaldı. Yazın kayalık kıyılara gelen genç erkekler saldırgan olabilir; onlara yaklaşma.',
  },
  minkeBalina: {
    ad: 'Antarktika Minke Balinası', bilimsel: 'Balaenoptera bonaerensis', kisa: 'MNK', sinif: 'Memeli', ses: 'minke', sekil: 'balina', boy: 2.6, renk: '#3e444c', kutup: true, guney: true, gocmenBalina: true,
    hiz: 7, aktif: 'karma', kacis: 20, suCanlisi: true, deniz: true, sesSik: 160, sesTuru: 'iletisim',
    habitat: { x: -20, y: AY + 165, r: 60 }, grup: [1, 3], erkekOran: 0.5,
    tarif: 'Büyük balinaların en küçüğü; buzun en yakınında kalanı da odur. Kayan buz parçalarının arasındaki dar açıklıklarda kril yer, nefes almak için buzdaki çatlakları kullanır. Yazın buz kenarında, kışın kuzeye çekilir.',
  },
  kamburBalina: {
    ad: 'Kambur Balina', bilimsel: 'Megaptera novaeangliae', kisa: 'KMB', sinif: 'Memeli', ses: 'kamburbalina', sekil: 'balina', boy: 3.4, renk: '#2a2e34', kutup: true, guney: true, gocmenBalina: true,
    hiz: 6, aktif: 'karma', kacis: 25, suCanlisi: true, deniz: true, sesSik: 140, sesTuru: 'iletisim',
    habitat: { x: 50, y: AY + 195, r: 50 }, grup: [1, 3], erkekOran: 0.5,
    tarif: 'Uzun, beyaz göğüs yüzgeçleri ve sularda çok uzaklara ulaşan şarkılarıyla tanınır. Yazı Antarktika sularında krille beslenerek geçirir; kışın binlerce kilometre kuzeydeki ılık sulara gidip orada doğurur. Birlikte avlanırken av sürüsünün çevresinde hava kabarcıklarından bir ağ örer.',
  },
  maviBalina: {
    ad: 'Antarktika Mavi Balinası', bilimsel: 'Balaenoptera musculus intermedia', kisa: 'MVB', sinif: 'Memeli', ses: 'mavibalina', sekil: 'balina', boy: 5.0, renk: '#4a5868', kutup: true, guney: true, gocmenBalina: true,
    hiz: 6, aktif: 'karma', kacis: 30, suCanlisi: true, deniz: true, sesSik: 260, sesTuru: 'iletisim',
    habitat: { x: -60, y: AY + 205, r: 35 }, grup: [1, 1], erkekOran: 0.5,
    tarif: 'Yeryüzünde yaşamış en büyük hayvan: otuz metreyi, iki yüz tonu bulabilir. Günde tonlarca kril yer. Balina avcılığı yüzünden sayıları yüz binlerden birkaç yüze indi; bugün yavaş yavaş artıyor ama hâlâ çok nadirdir. Burnundan çıkan su sütunu dokuz metreye yükselir.',
  },
});
// Avustralya çalılığında gerçekten yaşayan öbür büyük ve orta boy hayvanlar; yerlilerin yanında insanların getirdiği istilacılar da var (15 Kasım 2026)
Object.assign(TURLER, {
  bozKanguru: {
    ad: 'Batı Boz Kangurusu', bilimsel: 'Macropus fuliginosus', kisa: 'BKN', sinif: 'Memeli', ses: 'kanguru', sekil: 'kanguru', boy: 1.15, renk: '#7a6a5e', kutup: true, avustralya: true,
    hiz: 12, aktif: 'karma', kacis: 30, sesSik: 200, sesTuru: 'alarm',
    habitat: { x: AX + 40, y: 70, r: 80 }, grup: [4, 10], erkekOran: 0.3,
    tarif: 'Kırmızı kangurudan biraz küçük, kahverengi-gri tüylü bir kanguru. Ağaçlık çalılıkları ve okaliptüslerin kenarlarını sever; sabah ve akşam otlar. Yaşlı erkeklerinin kuvvetli bir kokusu olduğu için yerliler ona "kokarca" der.',
  },
  euro: {
    ad: 'Avustralya Ovalarosu (Euro)', bilimsel: 'Osphranter robustus erubescens', kisa: 'EUR', sinif: 'Memeli', ses: 'kanguru', sekil: 'kanguru', boy: 1.0, renk: '#5e4a3e', kutup: true, avustralya: true,
    hiz: 11, aktif: 'karma', kacis: 28, sesSik: 260, sesTuru: 'alarm',
    habitat: { x: AX - 110, y: -80, r: 55 }, grup: [1, 3], erkekOran: 0.4,
    tarif: 'Tıknaz, kaba tüylü, kayalık tepelerin kangurusu. Gündüzü kaya oyuklarının gölgesinde geçirir; çok az su içer, gerekirse suyunu yediği bitkilerden alır. Tehlikede tıslar.',
  },
  kayaValabisi: {
    ad: 'Sarı Ayaklı Kaya Valabisi', bilimsel: 'Petrogale xanthopus', kisa: 'KVL', sinif: 'Memeli', ses: 'kanguru', sekil: 'kanguru', boy: 0.6, renk: '#a8a098', kutup: true, avustralya: true,
    hiz: 10, aktif: 'karma', kacis: 25, sesSik: 300, sesTuru: 'alarm',
    habitat: { x: AX - 125, y: -70, r: 35 }, grup: [3, 7], erkekOran: 0.35,
    tarif: 'Gri sırtlı, beyaz yanak şeritli, ayakları ve uzun halkalı kuyruğu sarı-turuncu küçük bir valabi. Kaya yüzeylerinde inanılmaz sıçramalar yapar; yumuşak tabanlı ayakları kayayı kavrar. Tilkiler yüzünden bir zaman çok azaldı.',
  },
  bilbi: {
    ad: 'Bilbi', bilimsel: 'Macrotis lagotis', kisa: 'BLB', sinif: 'Memeli', ses: 'bilbi', sekil: 'tavsan', boy: 0.45, renk: '#a8a4a0', kutup: true, avustralya: true,
    hiz: 9, aktif: 'gece', kacis: 15, sesSik: 300, sesTuru: 'iletisim',
    habitat: { x: AX + 110, y: -130, r: 60 }, grup: [1, 2], erkekOran: 0.5,
    tarif: 'Tavşan kulaklı, sivri burunlu, ipeksi gri tüylü küçük bir keseli. Gündüzü kumda kazdığı iki metre derinliğe inen sarmal bir inde geçirir; gece toprağı eşeleyip tohum, böcek ve mantar arar. İstilacı tilki ve kediler yüzünden tehlikededir.',
  },
  kuol: {
    ad: 'Batı Kuolu', bilimsel: 'Dasyurus geoffroii', kisa: 'KUL', sinif: 'Memeli', ses: 'kuol', sekil: 'kurt', boy: 0.35, renk: '#6a4a32', kutup: true, avustralya: true,
    hiz: 10, aktif: 'gece', kacis: 18, yirtici: true, avlar: ['bilbi', 'avrupaTavsani'], sesSik: 300, sesTuru: 'bolge',
    habitat: { x: AX - 40, y: -40, r: 90 }, grup: [1, 1], erkekOran: 0.5,
    tarif: 'Kahverengi sırtında beyaz benekler olan kedi boyunda keseli bir yırtıcı. Gece böcek, kertenkele, kuş ve küçük memeli avlar, ağaca da tırmanır. Bir zaman bu bölgelerden silinmişti; koruma programlarıyla yeniden salındı.',
  },
  perentie: {
    ad: 'Perentie (Dev Varan)', bilimsel: 'Varanus giganteus', kisa: 'PRN', sinif: 'Sürüngen', ses: 'perentie', sekil: 'timsah', boy: 0.7, renk: '#6a5a3a', kutup: true, avustralya: true,
    hiz: 9, aktif: 'gunduz', kacis: 15, sesSik: 400, sesTuru: 'alarm',
    habitat: { x: AX - 120, y: -60, r: 50 }, grup: [1, 1], erkekOran: 0.5,
    tarif: 'Avustralya\'nın en büyük kertenkelesi; iki buçuk metreyi bulur. Kayalık tepelerde yaşar, sabah güneşlenip ısındıktan sonra geniş alanlarda ava çıkar: kertenkele, kuş, yumurta, leş. Tehlikede boğazını şişirip yüksek sesle tıslar, kuyruğunu kamçı gibi savurur.',
  },
  avTilkisi: {
    ad: 'Kızıl Tilki (İstilacı)', bilimsel: 'Vulpes vulpes', kisa: 'IST', sinif: 'Memeli', ses: 'kiziltilki', sekil: 'kurt', boy: 0.5, renk: '#c86a2a', kutup: true, avustralya: true, istilaci: true,
    hiz: 11, aktif: 'gece', kacis: 40, yirtici: true, avlar: ['bilbi', 'kayaValabisi', 'avrupaTavsani'], sesSik: 200, sesTuru: 'bolge',
    habitat: { x: AX + 60, y: -60, r: 120 }, grup: [1, 2], erkekOran: 0.5,
    tarif: 'İngiliz yerleşimciler 1800\'lerde av eğlencesi için getirdi. Bugün kıtanın büyük bölümüne yayılmış, bilbi ve kaya valabisi gibi küçük yerli hayvanların yok olmasının başlıca nedenlerinden biri. Dingonun olduğu yerlerde daha az görülür.',
  },
  yabaniDeve: {
    ad: 'Yabani Deve (İstilacı)', bilimsel: 'Camelus dromedarius', kisa: 'DVE', sinif: 'Memeli', ses: 'deve', sekil: 'deve', boy: 1.3, renk: '#b89464', kutup: true, avustralya: true, istilaci: true,
    hiz: 9, aktif: 'gunduz', kacis: 45, sesSik: 220, sesTuru: 'iletisim',
    habitat: { x: AX + 130, y: -120, r: 80 }, grup: [4, 9], erkekOran: 0.3,
    tarif: '1800\'lerde çölde yük taşımak için getirilen tek hörgüçlü develerin serbest kalan torunları. Bugün iç bölgelerde yüz binlercesi yaşıyor, dünyanın en büyük yabani deve sürüleri burada. Kurak dönemlerde su başlarını kurutup yerli bitkileri yiyerek zarar verirler.',
  },
  avrupaTavsani: {
    ad: 'Yaban Tavşanı (İstilacı)', bilimsel: 'Oryctolagus cuniculus', kisa: 'YTV', sinif: 'Memeli', ses: 'kutuptavsani', sekil: 'tavsan', boy: 0.35, renk: '#8a7a68', kutup: true, avustralya: true, istilaci: true,
    hiz: 10, aktif: 'karma', kacis: 15, sesSik: 400, sesTuru: 'alarm',
    habitat: { x: AX + 30, y: -20, r: 110 }, grup: [4, 9], erkekOran: 0.45,
    tarif: '1859\'da yirmi dört tavşanla başlayan istila, birkaç on yılda yüz milyonlara ulaştı. Toprakta derin yuva ağları kazar, otları ve fideleri kökünden yer; çölleşmeyi hızlandırır. Tilkilerin, dingoların ve kuolların kolay avıdır.',
  },
});
// Orta Hindistan ormanlarında (Kanha, Bandhavgarh) gerçekten yaşayan öbür büyük ve orta boy memeliler (15 Kasım 2026, Murat "orada gerçekten yaşayan tüm hayvanlar")
Object.assign(TURLER, {
  hintLeopari: {
    ad: 'Hint Leoparı', bilimsel: 'Panthera pardus fusca', kisa: 'HLP', sinif: 'Memeli', ses: 'hintleopari', sekil: 'kedi', boy: 0.95, renk: '#c8963c', kutup: true, hindistan: true,
    hiz: 12, aktif: 'gece', kacis: 40, tehlikeli: true, yirtici: true, avlar: ['cital', 'langur', 'muntjak', 'hintYabanDomuzu', 'dortBoynuzlu', 'rhesus'], sesSik: 220, sesTuru: 'bolge',
    habitat: { x: HX - 115, y: -120, r: 70 }, grup: [1, 1], erkekOran: 0.5,
    tarif: 'Kaplandan küçük, gül biçimli kara beneklerle örtülü güçlü bir kedi. Kaplanın bölgesinde ondan uzak durur; kayalık yaylalarda ve ormanın kenarında yaşar, gündüzü kayaların arasında ya da bir ağaç dalında geçirir. Geceleri testere sesini andıran hırıltılı bir çağrı çıkarır.',
  },
  tembelAyi: {
    ad: 'Tembel Ayı', bilimsel: 'Melursus ursinus', kisa: 'TAY', sinif: 'Memeli', ses: 'tembelayi', sekil: 'ayi', boy: 0.75, renk: '#1e1a18', kutup: true, hindistan: true,
    hiz: 7, aktif: 'gece', kacis: 35, tehlikeli: true, sesSik: 160, sesTuru: 'iletisim',
    habitat: { x: HX - 30, y: 130, r: 70 }, grup: [1, 2], erkekOran: 0.5,
    tarif: 'Uzun, dağınık siyah tüylü, göğsünde beyaz "V" lekesi olan bir ayı. Uzun pençeleriyle termit yuvalarını yarar, dudaklarını boru gibi uzatıp termitleri gürültüyle emer; mahua çiçeklerini ve meyveleri de çok sever. Anne yavrularını sırtında taşır. Ürkünce saldırabilir; ormanın en tehlikeli hayvanlarından sayılır.',
  },
  hintYabanKopegi: {
    ad: 'Hint Yaban Köpeği (Dhole)', bilimsel: 'Cuon alpinus', kisa: 'DHL', sinif: 'Memeli', ses: 'dhole', sekil: 'kurt', boy: 0.6, renk: '#b8582a', kutup: true, hindistan: true,
    hiz: 13, aktif: 'gunduz', kacis: 35, yirtici: true, avlar: ['cital', 'sambar', 'muntjak', 'hintYabanDomuzu', 'barasingha'], sesSik: 120, sesTuru: 'iletisim',
    habitat: { x: HX + 10, y: 10, r: 150 }, grup: [5, 10], erkekOran: 0.6,
    tarif: 'Kızıl tüylü, kara kuyruklu, kurttan küçük bir yaban köpeği. Kalabalık sürüler hâlinde gündüz avlanır; birbirleriyle ıslığa benzeyen seslerle haberleşir. Sürü, kendisinden çok büyük bir sambarı bile kovalayarak yorar ve yakalar. Nesli tehlikede.',
  },
  cizgiliSirtlan: {
    ad: 'Çizgili Sırtlan', bilimsel: 'Hyaena hyaena', kisa: 'CSR', sinif: 'Memeli', ses: 'cizgilisirtlan', sekil: 'sirtlan', boy: 0.75, renk: '#a89c84', kutup: true, hindistan: true,
    hiz: 8, aktif: 'gece', kacis: 40, yirtici: true, lesci: true, avlar: ['muntjak'], sesSik: 260, sesTuru: 'iletisim',
    habitat: { x: HX - 120, y: -60, r: 90 }, grup: [1, 1], erkekOran: 0.5,
    tarif: 'Gri-kum renkli, gövdesi koyu çizgili, sırtı boyunca dik bir yelesi olan bir sırtlan. Çoğunlukla yalnız ve gece gezer; kaplanların ve leoparların artıklarını, kemikleri bile güçlü çenesiyle kırıp yer. Korkunca yelesini kabartıp olduğundan iri görünür.',
  },
  altinCakal: {
    ad: 'Altın Çakal', bilimsel: 'Canis aureus', kisa: 'CKL', sinif: 'Memeli', ses: 'altincakal', sekil: 'kurt', boy: 0.5, renk: '#b8945c', kutup: true, hindistan: true,
    hiz: 11, aktif: 'karma', kacis: 35, yirtici: true, lesci: true, avlar: ['dortBoynuzlu', 'muntjak'], sesSik: 140, sesTuru: 'bolge',
    habitat: { x: HX + 40, y: -60, r: 120 }, grup: [2, 3], erkekOran: 0.5,
    tarif: 'Altın-sarı tüylü, kurttan küçük bir yaban köpeği. Çiftler hâlinde yaşar; kemirgen, kuş, meyve ve leş, ne bulursa yer. Alacakaranlıkta çiftler ve komşu aileler birlikte uzun, tiz ulumalar çıkarır.',
  },
  barasingha: {
    ad: 'Bataklık Geyiği (Barasingha)', bilimsel: 'Rucervus duvaucelii branderi', kisa: 'BRS', sinif: 'Memeli', ses: 'barasingha', sekil: 'geyik', boy: 1.05, renk: '#a8783a', kutup: true, hindistan: true,
    hiz: 11, aktif: 'karma', kacis: 35, sesSik: 200, sesTuru: 'iletisim',
    habitat: { x: HX + 30, y: -130, r: 60 }, grup: [8, 15], erkekOran: 0.35,
    tarif: '"On iki boynuzlu" anlamına gelen adını erkeğin çok dallı boynuzundan alır. Kanha\'nın sert zeminli çayırlarına uyum sağlamış bir alt türdür; bir zaman 66 bireye kadar azalmış, korumayla yeniden çoğalmıştır. Kış başında erkekler çayırda böğürerek dişiler için yarışır.',
  },
  nilgay: {
    ad: 'Nilgay (Mavi Boğa)', bilimsel: 'Boselaphus tragocamelus', kisa: 'NLG', sinif: 'Memeli', ses: 'nilgay', sekil: 'ceylan', boy: 1.4, renk: '#8a7a6a', kutup: true, hindistan: true,
    hiz: 11, aktif: 'gunduz', kacis: 45, sesSik: 220, sesTuru: 'alarm',
    habitat: { x: HX + 120, y: -60, r: 70 }, grup: [3, 8], erkekOran: 0.4,
    tarif: 'Asya\'nın en iri antilobu. Erkeği mavimsi gri, kısa boynuzlu ve boynunda bir püskül var; dişiler ve yavrular kahverengidir. Açık, kurak ormanlarda ve çayırların kenarında dolaşır, suya pek bağımlı değildir.',
  },
  muntjak: {
    ad: 'Havlayan Geyik (Muntjak)', bilimsel: 'Muntiacus vaginalis', kisa: 'MNT', sinif: 'Memeli', ses: 'muntjak', sekil: 'geyik', boy: 0.55, renk: '#a8602a', kutup: true, hindistan: true,
    hiz: 12, aktif: 'karma', kacis: 30, sesSik: 160, sesTuru: 'alarm',
    habitat: { x: HX + 60, y: 130, r: 70 }, grup: [1, 2], erkekOran: 0.5,
    tarif: 'Küçük, kızıl, yalnız yaşayan bir geyik. Erkeğin kısa boynuzlarının yanında köpek dişi gibi iki küçük sivri dişi var. Sık ormanın içinde yaşar; bir yırtıcı görünce köpek gibi uzun uzun havlar, adını da buradan alır.',
  },
  hintYabanDomuzu: {
    ad: 'Hint Yaban Domuzu', bilimsel: 'Sus scrofa cristatus', kisa: 'HYD', sinif: 'Memeli', ses: 'yabandomuzu', sekil: 'domuz', boy: 0.95, renk: '#3e3630', kutup: true, hindistan: true,
    hiz: 10, aktif: 'karma', kacis: 35, tehlikeli: true, sesSik: 140, sesTuru: 'iletisim',
    habitat: { x: HX - 40, y: 60, r: 100 }, grup: [4, 10], erkekOran: 0.3,
    tarif: 'Sırtı boyunca uzun kıllı bir yelesi olan yaban domuzu. Kalabalık gruplar hâlinde dolaşır, burnuyla toprağı sürer, kök ve yumru arar; çayırda ve göl kıyısında çamura yatar. Kaplanın ve yaban köpeklerinin sık avıdır.',
  },
  dortBoynuzlu: {
    ad: 'Dört Boynuzlu Antilop (Chousingha)', bilimsel: 'Tetracerus quadricornis', kisa: 'DBA', sinif: 'Memeli', ses: 'dortboynuzlu', sekil: 'ceylan', boy: 0.5, renk: '#a07040', kutup: true, hindistan: true,
    hiz: 12, aktif: 'karma', kacis: 30, sesSik: 260, sesTuru: 'alarm',
    habitat: { x: HX - 150, y: -40, r: 60 }, grup: [1, 2], erkekOran: 0.5,
    tarif: 'Dünyada dört boynuzlu tek yabani memeli: erkeğin iki kısa boynuzunun önünde iki küçük boynuz daha var. Küçük, ürkek ve yalnızdır; suya yakın, çalılık ve kayalık yamaçlarda saklanır.',
  },
  rhesus: {
    ad: 'Rhesus Makağı', bilimsel: 'Macaca mulatta', kisa: 'RHS', sinif: 'Memeli', ses: 'rhesus', sekil: 'dortayak', boy: 0.5, renk: '#a88a5c', kutup: true, hindistan: true,
    hiz: 7, aktif: 'gunduz', kacis: 20, sesSik: 90, sesTuru: 'iletisim',
    habitat: { x: HX + 50, y: 30, r: 60 }, grup: [8, 15], erkekOran: 0.3,
    tarif: 'Kısa kuyruklu, pembe yüzlü, kahverengi-gri bir maymun. Kalabalık, gürültülü ve sıkı bir sıralamaya sahip gruplar hâlinde yaşar; göl kıyısındaki ağaçlarda dolaşır, yerde de rahattır. Langurlardan daha çok yerde beslenir.',
  },
});
// ---------- Moğol bozkırı türleri (kutup: true harita altyapısı, mogol: true; habitatlar MOGOLISTAN merkezine göre) ----------
const MX = -6000;
const MY = 6000;
Object.assign(TURLER, {
  takhi: {
    ad: 'Przewalski Atı (Takhi)', bilimsel: 'Equus ferus przewalskii', kisa: 'TKH', sinif: 'Memeli', ses: 'takhi', sekil: 'zebra', boy: 0.95, renk: '#b88a52', kutup: true, mogol: true,
    hiz: 13, aktif: 'karma', kacis: 45, sesSik: 110, sesTuru: 'iletisim',
    habitat: { x: MX + 20, y: MY + 10, r: 110 }, grup: [6, 10], erkekOran: 0.25,
    tarif: 'Yeryüzünde kalan tek gerçek yaban atı. Kısa ve tıknaz, kum renginde; yelesi dik, bacakları dizden aşağı koyu. Doğada tükenmişti; hayvanat bahçelerinde yaşayan son bireylerden üretilip 1990\'larda bu bozkıra geri bırakıldı. Bir aygır, birkaç kısrak ve taylardan oluşan haremler hâlinde yaşar.',
  },
  karLeopari: {
    ad: 'Kar Leoparı', bilimsel: 'Panthera uncia', kisa: 'KLP', sinif: 'Memeli', ses: 'karleopari', sekil: 'kedi', boy: 0.95, renk: '#c8c4b8', kutup: true, mogol: true,
    hiz: 13, aktif: 'karma', kacis: 60, yirtici: true, avlar: ['argali', 'dzeren', 'dagKecisi'], sesSik: 220, sesTuru: 'bolge',
    habitat: { x: MX - 125, y: MY + 115, r: 55 }, grup: [1, 1], erkekOran: 0.5,
    tarif: '"Dağların hayaleti": dumanlı gri, koyu halka benekli tüyleri kayalarla neredeyse aynı renkte. Kalın, gövdesi kadar uzun kuyruğunu denge için kullanır, uyurken burnuna sarar. Kükreyemez; çok ürkek ve yalnızdır, dağ keçilerini ve yaban koyunlarını yamaçtan atlayarak yakalar.',
  },
  saiga: {
    ad: 'Saiga Antilobu', bilimsel: 'Saiga tatarica mongolica', kisa: 'SAG', sinif: 'Memeli', ses: 'saiga', sekil: 'ceylan', boy: 0.85, renk: '#c8a878', kutup: true, mogol: true,
    hiz: 14, aktif: 'gunduz', kacis: 55, sesSik: 160, sesTuru: 'alarm',
    habitat: { x: MX + 110, y: MY - 90, r: 90 }, grup: [8, 14], erkekOran: 0.3,
    tarif: 'Hortum gibi sarkık, şişkin burnu olan tuhaf görünüşlü bir antilop. Burnu yazın tozu süzer, kışın soğuk havayı ısıtır. Erkeklerin balmumu renginde kısa boynuzları vardır. Çok hızlı koşar; dişiler ilkbaharda aynı günlerde topluca doğurur.',
  },
  mogolKurdu: {
    ad: 'Moğol Kurdu', bilimsel: 'Canis lupus chanco', kisa: 'MKR', sinif: 'Memeli', ses: 'mogolkurdu', sekil: 'kurt', boy: 0.85, renk: '#a8987a', kutup: true, mogol: true,
    hiz: 13, aktif: 'karma', kacis: 55, yirtici: true, avlar: ['dzeren', 'saiga', 'takhi', 'argali', 'kizilGeyik', 'karaca', 'kulan', 'yabanDomuzu'], sesSik: 100, sesTuru: 'bolge',
    habitat: { x: MX - 40, y: MY - 40, r: 140 }, grup: [3, 5], erkekOran: 0.5,
    tarif: 'Bozkırın kurdu: açık kahverengi-gri, kışın kalın tüylü. Sürüyle ceylanları ve antilopları kilometrelerce kovalar, zayıf ve yaşlı olanı ayırır. Göçebe çobanların hikâyelerinde hem korkulan hem saygı duyulan hayvandır.',
  },
  dzeren: {
    ad: 'Moğol Ceylanı (Dzeren)', bilimsel: 'Procapra gutturosa', kisa: 'DZR', sinif: 'Memeli', ses: 'dzeren', sekil: 'ceylan', boy: 0.8, renk: '#d0ae7a', kutup: true, mogol: true,
    hiz: 15, aktif: 'gunduz', kacis: 60, sesSik: 160, sesTuru: 'alarm',
    habitat: { x: MX + 60, y: MY + 40, r: 120 }, grup: [10, 16], erkekOran: 0.35,
    tarif: 'Bozkırda on binlerce bireylik sürüler hâlinde göç eden açık sarı bir ceylan; arkasında beyaz bir kuyruk lekesi var. Saatte 60 kilometreyi aşan hızıyla kurtlardan kaçar. Erkeklerin boğazı kur döneminde guatr gibi şişer.',
  },
  argali: {
    ad: 'Argali (Yaban Koyunu)', bilimsel: 'Ovis ammon', kisa: 'ARG', sinif: 'Memeli', ses: 'argali', sekil: 'ceylan', boy: 1.15, renk: '#8a6a4a', kutup: true, mogol: true,
    hiz: 11, aktif: 'gunduz', kacis: 55, sesSik: 200, sesTuru: 'iletisim',
    habitat: { x: MX - 110, y: MY + 95, r: 60 }, grup: [4, 8], erkekOran: 0.4,
    tarif: 'Dünyanın en iri yaban koyunu. Erkeklerin kocaman, sarmal kıvrık boynuzları tek başına 20 kilogramı bulur. Kayalık yamaçlarda yaşar; sonbaharda erkekler şaha kalkıp boynuzlarını çarpıştırarak dövüşür, sesi vadide yankılanır.',
  },
  // Hustai'de ve Moğol bozkırında yaşayan öbür büyük ve orta boy memeliler (15 Kasım 2026, Murat "orada gerçekten yaşayan tüm hayvanlar")
  kizilGeyik: {
    ad: 'Kızıl Geyik (Maral)', bilimsel: 'Cervus canadensis sibiricus', kisa: 'KGY', sinif: 'Memeli', ses: 'kizilgeyik', sekil: 'geyik', boy: 1.2, renk: '#8a5a38', kutup: true, mogol: true,
    hiz: 11, aktif: 'karma', kacis: 55, sesSik: 200, sesTuru: 'iletisim',
    habitat: { x: MX + 40, y: MY + 150, r: 50 }, grup: [4, 8], erkekOran: 0.35,
    tarif: 'Kuzey vadilerindeki huş ormanlarında yaşayan iri bir geyik. Erkeklerin dallı, iri boynuzları her yıl düşüp yeniden çıkar. Sonbaharda erkekler derin böğürmelerle dişileri toplar; ses vadilerde kilometrelerce duyulur.',
  },
  karaca: {
    ad: 'Sibirya Karacası', bilimsel: 'Capreolus pygargus', kisa: 'KRC', sinif: 'Memeli', ses: 'karaca', sekil: 'geyik', boy: 0.7, renk: '#a8784a', kutup: true, mogol: true,
    hiz: 13, aktif: 'karma', kacis: 45, sesSik: 180, sesTuru: 'alarm',
    habitat: { x: MX + 20, y: MY + 140, r: 60 }, grup: [2, 4], erkekOran: 0.4,
    tarif: 'Küçük, zarif, kuyruksuz görünen bir geyik; arkasında beyaz bir leke var. Ormanla bozkırın birleştiği yerlerde yaşar. Ürkünce köpek gibi kısa, boğuk havlamalar çıkarır.',
  },
  yabanDomuzu: {
    ad: 'Yaban Domuzu', bilimsel: 'Sus scrofa', kisa: 'YDM', sinif: 'Memeli', ses: 'yabandomuzu', sekil: 'domuz', boy: 1.05, renk: '#4a3e34', kutup: true, mogol: true,
    hiz: 10, aktif: 'gece', kacis: 40, tehlikeli: true, sesSik: 120, sesTuru: 'iletisim',
    habitat: { x: MX + 60, y: MY + 120, r: 70 }, grup: [3, 6], erkekOran: 0.3,
    tarif: 'Kalın kıllı, güçlü bir yaban domuzu. Dişiler yavrularıyla gruplar hâlinde gezer, erkekler yalnızdır. Geceleri burnuyla toprağı sürerek kök, yumru ve böcek arar. Yavrulu dişi ya da sıkışan erkek tehlikeli olabilir.',
  },
  vasak: {
    ad: 'Vaşak', bilimsel: 'Lynx lynx', kisa: 'VSK', sinif: 'Memeli', ses: 'vasak', sekil: 'kedi', boy: 0.75, renk: '#b89a72', kutup: true, mogol: true,
    hiz: 12, aktif: 'gece', kacis: 60, yirtici: true, avlar: ['karaca', 'dagKecisi'], sesSik: 240, sesTuru: 'bolge',
    habitat: { x: MX - 70, y: MY + 140, r: 60 }, grup: [1, 1], erkekOran: 0.5,
    tarif: 'Kulaklarının ucunda siyah püsküller, kısa kesik bir kuyruk ve uzun bacaklarıyla tanınan orta boy bir kedi. Kayalıklarla ormanın arasında yalnız yaşar; karacaları ve tavşanları pusudan yakalar. Çok gizlidir, çoğu zaman yalnızca izi görülür.',
  },
  kizilTilki: {
    ad: 'Kızıl Tilki', bilimsel: 'Vulpes vulpes', kisa: 'KTK', sinif: 'Memeli', ses: 'kiziltilki', sekil: 'kurt', boy: 0.5, renk: '#c86a2a', kutup: true, mogol: true,
    hiz: 11, aktif: 'karma', kacis: 35, sesSik: 140, sesTuru: 'iletisim',
    habitat: { x: MX + 10, y: MY - 20, r: 130 }, grup: [1, 2], erkekOran: 0.5,
    tarif: 'Kızıl kürklü, kuyruğunun ucu beyaz bir tilki. Bozkırda en çok fare ve tarbagan yavrusu avlar; otların altındaki fareyi sesinden bulup havaya sıçrayarak üstüne atlar.',
  },
  porsuk: {
    ad: 'Asya Porsuğu', bilimsel: 'Meles leucurus', kisa: 'PRS', sinif: 'Memeli', ses: 'porsuk', sekil: 'vombat', boy: 0.75, renk: '#8a8478', kutup: true, mogol: true,
    hiz: 6, aktif: 'gece', kacis: 25, sesSik: 160, sesTuru: 'iletisim',
    habitat: { x: MX - 30, y: MY + 30, r: 80 }, grup: [2, 3], erkekOran: 0.5,
    tarif: 'Yüzünde siyah-beyaz şeritler olan, tıknaz, güçlü pençeli bir hayvan. Aile hâlinde, derin ve çok girişli inlerde yaşar. Geceleri böcek, solucan, kök ve fare arar; kışın uzun süre ininde uyur.',
  },
  dagKecisi: {
    ad: 'Sibirya Dağ Keçisi', bilimsel: 'Capra sibirica', kisa: 'DKC', sinif: 'Memeli', ses: 'dagkecisi', sekil: 'ceylan', boy: 1.0, renk: '#9a8468', kutup: true, mogol: true,
    hiz: 10, aktif: 'gunduz', kacis: 55, sesSik: 200, sesTuru: 'alarm',
    habitat: { x: MX - 130, y: MY + 120, r: 50 }, grup: [4, 8], erkekOran: 0.4,
    tarif: 'Dik kayalıklarda şaşırtıcı ustalıkla tırmanan bir yaban keçisi. Erkeklerin geriye kıvrılan, boğumlu, bir metreyi aşan boynuzları ve sakalı vardır. Kar leoparının başlıca avıdır; tehlikede ıslığa benzer bir alarm verir.',
  },
  kulan: {
    ad: 'Kulan (Moğol Yaban Eşeği)', bilimsel: 'Equus hemionus hemionus', kisa: 'KLN', sinif: 'Memeli', ses: 'kulan', sekil: 'zebra', boy: 0.9, renk: '#c8a472', kutup: true, mogol: true,
    hiz: 14, aktif: 'gunduz', kacis: 60, sesSik: 160, sesTuru: 'iletisim',
    habitat: { x: MX + 140, y: MY - 110, r: 80 }, grup: [5, 9], erkekOran: 0.35,
    tarif: 'Gobi\'nin kumlu, kurak bozkırlarında yaşayan bir yaban eşeği; sırtı kum renginde, karnı beyaz. Çok dayanıklıdır, suyu kilometrelerce uzaktan bulur; kurak yazlarda kuru dere yataklarında su kuyusu kazar.',
  },
});
export const TUR_SIRASI = Object.keys(TURLER).filter((t) => !TURLER[t].kutup);
export const KUTUP_SIRASI = Object.keys(TURLER).filter((t) => TURLER[t].kutup && !TURLER[t].guney && !TURLER[t].avustralya && !TURLER[t].hindistan && !TURLER[t].mogol);
export const HINDISTAN_SIRASI = Object.keys(TURLER).filter((t) => TURLER[t].hindistan);
export const MOGOL_SIRASI = Object.keys(TURLER).filter((t) => TURLER[t].mogol);
export const AVUSTRALYA_SIRASI = Object.keys(TURLER).filter((t) => TURLER[t].avustralya);
export const ANTARKTIKA_SIRASI = Object.keys(TURLER).filter((t) => TURLER[t].guney);

export const KISILIKLER = {
  cesur: { ad: 'cesur', kacis: 0.7, alisma: 1.2 },
  urkek: { ad: 'ürkek', kacis: 1.3, alisma: 0.6 },
  merakli: { ad: 'meraklı', kacis: 0.85, alisma: 1.5 },
  sakin: { ad: 'sakin', kacis: 1.0, alisma: 1.0 },
};
export const EVRELER = { yavru: 'yavru', genc: 'genç', yetiskin: 'yetişkin', yasli: 'yaşlı' };

// Ekipman (başlangıç): menziller metre (karar 7: temel fotoğraf ve gözlem ekipmanı)
export const EKIPMAN = {
  durbunGunduz: 70,
  durbunGece: 22, // gece dürbünü yok; geceleri gözlem menzili kısalır
  kamera: 50,
  sesKayit: 60,
};

// Araçlar (karar 4, 24, 42): sınırsız yakıt, bakım yok. Garajda biri seçilir; sahada tek araç durur.
// kacis: araçtaki insana karşı kaçış çarpanı (yavaşken / hızlıyken), perde: motor sesinin perdesi, duzey: motor sesi düzeyi.
export const ARACLAR = {
  arazi: { ad: 'Arazi aracı', hiz: 13, geri: 4, don: 1.5, kacis: 0.45, kacisHizli: 0.85, perde: 1, duzey: 1, cam: 1.3,
    tarif: 'Kapalı kabinli dört çeker. Hayvanlar içindeki insanı pek fark etmez; tavan rafında kamp malzemesi taşır.' },
  atv: { ad: 'ATV', hiz: 16, geri: 4, don: 2.4, kacis: 0.6, kacisHizli: 0.95, perde: 1.18, duzey: 0.85, cam: 0.9,
    tarif: 'Dört tekerli arazi motosikleti. Arazi aracından hızlı ve çevik; dar yerlerden döner. Açık olduğu için hayvanlar seni daha kolay fark eder.' },
  motosiklet: { ad: 'Arazi motosikleti', hiz: 20, geri: 3, don: 2.8, kacis: 0.75, kacisHizli: 1.05, perde: 1.35, duzey: 0.8, cam: 0.7,
    tarif: 'En hızlı araç: uzak yerlere çabucak gidersin. Gürültülü ve açık; ürkek hayvanlar onu uzaktan duyar.' },
  kamyon: { ad: 'Araştırma kamyonu', hiz: 10, geri: 3, don: 1.1, kacis: 0.4, kacisHizli: 0.8, perde: 0.8, duzey: 1.15, cam: 1.6, lab: true,
    tarif: 'Yavaş ama arkasında mobil laboratuvar var: numuneleri kamyona teslim edersin, dronun kamyonda şarj olur. Hayvanlar onu en az fark eder.' },
};
export const ARAC = ARACLAR.arazi;
export const YURUME = { hiz: 4.2, don: 2.2 };
