# G51.0 — Home Lifecycle / Simulation Cleanup Fix

## Anlass

User-Smoke-Test auf iPad/Desktop zeigte: Nach Testende und Auswertung führt der Button **„Zurück zur Startseite“** zwar optisch zur Startseite, aber der alte Simulations-/Auswertungsbereich bleibt im unteren Dokumentbereich erreichbar. Erst ein Browser-Refresh stellt die Startseite sauber her.

## Diagnose

Der Fehler lag nicht in Firebase/Auth/Supabase, sondern im Screen-Lifecycle:

- `App.restart()` blendete nur Runtime-Screens aus und zeigte `#start` wieder an.
- Der aktive ModuleHost-/Simulation-Kontext wurde nicht sauber beendet.
- `body`-Klassen wie `egt-simulation-active`, `quiz-screen-active`, Overlay-/Drawer-Klassen und Scrollpositionen wurden nicht zentral bereinigt.
- `setAppSection('home')` konnte Home rendern, ohne einen harten Cleanup durchzuführen.
- Scrollpositionen auf `window`, `document`, `#uiHomeViewport` und Shell-Containern wurden nicht garantiert auf `0` zurückgesetzt.

## Umsetzung

### `js/app.js`

Neue zentrale Lifecycle-Helfer eingeführt:

- `isScreenVisible(id)`
- `closeRuntimeOverlaysForHome()`
- `stopActiveModuleForHome(reason)`
- `persistInterruptedRunForHome(reason)`
- `resetRuntimeDomAfterHome()`
- `forceHomeScrollTop()`
- `goHomeHard(reason)`

`App.restart()` delegiert jetzt vollständig an:

```js
function restart(){ goHomeHard("restart-home-button"); }
```

`setAppSection('home')` und `setAppSection('start')` laufen jetzt ebenfalls über den harten Home-Cleanup.

### Verhalten nach Fix

Beim Wechsel zur Startseite passiert jetzt kontrolliert:

1. Laufende Timer stoppen.
2. Offene Runtime-Routetimer stoppen.
3. Aktives Simulation-/Branch-Modul über `AppModuleHost.stopActive(...)` beenden, außer Home ist selbst aktiv.
4. Laufende Simulation via `EGTSimulation.abort(...)` nur bei `starting/running` beenden.
5. Trainings-Sheets, Deep-Sheets, Diagnose-/Feedback-Layer und Drawer schließen.
6. Body-/HTML-Statusklassen entfernen.
7. Runtime-DOM für Frage/Visual/Antworten/Feedback/Fragenübersicht leeren.
8. App-State auf Home zurücksetzen.
9. Nur `#start` sichtbar machen.
10. `EGTUILayer.switchTab('home')` ausführen.
11. Scrollposition mehrfach synchron auf `0` setzen.

### Unterbrochener Test

Falls ein Home-Wechsel während eines aktiven Tests passiert, wird der Lauf vor dem Cleanup streng abgeschlossen:

- offene Aufgaben werden über `finalizeOpenAnswers(...)` gewertet,
- Ergebnis wird gespeichert,
- Simulation wird beendet,
- danach wird Home sauber aufgebaut.

Das entspricht der Vorgabe: Home/Refresh-Richtung bedeutet Test beenden, nicht pausieren.

### `js/modules/egt-simulation-engine.js`

`abort(reason)` wurde gehärtet:

- Bereits `finished` Sessions werden durch späteren Home-Cleanup nicht mehr rückwirkend als `aborted` überschrieben.
- In diesem Fall werden nur Timer/Body-Flags geschlossen und ein `closed`-Event emittiert.

## Nicht verändert

- Keine Firebase-/Auth-/Admin-Logik verändert.
- Keine Aufgabeninhalte verändert.
- Keine Highscore-/Cloud-Logik fachlich verändert.
- Keine große CSS-/Layout-Reparatur durchgeführt.
- Keine alten Fallbacks entfernt.

## Erwarteter Test

1. App lokal über `localhost` starten.
2. Simulation starten.
3. Test beenden.
4. Auswertung anzeigen lassen.
5. **Zurück zur Startseite** klicken.
6. Erwartung: Startseite steht oben, kein Simulations-/Auswertungsrest darunter, kein Scroll nach unten nötig.
7. Dasselbe auf Desktop Chrome, iPad M2 und iPhone testen.

## Status

Statische QA bestanden. Browser-/Geräte-Smoke-Test durch User empfohlen.
