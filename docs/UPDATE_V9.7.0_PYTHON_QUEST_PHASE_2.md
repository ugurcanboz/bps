# V9.7.0 · Python Quest Phase 2

## Ziel
Python Quest bleibt ein eigenes Lernmodul, wird aber optisch und strukturell vollständig im bestehenden BPS-Trainer Design geführt. Phase 2 erweitert den Prototyp in Richtung echtes Lernsystem mit Prüfungsqualität.

## Eingebaut

- Level 2 vollständig ausgebaut: Ausgabe gestalten, f-Strings, Profilkarten, ANSI-Farben und Reset.
- Striktes Level-Gating: kein Levelsprung ohne bestandene Abschlussprüfung.
- Striktes Prüfungs-Gating innerhalb eines Levels: Mini-Lektionen, Verständnisfragen und Praxisübungen müssen erledigt sein, bevor die Zwischenprüfung startet.
- Abschlussprüfung wird erst nach bestandener Zwischenprüfung geöffnet.
- Prüfungscenter erweitert um Code-Vorschau mit Zeilennummern.
- Prüfungscenter erweitert um Testfall-Liste.
- Analyse erweitert um Rubrik-Scores: Syntax, Pflichtkonzepte, Logik, Lesbarkeit, Transfer.
- Code-Coach erweitert um Fehlerkategorien, Testfall-Diagnose und konkrete Wiederholungsübung.
- Separate Python-Datenbank bleibt erhalten: `data/python-quest-db.js`.
- Service Worker Cache auf V9.7.0 erhöht.

## Design-Regel

Das Modul verwendet bewusst denselben Apple/Silver-Look wie die Haupt-App:

- helle, weiche Panels
- abgerundete Karten
- dezente Schatten
- klare Mobile-First Grids
- keine fremde Modul-Optik

## Qualitätslogik

Python Quest folgt jetzt konsequent der Lernkette:

Lernen → Verständnischeck → Praxis → Zwischenprüfung → Abschlussprüfung → Freischaltung

Dadurch ist der Fortschritt nicht nur sichtbar, sondern an echte praktische Leistung gebunden.
