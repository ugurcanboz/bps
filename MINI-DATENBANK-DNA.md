# Mini-Datenbank-DNA · Pflichtstandard für den KI Coach

Diese Anleitung gehört zum Coach-Modul und ist für die spätere Integration in die Haupt-App verbindlich relevant.

Der Coach kann Aufgaben auch ohne saubere DNA grob einschätzen. Für echte Lernintelligenz, adaptive Schwierigkeit, Revanche-Aufgaben, Spaced Repetition und ehrliche Readiness-Scores muss die Aufgabendatenbank aber schrittweise mit Mini-DNA versehen werden.

Kurz gesagt:

> Ohne DNA = Coach schätzt.
> Mit DNA = Coach entscheidet gezielt.

---

## 1. Ziel der Mini-DNA

Die Mini-DNA beschreibt nicht nur, **was** eine Aufgabe ist, sondern **welche Fähigkeit** sie trainiert, **wie schwer** sie ist, **wie lange** sie ungefähr dauern sollte und **welche Denkfalle** typisch ist.

Dadurch kann der Coach später sinnvoll reagieren:

- passende nächste Aufgabe auswählen
- Schwierigkeit erhöhen oder senken
- falsche Aufgaben gezielt wiederholen
- Revanche-Aufgaben finden
- Zeitdruck realistisch bewerten
- Readiness-Score ehrlicher berechnen
- Nutzerfeedback konkreter formulieren

---

## 2. Mindeststruktur pro Aufgabe

Neue oder überarbeitete Aufgaben sollen dieses `dna`-Objekt enthalten:

```js
{
  id: "zr_001",
  q: "2, 4, 8, 16, ?",
  a: ["18", "24", "32", "36"],
  correct: 2,
  explanation: "Die Zahlen werden jeweils verdoppelt.",
  dna: {
    category: "logik",
    subtype: "zahlenreihe",
    difficulty: 2,
    skill: "multiplikatives_muster_erkennen",
    expectedTimeMs: 9000,
    trap: "lineare_addition_vermutet",
    examTarget: "bps"
  }
}
```

---

## 3. Die 8 Pflicht-/Kernfelder

| Feld | Pflicht | Beispiel | Warum es wichtig ist |
|---|---:|---|---|
| `id` | ja | `zr_001` | eindeutige Wiedererkennung, Wiederholungssperre, Spaced Repetition |
| `category` | ja | `logik` | Hauptbereich für Statistiken und Coach-Auswahl |
| `subtype` | ja | `zahlenreihe` | genauer Aufgabentyp für Revanche und Skill-Training |
| `difficulty` | ja | `3` | Basis-Schwierigkeit von 1 bis 5 |
| `skill` | ja | `musterwechsel_erkennen` | konkrete Fähigkeit, die trainiert wird |
| `expectedTimeMs` | ja | `12000` | Zielzeit, damit Tempo bewertet werden kann |
| `trap` | ja | `nur_differenzen_geprueft` | typische Denkfalle für Fehler-DNA und Revanche |
| `examTarget` | empfohlen | `bps`, `ctc`, `bosch`, `allgemein` | prüfungsnahe Gewichtung |

---

## 4. Schwierigkeit richtig vergeben

`difficulty` ist ein Basiswert. Der Coach berechnet daraus später zusätzlich eine persönliche Schwierigkeit.

| Wert | Bedeutung | Beispiel |
|---:|---|---|
| 1 | sehr leicht | Grundrechnen, einfache Faktenfrage |
| 2 | leicht | klares Muster, wenig Ablenkung |
| 3 | mittel | mehrere Denkschritte oder Zeitdruck |
| 4 | schwer | Falle, Wechselmuster, komplexe Textlogik |
| 5 | sehr schwer | CTC/Bosch-Hard-Mode, hohe Ablenkung, mehrere Regeln |

Wichtig: Eine Aufgabe kann objektiv `difficulty: 3` sein, aber für den Nutzer persönlich später als 4 oder 5 bewertet werden, wenn sie wiederholt falsch oder zu langsam gelöst wird.

---

## 5. Zielzeit sinnvoll wählen

`expectedTimeMs` ist kein harter Timer, sondern eine Referenz für den Coach.

Grobe Startwerte:

| Aufgabentyp | Startwert |
|---|---:|
| einfache Allgemeinwissenfrage | 6000–10000 |
| leichte Zahlenreihe | 8000–12000 |
| schwere Zahlenreihe | 12000–20000 |
| Mathe-Kopfrechnen | 10000–18000 |
| IT-Grundlagenfrage | 10000–18000 |
| Textverständnis | 20000–45000 |
| Matrix/visuelle Logik | 20000–60000 |
| Konzentrationsaufgabe | abhängig vom Aufgabenformat |

Regel:

- zu kurze Zielzeit = Coach bewertet unfair streng
- zu lange Zielzeit = Tempo-Training verliert Wirkung
- lieber realistisch starten und später nach echten Nutzerdaten nachschärfen

---

## 6. Gute Skills formulieren

Ein `skill` soll konkret sein, nicht allgemein.

Schlecht:

```js
skill: "logik"
```

Gut:

```js
skill: "wechselmuster_erkennen"
skill: "dns_dhcp_unterscheiden"
skill: "prozentwert_berechnen"
skill: "informationen_aus_text_filtern"
skill: "visuelle_aehnlichkeit_unterscheiden"
```

Warum? Der Coach soll nicht sagen: „Du bist schlecht in Logik“, sondern:

> „Du verlierst Punkte bei Wechselmustern, nicht bei Zahlenreihen allgemein.“

---

## 7. Gute Traps formulieren

`trap` beschreibt die typische falsche Denkspur.

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

Der Trap ist für den Coach extrem wichtig, weil daraus Revanche-Aufgaben entstehen.

---

## 8. Empfohlene Kategorien

Bitte möglichst diese Kategorien verwenden, damit Statistiken sauber bleiben:

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

Nicht jedes Teammitglied soll eigene Varianten erfinden wie `Mathematik`, `math`, `rechnen`, `Rechnung`. Das macht die Analyse schwächer.

---

## 9. Empfohlene Subtypes

Beispiele:

```txt
zahlenreihe
wechselmuster
kopfrechnen
prozent
bruchrechnen
textaufgabe
matrix
figurenlogik
tabellenlogik
netzwerk
hardware
betriebssystem
dns_dhcp
satzergänzung
synonyme
textverständnis
zeichenvergleich
aufmerksamkeit
```

Subtypes dürfen erweitert werden, aber bitte konsistent.

---

## 10. Integration in vorhandene Aufgabenbanken

Falls eine Aufgabe bisher so aussieht:

```js
{
  id: "q_101",
  cat: "Mathe",
  group: "Prozent",
  q: "20 % von 80?",
  a: ["12", "14", "16", "18"],
  correct: 2
}
```

soll sie später so erweitert werden:

```js
{
  id: "q_101",
  cat: "Mathe",
  group: "Prozent",
  q: "20 % von 80?",
  a: ["12", "14", "16", "18"],
  correct: 2,
  explanation: "20 % von 80 sind 16, weil 80 × 0,20 = 16.",
  dna: {
    category: "mathe",
    subtype: "prozent",
    difficulty: 2,
    skill: "prozentwert_berechnen",
    expectedTimeMs: 10000,
    trap: "grundwert_und_prozentwert_verwechselt",
    examTarget: "bps"
  }
}
```

Die alten Felder dürfen bleiben. Die DNA kommt zusätzlich dazu.

---

## 11. Was der Integrator zwingend beachten muss

1. Jede neue Aufgabe braucht langfristig eine stabile `id`.
2. DNA gehört direkt an die Aufgabe oder muss vor Übergabe an den Coach ergänzt werden.
3. Fehlende DNA ist erlaubt, aber nur als Übergang.
4. Neue Kategorien und Skills müssen konsistent benannt werden.
5. `difficulty` immer 1–5 halten, keine Sonderwerte.
6. `expectedTimeMs` immer als Zahl in Millisekunden speichern.
7. `trap` nicht leer lassen, wenn die Aufgabe eine erkennbare Denkfalle hat.
8. Nach jeder beantworteten Aufgabe muss die Haupt-App `BPSLearningCoach.recordAnswer(...)` aufrufen.

---

## 12. Übergabe an den Coach

Nach jeder gelösten Aufgabe soll die Haupt-App dem Coach Ergebnis + Aufgabe geben:

```js
BPSLearningCoach.recordAnswer({
  cat: "Mathe",
  group: "Prozent",
  correct: false,
  givenIndex: 0,
  correctIndex: 2,
  duration: 14500,
  allowed: 20000
}, currentTask);
```

`currentTask` sollte die DNA enthalten.

Der Coach kann dann berechnen:

- war die Antwort richtig?
- war sie schnell genug?
- welcher Skill ist betroffen?
- welche Denkfalle war wahrscheinlich?
- soll eine Revanche kommen?
- soll die Schwierigkeit steigen oder sinken?

---

## 13. Qualitätsregel

Die Mini-DNA muss nicht perfekt sein, aber sie muss ehrlich sein.

Lieber:

```js
difficulty: 3,
trap: "antwortfalle"
```

als übertrieben detaillierte, aber falsche Angaben.

Falsche DNA ist schlimmer als fehlende DNA, weil der Coach dann falsche Lernentscheidungen trifft.

---

## 14. Kurzfassung für Entwickler

Beim Einpflegen neuer Aufgaben immer prüfen:

```txt
1. Hat die Aufgabe eine eindeutige ID?
2. Ist category eindeutig?
3. Ist subtype konkret?
4. Ist difficulty 1–5 realistisch?
5. Ist skill konkret benannt?
6. Ist expectedTimeMs realistisch?
7. Ist trap als typische Denkfalle formuliert?
8. Ist examTarget gesetzt?
```

Wenn diese 8 Punkte erfüllt sind, kann der Coach später deutlich intelligenter arbeiten.
