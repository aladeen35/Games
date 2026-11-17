import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DIFFICULTIES, computeWpm } from '../shared/game.js';
import { BotTypist, botTargetCps, botProfile, PaceMeter, Follower, rankRacers, seededRandom, PERSONALITIES } from '../shared/race-sim.js';
import { getText } from '../shared/texts/index.js';

const TEXT = getText('general:long:0').text;
const LEN = [...TEXT].length;

test('المنافس الآلي يكمل النص بسرعة قريبة من المطلوبة ويخطئ ويصحح', () => {
  const rand = seededRandom(7);
  const bot = new BotTypist({ text: TEXT, cps: 3, errorRate: 0.04, startDelayMs: 400, rand });
  const ideal = (LEN / 3) * 1000;
  let last = 0;
  let maxDrop = 0;
  let fixes = 0;
  for (let t = 0; t <= ideal * 3; t += 50) {
    bot.advanceTo(t);
    const p = bot.progress;
    if (p < last) { maxDrop = Math.max(maxDrop, last - p); fixes++; }
    last = p;
    if (bot.finishedAt != null) break;
  }
  assert.ok(bot.finishedAt != null, 'لم ينهِ النص');
  assert.ok(bot.finishedAt > ideal * 0.8 && bot.finishedAt < ideal * 1.8, `زمن غير معقول ${bot.finishedAt} مقابل ${ideal}`);
  assert.equal(bot.progress, 1);
  assert.ok(fixes > 0, 'لم يحدث أي خطأ يُصحَّح');
  assert.ok(maxDrop * LEN <= 1.01, 'التراجع لا يتجاوز حرفًا واحدًا');
});

test('المحاكاة مستقلة عن الإطارات: قفزة زمنية كبيرة تعطي نفس النتيجة', () => {
  const a = new BotTypist({ text: TEXT, cps: 4, rand: seededRandom(3) });
  const b = new BotTypist({ text: TEXT, cps: 4, rand: seededRandom(3) });
  for (let t = 0; t <= 20000; t += 16) a.advanceTo(t);
  b.advanceTo(20000);
  assert.equal(a.visible, b.visible);
  assert.equal(a.t, b.t);
});

test('المنافس يقترب من السرعة المستهدفة تدريجيًا لا فجأة', () => {
  const bot = new BotTypist({ text: TEXT, cps: 2, rand: seededRandom(5) });
  bot.advanceTo(3000);
  bot.setTargetCps(8);
  bot.advanceTo(3300);
  assert.ok(bot.cps < 5, `قفز إلى ${bot.cps}`);
  bot.advanceTo(12000);
  assert.ok(bot.cps > 7, `لم يصل: ${bot.cps}`);
});

test('سرعة المنافس المستهدفة مقيدة بحدود المستوى وتتبع اللاعب', () => {
  for (const d of Object.values(DIFFICULTIES)) {
    const profile = botProfile(d);
    const slow = botTargetCps({ playerCps: 0, botProgress: 0.5, playerProgress: 0.5, personality: 'steady', profile, baseCps: profile.baseCps });
    const fast = botTargetCps({ playerCps: 40, botProgress: 0.5, playerProgress: 0.5, personality: 'starter', profile, baseCps: profile.baseCps });
    assert.ok(slow >= profile.floorCps && slow <= profile.capCps, d.id);
    assert.equal(fast, profile.capCps, `${d.id}: الحد الأعلى`);
    // لاعب أسرع من الحد: المنافس لا يتجاوز capWpm فيظل السباق قابلًا للفوز
    assert.ok(computeWpm(fast * 60, 60000) <= d.capWpm + 1);
    // لاعب متوسط: المنافس يتبعه ضمن نسبة follow
    const mid = botTargetCps({ playerCps: 4, botProgress: 0.3, playerProgress: 0.3, personality: 'steady', profile, baseCps: profile.baseCps });
    assert.ok(mid <= Math.max(4 * d.follow * 1.06, profile.baseCps * 0.9) && mid >= profile.floorCps, `${d.id}: ${mid}`);
  }
  // المطاط: المتقدم كثيرًا يبطئ والمتأخر يسرع
  const profile = botProfile(DIFFICULTIES.medium);
  const ahead = botTargetCps({ playerCps: 4, botProgress: 0.8, playerProgress: 0.5, personality: 'steady', profile, baseCps: profile.baseCps });
  const behind = botTargetCps({ playerCps: 4, botProgress: 0.2, playerProgress: 0.5, personality: 'steady', profile, baseCps: profile.baseCps });
  assert.ok(behind > ahead);
});

test('الشخصيات: بداية قوية تتباطأ ونهاية قوية تتسارع', () => {
  assert.ok(PERSONALITIES.starter.factor(0) > PERSONALITIES.starter.factor(1));
  assert.ok(PERSONALITIES.closer.factor(1) > PERSONALITIES.closer.factor(0));
});

test('مقياس الإيقاع يقيس حروف/ثانية ويتجاهل التكرار', () => {
  const m = new PaceMeter(8000);
  let v = 0;
  for (let t = 0; t <= 12000; t += 100) { m.record(t, Math.floor(t / 250)); v = m.cps(t); } // 4 حروف/ثانية
  assert.ok(v > 3.4 && v < 4.6, `السرعة ${v}`);
  for (let t = 12100; t <= 26000; t += 100) v = m.cps(t); // توقف عن الكتابة: يتلاشى خلال ثوانٍ
  assert.ok(v < 0.5, `لم تتلاشَ: ${v}`);
});

test('المتابع يصل للهدف بسلاسة بلا تجاوز', () => {
  const f = new Follower(0);
  let maxX = 0;
  for (let i = 0; i < 120; i++) { f.update(0.5, 1 / 60); maxX = Math.max(maxX, f.x); }
  assert.ok(Math.abs(f.x - 0.5) < 0.01);
  assert.ok(maxX <= 0.5 + 1e-6, 'تجاوز الهدف');
  // تخمين الشبكة: 10% كل 2.5 ثانية → بعد 1.25 ثانية يتوقع نحو 5% زيادة
  f.observe(0.2, 1000);
  f.observe(0.3, 3500);
  const p = f.predicted(4750);
  assert.ok(p > 0.33 && p < 0.37, `التوقع ${p}`);
  assert.ok(f.predicted(60000) <= 0.99);
});

test('الترتيب: المنتهون أولًا ثم الأعلى تقدمًا', () => {
  const r = rankRacers([
    { id: 'a', progress: 0.9, finishedAt: null },
    { id: 'b', progress: 1, finishedAt: 5000 },
    { id: 'c', progress: 0.4, finishedAt: null },
    { id: 'd', progress: 1, finishedAt: 4000 },
  ]);
  assert.deepEqual(r.map((x) => x.id), ['d', 'b', 'a', 'c']);
});
