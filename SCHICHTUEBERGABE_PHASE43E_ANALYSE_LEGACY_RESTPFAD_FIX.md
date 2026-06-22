# Phase 43E / G54.42.6 – Analyse Legacy-Restpfad Fix

## Ziel
Der letzte direkte Analyse-Restpfad im Profil-/Systembereich wurde vom alten `App.showAnalysis()`-Aufruf auf den modernen Analyse-Entry/Deep-Sheet-Pfad umgestellt.

## Geändert
- `js/ui-home-renderer.js`: Button `uiBtnAnalysis` nutzt nun primär `EGTAnalysisEntryModule.open('profile-system-analysis-button')`.
- Fallback bleibt: `EGTUILayer.openActionMenu('analysis')`, danach `progress`, danach nur als Notfallback `App.showAnalysis()`.
- `js/modules/egt-analysis-entry-module.js`: Version auf `G54.42.6-analysis-legacy-path-fix` aktualisiert.
- Manifest, Update-Check und Service Worker auf G54.42.6 aktualisiert.

## Nicht geändert
- Keine Optikänderung.
- Keine Bottom-Menü-Änderung.
- Keine Trainings-/Aufgaben-/Adminlogik.
- Keine Desktop-/iPad-Layoutänderung.

## Ergebnis
Der bekannte Legacy-Restpfad aus dem Quality Check ist behoben. Analyse & Fortschritt sollten jetzt über Bottom-Dock und Profil/Systembereich denselben modernen Deep-Sheet-Weg verwenden.
