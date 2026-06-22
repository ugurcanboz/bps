# Bug-Backlog · aktuell

## Offen / nach G54.43.8M prüfen

### 1. Live-QA: Home Dual Simulation Entry

Status: offen nach Deploy.

Prüfen:

- Sind zwei große Home-Kacheln sichtbar?
  - Eignungstest-Simulation
  - Sprachtest-Simulation
- Wirkt Sprachtest sofort als eigenes Angebot sichtbar?
- Keine Texte abgeschnitten?
- Keine Dock-Überlappung?

### 2. Eignungstest-Simulation

Status: offen nach Deploy.

Prüfen:

- Öffnet die Eignungstest-Kachel die BPS/CTC/Auswahltest-Struktur?
- Ist Sprache dort nicht mehr als verwirrender Unterbereich versteckt?
- Starten BPS/CTC weiterhin wie vorher?

### 3. Sprachtest-Simulation Deutsch

Status: offen nach Deploy.

Prüfen:

- Öffnet die Sprachtest-Kachel direkt die Deutsch-Vollprüfungsstruktur?
- Startet Niveauauswahl?
- Startet Vollprüfung?
- Sind keine Teilprüfungen im Simulationseinstieg auswählbar?

### 4. Home-Dock-Overlap

Status: CSS-Fix in G54.43.8L eingebaut, nach G54.43.8M erneut prüfen.

Letzter Befund aus G54.43.8K:

- IT/FISI-Karte lag teilweise im Bottom-Dock-Bereich.

### 5. A1/A2/C1/C2 Prüfungsdatenqualität

Status: offen.

B1/B2 haben Pilotdaten. Andere Level müssen nach Live-Test geprüft werden.

### 6. Mini-Training darf nicht wie Simulation wirken

Status: weiter beobachten.

Nach Prüfung sicherstellen:

- Mini-Training bleibt im Sprachtraining/Schwächenprofil.
- Sprachtest-Simulation zeigt nur Vollprüfung.

---

## Erledigte Bugs

- Adminportal iPhone Breitenproblem.
- Admin Body Rest-Overflow.
- Admin Logout/Tabbar Überlagerung.
- Admin Tabbar Swipe zu empfindlich.
- Admin-Cockpit Card Mobile Clipping.
- Version-Mismatch G54.43.8I/J.
- Sprachtest auf Home nicht sichtbar genug → durch eigene Home-Kachel gelöst.
