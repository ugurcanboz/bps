# G52.7 / Phase 21 — Quiz Build Pipeline Engine

## Ziel

Die Aufgaben-Erzeugung und der Quizaufbau wurden als eigene Core-Grenze gebündelt. Dadurch muss `js/app.js` den Build-Prozess nicht mehr fachlich steuern, sondern delegiert an eine Pipeline-Engine.

## Neue Datei

- `js/core/quiz-build-pipeline-engine.js`

## Ausgelagerte Verantwortung

- Branch-ID-Auflösung
- Question-Pool-Profil-Auflösung
- Generator-Fallback-Pools
- Generator-Registry-Auflösung
- Branch-/Pool-Metadaten an Aufgaben hängen
- QuestionFactory-Anbindung
- QuizOrchestrator-Anbindung
- `buildQuiz`-Pipeline inklusive Memory-Fragen, Duplikat-Schutz und Fallback-Ergänzung

## App-Integration

`js/app.js` erzeugt eine Instanz über:

```js
window.EGTQuizBuildPipelineEngine.create(...)
```

Globale Diagnoseinstanz:

```js
window.QuizBuildPipelineEngine
App._test.QuizBuildPipelineEngine
```

## Sicherheit

Die bisherigen internen Implementierungen bleiben als Legacy-Fallback erhalten. Der normale Pfad läuft aber über die neue Pipeline-Engine.

## Ergebnis

Phase 21 stärkt die Modulgrenze zwischen Question-Control aus Phase 20 und der eigentlichen Aufgaben-/Generator-Pipeline.
