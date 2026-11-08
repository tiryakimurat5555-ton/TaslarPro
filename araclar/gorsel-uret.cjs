// game-icons.net SVG'lerinden src/ui/gorseller.js üretir (yalnız seçilen simgeler, yol verisi olarak).
// Kullanım: node araclar/gorsel-uret.cjs <game-icons-klasoru> araclar/gorsel-secim.txt
const fs = require('fs');
const path = require('path');
const [kok, secimDosyasi] = process.argv.slice(2);
const satirlar = fs.readFileSync(secimDosyasi, 'utf8').split('\n').map((s) => s.trim()).filter((s) => s && !s.startsWith('#'));
const cikti = {};
const yazarlar = new Set();
for (const s of satirlar) {
  const [ad, dosya] = s.split(/\s+/);
  if (cikti[ad]) continue;
  const svg = fs.readFileSync(path.join(kok, dosya + '.svg'), 'utf8');
  const yollar = [...svg.matchAll(/<path([^>]*)\/>/g)].map((m) => m[1]).filter((a) => !/d="M0 0h512v512H0z"/.test(a));
  const dler = yollar.map((a) => (a.match(/ d="([^"]+)"/) || [])[1]).filter(Boolean);
  if (!dler.length) throw new Error('yol yok: ' + dosya);
  cikti[ad] = dler.join(' ');
  yazarlar.add(dosya.split('/')[0]);
}
const metin =
  '// OTOMATİK ÜRETİLDİ — elle düzenleme: araclar/gorsel-uret.cjs ve araclar/gorsel-secim.txt\n' +
  '// Simgeler: game-icons.net (CC BY 3.0). Yazarlar: ' + [...yazarlar].sort().join(', ') + '\n' +
  '// Her simge 512×512 görünüm kutusunda tek renkli SVG yol verisidir.\n' +
  'export const GORSEL_YOLLARI = ' + JSON.stringify(cikti, null, 0).replace(/","/g, '",\n  "').replace(/^\{/, '{\n  ').replace(/\}$/, ',\n}') + ';\n' +
  'export const GORSEL_YAZARLARI = ' + JSON.stringify([...yazarlar].sort()) + ';\n';
fs.writeFileSync('src/ui/gorseller.js', metin);
console.log(Object.keys(cikti).length, 'simge,', (metin.length / 1024).toFixed(0), 'KB');
