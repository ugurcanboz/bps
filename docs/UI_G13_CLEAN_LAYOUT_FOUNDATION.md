# UI-G13 Clean Layout Foundation

Ziel: Header/Logo-Balken und verschobene Kachel-Darstellung nicht per Einzelpatch, sondern durch Bereinigung des aktiven UI-Fundaments beheben.

## Umsetzung

- Alte UI-F/Home-Patch-Sektionen aus `css/ui-foundation.css` entfernt.
- Nur noch ein aktiver Home/Layout-Block ab `UI-G13 CLEAN HOME FOUNDATION`.
- Header/Logo explizit transparent und ohne eigene Balken/Wrapper-Hintergründe.
- Trainingsbereich als adaptives Foundation-Grid: 5 Spalten auf großem Desktop, 3 auf kleinerem Desktop/Tablet, 2 auf Mobile.
- Karten-Hitbox, Icon-Layer und Textumbruch zentral geregelt.
- Overlay/Sheet-Basis in demselben Fundament belassen.

## Wichtig

Neue Kacheln müssen weiterhin nur `data-ui-action` und die Foundation-Klassen verwenden. Keine neuen kachelspezifischen UI-Schichten hinzufügen.
