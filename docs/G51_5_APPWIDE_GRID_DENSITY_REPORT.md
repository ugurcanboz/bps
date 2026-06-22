# G51.5 – Appwide Grid Density / Visual Audit Fix

## Anlass

Nach G51.4 waren Button-Hitboxen verbessert, aber in der echten Auswertung klebten Kategorie-Kacheln weiterhin optisch zu eng beieinander. Zusätzlich sollten Highscore, Duell, Admin/Dozent, Dashboard und Simulation nicht nur punktuell, sondern über ein gemeinsames Kachel-/Grid-Abstandssystem stabilisiert werden.

## Änderung

Neue additive CSS-Datei:

- `css/ui-density-grid-polish.css`

Diese Datei wird nach `css/ui-spacing-polish.css` geladen und ist der neue letzte UI-Override-Layer für sichtbare Abstände.

## Umgesetzte Regeln

- Gemeinsame Grid-Gaps für Statistik-, Analyse-, Home-, Deep-Sheet-, Highscore-, Duell-, Admin- und Simulation-Raster.
- Ergebnisbildschirm gezielt repariert:
  - `#categoryStats.statsgrid` nutzt größere Kachelabstände.
  - Ergebnis-Stat-Karten erhalten Mindesthöhe, Innenabstand und klare Texttrennung.
  - Aktionsbuttons unten im Ergebnis laufen über ein gleichmäßiges Auto-Grid.
  - Prognosekarte und Tipps stehen nicht mehr optisch zu nah an den Kategorien.
- Sichtbarkeits-Sicherheit ergänzt:
  - `.hidden` darf durch neue Layout-Regeln niemals überstimmt werden.
  - `#result.hidden`, `#quiz.hidden`, `#analysis.hidden` usw. bleiben garantiert unsichtbar.
- Ergebnis-Kreis korrigiert:
  - `.bigScore` wird im Grid nicht mehr zur breiten Pille gestreckt, sondern bleibt ein Kreis.
- Simulation-Cockpit:
  - Antwortbereich, Task-Navigation, Footer und Drawer erhalten einheitliche Abstände.
- Highscore/Duell:
  - Ranking-Rows, Duel-Cards, Arena-Panels und Action-Cards erhalten konsistente Gaps/Paddings.
- Admin/Dozent:
  - Admin-Cards, Tabs, Buttons, Toolbar, Listen und Stat-Grids erhalten einheitliche Gaps und Hitboxen.
- Toast/Notice:
  - Hinweisbanner darf keine breite leere Stange mehr über Inhalte legen.

## Dateien

Geändert/neu:

- `index.html`
- `css/ui-density-grid-polish.css`
- `js/core/app-config.js`
- `service-worker.js`
- `manifest.json`
- `update-check.json`
- `module-manifest.json`
- `docs/WORKING-PLAN.md`
- `WORKING-PLAN_1.md`
- `docs/G51_5_APPWIDE_GRID_DENSITY_REPORT.md`
- `docs/G51_5_APPWIDE_GRID_DENSITY_QA.json`

## Visuelle QA

Headless-Chromium mit folgenden Viewports:

- Desktop Chrome-Profil: 1440 × 900
- iPad Landscape-Profil: 1180 × 820
- iPhone-Profil: 430 × 932

Geprüfte Flächen:

- Startseite
- Ergebnis/Auswertung mit vielen Kategorie-Kacheln
- Simulation geschlossen
- Simulation mit geöffneter Frageübersicht
- Admin/Dozentenportal-Skelett mit Tabs und Kacheln
- Highscore/Duell-Skelett mit Ranking-Rows und Duel-Cards

Automatische Kriterien:

- kein horizontaler Overflow
- keine überlappenden Schwester-Kacheln
- keine zu kleinen Button-Hitboxen
- keine erkannten Kachel-Overlaps

## Einschränkung

Die Prüfung emuliert Desktop/iPad/iPhone in Chromium. Das ist eine echte visuelle Browserprüfung mit unterschiedlichen Viewports und Touch-Profilen, aber kein echter iOS-Safari-Lauf auf physischem iPhone/iPad. Einzelne Spezialzustände, die nur nach Login, Firestore-Daten oder bestimmten Nutzerrollen entstehen, müssen weiterhin mit echtem Screenshot nachgeschärft werden, falls dort eigene Spezialklassen benutzt werden.

## Nächster Test

1. Cache hart aktualisieren.
2. Auswertung mit vielen Kategorien prüfen.
3. Simulation starten, Frageübersicht öffnen/schließen.
4. Highscore öffnen.
5. Duell öffnen.
6. Admin/Dozent öffnen.
7. iPad und iPhone quer/hoch prüfen.

