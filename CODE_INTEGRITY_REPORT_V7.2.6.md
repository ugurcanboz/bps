# V7.2.6 Code Integrity Stable

## Befund
V7.2.5 enthielt mehrere übereinander gestapelte Mobile-Hotfix-Blöcke in `css/mobile.css`. Syntax war formal gültig, aber die Struktur war widersprüchlich und fehleranfällig.

## Fix
- alte späte Mobile-Hotfix-Kette entfernt
- ein einziger konsolidierter Mobile-Layer ergänzt
- Bottom-Menü body-level fixed abgesichert
- Settings/Profile/Cloud-Abstände zentral abgesichert
- unnötiges Zurücksetzen von `mobile-nav-attached` in `renderModes()` entfernt
- Version auf V7.2.6 aktualisiert

## Status
JS-Syntax, JSON und CSS-Klammerbalance geprüft.
