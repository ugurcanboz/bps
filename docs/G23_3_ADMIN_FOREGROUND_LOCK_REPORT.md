# G23.3 Admin Foreground Lock

## Problem
Das Admin-/Dozentenportal öffnete zwar als Overlay, lag optisch aber teilweise hinter der bestehenden App-Chrome-Struktur. Hauptursache: Das globale Bottom-Dock hatte einen extrem hohen z-index und blieb während des Admin-Portals sichtbar. Dadurch wirkte das Portal wie ein Hintergrundelement im unscharfen Bereich.

## Korrektur
- Admin-Overlay-z-index über das globale Bottom-Dock gesetzt.
- App-Chrome wird bei offenem Portal per `body.egt-admin-sheet-open` wirklich ausgeblendet.
- Bottom-Dock, Admin-Floating-Button und mögliche Floating-Coach-Buttons werden während des Portals deaktiviert.
- Portal-Panel erhält eigene Vordergrund-Isolation und liegt nicht mehr im Hintergrund.
- Backdrop wurde dunkler und ruhiger gemacht, ohne die Ziel-Neon-UI der Startseite zu verändern.

## Nicht verändert
- Neon-Hero
- UI-B Card Layout
- Trainingskarten
- Bottom Navigation im Normalzustand
- Datenbanken und Fachsortierung

## Ergebnis
Das Portal ist jetzt ein echtes Vordergrund-Deep-Sheet/Overlay.
