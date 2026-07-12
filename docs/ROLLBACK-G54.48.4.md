# Rollback G54.48.4

## Zweck
Wiederherstellung der letzten freigegebenen Novura-Version, falls die vollständige Legacy-Bereinigung unerwartete Laufzeitprobleme verursacht.

## Vorgehen
1. Aktuelles Deployment stoppen.
2. Das verifizierte Rollback-Artefakt der Version G54.48.4 beziehungsweise den unmittelbar davor erzeugten G54.48.3-Stand bereitstellen.
3. Dateien vollständig ersetzen, nicht mischen.
4. Service-Worker-Cache und Browser-Cache invalidieren.
5. Release-Gate erneut ausführen.
6. Kernabläufe Novura Assessments, Novura Exams, Novura Coach und Admin prüfen.

## Datenhinweis
Da vor dieser Phase keine aktiven Nutzerbestände vorhanden waren, ist keine Rückmigration alter BPS- oder CTC-Schlüssel erforderlich.

## Web-App zurücksetzen
- Das vorherige, SHA-256-verifizierte Runtime-Artefakt vollständig deployen.
- Keine Dateien unterschiedlicher Versionen mischen.
- Danach Service Worker aktualisieren, Cache leeren und die Kernnavigation prüfen.

## Cloudflare Worker zurücksetzen
- Den zuletzt freigegebenen Worker-Stand mit der passenden Produktionskonfiguration deployen.
- Secrets und Bindings nicht aus lokalen Dateien übernehmen, sondern aus der Zielumgebung verwenden.
- Anschließend Health-Endpunkt, Origin-Prüfung, Rate Limit und Replay-Schutz testen.

## Firebase Restore
Ein Firestore- oder Auth-Restore wird nicht ungeprüft gestartet. Vor jeder Wiederherstellung müssen Exportzeitpunkt, Datenumfang, Zielprojekt und Integrität kontrolliert werden.

## Produktions-Sicherheitsregel
Ein Restore oder Rollback wird sofort abgebrochen, sobald Projekt-ID, Domain oder Backup-Prüfsumme nicht eindeutig zur vorgesehenen Produktionsumgebung passen.
