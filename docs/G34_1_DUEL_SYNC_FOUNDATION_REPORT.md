# G34.1 Duel/Sync Foundation

Build: G34.1-DUEL-SYNC-FOUNDATION-2026-06-08

## Phase 15
Duell-Vorbereitung im Benutzerprofil ergänzt. Es werden keine echten Duell-Anfragen geschrieben und keine Fake-Duelle erzeugt. Das Profil stellt nur die Voraussetzungen bereit: Profil-ID, Nickname, Gruppe, Rolle und Leistungswerte.

## Phase 16
Rollenbasierte Firestore-Regeln als Entwurf dokumentiert. Der aktuelle Entwicklungsbetrieb kann weiterhin offene Test-Regeln nutzen, aber für echte Teilnehmer ist die Rollen-/Gruppenprüfung erforderlich.

## Phase 17
Offline-/Sync-Grundlage ergänzt. Wenn Firebase nicht erreichbar ist, werden Versuchsdaten lokal vorgemerkt und bei erneuter Verbindung über die UserDatabase-Warteschlange übertragen.

Nicht verändert: Üben, Highscore, Demo-Simulation, Admin-/Dozent-Codegenerator, Avatar-Upload.
