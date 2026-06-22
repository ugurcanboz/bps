# Phase 39E – Full App Smoke Test mit QA-Bypass

## Ziel
Die App systematisch testbar machen, ohne dass der Sperrbildschirm/Gate die Smoke Tests blockiert. Der QA-Bypass ist nur lokal oder per Query-Parameter aktiv und ersetzt keine echte Rollen-/Zugangscode-Logik.

## QA-Bypass
Aktivierung:
- `index.html?qa=1`
- `index.html?qaBypass=1`
- oder `localStorage.setItem('egt_qa_bypass_v1','1')`

Der Bypass erzeugt lokal eine Admin-QA-Session:
- Rolle: `admin`
- Quelle: `phase39e-qa-bypass`
- Code: `QA-BYPASS-39E`

## Umgesetzt
- `egt-auth-engine.js` erkennt QA-Bypass und meldet `gateStatus().open === true`.
- `egt-gate-enforce.js` lässt Aktionen/Tabs im QA-Modus durch.
- `qa-smoke-runner.js` ergänzt:
  - aktiviert QA-Bypass
  - prüft Hauptaktionen
  - prüft wichtige Tabs
  - prüft Gate-Blockade
  - prüft Touch-Flächen unter 44px
  - prüft horizontalen Overflow
- `tests_phase39e_full_app_smoke.html` ergänzt:
  - lädt App im Iframe mit `?qa=1`
  - startet Smoke Runner
  - zeigt Ergebnis tabellarisch und als JSON

## Geänderte Dateien
- `js/modules/egt-auth-engine.js`
- `js/modules/egt-gate-enforce.js`
- `js/qa-smoke-runner.js`
- `index.html`
- `js/core/app-config.js`
- `service-worker.js`
- `update-check.json`
- `manifest.json`
- `WORKING-PLAN_1.md`

## Neue QA-Dateien
- `tests_phase39e_full_app_smoke.html`
- `js/qa-smoke-runner.js`
- `phase39e_static_qa.py`
- `phase39e_static_qa_result.json`

## QA Ergebnis
- JS Syntaxcheck: bestanden
- JSON Check: bestanden
- Service Worker Asset Check: bestanden
- Phase-39E-Static-QA: bestanden
- ZIP Check: bestanden

## Hinweis
Der Chromium-Headless-Test in der Container-Umgebung bleibt durch den bekannten Crashpad-Fehler blockiert. Darum ist die Testseite browserintern gebaut und kann direkt auf GitHub Pages/iPad/iPhone/Desktop geöffnet werden.
