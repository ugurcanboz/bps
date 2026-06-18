# G41.0 · Phase 3A · Shell/ModuleHost-Vertrag & Branchen-Simulation

## Ziel
Phase 3 startet die saubere Architektur-Trennung aus Shell + ModuleHost + Module. Dieser Schritt baut noch keine vollständigen Fachmodule aus, sondern härtet zuerst den zentralen Vertrag und den kontrollierten Einstieg in die Simulation.

## Geänderte Dateien

### Neu
- `js/core/module-host.js`

### Geändert
- `index.html`
- `js/core/app-config.js`
- `js/core/architecture-guard.js`
- `js/app.js`
- `js/ui-router.js`
- `js/ui-home-renderer.js`
- `css/ui-foundation.css`
- `service-worker.js`
- `module-manifest.json`
- `manifest.json`
- `update-check.json`
- `WORKING-PLAN_1.md`
- `docs/WORKING-PLAN.md`

## Umsetzung

### 1. Neuer AppModuleHost
`js/core/module-host.js` stellt jetzt `window.AppModuleHost` bereit.

Öffentliche API:
- `register(definition)`
- `startModule(id, payload)`
- `stopActive(reason)`
- `setBranch(branch)`
- `getBranch(branch)`
- `listBranches()`
- `listModules()`
- `buildSimulationConfig(options)`
- `startSimulation(options)`
- `getStatus()`
- `on(event, fn)`

### 2. Branch-Kontext zentralisiert
Der ModuleHost kennt jetzt die Fachrichtungen:
- `it` → IT / FISI
- `kaufm` → Kaufmännisch / Verwaltung
- `sozial` → Sozialpädagogik
- `wissen` → Allgemeinwissen

Der Branch wird weiterhin kompatibel unter `bps_branch` gespeichert, aber nicht mehr nur verstreut im UI behandelt.

### 3. Branchenbasierter Simulationseinstieg
Zuordnung:
- IT/FISI → `ctcLohr`
- Kaufmännisch → `bps`
- Sozialpädagogik → `bps`
- Allgemeinwissen → `jogging`

`AppModuleHost.startSimulation(...)` setzt Branch und Modus, ruft dann kontrolliert `App.selectMode(mode)` und `App.prepareTest()` auf.

### 4. App-Core angebunden
`app.js:startQuiz()` fragt jetzt `AppModuleHost.buildSimulationConfig(...)` ab und gibt diese Informationen an `EGTSimulation.start(config)` weiter:
- `moduleHost`
- `branch`
- `branchLabel`

Wichtig: `buildQuiz()`, Generatoren, Result-Details, Highscore und Coach bleiben weiterhin in `app.js`.

### 5. UI-Router angebunden
`js/ui-router.js` versteht jetzt:
- `data-ui-action="start-branch-simulation"`

Damit können Deep-Sheet-Karten direkt eine branchenspezifische Simulation starten.

### 6. Home-Renderer erweitert
`js/ui-home-renderer.js` rendert beim Simulationsmodul jetzt Branch-Karten im bestehenden Deep-Sheet:
- IT/FISI
- Kaufmännisch
- Sozialpädagogik

Die bisherige App-Optik bleibt erhalten; es wurde kein neues Menüsystem erfunden.

### 7. Styling ergänzt
`css/ui-foundation.css` enthält neue Klassen:
- `.ui-branch-sim-grid`
- `.ui-branch-sim-card`
- Mobile-Fallback mit einspaltiger Darstellung

### 8. Architekturprüfung & Cache
- `architecture-guard.js` prüft jetzt `AppModuleHost`.
- `service-worker.js` cached `js/core/module-host.js`.

## Bewusste Grenzen
Nicht verschoben wurden:
- `buildQuiz()`
- Generatoren
- Result-Detailbereiche
- Highscore
- Coach-Sync
- Admin/Profile-Logik

Phase 3A ist bewusst ein Vertrags- und Einstiegsschnitt, kein kompletter Modul-Umzug.

## Nächster Schritt
Phase 3B sollte echte Moduldateien vorbereiten, z. B.:
- `js/modules/egt-home-module.js`
- `js/modules/egt-simulation-entry-module.js`
- `js/modules/egt-practice-entry-module.js`

Diese sollten über `AppModuleHost.register(...)` eingebunden werden.
