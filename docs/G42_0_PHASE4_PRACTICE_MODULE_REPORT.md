# G42.0 · Phase 4 · Freies Lern-/Übungsmodul

## Ziel
Phase 4 baut den freien Lern-/Übungsbereich als echtes Fachmodul auf. Üben soll sich bewusst von der Simulation unterscheiden: ruhiger, erklärender, mit Coach-Hilfe und mit Platzhaltern für spätere Interaktionsmodule.

## Umgesetzte Dateien

### Neu
- `js/modules/egt-practice.js`
- `css/egt-practice.css`

### Geändert
- `index.html`
- `js/modules/egt-practice-entry-module.js`
- `js/core/module-host.js`
- `js/core/architecture-guard.js`
- `service-worker.js`
- `module-manifest.json`
- `js/core/app-config.js`
- `update-check.json`
- `manifest.json`
- `WORKING-PLAN_1.md`
- `docs/WORKING-PLAN.md`

## Neue Architektur

### Neues Fachmodul
`window.EGTPracticeModule`

Registrierung:
```js
AppModuleHost.register({
  id: 'practice',
  label: 'Freies Lernen / Üben',
  branchAware: true,
  start,
  stop
});
```

### Öffentliche API
- `EGTPracticeModule.open(options)`
- `EGTPracticeModule.close()`
- `EGTPracticeModule.start(ctx)`
- `EGTPracticeModule.stop(payload)`
- `EGTPracticeModule.selectCategory(id)`
- `EGTPracticeModule.selectMode(id)`
- `EGTPracticeModule.startSelected()`
- `EGTPracticeModule.categories()`

## UI-Funktion
Das Modul rendert ein eigenes ruhiges Practice-Sheet mit:
- Bibliothek/Kategorien
- Trainingsmodus-Auswahl
- Coach-Hilfe
- klarer Simulation-Abgrenzung
- Start ausgewählter Übung
- Button zum alten Trainingsmenü als Legacy-Fallback

Kategorien:
- Mathe verstehen
- Logik & Muster
- Konzentration
- Sprache & Wissen
- IT / FISI

## Runtime-Integration
Der Start einer Übung bleibt bewusst an die stabile App-Runtime angebunden:
- `App.chooseTrainingMode(mode)`
- `App.prepareTest()`

Damit wurden keine Generatoren oder Aufgabenlogiken verändert.

## Bewusst nicht verändert
- keine Generatoren
- keine SimulationEntry-/EGTSimulation-Runtime
- keine Highscore-Logik
- keine Coach-Memory-/Wissensbasislogik
- keine Admin-/Auth-/Firebase-Logik
- keine Session-Keys
- keine Demo-Limits

## Weiterer Verlauf
Nächster sinnvoller Schritt:
- Phase 5: Branchenspezifische Simulationen als eigene Module (`egt-sim-it.js`, `egt-sim-kaufm.js`, `egt-sim-sozial.js`)

Alternative:
- Phase 4B: Practice-Modul weiter ausbauen und die Aufgabenwahl/Generatorgrenze vom `app.js`-Monolithen lösen.
