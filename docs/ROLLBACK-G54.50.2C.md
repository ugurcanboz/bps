# Rollback G54.50.2C

## Ziel
Rückkehr auf G54.50.2B, falls Admin-Bootstrap oder Performance-Stabilisierung unerwartete Probleme verursachen.

## Dateien zurücksetzen
- `functions/index.js`
- `functions/bootstrap-policy.js`
- `functions/package.json`
- `functions/.env.example`
- `js/modules/egt-auth-engine.js`
- `js/modules/novura-auth-access.js`
- `css/performance-stability.css`
- `index.html`
- `service-worker.js`
- `js/core/app-config.js`
- `manifest.json`
- `update-check.json`
- `module-manifest.json`

## Cloud Functions
Nach einem Rollback die Functions erneut deployen. Der Firestore-Lock `system/bootstrapAdmin` darf nach einem erfolgreichen Bootstrap nicht gelöscht werden, da er die einmalige Vergabe absichert.

## Service Worker
Nach dem Rollback Cache-Version wechseln und die PWA vollständig neu laden.

## Web-App zurücksetzen
Die Dateien aus dem letzten geprüften G54.50.2B-Runtimepaket wiederherstellen, anschließend `node sync-version.js` ausführen und den Service-Worker-Cache wechseln.

## Cloudflare Worker zurücksetzen
Den zum G54.50.2B-Stand gehörenden Worker deployen. Vorher Secrets und Bindings vergleichen; keine produktiven Secrets in lokale Dateien kopieren.

## Firebase Restore
Ein Firebase-Restore wird nicht ungeprüft gestartet. Vor jeder Wiederherstellung müssen Projekt-ID, Domain oder Backup-Prüfsumme eindeutig zum Zielsystem passen. Der Bootstrap-Lock `system/bootstrapAdmin` bleibt nach erfolgreicher Admin-Einrichtung erhalten.
