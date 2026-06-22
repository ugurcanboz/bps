# G33.3 Profile Avatar Nickname Report

## Ziel

Phase 7–9 umgesetzt: Benutzerprofil-UI erweitern, Avatar lokal speichern, Nickname als Pflichtfeld etablieren.

## Änderungen

- `js/modules/auth-profile-shell.js` erweitert.
- Lokaler Avatar-Cache über IndexedDB mit localStorage-Fallback ergänzt.
- Avatar wird nicht nach Firebase hochgeladen.
- Firebase-Profil speichert nur `avatarMode: "local"` und `avatarUpdatedAt`.
- Nickname validiert: 3–20 Zeichen, nicht leer, nicht nur Zahlen, keine gefährlichen Sonderzeichen.
- Profil-Sheet zeigt Avatar, Rolle, Gruppe, Code, Coach-Status und Profilaktionen.
- Zugangscode-Einlösung verlangt weiterhin Nickname als Pflichtfeld.
- Bestehende Üben-/Fortschritt-/Highscore-/Coach-Logik wurde nicht umgebaut.

## Akzeptanz

- Profil öffnen funktioniert.
- Profil bearbeiten funktioniert.
- Avatar wählen öffnet Geräte-Galerie/Filepicker.
- Avatar bleibt auf demselben Gerät erhalten.
- Ohne gültigen Nickname wird Profilabschluss erzwungen.
