# G35.2 · Prioritäten-Report P1–P8 (2026-06-11)

Arbeitsprinzip je Punkt: Fehler identifiziert → Ursache belegt → Lösung implementiert →
Funktion getestet → Regressionstest (35 Modi × 2 Läufe, headless Node-Harness).
Keine Vermutungen: jede Ursache ist unten mit dem konkreten Code-Befund dokumentiert.

## P1 · Bestehende Fehler

### Login unmöglich („Profil-Fehler: session is not defined")
Befund: js/modules/auth-profile-shell.js, openAuthGate() referenzierte die Variable
`session` in kicker/subtitle, ohne sie zu definieren (authGateBody() definiert sie nur
lokal). Jeder Klick auf den Benutzerbereich warf einen ReferenceError, den ui-router.js
als „Profil-Fehler: …" anzeigte. Der Login-Dialog war damit unerreichbar.
Fix: `var session = currentSession();` ergänzt. Headless verifiziert: alle 5 Auth-
Aktionen (auth-login, profile-open, profile-edit, auth-demo-start, auth-redeem-code)
laufen fehlerfrei; Passwortprüfung (createLearner → loginWithCode mit firstPassword)
funktioniert. Statischer Scan: keine weiteren undefinierten session-Referenzen.

Hinweis zur Einordnung: createLearner ignoriert übergebene Wunsch-Passwörter bewusst
und generiert ein firstPassword (Rückgabewert, mustChangePassword=true). Das ist
Design, kein Fehler.

## P1/Analyse · Simulation vs. Hauptsystem
Es gibt KEINE zwei parallelen Aufgaben-Engines: Simulation und Training nutzen
dieselbe Engine (buildQuiz → fromQuestionBank/Generators), dieselbe Datenbasis
(QUESTION_BANK, 517 Aufgaben) und dieselbe Render-Pipeline (showQuestion/renderVisual).
Der Eindruck „die Simulation wirkt professioneller" hatte eine andere Ursache: Für
mehrere Aufgabentypen des Trainings fehlte schlicht das CSS (siehe P5/P6) – die
Simulation nutzte überwiegend Typen, deren Styles vorhanden waren. Mit P5/P6 ist die
Darstellung jetzt einheitlich. Es wurde bewusst nichts dupliziert oder migriert.

## P2 · Simulation als Hauptkachel
Befund: Auf der Startseite existierte keine eigene Simulations-Kachel; die Simulation
war nur indirekt über Hero-CTA und Bereichs-Sheets erreichbar.
Fix: Premium-Hauptkachel „Eignungstest-Simulation" direkt unter dem Hero
(ui-home-renderer.js + .ui-sim-hero-Styles in css/app.css). Aktion nutzt den
bestehenden Router-Pfad open-module/simulation – keine neue Logik, kein Risiko.

## P3 · Geräte-Synchronisation (Analyse-Ergebnis)
Aufgabenquellen: identisch auf allen Geräten – statische JS-Dateien (data/*.js),
kein gerätespezifischer Code-Pfad, keine UA-Weichen in Aufgabenlogik oder Bewertung.
Renderlogik: eine gemeinsame Pipeline; Unterschiede sind reine CSS-Media-Queries.
Zufallsgeneratoren: Math.random() erzeugt pro Sitzung neue Aufgaben – zwei Geräte
zeigen daher NIE dieselbe zufällige Aufgabenfolge. Das ist Design (Übungsvariation),
nicht Divergenz: Pools, Filter und Bewertungsregeln sind identisch.
Tatsächliche Ursache unterschiedlicher Darstellungen/Aufgaben in der Praxis:
veraltete PWA-Caches (alte Dateiversionen auf einzelnen Geräten). Maßnahme:
CACHE_NAME erneut erhöht (g352) → alle Geräte laden nach dem nächsten Öffnen
denselben Stand. Empfehlung: nach Deployment auf jedem Gerät die App einmal
schließen und neu öffnen.

## P4 · Fragenübersicht paginiert
Befund: updateQuestionNav renderte alle Punkte (93+) in eine Fläche.
Fix: Seiten zu je 30 Fragen mit Tab-Leiste („1–30 / 31–60 / 61–90 / 91–93").
Die Seite folgt automatisch der aktuellen Frage; manuelle Seitenwahl bleibt bis zum
nächsten Fragenwechsel aktiv. Logik mit 6 Fällen getestet (93/25/120 Fragen, Rand-
fälle). Touch-Ziele ≥36 px, mobile/desktop/tablet via CSS.

## P5 · Konzentrationsaufgaben unbenutzbar
Befund (Ursache belegt): Die in app.js generierten Klassen .focus-grid, .focus-token,
.scan-table, .pq-sheet, .pq-token hatten KEIN CSS (0 Treffer in css/) – ungestylte
Inline-Spans ohne Abstände. Daher klebten Zahlen/Zeichen aneinander.
Fix: vollständige Styles in css/app.css: Grid-Raster mit 8–10 px Gap, Kachel-Tokens
(min. 42–46 px Touch-Höhe, Monospace 18–21 px), Tabellenabgleich mit Zebra, Padding
und klaren Spalten, Mobile-Breakpoints. Betroffene Typen: Zahlenscan, Scanner,
Symbolsuche, p/q-Bogen, Tabellenabgleich, Tabellenscan, CTC-Regel.

## P6 · Busroute schwarzer Balken
Befund (Ursache belegt): Für .route-scene/.route-svg/.route-path/.route-dash/
.route-stop-*/.route-status existierte ebenfalls KEIN CSS. Ein SVG-<path> ohne
Styles rendert mit Browser-Default fill:black – der mehrzeilige Streckenpfad wurde
als gefüllte schwarze Fläche gezeichnet. Das war der schwarze Balken.
Fix: komplette Route-Styles (fill:none, Straßen-Strich + gestrichelte Akzentlinie,
animierte Stopp-Punkte mit .show/.past-Zuständen, lesbare Labels mit Kontur,
Status-Leiste mit Countdown-Pill). Darstellung modernisiert im App-Designsystem.

## P7 · iPad-Querformat
Maßnahme: Dichte-Media-Query (768–1366 px, landscape) in css/app.css: kompaktere
Karten/Panels (Padding 12→10), engere Grids, kleinere Headline-Stufen, größere
Nutzflächen für focus-grid/route-scene. Lesbarkeit unangetastet (Mindestgrößen
bleiben). Hinweis: Feintuning auf echter Hardware (Safari/iPadOS) bleibt sinnvoll –
headless ist nur die CSS-Logik prüfbar, nicht das Gefühl.

## P8 · Zahlenreihen-Analyse
Geprüft: dynamischer Generator (series), Buch-Reihen (bookNumberSeries → verifizierte
Bank-Aufgaben) und symbolische Reihen. Muster (±s, alternierend, Quadrate, n²+n,
Fibonacci, wachsende Abstände) sind eignungstest-realistisch (BPS/CTC-Stil) und
mustererkennungsorientiert → beibehalten.
Ein Fall war künstlich erschwert: geometrische Reihen ×2/×3 mit 7 Gliedern + 2
gesucht erzwangen Werte bis 26.244 (Rechenarbeit statt Mustererkennung).
Fix: ×3 → 4 gezeigte Glieder (Start 2–3), ×2 → 6 Glieder (Start 2–4).
Messung über 5.000 generierte Reihen: Maximalwert jetzt 731 (vorher 26.244),
0 Antwort-Duplikate.

## Regressionstest (nach allen Änderungen)
- Bank-Bootstrap: 517/517 Aufgaben
- 35 Trainingsmodi × 2 Läufe: 0 Duplikate, 0 Guard-Fehler, 0 Exceptions
- ctcLohr: 93 Fragen, Blockstruktur 40/9/18/15/11 unverändert korrekt
- Syntax-Checks: app.js, ui-home-renderer.js, auth-profile-shell.js
- Service-Worker: CACHE_NAME → 'bps-trainer-g352-prio-fix'
