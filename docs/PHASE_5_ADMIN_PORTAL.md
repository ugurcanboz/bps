# Phase 5 – Admin Portal Pro

Status: technisch umgesetzt auf Basis der stabilen lokalen PWA.

## Enthalten

- Admin Portal im bestehenden Apple/Glass-Design
- Admin-PIN mit Salt + Hash
- Kursgruppensteuerung für automatische Teilnehmernummern
- automatische freie ID nach Schema `Jahr-Kurs-Reihe###`, z. B. `2026-GK-A001`
- Teilnehmer erstellen mit optionalem Namen oder anonymem Profil
- sicheres Einmalpasswort
- Pflicht-Passwortwechsel beim ersten Login
- Passwort-Reset über Admin
- Teilnehmerliste mit Status, Passwortstatus, Risiko, Quote und Modulfortschritt
- Aktivieren/Deaktivieren einzelner Teilnehmer
- Teilnehmer löschen mit Sicherheitsabfrage
- JSON-Export
- CSV-Export
- Kurs-Reset nur nach Eingabe von `RESET` und zusätzlicher Sicherheitsabfrage
- Kurs-Dashboard mit Teilnehmerzahl, aktiven Teilnehmern, Einmalpassworten, Durchschnittsquote und Risikoverteilung
- App & Roadmap nur im Admin-Bereich
- Systemstatus nur im Admin-Bereich

## Stabilitätsprinzip

Die App bleibt in dieser Version lokal/offline stabil. Externe Cloud-Sync-Systeme sind bewusst deaktiviert, damit die PWA ohne Fremdserver zuverlässig funktioniert.

## Coach-Kompatibilität

Alle Teilnehmerdaten laufen weiterhin über `userId`. Namen sind nur Anzeigeinformationen und ersetzen niemals die technische Nutzer-ID.

## Phase 5 Abschluss-Härtung
- App & Roadmap/Systemstatus wird nur nach entsperrter Admin-PIN angezeigt.
- Alter `bps_logged_in`-Bypass wurde entfernt.
- Externe Cloud-Renderer/Shims wurden aus dem Hauptstart entfernt, damit die lokale Stable-PWA nicht versehentlich externe Ranking-/Sync-Zweige lädt.
- Admin-Status wird ausschließlich über die aktuelle Session `egt_admin_open` gesteuert.
