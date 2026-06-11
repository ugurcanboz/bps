# G33.0 Auth Profile Shell Report

## Umgesetzt

- Neuer modularer Auth/Profile-Ast über `js/modules/auth-profile-shell.js`.
- Neue Aktionen: `auth-open`, `auth-login`, `auth-redeem-code`, `auth-demo-start`, `profile-open`, `profile-edit`, `profile-logout`.
- Dashboard erhält einen weichen Auth-Gate-Bereich ohne harte Sperren.
- Schnellzugriff erhält eine Profil-Kachel im vorhandenen Card-Stil.
- Login nutzt die vorhandene `EGTAdminPortal.loginWithCode()`-Logik.
- Zugangscode-Einlösen ist als UI-Shell vorbereitet, schreibt aber noch keine Fake-Rechte nach Firebase.
- Demo-Sitzung wird lokal vorbereitet, Feature-Gates folgen später.
- Profil-Sheet zeigt Rolle, Gruppe, Code und UserDatabase-Status.

## Nicht umgesetzt

- Keine echte Access-Code-Firestore-Prüfung.
- Kein Admin-/Dozent-Codegenerator.
- Keine harte Demo-Sperre.
- Kein Avatar-Upload.
- Kein Highscore-Umbau.

## Sicherheit

Es wurden keine bestehenden Trainings-, Highscore- oder Coach-Kernpfade ersetzt.
