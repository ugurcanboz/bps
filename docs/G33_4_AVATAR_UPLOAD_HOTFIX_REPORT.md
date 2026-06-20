# G33.4 Avatar Upload Hotfix Report

## Ziel

Der Avatar-Upload im Profil wurde repariert, ohne Highscore, Üben, Fortschritt oder Coach umzubauen.

## Änderung

- Avatar-Auswahl wird jetzt als sichtbarer nativer Datei-Input über Label/Button angeboten.
- Klick auf den Avatarbereich im Profil-Bearbeiten-Sheet öffnet die Galerie.
- Bilder werden lokal im Gerätecache/IndexedDB gespeichert.
- Kein Bild-Upload zu Firebase.
- Nickname-/Profil-/Firebase-Logik bleibt erhalten.

## Test

Profil öffnen → Profil bearbeiten → Avatarbereich oder „Avatar aus Galerie wählen“ antippen → Bild auswählen → speichern → Profil erneut öffnen.
