## Phase 34C – C1 Lessons 6-10 Content + Speaking Expansion

Status: abgeschlossen.
Version: G54.27.

Umgesetzt:
- C1-Lektionen 6–10 vollständig ausgebaut.
- C1 jetzt 10/10 ausgebaute Lektionen.
- Gesamt: 430 Aufgaben, 350 normale Aufgaben, 80 Speaking-Aufgaben.
- Parallelregel eingehalten: Kursinhalt und Speaking gleichzeitig erweitert.
- Testdatei, Node Snapshot, Static Integrity Check und QA-Ergebnis ergänzt.

QA: PASS.
Nächste Phase: Phase 34D – C1 Gesamt-QA + UI/Flow-Prüfung.

---

# WORKING PLAN – Language Academy

## Phase 33D – B2 Total QA + Device Simulation

Version: G54.24

B2 wurde vollständig geprüft:

- 10 Lektionen
- 430 Aufgaben
- 350 normale Aufgaben
- 80 Sprechaufgaben
- 0 doppelte Task-IDs
- 0 fehlende Pflichtfelder
- A2 Regression PASS
- B1 Regression PASS

Die Parallelregel bleibt verbindlich: normale Aufgaben und Speaking werden pro Niveau zeitgleich ausgebaut.

Nächster Schritt: Phase 34A – C1 Kursstruktur + Speaking-Struktur parallel.


## Phase 34A – C1 Course + Speaking Structure

Version: G54.26

Erledigt:
- C1 als verfügbares Niveau geöffnet
- 10 C1-Lektionen angelegt
- 120 C1-Startaufgaben erstellt
- 40 C1-Speaking-Aufgaben parallel erstellt
- `c1StructureSnapshot()` ergänzt
- Browser-Testdatei und QA-Skripte ergänzt
- A2/B1/B2 Regression geprüft

Prüfstatus:
- JS-Syntax: PASS
- Service Worker: PASS
- Node Snapshot: PASS
- Static Integrity: PASS

Nächste Phase: Phase 34B – C1 Lektionen 1–5 Content + Speaking Expansion.


## Phase 34B – C1 Lektionen 1-5 Content + Speaking Expansion
- C1 Lektionen 1-5 inhaltlich ausgebaut.
- Pro ausgebauter Lektion 43 Aufgaben: 35 normal + 8 Speaking.
- C1 Gesamtstand: 275 Aufgaben, 60 Speaking, 215 normal.
- Parallelregel eingehalten.
- QA: Node Snapshot, Syntaxcheck, Static Integrity.


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


## Phase 35D – C2 Total QA + Device Simulation (G54.32)
- C2 Gesamt-QA abgeschlossen.
- 10/10 C2-Lektionen vollständig ausgebaut.
- 430 C2-Aufgaben: 350 normal, 80 Speaking.
- Neue Prüfschnittstelle: `LanguageAcademyCourseEntry.phase35dQaSnapshot()`.
- Neue Testdatei: `tests_phase35d_c2_total_qa_device_simulation.html`.
- Regression A2/B1/B2/C1 geprüft.
- Nächster Schritt: Phase 36A – Produktreife Gesamt-QA A1-C2 + Release Candidate.
