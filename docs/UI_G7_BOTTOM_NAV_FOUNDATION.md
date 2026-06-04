# UI-G7 Bottom Navigation Foundation

Ziel: Bottom Navbar als eigenständiges, zentrales UI-Fundament absichern.

## Fix

- Eigene Foundation-Datei `css/ui-nav-foundation.css`, geladen nach `ui-foundation.css`.
- Bottom-Nav nutzt stabile SVG-Assets als `<img>` statt inline SVG, damit alte CSS-Regeln die Icons nicht unsichtbar machen.
- `#uiTabBar` ist die einzige aktive Bottom-Dock-Quelle.
- Tabs sind echte `button type="button"` Elemente.
- Icons, Labels, Hitboxen und Safe-Area werden zentral definiert.

## Grundsatz

Neue Tabs oder Änderungen an der Bottom Navbar dürfen nur über `renderTabBar()` und `ui-nav-foundation.css` erfolgen.
