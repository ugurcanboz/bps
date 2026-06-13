# G30.4 Answer Layout Speed Fix

## Ziel
Antwortoptionen dürfen im Trainingsmodus nicht intern scrollbar sein. Bei Zeitdruckaufgaben müssen alle Optionen ohne zusätzliches Scrollen sichtbar und antippbar sein.

## Änderungen
- Desktop-Cockpit nicht mehr auf eine harte Innenhöhe begrenzt.
- Antwortliste (`#answers`) im Trainingscockpit: `overflow: visible`, keine interne Scrollbar.
- Antwortkarten kompakter, aber weiterhin gut lesbar und touchfähig.
- Aktionsleisten bleiben statisch im Layout und überlagern die Antworten nicht.
- iPad/iOS behalten natürliche Seiten-Scrollbarkeit, aber keine interne Antwortlisten-Scrollbar.

## Nicht verändert
- Neon-Startseite
- Admin-/Dozentenportal
- Systeminfo, Aufgabenbank, Berichte
- Login und Rechte-/Gruppenmodell
