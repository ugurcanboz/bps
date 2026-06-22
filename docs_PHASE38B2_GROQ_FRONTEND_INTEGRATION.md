# Phase 38B.2 – Groq Frontend Integration

## Ziel
Die Language Academy wurde frontendseitig an den Cloudflare Worker angebunden:

- Worker-URL: `https://bps.ugurcan-boz.workers.dev`
- Route Coach: `/api/coach`
- Route Speaking: `/api/speaking`
- Route Exam Speaking: `/api/exam-speaking`
- Route Health: `/api/health`

Der Groq API-Key befindet sich nicht im Frontend. Das Frontend spricht ausschließlich mit dem Cloudflare Worker.

## Umgesetzt

### Neue Dateien

- `data/language-ai-config.js`
- `js/modules/language-ai-client.js`
- `tests_phase38b2_groq_frontend_integration.html`

### Geänderte Dateien

- `index.html`
- `js/learning-coach-ui.js`
- `css/learning-coach.css`
- `js/core/app-config.js`
- `service-worker.js`
- `update-check.json`

## Funktion

Der bestehende KI-Coach nutzt jetzt zuerst den Groq Live-Coach über Cloudflare. Wenn Groq oder der Worker nicht erreichbar ist, fällt die App automatisch auf die lokale Coach-Engine zurück.

Dadurch bleibt die App:

- GitHub-Pages-kompatibel
- ohne sichtbaren API-Key
- offline/fallbackfähig
- stabil bei Worker- oder Groq-Ausfällen

## Nutzeroberfläche

Im Coach-Hub gibt es jetzt eine Karte „Groq Live-Coach“ mit:

- Statusanzeige
- Worker-URL
- Live-Test
- Verbindung prüfen
- Umschalter Groq/lokal
- Chat leeren

## Sicherheitsstatus

- Kein Groq-Key im Frontend
- Keine Secrets in ZIP-Dateien
- Worker-Kommunikation über HTTPS
- Timeout-Schutz im Browser-Client
- lokaler Fallback bei Fehlern

## Nächste Phase

Phase 38B.3 sollte den Speaking-Prüfer anbinden:

- UI für Rollen/Situationen
- Nutzung von `/api/speaking`
- Bewertung von Themenbezug
- Vorbereitung für Prüfungsmodus `/api/exam-speaking`
