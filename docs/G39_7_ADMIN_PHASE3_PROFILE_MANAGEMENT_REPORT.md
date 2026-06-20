# G39.7 Admin Phase 3 · Teilnehmerprofil-Verwaltung

## Ziel
Das Teilnehmerprofil ist nicht mehr nur Anzeige, sondern eine echte Verwaltungsfläche.

## Umgesetzt
- Profil-Bearbeitung direkt aus Phase-2-Teilnehmerliste
- Side-Sheet für Stammdaten
- Anzeigename/Nickname ändern
- Gruppe/Kurs-ID ändern
- Rolle ändern
- Status ändern: aktiv, inaktiv, gesperrt, archiviert
- interne Admin-Notiz speichern
- Verwarnung senden und archivieren
- Teilnehmer sperren/entsperren
- Versuche/Aktivitätsdaten zurücksetzen
- Teilnahmecode-Info und Verlängerung bleiben im Profil verfügbar
- Phase-2-Ansicht aktualisiert sich nach Änderungen

## Nicht angefasst
- Hauptnavigation
- Simulationen
- Login-/Registrierungslogik
- Fragebanken

## Hinweis
Für echte Cloud-Persistenz müssen Firebase-Konfiguration und Rules weiterhin korrekt aktiv sein. Lokal werden Änderungen im vorhandenen LocalStorage-Profilcache gespeichert.
