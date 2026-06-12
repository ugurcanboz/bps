# BPS-Trainer · G35.9-HIGHSCORE-ZENTRALE

Aktueller Stand: G35.9-HIGHSCORE-ZENTRALE-2026-06-12 (Online-Kursrangliste via Firestore, Highscore-Seite, Admin-Diagramme – siehe docs/G35_6_LAYOUT_REPARATUR_REPORT.md Nachtrag G35.9).

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
