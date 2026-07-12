# Rollback G54.50.2
1. `css/ui-ux-consistency.css` entfernen.
2. Die beiden Stylesheet-Verweise aus `index.html` und `admin-portal.html` entfernen.
3. Den Cache-Eintrag aus `service-worker.js` entfernen und die vorherige Cache-Version wiederherstellen.
4. Versionsquellen auf G54.50.1 zurücksetzen.
