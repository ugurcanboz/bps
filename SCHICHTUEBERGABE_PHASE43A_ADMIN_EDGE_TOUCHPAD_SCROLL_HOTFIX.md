# Schichtübergabe – Phase 43A Admin Edge Touchpad Scroll Hotfix

Aktueller ZIP-Stand:
`Eignungstest-Trainer-G54.42.1-Admin-Edge-Touchpad-Scroll-Hotfix.zip`

## Kontext

User hat auf Desktop in Microsoft Edge getestet:

- Adminportal sieht optisch sehr gut aus.
- Scrollen über sichtbare Scrollbar funktioniert.
- Scrollen mit Touchpad funktioniert nicht zuverlässig.

## Wichtig

Der User wollte ausdrücklich keine optischen Änderungen und keine Strukturänderungen.

## Umgesetzter Fix

Datei geändert:

- `js/ui-router.js`

In `scrollableInLayer(target)` wurde vor der normalen Dialog-Erkennung ein Admin-spezifischer Scrollcontainer-Bypass ergänzt:

- Wenn Event-Ziel innerhalb `.egt-admin-modal.show` liegt,
- und das Modal tatsächlich scrollbar ist,
- wird `.egt-admin-modal.show` als Scrollcontainer zurückgegeben.

Damit blockiert der globale WheelGuard die Edge-Touchpad-Geste nicht mehr.

## Nicht geändert

- `admin-portal.html`
- `css/admin-portal.css`
- Optik
- Buttons
- Layout
- Admin-Struktur

## Versionierung

- Version: `G54.42.1`
- Cache: `egt-trainer-g54-42-1`
- Update-Check: `G54.42.1-2026-06-20`

## QA

- `phase43a_admin_edge_touchpad_scroll_qa.py`
- `phase43a_admin_edge_touchpad_scroll_qa_result.json`
- `tests_phase43a_admin_edge_touchpad_scroll.html`

Ergebnis: `passed=true`

## Nächster Test

Live auf GitHub Pages mit Microsoft Edge:

1. Strg + F5
2. Adminportal öffnen
3. Touchpad-Scroll testen
4. Wenn funktioniert: Adminportal für Edge freigeben
5. Wenn nicht: prüfen, ob Edge noch alten Service Worker/Cache verwendet
