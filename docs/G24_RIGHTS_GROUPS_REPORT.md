# G24 – Rechte & Gruppenmodell

## Ziel
Admin sieht alles. Dozenten sehen nur zugewiesene Gruppen und Teilnehmer. Teilnehmer behalten ihren eigenen Loginbereich.

## Umgesetzt
- Demo-Gruppen A und B eingeführt.
- Demo-Dozent A sieht nur Gruppe A.
- Demo-Dozent B sieht nur Gruppe B.
- Demo-Daten erzeugen erstellt 6 Profile in zwei Gruppen.
- Teilnehmerprofile enthalten `groupId`, `track`, `courseId` und `participantRole`.
- Zentrale Zugriffsfunktionen ergänzt: `canViewGroup`, `canViewLearner`, `groupAccessForRole`.
- Dozenten-Dashboard und Teilnehmer-Dropdown filtern jetzt nach zugewiesenen Gruppen.
- Admin-Dashboard bleibt global und sieht alle Teilnehmer.
- Portalstatus zeigt bei Dozenten die aktuell sichtbare Gruppe.

## Testlogik
- Admin Login → alle Demo-Teilnehmer A und B sichtbar.
- Demo Dozent A → nur A001 bis A003 sichtbar.
- Demo Dozent B → nur B001 bis B003 sichtbar.
- Logout → zurück zum Loginbereich.

## Nicht verändert
- Neon-Startseite.
- Teilnehmerprofil-Balkenansicht.
- Login-Sheet-Grundstruktur.
- Admin/Dozent Overlay-Verhalten.
