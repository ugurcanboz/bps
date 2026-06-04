# UI-F1.6 Nav Layout Fix

Ziel: Die Bottom-Navigation soll auf Desktop/Chrome nicht mehr als fetter Overlay-Block über dem Inhalt liegen.

Änderung:
- Desktop ab 781px: Navigation ist eine normale Dock-Leiste im Layout unter dem Inhalt.
- Mobile bis 780px: Navigation bleibt fixed als App-Dock.
- Content bekommt nur auf Mobile zusätzliches Bottom-Padding.
- Service-Worker-Cache-Version erhöht.
