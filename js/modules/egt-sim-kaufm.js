/* ════════════════════════════════════════════════════════════════
   egt-sim-kaufm.js — Phase 6 branchenspezifisches Simulationsmodul
   Zweck: Kaufmännisch / Verwaltung bekommt einen eigenen ModuleHost-Einstieg. Die fachliche
   Generator-/Result-Logik bleibt vorerst bewusst im stabilen App-Core.
   ════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var VERSION = 'G44.0-phase6';
  var MODULE_ID = 'sim-kaufm';
  var BRANCH_ID = 'kaufm';
  var LABEL = 'Kaufmännisch / Verwaltung';
  var MODE = 'bps';
  var SOURCE = 'phase5-sim-kaufm';
  var TAG_HINTS = ["kaufm", "buero", "wirtschaft", "din5008", "rabatt", "verwaltung"];

  function emit(name, detail) {
    var payload = detail || {};
    payload.version = payload.version || VERSION;
    payload.moduleId = payload.moduleId || MODULE_ID;
    payload.branch = payload.branch || BRANCH_ID;
    try { document.dispatchEvent(new CustomEvent('egt:module:' + MODULE_ID + ':' + name, { detail: payload })); } catch (e) {}
    try { if (window.AppEvents && typeof AppEvents.emit === 'function') AppEvents.emit('module:' + MODULE_ID + ':' + name, payload); } catch (e2) {}
  }

  function normalizeQuestion(raw) {
    var q = raw || {};
    return String(q.group || q.category || q.cat || q.id || '').toLowerCase() + ' ' +
      String((q.tags || []).join(' ')).toLowerCase() + ' ' +
      String(q.source || '').toLowerCase();
  }

  function bankStats() {
    var external = Array.isArray(window.QUESTION_BANK_EXTERNAL) ? window.QUESTION_BANK_EXTERNAL : [];
    var hits = external.filter(function (q) {
      var hay = normalizeQuestion(q);
      return TAG_HINTS.some(function (tag) { return hay.indexOf(String(tag).toLowerCase()) !== -1; });
    }).length;
    return { externalTotal: external.length, branchHits: hits, hints: TAG_HINTS.slice() };
  }

  function resolveQuestionProfile(mode, payload) {
    try {
      if (window.EGTBranchQuestionPools && typeof EGTBranchQuestionPools.resolve === 'function') {
        return EGTBranchQuestionPools.resolve(BRANCH_ID, mode || MODE, Object.assign({}, payload || {}, { moduleId: MODULE_ID, source: SOURCE }));
      }
    } catch (e) { emit('poolResolveWarning', { error: e && e.message ? e.message : String(e) }); }
    return { branch: BRANCH_ID, mode: mode || MODE, poolKey: 'legacy', source: SOURCE };
  }

  function buildConfig(payload) {
    payload = payload || {};
    var branchInfo = null;
    try { if (window.AppModuleHost && typeof AppModuleHost.setBranch === 'function') branchInfo = AppModuleHost.setBranch(BRANCH_ID); } catch (e) {}
    return {
      branch: BRANCH_ID,
      branchLabel: branchInfo && branchInfo.label ? branchInfo.label : LABEL,
      mode: payload.mode || MODE,
      title: payload.title || 'Kaufmännische BPS-Simulation',
      source: payload.source || SOURCE,
      moduleId: MODULE_ID,
      branchModule: true,
      bankStats: bankStats(),
      questionPoolProfile: resolveQuestionProfile(payload.mode || MODE, payload),
      startedBy: MODULE_ID
    };
  }

  function start(ctx) {
    var payload = (ctx && ctx.payload) || {};
    var cfg = buildConfig(payload);
    emit('beforeStart', cfg);

    try { if (window.AppModuleHost && typeof AppModuleHost.setBranch === 'function') AppModuleHost.setBranch(BRANCH_ID); } catch (e0) {}

    if (window.AppModuleHost && typeof AppModuleHost.startSimulation === 'function') {
      var hostCfg = AppModuleHost.startSimulation(Object.assign({}, cfg, { branch: BRANCH_ID, mode: cfg.mode, title: cfg.title, source: cfg.source }));
      emit('started', { config: hostCfg || cfg, bankStats: cfg.bankStats });
      return !!hostCfg;
    }

    try { if (window.App && typeof App.selectMode === 'function') App.selectMode(cfg.mode); } catch (e1) {}
    try { if (window.App && typeof App.prepareTest === 'function') { App.prepareTest(); emit('startedFallback', cfg); return true; } } catch (e2) { emit('error', { error: e2 && e2.message ? e2.message : String(e2) }); }
    emit('error', { error: 'AppModuleHost.startSimulation und App.prepareTest nicht verfügbar' });
    return false;
  }

  function stop(payload) {
    try { if (window.EGTSimulation && typeof EGTSimulation.abort === 'function') EGTSimulation.abort(MODULE_ID + '-stop'); } catch (e) {}
    emit('stopped', { reason: payload && payload.reason ? payload.reason : 'switch' });
    return true;
  }

  var api = Object.freeze({
    __version: VERSION,
    id: MODULE_ID,
    branch: BRANCH_ID,
    label: LABEL,
    mode: MODE,
    start: start,
    stop: stop,
    buildConfig: buildConfig,
    bankStats: bankStats,
    resolveQuestionProfile: resolveQuestionProfile
  });

  window['EGTSimKaufmModule'] = api;

  if (window.AppModuleHost && typeof AppModuleHost.register === 'function') {
    AppModuleHost.register({
      id: MODULE_ID,
      label: LABEL + ' Simulation',
      version: VERSION,
      branchAware: true,
      start: start,
      stop: stop,
      meta: { branch: BRANCH_ID, mode: MODE, source: SOURCE, type: 'branch-simulation' }
    });
  } else {
    console.warn('[EGTSimKaufmModule] AppModuleHost fehlt; Registrierung übersprungen.');
  }
})();
