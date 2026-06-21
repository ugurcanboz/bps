# Phase 38C.11 – B1 Vollprüfung QA / Endsimulation

## Ziel

Phase 38C.11 schließt das B1-Prüfungsfundament mit einer Endsimulation und Regressionstests ab. Es wird bewusst keine Prüfungsfreigabe eingebaut. Die App bleibt bei Ergebnisbericht, Prüfungsreife-Prognose, Stärken, Schwächen und Empfehlungen.

## Eingebaute QA-Szenarien

Die Engine kann jetzt vollständige B1-Prüfungssessions simulieren:

1. `good-pass` – klare bestandene Prüfung.
2. `borderline-pass` – knapp bestandene Prüfung.
3. `borderline-fail` – knapp nicht bestanden wegen schwachem Teilbereich.
4. `weak-speaking` – Lesen/Hören/Schreiben gut, Sprechen klar zu schwach.
5. `wrong-writing-topic` – Schreiben verfehlt Thema trotz sonst guter Leistung.
6. `incomplete-listening` – Hörteil fehlt, dadurch keine vollständige Prognose.
7. `groq-down-fallback` – Groq-Ausfall, lokale Bewertung übernimmt stabil.

## Neue Engine-Funktionen

`window.LanguageExamEngine.createB1FullQaSession(type)`

Erzeugt eine vollständige simulierte B1-Session für einen der QA-Fälle.

`window.LanguageExamEngine.runB1FullExamQaScenarios()`

Erzeugt alle QA-Fälle inklusive Abschlussbericht.

`window.LanguageExamEngine.validateB1FullExamQaScenarios()`

Prüft, ob die erwartete Entscheidung korrekt ist.

## Erwartete Entscheidungen

- good-pass → bestanden
- borderline-pass → bestanden
- borderline-fail → nicht bestanden
- weak-speaking → nicht bestanden
- wrong-writing-topic → nicht bestanden
- incomplete-listening → nicht bestanden
- groq-down-fallback → bestanden

## Warum diese Phase wichtig ist

B2 soll erst starten, wenn B1 als Vorlage stabil ist. Diese Phase verhindert, dass Bewertungsfehler aus B1 später nach B2 kopiert werden.

## Testseite

`tests_phase38c11_b1_vollpruefung_qa.html`

Testpunkte:

- Diagnose starten
- alle QA-Szenarien prüfen
- Einzel-Szenarien öffnen
- Exam Shell öffnen
- Groq-Fallback simulieren
- unvollständige Prüfung prüfen

