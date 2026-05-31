# Update V9.6.0 · Python Quest Academy

## Ziel

Dieses Update startet den Python-Lernpfad als eigenes Modul neben der BPS/CTC-Simulation. Python wird bewusst nicht in die normale Eignungstest-Aufgabendatenbank gemischt, weil der Kurs eine andere Logik hat: Lernen, Üben, Zwischenprüfung, Abschlussprüfung, Code-Abgabe und Freischaltung.

## Neue Dateien

- `data/python-quest-db.js`
  - separate Python-Kursdatenbank
  - Level 1–30 als Kurs-DNA
  - Level 1 vollständig mit Lektionen, MC, Praxisübungen, Zwischenprüfung und Abschlussprüfung
  - Level 2 vorbereitet
  - Level 3–30 als gesperrte Roadmap-DNA

- `js/python-quest-module.js`
  - eigenes Python-Quest-Modul
  - Vollbild-Lernbereich
  - Levelübersicht
  - XP-/Badge-System
  - Zwischenprüfung
  - Abschlussprüfung
  - Upload von `.py` und `.txt`
  - Code-Vorschau/Texteditor
  - Prüfung durch Code-Coach
  - Level-Freischaltung

- `css/python-quest.css`
  - eigene mobile-first UI für Python Quest
  - Apple-artige Karten, Prüfungscenter, Levelkarten, Codefeld und Analyseboxen

## Coach-Upgrade

`js/learning-coach-engine.js` wurde um `evaluatePythonSubmission(payload)` erweitert.

Der neue Code-Coach-Modus prüft:

- vorhandenen Code
- `print()`
- Variablen/Zuweisungen
- Kommentare
- einfache Syntaxsignale
- Klammern/Anführungszeichen
- fehlende Doppelpunkte bei `if`, `for`, `while`, `def`, `class`
- verbotene Tokens wie `eval(` oder `exec(`
- Pflichtkonzepte aus der Level-DNA
- Punktebewertung und Bestehen/Nichtbestehen

Die Coach-UI enthält zusätzlich einen Einstieg zu Python Quest.

## Didaktische Logik

Jedes Level folgt der Struktur:

1. Mini-Lektion
2. Verständnischeck
3. Praxisübung
4. Zwischenprüfung
5. Abschlussprüfung
6. Freischaltung des nächsten Levels

Ein Level wird nicht durch Lesen freigeschaltet, sondern nur durch eine bestandene Abschlussprüfung.

## Level 1 Status

Level 1 ist vollständig nutzbar:

- Hallo Welt
- `print()`
- Variablen
- Kommentare
- Multiple Choice
- Praxisaufgaben
- Zwischenprüfung
- Abschlussprüfung
- `.py`/`.txt` Upload
- Code-Coach-Analyse
- Freischaltung von Level 2 bei bestandener Abschlussprüfung

## Bewusste Grenze

Es wurde nicht versucht, direkt 30 Level vollständig mit Inhalt zu überladen. Das wäre didaktisch und technisch riskant. Stattdessen ist die Level-DNA für 1–30 vorhanden, aber Level 1 ist der produktive Beweisbaustein. Nach erfolgreichem Test wird Level 2–30 nach derselben DNA skaliert.

## Offline-Fähigkeit

Die neuen Python-Dateien wurden in den Service Worker aufgenommen:

- `css/python-quest.css`
- `js/python-quest-module.js`
- `data/python-quest-db.js`

Damit bleibt das Modul im Offline-first-Konzept.
