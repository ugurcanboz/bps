# G52.6 / Phase 20 — Question Flow Engine

## Ziel

Phase 20 trennt die öffentliche Quiz-/Question-Control-Schicht stärker von `js/app.js`.
Die App soll Fragensteuerung, Navigation und Antwortaktionen künftig über eine zentrale Engine ansprechen, statt diese Callpoints direkt über lose Einzel-Funktionen zu bedienen.

## Neue Datei

- `js/core/question-flow-engine.js`

## Neue Engine

- `window.EGTQuestionFlowEngine`
- `window.QuestionFlowEngine`
- `App._test.QuestionFlowEngine`

## Zentralisierte Aufrufe

- `showQuestion(...)`
- `tickTimer()`
- `pauseTimer()`
- `resumeTimer()`
- `nextQuestion()`
- `prevQuestion()`
- `jumpToQuestion(index)`
- `skipQuestion()`
- `spQuestion()`
- `manualNextQuestion()`
- `chooseAnswer(index, button)`
- `recordAnswer(given, correct, timeout)`
- `toggleMarkQuestion()`
- `updateQuestionNav()`
- `nextBlockIndex(from)`

## Sicherheitsentscheidung

Das visuelle Rendering der einzelnen Aufgabentypen bleibt in Phase 20 bewusst als Internal-Adapter bestehen. Dadurch wird die in G51.x stabilisierte UI nicht durch einen zu großen Umbau gefährdet. Die öffentliche Steuerung läuft jedoch bereits über die neue Engine-Grenze.

## Geänderte Dateien

- `index.html`
- `js/app.js`
- `js/core/question-flow-engine.js`
- `js/core/architecture-guard.js`
- `js/core/app-config.js`
- `service-worker.js`
- `manifest.json`
- `update-check.json`
- `module-manifest.json`
- `docs/WORKING-PLAN.md`
- `WORKING-PLAN_1.md`

## Nächster Schritt

Phase 21 sollte die Aufgaben-Orchestrierung modularisieren:

- `buildQuiz()`
- Generator-Auswahl
- Modus-spezifische Aufgabenmischung
- adaptive Fragenpipeline
- Aufgabenbank-Routing
