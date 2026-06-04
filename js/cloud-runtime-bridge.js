/* Eignungstest-Trainer.0.1 · Cloud Runtime Bridge Shim */
(function () {
  'use strict';
  window.CloudHighscoreBridge = {
    version: '9.0.1',
    refresh: function () {
      if (window.HighscoreLiveRenderer) return HighscoreLiveRenderer.refresh(true);
    },
    test: function () {
      if (window.App && typeof App.addCloudTestScore === 'function') return App.addCloudTestScore();
    }
  };
})();
