# Update V9.3.2 – frei platzierbare Coach-Bubble

## Ziel
Die KI-Coach-Bubble ist jetzt nicht mehr fest unten/rechts platziert, sondern kann vom Nutzer frei verschoben werden. Die Position wird lokal gespeichert und nach dem Neustart der App wiederhergestellt.

## Umsetzung
- Pointer-Drag für Maus, Touch und Pencil
- gespeicherte Position über `localStorage`
- sichere Begrenzung innerhalb des sichtbaren Viewports
- sanftes Premium-Feedback beim Ziehen
- Magnetismus an Bildschirmrändern nur bei Nähe zur Kante
- Schutz gegen versehentliches Öffnen nach Drag
- automatische Repositionierung bei Resize/Rotation/VisualViewport
- Standardposition beim ersten Start: oben rechts

## Geänderte Dateien
- `js/learning-coach-ui.js`
- `css/learning-coach.css`
- `service-worker.js`

## Checks
- `node --check` für alle JS-Dateien erfolgreich
- Service-Worker-Cache auf V9.3.2 erhöht
