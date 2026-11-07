// ==== OYUN VERİSİ ====
// Sınıflar, uluslar, ırklar, yetenekler, canavarlar, eşyalar ve görevler.
// Sayılar ilk öneridir; denge denemeleriyle ayarlanır.

export const SEVIYE_SINIRI = 30;

export const NITELIKLER = [
  { ad: 'guc', baslik: 'Güç', aciklama: 'Yakın dövüş hasarı' },
  { ad: 'ceviklik', baslik: 'Çeviklik', aciklama: 'İsabet, kaçınma, kritik vuruş, ok hasarı' },
  { ad: 'zeka', baslik: 'Zekâ', aciklama: 'Büyü hasarı ve en yüksek mana' },
  { ad: 'bilgelik', baslik: 'Bilgelik', aciklama: 'İyileştirme gücü ve mana yenilenmesi' },
  { ad: 'dayaniklilik', baslik: 'Dayanıklılık', aciklama: 'En yüksek can ve savunma' },
];

export const ULUSLAR = {
  gun: {
    ad: 'Gün Ulusu',
    aciklama: 'Ak sancaklı krallık. Boru ve çan sesleriyle bilinir.',
    irklar: ['insan', 'elf'],
    renk: '#e8c25a',
  },
  ay: {
    ad: 'Ay Ulusu',
    aciklama: 'Kara sancaklı boylar birliği. Davul ve kurt ulumasıyla bilinir.',
    irklar: ['ork', 'kurtkisi'],
    renk: '#7a8cff',
  },
};

export const IRKLAR = {
  insan: { ad: 'İnsan', aciklama: 'Dengeli ve dayanıklı. Artı 2 Dayanıklılık.', bonus: { dayaniklilik: 2 }, ten: '#e0b48c' },
  elf: { ad: 'Elf', aciklama: 'Çevik ve keskin gözlü. Artı 2 Çeviklik.', bonus: { ceviklik: 2 }, ten: '#f2dcc0' },
  ork: { ad: 'Ork', aciklama: 'İri ve güçlü. Artı 2 Güç.', bonus: { guc: 2 }, ten: '#6f9a55' },
  kurtkisi: { ad: 'Kurt kişi', aciklama: 'Doğayla bağlı, sezgileri güçlü. Artı 2 Bilgelik.', bonus: { bilgelik: 2 }, ten: '#8b7766' },
};

// menzil metre, bekleme saniye
export const SINIFLAR = {
  savasci: {
    ad: 'Savaşçı',
    aciklama: 'Ön safta durur, düşmanı üstüne çeker. Canı ve savunması yüksek, uzağa etkisiz.',
    ana: 'guc',
    bonus: { guc: 5, dayaniklilik: 3 },
    canCarpan: 12,
    menzil: 2.4,
    saldiriHizi: 1.6,
    silah: 'Kılıç',
    renk: '#c9cdd4',
  },
  okcu: {
    ad: 'Okçu',
    aciklama: 'Uzaktan ok atar, hızlıdır, kritik vurur. Düşman yakına gelince zayıflar.',
    ana: 'ceviklik',
    bonus: { ceviklik: 5, guc: 1, dayaniklilik: 2 },
    canCarpan: 8,
    menzil: 14,
    saldiriHizi: 1.4,
    silah: 'Yay',
    renk: '#7fae5b',
  },
  buyucu: {
    ad: 'Büyücü',
    aciklama: 'Uzaktan büyü yapar, en yüksek hasarı verir. Canı en düşük sınıftır.',
    ana: 'zeka',
    bonus: { zeka: 6, bilgelik: 2 },
    canCarpan: 6,
    menzil: 13,
    saldiriHizi: 1.8,
    silah: 'Asa',
    renk: '#6c7cf0',
  },
  rahip: {
    ad: 'Rahip',
    aciklama: 'İyileştirir, korur ve topuzla dövüşür. Tek başına yavaş öldürür ama zor ölür.',
    ana: 'bilgelik',
    bonus: { bilgelik: 5, dayaniklilik: 2, guc: 1 },
    canCarpan: 9,
    menzil: 2.4,
    saldiriHizi: 1.7,
    silah: 'Topuz',
    renk: '#f3e3a0',
  },
};

// tur: 'hasar' | 'alan' | 'iyiles' | 'etki' | 'coklu' | 'zaman' | 'sicra'
export const YETENEKLER = {
  savasci: [
    { id: 'gucluVurus', ad: 'Güçlü Vuruş', seviye: 1, mana: 10, bekleme: 5, tur: 'hasar', carpan: 1.7, aciklama: 'Hedefe sert bir darbe, normalin 1,7 katı hasar.' },
    { id: 'yarma', ad: 'Yarma', seviye: 4, mana: 18, bekleme: 8, tur: 'alan', carpan: 1.2, yaricap: 3.5, merkez: 'ben', aciklama: 'Çevrendeki 3,5 metredeki herkese vurur.' },
    { id: 'kalkanDuvari', ad: 'Kalkan Duvarı', seviye: 8, mana: 20, bekleme: 25, tur: 'etki', etki: { ad: 'kalkan', sure: 8, hasarAzalt: 0.5 }, aciklama: '8 saniye boyunca aldığın hasar yarıya iner.' },
    { id: 'savasNarasi', ad: 'Savaş Narası', seviye: 14, mana: 25, bekleme: 30, tur: 'etki', etki: { ad: 'nara', sure: 12, saldiriArt: 0.3 }, aciklama: '12 saniye boyunca saldırın yüzde 30 artar.' },
  ],
  okcu: [
    { id: 'nisanliAtis', ad: 'Nişanlı Atış', seviye: 1, mana: 12, bekleme: 6, tur: 'hasar', carpan: 2.0, aciklama: 'Dikkatli nişan, normalin 2 katı hasar.' },
    { id: 'cokluOk', ad: 'Çoklu Ok', seviye: 4, mana: 18, bekleme: 9, tur: 'coklu', carpan: 1.1, hedef: 3, aciklama: 'Hedefin ve yakınındaki 2 düşmana ok atar.' },
    { id: 'geriSicra', ad: 'Geri Sıçra', seviye: 8, mana: 10, bekleme: 12, tur: 'sicra', mesafe: 6, aciklama: 'Hedeften 6 metre geri sıçrarsın.' },
    { id: 'zehirliOk', ad: 'Zehirli Ok', seviye: 14, mana: 16, bekleme: 10, tur: 'zaman', carpan: 0.5, sure: 6, aciklama: '6 saniye boyunca her saniye zehir hasarı verir.' },
  ],
  buyucu: [
    { id: 'atesTopu', ad: 'Ateş Topu', seviye: 1, mana: 14, bekleme: 3, tur: 'hasar', carpan: 1.8, aciklama: 'Hedefe ateş topu fırlatır.' },
    { id: 'buzOku', ad: 'Buz Oku', seviye: 4, mana: 12, bekleme: 6, tur: 'hasar', carpan: 1.2, yavaslat: 4, aciklama: 'Hasar verir ve hedefi 4 saniye yavaşlatır.' },
    { id: 'alevYagmuru', ad: 'Alev Yağmuru', seviye: 8, mana: 30, bekleme: 12, tur: 'alan', carpan: 1.5, yaricap: 5, merkez: 'hedef', aciklama: 'Hedefin çevresindeki 5 metreye ateş yağdırır.' },
    { id: 'manaKalkani', ad: 'Mana Kalkanı', seviye: 14, mana: 20, bekleme: 30, tur: 'etki', etki: { ad: 'manaKalkani', sure: 10, hasarAzalt: 0.5, manadan: true }, aciklama: '10 saniye boyunca hasarın yarısını manan karşılar.' },
  ],
  rahip: [
    { id: 'iyilestir', ad: 'İyileştir', seviye: 1, mana: 18, bekleme: 6, tur: 'iyiles', oran: 0.35, aciklama: 'Canının yüzde 35’ini geri verir.' },
    { id: 'kutsalCekic', ad: 'Kutsal Çekiç', seviye: 4, mana: 12, bekleme: 5, tur: 'hasar', carpan: 1.6, aciklama: 'Hedefe ışıkla yüklü bir çekiç darbesi.' },
    { id: 'kutsalKalkan', ad: 'Kutsal Kalkan', seviye: 8, mana: 25, bekleme: 20, tur: 'etki', etki: { ad: 'kutsalKalkan', sure: 12, emme: 0.3 }, aciklama: 'En yüksek canının yüzde 30’u kadar hasarı emen kalkan.' },
    { id: 'arinmaIsigi', ad: 'Arınma Işığı', seviye: 14, mana: 28, bekleme: 14, tur: 'alan', carpan: 1.2, yaricap: 4, merkez: 'ben', iyilesOran: 0.1, aciklama: 'Çevrendeki düşmanları yakar, seni yüzde 10 iyileştirir.' },
  ],
};

// Canavarlar: seviye aralığı, bölge (köyden uzaklık, metre), görünüş
export const CANAVARLAR = {
  kurt: { efekt: 'kurt', ad: 'Kurt', seviye: [1, 3], bolge: [25, 72], renk: '#8a8f96', boy: 0.9, sekil: 'dortayak', hiz: 3.6, sayi: 14, ses: 'hırlıyor' },
  domuz: { efekt: 'domuz', ad: 'Yaban domuzu', seviye: [3, 6], bolge: [86, 109], renk: '#6b4a34', boy: 0.9, sekil: 'dortayak', hiz: 3.2, sayi: 12, ses: 'homurdanıyor' },
  goblin: { efekt: 'goblin', ad: 'Goblin', seviye: [5, 9], bolge: [115, 137], renk: '#5f8f3a', boy: 1.0, sekil: 'iki', hiz: 3.4, sayi: 14, ses: 'kıkırdıyor' },
  haydut: { efekt: 'insan', ad: 'Haydut', seviye: [8, 12], bolge: [143, 162], renk: '#7a3b3b', boy: 1.6, sekil: 'iki', hiz: 3.5, sayi: 12, ses: 'bağırıyor' },
  orkAkinci: { efekt: 'ork', ad: 'Ork akıncı', seviye: [11, 16], bolge: [168, 187], renk: '#3f6b2e', boy: 1.9, sekil: 'iki', hiz: 3.5, sayi: 12, ses: 'kükrüyor' },
  orumcek: { efekt: 'orumcek', ad: 'Dev örümcek', seviye: [15, 20], bolge: [193, 209], renk: '#2b2b33', boy: 1.1, sekil: 'orumcek', hiz: 3.8, sayi: 12, ses: 'tıkırdıyor' },
  golem: { efekt: 'golem', ad: 'Taş golem', seviye: [19, 24], bolge: [215, 232], renk: '#8d8a80', boy: 2.4, sekil: 'iki', hiz: 2.6, sayi: 10, ses: 'gürlüyor' },
  golge: { efekt: 'golge', ad: 'Gölge şövalye', seviye: [23, 28], bolge: [238, 255], renk: '#2e2440', boy: 2.0, sekil: 'iki', hiz: 3.6, sayi: 10, ses: 'fısıldıyor' },
  ejder: { efekt: 'ejder', ad: 'Bataklık ejderi', seviye: [30, 30], bolge: [268, 272], renk: '#3c6b5e', boy: 3.4, sekil: 'dortayak', hiz: 3.0, sayi: 1, ses: 'kükrüyor', patron: true },
};

export const DUNYA = { yaricap: 285, koyYaricap: 18, nehirIc: 76.5, nehirDis: 81.5, kopruYari: 2.8 };

// Bölgeler: köyden dışa doğru halkalar. Ejder Bataklığı yalnız kuzeyde (açı ±0,6 radyan).
// agac: ağaç sayısı, agacTur: cam (çam), mese (meşe), olu (ölü ağaç); kaya: kaya sayısı; sis: 0-1
export const BOLGELER = [
  { id: 'koy', ad: 'Akpınar Köyü', ic: 0, dis: 18, zemin: '#a88a5c', agac: 0, kaya: 0, sis: 0, canavar: null,
    tarif: 'Dört evli küçük bir köy. Ortada meydan ve kuyu var; Muhtar meydanın kuzeyinde, Tüccar batısında durur. Canavarlar köye giremez.' },
  { id: 'cayir', ad: 'Çayır Yamaçları', ic: 18, dis: 76.5, zemin: '#6f9e45', agac: 70, agacTur: 'cam', kaya: 25, sis: 0, canavar: 'kurt',
    tarif: 'Köyü saran açık, yeşil çayırlar. Seyrek çam ağaçları, bir çoban ağılı ve tepede bir gözetleme kulesi var. Kurtlar dolaşır, seviye 1 ile 3.' },
  { id: 'nehir', ad: 'Gümüş Çay', ic: 76.5, dis: 81.5, zemin: '#3d7fb8', agac: 0, kaya: 0, sis: 0, canavar: null,
    tarif: 'Köyü halka gibi saran bir çay. Yüzülmez; dört yolun üzerindeki dört köprüden geçilir. Suyun sesi yaklaştıkça duyulur.' },
  { id: 'mese', ad: 'Meşe Korusu', ic: 81.5, dis: 112, zemin: '#4c7a32', agac: 190, agacTur: 'mese', kaya: 15, sis: 0.1, canavar: 'domuz',
    tarif: 'Sık meşe ağaçlarıyla dolu gölgeli bir koru. Ortasında köyün kutsal saydığı Yaşlı Meşe durur. Yaban domuzları gezer, seviye 3 ile 6.' },
  { id: 'goblin', ad: 'Goblin Tepeleri', ic: 112, dis: 140, zemin: '#6b8a3c', agac: 60, agacTur: 'cam', kaya: 40, sis: 0.05, canavar: 'goblin',
    tarif: 'İnişli çıkışlı tepeler. Kuzeydoğuda goblinlerin çadırlı kampı var. Goblinler, seviye 5 ile 9.' },
  { id: 'haydut', ad: 'Haydut Geçidi', ic: 140, dis: 165, zemin: '#8a7a4a', agac: 45, agacTur: 'cam', kaya: 45, sis: 0.05, canavar: 'haydut',
    tarif: 'Eski ticaret yolunun geçtiği kuru, sarımsı topraklar. Batı yolunda yağmalanmış bir kervan, kuzeybatıda haydut kampı var. Haydutlar, seviye 8 ile 12.' },
  { id: 'kizil', ad: 'Kızıl Sınır', ic: 165, dis: 190, zemin: '#8a5a3c', agac: 25, agacTur: 'olu', kaya: 50, sis: 0.1, canavar: 'orkAkinci',
    tarif: 'Ork akınlarıyla kızıla dönmüş, yanık topraklar. Güneydoğuda kazıklarla çevrili ork savaş kampı var. Ork akıncılar, seviye 11 ile 16.' },
  { id: 'kayalik', ad: 'Örümcek Kayalıkları', ic: 190, dis: 212, zemin: '#7d7b74', agac: 10, agacTur: 'olu', kaya: 110, sis: 0.15, canavar: 'orumcek',
    tarif: 'Ağaçsız, kaya dolu gri bir arazi. Güneybatıda ağlarla örülü örümcek yuvası var. Dev örümcekler, seviye 15 ile 20.' },
  { id: 'harabe', ad: 'Golem Harabeleri', ic: 212, dis: 235, zemin: '#8f8a76', agac: 15, agacTur: 'cam', kaya: 60, sis: 0.2, canavar: 'golem',
    tarif: 'Eski bir krallığın yıkıntıları. Kuzeydoğuda sütunları ayakta kalmış kale harabesi var. Taş golemler, seviye 19 ile 24.' },
  { id: 'sisli', ad: 'Sisli Kıyı', ic: 235, dis: 258, zemin: '#4a5a48', agac: 70, agacTur: 'olu', kaya: 30, sis: 0.6, canavar: 'golge',
    tarif: 'Bataklığın kıyısında sisli, ölü ağaçlı bir bölge. Kuzeybatıda yarısı suya gömülmüş bir tapınak var. Gölge şövalyeler, seviye 23 ile 28.' },
  { id: 'bataklik', ad: 'Ejder Bataklığı', ic: 258, dis: 285, aci: 0.6, zemin: '#2f4a35', agac: 30, agacTur: 'olu', kaya: 20, sis: 0.85, canavar: 'ejder',
    tarif: 'Dünyanın kuzey ucundaki kara bataklık. En içinde Bataklık ejderinin yuvası var. Seviye 30, son düşman.' },
  { id: 'dag', ad: 'Sınır Dağları', ic: 258, dis: 285, zemin: '#6e6a62', agac: 20, agacTur: 'cam', kaya: 60, sis: 0.3, canavar: null,
    tarif: 'Dünyanın dış kenarı: kayalık, ıssız dağ etekleri. Ötesine geçilmez.' },
];

// Önemli yerler. Yaklaşınca keşfedilir, keşif deneyim verir. r: çarpışma yarıçapı (0 = içinden geçilir)
export const YERLER = [
  { id: 'kopruK', ad: 'Kuzey köprüsü', x: 0, y: 79, tur: 'kopru', r: 0, tarif: 'Gümüş Çay üzerinde, kuzey yolundaki taş köprü.' },
  { id: 'kopruD', ad: 'Doğu köprüsü', x: 79, y: 0, tur: 'kopru', r: 0, tarif: 'Gümüş Çay üzerinde, doğu yolundaki taş köprü.' },
  { id: 'kopruG', ad: 'Güney köprüsü', x: 0, y: -79, tur: 'kopru', r: 0, tarif: 'Gümüş Çay üzerinde, güney yolundaki taş köprü.' },
  { id: 'kopruB', ad: 'Batı köprüsü', x: -79, y: 0, tur: 'kopru', r: 0, tarif: 'Gümüş Çay üzerinde, batı yolundaki taş köprü.' },
  { id: 'kule', ad: 'Gözetleme kulesi', x: 32, y: 42, tur: 'kule', r: 2.2, tarif: 'Çayırın tepesinde, köyü kurtlara karşı gözleyen ahşap kule.' },
  { id: 'agil', ad: 'Çoban ağılı', x: -42, y: -34, tur: 'agil', r: 0, tarif: 'Çitle çevrili boş bir koyun ağılı. Kurtlar koyunları kaçırmış.' },
  { id: 'yasliMese', ad: 'Yaşlı Meşe', x: -62, y: -74, tur: 'yasliMese', r: 2.4, tarif: 'Meşe Korusunun ortasındaki dev, yüzyıllık ağaç.' },
  { id: 'goblinKamp', ad: 'Goblin kampı', x: 88, y: 88, tur: 'kamp', r: 0, renk: '#6b5a3a', tarif: 'Yamalı çadırlardan kurulmuş, çöplerle dolu goblin kampı.' },
  { id: 'kervan', ad: 'Yağmalanmış kervan', x: -152, y: 6, tur: 'kervan', r: 2.5, tarif: 'Batı yolunda devrilmiş arabalar ve dağılmış sandıklar.' },
  { id: 'haydutKamp', ad: 'Haydut kampı', x: -108, y: 104, tur: 'kamp', r: 0, renk: '#5a2e2e', tarif: 'Kızıl bezlerle örtülü çadırlar ve sönmüş bir kamp ateşi.' },
  { id: 'orkKamp', ad: 'Ork savaş kampı', x: 122, y: -128, tur: 'orkKamp', r: 0, tarif: 'Sivri kazıklarla çevrili, kara çadırlı ork kampı.' },
  { id: 'orumcekYuva', ad: 'Örümcek yuvası', x: -142, y: -142, tur: 'ag', r: 0, tarif: 'Kayaların arasına gerilmiş dev ağlar.' },
  { id: 'kale', ad: 'Kale harabesi', x: 168, y: 148, tur: 'harabe', r: 0, tarif: 'Yıkık duvarlar ve hâlâ ayakta duran sütunlar.' },
  { id: 'tapinak', ad: 'Batık tapınak', x: -150, y: 186, tur: 'tapinak', r: 3, tarif: 'Yarısı bataklığa gömülmüş eski bir tapınak.' },
  { id: 'yuva', ad: 'Ejder yuvası', x: 0, y: 274, tur: 'yuva', r: 0, tarif: 'Kemiklerle çevrili kara bir çukur. Bataklık ejderi burada yaşar.' },
];

export const NADIRLIK = [
  { ad: 'Sıradan', carpan: 1, ek: 0, renk: '#cfcfcf' },
  { ad: 'Büyülü', carpan: 1.15, ek: 1, renk: '#6fa8ff' },
  { ad: 'Nadir', carpan: 1.3, ek: 2, renk: '#f2c94c' },
];

export const YUVALAR = {
  silah: 'Silah',
  kask: 'Kask',
  zirh: 'Zırh',
  eldiven: 'Eldiven',
  cizme: 'Çizme',
};

// Sınıfa göre silah adları
export const SILAH_ADLARI = {
  savasci: ['Paslı kılıç', 'Demir kılıç', 'Çelik kılıç', 'Savaş baltası', 'Şövalye kılıcı'],
  okcu: ['Kısa yay', 'Av yayı', 'Uzun yay', 'Kompozit yay', 'Elf yayı'],
  buyucu: ['Çubuk asa', 'Meşe asa', 'Kristal asa', 'Ay asası', 'Kadim asa'],
  rahip: ['Tahta topuz', 'Demir topuz', 'Kutsal topuz', 'Işık topuzu', 'Başrahip topuzu'],
};
export const ZIRH_ADLARI = {
  kask: ['Deri başlık', 'Demir miğfer', 'Çelik miğfer'],
  zirh: ['Deri zırh', 'Zincir zırh', 'Plaka zırh'],
  eldiven: ['Deri eldiven', 'Zincir eldiven', 'Çelik eldiven'],
  cizme: ['Deri çizme', 'Demir çizme', 'Çelik çizme'],
};

export const ESYA_KATSAYI = { silah: 4, kask: 1.2, zirh: 2.4, eldiven: 0.9, cizme: 1 };

export const IKSIR = { ad: 'Can iksiri', fiyat: 15, oran: 0.4, bekleme: 10 };

export const GOREVLER = [
  { id: 'kurt', ad: 'Kurt sürüsü', veren: 'Muhtar', hedef: 'kurt', sayi: 5, xp: 300, altin: 30, metin: 'Kurtlar koyunlarımızı kapıyor. Köyü saran Çayır Yamaçlarındaki 5 kurdu avla.' },
  { id: 'domuz', ad: 'Tarla bekçisi', veren: 'Muhtar', hedef: 'domuz', sayi: 6, xp: 1800, altin: 60, metin: 'Yaban domuzları tarlaları eşeliyor. Gümüş Çayın ötesindeki Meşe Korusunda 6 tanesini avla.' },
  { id: 'goblin', ad: 'Goblin baskını', veren: 'Muhtar', hedef: 'goblin', sayi: 8, xp: 9000, altin: 120, metin: 'Goblin Tepelerindeki goblinler köye saldırmaya hazırlanıyor. 8 goblin avla.' },
  { id: 'haydut', ad: 'Yol kesenler', veren: 'Muhtar', hedef: 'haydut', sayi: 8, xp: 26000, altin: 200, metin: 'Haydut Geçidinde ticaret yolunu haydutlar kesti. 8 haydudu temizle.' },
  { id: 'ork', ad: 'Akıncı tehdidi', veren: 'Muhtar', hedef: 'orkAkinci', sayi: 10, xp: 70000, altin: 350, metin: 'Ork akıncıları Kızıl Sınırda toplanıyor. 10 tanesini durdur.' },
  { id: 'orumcek', ad: 'Ağların ardında', veren: 'Muhtar', hedef: 'orumcek', sayi: 10, xp: 140000, altin: 500, metin: 'Örümcek Kayalıklarında dev örümcekler yuva yaptı. 10 tanesini yok et.' },
  { id: 'golem', ad: 'Yürüyen taşlar', veren: 'Muhtar', hedef: 'golem', sayi: 10, xp: 260000, altin: 700, metin: 'Golem Harabelerinde eski büyüyle uyanan taş golemleri durdur. 10 tane.' },
  { id: 'golge', ad: 'Gölge yemini', veren: 'Muhtar', hedef: 'golge', sayi: 10, xp: 420000, altin: 1000, metin: 'Sisli Kıyıda gölge şövalyeler dolaşıyor. 10 tanesini yen.' },
  { id: 'ejder', ad: 'Bataklık ejderi', veren: 'Muhtar', hedef: 'ejder', sayi: 1, xp: 600000, altin: 3000, metin: 'Her şeyin kaynağı en kuzeydeki Ejder Bataklığında yaşayan ejder. Kuzey yolunu izle, onu yen ve krallığı kurtar.' },
];

export const PUSULA = ['kuzey', 'kuzeydoğu', 'doğu', 'güneydoğu', 'güney', 'güneybatı', 'batı', 'kuzeybatı'];
