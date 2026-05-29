# Update V9.5.4 · Prognosis & Precision Core

Ziel: Die Coach-Intelligenz soll funktional relevanter werden, nicht nur umfangreicher.

## Eingebaut

- feinere Fehlerdiagnose pro Aufgabentyp
- Fehlerfamilien und Subtypen, z. B. `linear_statt_wechsel`
- Lernkurve mit 7-/14-Tage-Prognose
- präzisere Revanche-Auswahl nach `skillKey`, `subtype` und `trap`
- langfristige Prüfungsampel für BPS und CTC
- Command Center zeigt Ampel, Prognose und präzise Fehlerdiagnose
- neue API-Funktionen für Integration und Debugging

## Qualitätsprinzip

Die Funktionen liefern nur dann hohe Präzision, wenn die Aufgabendatenbank eine saubere Mini-DNA enthält. Ohne DNA greift weiterhin die automatische Schätzung, aber diese bleibt weniger genau.
