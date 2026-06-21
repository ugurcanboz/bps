# G51.3 – Simulation Viewport / Route UI Polish Fix

## Anlass
Nutzer-Test nach G51.2: Die Antwortkarten springen nicht mehr, aber die Simulation wirkt weiterhin unprofessionell:

- Route-Memory-Aufgabe erzeugt unnötige Innen-Scrollbar im Aufgabenbereich.
- Straßennamen/Route sind zu breit bzw. überlappen.
- rechter Fragenblock wirkt wie ein dauerhafter Fremdkörper und nimmt Platz weg.
- Timer ist zu dominant und kann Layoutfläche zerstören.
- Aufgabe, Visual, Antworten und Aktionsflächen brauchen ein einheitliches Cockpit-Raster.

## Änderungen

### 1. Route-Memory-Punkte neu berechnet
Datei: `js/app.js`

- Alter Aufbau: bis zu 6 Haltestellen in einer horizontalen Reihe.
- Neuer Aufbau: Snake-Raster mit maximal 4 Haltestellen pro Zeile.
- Ergebnis: lange Straßennamen überlappen deutlich weniger und die SVG muss nicht mehr horizontal gescrollt werden.

### 2. Fragenübersicht als echter Drawer
Dateien: `css/egt-simulation.css`, `js/app.js`, `js/modules/egt-simulation-engine.js`

- `#questionNav` ist im Training nicht mehr Teil des rechten Layoutflusses.
- Standardzustand: vollständig ausgeblendet/off-canvas, `opacity:0`, `visibility:hidden`, `pointer-events:none`.
- Geöffnet: professioneller Drawer rechts mit 30er-Fragenraster.
- Toggle ist kompakt und überdeckt den Fragenraster nicht mehr.

### 3. Timer kompakt stabilisiert
Datei: `css/egt-simulation.css`

- Timer sitzt stabil in der Topbar.
- Größe auf Desktop/Tablet/Mobile reduziert.
- Keine zweite Timer-Beschriftung unterhalb des Kreises.

### 4. Aufgaben-/Visual-/Antwortbereich vereinheitlicht
Datei: `css/egt-simulation.css`

- einheitliche Card-Radien, Abstände, Hintergrundflächen und Borders.
- Route-Memory-Visual ohne Innen-Scrollbar.
- Antwortchips bei Route-Memory dichter, aber weiterhin klickbar.
- Desktop Route-Ready-Zustand passt im visuellen Test vollständig in den Viewport.

## Visuelle Prüfung
Headless-Chromium-Prüfung mit Desktop, iPad-Landscape und iPhone-Profil.

### Desktop 1751×900
- horizontales Dokument-Overflow: `0`
- Route-Scene Innen-Overflow: `0 / 0`
- Frageübersicht geschlossen: `opacity 0`, `visibility hidden`
- Frageübersicht geöffnet: Drawer sichtbar rechts, keine dauerhafte rechte Layoutspalte
- Route-Ready-Screen: `scrollH <= innerH`

### iPad Landscape 1180×820
- horizontales Dokument-Overflow: `0`
- Route-Scene Innen-Overflow: `0 / 0`
- Frageübersicht geschlossen: `opacity 0`, `visibility hidden`
- minimaler Seitenüberlauf im Ready-Mock: ca. `18px`, keine Innen-Scrollbar

### iPhone-Profil
- kein Innen-Overflow in Route-Scene
- Drawer bleibt Off-Canvas geschlossen und wird über Toggle geöffnet

## Nicht verändert

- Keine Firebase-/Auth-/Highscore-Logik geändert.
- Keine Bewertungslogik geändert.
- Keine Aufgabenbank strukturell geändert.
- Keine Antwortreihenfolge/Scoring geändert.

## Nächster Live-Test

1. Route-Memory-Aufgabe starten.
2. Prüfen: keine Innen-Scrollbar im Route-Visual.
3. Prüfen: Straßennamen überlappen nicht mehr brutal.
4. Fragenübersicht öffnen und schließen.
5. Prüfen: rechter Fragenblock ist nicht dauerhaft sichtbar.
6. Auf Desktop, iPad und iPhone wiederholen.
