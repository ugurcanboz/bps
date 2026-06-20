# SCHICHTÜBERGABE · Phase 43B Admin iPhone Portrait Scroll Hotfix

## Ausgangslage
Auf iPhone Hochformat sah die Admin-Tab-Leiste überlappt aus: Dashboard/Teilnehmer/Gruppen/Admin Logout lagen visuell ineinander. Zusätzlich funktionierte iPhone-Touch-Scrolling im Adminportal nicht zuverlässig.

## Ziel
Minimaler Frontend-Hotfix, ohne neue Features und ohne Admin-Optik grundsätzlich umzubauen.

## Änderungen
- `css/admin-portal.css`: am Ende einen streng begrenzten Hotfixblock ergänzt.
  - iPhone Hochformat: `.egt-portal-tab-group` darf nicht mehr schrumpfen.
  - Logout-Tab verliert auf iPhone Hochformat `margin-left:auto`, damit er nicht über andere Tabs rutscht.
  - Tabbar bleibt horizontal scrollbar.
  - Admin-Modal erzwingt natives iOS-Scrollen mit `overflow-y: scroll` und `-webkit-overflow-scrolling: touch`.
- `js/ui-router.js`: Body-Layer-Lock setzt `touchAction` nicht mehr hart auf `none`, sondern auf `pan-y`, damit das Admin-Modal auf iOS scrollen darf.
- Version aktualisiert auf `G54.42.2`.
- Service Worker Cache aktualisiert auf `egt-trainer-g54-42-2`.
- QA-Seite ergänzt: `tests_phase43b_admin_iphone_portrait_scroll_tabs.html`.

## Nicht verändert
- Keine Module umgebaut.
- Keine Admin-Datenlogik verändert.
- Kein Login/Code/Teilnehmer/Export verändert.
- Keine neue Funktion eingebaut.

## Testpflicht nach Deploy
1. iPhone Safari Hochformat öffnen.
2. Cache hart erneuern bzw. PWA neu laden.
3. Adminportal öffnen.
4. Vertikal im Dashboard wischen: Inhalt muss scrollen.
5. Tabbar horizontal wischen: Tabs dürfen nicht überlappen.
6. Admin Logout darf nicht über Gruppen/Teilnehmer liegen.
