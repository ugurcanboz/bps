# Phase 31B – A2 Lektionen 1–5 Content + Speaking Expansion

Version: G54.14
Datum: 2026-06-17

## Ziel

A2 wird nicht mehr nur als Starterstruktur geführt. Die ersten fünf A2-Lektionen wurden inhaltlich erweitert und gleichzeitig mit Sprechaufgaben ausgebaut. Damit bleibt die Projektregel aktiv: normale Kursaufgaben und Speaking werden pro Niveau parallel entwickelt.

## Ausgebaute Lektionen

1. Tagesablauf
2. Wohnen
3. Termine vereinbaren
4. Einkaufen & Service
5. Gesundheit

## Umfang

- 5 ausgebaute Lektionen mit je 43 Aufgaben
- 35 normale Aufgaben pro ausgebaute Lektion
- 8 Sprechaufgaben pro ausgebaute Lektion
- Lektionen 6–10 bleiben als Starterstruktur mit je 12 Aufgaben erhalten
- A2 gesamt nach Phase 31B: 275 Aufgaben
- A2 Speaking gesamt nach Phase 31B: 60 Sprechaufgaben

## Enthaltene Aufgabentypen

- Multiple Choice
- Lückentext
- Satzbau
- Hörverständnis
- Richtig/Falsch
- Zuordnen
- Sprechen / Speaking Practice

## Speaking

Die Phase-30E-Logik bleibt aktiv:

- Desktop/unterstützte Browser: automatische Web-Speech-Auswertung
- iPhone/iPad/unsupported Browser: geführter Sprechmodus mit ehrlicher Selbstbewertung
- Keine Fake-Bewertung
- `parallelContent: true` bleibt bei allen A2-Aufgaben gesetzt

## Neue Prüfschnittstelle

```js
LanguageAcademyCourseEntry.a2ContentSnapshot()
```

Erwarteter Kernstatus:

```js
{
  phase: '31B',
  level: 'a2',
  expandedLessons: 5,
  starterLessons: 5,
  totalTasks: 275,
  normalTasks: 215,
  speakingTasks: 60,
  ok: true
}
```

## Nicht geändert

- CTC-Simulation
- Admin-Portal
- Highscore
- Teilnahmecode/Auth
- Firebase/Supabase-Logik

## Ehrliche Grenze

Phase 31B erweitert A2 fachlich solide für Lektionen 1–5. Lektionen 6–10 sind bewusst noch Starterstruktur und sollen in Phase 31C auf denselben Umfang gebracht werden.
