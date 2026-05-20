# Update V8.2.4 Universal Sheet Layout

Schwerpunkt: universelle Deep-Sheet-Darstellung für Desktop, Tablet, Mobile, Hochformat und Querformat.

## Änderungen
- Geräteerkennung nicht mehr modellbasiert, sondern nach Viewport, Touch, Höhe und Orientierung.
- iPhone-/Android-Querformat wird nicht mehr fälschlich als Desktop behandelt.
- Background-Scroll-Lock über Body-Fixierung ergänzt.
- Sheet-Scroll bleibt im eigenen Body aktiv.
- Mobile Portrait kompakter skaliert.
- Mobile Landscape / kleine Höhe erhält Compact-Modus.
- Header, Karten und Footer kompakter für niedrige Viewports.
- Debug bleibt optional über `?sheetdebug=1`.

## Kontrolle
- Deep-Sheet-Modul: Syntax OK.
- CSS Single Source of Truth: clean-deepsheet.css V8.2.4.
- ZIP-Test erforderlich nach Build.
