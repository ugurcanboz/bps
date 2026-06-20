# Schichtübergabe – Phase 40 Golden Master QA

## Aktuelle ZIP

`Eignungstest-Trainer-G54.40-Golden-Master-QA.zip`

## Aktueller Stand

Phase 40 ist abgeschlossen. Die G54-Reihe ist als Golden-Master-Candidate deploybereit.

## Wichtigster Fund

Vor Phase 40 waren zentrale Versionierungsdateien nicht sauber synchron:

- `js/core/app-config.js` war noch `G54.39G`
- `update-check.json` war noch `G54.39F`

Das wurde korrigiert auf:

- Version: `G54.40-2026-06-20`
- Phase: `40`
- Cache: `egt-trainer-g54-40`

## Neue/geänderte Dateien

- `js/core/app-config.js`
- `index.html`
- `update-check.json`
- `service-worker.js`
- `docs/PHASE40_GOLDEN_MASTER_QA_REPORT.md`
- `tests_phase40_golden_master_qa.html`
- `phase40_golden_master_qa.py`
- `phase40_golden_master_qa_result.json`
- `WORKING-PLAN.md`
- `SCHICHTUEBERGABE_PHASE40_GOLDEN_MASTER_QA.md`

## QA-Ergebnis

`phase40_golden_master_qa_result.json`

- Total: 28
- Passed: 28
- Failed: 0
- `passed=true`

## Nächster sinnvoller Schritt

Phase 41 – GitHub-Pages-Deploy-Check mit Cache-Bust und echter Geräteabnahme.

Konkrete Pflichttests:

1. Upload/Deploy der ZIP-Dateien auf GitHub Pages
2. Hard Refresh / Cache löschen
3. iPhone Safari prüfen
4. iPad Safari prüfen
5. Desktop Chrome/Edge prüfen
6. Gate/Sperrbildschirm prüfen
7. Home/Dashboard prüfen
8. Admin prüfen
9. Sprachkurs prüfen
10. Simulation/Exam Dashboard prüfen
11. Browser-QA öffnen: `tests_phase40_golden_master_qa.html`

## Bekannte Einschränkung

In der Sandbox kann Chromium blockiert sein. Deshalb wurden browserinterne QA-Seiten beigelegt, die lokal/auf GitHub Pages ausgeführt werden können.
