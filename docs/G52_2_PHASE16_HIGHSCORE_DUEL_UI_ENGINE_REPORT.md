# G52.2 / Phase 16 — Highscore-/Duell-UI Engine

## Ziel

Phase 16 trennt die Highscore-/Duell-UI fachlich weiter aus `js/app.js` heraus. Die App soll dadurch modularer werden, ohne die empfindliche Duell-Runtime, Online-Polling-Logik, Supabase-/Adminportal-Anbindung oder den Quiz-Lifecycle riskant zu verschieben.

## Neue Datei

```txt
js/core/highscore-duel-ui-engine.js
```

Das Modul stellt `window.EGTHighscoreDuelUIEngine.create(...)` bereit und erzeugt daraus die Runtime-Instanz `HighscoreDuelUIEngine`.

## Ausgelagerte Verantwortungen

- Duell-Avatar-HTML
- Duell-Zeitformatierung
- Gewinnerlogik für Duell-Vergleich
- Duell-Setup-HTML inklusive Online-/Lokal-Tabs
- Duell-History-HTML
- Duell-Vergleichs-HTML
- HighscoreData-Adapter für Home-/Sheet-Renderer

## Bewusst noch nicht ausgelagert

Folgende Bereiche bleiben in `js/app.js`, weil sie Runtime-Zustand und bestehende Online-Logik direkt berühren:

- Duell-State (`state.duel`)
- Online-Duell erstellen / beitreten / pollen
- Quizstart und Quiz-Lifecycle
- Ergebnisübertragung über `EGTAdminPortal`
- Timer, Route-Timer und Ergebnisfinalisierung

Diese Trennung ist absichtlich konservativ: Phase 16 schafft die UI-Grenze, ohne den funktionierenden Ablauf zu riskieren.

## Integration in app.js

`app.js` erzeugt jetzt:

```txt
HighscoreDuelUIEngine = window.EGTHighscoreDuelUIEngine.create(...)
```

und delegiert folgende bisherige Inline-UI-Funktionen an das neue Modul:

```txt
duellAvatarHtml
duellFmtTime
duellWinnerOf
renderDuellComparison
openDuellSetup
highscoreData
```

Die Instanz ist zusätzlich verfügbar über:

```txt
window.HighscoreDuelUIEngine
App._test.HighscoreDuelUIEngine
```

## Versionierung / Cache

- App-Version: `G52.2`
- Cache: `egt-trainer-g52-2`
- Manifest / Update-Check / Service Worker wurden aktualisiert.
- `js/core/highscore-duel-ui-engine.js` wurde in `index.html`, `service-worker.js` und `module-manifest.json` ergänzt.

## QA

Bestanden:

```txt
node --check js/core/highscore-duel-ui-engine.js
node --check js/app.js
node --check js/modules/egt-highscore-entry-module.js
node --check js/modules/egt-duel-entry-module.js
node --check js/core/cloud-highscore-engine.js
node --check js/core/highscore-dashboard-engine.js
JSON-Validierung
Service-Worker-Assetprüfung
ZIP-Integrität
Chromium-Smoke-Test Desktop/iPhone/iPad-Hochformat
```

Smoke-Test bestätigt:

```txt
AppConfig.version = G52.2
EGTHighscoreDuelUIEngine vorhanden
window.HighscoreDuelUIEngine vorhanden
App._test.HighscoreDuelUIEngine vorhanden
App.highscoreData().__source = G52.2-phase16
Duell-Setup rendert mit data-ui-engine=highscore-duel-ui
Horizontaler Overflow = 0
```

## Nächster sinnvoller Schritt

Phase 17 sollte entweder den Duell-Runtime-/Control-Flow weiter abgrenzen oder das Highscore-/Duell-Sheet-Routing stärker aus `app.js` und `ui-home-renderer.js` herauslösen.
