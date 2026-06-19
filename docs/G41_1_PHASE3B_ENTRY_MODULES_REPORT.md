# G41.1 — Phase 3B Entry-Module Arbeitsnachweis

## Ziel
Home, SimulationEntry und PracticeEntry als echte Module vorbereiten und über `AppModuleHost.register(...)` registrieren, ohne die bestehende App-Logik, Generatoren, Highscore, Coach oder Ergebnislogik umzubauen.

## Geänderte/neu erstellte Dateien

### Neu
- `js/modules/egt-home-module.js`
- `js/modules/egt-simulation-entry-module.js`
- `js/modules/egt-practice-entry-module.js`
- `docs/G41_1_PHASE3B_ENTRY_MODULES_REPORT.md`
- `docs/G41_1_PHASE3B_ENTRY_MODULES_QA.json`
- `WORKING-PLAN_1.md` als zusätzliche Root-Kopie des zentralen Working Plans für Multi-KI-Übergaben

### Geändert
- `index.html`
- `js/ui-router.js`
- `js/core/module-host.js`
- `js/core/architecture-guard.js`
- `js/core/app-config.js`
- `service-worker.js`
- `manifest.json`
- `update-check.json`
- `module-manifest.json`
- `docs/WORKING-PLAN.md`

## Umsetzung im Detail

### 1. Home-Modul
`js/modules/egt-home-module.js` registriert das Modul `home` beim `AppModuleHost`.

Startverhalten:
- bevorzugt `App.setAppSection('home')`
- Fallback über `EGTUILayer.switchTab('home')`
- danach ggf. `EGTUILayer.refresh()`

Global:
- `window.EGTHomeModule`

### 2. SimulationEntry-Modul
`js/modules/egt-simulation-entry-module.js` registriert `simulation-entry`.

Startverhalten:
- ohne Direktstart: öffnet das bestehende Simulation-Deep-Sheet über `EGTUILayer.openSheet(...)`
- mit Direktstart: startet kontrolliert über `AppModuleHost.startSimulation(...)`

Global:
- `window.EGTSimulationEntryModule`

Bewusst nicht verschoben:
- `App.prepareTest()`
- `App.startQuiz()`
- `buildQuiz()`
- Generatoren
- Result-/Highscore-/Coach-Logik

### 3. PracticeEntry-Modul
`js/modules/egt-practice-entry-module.js` registriert `practice-entry`.

Startverhalten:
- öffnet Practice/Learn über `EGTUILayer.openPracticeMode(...)`
- Fallback über `EGTUILayer.openActionMenu(...)`
- letzter Fallback `App.setAppSection('practice')`

Global:
- `window.EGTPracticeEntryModule`

### 4. Script-Ladereihenfolge
`index.html` lädt die drei neuen Entry-Module direkt nach:

```html
<script src="./js/core/module-host.js"></script>
```

und vor `app.js`. Dadurch ist die Registrierung früh verfügbar.

### 5. Router-Integration
`js/ui-router.js` wurde angepasst:

- `practice` und `learn` versuchen zuerst `AppModuleHost.startModule('practice-entry', ...)`.
- Simulation-Direktstart versucht zuerst `AppModuleHost.startModule('simulation-entry', { direct: true })`.
- Simulation ohne Direktstart versucht zuerst `AppModuleHost.startModule('simulation-entry', ...)`.
- Legacy-Fallbacks bleiben erhalten.

### 6. Manifest / Guard / Cache
- `module-manifest.json` dokumentiert `registeredEntryModules` und `phase3b`.
- `architecture-guard.js` prüft die drei neuen Dateien als Kern-Dateien.
- `service-worker.js` cached die drei neuen Moduldateien.
- Version wurde auf `G41.1` synchronisiert.

## Bewusste Grenze
Phase 3B ist eine Entry-/Lifecycle-Phase. Es wurde kein Fachmodul und keine Quiz-Erzeugung ausgelagert. Das ist Absicht, damit Shell und ModuleHost zuerst stabil bleiben.

## Nächster Schritt
Phase 3C sollte weitere UI-Türen konsequent über `AppModuleHost.startModule(...)` führen und Admin/Profile als eigene Entry-Grenzen vorbereiten.
