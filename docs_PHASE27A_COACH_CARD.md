# Phase 27A – KI-Lehrer-Karte / Coach v1

## Ziel
Phase 27A integriert den KI-Lehrer nicht als Chatbot, sondern als datenbasierte Coach-Karte im Sprachkurs-Dashboard.

## Umgesetzt

- Neue Coach-Analysefunktion `coachInsight()`
- Neue Dashboard-Karte `la-coach-card`
- Neue Detailansicht `openCoachPanel()`
- Button „Empfehlung starten“
- Keine freie Chatbot-Oberfläche
- Keine Änderungen an CTC, Admin oder Highscore

## Genutzte Datenquellen

Der Coach nutzt nur vorhandene Sprachkursdaten:

- aktueller Kurs / aktuelle Lektion
- Trefferquote
- offene Fehler
- Vokabel-Wiederholungsstatus
- adaptive Lesson-Analyse

## Empfehlungslogik v1

Priorität:

1. Offene Fehler → Fehlertraining starten
2. Vokabeln mit Wiederholungsstatus → Vokabeltrainer öffnen
3. Angefangene Lektion → Weiterlernen
4. niedrige Trefferquote → Wiederholen
5. sonst → aktuelle Lektion fortsetzen

## UI-Regel

Der Coach wirkt wie ein digitaler Lehrer:

- kurze Empfehlung
- Begründung
- klare Start-Aktion
- keine offene Chatbox
- Hauptapp-konformes dunkles Kartendesign

## QA

- JS-Syntaxprüfung: PASS
- Export `coachInsight`: PASS
- Dashboard enthält Coach-Karte: PASS
- Coach-Panel öffnet: PASS
- Empfehlung startet vorhandene Flows: vorbereitet

## Freigabe

Phase 27A ist fachlich und technisch abgeschlossen. Phase 27B kann die Analyse tiefer machen, etwa nach Aufgabentypen und Lernschwächen.
