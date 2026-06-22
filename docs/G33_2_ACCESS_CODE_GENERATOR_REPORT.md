# G33.2 Access Code Generator Report

## Ziel
Admin- und Dozent-Codegenerator als Phase 5–6 des Benutzerprofil-/Firebase-Konzepts.

## Umgesetzt
- Adminbereich: Zugangscodes für Teilnehmer, Dozent, Admin und Demo erzeugen.
- Dozentenbereich: Teilnehmercodes ausschließlich für die eigene zugewiesene Gruppe erzeugen.
- Codes werden in `courses/{courseId}/accessCodes/{codeId}` gespeichert.
- Es werden keine Fake-Rechte vergeben, wenn Firebase nicht verbunden ist.
- Dozenten sehen und widerrufen nur Codes ihrer eigenen Gruppe.
- Admin sieht alle Codes.

## Bewusst nicht umgesetzt
- Noch keine harte Demo-Sperre.
- Noch keine Avatar-Funktion.
- Noch keine vollständige Profilpflicht.
- Noch kein produktiver Rollenlogin über Firebase-Profil im Adminportal.

## Nächste Phase
Profil, Avatar, Nickname-Pflicht und später Demo-Feature-Gates.
