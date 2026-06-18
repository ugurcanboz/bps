# G26.1 – Systeminfo TaskCount Fix

## Problem
Im Systeminfo-Panel wurde `0 Aufgaben` angezeigt, obwohl die Aufgabenbank-Dateien geladen waren.

## Ursache
Die Diagnosefunktion `taskCount()` zählte nur verschachtelte Arrays in `window.QUESTION_BANK_EXTERNAL`.
Die aktuelle Aufgabenbank liegt jedoch überwiegend als flache Objektliste vor. Dadurch ergab die Summe fälschlich `0`.

## Fix
- Neue robuste Funktion `questionBankSnapshot()` ergänzt.
- Zählt flache Aufgabenobjekte und verschachtelte Arrays.
- Nutzt zusätzlich `EGTQuestionBankQuality.audit().total`, wenn verfügbar.
- Diagnose zeigt nun zusätzlich Quellen-/Eintragsanzahl und Gruppenübersicht.
- Version/Cache auf G26.1 aktualisiert.

## Nicht verändert
- Neon-Startseite
- Admin-/Dozentenrechte
- Teilnehmerprofile
- Hilfebedarf-Filter
- Login/Portal-Schließen
