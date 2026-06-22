/* ════════════════════════════════════════════════════════════════
   app-config.js — ZENTRALE KONFIGURATION (Single Source of Truth)
   ════════════════════════════════════════════════════════════════
   ⚠️  DIE VERSION WIRD NUR HIER GEÄNDERT.
       Alle anderen Stellen (Anzeige, Tickets, Highscore) lesen die
       Version aus window.AppConfig.
   ════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  // ┌──────────────────────────────────────────────────────┐
  // │  HIER DIE VERSION ÄNDERN — und sonst nirgendwo.       │
  // └──────────────────────────────────────────────────────┘
  var VERSION = 'G54.43.8D';
  var VERSION_DATE = '2026-06-21';
  var VERSION_LABEL = 'G54.43.8D QA Bubble Always-On-Top Hotfix';

  // Daraus abgeleitet (nicht manuell ändern):
  var FULL_VERSION = VERSION + '-' + VERSION_DATE;
  var CACHE_NAME = 'egt-trainer-' + VERSION.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  window.AppConfig = {
    version: VERSION,
    versionDate: VERSION_DATE,
    versionLabel: VERSION_LABEL,
    fullVersion: FULL_VERSION,
    build: FULL_VERSION,
    cacheName: CACHE_NAME,
    courseId: 'course_2026_gk',
    sessionKey: 'egt_auth_profile_session_v1',
    learnerCacheKey: 'egt_global_learner_profiles',
    featureDefaults: { coachHilfe: true, tickets: true, highscore: true },
    getVersionString: function () { return VERSION + ' · ' + VERSION_DATE; }
  };

  window.APP_VERSION = FULL_VERSION;

  try {
    console.info('%c Eignungstest-Trainer ' + VERSION + ' ', 'background:#2f80ff;color:#fff;font-weight:700;padding:2px 8px;border-radius:4px', '· ' + VERSION_LABEL);
  } catch (e) { }

})();
