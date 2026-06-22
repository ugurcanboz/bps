# Phase 8L Ergebnis · Home Dual Simulation Entry

## Version

G54.43.8M-2026-06-22

## Erledigt

- Simulation Center enthält jetzt `Sprachtest-Simulation · Deutsch`.
- Sprachtest-Simulation nutzt vorhandene `LanguageExamShell` über neuen Kontext `simulation-de`.
- Simulation zeigt nur Vollprüfung: Niveau wählen und komplette Prüfung starten.
- Sprachtraining wurde sichtbar vom Prüfungsbereich getrennt.
- Einstufungstest bleibt im Sprachtraining.
- Home-Dock-Abstand wurde erhöht.
- Arbeitsanweisung wurde aktualisiert.

## Technische Umsetzung

- Neue UI-Aktion: `language-test-simulation-open`.
- Neue API in `LanguageExamShell`: `openSimulationGerman`.
- Neuer Prüfungs-Kontext: `simulation-de`.
- Rückwege im Ergebnis unterscheiden Simulation und Sprachtraining.

## Noch offen

- Live-QA nach Deploy.
- Datenqualität A1/A2/C1/C2 prüfen.
- Englisch später hinzufügen.
