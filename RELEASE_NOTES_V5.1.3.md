# Eignungstest-Trainer V5.1.3 Cloud Highscore Active

## Neu
- Cloud Highscore ist aktiv als echtes Supabase-Ranking eingebunden.
- Dashboard zeigt Ranglisten für Heute, Woche, Monat und Gesamt.
- Ranking wird live über `highscores.created_at` gefiltert.
- Ergebnisse werden nach Testende automatisch an Supabase gesendet.
- Lokale Highscores bleiben weiterhin als Fallback aktiv.

## Struktur
- Cloud-Logik bleibt im Engine-Bereich und nutzt bestehende Supabase-Konfiguration aus `data/cloud-config.js`.
- Keine Fake-Daten: Wenn Supabase leer ist, zeigt die App leere Rankings.
- V5.1.2-Daten werden als Legacy-Quelle in V5.1.3 übernommen.

## Wichtig
Die Supabase-Tabelle muss mindestens diese Spalten besitzen:
`player_name, class_code, device_id, mode, title, percent, score, total, duration, rank, app_version, created_at`.
