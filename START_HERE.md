# BPS-Trainer · G24.1 Rechte & Gruppenmodell

Aktueller Stand: G24.1.

Schwerpunkt dieser Version:
- Admin sieht alle Teilnehmer.
- Demo Dozent A sieht nur Gruppe A.
- Demo Dozent B sieht nur Gruppe B.
- Demo-Daten erzeugen erstellt zwei Gruppen mit sechs Teilnehmerprofilen.
- Neon-Startseite wurde nicht verändert.

Testreihenfolge:
1. Cache für localhost löschen.
2. Admin Login öffnen.
3. Demo-Daten erzeugen.
4. Admin Dashboard prüfen: alle 6 sichtbar.
5. Logout.
6. Demo Dozent A öffnen: nur Gruppe A sichtbar.
7. Logout.
8. Demo Dozent B öffnen: nur Gruppe B sichtbar.


## G30.2 Training Cockpit Layout Fix

- Schließt das Trainingsmenü zuverlässig, bevor Intro oder Quiz angezeigt werden.
- Desktop nutzt ein 2-Spalten-Cockpit ohne unnötige alte Sheet-/X-Reste.
- Test beenden und Bug melden bleiben sichtbar, aber als ruhige Utility-Aktionen.
- iPad/iOS bleibt einspaltig, scrollbar und touchfreundlich.
