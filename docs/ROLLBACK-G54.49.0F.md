# Rollback G54.49.0H

## Ziel
Zurücksetzen von Adaptive Nova Context & Memory auf G54.49.0D.

## Vorgehen
1. G54.49.0D-Paket wiederherstellen.
2. Service Worker aktualisieren und alten Cache `egt-trainer-g54-49-0e` entfernen.
3. Optional den lokalen Schlüssel `novura.novaMemory.v2` löschen.

## Daten
G54.49.0H speichert nur versionierte lokale UI-Präferenzen, zuletzt verwendete Dialog-IDs und Berechtigungsstatus. Keine Standortkoordinaten, Freitexte oder sensiblen Profile werden gespeichert. Ein Rollback benötigt keine Servermigration.
