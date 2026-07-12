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
  var VERSION = 'G54.50.2A';
  var VERSION_DATE = '2026-07-12';
  var VERSION_LABEL = 'Vollständige Legacy-Bereinigung und Novura-Normalisierung';

  // Daraus abgeleitet (nicht manuell ändern):
  var FULL_VERSION = VERSION + '-' + VERSION_DATE;
  var CACHE_NAME = 'egt-trainer-' + VERSION.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  function detectEnvironment() {
    var host = '';
    var protocol = '';
    try { host = String(window.location.hostname || '').toLowerCase(); protocol = String(window.location.protocol || ''); } catch (e) { }
    if (protocol === 'file:' || host === 'localhost' || host === '127.0.0.1' || host === '::1') return 'development';
    if (/^(beta|staging|preview)[.-]/.test(host) || /[.-](beta|staging|preview)[.-]/.test(host)) return 'beta';
    return 'production';
  }

  var ENVIRONMENT = (window.EGT_RUNTIME_ENV && window.EGT_RUNTIME_ENV.name) || detectEnvironment();
  var IS_DEVELOPMENT = ENVIRONMENT === 'development';

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
    environment: ENVIRONMENT,
    isDevelopment: IS_DEVELOPMENT,
    security: {
      requireTrustedClaims: !IS_DEVELOPMENT,
      allowLocalRolePins: IS_DEVELOPMENT,
      allowQaBypass: IS_DEVELOPMENT,
      allowLegacyCodeLogin: IS_DEVELOPMENT,
      requireAppCheckForPrivilegedCalls: !IS_DEVELOPMENT,
      denyUnverifiedPrivilegedSession: true
    },
    featureDefaults: { coachHilfe: true, tickets: true, highscore: true },
    getVersionString: function () { return VERSION + ' · ' + VERSION_DATE; }
  };

  window.APP_VERSION = FULL_VERSION;

  try {
    console.info('%c Novura ' + VERSION + ' ', 'background:#2f80ff;color:#fff;font-weight:700;padding:2px 8px;border-radius:4px', '· ' + VERSION_LABEL);
  } catch (e) { }

})();
