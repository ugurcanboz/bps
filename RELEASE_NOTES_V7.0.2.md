# Eignungstest-Trainer V7.0.2 Clean Stable

Status: bereinigte stabile Version auf Basis der hochgeladenen V6.2.0/V7.0.1 Mobile-Shell.

## Bereinigt
- Versionierung vereinheitlicht auf V7.0.2.
- Cache-Namen, Manifest-Links, Service-Worker-Assets und App-Metadaten synchronisiert.
- Stale V7.0.1-Berichte entfernt und durch aktuelle V7.0.2-Dokumente ersetzt.
- PWA-Installationscache robuster gemacht: fehlende Einzelassets blockieren nicht mehr den kompletten Installationsschritt.
- Unversionierte `index.html` zusätzlich in den Offline-Cache aufgenommen, damit Fallbacks zuverlässiger greifen.
- EDV-Multi-Choice, Route-Memory, Visual-IQ, Prüfungsmodus, Analyse, Highscore und IndexedDB bleiben erhalten.

## Stabilitätsziel
Diese Version ist als sauberer Weiterarbeitsstand gedacht: keine neuen Feature-Experimente, sondern konsistente Basis für die nächsten UI-Schritte.

## Wichtig
Cloud-Highscore bleibt vorbereitet/aktiv über `data/cloud-config.js`. Wenn Supabase nicht korrekt konfiguriert ist, fällt die App weiterhin lokal nutzbar zurück.
