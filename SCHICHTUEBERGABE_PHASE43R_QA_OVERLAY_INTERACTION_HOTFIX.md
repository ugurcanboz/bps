# Schichtübergabe – G54.43.8A QA Overlay Interaction Hotfix

## Ausgangslage

Nach G54.43.7/G54.43.8 wurde auf dem iPhone getestet. Der Screenshot zeigte: Das Visual-State-Capture-Overlay lag zu groß über der App, blockierte die darunterliegenden Bereiche, verhinderte Scrollen und machte den Bottom-Dock nicht nutzbar. Zusätzlich wurde der Close-Button als zu kleines Touch-Ziel erkannt.

## Ziel

Die QA-Cockpits sollen auf echten Mobilgeräten nutzbar sein, ohne die App vollständig zu sperren.

## Umsetzung

Geändert wurden:

- `js/qa/egt-visual-state-capture.js`
- `js/qa/egt-live-visual-qa.js`
- `js/qa/egt-visual-regression-diff.js`
- `index.html`
- `404.html`
- `manifest.json`

## Technische Änderungen

### 1. Bottom-Dock freigehalten

Mobile QA-Panels liegen jetzt oberhalb des Bottom-Docks:

- `bottom: calc(92px + env(safe-area-inset-bottom, 0px))` auf kleinen Viewports
- Desktop/Tablet: `bottom: calc(96px + env(safe-area-inset-bottom, 0px))`

### 2. Panel-Höhe reduziert

Die QA-Fenster verwenden reduzierte Maximalhöhen:

- Capture/Live QA: ca. 54–58vh
- Diff: oben/unten begrenzt, Dock bleibt frei

### 3. Eigener Scrollbereich

QA-Inhalte scrollen innerhalb des Panels:

- `overflow: auto`
- `-webkit-overflow-scrolling: touch`
- `overscroll-behavior: contain`

### 4. Touch-Ziele repariert

Alle QA-Buttons haben jetzt mindestens:

- `min-width: 44px`
- `min-height: 44px`

Damit wird der Close-Button nicht mehr als unterdimensioniert gemeldet.

### 5. Minimieren ergänzt

Jedes QA-Cockpit hat jetzt neben `×` einen Minimieren-Button:

- `−` minimiert
- `+` öffnet wieder

Beim Minimieren werden Body und Actions ausgeblendet. Dadurch kann der Nutzer die App schneller weiterbedienen.

### 6. QA-Overlay aus App-Touch-Analyse ausgeschlossen

`collectTouchTargets()` im Capture-Modul ignoriert jetzt eigene Overlay-Buttons. Dadurch meldet das QA-Tool nicht mehr seine eigenen Bedienflächen als App-Problem.

## Version

Neue Version: `G54.43.8A`

## QA-Ergebnis

Bestanden:

```bash
node --check js/qa/egt-visual-state-capture.js
node --check js/qa/egt-live-visual-qa.js
node --check js/qa/egt-visual-regression-diff.js
```

## Testanleitung iPhone

Nach Deploy auf GitHub Pages:

```text
https://deine-url/?qa=capture
```

Dann prüfen:

1. QA-Panel erscheint oberhalb des Bottom-Docks.
2. `×` schließt zuverlässig.
3. `−` minimiert, `+` öffnet wieder.
4. App ist nach Schließen wieder komplett bedienbar.
5. QA-Panel selbst ist scrollbar.
6. Bottom-Dock wird nicht mehr verdeckt.

## Nächster sinnvoller Schritt

Wenn dieser Hotfix auf iPhone bestätigt ist:

`G54.43.9 – Visual Regression Bug Queue / priorisierte Abarbeitungsliste`

Dabei werden Capture- und Diff-Ergebnisse automatisch in eine priorisierte Bugliste übersetzt.
