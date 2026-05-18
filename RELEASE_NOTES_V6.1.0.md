# V6.1.0 Navigation Core Stable

## Ziel
Mobile Navigation sauber zentralisieren, statt alte und neue Navigationslogik parallel laufen zu lassen.

## Neu / geändert
- Zentraler Mobile-Section-State: `home`, `dashboard`, `practice`, `highscore`, `settings`
- Bottom-Navigation synchronisiert aus `APP_SECTIONS`
- Mittlerer Startbutton wird jetzt wirklich über `nav-home` markiert
- Dynamische Top-Navigation über `TOP_NAV_TABS`
- Neuer Handler `setTopTab(section, tabKey)`
- Highscore und Settings sind echte Hauptbereiche
- `simulation` und `profile` bleiben nur noch als Kompatibilitätsalias erhalten
- Mobile CSS ersetzt die vorherige Mischlogik durch einen klaren Mobile Shell Layer
- Version/Cache auf V6.1.0 / v610 aktualisiert

## Nicht geändert
- EDV Multi Choice
- Route Memory
- Cloud Highscore Engine
- Scoring
- Simulationserzeugung
- Supabase-Konfiguration
