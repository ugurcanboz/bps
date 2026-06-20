# G33.1 Firebase Access Code Shell Report

## Ziel

Phase 2–4 des Benutzerprofil-Konzepts:

1. Auth-Gate weiter stabilisieren.
2. Firebase UserDatabase über eine zentrale API kapseln.
3. Zugangscode-Einlösung vorbereiten.

## Umgesetzt

- `EGTUserDatabase` erweitert um:
  - `init()`
  - `getSession()`
  - `setSession()`
  - `logout()`
  - `redeemAccessCode()`
  - `createProfile()` / `updateProfile()`
  - `getRole()`
  - `getGroup()`
  - `loadCoachContext()`
- Access-Code-Prüfung gegen Firestore-Pfad:
  - `courses/{courseId}/accessCodes/{codeId}`
- Profilanlage bei gültigem Code:
  - `courses/{courseId}/learners/{profileId}`
- Nickname ist Pflicht bei Code-Einlösung.
- Rolle und Gruppe werden aus dem Zugangscode übernommen.
- Kein unbekannter Code erzeugt Fake-Rechte.
- Bestehende Trainings-/Highscore-/Fortschritt-Logik wurde nicht umgebaut.

## Bewusst nicht umgesetzt

- Admin-Codegenerator.
- Dozent-Codegenerator.
- Harte Demo-Sperre.
- Avatar-Upload.
- Vollständige Firebase Security Rules im Code.
- Highscore-Profil-Kopplung.

## Erwartetes Firestore AccessCode-Dokument

```json
{
  "code": "BPS-2026-GK-A-X7K9",
  "role": "participant",
  "groupId": "2026-GK-A",
  "status": "active",
  "maxUses": 1,
  "usedCount": 0,
  "expiresAt": null
}
```

Rollen: `participant`, `teacher`, `admin`, `demo`.
