# V7.2.5 Mobile Sticky Restore

Fix-Ziel: Mobile Bottom Navigation muss auf Handy dauerhaft unten fixiert bleiben.

Änderungen:
- finaler CSS-Hard-Override am Ende von `css/mobile.css`
- `#appNav` wird bei max-width 900px immer `position: fixed`
- funktioniert auch, wenn JS kurzzeitig noch `desktop-app-nav` gesetzt hat
- `body` bekommt mehr `padding-bottom`, damit Inhalte nicht hinter dem Menü verschwinden
- Version auf V7.2.5 erhöht

Hinweis:
Der Cache-Kill-Switch bleibt weiterhin temporär aktiv.
