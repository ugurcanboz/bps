# TEST REPORT V7.0.10

- Temporärer Cache-Kill-Switch direkt im `<head>` eingebaut.
- Läuft bei jedem Refresh, nicht nur einmal pro Version.
- Alle Cache-Storage-Einträge werden gelöscht.
- Alle vorhandenen Service-Worker-Registrierungen werden abgemeldet.
- `service-worker.js` ist nur noch ein Kill-/Unregister-Worker ohne Fetch-Cache.
- Versionstrings auf V7.0.10 / v710 aktualisiert.
- JS-Syntaxcheck und HTML-Versioncheck durchgeführt.
