# Rollback G54.50.2J

## UI-Patch zurücknehmen
1. `css/text-layout-consistency.css` aus `index.html` und `service-worker.js` entfernen.
2. Den vorherigen Release G54.50.2I wiederherstellen.
3. App-Version über `js/core/app-config.js` zurücksetzen und `node sync-version.js` ausführen.
4. Service-Worker-Cache erneuern und die PWA neu laden.

## Vollständiger Produktions-Rollback

### Web-App zurücksetzen
- Nur auf einen zuvor verifizierten Build zurückgehen.
- Vor dem Austausch die aktuelle Web-App sichern.
- Nach dem Upload Service Worker und Cache-Version kontrolliert aktualisieren.

### Cloudflare Worker zurücksetzen
- Den zuletzt freigegebenen Worker-Stand separat deployen.
- Secrets niemals aus einem ZIP übernehmen oder in den Browser kopieren.
- Worker-Rollback und Web-App-Rollback getrennt protokollieren.

### Firebase und Firestore
Ein Firebase-Restore wird **nicht ungeprüft gestartet**. Vor jeder Wiederherstellung müssen Inhalt, Mandant, Zeitpunkt und Auswirkungen geprüft werden.

Ein produktiver Restore wird blockiert, wenn **Projekt-ID, Domain oder Backup-Prüfsumme** nicht eindeutig zum vorgesehenen Novura-System passen.
