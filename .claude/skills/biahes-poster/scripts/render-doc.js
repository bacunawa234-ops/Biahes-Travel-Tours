// Usage: node render-doc.js <itinerary.html> <outDir> [scale]
const path = require('path');
const { chromium } = require('playwright');
(async () => {
  const [html, outDir, scale] = process.argv.slice(2);
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 794, height: 1123 }, deviceScaleFactor: Number(scale || 1) });
  await p.goto('file://' + path.resolve(html));
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(300);
  await p.pdf({ path: path.join(outDir, 'Biahes-Sample-Itinerary.pdf'), format: 'A4', printBackground: true, preferCSSPageSize: true });
  const pages = await p.$$('section.page');
  for (let i = 0; i < pages.length; i++) await pages[i].screenshot({ path: path.join(outDir, `Biahes-Itinerary-page-${i + 1}.png`) });
  const of = await p.$$eval('section.page', ps => ps.map((s, i) => {
    const r = s.getBoundingClientRect(); let m = 0;
    s.querySelectorAll('.body > *').forEach(e => { m = Math.max(m, e.getBoundingClientRect().bottom - r.top); });
    return `p${i + 1} content bottom ${Math.round(m)} / limit ${Math.round(r.height) - 45}`;
  }));
  console.log(of.join('\n'));
  await b.close();
})();
