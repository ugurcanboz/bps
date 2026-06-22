# Phase 41 – GitHub Pages Deploy Check

## Ziel

Diese Phase prüft, ob der Golden-Master-Stand `G54.40` sauber als GitHub-Pages-Version ausgeliefert werden kann. Der Schwerpunkt liegt nicht auf neuen Features, sondern auf Deploy-Sicherheit, Cache-Konsistenz und echten Gerätechecks.

## Durchgeführte Korrekturen

- `manifest.json` war noch auf `G54.39F` gesetzt und wurde auf `G54.41` aktualisiert.
- `app-config.js` wurde von `G54.40` auf `G54.41` angehoben.
- `update-check.json` wurde auf `G54.41-2026-06-20` aktualisiert.
- `service-worker.js` nutzt nun den neuen Cache `egt-trainer-g54-41`.
- Phase-41-Testseite und Deploy-Readiness-Skript wurden ergänzt.

## GitHub-Pages-Prüfpunkte

### Pfade

Alle kritischen PWA-Pfade verwenden relative `./`-Pfade. Das ist wichtig, weil GitHub Pages häufig unter einem Repository-Unterpfad läuft.

### Cache

Der Service Worker hat einen neuen Cache-Namen. Dadurch wird verhindert, dass Geräte nach dem Deploy weiterhin alte CSS- oder JS-Dateien aus Phase 39/40 verwenden.

### Manifest

Manifest-Version, Start-URL, Scope und App-ID sind deployfreundlich gesetzt.

### 404-Fallback

`404.html` ist vorhanden. Das ist wichtig für GitHub Pages, wenn Nutzer direkt auf Unterseiten oder PWA-Routen landen.

### Echte Gerätetests

Nach Upload auf GitHub Pages bitte testen:

1. iPhone Safari: Seite öffnen, neu laden, Scroll prüfen, Home-Screen-PWA öffnen.
2. iPad Safari: Gate, Dashboard, Deep-Sheet und Footer prüfen.
3. Desktop Chrome/Edge: DevTools Application Tab prüfen, Service Worker aktivieren, Cache löschen, neu laden.
4. Update-Test: alte Version öffnen, dann neue Version deployen, anschließend Hard Reload und PWA-Neustart prüfen.

## Ergebnis

Static Deploy Readiness: `passed=true`

Checks: `17/17` bestanden.

## Nächster sinnvoller Schritt

Phase 42 sollte kein weiterer Blind-Ausbau sein, sondern ein echter Live-Deploy-Test nach GitHub Pages mit Screenshots von iPhone, iPad und Desktop.
