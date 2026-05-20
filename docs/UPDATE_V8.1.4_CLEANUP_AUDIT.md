# V8.3.5 Cleanup Audit

- Deep Sheet Engine bleibt Single Source of Truth.
- Alter Training-Sheet/Accordion-DOM wird zur Laufzeit entfernt statt nur versteckt.
- Mobile Scroll wurde gehärtet: kein globales `touch-action:none` mehr auf dem Body.
- Sheet-Body scrollt eigenständig mit `-webkit-overflow-scrolling: touch`.
- Landscape/kleine Höhe bekommen kompakte Darstellung.
- Branding bleibt: Willkommen im BPS-Trainer / © Ugurcan Bozkurt.
