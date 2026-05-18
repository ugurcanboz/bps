# Release Notes V5.1.5 Cleanup Stable

## Schwerpunkt
- Cleanup- und Stabilitätsrelease für das PWA-Paket.
- Source-Module und generiertes `js/app.js` wurden wieder synchronisiert.
- Mobile Top Navigation ist jetzt im Source-Code enthalten und reproduzierbar buildbar.
- `App.setMobileTopContext(...)` ist sauber exportiert und nicht mehr nur manuell im Bundle vorhanden.
- Versionierung, Manifest, Service Worker und Cache-Busting auf V5.1.5 angehoben.
- Alte V5.1.3/V5.1.4 Build-Artefakte wurden entfernt.

## Kontrollierte Bereiche
- JavaScript-Syntaxprüfung für Runtime, Service Worker und Datenmodule.
- Manifest-JSON validiert.
- Service-Worker-Core-Assets gegen vorhandene Dateien geprüft.
- PWA-Icon-Dateien geprüft.
- HTML-Verweise auf lokale Assets geprüft.
- Bundle reproduzierbar aus `js/src/` neu erzeugt.

## Hinweis
Die Cloud-Highscore-Konfiguration bleibt unverändert. Supabase-Zugangsdaten sind als Public-Anon-Key weiterhin clientseitig sichtbar und müssen über Row-Level-Security abgesichert sein.
