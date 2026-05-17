# Eignungstest-Trainer V5.1.3 Cloud Diagnostics Stable

## Architekturprinzip

Die App ist jetzt als Framework-Baum organisiert:

- Stamm: Core, Storage, Engine, Runtime und PWA
- Dicke Äste: Fachmodule wie Mathe, Allgemeinwissen, IT, EDV, Logik, Konzentration, Visual IQ und Route Memory
- Blätter: einzelne Generatoren, Renderer und Interaktionsfunktionen

Die Runtime bleibt für maximale PWA-Kompatibilität als `js/app.js` gebündelt. Die Wartung erfolgt ab V5.1.3 über die modularen Source-Dateien unter `js/src/`.

## Wichtigste Source-Struktur

```text
js/src/
  core/
    000-bootstrap-framework.part
    140-exam-state-helpers.part
  storage/
    010-storage-database.part
  engines/
    020-analytics-coach-engines.part
  data/
    030-question-bank-contracts.part
  factory/
    040-question-factory.part
    150-generator-registry-open.part
  modules/
    knowledge/
      100-knowledge-data.part
      151-knowledge-generator.part
    english/
      110-english-data.part
    it/
      120-it-data.part
      152-it-generator.part
    math/
      153-math-generators.part
      157-math-sprint-generator.part
    logic/
      154-logic-generators.part
    concentration/
      155-concentration-generators.part
    visual/
      156-visual-iq-generators.part
    route-memory/
      158-route-memory-generator.part
    edv/
      130-edv-schema-data.part
      159-edv-multi-generator.part
    interactive/
      180-interactive-state-modules.part
  renderers/
    170-edv-renderer.part
  ui/
    900-runtime-ui-core.part
```

## Wartungsregel

Neue Aufgaben oder Generatoren werden nicht mehr direkt in `js/app.js` geschrieben.

Stattdessen:

- Mathe-Aufgaben: `js/src/modules/math/`
- Allgemeinwissen: `js/src/modules/knowledge/`
- IT/FISI: `js/src/modules/it/`
- EDV-Schema/Multi-Choice: `js/src/modules/edv/`
- Logik: `js/src/modules/logic/`
- Konzentration: `js/src/modules/concentration/`
- Visual IQ/Mechanik: `js/src/modules/visual/`
- Route Memory: `js/src/modules/route-memory/`

Danach `node js/build/build-app-bundle.js` ausführen.

## Stabilitätsstatus

- Framework-Version: 5.1.3
- Cache: eignungstest-trainer-v513-cloud-highscore-cache
- Storage-Key: eignungstest_trainer_v513_results
- Profil-Key: eignungstest_trainer_profile_v513
- EDV: 1 Multi-Choice-Gesamtaufgabe + 10 technische Platzhalter für 11 Wertungspunkte
- CTC-Lohr Simulation: 93 Aufgaben

