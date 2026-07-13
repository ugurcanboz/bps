# Rollback G54.50.2H

## Web-App zurücksetzen

Die Web-App auf den geprüften Stand G54.50.2G zurücksetzen und den Service-Worker-Cache durch eine neue Versionskennung invalidieren. Dabei werden `js/ui-home-renderer.js`, `js/modules/info-legal-center.js` und `css/ui-foundation.css` auf den G-Stand zurückgesetzt.

Der lokale Admin-Bootstrap aus G54.50.2G bleibt erhalten. Ein früherer öffentlicher oder Cloud-Functions-basierter Admin-Bootstrap darf nicht ungeprüft wieder aktiviert werden.

## Cloudflare Worker zurücksetzen

Den Cloudflare Worker nur auf eine eindeutig bekannte und geprüfte Version zurücksetzen. Die Worker-Version muss zur Web-App und zur freigegebenen API-Konfiguration passen.

## Firebase und Adminrechte

Ein Firebase-Restore wird nicht ungeprüft gestartet. Vor jeder Wiederherstellung müssen Projekt-ID, Domain oder Backup-Prüfsumme eindeutig zum Zielsystem passen.

Der Firestore-Lock `system/bootstrapAdmin` darf nach erfolgreicher Einrichtung nicht gelöscht oder auf einen offenen Zustand zurückgesetzt werden. Bereits gesetzte Admin-Custom-Claims werden nur nach ausdrücklicher Prüfung verändert.

## Funktionsprüfung nach dem Rollback

1. Informationscenter öffnen.
2. Rechtliches öffnen.
3. Nutzungsbedingungen öffnen.
4. Prüfen, dass X den Dialog schließt.
5. Beachten, dass der neue Zurück-Button nach einem Rollback auf G54.50.2G nicht mehr vorhanden ist.
6. Login, Registrierung, Demo und Admin-Login kontrollieren.

## Lokale Dateien

Die Datei `.novura-admin-bootstrap-completed.json` ist nur ein lokaler Bedienhinweis. Der Firestore-Lock bleibt die autoritative Sperre. Service-Account-Schlüssel dürfen nicht Bestandteil eines Backups oder Git-Commits sein.
