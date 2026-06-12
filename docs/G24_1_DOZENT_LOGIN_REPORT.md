# G24.1 Dozenten-Login Fix

## Änderung
- Demo Dozent A und Demo Dozent B haben getrennte Login-PINs.
- Demo Dozent A: `DozentA123!`
- Demo Dozent B: `DozentB123!`
- Der alte gemeinsame Dozenten-Demo-Button wurde entfernt.
- Nach Login wird der jeweilige Dozenten-Kontext gesetzt: Gruppe A oder Gruppe B.

## Erwartung
- Admin sieht alle Teilnehmer.
- Dozent A sieht nur Gruppe A.
- Dozent B sieht nur Gruppe B.
