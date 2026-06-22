# G45.1 — Phase 7.5 Smoke-Test-Handoff / QA-Testplan

## Ziel
Diese Phase ist kein weiterer Architektur-Umbau. Sie ist ein kontrollierter Zwischenstand vor Phase 8, damit die App auf echten Geräten getestet werden kann, bevor `buildQuiz()` und weitere Monolith-Teile aus `app.js` herausgelöst werden.

## Warum diese Phase eingeschoben wurde
Nach Phase 2A bis Phase 7 wurden zentrale Architekturwege verändert:

- `EGTSimulation` ist Simulations-Host/Kontrollschicht.
- `AppModuleHost` steuert Entry-Module und Branch-Kontext.
- Practice, Branch-Simulationen, Branch-QuestionPools und GeneratorRegistry existieren als eigene Schichten.
- Viele UI-Einstiege laufen nun über `AppModuleHost.startModule(...)`.

Bevor Phase 8 startet, muss die aktuelle Version auf echten Geräten geprüft werden. Ziel ist, kritische Funktions- und Darstellungsfehler früh zu finden.

## Durchgeführte Arbeit in G45.1
- Version auf `G45.1` erhöht.
- `node sync-version.js` ausgeführt.
- Working Plan aktualisiert:
  - `WORKING-PLAN_1.md`
  - `docs/WORKING-PLAN.md`
- QA-Handoff-Dokument erstellt:
  - `docs/G45_1_PHASE7_5_SMOKE_TEST_HANDOFF_REPORT.md`
- QA-Statusdatei erstellt:
  - `docs/G45_1_PHASE7_5_SMOKE_TEST_HANDOFF_QA.json`
- Root-Testcheckliste erstellt:
  - `QA-SMOKE-TEST-CHECKLIST-G45.1.md`

## Bewusst nicht verändert
- Keine Generatorfunktionen verändert.
- `buildQuiz()` nicht verändert.
- Keine Firebase-, Login-, Profil-, Admin-, Highscore-, Coach-, Duell- oder Demo-Limit-Logik verändert.
- Kein CSS-Finaldesign durchgeführt.
- Keine neue Featurelogik eingeführt.

## Zweck der nächsten Nutzerprüfung
Der Nutzer soll die App installieren/öffnen und gezielt Screenshots plus kurze Fehlerbeschreibung liefern. Die Screenshots werden danach als Grundlage für eine priorisierte Bugfix-/QA-Phase verwendet.

## Entscheidung nach dem Test
Nach Auswertung der Nutzer-Screenshots gibt es zwei mögliche Wege:

1. Kritische Blocker zuerst beheben, wenn App-Start, Gate, Navigation, Simulation, Profil, Admin, Highscore oder Layout grundlegend kaputt sind.
2. Wenn der Stand stabil genug ist, mit Phase 8 fortfahren: `buildQuiz()`/Quiz-Orchestrator weiter aus `app.js` herauslösen.
