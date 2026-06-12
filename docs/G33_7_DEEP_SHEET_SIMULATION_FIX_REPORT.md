# G33.7 Deep Sheet Simulation Fix

## Ziel
Demo-Schaltfläche „Simulation starten“ darf kein rohes internes Trainingsmenü im Frontend anzeigen. Der Einstieg muss über das bestehende Deep-Sheet/Trainingsmenü-Konzept laufen.

## Änderungen
- `App.openSimulationSheet()` ergänzt: setzt Simulation/CTC-Modus und öffnet ausschließlich das Trainings-Deep-Sheet.
- `auth-demo-simulation-start` nutzt bevorzugt `App.openSimulationSheet()` statt mehrere alte Pfade nacheinander aufzurufen.
- `.training-sheet` und `.training-sheet-backdrop` vollständig als fixed Deep-Sheet gestylt.
- Rohes Trainingsmenü ist standardmäßig unsichtbar und wird nur mit `.show` als Overlay eingeblendet.

## Nicht geändert
- Keine neue Simulation gebaut.
- Kein Highscore-Umbau.
- Kein Profil-/Avatar-Umbau.
- Kein Coach-/Firebase-Umbau.
