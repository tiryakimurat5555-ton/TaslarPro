// ==== VAHŞİ YAŞAM: OYUN VERİSİ ====
// Afrika savanı test bölgesi, türler, davranışlar. Koordinat: x doğu, y kuzey (metre). Haritanın ortasında araştırma istasyonu.
// Tasarım brifi: 113 karar (Vahşi Yaşam Oyun Tasarım Dosyası). Bu sürüm Aşama 1-3: teknik temel, saha prototipi,
// ilk hayvan ve gözlem döngüsü.

export const YARICAP = 200; // haritanın yarıçapı
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
export const MAGARA = { x: -128, y: 64 };

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
];
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
};

// Hayvan sesinin anlamı (ses analizi, karar 49 ve 87)
export const SES_TURLERI = {
  iletisim: 'sürüyle iletişim',
  alarm: 'alarm çağrısı',
  bolge: 'bölge çağrısı',
  yavru: 'yavru çağrısı',
  tehdit: 'tehdit sesi',
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

export const TUR_SIRASI = Object.keys(TURLER);

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

export const ARAC = { ad: 'Arazi aracı', hiz: 13, geri: 4, don: 1.5 };
export const YURUME = { hiz: 4.2, don: 2.2 };
