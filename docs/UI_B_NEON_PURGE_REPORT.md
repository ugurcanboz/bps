# UI-B Neon Purge Report

## Ziel
Diese Version basiert auf der zuletzt funktionierenden `Eignungstest-Trainer-UI-B-Card-Layout-System.zip`.

Ziel war nicht, das Design zu überschreiben, sondern:

- Neon-Hero / UI-B Card Layout behalten
- alte Home-/Dashboard-/Hub-Reste entfernen
- alte Zweitnavigation aus dem aktiven Codepfad entfernen
- Kaufmännisch, Sozialpädagogik und IT/FISI fachlich sauber lassen

## Behaltene Ziel-UI

Behalten und geschützt:

- `js/ui-home-renderer.js`
- `js/ui-router.js`
- `css/ui-foundation.css`
- `css/ui-nav-foundation.css`
- `assets/ui/brain-logo.svg`
- `assets/ui/hero-target.svg`
- `assets/ui/hero-target-ios.svg`
- `assets/ui/icon-*.svg`

Diese Dateien tragen die Neon-Hero-Startseite:

- Eignungstest-Trainer
- Trainiere smarter.
- Bestehe sicher.
- Training starten 🚀
- Neon-Zielscheibe
- Neon-Karten für IT/FISI, Sozialpädagogik, Kaufmännisch, Allgemeinwissen und Individuell
- dunkle Glassmorphism Bottom Navigation

## Entfernt / deaktiviert aus dem aktiven Codepfad

Entfernt aus HTML, Service Worker und Dateisystem:

- `js/core/deep-sheet-controller.js`

Aus dem aktiven Home-Code entfernt:

- altes `hub-grid`
- alte `hub-card`
- alter App.js-Home-Renderer
- alte Runtime-Navigation `runtimeNav` als sichtbare Navigation
- altes Dashboard-Hero-System `ui-c-*`
- alte Begriffe `Guten Tag`, `Bronze`, `KI sammelt Daten`
- alte WordHub-/WH-Shell-Tokens

## Fachliche Datenkorrektur

Kaufmännisch:

- `data/question-bank-kaufm.js`: 52/52 Aufgaben führen jetzt `group: "Kaufmännisch"`.
- keine Kaufmännisch-Aufgabe läuft mehr intern als `Mathe` oder `Allgemeinwissen`.

Sozialpädagogik:

- `data/question-bank-sozial.js`: 20/20 Aufgaben führen jetzt `group: "Sozialpädagogik"`.
- keine Sozialpädagogik-Aufgabe läuft mehr intern als `Allgemeinwissen`.

IT/FISI:

- `data/question-bank-it-extra.js`: 15/15 Aufgaben bleiben `group: "IT/FISI"`.
- Python Quest bleibt im UI-B Branch-Menü nur bei IT/FISI optional enthalten.

## Automatische Prüfungen

- JavaScript-Syntaxprüfung: bestanden
- Service-Worker-Syntaxprüfung: bestanden
- CSS-Klammerprüfung: bestanden
- HTML-/Service-Worker-Verweise: 0 fehlende Dateien
- Alte aktive Design-Tokens außerhalb Dokumentation: 0 Treffer
- ZIP-Test: bestanden

## Wichtiger Testhinweis

Nach dem Upload muss der Browser-/PWA-Cache für die konkrete localhost-Adresse gelöscht werden:

- Edge → F12 → Anwendung → Speicher → Websitedaten löschen
- Service Worker → Registrierung aufheben
- Danach Strg + F5
