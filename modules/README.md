# Modules

Ab V7.5.0 gilt: Neue Features werden als Module geplant und erst danach in die Runtime eingebunden.

Ein Modul darf:
- eigenen State über `AppState` nutzen,
- Events über `AppEvents` senden/hören,
- UI über definierte Komponenten/Container einhängen.

Ein Modul darf nicht:
- globale Mobile-/Desktop-Layoutregeln überschreiben,
- `#appNav`, `#mobileTopNav` oder UI-Lock-Regeln direkt verändern,
- Cache-/Routing-Logik ohne Guard ändern.
