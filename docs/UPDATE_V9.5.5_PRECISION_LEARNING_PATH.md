# Update V9.5.6 · Precision Learning Path

Ziel: Der Coach soll nicht nur allgemeine Fehler erkennen, sondern konkrete Denkfehlerpfade nutzen und daraus einen echten Lernpfad bauen.

## Neu

- Fehlerpfad-Diagnose pro Aufgabentyp
  - Zahlenreihe: `difference_only_checked`, `secondary_pattern_missed`, `correct_logic_wrong_calc`, `rule_fixed_too_early`
  - Matrix/visuelle Logik: `rotation_confused`, `mirror_confused`, `row_pattern_missed`, `column_pattern_missed`
  - IT/EDV: `dns_ip_confused`, `ip_dns_confused`, `hardware_mapping_error`, `it_cause_chain_missed`
  - Mathe: `value_role_confused`, `near_result_calc_slip`, `operation_choice_wrong`
  - Sprache: `opinion_fact_confused`, `keyword_misread`, `context_missed`
  - Konzentration: `similar_symbol_confused`

- Lernpfad-Regie
  - Einstieg
  - Diagnose
  - Revanche
  - Challenge
  - Abschluss

- Exaktere Revanche-Targets
  - gleicher Skill
  - gleicher Subtype
  - gleiche Trap
  - gleiche `revengeSignature`

- ErrorPath-Statistik
  - dominante Denkfehler werden gespeichert
  - Command Center kann den Fokus anzeigen

- Neue API
  - `learningPathPlan(options)`
  - `errorPathReport()`
  - `categoryErrorPath(payload, dna)`

## Didaktischer Zweck

Der Coach soll nicht nur sagen „falsch“, sondern erkennen, ob der Nutzer zum Beispiel nur die letzte Differenz einer Zahlenreihe fortgeführt, DNS/IP verwechselt oder bei Prozentaufgaben die Wertrollen vertauscht hat. Dadurch wird die nächste Aufgabe nicht nur ähnlich, sondern gezielt am gleichen Denkfehler ausgerichtet.

## Integration

Für beste Ergebnisse sollte die Haupt-App bei `recordAnswer(...)` möglichst mitgeben:

```js
coach.recordAnswer({
  taskId: task.id,
  correct: false,
  givenIndex: selectedIndex,
  selectedText: task.answers[selectedIndex],
  correctText: task.answers[task.correct],
  duration: elapsedMs,
  task: task,
  dna: task.dna
});
```

Ohne `selectedText` und `correctText` funktioniert die Diagnose weiterhin, aber weniger präzise.
