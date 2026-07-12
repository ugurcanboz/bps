# Backup und Rollback

Backup erzeugen:
```bash
node tools/release-backup.mjs
```

Mit vorhandenem echten Firebase-Export:
```bash
node tools/release-backup.mjs --firebase-export=/PFAD/ZUM/EXPORT
```

Backup anschließend prüfen:
```bash
node tools/verify-backup.mjs backup-output/G54.47.15A-ZEITSTEMPEL
```

`backup-output/` gehört nicht in die App-Runtime und wird beim nächsten Backup ausgeschlossen.
