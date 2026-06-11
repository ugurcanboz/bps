# G34.2 Login/Profile Hotfix

## Ursache
Der Login nutzte `fetchProfile(code)` und prüfte das Dokument `accessCodes/{code}` strikt auf `status === active`.
Nach einer erfolgreichen Registrierung wird ein Zugangscode bei `maxUses: 1` jedoch korrekt auf `used` gesetzt und mit `learnerId` verknüpft. Dadurch konnte ein bereits eingelöster, eigentlich gültiger Nutzer beim späteren Login blockiert werden.

## Fix
`fetchProfile(code)` erlaubt beim Login jetzt `status: used`, sofern ein `learnerId/profileId` auf ein existierendes Profil zeigt. Gesperrt bleiben `revoked`, `deleted`, `disabled`, `blocked` und `expired`. Zusätzlich gibt es einen direkten Fallback auf `learners/{code}`.

## Nicht geändert
Highscore, Üben, Demo-Simulation, Profil-UI, Avatar, Duell-Vorbereitung und Coach-Logik wurden nicht umgebaut.
