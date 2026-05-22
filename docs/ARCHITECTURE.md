# Eignungstest-Trainer V7.5.0 · Production Feature-Ready Stable

Diese Version ist die bereinigte Arbeitsbasis für weitere Features.

## Feste Schichten

1. **Core**: State, Events, Router, Architecture Guard.
2. **Components**: UI-Bausteine und spätere wiederverwendbare Komponenten.
3. **Modules**: neue Features in `modules/` bzw. `js/modules/`.
4. **UI Lock**: geschützte Mobile-/Desktop-Oberfläche.

## Regel für neue Features

Neue Funktionen werden nicht mehr direkt in Layout-/Sticky-/Spacing-Code gepatcht. Sie werden als Modul vorbereitet und dann über Core/Event/State angebunden.

## Temporär aktiv

Der Cache-Control-Guard bleibt aktiv, damit GitHub Pages keine alten Dateien ausliefert. Später kann `window.TRAINER_CACHE_KILL_SWITCH = false` gesetzt werden.
