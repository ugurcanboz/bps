/* Eignungstest-Trainer · App Config */
(function () {
  'use strict';
  if (window.AppConfig && window.AppConfig.__version === 'G35.0-USER-CENTER-STEP1-2026-06-08') return;
  const VERSION = 'G35.0-USER-CENTER-STEP1-2026-06-08';
  const selectors = Object.freeze({
    appRoot: 'appRoot', start: 'start', uiShell: 'uiShell', bottomDock: 'egtBottomDock'
  });
  const paths = Object.freeze({
    styles: ['./css/app.css', './css/ui-foundation.css'],
    core: ['./js/core/app-config.js', './js/core/event-bus.js', './js/core/state-manager.js',
           './js/core/router.js', './js/core/schema.js', './js/core/feature-gates.js'],
    components: ['./js/components/component-registry.js'],
    modules: ['./js/module-registry.js', './js/modules/module-loader.js'],
    data: ['./data/cloud-config.js', './data/question-bank.js'],
    manifest: './manifest.json', updateCheck: './update-check.json'
  });
  const featureDefaults = Object.freeze({
    diagnostics: true, architectureGuard: true, updatePrompt: true,
    cacheKillSwitch: false, // proper caching instead of forced cache reset
    cloudSync: true, cloudHighscore: true
  });
  const contracts = Object.freeze({
    noCoreMutationFromModules: true, uiLockRequired: true,
    moduleManifestRequired: true, questionSchemaRequired: true,
    stateSingleSourcePreferred: true, githubPagesSafe: true
  });
  function withVersion(path) {
    return String(path || '').includes('?') ? path + '&v=' + VERSION : path + '?v=' + VERSION;
  }
  window.AppConfig = Object.freeze({
    __version: VERSION, version: VERSION, build: 'G35.0-USER-CENTER-STEP1-2026-06-08',
    basePath: './', selectors, paths, featureDefaults, contracts, withVersion
  });
})();
