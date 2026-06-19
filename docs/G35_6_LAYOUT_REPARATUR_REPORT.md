# G35.6 · Layout-Reparatur + Stand-Zusammenführung (2026-06-11)

## Diagnose (belegt)
Es existierten ZWEI divergierende Entwicklungslinien:
- Linie A (dieses Paket): G35.5 vollständig (Online-Duell, Highscore-Tab,
  Bestehensprognose, alle Bugfixes) + Mathe-Hilfe-System + Cockpit-Experiment
- Linie B (das vom Nutzer hochgeladene, live laufende ZIP): ALTE app.js-Basis
  (ohne G35.2–G35.5: kein Duell, keine Prognose, alte Zahnrad-Farben, alte
  Navigation, ohne CTC-Quoten) + ein 482-Zeilen-"training-cockpit"-CSS

Der Screenshot zeigt Linie B: Das cockpit-Grid (grid-template-areas mit
!important) kollabierte auf Desktop — Frage überlappte die Topbar, Aufgabe
und Antworten asynchron, verstreute Buttons, Scroll-Probleme. Zusätzlich
fehlten dort die CTC-Quoten-Fixes ("CTC-Fragen werden nicht dargestellt")
und die reparierte Frageübersicht.

## Reparatur
Basis: Linie A (vollständig, getestet). Übernommen aus Linie B (sinnvoll):
- Debug-Error-Overlay + Storage/IndexedDB-Polyfill in index.html (schützt
  vor Chrome-SecurityErrors bei blockiertem Storage)
- Kontrast-Upgrade der Konzentrations-Kacheln (hellere Ränder, Schatten,
  größere Abstände) — 5 Blöcke in css/app.css
- Defensiver typeof-Guard in ui-home-renderer
- Master-DNA-Validator (validateGeneratedQuestion) in der Quality-Engine,
  angepasst: Spezialtypen (Busroute/EDV) und legitime Binär-Fragen
  (Meinung/Tatsache, Wahr/Falsch) werden nicht fälschlich abgelehnt.
  Prüft: Zeitmodell (>=15 s), >=4 eindeutige Optionen, korrekter Index,
  Scroll-Schutz für Konzentrationsfelder (max. 60 Tokens), homogene
  Antworttypen bei Zahlen-/Symbolreihen. In buildQuiz verdrahtet:
  abgelehnte Aufgaben werden bis zu 3x neu generiert.

Deaktiviert (Ursache der zerschossenen Darstellung):
- Cockpit-Aktivierung entfernt (classList.add("training-cockpit") →
  remove). Das Cockpit-CSS bleibt inert im Code erhalten (kein riskantes
  Massenlöschen), das vollständig verifizierte Basis-Layout ist wieder
  aktiv. Timer-Fortschritt/Aria-Labels der Cockpit-Funktion bleiben aktiv.

Bereits in Linie A enthalten und verifiziert: Mathe-Hilfe-System
(Hilfe-Button bei Mathe-Aufgaben → 6-stufiges Lern-Sheet mit Tipp, Trick,
Lösungsweg, Erklärung, Lernziel, Transferaufgabe; Timer pausiert während
der Hilfe; "Gelernt"-Badge mit lokalem Mastery-Tracking).

## Verifikation
- 517/517 Aufgaben geladen, Validator aktiv
- 36 Modi × 2 Builds: 0 Duplikate, 0 Guard-Fehler
- 294 Fragen durch echte Render-Pipeline: 0 Crashes
- Cockpit-Klasse wird nachweislich NICHT mehr gesetzt
- Hilfe-Button erscheint korrekt nur bei Mathe-Aufgaben
- Duell- (lokal+online), Prognose-, Highscore-APIs vollständig vorhanden
- Simulation: 93 Fragen, Blockstruktur 40/9/18/15/11

## WICHTIG für den Nutzer
Dieses Paket ERSETZT den kompletten lokalen Stand. Nicht mit dem alten
Stand mischen — die Linien sind inkompatibel. Nach dem Deployment auf
jedem Gerät die App einmal vollständig schließen und neu öffnen
(Cache-Version: bps-trainer-g356-layout-repair).

---

# Nachtrag G35.7 · Wurzel-Fix Desktop + Layout-Guard-Engine

## Tieferer Wurzel-Fund (Desktop ≥1040px)
Der Screenshot des Nutzers zeigte den Bruch AUCH ohne Cockpit-Klasse möglich:
index.html trägt "learning-screen" STATISCH am #quiz, und ein zweiter
Media-Block (ab Zeile 1741, min-width:1040px) aktivierte darüber ein
3-Spalten-Area-Grid mit verwaister "status"-Area (kein Kind belegt sie) und
118-px-Leerkarte – exakt die leere Riesen-Kopfkarte und die asynchrone
Aufteilung im Screenshot. Fix: alle 15 Layout-Selektoren dieses Blocks +
die learning-screen-answers-Regel auf die (deaktivierte) .training-cockpit-
Klasse eingeschränkt. Regex-verifiziert: 0 aktive Area-Grids auf #quiz.

## NEU: Layout-Guard-Engine (js/modules/layout-guard-engine.js)
App-übergreifende Render-Wache, wie vom Nutzer angefragt – verhindert diese
Fehlerklasse künftig automatisch:
- Prüft nach JEDEM Aufgaben-Render (Event egt:question-rendered aus
  showQuestion), bei Resize und Rotation (entprellt, 120 ms)
- Invarianten: keine Experiment-Klassen am #quiz, keine Überlappung
  Frage/Topbar (>25 % = kollabiertes Grid), kein horizontaler Overflow von
  Frage/Antworten/Visual (Master-DNA: kein Scrollen), keine kollabierten
  Antwort-Container
- Self-Healing: entfernt Fremdklassen, setzt Grid-Inline-Styles zurück,
  erzwingt Containment, hebt Höhen-Kollaps auf – konservativ, greift NUR
  bei messbarem Verstoß
- Diagnose: Ringpuffer (egt-layout-guard-log, 30 Einträge) mit Zeit,
  Viewport, User-Agent, Verstoß + angewandtem Fix; abrufbar über
  EGTLayoutGuard.log() in der Browser-Konsole
- Dazu defensive CSS-Härtung: Quiz-Kernbereiche können den Rahmen nie mehr
  horizontal verlassen (min-width:0/max-width:100% + SVG-Containment)

## Verifikation
- Guard-Unit-Tests: Normalfall ohne Fehlalarm; Cockpit-Klasse, Überlappung,
  Overflow und Antwort-Kollaps werden erkannt UND repariert; Log schreibt;
  alle 3 Listener registriert
- Regression: 517/517 Aufgaben, 36 Modi × 2 sauber, 294 Fragen gerendert
  (inkl. Guard-Event je Frage) ohne Crash, Sim 40/9/18/15/11
- CACHE_NAME → 'bps-trainer-g357-layout-guard'
