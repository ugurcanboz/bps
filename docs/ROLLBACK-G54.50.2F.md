# Rollback G54.50.2F

## Web-App zurücksetzen
Die Web-App auf den geprüften Stand G54.50.2E zurücksetzen. Dazu insbesondere `functions/index.js`, `js/modules/egt-auth-engine.js`, Runtime-Versionen, Manifest, Update-Datei und Service Worker aus dem vorherigen Release wiederherstellen. Anschließend den neuen Web-Stand deployen und den Service-Worker-Cache kontrolliert aktualisieren.

## Cloudflare Worker zurücksetzen
Falls der Worker zusammen mit diesem Release veröffentlicht wurde, den zuletzt freigegebenen Worker-Build erneut deployen. Vor dem Rollback müssen Projekt-ID, Domain oder Backup-Prüfsumme mit dem Zielsystem abgeglichen werden.

## Firebase und Functions
Functions und Firestore-Regeln aus dem vorherigen geprüften Stand erneut deployen. Ein Firebase Restore wird nicht ungeprüft gestartet. Vor jedem Restore müssen Projekt-ID, Domain oder Backup-Prüfsumme eindeutig zum Produktionsprojekt passen.

```bash
firebase deploy --only firestore,functions
```

## Sicherheitsprüfung nach dem Rollback
- Admin-Custom-Claims kontrollieren
- Firestore-Dokument `system/bootstrapAdmin` nicht manuell löschen
- Login, Adminportal und Nova-Welcome testen
- aktuellen Service Worker und Cache-Namen kontrollieren
