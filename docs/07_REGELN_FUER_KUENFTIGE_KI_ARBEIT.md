## Update G54.43.9X

Aktueller Stand: **G54.43.9X · Sprachtraining Live Visual QA iPhone/iPad/Desktop**.

Diese Phase ist eine QA-/Polish-Phase für den Sprachtraining-Bereich. Fokus: Sprachwahl-Vormenü, Deutsch/Englisch-Trennung, Hilfssprache, interne Sheet-Scrolllogik und mobile Darstellung auf iPhone/iPad/Desktop. Keine neue Prüfungslogik.

- Sprachtraining bleibt als Sprach-Hub getrennt: Deutsch, Englisch, weitere Sprachen vorbereitet.
- Deutsch und Englisch haben eigene Dashboards und Rückwege zur Sprachwahl.
- Aktive Hilfssprache wird jetzt auch in Deutsch/Englisch-Dashboards sichtbar erklärt.
- Mobile Hub-Karten, Levelkarten, Fokuszustände und Button-Stapelung wurden poliert.
- Englisch bleibt ausschließlich Sprachtraining. Keine Englisch-Vollprüfung und keine Englisch-Sprachtest-Simulation.
- Deutsch B1/B2 Sprachtest-Simulation bleibt unverändert.

Nächster sinnvoller Schritt: **G54.43.9X · Sprachtraining Live Visual QA iPhone/iPad/Desktop**.

---

# Regeln für künftige KI-Arbeit

## Update G54.43.9P

Englisch A2 ist jetzt als Sprachtraining-Grundstruktur aktiv. A2 enthält 8 Alltagseinheiten mit Wortschatz, Kursaufgaben, Hörverstehen und Speaking parallel. Es wurde keine Englisch-Vollprüfung und keine Englisch-Sprachtest-Simulation aktiviert. Deutsch B1/B2 bleibt unverändert.

Nächster empfohlener Schritt: G54.43.9R · Englisch A2 Review-Modus + Admin Fortschritt Preview.

## Grundregeln

1. Immer mit der neuesten ZIP-Version arbeiten.
2. Nur den angeforderten Bereich ändern.
3. Nach jeder Phase Version, Update-Check, Service Worker und Arbeitsanweisung aktualisieren.
4. Keine unnötigen Test-/Arbeitsdateien in Produktionsbereiche legen.
5. Wenn ein ZIP gewünscht ist, echte Dateien ändern und neues ZIP liefern.

## Sprachtraining / Sprachtest

- Sprachtraining = lernen, üben, wiederholen, Hilfe erlaubt.
- Sprachtest-Simulation = prüfen, simulieren, keine Hilfe während des Tests.
- Sprachtest im Simulationsteil ist immer Vollprüfung.
- Teilprüfungen gehören in Training/Übung, nicht als Simulationstyp in das Simulation Center.

## Deutsch

- Deutsch B1/B2 Vollprüfung ist aktiv.
- Deutsch A1/A2/C1/C2 im Simulationsteil nicht als fertig vortäuschen.
- Bestehende B1/B2 Prüfungslogik nicht nebenbei umbauen.

## Englisch

- Englisch ist aktuell nur Sprachtraining.
- Keine Englisch-Vollprüfung aktivieren.
- Keine Englisch-Sprachtest-Simulation aktivieren.
- Englisch-Level nur erweitern, wenn normale Aufgaben und Speaking/Aussprache parallel erweitert werden.
- Vor A2 muss A1 live geprüft sein.

## Supabase

- Local-first bleibt Pflicht.
- Supabase darf die App nicht blockieren.
- Bei RLS/Tabellenfehlern muss lokaler Fallback stabil bleiben.
- Keine geheimen Keys oder privaten Daten in Dokumente schreiben.

## Admin

- Admin Preview darf lokal/Queue-Daten anzeigen.
- Echte Cloud-Auswertung erst nach Supabase-RLS/Views-Test aktivieren.
- Exportfunktionen müssen verständliche Diagnose liefern.

## QA

- QA Bubble Findings `qa_overlay_covers_content` sind meist nur Overlay-Rauschen.
- Echte Bugs sind: Overflow, clipped wichtige Texte, kleine Touch Targets, kaputte Buttons, falsche Produktlogik.
- Nach großen UI-Änderungen immer iPhone, iPad und Edge prüfen.