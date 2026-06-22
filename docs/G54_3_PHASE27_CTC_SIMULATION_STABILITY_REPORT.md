# G54.3 · Phase 27 · CTC-/Simulation-Stability Hardening

## Ziel
Stabilisierung der CTC-Lohr Simulation nach G54.2.

## Fixes
- CTC QA-/Scope-Engine ergänzt: `js/core/ctc-simulation-stability-engine.js`.
- Allgemeinwissen-Zeit exakt auf 40 Fragen / 420 Sekunden korrigiert: 20×11s + 20×10s.
- CTC-Gesamtzeit bleibt exakt 1978 Sekunden = 32:58 Minuten.
- Regelrechnung wird als Inline-Slash geprüft: kein Bruchstrich, kein Multiple Choice, Eingabe.
- FlowLogic bleibt Finalblock mit 13 Minuten.
- Negative Scope-Matrix blockiert BPS, Training, Sozialpädagogik, Kaufmännisch und Einzeltraining.

## QA
- JS-Syntaxchecks bestanden.
- JSON-Validierung bestanden.
- Service-Worker-Assetprüfung bestanden.
- CTC-Stability-Engine `validate()` bestanden.
- Statisches Visual-QA-HTML für Desktop/iPad/iPhone erstellt.
