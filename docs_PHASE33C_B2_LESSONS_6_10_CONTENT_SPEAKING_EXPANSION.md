# Phase 33C – B2 Lessons 6-10 Content + Speaking Expansion

Version: G54.23

## Ziel

Die restlichen B2-Lektionen 6-10 wurden inhaltlich ausgebaut. Normale Kursaufgaben und Speaking wurden wieder parallel erweitert. B2 ist damit vollständig ausgebaut.

## Ausgebaute Lektionen

6. Umwelt & Konsum
7. Gesundheitssystem & Prävention
8. Digitalisierung & KI
9. Kultur & Integration
10. Formell schreiben & sprechen

## Ergebnis

- B2-Lektionen gesamt: 10
- vollständig ausgebaute B2-Lektionen: 10
- Aufgaben pro Lektion: 43
- normale Aufgaben pro Lektion: 35
- Sprechaufgaben pro Lektion: 8
- B2-Aufgaben gesamt: 430
- B2-Normalaufgaben gesamt: 350
- B2-Sprechaufgaben gesamt: 80

## Speaking

B2 nutzt weiterhin die Phase-30E-Logik:

- Desktop/unterstützter Browser: automatische SpeechRecognition-Auswertung
- iPhone/iPad/unsupported Browser: geführter Sprechmodus mit Selbstbewertung
- keine Fake-Bewertung
- keine kaputte Mikrofonpflicht

## QA

Neue Prüfschnittstelle:

```js
LanguageAcademyCourseEntry.b2ContentSnapshot()
```

Erwarteter Kernstatus:

```json
{
  "phase": "33C",
  "level": "b2",
  "expandedLessons": 10,
  "starterLessons": 0,
  "totalTasks": 430,
  "normalTasks": 350,
  "speakingTasks": 80,
  "ok": true
}
```

## Nächster Schritt

Phase 33D – B2 Gesamt-QA + UI/Flow-Prüfung.
