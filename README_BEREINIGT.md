# Novura G54.47.15H

Vollständiger bereinigter Projektstand einschließlich Security-Phasen G54.47.15A bis G54.47.15H.

## Start
Die App über HTTPS oder einen lokalen HTTP-Server öffnen. `file://` unterstützt Service Worker und PWA-Funktionen nicht vollständig.

## Zentrale Prüfung
```bash
node tools/release-gate.mjs
```

Das Release-Gate führt alle lokalen QA-Suiten, die Worker-Tests und den Secret-Scan aus und schreibt den maschinenlesbaren Bericht nach `release/G54.47.15H_RELEASE_GATE.json`.

## Backup
```bash
node tools/release-backup.mjs
```

Für ein produktives vollständiges Backup muss zusätzlich ein echter Firebase-Export übergeben werden.

## Status
App-Version: G54.47.15H
Lokale Freigabe ist nur gültig, wenn das Release-Gate `LOCALLY_APPROVED` meldet. Live-Infrastruktur und reale Geräte benötigen einen gesonderten Nachweis.
