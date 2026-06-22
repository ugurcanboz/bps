# G23.16 · iOS/iPadOS Admin-Scroll-Fix

## Ziel
Auf iPad/iPhone muss das Admin-/Dozentenportal mit dem Finger natürlich scrollbar sein.

## Änderungen
- `touch-action:none` für den offenen Admin-Sheet-Zustand überschrieben.
- Admin-Overlay als einzige Scrollfläche definiert.
- `-webkit-overflow-scrolling: touch` konsequent auf dem Overlay gesetzt.
- Sticky-Header/Tabs im Portal relativ gesetzt, damit sie auf iOS nicht als transparente feste Ebene über Inhalte kleben.
- Touch-Scroll-Assist im Admin-Portal ergänzt.
- Neon-Startseite und Teilnehmerprofil-Balkenansicht nicht verändert.

## Testziel
Admin-Portal auf iPad/iPhone öffnen und mit Finger nach unten/oben ziehen. Logout und tiefere Dashboardbereiche müssen erreichbar sein.
