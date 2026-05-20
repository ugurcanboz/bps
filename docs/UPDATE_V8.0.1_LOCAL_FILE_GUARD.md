# Update V8.0.2 · Local File Guard + Fixed Branding

## Behoben
- Begrüßung fest: Willkommen im BPS-Trainer.
- Unterzeile fest: © Ugurcan Bozkurt.
- App-/Manifest-Name auf BPS-Trainer vereinheitlicht.
- Service-Worker- und Cache-Diagnose prüfen jetzt zuerst das Protokoll.
- Bei lokalem Start über file:// wird Service Worker bewusst übersprungen, statt einen Diagnosefehler zu zeigen.

## Hinweis
PWA-Installation, Service Worker und Cloud-Verhalten sollten über http/https getestet werden, z. B. GitHub Pages, Netlify oder lokaler Dev-Server.
