# FlowLogic Standalone · Ablaufplan-Detektiv

Dieses Paket enthält **nur** das eigenständige Modul **Ablaufplan-Detektiv**. Es enthält keine Haupt-App-Dateien, keine Admin-Portal-Dateien, keinen Service Worker und keine bestehende Aufgabenbank.

## Inhalt

- eigener Szenario-Motor
- 10 Master-Szenarien
- 275 geprüfte Fehlerkandidaten
- Generator V2 mit Seed, Layout-Variation und Begriffsvariation
- Verteilungs-Validator
- SVG-Renderer
- strukturierte Fehlereingabe
- deterministische Scoring-Engine
- SelfTest-System
- optionale Loader-Datei für Host-Apps
- Integrationsdokumentation

## Nicht enthalten

- keine `index.html` der Haupt-App
- kein `admin-portal.html`
- kein `service-worker.js`
- keine `css/app.css`
- keine alte `app.js`
- keine bestehende Aufgabenbank
- keine App-Assets

## Schnelltest im Browser

Öffne:

```text
tests/flowlogic.standalone-test.html
```

Dann in der Konsole:

```js
FlowLogicSelfTest.runAll()
FlowLogicGenerator.generateBatch({ amount: 20, seed: 'manual-test' })
FlowLogicModule.start()
```

## Empfohlene Lade-Reihenfolge

```html
<link rel="stylesheet" href="src/flowlogic.css">
<script src="src/flowlogic.selftest.js"></script>
<script src="src/flowlogic.schema.js"></script>
<script src="src/flowlogic.scenarios.js"></script>
<script src="src/flowlogic.mutations.js"></script>
<script src="src/flowlogic.validator.js"></script>
<script src="src/flowlogic.renderer.js"></script>
<script src="src/flowlogic.input.js"></script>
<script src="src/flowlogic.scorer.js"></script>
<script src="src/flowlogic.generator.js"></script>
<script src="src/flowlogic.module.js"></script>
```

Optional kannst du stattdessen den Loader nutzen:

```html
<script src="src/flowlogic.loader.js"></script>
<script>
  FlowLogicLoader.load({ baseUrl: './src' }).then(() => {
    FlowLogicModule.start();
  });
</script>
```
