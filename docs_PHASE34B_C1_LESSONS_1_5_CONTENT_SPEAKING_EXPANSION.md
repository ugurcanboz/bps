# Phase 34B – C1 Lessons 1-5 Content + Speaking Expansion

## Ziel
C1 wurde von einer reinen Kursstruktur zu einem ersten inhaltlich ausgebauten C1-Bereich erweitert. Die Lektionen 1 bis 5 enthalten jetzt normale Kursaufgaben und Sprechaufgaben parallel.

## Ausgebaute Lektionen
1. Akademisch argumentieren
2. Nuancierte Meinung
3. Komplexe Texte verstehen
4. Professionell verhandeln
5. Formelle Korrespondenz

## Umfang
- 10 C1-Lektionen gesamt
- 5 ausgebaute Lektionen
- 5 Starter-Lektionen
- 43 Aufgaben je ausgebauter Lektion
- 35 normale Aufgaben je ausgebauter Lektion
- 8 Sprechaufgaben je ausgebauter Lektion
- C1 gesamt nach Phase 34B: 275 Aufgaben
- C1 Speaking gesamt nach Phase 34B: 60
- C1 Normalaufgaben gesamt nach Phase 34B: 215

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
```json
{
  "phase": "34B",
  "level": "c1",
  "expandedLessons": 5,
  "starterLessons": 5,
  "totalTasks": 275,
  "normalTasks": 215,
  "speakingTasks": 60,
  "ok": true
}
```

## QA
- JS-Syntaxcheck komplett
- Service Worker Syntaxcheck
- Node Snapshot Check
- Static Integrity Check
- A2/B1/B2 Regression

## Nächste Phase
Phase 34C – C1 Lektionen 6-10 Content + Speaking Expansion.
