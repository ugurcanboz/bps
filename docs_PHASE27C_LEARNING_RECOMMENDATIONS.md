# Phase 27C – Konkrete Lernempfehlungen

## Ziel
Aus der Coach-Analyse aus Phase 27B entstehen sichtbare und anklickbare Empfehlungskarten. Der Coach bleibt ein Lernlehrer, kein Chatbot.

## Umgesetzt

- `coachRecommendationCards()` erzeugt priorisierte Empfehlungen.
- `coachRecommendationsHtml()` rendert Empfehlungskarten im Hauptapp-Design.
- Coach-Karte im Dashboard zeigt jetzt die Top-Empfehlung.
- Coach-Detailansicht zeigt mehrere Empfehlungen mit Start-Button.
- Empfehlungen nutzen echte Daten: offene Fehler, Vokabelstatus, Aufgabentyp-Schwächen, Lektionen und Weiterlernen.
- Start-Aktionen sind mit bestehenden Sprachkurs-Flows verbunden.

## Prioritätslogik

1. Offene Fehler zuerst.
2. Vokabeln im Wiederholungsstapel.
3. Schwächster Aufgabentyp.
4. Auffälligste Lektion.
5. Weiterlernen als Fallback.

## Nicht verändert

- CTC
- Adminportal
- Highscore
- Login
- Supabase/Firebase

## Status

Phase 27C: PASS.
