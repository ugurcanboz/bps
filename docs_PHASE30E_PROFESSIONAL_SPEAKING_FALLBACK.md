# Phase 30E – Professional Speaking Fallback

## Ziel

Sprechaufgaben dürfen auf iPhone/iPad oder in Browsern ohne Web Speech nicht kaputt wirken. Da automatische Browser-Spracherkennung nicht überall zuverlässig verfügbar ist, ergänzt Phase 30E einen professionellen geführten Sprechmodus.

## Ergebnis

Die App unterscheidet jetzt zwei Modi:

### 1. Automatische Auswertung

Wird genutzt, wenn `SpeechRecognition` oder `webkitSpeechRecognition` verfügbar und der Kontext geeignet ist.

Funktionen:
- Mikrofonstart nach Nutzeraktion
- Live-Erkennung, sofern Browser geeignet
- finale Auswertung
- Alternativenvergleich
- Wort-für-Wort-Feedback
- Prozentbewertung

### 2. Geführter Sprechmodus

Wird genutzt bei:
- iPhone/iPad ohne zuverlässige SpeechRecognition
- PWA/Home-Screen-Kontext mit Einschränkungen
- lokaler IP / HTTP / fehlender Secure Context
- Browser ohne SpeechRecognition
- Mikrofonberechtigung blockiert

Funktionen:
- Zieltext bleibt sichtbar
- Satz kann vorgespielt werden
- klare Schrittfolge zum Nachsprechen
- vierstufige Selbstbewertung
- Fortschritt wird gespeichert
- unsichere Aufgaben bleiben im Wiederholungsfluss

## Selbstbewertung

| Auswahl | Score | Ergebnis |
|---|---:|---|
| Sehr gut gesprochen | 100 % | geschafft |
| Fast richtig | 80 % | geschafft, leichte Wiederholung vorgemerkt |
| Noch unsicher | 55 % | Wiederholung |
| Nochmal üben | 25 % | Wiederholung |

Die App tut dabei nicht so, als hätte sie automatisch bewertet. Die Selbstbewertung wird offen als Selbstbewertung behandelt.

## Geänderte Dateien

- `js/modules/language-course-entry-module.js`
- `css/language-course.css`
- `tests_phase30e_professional_speaking_fallback.html`
- `START_HERE.md`
- `WORKING-PLAN_1.md`
- `docs/WORKING-PLAN.md`
- `update-check.json`
- `manifest.json`
- `service-worker.js`
- `js/core/app-config.js`

## QA

Prüfschnittstellen:

```js
LanguageAcademyCourseEntry.diagnostics()
LanguageAcademyCourseEntry.phase30SpeechSnapshot()
LanguageAcademyCourseEntry.speechQaSnapshot()
```

Erwartet:

```text
phase: 30E
guidedSpeakingFallback: true
selfAssessmentOptions: 4
mobileSafeFallback: true
```

Zusätzliche Testdatei:

```text
tests_phase30e_professional_speaking_fallback.html
```

## Abgrenzung

Keine Änderungen an:
- CTC
- Admin
- Highscore
- Teilnahmecode
- Firebase/Supabase Auth

## Nächster Schritt

Phase 31A: A2-Kursstruktur und A2-Speaking-Struktur parallel vorbereiten.
