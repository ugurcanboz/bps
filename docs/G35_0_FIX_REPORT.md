# G35.0-FIX · Frontend Bugfix Build

Build: G35.0-FIX-2026-06-09

## Behobene Bugs

### 1. Update-Check zeigte Modal bei jedem Start (kritisch)
`CURRENT` war auf `'release'` hartcodiert. `newer('G35.0', 'release')` gab immer `true` zurück, 
weil `'release'` zu 0 normalisiert wird. Jeder Nutzer sah das Update-Modal beim ersten Load.
**Fix:** `CURRENT = 'G35.0'`, DISMISS_KEY angepasst.

### 2. Update-Check nutzte falsches Feld für Versionsnummer
`info.release` ist der menschenlesbare Release-Notes-Text, nicht die Versionsnummer. 
Der Vergleich `newer("Finaler QA-Abschluss für...", "G35.0")` war zufällig korrekt, aber fragil.
**Fix:** `info.latest || info.version` für Versionsvergleich, `info.release` nur für Anzeige.

### 3. Update-Modal Versions-Badges waren versteckt
`.update-modal-info { display: none }` — die Badges "Aktuelle Version" / "Neue Version" wurden nie angezeigt.
**Fix:** `display: flex`, Texte zeigen jetzt echte Versionsnummern.

### 4. `app.js` APP_VERSION zeigte G34.1 statt G35.0
Interner Versionsstring nicht auf aktuellen Build synchronisiert.
**Fix:** `APP_VERSION = "G35.0-USER-CENTER-STEP1-2026-06-08"`.

### 5. `manifest.json` zeigte Version G33.1
**Fix:** `"version": "G35.0"`.

### 6. Login-Button hatte keine CSS `transition`
Zustandswechsel (Login → Benutzer) war abrupt. `:active` scale ohne transition.
**Fix:** `transition: border-color .18s ease, background .18s ease, box-shadow .18s ease, transform .12s ease` ergänzt.

### 7. Login-Button hatte keinen `:hover`-State (Desktop/iPad mit Maus)
**Fix:** Hover-Zustände für Standard, `is-user-active` und `is-admin` ergänzt.

### 8. Hero-CTA "Training starten" hatte keinen `:hover`-State
Wichtigster Button der App ohne Desktop-Feedback.
**Fix:** `scale(1.03)` + erweiterter `box-shadow` bei Hover, `transition` ergänzt.

### 9. `focus-visible` fehlte auf Login-Button, Hero-CTA und Training-Cards
Keyboard- und iPad-Nutzer (Tastatur/externe Maus) bekamen kein visuelles Focus-Feedback.
**Fix:** `.ui-login-btn`, `.ui-hero-cta`, `.ui-training-area-card`, `.ui-quick-card` in `:focus-visible`-Regel aufgenommen.

### 10. Ergebnis- und Analyse-Screen: letzter Button hinter Dock verdeckt
`#result` und `#analysis` hatten kein `padding-bottom` für die floating Bottom-Dock-Navigation.
**Fix:** `body:has(#result/:not(.hidden)) .app` erhält `padding-bottom: calc(100px + env(safe-area-inset-bottom))`.

### 11. Service Worker Cache: G33.6, G33.8, G33.9, G34.2, G35.0 Docs fehlten
10 Dokumentationsdateien nicht in der ASSETS-Liste des Service Workers.
**Fix:** Alle fehlenden Docs-Einträge ergänzt.

## Nicht geändert
- Trainingslogik, Highscore, Coach, Admin-Portal, Firebase-Konfiguration
- Demo-Modus, Zugangscode-System, Avatar-Logik
- Alle Daten-Dateien
