'use strict';
const fs = require('fs');
const path = require('path');
const assert = require('assert');
const root = path.resolve(__dirname, '..');
const moduleSource = fs.readFileSync(path.join(root, 'js/modules/language-course-entry-module.js'), 'utf8');
const index = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const sw = fs.readFileSync(path.join(root, 'service-worker.js'), 'utf8');
let passed = 0;
function check(name, fn) { fn(); passed++; console.log('PASS', name); }
check('review engine loaded exactly once before language course', () => {
  assert.strictEqual((index.match(/language-review-engine\.js/g) || []).length, 1);
  assert(index.indexOf('language-review-engine.js') > 0);
  assert(index.indexOf('language-review-engine.js') < index.indexOf('language-course-entry-module.js'));
});
check('review engine cached exactly once by service worker', () => assert.strictEqual((sw.match(/language-review-engine\.js/g) || []).length, 1));
check('English stats skip unanswered catalog tasks', () => {
  const part = moduleSource.slice(moduleSource.indexOf('function englishLevelReviewStats'), moduleSource.indexOf('function englishLevelNextLesson'));
  assert(part.includes('if(!a) return'));
  assert(!part.includes('stats.open++; stats.due++') || part.indexOf('if(!a) return') < part.indexOf('stats.open++'));
});
check('English due list requires stored answer and due classification', () => {
  const part = moduleSource.slice(moduleSource.indexOf('function englishLevelDueTasks'), moduleSource.indexOf('function englishA1NextLesson'));
  assert(part.includes('if(!a)return'));
  assert(part.includes('if(!c.due)return'));
  assert(!part.includes('!a || !a.correct'));
});
check('German review no longer inserts next unfinished task', () => {
  const part = moduleSource.slice(moduleSource.indexOf('function collectGermanDueTasks'), moduleSource.indexOf('function collectEnglishDueTasks'));
  assert(!part.includes('Number(st.total||0)<tasks.length'));
  assert(part.includes('reviewMeta'));
  assert(part.includes('if(!c.due)return'));
});
check('English unified review no longer includes untouched tasks', () => {
  const part = moduleSource.slice(moduleSource.indexOf('function collectEnglishDueTasks'), moduleSource.indexOf('function reviewLevelFilterKey'));
  assert(part.includes('if(!a)return'));
  assert(part.includes('if(!c.due)return'));
});
check('manual English review action exists', () => {
  assert(moduleSource.includes('function toggleEnglishManualReview'));
  assert(moduleSource.includes("action==='language-course-english-review-toggle'"));
});
check('review session practiced action updates source data', () => {
  const part = moduleSource.slice(moduleSource.indexOf('function reviewSessionMarkPracticed'), moduleSource.indexOf('function openUnifiedReviewSessionSummary'));
  assert(part.includes("reviewUpdate(old,'practiced'"));
  assert(part.includes("reviewUpdate(meta[item.taskId]||{},'practiced'"));
});
check('empty review explains zero-debt rule', () => assert(moduleSource.includes('Neue Aufgaben gehören in den Lernpfad und werden hier nicht als Rückstand gezählt.')));
check('progress schema upgraded', () => assert(moduleSource.includes("language-course-progress-v4")));
check('new user guidance starts learning instead of review debt', () => {
  assert(moduleSource.includes('totals.done===0'));
  assert(moduleSource.includes('Starte mit dem Einstufungstest oder deiner ersten Lektion.'));
});
check('review UI distinguishes due and marked from new tasks', () => {
  assert(moduleSource.includes('nur fällig/markiert'));
  assert(moduleSource.includes('Neue Aufgaben bleiben im Lernpfad'));
});
check('public review diagnostics available', () => {
  assert(moduleSource.includes('reviewPolicy:reviewEngine()'));
  assert(moduleSource.includes('reviewStats:unifiedReviewStats'));
});
console.log(JSON.stringify({ ok: true, passed }, null, 2));
