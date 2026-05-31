# Schnellstart · BPS-Trainer + Python Quest Academy V10.5.1

Für die Python-Quest-Integration zuerst lesen:

- `PYTHON_QUEST_START_HERE.md`
- `docs/PYTHON_QUEST_INTEGRATION_GUIDE.md`
- `docs/PYTHON_QUEST_QA_CHECKLIST.md`
- `docs/PYTHON_QUEST_LEVEL_AUTHORING_GUIDE.md`

---

# BPS-Trainer V9.0.2 · Stable

Start:
1. `index.html` öffnen (direkt, kein Umweg über VERSION_CHECK nötig).
2. Für Systemprüfung: `index.html?healthcheck=1`

## Was neu ist in V9

### Bugs behoben
- **Cloud Highscore**: Doppelter Render-Loop (app.js + live-renderer + watchdog) beseitigt.
  Jetzt ein einziger Renderer (`highscore-live-renderer.js`) ohne Race Conditions.
- **WordHub overflow**: `overflow:hidden` auf `body` blockierte Quiz-Screens auf iOS.
  Jetzt isoliert über `#start:not(.quiz-active)` + `body.quiz-screen-active`.
- **Legacy-Key-Array**: 30 hardcodierte Store-Keys durch dynamischen Scan ersetzt.
- **Cache-Kill**: Kein Destroy-on-every-refresh mehr. Echter Service Worker mit Version-Busting.

### Cloud Highscore neu
- Eigener Highscore-Tab in der WordHub-Navigation.
- `sb_publishable_*`-Keys werden automatisch mit `Authorization: Bearer` Header gesendet.
- Race-Condition-Guard (`runId`): Stale Refreshes werden silently ignoriert.
- Lokaler Fallback bei Cloud-Fehler: zeigt eigene Ergebnisse.

### WordHub V9
- Quiz-Screen-Tracking: `body.quiz-screen-active` → kein Layout-Clash mehr.
- `#whNotice` am `document.body` (nicht im Shell) für korrekte z-index-Isolation.
- Highscore-Tab nativ integriert (kein separater App-Section-Wechsel nötig).

## Neue Features
- Neue Features als Module in `modules/` ergänzen (Contract unverändert).
