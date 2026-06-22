# Phase 30C – A1 Speaking Content Expansion

Status: PASS  
Version: G54.9  
Datum: 2026-06-16

## Ziel

Phase 30C baut die Sprechaufgaben inhaltlich so aus, dass das Sprechtraining zum bestehenden A1-Kursumfang passt.

Die Sprechfunktion war in Phase 30B technisch verbessert worden. Phase 30C ergänzt nun echte A1-Sprechinhalte über alle Lektionen hinweg.

## Umsetzung

Ergänzt wurden 40 neue Aufgaben vom Typ:

```js
speaking_practice
```

Verteilung:

| Lektion | Sprechaufgaben |
|---|---:|
| A1 Begrüßungen | 4 |
| A1 Sich vorstellen | 4 |
| A1 Zahlen | 4 |
| A1 Uhrzeit | 4 |
| A1 Familie | 4 |
| A1 Einkaufen | 4 |
| A1 Arzt & Termin | 4 |
| A1 Beruf & Arbeit | 4 |
| A1 Verkehr | 4 |
| A1 Alltag | 4 |

Gesamt:
- 10 Lektionen
- 40 Sprechaufgaben
- 430 A1-Aufgaben insgesamt

## Inhaltliches Prinzip

Jede Sprechaufgabe enthält:
- deutschen Zieltext
- türkische Ziel-/Parallelform
- Aussprachevarianten
- DE/TR-Hinweis
- DE/TR-Erklärung
- Markierung `parallelContent: true`

Damit ist die spätere Erweiterung auf A2/B1/B2/C1/C2 sauber vorgegeben.

## Technisches Prinzip

Phase 30C nutzt weiterhin den Phase-30B-Adapter:
- Browser SpeechRecognition
- GitHub Pages kompatibel
- kein Server
- kein Vosk-Server
- keine kostenpflichtige API
- `interimResults=true`
- `maxAlternatives=5`
- Ähnlichkeitsbewertung
- Wort-für-Wort-Feedback
- Fallback bei unsupported / permission denied / no speech

## Neue Projektregel

Ab dieser Phase gilt verbindlich:

> Wenn ein neues Niveau inhaltlich ausgebaut wird, werden normale Aufgaben und Sprechaufgaben parallel ausgebaut und gemeinsam geprüft.

Für A2 bedeutet das später:
- A2-Lektionsstruktur
- A2-Standardaufgaben
- A2-Sprechaufgaben
- A2-Speaking-QA

werden nicht getrennt, sondern im gleichen Ausbauprinzip behandelt.

## QA

Neue Prüfschnittstelle bzw. erweiterte Snapshot-Daten:

```js
LanguageAcademyCourseEntry.phase30SpeechSnapshot()
```

Erwartete Werte:

```js
a1SpeakingTasks === 40
a1TotalTasks === 430
a1SpeakingCoverage.complete === true
```

Neue Testdatei:

```text
tests_phase30c_a1_speaking_content_expansion.html
```

Zusätzliche Checks:
- JS-Syntaxchecks bestanden.
- Node-Mock-Diagnostics bestanden.
- Alle 10 A1-Lektionen haben exakt 4 Sprechaufgaben.

## Nicht getestet

Echte Mikrofonaufnahme konnte in der Entwicklungsumgebung nicht final getestet werden.

Muss auf Zielgeräten geprüft werden:
- Chrome / Edge Desktop
- Android Chrome
- iPhone Safari
- iPad Safari

## Nicht verändert

- CTC
- Admin
- Highscore
- Teilnahmecode
- Auth
- Cloud-Sync-Grundlogik
