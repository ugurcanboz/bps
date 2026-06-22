# G34.2 Final QA Base – Prüfbericht

## Ziel
Finaler Abschluss von Phase 18: keine neuen Features, sondern technische Prüfung, Versionierung, Asset-Check und Auslieferungsbasis.

## Enthaltene Funktionsbereiche
- Auth/Profile Shell
- Firebase UserDatabase Foundation
- Zugangscode einlösen
- Admin-/Dozent-Codegenerator
- Benutzerprofil mit Nickname und lokalem Avatar
- Demo-Modus mit 2 Simulationen
- Highscore-Profilbindung
- Persönlicher KI-Coach-Kontext
- Profil-Leistungsübersicht
- Duell-Vorbereitung ohne Fake-Duelle
- Offline-/Sync-Grundlage

## Nicht verändert
- Üben-Kernlogik
- Highscore-Engine-Kern
- Admin-Codegenerator-Kern
- Avatar-Speicherprinzip
- Grunddesign

## Manuelle Testliste
1. App öffnen.
2. Auth-Bereich prüfen.
3. Demo starten.
4. Simulation starten und Scroll/Antworten prüfen.
5. Zugangscode generieren.
6. Zugangscode einlösen.
7. Profil öffnen, Nickname speichern, Avatar setzen.
8. Highscore öffnen.
9. Coach öffnen und persönliche Kontextkarte prüfen.
10. Profil: Duell-Vorbereitung und Sync-Status öffnen.
11. Offline/Online-Verhalten grob prüfen.

## Hinweis
Die Firestore Rules müssen für Testbetrieb mindestens authenticated read/write erlauben. Für Produktivbetrieb sind Rollenregeln erforderlich.
