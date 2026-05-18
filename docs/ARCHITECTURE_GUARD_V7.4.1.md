# V7.4.1 Healthcheck + Architecture Guard

Diese Version basiert auf V7.4.0 und verändert die bestehende UI nicht strukturell.

## Neu
- `js/core/architecture-guard.js` prüft DOM-Grundstruktur, Core-Globals, Core-Versionen, Mobile-Bottom-Nav, GitHub-Pages-Routing, Kern-Dateipfade, Cache/Service-Worker und Module-Loader.
- `?healthcheck=1` öffnet den Healthcheck direkt sichtbar.
- Der vorhandene Button „Systemstatus“ erweitert den Framework-Status automatisch um den Architecture-Guard-Bericht.

## Ziel
Vor größeren Features früh erkennen, ob ein Update Core, UI, Mobile-Nav oder Deployment-Pfade beschädigt.
