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


## Aktueller Stand – G54.43.8C

Neueste Phase: **G54.43.8C – QA Bubble Interaction Fix**.

Wichtig: Der normale iPhone-Scroll in Analyse/Fortschritt funktioniert laut Nutzer-Test ohne QA-Parameter. G54.43.8C repariert nur die QA-Bubble-Buttons und ergänzt den Fallback **Text anzeigen** für den JSON-Bericht.

Testreihenfolge:
1. App normal ohne `?qa=capture` testen.
2. Analyse/Fortschritt müssen weiter scrollen.
3. Danach `?qa=capture` testen.
4. QA-Bubble öffnen, `State aufnehmen`, `Text anzeigen`, `JSON kopieren` prüfen.
