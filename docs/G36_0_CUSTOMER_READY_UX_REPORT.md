# G36.0 Customer Ready UX Report

## Ziel
Die App soll für Teilnehmer, Dozenten und Admins sichtbarer, einfacher und verkaufsfähiger werden. Backend-Funktionen reichen nicht aus, wenn der Kunde sie nicht sofort findet.

## Behoben

### 1. Highscore im Bottom-Menü
Problem: Highscore war im Code vorhanden, wurde aber durch dynamisches Re-Rendering des Bottom-Docks wieder entfernt.

Fix:
- `js/ui-home-renderer.js` `renderTabBar()` erweitert.
- Highscore ist jetzt dauerhaft als sichtbarer Bottom-Dock-Eintrag vorhanden.
- Der Button öffnet das vorhandene Highscore-/Duelle-Sheet.

Akzeptanz:
- Kunde sieht Highscore direkt in der Hauptnavigation.
- Keine Suche über versteckte Menüs nötig.

### 2. Highscore, Diagramme und Duell-Ergebnisse sichtbar integriert
Problem: Highscore, Duellhistorie und Prognose existierten teilweise bereits, waren aber nicht kundenorientiert sichtbar gebündelt.

Fix:
- `renderHighscoreTab()` zu einem Dashboard erweitert.
- Sichtbare KPI-Karten: Bestwert, Durchschnitt, Ranglistenplätze, Duell-Sieger.
- Fortschrittsdiagramm aus letzten Läufen.
- Duell-Ergebnisse sichtbar mit Start-Button.
- Cloud-Highscore bleibt eingebunden.

Akzeptanz:
- Teilnehmer sieht sofort, wo er steht.
- Dozent/Admin erkennt, dass Ergebnisse, Duelle und Prognose als Produktfunktion vorhanden sind.

### 3. Frageübersicht aus dem Bottom-Bereich entfernt
Problem: Frageübersicht belegte unten Platz und erzeugte Labyrinth-/Scroll-Effekt.

Fix:
- `updateQuestionNav()` in `js/app.js` auf Side-Drawer umgebaut.
- Standardzustand: kompakter Button „Fragen“ + aktueller Stand.
- Geöffnet: Seitenweise Übersicht mit 30 Fragen pro Seite.
- Auf Tablet/Desktop rechts seitlich.
- Auf Mobile kompakt über Bottom-Dock.

Akzeptanz:
- Aufgabe bleibt im Fokus.
- Frageübersicht ist schnell erreichbar, aber nicht mehr dominant.

### 4. Kundensicht statt Backend-Sicht
Problem: Funktionen existieren zwar, aber waren nicht so integriert, dass ein Kunde sie sofort wahrnimmt.

Fix:
- Navigation sichtbarer gemacht.
- Highscore/Diagramme/Duell-Ergebnisse als eigenständiger Produktbereich präsentiert.
- Frageübersicht als UX-Komponente neu strukturiert.

## Noch nicht vollständig erledigt
Diese Version löst Navigation, Highscore-Sichtbarkeit, Diagramm-/Duelldarstellung und Frageübersicht. Eine vollständige Zeile-für-Zeile-Fachprüfung aller Module, Admin-Workflows, Dozenten-Prognosen und Aufgabenqualität ist ein eigener größerer Audit-Schritt.

## Geänderte Dateien
- `js/ui-home-renderer.js`
- `js/app.js`
- `css/app.css`
- `index.html` Version-Bump
- `service-worker.js` Version-Bump, falls String vorhanden
- `update-check.json` Version-Bump, falls String vorhanden

## Build-Check
- `node --check js/app.js` erfolgreich
- `node --check js/ui-home-renderer.js` erfolgreich
