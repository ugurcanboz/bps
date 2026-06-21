# G51.2 · Answer Stability / Layout Guard Fix

## bestätigte Ursache
Der Layout-Guard entfernte nach `egt:question-rendered` die produktive Klasse `training-cockpit`, weil sie fälschlich als Experiment-Klasse eingestuft war. Dadurch wurde das Quiz zuerst im Cockpit-Grid gerendert und ca. 120 ms später in ein anderes Layout zurückgesetzt. Ergebnis: Antwortkarten sprangen sichtbar hin und her.

## Fix
- `training-cockpit` wird nicht mehr entfernt.
- Während aktiver Simulation wird `training-cockpit` bei Bedarf wiederhergestellt.
- Touch-Hover/Active-Transforms auf Antwortkarten wurden für grobe Pointer deaktiviert.
- Antwortcontainer erhält eine Stabilitäts-Schicht mit `contain: layout paint`.

## Erwartung
Nach Aufgabenrender bleiben Frage, Antwortkarten und Navigation geometrisch stabil.


## Visuelle Headless-Prüfung

Es wurde eine gezielte Chromium-Prüfung mit echter CSS-Schicht und echtem `layout-guard-engine.js` durchgeführt. Der Test simuliert den kritischen Ablauf: Aufgabe gerendert → `egt:question-rendered` ausgelöst → 200 ms / 1200 ms warten → Antwortpositionen vergleichen.

### Reproduktion mit G51.1
- `training-cockpit` wurde nach ca. 120 ms entfernt.
- Desktop: Antwortbereich sprang von Top 374 auf Top 443.
- iPad/iPhone-Simulation: Antwortbereich sprang von Top 452 auf Top 411 und die Buttons wechselten von einer stabilen Spalte zu zwei Spalten.

### Ergebnis mit G51.2
- `training-cockpit` blieb auf Desktop, iPad und iPhone erhalten.
- Antwortbereich-Delta nach 1200 ms: 0 px.
- Button-Top-Deltas nach 1200 ms: alle 0 px.

Siehe: `docs/G51_2_VISUAL_STABILITY_RESULTS.json`.
