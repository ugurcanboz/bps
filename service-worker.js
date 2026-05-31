/* BPS-Trainer V10.5.1 · Python Quest Academy Integration Guide */
var CACHE_NAME = 'bps-trainer-v10-5-1-python-quest-integration-guide';
var ASSETS = [
  './',
  './index.html',
  './coach-demo.html',
  './coach-qa-runner.html',
  './css/app.css',
  './css/wordhub-layer.css',
  './css/apple-system.css',
  './css/learning-coach.css',
  './css/python-quest.css',
  './js/app.js',
  './js/wordhub-layer.js',
  './js/learning-coach-engine.js',
  './js/learning-coach-ui.js',
  './js/python-quest-module.js',
  './js/feedback-sheet.js',
  './js/highscore-live-renderer.js',
  './js/cloud-display-engine.js',
  './js/cloud-runtime-bridge.js',
  './js/core/app-config.js',
  './js/core/event-bus.js',
  './js/core/state-manager.js',
  './js/core/router.js',
  './js/core/schema.js',
  './js/core/feature-gates.js',
  './js/components/component-registry.js',
  './js/module-registry.js',
  './js/modules/module-loader.js',
  './js/core/deep-sheet-controller.js',
  './js/core/architecture-guard.js',
  './js/core/production-diagnostics.js',
  './data/question-bank.js',
  './data/question-bank-kaufm.js',
  './data/question-bank-sozial.js',
  './data/question-bank-it-extra.js',
  './data/question-bank-mathe.js',
  './data/cloud-config.js',
  './data/coach-knowledge-base.js',
  './data/python-quest-db.js',
  './docs/python-levels/python-level-01.pdf',
  './docs/python-levels/python-level-02.pdf',
  './docs/python-levels/python-level-03.pdf',
  './docs/python-levels/python-level-04.pdf',
  './docs/python-levels/python-level-05.pdf',
  './docs/python-levels/python-level-06.pdf',
  './docs/python-levels/python-level-07.pdf',
  './docs/python-levels/python-level-08.pdf',
  './docs/python-levels/python-level-09.pdf',
  './docs/python-levels/python-level-10.pdf',
  './PYTHON_QUEST_START_HERE.md',
  './docs/PYTHON_QUEST_INTEGRATION_GUIDE.md',
  './docs/PYTHON_QUEST_QA_CHECKLIST.md',
  './docs/PYTHON_QUEST_LEVEL_AUTHORING_GUIDE.md',
  './docs/UPDATE_V10.5.1_PYTHON_QUEST_INTEGRATION_GUIDE.md',
  './manifest.json',
  './icons/icon-180.png',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

self.addEventListener('install', function (event) {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(ASSETS).catch(function (e) {
        console.warn('[SW V9] Cache addAll partial fail:', e);
      });
    })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.filter(function (k) { return k !== CACHE_NAME; })
            .map(function (k) { return caches.delete(k); })
      );
    }).then(function () {
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', function (event) {
  // Skip non-GET and cross-origin
  if (event.request.method !== 'GET') return;
  var url = new URL(event.request.url);
  if (url.origin !== location.origin) return;

  // Network-first for cloud-config and update-check
  if (url.pathname.includes('cloud-config') || url.pathname.includes('update-check')) {
    event.respondWith(
      fetch(event.request).catch(function () {
        return caches.match(event.request);
      })
    );
    return;
  }

  // Cache-first for everything else
  event.respondWith(
    caches.match(event.request).then(function (cached) {
      if (cached) return cached;
      return fetch(event.request).then(function (response) {
        if (!response || response.status !== 200) return response;
        var clone = response.clone();
        caches.open(CACHE_NAME).then(function (cache) {
          cache.put(event.request, clone);
        });
        return response;
      });
    })
  );
});
