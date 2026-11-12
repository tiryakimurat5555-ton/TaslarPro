// ==== VAHŞİ YAŞAM: ARAŞTIRMA MERKEZİ (brif Aşama 4) ====
// Saf mantık: bütçe ve dengeli ekonomi (karar 22, 62, 91), ekipman (89, 88), tesisler (21, 79, 80), personel (54, 81),
// basit araştırma ekranı ve analizler (45), hibe teklifleri ve dinamik görevler (61, 62, 90), mesajlar (82),
// kamera tuzakları (41, 93) ve GPS tasmaları (11, 84). Sayılar öneridir; Murat onaylamadı.
import { TURLER, TUR_SIRASI, DAVRANISLAR, ISTASYON, YARICAP } from './veri.js';
import * as M from './mantik.js';

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
};

export const TESISLER = {
  konaklama: { ad: 'Personel konaklama binası', fiyat: 10000, itibar: 20, bakim: 150, tarif: 'Personel kapasitesi 2 kişiden 6 kişiye çıkar.' },
  kule: { ad: 'Gözlem kulesi', fiyat: 8000, itibar: 15, bakim: 80, tarif: 'İstasyondayken çevreyi 150 metreye kadar tarayabilirsin.' },
  gelismisLab: { ad: 'Gelişmiş laboratuvar', fiyat: 14000, itibar: 35, bakim: 200, tarif: 'Aynı anda iki analiz yapılır, analizler dörtte bir daha kısa sürer.' },
  klinik: { ad: 'Veteriner kliniği', fiyat: 18000, itibar: 45, bakim: 250, tarif: 'Veteriner işe alınabilir. Hasta ve yaralı hayvanların tedavisi sonraki aşamada buradan yapılacak.' },
};

export const PERSONEL = {
  sahaArastirmacisi: { ad: 'Saha araştırmacısı', maas: 500, itibar: 10, tarif: 'Her gün istasyonun çevresinde bir hayvanı kendisi tanımlar.' },
  biyolog: { ad: 'Biyolog', maas: 600, itibar: 15, tarif: 'Analizler daha kısa sürer.' },
  fotografci: { ad: 'Fotoğrafçı', maas: 500, itibar: 20, tarif: 'Fotoğraflar daha kaliteli olur; fotoğraf satış gelirleri iki katına çıkar.' },
  teknisyen: { ad: 'Teknik personel', maas: 450, itibar: 25, tarif: 'Kurabileceğin kamera tuzağı sayısı 3 ten 6 ya çıkar.' },
  veteriner: { ad: 'Veteriner', maas: 700, itibar: 40, tesis: 'klinik', tarif: 'GPS tasması takar. Sonraki aşamada hasta hayvanları tedavi edecek.' },
};
const ADLAR = {
  sahaArastirmacisi: ['Juma Otieno', 'Neema Mwangi', 'Baraka Kiprop'],
  biyolog: ['Dr. Amani Wanjiru', 'Dr. Selin Aksoy', 'Dr. Daniel Mutua'],
  fotografci: ['Zawadi Achieng', 'Emre Kılıç', 'Lena Okoth'],
  teknisyen: ['Peter Kamau', 'Halima Njeri', 'Murat Yıldız'],
  veteriner: ['Dr. Grace Atieno', 'Dr. Kerem Doğan', 'Dr. Samuel Omondi'],
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
];
export const ANALIZ_DK = 8 * 60; // temel analiz süresi (oyun dakikası)

// ---------- Yardımcılar ----------
export const tesisVar = (k, id) => k.tesisler.includes(id);
export const personelKapasitesi = (k) => (tesisVar(k, 'konaklama') ? 6 : 2);
export const tuzakKapasitesi = (k) => (M.personelVar(k, 'teknisyen') ? 6 : 3);
export const analizKapasitesi = (k) => (tesisVar(k, 'gelismisLab') ? 2 : 1);
export function gunlukGider(k) {
  return 300 + k.personel.reduce((s, p) => s + PERSONEL[p.rol].maas, 0) + k.tesisler.reduce((s, t) => s + TESISLER[t].bakim, 0);
}
// İtibar arttıkça bilimsel kuruluşlar günlük destek verir (karar 61, 91)
export const gunlukDestek = (k) => Math.min(2500, Math.floor(k.itibar / 10) * 100);
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
  let sure = ANALIZ_DK;
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
  ];
  let s = secenek[Math.floor(rng() * secenek.length)];
  if (s.tip === 'kesfet' && Object.keys(k.arsiv.turler).length > TUR_SIRASI.length - 2) s = secenek[1];
  if (s.tip === 'ses' && k.arsiv.turler[tur] && k.arsiv.turler[tur].sesKaydi) s = secenek[0];
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
  return d.k.gpsli.map((id) => M.birey(d, id)).filter(Boolean);
}
export function gpsTarifi(d, b) {
  if (b.olu) return `${M.bireyAdi(b)}: tasmadan sinyal gelmiyor`;
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
  // Kamera tuzakları: 20 oyun dakikasında bir yakından geçenleri fotoğraflar (gece kızılötesi)
  k.tuzaklar.forEach((t) => {
    if (k.dk - t.sonKontrol < 20) return;
    t.sonKontrol = k.dk;
    const gun = M.gunNo(k.dk);
    k.hayvanlar.forEach((b) => {
      if (b.olu || Math.abs(b.x - t.x) > 15 || Math.abs(b.y - t.y) > 15 || M.mesafe(b, t) > 15) return;
      const anahtar = `${gun}:${b.tur}`;
      if (t.gunluk[anahtar]) return;
      t.gunluk[anahtar] = true;
      t.foto += 1;
      const yeniTur = !k.arsiv.turler[b.tur];
      M.turKaydi(d, b.tur);
      k.arsiv.fotolar.unshift({ id: k.sonrakiId++, bireyId: b.id, kod: M.taninmisMi(b) ? M.kod(b) : null, tur: b.tur, davranis: b.davranis, bolge: t.bolge, dk: k.dk, kalite: 'iyi', kaynak: 'tuzak' });
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
