# Update V8.3.9 Native Deep Sheet Fix

## Ziel
Korrektur der Deep-Sheet-Darstellung nach Desktop-Screenshots. Das Trainingsmenü bleibt als Deep Sheet auf Desktop und Mobile erhalten, wird aber nicht mehr als Präsentationskarte dargestellt.

## Änderungen
- Alte statische Practice-Tabs im Üben-Bereich ausgeblendet.
- Launch-Bereich kompakt statt großer Präsentationskarte.
- Desktop-Sheet zentriert, höher gesetzt und mit fixer viewport-bezogener Höhe.
- Mobile-Sheet bleibt Bottom-Sheet, aber mit korrekter Höhe und internem Scrollbereich.
- Mode-Karten im Sheet synchron als 1/2/3-Spalten-Grid je nach Bildschirmgröße.
- Content-Scroll im Sheet repariert, damit der Nutzer nicht am unteren Rand abgeschnitten wird.
- Version auf V8.3.9 vereinheitlicht.

## Fix-Befunde
1. Sheet saß auf Desktop zu weit unten.
2. Innenbereich hatte keinen zuverlässigen Scroll-Container.
3. Erste Kategorie wurde durch alte CSS-Regeln unsauber aufgeklappt/geschlossen.
4. Mode-Karten wirkten nicht synchron, weil die Grid-Regeln überschrieben wurden.
5. Üben-Bereich zeigte noch alte statische Navigation statt Deep-Sheet-Fokus.
