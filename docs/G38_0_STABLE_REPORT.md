# G38.0 Stable

Stabilisierte, bereinigte Version. Zusammenfassung der Runde:

## Cleanup
- Tote-Code-Prüfung (TypeScript-Parser, Fixpunkt) erneut über alle JS-Dateien: **kein
  totes Funktions-Holz mehr** (bereits in G37.5 entfernt, jetzt bestätigt).
- Keine verwaisten Referenzen, alle JS-Dateien Syntax-OK.

## Stabilität – verifiziert (Headless-Browser, ohne Netzwerk)
- App-Selbstprüfung `ArchitectureGuard.run()`: **Score 100, 0 Fehler, 0 Warnungen**.
- Smoke-Test über alle Tabs (Home, Highscore, Simulation, Duelle, Profil) und zentrale
  Aktionen (Coach, Analyse, Training, Profil, Duell, Simulation, Einstellungen,
  Teilnahmecode, Login): **keine Konsolenfehler, keine Warnungen**.
- Highscore rendert korrekt (Karte, 22 Icons à 22 px, Podium).
- Bottom-Nav: im Normalbetrieb sichtbar; blendet sich korrekt hinter offenen Sheets aus und
  kommt beim Schließen zuverlässig zurück (Klassen-Lifecycle `egt-layer-open`/`ui-overlay-open`
  geprüft: öffnen → ausgeblendet, schließen → wieder sichtbar).
- Intro-Video: erscheint bei jedem Refresh ohne Session, wird bei aktiver Session unterdrückt;
  Mount in `try/catch` (blockiert den Boot nie), Hintergrund-Scroll-Sperre mit Wiederherstellung.

## Korrektur
- `js/core/architecture-guard.js`: `checkMobileNav` meldet keine Fehlalarm-Warnung mehr, wenn
  die Dock bei offenem Overlay/Sheet gewollt ausgeblendet ist (vorher: transienter „warn").

## Konsistenz
- Versionen vereinheitlicht auf **G38.0-STABLE-2026-06-13** (app-config, manifest, update-check,
  service-worker). Service-Worker-Cache `bps-trainer-g380-stable`, network-first für
  HTML/CSS/App-JS (Updates erreichen Geräte ohne manuelles Cache-Löschen).

## Tiefenprüfung (Stabilitäts-Zertifizierung)
- **Inhalts-Kern:** alle **70 Fragengeneratoren** über Level 1–5, je 8 Durchläufe =
  **2800 Generierungen → 0 Exceptions, 0 ungültige Antwortindizes, 0 Null-Ausgaben**.
- **Selbstdiagnose stabil grün:** `ArchitectureGuard.run()` = **100 / 0 Fehler / 0 Warnungen**
  in allen geprüften Zuständen (Intro offen, Home, Highscore-Tab, Profil-Tab).
- **Aktions-Stress:** 17 sichtbare `data-ui-action` über alle Tabs durchgeklickt → 0 Fehler.
- **Flow-Methoden:** quickStart/endEarly/showAnalysis/restart fehlerfrei.
- **Deploy-Integrität:** alle **166 Service-Worker-Precache-Pfade existieren** → SW installiert
  ohne Fehlschlag.
- **Boot:** offline-Boot ohne JS-Fehler, Version G38.0-STABLE, alle 5 Tabs fehlerfrei.

Fazit: belastbarer, fehlerfreier Stable-Stand zum Deployen.
