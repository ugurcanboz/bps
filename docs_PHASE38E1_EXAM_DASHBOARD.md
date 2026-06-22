# Phase 38E.1 – Prüfungsdashboard / Gesamtübersicht / Lernstandsvergleich A1–B2

## Ziel

Diese Phase ergänzt den Academy-Hardmode um ein sichtbares Prüfungsdashboard. Der Nutzer soll nicht nur einzelne Prüfungen starten, sondern sofort erkennen:

- welches Niveau von A1 bis B2 bereits bearbeitet wurde,
- welche Ergebnisse gespeichert sind,
- welche Mindestanforderungen pro Niveau gelten,
- welche nächste Trainingsentscheidung sinnvoll ist,
- warum A1, A2, B1 und B2 nicht gleich schwer sind.

## Umsetzung

Geändert wurden:

```text
js/modules/language-exam-shell.js
css/language-course.css
service-worker.js
update-check.json
WORKING-PLAN_1.md
```

Neu erstellt:

```text
docs_PHASE38E1_EXAM_DASHBOARD.md
tests_phase38e1_exam_dashboard.html
phase38e1_static_qa.py
phase38e1_static_qa_result.json
```

## Neue Funktionen

In `LanguageExamShell` wurden ergänzt:

```text
loadHistory()
dashboardHtml()
```

Intern zusätzlich:

```text
loadHistory()
saveHistory()
archiveFinalAttempt()
bestHistoryByLevel()
currentProgressByLevel()
requirementMini()
nextRecommendation()
dashboardHtml()
```

## Dashboard-Inhalte

Das Dashboard zeigt für A1 bis B2:

- Status: offen, aktiv, bestanden, nicht bestanden
- Score oder Platzhalter
- abgeschlossene Pflichtteile
- Schreibumfang
- Sprechumfang
- Grammatikschwerpunkte
- Kompetenzfokus
- nächste Empfehlung
- Direktstart pro Niveau

## Versuchshistorie

Abgeschlossene Versuche werden lokal in `localStorage` gespeichert:

```text
language-academy-exam-shell-history-v1
```

Gespeichert werden maximal 40 Einträge. Angezeigt werden die letzten 5.

## Prüfungslogik

Die bisherige B2-Gesamt-QA bleibt unverändert erhalten:

- 5 Pflichtteile
- B2-Kombinationen: 32.768
- Grammatik bleibt Pflichtblock
- A1/B1-Antworten dürfen B2 nicht bestehen
- lokaler Fallback bleibt stabil
- Groq bleibt optionaler Mitprüfer für Schreiben/Sprechen

## Visuelle Anforderungen

Das Dashboard ist responsive:

- Desktop: vier Kacheln nebeneinander
- Tablet: zwei Kacheln nebeneinander
- iPhone: eine Kachel pro Zeile
- keine horizontale Seitenverschiebung
- Touch-Ziele bleiben groß genug
- dunkle Karten mit klarer Schrift

## Ergebnis

Phase 38E.1 macht aus dem reinen Prüfungsmodus eine steuerbare Prüfungszentrale. Der Nutzer sieht nun nicht nur Aufgaben, sondern Lernstand, Niveauanforderung und nächsten sinnvollen Schritt.
