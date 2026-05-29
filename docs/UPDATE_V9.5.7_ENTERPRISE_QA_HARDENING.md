# Update V9.5.7 – Enterprise QA Hardening

Ziel dieses Updates ist nicht Feature-Erweiterung, sondern Unternehmensqualität: Das Coach-Modul soll vor der späteren Integration in die Haupt-App belastbarer, überprüfbarer und fehlertoleranter werden.

## Eingebaut

### 1. QA Self Check
Neue Engine-Funktion:

```js
BPSLearningCoachEngine.qaSelfCheck()
```

Prüft automatisch:

- Memory-Reparatur
- Memory-Gesundheit
- Aufgabenbank-Verfügbarkeit
- DNA-Vertragsqualität einer Beispielaufgabe
- `recordAnswer`-/Memory-Payload-Struktur
- Session-Start
- Command-Center-Bereitschaft
- Prüfungsampel-Bereitschaft

### 2. Memory Repair
Neue Engine-Funktion:

```js
BPSLearningCoachEngine.repairMemory()
```

Fängt beschädigte `localStorage`-Daten ab, repariert fehlende Felder, begrenzt zu große Verlaufslisten und verhindert Abstürze durch kaputtes JSON.

### 3. Memory Health Report
Neue Engine-Funktion:

```js
BPSLearningCoachEngine.memoryHealthReport()
```

Meldet, ob zentrale Speicherbereiche vorhanden und strukturell korrekt sind.

### 4. DNA Contract Validator
Neue Engine-Funktion:

```js
BPSLearningCoachEngine.validateTaskDNAContract(task)
```

Prüft, ob eine Aufgabe die nötige Datenbank-DNA besitzt:

- `id`
- `category`
- `subtype`
- `difficulty`
- `skill`
- `expectedTimeMs`
- `trap`
- `examTarget`
- `distractors` optional, aber stark empfohlen

Gibt zusätzlich einen Qualitätswert von 0–100 aus.

### 5. RecordAnswer Payload Validator
Neue Engine-Funktion:

```js
BPSLearningCoachEngine.validateRecordAnswerPayload(payload, task)
```

Prüft, ob die spätere Haupt-App dem Coach genug Informationen übergibt, damit Lernintelligenz, Fehlerdiagnose und Revanche wirklich funktionieren.

### 6. UI QA Hooks
Neue UI-Funktionen:

```js
BPSLearningCoach.qaSelfCheck()
BPSLearningCoach.repairMemory()
```

Damit kann später auch über die UI/API geprüft werden, ob der Coach gesund ist.

## Neuer Test

```bash
node scratch/test-coach-v9-5-7-enterprise-qa.js
```

Prüft:

- Version
- DNA-Vertrag
- Payload-Vertrag
- QA Self Check
- beschädigtes localStorage
- Memory Repair
- Session-Start nach Reparatur

## Qualitätsziel

V9.5.7 soll sicherstellen, dass spätere Integration nicht blind erfolgt. Der Coach kann jetzt selbst melden, ob sein Speicher, seine API-Inputs und die Aufgaben-DNA stark genug sind.

### 7. Datenbank-DNA Audit
Neue Engine-Funktion:

```js
BPSLearningCoachEngine.databaseDNAAudit(limit)
```

Erstellt einen Qualitätsbericht über die vorhandene Aufgabenbank:

- Gesamtzahl Aufgaben
- DNA-ready Aufgaben
- schwache Aufgaben
- fehlende DNA
- Durchschnittsqualität
- Qualität pro Kategorie
- Beispielaufgaben mit Nachbesserungsbedarf

Dieser Audit ist wichtig, weil der Coach nur dann hochpräzise arbeitet, wenn die Aufgabenbank sauber getaggt ist.

Statuswerte:

- `integrationsstark` = hoher DNA-Reifegrad
- `teilbereit` = nutzbar, aber Lernintelligenz begrenzt
- `dna_nachziehen` = Integration möglich, aber Coach wird noch grob arbeiten
