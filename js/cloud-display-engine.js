/* BPS-Trainer V9.2.0 · Cloud Display Engine Shim
   Leitet Aufrufe an HighscoreLiveRenderer weiter. Kein eigener Fetch. */
(function () {
  'use strict';
  function refresh() {
    if (window.HighscoreLiveRenderer && typeof HighscoreLiveRenderer.refresh === 'function') {
      return HighscoreLiveRenderer.refresh(true);
    }
    if (window.App && App._test && App._test.CloudHighscoreEngine) {
      return App._test.CloudHighscoreEngine.refreshDashboard();
    }
  }
  window.CloudDisplayEngine = { version: '9.2.0', refresh: refresh };
  document.addEventListener('DOMContentLoaded', function () {
    setTimeout(refresh, 1000);
  });
})();
