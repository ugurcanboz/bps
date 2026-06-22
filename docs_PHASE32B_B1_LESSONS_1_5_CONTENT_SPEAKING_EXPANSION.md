# Phase 32B – B1 Lektionen 1–5 Content + Speaking Expansion

## Ziel
B1 wird nach der festgelegten Projektregel parallel ausgebaut: normale Kursaufgaben und Speaking-Aufgaben entstehen zeitgleich.

## Umfang
Ausgebaut wurden die ersten fünf B1-Lektionen:

1. Meinung & Diskussion
2. Kommunikation im Beruf
3. Erfahrungen erzählen
4. Probleme & Lösungen
5. Medien & Informationen

## Ergebnis
- 10 B1-Lektionen bleiben verfügbar.
- Lektion 1–5 sind inhaltlich ausgebaut.
- Lektion 6–10 bleiben als Starterstruktur verfügbar.
- Jede ausgebaute Lektion enthält 43 Aufgaben.
- Davon 35 normale Aufgaben und 8 Sprechaufgaben.
- B1 hat jetzt 275 Aufgaben insgesamt.
- B1 hat jetzt 60 Sprechaufgaben insgesamt.

## Aufgabentypen
Die ausgebauten Lektionen enthalten:

- Multiple Choice
- Lückentext
- Satzbau
- Hörverständnis
- Richtig/Falsch
- Zuordnen
- Speaking Practice

## Speaking-Kompatibilität
Die bestehende Phase-30E-Logik bleibt aktiv:

- Unterstützte Desktop-Browser nutzen automatische SpeechRecognition.
- iPhone/iPad und nicht unterstützte Browser nutzen den geführten Sprechmodus mit Selbstbewertung.
- Es gibt keine Fake-Bewertung.
- Die Sprechaufgaben bleiben auf GitHub Pages ohne Server nutzbar.

## QA
Neue Prüfschnittstelle:

```js
LanguageAcademyCourseEntry.b1ContentSnapshot()
```

Erwarteter Kernstatus:

```json
{
  "phase": "32B",
  "level": "b1",
  "expandedLessons": 5,
  "starterLessons": 5,
  "totalTasks": 275,
  "normalTasks": 215,
  "speakingTasks": 60,
  "ok": true
}
```

## Nächster Schritt
Phase 32C: B1 Lektionen 6–10 mit Content + Speaking parallel ausbauen.
