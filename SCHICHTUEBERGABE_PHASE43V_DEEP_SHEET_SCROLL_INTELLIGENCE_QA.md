# Schichtübergabe – Phase 43V / G54.43.8E

## Titel
Deep-Sheet Scroll Intelligence für QA

## Ausgangslage
Die QA-Bubble funktioniert in G54.43.8D und bleibt über Analyse-/Fortschritt-Deep-Sheets sichtbar. Der Nutzer konnte JSON-Captures aus dem Analyse-Deep-Sheet liefern. Dabei wurde sichtbar: Das normale Dokument scrollt bei offenen Deep-Sheets nicht, was korrekt ist, aber die QA hat den eigentlichen Deep-Sheet-Innen-Scroller bisher nicht präzise gemessen.

## Ziel
Die QA-Bubble soll bei offenen Deep-Sheets selbstständig erkennen:

- welches Deep-Sheet aktiv ist,
- welcher Kontext aktiv ist, z. B. Analyse/Fortschritt,
- welcher Container der echte Scrollcontainer ist,
- ob vertikales Scrollen möglich ist,
- aktuelle Scrollposition, Max-Scroll und Rest bis unten,
- ob der Sheet-/Scrollbereich mit dem Bottom-Dock überlappt,
- ob die QA-Bubble das aktive Sheet überdeckt.

## Geänderte Dateien

- `js/qa/egt-visual-state-capture.js`
  - Version auf `G54.43.8E` gesetzt.
  - `detectActiveContext()` ergänzt.
  - `collectDeepSheetIntelligence()` ergänzt.
  - `findDeepSheetScrollCandidates()` ergänzt.
  - `scrollSnapshot()` ergänzt.
  - `collectDockOverlap()` ergänzt.
  - JSON-Export enthält jetzt `deepSheet`.
  - Render-Ausgabe zeigt eine kompakte `DEEP-SHEET Scroll-Analyse`.
  - Scoring bewertet fehlende/verdächtige Scrollcontainer.

- `index.html`, `404.html`, `manifest.json`, `service-worker.js`
  - Version/Cache auf `G54.43.8E-2026-06-22` aktualisiert.

- `tests_phase43v_deep_sheet_scroll_intelligence.html`
  - Statische QA für Deep-Sheet-Intelligence ergänzt.

## Was nicht geändert wurde

- Normales Analyse-/Fortschritt-Scrollverhalten wurde nicht erneut angefasst.
- Layout der App wurde nicht kosmetisch verändert.
- QA-Bubble Always-On-Top aus G54.43.8D bleibt bestehen.

## Ergebnis
Statische Prüfung bestanden:

- Version G54.43.8E vorhanden
- Deep-Sheet-Kontext-Erkennung vorhanden
- Primary-Scrollcontainer-Erkennung vorhanden
- Scrollwerte `scrollTop`, `maxScrollY`, `bottomGap`, `atBottom` vorhanden
- Dock-Overlap-Prüfung vorhanden
- QA-Overlay-vs-Sheet-Overlap vorhanden
- `deepSheet` wird im JSON-Capture exportiert
- Render-Ausgabe zeigt Deep-Sheet-Zusammenfassung

## Testanleitung für den nächsten Chat / Nutzer

1. App auf GitHub Pages hochladen.
2. Öffnen mit `?qa=capture`.
3. Analyse öffnen.
4. Innerhalb Analyse etwas scrollen.
5. QA-Bubble öffnen.
6. `State aufnehmen` drücken.
7. `Text anzeigen` drücken.
8. JSON in den Chat kopieren.

Erwartet wird im JSON ein neuer Block:

```json
"deepSheet": {
  "active": true,
  "context": { ... },
  "primaryScrollContainer": { ... },
  "scrollSummary": { ... },
  "dockOverlap": { ... },
  "qaOverlay": { ... }
}
```

Besonders wichtig sind:

- `deepSheet.active`
- `deepSheet.context.sheetTitle`
- `deepSheet.primaryScrollContainer.selector`
- `deepSheet.scrollSummary.canScrollY`
- `deepSheet.scrollSummary.scrollTop`
- `deepSheet.scrollSummary.maxScrollY`
- `deepSheet.scrollSummary.bottomGap`
- `deepSheet.dockOverlap.overlapsDock`

## Nächster sinnvoller Schritt
Nach echten iPhone-Captures aus Analyse und Fortschritt entscheiden:

- Wenn `canScrollY: true` und `bottomGap` plausibel ist: QA gilt als erfolgreich.
- Wenn `overlapsDock: true`: kleiner Dock-Abstands-/Padding-Fix nur für Deep-Sheet-Inhalt.
- Wenn kein Scrollcontainer erkannt wird: gezielter Selector-Fix für das jeweilige Sheet.
