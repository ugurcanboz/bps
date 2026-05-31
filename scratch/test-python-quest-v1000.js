const fs = require('fs');
const vm = require('vm');
const ctx = { console, window:{}, localStorage:{_:{},getItem(k){return this._[k]||null},setItem(k,v){this._[k]=String(v)},removeItem(k){delete this._[k]}}, document:{addEventListener(){}, getElementById(){return null}, querySelector(){return null}, body:{insertAdjacentHTML(){}}}, setTimeout(fn){}, navigator:{} };
ctx.window = ctx;
vm.createContext(ctx);
vm.runInContext(fs.readFileSync('data/python-quest-db.js','utf8'), ctx);
vm.runInContext(fs.readFileSync('js/learning-coach-engine.js','utf8'), ctx);
const DB = ctx.PYTHON_QUEST_DB;
const engine = ctx.BPSLearningCoachEngine;
function evalCode(levelId, type, code){
 const level = DB.levels.find(l=>l.id===levelId);
 const exam = type==='mid'?level.midExam:level.finalExam;
 return engine.evaluatePythonSubmission({mode:'python_exam',levelId,examType:type,level,exam,code});
}
const good = `# Eingabe: Alter und Punktzahl vom Nutzer holen
alter = int(input("Alter: "))
punkte = int(input("Punktzahl: "))

# Entscheidung: erst Alter checken, dann Punkte bewerten
if alter < 18:
    print(f"Mit {alter} bist du nicht zugelassen.")
elif punkte >= 70:
    print(f"Bestanden: {punkte} Punkte reichen aus.")
else:
    print(f"Nicht bestanden: {punkte} Punkte reichen noch nicht.")`;
const badComment = `# Python ist cool
alter = int(input("Alter: "))
punkte = int(input("Punktzahl: "))
if alter > 18:
    print("ok")
else:
    print("no")`;
const chaos = `a=input("Alter: ")
print("Start")
b=input("Punkte: ")
if a > 18:
 print("ok")
else:
 print("no")
# egal`;
const r1=evalCode('py_level_05','final',good);
const r2=evalCode('py_level_05','final',badComment);
const r3=evalCode('py_level_05','final',chaos);
console.log('DB version', DB.version, 'levels', DB.levels.length, DB.levels[4].title);
console.log('good', r1.score, r1.passed, r1.rubricScores, r1.diagnostics.commentQuality, r1.diagnostics.structureQuality);
console.log('badComment', r2.score, r2.passed, r2.rubricScores, r2.diagnostics.commentQuality, r2.improvements.slice(0,4));
console.log('chaos', r3.score, r3.passed, r3.rubricScores, r3.diagnostics.structureQuality, r3.errorCategories);
if(DB.version !== '10.0.0') throw new Error('version failed');
if(DB.levels.length !== 30) throw new Error('level count failed');
if(!r1.passed || r1.score < 88) throw new Error('good level5 should pass');
if(r2.passed) throw new Error('bad comment / bad logic should not pass');
if(r3.passed) throw new Error('chaos should not pass');
if(r2.diagnostics.commentQuality.score >= 5) throw new Error('bad comment quality should be low');
