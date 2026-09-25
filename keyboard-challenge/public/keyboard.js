// الكيبورد العربي المرئي (تخطيط Arabic 101) مع إبراز الحرف التالي.

// كل مفتاح: [الحرف الأساسي، الحرف مع Shift]
const ROWS = [
  [['ذ', 'ّ'], ['١', '!'], ['٢', '@'], ['٣', '#'], ['٤', '$'], ['٥', '%'], ['٦', '^'], ['٧', '&'], ['٨', '*'], ['٩', ')'], ['٠', '('], ['-', '_'], ['=', '+']],
  [['ض', 'َ'], ['ص', 'ً'], ['ث', 'ُ'], ['ق', 'ٌ'], ['ف', 'لإ'], ['غ', 'إ'], ['ع', '‘'], ['ه', '÷'], ['خ', '×'], ['ح', '؛'], ['ج', '<'], ['د', '>']],
  [['ش', 'ِ'], ['س', 'ٍ'], ['ي', ']'], ['ب', '['], ['ل', 'لأ'], ['ا', 'أ'], ['ت', 'ـ'], ['ن', '،'], ['م', '/'], ['ك', ':'], ['ط', '"']],
  [['ئ', '~'], ['ء', 'ْ'], ['ؤ', '}'], ['ر', '{'], ['لا', 'لآ'], ['ى', 'آ'], ['ة', '’'], ['و', ','], ['ز', '.'], ['ظ', '؟']],
];

const keyMap = new Map(); // الحرف → { el, shift }

export function buildKeyboard(root, onKey) {
  root.textContent = '';
  keyMap.clear();
  let shiftLatched = false;
  const shiftEls = [];

  const mkKey = (label, cls = '', shiftCh = '') => {
    const b = document.createElement('button');
    b.type = 'button';
    b.tabIndex = -1;
    b.className = `key ${cls}`.trim();
    b.textContent = label;
    if (shiftCh) {
      const s = document.createElement('span');
      s.className = 'shift-ch';
      s.textContent = shiftCh;
      b.append(s);
    }
    return b;
  };

  ROWS.forEach((row, r) => {
    const rowEl = document.createElement('div');
    rowEl.className = 'vkb-row';
    if (r === 3) {
      const sh = mkKey('Shift', 'wide shift');
      shiftEls.push(sh);
      rowEl.append(sh);
    }
    for (const [base, shifted] of row) {
      const el = mkKey(base, '', shifted);
      el.dataset.base = base;
      el.dataset.shift = shifted;
      if (!keyMap.has(base)) keyMap.set(base, { el, shift: false });
      if (shifted && !keyMap.has(shifted)) keyMap.set(shifted, { el, shift: true });
      rowEl.append(el);
    }
    if (r === 3) {
      const sh = mkKey('Shift', 'wide shift');
      shiftEls.push(sh);
      rowEl.append(sh);
    }
    root.append(rowEl);
  });

  const spaceRow = document.createElement('div');
  spaceRow.className = 'vkb-row';
  const space = mkKey('مسافة', 'space');
  space.dataset.base = ' ';
  keyMap.set(' ', { el: space, shift: false });
  spaceRow.append(space);
  const back = mkKey('⌫ مسح', 'wide');
  back.dataset.action = 'back';
  keyMap.set('\b', { el: back, shift: false });
  spaceRow.append(back);
  root.append(spaceRow);

  // الضغط بالمؤشر يكتب في خانة الإدخال (مفيد للتجربة على الشاشات اللمسية الكبيرة).
  root.addEventListener('pointerdown', (e) => {
    const k = e.target.closest('.key');
    if (!k) return;
    e.preventDefault();
    if (k.classList.contains('shift')) {
      shiftLatched = !shiftLatched;
      shiftEls.forEach((s) => s.classList.toggle('next', shiftLatched));
      return;
    }
    if (k.dataset.action === 'back') { onKey({ back: true }); return; }
    const ch = shiftLatched && k.dataset.shift ? k.dataset.shift : k.dataset.base;
    if (shiftLatched) {
      shiftLatched = false;
      shiftEls.forEach((s) => s.classList.remove('next'));
    }
    if (ch) onKey({ ch });
  });

  return { shiftEls };
}

let lastNext = [];

/** إبراز مفتاح الحرف التالي (ومفتاح Shift إن لزم). */
export function highlightNext(ch, shiftEls = []) {
  for (const el of lastNext) el.classList.remove('next');
  lastNext = [];
  if (ch == null) return;
  const entry = keyMap.get(ch);
  if (!entry) return;
  entry.el.classList.add('next');
  lastNext.push(entry.el);
  if (entry.shift) for (const s of shiftEls) { s.classList.add('next'); lastNext.push(s); }
}

/** وميض المفتاح المضغوط باللون الأخضر أو الأحمر. */
export function flashKey(ch, ok) {
  const entry = keyMap.get(ch);
  if (!entry) return;
  const cls = ok ? 'pressed-ok' : 'pressed-bad';
  entry.el.classList.add(cls);
  setTimeout(() => entry.el.classList.remove(cls), 140);
}
