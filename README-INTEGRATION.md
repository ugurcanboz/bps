# BPS-Trainer · KI Coach V9.5.8 Phase C Premium UX Polish

Dieses Paket enthält den Coach als andockbares Modul. Die Haupt-App muss später nicht umgebaut werden, sondern bindet den Coach über klar definierte Einstiegspunkte ein.

## Dateien

Pflicht:

```html
<link rel="stylesheet" href="./css/learning-coach.css?v=9.5.8">
<script src="./data/coach-knowledge-base.js?v=9.5.8"></script>
<script src="./js/learning-coach-engine.js?v=9.5.8"></script>
<script src="./js/learning-coach-ui.js?v=9.5.8"></script>
```

Empfohlen, damit der Coach echte Datenbank-Aufgaben nutzen kann:

```html
<script src="./data/question-bank.js"></script>
<script src="./data/question-bank-mathe.js"></script>
<script src="./data/question-bank-kaufm.js"></script>
<script src="./data/question-bank-sozial.js"></script>
<script src="./data/question-bank-it-extra.js"></script>
```

## Optionale Konfiguration vor dem UI-Script

```html
<script>
window.BPSLearningCoachConfig = {
  autoMount: true,
  mountSelector: 'body',
  injectHomeCard: true,
  injectQuizButton: true,
  patchAppHelp: true,
  pauseAppTimer: true,
  enableSpeech: true,
  debug: false
};
</script>
```

Für isolierte Integration oder Tests:

```js
window.BPSLearningCoachConfig = { autoMount:false };
// nach dem Laden:
BPSLearningCoach.init({ injectHomeCard:false, injectQuizButton:false, patchAppHelp:false });
```

## Öffentliche API

```js
BPSLearningCoach.init(options);                // Coach starten, mehrfacher Aufruf ist sicher
BPSLearningCoach.destroy();                    // UI/Observer entfernen, App-Hilfe-Patch zurückdrehen
BPSLearningCoach.configure(options);           // Optionen ändern
BPSLearningCoach.openHub();                    // Deep Sheet öffnen
BPSLearningCoach.ask('Zeig meinen Fortschritt');
BPSLearningCoach.startTraining('logic', 4, 5, 'focus-5');
BPSLearningCoach.recordAnswer(historyItem, task); // App-Ergebnisse in Coach-Memory speichern
BPSLearningCoach.getState();                   // Debug-/Status-Snapshot
```

Engine direkt:

```js
BPSLearningCoachEngine.readinessScore();
BPSLearningCoachEngine.commandCenter();
BPSLearningCoachEngine.trainingModes();
BPSLearningCoachEngine.integrationContract();
```


## Wichtig: Datenbank-DNA ist Qualitätsvoraussetzung

Der Coach funktioniert ohne DNA über Fallback-Schätzung, aber seine Lernintelligenz wird erst mit sauber getaggten Aufgaben wirklich präzise.

Für die Integration sind deshalb zwei Dokumente relevant:

- `MINI-DATENBANK-DNA.md` – praktische Anleitung zum Taggen einzelner Aufgaben
- `docs/DATABASE_DNA_INTEGRATION_CONTRACT.md` – verbindliche Integrationsregeln für Entwickler

Neue Aufgaben sollten nicht mehr ohne `dna`-Objekt angelegt werden. Alte Aufgaben können schrittweise nachgetaggt werden.

## Ergebnisübergabe aus der Haupt-App

Nach jeder beantworteten Aufgabe sollte die App den Coach informieren:

```js
BPSLearningCoach.recordAnswer({
  cat: 'Mathe',
  group: 'Zahlenreihen',
  correct: true,
  givenIndex: 1,
  correctIndex: 1,
  duration: 8200,
  allowed: 20000
}, currentTask);
```

`currentTask` sollte möglichst enthalten:

```js
{
  id: 'task_123',
  cat: 'Mathe',
  type: 'Zahlenreihe',
  q: '2, 4, 8, 16, ?',
  a: ['18','24','32','36'],
  correct: 2,
  trap: 'Addition statt Multiplikation vermutet'
}
```

## Qualitätsregeln in V9.5.6

- keine Doppelinitialisierung
- `destroy()` für sauberes Entfernen
- Speech kann deaktiviert werden
- Home-Card, Quiz-Button und App-Hilfe-Patch sind einzeln abschaltbar
- Bubble-Position bleibt gespeichert und wird auf neue Bildschirmgrößen begrenzt
- kaputte Sessions werden abgefangen
- Coach-Memory bleibt lokal

## Test

Zum isolierten Test `coach-demo.html` im Browser öffnen. Dort kann der Coach ohne Haupt-App gestartet, gefragt und mit Demo-Aufgaben gefüttert werden.

---

## V9.5.6 Learning Intelligence Core

Dieses Modul enthält jetzt zusätzlich:

- `normalizeTaskDNA(task)` – vereinheitlicht oder schätzt Aufgaben-DNA
- `effectiveDifficulty(taskOrDna)` – berechnet persönliche Schwierigkeit
- `learningIntelligenceReport()` – liefert Lernlevel, Wiederholungsstatus, schwache/starke Skills und letzte Auswahlgründe
- `dueSpacedItems()` – zeigt fällige Wiederholungen
- `taskDebugInfo(task)` – erklärt, warum eine Aufgabe didaktisch relevant ist
- `lastDecisionLog()` – Debug-Nachweis für adaptive Auswahl

Für neue Aufgaben bitte zwingend `MINI-DATENBANK-DNA.md` nutzen. Für die spätere Einbindung zusätzlich `docs/DATABASE_DNA_INTEGRATION_CONTRACT.md` beachten.

## V9.5.6 Precision Learning Path

Dieses Modul erweitert die Lernintelligenz um fünf produktrelevante Systeme:

1. **Feinere Fehlerdiagnose pro Aufgabentyp**  
   Der Coach unterscheidet nicht nur `richtig/falsch`, sondern erkennt je nach DNA z. B. `linear_statt_wechsel`, `grundwert_endwert_verwechselt`, `direkt_indirekt_verwechselt`, `it_ursache_verwechselt` oder `aehnliche_zeichen_verwechselt`.

2. **Echte Lernkurve mit Vorhersage**  
   Aus Tagesdaten wird ein Trend berechnet. Der Coach liefert `predicted7d`, `predicted14d`, `trendPerDay` und einen Confidence-Wert. Das ist ein Trainingsindikator, keine Garantie.

3. **Präzise Revanche-Aufgaben**  
   Revanche bevorzugt nicht mehr nur ähnliche Kategorien, sondern denselben `skillKey`, denselben `subtype` und möglichst dieselbe `trap`. Dadurch trainiert der Nutzer denselben Denkfehler in einer neuen Aufgabe.

4. **Langfristige Prüfungsampel**  
   `examTrafficLight()` liefert für BPS und CTC jeweils `stabil`, `riskant` oder `kritisch` inklusive kurzer Begründung. Die Ampel nutzt Readiness, Stabilität, Datenmenge und Schwächenrisiko.

5. **Decision-/Debug-Nachweis**  
   Die Integration kann über `learningIntelligenceReport()`, `examTrafficLight()` und `lastDecisionLog()` prüfen, warum eine Aufgabe ausgewählt wurde.

### Neue API-Funktionen

```js
BPSLearningCoachEngine.diagnoseMistakeDetailed(payload, dna)
BPSLearningCoachEngine.learningCurveReport()
BPSLearningCoachEngine.examTrafficLight()
BPSLearningCoachEngine.preciseRevengeProfile()
```

### Wichtig für Integratoren

Damit die Präzisionslogik wirklich greift, muss die Haupt-App bei jeder Antwort möglichst vollständig melden:

```js
BPSLearningCoachUI.recordAnswer(historyItem, task)
```

oder direkt:

```js
BPSLearningCoachEngine.recordMemory({
  taskId: task.id,
  task: task,
  dna: task.dna,
  correct: isCorrect,
  givenIndex: selectedIndex,
  selectedText: task.a[selectedIndex],
  correctIndex: task.correct,
  correctText: task.a[task.correct],
  duration: durationMs,
  mode: currentMode
});
```

Je sauberer `dna.subtype`, `dna.skill`, `dna.trap` und `dna.expectedTimeMs` gepflegt sind, desto genauer werden Diagnose, Revanche und Ampel.

## V9.5.6 Hinweis: Präzise Fehlerpfade brauchen Antworttext

Ab V9.5.6 kann der Coach Denkfehler feiner erkennen. Dafür sollte die Haupt-App beim Antworten nicht nur `correct: true/false`, sondern auch `selectedText`, `correctText`, `givenIndex`, `duration` und die Aufgaben-DNA übergeben.

Minimal gut:

```js
BPSLearningCoachUI.recordAnswer({
  taskId: task.id,
  correct: selectedIndex === task.correct,
  givenIndex: selectedIndex,
  selectedText: task.answers[selectedIndex],
  correctText: task.answers[task.correct],
  duration: elapsedMs,
  task: task,
  dna: task.dna
});
```

Warum wichtig: Nur so kann der Coach unterscheiden zwischen „nur Differenz geprüft“, „zweites Muster übersehen“, „DNS/IP verwechselt“ oder „richtige Regel, aber verrechnet“.

## V9.5.6 – Evidence-Based Coach Hinweis

Für maximale Präzision sollte die Haupt-App falsche Antwortoptionen mit `distractors` bzw. `distractorMap` ausstatten. Dadurch kann der Coach nicht nur feststellen, dass eine Antwort falsch war, sondern warum genau diese falsche Antwort gewählt wurde. Das verbessert Fehlerdiagnose, Revanche-Auswahl, Mastery-Score und Prüfungsampel.

---

## V9.5.7 – Phase B QA-Pflicht vor Integration

Vor dem Einbau in die Haupt-App muss das Coach-Modul mit der QA-Schicht geprüft werden.

### Automatische Prüfung

```bash
node --check js/learning-coach-engine.js
node --check js/learning-coach-ui.js
node --check service-worker.js
node scratch/test-coach-v9-5-7-enterprise-qa.js
```

### Browser-Prüfung

Öffne:

```text
coach-qa-runner.html
```

und führe aus:

```js
BPSLearningCoachEngine.qaSelfCheck()
BPSLearningCoachEngine.memoryHealthReport()
BPSLearningCoachEngine.validateTaskDNAContract(task)
BPSLearningCoachEngine.validateRecordAnswerPayload(payload, task)
```

### Integrationsregel

Die Haupt-App darf den Coach später nicht nur optisch einbauen. Sie muss bei jeder gelösten Aufgabe genügend Daten übergeben, damit folgende Systeme funktionieren:

- Fehler-DNA
- Mastery pro Skill
- Revanche nach Denkfehler
- Spaced Repetition
- Prüfungsampel
- Lernkurve

Minimal:

```js
BPSLearningCoach.recordAnswer({
  taskId: task.id,
  correct: isCorrect,
  selectedAnswer: selectedValue,
  correctAnswer: correctValue,
  timeMs: durationMs,
  task: task,
  dna: task.dna
});
```

Ohne diese Daten bleibt der Coach stabil, aber deutlich weniger intelligent.

Siehe zusätzlich:

- `docs/PHASE_B_QA_TEST_MATRIX.md`
- `docs/UPDATE_V9.5.7_ENTERPRISE_QA_HARDENING.md`
- `docs/DATABASE_DNA_INTEGRATION_CONTRACT.md`


## V9.5.8 – Phase C Premium UX Polish

Phase C verändert keine Lernlogik-Grundlage und entfernt keine Funktion. Ziel ist, dass der Coach beim späteren Einbau wie ein reifes Produkt wirkt:

- Command Center bekommt eine klare Coach-Einschätzung als erste Karte.
- Empty States erklären ruhig, was noch fehlt, statt technisch zu wirken.
- Empfehlungen sind kürzer, handlungsorientierter und weniger generisch.
- Feedback nach Antworten ist menschlicher: „Fehlerpfad erkannt“ statt bloß „falsch“.
- Aufgabenbank-Status zeigt jetzt auch DNA-Readiness, damit Integrator:innen sofort sehen, ob die Lernintelligenz belastbar arbeiten kann.
- Die Version wurde auf `9.5.8-phase-c-premium-ux-polish` angehoben.

Pflichttest für diese Phase:

```bash
node scratch/test-coach-v9-5-8-phase-c-ux.js
```

Integrationsregel: Beim Einbau darf das Command Center nicht als zusätzlicher Hauptscreen missverstanden werden. Es bleibt ein Coach-Deep-Sheet mit klarer Empfehlung, Dashboard und kurzer Aktion.

---

## Verbindliche DNA-Anleitung für die Aufgabenbank

Für die spätere Integration der Aufgabenbank gilt zusätzlich:

- `docs/DATABASE_DNA_INTEGRATION_GUIDE.md` = praktische Schritt-für-Schritt-Anleitung für das Tagging der Aufgaben
- `docs/DATABASE_DNA_INTEGRATION_CONTRACT.md` = technischer Integrationsvertrag
- `MINI-DATENBANK-DNA.md` = Kurzreferenz für schnelle Nachpflege

Wichtig: Neue Aufgaben sollen nicht mehr ohne DNA angelegt werden. Alte Aufgaben dürfen über Fallbacks weiterlaufen, sollen aber schrittweise nach dem Guide nachgezogen werden.


---

# V10.5.1 · Python Quest Integration

Das Python-Modul ist als eigener Lernbereich integriert und nutzt den bestehenden KI-Coach als Code-Prüfer. Für die Übergabe an Entwickler sind folgende Dokumente verbindlich:

- `PYTHON_QUEST_START_HERE.md`
- `docs/PYTHON_QUEST_INTEGRATION_GUIDE.md`
- `docs/PYTHON_QUEST_QA_CHECKLIST.md`
- `docs/PYTHON_QUEST_LEVEL_AUTHORING_GUIDE.md`

## Pflicht-Reihenfolge

```html
<link rel="stylesheet" href="./css/learning-coach.css?v=10.5.1">
<link rel="stylesheet" href="./css/python-quest.css?v=10.5.1">

<script src="./data/coach-knowledge-base.js?v=10.5.1"></script>
<script src="./data/python-quest-db.js?v=10.5.1"></script>
<script src="./js/learning-coach-engine.js?v=10.5.1"></script>
<script src="./js/learning-coach-ui.js?v=10.5.1"></script>
<script src="./js/python-quest-module.js?v=10.5.1"></script>
```

## API-Kopplung

```js
window.BPSLearningCoachEngine.evaluatePythonSubmission(payload)
window.PythonQuest.open()
window.PythonQuest.db()
window.PythonQuest.progress()
```

## Qualitätsregel

Python-Level gelten erst als vollständig, wenn Level-DNA, Zwischenprüfung, Abschlussprüfung, Coach-Testfälle, Struktur-/Kommentarbewertung, PDF-Lernmaterial und QA-Test vorhanden sind.
