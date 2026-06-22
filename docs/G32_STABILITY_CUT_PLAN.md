# G32.0 Stability Cut · Arbeitsplan

## Ziel

Nach Abschluss der Highscore-Arena soll die Codebasis stabilisiert werden. Der Fokus liegt nicht auf neuen Funktionen, sondern auf Wartbarkeit, klaren Zuständigkeiten und weniger Seiteneffekten.

## Priorität 1: Highscore modularisieren

- `CloudHighscoreEngine` aus `js/app.js` herauslösen.
- Neues Modul: `js/modules/highscore-module.js`.
- Cloud-Health in eigenes Modul trennen.
- Renderlogik, Datenlogik und Timerlogik sauber trennen.

## Priorität 2: Refresh zentralisieren

- Nur ein sichtbarkeitsabhängiger Highscore-Timer.
- Keine Startseiten-Refreshes.
- Keine MutationObserver-Refresh-Kaskaden.
- Einheitliches Throttling für manuelle und automatische Updates.

## Priorität 3: Nutzeransicht und Diagnose trennen

- Nutzer sieht Live-Ranking, Cloud-Status und verständliche Fehlermeldungen.
- Admin/Diagnose sieht Supabase-URL-Status, Tabelle, HTTP-Status, RLS-Hinweise und technische Details.

## Priorität 4: Feature-Grenzen sauber setzen

- Duelle erst aktivieren, wenn `profiles`, `duel_requests` und `duel_results` vorhanden sind.
- Badges erst dauerhaft speichern, wenn ein Profilmodell vorhanden ist.
- Keine Buttons ohne ehrliches Verhalten.

## Priorität 5: Testcheck vor jedem Build

- JS Syntaxcheck.
- JSON Validierung.
- Service-Worker-Assetprüfung.
- Suche nach doppelten Highscore-Renderern.
- Suche nach alten Build-Versionen.
- Suche nach Testeintrag-/Debug-UI in Nutzeransicht.
