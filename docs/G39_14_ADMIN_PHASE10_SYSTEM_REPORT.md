# G39.14 Admin Phase 10 · Systembereich

Build: `G39.14-ADMIN-PHASE10-SYSTEM-2026-06-14`
Cache: `bps-trainer-g3914-admin-phase10-system`

## Umgesetzt

- Systembereich als Betriebszentrale neu aufgebaut.
- Health-Check mit Status `stabil`, `prüfen` oder `kritisch`.
- KPI-Kacheln für Version, Build, Service Worker, Speicher, IndexedDB, Firebase, Teilnehmer, Codes, Dozenten, Tickets, Aufgabenbank und Netzwerk.
- Betriebs-Checkliste für Admin-Rolle, Firebase, Sync-Warteschlange, Teilnehmerdaten, Codes, Tickets, Aufgabenbank und Speicher.
- Rollenmatrix für Admin, Dozent und gesperrten Zustand.
- Backup-Export als JSON für relevante lokale Admin-Daten.
- Backup-Import mit erlaubten App-Schlüsseln.
- Runtime-/Service-Worker-Cache-Löschung ohne Teilnehmerprofile zu löschen.
- App-Speicherliste für relevante LocalStorage-Schlüssel.
- Erweiterte Diagnose mit Cache-Namen, Service-Worker-Registrierungen, LocalStorage-Größen, Sync-Status, Tickets, Codes, Dozenten und Aufgabenbank.
- Fehlende Ticket-LocalStorage-Helfer ergänzt, damit das Admin-Ticketsystem nicht auf undefinierten Funktionen hängen bleibt.

## Hinweis

Die Wiederherstellung überschreibt nur definierte App-Schlüssel und ist bewusst nicht als kompletter Browser-Datenimport gebaut. Das reduziert Risiko bei Deploys.
