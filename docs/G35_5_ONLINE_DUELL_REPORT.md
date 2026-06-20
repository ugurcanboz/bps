# G35.5 · Online-Duell + Highscore-Tab + Bestehensprognose (2026-06-11)

## 1. Online-Duell (Firestore, Code-basiert)
Architektur: nutzt die VORHANDENE Firebase/Firestore-Infrastruktur der App
(loadSync/signIn/docRef im Admin-Engine, Anonymous-Auth, Offline-Fallback).
Neue Cloud-API in js/admin-participant-engine.js (exportiert über EGTAdminPortal):
- duellCreate: 6-stelliger Code (ohne verwechselbare Zeichen), Fragensatz wird
  als Snapshot ins Duell-Dokument geschrieben (courses/{courseId}/duels/{CODE}),
  2 h Ablaufzeit
- duellJoin: Code-Validierung, Schutz gegen Doppel-Beitritt, liefert den
  IDENTISCHEN Fragensatz an den Gast
- duellSubmit / duellFetch: Ergebnis-Sync + Polling-Lesepfad

Frontend-Flow (js/app.js):
- Setup mit zwei Tabs: 📡 Online (Standard) und 📱 Lokal (Hot-Seat bleibt erhalten)
- Host: Name → "Duell erstellen" → großer Code zum Teilen → Live-Warten auf
  Gegner (Poll alle 2,5 s) → Start-Button sobald der Gegner beigetreten ist
- Gast: Code eingeben (wird normalisiert, auch Kleinschreibung) → Beitritt →
  Start. Beide spielen denselben Satz: gleiche Fragen, gleiche Antwort-
  Reihenfolge, gleiche Zeit (25 s/Aufgabe)
- Nach jedem Duell wird NEU gepoolt: Revanche/Neues Duell erzeugt immer einen
  frischen Satz, innerhalb eines Duells bleibt er strikt identisch
- Ergebnis erscheint auf BEIDEN Geräten automatisch (Polling), mit:
  Gesamtsieger-Banner (Tiebreak = Gesamtzeit), Avatar-Badges, Punkte + Zeiten
  pro Spieler, "Wer war in welchem Bereich besser?" (Wissen/Mathe/Logik/
  Konzentration mit 👑-Markierung je Bereich, Zeit je Bereich) und
  Frage-für-Frage-✓/✗-Raster
- Fehlerpfade: Übertragung fehlgeschlagen → "Erneut senden"; kein Beitritt/
  kein Gegner-Ergebnis nach 10 min → klare Meldung; offline → verständlicher
  Hinweis + lokales Duell als Alternative
- Avatare: deterministische Initialen-Badges mit Namens-Farbhash (Avatar-
  BILDER bleiben laut App-Design lokal auf dem Gerät und werden bewusst nicht
  hochgeladen – ehrliche Grenze statt Datenrisiko)

Drei Schutzebenen gegen State-Kollisionen (selbst gefunden und getestet):
startQuiz nutzt den Duell-Snapshot NUR im Duell-Modus; "Abbrechen" im Setup
räumt Duell-State + Poll-Timer auf; prepareTest entfernt verwaiste Duell-Reste.

## 2. Highscore im Bottom-Dock
Sechster Dock-Button 🏆 "Highscore" → Deep-Sheet mit:
- 🎯 Bestehensprognose (oben, siehe 3.)
- ⚔️ Letzte Duelle: Sieger-Banner mit Avatar, Spielstand, Lokal/Online-Kennung,
  Datum + "Duell starten"-Button
- 🏆 Lokale Bestenliste (Top 10 nach Quote)
Datenpfad: neue öffentliche API App.highscoreData() (Ergebnisse, Duelle,
Prognose-HTML, Avatar-Renderer) → Sheet-Renderer in ui-home-renderer
(EGTUILayer.openHighscoreSheet), Routing über ui-router (highscore-sheet).
Hinweis zur Ehrlichkeit: das "fertige Backend" highscore-engine.js war eine
NICHT geladene Factory ohne Integration; der Cloud-Highscore (Supabase) ist
per Konfiguration deaktiviert. Die Bestenliste ist daher bewusst lokal und
sauber als solche beschriftet – Duelle laufen dagegen echt online.

## 3. Bestehensprognose (datengetrieben, erklärbar)
App.passPrognosis(): pro Zieltest (CTC/Bosch 70 %, Basisprofil+ 75 %):
- gewichtete Quote der letzten bis zu 10 relevanten Läufe (jüngere zählen
  stärker, Faktor 0,85-Decay)
- Schwankungs-Malus über die Standardabweichung (max −12)
- Abdeckungs-Bonus für mehr absolvierte Läufe (max +6)
- Wahrscheinlichkeit auf 3–97 % begrenzt, niemals fake-sicher
- Kritischster Bereich: schwächste Kategorie-Gruppe (min. 5 Aufgaben Datenbasis)
Anzeige: Karte im Ergebnis-Screen nach jedem normalen Lauf (Balken mit
Ziellinie, Basisdaten transparent ausgewiesen) + oben im Highscore-Sheet.

## 4. Verifikation
- Online-Duell E2E mit ZWEI isolierten simulierten Geräten und In-Memory-
  Firestore: Code-Erstellung, Beitritt (inkl. Kleinschreibungs-Code),
  Host-Poll erkennt Gast, identische Fragensätze (Byte-Vergleich), Submit,
  beidseitiger Vergleich, korrekter Sieger, Bereichsvergleich, Zeiten,
  Historie auf beiden Geräten: ALLE CHECKS BESTANDEN
- Stale-State-Guard verifiziert (Abbrechen → kein Snapshot-Leak in Trainings)
- Lokales Duell: 20/20 E2E-Läufe, 0 Fehler, 0 Antwort-Duplikate (2400 Fragen)
- Prognose: Berechnung verifiziert (inkl. korrektem kritischen Bereich)
- Regression: 36 Modi × 2 Builds sauber, 274 Fragen gerendert ohne Crash,
  Ergebnis-Screen mit Prognose-Karte nach Simulation fehlerfrei
- Syntax: app.js, admin-participant-engine.js, ui-home-renderer.js, ui-router.js

## Betriebshinweis (wichtig)
Die Firestore-Security-Rules des Projekts müssen Lese-/Schreibzugriff auf
courses/{courseId}/duels/** für authentifizierte (anonyme) Nutzer erlauben –
analog zu den bereits funktionierenden accessCodes. Falls die Rules das
blockieren, zeigt die App eine klare Fehlermeldung und bietet das lokale
Duell an; es bricht nichts.
Service-Worker: CACHE_NAME → 'bps-trainer-g355-online-duell'.
