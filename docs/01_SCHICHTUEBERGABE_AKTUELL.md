# Schichtübergabe aktuell · G54.46.8

## Aktueller Stand
G54.46.8 ist im Quellcode abgeschlossen. Sprachcontent Deutsch/Englisch A1–C2 wurde generatorseitig bereinigt und durch ein reproduzierbares Content-Gate abgesichert. REL-P0-009 und REL-P0-011 sind geschlossen. Als letzter offener P0-Quellcodepunkt bleibt REL-P0-012 Groq-Worker-Härtung; zusätzlich bleiben Security-/Ledger-Staginggates offen.

## Nächster Schritt
G54.46.9 · Sprachtraining didaktisch wirksam und transparent machen: Lernziel, Erklärung, geführte Übung, freie Anwendung, Feedback und nächste Empfehlung pro Lektion vereinheitlichen.

## Verbindliche Nachweise
- `release/G54.46.8_LANGUAGE_CONTENT_TEST_RESULT.json`
- `release/G54.46.8_LEVEL_DIFFERENTIATION_TEST_RESULT.json`
- `release/G54.46.8_STATIC_VALIDATION.json`
- `release/G54.46.8_RELEASE_BACKLOG.csv`

---

# Schichtübergabe · G54.46.4

## Ausgangslage
G54.46.0 fror die Release-Basis ein. G54.46.1 stabilisierte den Adminstart. G54.46.2 verlagerte Rechte in Claims, Rules und Functions. G54.46.3 führte das echte Activity Ledger ein. G54.46.4 korrigiert nun die darauf basierenden Admin-KPIs und Diagramme.

## In G54.46.4 erledigt
- neue reine Analytics-Engine `js/core/admin-analytics-engine.js`
- Simulationen nach gestartet, abgeschlossen, abgebrochen und unklassifiziert getrennt
- Dashboard-Haupt-KPI auf „Simulationen abgeschlossen“ korrigiert
- Aktivität der letzten sieben Tage ausschließlich aus `activitySummary.daily`
- Session-Startzeiten ausschließlich aus `activitySummary.heat`
- „kürzlich aktiv“ ausschließlich aus `lastEventAt`/`lastSessionAt`
- Rollenquellen aus Teilnehmern, Dozentenregister und aktuellem Admin dedupliziert
- Demo-Dozenten und Demo-Teilnehmer als Demo getrennt
- gewichtete Schwächen aus echten Ledger-Antworten
- exakter Zeitraum, Datenquelle und Abdeckung sichtbar
- ehrliche Leerzustände ohne Legacy-Hochrechnung
- Started-Zähler in Browser- und Server-Ledger ergänzt
- 28 feste Sollwertprüfungen und 13 Integrationsguards grün

## Wichtige Grenze
Die Rollenansicht ist ausdrücklich eine Übersicht der **bekannten Konten**, keine globale Firebase-Auth-Nutzerliste. Weitere Admins, die nicht als aktuelles Konto oder Profil geladen sind, können clientseitig nicht inventarisiert werden.

## Nicht abgeschlossen
Der Playwright/Chromium-Lauf wurde durch `ERR_BLOCKED_BY_ADMINISTRATOR` verhindert. Desktop-, iPhone- und iPad-Visual-QA muss in einer erlaubten Browserumgebung wiederholt werden.

## Noch zwingend vor Produktionsfreigabe
- Rules, Functions und App Check deployen und im Staging negativ testen
- Ledgerdeployment/Emulator-Abnahme durchführen
- Responsive Adminfehler und verklebte Labels beheben
- Reviewlogik reparieren
- Sprachcontent vollständig prüfen
- synthetische Daten produktiv markieren/deaktivieren
- Leveldifferenzierungstest grün machen
- Groq-Worker vollständig auditieren

## Unmittelbar fortsetzen mit
`G54.46.5 · Adminoberfläche visuell und funktional finalisieren`

Schwerpunkte: Aufgabenbank/System/Berichte, mobile Karten statt überbreiter Tabellen, klar erkennbare Tab-Navigation, Touchziele und vollständige visuelle QA.
