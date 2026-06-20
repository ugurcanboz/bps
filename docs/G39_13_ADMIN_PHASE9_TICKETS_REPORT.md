# G39.13 Admin Phase 9 · Ticketsystem

## Ziel

Das Admin-Portal sollte ein echtes Support-/Fehlermanagement bekommen, statt nur einfache Bugmeldungen anzuzeigen.

## Umsetzung

- Neues Ticketmodul als eigener Arbeitsbereich im Admin-Portal
- KPI-Kacheln für Gesamt, Offen, In Bearbeitung, Kritisch, Screenshot und Geschlossen
- Such- und Filterleiste für schnelles Arbeiten
- Master-Detail-Ansicht: links Ticketliste, rechts Ticketdetail
- Ticketdetail mit Meldung, Melder, Gruppe, Kontext, Screenshot, Status, Priorität, Zuweisung und Lösung
- Historie mit internen Notizen
- CSV-Export
- Lokale Speicherung und Offline-Puffer werden zusammengeführt
- Cloud-Speicherung über bestehende Firestore-Struktur `courses/{courseId}/tickets/{ticketId}` bleibt erhalten
- Dozenten-Sicht vorbereitet: nur eigene Gruppen oder zugewiesene Tickets

## Technische Hinweise

- Build: `G39.13-ADMIN-PHASE9-TICKETS-2026-06-14`
- Cache: `bps-trainer-g3913-admin-phase9`
- Lokaler Ticketstore: `egt_bug_tickets_v1`
- Pending Tickets: `egt_tickets_pending_v1`
- Syntaxprüfung: `node --check` für Admin-Engine, Ticketmodul und App bestanden
