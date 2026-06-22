# G40.3 — Phase 2C Standard-MC-Rendering im Simulationsmodul / Arbeitsnachweis

## Ziel
Phase 2C setzt den ersten echten physischen Renderer-Umzug um: Das normale Multiple-Choice-Antwortlayout darf nicht mehr in `app.js` entstehen, sondern muss im Simulationsmodul `js/modules/egt-simulation-engine.js` liegen. Spezialfälle werden bewusst noch nicht gleichzeitig migriert, um die App nicht zu destabilisieren.

## Geänderte Dateien

### `js/modules/egt-simulation-engine.js`
- Modulversion auf `G40.3-phase2c` gesetzt.
- Neue interne DOM-Hilfe `byId(id)` ergänzt.
- Neue Hilfen ergänzt:
  - `currentQuestionIndex(state)`
  - `isInstantFeedbackAllowed()` über App-Adapter
  - `renderRouteWaitingMessage()` für den reinen Route-Wartezustand
- Neue Modul-Funktion `renderStandardAnswers(question)` eingebaut.
- `renderStandardAnswers(question)` übernimmt jetzt:
  - Leeren des Antwortcontainers `#answers`
  - Erstellen der normalen `.answer-card` Buttons
  - A/B/C/D-Index-Ausgabe über `.answer-index`
  - Antworttext über `.answer-text`
  - Klickbindung an `EGTSimulation.chooseAnswer(idx, button)`
  - Wiederherstellung bereits gegebener Antworten über `selected`
  - Wiederherstellung von Sofortfeedback über `correct`/`wrong`
  - Wiederherstellung der Erklärung im `#feedback` Bereich
- `renderAnswers(question)` entscheidet jetzt im Modul:
  - `edvmulti` → App-Spezialadapter `renderEdvMultiAnswers(q)`
  - `routeMemory` ohne fertige Route → Modul-Wartehinweis
  - `routeMemory` fertig → App-Spezialadapter `renderRouteSequenceAnswers(q)`
  - Standard-MC → internes `renderStandardAnswers(q)`
- Neue öffentliche API ergänzt:
  - `EGTSimulation.renderStandardAnswers(q)`

### `js/app.js`
- Standard-MC-Rendering aus `renderAnswers(q)` entfernt.
- `renderAnswers(q)` enthält jetzt nur noch Spezialadapter für:
  - `edvmulti`
  - `routeMemory`
- Für Standard-MC delegiert `app.js` an:
  - `simulationHostCall("renderStandardAnswers", [q])`
- Adapter `initSimulationModuleHost()` erweitert um:
  - `renderEdvMultiAnswers(question)`
  - `renderRouteSequenceAnswers(question)`
  - `isInstantFeedbackAllowed()`

### `module-manifest.json`
- `simulationModuleHost.phase` auf `2C` gesetzt.
- API-Beschreibung um `renderStandardAnswers(q)` erweitert.
- Status aktualisiert: Standard-MC ist jetzt im Modul, Spezialrenderer bleiben bewusst Adapter.
- Neues Feld `phase2c` ergänzt mit:
  - was ins Modul verschoben wurde
  - was bewusst in `app.js` blieb
  - nächster sinnvoller Schritt

### Versionsdateien
- `js/core/app-config.js` auf `G40.3` gesetzt.
- `node sync-version.js` ausgeführt.
- Dadurch synchronisiert:
  - `service-worker.js`
  - `update-check.json`
  - `manifest.json`

### Working Plan
Aktualisiert wurden:
- `WORKING-PLAN_1.md`
- `docs/WORKING-PLAN.md`

## Bewusst NICHT migriert
Folgende Teile bleiben in Phase 2C absichtlich in `app.js`, weil sie stärker mit Spezialzuständen, Visuals und bestehenden App-Hooks gekoppelt sind:

- `renderEdvMultiAnswers(q)`
- `renderRouteSequenceAnswers(q)`
- `renderVisual(q)`
- `updateQuestionNav()`
- `showQuestion()` Hauptablauf
- `tickTimer()`
- `recordAnswer()` Coach-/DNA-Hooks
- `showResult()` Highscore-/Analyse-Hooks

## Warum dieser Schnitt richtig ist
Die App enthält mehrere eng gekoppelte Sonderfälle: EDV-Multi, Route-Memory, CTC-Blöcke, Duell, Coach-Hooks, Profil-Gate und Highscore. Würde man in Phase 2C alle Renderer gleichzeitig verschieben, wäre die Bruchgefahr hoch. Der sichere Schnitt ist daher:

1. Standard-MC zuerst ins Modul.
2. Spezialrenderer weiter als Adapter.
3. Danach einzelne Spezialfälle separat migrieren und testen.

## Tests / QA
Durchgeführt:
- `node --check` für alle JS-Dateien unter `js/` und `data/`.
- JSON-Prüfung für relevante Release-Dateien:
  - `manifest.json`
  - `update-check.json`
  - `module-manifest.json`
  - G40.1/G40.2 QA-Dateien
- Service-Worker-Assetprüfung: keine fehlenden gecachten Dateien gefunden.
- ZIP-Test mit `unzip -t`.

Nicht durchgeführt:
- Kein echter Browser-/PWA-Live-Test in dieser Umgebung.
- Kein Playwright-Test, da nicht eingerichtet.

## Nächster Schritt
Phase 2D sollte nicht wieder mehrere Dinge vermischen. Empfohlen:

**Option A:** `updateQuestionNav()` ins Simulationsmodul verschieben.

oder

**Option B:** einen Spezialrenderer migrieren, zuerst Route-Memory, danach EDV-Multi.

Empfehlung: Erst `updateQuestionNav()`, weil die Navigation für alle Fragetypen zentral ist und die spätere vollständige Simulationstrennung erleichtert.
