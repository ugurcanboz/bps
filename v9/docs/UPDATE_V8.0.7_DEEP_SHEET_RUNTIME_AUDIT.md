# Update V8.3.9 · Deep Sheet Runtime Audit

## Ziel
Die alte statische Üben-/Accordion-Darstellung wurde aus dem sichtbaren Üben-Bereich entfernt. Das Deep Sheet ist die primäre Trainingsnavigation für Desktop und Mobile.

## Reparaturen
- Practice-Focus-Leiste ausgeblendet, damit keine alte Listenoptik mehr sichtbar bleibt.
- Top-Nav-Kategoriebuttons öffnen jetzt direkt das Trainingssheet.
- Üben-Button öffnet automatisch das Sheet.
- Trainingskarten im Sheet bleiben klickbar und rufen `App.selectMode()` auf.
- Sheet-Layout neu gelockt: Desktop zentriert, Mobile als Bottom Sheet.
- Kategorie-Pills bleiben als Unterkategorien erhalten.
- Modus-Verträge für Simulation/Freies Üben/Blocktraining geprüft.

## Audit
- JS Syntax: bestanden
- JSON: bestanden
- Onclick-Export-Mapping: 34/34 bestanden
- Modus-Tab-Mapping: 22/22 Modus-Keys gültig
- Matrix Assets: 8/8 vorhanden
- Satzergänzungsbank: vorhanden
