# Modules

Ab V7.4.1 gilt: Neue Features werden als Module geplant und erst danach in die Runtime eingebunden.

## Regeln

1. Kein Feature überschreibt `css/mobile.css`, `css/ui-lock.css` oder Core-Navigation.
2. Jedes Feature bekommt einen eigenen Ordner: `modules/<name>/`.
3. Modul-CSS nutzt eigene Prefix-Klassen, z. B. `.ocr-*`, `.ai-coach-*`, `.route-*`.
4. Module registrieren sich über `window.TrainerModules.register()`.
5. Erst wenn ein Modul stabil ist, wird es in `index.html` eingebunden.

## Ziel

Core bleibt stabil. UI bleibt geschützt. Neue Funktionen können separat getestet, deaktiviert oder gelöscht werden.
