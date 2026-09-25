// منطق اللعبة المشترك بين الواجهة والخادم — تحدي الـ Keyboard مع أبو جنان
// ملف ES Module بلا اعتماديات، يُحمَّل في المتصفح ويُستورد في Node.

export const ROUND_SECONDS = 42;
export const MAX_WPM = 220;          // أعلى سرعة يقبلها الخادم
export const SYNC_INTERVAL_MS = 2500;

export const DIFFICULTIES = {
  easy: {
    id: 'easy',
    label: 'هادي',
    hint: 'جمل قصيرة ومنافسون على راحتهم',
    seconds: 55,
    expectedWpm: 22,
    botRange: [0.65, 0.78],
    phrases: [
      'اللمة الحلوة بتخلي الشغل ساهل',
      'صباح الخير يا زول، اليوم يوم السرعة',
      'الشاي بالنعناع في العصرية',
      'النيل جاري والقلب فرحان',
      'أكتب براحة وركز في الحروف',
      'الجنينة خضراء والجو جميل',
    ],
  },
  medium: {
    id: 'medium',
    label: 'معتدل',
    hint: 'المستوى الافتراضي: توازن بين السرعة والدقة',
    seconds: ROUND_SECONDS,
    expectedWpm: 32,
    botRange: [0.78, 0.94],
    phrases: [
      'أكتب أسرع وخلي أبو جنان يقود السباق',
      'من الخرطوم تبدأ الحكاية وبالكلمة نصل',
      'ريحة القهوة في أم درمان بتجيب الهمة',
      'على شط النيل الأزرق الناس بتتلاقى',
      'الكيبورد في إيدك والسباق في راسك',
      'كل صباح جديد فرصة نكتب أحسن',
    ],
  },
  rocket: {
    id: 'rocket',
    label: 'صاروخ',
    hint: 'جمل طويلة وترقيم ومنافسون سريعون',
    seconds: ROUND_SECONDS,
    expectedWpm: 42,
    botRange: [0.92, 1.08],
    phrases: [
      'يا صاحبي خليك صاحي، الجملة دي دايرة تركيز شديد',
      'في شارع النيل كل حرف محسوب وكل ثانية بتفرق',
      'من توتي لي بحري، الأصابع بتجري والعيون بتراقب',
      'الصبر مفتاح الفرج، لكن في السباق السرعة مفتاح الفوز',
      'لو غلطت ما تزعل؛ صحح الحرف وواصل الجري',
    ],
  },
};

export const DIFFICULTY_IDS = Object.keys(DIFFICULTIES);
export const DEFAULT_DIFFICULTY = 'medium';

export function isDifficulty(d) {
  return typeof d === 'string' && Object.prototype.hasOwnProperty.call(DIFFICULTIES, d);
}

export function getPhrase(difficulty, index) {
  const list = DIFFICULTIES[difficulty].phrases;
  return list[((index % list.length) + list.length) % list.length];
}

/** رقم جملة عشوائي مختلف عن السابق إن أمكن. */
export function pickPhraseIndex(difficulty, previous = -1, rand = Math.random) {
  const n = DIFFICULTIES[difficulty].phrases.length;
  if (n <= 1) return 0;
  let i = Math.floor(rand() * n);
  if (i === previous) i = (i + 1 + Math.floor(rand() * (n - 1))) % n;
  return i;
}

// مكافئات مقبولة من لوحات المفاتيح المختلفة (فاصلة لاتينية بدل العربية مثلًا).
const EQUIV = { ',': '،', '?': '؟', ';': '؛', '\u00A0': ' ' };

/** تحويل حرف مُدخل إلى صيغته القياسية قبل المقارنة. */
export function normalizeChar(ch) {
  const e = EQUIV[ch];
  return e ? e : ch;
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
