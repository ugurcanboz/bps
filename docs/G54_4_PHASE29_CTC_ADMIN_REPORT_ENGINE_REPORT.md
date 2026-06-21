# G54.4 · Phase 29 · CTC Admin/Dozent Block Reporting

## Ziel
CTC-Lohr-Ergebnisse werden nicht mehr nur als Gesamtprozent gespeichert, sondern blockweise auswertbar gemacht. Diese Auswertung dient Admin-/Dozentenportal, Coach-Analyse und späteren Teilnehmerprofilen.

## Scope
Nur für `Simulation → IT/FISI → CTC` (`mode=ctcLohr`, `branch=it`, `simType=ctc`, `pool=it-ctc`).

## Neu
- `js/core/ctc-admin-report-engine.js`
- `docs/visual-qa-g54-4/`

## Blockauswertung
- Allgemeinwissen: 40 Fragen / 420s
- Mathe Sprint: 9 Aufgaben / 198s
- CTC-Regelrechnung: 6 Eingabeaufgaben / 240s
- Buchstaben-Konzentration: 4 Eingabeaufgaben / 160s
- Tabellen ablesen: 2 Tabellenblöcke / 180s
- FlowLogic: 1 Aufgabe / 780s

## Persistenz
`ResultPersistenceEngine.buildRecord()` reichert CTC-Lohr-Datensätze automatisch an:
- `ctcReport`
- `ctcBlockStats`
- `ctcWeakestBlock`
- `exam.ctcReportVersion`

## Admin-Event
Admin-/Dozenten-Events enthalten bei CTC-Lohr zusätzlich:
- `ctcReport`
- `ctcBlockStats`
- `ctcWeakestBlock`
- `ctcReportSummary`

## Admin-Domain-Fassade
`AdminPortalDomainEngine` bietet neue Diagnose-/Adaptermethoden:
- `ctcReportFromHistory(history, quiz, opts)`
- `ctcReportFromResult(result)`
- `renderCtcReportSummary(report)`
- `enrichCtcAdminEvent(payload)`

## QA
- Scope-Negativtest: BPS/Training/Sozial/Kaufmännisch blockiert
- Sample-Report: 6 Blöcke, 62 Gesamtfragen, 32:58 Gesamtzeit
- Regelrechnung bleibt Eingabe-Aufgabe
- Tabellen/Buchstaben/FlowLogic werden als Input-/Spezialaufgaben erkannt
