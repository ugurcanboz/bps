# Schichtübergabe – G54.43.7 Screenshot-Recorder / Visual-State-Capture

## Ausgangspunkt
Basis war `Eignungstest-Trainer-G54.43.6-Live-Visual-QA-Cockpit.zip`.
G54.43.6 enthielt bereits das Live Visual QA Cockpit mit Checks für Dashboard, KPI, Diagramme, Prognose, Fehleranalyse, Coach, Overflow, Touch Targets und Dock-Overlap.

## Ziel von G54.43.7
Die QA soll nicht nur live bewerten, sondern den sichtbaren App-Zustand als reproduzierbaren QA-Snapshot sichern können.
Da Browser aus Sicherheitsgründen keine echten Pixel-Screenshots ohne Nutzerfreigabe erlauben, wurde das System zweigleisig gebaut:

1. automatischer Visual-State-Capture als JSON
2. optionaler PNG-Screenshot über die Screen-Capture-API nach Nutzerklick

## Neue Datei
`js/qa/egt-visual-state-capture.js`

Global verfügbar als:
`window.EGTVisualStateCapture`

## Startmöglichkeiten
- `?qa=capture`
- `?qa=visual-capture`
- `#qa-capture`

## Öffentliche API
- `window.EGTVisualStateCapture.init(options)`
- `window.EGTVisualStateCapture.openOverlay()`
- `window.EGTVisualStateCapture.captureCurrentState(options)`
- `window.EGTVisualStateCapture.capturePngFromScreen()`
- `window.EGTVisualStateCapture.copyLastCapture()`
- `window.EGTVisualStateCapture.downloadLastCapture()`
- `window.EGTVisualStateCapture.getLastCapture()`
- `window.EGTVisualStateCapture.getCaptures()`

## Erfasste Daten im JSON-State
- Zeitstempel
- App-Version
- Viewport, DPR, Dokumentgröße, Scrollposition
- Screen-Daten
- User-Agent, Sprache, Online-Status
- Route/Search/Hash/Titel
- wichtige App-Elemente mit Selector, Text, Sichtbarkeit, Bounding-Rect, Scrollgrößen und CSS-Kerndaten
- Touch Targets mit 44px-Bewertung
- horizontale Overflow-/Offscreen-Funde
- potenziell abgeschnittene Elemente
- sichtbare Textblöcke
- SVG- und Canvas-Metadaten
- Score: `pass`, `warn` oder `fail`

## PNG-Funktion
Button im Overlay: `PNG aufnehmen`.
Nutzt `navigator.mediaDevices.getDisplayMedia`.
Wichtig: Funktioniert nur nach Nutzerinteraktion und Browserfreigabe. Das ist kein Bug, sondern Browser-Sicherheitsmodell.

## Integration
In `index.html` wurde nach dem G54.43.6 Visual-QA-Script ergänzt:
`<script src="./js/qa/egt-visual-state-capture.js"></script>`

## Versionierung
`js/core/app-config.js`:
- Version: `G54.43.7`
- Label: `G54.43.7 Screenshot-Recorder / Visual-State-Capture`

`node sync-version.js` wurde ausgeführt.
Aktualisiert wurden:
- `service-worker.js`
- `update-check.json`
- `manifest.json`

## QA-Ergebnis
Statische Prüfung: `phase43p_static_check.py`
Ergebnis: `phase43p_static_check_result.json`

Bestanden:
- 13/13 Checks
- JS-Syntaxprüfung für neues Capture-Modul bestanden
- Index-Einbindung vorhanden
- Version/Cache synchronisiert
- API/Auto-Start/Exportfunktionen vorhanden

## Testdatei
`tests_phase43p_visual_state_capture.html`

Testet lokal:
- globales API vorhanden
- Init ausführbar
- Capture erzeugbar
- importantElements nicht leer
- touchTargets nicht leer

## Bekannte Grenzen
- Automatische echte Pixel-Screenshots ohne Klick sind in normalen Browsern nicht erlaubt.
- Der Visual-State-Capture ersetzt das teilweise, indem er Layout, Sichtbarkeit, Größen, Text, Overflow, Touch-Ziele und Medienzustände reproduzierbar exportiert.
- Für echte visuelle Regression ist im nächsten Schritt ein Vergleichsmechanismus nötig.

## Nächster sinnvoller Schritt
G54.43.8 – Visual Regression / Capture-Diff

Ziel:
- zwei Visual-State-Captures vergleichen
- Veränderungen an Elementpositionen, Größen, Sichtbarkeit, Text, Touch Targets und Overflow markieren
- Regression-Report erzeugen
- optional alte/neue JSON-Datei importieren und direkt im QA-Overlay vergleichen
