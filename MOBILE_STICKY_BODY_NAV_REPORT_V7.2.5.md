# V7.2.6 Mobile Sticky Body Nav Stable

Fix:
- Mobile Bottom-Menü wird auf Mobile direkt in den `<body>` verschoben.
- Dadurch bleibt `position: fixed` auch in mobilen Browsern/PWA-Standalone stabil.
- Desktop bekommt die Navigation weiterhin zurück in den App-Container.
- Finaler CSS-Override schützt gegen `is-hidden`, falsche Klassen und verschachtelte Container.
