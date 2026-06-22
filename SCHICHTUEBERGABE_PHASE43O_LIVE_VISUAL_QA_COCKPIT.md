# Schichtübergabe – G54.43.6 Live Visual QA Cockpit

## Status

G54.43.6 ist umgesetzt.

## Zweck

Die App besitzt jetzt ein internes Live-Visual-QA-Cockpit, das direkt im echten Browser läuft. Damit kann der Nutzer auf iPhone, iPad oder Desktop die Oberfläche prüfen lassen und den JSON-Report in den Chat kopieren.

## Neue Datei

- `js/qa/egt-live-visual-qa.js`

## Einbindung

In `index.html` wurde ergänzt:

```html
<script src="./js/qa/egt-live-visual-qa.js"></script>
```

## Aktivierung

- `index.html?qa=visual`
- `index.html#qa-visual`
- oder manuell in der Konsole: `EGTLiveVisualQA.init({ autoRun:true })`

## API

- `window.EGTLiveVisualQA.init()`
- `window.EGTLiveVisualQA.openOverlay()`
- `window.EGTLiveVisualQA.openAnalysis()`
- `window.EGTLiveVisualQA.runAnalysisCheck()`
- `window.EGTLiveVisualQA.collectChecks()`
- `window.EGTLiveVisualQA.renderReport(report)`
- `window.EGTLiveVisualQA.copyReport()`

## Prüfumfang

- QA-Boot
- Viewport-Fit
- Analyse-Öffnung
- Deep-Sheet/Sichtbereich
- Dashboard V2
- Filter
- KPI-Karten
- Hauptdiagramm
- Stärken/Schwächen
- Prognose/Zielmarke
- Prognose-Diagramm
- Fehleranalyse
- Coach-Auswertung
- Deep-Sheet-Scrollbarkeit
- horizontaler Overflow
- Touch Targets unter 44 px
- Bottom-Dock-Overlap
- mögliche Textabschneidung

## Version/Cache

- Version: `G54.43.6`
- Cache: `egt-trainer-g54-43-6`

## QA

Statisch geprüft:

- `node --check js/qa/egt-live-visual-qa.js`
- `node --check js/core/app-config.js`
- Markerprüfung für Index-Einbindung, Version, Cache, Testdatei und Report-Funktion

## Nächster sinnvoller Schritt

G54.43.7 – Screenshot-Recorder/Visual-State-Capture. Ziel: QA-Reports mit systematischem Screenshot-/Zustandsprotokoll kombinieren, soweit im Browser technisch möglich.
