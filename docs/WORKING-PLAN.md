# 🎯 AKTUELLER ARBEITSSTAND — G54.7 / SUPABASE AKTIVIERT

**Status:** Supabase-Cloud-Highscore aktiviert. Ranglisten jetzt geräteübergreifend.

## Was in G54.7 gemacht wurde
- `data/cloud-config.js`: Supabase aktiviert (`enabled:true`, `provider:"supabase"`)
  - supabaseUrl: https://ejlpxdjariucuxqlvepe.supabase.co
  - anonKey: sb_publishable_... (Publishable-Key-Format)
  - table: highscores, classCode: default
- Validierung bestanden: URL-Format ok, Key-Länge ok, als Publishable-Key erkannt
- Engine (`js/modules/highscore-engine.js`) unterstützt sb_publishable_-Keys nativ:
  nutzt apikey-Header, mit Auto-Fallback auf Authorization:Bearer
- App lädt stabil mit aktivierter Config, kein JS-Fehler
- Hinweis: Lesetest im Sandbox-Container nicht möglich (kein Internet). Live mit
  Internet greift die App auf Supabase zu. Falls "Failed to fetch" trotz Internet:
  Supabase-Tabelle "highscores" / RLS-Policies prüfen (siehe System-Diagnose im Admin).

## WICHTIG für Supabase live
Die Tabelle `highscores` muss in Supabase existieren mit passenden RLS-Policies
(SELECT + INSERT für anon/publishable erlauben, sonst kommen GET/POST-Fehler).
Diagnose in der App: Admin → System → "Supabase Cloud Diagnose".

---

# 🎯 AKTUELLER ARBEITSSTAND — G54.6 / HIGHSCORE-FIX + CONFIG-CHECK

**Status:** Highscore-Menü-Bug behoben, Firebase/Supabase-Config geprüft.

## Was in G54.6 gemacht wurde

### Highscore öffnete nicht (Bottom-Menü → Mehr → Highscore → "Highscore öffnen")
**Ursache:** Der "Highscore öffnen"-Button hat `data-ui-nav="tab" data-tab="highscore"`. Der zentrale Klick-Handler in `js/ui-router.js` hatte aber `ACTION_SELECTOR = '[data-ui-action], #egtBottomDock .egt-dock-btn[data-tab]'` — `[data-ui-nav="tab"]` war NICHT enthalten, der Klick wurde gar nicht erfasst.
**Fix (kein Code dupliziert):**
1. `ACTION_SELECTOR` um `[data-ui-nav="tab"][data-tab]` erweitert
2. Im `run()`-Handler: `data-ui-nav="tab"`-Buttons durchlaufen dieselbe Tab-Logik wie Dock-Buttons (gateAction + Tab-Verzweigung)
3. Zusätzlich: Bei `data-ui-nav="tab"`-Klick aus einem offenen Sheet wird das Zwischen-Sheet zuerst geschlossen (`closeUiLayerBeforePortal` + DeepSheet-Close), damit der Highscore-Tab-Inhalt nicht verdeckt bleibt.
**Verifiziert:** Highscore öffnet vollständig (Zeitraum-Tabs Heute/Woche/Monat/Gesamt, Cloud-Status, Ranglisten-Plätze sichtbar).

### Firebase/Supabase-Config geprüft
- **Firebase** (`data/admin-sync-config.js`): ✅ vollständig, `enabled:true`, projectId `bbq-userdatabase`, alle Schlüssel konsistent über 3 Config-Ebenen, courseId `course_2026_gk`, Admin-Whitelist korrekt.
- **Supabase** (`data/cloud-config.js`): ⚠️ BEWUSST deaktiviert (`enabled:false`, `provider:"local"`, leere URL/Key). Kommentar: "Phase 2: Cloud-Highscore bewusst deaktiviert für stabile Offline-PWA." Kein Bug. Zum Aktivieren: enabled:true, provider:"supabase", supabaseUrl+anonKey eintragen.

---

# 🎯 AKTUELLER ARBEITSSTAND — G54.5 / CTC-LOHR 100% GEHÄRTET

**Status:** CTC-Lohr Simulation (IT/FISI → CTC) wurde vollständig verifiziert und gehärtet.
**Fokus dieser Session:** Ausschließlich CTC-Bereich. Blockreihenfolge und Timer 100% sicher machen.

## Was in G54.5 gemacht wurde (CTC-Lohr)

### 1. Zahlenreihen-Block ergänzt (FEHLTE komplett!)
Die Vorgabe war Allgemeinwissen → Mathe → Regelrechnung **+ Zahlenreihen** → ... Der Zahlenreihen-Block (6 Aufgaben/40 Sek) war nicht im Code. Jetzt eingebaut in `js/core/ctc-lohr-exam-structure-engine.js`:
- Neue Block-Reihenfolge (68 Fragen / 37 Min): **Allgemeinwissen (40) → Mathe-Sprint (9) → Regelrechnung (6) → Zahlenreihen (6) → Buchstaben (4) → Tabellen (2) → FlowLogic (1)**
- `numberSeriesQuestion`-Generator: 5 anspruchsvolle Muster, im Kopf lösbar, Eingabefeld (kein MC)
- Typ `ctcNumberSeriesInput` an 5 Handler-Stellen in `app.js` + Rendering in `renderCtcLohrInputAnswers` + CSS in `css/ctc-lohr-real-exam.css`

### 2. ⚠️ KRITISCHER BUG behoben: Blockreihenfolge war zerstört
**Problem:** Das echte gebaute Quiz hatte 58× Allgemeinwissen, 9× Mathe, 1× Regelrechnung — KEINE Zahlenreihen/Buchstaben/Tabellen/FlowLogic! 
**Ursache:** `js/core/quiz-orchestrator.js` (und `quiz-build-pipeline-engine.js`) nutzten eine **Dedup-Schleife** mit `index = out.length`. Bei identischen Aufgabentexten (z.B. "Berechne die Aufgabe…") wurden Block-Fragen als Duplikate verworfen → `out.length` fror bei 50 ein → Engine wurde ~300× mit Index 50 aufgerufen → nach 150 Fehlversuchen Abbruch → Rest mit Allgemeinwissen aufgefüllt.
**Fix:** CTC-Lohr-Sonderfall in `quiz-orchestrator.js` UND `quiz-build-pipeline-engine.js` (`buildQuizInternal`): direkter sequenzieller Engine-Build OHNE Dedup, da die Engine bereits eindeutige, fest sortierte Fragen liefert. Signatur wird pro Position eindeutig gemacht (`|posN`).
**Verifiziert:** Quiz hat jetzt exakt 40/9/6/6/4/2/1, Reihenfolge korrekt, FlowLogic immer letzter.

### 3. Scope-Sicherheit gehärtet
`isItCtcScope()` in der Engine gab bei **leerem Input** fälschlich `true` zurück (Defaults zeigten auf CTC). Jetzt: ohne explizite Profilangaben → `false`. CTC erscheint nur bei `branch='it' && mode='ctcLohr' && pool='it-ctc' && simType='ctc'`. Getestet: nicht in BPS/Training/Sozial/Kaufmännisch.

### 4. UI-Bug behoben: Timer-Ring ↔ Fragen-Button-Kollision
**Problem (aus User-Screenshot):** „Fragen"-Button überlappte mit dem Timer-Ring oben rechts; doppelter „Fragen"-Text.
**Ursache:** Mehrere widersprüchliche CSS-Regeln mit `!important` in `css/egt-simulation.css` + `css/ui-ios-coach-polish.css` positionierten den Button per `top: ...+102px/+88px/+116px` (oben am Timer). Zusätzlich setzte JS `innerHTML="Fragen"` UND CSS `::before content`.
**Fix:** 
- Button-Position überall auf `bottom` (unten rechts, Floating) vereinheitlicht
- Button wird jetzt an `document.body` gehängt (nicht an `#quiz`), damit `position:fixed` zuverlässig zum Viewport rechnet (iOS-Fix — vorher rutschte er außerhalb des Bildes)
- JS `innerHTML` geleert, nur CSS `::before` liefert „☷ Fragen" / „✕ Schließen"
**Verifiziert:** Keine Überlappung auf Desktop/iPad-Hoch/iPad-Quer/iPhone, Button überall sichtbar.

### 5. Geräteübergreifend getestet (Playwright headless)
Desktop (1280×900), iPad-Hoch (768×1024), iPad-Quer (1024×768), iPhone (390×844) — alle sauber.

## CTC-Lohr Dateien (für nächste KI)
- `js/core/ctc-lohr-exam-structure-engine.js` — **zentrale Block-Definition** (BLOCKS-Konstante, Generatoren). Hier Blöcke/Zeiten/Aufgaben ändern.
- `js/core/quiz-orchestrator.js` — CTC-Lohr-Sonderfall (Zeile ~69), direkter Engine-Build
- `js/core/quiz-build-pipeline-engine.js` — CTC-Lohr-Sonderfall in `buildQuizInternal` (Fallback)
- `js/app.js` — `renderCtcLohrInputAnswers` (Eingabe-Rendering), `ctcNumberSeriesInput` an 5 Stellen, `ensureQuestionDrawerToggle` (Button an body)
- `js/modules/egt-simulation-engine.js` — CTC-Input-Dispatch (Zeile ~762)
- `css/ctc-lohr-real-exam.css` — CTC-Eingabe-Styles (Regelrechnung, Buchstaben, Zahlenreihen, Tabellen)
- `css/egt-simulation.css` + `css/ui-ios-coach-polish.css` — qnav-Button-Position (jetzt bottom)
- `modules/flowlogic/` — FlowLogic-Modul (eigenständig), Adapter: `js/modules/ctc-flowlogic-adapter.js`

## CTC-Lohr Simulation starten (für Tests)
1. Berechtigte Session VOR dem Laden setzen (localStorage `egt_auth_profile_session_v1` mit role:'admin')
2. Gate entfernen, `window.EGT_ACTIVE_QUESTION_PROFILE = {branch:'it', mode:'ctcLohr', poolKey:'it-ctc', simType:'ctc'}`
3. `App.selectMode('ctcLohr')` dann `App.prepareTest()`
4. Block-Intro erscheint (`#blockIntro`) → Button `#blockIntroStartBtn` klicken (ruft `App.startCtcBlockFromIntro()`)
5. `canStartMode('ctcLohr')` erfordert berechtigten Nutzer (sonst Abbruch in prepareTest)

## NOCH OFFEN (nächste Schritte für CTC)
- [ ] Ergebnisfluss vollständig testen: offene Antworten zählen, Blockauswertung, Gesamtwertung, Coach-Auswertung erst danach
- [ ] „Test beenden" → Auswertung + „Zurück zur Startseite"-Button verifizieren (User erwähnte fehlenden Rückweg früher)
- [ ] Vollständigen Durchlauf aller 68 Fragen testen (alle Block-Übergänge, Block-Intros)

---



---



## G51.2 · Answer Stability / Layout Guard Fix — 2026-06-15

Status: umgesetzt, visuell zu prüfen.

Problem: Nach Aufgabenrender sprangen Antwortkarten sichtbar, weil `layout-guard-engine.js` die produktive Klasse `training-cockpit` nach ca. 120 ms entfernte.

Maßnahmen:
- `training-cockpit` aus Experiment-Cleanup entfernt.
- Cockpit-Klasse während aktiver Simulation wiederherstellbar gemacht.
- Antwortcontainer stabilisiert.
- Touch-Hover/Active-Transform für Antwortkarten auf iPad/iPhone deaktiviert.

Testziel: Aufgabe starten, 1–2 Sekunden warten, Antwortpositionen müssen unverändert bleiben.

# AKTUELLER ARBEITSSTAND — G49.0 / PHASE 11 ABGESCHLOSSEN

**Status:** Phase 11 ist abgeschlossen. Die App steht jetzt auf `G49.0`.
**Wichtigstes Dokument für Fortsetzung:** `docs/G49_0_PHASE11_RESULT_REVIEW_ENGINE_REPORT.md`
**Nächster empfohlener Schritt:** G49.0 Browser-Smoke-Test, danach entweder Phase 12 Persistenz/Highscore/Coach-Hooks oder bei starkem Layout-Shift G49.5 No-Shift/UI-Fixphase.

## Arbeitsregel ab jetzt

Nach jeder Phase müssen immer aktualisiert werden:

1. `WORKING-PLAN_1.md`
2. `docs/WORKING-PLAN.md`
3. ein Arbeitsnachweis in `docs/`
4. eine QA-Datei in `docs/`
5. Version / Manifest / Service Worker, falls Dateien oder Cache betroffen sind

Große CSS-/Darstellungsfehler werden später gesammelt behoben. Sofort reparieren nur, wenn Bedienung/Test blockiert ist.

---

# 🗂️ WORKING-PLAN — Eignungstest-Trainer · Modularisierung

> **Dieses Dokument ist der zentrale Fahrplan.** Jede KI (und der Mensch) liest ZUERST dieses Dokument, bevor sie etwas ändert. Nach JEDEM Arbeitsschritt wird dieses Dokument aktualisiert: Häkchen setzen, „HIER SIND WIR JETZT"-Marker verschieben, neue Erkenntnisse eintragen.

---

## 1. WAS HABEN WIR VOR? (Die Vision)

Der **Eignungstest-Trainer** ist eine PWA zur Vorbereitung auf Eignungstests (BPS, später CTC) in verschiedenen Branchen (IT, Kaufmännisch, Soziales, Technisch). Vermarktbar, mit echtem Firebase-Backend (datenbankübergreifend).

**Das Ziel der aktuellen Phase:** Die App von einem 5378-Zeilen-Monolithen (`app.js`) in **saubere, eigenständige Module** zerlegen. Jedes Modul hat EINE Aufgabe, EINE Datei, klare Schnittstellen. Damit:
- weiß man immer **wo** ein Bug sitzt
- weiß man immer **wo** man ein neues Feature andockt
- verrutscht **nichts mehr**, wenn ein Feature dazukommt
- kann jede KI step-by-step weiterarbeiten

---

## 2. WARUM IST DIE APP „ZERSCHOSSEN"? (Die Diagnose)

Die App ist über ~40 Versionen organisch gewachsen. Das Kernproblem:

1. **`app.js` ist ein 5378-Zeilen-Monolith.** Er enthält ALLES vermischt: Fragen-Generierung, Quiz-Steuerung, Timer, Frageübersicht, Profil-Logik, Home-Trigger, Ergebnis-Auswertung. Jede Änderung an einem Teil kann einen anderen Teil zerschießen.

2. **Kein Kapselungs-Prinzip.** Funktionen greifen direkt auf globale Variablen (`state`, `MODES`) zu. Ändert man eine, bricht potenziell alles.

3. **CSS-Chaos.** Layout-Regeln sind über `app.css`, `ui-foundation.css`, `ui-nav-foundation.css` verstreut, oft mit `!important` übereinander geschichtet → Layout verrutscht (z.B. Frageübersicht-Drawer, Timer-Ring-Kollision).

4. **Versions-Chaos.** Version steht hartcodiert an ~5 Stellen (`service-worker.js`, `update-check.json`, `manifest.json`, `app-config.js` (LEER!), Cache-Name). Inkonsistenz → JS-Crash, Cache-Probleme.

---

## 3. AKTUELLE ARCHITEKTUR (Ist-Zustand, Stand G39.14.6)

### JS-Dateien (21.871 Zeilen gesamt)

| Datei | Zeilen | Aufgabe | Status |
|-------|--------|---------|--------|
| `js/app.js` | **5441** | ⚠️ MONOLITH, aber Simulation startet jetzt über EGTSimulation-Adapter | weiter schrittweise zerlegen |
| `js/admin-participant-engine.js` | 4208 | Admin-Portal + UserDatabase | ✅ fertig, sauber |
| `js/ui-home-renderer.js` | 2027 | Startseite-Rendering | teilweise sauber |
| `js/learning-coach-engine.js` | 2021 | KI-Coach Logik | ✅ eigenes Modul |
| `js/modules/auth-profile-shell.js` | 1049 | Profil-Top-Button + Shell | ✅ eigenes Modul |
| `js/modules/highscore-engine.js` | 1049 | Highscore | ✅ eigenes Modul |
| `js/python-quest-module.js` | 821 | Python-Lernspiel | ✅ eigenes Modul |
| `js/learning-coach-ui.js` | 709 | Coach-UI | ✅ eigenes Modul |
| `js/core/deep-sheet-controller.js` | 682 | Sheet-Steuerung | ✅ Core |
| `js/feedback-sheet.js` | 590 | Feedback/Bug | ✅ eigenes Modul |
| `js/modules/egt-gate-screen.js` | 540 | Sperrbildschirm/Login-Gate | ✅ eigenes Modul |
| `js/modules/egt-simulation-engine.js` | **324** | ✅ Simulation-ModuleHost + Kontroll-API + Events | Phase 2B aktiv |
| `js/modules/egt-auth-engine.js` | 380 | Firebase-Auth-Bridge | ✅ eigenes Modul |
| `js/ui-router.js` | 333 | UI-Routing | ✅ Core |
| `js/modules/cinematic-intro.js` | 329 | Intro-Animation | ✅ eigenes Modul |
| `js/modules/egt-ticket-system.js` | 305 | Ticket-System | ✅ eigenes Modul |
| `js/question-bank-quality-engine.js` | 176 | Fragen-Qualitätsprüfung | ✅ Core |
| `js/core/github-sync.js` | 164 | GitHub-Sync | ✅ Core |
| `js/modules/layout-guard-engine.js` | 159 | Layout-Schutz | ✅ Core |
| `js/coach-dna-engine.js` | 132 | Coach-Personalisierung | ✅ eigenes Modul |
| `js/core/architecture-guard.js` | 124 | Architektur-Schutz | ✅ Core |
| `js/modules/egt-user-notices.js` | 112 | Warnungs-Popup beim Nutzer | ✅ eigenes Modul |
| `js/learning-task-generator.js` | 107 | Lernaufgaben-Generator | ✅ eigenes Modul |
| `js/essay-mode.js` | 65 | Aufsatz-Modus | ✅ klein |
| `js/core/*` (diverse) | <50 je | event-bus, state-manager, router, schema, feature-gates | ✅ Core |
| `js/core/app-config.js` | **42** | ✅ zentrale Version/Build/Cache-Config | aktiv |

### CSS-Dateien

| Datei | Zeilen | Aufgabe |
|-------|--------|---------|
| `css/admin-portal.css` | 4753 | Admin-Portal (✅ vollständig) |
| `css/ui-foundation.css` | 2981 | Basis-UI + Startseite |
| `css/learning-coach.css` | 849 | Coach |
| `css/ui-nav-foundation.css` | 564 | Navigation |
| `css/app.css` | 411 | ⚠️ Quiz/Simulation (Layout-Bugs hier!) |
| `css/egt-gate.css` | 334 | Login-Gate |
| `css/egt-simulation.css` | **173** | ✅ Simulation-Layout-Layer: Timer, Drawer, Antworten |
| `css/cinematic.css` | 163 | Intro |
| `css/python-quest.css` | 20 | Python-Quest |

### Datenpools (Fragen)
`data/question-bank.js`, `question-bank-kaufm.js`, `question-bank-sozial.js`, `question-bank-it-extra.js`, `question-bank-mathe.js`, `learning-math-tasks.js` (+extended)

### Firebase-Config (gültig, NICHT ändern)
```
projectId: bbq-userdatabase
databaseURL: https://bbq-userdatabase-default-rtdb.europe-west1.firebasedatabase.app
courseId: course_2026_gk
Admin-E-Mail: ugurcan.boz@googlemail.com (adminEmails-Whitelist)
Session-Key: egt_auth_profile_session_v1
Learner-Cache: egt_global_learner_profiles
```

---

## 4. ZIEL-ARCHITEKTUR (Soll-Zustand: die Module)

| # | Modul | Datei (geplant) | Aufgabe | Quelle (woraus extrahieren) |
|---|-------|-----------------|---------|------------------------------|
| 1 | **Startseite** | `js/modules/egt-home.js` | Grundgerüst, einheitliche Kacheln, Branchen-Verzweigung | aus `ui-home-renderer.js` + `app.js:renderModes` |
| 2 | **Registration** | `js/modules/egt-gate-screen.js` | ✅ existiert (Register-Form im Gate) | — |
| 3 | **Loginportal** | `js/modules/egt-auth-engine.js` + `egt-gate-screen.js` | ✅ existiert | — |
| 4 | **Adminportal** | `js/admin-participant-engine.js` | ✅ existiert, fertig | — |
| 5 | **Profilbereich** | `js/modules/auth-profile-shell.js` | ✅ existiert | — |
| 6 | **Dozent-Bereich** | (in `admin-participant-engine.js`) | ✅ existiert (Dozentenblick) | evtl. später eigenes Modul |
| 7 | **KI Coach** | `js/learning-coach-engine.js` + `-ui.js` | ✅ existiert | — |
| 8 | **★ Simulation (BPS)** | `js/modules/egt-simulation-engine.js` + `css/egt-simulation.css` | ✅ ModuleHost/Adapter aktiv; interne Logik noch teilweise in `app.js` | aus `app.js` Quiz-Logik |
| 9 | **Simulation IT (BPS/CTC)** | `js/modules/egt-sim-it.js` | konfiguriert Modul #8 | Copy-Paste von #8 |
| 10 | **Simulation Kaufmännisch** | `js/modules/egt-sim-kaufm.js` | konfiguriert Modul #8 | Copy-Paste |
| 11 | **Simulation Soziales** | `js/modules/egt-sim-sozial.js` | konfiguriert Modul #8 | Copy-Paste |
| 12 | **Übung (freier Lernbereich)** | `js/modules/egt-practice.js` | „Schule+Bibliothek"-Feeling, Ruhe, Hilfe | aus `app.js` + Coach |

### Das Simulations-Modul (#8) — Herzstück

**Schnittstelle (so rufen alle Simulationen es auf):**
```javascript
EGTSimulation.start({
  modus: "BPS",              // später "CTC"
  bereich: "kaufmaennisch",  // "it" | "sozial" | "technisch"
  niveau: "basisprofil+",
  zeitProFrage: 25,          // Sekunden
  fragenAnzahl: 100,
  aufgabenPool: [...],       // Fragen kommen von außen
  features: { coachHilfe: true, merken: true, skip: true, lockBack: false },
  titel: "Eignungstest-Simulation BPS"
});
```

**Das Modul kümmert sich NUR um:**
- Frage anzeigen (einheitliches Layout, siehe Konzeptbild)
- Antworten (A/B/C/D-Kacheln)
- Timer-Ring (sauber in Topbar, KEINE Kollision)
- Navigation (Zurück/Merken/Skip/Weiter)
- Frageübersicht-Drawer (schiebt sauber von rechts)
- „Test beenden" → **Auswertung MIT Button „Zurück zur Startseite"**
- Ergebnis-Anzeige

**Das Modul kümmert sich NICHT um:** Fragen-Generierung (kommt als `aufgabenPool` rein), Coach-Logik (nur Feature-Flag), Profil-Speicherung (Event nach außen).

---

## 5. PHASENPLAN

### ✅ PHASE 0 — Analyse & Working-Plan  ← **ABGESCHLOSSEN**
- [x] Komplette App analysiert (alle Dateien, Zeilen, Abhängigkeiten)
- [x] Modul-Struktur definiert (12 Module)
- [x] Dieses README erstellt

### ✅ PHASE 1 — Versions-Vereinheitlichung  ← **ABGESCHLOSSEN**
**Ziel:** EINE zentrale Versionsangabe, die überall automatisch übernommen wird. Beseitigt JS-Crash durch Versions-Inkonsistenz.
- [x] `js/core/app-config.js` mit zentraler Version+Config gefüllt (war LEER)
- [x] `sync-version.js` Skript erstellt: liest Version aus app-config → trägt sie in service-worker.js, update-check.json, manifest.json ein
- [x] `app.js` APP_VERSION liest jetzt aus `window.AppConfig.build` (vorher hartcodiert G35.0!)
- [x] Test: Version an EINER Stelle (app-config.js) ändern → `node sync-version.js` → überall aktualisiert
- [x] **GETESTET:** App lädt sauber, kein JS-Crash, AppConfig.version greift überall

**SO ÄNDERST DU AB JETZT DIE VERSION:**
1. In `js/core/app-config.js` die Zeile `var VERSION = '...'` ändern (+ Datum + Label)
2. `node sync-version.js` ausführen
3. Fertig — Version ist überall synchron, kein Versions-Chaos mehr.

### 🟡 PHASE 2 — Simulations-Modul herauslösen (RADIKAL)  ← **PHASE 2A + 2B + 2C + 2D + 2E + 2F + 2G ABGESCHLOSSEN**
**Ziel:** Quiz-/Simulations-Logik aus `app.js` in `egt-simulation-engine.js`.

**Phase 2A erledigt (sichere Modul-Brücke, ohne Login/Gate/Highscore zu brechen):**
- [x] Neues Modul `js/modules/egt-simulation-engine.js` angelegt.
- [x] Öffentliches API eingeführt: `window.EGTSimulation.start(config)`, `finish(summary)`, `abort(reason)`, `restart()`, `getSession()`, `on(event, fn)`.
- [x] App-Shell in `app.js` mit `initSimulationModuleHost()` an das Modul angebunden.
- [x] `startQuiz()` ist jetzt nur noch Wrapper: startet über `EGTSimulation.start(config)`; der alte Lauf steckt in `startQuizInternal()` als Legacy-Adapter.
- [x] `EGTSimulation` feuert Events: `egt:simulation:ready`, `starting`, `started`, `finished`, `aborted`, `failed`.
- [x] Neues CSS `css/egt-simulation.css` angelegt und in `index.html` eingebunden.
- [x] Layout-Layer für Simulation zentralisiert: Timer-Ring, Topbar, Frageübersicht-Drawer, Drawer-Pagination, Antwortkarten.
- [x] Ergebnisbereich erweitert: Button „Zurück zur Startseite" plus „Nochmal starten" plus „Fehleranalyse".
- [x] `module-manifest.json` erweitert: `simulationModuleHost` dokumentiert.
- [x] `service-worker.js` erweitert: neue Simulationsdateien werden offline gecacht.
- [x] `manifest.json` repariert: war leer/ungültig, jetzt gültiges PWA-Manifest mit Version.
- [x] Version auf `G40.1` gesetzt und mit `node sync-version.js` synchronisiert.
- [x] Statische Tests: `node --check` für alle JS-Dateien unter `js/` und `data/`; JSON-Validierung für Manifest/Update/Modulmanifest; Service-Worker-Assetprüfung ohne fehlende Dateien.

**Phase 2B erledigt (Kontroll-API / echte Orchestrierungsschicht):**
- [x] `js/modules/egt-simulation-engine.js` von Start/Finish-Adapter zu echter Simulations-Kontrollschicht erweitert.
- [x] Neue öffentliche Methoden eingeführt: `showQuestion(spIntro)`, `tickTimer()`, `renderAnswers(q)`, `updateQuestionNav()`, `chooseAnswer(index, button)`, `recordAnswer(given, correct, timeout)`, `nextQuestion()`, `manualNextQuestion()`, `skipQuestion()`, `showResult()`.
- [x] Neue Events eingeführt: `question:beforeShow`, `question:shown`, `timer:tick`, `answers:rendered`, `nav:updated`, `answer:choose`, `answer:recorded`, `question:next`, `result:beforeShow`.
- [x] `app.js:initSimulationModuleHost()` erweitert: Adapter gibt jetzt `beginRun` plus alle Kontrollmethoden an `EGTSimulation` weiter. `beginLegacyRun` bleibt als Rückfall erhalten.
- [x] `startQuizInternal()` startet die erste Frage jetzt über `simulationHostCall("showQuestion")` statt direktem Monolith-Aufruf.
- [x] CTC-Blockstart läuft über `simulationHostCall("showQuestion", [true])`.
- [x] Innerhalb der aktuellen Legacy-Anzeige werden Antwort-Rendering, Frage-Navigation und Timer-Ticks kontrolliert über `EGTSimulation` geleitet.
- [x] Reentrancy-Schutz im Modul eingebaut (`inDelegation`), damit Adapter-Aufrufe nicht rekursiv abstürzen.
- [x] `module-manifest.json` aktualisiert: API/Status/Events dokumentiert.
- [x] Version auf `G40.2` gesetzt und mit `node sync-version.js` synchronisiert.
- [x] Statische Tests durchgeführt: `node --check` für JS, JSON-Validierung, Service-Worker-Assetprüfung, ZIP-Test.

**Phase 2C erledigt (erster echter physischer Renderer-Umzug):**
- [x] Standard-Multiple-Choice-Rendering aus `app.js` in `js/modules/egt-simulation-engine.js` verschoben.
- [x] Neue Modul-Funktion `renderStandardAnswers(question)` erstellt und als öffentliche API `EGTSimulation.renderStandardAnswers(q)` verfügbar gemacht.
- [x] Das Modul erstellt jetzt normale `.answer-card` Buttons inklusive A/B/C/D-Index, Antworttext, Klickbindung, `selected`-Wiederherstellung und Sofortfeedback-Wiederherstellung.
- [x] `EGTSimulation.renderAnswers(q)` entscheidet jetzt selbst: Standard-MC intern, EDV-Multi über Spezialadapter, Route-Memory über Spezialadapter bzw. Wartehinweis im Modul.
- [x] `app.js:renderAnswers(q)` enthält für Standard-MC kein eigenes Button-Rendering mehr, sondern delegiert an `simulationHostCall("renderStandardAnswers", [q])`.
- [x] `app.js:initSimulationModuleHost()` erweitert um Spezialadapter `renderEdvMultiAnswers(q)`, `renderRouteSequenceAnswers(q)` und `isInstantFeedbackAllowed()`.
- [x] `module-manifest.json` auf Phase 2C aktualisiert und dokumentiert, was ins Modul gewandert ist und was bewusst in `app.js` blieb.
- [x] Version auf `G40.3` gesetzt und mit `node sync-version.js` synchronisiert.
- [x] Arbeitsnachweise erstellt: `docs/G40_3_PHASE2C_STANDARD_MC_RENDERING_REPORT.md` und `docs/G40_3_PHASE2C_STANDARD_MC_RENDERING_QA.json`.
- [x] Statische Tests durchgeführt: `node --check` für JS unter `js/` und `data/`, relevante JSON-Dateien geprüft, Service-Worker-Assetprüfung ohne fehlende Dateien, ZIP-Test.

**Phase 2D erledigt (Fragenübersicht / Navigation ins Simulationsmodul):**
- [x] `updateQuestionNav()` physisch in `js/modules/egt-simulation-engine.js` verschoben.
- [x] `EGTSimulation.updateQuestionNav()` rendert jetzt selbst die Frageübersicht inklusive `.qnav-drawer`, 30er-Pagination, Seitenleiste und `.progress-dot` Statusklassen.
- [x] Modul-eigene `qnavManualPage` eingeführt, damit Seitenwahl innerhalb der Fragenübersicht nicht mehr aus dem App-Monolithen gesteuert werden muss.
- [x] `app.js:updateQuestionNav()` ist jetzt nur noch Wrapper über `simulationHostCall("updateQuestionNav")`; alter Code wurde in `updateQuestionNavInternal()` als Fallback gesichert.
- [x] `app.js:initSimulationModuleHost()` liefert nur noch kontrollierte Hooks: `getQuestionNavTotal()`, `ensureQuestionDrawerToggle()`, `setQuestionDrawer(open)` und `jumpToQuestion(index)`.
- [x] LockBack-/Skip-Verhalten bleibt bewusst in `jumpToQuestion()` der App-Shell, damit bestehende Prüfungslogik nicht beschädigt wird.
- [x] `module-manifest.json` auf Phase 2D aktualisiert: verschobene Bestandteile, Shell-Hooks, offene Adapter und nächster Schritt dokumentiert.
- [x] Version auf `G40.4` gesetzt und mit `node sync-version.js` synchronisiert.
- [x] Arbeitsnachweise erstellt: `docs/G40_4_PHASE2D_QUESTION_NAV_REPORT.md` und `docs/G40_4_PHASE2D_QUESTION_NAV_QA.json`.
- [x] Statische Tests durchgeführt: `node --check` für JS unter `js/` und `data/`, relevante JSON-Dateien geprüft, Service-Worker-Assetprüfung ohne fehlende Dateien, ZIP-Test.

**Phase 2E erledigt (Result-Grenze / Ergebnis-Kopfbereich ins Simulationsmodul):**
- [x] Ergebnis-/Result-Grenze sauber definiert: `EGTSimulation.prepareResult(options)` ist jetzt der offizielle Modul-Einstieg für Score-/Meta-Berechnung und Ergebnis-Kopfbereich.
- [x] Neue Modul-APIs ergänzt: `buildResultSummary(options)`, `renderResultHeader(summary)` und `prepareResult(options)`.
- [x] `showResult()` in `app.js` nutzt zuerst `EGTSimulation.prepareResult({ state, mode })`; nur wenn das Modul fehlt, greift der alte Fallback.
- [x] Ergebnis-Kopfbereich wird jetzt vom Modul vorbereitet: Score, Quote, Beginn, Ende, Dauer, Ø pro Aufgabe, Prüfungsbanner, Blocktraining-Hinweis und Bewertungstext.
- [x] `EGTSimulation.finish(summary)` bekommt jetzt den vom Modul erstellten Summary-Payload; Event `egt:simulation:result:prepared` dokumentiert.
- [x] Bewusst in der Shell belassen: `renderCategoryStats()`, `renderTips(percent)`, `renderReview()`, `saveResult(percent,dur,avg)`, `EGTLearningCoach.onSessionFinished(...)`, Highscore-/Cloud-Sync und Duell-Ergebnis.
- [x] Adapter in `app.js:initSimulationModuleHost()` um `formatTime(value)` und `formatDuration(value)` erweitert, damit das Modul den bestehenden deutschen Zeitstil nutzt.
- [x] `module-manifest.json` auf Phase 2E aktualisiert: API, Adapter, Status und Result-Event dokumentiert.
- [x] Version auf `G40.5` gesetzt und konsistent in App-Config, Manifest, Update-Check, Service Worker und Modulversion eingetragen.
- [x] Arbeitsnachweise erstellt: `docs/G40_5_PHASE2E_RESULT_BOUNDARY_REPORT.md` und `docs/G40_5_PHASE2E_RESULT_BOUNDARY_QA.json`.
- [x] Statische Tests durchgeführt: `node --check` für JS unter `js/` und `data/`, relevante JSON-Dateien geprüft, Service-Worker-Assetprüfung ohne fehlende Dateien, ZIP-Test.

**Phase 2F erledigt (Route-Memory / Busfahrtroute als erster Spezialrenderer ins Simulationsmodul):**
- [x] Route-Memory-Antwortrendering physisch in `js/modules/egt-simulation-engine.js` verschoben.
- [x] Neue Modul-APIs ergänzt: `renderRouteSequenceAnswers(question)`, `selectRouteStreet(street)`, `undoRouteStreet()`, `clearRouteSelection()` und `submitRouteSequence()`.
- [x] `EGTSimulation.renderAnswers(q)` behandelt `routeMemory` jetzt selbst: Wartehinweis vor Ende der Merkanimation, Auswahlpanel nach `routeReady`, Chips, Straßen-Buttons und Submit-Aktion.
- [x] Route-Auswahl, erneutes Abwählen, Undo, Clear, Vollständigkeitsprüfung und Reihenfolgeprüfung laufen jetzt im Modul.
- [x] `app.js` wurde reduziert auf Wrapper/Fallbacks: `renderRouteSequenceAnswersInternal()`, `selectRouteStreetInternal()`, `undoRouteStreetInternal()`, `clearRouteSelectionInternal()` und `submitRouteSequenceInternal()` bleiben nur als Sicherheitsnetz.
- [x] `app.js:initSimulationModuleHost()` liefert kontrollierte Route-Hooks: `recordRouteAnswer(selected, correct)`, `markCurrentQuestionDone()` und `isAdaptiveElite()`.
- [x] Bewusst in der Shell belassen: eigentliche History-Struktur von `recordRouteAnswer(...)`, Timer-/Exam-Daten, globales Fortschrittsarray, `nextQuestion()` und `showResult()` als zentrale App-Regeln.
- [x] `module-manifest.json` auf Phase 2F aktualisiert: Route-Migration, neue API, Shell-Hooks und weiterhin offene Spezialadapter dokumentiert.
- [x] Version auf `G40.6` gesetzt und mit `node sync-version.js` synchronisiert.
- [x] Arbeitsnachweise erstellt: `docs/G40_6_PHASE2F_ROUTE_MEMORY_RENDERER_REPORT.md` und `docs/G40_6_PHASE2F_ROUTE_MEMORY_RENDERER_QA.json`.
- [x] Statische Tests durchgeführt: `node --check` für JS unter `js/` und `data/`, relevante JSON-Dateien geprüft, Service-Worker-Assetprüfung ohne fehlende Dateien, ZIP-Test.

**Phase 2G erledigt (EDV-Multi als zweiter Spezialrenderer ins Simulationsmodul):**
- [x] EDV-Multi-Antwortrendering physisch in `js/modules/egt-simulation-engine.js` verschoben.
- [x] Neue Modul-APIs ergänzt: `renderEdvMultiAnswers(question)`, `toggleEdvMultiNode(id)`, `undoEdvMultiSelection()`, `clearEdvMultiSelection()` und `submitEdvMultiAnswer()`.
- [x] `EGTSimulation.renderAnswers(q)` behandelt `edvmulti` jetzt selbst: Auswahlpanel, gewählte Node-Chips, Buttonraster, Undo, Clear und Submit-Aktion.
- [x] EDV-Auswahl, erneutes Abwählen, Maximallimit, Vollständigkeitsprüfung und Submit-Feedback laufen jetzt im Modul.
- [x] `app.js` wurde reduziert auf Wrapper/Fallbacks: `renderEdvMultiAnswersInternal()`, `toggleEdvMultiNodeInternal()`, `undoEdvMultiSelectionInternal()`, `clearEdvMultiSelectionInternal()` und `submitEdvMultiAnswerInternal()` bleiben nur als Sicherheitsnetz.
- [x] `app.js:initSimulationModuleHost()` liefert kontrollierte EDV-Hooks: `renderEdvVisual(question)`, `recordEdvMultiAnswers(selected)`, `markEdvMultiCoveredDone(need)` und `afterEdvMultiSubmit(need, selected)`.
- [x] Bewusst in der Shell belassen: EDV-Schema-Visualisierung `renderEdvProHTML(q)`, Konstanten `EDV_SCHEMA`/`EDV_ERRORS`, Generatoren, History-Payload, Placeholder-Fragen, `nextQuestion()` und `showResult()` als zentrale App-Regeln.
- [x] `module-manifest.json` auf Phase 2G aktualisiert: EDV-Migration, neue API, Shell-Hooks, neue Events und weiterhin offene Visual-/Generator-Grenzen dokumentiert.
- [x] Version auf `G40.7` gesetzt und mit `node sync-version.js` synchronisiert.
- [x] Arbeitsnachweise erstellt: `docs/G40_7_PHASE2G_EDV_MULTI_RENDERER_REPORT.md` und `docs/G40_7_PHASE2G_EDV_MULTI_RENDERER_QA.json`.
- [x] Statische Tests durchgeführt: `node --check` für JS unter `js/` und `data/`, relevante JSON-Dateien geprüft, Service-Worker-Assetprüfung ohne fehlende Dateien, ZIP-Test.

**Noch offen nach Phase 2G:**
- [ ] `renderVisual(q)` als eigene klare Grenze definieren oder erste kleine Visual-Renderer einzeln migrieren.
- [ ] `showQuestion()`, `tickTimer()` und `recordAnswer()` später schrittweise modularisieren.
- [ ] Fragen-Erzeugung sauber trennen: `buildQuiz()` / Generatoren bleiben aktuell App-Core, später eigener QuestionPool/SimulationConfig.
- [ ] Browser-Live-Test mit Playwright/Puppeteer oder lokalem Browser durchführen. Hinweis: In dieser Umgebung wurde statisch geprüft; kein echter Browser-Test installiert.

**Wichtige technische Entscheidung:** Phase 2G verschiebt nicht die komplette EDV-Welt inklusive Schema-Konstanten, Generator und Visual-HTML auf einmal. Das Modul besitzt jetzt den EDV-Antwortbereich und die EDV-Interaktionen. EDV-Visualisierung, History-Format, Placeholder-Logik, Timer-/Exam-Daten und globale Weiterleitungsregeln bleiben kontrollierte Shell-Hooks.

### ✅ PHASE 3A — Shell/ModuleHost-Vertrag & Branchen-Verzweigung
**Ziel:** Shell, ModuleHost und Simulationseinstieg fachlich trennen, ohne App-Core zu zerbrechen.
- [x] ModuleHost-Vertrag eingeführt
- [x] Branchen-Kontext zentralisiert
- [x] Simulation-Bereich mit Branchen-Verzweigung ausgestattet
- [x] Statisch getestet

**Phase 3A erledigt (Shell/ModuleHost-Vertrag + branchenbasierter Simulationseinstieg):**
- [x] Neuer Core-Host erstellt: `js/core/module-host.js`.
- [x] Globaler Vertrag eingeführt: `window.AppModuleHost`.
- [x] APIs dokumentiert und bereitgestellt: `register()`, `startModule()`, `stopActive()`, `setBranch()`, `getBranch()`, `listBranches()`, `buildSimulationConfig()`, `startSimulation()`, `getStatus()` und `on()`.
- [x] Branchen-Kontext zentralisiert: IT/FISI, Kaufmännisch, Sozialpädagogik und Allgemeinwissen laufen nicht mehr nur verstreut über UI-LocalStorage, sondern über den ModuleHost.
- [x] Branchenbasierte Simulations-Zuordnung definiert: IT/FISI → `ctcLohr`, Kaufmännisch → `bps`, Sozialpädagogik → `bps`, Allgemeinwissen → `jogging`.
- [x] `index.html` lädt `js/core/module-host.js` nach `module-loader.js` und vor `app.js`, damit App-Core und UI beide auf den Host zugreifen können.
- [x] `app.js:startQuiz()` reichert `EGTSimulation.start(config)` jetzt mit `moduleHost`, `branch` und `branchLabel` an. Die Quiz-Erzeugung selbst bleibt bewusst noch in `app.js`.
- [x] `js/ui-router.js` versteht jetzt `data-ui-action="start-branch-simulation"` und startet die Simulation über `AppModuleHost.startSimulation(...)`.
- [x] `js/ui-home-renderer.js` zeigt im bestehenden Deep-Sheet für Simulation jetzt branchenspezifische Startkarten statt nur eines blinden Startbuttons.
- [x] Neues CSS ergänzt: `css/ui-foundation.css` enthält `.ui-branch-sim-grid`, `.ui-branch-sim-card` und Mobile-Fallback.
- [x] `architecture-guard.js` prüft jetzt `AppModuleHost` und die neue Datei `js/core/module-host.js`.
- [x] `service-worker.js` cached `js/core/module-host.js`.
- [x] Version auf `G41.0` gesetzt und mit `node sync-version.js` synchronisiert.
- [x] `module-manifest.json` um `moduleHost` und `phase3Integration` erweitert.
- [x] Arbeitsnachweise erstellt: `docs/G41_0_PHASE3_MODULEHOST_BRANCHES_REPORT.md` und `docs/G41_0_PHASE3_MODULEHOST_BRANCHES_QA.json`.
- [x] Statische Tests durchgeführt: JS-Syntaxcheck, JSON-Validierung, Service-Worker-Assetprüfung und ZIP-Test.

**Bewusste Grenze Phase 3A:**
- [ ] Es wurden noch keine echten separaten Fachmodul-Dateien für IT/Kaufm/Sozial erstellt. Phase 3A härtet zuerst den Vertrag und den Einstieg.
- [ ] `buildQuiz()`, Generatoren, Result-Details, Highscore und Coach bleiben in `app.js`.
- [ ] Browser-Live-Test wurde nicht durchgeführt; statische Prüfung ist bestanden.

**Nächster sinnvoller Schritt:** Phase 3B — echte Moduldateien für Home/SimulationEntry/PracticeEntry vorbereiten und über `AppModuleHost.register(...)` registrieren.


### ✅ PHASE 3B — echte Entry-Module registriert
**Ziel:** Home, SimulationEntry und PracticeEntry als echte Module vorbereiten, damit die Shell künftig nicht mehr direkt in lose UI-Funktionen springt.
- [x] Home als eigenes Modul registriert
- [x] SimulationEntry als eigenes Modul registriert
- [x] PracticeEntry als eigenes Modul registriert
- [x] UI-Router nutzt ModuleHost für Practice/Learn und Simulationseinstieg
- [x] Working Plan, Manifest und Arbeitsnachweis aktualisiert

**Phase 3B erledigt (Entry-Module + ModuleHost-Registrierung):**
- [x] Neue Datei erstellt: `js/modules/egt-home-module.js`. Registriert `home` über `AppModuleHost.register(...)` und startet/refreshes Home über `App.setAppSection('home')` oder `EGTUILayer`-Fallback.
- [x] Neue Datei erstellt: `js/modules/egt-simulation-entry-module.js`. Registriert `simulation-entry` und öffnet entweder das bestehende Simulation-Deep-Sheet oder startet direkt über `AppModuleHost.startSimulation(...)`.
- [x] Neue Datei erstellt: `js/modules/egt-practice-entry-module.js`. Registriert `practice-entry` und öffnet vorhandenes Practice/Learn-Deep-Sheet über `EGTUILayer.openPracticeMode(...)` bzw. Fallbacks.
- [x] `index.html` lädt die drei Entry-Module direkt nach `js/core/module-host.js` und vor `app.js`. Dadurch können die Module registriert sein, bevor spätere UI-/App-Logik sie verwendet.
- [x] `js/ui-router.js` angepasst: `practice`/`learn` versuchen zuerst `AppModuleHost.startModule('practice-entry', ...)`, bevor sie auf die alte Deep-Sheet-Logik zurückfallen.
- [x] `js/ui-router.js` angepasst: `simulation` mit Direktstart versucht zuerst `AppModuleHost.startModule('simulation-entry', { direct: true, ... })`, danach erst den alten `startSimulation`-Fallback.
- [x] `js/ui-router.js` angepasst: nicht-direkter Simulationseinstieg öffnet zuerst `simulation-entry`, danach erst Legacy-Fallback.
- [x] `js/core/module-host.js` auf Version `G41.1-phase3b` angehoben. Der zentrale Host-Vertrag bleibt stabil; keine Generator-/Result-Umbauten.
- [x] `js/core/architecture-guard.js` kennt die drei neuen Moduldateien als Kern-Dateien.
- [x] `service-worker.js` cached die drei neuen Moduldateien und Cache wurde auf `egt-trainer-g41-1` erhöht.
- [x] Version auf `G41.1` gesetzt und mit `node sync-version.js` synchronisiert.
- [x] `module-manifest.json` um `registeredEntryModules` und `phase3b` erweitert.
- [x] Arbeitsnachweise erstellt: `docs/G41_1_PHASE3B_ENTRY_MODULES_REPORT.md` und `docs/G41_1_PHASE3B_ENTRY_MODULES_QA.json`.
- [x] Statische Tests durchgeführt: JS-Syntaxcheck, JSON-Validierung, Service-Worker-Assetprüfung und ZIP-Test.

**Bewusste Grenze Phase 3B:**
- [ ] `buildQuiz()`, Generatoren, Result-Details, Highscore und Coach bleiben weiterhin in `app.js`/bestehenden Modulen.
- [ ] Practice/Learn bekommen noch kein neues eigenes Layout; Phase 3B registriert nur den sauberen Entry-Punkt.
- [ ] SimulationEntry besitzt noch keinen eigenen vollständigen Screen; es nutzt bewusst das bestehende Deep-Sheet/Simulation-System als kontrollierten Adapter.
- [ ] Browser-Live-Test wurde nicht durchgeführt; statische Prüfung ist bestanden.

**Nächster sinnvoller Schritt:** Phase 3C — weitere UI-Türen konsequent über `AppModuleHost.startModule(...)` führen und Admin/Profile als eigene Entry-Grenzen vorbereiten. Danach kann Phase 4 das echte freie Lernmodul sauber aufbauen.

**Phase 3C erledigt (Admin/Profile Entry-Grenzen + weitere UI-Türen über ModuleHost):**
- [x] Neue Datei erstellt: `js/modules/egt-admin-entry-module.js`. Registriert `admin-entry` über `AppModuleHost.register(...)` und öffnet das bestehende `EGTAdminPortal` als kontrollierten Adapter.
- [x] Neue Datei erstellt: `js/modules/egt-profile-entry-module.js`. Registriert `profile-entry` über `AppModuleHost.register(...)` und delegiert `auth-*`/`profile-*` Aktionen an die vorhandene `EGTAuthProfileShell`.
- [x] `index.html` lädt `egt-admin-entry-module.js` und `egt-profile-entry-module.js` direkt nach den bestehenden Entry-Modulen und vor `app.js`.
- [x] `js/ui-router.js` angepasst: `auth-*` und `profile-*` Aktionen laufen zuerst über `AppModuleHost.startModule('profile-entry', ...)`, danach erst Legacy-Fallback.
- [x] `js/ui-router.js` angepasst: `admin-open` und `login-open-core` laufen zuerst über `AppModuleHost.startModule('admin-entry', ...)`, danach erst `EGTAdminPortal`/Fallback.
- [x] `js/ui-router.js` angepasst: Bottom-Dock `home` und Legacy-Tab `0` laufen zuerst über `AppModuleHost.startModule('home', ...)`.
- [x] `js/ui-router.js` angepasst: Bottom-Dock `profile` und Legacy-Tab `4` laufen zuerst über `AppModuleHost.startModule('profile-entry', { action: 'profile-open' })`.
- [x] `js/core/module-host.js` auf Version `G41.2-phase3c` angehoben.
- [x] `js/core/architecture-guard.js` kennt die zwei neuen Entry-Moduldateien als Kern-Dateien.
- [x] `service-worker.js` cached die zwei neuen Moduldateien und Cache wurde über `node sync-version.js` auf `egt-trainer-g41-2` erhöht.
- [x] Version auf `G41.2` gesetzt und mit `node sync-version.js` synchronisiert.
- [x] `module-manifest.json` um `admin-entry`, `profile-entry` und `phase3c` erweitert.
- [x] Arbeitsnachweise erstellt: `docs/G41_2_PHASE3C_ADMIN_PROFILE_ENTRY_REPORT.md` und `docs/G41_2_PHASE3C_ADMIN_PROFILE_ENTRY_QA.json`.
- [x] Statische Tests durchgeführt: JS-Syntaxcheck, JSON-Validierung, Service-Worker-Assetprüfung und ZIP-Test.

**Bewusste Grenze Phase 3C:**
- [ ] `EGTAdminPortal` bleibt fachlich unverändert. Keine Rollen-, Code-, Ticket-, Firebase- oder Teilnehmerlogik wurde geändert.
- [ ] `EGTAuthProfileShell` bleibt fachlich unverändert. Keine Session-Keys, Demo-Limits, Avatar-Logik oder Profil-Datenstruktur wurde geändert.
- [ ] Highscore, Coach, Analysis und Duell-Türen bleiben noch Legacy-/UI-Layer-basiert und können bei Bedarf in Phase 3D eigene Entry-Module bekommen.
- [ ] Quiz-Generatoren, Result-Details, Highscore-Cloud-Sync und Coach-Auswertung bleiben weiterhin in den bestehenden Dateien.
- [ ] Browser-Live-Test wurde nicht durchgeführt; statische Prüfung ist bestanden.

**Nächster sinnvoller Schritt:** Phase 3D — optional Highscore/Coach/Analysis/Duell als weitere Entry-Grenzen vorbereiten. Alternativ kann Phase 4 starten, wenn freie Lernmodule Priorität haben.


**Phase 3D erledigt (Highscore/Coach/Analysis/Duell Entry-Grenzen):**
- [x] Neue Datei erstellt: `js/modules/egt-coach-entry-module.js`. Registriert `coach-entry` über `AppModuleHost.register(...)` und öffnet den bestehenden `EGTLearningCoach` als kontrollierten Adapter.
- [x] Neue Datei erstellt: `js/modules/egt-analysis-entry-module.js`. Registriert `analysis-entry` und delegiert an die vorhandene `App.showAnalysis()`-/Progress-Logik.
- [x] Neue Datei erstellt: `js/modules/egt-highscore-entry-module.js`. Registriert `highscore-entry` und öffnet das bestehende Highscore-Sheet bzw. nutzt `CloudHighscoreEngine.refreshDashboard()` als Fallback.
- [x] Neue Datei erstellt: `js/modules/egt-duel-entry-module.js`. Registriert `duel-entry` und öffnet bestehenden Duell-Hub oder direkten `App.openDuellSetup()`-Einstieg.
- [x] `index.html` lädt die vier neuen Entry-Module direkt nach Admin/Profile Entry und vor `app.js`.
- [x] `js/ui-router.js` angepasst: `coach`, `coach-open-core` und `coach_card` laufen zuerst über `AppModuleHost.startModule('coach-entry', ...)`, danach erst Legacy-Fallback.
- [x] `js/ui-router.js` angepasst: `analysis`, `analysis-open-core` und `analyse_card` laufen zuerst über `AppModuleHost.startModule('analysis-entry', ...)`, danach erst Legacy-Fallback.
- [x] `js/ui-router.js` angepasst: `highscore-sheet` läuft zuerst über `AppModuleHost.startModule('highscore-entry', ...)`, danach erst Legacy-Fallback.
- [x] `js/ui-router.js` angepasst: `duel-hub` und `duel-mode` laufen zuerst über `AppModuleHost.startModule('duel-entry', ...)`, danach erst Legacy-Fallback.
- [x] `js/core/module-host.js` auf Version `G41.3-phase3d` angehoben.
- [x] `js/core/architecture-guard.js` kennt die vier neuen Entry-Moduldateien als Kern-Dateien.
- [x] `service-worker.js` cached die vier neuen Moduldateien und Cache wurde über `node sync-version.js` auf `egt-trainer-g41-3` erhöht.
- [x] Version auf `G41.3` gesetzt und mit `node sync-version.js` synchronisiert.
- [x] `module-manifest.json` um `coach-entry`, `analysis-entry`, `highscore-entry`, `duel-entry` und `phase3d` erweitert.
- [x] Arbeitsnachweise erstellt: `docs/G41_3_PHASE3D_EXTENDED_ENTRY_MODULES_REPORT.md` und `docs/G41_3_PHASE3D_EXTENDED_ENTRY_MODULES_QA.json`.
- [x] Statische Tests durchgeführt: JS-Syntaxcheck, JSON-Validierung, Service-Worker-Assetprüfung und ZIP-Test.

**Bewusste Grenze Phase 3D:**
- [ ] `EGTLearningCoach` bleibt fachlich unverändert. Keine Coach-Memory-, Wissensbasis-, Trainings- oder Auswertungslogik wurde geändert.
- [ ] `App.showAnalysis()` bleibt fachlich unverändert. Keine Statistik-, Verlauf- oder Fortschrittsberechnung wurde geändert.
- [ ] `EGTUILayer.openHighscoreSheet()` und `CloudHighscoreEngine` bleiben fachlich unverändert. Keine Highscore-Schema-, Ranking- oder Cloud-Sync-Logik wurde geändert.
- [ ] `EGTUILayer.openDuelSheet()` und `App.openDuellSetup()` bleiben fachlich unverändert. Keine Duell-State-, Online-Code-, Local-Duell- oder Firebase-Logik wurde geändert.
- [ ] Browser-Live-Test wurde nicht durchgeführt; statische Prüfung ist bestanden.

**Nächster sinnvoller Schritt:** Phase 4 — freies Lern-/Übungsmodul als echtes Fachmodul auf der jetzt stabilisierten Shell + ModuleHost + Entry-Struktur aufbauen.

**Phase 4 erledigt (freies Lern-/Übungsmodul als echtes Fachmodul):**
- [x] Neue Datei erstellt: `js/modules/egt-practice.js`. Registriert das Fachmodul `practice` über `AppModuleHost.register(...)` und stellt `window.EGTPracticeModule` bereit.
- [x] Neue Datei erstellt: `css/egt-practice.css`. Enthält das ruhige Bibliothek-/Lernbereich-Layout für den freien Übungsmodus.
- [x] `index.html` lädt `css/egt-practice.css` und `js/modules/egt-practice.js` direkt im Core-/Modulbereich.
- [x] `js/modules/egt-practice-entry-module.js` aktualisiert: PracticeEntry delegiert zuerst an `EGTPracticeModule.open(...)`, danach bleiben Legacy-Fallbacks erhalten.
- [x] `js/core/module-host.js` auf Version `G42.0-phase4` angehoben. Der Host kann das neue `practice`-Fachmodul im Lifecycle führen.
- [x] `EGTPracticeModule` bietet einen eigenen ruhigen Lernbereich mit Kategorien: Mathe, Logik, Konzentration, Sprache/Wissen, IT/FISI.
- [x] `EGTPracticeModule` grenzt Üben klar von Simulation ab: kein Prüfungsdruck, Fokus auf Verstehen, Erklärung, Wiederholung und Coach-Hilfe.
- [x] Coach-Hilfe prominent eingebaut: Verstehen → Anwenden → Wiederholen.
- [x] Platzhalter vorbereitet für spätere Module: Live-Chat, Coach-Frage und Duell-Anfrage.
- [x] Start ausgewählter Übungen läuft kontrolliert über vorhandene stabile Hooks: `App.chooseTrainingMode(mode)` + `App.prepareTest()`.
- [x] Legacy-Trainingsmenü bleibt über Button und Fallback erreichbar, falls das neue Fachmodul nicht geladen wird.
- [x] `js/core/architecture-guard.js` kennt neue Practice-CSS- und Practice-Moduldatei als Kern-Dateien.
- [x] `service-worker.js` cached `css/egt-practice.css` und `js/modules/egt-practice.js`; Cache wurde über `node sync-version.js` auf `egt-trainer-g42-0` erhöht.
- [x] Version auf `G42.0` gesetzt und mit `node sync-version.js` synchronisiert.
- [x] `module-manifest.json` um `practice-module`, `registeredEntryModules.practice` und `moduleHost.phase4` erweitert.
- [x] Arbeitsnachweise erstellt: `docs/G42_0_PHASE4_PRACTICE_MODULE_REPORT.md` und `docs/G42_0_PHASE4_PRACTICE_MODULE_QA.json`.
- [x] Statische Tests durchgeführt: JS-Syntaxcheck, JSON-Validierung, Service-Worker-Assetprüfung und ZIP-Test.

**Bewusste Grenze Phase 4:**
- [ ] Aufgabengeneratoren bleiben weiterhin in `app.js`/`data/*`. Es wurde kein Generator fachlich verändert.
- [ ] Die eigentlichen Übungsaufgaben laufen weiterhin über die vorhandene Quizruntime und die bestehenden `EGTSimulation`-Adapter.
- [ ] `EGTLearningCoach` bleibt fachlich unverändert; das Practice-Modul öffnet ihn nur als Hilfe-Einstieg.
- [ ] SimulationEntry/EGTSimulation bleiben strikt getrennt vom freien Lernbereich.
- [ ] Keine Highscore-, Coach-Auswertungs-, Admin-, Auth-, Firebase-, Demo-Limit- oder Session-Key-Logik wurde geändert.
- [ ] Browser-Live-Test wurde nicht durchgeführt; statische Prüfung ist bestanden.

**Nächster sinnvoller Schritt:** Phase 5 — branchenspezifische Simulationen sauber als eigene Copy-Paste-Module aufbauen (`egt-sim-it.js`, `egt-sim-kaufm.js`, `egt-sim-sozial.js`) oder alternativ Phase 4B, falls der freie Lernbereich noch stärker mit eigener Aufgabenwahl/Generatorgrenze ausgebaut werden soll.

**Phase 5 erledigt (branchenspezifische Simulationsmodule):**
- [x] Neue Datei erstellt: `js/modules/egt-sim-it.js`. Registriert `sim-it` über `AppModuleHost.register(...)` und startet die IT/FISI-Simulation mit Branch `it` und Modus `ctcLohr`.
- [x] Neue Datei erstellt: `js/modules/egt-sim-kaufm.js`. Registriert `sim-kaufm` und startet die kaufmännische Simulation mit Branch `kaufm` und Modus `bps`.
- [x] Neue Datei erstellt: `js/modules/egt-sim-sozial.js`. Registriert `sim-sozial` und startet die sozialpädagogische Simulation mit Branch `sozial` und Modus `bps`.
- [x] `js/core/module-host.js` auf Version `G43.0-phase5` angehoben und die Branch-Konfigurationen um `moduleId` ergänzt: `sim-it`, `sim-kaufm`, `sim-sozial`.
- [x] `index.html` lädt die drei neuen Branch-Simulationsmodule direkt nach `egt-simulation-entry-module.js`.
- [x] `js/ui-router.js` angepasst: `start-branch-simulation` routet zuerst über das passende Branch-Modul, danach erst Legacy-/SimulationEntry-Fallback.
- [x] `js/ui-home-renderer.js` angepasst: Branch-Simulationsstarts nutzen zuerst `AppModuleHost.startModule(...)` mit `sim-it`, `sim-kaufm` oder `sim-sozial`.
- [x] `js/modules/egt-simulation-entry-module.js` aktualisiert: direkter Simulationsstart delegiert an das passende Branch-Modul, wenn verfügbar.
- [x] Jedes Branch-Modul besitzt `start(...)`, `stop(...)`, `buildConfig(...)` und `bankStats(...)` als saubere Übergabe-/Diagnosepunkte.
- [x] `js/core/architecture-guard.js` kennt die neuen Branch-Simulationsmodule als Kern-Dateien.
- [x] `service-worker.js` cached die neuen Moduldateien; Cache wurde über `node sync-version.js` auf `egt-trainer-g43-0` erhöht.
- [x] Version auf `G43.0` gesetzt und mit `node sync-version.js` synchronisiert.
- [x] `module-manifest.json` um `phase5BranchSimulationModules` erweitert.
- [x] Arbeitsnachweise erstellt: `docs/G43_0_PHASE5_BRANCH_SIM_MODULES_REPORT.md` und `docs/G43_0_PHASE5_BRANCH_SIM_MODULES_QA.json`.
- [x] Statische Tests durchgeführt: JS-Syntaxcheck, JSON-Validierung, Service-Worker-Assetprüfung und ZIP-Test.

**Bewusste Grenze Phase 5:**
- [ ] Die Branch-Module sind Start-/Konfigurationsmodule, noch keine komplett eigenen Aufgaben-Engines.
- [ ] `buildQuiz(...)`, `Generators`, `QUESTION_BANK_EXTERNAL`-Auswahl und fachliche Pool-Logik bleiben weiterhin im bestehenden `app.js`-/Data-Layer.
- [ ] Result-/Review-Logik, Highscore/Cloud-Sync, Coach-Auswertung, Admin/Auth/Firebase/Demo-Limits und Session-Keys wurden nicht verändert.
- [ ] Browser-Live-Test wurde nicht durchgeführt; statische Prüfung ist bestanden.

**Nächster sinnvoller Schritt:** Phase 6 — Branch-QuestionPool-/Generator-Grenze definieren, damit IT, Kaufmännisch und Sozialpädagogik eigene fachliche Aufgabenpool-Regeln bekommen.






### ✅ PHASE 4 — Übung zu „freiem Lernbereich" umbauen
**Ziel:** Üben fühlt sich an wie Schule+Bibliothek (Ruhe, Hilfe, Verständnis), nicht wie Standardtest.
- [x] Eigenes Modul `js/modules/egt-practice.js`
- [x] Ruhiges Layout, Coach-Hilfe prominent, Verständnishilfen
- [x] (Später: Live-Chat, Duell-Anfragen — Platzhalter vorbereiten)
- [x] **TESTEN:** Übungsmodus unterscheidet sich klar von Simulation (statisch/strukturell geprüft)

### ✅ PHASE 5 — Weitere Simulationen (Copy-Paste)
- [x] Simulation IT mit BPS/CTC-Verzweigung (`egt-sim-it.js`)
- [x] Simulation Kaufmännisch (`egt-sim-kaufm.js`)
- [x] Simulation Soziales (`egt-sim-sozial.js`)
- [x] **TESTEN:** Alle nutzen denselben Host/Runtimestart, anderer Branch-/Modulkontext; statisch geprüft


### ✅ PHASE 6 — Branch-QuestionPool-/Generator-Grenze
**Ziel:** IT/FISI, Kaufmännisch und Sozialpädagogik bekommen eigene fachliche Pool-Regeln, ohne `buildQuiz()` riskant komplett aus `app.js` zu reißen.

- [x] Neue Core-Datei erstellt: `js/core/branch-question-pools.js`.
- [x] Neues Global eingeführt: `window.EGTBranchQuestionPools`.
- [x] Resolver-API eingeführt:
  - `resolve(branch, mode, options)`
  - `list()`
  - `scoreQuestionForBranch(question, branch)`
- [x] Branch-Profile definiert:
  - `it`: IT/FISI, Netzwerk, Hardware, Security, EDV; CTC-Lohr-Blockstruktur bleibt geschützt.
  - `kaufm`: kaufmännisches Rechnen, Bürowissen, Textverständnis, Logik, Konzentration.
  - `sozial`: Pädagogik, Situationen, Textverständnis, Sprache/Wissen, Logik, Konzentration.
  - `wissen`: allgemeiner Fallback-Pool.
- [x] `index.html` lädt `js/core/branch-question-pools.js` direkt nach `js/core/module-host.js` und vor den Branch-Simulationsmodulen.
- [x] `js/core/module-host.js` auf `G44.0-phase6` aktualisiert.
- [x] `AppModuleHost.buildSimulationConfig(...)` ergänzt jetzt `questionPoolProfile`.
- [x] `AppModuleHost.startSimulation(...)` setzt `window.EGT_ACTIVE_QUESTION_PROFILE` als Übergabe an die Runtime.
- [x] Branch-Module `egt-sim-it.js`, `egt-sim-kaufm.js`, `egt-sim-sozial.js` lösen ihre `questionPoolProfile` selbst auf und geben sie in `buildConfig(...)` mit.
- [x] `app.js` kontrolliert angebunden:
  - `activeBranchIdForQuiz()` liest aktiven Branch aus `AppModuleHost`, `EGT_ACTIVE_QUESTION_PROFILE` oder `localStorage`.
  - `activeQuestionPoolProfile(mode)` nutzt `EGTBranchQuestionPools.resolve(...)`.
  - `resolveBranchGeneratorPool(mode, pools)` gewichtet bei `bps`/`jogging` den Pool branchenspezifisch.
  - `attachBranchPoolMeta(q, mode)` versieht erzeugte Fragen mit `branch`, `poolKey`, `poolSource`.
- [x] Legacy-/Sicherheitsgrenze beibehalten:
  - `Generators` bleiben in `app.js`.
  - `buildQuiz()` bleibt vorerst zentrale Runtime.
  - CTC-Lohr-Festblockstruktur bleibt unverändert.
  - Result, Review, Highscore, Coach, Admin/Auth/Firebase und Demo-Limits wurden nicht verändert.
- [x] `architecture-guard.js` prüft `EGTBranchQuestionPools` und die neue Core-Datei.
- [x] `service-worker.js` cached `js/core/branch-question-pools.js`; Cache auf `egt-trainer-g44-0` erhöht.
- [x] Version auf `G44.0` gesetzt.
- [x] `module-manifest.json` um `phase6BranchQuestionPools` erweitert.
- [x] Arbeitsnachweise erstellt: `docs/G44_0_PHASE6_BRANCH_QUESTION_POOLS_REPORT.md` und `docs/G44_0_PHASE6_BRANCH_QUESTION_POOLS_QA.json`.
- [x] Statische Tests durchgeführt: JS-Syntaxcheck, JSON-Validierung, Service-Worker-Assetprüfung und ZIP-Test.

**Bewusste Grenze Phase 6:**
- [ ] Kein kompletter physischer Umzug aller Generatoren aus `app.js`.
- [ ] Keine Änderung an Firebase, Login, Admin, Profil, Highscore, Coach oder Demo-Limits.
- [ ] Kein Browser-Live-Test durchgeführt; statische QA ist bestanden.

**Nächster sinnvoller Schritt:** Phase 7 — GeneratorRegistry/Pools physisch aus `app.js` vorbereiten oder pro Branch eigene Datenpool-Resolver an `data/question-bank-*.js` anbinden.


### ✅ PHASE 7 — GeneratorRegistry / Pool-Grenze
**Ziel:** Generator-Pool-Definitionen weiter aus `app.js` herauslösen und über eine eigene Registry bereitstellen, ohne `buildQuiz()` oder die Generatorfunktionen selbst riskant umzubauen.

- [x] Neue Core-Datei erstellt: `js/core/generator-registry.js`.
- [x] Neues Global eingeführt: `window.EGTGeneratorRegistry`.
- [x] Registry-API eingeführt:
  - `createAliasMap(generators)`
  - `buildPoolMap(generators)`
  - `resolvePool(mode, options)`
  - `attachMeta(question, mode, profile, options)`
  - `listPools()`
- [x] Pool-Blueprints physisch aus `app.js` herausgezogen und in `generator-registry.js` definiert.
- [x] `app.js` kontrolliert angebunden:
  - `resolveBranchGeneratorPool(mode)` nutzt jetzt zuerst `EGTGeneratorRegistry.resolvePool(...)`.
  - `attachBranchPoolMeta(q, mode)` nutzt jetzt zuerst `EGTGeneratorRegistry.attachMeta(...)`.
  - `fallbackGeneratorPool(mode)` bleibt als Sicherheitsfallback erhalten, falls die Registry nicht verfügbar ist.
- [x] Branch-Gewichtung für `bps` und `jogging` läuft jetzt über die Registry, basierend auf `EGTBranchQuestionPools`/`EGT_ACTIVE_QUESTION_PROFILE`.
- [x] Fragen bekommen zusätzlich `generatorRegistryVersion`, sofern über die Registry verarbeitet.
- [x] `index.html` lädt `js/core/generator-registry.js` direkt nach `branch-question-pools.js` und vor den Branch-/Entry-Modulen.
- [x] `architecture-guard.js` prüft `EGTGeneratorRegistry` und die neue Core-Datei.
- [x] `service-worker.js` cached `js/core/generator-registry.js`; Cache auf `egt-trainer-g45-0` erhöht.
- [x] Version auf `G45.0` gesetzt.
- [x] `module-manifest.json` um `phase7` erweitert.
- [x] Arbeitsnachweise erstellt: `docs/G45_0_PHASE7_GENERATOR_REGISTRY_REPORT.md` und `docs/G45_0_PHASE7_GENERATOR_REGISTRY_QA.json`.
- [x] Statische Tests durchgeführt: JS-Syntaxcheck, JSON-Validierung, Service-Worker-Assetprüfung und ZIP-Test.

**Bewusste Grenze Phase 7:**
- [ ] Die Generatorfunktionen selbst bleiben in `app.js`.
- [ ] `buildQuiz()` bleibt weiterhin zentrale Runtime-Schleife.
- [ ] CTC-Lohr-Festblockstruktur, Coach-Adaptive-Regeln, Result/Review, Highscore, Admin/Auth/Firebase und Demo-Limits wurden nicht verändert.
- [ ] Kein Browser-Live-Test durchgeführt; statische QA ist bestanden.

**Nächster sinnvoller Schritt:** Phase 8 — QuestionBank-/Datenpool-Grenze pro Branch oder BuildQuiz-Orchestrator weiter aus `app.js` herauslösen.


### ✅ PHASE 7.5 — Smoke-Test-Handoff / QA-Testplan
**Ziel:** Nicht weiter blind umbauen. Vor Phase 8 wird der aktuelle Modulstand auf echten Geräten getestet, damit Routing-, Gate-, Simulation-, Profil-, Highscore- und Darstellungsfehler früh sichtbar werden.

- [x] Entscheidung getroffen: Vor Phase 8 wird ein Smoke-Test-/QA-Schnitt eingeschoben.
- [x] Version auf `G45.1` gesetzt und mit `node sync-version.js` synchronisiert.
- [x] Working Plan aktualisiert, damit andere KIs wissen: nächster Schritt ist Test/Auswertung, nicht sofort Phase 8.
- [x] QA-Testcheckliste erstellt: `QA-SMOKE-TEST-CHECKLIST-G45.1.md`.
- [x] Arbeitsnachweis erstellt: `docs/G45_1_PHASE7_5_SMOKE_TEST_HANDOFF_REPORT.md`.
- [x] QA-Statusdatei erstellt: `docs/G45_1_PHASE7_5_SMOKE_TEST_HANDOFF_QA.json`.
- [x] Die App-Fachlogik wurde in dieser Phase bewusst nicht verändert.

**Was jetzt getestet werden muss:**
- [ ] App-Start, Cache/PWA, weißer Bildschirm, Version/Refresh.
- [ ] Sperrbildschirm, Login, Registrierung, Demo-Modus.
- [ ] Startseite, Bottom-Navigation, Deep-Sheets.
- [ ] Practice-Modul / freies Lernen.
- [ ] Branch-Simulationen IT/FISI, Kaufmännisch und Sozialpädagogik.
- [ ] Standard-Multiple-Choice-Rendering.
- [ ] Fragenübersicht mit 30er-Pagination.
- [ ] Route-Memory / Busfahrtroute.
- [ ] EDV-Multi.
- [ ] Konzentrations-/Tabellenaufgaben, insbesondere Lesbarkeit und Scrollverhalten.
- [ ] Ergebnisbildschirm, Fehleranalyse, Zurück/Nochmal starten.
- [ ] Profil, Admin, Highscore, Coach, Analyse, Duell.
- [ ] Geräteansichten iPhone, iPad und Desktop/Chrome.

**Bewusste Grenze Phase 7.5:**
- [ ] Kein CSS-Finaldesign.
- [ ] Kein `buildQuiz()`-Umbau.
- [ ] Keine Änderung an Firebase, Login, Admin, Profil, Highscore, Coach, Duell oder Demo-Limits.
- [ ] Keine neuen Module/Features.

**Nächster Schritt nach Nutzer-Test:**
1. Screenshots und Erklärungen auswerten.
2. Blocker und kritische Darstellungsbugs priorisieren.
3. Erst danach entscheiden: Bugfix-Phase einschieben oder mit Phase 8 fortfahren.

---

### ✅ PHASE 8 — Quiz-Orchestrator-Grenze / buildQuiz-Entkopplung  ← **AKTUELLER STAND G46.0**
**Ziel:** `buildQuiz()` nicht mehr als reinen Monolith in `js/app.js` führen. Stattdessen wurde eine kontrollierte Orchestrator-Grenze eingeführt, die Quiz-Aufbau, Memory-Anteil, Duplikat-Schutz, DNA-Validierung, Matrix-Sprint-Sonderfall und finale Sortierung zentral kapselt.

- [x] Neue Core-Datei erstellt: `js/core/quiz-orchestrator.js`.
- [x] Neues Global eingeführt: `window.EGTQuizOrchestrator`.
- [x] Neue Orchestrator-API eingeführt: `EGTQuizOrchestrator.build(ctx)`.
- [x] `js/app.js:buildQuiz()` ist jetzt Wrapper über `EGTQuizOrchestrator.build(...)`.
- [x] Alte Logik als Sicherheitsfallback erhalten: `buildQuizInternal()`.
- [x] Orchestrator erhält Generatoren, Coach, Memory, Matrix-Sprint, Validierung, Signatur und Shuffle nur über explizite Hooks.
- [x] `index.html` lädt `js/core/quiz-orchestrator.js` nach `generator-registry.js` und vor `app.js`.
- [x] `architecture-guard.js` prüft `EGTQuizOrchestrator` und die neue Datei.
- [x] `service-worker.js` cached `js/core/quiz-orchestrator.js`.
- [x] Version auf `G46.0` gesetzt.
- [x] `module-manifest.json` aktualisiert.
- [x] Arbeitsnachweis erstellt: `docs/G46_0_PHASE8_QUIZ_ORCHESTRATOR_REPORT.md`.
- [x] QA-Statusdatei erstellt: `docs/G46_0_PHASE8_QUIZ_ORCHESTRATOR_QA.json`.

**Bewusste Grenze Phase 8:**
- [ ] Generatorfunktionen selbst wurden nicht verschoben.
- [ ] `generateQuestionForMode(...)` bleibt vorerst in `js/app.js`.
- [ ] Result/Review/Highscore/Coach/Admin/Auth/Firebase/Demo-Limits wurden nicht verändert.
- [ ] Kein CSS-Finaldesign und keine Darstellungsfixes in dieser Phase.

**Warum dieser Schritt wichtig ist:**
- Neue Branchen sollen später nicht mehr direkt in `app.js:buildQuiz()` eingebaut werden müssen.
- Der Quiz-Aufbau hat jetzt eine zentrale Schicht, die von Branch-Pools und GeneratorRegistry getrennt angesteuert werden kann.
- Weitere Auslagerung kann jetzt sauber in Richtung `generateQuestionForMode`, Datenpools und QuestionBanks erfolgen.

**Nächster sauberer Schritt:**
- Phase 9: QuestionBank-/Datenpool-Grenzen pro Branche weiter trennen oder `generateQuestionForMode(...)` als nächste Orchestrator-Schicht aus `app.js` lösen.

---

## 6. ARBEITSREGELN FÜR JEDE KI (WICHTIG!)

1. **IMMER zuerst dieses README lesen.** Dann wissen, in welcher Phase wir sind („HIER SIND WIR JETZT").
2. **Nach JEDEM Schritt dieses README aktualisieren:** Häkchen setzen, Marker verschieben, neue Erkenntnisse eintragen.
3. **Radikale Änderungen sind erlaubt**, aber: immer mit Playwright headless testen (offline, `file://`), bevor ZIP übergeben wird.
4. **Versionen immer konsistent** (nach Phase 1 nur noch EINE Stelle).
5. **Nichts entfernen, das funktioniert**, ohne Ersatz. Module sauber kapseln.
6. **ZIP-Konvention:** `/mnt/user-data/outputs/Eignungstest-Trainer-{VERSION}-{BESCHREIBUNG}.zip`
7. **Bei Unklarheit:** STOPPEN und den Menschen fragen, bevor Code geschrieben wird.
8. **Firebase-Config, Session-Keys, courseId NIEMALS ändern** (siehe Abschnitt 3).

---

## 7. CHANGELOG (von KIs gepflegt)

| Datum | Version | Was wurde gemacht | Von |
|-------|---------|-------------------|-----|
| 2026-06-14 | G39.14.6 | Working-Plan (dieses Dokument) erstellt, App vollständig analysiert | Claude |
| 2026-06-14 | G40.0 | Phase 1: Zentrale Versionsverwaltung (app-config.js + sync-version.js), JS-Crash-Quelle beseitigt | Claude |
| 2026-06-14 | G40.1 | Phase 2A: EGTSimulation-ModuleHost, Adapter in app.js, Simulations-CSS, Ergebnis-Buttons, Manifest repariert, Service-Worker erweitert, Tests dokumentiert | ChatGPT |
| 2026-06-14 | G40.2 | Phase 2B: EGTSimulation-Kontroll-API, app.js-Adapter erweitert, zentrale Runtime-Aufrufe über ModuleHost geleitet, Working Plan + QA aktualisiert | ChatGPT |
| 2026-06-15 | G40.3 | Phase 2C: Standard-MC-Rendering physisch in EGTSimulation verschoben, app.js auf Spezialadapter reduziert, Working Plan + QA aktualisiert | ChatGPT |
| 2026-06-15 | G40.4 | Phase 2D: Frageübersicht/updateQuestionNav physisch in EGTSimulation verschoben, Shell-Hooks für Drawer/Jump/Total ergänzt, Working Plan + QA aktualisiert | ChatGPT |
| 2026-06-15 | G40.5 | Phase 2E: Result-Grenze definiert, Ergebnis-Summary/Header in EGTSimulation vorbereitet, Shell-Hooks für Detailauswertung/Highscore/Coach belassen, Working Plan + QA aktualisiert | ChatGPT |
| 2026-06-15 | G40.6 | Phase 2F: Route-Memory-Spezialrenderer in EGTSimulation migriert, Route-Auswahl/Undo/Clear/Submit modularisiert, Shell-Hooks für History/Fortschritt belassen, Working Plan + QA aktualisiert | ChatGPT |
| 2026-06-15 | G40.7 | Phase 2G: EDV-Multi-Spezialrenderer in EGTSimulation migriert, EDV-Auswahl/Undo/Clear/Submit modularisiert, Shell-Hooks für Visual/History/Fortschritt/Navigation belassen, Working Plan + QA aktualisiert | ChatGPT |
| 2026-06-15 | G41.0 | Phase 3A: Shell/ModuleHost-Vertrag eingeführt, AppModuleHost erstellt, Branch-Kontext zentralisiert, Simulation Deep-Sheet mit IT/Kaufm/Sozial-Startkarten versehen, Working Plan + QA aktualisiert | ChatGPT |
| 2026-06-15 | G41.1 | Phase 3B: Entry-Module für Home, SimulationEntry und PracticeEntry erstellt, über AppModuleHost registriert, UI-Router auf Entry-Module vorbereitet, Working Plan + QA aktualisiert | ChatGPT |
| 2026-06-15 | G41.2 | Phase 3C: Admin/Profile Entry-Module erstellt, Login/Admin/Profile/Home-Türen über AppModuleHost geroutet, Working Plan + QA aktualisiert | ChatGPT |
| 2026-06-15 | G41.3 | Phase 3D: Highscore/Coach/Analysis/Duell Entry-Module erstellt, weitere UI-Türen über AppModuleHost geroutet, Working Plan + QA aktualisiert | ChatGPT |
| 2026-06-15 | G42.0 | Phase 4: Freies Lern-/Übungsmodul als echtes Fachmodul erstellt, EGTPracticeModule + egt-practice.css ergänzt, PracticeEntry delegiert an das neue Modul, Working Plan + QA aktualisiert | ChatGPT |
| 2026-06-15 | G43.0 | Phase 5: Branchenspezifische Simulationsmodule `sim-it`, `sim-kaufm`, `sim-sozial` erstellt, UI-Router/Home/SimulationEntry auf Branch-Module geroutet, Working Plan + QA aktualisiert | ChatGPT |
| 2026-06-15 | G44.0 | Phase 6: Branch-QuestionPool-Resolver erstellt, AppModuleHost/Branch-Module um questionPoolProfile erweitert, buildQuiz kontrolliert an branchenspezifische gewichtete Pools angebunden, Working Plan + QA aktualisiert | ChatGPT |
| 2026-06-15 | G45.0 | Phase 7: GeneratorRegistry erstellt, Pool-Blueprints aus app.js herausgezogen, buildQuiz kontrolliert über EGTGeneratorRegistry.resolvePool/attachMeta angebunden, Working Plan + QA aktualisiert | ChatGPT |
| 2026-06-15 | G45.1 | Phase 7.5: Smoke-Test-Handoff erstellt, Working Plan auf Test-/Screenshot-Auswertung umgestellt, QA-Checkliste für iPhone/iPad/Desktop ergänzt, keine Runtime-Fachlogik verändert | ChatGPT |
| 2026-06-15 | G46.0 | Phase 8: Quiz-Orchestrator erstellt, buildQuiz als Wrapper über EGTQuizOrchestrator.build angebunden, buildQuizInternal als Fallback erhalten, Working Plan + QA aktualisiert | ChatGPT |
| 2026-06-15 | G47.0 | Phase 9: QuestionFactory erstellt, generateQuestionForMode als Wrapper über EGTQuestionFactory.generate angebunden, generateQuestionForModeInternal als Fallback erhalten, Working Plan + QA aktualisiert | ChatGPT |
| 2026-06-15 | G49.0 | Phase 11: Result Review Engine erstellt, Ergebniszusammenfassung/Kategorieauswertung/Tipps/Fehler-Review/Analyse-Rendering über EGTResultReviewEngine angebunden, alte Inline-Pfade als Fallback erhalten, Working Plan + QA aktualisiert | ChatGPT |
| 2026-06-15 | G48.0 | Phase 10: QuestionBank Router erstellt, fromQuestionBank über EGTQuestionBankRouter.resolve angebunden, Branch-/ExamTarget-Priorisierung aus app.js herausgelöst, Legacy-Filter als Fallback erhalten, Working Plan + QA aktualisiert | ChatGPT |
| 2026-06-15 | G52.2 | Phase 16: Highscore-/Duell-UI Engine erstellt, Duell-Setup/History/Comparison/Avatar/HighscoreData als Fachmodul js/core/highscore-duel-ui-engine.js gekapselt, app.js delegiert UI-Rendering, Version/Cache/Manifest/QA aktualisiert | ChatGPT |
| 2026-06-15 | G52.1 | Phase 15: Cloud Highscore Engine erstellt, Supabase-/Cloud-Ranking-Logik aus app.js in js/core/cloud-highscore-engine.js ausgelagert, globale Instanz window.CloudHighscoreEngine gesetzt, Premium-Bridge erhalten, Fallback eingebaut, QA aktualisiert | ChatGPT |
| 2026-06-15 | G52.0 | Phase 14: Highscore Dashboard Engine erstellt, lokale Highscore-/Dashboard-Logik aus app.js in js/core/highscore-dashboard-engine.js ausgelagert, App-Adapter mit Fallback erhalten, Working Plan + QA aktualisiert | ChatGPT |
| | | ← nächster Eintrag hier | |

---

**HIER SIND WIR JETZT: Phase 10 abgeschlossen. Nächster Schritt: G48.0 kurz smoke-testen, danach Phase 11 Result / Review / Fehleranalyse modularisieren.**

---

### ✅ G46.1 — Übergabe-ZIP für nächsten Chat / Arbeitsstand nach Phase 8

**Ziel:** Der nächste Chat soll ohne Vorgeschichte exakt wissen, was bisher erledigt wurde, wo die Architektur aktuell steht und womit weitergemacht werden soll.

Erledigt:

- [x] Übergabedokument erstellt: `docs/G46_1_NEXT_CHAT_HANDOFF.md`.
- [x] QA-Übergabedatei erstellt: `docs/G46_1_HANDOFF_QA.json`.
- [x] Version auf `G46.1` gesetzt.
- [x] `manifest.json`, `update-check.json`, `module-manifest.json` aktualisiert.
- [x] Service-Worker-Cache auf `egt-trainer-g46-1` gesetzt.
- [x] Working Plan an den Anfang mit Übergabestatus ergänzt.

**Historischer Stand:** Diese Übergabe war der Startpunkt für Phase 9. Phase 9 wurde inzwischen in `G47.0` erledigt. Nächster Schritt ist Phase 10.

**Nicht tun:** Keine großen CSS-Fixes, keine Admin/Auth/Firebase-/Highscore-Tiefenänderungen, keine alten Fallbacks entfernen, solange keine Browser-QA durchgeführt wurde.

| Datum | Version | Änderung | Bearbeiter |
|---|---|---|---|
| 2026-06-15 | G46.1 | Übergabe-ZIP nach Phase 8 erstellt, Next-Chat-Handoff dokumentiert, Working Plan aktualisiert | ChatGPT |

**Historischer Marker:** Phase 10 wurde in `G48.0` erledigt. Aktueller nächster Schritt: Phase 11 nach Smoke-Test.

---

### ✅ G47.0 / PHASE 9 — QuestionFactory-Grenze / generateQuestionForMode entkoppelt

**Ziel:** `generateQuestionForMode(...)` nicht mehr als reine Monolith-Funktion in `js/app.js` führen. Stattdessen wurde eine kontrollierte Core-Grenze eingeführt, die Modus-/Branch-/Block-Entscheidung kapselt, während alle echten Generatorfunktionen und Datenbankzugriffe bewusst unverändert bleiben.

Erledigt:

- [x] Neue Core-Datei erstellt: `js/core/question-factory.js`.
- [x] Neues Global eingeführt: `window.EGTQuestionFactory`.
- [x] Neue API eingeführt: `EGTQuestionFactory.generate(ctx)` und `EGTQuestionFactory.resolveSource(ctx)`.
- [x] `js/app.js:generateQuestionForMode()` ist jetzt Wrapper über `EGTQuestionFactory.generate(...)`.
- [x] Alte Logik als Sicherheitsfallback erhalten: `generateQuestionForModeInternal(...)`.
- [x] Die QuestionFactory übernimmt kontrolliert:
  - Duell-Festblock-Mix,
  - CTC-Lohr-Festblockstruktur,
  - CTC-Adaptive-Weiterleitung,
  - Standard-Branch-Pool-Auswahl,
  - adaptive Coach-Level-/Zeitlogik,
  - Signatur-/ID-Erzeugung,
  - Branch-Metadaten-Anbindung über Hook.
- [x] `buildQuiz()` ruft Kernfragen jetzt einheitlich über `generateQuestionForMode(...)` auf, auch für `ctc`.
- [x] `index.html` lädt `js/core/question-factory.js` nach `quiz-orchestrator.js` und vor `app.js`.
- [x] `architecture-guard.js` prüft `EGTQuestionFactory` und die neue Datei.
- [x] `service-worker.js` cached `js/core/question-factory.js`.
- [x] `module-manifest.json` aktualisiert.
- [x] Version auf `G47.0` gesetzt und mit `node sync-version.js` synchronisiert.
- [x] Arbeitsnachweis erstellt: `docs/G47_0_PHASE9_QUESTION_FACTORY_REPORT.md`.
- [x] QA-Statusdatei erstellt: `docs/G47_0_PHASE9_QUESTION_FACTORY_QA.json`.

**Bewusste Grenze Phase 9:**

- [ ] Generatorfunktionen selbst wurden nicht verschoben.
- [ ] QuestionBank-Dateien wurden nicht fachlich neu sortiert.
- [ ] `buildQuizInternal()` bleibt als Sicherheitsfallback erhalten.
- [ ] Result/Review/Highscore/Coach/Admin/Auth/Firebase/Demo-Limits wurden nicht verändert.
- [ ] Kein CSS-Finaldesign und keine Darstellungsfixes in dieser Phase.

**Warum dieser Schritt wichtig ist:**

- Die nächste große Entscheidungslogik ist aus `app.js` herausgelöst.
- Neue Modi/Branchen können später sauberer über Factory/Resolver-Grenzen erweitert werden.
- `app.js` wird weiter zum Adapter statt zum zentralen Gehirn für alles.
- Phase 10 kann jetzt gezielt die Datenpools/QuestionBanks pro Branche strukturieren.

**Nächster sauberer Schritt:**

- Phase 10: QuestionBanks / Datenpools pro Branch sauberer strukturieren.

---

### ✅ G48.0 / PHASE 10 — QuestionBank Router / Datenpool-Grenze

**Ziel:** QuestionBanks und Datenpools pro Branch aus `app.js` herauslösen, ohne Dateninhalte, Generatoren oder UI zu verändern. Die App soll weiterhin stabil laufen, aber die Auswahl der Datenbank-Kandidaten bekommt eine eigene Core-Grenze.

Erledigt:

- [x] Neue Core-Datei erstellt: `js/core/question-bank-router.js`.
- [x] Neues Global eingeführt: `window.EGTQuestionBankRouter`.
- [x] Neue API eingeführt:
  - `EGTQuestionBankRouter.resolve(ctx)`
  - `EGTQuestionBankRouter.index(items)`
  - `EGTQuestionBankRouter.inferBranch(item)`
  - `EGTQuestionBankRouter.branchScore(item, branch)`
  - `EGTQuestionBankRouter.listBranches()`
  - `EGTQuestionBankRouter.describeBranch(branch)`
- [x] `js/app.js:fromQuestionBank(...)` nutzt jetzt `routeQuestionBankCandidates(...)`.
- [x] `routeQuestionBankCandidates(...)` delegiert an `EGTQuestionBankRouter.resolve(...)`.
- [x] Alter Kandidatenfilter als `legacyQuestionBankCandidates(...)` erhalten.
- [x] Branch-Priorisierung eingeführt für:
  - `it`
  - `kaufm`
  - `sozial`
  - `wissen`
- [x] ExamTarget-Logik (`ctc`, `bps`, `both`) aus der direkten App-Auswahl in die Router-Grenze verschoben.
- [x] `bootstrapExternalQuestionBank()` erzeugt optional `QUESTION_BANK.branchIndex` über `EGTQuestionBankRouter.index(...)`.
- [x] `generateQuestionForMode(...)` übergibt den aktiven Modus an `fromQuestionBank(...)`, damit Factory/Router nicht versehentlich am falschen `state.selectedMode` hängen.
- [x] `index.html` lädt `js/core/question-bank-router.js` vor `js/app.js`.
- [x] `architecture-guard.js` prüft `EGTQuestionBankRouter` und die neue Datei.
- [x] `service-worker.js` cached `js/core/question-bank-router.js`.
- [x] `module-manifest.json` aktualisiert.
- [x] Version auf `G48.0` gesetzt und mit `node sync-version.js` synchronisiert.
- [x] Arbeitsnachweis erstellt: `docs/G48_0_PHASE10_QUESTION_BANK_ROUTER_REPORT.md`.
- [x] QA-Statusdatei erstellt: `docs/G48_0_PHASE10_QUESTION_BANK_ROUTER_QA.json`.

**Bewusste Grenze Phase 10:**

- [ ] QuestionBank-Dateninhalte wurden nicht verändert.
- [ ] Generatorfunktionen wurden nicht verschoben.
- [ ] UI/CSS/Darstellung wurde nicht verändert.
- [ ] Result/Review/Highscore/Coach/Admin/Auth/Firebase/Demo-Limits wurden nicht verändert.
- [ ] Alte Fallbacks wurden nicht entfernt.

**HIER SIND WIR JETZT:** Phase 10 abgeschlossen. Nächster Schritt: G48.0 kurz smoke-testen, danach Phase 11 Result / Review / Fehleranalyse modularisieren.


---

### ✅ G49.0 / PHASE 11 — Result Review Engine / Fehleranalyse-Grenze

**Status:** abgeschlossen, statische QA bestanden, Browser-Smoke-Test empfohlen.

#### Erledigt

- [x] Neue Core-Datei erstellt: `js/core/result-review-engine.js`.
- [x] Neues Global erstellt: `window.EGTResultReviewEngine`.
- [x] Ergebniszusammenfassung über `buildSummary(ctx)` und `renderResultHeader(summary,hooks)` angebunden.
- [x] Kategorieauswertung über `renderCategoryStats(ctx)` angebunden.
- [x] Tipps nach Ergebnis über `renderTips(ctx, percent)` angebunden.
- [x] Fehler-Review über `renderReview(ctx)` angebunden.
- [x] Speicher-Kategorie-Payload über `buildCategoryMap(ctx)` angebunden.
- [x] Analyse-Rendering über `renderAnalysis(ctx)` angebunden.
- [x] Alte Inline-Result-/Review-/Tips-/Analysis-Pfade in `app.js` als Fallback erhalten.
- [x] `index.html` lädt `js/core/result-review-engine.js` vor `js/app.js`.
- [x] `service-worker.js` cached `js/core/result-review-engine.js`.
- [x] `architecture-guard.js` prüft `EGTResultReviewEngine` und die neue Core-Datei.
- [x] Version auf `G49.0` gesetzt und mit `node sync-version.js` synchronisiert.
- [x] Arbeitsnachweis erstellt: `docs/G49_0_PHASE11_RESULT_REVIEW_ENGINE_REPORT.md`.
- [x] QA-Statusdatei erstellt: `docs/G49_0_PHASE11_RESULT_REVIEW_ENGINE_QA.json`.

#### Bewusst nicht erledigt

- [ ] CSS-/Darstellungsfehler.
- [ ] Layout-Shift / springende Aufgabenfenster.
- [ ] Highscore-/Cloud-Refactor.
- [ ] Firebase/Auth/Admin-Refactor.
- [ ] Aufgabeninhalte oder Generatoren verändern.

#### Nächste Entscheidung

**HIER SIND WIR JETZT:** Phase 11 abgeschlossen. Nächster Schritt: G49.0 kurz smoke-testen. Danach entweder `G50.0 / Phase 12` für Persistenz/Highscore/Coach-Hooks oder bei starkem Layout-Shift `G49.5` als No-Shift/UI-Fixphase.


---

### ✅ G50.0 / PHASE 12 — Result Persistence Engine / Speicher- und Hook-Grenze

**Status:** abgeschlossen, statische QA bestanden, Browser-Smoke-Test empfohlen.

#### Ziel

Speicherung, Result-Payload, lokale Highscore-Aktualisierung, CloudHighscore-Sync sowie Coach-/Admin-/Demo-Hooks aus `js/app.js` herauslösen, ohne bestehende Storage-, Auth-, Admin-, Highscore- oder Cloud-Fachlogik riskant zu verändern.

#### Erledigt

- [x] Neue Core-Datei erstellt: `js/core/result-persistence-engine.js`.
- [x] Neues Global erstellt: `window.EGTResultPersistenceEngine`.
- [x] Neue API eingeführt:
  - `buildCategoryMap(ctx)`
  - `buildSession(ctx)`
  - `buildRecord(ctx)`
  - `persistResult(ctx)`
  - `recordAnswerAttempt(ctx)`
  - `finishCoachSession(ctx)`
  - `dispatchHooks(ctx, latest)`
- [x] `js/app.js:saveResult(...)` ist jetzt Wrapper über `EGTResultPersistenceEngine.persistResult(...)`.
- [x] Alter Speicherpfad vollständig erhalten als `saveResultInternal(...)`.
- [x] Neuer Kontext-Helfer eingeführt: `resultPersistenceContext(...)`.
- [x] Antwort-Hooks aus `recordAnswer(...)` über `EGTResultPersistenceEngine.recordAnswerAttempt(...)` angebunden.
- [x] Session-Ende aus `showResult()` über `EGTResultPersistenceEngine.finishCoachSession(...)` angebunden.
- [x] `index.html` lädt `js/core/result-persistence-engine.js` vor `js/app.js`.
- [x] `service-worker.js` cached `js/core/result-persistence-engine.js`.
- [x] `architecture-guard.js` prüft `EGTResultPersistenceEngine` und die neue Core-Datei.
- [x] Version auf `G50.0` gesetzt und mit `node sync-version.js` synchronisiert.
- [x] Arbeitsnachweis erstellt: `docs/G50_0_PHASE12_RESULT_PERSISTENCE_ENGINE_REPORT.md`.
- [x] QA-Statusdatei erstellt: `docs/G50_0_PHASE12_RESULT_PERSISTENCE_ENGINE_QA.json`.

#### Bewusst nicht erledigt

- [ ] CSS-/Darstellungsfehler.
- [ ] Layout-Shift / springende Aufgabenfenster.
- [ ] Highscore-/Cloud-Engine physisch komplett verschieben.
- [ ] Firebase/Auth/Admin-Fachlogik verändern.
- [ ] Aufgabeninhalte oder Generatoren verändern.
- [ ] Alte Fallbacks entfernen.

#### Nächste Entscheidung

**HIER SIND WIR JETZT:** Phase 12 abgeschlossen. Nächster sinnvoller Schritt nach Smoke-Test: `G50.5` Layout-Stabilität / No-Shift-Fix. Alternative: `G51.0 / Phase 13` Highscore/Cloud weiter physisch aus `app.js` lösen.

---

### ✅ G51.0 / PHASE 13 — Home Lifecycle / Simulation Cleanup Fix

**Status:** abgeschlossen, statische QA bestanden, Browser-/Geräte-Smoke-Test empfohlen.

#### Anlass

Nach User-Test auf iPad/Desktop blieb nach **Testende → Auswertung → Zurück zur Startseite** der alte Simulations-/Auswertungsbereich im unteren Dokumentbereich erreichbar. Ein Browser-Refresh reparierte den Zustand, der interne Home-Wechsel aber nicht.

#### Erledigt

- [x] `App.restart()` ersetzt durch harten Home-Cleanup über `goHomeHard("restart-home-button")`.
- [x] `setAppSection("home")` und `setAppSection("start")` führen jetzt ebenfalls den harten Home-Cleanup aus.
- [x] Neuer zentraler Screen-Lifecycle in `js/app.js`:
  - `closeRuntimeOverlaysForHome()`
  - `stopActiveModuleForHome(reason)`
  - `persistInterruptedRunForHome(reason)`
  - `resetRuntimeDomAfterHome()`
  - `forceHomeScrollTop()`
  - `goHomeHard(reason)`
- [x] Aktive Simulation-/Branch-Module werden über `AppModuleHost.stopActive(...)` beendet, außer Home selbst ist aktiv.
- [x] Laufende Simulationen werden beendet; fertig ausgewertete Sessions werden nicht rückwirkend als abgebrochen markiert.
- [x] Runtime-DOM für Frage, Visual, Antworten, Feedback und Fragenübersicht wird beim Home-Wechsel geleert.
- [x] Body-/HTML-Klassen für Simulation, Quizscreen, Overlay, Deep-Sheet, Training-Sheet und QNav-Drawer werden entfernt.
- [x] Alle relevanten Scrollcontainer werden mehrfach auf `0` gesetzt: `window`, `document`, `body`, `#start`, `#uiShell`, `#uiHomeViewport`, `#uiTabContent`, `#uiModuleGridWrap`.
- [x] Falls Home während eines aktiven Tests erreicht wird, werden offene Aufgaben streng gewertet und das Ergebnis gespeichert, bevor Home gerendert wird.
- [x] `EGTSimulation.abort(...)` überschreibt fertige Sessions nicht mehr als `aborted`; es schließt dann nur noch Flags/Timer und emittiert `closed`.
- [x] Version auf `G51.0` gesetzt und mit `node sync-version.js` synchronisiert.
- [x] Arbeitsnachweis erstellt: `docs/G51_0_HOME_LIFECYCLE_CLEANUP_REPORT.md`.
- [x] QA-Statusdatei erstellt: `docs/G51_0_HOME_LIFECYCLE_CLEANUP_QA.json`.

#### Bewusst nicht erledigt

- [ ] Keine große CSS-/Layout-Shift-Reparatur.
- [ ] Keine Konzentrations-/Tabellen-/Scanner-Darstellung repariert.
- [ ] Keine Firebase/Auth/Admin-/Highscore-Fachlogik verändert.
- [ ] Keine Aufgabeninhalte verändert.
- [ ] Keine alten Fallbacks entfernt.

#### Nächster Test

1. Simulation starten.
2. Test beenden.
3. Auswertung anzeigen.
4. **Zurück zur Startseite** klicken.
5. Prüfen: Home steht oben, kein alter Simulations-/Auswertungsbereich darunter, kein Refresh nötig.
6. Wiederholen auf Desktop Chrome, iPad M2 und iPhone.

**HIER SIND WIR JETZT:** G51.0 behebt den harten Navigation-/Lifecycle-Blocker. Nach Smoke-Test können die restlichen Layout- und Darstellungsfehler gesammelt als eigene No-Shift-/Device-Fixphase bearbeitet werden.



## G51.1 – Hard Screen Isolation / Visual Cleanup Fix

- Status: umgesetzt.
- Anlass: Nutzer-Test meldete weiterhin sichtbaren/pausierten Simulationsrest unter der Startseite nach Testende bzw. Zurück zur Startseite.
- Änderung: Hauptscreens werden nicht mehr nur mit `.hidden` versteckt, sondern über `showOnly()` hart isoliert.
- Ergebnis: Home entfernt Runtime-Screens aus sichtbarem Layoutfluss (`display:none!important`, `hidden`, `height 0`).
- Zusatz-QA: Headless-Chromium-Test mit absichtlich sichtbarem Runtime-Rest; nach `App.restart()` war kein alter Testinhalt sichtbar.


## G51.3 – Simulation Viewport / Route UI Polish Fix

- Status: umgesetzt.
- Anlass: Nutzer-Test bestätigt G51.2 gegen Springen, meldet aber weiterhin schlechte Darstellung: Route-Memory mit Innen-Scrollbar, dauerhafte/kaputte Frageübersicht rechts, zu dominanter Timer und uneinheitliche Kacheln.
- Änderung: `#questionNav` ist jetzt ein echter aufklappbarer Drawer statt rechter Layoutspalte.
- Änderung: Route-Memory-SVG nutzt ein 4-Spalten-Snake-Raster, damit lange Straßennamen nicht mehr brutal überlappen.
- Änderung: Route-Memory-Visual, Antwortbereich, Aktionsleiste und Timer wurden im Cockpit vereinheitlicht.
- Änderung: Route-Antwortchips wurden auf Desktop verdichtet, damit nach der Animation keine unnötige Innen-Scrollbar entsteht.
- Visuelle QA: Headless-Chromium-Mock mit produktivem CSS für Desktop, iPad-Landscape und iPhone-Profil.
- Ergebnis Desktop: kein horizontaler Overflow, kein Route-Scene-Innen-Overflow, Frageübersicht geschlossen wirklich hidden, geöffnet als Drawer.
- Ergebnis Route-Ready Desktop: passt vollständig in 1751×900 Viewport.

**HIER SIND WIR JETZT:** G51.3 behebt die sichtbaren Cockpit-/Route-/Frageübersicht-Darstellungsfehler aus dem Screenshot. Nächster Test: echte Geräte prüfen, ob einzelne andere Aufgabentypen ebenfalls von eigenen Speziallayouts profitieren müssen.

## G51.4 – Appwide Spacing / Visual Polish Fix

- Status: umgesetzt, statische QA bestanden, visuelle Headless-Chromium-Prüfung durchgeführt.
- Anlass: Nach G51.3 meldet der User appweit uneinheitliche Abstände: Buttons/Kacheln teilweise zu eng, zu wenig Innenabstand, uneinheitlicher visueller Rhythmus.
- Änderung: Neue additive CSS-Datei `css/ui-spacing-polish.css` wird als letzte CSS-Datei geladen.
- Änderung: Appweite Tokens für Button-Höhen, Kachel-Paddings, Grid-Gaps, Action-Gruppen und Panel-Radien eingeführt.
- Änderung: Gemeinsame Button-/Kachelklassen für Home, Deep-Sheets, Gate, Coach, Profil, Analyse, Result und Simulation vereinheitlicht.
- Änderung: Auf kleinen Geräten werden enge Button-Gruppen einspaltig und mit voller Breite dargestellt.
- Änderung: Frageübersicht-Drawer-Toggle-Hitbox nach G51.4a wieder stabilisiert.
- Visuelle QA: Headless-Chromium-Checks für Desktop Home, Desktop Einstellungen/Mehr-Sheet, Simulation geschlossen/geöffnet, iPad-Landscape Simulation und iPhone Simulation.
- Ergebnis: Kein horizontaler Overflow und keine engen Button-/Gap-Fails in den geprüften Kernflächen; Settings-Sheet visuell sauber.
- Einschränkung: Nicht jede versteckte dynamische Spezialseite konnte in der Headless-Umgebung vollständig durchgeklickt werden. Der Fix wirkt deshalb appweit über gemeinsame Klassen und muss auf echten Geräten mit Screenshots für Spezialfälle nachkontrolliert werden.

**HIER SIND WIR JETZT:** G51.4 behebt die große appweite Spacing-/Button-/Kachel-Baustelle über ein finales UI-Polish-Layer. Nächster sinnvoller Schritt: echter Geräte-Smoke-Test auf Desktop/iPad/iPhone; danach nur noch einzelne Spezialseiten mit Screenshot nachschärfen.

## G51.5 – Appwide Grid Density / Visual Audit Fix

- Status: umgesetzt.
- Neue Datei: `css/ui-density-grid-polish.css` als finaler UI-Abstands-Layer.
- Schwerpunkt: Kacheln kleben nicht mehr direkt aneinander; Ergebnis, Simulation, Highscore, Duell und Admin erhalten größere gemeinsame Grid-Gaps.
- Wichtiger Fix: `.hidden` wird wieder absolut respektiert, damit versteckte Screens durch `display:grid`-Regeln nicht sichtbar werden.
- Wichtiger Fix: `.bigScore` im Ergebnis bleibt kreisförmig und stretcht nicht zur Pille.
- Visuelle Prüfung: Desktop, iPad-Landscape und iPhone-Profil in Headless-Chromium; Ergebnis: 0 horizontaler Overflow, 0 Button-Hitbox-Fails, 0 Kachel-Overlaps in den geprüften Screens.
- Hinweis: Echte iOS-Safari-Feinheiten bitte weiterhin mit physischem iPhone/iPad prüfen.

**AKTUELLER STAND:** G51.5 ist der aktuelle UI-Spacing-Stand. Beim nächsten Test bitte Auswertung, Simulation, Frageübersicht, Highscore, Duell und Admin/Dozent gezielt screenshotsicher prüfen.

---

## G51.6 · iOS + Coach + iPad QNav Polish Fix · 2026-06-15

- Neue Datei: `css/ui-ios-coach-polish.css`.
- iOS/mobile Layout-Regeln greifen jetzt appweit stärker.
- Leere Bottom-Dock-Hülle wird ausgeblendet.
- Desktop-Coach-Dock ist kompakter Orb.
- iPad Hochformat Frageübersicht-Button sitzt oben rechts.
- Visuelle Chromium-Prüfung mit Desktop-, iPhone- und iPad-Viewports durchgeführt.


## G52.0 / PHASE 14 — Highscore Dashboard Engine / lokale Bestenlisten-Grenze

- Status: abgeschlossen.
- Neue Core-Datei: `js/core/highscore-dashboard-engine.js`.
- Ziel: lokale Highscore-/Dashboard-Logik aus `js/app.js` herauslösen, ohne Cloud-, Firebase-, Admin-, Auth-, Result- oder Simulationslogik riskant zu verändern.
- `HighscoreEngine` in `js/app.js` wird jetzt über `EGTHighscoreDashboardEngine.create(...)` erzeugt.
- Alte Inline-HighscoreEngine bleibt als Fallback erhalten, falls das neue Core-Modul nicht geladen wird.
- Neue API: `build`, `rankLabel`, `toRecord`, `persistFromResults`, `renderLocalCard`, `renderDashboard`, `diagnostics`.
- `CloudHighscoreEngine` bleibt bewusst unverändert und wird nur kontrolliert über `getCloudHighscoreEngine()` angebunden.
- `index.html`, `service-worker.js`, `architecture-guard.js`, `module-manifest.json` und Versionierung wurden aktualisiert.
- QA: JS-Syntaxcheck, JSON-Validierung, Service-Worker-Assetprüfung und Headless-Inline-Smoke-Test bestanden.
- Smoke-Test-Ergebnis: `AppConfig.version = G52.0`, `EGTHighscoreDashboardEngine = true`, `HighscoreEngine.__version = G52.0-phase14`, horizontaler Overflow `0`.

**HIER SIND WIR JETZT:** Phase 14 abgeschlossen. Nächster sinnvoller Schritt: Phase 15 — entweder `CloudHighscoreEngine` physisch weiter aus `app.js` lösen oder Highscore-/Duell-UI als stärkere Fachmodule abgrenzen. UI-Backlog bleibt separat und wird nur bei blockierenden Fehlern sofort bearbeitet.


## G52.1 / PHASE 15 — Cloud Highscore Engine / Supabase-Ranking-Grenze

- Neue Datei: `js/core/cloud-highscore-engine.js`.
- `app.js` erzeugt `CloudHighscoreEngine` jetzt über `window.EGTCloudHighscoreEngine.create(...)`.
- Die Instanz wird zusätzlich als `window.CloudHighscoreEngine` bereitgestellt, damit Entry-Module und Persistence-Module dieselbe Cloud-Grenze verwenden.
- Minimal-Fallback in `app.js` bleibt erhalten, falls das Core-Modul nicht geladen wird.
- Premium-Bridge `js/modules/highscore-engine.js` bleibt kompatibel und kann weiterhin Renderer-/Cloud-Upgrades in die Core-Instanz mischen.
- Version/Cache auf `G52.1` angehoben.

### Phase-15-QA

- JS-Syntaxcheck erforderlich für `js/core/cloud-highscore-engine.js`, `js/app.js`, `js/modules/highscore-engine.js`, `js/core/highscore-dashboard-engine.js`.
- Smoke-Test soll bestätigen: `EGTCloudHighscoreEngine` vorhanden, `window.CloudHighscoreEngine` vorhanden, `App._test.CloudHighscoreEngine` vorhanden, Highscore-Dashboard weiterhin renderbar.


## G52.2 / PHASE 16 — Highscore-/Duell-UI Engine / Fachmodul-Grenze

- Neue Datei: `js/core/highscore-duel-ui-engine.js`.
- Ziel: Highscore-/Duell-UI-Renderer aus `js/app.js` herauslösen, ohne Duell-Runtime, Online-Polling oder Quiz-Lifecycle riskant zu verschieben.
- Ausgelagert wurden: Duell-Avatar-Renderer, Zeitformatierung, Gewinnerlogik, Duell-Vergleichs-HTML, Duell-Setup-HTML, Duell-History-HTML und `highscoreData(...)` für Home-/Sheet-Renderer.
- `app.js` erzeugt jetzt `HighscoreDuelUIEngine` über `window.EGTHighscoreDuelUIEngine.create(...)` und delegiert die UI-Funktionen dorthin.
- `window.HighscoreDuelUIEngine` und `App._test.HighscoreDuelUIEngine` sind für Diagnose verfügbar.
- `index.html`, `service-worker.js`, `module-manifest.json`, `manifest.json`, `update-check.json` und Versionierung wurden auf `G52.2` aktualisiert.

### Phase-16-QA

- JS-Syntaxcheck: `js/core/highscore-duel-ui-engine.js`, `js/app.js`, `js/modules/egt-highscore-entry-module.js`, `js/modules/egt-duel-entry-module.js`, `js/core/cloud-highscore-engine.js`.
- JSON-Validierung: `manifest.json`, `update-check.json`, `module-manifest.json` und QA-Datei.
- Smoke-Test: App lädt, `EGTHighscoreDuelUIEngine` vorhanden, `HighscoreDuelUIEngine` vorhanden, `App.highscoreData().__source = G52.2-phase16`, Duell-Setup rendert über das neue Modul, horizontaler Overflow bleibt 0.

**HIER SIND WIR JETZT:** Phase 16 abgeschlossen. Nächster sinnvoller Schritt: Phase 17 — Duell-Runtime/Control-Flow oder Highscore-/Duell-Sheet-Routing weiter modularisieren. UI-Backlog bleibt separat.

## G52.3 / PHASE 17 — Duell Runtime Engine / Control-Flow-Grenze

- Neue Datei: `js/core/duell-runtime-engine.js`.
- Duell-Runtime/Control-Flow aus `js/app.js` herausgelöst.
- App-Methoden bleiben als Wrapper erhalten.
- Diagnose: `window.DuellRuntimeEngine`, `App._test.DuellRuntimeEngine`.
- Version/Cache: `G52.3`.
- Nächste Empfehlung: Phase 18 — Highscore-/Duell-Sheet-Routing modularisieren.

## G52.4 / PHASE 18 — Highscore-/Duell-Sheet-Router-Engine

- Neues Routing-Modul: `js/core/highscore-duel-sheet-router-engine.js`.
- Highscore/Duell-Entry-Module delegieren jetzt an die zentrale Router-Engine.
- `app.js` delegiert TopTabs, Section-Routing und relevante Data-Actions an die Router-Engine.
- `ui-router.js` nutzt für Highscore-/Duell-Öffnungen bevorzugt die neue Router-Engine.
- Version/Cache: `G52.4`.

## G52.5 / PHASE 19 — Result Flow Engine

- Neues Core-Modul: `js/core/result-flow-engine.js`.
- Ergebnisabschluss aus `app.js` herausgelöst: Timer-Cleanup, offene Antworten finalisieren, Result-Screen, Summary, Sekundärpanels, Persistenz und Coach-Session-Hook.
- `showResult()` delegiert an `ResultFlowEngine.showResult()`; alte Logik bleibt als `showResultLegacy()` erhalten.
- Diagnose: `window.ResultFlowEngine`, `App._test.ResultFlowEngine`.
- Version/Cache: `G52.5`.
- Nächste Empfehlung: Phase 20 — Quiz-Lifecycle/Question-Control modularisieren.

## G52.6 / PHASE 20 — Question Flow Engine / Quiz-Lifecycle-Grenze

- Neues Core-Modul: `js/core/question-flow-engine.js`.
- Ziel: öffentliche Quiz-/Question-Control-Aufrufe aus `js/app.js` herausführen und als eigene Engine-Grenze bündeln.
- `showQuestion`, `tickTimer`, `chooseAnswer`, `recordAnswer`, `nextQuestion`, `manualNextQuestion`, `skipQuestion`, `prevQuestion`, `jumpToQuestion`, `toggleMarkQuestion`, `pauseTimer` und `resumeTimer` laufen jetzt über `QuestionFlowEngine`.
- Die bisherigen stabilen Renderer bleiben als `Internal`-Adapter erhalten, damit die UI-Stabilität aus G51.x nicht durch einen großen Komplettumzug riskiert wird.
- Diagnose: `window.QuestionFlowEngine`, `App._test.QuestionFlowEngine`, `QuestionFlowEngine.diagnostics()`, `QuestionFlowEngine.snapshot()`.
- Version/Cache: `G52.6`.
- Nächste Empfehlung: Phase 21 — BuildQuiz/Aufgaben-Orchestrierung und Generator-Pipeline weiter modularisieren.

## G52.7 / PHASE 21 — Quiz Build Pipeline Engine / Aufgaben-Orchestrierung

- Neues Core-Modul: `js/core/quiz-build-pipeline-engine.js`.
- Ziel: `buildQuiz`, Generator-Auswahl, Branch-Pool-Auflösung, QuestionFactory-Anbindung und Quiz-Orchestrator-Aufruf als eigene Pipeline-Grenze bündeln.
- `app.js` erzeugt jetzt `QuizBuildPipelineEngine` über `window.EGTQuizBuildPipelineEngine.create(...)`.
- Die bisherigen Funktionen `activeBranchIdForQuiz`, `activeQuestionPoolProfile`, `fallbackGeneratorPool`, `resolveBranchGeneratorPool`, `attachBranchPoolMeta`, `generateQuestionForMode` und `buildQuiz` delegieren jetzt an die neue Pipeline-Engine.
- Bestehende Legacy-Implementierungen bleiben als Sicherheitsfallback erhalten, werden im normalen Pfad aber nicht mehr direkt verwendet.
- Diagnose: `window.QuizBuildPipelineEngine`, `App._test.QuizBuildPipelineEngine`, `QuizBuildPipelineEngine.diagnostics()`, `QuizBuildPipelineEngine.snapshot()`.
- Version/Cache: `G52.7`.
- QA: JS-Syntaxcheck, JSON-Validierung, Service-Worker-Assetprüfung, ZIP-Integrität und Headless-Inline-Smoke-Test bestanden.
- Smoke-Test bestätigt: Engine vorhanden, globale Instanz vorhanden, `App._test`-Instanz vorhanden, Beispielaufgabe generierbar, Quizaufbau generierbar, horizontaler Overflow `0` auf Desktop/iPhone/iPad-Hochformat.
- Hinweis: In der Inline-Headless-Umgebung meldet Chromium weiterhin gesperrtes `localStorage`; das betrifft nicht den normalen lokalen Test über `localhost`.
- Nächste Empfehlung: Phase 22 — Admin-/Dozentenportal stärker modularisieren oder alternativ Profil/Auth/Userbereich als nächste Core-Grenze abgrenzen.

## G52.8 / PHASE 22 — Admin Portal Domain Engine / Admin-Dozenten-Grenze

- Neues Core-Modul: `js/core/admin-portal-domain-engine.js`.
- Ziel: Admin-/Dozentenportal als fachliche Domain-Grenze kapseln, ohne den bestehenden Portal-Monolith `js/admin-participant-engine.js` riskant zu zerlegen.
- Gekapselt wurden: Portal öffnen/schließen, Rollen, Rechte, Teilnehmerverwaltung, Zugangscodes, Kursstatistik, Export, Tickets, Sync-Status, Coach/Eventtracking und Online-Duell-Portal-APIs.
- `app.js` nutzt die neue Engine als `AdminPortalDomainEngine` für Result-Persistence-Hooks und Duell-Runtime-Portalzugriffe.
- `egt-admin-entry-module.js` und `ui-router.js` öffnen Admin/Login bevorzugt über die neue Domain-Engine.
- Diagnose: `window.EGTAdminPortalDomainEngine`, `window.AdminPortalDomainEngine`, `App._test.AdminPortalDomainEngine`.
- Version/Cache: `G52.8` / `egt-trainer-g52-8`.
- QA: JS-Syntaxcheck, JSON-Validierung, Service-Worker-Assetprüfung, ZIP-Integrität und Headless-Smoke-Test bestanden.
- Nächste Empfehlung: Phase 23 — Profil/Auth/Userbereich sauber abgrenzen oder AdminPortal-Monolith weiter in konkrete Teilmodule zerlegen.

## G52.9 / PHASE 23 — Profile Auth Domain Engine / Userbereich-Grenze

- Neues Core-Modul: `js/core/profile-auth-domain-engine.js`.
- Ziel: Profil/Auth/Userbereich als fachliche Domain-Grenze kapseln, ohne die bestehenden Module `auth-profile-shell.js`, `egt-auth-engine.js`, Gate-Screen oder UserDatabase riskant zu zerlegen.
- Gekapselt wurden: lokale Profilidentität, lokale Profilmigration, Session-Auflösung, Gate-Status, Login-/Registrierungs-/Demo-Delegation, Highscore-Identity, aktiver Learner, Pflicht-Passwortwechsel, Demo-Zähler, Profilaktionen und Sync-Status.
- `app.js` erzeugt jetzt `ProfileAuthDomainEngine` über `window.EGTProfileAuthDomainEngine.create(...)`.
- `resultPersistenceContext`, `saveResult`, Duell-Spielername und aktive Learner-Hooks nutzen bevorzugt die neue Domain-Engine.
- `ui-router.js` und `egt-profile-entry-module.js` routen Profil/Auth-Aktionen bevorzugt über `ProfileAuthDomainEngine` und nutzen `EGTAuthProfileShell` nur noch als Fallback.
- Diagnose: `window.EGTProfileAuthDomainEngine`, `window.ProfileAuthDomainEngine`, `App._test.ProfileAuthDomainEngine`, `ProfileAuthDomainEngine.diagnostics()`, `ProfileAuthDomainEngine.state()`.
- Version/Cache: `G52.9` / `egt-trainer-g52-9`.
- QA: JS-Syntaxcheck, JSON-Validierung, Service-Worker-Assetprüfung, ZIP-Integrität und Headless-Smoke-Test vorgesehen/ausgeführt.
- Nächste Empfehlung: Phase 24 — Coach/Analyse/Fehlerprofil als nächste Domain-Grenze abgrenzen.

## G53.0 / PHASE 24 — Coach Analysis Domain Engine / Coach-Analyse-Fehlerprofil-Grenze

- Neues Core-Modul: `js/core/coach-analysis-domain-engine.js`.
- Ziel: KI-Coach, Lernanalyse, Fehlerprofil, Empfehlungen, adaptive Schwierigkeit, Trainingsfokus und Analyse-Rendering als eigene Domain-Grenze kapseln.
- Gekapselt wurden: Coach-Build, ErrorMemory, DataReadiness, WeaknessProfile, CognitiveProfile, Recommendation, AdaptiveDifficulty, DynamicMix, LearningMemory, FullSimulation-Label/Summary, Trainingsfokus und Analyse-HTML.
- `app.js` erzeugt jetzt `CoachAnalysisDomainEngine` über `window.EGTCoachAnalysisDomainEngine.create(...)`.
- `showAnalysis()`, `setTrainingFocus()`, adaptive Coach-Build-Zugriffe und die Quiz-Build-Pipeline nutzen bevorzugt die neue Coach-/Analyse-Domain-Engine.
- Die bestehenden internen Engines `CoachEngine`, `AnalyticsEngine`, `SessionTracker`, `ErrorMemory`, `TrainingFocusEngine`, `AdaptiveDifficultyEngine`, `DynamicGeneratorEngine`, `LearningMemoryEngine` und `FullSimulationEngine` bleiben als Fachadapter erhalten und wurden nicht riskant zerlegt.
- Diagnose: `window.EGTCoachAnalysisDomainEngine`, `window.CoachAnalysisDomainEngine`, `App._test.CoachAnalysisDomainEngine`, `CoachAnalysisDomainEngine.diagnostics()`, `CoachAnalysisDomainEngine.state()`.
- Version/Cache: `G53.0` / `egt-trainer-g53-0`.
- QA: JS-Syntaxcheck, JSON-Validierung, Service-Worker-Assetprüfung, ZIP-Integrität und Headless-Smoke-Test vorgesehen/ausgeführt.
- Nächste Empfehlung: Phase 25 — Finale QA-Orchestrierung/App-Health/Release-Check oder bei Bedarf tieferes Zerlegen der Coach-Subengines.

**HIER SIND WIR JETZT:** Phase 24 abgeschlossen. Die großen fachlichen Grenzen Simulation/Result/Highscore/Duell/Admin/Auth/Coach sind jetzt vorbereitet. Als nächstes sollte nicht mehr blind weiter zerlegt werden, sondern eine QA-/Release-Orchestrierungsphase folgen.


### ✅ PHASE 25 — Release-QA / Multi-Device Visual Simulation ← ABGESCHLOSSEN
**Ziel:** Nach der großen Modularisierung eine appweite Health-/Release-Prüfung mit visueller Simulation über mehrere Viewports durchführen.

- [x] Neue Release-QA-Domain erstellt: `js/core/release-qa-engine.js`
- [x] Engine-/Global-Verfügbarkeit geprüft
- [x] Simulation → Frageübersicht → Auswertung → Startseite visuell geprüft
- [x] Desktop, iPad Hochformat, iPad Querformat und iPhone-Viewport geprüft
- [x] Geschlossenen Frageübersicht-Drawer als Horizontal-Overflow-Ursache gefunden
- [x] Fix ergänzt: `css/phase25-release-qa-fixes.css`
- [x] Service Worker / Manifest / AppConfig auf G53.1 synchronisiert
- [x] QA-Report erstellt: `docs/G53_1_PHASE25_RELEASE_QA_VISUAL_REPORT.md`
- [x] QA-JSON erstellt: `docs/G53_1_PHASE25_RELEASE_QA_VISUAL_QA.json`

**Ergebnis:** Coding-Checks bestanden, Multi-Device-Visual-Smoke nach Fix bestanden. Echte iOS-Geräteprüfung bleibt für den finalen Release empfohlen.

### ✅ PHASE 26 — Product Navigation Structure / Simulation- & Training-Center ← ABGESCHLOSSEN
- Bottom-Menü: Home / Simulation / Training / Analyse / Mehr.
- Simulation Center: IT/FISI mit BPS und CTC; Sozialpädagogik BPS; Kaufmännisch BPS.
- BPS: 50 Sek./Aufgabe, keine Hilfe. CTC: 22 Sek./Aufgabe, keine Hilfe.
- Training Center: Berufsfeld-Training mit Kategorieauswahl, Einzeltraining und Python-Kurs.
- Schnellzugriff ersetzt durch „Heute empfohlen“.
- Lernmodus in Training integriert, Fortschritt in Analyse integriert, Highscore/Duell nach Mehr verschoben.
- Neue Dateien: `js/core/product-structure-engine.js`, `css/phase26-product-structure.css`.
- QA: Coding-Checks bestanden, Multi-Viewport-DOM/Visual-Smoke durchgeführt.
- Wichtig für nächsten Chat/Schritt: Neues CTC-Übungsmodul nur in `ctcLohr` / `it-ctc` anbinden, nicht in BPS oder Training.


## G54.1 · CTC FlowLogic Integration

Status: abgeschlossen.

Umgesetzt wurde die exklusive Integration des Standalone-Moduls `FlowLogic-Standalone-G39.26` in `Simulation → IT/FISI → CTC`.

Regeln:
- Titel: CTC-Logik: Wenn-Dann-Ablauf
- Untertitel: Finde die versteckten Fehler.
- Einführung: Handlung = Quadrat/Rechteck, Frage = Raute, Ja/Nein = Pfeile.
- Beispiel: Frage „Passwort korrekt?“ → Ja führt zu „Login erlauben“, Nein führt zu „Fehler anzeigen“. Vertauschte Pfeile sind Logikfehler.
- Sonderzeit: 13 Minuten / 780 Sekunden.
- Keine Hilfe während der Aufgabe.
- Kein Coach während der Aufgabe.
- Ergebnisaufnahme über normalen Result-/Coach-Flow nach Abschluss.

Scope-Guard:
- erlaubt nur für `branch=it`, `mode=ctcLohr`, `simType=ctc`, `pool=it-ctc`.
- blockiert in BPS, Training, Sozialpädagogik, Kaufmännisch, Einzeltraining und Python.

QA:
- FlowLogic-SelfTest 41/41 grün.
- Desktop, iPad Hochformat, iPad Querformat und iPhone-Viewport gerendert.
- Horizontaler Overflow: 0.
- Hilfe-Button: nicht sichtbar.

## G54.2 · CTC-Lohr Real Exam Structure
- CTC-Modus wurde auf echten Blockablauf umgestellt.
- Gültig ausschließlich für Simulation → IT/FISI → CTC.
- Neue Engine: `js/core/ctc-lohr-exam-structure-engine.js`.
- Neue CSS-Schicht: `css/ctc-lohr-real-exam.css`.
- Gesamt: 62 Aufgaben/Blöcke, reine Prüfungszeit 32:58 Minuten, Anzeige ca. 33–35 Minuten.
- Block 3 Regelrechnung: keine Bruchstrich-Darstellung, Inline-Slash, Eingabefeld statt Multiple Choice.
- Block 4/5 ebenfalls Eingabe statt Multiple Choice.
- FlowLogic bleibt Finalblock mit 13 Minuten.
- QA: Coding-Checks, Engine-Blockcheck, Scope-Negativtests, statische visuelle Desktop/iPad/iPhone-Renders.

## G54.3 · Phase 27 · CTC-/Simulation-Stability Hardening

Status: abgeschlossen.

Ziel: Nach G54.2 wurde die neue CTC-Lohr-Simulation technisch gehärtet und gegen falsche Einbindung in andere Bereiche abgesichert.

Umgesetzt:
- Neue QA-/Hardening-Engine: `js/core/ctc-simulation-stability-engine.js`.
- Allgemeinwissen-Blockzeit exakt korrigiert: 40 Fragen = 420 Sekunden durch 20×11s + 20×10s.
- Gesamtzeit der CTC-Lohr-Simulation bleibt exakt 1978 Sekunden = 32:58 Minuten.
- Regelrechnung wird geprüft als Inline-Slash-Aufgabe ohne Bruchstrich und ohne Multiple Choice.
- Eingabeaufgaben geprüft: Regelrechnung, Buchstaben-Konzentration, Tabellen-Koordinaten.
- FlowLogic bleibt Finalblock mit 780 Sekunden.
- Negative Scope-Matrix geprüft: BPS, Training, Sozialpädagogik, Kaufmännisch und Einzeltraining blockiert.

QA:
- JS-Syntaxchecks bestanden.
- JSON-Validierung bestanden.
- Service-Worker-Assetprüfung bestanden.
- CTC-Stability-Engine `validate()` bestanden.
- Statische Visual-QA für Desktop, iPad Hochformat, iPad Querformat und iPhone erzeugt unter `docs/visual-qa-g54-3/`.


## G54.4 · Phase 29 · CTC Admin-/Dozenten-Auswertung

Status: abgeschlossen.

Ergebnis: CTC-Lohr-Läufe erhalten jetzt eine blockweise Admin-/Dozenten-Auswertung. Die Auswertung wird in Ergebnisdatensätze und Admin-Events eingebettet und bleibt strikt auf Simulation → IT/FISI → CTC beschränkt.

Neue Datei:
- `js/core/ctc-admin-report-engine.js`

Neue Doku:
- `docs/G54_4_PHASE29_CTC_ADMIN_REPORT_ENGINE_REPORT.md`
- `docs/G54_4_PHASE29_CTC_ADMIN_REPORT_ENGINE_QA.json`
- `docs/visual-qa-g54-4/`

Geprüft:
- 6 CTC-Blöcke
- 62 Gesamtfragen/-blöcke
- 1978 Sekunden = 32:58 Minuten
- Scope: nur IT/FISI → CTC
- Persistenz- und Admin-Event-Anreicherung


---

## Phase 30B · Browser-Speech Upgrade

Status: PASS im Code-/Mock-QA, echter Mikrofontest auf Zielgeräten noch offen.

Umgesetzt:
- Browser-SpeechRecognition für GitHub Pages verbessert, kein Server und keine kostenpflichtige API.
- `lang` pro Aufgabe vorbereitet (`de-DE`, `tr-TR`, später `en-US`/`en-GB`).
- `interimResults=true` für Live-Erkennung und `maxAlternatives=5` für bessere Auswertung.
- Zustandsmodell ergänzt: supported, unsupported, requesting, listening, processing, done, permission_denied, no_speech, start_failed.
- Textnormalisierung mit Umlauten, ß und türkischer Diakritik verbessert.
- Neue Ähnlichkeitsbewertung mit Levenshtein, Tokenvergleich, Varianten und Wort-für-Wort-Feedback.
- Bewertungsbereiche: 90–100 sehr gut, 70–89 fast richtig, 40–69 teilweise erkannt, unter 40 wiederholen.
- UI zeigt Live-Text, finalen Text, Alternativen, Score, Wortfeedback und Datenschutzhinweis.
- Unsupported-/Permission-Fallback bleibt bedienbar über „Selbst nachgesprochen“.
- Neue QA-Schnittstelle: `LanguageAcademyCourseEntry.speechQaSnapshot()`.
- Neue Testdatei: `tests_phase30b_browser_speech_upgrade.html`.

Nicht verändert:
- CTC/Admin/Highscore/Teilnahmecode/Auth.

Nächster sinnvoller Schritt:
- Phase 30C nur als optionaler Vosk/WASM-Experimental-Adapter vorbereiten oder zuerst Phase 30D mit mehr Sprechaufgaben in A1 ausbauen.

---

## G54.9 · Phase 30C · A1-Sprechaufgaben parallel ausgebaut

Status: PASS

Phase 30C erweitert das Sprachkurs-Modul inhaltlich um Sprechtraining auf A1-Niveau.

Umgesetzt:
- 40 neue `speaking_practice`-Aufgaben.
- 10 A1-Lektionen abgedeckt.
- 4 Sprechaufgaben pro Lektion.
- A1-Aufgabenzahl: 430 Gesamtaufgaben inkl. Sprechen.
- Phase-30B-Browser-Speech-Adapter bleibt aktiv: `de-DE`, `tr-TR`, `interimResults`, `maxAlternatives`, Wortfeedback, Fallbacks.
- Neue QA-Coverage in `LanguageAcademyCourseEntry.phase30SpeechSnapshot()`.
- Neue Projektregel: Ab A2 werden Kursinhalt und Sprechaufgaben zeitgleich ausgebaut.

Neue QA-Datei:
- `tests_phase30c_a1_speaking_content_expansion.html`

Abgrenzung:
- Keine Änderungen an CTC/Admin/Highscore/Teilnahmecode/Auth.

Nächster sinnvoller Schritt:
- Echte Geräteprüfung Mikrofon auf Desktop/iPhone/iPad/Android.
- Danach A2-Ausbau mit parallelen normalen Aufgaben und Sprechaufgaben.

---

## Phase 30C-FIX – Mobile Speech Fix iPhone/iPad

Problem: Desktop-Sprechaufgaben funktionieren, aber Handy/iPad nicht zuverlässig.

Fix:
- Mobile Geräteerkennung ergänzt.
- iOS/iPadOS Standalone/PWA-Kontext erkannt.
- Mikrofonbutton wird nicht mehr hart deaktiviert, nur weil SpeechRecognition fehlt.
- Mobile Fallback-Logik ergänzt: Aufgabe bleibt bedienbar und kann über „Selbst nachgesprochen“ abgeschlossen werden.
- iOS-Safe-Konfiguration ergänzt: `interimResults=false`, `maxAlternatives=1`.
- Desktop-Logik bleibt unverändert stark: `interimResults=true`, `maxAlternatives=5`.
- Neue QA-Datei: `tests_phase30c_mobile_speech_fix.html`.

Abgrenzung:
- Keine Änderungen an CTC/Admin/Highscore/Teilnahmecode/Auth.
