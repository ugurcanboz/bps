# UI-G4 Adaptive Target Foundation

## Ziel

Das UI-Haus bleibt stabil, egal wie viele Kacheln/Türen hinzukommen.

## Umsetzung

- Trainingsbereich nutzt ein adaptives Grid für 5+ Kacheln.
- Schnellzugriff Üben und Lernmodus sind jetzt zwei getrennte Foundation-Zielseiten.
- `EGTUILayer.openPracticeMode(mode)` rendert Üben/Lernmodus zentral.
- `js/ui-router.js` ruft nur noch zentrale Foundation-Ziele auf.
- Neue Kacheln brauchen weiterhin nur `data-ui-action` und optional `data-module` / `data-branch`.

## Regel

Neue Tür = Button mit `data-ui-action`. Das UI-Fundament übernimmt Layout, Tap, Route und Zielseite.
