# G37.3 Highscore Layout Repair

## Ursache
Die Premium-Highscore-Engine war eingebunden, aber das vollständige CSS-Containment für `hs-*` Komponenten fehlte. Dadurch renderten SVG-Icons mit Browser-Defaultgröße und die Arena-Komponenten fielen als riesige vertikale Icon-Spalte auseinander.

## Fix
- Umfassendes Highscore-CSS für `.hs-arena`, `.hs-svg`, Podium, Ranking, Challenges, Rewards, Entwicklung, Cloud-Status ergänzt.
- Alle SVG-Icons hart auf kleine, kontrollierte Größen begrenzt.
- Highscore-Seite responsiv für Desktop, Tablet und Smartphone stabilisiert.
- Version/Cache auf G37.3 erhöht.

## Akzeptanzkriterium
Highscore darf keine riesigen Icons mehr anzeigen. Die Seite muss als Dashboard mit Titel, Zeitraumchips, Podium, Rangliste, Entwicklung, Challenges, Rewards und Cloud-Status erscheinen.
