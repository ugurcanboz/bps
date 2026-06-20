# START HERE – G54.27

**Phase 34C – C1 Lektionen 6–10 Content + Speaking Expansion**

C1 ist jetzt vollständig ausgebaut: 10 Lektionen, 430 Aufgaben, 350 normale Aufgaben, 80 Sprechaufgaben. Normale Aufgaben und Speaking wurden parallel erweitert.

Wichtige Testdatei: `tests_phase34c_c1_lessons_6_10_content_speaking_expansion.html`

Nächster Schritt: Phase 34D – C1 Gesamt-QA + UI/Flow-Prüfung.

---

# START HERE – Eignungstest-Trainer / Language Academy

Aktueller Stand: **G54.25 – Phase 34A C1 Course + Speaking Structure**

## Wichtigster Fokus

Das Sprachkurs-Modul ist bis B2 vollständig ausgebaut und geprüft. C1 ist jetzt als eigenes Niveau geöffnet und strukturell vorbereitet.

- A1 vollständig mit Speaking
- A2 vollständig mit Speaking
- B1 vollständig mit Speaking
- B2 vollständig mit Speaking
- C1 Kursstruktur vorbereitet mit Speaking parallel

Die feste Regel bleibt aktiv: **Bei jedem neuen Niveau werden normale Kursaufgaben und Speaking-Aufgaben parallel ausgebaut.**

## Phase 34A Ergebnis

C1 wurde als Kursniveau geöffnet:

- 10 C1-Lektionen
- 12 Startaufgaben pro Lektion
- 8 normale Aufgaben pro Lektion
- 4 Speaking-Aufgaben pro Lektion
- insgesamt 120 C1-Startaufgaben
- insgesamt 40 C1-Sprechaufgaben
- `c1StructureSnapshot()` ergänzt
- Browser-Testdatei `tests_phase34a_c1_course_speaking_structure.html`
- Node-Snapshot-Test
- statischer Integritätscheck
- Version G54.25

## Nächster Schritt

**Phase 34B – C1 Lektionen 1–5 Content + Speaking Expansion**

C1 Lektionen 1–5 werden als Nächstes inhaltlich ausgebaut, wieder parallel mit normalen Aufgaben und Speaking.


## Phase 34D – C1 Total QA + Device Simulation (G54.28)
- C1 Gesamt-QA abgeschlossen.
- 10/10 C1-Lektionen vollständig ausgebaut.
- 430 C1-Aufgaben: 350 normal, 80 Speaking.
- Neue Prüfschnittstelle: `LanguageAcademyCourseEntry.phase34dQaSnapshot()`.
- Neue Testdatei: `tests_phase34d_c1_total_qa_device_simulation.html`.
- Regression A2/B1/B2 geprüft.
- Nächster Schritt: Phase 35A – C2 Kursstruktur + Speaking-Struktur parallel.


## Phase 35A – C2 Course + Speaking Structure (G54.29)

- C2 als verfügbares Niveau geöffnet.
- 10 C2-Lektionen angelegt.
- 120 Starter-Aufgaben: 80 normal + 40 Speaking.
- Parallelregel eingehalten: normale Aufgaben und Speaking gleichzeitig.
- QA-Dateien: `tests_phase35a_c2_course_speaking_structure.html`, `phase35a_node_snapshot_check.js`, `phase35a_static_integrity_check.py`.


## Phase 35B – C2 Lessons 1-5 Content + Speaking Expansion (G54.30)
- C2 Lektionen 1-5 wurden ausgebaut.
- Pro ausgebaute Lektion: 43 Aufgaben, davon 8 Speaking.
- C2 Gesamtstand: 275 Aufgaben, 215 normal, 60 Speaking.
- Parallelregel bleibt aktiv: Kursaufgaben und Speaking wurden gleichzeitig erweitert.
- Nächster Schritt: Phase 35C – C2 Lektionen 6-10 Content + Speaking Expansion.


## Phase 35C – C2 Lessons 6-10 Content + Speaking Expansion (G54.31)
- C2 Lektionen 6-10 wurden ausgebaut.
- C2 ist vollständig ausgebaut: 10 Lektionen, 430 Aufgaben, 350 normal, 80 Speaking.
- Parallelregel bleibt aktiv: Kursaufgaben und Speaking wurden gleichzeitig erweitert.
- Nächster Schritt: Phase 35D – C2 Gesamt-QA + UI/Flow-Prüfung.


## Phase 37A

Einstufungstest A1-C2 umgesetzt. Siehe `SCHICHTUEBERGABE_PHASE37A_LANGUAGE_ACADEMY.md`.


## Aktueller Stand – Phase 42

Aktuelle Version: `G54.42 Live Deploy Device QA`

Wichtigste Testdatei nach Deploy: `tests_phase42_live_device_qa.html`

Nächster Schritt: Phase 43 – Release Candidate Freeze & produktive Übergabe.

---

## Aktueller Hotfix-Stand

Aktuelle Version: `G54.42.1 Admin Edge Touchpad Scroll Hotfix`

Zweck: Microsoft Edge Desktop Touchpad-/Wheel-Scrolling im Adminportal reparieren.

Wichtig: `admin-portal.html` und `css/admin-portal.css` wurden nicht verändert. Die Optik bleibt identisch zu G54.42.

Nach Upload bitte in Edge `Strg + F5` drücken und das Adminportal mit dem Touchpad testen.
