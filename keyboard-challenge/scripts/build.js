// البناء: ينسخ الواجهة والمنطق المشترك إلى dist/ — جاهز لاستضافة ثابتة أو لـ `pnpm start:dist`.
import { cpSync, rmSync, mkdirSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const DIST = join(ROOT, 'dist');

rmSync(DIST, { recursive: true, force: true });
mkdirSync(DIST, { recursive: true });
cpSync(join(ROOT, 'public'), DIST, { recursive: true });
cpSync(join(ROOT, 'shared'), join(DIST, 'shared'), { recursive: true });
writeFileSync(join(DIST, 'build.json'), JSON.stringify({ builtAt: new Date().toISOString() }, null, 2));

let count = 0; let bytes = 0;
(function walk(d) {
  for (const n of readdirSync(d)) {
    const p = join(d, n);
    const s = statSync(p);
    if (s.isDirectory()) walk(p); else { count++; bytes += s.size; }
  }
})(DIST);
console.log(`✓ dist/ جاهز: ${count} ملف، ${(bytes / 1024).toFixed(0)} KB`);
