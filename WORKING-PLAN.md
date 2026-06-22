# Working Plan – Eignungstest-Trainer G54.39I

Datum: 2026-06-20  
Aktuelle Version: `G54.39I – LOW-/Pixel-Polish nach Visual Observer Report`

## Ausgangspunkt

Phase 39H hat die MEDIUM-Befunde aus dem Visual-Observer-Report behoben. Phase 39I wurde als bewusst kleine, risikoarme Polish-Phase umgesetzt, um die verbleibenden LOW-Befunde abzuschließen.

## Erledigt in Phase 39I

1. **iPhone Header kompakter gemacht**
   - Gate-Topbar auf kleinen Geräten verdichtet
   - Logo, Brand, Subtitle und Mute-Button responsiv normalisiert
   - Mute-Button bleibt mit mindestens 42px gut antippbar

2. **iPad Footer/Branding integriert**
   - Copyright/Branding auf Tablets als dezente Pill dargestellt
   - höhere Sichtbarkeit ohne neue Layoutverschiebung

3. **Performance-Fallbacks ergänzt**
   - `prefers-reduced-motion`
   - `prefers-reduced-transparency`
   - mobile Fallbacks für zentrale `backdrop-filter`-Flächen

4. **Icon-Stabilisierung ergänzt**
   - zentrale Icon-Container auf saubere SVG-/Bild-Ausrichtung normalisiert
   - Fallback-Feld bleibt stabil, ohne Emoji-/Textverschiebung

5. **Versioning / Cache aktualisiert**
   - Build-Version: `G54.39I-2026-06-20`
   - Service Worker: `egt-trainer-g54-39i`
   - neue Phase-39I-Artefakte in Cache-Liste aufgenommen

## Neue Artefakte

- `css/phase39i-pixel-polish.css`
- `tests_phase39i_pixel_polish.html`
- `phase39i_static_qa.py`
- `phase39i_static_qa_result.json`
- `docs/PHASE39I_PIXEL_POLISH_REPORT.md`

## QA

Static-QA: bestanden  
Ergebnisdatei: `phase39i_static_qa_result.json`

Geprüft wurden:

- CSS vorhanden und eingebunden
- Build-Version aktualisiert
- Service Worker aktualisiert
- iPhone-Header-Regeln vorhanden
- Tablet-Footer-Regeln vorhanden
- Performance-Fallbacks vorhanden
- Icon-Stabilisierung vorhanden
- Report/Testseite vorhanden

## Offene Punkte

Keine bekannten HIGH-/MEDIUM-/LOW-Befunde aus Phase 39G offen.

## Nächster sinnvoller Schritt

**Phase 40 – Golden Master QA**

Ziel: echte Endprüfung über mehrere Viewports und App-Bereiche:

- iPhone
- iPad
- Desktop
- Gate/Sperrbildschirm
- Home/Dashboard
- Simulationen
- CTC/FlowLogic
- Admin
- Sprachkurs
- Deep-Sheets
- Touch-Ziele
- Scrollverhalten
- Screenshot-Artefakte


## Phase 41 – GitHub Pages Deploy Check

Status: abgeschlossen.

Änderungen:
- G54.41 Versionierung hergestellt.
- Manifest, AppConfig, Update-Check und Service Worker synchronisiert.
- Deploy-Readiness-QA und Report ergänzt.
- ZIP für GitHub-Pages-Vortest erstellt.

Nächster Schritt: Phase 42 – Live Deploy Device QA.

---

## Phase 42 – Live Deploy Device QA

### Status
Abgeschlossen am 20.06.2026.

### Ziel
Nach Phase 41 wurde die App für die echte Live-Abnahme auf GitHub Pages vorbereitet. Schwerpunkt: iPhone, iPad, Desktop, Service Worker, Manifest, Update-Check und manuelle Geräte-Testmatrix.

### Änderungen
- Version auf `G54.42` aktualisiert.
- `js/core/app-config.js` auf Live Deploy Device QA gesetzt.
- `manifest.json` auf `G54.42` aktualisiert.
- `update-check.json` auf `G54.42-2026-06-20` aktualisiert.
- `service-worker.js` Cache auf `egt-trainer-g54-42` gehoben.
- Phase-42-Artefakte in Service Worker aufgenommen.
- `index.html` Fallback-Version auf `G54.42-2026-06-20` aktualisiert.
- Neue Browser-QA `tests_phase42_live_device_qa.html` ergänzt.
- Neue statische QA `phase42_live_device_qa.py` ergänzt.
- Report `docs/PHASE42_LIVE_DEVICE_QA.md` ergänzt.

### QA Ergebnis
- Datei: `phase42_live_device_qa_result.json`
- Checks: 23
- Bestanden: 23
- Fehler: 0
- Ergebnis: `passed=true`

### Wichtige Grenze
In der Sandbox kann kein echter GitHub-Pages-Liveaufruf auf iPhone/iPad durchgeführt werden. Die ZIP ist deploybereit und enthält die Live-Testseite. Die finale Sichtprüfung muss nach Upload auf der echten URL erfolgen.

### Nächster Schritt
Phase 43 – Release Candidate Freeze & produktive Übergabe.

---

# Phase 43A – Admin Edge Touchpad Scroll Hotfix

## Anlass

Live-Test auf Desktop/Microsoft Edge:

- Scrollbar im Adminportal funktioniert.
- Touchpad-/Wheel-Scroll funktionierte nicht zuverlässig.
- Optik ist sehr gut und durfte nicht verändert werden.

## Ziel

Minimaler Frontend-Hotfix ohne optische Änderungen.

## Geändert

### `js/ui-router.js`

Die Funktion `scrollableInLayer(target)` erkennt jetzt das äußere Admin-Modal `.egt-admin-modal.show` als gültigen Scrollcontainer, wenn dieses tatsächlich scrollbar ist.

## Nicht geändert

- `admin-portal.html`
- `css/admin-portal.css`
- Layout
- Farben
- Buttons
- Admin-Struktur
- Module

## Versionierung

- AppConfig: `G54.42.1`
- Manifest: `G54.42.1`
- Update Check: `G54.42.1-2026-06-20`
- Service Worker Cache: `egt-trainer-g54-42-1`

## QA

- `phase43a_admin_edge_touchpad_scroll_qa.py`
- `phase43a_admin_edge_touchpad_scroll_qa_result.json`
- `tests_phase43a_admin_edge_touchpad_scroll.html`

Static QA: `passed=true`

## Ergebnis

Minimaler Hotfix erstellt. Admin-Optik und Admin-HTML/CSS sind unverändert geblieben.


## Phase 43B · Admin iPhone Portrait Scroll Hotfix
- iPhone Hochformat Tabbar-Überlappung behoben.
- iOS Admin-Modal Touch-Scrolling repariert.
- Keine neuen Features, nur Frontend-Hotfix.
- Version: G54.42.4.


## Phase 43C · iPhone Portrait Visual/Scroll Hotfix

Status: erledigt.

User-Screenshots zeigten zwei iPhone-Hochformat-Probleme:
- Trainingbereich-Karten: linke Icons saßen optisch zu tief und konkurrierten mit Text.
- Kaufmännisches Training-Deep-Sheet: unterer Startbereich war nicht vollständig erreichbar, iOS-Scroll stoppte zu früh.

Fix:
- Nur `css/phase39i-pixel-polish.css` erweitert.
- iPhone-Hochformat-Breakpoint `max-width:560px and orientation:portrait`.
- Karten-Icons absolut links mittig stabilisiert.
- Textabstand links sauber definiert.
- Deep-Sheet auf flex-column umgestellt, `ui-deep-body` scrollt nativ und erhält Bottom-Safe-Area.
- Version auf `G54.42.4`, Cache `egt-trainer-g54-42-4`.

Nicht verändert: Logik, Daten, Module, Desktop/iPad-Layout.


## G54.42.6 · Analyse Legacy-Restpfad Fix

- Bottom-Menüpunkt Analyse öffnet nicht mehr die alte Legacy-Seite `#analysis`.
- Analyse läuft jetzt über das moderne Deep-Sheet-Fundament.
- Keine Aufgabenlogik, keine Trainingslogik, kein Design-Umbau verändert.
- Ziel: iPhone-Hochformat wirkt nicht mehr wie eine unfertige Analyse-Seite ohne Bottom-Menü.

---

## G54.42.7 · Analyse Dashboard V2 Grundstruktur

Status: erledigt.

Ziel: Analyse & Fortschritt als zentrales, filterbares Dashboard vorbereiten, ohne echte Datenadapter oder Prognose-Engine zu riskieren.

Umgesetzt:
- Filter für Bereich, Zeitraum und Ansicht.
- KPI-Karten als Dashboard-Shell.
- Mehrlinien-Chart-Vorschau.
- Stärken-/Schwächen-Balken-Vorschau.
- Coach-Hinweis als kurze Interpretation.
- Mobile-first CSS für iPhone-Hochformat.
- Version und Service Worker auf G54.42.7 synchronisiert.

QA:
- JS-Syntax geprüft.
- Static QA bestanden.

Nächster Schritt: G54.42.9 KPI-Karten + Empty-State.


## G54.42.9 – Analyse Data Adapter

Status: umgesetzt.

- Zentrale Adapter-Datei für Analyse Dashboard V2 erstellt.
- Modulfilter, Zeitraumfilter und Fallback-Verhalten vorbereitet.
- Dashboard V2 nutzt Adapter vor lokalem Fallback.
- Service Worker, Manifest und Update-Check auf G54.42.9 aktualisiert.
- QA-Testseite `tests_phase43g_analysis_data_adapter.html` ergänzt.
- Keine Admin-, Aufgaben- oder Bottom-Menü-Logik verändert.

Nächster Schritt: G54.42.9 KPI-Karten mit echten Adapterwerten und sauberem Empty-State.

## G54.42.9 – KPI-Karten mit echten Adapterwerten + sauberem Empty-State

Status: abgeschlossen.

Umgesetzt:
- KPI-Karten lesen echte Adapterwerte aus `EGTAnalysisDataAdapter`.
- Empty-State für fehlende echte Daten ergänzt.
- Keine scheinexakten Prozentwerte mehr bei leerer Datenbasis.
- Datenquelle-Chip ergänzt.
- Adapter-Payload um `emptyState` und `kpiReady` erweitert.
- Mobile CSS für Empty-State ergänzt.
- Version/Cache auf G54.42.9 aktualisiert.
- QA-Test `tests_phase43h_analysis_kpi_empty_state.html` ergänzt.

Nicht verändert:
- Keine Adminlogik.
- Keine Aufgabenlogik.
- Keine Bottom-Menü-Optik.
- Keine Cloud-/DB-Pflicht.

Nächster Schritt: G54.43.0 Hauptdiagramm mit mehreren Linien.


## G54.43.0 – Hauptdiagramm mit mehreren Linien und echter Legenden-/Datenbindung

Status: umgesetzt.

Änderungen:
- Analyse Data Adapter liefert jetzt `chart.labels` und `chart.series` für bis zu fünf Linien.
- Hauptdiagramm rendert echte adaptergebundene Serien statt fester Offset-Vorschau.
- Legende wird dynamisch aus `chart.series` erzeugt und zeigt bei echten Daten den letzten Wert je Linie.
- Empty-State bleibt erhalten: ohne echte Daten keine scheinexakten KPI-Prozente.
- CSS für fünf Linien, Punkte und X-Achsenlabels ergänzt.
- Version/Cache auf G54.43.0 aktualisiert.

Nicht geändert:
- Keine Adminlogik, keine Aufgabenlogik, keine Bottom-Menü-Optik, keine Prognose-Engine.

QA:
- JS-Syntax für Adapter und UI geprüft.
- Static QA für Multi-Line-Chart und dynamische Legende ergänzt.

Nächster Schritt: G54.43.1 – Stärken-/Schwächen-Balkendiagramm mit echter Datenbindung und Top-Schwächenlogik.

## G54.43.1 – Stärken-/Schwächen-Balkendiagramm mit echter Datenbindung und Top-Schwächenlogik

Status: umgesetzt.

Geändert:
- Analyse Data Adapter berechnet echte Kategorie-Balken aus gespeicherten Ergebnissen, `cats`, `breakdown` und Modul-/Kategorie-Hinweisen.
- Balken enthalten jetzt Trefferanzahl, Datenquelle, Real-/Fallback-Status und Schwächenwert.
- Dashboard zeigt die schwächsten Bereiche zuerst.
- Top-Schwächenbox ergänzt.
- Coach-Hinweis nutzt den schwächsten echten Bereich als Fokus.
- Version/Cache auf G54.43.1 aktualisiert.

QA:
- JS-Syntax bestanden.
- Static QA bestanden.

Nächster Schritt: G54.43.2 – Prognose-Engine mit nachvollziehbarer Berechnung.


## G54.43.2 – Analyse Prognose-Engine

Status: umgesetzt.

Änderungen:
- Erklärbare Prognose-Engine im Analyse Data Adapter ergänzt.
- Risiko-Bereich aus Top-Schwächenlogik berechnet.
- Confidence/Datenbasis abhängig von echten Läufen und echten Kategorien.
- UI-Prognosebox mit Berechnung, Risiko, Trend und Empfehlung ergänzt.
- Vorsichtige Sprache ohne Bestehensgarantie.

QA:
- JS-Syntax geprüft.
- Adapter-Mock-Test mit echten Ergebnisdaten geprüft.
- Static QA bestanden.

Nächster Schritt:
- G54.43.3 – Prognose-Diagramm mit Zielmarke und Trendlinie.


## G54.43.3 – Analyse Prognose-Diagramm

Status: umgesetzt.

Änderungen:
- Forecast-Engine liefert zusätzlich `forecastChart`.
- Prognose-Diagramm zeigt Ist-Leistung, Prognoselinie und Zielmarke.
- Diagramm ist vorsichtig beschriftet und weist darauf hin, dass es keine Bestehensgarantie ist.
- Empty-State bleibt unverändert.

Nicht verändert: Admin, Aufgabenlogik, Bottom-Menü, Cloud/DB.

## G54.43.4 – Analyse Fehleranalyse

Status: abgeschlossen.

Änderungen:
- Fehleranalyse im Analyse Dashboard V2 ergänzt.
- Adapter liefert `errorAnalysis` mit Fehlergruppen, Priorität und Trainingshinweis.
- UI zeigt Priorität hoch/mittel/niedrig, Trefferzahl, Schwerewert und konkrete Trainingshinweise.
- Empty-State bleibt erhalten.
- Version/Cache auf G54.43.4 aktualisiert.

QA:
- JS-Syntax geprüft.
- Static QA bestanden.
- Testdatei `tests_phase43m_analysis_error_groups.html` ergänzt.

Nicht verändert:
- Adminlogik.
- Aufgabenlogik.
- Bottom-Menü-Optik.
- Cloud-/DB-Pflicht.


## G54.43.5 – Analyse Coach-Auswertung

- Coach-Auswertung finalisiert.
- Adapter liefert `coachInsight` aus Prognose, Trend, Top-Schwäche, Top-Stärke, Fehleranalyse und Datenbasis.
- UI zeigt kurze Interpretation, nächsten Trainingsschritt und drei kompakte Hinweise.
- Empty-State bleibt sauber.
- Keine Adminlogik, Aufgabenlogik oder Bottom-Menü-Optik verändert.
- Version/Cache auf G54.43.5 aktualisiert.


## G54.43.6 – Live Visual QA Cockpit

Status: abgeschlossen.

Umgesetzt:

- Neues internes QA-Modul `js/qa/egt-live-visual-qa.js` erstellt.
- Aktivierung über `?qa=visual` oder `#qa-visual`.
- Overlay mit Live-Status, Analyseprüfung und Report-Kopierfunktion eingebaut.
- Analyse-Öffnung über `EGTAnalysisEntryModule`, `EGTUILayer` und DOM-Fallback.
- Checks für Dashboard V2, KPI, Diagramme, Prognose, Fehleranalyse, Coach, Scrollbarkeit, Overflow, Touch Targets und Dock-Overlap ergänzt.
- Version/Cache auf G54.43.6 aktualisiert.
- Statische QA und Syntaxprüfung bestanden.

Nächster sinnvoller Schritt:

- G54.43.7 Screenshot-Recorder: visuelle Zustände systematisch per Screenshot/Report dokumentieren.


## G54.43.8 – Visual Regression / Capture-Diff

Status: umgesetzt.

Ergänzt wurde ein lokales QA-Diff-Cockpit für den Vergleich zweier Visual-State-Captures. Es nutzt die Capture-Exports aus G54.43.7 als Baseline und vergleicht sie mit einem aktuellen Browser-Zustand. Der Modus läuft vollständig clientseitig, ohne Upload und ohne Backend.

Aufruf:

```text
?qa=diff
?qa=visual-diff
#qa-diff
```

Neue Datei:

```text
js/qa/egt-visual-regression-diff.js
```

Global verfügbar:

```js
window.EGTVisualRegressionDiff
```

Prüfschwerpunkte:

- Viewport- und DPR-Abweichungen
- Visual-State-Score-Veränderung
- horizontaler Overflow
- Offscreen-Elemente
- abgeschnittene Elemente
- Touch-Ziele unter 44px
- SVG-/Canvas-Präsenz
- sichtbare Textblöcke
- fehlende/neue wichtige Elemente
- Layout-Shifts und Größenänderungen über Schwellwert

Nächster sinnvoller Schritt: G54.43.9 – Visual Regression Bug Queue / Priorisierte Abarbeitungsliste.

## G54.43.8A – QA Overlay Interaction Hotfix

Status: abgeschlossen.

Auslöser: Live-Test auf iPhone zeigte, dass das QA-Capture-Overlay die App-Fläche, Scrollbewegung und Bottom-Dock-Bedienung blockiert. Zusätzlich wurde der Close-Button als Touch-Ziel unter 44px gemeldet.

Geänderte Dateien:

- `js/qa/egt-visual-state-capture.js`
- `js/qa/egt-live-visual-qa.js`
- `js/qa/egt-visual-regression-diff.js`
- `index.html`
- `404.html`
- `manifest.json`

Fixes:

- QA-Panels auf iPhone oberhalb des Bottom-Docks positioniert.
- Panel-Höhe reduziert, damit App-Bereiche sichtbar und erreichbar bleiben.
- Eigener Scrollbereich innerhalb des QA-Panels mit `-webkit-overflow-scrolling: touch`.
- Close- und Minimize-Buttons auf mindestens 44×44px gebracht.
- Minimieren-Button ergänzt: `−` / `+`.
- Safe-Area für iPhone berücksichtigt.
- QA-Overlay-Buttons werden beim Touch-Target-Capture nicht mehr als App-Fehler gezählt.
- Version auf G54.43.8A aktualisiert.

QA:

- `node --check js/qa/egt-visual-state-capture.js` bestanden.
- `node --check js/qa/egt-live-visual-qa.js` bestanden.
- `node --check js/qa/egt-visual-regression-diff.js` bestanden.

Nächster Test:

- Auf GitHub Pages deployen.
- iPhone öffnen mit `?qa=capture`.
- Prüfen: Bottom-Dock sichtbar/klickbar, App-Scroll nach Schließen/minimiert möglich, QA-Panel intern scrollbar.

## G54.43.8B – iPhone Scroll Hotfix + QA Bubble

Datum: 2026-06-21

Auslöser:
- iPhone-Test nach G54.43.8A zeigte weiterhin schlechtes Scrollverhalten.
- Nutzerfeedback: Analyse und Fortschritt scrollen nicht sauber.
- QA-Capture-Fenster lag weiterhin als zu großes Overlay über der App und erzeugte konkurrierende Scrollbereiche.

Umsetzung:
- Neue CSS-Schicht `css/phase43s-iphone-scroll-qa-bubble.css` ergänzt.
- Neuer Scroll-Guardian `js/modules/iphone-scroll-qa-hotfix.js` ergänzt.
- Visual-State-Capture auf Bubble-Verhalten umgestellt.
- Event-Delegation im Capture-Modul robuster gemacht.
- Capture-Ausführung mit try/finally abgesichert, damit `busy` nicht hängen bleibt.
- Version/Cache/Manifest/Update-Check auf G54.43.8B angehoben.

Fixes:
- Analyse-/Fortschritt-Deep-Sheets erhalten auf Touch-Geräten einen echten internen Scrollbereich.
- Body-/Root-Scrolllock wird nur bei sichtbarem Deep-Sheet aktiv gehalten.
- Legacy-Analysepfad wird vom Scroll-Guardian entsperrt, falls er sichtbar wird.
- QA-Capture startet auf iPhone als kleine `QA` Bubble oberhalb des Docks.
- Das große QA-Panel wird erst nach Tap auf die Bubble geöffnet.
- QA-Panel bleibt oberhalb des Bottom-Docks und hat einen eigenen Scrollbereich.

QA:
- `node --check js/qa/egt-visual-state-capture.js` PASS
- `node --check js/modules/iphone-scroll-qa-hotfix.js` PASS
- `phase43s_static_scroll_qa.py` PASS 15/15

Nächster Test:
- Auf GitHub Pages deployen.
- iPhone Safari öffnen.
- Normal ohne QA: Home → Analyse öffnen → im Analyse-Sheet bis ganz unten scrollen.
- Mehr/Fortschritt öffnen → im Fortschritt-Sheet scrollen.
- Danach `?qa=capture` öffnen: Es muss zuerst nur eine kleine QA-Bubble sichtbar sein.

## G54.43.8C – QA Bubble Interaction Fix

Status: umgesetzt.

Auslöser:
- Nutzer-Test: App ohne QA-Bubble scrollt in Analyse/Fortschritt korrekt und sieht auf iPhone sehr gut aus.
- QA-Bubble öffnet zwar, aber Buttons im QA-Panel reagieren auf iPhone nicht zuverlässig.

Umsetzung:
- Nur `js/qa/egt-visual-state-capture.js` und QA-spezifisches CSS angepasst.
- Normale App-Scrollcontainer aus G54.43.8B nicht erneut verändert.
- iPhone-kompatible Button-Aktivierung über `click`, `pointerup`, `touchend` und direkte Button-Handler ergänzt.
- Event-Isolation gegen globale App-Handler eingebaut.
- Neuer sicherer Fallback `Text anzeigen` ergänzt: vollständiger JSON-Report erscheint in Textarea und kann manuell kopiert werden.
- Version/Cache/Manifest/Update-Check auf G54.43.8C angehoben.

QA:
- JS Syntaxchecks bestanden.
- Statische QA `phase43t_static_qa_bubble_interaction.py`: 12/12 bestanden.
- Browser-Testdatei: `tests_phase43t_qa_bubble_interaction_fix.html`.

Nächster Test:
1. App ohne QA öffnen: Analyse/Fortschritt müssen weiterhin scrollen.
2. Mit `?qa=capture` öffnen.
3. QA-Bubble antippen.
4. `State aufnehmen`, `Text anzeigen`, `JSON kopieren`, `JSON sichern` testen.

Fallback-Plan:
Wenn iPhone/Safari weiterhin Buttons blockiert, G54.43.8D bauen: QA-Bubble öffnet automatisch State + Textarea, sodass keine Buttonfunktion mehr notwendig ist.
