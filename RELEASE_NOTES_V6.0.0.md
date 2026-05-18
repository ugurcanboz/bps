# Eignungstest-Trainer V6.0.0 Core Refactor Stable

## Ziel
Dieser Stand konsolidiert die V5.1.x-Reihe zu einer wartbaren Framework-Basis.

## Strukturprinzip
- Core = App-Stamm: State, Router, Timer, Scoring, Storage, PWA.
- Module = dicke Äste: Mathe, Allgemeinwissen, IT, EDV, Logik, Konzentration, Route Memory, Visual IQ.
- Funktionen/Renderer = Blätter: konkrete Generatoren, Auswertungen und UI-Renderings.
- Dynamic TopNav = eigene Layout-Schicht: Bottom Navigation, Top Swipe Navigation, mobile Animationen.

## Änderungen
- Versionsstand auf V6.0.0 vereinheitlicht.
- Cache auf `eignungstest-trainer-v600-core-refactor-cache` angehoben.
- V5.1.4 Ergebnis- und Profil-Daten als Legacy-Quelle in die Migration aufgenommen.
- Mobile-CSS aus `css/app.css` in `css/mobile.css` ausgelagert.
- Service Worker cached die neue Mobile-CSS explizit.
- Backup-Dateiname auf V6.0.0 aktualisiert.
- App-Struktur bleibt kompatibel: Runtime läuft weiter über `js/app.js`, Wartung über `js/src/`-Baum.

## Nicht geändert
- Keine neue Aufgabenlogik erzwungen.
- EDV Multi Choice bleibt erhalten.
- Route Memory bleibt erhalten.
- Cloud Highscore bleibt erhalten.
- Desktop/Tablet-Layout bleibt geschützt; Mobile-Änderungen laufen über eigene CSS-Schicht.
