# G39.11 · Admin Phase 7 · Dozentenportal

## Ziel

Dozentenverwaltung als professionelles eigenes Modul ausbauen: Profile, Gruppenbindung, Rechte, eigene Teilnehmer und eigenes Cockpit.

## Änderungen

- Persistente Dozentenprofile über `egt_dozent_profiles_v1`
- Fehlende Funktion `dozentProfiles()` ergänzt
- Demo-Dozenten A/B bleiben als Fallback erhalten
- Dozentenübersicht mit Suchfeld und Statusfilter
- Master-Detail-Ansicht für Dozentenprofile
- Bearbeitung von Name, E-Mail, Telefon, Status, Gruppen und Notizen
- Rechte-Schalter für Teilnehmer, Berichte, Codes und Notizen
- Dozentensicht beschränkt sich auf eigene Gruppen
- Admin kann Dozenten erstellen und sperren/entsperren
- Teilnehmer können aus dem Dozentenprofil direkt geöffnet werden

## Prüfung

- `node --check js/admin-participant-engine.js` erfolgreich
- CSS für Desktop und Mobile ergänzt
