# G23.9 Demo-Teilnehmer & Testsystem

## Ziel
Admin kann 3 Demo-Teilnehmer erzeugen und wieder löschen, damit Admin-/Dozentenansichten ohne echte Daten testbar sind.

## Demo-Profile
- Lisa Schulz: stabiler Lernstand
- Tim Becker: riskanter Lernstand mit Zeitdruck/Mathe-Schwächen
- Anna Meier: kritischer Lernstand mit Logik-/Konzentrationsproblemen

## Testpasswort
Alle Demo-Teilnehmer verwenden lokal: `Demo12345!`

## Löschbarkeit
Demo-Profile sind mit `createdBy: demo-admin-portal` und `isDemo: true` markiert und können einzeln oder gesammelt gelöscht werden.
