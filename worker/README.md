# Novura Groq Worker · G54.46.13A

Der Worker hält `GROQ_API_KEY` ausschließlich serverseitig und stellt kompatible Endpunkte bereit:

- `GET /api/health`
- `POST /api/coach`
- `POST /api/speaking`
- `POST /api/exam-speaking`

## Sicherheitsfunktionen

- exakte CORS-Allowlist
- Body- und Eingabelimits
- Schema-/CEFR-Validierung
- Rate-Limit über Cloudflare KV
- Prompt-Injection-Grundschutz
- Request-ID, Security-Header und strukturierte Logs
- serverseitiger Upstream-Timeout
- keine Speicherung vollständiger Nutzereingaben in Logs

## Einrichtung

1. `npm install`
2. `wrangler secret put GROQ_API_KEY`
3. Zwei KV-Namespaces anlegen und Bindings in `wrangler.toml` aktivieren.
4. `ALLOWED_ORIGINS` auf die echten GitHub-Pages-/Domain-Ursprünge setzen.
5. `npm test`
6. `npm run deploy`

Ohne `RATE_LIMIT_KV` bleibt der Worker funktionsfähig, meldet im Health-Endpunkt jedoch einen degradierten Rate-Limit-Schutz. Für Produktion ist KV Pflicht.

## G54.46.13B · Retry und Fehlerbehandlung

Der Worker wiederholt ausschließlich vorübergehende Groq-Fehler: Netzwerkfehler, Timeouts, HTTP 408, 425, 429 und 5xx. Validierungs-, CORS- und sonstige 4xx-Fehler werden nicht erneut gesendet. `Retry-After` wird berücksichtigt; ansonsten gilt exponentielles Backoff mit Jitter.

Optionale Variablen:

- `UPSTREAM_MAX_ATTEMPTS` (Standard 3, maximal 5)
- `UPSTREAM_RETRY_BASE_MS` (Standard 450)
- `UPSTREAM_RETRY_MAX_DELAY_MS` (Standard 5000)
- `UPSTREAM_TIMEOUT_MS` (Standard 16000)

## G54.46.13E Prompt Engine

The worker now owns a centralized, versioned prompt engine in `src/prompts.js`.

Supported role behavior:

- `coach` — explanatory language coach
- `conversation` — in-role conversation partner (`role` or `mode` in `/api/coach` payload)
- `speakingEvaluator` — forced for `/api/speaking`
- `examiner` — forced for `/api/exam-speaking`

Supported learning languages: `Deutsch`, `Englisch` (aliases `German`, `English`, `de`, `en`).
Supported CEFR levels: A1–C2.

Every response metadata object includes the prompt engine version and resolved role, level and language. The system prompt mandates a stable JSON response shape for each endpoint and explicitly forbids invented audio evidence.

## G54.46.13G Monitoring

Der Worker erfasst ausschließlich aggregierte technische Betriebsdaten. Vollständige Nutzertexte, Gesprächsverläufe, Prompts und personenbezogene Inhalte werden nicht gespeichert.

Erfasste Werte:
- Anfragen, Erfolge und Fehler
- Erfolgsquote
- durchschnittliche und maximale Latenz
- Retries, Rate-Limits und Timeouts
- Prompt-, Completion- und Gesamttokens
- Modell-, HTTP-Status- und Routenverteilung

Konfiguration:
```bash
wrangler secret put MONITORING_TOKEN
```
`SECURITY_KV` muss in `wrangler.toml` gebunden sein. Metriken werden in Stunden-Buckets für 14 Tage gespeichert.

Geschützter Abruf:
```bash
curl -H "Authorization: Bearer $MONITORING_TOKEN" \
  "https://<worker-domain>/api/metrics?hours=24"
```

Der öffentliche Health-Endpunkt zeigt nur, ob Storage und Schutz konfiguriert sind. Er gibt weder Token noch interne Metrikdaten aus.
