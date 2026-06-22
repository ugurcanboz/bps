# Phase 38C.14 – B1 Hardmode Gesamt-QA

## Ziel
Diese Phase validiert den Academy-Hartmodus als komplette B1-Prüfung nach den letzten UX-, Hör- und Grammatik-Erweiterungen.

Der B1-Hardmode besteht jetzt aus fünf Pflichtteilen:

1. Lesen
2. Hören
3. Grammatik & Sprachbausteine
4. Schreiben
5. Sprechen

Es gibt weiterhin keine Prüfungsfreigabe und kein offizielles Zertifikat. Die App erstellt einen Ergebnisbericht, eine Prüfungsreife-Prognose und konkrete Empfehlungen.

## Kernkorrektur
Die interne B1-QA wurde auf fünf Prüfungsteile korrigiert. Grammatik & Sprachbausteine ist jetzt auch in den QA-Endsimulationen ein echter Pflichtteil und kann die Gesamtprüfung verhindern.

## Validierte Szenarien

- `good-pass`: stabil bestanden
- `borderline-pass`: knapp bestanden
- `borderline-fail`: knapp nicht bestanden
- `weak-speaking`: Sprechen schwach → nicht bestanden
- `wrong-writing-topic`: Schreiben am Thema vorbei → nicht bestanden
- `incomplete-listening`: Hören offen → nicht bestanden
- `weak-grammar`: Grammatik/Sprachbausteine schwach → nicht bestanden
- `listening-helper-mode`: mit Transkript-Hilfsmodus bestanden, aber im Bericht markiert
- `groq-down-fallback`: Groq-Ausfall, lokaler Fallback stabil → bestanden

## Harte Regeln

- Gesamtpunkte allein reichen nicht.
- Alle fünf Prüfungsteile müssen abgeschlossen sein.
- Kein Pflichtbereich darf unter Mindestleistung fallen.
- Grammatik ist kein Bonus, sondern Teil der Hardmode-Prüfung.
- Hilfsmodus im Hören wird sichtbar im Ergebnis markiert.
- Groq-Ausfall darf die App nicht zerstören.

## Geänderte Dateien

- `js/modules/language-exam-engine.js`
- `js/modules/language-exam-shell.js`
- `data/language-exam-blueprints.js`
- `service-worker.js`
- `update-check.json`
- `WORKING-PLAN_1.md`

## Neue Dateien

- `docs_PHASE38C14_B1_HARDMODE_GESAMT_QA.md`
- `tests_phase38c14_b1_hardmode_gesamt_qa.html`

## QA-Erwartung
Die Testseite muss melden:

- Engine vorhanden
- Shell vorhanden
- 5-Pflichtteile aktiv
- Grammatik-Weakness führt zu Nichtbestehen
- Hören-Hilfsmodus wird markiert
- Groq-Fallback bleibt stabil
- alle B1-Hardmode-Szenarien bestehen die Erwartungsprüfung
