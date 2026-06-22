# Phase 39F – Visual Observer QA Cockpit

## Ziel
Die QA-Funktion so ausbauen, dass sie als „Augen“ für ChatGPT/Entwickler dient: nicht nur Smoke-Test, sondern automatische visuelle Analyse mit App-Walk, Layout-Messung, Icon-/Touch-/Scroll-Audit und exportierbarem Bericht.

## Realistische Grenze
Browser-JavaScript kann ohne Screen-Capture-Permission keine echten Pixel-Screenshots der gesamten Seite erzeugen. Deshalb erzeugt der Visual Observer zusätzlich eine präzise SVG-Visual-Map:
- cyan = Buttons/interaktive Flächen
- violett = Icons
- orange = Scrollcontainer
- rot = erkannte Probleme

Diese Map ist kein Foto, aber ein sehr genauer technischer Sichtplan der App.

## Umgesetzt
- `js/qa-visual-observer.js` ergänzt.
- `tests_phase39f_visual_observer.html` ergänzt.
- Visual Observer wird in `index.html` geladen.
- App läuft mit `?qa=1` und QA-Bypass.
- Cockpit unterstützt Viewports:
  - Desktop
  - iPad
  - iPhone

## Der Observer prüft
- sichtbare Buttons und Aktionsflächen
- Touchflächen unter 44px
- SVG-/IMG-/Emoji-Icon-Zustände
- horizontale Überläufe
- Scrollcontainer und verschachtelte Scrollbereiche
- viele Backdrop-/Blur-Flächen als Performance-Risiko
- Gate-Blockade trotz QA-Modus
- Hauptaktionen und Tabs
- Body-/Overlay-Zustände
- automatisch entdeckte `data-ui-action`-Aktionen

## Export
Das Cockpit kann exportieren:
- JSON-Bericht
- HTML-Bericht mit Visual Map und Rohdaten

## Geänderte Dateien
- `js/qa-visual-observer.js`
- `tests_phase39f_visual_observer.html`
- `index.html`
- `js/core/app-config.js`
- `service-worker.js`
- `update-check.json`
- `manifest.json`
- `WORKING-PLAN_1.md`

## Neue QA-Dateien
- `docs_PHASE39F_VISUAL_OBSERVER_QA_COCKPIT.md`
- `tests_phase39f_visual_observer.html`
- `phase39f_static_qa.py`
- `phase39f_static_qa_result.json`

## Hinweis für Nutzung
Öffnen:
`tests_phase39f_visual_observer.html`

Dann:
1. Viewport wählen
2. „Maximalen Observer-Lauf starten“
3. JSON oder HTML-Report herunterladen
4. Bericht zur Analyse verwenden

## QA Ergebnis
- JS Syntaxcheck: bestanden
- JSON Check: bestanden
- Service Worker Asset Check: bestanden
- Phase-39F-Static-QA: bestanden
- ZIP Check: bestanden
