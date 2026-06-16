# G37.4 Cache-Strategy Fix

## Ausgangslage
Die Highscore-Ansicht wurde in G37.3 bereits repariert (Premium-Engine + vollständiges
`hs-*`-CSS, SVG-Icons hart auf 22/34 px begrenzt). Auf bereits installierten Geräten
erschien trotzdem weiter das alte, kaputte Layout (riesige Icon-Spalte, keine sichtbare
Rangliste).

## Ursache
Der Service Worker lieferte **alle** Assets cache-first aus:

```
caches.match(request).then(cached => cached ? cached : fetch(...))
```

Einmal gecachtes `css/app.css` (und App-JS) wurde dadurch nie erneuert. Der G37.3-Fix lag
im Deploy vor, kam aber nie auf die Endgeräte, solange der Nutzer den PWA-Cache nicht
manuell löschte. Verifiziert: Mit dem aktuellen `css/app.css` rendert die Highscore-Seite
korrekt (Icons 22/34 px, Podium + Rangliste + Diagramme sichtbar, Seitenhöhe ~1740 px statt
Icon-Endlosspalte).

## Fix
- `service-worker.js`: Fetch-Strategie aufgeteilt.
  - **Network-first** (Cache nur als Offline-Fallback) für HTML-Navigation, `*.css` und
    App-JS unter `/js/`. Online gewinnt immer die frischeste Datei → Layout-/Logik-Updates
    erscheinen ohne manuelles Cache-Löschen.
  - **Cache-first** (Tempo/Offline) bleibt für statische Assets (Bilder, SVG, `data/`,
    Fragenbänke).
- `CACHE_NAME` auf `bps-trainer-g374-cache-strategy-fix` erhöht → der `activate`-Handler
  löscht den alten Cache inkl. veraltetem `app.css` automatisch.
- Versionen konsistent auf **G37.4-CACHE-STRATEGY-FIX-2026-06-13** angehoben
  (`js/core/app-config.js`, `update-check.json`, `service-worker.js`).
- Vorbestehende Inkonsistenz behoben: `manifest.json` stand auf `G35.0` → jetzt `G37.4`.

## Geprüft
- Highscore-Render aus `js/modules/highscore-engine.js` mit echtem `css/app.css`:
  Icons 22×22 / 34×34 px, Rangliste + Podium + Challenges + Entwicklung + Rewards +
  Cloud-Status sichtbar.
- App bootet offline ohne JS-Fehler, `window.App` und `CloudHighscoreEngine` verdrahtet,
  `AppConfig.version` = G37.4.
- `service-worker.js`, `app-config.js` Syntax-OK; `update-check.json`, `manifest.json`
  valides JSON.

## Hinweis Deployment
Nach dem Deploy verteilt der neue Service Worker sich selbst (network-first holt
`service-worker.js` frisch). Beim ersten Online-Aufruf wird der alte Cache geleert und das
G37.3-Highscore-Layout wird sichtbar – ohne dass Nutzer den Cache manuell löschen müssen.
Der Update-Prompt (G37.4) weist zusätzlich auf die neue Version hin.
