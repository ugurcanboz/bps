# Phase 38E.4 – Trainingsmodus mit echten Mini-Übungssets pro Schwäche

## Ziel

Der Trainingsmodus soll nicht nur den passenden Prüfungsteil öffnen, sondern dem Nutzer direkt konkrete Mini-Übungen zur erkannten Schwäche geben.

## Umsetzung

Neu ergänzt wurden echte Mini-Übungssets für alle fünf Prüfungsteile:

- Lesen
- Hören
- Grammatik & Sprachbausteine
- Schreiben
- Sprechen

Jedes Mini-Set enthält drei konkrete Aufgaben mit:

- Aufgabenstellung
- Ziel der Übung
- Checkliste
- Musterlösung oder Prüflogik

## Neue Funktionen

```text
miniTrainingSetFor(level, part, band)
miniTrainingSetHtml(session)
```

Diese Funktionen werden im Trainingsmodus direkt über `trainingModeBanner(session)` angezeigt.

## Ablauf

1. Schwächenprofil erkennt den kritischen oder knappen Prüfungsteil.
2. Nutzer klickt auf „Mini-Training starten“.
3. Die App erzeugt eine fokussierte Trainingssession.
4. Oben erscheint ein Mini-Übungsset passend zu Niveau, Prüfungsteil und Schwäche.
5. Darunter bleibt der normale Prüfungsteil als Transfertraining verfügbar.

## Beispiele

### B2 Lesen

- Hauptaussage sichern
- falsche Antwort begründen
- 6-Minuten-Lesedurchlauf

### B2 Hören

- erstes Hören ohne Transkript
- Sprecherhaltung erkennen
- Transkript erst zur Fehlerkontrolle nutzen

### B2 Grammatik

- Konnektoren
- Satzstellung
- Register

### B2 Schreiben

- Schreibgerüst
- Beispielpflicht
- 90-Sekunden-Korrektur

### B2 Sprechen

- Sprechgerüst
- Stichpunkte in Sätze verwandeln
- Gegenposition beantworten

## QA-Erwartung

- Direktstart aus Schwächenprofil bleibt erhalten.
- Jede Schwächenkarte weist auf Mini-Übungen hin.
- Trainingssession enthält `miniSet`.
- Mini-Set wird im Trainingsbanner gerendert.
- Musterlösung wird per `<details>` ausklappbar angezeigt.
- B2-Gesamt-QA bleibt unberührt.
- Keine API-Keys im Frontend.

## Ergebnis

Phase 38E.4 macht aus dem Trainingsmodus einen echten Übungsmodus. Der Nutzer bekommt nicht nur den Hinweis, was schwach ist, sondern konkrete kleine Aufgaben, mit denen genau diese Schwäche trainiert wird.
