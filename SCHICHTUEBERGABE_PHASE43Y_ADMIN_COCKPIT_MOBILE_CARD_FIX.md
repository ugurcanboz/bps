# SCHICHTÜBERGABE · Phase 43Y / G54.43.8J

## Ziel
Adminportal auf iPhone visuell nachbessern, obwohl G54.43.8I im JSON-Capture bereits `pass` meldete.

## Auslöser
Echter Screenshot zeigte:
- Phase-4-Admin-Cockpit-Hero läuft rechts aus der Karte heraus.
- Quote-/Donut-Karte und Label „Gesamtsystem“ wurden rechts abgeschnitten.
- Phase-1-Map hatte klebende Texte: „DashboardKPI“, „TeilnehmerSuche“, „GruppenKurse“, „CodesZugang“.

## Fix
Datei: `css/admin-portal.css`

Neue Sektion:
`G54.43.8J · Admin Cockpit Mobile Card Layout Fix`

Maßnahmen:
1. Phase-1-Map auf kleinen/coarse Geräten einspaltig gesetzt.
2. Label und Beschreibung in der Phase-1-Map als getrennte Blockzeilen gerendert.
3. Phase-4-Hero im Adminportal mobil einspaltig gesetzt.
4. Quote-/Donut-Karte unter den Text gesetzt und zentriert.
5. Donut/Label auf `max-width: 100%` und `overflow-wrap` gehärtet.
6. Phase-4-Dashboard-Children gegen inneren Breitenüberlauf gehärtet.

## Version
- AppConfig: G54.43.8J
- FullVersion: G54.43.8J-2026-06-22
- Service Worker Cache: `egt-trainer-g54-43-8j`
- Manifest aktualisiert

## Erwartetes QA-Ergebnis
- JSON-Capture bleibt `score: pass`.
- Kein `clipped` und kein `pageHorizontalOverflow`.
- Im echten Screenshot darf „Gesamtsystem“ nicht mehr rechts abgeschnitten werden.
- Phase-1-Liste muss mobil mit sichtbarem Abstand/Zeilenumbruch erscheinen.

## Nächster Test
Nach Deploy auf iPhone Adminportal öffnen, Phase-1-Karte und Phase-4-Admin-Cockpit-Hero visuell prüfen, dann Capture schicken.
