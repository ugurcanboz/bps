/* ════════════════════════════════════════════════════════════════
   egt-profile-entry-module.js — Phase 3C Profile/Auth Entry Module
   Zweck: Profil- und Auth-Aktionen als eigene Entry-Grenze über
   AppModuleHost führen. Die vorhandene AuthProfileShell bleibt Adapter.
   ════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var VERSION = 'G52.9-phase23';

  function emit(name, detail) {
    try { document.dispatchEvent(new CustomEvent('egt:module:profile-entry:' + name, { detail: detail || {} })); } catch (e) {}
    try { if (window.AppEvents && typeof AppEvents.emit === 'function') AppEvents.emit('module:profile-entry:' + name, detail || {}); } catch (e2) {}
  }

  function runProfileAction(action, sourceEl) {
    var targetAction = action || 'profile-open';
    try {
      if (window.ProfileAuthDomainEngine && typeof ProfileAuthDomainEngine.handleAction === 'function') {
        var handled = ProfileAuthDomainEngine.handleAction(targetAction, sourceEl || null);
        emit('handled', { action: targetAction, handled: !!handled, provider: 'ProfileAuthDomainEngine', version: VERSION });
        return !!handled;
      }
      if (window.EGTAuthProfileShell && typeof EGTAuthProfileShell.handleAction === 'function') {
        var handled2 = EGTAuthProfileShell.handleAction(targetAction, sourceEl || null);
        emit('handled', { action: targetAction, handled: !!handled2, provider: 'EGTAuthProfileShell-fallback', version: VERSION });
        return !!handled2;
      }
    } catch (e) {
      emit('error', { action: targetAction, error: e && e.message ? e.message : String(e), version: VERSION });
      return true;
    }
    emit('missing', { action: targetAction, error: 'ProfileAuthDomainEngine/EGTAuthProfileShell.handleAction nicht verfügbar', version: VERSION });
    return false;
  }

  function start(ctx) {
    var payload = (ctx && ctx.payload) || {};
    var action = payload.action || payload.entry || 'profile-open';
    emit('beforeStart', { action: action, branch: ctx && ctx.branch ? ctx.branch.id : null, version: VERSION });
    return runProfileAction(action, payload.sourceEl || null);
  }

  function stop(payload) {
    emit('stopped', { reason: payload && payload.reason ? payload.reason : 'switch', version: VERSION });
    return true;
  }

  var api = Object.freeze({ __version: VERSION, start: start, stop: stop, handleAction: runProfileAction });
  window.EGTProfileEntryModule = api;

  if (window.AppModuleHost && typeof AppModuleHost.register === 'function') {
    AppModuleHost.register({
      id: 'profile-entry',
      label: 'Profile Entry',
      version: VERSION,
      branchAware: false,
      start: start,
      stop: stop
    });
  } else {
    console.warn('[EGTProfileEntryModule] AppModuleHost fehlt; Registrierung übersprungen.');
  }
})();
