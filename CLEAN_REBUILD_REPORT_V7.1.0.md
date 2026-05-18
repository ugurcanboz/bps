# Clean Rebuild Report V7.1.0

## Ziel
Die Version wurde nicht weiter gepatcht, sondern strukturell bereinigt.

## Bereinigt
- alte V7.0.x-Notfall-Patches aus `css/app.css` entfernt
- Desktop- und Mobile-Breakpoints neu getrennt
- ungenutzte `js/src`- und `js/build`-Reste entfernt
- alte Testberichte und Cache-Kill-Dokumente entfernt
- Versionsanzeigen auf V7.1.0 aktualisiert
- temporärer Cache-Kill-Switch bleibt aktiv
- Service Worker wird aktuell nicht registriert, damit keine alten Assets geladen werden

## Wichtig
Der Cache-Kill-Switch ist bewusst temporär. Wenn Desktop wieder stabil lädt, kann er entfernt und der Offline-Service-Worker sauber neu aktiviert werden.
