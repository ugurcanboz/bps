# G30.2 Training Cockpit Layout Fix

## Ziel
Das neue Training-Cockpit aus G30 bleibt erhalten, aber fehlerhafte Sheet-Reste, unnötige Desktop-Scrollflächen und fehlende Utility-Buttons wurden korrigiert.

## Änderungen
- `prepareTest()` schließt das Trainingsmenü vor Intro/Quiz.
- `startQuiz()` und `startCtcBlockFromIntro()` schließen das Trainingsmenü defensiv erneut.
- Training-Sheet/Backdrop werden bei aktivem Intro/Quiz im CSS deaktiviert.
- Desktop-Cockpit nutzt ein 2-Spalten-Layout: Hauptfrage links, Frageübersicht rechts.
- `Test beenden` und `Bug melden` sind wieder sichtbar, aber untergeordnet und ohne Overlay-Block.
- iPad/iOS bleibt einspaltig, scroll- und touchfreundlich.

## Nicht angefasst
- Neon-Startseite
- Admin-/Dozentenportal
- Rechte/Gruppenmodell
- Teilnehmerprofile
- Berichte/Systeminfo/Aufgabenbank
