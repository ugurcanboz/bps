/* BPS-Trainer V9.2.0 · App Config */
(function () {
  'use strict';
  if (window.AppConfig && window.AppConfig.__version === '9.2.0') return;
  const VERSION = '9.2.0';
  const selectors = Object.freeze({
    appRoot: 'appRoot', start: 'start', appNav: 'appNav', healthPanel: 'healthPanel'
  });
  const paths = Object.freeze({
    styles: ['./css/app.css', './css/wordhub-layer.css', './css/apple-system.css', './css/learning-coach.css'],
    core: ['./js/core/app-config.js', './js/core/event-bus.js', './js/core/state-manager.js',
           './js/core/router.js', './js/core/schema.js', './js/core/feature-gates.js'],
    components: ['./js/components/component-registry.js'],
    modules: ['./js/module-registry.js', './js/modules/module-loader.js'],
    data: ['./data/cloud-config.js', './data/question-bank.js', './data/coach-knowledge-base.js'],
    manifest: './manifest.json', updateCheck: './update-check.json'
  });
  const featureDefaults = Object.freeze({
    diagnostics: true, architectureGuard: true, updatePrompt: true,
    cacheKillSwitch: false, // V9: disabled by default, proper versioning instead
    cloudSync: true, cloudHighscore: true, wordHubLayer: true, learningCoach: true
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
    __version: VERSION, version: VERSION, build: 'v920',
    basePath: './', selectors, paths, featureDefaults, contracts, withVersion
  });
})();
