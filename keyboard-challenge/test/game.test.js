import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  DIFFICULTIES, TypingTracker, computeWpm, computeAccuracy, computeProgress, trackPosition,
  weekStartUTC, compareResults, pickPhraseIndex, normalizeRoomCode, isValidRoomCode, botCharsPerSecond,
} from '../shared/game.js';

test('ثلاثة مستويات لكل منها جمل مختلفة', () => {
  assert.deepEqual(Object.keys(DIFFICULTIES), ['easy', 'medium', 'rocket']);
  const all = Object.values(DIFFICULTIES).flatMap((d) => d.phrases);
  assert.equal(new Set(all).size, all.length);
  assert.equal(DIFFICULTIES.medium.seconds, 42);
});

test('WPM = (الحروف / 5) / الدقائق مع التقريب والتقييد', () => {
  assert.equal(computeWpm(50, 60000), 10);
  assert.equal(computeWpm(0, 1000), 0);
  assert.equal(computeWpm(10, 0), 0);
  assert.equal(computeWpm(100000, 1), 999);
});

test('الدقة 100 مبدئيًا ومقيدة بين 0 و100', () => {
  assert.equal(computeAccuracy(0, 0), 100);
  assert.equal(computeAccuracy(9, 10), 90);
  assert.equal(computeAccuracy(-5, 10), 0);
  assert.equal(computeAccuracy(20, 10), 100);
});

test('التقدم والموقع من اليمين إلى اليسار', () => {
  assert.equal(computeProgress(5, 10), 0.5);
  assert.equal(computeProgress(20, 10), 1);
  assert.equal(trackPosition(0), 1);   // البداية يمينًا
  assert.equal(trackPosition(1), 0);   // النهاية يسارًا
  assert.equal(trackPosition(0.25), 0.75);
});

test('المتتبع يحسب الأخطاء تراكميًا ولا يمحوها المسح', () => {
  const t = new TypingTracker('يا زول');
  t.update('ي');
  t.update('يب');            // خطأ
  assert.equal(t.prefix, 1);
  assert.deepEqual(t.states().slice(0, 3), ['correct', 'wrong', 'pending']);
  t.update('ي');             // مسح
  assert.deepEqual(t.states().slice(0, 2), ['correct', 'current']);
  t.update('يا زول');
  assert.ok(t.done);
  assert.equal(t.typed, 7);
  assert.equal(t.correct, 6);
  assert.equal(t.accuracy, 86);
  assert.equal(t.progress, 1);
});

test('الفاصلة اللاتينية تُقبل بدل الفاصلة العربية', () => {
  const t = new TypingTracker('صباح الخير يا زول، اليوم');
  t.update('صباح الخير يا زول, اليوم');
  assert.ok(t.done);
});

test('المتتبع لا يقبل أطول من الجملة', () => {
  const t = new TypingTracker('شاي');
  t.update('شاييييي');
  assert.equal(t.value, 'شاي');
});

test('بداية الأسبوع الإثنين 00:00 UTC', () => {
  assert.equal(weekStartUTC(new Date('2026-09-25T15:00:00Z')).toISOString(), '2026-09-21T00:00:00.000Z'); // جمعة
  assert.equal(weekStartUTC(new Date('2026-09-21T00:00:00Z')).toISOString(), '2026-09-21T00:00:00.000Z'); // إثنين
  assert.equal(weekStartUTC(new Date('2026-09-27T23:59:59Z')).toISOString(), '2026-09-21T00:00:00.000Z'); // أحد
});

test('الترتيب: WPM ثم الدقة ثم الأقدم', () => {
  const rows = [
    { id: 'a', wpm: 50, accuracy: 90, completedAt: 3 },
    { id: 'b', wpm: 60, accuracy: 80, completedAt: 5 },
    { id: 'c', wpm: 50, accuracy: 95, completedAt: 4 },
    { id: 'd', wpm: 50, accuracy: 90, completedAt: 1 },
  ];
  assert.deepEqual(rows.sort(compareResults).map((r) => r.id), ['b', 'c', 'd', 'a']);
});

test('جملة جديدة مختلفة عن السابقة', () => {
  for (let i = 0; i < 50; i++) {
    const prev = i % DIFFICULTIES.medium.phrases.length;
    assert.notEqual(pickPhraseIndex('medium', prev), prev);
  }
});

test('سرعة المنافسين الآليين ضمن النطاق', () => {
  for (const d of Object.values(DIFFICULTIES)) {
    const lo = (d.expectedWpm * d.botRange[0] * 5) / 60;
    const hi = (d.expectedWpm * d.botRange[1] * 5) / 60;
    for (let i = 0; i < 20; i++) {
      const v = botCharsPerSecond(d.id);
      assert.ok(v >= lo - 1e-9 && v <= hi + 1e-9);
    }
  }
});

test('كود الغرفة: أحرف كبيرة و5 خانات', () => {
  assert.equal(normalizeRoomCode(' nile7 '), 'NILE7');
  assert.ok(isValidRoomCode('NILE7'));
  assert.ok(!isValidRoomCode('NIL0'));
  assert.ok(!isValidRoomCode('ABCDEF'));
});
