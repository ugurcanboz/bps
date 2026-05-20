# V8.1.5 Question Bank Expansion

## Eingebaut
- 56 digitale Zahlenreihen aus `Zahlenreihen.pdf` inklusive Lösungen und Regel-Erklärungen.
- 15 Textverständnis-Aufgaben aus `Textverständnis.pdf` als stimmt/stimmt-nicht Training.
- 17 visuelle Logikaufgaben als Bildaufgaben aus den PDFs:
  - Gemeinsamkeiten finden
  - Zugehörigkeiten identifizieren I
  - Zugehörigkeiten identifizieren II

## Neue gezielte Trainingsmodi
- Blocktraining · Zahlenreihen Buch
- Blocktraining · Textverständnis
- Blocktraining · Visuelle Buchlogik

## Architektur
- Aufgabenbank kann jetzt Bildquellen (`imageSrc`, `imageAlt`) übernehmen.
- Bildaufgaben werden als `imageTask` gerendert.
- Aufgaben laden weiterhin erst nach Start.
