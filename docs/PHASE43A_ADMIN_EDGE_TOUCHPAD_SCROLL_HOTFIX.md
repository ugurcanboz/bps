# Phase 43A – Admin Edge Touchpad Scroll Hotfix

## Ziel

Minimaler Hotfix für Microsoft Edge auf Desktop: Im Adminportal funktionierte das Scrollen mit sichtbarer Scrollbar, aber nicht zuverlässig mit Touchpad/Wheel-Geste.

## Ursache

Der globale UI-Layer-Wheel-Guard erkannte im Adminportal teilweise die innere `.egt-admin-panel`-Karte als aktiven Dialog. Der echte vertikale Scrollcontainer ist jedoch die äußere `.egt-admin-modal.show`. Dadurch konnte der Guard Touchpad/Wheel-Events blockieren, obwohl das Adminportal selbst scrollbar war.

## Änderung

Geändert wurde ausschließlich `js/ui-router.js`:

- Wenn ein Wheel-/Touch-Event innerhalb `.egt-admin-modal.show` entsteht,
- und dieses Modal tatsächlich vertikal scrollbar ist,
- wird genau dieses Modal als gültiger Scrollcontainer zurückgegeben.

## Nicht geändert

- `admin-portal.html` unverändert
- `css/admin-portal.css` unverändert
- keine Farben geändert
- keine Abstände geändert
- keine Buttons geändert
- keine Admin-Struktur geändert
- keine Module geändert

## Version

- AppConfig: `G54.42.1`
- Manifest: `G54.42.1`
- Service Worker Cache: `egt-trainer-g54-42-1`
- Update Check: `G54.42.1-2026-06-20`

## QA

Static QA: `phase43a_admin_edge_touchpad_scroll_qa_result.json`

Ergebnis: `passed=true`

Checks:

- Admin-Modal-Wheel-Bypass vorhanden
- Bypass nur bei tatsächlich scrollbarem Modal aktiv
- globaler WheelGuard bleibt erhalten
- globaler TouchMove-Guard bleibt erhalten
- Admin CSS unverändert
- Admin HTML unverändert
- Version/Manifest/Update/Cache aktualisiert

## Live-Test

Nach Upload auf GitHub Pages:

1. Microsoft Edge öffnen
2. App mit Cache-Bypass laden: `Strg + F5`
3. Adminportal öffnen
4. Mit Touchpad zwei Finger nach unten/oben scrollen
5. Prüfen: Scrollbar und Touchpad bewegen denselben Admin-Inhalt

