# Release Notes V5.1.2 Version Clean Stable

Ziel: sichtbare Altversionen entfernen, Cache konsequent erneuern und Cloud-Diagnose sichtbar halten.

- Alle sichtbaren V3/V4/V5.1.1-Reste auf V5.1.2 aktualisiert.
- App-Version, Framework-Pills, PWA-Panel, Manifest und Service Worker vereinheitlicht.
- CSS/JS/Data/Manifest werden mit Cache-Buster `?v=5.1.2` geladen.
- Service Worker nutzt für kritische Dateien Network-First mit `cache: no-store`.
- Alter Cache wird beim Aktivieren gelöscht.
- Supabase/Cloud-Diagnose bleibt im Systemstatus sichtbar.

Hinweis: Wenn ein Gerät noch Altversion zeigt, läuft dort definitiv alter PWA/Safari-Cache oder eine alte Datei. Cache zurücksetzen oder PWA neu installieren.
