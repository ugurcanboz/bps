# G40.2 — Phase 2B Simulation Kontroll-API / Arbeitsnachweis

## Ziel
Die Simulation soll weiter aus dem Monolithen `js/app.js` gelöst werden. Phase 2B baut auf Phase 2A auf und macht `js/modules/egt-simulation-engine.js` zur offiziellen Kontroll- und Event-Schicht für zentrale Simulationsabläufe.

## Geänderte Dateien

### `js/modules/egt-simulation-engine.js`
- Modulversion auf `G40.2-phase2b` gesetzt.
- Kontrollmethoden ergänzt:
  - `showQuestion(spIntro)`
  - `tickTimer()`
  - `renderAnswers(question)`
  - `updateQuestionNav()`
  - `chooseAnswer(index, button)`
  - `recordAnswer(given, correct, timeout)`
  - `nextQuestion()`
  - `manualNextQuestion()`
  - `skipQuestion()`
  - `showResult()`
- Event-Schicht erweitert:
  - `question:beforeShow`
  - `question:shown`
  - `timer:tick:before`
  - `timer:tick`
  - `answers:render:before`
  - `answers:rendered`
  - `nav:updated`
  - `answer:choose`
  - `answer:recorded`
  - `question:next:before`
  - `question:next`
  - `result:beforeShow`
- `beginRun()` als bevorzugter Start-Hook ergänzt. `beginLegacyRun()` bleibt kompatibel.
- `callAdapter()` mit Reentrancy-Schutz eingebaut, damit Adapter-Aufrufe nicht in Endlosschleifen laufen.
- `activeSession` wird während Frage/Timer aktualisiert (`currentIndex`, `timeLeft`).

### `js/app.js`
- `simulationHostCall(method, args, fallback)` ergänzt.
- `initSimulationModuleHost()` erweitert:
  - `beginRun`
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
- `startQuizInternal()` startet die erste Frage über `simulationHostCall("showQuestion")`.
- `startCtcBlockFromIntro()` nutzt `simulationHostCall("showQuestion", [true])`.
- Innerhalb `showQuestion()` laufen Antwort-Rendering und Frage-Navigation über den ModuleHost.
- Timer-Intervalle rufen jetzt `simulationHostCall("tickTimer")` auf.

### `module-manifest.json`
- `simulationModuleHost.phase` auf `2B` gesetzt.
- API, Status und Events aktualisiert.

### `js/core/app-config.js` + synchronisierte Versionsdateien
- Version auf `G40.2` gesetzt.
- Label: `Modularisierung Phase 2B: Simulation Kontroll-API`.
- `node sync-version.js` ausgeführt, dadurch aktualisiert:
  - `service-worker.js`
  - `update-check.json`
  - `manifest.json`

### Working Plan
- `WORKING-PLAN_1.md` aktualisiert.
- `docs/WORKING-PLAN.md` aktualisiert.
- Phase 2B als abgeschlossen dokumentiert.
- Nächster Schritt als Phase 2C definiert.

## Technische Entscheidung
Phase 2B verschiebt noch nicht alle Renderer physisch aus `app.js`, weil diese stark mit Sonderfällen verknüpft sind: Duell, EDV-Multi, Route-Memory, CTC-Blöcke, Coach-Hooks, Profil-Gate und Highscore. Stattdessen ist `EGTSimulation` jetzt die offizielle Kontrollschicht. Das reduziert Bruchrisiko und erlaubt Phase 2C als sauberen physischen Umzug von Standard-MC-Rendering.

## Nächster Schritt — Phase 2C
1. Standard-MC-Rendering (`renderAnswers` für normale Aufgaben) aus `app.js` in `egt-simulation-engine.js` verschieben.
2. `updateQuestionNav` als echte Modul-Funktion migrieren.
3. Danach Spezialfälle einzeln migrieren: EDV-Multi, Route-Memory, Visuals, CTC-Blöcke.

## Testnachweis
Siehe `docs/G40_2_PHASE2B_SIMULATION_CONTROL_API_QA.json`.
