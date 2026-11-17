// محاكاة السباق: منافسون آليون واقعيون، وتنعيم الحركة، وقياس سرعة اللاعب.
// ملف منطق خالص بلا DOM، يعمل في المتصفح وفي اختبارات Node.

import { clamp } from './game.js';

/** مولّد أرقام عشوائية قابل للتكرار (mulberry32) للاختبارات. */
export function seededRandom(seed = 1) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** توزيع طبيعي تقريبي (متوسط 0، انحراف 1) من مولّد منتظم. */
function gaussian(rand) {
  let u = 0;
  let v = 0;
  while (u === 0) u = rand();
  while (v === 0) v = rand();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

const PUNCT = /[.،؛؟!:]/;
const DIGIT = /[0-9]/;

/** شخصيات المنافسين: كيف تتغير سرعتهم على مدى السباق (t من 0 إلى 1). */
export const PERSONALITIES = {
  starter: { label: 'بداية قوية', factor: (t) => 1.12 - 0.24 * t },
  closer: { label: 'نهاية قوية', factor: (t) => 0.88 + 0.3 * t * t },
  steady: { label: 'ثابت', factor: (t) => 1 + 0.05 * Math.sin(t * 9) },
};

/**
 * منافس آلي يكتب النص الحقيقي حرفًا حرفًا بإيقاع بشري:
 * سرعة تختلف من كلمة لأخرى، توقفات عند الترقيم ونهايات الجمل، وأخطاء يصححها بالمسح.
 * الأحداث مجدولة بالزمن، فتستمر المحاكاة بدقة حتى لو توقفت الإطارات (تبويب في الخلفية).
 */
export class BotTypist {
  constructor({ text, cps, errorRate = 0.03, startDelayMs = 500, rand = Math.random }) {
    this.chars = [...text];
    this.n = this.chars.length;
    this.rand = rand;
    this.cps = Math.max(0.3, cps);
    this.targetCps = this.cps;
    this.errorRate = errorRate;
    this.i = 0;              // الحروف الصحيحة المكتوبة
    this.visible = 0;        // الحروف الظاهرة (قد تزيد واحدًا عند خطأ لم يُمسح بعد)
    this.wrong = false;
    this.state = 'typing';   // typing | fixing | pausing | done
    this.t = startDelayMs;   // زمن الحدث القادم
    this.lastEventAt = startDelayMs;
    this.lastKeyAt = 0;
    this.finishedAt = null;
    this.wordFactor = 1;
    this.keyLog = 0;
  }

  setTargetCps(cps) { this.targetCps = clamp(cps, 0.3, 40); }

  get progress() { return clamp(this.visible / this.n, 0, 1); }

  /** السرعة الحالية حرف/ثانية كما يراها المراقب. */
  get currentCps() { return this.cps * this.wordFactor; }

  /** يعالج كل الأحداث حتى اللحظة nowMs. */
  advanceTo(nowMs) {
    let guard = 0;
    while (this.finishedAt == null && this.t <= nowMs && guard++ < 20000) this.#event();
  }

  #delayTo(nextCh) {
    let d = 1000 / (this.cps * this.wordFactor);
    d *= clamp(1 + gaussian(this.rand) * 0.22, 0.5, 1.9);
    if (nextCh === ' ') d *= 0.8;
    else if (PUNCT.test(nextCh) || DIGIT.test(nextCh)) d *= 1.5;
    return d;
  }

  #event() {
    const now = this.t;
    // الاقتراب التدريجي من السرعة المستهدفة (لا يغيّر البشر سرعتهم فجأة).
    const since = now - this.lastEventAt;
    this.cps += (this.targetCps - this.cps) * clamp(since / 2500, 0, 1);
    this.lastEventAt = now;

    if (this.state === 'fixing') {
      // ضغط مسح: يختفي الحرف الخاطئ ثم يُعاد الحرف الصحيح بعد قليل
      this.wrong = false;
      this.visible = this.i;
      this.state = 'typing';
      this.lastKeyAt = now;
      this.t = now + this.#delayTo(this.chars[this.i]) * 1.15;
      return;
    }
    this.state = 'typing';

    const ch = this.chars[this.i];
    if (this.i === 0 || this.chars[this.i - 1] === ' ') {
      // كلمة جديدة: عامل سرعة خاص بها، والكلمات الطويلة أبطأ قليلًا
      let w = 0;
      while (this.i + w < this.n && this.chars[this.i + w] !== ' ') w++;
      this.wordFactor = clamp(Math.exp(gaussian(this.rand) * 0.18), 0.6, 1.6) / (1 + 0.025 * Math.max(0, w - 6));
    }

    if (!this.wrong && ch !== ' ' && this.rand() < this.errorRate) {
      // خطأ: يظهر حرف زائد، ثم يلاحظه ويمسحه بعد زمن رد فعل
      this.wrong = true;
      this.visible = this.i + 1;
      this.state = 'fixing';
      this.lastKeyAt = now;
      this.t = now + 220 + this.rand() * 520;
      return;
    }

    this.i++;
    this.visible = this.i;
    this.lastKeyAt = now;
    this.keyLog++;
    if (this.i >= this.n) {
      this.finishedAt = now;
      this.state = 'done';
      return;
    }
    let d = this.#delayTo(this.chars[this.i]);
    if (PUNCT.test(ch)) d += 120 + this.rand() * 260;
    if (ch === ' ' && this.rand() < 0.07) {
      // لحظة تفكير بين الكلمات
      this.state = 'pausing';
      d += 350 + this.rand() * 900;
    }
    this.t = now + d;
  }
}

/**
 * يحسب سرعة المنافس المستهدفة بالحرف/ثانية: يتبع سرعة اللاعب ضمن حدود المستوى،
 * مع شخصية المنافس ومطاط التقارب (المتأخر يتحمس قليلًا والمتقدم يرتاح قليلًا).
 */
export function botTargetCps({ playerCps, botProgress, playerProgress, personality, profile, baseCps }) {
  const f = (PERSONALITIES[personality] || PERSONALITIES.steady).factor(clamp(botProgress, 0, 1));
  const floor = profile.floorCps;
  const cap = profile.capCps;
  // قبل أن يثبت إيقاع اللاعب نعتمد السرعة الأساسية للمستوى
  const followed = playerCps > 0.4 ? playerCps * profile.follow : baseCps;
  let target = Math.max(baseCps * 0.85, followed) * f;
  const gap = botProgress - playerProgress;             // موجب = المنافس متقدم
  target *= clamp(1 - gap * 0.9, 0.82, 1.2);
  return clamp(target, floor, cap);
}

/** حدود سرعة المنافسين للمستوى بالحرف/ثانية. */
export function botProfile(difficulty) {
  const expected = difficulty.expectedWpm * 5 / 60;
  return {
    follow: difficulty.follow,
    floorCps: expected * difficulty.botRange[0] * 0.9,
    capCps: difficulty.capWpm * 5 / 60,
    baseCps: expected * (difficulty.botRange[0] + difficulty.botRange[1]) / 2,
  };
}

/** مقياس إيقاع اللاعب: حروف/ثانية خلال آخر نافذة زمنية، مع تنعيم. */
export class PaceMeter {
  constructor(windowMs = 8000) {
    this.windowMs = windowMs;
    this.samples = [];
    this.ema = 0;
    this.lastT = 0;
  }

  record(tMs, chars) {
    const last = this.samples[this.samples.length - 1];
    if (last && last.chars === chars) return;
    this.samples.push({ t: tMs, chars });
    while (this.samples.length > 2 && tMs - this.samples[0].t > this.windowMs) this.samples.shift();
  }

  /** السرعة اللحظية (حروف/ثانية) عند اللحظة tMs: تُقاس على نافذة العينات وتتلاشى عند التوقف. */
  cps(tMs) {
    const dt = this.lastT ? (tMs - this.lastT) / 1000 : 0;
    this.lastT = tMs;
    let raw = 0;
    if (this.samples.length >= 2) {
      const first = this.samples[0];
      const last = this.samples[this.samples.length - 1];
      raw = (last.chars - first.chars) / (Math.max(last.t - first.t, 1500) / 1000);
      const idle = (tMs - last.t) / 1000;
      if (idle > 1.5) raw *= clamp(1 - (idle - 1.5) / 4, 0, 1);
    }
    this.ema += (raw - this.ema) * clamp(dt / 2.5, 0, 1);
    return Math.max(0, this.ema);
  }
}

/**
 * متابع حركة ناعم: نابض مخمَّد حرجيًا يلاحق الهدف بلا اهتزاز،
 * مع تخمين موضع اللاعبين عبر الشبكة بين التحديثات (dead reckoning).
 */
export class Follower {
  constructor(x = 0) {
    this.x = x;
    this.v = 0;
    this.obsValue = x;
    this.obsAt = 0;
    this.obsRate = 0;
  }

  /** تحديث قادم من الشبكة: قيمة تقدم وزمن وصولها. */
  observe(value, atMs) {
    if (this.obsAt) {
      const dt = (atMs - this.obsAt) / 1000;
      if (dt >= 0.15) {
        const rate = (value - this.obsValue) / dt;
        this.obsRate = clamp(rate, 0, 0.35);
      }
    }
    this.obsValue = value;
    this.obsAt = atMs;
  }

  /** الموضع المتوقع الآن بناءً على آخر تحديث ومعدّله (لا يتجاوز 99% قبل تأكيد الوصول). */
  predicted(nowMs, maxAheadMs = 3500) {
    if (!this.obsAt) return this.obsValue;
    const dt = clamp((nowMs - this.obsAt) / 1000, 0, maxAheadMs / 1000);
    return Math.min(this.obsValue + this.obsRate * dt, this.obsValue >= 1 ? 1 : 0.99);
  }

  /** يقرّب الموضع من الهدف خلال dt ثانية. omega: صلابة النابض (أعلى = أسرع). */
  update(target, dt, omega = 9) {
    let remaining = Math.min(dt, 0.25);
    while (remaining > 0) {
      const h = Math.min(remaining, 1 / 60);
      const a = -2 * omega * this.v - omega * omega * (this.x - target);
      this.v += a * h;
      this.x += this.v * h;
      remaining -= h;
    }
    if (Math.abs(this.x - target) < 1e-4 && Math.abs(this.v) < 1e-3) { this.x = target; this.v = 0; }
    return this.x;
  }
}

/** ترتيب المتسابقين الحالي: المنتهون أولًا بزمن الوصول، ثم بالتقدم. */
export function rankRacers(list) {
  return [...list].sort((a, b) => {
    const af = a.finishedAt != null;
    const bf = b.finishedAt != null;
    if (af && bf) return a.finishedAt - b.finishedAt;
    if (af !== bf) return af ? -1 : 1;
    return b.progress - a.progress;
  });
}
