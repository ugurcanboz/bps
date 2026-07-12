/* ════════════════════════════════════════════════════════════════
   highscore-duel-sheet-router-engine.js — G52.4 / Phase 18
   Zweck: Highscore-/Duell-Sheet-Routing als eigene Routing-Grenze.
   Die Engine entscheidet zentral, ob Highscore als Hauptbereich,
   Deep-Sheet oder Cloud-Refresh geöffnet wird und ob Duell als Hub
   oder direktes Setup startet.
   ════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var VERSION = 'G52.4-phase18';
  var PERIOD_KEYS = { daily: true, weekly: true, monthly: true, all: true, today: true, week: true, month: true, global: true };
  var PERIOD_ALIAS = { today: 'daily', week: 'weekly', month: 'monthly', global: 'all' };
  var HIGH_SCORE_TAB_FOR_PERIOD = { daily: 'today', weekly: 'week', monthly: 'month', all: 'all' };

  function emit(name, detail) {
    var payload = detail || {};
    payload.version = payload.version || VERSION;
    try { document.dispatchEvent(new CustomEvent('egt:highscore-duel-router:' + name, { detail: payload })); } catch (e) {}
    try { if (window.AppEvents && typeof AppEvents.emit === 'function') AppEvents.emit('highscore-duel-router:' + name, payload); } catch (e2) {}
  }

  function normalizePeriod(period) {
    var key = String(period || 'all').trim();
    key = PERIOD_ALIAS[key] || key;
    return PERIOD_KEYS[key] ? key : 'all';
  }

  function safeCall(fn, fallback) {
    try { return typeof fn === 'function' ? fn() : fallback; } catch (e) { return fallback; }
  }

  function createFallback() {
    var lastRoute = { area: 'none', period: 'all', ts: 0 };
    var api = {
      __version: VERSION,
      __provider: 'fallback',
      normalizePeriod: normalizePeriod,
      diagnostics: function () { return { ok: false, provider: 'fallback', version: VERSION, missing: ['app.js-router-deps'] }; },
      current: function () { return Object.assign({}, lastRoute); },
      openHighscoreSheet: function (options) {
        options = options || {};
        lastRoute = { area: 'highscore', period: normalizePeriod(options.period), ts: Date.now(), reason: options.reason || 'fallback' };
        try {
          if (window.EGTUILayer && typeof EGTUILayer.openHighscoreSheet === 'function' && options.preferLayer !== false) {
            EGTUILayer.openHighscoreSheet();
            emit('open-highscore', { provider: 'fallback-EGTUILayer', period: lastRoute.period, reason: lastRoute.reason });
            return true;
          }
        } catch (e) {}
        try { if (window.CloudHighscoreEngine && typeof CloudHighscoreEngine.refreshDashboard === 'function') CloudHighscoreEngine.refreshDashboard(options.reason || 'router-fallback'); } catch (e2) {}
        emit('open-highscore', { provider: 'fallback-refresh', period: lastRoute.period, reason: lastRoute.reason });
        return true;
      },
      openDuelSheet: function (options) {
        options = options || {};
        lastRoute = { area: 'duel', period: 'all', ts: Date.now(), reason: options.reason || 'fallback', direct: !!options.direct };
        try {
          if (!options.direct && window.EGTUILayer && typeof EGTUILayer.openDuelSheet === 'function') {
            EGTUILayer.openDuelSheet();
            emit('open-duel', { provider: 'fallback-EGTUILayer', direct: false, reason: lastRoute.reason });
            return true;
          }
          if (window.App && typeof App.openDuellSetup === 'function') {
            App.openDuellSetup();
            emit('open-duel', { provider: 'fallback-App.openDuellSetup', direct: !!options.direct, reason: lastRoute.reason });
            return true;
          }
        } catch (e) {}
        emit('open-duel-missing', { reason: lastRoute.reason, direct: !!options.direct });
        return false;
      },
      routeTopTab: function () { return false; },
      routeSection: function () { return false; },
      handleDataAction: function () { return false; }
    };
    return api;
  }

  function create(deps) {
    deps = deps || {};
    var state = deps.state || {};
    var lastRoute = { area: 'none', period: 'all', ts: 0 };

    function refreshUi() {
      safeCall(deps.renderModes, null);
      try { if (window.EGTUILayer && typeof EGTUILayer.refresh === 'function') EGTUILayer.refresh(); } catch (e) {}
    }

    function setHighscoreState(period, reason) {
      period = normalizePeriod(period);
      state.activeAppSection = 'highscore';
      state.activeTopTab = HIGH_SCORE_TAB_FOR_PERIOD[period] || 'all';
      lastRoute = { area: 'highscore', period: period, ts: Date.now(), reason: reason || 'set-highscore-state' };
      return lastRoute;
    }

    function openHighscoreSheet(options) {
      options = options || {};
      var route = setHighscoreState(options.period, options.reason || 'open-highscore-sheet');
      try {
        if (deps.CloudHighscoreEngine && typeof deps.CloudHighscoreEngine.setPeriod === 'function') {
          deps.CloudHighscoreEngine.setPeriod(route.period);
        } else if (deps.CloudHighscoreEngine && typeof deps.CloudHighscoreEngine.refreshDashboard === 'function') {
          deps.CloudHighscoreEngine.refreshDashboard(options.reason || 'router-highscore-refresh');
        }
      } catch (cloudError) {
        emit('cloud-error', { area: 'highscore', error: cloudError && cloudError.message ? cloudError.message : String(cloudError) });
      }
      refreshUi();
      if (options.sheet === true || options.preferLayer === true) {
        try {
          if (window.EGTUILayer && typeof EGTUILayer.openHighscoreSheet === 'function') {
            EGTUILayer.openHighscoreSheet();
            emit('open-highscore', { provider: 'EGTUILayer.openHighscoreSheet', period: route.period, reason: route.reason, sheet: true });
            return true;
          }
        } catch (layerError) {
          emit('layer-error', { area: 'highscore', error: layerError && layerError.message ? layerError.message : String(layerError) });
        }
      }
      emit('open-highscore', { provider: 'section', period: route.period, reason: route.reason, sheet: false });
      return true;
    }

    function openDuelSheet(options) {
      options = options || {};
      var direct = options.direct === true || options.action === 'duel-mode';
      state.activeAppSection = 'highscore';
      state.activeTopTab = state.activeTopTab || 'all';
      lastRoute = { area: 'duel', period: 'all', ts: Date.now(), reason: options.reason || options.action || 'open-duel-sheet', direct: direct };
      refreshUi();
      try {
        if (!direct && window.EGTUILayer && typeof EGTUILayer.openDuelSheet === 'function') {
          EGTUILayer.openDuelSheet();
          emit('open-duel', { provider: 'EGTUILayer.openDuelSheet', direct: false, reason: lastRoute.reason });
          return true;
        }
      } catch (layerError) {
        emit('layer-error', { area: 'duel', error: layerError && layerError.message ? layerError.message : String(layerError) });
      }
      try {
        if (deps.DuellRuntimeEngine && typeof deps.DuellRuntimeEngine.openSetup === 'function') {
          deps.DuellRuntimeEngine.openSetup();
          emit('open-duel', { provider: 'DuellRuntimeEngine.openSetup', direct: direct, reason: lastRoute.reason });
          return true;
        }
      } catch (runtimeError) {
        emit('runtime-error', { area: 'duel', error: runtimeError && runtimeError.message ? runtimeError.message : String(runtimeError) });
      }
      try {
        if (window.App && typeof App.openDuellSetup === 'function') {
          App.openDuellSetup();
          emit('open-duel', { provider: 'App.openDuellSetup', direct: direct, reason: lastRoute.reason });
          return true;
        }
      } catch (appError) {}
      emit('open-duel-missing', { direct: direct, reason: lastRoute.reason });
      return false;
    }

    function routeTopTab(section, tab) {
      if (!tab || !tab.action) return false;
      if (section === 'highscore' && tab.action === 'highscore') {
        return openHighscoreSheet({ period: tab.period || 'all', reason: 'top-tab:' + (tab.key || tab.period || 'highscore'), sheet: false });
      }
      if (tab.action === 'duel-hub') {
        return openDuelSheet({ reason: 'top-tab:duel-hub', direct: false });
      }
      if (tab.action === 'duel-mode') {
        return openDuelSheet({ reason: 'top-tab:duel-mode', direct: true });
      }
      return false;
    }

    function routeSection(section, options) {
      options = options || {};
      if (section === 'highscore') return openHighscoreSheet({ period: options.period || 'all', reason: options.reason || 'section:highscore', sheet: false });
      if (section === 'duel' || section === 'duell') return openDuelSheet({ reason: options.reason || 'section:duel', direct: !!options.direct });
      return false;
    }

    function handleDataAction(action, target) {
      if (!action) return false;
      if (action === 'hs-period') return openHighscoreSheet({ period: target && target.getAttribute ? target.getAttribute('data-period') : 'all', reason: 'data-action:hs-period', sheet: false });
      if (action === 'cloud-refresh') {
        try { if (deps.CloudHighscoreEngine && typeof deps.CloudHighscoreEngine.refreshDashboard === 'function') deps.CloudHighscoreEngine.refreshDashboard('router-cloud-refresh'); } catch (e) {}
        emit('cloud-refresh', { reason: 'data-action:cloud-refresh' });
        return true;
      }
      if (action === 'cloud-health-check') {
        try { if (deps.CloudHighscoreEngine && typeof deps.CloudHighscoreEngine.refreshDashboard === 'function') deps.CloudHighscoreEngine.refreshDashboard('cloud-health-check'); } catch (e) {}
        emit('cloud-refresh', { reason: 'data-action:cloud-health-check' });
        return true;
      }
      if (action === 'hs-show-more') { try { if (deps.CloudHighscoreEngine && typeof deps.CloudHighscoreEngine.showMore === 'function') deps.CloudHighscoreEngine.showMore(); } catch (e) {} return true; }
      if (action === 'hs-profile-info') { try { if (window.EGTAuthProfileShell && typeof EGTAuthProfileShell.openProfile === 'function') EGTAuthProfileShell.openProfile(); else if (typeof deps.showFrameworkHealth === 'function') deps.showFrameworkHealth(); } catch (e) {} return true; }
      if (action === 'hs-challenges-info') { try { if (window.EGTUILayer && typeof EGTUILayer.notice === 'function') EGTUILayer.notice('Highscore-Herausforderungen sind aus Rang, Punkten und Streak berechnet.'); } catch (e) {} return true; }
      if (action === 'hs-class-info') { safeCall(deps.showFrameworkHealth, null); return true; }
      if (action === 'hs-player-preview') { try { if (window.EGTUILayer && typeof EGTUILayer.notice === 'function') EGTUILayer.notice('Teilnehmerdetails werden im Dozenten-/Adminbereich geführt.'); } catch (e) {} return true; }
      if (action === 'duel-hub') return openDuelSheet({ reason: 'data-action:duel-hub', direct: false });
      if (action === 'duel-mode') return openDuelSheet({ reason: 'data-action:duel-mode', direct: true });
      if (action === 'highscore-sheet') return openHighscoreSheet({ reason: 'data-action:highscore-sheet', sheet: true });
      return false;
    }

    var api = {
      __version: VERSION,
      __provider: 'core',
      normalizePeriod: normalizePeriod,
      diagnostics: function () {
        return {
          ok: true,
          provider: 'core',
          version: VERSION,
          lastRoute: Object.assign({}, lastRoute),
          hasCloud: !!deps.CloudHighscoreEngine,
          hasDuelRuntime: !!deps.DuellRuntimeEngine,
          hasDuelUI: !!deps.HighscoreDuelUIEngine
        };
      },
      current: function () { return Object.assign({}, lastRoute); },
      openHighscoreSheet: openHighscoreSheet,
      openDuelSheet: openDuelSheet,
      routeTopTab: routeTopTab,
      routeSection: routeSection,
      handleDataAction: handleDataAction
    };
    return api;
  }

  var fallback = createFallback();
  window.EGTHighscoreDuelSheetRouterEngine = { __version: VERSION, create: create, fallback: fallback };
  window.HighscoreDuelSheetRouterEngine = fallback;
})();
