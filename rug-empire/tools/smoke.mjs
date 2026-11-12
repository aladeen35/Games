// End-to-end smoke test: plays one full job in a real browser and saves screenshots.
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright'); // preinstalled globally in the build environment
import { mkdirSync } from 'node:fs';
const out = process.env.SHOTS || 'shots'; mkdirSync(out, { recursive: true });
const url = process.env.URL || 'http://localhost:5173/';
const browser = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
const errors = [];
page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
page.on('console', (m) => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
const shot = (n) => page.screenshot({ path: `${out}/${n}.png` });
process.on('unhandledRejection', (e) => { console.log('FAILED:', e.message.split('\n')[0], '\n' + errors.join('\n')); process.exit(1); });
const click = async (sel) => { await page.locator(sel).first().click(); await page.waitForTimeout(250); };
await page.goto(url); await page.waitForSelector('.menu .btn'); await shot('01-lang');
await click(`.menu .btn >> nth=${process.env.LANGBTN || 0}`); await shot('02-menu');
await click('.menu .btn'); await page.waitForSelector('.modal .btn'); await shot('03-intro'); await click('.modal .btn'); await shot('04-hub');
await click('.card.order'); await shot('05-order'); await click('.modal .row .btn >> nth=2');
await page.waitForSelector('.toolbar'); await page.waitForTimeout(600); await shot('06-clean-start');
const box = await page.evaluate(() => { const c = document.querySelector('#gl').getBoundingClientRect(); return { w: c.width, h: c.height }; });
// sweep the rug area in rows with the given tool
async function sweep(slot, passes = 1, rows = 9) {
  if (process.env.QUICK) { passes = 1; rows = 3; }
  await click('#tool-' + slot);
  const x0 = box.w * 0.14, x1 = box.w * 0.86, y0 = box.h * 0.2, y1 = box.h * 0.7;
  for (let p = 0; p < passes; p++) {
    await page.mouse.move(x0, y0); await page.mouse.down();
    for (let r = 0; r <= rows; r++) { const y = y0 + (y1 - y0) * r / rows; await page.mouse.move(r % 2 ? x1 : x0, y, { steps: 2 }); await page.mouse.move(r % 2 ? x0 : x1, y, { steps: 22 }); }
    await page.mouse.up();
  }
}
await sweep('dry', 2); await shot('07-dusted');
await sweep('spray', 1); await sweep('chem', 1); await shot('08-soaped');
await sweep('brush', 3, 12); await shot('09-scrubbed');
await sweep('spray', 1); await sweep('extract', 3); await sweep('groom', 1); await shot('10-extracted');
await click('.icon-btn.go'); await shot('11-finish'); await click('.method');
await page.waitForSelector('.result', { timeout: 20000 }); await page.waitForTimeout(400); await shot('12-result');
console.log('score:', await page.locator('.ring b').textContent(), '| cats:', (await page.locator('.cat b').allTextContents()).join(' '));
await click('.result .btn'); await shot('13-pay');
if (await page.locator('.pay .btn.ghost').count()) await click('.pay .btn.ghost');
await click('.pay .btn:not(.ghost)'); await shot('14-receipt'); await click('.pay .btn'); await page.waitForSelector('.hub'); await shot('15-hub-after');
for (const [i, tab] of ['shop', 'market', 'business'].entries()) { await click(`.tabs button >> nth=${i + 1}`); await shot('16-' + tab); }
await click('.hub-btns .icon-btn'); await shot('17-showroom');
if (await page.locator('.gcard').count()) { await click('.gcard'); await page.waitForTimeout(800); await shot('18-show3d');
  if (await page.locator('.show-card .btn').count()) { await click('.show-card .btn'); await page.waitForTimeout(2500); await shot('19-timelapse'); } }
console.log(errors.length ? 'ERRORS:\n' + errors.join('\n') : 'no console errors');
await browser.close(); process.exit(errors.length ? 1 : 0);
