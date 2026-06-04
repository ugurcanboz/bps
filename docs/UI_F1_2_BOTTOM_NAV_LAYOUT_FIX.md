# UI-F1.2 Bottom Navigation Layout Fix

Ziel: Die neue Premium-Startseite darf in Chrome/Desktop/Mobile nicht mehr durch eine überlagernde Bottom-Navigation verdeckt werden.

Geändert:
- Bottom Navigation ist jetzt Teil der App-Shell und kein fixed Overlay mehr.
- Scroll-Bereich bekommt nur noch leichte Bottom-Luft statt riesigem Overlay-Abstand.
- Desktop-Landscape und Mobile haben eigene Höhen-/Radiuswerte.
- Beim Start wird der Premium-Home-Scrollcontainer auf 0 gesetzt, damit Chrome keine alte Scrollposition wiederherstellt.
- Service Worker Cache-Version erhöht.

Nicht verändert:
- Aufgabenbank
- Coach-DNA
- Admin-Portal
- Passwortsystem
- PWA-Grundstruktur
