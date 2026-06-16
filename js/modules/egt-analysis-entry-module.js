/* ════════════════════════════════════════════════════════════════
   egt-analysis-entry-module.js — Phase 3D Analysis Entry Module
   Zweck: Analyse/Fortschritt als eigene Entry-Grenze über AppModuleHost
   führen. Die vorhandene App.showAnalysis-Logik bleibt unverändert.
   ════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var VERSION = 'G41.3-phase3d';

  function emit(name, detail) {
    try { document.dispatchEvent(new CustomEvent('egt:module:analysis-entry:' + name, { detail: detail || {} })); } catch (e) {}
    try { if (window.AppEvents && typeof AppEvents.emit === 'function') AppEvents.emit('module:analysis-entry:' + name, detail || {}); } catch (e2) {}
  }

  function openAnalysis(reason) {
    try {
      if (window.App && typeof App.showAnalysis === 'function') {
        App.showAnalysis();
        emit('opened', { reason: reason || 'analysis-entry', provider: 'App.showAnalysis', version: VERSION });
        return true;
      }
    } catch (e) {
      emit('error', { reason: reason || 'analysis-entry', error: e && e.message ? e.message : String(e), version: VERSION });
      return true;
    }
    try {
      if (window.EGTUILayer && typeof EGTUILayer.openActionMenu === 'function') {
        var ok = EGTUILayer.openActionMenu('progress');
        emit('opened', { reason: reason || 'analysis-entry', provider: 'EGTUILayer.openActionMenu(progress)', ok: !!ok, version: VERSION });
        return !!ok;
      }
    } catch (e2) {}
    emit('missing', { reason: reason || 'analysis-entry', error: 'Analyse-UI nicht verfügbar', version: VERSION });
    return false;
  }

  function start(ctx) {
    var payload = (ctx && ctx.payload) || {};
    var reason = payload.action || payload.entry || payload.source || 'analysis-entry-module-phase3d';
    emit('beforeStart', { reason: reason, branch: ctx && ctx.branch ? ctx.branch.id : null, version: VERSION });
    return openAnalysis(reason);
  }

  function stop(payload) {
    emit('stopped', { reason: payload && payload.reason ? payload.reason : 'switch', version: VERSION });
    return true;
  }

  var api = Object.freeze({ __version: VERSION, start: start, stop: stop, open: openAnalysis });
  window.EGTAnalysisEntryModule = api;

  if (window.AppModuleHost && typeof AppModuleHost.register === 'function') {
    AppModuleHost.register({ id: 'analysis-entry', label: 'Analysis Entry', version: VERSION, branchAware: true, start: start, stop: stop });
  } else {
    console.warn('[EGTAnalysisEntryModule] AppModuleHost fehlt; Registrierung übersprungen.');
  }
})();
