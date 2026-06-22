# Phase 39A – Full App UX Audit & Design-System Stabilisierung

Stand: G54.38E.5  
Ziel: Nicht sofort fixen, sondern die App wie ein Webentwickler inventarisieren, visuell bewerten und die nächsten Fix-Phasen sauber priorisieren.

## 1. Zusammenfassung

Die App ist funktional weit. Sprachkurs, B2-Hardmode, Prüfungsdashboard, Schwächenprofil, Mini-Training und Python-Grundmodul sind vorhanden. Der kritische Punkt ist jetzt nicht mehr Funktionsumfang, sondern Produktreife.

Der aktuelle Zustand wirkt wie ein starkes System mit mehreren historisch gewachsenen UI-Schichten. Das führt zu:

- uneinheitlichen Icons
- zu vielen CSS-Sonderfixes
- zu schweren Admin-Overlays
- zähem iOS/iPad-Scrollgefühl
- unklarer visueller Hierarchie im Dashboard
- hoher Gefahr, dass spätere Fixes alte Bereiche wieder überschreiben

## 2. Automatischer Audit

Browser-Simulation/Screenshots wurden mit Chromium Headless erstellt für:

- Desktop 1440 × 900
- iPad 820 × 1180
- iPhone 390 × 844

Erzeugte Screenshots liegen unter:

- `qa_phase39a_screenshots/desktop-home.png`
- `qa_phase39a_screenshots/desktop-language-dashboard.png`
- `qa_phase39a_screenshots/desktop-exam-dashboard.png`
- `qa_phase39a_screenshots/desktop-admin.png`
- `qa_phase39a_screenshots/ipad-home.png`
- `qa_phase39a_screenshots/ipad-language-dashboard.png`
- `qa_phase39a_screenshots/ipad-exam-dashboard.png`
- `qa_phase39a_screenshots/ipad-admin-fresh.png`
- `qa_phase39a_screenshots/iphone-home-demo.png`

Audit-Daten:

```json
{
  "cssFiles": 18,
  "importantRules": 4197,
  "backdropFilterOccurrences": 103,
  "boxShadowOccurrences": 278,
  "overflowAutoScrollOccurrences": 61,
  "homeEmojiLiterals": 112,
  "adminEmojiLiterals": 70,
  "languageExamEmojiLiterals": 12,
  "pythonEmojiLiterals": 5,
  "adminTabs": 14,
  "adminTouchHandlers": 4,
  "homeDataUiActions": 46,
  "languageExamActions": 28
}
```

## 3. Befunde

### 3.1 Kritisch: CSS-System ist zu stark geflickt

4197 `!important`-Regeln sind ein klares Zeichen, dass die App über viele Phasen hinweg repariert, aber nicht konsolidiert wurde. Kurzfristig funktioniert vieles. Langfristig erzeugt das schwer vorhersagbare Nebenwirkungen.

Empfehlung:

- kein weiterer globaler Polish-Fix ohne Systematik
- Design-Tokens einführen
- Admin-CSS separat bereinigen
- Mobile-Regeln kontrolliert bündeln

### 3.2 Kritisch: Admin-Portal iPad/iOS Scroll

Das Admin-Portal besitzt viele Tabs, schwere Effekte, mehrere Scrollbereiche und Touch-Handler. Genau diese Kombination erzeugt auf iOS typischerweise zähes, nicht natives Scrollverhalten.

Empfehlung für Phase 39B:

- genau ein nativer Haupt-Scrollcontainer im Admin
- `-webkit-overflow-scrolling: touch`
- Touchmove-Manipulation entfernen oder begrenzen
- Blur und Schatten auf Mobile reduzieren
- Admin-Tabs auf Mobile auf Hauptgruppen reduzieren

### 3.3 Hoch: Icons sind nicht einheitlich

Es existieren SVG-Icons, Emojis, Buchstaben-Badges, Zahlenkreise und Text-Symbole nebeneinander. Das wirkt nicht wie ein geschlossenes Produkt.

Empfehlung für Phase 39C:

- zentrales Icon-Token-System
- Hauptmodule nur SVG oder kontrollierte Icon-Komponente
- Emojis nur als kleine Akzente, nicht als Hauptnavigation
- A1–B2-Karten, Prüfungsteile, Python und Admin angleichen

### 3.4 Hoch: Dashboard visuelle Hierarchie

Das Prüfungsdashboard enthält wertvolle Informationen, aber Levelkarten, Schwächenprofil, Training und Historie sind visuell zu ähnlich gewichtet.

Empfehlung:

- oben klare Levelkarten A1–B2
- danach ein einziger primärer nächster Schritt
- danach Schwächen
- danach Training
- danach Historie

### 3.5 Mittel: Mini-Training mobil zu lang

Mini-Trainingssets sind fachlich gut, aber auf iPhone/iPad sollte nicht alles dauerhaft offen sein.

Empfehlung:

- Accordion oder Stepper pro Mini-Aufgabe
- nur aktive Aufgabe offen
- Musterlösung zunächst einklappbar

### 3.6 Mittel: QA-Bypass fehlt

Der Sperrbildschirm/Gate ist für reale Nutzer gut, blockiert aber automatisierte UI-QA. Für künftige Tests sollte es einen kontrollierten lokalen Demo-/QA-Bypass geben.

Empfehlung:

- `?qa=1` nur lokal oder in Demo-Builds
- erzeugt lokale Demo-Session
- niemals Admin-Rechte automatisch vergeben

## 4. Design-System-Stabilisierung: Zielbild

### Design Tokens

```text
--egt-bg
--egt-surface
--egt-surface-raised
--egt-border
--egt-text
--egt-muted
--egt-primary
--egt-success
--egt-warning
--egt-danger
--egt-radius-sm/md/lg/xl
--egt-space-1..8
--egt-touch-min: 44px
```

### Icon Tokens

```text
home
simulation
training
analysis
coach
language
python
admin
user
group
code
report
settings
reading
listening
grammar
writing
speaking
```

### Mobile Admin Zielarchitektur

```text
Overlay fixed
Admin Shell max-height: 100dvh
Header kompakt
Tabgruppen statt 14 Einzeltabs
Content ist einziger Scrollcontainer
native iOS Momentum Scroll
keine manuelle scrollTop-Manipulation
```

## 5. Priorisierung

### Phase 39B – Admin Portal Mobile/iPad Scroll & Performance Fix

Muss zuerst kommen, weil der Nutzer das Scrollproblem konkret bemerkt.

### Phase 39C – Icon-System & Dashboard Unification

Danach, weil es den professionellen Eindruck stark verbessert.

### Phase 39D – Button/Touch Target Normalisierung

Danach, damit alle Geräte sauber bedienbar sind.

### Phase 39E – Full App Smoke Test mit QA-Bypass

Zum Schluss vollständiger Klicktest mit sauberem Demo-Modus.

## 6. Wichtig

Phase 39A hat bewusst keine visuellen Fixes in der App vorgenommen. Sie dokumentiert, misst und stabilisiert die Entwicklungsrichtung. Die eigentlichen Eingriffe beginnen ab Phase 39B.
