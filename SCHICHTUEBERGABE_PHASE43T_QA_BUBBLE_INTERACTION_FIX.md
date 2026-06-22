# Schichtübergabe – G54.43.8C QA Bubble Interaction Fix

## Ausgangslage

G54.43.8B hat den echten iPhone-Scroll in Analyse/Fortschritt stabilisiert. Nutzer-Test ergab:

- App normal geöffnet, ohne QA-Parameter: Analyse und Fortschritt scrollen korrekt.
- App sieht auf iPhone gut aus.
- Problem verbleibt nur im internen QA-Capture-Werkzeug: QA-Bubble öffnet, aber Buttons im Panel reagieren auf iPhone/Safari nicht zuverlässig.

## Ziel von G54.43.8C

Nur das QA-Werkzeug reparieren, ohne die funktionierende App-Scrollstruktur erneut anzufassen.

## Geänderte Dateien

- `js/qa/egt-visual-state-capture.js`
- `css/phase43s-iphone-scroll-qa-bubble.css`
- `js/core/app-config.js`
- `manifest.json`
- `update-check.json`
- `service-worker.js`
- `tests_phase43t_qa_bubble_interaction_fix.html`
- `phase43t_static_qa_bubble_interaction.py`
- `phase43t_static_qa_bubble_interaction_result.json`
- `WORKING-PLAN.md`

## Technische Änderungen

### 1. Robuste iPhone-Button-Events

Das QA-Panel nutzt jetzt mehrere Event-Pfade:

- delegierte Events auf Overlay-Ebene
- direkte Button-Handler
- `click`
- `pointerup`
- `touchend`
- zusätzliche capture-phase Listener

Ziel: iPhone/Safari darf die QA-Buttons nicht mehr verschlucken.

### 2. Event-Isolation

QA-Aktionen stoppen ihre Events mit:

- `stopPropagation()`
- `stopImmediatePropagation()`
- `preventDefault()` nur bei echten QA-Aktionen

Dadurch sollen App-Router, Dock-Handler oder globale Click-Listener die QA-Buttons nicht abfangen.

### 3. Neuer Button „Text anzeigen“

Da Clipboard auf iPhone/Safari abhängig von Berechtigungen blockieren kann, wurde ein sicherer Fallback ergänzt:

- `Text anzeigen` erzeugt eine Textarea mit dem vollständigen JSON.
- Der Nutzer kann den Text manuell markieren/kopieren.

Das ist der wichtigste Rettungsweg, falls `JSON kopieren` browserseitig geblockt wird.

### 4. CSS-Isolation

Nur für `.egt-vsc` ergänzt:

- eigene Pointer-Events
- Touch-Manipulation für Buttons
- 44×44 Mindestgröße
- Textarea für JSON-Fallback
- keine Änderung an Analyse-/Fortschritt-Scrollcontainern

## Version

Aktuell:

```text
G54.43.8C
```

Cache:

```text
egt-trainer-g54-43-8c
```

## QA Ergebnis

Statische QA:

```text
12/12 bestanden
```

Syntaxchecks:

- `js/qa/egt-visual-state-capture.js` bestanden
- `js/qa/egt-live-visual-qa.js` bestanden
- `js/qa/egt-visual-regression-diff.js` bestanden
- `js/modules/iphone-scroll-qa-hotfix.js` bestanden
- `service-worker.js` bestanden

Headless-Browser-Test konnte in dieser Umgebung nicht ausgeführt werden, weil Playwright-Browser-Binaries nicht installiert sind. Dafür wurde ein Browser-Testfile beigelegt:

```text
tests_phase43t_qa_bubble_interaction_fix.html
```

## Testanleitung für Nutzer

1. App normal öffnen ohne QA-Parameter.
2. Analyse und Fortschritt prüfen. Diese müssen weiterhin scrollen.
3. Dann mit `?qa=capture` öffnen.
4. QA-Bubble antippen.
5. `State aufnehmen` testen.
6. `Text anzeigen` testen.
7. Falls möglich `JSON kopieren` testen.
8. Falls Clipboard blockiert wird, Text aus der Textarea kopieren.

## Nächster sinnvoller Schritt

Wenn G54.43.8C auf iPhone funktioniert:

```text
G54.43.9 – QA-Nutzerbericht / Bug-Queue Export
```

Wenn Buttons weiterhin nicht funktionieren:

```text
G54.43.8D – QA Bubble Hard Fallback ohne Buttons
```

Dann würde die Bubble beim Öffnen automatisch den State aufnehmen und sofort eine Textarea anzeigen, sodass keine Buttonbedienung mehr nötig ist.
