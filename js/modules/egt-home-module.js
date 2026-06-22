/* ════════════════════════════════════════════════════════════════
   egt-home-module.js — Phase 3B Home Module Registration
   Zweck: Home nicht mehr nur als lose UI-Ansicht behandeln, sondern als
   echtes Shell-Modul über AppModuleHost registrieren.
   ════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var VERSION = 'G41.3-phase3d';

  function emit(name, detail) {
    try { document.dispatchEvent(new CustomEvent('egt:module:home:' + name, { detail: detail || {} })); } catch (e) {}
    try { if (window.AppEvents && typeof AppEvents.emit === 'function') AppEvents.emit('module:home:' + name, detail || {}); } catch (e2) {}
  }

  function refreshHomeShell() {
    try { if (window.App && typeof App.setAppSection === 'function') { App.setAppSection('home'); return true; } } catch (e) {}
    try { if (window.EGTUILayer && typeof EGTUILayer.switchTab === 'function') { EGTUILayer.switchTab('home'); return true; } } catch (e2) {}
    try { if (window.EGTUILayer && typeof EGTUILayer.refresh === 'function') EGTUILayer.refresh(); } catch (e3) {}
    return false;
  }

  function start(ctx) {
    var ok = refreshHomeShell();
    emit('started', { ok: ok, branch: ctx && ctx.branch ? ctx.branch.id : null, version: VERSION });
    return ok;
  }

  function stop(payload) {
    emit('stopped', { reason: payload && payload.reason ? payload.reason : 'switch', version: VERSION });
    return true;
  }

  var api = Object.freeze({ __version: VERSION, start: start, stop: stop });
  window.EGTHomeModule = api;

  if (window.AppModuleHost && typeof AppModuleHost.register === 'function') {
    AppModuleHost.register({
      id: 'home',
      label: 'Home',
      version: VERSION,
      branchAware: true,
      start: start,
      stop: stop
    });
  } else {
    console.warn('[EGTHomeModule] AppModuleHost fehlt; Registrierung übersprungen.');
  }
})();
