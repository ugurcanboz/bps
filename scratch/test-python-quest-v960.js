const fs = require('fs');
global.window = global;
const store = {};
global.localStorage = {
  getItem:k => Object.prototype.hasOwnProperty.call(store,k) ? store[k] : null,
  setItem:(k,v) => { store[k]=String(v); },
  removeItem:k => { delete store[k]; }
};
function load(path){ const code = fs.readFileSync(path,'utf8'); (0,eval)(code); }
load('data/python-quest-db.js');
load('js/learning-coach-engine.js');
if(!window.PYTHON_QUEST_DB || window.PYTHON_QUEST_DB.levels.length !== 30) throw new Error('Python DB levels != 30');
const level = window.PYTHON_QUEST_DB.levels[0];
const good = `# Vorstellungsprogramm\nname = "Mira"\nziel = "Python lernen"\nprint("Hallo Welt")\nprint(name)\nprint(ziel)`;
const bad = `print("Hallo"`;
const goodResult = window.BPSLearningCoachEngine.evaluatePythonSubmission({level, exam:level.finalExam, examType:'final', code:good});
const badResult = window.BPSLearningCoachEngine.evaluatePythonSubmission({level, exam:level.finalExam, examType:'final', code:bad});
if(!goodResult.passed || goodResult.score < 85) throw new Error('Good Level 1 code did not pass: '+JSON.stringify(goodResult));
if(badResult.passed) throw new Error('Bad code passed unexpectedly');
console.log('Python Quest V9.6.0 self-check OK', {levels:window.PYTHON_QUEST_DB.levels.length, goodScore:goodResult.score, badScore:badResult.score});
