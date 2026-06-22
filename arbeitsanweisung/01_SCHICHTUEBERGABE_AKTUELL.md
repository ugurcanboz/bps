# Schichtübergabe · G54.43.8L

## Kurzfassung

G54.43.8L trennt den Sprachbereich funktional:

- **Sprachtraining** bleibt Lernen/Üben.
- **Sprachtest-Simulation · Deutsch** wurde im Simulation Center ergänzt.
- Sprachtest im Simulation Center ist nur Vollprüfung.
- Die vorhandene `LanguageExamShell` wird nicht kopiert, sondern über einen neuen Simulation-Kontext geöffnet.
- Home-Dock-Abstand wurde als Nebenfix erhöht.

---

## Geänderte App-Dateien

- `js/ui-home-renderer.js`
  - Simulation Center um Sprachtest-Simulation Deutsch erweitert.
  - Home-Texte angepasst: BPS, CTC oder Sprachtest-Simulation.
  - Sprachkurs-Kachel sichtbar zu Sprachtraining umbenannt.

- `js/ui-router.js`
  - Neue Aktion `language-test-simulation-open`.
  - Öffnet bevorzugt `LanguageExamShell.openSimulationGerman()`.

- `js/modules/language-course-entry-module.js`
  - Dashboard sichtbar als Sprachtraining eingeordnet.
  - Prüfungskarte aus dem direkten Sprachtraining-Kontext entfernt.
  - Stattdessen Hinweis: Vollprüfung liegt im Simulation Center.
  - Einstufungstest bleibt im Sprachtraining.

- `js/modules/language-exam-shell.js`
  - Neuer Kontext `simulation-de`.
  - Neue Funktion `openSimulationGerman`.
  - Neue Deutsch-Vollprüfungs-Startseite: Sprache Deutsch, Niveau A1-C2, immer Vollprüfung.
  - Ergebnis-/Reset-Rückwege unterscheiden Simulation und Training.

- `css/phase43s-iphone-scroll-qa-bubble.css`
  - Home-Dock-Abstand erhöht.
  - Kleine Styles für Sprachtest-Simulation und Sprachtraining-Hinweis ergänzt.

- Versionsdateien:
  - `index.html`
  - `manifest.json`
  - `update-check.json`
  - `service-worker.js`
  - `sync-version.js`
  - `js/core/app-config.js`
  - QA-Versionen auf G54.43.8L aktualisiert.

---

## Was ausdrücklich nicht gemacht wurde

- Englisch wurde nicht eingebaut.
- Keine neuen Prüfungsdaten erfunden.
- Deutsch-Übungen wurden nicht gelöscht.
- `LanguageExamShell` wurde nicht dupliziert.
- Keine Teilprüfungsauswahl im Simulation Center erstellt.

---

## Nächster Schritt

Live-QA nach Deploy:

1. Startseite öffnen.
2. Simulation Center öffnen.
3. Sprachtest-Simulation · Deutsch öffnen.
4. B1 oder B2 starten.
5. Prüfen, ob Vollprüfung startet und keine Hilfe/Teilprüfungsauswahl sichtbar ist.
6. Sprachtraining öffnen und prüfen, ob es als Übungsbereich verständlich bleibt.
7. Home-Dock-Overlap prüfen.
