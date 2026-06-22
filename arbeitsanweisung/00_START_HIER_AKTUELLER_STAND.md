# Arbeitsanweisung · Aktueller Stand

**Projekt:** Eignungstest-Trainer / BPS-Trainer PWA  
**Aktuelle App-Version:** G54.43.8M  
**Dokumentationsstand:** 2026-06-22  
**Zweck dieses Ordners:** `arbeitsanweisung/` enthält Plan, Schichtübergabe, Bug-Backlog und QA-Regeln. Der Ordner ist nicht für die App-Funktion notwendig und kann später gelöscht werden.

---

## 1. Aktueller Zustand

Die App wurde von **G54.43.8L** auf **G54.43.8M** weitergeführt.

In G54.43.8L wurde die technische Sprachprüfung sauber aus dem Sprachtraining herausgelöst. In G54.43.8M wurde zusätzlich die Home-Seite produktlogisch verbessert:

- Auf der Home-Seite gibt es jetzt **zwei getrennte große Simulations-Einstiege**.
- **Eignungstest-Simulation** ist für BPS, CTC und berufliche Auswahltests.
- **Sprachtest-Simulation** ist als eigener großer Einstieg sichtbar und führt zur Deutsch-Vollprüfung.
- Der allgemeine Eignungstest-Simulationsbereich enthält Sprache nicht mehr als versteckten Unterpunkt.
- Sprachtraining bleibt Lernen/Üben mit Hilfen, Muttersprache/Hilfssprache, Einstufungstest und A1–C2-Lernpfad.
- Sprachtest-Simulation bleibt Prüfung/Vollsimulation ohne Hilfe.

---

## 2. Harte Produktregel

**Sprachtest-Simulation = immer Vollprüfung.**

Keine Teilprüfungen im Simulationseinstieg.

Lesen, Hören, Schreiben, Sprechen und Grammatik als Einzelbereiche sind **Übung/Training** und gehören in **Sprachtraining**, nicht in Simulation.

---

## 3. Aktuelle Zielstruktur

### Home-Seite

- Eignungstest-Simulation
  - BPS
  - CTC
  - berufliche Auswahltests
- Sprachtest-Simulation
  - Deutsch
  - Niveau A1 bis C2
  - Vollprüfung starten

### Eignungstest-Simulation

- IT / FISI
- Sozialpädagogik
- Kaufmännisch
- BPS / CTC je nach Bereich

### Sprachtest-Simulation

- Deutsch zuerst
- immer Vollprüfung
- keine Hilfe während der Prüfung
- Ergebnis und Coach danach
- Englisch erst später

### Sprachtraining

- Muttersprache/Hilfssprache wählen
- Lernsprache wählen
- Einstufungstest
- A1 bis C2 Lernpfad
- Lektionen
- Vokabeln
- Grammatik
- Lesen/Hören/Schreiben/Sprechen üben
- Hilfe und Übersetzung erlaubt

---

## 4. Wichtig für die nächste KI / den nächsten Entwickler

Deutsch zuerst stabilisieren. Englisch erst danach.

Nächste Arbeit nach G54.43.8M:

1. Live-QA auf iPhone/iPad/Desktop durchführen.
2. Prüfen, ob Home zwei große Kacheln zeigt: Eignungstest-Simulation und Sprachtest-Simulation.
3. Prüfen, ob Eignungstest-Simulation nur BPS/CTC/Auswahltest-Struktur enthält.
4. Prüfen, ob Sprachtest-Simulation direkt die Deutsch-Vollprüfungsstruktur öffnet.
5. Prüfen, ob Sprachtraining weiter als Übungsbereich funktioniert.
6. Prüfen, ob Home-Dock-Overlap weg ist.
7. Danach erst Deutsch-Prüfungsqualität A1–C2 vertiefen.
