# Schichtübergabe – Phase 42 Live Deploy Device QA

## Aktuelle ZIP

`Eignungstest-Trainer-G54.42-Live-Device-QA.zip`

## Ausgangspunkt

Phase 41 hatte GitHub-Pages-Deploy-Readiness hergestellt und das Manifest von altem Stand auf G54.41 korrigiert.

## Phase 42 erledigt

Phase 42 hebt die App auf **G54.42** und bereitet die echte Live-Geräte-QA vor.

### Geänderte zentrale Dateien

- `js/core/app-config.js`
  - Version: `G54.42`
  - Label: `G54.42 Live Deploy Device QA`
- `manifest.json`
  - Version: `G54.42`
  - Beschreibung aktualisiert
- `update-check.json`
  - Version/latest/build: `G54.42-2026-06-20`
  - Cache: `egt-trainer-g54-42`
  - Phase: `42`
- `service-worker.js`
  - Cache: `egt-trainer-g54-42`
  - Phase-42-Artefakte ergänzt
- `index.html`
  - Fallback-Version auf `G54.42-2026-06-20`

### Neue Dateien

- `docs/PHASE42_LIVE_DEVICE_QA.md`
- `tests_phase42_live_device_qa.html`
- `phase42_live_device_qa.py`
- `phase42_live_device_qa_result.json`
- `SCHICHTUEBERGABE_PHASE42_LIVE_DEVICE_QA.md`

## QA Ergebnis

`phase42_live_device_qa.py` ausgeführt.

Ergebnis:

- 23 Checks
- 23 bestanden
- 0 Fehler
- `passed=true`

## Wichtig

Ein echter iPhone/iPad-Live-Test kann in der Sandbox nicht durchgeführt werden. Die Testseite ist aber vorbereitet:

`tests_phase42_live_device_qa.html`

Diese nach GitHub-Pages-Deploy aufrufen auf:

- iPhone Safari
- iPad Safari
- Desktop Chrome/Edge

## Manuelle Abnahme nach Deploy

Prüfen:

1. Startseite lädt ohne altes Layout.
2. Version ist G54.42.
3. Kein horizontaler Scroll auf iPhone.
4. Bottom-Dock überlappt nichts.
5. iPad Layout wirkt ausbalanciert.
6. Admin-Portal scrollt sauber.
7. Sprachkurs öffnet.
8. Prüfungsdashboard öffnet.
9. Service Worker registriert sich.
10. `update-check.json` meldet G54.42.

## Nächster sinnvoller Schritt

**Phase 43 – Release Candidate Freeze & produktive Übergabe**

Ziel: keine neuen Features mehr, nur noch kritische Live-Bugs beheben, finale Übergabe- und Testanleitung erstellen.
