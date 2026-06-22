# Arbeitsanweisung · Aktueller Stand

**Projekt:** Eignungstest-Trainer / BPS-Trainer PWA  
**Aktuelle App-Version:** G54.43.8L  
**Dokumentationsstand:** 2026-06-22  
**Zweck dieses Ordners:** `arbeitsanweisung/` enthält Plan, Schichtübergabe, Bug-Backlog und QA-Regeln. Der Ordner ist nicht für die App-Funktion notwendig und kann später gelöscht werden.

---

## 1. Aktueller Zustand

Die App wurde von **G54.43.8K Clean** auf **G54.43.8L** weitergeführt.

In G54.43.8L wurde die Sprachstruktur begonnen und sauber getrennt:

- Das bisherige Sprachkurs-Dashboard wird sichtbar als **Sprachtraining** eingeordnet.
- Das Simulation Center enthält jetzt einen Einstieg **Sprachtest-Simulation · Deutsch**.
- Sprachtest-Simulation ist ausdrücklich **immer Vollprüfung**.
- Die vorhandene `LanguageExamShell` wird für Deutsch weiterverwendet, aber über einen Simulation-Center-Kontext geöffnet.
- Im Sprachtraining bleibt Lernen, Muttersprache/Hilfssprache, Einstufungstest, Lektionen, Vokabeln, Fehlertraining und Hilfe.
- Home-Dock-Abstand wurde erhöht, damit Trainingskarten nicht mehr unter dem Bottom-Dock liegen.
- Versionen wurden auf **G54.43.8L-2026-06-22** aktualisiert.

---

## 2. Harte Produktregel

**Simulation Center → Sprachtest = immer Vollprüfung.**

Keine Teilprüfungen im Simulation Center.

Lesen, Hören, Schreiben, Sprechen und Grammatik als Einzelbereiche sind **Übung/Training** und gehören in **Sprachtraining**, nicht in Simulation.

---

## 3. Aktuelle Zielstruktur

### Simulation Center

- BPS Simulation
- CTC-Lohr Simulation
- Sprachtest-Simulation
  - Deutsch
  - Niveau A1 bis C2
  - Vollprüfung starten
  - keine Hilfe während der Prüfung
  - Ergebnis und Coach danach

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

Nächste Arbeit nach G54.43.8L:

1. Live-QA auf iPhone/iPad/Desktop durchführen.
2. Prüfen, ob Simulation Center → Sprachtest-Simulation · Deutsch sichtbar ist.
3. Prüfen, ob Niveauauswahl öffnet und Vollprüfung startet.
4. Prüfen, ob Sprachtraining keine Prüfungskarte mehr als Hauptfunktion enthält, sondern nur Hinweis/Link zur Simulation.
5. Prüfen, ob Home-Dock-Overlap weg ist.
6. Danach erst Englisch-Konzept/Integration beginnen.
