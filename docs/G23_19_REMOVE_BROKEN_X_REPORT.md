# G23.19 – Broken X entfernt

## Grund
Der X-Button reagierte auf iPad/iOS trotz mehrfacher Handler nicht zuverlässig. Deshalb wurde er nicht weiter überschrieben, sondern aus dem aktiven Portal-Header entfernt.

## Änderung
- `egt-admin-close` / `data-fb-close` aus dem Admin-Portal entfernt.
- Alte X-Hitbox-/Touch-CSS-Regeln entfernt.
- Neuer normaler Button `Schließen` in der Portal-Menüleiste ergänzt.
- Logout bleibt daneben als roter Rollen-Logout sichtbar, sobald Admin/Dozent eingeloggt ist.
- `closeModal()` bleibt intern erhalten und wird vom neuen Schließen-Button, Escape und Backdrop genutzt.

## Ziel
Kein funktionsloses Element mehr im UI. Schließen läuft über den gleichen Button-/Tab-Mechanismus wie die funktionierenden Portal-Menüs.
