# Temporärer Cache-Kill-Switch V7.0.10

Diese Version löscht bei jedem Refresh aktiv alte Browser-Caches und meldet Service Worker ab.

Zweck:
- Desktop soll garantiert aktuelle CSS/JS-Dateien laden.
- Alte PWA-Dateien sollen nicht mehr dazwischenfunken.
- Das ist eine Diagnose-/Reparaturphase, nicht die finale Offline-PWA-Architektur.

Später deaktivieren:
1. In `index.html` den Block `TEMPORÄRER CACHE-KILL-SWITCH V7.0.10` entfernen oder `window.TRAINER_CACHE_KILL_SWITCH = false` setzen.
2. `service-worker.js` wieder durch einen normalen, versionierten Offline-Service-Worker ersetzen.
3. Manifest wieder aktivieren, wenn Desktop/Mobile stabil sind.
