# G22.5 Delete Old Home UI – harter Bereinigungsbericht

## Ziel
Altes Home-/Hub-Design nicht mehr überdecken, sondern aus aktivem JS/CSS entfernen.

## Harte Änderungen
- `css/app.css` wurde nicht weiter überschrieben, sondern komplett neu als ein sauberes G22.5-App-Stylesheet aufgebaut.
- Home-Rendering in `renderSectionIntro()` wurde geleert: Home erzeugt keine zweite Startseiten-Kachelstruktur mehr.
- `sectionIntro` wird auf der Home-Ansicht ausgeblendet.
- `premiumDashboard` enthält schon im HTML einen statischen Hero-Fallback, damit der Hero auch sichtbar ist, bevor `app.js` fertig rendert.
- Vorherige Home-Klassen wurden aus aktivem Code entfernt.
- Die frühere Home-Kachelstruktur wird nicht mehr gerendert und ist nicht mehr im aktiven Stylesheet enthalten.
- Service-Worker-Cache wurde auf `eignungstest-trainer-g225-delete-old-home-ui` gesetzt und löscht alte Caches beim Activate.

## Autoritativer Home-Pfad
`index.html #premiumDashboard` → `App.renderPremiumDashboard()` → `.premium-hero.bps-home-hero`

Kein zweiter Home-Renderer.
