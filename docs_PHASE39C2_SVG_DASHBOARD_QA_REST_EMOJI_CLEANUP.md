# Phase 39C.2 – SVG Dashboard Browser QA & Rest-Emoji Cleanup

## Ziel
Phase 39C nachprüfen und konsolidieren: keine Emoji-Fallbacks mehr im Home-/Dashboard-Renderer, Start-/Aktionsbuttons SVG-konform darstellen und eine eigene Browser-QA-Testseite bereitstellen.

## Umgesetzt
- `js/ui-home-renderer.js` vollständig von sichtbaren Emoji-/Dingbat-Fallbacks bereinigt.
- Moduldefinitionen nutzen nun `iconName` statt Emoji-Fallbacks.
- Branch-Definitionen nutzen nun `iconName`.
- Startbutton `Starten 🚀` wurde durch Inline-SVG plus Text ersetzt.
- Dashboard-Homeblock bleibt SVG-only.
- Deep-Sheet-Aktionskarten, Coach-, Login-, Feedback-, Highscore-, Duell- und Python-Menüs verwenden nun SVG-Token.
- Highscore-/Duelle-/Profil-Überschriften wurden auf Inline-SVG umgestellt.
- OCR-/Feedback-Buttons wurden textlich/SVG-konform bereinigt.
- Neue Browser-QA-Testdatei ergänzt:
  - `tests_phase39c2_svg_dashboard_qa.html`

## Testdatei prüft im Browser
- SVG-Anzahl
- sichtbare Emoji-Reste in Icon-Containern
- fehlende Hauptaktionen
- Buttons unter 44px
- horizontalen Overflow

## Geänderte Kern-Dateien
- `js/ui-home-renderer.js`
- `css/ui-foundation.css`
- `js/core/app-config.js`
- `service-worker.js`
- `update-check.json`
- `manifest.json`

## Neue QA-Dateien
- `tests_phase39c2_svg_dashboard_qa.html`
- `phase39c2_static_qa.py`
- `phase39c2_static_qa_result.json`

## QA Ergebnis
- JS Syntaxcheck: bestanden
- JSON Check: bestanden
- Service Worker Asset Check: bestanden
- Static Phase QA: bestanden

## Hinweis
Echter Chromium-Headless-Browsertest ist in der aktuellen Container-Umgebung wegen eines Chromium-Crashpad-Fehlers nicht zuverlässig startbar. Deshalb wurde zusätzlich eine browserinterne Testseite gebaut, die auf echtem Gerät/GitHub Pages direkt prüfbar ist.
