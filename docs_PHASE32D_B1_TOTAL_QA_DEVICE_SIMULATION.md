# Phase 32D – B1 Gesamt-QA + Device-Simulation

## Ziel
B1 nach Phase 32C vollständig prüfen, ohne neue Inhalte zu verändern.

## Prüfumfang
- B1-Datenintegrität
- 10 Lektionen vollständig ausgebaut
- 430 Aufgaben gesamt
- 350 normale Aufgaben
- 80 Sprechaufgaben
- keine doppelten Task-IDs
- keine fehlenden Pflichtfelder
- Aufgabentyp-Abdeckung pro Lektion
- Speaking-Fallback aus Phase 30E vorhanden
- A2 Regression geschützt
- Cloud-/Coach-/Flow-Schnittstellen geprüft

## Ergebnis
Die automatischen Node- und Static-Checks bestehen. Die echte Chromium-Gerätesimulation konnte in dieser Containerumgebung nicht vollständig ausgeführt werden, weil Playwright-Browser-Binaries nicht installiert sind. Die Browser-Testdatei ist enthalten und kann auf GitHub Pages/echten Geräten ausgeführt werden.

## Browser-Testdatei
`tests_phase32d_b1_total_qa_device_simulation.html`

## Neue API
`LanguageAcademyCourseEntry.phase32dQaSnapshot()`

## Empfohlener nächster Schritt
Phase 33A – B2 Kursstruktur + Speaking-Struktur parallel.
