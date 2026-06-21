# Phase 31A – A2 Kursstruktur + Speaking-Struktur

Version: G54.13  
Datum: 2026-06-17  
Scope: Nur Sprachkurs-Modul

## Ziel

A2 wird als eigenes Niveau geöffnet und nicht mehr nur als gesperrte Vorschau geführt.
Die neue Projektregel wird technisch umgesetzt: normale Kursaufgaben und Sprechaufgaben werden pro Niveau parallel aufgebaut.

## Umsetzung

- A2 im Level-Raster auf `available` gesetzt.
- 10 A2-Lektionen angelegt.
- Jede A2-Lektion erhält eine Starterstruktur aus 12 Aufgaben.
- Pro A2-Lektion sind mindestens 4 `speaking_practice`-Aufgaben enthalten.
- Normale Kursaufgaben und Sprechaufgaben sind mit `parallelContent: true` markiert.
- A2 nutzt dieselbe Speaking-Engine/Fallback-Logik aus Phase 30E:
  - Desktop/unterstützte Browser: automatische Auswertung.
  - iPhone/iPad/unsupported: geführter Sprechmodus mit Selbstbewertung.

## A2-Lektionen

1. Tagesablauf
2. Wohnen
3. Termine vereinbaren
4. Einkaufen & Service
5. Gesundheit
6. Arbeit & Schule
7. Reisen & Orientierung
8. Essen & Restaurant
9. Vergangenheit erzählen
10. Meinung & Pläne

## Aufgabenumfang Phase 31A

- A2-Lektionen: 10
- Startaufgaben pro Lektion: 12
- normale Startaufgaben pro Lektion: 8
- Sprechaufgaben pro Lektion: 4
- A2-Startaufgaben gesamt: 120
- A2-Sprechaufgaben gesamt: 40

## Prüfschnittstelle

Im Browser verfügbar:

```js
LanguageAcademyCourseEntry.a2StructureSnapshot()
```

Erwartung:

```js
{
  phase: '31A',
  level: 'a2',
  lessons: 10,
  totalTasks: 120,
  normalTasks: 80,
  speakingTasks: 40,
  ok: true
}
```

## Nicht verändert

- CTC
- Admin
- Highscore
- Teilnahmecode
- Auth
- Firebase/Supabase-Grundlogik

## Nächster Schritt

Phase 31B sollte A2 Lektionen 1–5 inhaltlich massiv ausbauen. Dabei müssen normale Kursaufgaben und Sprechaufgaben weiter parallel wachsen.
