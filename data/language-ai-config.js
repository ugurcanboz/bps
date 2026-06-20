/* Language Academy · Phase 38C.1
   Öffentliche Frontend-Konfiguration für den Cloudflare-Groq-Worker.
   Wichtig: Hier steht KEIN API-Key. Der Groq-Key bleibt ausschließlich als Cloudflare Secret gespeichert. */
(function(){
  'use strict';

  window.LanguageAcademyAIConfig = Object.freeze({
    enabled: true,
    provider: 'groq-via-cloudflare-worker',
    workerBaseUrl: 'https://bps.ugurcan-boz.workers.dev',
    endpoints: {
      health: '/api/health',
      coach: '/api/coach',
      speaking: '/api/speaking',
      examSpeaking: '/api/exam-speaking'
    },
    defaultLevel: 'B1',
    defaultLanguage: 'Deutsch',
    timeoutMs: 18000,
    historyLimit: 8,
    allowLocalFallback: true,
    corsMode: 'cors',
    phase: '38C.1',
    debug: false
  });
})();
