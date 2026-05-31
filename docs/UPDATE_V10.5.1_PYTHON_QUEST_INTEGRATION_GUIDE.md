# Update V10.5.1 · Python Quest Integration Guide

Dieses Release ergänzt keine neuen Python-Level, sondern macht die Integration nachvollziehbar und übergabesicher.

## Neu

- `PYTHON_QUEST_START_HERE.md`
- `docs/PYTHON_QUEST_INTEGRATION_GUIDE.md`
- `docs/PYTHON_QUEST_QA_CHECKLIST.md`
- `docs/PYTHON_QUEST_LEVEL_AUTHORING_GUIDE.md`
- `module-manifest.json` auf Python Quest Phase 10 aktualisiert
- `update-check.json` auf V10.5.1 aktualisiert
- Service Worker Cache auf V10.5.1 aktualisiert
- Cache-Busting in `index.html` für Python Quest / Coach-Dateien aktualisiert

## Zweck

Ein Entwickler kann jetzt eindeutig nachvollziehen:

- welche Dateien Pflicht sind
- welche Lade-Reihenfolge gilt
- wie Python-Modul und KI-Coach verbunden sind
- wie Level-Gating funktioniert
- wie neue Level ergänzt werden
- wie QA vor Release geprüft wird

## Wichtig

Das Python-Modul bleibt fachlich separat von der BPS-/CTC-Simulation, ist aber technisch über `BPSLearningCoachEngine.evaluatePythonSubmission(payload)` mit dem KI-Coach verbunden.
