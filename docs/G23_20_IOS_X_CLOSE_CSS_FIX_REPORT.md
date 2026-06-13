# G23.20 – iOS X-Close CSS Fix

## Problem
Der Schließen-Button meldete „Portal geschlossen“, aber das Portal blieb sichtbar. Ursache war nicht die JS-Funktion, sondern CSS: Eine alte iOS-Scroll-Regel setzte `.egt-admin-modal` unabhängig von `.show` auf `display:block!important`. Dadurch konnte `closeModal()` die Klasse entfernen, aber das Overlay blieb sichtbar.

## Fix
- X oben rechts wiederhergestellt.
- `Schließen`-Tab entfernt.
- Finale CSS-Regel: geschlossen = `display:none`, offen = `.show { display:block }`.
- X nutzt dieselbe `data-admin-close-portal`-Schließfunktion.
- Touch/Pointer/Click-Events bleiben abgesichert.
- Neon-Startseite nicht angefasst.
