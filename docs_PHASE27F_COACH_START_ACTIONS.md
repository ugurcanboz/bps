# Phase 27F – Coach Start-Button-Logik

## Ziel
Die Coach-Empfehlungen aus Phase 27C/27D werden nicht nur angezeigt, sondern starten jetzt gezielt den passenden Sprachkurs-Flow.

## Umgesetzt

- `startCoachRecommendation(action)` als zentraler Coach-Action-Router erweitert.
- Empfehlung „Fehler zuerst klären“ startet Fehlertraining.
- Wiederholungsset „5 Fehler wiederholen“ springt direkt zur ersten offenen Fehleraufgabe.
- Empfehlung „Vokabeln wiederholen“ startet direkt den Vokabeltrainer.
- Empfehlung „Schwachen Aufgabentyp üben“ startet gezielt den betroffenen Aufgabentyp.
- Empfehlung „Auffällige Lektion festigen“ öffnet die passende Lektion.
- Fallback bleibt stabil: unbekannte Aktion → Weiterlernen.
- Letzte Aktivität wird beim Coach-Start protokolliert.

## Bewusst nicht geändert

- Kein Chatbot-Fenster gebaut.
- Kein CTC-Code geändert.
- Kein Admin-Portal geändert.
- Kein Highscore geändert.
- Keine Cloud-Sync-Migration.

## Abnahme

- JS-Syntaxprüfung: PASS
- Coach-Aktionsstrings vorhanden: PASS
- Task-Type-Training-Router vorhanden: PASS
- Vokabeltraining-Start vorhanden: PASS
- Fehlertraining-Start vorhanden: PASS

## Nächster Schritt
Phase 27G sollte eine visuelle QA der Coach-Flows machen: Karten, Buttonpositionen, Rücknavigation und Verhalten auf iPhone/iPad/Desktop.
