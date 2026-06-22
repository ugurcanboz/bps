# START HERE – G54.43.6 Live Visual QA Cockpit

Aktueller Stand: **G54.43.6**

## Neu in dieser Phase

Ein internes Live-Visual-QA-Cockpit wurde ergänzt. Es läuft direkt im echten Browser und prüft Analyse & Fortschritt auf sichtbare Layout- und Bedienprobleme.

Aufruf:

- `index.html?qa=visual`
- alternativ `index.html#qa-visual`

Globale API:

- `window.EGTLiveVisualQA.init()`
- `window.EGTLiveVisualQA.runAnalysisCheck()`
- `window.EGTLiveVisualQA.copyReport()`

## Neue Datei

- `js/qa/egt-live-visual-qa.js`

## Prüfumfang

- Analyse-Öffnung über bestehende Entry-Pfade
- Dashboard V2 sichtbar
- Filter, KPI, Hauptdiagramm, Stärken/Schwächen
- Prognose, Zielmarke, Fehleranalyse, Coach-Auswertung
- Deep-Sheet-Scrollbarkeit
- horizontaler Overflow
- Touch Targets unter 44 px
- Bottom-Dock-Overlap
- mögliche Textabschneidung
- Report als JSON + Kopierfunktion

## Wichtig

Das Tool verändert keine Produktivlogik und sendet keine Daten an externe Server. Der Report wird lokal erzeugt und kann manuell kopiert werden.

---

## Aktueller Einstieg: G54.43.8D

Aktuellster Fix: **QA Bubble Always-On-Top Hotfix**. Im QA-Modus (`?qa=capture`) bleibt die QA-Bubble nun über Analyse-/Fortschritt-Deep-Sheets sichtbar, damit direkt aus diesen Screens ein Visual-State-Capture erzeugt werden kann.
