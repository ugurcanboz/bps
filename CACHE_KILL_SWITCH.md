# Temporärer Cache-Kill-Switch

Aktiv in V7.1.3, weil ältere GitHub-Pages-/PWA-Versionen weiterhin alte Desktop-Dateien laden konnten.

Aktuell passiert bei jedem Refresh:
- alte CacheStorage-Einträge werden gelöscht
- alte Service Worker werden abgemeldet
- der vorhandene Service Worker cached nichts und meldet sich selbst wieder ab

Später deaktivieren:
- in `index.html` `window.TRAINER_CACHE_KILL_SWITCH = false` setzen
- danach einen echten versionierten Service Worker einführen
