// منطق اللعبة المشترك بين الواجهة والخادم — تحدي الـ Keyboard مع أبو جنان
// ملف ES Module بلا اعتماديات، يُحمَّل في المتصفح ويُستورد في Node.

export const MAX_WPM = 220;          // أعلى سرعة يقبلها الخادم
export const SYNC_INTERVAL_MS = 2500;
export const COUNTDOWN_MS = 3000;    // العد التنازلي قبل الانطلاق

// المستوى يحدد سرعة المنافسين وسخاء المؤقت؛ النص نفسه يأتي من الفئة والنوع.
export const DIFFICULTIES = {
  easy: {
    id: 'easy', label: 'هادي', icon: '🐢',
    hint: 'منافسون على راحتهم ووقت واسع',
    expectedWpm: 22, botRange: [0.65, 0.78], slack: 2.1,
  },
  medium: {
    id: 'medium', label: 'معتدل', icon: '🏃',
    hint: 'توازن بين السرعة والدقة',
    expectedWpm: 32, botRange: [0.78, 0.94], slack: 1.7,
  },
  rocket: {
    id: 'rocket', label: 'صاروخ', icon: '🚀',
    hint: 'منافسون سريعون ووقت ضيق',
    expectedWpm: 42, botRange: [0.92, 1.08], slack: 1.4,
  },
};

export const DIFFICULTY_IDS = Object.keys(DIFFICULTIES);
export const DEFAULT_DIFFICULTY = 'medium';

export function isDifficulty(d) {
  return typeof d === 'string' && Object.prototype.hasOwnProperty.call(DIFFICULTIES, d);
}

/** زمن الجولة بالثواني حسب طول النص والمستوى (بين 30 ثانية و15 دقيقة). */
export function roundSeconds(textLength, difficulty = DEFAULT_DIFFICULTY) {
  const d = DIFFICULTIES[difficulty] || DIFFICULTIES[DEFAULT_DIFFICULTY];
  const cps = (d.expectedWpm * 5) / 60;
  return clamp(Math.ceil(12 + (textLength / cps) * d.slack), 30, 900);
}

// مكافئات مقبولة من لوحات المفاتيح المختلفة (فاصلة لاتينية بدل العربية مثلًا).
const EQUIV = {
  ',': '،', '?': '؟', ';': '؛', '\u00A0': ' ', '\u200F': '', '\u200E': '',
  'ی': 'ي', 'ک': 'ك', // لوحات فارسية
  '٠': '0', '١': '1', '٢': '2', '٣': '3', '٤': '4', '٥': '5', '٦': '6', '٧': '7', '٨': '8', '٩': '9',
  '۰': '0', '۱': '1', '۲': '2', '۳': '3', '۴': '4', '۵': '5', '۶': '6', '۷': '7', '۸': '8', '۹': '9',
};

/** تحويل حرف مُدخل إلى صيغته القياسية قبل المقارنة. */
export function normalizeChar(ch) {
  const e = EQUIV[ch];
  return e === undefined ? ch : e;
}

export function normalizeInput(str) {
  let out = '';
  for (const ch of str) out += normalizeChar(ch);
  return out;
}

/** طول الجزء الصحيح المتطابق من بداية الجملة. */
export function correctPrefixLength(input, phrase) {
  const a = [...input];
  const b = [...phrase];
  let i = 0;
  while (i < a.length && i < b.length && a[i] === b[i]) i++;
  return i;
}

export const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

/** WPM = (عدد الحروف / 5) / الزمن بالدقائق — مقرّب ومقيّد بين 0 و999. */
export function computeWpm(chars, elapsedMs) {
  if (!(elapsedMs > 0) || !(chars > 0)) return 0;
  return clamp(Math.round((chars / 5) / (elapsedMs / 60000)), 0, 999);
}

/** الدقة = الصحيح / المكتوب × 100، وتكون 100 مبدئيًا قبل أي حرف. */
export function computeAccuracy(correct, typed) {
  if (!(typed > 0)) return 100;
  return clamp(Math.round((correct / typed) * 100), 0, 100);
}

/** التقدم بين 0 و1 للواجهة. */
export function computeProgress(correctChars, phraseLength) {
  if (!(phraseLength > 0)) return 0;
  return clamp(correctChars / phraseLength, 0, 1);
}

/**
 * موقع اللاعب على المضمار كنسبة من اليسار (0 = خط النهاية يسارًا، 1 = البداية يمينًا).
 * موقع اللاعب = موقع البداية − (نسبة التقدم × طول المسار)
 */
export function trackPosition(progress, start = 1, length = 1) {
  return start - clamp(progress, 0, 1) * length;
}

/**
 * متتبّع الكتابة: يحسب الضغطات الصحيحة والخاطئة تراكميًا
 * حتى لا يُمحى أثر الخطأ عند التصحيح بالمسح.
 */
export class TypingTracker {
  constructor(phrase) {
    this.phrase = phrase;
    this.chars = [...phrase];
    this.value = '';
    this.typed = 0;
    this.correct = 0;
  }

  /** تحديث القيمة الجديدة لخانة الإدخال. يعيد الأحداث: [{ok, index}] للحروف المضافة. */
  update(rawValue) {
    const next = [...normalizeInput(rawValue)].slice(0, this.chars.length);
    const prev = [...this.value];
    let common = 0;
    while (common < prev.length && common < next.length && prev[common] === next[common]) common++;
    const events = [];
    for (let i = common; i < next.length; i++) {
      const ok = next[i] === this.chars[i];
      this.typed++;
      if (ok) this.correct++;
      events.push({ ok, index: i, ch: next[i] });
    }
    this.value = next.join('');
    return events;
  }

  get prefix() { return correctPrefixLength(this.value, this.phrase); }
  get done() { return this.value === this.phrase; }
  get accuracy() { return computeAccuracy(this.correct, this.typed); }
  get progress() { return computeProgress(this.prefix, this.chars.length); }
  wpm(elapsedMs) { return computeWpm(this.prefix, elapsedMs); }

  /** حالة كل حرف للعرض: correct | wrong | current | pending */
  states() {
    const typed = [...this.value];
    // مع وجود خطأ لا يُبرز حرف تالٍ: المطلوب أولًا مسح الخطأ.
    const clean = this.prefix === typed.length;
    return this.chars.map((ch, i) => {
      if (i < typed.length) return typed[i] === ch ? 'correct' : 'wrong';
      return i === typed.length && clean ? 'current' : 'pending';
    });
  }
}

/** بداية الأسبوع: الإثنين 00:00 بتوقيت UTC. */
export function weekStartUTC(date = new Date()) {
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const day = d.getUTCDay();              // 0 = الأحد
  const diff = (day + 6) % 7;             // أيام منذ الإثنين
  d.setUTCDate(d.getUTCDate() - diff);
  return d;
}

/** ترتيب النتائج: أعلى WPM ثم أعلى دقة ثم الأقدم. */
export function compareResults(a, b) {
  return (b.wpm - a.wpm) || (b.accuracy - a.accuracy) || (a.completedAt - b.completedAt);
}

/** سرعة المنافس الآلي بالحروف في الثانية. */
export function botCharsPerSecond(difficulty, rand = Math.random) {
  const { expectedWpm, botRange: [lo, hi] } = DIFFICULTIES[difficulty];
  const factor = lo + (hi - lo) * rand();
  return (expectedWpm * factor * 5) / 60;
}

export const ROOM_CODE_ALPHABET = 'ABCDEFGHIJKLMNPQRSTUVWXYZ23456789'; // بلا O و0 و1 لتجنب اللبس
export const ROOM_CODE_LENGTH = 5;

export function normalizeRoomCode(code) {
  return String(code ?? '').trim().toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, ROOM_CODE_LENGTH);
}

export function isValidRoomCode(code) {
  return new RegExp(`^[${ROOM_CODE_ALPHABET}]{${ROOM_CODE_LENGTH}}$`).test(code);
}
