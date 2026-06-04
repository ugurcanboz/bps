# UI-G2 Door Runtime Fix

## Ziel

Ein übergreifender UI-Fix für alle Kacheln/Türen: keine Einzelfixes pro Kachel.

## Änderungen

- Zentraler Router `js/ui-router.js` neu aufgebaut.
- Keine teuren Hitbox-Scans mehr.
- Kein dauerhaftes Pulse-/Pressing-Klassen-Gefrickel.
- Pointerup führt Aktionen sofort aus, Click wird nur als Fallback genutzt.
- Overlay-/Scroll-System bleibt zentral, aber performanter.
- MutationObserver stark entschärft.
- Kacheln bekommen Performance-Regeln über `css/ui-foundation.css`.
- Schwere Filter/Animationen auf Kacheln wurden deaktiviert.

## Grundregel

Neue Kachel = `data-ui-action` + UI-Klasse.
Dann hängt sie automatisch am Haus/Fundament.
