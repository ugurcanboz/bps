# Phase 38D.6 · B2 Sprechen hart

## Ziel

B2-Sprechen wurde vom Starterpool auf einen vollständigen Academy-Hardmode-Pool erweitert. Ziel ist eine klare Abgrenzung zu A1/B1: kurze Alltagssätze, Stichpunkte oder reine Zustimmung dürfen im B2-Hartmodus nicht mehr bestehen.

## Umsetzung

### 1. B2-Sprechpool erweitert

Datei:

```text
data/language-b2-exam-pilot.js
```

Neuer Stand:

```text
Lesen: 8 Varianten
Hören: 8 Varianten
Grammatik & Sprachbausteine: 8 Varianten
Schreiben: 8 Varianten
Sprechen: 8 Varianten
```

Neue B2-Kombinationen:

```text
8 × 8 × 8 × 8 × 8 = 32768
```

## Neue B2-Sprechthemen

1. Homeoffice dauerhaft ausbauen
2. KI im Unterricht und Lernen
3. Autofreie Innenstadt
4. Vier-Tage-Woche
5. Datenschutz im Alltag
6. Bezahlbarer Wohnraum
7. Gesundheit am Arbeitsplatz
8. Nachhaltiger Konsum

## B2-Sprechvorgaben

Jede Sprechaufgabe verlangt jetzt:

```text
180–350 Wörter Transkript-Äquivalent
60 Sekunden Vorbereitung
240 Sekunden Antwortzeit
klare Themen-Einordnung
Pro/Contra oder Abwägung
eigene Position
Begründung
konkretes Beispiel
Fazit, Lösung oder Empfehlung
```

## Harte Deckelungen

Die lokale Prüfungsengine wurde für B2-Sprechen nachgeschärft:

```text
zu kurz: maximal 45 %
keine eigene Position: maximal 60 %
keine Begründung: maximal 55 %
kein Beispiel: maximal 70 %
nur Stichpunkte: maximal 40 %
Thema verfehlt: maximal 30–40 %
nur B1-artige Sprache: maximal 65 %
```

Die Bewertung prüft nicht nur Grammatik, sondern echte mündliche Prüfungsreife: Aufbau, Argumentationslogik, Redemittel, Aufgabe, Beispiel und Abschluss.

## Engine-Fixes

Datei:

```text
js/modules/language-exam-engine.js
```

Geändert:

- B2-Sprechprofil in der lokalen Bewertung auf 180–350 Wörter angehoben.
- Argumentative Sprechstruktur wird separat erkannt.
- B2-Sprechen verlangt Pro/Contra, eigene Position, Begründung, Beispiel und Fazit.
- Zu kurze B2-Sprechantworten können lokal nicht mehr durch gute Einzelmerkmale bestehen.
- Groq-Rubrik für Sprechen enthält nun explizite B2-Hardcaps.
- Nebenbei wurde ein potenzieller `profile`-Referenzfehler in `combineHybrid` bereinigt.

## Shell/UI

Datei:

```text
js/modules/language-exam-shell.js
```

Geändert:

- Version auf `G54.38D.6-b2-speaking-hard-shell` gesetzt.
- Storage-Key aktualisiert, damit alte Sitzungen die neue Sprechlogik nicht verfälschen.
- Sprech-Rubrik erkennt bei B2 argumentative Pflichtbausteine.
- Placeholder und Hinweise wurden auf B2-Sprechen angepasst.
- Diagnostics zeigen Phase `38D.6`.

## Schwierigkeitsmatrix

Datei:

```text
data/language-level-difficulty-rules.js
```

Geändert:

```text
B2 speakingWords: 180–350
```

Damit ist B2-Sprechen deutlich von A1, A2 und B1 getrennt.

## QA

Neue Testdatei:

```text
tests_phase38d6_b2_sprechen_hart.html
```

Geprüft:

- B2-Pilot lädt korrekt.
- B2-Sprechen hat 8 Varianten.
- B2-Kombinationen ergeben 32768.
- B2-Sprechprofil ist 180–350 Wörter.
- Alle Sprechaufgaben haben Pflichtpunkte und Strukturvorgaben.
- Shell-Diagnostics melden Phase 38D.6.
- Kurze A1/B1-artige Antwort fällt hart durch.
- Antwort ohne eigene Position wird gedeckelt.
- Antwort ohne Beispiel wird gedeckelt.
- Strukturierte B2-Sprechantwort kann bestehen.

## Ergebnis

Phase 38D.6 ist abgeschlossen. B2 ist jetzt in allen fünf Prüfungsteilen auf 8 Varianten ausgebaut:

```text
Lesen
Hören
Grammatik & Sprachbausteine
Schreiben
Sprechen
```

Nächster sinnvoller Schritt:

```text
Phase 38D.7 · B2 Gesamt-QA / Endsimulation
```
