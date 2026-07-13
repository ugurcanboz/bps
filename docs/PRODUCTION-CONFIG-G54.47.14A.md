# Produktionskonfiguration G54.47.14A

Umgebungen: development, test, beta, production.

## Cloudflare
Deployment: `wrangler deploy --env test|beta|production`. Secrets immer je Umgebung setzen. KV-IDs und native Rate-Limits dürfen nicht zwischen Test und Produktion geteilt werden.

## Firebase
`.firebaserc.example` kopieren, echte Projekt-IDs prüfen und als `.firebaserc` speichern. Für jede Umgebung getrennte Auth-, Firestore-, Functions- und App-Check-Konfiguration verwenden. Die bestehende Web-Konfiguration ist ausschließlich die Produktionskonfiguration.

## PWA
Jeder Build benötigt eine neue App- und Cache-Version. Produktionsbuilds dürfen keinen lokalen Environment-Override enthalten. Service-Worker-Updates vor Beta/Release auf einem zweiten Gerät prüfen.

## Blocker vor Produktion
App-Check-Platzhalter ersetzen, Cloudflare KV/Rate-Limit-Bindings setzen, Secrets setzen, erlaubte Domains bestätigen und Firebase-Projekte für Test/Beta anlegen.
