# G37.4 Supabase Live Repair Report

## Ziel
Highscore darf nicht mehr mit `ServerConfig fehlt` / `enabled=false` / `provider` / `supabaseUrl` / `anonKey` starten. Supabase soll wieder als aktive Cloud-Quelle für `public.highscores` genutzt werden.

## Geänderte Dateien

### `data/cloud-config.js`
- `enabled: true`
- `provider: "supabase"`
- Supabase URL gesetzt
- Public/Publishable Key gesetzt
- Tabelle: `highscores`
- `limit: 50`
- `refreshIntervalMs: 20000`

### `js/modules/highscore-engine.js`
- Highscore-Identität an `EGTAuthProfileShell.highscoreIdentity()` angebunden.
- `player_name` nutzt eingeloggten Nickname, falls vorhanden.
- `device_id` nutzt Profil-ID/Geräte-ID, falls vorhanden.
- `class_code` nutzt aktive Gruppe aus dem Profil, falls vorhanden, sonst `default`.
- Klassenranking zeigt nicht mehr stur `default`, wenn ein Profil mit Gruppe aktiv ist.

### Version / Cache
- Build auf `G37.4-SUPABASE-LIVE-REPAIR-2026-06-13` gesetzt.
- Service-Worker Cache auf `bps-trainer-g374-supabase-live-repair` gesetzt.
- `update-check.json` aktualisiert.

## Sicherheit
Es wurde ausschließlich der Public/Publishable Key im Frontend verwendet. Kein Service-Role-Key wurde eingebaut.

## QA
- JS Syntaxcheck bestanden:
  - `data/cloud-config.js`
  - `js/modules/highscore-engine.js`
  - `js/app.js`
  - `js/ui-home-renderer.js`
  - `js/core/app-config.js`
  - `service-worker.js`
- JSON Validierung bestanden:
  - `update-check.json`

## Hinweis
Live-Netzwerktest war in der Sandbox nicht möglich, weil DNS/Internet im Container blockiert war. Der Code ist konfiguriert; die reale Prüfung muss im Browser erfolgen.
