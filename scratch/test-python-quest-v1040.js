const fs = require('fs');
const vm = require('vm');
const path = require('path');
const sandbox = { window:{}, console, localStorage:{_s:{},getItem(k){return this._s[k]||null},setItem(k,v){this._s[k]=String(v)},removeItem(k){delete this._s[k]}}, Date, Math, JSON, RegExp, String, Number, Array, Object };
sandbox.window = sandbox;
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(path.join(__dirname,'../data/python-quest-db.js'),'utf8'), sandbox);
vm.runInContext(fs.readFileSync(path.join(__dirname,'../js/learning-coach-engine.js'),'utf8'), sandbox);
const db = sandbox.PYTHON_QUEST_DB;
const engine = sandbox.BPSLearningCoachEngine;
function level(id){ return db.levels.find(l=>l.id===id); }
function evalCode(id,type,code,reflection){ const l=level(id); const exam=type==='mid'?l.midExam:l.finalExam; return engine.evaluatePythonSubmission({level:l, exam, examType:type, code, reflection, referenceCode:''}); }
const good7 = `# Zahlen-Generator: Startwerte festlegen
start = 1
ende = 11
schritt = 2
summe = 0

# geht die Zahlen durch und rechnet sie zur Summe dazu
for zahl in range(start, ende, schritt):
    print(f"Zahl: {zahl}")
    summe += zahl

print(f"Summe: {summe}")`;
const bad7 = `# fragt bis stop
zahl = 1
while zahl < 5:
    print(zahl)
    zahl += 1`;
const good8 = `# Einkaufsliste: Produkte sammeln
einkauf = ["Milch"]
einkauf.append("Brot")
einkauf.append("Äpfel")

# Ausgabe: zeigt Liste, Anzahl und ersten Eintrag
print("=== Einkaufsliste ===")
print(f"Alle Produkte: {einkauf}")
print(f"Anzahl: {len(einkauf)}")
print(f"Erster Eintrag: {einkauf[0]}")`;
const bad8 = `# einkauf
produkt1 = "Milch"
produkt2 = "Brot"
print(produkt1)`;
const r7=evalCode('py_level_07','final',good7,'Ich nutze for und range, damit die Zahlen fest durchlaufen. Die Schleife geht jede Zahl durch, gibt sie aus und rechnet sie zur Summe dazu.');
const rb7=evalCode('py_level_07','final',bad7,'Das läuft irgendwie durch.');
const r8=evalCode('py_level_08','final',good8,'Ich nutze eine Liste für mehrere Produkte, append packt Einträge rein, len zählt die Anzahl und einkauf[0] zeigt den ersten Eintrag.');
const rb8=evalCode('py_level_08','final',bad8,'Das speichert Einkauf.');
console.log(JSON.stringify({version:db.version, levels:db.levels.length, l7:r7.score, l7pass:r7.passed, bad7:rb7.score, bad7pass:rb7.passed, l8:r8.score, l8pass:r8.passed, bad8:rb8.score, bad8pass:rb8.passed},null,2));
if(db.version !== '10.4.0') process.exit(2);
if(db.levels.length !== 30) process.exit(3);
if(!r7.passed || rb7.passed || !r8.passed || rb8.passed) process.exit(4);
