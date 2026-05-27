# Bugfix V7.5.3 · Runtime Audit

## Behoben
- Kritischer Startfehler beseitigt: `bootstrapExternalQuestionBank()` wurde vor Initialisierung der QuestionBank-Engine ausgeführt.
- Satzergänzungsbank wird jetzt korrekt nach Engine-Initialisierung geladen.
- Satzergänzung bleibt ohne eigenen Frontend-Testbutton.
- Satzergänzungsaufgaben erscheinen im Allgemeinwissen-Modus, Allgemeinwissen-Sprint und in CTC-Lohr/Allgemeinwissen-Blöcken.
- Matrizen-Buchaufgaben bleiben im Logik-/Visual-IQ-/Fehlertraining eingebunden.

## Kontrollsimulation
- Alle Modi wurden programmatisch aufgebaut.
- Keine ungültigen Fragen im Build-Check.
- QuestionBank: 60 Satzergänzungsaufgaben geladen.
- Allgemeinwissen-Test: Satzergänzung erscheint im Aufgabenmix.
- Allgemeinwissen-Sprint: Satzergänzung erscheint im Aufgabenmix.
- CTC-Lohr-Simulation: Satzergänzung erscheint im Allgemeinwissenblock.

## Prinzip
- Übung/Blocktraining: Hinweise und Erklärungen sind erlaubt.
- Testmodus: keine Hilfen während der Aufgabe; Lösungen/Erklärungen erst am Ende.
