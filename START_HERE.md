# START HERE – G54.43.8H

Aktueller Stand: **G54.43.8H – Admin Portal Mobile Containment Fix**

## Wichtigste Änderung
Der Bereich **Analyse & Fortschritt → Stärken & Schwächen** wurde auf iPhone repariert.

Problem vorher:

- `Vorschau`-Badge überlappte Balken.
- Zeilen waren auf Mobile zu niedrig/gequetscht.
- Monster QA meldete `strength_weakness_badge_bar_collision`.

Fix jetzt:

- Mobile Zwei-Zeilen-Layout.
- Label + Badge + Prozent oben.
- Balken darunter über volle Breite.
- Mindesthöhe für Zeilen.
- Versionen synchronisiert.

## Test nach Upload

1. App mit `?qa=capture` öffnen.
2. Analyse & Fortschritt öffnen.
3. Zu **Stärken & Schwächen** scrollen.
4. Visuell prüfen.
5. QA-Bubble → State aufnehmen → Text anzeigen.
6. JSON prüfen: keine Stärken-/Schwächen-Kollisionen mehr.

## Relevante Dateien

- `css/phase39i-pixel-polish.css`
- `js/ui-home-renderer.js`
- `js/qa/egt-visual-state-capture.js`
- `tests_phase43w_strength_weakness_mobile_layout.html`
- `SCHICHTUEBERGABE_PHASE43W_STRENGTH_WEAKNESS_MOBILE_LAYOUT_FIX.md`
