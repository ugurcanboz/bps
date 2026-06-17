# Phase 30 · Mikrofon-Sprechfunktion / Aussprachetrainer v1

## Ziel
Phase 30 integriert erstmals eine echte Sprechfunktion in das Sprachkurs-Modul. Teilnehmer können eine Sprechaufgabe öffnen, einen Satz über das Mikrofon nachsprechen und eine einfache Erkennungsbewertung erhalten.

## Umgesetzt
- neuer Aufgabentyp `speaking_practice`
- SpeechRecognition/WebkitSpeechRecognition-Adapter
- Button `Sprich jetzt`
- Mikrofon-Check im Dashboard
- Sprechtraining-Karte im Sprachkurs-Dashboard
- Fallback, wenn Browser/Gerät keine Spracherkennung unterstützt
- einfache Ähnlichkeitsbewertung des erkannten Textes
- Speicherung von Transcript, Score und Feedback im lokalen Sprachkurs-Lernstand
- Integration in bestehende Aufgabe-UI mit `Antwort prüfen` und `Weiter`

## Datenschutz/Berechtigung
Das Mikrofon wird nur nach aktiver Nutzeraktion gestartet. Der Browser fragt die Mikrofonberechtigung ab. Ohne Berechtigung erscheint ein stabiler Hinweis statt eines Absturzes.

## Nicht enthalten
- serverseitige Spracherkennung
- Vosk/Whisper-Anbindung
- phonetische Detailbewertung
- dauerhafte Audioaufzeichnung
- Cloud-Sync echter Audiodateien

## Status
Phase 30 ist als Aussprachetrainer v1 integriert und bereit für echte Gerätetests.
