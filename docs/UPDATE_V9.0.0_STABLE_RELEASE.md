# V9.0.0 · Stable Release

## Bug Fixes

### Cloud Highscore (kritisch)
- Konflikt zwischen `installHighscoreRendererV840()` in app.js, `highscore-live-renderer.js` und 
  dem `highscoreRenderWatchdogV841`-Interval beseitigt.
- Neuer Renderer ist der einzige Owner von `#cloudHighscoreCard`.
- runId-Guard: Stale async-Refreshes werden ignoriert, kein DOM-Flackern mehr.
- `sb_publishable_*`-Keys senden automatisch `Authorization: Bearer` Header.
- Lokaler Fallback zeigt eigene Ergebnisse wenn Supabase nicht erreichbar.

### WordHub UI (kritisch)
- `overflow:hidden` auf `body/html` blockierte Quiz-Screens auf iOS → behoben.
- Quiz-Screens nutzen jetzt `position:fixed` statt absolute in overflow-Container.
- `body.quiz-screen-active` Class steuert Layout-Modus.
- `#whNotice` Toast am `document.body` für korrekte z-index-Isolation.

### Service Worker
- Kill-everything-on-every-refresh entfernt.
- Echter Cache-First SW mit `bps-trainer-v9-0-0` Cache-Name.
- Alter Cache wird bei neuer Version automatisch ersetzt.

### Version Consistency  
- Alle Core-Files auf 9.0.0 aktualisiert.
- `AppConfig.__version` entspricht tatsächlicher App-Version.

## Neue Features
- **Highscore-Tab** in WordHub-Navigation: Cloud Ranking direkt im Hauptscreen.
- **Auto-Detect** für `sb_publishable_*` und `eyJ*` (JWT) Supabase Keys.
- **Dynamischer Legacy-Key-Scan**: kein hardcodierter 30-Einträge-Array mehr.

## Nicht verändert
- `js/app.js`: Kern-Quizlogik, Modi, Generatoren – komplett erhalten.
- `data/question-bank.js`: Aufgabenbank unverändert.
- `css/app.css`, `css/mobile.css`, `css/ui-lock.css`, `css/clean-deepsheet.css`: unverändert.
- Alle Assets (Bilder, Icons): unverändert.
