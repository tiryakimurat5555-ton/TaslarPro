// Oyun mantığı testi: her sınıf için basit bir bot oynatır, hata ve denge sorunlarını yakalar.
// Kullanım: bun araclar/oyun-testi.js [dakika]
import * as M from '../oyun/mantik.js';
import { YETENEKLER, GOREVLER } from '../oyun/veri.js';

const DAKIKA = Number(process.argv[2] || 60);
let hata = 0;
const kontrol = (k, m) => {
  if (!k) {
    hata++;
    console.log('HATA:', m);
  }
};

// Temel birim testleri
kontrol(M.gerekenXp(1) === 100, 'gerekenXp(1)');
kontrol(M.gerekenXp(80) === 1537439, 'gerekenXp(80)');
kontrol(M.saatYonu({ x: 0, y: 0, yon: 0 }, { x: 0, y: 5 }) === 12, 'saat 12');
kontrol(M.saatYonu({ x: 0, y: 0, yon: 0 }, { x: 5, y: 0 }) === 3, 'saat 3');
kontrol(M.saatYonu({ x: 0, y: 0, yon: 0 }, { x: -5, y: 0 }) === 9, 'saat 9');
kontrol(M.saatYonu({ x: 0, y: 0, yon: Math.PI / 2 }, { x: 0, y: 5 }) === 9, 'dönükken saat 9');
kontrol(M.pusulaYonu(0) === 'kuzey' && M.pusulaYonu(Math.PI) === 'güney', 'pusula');

for (const sinif of ['savasci', 'okcu', 'buyucu', 'rahip']) {
  const k = M.karakterOlustur({ ad: 'Deneme', ulus: 'gun', irk: 'insan', sinif });
  const d = M.dunyaOlustur(k, 7);
  d.rng = M.tohumluUretec(99);
  const yetenekler = YETENEKLER[sinif];
  let son = 0;
  const adim = 0.05;
  let konusma = -99;
  for (let t = 0; t < DAKIKA * 60; t += adim) {
    if (d.olu) {
      if (d.zaman - d.olumZamani > 3) M.yenidenDog(d);
    } else {
      const h = M.hesapla(k);
      // Köydeyken görev işleri ve puan dağıtımı
      if (k.serbestPuan) M.otomatikDagit(k);
      if (Math.hypot(d.oyuncu.x, d.oyuncu.y) < 8 && t - konusma > 2) {
        konusma = t;
        if (k.gorev.durum !== 'aktif' && GOREVLER[k.gorev.sira]) { M.muhtarlaKonus(d); if (k.gorev.durum === 'yok') M.muhtarlaKonus(d); }
        k.envanter.slice().forEach((e) => {
          const eski = k.kusanilan[e.yuva];
          if (e.seviye <= k.seviye && (!eski || e.deger > eski.deger)) M.kusan(k, e.id);
          else M.esyaSat(k, e.id);
        });
        while (k.iksir < 5 && M.iksirAl(k)) {}
      }
      if (k.can < h.enCan * 0.35) M.iksirIc(d);
      if ((k.can < h.enCan * 0.2 || k.gorev.durum === 'tamam') && !d.isinlanma) M.koyeDon(d);
      if (!M.hedef(d) && !d.isinlanma && k.can > h.enCan * 0.6) {
        // seviyesine uygun en yakın canavarı seç
        const uygun = d.canavarlar
          .filter((c) => !c.olu && c.seviye <= k.seviye + 1 && c.seviye >= k.seviye - 4)
          .sort((a, b) => M.mesafe(a, d.oyuncu) - M.mesafe(b, d.oyuncu));
        if (uygun[0]) {
          d.hedefId = uygun[0].id;
          M.saldir(d);
        }
      }
      if (M.hedef(d) && M.mesafe(d.oyuncu, M.hedef(d)) <= h.menzil) {
        for (const y of yetenekler) {
          if (y.tur === 'sicra') continue;
          if (y.tur === 'iyiles' && k.can > h.enCan * 0.6) continue;
          if (M.yetenekDurumu(d, y).hazir) {
            M.yetenekKullan(d, y.id);
            break;
          }
        }
      }
    }
    M.guncelle(d, adim, {});
    const olaylar = M.olaylariAl(d);
    for (const o of olaylar) {
      if (o.metin && /NaN|undefined/.test(o.metin)) kontrol(false, `${sinif} olay metni bozuk: ${o.metin}`);
    }
    if (!Number.isFinite(k.can) || !Number.isFinite(d.oyuncu.x)) {
      kontrol(false, `${sinif} sayı bozuldu`);
      break;
    }
    if (t - son >= 600) son = t;
  }
  const h = M.hesapla(k);
  console.log(
    `${sinif.padEnd(8)} ${DAKIKA} dk: seviye ${k.seviye}, ölüm ${k.olum}, öldürülen ${k.oldurulen}, görev ${k.gorev.sira}, altın ${k.altin}, can ${h.enCan}, saldırı ${h.saldiri}, savunma ${h.savunma}`
  );
  const kayit = M.kayittanYukle(JSON.parse(JSON.stringify(M.kayitHazirla(k))));
  kontrol(kayit && kayit.seviye === k.seviye, `${sinif} kayıt geri yüklenemedi`);
}
console.log(hata ? `${hata} hata` : 'Hata yok');
process.exit(hata ? 1 : 0);
