# Phase 31C – A2 Lektionen 6–10 Content + Speaking Expansion

## Ziel

Phase 31C baut die A2-Lektionen 6–10 inhaltlich aus und führt die neue Projektregel konsequent weiter: normale Kursaufgaben und Sprechaufgaben werden parallel erweitert.

## Ausgebaute Lektionen

6. Arbeit & Schule
7. Reisen & Orientierung
8. Essen & Restaurant
9. Vergangenheit erzählen
10. Meinung & Pläne

Damit ist A2 jetzt vollständig ausgebaut.

## Umfang nach Phase 31C

| Bereich | Anzahl |
|---|---:|
| A2-Lektionen gesamt | 10 |
| Ausgebaute A2-Lektionen | 10 |
| Starter-Lektionen übrig | 0 |
| Aufgaben pro Lektion | 43 |
| Normale Aufgaben pro Lektion | 35 |
| Sprechaufgaben pro Lektion | 8 |
| A2-Aufgaben gesamt | 430 |
| A2-Sprechaufgaben gesamt | 80 |
| A2-Normalaufgaben gesamt | 350 |

## Enthaltene Aufgabentypen

- Multiple Choice
- Lückentext
- Satzbau
- Hörverständnis
- Richtig/Falsch
- Zuordnung
- Speaking Practice

## Speaking-Logik

Alle neuen A2-Sprechaufgaben nutzen weiterhin die Phase-30E-Logik:

- automatische Web-Speech-Auswertung, wenn der Browser sie unterstützt
- geführter Sprechmodus mit Selbstbewertung auf iPhone/iPad oder nicht unterstützten Browsern
- keine Fake-Bewertung
- keine blockierte Aufgabe bei fehlender SpeechRecognition

## Prüfschnittstelle

```js
LanguageAcademyCourseEntry.a2ContentSnapshot()
```

Erwarteter Kernstatus:

```js
{
  phase: '31C',
  level: 'a2',
  expandedLessons: 10,
  starterLessons: 0,
  totalTasks: 430,
  normalTasks: 350,
  speakingTasks: 80,
  ok: true
}
```

## QA

Bestanden:

```bash
node --check js/modules/language-course-entry-module.js
node --check js/core/app-config.js
node --check js/i18n/language-store.js
node --check js/i18n/language-adapter.js
node --check js/modules/language-adaptive-engine.js
node --check js/modules/language-course-cloud-sync.js
node --check service-worker.js
```

Zusätzlich per Node-Mock geprüft:

```text
PASS phase31C snapshot
expanded: 10
starter: 0
total: 430
normal: 350
speaking: 80
ok: true
```

## Einschränkung

Ein echter Browser-Render-Test auf iPhone/iPad/Desktop wurde in dieser Umgebung nicht ausgeführt. Die Code-Syntax und die A2-Struktur wurden automatisiert geprüft.
