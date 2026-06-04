# Phase 4 – Aufgabenbank professionalisiert

Ziel: Die Aufgabenbank wird nicht nur geladen, sondern systematisch geprüft und für Coach, Modi und Auswertung nutzbar gemacht.

## Enthalten

- Aufgabenbank-Qualitätsengine (`js/question-bank-quality-engine.js`)
- Harmonisierung von Gruppe, Schwierigkeit, Prüfungsziel und Skill
- Qualitätsprüfung auf IDs, Antwortstruktur, korrekten Index, Erklärung, Tags und Dubletten-Signaturen
- Phase-4-Metadaten (`phase4`) je Aufgabe
- Coach-DNA-relevante Felder (`dna`, `skill`, `expectedTimeMs`, `difficultyLevel`) bleiben im Runtime-Import erhalten
- Admin-Portal zeigt Aufgabenbank-Qualität intern unter App & Roadmap
- Keine Aufgabeninhalte wurden gelöscht

## Aktueller Audit

- Aufgaben gesamt: 517
- Verifiziert durch Phase-4-Prüfung: 517
- Offene Strukturfehler: 0
- Gruppen: Mathe, Logik, IT/FISI, Allgemeinwissen
- Schwierigkeit: easy / medium / hard
- Prüfungsziele: BPS / CTC

## Wichtig

Phase 4 verändert keine Nutzeroberfläche unnötig. Die Qualitätsdaten bleiben im Adminbereich und dienen als Basis für spätere Aufgabenimporte, OCR-Prüfung und bessere Coach-Auswertung.
