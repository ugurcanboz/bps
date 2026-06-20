# Phase 38E.5 – Mini-Übungssets auswerten und Trainingsfortschritt speichern

## Ziel

Die Mini-Übungssets aus Phase 38E.4 werden nicht mehr nur angezeigt. Sie können jetzt bearbeitet, ausgewertet und lokal als Trainingsfortschritt gespeichert werden.

## Umsetzung

Erweitert wurde `js/modules/language-exam-shell.js`.

Neue Funktionen:

- `evaluateMiniTraining(session)`
- `loadTrainingProgress()`
- `trainingProgressSummaryHtml(level)`
- `persistTrainingProgress(session, result)` intern
- `latestTrainingProgress(level, part)` intern
- `miniTrainingResultHtml(session)` intern

Neue lokale Speicherung:

```text
language-academy-mini-training-progress-v1
```

Zusätzlich bleibt der aktuelle Trainingsstatus unter folgendem Schlüssel erhalten:

```text
language-academy-exam-training-session-v1
```

## Bewertungslogik

Jede Mini-Aufgabe wird nach zwei Kriterien bewertet:

1. Es muss eine kurze eigene Antwort oder Notiz eingetragen werden.
2. Mindestens zwei Drittel der Checkliste müssen abgehakt sein.

Das Ergebnis enthält:

- Score
- abgeschlossene Mini-Aufgaben
- Gesamtanzahl
- Status `open`, `partial` oder `completed`
- Detailbewertung je Mini-Aufgabe
- nächsten Handlungsschritt

## UI

Jede Mini-Aufgabe enthält jetzt:

- Aufgabenstellung
- Ziel
- Antwortfeld
- abhakbare Checkliste
- Musterlösung / Prüflogik

Zusätzlich gibt es:

- `Mini-Übungen auswerten`
- `Mini-Antworten zurücksetzen`
- gespeicherte Trainingsfortschritte im Dashboard

## QA

Geprüft wurde:

- neue API-Funktionen vorhanden
- neuer Progress-Speicher vorhanden
- Mini-Aufgaben enthalten Textfelder und Checklisten
- Auswertungsbutton vorhanden
- Reset-Button vorhanden
- Fortschrittszusammenfassung im Dashboard vorhanden
- B2-Gesamt-QA aus Phase 38D.7 weiterhin bestanden
- Service Worker Asset-Check bestanden
