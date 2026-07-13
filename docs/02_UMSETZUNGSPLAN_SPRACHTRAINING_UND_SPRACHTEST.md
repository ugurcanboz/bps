# Umsetzungsplan · Sprachtraining und Sprachtest

## Leitentscheidung

Die App trennt Sprachbereiche konsequent:

- **Sprachtraining**: lernen, üben, wiederholen, Hilfe erlaubt.
- **Sprachtest-Simulation**: prüfen, simulieren, keine Hilfe, Ergebnis danach.

## Deutsch

Deutsch hat bereits eine Prüfungsschiene:

- Sprachtest-Simulation · Deutsch
- B1/B2 Vollprüfung aktiv
- A1/A2/C1/C2 vorbereitet, aber nicht als fertige Simulation freigeschaltet

Deutsch-Training bleibt davon getrennt.

## Englisch

Englisch wird zuerst nur als Sprachtraining aufgebaut.

Aktueller Stand Englisch A1:

- 12 Lektionen
- Aufgaben
- Listening
- Speaking
- Aussprachehinweise
- Fortschritt
- Review
- Supabase Sync Queue
- Admin Preview
- Speaking-Flow

Noch nicht erlaubt:

- Englisch-Vollprüfung
- Englisch-Sprachtest-Simulation
- Englisch im Simulation Center

## Nächste Ausbaulogik

### Schritt 1 · Englisch A1 Live QA

Bevor neue Levels erweitert werden, muss Englisch A1 live stabil sein.

### Schritt 2 · Englisch A2 Grundstruktur

A2 erst nach erfolgreicher A1 QA. A2 darf nicht nur Inhalt bekommen, sondern muss parallel erhalten:

- Kursaufgaben
- Listening
- Speaking/Aussprache
- Fortschritt/Review-Vorbereitung

### Schritt 3 · Admin/Supabase ausbauen

Erst wenn Supabase Tabelle und RLS live getestet sind:

- echte Admin Cloud-Auswertung
- Gruppen-/Teilnehmeransicht
- Fortschritt pro Sprache/Level/Lektion

### Schritt 4 · spätere Prüfungsschiene Englisch

Erst viel später, wenn Englisch Training A1/A2 stabil ist:

- Englisch-Prüfungskonzept
- Vollprüfung only
- keine Teiltest-Simulationen

## Reihenfolge ab G54.43.9P

1. G54.43.9P · Englisch A2 Grundstruktur + Speaking parallel
2. G54.43.9P · Englisch A2 Grundstruktur + Speaking parallel
3. G54.43.9R · Englisch A2 Interaktive Aufgaben + Fortschritt
4. G54.43.9R · Englisch A2 Review/Supabase Integration
5. G54.43.9S · Englisch A2 Mobile QA
6. G54.43.9T · Sprachtraining Gesamt-QA
