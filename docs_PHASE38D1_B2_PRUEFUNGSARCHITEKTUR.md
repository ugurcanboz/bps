# Phase 38D.1 – B2 Prüfungsarchitektur

Status: abgeschlossen.

## Ziel
B1 bleibt als harte, geprüfte Vorlage erhalten. B2 startet jetzt mit eigener Prüfungsarchitektur, die deutlich anspruchsvoller ist und nicht nur B1 verlängert.

## Umgesetzt
- Neue Datei `data/language-b2-exam-pilot.js`.
- B2 Aufgabenpool-Grundlage für Lesen, Hören, Schreiben und Sprechen.
- Je 3 Varianten pro Teilbereich.
- 81 mögliche B2-Prüfungskombinationen.
- B2-Schwerpunkte: indirekte Aussagen, Argumentationsstruktur, differenzierte Meinung, Pro/Contra, Stellungnahme, formelles Register.
- Groq bleibt nur Mitprüfer für Schreiben und Sprechen.
- Keine Prüfungsfreigabe eingebaut.

## B2 ist bewusst härter als B1
B2 verlangt längere Antworten, bessere Struktur, mehr Argumentation und klarere eigene Positionen. Einzelne Alltagssätze reichen nicht mehr.

## QA
- Script-Registrierung in `index.html`.
- Cache-Eintrag im Service Worker.
- Testseite `tests_phase38d1_b2_pruefungsarchitektur.html`.
