# Phase 30C-FIX – Mobile Speech Fix iPhone/iPad

## Anlass

Die Sprechaufgabe funktioniert auf Desktop, aber nicht zuverlässig auf Handy/iPad.

## Ursache / technische Einordnung

Die Web-Speech-Erkennung ist browserabhängig. Besonders iOS/iPadOS und installierte PWAs/Home-Screen-Apps können `SpeechRecognition` nur eingeschränkt oder gar nicht ausführen.

Dadurch konnte der bisherige Zustand auf mobilen Geräten so wirken, als wäre die Aufgabe defekt: Der automatische Recognition-Pfad war nicht verfügbar oder startete nicht zuverlässig.

## Umsetzung

### 1. Geräteerkennung

Neue Funktion `speechDeviceInfo()` erkennt:

- iOS/iPadOS
- Android
- Touch-Geräte
- Standalone/PWA-Modus
- sichere Verbindung / HTTPS-Kontext

### 2. Supportstatus erweitert

`speechRecognitionSupportStatus()` liefert jetzt zusätzlich:

- `supported`
- `recognitionAvailable`
- `mode`
- `fallbackSupported`
- `device`
- `ios_pwa_limited`

### 3. Mobile-Fallback

Wenn automatische Erkennung nicht verfügbar oder auf iOS-PWA eingeschränkt ist:

- Aufgabe bleibt sichtbar.
- Mikrofonbutton bleibt bedienbar.
- App zeigt mobilen Übungsmodus.
- Teilnehmer spricht den Satz laut nach.
- Teilnehmer kann über „Selbst nachgesprochen“ weiterarbeiten.

### 4. iOS-Safe-Konfiguration

Für iOS/iPadOS wird die automatische Recognition konservativer gestartet:

- `interimResults=false`
- `maxAlternatives=1`

Desktop bleibt bei:

- `interimResults=true`
- `maxAlternatives=5`

### 5. Hinweise für echte Geräte

Auf iPhone/iPad soll bevorzugt direkt in Safari getestet werden. Als Home-Screen-PWA kann automatische SpeechRecognition eingeschränkt bleiben.

## QA

Neue Testdatei:

- `tests_phase30c_mobile_speech_fix.html`

Geprüft:

- Syntax von `language-course-entry-module.js`
- Version/Caches aktualisiert
- Mobile-Fallback-Schlüssel vorhanden
- Mikrofonbutton nicht mehr hart deaktiviert
- Desktop-Mock bleibt automatische Recognition

## Nicht geändert

- CTC
- Admin
- Highscore
- Teilnahmecode
- Auth
- Cloud-Sync-Grundlogik

## Ehrliche Grenze

Automatische Spracherkennung auf iOS/iPadOS kann browserseitig limitiert bleiben. Ohne Server oder native App kann das nicht vollständig garantiert werden. Der Fix sorgt aber dafür, dass die Aufgabe auf mobilen Geräten nicht mehr blockiert und sinnvoll weiter nutzbar bleibt.
