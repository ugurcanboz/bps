# G44.0 — Phase 6 Branch-QuestionPool-/Generator-Grenze

## Ziel
IT/FISI, Kaufmännisch und Sozialpädagogik sollten nicht mehr nur eigene Startmodule besitzen, sondern eine erste eigene fachliche Aufgabenpool-Grenze bekommen. Die bestehende Quizruntime sollte stabil bleiben.

## Umgesetzt

### Neue Datei
- `js/core/branch-question-pools.js`

### Neues Global
- `window.EGTBranchQuestionPools`

### Neue API
- `resolve(branch, mode, options)`
- `list()`
- `scoreQuestionForBranch(question, branch)`

### Branch-Profile
- `it`: IT/FISI, Netzwerk, Hardware, Security, EDV; CTC-Lohr-Blockstruktur bleibt geschützt.
- `kaufm`: kaufmännisches Rechnen, Bürowissen, Textverständnis, Logik, Konzentration.
- `sozial`: Pädagogik, Situationen, Textverständnis, Sprache/Wissen, Logik, Konzentration.
- `wissen`: allgemeiner Fallback.

## Geänderte Dateien
- `index.html`
- `js/core/module-host.js`
- `js/core/branch-question-pools.js`
- `js/modules/egt-sim-it.js`
- `js/modules/egt-sim-kaufm.js`
- `js/modules/egt-sim-sozial.js`
- `js/app.js`
- `js/core/architecture-guard.js`
- `service-worker.js`
- `module-manifest.json`
- `js/core/app-config.js`
- `update-check.json`
- `manifest.json`
- `WORKING-PLAN_1.md`
- `docs/WORKING-PLAN.md`

## Integration

### ModuleHost
`AppModuleHost.buildSimulationConfig(...)` liefert jetzt zusätzlich `questionPoolProfile`.

`AppModuleHost.startSimulation(...)` setzt außerdem:

```js
window.EGT_ACTIVE_QUESTION_PROFILE
```

Dadurch kann die bestehende Runtime den aktiven Branch und den passenden Pool erkennen.

### Branch-Module
Die Module `sim-it`, `sim-kaufm`, `sim-sozial` lösen jetzt selbst ihre `questionPoolProfile` auf und geben diese in `buildConfig(...)` weiter.

### app.js
`app.js` wurde kontrolliert angebunden:

- `activeBranchIdForQuiz()` liest den aktiven Branch aus `AppModuleHost`, `EGT_ACTIVE_QUESTION_PROFILE` oder `localStorage`.
- `activeQuestionPoolProfile(mode)` nutzt `EGTBranchQuestionPools.resolve(...)`.
- `resolveBranchGeneratorPool(mode, pools)` gewichtet bei `bps`/`jogging` branchenspezifisch.
- `attachBranchPoolMeta(q, mode)` versieht Fragen mit `branch`, `poolKey`, `poolSource`.

## Bewusst nicht geändert
- Kein kompletter Generator-Umzug aus `app.js`.
- Keine Änderung an Firebase.
- Keine Änderung an Login/Admin/Profile.
- Keine Änderung an Highscore/Cloud-Sync.
- Keine Änderung an Coach-Memory oder Coach-Auswertung.
- Keine Änderung an Demo-Limits oder Session-Keys.
- Keine Änderung an Result-/Review-Logik.
- CTC-Lohr-Festblockstruktur bleibt erhalten.

## Risikoentscheidung
Phase 6 ist eine kontrollierte Grenzphase. Der neue Resolver gibt die fachliche Richtung vor, aber die eigentliche Generatorphysik bleibt noch im stabilen App-Core. Dadurch wird die App modularer, ohne die Quiz-Erzeugung in einem Schritt zu gefährden.

## Nächster Schritt
Phase 7 sollte entweder:

1. die GeneratorRegistry/Pools physisch aus `app.js` vorbereiten, oder
2. pro Branch eigene Datenpool-Resolver an `data/question-bank-*.js` anbinden.
