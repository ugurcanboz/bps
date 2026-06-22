# G45.0 — Phase 7 GeneratorRegistry / Pool-Grenze

## Ziel
Phase 7 zieht die Generator-Pool-Definitionen weiter aus `js/app.js` heraus. Die App soll nicht mehr dauerhaft die fachlichen Pool-Blueprints direkt in der Runtime-Funktion halten, sondern diese über eine eigene Core-Registry beziehen.

## Umgesetzte Dateien

### Neu
- `js/core/generator-registry.js`

### Geändert
- `js/app.js`
- `index.html`
- `js/core/architecture-guard.js`
- `js/core/module-host.js`
- `js/core/branch-question-pools.js`
- `service-worker.js`
- `js/core/app-config.js`
- `update-check.json`
- `manifest.json`
- `module-manifest.json`
- `WORKING-PLAN_1.md`
- `docs/WORKING-PLAN.md`

## Neue Registry
Global:

```js
window.EGTGeneratorRegistry
```

API:

```js
createAliasMap(generators)
buildPoolMap(generators)
resolvePool(mode, options)
attachMeta(question, mode, profile, options)
listPools()
```

## Was aus app.js herausgezogen wurde
Die Pool-Blueprints für die Modi wurden in `js/core/generator-registry.js` verschoben, unter anderem:

- `jogging`
- `bps`
- `ctc`
- `mathSprint`
- `logicSprint`
- `concentrationSprint`
- `visualIQSprint`
- `itSprint`
- `knowledgeSprint`
- `techniqueSprint`
- `errorTrainingPrep`
- Einzelmodi wie `math`, `logic`, `general`, `english`, `it`, `routeMemoryMode`

## app.js-Anbindung
`app.js` nutzt jetzt:

```js
EGTGeneratorRegistry.resolvePool(mode, {
  generators: Generators,
  profile,
  source: "app-generateQuestionForMode-phase7"
})
```

und:

```js
EGTGeneratorRegistry.attachMeta(q, mode, profile, {
  source: "phase7-generator-registry"
})
```

## Bewusst erhaltene Sicherheitsgrenze
Nicht verändert wurden:

- Generatorfunktionen selbst
- `buildQuiz()` Runtime-Schleife
- `generateQuestionForMode(...)` als Runtime-Orchestrator
- CTC-Lohr-Festblockstruktur
- Coach-Adaptive-Regeln
- Result-/Review-Logik
- Highscore/Cloud-Sync
- Admin/Auth/Firebase
- Demo-Limits
- Session-Keys

## Fallbacks
`app.js` enthält weiterhin `fallbackGeneratorPool(mode)`, damit die App auch dann nicht hart abstürzt, wenn `EGTGeneratorRegistry` nicht geladen wäre.

## Version
Neue Version:

```txt
G45.0
```

Cache:

```txt
egt-trainer-g45-0
```

## Nächster Schritt
Phase 8 sollte entweder:

1. QuestionBank-/Datenpool-Grenzen pro Branch sauberer ausarbeiten, oder
2. `buildQuiz()` als Orchestrator weiter aus `app.js` lösen.
