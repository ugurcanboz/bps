# G52.1 / Phase 15 — Cloud Highscore Engine

## Ziel

Die Cloud-/Supabase-Highscore-Logik wurde weiter aus `js/app.js` herausgelöst. Nach Phase 14 war die lokale Highscore-/Dashboard-Grenze bereits getrennt. Phase 15 schafft jetzt eine eigene Core-Grenze für Cloud-Ranking, Supabase-Requests, Cloud-Diagnose und Cloud-Fallback.

## Neue Datei

```txt
js/core/cloud-highscore-engine.js
```

## Geänderte Architektur

`app.js` erstellt `CloudHighscoreEngine` jetzt über:

```txt
window.EGTCloudHighscoreEngine.create(...)
```

Zusätzlich wird `window.CloudHighscoreEngine` gesetzt, damit Entry-Module wie Highscore/Duell/Result-Persistence dieselbe Instanz nutzen können.

## Erhaltene Fallback-Sicherheit

Falls `js/core/cloud-highscore-engine.js` nicht geladen wird, enthält `app.js` weiterhin einen Minimal-Fallback. Dadurch bleibt die App bedienbar und lokale Highscores bleiben verfügbar.

## Premium-Bridge bleibt kompatibel

`js/modules/highscore-engine.js` kann weiterhin als Premium-/Renderer-Upgrade in das Core-Objekt gemischt werden. Die bisherige Kundenlogik wird dadurch nicht hart ersetzt.

## Ergebnis

- Cloud-/Supabase-Logik ist nicht mehr als großer Inline-Block im Monolithen.
- `app.js` ist kleiner und klarer.
- CloudHighscoreEngine ist als eigenständige Fachgrenze prüfbar.
- Die globale Instanz ist für Module einheitlich verfügbar.

## Nächster sinnvoller Schritt

Phase 16 sollte das Highscore-/Duell-UI weiter als eigenständige Entry-/Feature-Module sauberer abgrenzen oder die Admin-/Dashboard-Navigation weiter modularisieren.
