# Rollback G54.49.0J

G54.49.0J ergänzt ausschließlich das lokale Nova-Kontrollzentrum.

Für ein gezieltes Rollback:
1. `js/modules/nova-control-center.js` entfernen.
2. `css/nova-control-center.css` entfernen.
3. Die beiden Includes aus `index.html` entfernen.
4. Die Karte `nova-control-center` aus `js/ui-home-renderer.js` entfernen.
5. Versionsquellen auf G54.49.0I zurücksetzen.

Es gibt keine Server-, Datenbank- oder Profildatenmigration. Bestehende Welcome-, Auth-, Wetter- und Tourdaten bleiben kompatibel.
