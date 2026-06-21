# Phase 38C.1 – Harte Prüfungsarchitektur + Groq-Prüfungslehrer-Basis

## Ziel

Phase 38C.1 startet den professionellen Prüfungsmodus der Language Academy.
Groq wird nicht als permanenter Live-Chat verwendet, sondern als strenger KI-Mitprüfer für Prüfungssimulationen.

Grundsatz:

```text
Bestanden bedeutet: realistische Chancen in einer echten Prüfung, keine reine Motivationsmeldung.
```

## Eingebaut

### Neue Dateien

```text
data/language-exam-blueprints.js
js/modules/language-exam-engine.js
tests_phase38c1_exam_engine_hard_rubric.html
docs_PHASE38C1_EXAM_ARCHITECTURE_HARD_RUBRIC.md
```

### Geänderte Dateien

```text
index.html
service-worker.js
update-check.json
WORKING-PLAN_1.md
```

## Prüfungsarchitektur

Für A1, A2, B1, B2, C1 und C2 sind jetzt Blueprints vorhanden mit:

```text
Lesen
Hören
Schreiben
Sprechen
Bestehensgrenze
Sicher-bestanden-Grenze
Mindestleistung pro Prüfungsteil
Pilotaufgaben für Schreiben und Sprechen
```

## Harte Bewertungsregeln

Die lokale Engine bewertet objektive Kriterien:

```text
Antwort vorhanden
Mindestlänge
Pflichtpunkte
Themenbezug
Struktur
zu kurze Antworten
Themenverfehlung
```

Groq bewertet qualitative Kriterien über die bereits vorhandene Route:

```text
/api/exam-speaking
```

Bewertungsgewichtung im Hybridmodus:

```text
Lokale Engine: 40 %
Groq-Prüfer: 60 %
```

Wenn Groq nicht erreichbar ist, bewertet die lokale Engine alleine weiter. Die App stürzt nicht ab.

## Bestehensgrenzen

```text
A1/A2: bestanden ab 65 %, sicher bestanden ab 80 %
B1/B2: bestanden ab 70 %, sicher bestanden ab 82 %
C1: bestanden ab 75 %, sicher bestanden ab 85 %
C2: bestanden ab 75 %, sicher bestanden ab 88 %
```

Zusätzlich gilt:

```text
Ein Teilbereich darf nicht unter seine Mindestgrenze fallen.
Themenverfehlung kann nicht durch gute Grammatik ausgeglichen werden.
Zu kurze Antworten werden hart gedeckelt.
Fehlende zentrale Pflichtpunkte verhindern sichere Prüfungsreife.
```

## Groq-Rolle

Groq wird als Prüfungslehrer eingesetzt:

```text
streng
fair
nicht beschönigend
prüfungsnah
kontextbewusst
```

Nicht als dauerhaftes Live-Gespräch für jede Übung.

## Test

Nach Deploy öffnen:

```text
tests_phase38c1_exam_engine_hard_rubric.html
```

Dort testen:

```text
1. Blueprint laden
2. lokale harte Bewertung
3. Groq-Hybridbewertung
4. Off-Topic-Test
5. Kurzantwort-Test
```

## Status

Phase 38C.1 ist eine Architektur- und Bewertungsbasis. Sie ist bewusst noch kein vollständiger sichtbarer A1-C2-Prüfungsmodus.

Nächster sinnvoller Schritt:

```text
Phase 38C.2 – Exam Shell / sichtbarer Prüfungsmodus
```
