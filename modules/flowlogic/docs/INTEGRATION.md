# Integrationsanleitung · FlowLogic Standalone

## 1. Ziel

FlowLogic ist ab Phase 12 ein getrenntes Modul. Die Haupt-App soll das Modul nicht intern verändern, sondern nur laden, starten, stoppen und Ergebnisse entgegennehmen.

## 2. Kopieren

Kopiere den Ordner in dein Projekt, zum Beispiel:

```text
/public/modules/flowlogic/
```

Die Struktur bleibt unverändert:

```text
modules/flowlogic/
├── src/
├── docs/
├── tests/
├── flowlogic.manifest.json
└── README.md
```

## 3. Einbindung ohne Loader

```html
<link rel="stylesheet" href="/modules/flowlogic/src/flowlogic.css">
<script src="/modules/flowlogic/src/flowlogic.selftest.js"></script>
<script src="/modules/flowlogic/src/flowlogic.schema.js"></script>
<script src="/modules/flowlogic/src/flowlogic.scenarios.js"></script>
<script src="/modules/flowlogic/src/flowlogic.mutations.js"></script>
<script src="/modules/flowlogic/src/flowlogic.validator.js"></script>
<script src="/modules/flowlogic/src/flowlogic.renderer.js"></script>
<script src="/modules/flowlogic/src/flowlogic.input.js"></script>
<script src="/modules/flowlogic/src/flowlogic.scorer.js"></script>
<script src="/modules/flowlogic/src/flowlogic.generator.js"></script>
<script src="/modules/flowlogic/src/flowlogic.module.js"></script>
```

## 4. Einbindung mit Loader

```html
<script src="/modules/flowlogic/src/flowlogic.loader.js"></script>
<script>
  FlowLogicLoader.load({
    baseUrl: '/modules/flowlogic/src',
    context: {
      user: { id: 'demo-user' },
      role: 'participant'
    }
  }).then(({ module }) => {
    module.start({ mode: 'training' });
  });
</script>
```

## 5. Host-Vertrag

Die Haupt-App darf FlowLogic so verwenden:

```js
FlowLogicModule.init(context);
FlowLogicModule.mount(container, options);
FlowLogicModule.start(options);
FlowLogicModule.destroy();
FlowLogicModule.status();
FlowLogicModule.selfCheck();
```

Die Haupt-App soll **nicht** direkt in interne Szenario-, Mutations- oder Renderer-Daten schreiben.

## 6. Ergebnisübergabe später

Für die spätere Haupt-App-Integration sollte ein Adapter verwendet werden:

```js
FlowLogicModule.init({
  storageAdapter: {
    saveResult(result) {
      // Ergebnis in Profil, Firebase, IndexedDB oder Host-App speichern
    }
  },
  authAdapter: {
    getCurrentUser() {
      return { id: 'user-id', role: 'participant' };
    }
  }
});
```

Der harte Modulzustand bleibt dabei im FlowLogic-Modul. Die Host-App bekommt nur Ergebnisdaten.

## 7. Qualitätsprüfung nach Integration

Nach dem Einbau immer ausführen:

```js
FlowLogicSelfTest.runAll()
FlowLogicGenerator.generateBatch({ amount: 100, seed: 'integration-check' })
FlowLogicModule.selfCheck()
```

Ein Release ist erst sinnvoll, wenn diese Prüfungen ohne Fehler durchlaufen.
