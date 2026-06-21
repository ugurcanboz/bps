/* ════════════════════════════════════════════════════════════════
   egt-simulation-entry-module.js — Phase 3B Simulation Entry Module
   Zweck: Simulationseinstieg als eigenes Modul registrieren. Die eigentliche
   Quiz-Erzeugung bleibt aktuell bewusst in app.js/EGTSimulation.
   ════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var VERSION = 'G43.0-phase5';

  function emit(name, detail) {
    try { document.dispatchEvent(new CustomEvent('egt:module:simulation-entry:' + name, { detail: detail || {} })); } catch (e) {}
    try { if (window.AppEvents && typeof AppEvents.emit === 'function') AppEvents.emit('module:simulation-entry:' + name, detail || {}); } catch (e2) {}
  }

  function openEntrySheet(ctx) {
    try {
      if (window.EGTUILayer && typeof EGTUILayer.openSheet === 'function') {
        var branch = ctx && ctx.branch ? ctx.branch : (window.AppModuleHost && AppModuleHost.getBranch ? AppModuleHost.getBranch() : null);
        return EGTUILayer.openSheet({
          id: 'simulation',
          label: 'Simulation',
          title: branch && branch.simulationTitle ? branch.simulationTitle : 'Simulation',
          kicker: branch && branch.label ? branch.label : 'Prüfung',
          desc: 'Branch-Kontext wird vom AppModuleHost gesetzt. Start läuft über SimulationEntry → AppModuleHost → EGTSimulation.',
          icon: branch && branch.icon ? branch.icon : '🎯',
          iconClass: 'c-indigo',
          startLabel: 'Simulation starten'
        });
      }
    } catch (e) {}
    return false;
  }

  function start(ctx) {
    var payload = (ctx && ctx.payload) || {};
    var direct = payload.direct === true || payload.directStart === true || payload.startNow === true;
    var branch = ctx && ctx.branch ? ctx.branch.id : (payload.branch || payload.branchId || 'it');
    emit('beforeStart', { direct: direct, branch: branch, version: VERSION });

    if (!direct && openEntrySheet(ctx)) {
      emit('opened', { branch: branch, version: VERSION });
      return true;
    }

    var branchModule = branch === 'it' ? 'sim-it' : (branch === 'kaufm' ? 'sim-kaufm' : (branch === 'sozial' ? 'sim-sozial' : ''));
    if (branchModule && !payload.skipBranchModule && window.AppModuleHost && typeof AppModuleHost.startModule === 'function') {
      var started = AppModuleHost.startModule(branchModule, {
        branch: branch,
        mode: payload.mode || null,
        source: 'simulation-entry-module-phase5'
      });
      emit('startedBranchModule', { branch: branch, moduleId: branchModule, started: started, version: VERSION });
      return !!started;
    }

    if (window.AppModuleHost && typeof AppModuleHost.startSimulation === 'function') {
      var cfg = AppModuleHost.startSimulation({
        branch: branch,
        mode: payload.mode || null,
        source: 'simulation-entry-module-phase5-fallback'
      });
      emit('started', { branch: branch, config: cfg, version: VERSION });
      return !!cfg;
    }

    emit('error', { branch: branch, error: 'AppModuleHost.startSimulation fehlt', version: VERSION });
    return false;
  }

  function stop(payload) {
    try { if (window.EGTSimulation && typeof EGTSimulation.abort === 'function') EGTSimulation.abort('simulation-entry-stop'); } catch (e) {}
    emit('stopped', { reason: payload && payload.reason ? payload.reason : 'switch', version: VERSION });
    return true;
  }

  var api = Object.freeze({ __version: VERSION, start: start, stop: stop, openEntrySheet: openEntrySheet });
  window.EGTSimulationEntryModule = api;

  if (window.AppModuleHost && typeof AppModuleHost.register === 'function') {
    AppModuleHost.register({
      id: 'simulation-entry',
      label: 'Simulation Entry',
      version: VERSION,
      branchAware: true,
      start: start,
      stop: stop
    });
  } else {
    console.warn('[EGTSimulationEntryModule] AppModuleHost fehlt; Registrierung übersprungen.');
  }
})();
