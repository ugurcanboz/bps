# Working Plan – Eignungstest-Trainer G54.39H

## Aktueller Stand

Aktuelle Version: `G54.39H – Medium Fixes nach Visual Observer Report`

Phase 39H wurde auf Basis von Phase 39G umgesetzt. Der Fokus lag ausschließlich auf den priorisierten MEDIUM-Befunden aus dem Visual-Observer-Report.

## Erledigt in Phase 39H

1. Mobile Bottom-Dock-Reserve erhöht
   - Neue CSS-Variable `--phase39h-dock-reserve`
   - Zusätzliche iPhone-Reserve bis mindestens 156 px
   - Scroll-Padding ergänzt, damit letzte Inhalte nicht unter dem Dock kleben

2. iPad-/Tablet-Gate optisch ausbalanciert
   - Breakpoint 769–1180 px ergänzt
   - Rechte Auswahlspalte entquetscht
   - Linke Fläche stärker genutzt
   - Kleine Tablets/Querformat mit einspaltigem Fallback abgesichert

3. Scrollcontainer entschärft
   - iOS `-webkit-overflow-scrolling: touch`
   - `overscroll-behavior: contain`
   - stabile horizontale Scrollflächen für Tabellen, Admin-Listen, FlowLogic und Sprachkursbereiche

4. QA-Artefakte ergänzt
   - `tests_phase39h_medium_fixes.html`
   - `phase39h_static_qa.py`
   - `phase39h_static_qa_result.json`
   - `docs/PHASE39H_MEDIUM_FIXES_REPORT.md`

5. PWA-/Cache-Stand aktualisiert
   - Service Worker Cache auf `egt-trainer-g54-39h`
   - neue 39H-Artefakte in Cache-Liste aufgenommen

## QA-Ergebnis

Static QA: bestanden  
Ergebnisdatei: `phase39h_static_qa_result.json`

## Offene Punkte

Keine MEDIUM-Befunde aus 39G bleiben als direkter Fix offen.

## Nächster sinnvoller Schritt

Phase 39I – LOW-/Pixel-Polish beheben:

- kompakterer iPhone-Header prüfen
- iPad-Footer/Branding im Gate optisch integrieren
- Blur-/Glass-Performance als Warnregel beobachten
- Icon-Fallback-Regel weiterhin in QA behalten

Alternative: Direkt Phase 40 Golden Master QA starten, wenn zuerst echte Browser-Screenshots auf iPhone/iPad/Desktop als finaler Nachweis erzeugt werden sollen.
