# G46.1 — Übergabe für nächsten Chat / nächsten KI-Arbeiter

**Datum:** 2026-06-15  
**Aktueller Stand:** Phase 8 abgeschlossen.  
**Diese ZIP ist ein Übergabestand. Es wurde keine neue Fachlogik eingebaut.**

---

## 1. Ziel des Gesamtumbaus

Die App wird von einem großen `app.js`-Monolithen in eine saubere Architektur aufgeteilt:

```text
Shell
  → AppModuleHost
    → Entry-Module
    → Branch-Simulationsmodule
    → EGTSimulation
    → Practice-Modul
    → Generator-/Pool-/Quiz-Orchestrator-Schichten
```

Langfristiges Ziel:

- neue Branchen sollen später nahezu nach Vorlage ergänzt werden können,
- neue Module sollen registriert werden, ohne überall in `app.js` zu ändern,
- UI-/Darstellungsfehler werden später zentral repariert,
- Fachlogik, Renderer, Datenpools, Result, Highscore, Coach, Admin und Profil sollen sauber getrennt sein.

---

## 2. Bisher erledigte Hauptphasen

### Phase 2A bis 2G — Simulation modularisiert

Erledigt:

- `EGTSimulation` eingeführt.
- Simulation startet über ModuleHost-/Adapter-Grenze.
- Standard-Multiple-Choice-Rendering ins Simulationsmodul verlagert.
- Fragenübersicht / QuestionNav ins Simulationsmodul verlagert.
- Result-Header-/Result-Boundary vorbereitet.
- Route-Memory / Busfahrtroute als Spezialrenderer ins Simulationsmodul verlagert.
- EDV-Multi als Spezialrenderer ins Simulationsmodul verlagert.

Wichtige Dateien:

- `js/modules/egt-simulation-engine.js`
- `css/egt-simulation.css`

Bewusste Grenzen:

- Spezialgeneratoren selbst sind noch nicht vollständig ausgelagert.
- Result-/Review-/Highscore-/Coach-Details hängen noch teilweise in `js/app.js`.

---

### Phase 3A bis 3D — Shell / ModuleHost / Entry-Grenzen

Erledigt:

- `AppModuleHost` eingeführt.
- Branch-Kontext eingeführt.
- Entry-Module für Home, Simulation, Practice, Admin, Profile, Coach, Analysis, Highscore und Duel eingeführt.
- UI-Router leitet viele Türen über `AppModuleHost.startModule(...)`.

Wichtige Dateien:

- `js/core/module-host.js`
- `js/modules/egt-home-module.js`
- `js/modules/egt-simulation-entry-module.js`
- `js/modules/egt-practice-entry-module.js`
- `js/modules/egt-admin-entry-module.js`
- `js/modules/egt-profile-entry-module.js`
- `js/modules/egt-coach-entry-module.js`
- `js/modules/egt-analysis-entry-module.js`
- `js/modules/egt-highscore-entry-module.js`
- `js/modules/egt-duel-entry-module.js`

Bewusste Grenzen:

- Admin/Profile/Highscore/Coach/Duell-Fachlogik wurde nicht tief verändert.
- Es wurden nur Einstiegspunkte/Lifecycle-Grenzen geschaffen.

---

### Phase 4 — Practice-Modul

Erledigt:

- echtes freies Lern-/Übungsmodul erstellt.
- `window.EGTPracticeModule` eingeführt.
- `practice` als Modul registriert.

Wichtige Dateien:

- `js/modules/egt-practice.js`
- `css/egt-practice.css`

Bewusste Grenzen:

- Generatoren und Übungsdaten sind noch nicht final fachlich getrennt.

---

### Phase 5 — Branch-Simulationsmodule

Erledigt:

- branchenspezifische Simulationsmodule erstellt:
  - `sim-it`
  - `sim-kaufm`
  - `sim-sozial`

Wichtige Dateien:

- `js/modules/egt-sim-it.js`
- `js/modules/egt-sim-kaufm.js`
- `js/modules/egt-sim-sozial.js`

Bewusste Grenzen:

- Die Module sind aktuell Fachrichtungs-Türen.
- Die eigentliche tiefe Generator-/QuestionBank-Struktur wurde danach in Phase 6/7/8 vorbereitet, ist aber noch nicht final.

---

### Phase 6 — BranchQuestionPools

Erledigt:

- `EGTBranchQuestionPools` eingeführt.
- Branch-Profile für IT/FISI, Kaufmännisch, Sozialpädagogik und Wissen definiert.
- Branch-Gewichtung vorbereitet.

Wichtige Datei:

- `js/core/branch-question-pools.js`

Bewusste Grenzen:

- Die echten Datenpools liegen noch in bestehenden Daten-/Generatorstrukturen.
- Es ist noch keine komplett fertige QuestionBank-Architektur pro Branch.

---

### Phase 7 — GeneratorRegistry

Erledigt:

- `EGTGeneratorRegistry` eingeführt.
- Generator-Pool-Blueprints aus `app.js` herausgezogen.
- `app.js` nutzt zuerst Registry-Resolver und hat Fallbacks.

Wichtige Datei:

- `js/core/generator-registry.js`

Bewusste Grenzen:

- Generatorfunktionen selbst liegen noch überwiegend in `js/app.js`.
- `generateQuestionForMode(...)` ist noch nicht ausgelagert.

---

### Phase 7.5 — Smoke-Test-Handoff

Erledigt:

- Testcheckliste erstellt.
- Nutzer hat Screenshots/Darstellungsprobleme gesammelt.
- Entscheidung: Darstellungsfehler nicht jetzt komplett fixen, solange sie keine Bedienblocker sind.
- Weiter mit Architekturumbau.

Wichtige Datei:

- `QA-SMOKE-TEST-CHECKLIST-G45.1.md`

Regel ab jetzt:

- Nur Blocker sofort fixen.
- Reine UI-/CSS-Fehler später gesammelt in einer eigenen UI-/Device-Fixphase beheben.

---

### Phase 8 — Quiz-Orchestrator

Erledigt:

- `EGTQuizOrchestrator` eingeführt.
- `buildQuiz()` in `js/app.js` ist jetzt Wrapper.
- alte Logik liegt als `buildQuizInternal()` als Fallback vor.
- Orchestrator übernimmt kontrolliert:
  - Matrix-Sprint-Sonderfall,
  - Reset verwendeter Fragen,
  - Modus-Vorbereitung,
  - Coach-Erstellung,
  - Memory-Fragen,
  - Kernfragen-Erzeugung über Hook,
  - DNA-/Qualitätsvalidierung,
  - Duplikat-Schutz,
  - Fallback-Duplikate,
  - finale Reihenfolge.

Wichtige Datei:

- `js/core/quiz-orchestrator.js`

Bewusste Grenzen:

- `generateQuestionForMode(...)` bleibt noch in `js/app.js`.
- Generatorfunktionen bleiben noch in `js/app.js`.
- QuestionBank-/Datenpool-Grenzen sind noch nicht final.
- Result/Review/Highscore/Coach/Admin/Auth wurden nicht verändert.

---

## 3. Aktueller Architekturstand G46.1

Aktiv vorhanden:

- `window.AppModuleHost`
- `window.EGTSimulation`
- `window.EGTPracticeModule`
- `window.EGTBranchQuestionPools`
- `window.EGTGeneratorRegistry`
- `window.EGTQuizOrchestrator`

Wichtige Core-Dateien:

- `js/core/module-host.js`
- `js/core/branch-question-pools.js`
- `js/core/generator-registry.js`
- `js/core/quiz-orchestrator.js`
- `js/core/architecture-guard.js`
- `js/core/app-config.js`

Wichtige Modul-Dateien:

- `js/modules/egt-simulation-engine.js`
- `js/modules/egt-practice.js`
- `js/modules/egt-sim-it.js`
- `js/modules/egt-sim-kaufm.js`
- `js/modules/egt-sim-sozial.js`
- Entry-Module in `js/modules/egt-*-entry-module.js`

---

## 4. Was bewusst NICHT jetzt gemacht wurde

Nicht erledigt und nicht versehentlich behaupten:

- keine finale UI-/CSS-Bereinigung,
- keine vollständige Datenbank-/QuestionBank-Trennung,
- keine vollständige Generator-Auslagerung,
- keine vollständige Result-/Review-Auslagerung,
- keine Highscore-/Supabase-Reparatur,
- keine Firebase-/Auth-/Admin-Tiefenreparatur,
- keine Coach-Memory-Tiefenreparatur,
- kein vollständiger Live-Browser-Gerätetest in dieser Übergabe.

---

## 5. Nächster empfohlener Schritt

### Phase 9 — QuestionBank-/Datenpool- und `generateQuestionForMode`-Grenze

**Ziel:** Der nächste Architektur-Schnitt soll `generateQuestionForMode(...)` und/oder die QuestionBank-/Datenpool-Auswahl aus `js/app.js` weiter lösen.

Empfohlene sichere Reihenfolge:

1. Bestand in `js/app.js` analysieren:
   - `generateQuestionForMode(...)`
   - Generatorfunktionen,
   - Datenbankzugriffe,
   - Branch-/Mode-Auswahl,
   - Fallbacks.
2. Neue Core-Datei erstellen, z. B.:
   - `js/core/question-factory.js`
   - oder `js/core/question-bank-resolver.js`
3. Nicht alles auf einmal verschieben.
4. Zuerst nur eine Kontroll-API bauen, z. B.:
   - `EGTQuestionFactory.generate(ctx)`
   - `EGTQuestionFactory.resolveSource(mode, branch, profile)`
5. `app.js` als Wrapper/Fallback erhalten.
6. Version erhöhen auf `G47.0`.
7. `WORKING-PLAN_1.md` und `docs/WORKING-PLAN.md` aktualisieren.
8. Arbeitsnachweis erstellen:
   - `docs/G47_0_PHASE9_QUESTION_FACTORY_REPORT.md`
   - `docs/G47_0_PHASE9_QUESTION_FACTORY_QA.json`
9. Service Worker, Manifest und Module-Manifest aktualisieren.
10. Syntax-/JSON-/Asset-/ZIP-Test durchführen.

---

## 6. Wichtige Arbeitsregeln für den nächsten Chat

1. Nach jeder Phase den Working Plan aktualisieren.
2. Immer beide Working-Plan-Dateien aktualisieren:
   - `WORKING-PLAN_1.md`
   - `docs/WORKING-PLAN.md`
3. Immer Arbeitsnachweis in `docs/` erstellen.
4. Immer QA-JSON in `docs/` erstellen.
5. Keine alten Fallbacks entfernen, solange keine echte Browser-QA erfolgt ist.
6. Keine CSS-Großreparatur mitten in Architekturphasen, außer ein Fehler blockiert Bedienung/Test.
7. Keine Admin/Auth/Firebase/Highscore-Logik nebenbei anfassen.
8. Jede neue Datei in `index.html`, `service-worker.js`, `architecture-guard.js` und `module-manifest.json` prüfen/eintragen, wenn relevant.
9. Version sauber hochzählen:
   - nächste Architekturphase: `G47.0`.
10. Nach Erstellung der ZIP statische Tests durchführen.

---

## 7. Bekannte offene Baustellen nach Priorität

### Architektur hoch

- `generateQuestionForMode(...)` aus `app.js` lösen.
- QuestionBank-/Datenpool-Grenzen pro Branch sauberer machen.
- Generatorfunktionen schrittweise aus `app.js` verschieben.
- Result-/Review-Logik modularisieren.

### Funktional hoch

- Highscore öffnet/zeigt möglicherweise falsche Ansichten; später separat prüfen.
- Admin/Profile/Auth müssen später tief geprüft und gehärtet werden.
- Demo-/Code-/Rollen-/Teilnehmerverwaltung später sauber machen.

### UI hoch, aber später gesammelt

- Konzentrationsaufgaben/Zahlen kleben teilweise.
- Tabellen/Scanner teils schlecht lesbar.
- Mobile/iPad/Desktop-Darstellung muss gesammelt gefixt werden.
- Deep-Sheet-/Bottom-Menü-Politur später zentral.

---

## 8. Empfohlener weiterer Phasenplan

```text
G47.0 / Phase 9   → QuestionFactory / generateQuestionForMode-Grenze
G48.0 / Phase 10  → QuestionBanks / Datenpools pro Branch sauberer strukturieren
G49.0 / Phase 11  → Result / Review / Fehleranalyse modularisieren
G49.5             → Screenshot-basierte UI-/Device-Fixphase
G50.0 / Phase 12  → Highscore / Coach / Duell härten
G51.0 / Phase 13  → Admin / Profile / Auth / Rollen / Codes härten
G52.0 / Phase 14  → Final QA / PWA / Cache / Geräte / Verkaufsreife
```

Die Reihenfolge kann angepasst werden, aber **Phase 9 sollte als nächstes kommen**, wenn keine harten Blocker aus den Screenshots vorliegen.

---

## 9. Übergabe-Status

**Aktueller Stand:** G46.1  
**Phase:** Phase 8 abgeschlossen, Übergabe vorbereitet.  
**Nächster Schritt:** Phase 9 starten.  
**Nicht vergessen:** Working Plan nach Phase 9 wieder aktualisieren.
