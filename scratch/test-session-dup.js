const fs = require('fs');
const vm = require('vm');
const path = require('path');
const root = path.resolve(__dirname, '..');
const store = {};
const context = {
  console,
  window: {},
  document: undefined,
  localStorage: {
    getItem:k => Object.prototype.hasOwnProperty.call(store,k) ? store[k] : null,
    setItem:(k,v) => { store[k] = String(v); },
    removeItem:k => { delete store[k]; }
  },
  Date, Math, setTimeout, clearTimeout
};
context.window = context;
vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(root,'js/learning-coach-engine.js'),'utf8'), context);
const filesToLoad = [
  path.join(root, 'data/question-bank.js'),
  path.join(root, 'data/question-bank-kaufm.js'),
  path.join(root, 'data/question-bank-sozial.js'),
  path.join(root, 'data/question-bank-it-extra.js'),
  path.join(root, 'data/question-bank-mathe.js')
];
filesToLoad.forEach(f => {
  vm.runInContext(fs.readFileSync(f, 'utf8'), context);
});
const E = context.BPSLearningCoachEngine;

let duplicatesFound = 0;
// Test 100 rounds of starting a session of size 10
for (let r = 0; r < 100; r++) {
  const session = E.startSession({count: 10, skill: 'mixed', difficulty: 3});
  const ids = {};
  const sigs = {};
  session.tasks.forEach(t => {
    const text = t.q || '';
    if (t.id && ids[t.id]) {
      console.error(`[DUPLICATE ID] Round ${r}, ID: ${t.id}, text: "${text.substring(0, 50)}..."`);
      duplicatesFound++;
    }
    if (t.signature && sigs[t.signature]) {
      console.error(`[DUPLICATE SIGNATURE] Round ${r}, Sig: ${t.signature}, text: "${text.substring(0, 50)}..."`);
      duplicatesFound++;
    }
    ids[t.id] = true;
    sigs[t.signature] = true;
  });
}
console.log(`Completed 100 Coach session checks. Total duplicates found: ${duplicatesFound}`);
if (duplicatesFound > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
