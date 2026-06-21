# Phase 26E – Fehlertraining

## Ziel
Falsch beantwortete Sprachkurs-Aufgaben werden nicht nur gezählt, sondern als eigener Trainingsbereich sichtbar und gezielt wiederholbar gemacht.

## Umsetzung
- Dashboard-Karte `Meine Fehler` ergänzt.
- Schnellzugriff `Meine Fehler` öffnet echten Fehlertraining-Bereich.
- `collectWrongTasks()` sammelt offene Fehler aus `lessonState.wrongTaskIds`.
- `openErrorTraining()` zeigt konkrete Fehlerkarten mit Lektion, Aufgabentyp und Prompt.
- `openRepeatErrors()` öffnet jetzt die erste tatsächlich falsche Aufgabe, nicht pauschal Aufgabe 1.
- Wenn eine falsche Aufgabe später richtig beantwortet wird, entfernt die bestehende Check-Logik sie automatisch aus `wrongTaskIds`.

## Nicht verändert
- CTC
- Admin
- Highscore
- externe Datenbankstruktur

## Ergebnis
Phase 26E macht die vorhandene Fehlerlogik bedienbar und sichtbar.
