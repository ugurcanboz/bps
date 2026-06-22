# Phase 34C – C1 Lektionen 6–10 Content + Speaking Expansion

## Ziel

Die restlichen C1-Lektionen 6–10 wurden inhaltlich ausgebaut. Dabei gilt weiterhin die Projektregel: normale Kursaufgaben und Speaking/Pronunciation werden parallel erweitert.

## Ergebnis

C1 ist jetzt vollständig ausgebaut:

- 10 Lektionen insgesamt
- 10 ausgebaute Lektionen
- 0 Starter-Lektionen
- 430 Aufgaben insgesamt
- 350 normale Kursaufgaben
- 80 Sprechaufgaben
- 43 Aufgaben pro Lektion
- 8 Sprechaufgaben pro Lektion

## Ausgebaute Lektionen in Phase 34C

6. Gesellschaftliche Debatten
7. Wissenschaft & Technologie
8. Wirtschaft & Arbeitswelt
9. Kulturelle Deutung
10. Präsentieren & Rhetorik

## Aufgabentypen

- Multiple Choice
- Lückentext
- Satzbau
- Hörverständnis
- Richtig/Falsch
- Zuordnen
- Speaking Practice

## Prüfschnittstelle

```js
LanguageAcademyCourseEntry.c1ContentSnapshot()
```

Erwarteter Kernstatus:

```js
{
  phase: "34C",
  level: "c1",
  expandedLessons: 10,
  starterLessons: 0,
  totalTasks: 430,
  normalTasks: 350,
  speakingTasks: 80,
  ok: true
}
```

## QA

Ausgeführt:

```bash
find js -name '*.js' -print0 | xargs -0 -n1 node --check
node --check service-worker.js
node phase34c_node_snapshot_check.js
python3 phase34c_static_integrity_check.py
```

## Nächste Phase

Phase 34D – C1 Gesamt-QA + UI/Flow-Prüfung.
