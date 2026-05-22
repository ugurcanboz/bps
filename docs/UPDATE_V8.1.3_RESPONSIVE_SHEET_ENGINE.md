# V8.3.9 Responsive Sheet Engine

## Ziel
Das Deep Sheet ist jetzt ein eigenes zentrales Modul für alle Trainingsauswahlen. Es entscheidet nicht über IP, sondern über echte Viewport- und Eingabedaten: Breite, Höhe, Orientation, Touch/Pointer und visualViewport.

## Änderungen
- neues zentrales Deep-Sheet-Modul in `js/core/deep-sheet-controller.js`
- CSS-Engine in `css/clean-deepsheet.css` vollständig ersetzt
- Header, Body und Footer im Sheet getrennt
- eigener Scrollbereich im Sheet
- Body-Scroll-Lock während geöffnetem Sheet
- Mobile Bottom Sheet mit `dvh`, Safe-Area und Touch-Scroll
- Desktop/Tablet zentriertes App-Sheet
- Hochformat/Querformat und kleine Höhen berücksichtigt
- Start lädt weiterhin erst nach Modusauswahl Aufgaben
- alte Trainingslisten werden zur Laufzeit konsequent ausgeblendet
- alle 22 Trainingsmodi in Kategorien enthalten

## Audit
- JS-Syntax geprüft
- JSON geprüft
- 22/22 bekannte Modi vorhanden
- Branding gesichert: Willkommen im BPS-Trainer / © Ugurcan Bozkurt
