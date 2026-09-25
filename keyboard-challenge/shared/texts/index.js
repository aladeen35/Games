// فهرس النصوص: الفئات وأنواع النصوص ومعرّفاتها «الفئة:النوع:الرقم».
import sudanese from './sudanese.js';
import general from './general.js';
import motivation from './motivation.js';
import islamic from './islamic.js';
import quality from './quality.js';

export const CATEGORIES = [
  { id: 'sudanese', label: 'ألغاز وحكم ومقولات سودانية', short: 'حكم سودانية', icon: '🌴', desc: 'أمثال وأحاجي وحكاوي من السودان', data: sudanese },
  { id: 'general', label: 'معلومات عامة', short: 'معلومات عامة', icon: '🌍', desc: 'علوم وجغرافيا وتاريخ ومعرفة', data: general },
  { id: 'motivation', label: 'جمل تشجيعية', short: 'تشجيعية', icon: '💪', desc: 'كلام يشد الحيل ويرفع الهمة', data: motivation },
  { id: 'islamic', label: 'جمل إسلامية وأحاديث', short: 'إسلامية', icon: '🕌', desc: 'أحاديث كاملة بلا رواة وأذكار ومقالات', data: islamic },
  { id: 'quality', label: 'الجودة للجميع', short: 'الجودة للجميع', icon: '🥗', desc: 'معلومات عامة عن جودة وسلامة الغذاء', data: quality },
];

export const KINDS = [
  { id: 'short', label: 'جمل بسيطة', icon: '✏️', desc: 'جملة قصيرة وسريعة' },
  { id: 'long', label: 'جمل طويلة', icon: '📜', desc: 'من 3 إلى 5 سطور' },
  { id: 'article', label: 'مقالات وقصص قصيرة', icon: '📖', desc: 'نص كامل لعشاق التحدي' },
];

export const MIX = 'mix'; // «عشوائي»: كل الفئات

const BY_ID = new Map(CATEGORIES.map((c) => [c.id, c]));

export const isCategory = (c) => BY_ID.has(c);
export const isKind = (k) => KINDS.some((x) => x.id === k);

export function categoryMeta(id) { return BY_ID.get(id) || null; }
export function kindMeta(id) { return KINDS.find((k) => k.id === id) || null; }

function normItem(item) {
  return typeof item === 'string' ? { text: item } : item;
}

export function listTexts(category, kind) {
  return BY_ID.get(category)?.data[kind] ?? [];
}

export function textCount(category, kind) {
  return listTexts(category, kind).length;
}

export function makeTextId(category, kind, index) {
  return `${category}:${kind}:${index}`;
}

/** يعيد النص من معرّفه أو null إن لم يوجد. */
export function getText(textId) {
  const [category, kind, idxStr] = String(textId ?? '').split(':');
  const index = Number(idxStr);
  if (!isCategory(category) || !isKind(kind) || !Number.isInteger(index)) return null;
  const raw = listTexts(category, kind)[index];
  if (!raw) return null;
  const item = normItem(raw);
  return { id: makeTextId(category, kind, index), category, kind, index, text: item.text, title: item.title || '', source: item.source || '' };
}

/** نص عشوائي من فئة (أو من كل الفئات عند «عشوائي»). */
export function randomTextId(category, kind, rand = Math.random) {
  const cat = category === MIX || !isCategory(category)
    ? CATEGORIES[Math.floor(rand() * CATEGORIES.length)].id
    : category;
  const n = textCount(cat, kind);
  return makeTextId(cat, kind, Math.floor(rand() * n));
}

export function allTextIds(category, kind) {
  const cats = category === MIX || !isCategory(category) ? CATEGORIES.map((c) => c.id) : [category];
  return cats.flatMap((c) => listTexts(c, kind).map((_, i) => makeTextId(c, kind, i)));
}
