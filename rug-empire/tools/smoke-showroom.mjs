// Seeds one finished rug + its recorded moves, then checks the 3D showroom and the time-lapse replay.
import { createRequire } from 'node:module';
import { mkdirSync } from 'node:fs';
import { TOOLS } from '../src/content.js';
const { chromium } = createRequire(import.meta.url)('playwright');
const out = process.env.SHOTS || 'shots'; mkdirSync(out, { recursive: true });
const spec = { seed: 11, sizeKey: 'small', w: 1.2, h: 1.7, material: 'wool', pattern: 'medallion', dust: 0.6, soil: 0.6, deep: 0.3, stains: [{ type: 'tea', u: 0.5, v: 0.5, r: 0.2, sev: 0.9 }], unstable: false };
const tools = { dry: { ...TOOLS.beater, id: 'beater' }, spray: { ...TOOLS.bucket, id: 'bucket' }, chem: { ...TOOLS.chem, id: 'chem' }, brush: { ...TOOLS.brush, id: 'brush' }, extract: { ...TOOLS.squeegee, id: 'squeegee' }, groom: { ...TOOLS.comb, id: 'comb' } };
const ev = [];
const pass = (slot, n = 1) => { ev.push({ slot }); for (let k = 0; k < n; k++) for (let y = 0; y <= 170; y += 12) for (let x = 0; x <= 120; x += 4) ev.push([k % 2 ? 120 - x : x, y]); };
pass('dry', 2); pass('spray'); pass('chem'); pass('brush', 3); pass('spray'); pass('extract', 2); pass('groom');
const rec = { tools, ev, dry: { method: 'shade', temp: 1, humid: 0.2, hours: 5 } };
const png = 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==';
const entry = { id: 'rtest', seed: 11, spec, pattern: 'medallion', material: 'wool', sizeCm: { w: 120, h: 170 }, ownership: 'customer', before: png, after: png,
  score: { total: 96, stars: 5, clean: 29, safety: 20, coverage: 14, time: 10, resources: 9, instr: 10, site: 4 }, stats: { minutes: 4.2, waterL: 18 },
  customer: { g: 'f', name: 2, arch: 'collector' }, completedAt: { gameDay: 3, season: 'cool', gregorian: '2027-01-07', hijri: { y: 1448, m: 7, d: 29 } }, status: 'gallery' };
const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const p = await b.newPage({ viewport: { width: 390, height: 844 } }); const errors = [];
p.on('pageerror', (e) => errors.push(e.message)); p.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
await p.addInitScript(([e, r]) => { localStorage.setItem('rugempire.settings', JSON.stringify({ first: false })); localStorage.setItem('rugempire.gallery', JSON.stringify([e])); localStorage.setItem('rugempire.replay.rtest', JSON.stringify(r)); }, [entry, rec]);
await p.goto(process.env.URL || 'http://localhost:5173/'); await p.waitForSelector('.menu .btn');
await p.locator('.menu .btn.ghost').first().click(); await p.waitForSelector('.gcard'); await p.screenshot({ path: `${out}/s1-showroom.png` });
await p.locator('.gcard').click(); await p.waitForTimeout(1500); await p.screenshot({ path: `${out}/s2-rug.png` });
await p.locator('.show-card .btn').first().click(); await p.waitForTimeout(8000); await p.screenshot({ path: `${out}/s3-timelapse.png` });
await p.waitForTimeout(20000); await p.screenshot({ path: `${out}/s4-timelapse-late.png` });
console.log('timelapse progress:', await p.locator('.tl-bar i').getAttribute('style'));
console.log(errors.length ? 'ERRORS:\n' + errors.join('\n') : 'no console errors'); await b.close(); process.exit(errors.length ? 1 : 0);
