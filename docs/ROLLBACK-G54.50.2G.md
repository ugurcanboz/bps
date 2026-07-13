# Rollback G54.50.2G

## Web-App zurücksetzen

Die Web-App auf den geprüften Stand G54.50.2F zurücksetzen und den Service-Worker-Cache durch eine neue Versionskennung invalidieren. Der entfernte öffentliche Admin-Bootstrap darf dabei nicht ungeprüft wieder aktiviert werden.

## Cloudflare Worker zurücksetzen

Den Cloudflare Worker nur auf eine eindeutig bekannte und geprüfte Version zurücksetzen. Die Worker-Version muss zur Web-App und zur freigegebenen API-Konfiguration passen.

## Firebase und Adminrechte

Ein Firebase-Restore wird nicht ungeprüft gestartet. Vor jeder Wiederherstellung müssen Projekt-ID, Domain oder Backup-Prüfsumme eindeutig zum Zielsystem passen.

Der Firestore-Lock `system/bootstrapAdmin` darf nach erfolgreicher Einrichtung nicht gelöscht oder auf einen offenen Zustand zurückgesetzt werden. Bereits gesetzte Admin-Custom-Claims werden nur nach ausdrücklicher Prüfung verändert.

## Lokale Dateien

Die Datei `.novura-admin-bootstrap-completed.json` ist nur ein lokaler Bedienhinweis. Der Firestore-Lock bleibt die autoritative Sperre. Service-Account-Schlüssel dürfen nicht Bestandteil eines Backups oder Git-Commits sein.
