# Eignungstest-Trainer V7.0.3 Responsive Stable

## Ziel
Desktop-Ansicht stabilisieren, ohne die funktionierende Mobile-Shell zu beschädigen.

## Änderungen
- Desktop- und Mobile-Navigation getrennt.
- Mobile-Dock wird nur noch im echten Mobile-Kontext in den Body verschoben.
- Desktop-Navigation bleibt innerhalb der App und wird als horizontale Tab-Leiste dargestellt.
- Globale `.app-nav.is-hidden`-Regel ergänzt, damit versteckte Navigation nicht mehr Desktop-Layout zerstört.
- Desktop-Container auf max. 1180px verbreitert und sauber zentriert.
- Desktop-Grids für Dashboard, Hub, Karten und Modusauswahl stabilisiert.
- CSS-Klammerfehler in `app.css` bereinigt.
- Version, Manifest, Service Worker und Cache auf V7.0.3 synchronisiert.

## Check
- `js/app.js` Syntaxcheck bestanden.
- CSS-Klammerbilanz geprüft.
- Versionen und Cache-Busting aktualisiert.
