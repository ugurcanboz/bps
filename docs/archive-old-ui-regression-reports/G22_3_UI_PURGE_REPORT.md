# G22.4 Hard UI Purge Report

## Ursache
G22.2 hat die alte WordHub-Shell nur blockiert, aber `wordhub-layer.css` und `wordhub-layer.js` weiterhin geladen. Dadurch konnten alte Layout-Regeln, Shell-Anker und Fallbacks weiterhin in die Oberfläche eingreifen.

## Korrektur
- `css/wordhub-layer.css` entfernt.
- `js/wordhub-layer.js` entfernt.
- HTML-Ladepfad auf `css/sheet-infra.css` und `js/sheet-infra.js` umgestellt.
- Neue Sheet-Infrastruktur erzeugt nur `#whNotice`, `#whSheetBackdrop`, `#whSheet` für Feedback und Mathe-Hilfe.
- Keine Startseiten-Shell, kein WordHub-Grid, keine Tabbar, kein fremder Home-Renderer.
- AppConfig, ArchitectureGuard und Service Worker auf die neue Infrastruktur umgestellt.
- Hero/Card-Startseite bleibt in `js/app.js` der einzige Startseiten-Renderer.

## Build
G22.4-HARD-UI-PURGE-2026-06-01
