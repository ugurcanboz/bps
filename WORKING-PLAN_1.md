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

# WORKING PLAN – Phase 34A

Projekt: Eignungstest-Trainer / Language Academy  
Version: **G54.25**  
Phase: **34A – C1 Course + Speaking Structure**

## Erledigt

- C1 als verfügbares Niveau geöffnet
- 10 C1-Lektionen angelegt
- Startaufgaben pro Lektion ergänzt
- Speaking-Aufgaben pro Lektion parallel ergänzt
- `c1StructureSnapshot()` bereitgestellt
- Diagnostics auf Phase 34A aktualisiert
- A2/B1/B2 Regression abgesichert
- Browser-Testdatei ergänzt
- Node-Snapshot-Test ergänzt
- Static-Integrity-Test ergänzt
- Versionierung auf G54.25 aktualisiert

## C1-Struktur

- C1 Lektionen: 10
- Aufgaben gesamt: 120
- normale Aufgaben: 80
- Speaking-Aufgaben: 40
- Mindestumfang pro Lektion: 12 Aufgaben inkl. 4 Speaking

## Prüfstatus

- JS-Syntax: PASS
- Service Worker: PASS
- Node Snapshot: PASS
- Static Integrity: PASS
- C1 Struktur: PASS
- A2 Regression: PASS
- B1 Regression: PASS
- B2 Regression: PASS

## Nächste Phase

**Phase 34B – C1 Lessons 1-5 Content + Speaking Expansion**


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

---

## Phase 38B.3A – Speaking AI Client

Status: abgeschlossen.

### Ziel
Technische Client-Schicht für Speaking-Training und Exam-Speaking-Prüfung vorbereiten.

### Änderungen
- Neue Datei `js/modules/language-speaking-ai-client.js`
- `index.html` lädt den Speaking-AI-Client nach dem Groq-Client.
- `service-worker.js` Cache auf `egt-trainer-g54-38b3a` erhöht und neue Client-Datei ergänzt.
- `data/language-ai-config.js` Phase auf `38B.3A` aktualisiert.
- `update-check.json` auf Build `G54.38B3A-2026-06-18` aktualisiert.
- Neue Testseite `tests_phase38b3a_speaking_ai_client.html` erstellt.
- Neue Dokumentation `docs_PHASE38B3A_SPEAKING_AI_CLIENT.md` erstellt.

### Sicherheitsprüfung
- Kein Groq-Key im Frontend.
- Cloudflare Worker bleibt alleiniger Secret-Träger.
- Lokaler Fallback verhindert App-Absturz bei Groq/Worker-Ausfall.

### Nächste Phase
38B.3B – Speaking-Testseite/Prüfungs-UI erweitern und sichtbare Bewertungsanzeige vorbereiten.


---

## Phase 38C.1 – Harte Prüfungsarchitektur + Groq-Prüfungslehrer-Basis

Status: abgeschlossen.

### Ziel
Groq wird nicht als permanenter Live-Sprachpartner genutzt, sondern als strenger KI-Mitprüfer in Prüfungssimulationen. Die lokale Engine bleibt das stabile Fundament.

### Änderungen
- Neue Prüfungs-Blueprints für A1, A2, B1, B2, C1 und C2: `data/language-exam-blueprints.js`.
- Neue Prüfungsengine: `js/modules/language-exam-engine.js`.
- `index.html` lädt Blueprints und Prüfungsengine nach den AI-Clients.
- `service-worker.js` Cache auf `egt-trainer-g54-38c1-exam-architecture` erhöht und neue Dateien ergänzt.
- `update-check.json` auf Build `G54.38C.1-2026-06-18` aktualisiert.
- Neue Testseite `tests_phase38c1_exam_engine_hard_rubric.html`.
- Neue Dokumentation `docs_PHASE38C1_EXAM_ARCHITECTURE_HARD_RUBRIC.md`.

### Bewertungslogik
- Lokale Bewertung: 40 %.
- Groq-Prüfer: 60 %.
- Harte Deckelung bei Themenverfehlung, zu kurzer Antwort, leeren Antworten und fehlenden Kernpflichtpunkten.
- Bestehen hängt nicht nur vom Gesamtscore ab, sondern auch von Mindestleistung pro Teilbereich.

### Sicherheit
- Kein Groq-Key im Frontend.
- Groq wird nur optional im Hybridtest angefragt.
- Wenn Groq nicht erreichbar ist, bleibt lokale Bewertung verfügbar.

### Nächste Phase
Phase 38C.2 – sichtbare Exam Shell / Prüfungsmodus-Grundgerüst in der App.

---

## Phase 38C.2 – Sichtbare Exam Shell / Prüfungsmodus-Grundgerüst

**Status:** abgeschlossen

### Ziel
Die harte Prüfungsarchitektur aus Phase 38C.1 wurde sichtbar gemacht. Die App besitzt jetzt einen eigenen Prüfungsmodus mit Niveauauswahl, Teilnavigation und Ergebnislogik.

### Änderungen
- `js/modules/language-exam-shell.js` neu erstellt.
- `index.html` lädt die Exam Shell nach Blueprints und Engine.
- `js/modules/language-course-entry-module.js` zeigt im Sprachkurs-Dashboard eine neue Prüfungssimulation-Karte.
- `css/language-course.css` um Exam-Shell-Layout erweitert.
- `service-worker.js` Cache-Version auf `egt-trainer-g54-38c2-exam-shell` erhöht und neue Dateien gecached.
- `update-check.json` auf G54.38C.2 aktualisiert.
- `docs_PHASE38C2_EXAM_SHELL.md` erstellt.
- `tests_phase38c2_exam_shell.html` erstellt.

### Funktionen
- Prüfungssimulation öffnen
- Niveau A1 bis C2 wählen
- Session starten/fortsetzen/löschen
- Prüfungsteile Lesen, Hören, Schreiben, Sprechen navigieren
- Lesen/Hören mit lokaler Pilotbewertung
- Schreiben mit lokaler harter Vorprüfung
- Sprechen mit lokaler Engine + optional Groq-Prüfer
- Ergebnisbericht nach allen vier Teilen
- iPhone/iPad-Safe-Mode über bestätigtes Transkript/Textfeld

### Sicherheitsprinzip
Groq wird nicht als Dauer-Sprachchat verwendet. Groq wirkt nur gezielt als Prüfungslehrer bei freien Antworten mit, insbesondere im Speaking-Teil. Der API-Key bleibt weiterhin ausschließlich im Cloudflare Worker Secret.

### Nächste Phase
Phase 38C.3 sollte die echten harten Prüfungsinhalte pro Niveau beginnen. Empfehlung: B1 Pilotprüfung zuerst, weil B1 der wichtigste Realitäts-Schwellenwert ist.

---

## Phase 38C.4 – B1 Ergebnisbericht / Prüfungsreife-Prognose

**Status:** abgeschlossen

### Ziel
Aus der B1-Pilotprüfung wird ein harter Abschlussbericht erzeugt, der nicht nur Punkte anzeigt, sondern reale Prüfungsreife einschätzt.

### Änderungen

- `js/modules/language-exam-engine.js`
  - `computeFinal()` erweitert
  - Teilbereichs-Mindestleistung wird detailliert ausgewertet
  - kritische Schwächen, Stärken, Empfehlungen und Prognose werden erzeugt
  - Prüfungsreife-Prognose mit Prozentwert ergänzt

- `js/modules/language-exam-shell.js`
  - Ergebnisansicht stark erweitert
  - Teilnoten-Tabelle mit Mindestwerten und Hinweisen
  - Prüferkommentar, kritische Schwächen und Wiederholungsempfehlungen sichtbar

- `css/language-course.css`
  - neue Report-Karten, Fortschrittsbalken und Statusfarben

- `service-worker.js`
  - Cache-Version auf `egt-trainer-g54-38c4-final-report` erhöht
  - neue Test- und Dokumentationsdateien ergänzt

- `update-check.json`
  - Version auf `G54.38C.4` gesetzt

### Neue Dateien

- `docs_PHASE38C4_B1_FINAL_REPORT.md`
- `tests_phase38c4_b1_final_report.html`

### QA

- ZIP-Test erforderlich
- Node Syntax Check erforderlich
- Service Worker Asset Check erforderlich
- Kein Groq-Key im Frontend erlaubt


---

## Phase 38C.6 – B1 Aufgabenpool erweitert + harte Grenzfälle

Status: abgeschlossen.

Änderungen:
- B1-Aufgabenpool auf 5 Varianten je Teil erweitert.
- 625 mögliche B1-Kombinationen.
- Harte Grenzfall-Erkennung in der lokalen Exam Engine.
- Keine Prüfungsfreigabe, kein offizielles Zertifikat.
- Groq bleibt optionaler Prüfungslehrer für Schreiben/Sprechen.

Neue Dateien:
- docs_PHASE38C6_B1_AUFGABENPOOL_HAERTEFAELLE.md
- tests_phase38c6_b1_haertefaelle.html

Geänderte Dateien:
- data/language-b1-exam-pilot.js
- js/modules/language-exam-engine.js
- js/modules/language-exam-shell.js
- css/language-course.css
- service-worker.js
- update-check.json

---

## Phase 38C.7 – B1 Prüfungsgefühl / Timer / mobile Prüfungssimulation

**Status:** abgeschlossen  
**Datum:** 18.06.2026  
**Ziel:** Die B1-Prüfungssimulation optisch und psychologisch prüfungsnäher machen, ohne eine offizielle Prüfungsfreigabe einzubauen.

### Umsetzung
- `js/modules/language-exam-shell.js` auf `G54.38C.7-b1-exam-visual-pressure-shell` aktualisiert.
- Neuer Session-Key: `language-academy-exam-shell-session-v6-b1-visual-pressure`.
- Sichtbare Prüfungsdruck-Leiste pro Teilbereich ergänzt.
- Countdown-Timer und Zeitbalken pro Prüfungsteil ergänzt.
- Statusanzeige für abgeschlossene Teile ergänzt.
- Proctor-Hinweise in Lese-/Hör-/Schreib-/Sprechbereichen ergänzt.
- Mobile Prüfungsansicht über CSS gehärtet.
- Zeitüberschreitung wird als kritischer Bewertungsfaktor markiert.
- Keine Prüfungsfreigabe, keine Zertifikatsfreigabe, keine offizielle Zulassungslogik.

### Neue Dateien
- `docs_PHASE38C7_B1_PRUEFUNGSGEFUEHL_TIMER.md`
- `tests_phase38c7_b1_pruefungsgefuehl_timer.html`

### Geänderte Dateien
- `js/modules/language-exam-shell.js`
- `css/language-course.css`
- `service-worker.js`
- `update-check.json`
- `WORKING-PLAN_1.md`

### QA
- Node Syntax Check für Exam Shell bestanden.
- Service Worker Asset-Check bestanden.
- ZIP-Test bestanden.
- Kein echter Groq-Key im Frontend gefunden.
- Testseite vorhanden: `tests_phase38c7_b1_pruefungsgefuehl_timer.html`.

### Nächster sinnvoller Schritt
Phase 38C.8: B1 Hörprüfung von Textsimulation zu echter Audio-/TTS-naher Prüfungslogik ausbauen oder B1 Schreib-/Sprechbewertung weiter verfeinern.

---

## Phase 38C.9 · B1 Schreibprüfung hart

Status: abgeschlossen.

### Umsetzung

- B1-Schreibaufgabenpool von 5 auf 8 Varianten erweitert.
- Formelle Schreibsituationen ergänzt: Schule/Entschuldigung, Wohnung/Reparatur, Kurs/Rückerstattung.
- Strenger B1-Schreibcheck im Prüfungsmodus sichtbar gemacht.
- Lokale Prüfungsengine erweitert:
  - semantischere Pflichtpunkt-Erkennung
  - Betreff/Anlass-Regel
  - formelle Anrede / Abschluss / Höflichkeit
  - Register- und Tonprüfung
  - Punktdeckelung bei fehlender Struktur oder falschem Register
- Groq-Payload für Schreibprüfung mit strenger Prüfer-Rubrik erweitert.
- Keine Prüfungsfreigabe eingebaut.

### Testdatei

- tests_phase38c9_b1_schreibpruefung_hart.html

### Ergebnis

B1-Schreiben ist deutlich näher an einer echten Prüfung: Nicht nur Wörter zählen, sondern vollständige Aufgabe, formeller Aufbau, Ton, Pflichtpunkte und konkrete Lösung.

---

## Phase 38C.10 – B1 Sprechprüfung hart

Status: abgeschlossen

### Ziel
B1-Sprechen wurde prüfungsnäher und strenger gemacht, ohne eine Prüfungsfreigabe einzubauen. Groq bleibt kontrollierter Prüfungslehrer und bewertet nur bestätigte Transkripte.

### Umsetzung
- Sprechpool von 5 auf 8 Varianten erweitert.
- Gesamtpool jetzt 1600 B1-Kombinationen.
- B1-Sprechcheck in der Exam Shell ergänzt.
- Lokale Engine prüft Gesprächsstruktur, Höflichkeit, konkrete Informationen, Rückfragen/Lösung, Abschluss, Mindestumfang und Stichwort-Antworten.
- Harte Punktdeckelungen für Kurzantwort, Off-Topic, Stichwörter, fehlende Pflichtpunkte und unpassenden Ton ergänzt.
- Groq-Sprechprüfer-Rubrik verschärft.

### Neue Dateien
- docs_PHASE38C10_B1_SPRECHPRUEFUNG_HART.md
- tests_phase38c10_b1_sprechpruefung_hart.html

### Geänderte Dateien
- data/language-b1-exam-pilot.js
- js/modules/language-exam-engine.js
- js/modules/language-exam-shell.js
- service-worker.js
- update-check.json
- WORKING-PLAN_1.md

### QA
- Node Syntax Check erforderlich/ausgeführt.
- Service Worker Asset Check erforderlich/ausgeführt.
- Kein echter Groq-Key im Frontend.


## Phase 38C.11 – B1 Vollprüfung QA / Endsimulation

Status: abgeschlossen.

Ziel: B1 nicht weiter inhaltlich aufblähen, sondern als vollständige Prüfungsvorlage gegen reale Endfälle prüfen, bevor B2 abgeleitet wird.

Umgesetzt:
- Engine-Funktionen für komplette B1-QA-Sessions ergänzt.
- Szenarien: good-pass, borderline-pass, borderline-fail, weak-speaking, wrong-writing-topic, incomplete-listening, groq-down-fallback.
- Erwartete Entscheidungen werden automatisch validiert.
- Keine Prüfungsfreigabe eingebaut; weiterhin nur Ergebnisbericht, Prognose und Empfehlung.
- Neue Testseite: tests_phase38c11_b1_vollpruefung_qa.html.
- Neue Dokumentation: docs_PHASE38C11_B1_VOLLPRUEFUNG_QA.md.

QA:
- Node Syntax Check bestanden.
- Engine-Szenario-Validierung bestanden.
- Service Worker Cache-Version erhöht.
- Kein Groq-Key im Frontend.

Nächster Schritt empfohlen: Phase 38D.1 – B2 Prüfungsarchitektur, da B1 jetzt als harte Vorlage stabilisiert ist.


---

## Phase 38C.12A – Academy-Hartmodus UX-Fix

Status: abgeschlossen.

Nutzerfeedback umgesetzt:

- Kontraste im Prüfungsmodus repariert.
- Helle Karten mit heller Schrift entfernt.
- Prüfungsfenster größer gemacht.
- Scroll-Verhältnis verbessert.
- Mobile Prüfung nahezu Fullscreen.
- Standard-/Einfachmodus bewusst gestrichen: Der Prüfungsbereich ist jetzt konsequent Academy-Hartmodus.
- B2-Pilotdaten aus Phase 38D.1 bleiben erhalten.

Nächste empfohlene Phase:

- Phase 38C.12B – Hörprüfung UI/Fallback weiter schärfen.
- Phase 38C.13 – Grammatik & Sprachbausteine als zusätzlicher Hardmode-Block.



## Phase 38C.12A.2 – Deep Contrast + Listening Text Fallback QA
- Reaktion auf Nutzer-Screenshot: weitere Kontrastprobleme in Hörstatus/Transkript/Antwortbereich behoben.
- TTS-Fallback robust gemacht: keine Ausgabe „Kein Hörtext vorhanden“ mehr, selbst wenn A1/A2 noch keine eigenen Pilot-Hörtexte besitzen.
- Testseite ergänzt: tests_phase38c12a2_deep_contrast_listening_qa.html.
- Chromium-Screenshot-QA vorbereitet.
