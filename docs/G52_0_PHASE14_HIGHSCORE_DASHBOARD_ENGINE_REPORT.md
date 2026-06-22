# G52.0 / Phase 14 — Highscore Dashboard Engine

## Status

Abgeschlossen am 2026-06-15.

## Ziel

Die lokale Highscore-/Dashboard-Logik wurde aus `js/app.js` in eine eigene Core-Grenze ausgelagert. Dadurch wird `app.js` weiter zum Adapter und die Bestenlisten-Logik kann später unabhängig von Simulation, Result-Persistence, Cloud-Sync und UI weiterentwickelt werden.

## Neue Datei

- `js/core/highscore-dashboard-engine.js`

## Neue öffentliche API

`window.EGTHighscoreDashboardEngine.create(deps)` erzeugt eine Highscore-Engine mit folgenden Methoden:

- `build(results)`
- `rankLabel(percent)`
- `toRecord(result)`
- `persistFromResults(results)`
- `renderLocalCard(results)`
- `renderDashboard(results)`
- `diagnostics(results)`

## Umsetzung

- `index.html` lädt `js/core/highscore-dashboard-engine.js` vor `js/app.js`.
- `js/app.js` erstellt `HighscoreEngine` jetzt über `EGTHighscoreDashboardEngine.create(...)`.
- Der alte Inline-Highscore-Code bleibt als Fallback erhalten, falls das neue Core-Modul nicht geladen wird.
- `CloudHighscoreEngine` wurde bewusst noch nicht physisch aus `app.js` entfernt. Es wird nur über `getCloudHighscoreEngine()` kontrolliert an den neuen lokalen Dashboard-Renderer angebunden.
- `ArchitectureGuard` prüft jetzt `EGTHighscoreDashboardEngine` und die neue Core-Datei.
- `service-worker.js` cached die neue Core-Datei.
- Version auf `G52.0` gesetzt und synchronisiert.

## Bewusste Grenzen

- Keine Änderung an Supabase-/CloudHighscore-Fachlogik.
- Keine Änderung an Firebase, Admin, Auth, Demo-Limits oder Teilnehmerverwaltung.
- Keine Änderung an Aufgabeninhalten, Generatoren, Simulation oder Result-Speicherung.
- Kein optischer UI-Refactor in dieser Phase.

## Warum dieser Schritt wichtig ist

Die App hatte lokale Highscore-Auswertung, Dashboard-Rendering und IndexedDB-Persistenz direkt im Monolithen. Mit G52.0 ist dieser Bereich als eigene Core-Grenze greifbar. Dadurch können spätere Schritte sauberer durchgeführt werden:

1. CloudHighscoreEngine aus `app.js` herauslösen.
2. Highscore-/Duell-UI weiter separieren.
3. Highscore-Diagnose und Admin-/Dozenten-Auswertung besser verbinden.
4. Lokale und Cloud-Bestenlisten unabhängig testen.

## QA

- JS-Syntaxcheck bestanden.
- JSON-Validierung bestanden.
- Service-Worker-Assetprüfung bestanden.
- Headless-Inline-Smoke-Test bestanden:
  - `window.App` vorhanden.
  - `window.AppConfig.version === "G52.0"`.
  - `window.EGTHighscoreDashboardEngine` vorhanden.
  - `App._test.HighscoreEngine.__version === "G52.0-phase14"`.
  - Horizontaler Overflow: `0`.

## Nächster sinnvoller Schritt

Phase 15: Entweder `CloudHighscoreEngine` physisch weiter aus `app.js` lösen oder Duell-/Highscore-UI als stärkere Fachmodule abgrenzen. Alternativ kann das UI-Backlog punktuell nach echten Geräte-Screenshots weiter abgearbeitet werden.
