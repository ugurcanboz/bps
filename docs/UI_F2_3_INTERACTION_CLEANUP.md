# UI-F2.3 Interaction Cleanup

Ziel: Die Premium-Startseite nutzt nur noch einen zentralen Router für Kacheln, Buttons und Bottom-Navigation.

## Bereinigt

- `premium-interactions.js` entfernt
- `ipad-touch-fallback.js` entfernt
- parallele Event-Schichten entfernt
- WordHub-Shell-Klickhandler deaktiviert
- neuer zentraler Router: `js/premium-router.js`
- dekorative Icon-/Glow-/SVG-Layer blockieren keine Taps mehr
- iPhone/iPad/Desktop laufen über denselben Interaction-Layer

## Nicht verändert

- Aufgabenbank
- Coach-DNA
- Admin-/Passwortlogik
- PWA-Grundstruktur
