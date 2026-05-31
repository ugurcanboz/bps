# UPDATE V9.9.0 - Python Quest Phase 4

## Schwerpunkt

Phase 4 baut Python Quest zu einem echten Unterrichtssystem aus:

- Level 4 vollstaendig: Zahlen, Rechnen und Datentypen
- PDF-Lernmaterial pro Level 1-4
- PDF-Link direkt in der Levelansicht und im Pruefungscenter
- Code-Coach erweitert um int(), float(), type_conversion und Operatoren
- Testfaelle gegen reine Textverkettung statt echter Rechnung
- Service Worker aktualisiert, damit PDFs offline verfuegbar sind

## Level 4

Thema: Zahlen, Rechnen & Datentypen.

Inhalte:

- input() liefert zuerst Text
- int() fuer ganze Zahlen
- float() fuer Kommazahlen
- Operatoren: +, -, *, /
- Mini-Rechner als Abschlussprojekt

## Gating

Die bestehende Level-Logik bleibt erhalten:

1. Lektionen erledigen
2. Verstaendnischecks richtig loesen
3. Praxisuebungen markieren
4. Zwischenpruefung bestehen
5. Abschlusspruefung bestehen
6. erst dann Freischaltung des naechsten Levels

## PDF-System

Neue Dateien:

- docs/python-levels/python-level-01.pdf
- docs/python-levels/python-level-02.pdf
- docs/python-levels/python-level-03.pdf
- docs/python-levels/python-level-04.pdf

Jedes PDF enthaelt:

- Lernziel
- kurzer Lerninhalt
- Codebeispiele
- typische Fehler
- Uebungen
- Zwischenpruefung
- Abschlusspruefung
- Bewertungsbogen

## Coach-Upgrade

Neue Diagnosepunkte:

- int()
- float()
- count_conversion
- count_math_operator
- type_conversion
- operators
- Datentypfehler bei input() ohne Umwandlung

## QA

Geprueft:

- JS-Syntax zentraler Dateien
- PDF-Render Level 1-4
- PDF-Einbindung in DB und Service Worker
- Level-4-Gutloesung besteht
- Level-4-Schlechtloesung faellt durch
