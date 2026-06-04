# UI-G Foundation Standard

Dieses Projekt nutzt ab diesem Stand nur noch ein zentrales UI-Fundament.

## Zentrale Dateien

- `css/ui-foundation.css` — Design Tokens, Buttons, Cards, Icons, Bottom-Navigation, Overlays und Scrollverhalten.
- `js/ui-router.js` — zentrale Actions für Kacheln, Buttons und Navigation.
- `js/ui-home-renderer.js` — rendert die Startseite anhand der Foundation-Klassen.

## Regel

Neue UI darf keine eigene Designsprache bauen.

Neue Kachel:

```html
<button class="ui-card" data-ui-action="...">...</button>
```

Neues Overlay:

```html
<div class="ui-sheet-backdrop">
  <section class="ui-sheet" role="dialog">...</section>
</div>
```

Neue Buttons nutzen bestehende Foundation-Klassen. Änderungen am Look passieren im Fundament, nicht in Einzelseiten.
