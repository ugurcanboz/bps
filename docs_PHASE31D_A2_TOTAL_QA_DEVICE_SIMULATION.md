# Phase 31D – A2 Gesamt-QA + Device Simulation

## Ziel

Phase 31D ist keine Inhalts-Erweiterung, sondern eine harte Prüfschicht nach dem vollständigen A2-Ausbau aus Phase 31C.

Geprüft wurde:

- A2-Level verfügbar
- 10 A2-Lektionen vorhanden
- alle 10 A2-Lektionen vollständig ausgebaut
- 43 Aufgaben pro Lektion
- 35 normale Aufgaben pro Lektion
- 8 Sprechaufgaben pro Lektion
- 430 A2-Aufgaben insgesamt
- 350 normale A2-Aufgaben
- 80 A2-Sprechaufgaben
- keine doppelten Task-IDs
- keine fehlenden Pflichtfelder in Aufgaben
- Pflicht-Aufgabentypen pro Lektion vorhanden
- Speaking-Fallback aus Phase 30E weiterhin vorhanden
- Diagnose-Snapshot ergänzt

## Neue Version

- Version: `G54.16`
- Label: `Phase 31D A2 Total QA + Device Simulation`
- Cache: `egt-trainer-g54-16`

## Neue Prüfschnittstelle

```js
LanguageAcademyCourseEntry.phase31dQaSnapshot()
```

Erwarteter Kernstatus:

```js
{
  ok: true,
  phase: '31D',
  level: 'a2',
  uniqueTaskIds: 430,
  duplicateIds: [],
  missingFields: [],
  speakingFallbackReady: true
}
```

## Neue Testdatei

```text
tests_phase31d_a2_total_qa_device_simulation.html
```

Diese Datei führt im Browser eine A2-Gesamtprüfung aus und zeigt Status, Aufgabenanzahl, Speaking-Anteil, Task-Integrität und Geräte-/Browser-Kontext an.

## Coding-Checks

Ausgeführt:

```bash
find js -name '*.js' -print0 | xargs -0 -n1 node --check
node --check service-worker.js
node phase31d_node_snapshot_check.js
python3 phase31d_static_integrity_check.py
```

Ergebnis:

- JS-Syntaxprüfung: PASS
- Service Worker Syntax: PASS
- A2 Snapshot: PASS
- Phase31D QA Snapshot: PASS
- HTML-Link-/Asset-Integrität: PASS

## Snapshot-Ergebnis

```text
A2 lessons: 10
A2 expandedLessons: 10
A2 starterLessons: 0
A2 totalTasks: 430
A2 normalTasks: 350
A2 speakingTasks: 80
uniqueTaskIds: 430
duplicateIds: 0
missingFields: 0
speakingFallbackReady: true
```

## Device-Simulation

Vorgesehene Simulationsprofile:

- Desktop 1440×900
- Desktop 1024×768
- iPhone 15 Pro Max
- iPhone SE
- iPad 11
- iPad 12.9

Die Testdatei `tests_phase31d_a2_total_qa_device_simulation.html` ist für diese Geräteprofile vorbereitet.

## Ehrliche Einschränkung

In der aktuellen Container-Umgebung blockiert Chromium/Playwright die Navigation auf lokale Testseiten mit:

```text
net::ERR_BLOCKED_BY_ADMINISTRATOR
```

Deshalb konnte kein echter Screenshot-Renderlauf über Chromium erzeugt werden. Die Browser-Testdatei wurde aber erstellt, alle JS-/Snapshot-/Integritätschecks wurden ausgeführt und bestanden.

Echte visuelle Prüfung muss auf Zielgerät erfolgen:

- Desktop Chrome/Edge
- iPhone Safari
- iPad Safari
- GitHub Pages HTTPS

## Ergebnis

A2 ist aus Code- und Datenintegritätssicht stabil abgeschlossen. Der nächste sinnvolle Schritt ist Phase 32A: B1-Kursstruktur + Speaking-Struktur parallel.
