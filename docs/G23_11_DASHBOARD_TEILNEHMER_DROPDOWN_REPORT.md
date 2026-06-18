# G23.11 Dashboard & Teilnehmer-Dropdown

## Ziel
- Teilnehmerliste bei Admin und Dozent nicht mehr als große separate Karte anzeigen.
- Teilnehmerliste als kompakten Dashboard-Reiter/Dropdown integrieren.
- Kreisdiagramm/Quote-Anzeige für Admin und Dozent einheitlich darstellen.
- Neon-Startseite nicht anfassen.

## Änderungen
- `portalDashboardHtml(role)` rendert jetzt:
  - einheitliche Quote-Card
  - Statistik-Karten
  - Hilfebereich-Balken
  - Dropdown `Teilnehmerliste`
- Separate Teilnehmerlisten-Karten im Admin- und Dozentenpanel wurden aus dem sichtbaren Layout genommen.
- Neuer Helper `participantListHtml(role, compact)` für wiederverwendbare Teilnehmerkarten.
- Neuer Helper `quoteRingHtml(value, label, subLabel)` für einheitliche Kreisdarstellung.
- CSS für `egt-participant-dropdown`, `egt-quote-card`, `egt-donut-unified` ergänzt.

## Nicht verändert
- Neon-Hero
- Startseite
- Trainingskarten
- normale Bottom Navigation
