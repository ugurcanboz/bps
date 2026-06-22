# QA Smoke-Test Checkliste — G45.1

## Ziel
Diese Checkliste dient dazu, den aktuellen Architekturstand G45.1 auf echten Geräten zu prüfen, bevor Phase 8 gestartet wird.

## Geräte
Bitte möglichst testen auf:

1. iPhone
2. iPad
3. Desktop/Chrome

## Pro Fehler bitte dokumentieren
- Gerät
- Browser/App-Modus
- Schritt, der zum Fehler führt
- Screenshot
- kurze Beschreibung: Was sollte passieren? Was passiert wirklich?
- ob der Fehler blockiert oder nur optisch stört

## Testbereiche

### A. App-Start / Cache / PWA
- App öffnet ohne weißen Bildschirm.
- Keine alte Version bleibt hängen.
- Sperrbildschirm erscheint korrekt, falls nicht eingeloggt.
- Startseite erscheint korrekt, falls Session aktiv ist.
- Nach Refresh bleibt die App nutzbar.

### B. Sperrbildschirm / Login / Registrierung / Demo
- Login öffnen.
- Registrierung öffnen.
- Demo starten.
- Zugangscode-Feld sichtbar.
- Fehlerhinweise verständlich.
- Kein Screen verschwindet ungewollt.
- Tastatur verdeckt keine wichtigen Buttons auf iPhone.

### C. Startseite / Shell
- Startseite vollständig sichtbar.
- Keine ungewollten Scrollfallen.
- Hauptkacheln anklickbar.
- Bottom-Menü sichtbar und nicht überlappend.
- Deep-Sheet öffnet sauber.
- Deep-Sheet schließt sauber.

### D. Bottom Navigation
- Home öffnet Home.
- Simulation öffnet Simulationseinstieg.
- Lernen/Üben öffnet Practice-Modul.
- Profil öffnet Profilbereich.
- Highscore öffnet Highscore, nicht falsche Seite.
- Coach öffnet Coach.
- Duell öffnet Duell.

### E. Freies Lern-/Übungsmodul
- Practice-Modul öffnet.
- Kategorien sichtbar.
- Mathe/Logik/Konzentration/Sprache/IT-Karten sichtbar.
- Übung starten funktioniert.
- Optik unterscheidet sich erkennbar von Simulation.

### F. Branch-Simulationen
Bitte alle drei starten:

1. IT/FISI
2. Kaufmännisch
3. Sozialpädagogik

Jeweils prüfen:
- Simulation startet.
- richtige Überschrift/Branch erkennbar.
- Fragen werden geladen.
- Antworten sind anklickbar.
- Weiter funktioniert.
- Abbruch/Zurück verhält sich nachvollziehbar.

### G. Standard Multiple Choice
- Antwortkarten sehen sauber aus.
- A/B/C/D sichtbar.
- lange Antworten brechen sauber um.
- keine Antwort ist abgeschnitten.
- Auswahl wird sichtbar markiert.
- Sofortfeedback, falls aktiv, wirkt korrekt.

### H. Fragenübersicht
- Fragenübersicht öffnet.
- 30 Fragen pro Seite sichtbar.
- Weitere Seiten wie 31–60 erscheinen, falls genug Fragen vorhanden sind.
- aktuelle Frage ist markiert.
- beantwortete Fragen sind markiert.
- Merken/Markierung sichtbar, falls genutzt.
- Sprung auf Frage funktioniert.
- Drawer schließt sauber.

### I. Timer / Topbar
- Timer sichtbar.
- Timer überlappt keine Texte.
- Timer läuft.
- Topbar bleibt auf iPhone/iPad nutzbar.
- Header verdeckt keine Frage.

### J. Route-Memory / Busfahrtroute
- Aufgabe erscheint ohne schwarzen Balken.
- Merkanimation/Wartehinweis verständlich.
- Straßen-Buttons sichtbar und klickbar.
- Chips der Auswahl sichtbar.
- Undo funktioniert.
- Auswahl leeren funktioniert.
- Antwort abgeben funktioniert.
- Ergebnis wird gewertet.

### K. EDV-Multi
- EDV-Visualisierung erscheint.
- Auswahlraster sichtbar.
- Elemente anklickbar.
- gewählte Elemente erscheinen als Chips.
- erneutes Anklicken entfernt Auswahl.
- Undo funktioniert.
- Auswahl leeren funktioniert.
- Antwort abgeben funktioniert.
- Ergebnis wird gewertet.

### L. Konzentrations- und Tabellenaufgaben
- Zahlen kleben nicht unlesbar zusammen.
- Tabellen sind scrollbar oder vollständig sichtbar.
- Aufgabe ist auf iPhone lösbar.
- Aufgabe ist auf iPad lösbar.
- Aufgabe ist auf Desktop lösbar.
- keine schwarzen/abgeschnittenen Bereiche.

### M. Ergebnisbildschirm
- Ergebnis erscheint nach Testende.
- Score/Prozent/Dauer sichtbar.
- Zurück zur Startseite funktioniert.
- Nochmal starten funktioniert.
- Fehleranalyse öffnet, falls vorhanden.
- Ergebnisbereich überlappt nicht mit Bottom-Menü.

### N. Profil
- Profil öffnet.
- Avatar/Button sichtbar.
- Benutzerstatus sichtbar.
- Profilbearbeitung öffnet.
- Logout sichtbar.
- Kein „Profil-Fehler“ beim Öffnen.

### O. Admin
- Admin-Einstieg erreichbar.
- Adminportal öffnet nicht leer.
- Teilnehmer/Kacheln/Suche, falls vorhanden, sichtbar.
- Keine falschen Menüs oder alten Dropdown-Strukturen.
- Rollenlogik wirkt nicht offensichtlich kaputt.

### P. Highscore / Duell / Coach / Analyse
- Highscore öffnet richtige Seite.
- Wochen-/Monatsfilter verursachen keinen leeren Crash.
- Coach öffnet.
- Analyse/Fortschritt öffnet.
- Duell öffnet.
- keine Seite öffnet versehentlich eine andere Ansicht.

### Q. Layout-Gerätecheck
Auf jedem Gerät prüfen:
- nichts ist abgeschnitten.
- nichts überlappt Bottom-Menü.
- keine Pflichtbuttons außerhalb des Bildschirms.
- Deep-Sheet ist bedienbar.
- lange Inhalte können sinnvoll gescrollt werden.
- iPhone Safe-Area passt.
- iPad-Ansicht wirkt nicht wie gestrecktes Handy-Chaos.
- Desktop nutzt Breite sinnvoll.

### R. Screenshot-Paket für Rückgabe
Bitte Screenshots bündeln nach:

1. App-Start/Gate
2. Startseite/Navigation
3. Practice
4. Simulation IT
5. Simulation Kaufmännisch
6. Simulation Sozial
7. Fragenübersicht
8. Route-Memory
9. EDV-Multi
10. Ergebnis
11. Profil/Admin
12. Highscore/Coach/Duell
13. Darstellungsbugs allgemein

