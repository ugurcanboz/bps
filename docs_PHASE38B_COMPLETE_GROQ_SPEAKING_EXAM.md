# Phase 38B · Groq KI-Coach + Speaking-Prüfer komplett

## Status
Phase 38B ist als durchgehende Integration abgeschlossen:

- 38B.1 Cloudflare Worker API-Struktur: `/api/health`, `/api/coach`, `/api/speaking`, `/api/exam-speaking`
- 38B.2 Frontend-Anbindung für Groq Live-Coach
- 38B.3A Dedicated Speaking AI Client
- 38B.3B–G sichtbare Speaking-Prüfer-Integration, Bewertungsanzeige, Off-Topic-Erkennung, Fallback und QA-Testseite

## Eingebaute Nutzerfunktion
In jeder bestehenden `speaking_practice`-Aufgabe erscheint nun ein KI-Sprechprüfer-Panel.

Der Teilnehmer kann:

1. den Satz anhören,
2. per Browser Speech sprechen,
3. falls iPhone/iPad keine automatische Spracherkennung liefert, die gesprochene Antwort manuell eintippen,
4. `KI-Training bewerten` oder `KI-Prüfung bewerten` starten.

## Bewertet wird

- Gesamtpunktzahl
- Themenbezug
- Grammatik
- Wortschatz
- Flüssigkeit
- Abschweifen vom Thema
- fehlende Pflichtpunkte
- Stärken
- Schwächen
- nächster Prüfungsimpuls

## Sicherheitsarchitektur

Der Groq-Key liegt nicht im Frontend. Die App ruft nur den Cloudflare Worker auf:

```text
GitHub Pages → Cloudflare Worker → Groq
```

## Fallback

Wenn Groq/Worker nicht erreichbar ist, nutzt `LanguageSpeakingAI` den lokalen Fallback. Die App bleibt nutzbar und stürzt nicht ab.

## Testseite

```text
tests_phase38b_complete_speaking_exam_integration.html
```

Diese Testseite prüft:

- Health-Verbindung
- `/api/speaking`
- `/api/exam-speaking`
- Themenabweichung/Off-Topic-Fall

## Geänderte Dateien

- `js/modules/language-course-entry-module.js`
- `js/modules/language-ai-client.js`
- `js/modules/language-speaking-ai-client.js`
- `css/language-course.css`
- `data/language-ai-config.js`
- `service-worker.js`
- `update-check.json`
- `WORKING-PLAN_1.md`

## Ergebnis

Der Sprachkurs besitzt jetzt nicht nur einen Live-Chat-Coach, sondern einen sichtbaren, prüfungsartigen KI-Sprechprüfer für bestehende Sprechaufgaben.
