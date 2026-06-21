# G40.6 — Phase 2F Route-Memory Renderer

## Ziel
Route-Memory / Busfahrtroute als ersten Spezialrenderer aus der App-Shell in `EGTSimulation` migrieren, ohne Generator, Visual-Animation, History-Format, Timer-Regeln oder Ergebnislogik gleichzeitig zu verändern.

## Geänderte Dateien

- `js/modules/egt-simulation-engine.js`
- `js/app.js`
- `js/core/app-config.js`
- `module-manifest.json`
- `manifest.json`
- `update-check.json`
- `service-worker.js`
- `docs/WORKING-PLAN.md`
- `WORKING-PLAN_1.md`
- `docs/G40_6_PHASE2F_ROUTE_MEMORY_RENDERER_REPORT.md`
- `docs/G40_6_PHASE2F_ROUTE_MEMORY_RENDERER_QA.json`

## Was wurde umgesetzt?

### 1. Route-Memory ins Simulationsmodul verschoben
`js/modules/egt-simulation-engine.js` besitzt jetzt eigene Route-Memory-Funktionen:

- `renderRouteSequenceAnswers(question)`
- `selectRouteStreet(street)`
- `undoRouteStreet()`
- `clearRouteSelection()`
- `submitRouteSequence()`

Das Modul rendert jetzt selbst:

- Wartehinweis, solange `routeReady` noch nicht gesetzt ist
- Auswahlpanel nach der Merkanimation
- ausgewählte Straßen als Chips
- Straßen-Optionsbuttons
- Aktionsbuttons für Clear, Undo und Submit
- Feedback bei unvollständiger Route
- Feedback nach der Wertung

### 2. Route-Interaktion modularisiert
Die bisherige Auswahllogik über `MultiChoiceModule` in `app.js` wurde für Route-Memory durch modulinterne Logik ersetzt:

- Straße antippen = auswählen
- gewählte Straße erneut antippen = entfernen
- maximale Anzahl wird begrenzt
- Undo entfernt die letzte Auswahl
- Clear leert die Auswahl
- Submit prüft die vollständige Reihenfolge

### 3. App-Shell auf kontrollierte Hooks reduziert
`app.js` enthält weiterhin nur die bewusst zentralen Regeln:

- `recordRouteAnswer(selected, correct)` schreibt das bestehende History-Format
- `markCurrentQuestionDone()` setzt `questionStates` anhand von `markedQuestions`
- `isAdaptiveElite()` bleibt Shell-Regel für adaptive Weiterleitung
- `nextQuestion()` und `showResult()` bleiben zentrale App-Navigation
- `stopTimer()` löscht Timer inklusive Route-Timer

### 4. Sicherheitsfallbacks erhalten
Die alten Route-Funktionen wurden nicht entfernt, sondern als interne Fallbacks gesichert:

- `renderRouteSequenceAnswersInternal(q)`
- `selectRouteStreetInternal(street)`
- `undoRouteStreetInternal()`
- `clearRouteSelectionInternal()`
- `submitRouteSequenceInternal()`

Die öffentlichen App-Funktionen delegieren zuerst an `EGTSimulation`; nur bei fehlendem Modul greift der interne Fallback.

### 5. Manifest und Working Plan aktualisiert
`module-manifest.json` dokumentiert Phase 2F, neue Route-APIs, Shell-Hooks und offene Adapter. Beide Working-Plan-Dateien wurden aktualisiert und der Marker wurde auf Phase 2G verschoben.

## Bewusst nicht verändert

- `Generators.routeMemory(...)`
- `renderRouteMemory(q)` / Route-Visualisierung
- `clearRouteTimers()` und die Merkanimation
- allgemeine Antwort-History-Struktur
- Highscore / Coach / Review / Ergebnisdetails
- EDV-Multi, weil dieser Spezialfall separat in Phase 2G migriert werden soll

## Nächster Schritt
Phase 2G: EDV-Multi als zweiten Spezialrenderer einzeln in `EGTSimulation` migrieren. Visual-Renderer und Generatoren sollen dabei weiterhin nicht vermischt werden.
