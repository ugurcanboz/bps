# G23.18 iOS Hard-Close Fix

## Ziel
Der X-Button im Admin-/Dozentenportal musste auf iPad/iOS nicht nur größer sein, sondern wirklich einen robusten Close-Controller besitzen.

## Fix
- Close-Button mit `type="button"` und `data-admin-close-hard` versehen.
- `closeModal(e)` akzeptiert Events und entfernt Sheet-Lock zusätzlich defensiv.
- Close-Handler auf `click`, `pointerdown`, `pointerup`, `touchstart`, `touchend`, `mousedown`, `mouseup` gelegt.
- Handler hängt direkt am Button, am Modal und dokumentweit im Capture-Modus.
- iOS-Pseudo-Hitbox blockiert keine Pointer-Events mehr.
- `window.EGTAdminPortal.close` exportiert.

## Nicht geändert
- Neon-Startseite
- Teilnehmerprofile
- Balkenansicht
- Admin-/Dozenten-Dashboard-Inhalte
