# Phase 42 – Live Deploy Device QA

## Ziel

Phase 42 bereitet die echte Live-Abnahme nach GitHub-Pages-Deployment vor. Der Schwerpunkt liegt nicht mehr auf reiner Code-QA, sondern auf realistischem Gerätetest nach Upload:

- iPhone / iOS Safari
- iPad / iPadOS Safari
- Desktop / Chrome oder Edge
- GitHub-Pages-Pfadlogik
- Service-Worker-Cache nach neuem Deploy
- PWA-Manifest und Update-Hinweis
- Startseite, Sprachkurs, Admin, Simulation, Dashboard

## Ergebnis dieser Phase

Die App wurde auf **G54.42** gehoben.

Aktualisiert wurden:

- `js/core/app-config.js`
- `manifest.json`
- `update-check.json`
- `service-worker.js`
- `index.html` Fallback-Version
- neue Browser-QA: `tests_phase42_live_device_qa.html`
- neue statische QA: `phase42_live_device_qa.py`
- QA-Ergebnis: `phase42_live_device_qa_result.json`

## Manuelle Live-Test-Matrix

### 1. Vor dem Test

1. ZIP entpacken.
2. Inhalt in GitHub Pages hochladen.
3. Auf jedem Gerät die App einmal komplett schließen.
4. Browser-Cache für die Seite leeren oder im privaten Tab öffnen.
5. Danach die Live-URL öffnen.

### 2. iPhone-Test

Pflichtprüfung:

- Startseite öffnet ohne weißes Leerlayout.
- Kein horizontaler Scrollbalken.
- Bottom-Dock liegt nicht über Inhalten.
- Buttons sind mit Daumen gut klickbar.
- Sprachkurs-Kachel ist sichtbar.
- Prüfung/Dashboard öffnet ohne Layoutbruch.
- Admin-Portal öffnet und scrollt sauber.
- Update-Check zeigt Version G54.42.

### 3. iPad-Test

Pflichtprüfung:

- Gate-/Startlayout ist mittig und wirkt nicht leer.
- Footer/Branding sitzt sauber.
- Kacheln sind nicht zu breit auseinandergezogen.
- Deep-Sheets sind lesbar und nicht abgeschnitten.
- Sprachkurs und Prüfungsdashboard wirken wie Tablet-Layout, nicht wie aufgeblasenes Handy.

### 4. Desktop-Test

Pflichtprüfung:

- Startseite, Admin und Sprachkurs öffnen.
- Keine Konsolenfehler durch fehlende Dateien.
- Service Worker registriert sich.
- Manifest ist erreichbar.
- `update-check.json` meldet G54.42.
- QA-Seite `tests_phase42_live_device_qa.html` besteht.

## Live-URL-Testseite

Nach Deploy öffnen:

```text
tests_phase42_live_device_qa.html
```

Diese Seite prüft im Browser:

- AppConfig-Version
- Manifest-Erreichbarkeit
- Update-Check-Erreichbarkeit
- Service-Worker-Datei
- 404-Fallback
- zentrale QA-Artefakte
- iPhone/iPad/Desktop-Heuristik
- Viewport-Breite und Touchfähigkeit

## Bewertung

Diese Phase ist bestanden, wenn:

- statische QA `passed=true` meldet,
- die Browser-QA auf der Live-Seite `passed=true` meldet,
- auf iPhone, iPad und Desktop kein HIGH-Fehler sichtbar ist.

## Bekannte Grenze

In dieser Sandbox kann kein echter GitHub-Pages-Liveaufruf mit realem iPhone/iPad durchgeführt werden. Phase 42 liefert deshalb die vollständige Live-Abnahmestruktur und lokale Deploy-Readiness. Die echte visuelle Abnahme muss auf der veröffentlichten URL erfolgen.

## Empfehlung

Nach erfolgreicher manueller Live-Abnahme folgt:

**Phase 43 – Release Candidate Freeze & Übergabe an produktive Nutzung**

Dort sollten keine neuen Features mehr eingebaut werden, sondern nur noch kritische Live-Bugs.
