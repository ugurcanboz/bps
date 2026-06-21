# G23.1 Admin/Dozenten Portal Shell

## Ziel

Diese Version startet das rollenbasierte Portal auf Basis der stabilen UI-B Neon-Oberfläche. Es wurde kein neues App-Design gebaut und der Neon-Hero bleibt unangetastet.

## Umgesetzt

- Gemeinsame Portal-Shell für Admin und Dozent.
- Rollenlogik: `admin`, `dozent`, `locked`.
- Rechte-Matrix im Code (`ROLE_PERMISSIONS`).
- Admin sieht Systeminfo, Roadmap, Nutzerverwaltung, Export und Reset.
- Dozent sieht nur beschränkte lehrkraftrelevante Daten: Gruppen-/Lernendenübersicht, Fortschritt, letzte Aktivität und Hilfebedarf.
- Systeminfo ist nur für Admin erreichbar.
- Roadmap ist nur für Admin erreichbar.
- Mobile/iPad-freundliche Kartenstruktur statt riesigem Desktop-Cockpit auf kleinen Displays.

## Noch bewusst nicht umgesetzt

- keine echte Cloud-Rollenverwaltung,
- keine echte Dozenten-Klassen-Zuweisung aus einem Server,
- kein PDF-/Excel-Export-Designer,
- kein vollständiger Aufgaben-Editor.

## Nächster Schritt

G23.2 sollte Systeminfo vertiefen: Version, Cache, Service Worker, Speicher, Datenbankstatus, Health-Checks und sichere Admin-Aktionen.
