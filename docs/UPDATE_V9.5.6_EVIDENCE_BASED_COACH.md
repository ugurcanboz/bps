# Update V9.5.6 – Evidence-Based Coach

Ziel: Die Lernintelligenz soll nicht nur Begriffe im Code tragen, sondern ihre Entscheidungen beweisbarer machen.

## Neu

- Antwortfallen-/Distractor-Schema wird ausgewertet (`distractors`, `distractorMap`, `answersMeta`, `optionsMeta`).
- Mastery-Score pro Skill (`memory.mastery`) mit Treffer, Tempo, Revanche-Erfolg und Fehlerdiagnose.
- Prüfungsampel pro Bereich (`BPS Mathe`, `BPS IT`, `CTC Logik`, `CTC Zeitdruck` usw.).
- Exaktere Revanche-Suche nach `errorPath`, `skillKey`, `subtype`, `trap` und `revengeSignature`.
- Command Center zeigt Prüfungsbereiche und Mastery-Signale.

## Empfohlenes Datenbank-DNA-Schema für Antwortfallen

```js
{
  id: "zr_001",
  category: "logik",
  subtype: "zahlenreihe_wechselmuster",
  difficulty: 4,
  skill: "musterwechsel_erkennen",
  expectedTimeMs: 12000,
  trap: "lineare Addition statt Wechselmuster",
  examTarget: "ctc",
  distractors: [
    {
      value: "21",
      errorPath: "pattern/difference_only_checked",
      hint: "Du hast nur die letzte Differenz fortgeführt.",
      remediation: "Wechselmuster als A-B-A-B prüfen.",
      revengeSignature: "series_difference_only"
    }
  ]
}
```

## Warum wichtig?

Ohne `distractors` erkennt der Coach Fehler nur heuristisch. Mit `distractors` erkennt er den konkreten Denkfehler der gewählten falschen Antwort und kann Revanche-Aufgaben präziser auswählen.
