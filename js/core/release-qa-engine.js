/* ════════════════════════════════════════════════════════════════
   release-qa-engine.js — G53.1 / Phase 25
   Zweck: Finale App-Health-/Release-QA-Grenze.
   Diese Engine verändert keine Produktlogik. Sie sammelt nur belastbare
   technische und visuelle DOM-/Layout-Metriken für Release-Smoke-Tests.
   ════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  if (window.EGTReleaseQAEngine && window.EGTReleaseQAEngine.__ready) return;

  var VERSION = 'G53.1-phase25';
  var SCREEN_IDS = ['start', 'memory', 'blockIntro', 'quiz', 'result', 'analysis'];
  var CORE_GLOBALS = [
    'AppConfig', 'App', 'EGTSimulation',
    'EGTQuizBuildPipelineEngine', 'QuizBuildPipelineEngine',
    'EGTQuestionFlowEngine', 'QuestionFlowEngine',
    'EGTResultFlowEngine', 'ResultFlowEngine',
    'EGTHighscoreDashboardEngine',
    'EGTCloudHighscoreEngine', 'CloudHighscoreEngine',
    'EGTHighscoreDuelUIEngine', 'HighscoreDuelUIEngine',
    'EGTDuellRuntimeEngine', 'DuellRuntimeEngine',
    'EGTHighscoreDuelSheetRouterEngine', 'HighscoreDuelSheetRouterEngine',
    'EGTAdminPortalDomainEngine', 'AdminPortalDomainEngine',
    'EGTProfileAuthDomainEngine', 'ProfileAuthDomainEngine',
    'EGTCoachAnalysisDomainEngine', 'CoachAnalysisDomainEngine'
  ];

  function safe(fn, fallback) {
    try { return typeof fn === 'function' ? fn() : fallback; }
    catch (e) { return fallback; }
  }

  function visible(el) {
    if (!el) return false;
    var cs = getComputedStyle(el);
    if (el.hidden || el.getAttribute('aria-hidden') === 'true') return false;
    if (cs.display === 'none' || cs.visibility === 'hidden' || Number(cs.opacity || 1) === 0) return false;
    var r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  }

  function rectInfo(el) {
    if (!el) return null;
    var r = el.getBoundingClientRect();
    return { x: Math.round(r.x), y: Math.round(r.y), width: Math.round(r.width), height: Math.round(r.height) };
  }

  function overlap(a, b) {
    if (!a || !b) return false;
    return !(a.right <= b.left || b.right <= a.left || a.bottom <= b.top || b.bottom <= a.top);
  }

  function collectOverlap(selector) {
    var nodes = Array.prototype.slice.call(document.querySelectorAll(selector)).filter(visible);
    var pairs = [];
    for (var i = 0; i < nodes.length; i++) {
      for (var j = i + 1; j < nodes.length; j++) {
        var a = nodes[i].getBoundingClientRect();
        var b = nodes[j].getBoundingClientRect();
        if (overlap(a, b)) {
          pairs.push({
            a: nodes[i].id || nodes[i].className || nodes[i].tagName,
            b: nodes[j].id || nodes[j].className || nodes[j].tagName
          });
          if (pairs.length >= 10) return pairs;
        }
      }
    }
    return pairs;
  }

  function screenState() {
    return SCREEN_IDS.map(function (id) {
      var el = document.getElementById(id);
      return { id: id, visible: visible(el), rect: rectInfo(el) };
    });
  }

  function layoutMetrics() {
    var doc = document.documentElement;
    var body = document.body;
    var width = Math.max(doc ? doc.scrollWidth : 0, body ? body.scrollWidth : 0);
    var height = Math.max(doc ? doc.scrollHeight : 0, body ? body.scrollHeight : 0);
    var horizontalOverflow = Math.max(0, width - window.innerWidth);
    var activeScreens = screenState().filter(function (s) { return s.visible; }).map(function (s) { return s.id; });
    var quiz = document.getElementById('quiz');
    var result = document.getElementById('result');
    var qnav = document.getElementById('qnavDrawerToggle');
    return {
      viewport: { width: window.innerWidth, height: window.innerHeight, dpr: window.devicePixelRatio || 1 },
      document: { width: width, height: height },
      horizontalOverflow: horizontalOverflow,
      activeScreens: activeScreens,
      screens: screenState(),
      bodyClasses: document.body ? String(document.body.className || '') : '',
      quiz: {
        visible: visible(quiz),
        rect: rectInfo(quiz),
        answerButtons: Array.prototype.slice.call(document.querySelectorAll('#answers button, #answers .answer-card')).filter(visible).length,
        qnavButton: rectInfo(qnav)
      },
      result: {
        visible: visible(result),
        categoryCards: Array.prototype.slice.call(document.querySelectorAll('#categoryStats > *')).filter(visible).length
      },
      overlaps: {
        cards: collectOverlap('.mode-card, .category-card, .statcard, .score-card, .coach-panel, #categoryStats > *'),
        buttons: collectOverlap('button.btn, .btn, #answers button, .answer-card')
      }
    };
  }

  function globalsHealth() {
    var missing = CORE_GLOBALS.filter(function (name) { return !window[name]; });
    return { ok: missing.length === 0, missing: missing, total: CORE_GLOBALS.length, present: CORE_GLOBALS.length - missing.length };
  }

  function engineHealth() {
    var api = window.App && window.App._test ? window.App._test : {};
    var engines = [
      'QuizBuildPipelineEngine', 'QuestionFlowEngine', 'ResultFlowEngine', 'HighscoreEngine',
      'CloudHighscoreEngine', 'HighscoreDuelUIEngine', 'DuellRuntimeEngine',
      'HighscoreDuelSheetRouterEngine', 'AdminPortalDomainEngine', 'ProfileAuthDomainEngine',
      'CoachAnalysisDomainEngine'
    ];
    return engines.map(function (key) {
      var engine = api[key] || window[key];
      var diag = safe(function () { return engine && typeof engine.diagnostics === 'function' ? engine.diagnostics() : null; }, null);
      return { key: key, ok: !!engine, version: engine && (engine.__version || engine.version) || null, diagnostics: diag };
    });
  }

  function runHealth(label) {
    var layout = layoutMetrics();
    var globals = globalsHealth();
    var engines = engineHealth();
    var badEngines = engines.filter(function (e) { return !e.ok; });
    var cardOverlaps = layout.overlaps.cards.length;
    var buttonOverlaps = layout.overlaps.buttons.length;
    var ok = globals.ok && badEngines.length === 0 && layout.horizontalOverflow <= 2 && cardOverlaps === 0 && buttonOverlaps === 0;
    var summary = {
      ok: ok,
      version: VERSION,
      label: label || 'release-health',
      timestamp: new Date().toISOString(),
      appVersion: window.AppConfig && window.AppConfig.fullVersion || window.APP_VERSION || null,
      globals: globals,
      engines: engines,
      layout: layout,
      problems: {
        missingGlobals: globals.missing,
        missingEngines: badEngines.map(function (e) { return e.key; }),
        horizontalOverflow: layout.horizontalOverflow,
        cardOverlaps: cardOverlaps,
        buttonOverlaps: buttonOverlaps
      }
    };
    try { window.__EGT_RELEASE_QA_LAST__ = summary; } catch (e) {}
    try { if (window.AppEvents && typeof AppEvents.emit === 'function') AppEvents.emit('release-qa:health', summary); } catch (e2) {}
    return summary;
  }

  function create(deps) {
    deps = deps || {};
    return Object.freeze({
      __version: VERSION,
      __provider: 'release-qa-domain',
      diagnostics: function () { return runHealth('diagnostics'); },
      runHealth: runHealth,
      layoutMetrics: layoutMetrics,
      globalsHealth: globalsHealth,
      engineHealth: engineHealth,
      screenState: screenState
    });
  }

  window.EGTReleaseQAEngine = Object.freeze({ __ready: true, __version: VERSION, create: create });
})();
