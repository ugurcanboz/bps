# Schichtübergabe – G54.43.8B iPhone Scroll Hotfix + QA Bubble

## Ausgangsproblem

Nach G54.43.8A wurde auf dem iPhone erneut getestet. Ergebnis:

- Analyse/Fortschritt scrollten nicht zuverlässig.
- Das Visual-State-Capture-Fenster war immer noch zu dominant.
- Mehrere Scrollbereiche arbeiteten gleichzeitig.
- Die QA-Buttons wirkten teilweise funktionslos oder schwer bedienbar.

## Ziel

G54.43.8B stabilisiert nicht nur das QA-Fenster, sondern behebt vor allem das reale iPhone-Scrollproblem in Analyse/Fortschritt.

## Geänderte Dateien

### Neu

- `css/phase43s-iphone-scroll-qa-bubble.css`
- `js/modules/iphone-scroll-qa-hotfix.js`
- `tests_phase43s_iphone_scroll_qa_bubble.html`
- `phase43s_static_scroll_qa.py`
- `phase43s_static_scroll_qa_result.json`

### Geändert

- `index.html`
- `js/core/app-config.js`
- `js/qa/egt-visual-state-capture.js`
- `js/qa/egt-live-visual-qa.js`
- `js/qa/egt-visual-regression-diff.js`
- `manifest.json`
- `update-check.json`
- `service-worker.js`
- `WORKING-PLAN.md`

## Technische Lösung

### 1. iPhone Scroll Guardian

Neues globales Modul:

```js
window.EGTIPhoneScrollHotfix
```

Funktionen:

- erkennt sichtbare Deep-Sheets
- setzt `egt-deep-sheet-active` nur dann, wenn wirklich ein Sheet offen ist
- repariert `.ui-deep-body` auf `overflow-y:auto`
- setzt `-webkit-overflow-scrolling:touch`
- aktualisiert `--egt-visual-vh` bei Resize/Orientation-Change
- beobachtet DOM-Änderungen per `MutationObserver`

### 2. Analyse/Fortschritt Scroll-Fix

Auf Touch-Geräten werden Deep-Sheets erzwungen als:

- fixed top/bottom
- flex column
- Header bleibt oben
- Body ist der einzige Scrollbereich
- keine konkurrierenden Body-/Sheet-/Inner-Scrolls

### 3. QA Bubble statt Block-Overlay

`EGTVisualStateCapture` startet jetzt minimiert:

```html
<section class="egt-vsc" data-minimized="true">
```

Dadurch erscheint zunächst nur eine kleine `QA` Bubble. Erst nach Tap öffnet sich das Panel.

### 4. Robustere Button-Events

Vorher wurde nur direkt `ev.target.getAttribute('data-action')` geprüft. Jetzt:

```js
var btn = ev.target.closest('button[data-action]')
```

Dadurch funktionieren Buttons zuverlässiger, auch wenn Safari innerhalb des Buttons ein anderes Ziel liefert.

### 5. Busy-State abgesichert

`captureCurrentState()` nutzt jetzt `try/finally`, damit `state.busy` nach Fehlern nicht dauerhaft hängen bleibt.

## Version

```text
G54.43.8B
```

Label:

```text
G54.43.8B iPhone Scroll Hotfix + QA Bubble
```

Cache:

```text
egt-trainer-g54-43-8b
```

## QA-Ergebnis

Statische Prüfung:

```text
15/15 PASS
```

JS Syntax:

```text
node --check js/qa/egt-visual-state-capture.js PASS
node --check js/modules/iphone-scroll-qa-hotfix.js PASS
```

## Testanweisung für nächsten Chat / Nutzer

Nach GitHub Pages Deploy:

1. App normal öffnen, ohne QA-Parameter.
2. Auf iPhone: Bottom-Dock → Analyse.
3. Im Analyse-Sheet bis unten scrollen.
4. Aus Analyse heraus `Fortschritt kompakt` öffnen und dort scrollen.
5. Mehr/Fortschritt testen, falls über Menü erreichbar.
6. Danach `?qa=capture` öffnen.
7. Erwartung: nur kleine QA-Bubble sichtbar.
8. Bubble antippen → Panel öffnet sich oberhalb des Bottom-Docks.
9. `State aufnehmen` testen.
10. Screenshot zurückgeben.

## Bekannte Grenzen

- PNG-Aufnahme ist auf iPhone/Safari durch Browser-Sicherheitsregeln eingeschränkt. DOM-/Layout-Capture funktioniert unabhängig davon.
- Wenn alte GitHub-Pages-Caches noch aktiv sind, muss die Seite einmal hart aktualisiert oder der PWA-/Browsercache geleert werden.
