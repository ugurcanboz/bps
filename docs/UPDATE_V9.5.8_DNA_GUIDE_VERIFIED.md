# Update V9.5.8 DNA Guide Verified

Diese Version enthält eine überprüfte und neu verpackte Gesamt-ZIP des Coach-Moduls.

## Ergänzt

- `docs/DATABASE_DNA_INTEGRATION_GUIDE.md`
- README-Verweis auf DNA-Guide, DNA-Contract und Mini-DNA

## Zweck

Die Person, die das Coach-Modul später integriert, soll eindeutig erkennen:

1. Welche DNA-Felder Aufgaben benötigen.
2. Warum diese Felder für Lernintelligenz wichtig sind.
3. Wie falsche Antworten über `distractors` Denkfehler auslösen.
4. Wie die Haupt-App nach jeder Antwort `recordAnswer(...)` aufrufen muss.
5. Wie die Aufgabenbank über `databaseDNAAudit()` geprüft wird.

## Qualitätsregel

Ohne DNA funktioniert der Coach über Fallback-Schätzung. Für Premium-Qualität ist DNA in der Aufgabenbank verbindlich nachzuziehen.
