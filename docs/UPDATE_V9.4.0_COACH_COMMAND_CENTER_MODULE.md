# Update V9.4.0 – Coach Command Center Module

Dieses Update erweitert ausschließlich das KI-Coach-Modul. Die Haupt-App-Architektur bleibt unverändert.

## Neu

- Coach Command Center im Coach-Deep-Sheet
- Dashboard-Toggle im Sheet-Header
- BPS-Readiness-Score
- CTC-Readiness-Score
- Confidence-Wert für Datenlage
- Daily Tracking pro Kalendertag
- Premium-Trainingsmodi:
  - 5-Min Fokus
  - Fehler-Revanche
  - BPS Sprint
  - CTC Hard
  - Daily Challenge
- Session-Dramaturgie: Einstieg → Transfer/Revanche → Challenge → Erfolgssicherung
- erweitertes Dopamin-Feedback
- Fehler-DNA-Signale im Command Center
- lokale Speicherung über bestehendes Coach-Memory

## Modul-Dateien

- `js/learning-coach-engine.js`
- `js/learning-coach-ui.js`
- `css/learning-coach.css`

## Tests

- `node --check js/learning-coach-engine.js`
- `node --check js/learning-coach-ui.js`
- `node scratch/test-coach-v2-1-db.js`
- `node scratch/test-coach-v9-4-command.js`

## Stand

Das Coach-Modul ist weiterhin offline-first, lokal und modular gehalten. Integration in die App erfolgt später über die bereits bestehenden Hooks.
