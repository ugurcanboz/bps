# Rollback G54.49.0B

## Ziel
Zur stabilen Ausgangsbasis G54.49.0A zurückkehren.

## Vorgehen
1. Deployment von G54.49.0A erneut veröffentlichen.
2. Service Worker und Cache `egt-trainer-g54-49-0b` entfernen bzw. durch den vorherigen Cache ersetzen.
3. Prüfen, dass der klassische Gate-Screen wieder aktiv ist und Auth, Registrierung sowie Demo weiterhin funktionieren.

## Datenwirkung
G54.49.0B speichert keine Mood- oder Goal-Daten. Ein Rollback benötigt keine Datenmigration.
