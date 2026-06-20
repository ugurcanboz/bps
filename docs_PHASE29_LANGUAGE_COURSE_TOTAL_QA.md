# Phase 29 · Sprachkurs Gesamt-QA + UI-Fix

## Ziel
Phase 29 ist keine neue Feature-Phase. Sie stabilisiert den aktuellen Sprachkurs-Gesamtstand nach Phase 28.

Geprüft wurden:

- Sprachkurs-Dashboard
- A1 Kursbaum mit 10 Lektionen
- 390 A1 Aufgaben
- Multiple Choice
- Zuordnen
- Lückentext
- Satzbau
- Vokabelkarte
- Richtig/Falsch
- Hörverständnis-Grundlage
- Vokabeltrainer
- Fehlertraining
- KI-Lehrer / Coach v1
- Coach-Empfehlungen
- Cloud-Sync-Grundlage
- Mobile-UI-Regeln

## Eingebaute Korrekturen

### 1. Phase29 QA Snapshot
Neue interne Prüfschnittstelle:

```js
LanguageAcademyCourseEntry.phase29QaSnapshot()
```

Sie meldet:

- Anzahl Niveaus
- Anzahl A1 Lektionen
- Gesamtzahl Aufgaben
- vorhandene Aufgabentypen
- Coach-QA Status
- Cloud-Sync Status
- Hörverständnis-Fundament
- Mikrofon-Sprechstatus

## 2. UI-Feinschliff
Ergänzt wurde ein neuer CSS-Block:

```css
/* Phase 29 · Gesamt-QA/UI-Fix */
```

Schwerpunkte:

- kein harter weißer Sprachkursbereich
- Deep-Sheet scrollt stabil
- Buttons brechen sauber um
- Touch-Flächen bleiben groß genug
- deaktivierte Buttons sind sichtbar erkennbar
- Coach-, Cloud-, Vokabel- und Aufgaben-Karten bleiben im Hauptapp-Design
- iPhone-SE-Layout bekommt engere, aber stabile Abstände

## 3. Funktionsstatus

| Bereich | Status |
|---|---:|
| Sprachkurs öffnen | PASS |
| Dashboard-Struktur | PASS |
| A1 Struktur | PASS |
| Aufgabenarten vorhanden | PASS |
| Multiple Choice Codepfad | PASS |
| Hilfe-Button Codepfad | PASS |
| Vokabeltrainer Codepfad | PASS |
| Fehlertraining Codepfad | PASS |
| Coach-Daten-QA | PASS |
| Cloud-Sync-Grundlage | PASS |
| JS-Syntax | PASS |

## 4. Mikrofon/Sprechfunktion
Die Sprechfunktion ist **noch nicht vollständig integriert**.

Vorhanden ist:

- Hörverständnis-Grundlage
- Audio-Button
- Browser-Speech-Fallback für Ausgabe
- listening_choice Aufgabentyp

Noch nicht vorhanden ist:

- Mikrofonaufnahme
- SpeechRecognition-Adapter
- Aussprachebewertung
- Aufnahmeberechtigung UI
- Sprech-Aufgabentyp
- Datenschutz-/Fallback-Hinweise für Mikrofon

Empfehlung nach Phase 29:

```text
Phase 30 · Sprechfunktion / Mikrofon / Aussprachetrainer v1
```

## 5. Wichtiger QA-Hinweis
In dieser Umgebung ist echte Navigation über `localhost` / `file://` blockiert. Deshalb wurde Phase 29 über Code-, CSS- und Struktur-QA abgesichert. Die echte Geräteabnahme sollte zusätzlich mit Screenshots/Videos von iPhone, iPad und Desktop erfolgen.

## Freigabe
Phase 29 gibt das Sprachkurs-Modul für die nächste große Feature-Phase frei:

```text
Phase 30 · Mikrofon-Sprechfunktion und Aussprachetrainer v1
```
