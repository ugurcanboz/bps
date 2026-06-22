# G52.8 / Phase 22 — Admin Portal Domain Engine

## Ziel

Das Admin-/Dozentenportal wird als eigene fachliche Domain-Grenze gekapselt. Die bisherige große Implementierung `js/admin-participant-engine.js` bleibt als stabile Backend-/UI-Implementierung erhalten, wird aber nicht mehr direkt von neuen Modulen angesteuert.

## Neue Datei

- `js/core/admin-portal-domain-engine.js`

## Ergebnis

Die neue Engine stellt eine stabile Facade bereit:

- `window.EGTAdminPortalDomainEngine`
- `window.AdminPortalDomainEngine`
- `App._test.AdminPortalDomainEngine`

## Gekapselte Bereiche

- Portal öffnen/schließen
- Admin-/Dozentenrolle lesen
- Rechteprüfung
- Teilnehmerliste, Teilnehmer anlegen, ändern, löschen, sperren, warnen
- Gruppen-/Dozenten-Sichtbarkeit
- Zugangscodes erstellen, listen, widerrufen, verlängern
- Kursstatistik, Export, CSV, Reset, Einstellungen
- Tickets und Badge-Status
- Coach/Admin-Eventtracking
- Sync-Status und Pending-Sync-Flush
- Online-Duell-Portal-APIs

## Geänderte Integrationspunkte

- `index.html` lädt `js/core/admin-portal-domain-engine.js` vor `app.js`.
- `app.js` erzeugt `AdminPortalDomainEngine` und nutzt diese Engine für Result-Persistence-Hooks und Duell-Portal-Zugriff.
- `js/modules/egt-admin-entry-module.js` öffnet das Portal bevorzugt über `AdminPortalDomainEngine.open(...)`.
- `js/ui-router.js` öffnet Admin/Login-Routen bevorzugt über `AdminPortalDomainEngine`.
- `js/core/architecture-guard.js` prüft die neue Domain-Engine als Required Global und Datei.

## Bewusst nicht gemacht

Die große Datei `js/admin-participant-engine.js` wurde noch nicht riskant zerlegt. Diese Datei enthält UI, Firebase, lokale Fallbacks, Rollen, Codes, Teilnehmer und Tickets in einem alten Monolithen. Phase 22 setzt deshalb zuerst die sichere Domain-Grenze. Die echte Zerlegung in kleinere Teilmodule kann danach in separaten Phasen erfolgen.

## Versionierung

- AppConfig: `G52.8`
- Cache: `egt-trainer-g52-8`
- Update-Check: `G52.8-2026-06-15`
