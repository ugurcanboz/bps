# Phase 38D.2B – Schwierigkeitsmatrix & Level-Garantie

## Ziel
Der Prüfungsaufbau darf gleich bleiben, aber A1 und B2 dürfen sich nicht gleich anfühlen. Diese Phase trennt die Niveaus didaktisch und technisch.

## Umsetzung
- Neue Datei `data/language-level-difficulty-rules.js`
- Jedes Niveau A1–C2 hat eigenes Profil:
  - Textlängen
  - Schreib- und Sprechumfang
  - Grammatikthemen
  - erwartete Aufgabenformate
  - Pflichtkompetenzen
  - Toleranzen
  - Ablehnungsgründe
  - Punktdeckelungen
- Die Prüfungsengine nutzt diese Profile für:
  - lokale Bewertung
  - Mindestumfang
  - B2+ Argumentationspflicht
  - eigene Position
  - Pro/Contra / Abwägung
  - konkrete Beispiele
  - Groq-Prüferrolle pro Level

## Harte Garantie
Eine sehr einfache A1-Antwort darf eine B2-Schreib- oder Sprechprüfung nicht bestehen.

Beispiel B2-Fail:
> Hallo, Onlinekurs ist gut. Ich lerne zuhause. Viele Grüße Ali

Das wird gedeckelt wegen:
- zu kurzer Umfang
- fehlende Argumentation
- keine eigene Position
- kein Beispiel
- zu wenige niveaupassende Konnektoren
- fehlende Pflichtpunkte

## Sichtbarkeit im UI
Die Levelkarten zeigen jetzt pro Niveau zusätzliche Angaben:
- erwarteter Schreibumfang
- Fokuskompetenz
- Grammatikschwerpunkte

Dadurch ist sofort sichtbar, dass A1 und B2 nicht nur andere Namen haben, sondern andere Anforderungen.

## QA
Neue Testseite:
`tests_phase38d2b_level_garantie.html`

Geprüft:
- Schwierigkeitsmatrix geladen
- A1/B2-Schreibumfang unterscheidet sich massiv
- A1-Antwort fällt in B2 durch
- gültige A1-Antwort kann A1 bestehen
- strukturierte B2-Antwort kann B2 bestehen
- Shell-Diagnose Phase 38D.2B aktiv
