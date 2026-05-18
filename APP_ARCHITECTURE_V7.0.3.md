# App Architecture V7.0.3 Clean Stable

## Laufzeitstruktur
- `index.html` lädt CSS, Cloud-Konfiguration, externe Question-Bank-Brücke und das gebündelte App-Script.
- `js/app.js` ist das Browser-Bundle.
- `js/src/` enthält die modularen Quellteile für spätere saubere Weiterentwicklung.
- `js/build/build-app-bundle.js` baut `js/app.js` reproduzierbar aus `js/src/`.

## Kernmodule
- Core/State: App-Status, Prüfungsoptionen, Modussteuerung.
- Storage: IndexedDB-first mit localStorage-Fallback und nicht-destruktiver Migration.
- Engines: Analyse, Coach, Schwächenprofil, Empfehlung, Highscore, Cloud-Highscore.
- Generatoren: Mathe, Logik, Konzentration, IT, EDV, Route-Memory, Visual IQ.
- Renderer/UI: Mobile-Shell, Top-Navigation, Bottom-Navigation, Dashboard, Auswertung.

## Stable-Regel
Neue Features sollten ab jetzt zuerst in `js/src/` umgesetzt werden. Danach `node js/build/build-app-bundle.js` ausführen und erst dann testen.
