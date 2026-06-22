# Umsetzungsplan · Sprachtraining und Sprachtest-Simulation

## Zielbild

Die App trennt Sprache in zwei klare Bereiche:

### Sprachtraining

Lernen, üben, verstehen, Hilfe nutzen.

- Muttersprache/Hilfssprache
- Lernsprache
- Einstufungstest
- A1–C2 Lernpfad
- Lektionen
- Vokabeln
- Grammatik
- Lesen/Hören/Schreiben/Sprechen üben
- Hilfe und Übersetzung erlaubt

### Sprachtest-Simulation

Prüfen, simulieren, Vollprüfung bestehen.

- eigener großer Home-Einstieg
- Deutsch zuerst
- später Englisch
- Niveau wählen
- immer Vollprüfung
- keine Hilfen während der Prüfung
- Ergebnis und Coach erst danach

---

## Bereits umgesetzt

### G54.43.8L

- Vorhandene Deutsch-Prüfungsengine lokalisiert.
- `LanguageExamShell` für Simulation-Kontext nutzbar gemacht.
- Sprachtraining behält Übungsfunktion.

### G54.43.8M

- Home-Seite zeigt zwei große Kacheln:
  - Eignungstest-Simulation
  - Sprachtest-Simulation
- Eignungstest-Simulation bleibt für BPS/CTC/Auswahltests.
- Sprachtest-Simulation ist auf Home sofort sichtbar und nicht im anderen Center versteckt.

---

## Nächste Umsetzungsschritte

### 1. Live-QA G54.43.8M

- Home-Seite visuell prüfen.
- Kachel-Abstände prüfen.
- Dock-Overlap prüfen.
- Eignungstest-Kachel testen.
- Sprachtest-Kachel testen.

### 2. Deutsch-Prüfung stabilisieren

- Niveauauswahl A1 bis C2 prüfen.
- B1/B2 Live-Prüfung durchlaufen.
- A1/A2/C1/C2 Datenstand prüfen.
- Ergebnisbericht prüfen.
- Coach-Feedback nach Abschluss prüfen.

### 3. Sprachtraining aufräumen

- Prüfungshinweis darf vorhanden bleiben, aber nicht wie Hauptprüfung wirken.
- Alle Einzelteile bleiben im Übungsmodus.
- Muttersprache/Lernsprache sauber darstellen.

### 4. Englisch später

Erst wenn Deutsch sauber sitzt.

- Englisch im Sprachtraining ergänzen.
- Englisch in Sprachtest-Simulation ergänzen.
- gleiche Vollprüfungsregel.
