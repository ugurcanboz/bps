# Phase 24D – Visuelle Browser- und Responsive-Kontrolle Sprachkurs

## Prüffokus

Geprüft wurde ausschließlich das Sprachkurs-Modul aus Phase 24A–24C:

- sichtbarer Einstieg über Sprachkurs-Kachel
- Sprachkurs-Dashboard im bestehenden Deep-Sheet-System
- Lernsprache und Hilfssprache
- A1–C2 Raster
- Statistikbereich
- Schnellzugriffe
- visuelle Einheitlichkeit mit Hauptapp-Design

CTC, Highscore, Adminportal und Prüfungslogik wurden nicht verändert.

## Browser-Simulation

Simulierte Viewports:

| Gerät/Viewport | Größe | Ergebnis |
|---|---:|---|
| iPhone SE | 375×667 | PASS nach Korrektur |
| iPhone 16 Pro Max | 430×932 | PASS nach Korrektur |
| iPad Air | 820×1180 | PASS nach Korrektur |
| Desktop | 1440×900 | PASS nach Korrektur |

## Gefundene Probleme vor Korrektur

1. Das Dashboard-Deep-Sheet war zu niedrig eingestellt. Dadurch war auf Mobile und Desktop zunächst nur der obere Teil des Dashboards sichtbar.
2. Der Text `course.dashboard.subtitle` wurde als Key angezeigt, wenn die Translation Engine keinen Eintrag zurückgab.
3. Der primäre Button `Weiterlernen` war mit ca. 42 px etwas zu niedrig für saubere Touch-Ziele.
4. Der Schließen-Button lag unter dem empfohlenen 48×48 Touch-Ziel.

## Eingebaute Korrekturen

### 1. Dashboard-Sheet-Höhe korrigiert

Das Sprachkurs-Dashboard nutzt jetzt gezielt:

- Desktop: bis 94dvh
- Mobile: bis 96dvh
- eigene scrollbare Deep-Sheet-Body-Fläche
- kompaktere Header-Abstände auf kleinen Bildschirmen

### 2. Translation-Fallback korrigiert

Wenn die Translation Engine einen fehlenden Key zurückgibt, greift jetzt ein lokaler Fallback. Der Nutzer sieht nicht mehr `course.dashboard.subtitle`, sondern:

> Lerne Schritt für Schritt auf deinem Niveau.

### 3. Touch-Ziele korrigiert

- `Weiterlernen`: mindestens 48 px Höhe
- Sprachselects: mindestens 48 px Höhe
- Close-Button im Sprachkurs-Sheet: 48×48 px

### 4. Sprachkurs-Branding entschärft

Der sichtbare Badge wurde von `Phase 24C` auf neutrales `Sprachkurs` umgestellt, damit der Teilnehmer keine internen Entwicklungsphasen sieht.

## Ergebnis nach Korrektur

| Prüfpunk | Ergebnis |
|---|---|
| Sprachkurs öffnet im bestehenden Deep-Sheet | PASS |
| Dashboard ist sichtbar | PASS |
| Dashboard ist scrollbar | PASS |
| A1–C2 vollständig erreichbar | PASS |
| Statistikbereich erreichbar | PASS |
| Schnellzugriffe erreichbar | PASS |
| Keine sichtbaren Translation-Keys | PASS |
| Touch-Ziele ausreichend | PASS |
| Hauptapp-Design beibehalten | PASS |
| CTC/Admin/Highscore unverändert | PASS |

## Visuelle Einschätzung

Das Sprachkurs-Dashboard wirkt jetzt wie ein Bestandteil der Hauptapp. Karten, Radius, Schatten, Deep-Sheet, Farblogik und Button-Stil passen grundsätzlich zum vorhandenen UI-Konzept.

Konstruktiver Hinweis: Die Schnellzugriffe sind auf kleinen iPhones optisch sehr groß. Das ist nicht kaputt und sogar gut bedienbar, kann aber in einer späteren Feinschliffphase kompakter gemacht werden, sobald echte Lektionslogik eingebaut ist.

## Freigabe

Phase 24D ist nach Browser-Simulation und Korrektur freigegeben.

Nächster sinnvoller Schritt:

**Phase 24E – Niveau-Auswahl und echte Kursnavigation A1–C2**
