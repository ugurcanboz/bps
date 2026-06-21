# G30 – Training Cockpit

## Ziel
Das Aufgaben-/Trainingslayout wurde nach dem neuen Konzept umgesetzt:

- Desktop: großes Trainingscockpit mit Fragekarte, Timer, Fortschritt und Frageübersicht.
- iPad/iOS: kompakte Karten, Touch-optimierte Antwortbuttons, horizontale Frageübersicht.
- Ergebnisansicht: optisch an das Cockpit angepasst.

## Umgesetzt

- Timer als kreisförmige Fortschrittsanzeige mit Grün/Orange/Rot-Zuständen.
- Frageübersicht als Nummern-Grid auf Desktop und horizontal scrollbare Leiste auf Mobile/iPad.
- Antwortkarten einheitlicher und lesbarer gestaltet.
- Fortschrittsanzeige und Meta-Badges im Trainingskopf überarbeitet.
- Ergebnisansicht optisch an den Trainingsmodus angepasst.
- JS ergänzt um Timer-Prozent-Update für die visuelle Kreislogik.

## Nicht angefasst

- Admin-/Dozentenportal
- Rechte-/Gruppenmodell
- Berichte und Export
- Systeminfo
- Aufgabenbank-Prüfung
- Neon-Startseite

## Testpunkte

1. Training starten.
2. Timer läuft sichtbar im Kreis.
3. Antwortkarten reagieren sauber.
4. Frageübersicht zeigt aktuelle, offene, erledigte und markierte Aufgaben.
5. Mobile/iPad: Frageübersicht horizontal scrollen.
6. Ergebnisansicht prüfen.
