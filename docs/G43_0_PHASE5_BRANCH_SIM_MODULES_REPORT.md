# G43.0 · Phase 5 · Branchenspezifische Simulationsmodule

## Ziel
Die Simulation soll fachlich nicht mehr nur als generischer Einstieg laufen, sondern für die wichtigsten Fachrichtungen eigene Module besitzen. Diese Module sollen sauber über `AppModuleHost.register(...)` registriert werden und später eigene Pools/Generatorgrenzen bekommen können.

## Umgesetzt

### Neue Moduldateien
- `js/modules/egt-sim-it.js`
- `js/modules/egt-sim-kaufm.js`
- `js/modules/egt-sim-sozial.js`

### Neue registrierte Module
- `sim-it`
- `sim-kaufm`
- `sim-sozial`

### Modulverhalten
Jedes Branch-Simulationsmodul:
- kennt seine feste Branch-ID,
- setzt den Branch-Kontext über `AppModuleHost.setBranch(...)`,
- baut eine eigene Start-Konfiguration,
- startet danach kontrolliert über `AppModuleHost.startSimulation(...)`,
- besitzt `start(...)`, `stop(...)`, `buildConfig(...)` und `bankStats(...)`,
- meldet Events über `document.dispatchEvent(...)` und `AppEvents.emit(...)`,
- bleibt fachlich ein Adapter; Generatoren und Ergebnislogik wurden nicht verändert.

### Routing/Integration
- `index.html` lädt die drei neuen Branch-Simulationsmodule direkt nach `egt-simulation-entry-module.js`.
- `js/ui-router.js` leitet `data-ui-action="start-branch-simulation"` zuerst auf `sim-it`, `sim-kaufm` oder `sim-sozial`.
- `js/ui-home-renderer.js` nutzt beim Start von Branch-Simulationen ebenfalls zuerst die neuen Branch-Module.
- `js/modules/egt-simulation-entry-module.js` delegiert bei direktem Start an das passende Branch-Modul, wenn verfügbar.
- `js/core/module-host.js` kennt für IT, Kaufmännisch und Sozialpädagogik jetzt `moduleId` (`sim-it`, `sim-kaufm`, `sim-sozial`).

### Version/Cache/Manifest
- Version auf `G43.0` gesetzt.
- `node sync-version.js` ausgeführt.
- `service-worker.js` cachet die drei neuen Moduldateien.
- `module-manifest.json` um Phase-5-Dokumentation ergänzt.
- `architecture-guard.js` prüft die drei neuen Moduldateien.

## Bewusste Grenze
Nicht verändert wurden:
- `buildQuiz(...)`
- `Generators`
- `QUESTION_BANK_EXTERNAL`-Auswahl
- Result-/Review-Logik
- Highscore/Cloud-Sync
- Coach-Auswertung
- Admin/Auth/Firebase/Demo-Limits/Session-Keys

Die Module sind jetzt eigene Türen und Konfigurationsgrenzen. Der nächste logische Schritt wäre, die fachliche Pool-/Generator-Auswahl aus `app.js` in einen eigenen Branch-QuestionPool-Resolver auszulagern.

## Tests
- JS-Syntaxcheck: bestanden
- JSON-Validierung: bestanden
- Service-Worker-Assetprüfung: bestanden
- ZIP-Test: bestanden

## Nächster empfohlener Schritt
Phase 6: Branch-QuestionPool-/Generator-Grenze sauber definieren, damit IT, Kaufmännisch und Sozialpädagogik nicht nur eigene Startmodule, sondern auch eigene fachliche Aufgabenpool-Regeln bekommen.
