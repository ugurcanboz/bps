# G37.6 Intro-Video (Sperrbildschirm)

## Neu
Filmischer Start-/Sperrbildschirm als durchlaufende Motion-Graphics-Sequenz (kein Seiten-Swipen).
Erscheint beim Start, solange keine aktive Session besteht.

Szenen (eine Timeline, ~24 s, konfigurierbar): Logo zeichnet sich → Bereiche-Netzwerk →
Prüfungssimulation mit tickendem Timer → KI-Coach mit Fortschrittsring → Highscore mit
hochzählendem Punktezähler → Finale „Bereit?" mit CTA-Kacheln. Durchgehender Fortschrittsbalken,
Überspringen, Pause (Tippen), Replay.

## Dateien / Einbindung
- `css/cinematic.css` (gescopt unter `.egt-cine`, erbt App-Tokens)
- `js/modules/cinematic-intro.js` (klassisches Script, `window.EGTCinematicIntro.mount`)
- `index.html`: CSS-Link + Script + Boot-Block. Der Boot-Block zeigt das Intro nur, wenn
  `EGTAuthProfileShell.currentSession()` keine Session liefert und es in dieser Browser-Sitzung
  noch nicht gezeigt wurde (`sessionStorage`).
- Service Worker: beide Dateien in der Precache-Liste, `CACHE_NAME` = `bps-trainer-g376-intro-video`.

## Andockung an Auth
Die Kacheln tragen die vorhandenen `data-ui-action` (`auth-demo-start`, `auth-redeem-code`,
`auth-login`) und werden vom bestehenden `ui-router.js` verarbeitet – keine neue Logik. Zusätzlich
feuert die Auswahl ein `egt-start-select`-Event; danach schließt sich das Intro.

## Geprüft (Headless-Browser, ohne Netzwerk)
- App bootet, `AppConfig.version` = G37.6, keine JS-Fehler.
- Intro erscheint beim Start (5 Szenen, 4 Kacheln), rendert im App-Theme.
- Überspringen → Finale; „Demo starten" feuert `auth-demo-start`, Intro schließt, App darunter intakt.
