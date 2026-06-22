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
