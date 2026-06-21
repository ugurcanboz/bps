# Phase 39B – Admin Portal Mobile/iPad Scroll & Performance Fix

## Ziel

Phase 39B behebt den kritischsten UX-Schmerz aus Phase 39A: Das Admin-Portal fühlte sich auf iPad/iOS zäh an. Ursache war eine Kombination aus manueller Scroll-Assistenz, schwerem Glassmorphism und mehreren verschachtelten Scrollflächen.

## Änderungen

### 1. Native iOS/iPadOS Scroll-Architektur

Die alte `wheel`/`touchmove`-Assistenz im Admin-Modal wurde entfernt. Sie addierte Touch-Deltas manuell auf `scrollTop`, während iOS bereits eigenes Momentum-Scrolling ausführte. Dadurch entstand ein verzögertes, schwammiges Scrollgefühl.

Neue Regel:

```text
Overlay fixiert
Admin-Modal ist Hauptscrollfläche
keine manuelle Delta-Scroll-Manipulation
-webkit-overflow-scrolling: touch
```

### 2. Mobile Performance-Modus

Für `max-width: 1024px` und Touch-Geräte wurden teure Effekte reduziert:

```text
weniger backdrop-filter
weniger box-shadow
kein schwerer Blur auf dem Overlay
Panel randlos und vollflächig
native Momentum-Tabbar
```

### 3. Touch-Ziele stabilisiert

Admin-Tabs, Close-Button und Admin-Buttons wurden auf iPad/iPhone vergrößert:

```text
Tabs mindestens 48 px
Close mindestens 48 px
Buttons mindestens 48 px
Inputs mindestens 44 px
```

### 4. Verschachtelte Scrollcontainer reduziert

Auf Touch-Geräten werden lange Admin-Listen nicht mehr als eigene vertikale Scrollflächen erzwungen. Dadurch entsteht eine natürliche Seite statt mehreren konkurrierenden Scrollbereichen.

### 5. CSS-Override als isolierte Phase-39B-Schicht

Die Phase wurde bewusst als klar gekennzeichneter CSS-Block am Ende von `css/admin-portal.css` umgesetzt. So ist der Fix nachvollziehbar und kann später sauber in ein konsolidiertes Admin-Design-System überführt werden.

## Geänderte Dateien

```text
css/admin-portal.css
js/admin-participant-engine.js
service-worker.js
update-check.json
js/core/app-config.js
WORKING-PLAN_1.md
```

## Neue QA-Dateien

```text
docs_PHASE39B_ADMIN_SCROLL_PERFORMANCE_FIX.md
tests_phase39b_admin_scroll_performance.html
phase39b_static_qa.py
phase39b_static_qa_result.json
phase39b_scroll_perf_audit_result.json
```

## Grenzen

Diese Phase löst bewusst nicht das komplette Icon-System und nicht die Dashboard-Hierarchie. Das kommt in Phase 39C.

## Ergebnis

Das Admin-Portal ist auf iPad/iOS technisch deutlich besser vorbereitet:

```text
weniger Reibung beim Scrollen
weniger GPU-Last
weniger doppelte Scrollcontainer
größere Touchflächen
stabilere Tab-Leiste
```
