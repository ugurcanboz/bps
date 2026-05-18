# V6.3.0 Dynamic TopNav Modellierung

Ziel: TopNav und BottomNav sind globale Shell-Layer. Nur MainContent/Section-Inhalte wechseln.

- BottomNav: Hauptbereiche Dashboard, Üben, Start, Highscore, Settings.
- TopNav: Kontexttabs pro Hauptbereich, horizontal scrollbar/snap.
- JS: `renderAppNav()` und `renderMobileTopNav()` hängen beide Layer direkt an `document.body`.
- CSS: `css/mobile.css` enthält die finale fixed/sticky Mobile-Shell-Schicht.
- App-Logik: EDV, Route, Cloud, Scoring und Simulation bleiben unverändert.
