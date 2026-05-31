const fs = require('fs');
const path = require('path');

// 1. Mock browser globals needed by app.js
global.window = global;
global.window.addEventListener = () => {};
global.document = {
  getElementById: (id) => ({
    classList: { add: () => {}, remove: () => {}, toggle: () => {} },
    addEventListener: () => {},
    style: {},
    appendChild: () => {},
    innerHTML: '',
    checked: false
  }),
  querySelector: () => ({
    classList: { add: () => {}, remove: () => {}, toggle: () => {} },
    style: {},
    addEventListener: () => {},
    appendChild: () => {}
  }),
  querySelectorAll: () => [],
  addEventListener: () => {},
  body: {
    classList: { add: () => {}, remove: () => {}, toggle: () => {} },
    dataset: {}
  }
};
global.$ = global.document.getElementById;

// Mock localStorage
const storage = {};
global.localStorage = {
  getItem: (key) => storage[key] || null,
  setItem: (key, val) => { storage[key] = String(val); },
  removeItem: (key) => { delete storage[key]; },
  clear: () => { for (const k in storage) delete storage[k]; }
};

global.window.QUESTION_BANK_EXTERNAL = [];

// 2. Load the question banks
const dataDir = 'data';
const bankFiles = [
  'question-bank.js',
  'question-bank-kaufm.js',
  'question-bank-sozial.js',
  'question-bank-it-extra.js',
  'question-bank-mathe.js'
];

for (const file of bankFiles) {
  const content = fs.readFileSync(path.join(dataDir, file), 'utf8');
  const runFile = new Function('window', content);
  runFile(global.window);
}

// 3. Load app.js
const appContent = fs.readFileSync('js/app.js', 'utf8');
const appSandbox = new Function(appContent);
appSandbox();
const testAPI = global.window.App._test;

// Bootstrap external question bank
const bootstrapExternalQuestionBank = function() {
  const raw = global.window.QUESTION_BANK_EXTERNAL;
  testAPI.QUESTION_BANK.items = [];
  raw.forEach((entry, index) => {
    const norm = testAPI.QuestionBankEngine.normalize(entry, entry.source);
    if (!norm.id) norm.id = "qb_external_" + index;
    const val = testAPI.QuestionBankEngine.validate(norm);
    if (val.ok) testAPI.QUESTION_BANK.items.push(val.item);
  });
};
bootstrapExternalQuestionBank();

const { buildQuiz, stableSignature, state, MODES, Generators } = testAPI;

console.log('--- Checking for Undefined Generators ---');
const appFileContent = fs.readFileSync('js/app.js', 'utf8');
const matches = appFileContent.match(/Generators\.[a-zA-Z0-9_]+/g) || [];
const uniqueGens = [...new Set(matches)];
uniqueGens.forEach(g => {
  const name = g.replace('Generators.', '');
  if (Generators[name] === undefined) {
    console.log(`[UNDEFINED GENERATOR FOUND]: ${g}`);
  }
});
console.log('-----------------------------------------\n');

function testMode(modeKey) {
  state.selectedMode = modeKey;
  const mode = MODES[modeKey];
  let quiz;
  try {
    quiz = buildQuiz();
  } catch (err) {
    console.error(`  [ERROR] buildQuiz() threw an exception for ${modeKey}:`, err);
    return;
  }
  
  const signatures = {};
  quiz.forEach(q => {
    let baseSig = stableSignature(q);
    signatures[baseSig] = (signatures[baseSig] || 0) + 1;
  });
  
  const uniqueCount = Object.keys(signatures).length;
  const repeats = Object.values(signatures);
  const maxRepeat = Math.max(...repeats);
  
  if (maxRepeat > 1) {
    console.log(`[DUPLICATE DETECTED] Mode: ${modeKey} (Target: ${mode.amount || 20}, Unique: ${uniqueCount}, Max Repeat: ${maxRepeat})`);
    // Print the duplicate questions
    Object.entries(signatures).forEach(([sig, count]) => {
      if (count > 1) {
        console.log(`  - Repeated ${count}x: "${sig.split('|')[1].slice(0, 100)}..."`);
      }
    });
  }
}

console.log('Running deduplication check for all modes...');
Object.keys(MODES).forEach(testMode);
console.log('Done checking all modes.');
