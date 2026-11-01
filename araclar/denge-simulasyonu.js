// Zorluk dengesi simulasyonu: App.js icindeki oyun mantigini ve bolumAyari'ni kullanir.
// Kullanim: node araclar/denge-simulasyonu.js App.js [ilkBolum] [sonBolum] [oyunSayisi]
// Simule oyuncu cogunlukla en cok tas patlatan / hedefe en cok katki yapan hamleyi secer,
// %25 olasilikla rastgele oynar. Gercek oyuncu ipucu ve bonuslarla daha iyi oynar.
const fs = require('fs');
const src = fs.readFileSync(process.argv[2], 'utf8');
const kod = src.slice(src.indexOf('// ==== MANTIK BASLANGIC ===='), src.indexOf('// ==== MANTIK BITIS ===='));
const M = new Function(
  kod +
    '\nreturn {N, bolumAyari, tahtaOlustur, eslesmeleriBul, plandanEslesme, temizlikHesapla, sonucUygula, yercekimi, ipucuBul, karistir, ozelKombo, hamleGecerliMi, takasla, tahtaKopyala, puanHesapla, hedefOlustur, hedefIlerlet, hedefTamam, yildizHesapla, kirazTopla, kirazEkle, kirazMi};'
)();

const ilk = +(process.argv[3] || 1);
const son = +(process.argv[4] || 40);
const OYUN = +(process.argv[5] || 40);

function hamleler(bd) {
  const h = [];
  for (let r = 0; r < M.N; r++)
    for (let c = 0; c < M.N; c++) {
      if (c + 1 < M.N && M.hamleGecerliMi(bd, { r, c }, { r, c: c + 1 })) h.push([{ r, c }, { r, c: c + 1 }]);
      if (r + 1 < M.N && M.hamleGecerliMi(bd, { r, c }, { r: r + 1, c })) h.push([{ r, c }, { r: r + 1, c }]);
    }
  return h;
}

function degerlendir(bd, a, b, obj) {
  const t = M.tahtaKopyala(bd);
  M.takasla(t, a, b);
  const k = M.ozelKombo(t, a, b);
  const tb = k ? k.board : t;
  const plan = k ? k.plan : M.plandanEslesme(tb, M.eslesmeleriBul(tb), [a, b]);
  const res = M.temizlikHesapla(tb, plan);
  let p = res.pops.length + res.create.length * 4 + res.iceHits.length * 2 + res.chainBreaks.length + res.stoneHits.length * 2;
  if (obj.type === 'color') p += res.pops.filter((x) => x.color === obj.color).length * 2;
  if (obj.type === 'special') p += res.create.length * 6;
  if (obj.type === 'ice') p += res.iceHits.length * 3;
  if (obj.type === 'drop') {
    // kirazi asagi indiren takaslar ve kirazin altini bosaltan patlamalar
    if (M.kirazMi(tb[b.r][b.c].gem) && b.r > a.r) p += 4;
    if (M.kirazMi(tb[a.r][a.c].gem) && a.r > b.r) p += 4;
    for (let c = 0; c < M.N; c++) {
      let kirazSatir = -1;
      for (let r = 0; r < M.N; r++) if (M.kirazMi(tb[r][c].gem)) kirazSatir = r;
      if (kirazSatir >= 0) p += res.pops.filter((x) => x.c === c && x.r > kirazSatir).length * 2;
    }
  }
  // alttaki hamleler daha cok kaskad getirir
  p += Math.max(a.r, b.r) * 0.15;
  return p;
}

function oyna(L) {
  const ayar = M.bolumAyari(L);
  let bd = M.tahtaOlustur(ayar);
  const obj = M.hedefOlustur(ayar, bd);
  let score = 0;
  let kalan = ayar.moves;
  while (kalan > 0) {
    const h = hamleler(bd);
    if (!h.length) {
      bd = M.karistir(bd, ayar.ncolors);
      continue;
    }
    let sec;
    if (Math.random() < 0.25) sec = h[Math.floor(Math.random() * h.length)];
    else {
      let en = -1;
      for (const m of h) {
        const d = degerlendir(bd, m[0], m[1], obj) + Math.random() * 0.5;
        if (d > en) {
          en = d;
          sec = m;
        }
      }
    }
    const [a, b] = sec;
    kalan--;
    bd = M.tahtaKopyala(bd);
    M.takasla(bd, a, b);
    const k = M.ozelKombo(bd, a, b);
    if (k) bd = k.board;
    let ilkAdim = true;
    let z = 0;
    while (true) {
      z++;
      let plan;
      if (ilkAdim && k) plan = k.plan;
      else {
        const runs = M.eslesmeleriBul(bd);
        if (!runs.length) break;
        plan = M.plandanEslesme(bd, runs, ilkAdim ? [a, b] : []);
      }
      ilkAdim = false;
      const res = M.temizlikHesapla(bd, plan);
      if (!res.pops.length && !res.chainBreaks.length && !res.stoneHits.length) break;
      score += M.puanHesapla(res, z, false);
      M.hedefIlerlet(obj, res);
      bd = M.yercekimi(M.sonucUygula(bd, res).board, ayar.ncolors).board;
      for (;;) {
        const t = M.kirazTopla(bd);
        if (!t.toplanan.length) break;
        obj.current += t.toplanan.length;
        bd = M.yercekimi(t.board, ayar.ncolors).board;
      }
      bd = M.kirazEkle(bd, obj).board;
    }
    if (!M.ipucuBul(bd)) bd = M.karistir(bd, ayar.ncolors);
    if (M.hedefTamam(obj, score)) return { ok: true, kalan, yildiz: M.yildizHesapla(kalan, ayar.moves) };
  }
  return { ok: false, kalan: 0, yildiz: 0 };
}

for (let L = ilk; L <= son; L++) {
  const ayar = M.bolumAyari(L);
  let ok = 0;
  let kalanTop = 0;
  const yil = [0, 0, 0, 0];
  for (let i = 0; i < OYUN; i++) {
    const s = oyna(L);
    if (s.ok) {
      ok++;
      kalanTop += s.kalan;
    }
    yil[s.yildiz]++;
  }
  const hedef = ayar.type === 'score' ? `${ayar.target} puan` : ayar.type === 'ice' ? 'tum buz' : ayar.type === 'drop' ? `${ayar.target} kiraz` : `${ayar.target} ${ayar.type}`;
  console.log(
    `B${String(L).padStart(2)} ${ayar.type.padEnd(7)} renk ${ayar.ncolors} hamle ${String(ayar.moves).padStart(2)} hedef ${hedef.padEnd(12)} buz ${ayar.ice} zincir ${ayar.chains} blok ${ayar.stones} | basari %${String(Math.round((ok / OYUN) * 100)).padStart(3)} ort.kalan ${ok ? (kalanTop / ok).toFixed(1) : '-'} yildiz1/2/3 ${yil[1]}/${yil[2]}/${yil[3]}`
  );
}
