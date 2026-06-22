# Phase 26F – Sprachkurs Stabilitäts- und Funktions-QA

## Ergebnis

**Status: PASS nach Korrektur**

Phase 26F war bewusst keine neue Feature-Phase, sondern eine Stabilitätsrunde für das bestehende Sprachkurs-Modul nach Phase 26E.

## Korrigierte Punkte

1. **Multiple Choice stabilisiert**
   - Antwortauswahl wird sichtbar markiert.
   - „Antwort prüfen“ wird erst nach Auswahl aktiv.
   - Feedback erscheint zuverlässig.
   - „Weiter“ wird erst nach Prüfung aktiv.

2. **Touch-/Click-Deduplizierung ergänzt**
   - Mobile Touch-Events und Click-Events werden gegen Doppelverarbeitung geschützt.
   - Dadurch werden Aufgaben nicht mehr versehentlich doppelt geöffnet oder übersprungen.

3. **Aufgabenstatus pro Aufgabe stabilisiert**
   - Wechsel zwischen Aufgabentypen übernimmt nicht mehr versehentlich alte Auswahlzustände.
   - Aktiver Task wird über `activeTaskId` abgesichert.

4. **Zuordnen-Funktion stabilisiert**
   - Aus instabilen linken/rechten Einzelklicks wurde eine klare Paar-Auswahl.
   - Jedes Paar ist als Karte antippbar.
   - Prüfung wird erst aktiv, wenn alle Paare markiert sind.

5. **Vokabeltrainer stabilisiert**
   - Nach der letzten Vokabel erscheint jetzt eine Abschlusskarte statt einer Endlosschleife auf der letzten Karte.
   - „Kann ich“, „Wiederholen“, „Weiter“ bleiben stabil bedienbar.

6. **Rücknavigation verbessert**
   - Der Aufgabenbereich führt jetzt zurück zur Lektionsansicht statt missverständlich zur Niveauübersicht.

7. **Weiße Fremdflächen reduziert**
   - Sprachkurs-Karten, Aufgaben, Vokabelkarten, Antwortkarten und Zuordnungskarten wurden erneut auf dunkles Hauptapp-Design gezwungen.
   - Ziel: keine hellen Fremdkarten innerhalb des Sprachkurs-Sheets.

8. **Mobile Darstellung nachgebessert**
   - Touch-Flächen bleiben groß genug.
   - Buttons brechen sauber um.
   - Zuordnungskarten werden auf kleinen Geräten einspaltig.
   - Button-Zustände sind sichtbar.

## Browser-Harness-QA

Da lokale Navigation per `localhost`/`file://` in der Umgebung blockiert wurde, wurde ein isolierter Browser-Harness mit der echten Sprachkurs-Komponente, echter CSS-Datei und gestubbtem `EGTUILayer` verwendet.

Geprüfte Viewports:

| Gerät | Viewport | Ergebnis |
|---|---:|---|
| iPhone SE | 375×667 | PASS |
| iPhone 16 Pro Max | 430×932 | PASS |
| iPad Air | 820×1180 | PASS |
| Desktop | 1440×900 | PASS |

## Geprüfte Funktionsflows

| Flow | Ergebnis |
|---|---|
| Dashboard öffnen | PASS |
| Weiterlernen | PASS |
| Multiple Choice auswählen | PASS |
| Antwort prüfen | PASS |
| Weiter zur nächsten Aufgabe | PASS |
| Zuordnen | PASS |
| Lückentext | PASS |
| Satzbau | PASS |
| Vokabelkarte | PASS |
| Richtig/Falsch | PASS |
| Hörverständnis | PASS |
| Vokabeltrainer | PASS |

## Bewusst nicht verändert

- CTC-Modul
- Admin-Portal
- Highscore
- Supabase/Firebase-Konfiguration
- bestehende Hauptnavigation außerhalb Sprachkurs

## Offene Punkte nach Phase 26F

Diese Punkte sind keine Blocker für Phase 26G, aber sie bleiben für spätere Ausbauphasen relevant:

1. Der Zuordnen-Typ ist funktional stabil, aber noch eine vereinfachte Paar-Auswahl. Später kann daraus Drag-and-Drop oder echtes Links-Rechts-Matching werden.
2. Lückentext nutzt aktuell Auswahlbuttons. Eine freie Texteingabe kann später ergänzt werden.
3. Audio nutzt Browser-Speech-Fallback. Echte Audiodateien oder Piper-TTS sind vorbereitet, aber noch nicht produktiv integriert.
4. Echte Kursinhalte müssen in Phase 26G massiv erweitert werden.
5. Cloud-Sync für Sprachkursfortschritt folgt später separat.

## Freigabe

**Phase 26F gibt Phase 26G frei.**

Empfohlener nächster Schritt:

**Phase 26G – A1 Inhalte massiv ausbauen**

Ziel: nicht neue Technik, sondern echte, saubere Inhalte für A1 mit deutlich mehr Aufgaben pro Lektion.
