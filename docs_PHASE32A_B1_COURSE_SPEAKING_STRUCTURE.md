# Phase 32A – B1 Kursstruktur + Speaking-Struktur parallel

## Status
Abgeschlossen in Version **G54.17**.

## Ziel
B1 als eigenes Sprachniveau öffnen und direkt nach der neuen Projektregel aufbauen:

> Normale Kursaufgaben und Sprechaufgaben werden pro Niveau immer parallel erstellt.

## Umgesetzt
- B1 im Niveau-Raster als verfügbar markiert.
- 10 B1-Lektionen angelegt.
- Jede B1-Lektion enthält 12 Startaufgaben.
- Jede B1-Lektion enthält 8 normale Aufgaben und 4 Sprechaufgaben.
- Gesamtumfang B1 Phase 32A: 120 Aufgaben.
- Gesamtumfang B1 Speaking Phase 32A: 40 Sprechaufgaben.
- Speaking nutzt weiterhin Phase 30E:
  - unterstützte Browser: automatische SpeechRecognition-Auswertung.
  - iPhone/iPad/unsupported: geführter Sprechmodus mit Selbstbewertung.

## B1-Lektionen
1. Meinung & Diskussion
2. Kommunikation im Beruf
3. Erfahrungen erzählen
4. Probleme & Lösungen
5. Medien & Informationen
6. Bildung & Lernen
7. Reisen & Berichten
8. Gesundheit & Lebensstil
9. Amt & Service
10. Zukunft & Ziele

## Neue Prüfschnittstelle
```js
LanguageAcademyCourseEntry.b1StructureSnapshot()
```

Erwarteter Kernstatus:
```json
{
  "phase": "32A",
  "level": "b1",
  "lessons": 10,
  "totalTasks": 120,
  "normalTasks": 80,
  "speakingTasks": 40,
  "ok": true
}
```

## Neue Testdateien
- `tests_phase32a_b1_course_speaking_structure.html`
- `phase32a_node_snapshot_check.js`
- `phase32a_node_snapshot_result.json`

## Abgrenzung
Nicht verändert:
- CTC
- Admin
- Highscore
- Teilnahmecode
- Auth
- Supabase/Firebase-Logik

## QA
Durchgeführt:
- JS-Syntaxprüfung aller JavaScript-Dateien.
- Service-Worker-Syntaxprüfung.
- Node-VM-Snapshot-Test für B1.
- A2-Regression im selben Snapshot-Test geprüft.

Grenze:
- Echte Mikrofonqualität und echte Safari/WebKit-Ausführung müssen weiterhin auf Zielgeräten geprüft werden.
