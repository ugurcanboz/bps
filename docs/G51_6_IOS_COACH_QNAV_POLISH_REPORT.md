# G51.6 · iOS + Coach + iPad QNav Polish Fix

## Ziel

Diese Version behebt die nach G51.5 verbliebenen visuellen Probleme:

- iPhone/iOS erhielt sichtbar wirksame Mobile-Abstände und Kachel-/Button-Dichte.
- Die leere Bottom-Dock-Hülle darf nicht mehr als schwarze Leiste über Inhalte laufen.
- Der KI-Coach auf Desktop wird nicht mehr als breite schwebende Leiste dargestellt, sondern als kompakter Orb; das Coach-Sheet hat stabilere Kartenoptik.
- Der Frageübersicht-Button wird auf iPad Hochformat nicht mehr unten rechts platziert, sondern oben rechts unter der Topbar.
- Die Simulation wurde erneut in iPhone-, iPad-Hochformat-, iPad-Querformat- und Desktop-Viewports visuell geprüft.

## Geänderte Dateien

- `index.html`
- `css/ui-ios-coach-polish.css`
- `js/core/app-config.js`
- `service-worker.js`
- `manifest.json`
- `update-check.json`
- `module-manifest.json`

## Technische Maßnahmen

1. Neue finale CSS-Schicht `ui-ios-coach-polish.css` als letzte App-CSS-Datei eingebunden.
2. iOS-Breiten erhalten eigene harte Regeln für:
   - Home-Kacheln
   - Schnellzugriff
   - Ergebnis-Kacheln
   - Admin-/Highscore-/Duellflächen
   - Simulation-Topbar
   - Antwortbuttons
   - Frageübersicht-Drawer
3. Bottom-Dock-Sicherheit:
   - `#egtBottomDock:empty`
   - `#egtBottomDock:not(:has(.egt-dock-btn))`
   werden vollständig ausgeblendet.
4. iPad-Hochformat:
   - `#qnavDrawerToggle` wird oben rechts positioniert.
5. Desktop-Coach:
   - `#bpsCoachDock` wird als kompakter Orb stabilisiert.
   - Coach-Sheet, Stats und Actionkarten erhalten Fallback-Glasflächen.

## Ergebnis

Die geprüften Screens hatten keinen horizontalen Overflow. Die zuvor sichtbare schwarze leere Dock-Leiste auf iPhone-Home wurde entfernt. iPad-Hochformat zeigt den Frageübersicht-Button nicht mehr unten rechts. Die iPhone-Simulationstopbar wurde von der alten gestapelten Darstellung befreit.
