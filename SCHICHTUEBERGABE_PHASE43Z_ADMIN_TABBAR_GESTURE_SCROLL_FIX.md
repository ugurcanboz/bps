# SCHICHTÜBERGABE · Phase 43Z / G54.43.8K

## Ziel
Admin-Tabbar auf iPhone deutlich leichter horizontal scrollbar machen und Logout sauber aus der Tab-Zeile trennen.

## Behoben
- Tabbar muss nicht mehr exakt waagerecht gewischt werden.
- Touch-Gesture-Assist übernimmt horizontales Scrollen bei leicht schrägem Swipe.
- Logout liegt mobil in eigener Zeile und blockiert nicht mehr die Tabs.
- Aktiver Tab wird nach Tabwechsel automatisch sichtbar/zentriert.
- Versions-Mismatch wurde auf G54.43.8K vereinheitlicht.

## Test
Nach Deploy: Admin öffnen, Tabbar mit leicht schrägem Swipe von rechts nach links bewegen. Erwartung: Scrollt flüssig, Logout bleibt getrennt darunter.
