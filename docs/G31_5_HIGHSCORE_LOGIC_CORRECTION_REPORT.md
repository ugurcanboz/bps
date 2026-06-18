# G31.5 Highscore Logic Correction · Bericht

Build: G31.5-HIGHSCORE-LOGIC-CORRECTION-2026-06-08

## Korrigierte Konzeptfehler

- Top 3 und Rangliste werden nicht mehr aus einzelnen Testeinträgen aufgebaut, sondern nach Teilnehmern aggregiert.
- Ein Teilnehmer kann dadurch nicht mehrfach im Podium erscheinen.
- Ranking, Abstand bis Top 10, Belohnungen und Challenges verwenden ein einheitliches Arena-Punkte-System.
- Arena-Punkte: 1 Prozentpunkt = 10 Arena-Punkte.
- Die 7-Tage-Serie nutzt nur eigene Highscore-Einträge und prüft echte Kalendertage.
- Heute-1.000-Punkte nutzt nur eigene heutige Einträge.
- Entwicklung und Aktivität werden nur aus eigenen Daten berechnet.
- Automatischer Cloud-Backfill alter lokaler Tests ist deaktiviert, damit alte Tests nicht als heutige Cloud-Aktivität erscheinen.
- Cloud-Check bleibt in der Nutzeransicht lesbar und reduziert technische Details.

## Noch bewusst vorbereitet, aber nicht produktiv aktiv

- Benutzerprofil
- Duell-Anfragen
- Freunde/Teilnehmerauswahl
- Dauerhafte Badge-Tabelle

## Nächster Schritt

G32.0 Stability Cut: Highscore-Logik aus app.js herauslösen, Module trennen, Timer zentralisieren und Debug/Nutzeransicht vollständig separieren.
