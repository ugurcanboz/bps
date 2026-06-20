# Phase 35D · C2 Total QA + Device Simulation

## Ziel
C2 nach Phase 35C vollständig prüfen: Datenintegrität, Aufgabenstruktur, Speaking-Anteile, UI/Flow-Annahmen, Regression A2/B1/B2/C1 und Versionierung.

## Erwarteter Zielzustand
- C2-Lektionen: 10
- Vollständig ausgebaute C2-Lektionen: 10
- Starter-Lektionen: 0
- Aufgaben gesamt: 430
- Normale Aufgaben: 350
- Speaking-Aufgaben: 80
- Doppelte Task-IDs: 0
- Fehlende Pflichtfelder: 0

## Neue QA-Schnittstelle
```js
LanguageAcademyCourseEntry.phase35dQaSnapshot()
```

## Browser-Test
```text
tests_phase35d_c2_total_qa_device_simulation.html
```

## Device-Profile für manuelle Prüfung
- Desktop 1440
- Desktop 1024
- iPhone 15 Pro Max
- iPhone SE
- iPad 11
- iPad 12.9

## Ergebnis
Phase 35D bestätigt C2 als aus Code- und Datenintegritätssicht abgeschlossen.
