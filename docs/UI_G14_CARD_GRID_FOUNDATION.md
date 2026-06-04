# UI-G14 Card Grid Foundation

Ziel: Trainingsbereich-Kacheln zentral im UI-Fundament stabilisieren.

## Änderungen

- Kein Einzel-Fix pro Kachel.
- `.ui-training-area-grid` nutzt ein adaptives Auto-Fit-Grid.
- Desktop kann fünf Kacheln sauber darstellen, kleinere Breiten umbrechen automatisch.
- iPhone nutzt eine stabile einspaltige Listen-Kachel, damit Text und Icons nicht gequetscht werden.
- Text bricht nicht mehr mitten im Wort durch `overflow-wrap:anywhere`.
- Pfeil/CTA bleibt außerhalb der Textfläche.

## Regel

Neue Trainingsbereich-Kacheln müssen nur `.ui-training-area-card` und `data-ui-action` nutzen. Das Layout übernimmt das Fundament.
