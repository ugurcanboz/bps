# Schichtübergabe · Phase 43X · G54.43.8H Admin Portal Mobile Containment Fix

## Ausgangslage
Live-Capture auf iPhone Safari meldete für das Adminportal Status `warn`:
- `#egtAdminModal` war breiter als der Viewport (`scrollWidth 468` bei `clientWidth 440`).
- `.egt-portal-tab-group` lief als 1090px breites Element nach rechts aus dem Viewport.
- Bottom-Dock überlagerte KPI-Karten im Admin-Dashboard.
- QA meldete zusätzlich Dock-Buttons selbst als Dock-Overlap, was Noise war.

## Umsetzung
Geändert wurden gezielt:
- `css/admin-portal.css`
- `js/qa/egt-visual-state-capture.js`
- Versionsdateien: `index.html`, `manifest.json`, `service-worker.js`, `update-check.json`, `js/core/app-config.js`, QA-Versionen, `START_HERE.md`
- `WORKING-PLAN.md`

## Technischer Fix
- Adminmodal wird hart auf `max-width: 100vw` und `overflow-x: hidden` begrenzt.
- Adminpanel bekommt `overflow-x: clip`.
- Mobile Tabgruppe wird selbst zum horizontalen Scrollcontainer mit `width: 100%`, `min-width: 0`, `max-width: 100%`, `overflow-x: auto`.
- Bottom-Dock wird bei `html/body.egt-admin-sheet-open` ausgeblendet.
- Kleine Portrait-Admin-KPI-Grids werden auf eine Spalte gesetzt.
- Visual-State-Capture ignoriert legitime horizontale Tab-Scroller bei Offscreen-Prüfung und zählt Dock-Kinder nicht mehr als Dock-Overlap.

## Nächster Test
Nach Deployment: Adminportal öffnen und neuen Capture auf iPhone 440×796 ausführen. Erwartung:
- Keine Offscreen-Warnung für `.egt-portal-tab-group`.
- Keine Clipped-Warnung für `#egtAdminModal`.
- Keine Dock-Überlagerung im Adminportal.
- QA-Overlay kann weiterhin Inhalte verdecken, solange es nicht minimiert ist; das ist kein App-Layoutfehler.
