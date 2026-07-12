/* ════════════════════════════════════════════════════════════════
   egt-coach-entry-module.js — Phase 3D Coach Entry Module
   Zweck: KI-Coach als eigene Entry-Grenze über AppModuleHost führen.
   Die vorhandene EGTLearningCoach-Logik bleibt unverändert.
   ════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var VERSION = 'G41.3-phase3d';

  function emit(name, detail) {
    try { document.dispatchEvent(new CustomEvent('egt:module:coach-entry:' + name, { detail: detail || {} })); } catch (e) {}
    try { if (window.AppEvents && typeof AppEvents.emit === 'function') AppEvents.emit('module:coach-entry:' + name, detail || {}); } catch (e2) {}
  }

  function openCoach(reason) {
    try {
      if (window.EGTLearningCoach && typeof EGTLearningCoach.openHub === 'function') {
        EGTLearningCoach.openHub();
        emit('opened', { reason: reason || 'coach-entry', provider: 'EGTLearningCoach.openHub', version: VERSION });
        return true;
      }
      if (window.EGTLearningCoach && typeof EGTLearningCoach.open === 'function') {
        EGTLearningCoach.open();
        emit('opened', { reason: reason || 'coach-entry', provider: 'EGTLearningCoach.open', version: VERSION });
        return true;
      }
    } catch (e) {
      emit('error', { reason: reason || 'coach-entry', error: e && e.message ? e.message : String(e), version: VERSION });
      return true;
    }
    try {
      if (window.EGTUILayer && typeof EGTUILayer.openActionMenu === 'function') {
        var ok = EGTUILayer.openActionMenu('coach');
        emit('opened', { reason: reason || 'coach-entry', provider: 'EGTUILayer.openActionMenu', ok: !!ok, version: VERSION });
        return !!ok;
      }
    } catch (e2) {}
    emit('missing', { reason: reason || 'coach-entry', error: 'Coach-UI nicht verfügbar', version: VERSION });
    return false;
  }

  function start(ctx) {
    var payload = (ctx && ctx.payload) || {};
    var reason = payload.action || payload.entry || payload.source || 'coach-entry-module-phase3d';
    emit('beforeStart', { reason: reason, branch: ctx && ctx.branch ? ctx.branch.id : null, version: VERSION });
    return openCoach(reason);
  }

  function stop(payload) {
    emit('stopped', { reason: payload && payload.reason ? payload.reason : 'switch', version: VERSION });
    return true;
  }

  var api = Object.freeze({ __version: VERSION, start: start, stop: stop, open: openCoach });
  window.EGTCoachEntryModule = api;

  if (window.AppModuleHost && typeof AppModuleHost.register === 'function') {
    AppModuleHost.register({ id: 'coach-entry', label: 'Coach Entry', version: VERSION, branchAware: true, start: start, stop: stop });
  } else {
    console.warn('[EGTCoachEntryModule] AppModuleHost fehlt; Registrierung übersprungen.');
  }
})();
