# Python Quest Academy · QA-Checkliste

Diese Checkliste muss vor jedem Release abgearbeitet werden.

## 1. Dateiprüfung

Pflichtdateien vorhanden:

- [ ] `css/python-quest.css`
- [ ] `data/python-quest-db.js`
- [ ] `js/python-quest-module.js`
- [ ] `js/learning-coach-engine.js`
- [ ] `js/learning-coach-ui.js`
- [ ] `docs/python-levels/python-level-XX.pdf`

## 2. Lade-Reihenfolge in `index.html`

- [ ] `learning-coach.css` vor Coach-UI sichtbar
- [ ] `python-quest.css` geladen
- [ ] `coach-knowledge-base.js` vor Coach-Engine
- [ ] `python-quest-db.js` vor `python-quest-module.js`
- [ ] `learning-coach-engine.js` vor `python-quest-module.js`
- [ ] `learning-coach-ui.js` vor oder neben Python-Modul geladen

## 3. Browser-Konsole

Ausführen:

```js
window.PythonQuest.version
window.PythonQuest.db().levels.length
typeof window.BPSLearningCoachEngine.evaluatePythonSubmission
```

Erwartung:

- [ ] Version vorhanden
- [ ] `30`
- [ ] `function`

## 4. Level-Gating

- [ ] Level 1 ist offen
- [ ] Level 2 ist ohne bestandene Level-1-Abschlussprüfung gesperrt
- [ ] Zwischenprüfung ist erst nach Level-Arbeit offen
- [ ] Abschlussprüfung ist erst nach bestandener Zwischenprüfung offen
- [ ] Analysefunktion blockiert intern gesperrte Prüfungen
- [ ] Nächstes Level wird nur nach bestandener Abschlussprüfung freigegeben

## 5. Prüfungscenter

- [ ] `.py` Upload funktioniert
- [ ] `.txt` Upload funktioniert
- [ ] Code-Vorschau zeigt Inhalt lesbar
- [ ] Zeilennummern/Codeblock funktionieren mobil
- [ ] Reflexionsfeld ist sichtbar
- [ ] Bewertungsmatrix wird angezeigt
- [ ] K.O.-Regeln werden sichtbar erklärt

## 6. Coach-Bewertung

Mit guter Lösung testen:

- [ ] Score über Bestehensgrenze
- [ ] `passed: true`
- [ ] keine K.O.-Regel
- [ ] Stärken sichtbar
- [ ] Freischaltung funktioniert

Mit schlechter Lösung testen:

- [ ] Score unter Bestehensgrenze oder K.O.-Regel
- [ ] `passed: false`
- [ ] Fehlerkategorien sichtbar
- [ ] Reparaturübung wird erzeugt
- [ ] keine Freischaltung

## 7. Strukturprüfung

Testfälle:

- [ ] guter Aufbau: Eingabe → Verarbeitung → Ausgabe
- [ ] Chaos-Code fällt durch oder verliert deutlich Punkte
- [ ] sinnvolle Ausgabe in Schleife wird nicht pauschal bestraft
- [ ] schlechte Variablennamen werden erkannt

## 8. Kommentarprüfung

Akzeptieren:

- [ ] `# checkt ob der User alt genug ist`
- [ ] `# holt die Zahl rein`
- [ ] `# rechnet alles zusammen`
- [ ] `# geht die Liste durch`

Ablehnen oder abwerten:

- [ ] `# hallo`
- [ ] `# Python ist cool`
- [ ] Kommentar beschreibt falsche Operation
- [ ] Kommentar passt nicht zum nächsten Codeabschnitt

## 9. PDFs

- [ ] PDF pro neuem Level vorhanden
- [ ] PDF öffnet aus Levelscreen
- [ ] PDF öffnet aus Prüfungscenter
- [ ] PDF ist im Service Worker Cache
- [ ] PDF hat Lernziel, Beispiel, Fehlerseite, Übungen, Zwischenprüfung, Abschlussprüfung

## 10. Service Worker

- [ ] Cache-Name erhöht
- [ ] neue JS/CSS/Data-Dateien eingetragen
- [ ] neue PDFs eingetragen
- [ ] bei mobiler Installation Cache/Reload getestet

## 11. Syntaxkontrolle

Ausführen:

```bash
node --check js/python-quest-module.js
node --check js/learning-coach-engine.js
node --check data/python-quest-db.js
node --check js/app.js
```

Alle müssen ohne Fehler durchlaufen.

## 12. Release-Freigabe

Ein Release ist nur freigegeben, wenn:

- [ ] gute Lösung besteht
- [ ] schlechte Lösung fällt durch
- [ ] Level-Gating funktioniert
- [ ] Coach-Bewertung sichtbar ist
- [ ] PDF-Link funktioniert
- [ ] Service Worker aktualisiert ist
