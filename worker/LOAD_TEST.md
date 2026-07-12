# G54.46.13G – Last- und Ausfalltests

## Lokale reproduzierbare Tests

```bash
npm test
npm run test:resilience
```

Die Suite simuliert 50 parallele Coach-Anfragen, lange Dialoge, native und KV-basierte Rate-Limits, vollständigen Groq-Ausfall sowie 100 ungültige Parallel-Anfragen. Groq wird dabei gemockt; es entstehen keine API-Kosten.

## Live-Test

Der sichere Standard testet nur `/api/health`:

```bash
npm run load:live -- --url=https://DEIN-WORKER.workers.dev --requests=100 --concurrency=10
```

Ein echter Coach-Test verursacht Groq-Anfragen und muss ausdrücklich freigegeben werden:

```bash
npm run load:live -- --url=https://DEIN-WORKER.workers.dev --requests=20 --concurrency=5 --allow-cost=true
```

Nicht unkontrolliert gegen Produktion ausführen. Erst Preview-Deployment verwenden.
