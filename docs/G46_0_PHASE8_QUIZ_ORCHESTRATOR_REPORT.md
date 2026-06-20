# G46.0 · Phase 8 · Quiz-Orchestrator-Grenze

## Ziel
`buildQuiz()` sollte nicht weiter als direkte Monolith-Logik in `js/app.js` wachsen. Phase 8 zieht deshalb eine eigene Orchestrator-Schicht ein, ohne Generatoren, Result/Review, Highscore, Coach, Admin/Auth oder Firebase anzufassen.

## Geänderte Dateien

- `js/core/quiz-orchestrator.js` neu erstellt
- `js/app.js` angepasst
- `index.html` erweitert
- `js/core/architecture-guard.js` erweitert
- `service-worker.js` erweitert und Cache auf G46.0 gesetzt
- `js/core/app-config.js` Version/Label aktualisiert
- `manifest.json` Version aktualisiert
- `update-check.json` aktualisiert
- `module-manifest.json` aktualisiert
- `WORKING-PLAN_1.md` aktualisiert
- `docs/WORKING-PLAN.md` aktualisiert

## Technische Umsetzung

### Neue Datei
`js/core/quiz-orchestrator.js`

Stellt bereit:

```js
window.EGTQuizOrchestrator.build(ctx)
```

Der Orchestrator übernimmt:

- Matrix-Sprint-Sonderfall über Hook `buildMatrixOnlyQuiz`
- Reset der verwendeten Fragen über Hook `resetUsed`
- Modus-Vorbereitung über Hook `setupMode`
- Coach-Erstellung über Hook `buildCoach`
- Memory-Fragen über Hook `buildMemoryQuestions`
- Kernfragen über Hook `generateCoreQuestion`
- DNA-/Qualitätsvalidierung über Hook `validateQuestion`
- Duplikat-Schutz über Hook `signature`
- Fallback-Duplikate, falls nicht genug eindeutige Aufgaben entstehen
- finale Reihenfolge: CTC/CTC-Lohr bleiben ungeshuffelt, andere Modi werden geshuffelt

### app.js

`buildQuiz()` ist jetzt nur noch Wrapper:

- nutzt `EGTQuizOrchestrator.build(...)`, wenn verfügbar
- fällt sonst auf `buildQuizInternal()` zurück

Die ursprüngliche Logik wurde nicht gelöscht, sondern in `buildQuizInternal()` erhalten.

## Bewusst nicht geändert

- keine Generatorfunktionen verschoben
- `generateQuestionForMode(...)` bleibt in `js/app.js`
- keine Änderung an `buildAdaptiveQuestion(...)`
- keine Änderung an Result/Review
- keine Änderung an Highscore/Cloud
- keine Änderung an Coach-Memory
- keine Änderung an Admin/Auth/Firebase
- keine Änderung an Demo-Limits
- keine CSS-/Layout-Fixes

## Nutzen

Nach Phase 8 ist der Quiz-Aufbau eine klarere Grenze. Neue Branchen, Poolprofile und spätere QuestionBanks können über den Orchestrator sauberer integriert werden, ohne `buildQuiz()` ständig direkt zu erweitern.

## Nächster Schritt

Phase 9 sollte entweder:

1. `generateQuestionForMode(...)` als nächste Orchestrator-Schicht aus `js/app.js` herauslösen, oder
2. QuestionBank-/Datenpool-Grenzen pro Branche definieren und stärker an `EGTGeneratorRegistry` anbinden.
