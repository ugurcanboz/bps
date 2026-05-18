# Framework Tree V6.0.0

```text
Eignungstest-Trainer
├─ Core / Stamm
│  ├─ App State
│  ├─ Router / Navigation
│  ├─ Timer
│  ├─ Scoring
│  ├─ Storage Bridge
│  └─ PWA Engine
├─ Module / dicke Äste
│  ├─ Mathe
│  ├─ Allgemeinwissen
│  ├─ IT/FISI
│  ├─ EDV Multi Choice
│  ├─ Logik
│  ├─ Konzentration
│  ├─ Route Memory
│  └─ Visual IQ
├─ Renderer / Blätter
│  ├─ Multiple Choice
│  ├─ EDV Schema
│  ├─ Route Auswahl
│  ├─ Visual IQ SVG
│  └─ Ergebnis/Review
├─ Daten
│  ├─ question-bank.js
│  └─ cloud-config.js
├─ Mobile Shell
│  ├─ css/mobile.css
│  ├─ Bottom Sticky Navigation
│  ├─ Top Swipe Context Navigation
│  └─ Mobile Animation Layer
└─ Cloud
   ├─ Supabase Diagnose
   ├─ Highscore Upload
   ├─ Tagesranking
   ├─ Wochenranking
   ├─ Monatsranking
   └─ Gesamtranking
```

## Wartungsregel ab V6
Neue Features werden nicht mehr direkt in den Core gesetzt. Jedes neue System bekommt:

1. eigenes Modul unter `js/src/modules/`,
2. eigenen Renderer unter `js/src/renderers/`, falls UI speziell ist,
3. eigene Diagnose im Framework-Status,
4. eigenen CSS-Bereich oder eigene CSS-Datei, falls Layout betroffen ist.
