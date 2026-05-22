# V8.4.1 Highscore Renderer Rewrite

- Cloud-Highscore direkt in app.js an der Quelle gerendert.
- Keine Abhängigkeit von Testbuttons oder konkurrierenden Bridge-/Display-Renderern.
- Liest public.highscores mit Spalten player_name, percent, score, total, title, mode, class_code, created_at.
- Zeigt HTTP-Status, Tabellenname und Anzahl geladener Datensätze sichtbar an.
