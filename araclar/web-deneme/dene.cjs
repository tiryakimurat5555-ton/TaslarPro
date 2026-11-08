// Diyarın Kaderi'ni Chromium'da baştan oynar: yeni oyun, hikaye, isim, 5 sekme, dövüş, dükkan, han, görev, gün, kayıttan devam.
// Kullanım: bash araclar/web-deneme/yap.sh /tmp/claude-0/web && NODE_PATH=/opt/npm-tools/node_modules node araclar/web-deneme/dene.cjs /tmp/claude-0/web /tmp/claude-0/ekran
const { chromium } = require('playwright');
const fs = require('fs');
const O = process.argv[3] || '/tmp/claude-0/ekran'; fs.mkdirSync(O, { recursive: true });
(async () => {
  const b = await chromium.launch(); const c = await b.newContext({ viewport: { width: 390, height: 844 } });
  const s = await c.newPage(); const h = []; s.on('pageerror', e => h.push('PE ' + e.message + ' ' + (e.stack||'').split('\n').slice(1,3).join(' '))); s.on('console', m => m.type()==='error' && h.push('CE ' + m.text().slice(0,300)));
  await s.goto('file://' + require('path').resolve(process.argv[2] || '/tmp/claude-0/web') + '/index.html'); await s.waitForTimeout(1200);
  const et = async () => (await s.$$eval('[aria-label]', els => els.filter(e=>e.offsetParent!==null || e.getClientRects().length).map(e => e.getAttribute('aria-label')))) ;
  const tik = async (bas) => { const l = s.locator(`[aria-label^="${bas}"]`).first(); if (!(await l.count())) { console.log('YOK:', bas); return false; } try { await l.click({ timeout: 3000 }); } catch (e) { console.log('TIKLANAMADI:', bas.slice(0,60)); await l.click({ force: true, timeout: 3000 }).catch(()=>{}); } await s.waitForTimeout(400); return true; };
  const adim = async (ad) => { await s.screenshot({ path: `${O}/${ad}.png` }); console.log('\n##', ad, '\n', (await et()).slice(0,60).map(x=>x.slice(0,70)).join(' | ')); if (h.length) { console.log('HATALAR:', h.splice(0).slice(0,5).join('\n')); } };
  await tik('Yeni Oyun'); await adim('1-hikaye');
  for (let i = 0; i < 8; i++) { const labels = await et(); const n = labels.find(x => /^Sonraki|^Kırlangıç Arenasına/i.test(x)); console.log('sayfa:', labels.slice(0,4).map(x=>x.slice(0,50)).join(' / ')); if (!n) break; await tik(n); }
  await adim('2-isim');
  const f = s.locator('input').first(); if (await f.count()) { await f.fill('Deneme'); }
  const lbl = (await et()).find(x => /(onayla|Onayla|Başla|başla)/.test(x)); console.log('onay:', lbl); if (lbl) await tik(lbl);
  await s.waitForTimeout(800); await adim('3-oyun');
  for (const sekme of ['Ev', 'Arena', 'Bölge', 'Görevler', 'Çanta']) { await tik(sekme); await s.waitForTimeout(500); await adim('4-' + sekme); }

  const yaz = async (ad) => { console.log('\n##', ad, (await et()).slice(0,40).map(x=>x.slice(0,60)).join(' | ')); console.log('duyuru:', (await s.evaluate(()=>window.__duyurular.splice(0).slice(-6).join(' // '))).slice(0,600)); if (h.length) console.log('HATALAR:', h.splice(0).slice(0,5).join('\n')); await s.screenshot({ path: `${O}/${ad}.png` }); };
  await tik('Arena'); await tik('⚔️ KURADAKİ RAKİPLE'); for (let i=0;i<40;i++){ await s.waitForTimeout(3000); const l=(await et()).join('|'); if (/ZAFER|YENİLGİ|Zafer|Yenilgi|Mağlubiyet|Galibiyet/.test(l) && !/Hamle \d+: .*$/.test('')) { if (!(await s.evaluate(()=>!!document.querySelector('[aria-label*="Can durumu"]')))) break; } } await yaz('5-dovus');
  const kapat = (await et()).find(x => /Kapat|Tamam|Devam|Arenadan|Zafer|Ayrıl/.test(x)); console.log('kapat:', kapat); if (kapat) await tik(kapat);
  await yaz('5b-dovus-sonrasi');
  await tik('Bölge'); await tik('Demirci Vorn'); await s.waitForTimeout(500); await yaz('6-demirci');
  const al = (await et()).find(x => /^Satın Al/.test(x)); console.log('al:', al); if (al) await tik(al); await yaz('6b-satin');
  await tik('Ayrıl'); await tik('İsli Kandil Hanı'); await yaz('7-han');
  const zar = (await et()).find(x => /^Zar at/.test(x)); if (zar) { await tik(zar); await yaz('7b-zar'); }
  await tik('Görevler'); await tik('Sözleşmeyi Başlat'); await yaz('8-gorev');
  await s.waitForTimeout(22000); await tik('Görevler'); await tik('Ödülleri Al'); await s.waitForTimeout(800); await yaz('8b-odul');
  await tik('Ödülleri Çantaya Al'); await s.waitForTimeout(500); await yaz('8c-odul-kapandi');
  await tik('Ev'); await tik('İstirahat'); await s.waitForTimeout(6000); await yaz('9-gun');
  await s.reload(); await s.waitForTimeout(1500); await yaz('10-yeniden');
  await tik('Kayıtlı oyuna'); await s.waitForTimeout(800); await yaz('11-devam');
  fs.writeFileSync('' + O + '/hatalar.txt', h.join('\n'));
  await b.close();
})();
