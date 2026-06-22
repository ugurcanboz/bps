# G52.3 / Phase 17 — Duell Runtime Engine

## Ziel

Phase 17 trennt die Duell-Runtime und den Duell-Control-Flow weiter aus `js/app.js` heraus. Phase 16 hatte bereits die reine Duell-/Highscore-UI in `js/core/highscore-duel-ui-engine.js` ausgelagert. Phase 17 zieht nun den Ablauf selbst nach:

- lokales Hot-Seat-Duell
- Spieler-1-zu-Spieler-2-Handover
- Ergebnisvergleich
- Duell-History-Schreibpfad
- Online-Duell erstellen
- Online-Duell beitreten
- Online-Polling auf Gegner/Gegnerergebnis
- Duell abbrechen / verlassen / Revanche
- Duell-Setup-Overlay-Steuerung

## Neue Datei

```txt
js/core/duell-runtime-engine.js
```

Neue globale API:

```txt
window.EGTDuellRuntimeEngine.create(...)
window.DuellRuntimeEngine
App._test.DuellRuntimeEngine
```

## Änderungen in `app.js`

`app.js` erzeugt jetzt eine Runtime-Instanz:

```txt
DuellRuntimeEngine = window.EGTDuellRuntimeEngine.create(...)
```

Die bisherigen öffentlichen App-Methoden bleiben für vorhandene Buttons und Inline-Handler bestehen, sind aber nur noch dünne Wrapper:

```txt
App.openDuellSetup()
App.startDuell()
App.duellStartP2()
App.duellCreateOnline()
App.duellJoinOnline()
App.duellBeginOnlineRun()
App.duellRetrySubmit()
App.duellExit()
```

## Bewusst unverändert geblieben

Nicht verschoben wurden:

- allgemeiner Quiz-Lifecycle
- `startQuiz()` / `buildQuiz()`
- normale Ergebnislogik außerhalb von Duell
- Admin-Portal-Implementierung selbst
- Auth/Profile/Firebase-Logik

Die neue Runtime nutzt diese Bereiche nur über injizierte Adapter. Dadurch bleibt die Trennung sauber, ohne die funktionierende Simulation riskant umzubauen.

## Aktualisierte Dateien

```txt
index.html
js/app.js
js/core/duell-runtime-engine.js
js/core/architecture-guard.js
js/core/app-config.js
service-worker.js
manifest.json
update-check.json
module-manifest.json
docs/WORKING-PLAN.md
WORKING-PLAN_1.md
```

## QA-Ergebnis

- JS-Syntaxcheck für neue Runtime bestanden.
- `js/app.js` Syntaxcheck bestanden.
- JSON-Validierung bestanden.
- Service-Worker Assetliste enthält `js/core/duell-runtime-engine.js`.
- Headless-Smoke-Test bestätigt globale Runtime-Verfügbarkeit.
- Duell-Setup rendert weiter über Phase-16-UI und Runtime-Wrapper.
- Horizontaler Overflow im Smoke-Test: 0.

## Nächster sinnvoller Schritt

Phase 18 sollte jetzt entweder:

1. das Highscore-/Duell-Sheet-Routing weiter modularisieren, oder
2. den allgemeinen Quiz-Lifecycle stärker Richtung `quiz-orchestrator.js` verschieben.

Empfehlung: Phase 18 = Highscore-/Duell-Sheet-Routing modularisieren, weil Phase 14–17 genau diesen Bereich vorbereitet haben.
