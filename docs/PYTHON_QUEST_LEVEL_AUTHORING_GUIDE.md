# Python Quest Academy · Level-Erweiterungsanleitung

Dieses Dokument erklärt, wie neue Python-Level sauber ergänzt werden.

## 1. Grundregel

Ein Python-Level ist erst vollständig, wenn es alle Bestandteile besitzt:

- Lerninhalt
- MC-Verständnischecks
- Praxisaufgaben
- Zwischenprüfung
- Abschlussprüfung
- Coach-Testfälle
- Strukturprüfung
- Kommentarprüfung
- PDF-Lernmaterial
- Freischaltlogik

## 2. Level-Objekt

Neue Level werden in `data/python-quest-db.js` gepflegt.

Grundstruktur:

```js
levels[10].lessons = [];
levels[10].checks = [];
levels[10].practiceTasks = [];
levels[10].midExam = {};
levels[10].finalExam = {};
```

Der Index `levels[10]` entspricht Level 11, weil Arrays bei 0 beginnen.

## 3. Lektionen

Eine Lektion soll kurz bleiben.

```js
{
  id: 'l11_topic',
  title: 'Thema',
  goal: 'Was kann der Nutzer danach?',
  content: [
    'kurzer Punkt 1',
    'kurzer Punkt 2'
  ],
  example: 'python_code',
  explanation: 'kurze Erklärung'
}
```

Regel: Nicht überladen. Eine Lektion soll direkt zu einer Übung führen.

## 4. Multiple Choice

```js
{
  id: 'l11_q1',
  type: 'mc',
  question: 'Frage?',
  answers: ['richtig', 'falsch', 'falsch', 'falsch'],
  correct: 0,
  explain: 'Warum ist das richtig?'
}
```

Regel: MC-Fragen prüfen Verständnis, nicht auswendig gelernte Begriffe.

## 5. Praxisaufgaben

```js
{
  id: 'l11_p1',
  title: 'Mini-Aufgabe',
  prompt: 'Was soll gebaut werden?',
  expected: 'Beispielcode',
  concept: 'function'
}
```

Regel: Jede Praxisaufgabe muss direkt auf die Prüfung vorbereiten.

## 6. Zwischenprüfung

```js
{
  id: 'py_level_11_mid',
  title: 'Zwischenprüfung · ...',
  purpose: 'Was wird geprüft?',
  requiredScore: 82,
  requiredConcepts: ['...'],
  tasks: ['...'],
  testCases: [
    {name:'...', type:'concept', concept:'...'}
  ],
  rubric: [
    {key:'syntax', label:'Syntax', points:20}
  ]
}
```

Regel: Zwischenprüfung misst Fortschritt im Level, nicht den gesamten Abschluss.

## 7. Abschlussprüfung

```js
{
  id: 'py_level_11_final',
  title: 'Abschlussprüfung · ...',
  uploadTypes: ['.py','.txt'],
  requiredScore: 86,
  task: 'Projektbeschreibung',
  requiredConcepts: ['...'],
  requiredTokens: ['...'],
  forbiddenTokens: ['eval(','exec(','__import__(','subprocess','os.system'],
  knockoutErrors: ['kein Code vorhanden'],
  testCases: [],
  rubric: []
}
```

## 8. TestCase-Typen

Aktuell verwendete Typen:

```text
static
concept
count_assignment
count_print
count_f_string
count_input
count_conversion
count_math_ops
count_while
count_for
count_range
count_list_literal
count_append
count_len
comment_quality
structure_min
loop_exit
counter_update
input_or_counter
```

Neue Typen müssen in `js/learning-coach-engine.js` und im lokalen Fallback von `js/python-quest-module.js` berücksichtigt werden.

## 9. Kommentar-Synonyme

Kommentare dürfen fachlich oder umgangssprachlich sein.

Akzeptieren:

```text
prüft, checkt, schaut ob, kontrolliert, guckt ob
holt, fragt ab, liest ein, nimmt rein
zeigt, gibt aus, spuckt aus, printet
rechnet, addiert, macht plus, zählt zusammen
geht durch, loopt, läuft durch, nimmt jeden Eintrag
```

Nicht akzeptieren:

```text
hallo
cool
test
keine Aussage
falscher Inhalt zum Code
```

Wenn ein neues Level neue Konzepte einführt, müssen passende Synonyme in der Coach-Logik ergänzt werden.

## 10. Strukturregel pro Level

Frühe Level:

```text
Daten/Eingabe → Verarbeitung → Ausgabe
```

Schleifen-Level:

```text
Startwert → Schleife → Update/Ausstieg → Abschlussausgabe
```

Listen-Level:

```text
Liste/Daten → Veränderung/Auswertung → Ausgabe
```

Funktionen-Level:

```text
Funktionen oben → Hauptprogramm unten → Ausgabe kontrolliert
```

## 11. PDF pro Level

Neue PDF-Datei:

```text
docs/python-levels/python-level-XX.pdf
```

Mindestinhalt:

- Lernziel
- kurze Erklärung
- Beispielcode
- typische Fehler
- Übungen
- Zwischenprüfung
- Abschlussprüfung
- Bewertungsbogen

Danach in der Level-Datenbank verlinken und im Service Worker eintragen.

## 12. Release-Test für neues Level

Pro Level müssen zwei Abgaben getestet werden:

### Gute Lösung

- erfüllt Aufgabe
- strukturierter Aufbau
- sinnvolle Kommentare
- eigene Reflexion
- besteht mit mindestens Required Score

### Schlechte Lösung

- fehlendes Hauptkonzept
- schlechter Kommentar oder Chaos-Struktur
- fällt durch
- erzeugt hilfreiche Reparaturaufgabe
