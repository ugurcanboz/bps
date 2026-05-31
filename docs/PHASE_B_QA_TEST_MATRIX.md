# Phase B – QA-Testmatrix für das Coach-Modul

Diese Matrix ist die Pflichtprüfung vor Integration in die Haupt-App.

## 1. Start & Initialisierung

| Test | Erwartung |
|---|---|
| `BPSLearningCoach.init()` einmal aufrufen | Coach startet ohne Fehler |
| `init()` zweimal aufrufen | keine Doppelinitialisierung, kein doppeltes UI |
| `BPSLearningCoach.destroy()` | Events/UI werden sauber entfernt |
| Nach `destroy()` erneut `init()` | Coach startet erneut sauber |

## 2. Speicher & Recovery

| Test | Erwartung |
|---|---|
| leerer `localStorage` | Coach erzeugt frischen Memory-State |
| beschädigtes JSON im Speicher | `repairMemory()` repariert ohne Crash |
| alte Memory-Version | fehlende Felder werden ergänzt |
| sehr lange Listen | Listen werden begrenzt, Performance bleibt stabil |

## 3. Datenbank-DNA

| Test | Erwartung |
|---|---|
| vollständige DNA | `validateTaskDNAContract(task).quality >= 85` |
| fehlende DNA | Coach läuft, aber meldet Warnungen |
| Distractors vorhanden | Fehlerpfad kann direkt gemappt werden |
| keine Distractors | Diagnose fällt auf Heuristik zurück |

## 4. Antwortübergabe aus Haupt-App

| Test | Erwartung |
|---|---|
| `recordAnswer({correct:true,timeMs,...})` | Skill/Mastery steigt |
| falsche Antwort mit Distractor | passender `errorPath` wird erkannt |
| falsche Antwort ohne Distractor | Heuristik greift |
| keine Zeitangabe | Warnung, aber kein Crash |

## 5. Lernintelligenz

| Test | Erwartung |
|---|---|
| 3x schnell richtig | Schwierigkeit/Level steigt |
| 2x falsch | Revanche oder leichtere Aufgabe |
| gleicher Fehler mehrfach | dominanter Denkfehler sichtbar |
| falsche Aufgabe | Spaced Queue bekommt Eintrag |

## 6. Command Center

| Test | Erwartung |
|---|---|
| direkt nach Start | Daten sammeln / keine falschen Versprechen |
| nach mehreren Antworten | Readiness, Mastery, Ampel aktualisiert |
| bei wenig Daten | Status bleibt vorsichtig |
| bei stabilen Daten | Status wird konkreter |

## 7. Offline/PWA

| Test | Erwartung |
|---|---|
| Coach-Dateien im Service Worker | offline verfügbar |
| neue Version | Cache-Name geändert |
| fehlende Bank-Datei | Coach fällt auf Transfer/Knowledge zurück |

## Automatische Mindestprüfung

```bash
node --check js/learning-coach-engine.js
node --check js/learning-coach-ui.js
node --check service-worker.js
node scratch/test-coach-v9-5-7-enterprise-qa.js
```

## 8. Datenbank-DNA Audit

| Test | Erwartung |
|---|---|
| `databaseDNAAudit()` | liefert Gesamtqualität der Bank |
| `dnaReadyPercent < 40` | Integration technisch möglich, aber Lernintelligenz begrenzt |
| `samples` enthält Aufgaben | zeigt konkrete Nachbesserungsstellen |
| Kategoriequalität sichtbar | DNA kann gezielt pro Bereich verbessert werden |

Empfohlener Check:

```js
const audit = BPSLearningCoachEngine.databaseDNAAudit();
console.table(audit.byCategory);
console.log(audit.samples);
```
