# Phase 38D.7 · B2 Gesamt-QA / Endsimulation

## Ziel

B2 ist seit Phase 38D.6 in allen fünf Prüfungsteilen vollständig ausgebaut. Phase 38D.7 prüft jetzt den gesamten B2-Hardmode als zusammenhängende Endsimulation:

```text
Lesen
Hören
Grammatik & Sprachbausteine
Schreiben
Sprechen
Ergebnisbericht
```

Wichtig: Es wird weiterhin keine Prüfungsfreigabe und kein offizielles Zertifikat ausgegeben. Die App liefert nur einen harten Academy-Ergebnisbericht mit Prognose, Stärken, Schwächen und Wiederholungsempfehlung.

---

## Umgesetzte Änderungen

### 1. B2-Gesamt-QA in der Engine

Datei:

```text
js/modules/language-exam-engine.js
```

Neu ergänzt:

```text
createB2FullQaSession()
runB2FullExamQaScenarios()
validateB2FullExamQaScenarios()
validateB2HardmodeTotalQa()
```

Damit kann die Engine B2-Endsimulationen intern erzeugen und harte Regressionsfälle prüfen.

---

### 2. B2-Szenarienmatrix

Die neue B2-QA prüft folgende Szenarien:

```text
strong-pass
borderline-pass
overall-borderline-fail
weak-listening
weak-grammar
weak-writing-a1-style
weak-speaking-a1-style
writing-topic-missed
speaking-no-example
listening-helper-mode
groq-down-fallback
incomplete-speaking
```

Damit werden nicht nur normale Erfolgsszenarien geprüft, sondern bewusst auch harte Fehlerfälle.

---

## Erwartetes Verhalten

| Szenario | Erwartung |
|---|---|
| strong-pass | bestanden |
| borderline-pass | bestanden |
| overall-borderline-fail | nicht bestanden |
| weak-listening | nicht bestanden |
| weak-grammar | nicht bestanden |
| weak-writing-a1-style | nicht bestanden |
| weak-speaking-a1-style | nicht bestanden |
| writing-topic-missed | nicht bestanden |
| speaking-no-example | nicht bestanden |
| listening-helper-mode | bestanden, aber Hilfsmodus markiert |
| groq-down-fallback | bestanden mit lokalem Fallback |
| incomplete-speaking | nicht bestanden |

---

## B2-Hardmode-Garantie

Geprüft wird jetzt systematisch:

```text
B2 Pool = 8 Lesen × 8 Hören × 8 Grammatik × 8 Schreiben × 8 Sprechen
B2 Kombinationen = 32768
alle 5 Teile sind Pflicht
Gesamtpunkte allein reichen nicht
jeder Teil muss Mindestleistung erreichen
Grammatik kann Prüfung kippen
Hören kann Prüfung kippen
Schreiben kann Prüfung kippen
Sprechen kann Prüfung kippen
unvollständige Prüfung fällt durch
A1/B1-artige Antworten fallen in B2 hart durch
Groq-Ausfall zerstört Prüfung nicht
Transkript-Hilfsmodus wird im Bericht markiert
```

---

## Bewertungslogik nachgeschärft

### Schreiben

Die Schreibstruktur unterscheidet jetzt besser zwischen:

```text
formeller Beschwerde / E-Mail
argumentativer Stellungnahme / Essay / Meinungsbeitrag
```

Vorher konnte eine argumentative B2-Stellungnahme unnötig wie eine formelle E-Mail behandelt werden. Das wurde in Phase 38D.7 korrigiert.

### B2-Blueprint-Konsistenz

Datei:

```text
data/language-exam-blueprints.js
```

B2 wurde an die echte Hardmode-Matrix angepasst:

```text
B2 Schreiben: minWords 180
B2 Sprechen: minWords 180
```

Damit stimmen Blueprint, Difficulty-Matrix und B2-Pilotpool besser überein.

---

## Neue Testdatei

```text
tests_phase38d7_b2_gesamt_qa.html
```

Die Testseite lädt die relevanten Daten- und Engine-Dateien und führt aus:

```text
LanguageExamEngine.validateB2HardmodeTotalQa()
```

Zusätzlich werden PoolInfo, Szenarien, Checks und lokale Regressionen angezeigt.

---

## QA-Ergebnis

Bestanden:

```text
B2 PoolInfo: 8/8/8/8/8
B2 Kombinationen: 32768
B2 Gesamt-QA: 12 Szenarien korrekt entschieden
A1-Schreibantwort in B2 fällt durch
A1-Sprechantwort in B2 fällt durch
strukturierte B2-Schreibantwort kann bestehen
strukturierte B2-Sprechantwort kann bestehen
Groq-Fallback bleibt stabil
Hör-Hilfsmodus wird markiert
unvollständige Prüfung fällt durch
Shell Diagnostics: Phase 38D.7
```

---

## Ergebnis

Phase 38D.7 ist abgeschlossen. B2 ist jetzt nicht nur inhaltlich vollständig ausgebaut, sondern auch als kompletter 5-teiliger Hardmode endvalidiert.

Nächster sinnvoller Schritt:

```text
Phase 38D.8 · B2 visuelle Endprüfung / Geräte-Simulation / Deployment-Check
```

Danach kann B2 als stabiler Hardmode-Block betrachtet werden und die nächste größere Richtung wäre A2/B1/B2 Prüfungsfeinschliff oder C1-Prüfungsarchitektur.
