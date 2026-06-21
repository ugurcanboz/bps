# Phase 43B / G54.42.4 – iPhone Portrait Deep-Sheet Scroll Hotfix

## Anlass
Auf iPhone Hochformat konnte das Berufsfeld-/Training-Deep-Sheet nicht zuverlässig bis zum unteren Startbereich weitergescrollt werden.

## Fix
Minimaler CSS-Hotfix in `css/phase39i-pixel-polish.css`:
- nur iPhone Hochformat / Touch-Geräte
- komplettes `.ui-sheet.ui-deep-sheet` übernimmt natives iOS-Scrolling
- `.ui-deep-body` wächst vollständig und blockiert kein inneres Scrollen mehr
- extra Safe-Area-Abstand unter dem unteren Startbereich

## Nicht geändert
- keine Aufgabenlogik
- keine Trainingslogik
- keine Adminlogik
- keine Desktop-/iPad-Regeln
- kein Design-Umbau

## Test
Auf iPhone Hochformat: Kaufmännisches Training öffnen und bis unter den Buttonbereich scrollen.
