/* Language Academy · Phase 38C.1
   Öffentliche Frontend-Konfiguration für den Cloudflare-Groq-Worker.
   Wichtig: Hier steht KEIN API-Key. Der Groq-Key bleibt ausschließlich als Cloudflare Secret gespeichert. */
(function(){
  'use strict';

  window.LanguageAcademyAIConfig = Object.freeze({
    enabled: true,
    provider: 'groq-via-cloudflare-worker',
    workerBaseUrl: (window.EGT_RUNTIME_ENV && window.EGT_RUNTIME_ENV.profile.workerBaseUrl) || 'https://assessments.ugurcan-boz.workers.dev',
    endpoints: {
      health: '/api/health',
      coach: '/api/coach',
      speaking: '/api/speaking',
      examSpeaking: '/api/exam-speaking'
    },
    defaultLevel: 'B1',
    defaultLanguage: 'Deutsch',
    timeoutMs: 18000,
    maxAttempts: 3,
    retryBaseMs: 500,
    retryMaxDelayMs: 5000,
    historyLimit: 8,
    allowLocalFallback: true,
    corsMode: 'cors',
    phase: 'G54.47.14A',
    appVersion: 'G54.49.0H',
    debug: !!(window.EGT_RUNTIME_ENV && window.EGT_RUNTIME_ENV.profile.debug)
  });
})();
