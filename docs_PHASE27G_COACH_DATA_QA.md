# Phase 27G – Coach Daten-QA & Abschlussprüfung

## Ziel
Phase 27G prüft, ob der KI-Lehrer nicht nur sichtbar ist, sondern wirklich aus Sprachkursdaten arbeitet.

## Geprüfte Datenquellen

- offene Fehler aus dem Fehlertraining
- fällige Vokabeln aus dem Vokabeltrainer
- schwache Aufgabentypen aus der Aufgabenanalyse
- auffällige Lektionen aus dem A1-Kursbaum
- aktuelle Lektion / Weiterlernen-Zustand
- letzter Lernstand und Aktivität

## Ergebnis

PASS.

Der Coach besitzt nun einen eigenen QA-Snapshot:

```js
LanguageAcademyCourseEntry.coachQaSnapshot()
```

Dieser Snapshot liefert:

- Datenqualität
- Anzahl Empfehlungen
- Anzahl Wiederholungssets
- Startaktionen
- verwendete Datenquellen
- Fallback-Verhalten

## Abnahmekriterien

| Kriterium | Status |
|---|---:|
| Coach nutzt echte Fehlerdaten | PASS |
| Coach nutzt Vokabelstatus | PASS |
| Coach erkennt schwache Aufgabentypen | PASS |
| Coach erkennt auffällige Lektionen | PASS |
| Start-Buttons verweisen auf echte Flows | PASS |
| Fallback auf Weiterlernen vorhanden | PASS |
| DE/TR Coach-Texte bleiben erhalten | PASS |
| JS-Syntaxprüfung | PASS |

## Hinweis
Phase 27G ist eine QA- und Absicherungsphase. Es wurden keine neuen Fremdbereiche verändert.

Nicht verändert:

- CTC
- Admin
- Highscore
- Auth
- Supabase/Firebase

## Freigabe
Phase 27 ist damit fachlich bereit für Phase 28: Cloud-Sync für Sprachkursfortschritt.
