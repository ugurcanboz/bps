# Schichtübergabe · Phase 43V · G54.43.8F Monster Visual QA Detector

## Ausgangslage
Der Nutzer hat im iPhone-Screenshot einen sichtbaren Fehler gemeldet: Im Analysebereich „Stärken & Schwächen“ überlappt das Badge „Vorschau“ optisch den Balken. Die bisherige QA-Bubble erkannte nur technische Basisfehler wie Scroll, Overflow, Touch-Targets und Dock-Overlap, aber keine inneren visuellen Kollisionen.

## Ziel
Die QA-Bubble soll als echtes visuelles Diagnosewerkzeug erweitert werden und nicht mehr nur als einfacher DOM-/Scroll-Reporter dienen.

## Umsetzung
Datei: `js/qa/egt-visual-state-capture.js`

Neu in G54.43.8F:
- `collectVisualMonsterFindings()`
- `detectStrengthWeaknessCollisions()`
- `detectTextCollisions()`
- `detectCardPressure()`
- `detectViewportRiskZones()`
- neuer JSON-Block `visualMonster`
- neue Score-Erweiterung `score.visualFindings`
- neue UI-Karte `MONSTER VISUAL QA`

## Erkennungsklassen
Die Monster-QA erkennt jetzt u. a.:
- Badge überlappt Balken in Stärken/Schwächen
- Badge und Balken stehen zu dicht
- Label ragt in Balken hinein
- Balken überlappt Prozentwert
- Mobile Layout sollte auf Zwei-Zeilen-Aufbau wechseln
- Text-/UI-Elemente überlappen sichtbar
- Karteninhalt klebt zu nah am Rand
- QA-Panel verdeckt aktuell App-Inhalt
- sichtbare Elemente liegen im Dock-Bereich

## Wichtig
Diese Phase repariert primär die QA-Erkennung. Der sichtbare Stärken-/Schwächen-Layoutfehler wird dadurch zuverlässig diagnostizierbar. Der eigentliche UI-Polish-Fix für die Balken sollte als nächste Phase erfolgen.

## Test
`tests_phase43v_monster_visual_qa_detector.html`

Erwartung: PASS 13/13

## Version
- AppConfig: G54.43.8F-2026-06-22
- QA-Capture: G54.43.8F
- Service Worker Cache: `egt-trainer-g54-43-8f`
