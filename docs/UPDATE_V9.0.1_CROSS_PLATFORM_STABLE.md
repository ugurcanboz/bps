# V9.0.1 · Cross Platform Stable Repair

## Ziel
Die App wurde auf ein stabiles, schlichtes und plattformübergreifend bedienbares Layout für iOS, Android, Tablet und Desktop angepasst. Der vorhandene Code wurde nicht neu erfunden, sondern an der bestehenden Architektur stabilisiert.

## Wichtige Fixes
- Practice-Ansicht repariert: alte Cleanup-Regeln haben das Trainingsmenü und Sheet teilweise ausgeblendet.
- Deep-Sheet sichtbar und scrollfähig gemacht: iOS/Android-Safe-Areas, Desktop-Dialog, Tablet-Größen und Landscape-Fälle abgesichert.
- Modulstruktur bereinigt: Simulationen, Mathe, Logik, Matrizen, Visual IQ, Sprache, Wissen, Konzentration, IT/FISI und Technik sind jetzt sauber in Kategorien einsortiert.
- Fehlende Blockmodule in die Sheet-Navigation aufgenommen: Algebra, Symbolarithmetik, Aussagenlogik, Verhältnislogik und Allgemeinwissen Buch.
- Practice-Launcher ersetzt: klare Auswahlkarte plus aktueller Modus statt versteckter/konfliktanfälliger Legacy-Ansicht.
- Service Worker auf neuen Cache `bps-trainer-v9-0-1` gehoben und neue CSS-Datei eingebunden.

## Prüfungen
- `node --check js/app.js` erfolgreich.
- Script-/Stylesheet-Pfade geprüft: keine fehlenden Dateien.
- Runtime-Smoke-Test mit DOM-Stubs: App lädt, `App.setAppSection('practice')`, `App.openTrainingSheet()`, Aufgabenbank und 31 Modi erreichbar.

## Hinweis
Ein echter Browser-Render-Test mit Playwright/Chromium war in der Sandbox durch eine Administrator-Blockade für `file://` und `localhost` nicht ausführbar. Die strukturelle Runtime-Prüfung lief erfolgreich.
