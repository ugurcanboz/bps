const fs = require('fs');
const vm = require('vm');
const store = {};
const context = {
  console,
  window: {},
  localStorage: { getItem:k=>store[k]||null, setItem:(k,v)=>{store[k]=String(v)}, removeItem:k=>{delete store[k]} },
  document: { readyState:'loading', addEventListener(){}, getElementById(){return null}, body:{appendChild(){}, classList:{add(){},remove(){}}, addEventListener(){}}, createElement(){return {setAttribute(){}, addEventListener(){}, classList:{add(){},remove(){}}, innerHTML:'', appendChild(){}}}, querySelector(){return null} },
  MutationObserver: function(){ this.observe=function(){}; },
  setTimeout: fn => fn(),
  alert: msg => console.log('alert', msg)
};
context.window = context.window;
context.window.localStorage = context.localStorage;
context.window.document = context.document;
vm.createContext(context);
vm.runInContext(fs.readFileSync('data/python-quest-db.js','utf8'), context);
vm.runInContext(fs.readFileSync('js/learning-coach-engine.js','utf8'), context);
const db = context.window.PYTHON_QUEST_DB;
if(!db || db.version !== '9.9.0') throw new Error('DB version mismatch');
if(db.levels.length !== 30) throw new Error('Expected 30 levels');
const l4 = db.levels[3];
if(!l4.pdf || !l4.pdf.includes('python-level-04.pdf')) throw new Error('Level 4 PDF missing');
const good = `# Mini-Rechner Level 4\nzahl1 = float(input("Erste Zahl: "))\nzahl2 = float(input("Zweite Zahl: "))\nprint("=== Mini-Rechner ===")\nprint(f"Addition: {zahl1 + zahl2}")\nprint(f"Subtraktion: {zahl1 - zahl2}")\nprint(f"Multiplikation: {zahl1 * zahl2}")\nprint(f"Division: {zahl1 / zahl2}")`;
const bad = `zahl1 = input("Zahl 1: ")\nzahl2 = input("Zahl 2: ")\nprint(zahl1 + zahl2)`;
const r1 = context.window.BPSLearningCoachEngine.evaluatePythonSubmission({level:l4, exam:l4.finalExam, examType:'final', code:good});
const r2 = context.window.BPSLearningCoachEngine.evaluatePythonSubmission({level:l4, exam:l4.finalExam, examType:'final', code:bad});
console.log('v990 qa', {levelCount:db.levels.length, good:r1.score, goodPassed:r1.passed, bad:r2.score, badPassed:r2.passed, badErrors:r2.errorCategories});
if(!r1.passed) throw new Error('Good Level 4 did not pass');
if(r2.passed) throw new Error('Bad Level 4 unexpectedly passed');
