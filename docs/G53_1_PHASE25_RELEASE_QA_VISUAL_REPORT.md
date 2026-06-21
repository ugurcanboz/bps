# G53.1 · Phase 25 Release-QA / Multi-Device Visual Simulation

## Ziel

Phase 25 ist keine neue Fachfunktion, sondern eine belastbare Release-/Health-Prüfung nach der großen Modularisierung aus Phase 14–24.

Geprüft wurden:

- App-Start / Startseite
- Simulation mit synthetischem Mehrfragenlauf
- Frageübersicht-Drawer geöffnet und geschlossen
- Auswertung / Ergebnis-Screen
- Zurück-zur-Startseite nach Auswertung
- Analyse / Coach-Screen
- Highscore-/Duell-Routing soweit in der Headless-Umgebung erreichbar
- horizontale Überläufe
- sichtbare Screen-Isolation
- Engine-/Global-Verfügbarkeit
- Button-/Kachel-Overlap-Metriken

## Neue Dateien

- `js/core/release-qa-engine.js`
- `css/phase25-release-qa-fixes.css`
- `docs/G53_1_PHASE25_RELEASE_QA_VISUAL_REPORT.md`
- `docs/G53_1_PHASE25_RELEASE_QA_VISUAL_QA.json`

## Eingebauter Fix während Phase 25

Die visuelle Prüfung hat einen echten Layoutfehler gefunden:

> Der geschlossene Frageübersicht-Drawer (`#questionNav.qnav-drawer`) lag zwar optisch außerhalb des Bildes, erzeugte aber auf Desktop/iPad/iPhone weiterhin horizontalen Overflow.

Fix:

- geschlossener Drawer wird jetzt per CSS wirklich aus Layout-/Scroll-Metriken entfernt
- geöffneter Drawer bekommt `width: min(390px, calc(100vw - 28px))`
- Runtime-Screens clippen horizontale Offcanvas-Reste

## Visuelle Simulation

Getestete Viewports:

| Gerät / Profil | Viewport | Ergebnis |
|---|---:|---|
| Desktop Chrome | 1440 × 900 | OK |
| iPad Hochformat | 768 × 1024 | OK |
| iPad Querformat | 1180 × 820 | OK |
| iPhone/iOS-Viewport | 430 × 932 | OK |

Geprüfte Messpunkte insgesamt: **28**  
Erzeugte Screenshots: **43**  
Fehler nach Fix: **0**

## Ergebnis

`overallOk = true`

Nach dem Drawer-Fix meldet die QA:

- `horizontalOverflow = 0` in geprüften Kernpfaden
- keine fehlenden Core-Domain-Engines
- keine Kachel-Overlaps in den geprüften Kernflächen
- Simulation → Ergebnis → Startseite bleibt sauber isoliert
- Auswertung und Analyse bleiben sichtbar stabil

## Einschränkung

Die Prüfung simuliert iPhone/iPad über Chromium-Viewports. Das ist für Layout, Overflow und DOM-Screen-Isolation sehr aussagekräftig, ersetzt aber **kein echtes physisches iOS-Safari-Endgerät**. Vor öffentlichem Release bleibt ein kurzer echter iPhone-/iPad-Test sinnvoll.

## Nächster Schritt

Nach Phase 25 ist die technische Modularisierung release-nah. Sinnvoll als nächste Phase:

- Phase 26: finale UI-Endrunde / Produktpolitur
- oder gezielter Bugfix-Zyklus anhand echter Geräte-Screenshots
