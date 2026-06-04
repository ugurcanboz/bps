# Phase 2 – Stabilitäts-Härtung

Abgeschlossen auf Basis der Phase-1-Clean-Release-Datei.

## Gehärtete Kernflows

- Admin-PIN wird nicht mehr als reine Base64-Darstellung gespeichert; neue PINs werden mit Salt + SHA-256 abgelegt.
- Bestehende lokale Alt-PINs bleiben migrationsfähig.
- Teilnehmer-Erstellung nutzt weiterhin automatisch die nächste freie ID im Format `2026-GK-A001`.
- Anonym-Logik wurde korrigiert: Wenn „anonym bleiben“ aktiv ist, bleibt der Teilnehmer unabhängig vom optionalen Namensfeld anonym.
- Erstpasswort wird zufällig generiert und nur einmal angezeigt.
- Teilnehmer-Passwörter werden mit Salt + Hash gespeichert.
- Login erzwingt bei Einmalpasswort den Passwortwechsel, bevor Trainingsfortschritt gespeichert wird.
- Neues Passwort benötigt mindestens 8 Zeichen sowie Buchstaben und Zahl.
- Passwort vergessen bleibt bewusst simpel: Admin kontaktieren, Admin setzt Einmalpasswort zurück.
- PWA-Lokalmodus ist stabilisiert; Online-Sync ist bewusst deaktiviert, bis Backend-Regeln final geprüft sind.

## Geprüft

- ZIP-Struktur bleibt Root-fähig mit `index.html`.
- Service-Worker verweist nur auf vorhandene Dateien.
- Alle JavaScript-Dateien bestehen Syntaxprüfung.
- Manifest bleibt auf `Eignungstest-Trainer`.
- Aufgabenbank wurde nicht verändert.
