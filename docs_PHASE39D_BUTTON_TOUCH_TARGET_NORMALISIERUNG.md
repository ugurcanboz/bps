# Phase 39D – Button/Touch Target Normalisierung

## Ziel
Interaktive Hauptflächen auf iPhone, iPad und Desktop vereinheitlichen. Schwerpunkt: Mindestgröße, Abstand, Tap-Verhalten und weniger Fehlbedienung.

## Umgesetzt
- Globale Touch-Token ergänzt:
  - `--egt-touch-min: 44px`
  - `--egt-touch-min-comfort: 48px`
  - `--egt-touch-gap: 8px`
- Hauptbuttons, Karten, Deep-Sheet-Aktionen, Dock-Buttons und Rollenbuttons erhalten Mindestgrößen.
- Touch-Geräte bekommen komfortablere 48px Mindesthöhe für zentrale Buttons.
- Summary-/Details-Elemente erhalten Mindesthöhe und bessere Tap-Fläche.
- Checkboxes/Radio-Elemente erhalten sichere Mindestgrößen.
- Admin-Portal erhält eigene Touch-Normalisierung für Buttons, Tabs und Aktionsflächen.
- Language Academy erhält eigene Touch-Normalisierung für Level-Chips, Tabs, Antworten und Mini-Training.
- Legacy-Chips aus alten Modulen wurden normalisiert:
  - `qnav-page-btn`
  - `reviewFilter`
  - `hs-filter-chip`
  - `route-chip`
  - `visual-chip`

## Geänderte Dateien
- `css/ui-foundation.css`
- `css/admin-portal.css`
- `css/language-course.css`
- `css/app.css`
- `js/core/app-config.js`
- `service-worker.js`
- `update-check.json`
- `manifest.json`
- `WORKING-PLAN_1.md`

## Neue QA-Dateien
- `tests_phase39d_touch_targets.html`
- `phase39d_static_qa.py`
- `phase39d_static_qa_result.json`

## QA
- JS-Syntaxcheck: bestanden
- JSON-Check: bestanden
- Service-Worker-Asset-Check: bestanden
- Phase-39D-Static-QA: bestanden
- ZIP-Check: bestanden

## Hinweis
Der echte Chromium-Headless-Test bleibt in der Container-Umgebung durch den bekannten Crashpad-Fehler blockiert. Deshalb liegt eine browserinterne QA-Testseite bei, die auf echtem Gerät oder GitHub Pages die sichtbaren Touchflächen prüfen kann.
