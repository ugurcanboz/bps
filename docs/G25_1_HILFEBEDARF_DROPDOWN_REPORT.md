# G25.1 – Hilfebedarf-Dropdown

## Ziel
Die Karte „Hilfebedarf nach Priorität“ wurde in Admin- und Dozenten-Dashboard als aufklappbares Dropdown umgesetzt, damit die Oberfläche aufgeräumter wirkt.

## Änderungen
- Hilfebedarf nach Priorität ist jetzt ein `<details>`-Dropdown.
- Die priorisierte Liste bleibt erst verborgen und wird nur bei Bedarf geöffnet.
- Kritisch, riskant, inaktiv und stabil bleiben in derselben Sortierlogik.
- Klick auf Teilnehmer öffnet weiterhin die bestehende Balken-Profilkarte.
- Admin und Dozent nutzen dieselbe Dropdown-Komponente.
- Neon-Startseite wurde nicht angefasst.

## Test
- JS-Syntax OK.
- Service-Worker-Syntax OK.
- ZIP-Test OK.
- Dropdown-Funktion vorhanden.
