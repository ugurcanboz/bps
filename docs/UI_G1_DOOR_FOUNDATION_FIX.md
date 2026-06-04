# UI-G1 Door Foundation Fix

Grundsatz: Das UI-Fundament ist das Haus, jede Kachel ist nur eine Tür im Haus.

Neue Kacheln/Buttons müssen nur noch diese Basis erfüllen:

```html
<button type="button" class="ui-card" data-ui-action="open-module" data-module="mathe">...</button>
```

Dann übernimmt das Fundament automatisch:
- vollständige Tap-/Click-Fläche
- iPad/iPhone/Desktop-Verhalten
- visuelles Press-Feedback
- zentralen Router
- Overlay-/Scroll-Lock
- Background-Sperre bei offenen Sheets/Modals/Coach-Panels

Technische Entscheidung:
- keine Hitbox-Scans mehr
- keine parallelen Touch-Fallbacks
- kein `elementFromPoint` als Hauptlogik
- eine zentrale Click-Route über `js/ui-router.js`
- eine globale Overlay-/Scroll-Foundation im selben Router
