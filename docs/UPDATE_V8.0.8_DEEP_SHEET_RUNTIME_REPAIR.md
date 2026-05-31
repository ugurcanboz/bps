# V8.3.9 Deep Sheet Runtime Repair

Reparatur-Ziel: Deep Sheet als einzige Trainingsnavigation, keine alte Accordion-/Listenoptik mehr, alle 22 Modi vollständig erreichbar.

## Behoben
- Deep Sheet zeigt jetzt alle Kategorien und alle Modi, nicht nur den aktiven Tab.
- Kategorie-Pills: Alle, Simulationen, Mathe, Logik & Muster, Sprache & Wissen, Konzentration, IT/FISI & Technik.
- Alle 22 Modi sind exakt einer Kategorie zugeordnet.
- Alte Accordion-/Listen-/Fallback-Container im Üben-Bereich werden per Runtime und CSS deaktiviert.
- Buttons: Sheet öffnen, Kategorie wechseln, Modul wählen, Training starten, Schließen per X/Backdrop/Escape.
- Selektiertes Modul wird im Sheet sichtbar angezeigt und kann direkt gestartet werden.
- Manifest/Version/Serviceworker auf V8.3.9 vereinheitlicht.

## Validierung
- JS Syntax: OK
- 22/22 Modi in Trainingskategorien enthalten
- 23/23 App-Button-Funktionen exportiert
- 8/8 Matrixbilder vorhanden
- Satzergänzungsbank aktiv
