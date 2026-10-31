// App.js icindeki oyun mantigini cikarip simulasyonla test eder
const fs = require('fs');
const src = fs.readFileSync(process.argv[2], 'utf8');
const bas = src.indexOf('// ==== MANTIK BASLANGIC ====');
const son = src.indexOf('// ==== MANTIK BITIS ====');
const kod = src.slice(bas, son);
const M = new Function(kod + '\nreturn {N, bolumAyari, hedefOlustur, hedefIlerlet, hedefTamam, yildizHesapla, tahtaGecerliMi, tahtaOlustur, eslesmeleriBul, plandanEslesme, temizlikHesapla, sonucUygula, yercekimi, ipucuBul, karistir, ozelKombo, hamleGecerliMi, takasla, tahtaKopyala, puanHesapla, yeniTas};')();

let hata = 0;
const kontrol = (kosul, mesaj) => {
  if (!kosul) {
    hata++;
    console.log('HATA:', mesaj);
  }
};

function tahtaGecerli(bd, etiket) {
  const ids = new Set();
  for (let r = 0; r < M.N; r++)
    for (let c = 0; c < M.N; c++) {
      const cl = bd[r][c];
      if (cl.stone > 0) kontrol(!cl.gem, `${etiket}: tas blokta mucevher var`);
      else kontrol(!!cl.gem, `${etiket}: bos hucre ${r},${c}`);
      if (cl.gem) {
        kontrol(!ids.has(cl.gem.id), `${etiket}: tekrar eden id`);
        ids.add(cl.gem.id);
      }
    }
}

// Rastgele oyun simulasyonu: her seviyede rastgele gecerli hamleler
let toplamHamle = 0;
let toplamKombo = 0;
let ozel = { 'striped-h': 0, 'striped-v': 0, bomb: 0, colorbomb: 0 };
let kazanilan = 0;
for (let L = 1; L <= 30; L++) {
  for (let oyun = 0; oyun < 10; oyun++) {
    const ayar = M.bolumAyari(L);
    let bd = M.tahtaOlustur(ayar);
    tahtaGecerli(bd, `L${L} baslangic`);
    kontrol(M.eslesmeleriBul(bd).length === 0, `L${L} baslangicta eslesme var`);
    kontrol(!!M.ipucuBul(bd), `L${L} baslangicta hamle yok`);
    let score = 0;
    let colorCount = 0;
    let specials = 0;
    for (let m = 0; m < ayar.moves; m++) {
      // gecerli hamlelerden rastgele birini sec
      const secenek = [];
      for (let r = 0; r < M.N; r++)
        for (let c = 0; c < M.N; c++) {
          if (c + 1 < M.N && M.hamleGecerliMi(bd, { r, c }, { r, c: c + 1 })) secenek.push([{ r, c }, { r, c: c + 1 }]);
          if (r + 1 < M.N && M.hamleGecerliMi(bd, { r, c }, { r: r + 1, c })) secenek.push([{ r, c }, { r: r + 1, c }]);
        }
      if (!secenek.length) {
        bd = M.karistir(bd, ayar.ncolors);
        continue;
      }
      const [a, b] = secenek[Math.floor(Math.random() * secenek.length)];
      bd = M.tahtaKopyala(bd);
      M.takasla(bd, a, b);
      const kombo = M.ozelKombo(bd, a, b);
      let ilkPlan = kombo ? kombo.plan : null;
      if (kombo) bd = kombo.board;
      kontrol(kombo || M.eslesmeleriBul(bd).length > 0, 'gecerli hamle eslesme olusturmadi');
      let zincir = 0;
      let ilk = true;
      let guvenlik = 0;
      while (guvenlik++ < 100) {
        zincir++;
        let plan;
        if (ilk && ilkPlan) plan = ilkPlan;
        else {
          const runs = M.eslesmeleriBul(bd);
          if (!runs.length) break;
          plan = M.plandanEslesme(bd, runs, ilk ? [a, b] : []);
        }
        ilk = false;
        const res = M.temizlikHesapla(bd, plan);
        if (!res.pops.length && !res.chainBreaks.length && !res.stoneHits.length) break;
        score += M.puanHesapla(res, zincir, false);
        res.create.forEach((x) => ozel[x.special]++);
        specials += res.create.length;
        const { board } = M.sonucUygula(bd, res);
        const g = M.yercekimi(board, ayar.ncolors);
        bd = g.board;
        tahtaGecerli(bd, `L${L} hamle sonrasi`);
      }
      kontrol(guvenlik < 100, 'sonsuz zincir');
      if (zincir - 1 >= 2) toplamKombo++;
      toplamHamle++;
      if (!M.ipucuBul(bd)) bd = M.karistir(bd, ayar.ncolors);
    }
    if (ayar.type === 'score' && score >= ayar.target) kazanilan++;
  }
}
console.log('Toplam hamle:', toplamHamle, 'kombo:', toplamKombo, 'ozel:', JSON.stringify(ozel));

// Denge icin: node araclar/denge-simulasyonu.js App.js

// Buz hedefi, kayittan yukleme denetimi
{
  const ayar = M.bolumAyari(5);
  kontrol(ayar.type === 'ice', '5. bolum buz hedefli olmali');
  const bd = M.tahtaOlustur(ayar);
  const obj = M.hedefOlustur(ayar, bd);
  kontrol(obj.target >= ayar.ice, 'buz hedefi buz sayisindan az');
  kontrol(M.tahtaGecerliMi(JSON.parse(JSON.stringify(bd))), 'kaydedilen tahta gecersiz sayildi');
  kontrol(!M.tahtaGecerliMi([[1]]), 'bozuk tahta gecerli sayildi');
  M.hedefIlerlet(obj, { pops: [], create: [], iceHits: Array(obj.target).fill([0, 0]) });
  kontrol(M.hedefTamam(obj, 0), 'buz hedefi tamamlanmadi');
  kontrol(M.yildizHesapla(10, 20) === 3 && M.yildizHesapla(3, 20) === 2 && M.yildizHesapla(0, 20) === 1, 'yildiz hesabi yanlis');
  for (let L = 1; L <= 80; L++) {
    const a = M.bolumAyari(L);
    kontrol(a.moves >= 15 && a.moves <= 40, `L${L} hamle sayisi tuhaf: ${a.moves}`);
    kontrol(a.type === 'ice' || a.target > 0, `L${L} hedef sifir`);
  }
}

// Ozel kombinasyon testleri
function sabitTahta(renkler) {
  return renkler.map((row) => row.map((col) => ({ gem: M.yeniTas(col), ice: 0, chain: false, stone: 0 })));
}
const desen = [
  [0, 1, 2, 3, 4, 0],
  [1, 2, 3, 4, 0, 1],
  [2, 3, 4, 0, 1, 2],
  [3, 4, 0, 1, 2, 3],
  [4, 0, 1, 2, 3, 4],
  [0, 1, 2, 3, 4, 0],
];
let t = sabitTahta(desen);
t[2][2].gem.special = 'colorbomb';
t[2][2].gem.color = -1;
let k = M.ozelKombo(t, { r: 2, c: 2 }, { r: 2, c: 3 });
let res = M.temizlikHesapla(k.board, k.plan);
kontrol(res.pops.length === 1 + desen.flat().filter((x) => x === 0).length, 'renk bombasi + normal tas yanlis sayi: ' + res.pops.length);
t = sabitTahta(desen);
t[1][1].gem.special = 'striped-h';
t[1][2].gem.special = 'striped-v';
k = M.ozelKombo(t, { r: 1, c: 1 }, { r: 1, c: 2 });
res = M.temizlikHesapla(k.board, k.plan);
kontrol(res.pops.length === 11, 'cizgili + cizgili 11 tas olmali: ' + res.pops.length);
// 4'lu eslesme cizgili tas olusturmali
t = sabitTahta(desen);
[0, 1, 2, 3].forEach((c) => (t[5][c].gem.color = 5));
let runs = M.eslesmeleriBul(t);
let plan = M.plandanEslesme(t, runs, []);
kontrol(plan.create.length === 1 && plan.create[0].special === 'striped-h', '4lu eslesme cizgili olusturmadi');
// L sekli bomba olusturmali
t = sabitTahta(desen);
t[3][0].gem.color = 5; t[4][0].gem.color = 5; t[5][0].gem.color = 5; t[5][1].gem.color = 5; t[5][2].gem.color = 5;
runs = M.eslesmeleriBul(t);
plan = M.plandanEslesme(t, runs, []);
kontrol(plan.create.length === 1 && plan.create[0].special === 'bomb', 'L sekli bomba olusturmadi: ' + JSON.stringify(plan.create));
// 5'li eslesme renk bombasi
t = sabitTahta(desen);
[0, 1, 2, 3, 4].forEach((c) => (t[5][c].gem.color = 5));
runs = M.eslesmeleriBul(t);
plan = M.plandanEslesme(t, runs, []);
kontrol(plan.create.length === 1 && plan.create[0].special === 'colorbomb', '5li eslesme renk bombasi olusturmadi');
// Zincirli tas: eslesmede zincir kirilir, tas kalir
t = sabitTahta(desen);
[0, 1, 2].forEach((c) => (t[5][c].gem.color = 5));
t[5][1].chain = true;
runs = M.eslesmeleriBul(t);
res = M.temizlikHesapla(t, M.plandanEslesme(t, runs, []));
kontrol(res.pops.length === 2 && res.chainBreaks.length === 1, 'zincir davranisi yanlis');
// Tas blok: yaninda eslesme olunca hasar alir ve yercekimi dogru calisir
t = sabitTahta(desen);
t[4][1].gem = null; t[4][1].stone = 1;
[0, 1, 2].forEach((c) => (t[5][c].gem.color = 5));
runs = M.eslesmeleriBul(t);
res = M.temizlikHesapla(t, M.plandanEslesme(t, runs, []));
kontrol(res.stoneHits.length === 1, 'tas blok hasar almadi');
let sonra = M.yercekimi(M.sonucUygula(t, res).board, 5).board;
tahtaGecerli(sonra, 'tas blok sonrasi');

console.log(hata === 0 ? 'TUM TESTLER GECTI' : `${hata} hata`);
