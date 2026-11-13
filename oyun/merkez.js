// ==== VAHŞİ YAŞAM: ARAŞTIRMA MERKEZİ (brif Aşama 4) ====
// Saf mantık: bütçe ve dengeli ekonomi (karar 22, 62, 91), ekipman (89, 88), tesisler (21, 79, 80), personel (54, 81),
// basit araştırma ekranı ve analizler (45), hibe teklifleri ve dinamik görevler (61, 62, 90), mesajlar (82),
// kamera tuzakları (41, 93) ve GPS tasmaları (11, 84). Sayılar öneridir; Murat onaylamadı.
import { TURLER, TUR_SIRASI, DAVRANISLAR, ISTASYON, YARICAP, GOLET, nehirY, NEHIR_YARI } from './veri.js';
import * as M from './mantik.js';
import * as E from './ekosistem.js';
import * as K from './kesif.js';
import * as G from './genisleme.js';
import * as S from './su.js';
import { KUCUKLER } from './kucukler.js';

const lira = (n) => `${Math.round(n).toLocaleString('tr-TR')} lira`;
export const liraSozu = lira;

// ---------- Katalog ----------
export const EKIPMANLAR = {
  geceDurbunu: { ad: 'Gece görüş dürbünü', fiyat: 6000, itibar: 10, tarif: 'Geceleri 55 metreye kadar, alacakaranlıkta 65 metreye kadar görürsün.' },
  teleobjektif: { ad: 'Teleobjektif', fiyat: 5000, itibar: 15, tarif: 'Fotoğraf menzili 80 metreye çıkar, fotoğraflar daha net olur.' },
  parabolik: { ad: 'Parabolik mikrofon', fiyat: 4000, itibar: 15, arastirma: 'sesRepertuvari', tarif: 'Ses kaydı menzili 100 metreye çıkar.' },
  termal: { ad: 'Termal kamera', fiyat: 12000, itibar: 30, arastirma: 'geceAktivitesi', gerek: 'geceDurbunu', tarif: 'Gece 70 metreye kadar ısı izinden görürsün; gece fotoğrafları netleşir.' },
  tuzak: { ad: 'Kamera tuzağı', fiyat: 2500, adet: true, itibar: 20, arastirma: 'izlemeAgi', tarif: 'Kurduğun yerden geçen hayvanları gece gündüz kendiliğinden fotoğraflar.' },
  tasma: { ad: 'GPS tasması', fiyat: 4000, adet: true, itibar: 30, arastirma: 'hareketEkolojisi', tarif: 'Veterinerin tanımlı bir yetişkin hayvana takar; nerede olduğunu her an bilirsin.' },
  magaraTakimi: { ad: 'Mağara takımı', fiyat: 2500, itibar: 5, tarif: 'Kask, kafa lambası ve maske. Kayalığın kuzeyindeki mağaraya güvenle girersin.' },
  // Aşama 8 (karar 24, 41)
  kampTakimi: { ad: 'Saha kampı takımı', fiyat: 3000, itibar: 10, tarif: 'Çadır, gözlem saklanağı ve güneş paneli. Uzak bir yere kamp kurarsın: kamptayken hayvanlar seni daha az fark eder, orada dinlenir ve dronunu şarj edersin.' },
  tekne: { ad: 'Araştırma teknesi', fiyat: 7000, itibar: 15, tarif: 'İskeleye bağlı küçük kürekli tekne. Nehir boyunca su aygırlarını, timsahları ve kıyı kuşlarını sessizce, yakından izlersin.' },
  drone: { ad: 'Araştırma dronu', fiyat: 9000, itibar: 25, tarif: 'Baktığın yönde 110 metre öteye uçar, oradaki sürüleri sayar, leşleri ve tel tuzakları görür, hepsini ekosistem haritasına işler. Bataryası üç uçuşluk; istasyonda ya da kampta dolar. Alçaktan geçerken ürkek hayvanları ürkütebilir.' },
};

export const TESISLER = {
  konaklama: { ad: 'Personel konaklama binası', fiyat: 10000, itibar: 20, bakim: 150, tarif: 'Personel kapasitesi 2 kişiden 6 kişiye çıkar.' },
  kule: { ad: 'Gözlem kulesi', fiyat: 8000, itibar: 15, bakim: 80, tarif: 'İstasyondayken çevreyi 150 metreye kadar tarayabilirsin.' },
  gelismisLab: { ad: 'Gelişmiş laboratuvar', fiyat: 14000, itibar: 35, bakim: 200, tarif: 'Aynı anda iki analiz yapılır, analizler dörtte bir daha kısa sürer.' },
  klinik: { ad: 'Veteriner kliniği', fiyat: 18000, itibar: 45, bakim: 250, tarif: 'Veteriner işe alınabilir. Yaralı ve hasta hayvanlar sahada tedavi edilir.' },
  rehab: { ad: 'Rehabilitasyon alanı', fiyat: 12000, itibar: 40, bakim: 150, tesis: 'klinik', arastirma: 'hastalikEkolojisi', tarif: 'Ağır yaralı ya da yetim kalmış hayvanlar karantina, tedavi, beslenme ve doğaya uyum aşamalarından geçip doğaya geri bırakılır.' },
};

export const PERSONEL = {
  sahaArastirmacisi: { ad: 'Saha araştırmacısı', maas: 500, itibar: 10, tarif: 'Her gün istasyonun çevresinde bir hayvanı kendisi tanımlar.' },
  biyolog: { ad: 'Biyolog', maas: 600, itibar: 15, tarif: 'Analizler daha kısa sürer.' },
  fotografci: { ad: 'Fotoğrafçı', maas: 500, itibar: 20, tarif: 'Fotoğraflar daha kaliteli olur; fotoğraf satış gelirleri iki katına çıkar.' },
  teknisyen: { ad: 'Teknik personel', maas: 450, itibar: 25, tarif: 'Kurabileceğin kamera tuzağı sayısı 3 ten 6 ya çıkar.' },
  veteriner: { ad: 'Veteriner', maas: 700, itibar: 40, tesis: 'klinik', tarif: 'GPS tasması takar, yaralı ve hasta hayvanları tedavi eder, şarbonlu leşleri yok eder.' },
  botanikUzmani: { ad: 'Botanik uzmanı', maas: 550, itibar: 20, tarif: 'Bitki numunelerini yarı sürede inceler; her gün bir bitkinin mevsim evresini kendisi kaydeder.' },
};
const ADLAR = {
  sahaArastirmacisi: ['Juma Otieno', 'Neema Mwangi', 'Baraka Kiprop'],
  biyolog: ['Dr. Amani Wanjiru', 'Dr. Selin Aksoy', 'Dr. Daniel Mutua'],
  fotografci: ['Zawadi Achieng', 'Emre Kılıç', 'Lena Okoth'],
  teknisyen: ['Peter Kamau', 'Halima Njeri', 'Murat Yıldız'],
  veteriner: ['Dr. Grace Atieno', 'Dr. Kerem Doğan', 'Dr. Samuel Omondi'],
  botanikUzmani: ['Dr. Wanjiku Njoroge', 'Dr. Elif Sarı', 'Dr. Joseph Kibet'],
};

const sayi = (k, f) => TUR_SIRASI.filter(f).length;
const tanimli = (k, tur) => k.hayvanlar.filter((b) => b.no > 0 && (!tur || b.tur === tur)).length;
const davranisVar = (k, tur, dv) => !!(k.arsiv.turler[tur] && k.arsiv.turler[tur].davranislar.includes(dv));
const turDavranis = (k, tur) => (k.arsiv.turler[tur] ? k.arsiv.turler[tur].davranislar.length : 0);

// Basit araştırma ekranı (karar 45): veri toplanınca analiz başlar, bitince bilgi, fon ya da teknoloji açılır.
export const ARASTIRMALAR = [
  {
    id: 'izlemeAgi',
    ad: 'Savanda izleme ağı',
    kosulMetni: '8 tür keşfet',
    ilerleme: (k) => [Object.keys(k.arsiv.turler).length, 8],
    odul: { itibar: 8, fon: 2000, ac: 'tuzak' },
    sonuc: 'Türlerin dağılımı haritalandı. Kamera tuzakları artık satın alınabilir.',
  },
  {
    id: 'suruYapisi',
    ad: 'Zebra sürülerinin yapısı',
    kosulMetni: '4 zebra tanımla, zebralarda 3 davranış kaydet',
    ilerleme: (k) => [Math.min(4, tanimli(k, 'zebra')) + Math.min(3, turDavranis(k, 'zebra')), 7],
    odul: { itibar: 10, fon: 3000 },
    sonuc: 'Zebra ailelerinin bir aygır ve kısraklardan oluştuğu, yavruların annelerinin yanından ayrılmadığı belgelendi.',
  },
  {
    id: 'sesRepertuvari',
    ad: 'Savanın ses repertuvarı',
    kosulMetni: '5 türün sesini kaydet',
    ilerleme: (k) => [Object.values(k.arsiv.turler).filter((t) => t.sesKaydi).length, 5],
    odul: { itibar: 8, fon: 2000, ac: 'parabolik' },
    sonuc: 'Ses kütüphanesi kuruldu. Parabolik mikrofon artık satın alınabilir.',
  },
  {
    id: 'geceAktivitesi',
    ad: 'Gece aktivitesi',
    kosulMetni: 'Gece etkin 3 türü keşfet (aslan, leopar, sırtlan, su aygırı, piton)',
    ilerleme: (k) => [['aslan', 'leopar', 'sirtlan', 'suAygiri', 'piton'].filter((t) => k.arsiv.turler[t]).length, 3],
    odul: { itibar: 10, ac: 'termal' },
    sonuc: 'Gece hayvanlarının etkinlik saatleri çıkarıldı. Termal kamera artık satın alınabilir.',
  },
  {
    id: 'hareketEkolojisi',
    ad: 'Hareket ekolojisi',
    kosulMetni: '10 birey tanımla',
    ilerleme: (k) => [tanimli(k), 10],
    odul: { itibar: 10, fon: 3000, ac: 'tasma' },
    sonuc: 'Bireylerin kullandığı alanlar belirlendi. GPS tasması artık satın alınabilir; takmak için veteriner gerekir.',
  },
  {
    id: 'suKaynaklari',
    ad: 'Su kaynaklarının kullanımı',
    kosulMetni: '5 türde su içme davranışı kaydet',
    ilerleme: (k) => [TUR_SIRASI.filter((t) => davranisVar(k, t, 'suIciyor')).length, 5],
    odul: { itibar: 10, fon: 4000 },
    sonuc: 'Göletin ve nehrin hangi türlerce, günün hangi saatinde kullanıldığı ortaya çıktı.',
  },
  {
    id: 'yavruBakimi',
    ad: 'Yavru bakımı',
    kosulMetni: 'Emzirme ve yavru oyunu davranışlarını kaydet',
    ilerleme: (k) => [(TUR_SIRASI.some((t) => davranisVar(k, t, 'emziriyor')) ? 1 : 0) + (TUR_SIRASI.some((t) => davranisVar(k, t, 'oynuyor')) ? 1 : 0), 2],
    odul: { itibar: 10, fon: 4000 },
    sonuc: 'Annelerin yavru bakımı ve yavruların oyunla öğrenmesi belgelendi.',
  },
  {
    id: 'nehirEkolojisi',
    ad: 'Nehir ekolojisi',
    kosulMetni: 'Bir su aygırı, bir timsah ve bir balık kartalı tanımla',
    ilerleme: (k) => [['suAygiri', 'timsah', 'kartal'].filter((t) => tanimli(k, t) > 0).length, 3],
    odul: { itibar: 12, fon: 5000 },
    sonuc: 'Nehir kıyısındaki türlerin birbirini nasıl etkilediği incelendi.',
  },
  {
    id: 'avAvci',
    ad: 'Av ve avcı ilişkileri',
    kosulMetni: 'Bir avlanmaya tanık ol ve pusuya yatma davranışını kaydet',
    ilerleme: (k) => [(k.arsiv.olaylar.some((o) => o.metin.startsWith('Avlanma gözlendi')) ? 1 : 0) + (TUR_SIRASI.some((t) => davranisVar(k, t, 'pusuda')) ? 1 : 0), 2],
    odul: { itibar: 15, fon: 6000 },
    sonuc: 'Yırtıcıların av seçimi ve av sırasındaki taktikleri belgelendi.',
  },
  // Aşama 5: ekosistem araştırmaları
  {
    id: 'botanikEnvanter',
    ad: 'Savanın bitki envanteri',
    kosulMetni: '6 bitki türünü incele',
    ilerleme: (k) => [Object.keys(k.arsiv.bitkiler || {}).length, 6],
    odul: { itibar: 10, fon: 3000 },
    sonuc: 'Araştırma alanının başlıca bitkileri ve yaşadıkları yerler kayda geçti.',
  },
  {
    id: 'fenoloji',
    ad: 'Bitkilerin mevsim döngüsü',
    kosulMetni: '4 bitkiyi hem yağışlı hem kurak mevsimde incele',
    ilerleme: (k) => [Object.values(k.arsiv.bitkiler || {}).filter((b) => b.evreler.some((e) => e[0] === 'y') && b.evreler.some((e) => e[0] === 'k')).length, 4],
    odul: { itibar: 12, fon: 4000 },
    sonuc: 'Çiçeklenme, tohum ve yaprak dökümü zamanları yağmurlarla ilişkilendirildi.',
  },
  {
    id: 'suKalitesi',
    ad: 'Su kalitesi izleme',
    kosulMetni: '3 su numunesi analiz et, en az biri kurak mevsimde olsun',
    ilerleme: (k) => {
      const l = k.numuneler.filter((n) => n.tip === 'su' && n.durum === 'tamam');
      return [Math.min(3, l.length) + (l.some((n) => n.veri.mevsim === 'kurak') ? 1 : 0), 4];
    },
    odul: { itibar: 10, fon: 3000 },
    sonuc: 'Göletin kurak mevsimde çekilip ısınınca alg ve parazitle kirlendiği, yağmurlarla temizlendiği gösterildi.',
  },
  {
    id: 'hastalikEkolojisi',
    ad: 'Yaban hayatı hastalıkları',
    kosulMetni: '2 farklı hastalık teşhis et (numune ya da veteriner)',
    ilerleme: (k) => [new Set(((k.eko && k.eko.teshisler) || []).map((t) => t.hastalik)).size, 2],
    odul: { itibar: 15, fon: 5000, acTesis: 'rehab' },
    sonuc: 'Hastalıkların hangi türleri, hangi mevsimde etkilediği ortaya çıktı. Rehabilitasyon alanı artık kurulabilir.',
  },
  {
    id: 'gocTakibi',
    ad: 'Mevsimsel göç',
    kosulMetni: 'Göç eden bir sürüyü gözlemle ve göçten dönüşü kaydet',
    ilerleme: (k) => [(TUR_SIRASI.some((t) => davranisVar(k, t, 'gocEdiyor') || davranisVar(k, t, 'nehirGeciyor')) ? 1 : 0) + ((k.eko && k.eko.gocler.some((g) => g.olay === 'donus')) ? 1 : 0), 2],
    odul: { itibar: 20, fon: 8000 },
    sonuc: 'Göçmen sürülerin kurak mevsimde güneydeki otlaklara gidip yağmurlarla döndüğü, nehir geçişinin en tehlikeli an olduğu belgelendi.',
  },
  {
    id: 'yasamDongusu',
    ad: 'Yaşam döngüsü',
    kosulMetni: '2 doğuma tanık ol, tanımlı 2 bireyin ölüm ya da ayrılış kaydını tut',
    ilerleme: (k) => [
      Math.min(2, k.arsiv.olaylar.filter((o) => o.metin.includes('yavruladı')).length) +
        Math.min(2, Object.values(k.arsiv.bireyler).filter((b) => b.olum || b.ayrildi).length),
      4,
    ],
    odul: { itibar: 12, fon: 4000 },
    sonuc: 'Bireylerin doğumdan ölüme ve sürüden ayrılışa kadar yaşam öyküleri birbirine bağlandı.',
  },
  // Aşama 6
  {
    id: 'kucukCanlilar',
    ad: 'Savanın küçük canlıları',
    kosulMetni: '25 küçük canlı türü bul (kuş, böcek, sürüngen, kurbağa, balık, küçük memeli)',
    ilerleme: (k) => [K.kucukSayisi(k), 25],
    odul: { itibar: 15, fon: 5000 },
    sonuc: 'Böceklerden kuşlara savanın küçük canlılarının besin zincirindeki yerleri belgelendi: tozlaşma, leş temizliği, toprağın havalanması.',
  },
  {
    id: 'magaraEkosistemi',
    ad: 'Mağara ekosistemi',
    kosulMetni: 'Mağaranın 5 odasını keşfet ve 5 mağara canlısı bul',
    ilerleme: (k) => [
      Math.min(5, ((k.arsiv.magara && k.arsiv.magara.odalar) || []).length) + Math.min(5, Object.keys(k.arsiv.kucukler || {}).filter((id) => KUCUKLER[id] && KUCUKLER[id].yer.includes('magara')).length),
      10,
    ],
    odul: { itibar: 15, fon: 6000 },
    sonuc: 'Yarasaların guanosunun mağaradaki bütün yaşamın besin kaynağı olduğu, karanlığa uyum sağlamış canlıların gözlerinin küçüldüğü belgelendi.',
  },
  {
    id: 'yanginEkolojisi',
    ad: 'Yangın ekolojisi',
    kosulMetni: 'Bir savan yangınını yakından gözlemle ve yanmış alanda yeniden filizlenmeyi gör',
    ilerleme: (k) => [(k.eko && k.eko.yanginGoruldu ? 1 : 0) + (k.eko && k.eko.filizGoruldu ? 1 : 0), 2],
    odul: { itibar: 15, fon: 6000 },
    sonuc: 'Savan yangınlarının ölü otu temizleyip taze sürgünleri uyardığı, otçulların yanmış alanlara akın ettiği gösterildi.',
  },
  // Aşama 12: uzak araştırma alanları (karar 17)
  {
    id: 'tuzGolu',
    ad: 'Soda gölünün flamingoları',
    kosulMetni: 'Kızıl Tuz Gölü gezisinde 5 noktayı gez ve 4 canlı bul',
    ilerleme: (k) => [K.uzakIlerleme(k, 'tuzla'), 9],
    odul: { itibar: 15, fon: 6000 },
    sonuc: 'Küçük flamingoların yalnızca soda göllerindeki alglerle beslendiği ve yuvalarını yırtıcıların ulaşamadığı tuz adacıklarına kurduğu belgelendi. Gölün suyunu azaltacak her proje bu türü tehdit eder.',
  },
  {
    id: 'dagOrmani',
    ad: 'Dağ ormanının biyolojik çeşitliliği',
    kosulMetni: 'Bulutlu Dağ Ormanı gezisinde 5 noktayı gez ve 4 canlı bul',
    ilerleme: (k) => [K.uzakIlerleme(k, 'dag'), 9],
    odul: { itibar: 15, fon: 7000 },
    sonuc: 'Dağ ormanının savanın su kulesi olduğu gösterildi: sis yapraklarda yoğunlaşıp derelere, oradan savandaki nehre akıyor. Orman kesilirse kurak mevsimde nehir de kurur.',
  },
  {
    id: 'papirusBatakligi',
    ad: 'Papirüs bataklığının sırları',
    kosulMetni: 'Papirüs Bataklığı gezisinde 5 noktayı gez ve 4 canlı bul',
    ilerleme: (k) => [K.uzakIlerleme(k, 'bataklik'), 9],
    odul: { itibar: 18, fon: 8000 },
    sonuc: 'Papirüs bataklığının suyu süzen dev bir arıtma sistemi olduğu ve pabuç gagalı leylek gibi yalnızca burada yaşayan türlerin akciğerli balığa bağlı olduğu gösterildi.',
  },
  // Aşama 11: nehir ve gölet araştırmaları (karar 94, 99)
  {
    id: 'suAtlasi',
    ad: 'Nehir ve sulak alan atlası',
    kosulMetni: `${S.SU_NOKTALARI.length} su ölçüm noktasının her birini iki mevsimde de ölç (Doğa menüsü, Su araştırması)`,
    ilerleme: (k) => [S.olcumIlerleme(k), S.SU_NOKTALARI.length * 2],
    odul: { itibar: 15, fon: 6000 },
    sonuc: 'Kurak mevsimde göletin ısınıp oksijeninin düştüğü, nehrin geçitlerde serin ve oksijenli kaldığı belgelendi. Kuraklığın sonunda balıklar ve hayvanlar nehre sığınıyor.',
  },
  {
    id: 'gecisNoktalari',
    ad: 'Hayvan geçiş noktaları',
    kosulMetni: 'Nehir geçitlerinde 6 farklı türün geçişini say, 6 balık ya da kurbağa türü bul',
    ilerleme: (k) => [Math.min(6, S.gecisTurSayisi(k)) + Math.min(6, S.suCanlisiSayisi(k)), 12],
    odul: { itibar: 12, fon: 5000 },
    sonuc: 'Nehrin iki sığ geçidinin savanın can damarı olduğu gösterildi: otçullar da yırtıcılar da yalnızca buradan geçiyor, timsahlar da bunu biliyor. Geçitlerin korunması önerildi.',
  },
];
export const ANALIZ_DK = 8 * 60; // temel analiz süresi (oyun dakikası)

// ---------- Yardımcılar ----------
export const tesisVar = (k, id) => k.tesisler.includes(id);
export const personelKapasitesi = (k) => (tesisVar(k, 'konaklama') ? 6 : 2);
export const tuzakKapasitesi = (k) => (M.personelVar(k, 'teknisyen') ? 6 : 3);
export const analizKapasitesi = (k) => (tesisVar(k, 'gelismisLab') ? 2 : 1);
export function gunlukGider(k) {
  return Math.round(M.zorlukCarpani(k, 'ekonomi', [0.6, 1, 1.3]) * (300 + (k.koruma && k.koruma.devriye ? 200 : 0) + k.personel.reduce((s, p) => s + PERSONEL[p.rol].maas, 0) + k.tesisler.reduce((s, t) => s + TESISLER[t].bakim, 0)));
}
// İtibar arttıkça bilimsel kuruluşlar günlük destek verir (karar 61, 91)
// Aşama 10: "Bir tam yıl" başarısı uzun dönem ekoloji fonu olarak günde 400 lira ekler
export const gunlukDestek = (k) =>
  Math.round((Math.min(2500, Math.floor(k.itibar / 10) * 100) + (k.hikaye && k.hikaye.basarilar && k.hikaye.basarilar.yil ? 400 : 0)) * M.zorlukCarpani(k, 'ekonomi', [1.4, 1, 0.8]));
export const okunmamis = (k) => k.mesajlar.filter((m) => !m.okundu).length;

function kilitNedeni(k, oge) {
  if (oge.arastirma && !(k.arastirmalar[oge.arastirma] && k.arastirmalar[oge.arastirma].durum === 'tamam')) {
    const a = ARASTIRMALAR.find((x) => x.id === oge.arastirma);
    return `Önce "${a.ad}" araştırmasını tamamla`;
  }
  if (oge.gerek && !k.ekipman[oge.gerek]) return `Önce ${EKIPMANLAR[oge.gerek].ad.toLocaleLowerCase('tr-TR')} gerekir`;
  if (oge.tesis && !tesisVar(k, oge.tesis)) return `Önce ${TESISLER[oge.tesis].ad.toLocaleLowerCase('tr-TR')} kurulmalı`;
  if (k.itibar < oge.itibar) return `Bilimsel itibarın yetmiyor`;
  return null;
}

// ---------- Satın alma, kurma, işe alma ----------
export function ekipmanDurumu(k, id) {
  const e = EKIPMANLAR[id];
  if (!e.adet && k.ekipman[id]) return { sahip: true, metin: `${e.ad}: sende var` };
  const kilit = kilitNedeni(k, e);
  const stok = e.adet ? `, ${k.stok[id] || 0} stokta` : '';
  if (kilit) return { kilit, metin: `${e.ad}: kilitli. ${kilit}${stok}` };
  return { alinir: true, metin: `${e.ad}: ${lira(e.fiyat)}${stok}. Satın al` };
}
export function ekipmanAl(k, id) {
  const e = EKIPMANLAR[id];
  const dur = ekipmanDurumu(k, id);
  if (dur.sahip) return `${e.ad} zaten sende.`;
  if (dur.kilit) return `${dur.kilit}.`;
  if (k.butce < e.fiyat) return `Bütçe yetmiyor. ${lira(e.fiyat - k.butce)} daha gerekli.`;
  k.butce -= e.fiyat;
  if (e.adet) k.stok[id] = (k.stok[id] || 0) + 1;
  else k.ekipman[id] = true;
  return `${e.ad} alındı. Kalan bütçe ${lira(k.butce)}.`;
}
export function tesisDurumu(k, id) {
  const t = TESISLER[id];
  if (tesisVar(k, id)) return { sahip: true, metin: `${t.ad}: kuruldu. Günlük bakım ${lira(t.bakim)}` };
  const kilit = kilitNedeni(k, t);
  if (kilit) return { kilit, metin: `${t.ad}: kilitli. ${kilit}` };
  return { alinir: true, metin: `${t.ad}: ${lira(t.fiyat)}, günlük bakım ${lira(t.bakim)}. Kur` };
}
export function tesisKur(k, id) {
  const t = TESISLER[id];
  const dur = tesisDurumu(k, id);
  if (dur.sahip) return `${t.ad} zaten kurulu.`;
  if (dur.kilit) return `${dur.kilit}.`;
  if (k.butce < t.fiyat) return `Bütçe yetmiyor. ${lira(t.fiyat - k.butce)} daha gerekli.`;
  k.butce -= t.fiyat;
  k.tesisler.push(id);
  M.mesajEkle(k, `${t.ad} tamamlandı. ${t.tarif}`, 'bilgi');
  return `${t.ad} kuruldu. Kalan bütçe ${lira(k.butce)}.`;
}
export function personelDurumu(k, rol) {
  const p = PERSONEL[rol];
  const var1 = k.personel.find((x) => x.rol === rol);
  if (var1) return { sahip: true, metin: `${p.ad}: ${var1.ad}. Günlük maaş ${lira(p.maas)}. İşten çıkar` };
  const kilit = kilitNedeni(k, p);
  if (kilit) return { kilit, metin: `${p.ad}: kilitli. ${kilit}` };
  if (k.personel.length >= personelKapasitesi(k)) return { kilit: 'Kapasite dolu', metin: `${p.ad}: kapasite dolu. Konaklama binası kurmalısın` };
  return { alinir: true, metin: `${p.ad}: günlük maaş ${lira(p.maas)}. İşe al` };
}
export function personelIslem(k, rol, rng = Math.random) {
  const p = PERSONEL[rol];
  const i = k.personel.findIndex((x) => x.rol === rol);
  if (i >= 0) {
    const ad = k.personel[i].ad;
    k.personel.splice(i, 1);
    return `${ad} ile yollar ayrıldı.`;
  }
  const dur = personelDurumu(k, rol);
  if (dur.kilit) return `${dur.kilit}.`;
  const ad = ADLAR[rol][Math.floor(rng() * ADLAR[rol].length)];
  k.personel.push({ rol, ad, gun: M.gunNo(k.dk) });
  M.mesajEkle(k, `${ad} ekibe katıldı: ${p.ad.toLocaleLowerCase('tr-TR')}. ${p.tarif}`, 'bilgi');
  return `${ad} işe alındı. Günlük maaş ${lira(p.maas)}.`;
}

// ---------- Araştırmalar ----------
export function arastirmaDurumu(k, a) {
  const d = k.arastirmalar[a.id];
  const [v, h] = a.ilerleme(k);
  if (d && d.durum === 'tamam') return { tamam: true, metin: `${a.ad}: tamamlandı. ${a.sonuc}` };
  if (d && d.durum === 'analiz') {
    const kalan = Math.max(0, d.bitis - k.dk);
    return { analiz: true, metin: `${a.ad}: laboratuvarda analiz ediliyor, yaklaşık ${Math.ceil(kalan / 60)} saat kaldı` };
  }
  if (v >= h) return { hazir: true, metin: `${a.ad}: veriler hazır. Analizi başlat` };
  return { metin: `${a.ad}: ${a.kosulMetni}. İlerleme ${Math.min(v, h)} / ${h}` };
}
export function analizBaslat(k, id) {
  const a = ARASTIRMALAR.find((x) => x.id === id);
  const dur = arastirmaDurumu(k, a);
  if (!dur.hazir) return dur.metin + '.';
  const suren = ARASTIRMALAR.filter((x) => k.arastirmalar[x.id] && k.arastirmalar[x.id].durum === 'analiz').length;
  if (suren >= analizKapasitesi(k)) return 'Laboratuvar dolu; süren analiz bitince başlatabilirsin.';
  let sure = ANALIZ_DK * M.zorlukCarpani(k, 'arastirma', [0.5, 1, 1.5]);
  if (M.personelVar(k, 'biyolog')) sure *= 0.6;
  if (tesisVar(k, 'gelismisLab')) sure *= 0.75;
  k.arastirmalar[id] = { durum: 'analiz', bitis: k.dk + sure };
  return `${a.ad} analizi başladı. Yaklaşık ${Math.ceil(sure / 60)} saat sürecek.`;
}

// ---------- Hibe teklifleri (dinamik görevler) ----------
const KURUMLAR = ['Nairobi Üniversitesi', 'Afrika Yaban Hayatı Vakfı', 'Savan Ekolojisi Enstitüsü', 'Ulusal Doğa Koruma Fonu', 'Uluslararası Biyoçeşitlilik Ağı'];
function teklifUret(k, rng) {
  const turler = TUR_SIRASI.filter((t) => !['piton'].includes(t));
  const tur = turler[Math.floor(rng() * turler.length)];
  const t = TURLER[tur];
  const soz = M.SOZ[tur].toLocaleLowerCase('tr-TR');
  const secenek = [
    { tip: 'tanimla', tur, hedef: 2, metin: `${t.ad} türünden 2 yeni birey tanımla`, odul: 3000 },
    { tip: 'foto', tur, hedef: 2, metin: `${soz} için 2 iyi fotoğraf çek`, odul: 2500 },
    { tip: 'davranis', tur, hedef: 2, metin: `${soz} için 2 yeni davranış kaydet`, odul: 4000 },
    { tip: 'ses', tur, hedef: 1, metin: `${soz} sesini kaydet`, odul: 2000 },
    { tip: 'gece', hedef: 3, metin: 'Gece 3 fotoğraf çek', odul: 3500 },
    { tip: 'kesfet', hedef: 2, metin: '2 yeni tür keşfet', odul: 4500 },
    { tip: 'numune', hedef: 2, metin: '2 numuneyi laboratuvarda analiz et', odul: 3000 },
    { tip: 'bitki', hedef: 3, metin: '3 bitki türü incele', odul: 2500 },
  ];
  let s = secenek[Math.floor(rng() * secenek.length)];
  if (s.tip === 'kesfet' && Object.keys(k.arsiv.turler).length > TUR_SIRASI.length - 2) s = secenek[1];
  if (s.tip === 'ses' && k.arsiv.turler[tur] && k.arsiv.turler[tur].sesKaydi) s = secenek[0];
  if (s.tip === 'bitki' && Object.keys(k.arsiv.bitkiler || {}).length > E.BITKI_SIRASI.length - 3) s = secenek[6];
  const kurum = KURUMLAR[Math.floor(rng() * KURUMLAR.length)];
  return { id: k.sonrakiId++, kurum, ...s, durum: 'teklif', dk: k.dk };
}
function olcum(k, t) {
  switch (t.tip) {
    case 'tanimla':
      return tanimli(k, t.tur);
    case 'foto':
      return k.arsiv.fotolar.filter((f) => f.tur === t.tur && (f.kalite === 'iyi' || f.kalite === 'çok iyi')).length;
    case 'davranis':
      return turDavranis(k, t.tur);
    case 'ses':
      return k.arsiv.sesler.filter((x) => x.tur === t.tur).length;
    case 'gece':
      return k.arsiv.fotolar.filter((f) => M.geceMi(f.dk)).length;
    case 'kesfet':
      return Object.keys(k.arsiv.turler).length;
    case 'numune':
      return k.numuneler.filter((n) => n.durum === 'tamam').length;
    case 'bitki':
      return Object.keys(k.arsiv.bitkiler || {}).length;
    default:
      return 0;
  }
}
export function teklifIlerleme(k, t) {
  return Math.max(0, Math.min(t.hedef, olcum(k, t) - (t.baslangic || 0)));
}
export function teklifKabul(k, id) {
  const t = k.teklifler.find((x) => x.id === id);
  if (!t || t.durum !== 'teklif') return 'Bu teklif artık geçerli değil.';
  if (k.teklifler.filter((x) => x.durum === 'kabul').length >= 3) return 'Aynı anda en çok 3 görev yürütebilirsin.';
  t.durum = 'kabul';
  t.baslangic = olcum(k, t);
  return `Kabul edildi: ${t.metin}. Ödül ${lira(t.odul)}.`;
}
export function teklifReddet(k, id) {
  k.teklifler = k.teklifler.filter((x) => x.id !== id);
  return 'Teklif geri çevrildi.';
}
export const teklifMetni = (k, t) =>
  t.durum === 'teklif' ? `${t.kurum}: ${t.metin}. Ödül ${lira(t.odul)}` : `${t.kurum}: ${t.metin}. İlerleme ${teklifIlerleme(k, t)} / ${t.hedef}. Ödül ${lira(t.odul)}`;

// ---------- Kamera tuzakları ve GPS tasmaları ----------
export function tuzakKur(d) {
  const k = d.k;
  if (!k.stok.tuzak) return 'Stokta kamera tuzağı yok. Araştırma merkezinden satın alabilirsin.';
  if (k.tuzaklar.length >= tuzakKapasitesi(k)) return `En çok ${tuzakKapasitesi(k)} tuzak kurabilirsin. Önce birini topla.`;
  const o = d.oyuncu;
  if (Math.hypot(o.x - ISTASYON.x, o.y - ISTASYON.y) < ISTASYON.r + 4) return 'İstasyonun içine tuzak kurmanın anlamı yok; sahaya çık.';
  if (M.nehirdeMi(o.x, o.y)) return 'Suyun içine tuzak kurulmaz.';
  k.stok.tuzak -= 1;
  const t = { id: k.sonrakiId++, x: o.x, y: o.y, bolge: M.bolgeAdi(o.x, o.y), dk: k.dk, foto: 0, sonKontrol: k.dk, gunluk: {} };
  k.tuzaklar.push(t);
  return `Kamera tuzağı kuruldu: ${t.bolge}. Önünden geçen hayvanları fotoğraflayacak.`;
}
export function tuzakTopla(d, id) {
  const k = d.k;
  const t = k.tuzaklar.find((x) => x.id === id);
  if (!t) return 'Tuzak bulunamadı.';
  if (M.mesafe(d.oyuncu, t) > 8) return `Tuzağı toplamak için yanına gitmelisin: ${M.saatSozu(M.saatYonu(d.oyuncu, t))}, ${M.metreSozu(M.mesafe(d.oyuncu, t))}.`;
  k.tuzaklar = k.tuzaklar.filter((x) => x.id !== id);
  k.stok.tuzak += 1;
  return `Tuzak toplandı. Toplam ${t.foto} fotoğraf çekmişti.`;
}
export function tasmaTak(d) {
  const k = d.k;
  const b = M.gozlenen(d);
  if (!M.personelVar(k, 'veteriner')) return 'GPS tasmasını yalnızca veteriner takabilir. Önce veteriner kliniği kur ve veteriner işe al.';
  if (!k.stok.tasma) return 'Stokta GPS tasması yok.';
  if (!b) return 'Önce dürbünle tasma takılacak hayvanı gözlemle.';
  if (!M.taninmisMi(b)) return 'Tasma yalnızca tanımlanmış bir bireye takılır. Biraz daha izle.';
  if (b.evre === 'yavru') return 'Yavrulara tasma takılmaz.';
  if (TURLER[b.tur].kus || b.tur === 'piton' || b.tur === 'timsah') return 'Bu türe tasma takılamaz.';
  if (k.gpsli.includes(b.id)) return `${M.bireyAdi(b)} zaten tasmalı.`;
  if (M.mesafe(d.oyuncu, b) > 40) return 'Veteriner ekibin hayvana yaklaşabilmesi için 40 metre içinde olmalısın.';
  k.stok.tasma -= 1;
  k.gpsli.push(b.id);
  M.itibarEkle(d, 3);
  M.arsivOlay(d, `${M.bireyAdi(b)} hayvanına GPS tasması takıldı.`);
  return `Veteriner ekip ${M.bireyAdi(b)} hayvanını kısa süreli uyuttu ve GPS tasmasını taktı. Hayvan uyanıp sürüsüne döndü. Artık nerede olduğunu her an bilirsin.`;
}
export function gpsListesi(d) {
  return d.k.gpsli.map((id) => M.kayitliBirey(d, id)).filter(Boolean);
}
export function gpsTarifi(d, b) {
  if (b.olu) return `${M.bireyAdi(b)}: tasmadan sinyal gelmiyor`;
  if (b.disari === 'goc') {
    const gc = E.GOCMENLER[b.tur];
    const gun = Math.max(1, Math.round((d.k.dk - b.disariDk) / 1440));
    return `${M.bireyAdi(b)}: sürüsüyle göçte, araştırma alanının dışında${gc ? `, ${gc.yon} yönünde` : ''}, yaklaşık ${10 + gun * 12} kilometre uzakta`;
  }
  if (b.disari === 'ayrildi') return `${M.bireyAdi(b)}: bölgeden ayrıldı, sinyal çok uzaktan geliyor`;
  if (M.rehabdaMi(d.k, b)) return `${M.bireyAdi(b)}: rehabilitasyon alanında`;
  const dv = DAVRANISLAR[b.davranis];
  return `${M.bireyAdi(b)}: ${M.bolgeAdi(b.x, b.y)}, ${dv ? dv.fiil : ''}, ${M.saatSozu(M.saatYonu(d.oyuncu, b))}, ${M.metreSozu(M.mesafe(d.oyuncu, b))}`;
}
// İstasyondaki gözlem kulesinden geniş tarama
export function kuleTaramasi(d) {
  if (!tesisVar(d.k, 'kule')) return null;
  const o = d.oyuncu;
  if (Math.hypot(o.x - ISTASYON.x, o.y - ISTASYON.y) > ISTASYON.r + 6) return null;
  const gruplar = new Map();
  d.k.hayvanlar.forEach((b) => {
    if (b.olu || M.mesafe(o, b) > 150) return;
    const l = gruplar.get(b.grup) || [];
    l.push(b);
    gruplar.set(b.grup, l);
  });
  if (!gruplar.size) return 'Kuleden 150 metre içinde hayvan görünmüyor.';
  const p = [...gruplar.values()]
    .map((l) => l.sort((a, b) => M.mesafe(o, a) - M.mesafe(o, b)))
    .sort((a, b) => M.mesafe(o, a[0]) - M.mesafe(o, b[0]))
    .slice(0, 6)
    .map((l) => `${M.SOZ[l[0].tur]}${l.length > 1 ? `, ${l.length} birey` : ''}, ${M.bolgeAdi(l[0].x, l[0].y)}, ${M.saatSozu(M.saatYonu(o, l[0]))}, ${M.metreSozu(M.mesafe(o, l[0]))}`);
  return 'Gözlem kulesinden: ' + p.join('. ') + '.';
}

// ---------- Döngü ----------
// Her karede App ve bot testinden çağrılır; d.k üzerinde çalışır.
export function guncelle(d) {
  const k = d.k;
  if (!k.merkezGun) k.merkezGun = M.gunNo(k.dk);
  // Analizler
  ARASTIRMALAR.forEach((a) => {
    const s = k.arastirmalar[a.id];
    if (s && s.durum === 'analiz' && k.dk >= s.bitis) {
      s.durum = 'tamam';
      const o = a.odul;
      if (o.itibar) k.itibar += o.itibar;
      if (o.fon) k.butce += o.fon;
      if (o.acTesis) M.mesajEkle(k, `${TESISLER[o.acTesis].ad} artık kurulabilir.`, 'bilgi');
      const ek = o.fon ? ` Araştırmayı destekleyen kurumlardan ${lira(o.fon)} fon geldi.` : '';
      M.mesajEkle(k, `Analiz tamamlandı: ${a.ad}. ${a.sonuc}${ek}`, 'sonuc');
      M.arsivOlay(d, `Araştırma tamamlandı: ${a.ad}.`);
      M.olay(d, 'analizBitti', `Analiz tamamlandı: ${a.ad}. ${a.sonuc}${ek}`, 3);
    }
  });
  // Görevler: tamamlananlar ödenir
  k.teklifler.forEach((t) => {
    if (t.durum === 'kabul' && teklifIlerleme(k, t) >= t.hedef) {
      t.durum = 'tamam';
      k.butce += t.odul;
      k.itibar += 3;
      M.mesajEkle(k, `${t.kurum}: "${t.metin}" görevi tamamlandı. ${lira(t.odul)} hesabına yatırıldı.`, 'gelir');
      M.olay(d, 'gorevBitti', `Görev tamamlandı: ${t.metin}. ${t.kurum} ${lira(t.odul)} gönderdi.`, 3);
    }
  });
  k.teklifler = k.teklifler.filter((t) => t.durum !== 'tamam');
  laboratuvarGuncelle(d);
  // Aşama 6: kaçak avcı tuzakları, yarasa çıkışı, koruma projeleri, yangının tuzaklara etkisi
  K.kacakGuncelle(d);
  K.yarasaGuncelle(d);
  if (!d.korumaSayac || k.dk - d.korumaSayac > 30) {
    d.korumaSayac = k.dk;
    korumaDenetle(d);
  }
  if (k.eko && k.eko.yanan) {
    const yanan = k.tuzaklar.filter((t) => E.yangindaMi(k.eko, E.hucre(t.x, t.y)));
    if (yanan.length) {
      k.tuzaklar = k.tuzaklar.filter((t) => !yanan.includes(t));
      M.mesajEkle(k, `Yangın ${yanan.length} kamera tuzağını yaktı (${yanan.map((t) => t.bolge).join(', ')}).`, 'ekosistem');
    }
    if (!k.eko.filizGoruldu) {
      const h = E.hucre(d.oyuncu.x, d.oyuncu.y);
      if (h >= 0 && k.eko.yanik[h] && k.eko.ot[h] > 0.25) {
        k.eko.filizGoruldu = true;
        M.olay(d, 'yeniKucuk', 'Yanmış alanda kara toprağın arasından taze yeşil sürgünler fışkırıyor. Otçullar bu besleyici otlara akın ediyor.', 3);
        M.arsivOlay(d, 'Yangından sonra yeniden filizlenme gözlendi.');
      }
    }
  }
  // Kamera tuzakları: 20 oyun dakikasında bir yakından geçenleri fotoğraflar (gece kızılötesi)
  k.tuzaklar.forEach((t) => {
    if (k.dk - t.sonKontrol < 20) return;
    t.sonKontrol = k.dk;
    const gun = M.gunNo(k.dk);
    k.hayvanlar.forEach((b) => {
      if (b.olu || Math.abs(b.x - t.x) > 15 || Math.abs(b.y - t.y) > 15 || M.mesafe(b, t) > 15) return;
      // Yeni kurulan kameradan ilk gün çekinirler; alıştıkça önünden geçerler (karar 70)
      if (k.dk - t.dk < 1440 && (b.id + t.id + M.gunNo(k.dk)) % 2 === 0) return;
      const anahtar = `${gun}:${b.tur}`;
      if (t.gunluk[anahtar]) return;
      t.gunluk[anahtar] = true;
      t.foto += 1;
      const yeniTur = !k.arsiv.turler[b.tur];
      M.turKaydi(d, b.tur);
      k.arsiv.fotolar.unshift({ id: k.sonrakiId++, bireyId: b.id, kod: M.taninmisMi(b) ? M.kod(b) : null, tur: b.tur, davranis: b.davranis, bolge: t.bolge, dk: k.dk, kalite: 'iyi', kaynak: 'tuzak' });
      G.haritaIsle(k, k.gruplar.find((g) => g.id === b.grup), k.hayvanlar.filter((x) => x.grup === b.grup && !x.olu).length, 'kamera tuzağı');
      if (k.arsiv.fotolar.length > 300) k.arsiv.fotolar.length = 300;
      k.tuzakSayac = (k.tuzakSayac || 0) + 1;
      if (yeniTur) M.mesajEkle(k, `Kamera tuzağı (${t.bolge}) yeni bir tür yakaladı: ${TURLER[b.tur].ad}.`, 'bilgi');
    });
    // Eski günlerin kayıtlarını temizle
    Object.keys(t.gunluk).forEach((a) => {
      if (Number(a.split(':')[0]) < gun - 1) delete t.gunluk[a];
    });
  });
  // Yeni gün: giderler, destek, saha araştırmacısı, teklifler, tuzak raporu
  const gun = M.gunNo(k.dk);
  if (gun !== k.merkezGun) {
    k.merkezGun = gun;
    gunlukIslem(d);
  }
}

function gunlukIslem(d) {
  const k = d.k;
  const gider = gunlukGider(k);
  const destek = gunlukDestek(k);
  k.butce += destek - gider;
  let rapor = `Günlük hesap: ${lira(gider)} gider${destek ? `, bilimsel kuruluşlardan ${lira(destek)} destek` : ''}. Bütçe ${lira(k.butce)}.`;
  if (k.butce < 0) rapor += ' Bütçe eksiye düştü; yeni harcama yapamazsın. Görevleri tamamlayarak fon kazanabilirsin.';
  M.mesajEkle(k, rapor, 'hesap');
  if (k.tuzakSayac) {
    M.mesajEkle(k, `Kamera tuzakları dün ${k.tuzakSayac} fotoğraf çekti. Arşivde Fotoğraflar bölümünde.`, 'bilgi');
    k.tuzakSayac = 0;
  }
  // Saha araştırmacısı istasyon çevresinde bir hayvanı tanımlar
  if (M.personelVar(k, 'sahaArastirmacisi')) {
    const aday = k.hayvanlar.filter((b) => !b.olu && b.no === 0 && Math.hypot(b.x, b.y) < 110);
    if (aday.length) {
      const b = aday[Math.floor(d.rng() * aday.length)];
      k.sayac[b.tur] = (k.sayac[b.tur] || 0) + 1;
      b.no = k.sayac[b.tur];
      k.arsiv.bireyler[b.id] = { ilkDk: k.dk, gozlemSn: 0, sonDk: k.dk, sonBolge: M.bolgeAdi(b.x, b.y) };
      M.turKaydi(d, b.tur);
      const p = k.personel.find((x) => x.rol === 'sahaArastirmacisi');
      M.mesajEkle(k, `${p.ad} bir hayvanı tanımladı: ${M.bireyKunye(d, b)} Son görüldüğü yer ${M.bolgeAdi(b.x, b.y)}.`, 'bilgi');
    }
  }
  rehabGunluk(d);
  botanikGunluk(d);
  K.kacakGunluk(d);
  const sal = k.eko && k.eko.salgin;
  if (sal && sal.bilinen) M.mesajEkle(k, `Salgın takibi: ${E.HASTALIKLAR[sal.hastalik].ad}, ${M.gunNo(k.dk) - sal.basGun + 1}. gün, şimdiye kadar ${sal.vaka} vaka.`, 'ekosistem');
  // Yeni teklif (en çok 3 bekleyen)
  if (k.teklifler.filter((t) => t.durum === 'teklif').length < 3) {
    const t = teklifUret(k, d.rng);
    k.teklifler.push(t);
    M.mesajEkle(k, `Yeni teklif. ${teklifMetni(k, t)}. Kabul etmek için Araştırma merkezi, Görevler.`, 'teklif', { teklifId: t.id });
  }
  M.olay(d, 'mesaj', `${okunmamis(k)} okunmamış mesajın var.`, 2);
}

// İlk açılışta hoş geldin mesajı ve ilk teklif
export function baslat(d) {
  const k = d.k;
  K.kesifHazirla(k);
  if (k.merkezBasladi) return;
  k.merkezBasladi = true;
  k.merkezGun = M.gunNo(k.dk);
  M.mesajEkle(
    k,
    `Hoş geldin. İstasyonun ${lira(k.butce)} başlangıç bütçesiyle kuruldu. Günlük gider ${lira(gunlukGider(k))}. Gelir için kurumların görevlerini tamamla, araştırmalarını laboratuvarda analiz et; itibarın arttıkça bilimsel kuruluşlar her gün destek gönderir.`,
    'bilgi'
  );
  const t = teklifUret(k, d.rng);
  k.teklifler.push(t);
  M.mesajEkle(k, `Yeni teklif. ${teklifMetni(k, t)}.`, 'teklif', { teklifId: t.id });
}

// ==================== Aşama 5: numune, laboratuvar, botanik, veterinerlik, rehabilitasyon ====================
// Karar 57: sınırlı ve kontrollü numune (su, yaprak, tohum, dışkı, leş dokusu). Karar 28: teşhis, tedavi, salgın takibi.
// Karar 66: rehabilitasyon. Karar 11: müdahaleler hayvan refahına ve bilimsel etiğe bağlıdır.
export const NUMUNE_KUTUSU = 6;
export const NUMUNE_DK = 3 * 60;
const gunu = (k) => M.gunNo(k.dk);
const kucuk2 = (s) => s.toLocaleLowerCase('tr-TR');

function numuneEkle(d, numune, metin) {
  const k = d.k;
  if (k.numuneKutusu.length >= NUMUNE_KUTUSU) return `Numune kutun dolu (${NUMUNE_KUTUSU} numune). Önce istasyona dönüp laboratuvara teslim et.`;
  const tk = E.takvim(gunu(k));
  k.numuneKutusu.push({ id: k.sonrakiId++, dk: k.dk, gun: gunu(k), bolge: M.bolgeAdi(d.oyuncu.x, d.oyuncu.y), durum: 'kutuda', ...numune, veri: { mevsim: tk.mevsim, ...numune.veri } });
  return `${metin} Numune kutunda ${k.numuneKutusu.length} numune var; istasyona dönünce laboratuvara teslim edilir.`;
}
const ayniGunVar = (k, f) => [...k.numuneKutusu, ...k.numuneler].some((n) => n.gun === gunu(k) && f(n));

// Yakındaki su kaynağı
export function yakinSu(d) {
  const o = d.oyuncu;
  const mg = Math.hypot(o.x - GOLET.x, o.y - GOLET.y);
  if (E.goletKurudu(d.k.eko) && mg < GOLET.r + 5) return { ad: 'gölet', kurudu: true };
  if (!E.goletKurudu(d.k.eko) && mg < GOLET.su + 12) return { ad: 'gölet' };
  if (Math.abs(o.y - nehirY(o.x)) < NEHIR_YARI + 10) return { ad: 'nehir' };
  if (M.bolgeBul(o.x, o.y) === 'sulak') return { ad: 'sulak alan' };
  return null;
}
export function suNumunesi(d) {
  const k = d.k;
  const su = yakinSu(d);
  if (!su) return 'Yakında su yok. Gölete, nehre ya da sulak alana git.';
  if (su.kurudu) return 'Gölet kurumuş; numune alacak su kalmadı.';
  if (ayniGunVar(k, (n) => n.tip === 'su' && n.kaynak === su.ad)) return `Bugün ${su.ad} suyundan zaten numune aldın.`;
  const eko = k.eko;
  const kalite = su.ad === 'gölet' ? E.suKalitesi(eko) : su.ad === 'nehir' ? Math.min(1, 0.55 + eko.nehir * 0.4) : 0.7;
  const veri = { kalite, alg: su.ad === 'gölet' ? eko.alg : 0.05, parazit: kalite < 0.55, sarbon: !!(eko.salgin && eko.salgin.hastalik === 'sarbon' && su.ad === 'gölet') };
  return numuneEkle(d, { tip: 'su', kaynak: su.ad, veri }, `${M.BuyukHarf(su.ad)} suyundan steril şişeye numune aldın.`);
}
export function diskiNumunesi(d) {
  const k = d.k;
  const b = M.gozlenen(d);
  if (!b) return 'Önce numunesini alacağın hayvanı dürbünle gözlemle.';
  if (!M.taninmisMi(b)) return 'Dışkı numunesi tanımlanmış bir bireyden alınır; biraz daha izle.';
  if (M.mesafe(d.oyuncu, b) > 35) return `Hayvanın geçtiği yere yakın olmalısın; ${M.bireyAdi(b)} ${M.metreSozu(M.mesafe(d.oyuncu, b))} uzakta.`;
  if (d.gozlem && d.gozlem.sn < 8) return 'Dışkısını bırakmasını beklemek için hayvanı biraz daha izle.';
  if (ayniGunVar(k, (n) => n.tip === 'diski' && n.veri.bireyId === b.id)) return `Bugün ${M.bireyAdi(b)} için zaten numune aldın.`;
  const veri = { bireyId: b.id, kod: M.kod(b), tur: b.tur, hastalik: b.hastalik && ['parazit', 'sarbon'].includes(b.hastalik.id) ? b.hastalik.id : null, kondisyon: b.kondisyon };
  return numuneEkle(d, { tip: 'diski', veri }, `${M.BuyukHarf(M.bireyAdi(b))} uzaklaşınca bıraktığı dışkıdan eldivenle numune aldın. Hayvana dokunmadan sağlığı hakkında bilgi verir.`);
}
export function yakinLes(d, r = 10) {
  return d.k.lesler.filter((l) => l.kalan > 0.05 && M.mesafe(d.oyuncu, l) < r).sort((a, b) => M.mesafe(d.oyuncu, a) - M.mesafe(d.oyuncu, b))[0] || null;
}
export function lesNumunesi(d) {
  const k = d.k;
  const l = yakinLes(d);
  if (!l) return 'Yakında leş yok. Leşten numune almak için 10 metre içinde olmalısın.';
  if ([...k.numuneKutusu, ...k.numuneler].some((n) => n.tip === 'les' && n.veri.lesId === l.id)) return 'Bu leşten zaten numune aldın.';
  const yirtici = k.hayvanlar.some((b) => !b.olu && TURLER[b.tur].yirtici && M.mesafe(b, l) < 25);
  if (yirtici) return 'Leşin başında yırtıcılar var; yaklaşmak çok tehlikeli. Gitmelerini bekle.';
  const veri = { lesId: l.id, tur: l.tur, neden: l.neden || '', hastalik: l.hastalik };
  return numuneEkle(d, { tip: 'les', veri }, `Eldiven ve maske takarak ölü ${kucuk2(M.SOZ[l.tur])} leşinden doku numunesi aldın.`);
}

// ---------- Botanik ----------
export function cevredekiBitkiler(d) {
  return E.bolgedekiBitkiler(M.bolgeBul(d.oyuncu.x, d.oyuncu.y));
}
export function bitkiSatiri(d, id) {
  const b = E.BITKILER[id];
  const kayit = (d.k.arsiv.bitkiler || {})[id];
  const ev = E.bitkiEvresi(id, gunu(d.k), d.k.eko);
  if (!kayit) return `Tanımadığın bir ${b.bicim}. İncele`;
  return `${b.ad}: ${ev.metin}${kayit.analiz ? `, ${E.OZELLIK_ADI[b.ozellik]}` : ''}. İncele`;
}
export function bitkiIncele(d, id) {
  const k = d.k;
  if (!cevredekiBitkiler(d).includes(id)) return 'Bu bitki burada yetişmiyor.';
  const b = E.BITKILER[id];
  if (!k.arsiv.bitkiler) k.arsiv.bitkiler = {};
  const ev = E.bitkiEvresi(id, gunu(k), k.eko);
  const anahtar = `${ev.anahtar}`;
  let a = k.arsiv.bitkiler[id];
  if (!a) {
    a = k.arsiv.bitkiler[id] = { ilkDk: k.dk, ilkBolge: M.bolgeAdi(d.oyuncu.x, d.oyuncu.y), evreler: [anahtar], analiz: false };
    M.itibarEkle(d, 4);
    M.arsivOlay(d, `Yeni bitki kaydı: ${b.ad}.`);
    M.olay(d, 'yeniBitki', '', 0);
    return `Yeni bitki kaydı: ${b.ad}, bilimsel adı ${b.bilimsel}. ${b.tarif} Şu an ${ev.metin}.`;
  }
  if (!a.evreler.includes(anahtar)) {
    a.evreler.push(anahtar);
    M.itibarEkle(d, 2);
    M.olay(d, 'yeniBitki', '', 0);
    return `${b.ad} için yeni mevsim evresi kaydedildi: ${ev.metin}. ${a.evreler.length} farklı evrede gözlendi.`;
  }
  return `${b.ad}: ${ev.metin}. ${b.tarif}`;
}
export function bitkiNumunesi(d, id) {
  const k = d.k;
  const a = (k.arsiv.bitkiler || {})[id];
  if (!a) return 'Önce bitkiyi incele.';
  if (!cevredekiBitkiler(d).includes(id)) return 'Bu bitki burada yetişmiyor.';
  const ev = E.bitkiEvresi(id, gunu(k), k.eko);
  if ([...k.numuneKutusu, ...k.numuneler].some((n) => n.tip === 'bitki' && n.veri.bitki === id && n.veri.anahtar === ev.anahtar && n.veri.yil === E.takvim(gunu(k)).yil))
    return 'Bu bitkiden bu evrede zaten numune aldın.';
  const parca = ev.tohum ? 'tohum' : 'yaprak';
  return numuneEkle(d, { tip: 'bitki', veri: { bitki: id, parca, anahtar: ev.anahtar, yil: E.takvim(gunu(k)).yil } }, `${E.BITKILER[id].ad} bitkisinden ${parca} numunesi aldın; bitkiye zarar vermeden küçük bir parça.`);
}

// ---------- Laboratuvar ----------
export const numuneKapasitesi = (k) => (tesisVar(k, 'gelismisLab') ? 2 : 1);
export const numuneAdi = (n) =>
  n.tip === 'su' ? `${n.kaynak} suyu` : n.tip === 'diski' ? `${n.veri.kod || kucuk2(M.SOZ[n.veri.tur])} dışkısı` : n.tip === 'les' ? `${kucuk2(M.SOZ[n.veri.tur])} leşi dokusu` : `${kucuk2(E.BITKILER[n.veri.bitki].ad)} ${n.veri.parca}`;
export function numuneMetni(k, n) {
  const ad = `${M.BuyukHarf(numuneAdi(n))}, ${n.gun}. gün, ${n.bolge}`;
  if (n.durum === 'kutuda') return `${ad}: numune kutunda, istasyona götür`;
  if (n.durum === 'sira') return `${ad}: laboratuvarda sıra bekliyor`;
  if (n.durum === 'analiz') return `${ad}: analiz ediliyor, yaklaşık ${Math.max(1, Math.ceil((n.bitis - k.dk) / 60))} saat kaldı`;
  return `${ad}: ${n.sonuc}`;
}
function teshisKaydet(d, hastalik, tur, kaynak) {
  const k = d.k;
  k.eko.teshisler.unshift({ hastalik, tur, gun: gunu(k), kaynak });
  if (k.eko.teshisler.length > 40) k.eko.teshisler.length = 40;
  if (k.eko.salgin && k.eko.salgin.hastalik === hastalik && !k.eko.salgin.bilinen) {
    k.eko.salgin.bilinen = true;
    const h = E.HASTALIKLAR[hastalik];
    const m = `Salgın uyarısı: ${h.ad} doğrulandı. ${h.tarif} Şimdiye kadar ${k.eko.salgin.vaka} vaka tahmin ediliyor. Veterinerin şarbonlu leşleri yakarak yayılmayı yavaşlatabilir.`;
    M.mesajEkle(k, m, 'ekosistem');
    M.arsivOlay(d, `Salgın doğrulandı: ${h.ad}.`);
    M.olay(d, 'salgin', m, 4);
    M.itibarEkle(d, 6);
  }
}
function numuneSonucu(d, n) {
  const k = d.k;
  const v = n.veri;
  if (n.tip === 'su') {
    let m = `Su ${E.kaliteSozu(v.kalite)}.`;
    if (v.alg > 0.3) m += ' Mavi-yeşil alg (siyanobakteri) yoğun; bazı türleri hayvanlar için zehirli maddeler üretir.';
    m += v.parazit ? ' Parazit yumurtaları bulundu; bu sudan içen hayvanlar parazit kapabilir.' : ' Parazit yumurtası bulunmadı.';
    if (v.sarbon) {
      m += ' Suda şarbon bakterisi sporları bulundu!';
      teshisKaydet(d, 'sarbon', null, 'su');
    }
    return m;
  }
  if (n.tip === 'diski') {
    const b = M.kayitliBirey(d, v.bireyId);
    const ad = b ? M.BuyukHarf(M.bireyAdi(b)) : 'Hayvan';
    if (v.hastalik) {
      if (b && b.hastalik && b.hastalik.id === v.hastalik) b.teshis = v.hastalik;
      teshisKaydet(d, v.hastalik, v.tur, 'dışkı');
      const h = E.HASTALIKLAR[v.hastalik];
      return `${ad}: ${h.ad} teşhis edildi (${h.etken}). ${h.tedavi ? 'Veteriner tedavi edebilir.' : 'Tedavisi yok; leşleri yok edilerek yayılması yavaşlatılabilir.'}${G.dnaAnalizi(d, b)}`;
    }
    return `${ad}: parazit ya da hastalık bulgusu yok. Kondisyonu ${E.kondisyonSozu(v.kondisyon)}; beslenmesi ${v.kondisyon > 0.55 ? 'yeterli' : 'yetersiz, besin azlığı var'}.${G.dnaAnalizi(d, b)}`;
  }
  if (n.tip === 'les') {
    const tur = kucuk2(M.SOZ[v.tur]);
    if (v.hastalik) {
      teshisKaydet(d, v.hastalik, v.tur, 'leş');
      const l = k.lesler.find((x) => x.id === v.lesId);
      if (l) l.teshis = v.hastalik;
      return `Ölü ${tur}: ölüm nedeni ${E.HASTALIKLAR[v.hastalik].ad}. ${v.hastalik === 'sarbon' ? 'Leş sporları yayabilir; veteriner yakmalı.' : ''}`.trim();
    }
    const neden = v.neden.startsWith('avlandı') || v.neden.includes('timsah') ? 'bir yırtıcı tarafından avlanmış' : v.neden.includes('yaşlılık') ? 'yaşlılık; dişleri aşınmış, hastalık bulunmadı' : v.neden.includes('açlık') ? 'açlık; yağ dokusu tükenmiş' : v.neden || 'belirlenemedi';
    return `Ölü ${tur}: ölüm nedeni ${neden}.`;
  }
  const b = E.BITKILER[v.bitki];
  const a = k.arsiv.bitkiler[v.bitki];
  if (a) a.analiz = true;
  return `${b.ad}, ${v.parca}: ${b.analiz} Bitki ${E.OZELLIK_ADI[b.ozellik]}.`;
}
function laboratuvarGuncelle(d) {
  const k = d.k;
  // İstasyona dönünce numuneler teslim edilir
  if (k.numuneKutusu.length && Math.hypot(d.oyuncu.x - ISTASYON.x, d.oyuncu.y - ISTASYON.y) < ISTASYON.r + 6) {
    const n = k.numuneKutusu.length;
    k.numuneKutusu.forEach((x) => {
      x.durum = 'sira';
      k.numuneler.unshift(x);
    });
    k.numuneKutusu = [];
    if (k.numuneler.length > 60) k.numuneler.length = 60;
    M.olay(d, 'numuneTeslim', `${n} numune laboratuvara teslim edildi. Sırayla analiz edilecek.`, 3);
  }
  // Biten analizler
  k.numuneler.forEach((n) => {
    if (n.durum === 'analiz' && k.dk >= n.bitis) {
      n.durum = 'tamam';
      n.sonuc = numuneSonucu(d, n);
      M.itibarEkle(d, 2);
      M.mesajEkle(k, `Laboratuvar: ${numuneAdi(n)} analizi bitti. ${n.sonuc}`, 'sonuc');
      M.olay(d, 'analizBitti', `Numune analizi bitti: ${numuneAdi(n)}. ${n.sonuc}`, 3);
    }
  });
  // Sıradakiler başlar
  let bos = numuneKapasitesi(k) - k.numuneler.filter((n) => n.durum === 'analiz').length;
  k.numuneler
    .slice()
    .reverse()
    .forEach((n) => {
      if (bos <= 0 || n.durum !== 'sira') return;
      let sure = NUMUNE_DK * M.zorlukCarpani(k, 'arastirma', [0.5, 1, 1.5]);
      if (M.personelVar(k, 'biyolog')) sure *= 0.6;
      if (tesisVar(k, 'gelismisLab')) sure *= 0.75;
      if (n.tip === 'bitki' && M.personelVar(k, 'botanikUzmani')) sure *= 0.5;
      n.durum = 'analiz';
      n.bitis = k.dk + sure;
      bos--;
    });
}

// ---------- Veterinerlik ----------
export function veterinerMudahale(d) {
  const k = d.k;
  const b = M.gozlenen(d);
  if (!M.personelVar(k, 'veteriner')) return 'Hayvanları yalnızca veteriner tedavi edebilir. Veteriner kliniği kur ve veteriner işe al.';
  if (!b) return 'Önce müdahale edilecek hayvanı dürbünle gözlemle.';
  if (M.mesafe(d.oyuncu, b) > 40) return 'Veteriner ekibin yaklaşabilmesi için 40 metre içinde olmalısın.';
  const ad = M.bireyAdi(b);
  if (!b.hastalik) {
    if (b.kondisyon < 0.3) return `${M.BuyukHarf(ad)} zayıf ama hasta değil; zayıflığın nedeni besin azlığı. Vahşi hayvanları beslemek doğal dengeyi bozar, müdahale edilmedi.`;
    return `${M.BuyukHarf(ad)} sağlıklı görünüyor. Vahşi bir hayvana gereksiz yere dokunulmaz.`;
  }
  const h = b.hastalik;
  const tanim = E.HASTALIKLAR[h.id];
  if (!h.goruldu && b.teshis !== h.id) return `Veteriner ${ad} hayvanını uzaktan inceledi ama belirgin bir sorun görmedi. Bir süre gözlemle ya da dışkı numunesi al.`;
  if (h.tedavi) return `${M.BuyukHarf(ad)} zaten tedavi edildi; iyileşmesi bekleniyor.`;
  b.teshis = h.id;
  teshisKaydet(d, h.id, b.tur, 'veteriner');
  if (!tanim.tedavi) {
    M.gecmisEkle(k, b, `Veteriner muayenesi: ${tanim.ad}, tedavisi yok`);
    return `Veteriner ${ad} hayvanında ${tanim.ad} teşhis etti. Hastalık ilerlemiş; vahşi hayvanda tedavisi yok. Öldüğünde leşi yakılırsa salgının yayılması yavaşlar.`;
  }
  const ucret = h.id === 'uyuz' ? 800 : 600;
  if (k.butce < ucret) return `İlaç ve uyuşturucu için ${lira(ucret)} gerekli; bütçe yetmiyor.`;
  k.butce -= ucret;
  h.tedavi = true;
  h.siddet *= 0.5;
  b.alisma = Math.max(0, b.alisma - 0.2);
  M.itibarEkle(d, 3);
  M.gecmisEkle(k, b, `Veteriner tedavisi: ${tanim.ad}`);
  M.arsivOlay(d, `${M.BuyukHarf(ad)} tedavi edildi: ${tanim.ad}.`);
  const nasil = {
    yara: 'yarasını temizleyip dikti ve antibiyotik verdi',
    parazit: 'parazit ilacı verdi',
    uyuz: 'akarlara karşı iğne yaptı',
  }[h.id];
  const grup = h.id === 'uyuz' ? ' Uyuz bulaşıcıdır; grup arkadaşlarını da gözlemle.' : '';
  return `Veteriner ekip ${ad} hayvanını uzaktan iğneyle kısa süreli uyuttu, ${nasil}. Hayvan uyanıp grubuna döndü. Birkaç gün içinde iyileşmesi bekleniyor. Masraf ${lira(ucret)}.${grup}`;
}
export function lesiYak(d) {
  const k = d.k;
  if (!M.personelVar(k, 'veteriner')) return 'Leşleri güvenle yok etmek için veteriner gerekir.';
  const l = yakinLes(d, 14);
  if (!l) return 'Yakında leş yok.';
  if (!(l.teshis === 'sarbon' || (k.eko.salgin && k.eko.salgin.bilinen))) return 'Leşin şarbonlu olduğu bilinmiyor. Doğal leşler sırtlanların ve akbabaların besinidir; önce leşten numune al.';
  if (l.hastalik !== 'sarbon') return 'Veteriner hızlı testle baktı: bu leş şarbonlu değil. Doğal leşlere dokunulmaz.';
  if (k.butce < 300) return 'Yakıt ve kireç için 300 lira gerekli; bütçe yetmiyor.';
  k.butce -= 300;
  k.lesler = k.lesler.filter((x) => x !== l);
  M.itibarEkle(d, 4);
  M.arsivOlay(d, `Şarbonlu bir ${kucuk2(M.SOZ[l.tur])} leşi yakıldı.`);
  return `Veteriner ekip şarbonlu ${kucuk2(M.SOZ[l.tur])} leşini yakıp toprağı kireçle kapladı. Sporların yayılması önlendi. Masraf 300 lira.`;
}

// ---------- Rehabilitasyon (karar 66) ----------
export const REHAB_ASAMALARI = ['karantina', 'tedavi', 'beslenme ve iyileşme', 'doğaya uyum'];
export function rehabUygunMu(b) {
  if (!b || b.olu) return false;
  if (b.yetim && b.evre === 'yavru') return true;
  return !!(b.hastalik && E.HASTALIKLAR[b.hastalik.id].tedavi && b.hastalik.siddet > 0.5);
}
export function rehabaAl(d) {
  const k = d.k;
  const b = M.gozlenen(d);
  if (!tesisVar(k, 'rehab')) return 'Önce rehabilitasyon alanı kurulmalı.';
  if (!M.personelVar(k, 'veteriner')) return 'Hayvanı ancak veteriner rehabilitasyona alabilir.';
  if (!b) return 'Önce hayvanı dürbünle gözlemle.';
  if (M.mesafe(d.oyuncu, b) > 40) return 'Veteriner ekibin yaklaşabilmesi için 40 metre içinde olmalısın.';
  if (!rehabUygunMu(b)) return `${M.BuyukHarf(M.bireyAdi(b))} doğada iyileşebilir; rehabilitasyona yalnızca ağır yaralı, ağır hasta ya da yetim kalmış yavrular alınır.`;
  if (k.rehab.length >= 4) return 'Rehabilitasyon alanı dolu (4 hayvan).';
  if (k.butce < 1000) return 'Rehabilitasyon için 1.000 lira gerekli; bütçe yetmiyor.';
  k.butce -= 1000;
  const neden = b.yetim ? 'yetim yavru' : E.HASTALIKLAR[b.hastalik.id].ad;
  M.haritadanCikar(d, [b]);
  k.rehab.push({ b, asama: 0, gun: gunu(k), neden, hazir: false });
  M.gecmisEkle(k, b, `Rehabilitasyona alındı: ${neden}`);
  M.arsivOlay(d, `${M.BuyukHarf(M.bireyAdi(b))} rehabilitasyona alındı (${neden}).`);
  M.itibarEkle(d, 3);
  return `Veteriner ekip ${M.bireyAdi(b)} hayvanını uyutup araçla rehabilitasyon alanına taşıdı. Önce karantinaya alınacak. İnsanlara alışmaması için bakıcılar onu olabildiğince az görecek. Masraf 1.000 lira.`;
}
export function rehabMetni(k, r) {
  const ad = M.BuyukHarf(M.bireyAdi(r.b));
  if (r.hazir) return `${ad} (${r.neden}): doğaya bırakılmaya hazır. Bırak`;
  return `${ad} (${r.neden}): ${REHAB_ASAMALARI[r.asama]} aşamasında, ${gunu(k) - r.gun + 1}. gün`;
}
export function rehabBirak(d, id) {
  const k = d.k;
  const r = k.rehab.find((x) => x.b.id === id);
  if (!r) return 'Bu hayvan rehabilitasyonda değil.';
  if (!r.hazir) return `${M.BuyukHarf(M.bireyAdi(r.b))} henüz hazır değil: ${REHAB_ASAMALARI[r.asama]} aşamasında.`;
  const b = r.b;
  const g = k.gruplar.find((x) => x.id === b.grup && !x.goc) || k.gruplar.find((x) => x.tur === b.tur && !x.goc);
  if (!g) return 'Sürüsü şu an bölgede değil (göçte olabilir). Döndüğünde bırakabilirsin.';
  b.grup = g.id;
  b.x = g.x + b.ofs.x;
  b.y = g.y + b.ofs.y;
  b.yetim = false;
  b.hastalik = null;
  b.alisma = 0.15;
  k.hayvanlar.push(b);
  d.hayvanMap.set(b.id, b);
  k.rehab = k.rehab.filter((x) => x !== r);
  M.gecmisEkle(k, b, 'Doğaya bırakıldı');
  M.arsivOlay(d, `${M.BuyukHarf(M.bireyAdi(b))} doğaya bırakıldı.`);
  M.itibarEkle(d, 8);
  return `Ekip ${M.bireyAdi(b)} hayvanını ${M.bolgeAdi(b.x, b.y)} bölgesinde grubunun yanına bıraktı. Hayvan çekinerek de olsa grubuna katıldı.`;
}
function rehabGunluk(d) {
  const k = d.k;
  k.rehab.forEach((r) => {
    const b = r.b;
    b.yas = (b.yas || 0) + 1;
    b.evre = E.evreBul(b.tur, b.yas);
    if (r.hazir) return;
    if (r.asama === 1) b.hastalik = null;
    if (r.asama === 2) {
      b.kondisyon = Math.min(1, (b.kondisyon || 0.4) + 0.25);
      // Yetim yavru kendi başına yaşayabilecek yaşa gelene kadar beslenir
      if (b.evre === 'yavru' && b.yas < E.yilGun(E.YASAM[b.tur].yavru) * 0.5) return;
    }
    r.asama += 1;
    if (r.asama >= REHAB_ASAMALARI.length) {
      r.asama = REHAB_ASAMALARI.length - 1;
      r.hazir = true;
      M.mesajEkle(k, `Rehabilitasyon: ${M.bireyAdi(b)} iyileşti ve doğaya bırakılmaya hazır. Araştırma merkezi, Rehabilitasyon bölümünden bırakabilirsin.`, 'bilgi');
    } else M.mesajEkle(k, `Rehabilitasyon: ${M.bireyAdi(b)} ${REHAB_ASAMALARI[r.asama]} aşamasına geçti.`, 'bilgi');
  });
}
// Botanik uzmanı her gün bir bitkinin evresini kaydeder
function botanikGunluk(d) {
  const k = d.k;
  const p = k.personel.find((x) => x.rol === 'botanikUzmani');
  if (!p) return;
  const ev = (id) => E.bitkiEvresi(id, gunu(k), k.eko);
  const aday = E.BITKI_SIRASI.find((id) => k.arsiv.bitkiler[id] && !k.arsiv.bitkiler[id].evreler.includes(ev(id).anahtar)) || E.BITKI_SIRASI.find((id) => !k.arsiv.bitkiler[id]);
  if (!aday) return;
  const b = E.BITKILER[aday];
  if (!k.arsiv.bitkiler[aday]) k.arsiv.bitkiler[aday] = { ilkDk: k.dk, ilkBolge: 'botanik uzmanının kaydı', evreler: [], analiz: false };
  k.arsiv.bitkiler[aday].evreler.push(ev(aday).anahtar);
  M.mesajEkle(k, `${p.ad} bir bitki evresi kaydetti: ${b.ad}, ${ev(aday).metin}.`, 'bilgi');
}

// ==================== Koruma projeleri (karar 59, 64, 65) ====================
// Her proje adımlardan oluşur; bazı adımlar bir eylem (ücretli) ister. Tamamlanınca itibar, fon ve kalıcı etki.
const projeDurumu = (k, id) => (k.koruma.projeler[id] || null);
const gpsliTur = (k, tur) => k.gpsli.some((id) => (k.hayvanlar.find((b) => b.id === id) || {}).tur === tur);
export const KORUMA = [
  {
    id: 'gergedan',
    ad: 'Ak gergedan koruma programı',
    tarif: 'Ak gergedanın nesli tehlike altında; boynuzları için kaçak avlanıyor. Bölgedeki küçük grubu izleyip korumak ve üremesini desteklemek.',
    adimlar: [
      { metin: 'Bölgedeki iki gergedanı tanımla', tamam: (k) => k.hayvanlar.filter((b) => b.tur === 'gergedan' && b.no > 0).length >= 2 },
      { metin: 'Bir gergedana GPS tasması taktır', tamam: (k) => gpsliTur(k, 'gergedan') },
      { metin: 'Koruma devriyesini başlat (6.000 lira, günlük 200 lira)', tamam: (k) => !!k.koruma.devriye, eylem: { etiket: 'Devriyeyi başlat, 6.000 lira', ucret: 6000, yap: (k) => ((k.koruma.devriye = true), 'Korucular bölgede düzenli devriyeye başladı. Kaçak avcıların tuzak kurması çok azalacak.') } },
      { metin: 'Bir gergedan yavrusu doğsun', tamam: (k, p) => k.hayvanlar.some((b) => b.tur === 'gergedan' && b.dogumDk && b.dogumDk > p.bas) },
    ],
    odul: { itibar: 30, fon: 15000 },
    sonuc: 'Gergedan grubu büyüdü. Program uluslararası koruma raporlarında örnek gösterildi.',
  },
  {
    id: 'yabanKopegi',
    ad: 'Yaban köpeği sürüsünü koruma',
    tarif: 'Afrika yaban köpeği nesli tehlikede; en büyük tehdit evcil köpeklerden bulaşan köpek gençlik hastalığı. Sürüyü bulup aşılamak ve izlemek.',
    adimlar: [
      { metin: 'Yaban köpeği sürüsünden 3 birey tanımla', tamam: (k) => k.hayvanlar.filter((b) => b.tur === 'yabanKopegi' && b.no > 0).length >= 3 },
      {
        metin: 'Sürüyü köpek gençlik hastalığına karşı aşılat (veteriner, 3.000 lira)',
        tamam: (k) => !!k.koruma.asi,
        eylem: {
          etiket: 'Sürüyü aşılat, 3.000 lira',
          ucret: 3000,
          gerek: (k) => (M.personelVar(k, 'veteriner') ? null : 'Aşı için veteriner gerekir.'),
          yap: (k) => {
            k.koruma.asi = true;
            k.koruma.asiGun = M.gunNo(k.dk);
            k.asili = k.hayvanlar.filter((b) => b.tur === 'yabanKopegi' && !b.olu).map((b) => b.id);
            return `Veteriner ekip sürüdeki ${k.asili.length} yaban köpeğini uzaktan aşı iğnesiyle aşıladı. Sürü artık hastalığa karşı korunuyor.`;
          },
        },
      },
      { metin: 'Aşıdan sonra 10 gün boyunca sürü en az 5 birey kalsın', tamam: (k) => k.koruma.asi && M.gunNo(k.dk) - k.koruma.asiGun >= 10 && k.hayvanlar.filter((b) => b.tur === 'yabanKopegi' && !b.olu).length >= 5 },
    ],
    odul: { itibar: 25, fon: 10000 },
    sonuc: 'Aşılanan sürü sağlıklı kaldı ve yavruladı. Yöntem başka bölgelerde de uygulanacak.',
  },
  {
    id: 'kacakMucadele',
    ad: 'Kaçak avcılıkla mücadele',
    tarif: 'Kaçak avcıların tel tuzakları her yıl pek çok hayvanı öldürüyor. Tuzakları bulup sökmek, takılan hayvanları kurtarmak ve devriyeyi kurmak.',
    adimlar: [
      { metin: '3 tel tuzak bul ve sök', tamam: (k) => k.kacak.bulunan >= 3 },
      { metin: 'Tuzağa takılmış bir hayvanı kurtar', tamam: (k) => k.kacak.kurtarilan >= 1 },
      { metin: 'Koruma devriyesi kurulsun', tamam: (k) => !!k.koruma.devriye, eylem: { etiket: 'Devriyeyi başlat, 6.000 lira', ucret: 6000, yap: (k) => ((k.koruma.devriye = true), 'Korucular bölgede düzenli devriyeye başladı.') } },
    ],
    odul: { itibar: 20, fon: 8000 },
    sonuc: 'Bölgede tel tuzak sayısı belirgin biçimde azaldı. Yaban hayatı servisi seni teşekkür belgesiyle onurlandırdı.',
  },
  {
    id: 'akbaba',
    ad: 'Akbabaları koruma',
    tarif: 'Akbabalar, çobanların yırtıcılar için zehirlediği leşleri yiyerek toplu hâlde ölüyor. Akbabaları izlemek, leşleri taramak ve çevre köylerde bilinçlendirme yapmak.',
    adimlar: [
      { metin: 'Ak sırtlı akbaba ve kulaklı akbabayı gözlemle', tamam: (k) => !!(k.arsiv.kucukler.akSirtliAkbaba && k.arsiv.kucukler.kulakliAkbaba) },
      { metin: '2 leş numunesini laboratuvarda zehir için tara', tamam: (k) => k.numuneler.filter((n) => n.tip === 'les' && n.durum === 'tamam').length >= 2 },
      { metin: 'Zehirli yem karşıtı bilinçlendirme kampanyası (4.000 lira)', tamam: (k) => !!k.koruma.kampanya, eylem: { etiket: 'Kampanyayı başlat, 4.000 lira', ucret: 4000, yap: (k) => ((k.koruma.kampanya = true), 'Çevre köylerde çobanlarla toplantılar yapıldı; zehirli yem yerine yırtıcılardan korunmak için çit ve bekçi köpeği desteği verildi.') } },
    ],
    odul: { itibar: 20, fon: 7000 },
    sonuc: 'Bölgede zehirlenme vakası görülmedi; akbaba sayısı artmaya başladı.',
  },
  {
    id: 'genetik',
    ad: 'Genetik çeşitliliği koruma',
    tarif: 'Küçük ve yalıtılmış popülasyonlarda akraba hayvanlar çiftleşir; genetik çeşitlilik azalır, kalıtsal hastalıklar artar. DNA ile en riskli türü bulup başka bir koruma alanından birey getirmek (translokasyon).',
    adimlar: [
      { metin: 'Bir türün en az 3 bireyinden DNA profili çıkar (tanımlı bireylerden dışkı numunesi)', tamam: (k) => TUR_SIRASI.some((t) => k.hayvanlar.filter((b) => b.tur === t && b.dna).length >= 3) },
      {
        metin: 'Riskli türe başka bir popülasyondan iki birey getirt (8.000 lira)',
        tamam: (k) => !!k.koruma.translokasyon,
        eylem: {
          etiket: 'Translokasyonu başlat, 8.000 lira',
          ucret: 8000,
          gerek: (k) => (TUR_SIRASI.some((t) => k.hayvanlar.filter((b) => b.tur === t && b.dna).length >= 3) ? null : 'Önce bir türün en az 3 bireyinden DNA profili çıkarmalısın.'),
          yap: (k) => ((k.koruma.translokasyonIste = true), 'Translokasyon ekibi yola çıktı. Genetik açıdan en riskli türden iki birey birkaç saat içinde getirilecek; Mesajlar bölümünden haber alacaksın.'),
        },
      },
      { metin: 'Getirilen bireylerden birinin yavrusu doğsun', tamam: (k) => !!k.koruma.translokasyon && k.hayvanlar.some((b) => b.dogumDk > k.koruma.translokasyon.dk && (k.koruma.translokasyon.idler.includes(b.anne) || k.koruma.translokasyon.idler.includes(b.baba))) },
    ],
    odul: { itibar: 25, fon: 12000 },
    sonuc: 'Getirilen bireylerin yavruları sağlıklı doğdu; popülasyonun genetik çeşitliliği arttı. Çalışman koruma genetiği dergisinde yayımlandı.',
  }
];
export function korumaBaslat(k, id) {
  const p = KORUMA.find((x) => x.id === id);
  if (!p) return 'Proje bulunamadı.';
  if (projeDurumu(k, id)) return `${p.ad} zaten ${k.koruma.projeler[id].durum === 'tamam' ? 'tamamlandı' : 'sürüyor'}.`;
  k.koruma.projeler[id] = { durum: 'surer', bas: k.dk };
  M.mesajEkle(k, `Koruma projesi başladı: ${p.ad}. ${p.tarif}`, 'bilgi');
  return `Proje başladı: ${p.ad}. Adımları Koruma projeleri bölümünden izleyebilirsin.`;
}
export function korumaEylem(k, id, i) {
  const p = KORUMA.find((x) => x.id === id);
  const a = p && p.adimlar[i];
  const pd = projeDurumu(k, id);
  if (!a || !a.eylem || !pd) return 'Bu adım için yapılacak bir şey yok.';
  if (a.tamam(k, pd)) return 'Bu adım zaten tamamlandı.';
  const engel = a.eylem.gerek && a.eylem.gerek(k);
  if (engel) return engel;
  if (k.butce < a.eylem.ucret) return `Bütçe yetmiyor. ${lira(a.eylem.ucret - k.butce)} daha gerekli.`;
  k.butce -= a.eylem.ucret;
  return a.eylem.yap(k);
}
export function korumaSatirlari(k, id) {
  const p = KORUMA.find((x) => x.id === id);
  const pd = projeDurumu(k, id);
  return p.adimlar.map((a, i) => ({ i, metin: a.metin, tamam: !!(pd && a.tamam(k, pd)), eylem: a.eylem && pd && pd.durum === 'surer' && !a.tamam(k, pd) ? a.eylem.etiket : null }));
}
export function korumaOzeti(k, p) {
  const pd = projeDurumu(k, p.id);
  if (!pd) return `${p.ad}: başlatılmadı`;
  if (pd.durum === 'tamam') return `${p.ad}: tamamlandı`;
  const s = korumaSatirlari(k, p.id);
  return `${p.ad}: ${s.filter((x) => x.tamam).length} / ${s.length} adım`;
}
function korumaDenetle(d) {
  const k = d.k;
  KORUMA.forEach((p) => {
    const pd = projeDurumu(k, p.id);
    if (!pd || pd.durum !== 'surer') return;
    if (p.adimlar.every((a) => a.tamam(k, pd))) {
      pd.durum = 'tamam';
      k.itibar += p.odul.itibar;
      k.butce += p.odul.fon;
      const m = `Koruma projesi tamamlandı: ${p.ad}. ${p.sonuc} Destekçi kurumlardan ${lira(p.odul.fon)} fon geldi.`;
      M.mesajEkle(k, m, 'sonuc');
      M.arsivOlay(d, `Koruma projesi tamamlandı: ${p.ad}.`);
      M.olay(d, 'koruma', m, 4);
    }
  });
}
export function yanginSondur(d) {
  const k = d.k;
  if (!E.yananHucreler(k.eko).length) return 'Şu an yangın yok.';
  if (k.butce < 3000) return 'Yangın söndürme ekibi için 3.000 lira gerekli; bütçe yetmiyor.';
  k.butce -= 3000;
  E.yananHucreler(k.eko).forEach((h) => {
    delete k.eko.yanan[h];
    k.eko.yanik[h] = k.dk;
  });
  M.arsivOlay(d, 'Yangın söndürme ekibi yangını söndürdü.');
  return 'Yangın söndürme ekibi geldi; yangın kesici şeritler açıp alevleri söndürdüler. Masraf 3.000 lira. Doğal yangınlar savanın parçasıdır; yalnızca istasyon ya da nadir türler tehlikedeyken müdahale etmek en doğrusudur.';
}
