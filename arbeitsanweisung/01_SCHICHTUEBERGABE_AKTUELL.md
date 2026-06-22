# Schichtübergabe aktuell · G54.43.8M

## Kurzstand

Die App ist aktuell auf **G54.43.8M**. Die letzte Änderung hat die Home-Seite produktlogisch getrennt:

- **Eignungstest-Simulation** ist als eigene große Home-Kachel sichtbar.
- **Sprachtest-Simulation** ist als eigene große Home-Kachel sichtbar.
- Eignungstest-Simulation fokussiert BPS/CTC/Auswahltests.
- Sprachtest-Simulation startet Deutsch als Vollprüfung.
- Sprachtraining bleibt Lernen/Üben mit Hilfen.

## Harte Regel

**Sprachtest-Simulation = immer Vollprüfung.**

Einzelne Teile wie Lesen, Hören, Schreiben, Sprechen oder Grammatik gehören ins Sprachtraining.

## Was zuletzt erledigt wurde

### G54.43.8K

- Adminportal Mobile-Fixes abgeschlossen.
- Admin-Tabbar horizontal leichter scrollbar gemacht.
- Logout aus Tabbar-Konflikt getrennt.

### G54.43.8L

- Deutsch-Vollprüfung aus dem Sprachtraining logisch getrennt.
- `LanguageExamShell.openSimulationGerman()` ergänzt.
- Sprachtraining bleibt Übungsbereich.

### G54.43.8M

- Home-Kachel „Simulation Center“ in zwei klare Produkt-Einstiege aufgeteilt.
- Eignungstest und Sprachtest sind sofort sichtbar.
- Sprache ist nicht mehr im Eignungstest-Center versteckt.

## Nächster Schritt

Live-QA nach Deploy:

1. Startseite prüfen.
2. Eignungstest-Simulation öffnen.
3. Sprachtest-Simulation öffnen.
4. Deutsch-Vollprüfung starten.
5. Sprachtraining öffnen.
6. Dock-Overlap prüfen.

## Offene Themen

- Deutsch-Prüfungsqualität A1/A2/C1/C2 prüfen.
- B1/B2 vollständige Prüfung testen.
- Ergebnisbericht und Coach nach Prüfung prüfen.
- Englisch erst nach stabiler Deutsch-Struktur einbauen.
