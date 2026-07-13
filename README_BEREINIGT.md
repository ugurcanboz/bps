# Novura G54.50.2G

## Aktueller Stand

- Nova-Welcome mit scrollbar lesbarem Chatverlauf
- Begrüßung erneut startbar
- Legacy-Gate entfernt
- Performance-Stabilisierung aktiv
- erster Systemadministrator kostenlos lokal einrichtbar
- kein Blaze-Tarif für den Admin-Bootstrap erforderlich
- kein Superadmin-Code und kein Bootstrap-Button im öffentlichen Frontend

## Ersten Admin einrichten

1. Firebase-Service-Account-Schlüssel für `bbq-userdatabase` herunterladen.
2. ZIP vollständig entpacken.
3. `START-ADMIN-BOOTSTRAP.cmd` doppelklicken.
4. E-Mail, Nickname und Passwort eingeben.
5. Nach der Erfolgsmeldung Novura vollständig schließen und normal einloggen.

Die ausführliche Anleitung steht in `LOKALER-ADMIN-BOOTSTRAP.md`.

## Wichtige Sicherheitsregel

Nach Erfolg wird `system/bootstrapAdmin` in Firestore auf `status: completed` gesetzt. Dieser globale Lock verhindert einen zweiten Erstadmin. Service-Account-JSON-Dateien dürfen niemals zu GitHub hochgeladen werden und sind über `.gitignore` ausgeschlossen.

## Prüfung

```bash
node tools/release-gate.mjs
```

Erwartetes Ergebnis: `LOCALLY_APPROVED`.

## PWA-Aktualisierung

Nach dem Hochladen die installierte App vollständig schließen und neu öffnen. Bei einem alten Stand Website-Daten beziehungsweise den bisherigen Service Worker einmal löschen.

App-Version: G54.50.2G
