# UI-G3 Door Target Foundation

## Ziel

Kacheln, Schnellzugriff und Trainingsziele hängen am UI-Fundament. Neue Türen funktionieren automatisch über `data-ui-action` und `data-module`.

## Änderungen

- Trainingsbereich um Kaufmännisch ergänzt.
- Modul-Kacheln im Trainingsbereich werden als echte Buttons gerendert.
- Versteckte/dynamische Modulcards laufen nicht mehr über eigene Einzelhandler, sondern über den zentralen Router.
- Schnellzugriff `Üben` öffnet jetzt eine Foundation-konforme Üben-Seite, keine zerschossene Legacy-Zielseite.
- Practice-Ziele werden als `ui-action-card` gerendert und nutzen denselben Router.
- Router verarbeitet `open-module`, `area`, `set-branch`, `scan`, `backup`, `clear-cache`, `clear-progress` zentral.

## Regel

Neue Kachel:

```html
<button type="button" class="ui-action-card" data-ui-action="open-module" data-module="mathe">...</button>
```

Neue Fachrichtung:

```html
<button type="button" data-ui-action="area" data-branch="kaufm" data-module="kaufmRechnen">...</button>
```

Keine neuen Einzelhandler für Kacheln.
