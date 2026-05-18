# V7.4.1 Architecture Stabilized

Diese Version stabilisiert V7.4.1 ohne die UI-Richtung zu verändern.

## Bereinigt

- `css/mobile.css` wurde von zwei gestapelten Mobile-Hotfix-Blöcken auf einen einzigen Mobile-Layer konsolidiert.
- Alte Einzelberichte aus `docs/archive/` wurden in `docs/CHANGELOG_ARCHIVE.md` komprimiert.
- Modul-Registry wurde gehärtet: stabile Modulnamen, `get()`, `list()`, `initAll()` und eingefrorener Kontext.
- Versionsstände wurden auf `7.4.1 / v7410` synchronisiert.

## Fixierter Architekturbaum

- `index.html` = Shell und Startstruktur
- `css/app.css` = Basis/Desktop und Komponenten
- `css/mobile.css` = einziger Mobile-Layer
- `css/ui-lock.css` = Schutzregeln für aktuelle UI
- `js/app.js` = Runtime/Core
- `js/module-registry.js` = Andockpunkt für neue Features
- `modules/` = zukünftige Feature-Module

## Regel für neue Features

Neue Funktionen werden nicht mehr direkt in Layout-/Sticky-/Spacing-Code gepatcht. Sie werden als Modul vorbereitet und erst danach kontrolliert eingebunden.
