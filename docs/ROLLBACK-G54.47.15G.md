# Rollback-Anleitung G54.47.15G

## Zweck
Diese Anleitung stellt die zuletzt gesicherte App-Version wieder her. Ein Rollback wird nur mit einem zuvor geprüften `ROLLBACK.zip` durchgeführt.

## 1. Backup prüfen
```bash
node tools/verify-backup.mjs /PFAD/ZUM/BACKUP-ORDNER
```
Nur bei `"ok": true` fortfahren.

## 2. Web-App zurücksetzen
1. Aktuelle Veröffentlichung nicht löschen, sondern separat archivieren.
2. `G54.47.15G-ROLLBACK.zip` in einen leeren Ordner entpacken.
3. Runtime-Dateien auf das Hosting deployen.
4. `update-check.json`, `service-worker.js` und `manifest.json` auf dieselbe Version prüfen.
5. In einem privaten Browserfenster laden und Start, Login, Navigation und Offline-Seite prüfen.

## 3. Cloudflare Worker zurücksetzen
Der Rollback-Ordner enthält Worker-Code und Konfiguration, aber keine Secrets. Secrets bleiben in Cloudflare.
```bash
cd worker
npm ci
npm test
npm run deploy:beta
# Produktion nur mit dem dafür vorgesehenen Bestätigungswert deployen.
```
Vor Produktion Health, CORS, Rate-Limit und Monitoring prüfen.

## 4. Firebase zurücksetzen
Firestore-Daten sind nur enthalten, wenn beim Backup ein echter Export angegeben wurde. Eine automatische Datenwiederherstellung wird aus Sicherheitsgründen nicht ungeprüft gestartet.

Beispiel für einen produktiven Export vor einem Release:
```bash
gcloud firestore export gs://DEIN-SICHERER-BUCKET/backups/RELEASE-DATUM --project=DEIN-PROJEKT
```
Der Import muss auf das korrekte Projekt zeigen und vorab in Beta getestet werden.

## 5. Abschlusskontrolle
- richtige Domain und Release-Kanal
- keine JavaScript-Fehler
- Anmeldung und Rollen
- Training und Vollprüfung
- KI-Health und Fallback
- Service-Worker-Update
- Monitoring ohne neue kritische Fehler

## Sicherheitsregel
Nie einen Datenbankimport, Worker-Deploy oder Produktions-Rollback ausführen, wenn Projekt-ID, Domain oder Backup-Prüfsumme unklar sind.
