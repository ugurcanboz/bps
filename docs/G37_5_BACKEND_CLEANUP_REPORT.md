# G37.5 Backend-Cleanup

## Auftrag
Backend Zeile für Zeile auf Duplikate, Überschriebenes und toten Code prüfen, alles
Unnötige entfernen, nichts überschreiben, Highscore mit korrekter Darstellung sicherstellen.

## Befund Highscore-Darstellung
Die Highscore-Ansicht wurde über den echten Live-Pfad (UI-B: Tab „Highscore" → Demo →
`renderHighscoreTab` → `CloudHighscoreEngine.renderShell/refreshDashboard`) im Browser
nachgestellt und vermessen:
- `.hs-svg`-Icons: 22×22 / 34×34 px (korrekt), computed width = 22px
- Podium (3 Karten), Zeitraum-Chips, Rangliste, Entwicklung, Belohnungen, Cloud-Status sichtbar
- Seitenhöhe ~2492 px (kein Icon-Endlosbild)

Ergebnis: Der **Code rendert Highscore korrekt**. Das kaputte Bild mit Riesen-Icons stammt
aus einem **alten `app.css` im PWA-Cache** (ohne die `.hs-svg`-Größenregeln). Behoben durch
die network-first-Cache-Strategie (siehe unten) + Cache-Bump.

## Entfernter toter / überschriebener Code
Analyse mit echtem TypeScript-Parser (keine Brace-Heuristik). Kriterium: Funktionsname kommt
im gesamten Code (inkl. HTML, Export-Objekte) nur als Deklaration vor → kein einziger Aufruf.
Iterativ bis zum Fixpunkt (auch Kaskaden-Totholz).

**30 Funktionen entfernt:**
- `installHighscoreRenderer` — alter Zweitrenderer, der die Premium-Highscore-Engine per
  `CloudHighscoreEngine.renderShell = …` / `refreshDashboard = …` **überschrieb**. Aufruf war
  bereits auskommentiert. Inkl. verwaister Kommentare; toter Watchdog-Trigger
  („direkte Tabellenanzeige") entfernt.
- Kompletter ungenutzter Alt-UI-Layer aus `app.js` (durch UI-B/`ui-home-renderer.js` ersetzt):
  `renderHighscoreSection`, `renderDashboardSection`, `renderSettingsSection`,
  `renderSectionActions`, `renderAppNav`, `renderMobileTopNav`, `renderModeTabs`,
  `renderModeCard`, `modeCategoryFor`, `bindTopNavSwipe`, `isMobileShellContext`,
  `stabilizeMobileBottomNav`, `renderLegacyIntroRemoved`, `renderCurrentRunAnalysis`,
  `renderProfileManager`, `dashboardStats`, `coachRecommendation`, `timeGreeting`,
  `rankForPercent`, `adaptiveWeakCats`, `setVisible`.
- Verwaiste Helfer in weiteren Dateien: `objTotal` (admin-participant-engine),
  `saveDockPosition` (learning-coach-ui), `countKeys` + `renderPythonProfile`
  (python-quest-module), `renderCoachTab` + `renderPracticeTab` + `bankCount` +
  `showFoundationSheet` (ui-home-renderer — ungenutzte Tab-Renderer).

`app.js`: 5695 → 5378 Zeilen (~317 Zeilen / ~13 KB raus). Keine verbleibende Referenz auf
einen entfernten Namen.

## Was bewusst NICHT entfernt wurde
- Die App-Oberfläche basiert ausschließlich auf `ui-home-renderer.js` (UI-B). Funktionen, die
  über das `App.{…}`-Export-Objekt oder `data-action`-Delegation erreichbar sind, sind live und
  blieben unangetastet (Schnellscans, die solche als „tot" melden, sind falsch-positiv).
- Der Highscore-Recovery-Watchdog bleibt (er ist aktiv und ein günstiges Sicherheitsnetz);
  nur sein toter Text-Trigger wurde entfernt.

## Cache-Strategie (damit Fixes ankommen)
- `service-worker.js`: HTML-Navigation, `*.css`, App-JS unter `/js/` → **network-first**
  (Cache nur Offline-Fallback). Statische Assets/Daten bleiben cache-first.
- `CACHE_NAME` = `bps-trainer-g375-backend-cleanup` → alter Cache (inkl. veraltetem `app.css`)
  wird beim `activate` gelöscht.

## Geprüft (automatisiert im Headless-Browser)
- Alle JS-Dateien: Syntax OK; `update-check.json`, `manifest.json`: valides JSON.
- App bootet offline ohne JS-Fehler.
- Tab-Wechsel Home / Highscore / Simulation / Duelle / Profil: alle ohne Fehler.
- Highscore nach Cleanup: Card vorhanden, 22 Icons à 22 px, 3 Podium-Karten, 0 JS-Fehler.
- Versionen konsistent: app-config, update-check, manifest, service-worker = G37.5.
