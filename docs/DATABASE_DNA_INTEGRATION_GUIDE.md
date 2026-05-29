# Datenbank-DNA Integrationsanleitung für den KI-Coach

Version: V9.5.8 / DNA-Guide verified

Diese Anleitung ist verbindlich für die spätere Integration des Coach-Moduls in die Haupt-App. Sie erklärt, wie Aufgaben in der Aufgabendatenbank strukturiert werden müssen, damit der Coach nicht nur grob schätzt, sondern präzise adaptive Lernentscheidungen treffen kann.

## 1. Grundsatz

Der Coach funktioniert technisch auch ohne vollständige DNA. Dann nutzt er Fallbacks und Schätzungen. Das reicht für Basishilfe, ist aber nicht das Qualitätsziel.

**Premium-Ziel:** Jede neue oder überarbeitete Aufgabe bekommt eine saubere DNA. Nur dann funktionieren adaptive Schwierigkeit, Fehlerdiagnose, Revanche-Aufgaben, Spaced Repetition, Lernkurve und Prüfungsampel wirklich belastbar.

Kurz:

- ohne DNA = Coach schätzt
- mit DNA = Coach entscheidet gezielt

## 2. Exaktes Pflichtschema

Jede Aufgabe soll künftig nach diesem Schema aufgebaut sein:

```js
{
  id: "zr_014",
  q: "3, 6, 9, 18, 21, ?",
  a: ["24", "27", "42", "36"],
  correct: 3,
  explanation: "Die Reihe wechselt zwischen +3 und x2: 3 + 3 = 6, 6 + 3 = 9, 9 x 2 = 18, 18 + 3 = 21, 21 + 15? Achtung: Die Aufgabe muss fachlich sauber geprüft werden.",
  dna: {
    category: "logik",
    subtype: "zahlenreihe_wechselmuster",
    difficulty: 4,
    skill: "musterwechsel_erkennen",
    expectedTimeMs: 14000,
    trap: "lineare_addition_statt_wechselmuster",
    examTarget: "ctc",
    distractors: [
      {
        value: "24",
        errorPath: "difference_only_checked",
        hint: "Du hast vermutlich nur eine einfache Addition geprüft. Hier steckt ein Wechselmuster dahinter."
      },
      {
        value: "27",
        errorPath: "secondary_pattern_missed",
        hint: "Du hast einen Teil des Musters gesehen, aber den Wechsel nicht vollständig übernommen."
      }
    ],
    masteryThreshold: 3,
    retryWeight: 0.8,
    requiresFocus: true
  }
}
```

Wichtig: Das Beispiel zeigt die Struktur. Die konkrete Aufgabe muss fachlich immer sauber geprüft werden. Keine Aufgabe darf mit ungeprüfter Lösung in die Bank.

## 3. Pflichtfelder in `dna`

Diese Felder müssen bei neuen Aufgaben vorhanden sein:

| Feld | Typ | Beispiel | Zweck |
|---|---|---|---|
| `category` | string | `logik` | Hauptbereich für Statistik und Prüfungsampel |
| `subtype` | string | `zahlenreihe_wechselmuster` | genauer Aufgabentyp für Revanche und Auswahl |
| `difficulty` | number 1-5 | `4` | objektive Grundschwierigkeit |
| `skill` | string | `musterwechsel_erkennen` | konkrete Fähigkeit, die trainiert wird |
| `expectedTimeMs` | number | `14000` | Zielzeit in Millisekunden |
| `trap` | string | `lineare_addition_statt_wechselmuster` | typische Denkfalle |
| `examTarget` | string | `bps`, `ctc`, `bosch`, `allgemein` | Prüfungsnähe und Gewichtung |

Diese Felder sind für maximale Coach-Qualität empfohlen:

| Feld | Typ | Beispiel | Zweck |
|---|---|---|---|
| `distractors` | array | siehe unten | ordnet falsche Antworten konkreten Denkfehlern zu |
| `masteryThreshold` | number | `3` | wie oft der Skill stabil gelöst werden soll |
| `retryWeight` | number 0-1 | `0.8` | wie wichtig spätere Wiederholung ist |
| `requiresFocus` | boolean | `true` | markiert Aufgaben mit hoher Konzentrationsanforderung |

## 4. Distractor-Regel: falsche Antwort = Denkfehler

Distractors sind der stärkste Hebel für präzise Fehlerdiagnose.

Nicht nur speichern:

```js
"24" ist falsch
```

Sondern speichern:

```js
{
  value: "24",
  errorPath: "difference_only_checked",
  hint: "Du hast vermutlich nur die Differenzen geprüft."
}
```

Dadurch weiß der Coach später:

- welche Denkfalle ausgelöst wurde
- welche Revanche-Aufgabe passt
- welche Erklärung sinnvoll ist
- ob der Fehler wiederholt auftritt

## 5. Einheitliche Kategorien

Bitte diese Kategorien verwenden und keine eigenen Schreibweisen mischen:

```txt
mathe
logik
it
sprache
konzentration
allgemeinwissen
technisch
visuell
gemischt
```

Schlecht:

```js
category: "Mathematik"
category: "math"
category: "Rechnen"
```

Gut:

```js
category: "mathe"
```

## 6. Schwierigkeit richtig vergeben

| Schwierigkeit | Bedeutung | Beispiel |
|---:|---|---|
| 1 | sehr leicht | Grundwissen, offensichtliche Antwort |
| 2 | leicht | ein Denkschritt, klare Struktur |
| 3 | mittel | mehrere Denkschritte oder moderater Zeitdruck |
| 4 | schwer | Denkfalle, Wechselmuster, komplexere Auswahl |
| 5 | sehr schwer | CTC/Bosch-Hard-Mode, hohe Ablenkung oder mehrere Regeln |

Der Coach berechnet später zusätzlich eine persönliche Schwierigkeit. Eine objektive 3 kann für den Nutzer persönlich zu 4 werden, wenn er sie mehrfach falsch oder langsam löst.

## 7. Zielzeit `expectedTimeMs`

Die Zielzeit ist keine harte Zeitbegrenzung, sondern Vergleichswert für Tempoanalyse.

Grobe Startwerte:

| Aufgabentyp | Zielzeit |
|---|---:|
| einfache Faktenfrage | 6000-10000 |
| leichte Zahlenreihe | 8000-12000 |
| schwere Zahlenreihe | 12000-20000 |
| Kopfrechnen | 10000-18000 |
| IT-Grundlagenfrage | 10000-18000 |
| Textverständnis | 20000-45000 |
| Matrix / visuelle Logik | 20000-60000 |
| Konzentration | abhängig vom Format |

## 8. Gute Skills formulieren

Ein Skill muss konkret sein.

Schlecht:

```js
skill: "logik"
```

Gut:

```js
skill: "musterwechsel_erkennen"
skill: "prozentwert_berechnen"
skill: "dns_ip_unterscheiden"
skill: "informationen_aus_text_filtern"
skill: "visuelle_rotation_erkennen"
```

## 9. Gute Traps formulieren

Ein Trap beschreibt die typische falsche Denkspur.

Schlecht:

```js
trap: "falsch gedacht"
```

Gut:

```js
trap: "lineare_addition_statt_multiplikation"
trap: "dns_mit_internetverbindung_verwechselt"
trap: "prozentwert_mit_grundwert_verwechselt"
trap: "antwortfalle_mit_aehnlicher_formulierung"
trap: "nur_erste_regel_erkannt"
```

## 10. Empfohlene ErrorPaths

Diese ErrorPaths sollte die Datenbank bevorzugt verwenden:

### Zahlenreihen / Logik

```txt
difference_only_checked
secondary_pattern_missed
correct_logic_wrong_calculation
random_guess
pattern_switch_missed
```

### Mathe

```txt
operation_confused
formula_misapplied
unit_confused
calculation_slip
word_problem_misread
```

### IT / EDV

```txt
dns_ip_confused
hardware_mapping_error
os_term_confused
network_concept_confused
cause_effect_confused
```

### Sprache / Text

```txt
keyword_misread
context_missed
synonym_confused
opposite_confused
quick_guess
```

### Konzentration / visuell

```txt
similar_symbol_confused
sequence_order_error
focus_drop
mirror_rotation_confused
row_column_confused
```

## 11. Integration nach Antwort

Nach jeder beantworteten Aufgabe muss die Haupt-App dem Coach das Ergebnis übergeben.

Empfohlener Hook:

```js
BPSLearningCoach.recordAnswer({
  taskId: task.id,
  category: task.dna?.category,
  subtype: task.dna?.subtype,
  skill: task.dna?.skill,
  trap: task.dna?.trap,
  examTarget: task.dna?.examTarget,
  selectedAnswer: selectedText,
  correctAnswer: correctText,
  givenIndex: selectedIndex,
  correctIndex: task.correct,
  correct: isCorrect,
  timeMs: durationMs,
  expectedTimeMs: task.dna?.expectedTimeMs,
  difficulty: task.dna?.difficulty
}, task);
```

Ohne diesen Hook kann der Coach keine saubere Lernhistorie, Revanche, Mastery oder Prüfungsampel aufbauen.

## 12. Audit benutzen

Nach dem Einbau sollte die Datenbank geprüft werden:

```js
BPSLearningCoach.databaseDNAAudit()
```

Der Audit soll zeigen:

- Anzahl Aufgaben
- wie viele DNA-ready sind
- welche Felder fehlen
- welche Kategorien uneinheitlich sind
- welche Aufgaben für echte Lernintelligenz nachbearbeitet werden müssen

## 13. Reihenfolge beim Nachpflegen alter Aufgaben

Wenn nicht sofort alle Aufgaben getaggt werden können, dann diese Reihenfolge:

1. CTC/BPS-Simulationen
2. häufig genutzte Aufgaben
3. Zahlenreihen / Logik
4. IT / EDV
5. Mathe unter Zeitdruck
6. Sprache / Textverständnis
7. Konzentration
8. Allgemeinwissen

So entsteht der größte Lernnutzen zuerst.

## 14. Qualitätsregel vor Merge

Eine neue Aufgabe ist erst coach-ready, wenn diese Fragen beantwortet sind:

1. Was trainiert diese Aufgabe konkret?
2. Welche typische Denkfalle gibt es?
3. Wie schwer ist sie objektiv von 1 bis 5?
4. Wie lange sollte sie ungefähr dauern?
5. Welche falsche Antwort zeigt welchen Denkfehler?
6. Für welche Prüfung ist sie relevant?
7. Hat die Aufgabe eine eindeutige, geprüfte Lösung?

Wenn diese Fragen nicht beantwortet sind, ist die Aufgabe noch nicht DNA-ready.

## 15. Wichtigster Merksatz

Die DNA ist keine Dekoration. Sie ist die Schnittstelle zwischen Aufgabenbank und Lernintelligenz.

Je sauberer die DNA, desto präziser kann der Coach:

- Schwierigkeit anpassen
- Fehler erklären
- Revanche auswählen
- Lernkurve berechnen
- Prüfungsampel anzeigen
- Motivation sinnvoll steuern
