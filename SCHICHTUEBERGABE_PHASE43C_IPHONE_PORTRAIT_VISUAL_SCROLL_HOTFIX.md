# Schichtübergabe · Phase 43C iPhone Portrait Visual/Scroll Hotfix

## Ausgangslage
User hat echte iPhone-Hochformat-Screenshots geliefert.

Sichtbare Probleme:
- Startseite: Training-Bereich-Karten hatten links Icons, die im Hochformat optisch zu tief saßen und mit Text konkurrierten.
- Training-Deep-Sheet: Beim kaufmännischen Training war der untere Startbereich sichtbar, aber nicht vollständig erreichbar; iOS-Scroll stoppte zu früh.

## Fix-Scope
Minimaler Frontend-Hotfix ohne Daten-, Logik- oder Desktop-Umbau.

## Geändert
- `css/phase39i-pixel-polish.css`
  - neuer Block `G54.42.3 · iPhone Portrait Visual/Scroll Hotfix`
  - nur `@media (max-width: 560px) and (orientation: portrait)`
  - Training-Karten: Icon absolut links mittig fixiert, Textabstand stabilisiert, Pfeil vertikal mittig gesetzt
  - Deep-Sheet: iPhone-Hochformat als flexibler Sheet-Container, Body scrollt nativ mit `-webkit-overflow-scrolling: touch`, Bottom-Safe-Area ergänzt
- `js/core/app-config.js`
  - Version auf `G54.42.3`
- `manifest.json`
  - Version auf `G54.42.3`
- `update-check.json`
  - Version/Cache auf `G54.42.3`
- `service-worker.js`
  - Cache auf `egt-trainer-g54-42-3`
- `tests_phase43c_iphone_portrait_visual_scroll.html`
  - Static QA ergänzt

## Nicht geändert
- keine Admin-Logik
- keine Teilnehmer-/Gruppen-/Code-Logik
- keine Training-Daten
- keine Modulstruktur
- kein Desktop-/iPad-Umbau

## Testfokus nach Upload
1. iPhone Safari Hochformat öffnen.
2. Strg+F5 gibt es auf iPhone nicht: Safari Tab schließen, Seite neu öffnen, bei PWA App komplett schließen und neu starten.
3. Startseite → Trainingbereich wählen: Icons müssen links mittig sitzen und nicht mehr in Text laufen.
4. Kaufmännisch öffnen.
5. Im Deep-Sheet bis unten scrollen.
6. `Training starten` muss vollständig erreichbar und antippbar sein.
