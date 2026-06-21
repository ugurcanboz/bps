# Phase 24H – Fortschritt speichern

## Ziel
Der Sprachkurs speichert ab dieser Phase den Lernstand unabhängig von CTC, Adminportal und Highscore.

## Umgesetzt
- neuer Fortschritts-Speicher `language_academy_course_progress_v2`
- Legacy-Spiegelung auf `language_academy_course_progress_v1` zur Kompatibilität
- Speicherung von Kurs, Niveau, Lektion, `lessonId`, Fortschritt in Prozent
- Speicherung von Aufgabenstatus: aktuelle Aufgabe, Auswahl, beantwortet, richtig/falsch
- Speicherung von Fehlern für Wiederholung über `wrongTaskIds`
- Statistik-Snapshot: gelöste Aufgaben, richtige Antworten, Versuche, offene Wiederholungen
- letzte Aktivität über `lastActivity`
- Dashboard liest Fortschritt dynamisch aus dem Speicher
- Wiederholen/Letzte Fehler öffnet künftig offene Fehler oder zeigt „keine offenen Fehler“

## Nicht verändert
- CTC-Test
- Adminportal
- Highscore/Supabase
- Login/Sperrbildschirm

## Test
`tests_phase24h_progress_persistence.html`

Erwartung: `ALL PASS`.
