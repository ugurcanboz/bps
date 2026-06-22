# G39.12 · Admin Phase 8 · Berichte & Export

Build: `G39.12-ADMIN-PHASE8-REPORTS-2026-06-14`

## Ziel

Der Admin-Bereich sollte nicht nur Daten exportieren, sondern für Bildungsträger verwertbare Auswertungen liefern. Phase 8 baut deshalb ein echtes Reporting-Modul mit Berichtstypen, Vorschau und Exportlogik.

## Umsetzung

- Neuer Berichtstyp-Umschalter im Tab `Berichte`
- Berichtstypen: Teilnehmer, Gruppen, Dozenten, Leistung, Hilfebedarf
- Einheitliche Dataset-Logik über `reportDataset(role, type)`
- CSV-Export je aktivem Berichtstyp
- JSON-Export je aktivem Berichtstyp
- Textbericht je aktivem Berichtstyp
- Druck-/PDF-Ansicht als Browser-Print-HTML
- Berichtsvorschau als scrollbare Tabelle
- Dozentenrechte werden berücksichtigt
- Admin sieht Gesamtbestand, Dozent sieht nur eigene Gruppen

## Bewusste Designentscheidung

Direkte PDF-Erzeugung wurde nicht als Fake-Download eingebaut. Stattdessen öffnet die App eine saubere Druckansicht, die der Browser zuverlässig als PDF speichern kann. Das ist für eine Offline-PWA stabiler und professioneller.

## QA

- JavaScript-Syntax mit `node --check` geprüft
- Admin-Portal bleibt ohne zusätzliche externe Bibliotheken lauffähig
- Bestehende CSV/JSON-Hilfebedarf-Exports bleiben kompatibel
