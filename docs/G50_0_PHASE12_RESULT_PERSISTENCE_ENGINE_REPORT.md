# G50.0 / Phase 12 — Result Persistence Engine

## Ziel

Persistenz, Result-Payload, lokale Highscore-Aktualisierung, CloudHighscore-Sync und Coach-/Admin-/Demo-Hooks sollten als eigene Core-Grenze aus `js/app.js` herausgelöst werden, ohne bestehende Speicher-, Auth-, Admin-, Highscore- oder Cloud-Logik fachlich zu verändern.

## Neue Datei

- `js/core/result-persistence-engine.js`

## Neues Global

- `window.EGTResultPersistenceEngine`

## Neue API

- `buildCategoryMap(ctx)`
- `buildSession(ctx)`
- `buildRecord(ctx)`
- `persistResult(ctx)`
- `recordAnswerAttempt(ctx)`
- `finishCoachSession(ctx)`
- `dispatchHooks(ctx, latest)`

## Umsetzung in `js/app.js`

### `saveResult(...)`

`saveResult(...)` ist jetzt ein Wrapper:

1. versucht `EGTResultPersistenceEngine.persistResult(resultPersistenceContext(...))`,
2. fällt bei Fehlern oder fehlender Engine auf `saveResultInternal(...)` zurück.

Der komplette alte Speichercode wurde nicht gelöscht, sondern in `saveResultInternal(...)` gesichert.

### `resultPersistenceContext(...)`

Neu in `js/app.js`:

- bündelt App-State,
- übergibt `StorageEngine`, `DatabaseBridge`, `Guard`, `SessionTracker`, `HighscoreEngine`, `CloudHighscoreEngine`,
- übergibt Auth-, Admin-, Coach- und Profile-Hooks kontrolliert an die neue Engine,
- verhindert direkte, unkontrollierte Seiteneffekte in der Save-Funktion.

### Antwort-Hooks

`recordAnswer(...)` delegiert Coach-Hooks zuerst an:

- `EGTResultPersistenceEngine.recordAnswerAttempt(...)`

Fallback bleibt:

- `EGTLearningCoach.onAnswerRecorded(...)`
- `EGTCoachDNA.recordAttempt(...)`

### Session-Finish-Hook

`showResult()` delegiert Session-Ende zuerst an:

- `EGTResultPersistenceEngine.finishCoachSession(...)`

Fallback bleibt:

- `EGTLearningCoach.onSessionFinished(...)`

## Aktualisierte Dateien

- `js/core/result-persistence-engine.js`
- `js/app.js`
- `index.html`
- `service-worker.js`
- `js/core/architecture-guard.js`
- `js/core/app-config.js`
- `manifest.json`
- `update-check.json`
- `module-manifest.json`
- `START_HERE.md`
- `WORKING-PLAN_1.md`
- `docs/WORKING-PLAN.md`

## Bewusst nicht geändert

- keine CSS-/Layout-Shift-Fixes
- keine optische UI-Änderung
- keine Aufgabeninhalte
- keine Generatorlogik
- keine Auth-/Firebase-Fachlogik
- keine AdminPortal-Fachlogik
- kein physischer Umzug von `HighscoreEngine` oder `CloudHighscoreEngine`
- keine Entfernung alter Fallbacks

## Ergebnis

Phase 12 reduziert die direkte Verantwortung von `app.js` weiter. `app.js` ist jetzt stärker Adapter/Shell und weniger Speicher-/Hook-Zentrale. Die besonders riskante Stelle `saveResult(...)` ist abgesichert, weil der alte Pfad vollständig erhalten bleibt.

## Nächster sinnvoller Schritt

Empfohlen nach Browser-Smoke-Test:

- `G50.5` Layout-Stabilität / No-Shift-Fix, weil beim User Aufgabenfenster kurz nach dem Rendern springen.

Alternative:

- `G51.0 / Phase 13` Highscore/Cloud weiter physisch aus `app.js` lösen.
