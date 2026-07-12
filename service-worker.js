/* Novura · Service Worker · G54.50.2 (2026-07-12)
   Atomare Shell-Installation, kontrollierte Cache-Migration und sichere Update-Aktivierung. */
'use strict';

var VERSION = 'G54.50.2-2026-07-12';
var CACHE_PREFIX = 'egt-trainer-';
var CACHE_NAME = 'novura-g54-50-2';
var CORE_ASSETS = [
  "./",
  "./index.html",
  "./404.html",
  "./manifest.json",
  "./update-check.json",
  "./css/app.css",
  "./css/ui-foundation.css",
  "./css/ui-ux-consistency.css",
  "./js/core/runtime-environment.js",
  "./js/core/app-config.js",
  "./js/core/brand-config.js",
  "./js/core/dom-security.js",
  "./js/core/pwa-update-manager.js",
  "./js/app.js"
];
var OPTIONAL_ASSETS = [
  "./css/guided-welcome.css",
  "./js/core/guided-welcome-engine.js",
  "./js/modules/guided-welcome-ui.js",
  "./js/core/nova-context-engine.js",
  "./js/core/nova-weather-context.js",
  "./js/core/nova-micro-personalization.js",
  "./js/core/nova-product-tour-engine.js",
  "./js/modules/nova-product-tour-ui.js",
  "./js/modules/nova-control-center.js",
  "./css/nova-product-tour.css",
  "./css/nova-control-center.css",
  "./js/qa-visual-observer.js",
  "./js/qa/egt-live-visual-qa.js",
  "./js/qa/egt-visual-state-capture.js",
  "./js/qa/egt-visual-regression-diff.js",
  "./css/phase39h-medium-fixes.css",
  "./css/phase39i-pixel-polish.css",
  "./css/phase43s-iphone-scroll-qa-bubble.css",
  "./css/admin-release-polish.css",
  "./css/info-legal-center.css",
  "./css/global-device-a11y-qa.css",
  "./css/release-channel.css",
  "./js/modules/iphone-scroll-qa-hotfix.js",
  "./js/core/operator-config.js",
  "./js/core/release-channel.js",
  "./js/core/app-monitoring.js",
  "./js/core/app-icons.js",
  "./js/core/privacy-data-center.js",
  "./js/modules/info-legal-center.js",
  "./js/core/language-audio-realism-engine.js",
  "./js/core/language-speaking-evidence-engine.js",
  "./js/core/language-exam-calibration-engine.js",
  "./js/modules/language-course-entry-module.js",
  "./data/language-ai-config.js",
  "./js/modules/language-ai-client.js",
  "./js/qa-smoke-runner.js",
  "./admin-portal.html",
  "./assets/logic/gemeinsamkeiten_1.png",
  "./assets/logic/gemeinsamkeiten_2.png",
  "./assets/logic/gemeinsamkeiten_3.png",
  "./assets/logic/gemeinsamkeiten_4.png",
  "./assets/logic/gemeinsamkeiten_5.png",
  "./assets/logic/zugehoerigkeiten1_1.png",
  "./assets/logic/zugehoerigkeiten1_2.png",
  "./assets/logic/zugehoerigkeiten1_3.png",
  "./assets/logic/zugehoerigkeiten2_2.png",
  "./assets/logic/zugehoerigkeiten2_3.png",
  "./assets/logic/zugehoerigkeiten2_4.png",
  "./assets/logic/zugehoerigkeiten2_5.png",
  "./assets/matrix/matrix_task_1.png",
  "./assets/matrix/matrix_task_2.png",
  "./assets/matrix/matrix_task_3.png",
  "./assets/matrix/matrix_task_4.png",
  "./assets/matrix/matrix_task_5.png",
  "./assets/matrix/matrix_task_6.png",
  "./assets/matrix/matrix_task_7.png",
  "./assets/matrix/matrix_task_8.png",
  "./assets/ui/brain-logo.svg",
  "./assets/ui/hero-target-ios.svg",
  "./assets/ui/hero-target.svg",
  "./assets/ui/icon-analysis.svg",
  "./assets/ui/icon-coach.svg",
  "./assets/ui/icon-dashboard.svg",
  "./assets/ui/icon-individual.svg",
  "./assets/ui/icon-it.svg",
  "./assets/ui/icon-kaufm-ios.svg",
  "./assets/ui/icon-kaufm.svg",
  "./assets/ui/icon-knowledge.svg",
  "./assets/ui/icon-learn.svg",
  "./assets/ui/icon-more.svg",
  "./assets/ui/icon-practice.svg",
  "./assets/ui/icon-progress.svg",
  "./assets/ui/icon-settings.svg",
  "./assets/ui/icon-social.svg",
  "./assets/ui/icon-user.svg",
  "./css/admin-portal.css",
  "./css/learning-coach.css",
  "./css/language-course.css",
  "./css/python-quest.css",
  "./css/ui-nav-foundation.css",
  "./css/cinematic.css",
  "./css/egt-gate.css",
  "./css/egt-simulation.css",
  "./css/egt-practice.css",
  "./css/ui-spacing-polish.css",
  "./css/ui-density-grid-polish.css",
  "./css/ui-ios-coach-polish.css",
  "./css/phase25-release-qa-fixes.css",
  "./css/phase26-product-structure.css",
  "./modules/flowlogic/src/flowlogic.css",
  "./css/novura-exams-flowlogic.css",
  "./css/novura-exams-real-exam.css",
  "./data/admin-sync-config.js",
  "./data/cloud-config.js",
  "./data/language-progress-config.js",
  "./data/coach-knowledge-base.js",
  "./data/coach-knowledge-extended.js",
  "./data/learning-math-tasks-extended.js",
  "./data/learning-math-tasks.js",
  "./data/python-quest-db.js",
  "./data/question-bank-it-extra.js",
  "./data/question-bank-kaufm.js",
  "./data/question-bank-mathe.js",
  "./data/question-bank-sozial.js",
  "./data/question-bank.js",
  "./data/question-schema.example.json",
  "./icons/app-logo.svg",
  "./icons/icon-180.png",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/maskable-512.png",
  "./js/admin-participant-engine.js",
  "./js/coach-dna-engine.js",
  "./js/components/component-registry.js",
  "./js/core/architecture-guard.js",
  "./js/core/event-bus.js",
  "./js/core/module-host.js",
  "./js/core/branch-question-pools.js",
  "./js/core/question-bank-router.js",
  "./js/core/generator-registry.js",
  "./js/core/quiz-orchestrator.js",
  "./js/core/question-factory.js",
  "./js/core/novura-exams-structure-engine.js",
  "./js/core/novura-exams-stability-engine.js",
  "./js/core/novura-exams-admin-report-engine.js",
  "./js/core/quiz-build-pipeline-engine.js",
  "./js/core/result-review-engine.js",
  "./js/core/activity-ledger-engine.js",
  "./js/core/language-review-engine.js",
  "./js/core/language-didactic-engine.js",
  "./js/core/admin-analytics-engine.js",
  "./js/core/admin-operations-engine.js",
  "./js/core/result-persistence-engine.js",
  "./js/core/result-flow-engine.js",
  "./js/core/question-flow-engine.js",
  "./js/core/highscore-dashboard-engine.js",
  "./js/core/cloud-highscore-engine.js",
  "./js/core/highscore-duel-ui-engine.js",
  "./js/core/duell-runtime-engine.js",
  "./js/core/highscore-duel-sheet-router-engine.js",
  "./js/core/admin-portal-domain-engine.js",
  "./js/core/profile-auth-domain-engine.js",
  "./js/core/coach-analysis-domain-engine.js",
  "./js/core/product-structure-engine.js",
  "./js/core/release-qa-engine.js",
  "./js/modules/egt-home-module.js",
  "./js/modules/egt-simulation-entry-module.js",
  "./js/modules/egt-sim-it.js",
  "./js/modules/egt-sim-kaufm.js",
  "./js/modules/egt-sim-sozial.js",
  "./js/modules/egt-practice-entry-module.js",
  "./js/modules/egt-practice.js",
  "./js/modules/egt-admin-entry-module.js",
  "./js/modules/egt-profile-entry-module.js",
  "./js/modules/egt-coach-entry-module.js",
  "./js/modules/egt-analysis-data-adapter.js",
  "./js/modules/egt-analysis-entry-module.js",
  "./js/modules/egt-highscore-entry-module.js",
  "./js/modules/egt-duel-entry-module.js",
  "./js/core/feature-gates.js",
  "./js/core/github-sync.js",
  "./js/core/production-diagnostics.js",
  "./js/core/router.js",
  "./js/core/schema.js",
  "./js/core/state-manager.js",
  "./js/essay-mode.js",
  "./js/feedback-sheet.js",
  "./js/learning-coach-engine.js",
  "./js/learning-coach-ui.js",
  "./js/modules/language-speaking-ai-client.js",
  "./data/language-exam-blueprints.js",
  "./data/language-level-difficulty-rules.js",
  "./data/language-b1-exam-pilot.js",
  "./data/language-b2-exam-pilot.js",
  "./js/modules/language-exam-engine.js",
  "./js/modules/language-exam-shell.js",
  "./js/learning-task-generator.js",
  "./js/module-registry.js",
  "./js/modules/module-loader.js",
  "./js/modules/egt-security-context.js",
  "./js/modules/auth-profile-shell.js",
  "./js/modules/highscore-engine.js",
  "./modules/flowlogic/src/flowlogic.selftest.js",
  "./modules/flowlogic/src/flowlogic.schema.js",
  "./modules/flowlogic/src/flowlogic.scenarios.js",
  "./modules/flowlogic/src/flowlogic.mutations.js",
  "./modules/flowlogic/src/flowlogic.validator.js",
  "./modules/flowlogic/src/flowlogic.renderer.js",
  "./modules/flowlogic/src/flowlogic.input.js",
  "./modules/flowlogic/src/flowlogic.scorer.js",
  "./modules/flowlogic/src/flowlogic.generator.js",
  "./modules/flowlogic/src/flowlogic.module.js",
  "./js/modules/novura-exams-flowlogic-adapter.js",
  "./js/modules/egt-simulation-engine.js",
  "./js/python-quest-module.js",
  "./js/question-bank-quality-engine.js",
  "./js/ui-home-renderer.js",
  "./js/ui-router.js",
  "./js/modules/cinematic-intro.js",
  "./js/modules/egt-auth-engine.js",
  "./js/modules/egt-ticket-system.js",
  "./js/modules/egt-user-notices.js",
  "./js/modules/egt-gate-screen.js",
  "./js/modules/egt-gate-enforce.js",
  "./module-manifest.json",
  "./modules/_template.js"
];

function sameOrigin(request) {
  try { return new URL(request.url).origin === self.location.origin; } catch (e) { return false; }
}

async function cacheCore() {
  var cache = await caches.open(CACHE_NAME);
  for (var i = 0; i < CORE_ASSETS.length; i++) {
    var url = CORE_ASSETS[i];
    var response = await fetch(url, { cache: 'reload' });
    if (!response || !response.ok) throw new Error('CORE_ASSET_FAILED:' + url);
    await cache.put(url, response);
  }
}

async function cacheOptional() {
  var cache = await caches.open(CACHE_NAME);
  await Promise.allSettled(OPTIONAL_ASSETS.map(async function (url) {
    try {
      var response = await fetch(url, { cache: 'reload' });
      if (response && response.ok) await cache.put(url, response);
    } catch (e) { /* Optional: online später nachladbar. */ }
  }));
}

self.addEventListener('install', function (event) {
  event.waitUntil(cacheCore().then(cacheOptional));
});

self.addEventListener('activate', function (event) {
  event.waitUntil((async function () {
    if (self.registration.navigationPreload) {
      try { await self.registration.navigationPreload.enable(); } catch (e) {}
    }
    var keys = await caches.keys();
    await Promise.all(keys.filter(function (key) {
      return key.indexOf(CACHE_PREFIX) === 0 && key !== CACHE_NAME;
    }).map(function (key) { return caches.delete(key); }));
    await self.clients.claim();
    var clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    clients.forEach(function (client) {
      client.postMessage({ type: 'SW_ACTIVATED', version: VERSION, cacheName: CACHE_NAME });
    });
  })());
});

self.addEventListener('message', function (event) {
  var data = event.data || {};
  if (data.type === 'SKIP_WAITING') self.skipWaiting();
  if (data.type === 'GET_VERSION' && event.source) {
    event.source.postMessage({ type: 'SW_VERSION', version: VERSION, cacheName: CACHE_NAME });
  }
  if (data.type === 'CLEAR_APP_CACHES') {
    event.waitUntil(caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (key) { return key.indexOf(CACHE_PREFIX) === 0; }).map(function (key) { return caches.delete(key); }));
    }));
  }
});

async function networkFirst(request, preloadResponse) {
  var cache = await caches.open(CACHE_NAME);
  try {
    var response = preloadResponse || await fetch(request, { cache: 'no-store' });
    if (response && response.ok) await cache.put(request, response.clone());
    return response;
  } catch (e) {
    var cached = await cache.match(request, { ignoreSearch: true });
    if (cached) return cached;
    if (request.mode === 'navigate') return cache.match('./index.html');
    throw e;
  }
}

async function staleWhileRevalidate(request, event) {
  var cache = await caches.open(CACHE_NAME);
  var cached = await cache.match(request, { ignoreSearch: true });
  var network = fetch(request).then(function (response) {
    if (response && response.ok) cache.put(request, response.clone());
    return response;
  }).catch(function () { return null; });
  if (cached) { event.waitUntil(network); return cached; }
  return (await network) || new Response('', { status: 504, statusText: 'Offline' });
}

self.addEventListener('fetch', function (event) {
  var request = event.request;
  if (request.method !== 'GET' || !sameOrigin(request)) return;
  var url = new URL(request.url);
  var path = url.pathname;

  if (/update-check\.json$/i.test(path) || /service-worker\.js$/i.test(path)) {
    event.respondWith(fetch(request, { cache: 'no-store' }).catch(function () { return caches.match(request, { ignoreSearch: true }); }));
    return;
  }

  var isNavigation = request.mode === 'navigate';
  var isMutable = isNavigation || /\.(?:html|css|js|mjs|json)$/i.test(path);
  if (isMutable) {
    event.respondWith((async function () {
      var preload = isNavigation ? await event.preloadResponse : null;
      return networkFirst(request, preload);
    })());
    return;
  }

  event.respondWith(staleWhileRevalidate(request, event));
});
