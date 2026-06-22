# Phase 26D – Audio-/Hörverständnis-Vorbereitung

## Ziel
Phase 26D ergänzt das Sprachkurs-Modul um eine stabile Grundlage für Hörverständnis, ohne die Hauptapp-Systeme CTC, Admin oder Highscore zu verändern.

## Eingebaut
- Neuer Aufgabentyp `listening_choice`
- Browser-Speech-Fallback über `speechSynthesis`
- Audio-Testkarte im Sprachkurs-Dashboard
- Hör-Aufgabe in A1 · Begrüßungen
- Audio-Play-Button innerhalb der Aufgaben-UI
- Auswahl/Prüfen/Weiter-Flow bleibt identisch zu Multiple Choice
- Task-Type-Registry erweitert
- Adaptive Engine erhält weiterhin den konkreten Aufgabentyp
- CSS für Audio-Karte und Touch-Button ergänzt

## Wichtig
Die aktuelle Umsetzung nutzt bewusst noch keine feste Audiodatei und keine serverseitige TTS-Engine. Das ist Absicht: Die UI und der Aufgabenfluss sind jetzt vorbereitet, sodass später Piper, Vosk oder echte Audiodateien angeschlossen werden können.

## Abnahme
- Dashboard zeigt Hörverständnis-Karte
- Audio testen ist klickbar
- A1 enthält mindestens eine Hör-Aufgabe
- Hör-Aufgabe zeigt Audio-Button
- Antwortauswahl funktioniert wie bei Multiple Choice
- Hilfe zeigt keine Lösung
- JS-Syntaxprüfung: PASS
