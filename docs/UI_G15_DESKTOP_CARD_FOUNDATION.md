# UI-G15 Desktop Card Foundation

Chrome/Desktop bekam eine eigene saubere Trainingskarten-Regel.

## Änderung

- Kein erzwungenes 5-Spalten-Layout mehr bei 1180px Containerbreite.
- Desktop-Trainingskarten nutzen adaptive Mindestbreite von 320px.
- 5 Trainingsbereiche laufen dadurch stabil als 3+2 statt zu eng gequetscht.
- Texte werden linksbündig und ohne harte Wortbrüche dargestellt.
- CTA-Pfeil liegt getrennt vom Textbereich.

## Prinzip

Das ist ein Foundation-Fix: Jede neue Trainingskachel erbt automatisch dasselbe Layout über `.ui-training-area-grid` und `.ui-training-area-card`.
