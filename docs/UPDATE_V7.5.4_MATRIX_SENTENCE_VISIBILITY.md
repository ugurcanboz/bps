# V7.5.4 Matrix/Satzergänzung Sichtbarkeit

- Neue Übungsblöcke ergänzt: `Blocktraining · Nur Matrizen` und `Blocktraining · Nur Satzergänzung`.
- Satzergänzung bleibt Teil der Aufgabenbank und Allgemeinwissen-Logik, aber ohne separaten Test-Button.
- Allgemeinwissen Sprint auf 35 Aufgaben erhöht.
- Technik Sprint und Fehlertraining auf 25 Aufgaben erhöht.
- Übungsintro erklärt Blocktraining: Hinweise/Erklärungen in Übung erlaubt, im Test erst am Ende.
- Cache-Buster in `index.html` auf 7.5.4 gesetzt, damit Browser nicht die alte Runtime laden.

Audit:
- Syntaxprüfung `node --check js/app.js`: OK.
- Runtime-Simulation im Headless-DOM-Fake: matrixOnlySprint 24/24 valide, sentenceSprint 30/30 valide, knowledgeSprint 35/35 valide, ctcLohr 93/93 valide.
- Question Bank: 60 Satzergänzungsaufgaben geladen.
