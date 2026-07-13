/* ════════════════════════════════════════════════════════════════
   module-host.js — Phase 3 Shell/ModuleHost Contract
   Ziel: Shell, ModuleHost und Fachmodule bekommen einen klaren Vertrag.
   Phase 3 startet bewusst klein: Branch-Kontext + Modul-Lifecycle +
   kontrollierter Simulationseinstieg, ohne App-Core neu zu schreiben.
   ════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  if (window.AppModuleHost && window.AppModuleHost.__version === 'G45.0-phase7') return;

  var VERSION = 'G45.0-phase7';
  var BRANCH_KEY = 'assessments_branch';
  var modules = Object.create(null);
  var activeModule = null;
  var lastStart = null;
  var listeners = Object.create(null);

  var BRANCHES = Object.freeze({
    it: Object.freeze({
      id: 'it',
      label: 'IT / FISI',
      icon: '💻',
      simulationMode: 'novuraExams',
      simulationTitle: 'IT/FISI Eignungstest-Simulation',
      moduleId: 'sim-it',
      questionPoolProfile: 'it',
      modules: Object.freeze(['sim-it','simulation','it','netzwerk','hardware_os','logik','matrizen','mathe','englisch','konzentration'])
    }),
    kaufm: Object.freeze({
      id: 'kaufm',
      label: 'Kaufmännisch / Verwaltung',
      icon: '💼',
      simulationMode: 'assessments',
      simulationTitle: 'Kaufmännische Novura Assessments',
      moduleId: 'sim-kaufm',
      questionPoolProfile: 'kaufm',
      modules: Object.freeze(['sim-kaufm','simulation','kaufmRechnen','bueroWissen','wirtschaft','din5008','kommunikation','deutsch','konzentration','logik'])
    }),
    sozial: Object.freeze({
      id: 'sozial',
      label: 'Sozialpädagogik',
      icon: '🤝',
      simulationMode: 'assessments',
      simulationTitle: 'Sozialpädagogik Novura Assessments',
      moduleId: 'sim-sozial',
      questionPoolProfile: 'sozial',
      modules: Object.freeze(['sim-sozial','simulation','paedagogik','entwicklung_bindung','situationen','kommunikation_sozial','recht_sozial','doku_beobachtung','deutsch','konzentration'])
    }),
    wissen: Object.freeze({
      id: 'wissen',
      label: 'Allgemeinwissen',
      icon: '🌐',
      simulationMode: 'jogging',
      simulationTitle: 'Allgemeiner Eignungstest-Jogginglauf',
      questionPoolProfile: 'wissen',
      modules: Object.freeze(['simulation','wissen','deutsch','englisch','logik','mathe','konzentration'])
    })
  });

  function clone(value) {
    try { return JSON.parse(JSON.stringify(value)); } catch (e) { return value; }
  }

  function nowIso() {
    try { return new Date().toISOString(); } catch (e) { return String(Date.now()); }
  }

  function emit(name, detail) {
    var payload = detail || {};
    try {
      (listeners[name] || []).slice().forEach(function (fn) {
        try { fn(payload); } catch (err) { console.warn('[AppModuleHost] listener failed:', name, err); }
      });
    } catch (e) {}
    try { document.dispatchEvent(new CustomEvent('egt:modulehost:' + name, { detail: payload })); } catch (e2) {}
    try { if (window.AppEvents && typeof AppEvents.emit === 'function') AppEvents.emit('modulehost:' + name, payload); } catch (e3) {}
  }

  function on(name, fn) {
    if (!name || typeof fn !== 'function') return function () {};
    if (!listeners[name]) listeners[name] = [];
    listeners[name].push(fn);
    return function () {
      listeners[name] = (listeners[name] || []).filter(function (item) { return item !== fn; });
    };
  }

  function normalizeBranch(branch) {
    var key = String(branch || '').trim().toLowerCase();
    if (BRANCHES[key]) return key;
    try {
      key = String(localStorage.getItem(BRANCH_KEY) || '').trim().toLowerCase();
      if (BRANCHES[key]) return key;
    } catch (e) {}
    return 'it';
  }

  function setBranch(branch) {
    var key = normalizeBranch(branch);
    try { localStorage.setItem(BRANCH_KEY, key); } catch (e) {}
    try { if (window.AppState) AppState.set({ activeBranch: key }); } catch (e2) {}
    emit('branch:changed', { branch: key, branchInfo: clone(BRANCHES[key]) });
    return clone(BRANCHES[key]);
  }

  function getBranch(branch) {
    var key = normalizeBranch(branch);
    return clone(BRANCHES[key]);
  }

  function listBranches() {
    return Object.keys(BRANCHES).map(function (key) { return clone(BRANCHES[key]); });
  }

  function register(definition) {
    if (!definition || !definition.id) return false;
    var id = String(definition.id);
    modules[id] = Object.assign({ id: id, enabled: true, version: VERSION, start: null, stop: null, destroy: null }, definition);
    emit('module:registered', { id: id, module: safeModuleInfo(modules[id]) });
    return true;
  }

  function safeModuleInfo(mod) {
    if (!mod) return null;
    return { id: mod.id, label: mod.label || mod.id, enabled: mod.enabled !== false, version: mod.version || '', branchAware: !!mod.branchAware };
  }

  function listModules() {
    return Object.keys(modules).map(function (id) { return safeModuleInfo(modules[id]); });
  }

  function buildContext(payload) {
    var raw = payload && typeof payload === 'object' ? payload : {};
    var branch = setBranch(raw.branch || raw.branchId || null);
    return Object.freeze({
      version: VERSION,
      branch: branch,
      payload: clone(raw),
      App: window.App || null,
      events: window.AppEvents || null,
      state: window.AppState || null,
      simulation: window.EGTSimulation || null,
      createdAt: nowIso()
    });
  }

  function stopActive(reason) {
    if (!activeModule) return true;
    var mod = modules[activeModule];
    try { if (mod && typeof mod.stop === 'function') mod.stop({ reason: reason || 'switch', at: nowIso() }); } catch (e) { console.warn('[AppModuleHost] stop failed:', activeModule, e); }
    emit('module:stopped', { id: activeModule, reason: reason || 'switch' });
    activeModule = null;
    return true;
  }

  function startModule(id, payload) {
    id = String(id || '');
    if (!id) return false;
    var mod = modules[id];
    var ctx = buildContext(payload || {});
    if (!mod) {
      emit('module:missing', { id: id, context: clone(ctx) });
      return false;
    }
    if (mod.enabled === false) {
      emit('module:disabled', { id: id, context: clone(ctx) });
      return false;
    }
    stopActive('switch-to-' + id);
    activeModule = id;
    lastStart = { id: id, branch: ctx.branch.id, at: nowIso(), payload: clone(payload || {}) };
    emit('module:beforeStart', { id: id, context: clone(ctx) });
    try {
      if (typeof mod.start === 'function') mod.start(ctx);
      emit('module:started', { id: id, context: clone(ctx) });
      return true;
    } catch (e) {
      activeModule = null;
      emit('module:error', { id: id, error: e && e.message ? e.message : String(e), context: clone(ctx) });
      throw e;
    }
  }

  function simulationModeForBranch(branchId, preferredMode) {
    var branch = getBranch(branchId);
    var mode = String(preferredMode || branch.simulationMode || 'novuraExams');
    return mode;
  }

  function resolveQuestionProfile(branch, mode, opts) {
    try {
      if (window.EGTBranchQuestionPools && typeof EGTBranchQuestionPools.resolve === 'function') {
        return EGTBranchQuestionPools.resolve(branch && branch.id ? branch.id : branch, mode, opts || {});
      }
    } catch (e) { console.warn('[AppModuleHost] question profile resolve failed:', e); }
    return { branch: branch && branch.id ? branch.id : String(branch || 'it'), mode: mode || 'novuraExams', poolKey: 'legacy', source: 'module-host-fallback' };
  }

  function buildSimulationConfig(options) {
    var opts = options && typeof options === 'object' ? options : {};
    var branch = setBranch(opts.branch || opts.branchId || null);
    var mode = simulationModeForBranch(branch.id, opts.mode);
    return {
      moduleId: opts.moduleId || branch.moduleId || 'simulation',
      branchModule: !!opts.branchModule,
      branch: branch.id,
      branchLabel: branch.label,
      questionPoolProfile: resolveQuestionProfile(branch, mode, opts),
      mode: mode,
      title: opts.title || branch.simulationTitle || 'Eignungstest-Simulation',
      source: opts.source || 'module-host-phase3',
      startedAt: nowIso(),
      raw: clone(opts)
    };
  }

  function startSimulation(options) {
    var cfg = buildSimulationConfig(options || {});
    lastStart = { id: 'simulation', branch: cfg.branch, mode: cfg.mode, at: nowIso(), payload: clone(cfg) };
    emit('simulation:beforeStart', clone(cfg));
    try { window.EGT_ACTIVE_QUESTION_PROFILE = clone(cfg.questionPoolProfile || null); } catch (e0) {}
    if (window.App && typeof App.selectMode === 'function') App.selectMode(cfg.mode);
    if (window.App && typeof App.prepareTest === 'function') {
      App.prepareTest();
      emit('simulation:started', clone(cfg));
      return cfg;
    }
    emit('simulation:error', { config: clone(cfg), error: 'App.prepareTest nicht verfügbar' });
    return null;
  }

  function getStatus() {
    return {
      version: VERSION,
      activeModule: activeModule,
      currentBranch: normalizeBranch(),
      lastStart: clone(lastStart),
      modules: listModules(),
      branches: listBranches()
    };
  }

  register({
    id: 'simulation',
    label: 'Simulation',
    version: VERSION,
    branchAware: true,
    start: function (ctx) { return startSimulation({ branch: ctx.branch.id, source: 'module-host-lifecycle' }); },
    stop: function () { try { if (window.EGTSimulation && typeof EGTSimulation.abort === 'function') EGTSimulation.abort('modulehost-stop'); } catch (e) {} }
  });

  window.AppModuleHost = Object.freeze({
    __version: VERSION,
    register: register,
    startModule: startModule,
    stopActive: stopActive,
    setBranch: setBranch,
    getBranch: getBranch,
    listBranches: listBranches,
    listModules: listModules,
    buildSimulationConfig: buildSimulationConfig,
    resolveQuestionProfile: resolveQuestionProfile,
    startSimulation: startSimulation,
    getStatus: getStatus,
    on: on
  });
})();
