# Phase 38D.8 – B2 visuelle Endprüfung / Geräte-Simulation / Deployment-Check

Status: abgeschlossen.

## Ziel

Phase 38D.8 prüft die B2-Academy-Hardmode-Prüfung nicht erneut fachlich, sondern visuell und deploymentnah:

- Desktop-, iPad- und iPhone-Viewport,
- Prüfungsfenster und Scrollverhalten,
- Kontraste im dunklen Hardmode,
- Touch-Ziele und Buttons,
- 5-Teil-Navigation,
- Ergebnisbericht mit Tabelle,
- GitHub-Pages-Root-Struktur,
- Service-Worker-Cache und Update-Metadaten.

## Änderungen

### `js/modules/language-exam-shell.js`

- Version auf `G54.38D.8-b2-visual-deploy-qa-shell` gesetzt.
- Storage-Key auf `language-academy-exam-shell-session-v19-b2-visual-deploy-qa` erhöht.
- Shell-Diagnostics auf Phase `38D.8` gesetzt.
- Hardmode-Shell-Datenattribute auf `phase38d8` aktualisiert.
- Ergebnisbericht-Tabelle in `.la-exam-table-scroll` gewrappt, damit sie auf iPhone/iPad nicht die ganze Ansicht horizontal sprengt.
- Ergebnisbericht-Kicker auf Phase 38D.8 aktualisiert.

### `css/language-course.css`

Neue Phase-38D.8-CSS-Schicht ergänzt:

- 5-Teil-Navigation auf Desktop sauber als 5-Spalten-Raster.
- iPad/tablet: 3-Spalten-Raster.
- iPhone: einspaltige, gut antippbare Teilnavigation.
- Mindesthöhe für Touch-Ziele gesichert.
- Ergebnisbericht-Tabelle horizontal kontrolliert scrollbar gemacht.
- Programmatic-Scroll-Guard ergänzt, damit Ergebnisbereich bei Sticky-Header nicht verdeckt startet.
- Karten, Ergebnisbericht, Fragen und Buttons gegen horizontales Überlaufen abgesichert.
- B2-Level-Karten mit mehreren Difficulty-Zeilen stabilisiert.

### `service-worker.js`

- Cache-Name auf `egt-g54-38d8` gesetzt.
- Phase-38D.8-Dokumentation, Testdatei und QA-Runner in Assetliste aufgenommen.

### `update-check.json`

- Version auf `G54.38D.8-b2-visual-deploy-qa` gesetzt.
- Phase auf `38D.8` gesetzt.
- Cache auf `egt-g54-38d8` gesetzt.

## Browser-/Geräte-Simulation

Ausgeführt mit Chromium Headless über Playwright/DevTools gegen lokalen HTTP-Server.

Geprüfte Viewports:

| Gerät | Viewport | Ergebnis |
|---|---:|---|
| Desktop | 1440 × 900 | bestanden |
| iPad | 820 × 1180 | bestanden |
| iPhone | 390 × 844 | bestanden |

Pro Gerät geprüft:

- App lädt.
- `LanguageExamShell` ist vorhanden.
- `LanguageExamEngine` ist vorhanden.
- Academy-Hardmode öffnet.
- B2-Prüfung startet.
- 5 Prüfungsteile sind sichtbar.
- Touch-Ziele erfüllen Mindestgröße.
- Kein horizontales Seitenüberlaufen.
- Ergebnisbericht ist sichtbar.
- Ergebnisbericht-Tabelle ist kontrolliert scrollbar.
- Diagnostics melden Phase 38D.8.
- Kontrast-Stichproben bestehen.

## Messwerte

Aus `phase38d8_visual_deploy_qa_result.json`:

- Desktop Reading Overflow: `0 / 0`
- Desktop Final Overflow: `0 / 0`
- iPad Reading Overflow: `0 / 0`
- iPad Final Overflow: `0 / 0`
- iPhone Reading Overflow: `0 / 0`
- iPhone Final Overflow: `0 / 0`
- Kontrast-Stichproben: ca. `19.28:1`
- Touch-Ziele: bestanden
- Ergebnisbericht-Tabelle: gewrappt und scrollbar

## Screenshots

Erzeugt in:

```text
qa_phase38d8_screenshots/desktop-1440x900-b2-final.png
qa_phase38d8_screenshots/ipad-820x1180-b2-final.png
qa_phase38d8_screenshots/iphone-390x844-b2-final.png
```

## Statischer Deployment-Check

Geprüft:

- `index.html` liegt im Root.
- `404.html` liegt im Root.
- `update-check.json` ist gültig und meldet Phase 38D.8.
- `service-worker.js` nutzt Cache `egt-g54-38d8`.
- Phase-38D.8-Dateien sind im Service-Worker eingetragen.
- Keine Deployment-Blocker durch fehlende Root-Dateien erkannt.

## Ergebnis

Phase 38D.8 ist bestanden.

B2 ist damit nach fachlicher Endsimulation aus Phase 38D.7 zusätzlich visuell und deploymentnah geprüft.

Wichtig: Das ist eine interne App-Qualitätsfreigabe und keine offizielle Zertifizierung oder Prüfungsfreigabe.
