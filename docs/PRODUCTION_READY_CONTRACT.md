# V7.5.0 Production Feature-Ready Contract

Diese Version ist die Arbeitsbasis für große Features.

## Regeln

1. Core-Dateien nur ändern, wenn Architektur betroffen ist.
2. Neue Features kommen in `modules/` oder `js/modules/`.
3. UI bleibt über `css/ui-lock.css` geschützt.
4. Neue Fragetypen müssen `AppSchema.validateQuestion()` bestehen.
5. Große Features werden über `FeatureGates` aktiviert.
6. Vor jedem Release `index.html?healthcheck=1` prüfen.
7. Für GitHub Pages nur relative Pfade verwenden.

## Neue Core-Bausteine

- `AppConfig` = zentrale Version, Pfade, Feature-Defaults.
- `AppSchema` = Verträge für Fragen und Module.
- `FeatureGates` = kontrollierte Aktivierung neuer Systeme.
- `ProductionDiagnostics` = Readiness-Check.
- `module-manifest.json` = Modulplanung und Feature-Verträge.
