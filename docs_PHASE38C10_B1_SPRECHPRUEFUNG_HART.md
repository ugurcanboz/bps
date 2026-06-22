# Phase 38C.10 – B1 Sprechprüfung hart

## Ziel
Die B1-Sprechprüfung wurde auf Prüfungsniveau gehärtet. Groq bleibt optionaler Prüfungslehrer und bewertet nur bestätigte Transkripte. Schlechte Browser-Speech-Ergebnisse sollen vor der Bewertung korrigiert werden.

## Eingebaut

- B1-Sprechpool von 5 auf 8 Varianten erweitert.
- Gesamtpool jetzt 5 Lesen × 5 Hören × 8 Schreiben × 8 Sprechen = 1600 mögliche B1-Prüfungskombinationen.
- Sichtbarer B1-Sprechcheck in der Exam Shell.
- Lokale Engine erkennt jetzt:
  - zu kurze Sprechantworten
  - nur Stichwörter statt zusammenhängender Antwort
  - fehlende Begrüßung / fehlender Abschluss
  - fehlende konkrete Zeit / Information
  - fehlende Rückfrage / Bitte / Lösung
  - unpassenden Ton / aggressives Register
- Groq erhält eine strengere Sprechprüfer-Rubrik.
- Keine Prüfungsfreigabe eingebaut. Es bleibt bei Ergebnisbericht, Prüfungsreife-Prognose und Empfehlungen.

## Neue Sprechvarianten

1. Schule / Rückfrage bei Klassenleitung
2. Lieferung / Reklamation beim Kundenservice
3. Arbeit / Schichttausch mit Kollegin

## Harte Punktdeckelung

- Thema verfehlt: maximal ca. 35 %
- zu kurz: maximal ca. 40–50 %
- nur Stichwörter: maximal ca. 35 %
- mehrere Pflichtpunkte fehlen: maximal kritisch
- unhöflich/aggressiv: maximal ca. 55 %
- keine Gesprächsstruktur: maximal ca. 72 %

## Groq-Rolle

Groq soll als strenger B1-Sprechprüfer bewerten:

- Aufgabenbezug
- Pflichtpunkte
- Gesprächsstruktur
- Höflichkeit / Register
- Wortschatz
- Grammatik
- kommunikative Wirkung
- Prüfungsreife

## Risikoabsicherung

Browser Speech bleibt auf iPhone/iPad unzuverlässig. Deshalb gilt:

1. Teilnehmer spricht oder tippt.
2. Transkript wird geprüft und korrigiert.
3. Erst bestätigtes Transkript wird bewertet.
4. Lokale Engine gibt stabile Vorprüfung.
5. Groq bewertet optional tiefer.
