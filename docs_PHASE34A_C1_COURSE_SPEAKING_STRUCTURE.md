# Phase 34A – C1 Course + Speaking Structure

## Ziel

C1 wird als eigenes Niveau im Sprachkurs geöffnet und strukturell vorbereitet. Normale Kursaufgaben und Speaking-Aufgaben werden gemäß Projektregel gleichzeitig angelegt.

## Umgesetzt

- C1-Level auf `available` gesetzt
- 10 C1-Lektionen angelegt
- pro Lektion 12 Startaufgaben erzeugt
- pro Lektion 8 normale Aufgaben und 4 Sprechaufgaben
- Speaking nutzt weiterhin die Phase-30E-Logik:
  - automatische SpeechRecognition, wenn der Browser sie unterstützt
  - geführter Sprechmodus mit Selbstbewertung auf iPhone/iPad/unsupported Browsern
- `c1StructureSnapshot()` ergänzt
- `diagnostics()` auf Phase 34A aktualisiert
- Export in `LanguageAcademyCourseEntry` ergänzt

## C1-Lektionen

1. Akademisch argumentieren
2. Nuancierte Meinung
3. Komplexe Texte verstehen
4. Professionell verhandeln
5. Formelle Korrespondenz
6. Gesellschaftliche Debatten
7. Wissenschaft & Technologie
8. Wirtschaft & Arbeitswelt
9. Kulturelle Deutung
10. Präsentieren & Rhetorik

## Mengen

| Bereich | Anzahl |
|---|---:|
| C1-Lektionen | 10 |
| Startaufgaben pro Lektion | 12 |
| normale Aufgaben pro Lektion | 8 |
| Speaking-Aufgaben pro Lektion | 4 |
| C1-Aufgaben gesamt | 120 |
| C1-Normalaufgaben gesamt | 80 |
| C1-Speaking gesamt | 40 |

## QA

Bestanden:

```bash
find js -name '*.js' -print0 | xargs -0 -n1 node --check
node --check service-worker.js
node phase34a_node_snapshot_check.js
python3 phase34a_static_integrity_check.py
```

## Neue Dateien

- `tests_phase34a_c1_course_speaking_structure.html`
- `docs_PHASE34A_C1_COURSE_SPEAKING_STRUCTURE.md`
- `phase34a_node_snapshot_check.js`
- `phase34a_node_snapshot_result.json`
- `phase34a_static_integrity_check.py`
- `phase34a_static_integrity_result.json`

## Nächster Schritt

Phase 34B: C1 Lektionen 1–5 werden inhaltlich ausgebaut, wieder parallel mit normalen Aufgaben und Speaking.
