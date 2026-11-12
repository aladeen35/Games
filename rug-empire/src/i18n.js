// Three languages with a fallback chain ar-SD -> ar -> en. Interface language and dialogue language
// are separate settings; dialogue can carry a subtitle line in a second language.
import { STR } from './strings.js';
export const LANGS = ['ar', 'ar-SD', 'en'];
const IDX = { ar: 0, 'ar-SD': 1, en: 2 };
const CHAIN = { ar: [0, 2], 'ar-SD': [1, 0, 2], en: [2, 0] };
export const L = { ui: 'ar', dlg: 'ar-SD', sub: 'off', digits: 'latn' };
export function setLang(o) {
  Object.assign(L, o);
  if (typeof document !== 'undefined') { document.documentElement.lang = L.ui; document.documentElement.dir = L.ui === 'en' ? 'ltr' : 'rtl'; }
}
export const isRTL = () => L.ui !== 'en';
function lookup(key, lang) {
  const e = STR[key]; if (!e) return null;
  for (const i of CHAIN[lang]) if (e[i]) return e[i];
  return null;
}
function fill(s, vars) { return vars ? s.replace(/\{(\w+)\}/g, (m, k) => (vars[k] !== undefined ? vars[k] : m)) : s; }
export function tl(lang, key, vars) { const s = lookup(key, lang); return s === null ? key : fill(s, vars); }
export const t = (key, vars) => tl(L.ui, key, vars);
export const has = (key) => !!STR[key];
// Dialogue line in the dialogue language, plus an optional subtitle in another language.
export function d(key, vars) {
  const text = tl(L.dlg, key, vars);
  const sub = L.sub !== 'off' && L.sub !== L.dlg ? tl(L.sub, key, vars) : null;
  return { text, sub: sub && sub !== text ? sub : null, rtl: L.dlg !== 'en' };
}
const AR_DIGITS = '٠١٢٣٤٥٦٧٨٩';
export function num(n, dec = 0) {
  let s = Number(n).toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec });
  if (L.ui !== 'en' && L.digits === 'arab') s = s.replace(/\d/g, (c) => AR_DIGITS[c]).replace(/,/g, '٬').replace('.', '٫');
  return s;
}
export const sdg = (n) => (L.ui === 'en' ? `SDG ${num(n)}` : `${num(n)} ج.س`);
// Arabic plural categories (one / two / few 3-10 / many 11+); English one / other.
export function plural(n, base) {
  let form = 'many';
  if (L.ui === 'en') form = n === 1 ? 'one' : 'many';
  else if (n === 1) form = 'one'; else if (n === 2) form = 'two'; else if (n % 100 >= 3 && n % 100 <= 10) form = 'few';
  return t(`${base}.${form}`, { n: num(n) });
}
export function dateStr(date) {
  const loc = L.ui === 'en' ? 'en-GB' : 'ar-EG';
  const nu = L.ui !== 'en' && L.digits === 'arab' ? 'arab' : 'latn';
  try {
    const g = new Intl.DateTimeFormat(`${loc}-u-nu-${nu}`, { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(date);
    const hj = new Intl.DateTimeFormat(`${L.ui === 'en' ? 'en' : 'ar-SA'}-u-ca-islamic-umalqura-nu-${nu}`, { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(date);
    return { g, h: hj };
  } catch { return { g: date.toISOString().slice(0, 10), h: '' }; }
}
