# Eignungstest-Trainer · G54.11 · Phase 30C

Aktueller ZIP-Stand: **G54.11 – Phase 30D-FIX iPhone/iPad HTTPS-Diagnose**

## Wichtigster Projektfokus

Diese Version betrifft ausschließlich das **Language Academy / Sprachkurs-Modul**.

Nicht verändert wurden:
- CTC / CTC-Lohr Simulation
- Admin-Portal
- Highscore
- Teilnahmecode / Auth
- Supabase/Firebase-Grundlogik

## Was Phase 30C umgesetzt hat

Phase 30C zieht die Sprechaufgaben inhaltlich auf den vorhandenen A1-Kursstand nach.

Vorher:
- A1 hatte 10 Lektionen mit je 39 normalen Aufgaben.
- Sprechen war technisch vorbereitet, aber inhaltlich noch nicht über alle Lektionen verteilt.

Jetzt:
- A1 hat weiterhin 10 Lektionen.
- Jede A1-Lektion besitzt zusätzlich **4 Sprechaufgaben**.
- Gesamt: **40 neue speaking_practice-Aufgaben**.
- Jede A1-Lektion hat jetzt **43 Aufgaben**.
- A1-Gesamtumfang: **430 Aufgaben inkl. Sprechen**.

## Technischer Stand Sprechen

Phase 30B bleibt als technischer Adapter erhalten:
- Browser SpeechRecognition
- GitHub Pages kompatibel
- kein Server
- kein Vosk-Server
- keine kostenpflichtige API
- `de-DE` / `tr-TR`
- `interimResults=true`
- `maxAlternatives=5`
- Wort-für-Wort-Feedback
- Fallback bei unsupported / denied / no speech

Phase 30C ergänzt darauf die A1-Inhalte.

## Neue Projektregel ab G54.11

Ab sofort gilt für alle weiteren Niveaus:

**Normale Kursaufgaben und Sprechaufgaben werden parallel ausgebaut.**

Beispiel:
- Wenn später A2 ausgebaut wird, werden A2-Inhalte und A2-Sprechaufgaben in derselben Entwicklungsphase mitgedacht und geprüft.
- Sprechen wird nicht mehr als nachträglicher Zusatz behandelt.

## Neue / aktualisierte Dateien

- `js/modules/language-course-entry-module.js`
- `tests_phase30_speaking_trainer.html`
- `tests_phase30b_browser_speech_upgrade.html`
- `tests_phase30c_a1_speaking_content_expansion.html`
- `docs_PHASE30C_A1_SPEAKING_CONTENT_EXPANSION.md`
- `WORKING-PLAN_1.md`
- `docs/WORKING-PLAN.md`
- `update-check.json`
- `manifest.json`
- `service-worker.js`
- `js/core/app-config.js`

## Prüfschnittstellen

Im Browser verfügbar:

```js
LanguageAcademyCourseEntry.diagnostics()
LanguageAcademyCourseEntry.phase30SpeechSnapshot()
LanguageAcademyCourseEntry.speechQaSnapshot()
```

Erwarteter Kernstatus:
- `diagnostics().phase === "30C"`
- `phase30SpeechSnapshot().a1SpeakingTasks === 40`
- `phase30SpeechSnapshot().a1TotalTasks === 430`
- `phase30SpeechSnapshot().a1SpeakingCoverage.complete === true`

## Tests

Empfohlene Browser-Testdateien:
- `tests_phase30c_a1_speaking_content_expansion.html`
- `tests_phase30b_browser_speech_upgrade.html`
- `tests_phase30_speaking_trainer.html`

Code-/Mock-QA wurde bestanden.

## Ehrliche Grenze

Echte Mikrofonqualität kann weiterhin nur auf realen Zielgeräten final geprüft werden:
- Desktop Chrome / Edge
- Android Chrome
- iPhone Safari
- iPad Safari

Die technische und inhaltliche Integration ist vorbereitet und geprüft, aber Browser-Speech bleibt browserabhängig.

## Aktueller Stand – G54.11 / Phase 30D-FIX iOS HTTPS/Secure Speech Diagnostics

Letzte Änderung:
- Sprechaufgaben funktionierten auf Desktop, aber nicht zuverlässig auf Handy/iPad.
- Mobile Speech-Erkennung wurde deshalb abgesichert.
- iOS/iPadOS und Home-Screen-PWA-Kontext werden erkannt.
- Mikrofonbutton bleibt auf mobilen Geräten bedienbar.
- Wenn automatische SpeechRecognition nicht verfügbar ist, schaltet die Aufgabe in den mobilen Übungsmodus statt zu blockieren.
- iOS-Safe-Konfiguration ergänzt: `interimResults=false`, `maxAlternatives=1`.
- Desktop bleibt bei automatischer Auswertung mit `interimResults=true`, `maxAlternatives=5`.

Wichtig für Tests:
1. Auf iPhone/iPad zuerst direkt in Safari testen.
2. Falls als Home-Screen-PWA installiert: automatische SpeechRecognition kann iOS-seitig limitiert sein.
3. In diesem Fall muss der mobile Übungsmodus sichtbar sein und „Selbst nachgesprochen“ funktionieren.

Neue QA-Datei:
- `tests_phase30c_mobile_speech_fix.html`


## Aktueller Stand – G54.11 / Phase 30D-FIX iOS HTTPS/Secure Speech Diagnostics

Der iPhone/iPad-Test zeigte Zugriff über eine lokale IP-Adresse (`192.168.x.x`). Dafür wurde eine klare Diagnose ergänzt: lokale IP/HTTP wird als `insecure_context` erkannt und im Mikrofon-Check sichtbar erklärt. Für echte automatische Spracherkennung auf iPhone/iPad soll über HTTPS getestet werden, z. B. GitHub Pages, nicht über lokale IP.
