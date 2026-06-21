# Phase 38C.12A – Academy-Hartmodus UX-Fix

## Ziel
Die vom Nutzer gemeldeten UI-Bugs im Prüfungsmodus wurden repariert:

- Kontrastfehler: helle Karten mit heller Schrift entfernt.
- Prüfungsfenster vergrößert: Desktop nutzt deutlich mehr Breite und Höhe.
- Scroll-Verhältnis verbessert: Header bleibt oben, Body scrollt kontrolliert, Aktionen bleiben leichter erreichbar.
- Mobile Ansicht: Prüfungsmodus wird auf kleinen Geräten nahezu Fullscreen.
- Positionierung: kein Standardmodus mehr, sondern klarer Academy-Hartmodus.

## Grundsatz
Die App kopiert keine offizielle Prüfung 1:1. Sie orientiert sich am GER und typischen Prüfungsformaten, setzt die Messlatte aber bewusst höher.

> Wer den Academy-Hartmodus stabil besteht, soll echte Prüfungen mit Reserve angehen können.

Keine Garantie, kein offizielles Zertifikat, keine Prüfungsfreigabe.

## Technische Änderungen

Geändert:

- `css/language-course.css`
- `js/modules/language-exam-shell.js`
- `service-worker.js`
- `update-check.json`
- `WORKING-PLAN_1.md`

Neu:

- `docs_PHASE38C12A_HARDMODE_UX_FIX.md`
- `tests_phase38c12a_hardmode_ux_fix.html`

## QA-Pflicht

Nach Upload testen:

1. Prüfungsmodus öffnen.
2. Levelauswahl A1–C2 prüfen.
3. Kontrast aller Karten prüfen.
4. Desktop: Fenstergröße prüfen.
5. iPad/Handy: Fullscreen-Verhalten prüfen.
6. Scroll-Verhältnis prüfen.
7. B1 und B2 auswählbar prüfen.
