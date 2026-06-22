# Phase 38B.3A – Speaking AI Client

## Ziel
Diese Phase bereitet die App-Seite für den KI-Speaking-Prüfer vor. Die App besitzt jetzt einen eigenen Speaking-AI-Client, der die bereits vorhandenen Worker-Endpunkte `/api/speaking` und `/api/exam-speaking` über den bestehenden Groq/Cloudflare-Client nutzt.

## Neue Datei
- `js/modules/language-speaking-ai-client.js`

## Geänderte Dateien
- `index.html` lädt den neuen Client nach `language-ai-client.js`.
- `service-worker.js` cached den neuen Client und verwendet den neuen Cache-Namen `egt-trainer-g54-38b3a`.
- `data/language-ai-config.js` markiert die aktive Phase als `38B.3A`.
- `update-check.json` wurde auf `G54.38B3A-2026-06-18` aktualisiert.

## Öffentliche API im Browser
```js
window.LanguageSpeakingAI.checkSpeaking({
  level: 'B1',
  topic: 'Arzttermin verschieben',
  userText: 'Guten Tag, ich möchte meinen Termin verschieben.',
  history: []
});

window.LanguageSpeakingAI.checkExamSpeaking({
  level: 'B1',
  topic: 'Arzttermin verschieben',
  userText: 'Guten Tag, ich möchte meinen Termin verschieben, weil ich arbeiten muss.',
  requiredPoints: [
    'höfliche Begrüßung',
    'Termin verschieben',
    'Grund nennen',
    'neuen Termin vorschlagen'
  ]
});
```

## Sicherheitsprinzip
Der Groq-Key befindet sich weiterhin ausschließlich im Cloudflare Worker Secret `GROQ_API_KEY`. Im Frontend ist kein API-Key enthalten.

## Fallback
Wenn Groq oder der Worker nicht erreichbar ist, liefert `LanguageSpeakingAI` eine lokale Notfallbewertung. Dadurch stürzt die App nicht ab und der Teilnehmer kann weiter üben.

## Abgrenzung
Diese Phase integriert noch keine neue große Speaking-UI. Sie stellt die technische Client-Schicht bereit. Die UI-Anbindung folgt in Phase 38B.3B/38B.3C.
