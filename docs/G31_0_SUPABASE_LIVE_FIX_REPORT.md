# G31.0 Supabase Live Stability Fix Report

## Ziel
Supabase Highscore ist die priorisierte Datenquelle. Ranking wird beim Laden sofort gelesen und danach automatisch alle 20 Sekunden aktualisiert.

## Geänderte Kernbereiche

### 1. Supabase-Konfiguration
Datei: `data/cloud-config.js`
- `enabled: true`
- `provider: "supabase"`
- `refreshIntervalMs: 20000`
- Leere URL/Key bleiben bewusst leer, damit keine Fake-Zugangsdaten ausgeliefert werden.
- Bei fehlender Config zeigt die App sichtbar Setup-Hinweise.

### 2. CloudHighscoreEngine
Datei: `js/app.js`
- App-Version auf `G31.0-SUPABASE-LIVE-STABILITY-2026-06-08` gesetzt.
- Supabase ist Default-Priorität.
- `refreshDashboard(reason)` zeigt klare Zustände:
  - Setup nötig
  - Supabase lädt
  - Supabase live
  - Supabase Verbindungsfehler mit lokalem Sicherheitsfallback
- Kein stilles Hängenbleiben mehr.
- Laufende Requests werden gegen Doppelstarts geschützt.

### 3. Konkurrierenden Renderer entfernt
Datei: `js/app.js`
- Der alte spätere `Highscore Renderer Rewrite` wurde entfernt.
- Dieser Block hatte `CloudHighscoreEngine.renderShell` und `refreshDashboard` überschrieben.
- Stattdessen gibt es jetzt nur noch einen Live-Refresh-Controller.

### 4. Automatischer Live-Refresh
Datei: `js/app.js`
- Refresh beim Laden.
- Zweiter Refresh kurz danach.
- Refresh bei `pageshow`.
- Refresh bei `online`.
- Refresh bei sichtbarem Tab.
- Intervall alle 20 Sekunden, solange die Highscore-Karte existiert und der Tab sichtbar ist.

### 5. Update-System repariert
Datei: `index.html`
- `CURRENT` nutzt jetzt `window.TRAINER_BUILD_VERSION`.
- Vergleich nutzt `build/version/latest`, nicht mehr `release`.
- Dismiss-Key ist buildbezogen.

### 6. Versionierung bereinigt
Dateien:
- `index.html`
- `update-check.json`
- `service-worker.js`
- `js/core/app-config.js`
- `START_HERE.md`

Neuer Build:
`G31.0-SUPABASE-LIVE-STABILITY-2026-06-08`

### 7. Python-PDF-Totlinks entfernt
Dateien:
- `js/python-quest-module.js`
- `data/python-quest-db.js`

Nicht vorhandene PDF-Links wurden durch interne Lernblatt-/Lerninhalt-Aktionen ersetzt.

## QA Ergebnis
- JS Syntaxcheck: bestanden
- JSON Validierung: bestanden
- Service-Worker Asset-Check: bestanden
- Keine alten kritischen Muster gefunden
- Keine toten Python-PDF-Links mehr im Code
