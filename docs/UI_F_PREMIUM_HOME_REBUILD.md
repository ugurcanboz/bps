# UI-F Premium Home Rebuild

Ziel: Startseite nicht weiter über alte Light-/Legacy-Cards patchen, sondern als isolierte Premium-Dark-Home-Shell neu aufbauen.

Umgesetzt:
- neue Datei `css/premium-home.css`
- neue Assets unter `assets/ui/`
- Header mit Logo, Titel, Untertitel und Login
- `IT / FISI` aus Header entfernt
- Trainingsbereiche ins Dashboard verschoben
- Hero mit Zielscheiben-SVG
- Trainingsbereich-Karten: IT/FISI, Sozialpädagogik, Allgemeinwissen, Individuell
- Schnellzugriff: Üben, Lernmodus, Coach, Analyse, Fortschritt, Einstellungen
- Premium-Banner
- Bottom Navigation mit 5 Tabs
- Legacy-Grid bleibt als Fallback versteckt
- automatische Fachrichtungs-Pflichtauswahl deaktiviert, Default ist IT/FISI
- PWA-Cache um neue Dateien erweitert

Nicht verändert:
- Aufgabenbank
- Coach-DNA
- Admin-Portal
- Login-/Teilnehmerverwaltung
- Passwortsystem
