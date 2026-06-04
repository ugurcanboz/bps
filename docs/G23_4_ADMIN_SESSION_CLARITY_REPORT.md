# G23.4 Admin Session Clarity

## Ziel
Das Admin-/Dozentenportal soll nach erfolgreichem Login nicht weiter so wirken, als müsse man sich erneut entsperren. Stattdessen wird klar angezeigt, welche Rolle gerade aktiv ist.

## Umgesetzt
- Nach Admin-Login wird das Admin-PIN-Formular im Admin-Tab ausgeblendet.
- Stattdessen erscheint eine Session-Karte: „Angemeldet als Admin“ mit Vollzugriff-Hinweis.
- Nach Dozenten-Login wird das Dozenten-PIN-Formular ausgeblendet.
- Stattdessen erscheint eine Session-Karte: „Angemeldet als Dozent“ mit Rechte-Hinweis.
- Statuszeile im Portal-Header zeigt jetzt klar:
  - „Angemeldet als Admin · Vollzugriff aktiv“
  - „Angemeldet als Dozent · beschränkte Rechte aktiv“
  - „Angemeldet als Teilnehmer · …“
- Bestehende Rollen- und Rechte-Logik bleibt erhalten.
- Neon-Home, Trainingskarten und Bottom Navigation wurden nicht verändert.

## Nicht verändert
- Portal-Inhalte und Detailaufbau werden in späteren Schritten weiter sortiert.
- Keine neue Aufgabenverwaltung.
- Keine neue Teilnehmeranalyse.
- Kein Redesign der Startseite.

## Technische Prüfung
- JavaScript-Syntax: OK
- Service-Worker-Syntax: OK
- HTML-Verweise: 0 fehlend
- Service-Worker-Assets: 0 fehlend
- Alte Design-Tokens: 0 aktive Treffer
