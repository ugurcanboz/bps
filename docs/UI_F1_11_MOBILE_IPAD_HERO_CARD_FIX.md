# UI-F1.11 Mobile/iPad Hero & Card Fix

## Ziel
Die Premium-Startseite auf iPhone und iPad sauberer rendern, ohne Admin, Coach, Aufgabenbank oder Passwortlogik zu verändern.

## Änderungen
- iPhone und iPad nutzen eine iOS-stabile CSS-Zielscheibe statt der schweren SVG-Filtergrafik.
- Die Zielscheibe ist auf iPhone kleiner und dezenter.
- Dezente Animation über Transform/Opacity statt SVG-Blur-Filter.
- Trainingsbereich-Karten auf Mobile kompakter typografiert.
- Pfeil-Chips kleiner, ruhiger und besser positioniert.
- Schnellzugriff-Karten mobil vereinheitlicht.
- iPad-Layout bleibt ansonsten unverändert; nur die schlecht gerenderte Hero-Grafik wird ersetzt.

## Check
- PWA-Dateien bleiben erhalten.
- Service Worker Cache-Version aktualisiert.
