# Phase 26G – A1 Inhaltsausbau

## Ziel
Phase 26G erweitert den Deutsch-A1-Kurs von einem stabilisierten technischen Kursmodul zu einem deutlich umfangreicheren Lerninhaltspaket.

## Umgesetzt

- 10 A1-Lektionen bleiben vollständig erhalten.
- Jede A1-Lektion enthält nun 39 Aufgaben.
- Gesamtumfang A1: 390 Aufgaben.
- Jede Lektion nutzt alle vorhandenen Aufgabentypen:
  - Multiple Choice
  - Zuordnen
  - Lückentext
  - Satzbau
  - Vokabelkarte
  - Richtig/Falsch
  - Hörverständnis
- Jede Lektion enthält ca. 12 Vokabeln mit Deutsch/Türkisch-Bezug.
- Alle Aufgaben besitzen:
  - `prompt.de/tr`
  - `instruction.de/tr`
  - `hint.de/tr`
  - `explain.de/tr`
- Die Hilfe bleibt lösungsfrei.
- Die vorhandene Task-Registry wird weiterverwendet.
- Die adaptive Engine erhält weiterhin den Aufgabentyp.
- Das Fehlertraining und der Vokabeltrainer können aus den neuen Aufgaben Material sammeln.

## Lektionen

1. Begrüßungen
2. Sich vorstellen
3. Zahlen
4. Uhrzeit
5. Familie
6. Einkaufen
7. Arzt & Termin
8. Beruf & Arbeit
9. Verkehr
10. Alltag

## Qualitätskontrolle

Geprüft:

- JS-Syntaxprüfung: PASS
- A1-Lektionen: 10/10 vorhanden
- Aufgaben pro A1-Lektion: 39
- Gesamtaufgaben A1: 390
- Aufgaben-IDs eindeutig: PASS
- Aufgabentypen je Lektion vollständig: PASS
- CTC/Admin/Highscore nicht verändert

## Einschränkung
Phase 26G ist ein Inhaltsausbau. Die visuelle Detail-QA aus Phase 26F bleibt die aktuelle Stabilitätsbasis. Nach dem großen Inhaltsausbau sollte vor Phase 27 eine kurze Smoke-QA mit echten Geräten oder Screenshots erfolgen.
