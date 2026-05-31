const fs = require('fs');
const vm = require('vm');
const path = require('path');
const root = path.resolve(__dirname, '..');
const store = {};
const context = {
  console,
  window: {},
  localStorage: {
    getItem:k => Object.prototype.hasOwnProperty.call(store,k) ? store[k] : null,
    setItem:(k,v) => { store[k] = String(v); },
    removeItem:k => { delete store[k]; }
  },
  document: undefined,
  Math,
  Date,
  setTimeout,
  clearTimeout
};
context.window = context;
context.BPS_COACH_KNOWLEDGE_BASE = [
  { id:'dns', topic:'DNS', subject:'IT', keywords:['dns','netzwerk'], shortAnswer:'DNS löst Namen in IP-Adressen auf.', easyExplanation:'Du merkst dir Namen, der Rechner braucht IP-Adressen.' }
];
context.QUESTION_BANK = [
  { id:'q1', cat:'Mathe', group:'Zahlenreihen', q:'2, 4, 8, 16, ?', a:['18','24','32','36'], correct:2, verified:true, difficulty:3, trap:'Addition statt Multiplikation' },
  { id:'q2', cat:'IT', group:'Netzwerk', q:'Wofür steht DNS?', a:['Namen zu IP','Drucker','Grafik','RAM'], correct:0, verified:true, difficulty:2 }
];
vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(root,'js/learning-coach-engine.js'),'utf8'), context);
const eng = context.BPSLearningCoachEngine;
if(!eng) throw new Error('Engine missing');
if(!eng.integrationContract().requiredFiles.includes('js/learning-coach-ui.js')) throw new Error('Contract incomplete');
const db = eng.databaseStats();
if(db.total < 2) throw new Error('Question bank not detected');
const reply = eng.answer('DNS');
if(!reply || !reply.found) throw new Error('Knowledge answer failed');
const session = eng.startSession({skill:'mixed', difficulty:3, count:3, mode:'focus-5'});
if(!session || session.tasks.length < 3) throw new Error('Session failed');
const before = eng.readinessScore();
eng.answerSessionTask(session.tasks[0].correct);
const after = eng.readinessScore();
if(after.confidence < before.confidence) throw new Error('Readiness confidence regressed');
const cc = eng.commandCenter();
if(!cc || !cc.modes || !cc.readiness) throw new Error('Command center failed');
console.log('V9.5.3 integration smoke OK', {db:db.total, version:eng.version, bps:after.bps, ctc:after.ctc});
