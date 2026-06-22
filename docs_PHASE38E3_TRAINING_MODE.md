# Phase 38E.3 – Trainingsmodus aus Schwächenprofil starten

## Ziel

Phase 38E.3 macht aus dem Schwächenprofil einen aktiven Trainingspfad. Die App zeigt nicht mehr nur Empfehlungen, sondern startet aus jedem schwachen Prüfungsteil direkt einen fokussierten Trainingsblock.

## Umsetzung

Neu in `js/modules/language-exam-shell.js`:

```text
startTraining(level, part)
trainingModeBanner(session)
finishTraining()
trainingProfileFor(level, part, sourceItem)
saveTrainingState(session)
```

Das Schwächenprofil zeigt pro Prüfungsteil jetzt einen Button:

```text
Training starten
```

Der Button startet eine Trainingssession mit:

- Niveau
- Prüfungsteil
- Zielwert
- Statusband: critical / weak / open / borderline / stable
- empfohlener Dauer
- konkreten Übungsschritten

## Trainingslogik

Ein Trainingsblock ist kein offizieller Prüfungsversuch. Die Session bekommt:

```text
status: training
strictMode: false
trainingFocus: {...}
currentPart: <Schwächenteil>
```

Der Nutzer landet direkt im passenden Prüfungsteil, zum Beispiel:

- Lesen
- Hören
- Grammatik & Sprachbausteine
- Schreiben
- Sprechen

## UI

Neu ergänzt in `css/language-course.css`:

```text
.la-training-mode-banner
.la-training-target-grid
.la-training-step-list
.la-training-start
```

Die UI bleibt mobilfähig und zeigt auf kleinen Bildschirmen alle Trainingswerte einspaltig.

## QA

Geprüft:

- Shell Diagnostics Phase 38E.3
- Schwächenprofil enthält Startbuttons
- `startTraining()` vorhanden
- `trainingModeBanner()` vorhanden
- Trainingssession setzt `status: training`
- Trainingssession springt direkt zum gewählten Prüfungsteil
- Export-API enthält Trainingsfunktionen
- B2-Gesamt-QA bleibt unverändert verfügbar
- Service Worker Cache auf 38E.3 erhöht

## Ergebnis

Die App kann jetzt aus dem Prüfungsergebnis heraus gezielt trainieren. Das ist der Übergang von Analyse zu Handlung: Schwäche erkennen, passenden Teil starten, trainieren, danach erneut vollständige Simulation durchführen.
