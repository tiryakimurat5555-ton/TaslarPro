// Vahşi Yaşam — erişilebilir, kendi sesiyle konuşan 3B doğa araştırması ve ekosistem simülasyonu (Afrika savanı).
// Tasarım: 113 kararlık proje brifi. Aşama 1-6: teknik temel, saha, hayvanlar ve gözlem, araştırma merkezi, ekosistem,
// içerik (küçük canlılar, mağara, afetler, kaçak avcılık, koruma projeleri).
// Kayıp Okyanus düzeni: sahada tam ekran dokunma hareketleri, menüler kendi kendini okuyan listeler (oyun/SesliListe.js)
// ve alt menü yığını. VoiceOver ile oynarken aynı menüler VoiceOver düğmeleri olarak çizilir.
// Yapı: oyun/veri.js, oyun/mantik.js (saf mantık), oyun/merkez.js (araştırma merkezi), oyun/ses.js (konuşma),
// oyun/efekt.js (3B konumlu sesler), oyun/sahne.js (3B çizim), oyun/jestler.js (dokunma hareketleri).
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { View, Text, Pressable, StyleSheet, AccessibilityInfo, AppState } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { GLView } from 'expo-gl';
import * as Haptics from 'expo-haptics';
import { setAudioModeAsync, setIsAudioActiveAsync } from 'expo-audio';
import * as ScreenOrientation from 'expo-screen-orientation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Ses from './oyun/ses.js';
import * as M from './oyun/mantik.js';
import * as Mz from './oyun/merkez.js';
import * as E from './oyun/ekosistem.js';
import * as K from './oyun/kesif.js';
import * as G from './oyun/genisleme.js';
import * as Iz from './oyun/izler.js';
import * as H from './oyun/hikaye.js';
import * as S from './oyun/su.js';
import * as Y from './oyun/yonetim.js';
import * as Sy from './oyun/sosyal.js';
import * as Il from './oyun/iletisim.js';
import * as Ps from './oyun/psikoloji.js';
import * as Bo from './oyun/botanik.js';
import * as Ur from './oyun/ureme.js';
import * as Ya from './oyun/yayin.js';
import * as Ik from './oyun/iklim.js';
import * as Gc from './oyun/gece.js';
import * as Hd from './oyun/hedefler.js';
import * as Bg from './oyun/baglar.js';
import * as Kr from './oyun/kirlilik.js';
import { KUCUKLER, KUCUK_SIRASI, GRUPLAR, MAGARA_ODALARI, UZAK_ALANLAR, odaListesi, aktifOda, bolumAdi, KUCUK_SESLI, bulunabilirler } from './oyun/kucukler.js';
import * as Efekt from './oyun/efekt.js';
import { sahneKur } from './oyun/sahne.js';
import { TURLER, TUR_SIRASI, YERLER, DAVRANISLAR, EVRELER, BOLGE_ADLARI, ARAC, OZEL_BIREYLER, GECITLER, ISTASYON, nehirY, GOLET, GALERI, KAYALIK, NEHIR_YARI, KUTUP, KUTUP_SIRASI } from './oyun/veri.js';
import * as Kt from './oyun/kutup.js';
import { useJestler } from './oyun/jestler.js';
import { Liste, useMenuYigini, altMenu, sayfali, RENK, GORUNUM } from './oyun/SesliListe.js';
import * as B from './oyun/betimleme.js';
import * as Eg from './oyun/egitim.js';

const OYUN_ADI = 'Vahşi Yaşam';
const AYAR_ANAHTAR = 'vahsi-yasam-ayar-v1';
const KAYIT_ANAHTAR = 'vahsi-yasam-kayit-v1';
const YEDEK_ANAHTAR = 'vahsi-yasam-yedek-v1'; // 5 dakikada bir alınan yedek (bozuk kayda karşı)
const HATA_ANAHTAR = 'vahsi-yasam-hata-v1'; // son 20 hata (Ayarlar > Hata kayıtları)
const VARSAYILAN_AYAR = {
  kip: null, hiz: 1.0, titresim: true, rehber: true, efekt: true, efektKis: true, ortam: true,
  // Aşama 7: kontrol özelleştirme ve erişilebilirlik (karar 31, 32)
  grafik: 'yuksek', hassasiyet: 'orta', surekliYuru: false, buyukDugme: false, solEl: false, kontrast: false, buyukYazi: false,
  sesAltyazi: false, ortamDuzey: 'orta', otoBetimle: true, donusTiki: true, kesifAnlari: true, kameraUzak: 'normal', kameraAci: 'arka', fotoAcisi: true, muzik: 'dusuk',
};
const ORTAM_DUZEY = { dusuk: 0.2, orta: 0.35, yuksek: 0.5 };
// Aşama 25 (karar 30): dinamik müzik düzeyleri; gündüz, gece ve gerilim parçaları duruma göre birbirine geçer
const MUZIK_DUZEY = { kapali: 0, dusuk: 0.12, orta: 0.2, yuksek: 0.3 };
const MUZIK_ADI = { kapali: 'kapalı', dusuk: 'düşük', orta: 'orta', yuksek: 'yüksek' };
let gerilimSon = -1e9;
function muzikHedefi(d) {
  const k = d.k;
  const ev = M.evreSimdi(k);
  const temel = (k.magara && !k.magara.alan) || ev === 'gece' || ev === 'aksam' ? 'muzik_gece' : 'muzik_gunduz';
  if (M.gerilimVar(d)) gerilimSon = d.zaman;
  const gerilim = d.zaman - gerilimSon < 12;
  return gerilim ? { muzik_gerilim: 1, [temel]: 0.2 } : { [temel]: 1 };
}
const KAMERA_UZAK = { yakin: 'yakın', normal: 'normal', uzak: 'uzak' };
const KAMERA_ACI = { arka: 'arkadan', yuksek: 'yukarıdan', sag: 'sağdan', sol: 'soldan', on: 'önden' };
// Hayvan koşu sesleri (3B, uzaklıkla kısılır)
const KUCUK_DUZEY = 0.5; // küçük canlıların uzaktan çağrıları
const KOSU_DUZEY = { kosu_toynak: 0.8, kosu_hafif: 0.7, kosu_agir: 0.95, kosu_pati: 0.65 };

// ---------- Ses efektleri genişlemesi ----------
// Hayvanların gündelik sesleri: o an yaptıklarına göre (su içme, otlama, yavru çağrısı, leş başı, su aygırı, fil hortumu).
// En yakın uygun grup seçilir; her grup kendi aralığıyla (gundelikSon) ses verir.
const YAVRU_SESI = { fil: 'h_yavru_fil', zebra: 'h_yavru_zebra', aslan: 'h_yavru_aslan' };
function gundelikSesSec(d, son, simdi) {
  const o = d.oyuncu;
  let en = null;
  for (const g of d.k.gruplar) {
    if (g.goc || (son.get(g.id) || 0) > simdi) continue;
    const t = TURLER[g.tur];
    if (!t) continue;
    const m = M.mesafe(o, g);
    if (m > 80) continue;
    let ses = null;
    let duzey = 0.7;
    let duyma = 30;
    if (g.tur === 'sirtlan' && g.plan === 'les') {
      ses = 'h_sirtlan_les';
      duzey = 0.9;
      duyma = 80;
    } else if (g.tur === 'suAygiri' && (g.plan === 'suda' || g.plan === 'camur')) {
      ses = 'h_suaygiri_su';
      duzey = 0.85;
      duyma = 60;
    } else if (g.tur === 'fil' && (g.plan === 'camur' || (g.plan === 'su' && g.icti)) && Math.random() < 0.6) {
      ses = 'h_fil_hortum';
      duzey = 0.8;
      duyma = 45;
    } else if (g.plan === 'su' && g.icti && !t.kus && Math.random() < 0.5) {
      ses = 'h_suIcme';
      duzey = 0.6;
      duyma = 20;
    } else if (YAVRU_SESI[g.tur] && Math.random() < 0.35 && M.uyeler(d, g).some((b) => b.evre === 'yavru')) {
      ses = YAVRU_SESI[g.tur];
      duzey = 0.7;
      duyma = 45;
    } else if (g.plan === 'otla' && !t.yirtici && !t.kus) {
      ses = 'h_otlama';
      duzey = 0.55;
      duyma = 22;
    }
    if (!ses || m > duyma) continue;
    if (!en || m < en.m) en = { g, ses, duzey, duyma, m };
  }
  if (!en) return null;
  // Ses grubun en yakın üyesinden gelir
  const uy = M.uyeler(d, en.g).filter((b) => !b.olu);
  const nokta = uy.length ? uy.reduce((a, b) => (M.mesafe(o, b) < M.mesafe(o, a) ? b : a)) : en.g;
  return { ...en, nokta };
}
// ---------- Katmanlı ortam sesi ----------
// Temel ses (günün evresine göre savan ya da yağmur) her zaman çalar. Nehir ve gölet suyu, galeri ormanı ve kayalık
// katmanları oraya uzaklığa göre yükselir; kaynağın yönüne göre sola ya da sağa yatar. Yakındaki yangın da bir katman.
const ORTAM_MENZIL = { su: 60, galeri: 40, kayalik: 40 };
const sinirla01 = (x) => Math.max(0, Math.min(1, x));
// Eşit güçlü pan: kaynak önde ya da arkadaysa iki yarı eşit, yanda kaldıkça o taraf baskın. guc 0 = yönsüz (içindeyken).
function yonluKatman(h, ad, w, o, nokta, guc) {
  if (w <= 0.001) return;
  let rel = Math.atan2(nokta.x - o.x, nokta.y - o.y) - (o.yon || 0);
  const p = Math.max(-0.85, Math.min(0.85, Math.sin(rel) * guc));
  const a = ((p + 1) * Math.PI) / 4;
  h[ad + '_sol'] = (h[ad + '_sol'] || 0) + w * Math.cos(a);
  h[ad + '_sag'] = (h[ad + '_sag'] || 0) + w * Math.sin(a);
}
// En yakın su: nehir eğrisi (yatay tarama) ya da gölet suyu. { m: kıyıya uzaklık, nokta }
function enYakinSu(d) {
  const o = d.oyuncu;
  let en = { m: Infinity, nokta: null };
  for (let x = o.x - 70; x <= o.x + 70; x += 2.5) {
    const y = nehirY(x);
    const m = Math.hypot(x - o.x, y - o.y) - NEHIR_YARI;
    if (m < en.m) en = { m, nokta: { x, y } };
  }
  if (GOLET.su > 0) {
    const m = Math.hypot(o.x - GOLET.x, o.y - GOLET.y) - GOLET.su;
    if (m < en.m) en = { m, nokta: { x: GOLET.x, y: GOLET.y } };
  }
  return en;
}
function ortamHedefleri(d) {
  const k = d.k;
  const o = d.oyuncu;
  if (k.magara) return { [k.magara.alan ? UZAK_ALANLAR[k.magara.alan].ortam : 'ortam_magara']: 1 };
  if (M.oyuncuKutupta(k)) return kutupOrtami(d);
  const h = {};
  const ev = M.gunEvresi(k.dk);
  const gunduz = ev === 'gunduz' || ev === 'safak';
  const yagmur = !!(k.eko && k.eko.yagmurVar);
  let baskin = 0; // diğer katmanların en güçlüsü; temel ses ona göre kısılır
  // Su: kıyıya 60 metreden yükselir; kıyıda ya da suyun içindeyken yönsüz. Nehrin güneyindeki sulak alanda hep hafif su sesi.
  const su = enYakinSu(d);
  let ws = Math.pow(sinirla01(1 - Math.max(0, su.m) / ORTAM_MENZIL.su), 1.6);
  if (M.guneydeMi(o.x, o.y)) ws = Math.max(ws, 0.35);
  if (k.teknede) ws = 1;
  if (su.nokta) yonluKatman(h, 'ortam_nehir', ws, o, su.nokta, sinirla01((su.m - 3) / 15));
  baskin = Math.max(baskin, ws);
  // Galeri ormanı (gündüz): şeridin içinde yönsüz, dışında en yakın kenarından
  if (gunduz) {
    const ny = nehirY(Math.max(GALERI.x0, Math.min(GALERI.x1, o.x)));
    const gx = Math.max(GALERI.x0, Math.min(GALERI.x1, o.x));
    const gy = Math.max(ny, Math.min(ny + GALERI.derinlik, o.y));
    const m = Math.hypot(o.x - gx, o.y - gy);
    const wg = 0.9 * Math.pow(sinirla01(1 - m / ORTAM_MENZIL.galeri), 1.4);
    yonluKatman(h, 'ortam_galeri', wg, o, { x: gx, y: gy }, sinirla01(m / 12));
    baskin = Math.max(baskin, wg);
    const mk = Math.hypot(o.x - KAYALIK.x, o.y - KAYALIK.y) - KAYALIK.r;
    const wk = 0.85 * Math.pow(sinirla01(1 - Math.max(0, mk) / ORTAM_MENZIL.kayalik), 1.4);
    yonluKatman(h, 'ortam_kayalik', wk, o, KAYALIK, sinirla01(mk / 12));
    baskin = Math.max(baskin, wk);
  }
  // Yangın: 100 metreden yükselir
  const yy = M.yanginYakin(d);
  if (yy && yy.m < 100) {
    const wy = Math.pow(sinirla01(1 - yy.m / 100), 0.8);
    h.ortam_yangin = wy;
    baskin = Math.max(baskin, wy);
  }
  // Temel ses: yağmurda yağmur, yoksa günün evresine göre savan; diğer katmanlar baskınlaştıkça kısılır
  const temel = yagmur ? 'ortam_yagmur' : ev === 'safak' ? 'ortam_safak' : ev === 'aksam' ? 'ortam_aksam' : ev === 'gece' ? 'ortam_gece' : 'ortam_gunduz';
  h[temel] = Math.max(0.2, 1 - 0.75 * baskin);
  if (yagmur) for (const a of Object.keys(h)) if (a !== temel) h[a] *= 0.55;
  // Katmanlar üst üste binince toplam ses yükselmesin: güç toplamı 1'i geçerse hepsi orantılı kısılır
  const guc = Object.values(h).reduce((t, v) => t + v * v, 0);
  if (guc > 1) for (const a of Object.keys(h)) h[a] /= Math.sqrt(guc);
  return h;
}
// Kuzey Kutbu ortamı: temel tundra rüzgârı; açık suya yaklaştıkça dalga ve buz parçaları, deniz buzuna yaklaştıkça buzun gıcırtısı,
// kuş yarlarına yaklaştıkça koloni sesi (yazın); tipide fırtına hepsini bastırır
function kutupOrtami(d) {
  const k = d.k;
  const o = d.oyuncu;
  const h = {};
  const yakin = (m, menzil) => Math.pow(sinirla01(1 - Math.max(0, m) / menzil), 1.5);
  const l = Kt.yerel(o);
  const yuzey = Kt.yuzey(o.x, o.y, k.dk);
  let baskin = 0;
  const su = Kt.enYakinSu(o.x, o.y, k.dk);
  const ws = yuzey === 'su' ? 1 : yakin(Math.hypot(su.x - o.x, su.y - o.y), 70);
  h.ortam_kutup_deniz = 0.9 * ws;
  baskin = Math.max(baskin, 0.9 * ws);
  const bk = Kt.buzKenari(k.dk);
  const buzVar = bk < KUTUP.r - 5;
  const mb = yuzey === 'buz' ? 0 : buzVar ? Math.max(0, bk - l.y) : 999;
  const wb = 0.85 * yakin(mb, 80);
  h.ortam_kutup_buz = wb;
  baskin = Math.max(baskin, wb);
  const yaz = ['yaz', 'ilkbahar'].includes(M.kutupMevsimi(k));
  if (yaz) {
    const mk = Math.hypot(l.x - Kt.KUS_YARI.lx, l.y - Kt.KUS_YARI.ly) - Kt.KUS_YARI.r;
    const wk = 0.9 * yakin(mk, 90);
    h.ortam_kusyari = wk;
    baskin = Math.max(baskin, wk);
  }
  if (Kt.tipideMi(M.kutupHavasi(k), k.dk)) {
    h.ortam_tipi = 1;
    for (const a of Object.keys(h)) if (a !== 'ortam_tipi') h[a] *= 0.35;
    h.ortam_kutup = 0.2;
  } else h.ortam_kutup = Math.max(0.25, 1 - 0.7 * baskin);
  for (const a of Object.keys(h)) if (h[a] < 0.01) delete h[a];
  const guc = Object.values(h).reduce((t, v) => t + v * v, 0);
  if (guc > 1) for (const a of Object.keys(h)) h[a] /= Math.sqrt(guc);
  return h;
}
// Konumlu sürekli sesler: her biri 0-1 düzey (uzaklığa göre). Döngü çalarken yön değişmez, yalnız düzey.
const KONUMLU_DONGULER = ['jenerator', 'kamp_ates', 'selale'];
function konumluDonguler(d) {
  const k = d.k;
  const o = d.oyuncu;
  const r = {};
  if (k.magara) {
    if (k.magara.alan === 'dag') {
      const l = odaListesi('dag');
      const i = l.findIndex((x) => x.id === 'selale');
      const fark = Math.abs((k.magara.oda || 0) - i);
      r.selale = fark === 0 ? 0.6 : fark === 1 ? 0.18 : 0;
    }
    return r;
  }
  const yakinlik = (m, menzil) => (m >= menzil ? 0 : Math.pow(1 - m / menzil, 1.5));
  // Geçit şırıltısı (su_akis) kaldırıldı: 8,5 sn'lik döngüsü sürekli tekrar ediyordu; suyu artık katmanlı nehir sesi veriyor
  r.jenerator = 0.3 * yakinlik(Math.hypot(o.x - ISTASYON.x, o.y - ISTASYON.y), 50);
  const ev = M.gunEvresi(k.dk);
  if (k.kamp && (ev === 'aksam' || ev === 'gece')) r.kamp_ates = 0.45 * yakinlik(M.mesafe(o, k.kamp), 25);
  return r;
}
// Adım sesi düzeyleri zemine göre (su ve çamur doğal olarak daha gür)
const ADIM_DUZEY = { ot: 0.3, toprak: 0.27, camur: 0.27, su: 0.28, kaya: 0.26, yaprak: 0.3, magara: 0.3, kar: 0.3, buz: 0.28 }; // adım dosyaları aynı vuruş yüksekliğine eşit (araclar/adim-yap.py); ot ve yaprak biraz yukarıda
const ADIM_ARALIK = 1.5; // metre
const HASSASIYET = { dusuk: 130, orta: 90, yuksek: 60 }; // tam hız için sürükleme (piksel)

// ---------- Hata kayıtları (Aşama 7, çevrim dışı dayanıklılık): Murat'ın bana okuyabilmesi için ----------
const HATALAR = [];
function hataKaydet(e, yer) {
  const m = String((e && e.message) || e).slice(0, 200);
  if (HATALAR.some((h) => h.mesaj === m && h.yer === yer)) return false;
  HATALAR.unshift({ zaman: new Date().toISOString().slice(0, 16).replace('T', ' '), yer, mesaj: m, yigin: String((e && e.stack) || '').split('\n').slice(1, 3).join(' ').slice(0, 200) });
  if (HATALAR.length > 20) HATALAR.length = 20;
  AsyncStorage.setItem(HATA_ANAHTAR, JSON.stringify(HATALAR)).catch(() => {});
  return true;
}
const ADLAR = ['Defne', 'Kaan', 'Ada', 'Deniz', 'Ilgaz', 'Elif', 'Atlas', 'Zeynep', 'Toprak', 'Yağmur', 'Mert', 'Selin'];

const KipBaglam = createContext('kendi');
const KALICI_OLAYLAR = ['tanimlandi', 'yeniTur', 'yeniDavranis', 'foto', 'tanik', 'sesKayit', 'saldiri', 'analizBitti', 'gorevBitti', 'goc', 'salgin', 'numuneTeslim', 'mevsim', 'yeniKucuk', 'kacakTuzak', 'koruma', 'magara'];

// Sahadaki aletler (iki parmakla sağa/sola kaydırarak değişir, çift dokunuş kullanır)
const ALETLER = [
  { id: 'durbun', ad: 'Dürbün', ipucu: 'Çift dokununca sıradaki hayvanı gözlemlersin.', kullan: (d) => M.gozlemBaslat(d) },
  { id: 'kamera', ad: 'Fotoğraf makinesi', ipucu: 'Çift dokununca gözlediğin hayvanın fotoğrafını çekersin.', kullan: (d) => M.fotografCek(d) },
  { id: 'video', ad: 'Video kamera', ipucu: 'Çift dokununca gözlediğin hayvanı 10 saniye videoya çekersin; görüntüdeki davranışlar arşive kaydedilir.', kullan: (d) => { const m = Iz.videoBaslat(d); if (m) M.olay(d, 'hata', m, 3); } },
  { id: 'ses', ad: 'Ses kayıt cihazı', ipucu: 'Çift dokununca 6 saniye kayıt yapıp sesleri çözümlersin.', kullan: (d) => M.sesKaydiBaslat(d) },
  { id: 'yaklas', ad: 'Yaklaşma', ipucu: 'Çift dokununca gözlediğin hayvana ürkütmeden yaklaşırsın.', kullan: (d) => M.yaklas(d) },
  { id: 'dron', ad: 'Araştırma dronu', gerek: 'drone', ipucu: 'Çift dokununca dron baktığın yönde 110 metre öteye uçar, oradaki hayvanları sayıp haritaya işler ve geri döner.', kullan: (d) => { const m = G.dronBaslat(d); if (m) M.olay(d, 'hata', m, 3); } },
  { id: 'ara', ad: 'Büyüteç ve fener', ipucu: 'Çift dokununca yakındaki küçük canlıları ararsın: böcekler, kuşlar, kurbağalar, sürüngenler. Hemen ardından fotoğraf makinesiyle fotoğrafını çekebilirsin.', kullan: (d) => K.kucukAra(d) },
];
// Elindeki aletler: dron yalnızca satın alınınca listeye girer
const aletlerAl = (k) => ALETLER.filter((a) => !a.gerek || (k.ekipman && k.ekipman[a.gerek]));
const OLU_BOLGE = 0.12;
let tamSurukleme = 90; // bu kadar piksel sürükleyince tam hız (Ayarlar > Kontroller > Hassasiyet)
function olcekle(piksel) {
  const v = Math.max(-1, Math.min(1, piksel / tamSurukleme));
  if (Math.abs(v) < OLU_BOLGE) return 0;
  return Math.sign(v) * ((Math.abs(v) - OLU_BOLGE) / (1 - OLU_BOLGE));
}

function titret(tur, ayar) {
  if (!ayar || !ayar.titresim) return;
  try {
    if (tur === 'hafif') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    else if (tur === 'orta') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    else if (tur === 'agir') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    else if (tur === 'iyi') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    else if (tur === 'kotu') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  } catch (e) {}
}

// VoiceOver kipinde sahadaki düğmeler
function Dugme({ etiket, ipucu, onEtkin, stil, devre }) {
  return (
    <Pressable
      onPress={() => !devre && onEtkin && onEtkin()}
      accessibilityRole="button"
      accessibilityLabel={etiket}
      accessibilityHint={ipucu}
      accessibilityState={{ disabled: !!devre }}
      style={({ pressed }) => [st.dugme, GORUNUM.kontrast && st.dugmeK, stil, devre && st.dugmeDevre, pressed && st.dugmeBasili]}
    >
      <Text style={[st.dugmeYazi, GORUNUM.kontrast && st.dugmeYaziK, GORUNUM.buyukYazi && st.dugmeYaziB]} numberOfLines={3}>
        {etiket}
      </Text>
    </Pressable>
  );
}

const geriOgesi = (f) => ({ id: 'geri', etiket: 'Geri', ikincil: true, sec: () => (f(), 'sessiz') });
const zamanKisa = (dk) => `${M.gunNo(dk)}. gün ${M.saatMetni(dk)}`;
const kucuk = (s) => s.toLocaleLowerCase('tr-TR');

// ---------------- Yenilikler (en yeniler üstte): Murat denerken neyin nerede olduğunu bulsun diye ----------------
const YENILIKLER = [
  { baslik: 'Yeni bölge: Kuzey Kutbu', metin: 'Kuzeydoğu Grönland kıyısında, savandan ayrı, serbestçe dolaşılan büyük bir harita. Kutup ayısı, halkalı fok, mors, beluga, ren geyiği, misk öküzü, kutup kurdu, kutup tilkisi ve kutup tavşanı yaşıyor; her birinin kendi sesi var. Yazın güneş batmaz, kışın hiç doğmaz; deniz mevsime göre donup çözülür, tipi çıkar, kış gecelerinde kuzey ışıkları görünür. 21 kutup küçük canlısı ve 6 kutup bitkisi, karda ve buzda adım sesleri, rüzgâr, buz, deniz ve kuş yarı ortam sesleri eklendi. İtibarın 50 olunca açılır.', nerede: 'Araştırma merkezi, Saha gezileri: Kuzey Kutbu, yola çık. Yardım, Kuzey Kutbu.' },
  { baslik: 'Zaman artık atlanmıyor', metin: 'Tasarımdaki zaman kuralına uymak için Dinlen menüsü ve Deneme araçlarındaki zamanı ileri alma kaldırıldı. Zaman yalnız oyun açıkken, gerçek akışıyla geçer. Saha kampı hayvanlardan saklanman ve dronunu şarj etmen için duruyor; fırtınada yırtılırsa onarana kadar seni saklamaz. Saha gezilerinin ücreti artık yakıt değil alan izni ve konaklama; araç yakıtı sınırsız.', nerede: 'ana menü; Durum, ayarlar, yardım ve kayıt, Deneme araçları.' },
  { baslik: 'Su kirliliği ve hayvanların kendini tedavi etmesi', metin: 'Su artık kirlenebiliyor. Suyun içinde ya da kıyısında çürüyen bir leş bakteri yükünü artırır. Kurak mevsimde nehir sığlaşınca su aygırlarının toplandığı yerde dışkı birikir, suyun oksijeni azalır; çok azalırsa balıklar ölebilir. Yangından sonraki ilk yağmur yanık alanın külünü suya taşır. Kirli sudan içen hayvanlar parazit kapabilir. Su ölçümü oksijenin düştüğünü ve kirliliğin kaynağını söyler, su numunesi bakteri, amonyak ya da kül bulgusu verir. Nehir akarak kendini temizler, gölet daha yavaş. Ayrıca hasta hayvanlar kendini tedavi ediyor: parazitli babunlar çöl hurmasının acı meyvesini, parazitli filler kil yiyor. Bu nadir davranışları gözlemleyebilirsin.', nerede: 'Doğa, Su araştırması, Kirlilik kaynakları; Doğa, Ekosistem raporu; sahada gözlem.' },
  { baslik: 'Dinamik müzik, toprak ve kıl numunesi, mağara bitkileri', metin: 'Oyunda artık arka plan müziği var: gündüz kalimba ve marimbalı sakin bir müzik, gece gizemli alçak bir müzik çalar. Yakında tehlikeli bir hayvan varsa, yakınlarda bir kovalamaca sürüyorsa ya da yangın yaklaşıyorsa müzik birkaç saniyede gerilimli davullara geçer, tehlike geçince yavaşça sakinleşir. Müzik hayvan seslerini bastırmasın diye düşük başlar; Ayarlar, Ses ve konuşma bölümünden kapatabilir ya da açabilirsin. Numune menüsünde iki yeni numune var: toprak numunesi bölgenin toprağını, nemini, külünü ve tuzunu gösterir; kıl ya da tüy numunesi hayvana dokunmadan DNA, son haftaların stres düzeyi ve uyuz gibi deri asalakları hakkında bilgi verir. Mağarada iki bitki var: su sızan duvarlarda baldıran kara eğreltisi ve tavandan kökleri sarkan kaya inciri.', nerede: 'Ayarlar, Ses ve konuşma, Müzik; Doğa, Numune ve veteriner; mağarada Doğa, Çevredeki bitkiler.' },
  { baslik: 'Sosyal bağlar, dışlanma, koalisyonlar ve kamera ayarları', metin: 'Sürü hayvanları artık birbirleriyle bağ kuruyor: birlikte tımarlaşan, oynayan, birbirini teselli eden ve akraba olan bireylerin bağı güçleniyor, görüşmeyenlerinki zayıflıyor. Stresli bir hayvanı önce en yakın bağı olan arkadaşı teselli ediyor. Yakın bağını kaybeden hayvan sarsılıyor. Hiç yakın bağı olmayan alt sıradaki bir birey bazen sürüden dışlanıyor; sürünün kenarında yalnız kalıyor, birkaç gün sonra ya yeniden kabul ediliyor ya da bağ kurana kadar zorlanıyor. Aslan erkekleri koalisyon kurup bölgeyi birlikte koruyor; meydan okuyan erkeğe karşı birbirlerini destekliyorlar. Birey sayfasında sosyal bağları yazıyor. Görünüm ayarlarında kamera uzaklığı ve açısı seçilebiliyor; fotoğraf çekince kamera iki saniye hayvana yaklaşıyor, araç hızlanınca kamera alçak bir takip açısına geçiyor.', nerede: 'Arşiv, birey sayfası; sahada dürbünle; Ayarlar, Görünüm ve grafik.' },
  { baslik: 'Değişen göç yolları, göç tehlikeleri, göz parıltısı ve büyük hedefler', metin: 'Göçmen sürüler artık her göçte yolunu yeniden seçer: geçitte timsahlar bekliyorsa, çevrede yangın varsa, nehir taşkındaysa ya da önceki göçte o geçitte kayıp verdilerse öbür geçide yönelirler. Nehri geçerken izdiham olabilir; bazı hayvanlar ezilip yaralanır, akıntı yüksekken yavrular sürüklenebilir. Göç dönüşünde kaç hayvanın neden dönmediği tahmin edilir: yolda avcılar, susuzluk, hastalık, açlık ve insan faaliyetleri. Gece Doğa menüsünden fenerle göz parıltısı tarayabilirsin: gözlerin rengi, yüksekliği ve kaç çift olduğu hayvanı tanıtır; timsahların gözü kırmızı parlar, babunlarınki hiç parlamaz. Merkezde altı büyük hedef var: Savan Atlası, Nesiller boyu, Koruma programı, Bilim insanı, Yaşam alanları haritası ve Uzun soluklu izleme. Hepsi bitince de araştırma sürer.', nerede: 'Merkez, Ekolojik yönetim, Göç takibi; Doğa menüsü (gece); Merkez, Büyük hedefler.' },
  { baslik: 'Fırtınalar, sıcak dalgaları, iklim kaydı ve araştırma fırsatları', metin: 'Bazı sağanaklar sert rüzgârlı fırtınaya döner. Fırtınadan yaklaşık iki saat önce uyarı gelir; Doğa menüsünden ekipmanı sabitlersen zarar görmezsin. Sabitlemezsen kamera tuzakları devrilebilir, kamp çadırı yırtılabilir, istasyonun çatısı hasar görür; devrilen tuzakları ve çadırı yerinde düzeltirsin. Kurak mevsimde ara sıra olağan dışı sıcak dalgası gelir: gölet hızla çekilir, yavrular ve yaşlı hayvanlar zorlanır. Ekosistem raporunda yıllık yağış ve sıcaklığı tutan bir iklim kaydı var; yıllar geçtikçe uzun vadeli eğilimi gösterir. Salgın, göç, yangın, kaçak avcı tuzağı, kuraklık, sıcak dalgası ve doğum gibi olaylar artık kurumlardan yeni araştırma fırsatları getirir. Sürüler dinlenirken birinin nöbet tuttuğunu görebilirsin; tür sayfasında türün nasıl uyuduğu yazar.', nerede: 'Doğa menüsü; Doğa, Ekosistem, İklim kaydı; Merkez, Görevler; Arşiv, tür sayfası.' },
  { baslik: 'Gebelik, kur davranışı ve bilimsel yayınlar', metin: 'Hayvanlar artık önce eşleşir, sonra gebe kalır ve birkaç gün sonra doğurur. Eşleşme günü kur davranışını dürbünle görebilirsin: aslanlar, filler, zebralar, impalalar ve öteki türler kendi biçimlerinde kur yapar. Gebeliğin ikinci yarısında dişinin karnı belirginleşir; gözlemde söylenir, birey sayfasında doğumun yaklaşık ne zaman olacağı yazar. Anneler uzaklaşan yavrularını çağırır. Ses kaydı artık kur çağrısını ve annenin yavrusunu çağırmasını da ayırt eder. Merkezde Yayınlar bölümü var: tamamlanan her araştırmadan makale yazıp üç dergiden birine gönderirsin; hakemler kabul eder, düzeltme ister ya da reddeder. Yayımlanan makaleler itibar, fon ve zamanla atıf getirir. Dört bilimsel kuruluş belli verileri bir kez paylaşmanı ister; karşılığında destek verir.', nerede: 'sahada dürbünle; Arşiv, birey sayfası; Merkez, Yayınlar ve iş birlikleri.' },
  { baslik: 'Tozlaşma, tohum yayılımı ve böcek kolonileri', metin: 'Bitkiler artık canlı bir döngü yaşıyor. Çiçek açan bitkilerin yanındayken arıların, güneş kuşlarının ya da rüzgârın onları tozlaştırdığını duyarsın. Filler, zürafalar, impalalar ve babunlar akasya ve çöl hurması meyvelerini yer, tohumları dışkılarıyla uzağa taşır; bok böcekleri dışkıyı gömer, yağmurlar gelince tohumlar filizlenir, fideler fidana, fidanlar genç ağaca döner. Bunları bulup inceleyebilirsin. Dört böcek kolonisi var: termit tepeleri, yabani bal arısı kovanı, ordu karıncaları ve galeri ormanındaki dokumacı karıncalar. Koloniler saate, mevsime ve yağmura göre farklı şeyler yapar: termitlerin çiftleşme uçuşu, arıların oğul vermesi, karınca akınları.', nerede: 'Doğa bölümünde Tohum ve fideler ile Böcek kolonileri; Arşiv, bitki sayfası.' },
  { baslik: 'Stres, travma ve teselli', metin: 'Hayvanların artık bir stres düzeyi var. Sürüsünden ayrı düşmek, annesini kaybetmek, sıralama kavgasını kaybetmek, avcıdan kıl payı kurtulmak ya da tel tuzağa düşmek stres verir; stresli hayvan daha tetiktedir, daha uzaktan kaçar ve uzun sürerse zayıflar. Her birey kişiliğine göre toparlanır: cesurlar çabuk, ürkekler yavaş. Filler, babunlar, aslanlar, zebralar ve yaban köpekleri stresli grup arkadaşlarını teselli eder; bunu dürbünle görebilirsin. Sürüsünden ayrı kalan hayvan durup uzun uzun çağırır.', nerede: 'sahada dürbünle; Arşiv, birey sayfasında sağlık dosyası.' },
  { baslik: 'Kalıtsal görünüş', metin: 'Her hayvanın kalıtsal bir görünüşü var: kara ya da açık yeleli aslanlar, kalın ya da ince çizgili zebralar, uzun dişli filler, koyu ve iri lekeli zürafalar. Yavrular bu özelliği anne ve babasından alır, mizaçları da çoğunlukla anneye benzer. Belirgin olanlar dürbünle gözlerken söylenir; bireyleri ayırt etmeyi kolaylaştırır. Ekranda da hayvanların rengi biraz farklıdır.', nerede: 'gözlem tarifinde; Arşiv, birey sayfasında Görünüş satırı.' },
  { baslik: 'Garaj: ATV, arazi motosikleti ve araştırma kamyonu', metin: 'Merkezden üç yeni araç alınabilir. ATV arazi aracından hızlı ve çeviktir; arazi motosikleti en hızlısıdır ama gürültülüdür. İkisi de açık olduğu için hayvanlar seni daha kolay fark eder, sürücü selede görünür. Araştırma kamyonu yavaştır ama arkasında mobil laboratuvar vardır: numunelerini istasyona dönmeden kamyona teslim edersin, dronun kamyonda şarj olur ve hayvanlar onu en az fark eder. Her aracın motor sesi farklı perdededir. Sahada tek araç durur; istasyondayken garajdan değiştirirsin.', nerede: 'Merkez, Ekipman bölümünde satın al; Merkez, Garaj bölümünde seç.' },
  { baslik: 'Hayvanlar arasında iletişim', metin: 'Hayvanlar artık birbirleriyle haberleşir. Aslanlar, leoparlar, çitalar, sırtlanlar, yaban köpekleri ve gergedanlar bölgelerini kokuyla işaretler; İzleri incele bu koku işaretlerini de bulur ve bölgenin sahipli olduğunu söyler. Filler, aslanlar, zebralar ve sırtlanlar selamlaşır; yaban köpekleri ava çıkmadan önce selamlaşma töreni yapar. Geceleri aslanlar hep birlikte kükrer, uzaktan duyarsın. Filler bazen durup uzaktaki sürülerin alçak gürlemelerini dinler. Yakında yırtıcı varken impala, ceylan, zebra ve gnu beden diliyle sürüyü uyarır. Tür sayfasında türün iletişim biçimleri yazar.', nerede: 'sahada dürbünle; Doğa, İzleri incele; Arşiv, tür sayfası.' },
  { baslik: 'Su başında tedirginlik', metin: 'Su içmeye gelen otçullar su başında timsah görürse ya da orada kısa süre önce av olmuşsa hemen içmez; durup tedirgin bekler. Çok susamışlarsa başlarını sık sık kaldırarak hızlı hızlı içip uzaklaşırlar, değilse öbür su kaynağına giderler. Sıcak günlerde ve kurak mevsimde hayvanlar daha sık susar, yağmurlu günlerde daha az; yavrulu sürüler daha çok içer.', nerede: 'gölet ve nehir kıyısında dürbünle.' },
  { baslik: 'Kesik kesik adım sesi', metin: 'Yürürken üç dört adımdan sonra yarım saniyelik boşluk olması için olası bir sebep düzeltildi: telefonda bir ses dosyası sonuna kadar çaldıktan sonra yeniden çalınırken başa sarılması bitmeden başlatılıyor, o adım sessiz kalabiliyordu. Artık başa sarma bittikten sonra çalınıyor ve her ses çalıp bitince bir sonraki sefer için önceden başa sarılıyor. Bu düzeltme bütün ses efektlerini etkiler.', nerede: 'sahada yürürken.' },
  { baslik: 'Orman adım sesi', metin: 'Galeri ormanında ve yeşil akasyalıkta, yani yaprak döküntüsü üstünde yürürken çıkan adım sesi düzeltildi: eskiden neredeyse yalnız tiz bir hışırtıydı ve her adımın kuyruğu bir sonraki adıma kadar sürdüğü için adımlar birbirine karışıp sürekli bir "şşş" sesine dönüyordu. Artık her adım kısa bir yaprak çıtırtısı ve belirgin bir ayak basışı; adımlar tek tek duyuluyor.', nerede: 'galeri ormanında ve akasyalıkta yürürken.' },
  { baslik: 'Adım sesleri yenilendi', metin: 'Karakterin adım sesleri baştan hazırlandı: bazı adımlarda asıl basış 0,2 saniye geç geliyordu, ritim aksak duyuluyordu; artık her adım basış anında başlıyor. Bazı adımlar sert kesilip çıt sesi yapıyordu, artık yumuşakça bitiyor. Suda ve çamurda tek dosyada iki adım duyulan sesler ayrıldı. Otta ve yapraklarda ses neredeyse yalnız hışırtıydı; altına ayağın yere basış sesi eklendi. Bütün zeminlerde dört adımın yüksekliği eşit; sıkıştırma gecikmesi olmasın diye dosyalar sıkıştırılmamış.', nerede: 'sahada yürürken.' },
  { baslik: 'Araç motoru ve dron sesi', metin: 'Araç motorunun döngüsü yenilendi: eski döngüde her 4,5 saniyede bir gaz verip bırakma sesi tekrar ediyordu; artık sabit devirli bir bölümden, dikişsiz ve 15 saniyelik. Hızlandıkça perdesi yine yükselir. Dron artık uçtuğu sürece kesintisiz duyulur: havalanıp uzaklaştıkça sesi giderek kısılır ve perdesi biraz düşer, dönerken giderek yaklaşır, yükselir; ses dronun bulunduğu yönden gelir.', nerede: 'araç sürerken; dronu aletlerden seçip çift dokununca.' },
  { baslik: 'Durmayan su ve koşu sesi düzeltildi', metin: 'Oyun yeniden açılınca bazı hayvanlar (özellikle gölet ve nehir kıyısındaki filler) eski oturumdan kalan bir zaman yüzünden saatlerce koşuyor sayılıyordu; çamurda koşu sesi hiç durmuyordu. Düzeltildi. Nehir geçidinin kısa şırıltı döngüsü kaldırıldı (su sesini artık katmanlı nehir sesi veriyor). Bütün ortam döngülerinin sonundaki kısa sessizlik giderildi, döngü dönerken kesinti olmamalı. Hayvanların su içme ve otlama sesleri seyreltildi.', nerede: 'sahada, özellikle nehir ve gölet kıyısında.' },
  { baslik: 'Zemine göre hayvan koşu sesleri', metin: 'Kaçan, kovalayan ve hamle yapan hayvanların koşu sesi artık bastıkları zemine göre: otta ve ormanda boğuk tok vuruşlar ve ot hışırtısı, kuru toprakta ve kayalıkta sert toynak sesi, suda ve çamurda şapırtı. Her biri toynaklı, hafif ceylan, ağır fil ve manda, pati (kediler, sırtlan, yaban köpeği) olarak ayrı. Arkadan gelen seslerdeki metalik çınlama giderildi.', nerede: 'sahada, hayvanlar koşarken.' },
  { baslik: 'Katmanlı ortam sesi', metin: 'Ortam sesleri artık gerçekteki gibi birbirine karışıyor: nehrin ya da göletin sesi 60 metreden hafifçe duyulmaya başlar, yaklaştıkça yükselir; galeri ormanı ve kayalığın sesleri 40 metreden. Su ve orman sesi geldiği yönden duyulur: nehir sağındaysa sağ kulağında, ona dönünce iki kulağında. Kıyıda savan, orman ve su sesi bir arada. Bölge sınırında ses artık birden değişmiyor.', nerede: 'sahada kendiliğinden; kulaklıkla yön daha iyi duyulur.' },
  { baslik: 'Yeni ses efektleri', metin: 'Hayvanların gündelik sesleri: su içen sürüler, otlayan zebralar, fil, zebra ve aslan yavrularının çağrısı, leşte kavga eden sırtlanlar, sudaki su aygırları, hortumuyla su püskürten filler, suya kayan timsahlar; impala, ceylan, zebra ve gnu tehlikeyi görünce alarm verir, av anında boğuşma duyulur. Hepsi geldiği yönden. Aletlerin sesleri: dürbünün odak çarkı, deklanşör, ses kaydının başlama ve bitiş bipi, video kamerası, numune şişesi, fener, kamera tuzağı, GPS tasması, tel tuzak sökme, dronun kalkışı ve inişi, ziyaretçi gelince telsiz. Şafakta kuş korosu, akşamüstü kumrular; yağmurun ilk damlaları, uzak gök gürültüsü, yangının çıtırtısı. Nehir geçitlerinde su şırıltısı, istasyonda jeneratör, gece kamp ateşi, çadır fermuarı; Bulutlu Dağ Ormanı\'nda şelale. Menülerin tık sesleri ve mesaj ile görev bildirimleri yenilendi.', nerede: 'sahada ve menülerde kendiliğinden; hayvanların gündelik sesleri Ayarlar, Ses ve konuşma, Küçük canlıların sesleri ayarıyla birlikte kapanır.' },
  { baslik: 'Küçük canlıların sesleri', metin: 'Kuşlar, kurbağalar, böcekler ve maymunlar dahil 24 küçük canlının gerçek sesi: bulundukları yerde, saate ve mevsime göre ara sıra uzaktan seslenirler, ses geldiği yönden duyulur. Sesini duyduktan hemen sonra Küçük canlı ara dersen onu bulman çok kolaylaşır. Galeri ormanı ve kayalığın kendi ortam sesleri var.', nerede: 'sahada kendiliğinden; kapatmak için Ayarlar, Ses ve konuşma, Küçük canlıların sesleri.' },
  { baslik: 'Sürülerin günlük rutinleri', metin: 'Her sürü belli saatte belli su başına iner ve belli bir ağacın gölgesinde dinlenir; sıcak öğlelerde gölgeye çekilir.', nerede: 'tanımlı bir hayvanın Arşiv sayfasında, sürüsünün alışkanlığı ve ağacın yönü.' },
  { baslik: 'İstasyon güvenlik kamerası', metin: 'İstasyonun çevresine gelen büyük hayvanları kaydeder, sabah gecenin özetini verir.', nerede: 'Merkez, Ekolojik yönetim, İstasyon güvenlik kamerası; özet Mesajlar\'da.' },
  { baslik: 'Özel bireyler', metin: 'Kara leopar, beyaz zürafa, benekli zebra, büyük dişli fil ve üç bacaklı aslan savanda yaşıyor.', nerede: 'sahada; onları dürbünle tanımlarsan büyük keşif olarak duyurulur.' },
  { baslik: 'Tuz yalağı', metin: 'Otçul sürüler birkaç günde bir mineralli toprağı yalamaya gelir.', nerede: 'Yerler menüsünde Tuz yalağı.' },
  { baslik: 'Sağlık dosyası ve göç takibi', metin: 'Bireyin beslenmesi, hastalık ve yaralanma geçmişi; göçmen türlerin çıkış, dönüş ve kayıpları.', nerede: 'birey sayfası; Merkez, Ekolojik yönetim, Göç takibi.' },
  { baslik: 'Avlanma, savunma ve sosyal yaşam', metin: 'Sürü hâlinde kuşatma, öğrenen avcılar, grup savunması, yas, sıralama kavgası ve uzlaşma, av öğreten anneler.', nerede: 'sahada gözleyerek; tür ve birey sayfalarında av kayıtları ve beceri.' },
  { baslik: 'Saha gezileri', metin: 'Kızıl Tuz Gölü, Bulutlu Dağ Ormanı ve Papirüs Bataklığı: her biri beş noktalı ayrı bir alan, kendine özgü canlılar ve ortam sesi.', nerede: 'Merkez, Saha gezileri; istasyondayken Yola çık. Alanda yukarı ve aşağı kaydırarak gezilir.' },
  { baslik: 'Ekolojik yönetim', metin: 'İstilacı lantana temizliği, kontrollü yakma, gölet restorasyonu, nüfus dengesi ve yıllık koruma raporu.', nerede: 'Merkez, Ekolojik yönetim.' },
  { baslik: 'Su araştırması', metin: 'Yedi noktada su ölçümü, suda yaşayanları gözleme ve geçitlerde hayvan geçişlerini sayma.', nerede: 'Doğa, Su araştırması.' },
  { baslik: 'İstasyonun çevresindeki yaşam', metin: 'İstasyondayken ara sıra çevredeki küçük canlılar anlatılır.', nerede: 'istasyonda beklerken kendiliğinden.' },
  { baslik: 'Gizemler, insanlar, başarılar', metin: 'Adım adım çözülen gizemler, nadir gelen korucu, çoban ve araştırmacı, ödüllü bilimsel başarılar.', nerede: 'Merkez, Gizemler ve Bilimsel başarılar; ziyaretçi gelince Yerler ve ana menüde Konuş.' },
  { baslik: 'Araç sesleri', metin: 'Binerken ve inerken kapı sesi, sürerken hıza göre motor sesi.', nerede: 'araca binince; iki parmakla yukarı kaydır.' },
  { baslik: 'Deneme araçları', metin: 'Bütçe, itibar ve bütün ekipman kısayolları.', nerede: 'ana menü, Durum, ayarlar, yardım ve kayıt, Deneme araçları.' },
];

// ---------------- Nasıl oynanır (Kayıp Okyanus Yardım gibi konu konu) ----------------
const YARDIM = [
  {
    id: 'amac',
    baslik: 'Oyunun amacı',
    satirlar: [
      'Afrika savanında bağımsız bir doğa araştırmacısısın. Avlanma ya da savaş yoktur; hayvanları rahatsız etmeden izlersin.',
      'Hayvanları gözlemle, her bireyi tanımlayıp kimlik numarasıyla kaydet, davranışlarını belgele, fotoğraflarını çek ve seslerini kaydet.',
      'Araştırma merkezinde verilerini analiz et, kurumların görevlerini tamamla, bütçeni büyüt; ekipman, tesis ve personelle merkezini geliştir.',
    ],
  },
  {
    id: 'saha',
    baslik: 'Sahada hareketler',
    satirlar: [
      'Telefonu dik tut ve kulaklık tak. Hayvanlar bulundukları yönden ses verir: soldaki sol kulaktan, arkadaki boğuk, uzaktaki kısık duyulur.',
      'Tek parmakla sürükle: yukarı ileri yürür, aşağı geri gider, sağa ve sola döndürür. Araçtayken sürersin.',
      'Dokun: izlediğin hayvanı ya da çevredeki hayvanları anlatır. Uzun bas: çevreni ayrıntılı betimler: ışık, hava, zemin, önündeki engel, yakındaki yerler, duyulan sesler ve hayvanlar.',
      'Çift dokun: elindeki aleti kullanır. İki parmakla sağa ya da sola kaydır: alet değiştirir. Aletler dürbün, fotoğraf makinesi, ses kayıt cihazı ve yaklaşmadır.',
      'İki parmakla yukarı kaydır: araca biner ya da inersin; araç uzaktaysa yanına yürürsün. İki parmakla aşağı kaydır: durur ve gözlemi bitirirsin.',
      'İki parmakla dokun: konuşmayı susturur. İki parmakla iki kez dokun: menüyü açar.',
      'Ayak seslerin zemine göre değişir: kuru ot, çıplak toprak, çamur, sığ su, kaya, yaprak ve mağara taşı. Dönerken her 30 derecede bir tık duyulur; kuzey, doğu, güney ve batıda tık daha güçlüdür. İzlediğin hayvan ya da gittiğin yer tam önüne gelince ayrı bir ses çalar ve telefon hafifçe titrer. Tıkırtıyı Ayarlar, Ses ve konuşma bölümünden kapatabilirsin.',
    ],
  },
  {
    id: 'menu',
    baslik: 'Menülerde gezinme',
    satirlar: [
      'Sağa kaydır: sonraki satır. Sola kaydır: önceki satır. Bir satıra dokun: o satırı okur. Parmağını yavaşça gezdirmek de satırları okur.',
      'Ekranın herhangi bir yerine çift dokun: okunan satırı seçer. Uzun bas: satırı açıklamasıyla yeniden okur.',
      'İki parmakla çift dokun: bir önceki menüye döner; ana menüdeysen sahaya döndürür. Menü açıkken zaman durur.',
      'Yukarı kaydır: listenin ilk satırına atlar. Aşağı kaydır: son satıra, yani Geri satırına atlar. Ana menü kısadır: sık kullanılanlar üstte; ekosistem, bitkiler, numune ve küçük canlılar Doğa bölümünde; durum, ayarlar, yardım ve kayıt en alttaki bölümde.',
      'VoiceOver ile oynarken menüler VoiceOver düğmeleridir; Z hareketi bir önceki menüye döndürür.',
    ],
  },
  {
    id: 'gozlem',
    baslik: 'Gözlem, fotoğraf ve ses',
    satirlar: [
      'Dürbün: görebildiğin en yakın hayvanı seçer; her kullanışta sıradakine geçer. Bir hayvanı birkaç saniye izleyince tanımlanır ve kimlik numarası alır, örneğin Zebra 3.',
      'Yeni davranışları izledikçe ansiklopedine kaydedilir. Pusuya yatma, avlanma, emzirme gibi nadir davranışlar bilimsel itibarını çok artırır.',
      'Yaklaşma: seçili hayvana ürkütmeden yürür ve güvenli izleme mesafesinde durur. Çok yaklaşırsan hayvanlar kaçar.',
      'Fil, manda, su aygırı, gergedan, aslan ve timsah önce uyarır; geri çekilmezsen sana doğru hamle yapar.',
      'Fotoğraf makinesi: yeterince yakın ama ürkütmeyecek kadar uzaktan çek. Nadir davranışların çok iyi kareleri dergilere satılır.',
      'Ses kayıt cihazı: 6 saniye dinler; hangi türün, hangi yönden, ne kadar uzaktan ve ne tür bir ses çıkardığını söyler.',
      'Hayvanlar seni zamanla tanır: uzaktan ve sakin izlediğin bireyler sana alışır. Araçtan izlemek daha az ürkütür.',
    ],
  },
  {
    id: 'dunya',
    baslik: 'Savan, zaman ve yerler',
    satirlar: [
      'Zaman oyun açıkken akar, kapalıyken durur. Bir gün 48 dakika sürer. Gündüz otçullar otlar; akşam ve gece yırtıcılar avlanır. Gece dürbünle görüş kısalır.',
      'Savanda gölet, nehir, nehrin güneyinde sulak alan, batıda kayalık ve mağara girişi, kuzeyde akasya ağaçlığı var. Nehir yalnızca iki geçitten geçilir.',
      'Menüdeki Yerler seni istediğin yere yürütür ya da araçla götürür. Saat yönleri: 12 tam önün, 3 sağın, 6 arkan, 9 solun.',
    ],
  },
  {
    id: 'merkez',
    baslik: 'Araştırma merkezi',
    satirlar: [
      'Menüdeki Araştırma merkezinde bütçeni, mesajlarını, görevlerini, araştırmalarını, ekipmanını, tesislerini ve personelini yönetirsin.',
      'Her gün personel maaşı ve tesis bakımı kendiliğinden ödenir. Bilimsel itibarın arttıkça kuruluşlar her gün destek gönderir.',
      'Görevler: üniversiteler ve vakıflar her gün teklif gönderir. Kabul edip tamamlayınca ödül hesabına yatar.',
      'Araştırmalar: gereken veriyi topladığında analizi başlat. Analiz bitince fon, itibar ya da yeni ekipman açılır.',
      'Kamera tuzakları önünden geçen hayvanları gece gündüz fotoğraflar. GPS tasmasını veterinerin takar; tasmalı hayvanın yerini her an bilirsin.',
    ],
  },
  {
    id: 'ekosistem',
    baslik: 'Mevsimler ve ekosistem',
    satirlar: [
      'Bir oyun yılı 24 gündür: 10 gün yağışlı mevsim, 14 gün kurak mevsim. Menüde Doğa bölümündeki Ekosistem raporu mevsimi, havayı, göleti, nehri, otlakları, göçleri ve salgınları anlatır.',
      'Yağışlı mevsimde otlar yeşerir, gölet dolar, otçullar doğurur. Kurak mevsimde gölet çekilir, su kirlenir; zebralar ve ceylanlar güneydeki otlaklara göç eder, nehri geçerken timsahlar bekler. Yağmurlarla geri dönerler.',
      'Yağmurda ve sağanakta dürbünle görüş kısalır. Gün başında hava tahmini okunur.',
      'Hayvanlar yaşlanır, yavrular büyür, genç erkekler sürüden ayrılır. Hastalanan ya da yaralanan hayvanlar dürbünde belirti gösterir: topallama, zayıflık, tüy dökülmesi.',
      'Menüde Doğa bölümündeki Numune ve veteriner satırından su, dışkı ve leş numunesi alırsın; Çevredeki bitkiler bölümünden bitki inceler, yaprak ve tohum numunesi alırsın. Numuneler istasyona dönünce laboratuvarda analiz edilir.',
      'Tozlaşma ve tohumlar: çiçek açan bitkilerin yanında arıları, güneş kuşlarını ya da rüzgârla tozlaşmayı duyarsın. Filler, zürafalar, impalalar ve babunlar akasya ve çöl hurması tohumlarını dışkılarıyla taşır; Doğa bölümünde Tohum ve fideler satırı yakındakileri gösterir, oraya götürür ve inceletir. Tohumlar yağışlı mevsimde filizlenir.',
      'Üreme: hayvanlar eşleşir, gebe kalır, birkaç gün sonra doğurur. Eşleşme günü kur davranışı görülür. Gebeliğin ikinci yarısında dişinin karnı belirginleşir; birey sayfasında doğumun yaklaşık zamanı yazar. Doğuma tanık olmak için gebe bir dişiyi izle.',
      'Yayınlar: Merkez, Yayınlar ve iş birlikleri. Tamamlanan araştırmadan makale yazıp dergi seçersin. Hakemler birkaç gün içinde karar verir; düzeltme isterlerse sahadan yeni bir fotoğraf, ses ya da video getirip düzeltmeyi gönderirsin. Yayımlanan makale itibar, fon ve atıf getirir. Kuruluşlarla veri alışverişi her biriyle bir kez yapılır.',
      'Fırtına ve sıcak dalgası: fırtınadan iki saat önce uyarı gelir; Doğa menüsünde Fırtına geliyor satırıyla ekipmanı sabitle. Devrilen kamera tuzakları ve yırtılan kamp çadırı da Doğa menüsünden düzeltilir. Ekosistem raporundaki İklim kaydı her yılın yağışını ve sıcaklığını tutar.',
      'Araştırma fırsatları: salgın, göç, yangın, kaçak avcı tuzağı, kuraklık, sıcak dalgası ya da doğum gibi bir olay olunca bir kurum araştırma fırsatı önerir. Merkez, Görevler bölümünden kabul edersin.',
      'Göz parıltısı: gece Doğa menüsünde Fenerle göz parıltısı tara. Kırk beş metre içindeki hayvanların göz rengini, yüksekliğini ve kaç çift olduğunu söyler; kaydettiğin türleri büyük olasılıkla tanır.',
      'Büyük hedefler: Merkez, Büyük hedefler. Altı uzun soluklu hedefin adımlarını ve ilerlemeni gösterir; her biri bitince büyük ödül gelir.',
      'Sosyal bağlar: tımarlaşan, oynayan ve akraba olan hayvanlar arasında bağ kurulur. Birey sayfasında en yakın bağları yazar. Bağsız alt sıradaki bireyler bazen dışlanır; aslan erkekleri koalisyon kurar.',
      'Müzik: Ayarlar, Ses ve konuşma, Müzik satırı. Gündüz ve gece farklı, tehlike yakınken gerilimli çalar. Kapalı, düşük, orta, yüksek arasında değiştirilir.',
      'Toprak ve kıl numunesi: Doğa, Numune ve veteriner. Toprak her bölgeden günde bir alınır. Kıl ya da tüy numunesi için tanımlı bir hayvanı birkaç saniye gözle, otuz beş metre içinde ol.',
      'Böcek kolonileri: Doğa bölümünde. Termit tepeleri, yabani bal arısı kovanı, ordu karıncaları ve dokumacı karıncalar var. Yanına gidince Koloniyi incele satırı çıkar. Her koloni saate, mevsime ve yağmura göre farklı şeyler yapar; farklı durumları gözledikçe kayda geçer.',
      'Veterinerin yaralı ve hasta hayvanları tedavi eder, şarbonlu leşleri yakar. Rehabilitasyon alanı kurulunca ağır yaralı ve yetim hayvanlar bakılıp doğaya geri bırakılır. Sağlıklı hayvana dokunulmaz, vahşi hayvan beslenmez.',
    ],
  },
  {
    id: 'genisleme',
    baslik: 'Genetik, bölgeler, izler, video, dron, tekne ve kamp',
    satirlar: [
      'Genetik: tanımlı bir hayvanın dışkı numunesini laboratuvarda inceletince DNA profili çıkar: genetik çeşitliliği, kalıtsal hastalık geni taşıyıp taşımadığı ve babası. Bir türün en az üç bireyinin DNA’sı varsa tür sayfasında popülasyon raporu ve yok olma riski okunur.',
      'Aile ağacı: Arşiv, Bireyler bölümünde bir hayvanın sayfasından anne, baba, kardeş, yavru ve torunlarına gidersin. Akraba hayvanların yavruları zayıf doğabilir; iki taşıyıcı ebeveynin yavrularının bir kısmı kalıtsal zayıflıkla doğar.',
      'Bölge hâkimiyeti: aslanlar, sırtlanlar, leoparlar, yaban köpekleri ve çitalar bölgeler için yarışır. Karşılaşınca güçlü olan zayıfı kovalar. Hangi bölgenin kimde olduğu Ekosistem raporunda ve haritada yazar. Aslan, zebra ve impala sürülerinde zaman zaman yeni bir erkek lidere meydan okur.',
      'Ekosistem haritası: ana menüde. Bölgeler yakından uzağa sıralıdır; her bölgede otlak durumu, hâkim yırtıcı ve bildiğin sürüler, bilginin ne zaman ve nasıl geldiğiyle birlikte yazar: gözlem, dron, kamera tuzağı ya da GPS.',
      'Dron: araştırma merkezinden alınır, aletler arasına girer. Çift dokununca baktığın yönde 110 metre öteye uçar, oradaki hayvanları sayar, leşleri ve tel tuzakları görür, geri döner. Pervane sesi dronun olduğu yerden gelir. Üç uçuşluk batarya istasyonda ya da kampta dolar.',
      'Tekne: iskelede bağlıdır. Yanına gidip iki parmakla yukarı kaydırınca binersin; tek parmakla sürükleyerek nehir boyunca kürek çekersin. Hayvanlar tekneyi daha az fark eder ama su aygırları tehlikelidir. İki parmakla yukarı kaydırınca karaya çıkarsın.',
      'İzler: Doğa bölümünde İzleri incele, 12 metre içindeki en taze izi okur: hangi hayvan, ne kadar taze, hangi yöne gitmiş. İzi takip et seni izlerin gittiği yere götürür. Sırtlan ve yaban köpeği inleri, leoparın avını sakladığı ağaç, aslanların yavru sığınağı, balık kartalı ve timsah yuvası, babunların uyku ağaçları gizlidir; izle, gece GPS kayıtlarıyla ya da dronla bulunur. Hayvanlar geceleri buralara döner.',
      'Duyular: hayvanlar seni koku, görme ve işitmeyle fark eder. Rüzgâr arkandan esiyorsa kokun onlara gider; fil, gergedan ve sırtlan gibi koku duyusu güçlü türler çok uzaktan kaçar. Rüzgâr yüzüne gelecek biçimde yaklaş, kıpırdamadan bekle; uzun otlar seni gizler. Avcıdan kaçıp kurtulan ya da tuzağa düşen hayvan bir süre ürkek olur; sürüler avlandıkları yerden birkaç gün uzak durur. Bir sürünün alarm sesi yakındaki başka türleri de kaçırır.',
      'Video: aletlerde Video kamera var; gözlediğin hayvanı 10 saniye çeker. Nadir bir davranışın ilk videosu bilimsel olarak çok değerlidir. Videolar Arşiv bölümünde.',
      'Garaj: Merkez, Ekipman bölümünden ATV, arazi motosikleti ve araştırma kamyonu alınır; Merkez, Garaj bölümünde seçilir. Sahada tek araç durur, değiştirmek için istasyonda olmalısın. ATV ve motosiklet hızlıdır ama açıktır, hayvanlar seni daha kolay fark eder. Kamyon yavaştır; numuneleri ona teslim edersin, dron onda şarj olur.',
      'Stres ve görünüş: hayvanlar yalnızlık, kayıp, kavga ve tehlikeden stres yaşar, kişiliğine göre toparlanır, grup arkadaşları teselli eder. Görünüşleri (yele, çizgi, diş, ton) kalıtsaldır ve gözlem tarifinde söylenir; birey sayfasında Görünüş satırında kimden aldığı yazar.',
      'İletişim: hayvanlar kokuyla bölge işaretler, selamlaşır, gece kükrer, beden diliyle tehlikeyi bildirir. İzleri incele koku işaretlerini de bulur. Su başında timsah görenler tedirgin bekler.',
      'Saha kampı: kamp takımıyla Doğa bölümünden kurulur. Kamptayken hayvanlar seni daha az fark eder. Kampta dronunun şarjı dolar. Zaman yalnız oynarken, gerçek akışıyla geçer; hızlandırma ya da atlama yoktur.',
    ],
  },
  {
    id: 'hikaye',
    baslik: 'Gizemler, insanlar ve bilimsel başarılar',
    satirlar: [
      'Gizemler: sahada geçirdiğin günler, gözlemlerin ve karşılaştığın insanlar gizemler başlatır: göletteki ölü kuşlar, ormandan gelen gece çığlıkları, kaybolan bir leopar, tel tuzaklarını kuranlar. Her gizem adım adım çözülür; Araştırma merkezi, Gizemler bölümü sıradaki adımı söyler. Çözülen gizem itibar ve fon getirir.',
      'İnsanlar: bölgede insan çok azdır. Bazı günler bir korucu, yerli bir çoban ya da komşu istasyondan bir araştırmacı birkaç saatliğine bir yerde bulunur; telsizle haber gelir. Yerler menüsünden yanına gidip ana menüdeki Konuş satırıyla konuşursun. Korucu kaçak avcı izlerini, çoban görmediğin hayvanları, araştırmacı bilinmeyen yuvaları anlatır.',
      'Bilimsel başarılar: tür keşfi, bireysel kimlik, nadir davranış, göç, üreme yuvaları, hastalık teşhisi, fotoğraf, video, ses, küçük canlılar, uzun gözlem ve bir tam yıl için. Her biri itibarın yanında fon, bağış ekipman, personel bursu ya da kalıcı destek getirir. Araştırma merkezi, Bilimsel başarılar bölümünde ilerlemen yazar.',
      'Araç sesleri: araca binerken ve inerken kapı sesi duyulur; sürerken motor sesi hızlandıkça yükselir, durunca rölantiye iner.',
    ],
  },
  {
    id: 'su',
    baslik: 'Nehir, gölet ve istasyonun çevresi',
    satirlar: [
      'Su araştırması: Doğa menüsünde. Yedi ölçüm noktası var: batı nehir yatağı, iki geçidin sığlıkları, kumsal kıvrım, galeri ormanı kıyısı, gölet ve güneydeki sulak alan. Noktaya gidip Suyu ölç seçince su sıcaklığı, berraklık, akış, çözünmüş oksijen ve su düzeyi okunur. Her noktayı iki mevsimde de ölçünce Nehir ve sulak alan atlası araştırması analize hazır olur.',
      'Suda yaşayanları gözle: kıyıdan balık, kurbağa, su kuşu ve su böceklerine bakarsın; yeni görülenler küçük canlılar arşivine yazılır. Dalış yoktur.',
      'Hayvan geçiş noktaları: nehrin iki sığ geçidinde Hayvan geçişlerini say seçilirse son bir günde karşıya geçen türler izlerden sayılır. Geçitlerdeki sayımlar ve balık türleri Hayvan geçiş noktaları araştırmasını doldurur.',
      'Hayvanların gündelik sesleri: yakındaki sürü su içiyor, otluyor ya da yavruları anneyi çağırıyorsa duyarsın; impala, ceylan, zebra ve gnu tehlikeyi görünce alarm verir. Nehir geçidine yaklaşınca su şırıltısı, istasyona yaklaşınca jeneratör, gece kampta ateş sesi yükselir; bunlar yön bulmana da yardım eder.',
      'Küçük canlıların sesleri: kuşlar, kurbağalar, böcekler ve küçük memeliler ara sıra uzaktan seslenir; ses geldiği yönden duyulur. Gece baykuşlar, çobanaldatanlar, galagolar ve kurbağalar; gündüz turnalar, boynuzgagalar, ağustos böcekleri öter. Sesini duyduktan hemen sonra Küçük canlı ara dersen onu bulman çok kolaylaşır. Ayarlar, Ses ve konuşma bölümünden kapatılabilir.',
      'Su kirliliği: suda ya da kıyıda çürüyen leşler bakteri getirir; kurak mevsimde sığ nehirde toplanan su aygırlarının dışkısı oksijeni tüketir ve balık ölümüne yol açabilir; yangından sonraki ilk yağmur külü suya taşır. Kirli sudan içen hayvanlar parazit kapabilir. Su ölçümü ve su numunesi kirliliği gösterir. Doğa, Su araştırması, Kirlilik kaynakları listesinden kaynaklara gidebilirsin; nehir akarak, gölet daha yavaş temizlenir.',
      'Kendini tedavi: parazitli babunlar çöl hurmasının acı meyvesini ve yaprağını, parazitli filler kil yer; hastalıkları biraz hafifler. Bu nadir davranışları görürsen kayda geçer.',
      'İstasyonun çevresi: istasyondayken ara sıra çevredeki küçük canlılar anlatılır: akasyada yuva ören dokumacı kuşlar, çatıda baş sallayan agama, gece lambanın çevresinde avlanan geckolar. İlk kez görülenler arşive yazılır.',
    ],
  },
  {
    id: 'sosyal',
    baslik: 'Avlanma, savunma ve sosyal yaşam',
    satirlar: [
      'Avlanma: her yırtıcının kendi stratejisi var. Aslanlar pusuya yatıp birlikte kuşatır, yaban köpekleri ve sırtlanlar avı uzun süre kovalar, çita yakına sokulup çok hızlı kısa bir koşu yapar, leopar tek başına atılır. Kuşatmaya katılanların koşu sesleri ayrı yönlerden gelir.',
      'Öğrenme: her av denemesi, başarısız olsa da, avcının becerisini artırır. Gruplar hangi avda başarılıysa onu daha çok seçer. Yavrular annelerinden öğrenir; çita ve leopar anneleri yavrularına av öğretir. Tür ve birey sayfalarında av kayıtları ve beceri yazar.',
      'Grup savunması: manda, fil, babun, zebra, gnu ve zürafa sürülerinin yetişkinleri bir yavruya saldırıldığında saf tutup saldırganın üstüne yürüyebilir. Saldırı yaşayan sürü savunmayı öğrenir, sonrakinde daha kararlı olur.',
      'Ebeveynlik: deneyimli ve sakin anneler yavrularını daha iyi besler; ilk kez doğuranlar zorlanır. Annenin ürkekliği yavruya geçer.',
      'Tuz yalağı: Yerler menüsünde. Filler, mandalar, zürafalar, zebralar, gnular, impalalar ve gergedanlar birkaç günde bir buraya gelip mineralli toprağı yalar; bitkilerden alamadıkları sodyumu topraktan alırlar. Beklemek için iyi bir yer.',
      'Özel bireyler: savanda birkaç olağanüstü hayvan yaşıyor: kapkara bir leopar, beyaz bir zürafa, benekli bir zebra, dişleri yere değen yaşlı bir fil ve üç bacaklı bir aslan. Onları tanımlarsan büyük bir keşif sayılır. Görünüşleri gözlemde söylenir.',
      'Günlük rutinler: her sürünün alışkanlıkları var: hangi saatte, gölete mi nehre mi su içmeye indiği ve hangi ağacın gölgesinde dinlendiği. Sıcak günlerin öğlesinde gölgeye çekilirler. Tanımlı bir bireyin sayfasında sürüsünün alışkanlığı ve o ağacın yönü yazar; orada beklersen gelirler.',
      'İstasyon güvenlik kamerası: istasyonun 45 metre çevresine gelen büyük hayvanları kaydeder; sabah gecenin özeti gelir. Gece istasyondayken yakına tehlikeli bir hayvan gelirse hemen uyarır.',
      'Sağlık dosyası ve göç takibi: her tanımlı bireyin sayfasında beslenme, hastalık, yaralanma ve stres durumu yazar. Merkez, Ekolojik yönetim bölümündeki Göç takibi göçmen türlerin ne zaman çıkıp döndüğünü ve kayıplarını gösterir.',
      'Sosyal yaşam: babun, aslan, zebra ve fil gruplarında sıralama kavgaları olur; babunlar ve filler kavgadan sonra birbirini tımar ederek barışır. Fil, babun ve zürafa grupları ölen bir üyelerinin başında toplanıp bekler.',
    ],
  },
  {
    id: 'uzak',
    baslik: 'Saha gezileri ve ekolojik yönetim',
    satirlar: [
      'Saha gezileri: Araştırma merkezinde. Savandan uzakta üç özel alan var: Kızıl Tuz Gölü, Bulutlu Dağ Ormanı ve Papirüs Bataklığı. İtibarın arttıkça açılırlar. İstasyondayken Yola çık seçilir; alan izni ve konaklama ücreti ödenir, yolculuk iki üç saat sürer ve bu arada savanda zaman akar.',
      'Alanda: her alanın beş noktası var. Tek parmakla yukarı kaydırınca sonraki, aşağı kaydırınca önceki noktaya geçersin; dokununca nokta anlatılır; dürbünle çift dokununca canlı ararsın. Bulduğun canlıların fotoğrafını çekebilirsin. Dönmek için menüde İstasyona dön.',
      'Her alanın canlıları yalnızca orada yaşar: flamingolar, dağ bongosu, kolobus maymunu, pabuç gagalı leylek ve daha fazlası. Her alanın merkezde bir araştırması var: beş noktayı gez, dört canlı bul.',
      'Ekolojik yönetim: merkezde. Lantana adlı istilacı çalı bazı otlakları boğuyor; yanına gidip İstilacı bitki temizliği seçince ot yeniden gürleşir. Kurak mevsimin ilk beş gününde kontrollü yakma o yılın büyük yangın olasılığını düşürür. Gölet restorasyonu göletin daha geç kurumasını sağlar.',
      'Tehdit altındaki türler: aslan, leopar, fil, zürafa, su aygırı, kara gergedan, çita ve yaban köpeği. Tür sayfalarında Kırmızı Liste durumu yazar. Her yılın sonunda bu türlerin nüfusu yıl başıyla karşılaştırılır; korunan her tür itibar ve fon getirir.',
    ],
  },
  {
    id: 'kutup',
    baslik: 'Kuzey Kutbu',
    satirlar: [
      'Kuzey Kutbu gezisi: Araştırma merkezi, Saha gezileri bölümünde. Bilimsel itibarın 50 olunca açılır. İstasyondayken Kuzey Kutbu, yola çık satırını seç; uçak, izin ve kulübe 2.500 lira tutar, yolculuk 5 oyun saati sürer. Kuzeydoğu Grönland kıyısındaki araştırma kulübesine inersin.',
      'Kutup ayrı, serbestçe dolaşılan bir haritadır: savandaki gibi tek parmakla yürür, dürbünle gözler, fotoğraf ve ses kaydı alırsın. Kuzeyin deniz, güneyin tundra; batıda bir buzul, doğuda deniz kuşlarının yuvaladığı yarlar, denizde kışın da donmayan bir polinya var. Araç, dron ve saha kampı savanda kalır.',
      'Mevsimler kutup takvimine göredir: 8 gün yaz, güneş hiç batmaz; 4 gün sonbahar; 8 gün kış, güneş hiç doğmaz, açık havada kuzey ışıkları görünür; 4 gün ilkbahar. Deniz sonbaharda donar, ilkbaharın sonunda çözülür. Açık suya giremezsin; donmuş deniz buzunun üstünde yürüyebilirsin.',
      'Hava: açık, bulutlu, deniz sisi, kar ve tipi. Tipide görüş birkaç metreye iner, hayvanlar korunaklı yere çekilir. Doğa menüsündeki Kutup raporu mevsimi, havayı ve deniz buzunun kenarını söyler.',
      'Hayvanlar: kutup ayısı, halkalı fok, mors, beluga, ren geyiği, misk öküzü, kutup kurdu, kutup tilkisi ve kutup tavşanı. Kutup ayısı buzda fokların nefes deliklerinin başında pusuya yatar; kutup tilkisi ayının peşinden artıklarını toplar; misk öküzleri kurtlara karşı yavrularını ortaya alıp halka olur. Kutup ayısı, mors ve misk öküzü tehlikelidir; uzak dur.',
      'Küçük canlılar, kutup bitkileri, su ve toprak numuneleri de kutupta toplanır. Numuneleri savandaki istasyonun laboratuvarına götürürsün.',
      'Dönüş: ana menüde ve Yerler listesinde Savana dön satırı var. Uçak kulübenin yanından kalkar; kulübeden uzaksan önce oraya yürürsün.',
    ],
  },
  {
    id: 'erisim',
    baslik: 'Erişilebilirlik ve ayarlar',
    satirlar: [
      'Çevreyi betimle: sahada uzun bas ya da menüdeki Çevreyi betimle satırını seç. Ayarlar, Görünüm bölümündeki Otomatik betimleme açıkken yeni bir bölgeye girince çevre kısaca anlatılır.',
      'Ayarlar, Kontroller: sürükleme hassasiyeti, sürekli yürüme (bir kez ileri sürükleyip bırakınca yürümeye devam edersin, iki parmakla aşağı kaydırınca durursun), yön rehberi, titreşim; VoiceOver ile oynarken büyük düğmeler ve sol el düzeni.',
      'Ayarlar, Görünüm ve grafik: grafik yüksek, düşük ya da kapalı. Kapalıyken görüntü hiç çizilmez, pil çok az harcanır, oyun tamamen sesle oynanır. Yüksek kontrast, büyük yazı ve hayvan seslerinin yazıyla gösterilmesi de burada.',
      'Ayarlar, Zorluk: keşif, hayvan davranışı ve tehlike, ekonomi, araştırma ve afetler ayrı ayrı kolay, normal ya da zor yapılabilir.',
      'Eğitimi Ayarlar bölümünden yeniden başlatabilirsin. Oyun 20 saniyede bir ve önemli olaylarda kendiliğinden kaydeder; 5 dakikada bir ayrıca yedek alır. Kayıt bozulursa yedekten açılır.',
      'Bir hata olursa oyun durmaz; hata Ayarlar, Hata kayıtları bölümüne yazılır. Bana o satırları okuyabilirsin.',
    ],
  },
  {
    id: 'kesif',
    baslik: 'Küçük canlılar, mağara, afetler ve koruma',
    satirlar: [
      'Savanda 100\'den fazla küçük canlı var: kuşlar, böcekler, sürüngenler, kurbağalar, balıklar ve küçük memeliler. Aletlerden Büyüteç ve fener ile çift dokununca çevrende küçük canlı ararsın; hemen ardından fotoğrafını çekebilirsin.',
      'Hangi canlıyı bulacağın bölgeye, saate, mevsime ve havaya bağlı: kurbağalar yağmurdan sonra, baykuşlar gece, kelebekler yağışlı mevsimde çıkar. Galeri ormanı ve termit tepeleri yeni bölgelerdir.',
      'Mağara takımıyla kayalığın kuzeyindeki mağaraya girersin. Mağarada tek parmakla yukarı kaydırınca bir sonraki odaya ilerler, aşağı kaydırınca geri dönersin; dokununca oda anlatılır. Akşam mağaranın ağzında yarasaların çıkışını izleyebilirsin.',
      'Afetler: kurak mevsimin sonunda yangın çıkabilir, rüzgârla yayılır, hayvanlar kaçar; ilk yağmurlarla yanan alanda taze sürgünler çıkar. Büyük sağanakta nehir taşar ve geçitler birkaç saat geçilmez.',
      'Kaçak avcılar otçulların yollarına tel tuzak kurar. Yakından geçince fark edersin; menüden söküp yaban hayatı servisine bildirirsin. Tuzağa takılmış hayvanı veterinerin kurtarır.',
      'Araştırma merkezindeki Koruma projeleri: gergedan koruma programı, yaban köpeklerinin aşılanması, kaçak avcılıkla mücadele ve akbabaları koruma. Her projenin adımları vardır; tamamlanınca fon ve itibar gelir.',
    ],
  },
];

// ---------------- Kip seçimi ----------------
function KipSecim({ sec }) {
  const [vo, setVo] = useState(false);
  useEffect(() => {
    let iptal = false;
    AccessibilityInfo.isScreenReaderEnabled()
      .then((acik) => {
        if (iptal) return;
        setVo(acik);
        if (!acik) {
          Ses.ayarla({ kip: 'kendi' });
          Ses.hemen(`${OYUN_ADI}'a hoş geldin. Ekranın üst yarısına dokunursan görerek oynarsın. Alt yarısına dokunursan oyun kendi sesiyle konuşur ve sesle oynarsın.`);
        }
      })
      .catch(() => {});
    return () => {
      iptal = true;
    };
  }, []);
  if (vo) {
    return (
      <View style={st.kipKap}>
        <Text style={st.oyunAdi} accessibilityRole="header">
          {OYUN_ADI}
        </Text>
        <Text style={st.metin}>VoiceOver açık. İstersen VoiceOver ile oynayabilirsin. Oyunun kendi sesini tercih edersen önce VoiceOver'ı kapat, sonra ekranın alt yarısına dokun.</Text>
        <View style={st.kipSatir}>
          <Pressable accessibilityRole="button" accessibilityLabel="VoiceOver ile oyna" onPress={() => sec('voiceover')} style={[st.kipYari, { backgroundColor: '#24342a' }]}>
            <Text style={st.kipYazi}>VoiceOver ile oyna</Text>
          </Pressable>
          <Pressable accessibilityRole="button" accessibilityLabel="Oyunun kendi sesiyle oyna" onPress={() => sec('kendi')} style={[st.kipYari, { backgroundColor: '#3a2e1c' }]}>
            <Text style={st.kipYazi}>Oyunun kendi sesiyle oyna</Text>
          </Pressable>
        </View>
      </View>
    );
  }
  return (
    <View style={{ flex: 1, flexDirection: 'column' }}>
      <Pressable accessibilityRole="button" accessibilityLabel="Görerek oyna" onPress={() => sec('gorerek')} style={[st.kipYari, { backgroundColor: '#24342a' }]}>
        <Text style={st.kipBuyuk}>{OYUN_ADI}</Text>
        <Text style={st.kipYazi}>Görerek oyna</Text>
        <Text style={st.kipAlt}>Ekranın üst yarısı</Text>
      </Pressable>
      <Pressable accessibilityRole="button" accessibilityLabel="Sesle oyna" onPress={() => sec('kendi')} style={[st.kipYari, { backgroundColor: '#3a2e1c' }]}>
        <Text style={st.kipYazi}>Sesle oyna</Text>
        <Text style={st.kipAlt}>Oyun kendi sesiyle konuşur. Ekranın alt yarısı.</Text>
      </Pressable>
    </View>
  );
}

// ---------------- Ayar ve yardım listeleri (hem ana menüde hem oyun menüsünde) ----------------
// Ayarlar menüsü (gruplu): Ses ve konuşma, Kontroller, Görünüm, oyun içinde Zorluk ve eğitim, Hata kayıtları
function ayarSayfasi(menu, ayar, degistir, k, yenile) {
  const u = menu.ust;
  if (!u || !(u === 'ayarlar' || u.startsWith('ay-'))) return null;
  const durum = (a) => (ayar[a] ? 'açık' : 'kapalı');
  const ac = (anahtar, ad, sonra) => {
    const yeni = !ayar[anahtar];
    degistir({ [anahtar]: yeni });
    if (sonra) sonra(yeni);
    Ses.hemen(`${ad} ${yeni ? 'açık' : 'kapalı'}`);
    return 'sessiz';
  };
  const dongu = (anahtar, ad, secenekler, adlar, sonra) => {
    const y = secenekler[(secenekler.indexOf(ayar[anahtar]) + 1) % secenekler.length];
    degistir({ [anahtar]: y });
    if (sonra) sonra(y);
    Ses.hemen(`${ad}: ${adlar[y]}`);
    return 'sessiz';
  };
  if (u === 'ayarlar') {
    const ogeler = [
      altMenu('ay-ses', 'Ses ve konuşma', menu.ac),
      altMenu('ay-kontrol', 'Kontroller', menu.ac),
      altMenu('ay-gorunum', 'Görünüm ve grafik', menu.ac),
    ];
    if (k) {
      ogeler.push(altMenu('ay-zorluk', 'Zorluk', menu.ac));
      ogeler.push({
        id: 'egitim',
        etiket: Eg.egitimSuruyor(k) ? `Eğitim sürüyor: ${k.egitim}. adım. Baştan başlat` : 'Eğitimi yeniden başlat',
        ipucu: 'Temel hareketleri öğreten kısa rehberli görevler.',
        sec: () => {
          Eg.egitimBaslat(k);
          Ses.hemen('Eğitim yeniden başladı. Menüden çıkınca ilk adımı söyleyeceğim.');
          yenile();
          return 'sessiz';
        },
      });
    }
    ogeler.push(altMenu('ay-hata', `Hata kayıtları: ${HATALAR.length}`, menu.ac, 'Oyunda bir hata olursa burada yazar. Bana okuyabilirsin.'));
    return { baslik: 'Ayarlar', ogeler };
  }
  if (u === 'ay-ses') return { baslik: 'Ses ve konuşma', ogeler: ayarOgeleri(ayar, degistir) };
  if (u === 'ay-kontrol') {
    const hAdi = { dusuk: 'düşük, uzun sürükleme', orta: 'orta', yuksek: 'yüksek, kısa sürükleme' };
    return {
      baslik: 'Kontroller',
      ogeler: [
        { id: 'hassas', etiket: `Sürükleme hassasiyeti: ${hAdi[ayar.hassasiyet]}. Değiştir`, ipucu: 'Tam hızla yürümek için parmağını ne kadar kaydırman gerektiği.', sec: () => dongu('hassasiyet', 'Sürükleme hassasiyeti', ['dusuk', 'orta', 'yuksek'], hAdi) },
        { id: 'seyir', etiket: `Sürekli yürüme: ${durum('surekliYuru')}. Değiştir`, ipucu: 'Açıkken bir kez ileri sürükleyip bırakınca yürümeye devam edersin; iki parmakla aşağı kaydırınca durursun. Parmağını uzun süre basılı tutmak zor geliyorsa kullan.', sec: () => ac('surekliYuru', 'Sürekli yürüme') },
        { id: 'rehber', etiket: `Yön rehberi: ${durum('rehber')}. Değiştir`, ipucu: 'Bir yere ya da hayvana giderken yönünü ve uzaklığını aralıklarla söyler.', sec: () => ac('rehber', 'Yön rehberi') },
        { id: 'buyuk', etiket: `Büyük düğmeler: ${durum('buyukDugme')}. Değiştir`, ipucu: 'VoiceOver ile oynarken sahadaki düğmeleri büyütür.', sec: () => ac('buyukDugme', 'Büyük düğmeler') },
        { id: 'solel', etiket: `Hareket düğmeleri sol el için: ${durum('solEl')}. Değiştir`, ipucu: 'VoiceOver ile oynarken alttaki hareket düğmelerinin sırasını çevirir.', sec: () => ac('solEl', 'Sol el düzeni') },
        { id: 'titresim', etiket: `Titreşim: ${durum('titresim')}. Değiştir`, sec: () => ac('titresim', 'Titreşim') },
        { id: 'sesli', etiket: 'Sesli komutlar hakkında', ipucu: 'Bilgi.', sec: () => (Ses.hemen('Sesli komutla oynamak için telefonun konuşma tanıması gerekir. Expo Go bu özelliği desteklemiyor; oyun ileride ayrı bir uygulama olarak yayımlanırsa eklenebilir. Şimdilik VoiceOver kipinde iOS\'un Sesle Denetim özelliğiyle düğmelere sesle basabilirsin.'), 'sessiz') },
      ],
    };
  }
  if (u === 'ay-gorunum') {
    const gAdi = { yuksek: 'yüksek', dusuk: 'düşük, pil dostu', kapali: 'kapalı, yalnızca ses' };
    return {
      baslik: 'Görünüm ve grafik',
      ogeler: [
        { id: 'grafik', etiket: `Grafik: ${gAdi[ayar.grafik]}. Değiştir`, ipucu: 'Düşük grafik yavaş telefonlarda akıcılığı artırır. Kapalıyken üç boyutlu görüntü hiç çizilmez; pil çok daha az harcanır, oyun tamamen sesle oynanır. Oyuna yeniden girince geçerli olur.', sec: () => dongu('grafik', 'Grafik', ['yuksek', 'dusuk', 'kapali'], gAdi) },
        { id: 'kamUzak', etiket: `Kamera uzaklığı: ${KAMERA_UZAK[ayar.kameraUzak] || 'normal'}. Değiştir`, ipucu: 'Karakterin arkasındaki kameranın ne kadar yakında duracağı.', sec: () => dongu('kameraUzak', 'Kamera uzaklığı', ['yakin', 'normal', 'uzak'], KAMERA_UZAK) },
        { id: 'kamAci', etiket: `Kamera açısı: ${KAMERA_ACI[ayar.kameraAci] || 'arkadan'}. Değiştir`, ipucu: 'Kamerayı karakterin arkasına, yanlarına, önüne ya da yukarısına alır. Hareket yönü değişmez.', sec: () => dongu('kameraAci', 'Kamera açısı', ['arka', 'yuksek', 'sag', 'sol', 'on'], KAMERA_ACI) },
        { id: 'fotoAci', etiket: `Fotoğraf çekerken yakın çekim: ${durum('fotoAcisi')}. Değiştir`, ipucu: 'Fotoğraf çekince kamera iki saniye hayvana yaklaşır.', sec: () => ac('fotoAcisi', 'Fotoğrafta yakın çekim') },
        { id: 'kontrast', etiket: `Yüksek kontrast: ${durum('kontrast')}. Değiştir`, ipucu: 'Siyah zemin, beyaz yazı ve sarı odak.', sec: () => ac('kontrast', 'Yüksek kontrast', (y) => (GORUNUM.kontrast = y)) },
        { id: 'yazi', etiket: `Büyük yazı: ${durum('buyukYazi')}. Değiştir`, sec: () => ac('buyukYazi', 'Büyük yazı', (y) => (GORUNUM.buyukYazi = y)) },
        { id: 'altyazi', etiket: `Hayvan seslerini yazıyla göster: ${durum('sesAltyazi')}. Değiştir`, ipucu: 'İşitme engelliler için: duyulan her hayvan sesi türü ve yönüyle altyazıda yazılır.', sec: () => ac('sesAltyazi', 'Ses altyazıları') },
        { id: 'betimle', etiket: `Otomatik betimleme: ${durum('otoBetimle')}. Değiştir`, ipucu: 'Yeni bir bölgeye girince çevreyi kısaca betimler.', sec: () => ac('otoBetimle', 'Otomatik betimleme') },
      ],
    };
  }
  if (u === 'ay-zorluk' && k) {
    return {
      baslik: 'Zorluk',
      ogeler: Object.entries(M.ZORLUK_ALANLARI).map(([alan, z]) => ({
        id: alan,
        etiket: `${z.ad}: ${M.ZORLUK_ADI[M.zorluk(k, alan)]}. Değiştir`,
        ipucu: z.tarif,
        sec: () => {
          const l = ['kolay', 'normal', 'zor'];
          k.zorluk[alan] = l[(l.indexOf(M.zorluk(k, alan)) + 1) % 3];
          Ses.hemen(`${z.ad}: ${M.ZORLUK_ADI[k.zorluk[alan]]}. ${z.tarif}`);
          yenile();
          return 'sessiz';
        },
      })),
    };
  }
  if (u === 'ay-hata') {
    const ogeler = HATALAR.map((h, i) => ({ id: 'h' + i, etiket: `${h.zaman}, ${h.yer}: ${h.mesaj}. ${h.yigin}` }));
    if (!ogeler.length) ogeler.push({ id: 'yok', etiket: 'Kayıtlı hata yok.' });
    else
      ogeler.push({
        id: 'sil',
        etiket: 'Hata kayıtlarını sil',
        sec: () => {
          HATALAR.length = 0;
          AsyncStorage.removeItem(HATA_ANAHTAR).catch(() => {});
          Ses.hemen('Hata kayıtları silindi.');
          yenile();
          return 'sessiz';
        },
      });
    return { baslik: 'Hata kayıtları', ogeler };
  }
  return null;
}

function ayarOgeleri(ayar, degistir) {
  const kipAdi = { kendi: 'oyunun kendi sesi', voiceover: 'VoiceOver', gorerek: 'görerek' };
  const ac = (anahtar, ad, sonra) => {
    const yeni = ayar[anahtar] === false;
    degistir({ [anahtar]: yeni });
    if (sonra) sonra(yeni);
    Ses.hemen(`${ad} ${yeni ? 'açık' : 'kapalı'}`);
    return 'sessiz';
  };
  const durum = (a) => (ayar[a] !== false ? 'açık' : 'kapalı');
  const kipler = ['kendi', 'gorerek', 'voiceover'];
  return [
    {
      id: 'kip',
      etiket: `Oynama biçimi: ${kipAdi[ayar.kip]}. Değiştir`,
      ipucu: "Oyunun kendi sesi, görerek ve VoiceOver arasında geçer. VoiceOver açıkken hangisi seçili olursa olsun düğmeli VoiceOver düzeni kullanılır; VoiceOver'ı kapatınca seçtiğin biçime dönülür.",
      sec: () => {
        const y = kipler[(kipler.indexOf(ayar.kip) + 1) % kipler.length];
        degistir({ kip: y });
        Ses.hemen(`Oynama biçimi: ${kipAdi[y]}.`);
        return 'sessiz';
      },
    },
    {
      id: 'hizArt',
      etiket: `Konuşma hızı: ${Math.round(ayar.hiz * 100)}. Hızlandır`,
      sec: () => {
        const h = Math.min(1.8, Math.round((ayar.hiz + 0.1) * 10) / 10);
        degistir({ hiz: h });
        Ses.ayarla({ hiz: h });
        Ses.hemen(`Konuşma hızı ${Math.round(h * 100)}`);
        return 'sessiz';
      },
    },
    {
      id: 'hizAz',
      etiket: 'Konuşmayı yavaşlat',
      sec: () => {
        const h = Math.max(0.6, Math.round((ayar.hiz - 0.1) * 10) / 10);
        degistir({ hiz: h });
        Ses.ayarla({ hiz: h });
        Ses.hemen(`Konuşma hızı ${Math.round(h * 100)}`);
        return 'sessiz';
      },
    },
    { id: 'efekt', etiket: `Ses efektleri: ${durum('efekt')}. Değiştir`, ipucu: 'Hayvan sesleri ve ayak sesleri.', sec: () => ac('efekt', 'Ses efektleri', (y) => Efekt.efektAyarla({ acik: y })) },
    { id: 'ortam', etiket: `Ortam sesi: ${durum('ortam')}. Değiştir`, ipucu: 'Savanın rüzgâr, böcek ve nehir sesleri.', sec: () => ac('ortam', 'Ortam sesi', (y) => Efekt.efektAyarla({ ortam: y ? ORTAM_DUZEY[ayar.ortamDuzey] || 0.35 : 0 })) },
    {
      id: 'ortamDuzey',
      etiket: `Ortam sesi düzeyi: ${{ dusuk: 'düşük', orta: 'orta', yuksek: 'yüksek' }[ayar.ortamDuzey] || 'orta'}. Değiştir`,
      sec: () => {
        const l = ['dusuk', 'orta', 'yuksek'];
        const y = l[(l.indexOf(ayar.ortamDuzey) + 1) % 3];
        degistir({ ortamDuzey: y });
        Efekt.efektAyarla({ ortam: ayar.ortam !== false ? ORTAM_DUZEY[y] : 0 });
        Ses.hemen(`Ortam sesi düzeyi ${{ dusuk: 'düşük', orta: 'orta', yuksek: 'yüksek' }[y]}`);
        return 'sessiz';
      },
    },
    {
      id: 'muzik',
      etiket: `Müzik: ${MUZIK_ADI[ayar.muzik] || 'düşük'}. Değiştir`,
      ipucu: 'Duruma göre değişen arka plan müziği: gündüz sakin, gece gizemli; yakında tehlikeli bir hayvan, kovalamaca ya da yangın olunca gerilimli. Hayvan seslerini bastırmasın diye düşük başlar.',
      sec: () => {
        const l = ['kapali', 'dusuk', 'orta', 'yuksek'];
        const y = l[(l.indexOf(ayar.muzik || 'dusuk') + 1) % l.length];
        degistir({ muzik: y });
        Efekt.muzikAyarla({}, MUZIK_DUZEY[y]);
        Ses.hemen(`Müzik ${MUZIK_ADI[y]}`);
        return 'sessiz';
      },
    },
    {
      id: 'kesifAnlari',
      etiket: `Keşif anları: ${durum('kesifAnlari')}. Değiştir`,
      ipucu: 'Yeni tür, nadir davranış, doğum, in keşfi gibi anlarda kısa bir müzik vurgusu çalar, telefon titreşir, görüntüde kamera hayvana yaklaşır.',
      sec: () => ac('kesifAnlari', 'Keşif anları'),
    },
    {
      id: 'canliSesleri',
      etiket: `Küçük canlıların sesleri: ${durum('canliSesleri')}. Değiştir`,
      ipucu: 'Kuşlar, kurbağalar, böcekler ve küçük memeliler bulundukları yerde, saate ve mevsime göre ara sıra uzaktan seslenir; ses geldiği yönden duyulur. Sesini duyduktan hemen sonra Küçük canlı ara dersen onu bulman kolaylaşır.',
      sec: () => ac('canliSesleri', 'Küçük canlıların sesleri'),
    },
    {
      id: 'donusTiki',
      etiket: `Dönüş tıkırtısı: ${durum('donusTiki')}. Değiştir`,
      ipucu: 'Dönerken her 30 derecede bir tık duyulur; kuzey, doğu, güney ve batıda daha güçlü. İzlediğin hayvan ya da gittiğin yer tam önüne gelince ayrı bir ses çalar.',
      sec: () => ac('donusTiki', 'Dönüş tıkırtısı'),
    },
    {
      id: 'efektKis',
      etiket: `Efektleri konuşmayla karıştırma: ${durum('efektKis')}. Değiştir`,
      ipucu: 'Açıkken oyun konuşurken efekt çalmaz; ses dalgalanmasını önler.',
      sec: () => ac('efektKis', 'Efektleri konuşmayla karıştırma', (y) => Efekt.efektAyarla({ kis: y })),
    },
  ];
}
// Yardım menüsü: konular alt menü, her satır okunur
function yardimListesi(menu, onek) {
  if (menu.ust && menu.ust.startsWith(onek + 'y-')) {
    const y = YARDIM.find((x) => onek + 'y-' + x.id === menu.ust);
    return { baslik: y.baslik, ogeler: [...y.satirlar.map((m, i) => ({ id: 's' + i, etiket: m })), geriOgesi(menu.geri)] };
  }
  return null;
}
const yardimKonulari = (menu, onek) => YARDIM.map((y) => altMenu(onek + 'y-' + y.id, y.baslik, menu.ac));

// ---------------- Ana menü (oyun dışı) ----------------
function AnaMenu({ kip, kayit, devam, yeni, ayar, ayarDegistir }) {
  const menu = useMenuYigini();
  const [, yenile] = useState(0);
  const y = yardimListesi(menu, '');
  if (y) return <Liste key={menu.ust} kip={kip} baslik={y.baslik} ogeler={y.ogeler} onGeri={menu.geri} {...menu.odak(menu.ust)} />;
  if (menu.ust === 'yardim') return <Liste key="yardim" kip={kip} baslik="Nasıl oynanır" ogeler={[...yardimKonulari(menu, ''), geriOgesi(menu.geri)]} onGeri={menu.geri} {...menu.odak('yardim')} />;
  const ay = ayarSayfasi(menu, ayar, (d) => (ayarDegistir(d), yenile((x) => x + 1)), null, () => yenile((x) => x + 1));
  if (ay) return <Liste key={menu.ust} kip={kip} baslik={ay.baslik} ogeler={[...ay.ogeler, geriOgesi(menu.geri)]} onGeri={menu.geri} {...menu.odak(menu.ust)} />;
  if (menu.ust === 'adlar')
    return (
      <Liste
        key="adlar"
        kip={kip}
        baslik="Yeni araştırma"
        giris={kayit ? 'Dikkat: kayıtlı araştırman silinir. Araştırmacının adını seç.' : 'Araştırmacının adını seç.'}
        ogeler={[...ADLAR.map((a) => ({ id: a, etiket: a, sec: () => (yeni(a), 'sessiz') })), geriOgesi(menu.geri)]}
        onGeri={menu.geri}
      />
    );
  const ogeler = [];
  if (kayit)
    ogeler.push({
      id: 'devam',
      etiket: `Devam et: ${kayit.ad}, ${M.gunNo(kayit.dk)}. gün, ${Object.keys(kayit.arsiv.turler).length} tür, ${Object.keys(kayit.arsiv.bireyler).length} birey`,
      sec: () => (devam(), 'sessiz'),
    });
  ogeler.push(altMenu('adlar', 'Yeni araştırma', menu.ac, kayit ? 'Kayıtlı araştırman silinir.' : undefined));
  ogeler.push(altMenu('yardim', 'Nasıl oynanır', menu.ac));
  ogeler.push(altMenu('ayarlar', 'Ayarlar', menu.ac));
  return (
    <Liste
      key="ana"
      kip={kip}
      baslik={OYUN_ADI}
      giris="Afrika savanında doğa araştırması. Kulaklıkla oyna."
      ogeler={ogeler}
      {...menu.odak('ana')}
    />
  );
}

// ---------------- Oyun ----------------
function Oyun({ arastirmaci, ayar, cikis, ayarDegistir }) {
  const kip = useContext(KipBaglam);
  const dRef = useRef(null);
  if (!dRef.current) {
    dRef.current = M.dunyaOlustur(arastirmaci);
    Mz.baslat(dRef.current);
  }
  const d = dRef.current;
  globalThis.__vahsiDunya = d; // denemeler için
  const sahneRef = useRef(null);
  const girdi = useRef({ ileri: 0, don: 0 });
  const adimBitis = useRef(0);
  const menu = useMenuYigini();
  globalThis.__oyunMenu = menu; // denemeler için (araclar/web-deneme/menu-tara.cjs)
  const menuRef = useRef(null);
  menuRef.current = menu.ust;
  // Açık menü listesi: sahadaki tek dokunma katmanı menü açıkken dokunuşları buna iletir
  const listeRef = useRef(null);
  const kenar = useSafeAreaInsets();
  const menuye = () => (menuRef.current ? listeRef.current : null);
  const [, yenile] = useState(0);
  const [altyazi, setAltyazi] = useState('');
  const ayarRef = useRef(ayar);
  ayarRef.current = ayar;
  // VoiceOver dışında sahada bütün ekran dokunma hareketleriyle oynanır (Kayıp Okyanus gibi)
  const jestli = kip !== 'voiceover';
  const aletRef = useRef(0);

  const sonYedek = useRef(Date.now());
  const kaydet = useCallback(() => {
    try {
      const ham = JSON.stringify(M.kayitHazirla(d.k));
      AsyncStorage.setItem(KAYIT_ANAHTAR, ham).catch((e) => hataKaydet(e, 'kayıt'));
      // 5 dakikada bir yedek: ana kayıt bozulursa oyun bundan açılır
      if (Date.now() - sonYedek.current > 5 * 60 * 1000) {
        sonYedek.current = Date.now();
        AsyncStorage.setItem(YEDEK_ANAHTAR, ham).catch(() => {});
      }
    } catch (e) {
      hataKaydet(e, 'kayıt hazırlama');
    }
  }, []);
  const seyir = useRef(false); // sürekli yürüme (Ayarlar > Kontroller)
  tamSurukleme = HASSASIYET[ayar.hassasiyet] || 90;

  const ortamSec = () => {
    if (ayarRef.current.ortam === false) return Efekt.ortamDurdur();
    // Katmanlı ortam (yukarıda ortamHedefleri): yürürken her 0,25 sn'de yeniden hesaplanır, sesler birbirine karışır
    Efekt.ortamKatmanlar(ortamHedefleri(d));
  };

  useEffect(() => {
    Efekt.onYukle(['adim_ot_0', 'adim_ot_1', 'adim_ot_2', 'adim_ot_3', 'donus_tik', 'hedef_onde', 'sonar_2', 'odak', 'etkinles', 'altin', 'seviye', 'hata', 'carpma', 'sinir', 'menu_odak', 'menu_sec', 'menu_geri', 'menu_sinir', 'deklansor', 'durbun_odak']);
    ortamSec();
    let silici;
    setAltyazi('');
    Ses.altyaziDinle((m) => {
      setAltyazi(m);
      clearTimeout(silici);
      silici = setTimeout(() => setAltyazi(''), 6000);
    });
    const k = d.k;
    if (k.egitim === 0) {
      Eg.egitimBaslat(k);
      Ses.soyle(
        `${M.zamanSozu(k.dk)}. Afrika savanındaki küçük araştırma istasyonuna hoş geldin. Bağımsız bir doğa araştırmacısısın: hayvanları rahatsız etmeden izleyecek, her bireyi tanıyacak, savanın sırlarını çözeceksin. Yanında bir arazi aracı, dürbün, fotoğraf makinesi ve ses kayıt cihazı var.${
          kip === 'voiceover' ? '' : ' Tek parmakla sürükleyerek yürürsün; yukarı ileri, sağa ve sola döner.'
        } Kısa bir eğitimle başlayalım.`,
        3
      );
    } else if (k.onarim && k.onarim.length) Ses.soyle(`Kayıtta bazı bozuk değerler bulundu ve onarıldı: ${k.onarim.slice(0, 4).join(', ')}. ${M.konumOzeti(d)}`, 3);
    else Ses.soyle(`${M.zamanSozu(k.dk)}. ${M.konumOzeti(d)}${Mz.okunmamis(k) ? ` ${Mz.okunmamis(k)} okunmamış mesajın var.` : ''}`, 3);
    const alt = AppState.addEventListener('change', (s) => {
      if (s !== 'active') kaydet();
    });
    return () => {
      Ses.altyaziDinle(null);
      Efekt.ortamDurdur();
      Efekt.motorDurdur();
      Efekt.yonluDonguDurdur('dron_dongu');
      alt.remove();
      kaydet();
    };
  }, []);

  useEffect(() => {
    ortamSec();
  }, [ayar.ortam]);
  useEffect(() => {
    if (ayar.grafik === 'kapali' && sahneRef.current) {
      try {
        sahneRef.current.birak();
      } catch (e) {}
      sahneRef.current = null;
    }
  }, [ayar.grafik]);

  const efektCal = (o) => {
    const b = o.id ? M.birey(d, o.id) : null;
    switch (o.tur) {
      case 'hayvanSesi':
        if (b) Efekt.yonlu(TURLER[b.tur].ses, d.oyuncu, b, 0.95, 70);
        return;
      case 'iletisim':
      case 'ureme':
        if (b && o.ses) Efekt.yonlu(TURLER[b.tur].ses, d.oyuncu, b, 1, o.duyma || 120);
        return;
      case 'grupSavunma':
        if (b) Efekt.yonlu(TURLER[b.tur].ses, d.oyuncu, b, 1, 90);
        titret('orta', ayarRef.current);
        return;
      case 'gozlem':
        // Dürbünün odak çarkı, ardından hayvanın yönünden sonar
        Efekt.cal('durbun_odak', 0.7, true);
        if (b) setTimeout(() => Efekt.yonlu('sonar', d.oyuncu, b, 0.6, 200), 350);
        return;
      case 'vardin':
        if (b) Efekt.yonlu('sonar', d.oyuncu, b, 0.6, 200);
        return;
      case 'foto':
        if (o.cekildi && o.id && ayarRef.current.fotoAcisi !== false && !(d.sinematik && d.zaman < d.sinematik.bitis)) d.sinematik = { id: o.id, bitis: d.zaman + 2 };
        if (o.cekildi) Efekt.cal('deklansor', 0.9, true);
        else Efekt.cal('hata', 0.9);
        return;
      case 'gorevBitti':
        Efekt.cal('bildirim_gorev', 0.75);
        return;
      case 'tanimlandi':
      case 'tanik':
        Efekt.cal('altin', 0.8);
        return;
      case 'yeniTur':
      case 'yeniDavranis':
      case 'analizBitti':
        Efekt.cal('seviye', 0.8);
        return;
      case 'sesKayit':
        Efekt.cal(o.basladi ? 'kayit_bas' : 'kayit_bit', 0.75, true);
        return;
      case 'mesaj':
        Efekt.cal('bildirim_mesaj', 0.7);
        return;
      case 'videoBasladi':
        Efekt.cal('video_kamera', 0.75, true);
        return;
      case 'dron':
        Efekt.cal('dron_kalkis', 0.8, true);
        return;
      case 'dronIndi':
        Efekt.cal('dron_inis', 0.8, true);
        return;
      case 'tehdit':
      case 'avBasladi':
        if (b) Efekt.yonlu(TURLER[b.tur].ses, d.oyuncu, b, 1, 90);
        return;
      case 'saldiri':
        Efekt.cal('carpma', 1);
        return;
      case 'gozlemYok':
      case 'hata':
        Efekt.cal('hata', 0.6);
        return;
      case 'bolge':
      case 'zaman':
        ortamSec();
        return;
      case 'hava':
        ortamSec();
        if (o.hava === 'saganakBasladi') Efekt.cal('gok', 0.8);
        return;
      case 'goc':
      case 'mevsim':
      case 'salgin':
        Efekt.cal('seviye', 0.6);
        return;
      case 'belirti':
        if (b) Efekt.yonlu('sonar', d.oyuncu, b, 0.6, 200);
        return;
      case 'numuneTeslim':
      case 'yeniBitki':
        Efekt.cal('altin', 0.7);
        return;
      case 'yeniKucuk':
      case 'kucuk':
        Efekt.cal(o.tur === 'kucuk' ? 'odak' : o.nadir ? 'seviye' : 'altin', o.tur === 'kucuk' ? 0.6 : 0.7);
        // Bulunan canlının gerçek sesi, hemen önünden (Aşama 17)
        if (o.kucuk && KUCUK_SESLI.includes(o.kucuk)) {
          const y = d.oyuncu.yon || 0;
          setTimeout(() => Efekt.yonlu('k_' + o.kucuk, d.oyuncu, { x: d.oyuncu.x + Math.sin(y) * 6, y: d.oyuncu.y + Math.cos(y) * 6 }, 0.75, 70), 900);
        }
        return;
      case 'yarasaCikisi':
        Efekt.cal('yarasa', o.metin ? 0.9 : 0.45);
        return;
      case 'kacakTuzak':
        Efekt.cal('kritik', 0.8);
        return;
      case 'yangin':
        ortamSec();
        Efekt.cal('kritik', 0.7);
        return;
      case 'koruma':
        Efekt.cal('seviye', 0.8);
        return;
      case 'magara':
        ortamSec();
        adimDizisi(d.k.magara && d.k.magara.alan ? UZAK_ALANLAR[d.k.magara.alan].zemin : 'magara', 4);
        return;
      case 'meydan':
      case 'rekabet': {
        const b = M.birey(d, o.id);
        if (b) Efekt.yonlu(TURLER[b.tur].ses, d.oyuncu, b, 1, 120);
        titret('orta', ayarRef.current);
        return;
      }
      case 'dronRapor':
        Efekt.cal('odak', 0.5);
        return;
      case 'basari':
      case 'gizemCozuldu':
        Efekt.cal('kesif', 0.6);
        titret('iyi', ayarRef.current);
        return;
      case 'insan':
        Efekt.cal('telsiz', 0.6);
        return;
      case 'gizem':
      case 'suOlcum':
      case 'gecisSayim':
      case 'yonetim':
      case 'sosyal':
      case 'yalak':
      case 'kamera':
        Efekt.cal('odak', 0.5);
        return;
      case 'kamp':
        Efekt.cal('fermuar', 0.75, true);
        return;
      case 'arac':
        // Araç kapısı: binerken açılıp kapanır, inerken açılır, adım, kapanır
        if (o.bindi) Efekt.cal('kapi_bin', 0.8);
        else if (o.indi) Efekt.cal('kapi_in', 0.8);
        return;
      default:
    }
  };

  // Dinlenme (Aşama 8, kamp ya da istasyon): zaman hızla akar, dünya parça parça hesaplanır
  const dinlenRef = useRef(null);
  const dinlenBaslat = (hedef, yolculuk) => {
    dinlenRef.current = { hedef, ozet: [], bas: d.k.dk, yolculuk };
    d.dinleniyor = true;
    girdi.current = { ileri: 0, don: 0 };
    seyir.current = false;
    if (yolculuk) Ses.hemen(`${yolculuk.metin} Yolculuk yaklaşık ${String(Math.round(((hedef - d.k.dk) / 60) * 10) / 10).replace('.', ',')} saat sürecek; bu arada savanda zaman akıyor.`);
    if (!yolculuk && d.k.kamp && M.mesafe(d.oyuncu, d.k.kamp) < 12) Efekt.cal('fermuar', 0.75, true);
    else Ses.hemen(`Dinleniyorsun. ${M.saatMetni(hedef)} kadar zaman hızla akacak. Ekrana dokunursan dinlenmeyi bırakırsın.`);
  };
  const dinlenBitir = (yarim) => {
    const r = dinlenRef.current;
    dinlenRef.current = null;
    d.dinleniyor = false;
    if (!r) return;
    const sure = Math.round((d.k.dk - r.bas) / 60);
    if (r.yolculuk) {
      // Saha gezisi yolculuğu: varınca (ya da dönünce) bölüme geçilir; savanda olanlar kısa özetlenir
      const m = r.yolculuk.bitince();
      const ozet = r.ozet.length ? ` Yoldayken savandan haberler: ${r.ozet.slice(0, 3).join(' ')}` : '';
      Ses.soyle(`${m}${ozet}`, 4);
      ortamSec();
      kaydet();
      return;
    }
    const ozet = r.ozet.length ? ` Sen dinlenirken: ${r.ozet.slice(0, 6).join(' ')}` : ' Sen dinlenirken önemli bir şey olmadı.';
    Ses.soyle(`${yarim ? 'Dinlenmeyi bıraktın' : 'Dinlendin'}. ${M.zamanSozu(d.k.dk)}; yaklaşık ${sure} saat geçti.${ozet}`, 4);
    kaydet();
  };

  // Zemine göre adım sesi: her zeminin 4 farklı adımı sırayla karışık çalınır (aynı ses art arda gelmez)
  // Torba: dört adım karışık sırayla, her biri bir kez; böylece aynı oynatıcı en az üç adım dinlenir, art arda aynı ses gelmez
  const adimTorba = useRef({ sira: [], son: -1 });
  const adimCal = (zemin, duzey = ADIM_DUZEY[zemin] || 0.3) => {
    const t = adimTorba.current;
    if (!t.sira.length) {
      t.sira = [0, 1, 2, 3].sort(() => Math.random() - 0.5);
      if (t.sira[0] === t.son) t.sira.push(t.sira.shift());
    }
    const n = t.sira.shift();
    t.son = n;
    Efekt.cal(`adim_${zemin}_${n}`, duzey, true);
  };
  // Mağarada oda değiştirirken birkaç adım (yankılı)
  const adimDizisi = (zemin, kac) => {
    for (let i = 0; i < kac; i++) setTimeout(() => adimCal(zemin), i * 430);
  };

  // Ana döngü
  useEffect(() => {
    let son = Date.now();
    let hudSayac = 0;
    let kayitSayac = 0;
    let carpmaSon = 0;
    let rehberSon = 0;
    let rehberMesafe = 0;
    let adimYol = 0;
    let adimSira = false;
    let gokSayac = 8;
    let egitimSayac = -5; // giriş konuşması bitsin
    let sesAltyaziSon = 0;
    const kosuSesi = new Map(); // hayvan kimliği → son koşu sesi zamanı
    let dronSesSon = 0;
    const dronOnceki = { m: null, vr: 0 };
    let kucukSesSayac = 6;
    // Ses efektleri genişlemesi: hayvanların gündelik sesleri, konumlu döngüler, hava ve yangın
    let gundelikSayac = 3;
    const gundelikSon = new Map(); // grup kimliği → son gündelik ses zamanı
    const efektSon = new Map(); // ses adı → son çalınma zamanı
    let dongulerSayac = 0;
    let oncekiYagmur = !!(d.k.eko && d.k.eko.yagmurVar);
    let gokUzakSayac = 40;
    let yanginSayac = 0;
    let kesifSon = 0;
    let kurekYol = 0;
    let kareSira = 0;
    let kareBirikim = 0;
    let ortamSayac = 3;
    let calisiyor = true;
    let raf;
    const dongu = () => {
      if (!calisiyor) return;
      const simdi = Date.now();
      const dt = Math.min(0.1, (simdi - son) / 1000);
      son = simdi;
      if (adimBitis.current && simdi > adimBitis.current) {
        adimBitis.current = 0;
        girdi.current = { ileri: 0, don: 0 };
      }
      if (menuRef.current || dinlenRef.current || !d.k.aracta || ayarRef.current.efekt === false) Efekt.motorDurdur();
      if (menuRef.current || dinlenRef.current) Efekt.yonluDonguDurdur('dron_dongu');
      if (menuRef.current || dinlenRef.current || ayarRef.current.efekt === false) Efekt.donguleriDurdur();
      // Eylem sesleri (dürbün, deklanşör, numune şişesi, tuzak, tasma...) menüden yapılsa da hemen çalar
      for (const e of M.efektleriAl(d)) {
        // Aynı ses 2,5 sn içinde yinelenmez (sürü alarmları zincirleme gelir)
        if (simdi - (efektSon.get(e.ad) || 0) < 2500) continue;
        efektSon.set(e.ad, simdi);
        if (e.x !== undefined) Efekt.yonlu(e.ad, d.oyuncu, e, e.duzey, e.duyma);
        else Efekt.cal(e.ad, e.duzey, true);
      }
      if (dinlenRef.current && !menuRef.current) {
        // Dinlenme: her karede 20 oyun dakikası hesaplanır (gerçekte yaklaşık 2 saat başına 6 kare)
        const r = dinlenRef.current;
        try {
          for (let i = 0; i < 400 && d.k.dk < r.hedef; i++) {
            M.guncelle(d, 0.1, {});
            if (i % 5 === 0) Mz.guncelle(d);
            G.guncelle(d, 0.1);
            Iz.guncelle(d, 0.1);
            H.guncelle(d, 0.1);
            Y.guncelle(d, 0.1);
            Sy.guncelle(d, 0.1);
            Il.guncelle(d, 0.1);
            Ps.guncelle(d, 0.1);
            Bo.guncelle(d, 0.1);
            Ur.guncelle(d, 0.1);
            Ya.guncelle(d, 0.1);
            Ik.guncelle(d, 0.1);
            Hd.guncelle(d, 0.1);
            Bg.guncelle(d, 0.1);
            Kr.guncelle(d, 0.1);
            for (const o of M.olaylariAl(d)) if (G.dinlenmeOzetiSec(o) && r.ozet.length < 12 && !r.ozet.includes(o.metin)) r.ozet.push(o.metin);
          }
        } catch (e) {
          hataKaydet(e, 'dinlenme');
          dinlenRef.current.hedef = 0;
        }
        if (d.k.dk >= r.hedef) dinlenBitir(false);
        raf = requestAnimationFrame(dongu);
        return;
      }
      if (!menuRef.current) {
        let sonuc = { yurudu: 0 };
        try {
          sonuc = M.guncelle(d, dt, girdi.current);
          Mz.guncelle(d);
          G.guncelle(d, dt);
          Iz.guncelle(d, dt);
          H.guncelle(d, dt);
          S.guncelle(d, dt);
          Y.guncelle(d, dt);
          Sy.guncelle(d, dt);
          Il.guncelle(d, dt);
          Ps.guncelle(d, dt);
          Bo.guncelle(d, dt);
          Ur.guncelle(d, dt);
          Ya.guncelle(d, dt);
          Ik.guncelle(d, dt);
          Hd.guncelle(d, dt);
          Bg.guncelle(d, dt);
          Kr.guncelle(d, dt);
        } catch (e) {
          if (hataKaydet(e, 'oyun döngüsü')) Ses.soyle('Oyunda beklenmedik bir hata oldu. Hata kaydedildi; Ayarlar, Hata kayıtları bölümünden bana okuyabilirsin. Oyun sürüyor.', 4);
        }
        const a = ayarRef.current;
        if (sonuc.carpti && seyir.current) {
          seyir.current = false;
          girdi.current = { ileri: 0, don: 0 };
        }
        egitimSayac += dt;
        if (egitimSayac > 1.2) {
          egitimSayac = 0;
          const m = Eg.egitimDenetle(d, a.kip);
          if (m) Ses.soyle(m, 3);
        }
        if (sonuc.carpti && simdi - carpmaSon > 1500) {
          carpmaSon = simdi;
          titret('hafif', a);
          Efekt.cal('carpma', 0.6);
          if (a.kip !== 'gorerek') Ses.soyle(sonuc.nehir ? 'Önünde nehir var. Karşıya yalnızca geçitlerden geçilir.' : sonuc.gol ? 'Önünde gölet var.' : 'Önün kapalı.', 2);
        }
        ortamSayac -= dt;
        if (ortamSayac <= 0) {
          ortamSayac = 3;
          if (d.k.eko && E.yananHucreler(d.k.eko).length) ortamSec();
        }
        if (d.k.eko && d.k.eko.yagmurVar && d.k.eko.siddet > 0.8 && !d.k.magara) {
          gokSayac -= dt;
          if (gokSayac <= 0) {
            gokSayac = 18 + Math.random() * 30;
            Efekt.cal('gok', 0.45 + Math.random() * 0.4);
          }
        }
        // Adım aralığı yürünen yola göre; artan yol bir sonraki adıma aktarılır (ritim kare hızından etkilenmesin)
        adimYol += sonuc.yurudu;
        if (adimYol >= ADIM_ARALIK) {
          adimYol = Math.min(adimYol - ADIM_ARALIK, ADIM_ARALIK * 0.5);
          adimCal(M.zeminTuru(d));
        }
        // Kaçan, kovalayan ve hamle yapan hayvanların koşu sesleri, hayvanın yönünden ve uzaklığına göre (3B).
        // En yakın 3 koşan hayvan; her biri ~1,9 sn'de bir (kayıt 2 sn'lik kesintisiz koşu ritmi), hayvan uzaklaştıkça kısılır.
        if (a.efekt !== false) {
          const kl = M.kosanlar(d, 55);
          for (let i = 0; i < Math.min(3, kl.length); i++) {
            const { b } = kl[i];
            const son = kosuSesi.get(b.id) || 0;
            if (simdi - son < 1850) continue;
            kosuSesi.set(b.id, simdi + Math.random() * 120);
            // Zemine göre: otta boğuk, kuru toprakta tok, suda ve çamurda şapırtılı
            Efekt.yonlu(M.kosuSesiAdi(d, b), d.oyuncu, b, KOSU_DUZEY[M.KOSU_SESI[b.tur]], 55);
          }
          if (kosuSesi.size > 60) kosuSesi.clear();
        }
        // Küçük canlıların uzaktan çağrıları (Aşama 17): bulundukları yere, saate, mevsime göre; yönünden duyulur
        kucukSesSayac -= dt;
        if (kucukSesSayac <= 0) {
          kucukSesSayac = 9 + Math.random() * 14;
          if (a.efekt !== false && a.canliSesleri !== false && !d.dinleniyor && !(d.k.magara && !d.k.magara.alan)) {
            const kk = d.k;
            const tk = E.takvim(M.gunNo(kk.dk));
            const aday = bulunabilirler({
              bolge: M.bolgeBul(d.oyuncu.x, d.oyuncu.y),
              oda: kk.magara ? aktifOda(kk).id : null,
              alan: kk.magara ? kk.magara.alan : null,
              evre: M.evreSimdi(kk),
              mevsim: M.kucukMevsimi(kk),
              yagmur: M.kucukYagmur(kk),
            }).filter((id) => KUCUK_SESLI.includes(id));
            if (aday.length) {
              const id = aday[Math.floor(Math.random() * aday.length)];
              const aci = Math.random() * Math.PI * 2;
              const m = 14 + Math.random() * 30;
              const p = { x: d.oyuncu.x + Math.sin(aci) * m, y: d.oyuncu.y + Math.cos(aci) * m };
              Efekt.yonlu('k_' + id, d.oyuncu, p, KUCUK_DUZEY, 70);
              d.sonDuyulan = { id, zaman: d.zaman, x: p.x, y: p.y };
              if (a.sesAltyazi) setAltyazi(`🔊 ${KUCUKLER[id].ad} sesi, ${M.saatSozu(M.saatYonu(d.oyuncu, p))}`);
            }
          }
        }
        // Hayvanların gündelik sesleri: su içen sürü, otlayan zebralar, yavruların çağrısı, leşteki sırtlanlar,
        // sudaki su aygırları, hortumla su püskürten fil. Saniyede bir bakılır; her grup 9-20 sn'de bir, yönünden duyulur.
        gundelikSayac -= dt;
        if (gundelikSayac <= 0) {
          gundelikSayac = 1;
          if (a.efekt !== false && a.canliSesleri !== false && !d.k.magara) {
            const sec = gundelikSesSec(d, gundelikSon, simdi);
            // Seyrek tut: her grup 20-40 sn'de bir, aynı ses 15 sn'de bir, herhangi bir gündelik ses 5 sn'de bir
            if (sec && simdi - (gundelikSon.get('ses:' + sec.ses) || 0) > 15000) {
              gundelikSayac = 5;
              gundelikSon.set('ses:' + sec.ses, simdi);
              gundelikSon.set(sec.g.id, simdi + 20000 + Math.random() * 20000);
              Efekt.yonlu(sec.ses, d.oyuncu, sec.nokta, sec.duzey, sec.duyma);
            }
            if (gundelikSon.size > 80) gundelikSon.clear();
          }
        }
        // Konumlu sürekli sesler: nehir geçidinin şırıltısı, istasyonun jeneratörü, gece kamp ateşi, dağ ormanında şelale
        dongulerSayac -= dt;
        if (dongulerSayac <= 0) {
          dongulerSayac = 0.25;
          if (a.ortam !== false) Efekt.ortamKatmanlar(ortamHedefleri(d));
          Efekt.muzikAyarla(muzikHedefi(d), MUZIK_DUZEY[a.muzik] ?? MUZIK_DUZEY.dusuk);
          const dz = konumluDonguler(d);
          for (const ad of KONUMLU_DONGULER) Efekt.dongu(ad, a.efekt === false ? 0 : dz[ad] || 0);
        }
        // Yağmurun ilk damlaları ve uzak gök gürültüsü (bulutlu ve yağmurlu günlerde)
        const yagiyor = !!(d.k.eko && d.k.eko.yagmurVar);
        if (yagiyor && !oncekiYagmur && !d.k.magara && a.efekt !== false) Efekt.cal('yagmur_baslangic', 0.85, true);
        oncekiYagmur = yagiyor;
        gokUzakSayac -= dt;
        if (gokUzakSayac <= 0) {
          gokUzakSayac = 60 + Math.random() * 60;
          const hv = d.k.eko && d.k.eko.hava;
          if (hv && ['bulutlu', 'yagmurlu'].includes(hv.tur) && !(d.k.eko.yagmurVar && d.k.eko.siddet > 0.8) && !(d.k.magara && !d.k.magara.alan) && a.efekt !== false)
            Efekt.cal('gok_uzak', 0.35 + Math.random() * 0.3, true);
        }
        // Yangının çıtırtısı yangının yönünden (90 metreye kadar)
        yanginSayac -= dt;
        if (yanginSayac <= 0) {
          yanginSayac = 2.5 + Math.random() * 1.5;
          const yy = !d.k.magara && a.efekt !== false ? M.yanginYakin(d) : null;
          if (yy && yy.m < 90) Efekt.yonlu('yangin_citirti', d.oyuncu, yy, 1, 90);
        }
        // Dronun pervane sesi uçtuğu yerden gelir; teknede kürek sesi
        // Dron sürekli duyulur: uzaklaştıkça kısılır ve perdesi biraz düşer, dönerken yaklaştıkça yükselir (Doppler);
        // sesi dronun olduğu yönden gelir. Dron 10 metre yüksekte uçar.
        if (d.dron && a.efekt !== false) {
          const o = d.oyuncu;
          const m = Math.hypot(Math.hypot(d.dron.x - o.x, d.dron.y - o.y), 10);
          const vr = dronOnceki.m !== null && dt > 0 ? (m - dronOnceki.m) / dt : 0;
          dronOnceki.m = m;
          dronOnceki.vr = dronOnceki.vr * 0.8 + vr * 0.2;
          const rel = Math.atan2(d.dron.x - o.x, d.dron.y - o.y) - (o.yon || 0);
          const yatay = Math.hypot(d.dron.x - o.x, d.dron.y - o.y);
          const kalkis = Math.min(1, (simdi - dronSesSon) / 1500); // kalkış sesi bitene doğru pervane sesi yavaşça açılır
          Efekt.yonluDongu('dron_dongu', 0.85 * kalkis * Math.min(1, Math.pow(12 / m, 1.1)), Math.sin(rel) * Math.min(1, yatay / 8), 1 - (dronOnceki.vr / 340) * 1.6);
        } else {
          Efekt.yonluDonguDurdur('dron_dongu');
          dronOnceki.m = null;
          dronOnceki.vr = 0;
          dronSesSon = simdi;
        }
        // Araç motoru: araçtayken rölanti, hızlandıkça yükselir (düzey ve perde)
        if (d.k.aracta && a.efekt !== false) { const AR = M.aracOzellik(d.k); Efekt.motorDuzey(0.28 + 0.72 * Math.min(1, Math.abs(d.aracHiz) / AR.hiz), AR.perde, AR.duzey); }
        kurekYol += sonuc.kurek || 0;
        if (kurekYol > 2.4) {
          kurekYol = 0;
          Efekt.cal('kurek', 0.5);
        }
        // Dönüş tıkırtısı (Kayıp Okyanus'taki gibi): 30 derecede bir tık, ana yönlerde güçlü; hedef önüne gelince ayrı ses
        if (a.donusTiki !== false && !d.k.magara) {
          const t = M.donusTikirtisi(d);
          if (t) {
            Efekt.cal(t.ses, t.duzey);
            if (t.ses === 'hedef_onde' && a.titresim !== false) Haptics.selectionAsync().catch(() => {});
          }
        }
        for (const o of M.olaylariAl(d)) {
          if (sahneRef.current) sahneRef.current.efekt(o);
          efektCal(o);
          // Keşif anı (karar 85): kısa müzik vurgusu, titreşim, görüntüde kamera hayvana yaklaşır
          if (a.kesifAnlari !== false && Iz.kesifAni(o) && simdi - kesifSon > 6000) {
            kesifSon = simdi;
            Efekt.cal('kesif', 0.55);
            titret('iyi', a);
            const hb = o.id ? M.birey(d, o.id) : null;
            const hedefNokta = hb || (o.x !== undefined ? { x: o.x, y: o.y } : null);
            if (hedefNokta) d.sinematik = { x: hedefNokta.x, y: hedefNokta.y, id: hb ? hb.id : null, bitis: d.zaman + 4.5 };
          }
          // İşitme engelliler için hayvan sesleri altyazıda (Ayarlar > Görünüm)
          if (o.tur === 'hayvanSesi' && a.sesAltyazi && simdi - sesAltyaziSon > 2500) {
            const b = M.birey(d, o.id);
            if (b) {
              sesAltyaziSon = simdi;
              setAltyazi(`🔊 ${M.SOZ[b.tur]} sesi, ${M.saatSozu(M.saatYonu(d.oyuncu, b))}, ${M.metreSozu(M.mesafe(d.oyuncu, b))}`);
            }
          }
          if (o.tur === 'bolge' && a.otoBetimle && a.kip !== 'gorerek') {
            const kb = B.kisaBetimle(d);
            if (kb) Ses.soyle(kb, 1);
          }
          if (o.tur === 'tehdit') titret('kotu', a);
          else if (o.tur === 'saldiri') titret('agir', a);
          else if (['yeniTur', 'tanimlandi', 'yeniDavranis', 'analizBitti', 'gorevBitti'].includes(o.tur)) titret('iyi', a);
          else if (o.tur === 'foto' && o.cekildi) titret('hafif', a);
          if (o.metin) Ses.soyle(o.metin, o.oncelik);
          if (KALICI_OLAYLAR.includes(o.tur)) kayitSayac = 19; // önemli kayıtlar 1 saniye içinde saklanır
        }
        // Yön rehberi: bir yere ya da hayvana giderken
        const hedef = d.yaklasId ? M.gozlenen(d) : d.rota;
        if (a.rehber && a.kip !== 'gorerek' && hedef && simdi - rehberSon > 7000) {
          const m = M.mesafe(d.oyuncu, hedef);
          if (Math.abs(m - rehberMesafe) > 4) {
            rehberSon = simdi;
            rehberMesafe = m;
            Ses.soyle(`${hedef.ad || M.bireyAdi(hedef)}, ${M.saatSozu(M.saatYonu(d.oyuncu, hedef))}, ${M.metreSozu(m)}.`, 1);
          }
        }
        kayitSayac += dt;
        if (kayitSayac > 20) {
          kayitSayac = 0;
          kaydet();
        }
      }
      if (sahneRef.current && !menuRef.current) {
        d.kameraAyar = { uzak: ayarRef.current.kameraUzak, aci: ayarRef.current.kameraAci };
        kareSira++;
        kareBirikim += dt;
        if (ayarRef.current.grafik !== 'dusuk' || kareSira % 2 === 0) {
          try {
            sahneRef.current.kare(kareBirikim);
          } catch (e) {
            hataKaydet(e, 'üç boyutlu çizim');
            sahneRef.current = null;
          }
          kareBirikim = 0;
        }
      }
      hudSayac += dt;
      if (hudSayac > 0.25) {
        hudSayac = 0;
        if (!menuRef.current) yenile((x) => x + 1);
      }
      raf = requestAnimationFrame(dongu);
    };
    raf = requestAnimationFrame(dongu);
    return () => {
      calisiyor = false;
      cancelAnimationFrame(raf);
      if (sahneRef.current) sahneRef.current.birak();
    };
  }, []);

  // Tanı için: üç boyutlu görüntü 8 saniyede kurulmadıysa hata kayıtlarına yazılır
  const glCagrildi = useRef(false);
  useEffect(() => {
    const z = setTimeout(() => {
      if (ayarRef.current.grafik === 'kapali') return;
      if (!glCagrildi.current) hataKaydet(new Error('Üç boyutlu görüntünün çizim bağlamı 8 saniyede oluşmadı'), 'üç boyutlu görüntü');
      else if (!sahneRef.current) hataKaydet(new Error('Üç boyutlu sahne kurulmadı'), 'üç boyutlu görüntü');
    }, 8000);
    return () => clearTimeout(z);
  }, []);
  const glHazir = useCallback((gl) => {
    glCagrildi.current = true;
    try {
      sahneRef.current = sahneKur(gl, d, { dusuk: ayarRef.current.grafik === 'dusuk' });
    } catch (e) {
      hataKaydet(e, 'üç boyutlu sahne kurulumu');
      sahneRef.current = null;
    }
  }, []);

  const adimAt = (ileri, don, sure) => {
    girdi.current = { ileri, don };
    adimBitis.current = Date.now() + sure;
  };

  const k = d.k;
  const gb = M.gozlenen(d);
  const aracYakin = M.aracYakinMi(d);
  const aletler = aletlerAl(d.k);
  if (aletRef.current >= aletler.length) aletRef.current = 0;
  const alet = aletler[aletRef.current];

  const menuAc = (id, soz) => {
    if (!menuRef.current) kaydet();
    girdi.current = { ileri: 0, don: 0 };
    menu.ac(id);
    if (soz) Ses.hemen(soz);
  };
  const menuKapat = (soz = 'Sahaya dönüldü.') => {
    menu.kapat();
    kaydet();
    if (soz) Ses.soyle(soz, 3);
  };
  const aracIslemi = () => {
    if (k.teknede) return void G.tekneden(d);
    if (G.tekneYakin(d) && !M.aracYakinMi(d)) {
      const m = G.tekneyeBin(d);
      if (m) Ses.hemen(m);
      return;
    }
    if (k.aracta) M.aractanIn(d);
    else if (M.aracYakinMi(d)) M.aracaBin(d);
    else M.yerGit(d, 'arac');
  };
  const durVeBitir = () => {
    const vardi = d.rota || d.yaklasId || M.gozlenen(d) || seyir.current;
    seyir.current = false;
    girdi.current = { ileri: 0, don: 0 };
    M.dur(d);
    M.gozlemBitir(d);
    Ses.hemen(vardi ? 'Durdun, gözlem bitti.' : 'Zaten duruyorsun.');
  };
  const aletSec = (i) => {
    aletRef.current = i;
    const a = aletlerAl(d.k)[i];
    Efekt.cal('odak', 0.6);
    Ses.hemen(a.ad); // yalnızca adı (Murat: her geçişte uzun açıklama yorucu; açıklama Alet menüsünde uzun basınca)
    yenile((x) => x + 1);
  };
  const sahaJest = useJestler(
    {
      onSurukle: (mod, dx, dy, bilgi) => {
        if (menuRef.current) {
          const L = menuye();
          if (L) L.surukle(mod, dx, dy, bilgi);
          return;
        }
        if (d.k.magara) return;
        if (mod === 'tek') {
          adimBitis.current = 0;
          girdi.current = { ileri: olcekle(-dy), don: olcekle(dx) };
        }
      },
      onSurukleBitti: () => {
        if (menuRef.current) return;
        if (ayarRef.current.surekliYuru && girdi.current.ileri > 0.5 && !d.k.magara) {
          seyir.current = true;
          girdi.current = { ileri: girdi.current.ileri, don: 0 };
          Ses.hemen('Yürümeye devam ediyorsun. Durmak için iki parmakla aşağı kaydır.');
          return;
        }
        girdi.current = { ileri: 0, don: 0 };
      },
      onKaydir: (yon, parmak) => {
        if (menuRef.current) {
          const L = menuye();
          if (L) L.kaydir(yon, parmak);
          return;
        }
        if (d.k.magara && parmak < 2) {
          if (yon === 'yukari') K.magaraIlerle(d);
          else if (yon === 'asagi') K.magaraGeri(d);
          return;
        }
        if (parmak < 2) return;
        if (yon === 'sag' || yon === 'sol') {
          const n = aletlerAl(d.k).length;
          aletSec((aletRef.current + (yon === 'sag' ? 1 : n - 1)) % n);
        }
        else if (yon === 'yukari') aracIslemi();
        else durVeBitir();
      },
      onDokun: (parmak, konum) => {
        if (dinlenRef.current) return void (dinlenRef.current.yolculuk ? Ses.hemen('Yoldasın; yolculuk bitince haber vereceğim.') : dinlenBitir(true));
        if (menuRef.current) {
          const L = menuye();
          if (L) L.dokun(parmak, konum);
          return;
        }
        if (parmak >= 2) return Ses.sus();
        if (d.k.magara) return Ses.hemen(`${K.odaTarifi(d.k)} ${d.k.magara.alan ? `Yukarı ve aşağı kaydırarak noktalar arasında gezersin; dürbünle çift dokununca canlı ararsın.${d.k.magara.oda ? '' : ' İstasyona dönmek için menüyü aç.'}` : `Aşağı kaydırırsan ${d.k.magara.oda ? 'bir önceki odaya dönersin' : 'mağaradan çıkarsın'}.`}`);
        const b = M.gozlenen(d);
        let m = b ? `${M.gozlemTarifi(d, b)}.` : M.etrafiTara(d);
        if (d.rota) m += ` ${d.rota.ad} yolundasın, ${M.saatSozu(M.saatYonu(d.oyuncu, d.rota))}, ${M.metreSozu(M.mesafe(d.oyuncu, d.rota))}.`;
        Ses.hemen(m);
      },
      onCiftDokun: (parmak) => {
        if (menuRef.current) {
          const L = menuye();
          if (L) L.ciftDokun(parmak);
          return;
        }
        if (parmak >= 2) {
          Efekt.cal('menu_sec', 0.55);
          menuAc('ana');
          return;
        }
        const al = aletlerAl(d.k)[aletRef.current] || ALETLER[0];
        if (d.k.magara && (al.id === 'durbun' || al.id === 'yaklas')) K.kucukAra(d);
        else al.kullan(d);
      },
      onUzunBas: (konum) => {
        if (menuRef.current) {
          const L = menuye();
          if (L) L.uzunBas(konum);
          return;
        }
        Ses.hemen(B.betimle(d, (aletlerAl(d.k)[aletRef.current] || ALETLER[0]).ad));
      },
    },
    { dokunmaBekle: true }
  );

  // ---------- Oyun menüsü (Kayıp Okyanus dalış ve gemi menüleri gibi) ----------
  const geri = () => (menu.yol.length <= 1 ? menuKapat() : menu.geri());
  const kapatVe = (f) => () => {
    menu.kapat();
    kaydet();
    f();
    return 'sessiz';
  };
  const liste = (anahtar, baslik, ogeler, giris) => (
    <Liste key={anahtar} ref={listeRef} disaridanJest={jestli} kip={kip} baslik={baslik} giris={giris} ogeler={[...ogeler, geriOgesi(geri)]} onGeri={geri} {...menu.odak(anahtar)} />
  );
  const bilgi = (id, etiket, ipucu) => ({ id, etiket, ipucu });
  // Menüde bir işlem yapar, sonucunu söyler ve menüyü yeni değerlerle yeniden çizer
  const yap = (f) => () => {
    Ses.hemen(f());
    yenile((x) => x + 1);
    return 'sessiz';
  };
  const yerTarifi = (h) => `${M.saatSozu(M.saatYonu(d.oyuncu, h))}, ${M.metreSozu(M.mesafe(d.oyuncu, h))}`;

  const menuIcerigi = () => {
    const u = menu.ust;
    if (!u) return null;
    const yardim = yardimListesi(menu, 'o');
    if (yardim) return liste(u, yardim.baslik, yardim.ogeler.slice(0, -1));
    // Kuzey Kutbu: savana dönüş satırı (uçak kulübenin yanındaki pistten kalkar)
    const kutupDonSatiri = () => ({
      id: 'kutupDon',
      etiket: K.kulubedeMi(d) ? `Savana dön: uçakla ${String(K.KUTUP_GEZI.donus / 60).replace('.', ',')} saat` : `Kulübeye git, oradan savana dönülür: ${yerTarifi(K.KULUBE_KAPI)}`,
      sec: () => {
        if (!K.kulubedeMi(d)) {
          menu.kapat();
          M.yerGit(d, 'k_kulube');
          return 'sessiz';
        }
        const h = K.kutuptanHazirla(d);
        if (h) {
          Ses.hemen(h);
          return 'sessiz';
        }
        menu.kapat();
        dinlenBaslat(k.dk + K.KUTUP_GEZI.donus, { metin: 'Uçak kulübenin yanındaki pistten kalktı; savandaki istasyona dönüyorsun.', bitince: () => K.kutuptanDon(d) });
        return 'sessiz';
      },
    });
    if (u === 'ana') {
      // Kısa ana menü (Murat "menüyü daha efektif hale getir" dedi): sık kullanılanlar üstte, seyrek olanlar iki alt menüde.
      // O an yapılabilen işler (mağara, tel tuzağı, dur) Sahaya dön'ün hemen altına gelir.
      const ogeler = [{ id: 'sahayaDon', etiket: 'Sahaya dön', sec: () => (menuKapat(), 'sessiz') }];
      const kutupta = M.oyuncuKutupta(k);
      const tz = K.yakinTuzak(d, 6);
      if (tz && tz.bulundu) ogeler.push({ id: 'sok', etiket: 'Tel tuzağı sök ve bildir', sec: yap(() => K.tuzakSok(d)) });
      if (k.magara) ogeler.push(altMenu('magara', k.magara.alan ? `Saha gezisi: ${bolumAdi(k)}, ${aktifOda(k).ad}` : `Mağaradasın: ${aktifOda(k).ad}`, menu.ac));
      else if (K.magaraYakin(d))
        ogeler.push({
          id: 'magaraGir',
          etiket: 'Mağaraya gir',
          sec: () => {
            const m = K.magarayaGir(d);
            if (!d.k.magara) Ses.hemen(m);
            else {
              menu.kapat();
              kaydet();
            }
            return 'sessiz';
          },
        });
      if (d.rota || d.yaklasId || gb) ogeler.push({ id: 'dur', etiket: 'Dur ve gözlemi bitir', sec: kapatVe(durVeBitir) });
      if (k.teknede) ogeler.push({ id: 'tekneIn', etiket: 'Tekneden in, karaya çık', sec: kapatVe(() => G.tekneden(d)) });
      else if (G.tekneYakin(d)) ogeler.push({ id: 'tekneBin', etiket: 'Tekneye bin', sec: kapatVe(() => G.tekneyeBin(d)) });
      const zk = H.konusulabilir(d);
      if (zk) ogeler.push({ id: 'konus', etiket: `Konuş: ${H.KISILER[zk.kim].ad}`, ipucu: H.KISILER[zk.kim].unvan, sec: yap(() => H.konus(d)) });
      if (Eg.egitimSuruyor(k)) ogeler.push({ id: 'egitim', etiket: Eg.adimMetni(k, kip), ipucu: 'Eğitimin sıradaki adımı.' });
      const ok = Mz.okunmamis(k);
      ogeler.push(
        { id: 'betimle', etiket: 'Çevreyi betimle', ipucu: 'Işık, hava, zemin, önündeki engel, yakındaki yerler, sesler ve hayvanlar.', sec: () => (Ses.hemen(B.betimle(d, alet.ad)), 'sessiz') },
        altMenu('cevre', `Görüş alanındaki hayvanlar: ${M.gorunurler(d).length}`, menu.ac),
        altMenu('yerler', 'Yerler ve yolculuk', menu.ac),
        ...(kutupta
          ? [kutupDonSatiri()]
          : [altMenu('harita', `Ekosistem haritası. ${G.haritaOzeti(d)}`, menu.ac), { id: 'arac', etiket: k.aracta ? 'Araçtan in' : aracYakin ? 'Araca bin' : `Araca git: ${yerTarifi(k.arac)}`, sec: kapatVe(aracIslemi) }]),
        altMenu('alet', `Alet: ${alet.ad}. Değiştir`, menu.ac),
        altMenu('doga', 'Doğa: ekosistem, bitkiler, numune, küçük canlılar', menu.ac),
        altMenu('merkez', `Araştırma merkezi${ok ? `: ${ok} okunmamış mesaj` : ''}`, menu.ac),
        altMenu('arsiv', `Arşiv: ${Object.keys(k.arsiv.turler).length} tür, ${M.taninanBireyler(k).length} birey`, menu.ac),
        altMenu('oyun', 'Durum, ayarlar, yardım ve kayıt', menu.ac)
      );
      return <Liste key="ana" ref={listeRef} disaridanJest={jestli} kip={kip} baslik="Menü" giris={`${M.saatMetni(k.dk)}, ${M.bolgeAdi(d.oyuncu.x, d.oyuncu.y)}.`} ogeler={ogeler} onGeri={geri} {...menu.odak('ana')} />;
    }
    if (u === 'harita') {
      const ogeler = [bilgi('ozet', G.haritaOzeti(d)), ...G.hakimiyetSatirlari(d).map((m, i) => bilgi('h' + i, m))];
      G.haritaBolgeleri(d).forEach((x) => ogeler.push(altMenu('hb-' + x.id, `${x.ad}, ${yerTarifi(x.p)}`, menu.ac)));
      return liste(u, 'Ekosistem haritası', ogeler, 'Bölgeler yakından uzağa sıralı.');
    }
    if (u.startsWith('hb-')) {
      const id = u.slice(3);
      const p = G.BOLGE_MERKEZ[id];
      if (!p) return liste(u, 'Bölge', [bilgi('yok', 'Bölge bulunamadı.')]);
      const ogeler = G.haritaBolgeSatirlari(d, id).map((m, i) => bilgi('s' + i, m));
      if (!k.teknede && !k.magara)
        ogeler.push({
          id: 'git',
          etiket: `Bu bölgeye ${k.aracta ? 'sür' : 'yürü'}`,
          sec: kapatVe(() => {
            d.rota = { x: p.x, y: p.y, ad: BOLGE_ADLARI[id], yakin: 8 };
            d.yaklasId = null;
            M.olay(d, 'rota', `${BOLGE_ADLARI[id]} yönüne ${k.aracta ? 'sürüyorsun' : 'yürüyorsun'}. ${M.BuyukHarf(yerTarifi(p))}.`, 3);
          }),
        });
      return liste(u, BOLGE_ADLARI[id], ogeler);
    }
    if (u === 'hedefler') {
      return liste(u, 'Büyük hedefler', Hd.HEDEFLER.map((h) => altMenu('hedef-' + h.id, Hd.hedefSatiri(k, h), menu.ac, h.tarif)));
    }
    if (u.startsWith('hedef-')) {
      const h = Hd.HEDEFLER.find((x) => x.id === u.slice(6));
      if (!h) return liste(u, 'Hedef', [bilgi('yok', 'Hedef bulunamadı.')]);
      return liste(u, h.ad, Hd.hedefDetay(k, h).map((m, i) => bilgi('h' + i, m)));
    }
    if (u === 'iklimKaydi') {
      return liste(u, 'İklim kaydı', Ik.iklimSatirlari(k).map((m, i) => bilgi('ik' + i, m)));
    }
    if (u === 'yayinlar') {
      const y = Ya.yayinAlani(k);
      const ogeler = [];
      y.makaleler.filter((m) => m.durum === 'duzeltme').forEach((m) =>
        ogeler.push({ id: 'dz' + m.konu, etiket: `Düzeltmeyi gönder: ${Ya.makaleBasligi(m)}`, ipucu: 'Hakemler yeni saha verisi istiyor; gönderilen makaleden sonra en az bir yeni fotoğraf, ses ya da video gerekir.', sec: yap(() => Ya.duzeltmeGonder(d, m.konu)) }),
      );
      Ya.yazilabilirler(k).forEach((a) => ogeler.push(altMenu('yaz-' + a.id, `Makale yaz: ${a.ad}`, menu.ac)));
      y.makaleler.forEach((m, i) => ogeler.push(bilgi('m' + i, Ya.makaleSatiri(m))));
      if (!y.makaleler.length && !Ya.yazilabilirler(k).length) ogeler.push(bilgi('yok', 'Henüz makale yazılacak tamamlanmış bir araştırma yok. Merkez, Araştırmalar bölümünde bir araştırmanın koşullarını tamamlayıp analizini bitirince makalesini yazabilirsin.'));
      ogeler.push(altMenu('isbirlikleri', 'Bilimsel kuruluşlarla veri alışverişi', menu.ac));
      return liste(u, 'Yayınlar ve iş birlikleri', ogeler, `Bilimsel itibar ${k.itibar}. ${Ya.ozet(k)}.`);
    }
    if (u.startsWith('yaz-')) {
      const konu = u.slice(4);
      const ogeler = Ya.DERGI_SIRASI.map((id) => {
        const dg = Ya.DERGILER[id];
        if (!Ya.dergiAcikMi(k, id)) return bilgi('k' + id, `${dg.ad}: bilimsel itibarın ${dg.itibar} olunca gönderebilirsin.`);
        const p = Math.round(Ya.kabulOlasiligi(k, id) * 10);
        const sans = p >= 7 ? 'kabul şansı yüksek' : p >= 5 ? 'kabul şansı orta' : 'kabul şansı düşük';
        return { id: 'd' + id, etiket: `${dg.ad} dergisine gönder: ${sans}, yayımlanırsa ${Mz.liraSozu(dg.odul.fon)} destek`, sec: () => {
            Ses.hemen(Ya.gonder(d, konu, id));
            kaydet();
            menu.geri();
            return 'sessiz';
          },
        };
      });
      ogeler.push(bilgi('not', 'Biyolog personelin varsa ve arşivinde çok fotoğraf, ses ve video varsa kabul şansı artar. Prestijli dergiler daha çok itibar ve atıf getirir ama daha seçicidir.'));
      return liste(u, 'Dergi seç', ogeler);
    }
    if (u === 'isbirlikleri') {
      const ogeler = Ya.ISBIRLIGI_SIRASI.map((id) => {
        const ib = Ya.ISBIRLIKLERI[id];
        const du = Ya.isbirligiDurumu(d, id);
        if (du.yapildi) return bilgi('y' + id, `${ib.ad}: veri alışverişi yapıldı.`);
        if (du.hazir) return { id: 'i' + id, etiket: `${ib.ad}: ${ib.istek} paylaş, ${Mz.liraSozu(ib.odul.fon)} destek`, sec: yap(() => Ya.isbirligiYap(d, id)) };
        return bilgi('b' + id, `${ib.ad} senden ${ib.istek} istiyor: ${du.n} / ${du.hedef}.`);
      });
      return liste(u, 'Veri alışverişi', ogeler, 'Her kuruluşla bir kez veri alışverişi yapılır.');
    }
    if (u === 'tohumlar') {
      const ogeler = [];
      Bo.yakinTohumlar(d).forEach((t) => {
        const m = Math.hypot(t.x - d.oyuncu.x, t.y - d.oyuncu.y);
        if (m <= 12) ogeler.push({ id: 'i' + t.no, etiket: `İncele: ${Bo.tohumAdi(t)}, yanındasın`, sec: yap(() => Bo.tohumIncele(d, t)) });
        else if (!k.teknede && !k.magara)
          ogeler.push({
            id: 'g' + t.no,
            etiket: `${M.BuyukHarf(Bo.tohumAdi(t))}, ${yerTarifi(t)}: oraya ${k.aracta ? 'sür' : 'yürü'}`,
            sec: kapatVe(() => {
              d.rota = { x: t.x, y: t.y, ad: Bo.tohumAdi(t), yakin: 6 };
              d.yaklasId = null;
              M.olay(d, 'rota', `${M.BuyukHarf(Bo.tohumAdi(t))} yönüne gidiyorsun. ${M.BuyukHarf(yerTarifi(t))}. Varınca menüden incele.`, 3);
            }),
          });
      });
      if (!ogeler.length) ogeler.push(bilgi('yok', '80 metre içinde tohum taşıyan dışkı ya da fide yok. Filler, zürafalar, impalalar ve babunlar akasya ve çöl hurması meyvelerini yer, tohumları dışkılarıyla uzağa taşır. Baklalar ve meyveler olgunken bu hayvanların gezdiği yerlere bak; tohumlar yağışlı mevsimde filizlenir.'));
      Bo.yayilimSatirlari(k).forEach((m, i) => ogeler.push(bilgi('k' + i, m)));
      if (Bo.botanikAlani(k).yetisen) ogeler.push(bilgi('yetisen', `Hayvanların taşıdığı tohumlardan yetişen genç ağaç: ${Bo.botanikAlani(k).yetisen}.`));
      return liste(u, 'Tohum ve fideler', ogeler);
    }
    if (u === 'koloniler') {
      const ogeler = [];
      Bo.KOLONI_SIRASI.forEach((id) => {
        const kol = Bo.KOLONILER[id];
        const yakin = M.mesafe(d.oyuncu, kol) <= 15;
        if (yakin) ogeler.push({ id: 'i' + id, etiket: `İncele: ${Bo.koloniSatiri(d, id)}`, sec: yap(() => Bo.koloniIncele(d, id)) });
        else
          ogeler.push({
            id: 'g' + id,
            etiket: `${Bo.koloniSatiri(d, id)}. Oraya ${k.aracta ? 'sür' : 'yürü'}`,
            ipucu: kol.tarif,
            sec: kapatVe(() => {
              d.rota = { x: kol.x, y: kol.y, ad: kol.ad, yakin: 8 };
              d.yaklasId = null;
              M.olay(d, 'rota', `${kol.ad} yönüne gidiyorsun. ${M.BuyukHarf(yerTarifi(kol))}. Varınca menüden Koloniyi incele seç.`, 3);
            }),
          });
      });
      ogeler.push(bilgi('not', 'Koloniler saate, mevsime ve yağmura göre farklı şeyler yapar: gece, yağmurdan sonra ve farklı mevsimlerde yeniden gelip incele.'));
      return liste(u, 'Böcek kolonileri', ogeler);
    }
    if (u === 'yuvalar') {
      const l = Iz.yuvaSatirlari(d);
      const ogeler = [];
      l.forEach(({ y, metin, tarif }) => {
        ogeler.push(bilgi('y' + y.id, metin, tarif));
        if (!k.teknede && !k.magara)
          ogeler.push({
            id: 'git' + y.id,
            etiket: `${M.YUVA_TURLERI[y.tur].ad}: oraya ${k.aracta ? 'sür' : 'yürü'}`,
            sec: kapatVe(() => {
              d.rota = { x: y.x, y: y.y, ad: M.YUVA_TURLERI[y.tur].ad, yakin: 12 };
              d.yaklasId = null;
              M.olay(d, 'rota', `${M.YUVA_TURLERI[y.tur].ad} yönüne gidiyorsun. ${M.BuyukHarf(yerTarifi(y))}. Hayvanları ürkütmemek için yaklaşınca dur.`, 3);
            }),
          });
      });
      if (!l.length) ogeler.push(bilgi('yok', 'Henüz bilinen in ya da yuva yok. Hayvanların izlerini takip et, GPS tasmalı hayvanların gece döndüğü yere bak ya da dronla tara. Sırtlanlar, yaban köpekleri, leopar, aslanlar, balık kartalı, timsah ve babunların gizli yerleri var.'));
      return liste(u, 'İnler ve yuvalar', ogeler);
    }
    if (u === 'videolar' || u.startsWith('videolar~')) {
      const tum = (k.arsiv.videolar || []).map((v) => {
        const b = M.birey(d, v.bireyId);
        const ad = b && M.taninmisMi(b) ? M.bireyAdi(b) : M.SOZ[v.tur];
        return bilgi('v' + v.id, `${ad}, ${v.sure} saniye, kalite ${v.kalite}: ${v.davranislar.map((x) => kucuk(M.davranisAdi(x))).join(', ')}. ${v.bolge}, ${zamanKisa(v.dk)}`);
      });
      const s = sayfali('videolar', tum, menu, 10);
      if (s.sayfa) return liste(s.sayfa.anahtar, s.sayfa.baslik, s.sayfa.ogeler);
      return liste(u, 'Videolar', s.ogeler.length ? s.ogeler : [bilgi('bos', 'Henüz video yok. Aletlerden Video kamerayı seçip gözlediğin hayvanı çek.')]);
    }
    if (u === 'doga' && M.oyuncuKutupta(k)) {
      const ogeler = [
        altMenu('kutupEko', `Kutup raporu: ${Kt.MEVSIM_ADI[M.kutupMevsimi(k)]}, ${Kt.havaSozu(M.kutupHavasi(k), k.dk).split(',')[0].toLocaleLowerCase('tr-TR')}`, menu.ac),
        { id: 'ara', etiket: 'Küçük canlı ara', ipucu: 'Kuş, böcek, balık ve küçük memelileri arar.', sec: kapatVe(() => K.kucukAra(d)) },
        { id: 'izAra', etiket: 'İzleri incele', ipucu: 'Karda ve çamurda yakındaki ayak izlerini okur.', sec: yap(() => Iz.izAra(d)) },
        ...(d.sonIz ? [{ id: 'izTakip', etiket: 'İzi takip et', sec: kapatVe(() => Ses.hemen(Iz.izTakip(d))) }] : []),
        altMenu('bitkiler', `Çevredeki bitkiler: ${Mz.cevredekiBitkiler(d).length}`, menu.ac),
        ...(['gece', 'aksam'].includes(M.evreSimdi(k)) ? [{ id: 'gozTara', etiket: `Fenerle göz parıltısı tara${Gc.gozKatalogu(k).length ? `: katalogda ${Gc.gozKatalogu(k).length} tür` : ''}`, sec: yap(() => Gc.gozTara(d)) }] : []),
        altMenu('numune', `Numune${k.numuneKutusu.length ? `: kutuda ${k.numuneKutusu.length} numune` : ''}`, menu.ac),
      ];
      return liste(u, 'Doğa: Kuzey Kutbu', ogeler);
    }
    if (u === 'kutupEko') {
      const tk = Kt.kutupTakvim(M.gunNo(k.dk));
      const bk = Kt.buzKenari(k.dk);
      const buz = bk >= KUTUP.r - 5 ? 'Deniz açık; kıyıdan ufka kadar buzsuz, yalnız yüzen buz parçaları var.' : bk <= 50 ? 'Deniz tamamen donmuş; buz kıyıya dayanıyor. Halkalı foklar buzun altında nefes delikleri açıyor.' : `Deniz buzunun kenarı kıyıdan yaklaşık ${Math.round(bk - 40)} metre açıkta; aradaki deniz açık.`;
      const sayilar = KUTUP_SIRASI.filter((t) => k.arsiv.turler[t]).map((t) => `${kucuk(M.SOZ[t])} ${k.hayvanlar.filter((b) => !b.olu && b.tur === t).length}`);
      const ogeler = [
        bilgi('mev', `${M.BuyukHarf(Kt.MEVSIM_ADI[tk.mevsim])}, ${tk.mevsimGunu}. gün (${tk.uzunluk} günlük mevsim). ${Kt.isikSozu(k.dk)}`),
        bilgi('hava', Kt.havaSozu(M.kutupHavasi(k), k.dk)),
        bilgi('buz', buz),
        bilgi('polinya', 'Polinya, akıntının kışın bile açık tuttuğu su gölü; kışın belugalar, morslar ve deniz kuşları orada toplanır.'),
        bilgi('takvim', 'Kutup yılı: 8 gün yaz (güneş batmaz), 4 gün sonbahar, 8 gün kış (güneş doğmaz), 4 gün ilkbahar. Deniz buzu sonbaharda donar, ilkbaharın sonunda kırılır.'),
      ];
      if (sayilar.length) ogeler.push(bilgi('nufus', `Kaydedilen türlerin bölgedeki sayıları: ${sayilar.join(', ')}.`));
      return liste(u, 'Kutup raporu', ogeler);
    }
    if (u === 'doga') {
      const ogeler = [
        altMenu('ekosistem', `Ekosistem: ${E.MEVSIM_ADI[E.takvim(M.gunNo(k.dk)).mevsim]}, ${k.eko.yagmurVar ? 'yağmur yağıyor' : 'hava ' + E.HAVA_ADI[k.eko.hava.tur]}`, menu.ac),
        { id: 'ara', etiket: 'Küçük canlı ara', ipucu: 'Böcek, kuş, kurbağa, sürüngen ve küçük memelileri arar.', sec: kapatVe(() => K.kucukAra(d)) },
        { id: 'izAra', etiket: 'İzleri incele', ipucu: 'Yakındaki ayak izlerini okur: hangi hayvan, ne kadar taze, hangi yöne gitmiş.', sec: yap(() => Iz.izAra(d)) },
        ...(d.sonIz ? [{ id: 'izTakip', etiket: 'İzi takip et', ipucu: 'İzlerin gittiği yöne yürürsün; izler bir ine çıkıyorsa oraya.', sec: kapatVe(() => Ses.hemen(Iz.izTakip(d))) }] : []),
        altMenu('su', `Su araştırması${S.yakinNokta(d) ? `: ${S.yakinNokta(d).ad}` : ''}`, menu.ac),
        altMenu('yuvalar', `Bilinen inler ve yuvalar: ${Iz.bilinenYuvalar(k).length} / ${(k.yuvalar || []).length}`, menu.ac),
        altMenu('bitkiler', `Çevredeki bitkiler: ${Mz.cevredekiBitkiler(d).length}`, menu.ac),
        ...(Ik.sabitleDurumu(k) && !Ik.sabitleDurumu(k).sabit ? [{ id: 'sabitle', etiket: 'Fırtına geliyor: ekipmanı ve istasyonu sabitle', ipucu: 'Kamera tuzakları, kamp ve istasyon fırtınada zarar görmez. Küçük bir malzeme gideri var.', sec: yap(() => Ik.sabitle(d)) }] : []),
        ...Ik.devrikTuzaklar(k).map((t) =>
          M.mesafe(d.oyuncu, t) <= 8
            ? { id: 'duzelt' + t.id, etiket: `Devrilen kamera tuzağını düzelt: ${t.bolge}`, sec: yap(() => Ik.tuzakDuzelt(d, t)) }
            : {
                id: 'devrik' + t.id,
                etiket: `Devrilen kamera tuzağı, ${t.bolge}, ${yerTarifi(t)}: oraya ${k.aracta ? 'sür' : 'yürü'}`,
                sec: kapatVe(() => {
                  d.rota = { x: t.x, y: t.y, ad: 'Devrik kamera tuzağı', yakin: 5 };
                  d.yaklasId = null;
                  M.olay(d, 'rota', `Devrilen kamera tuzağına gidiyorsun. ${M.BuyukHarf(yerTarifi(t))}. Varınca Doğa menüsünden düzelt.`, 3);
                }),
              },
        ),
        ...(k.kamp && k.kamp.hasarli ? [{ id: 'kampOnar', etiket: `Kamp çadırını onar${M.mesafe(d.oyuncu, k.kamp) > 10 ? `: kamp ${yerTarifi(k.kamp)}` : ''}`, sec: yap(() => Ik.kampOnar(d)) }] : []),
        ...(['gece', 'aksam'].includes(M.evreSimdi(k)) && !k.magara ? [{ id: 'gozTara', etiket: `Fenerle göz parıltısı tara${Gc.gozKatalogu(k).length ? `: katalogda ${Gc.gozKatalogu(k).length} tür` : ''}`, ipucu: 'Gece fenerin ışığında parlayan gözlerin rengi, yüksekliği ve sayısından hayvanları tanırsın.', sec: yap(() => Gc.gozTara(d)) }] : []),
        altMenu('tohumlar', `Tohum ve fideler${Bo.yakinTohumlar(d).length ? `: yakında ${Bo.yakinTohumlar(d).length}` : ''}`, menu.ac, 'Hayvanların dışkısıyla taşınan tohumlar, filizlenen fideler ve fidanlar.'),
        ...(Bo.yakinKoloni(d) && !k.magara ? [{ id: 'koloniIncele', etiket: `Koloniyi incele: ${Bo.KOLONILER[Bo.yakinKoloni(d)].ad}`, sec: yap(() => Bo.koloniIncele(d, Bo.yakinKoloni(d))) }] : []),
        altMenu('koloniler', 'Böcek kolonileri: termitler, arılar, karıncalar', menu.ac),
        altMenu('numune', `Numune ve veteriner${k.numuneKutusu.length ? `: kutuda ${k.numuneKutusu.length} numune` : ''}`, menu.ac),
      ];
      if (G.kampVar(k))
        ogeler.push({
          id: 'kampKur',
          etiket: k.kamp ? `Saha kampını buraya taşı; şu an ${k.kamp.bolge}, ${yerTarifi(k.kamp)}` : 'Saha kampını buraya kur',
          sec: () => {
            const m = G.kampKur(d);
            if (m) Ses.hemen(m);
            else menu.kapat();
            return 'sessiz';
          },
        });
      const sahaVar = k.stok.tuzak || k.tuzaklar.length || k.stok.tasma || k.gpsli.length;
      if (sahaVar) ogeler.push(altMenu('saha', `Saha ekipmanı: ${k.tuzaklar.length} kamera tuzağı kurulu, ${k.gpsli.length} tasmalı hayvan`, menu.ac));
      return liste(u, 'Doğa', ogeler);
    }
    if (u === 'oyun') {
      return liste(u, 'Durum, ayarlar, yardım ve kayıt', [
        bilgi('durum', `Durum: ${M.durumOzeti(d)}`),
        altMenu('ayarlar', 'Ayarlar', menu.ac),
        altMenu('yardim', 'Nasıl oynanır', menu.ac),
        altMenu('yenilikler', 'Yenilikler: son eklenenler ve nerede bulunur', menu.ac),
        altMenu('deneme', 'Deneme araçları', menu.ac, 'Yeni özellikleri hızlıca denemek için bütçe, itibar ve ekipman kısayolları.'),
        {
          id: 'cik',
          etiket: 'Kaydet ve ana menüye dön',
          sec: () => {
            kaydet();
            cikis();
            return 'sessiz';
          },
        },
      ]);
    }
    if (u === 'yenilikler') {
      return liste(
        u,
        'Yenilikler',
        YENILIKLER.map((y, i) => bilgi('y' + i, `${y.baslik}. ${y.metin} Nerede: ${y.nerede}`)),
        'En yeniler üstte. Her satır özelliği ve oyunda nerede bulunduğunu söyler.'
      );
    }
    if (u === 'deneme') {
      return liste(
        u,
        'Deneme araçları',
        [
          { id: 'para', etiket: 'Bütçeye 20.000 lira ekle', sec: yap(() => ((k.butce += 20000), (k.denemeKullanildi = true), `Bütçe ${Mz.liraSozu(k.butce)}.`)) },
          { id: 'itibar', etiket: 'İtibarı 120 yap: bütün saha gezileri açılır', sec: yap(() => ((k.itibar = Math.max(k.itibar, 120)), (k.denemeKullanildi = true), `Bilimsel itibar ${k.itibar}. Bütün saha gezileri ve ekipmanların çoğu açıldı.`)) },
          {
            id: 'ekipman',
            etiket: 'Bütün ekipmanı ver',
            sec: yap(() => {
              Object.keys(Mz.EKIPMANLAR).forEach((id) => {
                if (Mz.EKIPMANLAR[id].adet) k.stok[id] = (k.stok[id] || 0) + 2;
                else k.ekipman[id] = true;
              });
              k.denemeKullanildi = true;
              return 'Bütün ekipman verildi: gece dürbünü, termal kamera, dron, tekne, kamp takımı, mağara takımı ve diğerleri; kamera tuzağı ve GPS tasmasından ikişer.';
            }),
          },
        ],
        'Bu kısayollar yalnızca yeni özellikleri hızlı denemek içindir. Zaman ileri alınamaz; savan yalnız oynarken yaşar.'
      );
    }
    if (u === 'cevre') {
      const l = M.gorunurler(d).slice(0, 20);
      const ogeler = l.map(({ b }) => ({ id: 'h' + b.id, etiket: M.gozlemTarifi(d, b), ipucu: 'Seçince bu hayvanı gözlemlersin.', sec: kapatVe(() => M.gozlemBaslat(d, b.id)) }));
      const kule = Mz.kuleTaramasi(d);
      if (kule) ogeler.unshift(bilgi('kule', kule));
      if (!ogeler.length) ogeler.push(bilgi('bos', `Dürbünle görebileceğin ${M.durbunMenzili(k.dk, k)} metre içinde hayvan yok. ${M.etrafiTara(d)}`));
      return liste(u, 'Görüş alanındaki hayvanlar', ogeler);
    }
    if (u === 'yerler' && M.oyuncuKutupta(k)) {
      const ogeler = [kutupDonSatiri()];
      Kt.KUTUP_YERLER.forEach((y) => {
        const p = Kt.yerKonumu(y);
        const suda = y.buz && Kt.sudaMi(p.x, p.y, k.dk);
        ogeler.push({ id: y.id, etiket: `${y.ad}, ${yerTarifi(p)}${suda ? ', şu an açık su' : ''}`, ipucu: y.tarif, sec: kapatVe(() => M.yerGit(d, y.id)) });
      });
      return liste(u, 'Yerler: Kuzey Kutbu', ogeler, 'Yürürsün. Açık suya giremezsin; deniz buzu yalnız donmuş mevsimlerde yürünür.');
    }
    if (u === 'yerler') {
      const ogeler = [];
      if (!k.aracta) ogeler.push({ id: 'arac', etiket: `${M.aracAdi(k)}, ${yerTarifi(k.arac)}`, sec: kapatVe(() => M.yerGit(d, 'arac')) });
      if (k.kamp) ogeler.push({ id: 'kamp', etiket: `Saha kampı, ${k.kamp.bolge}, ${yerTarifi(k.kamp)}`, sec: kapatVe(() => M.yerGit(d, 'kamp')) });
      if (H.ziyaretci(d) && !k.teknede) ogeler.push({ id: 'ziyaretci', etiket: `Ziyaretçi: ${H.ziyaretciTarifi(d)}`, ipucu: H.KISILER[H.ziyaretci(d).kim].unvan, sec: kapatVe(() => M.yerGit(d, 'ziyaretci')) });
      if (G.tekneVar(k) && !k.teknede) ogeler.push({ id: 'tekne', etiket: `Tekne, ${yerTarifi(k.tekne)}`, ipucu: 'Teknenin bağlı olduğu kıyıya yürürsün; yanına varınca iki parmakla yukarı kaydırıp binersin.', sec: kapatVe(() => M.yerGit(d, 'tekne')) });
      YERLER.forEach((y) => ogeler.push({ id: y.id, etiket: `${y.ad}, ${yerTarifi(y)}`, ipucu: y.tarif, sec: kapatVe(() => M.yerGit(d, y.id)) }));
      Mz.gpsListesi(d)
        .filter((b) => !b.olu && d.hayvanMap.has(b.id))
        .forEach((b) =>
          ogeler.push({
            id: 'g' + b.id,
            etiket: `GPS: ${Mz.gpsTarifi(d, b)}. Yanına git`,
            sec: kapatVe(() => {
              M.gozlemBaslat(d, b.id);
              M.yaklas(d);
            }),
          })
        );
      return liste(u, 'Yerler ve yolculuk', ogeler, k.aracta ? 'Araçla sürersin.' : 'Yürürsün. Uzak yerler için önce araca binebilirsin.');
    }
    if (u === 'alet') {
      return liste(
        u,
        'Alet seç',
        aletlerAl(k).map((a, i) => ({ id: a.id, etiket: `${a.ad}${i === aletRef.current ? ', elinde' : ''}`, ipucu: a.ipucu, sec: () => (aletSec(i), menu.geri(), 'sessiz') }))
      );
    }
    if (u === 'saha') {
      const ogeler = [
        {
          id: 'kur',
          etiket: `Buraya kamera tuzağı kur: ${k.stok.tuzak} stokta, ${k.tuzaklar.length} / ${Mz.tuzakKapasitesi(k)} kurulu`,
          sec: yap(() => Mz.tuzakKur(d)),
        },
        ...k.tuzaklar.map((t) => ({
          id: 't' + t.id,
          etiket: `Tuzak, ${t.bolge}: ${t.foto} fotoğraf, ${yerTarifi(t)}. Topla`,
          ipucu: 'Toplamak için 8 metre içinde olmalısın.',
          sec: yap(() => Mz.tuzakTopla(d, t.id)),
        })),
        {
          id: 'tasma',
          etiket: `GPS tasması tak${gb ? `: ${M.bireyAdi(gb)}` : ''}. ${k.stok.tasma} stokta`,
          ipucu: 'Gözlediğin tanımlı yetişkin hayvana veteriner takar.',
          sec: yap(() => Mz.tasmaTak(d)),
        },
        ...Mz.gpsListesi(d).map((b) => bilgi('g' + b.id, `GPS: ${Mz.gpsTarifi(d, b)}`)),
      ];
      return liste(u, 'Saha ekipmanı', ogeler);
    }
    // ----- Araştırma merkezi -----
    if (u === 'merkez') {
      const suren = Mz.ARASTIRMALAR.filter((a) => Mz.arastirmaDurumu(k, a).analiz).length;
      const hazir = Mz.ARASTIRMALAR.filter((a) => Mz.arastirmaDurumu(k, a).hazir).length;
      const ogeler = [
        bilgi('butce', `Bütçe ${Mz.liraSozu(k.butce)}. Günlük gider ${Mz.liraSozu(Mz.gunlukGider(k))}, günlük destek ${Mz.liraSozu(Mz.gunlukDestek(k))}. Bilimsel itibar ${k.itibar}.`),
        altMenu('mesajlar', `Mesajlar: ${Mz.okunmamis(k)} okunmamış, toplam ${k.mesajlar.length}`, menu.ac),
        altMenu('gorevler', `Görevler: ${k.teklifler.filter((t) => t.durum === 'kabul').length} süren, ${k.teklifler.filter((t) => t.durum === 'teklif').length} teklif`, menu.ac),
        altMenu('arastirmalar', `Araştırmalar: ${hazir} analize hazır, ${suren} analizde`, menu.ac),
        altMenu('yayinlar', `Yayınlar ve iş birlikleri: ${Ya.ozet(k)}`, menu.ac, 'Tamamlanan araştırmalardan makale yazıp dergilere gönderirsin; üniversite ve enstitülerle veri paylaşırsın.'),
        altMenu('ekipman', 'Ekipman', menu.ac),
        altMenu('garaj', `Garaj: sahada ${M.aracAdi(k)}`, menu.ac),
        altMenu('tesisler', `Tesisler: ${k.tesisler.length} / ${Object.keys(Mz.TESISLER).length} kurulu`, menu.ac),
        altMenu('personel', `Personel: ${k.personel.length} / ${Mz.personelKapasitesi(k)}`, menu.ac),
        altMenu('laboratuvar', `Laboratuvar: ${k.numuneler.filter((n) => n.durum === 'analiz').length} analizde, ${k.numuneler.filter((n) => n.durum === 'sira').length} sırada, ${k.numuneKutusu.length} kutunda`, menu.ac),
        altMenu('saglik', `Hayvan sağlığı ve salgın takibi${k.eko.salgin && k.eko.salgin.bilinen ? ': salgın var' : ''}`, menu.ac),
      ];
      if (Mz.tesisVar(k, 'rehab') || k.rehab.length) ogeler.push(altMenu('rehab', `Rehabilitasyon: ${k.rehab.length} hayvan`, menu.ac));
      ogeler.push(altMenu('yonetim', `Ekolojik yönetim: ${Object.keys((k.eko && k.eko.istilaci) || {}).length} lantanalı alan`, menu.ac));
      ogeler.push(altMenu('geziler', `Saha gezileri: ${K.uzakSatirlari(k).filter((x) => x.dur.acik).length} / ${K.uzakSatirlari(k).length} alan açık`, menu.ac));
      ogeler.push(altMenu('gizemler', `Gizemler: ${H.acikGizemSayisi(k)} çözülmemiş`, menu.ac));
      ogeler.push(altMenu('hedefler', `Büyük hedefler: ${Hd.HEDEFLER.filter((h) => Hd.hedefDurumu(k, h).bitti).length} / ${Hd.HEDEFLER.length} tamamlandı`, menu.ac, 'Uzun soluklu bilimsel ve koruma hedefleri.'));
      ogeler.push(altMenu('basarilar', `Bilimsel başarılar: ${Object.keys(H.hikayeAlani(k).basarilar).length} / ${H.BASARILAR.length}`, menu.ac));
      ogeler.push(altMenu('koruma', `Koruma projeleri: ${Object.values(k.koruma.projeler).filter((p) => p.durum === 'surer').length} süren, ${Object.values(k.koruma.projeler).filter((p) => p.durum === 'tamam').length} tamamlanan`, menu.ac));
      return liste(u, 'Araştırma merkezi', ogeler);
    }
    if (u === 'su') {
      const n = S.yakinNokta(d);
      const ogeler = [];
      if (n) {
        ogeler.push({ id: 'olc', etiket: `Suyu ölç: ${n.ad}`, ipucu: 'Sıcaklık, berraklık, akış, oksijen ve su düzeyi. Her nokta günde bir kez.', sec: yap(() => S.suOlc(d)) });
        ogeler.push({ id: 'gozle', etiket: 'Suda yaşayanları gözle', ipucu: 'Balık, kurbağa, su kuşu ve su böceklerinden birini arar.', sec: yap(() => S.suyuGozle(d)) });
        if (n.tip === 'gecit') ogeler.push({ id: 'gecis', etiket: 'Hayvan geçişlerini say', ipucu: 'Son bir günde geçitten karşıya geçen türleri izlerden sayar.', sec: yap(() => S.gecisSay(d)) });
      } else ogeler.push(bilgi('uzak', 'Bir ölçüm noktasında değilsin. Aşağıdaki noktalardan birine git; kıyıya 16 metre yaklaşınca ölçüm yapılır, teknedeyken daha uzaktan.'));
      ogeler.push(bilgi('rapor', S.suRaporu(k)));
      ogeler.push(altMenu('kirlilik', `Kirlilik kaynakları: ${Kr.kirlilikOzeti(k)}`, menu.ac));
      S.noktaSatirlari(d).forEach(({ n: p, konum, metin }) => {
        ogeler.push(bilgi('n' + p.id, `${metin}. ${M.BuyukHarf(yerTarifi(konum))}`, p.tarif));
        if (!k.teknede && !k.magara)
          ogeler.push({
            id: 'git' + p.id,
            etiket: `${p.ad}: oraya ${k.aracta ? 'sür' : 'yürü'}`,
            sec: kapatVe(() => {
              const yan = p.tip === 'golet' || p.tip === 'sulak' ? 0 : 7; // nehirde kıyıya, kuzey yakasına
              d.rota = { x: konum.x, y: konum.y + yan, ad: p.ad, yakin: p.tip === 'golet' ? 14 : 5 };
              d.yaklasId = null;
              M.olay(d, 'rota', `${p.ad} yönüne gidiyorsun. ${M.BuyukHarf(yerTarifi(konum))}.`, 3);
            }),
          });
      });
      return liste(u, 'Su araştırması', ogeler, 'Nehrin farklı habitatları, gölet ve sulak alan. Dalış yok; ölçümler kıyıdan ya da tekneden yapılır.');
    }
    if (u === 'kirlilik') {
      const l = Kr.kirlilikSatirlari(d);
      const ogeler = [];
      l.forEach(({ s, metin, tarif }, i) => {
        ogeler.push(bilgi('k' + i, metin, tarif));
        if (!k.teknede && !k.magara)
          ogeler.push({
            id: 'kgit' + i,
            etiket: `Oraya ${k.aracta ? 'sür' : 'yürü'}`,
            sec: kapatVe(() => {
              d.rota = { x: s.x, y: s.golet ? s.y : s.y + 7, ad: 'kirlilik kaynağı', yakin: s.golet ? 16 : 6 };
              d.yaklasId = null;
              M.olay(d, 'rota', `Kirlilik kaynağına gidiyorsun. ${M.BuyukHarf(yerTarifi(s))}.`, 3);
            }),
          });
      });
      if (!l.length) ogeler.push(bilgi('yok', Kr.kirlilikOzeti(k)));
      return liste(u, 'Kirlilik kaynakları', ogeler, 'Suda çürüyen leşler, kurak mevsimde su aygırı dışkısı ve yangın külü suyu kirletir. Su ölçümü ve su numunesi kaynağın etkisini gösterir; su zamanla kendini temizler.');
    }
    if (u === 'gizemler') {
      const l = H.gizemSatirlari(k);
      return liste(u, 'Gizemler', l.length ? l.map((g) => bilgi('g' + g.id, g.metin)) : [bilgi('yok', 'Henüz bir gizem yok. Sahada geçirdiğin günler, gözlemlerin ve karşılaştığın insanlar yeni gizemler ortaya çıkarır.')], 'Çözülmemiş gizemler üstte; her satır sıradaki adımı söyler.');
    }
    if (u === 'basarilar') {
      const { kazanilan, kalan } = H.basariSatirlari(k);
      const ogeler = [...kalan.map((x) => bilgi('b' + x.b.id, x.metin)), ...kazanilan.map((x) => bilgi('k' + x.b.id, x.metin))];
      return liste(u, 'Bilimsel başarılar', ogeler, 'Başarılar itibarın yanında fon, ekipman, personel bursu ve yeni araştırma imkânı getirir. Kazanılmamışlar üstte, ilerlemesiyle.');
    }
    if (u === 'mesajlar' || u.startsWith('mesajlar~')) {
      const tum = k.mesajlar.map((m) => {
        const t = m.teklifId ? k.teklifler.find((x) => x.id === m.teklifId && x.durum === 'teklif') : null;
        return {
          id: 'm' + m.id,
          etiket: `${m.okundu ? '' : 'Yeni. '}${zamanKisa(m.dk)}: ${m.metin}`,
          ipucu: t ? 'Seçince teklifi kabul edersin.' : undefined,
          sec: () => {
            m.okundu = true;
            if (t) Ses.hemen(Mz.teklifKabul(k, t.id));
            else Ses.hemen(m.metin);
            return 'sessiz';
          },
        };
      });
      k.mesajlar.forEach((m) => (m.okundu = true));
      const s = sayfali('mesajlar', tum, menu, 10);
      if (s.sayfa) return liste(s.sayfa.anahtar, s.sayfa.baslik, s.sayfa.ogeler);
      return liste(u, 'Mesajlar', s.ogeler.length ? s.ogeler : [bilgi('bos', 'Mesaj yok.')]);
    }
    if (u === 'gorevler') {
      const ogeler = [];
      k.teklifler
        .filter((t) => t.durum === 'kabul')
        .forEach((t) => ogeler.push(bilgi('k' + t.id, `Süren görev. ${Mz.teklifMetni(k, t)}`)));
      k.teklifler
        .filter((t) => t.durum === 'teklif')
        .forEach((t) => ogeler.push(altMenu('teklif-' + t.id, `Teklif. ${Mz.teklifMetni(k, t)}`, menu.ac, 'Kabul etmek ya da geri çevirmek için seç.')));
      if (!ogeler.length) ogeler.push(bilgi('bos', 'Şu an görev ya da teklif yok. Her gün yeni teklif gelir.'));
      return liste(u, 'Görevler', ogeler, 'Aynı anda en çok 3 görev yürütebilirsin.');
    }
    if (u.startsWith('teklif-')) {
      const t = k.teklifler.find((x) => 'teklif-' + x.id === u);
      if (!t) return liste(u, 'Teklif', [bilgi('yok', 'Bu teklif artık geçerli değil.')]);
      return liste(u, t.kurum, [
        bilgi('t', Mz.teklifMetni(k, t)),
        { id: 'kabul', etiket: 'Kabul et', sec: () => (Ses.hemen(Mz.teklifKabul(k, t.id)), menu.geri(), yenile((x) => x + 1), 'sessiz') },
        { id: 'red', etiket: 'Geri çevir', sec: () => (Ses.hemen(Mz.teklifReddet(k, t.id)), menu.geri(), yenile((x) => x + 1), 'sessiz') },
      ]);
    }
    if (u === 'arastirmalar') {
      const ogeler = Mz.ARASTIRMALAR.map((a) => {
        const dur = Mz.arastirmaDurumu(k, a);
        return { id: a.id, etiket: dur.metin, sec: dur.hazir ? yap(() => Mz.analizBaslat(k, a.id)) : undefined };
      });
      return liste(u, 'Araştırmalar', ogeler, `Laboratuvarda aynı anda ${Mz.analizKapasitesi(k)} analiz yapılabilir.`);
    }
    if (u === 'ekipman') {
      const ogeler = Object.keys(Mz.EKIPMANLAR).map((id) => {
        const dur = Mz.ekipmanDurumu(k, id);
        return { id, etiket: dur.metin, ipucu: Mz.EKIPMANLAR[id].tarif, sec: dur.sahip ? undefined : yap(() => Mz.ekipmanAl(k, id)) };
      });
      return liste(u, 'Ekipman', ogeler, `Bütçe ${Mz.liraSozu(k.butce)}.`);
    }
    if (u === 'garaj') {
      const ogeler = G.garajSatirlari(d).map((x) => ({
        id: x.tur,
        etiket: x.metin,
        ipucu: x.tarif,
        sec: x.sahip && !x.secili ? yap(() => G.aracDegistir(d, x.tur)) : undefined,
      }));
      return liste(u, 'Garaj', ogeler, 'Sahada tek araç durur. Araç ancak istasyondayken, araç da garajın yakınındayken değiştirilir. Yakıt sınırsız, bakım gerekmez.');
    }
    if (u === 'tesisler') {
      const ogeler = Object.keys(Mz.TESISLER).map((id) => {
        const dur = Mz.tesisDurumu(k, id);
        return { id, etiket: dur.metin, ipucu: Mz.TESISLER[id].tarif, sec: dur.sahip ? undefined : yap(() => Mz.tesisKur(k, id)) };
      });
      return liste(u, 'Tesisler', [bilgi('var', 'İstasyonda temel laboratuvar, garaj ve çadır var.'), ...ogeler], `Bütçe ${Mz.liraSozu(k.butce)}.`);
    }
    if (u === 'personel') {
      const ogeler = Object.keys(Mz.PERSONEL).map((rol) => {
        const dur = Mz.personelDurumu(k, rol);
        return { id: rol, etiket: dur.metin, ipucu: Mz.PERSONEL[rol].tarif, sec: dur.kilit ? undefined : yap(() => Mz.personelIslem(k, rol, d.rng)) };
      });
      return liste(u, 'Personel', ogeler, `Kapasite ${k.personel.length} / ${Mz.personelKapasitesi(k)}. Personel sahada görünmez, işini merkezden yapar.`);
    }
    // ----- Arşiv -----
    if (u === 'arsiv') {
      const a = k.arsiv;
      return liste(u, 'Arşiv', [
        altMenu('turler', `Ansiklopedi: ${Object.keys(a.turler).length} / ${M.turListesi(k).length} tür`, menu.ac),
        altMenu('bireyler', `Tanımlanan bireyler: ${M.taninanBireyler(k).length}`, menu.ac),
        altMenu('fotolar', `Fotoğraflar: ${a.fotolar.length}`, menu.ac),
        altMenu('sesler', `Ses kayıtları: ${a.sesler.length}`, menu.ac),
        altMenu('videolar', `Videolar: ${(a.videolar || []).length}`, menu.ac),
        altMenu('bitkiArsiv', `Bitkiler: ${Object.keys(a.bitkiler || {}).length} / ${E.BITKI_SIRASI.length}`, menu.ac),
        altMenu('kucukler', `Küçük canlılar: ${K.kucukSayisi(k)} / ${KUCUK_SIRASI.length} tür`, menu.ac),
        altMenu('gunluk', `Günlük: ${a.olaylar.length} kayıt`, menu.ac),
      ]);
    }
    if (u === 'turler') {
      const bilinen = M.turListesi(k).filter((x) => x.kayit);
      const ogeler = bilinen.map(({ tur, t, kayit }) =>
        altMenu('tur-' + tur, `${t.ad}: ${kayit.davranislar.length} davranış, ${M.taninanBireyler(k, tur).length} birey${kayit.sesKaydi ? ', sesi kayıtlı' : ''}`, menu.ac)
      );
      const kalan = M.turListesi(k).length - bilinen.length;
      if (kalan) ogeler.push(bilgi('kalan', `Henüz keşfedilmemiş ${kalan} tür var.`));
      return liste(u, 'Ansiklopedi', ogeler);
    }
    if (u.startsWith('tur-')) {
      const tur = u.slice(4);
      const t = TURLER[tur];
      const kayit = k.arsiv.turler[tur];
      const ogeler = [bilgi('ad', `${t.ad}, bilimsel adı ${t.bilimsel}, ${kucuk(t.sinif)}. ${Y.iucnSozu(tur)}.`), bilgi('tarif', t.tarif)];
      if (kayit) {
        ogeler.push(
          bilgi('ilk', `İlk keşif ${zamanKisa(kayit.ilkDk)}, ${kayit.ilkBolge}. Toplam gözlem ${Math.max(1, Math.round(kayit.gozlemSn / 60))} dakika. ${kayit.sesKaydi ? 'Sesi kayıtlı.' : 'Henüz ses kaydı yok.'} ${k.arsiv.fotolar.filter((f) => f.tur === tur).length} fotoğraf.`)
        );
        ogeler.push(bilgi('dv', kayit.davranislar.length ? `Kaydedilen davranışlar: ${kayit.davranislar.map((x) => kucuk(M.davranisAdi(x)) + (DAVRANISLAR[x] && DAVRANISLAR[x].nadir ? ' (nadir)' : '')).join(', ')}.` : 'Henüz davranış kaydı yok.'));
      }
      if (kayit) {
        G.genetikSatirlari(d, tur).forEach((m, i) => ogeler.push(bilgi('gen' + i, m)));
        Sy.turSatirlari(d, tur).forEach((m, i) => ogeler.push(bilgi('sy' + i, m)));
        Il.turSatirlari(d, tur).forEach((m, i) => ogeler.push(bilgi('il' + i, m)));
        if (Ik.UYKU_NOTU[tur]) ogeler.push(bilgi('uyku', `Uyku: ${Ik.UYKU_NOTU[tur]}`));
        if (!k.koruma.genRapor && M.taninanBireyler(k, tur).filter((b) => b.dna).length >= G.GENETIK_ESIK) k.koruma.genRapor = true;
      }
      M.taninanBireyler(k, tur).forEach((b) => ogeler.push(altMenu('birey-' + b.id, `${M.bireyAdi(b)}, ${b.cinsiyet === 'erkek' ? 'erkek' : 'dişi'} ${EVRELER[b.evre]}`, menu.ac)));
      return liste(u, t.ad, ogeler);
    }
    if (u === 'bireyler' || u.startsWith('bireyler~')) {
      const tum = M.taninanBireyler(k).map((b) => {
        const ab = k.arsiv.bireyler[b.id];
        return altMenu('birey-' + b.id, `${M.bireyAdi(b)}, ${M.kod(b)}${ab && ab.olum ? ', öldü' : ab ? `, son görülme ${zamanKisa(ab.sonDk)}` : ''}${k.gpsli.includes(b.id) ? ', GPS tasmalı' : ''}`, menu.ac);
      });
      const s = sayfali('bireyler', tum, menu);
      if (s.sayfa) return liste(s.sayfa.anahtar, s.sayfa.baslik, s.sayfa.ogeler);
      return liste(u, 'Tanımlanan bireyler', s.ogeler.length ? s.ogeler : [bilgi('bos', 'Henüz tanımlanmış birey yok. Bir hayvanı dürbünle birkaç saniye izle.')]);
    }
    if (u.startsWith('aile-')) {
      const b = M.kayitliBirey(d, Number(u.slice(5)));
      if (!b) return liste(u, 'Aile ağacı', [bilgi('yok', 'Kayıt bulunamadı.')]);
      const ogeler = G.aileSatirlari(d, b).map((x, i) => (x.bireyId && x.bireyId !== b.id ? altMenu('birey-' + x.bireyId, x.metin, menu.ac) : bilgi('a' + i, x.metin)));
      return liste(u, `${M.BuyukHarf(M.bireyAdi(b))}: aile ağacı`, ogeler);
    }
    if (u.startsWith('birey-')) {
      const b = M.kayitliBirey(d, Number(u.slice(6)));
      if (!b) return liste(u, 'Birey', [bilgi('yok', 'Bu bireyin kaydı bulunamadı.')]);
      const ab = k.arsiv.bireyler[b.id] || {};
      const ogeler = [
        bilgi('kunye', M.bireyKunye(d, b)),
        bilgi(
          'gozlem',
          `İlk tanımlama ${ab.ilkDk !== undefined ? zamanKisa(ab.ilkDk) : 'bilinmiyor'}. Son görülme ${ab.sonDk !== undefined ? `${zamanKisa(ab.sonDk)}, ${ab.sonBolge}` : 'bilinmiyor'}. Toplam gözlem ${Math.max(1, Math.round((ab.gozlemSn || 0) / 60))} dakika. Sana alışması ${b.alisma > 0.6 ? 'yüksek' : b.alisma > 0.25 ? 'orta' : 'düşük'}.`
        ),
      ];
      ogeler.push(bilgi('gorunus', M.gorunusSatiri(d, b)));
      Sy.bireySatirlari(d, b).forEach((m, i) => ogeler.push(bilgi('sy' + i, m)));
      Ur.bireySatirlari(d, b).forEach((m, i) => ogeler.push(bilgi('ur' + i, m)));
      Bg.bireySatirlari(d, b).forEach((m, i) => ogeler.push(bilgi('bg' + i, m)));
      const rm = !b.olu && M.rutinMetni(d, k.gruplar.find((g) => g.id === b.grup));
      if (rm) ogeler.push(bilgi('rutin', rm));
      if (b.ozellik && OZEL_BIREYLER[b.ozellik] && M.taninmisMi(b)) ogeler.push(bilgi('ozel', `Özel birey: ${OZEL_BIREYLER[b.ozellik].ad}. ${OZEL_BIREYLER[b.ozellik].tarif}`));
      ogeler.push(bilgi('saglik', `Sağlık dosyası. ${Sy.saglikDosyasi(d, b).join(' ')}`));
      if (k.gpsli.includes(b.id)) ogeler.push(bilgi('gps', `GPS: ${Mz.gpsTarifi(d, b)}.`));
      if (ab.olum) ogeler.push(bilgi('olum', `Ölüm kaydı: ${ab.olum}.`));
      if (b.gecmis && b.gecmis.length) ogeler.push(bilgi('gecmis', `Yaşam kaydı: ${b.gecmis.map((x) => `${zamanKisa(x.dk)}, ${x.metin}`).join('. ')}.`));
      // Aile ağacı ve genetik (Aşama 8, karar 39 ve 83)
      ogeler.push(altMenu('aile-' + b.id, 'Aile ağacı: anne, baba, kardeşler, yavrular', menu.ac));
      ogeler.push(bilgi('dna', b.dna ? `Genetik: çeşitlilik ${G.cesitlilikSozu(b.gen.h)}${b.gen.tasiyici ? ', kalıtsal zayıflık geni taşıyor' : ', bilinen kalıtsal hastalık geni yok'}${b.kalitsal ? ', kendisi kalıtsal zayıflık taşıyor' : ''}.` : 'Genetik: DNA profili yok. Dışkı numunesi alıp laboratuvarda inceletirsen genetik profili ve babası ortaya çıkar.'));
      const aileSet = new Set([b.anne, b.baba, ...k.hayvanlar.filter((x) => x.anne === b.id).map((x) => x.id)]);
      k.hayvanlar
        .filter((x) => x.grup === b.grup && x.id !== b.id && M.taninmisMi(x) && !x.olu && !aileSet.has(x.id))
        .forEach((x) => ogeler.push(altMenu('birey-' + x.id, `Grup arkadaşı: ${M.bireyAdi(x)}`, menu.ac)));
      const fotolar = k.arsiv.fotolar.filter((f) => f.bireyId === b.id);
      if (fotolar.length) ogeler.push(bilgi('foto', `${fotolar.length} fotoğraf: ${fotolar.slice(0, 5).map((f) => `${kucuk(M.davranisAdi(f.davranis))}, ${f.kalite}`).join('; ')}.`));
      ogeler.push(altMenu('tur-' + b.tur, `Tür kaydı: ${TURLER[b.tur].ad}`, menu.ac));
      return liste(u, M.bireyAdi(b), ogeler);
    }
    if (u === 'fotolar' || u.startsWith('fotolar~')) {
      const tum = k.arsiv.fotolar.map((f) => {
        if (f.kucuk) return bilgi('f' + f.id, `${KUCUKLER[f.kucuk] ? KUCUKLER[f.kucuk].ad : 'Küçük canlı'}, yakın çekim, kalite ${f.kalite}. ${f.bolge}, ${zamanKisa(f.dk)}`);
        const b = M.birey(d, f.bireyId);
        const ad = b && M.taninmisMi(b) ? M.bireyAdi(b) : M.SOZ[f.tur];
        return bilgi('f' + f.id, `${ad}, ${kucuk(M.davranisAdi(f.davranis))}, kalite ${f.kalite}${f.kaynak === 'tuzak' ? ', kamera tuzağı' : ''}. ${f.bolge}, ${zamanKisa(f.dk)}`);
      });
      const s = sayfali('fotolar', tum, menu, 10);
      if (s.sayfa) return liste(s.sayfa.anahtar, s.sayfa.baslik, s.sayfa.ogeler);
      return liste(u, 'Fotoğraflar', s.ogeler.length ? s.ogeler : [bilgi('bos', 'Henüz fotoğraf yok.')]);
    }
    if (u === 'sesler' || u.startsWith('sesler~')) {
      const tum = k.arsiv.sesler.map((x) => bilgi('s' + x.id, `${M.SOZ[x.tur]}, ${M.sesTuruAdi(x.sesTuru)}, saat ${x.saat} yönünden yaklaşık ${x.m} metre. ${x.bolge}, ${zamanKisa(x.dk)}`));
      const s = sayfali('sesler', tum, menu, 10);
      if (s.sayfa) return liste(s.sayfa.anahtar, s.sayfa.baslik, s.sayfa.ogeler);
      return liste(u, 'Ses kayıtları', s.ogeler.length ? s.ogeler : [bilgi('bos', 'Henüz ses kaydı yok.')]);
    }
    if (u === 'gunluk' || u.startsWith('gunluk~')) {
      const tum = k.arsiv.olaylar.map((o, i) => bilgi('o' + i, `${zamanKisa(o.dk)}, ${o.bolge}: ${o.metin}`));
      const s = sayfali('gunluk', tum, menu, 10);
      if (s.sayfa) return liste(s.sayfa.anahtar, s.sayfa.baslik, s.sayfa.ogeler);
      return liste(u, 'Günlük', s.ogeler.length ? s.ogeler : [bilgi('bos', 'Günlükte henüz kayıt yok. Nadir davranışlar, doğumlar ve avlanmalar burada saklanır.')]);
    }
    // ----- Ekosistem (Aşama 5) -----
    if (u === 'ekosistem') {
      const e = k.eko;
      const gun = M.gunNo(k.dk);
      const tk = E.takvim(gun);
      const sonraki = tk.mevsim === 'yagisli' ? 'kurak mevsim' : 'yağışlı mevsim';
      const ogeler = [
        altMenu('iklimKaydi', 'İklim kaydı: yıllık yağış ve sıcaklık, uzun vadeli eğilim', menu.ac),
        bilgi('takvim', `${gun}. gün, ${tk.yil}. araştırma yılı. ${M.BuyukHarf(E.MEVSIM_ADI[tk.mevsim])}, ${tk.mevsimGunu}. gün. ${sonraki} ${tk.kalan + 1} gün sonra başlar.${tk.mevsim === 'yagisli' && e.yil && e.yil.gecikme && tk.mevsimGunu <= e.yil.gecikme ? ' Bu yıl yağmurlar gecikti.' : ''}`),
        bilgi('hava', `${e.yagmurVar ? (e.siddet > 0.8 ? 'Şu an sağanak yağıyor. ' : 'Şu an yağmur yağıyor. ') : ''}${E.havaTahmini(e, k.dk % 1440)} Bu mevsim toplam yağış yaklaşık ${Math.round(e.yagisMevsim)} milimetre.`),
        bilgi('su', `Gölet ${E.goletSozu(e)}${E.goletKurudu(e) ? '' : `, suyu ${E.kaliteSozu(E.suKalitesi(e))}`}. Nehir ${E.nehirSozu(e.nehir)}. ${Kr.kirlilikOzeti(k)}`),
        bilgi(
          'ot',
          `Otlar ${e.yesil > 0.65 ? 'yemyeşil' : e.yesil > 0.4 ? 'yeşil ama solmaya başlamış' : e.yesil > 0.25 ? 'sararıyor' : 'kurumuş, sarı'}. Doğu otlaklarında ot ${E.otSozu(E.ortalamaOt(e, 92, 2, 42))}, batıda ${E.otSozu(E.ortalamaOt(e, -62, -8, 40))}, sulak alanda ${E.otSozu(E.ortalamaOt(e, -20, -140, 40))}, akasya ağaçlığında ağaç yaprağı ${E.otSozu(e.yaprak.reduce((a, b) => a + b, 0) / Math.max(1, e.yaprak.filter((x) => x > 0).length))}.`
        ),
      ];
      const gocte = k.disari.gruplar.map((g) => `${M.SOZ[g.tur]} sürüsü göçte, ${Math.max(1, Math.round((k.dk - (g.goc.cikisDk || k.dk)) / 1440))} gündür`);
      const yolda = k.gruplar.filter((g) => g.goc).map((g) => `${M.SOZ[g.tur]} sürüsü ${g.goc.durum === 'gidiyor' ? 'göç yolunda, alandan çıkmak üzere' : 'göçten dönüyor'}`);
      ogeler.push(bilgi('goc', gocte.length || yolda.length ? `Göç: ${[...yolda, ...gocte].join('. ')}.` : `Göç: şu an göçte sürü yok.${e.gocler.length ? ` Son kayıt: ${e.gocler[0].gun}. gün, ${kucuk(M.SOZ[e.gocler[0].tur])} sürüsü ${e.gocler[0].olay === 'cikis' ? 'göçe çıktı' : 'göçten döndü'}.` : ''}`));
      const sal = e.salgin && e.salgin.bilinen ? `Salgın: ${E.HASTALIKLAR[e.salgin.hastalik].ad}, ${gun - e.salgin.basGun + 1}. gün, ${e.salgin.vaka} vaka.` : 'Bilinen bir salgın yok.';
      ogeler.push(bilgi('salgin', sal));
      const yanan = E.yananHucreler(e).length;
      ogeler.push(bilgi('yangin', yanan ? `${E.yanginSoz(e)} ${(() => { const y = M.yanginYakin(d); return y ? `En yakın alevler ${yerTarifi(y)}.` : ''; })()} Rüzgâr ${M.pusulaYonu(e.hava.ruzgarYon)} yönünden esiyor.` : `Yangın yok.${e.yanginlar ? ` Bu araştırmada ${e.yanginlar} yangın çıktı.` : ''}`));
      if (yanan) ogeler.push({ id: 'sondur', etiket: 'Yangın söndürme ekibi çağır, 3.000 lira', ipucu: 'Doğal yangınlar savanın parçasıdır; istasyon ya da nadir türler tehlikedeyse çağır.', sec: yap(() => Mz.yanginSondur(d)) });
      if (e.taskin) ogeler.push(bilgi('sel', 'Nehir taşkın: geçitler sular altında, karşı kıyıya geçilemiyor.'));
      ogeler.push(bilgi('kacak', `Kaçak avcılık: ${k.kacak.bulunan} tel tuzak söküldü, ${k.kacak.kurtarilan} hayvan kurtarıldı, ${k.kacak.olen} hayvan tuzakta öldü.${k.koruma.devriye ? ' Koruma devriyesi görevde.' : ''}`));
      // Keşfedilen türlerin bölgedeki tahmini sayısı (istasyonun kayıtlarından)
      const sayilar = TUR_SIRASI.filter((t) => k.arsiv.turler[t]).map((t) => `${kucuk(M.SOZ[t])} ${k.hayvanlar.filter((b) => !b.olu && b.tur === t).length}`);
      if (sayilar.length) ogeler.push(bilgi('nufus', `Bölgedeki tahmini sayılar: ${sayilar.join(', ')}.`));
      G.hakimiyetSatirlari(d).forEach((m, i) => ogeler.push(bilgi('hak' + i, m)));
      return liste(u, 'Ekosistem raporu', ogeler);
    }
    if (u === 'bitkiler') {
      const ids = Mz.cevredekiBitkiler(d);
      const ogeler = [];
      ids.forEach((id) => {
        ogeler.push({ id: 'i' + id, etiket: Mz.bitkiSatiri(d, id), ipucu: 'Seçince bitkiyi inceler, şu anki evresini kaydedersin.', sec: yap(() => Mz.bitkiIncele(d, id)) });
        if (k.arsiv.bitkiler && k.arsiv.bitkiler[id]) {
          const ev = E.bitkiEvresi(id, M.gunNo(k.dk), k.eko);
          ogeler.push({ id: 'n' + id, etiket: `${E.BITKILER[id].ad}: ${ev.tohum ? E.BITKILER[id].tohumAdi || 'tohum' : 'yaprak'} numunesi al`, sec: yap(() => Mz.bitkiNumunesi(d, id)) });
        }
      });
      if (!ogeler.length) ogeler.push(bilgi('bos', 'Burada incelenecek belirgin bir bitki yok.'));
      return liste(u, 'Çevredeki bitkiler', ogeler, `${M.bolgeAdi(d.oyuncu.x, d.oyuncu.y)}.`);
    }
    if (u === 'numune') {
      const su = Mz.yakinSu(d);
      const les = Mz.yakinLes(d, 14);
      const ogeler = [
        bilgi('kutu', `Numune kutusu: ${k.numuneKutusu.length} / ${Mz.NUMUNE_KUTUSU}. ${k.numuneKutusu.length ? 'İstasyona dönünce laboratuvara teslim edilir.' : ''}`),
        { id: 'su', etiket: su ? `Su numunesi al: ${su.ad}` : 'Su numunesi al: yakında su yok', sec: yap(() => Mz.suNumunesi(d)) },
        { id: 'diski', etiket: `Dışkı numunesi al${gb ? `: ${M.bireyAdi(gb)}` : ''}`, ipucu: 'Gözlediğin tanımlı hayvanın bıraktığı dışkıdan; hayvana dokunulmaz.', sec: yap(() => Mz.diskiNumunesi(d)) },
        { id: 'kil', etiket: `Kıl ya da tüy numunesi al${gb ? `: ${M.bireyAdi(gb)}` : ''}`, ipucu: 'Gözlediğin tanımlı hayvanın sürtündüğü ağaçtan, tüneğinden ya da güneşlendiği yerden; DNA, stres hormonu ve deri asalakları için.', sec: yap(() => Mz.kilNumunesi(d)) },
        { id: 'toprak', etiket: 'Toprak numunesi al', ipucu: 'Bulunduğun bölgenin toprağı: nem, besin, kül, tuz. Her bölgeden günde bir.', sec: yap(() => Mz.toprakNumunesi(d)) },
        { id: 'les', etiket: les ? `Leşten numune al: ölü ${kucuk(M.SOZ[les.tur])}, ${yerTarifi(les)}` : 'Leşten numune al: yakında leş yok', sec: yap(() => Mz.lesNumunesi(d)) },
        { id: 'vet', etiket: `Veteriner müdahalesi${gb ? `: ${M.bireyAdi(gb)}${M.saglikGorunusu(gb)}` : ''}`, ipucu: 'Yaralı ya da hasta görünen gözlediğin hayvanı veteriner tedavi eder.', sec: yap(() => Mz.veterinerMudahale(d)) },
      ];
      if (les && (les.teshis === 'sarbon' || (k.eko.salgin && k.eko.salgin.bilinen))) ogeler.push({ id: 'yak', etiket: 'Şarbonlu leşi yaktır', sec: yap(() => Mz.lesiYak(d)) });
      if (Mz.tesisVar(k, 'rehab')) ogeler.push({ id: 'rehab', etiket: `Rehabilitasyona al${gb ? `: ${M.bireyAdi(gb)}` : ''}`, ipucu: 'Ağır yaralı, ağır hasta ya da yetim yavrular için.', sec: yap(() => Mz.rehabaAl(d)) });
      const takili = k.kacak.tuzaklar.find((t) => t.hayvanId && t.bulundu && M.mesafe(d.oyuncu, t) < 40);
      if (takili) ogeler.splice(1, 0, { id: 'kurtar', etiket: 'Tel tuzağa takılmış hayvanı kurtar', sec: yap(() => K.tuzaktanKurtar(d)) });
      return liste(u, 'Numune ve veteriner', ogeler);
    }
    if (u === 'laboratuvar' || u.startsWith('laboratuvar~')) {
      const tum = [...k.numuneKutusu, ...k.numuneler].map((n) => bilgi('n' + n.id, Mz.numuneMetni(k, n)));
      const s = sayfali('laboratuvar', tum, menu, 10);
      if (s.sayfa) return liste(s.sayfa.anahtar, s.sayfa.baslik, s.sayfa.ogeler);
      return liste(u, 'Laboratuvar', s.ogeler.length ? s.ogeler : [bilgi('bos', 'Henüz numune yok. Menüde Doğa, Numune ve veteriner bölümünden numune alabilirsin.')], `Aynı anda ${Mz.numuneKapasitesi(k)} numune analiz edilir.`);
    }
    if (u === 'saglik') {
      const e = k.eko;
      const ogeler = [];
      if (e.salgin && e.salgin.bilinen) ogeler.push(bilgi('s', `Salgın: ${E.HASTALIKLAR[e.salgin.hastalik].ad}, ${e.salgin.vaka} vaka. ${E.HASTALIKLAR[e.salgin.hastalik].tarif}`));
      const hastalar = M.taninanBireyler(k).filter((b) => !b.olu && b.hastalik && (b.hastalik.goruldu || b.teshis));
      hastalar.forEach((b) =>
        ogeler.push(altMenu('birey-' + b.id, `${M.bireyAdi(b)}: ${b.teshis ? E.HASTALIKLAR[b.hastalik.id].ad : E.HASTALIKLAR[b.hastalik.id].belirti}${b.hastalik.tedavi ? ', tedavi edildi' : ''}`, menu.ac))
      );
      if (!hastalar.length) ogeler.push(bilgi('yok', 'Hastalığı bilinen tanımlı birey yok. Gözlemde belirti görürsen burada listelenir.'));
      ogeler.push(bilgi('teshis', e.teshisler.length ? `Son teşhisler: ${e.teshisler.slice(0, 6).map((t) => `${t.gun}. gün, ${t.tur ? kucuk(M.SOZ[t.tur]) : 'su'}, ${E.HASTALIKLAR[t.hastalik].ad}`).join('; ')}.` : 'Henüz teşhis yok.'));
      Object.entries(E.HASTALIKLAR).forEach(([id, h]) => ogeler.push(bilgi('h' + id, `${M.BuyukHarf(h.ad)}: ${h.tarif} Belirti: ${h.belirti}.`)));
      return liste(u, 'Hayvan sağlığı', ogeler);
    }
    if (u === 'rehab') {
      const ogeler = k.rehab.map((r) => ({ id: 'r' + r.b.id, etiket: Mz.rehabMetni(k, r), sec: r.hazir ? yap(() => Mz.rehabBirak(d, r.b.id)) : undefined }));
      if (!ogeler.length) ogeler.push(bilgi('bos', 'Rehabilitasyonda hayvan yok.'));
      return liste(u, 'Rehabilitasyon', ogeler, 'Aşamalar: karantina, tedavi, beslenme ve iyileşme, doğaya uyum.');
    }
    if (u === 'bitkiArsiv') {
      const ogeler = E.BITKI_SIRASI.filter((id) => (k.arsiv.bitkiler || {})[id]).map((id) => altMenu('bitki-' + id, `${E.BITKILER[id].ad}: ${k.arsiv.bitkiler[id].evreler.length} evre${k.arsiv.bitkiler[id].analiz ? ', analiz edildi' : ''}`, menu.ac));
      const kalan = E.BITKI_SIRASI.length - ogeler.length;
      if (kalan) ogeler.push(bilgi('kalan', `Henüz incelenmemiş ${kalan} bitki türü var. Farklı bölgelerde Çevredeki bitkiler bölümüne bak.`));
      return liste(u, 'Bitkiler', ogeler);
    }
    if (u.startsWith('bitki-')) {
      const id = u.slice(6);
      const b = E.BITKILER[id];
      const a = (k.arsiv.bitkiler || {})[id] || { evreler: [] };
      const evAdi = b.kutup ? E.KUTUP_EVRE_ADI : { yE: 'yağışlı mevsimin başı', yG: 'yağışlı mevsimin sonu', kE: 'kurak mevsimin başı', kG: 'kurak mevsimin sonu' };
      const ogeler = [
        bilgi('ad', `${b.ad}, bilimsel adı ${b.bilimsel}, ${b.bicim}. ${b.tarif}`),
        bilgi('ev', `Gözlenen evreler: ${a.evreler.map((e) => `${evAdi[e]}: ${b.evre[['yE', 'yG', 'kE', 'kG'].indexOf(e)]}`).join('; ') || 'yok'}.`),
        bilgi('an', a.analiz ? `Laboratuvar: ${b.analiz}` : 'Henüz laboratuvarda incelenmedi; yaprak ya da tohum numunesi al.'),
      ];
      Bo.bitkiSatirlari(k, id).forEach((m, i) => ogeler.push(bilgi('bo' + i, m)));
      return liste(u, b.ad, ogeler);
    }
    // ----- Mağara, küçük canlılar, koruma (Aşama 6) -----
    if (u === 'magara' && k.magara && k.magara.alan) {
      const l = odaListesi(k.magara.alan);
      const i = k.magara.oda;
      const a = UZAK_ALANLAR[k.magara.alan];
      const ogeler = [bilgi('oda', K.odaTarifi(k))];
      ogeler.push({ id: 'ara', etiket: 'Dürbünle canlı ara', sec: kapatVe(() => K.kucukAra(d)) });
      if (i < l.length - 1) ogeler.push({ id: 'ileri', etiket: `Sonraki nokta: ${l[i + 1].ad}`, sec: kapatVe(() => K.magaraIlerle(d)) });
      if (i > 0) ogeler.push({ id: 'gerid', etiket: `Önceki nokta: ${l[i - 1].ad}`, sec: kapatVe(() => K.magaraGeri(d)) });
      l.forEach((n, j) => j !== i && Math.abs(j - i) > 1 && ogeler.push({ id: 'n' + n.id, etiket: `Git: ${n.ad}`, sec: kapatVe(() => { k.magara.oda = j > i ? j - 1 : j + 1; return j > i ? K.magaraIlerle(d) : K.magaraGeri(d); }) }));
      const bulunan = KUCUK_SIRASI.filter((id) => KUCUKLER[id].alan === k.magara.alan && k.arsiv.kucukler[id]).map((id) => KUCUKLER[id].ad);
      ogeler.push(bilgi('bulunan', bulunan.length ? `Bu alanda bulduğun canlılar: ${bulunan.join(', ')}.` : 'Bu alanda henüz canlı bulmadın.'));
      ogeler.push({ id: 'don', etiket: 'İstasyona dön', ipucu: `Yolculuk ${String(Math.round((a.yol / 60) * 10) / 10).replace('.', ',')} saat sürer.`, sec: () => (menu.kapat(), dinlenBaslat(k.dk + a.yol, { metin: `${a.ad} alanından istasyona dönüyorsun.`, bitince: () => K.uzaktanDon(d) }), 'sessiz') });
      return liste(u, a.ad, ogeler);
    }
    if (u === 'yonetim') {
      const ogeler = [];
      Object.entries(Y.EYLEMLER).forEach(([id, e]) => {
        const dur = Y.eylemDurumu(d, id);
        ogeler.push({ id: 'e' + id, etiket: `${e.ad}, ${Mz.liraSozu(e.ucret)}${dur.yapilir ? '' : `. ${dur.neden}`}`, ipucu: e.tarif, sec: yap(() => Y.eylemYap(d, id)) });
      });
      ogeler.push(altMenu('nufus', 'Nüfus dengesi ve tehdit altındaki türler', menu.ac));
      ogeler.push(altMenu('goc', 'Göç takibi', menu.ac));
      ogeler.push(altMenu('kamera', `İstasyon güvenlik kamerası: ${((k.su && k.su.kamera) || []).length} kayıt`, menu.ac));
      const l = Y.istilaciSatirlari(d);
      l.slice(0, 5).forEach(({ h, p }) =>
        ogeler.push({
          id: 'l' + h,
          etiket: `Lantanalı alan: ${BOLGE_ADLARI[M.bolgeBul(p.x, p.y)]}, ${yerTarifi(p)}. Oraya ${k.aracta ? 'sür' : 'yürü'}`,
          sec: kapatVe(() => {
            d.rota = { x: p.x, y: p.y, ad: 'Lantanalı alan', yakin: 8 };
            d.yaklasId = null;
            M.olay(d, 'rota', `Lantanalı alana gidiyorsun. ${M.BuyukHarf(yerTarifi(p))}. Varınca menüden İstilacı bitki temizliği seç.`, 3);
          }),
        })
      );
      if (l.length > 5) ogeler.push(bilgi('dahaFazla', `Ve ${l.length - 5} lantanalı alan daha.`));
      Y.raporSatirlari(k).forEach((m, i) => ogeler.push(bilgi('r' + i, m)));
      return liste(u, 'Ekolojik yönetim', ogeler, 'Türleri korumak, nüfus dengesini izlemek ve ekosistemi iyileştirmek için eylemler. Her yıl sonunda tehdit altındaki türler için koruma raporu gelir.');
    }
    if (u === 'kamera') {
      const l = S.kameraSatirlari(k);
      return liste(u, 'Güvenlik kamerası', l.length ? l.map((m, i) => bilgi('c' + i, m)) : [bilgi('yok', 'Henüz istasyonun yakınına büyük bir hayvan gelmedi.')], 'İstasyonun 45 metre çevresine giren büyük hayvanlar kaydedilir. Her sabah gecenin özeti mesaj olarak gelir.');
    }
    if (u === 'goc') return liste(u, 'Göç takibi', Y.gocSatirlari(d).map((m, i) => bilgi('g' + i, m)), 'Zebra ve gnu doğu geçidinden, ceylanlar batı geçidinden göç eder. Kurak mevsimde ayrılır, yağmurla dönerler.');
    if (u === 'nufus') {
      return liste(u, 'Nüfus dengesi', Y.nufusSatirlari(d).map((m, i) => bilgi('n' + i, m)), 'Kırmızı Liste durumu Doğu Afrika alt türlerine göredir. Yıl başındaki nüfusla karşılaştırılır.');
    }
    if (u === 'geziler') {
      const ogeler = [];
      K.uzakSatirlari(k).forEach(({ id, a, dur, metin }) => {
        ogeler.push(bilgi('b' + id, metin, a.tarif));
        if (dur.acik)
          ogeler.push({
            id: 'git' + id,
            etiket: `${a.ad}: yola çık`,
            ipucu: 'İstasyondan araçla gidilir. Yolda zaman akar; savandaki hayvanlar yaşamaya devam eder.',
            sec: () => {
              const h = K.uzakHazirla(d, id);
              if (h) {
                Ses.hemen(h);
                return 'sessiz';
              }
              menu.kapat();
              dinlenBaslat(k.dk + a.yol, { metin: `${a.ad} alanına yola çıktın. Alan izni ve konaklama için ${Mz.liraSozu(a.ucret)} ödendi.`, bitince: () => K.uzagaVar(d, id) });
              return 'sessiz';
            },
          });
      });
      {
        const dur = K.kutupDurumu(k);
        ogeler.unshift(bilgi('bkutup', K.kutupSatiri(k), 'Kuzeydoğu Grönland kıyısında serbestçe dolaşılan ayrı bir harita: kutup ayısı, fok, mors, beluga, ren geyiği, misk öküzü, kutup kurdu, tilkisi ve tavşanı. Deniz buzu mevsime göre gelir gider; yazın güneş batmaz, kışın hiç doğmaz.'));
        if (dur.acik && !M.oyuncuKutupta(k))
          ogeler.splice(1, 0, {
            id: 'gitkutup',
            etiket: 'Kuzey Kutbu: yola çık',
            ipucu: 'İstasyondan uçakla gidilir. Yolda zaman akar; savandaki hayvanlar yaşamaya devam eder.',
            sec: () => {
              const h = K.kutupHazirla(d);
              if (h) {
                Ses.hemen(h);
                return 'sessiz';
              }
              menu.kapat();
              dinlenBaslat(k.dk + K.KUTUP_GEZI.yol, { metin: `Kuzey Kutbu'na uçuyorsun. Uçak, izin ve kulübe için ${Mz.liraSozu(K.KUTUP_GEZI.ucret)} ödendi.`, bitince: () => K.kutbaVar(d) });
              return 'sessiz';
            },
          });
        if (M.oyuncuKutupta(k)) ogeler.splice(1, 0, kutupDonSatiri());
      }
      return liste(u, 'Saha gezileri', ogeler, 'Savandan uzaktaki özel araştırma alanları. Orada yukarı ve aşağı kaydırarak noktalar arasında gezer, dürbünle canlı ararsın. Her alanın araştırması merkezde.');
    }
    if (u === 'magara') {
      if (!k.magara) return liste(u, 'Mağara', [bilgi('yok', 'Mağarada değilsin.')]);
      const i = k.magara.oda;
      const ogeler = [bilgi('oda', K.odaTarifi(k))];
      if (i < MAGARA_ODALARI.length - 1) ogeler.push({ id: 'ileri', etiket: `İlerle: ${MAGARA_ODALARI[i + 1].ad}`, sec: kapatVe(() => K.magaraIlerle(d)) });
      if (i > 0) ogeler.push({ id: 'gerid', etiket: `Geri dön: ${MAGARA_ODALARI[i - 1].ad}`, sec: kapatVe(() => K.magaraGeri(d)) });
      ogeler.push({ id: 'ara', etiket: 'Fenerle küçük canlı ara', sec: kapatVe(() => K.kucukAra(d)) });
      ogeler.push({ id: 'cik', etiket: 'Mağaradan çık', sec: kapatVe(() => K.magaradanCik(d)) });
      return liste(u, 'Mağara', ogeler);
    }
    if (u === 'kucukler') {
      const a = k.arsiv.kucukler || {};
      const ogeler = GRUPLAR.map((g) => {
        const l = KUCUK_SIRASI.filter((id) => KUCUKLER[id].grup === g);
        return altMenu('kg-' + g, `${g}: ${l.filter((id) => a[id]).length} / ${l.length}`, menu.ac);
      });
      const ozel = [a.termitUcusu && 'termitlerin çiftleşme uçuşu', a.yarasaCikisi && 'yarasaların akşam çıkışı'].filter(Boolean);
      if (ozel.length) ogeler.push(bilgi('ozel', `Gözlenen özel anlar: ${ozel.join(', ')}.`));
      const odalar = (k.arsiv.magara && k.arsiv.magara.odalar) || [];
      ogeler.push(bilgi('magara', odalar.length ? `Mağarada keşfedilen odalar: ${MAGARA_ODALARI.filter((o) => odalar.includes(o.id)).map((o) => o.ad).join(', ')}.` : 'Mağara henüz keşfedilmedi.'));
      return liste(u, 'Küçük canlılar', ogeler);
    }
    if (u.startsWith('kg-')) {
      const g = u.slice(3).split('~')[0];
      const a = k.arsiv.kucukler || {};
      const l = KUCUK_SIRASI.filter((id) => KUCUKLER[id].grup === g);
      const tum = l
        .filter((id) => a[id])
        .map((id) => {
          const c = KUCUKLER[id];
          return bilgi('c' + id, `${c.ad}, ${c.bilimsel}${c.nadir ? ', nadir' : ''}. ${c.tarif}${c.ses ? ` Sesi: ${c.ses}` : ''} ${a[id].sayi} kez görüldü; ilk kez ${a[id].ilkBolge}.`);
        });
      const kalan = l.length - tum.length;
      const s2 = sayfali('kg-' + g, tum, menu, 10);
      if (s2.sayfa) return liste(s2.sayfa.anahtar, s2.sayfa.baslik, s2.sayfa.ogeler);
      return liste(u, g, [...(s2.ogeler.length ? s2.ogeler : [bilgi('bos', 'Bu gruptan henüz bir tür bulmadın.')]), ...(kalan ? [bilgi('kalan', `Bulunmamış ${kalan} tür var.`)] : [])]);
    }
    if (u === 'koruma') {
      const ogeler = Mz.KORUMA.map((p) => altMenu('koruma-' + p.id, Mz.korumaOzeti(k, p), menu.ac, p.tarif));
      return liste(u, 'Koruma projeleri', ogeler, 'Nesli tehlikedeki türler ve insan etkileri için uzun süreli projeler.');
    }
    if (u.startsWith('koruma-')) {
      const p = Mz.KORUMA.find((x) => 'koruma-' + x.id === u);
      if (!p) return liste(u, 'Proje', [bilgi('yok', 'Proje bulunamadı.')]);
      const pd = k.koruma.projeler[p.id];
      const ogeler = [bilgi('tarif', p.tarif)];
      if (!pd) ogeler.push({ id: 'basla', etiket: 'Projeyi başlat', sec: yap(() => Mz.korumaBaslat(k, p.id)) });
      else {
        Mz.korumaSatirlari(k, p.id).forEach((a) => {
          ogeler.push(bilgi('a' + a.i, `${a.i + 1}. adım, ${a.tamam ? 'tamamlandı' : 'yapılacak'}: ${a.metin}`));
          if (a.eylem) ogeler.push({ id: 'e' + a.i, etiket: a.eylem, sec: yap(() => Mz.korumaEylem(k, p.id, a.i)) });
        });
        if (pd.durum === 'tamam') ogeler.push(bilgi('sonuc', `Tamamlandı. ${p.sonuc}`));
      }
      ogeler.push(bilgi('odul', `Ödül: ${Mz.liraSozu(p.odul.fon)} fon ve bilimsel itibar.`));
      return liste(u, p.ad, ogeler);
    }
    const ay = ayarSayfasi(menu, ayar, (x) => (ayarDegistir(x), yenile((v) => v + 1)), k, () => yenile((v) => v + 1));
    if (ay) return liste(u, ay.baslik, ay.ogeler);
    if (u === 'yardim') return liste(u, 'Nasıl oynanır', yardimKonulari(menu, 'o'));
    return liste(u, 'Menü', []);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#0d1626' }}>
      {ayar.grafik !== 'kapali' && <GLView style={StyleSheet.absoluteFill} onContextCreate={glHazir} accessible={false} importantForAccessibility="no-hide-descendants" accessibilityElementsHidden />}
      <View
        style={{ flex: 1, paddingTop: kenar.top, paddingBottom: kenar.bottom, paddingLeft: kenar.left, paddingRight: kenar.right }}
        accessibilityElementsHidden={!!menu.ust}
        importantForAccessibility={menu.ust ? 'no-hide-descendants' : 'auto'}
      >
        <View style={st.ust} pointerEvents={jestli ? 'none' : 'auto'}>
          <View style={[st.hud, ayar.kontrast && st.hudK]} accessible accessibilityLabel={`Durum. ${M.durumOzeti(d)}`}>
            <Text style={st.hudAd} numberOfLines={1}>
              {k.ad} · {M.gunNo(k.dk)}. gün {M.saatMetni(k.dk)}
            </Text>
            <Text style={st.hudKucuk} numberOfLines={1}>
              {Mz.liraSozu(k.butce)} · itibar {k.itibar}
            </Text>
            <Text style={st.hudKucuk} numberOfLines={1}>
              {k.magara ? `${bolumAdi(k)} · ${aktifOda(k).ad}` : M.bolgeAdi(d.oyuncu.x, d.oyuncu.y)}
              {k.aracta ? ' · araçta' : ''}
              {jestli ? ` · Alet: ${alet.ad}` : ''}
            </Text>
            {gb && (
              <Text style={st.hudHedef} numberOfLines={2}>
                {M.gozlemTarifi(d, gb)}
              </Text>
            )}
            {d.sesKayit && <Text style={st.hudHedef}>Ses kaydı sürüyor…</Text>}
          </View>
          {!jestli && (
            <View style={st.baglamSatir}>
              <Dugme etiket="Çevreyi betimle" ipucu="Işık, hava, zemin, önündeki engel, yakındaki yerler, sesler ve hayvanlar" onEtkin={() => Ses.hemen(B.betimle(d))} stil={st.baglamDugme} />
              <Dugme etiket={k.teknede ? 'Tekneden in' : G.tekneYakin(d) && !aracYakin ? 'Tekneye bin' : k.aracta ? 'Araçtan in' : aracYakin ? 'Araca bin' : 'Araca git'} onEtkin={aracIslemi} stil={st.baglamDugme} />
              {(d.rota || d.yaklasId || gb) && <Dugme etiket="Dur ve gözlemi bitir" onEtkin={durVeBitir} stil={st.baglamDugme} />}
            </View>
          )}
        </View>

        <View style={{ flex: 1 }} pointerEvents="none" />

        <View style={st.altyaziKap} pointerEvents="none">
          {!!altyazi && (
            <Text style={st.altyazi} numberOfLines={4} accessibilityElementsHidden importantForAccessibility="no">
              {altyazi}
            </Text>
          )}
          {jestli && (
            <Text style={st.jestIpucu} accessibilityElementsHidden importantForAccessibility="no">
              Sürükle: yürü · Dokun: anlat · Uzun bas: durum · Çift dokun: {kucuk(alet.ad)}
              {'\n'}İki parmak sağa/sola: alet · yukarı: araç · aşağı: dur · iki parmak çift dokun: menü
            </Text>
          )}
        </View>
        {!jestli && (
          <>
            <View style={st.izgara}>
              {k.magara ? (
                <Dugme etiket={k.magara.alan ? 'Canlı ara' : 'Küçük canlı ara'} ipucu={k.magara.alan ? 'Dürbünle bu noktadaki canlıları arar' : 'Fenerle mağaradaki canlıları arar'} onEtkin={() => K.kucukAra(d)} stil={[st.eylem, ayar.buyukDugme && st.eylemBuyuk, st.ana]} />
              ) : (
                <Dugme etiket="Gözlemle" ipucu="Dürbünle sıradaki hayvanı seçer ve izler" onEtkin={() => M.gozlemBaslat(d)} stil={[st.eylem, ayar.buyukDugme && st.eylemBuyuk, st.ana]} />
              )}
              <Dugme etiket="Yaklaş" ipucu="Seçili hayvana ürkütmeden yaklaşır" onEtkin={() => M.yaklas(d)} stil={[st.eylem, ayar.buyukDugme && st.eylemBuyuk]} />
              <Dugme etiket="Fotoğraf çek" onEtkin={() => M.fotografCek(d)} stil={[st.eylem, ayar.buyukDugme && st.eylemBuyuk]} />
              <Dugme etiket={d.sesKayit ? 'Kayıt sürüyor' : 'Ses kaydı'} devre={!!d.sesKayit} ipucu="6 saniye dinler ve sesleri çözümler" onEtkin={() => M.sesKaydiBaslat(d)} stil={[st.eylem, ayar.buyukDugme && st.eylemBuyuk]} />
              <Dugme etiket="Etrafı tara" onEtkin={() => Ses.hemen(Mz.kuleTaramasi(d) || M.etrafiTara(d))} stil={[st.eylem, ayar.buyukDugme && st.eylemBuyuk]} />
              <Dugme etiket="Neredeyim" onEtkin={() => Ses.hemen(M.konumOzeti(d))} stil={[st.eylem, ayar.buyukDugme && st.eylemBuyuk]} />
              <Dugme etiket="Yerler" onEtkin={() => menuAc('yerler')} stil={[st.eylem, ayar.buyukDugme && st.eylemBuyuk]} />
              <Dugme etiket="Merkez" ipucu="Araştırma merkezi: mesajlar, görevler, araştırmalar" onEtkin={() => menuAc('merkez')} stil={[st.eylem, ayar.buyukDugme && st.eylemBuyuk]} />
              <Dugme etiket="Menü" onEtkin={() => menuAc('ana')} stil={[st.eylem, ayar.buyukDugme && st.eylemBuyuk]} />
            </View>
            {k.magara ? (
              <View style={[st.voSatir, ayar.solEl && { flexDirection: 'row-reverse' }]}>
                <Dugme etiket="Geri dön" onEtkin={() => K.magaraGeri(d)} stil={[st.voDugme, ayar.buyukDugme && st.voBuyuk]} />
                <Dugme etiket="İlerle" onEtkin={() => K.magaraIlerle(d)} stil={[st.voDugme, ayar.buyukDugme && st.voBuyuk]} />
                <Dugme etiket={k.magara.alan ? 'Noktayı anlat' : 'Odayı anlat'} onEtkin={() => Ses.hemen(K.odaTarifi(k))} stil={[st.voDugme, ayar.buyukDugme && st.voBuyuk]} />
                {k.magara.alan ? (
                  <Dugme etiket="İstasyona dön" onEtkin={() => menuAc('magara')} stil={[st.voDugme, ayar.buyukDugme && st.voBuyuk]} />
                ) : (
                  <Dugme etiket="Mağaradan çık" onEtkin={() => K.magaradanCik(d)} stil={[st.voDugme, ayar.buyukDugme && st.voBuyuk]} />
                )}
              </View>
            ) : (
            <View style={[st.voSatir, ayar.solEl && { flexDirection: 'row-reverse' }]}>
              <Dugme etiket="Sola dön" onEtkin={() => adimAt(k.aracta ? 0.5 : 0, -1, k.aracta ? 900 : 360)} stil={[st.voDugme, ayar.buyukDugme && st.voBuyuk]} />
              <Dugme etiket={k.aracta ? 'İleri sür' : 'İleri yürü'} ipucu={k.aracta ? 'Bir süre ileri sürer' : 'Yaklaşık 4 metre ilerler'} onEtkin={() => adimAt(1, 0, k.aracta ? 1500 : 900)} stil={[st.voDugme, ayar.buyukDugme && st.voBuyuk]} />
              <Dugme etiket="Sağa dön" onEtkin={() => adimAt(k.aracta ? 0.5 : 0, 1, k.aracta ? 900 : 360)} stil={[st.voDugme, ayar.buyukDugme && st.voBuyuk]} />
              <Dugme etiket="Geri git" onEtkin={() => adimAt(-1, 0, 800)} stil={[st.voDugme, ayar.buyukDugme && st.voBuyuk]} />
            </View>
            )}
          </>
        )}
      </View>

      {menu.ust && (
        <View style={[st.menuOrt, { zIndex: 10 }]} pointerEvents={jestli ? 'none' : 'auto'}>
          {menuIcerigi()}
        </View>
      )}
      {/* Hareketle oynarken tek dokunma katmanı: sahada ve menüde bütün dokunuşlar buradan geçer (en üstte, hep kurulu) */}
      {jestli && (
        <View
          style={[StyleSheet.absoluteFill, { zIndex: 20 }]}
          {...sahaJest}
          accessible={!menu.ust}
          accessibilityLabel={menu.ust ? undefined : 'Saha. Tek parmakla sürükleyerek yürü, dokununca çevre anlatılır, iki parmakla iki kez dokununca menü açılır.'}
        />
      )}
    </View>
  );
}

// ---------------- Hata sınırı: oyun ekranı çökerse uygulama kapanmaz ----------------
class HataSiniri extends React.Component {
  constructor(p) {
    super(p);
    this.state = { hata: null };
  }
  static getDerivedStateFromError(hata) {
    return { hata };
  }
  componentDidCatch(hata) {
    hataKaydet(hata, 'ekran');
    Ses.hemen('Oyun ekranında bir hata oldu. Araştırman en son kaydedildiği hâliyle duruyor. Ana menüye dönmek için ekrandaki tek düğmeye dokun.');
  }
  render() {
    if (!this.state.hata) return this.props.children;
    return (
      <View style={{ flex: 1, padding: 24, paddingTop: 80, gap: 20, backgroundColor: '#000' }}>
        <Text style={{ color: '#fff', fontSize: 22 }} accessibilityRole="header">
          Bir hata oldu
        </Text>
        <Text style={{ color: '#fff', fontSize: 17 }}>{String(this.state.hata && this.state.hata.message).slice(0, 200)}</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Ana menüye dön"
          onPress={() => this.props.cikis()}
          style={{ backgroundColor: '#FFD400', padding: 24, borderRadius: 14, alignItems: 'center' }}
        >
          <Text style={{ color: '#000', fontSize: 22, fontWeight: '800' }}>Ana menüye dön</Text>
        </Pressable>
      </View>
    );
  }
}

// ---------------- Uygulama ----------------
export default function App() {
  const [voAcik, setVoAcik] = useState(false);
  useEffect(() => {
    AccessibilityInfo.isScreenReaderEnabled()
      .then((a) => setVoAcik(!!a))
      .catch(() => {});
    const abone = AccessibilityInfo.addEventListener('screenReaderChanged', (a) => setVoAcik(!!a));
    return () => abone && abone.remove && abone.remove();
  }, []);
  const [ekran, setEkran] = useState('yukleniyor');
  const [ayar, setAyar] = useState(VARSAYILAN_AYAR);
  const [kayit, setKayit] = useState(null);
  const [arastirmaci, setArastirmaci] = useState(null);
  const [oyunAnahtar, setOyunAnahtar] = useState(0);

  useEffect(() => {
    setAudioModeAsync({ playsInSilentMode: true, interruptionMode: 'mixWithOthers', shouldPlayInBackground: false })
      .then(() => setIsAudioActiveAsync(true))
      .catch(() => {});
    try {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP).catch(() => {});
    } catch (e) {}
    (async () => {
      let a = VARSAYILAN_AYAR;
      try {
        const ham = await AsyncStorage.getItem(AYAR_ANAHTAR);
        if (ham) a = { ...VARSAYILAN_AYAR, ...JSON.parse(ham) };
      } catch (e) {}
      try {
        const h = await AsyncStorage.getItem(HATA_ANAHTAR);
        if (h) HATALAR.push(...JSON.parse(h).slice(0, 20));
      } catch (e) {}
      // Kayıt bozuksa yedekten aç (çevrim dışı dayanıklılık)
      let kk = null;
      let ham = null;
      try {
        ham = await AsyncStorage.getItem(KAYIT_ANAHTAR);
        if (ham) kk = M.kayittanYukle(JSON.parse(ham));
      } catch (e) {
        hataKaydet(e, 'kayıt okuma');
      }
      if (ham && !kk) {
        try {
          const y = await AsyncStorage.getItem(YEDEK_ANAHTAR);
          if (y) kk = M.kayittanYukle(JSON.parse(y));
          if (kk) {
            kk.yedektenGeldi = true;
            AsyncStorage.setItem(KAYIT_ANAHTAR, y).catch(() => {});
          }
        } catch (e) {
          hataKaydet(e, 'yedek okuma');
        }
      }
      setAyar(a);
      setKayit(kk);
      GORUNUM.kontrast = !!a.kontrast;
      GORUNUM.buyukYazi = !!a.buyukYazi;
      if (a.kip) Ses.ayarla({ hiz: a.hiz });
      if (kk && kk.yedektenGeldi) setTimeout(() => Ses.soyle('Son kayıt okunamadı; araştırman en son yedekten açılacak. Birkaç dakikalık ilerleme kaybolmuş olabilir.', 4), 1500);
      setEkran(a.kip ? 'menu' : 'kip');
    })();
  }, []);

  useEffect(() => {
    Efekt.efektAyarla({ acik: ayar.efekt !== false, kis: ayar.efektKis !== false, ortam: ayar.ortam !== false ? ORTAM_DUZEY[ayar.ortamDuzey] || 0.35 : 0 });
  }, [ayar.efekt, ayar.efektKis, ayar.ortam, ayar.ortamDuzey]);
  GORUNUM.kontrast = !!ayar.kontrast;
  GORUNUM.buyukYazi = !!ayar.buyukYazi;

  const ayarDegistir = useCallback((deg) => {
    setAyar((a) => {
      const yeni = { ...a, ...deg };
      AsyncStorage.setItem(AYAR_ANAHTAR, JSON.stringify(yeni)).catch(() => {});
      return yeni;
    });
  }, []);

  const kipSec = (kip) => {
    ayarDegistir({ kip });
    Ses.ayarla({ kip });
    Ses.hemen(
      kip === 'gorerek'
        ? 'Görerek oyna seçildi.'
        : kip === 'voiceover'
          ? 'VoiceOver ile oyna seçildi.'
          : 'Sesle oyna seçildi. Menülerde sağa ve sola kaydırarak satırlar arasında gezinirsin; ekranın herhangi bir yerine iki kez dokununca okunan satır seçilir. İki parmakla iki kez dokunmak geri götürür.'
    );
    setEkran('menu');
  };

  const basla = (k) => {
    setArastirmaci(k);
    setOyunAnahtar((x) => x + 1);
    setEkran('oyun');
  };

  // VoiceOver açıkken oyunun dokunma hareketleri çalışmaz (VoiceOver dokunuşları kendisi alır; Kayıp Okyanus'ta da böyleydi).
  // Bu yüzden VoiceOver açık olduğu sürece seçilen biçim ne olursa olsun düğmeli VoiceOver düzeni kullanılır;
  // VoiceOver kapanınca seçilen biçime dönülür.
  const secilenKip = ayar.kip || 'kendi';
  const kip = voAcik && secilenKip !== 'voiceover' ? 'voiceover' : secilenKip;
  const oncekiKip = useRef(null);
  useEffect(() => {
    if (!ayar.kip) return;
    Ses.ayarla({ kip });
    const once = oncekiKip.current;
    oncekiKip.current = kip;
    if (secilenKip === 'voiceover' || once === kip) return;
    if (kip === 'voiceover')
      setTimeout(() => Ses.soyle("VoiceOver açık olduğu için düğmeli düzene geçildi. Menüler ve oyun ekranı VoiceOver ile kullanılır. Oyunun kendi sesiyle hareketlerle oynamak istersen VoiceOver'ı kapat; oyun kendiliğinden hareketli düzene döner.", 4), 600);
    else if (once) setTimeout(() => Ses.hemen('VoiceOver kapandı; hareketli düzene dönüldü.'), 400);
  }, [kip, ayar.kip]);
  let icerik = null;
  if (ekran === 'yukleniyor') icerik = <View style={{ flex: 1 }} />;
  else if (ekran === 'kip') icerik = <KipSecim sec={kipSec} />;
  else if (ekran === 'menu')
    icerik = (
      <AnaMenu
        kip={kip}
        kayit={kayit}
        ayar={ayar}
        ayarDegistir={ayarDegistir}
        devam={() => basla(kayit)}
        yeni={(ad) => {
          const k = M.arastirmaciOlustur(ad);
          AsyncStorage.setItem(KAYIT_ANAHTAR, JSON.stringify(k)).catch(() => {});
          setKayit(k);
          basla(k);
        }}
      />
    );
  else if (ekran === 'oyun')
    icerik = (
      <HataSiniri key={oyunAnahtar} cikis={() => setEkran('menu')}>
        <Oyun
          arastirmaci={arastirmaci}
          ayar={ayar}
          ayarDegistir={ayarDegistir}
          cikis={() => {
            setKayit(M.kayitHazirla(arastirmaci));
            setEkran('menu');
          }}
        />
      </HataSiniri>
    );

  return (
    <SafeAreaProvider>
      <KipBaglam.Provider value={kip}>
        <View style={{ flex: 1, backgroundColor: RENK.zemin }}>
          <StatusBar style="light" />
          {icerik}
        </View>
      </KipBaglam.Provider>
    </SafeAreaProvider>
  );
}

const st = StyleSheet.create({
  oyunAdi: { color: RENK.vurgu, fontSize: 40, fontWeight: '800', marginTop: 24, letterSpacing: 1 },
  metin: { color: RENK.yazi, fontSize: 17, lineHeight: 24 },
  satir: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  dugme: { backgroundColor: '#2a2f2a', borderRadius: 12, paddingVertical: 12, paddingHorizontal: 10, borderWidth: 1, borderColor: '#3d4538', justifyContent: 'center', alignItems: 'center' },
  dugmeBasili: { opacity: 0.7 },
  dugmeDevre: { opacity: 0.45 },
  dugmeYazi: { color: RENK.yazi, fontSize: 14, fontWeight: '600', textAlign: 'center' },
  dugmeK: { backgroundColor: '#000000', borderColor: '#FFFFFF', borderWidth: 2 },
  dugmeYaziK: { color: '#FFFFFF' },
  dugmeYaziB: { fontSize: 18 },
  eylemBuyuk: { height: 78 },
  voBuyuk: { height: 92 },
  hudK: { backgroundColor: '#000000', borderWidth: 2, borderColor: '#FFFFFF' },
  kipKap: { flex: 1, padding: 18, paddingTop: 60, gap: 12 },
  kipSatir: { flex: 1, flexDirection: 'column', gap: 12 },
  kipYari: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  kipBuyuk: { color: RENK.vurgu, fontSize: 40, fontWeight: '800', marginBottom: 16 },
  kipYazi: { color: RENK.yazi, fontSize: 28, fontWeight: '800', textAlign: 'center' },
  kipAlt: { color: RENK.soluk, fontSize: 16, marginTop: 8, textAlign: 'center' },
  ust: { paddingHorizontal: 8, paddingTop: 4, gap: 6 },
  hud: { padding: 10, backgroundColor: 'rgba(21,23,26,0.82)', borderRadius: 12, gap: 3 },
  hudAd: { color: RENK.yazi, fontSize: 16, fontWeight: '800', flexShrink: 1 },
  hudKucuk: { color: RENK.soluk, fontSize: 13 },
  hudHedef: { color: '#ffe08a', fontSize: 14, fontWeight: '700' },
  baglamSatir: { flexDirection: 'row', gap: 6 },
  baglamDugme: { flex: 1, backgroundColor: '#33381f', borderColor: '#6b6a2e' },
  altyaziKap: { paddingHorizontal: 8, paddingBottom: 6, minHeight: 4 },
  altyazi: { color: '#fff', backgroundColor: 'rgba(0,0,0,0.6)', padding: 8, borderRadius: 8, fontSize: 14 },
  jestIpucu: { color: 'rgba(255,255,255,0.75)', fontSize: 12, textAlign: 'center', marginTop: 6, backgroundColor: 'rgba(0,0,0,0.35)', borderRadius: 8, padding: 6, marginBottom: 6 },
  izgara: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, paddingHorizontal: 8, justifyContent: 'space-between' },
  eylem: { width: '32%', height: 54 },
  ana: { backgroundColor: 'rgba(60,72,32,0.95)', borderColor: '#9aa84a' },
  voSatir: { flexDirection: 'row', gap: 6, paddingHorizontal: 8, marginTop: 6, marginBottom: 6 },
  voDugme: { flex: 1, height: 64 },
  menuOrt: { ...StyleSheet.absoluteFillObject, backgroundColor: RENK.zemin },
});
