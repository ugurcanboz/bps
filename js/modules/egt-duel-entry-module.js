/* ════════════════════════════════════════════════════════════════
   egt-duel-entry-module.js — Phase 3D Duel Entry Module
   Zweck: Duell-Bereich als eigene Entry-Grenze über AppModuleHost führen.
   Lokale/Online-Duell-Fachlogik bleibt in App/EGTUILayer unverändert.
   ════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var VERSION = 'G52.4-phase18';

  function emit(name, detail) {
    try { document.dispatchEvent(new CustomEvent('egt:module:duel-entry:' + name, { detail: detail || {} })); } catch (e) {}
    try { if (window.AppEvents && typeof AppEvents.emit === 'function') AppEvents.emit('module:duel-entry:' + name, detail || {}); } catch (e2) {}
  }

  function openDuel(reason, direct) {
    try {
      if (window.HighscoreDuelSheetRouterEngine && typeof HighscoreDuelSheetRouterEngine.openDuelSheet === 'function') {
        HighscoreDuelSheetRouterEngine.openDuelSheet({ reason: reason || 'duel-entry', direct: !!direct });
        emit('opened', { reason: reason || 'duel-entry', provider: 'HighscoreDuelSheetRouterEngine.openDuelSheet', direct: !!direct, version: VERSION });
        return true;
      }
    } catch (routerError) {
      emit('error', { reason: reason || 'duel-entry', error: routerError && routerError.message ? routerError.message : String(routerError), version: VERSION });
      return true;
    }
    try {
      if (!direct && window.EGTUILayer && typeof EGTUILayer.openDuelSheet === 'function') {
        EGTUILayer.openDuelSheet();
        emit('opened', { reason: reason || 'duel-entry', provider: 'EGTUILayer.openDuelSheet', direct: false, version: VERSION });
        return true;
      }
      if (window.App && typeof App.openDuellSetup === 'function') {
        App.openDuellSetup();
        emit('opened', { reason: reason || 'duel-entry', provider: 'App.openDuellSetup', direct: !!direct, version: VERSION });
        return true;
      }
    } catch (e) {
      emit('error', { reason: reason || 'duel-entry', error: e && e.message ? e.message : String(e), version: VERSION });
      return true;
    }
    emit('missing', { reason: reason || 'duel-entry', error: 'Duell-UI nicht verfügbar', version: VERSION });
    return false;
  }

  function start(ctx) {
    var payload = (ctx && ctx.payload) || {};
    var reason = payload.action || payload.entry || payload.source || 'duel-entry-module-phase3d';
    var direct = payload.direct === true || payload.action === 'duel-mode';
    emit('beforeStart', { reason: reason, direct: direct, branch: ctx && ctx.branch ? ctx.branch.id : null, version: VERSION });
    return openDuel(reason, direct);
  }

  function stop(payload) {
    emit('stopped', { reason: payload && payload.reason ? payload.reason : 'switch', version: VERSION });
    return true;
  }

  var api = Object.freeze({ __version: VERSION, start: start, stop: stop, open: openDuel });
  window.EGTDuelEntryModule = api;

  if (window.AppModuleHost && typeof AppModuleHost.register === 'function') {
    AppModuleHost.register({ id: 'duel-entry', label: 'Duel Entry', version: VERSION, branchAware: true, start: start, stop: stop });
  } else {
    console.warn('[EGTDuelEntryModule] AppModuleHost fehlt; Registrierung übersprungen.');
  }
})();
