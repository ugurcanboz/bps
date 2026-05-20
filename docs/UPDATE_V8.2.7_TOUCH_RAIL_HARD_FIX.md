# V8.3.6 Touch Rail Hard Fix

- Isoliert das obere Kategorieband als echte horizontale Scroll-Rail.
- Erzwingt overflow-x:auto, pan-x und max-content Verhalten.
- Ergänzt iOS Touch-Fallback per touchmove mit scrollLeft.
- Debug zeigt Rail clientWidth/scrollWidth/scrollLeft mit ?sheetdebug=1.
