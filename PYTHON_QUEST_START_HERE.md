# Python Quest Academy · Start- und Integrationsanleitung

Diese Datei ist der Einstiegspunkt für die Integration des Python-Lernmoduls in den BPS-Trainer.

## Kurzurteil

Ja: Das Python-Modul kann ganz normal in die bestehende App integriert werden. Es ist kein zweites Projekt und keine fremde Simulation. Es bleibt ein eigener Lernbereich innerhalb der App, arbeitet aber mit dem vorhandenen KI-Coach zusammen.

Die wichtigste Regel:

> Python Quest bleibt fachlich separat, aber technisch sauber mit dem BPS-Lerncoach verbunden.

## Was bereits integriert ist

- eigenes Python-Modul: `js/python-quest-module.js`
- eigene Python-Datenbank: `data/python-quest-db.js`
- eigenes Design-Layer: `css/python-quest.css`
- KI-Coach-Prüfung: `BPSLearningCoachEngine.evaluatePythonSubmission(payload)`
- Level 1 bis 10 vollständig ausgebaut
- Level-Gating: kein höheres Level ohne bestandene Abschlussprüfung
- Zwischenprüfung pro Level
- Abschlussprüfung mit Datei-Upload `.py` / `.txt`
- Code-Vorschau
- Bewertungsmatrix
- Strukturprüfung
- Kommentar-Intelligenz mit Synonymen/Umgangssprache
- Fehler-DNA und Reparaturtraining
- PDF-Lernmaterial Level 1 bis 10

## Schnellstart für Entwickler

1. ZIP entpacken.
2. `index.html` öffnen oder über lokalen Server starten.
3. Cache bei alten Installationen leeren oder Service Worker neu laden.
4. In der App `Python Quest` öffnen.
5. Level 1 starten, Zwischenprüfung erledigen, Abschlussprüfung mit `.py` oder `.txt` testen.

Empfohlen für lokale Tests:

```bash
python -m http.server 8080
```

Dann im Browser öffnen:

```text
http://localhost:8080
```

## Wichtigste Dokumente

- `docs/PYTHON_QUEST_INTEGRATION_GUIDE.md` – komplette technische Anleitung
- `docs/PYTHON_QUEST_QA_CHECKLIST.md` – Test- und Prüfcheckliste
- `docs/PYTHON_QUEST_LEVEL_AUTHORING_GUIDE.md` – neue Python-Level sauber erweitern
- `docs/python-levels/` – PDF-Lernmaterial pro Level

## Harte Integrationsregel

Diese Dateien müssen in dieser Reihenfolge geladen werden:

```html
<link rel="stylesheet" href="./css/learning-coach.css">
<link rel="stylesheet" href="./css/python-quest.css">

<script src="./data/coach-knowledge-base.js"></script>
<script src="./data/python-quest-db.js"></script>
<script src="./js/learning-coach-engine.js"></script>
<script src="./js/learning-coach-ui.js"></script>
<script src="./js/python-quest-module.js"></script>
```

Wenn `python-quest-db.js` nach dem Modul geladen wird, findet das Modul seine Level nicht. Wenn `learning-coach-engine.js` fehlt, fällt die App auf die lokale Regelprüfung zurück, aber der volle Coach-Modus fehlt.

## Direkte Prüfung im Browser

Konsole öffnen und prüfen:

```js
window.PythonQuest.version
window.PythonQuest.db().levels.length
typeof window.BPSLearningCoachEngine.evaluatePythonSubmission
```

Erwartung:

```text
Version vorhanden
30 Level vorhanden
"function"
```
