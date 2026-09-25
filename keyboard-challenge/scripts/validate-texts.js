// يتحقق من ملفات النصوص: العدد، الطول، والحروف القابلة للكتابة من الكيبورد العربي.
// الاستخدام: node scripts/validate-texts.js [category]
import { readdirSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { join } from 'node:path';

const DIR = fileURLToPath(new URL('../shared/texts/', import.meta.url));
export const RULES = {
  short:   { count: 30, min: 15,  max: 90 },
  long:    { count: 30, min: 130, max: 420 },
  article: { count: 30, min: 450, max: 1100 },
};
// حروف عربية بلا تشكيل ولا تطويل، أرقام لاتينية، ومسافة وعلامات ترقيم سهلة.
const ALLOWED = /^[ء-غف-ي0-9 ،؛؟.!:]+$/u;

export function validateText(t) {
  const errs = [];
  if (typeof t !== 'string') return ['ليس نصًا'];
  if (!ALLOWED.test(t)) {
    const bad = [...new Set([...t].filter((c) => !ALLOWED.test(c)))].map((c) => `«${c}» U+${c.codePointAt(0).toString(16)}`);
    errs.push(`حروف غير مسموحة: ${bad.join(' ')}`);
  }
  if (/\s{2,}/.test(t)) errs.push('مسافتان متتاليتان');
  if (t !== t.trim()) errs.push('مسافة في البداية أو النهاية');
  if (/ [،؛؟.!:]/.test(t)) errs.push('مسافة قبل علامة ترقيم');
  return errs;
}

export async function validateCategory(file) {
  const mod = await import(pathToFileURL(join(DIR, file)).href);
  const data = mod.default;
  const problems = [];
  if (!data?.id || !data?.label) problems.push('id و label مطلوبان');
  for (const [kind, rule] of Object.entries(RULES)) {
    const list = data[kind];
    if (!Array.isArray(list)) { problems.push(`${kind}: غير موجود`); continue; }
    if (list.length !== rule.count) problems.push(`${kind}: العدد ${list.length} والمطلوب ${rule.count}`);
    const seen = new Set();
    list.forEach((item, i) => {
      const text = typeof item === 'string' ? item : item?.text;
      const where = `${kind}[${i}]`;
      if (kind === 'article' && !(item?.title)) problems.push(`${where}: عنوان مفقود`);
      if (item?.title && /[^ء-غف-ي0-9 ،؛؟.!:]/u.test(item.title)) problems.push(`${where}: حروف غير مسموحة في العنوان`);
      for (const e of validateText(text)) problems.push(`${where}: ${e}`);
      const len = [...(text || '')].length;
      if (len < rule.min || len > rule.max) problems.push(`${where}: الطول ${len} خارج ${rule.min}-${rule.max}`);
      if (seen.has(text)) problems.push(`${where}: مكرر`);
      seen.add(text);
    });
  }
  return problems;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const only = process.argv[2];
  const files = readdirSync(DIR).filter((f) => f.endsWith('.js') && f !== 'index.js' && (!only || f === `${only}.js`));
  let bad = 0;
  for (const f of files) {
    const p = await validateCategory(f);
    if (p.length) { bad += p.length; console.log(`✗ ${f}: ${p.length} مشكلة`); p.slice(0, 60).forEach((x) => console.log('   ', x)); }
    else console.log(`✓ ${f}`);
  }
  if (!files.length) { console.log('لا توجد ملفات'); process.exit(1); }
  process.exit(bad ? 1 : 0);
}
