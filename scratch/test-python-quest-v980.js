// V9.8.0 Python Quest Phase 3 QA smoke test (run from project root with: node scratch/test-python-quest-v980.js)
const fs = require('fs');
const vm = require('vm');
const path = require('path');
const root = process.cwd();
const store = {};
const ctx = { console, window:{}, document:{}, localStorage:{ getItem:k=>store[k]||null, setItem:(k,v)=>{ store[k]=String(v); }, removeItem:k=>delete store[k] }, setTimeout, clearTimeout };
ctx.window = ctx;
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(root,'data/python-quest-db.js'),'utf8'), ctx);
vm.runInContext(fs.readFileSync(path.join(root,'js/learning-coach-engine.js'),'utf8'), ctx);
const db = ctx.PYTHON_QUEST_DB;
if(!db || db.levels.length !== 30) throw new Error('Python DB muss 30 Level enthalten.');
if(!db.levels[2].finalExam || !db.levels[2].finalExam.testCases.some(t => t.type === 'count_input')) throw new Error('Level 3 count_input fehlt.');
const goodL3 = `# Dialogprogramm Level 3
name = input("Wie heißt du? ")
stadt = input("Aus welcher Stadt kommst du? ")
ziel = input("Was ist dein Python-Ziel? ")
print("====================")
print(f"Name: {name}")
print(f"Stadt: {stadt}")
print(f"Ziel: {ziel}")
print("Danke für deine Eingaben!")`;
const ok = ctx.BPSLearningCoachEngine.evaluatePythonSubmission({mode:'python_exam', levelId:'py_level_03', examType:'final', level:db.levels[2], exam:db.levels[2].finalExam, code:goodL3});
const bad = ctx.BPSLearningCoachEngine.evaluatePythonSubmission({mode:'python_exam', levelId:'py_level_03', examType:'final', level:db.levels[2], exam:db.levels[2].finalExam, code:'print("Hallo")'});
if(!ok.passed || ok.score < 86) throw new Error('Gute Level-3-Abgabe muss bestehen.');
if(bad.passed) throw new Error('Schlechte Level-3-Abgabe darf nicht bestehen.');
console.log('V9.8.0 Python Quest Phase 3 QA ok', { l3: ok.score, l3bad: bad.score, inputCount: ok.diagnostics.inputCount });
