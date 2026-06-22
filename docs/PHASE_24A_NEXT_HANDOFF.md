# Handoff – Weiterarbeit nach Phase 24A

## Aktueller Stand

Die G54.7-Hauptapp besitzt jetzt eine echte Language Foundation:

- `LanguageAcademyLanguageStore`
- `LanguageAcademyTranslationEngine`
- `LanguageAcademyHelpSystem`
- `LanguageAcademyLanguageAdapter`
- ProfileAuthDomainEngine mit `languageSettings()` und `updateLanguageSettings()`

## Nicht erledigt in Phase 24A

Bewusst noch nicht erledigt:

1. Kein sichtbarer UI-Sprachumschalter im Profil.
2. Kein Hilfe-Button in allen echten Aufgabenansichten.
3. Keine vollständige Migration aller bestehenden hart kodierten deutschen Texte.
4. Keine vollständige A1-C2-Kursdatenbank.
5. Keine Übersetzung aller alten BPS/CTC-Aufgaben.

## Warum nicht?

Phase 24A war die Grundlage. Erst nach dieser Schicht können UI, Aufgaben und Kursdaten sauber angebunden werden.

## Phase 24B Ziel

Phase 24B soll umsetzen:

```text
Profil/User-Center
 └─ Lernsprache: Deutsch/Türkisch
 └─ Hilfssprache: Deutsch/Türkisch

Aufgabenansicht
 └─ Hilfe-Button
 └─ Hinweis aus LanguageAcademyHelpSystem
 └─ keine Lösung anzeigen
```

## Wichtige Dateien

```text
index.html
js/core/profile-auth-domain-engine.js
js/i18n/language-store.js
js/i18n/translation-engine.js
js/i18n/help-system.js
js/i18n/language-adapter.js
locales/de.json
locales/tr.json
tests/phase24a-language-foundation-check.js
```

## Testbefehl

```bash
node tests/phase24a-language-foundation-check.js
```

Sollwert:

```text
PASS phase24a-language-foundation-check
```
