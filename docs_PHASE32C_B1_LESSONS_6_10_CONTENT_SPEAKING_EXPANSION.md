# Phase 32C – B1 Lektionen 6–10 Content + Speaking Expansion

## Ziel
B1 wird vollständig ausgebaut. Nach Phase 32B waren Lektionen 1–5 ausgebaut; Phase 32C erweitert Lektionen 6–10 auf denselben Zielstand.

## Ausbau
Ausgebaute Lektionen 6–10:

6. Bildung & Lernen
7. Reisen & Berichten
8. Gesundheit & Lebensstil
9. Amt & Service
10. Zukunft & Ziele

Jede ausgebaute Lektion enthält 43 Aufgaben:

- 35 normale Kursaufgaben
- 8 Sprechaufgaben

## Parallelregel
Die Projektregel bleibt aktiv: Kursinhalt und Speaking werden pro Niveau zeitgleich ausgebaut. B1 ist nach Phase 32C vollständig parallel aufgebaut.

## B1 Gesamtstand

- B1 Lektionen: 10
- ausgebaute Lektionen: 10
- Starter-Lektionen: 0
- Aufgaben gesamt: 430
- normale Aufgaben: 350
- Sprechaufgaben: 80

## Technische Hinweise
Die Sprechaufgaben nutzen weiterhin die Phase-30E-Logik:

- unterstützter Desktop-Browser: automatische Web-Speech-Auswertung
- iPhone/iPad/unsupported Browser: geführter Sprechmodus mit Selbstbewertung
- keine Fake-Bewertung
- keine blockierende Mikrofonpflicht

## QA
Geprüft:

- JS-Syntax aller Dateien
- Service Worker Syntax
- B1 Content Snapshot
- A2 Regression
- Static Integrity Check

Prüfschnittstelle:

```js
LanguageAcademyCourseEntry.b1ContentSnapshot()
```

Erwartung:

```js
{
  phase: "32C",
  expandedLessons: 10,
  starterLessons: 0,
  totalTasks: 430,
  normalTasks: 350,
  speakingTasks: 80,
  ok: true
}
```
