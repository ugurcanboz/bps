# API · FlowLogic Standalone

## Öffentliche Objekte

```js
FlowLogicSelfTest
FlowLogicSchema
FlowLogicScenarios
FlowLogicMutations
FlowLogicValidator
FlowLogicRenderer
FlowLogicInput
FlowLogicScorer
FlowLogicGenerator
FlowLogicModule
FlowLogicLoader
```

## FlowLogicModule

### `init(context)`
Initialisiert das Modul optional mit Host-Kontext.

### `mount(container, options)`
Rendert das Modul in einen bestehenden Container.

### `start(options)`
Öffnet das Modul als eigenes Overlay.

### `destroy()`
Schließt aktives Overlay und räumt DOM-Reste auf.

### `status()`
Gibt Modulstatus, Version, aktive Features und Anzahl Szenarien/Kandidaten zurück.

### `selfCheck()`
Prüft, ob alle Haupt-APIs geladen sind.

### `getManifest()`
Gibt den Modulvertrag zurück.

## Generator

```js
FlowLogicGenerator.createTask({
  scenarioId: 'flow_master_postbote_nachnahme',
  seed: 'demo-seed',
  difficulty: 'ctc'
});
```

Batch-Test:

```js
FlowLogicGenerator.generateBatch({
  amount: 100,
  seed: 'qa-batch',
  difficulty: 'ctc'
});
```

## Scoring

```js
const generated = FlowLogicGenerator.createTask({ seed: 'score-test' });
const score = FlowLogicScorer.scoreModelSolution(generated.task);
```

Musterlösung muss im CTC-Modus immer `11/11` ergeben.

## SelfTest

```js
FlowLogicSelfTest.runAll();
```
