# G40.7 — Phase 2G EDV-Multi Renderer

## Ziel
EDV-Multi sollte als zweiter Spezialrenderer nach Route-Memory kontrolliert aus `app.js` in `js/modules/egt-simulation-engine.js` migriert werden, ohne EDV-Generator, Schema-Visualisierung, History-Format, Highscore, Coach oder Ergebnislogik zu beschädigen.

## Geänderte Hauptdateien

### `js/modules/egt-simulation-engine.js`
- Modulversion auf `G40.7-phase2g` erhöht.
- Phase-Header um Phase 2G ergänzt.
- EDV-Hilfsfunktionen eingeführt:
  - `parseEdvEntry(entry)`
  - `edvSchema(question)`
  - `edvCorrectIds(question)`
  - `edvNeed(question)`
  - `edvSelected(question)`
  - `getCurrentEdvQuestion()`
  - `renderEdvVisual(question)`
  - `bindEdvInteractions()`
  - `highlightEdvResult(selected, correctIds)`
- Neue EDV-Renderer-/Interaktionsfunktionen eingeführt:
  - `renderEdvMultiAnswers(question)`
  - `toggleEdvMultiNode(id)`
  - `undoEdvMultiSelection()`
  - `clearEdvMultiSelection()`
  - `submitEdvMultiAnswer()`
- `renderAnswers(question)` behandelt `q.type === 'edvmulti'` jetzt intern im Modul über `renderEdvMultiAnswers(q)`.
- Neue öffentliche APIs in `window.EGTSimulation` ergänzt:
  - `renderEdvMultiAnswers`
  - `toggleEdvMultiNode`
  - `undoEdvMultiSelection`
  - `clearEdvMultiSelection`
  - `submitEdvMultiAnswer`
- Neue Events ergänzt:
  - `egt:simulation:edv:rendered`
  - `egt:simulation:edv:selected`
  - `egt:simulation:edv:submitted`

### `js/app.js`
- App-Version auf `G40.7-2026-06-15` aktualisiert.
- `renderAnswers(q)` delegiert `edvmulti` jetzt zuerst an `EGTSimulation.renderEdvMultiAnswers(q)`.
- Alte EDV-Logik wurde nicht gelöscht, sondern als Fallback umbenannt/gekapselt:
  - `renderEdvMultiAnswersInternal(q)`
  - `toggleEdvMultiNodeInternal(id)`
  - `undoEdvMultiSelectionInternal()`
  - `clearEdvMultiSelectionInternal()`
  - `submitEdvMultiAnswerInternal()`
- Öffentliche App-Funktionen bleiben als Wrapper erhalten, damit bestehende globale Klickstellen und `App.*`-Aufrufe nicht brechen:
  - `toggleEdvMultiNode(id)`
  - `undoEdvMultiSelection()`
  - `clearEdvMultiSelection()`
  - `submitEdvMultiAnswer()`
- EDV-Shell-Hooks in `initSimulationModuleHost()` ergänzt:
  - `renderEdvVisual(question)`
  - `recordEdvMultiAnswers(selected)`
  - `markEdvMultiCoveredDone(need)`
  - `afterEdvMultiSubmit(need, selected)`
- EDV-History-Schreibung bleibt bewusst in `recordEdvMultiAnswersInternal(selected)`, damit bestehende Ergebnis-, Review-, Coach- und Highscore-Verarbeitung gleich bleibt.

### `module-manifest.json`
- `simulationModuleHost.phase` auf `2G` gesetzt.
- API, Adapterbeschreibung und Status um EDV-Multi erweitert.
- Neue EDV-Events dokumentiert.
- Neuer Abschnitt `phase2g` ergänzt mit:
  - movedIntoModule
  - newModuleApi
  - leftInAppAsControlledHooks
  - leftInAppAsAdapter
  - explicitlyNotMoved
  - nextStep

### Versionierung
- `js/core/app-config.js` auf `G40.7` gesetzt.
- `node sync-version.js` ausgeführt.
- Automatisch synchronisiert:
  - `service-worker.js`
  - `update-check.json`
  - `manifest.json`
- `js/modules/egt-simulation-engine.js` manuell auf `G40.7-phase2g` gesetzt.

### Working Plan
Aktualisiert wurden:
- `../WORKING-PLAN_1.md`
- `docs/WORKING-PLAN.md`

Dokumentiert wurde:
- Phase 2G abgeschlossen.
- EDV-Multi ist jetzt Modulrenderer.
- Welche Hooks bewusst in `app.js` bleiben.
- Nächster möglicher Schritt: Phase 2H optional Visual-Renderer-Grenze oder Phase 3.

## Bewusst nicht verschoben
- `EDV_SCHEMA`
- `EDV_ERRORS`
- `renderEdvProHTML(q)`
- `Generators.bigEDVMulti()`
- `Generators.bigEDVCovered(slot)`
- CTC-Lohr-Blockaufbau
- Ergebnisdetail-Rendering
- Review/Fehleranalyse
- Highscore-/Cloud-Sync
- Coach-Auswertung
- Duell-Ergebnislogik

## Architekturentscheidung
Phase 2G migriert nur EDV-Antwortbereich und EDV-Interaktion. Die EDV-Visualisierung bleibt zunächst App-Shell-Hook, weil sie eng an die bestehenden Schema-Konstanten und Generatoren gebunden ist. Dadurch wird die Modularisierung fortgesetzt, ohne das EDV-Großschema oder die 11-Fehler-Wertung zu riskieren.

## Nächster sinnvoller Schritt
Entweder:

1. **Phase 2H:** Visual-Renderer-Grenze definieren und einen kleinen Visual-Renderer kontrolliert migrieren.

Oder:

2. **Phase 3:** Shell/ModuleHost-Vertrag härten und Startseiten-/Branchen-Struktur aufräumen.
