# G52.4 / Phase 18 — Highscore-/Duell-Sheet-Router-Engine

## Ziel

Highscore und Duell sollen nicht mehr an mehreren Stellen unterschiedlich geöffnet werden. Phase 18 zieht dafür eine zentrale Routing-Grenze ein.

## Neue Datei

- `js/core/highscore-duel-sheet-router-engine.js`

## Aufgaben der Engine

- Highscore-Section öffnen
- Highscore-Deep-Sheet öffnen
- Highscore-Zeitraum normalisieren (`daily`, `weekly`, `monthly`, `all`)
- Cloud-Highscore-Refresh und Periodenwechsel zentral auslösen
- Duell-Hub öffnen
- Duell-Setup direkt öffnen
- TopTab-Routing für Highscore-Zeiträume übernehmen
- Data-Actions wie `hs-period`, `hs-show-more`, `duel-hub`, `duel-mode`, `highscore-sheet` zentral behandeln
- Diagnose über `App._test.HighscoreDuelSheetRouterEngine`

## Geänderte Dateien

- `index.html`
- `js/app.js`
- `js/ui-router.js`
- `js/core/highscore-duel-sheet-router-engine.js`
- `js/modules/egt-highscore-entry-module.js`
- `js/modules/egt-duel-entry-module.js`
- `js/core/app-config.js`
- `service-worker.js`
- `manifest.json`
- `update-check.json`
- `module-manifest.json`
- `docs/WORKING-PLAN.md`
- `WORKING-PLAN_1.md`

## Architekturentscheidung

Phase 18 verschiebt bewusst nicht die vollständige Highscore- oder Duell-Renderlogik. Diese bleibt in den spezialisierten Engines:

- lokale Highscore-Logik: `highscore-dashboard-engine.js`
- Cloud-Highscore-Logik: `cloud-highscore-engine.js`
- Highscore-/Duell-UI: `highscore-duel-ui-engine.js`
- Duell-Runtime: `duell-runtime-engine.js`

Die neue Phase-18-Engine entscheidet nur noch, **wohin ein Klick führen soll** und **welcher Bereich geöffnet wird**.

## Ergebnis

Highscore-/Duell-Navigation ist jetzt zentraler, testbarer und weniger in `app.js`, Entry-Modulen und UI-Router verteilt.
