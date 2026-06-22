# G37 Customer Navigation, Highscore & Duell Separation

## Analyse

- `js/modules/highscore-engine.js` existierte bereits als Premium-Highscore-Engine, wurde aber in `index.html` nicht geladen.
- In `js/app.js` existierte zusätzlich ein alter Direkt-Renderer `installHighscoreRenderer()`, der die Premium-Engine überschreiben konnte. Dieser Aufruf ist deaktiviert.
- Duell-Funktionalität existierte bereits über `openDuellSetup()` und `admin-participant-engine.js`. Sie wurde nicht neu erfunden, sondern separat sichtbar gemacht.
- Die Frageübersicht war im Aufgabenfluss unten platziert. Sie ist jetzt als ausklappbarer Drawer entkoppelt.

## Sichtbare Änderungen

- Bottom-Menü: Home, Highscore, Simulation, Duelle, Profil.
- Simulation ist mittig und visuell hervorgehoben.
- Highscore ist ein eigener Bereich für Ranking, Zeiträume, Diagramme, Streaks, Rewards, Cloud-Status und lokale Fallback-Liste.
- Duelle sind ein eigener Bereich für Wettkampfstart und Duellhistorie.
- Frageübersicht belegt nicht mehr dauerhaft Aufgabenfläche, sondern wird als Drawer geöffnet.

## Ziel

Kundenorientierte Struktur für Bildungsträger: schnell auffindbar, weniger Labyrinth, getrennte Verantwortlichkeiten, bestehende Funktionen sichtbar nutzen statt erneut überschreiben.
