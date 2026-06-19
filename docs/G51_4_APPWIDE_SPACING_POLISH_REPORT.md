# G51.4 – Appwide Spacing / Visual Polish Fix

**Datum:** 2026-06-15  
**Status:** umgesetzt, statische QA bestanden, visuelle Headless-Chromium-Prüfung durchgeführt.

## Anlass

Nach G51.3 waren Startseiten-Cleanup, Antwort-Stabilität, Route-Memory-Viewport und Frageübersicht deutlich verbessert. Im User-Smoke-Test blieben jedoch appweite UI-Qualitätsprobleme sichtbar: einzelne Buttons/Kacheln hatten zu wenig Innenabstand, Action-Gruppen standen zu eng beieinander und die App wirkte zwischen Home, Sheets, Gate, Coach und Simulation nicht konsequent einheitlich.

## Ziel

Ein globales, additiv geladenes Spacing-/Button-/Kachel-System, ohne Fachlogik, Datenbanklogik, Aufgabenlogik oder bestehende Screen-Architektur riskant umzubauen.

## Umsetzung

### Neue Datei

- `css/ui-spacing-polish.css`

Die Datei wird bewusst als letzte CSS-Datei in `index.html` geladen und überschreibt nur visuelle Abstände, Hitboxen, Kachel-Paddings und Button-Gruppen.

### Geänderte Bereiche

- Appweite CSS-Tokens für:
  - Button-Höhen
  - Kachel-Paddings
  - Panel-Radien
  - Grid-Gaps
  - Action-Gruppen-Abstände
- Einheitliche Button-Hitboxen für:
  - `.btn`
  - `.ui-btn`
  - `.ui-button`
  - `.ui-deep-primary`
  - `.ui-login-btn`
  - `.ui-sheet-close`
  - Update-Modal-Buttons
  - Gate-Buttons
  - Coach-Buttons
  - Simulation-Buttons
  - Frageübersicht-Drawer-Toggle
- Einheitlichere Kachel-/Panel-Abstände für:
  - Home-Kacheln
  - Quick-Cards
  - Deep-Sheet-Karten
  - Gate-Kacheln
  - Profil-/Analyse-/Systemkarten
  - Coach-Panels
  - Result-/Review-Karten
  - Simulation-Antwortkarten
- Mobile Overrides für schmale Geräte:
  - 1-Spalten-Aktionsleisten
  - volle Buttonbreite in engen Button-Gruppen
  - kleinere, aber noch gut klickbare Bottom-Dock-Abstände

## Bewusst nicht verändert

- Keine Auth-/Firebase-/Supabase-/Cloud-Logik.
- Keine Aufgabeninhalte.
- Keine Generatoren.
- Keine Navigation-Fachlogik.
- Keine Highscore-Auswertung.
- Keine aggressive Entfernung alter CSS-Dateien.

## Visuelle QA

Geprüft mit Headless-Chromium und produktivem CSS-Bundle:

- Desktop Home
- Desktop Einstellungen/Mehr-Sheet
- Simulation Cockpit geschlossen
- Simulation Frageübersicht geöffnet
- iPad Landscape Simulation geschlossen/geöffnet
- iPhone Simulation geschlossen/geöffnet

### Ergebnis

- Kein horizontaler Overflow in den geprüften Screens.
- Keine zu kleinen Action-Buttons in den geprüften Simulation-Screens.
- Keine zu engen Button-Gruppen in den geprüften Simulation-Screens.
- Settings-Sheet optisch sauber und mit einheitlichem Kachelraster.
- Frageübersicht-Drawer-Toggle nach G51.4a wieder mit stabiler Hitbox.

## Einschränkung

Die Headless-Prüfung konnte wegen lokaler Browser-/Storage-Grenzen nicht jede versteckte dynamische App-Unterseite vollständig durchklicken. Deshalb wurde der Fix bewusst appweit über gemeinsame Klassen und Komponenten gesetzt und zusätzlich auf den wichtigsten sichtbaren Page-/Sheet-/Simulation-Flächen geprüft.

## Geänderte Dateien

- `index.html`
- `css/ui-spacing-polish.css`
- `js/core/app-config.js`
- `service-worker.js`
- `manifest.json`
- `update-check.json`
- `module-manifest.json`
- `docs/WORKING-PLAN.md`
- `WORKING-PLAN_1.md`

## Nächster Test

1. Desktop Chrome hart neu laden.
2. Startseite prüfen: Kacheln, Schnellzugriff, Hero, Simulation-Kachel.
3. Mehr/Einstellungen öffnen und alle Kacheln prüfen.
4. Simulation starten und Buttons/Antworten/Frageübersicht prüfen.
5. Dasselbe auf iPad und iPhone.
6. Auffällige Einzelseite mit Screenshot melden, falls ein Spezialscreen eigene Klassen nutzt und vom globalen System noch nicht sauber erfasst wird.
