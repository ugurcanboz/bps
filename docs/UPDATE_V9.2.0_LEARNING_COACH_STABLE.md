# BPS-Trainer V9.2.0 · Learning Coach Stable

## Ziel
Lokaler, KI-ähnlicher Lerncoach als stabiler Deep-Sheet-Flow ohne externe API-Kosten und ohne erfundene Antworten.

## Neu eingebaut

- Startseiten-Karte **Lerncoach** im WordHub-Grid.
- Aufgabenbezogener Button **KI Coach** im Quiz-Footer.
- Bestehender Mathe-Hilfe-Button wird auf den neuen Coach umgeleitet.
- Coach pausiert im laufenden Test den Timer und setzt ihn beim Schließen fort.
- Eigene Deep-Sheet UI mit Chat-/Frage-Antwort-Prinzip.
- Lokale Wissensdatenbank mit 238 strukturierten Einträgen.
- Themenbereiche: Mathe, Deutsch, Englisch, IT, Kaufmännisch, Soziales.
- No-Hallucination-Regel: Bei keinem Treffer wird ehrlich angezeigt, dass kein passender Eintrag vorhanden ist.
- Ähnliche Themen werden nur als Vorschlag angezeigt, nicht als sichere Antwort behauptet.
- Service Worker Cache auf `bps-trainer-v9-2-0` erhöht.

## Neue Dateien

- `css/learning-coach.css`
- `data/coach-knowledge-base.js`
- `js/learning-coach-engine.js`
- `js/learning-coach-ui.js`

## Geänderte Dateien

- `index.html`
- `service-worker.js`
- `update-check.json`
- `404.html`
- `manifest.json`
- `js/core/app-config.js`
- `js/wordhub-layer.js`

## Verhalten

### Treffer vorhanden
Der Coach zeigt:

- Kurzantwort
- einfache Erklärung
- Merkhilfe
- Schritt-für-Schritt
- Beispiel
- typische Falle
- Quelle

### Kein Treffer
Der Coach sagt ausdrücklich:

> Noch kein passender Eintrag gefunden.

Er erfindet keine Antwort.

### Aktuelle Aufgabe
Wenn der Coach während einer Aufgabe geöffnet wird, nutzt er den aktuellen Aufgabenkontext:

- Aufgabentext
- vorhandene Tipps
- vorhandener Lösungsweg
- Erklärung
- getestetes Konzept

## QA

Durchgeführt:

- Node Syntax Check für alle JS-Dateien: OK
- Service Worker Syntax Check: OK
- Index-Linkprüfung: keine fehlenden lokalen `src`/`href`-Dateien
- Coach Engine Smoke Test:
  - „Prozentrechnung“ → Treffer
  - „DNS einfach“ → Treffer
  - „Kommasetzung“ → Treffer
  - unbekannte Eingabe → kein Treffer / keine erfundene Antwort

## Restrisiko

Nicht im echten Browser gerendert, aber statisch und per JS-Syntax geprüft. Nach GitHub-Pages-Upload unbedingt einmal testen:

- Lerncoach-Karte auf Startseite
- Coach im Quiz öffnen
- Timer pausiert / läuft weiter
- No-result-Verhalten
- Service Worker Cache nach Update löschen oder neue Version laden
