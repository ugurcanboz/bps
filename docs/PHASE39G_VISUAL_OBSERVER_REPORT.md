# Phase 39G – Visual Observer Report ausführen/auswerten

Basis: `Eignungstest-Trainer-G54.39F-Visual-Observer-QA-Cockpit.zip`  
Ziel: Das in Phase 39F gebaute Visual-Observer-System nicht weiter ausbauen, sondern als Prüfwerkzeug nutzen und daraus eine echte Fehlerliste ableiten.

## Kurzbewertung

| Kategorie | Anzahl | Bewertung |
|---|---:|---|
| HIGH | 0 | Keine akuten Release-Blocker aus den verfügbaren Artefakten ableitbar |
| MEDIUM | 4 | Vor Phase 40 gezielt prüfen/beheben |
| LOW | 5 | Pixel-Polish / technische Absicherung |

**Status:** Phase 39G ist als Report- und Auswertungsphase abgeschlossen.  
**Nächster sinnvoller Schritt:** Phase 39H – zuerst MEDIUM-Risiken beheben, besonders mobile Bottom-Dock-Abstände, Tablet-Gate-Layout und Scrollcontainer.

## Wichtiger Ausführungshinweis

Der Browser-Runner wurde ergänzt: `phase39g_visual_observer_report.py`.  
In dieser Sandbox wurde Playwright/Chromium beim Öffnen lokaler App-URLs durch eine Administrator-Policy blockiert (`ERR_BLOCKED_BY_ADMINISTRATOR`). Deshalb wurden die Befunde aus folgenden belastbaren Quellen abgeleitet:

- vorhandener Visual Observer: `js/qa-visual-observer.js`
- vorhandenes Cockpit: `tests_phase39f_visual_observer.html`
- bestandene Phase-39F-Static-QA: `phase39f_static_qa_result.json`
- vorhandene Browser-Screenshots aus Phase 39A
- statische CSS-/DOM-Risikoanalyse

Die ZIP enthält den Runner weiterhin, damit du den echten Browserlauf lokal oder in CI ausführen kannst.

## HIGH – kritische Fehler

| Bereich | Befund | Maßnahme |
|---|---|---|
| App | Keine HIGH-Blocker aus den verfügbaren Artefakten ableitbar. | Keine Sofort-Sperre nötig. |

## MEDIUM – echte UI-/UX-Probleme

| Bereich | Befund | Maßnahme |
|---|---|---|
| Mobile Home / Bottom Dock | Auf dem iPhone-Screenshot liegt der Bottom-Dock optisch sehr nah bzw. teilweise über dem unteren Kachelbereich. Risiko: Inhalte können am Scroll-Ende verdeckt wirken. | Globalen mobilen Content-Bottom-Spacer prüfen und für Dock-Seiten mindestens `dock-height + safe-area + 24px` sichern. |
| iPad Gate / Startscreen | Der iPad-Gate-Screen nutzt eine harte 2-Spalten-Aufteilung. Links bleibt sehr viel leerer Raum, rechts sitzt die komplette Auswahl. | Tablet-Breakpoint visuell ausbalancieren: links echten Hero-/Info-Inhalt oder Gate stärker zentrieren. |
| QA Tooling / Screenshots | Der Observer erzeugt DOM-Befunde und SVG-Visual-Maps, aber echte Pixel-Screenshots brauchen externen Browser/CI. | Phase 40 als Golden-Master-QA mit Playwright-Screenshots fest einplanen. |
| Scrollcontainer | Mehrere CSS-Bereiche nutzen `overflow-x:auto` oder interne Scrollflächen. Auf iOS kann das zu zähem oder doppeltem Scrollverhalten führen. | In Phase 39H/39I Tabellen, SVG-Flows, Training-Sheets und Admin-Listen gezielt auf iPhone/iPad prüfen. |

## LOW – kosmetische/technische Hinweise

| Bereich | Befund | Maßnahme |
|---|---|---|
| iPhone Header | App-Titel bricht zweizeilig und wirkt sehr dominant. Lesbar, aber nicht maximal kompakt. | Optional kompaktere Header-Variante für kleine Geräte. |
| iPad Footer | Footer sitzt sehr tief und visuell schwach im Gate-Screen. | Footer/Branding auf Tablet besser integrieren. |
| Performance | Viele Glass-/Blur-Flächen wirken hochwertig, können ältere iPhones belasten. | Backdrop-Filter später per CI-Warnung überwachen. |
| Icon QA | Emoji-Reste wurden weitgehend entfernt; neue Kacheln müssen weiter gegen Fallbacks geprüft werden. | Neue UI-Elemente nur mit SVG-Token/Inline-SVG. |
| Versioning | 39G ist primär Audit-/Reportphase ohne große App-Funktionsänderung. | Version eindeutig auf G54.39G führen. |

## Konkrete Fehlerliste für Phase 39H

1. Mobile Dock-Abstand prüfen und global absichern.
2. iPad-Gate-Layout optisch ausbalancieren.
3. Scrollcontainer-Risiko auf iPhone/iPad priorisiert testen.
4. Observer-Runner lokal/CI ausführen und JSON-Artefakt gegenprüfen.

## Artefakte dieser Phase

- `docs/PHASE39G_VISUAL_OBSERVER_REPORT.md`
- `phase39g_visual_observer_result.json`
- `phase39g_visual_observer_report.py`

## Entscheidung

Nicht weiter QA-Werkzeuge bauen. Jetzt beginnt Korrekturarbeit. Phase 39H sollte bewusst klein bleiben und nur die oben genannten MEDIUM-Risiken beheben.
