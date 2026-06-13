# BPS-Trainer · G38.0-STABLE

Aktueller Stand: G38.0-STABLE-2026-06-13 (stabilisiert & bereinigt: ArchitectureGuard 100/0/0, alle Tabs/Flows fehlerfrei, Selbstdiagnose ohne Fehlalarme). Siehe docs/G38_0_STABLE_REPORT.md.

Vorher: G37.6-INTRO-VIDEO-2026-06-13 (filmischer Intro-/Sperrbildschirm beim Start integriert: css/cinematic.css + js/modules/cinematic-intro.js, Mount-Hook in index.html bei fehlender Session).

Vorher: G37.5-BACKEND-CLEANUP-2026-06-13 (30 tote/überschriebene Funktionen entfernt, Highscore-Render verifiziert, network-first Cache). Siehe docs/G37_5_BACKEND_CLEANUP_REPORT.md.

Vorher: G37.4-CACHE-STRATEGY-FIX-2026-06-13 (Service Worker network-first für
Layout-/Logik-Dateien, damit der bereits vorhandene G37.3-Highscore-Fix auf installierten
Geräten ankommt; Versionen vereinheitlicht). Siehe docs/G37_4_CACHE_STRATEGY_FIX_REPORT.md.

Vorher: G35.6-LAYOUT-REPAIR-2026-06-11 (Stand-Zusammenführung + Layout-Reparatur, siehe docs/G35_6_LAYOUT_REPARATUR_REPORT.md).

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
