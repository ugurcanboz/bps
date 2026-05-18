# Update-Hinweis V7.2.0

Diese Version enthält ein temporäres Update-Popout.

## Funktionsweise
- Die App lädt `update-check.json` immer mit `cache: no-store`.
- Wenn dort eine höhere Version steht als in der aktuell geladenen App, erscheint ein Popout.
- `Ja, updaten` löscht Caches/Service Worker und lädt die Seite mit Cache-Buster neu.
- `Nein` schließt den Hinweis und merkt sich die abgelehnte Zielversion lokal.

## Testmodus
Zum Erzwingen des Fensters:

`index.html?forceUpdateModal=1`

## Später deaktivieren
Den Scriptblock `TrainerUpdatePrompt` und die Modal-HTML/CSS entfernen oder `update-check.json` nicht höher setzen.
