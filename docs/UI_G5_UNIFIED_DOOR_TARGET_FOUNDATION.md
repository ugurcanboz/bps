# UI-G5 Unified Door Target Foundation

## Zweck

Trainingsbereich und Schnellzugriff laufen über dasselbe Tür-Fundament. Neue Kacheln werden nicht einzeln verdrahtet.

## Regel

Jede funktionale Kachel nutzt:

```html
<button type="button" class="ui-card" data-ui-action="open-module" data-module="mathe">
```

Optional kann eine Fachrichtung gesetzt werden:

```html
<button type="button" class="ui-card" data-ui-action="open-module" data-branch="kaufm" data-module="kaufmRechnen">
```

Der zentrale Router setzt zuerst die Fachrichtung und öffnet danach das Modulziel.

## Bereinigung

Der alte lokale Home-Renderer-Actionhandler wurde entfernt. Alle Türen laufen zentral über `js/ui-router.js`.
