# Rollback G54.50.2I

1. `js/core/deep-sheet-navigation.js` und `css/deep-sheet-navigation.css` entfernen.
2. Die beiden Referenzen aus `index.html` und `service-worker.js` entfernen.
3. `js/ui-home-renderer.js` auf den Stand G54.50.2H zurücksetzen.
4. `js/modules/info-legal-center.js` auf den Stand G54.50.2H zurücksetzen.
5. Die zentrale Version in `js/core/app-config.js` zurücksetzen und `node sync-version.js` ausführen.

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
