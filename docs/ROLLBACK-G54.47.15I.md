# Rollback-Anleitung G54.47.15I

## Sicherheitsregel vor dem Start
Ein Produktions-Rollback darf **nicht ungeprüft gestartet** werden. Projekt-ID, Domain oder Backup-Prüfsumme müssen eindeutig zur vorgesehenen Produktionsumgebung gehören. Die SHA-256-Prüfsummen im `BACKUP-MANIFEST.json` sind vor jeder Wiederherstellung zu validieren.

## Web-App zurücksetzen
1. Deployment stoppen und Wartungsmodus aktivieren.
2. `node tools/verify-backup.mjs <BACKUP-MANIFEST.json>` ausführen.
3. Das geprüfte `G54.47.15I-ROLLBACK.zip` in eine leere Zielstruktur entpacken.
4. Hosting-Dateien veröffentlichen.
5. Anmeldung, Rollen, Training, Simulation, Adminbereich, Offline-Start und Updatepfad prüfen.

## Cloudflare Worker zurücksetzen
1. Den im Rollback-Paket enthaltenen Ordner `worker/` verwenden.
2. Zielumgebung und Bindings kontrollieren.
3. Den Worker nur über den vorgesehenen geschützten Deployment-Befehl veröffentlichen.
4. Health-Endpunkt, Origin-Prüfung, Rate Limit, Replay-Schutz und redigierte Fehlerantworten testen.

## Firebase wiederherstellen
- Firestore-Regeln und Functions aus dem geprüften Paket deployen.
- Produktive Daten nur aus einem separat erzeugten, geprüften echten Firebase-Export wiederherstellen.
- Ein fehlender oder leerer Export ist kein Datenbackup.
- Vor dem Restore Projekt-ID, Zeitstempel und Prüfsumme kontrollieren.

## Abbruchkriterien
Der Rollback wird abgebrochen, wenn Prüfsummen abweichen, Pflichtdateien fehlen, die Zielumgebung nicht eindeutig ist, Regeln oder Functions nicht deploybar sind oder ein P0/P1-Fehler im Smoke-Test auftritt.
