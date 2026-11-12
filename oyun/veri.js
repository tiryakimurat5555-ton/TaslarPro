// ==== VAHŞİ TOPRAKLAR: OYUN VERİSİ ====
// Haritalar, hayvanlar, silahlar, zırhlar. Koordinat: x doğu, y kuzey; her harita merkezinde kamp.

export const SEVIYE_SINIRI = 30;
export const KAMP_YARICAP = 13; // hayvanlar kampa girmez
export const IKSIR = { ad: 'Şifa İksiri', fiyat: 25, iyilestir: 0.45, enCok: 10 };

// Hayvan türleri. sekil: 3B modelin biçimi. ses: oyunda hangi ses dosyası çalar (3B konumlu).
// can ve saldiri 1. seviyedeki değerdir; seviye arttıkça büyür. saldirgan: false ise sen saldırmadıkça saldırmaz.
export const HAYVANLAR = {
  tilki: { ad: 'Tilki', can: 34, saldiri: 5, hiz: 5.4, boy: 0.6, renk: '#c8642a', sekil: 'dortayak', ses: 'tilki', saldirgan: false, xp: 0.8 },
  kurt: { ad: 'Kurt', can: 52, saldiri: 7, hiz: 5.8, boy: 0.85, renk: '#6f6a64', sekil: 'dortayak', ses: 'kurt', saldirgan: true, xp: 1 },
  domuz: { ad: 'Yaban Domuzu', can: 70, saldiri: 8, hiz: 5.0, boy: 0.9, renk: '#4e3b2c', sekil: 'dortayak', ses: 'domuz', saldirgan: true, xp: 1.1 },
  bozAyi: { ad: 'Boz Ayı', can: 420, saldiri: 13, hiz: 4.6, boy: 1.7, renk: '#5a3b22', sekil: 'ayi', ses: 'ayi', saldirgan: true, patron: true, xp: 6 },

  akrep: { ad: 'Çöl Akrebi', can: 46, saldiri: 7, hiz: 4.2, boy: 0.8, renk: '#a0702c', sekil: 'akrep', ses: 'akrep', saldirgan: true, xp: 1 },
  cingirakli: { ad: 'Çıngıraklı Yılan', can: 40, saldiri: 9, hiz: 3.8, boy: 0.9, renk: '#b49a5a', sekil: 'yilan', ses: 'yilan', saldirgan: true, xp: 1.05 },
  sirtlan: { ad: 'Sırtlan', can: 58, saldiri: 8, hiz: 5.8, boy: 0.85, renk: '#9a8358', sekil: 'dortayak', ses: 'sirtlan', saldirgan: true, xp: 1.1 },
  devAkrep: { ad: 'Dev Kum Akrebi', can: 360, saldiri: 12, hiz: 4.0, boy: 2.2, renk: '#6b3f1a', sekil: 'akrep', ses: 'akrep', saldirgan: true, patron: true, xp: 6 },

  engerek: { ad: 'Bataklık Engereği', can: 42, saldiri: 9, hiz: 4.0, boy: 1.0, renk: '#3f5a2a', sekil: 'yilan', ses: 'yilan', saldirgan: true, xp: 1 },
  bataklikKurdu: { ad: 'Bataklık Kurdu', can: 52, saldiri: 8, hiz: 5.6, boy: 0.9, renk: '#3e4a3a', sekil: 'dortayak', ses: 'kurt', saldirgan: true, xp: 1 },
  timsah: { ad: 'Timsah', can: 80, saldiri: 9, hiz: 3.6, boy: 1.1, renk: '#3b4f2e', sekil: 'timsah', ses: 'timsah', saldirgan: true, xp: 1.25 },
  yasliTimsah: { ad: 'Yaşlı Timsah', can: 380, saldiri: 12, hiz: 3.8, boy: 1.9, renk: '#2c3a22', sekil: 'timsah', ses: 'timsah', saldirgan: true, patron: true, xp: 6 },

  karKurdu: { ad: 'Kar Kurdu', can: 52, saldiri: 8, hiz: 6.0, boy: 0.9, renk: '#d8dde2', sekil: 'dortayak', ses: 'kurt', saldirgan: true, xp: 1 },
  kartal: { ad: 'Kaya Kartalı', can: 40, saldiri: 9, hiz: 6.6, boy: 0.9, renk: '#5b4632', sekil: 'kus', ses: 'kartal', saldirgan: true, xp: 1.05 },
  leopar: { ad: 'Kar Leoparı', can: 58, saldiri: 10, hiz: 6.2, boy: 0.9, renk: '#cfc8b8', sekil: 'kedi', ses: 'leopar', saldirgan: true, xp: 1.2 },
  kutupAyisi: { ad: 'Kutup Ayısı', can: 400, saldiri: 13, hiz: 4.6, boy: 2.0, renk: '#eef1f4', sekil: 'ayi', ses: 'ayi', saldirgan: true, patron: true, xp: 6 },

  savanSirtlani: { ad: 'Benekli Sırtlan', can: 56, saldiri: 8, hiz: 6.0, boy: 0.9, renk: '#8f7a4f', sekil: 'dortayak', ses: 'sirtlan', saldirgan: true, xp: 1 },
  aslan: { ad: 'Aslan', can: 66, saldiri: 10, hiz: 6.0, boy: 1.1, renk: '#c9a050', sekil: 'kedi', ses: 'aslan', saldirgan: true, xp: 1.25 },
  gergedan: { ad: 'Gergedan', can: 100, saldiri: 9, hiz: 4.8, boy: 1.5, renk: '#7c7a76', sekil: 'gergedan', ses: 'gergedan', saldirgan: false, xp: 1.4 },
  aslanKral: { ad: 'Aslan Kral', can: 420, saldiri: 13, hiz: 5.4, boy: 1.7, renk: '#b3802e', sekil: 'kedi', ses: 'aslan', saldirgan: true, patron: true, xp: 7 },
};

// Haritalar: kampın dışında halkalar. Her hayvan kendi halkasında (metre) doğar; seviye halkada dışa doğru artar.
export const HARITALAR = [
  {
    id: 'orman',
    ad: 'Yeşil Orman',
    seviye: [1, 7],
    tarif: 'Çam ve meşelerle dolu sık bir orman. Tilkiler, kurt sürüleri ve yaban domuzları yaşar. Ormanın kuzey ucunda Boz Ayı dolaşır.',
    yaricap: 110,
    zemin: '#4f7a36',
    gok: '#9cc7e8',
    sis: [45, 120],
    agac: [{ tur: 'cam', sayi: 120 }, { tur: 'mese', sayi: 70 }],
    kaya: 30,
    ortam: 'ortam_orman',
    adim: 'adim1',
    hayvanlar: [
      { tur: 'tilki', sayi: 9, halka: [18, 60] },
      { tur: 'kurt', sayi: 10, halka: [45, 100] },
      { tur: 'domuz', sayi: 8, halka: [55, 105] },
    ],
    patron: { tur: 'bozAyi', seviye: 8, x: 0, y: 92 },
  },
  {
    id: 'col',
    ad: 'Kavurucu Çöl',
    seviye: [7, 13],
    tarif: 'Uçsuz bucaksız kum tepeleri ve kaktüsler. Akrepler, çıngıraklı yılanlar ve sırtlan sürüleri avlanır. Doğuda Dev Kum Akrebi saklanır.',
    yaricap: 110,
    zemin: '#d9b87a',
    gok: '#f0d9a8',
    sis: [40, 115],
    agac: [{ tur: 'kaktus', sayi: 70 }, { tur: 'olu', sayi: 18 }],
    kaya: 45,
    ortam: 'ortam_col',
    adim: 'adim2',
    hayvanlar: [
      { tur: 'akrep', sayi: 10, halka: [18, 70] },
      { tur: 'cingirakli', sayi: 9, halka: [35, 95] },
      { tur: 'sirtlan', sayi: 9, halka: [55, 105] },
    ],
    patron: { tur: 'devAkrep', seviye: 14, x: 92, y: 0 },
  },
  {
    id: 'bataklik',
    ad: 'Sisli Bataklık',
    seviye: [12, 18],
    tarif: 'Sisli, çamurlu bir bataklık; ölü ağaçlar ve sazlıklar. Engerekler, bataklık kurtları ve timsahlar pusuda bekler. Güneyde Yaşlı Timsah yaşar.',
    yaricap: 110,
    zemin: '#3f5236',
    gok: '#8a9688',
    sis: [16, 55],
    agac: [{ tur: 'olu', sayi: 90 }, { tur: 'saz', sayi: 70 }],
    kaya: 15,
    gol: 14,
    ortam: 'ortam_bataklik',
    adim: 'adim2',
    hayvanlar: [
      { tur: 'engerek', sayi: 10, halka: [18, 75] },
      { tur: 'bataklikKurdu', sayi: 9, halka: [35, 100] },
      { tur: 'timsah', sayi: 9, halka: [50, 105] },
    ],
    patron: { tur: 'yasliTimsah', seviye: 19, x: 0, y: -92 },
  },
  {
    id: 'dag',
    ad: 'Karlı Dağlar',
    seviye: [17, 24],
    tarif: 'Rüzgârın uğuldadığı karlı yamaçlar ve çam ağaçları. Kar kurtları, kaya kartalları ve kar leoparları avlanır. Batıdaki zirvede Kutup Ayısı yaşar.',
    yaricap: 110,
    zemin: '#e8edf1',
    gok: '#cfdbe6',
    sis: [30, 95],
    agac: [{ tur: 'karcam', sayi: 110 }],
    kaya: 60,
    ortam: 'ortam_dag',
    adim: 'adim1',
    hayvanlar: [
      { tur: 'karKurdu', sayi: 10, halka: [18, 75] },
      { tur: 'kartal', sayi: 8, halka: [35, 100] },
      { tur: 'leopar', sayi: 9, halka: [50, 105] },
    ],
    patron: { tur: 'kutupAyisi', seviye: 25, x: -92, y: 0 },
  },
  {
    id: 'savan',
    ad: 'Altın Savan',
    seviye: [22, 30],
    tarif: 'Uzun sarı otlar ve tek tük akasya ağaçları. Sırtlanlar, aslanlar ve gergedanlar burada yaşar. Kuzeydoğuda Aslan Kral hüküm sürer.',
    yaricap: 110,
    zemin: '#b89a4a',
    gok: '#f2d29a',
    sis: [45, 125],
    agac: [{ tur: 'akasya', sayi: 45 }],
    kaya: 25,
    ortam: 'ortam_savan',
    adim: 'adim1',
    hayvanlar: [
      { tur: 'savanSirtlani', sayi: 10, halka: [18, 75] },
      { tur: 'aslan', sayi: 9, halka: [40, 105] },
      { tur: 'gergedan', sayi: 7, halka: [30, 100] },
    ],
    patron: { tur: 'aslanKral', seviye: 30, x: 66, y: 66 },
  },
];

// Silahlar: basitten güçlüye. hiz = iki vuruş arası saniye, menzil metre.
export const SILAHLAR = [
  { id: 'sopa', ad: 'Sopa', seviye: 1, fiyat: 0, hasar: 9, hiz: 1.0, menzil: 2.0, ses: 'sopa', sekil: 'sopa' },
  { id: 'bicak', ad: 'Av Bıçağı', seviye: 2, fiyat: 60, hasar: 12, hiz: 0.75, menzil: 1.8, ses: 'bicak', sekil: 'bicak' },
  { id: 'kisaMizrak', ad: 'Kısa Mızrak', seviye: 5, fiyat: 220, hasar: 21, hiz: 1.1, menzil: 3.0, ses: 'mizrak', sekil: 'mizrak' },
  { id: 'avciYayi', ad: 'Avcı Yayı', seviye: 7, fiyat: 420, hasar: 19, hiz: 1.2, menzil: 14, ses: 'yay', sekil: 'yay' },
  { id: 'demirKilic', ad: 'Demir Kılıç', seviye: 10, fiyat: 850, hasar: 33, hiz: 1.0, menzil: 2.2, ses: 'kilic', sekil: 'kilic' },
  { id: 'savasBaltasi', ad: 'Savaş Baltası', seviye: 13, fiyat: 1500, hasar: 52, hiz: 1.4, menzil: 2.2, ses: 'balta', sekil: 'balta' },
  { id: 'uzunYay', ad: 'Uzun Yay', seviye: 16, fiyat: 2400, hasar: 44, hiz: 1.2, menzil: 18, ses: 'yay', sekil: 'yay' },
  { id: 'celikKilic', ad: 'Çelik Kılıç', seviye: 19, fiyat: 3600, hasar: 68, hiz: 0.95, menzil: 2.4, ses: 'kilic', sekil: 'kilic' },
  { id: 'uzunMizrak', ad: 'Uzun Mızrak', seviye: 22, fiyat: 5200, hasar: 88, hiz: 1.15, menzil: 3.4, ses: 'mizrak', sekil: 'mizrak' },
  { id: 'ejderBaltasi', ad: 'Ejder Baltası', seviye: 25, fiyat: 8000, hasar: 125, hiz: 1.35, menzil: 2.4, ses: 'balta', sekil: 'balta' },
  { id: 'efsaneYay', ad: 'Efsane Yay', seviye: 28, fiyat: 11000, hasar: 98, hiz: 1.05, menzil: 22, ses: 'yay', sekil: 'yay' },
];

export const ZIRHLAR = [
  { id: 'yok', ad: 'Zırh yok', seviye: 1, fiyat: 0, savunma: 0, can: 0 },
  { id: 'deriYelek', ad: 'Deri Yelek', seviye: 2, fiyat: 80, savunma: 4, can: 10 },
  { id: 'kalinPost', ad: 'Kalın Post', seviye: 6, fiyat: 350, savunma: 9, can: 30 },
  { id: 'pulluZirh', ad: 'Pullu Zırh', seviye: 12, fiyat: 1200, savunma: 16, can: 60 },
  { id: 'kemikZirh', ad: 'Kemik Zırh', seviye: 18, fiyat: 3000, savunma: 24, can: 100 },
  { id: 'ejderPulu', ad: 'Ejder Pulu Zırh', seviye: 25, fiyat: 7500, savunma: 34, can: 160 },
];

// Yetenekler (avcının): seviyeyle açılır
export const YETENEKLER = [
  { id: 'gucluVurus', ad: 'Güçlü Vuruş', seviye: 1, bekleme: 8, aciklama: 'Hedefe iki katından fazla hasar veren bir vuruş.' },
  { id: 'sargi', ad: 'Sargı', seviye: 4, bekleme: 35, aciklama: 'Yaralarını sararsın: canının üçte birini geri kazanırsın.' },
  { id: 'avciNidasi', ad: 'Avcı Nidası', seviye: 9, bekleme: 30, aciklama: 'Yakındaki hayvanları ürkütür: 8 saniye daha az hasar alırsın.' },
  { id: 'okYagmuru', ad: 'Kasırga', seviye: 15, bekleme: 20, aciklama: 'Silahını savurup çevrendeki bütün hayvanlara vurursun.' },
];
