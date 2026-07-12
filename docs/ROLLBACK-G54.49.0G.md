# Rollback G54.49.0H

## Ziel
Die kontrollierte Groq-Micro-Personalisierung entfernen und auf G54.49.0F zurückkehren.

## Vorgehen
1. Das vollständige G54.49.0F-Paket wiederherstellen.
2. Service Worker und App-Cache aktualisieren.
3. Optional die Seite neu laden; es gibt keine neue Datenmigration.

## Datenfolgen
G54.49.0H speichert keine KI-Antworten, Prompts, Kontodaten oder Standortkoordinaten. Der neue Layer arbeitet ausschließlich flüchtig pro Welcome-Sitzung. Ein Rollback benötigt keine Server- oder Datenbankmigration.
