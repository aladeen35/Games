// أصوات اللعبة عبر Web Audio API — بلا ملفات صوت.
// لا يُنشأ سياق الصوت إلا بعد أول تفاعل من المستخدم احترامًا لسياسات المتصفح.

const STORE_KEY = 'kb-sound';

let ctx = null;
let master = null;
let enabled = true;
try { enabled = localStorage.getItem(STORE_KEY) !== 'off'; } catch { /* التخزين غير متاح */ }

function ensure() {
  if (ctx) {
    if (ctx.state === 'suspended') ctx.resume().catch(() => {});
    return ctx;
  }
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  try {
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.55;
    master.connect(ctx.destination);
  } catch {
    ctx = null;
  }
  return ctx;
}

/** يُستدعى عند أول تفاعل (نقرة أو ضغطة) لتجهيز الصوت. */
export function unlockAudio() {
  if (enabled) ensure();
}

export function isSoundOn() { return enabled; }

export function setSound(on) {
  enabled = !!on;
  try { localStorage.setItem(STORE_KEY, enabled ? 'on' : 'off'); } catch { /* تجاهل */ }
  if (enabled) ensure();
}

function tone({ freq, to = freq, type = 'sine', dur = 0.12, vol = 0.12, delay = 0, attack = 0.005 }) {
  if (!enabled) return;
  const ac = ensure();
  if (!ac || ac.state !== 'running' && ac.state !== 'suspended') return;
  const t0 = ac.currentTime + delay;
  const osc = ac.createOscillator();
  const g = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (to !== freq) osc.frequency.exponentialRampToValueAtTime(to, t0 + dur);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(vol, t0 + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(g).connect(master);
  osc.start(t0);
  osc.stop(t0 + dur + 0.02);
}

export const sfx = {
  /** بدء الجولة: نغمة قصيرة صاعدة */
  start() {
    tone({ freq: 392, to: 784, type: 'triangle', dur: 0.22, vol: 0.12 });
    tone({ freq: 784, type: 'sine', dur: 0.12, vol: 0.06, delay: 0.2 });
  },
  /** ضغط صحيح: نقرة خفيفة حادة */
  correct() {
    tone({ freq: 1760 + Math.random() * 180, type: 'square', dur: 0.03, vol: 0.025, attack: 0.002 });
  },
  /** ضغط خاطئ: نغمة منخفضة قصيرة */
  wrong() {
    tone({ freq: 180, to: 120, type: 'sawtooth', dur: 0.14, vol: 0.05 });
  },
  /** إكمال الجملة: نغمة انتصار أطول */
  complete() {
    [523, 659, 784, 1047].forEach((f, i) => tone({ freq: f, type: 'triangle', dur: 0.26, vol: 0.1, delay: i * 0.1 }));
  },
  /** دخول غرفة: نغمة تأكيد */
  join() {
    tone({ freq: 660, type: 'sine', dur: 0.1, vol: 0.1 });
    tone({ freq: 990, type: 'sine', dur: 0.16, vol: 0.09, delay: 0.09 });
  },
  /** فوز اللاعب: نغمتان متتاليتان مع ارتفاع */
  win() {
    tone({ freq: 784, to: 1175, type: 'triangle', dur: 0.28, vol: 0.12 });
    tone({ freq: 1175, to: 1568, type: 'triangle', dur: 0.4, vol: 0.12, delay: 0.26 });
    tone({ freq: 392, type: 'sine', dur: 0.6, vol: 0.05, delay: 0.26 });
  },
  /** انتهاء الوقت */
  timeout() {
    tone({ freq: 440, to: 220, type: 'triangle', dur: 0.4, vol: 0.09 });
  },
};
