# G54.2 · CTC-Lohr Real Exam Structure

## Ziel
Der bisherige CTC-Modus wurde von einem pauschalen 22-Sekunden-Aufgabenmix auf einen realitätsnäheren Blockablauf umgestellt.

## Scope
Ausschließlich: `Simulation → IT/FISI → CTC`.

Nicht betroffen:
- BPS
- Sozialpädagogik
- Kaufmännisch
- Training
- Einzeltraining
- Python
- Duell
- Highscore direkt

## Neuer Ablauf

| Block | Inhalt | Menge | Zeit |
|---|---:|---:|---:|
| 1 | Allgemeinwissen, irritierend formuliert | 40 Fragen | 7 Minuten / ca. 10,5 s je Frage |
| 2 | Mathematik Sprint, ohne Taschenrechner lösbar | 9 Aufgaben | 22 s je Aufgabe |
| 3 | CTC-Regelrechnung als Inline-Slash, kein Bruchstrich | 6 Aufgaben | 40 s je Aufgabe |
| 4 | Buchstaben-Konzentration | 4 Aufgaben | 40 s je Aufgabe |
| 5 | Tabellen / Koordinaten | 2 Tabellenblöcke | 90 s je Block |
| 6 | CTC-Logik: Wenn-Dann-Ablauf / FlowLogic | 1 Aufgabe | 13 Minuten |

Reine Prüfungszeit: 1978 Sekunden = 32:58 Minuten. Anzeigeempfehlung: ca. 33–35 Minuten.

## Neue Dateien
- `js/core/ctc-lohr-exam-structure-engine.js`
- `css/ctc-lohr-real-exam.css`

## Geänderte Kernpunkte
- `ctcLohr.amount` auf 62 gesetzt.
- `QuizBuildPipelineEngine` nutzt `EGTCTCLohrExamStructureEngine`.
- `showQuestion` nutzt nun aufgabenspezifische Zeiten statt pauschal 22 Sekunden.
- Eingabe-Renderer für Regelrechnung, Buchstaben und Tabellen ergänzt.
- FlowLogic bleibt Finalblock mit 13 Minuten.
- Scope-Guards blockieren Nicht-IT/CTC-Kontexte.

## CTC-Regelrechnung
Wichtig: kein Bruchstrich, kein Multiple Choice.

Beispiel sichtbar:
`40-16-9/46+27-10`

Antwort per Eingabefeld.

## QA
- Node Syntaxchecks bestanden.
- Engine-Check bestätigt 62 Aufgaben, 1978 Sekunden und korrekte Blockmengen.
- Scope-Negativtests für BPS und Sozial blockieren korrekt.
- Visuelle statische Multi-Viewport-Prüfung als PNG erzeugt: Desktop, iPad Hochformat, iPad Querformat, iPhone.

Hinweis: Chromium war in der Containerumgebung instabil; visuelle Screens wurden daher per statischem HTML/CSS-Render mit WeasyPrint/PDF-Konvertierung erzeugt. Echte Geräteprüfung bleibt für iOS Safari empfohlen.
