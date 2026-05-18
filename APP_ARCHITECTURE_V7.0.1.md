# Eignungstest-Trainer V7.0.1 Architektur

## Stand
V7.0.1 ist eine Konsolidierungsbasis. Ziel war nicht neue UI, sondern Stabilität, Übersicht und saubere Kommunikation zwischen Core, Modulen, Storage, Cloud und Mobile-Shell.

## Struktur
- `index.html`: App-Shell, TopNav-Container, Hauptinhalt, BottomNav-Container
- `css/app.css`: Desktop/shared Komponenten und fachliche Module
- `css/mobile.css`: einzige Quelle für Mobile-Shell/TopNav/BottomNav
- `js/src/`: Wartbare Source-Module
- `js/app.js`: gebautes Runtime-Bundle aus `js/src/`
- `service-worker.js`: PWA-Cache V7.0.1

## Behaltene Kernfeatures
- EDV Multi-Choice
- Route Memory
- CTC-Simulation
- lokale Speicherung via IndexedDB/Fallback
- Supabase Cloud Highscore
- Framework/Systemstatus

## Cleanup-Regel
Keine neuen UI-Experimente in diesem Stand. Mobile-Experimente werden erst wieder nach stabiler Basis weitergeführt.
