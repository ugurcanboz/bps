# G35.4 · Stabilitäts-Scan + Duell-Modus (2026-06-11)

## 1. Code-Stabilitäts-Scan (Kollisionen, Duplikate, Überschreibungen)
Geprüft über alle 12 JS-Hauptdateien + index.html:
- Doppelte Funktionsdeklarationen je Datei: 0
- Doppelte Generator-Keys: 0 echte (summary/diagnostics liegen in 6 VERSCHIEDENEN
  Objekten – kein Konflikt; die echte Doppeldefinition fractionRuleEignungstest
  war bereits in G35.1 entfernt worden)
- window.*-Mehrfachzuweisungen über Dateien: 0
- Doppelte HTML-IDs: 0
- Doppelte MODES-Keys: 0

## 2. Grafik-Scan: automatisiert JS-Klassen vs. CSS abgeglichen
Methode: alle class="…" aus JS-Templates extrahiert, gegen alle 6 Stylesheets
UND Runtime-injizierte <style>-Blöcke geprüft. Echte Lücken geschlossen (additiv):
- image-task-box/-img: Buchscan-Bilder liefen in Originalgröße über (Mobile) →
  max-width, weißer Hintergrund, Schatten
- route-chip (+clickable): gewählte Straßen der Busroute & EDV-Knoten waren
  ungestylte Text-Spans mit Mini-Touchflächen → echte Chips (40 px, Hover/Active)
- edv-node-order: Auswahl-Reihenfolge-Badge
- exam-locked-note, focus-note, reviewFilter: Hinweis-/Filter-Styles
- cloud-rank-*/hs-*/ui-highscore-card/cloud-board*: Ranglisten-Listen & Karten
- ui-sheet-handle: Sheet-Griff
Fehlalarme dokumentiert ausgeschlossen (.cell existiert, iso-cube nutzt Inline-
Fills, egt-bottom-dock läuft über ID-Selektoren, ui-scan-* ist Runtime-CSS).

## 3. Restliche unsichtbare SVG-Geometrie behoben
Kontextsensitiver Pass über alle SVG-Tags in app.js: dunkle Strokes (#111827)
NUR dort aufgehellt, wo sie auf dunklem Canvas lagen (fill:none-Polygone,
freistehende Linien: Fachwerk-Statik, Riemenlinien, Geometrie-Dreiecke –
17 Stellen). 11 korrekte Dunkel-auf-Hell-Rahmen blieben unangetastet.

## 4. NEU: Duell-Modus ⚔️ (vollständig)
Konzept: Hot-Seat-Duell – 2 Spieler, 1 Gerät, IDENTISCHER Fragensatz.
- 12 Aufgaben, prüfungsnaher Mix (3 Wissen, 1 Satzergänzung, 3 Mathe, 3 Logik,
  2 Konzentration), einheitlich 25 s/Aufgabe für faire Vergleichbarkeit
- Spieler 1 spielt → Übergabe-Screen (Ergebnis bleibt geheim) → Spieler 2
  erhält einen Deep-Clone des Fragensatzes: gleiche Fragen, gleiche
  Antwortreihenfolge, gleiche Zeit
- Vergleichs-Screen: Sieger-Banner (Punkte, Tiebreak = Gesamtzeit),
  Side-by-Side-Karten, Frage-für-Frage-Vergleich (✓/✗-Raster), Revanche
  (neue Fragen), Neues Duell, Exit
- Duell-Historie: letzte 20 Duelle in localStorage (egt-duell-history),
  Anzeige im Setup
- Saubere Trennung: Duelle laufen über einen EIGENEN Result-Pfad und
  verfälschen keine Trainingsstatistiken/Coach-Daten; restart() räumt den
  Duell-State immer auf
- Einstieg: Schnellzugriff-Kachel "Duell" auf der Startseite
  (ui-router-Action duel-mode), zusätzlich als Modus 35 in der Engine

## 5. Verifikation
- Duell-E2E: 20 komplette Durchläufe (Setup → P1 → Identitäts-Check des
  Fragensatzes → P2 → Siegerlogik → Revanche → Exit): 0 Fehler;
  2400 Duell-Fragen ohne Antwort-Duplikate; Historie korrekt persistiert
- Build-Regression: 36 Modi × 2 Läufe: 0 Duplikate, 0 Guard-Fehler
- Render-Regression: 274 Fragen durch echte Pipeline: 0 Crashes
- Simulation: 93 Fragen, 40/9/18/15/11 unverändert
- Syntax-Checks: app.js, ui-router.js, ui-home-renderer.js
- Service-Worker: CACHE_NAME → 'bps-trainer-g354-duell'
