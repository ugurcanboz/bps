# Phase 33A – B2 Course + Speaking Structure

## Ziel

B2 wird als eigenes Niveau geöffnet und von Anfang an mit Kursaufgaben und Speaking parallel aufgebaut.

## Umsetzung

Neu angelegt:

- `B2_LESSON_BLUEPRINTS`
- `createB2StarterTasks()`
- `ensurePhase33AB2Structure()`
- `b2StructureSnapshot()`

B2 umfasst 10 Lektionen mit je 12 Startaufgaben:

- 8 normale Aufgaben
- 4 Speaking-Aufgaben

## B2-Lektionen

1. Bewerbung & Berufseinstieg
2. Konflikte am Arbeitsplatz
3. Argumentieren & Debattieren
4. Medien & Gesellschaft
5. Bildung & Karriereplanung
6. Umwelt & Konsum
7. Gesundheitssystem & Prävention
8. Digitalisierung & KI
9. Kultur & Integration
10. Formell schreiben & sprechen

## Aufgabenarten

Die Starterstruktur enthält:

- Multiple Choice
- Lückentext
- Satzbau
- Hörverständnis
- Speaking Practice

## Speaking

B2 nutzt die bestehende Phase-30E-Logik:

- unterstützte Browser: automatische SpeechRecognition
- iPhone/iPad/unsupported Browser: geführter Sprechmodus mit Selbstbewertung
- keine Fake-Auswertung
- keine Blockade bei fehlendem Web-Speech-Support

## QA-Ergebnis

Bestanden:

```bash
find js -name '*.js' -print0 | xargs -0 -n1 node --check
node --check service-worker.js
node phase33a_node_snapshot_check.js
python3 phase33a_static_integrity_check.py
```

Snapshot:

```json
{
  "phase": "33A",
  "lessons": 10,
  "totalTasks": 120,
  "normalTasks": 80,
  "speakingTasks": 40,
  "ok": true
}
```

## Nicht verändert

- CTC / Eignungstest
- Admin
- Highscore
- Teilnahmecode
- Auth
- Supabase/Firebase-Grundlogik
