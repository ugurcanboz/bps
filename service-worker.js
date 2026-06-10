/* Eignungstest-Trainer · Service Worker · G34.2 Login/Profile Hotfix */
var CACHE_NAME = 'bps-trainer-g342-login-profile-hotfix';
var ASSETS = [
  './',
  './404.html',
  './START_HERE.md',
  './admin-portal.html',
  './assets/logic/gemeinsamkeiten_1.png',
  './assets/logic/gemeinsamkeiten_2.png',
  './assets/logic/gemeinsamkeiten_3.png',
  './assets/logic/gemeinsamkeiten_4.png',
  './assets/logic/gemeinsamkeiten_5.png',
  './assets/logic/zugehoerigkeiten1_1.png',
  './assets/logic/zugehoerigkeiten1_2.png',
  './assets/logic/zugehoerigkeiten1_3.png',
  './assets/logic/zugehoerigkeiten2_2.png',
  './assets/logic/zugehoerigkeiten2_3.png',
  './assets/logic/zugehoerigkeiten2_4.png',
  './assets/logic/zugehoerigkeiten2_5.png',
  './assets/matrix/matrix_task_1.png',
  './assets/matrix/matrix_task_2.png',
  './assets/matrix/matrix_task_3.png',
  './assets/matrix/matrix_task_4.png',
  './assets/matrix/matrix_task_5.png',
  './assets/matrix/matrix_task_6.png',
  './assets/matrix/matrix_task_7.png',
  './assets/matrix/matrix_task_8.png',
  './assets/ui/brain-logo.svg',
  './assets/ui/hero-target-ios.svg',
  './assets/ui/hero-target.svg',
  './assets/ui/icon-analysis.svg',
  './assets/ui/icon-coach.svg',
  './assets/ui/icon-dashboard.svg',
  './assets/ui/icon-individual.svg',
  './assets/ui/icon-it.svg',
  './assets/ui/icon-kaufm-ios.svg',
  './assets/ui/icon-kaufm.svg',
  './assets/ui/icon-knowledge.svg',
  './assets/ui/icon-learn.svg',
  './assets/ui/icon-more.svg',
  './assets/ui/icon-practice.svg',
  './assets/ui/icon-progress.svg',
  './assets/ui/icon-settings.svg',
  './assets/ui/icon-social.svg',
  './assets/ui/icon-user.svg',
  './css/admin-portal.css',
  './css/app.css',
  './css/learning-coach.css',
  './css/python-quest.css',
  './css/ui-foundation.css',
  './css/ui-nav-foundation.css',
  './data/admin-sync-config.js',
  './data/cloud-config.js',
  './data/coach-knowledge-base.js',
  './data/coach-knowledge-extended.js',
  './data/learning-math-tasks-extended.js',
  './data/learning-math-tasks.js',
  './data/python-quest-db.js',
  './data/question-bank-it-extra.js',
  './data/question-bank-kaufm.js',
  './data/question-bank-mathe.js',
  './data/question-bank-sozial.js',
  './data/question-bank.js',
  './data/question-schema.example.json',
  './docs/G25_DOZENTENFOKUS_REPORT.md',
  './docs/G25_DOZENTENFOKUS_QA.json',
  './docs/G25_1_HILFEBEDARF_DROPDOWN_REPORT.md',
  './docs/G25_1_HILFEBEDARF_DROPDOWN_QA.json',
  './docs/G26_1_SYSTEMINFO_TASKCOUNT_FIX_REPORT.md',
  './docs/G26_1_SYSTEMINFO_TASKCOUNT_FIX_QA.json',
  './docs/G26_SYSTEMINFO_DIAGNOSE_REPORT.md',
  './docs/G26_SYSTEMINFO_DIAGNOSE_QA.json',
  './icons/app-logo.svg',
  './icons/icon-180.png',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/maskable-512.png',
  './index.html',
  './js/admin-participant-engine.js',
  './js/app.js',
  './js/coach-dna-engine.js',
  './js/components/component-registry.js',
  './js/core/app-config.js',
  './js/core/architecture-guard.js',
  './js/core/event-bus.js',
  './js/core/feature-gates.js',
  './js/core/github-sync.js',
  './js/core/production-diagnostics.js',
  './js/core/router.js',
  './js/core/schema.js',
  './js/core/state-manager.js',
  './js/essay-mode.js',
  './js/feedback-sheet.js',
  './js/learning-coach-engine.js',
  './js/learning-coach-ui.js',
  './js/learning-task-generator.js',
  './js/module-registry.js',
  './js/modules/module-loader.js',
  './js/modules/auth-profile-shell.js',
  './js/python-quest-module.js',
  './js/question-bank-quality-engine.js',
  './js/ui-home-renderer.js',
  './js/ui-router.js',
  './manifest.json',
  './module-manifest.json',
  './modules/README.md',
  './modules/_template.js',
  './docs/G23_ADMIN_PORTAL_SHELL_REPORT.md',
  './docs/G23_ADMIN_PORTAL_SHELL_QA.json',
  './docs/G23_9_DEMO_TEILNEHMER_REPORT.md',
  './docs/G23_9_DEMO_TEILNEHMER_QA.json',
  './docs/G23_10_ROLLEN_DASHBOARD_REPORT.md',
  './docs/G23_11_DASHBOARD_TEILNEHMER_DROPDOWN_REPORT.md',
  './docs/G23_11_DASHBOARD_TEILNEHMER_DROPDOWN_QA.json',
  './docs/G27_1_QBANK_TAB_FIX_REPORT.md',
  './docs/G27_QBANK_QUALITY_QA.json',
  './docs/G28_EXPORT_BERICHTE_REPORT.md',
  './docs/G28_EXPORT_BERICHTE_QA.json',
  './docs/G29_PORTAL_POLISH_REPORT.md',
  './docs/G29_PORTAL_POLISH_QA.json',
  './docs/G30_TRAINING_COCKPIT_REPORT.md',
  './docs/G30_TRAINING_COCKPIT_QA.json',
  './docs/G30_2_TRAINING_COCKPIT_LAYOUT_FIX_REPORT.md',
  './docs/G30_2_TRAINING_COCKPIT_LAYOUT_FIX_QA.json',
  './docs/G30_3_QUESTION_OVERVIEW_POLISH_REPORT.md',
  './docs/G30_3_QUESTION_OVERVIEW_POLISH_QA.json',
  './docs/G30_4_ANSWER_LAYOUT_SPEED_FIX_REPORT.md',
  './docs/G30_4_ANSWER_LAYOUT_SPEED_FIX_QA.json',
  './docs/G32_4_FIREBASE_USERDATABASE_FOUNDATION_REPORT.md',
  './docs/G32_4_FIREBASE_FIRESTORE_RULES_EXAMPLE.txt',
  './docs/G33_0_AUTH_PROFILE_SHELL_REPORT.md',
  './docs/G33_0_AUTH_PROFILE_SHELL_QA.json',
  './docs/G33_5_DEMO_GATES_HIGHSCORE_PROFILE_REPORT.md',
  './docs/G33_5_DEMO_GATES_HIGHSCORE_PROFILE_QA.json',
  './docs/G34_1_DUEL_SYNC_FOUNDATION_REPORT.md',
  './docs/G34_1_DUEL_SYNC_FOUNDATION_QA.json',
  './docs/G34_1_FIRESTORE_RULES_ROLE_DRAFT.txt',
  './update-check.json',
  './service-worker.js',


  './docs/G33_1_FIREBASE_ACCESS_CODE_SHELL_REPORT.md',
  './docs/G33_1_FIREBASE_ACCESS_CODE_SHELL_QA.json',
  './docs/G33_2_ACCESS_CODE_GENERATOR_REPORT.md',
  './docs/G33_2_ACCESS_CODE_GENERATOR_QA.json',
  './docs/G33_2_FIREBASE_CONFIGURED_REPORT.md',
  './docs/G33_4_AVATAR_UPLOAD_HOTFIX_REPORT.md',
  './docs/G33_4_AVATAR_UPLOAD_HOTFIX_QA.json',
  './docs/G33_7_DEEP_SHEET_SIMULATION_FIX_QA.json',
  './docs/G33_7_DEEP_SHEET_SIMULATION_FIX_REPORT.md',
  './docs/G33_3_PROFILE_AVATAR_NICKNAME_REPORT.md',
  './docs/G33_3_PROFILE_AVATAR_NICKNAME_QA.json',
  './docs/G34_0_COACH_PROFILE_PERSONALIZATION_REPORT.md',
  './docs/G34_0_COACH_PROFILE_PERSONALIZATION_QA.json',
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
