# Phase 43D / G54.42.5 – Analyse Dock Deep-Sheet Hotfix

## Anlass
Der Bottom-Menüpunkt „Analyse“ führte auf iPhone-Hochformat sichtbar auf die alte Legacy-Analyse-Seite mit Emoji-Titel, fehlendem Bottom-Menü und unfertiger Wirkung.

## Fix
- `js/modules/egt-analysis-entry-module.js`: Analyse öffnet zuerst `EGTUILayer.openActionMenu('analysis')`.
- `js/ui-router.js`: Analyse-Fallbacks führen nicht mehr primär zu `App.showAnalysis()`.
- Legacy `App.showAnalysis()` bleibt nur als Not-Fallback bestehen, falls das moderne UI-Layer nicht verfügbar ist.

## Nicht geändert
- Keine Aufgabenlogik.
- Keine Trainingslogik.
- Keine Adminlogik.
- Keine Bottom-Dock-Optik.
- Kein Desktop/iPad-Umbau.

## QA-Erwartung
Auf iPhone Hochformat öffnet „Analyse“ jetzt ein modernes Sheet statt der alten Vollseite.
