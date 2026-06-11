# BPS-Trainer · G35.2-PRIO-FIX

Aktueller Stand: G35.2-PRIO-FIX-2026-06-11 (P1–P8 abgearbeitet, siehe docs/G35_2_PRIORITAETEN_REPORT.md). Davor: G35.1-CTC-FIX-2026-06-10 (Aufgabendatenbank + Simulation korrigiert, siehe docs/G35_1_CTC_SIMULATION_FIX_REPORT.md).

Vorher: G35.0-FIX-2026-06-09.

Basiert auf G35.0-USER-CENTER-STEP1-2026-06-08.

Bugfixes in diesem Build:
- Update-Modal erschien bei jedem Start (CURRENT='release' Bug) → behoben
- Update-Check nutzte Release-Notes-Text als Versionsnummer → behoben
- Update-Modal Versions-Badges waren versteckt → werden jetzt korrekt angezeigt
- app.js APP_VERSION zeigte G34.1 statt G35.0 → synchronisiert
- manifest.json zeigte Version G33.1 → auf G35.0 aktualisiert
- Login-Button ohne CSS transition → smooth state changes
- Login-Button ohne Hover-State (Desktop/iPad) → ergänzt
- Hero-CTA ohne Hover-State → ergänzt mit scale + glow
- focus-visible fehlte auf Login-Button, CTA, Training-Cards → ergänzt
- Ergebnis-/Analyse-Screen: Buttons hinter Bottom-Dock → padding-bottom fix
- Service Worker: 10 fehlende Docs-Einträge ergänzt

Wichtig: Nach Deployment Cache/Website-Daten der PWA löschen oder hart aktualisieren.
Details: docs/G35_0_FIX_REPORT.md
