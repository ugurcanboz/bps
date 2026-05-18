# UI Contract

Die UI ist ab V7.4.1 gesperrt.

## Geschützte Bereiche
- Mobile Bottom-Menü
- Top-Navigation
- Premium Dashboard
- Settings Layout
- Kartenabstände
- Desktop Container

## Erlaubt
- neue Feature-Komponenten innerhalb bestehender Sections
- eigene Modulklassen mit Prefix
- lokale Styles innerhalb eines Moduls

## Nicht erlaubt
- globale Button/Card-Overrides
- neue `position:fixed` Regeln ohne Prüfung
- Änderung am Breakpoint `900px` ohne bewussten UI-Rebuild
