# Eignungstest-Trainer V7.1.4 Mobile Spacing Stable

## Ziel
Sauberstes Framework nach dem GitHub-Pages-/Cache-Problem. Diese Version ist als stabile Basis gedacht, nicht als Feature-Experiment.

## Bereinigt
- Versionierung vereinheitlicht: `7.1.4` / `v7140`.
- Relative Pfade für GitHub Pages beibehalten.
- `.nojekyll` ergänzt, damit GitHub Pages Dateien unverändert ausliefert.
- Desktop- und Mobile-CSS bleiben getrennt: `app.css` = Basis/Desktop, `mobile.css` = Mobile Shell bis 900 px.
- Service Worker bleibt temporär als Cache-Kill-Worker ohne Runtime-Cache aktiv.
- Cache-Kill-Switch läuft weiterhin bei Refresh, damit alte Deploy-Reste nicht erneut greifen.
- `404.html` bleibt als GitHub-Pages-Fallback vorhanden.
- Backup-Dateiname auf V7.1.4 aktualisiert.

## Wichtig
Der Cache-Kill-Switch ist absichtlich temporär. Wenn GitHub Pages stabil läuft, kann er später deaktiviert und durch einen echten versionierten Offline-Cache ersetzt werden.

## Prüfstatus
- JS-Syntax geprüft.
- CSS-Klammern geprüft.
- HTML-Asset-Pfade geprüft.
- App-Button-Exporte geprüft.
