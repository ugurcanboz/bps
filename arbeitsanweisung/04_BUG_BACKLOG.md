# Bug-Backlog · aktuell

## Offen / nach G54.43.8L prüfen

### 1. Live-QA: Sprachtest-Simulation Deutsch

Status: offen nach Deploy.

Prüfen:

- Öffnet der neue Eintrag im Simulation Center?
- Startet Niveauauswahl?
- Startet Vollprüfung?
- Sind keine Teilprüfungen im Simulation Center auswählbar?

### 2. Home-Dock-Overlap

Status: CSS-Fix in G54.43.8L eingebaut, Live-QA offen.

Letzter Befund aus G54.43.8K:

- IT/FISI-Karte lag teilweise im Bottom-Dock-Bereich.

Fix:

- `ui-home-scroll` erhält höheren `padding-bottom` und `scroll-padding-bottom`.

### 3. A1/A2/C1/C2 Prüfungsdatenqualität

Status: offen.

B1/B2 haben Pilotdaten. Andere Level müssen nach Live-Test geprüft werden.

### 4. Mini-Training darf nicht wie Simulation wirken

Status: teilweise gelöst durch separaten Simulation-Home für Deutsch.

Nach Prüfung sicherstellen:

- Mini-Training bleibt im Sprachtraining/Schwächenprofil.
- Simulation Center zeigt nur Vollprüfung.

---

## Erledigte Bugs

- Adminportal iPhone Breitenproblem.
- Admin Body Rest-Overflow.
- Admin Logout/Tabbar Überlagerung.
- Admin Tabbar Swipe zu empfindlich.
- Admin-Cockpit Card Mobile Clipping.
- Version-Mismatch G54.43.8I/J.
