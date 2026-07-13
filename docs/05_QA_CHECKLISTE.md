# QA-Checkliste ab G54.46

## Nach jeder Phase
- zentrale Version aktualisieren und `node sync-version.js` ausführen
- JavaScript-Syntax vollständig prüfen
- JSON-Dateien vollständig parsen
- Index- und Service-Worker-Pfade prüfen
- betroffene Unit-/Integrationstests ausführen
- Desktop-, Tablet- und Smartphone-Klickpfad prüfen
- neue Konsole-, Netzwerk- und Layoutfehler dokumentieren
- Release-Backlog und Working-Plan aktualisieren

## Vor Release Candidate
- null offene P0-Punkte
- vollständiges Go/No-Go-Gate grün
- Staging mit realen Security Rules und Worker-Konfiguration
- Backup, Restore und Rollback getestet
- vollständiger visueller QA-Bericht vorhanden
