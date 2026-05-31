const fs=require('fs'); const vm=require('vm'); const path=require('path');
const root=path.resolve(__dirname,'..');
const store={};
const ctx={window:{}, console, localStorage:{getItem:k=>store[k]||null,setItem:(k,v)=>{store[k]=String(v)},removeItem:k=>{delete store[k]}}, document:{}, navigator:{}};
ctx.window=ctx; ctx.global=ctx;
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(root,'data/python-quest-db.js'),'utf8'),ctx);
vm.runInContext(fs.readFileSync(path.join(root,'js/learning-coach-engine.js'),'utf8'),ctx);
const db=ctx.PYTHON_QUEST_DB; const engine=ctx.BPSLearningCoachEngine;
function level(n){ return db.levels[n-1]; }
function test(n, code, reflection){ const l=level(n); const res=engine.evaluatePythonSubmission({level:l, exam:l.finalExam, examType:'final', code, reflection}); console.log('L'+n, res.score, res.passed, res.knockoutReasons); return res; }
if(db.version!=='10.5.0') throw new Error('bad db version '+db.version);
let good9=`# Liste wird ausgewertet und die Punkte werden zusammengerechnet
punkte = [8, 10, 6, 9, 7]
gesamt = 0
for punkt in punkte:
    print(f"Punkt: {punkt}")
    gesamt += punkt

durchschnitt = gesamt / len(punkte)
print(f"Gesamtpunkte: {gesamt}")
print(f"Durchschnitt: {durchschnitt}")`;
let bad9=`p1=8
p2=10
print(p1)
print(p2)`;
let good10=`# Startwert: hier sammelt das Quiz die richtigen Antworten
punkte = 0

# erste Frage wird abgefragt und geprüft
antwort1 = input("Welcher Befehl gibt Text aus? ")
if antwort1 == "print":
    punkte += 1
    print("Richtig!")
else:
    print("Falsch.")

antwort2 = input("Womit wandelt man Text in eine ganze Zahl um? ")
if antwort2 == "int":
    punkte += 1
    print("Richtig!")
else:
    print("Falsch.")

antwort3 = input("Welche Schleife nutzt range()? ")
if antwort3 == "for":
    punkte += 1
    print("Richtig!")
else:
    print("Falsch.")

print(f"Du hast {punkte} Punkte erreicht.")
if punkte >= 2:
    print("Bestanden")
else:
    print("Weiter üben")`;
let bad10=`antwort=input("Befehl? ")
if antwort == "print":
    print("richtig")`;
let r9=test(9, good9, 'Das Programm hat eine Punkteliste, geht mit for jeden Punkt durch, zählt die Summe zusammen und gibt Gesamtpunkte und Durchschnitt aus.');
let b9=test(9, bad9, 'Da sind Punkte drin.');
let r10=test(10, good10, 'Das Quiz stellt drei Fragen, prüft jede Antwort mit if, erhöht den Punktestand bei richtig und zeigt am Ende den Score.');
let b10=test(10, bad10, 'Eine Frage.');
if(!r9.passed || b9.passed || !r10.passed || b10.passed) throw new Error('phase10 coach tests failed');
console.log('V10.5.0 Phase 10 QA ok');
