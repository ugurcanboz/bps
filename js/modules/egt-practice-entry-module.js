/* ════════════════════════════════════════════════════════════════
   egt-practice-entry-module.js — Phase 3B Practice/Learn Entry Module
   Zweck: Üben/Lernen als echtes Entry-Modul registrieren. Das eigentliche
   Trainingsmenü bleibt vorerst im vorhandenen UI/App-Core.
   ════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var VERSION = 'G42.0-phase4';

  function emit(name, detail) {
    try { document.dispatchEvent(new CustomEvent('egt:module:practice-entry:' + name, { detail: detail || {} })); } catch (e) {}
    try { if (window.AppEvents && typeof AppEvents.emit === 'function') AppEvents.emit('module:practice-entry:' + name, detail || {}); } catch (e2) {}
  }

  function openPractice(mode, ctx) {
    var targetMode = mode === 'learn' ? 'learn' : 'practice';
    var branch = ctx && ctx.branch ? ctx.branch.id : null;
    try { if (window.EGTPracticeModule && typeof EGTPracticeModule.open === 'function') return EGTPracticeModule.open({ mode: targetMode, branch: branch, source: 'practice-entry-phase4' }); } catch (e0) {}
    try { if (window.AppModuleHost && typeof AppModuleHost.startModule === 'function' && window.EGTPracticeModule) return AppModuleHost.startModule('practice', { mode: targetMode, branch: branch, source: 'practice-entry-phase4' }); } catch (e00) {}
    try { if (window.EGTUILayer && typeof EGTUILayer.openPracticeMode === 'function') return EGTUILayer.openPracticeMode(targetMode); } catch (e) {}
    try { if (window.EGTUILayer && typeof EGTUILayer.openActionMenu === 'function') return EGTUILayer.openActionMenu(targetMode); } catch (e2) {}
    try { if (window.App && typeof App.setAppSection === 'function') { App.setAppSection('practice'); return true; } } catch (e3) {}
    return false;
  }

  function start(ctx) {
    var payload = (ctx && ctx.payload) || {};
    var mode = payload.mode === 'learn' || payload.entry === 'learn' ? 'learn' : 'practice';
    var ok = openPractice(mode, ctx);
    emit('started', { mode: mode, ok: ok, branch: ctx && ctx.branch ? ctx.branch.id : null, version: VERSION });
    return ok;
  }

  function stop(payload) {
    emit('stopped', { reason: payload && payload.reason ? payload.reason : 'switch', version: VERSION });
    return true;
  }

  var api = Object.freeze({ __version: VERSION, start: start, stop: stop, openPractice: openPractice });
  window.EGTPracticeEntryModule = api;

  if (window.AppModuleHost && typeof AppModuleHost.register === 'function') {
    AppModuleHost.register({
      id: 'practice-entry',
      label: 'Practice Entry',
      version: VERSION,
      branchAware: true,
      start: start,
      stop: stop
    });
  } else {
    console.warn('[EGTPracticeEntryModule] AppModuleHost fehlt; Registrierung übersprungen.');
  }
})();
