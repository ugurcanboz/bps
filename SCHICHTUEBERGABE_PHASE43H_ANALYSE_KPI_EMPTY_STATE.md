# Schichtübergabe – G54.42.9 Analyse KPI-Karten + Empty-State

## Ziel
Analyse Dashboard V2 zeigt KPI-Karten nicht mehr scheinexakt mit Fallback-Prozenten, wenn keine echten Daten vorhanden sind. Stattdessen werden echte Adapterwerte genutzt, sobald gespeichert, und bei fehlenden Daten ein sauberer Empty-State angezeigt.

## Geändert
- `js/ui-home-renderer.js`
  - KPI-Rendering in `analysisV2KpiHtml(...)` ausgelagert.
  - Empty-State via `analysisV2EmptyStateHtml(...)` ergänzt.
  - KPI-Karten nutzen `runs`, `best`, `score`, `forecast`, `focus` aus `EGTAnalysisDataAdapter`.
  - Bei fehlenden echten Daten werden sensible Werte als `—` und nicht als scheinpräzise Prozentwerte angezeigt.
  - Datenquelle-Chip ergänzt.
- `js/modules/egt-analysis-data-adapter.js`
  - Version auf `G54.42.9-kpi-real-values-empty-state`.
  - `emptyState` und `kpiReady` im Dashboard-Payload ergänzt.
- `css/phase39i-pixel-polish.css`
  - Empty-State-Card und Data-Chip ergänzt.
  - KPI-Tones für empty/ok/best/forecast/focus ergänzt.
- Version/Cache
  - AppConfig, Manifest, Update-Check und Service Worker auf G54.42.9 / `egt-trainer-g54-42-9`.
- QA
  - `tests_phase43h_analysis_kpi_empty_state.html` ergänzt.

## Nicht geändert
- Keine Adminlogik.
- Keine Aufgabenlogik.
- Keine Bottom-Menü-Optik.
- Keine Datenbank-/Cloud-Pflicht.
- Keine echte Prognose-Engine.
- Keine neuen Diagramm-Engines.

## Nächster sinnvoller Schritt
G54.43.0 – Hauptdiagramm mit mehreren Linien und echter Legenden-/Datenbindung.
