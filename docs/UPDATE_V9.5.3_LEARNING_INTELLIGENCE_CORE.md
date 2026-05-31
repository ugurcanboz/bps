# Update V9.5.3 – Learning Intelligence Core

Ziel: Keine neuen sichtbaren Spielereien, sondern echte Lernintelligenz im Coach-Modul.

## Neu

- Mini-DNA-Adapter für Aufgaben
- automatische DNA-Schätzung bei alten Aufgaben
- effektive Schwierigkeit pro Nutzer/Skill
- Skill-Statistiken ohne Datenbank-Verschmutzung
- Spaced-Repetition-Warteschlange
- Revanche-Grundlage über Fehler-DNA + Skill-DNA
- Decision Log: nachvollziehbar, warum eine Aufgabe ausgewählt wurde
- Command Center zeigt Lernintelligenz-Status
- Mini-Datenbank-DNA-Anleitung ergänzt

## API-Erweiterungen

- `normalizeTaskDNA(task)`
- `effectiveDifficulty(taskOrDna)`
- `learnerLevelFor(profile)`
- `dueSpacedItems()`
- `learningIntelligenceReport()`
- `taskDebugInfo(task)`
- `lastDecisionLog()`

## Qualitätsziel

Adaptive Schwierigkeit soll nicht nur ein Name im Code sein. Der Coach nutzt:

- Basis-Schwierigkeit
- persönliche Trefferquote
- Antworttempo
- Wiederholungsfehler
- Skill-Verlauf
- Spaced-Repetition-Signale

Damit kann die Schwierigkeit später mit echten App-Daten praktisch relevant wachsen.
