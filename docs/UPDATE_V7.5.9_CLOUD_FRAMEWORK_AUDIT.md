# Update V7.6.0 Cloud + Framework Audit Stable

## Befunde
1. Cloud-Highscore konnte trotz Online-Diagnose in der Ranking-Karte im Ladezustand hängen bleiben.
2. Supabase-Requests hatten keinen klaren Timeout/Fallback im Ranking-Frontend.
3. Framework-/Core-Versionen waren sichtbar uneinheitlich zwischen V7.5.0/V7.5.8/V7.6.0.
4. Dokumenttitel entsprach nicht der gewünschten Beschriftung.
5. Copyright-Zeile fehlte als sichtbarer App-Hinweis.

## Änderungen
- Cloud-Highscore-Requests mit Timeout abgesichert.
- Ranking-Abfrage parallelisiert, damit Tages-/Wochen-/Monats-/Gesamt-Ranking nicht nacheinander blockiert.
- Lokaler Highscore-Fallback eingebaut, falls Supabase nicht antwortet.
- Manueller Button „Ranking neu laden“ eingebaut.
- App-Titel auf „Ugurcan“ gesetzt.
- Copyright-Zeile „© Ugurcan Bozkurt“ ergänzt.
- Runtime-/Cache-/Manifest-Version auf V7.6.0 angeglichen.
- Core-/Architecture-/Production-Diagnostics-Versionen vereinheitlicht.

## Kontrollpunkte
- JS-Syntaxprüfung bestanden.
- JSON-Prüfung bestanden.
- Core-Dateien vorhanden.
- Matrix-Dateien vorhanden: 8/8.
- Satzergänzungsmarker in Aufgabenbank vorhanden.
- ZIP-Test bestanden.
