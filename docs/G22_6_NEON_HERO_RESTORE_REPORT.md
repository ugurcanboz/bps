# G22.6 Neon Hero Restore

Ziel: Die Neon-Hero-Optik aus den Referenzscreenshots wiederherstellen.

## Korrektur
- `renderPremiumDashboard()` rendert wieder den Neon-Hero: App-Header, Brain-Logo, Login, großer Neon-Hero, CTA, Target-Grafik.
- Startseite rendert zusätzlich Trainingsbereich-Karten und Schnellzugriff im Neon-Stil.
- `renderSectionIntro()` bleibt auf Home leer, damit kein altes Hub/Grid-Home darüberkommt.
- WordHub-Layer bleibt aus dem Ladepfad entfernt.
- Version/Service-Worker auf G22.6 erhöht.

## Wichtige Entscheidung
Der Fehler in G22.5 war: Das alte Home wurde zwar gelöscht, aber die visuelle Neon-Identität wurde dabei durch einen generischen Light/Hero ersetzt. G22.6 stellt die gewünschte Optik wieder her, ohne WordHub/alte Shell zurückzubringen.
