# Schichtübergabe · Phase 43W · G54.43.8G Strength/Weakness Mobile Layout Fix

## Ausgangslage
Der Nutzer hat per Screenshot und anschließend per `visualMonster`-Bericht nachgewiesen, dass der Bereich **Analyse & Fortschritt → Stärken & Schwächen** auf iPhone überlappt:

- `Vorschau`-Badge liegt auf dem Balken.
- Mehrere Zeilen sind nur ca. 19 px hoch und dadurch optisch gequetscht.
- Monster QA erkannte korrekt:
  - `strength_weakness_badge_bar_collision`
  - `strength_weakness_row_compressed`
  - `strength_weakness_mobile_needs_two_line_layout`

## Ziel
Die Reparatur darf nur den Stärken-/Schwächen-Bereich auf Mobile betreffen und keine andere App-Struktur, Deep-Sheet-Scrolllogik oder QA-Bubble-Mechanik beschädigen.

## Änderungen

### 1. Mobile Zwei-Zeilen-Layout für Stärken/Schwächen
Datei: `css/phase39i-pixel-polish.css`

Für `max-width: 520px` wurde ein gezielter Mobile Override ergänzt:

- `.analysis-v2-bar-row` nutzt jetzt zwei Grid-Zeilen.
- Zeile 1: Label + Badge links, Prozentwert rechts.
- Zeile 2: Balken über volle Breite.
- Zeilenhöhe mindestens 48 px, Top-Schwäche mindestens 58 px.
- Badge darf umbrechen, bleibt aber vom Balken getrennt.
- Balken wird auf `grid-column: 1 / 3` und `grid-row: 2` gesetzt.

### 2. Version synchronisiert
- `AppConfig`: `G54.43.8G`
- `index.html`: `G54.43.8G-2026-06-22`
- `manifest.json`: `G54.43.8G`
- `service-worker.js`: Cache auf `egt-trainer-g54-43-8g`
- `update-check.json`: `G54.43.8G-2026-06-22`
- QA-Module: `G54.43.8G`

### 3. Analyse-Dashboard Marker aktualisiert
Datei: `js/ui-home-renderer.js`

- `data-analysis-dashboard-v2="G54.43.5"` → `data-analysis-dashboard-v2="G54.43.8G"`

## QA
Neue statische QA:

- `tests_phase43w_strength_weakness_mobile_layout.html`
- `phase43w_strength_weakness_mobile_layout_result.json`

Ergebnis:

```text
PASS 14/14
```

Geprüft wurde:

- Versionen synchronisiert
- Mobile Media Rule vorhanden
- Zwei-Zeilen-Grid vorhanden
- Balken in zweiter Reihe
- Balken volle Breite
- Label/Badge mit Wrap
- Prozentwert isoliert rechts
- Mindesthöhe der Zeilen
- Monster Detector weiterhin aktiv

## Erwartetes Ergebnis nach Upload
Im Bereich **Analyse & Fortschritt → Stärken & Schwächen** auf iPhone:

- Keine Badge/Balken-Überlappung mehr.
- Kein gequetschtes 19px-Zeilenlayout mehr.
- Balken steht unter der Textzeile.
- Prozentwert bleibt rechts ausgerichtet.
- Monster QA sollte keine `strength_weakness_badge_bar_collision` mehr melden.

## Testanweisung für nächsten Chat/Nutzer

1. GitHub Pages aktualisieren.
2. App öffnen mit `?qa=capture`.
3. Analyse & Fortschritt öffnen.
4. Zu **Stärken & Schwächen** scrollen.
5. Visuell prüfen, ob Badge/Balken getrennt sind.
6. QA-Bubble → State aufnehmen → Text anzeigen.
7. Im JSON prüfen:
   - `visualMonster.summary.status` sollte idealerweise `pass` sein oder zumindest keine Stärken-/Schwächen-Kollisionen mehr enthalten.
   - `strengthWeaknessCollisions` sollte leer sein oder nur irrelevante Infos enthalten.

## Nächster sinnvoller Schritt
Falls der Bereich optisch sauber ist: QA-Verfeinerung gegen False Positives, danach weitere reale Bildschirmbereiche mit Monster QA prüfen.
