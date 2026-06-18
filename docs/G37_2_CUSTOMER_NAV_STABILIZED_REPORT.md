# G37.2 Customer Navigation Stabilized

## Ursache

G37.1 hat das Bottom-Dock mit `left` und `right` gleichzeitig positioniert. Dadurch wurde das Dock auf Desktop/Tablet links ausgerichtet bzw. optisch zu breit. Zusätzlich wurden benannte Tabs wie `home`, `highscore`, `duels`, `profile` nicht im UI-Layer normalisiert; der Layer erwartete teilweise numerische Tab-Konstanten.

## Fix

- Bottom-Dock final über eine G37.2 CSS-Stabilizer-Regel zentriert.
- Keine linke Full-Width-Glasfläche mehr.
- Kompaktes Floating-Dock mit mittlerer Simulation-CTA.
- Tab-Normalisierung im UI-Layer ergänzt.
- Router behandelt `data-ui-action="tab"` korrekt.
- Legacy numerische Dock-Mappings abgesichert.
- Cache auf `bps-trainer-g372-customer-nav-stabilized` angehoben.

## Akzeptanz

- Highscore öffnet Highscore.
- Duelle öffnen Duelle.
- Profil öffnet Profil.
- Home bleibt Home.
- Simulation bleibt mittig hervorgehoben.
- Dock ist auf Desktop/Tablet/Mobile kompakt und überdeckt nicht als große dunkle Fläche den Inhalt.
