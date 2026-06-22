# G54.1 · CTC FlowLogic Integration

## Ziel
Integration des Standalone-Moduls `FlowLogic-Standalone-G39.26` ausschließlich in den Pfad:

`Simulation → IT/FISI → CTC`

Kein Training, kein BPS, kein Sozialpädagogik-, Kaufmännisch-, Einzeltraining- oder Python-Pfad darf diese Aufgabe erhalten.

## Fachliche Einordnung

**Titel:** CTC-Logik: Wenn-Dann-Ablauf  
**Untertitel:** Finde die versteckten Fehler.  
**Aufgabentyp:** Logik-Fehlersuche in Ablauf-/Entscheidungsdiagrammen  
**Regeln:** Handlung = Quadrat/Rechteck, Frage = Raute, Ja/Nein = Pfeile  
**Sonderzeit:** 13 Minuten / 780 Sekunden  
**Hilfe:** deaktiviert  
**Coach während Aufgabe:** deaktiviert  
**Coach-Auswertung:** erst nach Abschluss über normalen Result-Flow

## Technische Integration

Neue App-Dateien:

- `js/modules/ctc-flowlogic-adapter.js`
- `css/ctc-flowlogic-integration.css`
- `modules/flowlogic/**`

Geänderte Integrationspunkte:

- `index.html`
- `js/core/quiz-build-pipeline-engine.js`
- `js/core/question-factory.js`
- `js/modules/egt-simulation-engine.js`
- `js/app.js`
- `js/question-bank-quality-engine.js`
- `js/modules/auth-profile-shell.js`
- `service-worker.js`
- `manifest.json`
- `update-check.json`
- `module-manifest.json`

## Scope-Guard

Der Adapter erlaubt FlowLogic nur, wenn alle Bedingungen erfüllt sind:

- `branch === "it"`
- `mode === "ctcLohr"`
- `simType === "ctc"`
- `pool === "it-ctc"`
- Inject-Index: `54`

Negative Pfade wurden geprüft:

- IT/FISI → BPS: blockiert
- Sozialpädagogik → BPS: blockiert
- Kaufmännisch → BPS: blockiert
- Training IT: blockiert

## QA-Ergebnis

Bestanden:

- JS-Syntaxchecks
- JSON-Validierung
- Service-Worker-Assetprüfung
- FlowLogic-SelfTest: 41/41 grün
- CTC-only Scope-Test
- Desktop/iPad/iPhone Chromium-Viewport-Screenshots
- Horizontaler Overflow: 0
- Hilfe-Button während Aufgabe: nicht sichtbar
- Zeitmodell: 780 Sekunden

## Einschränkung

Die visuelle Geräteprüfung erfolgte mit Chromium-Viewports. Das ersetzt keine physische iOS-Safari-Prüfung, ist aber für Layout, Overflow und Rendering aussagekräftig.
