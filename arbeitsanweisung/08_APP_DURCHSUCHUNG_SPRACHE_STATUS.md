# App-Durchsuchung · Sprachtraining und Sprachtest Status

**Stand:** 2026-06-22  
**Basis-ZIP:** G54.43.8K Clean mit Arbeitsanweisung  
**Ziel:** Prüfen, was für die Trennung `Sprachtraining` / `Sprachtest-Simulation · Deutsch` bereits vorhanden ist.

---

## 1. Durchsuchte Kernbereiche

Gesucht wurde nach:

- Sprachkurs
- Language Academy
- LanguageExam
- Exam Shell
- A1-C2
- B1/B2 Pilotprüfung
- Simulation/Prüfung
- Einstufungstest

Relevante Dateien:

- `index.html`
- `js/ui-router.js`
- `js/ui-home-renderer.js`
- `js/modules/language-course-entry-module.js`
- `js/modules/language-exam-shell.js`
- `js/modules/language-exam-engine.js`
- `data/language-exam-blueprints.js`
- `data/language-level-difficulty-rules.js`
- `data/language-b1-exam-pilot.js`
- `data/language-b2-exam-pilot.js`
- `css/language-course.css`

---

## 2. Script-Ladereihenfolge

In `index.html` werden die Sprachmodule bereits geladen:

- `language-store.js`
- `language-adapter.js`
- `language-adaptive-engine.js`
- `language-course-entry-module.js`
- `language-course-cloud-sync.js`
- `language-ai-client.js`
- `language-speaking-ai-client.js`
- `language-exam-blueprints.js`
- `language-level-difficulty-rules.js`
- `language-b1-exam-pilot.js`
- `language-b2-exam-pilot.js`
- `language-exam-engine.js`
- `language-exam-shell.js`

Wichtig:

`LanguageExamShell` ist also zur Laufzeit vorhanden und kann grundsätzlich aus anderen UI-Bereichen geöffnet werden.

---

## 3. Gefundener aktueller Sprachtraining-Bereich

Datei: `js/modules/language-course-entry-module.js`

Befund:

- Das Modul registriert sich als `language-course-entry`.
- Sichtbarer Label-Stand ist noch `Sprachkurs`.
- Dashboard-Fallback-Texte enthalten noch `Sprachkurs`.
- Die Funktion `openDashboard()` rendert den Sprachbereich.
- Darin wird aktuell auch `LanguageExamShell.summaryCardHtml()` eingebunden.
- Danach kommt zusätzlich der Einstufungstest.

Bewertung:

Das Modul ist fachlich der richtige Ort für `Sprachtraining`, aber die Prüfungskarte gehört dort nicht mehr dominant hinein.

---

## 4. Gefundene Prüfungs-Shell

Datei: `js/modules/language-exam-shell.js`

Befund:

- Enthält `window.LanguageExamShell`.
- Öffnet über `open()` bzw. intern `renderHome()` eine Prüfungsübersicht.
- Aktionen:
  - `language-exam-open`
  - `language-exam-start`
  - `language-exam-resume`
  - `language-exam-reset`
  - `language-exam-open-part`
  - `language-exam-complete-objective`
  - `language-exam-hybrid-check`
- Pflichtteile:
  - `reading`
  - `listening`
  - `grammar`
  - `writing`
  - `speaking`
- Labels:
  - Lesen
  - Hören
  - Grammatik & Sprachbausteine
  - Schreiben
  - Sprechen

Bewertung:

Diese Shell kann die deutsche Vollprüfung tragen. Sie ist aber historisch noch als `Academy-Hartmodus` betitelt und enthält auch Trainings-/Mini-Training-Funktionen. Für das Simulation Center braucht sie einen saubereren Einstieg/Adapter.

---

## 5. Gefundene Prüfungsdaten

### `data/language-exam-blueprints.js`

Enthält:

- A1, A2, B1, B2, C1, C2.
- PassScore.
- SafePassScore.
- partMinScore.
- Dauer pro Teil.
- Schreib-/Sprech-Wortanforderungen.
- Beispiel-Schreib- und Sprechaufgaben.

### `data/language-b1-exam-pilot.js`

Enthält konkrete B1-Prüfungspools.

### `data/language-b2-exam-pilot.js`

Enthält konkrete B2-Prüfungspools.

Bewertung:

Deutsch B1/B2 wirken am weitesten fortgeschritten. A1/A2/C1/C2 müssen später auf echte Datenfülle und Prüfungsqualität geprüft werden.

---

## 6. Sauberer Trennungsansatz

### Nicht löschen

Nicht löschen:

- `LanguageExamShell`
- `LanguageExamEngine`
- Blueprints
- B1/B2 Pilotdaten
- Sprachtraining-Lektionen
- Einstufungstest

### Nicht duplizieren

Nicht kopieren:

- Keine zweite Prüfungsengine bauen.
- Keine zweite Blueprints-Datei für Deutsch erzeugen.

### Sauber anbinden

Empfehlung:

1. Neuen Simulation-Center-Einstieg bauen:
   - `Sprachtest-Simulation · Deutsch`
2. Dieser Einstieg ruft eine neue Adapterfunktion auf, z. B.:
   - `LanguageExamShell.openSimulation({ language:'de', mode:'full-exam' })`
   - oder vorhandenes `LanguageExamShell.open()` mit klarer UI-Anpassung.
3. In diesem Einstieg keine Teilprüfungen anbieten.
4. Die bestehende Prüfung läuft intern weiterhin über fünf Pflichtteile.
5. Nach Ergebnis darf ein Trainingsplan angezeigt werden.

---

## 7. Konkrete Dateien für G54.43.8L

Voraussichtlich zu ändern:

- `js/ui-home-renderer.js` oder passende Simulation-Center-Renderer-Datei
- `js/ui-router.js`
- `js/modules/language-course-entry-module.js`
- `js/modules/language-exam-shell.js`
- `css/language-course.css` oder passendes UI-CSS
- `service-worker.js`
- `manifest.json`
- `update-check.json`
- `index.html` nur bei Versionslabel/Scriptbedarf
- `arbeitsanweisung/*.md`

Vor Änderung zusätzlich prüfen:

- Wo genau Simulation Center gerendert wird.
- Ob `ProductStructureEngine` die Simulation-Center-Karten erzeugt.
- Ob `ui-home-renderer.js` nur Home oder auch Simulation Center kontrolliert.

---

## 8. Empfehlung für G54.43.8L Umsetzung

Schritt 1:

- Simulation-Center-Renderer lokalisieren.
- BPS/CTC-Kartenstruktur verstehen.

Schritt 2:

- Neue Kachel `Sprachtest-Simulation · Deutsch` hinzufügen.
- Label: `SPRACHTEST · VOLLPRÜFUNG`.
- Beschreibung: `Deutschprüfung A1 bis C2 realistisch simulieren. Keine Hilfe im Test.`

Schritt 3:

- Neue Action im Router ergänzen, z. B. `language-exam-simulation-open`.
- Action ruft `LanguageExamShell.open()` oder neue Simulation-Entry-Funktion auf.

Schritt 4:

- Sprachkurs/Sprachtraining-Dashboard bereinigen:
  - `Sprachkurs` sichtbar zu `Sprachtraining` ändern.
  - Prüfungskarte entfernen oder als kleiner Hinweis `Vollprüfung findest du im Simulation Center` darstellen.

Schritt 5:

- Home-Dock-Abstand fixen.

Schritt 6:

- QA durchführen:
  - iPhone Home
  - Simulation Center
  - Sprachtest-Simulation Deutsch
  - Sprachtraining

---

## 9. Ergebnis der Analyse

Die Struktur ist machbar und sinnvoll.

Wichtigster Vorteil:

> Die deutsche Vollprüfung ist bereits technisch vorhanden. G54.43.8L muss nicht die Prüfung neu bauen, sondern sie korrekt einsortieren.

Wichtigstes Risiko:

> Die vorhandene Exam-Shell enthält auch Trainings-/Mini-Training-Elemente. Beim Simulation-Center-Einstieg muss verhindert werden, dass Teiltrainings wie eine Simulation wirken.

Nächster Startpunkt:

**G54.43.8L · Sprachtest-Simulation Deutsch Strukturtrennung**
