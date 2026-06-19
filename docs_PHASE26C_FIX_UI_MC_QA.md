# Phase 26C-FIX · Sprachkurs UI & Multiple-Choice Reparatur

## Auslöser
Videoanalyse `sprachkurs.mp4`: Sprachkurs-Dashboard war sichtbar, aber mehrere Bereiche wirkten noch prototypisch. Besonders auffällig:

- mehrere weiße Innenflächen im dunklen Deep-Sheet wirkten nicht passend zum Hauptapp-Design
- Niveau-Kacheln wirkten in der Innenaufteilung zu gedrückt
- Multiple-Choice-Auswahl war in der Bedienung nicht stabil genug nachweisbar
- sichtbare Buttons brauchten robustere Touch-/Click-Verarbeitung

## Korrekturen

### UI
- Harte weiße Sprachkurs-Flächen durch dunkle Glass-/Slate-Flächen ersetzt.
- Kachel-Innenabstände, Schriftgrößen und Badge-Größen korrigiert.
- A1–C2 Raster auf kleinen Viewports stabilisiert.
- Antwortkarten erhalten klar sichtbare Auswahl-, Richtig- und Falsch-Zustände.

### Funktion
- Sprachkurs-Clickrouting läuft jetzt im Capture-Modus vor fremden globalen Routern.
- `language-course-select-answer` speichert Auswahl zuverlässig.
- `Antwort prüfen` wird nach Auswahl aktiv.
- `Weiter` wird nach Prüfung aktiv.
- Level-, Lektions-, Aufgaben- und Vokabel-Buttons werden über denselben robusten Sprachkurs-Router verarbeitet.

### Grenzen der Prüfung
- Die direkte localhost/file-Browserprüfung ist in dieser Umgebung durch Browser-Policy blockiert.
- Deshalb wurde zusätzlich ein isolierter Headless-Browser-Test mit inline geladenem Sprachkurs-Modul und Stub-Deep-Sheet durchgeführt.

## Ergebnis Inline-Browser-Test

- Task-Root vorhanden: PASS
- Multiple-Choice-Antworten gefunden: PASS
- Vor Auswahl ist Prüfen deaktiviert: PASS
- Nach Auswahl ist `.is-selected` sichtbar: PASS
- Nach Auswahl ist Prüfen aktiv: PASS
- Nach Prüfung erscheint Feedback: PASS
- Weiter ist nach Prüfung aktiv: PASS
- Weißer Kartenhintergrund entfernt: PASS

## Status
Phase 26C-FIX: PASS.
