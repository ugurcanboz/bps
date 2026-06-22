# G40.1 — Phase 2A Simulations-ModuleHost

## Ziel
Die Simulation soll nicht mehr direkt blind aus dem alten `app.js`-Monolithen starten, sondern über eine eigene Modulschicht: `Shell → EGTSimulation ModuleHost → Legacy-Adapter → bestehende Quizlogik`.

## Umgesetzte Dateien

### Neu
- `js/modules/egt-simulation-engine.js`
- `css/egt-simulation.css`
- `docs/G40_1_PHASE2_SIMULATION_MODULEHOST_REPORT.md`
- `docs/G40_1_PHASE2_SIMULATION_MODULEHOST_QA.json`

### Geändert
- `index.html`
- `js/app.js`
- `js/core/app-config.js`
- `service-worker.js`
- `update-check.json`
- `manifest.json`
- `module-manifest.json`
- `docs/WORKING-PLAN.md`
- `../WORKING-PLAN_1.md`

## Was wurde genau getan?

### 1. Simulationsmodul eingeführt
`js/modules/egt-simulation-engine.js` stellt jetzt `window.EGTSimulation` bereit.

Öffentliche API:
- `EGTSimulation.init(adapter)`
- `EGTSimulation.start(config)`
- `EGTSimulation.finish(summary)`
- `EGTSimulation.abort(reason)`
- `EGTSimulation.restart()`
- `EGTSimulation.getSession()`
- `EGTSimulation.on(event, fn)`

Events:
- `egt:simulation:ready`
- `egt:simulation:starting`
- `egt:simulation:started`
- `egt:simulation:finished`
- `egt:simulation:aborted`
- `egt:simulation:failed`

### 2. App an ModuleHost angebunden
In `js/app.js` wurde `initSimulationModuleHost()` ergänzt. Diese Funktion verbindet `EGTSimulation` mit der bestehenden App-Logik.

Wichtige Änderung:
- `startQuiz()` ist jetzt der öffentliche Wrapper.
- Die alte Startlogik steckt in `startQuizInternal()`.
- Der Start läuft dadurch jetzt über `EGTSimulation.start(config)` und dann kontrolliert über den Legacy-Adapter.

Das schützt Gate/Login/Profil/Highscore, weil die alte Logik nicht brutal entfernt wurde.

### 3. Simulation-Layout zentralisiert
`css/egt-simulation.css` enthält jetzt zentrale Simulation-Styles für:
- Topbar
- Timer-Ring
- Timer-Label
- Frageübersicht-Drawer
- 30er-Pagination im Drawer
- Antwortkarten
- Mobile Breiten

Damit liegen die wichtigsten Simulation-Layout-Regeln nicht mehr nur verteilt in `app.css` und `ui-foundation.css`.

### 4. Ergebnisbereich verbessert
In `index.html` wurde der Ergebnisbereich erweitert:
- Button `Zurück zur Startseite`
- Button `Nochmal starten`
- Button `Fehleranalyse`

Damit ist die Forderung aus Phase 2 erfüllt, dass nach Testende sauber zur Startseite zurückgegangen werden kann.

### 5. PWA/Cache repariert und erweitert
`service-worker.js` cached jetzt zusätzlich:
- `./js/modules/egt-simulation-engine.js`
- `./css/egt-simulation.css`

`manifest.json` war leer/ungültig und wurde als gültiges PWA-Manifest neu erstellt.

### 6. Version synchronisiert
`js/core/app-config.js` wurde auf `G40.1` gesetzt.
Danach wurde `node sync-version.js` ausgeführt.
Synchronisiert wurden:
- `service-worker.js`
- `update-check.json`
- `manifest.json`

## Bewusste technische Entscheidung
Phase 2 wurde nicht als komplette harte Extraktion in einem einzigen Schritt umgesetzt. Grund: `app.js` enthält Simulation, Duell, EDV-Multi, Route-Memory, Coach-Hooks, Profil-Gate und Highscore noch stark vermischt.

Deshalb wurde zuerst die sichere ModuleHost-Schicht gesetzt. Die nächste KI kann jetzt ab Phase 2B Funktion für Funktion verschieben, ohne die Startlogik erneut anfassen zu müssen.

## Offene Arbeit für Phase 2B
Folgende Funktionen liegen noch in `app.js` und sollen schrittweise nach `js/modules/egt-simulation-engine.js` migriert werden:
- `showQuestion`
- `tickTimer`
- `renderAnswers`
- `updateQuestionNav`
- `chooseAnswer`
- `recordAnswer`
- `nextQuestion`
- `manualNextQuestion`
- `skipQuestion`
- `showResult`

Die Fragen-Erzeugung (`buildQuiz`, Generatoren, QuestionBank) bleibt zunächst im App-Core und sollte später als eigener QuestionPool getrennt werden.

## Tests
Durchgeführt:
- `node --check` für alle JS-Dateien in `js/` und `data/`
- JSON-Validierung für `manifest.json`, `update-check.json`, `module-manifest.json`
- Service-Worker-Assetprüfung: alle referenzierten Dateien existieren
- HTML-Referenzprüfung: alle eingebundenen Scripts/Styles/Assets existieren

Nicht vollständig durchgeführt:
- Echter Browser-Run mit Playwright/Puppeteer, weil beides in dieser Umgebung nicht installiert war.
- Chromium-Headless war im Container vorhanden, lieferte aber beim `file://`-Dump innerhalb des Zeitlimits kein DOM zurück und wurde deshalb nicht als bestandener Browser-Test gewertet.

## Ergebnis
Phase 2A ist abgeschlossen. Die App hat jetzt eine aktive Simulation-ModuleHost-Schicht. Phase 2B ist die echte interne Migration der Simulationsfunktionen aus `app.js` heraus.
