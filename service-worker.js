/* Eignungstest-Trainer · Service Worker · G54.43.8L (2026-06-22)
   Ursache des "alten Layouts trotz Deploy"-Problems: Der fetch-Handler war cache-first,
   d.h. einmal gecachtes app.css/JS wurde nie aktualisiert. Layout-/Logik-Dateien laufen
   jetzt network-first (Cache nur als Offline-Fallback). Neuer CACHE_NAME -> alter Cache
   inkl. veraltetem app.css wird beim activate gelöscht. */
var CACHE_NAME = 'egt-trainer-g54-43-8l';
var ASSETS = [
  "./",
  "./404.html",
  "./js/qa-visual-observer.js",
  "./js/qa/egt-live-visual-qa.js",
  "./js/qa/egt-visual-state-capture.js",
  "./js/qa/egt-visual-regression-diff.js",
  "./css/phase39h-medium-fixes.css",
  "./css/phase39i-pixel-polish.css",
  "./css/phase43s-iphone-scroll-qa-bubble.css",
  "./js/modules/iphone-scroll-qa-hotfix.js",
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
  "./css/app.css",
  "./css/learning-coach.css",
  "./css/language-course.css",
  "./css/python-quest.css",
  "./css/ui-foundation.css",
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
  "./css/ctc-flowlogic-integration.css",
  "./css/ctc-lohr-real-exam.css",
  "./data/admin-sync-config.js",
  "./data/cloud-config.js",
  "./data/language-ai-config.js",
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
  "./index.html",
  "./js/admin-participant-engine.js",
  "./js/app.js",
  "./js/coach-dna-engine.js",
  "./js/components/component-registry.js",
  "./js/core/app-config.js",
  "./js/core/architecture-guard.js",
  "./js/core/event-bus.js",
  "./js/core/module-host.js",
  "./js/core/branch-question-pools.js",
  "./js/core/question-bank-router.js",
  "./js/core/generator-registry.js",
  "./js/core/quiz-orchestrator.js",
  "./js/core/question-factory.js",
  "./js/core/ctc-lohr-exam-structure-engine.js",
  "./js/core/ctc-simulation-stability-engine.js",
  "./js/core/ctc-admin-report-engine.js",
  "./js/core/quiz-build-pipeline-engine.js",
  "./js/core/result-review-engine.js",
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
  "./js/modules/language-ai-client.js",
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
  "./js/modules/ctc-flowlogic-adapter.js",
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
  "./manifest.json",
  "./module-manifest.json",
  "./modules/_template.js",
  "./update-check.json",
  "./service-worker.js",
  "./sync-version.js"
];

self.addEventListener('install', function (event) {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(ASSETS).catch(function (e) {
        console.warn('Cache konnte nicht vollständig vorbereitet werden:', e);
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
  if (event.request.method !== 'GET') return;
  var url = new URL(event.request.url);
  if (url.origin !== location.origin) return;

  if (url.pathname.includes('update-check')) {
    event.respondWith(fetch(event.request, { cache: 'no-store' }).catch(function () { return caches.match(event.request); }));
    return;
  }

  // Layout-/Logik-Dateien (HTML-Navigation, CSS, App-JS unter /js/) network-first:
  // Online gewinnt immer die frischeste Datei -> Layout-Fixes erscheinen ohne Cache-Löschen.
  // Cache dient nur als Offline-Fallback.
  var path = url.pathname;
  var isNavigation = event.request.mode === 'navigate';
  var isStylesheet = /\.css(?:$|\?)/i.test(path);
  var isAppScript = path.indexOf('/js/') !== -1 && /\.js(?:$|\?)/i.test(path);

  if (isNavigation || isStylesheet || isAppScript) {
    event.respondWith(
      fetch(event.request).then(function (response) {
        if (response && response.status === 200) {
          var clone = response.clone();
          caches.open(CACHE_NAME).then(function (cache) { cache.put(event.request, clone); });
        }
        return response;
      }).catch(function () {
        return caches.match(event.request).then(function (cached) {
          return cached || (isNavigation ? caches.match('./index.html') : undefined);
        });
      })
    );
    return;
  }

  // Statische Assets (Bilder, SVG, Daten, Fragenbänke): cache-first für Tempo/Offline,
  // im Hintergrund einmalig nachladen, falls noch nicht im Cache.
  event.respondWith(
    caches.match(event.request).then(function (cached) {
      if (cached) return cached;
      return fetch(event.request).then(function (response) {
        if (!response || response.status !== 200) return response;
        var clone = response.clone();
        caches.open(CACHE_NAME).then(function (cache) { cache.put(event.request, clone); });
        return response;
      });
    })
  );
});
