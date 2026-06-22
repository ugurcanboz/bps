# G54.0 / Phase 26 — Product Navigation Structure

## Ziel
Die App wurde konzeptionell von einer Feature-Sammlung zu einer klaren Produktstruktur umgebaut: Simulation als Hauptprodukt, Training als Vorbereitung, Analyse als Fortschritts-/Coach-Bereich und Mehr als sekundärer Systembereich.

## Neue Hauptnavigation
Bottom-Menü wurde auf fünf Hauptbereiche vereinheitlicht:

- Home
- Simulation
- Training
- Analyse
- Mehr

Simulation-Button im Hero und Bottom-Menü führen jetzt zum selben Simulation Center.

## Simulation Center
Neue zentrale Struktur:

- IT / FISI
  - BPS-Simulation: 50 Sekunden pro Aufgabe, keine Hilfe
  - CTC-Simulation: 22 Sekunden pro Aufgabe, keine Hilfe
- Sozialpädagogik
  - BPS-Simulation: 50 Sekunden pro Aufgabe, keine IT-Fragen
- Kaufmännisch
  - BPS-Simulation: 50 Sekunden pro Aufgabe

Die Simulationsprofile werden über `ProductStructureEngine` zentral verwaltet.

## Trainingsbereich
Der Trainingsbereich wurde als Vorbereitung abgegrenzt:

- Berufsfeld-Training mit Kategorieauswahl
  - IT / FISI
  - Sozialpädagogik
  - Kaufmännisch
- Einzeltraining
  - Mathe
  - Deutsch
  - Englisch
  - Logik
  - Matrizen
  - Allgemeinwissen
  - Technisches Verständnis
  - Python-Kurs

Training erlaubt Hilfe und Coach-Unterstützung und bleibt von Simulationen getrennt.

## Strukturänderungen
- Schnellzugriff wurde durch „Heute empfohlen“ ersetzt.
- Lernmodus wurde in Training integriert.
- Fortschritt wurde in Analyse integriert.
- Duell und Highscore wurden in Mehr verlagert.
- „UI Vorteile nutzen“ wurde in Richtung Prüfungsreife/Analyse verschoben.

## Neue Dateien
- `js/core/product-structure-engine.js`
- `css/phase26-product-structure.css`

## Geänderte Dateien
- `index.html`
- `js/ui-home-renderer.js`
- `js/ui-router.js`
- `js/app.js`
- `js/core/app-config.js`
- `service-worker.js`
- `manifest.json`
- `update-check.json`
- `module-manifest.json`
- `docs/WORKING-PLAN.md`
- `WORKING-PLAN_1.md`

## CTC-Integration
CTC ist nun als eigener Simulationsprofil-Pfad vorbereitet:

- Branch: `it`
- SimType: `ctc`
- Mode: `ctcLohr`
- Pool: `it-ctc`
- Zeitprofil: 22 Sekunden pro Aufgabe
- Hilfe: deaktiviert
- Coach während Aufgabe: deaktiviert

Künftige CTC-Übungsmodule müssen ausschließlich an diesen CTC-Pool angebunden werden.

## QA-Hinweis
Die Simulation-Center-Struktur, Training-Center-Struktur und Bottom-Navigation wurden mit Chromium-Viewports geprüft. Eine physische iOS-/iPad-Safari-Prüfung bleibt für finalen Release sinnvoll.
