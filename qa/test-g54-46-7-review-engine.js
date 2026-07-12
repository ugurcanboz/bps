'use strict';
const assert = require('assert');
const engine = require('../js/core/language-review-engine.js');
const NOW = '2026-07-10T12:00:00.000Z';
const FUTURE = '2026-07-20T12:00:00.000Z';
const PAST = '2026-07-01T12:00:00.000Z';
let passed = 0;
function test(name, fn) { fn(); passed++; console.log('PASS', name); }

test('engine version and schema', () => {
  assert.match(engine.version, /G54\.46\.7/);
  assert.equal(engine.schema, 'egt-language-review-v1');
});
test('brand-new task is not review debt', () => {
  const c = engine.classify({}, { now: NOW });
  assert.equal(c.state, 'new'); assert.equal(c.due, false); assert.equal(c.eligible, false); assert.equal(c.interacted, false);
});
test('catalog of 2726 untouched tasks produces zero due reviews', () => {
  const records = Array.from({ length: 2726 }, () => ({}));
  const st = engine.stats(records, { now: NOW });
  assert.equal(st.due, 0); assert.equal(st.total, 0); assert.equal(st.new, 2726);
});
test('wrong answer is due immediately', () => {
  const r = engine.update({}, 'wrong', { now: NOW });
  const c = engine.classify(r, { now: NOW });
  assert.equal(c.state, 'wrong'); assert.equal(c.due, true); assert.equal(r.attempts, 1); assert.equal(r.wrongCount, 1);
});
test('first correct answer schedules future review, not immediate debt', () => {
  const r = engine.update({}, 'correct', { now: NOW });
  const c = engine.classify(r, { now: NOW });
  assert.equal(c.state, 'learned'); assert.equal(c.due, false); assert.equal(c.scheduled, true); assert.equal(r.reviewIntervalDays, 3);
});
test('scheduled review becomes due only after date is reached', () => {
  const c1 = engine.classify({ attempts: 1, correct: true, reviewState: 'learned', reviewDueAt: FUTURE }, { now: NOW });
  const c2 = engine.classify({ attempts: 1, correct: true, reviewState: 'learned', reviewDueAt: PAST }, { now: NOW });
  assert.equal(c1.due, false); assert.equal(c2.due, true); assert.equal(c2.state, 'due');
});
test('manual mark is due even before first answer', () => {
  const r = engine.update({}, 'manual', { now: NOW });
  const c = engine.classify(r, { now: NOW });
  assert.equal(c.state, 'manual'); assert.equal(c.due, true); assert.equal(c.reason, 'manual');
});
test('unmarking untouched task returns it to new', () => {
  const r = engine.update(engine.update({}, 'manual', { now: NOW }), 'unmark', { now: NOW });
  const c = engine.classify(r, { now: NOW });
  assert.equal(c.state, 'new'); assert.equal(c.due, false);
});
test('correct answer after error resolves immediate debt and schedules one day', () => {
  const wrong = engine.update({}, 'wrong', { now: NOW });
  const corrected = engine.update(wrong, 'correct', { now: NOW });
  const c = engine.classify(corrected, { now: NOW });
  assert.equal(c.due, false); assert.equal(c.state, 'learned'); assert.equal(corrected.reviewIntervalDays, 1); assert.ok(corrected.resolvedAt);
});
test('repeated correct reviews increase interval', () => {
  let r = engine.update(engine.update({}, 'wrong', { now: NOW }), 'correct', { now: NOW });
  r = engine.update(r, 'correct', { now: '2026-07-11T12:00:00.000Z' });
  assert.equal(r.reviewIntervalDays, 3);
  r = engine.update(r, 'correct', { now: '2026-07-14T12:00:00.000Z' });
  assert.equal(r.reviewIntervalDays, 7);
});
test('paused review is excluded', () => {
  const r = engine.update(engine.update({}, 'wrong', { now: NOW }), 'pause', { now: NOW });
  const c = engine.classify(r, { now: NOW });
  assert.equal(c.state, 'paused'); assert.equal(c.due, false); assert.equal(c.eligible, false);
});
test('legacy unanswered record stays new', () => {
  const c = engine.classify({ attempts: 0, wrongCount: 0, correctCount: 0 }, { now: NOW });
  assert.equal(c.state, 'new'); assert.equal(c.due, false);
});
test('legacy wrong answer without due date remains due', () => {
  const c = engine.classify({ attempts: 1, correct: false, wrongCount: 1, updatedAt: PAST }, { now: NOW });
  assert.equal(c.state, 'wrong'); assert.equal(c.due, true);
});
test('legacy correct answer without due date is not invented as due', () => {
  const c = engine.classify({ attempts: 1, correct: true, correctCount: 1, updatedAt: PAST }, { now: NOW });
  assert.equal(c.state, 'learned'); assert.equal(c.due, false); assert.equal(c.scheduled, false);
});
test('mixed review stats count only due eligible entries', () => {
  const records = [
    {},
    engine.update({}, 'wrong', { now: NOW }),
    engine.update({}, 'manual', { now: NOW }),
    engine.update({}, 'correct', { now: NOW }),
    { attempts: 1, correct: true, reviewState: 'learned', reviewDueAt: PAST },
    engine.update(engine.update({}, 'wrong', { now: NOW }), 'pause', { now: NOW })
  ];
  const st = engine.stats(records, { now: NOW });
  assert.equal(st.due, 3); assert.equal(st.total, 3); assert.equal(st.wrong, 1); assert.equal(st.manual, 1); assert.equal(st.paused, 1); assert.equal(st.new, 1);
});

console.log(JSON.stringify({ ok: true, passed, version: engine.version }, null, 2));
