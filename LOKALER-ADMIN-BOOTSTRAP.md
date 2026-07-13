# G54.50.2G · Kostenloser lokaler Admin-Bootstrap

## Zweck

Der erste Novura-Systemadministrator wird einmalig auf deinem eigenen Windows-PC eingerichtet. Dafür sind weder der Firebase-Blaze-Tarif noch ein Cloud-Functions-Deployment erforderlich.

## Einmalige Vorbereitung in Firebase

1. Firebase Console öffnen.
2. Projekt `bbq-userdatabase` auswählen.
3. Projekteinstellungen öffnen.
4. Tab **Dienstkonten / Service accounts** öffnen.
5. **Neuen privaten Schlüssel generieren** wählen.
6. Die heruntergeladene JSON-Datei nur lokal aufbewahren und niemals zu GitHub hochladen.

## Ausführen

1. ZIP vollständig entpacken.
2. `START-ADMIN-BOOTSTRAP.cmd` doppelklicken.
3. Pfad zur Service-Account-JSON, Admin-E-Mail, Nickname und Passwort eingeben.
4. Nach `ERFOLG` Novura vollständig schließen und über den normalen Login anmelden.

## Automatische Deaktivierung

Nach dem Erfolg schreibt das Skript den globalen Firestore-Lock:

`system/bootstrapAdmin` → `status: completed`

Der Lock verhindert die Einrichtung eines anderen ersten Admins, auch wenn das Skript auf einem anderen Computer erneut ausgeführt wird. Zusätzlich legt der lokale Projektordner `.novura-admin-bootstrap-completed.json` an.

## Sicherheit

- Im Projekt liegt kein Service-Account-Schlüssel.
- Die JSON-Datei ist über `.gitignore` ausgeschlossen.
- Den Schlüssel nach erfolgreicher Einrichtung in Google Cloud/Firebase widerrufen oder sicher löschen.
- Das öffentliche Novura-Frontend enthält keinen Admin-Bootstrap-Button und keinen Superadmin-Code mehr.
- Weitere Admins werden später nur durch einen bereits autorisierten Admin verwaltet.
