# G36 · Kundensicht-Audit & Sichtbarkeits-Garantie (2026-06-12)

Leitfrage: "Würde ein Bildungsträger das kaufen?" – geprüft wurde NICHT der
Code, sondern was Teilnehmer, Dozent und Admin tatsächlich SEHEN und in
wie vielen Taps sie es erreichen.

## A) Wurzelursachen, warum Geliefertes unsichtbar blieb (behoben)
1. DOCK: css/ui-nav-foundation.css fixierte das Bottom-Menü per !important
   auf 5 Spalten – der 6. Button (🏆 Highscore) wurde herausgequetscht.
   → Auf 6 Spalten umgestellt (in der ZULETZT geladenen CSS-Datei, gewinnt
   die Kaskade), Labels skalieren auf schmalen Phones. Highscore ist jetzt
   im Bottom-Menü sichtbar: Dashboard · Üben · Fortschritt · Coach ·
   🏆 Highscore · Mehr.
2. SCHUBLADE: index.html lädt app.css VOR ui-foundation/ui-nav-foundation –
   die Drawer-CSS-Regeln wurden von später geladenen Dateien überschrieben;
   die Frageübersicht blieb deshalb unten im Inline-Modus.
   → Die Schublade wird jetzt vollständig per JavaScript mit
   Inline-!important-Styles gesetzt (setProperty(..., 'important')).
   Damit ist sie kaskaden-immun: KEINE CSS-Datei kann sie mehr
   überschreiben, egal in welcher Reihenfolge geladen wird. Bei <1040 px
   werden alle Inline-Styles sauber entfernt (Mobile bleibt unverändert).
   Resize/Rotation wird live nachgezogen.

## B) Klickpfade nach diesem Update (Anti-Labyrinth-Nachweis)
TEILNEHMER
- Training starten: Start → Üben → Modus → läuft (2–3 Taps)
- Frageübersicht (Desktop): Griff rechts am Rand (zeigt live "7/100" und
  ★-Zähler) → 1 Tap → Schublade gleitet herein; ★-Chips springen direkt
  zu markierten Aufgaben; ESC oder Griff schließt
- Highscore/Rangliste: Bottom-Menü → 🏆 (1 Tap) ODER direkt aus dem
  Ergebnis-Screen über den neuen Button "🏆 Highscore ansehen" (1 Tap)
- Duell: Startseite-Schnellzugriff "⚔️ Duell" ODER Highscore-Seite →
  "⚔️ Duell starten" (max. 2 Taps)
- Prognose: automatisch nach jedem Lauf im Ergebnis + oben in der
  Highscore-Zentrale (0 zusätzliche Taps)
DOZENT
- Portal → Teilnehmerliste → Name antippen → Detailkarte MIT
  "📊 Fehleranalyse & Prognose": Prognose-Gauge (farbcodiert),
  Modul-Balken (schwächste zuerst, mit Aufgaben-/Fehlerzahl),
  Chips der wiederkehrenden Fehler (2 Taps bis zur Diagnose)
ADMIN
- Wie Dozent, aber alle Teilnehmer; plus Verwaltung (IDs, Passwörter,
  Status, Export, Demo-Daten) im Admin-Tab

## C) Weitere Befunde aus dem Walkthrough (Roadmap, priorisiert)
1. Onboarding-Tour (3 Karten beim Erststart: Üben → Ergebnis → Highscore)
   – senkt Einstiegshürde für Kurse spürbar
2. Dozenten-Wochenbericht (1 Seite: Risiko-Teilnehmer, Kursschnitt,
   Prognosen) – das Verkaufsargument für Bildungsträger
3. Kurs-Liga (wöchentliche Duell-Wertung über die vorhandenen
   Firestore-Duelldaten) – Retention/Motivation
4. "Weiter üben, wo aufgehört"-Karte auf dem Dashboard (1-Tap-Wiedereinstieg)
5. Streak/Tagesziel für tägliche Nutzung

## D) Nachweis (Headless-Verifikation dieser Lieferung)
- Dock-Markup enthält den 🏆-Button; letzte CSS-Datei erzwingt 6 Spalten;
  keine aktive 5-Spalten-!important-Regel mehr
- Schublade: bei 1200 px setzt das JS nachweislich position:fixed +
  transform translateX(0/100%) inline; Öffnen/Schließen/Persistenz OK;
  bei 390 px werden alle Inline-Styles entfernt und der Griff versteckt
- Markiert-Chips, Seitenfolge, Griff-Live-Info: OK (8/8 Schubladen-Checks)
- Highscore-Kette: Submit-Merge, Top-Sortierung, automatische Meldung aus
  saveResult, Cloud-Proxy, (du)-Highlight: OK
- Admin-Diagramme: Gauge + Balken + Fehlerchips, kritischer Bereich
  korrekt: OK
- Regression: 36 Modi × 2 sauber, Rendering ohne Crash
