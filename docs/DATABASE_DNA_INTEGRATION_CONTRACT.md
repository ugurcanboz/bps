# Datenbank-DNA Integrationsvertrag für den KI Coach

Dieses Dokument richtet sich an die Person, die das Coach-Modul später in die Haupt-App integriert oder die Aufgabenbank erweitert.

## Grundsatz

Der Coach darf nicht nur optisch integriert werden. Er braucht nach jeder Aufgabe strukturierte Daten. Besonders wichtig ist das `dna`-Objekt in der Aufgabe.

Ohne DNA nutzt der Coach den internen Adapter und schätzt Werte. Das ist als Fallback okay, aber nicht das Qualitätsziel.

## Pflicht bei Integration

### 1. Coach-Dateien laden

Siehe `README-INTEGRATION.md`.

### 2. Aufgaben mit DNA übergeben

Jede Aufgabe sollte mindestens enthalten:

```js
{
  id: "...",
  q: "...",
  a: ["..."],
  correct: 0,
  explanation: "...",
  dna: {
    category: "logik",
    subtype: "zahlenreihe",
    difficulty: 3,
    skill: "muster_erkennen",
    expectedTimeMs: 12000,
    trap: "naheliegende_antwortfalle",
    examTarget: "bps"
  }
}
```

### 3. Nach jeder Antwort recordAnswer aufrufen

```js
BPSLearningCoach.recordAnswer({
  cat: task.cat || task.dna?.category,
  group: task.group || task.dna?.subtype,
  correct: isCorrect,
  givenIndex: selectedIndex,
  correctIndex: task.correct,
  duration: durationMs,
  allowed: task.dna?.expectedTimeMs || task.timeLimit || 20000
}, task);
```

### 4. Keine wechselnden IDs

Die ID einer Aufgabe darf sich nicht bei jedem Start ändern. Sonst funktionieren Wiederholungssperre, Spaced Repetition und Fehlerhistorie nicht zuverlässig.

## Warum das relevant ist

Der Coach nutzt DNA für:

- adaptive Schwierigkeit
- Fehler-DNA
- Revanche-Auswahl
- Spaced Repetition
- Readiness-Score
- Command Center
- Wochenverlauf
- personalisierte Empfehlungen

## Minimalqualität

Eine Aufgabe ohne DNA ist erlaubt, wenn sie noch alt ist. Neue Aufgaben sollen aber nicht mehr ohne DNA angelegt werden.

## Priorität beim Nachtragen alter Aufgaben

Wenn nicht alles auf einmal getaggt werden kann, dann zuerst diese Bereiche:

1. häufig genutzte Prüfungsaufgaben
2. Fehleranfällige Aufgaben
3. CTC/BPS-Simulationen
4. Mathe/Zahlenreihen/Logik
5. IT-Fallfragen
6. Restbestand

## Nicht machen

- keine willkürlichen Kategorien wie `Mathematik`, `math`, `Mathe_1`, `rechnen` mischen
- keine Schwierigkeit über 5
- keine Zeitangaben als Text wie `10 Sekunden`, sondern immer `10000`
- keine leeren Traps bei Aufgaben mit typischer Falle
- keine zufälligen IDs beim Appstart

## Quick-Check vor Merge

Eine neue Aufgabe ist coach-ready, wenn diese Fragen beantwortet sind:

- Was trainiert diese Aufgabe konkret?
- Welche Denkfalle ist typisch?
- Wie schwer ist sie objektiv von 1 bis 5?
- Wie lange sollte sie ungefähr dauern?
- Für welche Prüfung ist sie relevant?

Wenn diese Fragen nicht beantwortbar sind, ist die Aufgabe fachlich noch nicht sauber genug für adaptive Lernintelligenz.
