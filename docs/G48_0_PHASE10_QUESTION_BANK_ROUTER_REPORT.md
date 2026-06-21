# G48.0 — Phase 10 QuestionBank Router / Datenpool-Grenze

**Datum:** 2026-06-15  
**Version:** G48.0  
**Status:** abgeschlossen, statische QA bestanden, Browser-Smoke-Test durch Nutzer empfohlen

---

## 1. Ziel der Phase

Phase 10 hatte ein klares Architekturziel: Die Auswahl der QuestionBank-Kandidaten sollte aus der direkten App-Logik herausgezogen werden. Die Daten selbst bleiben unverändert in den vorhandenen Dateien:

- `data/question-bank.js`
- `data/question-bank-kaufm.js`
- `data/question-bank-sozial.js`
- `data/question-bank-it-extra.js`
- `data/question-bank-mathe.js`

Die App entscheidet jetzt nicht mehr allein in `fromQuestionBank(...)`, welche Bank-Kandidaten fachlich bevorzugt werden. Dafür existiert jetzt eine eigene Core-Grenze.

---

## 2. Neue Core-Datei

Neu erstellt:

```text
js/core/question-bank-router.js
```

Neues Global:

```js
window.EGTQuestionBankRouter
```

Neue API:

```js
EGTQuestionBankRouter.resolve(ctx)
EGTQuestionBankRouter.index(items)
EGTQuestionBankRouter.inferBranch(item)
EGTQuestionBankRouter.branchScore(item, branch)
EGTQuestionBankRouter.listBranches()
EGTQuestionBankRouter.describeBranch(branch)
```

---

## 3. Was der Router jetzt übernimmt

Der Router kapselt jetzt:

1. **Branch-Erkennung** pro Aufgabe  
   Er erkennt aus `group`, `category`, `source`, `tags`, `dna` und `phase4`, ob eine Aufgabe eher zu `it`, `kaufm`, `sozial` oder `wissen` gehört.

2. **ExamTarget-Routing**  
   Für `ctc` und `ctcLohr` wird `examTarget: "ctc"` bevorzugt.  
   Für `bps` wird `examTarget: "bps"` bevorzugt.  
   Aufgaben mit `examTarget: "both"` bleiben kompatibel.

3. **Branch-Priorisierung**  
   Branch-spezifische Kandidaten werden nicht hart erzwungen, sondern priorisiert. Dadurch bleibt die App stabil, auch wenn ein Pool zu wenig Aufgaben enthält.

4. **Fallback ohne ExamTarget**  
   Wenn mit `examTarget` keine Kandidaten gefunden werden, sucht der Router kontrolliert ohne diese Einschränkung weiter.

5. **Index/Statistik**  
   Der Router kann einen Index erzeugen: Anzahl pro Branch, Gruppe, Zielprüfung und Quelle.

---

## 4. Änderungen in `js/app.js`

### Neu

```js
legacyQuestionBankCandidates(finalFilter)
routeQuestionBankCandidates(filter, level, modeOverride)
```

### Geändert

`fromQuestionBank(...)` wurde erweitert:

```js
fromQuestionBank(filter = {}, fallback = null, level = "medium", modeOverride = null)
```

Die Funktion nutzt jetzt:

```js
EGTQuestionBankRouter.resolve(...)
```

Wenn der Router fehlt oder fehlschlägt, greift der alte Filterweg:

```js
legacyQuestionBankCandidates(...)
```

### Zusätzlich

Die erzeugten Fragen bekommen mehr Meta-Informationen:

```js
questionBankRoute
questionBankRouterVersion
bankBranch
activeBranch
bankSource
```

Diese Metadaten helfen später bei Auswertung, Debugging, Admin-Analyse und Fehlerprofilen.

---

## 5. Änderung am QuestionFactory-Hook

In Phase 9 wurde `generateQuestionForMode(...)` an `EGTQuestionFactory` angebunden. In Phase 10 wurde der `fromQuestionBank`-Callback präziser gemacht:

```js
fromQuestionBank: function(qbFilter, qbFallback, qbLevel) {
  return fromQuestionBank(qbFilter, qbFallback, qbLevel, mode);
}
```

Dadurch weiß die QuestionBank-Auswahl, welcher Modus aktiv ist, auch wenn die Factory über einen eigenen Kontext arbeitet.

---

## 6. Bootstrap-Erweiterung

`bootstrapExternalQuestionBank()` erzeugt jetzt optional:

```js
QUESTION_BANK.branchIndex
```

Quelle:

```js
EGTQuestionBankRouter.index(QUESTION_BANK.items)
```

Das verändert keine Aufgabe, sondern liefert nur eine strukturierte Übersicht für spätere Diagnose.

---

## 7. Eingebaute Branch-Profile

### IT / FISI

Erkennt und priorisiert unter anderem:

- `IT/FISI`
- `IT`
- `FISI`
- `EDV`
- Netzwerk
- Hardware
- Software
- Security
- OSI

### Kaufmännisch

Erkennt und priorisiert unter anderem:

- `Kaufmännisch`
- Kaufmännisches Rechnen
- Bürowissen
- Verwaltung
- Wirtschaft
- Rabatt
- Skonto

### Sozialpädagogik

Erkennt und priorisiert unter anderem:

- `Sozialpädagogik`
- Pädagogik
- Situationen
- Entwicklung
- Bindung
- Beobachtung
- Dokumentation
- Kommunikation

### Wissen / Common

Bleibt der stabile allgemeine Pool für:

- Allgemeinwissen
- Mathe
- Logik
- Konzentration
- Englisch
- Visual IQ
- Mechanik
- Raumdenken
- Gedächtnis

---

## 8. Statische Router-Auswertung

Mit den vorhandenen externen QuestionBank-Dateien wurden im Node-Smoke-Test **517 Rohaufgaben** geladen.

Index des Routers:

```json
{
  "total": 517,
  "byBranch": {
    "it": 253,
    "kaufm": 63,
    "sozial": 20,
    "wissen": 181
  },
  "byGroup": {
    "Allgemeinwissen": 134,
    "Mathe": 126,
    "Logik": 140,
    "IT/FISI": 45,
    "Kaufmännisch": 52,
    "Sozialpädagogik": 20
  },
  "byTarget": {
    "both": 131,
    "bps": 254,
    "ctc": 132
  }
}
```

Wichtig: Die Branch-Zuordnung ist eine Router-Priorisierung, keine Datenmigration. Die Aufgaben werden nicht verschoben.

---

## 9. Aktualisierte Dateien

```text
js/core/question-bank-router.js
js/app.js
index.html
service-worker.js
js/core/architecture-guard.js
js/core/app-config.js
manifest.json
update-check.json
module-manifest.json
START_HERE.md
WORKING-PLAN_1.md
docs/WORKING-PLAN.md
docs/G48_0_PHASE10_QUESTION_BANK_ROUTER_REPORT.md
docs/G48_0_PHASE10_QUESTION_BANK_ROUTER_QA.json
```

---

## 10. Bewusst nicht geändert

Nicht verändert wurden:

- QuestionBank-Dateninhalte
- eigentliche Generatorfunktionen
- UI/CSS/Darstellung
- Simulation-Layout
- Result/Review
- Highscore
- Coach
- Admin
- Auth/Firebase
- Demo-Limits
- alte Sicherheitsfallbacks

Das ist Absicht. Phase 10 war eine Architekturtrennung, kein Funktions- oder Designumbau.

---

## 11. QA-Ergebnis

Bestanden:

```bash
node --check js/core/question-bank-router.js
node --check js/app.js
node --check js/core/architecture-guard.js
node --check js/core/question-factory.js
node sync-version.js
python3 -m json.tool module-manifest.json
python3 -m json.tool update-check.json
```

Zusätzlich geprüft:

- Router lässt sich in Node mit `window`-Mock laden.
- Externe QuestionBank-Dateien lassen sich laden.
- `EGTQuestionBankRouter.index(...)` erzeugt gültige Statistiken.
- `EGTQuestionBankRouter.resolve(...)` findet Kandidaten für branchenspezifische Filter.
- Neue Datei ist in `index.html` eingebunden.
- Neue Datei ist im Service Worker Cache enthalten.
- Neue Datei ist im Architecture Guard enthalten.

---

## 12. Nächster Schritt

Empfohlen:

1. G48.0 kurz im Browser smoke-testen.
2. Danach Phase 11 starten:

```text
Phase 11 — Result / Review / Fehleranalyse modularisieren
```

Nicht als Nächstes machen:

- keine großen CSS-Fixes mitten in der Architekturphase
- keine Firebase-/Admin-/Highscore-Tiefenänderungen
- keine alten Fallbacks entfernen
