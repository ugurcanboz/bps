# SCHICHTÜBERGABE · PHASE 43U · QA Bubble Always-On-Top Hotfix

## Version
G54.43.8D

## Ausgangslage
Nach G54.43.8C funktionierte die QA-Bubble grundsätzlich: State aufnehmen, Text anzeigen und JSON-Capture waren nutzbar. Der Nutzer hat aber korrekt festgestellt, dass Analyse und Fortschritt als Deep-Sheet geöffnet werden und die QA-Bubble dabei überdecken. Dadurch konnte innerhalb dieser Deep-Sheets kein Capture ausgelöst werden.

## Umsetzung
- QA-Capture setzt im aktiven Modus Klassen auf `html` und `body`: `egt-qa-capture-active`.
- QA-Bubble und QA-Panel erhalten im QA-Modus `z-index: 2147483647 !important`.
- Deep-Sheet und Backdrop werden ausschließlich im QA-Modus unter die QA-Bubble gesetzt.
- Keep-on-top-Loop ergänzt: QA-Element wird regelmäßig wieder ans Ende von `body` gehoben und erhält erneut den höchsten z-index.
- Normale App-Nutzung ohne `?qa=capture` bleibt unverändert.
- Analyse/Fortschritt-Scroll wurde nicht erneut angefasst.

## Geänderte Dateien
- `index.html`
- `404.html`
- `js/qa/egt-visual-state-capture.js`
- `css/phase43s-iphone-scroll-qa-bubble.css`
- `tests_phase43u_qa_bubble_always_on_top.html`
- `WORKING-PLAN.md`

## Testanweisung iPhone
1. App öffnen mit `?qa=capture`.
2. Analyse öffnen.
3. Prüfen: QA-Bubble muss über dem Deep-Sheet sichtbar bleiben.
4. QA-Bubble antippen.
5. State aufnehmen → Text anzeigen → JSON hier einfügen.
6. Danach dasselbe im Fortschritt/Mehr-Deep-Sheet testen.

## Wichtig
Dieser Fix ist bewusst nur für den QA-Modus aktiv. Er darf normale Nutzer ohne QA-Parameter nicht beeinflussen.
