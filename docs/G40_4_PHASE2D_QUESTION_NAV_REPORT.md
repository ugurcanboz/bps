# G40.4 — Phase 2D Fragenübersicht im Simulationsmodul / Arbeitsnachweis

## Ziel

Phase 2D sollte `updateQuestionNav()` als nächste zentrale Simulationsfunktion aus dem `app.js`-Monolithen herauslösen und in `js/modules/egt-simulation-engine.js` verankern. Wichtig war dabei, die bestehende Prüfungslogik nicht zu beschädigen: Zurück-Sperre, automatisches Skippen unbeantworteter Fragen, Drawer-Schließen und Timer-Stopp mussten erhalten bleiben.

## Geänderte Dateien

- `js/modules/egt-simulation-engine.js`
- `js/app.js`
- `js/core/app-config.js`
- `module-manifest.json`
- `manifest.json`
- `update-check.json`
- `service-worker.js`
- `WORKING-PLAN_1.md`
- `docs/WORKING-PLAN.md`
- `docs/G40_4_PHASE2D_QUESTION_NAV_REPORT.md`
- `docs/G40_4_PHASE2D_QUESTION_NAV_QA.json`

## Umsetzung im Modul

### `js/modules/egt-simulation-engine.js`

- Modulversion auf `G40.4-phase2d` gesetzt.
- Dokumentationskopf um Phase 2D ergänzt.
- Modul-eigene Variable `qnavManualPage` eingeführt.
- Neue interne Hilfsfunktionen ergänzt:
  - `getQuestionNavTotal(state)`
  - `ensureQuestionDrawerToggle()`
  - `setQuestionDrawer(open)`
  - `jumpToQuestion(index)`
- `updateQuestionNav()` rendert jetzt im Modul:
  - `#questionNav` als `.qnav-drawer`
  - `aria-label="Frageübersicht"`
  - Seitenleiste `.qnav-pages`
  - 30 Fragen pro Seite
  - `.qnav-page-btn` mit Bereichsbeschriftung, z. B. `1–30`
  - `.progress-dot` mit Status `open`, `done`, `mark`, `current`
  - Klick auf Dot: Drawer schließen und kontrolliert zur Frage springen
- Event `nav:updated` enthält jetzt zusätzlich:
  - `page`
  - `pages`
  - `handledBy: "module-question-nav"`

## Umsetzung in der App-Shell

### `js/app.js`

- `updateQuestionNav()` wurde zum Wrapper:
  - Standardweg: `simulationHostCall("updateQuestionNav")`
  - Fallback: `updateQuestionNavInternal()`
- Der alte direkte Rendering-Code wurde erhalten, aber in `updateQuestionNavInternal()` umbenannt.
- `initSimulationModuleHost()` wurde erweitert um kontrollierte Shell-Hooks:
  - `getQuestionNavTotal()`
  - `ensureQuestionDrawerToggle()`
  - `setQuestionDrawer(open)`
  - `jumpToQuestion(index)`
- `updateQuestionNav` im Adapter zeigt bewusst auf `updateQuestionNavInternal()` als Fallback/Legacy-Hook, nicht mehr als primärer Renderpfad.

## Bewusst nicht verschoben

Folgende Logik bleibt vorerst in `app.js`, weil sie Prüfungs-/Shell-Verantwortung ist:

- `jumpToQuestion(index)` inklusive:
  - `lockBack`-Prüfung
  - `showExamLockNotice()`
  - Timer-Stopp
  - Auto-Skip bei unbeantworteter alter Frage
  - `state.current` setzen
  - `showQuestion()` starten
- `ensureQuestionDrawerToggle()` und `setQuestionDrawer(open)` als Shell-UI-Hooks.
- Adaptive/CTC-Total-Berechnung über `getQuestionNavTotal()`.

## Aktualisierte Version

- `js/core/app-config.js`: `G40.4`
- `sync-version.js` ausgeführt
- automatisch aktualisiert:
  - `manifest.json`
  - `update-check.json`
  - `service-worker.js`

## Working Plan

Aktualisiert wurden beide Übergabedokumente:

- `WORKING-PLAN_1.md`
- `docs/WORKING-PLAN.md`

Dokumentiert wurden:

- Phase 2D als abgeschlossen
- verschobene Bestandteile
- neue Shell-Hooks
- offene Adapter
- nächster sinnvoller Schritt Phase 2E
- Changelog-Eintrag G40.4

## Tests

Durchgeführt:

- `node --check` für alle JS-Dateien unter `js/` und `data/`
- JSON-Validierung für:
  - `manifest.json`
  - `update-check.json`
  - `module-manifest.json`
- Service-Worker-Assetprüfung: alle 174 Assets vorhanden
- ZIP-Integritätstest

## Offene Punkte für nächste Phase

Empfohlener nächster Schritt: **Phase 2E**.

Option A, empfohlen:

- Ergebnis-/Result-Grenze definieren
- `showResult()` weiter modularisieren
- klare Übergabe an Shell, Highscore und Coach vorbereiten

Option B:

- Route-Memory als ersten Spezialrenderer aus `app.js` herauslösen
- danach EDV-Multi separat migrieren

Nicht empfohlen: mehrere Spezialrenderer gleichzeitig verschieben. Das Risiko wäre unnötig hoch.
