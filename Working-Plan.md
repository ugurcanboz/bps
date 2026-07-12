# Working-Plan · G54.46.11

## G54.46.11 · 2026-07-10 · HÖRTRAINING UND AUDIOREALISMUS ABGESCHLOSSEN

### HIER SIND WIR JETZT
Deutsch und Englisch A1–C2 verwenden eine gemeinsame Audio-Engine mit niveauabhängigem Tempo, natürlichen Pausen, Sprechersegmenten, optionaler Akzentvariation, iOS-Heartbeat und transparentem Fallback. Sprachtraining und Vollsimulation greifen auf dieselbe Architektur zu.

### Ehrlicher Status
- Audio-Engine-Tests: **12/12 grün**
- Integrationsprüfungen: **12/12 grün**
- Gesamtregression: **22/22 Suites grün**
- A1–B2: **zwei Wiedergaben**
- C1/C2-Hardmode: **eine Wiedergabe**
- professionelle Studioaufnahmen: **noch nicht enthalten**
- vollständiger realer Geräte-Browser-E2E: **noch offen**
- nächster Schritt: **G54.46.12 · Sprechen realistisch und ehrlich bewerten**

### Verbindliche Audioregeln
- Browser-TTS wird nicht als Studioaufnahme bezeichnet
- Sprecher- und Akzentvariation nur bei tatsächlich verfügbaren Systemstimmen
- Transkript in der Simulation gesperrt, solange Audio funktioniert
- Hilfsmodus wird im Ergebnis markiert
- Audiofehler führen zu sichtbarem Fallback

---


## G54.46.8 · 2026-07-10 · SPRACHCONTENT-QA UND LEVELDIFFERENZIERUNG ABGESCHLOSSEN

### HIER SIND WIR JETZT
Deutsch und Englisch A1–C2 besitzen ein verbindliches Content-Qualitätsgate. Aktive Platzhalter und defekte Satzschablonen wurden entfernt, die englischen B1–C2-Generatoren niveauabhängig neu aufgebaut und die reichhaltigen deutschen B1–C2-Aufgaben vor einer vereinfachenden Überschreibung geschützt. C1/C2 starten nicht mehr als reine Vokabelserie. Der Leveldifferenzierungsvalidator ist ohne Lockerung der Bewertungsgrenzen grün.

### Ehrlicher Status
- G54.46.8 Quellcode: **abgeschlossen**
- REL-P0-009 und REL-P0-011: **geschlossen**
- aktive Inhaltseinträge geprüft: **5.261**
- Content-Gates: **alle grün**
- Leveldifferenzierung: **vollständig grün**
- A1-Positivprobe: **71 Punkte**
- einfache A1-Antwort auf B2: **20 Punkte / nicht bestanden**
- strukturierte B2-Probe: **83 Punkte bei 185 Wörtern / bestanden**
- vollständiger App-Browser-E2E: **nicht verifiziert**, lokaler Server war in der isolierten Umgebung nicht erreichbar und Chromium lief in den Timeout
- offene P0-Quellcodepunkte: **1**
- zusätzliche Deployment-Verifikationsgates: **2**
- nächster Schritt: **G54.46.9 · Sprachtraining didaktisch wirksam und transparent machen**

### Verbindliche Content-Regeln
- keine Platzhalter oder künstlichen Templates im aktiven Bestand
- vier eindeutige Optionen je englischer Auswahlfrage
- C1/C2 nicht durch isolierte Übersetzung dominiert
- Deutsch B1–C2 mindestens 43 Aufgaben pro Lektion, sieben Aufgabentypen und acht Speaking-Aufgaben
- Leveldifferenzierungsvalidator ist ein hartes Release-Gate

---

## G54.46.7 · 2026-07-10 · REVIEW- UND LERNLOGIK ZERO-DEBT ABGESCHLOSSEN

### HIER SIND WIR JETZT
Deutsch und Englisch verwenden dieselbe versionierte Review-Policy. Neue und nie bearbeitete Aufgaben bleiben normaler Lernstoff und erzeugen keine Review-Schuld. Reviews entstehen ausschließlich nach einem Fehler, einer manuellen Markierung oder einem tatsächlich erreichten Wiederholungstermin. Das Sprachdashboard empfiehlt neuen Nutzern Einstufungstest oder erste Lektion statt eines künstlichen Review-Rückstands.

### Ehrlicher Status
- G54.46.7 Quellcode: **abgeschlossen**
- REL-P0-008: **geschlossen**
- Review-Engine-Tests: **15/15 grün**
- Review-Integrationsprüfungen: **13/13 grün**
- bestehende Admin-, Security-, Ledger-, Analytics-, UI- und Operations-Regressionen: **10/10 Suites grün**
- Functions-Backendtests: **13/13 grün**
- vollständiger App-Browser-E2E: **nicht verifiziert**, System-Chromium hing in der isolierten Umgebung trotz erfolgreichem lokalen HTTP-Abruf
- offene P0-Quellcodepunkte: **3**
- zusätzliche Deployment-Verifikationsgates: **2**
- nächster Schritt: **G54.46.8 · Sprachcontent A1–C2 und Leveldifferenzierung vollständig abnehmen**

### Verbindliche Review-Regeln
- unberührt = neu, nicht fällig
- falsch = sofort fällig
- manuell markiert = sofort fällig
- korrekt = zukünftiger Wiederholungstermin
- Termin erreicht = fällig
- pausiert = nicht im Review
- Legacy-Fehler bleiben fällig; Legacy-Korrektwerte ohne Termin erzeugen keine erfundene Schuld

---

## Historie ab G54.46.6

## G54.46.6 · 2026-07-10 · ADMINBETRIEBSFUNKTIONEN ABGESCHLOSSEN

### HIER SIND WIR JETZT
Das Adminportal besitzt eine zentrale Betriebsansicht mit hashverkettetem Audit-Log, Sync-Gesundheit, Massenaktionen, kombinierbaren Filtern, Datenschutzinventar und strikter Demo-/Produktions-/Legacy-Trennung. Demo-Profile werden außerhalb Development nicht mehr als echte Produktionskonten oder Analytics-Daten behandelt.

### Ehrlicher Status
- G54.46.6 Quellcode: **abgeschlossen**
- REL-P0-010 sowie REL-P1-001 und REL-P1-002: **geschlossen**
- Admin-Operations-Tests: **8/8 grün**
- Integrationswächter: **11/11 grün**
- Backend-Policy-Regression: **13/13 grün**
- JavaScript-Syntax: **165/165 grün**
- JSON: **87/87 grün**
- vollständiger App-Browser-E2E: **nicht verifiziert**, System-Chromium lieferte in dieser Umgebung keinen belastbaren App-Start
- automatische Durchsetzung der Aufbewahrungsrichtlinie: **noch nicht deployed**, separater Scheduler erforderlich
- offene P0-Quellcodepunkte: **4**
- zusätzliche Deployment-Verifikationsgates: **2**
- nächster Schritt: **G54.46.7 · Review- und Lernlogik reparieren**

### Verbindliche Betriebsregeln
- Audit-Einträge werden produktiv ausschließlich serverseitig angehängt
- Demo-Daten fließen nicht in Produktionslisten und Produktionsstatistiken ein
- Bulk-Schreibvorgänge sind auf 100 deduplizierte Konten begrenzt
- Datenschutzexporte entfernen Geheimnisse und Authentifizierungsdaten
- eine gespeicherte Aufbewahrungsrichtlinie gilt erst nach Deployment eines überwachten Löschjobs als automatisch durchgesetzt

---

## Historie ab G54.46.5

## G54.46.5 · 2026-07-10 · ADMINOBERFLÄCHE VISUELL UND FUNKTIONAL FINALISIERT

### HIER SIND WIR JETZT
Aufgabenbank, Systemzentrale und Berichte verwenden robuste semantische Komponenten. Auf Smartphones ersetzen Karten die überbreite Berichtstabelle. Die Admin-Tabs zeigen horizontale Scrollbarkeit an und unterstützen ARIA, Pfeiltasten, Home und End. Touchziele sind mindestens 44 Pixel hoch, Auswahlfelder 24 Pixel groß.

### Ehrlicher Status
- G54.46.5 Quellcode: **abgeschlossen**
- REL-P0-007: **geschlossen**
- Admin-UI-Guard: **17/17 grün**
- isolierte Visual-QA Desktop/iPad/iPhone: **3/3 grün**
- horizontale Überbreite / Kartenüberlappung / kleine Buttons: **0 Befunde**
- bisherige Admin-, Security-, Ledger-, Analytics- und Backendregressionen: **grün**
- vollständiger App-Browser-E2E: **nicht bestanden/ausgeführt**, lokale Navigation erneut mit `ERR_BLOCKED_BY_ADMINISTRATOR` blockiert
- offene P0-Quellcodepunkte: **5**
- zusätzliche Deployment-Verifikationsgates: **2**
- nächster Schritt: **G54.46.6 · notwendige Adminbetriebsfunktionen**

### Verbindliche UI-Regeln
- Werte, Labels und Metadaten bleiben getrennte Elemente
- mobile Berichte nutzen Karten statt erzwungener breiter Tabellen
- interaktive Adminziele mindestens 44 Pixel
- Tabs müssen mit Touch und Tastatur bedienbar bleiben
- produktives Release-Polish-CSS wird zuletzt geladen

---

## Historie ab G54.46.4


## G54.46.4 · 2026-07-10 · ADMIN-KPIS UND DIAGRAMME KORRIGIERT

### HIER SIND WIR JETZT
Die Adminanalyse nutzt eine eigene testbare Analytics-Engine. Simulationen werden nach gestartet, abgeschlossen und abgebrochen getrennt. Aktivität, Sieben-Tage-Verlauf und Heatmap stammen ausschließlich aus echten Ledgerdaten. Rollen werden aus Teilnehmerprofilen, Dozentenregister und aktuell signiertem Admin dedupliziert; Demo-Konten bleiben getrennt. Legacy-Zähler werden sichtbar ausgeschlossen.

### Ehrlicher Status
- G54.46.4 Quellcode: **abgeschlossen**
- REL-P0-004 bis REL-P0-006: **geschlossen**
- Analytics-Sollwerttests: **28/28 grün**
- Integrationswächter: **13/13 grün**
- Backend Policy Regression: **13/13 grün**
- JavaScript-Syntax: **161/161 grün**
- JSON: **72/72 grün**
- Browser-Screenshot-QA: **nicht bestanden/ausgeführt**, lokale Navigation wurde mit `ERR_BLOCKED_BY_ADMINISTRATOR` blockiert
- offene P0-Quellcodepunkte: **6**
- zusätzliche Deployment-Verifikationsgates: **2**
- nächster Schritt: **G54.46.5 · Adminoberfläche visuell und funktional finalisieren**

### Verbindliche Datenregeln
- nur `simulation` und `language-exam` zählen als Simulation
- Legacy-Zähler zählen nicht als echte Sessions
- „kürzlich aktiv“ nutzt nur Ledger-Zeitstempel
- Rollenansicht heißt bewusst „Bekannte Konten nach Rolle“
- Schwächen werden nach Antwortanzahl gewichtet
- leere Daten bleiben leer und werden nicht geschätzt

---


## G54.46.3 · 2026-07-10 · EINHEITLICHES EREIGNIS- UND SESSIONMODELL

### HIER SIND WIR JETZT
Das appweite Activity Ledger ist eingeführt. Aufgaben sind Ereignisse; Training, Simulation und Sprachtest sind echte, idempotente Sessions. Die Cloud Function `recordLearningSession` setzt die Identität aus dem Firebase-Token, validiert die Daten, schreibt Session und Ereignisse append-only und berechnet `activitySummary` serverseitig. Alte Profilzähler bleiben getrennte Legacy-Metriken und werden nicht zu erfundenen Simulationen umgedeutet.

### Ehrlicher Status
- G54.46.3 Quellcode: **abgeschlossen**
- Activity-Ledger-Test: **17 Prüfungen grün**
- Integrationswächter: **13 Prüfungen grün**
- Backend-Policy-Tests: **13/13 grün**
- Migrationstest: **3/3 grün**
- statische Gesamtprüfung: **grün**
- Firestore-Emulatortest: **nicht ausgeführt**, Firebase CLI fehlt in dieser Umgebung
- Cloud-Deployment und Staging-Verifikation: **ausstehend**
- verbleibende geplante P0-Phasen: **9**
- nächster Schritt: **G54.46.4 · Admin-KPIs und Diagramme vollständig korrigieren**

### Neue Datenregel
- einzelne Antworten zählen niemals als vollständige Simulation
- Simulationen zählen nur als `simulation` oder `language-exam`
- Tagesaktivität und Heatmap stammen nur aus echten Ledger-Sessions
- Legacy-Zähler werden separat angezeigt und nicht mit neuen Sessions vermischt
- `client-reported-validated` ist servervalidiert, aber noch keine serverseitige fachliche Lösungskontrolle

---

## G54.46.2 · 2026-07-10 · ROLLEN, RECHTE UND DATENSICHERHEIT GEHÄRTET

### HIER SIND WIR JETZT
Die produktive Vertrauensgrenze wurde vom Browser in signierte Firebase-ID-Token-Claims und privilegierte Cloud Functions verlagert. Local Storage, E-Mail-Listen, Profilfelder, lokale Admin-PINs und `?qa=1` können in Produktion keine Admin- oder Dozentenrechte mehr erzeugen. Firestore-Regeln, serverseitige Adminaktionen, App-Check-Vorgaben, Zugriffscode-Einlösung, Audit-Ereignisse und negative Sicherheitstests liegen vollständig im Source-Paket.

### Ehrlicher Status
- G54.46.1 Adminstart: **abgeschlossen**
- G54.46.2 Sicherheitsquellcode: **abgeschlossen**
- Backend-Policy-Tests: **8/8 grün**
- Frontend-Manipulationstests: **5/5 grün**
- Firestore-Emulatorlauf: **in dieser Umgebung nicht ausführbar**, weil das Emulator-JAR nicht heruntergeladen werden konnte
- Produktionsdeployment und Staging-Negativtest: **noch ausstehend**
- öffentlicher Release: **nein**
- offene P0-Quellcodepunkte nach dieser Phase: **10**
- nächster Schritt: **G54.46.3 · Einheitliches Ereignis- und Sessiondatenmodell**

### Sicherheitsgrenze ab jetzt
- Rollen ausschließlich aus verifizierten ID-Token-Claims
- privilegierte Schreibvorgänge ausschließlich über Callable Functions
- direkte Browser-Schreibrechte auf Rollen, Sperren, Gruppen und Adminfelder verweigert
- Anonymous Auth besitzt keine Rechte auf geschützte Teilnehmer- oder Verwaltungsdaten
- lokale PIN- und QA-Zugänge ausschließlich in Development
- Produktionskonfiguration arbeitet bei fehlendem App Check oder fehlenden Claims fail-closed

### Pflicht vor Produktionsfreigabe
Firestore-Regeln und Functions deployen, ersten Admin per Bootstrap setzen, App Check konfigurieren und die mitgelieferte Emulator-/Staging-Negativtestsuite vollständig grün ausführen.

---

## G54.45.2 · 2026-07-03 · ADMIN-RECHTE KOMPLETT + Darstellungs-Audit — RELEASE-KANDIDAT

### HIER SIND WIR JETZT
Die administrative Verwaltungskette ist end-to-end im Browser BEWIESEN (Warnen → Sperren → Login-Ablehnung → Entsperren → Umbenennen/Rolle/Notiz → Passwort-Reset → Archiv → Endgültig löschen), inklusive Teilnehmerseite (Warn-Popup mit Quittierung, Gesperrt-Vollbild). Darstellungs-Audit abgeschlossen; kritischer Router-Close-Bug behoben. Klick-QA grün, Prüfungssimulation regressionsfrei. Nächster Punkt: Modularisierung der Simulationen; Live-Backend-Smoke vor Kundenfreigabe.

### Neue Funktionen (Lücken für 100% Administration geschlossen)
1. **Passwort-Reset im Profil-Sheet (🔑):** resetPassword existierte nur als API — der tägliche Kursfall „Teilnehmer hat Passwort vergessen" war für den Admin unbedienbar. Jetzt: Button mit Bestätigung, zeigt Einmalpasswort einmalig an, erzwingt Passwortwechsel beim nächsten Login.
2. **Einzellöschung im Profil-Sheet (🗑️):** deleteLearner hatte keine UI (nur Demo-Massenlöschung/Kurs-Reset). Jetzt: Doppelte Bestätigung (Dialog + ID-Eingabe), Archiv-Eintrag DEL-*, Liste aktualisiert live.
3. **Lokales User-Archiv:** Der Archiv-Tab war Firestore-only und offline IMMER leer. Jetzt: egt_user_archive_local_v1 (Cap 200), Verwarnungen/Sperrungen/Entsperrungen/Löschungen werden lokal archiviert und mit der Cloud gemerged.

### Behobene Defekte
4. **KERNLÜCKE Teilnehmer-Notices:** egt-user-notices brach bei source !== 'firebase-auth' ab — lokal angemeldete Teilnehmer (der Normalfall!) sahen WEDER Warn-Popup NOCH Gesperrt-Bildschirm. Fix: frisches Profil aus egt_global_learner_profiles für lokale Sessions. Beweis: Warn-Popup erscheint, „Verstanden" quittiert (für Admin sichtbar ack:true); Gesperrt-Vollbild deckt Viewport, Sperrgrund + Kontakt-Hinweis, App gesperrt.
5. **acknowledgeWarning war offline ein No-Op** — Warnungen blieben ewig pending. Jetzt lokale Quittierung + Firestore falls online.
6. **KRITISCH Router-Close-Bug:** ui-router callKnownClose entfernte beim ✕/Escape nur .show vom Admin-Modal OHNE EGTAdminPortal.close() — die Lock-Klassen blieben auf html/body: Bottom-Dock verschwunden, Scrolling tot, App bis zum Reload unbrauchbar. Fix: Branch ruft close() auf + entfernt Lock-Klassen explizit. Verifiziert: ✕ und Escape schließen sauber, Scrollen sofort möglich, Mehr-Menü sofort nutzbar.
7. **Sperren/Entsperren-Button kippte nicht** (zeigte Zustand vom Öffnen) — Sheet baut sich nach der Aktion mit frischen Daten neu auf.
8. **Ticket-reporter-String-Guard** (Crash bei reporter als String).

### Darstellungs-Audit (Ergebnis)
- Scroll-Lock korrekt: Hintergrund während offenem Portal fixiert, Portal scrollt intern (2883px gemessen); nach Schließen Scrolling sofort frei.
- Diagramme ECHT: Berichte-Balken mit realen Werten (17/33%), Ø Quote 61%, Dashboard-Donut GESAMTSYSTEM 61%, Teilnehmer-Detail-Report mit 7 Zeilen + Balken.
- Überlappungen: Manage-Sheet liegt korrekt über allem (z-index max), Löschen-Button mobil sichtbar UND klickbar (elementFromPoint-verifiziert), Gesperrt-Screen deckt Viewport vollständig.
- **Bekannte kosmetische Einschränkung:** Beim Weg Mehr-Menü→Portal→Schließen springt die Seiten-Scrollposition auf den Anfang (Zusammenspiel zweier Legacy-Scroll-Locks; Restore-Mechanik in bodySheetLock vorbereitet, Router-releaseLock läuft debounced nach). Funktional ohne Auswirkung — Scrolling selbst ist frei. Kandidat für spätere Vereinheitlichung der Lock-Mechanik.

### Ehrliche Antwort auf „fehlt etwas für 100% Administration?"
Jetzt vorhanden und bewiesen: Anlegen (mit Einmalpasswort), Suchen/Filtern/Sortieren, Profil bearbeiten (Name/Rolle/Gruppe/Status), Notizen, Verwarnen (mit Zustellnachweis), Sperren/Entsperren (Login-Ablehnung + Vollbild-Sperre), Passwort-Reset, Versuche zurücksetzen, Code verlängern, Einzellöschung, Export JSON/CSV, Kurs-Reset, Archiv, Tickets, Rollentrennung Dozent A/B. Bewusste Grenzen: Zugangscode-Erzeugung braucht Live-Firebase (ehrliche Ablehnung offline); Massenaktionen (z. B. ganze Gruppe sperren) existieren nicht — als Roadmap-Punkt notiert, kein Blocker; eine laufende Session eines just gesperrten Teilnehmers endet beim nächsten Statuscheck/Login (Sofort-Kick über Firestore-Push wäre Live-Backend-Thema).


## G54.45.1 · 2026-07-03 · Admin-Portal-Audit & Härtung — RELEASE-KANDIDAT

### HIER SIND WIR JETZT
Das Admin-Portal wurde komplett auditiert (11 Tabs, Kern-Workflows, Rollen, Mobile) und die gefundenen Defekte sind behoben und browserverifiziert. Klick-QA 19/19 grün, Prüfungssimulation regressionsfrei (A2-Volllauf inkl. Coach). Nächster offener Punkt: Modularisierung der Simulationen; vor Kundenfreigabe Live-Backend-Smoke (Firebase/Groq/Supabase).

### Behobene Defekte (alle im echten Browser reproduziert)
1. **KRITISCH · Tote Kern-Buttons im Gruppen-Tab:** switchTab('groups') rendert die Phase-5-Werkzeuge per innerHTML neu — die einmalig direkt gebundenen onclick-Handler gingen dabei verloren. Folge: „Teilnehmer erstellen", „Demo-Daten erzeugen/löschen", „Export JSON/CSV", „Kurs resetten", „Gruppe speichern", „Nächste ID" waren stumm tot (Klick ohne jede Reaktion). Fix: delegierter Click-Listener auf dem Modal. 
2. **KRITISCH · „Teilnehmer erstellen" warf zusätzlich ReferenceError:** die im Original-Handler benutzte Funktion setCreateResult war NIE definiert — die Anlage wäre auch mit lebendem Button stumm gescheitert. Helper ergänzt (schreibt in [data-create-result], zeigt ID + Einmalpasswort).
3. **HOCH · Teilnehmerliste (Phase 2) blieb leer:** Die Ansicht wurde nur beim Modal-Öffnen gerendert; nach Demo-Daten/Neuanlage oder Tabwechsel zeigte sie „0 SICHTBARE TEILNEHMER", obwohl die Daten da waren. Fix: refreshParticipantsWorkspace() bei switchTab('participants') und nach jeder Datenänderung. Verifiziert: 7 Teilnehmer mit Risiko-Badges, Filterzähler (Stabil/Riskant/Kritisch/Inaktiv) korrekt.
4. **HOCH · Sicherheits-/Professionalitätslücke Demo-Dozenten:** Fest verdrahtete Demo-PINs (DozentA123!/DozentB123!) standen als Placeholder sichtbar im Login und funktionierten IMMER — jeder hätte damit echte Teilnehmerdaten der Gruppe einsehen können. Fix: Demo-Dozent-Zugänge sind nur aktiv, solange der Kurs leer ist oder ausschließlich Demo-Teilnehmer (isDemo-Flag) enthält; sobald ein echter Teilnehmer existiert, verschwinden die Karten UND der Login wird mit klarer Meldung abgelehnt. Verifiziert in beiden Richtungen.
5. **MITTEL · Irreführende Systeminfo:** System-Tab zeigte hartcodiert „Version G39.14" (App ist G54.45.x) — liest jetzt AppConfig. Roadmap-Tab nannte G39.14 als „Aktuell" — Inhalte auf den echten Stand gebracht (versionsdynamisch).
6. **ROBUSTHEIT · Ticketsystem:** _saveTicket crashte bei reporter als String („Cannot create property nickname") — Guard ergänzt. Ticket-Flow verifiziert: Anlage → Tickets-Tab zeigt Einträge + Badge „Tickets 2".

### Audit-Ergebnis (Ist-Zustand nach Fixes)
- **Alle 11 Tabs** rendern ohne Overflow und ohne JS-Fehler (Desktop 1440, iPad 820, iPhone 393; Tabbar mobil korrekt horizontal scrollbar, jeder Tab erreichbar).
- **Workflows grün:** PIN-Erstsetup (Hash+Salt) → Demo-Daten (6 TN, Gruppen A/B) → Teilnehmer anlegen (ID + Einmalpasswort) → Liste/Filter/Profile → Berichte mit echten Werten (Ø Quote 61%, Diagramme) → Tickets. 
- **Rollentrennung sauber:** Dozent sieht nur Teilnehmer/Übersicht/Berichte/Tickets; Dozent A sieht ausschließlich Gruppe A (3/3), Dozent B ausschließlich B (3/3) — API-verifiziert. Admin-only-Tabs (System/Roadmap/Aufgabenbank) für Dozent gesperrt.
- **Offline ehrlich:** Zugangscode-Generierung verweigert ohne Firebase mit klarer Meldung („kein lokaler Fake-Code") statt still zu scheitern. Admin-Logout ist bewusst ein Voll-Logout inkl. App-Session (Sperrbildschirm) — sicherheitsgerecht.
- **Kein Datenverlust-Risiko gefunden**; Demo-Teilnehmer sind mit Demo-Pill markiert und getrennt löschbar.

### Merksatz
Direkt gebundene onclick-Handler + innerHTML-Rerender = tote Buttons ohne Fehlermeldung. Im Admin-Portal künftig ausschließlich delegierte Listener auf dem Modal verwenden (Muster: Zeile ~3055ff.).


## G54.45.0 · 2026-07-03 · ECHTE SIMULATION — Inhaltsüberholung DE/EN — RELEASE-KANDIDAT

### HIER SIND WIR JETZT
G54.45.0 macht aus der Prüfungssimulation ein valides Messwerkzeug. Die drei Effektivitätskiller aus dem Inhaltsaudit sind behoben und im Browser bewiesen. Volle Regression grün (Klick-QA 19/19 inkl. neuer Inhalts-Checks, DE/EN-Vollläufe, Tab-Lock/Quota, Geräte-Sweep 5 Profile). Nächster offener Punkt: Modularisierung der Simulationen.

### 1 · Immer-A-Bug behoben (größter Hebel)
`examOptions` stellte die richtige Antwort IMMER auf Position A — ein "immer A"-Bot erreichte 100 %. Neu: deterministische Options-Mischung pro Frage (Seed aus der Fragen-ID, stabil über Rendern UND Bewertung, da beide den Teil regenerieren). Beweis: Immer-A-Bot fällt von 100 % auf 50 % (EN) / 25 % (DE); Verteilung der richtigen Position über 216 EN-Fragen: A 81 / B 67 / C 68.

### 2 · 216 neue englische Prüfungsitems (data/language-english-exam-variants.js)
Die EN-Varianten waren Template-Klone (identischer Lesetext in allen 3 Varianten, Meta-Fragen ohne Verstehensanteil, 10/30 einzigartig). Neu: 18 handgeschriebene Varianten (A1–C2 × 3) mit je eigenem Lesetext, eigenem Hörtext, 4 inhaltsbasierten Lese-, 4 Hör- und 4 Grammatikfragen — CEFR-gestaffelt von A1-Aushängen bis C2-Diskursanalyse. Messwert: 36/36 einzigartige Fragen pro Level, 3/3 einzigartige Texte. Alter Generator bleibt nur als Fallback, falls die Datendatei fehlt.

### 3 · Deutscher Ausbau (data/language-german-exam-supplement.js)
Alle 18 DE-Varianten um einen Textsatz und je eine weitere Lese- und Hörfrage erweitert (3→4 Fragen pro Textteil). Merge geschieht idempotent im Pool-Builder.

### 4 · Ehrliche Prüfungszeiten (data/language-exam-blueprints.js)
Objektive Teilzeiten an den realen Umfang angepasst; Schreiben/Sprechen unverändert. Neue Gesamtzeiten: A1 47 · A2 60 · B1 82 · B2 108 · C1 134 · C2 160 Min (vorher B1 "130 Min" bei 10 Minuten realem Inhalt). Levelkarten zeigen die Werte automatisch.

### 5 · Echtes Sprechen in der Prüfung
Neuer Diktat-Button 🎙️ im Sprechteil (Browser-SpeechRecognition, de-DE/en-GB): Gesprochenes wird an die Antwortbox angehängt, Transkript bleibt vor der Bewertung korrigierbar. Ohne Geräteunterstützung erscheint ein klarer Hinweis; der Transkript-Weg bleibt unverändert (iOS-sicher).

### Korrektur zum Audit
Der Englisch-KURS deckt entgegen der ersten Analyse bereits A1–C2 ab (B1/B2- und C1/C2-Lektionsbäume werden per 10N/10P-Ausbau nachträglich in den Baum injiziert; die statische Suche hatte nur A1/A2 gefunden). Kein "im Ausbau"-Hinweis nötig.

### QA-Erweiterung
run_browser_click_qa.py prüft jetzt zusätzlich: Antwortpositionen gemischt, EN-Texte einzigartig, DE-Supplement geladen (19 Checks gesamt).


## G54.44.6 · 2026-07-03 · Release-Härtung (Stresstest-Befunde behoben) — RELEASE-KANDIDAT

### HIER SIND WIR JETZT
G54.44.6 ist der Release-Kandidat. Beide echten Schwachstellen aus dem Stresstest sind behoben und im 2-Tab-Szenario bzw. bei erzwungener Speicher-Quota browserverifiziert. Volle Regression grün: run_browser_click_qa.py 16/16, DE/EN/A2-Vollläufe bis Endbericht, Geräte-Sweep 5 Profile ohne Befund, alle 44.5-Features intakt. Nächster offener Punkt laut Plan: Modularisierung der Simulationen (EGTSimulation.start(config)).

### Neu in 44.6
1. **Tab-Lock gegen Prüfungs-Doppelstart** (einzige Datenverlust-Gefahr aus dem Stresstest): Heartbeat-Lock (`language-academy-exam-tab-lock-v1`, TTL 12 s, Refresh alle 5 s solange status=running, Freigabe bei pagehide/Sessionende). Zweiter Tab bekommt beim Startversuch eine Warnansicht mit bewusster Übernahme-Option ("Trotzdem HIER starten"); der verdrängte Tab wird per storage-Event informiert ("Dieser Tab ist nicht mehr aktuell"). Stilles Mischen zweier Prüfungen ist damit ausgeschlossen.
2. **Quota-Schutz statt stummem Datenverlust:** saveSession/saveHistory fangen QuotaExceeded, rotieren zuerst das Ergebnis-Archiv (40 → 10 Einträge) und versuchen erneut; erst wenn auch das scheitert, erscheint eine sichtbare rote Warnung ("Gerätespeicher voll…"). Verifiziert mit randvollem Speicher + 200-KB-Antwort: Warnung erscheint, UI läuft weiter.

### Stresstest-Zusammenfassung (Basis: 44.5, Details in STRESSTEST-REPORT-G54_44_5.md)
Kein harter Ausfall gefunden. 15-Runden-Marathon leckfrei (Heap +0,1 MB), Klick-Stürme ohne Doppelbewertung, 500-KB-Paste in ~1 s bewertet, Boot mit voller 5-MB-Quota ok, 12 parallele Geräte 12/12 mit sauberer Isolation, Low-End (6× CPU-Drossel) 7,2 s bis Home. Backend-Rechnung: Prüfungen sind serverlastfrei; Firebase-Free-Tier trägt ~2.000–2.500 aktive Nutzer/Tag; Duell-Polling (bis 240 Reads/Duell) ist der Quota-Fresser Nr. 1.

### Release-Hinweise für den Betreiber
- Vor Kundenfreigabe einmal in der ECHTEN Produktionsumgebung prüfen: Firebase-Login/Code-Einlösen, Groq-Live-Bewertung, Supabase-Highscore (in der Test-Sandbox offline, lokale Fallbacks greifen nachweislich).
- Nach dem Deployment Hard-Refresh + Versions-Badge kontrollieren (muss G54.44.6 zeigen) — Service-Worker-Cache heißt jetzt `egt-trainer-g54-44-6`.
- Duell-Feature im Free-Tier sparsam bewerben oder auf Blaze wechseln.


## G54.44.5 · 2026-07-03 · Robustheit & Vertrieb (Umsetzung der QA-Verbesserungsideen)

### HIER SIND WIR JETZT
G54.44.5 ist gebaut, alle sechs Verbesserungsideen aus der 44.4-QA-Runde sind umgesetzt und im echten Browser verifiziert (run_browser_click_qa.py: 16/16 grün, plus gezielte Feature-Verifikation). Nächster offener Punkt laut Plan: Modularisierung der Simulationen (EGTSimulation.start(config)).

### Umgesetzt
1. **Browser-Klick-QA als Pflichtschritt:** Neues Skript `run_browser_click_qa.py` im App-Root. Fährt den echten Demo-Klickpfad (Gate → Simulation-Center → Sprachwahl DE+EN → Level → Variantenauswahl → Prüfungsstart → Grammatik-Sprachcheck) headless über file:// und liefert Exit-Code 1 bei jedem roten Check. VOR JEDER ZIP-LIEFERUNG LAUFEN LASSEN — die VM-Snapshots ersetzen das nicht.
2. **Fehler sichtbar statt stumm:** `handleClick` im Sprachtest-Shell dispatcht jetzt über try/catch; Ausnahmen landen als `console.error` und zeigen dem Nutzer einen roten Toast ("Da ist etwas schiefgelaufen…"). Der stumme `catch(e){}` in `openSheet` loggt jetzt ebenfalls. Ein 44.3-artiger Crash wäre damit sofort sichtbar gewesen.
3. **Zentrale Aktions-Registry:** `featureForAction` liest aus einer deklarativen Regeltabelle; neue Module registrieren Aktionen über `window.EGTActionFeatureRegistry.register(actionOderRegex, feature)` statt still auf 'practice' zurückzufallen. Bestehendes Verhalten unverändert (Gate-Regression grün).
4. **Demo-Upsell:** Nach Verbrauch der 2. Demo-Simulation erscheint EINMAL das Sheet "Weiter geht's mit Vollzugang" (Zugangscode einlösen · Kaufkontakt · Profil) — bewusst verzögert bis zur nächsten Interaktion AUSSERHALB des Prüfungs-Sheets, damit der Endbericht nicht überdeckt wird. Flag: `egt_demo_upsell_pending_v1` (wird beim App-Start nachgeholt, falls die App direkt geschlossen wurde).
5. **Bewertungshinweis vor Schreiben/Sprechen:** Neuer Block "So wird bewertet" (`.la-exam-structure-hint`) zeigt die geprüften Strukturbausteine sprachrichtig VOR der Eingabe (DE: Anrede → Situation → Grund → konkrete Bitte → höflicher Abschluss; EN: Greeting → situation → reason → concrete request → polite closing). Prüfungshärte unverändert.
6. **Sauberer Endstatus:** Nach 5/5 bewerteten Teilen setzt die Session jetzt `status:'finished'` + `finishedAt` (für Admin-Auswertung/Sync robuster als dauerhaftes 'running').

### Verifikation
- run_browser_click_qa.py: 16/16 grün (inkl. Regression Varianten-Crash und Grammatik-Sprachcheck DE/EN).
- Feature-Verifikation im Browser: Strukturhinweis DE+EN sichtbar, status:'finished' nach Volllauf, Upsell-Sheet erscheint genau einmal nach Demo-Ende und nicht über dem Endbericht, Registry löst simulation-center/language-exam-* korrekt auf. Null JS-Fehler.


## G54.44.4 · 2026-07-03 · DE/EN-Simulation Hotfix-Runde (Browser-QA, 5 Geräteprofile)

### HIER SIND WIR JETZT
Version G54.44.4 ist gebaut, browsergetestet (Playwright/Chromium, echte Klickpfade als Demo-Nutzer) und versionssynchron (app-config → service-worker/update-check/manifest). DE- und EN-Vollprüfung B1 wurden komplett durchgespielt (alle 5 Pflichtteile bis Endbericht + Coach-Auswertung). Nächster offener Punkt laut Plan: Modularisierung der Simulationen (EGTSimulation.start(config)).

### Behobene Fehler (alle im echten Browser reproduziert, nicht nur im VM-Test)
1. **BLOCKER – Variantenauswahl crashte (DE & EN, alle Level):** `variantPreviewHtml` nutzte eine undefinierte Variable `language` → ReferenceError beim Klick auf jede Level-Karte; der Nutzer prallte kommentarlos auf die Levelübersicht zurück. Die Variantenauswahl (Kernfeature von 44.3) war damit im Browser komplett unerreichbar. Fix: `simulationLanguage()` sauber durchgereicht (js/modules/language-exam-shell.js). Wichtig: Die VM-QA-Snapshots hatten das nicht erkannt, weil sie `variantCard/variantPreviewHtml` nie rendern.
2. **BLOCKER – Grammatikteil ignorierte die DE/EN-Variante:** `getGrammarTask` fragte zuerst den alten deutschen B1/B2-Pilotpool ab. Folge: Englische Vollprüfung zeigte deutsche Grammatikaufgaben, und auch die DE-Variantengrammatik wurde nie geladen. Fix: Im Simulationskontext hat der generierte Variantenpool Vorrang; Pilot bleibt nur Fallback fürs Training.
3. **KRITISCH – Demo-Gate blockierte die Simulation selbst:** `featureForAction` kannte die aktuellen Aktionen nicht; `simulation-center`, `language-test-simulation-open`, alle `language-exam-*` fielen auf `practice` zurück → Demo-Nutzer sah beim Tippen auf "Simulation" die Meldung "nur die Simulation ist freigeschaltet" und kam trotzdem nicht hinein. Fix: korrekte Klassifizierung (simulation/practice/settings) in js/modules/auth-profile-shell.js. Demo-Verbrauchszählung bleibt unberührt (läuft über result-persistence).
4. **Deployment-Falle – Service-Worker-Cache auf altem Stand:** service-worker.js stand noch auf `egt-trainer-g54-43-10z` → ausgelieferte 44.3-Dateien wären beim Update teils aus dem alten Cache bedient worden ("im Code gefixt, im Browser alt"). sync-version.js ausgeführt; jetzt `egt-trainer-g54-44-4` überall synchron.
5. **WCAG-Kontrast im dunklen Prüfungs-Sheet (4 echte Verstöße, pixelbasiert nachgemessen):**
   - Prüfungsmodus-Hinweiszeile (`.la-exam-proctor-line span`): 1.9:1 → 8.9:1
   - Varianten-Badge (`.la-exam-pool-badge`): 3.4:1 → 9.1:1
   - "Anti-Auswendiglernen"-Label (`.la-exam-entry-head em`): 2.2:1 → 7.5:1
   - Schreib-/Sprechcheck-Checkliste (`.la-writing-rubric li`, inkl. is-ok/is-risk): hell-auf-hell bzw. dunkel-auf-dunkel → jetzt ≥4.5:1
   Fix als scoped Override-Block am Ende von css/language-course.css (nur `[data-ui-deep-sheet="language-exam-shell"]`, Light-Ansichten unberührt).
6. **Kontext-Korrektur:** Home-Quick-Card "Sprachtest" sagte noch "Deutsch Vollprüfung" → jetzt "Deutsch & Englisch Vollprüfung". Hardcodierte 44.3-Fallbacks in index.html und Shell auf 44.4 gezogen.

### Testabdeckung dieser Runde
- 5 Geräteprofile (iPhone SE 375, iPhone 15 Pro 393, Pixel 7 412, iPad 820, Desktop 1440): Boot, Gate-Demo-Flow, Sprachwahl, Level, Varianten, Prüfung Lesen→Sprechen. Kein horizontaler Overflow, keine Elemente außerhalb des Viewports, keine Touchziele <38px, keine JS-Fehler.
- Voll-E2E DE und EN (B1): Lesen 100%, Hören 84% (Helper-Modus-Abzug greift korrekt), Grammatik 100%, Schreiben/Sprechen streng bewertet, Endbericht mit Prognose, Teil-Breakdown, Coach-Auswertung und Trainingsempfehlungen rendert vollständig.
- Statik: node --check über alle JS-Dateien, keine fehlenden Referenzen, keine doppelten IDs.

### Merksatz für die nächste Instanz
Die VM-QA-Snapshots (simulationVariantUxQaSnapshot etc.) prüfen Datenpools, aber NICHT die Render- und Klickpfade. Vor jeder Lieferung zusätzlich einen echten Browser-Klickdurchlauf als Demo-Nutzer fahren (Gate → Simulation → Level → Variante → Teil 1), sonst bleiben Blocker wie der Varianten-Crash unsichtbar.


## Phase
G54.43.10Z · Sprachkurs Abschluss-QA + Schichtübergabe/Release-Kandidat

## Arbeitsnachweis

- 10Y-ZIP entpackt und als Basis verwendet.
- Versionen auf G54.43.10Z-2026-06-28 synchronisiert.
- `sync-version.js` ausgeführt.
- JS-Syntaxcheck über lokale `js/` und `data/` Dateien ausgeführt.
- HTML-Referenzen und doppelte IDs geprüft.
- VM-Release-QA für Sprachkurs, Review, Fortschritt, Admin-/Dozentenansicht und Teilnehmerprofil ausgeführt.
- Admin-Release-Fix ergänzt: fehlende Cloud-Probe-Funktionen für Sprachkurs-Fortschritt definiert.
- Abschlussbericht und aktuelle Schichtübergabe erstellt.
- Release-Kandidat als ZIP gebaut und ZIP-Test bestanden.

## Ergebnis

G54.43.10Z ist als Release-Kandidat paketiert. Keine blockierenden Findings im Abschlusscheck.

## Nächster empfohlener Schritt

Echte GitHub-Pages-Live-Abnahme mit QA-Routen oder Ausbau der Sprachtest-Vollprüfungen.


## G54.44.0 · Sprachtest-Vollprüfungen im Simulation Center

Status: umgesetzt.

Der nächste sinnvolle Schritt nach dem Sprachkurs-Release-Kandidaten wurde eingeleitet. Die Sprachtest-Simulation im Simulation Center ist jetzt als Deutsch-Vollprüfung A1–C2 vorbereitet. Alle Level besitzen fünf Pflichtteile: Lesen, Hören, Grammatik & Sprachbausteine, Schreiben und Sprechen. Teiltests bleiben Training und werden nicht als Simulation angeboten.

QA: VM-QA bestanden, Static Check bestanden, keine fehlenden lokalen Referenzen, keine doppelten HTML-IDs.

## G54.44.1 · Sprachtest-Vollprüfung Varianten + Ergebnis-Coach-Auswertung

Status: umgesetzt.

Ergänzt wurden 3 Vollprüfungsvarianten pro Deutsch-Level A1–C2. Jede Variante enthält Lesen, Hören, Grammatik & Sprachbausteine, Schreiben und Sprechen. Die Ergebnisansicht wurde um eine Coach-Auswertung mit Risiko, Prognose, Priorität und stabilen Bereichen erweitert.

QA:
- VM-QA bestanden
- JS-Syntaxcheck bestanden
- lokale Referenzen vollständig
- keine doppelten HTML-IDs
- ZIP-Test bestanden


## G54.44.2 · Sprachtest-Vollprüfung Varianten-UX + Random-Modus

Status: umgesetzt. Deutsch A1–C2 besitzt jetzt eine sichtbare Variantenauswahl vor dem Prüfungsstart. Jede Variante zeigt alle fünf Pflichtteile als Vorschau. Zusätzlich gibt es einen Random-Modus, der eine Variante automatisch auswählt. Die Vollprüfungsregel bleibt unverändert: keine Teiltests im Simulation Center.

Nächster sinnvoller Schritt: G54.44.3 · Sprachtest-Vollprüfung Live-Flow-QA mit vollständigem Durchlauf über Variante/Random, Start, alle fünf Pflichtteile und Ergebnis-/Coachbericht.

## G54.44.3 · Englisch-Sprachtest-Vollprüfung A1–C2 + DE/EN Vollsimulation vereinheitlicht

Status: umgesetzt.

Ziel der Phase: Die bisher vollständige Deutsch-Sprachtest-Simulation wurde auf Englisch erweitert und im Simulation Center mit Deutsch vereinheitlicht. Sprachtest-Simulation bleibt weiterhin ausschließlich Vollprüfung. Teilbereiche bleiben Training.

Umgesetzt:
- Sprachtest-Simulation öffnet jetzt eine Sprachwahl Deutsch/Englisch.
- Deutsch A1–C2 bleibt aktiv mit 3 Varianten pro Level und Random-Modus.
- Englisch A1–C2 ist jetzt ebenfalls aktiv als Vollprüfung im Simulation Center.
- Englisch hat pro Level 3 Varianten: A1, A2, B1, B2, C1, C2.
- Jede Englisch-Variante enthält Lesen, Hören, Grammatik & Sprachbausteine, Schreiben und Sprechen.
- Ergebnis-/Coach-Auswertung wird für DE/EN genutzt.
- Prüfungssession speichert examLanguage und simulationMode als de-full-exam oder en-full-exam.
- Variantenauswahl, Random-Modus, Session-Header und Ergebnisnavigation wurden sprachsensibel gemacht.
- UI-Router öffnet jetzt die gemeinsame Sprachtest-Sprachauswahl statt nur Deutsch.

QA:
- DE/EN Vollsimulations-QA bestanden.
- Deutsch: 6 Level, je 3 Varianten, 5/5 Pflichtteile.
- Englisch: 6 Level, je 3 Varianten, 5/5 Pflichtteile.
- JS-Syntaxcheck: bestanden.
- lokale Referenzen: 0 fehlend.
- doppelte HTML-IDs: 0.

Nächster sinnvoller Schritt:
- G54.44.4 · DE/EN Sprachtest-Vollsimulation Live-Flow-QA + Bugfixrunde nach Nutzer-Sichtprüfung.

---

## G54.46.1 · Adminstart und Cloudinitialisierung stabilisieren

**Status:** abgeschlossen am 10.07.2026

Umgesetzt:
- Adminportal rendert lokal vor jeder Netzwerkoperation.
- UI-, Initialisierungs- und Cloudzustände getrennt.
- Firebase/Auth-Timeout mit 8 Sekunden Standardwert.
- sichtbarer lokaler Fallback und Cloudstatus.
- manueller Retry ohne Reload.
- veraltete parallele Verbindungsversuche werden ignoriert.
- Kurs-/Queue-Synchronisierung blockiert den Start nicht.
- VM-Tests für Timeout/Fallback und Online-Erfolg bestanden.
- vollständige statische Buildvalidierung bestanden.

Behobener Backlogpunkt: `REL-P0-001`

Nächster sinnvoller Schritt: `G54.46.2 · Rollen, Rechte und Datensicherheit härten`.

---

## G54.46.9 · Didaktischer Lernfluss Deutsch und Englisch A1–C2

**Status:** abgeschlossen am 10.07.2026

Umgesetzt:
- einheitlicher fünfstufiger Lernfluss für 124 Lektionen
- Lernziel, kurze Erklärung, geführte Übung, freie Anwendung, Feedback und nächste Empfehlung
- niveauabhängige Transferanforderungen A1–C2
- persistierte freie Anwendungen und Kriterien
- formale Prüfung ohne falsche Grammatik- oder CEFR-Zertifizierung
- responsive Didaktikkarten und Mikrofeedback
- QA-Snapshot und feste Didaktikgates

QA:
- 14 von 14 Didaktiktests bestanden
- 12 von 12 Integrationsprüfungen bestanden
- 19 von 19 Regressionssuites bestanden
- vollständiger Chromium-E2E-Lauf bleibt wegen Umgebungs-Timeout offen

Nächster sinnvoller Schritt: `G54.46.10 · Sprachtest-Vollsimulation kalibrieren und validieren`.



---

## G54.46.10 · Sprachtest-Vollsimulation kalibrieren und validieren

**Status:** abgeschlossen am 10.07.2026

Umgesetzt:
- 36 DE/EN-Vollprüfungsvarianten A1–C2 intern kalibriert
- einheitliche Text-, Fragen- und Zeitbänder je Niveau
- gewichtete Teilbereiche und nicht kompensierbare Mindestleistungen
- evidenzabhängige, vorsichtig begrenzte Trainingsprognose
- Hilfemodus- und Local-Assessment-Caps
- englische Schreib-/Sprechmarker und sprachabhängige TTS-Konfiguration
- Archivierung von Variante, Sprache und Kalibrierungsversion

QA:
- 12 von 12 Kalibrierungstests bestanden
- 20 von 20 Regressionssuites bestanden
- vollständiger Chromium-E2E-Lauf bleibt wegen Umgebungs-Timeout offen

Nächster sinnvoller Schritt: `G54.46.11 · Hörtraining und Audiorealismus verbessern`.


## G54.46.12 · Sprechen realistisch und transparent bewerten — abgeschlossen

- Evidence-Engine für manuelles Transkript, Browser-Spracherkennung und echte Audioanalyse ergänzt.
- Inhalt, Sprachqualität und Audioeigenschaften technisch getrennt.
- Aussprache, Intonation und Audio-Flüssigkeit bleiben ohne vertrauenswürdigen Analyzer ungemessen.
- Browser-Speech-Confidence wird nicht als Aussprachewert verwendet.
- KI-Flüssigkeitswerte aus Transkripten werden als Textfluss ausgewiesen.
- Training, Vollsimulation, Fallback und Ledger auf dieselbe Regel vereinheitlicht.
- Sprechprüfungsteil in Client- und Server-Ledger korrekt mitgezählt.
- 24/24 Regressionssuites grün.
- Nächste Phase: G54.46.13 · Groq-Integration produktionsreif machen.


## G54.46.13E · Groq Architektur und Sicherheit

- Cloudflare-Worker-Quellcode unter `worker/` integriert.
- Groq-Key bleibt ausschließlich als Worker-Secret gespeichert.
- Exakte CORS-Allowlist, Request-/Body-Limits und CEFR-Schema-Validierung umgesetzt.
- KV-basiertes Rate-Limit, Prompt-Injection-Grundschutz, Request-ID und strukturierte Logs integriert.
- Bestehende Client-Endpunkte bleiben rückwärtskompatibel.
- Produktionshinweis: KV-IDs und echte Origins vor Deployment in `worker/wrangler.toml` setzen.

## G54.46.13E · Robuste Fehlerbehandlung
- Worker Retry für Netzwerkfehler, Timeout, 408, 425, 429 und 5xx
- exponentielles Backoff mit Jitter und Retry-After-Unterstützung
- Client Retry mit stabiler Request-ID und Statusdiagnose
- keine Wiederholung bei Validierung, CORS und nicht temporären 4xx-Fehlern
- lokaler Speaking-Fallback bleibt erhalten

## G54.46.13E · Streaming und Abbruch
- SSE-Streaming für `/api/coach?stream=1`
- tokenweise Browser-Ausgabe über `EGTLanguageAIClient.coachStream`
- externer AbortSignal-Support und Worker-Upstream-Abbruch
- Stream-Cleanup bei Client-Abbruch, Timeout und Ende
- automatischer JSON-Fallback bei Streamfehlern
- bestehende JSON-, Speaking- und Exam-Speaking-Schnittstellen bleiben kompatibel


## G54.46.13E · Intelligenter Kontextspeicher
- Lokaler Lernkontext für Fehler, Vokabeln, Grammatik, Ziele und Präferenzen.
- Serverseitige Normalisierung, Deduplizierung und Begrenzung.
- Gesprächsverlauf wird nach Nachrichten- und Zeichenbudget gekürzt.
- Tokenbudget-Metadaten werden ohne vollständige Nutzereingaben ausgegeben.


## G54.46.13F · Monitoring
- Aggregierte technische Metriken im Cloudflare Worker integriert.
- Erfasst: Anfragezahl, Erfolg/Fehler, Erfolgsquote, Latenz, Retries, 429, Timeouts, Tokenverbrauch, Modell- und Routenverteilung.
- Keine Nutzereingaben oder Gesprächsinhalte werden gespeichert.
- Geschützter Endpunkt: `GET /api/metrics?hours=24` mit `Authorization: Bearer <MONITORING_TOKEN>`.
- Speicherung erfolgt stündlich in `SECURITY_KV`, Aufbewahrung 14 Tage.
- Health-Endpunkt meldet Monitoring-Konfiguration ohne sensible Werte.
- Worker-Teststand: 20/20 grün.


## G54.46.13G · Last-, Stabilitäts- und Ausfalltests
- Reproduzierbare Mock-Lastsuite mit 50 parallelen erfolgreichen Coach-Anfragen integriert.
- Lange Dialoge und Lernkontexte werden vor Groq zuverlässig begrenzt.
- Cloudflare Rate Limiting Binding wird primär unterstützt; KV bleibt kompatibler Fallback.
- Groq-Netzwerkausfall, Retry-Grenze und ungültige Request-Fluten werden automatisiert geprüft.
- Kostenfreies Health-Load-Tool und ausdrücklich freizugebender Live-Coach-Test ergänzt.
- Kein echter Produktionslasttest wurde automatisch ausgeführt; dieser erfolgt erst gegen ein Preview-Deployment.

## G54.47.12E · End-to-End-QA und Release-Abnahme · 11.07.2026

- Versionsdrift in App, PWA und KI-Konfiguration behoben.
- QA-Skripte nach Bereinigung portabel gemacht.
- Historische Regressionstests für Folgeversionen stabilisiert.
- Zentralen E2E-Validator mit 10 Release-Checks ergänzt.
- 16/16 App-QA-Skripte bestanden.
- 26/26 Worker-Tests bestanden.
- Ergebnis: Quellpaket technisch konsistent; reale Geräte- und Live-Deployment-QA bleibt eine separate Umgebungsprüfung.

## G54.47.12E · Informations-, Portfolio- & Rechtscenter

- Informationscenter direkt in den bestehenden Einstellungs-Deep-Sheet-Flow integriert.
- Portfolio „Meine Reise“ mit biografischer Timeline für Ugurcan Bozkurt umgesetzt.
- Seiten für Motivation, Plattform, KI, Vision, Roadmap und Kontakt ergänzt.
- Rechtscenter mit Impressum, Datenschutz, Nutzungsbedingungen und KI-Hinweisen technisch vorbereitet.
- Keine Betreiberanschrift oder E-Mail erfunden; finale Pflichtangaben bleiben Release-Blocker.
- Responsive CSS, Dark-Mode und Reduced-Motion-Unterstützung ergänzt.
- Neue Dateien in Service-Worker-Cache aufgenommen.
- QA: Info-Center 10/10, E2E 10/10, Worker 26/26.

## G54.47.12E · Portfolio-Veredelung, Kontakt & Betreiber-Readiness
- Portfolio visuell veredelt und Timeline erweitert.
- Kontaktcenter mit bestehendem Feedbacksystem und optionalem Mailto integriert.
- Zentrale Betreiber-Konfiguration eingeführt.
- Rechtlicher Readiness-Check und konfigurationsbasiertes Impressum ergänzt.
- Fehlende Pflichtangaben bleiben bis zur echten Befüllung sichtbar.

## G54.47.12E · SVG-Designsystem & Rechtscenter · 11.07.2026
- Kontextbezogenes SVG-Icon-System integriert.
- Emoji-Symbole im Portfolio- und Rechtscenter ersetzt.
- Betreiberangaben und Entwicklungsstatus zentral ergänzt.
- Transparenzcenter für Firebase, Cloudflare, Groq, lokale Speicherung und Mikrofon ergänzt.
- Eigener QA-Test für Icons, Rechtliches, Versionsstand und Offline-Cache ergänzt.

## G54.47.12E · Visuelle QA und Barrierefreiheit
- Responsive Härtung für 320–420 px, Tablet, Desktop und Querformat
- Touchflächen im Informationscenter auf mindestens 48 px abgesichert
- Fokusdarstellung, hoher Kontrast, Forced Colors und Reduced Motion ergänzt
- Dark Mode unterstützt sowohl Systemeinstellung als auch App-Theme-Klassen
- Lange Rechtstexte, E-Mail-Adressen und Karten gegen Überlauf abgesichert
- Verbliebene Statuszeichen durch lokale SVG-Icons ersetzt
- QA: 15/15 Accessibility-/Responsive-Checks, 10/10 E2E, 26/26 Worker

## G54.47.13 · Vollständige Geräte-, Browser- und Barrierefreiheitsprüfung
- Globale responsive und barrierefreie Härtung für Haupt-App und Adminportal ergänzt.
- Mindest-Touchflächen, Fokusdarstellung, Safe Areas, Querformat, kleine Displays, Reduced Motion, High Contrast und Forced Colors abgesichert.
- Bestehende QA-Validatoren versionsfest gemacht.
- Gesamt-E2E 10/10, Geräte-/A11y-Validator 15/15, Worker 26/26.


## G54.47.14A · Produktionskonfiguration
- Getrennte Umgebungen für Development, Beta und Production integriert.
- Cloudflare-, Firebase- und PWA-Konfiguration zentralisiert.
- Laufzeitumgebung wird vor der App-Konfiguration geladen.

## G54.47.14B · Release-Kanäle und Deployment-Schutz
- DEV/BETA/PRODUCTION vereinheitlicht.
- Sichtbare Build-Kennzeichnung für DEV/BETA ergänzt.
- Öffentliche Environment-Overrides gesperrt.
- Domain-/Kanal-Deployment-Guard ergänzt.
- Worker-Deploy-Skripte für Beta und Produktion ergänzt.

## G54.47.14C · Backup- und Rollback-System
- Reproduzierbare SOURCE-, RUNTIME- und ROLLBACK-Pakete.
- SHA-256-Prüfsummen und maschinenlesbares Manifest.
- Echter Firebase-Export optional integrierbar; leere Exporte werden blockiert.
- Versionsgleiche Wiederherstellungsanleitung und Verifier.
- Worker-Secrets werden nie in Backups geschrieben.

## G54.47.14D · Produktionsnahes App-Monitoring
- Globale JavaScript- und Promise-Fehler erfasst.
- Online-/Offline-, Audio-, API- und Prüfungsereignisse datensparsam protokolliert.
- Worker-Ingest und Offline-Puffer integriert.

## G54.47.14E · PWA-, Cache- und Update-Härtung
- Kern-App atomar im neuen Cache installiert.
- Optionale Assets fehlertolerant vorgeladen.
- Alte App-Caches nur innerhalb des eigenen Cache-Präfixes entfernt.
- Navigation Preload aktiviert.
- HTML, CSS, JavaScript und JSON network-first.
- Bilder und statische Assets stale-while-revalidate.
- Update-Dateien ohne Browser-/HTTP-Cache geladen.
- Waiting Service Worker kontrolliert über SKIP_WAITING aktiviert.
- Genau ein Reload nach controllerchange.

## G54.47.15A · Architektur- und Bedrohungsanalyse
- Schutzwerte und Vertrauensgrenzen dokumentiert.
- 22 Bedrohungen nach Eintritt und Auswirkung bewertet.
- P0/P1-Release-Blocker definiert.
- Maschinenlesbares Risikoregister ergänzt.
- Folgephasen G54.47.15B bis G54.47.15J verbindlich zugeordnet.

## G54.47.15B · Authentifizierung, Rollen und Sitzungen
- Firebase-Claims als autoritative Rollenquelle integriert.
- Zentrale Rollen- und Berechtigungsmatrix umgesetzt.
- Admin- und Dozentenbereiche durch Laufzeit-Guards geschützt.
- Lokale Rollenmanipulation und anonyme privilegierte Zugriffe blockiert.

## G54.47.15C · Firebase- und Firestore-Sicherheit
- Serverseitige Rollen-, Kurs- und Gruppenzuordnung in Firestore-Regeln umgesetzt.
- Direkte Manipulation von Fortschritt, Versuchen, Sitzungen und Events blockiert.
- Privilegierte Änderungen über validierende Cloud Functions geführt.
- Default-Deny für nicht explizit erlaubte Dokumentpfade ergänzt.

## G54.47.15D · Cloudflare-Worker-Sicherheit
- Origin-, Content-Type-, Payload- und Bindings-Prüfungen integriert.
- Rate Limits, sichere Request-IDs und redigierte Fehlerausgaben ergänzt.
- Produktionsdeploy durch expliziten Bestätigungswert geschützt.
- Offenes Restrisiko: Live-Verifikation von Firebase-ID- oder App-Check-Tokens noch abschließend zu validieren.

## G54.47.15E · KI-Sicherheit
- Prompt-Injection-Erkennung und Kontext-Einfassung integriert.
- Unsichere HTML- und Systemprompt-Ausgaben blockiert.
- Strukturierte Coach-Ausgaben normalisiert.
- Sprechbewertung und Bestehensstatus serverseitig neu berechnet.

## G54.47.15F · Frontend-Sicherheit
- DOM-Sicherheitsmodul und Sanitizing integriert.
- Kritische HTML-Senken und Admin-Druckpfad gehärtet.
- QA-/Debug-Harness in öffentlichen Builds blockiert.
- Historische dynamische HTML-Senken als verbleibende Pentest-Aufgabe dokumentiert.

## G54.47.15G · API-Sicherheitsaudit
- Query-Parameter je Endpunkt auf Allowlist begrenzt.
- Method-Override und widersprüchliche Request-Längen blockiert.
- Optionale Idempotency Keys und Replay-Erkennung über SECURITY_KV integriert.
- Payload-Fuzzing- und Endpunkt-Missbrauchstests ergänzt.
- 56/56 Worker-Tests sowie bestehende Security-Regressionen bestanden.

## G54.47.15H · Finale Release-Härtung und Abnahme
- Zentrales Release-Gate ergänzt, das sämtliche QA-Suiten, Worker-Tests und Secret-Scan gemeinsam ausführt.
- Maschinenlesbarer Abschlussbericht mit eindeutiger Freigabeentscheidung `LOCALLY_APPROVED` oder `BLOCKED` integriert.
- Secret-Scan für Private Keys und typische Provider-Tokens ergänzt.
- Backup-/Rollback-Fehler behoben: Rollback-Anleitung wird nun unter dem dynamisch ermittelten aktuellen Versionsnamen kopiert.
- Versionsgleiche Rollback-Anleitung G54.47.15H ergänzt.
- Konsistenzprüfung auf die vollständige Security-Phasenkette G54.47.15A bis G54.47.15H erweitert.
- Live-Infrastruktur, echte Geräte und produktive Identitätsprüfung bleiben ausdrücklich separate Release-Nachweise und werden nicht durch lokale Tests vorgetäuscht.

## G54.47.15I · Production Validation & Release Candidate Readiness
- Zentrales produktionsnahes Validierungsskript ergänzt.
- Lokales Release-Gate, Functions-Tests und Firestore-Security-Tests gemeinsam ausgeführt.
- Kernworkflows, PWA, Offline-Fallback, Updatepfad, Accessibility-Basis und Release-Artefakte validiert.
- Maschinenlesbarer RC-Bericht unter `release/G54.47.15I_PRODUCTION_VALIDATION.json`.
- Live-Geräte, produktive Bindings und echte Produktionslast bleiben als externe Abnahmepunkte transparent ausgewiesen.


## G54.48.0 · Novura Rebranding Audit

- Ausgangsbasis G54.47.15I vollständig nach Novura Assessments-/Novura Exams-Referenzen gescannt.
- Zielmarke Novura, Prüfungsbereich Novura Exams und Slogan „One day, you'll thank today.“ verbindlich festgelegt.
- Reproduzierbarer Scanner, JSON-/CSV-Inventar und QA-Test ergänzt.
- Keine produktiven Laufzeitbezeichner oder Datenpfade verändert.
- Nächste Phase: G54.48.1 · sichtbares Branding und Metadaten.


## G54.48.1 · Novura sichtbares Branding und Metadaten

Status: abgeschlossen am 12.07.2026

- App-Name in Browser-, PWA-, Gate-, Home-, Admin- und Fehleroberflächen auf Novura umgestellt.
- Slogan „One day, you'll thank today.“ in zentrale Markenflächen integriert.
- Nutzerseitige Novura Exams-Bezeichnungen in den zentralen Einstiegen auf „Novura Exams“ migriert.
- Zentrale `NovuraBrand`-Konfiguration als Grundlage für Folgephasen ergänzt.
- Interne IDs, Engine-Namen, CSS-Selektoren, Storage-Keys und Datenpfade unverändert gelassen.
- Regression und Brand-QA erfolgreich ausgeführt.


## G54.48.3 · Novura Brand System und Modularchitektur

- Zentrale Modulmarken für Learn, Assessments, Exams, Coach, Progress und Admin ergänzt.
- Wiederkehrende Markentexte in `js/core/brand-copy.js` zentralisiert.
- Startseite als `Your Journey` strukturiert und sichtbare Navigation auf das Novura-Ökosystem ausgerichtet.
- Novura Assessments und Novura Exams bleiben ausschließlich als technische Legacy-Schlüssel erhalten; sichtbare Produktnamen sind Novura Assessments und Novura Exams.
- Modul-Akzente in `css/novura-brand-system.css` zentral definiert.
- Vollständige Regression und eigener Brand-System-Test erforderlich.


## G54.48.3 · Technische Novura-Migration mit Legacy-Alias-Schicht

- Aktive Novura Exams-Dateinamen für Struktur, Stabilität, FlowLogic, Adminreport und Styles auf Novura Exams migriert.
- Neue öffentliche APIs `NovuraExamsStructureEngine`, `NovuraExamsStabilityEngine`, `NovuraExamsFlowLogicAdapter` und `NovuraExamsAdminReportEngine` eingeführt.
- Alte globale API-Namen bleiben als rückwärtskompatible Aliasse erhalten.
- Interne persistierte Schlüssel (`novuraExams`, `novuraExams`, `it-novura-exams`, `assessments_branch`) bleiben unverändert und werden erst mit einer Datenmigration entfernt.
- Modulmanifest auf aktive Novura-Dateien umgestellt und Legacy-IDs dokumentiert.
- Vollständige Regression und eigener 48.3-Migrationstest erforderlich.

## G54.48.4 · Vollständige Legacy-Bereinigung
- Keine aktiven Nutzer oder produktiven Altstände: technische BPS-/CTC-Schlüssel vollständig auf Novura Assessments und Novura Exams normalisiert.
- Alte CTC-Dateien und die Alias-Schicht entfernt.
- DOM-IDs, CSS-Selektoren, Storage-Schlüssel, Modi, Generatoren und Fragetypen atomar migriert.
- Manifest-Legacyfelder entfernt und finaler Nulltreffer-Scanner ergänzt.
- Abschluss nur bei vollständigem Release-Gate und 0 aktiven BPS-/CTC-Treffern.

## G54.49.0A · Novura Guided Welcome · Zustandsmaschine (2026-07-12)
- Neue deterministische Domänen-Engine `js/core/guided-welcome-engine.js`.
- Zustände, Übergänge, Allowlists und harte Gesprächslimits implementiert.
- Session-only Kontext und explizite Löschfunktion für Stimmung/Ziel/Freitext.
- Bestehende Auth-, Registrierungs- und Demo-Logik unverändert gelassen.
- Browser-Einbindung vor Auth/Profile-Shell ergänzt.
- Automatischer QA-Test: `qa/test-g54-49-0a-guided-welcome.cjs`.
- Nächster Schritt: G54.49.0B · Welcome-UI und kontrollierte Auth-Übergänge.

## G54.49.0B · Novura Guided Welcome · sichtbare Welcome-UI (2026-07-12)
- Der bisherige kalte Sperrbildschirm wird bei gesperrtem Zugang durch `NovuraGuidedWelcomeUI` ersetzt.
- Responsive Desktop-, Tablet- und Mobile-Oberfläche mit Coach-Dialog, Fortschrittsanzeige und drei kontrollierten Schritten.
- Stimmungsauswahl: gut, stressig, müde, motiviert oder unentschlossen.
- Zielauswahl: weiterlernen, Testtraining, Prüfungssimulation oder erst einmal schauen.
- Abschluss ausschließlich über Einloggen, Registrieren oder Demo.
- Freundlicher Abbruch sperrt den Dialog, lässt aber alle drei Zugangswege sichtbar.
- Login-, Registrierungs-, Code- und Demo-Formulare bleiben vollständig in der bestehenden `EGTGateScreen`-/`EGTAuthEngine`-Logik.
- Neue Dateien: `css/guided-welcome.css`, `js/modules/guided-welcome-ui.js`, `qa/test-g54-49-0b-guided-welcome-ui.cjs`.
- Service-Worker-Cache und Update-Metadaten auf G54.49.0B angehoben.
- Nächster Schritt: G54.49.0D · begrenzte Groq-Micro-Personalisierung mit sicherem lokalen Fallback.


## G54.49.0D · Nova Introduction (2026-07-12)
- Freiwillige, kurze Erstbesuchs-Einführung umgesetzt.
- Novura, Nova und Lernziel knapp erklärt.
- Permission Coach für Standort/Wetter-Motivation, Mikrofon und Benachrichtigungen integriert.
- Browser-Rechte werden ausschließlich nach ausdrücklichem Button-Klick angefragt.
- Einführung wird lokal als gesehen markiert und kann über die API zurückgesetzt werden.
- Bestehende Login-, Registrierungs- und Demo-Flows bleiben unverändert.

## G54.49.0I · Adaptive Nova Context & Memory (2026-07-12)
- Lokale, versionierte Context Engine `NovuraContextEngine` ergänzt.
- Tageszeit, Wochentag, Saison, Sprache und Online-Status werden nur zur Laufzeit abgeleitet.
- Memory Lite speichert ausschließlich Introduction-Status, Begleitungsmodus, Rechte-Status und zuletzt verwendete Dialog-IDs.
- Begrüßungen und Abschlussformulierungen rotieren ohne direkte Wiederholung.
- Standortkoordinaten und Freitexte werden nicht im Nova Memory gespeichert.
- Offline-Fallback bleibt vollständig lokal funktionsfähig.
- Neuer automatisierter Test `qa/test-g54-49-0e-adaptive-nova.cjs`.

## G54.49.0I · Kontrollierte Groq-Micro-Personalisierung (2026-07-12)
- Neuer isolierter Layer `NovuraMicroPersonalization` ergänzt.
- Maximal ein Groq-Aufruf pro Welcome-Sitzung; nur für die sprachliche Variation der finalen Zugangs- oder Rückkehrnachricht.
- Der lokale Text wird sofort angezeigt und bleibt bei Offline, Timeout, ungültiger Antwort oder fehlendem Client unverändert erhalten.
- Harte Ausgabeprüfung: maximal 32 Wörter, 220 Zeichen, keine Links, Prompts, Geheimnisse, Diagnosen, Heilversprechen oder neuen Funktionen.
- Keine Nutzereingaben, Kontodaten oder GPS-Koordinaten werden an Groq übermittelt.
- Zustandsmaschine, Berechtigungen, Buttons und Authentifizierung bleiben ausschließlich lokal kontrolliert.
- Automatischer Test: `qa/test-g54-49-0g-nova-micro-personalization.cjs`.


## G54.49.0I · Final Welcome QA & Release Gate (2026-07-12)

- Gesamter Nova-Welcome-Ablauf gegen Erstbesuch, Einführung, Rechte, Auth, Wetterkontext, Groq-Fallback und Product Tour geprüft.
- Veraltete A/B/C-Zwischenphasentests auf echte Regressionsprüfungen aktualisiert.
- Versionsquellen auf G54.49.0I synchronisiert.
- Abschluss-Gate `qa/test-g54-49-0i-final-welcome-gate.cjs` ergänzt.
- Freigabe nur bei bestandener Release-, Auth-, Syntax- und ZIP-Prüfung.

## G54.49.0J · Nova Kontrollzentrum & Rechte-Transparenz (2026-07-12)
- Neues Nova-Kontrollzentrum in den App-Einstellungen ergänzt.
- Nutzer können Nova-Einführung und Product Tour gezielt erneut starten.
- Begleitungsstil Zurückhaltend, Ausgewogen oder Aktiv ist jederzeit änderbar.
- Browser-Berechtigungsstatus für Standort, Mikrofon und Benachrichtigungen wird transparent angezeigt.
- Klarstellung ergänzt: Browserrechte werden in Geräte- oder Browser-Einstellungen widerrufen.
- Grober Wetterkontext kann unabhängig vom übrigen App-Fortschritt gelöscht werden.
- Keine GPS-Koordinaten oder Standortverläufe im Kontrollzentrum gespeichert.
- Mobile Darstellung, Tastaturfokus, Escape-Schließen und Reduced Motion berücksichtigt.

## G54.50.1 · Full App Stabilization – Architektur & Code Health (2026-07-12)
- Eingebettete Backup-Artefakte aus dem Release entfernt.
- Functions-Paket technisch auf Novura umbenannt und versioniert.
- Runtime-Versionen vereinheitlicht.
- Automatischer Code-Health-Audit und QA-Gate ergänzt.

## G54.50.2C · Admin Bootstrap & Performance Stability
- einmaliger, serverseitig gesperrter Systemadmin-Bootstrap
- kein Adminrecht über normale Teilnahmecodes
- Claims-Rollback bei Teilausfällen
- Full-App-Hover- und Blur-Performance stabilisiert
- veraltete Cinematic-Runtime entfernt
