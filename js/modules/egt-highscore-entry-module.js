/* ════════════════════════════════════════════════════════════════
   egt-highscore-entry-module.js — Phase 3D Highscore Entry Module
   Zweck: Highscore/Ranking als eigene Entry-Grenze über AppModuleHost
   führen. Die bestehende HighscoreEngine/EGTUILayer-Logik bleibt unverändert.
   ════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var VERSION = 'G52.4-phase18';

  function emit(name, detail) {
    try { document.dispatchEvent(new CustomEvent('egt:module:highscore-entry:' + name, { detail: detail || {} })); } catch (e) {}
    try { if (window.AppEvents && typeof AppEvents.emit === 'function') AppEvents.emit('module:highscore-entry:' + name, detail || {}); } catch (e2) {}
  }

  function openHighscore(reason) {
    try {
      if (window.HighscoreDuelSheetRouterEngine && typeof HighscoreDuelSheetRouterEngine.openHighscoreSheet === 'function') {
        HighscoreDuelSheetRouterEngine.openHighscoreSheet({ reason: reason || 'highscore-entry', sheet: true, preferLayer: true });
        emit('opened', { reason: reason || 'highscore-entry', provider: 'HighscoreDuelSheetRouterEngine.openHighscoreSheet', version: VERSION });
        return true;
      }
    } catch (routerError) {
      emit('error', { reason: reason || 'highscore-entry', error: routerError && routerError.message ? routerError.message : String(routerError), version: VERSION });
      return true;
    }
    try {
      if (window.EGTUILayer && typeof EGTUILayer.openHighscoreSheet === 'function') {
        EGTUILayer.openHighscoreSheet();
        emit('opened', { reason: reason || 'highscore-entry', provider: 'EGTUILayer.openHighscoreSheet', version: VERSION });
        return true;
      }
    } catch (e) {
      emit('error', { reason: reason || 'highscore-entry', error: e && e.message ? e.message : String(e), version: VERSION });
      return true;
    }
    try {
      if (window.CloudHighscoreEngine && typeof CloudHighscoreEngine.refreshDashboard === 'function') {
        CloudHighscoreEngine.refreshDashboard();
        emit('opened', { reason: reason || 'highscore-entry', provider: 'CloudHighscoreEngine.refreshDashboard', version: VERSION });
        return true;
      }
    } catch (e2) {}
    emit('missing', { reason: reason || 'highscore-entry', error: 'Highscore-UI nicht verfügbar', version: VERSION });
    return false;
  }

  function start(ctx) {
    var payload = (ctx && ctx.payload) || {};
    var reason = payload.action || payload.entry || payload.source || 'highscore-entry-module-phase3d';
    emit('beforeStart', { reason: reason, branch: ctx && ctx.branch ? ctx.branch.id : null, version: VERSION });
    return openHighscore(reason);
  }

  function stop(payload) {
    emit('stopped', { reason: payload && payload.reason ? payload.reason : 'switch', version: VERSION });
    return true;
  }

  var api = Object.freeze({ __version: VERSION, start: start, stop: stop, open: openHighscore });
  window.EGTHighscoreEntryModule = api;

  if (window.AppModuleHost && typeof AppModuleHost.register === 'function') {
    AppModuleHost.register({ id: 'highscore-entry', label: 'Highscore Entry', version: VERSION, branchAware: true, start: start, stop: stop });
  } else {
    console.warn('[EGTHighscoreEntryModule] AppModuleHost fehlt; Registrierung übersprungen.');
  }
})();
