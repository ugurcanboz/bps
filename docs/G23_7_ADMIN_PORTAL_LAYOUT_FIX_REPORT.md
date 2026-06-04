# G23.7 Admin Portal Layout Fix

## Ziel

Admin-/Dozentenportal wirkt einheitlicher, nicht mehr transparent/fixed beim Scrollen und bleibt erweiterbar.

## Änderungen

- Tabbar ist nicht mehr sticky/fixed.
- Logout wurde in die Tabbar als roter Button rechts integriert.
- Alter sticky Logout unten wird ausgeblendet.
- Portal-Kacheln nutzen einheitliche responsive Grid-Regeln.
- Buttons, Inputs, Statusflächen und Teilnehmerkarten umbrechen sauber statt sich zu überlagern.
- Admin-/Dozenten-Logout leert Admin-, Dozenten- und Rollen-Session.
- Neon-Startseite wurde nicht verändert.

## Prüfziel

- Kein transparenter Tabbar-Overlay beim Scrollen.
- Logout sichtbar oben in der Portal-Navigation.
- Karten rutschen automatisch nach unten, wenn kein Platz ist.
