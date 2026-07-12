# Rollback G54.50.1

G54.50.1 verändert keine fachliche App-Funktion. Für ein Rollback:

1. Den vorherigen Stand G54.49.0J wiederherstellen.
2. Falls nur das Functions-Paket betroffen ist, in `functions/package.json` und `package-lock.json` den vorherigen Paketnamen und die vorherige Version wiederherstellen.
3. Die entfernten verschachtelten Backup-ZIPs nicht in den Web-Release zurückkopieren; sie gehören in eine externe Sicherung.
4. Anschließend Release-Konsistenz, Auth/Rollen und Functions-Tests erneut ausführen.
