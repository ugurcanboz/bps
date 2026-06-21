# Phase 27E – Coach-Texte DE/TR

## Ziel
Der Sprachkurs-Coach soll nicht mehr wie eine rohe technische Meldung wirken, sondern als echter Lernlehrer mit sauber formulierten Hinweisen in Deutsch und Türkisch.

## Umsetzung
- Coach-Textbibliothek `COACH_TEXTS` im Sprachkursmodul ergänzt.
- Coach-Sprache wird aus der Hilfssprache gelesen, weil Coach-Hinweise erklärende Lernbegleitung sind.
- Deutsch/Türkisch vorhanden für:
  - Coach-Titel
  - Hauptempfehlung
  - Empfehlungskarten
  - Wiederholungssets
  - Begründungen
  - Buttons
  - Metriklabels
  - Aktivitätsanzeige
  - Fallback-Texte bei wenig Daten

## Sprachlogik
Wenn Hilfssprache `tr` ist, spricht der Coach Türkisch.
Wenn Hilfssprache `de` ist, spricht der Coach Deutsch.

## Qualitätsregel
Die Lernsprache bleibt getrennt von der Hilfssprache. Aufgaben können weiterhin Deutsch trainieren, während der Coach auf Türkisch erklärt.

## Nicht verändert
- CTC
- Admin
- Highscore
- Supabase/Firebase
- A1-Aufgabeninhalt
- bestehende Navigation

## Ergebnis
Phase 27E macht den Coach sprachlich nutzbar und vorbereitet für spätere Sprachen wie Englisch, Arabisch oder Russisch.
