# Eignungstest-Trainer V7.2.5 – Global Layout Spacing Stable

## Ziel
Sauberste und stabilste Framework-Basis für lokalen Start und GitHub Pages Deploy.

## Bereinigt / stabilisiert
- Version überall auf V7.2.5 / v7250 aktualisiert.
- GitHub-Pages-Fallback neu gebaut: `404.html` leitet sicher auf `index.html` zurück.
- Keine echten Unterseiten nötig: App bleibt Single-Page und nutzt interne Screens.
- Relative Asset-Pfade bleiben erhalten: `./css`, `./js`, `./data`, `./icons`.
- `update-check.json` bleibt optional und bricht bei Fehlern nicht die App ab.
- Update-Modal bleibt aktiv und kann mit `?forceUpdateModal=1` getestet werden.
- Temporärer Cache-Kill-Switch bleibt aktiv, bis Desktop/GitHub dauerhaft sauber aktualisieren.
- Service Worker cached weiterhin nichts und dient nur als Diagnose-/Cache-Cleanup-Worker.
- `.nojekyll` bleibt enthalten, damit GitHub Pages Dateien unverändert ausliefert.
- Mobile Bottom Navigation und Spacing-Fixes aus V7.1.4 bleiben erhalten.

## Wichtig für GitHub Upload
1. Repository einmal komplett leeren oder alte Dateien überschreiben.
2. Alle Dateien aus dieser ZIP hochladen, inklusive `.nojekyll`, `404.html`, `update-check.json`.
3. Danach direkt öffnen: `VERSION_CHECK.html` und dann `index.html`.
4. Wenn noch alte Version sichtbar ist: Browser/PWA-Installation lädt alten Deploy.

## Später deaktivieren
Wenn alles stabil ist, kann der temporäre Cache-Kill-Switch ausgeschaltet werden:
`window.TRAINER_CACHE_KILL_SWITCH = false` und Service Worker wieder als normaler Offline-Cache aufgebaut werden.
