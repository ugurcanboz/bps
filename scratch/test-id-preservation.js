const fs = require('fs');

// Mocks for DOM and global context
global.window = {
  location: { protocol: 'http:' },
  addEventListener: () => {},
  QUESTION_BANK_EXTERNAL: []
};
global.innerWidth = 1024;
global.innerHeight = 768;

global.document = {
  addEventListener: () => {},
  getElementById: (id) => ({
    classList: { add: () => {}, remove: () => {}, toggle: () => {} },
    style: {},
    dataset: {},
    appendChild: () => {},
    textContent: ""
  }),
  querySelector: () => null,
  createElement: () => ({ classList: { add: () => {} }, style: {}, dataset: {} }),
  body: { classList: { add: () => {}, remove: () => {}, toggle: () => {} }, style: {}, dataset: {} }
};

global.localStorage = {
  getItem: () => null,
  setItem: () => {}
};

global.navigator = {
  serviceWorker: { register: () => Promise.resolve() }
};

// Load Question Banks
eval(fs.readFileSync('C:\\Users\\Ugurcan\\Desktop\\Projekt APP\\v9\\data\\question-bank.js', 'utf8'));
eval(fs.readFileSync('C:\\Users\\Ugurcan\\Desktop\\Projekt APP\\v9\\data\\question-bank-kaufm.js', 'utf8'));
eval(fs.readFileSync('C:\\Users\\Ugurcan\\Desktop\\Projekt APP\\v9\\data\\question-bank-sozial.js', 'utf8'));
eval(fs.readFileSync('C:\\Users\\Ugurcan\\Desktop\\Projekt APP\\v9\\data\\question-bank-it-extra.js', 'utf8'));

// Load App
eval(fs.readFileSync('C:\\Users\\Ugurcan\\Desktop\\Projekt APP\\v9\\js\\app.js', 'utf8'));

const App = global.window.App;
console.log('App loaded:', !!App);

// Run a quiz in generalKnowledgeBookSprint mode
App.selectMode('generalKnowledgeBookSprint');
App.prepareTest();

const quiz = App._test.state.quiz;
console.log('Generated Quiz Questions count:', quiz.length);
console.log('Question IDs in Quiz:');
quiz.forEach((q, idx) => {
  console.log(`  [Question ${idx + 1}] ID: ${q.id} | Category: ${q.cat} | Text: "${q.q.substring(0, 50)}..."`);
});
