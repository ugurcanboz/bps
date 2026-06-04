# UI-G19 Global Deep Interaction Foundation

## Ziel

Alle interaktiven Einstiege der Premium-UI laufen über dasselbe Deep-Sheet-Fundament.

## Prinzip

- UI = Haus
- Kacheln / Buttons / Dock-Einträge = Türen
- Deep Sheet = zentraler Raum
- Inhalt wird dynamisch über `data-ui-action`, `data-branch` und `data-module` eingesetzt

## Gilt jetzt für

- Trainingsbereich-Kacheln
- Schnellzugriff-Kacheln
- Modul-Details
- Branch-/Fachrichtungsmenüs
- Üben
- Lernmodus
- Coach-Einstieg
- Analyse
- Fortschritt
- Einstellungen / Mehr
- Feedback-Einstieg
- Login-Einstieg
- Scanner-Einstieg
- Python-Quest-Einstieg
- Bottom-Dock-Einträge außer Dashboard

## Standard

Neue Interaktion wird nicht mehr als eigene Seite gebaut, sondern als Tür zum Deep Sheet:

```html
<button class="ui-card" data-ui-action="branch-menu" data-branch="kaufm" data-module="kaufmRechnen">
```

oder:

```html
<button class="ui-deep-card" data-ui-action="open-module" data-module="mathe">
```

## Core-Aktionen

Wenn ein Deep Sheet nur einen Einstieg vorbereitet, öffnet der echte App-Core erst über eine explizite Core-Aktion, z. B.:

- `coach-open-core`
- `analysis-open-core`
- `login-open-core`
- `feedback-open-core`
- `scan-open-core`
- `python-quest-open-core`

Dadurch bleibt das UI einheitlich, ohne bestehende Kernmodule zu zerstören.
