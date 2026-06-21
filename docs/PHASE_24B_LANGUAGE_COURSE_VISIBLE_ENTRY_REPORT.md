# Phase 24B – Sprachkurs sichtbar integrieren

Status: PASS

## Ziel
Der Sprachkurs soll erstmals in der echten Hauptapp sichtbar und bedienbar sein, ohne CTC, Highscore, Admin oder bestehende Prüfungslogik zu verändern.

## Umgesetzt
- Startseiten-Kachel `Sprachkurs` ergänzt.
- Schnellzugriff-Kachel `Sprachkurs` ergänzt.
- Eigenes Deep-Sheet-Dashboard für Language Academy erstellt.
- A1–C2 Struktur sichtbar als Niveau-Vorschau.
- Lernsprache/Hilfssprache aus Phase 24A werden angezeigt.
- Hilfe-Vorschau nutzt das bestehende Help-System und zeigt keine Lösung.
- ModuleHost-Registrierung `language-course-entry` ergänzt.
- UI-Router-Aktionen ergänzt: `language-course-open`, `language-course-levels`, `language-course-settings`.

## Bewusst nicht verändert
- CTC/BPS Simulation
- Highscore
- Teilnahmecode
- Adminportal
- Supabase/Firebase
- bestehende Hauptnavigation

## Offene Folgephase
Phase 24C: echtes Sprachkurs-Dashboard mit Spracheinstellungen, Fortschrittskarte und Kursauswahl.
