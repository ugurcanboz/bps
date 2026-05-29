# UPDATE V9.3.1 – KI Coach V2.1 Datenbank-Hybrid

## Ziel
Der KI-Coach nutzt nicht mehr nur eigene kleine Generator-Aufgaben, sondern koppelt sich direkt an die vorhandene Aufgabendatenbank der App. Dadurch wirkt das Coach-Training prüfungsnäher, individueller und weniger wiederholt.

## Neu
- Datenbank-Hybrid-Layer im Coach Engine Core
- automatische Erkennung der vorhandenen `QUESTION_BANK_EXTERNAL` Aufgaben
- adaptive Auswahl nach Skill, Schwierigkeit, Schwächen, Wiederholungen und Qualität
- Wiederholungssperre über IDs und Signaturen
- geprüfte Bank-Aufgaben werden mit Coach-DNA, Fallenhinweis und Dopamin-Feedback angereichert
- Transfer-Aufgaben bleiben als Abwechslung erhalten
- Coach-Hub zeigt Aufgabenbank-Kopplung und Bank-Statistik

## Ergebnis
Coach-Runden bestehen jetzt primär aus echten Aufgabenbank-Fragen und ergänzenden Transfer-Reizen. Der Generator ersetzt die Datenbank nicht, sondern arbeitet als Trainings-Regisseur darüber.

## Checks
- `node --check js/learning-coach-engine.js`
- `node --check js/learning-coach-ui.js`
- `node scratch/test-coach-v2-1-db.js`

