# Schichtübergabe – G54.43.8 Visual Regression / Capture-Diff

## Ausgangspunkt

Aufgesetzt auf G54.43.7 Screenshot-Recorder / Visual-State-Capture.

G54.43.7 konnte bereits lokale Visual-State-Captures erzeugen und als JSON exportieren. G54.43.8 ergänzt darauf aufbauend den Vergleich zweier Captures, damit Layoutänderungen, Regressionen und visuelle Zustandsabweichungen nachvollziehbar geprüft werden können.

## Ziel von G54.43.8

Ein lokales Browser-Cockpit für Visual Regression:

- Baseline-Capture importieren oder aus aktuellem Zustand speichern
- aktuellen Visual-State aufnehmen
- Baseline gegen aktuellen Zustand vergleichen
- priorisierte Diff-Befunde erzeugen
- Diff als JSON kopieren

Alles läuft clientseitig im Browser. Kein Upload, kein Backend, keine externen Dienste.

## Neue Datei

```text
js/qa/egt-visual-regression-diff.js
```

## Neue globale API

```js
window.EGTVisualRegressionDiff
```

Wichtige Methoden:

```js
init(options)
openOverlay()
captureCurrent()
compareNow()
compareCaptures(base, current, options)
setBaseline(capture, persist)
setCurrent(capture)
getState()
```

## Startmodi

```text
?qa=diff
?qa=visual-diff
#qa-diff
```

## Workflow im Browser

1. App öffnen.
2. `?qa=diff` oder `#qa-diff` verwenden.
3. Baseline importieren oder aktuellen Zustand als Baseline speichern.
4. „Aktuell aufnehmen“ klicken.
5. „Vergleichen“ klicken.
6. Befunde prüfen oder „Diff kopieren“ verwenden.

## Vergleichslogik

Der Diff prüft:

- Viewport-/DPR-Abweichungen
- Änderung des Visual-State-Scores
- horizontalen Overflow
- Offscreen-Elemente
- abgeschnittene Elemente
- Touch-Targets unter 44px
- SVG-/Canvas-Präsenz
- sichtbare Textblöcke
- fehlende wichtige Elemente
- neue wichtige Elemente
- Layout-Shifts und Größenänderungen

## Schwellenwerte

```js
rectTolerance: 8
sizeTolerance: 8
textTolerance: 18
```

Das bedeutet: kleine Rundungs-/Rendering-Abweichungen werden toleriert, echte Verschiebungen werden als Befund markiert.

## Geänderte Dateien

```text
index.html
service-worker.js
manifest.json
update-check.json
js/core/app-config.js
WORKING-PLAN.md
```

## Neue Test-/QA-Dateien

```text
tests_phase43q_visual_regression_diff.html
phase43q_static_check.py
phase43q_static_check_result.json
```

## Version / Cache

```text
Version: G54.43.8
Build: G54.43.8-2026-06-21
Cache: egt-trainer-g54-43-8
Label: G54.43.8 Visual Regression / Capture-Diff
```

## QA-Ergebnis

Statische QA:

```text
17/17 bestanden
```

Zusätzlich geprüft:

```text
node --check js/qa/egt-visual-regression-diff.js
node --check js/qa/egt-visual-state-capture.js
```

Beide ohne Syntaxfehler.

## Kritische Hinweise

- Das Tool vergleicht Visual-State-JSONs, keine echten Pixelbilder.
- Pixel-Screenshots bleiben wegen Browser-Sicherheitsmodell nutzerinteraktionspflichtig.
- Der Diff ist bewusst fehlertolerant, damit minimale Browser-Rundungen nicht als harte Fehler erscheinen.
- Für echte Pixel-Regression wäre als nächster Schritt ein Screenshot-Archiv plus manueller/halbautomatischer Vergleich sinnvoll.

## Nächster sinnvoller Schritt

G54.43.9 – Visual Regression Bug Queue / Priorisierte Abarbeitungsliste

Ziel:

- Diff-Befunde automatisch gruppieren
- Prioritäten vergeben: kritisch / hoch / mittel / niedrig
- konkrete Fix-Aufgaben erzeugen
- Copy-Report als Entwickler-To-do-Liste bereitstellen
