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
