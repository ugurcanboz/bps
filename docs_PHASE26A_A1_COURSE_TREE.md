# Phase 26A · A1 Kursstruktur

## Status
PASS

## Ziel
Der Sprachkurs besitzt jetzt nicht mehr nur eine Demo-Lektion, sondern einen sichtbaren A1-Kursbaum mit 10 Startlektionen.

## Eingebaut
- A1 Lektion 1: Begrüßungen
- A1 Lektion 2: Sich vorstellen
- A1 Lektion 3: Zahlen
- A1 Lektion 4: Uhrzeit
- A1 Lektion 5: Familie
- A1 Lektion 6: Einkaufen
- A1 Lektion 7: Arzt & Termin
- A1 Lektion 8: Beruf & Arbeit
- A1 Lektion 9: Verkehr
- A1 Lektion 10: Alltag

## Datenstruktur
Jede A1-Lektion besitzt:
- ID
- deutschen Titel
- türkischen Titel als titleI18n
- deutsches Lernziel
- türkisches Lernziel als goalI18n
- Vokabelliste
- Startaufgaben
- Status available
- Fortschrittskompatibilität

## Nicht verändert
- CTC
- Adminportal
- Highscore
- Supabase/Firebase Hauptlogik

## Prüfung
- JS-Syntaxprüfung: PASS
- Phase-26A-Testdatei ergänzt: tests_phase26a_a1_course_tree.html

## Nächster Schritt
Phase 26B: Aufgabentypen erweitern: Zuordnen, Lückentext, Satzreihenfolge.
