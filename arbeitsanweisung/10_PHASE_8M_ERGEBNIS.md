# Phase 8M Ergebnis · Home Dual Simulation Entry

**Version:** G54.43.8M  
**Datum:** 2026-06-22  
**Status:** umgesetzt, Live-QA offen

---

## Anlass

Nach G54.43.8L war der Sprachtest technisch im Simulation Center erreichbar. Auf der Home-Seite ging die Sprachtest-Funktion aber optisch unter, weil alles in einer einzigen großen Kachel „Simulation Center“ vermischt wurde.

Produktentscheidung:

- Eignungstest-Simulation und Sprachtest-Simulation sollen auf der Home-Seite separat sichtbar sein.
- Nutzer sollen sofort erkennen: Die App bietet nicht nur BPS/CTC, sondern auch Sprachtest-Vollprüfung.

---

## Umsetzung

### Home-Seite

Neue Struktur:

1. **Eignungstest-Simulation**
   - BPS
   - CTC
   - berufliche Auswahltests
   - öffnet den Eignungstest-Simulationsbereich

2. **Sprachtest-Simulation**
   - Deutsch-Vollprüfung
   - Niveau wählen
   - vollständige Prüfung starten
   - öffnet direkt die Deutsch-Sprachtest-Simulation

### Simulation Center / Eignungstest-Simulation

Der allgemeine Simulationseinstieg wurde wieder auf Eignungstests fokussiert. Sprache ist dort nicht mehr als vierter Unterbereich versteckt.

### Sprachtest-Simulation

Bleibt getrennt und startet über `language-test-simulation-open` die vorhandene Deutsch-Vollprüfungsstruktur.

---

## Geänderte Dateien

- `js/ui-home-renderer.js`
- `css/app.css`
- Versionsdateien
- `arbeitsanweisung/`

---

## QA nach Deploy

Zu prüfen:

1. Startseite: beide großen Kacheln sichtbar.
2. Keine Überlappung mit Bottom-Dock.
3. Eignungstest-Simulation öffnet nur BPS/CTC/Auswahltest-Logik.
4. Sprachtest-Simulation öffnet Deutsch-Vollprüfung.
5. Sprachtraining bleibt Übungsbereich.
6. iPhone, iPad und Desktop testen.
