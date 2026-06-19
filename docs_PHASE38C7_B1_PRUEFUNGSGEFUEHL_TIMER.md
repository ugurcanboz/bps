# Phase 38C.7 – B1 Prüfungsgefühl / Timer / mobile Prüfungssimulation

## Ziel
Die B1-Prüfungssimulation soll nicht mehr wie ein normaler Übungsbereich wirken, sondern deutlich prüfungsnäher: Timer, Statusdruck, Warnhinweise, Abschlussstatus und mobile Prüfungsansicht.

## Eingebaut

- sichtbare Prüfungsdruck-Leiste pro Prüfungsteil
- Countdown-Timer pro Teilbereich
- Zeitbalken mit Warnzuständen
- Statusanzeige für abgeschlossene Teile
- Proctor-Hinweise in Aufgabenbereichen
- mobile Optimierung für iPhone/iPad
- automatische Speicherung bleibt aktiv
- Zeitüberschreitung wird als kritischer Faktor in der Bewertung markiert

## Keine Prüfungsfreigabe
Es wurde bewusst keine Freigabe- oder Zertifikatslogik eingebaut. Die App gibt weiterhin nur Ergebnisbericht, Prognose und Empfehlung aus.

## Bewertungslogik
Lesen und Hören bleiben objektiv lokal. Schreiben und Sprechen nutzen lokale Vorprüfung plus optional Groq als strengen Prüfungslehrer. Der Timer ist visuell und prüfungsnah. Wenn ein Teil rechnerisch über Zeit geht, wird der Teil kritisch markiert.

## QA
- Syntaxcheck `js/modules/language-exam-shell.js`
- Service-Worker-Assetcheck
- Testseite `tests_phase38c7_b1_pruefungsgefuehl_timer.html`
- kein Groq-Key im Frontend
