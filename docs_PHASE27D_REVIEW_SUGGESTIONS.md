# Phase 27D – Coach Wiederholungs-Vorschläge

## Ziel
Der KI-Lehrer erzeugt aus den Analysewerten konkrete Wiederholungssets statt nur allgemeine Empfehlungen.

## Umgesetzt
- `coachReviewSets()` ergänzt
- Wiederholungssets für offene Fehler, schwache Aufgabentypen, auffällige Lektionen, fällige Vokabeln und aktuelle Lektion
- `coachReviewSetsHtml()` ergänzt
- Coach-Karte und Coach-Detailansicht zeigen Wiederholungssets
- Start-Buttons nutzen bestehende Actions (`language-course-open-error-training`, `language-course-open-vocabulary`, `language-course-open-lesson:*`, `language-course-continue`)
- Dunkles Hauptapp-Design beibehalten

## Abnahme
- Keine separate Chatbot-Oberfläche
- Keine Änderung an CTC/Admin/Highscore
- JS-Syntaxprüfung bestanden
