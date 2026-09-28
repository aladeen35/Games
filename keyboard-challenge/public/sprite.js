// الشخصيات ووضعياتها: 5 وضعيات (يجري، خطأ، قرب الفوز، فاز، خسر) وحتى 3 حركات لكل وضعية.
// السجل في characters/characters.json، وتضاف الشخصيات الجديدة بـ tools/add_character.py.

export const POSES = {
  run: { label: 'يجري', fps: 8 },
  error: { label: 'حصل خطأ', fps: 7 },
  near: { label: 'قربنا نفوز', fps: 10 },
  won: { label: 'فاز', fps: 4 },
  lost: { label: 'خسر', fps: 3 },
};
export const DEFAULT_CHARACTER = 'abujinan';
const BASE = 'assets/abu-jinan-runner.webp';
const DIR = 'characters/';

let registry = [];
let loading = null;

/** يقرأ سجل الشخصيات مرة واحدة ويحدّث كل الشخصيات المعروضة. */
export function loadCharacters() {
  if (loading) return loading;
  loading = fetch(`${DIR}characters.json`, { cache: 'no-cache' })
    .then((r) => (r.ok ? r.json() : { characters: [] }))
    .catch(() => ({ characters: [] }))
    .then(({ characters = [] }) => {
      registry = characters.filter((c) => c && c.id && c.poses);
      // تحميل مسبق للصور حتى لا تومض عند تبديل الوضعية
      for (const c of registry) for (const v of ['poses', 'lane']) for (const list of Object.values(c[v] || {})) {
        for (const f of [].concat(list)) { const i = new Image(); i.src = DIR + f; }
      }
      sprites.forEach((s) => s.refresh());
      return registry;
    });
  return loading;
}

export const characters = () => registry;
export function characterById(id) {
  return registry.find((c) => c.id === id) || registry.find((c) => c.id === DEFAULT_CHARACTER) || registry[0] || null;
}
export const isCharacterId = (id) => typeof id === 'string' && /^[a-z0-9_-]{1,32}$/.test(id);

const sprites = new Set();
let tick = 0;
let timer = 0;
function loop() {
  tick++;
  for (const s of sprites) s.step(tick);
}

export class Sprite {
  /** variant: full (بالشارة: المدرب والنتيجة) أو lane (الجسم فقط: المضمار) */
  constructor(img, { variant = 'full', character = DEFAULT_CHARACTER } = {}) {
    this.img = img;
    this.variant = variant;
    this.character = character;
    this.pose = 'run';
    this.frame = 0;
    this.paused = false;
    sprites.add(this);
    if (!timer) timer = setInterval(loop, 1000 / 20);
    img.addEventListener('error', () => { if (!img.src.endsWith(BASE)) { this.broken = true; img.src = BASE; this.refresh(); } });
    this.refresh();
  }

  setCharacter(id) {
    if (id === this.character) return;
    this.character = id;
    this.frame = 0;
    this.broken = false;
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

  frames() {
    if (this.broken) return [];
    const c = characterById(this.character);
    const list = c?.[this.variant === 'lane' ? 'lane' : 'poses']?.[this.pose];
    return list ? [].concat(list).map((f) => DIR + f) : [];
  }

  refresh() {
    const frames = this.frames();
    const fallback = frames.length === 0;
    this.img.classList.toggle('fallback', fallback);
    this.img.classList.toggle('has-art', !fallback);
    for (const p of Object.keys(POSES)) this.img.classList.toggle(`pose-${p}`, p === this.pose);
    this.img.classList.toggle('paused', this.paused);
    const src = fallback ? BASE : frames[this.frame % frames.length];
    if (!this.img.src.endsWith(src)) this.img.src = src;
    this.img.closest('[data-art]')?.classList.toggle('with-art', !fallback);
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
