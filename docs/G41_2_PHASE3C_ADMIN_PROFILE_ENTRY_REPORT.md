# G41.2 — Phase 3C Admin/Profile Entry Arbeitsnachweis

## Ziel
Weitere UI-Türen konsequent über `AppModuleHost.startModule(...)` führen und Admin/Profile als eigene Entry-Grenzen vorbereiten, ohne bestehende Admin-, Auth-, Firebase-, Session- oder Profillogik fachlich umzubauen.

## Geänderte Architektur
Die App folgt weiter dem Schnitt:

`Shell → AppModuleHost → Entry-Module → bestehende Fachadapter`

Neu hinzugekommen:

- `admin-entry` als kontrollierter Einstieg in das bestehende Admin-/Login-Portal.
- `profile-entry` als kontrollierter Einstieg in die bestehende Auth-/Profil-Shell.

## Neue Dateien

### `js/modules/egt-admin-entry-module.js`
Registriert:

```js
AppModuleHost.register({ id: 'admin-entry', ... })
```

Aufgabe:

- UI-Layer schließen, bevor das Adminportal öffnet.
- `EGTAdminPortal.open()` als bestehenden Adapter aufrufen.
- Falls Adminportal fehlt, optional auf `App.showFrameworkHealth()` zurückfallen.
- Eigene Events unter `egt:module:admin-entry:*` senden.

Nicht geändert:

- Rollenlogik
- Ticketlogik
- Codegenerator
- Teilnehmerdaten
- Firebase-/Firestore-Logik
- Session-Keys

### `js/modules/egt-profile-entry-module.js`
Registriert:

```js
AppModuleHost.register({ id: 'profile-entry', ... })
```

Aufgabe:

- `auth-*` und `profile-*` Aktionen als ModuleHost-Entry behandeln.
- Danach an `EGTAuthProfileShell.handleAction(action, el)` delegieren.
- Eigene Events unter `egt:module:profile-entry:*` senden.

Nicht geändert:

- Auth-Gate
- Profil-Dashboard
- Demo-Limits
- Avatar-Logik
- Session-Keys
- Firebase-Userdatabase-Anbindung

## Geänderte Dateien

### `index.html`
Neue Module werden nach den bestehenden Phase-3B-Entry-Modulen geladen:

- `js/modules/egt-admin-entry-module.js`
- `js/modules/egt-profile-entry-module.js`

### `js/ui-router.js`
Neue Routing-Regel:

- `auth-*` und `profile-*` → zuerst `AppModuleHost.startModule('profile-entry', ...)`
- `admin-open` → zuerst `AppModuleHost.startModule('admin-entry', ...)`
- `login-open-core` → zuerst `AppModuleHost.startModule('admin-entry', ...)`
- Bottom-Dock `home` / Legacy-Tab `0` → zuerst `AppModuleHost.startModule('home', ...)`
- Bottom-Dock `profile` / Legacy-Tab `4` → zuerst `AppModuleHost.startModule('profile-entry', { action: 'profile-open' })`

Legacy-Fallbacks bleiben erhalten.

### `js/core/module-host.js`
Version aktualisiert auf:

```js
G41.2-phase3c
```

Keine API-Änderung am Host-Vertrag.

### `js/core/architecture-guard.js`
Neue Kern-Dateien ergänzt:

- `js/modules/egt-admin-entry-module.js`
- `js/modules/egt-profile-entry-module.js`

### `service-worker.js`
Neue Moduldateien in `ASSETS` ergänzt. Cache über `sync-version.js` aktualisiert auf:

```txt
egt-trainer-g41-2
```

### `module-manifest.json`
Erweitert um:

- `admin-entry-module`
- `profile-entry-module`
- `moduleHost.registeredEntryModules.admin-entry`
- `moduleHost.registeredEntryModules.profile-entry`
- `moduleHost.phase3c`

## Version

- App-Version: `G41.2`
- Build: `G41.2-2026-06-15`
- ModuleHost-Version: `G41.2-phase3c`
- Cache: `egt-trainer-g41-2`

## Bewusst nicht angefasst

- `EGTAdminPortal` Business-Logik
- `EGTAuthProfileShell` Business-Logik
- Firebase-Konfiguration
- Session-/LocalStorage-Keys
- Demo-Limits
- Codegeneratoren
- Highscore/Coach/Result/Quiz-Generatoren

## Nächster Schritt

Phase 3D optional:

- Highscore als `highscore-entry` vorbereiten.
- Coach als `coach-entry` vorbereiten.
- Analysis/Duell als Entry-Grenzen vorbereiten.

Alternativ kann Phase 4 starten, wenn das freie Lernmodul Priorität hat.
