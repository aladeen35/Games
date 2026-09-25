// وضعيات شخصية أبو جنان: 5 وضعيات × 3 حركات.
// ضع الصور في assets/poses/ وسجّل أسماءها في poses.json وستُستخدم تلقائيًا؛
// وإلى أن تتوفر، تظهر الصورة الأساسية بحركة CSS تناسب كل وضعية.

export const POSES = {
  run: { label: 'يجري', fps: 8 },
  error: { label: 'يجري مع خطأ', fps: 7 },
  near: { label: 'قرب الفوز', fps: 10 },
  won: { label: 'فاز', fps: 4 },
  lost: { label: 'خسر', fps: 3 },
};
const FRAMES = 3;
const BASE = 'assets/abu-jinan-runner.webp';

const available = {};     // الوضعية → قائمة روابط الإطارات المتوفرة
let probed = null;

/** يقرأ قائمة الإطارات المتوفرة من assets/poses/poses.json مرة واحدة. */
export function probePoses() {
  if (probed) return probed;
  probed = fetch('assets/poses/poses.json', { cache: 'no-cache' })
    .then((r) => (r.ok ? r.json() : { frames: {} }))
    .catch(() => ({ frames: {} }))
    .then(({ frames = {} }) => {
      for (const pose of Object.keys(POSES)) {
        available[pose] = (frames[pose] || []).slice(0, FRAMES).map((f) => `assets/poses/${f}`);
        // تحميل مسبق لتجنب الوميض عند تبديل الإطارات
        available[pose].forEach((u) => { const i = new Image(); i.src = u; });
      }
      sprites.forEach((s) => s.refresh());
    });
  return probed;
}

const sprites = new Set();
let tick = 0;
let timer = 0;

function loop() {
  tick++;
  for (const s of sprites) s.step(tick);
}

export class Sprite {
  constructor(img) {
    this.img = img;
    this.pose = 'run';
    this.frame = 0;
    this.paused = false;
    sprites.add(this);
    if (!timer) timer = setInterval(loop, 1000 / 20);
    img.addEventListener('error', () => { if (img.src.indexOf(BASE) === -1) img.src = BASE; });
    this.refresh();
  }

  set(pose, { paused = false } = {}) {
    if (!POSES[pose]) pose = 'run';
    if (pose === this.pose && paused === this.paused) return;
    this.pose = pose;
    this.paused = paused;
    this.frame = 0;
    this.refresh();
  }

  frames() { return available[this.pose] || []; }

  refresh() {
    const frames = this.frames();
    const fallback = frames.length === 0;
    this.img.classList.toggle('fallback', fallback);
    for (const p of Object.keys(POSES)) this.img.classList.toggle(`pose-${p}`, p === this.pose);
    this.img.classList.toggle('paused', this.paused);
    const src = fallback ? BASE : frames[this.frame % frames.length];
    if (!this.img.src.endsWith(src)) this.img.src = src;
  }

  step(t) {
    const frames = this.frames();
    if (this.paused || frames.length < 2) return;
    const every = Math.max(1, Math.round(20 / POSES[this.pose].fps));
    if (t % every) return;
    this.frame = (this.frame + 1) % frames.length;
    this.img.src = frames[this.frame];
  }

  destroy() { sprites.delete(this); }
}
