# G51.1 Hard Screen Isolation / Visual Cleanup Fix

## Problem
Nach Testende/Auswertung und Klick auf Startseite wurde oben zwar die Startseite angezeigt, aber der alte Simulationszustand konnte im Scrollbereich weiterhin sichtbar/erreichbar bleiben. Damit war der Screenwechsel nur optisch teilweise, aber nicht lifecycle-sicher.

## Ursache
Die alten Runtime-Screens (`#quiz`, `#result`, `#memory`, `#blockIntro`, `#analysis`) wurden vorher hauptsächlich über die CSS-Klasse `hidden` gesteuert. Auf echten Geräten reichte das in Kombination mit verschachtelten Scroll-Containern, Gate/Overlay-Schichten, `:has()`-CSS und dynamischen App-Shell-Renderern nicht zuverlässig aus.

## Fix
In `js/app.js` wurde ein autoritativer Screen-Isolator eingeführt:

- `CORE_SCREEN_IDS` definiert die Hauptscreens.
- `hardHideScreen()` setzt zusätzlich zu `.hidden` auch `hidden`, `aria-hidden=true`, `display:none!important`, `max-height:0!important`, `overflow:hidden!important`, `pointer-events:none!important`.
- `hardShowScreen()` entfernt diese harten Sperren beim Aktivieren eines Screens.
- `showOnly(id)` ersetzt die bisherigen losen `hideAll(); classList.remove('hidden')`-Wechsel für Hauptscreens.

## Ergebnis
Home/Startseite ist jetzt ein harter Screenwechsel. Eine alte Simulation darf nicht mehr unterhalb der Startseite sichtbar bleiben.

## Visuelle Prüfung
Zusätzlich zu Syntaxchecks wurde eine Headless-Chromium-DOM/Screenshot-Prüfung ausgeführt. Dabei wurde absichtlich ein sichtbarer alter Quiz-Rest erzeugt und anschließend `App.restart()` ausgeführt. Ergebnis: `#quiz`, `#result`, `#memory` und `#blockIntro` hatten danach `display:none`, `hidden=true`, Höhe `0`, und es waren keine sichtbaren alten Simulations-Texte mehr im DOM-Viewport auffindbar.
