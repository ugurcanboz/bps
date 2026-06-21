# Phase 30B · Browser-Speech Upgrade

## Ziel
Phase 30B verbessert die in Phase 30A integrierte Sprechfunktion, ohne Server, ohne Vosk-Server und ohne kostenpflichtige API. Die Umsetzung bleibt vollständig GitHub-Pages-kompatibel und betrifft ausschließlich das Sprachkurs-Modul.

## Umgesetzt
- SpeechRecognition-Adapter erweitert: robuste Feature-Erkennung über `SpeechRecognition` und `webkitSpeechRecognition`.
- Zustände ergänzt: `supported`, `unsupported`, `requesting`, `listening`, `processing`, `done`, `permission_denied`, `no_speech`, `start_failed`.
- Spracheinstellung pro Aufgabe vorbereitet: Deutsch `de-DE`, Türkisch `tr-TR`, Englisch später `en-US`/`en-GB`.
- `interimResults = true`: Live-Erkennung wird sichtbar angezeigt.
- `maxAlternatives = 5`: mehrere Erkennungsergebnisse werden gesammelt und das beste Ergebnis wird bewertet.
- Textnormalisierung erweitert: Kleinschreibung, Satzzeichen, Mehrfachleerzeichen, Umlaute, ß und türkische Diakritik werden robuster behandelt.
- Ähnlichkeitsbewertung neu aufgebaut: Levenshtein-Distanz, Tokenvergleich, Reihenfolge und Variantenliste.
- Bewertungsbereiche umgesetzt: 90–100 sehr gut, 70–89 fast richtig, 40–69 teilweise erkannt, unter 40 wiederholen.
- Wort-für-Wort-Feedback ergänzt: korrekte, ähnliche und fehlende Wörter werden unterschieden.
- DE/TR-Feedbacktexte ergänzt, gesteuert über die Hilfssprache.
- UI verbessert: Live-Text, finaler erkannter Text, Alternativen, Wortfeedback, Statusbox und Datenschutzhinweis.
- Fallback verbessert: Bei Unsupported oder Permission-Denied bleibt die Aufgabe bedienbar und bietet „Selbst nachgesprochen“ als Übungsalternative.
- QA-Schnittstelle ergänzt: `LanguageAcademyCourseEntry.speechQaSnapshot()`.

## Nicht verändert
- CTC/Lohr-Simulation
- Admin-Portal
- Highscore
- Teilnahmecode/Auth
- Supabase/Firebase-Struktur
- Server-/API-Infrastruktur

## Tests
- JS-Syntaxprüfung: `node --check js/modules/language-course-entry-module.js` bestanden.
- Node-basierter Diagnostics-Smoke-Test mit Mock-`SpeechRecognition` bestanden.
- Neue Browser-Testdatei: `tests_phase30b_browser_speech_upgrade.html`.
- Alte Phase-30-Testdatei wurde auf Phase 30B aktualisiert: `tests_phase30_speaking_trainer.html`.

## Einschränkung
Ein echter Mikrofontest mit Browserberechtigung konnte in dieser Umgebung nicht live durchgeführt werden. Die technische Integration, Zustände, Bewertungslogik, Fallbacks und QA-Snapshots wurden jedoch statisch und per Mock geprüft. Final muss auf Zielgeräten getestet werden, insbesondere iPhone/Safari, Chrome/Android und Desktop Chrome/Edge.
