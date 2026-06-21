# G52.9 / Phase 23 — Profile Auth Domain Engine

## Ziel

Der Profil-, Auth- und Userbereich wurde als eigene Domain-Grenze vorbereitet. Die bestehenden produktiven Module `auth-profile-shell.js`, `egt-auth-engine.js`, Gate-Screen und UserDatabase bleiben erhalten, werden aber künftig über eine zentrale Fassade erreichbar.

## Neue Datei

- `js/core/profile-auth-domain-engine.js`

## Aufgaben der Engine

- lokale Profilidentität lesen/schreiben
- alte Profilkeys migrieren/normalisieren
- Session aus AuthProfileShell, EGTAuthEngine oder LocalStorage auflösen
- Gate-Status und Zugriff prüfen
- aktive Learner-ID bestimmen
- Pflicht-Passwortwechsel erkennen
- Highscore-Identity bereitstellen
- Login/Register/Redeem/Demo/Logout an die passende Auth-Schicht delegieren
- Demo-Simulationszähler zentral anstoßen
- Profilaktionen und Sync-Status zentral bereitstellen

## Geänderte Anbindungen

- `app.js` erzeugt `ProfileAuthDomainEngine`.
- `saveResult()` nutzt die Engine für Highscore-Identity und Demo-Zähler.
- `resultPersistenceContext()` erhält die Engine als Auth-Kontext.
- `activeLearnerId()` und `activeLearnerNeedsPasswordChange()` delegieren an die Engine.
- `duellMyName()` nutzt die Engine.
- `ui-router.js` und `egt-profile-entry-module.js` bevorzugen die Engine für Profil-/Auth-Aktionen.

## Sicherheitsentscheidung

`auth-profile-shell.js` und `egt-auth-engine.js` wurden bewusst nicht vollständig zerlegt. Diese Dateien enthalten UI, Firebase-Auth, Avatar-Cache, Gate-Logik und Demo-Regeln. Eine harte Zerlegung in einer einzigen Phase wäre zu riskant. Phase 23 zieht deshalb eine stabile Domain-Fassade, über die spätere Phasen gezielt einzelne Teile ablösen können.
