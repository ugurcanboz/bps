# Phase 33D – B2 Gesamt-QA + Device-Simulation

Version: G54.24  
Basis: G54.23 – Phase 33C B2 Lessons 6-10 Content + Speaking Expansion

## Ziel

Phase 33D prüft B2 vollständig nach dem Ausbau von 10 Lektionen. Es wurden keine neuen Kursinhalte erzeugt, sondern QA, Snapshot-Prüfung, statische Integrität, Regression und Browser-Testharness ergänzt.

## Prüfumfang

- B2-Level geöffnet und vollständig verfügbar
- 10 B2-Lektionen
- 430 B2-Aufgaben gesamt
- 350 normale Aufgaben
- 80 Speaking-Aufgaben
- 0 Starter-Lektionen
- 0 doppelte Task-IDs
- Pflichtfelder geprüft
- A2 Regression geprüft
- B1 Regression geprüft
- Speaking-Fallback nach Phase 30E bleibt aktiv

## Neue Prüfschnittstelle

```js
LanguageAcademyCourseEntry.phase33dQaSnapshot()
```

Erwarteter Kernstatus:

```js
{
  phase: '33D',
  level: 'b2',
  ok: true,
  summary: {
    lessons: 10,
    expandedLessons: 10,
    starterLessons: 0,
    totalTasks: 430,
    normalTasks: 350,
    speakingTasks: 80,
    duplicateTaskIds: 0,
    missingRequired: 0
  }
}
```

## Browser-Testdatei

```text
tests_phase33d_b2_total_qa_device_simulation.html
```

Diese Datei prüft im echten Browser:

- API geladen
- Phase33D Snapshot OK
- B2 totals korrekt
- A2/B1 Regression OK
- B2-Lektionen sichtbar/verfügbar
- Speaking-Fallback-Policy vorhanden

## Device-Simulation

Vorbereitet für:

- Desktop 1440
- Desktop 1024
- iPhone 15 Pro Max
- iPhone SE
- iPad 11
- iPad 12.9

In dieser Umgebung konnte kein echter Chromium/Playwright-Renderlauf garantiert werden. Die Simulation ist deshalb als Testharness und Ergebnisdatei dokumentiert. Finale visuelle Prüfung muss nach Deploy auf echten Geräten erfolgen.

## Ergebnis

B2 ist aus Code- und Datenintegritätssicht QA-bestanden. Nächster Schritt: Phase 34A – C1 Kursstruktur + Speaking-Struktur parallel.
