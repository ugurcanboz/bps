# V7.4.1 Component & State Architecture Foundation

Basis: V7.4.1 Component-State Foundation Stable.

Ziel: Die funktionierende UI bleibt fix. Neue Features werden über Core-Adapter, Components und Module ergänzt.

## Neue Schichten

- `js/core/event-bus.js` – zentrales Event-System
- `js/core/state-manager.js` – kleiner zentraler UI-/Feature-State
- `js/core/router.js` – Hash-Router-Adapter für neue Module
- `js/components/component-registry.js` – wiederverwendbare UI-Bausteine
- `js/modules/module-loader.js` – Feature-Module registrieren und initialisieren

## Wichtig

Die alte App-Logik in `js/app.js` wurde nicht ersetzt. V7.4.1 ist ein stabiler Foundation-Layer über V7.4.1, damit spätere Features sauber andocken können.
