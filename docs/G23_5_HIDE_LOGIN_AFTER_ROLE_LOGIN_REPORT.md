# G23.5 Hide Login After Role Login

## Ziel
Nach erfolgreichem Admin- oder Dozenten-Login wird der Login-Bereich ausgeblendet. Das Portal zeigt sofort den passenden Rollenbereich.

## Änderungen
- Login-Tab wird bei aktiver Admin-/Dozenten-Sitzung versteckt.
- Login-Panel wird bei aktiver Admin-/Dozenten-Sitzung ausgeblendet.
- Öffnet man das Portal erneut, wird automatisch Admin oder Dozent geöffnet.
- Sperren/Logout macht den Loginbereich wieder sichtbar.
- Neon-UI und restliches Portal wurden nicht strukturell verändert.

## Prüfziel
Kein verwirrender Zustand mehr: Angemeldet als Admin, aber Login-Formular sichtbar.
