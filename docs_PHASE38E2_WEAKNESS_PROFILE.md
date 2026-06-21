# Phase 38E.2 – Lernstandsdetails / Schwächenprofil / Trainingspfade

## Ziel

Phase 38E.2 erweitert das Prüfungsdashboard um ein echtes Schwächenprofil. Die App zeigt nicht mehr nur Ergebnis und Verlauf, sondern leitet aus den Prüfungsteilen konkrete Trainingspfade ab.

## Neue Kernfunktionen

- Prüfungsteilgenaue Einordnung in `critical`, `weak`, `borderline`, `stable` oder `open`
- Priorisierte Schwächenliste nach Dringlichkeit
- Trainingspfade pro Prüfungsteil
- Zeit-/Intensitätsvorschlag pro Schwäche
- Dashboard-Anzeige für aktive und abgeschlossene Versuche
- Ergebnisbericht zeigt nach der Prüfung direkt den nächsten Trainingsplan

## Bewertungslogik

Die App bewertet jeden Teil einzeln gegen den Mindestwert des Niveaus. Nicht bestandene oder offene Teile stehen zuerst. Danach kommen knappe Teile, die zwar bestanden sein können, aber noch nicht stabil genug sind.

Priorität:

1. Kritisch
2. Schwach
3. Offen
4. Knapp
5. Stabil

## Trainingspfade

Je nach Prüfungsteil erzeugt die App konkrete Aufgaben:

- Lesen: Hauptaussage, Autorabsicht, Ablenker begründen
- Hören: ohne Transkript hören, Sprecherhaltung notieren, Transkript nur zur Kontrolle
- Grammatik: Konnektoren, Satzstellung, Register und Sprachbausteine
- Schreiben: Pflichtpunkte, Struktur, Umfang, Register, Thema
- Sprechen: Position, Begründung, Beispiel, bestätigtes Transkript

## Dateien

Geändert:

- `js/modules/language-exam-shell.js`
- `css/language-course.css`
- `service-worker.js`
- `update-check.json`
- `js/core/app-config.js`
- `WORKING-PLAN_1.md`

Neu:

- `docs_PHASE38E2_WEAKNESS_PROFILE.md`
- `tests_phase38e2_weakness_profile.html`
- `phase38e2_static_qa.py`
- `phase38e2_static_qa_result.json`

## QA-Erwartung

- Shell Diagnostics Phase `38E.2`
- Dashboard enthält `data-la-weakness-profile="phase38e2"`
- Exportierte API enthält `buildWeaknessProfile()`
- Kritische Schwächen werden vor stabilen Teilen priorisiert
- B2-Gesamt-QA aus Phase 38D.7 bleibt bestanden
- Service Worker enthält neue Test- und Doku-Dateien
