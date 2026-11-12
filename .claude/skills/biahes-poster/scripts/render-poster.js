// Renders a poster HTML file to PNG at 1.5x (1920px wide) for Facebook.
// Usage: node render-poster.js <poster.html> <out.png>
const path = require('path');
const { chromium } = require('playwright');
(async () => {
  const [html, out] = process.argv.slice(2).map(p => path.resolve(p));
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 1000 }, deviceScaleFactor: 1.5 });
  await page.goto('file://' + html);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(300);
  await page.screenshot({ path: out, fullPage: true });
  console.log('saved', out, 'css height', await page.evaluate(() => document.body.scrollHeight));
  await browser.close();
})();
