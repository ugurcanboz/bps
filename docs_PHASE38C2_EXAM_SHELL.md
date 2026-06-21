# Phase 38C.2 – Sichtbare Exam Shell / Prüfungsmodus-Grundgerüst

## Ziel

Phase 38C.2 macht die in Phase 38C.1 gebaute harte Prüfungsarchitektur sichtbar nutzbar. Die App erhält einen eigenen Prüfungsbereich für A1 bis C2.

## Eingebaut

- Neue Datei `js/modules/language-exam-shell.js`
- Dashboard-Karte „Prüfungssimulation“ im Sprachkurs
- Niveauwahl A1, A2, B1, B2, C1, C2
- Prüfungssession mit Teilnavigation
- Prüfungsteile: Lesen, Hören, Schreiben, Sprechen
- lokale Pilotbewertung für Lesen/Hören
- lokale Vorprüfung für Schreiben
- hybride Sprechbewertung über `LanguageExamEngine.assessSpeakingExam`
- Ergebnisbericht, wenn alle vier Teile bewertet wurden
- Session-Speicherung im Browser über `localStorage`
- iPhone/iPad-Safe-Mode: Sprechen kann als bestätigtes Transkript eingetragen werden

## Bewertungsprinzip

Die Prüfungssimulation ist absichtlich strenger als normale Kursaufgaben.

- Lesen und Hören werden im Grundgerüst lokal bewertet.
- Schreiben wird zunächst lokal hart vorgeprüft.
- Sprechen nutzt lokale Bewertung plus optional Groq als Prüfungslehrer.
- Groq ist kein Dauer-Chat, sondern ein gezielter Mitprüfer.

## Nutzerfluss

1. Sprachkurs öffnen
2. Karte „Prüfungssimulation“ öffnen
3. Niveau wählen
4. Prüfungsteil bearbeiten
5. Teil bewerten
6. Nächsten Teil öffnen
7. Nach vier Teilen Ergebnisbericht anzeigen

## Neue öffentliche Schnittstelle

`window.LanguageExamShell`

Methoden:

- `open()`
- `start(level)`
- `resume()`
- `summaryCardHtml()`
- `diagnostics()`
- `loadSession()`
- `clearSession()`

## Sicherheit

Kein Groq-Key ist im Frontend enthalten. Groq wird weiterhin nur über den Cloudflare Worker angesprochen.

## Status

Phase 38C.2 ist ein sichtbares Grundgerüst. Die Pilotaufgaben für Lesen/Hören sind noch bewusst einfach gehalten. In den nächsten Phasen werden die echten harten Prüfungsaufgaben pro Niveau ausgebaut.
