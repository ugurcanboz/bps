# V9.1.2 Deploy Root Fix

Fix:
- ZIP-Inhalt liegt jetzt direkt im Root, nicht mehr in einem verschachtelten `v9/`-Ordner.
- `index.html` liegt direkt auf oberster Ebene.
- `404.html` Version von 9.0.2 auf 9.1.2 aktualisiert.
- Service-Worker Cache auf `bps-trainer-v9-1-2` erhöht.

Grund:
Wenn GitHub Pages im Repository-Root kein `index.html` findet, entsteht ein 404.
