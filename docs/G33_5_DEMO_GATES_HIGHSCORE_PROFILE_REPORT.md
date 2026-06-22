# G33.5 Demo Gates + Highscore Profile

Build: `G33.5-DEMO-GATES-HIGHSCORE-PROFILE-2026-06-08`

## Umgesetzt

- Demo-Modus auf 2 Simulationen begrenzt.
- Zentrale Feature-Gates im Auth/Profile-Ast ergänzt.
- Demo darf nur Simulation starten; andere Bereiche öffnen ein Zugangscode-/Lock-Sheet.
- App-Start/Training wird vor Quizstart über `canStartMode()` geprüft.
- Demo-Zähler wird erst nach abgeschlossener Simulation erhöht, nicht beim Refresh oder beim Öffnen.
- Highscore-Identität nutzt Profil/Nickname, Profil-ID und Gruppe, soweit vorhanden.
- Supabase-Highscore bleibt bestehen; es wurde kein Upload-/Datenbankmodell ersetzt.

## Nicht geändert

- Kein Avatar-Upload zu Firebase.
- Kein Umbau der Üben-/Highscore-/Fortschritt-Kernlogik.
- Kein Duell-System aktiviert.
