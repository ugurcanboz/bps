# Rollback G54.50.2D

## Zweck
G54.50.2D ergänzt einen fortlaufenden, scrollbar lesbaren Nova-Chatverlauf, eine sichtbare Wiederholungsfunktion für die Begrüßung und eine eng begrenzte App-Check-Ausnahme ausschließlich für den einmaligen Admin-Bootstrap.

## Rollback-Ziel
Zurück auf den geprüften Stand G54.50.2C.

## Betroffene Dateien
- `js/modules/guided-welcome-ui.js`
- `css/guided-welcome.css`
- `js/modules/egt-security-context.js`
- `js/modules/egt-auth-engine.js`
- `functions/index.js`
- zentrale Versionsdateien und Service-Worker-Cache

## Vorgehen
1. Das vollständige G54.50.2C-Paket wiederherstellen.
2. Firebase Functions aus dem G54.50.2C-Stand erneut deployen.
3. PWA und Website-Cache aktualisieren beziehungsweise den alten Service Worker entfernen.
4. Login, Registrierung, Demo und Admin-Bootstrap erneut prüfen.

## Sicherheitswirkung des Rollbacks
Nach dem Rollback blockiert der Browser den Admin-Bootstrap erneut, solange Firebase App Check nicht vollständig konfiguriert ist. Alle übrigen privilegierten Funktionen bleiben in beiden Versionen App-Check-pflichtig.

## Web-App zurücksetzen
Den vollständigen, verifizierten G54.50.2C-Web-App-Stand wiederherstellen und anschließend den PWA-Cache erneuern.

## Cloudflare Worker zurücksetzen
Nur erforderlich, wenn der Worker gemeinsam mit diesem Release deployt wurde. Dann den zuletzt verifizierten Worker-Stand mit passender Version erneut deployen.

## Firebase Restore
Ein Firebase-Restore wird **nicht ungeprüft gestartet**. Vor jedem Restore müssen Zielprojekt, Exportdatum, Datenumfang und Rollenfolgen kontrolliert werden.

Ein Rollback wird gestoppt, sobald **Projekt-ID, Domain oder Backup-Prüfsumme** nicht eindeutig zum vorgesehenen Zielsystem passen.
