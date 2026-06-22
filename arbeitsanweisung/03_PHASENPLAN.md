# Phasenplan · Sprachstruktur und Simulation

## Bisheriger Weg

### Bis G54.43.8K

Erledigt:

- Adminportal Mobile Containment Fix.
- Admin Tabbar horizontal besser scrollbar.
- Logout aus Tabbar-Konflikt getrennt.
- Admin-Cockpit Mobile Layout repariert.
- Clean Production ZIP erstellt.
- Arbeitsanweisungsordner separat eingeführt.

### G54.43.8L · Sprachtest-Simulation Deutsch Strukturtrennung

Erledigt:

- Sprachtraining und Sprachtest-Simulation strukturell getrennt.
- Vorhandene deutsche `LanguageExamShell` als Vollprüfung weiterverwendet.
- Sprachtest-Regel umgesetzt: immer Vollprüfung.
- Sprachtraining behält Übung/Hilfe/Einstufung.
- Home-Dock-Abstand verbessert.

### G54.43.8M · Home Dual Simulation Entry

Erledigt:

- Home-Seite erhält zwei getrennte große Simulations-Einstiege.
- Erste Kachel: **Eignungstest-Simulation** für BPS/CTC/Auswahltests.
- Zweite Kachel: **Sprachtest-Simulation** für Deutsch-Vollprüfung.
- Sprache wurde aus dem allgemeinen Eignungstest-Simulationscenter herausgenommen, damit die Home-Seite sofort zeigt, dass Sprachtests unterstützt werden.
- Visuelle Akzenttrennung ergänzt: Eignungstest eher technisch/blau, Sprachtest eigener Sprach-/Prüfungsakzent.

---

## Jetzt befinden wir uns hier

**Aktueller Stand:** G54.43.8M  
**Status:** Umsetzung erfolgt, Live-QA steht aus.

---

## Nächste Phasen

### Phase 8M-QA · Live-QA Home Dual Simulation

- iPhone Capture Startseite.
- Prüfen: beide großen Kacheln sichtbar, kein Clipping, kein Dock-Overlap.
- Prüfen: Eignungstest-Simulation öffnet BPS/CTC-Auswahl.
- Prüfen: Sprachtest-Simulation öffnet Deutsch-Vollprüfungsstruktur.
- Prüfen: Sprachtraining bleibt Übungsbereich.

### Phase 8N · Deutsch-Prüfung stabilisieren

- Datenqualität A1 bis C2 prüfen.
- B1/B2 Vollprüfung vollständig testen.
- Ergebnisbericht testen.
- Keine Teilprüfungslogik im Simulationseinstieg erlauben.
- Sprechen/Hören-Fallbacks im Prüfungsmodus bewerten.

### Phase 8O · Englisch-Konzept

Erst nach Deutsch-Freigabe.

- Englisch als Lernsprache im Sprachtraining.
- Englisch als Sprachtest-Simulation eigener Einstieg.
- gleiche Vollprüfungsregel.
