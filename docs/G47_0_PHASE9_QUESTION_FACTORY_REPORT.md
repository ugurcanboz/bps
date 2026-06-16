# G47.0 — Phase 9 QuestionFactory / generateQuestionForMode-Grenze

**Datum:** 2026-06-15  
**Version:** G47.0  
**Status:** abgeschlossen, statische QA bestanden, Browser-/Gerätetest noch offen

---

## 1. Ziel der Phase

Phase 9 hatte das Ziel, `generateQuestionForMode(...)` weiter aus dem `js/app.js`-Monolithen zu lösen, ohne die fachlichen Generatoren selbst riskant zu verschieben.

Die neue Grenze ist bewusst eine **Kontrollschicht** und keine komplette QuestionBank-Neustrukturierung. Dadurch bleibt die bestehende App-Funktion stabil, während die Architektur klarer wird.

---

## 2. Neue Datei

### `js/core/question-factory.js`

Neu eingeführt wurde:

```js
window.EGTQuestionFactory.generate(ctx)
window.EGTQuestionFactory.resolveSource(ctx)
```

Die Factory besitzt keine eigenen Generatorfunktionen und keine eigenen Datenpools. Sie erhält alles über explizite Hooks aus `app.js`:

- `generators`
- `levelFor`
- `groupFor`
- `choice`
- `fromQuestionBank`
- `resolveBranchGeneratorPool`
- `attachBranchPoolMeta`
- `stableSignature`
- `buildAdaptiveQuestion`
- `adaptiveDifficultyEngine`
- `fallbackGenerate`

Damit ist die Factory eine saubere Grenzschicht, aber noch kein finaler Datenbank-/QuestionBank-Resolver.

---

## 3. Änderung in `js/app.js`

`generateQuestionForMode(...)` ist jetzt ein Wrapper:

```js
function generateQuestionForMode(mode,index,total,coach) {
  if (window.EGTQuestionFactory && typeof EGTQuestionFactory.generate === "function") {
    return EGTQuestionFactory.generate({...});
  }
  return generateQuestionForModeInternal(mode, index, total, coach);
}
```

Die alte Logik wurde nicht gelöscht, sondern als Sicherheitsfallback erhalten:

```js
function generateQuestionForModeInternal(mode,index,total,coach) { ... }
```

Außerdem ruft der `EGTQuizOrchestrator` seine Kernfragen jetzt einheitlich über `generateQuestionForMode(...)` auf. Dadurch läuft auch der `ctc`-Pfad durch die neue Factory-Grenze und nicht mehr separat daran vorbei.

---

## 4. In die Factory verschobene Verantwortung

Die neue QuestionFactory übernimmt kontrolliert:

1. Duell-Festblock-Mix
2. CTC-Lohr-Festblockstruktur
3. CTC-Adaptive-Weiterleitung
4. Standard-Branch-Pool-Auswahl
5. Coach-adaptive Level-/Zeitlogik
6. Signatur-Erzeugung
7. dynamische ID-Erzeugung
8. Branch-/Pool-Metadaten-Anbindung über Hook
9. Fehlerfall mit Rückfall auf `generateQuestionForModeInternal(...)`

---

## 5. Bewusst nicht verändert

Nicht angefasst wurden:

- Generatorfunktionen selbst
- QuestionBank-Dateien
- `fromQuestionBank(...)`-Implementierung
- Result-/Review-Logik
- Highscore/Supabase
- Coach-Memory-Tiefenlogik
- Admin/Auth/Firebase
- Demo-Limits
- CSS-/Darstellungsfehler
- Browser-/Geräte-Live-QA

---

## 6. Aktualisierte Dateien

- `js/core/question-factory.js` neu
- `js/app.js`
- `index.html`
- `service-worker.js`
- `js/core/architecture-guard.js`
- `js/core/app-config.js`
- `manifest.json`
- `update-check.json`
- `module-manifest.json`
- `WORKING-PLAN_1.md`
- `docs/WORKING-PLAN.md`
- `START_HERE.md`
- `docs/G47_0_PHASE9_QUESTION_FACTORY_REPORT.md`
- `docs/G47_0_PHASE9_QUESTION_FACTORY_QA.json`

---

## 7. Version / Cache

Version wurde auf `G47.0` gesetzt.

`node sync-version.js` wurde ausgeführt und hat aktualisiert:

- `service-worker.js`
- `update-check.json`
- `manifest.json`

Cache-Name:

```text
egt-trainer-g47-0
```

---

## 8. QA-Ergebnis

Statisch geprüft:

- `node --check js/core/question-factory.js`
- `node --check js/app.js`
- `node --check js/core/architecture-guard.js`
- vollständiger JS-Syntaxcheck
- JSON-Validierung
- Service-Worker-Assetprüfung
- QuestionFactory-Unit-Smoke mit Dummy-Hooks für `duell`, `ctcLohr`, `ctc`, `bps`
- ZIP-Test

Ergebnis: bestanden.

---

## 9. Nächster Schritt

Empfohlen:

```text
G48.0 / Phase 10 → QuestionBanks / Datenpools pro Branch sauberer strukturieren
```

Dabei sollte nicht sofort die komplette Bank neu geschrieben werden. Sinnvoll ist zuerst ein Resolver, der vorhandene Dateien und Kategorien sauber klassifiziert, bevor echte Inhalte verschoben werden.
