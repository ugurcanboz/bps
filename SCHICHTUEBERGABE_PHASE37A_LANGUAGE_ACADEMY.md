# SCHICHTÜBERGABE – LANGUAGE ACADEMY PHASE 37A

## Stand

Phase 37A wurde umgesetzt: Einstufungstest / Sprachtest-Modul A1 bis C2.

Basis: G54.32 Phase 35D C2 Total QA.
Neue Version: G54.33 Phase 37A Placement Test A1-C2.

## Wichtig

Der Sprachkurs war bisher primär Lernsystem. Mit Phase 37A gibt es jetzt einen simulierten Testmodus für die Einstufung.

## Implementiert

- Dashboard-Karte „Einstufungstest“
- Schnellzugriff „Einstufungstest“
- Route: language-course-placement-test
- Route: language-course-placement-answer
- Route: language-course-placement-reset
- Route: language-course-placement-close
- Lokale Speicherung in localStorage
- 45-Minuten-Testkonzept
- 42 Fragen gesamt
- A1, A2, B1, B2, C1, C2
- je Niveau 7 Fragen
- je Niveau 5 normale Aufgaben
- je Niveau 2 Speaking-Aufgaben
- Ergebnis mit geschätztem Niveau
- Button zum empfohlenen Niveau
- Snapshot: LanguageAcademyCourseEntry.placementTestSnapshot()
- QA Snapshot: LanguageAcademyCourseEntry.phase37aQaSnapshot()

## Pädagogische Abgrenzung

Das Ergebnis ist eine Lernempfehlung, kein offizielles Zertifikat. Speaking wird auf Geräten ohne zuverlässige Web Speech ehrlich als Selbstbewertung gespeichert.

## Neue Dateien

- docs_PHASE37A_PLACEMENT_TEST_A1_C2.md
- tests_phase37a_placement_test_a1_c2.html
- phase37a_node_snapshot_check.js
- phase37a_node_snapshot_result.json
- phase37a_static_integrity_check.py
- phase37a_static_integrity_result.json
- qa_PHASE37A_RESULTS.json

## QA

Ausgeführt:

```bash
find js -name '*.js' -print0 | xargs -0 -n1 node --check
node --check service-worker.js
node phase37a_node_snapshot_check.js
python3 phase37a_static_integrity_check.py
```

Erwartung:
- placementTestSnapshot().ok === true
- totalQuestions === 42
- normalQuestions === 30
- speakingQuestions === 12

## Nächster Chat

Der nächste Chat soll mit dem Konzept für Abschlusstests pro Niveau beginnen. Empfohlene nächste Phase:

Phase 38A – Konzept Abschlusstest pro Niveau A1 bis C2

Ziel:
- A1-Abschlusstest
- A2-Abschlusstest
- B1-Abschlusstest
- B2-Abschlusstest
- C1-Abschlusstest
- C2-Abschlusstest
- Timer pro Niveau
- Bestehensgrenze
- Bereichsauswertung: Lesen, Hören, Grammatik/Wortschatz, Schreiben/Sprechen
- Ergebnisbericht
- Wiederholungsempfehlung

## Strikte Regel

Nur Language Academy / Sprachkurs bearbeiten. Keine CTC-Simulation, kein Admin, kein Highscore, kein Auth-Fix anfassen.
