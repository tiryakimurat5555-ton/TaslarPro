// ==== VAHŞİ YAŞAM: KEŞİF (brif Aşama 6) ====
// Küçük canlıları arama (karar 48, 94, 95), mağara ekosistemi (karar 98), yarasaların akşam çıkışı,
// kaçak avcıların tel tuzakları ve izleri (karar 60: sınırlı kapsam; oyuncu bulur, söker, bildirir, hayvanı kurtarır).
import { TURLER, MAGARA, ISTASYON, YARICAP, nehirY, NEHIR_YARI } from './veri.js';
import * as M from './mantik.js';
import * as E from './ekosistem.js';
import { KUCUKLER, MAGARA_ODALARI, bulunabilirler } from './kucukler.js';

const kucukHarf = (s) => s.toLocaleLowerCase('tr-TR');
const yerTarifi = (o, h) => `${M.saatSozu(M.saatYonu(o, h))}, ${M.metreSozu(M.mesafe(o, h))}`;

export function kesifHazirla(k) {
  if (!k.arsiv.kucukler || typeof k.arsiv.kucukler !== 'object') k.arsiv.kucukler = {};
  if (!k.arsiv.magara || !Array.isArray(k.arsiv.magara.odalar)) k.arsiv.magara = { odalar: [] };
  if (!k.kacak || !Array.isArray(k.kacak.tuzaklar)) k.kacak = { tuzaklar: [], bulunan: 0, kurtarilan: 0, olen: 0, izler: 0 };
  if (k.magara && typeof k.magara.oda !== 'number') k.magara = null;
}

// ---------- Küçük canlılar ----------
function kucukKaydet(d, id, metinOn = '') {
  const k = d.k;
  const c = KUCUKLER[id];
  const yer = k.magara ? MAGARA_ODALARI[k.magara.oda].ad : M.bolgeAdi(d.oyuncu.x, d.oyuncu.y);
  let a = k.arsiv.kucukler[id];
  d.sonKucuk = { id, zaman: d.zaman };
  d.sonKucukAd = c.ad;
  if (!a) {
    a = k.arsiv.kucukler[id] = { ilkDk: k.dk, ilkBolge: yer, sayi: 1 };
    M.itibarEkle(d, c.nadir ? 6 : 3);
    M.arsivOlay(d, `Yeni küçük canlı: ${c.ad}${c.nadir ? ' (nadir)' : ''}, ${yer}.`);
    const ses = c.ses ? ` Sesi: ${c.ses}` : '';
    const m = `${metinOn}${c.nadir ? 'Nadir bir keşif! ' : ''}Yeni tür: ${c.ad}, bilimsel adı ${c.bilimsel}, ${kucukHarf(c.grup)}. ${c.tarif}${ses}`;
    M.olay(d, 'yeniKucuk', m, 4, { nadir: !!c.nadir });
    return m;
  }
  a.sayi += 1;
  const m = `${metinOn}${c.ad}. ${c.tarif.split('. ')[0].replace(/\.$/, '')}.`;
  M.olay(d, 'kucuk', m, 3);
  return m;
}
export function kucukAra(d) {
  const k = d.k;
  if (d.sonArama && d.zaman - d.sonArama < 3.5) {
    const m = 'Sessizce bekleyip çevreni dinliyorsun. Biraz sonra yeniden ara.';
    M.olay(d, 'kucuk', m, 2);
    return m;
  }
  d.sonArama = d.zaman;
  const evre = M.gunEvresi(k.dk);
  const tk = E.takvim(M.gunNo(k.dk));
  const yagmur = !!(k.eko && (k.eko.yagmurVar || k.eko.yagisBugun > 4));
  const oda = k.magara ? MAGARA_ODALARI[k.magara.oda].id : null;
  const bolge = M.bolgeBul(d.oyuncu.x, d.oyuncu.y);
  // Termitlerin çiftleşme uçuşu: yağmurdan sonraki gece termit tepelerinde
  if (!oda && bolge === 'termit' && evre === 'gece' && k.eko && k.eko.yagisBugun > 3 && !k.arsiv.kucukler.termitUcusu) {
    k.arsiv.kucukler.termitUcusu = { ilkDk: k.dk, ilkBolge: 'Termit tepeleri', sayi: 1, ozel: true };
    M.itibarEkle(d, 6);
    const o = KUCUKLER.termit.ozel;
    M.arsivOlay(d, `Gözlendi: ${o.ad}.`);
    const m = `Nadir bir an! ${o.ad}. ${o.tarif}`;
    M.olay(d, 'yeniKucuk', m, 4, { nadir: true });
    return m;
  }
  const liste = bulunabilirler({ bolge, oda, evre, mevsim: tk.mevsim, yagmur });
  let basari = oda ? 0.85 : 0.75;
  if (!oda && evre === 'gece' && !(k.ekipman.geceDurbunu || k.ekipman.termal)) basari = 0.5;
  basari += M.zorlukCarpani(k, 'kesif', [0.12, 0, -0.1]);
  if (!liste.length || d.rng() > basari) {
    const m = oda ? 'Fenerinle kayaların çatlaklarına baktın ama bu kez bir şey göremedin.' : evre === 'gece' ? 'Karanlıkta otların arasına baktın; yalnızca cırcır böceklerini duyuyorsun.' : 'Otların ve taşların arasına baktın ama bu kez bir şey göremedin. Başka bir yerde ya da başka bir saatte dene.';
    M.olay(d, 'kucuk', m, 2);
    return m;
  }
  const agirlik = liste.map((id) => {
    const c = KUCUKLER[id];
    return c.sik * (yagmur && c.yagmur ? 3 : 1) * (k.arsiv.kucukler[id] ? 1 : 1.6);
  });
  let r = d.rng() * agirlik.reduce((a, b) => a + b, 0);
  let id = liste[0];
  for (let i = 0; i < liste.length; i++) {
    r -= agirlik[i];
    if (r <= 0) {
      id = liste[i];
      break;
    }
  }
  return kucukKaydet(d, id);
}
export const kucukSayisi = (k) => Object.keys(k.arsiv.kucukler || {}).filter((id) => KUCUKLER[id]).length;

// ---------- Mağara ----------
export const magaraYakin = (d) => !d.k.magara && !d.k.aracta && M.mesafe(d.oyuncu, { x: MAGARA.x + 2, y: MAGARA.y + 8 }) < 14;
export function magarayaGir(d) {
  const k = d.k;
  if (k.magara) return 'Zaten mağaradasın.';
  if (k.aracta) return 'Araçla mağaraya girilmez; önce in.';
  if (!magaraYakin(d)) return `Mağara girişi ${yerTarifi(d.oyuncu, MAGARA)} uzakta. Yerler menüsünden Mağara girişi'ne git.`;
  if (!k.ekipman.magaraTakimi) return 'Mağaraya güvenle girmek için mağara takımı gerekir: kask, kafa lambası ve maske. Araştırma merkezinden alabilirsin.';
  d.rota = null;
  d.yaklasId = null;
  M.gozlemBitir(d);
  k.magara = { oda: 0 };
  return odaGir(d, 0);
}
function odaGir(d, i) {
  const k = d.k;
  const oda = MAGARA_ODALARI[i];
  k.magara.oda = i;
  let ek = '';
  if (!k.arsiv.magara.odalar.includes(oda.id)) {
    k.arsiv.magara.odalar.push(oda.id);
    M.itibarEkle(d, 3);
    M.arsivOlay(d, `Mağara keşfi: ${oda.ad}.`);
    ek = ' Bu odaya ilk kez girdin.';
  }
  const yarasaUyur = oda.id === 'yarasa' && M.gunEvresi(k.dk) === 'gunduz' ? ' Yarasalar tavanda uyuyor; yüksek sesle konuşma.' : oda.id === 'yarasa' && M.geceMi(k.dk) ? ' Yarasaların çoğu şimdi dışarıda, meyve aramaya çıkmış.' : '';
  const m = `${oda.ad}, ${i + 1}. oda.${ek} ${oda.tarif}${yarasaUyur}${i < MAGARA_ODALARI.length - 1 ? ' Yukarı kaydırırsan ilerlersin.' : ' Burası mağaranın sonu.'}`;
  M.olay(d, 'magara', m, 3, { oda: oda.id });
  return m;
}
export function magaraIlerle(d) {
  const k = d.k;
  if (!k.magara) return 'Mağarada değilsin.';
  if (k.magara.oda >= MAGARA_ODALARI.length - 1) {
    const m = 'Mağaranın en iç noktasındasın; daha ileri gidilmiyor.';
    M.olay(d, 'hata', m, 2);
    return m;
  }
  return odaGir(d, k.magara.oda + 1);
}
export function magaraGeri(d) {
  const k = d.k;
  if (!k.magara) return 'Mağarada değilsin.';
  if (k.magara.oda === 0) return magaradanCik(d);
  return odaGir(d, k.magara.oda - 1);
}
export function magaradanCik(d) {
  const k = d.k;
  if (!k.magara) return 'Mağarada değilsin.';
  k.magara = null;
  const m = 'Mağaradan çıktın. Gözlerin yeniden gün ışığına alışıyor.';
  M.olay(d, 'magara', m, 3, { cikis: true });
  return m;
}
export const odaTarifi = (k) => (k.magara ? `${MAGARA_ODALARI[k.magara.oda].ad}. ${MAGARA_ODALARI[k.magara.oda].tarif}` : '');

// ---------- Kaçak avcılık: tel tuzaklar (karar 60) ----------
const OTCULLAR = ['zebra', 'ceylan', 'impala', 'gnu', 'domuz', 'manda', 'zurafa'];
export function tuzakKurulumu(d) {
  // Günde bir çağrılır: kaçak avcılar bazen otçulların yollarına tel tuzak kurar
  const k = d.k;
  const devriye = k.koruma && k.koruma.devriye;
  const mucadele = k.koruma && k.koruma.projeler && k.koruma.projeler.kacakMucadele && k.koruma.projeler.kacakMucadele.durum === 'tamam';
  const baski = k.hikaye && k.hikaye.sayac && k.hikaye.sayac.kacakBaski >= M.gunNo(k.dk); // Aşama 10: gizem çözülünce kamp boşaltıldı
  const sans = 0.3 * (devriye ? 0.35 : 1) * (mucadele ? 0.5 : 1) * (baski ? 0.2 : 1) * M.zorlukCarpani(k, 'afet', [0.25, 1, 1.5]);
  if (k.kacak.tuzaklar.length >= 4 || d.rng() > sans) return;
  const tur = OTCULLAR[Math.floor(d.rng() * OTCULLAR.length)];
  const h = TURLER[tur].habitat;
  for (let i = 0; i < 20; i++) {
    const a = d.rng() * Math.PI * 2;
    const r = h.r * (0.6 + d.rng() * 0.6);
    const x = h.x + Math.sin(a) * r;
    const y = h.y + Math.cos(a) * r;
    if (Math.hypot(x, y) > YARICAP - 8 || Math.hypot(x - ISTASYON.x, y - ISTASYON.y) < 40) continue;
    if (Math.abs(y - nehirY(x)) < NEHIR_YARI + 3) continue;
    k.kacak.tuzaklar.push({ id: k.sonrakiId++, x, y, dk: k.dk, bulundu: false, hayvanId: null, yakalanmaDk: 0 });
    return;
  }
}
export const yakinTuzak = (d, r = 6) => d.k.kacak.tuzaklar.filter((t) => M.mesafe(d.oyuncu, t) < r).sort((a, b) => M.mesafe(d.oyuncu, a) - M.mesafe(d.oyuncu, b))[0] || null;
// Her karede: tuzağı fark etme, tuzağa hayvan takılması, takılı kalan hayvanın ölümü
export function kacakGuncelle(d) {
  const k = d.k;
  if (!k.kacak) return;
  const o = d.oyuncu;
  for (const t of k.kacak.tuzaklar) {
    const m = M.mesafe(o, t);
    if (!t.bulundu && m < 7 && !k.magara) {
      t.bulundu = true;
      const b = t.hayvanId ? M.birey(d, t.hayvanId) : null;
      const durum = b && !b.olu ? ` ${M.BuyukHarf(M.bireyAdi(b))} tuzağa takılmış!` : '';
      const iz = d.rng() < 0.5 ? ' Çevrede insan ayak izleri ve söndürülmüş bir kamp ateşi var.' : '';
      if (iz) k.kacak.izler += 1;
      M.olay(d, 'kacakTuzak', `Dikkat! Yerde, otların arasına gizlenmiş bir kaçak avcı tel tuzağı var, ${yerTarifi(o, t)}.${durum}${iz} Menüden tuzağı söküp yaban hayatı servisine bildirebilirsin.`, 4, { id: t.id });
      M.arsivOlay(d, `Kaçak avcı tel tuzağı bulundu, ${M.bolgeAdi(t.x, t.y)}.`);
    }
    // Kamera tuzağı yakınındaki kaçak avcı izlerini fotoğraflar
    if (!t.bulundu && !t.kamera) {
      const kt = k.tuzaklar.find((c) => M.mesafe(c, t) < 18);
      if (kt) {
        t.kamera = true;
        M.mesajEkle(k, `Kamera tuzağı (${kt.bolge}) gece fenerli iki insanın tel tuzak kurduğunu görüntüledi. Tuzak kamerasının yakınında, ${M.bolgeAdi(t.x, t.y)} bölgesinde olmalı.`, 'ekosistem');
      }
    }
  }
  // Hayvan takılması: oyun saatinde bir kez denenir
  if (!d.sonTuzakDk || k.dk - d.sonTuzakDk >= 60) {
    d.sonTuzakDk = k.dk;
    for (const t of k.kacak.tuzaklar) {
      if (t.hayvanId) {
        const b = M.birey(d, t.hayvanId);
        if (!b || b.olu) {
          t.hayvanId = null;
          continue;
        }
        if (k.dk - t.yakalanmaDk > 2 * 1440) {
          b.tuzakta = null;
          M.hayvanOldur(d, b, 'kaçak avcı tel tuzağında öldü');
          k.kacak.olen += 1;
          t.hayvanId = null;
          M.mesajEkle(k, `Yaban hayatı servisi: bir ${kucukHarf(M.SOZ[b.tur])} tel tuzakta öldü. Tuzakları bulmak için sahayı dolaş, devriye başlat.`, 'ekosistem');
        }
        continue;
      }
      const av = k.hayvanlar.find((b) => !b.olu && !b.tuzakta && OTCULLAR.includes(b.tur) && Math.abs(b.x - t.x) < 3 && Math.abs(b.y - t.y) < 3);
      if (av && d.rng() < 0.35) {
        av.tuzakta = t.id;
        t.hayvanId = av.id;
        t.yakalanmaDk = k.dk;
        av.hastalik = av.hastalik || { id: 'yara', siddet: 0.5, gun: M.gunNo(k.dk), tedavi: false, goruldu: true };
        M.gecmisEkle(k, av, 'Kaçak avcı tel tuzağına takıldı');
        if (k.gpsli.includes(av.id)) M.mesajEkle(k, `GPS uyarısı: ${M.bireyAdi(av)} saatlerdir aynı yerde, ${M.bolgeAdi(av.x, av.y)}. Tuzağa takılmış olabilir!`, 'ekosistem');
      }
    }
  }
}
export function tuzakSok(d) {
  const k = d.k;
  const t = yakinTuzak(d, 6);
  if (!t) return 'Yakında bulunmuş bir tel tuzak yok.';
  if (t.hayvanId) {
    const b = M.birey(d, t.hayvanId);
    if (b && !b.olu) return `Önce tuzağa takılmış ${M.bireyAdi(b)} hayvanı kurtarılmalı. Numune ve veteriner menüsünden hayvanı kurtar.`;
  }
  k.kacak.tuzaklar = k.kacak.tuzaklar.filter((x) => x !== t);
  k.kacak.bulunan += 1;
  M.itibarEkle(d, 4);
  M.arsivOlay(d, 'Kaçak avcı tel tuzağı söküldü ve bildirildi.');
  return `Tel tuzağı söktün, konumuyla birlikte yaban hayatı servisine bildirdin. Servis bölgedeki devriyeyi artıracak. Şimdiye kadar ${k.kacak.bulunan} tuzak söktün.`;
}
// Tuzağa takılmış hayvanı kurtarma: veterinerle hemen, yoksa servis ekibi ertesi gün
export function tuzaktanKurtar(d) {
  const k = d.k;
  const t = k.kacak.tuzaklar.find((x) => x.hayvanId && M.mesafe(d.oyuncu, x) < 40);
  if (!t) return 'Yakında tuzağa takılmış bir hayvan yok.';
  const b = M.birey(d, t.hayvanId);
  if (!b || b.olu) return 'Tuzaktaki hayvan yaşamıyor.';
  if (!M.personelVar(k, 'veteriner')) {
    if (t.servis) return 'Yaban hayatı servisi haberdar; ekip yolda.';
    t.servis = true;
    return `Tuzağa takılmış, korkmuş bir hayvana yalnız yaklaşmak senin için de onun için de tehlikeli. Yaban hayatı servisine haber verdin; veteriner ekipleri yarın gelecek. Kendi veterinerin olsaydı hemen müdahale edebilirdi.`;
  }
  b.tuzakta = null;
  b.korku = Math.min(1, (b.korku || 0) + 0.8); // tuzak travması: bir süre çok ürkek (karar 109)
  t.hayvanId = null;
  k.kacak.tuzaklar = k.kacak.tuzaklar.filter((x) => x !== t);
  k.kacak.kurtarilan += 1;
  k.kacak.bulunan += 1;
  if (b.hastalik && b.hastalik.id === 'yara') b.hastalik.tedavi = true;
  b.alisma = Math.max(0, b.alisma - 0.2);
  M.gecmisEkle(k, b, 'Tel tuzaktan kurtarıldı, yarası tedavi edildi');
  M.itibarEkle(d, 8);
  M.arsivOlay(d, `${M.BuyukHarf(M.bireyAdi(b))} tel tuzaktan kurtarıldı.`);
  return `Veteriner ekip ${M.bireyAdi(b)} hayvanını uyuttu, bacağına dolanan teli kesti, yarasını temizleyip ilaç verdi. Hayvan uyanınca topallayarak sürüsüne döndü. Tuzak söküldü ve bildirildi.`;
}
// Günlük: servis ekibinin müdahalesi, yeni tuzaklar
export function kacakGunluk(d) {
  const k = d.k;
  k.kacak.tuzaklar.forEach((t) => {
    if (t.servis && t.hayvanId) {
      const b = M.birey(d, t.hayvanId);
      t.hayvanId = null;
      if (b && !b.olu) {
        b.tuzakta = null;
        b.korku = Math.min(1, (b.korku || 0) + 0.8);
        if (b.hastalik && b.hastalik.id === 'yara') b.hastalik.tedavi = true;
        M.gecmisEkle(k, b, 'Yaban hayatı servisi tel tuzaktan kurtardı');
        k.kacak.kurtarilan += 1;
        M.mesajEkle(k, `Yaban hayatı servisi: ekiplerimiz ${M.bireyAdi(b)} hayvanını tel tuzaktan kurtardı ve tuzağı söktü. Bildirimin için teşekkürler.`, 'ekosistem');
      }
      t.sokuldu = true;
    }
  });
  k.kacak.tuzaklar = k.kacak.tuzaklar.filter((t) => !t.sokuldu);
  tuzakKurulumu(d);
}

// ---------- Yarasaların akşam çıkışı ----------
export function yarasaGuncelle(d) {
  const k = d.k;
  const gun = M.gunNo(k.dk);
  const saat = M.gunDakikasi(k.dk) / 60;
  if (saat < 18.3 || saat > 19.2 || k.yarasaGunu === gun) return;
  k.yarasaGunu = gun;
  const m = M.mesafe(d.oyuncu, MAGARA);
  if (k.magara && MAGARA_ODALARI[k.magara.oda].id === 'yarasa') {
    M.olay(d, 'yarasaCikisi', 'Tepende bir hışırtı başladı: binlerce yarasa uyanıp mağaranın ağzına doğru akın ediyor. Kanat rüzgârı yüzüne vuruyor.', 4);
    kucukKaydet(d, 'misirYarasasi');
  } else if (m < 60 && !k.magara) {
    M.olay(d, 'yarasaCikisi', `Akşam oldu: mağaranın ağzından binlerce meyve yarasası kara bir bulut gibi çıkıyor, ${yerTarifi(d.oyuncu, MAGARA)}. Gece boyunca kilometrelerce uçup meyve arayacaklar.`, 4);
    if (!k.arsiv.kucukler.yarasaCikisi) {
      k.arsiv.kucukler.yarasaCikisi = { ilkDk: k.dk, ilkBolge: 'Mağara girişi', sayi: 1, ozel: true };
      M.itibarEkle(d, 5);
      M.arsivOlay(d, 'Gözlendi: yarasaların akşam çıkışı.');
    }
    kucukKaydet(d, 'misirYarasasi', '');
  } else if (m < 140 && !k.magara) M.olay(d, 'yarasaCikisi', '', 0);
}
