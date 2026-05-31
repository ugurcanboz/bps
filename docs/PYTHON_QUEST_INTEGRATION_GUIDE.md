# Python Quest Academy · Integrationsleitfaden

Version: V10.5.1 Integrationspaket  
Basis: V10.5.0 Python Quest Phase 10 · Quiz Mastery

## 1. Ziel dieses Dokuments

Dieses Dokument erklärt, wie das Python-Lernmodul ohne Brüche in den bestehenden BPS-Trainer integriert wird.

Das Modul ist bewusst separat aufgebaut, damit die BPS-/CTC-Simulation sauber bleibt. Trotzdem ist es mit dem KI-Coach verbunden, damit Code-Abgaben geprüft, bewertet und für die Lernintelligenz gespeichert werden können.

## 2. Architektur in einem Satz

**Python Quest ist ein eigenständiger Lernpfad mit eigener Datenbank, nutzt aber den bestehenden KI-Coach als Code-Prüfer und Lernbegleiter.**

## 3. Pflichtdateien

### CSS

```text
css/learning-coach.css
css/python-quest.css
```

### Daten

```text
data/coach-knowledge-base.js
data/python-quest-db.js
```

### JavaScript

```text
js/learning-coach-engine.js
js/learning-coach-ui.js
js/python-quest-module.js
```

### PDFs

```text
docs/python-levels/python-level-01.pdf
...
docs/python-levels/python-level-10.pdf
```

## 4. Lade-Reihenfolge

Die Reihenfolge ist wichtig. Die Python-Datenbank muss vor dem Python-Modul geladen werden. Die Coach-Engine muss vor der Coach-UI und vor dem Python-Modul geladen werden.

Korrekt:

```html
<link rel="stylesheet" href="./css/learning-coach.css?v=10.5.1">
<link rel="stylesheet" href="./css/python-quest.css?v=10.5.1">

<script src="./data/coach-knowledge-base.js?v=10.5.1"></script>
<script src="./data/python-quest-db.js?v=10.5.1"></script>
<script src="./js/learning-coach-engine.js?v=10.5.1"></script>
<script src="./js/learning-coach-ui.js?v=10.5.1"></script>
<script src="./js/python-quest-module.js?v=10.5.1"></script>
```

Falsch:

```html
<script src="./js/python-quest-module.js"></script>
<script src="./data/python-quest-db.js"></script>
```

Grund: Das Modul initialisiert sich beim Laden. Wenn die Datenbank erst danach kommt, fehlen Level, Prüfungen und PDF-Verknüpfungen.

## 5. Öffentliche APIs

### Python Quest Modul

```js
window.PythonQuest.init()
window.PythonQuest.open()
window.PythonQuest.close()
window.PythonQuest.render()
window.PythonQuest.progress()
window.PythonQuest.analyze(payload)
window.PythonQuest.db()
window.PythonQuest.reset()
```

### KI-Coach Engine

```js
window.BPSLearningCoachEngine.evaluatePythonSubmission(payload)
```

Diese Funktion ist die zentrale Verbindung zwischen Python-Modul und Coach.

## 6. Datenfluss bei einer Abschlussprüfung

Ablauf:

1. Nutzer öffnet ein Python-Level.
2. Nutzer erledigt Lektionen, Checks und Praxisaufgaben.
3. Zwischenprüfung wird freigegeben.
4. Zwischenprüfung wird bewertet.
5. Erst danach wird die Abschlussprüfung freigegeben.
6. Nutzer lädt `.py` oder `.txt` hoch.
7. Code wird als Text extrahiert und angezeigt.
8. Python-Modul baut ein Prüf-Payload.
9. Coach bewertet über `evaluatePythonSubmission(payload)`.
10. Ergebnis wird gespeichert.
11. Bei bestandener Abschlussprüfung wird das nächste Level freigeschaltet.

## 7. Prüf-Payload

Das Python-Modul sendet an den Coach ungefähr diese Struktur:

```js
{
  mode: "python_exam",
  levelId: "py_level_05",
  examType: "final",
  task: "Entscheidungsprogramm bauen",
  code: "...hochgeladener Python-Code...",
  reflection: "Ich prüfe Alter und Punkte und gebe danach aus, ob bestanden wurde.",
  level: pythonLevelObject,
  exam: pythonLevelObject.finalExam,
  progress: currentProgress
}
```

## 8. Coach-Antwort

Der Coach liefert eine strukturierte Bewertung:

```js
{
  passed: true,
  score: 91,
  requiredScore: 86,
  rubricScores: {
    syntax: 20,
    concepts: 20,
    logic: 19,
    structure: 18,
    readability: 8,
    comments: 5,
    reflection: 5
  },
  errors: [],
  strengths: [],
  improvements: [],
  errorCategories: [],
  knockoutReasons: [],
  repairDrill: null,
  diagnostics: {}
}
```

## 9. Freischaltlogik

Ein Level gilt erst als bestanden, wenn die Abschlussprüfung bestanden wurde.

Vereinfacht:

```js
if (result.passed && result.score >= exam.requiredScore) {
  progress.levels[levelId].finalExam.passed = true;
  unlockNextLevel();
}
```

Wichtig: Die App darf nicht nur Buttons verstecken. Die Analysefunktion selbst muss ebenfalls prüfen, ob eine Prüfung bereits freigegeben ist. Diese doppelte Absicherung ist eingebaut.

## 10. Zwischenprüfung und Abschlussprüfung

### Zwischenprüfung

Wird freigegeben, wenn im Level erledigt sind:

- Mini-Lektionen
- Verständnischecks
- Praxisaufgaben

### Abschlussprüfung

Wird freigegeben, wenn zusätzlich gilt:

- Zwischenprüfung bestanden

### Nächstes Level

Wird freigegeben, wenn zusätzlich gilt:

- Abschlussprüfung bestanden

## 11. Separate Python-Datenbank

Die Python-Aufgaben gehören nicht in die normale BPS-/CTC-Fragenbank.

Richtig:

```text
data/python-quest-db.js
```

Nicht mischen mit:

```text
data/question-bank.js
data/question-bank-mathe.js
data/question-bank-kaufm.js
```

Grund: Python Quest ist kein Zeitdruck-Simulationsteil, sondern ein Lernpfad mit Code-Abgaben, Prüfungen, PDFs und Coach-Bewertung.

## 12. Level-DNA

Jedes Python-Level braucht:

```js
{
  id: "py_level_XX",
  title: "...",
  band: "Beginner / Basic / Intermediate / ...",
  summary: "...",
  concepts: ["..."],
  pdf: "docs/python-levels/python-level-XX.pdf",
  lessons: [],
  checks: [],
  practiceTasks: [],
  midExam: {},
  finalExam: {}
}
```

## 13. Prüfungs-DNA

Jede Prüfung braucht:

```js
{
  id: "py_level_XX_final",
  title: "Abschlussprüfung · ...",
  requiredScore: 86,
  task: "...",
  requiredConcepts: [],
  requiredTokens: [],
  forbiddenTokens: ["eval(", "exec(", "__import__(", "subprocess", "os.system"],
  knockoutErrors: [],
  testCases: [],
  rubric: []
}
```

## 14. Notenschlüssel

Der Coach bewertet nicht nur Funktion, sondern auch Struktur und Verständlichkeit.

Standardlogik:

```text
Syntax: 20
Pflichtkonzepte: 20
Logik/Testfälle: 20
Struktur: 20
Lesbarkeit: 10
Kommentare: 5
Verständnisnachweis: 5
Gesamt: 100
```

Wichtig: Chaos-Code kann durchfallen, auch wenn er teilweise funktioniert.

## 15. Kommentar-Intelligenz

Der Coach bewertet Kommentare nach Sinn und Kontext, nicht nur nach Vorhandensein.

Akzeptiert wird auch Umgangssprache, zum Beispiel:

```python
# checkt ob der User alt genug ist
# holt sich die Zahl vom Nutzer
# rechnet alles zusammen
# ballert die Frage so lange raus bis stop kommt
```

Nicht akzeptiert:

```python
# hallo
# Python ist cool
# hier wird addiert
zahl = a / b
```

Regel:

> Der Kommentar darf locker formuliert sein, aber er muss zum Codeabschnitt passen.

## 16. Strukturprüfung

Der Coach prüft, ob Code sinnvoll aufgebaut ist.

Frühe Level:

```text
Daten / Eingabe
Verarbeitung
Ausgabe
```

Spätere Level:

```text
Daten / Konstanten
Funktionen
Hauptprogramm
Ausgabe / Ergebnis
```

Schleifen- und Quiz-Level werden kontextsensibel bewertet. Eine Ausgabe innerhalb einer Schleife ist nicht automatisch schlecht, wenn sie zur Aufgabe gehört.

## 17. Fehler-DNA und Reparaturtraining

Bei Fehlern speichert der Coach Kategorien:

- `syntax`
- `type_conversion`
- `logic`
- `structure`
- `comment_quality`
- `variable_quality`
- `loop_exit`
- `list_usage`
- `score_logic`

Aus wiederholten Fehlern entstehen Reparaturaufgaben.

Beispiel:

Fehler: `input()` ohne `int()`  
Reparatur: Zwei Zahlen abfragen, beide umwandeln, Summe und Produkt ausgeben.

## 18. PDF-Integration

Jedes Level bekommt einen PDF-Link.

Beispiel:

```js
pdf: "docs/python-levels/python-level-05.pdf"
```

Die PDFs müssen im Service Worker gecacht werden, sonst sind sie offline eventuell nicht verfügbar.

## 19. Service Worker / PWA

Neue oder geänderte Dateien müssen in `service-worker.js` in `ASSETS` stehen.

Pflicht für Python Quest:

```js
'./css/python-quest.css',
'./data/python-quest-db.js',
'./js/python-quest-module.js',
'./docs/python-levels/python-level-01.pdf',
'./docs/python-levels/python-level-10.pdf'
```

Bei jeder neuen Version Cache-Namen erhöhen:

```js
var CACHE_NAME = 'bps-trainer-v10-5-1-python-quest-integration-guide';
```

Sonst kann auf iPhone/Android noch alte Logik geladen werden.

## 20. Minimaler Integrationstest

Nach dem Einbau im Browser ausführen:

```js
console.log(window.PythonQuest.version);
console.log(window.PythonQuest.db().levels.length);
console.log(typeof window.BPSLearningCoachEngine.evaluatePythonSubmission);
```

Erwartung:

```text
Version wird angezeigt
30
function
```

## 21. Beispiel: Coach manuell testen

```js
const level = window.PythonQuest.db().levels.find(l => l.id === 'py_level_05');
const payload = {
  mode: 'python_exam',
  levelId: 'py_level_05',
  examType: 'final',
  level,
  exam: level.finalExam,
  code: `# checkt Alter und Punkte
alter = int(input("Alter: "))
punkte = int(input("Punkte: "))
if alter >= 18 and punkte >= 70:
    print(f"Bestanden mit {punkte} Punkten")
elif alter < 18:
    print("Nicht zugelassen")
else:
    print("Nicht bestanden")`,
  reflection: 'Ich prüfe erst Alter und Punkte. Danach entscheidet if/elif/else, welche Ausgabe passt.'
};

window.BPSLearningCoachEngine.evaluatePythonSubmission(payload);
```

## 22. Häufige Fehler

### Python Quest öffnet sich nicht

Prüfen:

```js
typeof window.PythonQuest
```

Wenn `undefined`: Script nicht geladen oder Reihenfolge falsch.

### Level sind leer

Prüfen:

```js
window.PYTHON_QUEST_DB
```

Wenn leer: `data/python-quest-db.js` fehlt oder wurde nach dem Modul geladen.

### Coach bewertet nicht vollständig

Prüfen:

```js
typeof window.BPSLearningCoachEngine.evaluatePythonSubmission
```

Wenn nicht `function`: Coach-Engine fehlt oder alte Version hängt im Cache.

### Neue PDFs öffnen nicht

Prüfen:

- Datei liegt wirklich in `docs/python-levels/`
- Pfad steht im Level-Objekt
- Pfad steht im Service Worker Cache
- Browser-Cache/Service Worker aktualisiert

## 23. Integrationsentscheidung

Das Python-Modul wird nicht als externes Add-on behandelt, sondern als integrierter Lernbereich.

Richtig:

```text
BPS-Trainer
├── Simulationen
├── Coach-Training
└── Python Quest Academy
```

Nicht richtig:

```text
BPS-Trainer
└── fremde zweite Python-App
```

## 24. Qualitätsregel für weitere Entwicklung

Neue Python-Level dürfen erst als fertig gelten, wenn vorhanden sind:

- Level-Datenbankeintrag
- Lektionen
- MC-Checks
- Praxisaufgaben
- Zwischenprüfung
- Abschlussprüfung
- Coach-Testfälle
- Struktur- und Kommentarbewertung
- PDF-Lernmaterial
- Service Worker Eintrag
- QA-Test mit guter und schlechter Lösung
