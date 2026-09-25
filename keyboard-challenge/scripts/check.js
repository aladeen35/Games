// فحوصات سريعة: صياغة ملفات JS، تطابق المعرّفات بين HTML و app.js، وتباين الألوان.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, extname, relative } from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
let failures = 0;
const fail = (msg) => { failures++; console.error(`✗ ${msg}`); };
const ok = (msg) => console.log(`✓ ${msg}`);

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (['node_modules', 'dist', 'data', '.git'].includes(name)) continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out); else out.push(p);
  }
  return out;
}

// 1) صياغة JavaScript
const jsFiles = walk(ROOT).filter((f) => extname(f) === '.js');
for (const f of jsFiles) {
  try { execFileSync(process.execPath, ['--check', f], { stdio: 'pipe' }); }
  catch (e) { fail(`خطأ صياغة في ${relative(ROOT, f)}\n${e.stderr}`); }
}
ok(`صياغة ${jsFiles.length} ملف JavaScript`);

// 2) كل معرّف يستخدمه app.js عبر $('id') موجود في index.html
const html = readFileSync(join(ROOT, 'public/index.html'), 'utf8');
const app = readFileSync(join(ROOT, 'public/app.js'), 'utf8');
const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
const used = [...app.matchAll(/\$\('([^']+)'\)/g)].map((m) => m[1]);
const missing = used.filter((id) => !ids.has(id));
if (missing.length) fail(`معرّفات مفقودة في index.html: ${missing.join(', ')}`);
else ok(`${used.length} معرّفًا في app.js موجودة في index.html`);

// 3) الملفات المشار إليها من index.html موجودة
for (const m of html.matchAll(/(?:src|href)="([^"#:?]+)"/g)) {
  const ref = m[1];
  if (ref.startsWith('/') || ref === '') continue;
  try { statSync(join(ROOT, 'public', ref)); } catch { fail(`ملف مفقود: ${ref}`); }
}
ok('الأصول المرتبطة من index.html موجودة');

// 4) تباين الألوان (WCAG AA): 4.5 للنص العادي
const css = readFileSync(join(ROOT, 'public/styles.css'), 'utf8');
const token = (name) => {
  const m = css.match(new RegExp(`--${name}:\\s*(#[0-9A-Fa-f]{6})`));
  if (!m) throw new Error(`لون غير معرف: --${name}`);
  return m[1];
};
const lum = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};
const PAIRS = [
  ['text', 'night'], ['text', 'card'], ['text', 'card-2'],
  ['muted', 'night'], ['muted', 'card'], ['muted', 'card-2'],
  ['sand', 'night'], ['sand', 'card'], ['green', 'night'], ['green', 'card'],
  ['wrong-text', 'night'], ['wrong-text', 'card'],
  ['on-sand', 'sand'], ['on-green', 'green'],
];
for (const [fg, bg] of PAIRS) {
  const c = contrast(token(fg), token(bg));
  if (c < 4.5) fail(`تباين منخفض: --${fg} على --${bg} = ${c.toFixed(2)}`);
}
ok(`تباين ${PAIRS.length} زوجًا من الألوان ≥ 4.5:1`);

if (failures) { console.error(`\n${failures} فحص فشل`); process.exit(1); }
console.log('\nكل الفحوصات السريعة نجحت ✔');
