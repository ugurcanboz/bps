/* ════════════════════════════════════════════════════════════════
   egt-analysis-entry-module.js — Phase 3D Analysis Entry Module
   Zweck: Analyse/Fortschritt als eigene Entry-Grenze über AppModuleHost
   führen. Die vorhandene App.showAnalysis-Logik bleibt unverändert.
   ════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var VERSION = 'G54.43.1-multiline-chart-binding';

  function emit(name, detail) {
    try { document.dispatchEvent(new CustomEvent('egt:module:analysis-entry:' + name, { detail: detail || {} })); } catch (e) {}
    try { if (window.AppEvents && typeof AppEvents.emit === 'function') AppEvents.emit('module:analysis-entry:' + name, detail || {}); } catch (e2) {}
  }

  function openAnalysis(reason) {
    /* G54.42.6 · Analyse Legacy-Restpfad Fix
       Der Bottom-Menüpunkt „Analyse“ darf nicht mehr auf die alte Legacy-Seite
       #analysis springen. Diese Seite wirkt im iPhone-Hochformat wie ein
       unfertiger Screen: Emoji-Titel, kein Bottom-Menü, keine moderne Shell.
       Deshalb wird Analyse jetzt konsequent über das bestehende moderne
       Deep-Sheet-Fundament geöffnet. App.showAnalysis bleibt als Not-Fallback,
       aber nicht mehr als Primärziel. */
    try {
      if (window.EGTUILayer && typeof EGTUILayer.openActionMenu === 'function') {
        var ok = EGTUILayer.openActionMenu('analysis');
        emit('opened', { reason: reason || 'analysis-entry', provider: 'EGTUILayer.openActionMenu(analysis)', ok: !!ok, version: VERSION });
        if (ok) return true;
      }
    } catch (e0) {
      emit('error', { reason: reason || 'analysis-entry', provider: 'EGTUILayer.openActionMenu(analysis)', error: e0 && e0.message ? e0.message : String(e0), version: VERSION });
    }
    try {
      if (window.EGTUILayer && typeof EGTUILayer.openActionMenu === 'function') {
        var ok2 = EGTUILayer.openActionMenu('progress');
        emit('opened', { reason: reason || 'analysis-entry', provider: 'EGTUILayer.openActionMenu(progress)', ok: !!ok2, version: VERSION });
        if (ok2) return true;
      }
    } catch (e1) {}
    try {
      if (window.App && typeof App.showAnalysis === 'function') {
        App.showAnalysis();
        emit('opened', { reason: reason || 'analysis-entry', provider: 'App.showAnalysis-fallback', version: VERSION });
        return true;
      }
    } catch (e2) {
      emit('error', { reason: reason || 'analysis-entry', error: e2 && e2.message ? e2.message : String(e2), version: VERSION });
      return true;
    }
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
