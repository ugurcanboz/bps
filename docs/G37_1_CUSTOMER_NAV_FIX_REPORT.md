# G37.1 Customer Navigation Fix Report

## Ursache
Der Bottom-Dock verwendete `data-tab="highscore"`, aber der globale Router behandelte alle Dock-Buttons noch wie alte numerische Tabs. Dadurch wurde Highscore nicht als eigener Kundenbereich geöffnet, sondern über alte Mapping-Logik in falsche Menüs/Sheets umgeleitet.

## Behoben
- Router unterstützt jetzt benannte Customer-Tabs: `home`, `highscore`, `duels`, `profile`.
- Highscore öffnet jetzt direkt den Highscore-Bereich und nicht mehr das Üben/Training-Deep-Sheet.
- Duelle sind ein eigener Bottom-Menübereich und nicht mehr nur ein Highscore-Unterpunkt oder Deep-Sheet.
- Profil ist ein eigener Bottom-Menübereich.
- Simulation bleibt mittig als hervorgehobene Hauptaktion.
- Bottom-Dock optisch neu aufgebaut: Glass-Pill, 5 gleichwertige Hauptpunkte, mittige Simulation als Premium-CTA.

## Akzeptanzkriterien
- Klick auf Highscore zeigt Highscore-Dashboard.
- Klick auf Duelle zeigt Duell-Zentrale.
- Klick auf Home zeigt Startseite.
- Klick auf Profil zeigt Profil-/Admin-/Dozenten-Zentrale.
- Klick auf Simulation öffnet den prüfungsnahen Simulationsstart.
- Kein Bottom-Menüpunkt darf das Üben-Sheet öffnen, außer Simulation als bewusster Prüfungsstart.
