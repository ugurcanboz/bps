# G22.2 Check Report

## Ziel
Hero/Card-Startseite dauerhaft gegen alte WordHub-Shell absichern.

## Geprüft

- `wordhub-layer.js` baut keine `#whShell` mehr auf
- `hideLegacy()` ist No-Op und versteckt keine Premium-Anker mehr
- `App.renderModes()` entfernt alte `#whShell` defensiv
- `index.html` enthält zusätzlichen Kill-Switch nach WordHub-Ladevorgang
- `activeAppSection` startet auf `home`
- Service-Worker-Cache-Version aktualisiert
- AppConfig-Version aktualisiert
- ArchitectureGuard erwartet neue Premium-UI-Anker statt alter WordHub-Anker

## Automatisierte Prüfungen

- JavaScript-Syntax: OK
- Service Worker Syntax: OK
- HTML-Verweise: 0 fehlende Dateien
- Service-Worker-Verweise: 0 fehlende Dateien
- ZIP-Test: OK

## Wichtig
Falls ein Gerät noch die alte Darstellung zeigt, liegt sehr wahrscheinlich noch ein alter Service Worker / Browsercache vor. Dann gezielt Website-Daten dieser App löschen oder PWA Cache zurücksetzen.
