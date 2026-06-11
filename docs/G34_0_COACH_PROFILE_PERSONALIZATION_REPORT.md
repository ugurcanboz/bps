# G34.0 Coach/Profile Personalization

Build: G34.0-COACH-PROFILE-PERSONALIZATION-2026-06-08

## Umfang
- Profil-Dashboard mit persönlicher Leistung ergänzt.
- Firebase/UserDatabase Coach-Kontext in Profil-Sheet eingebunden.
- Learning Coach erhält UserDatabase-Kontext-Snapshot.
- Ergebnis-Speicherung gibt mehr Kontext an EGTAdminPortal.trackEvent weiter.

## Bewusst nicht geändert
- Kein Umbau an Üben, Highscore, Demo-Simulation oder Admin-Codegenerator.
- Keine neuen harten Sperren.
- Kein Avatar-Upload zu Firebase.

## Neue öffentliche Hooks
- EGTAuthProfileShell.loadPersonalCoachContext()
- EGTAuthProfileShell.coachPersonalizationSnapshot()
- EGTAuthProfileShell.profilePerformanceSnapshot()
