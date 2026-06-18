# Phase 27B – KI-Lehrer Analyse-Engine

## Ziel
Die Coach-Karte aus Phase 27A wurde zu einer echten Analyse-Schicht erweitert. Der Sprachkurs-Coach entscheidet nicht mehr nur grob nach Fehler/Vokabel/Weiterlernen, sondern wertet mehrere Datenquellen aus.

## Datenquellen
- Sprachkursfortschritt
- offene Fehler aus Fehlertraining
- Trefferquote
- aktuelle Lektion
- Lektionserledigung
- Vokabelstatus: neu / kann ich / wiederholen
- Aufgabentypen mit Fehlerhäufigkeit
- letzte Aktivität

## Neue Auswertung
Der Coach berechnet:
- Datenbasis in Prozent
- Priorität: niedrig / normal / mittel / hoch
- stärkster Aufgabentyp-Schwachpunkt
- stärkste Lektions-Schwachstelle
- Lernplan in Reihenfolge
- Begründung der Empfehlung

## UI-Ergebnis
Dashboard-Karte zeigt weiterhin kompakt:
- Empfehlung
- Trefferquote
- offene Fehler
- Vokabel-Wiederholung
- Begründung
- Startbutton
- Analysebutton

Detailansicht zeigt zusätzlich:
- Datenbasis
- letzte Aktivität
- Fokus
- Lernplan
- Schwachstellen nach Aufgabentyp
- Schwachstellen nach Lektion

## Abgrenzung
Kein Chatfenster. Kein freier KI-Chat. Der Coach bleibt ein geführter Lernlehrer innerhalb der bestehenden Sprachkurs-App.

## QA
- JS-Syntaxprüfung: PASS
- Coach-Insight-Funktion vorhanden
- Phase-27B-Analysepanel vorhanden
- CSS für Analysezeilen vorhanden
- CTC/Admin/Highscore nicht verändert
