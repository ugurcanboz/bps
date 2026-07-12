/* ════════════════════════════════════════════════════════════════
   branch-question-pools.js — Phase 6 Branch QuestionPool Resolver
   Zweck: Fachrichtungen bekommen eine eigene Pool-/Generator-Grenze,
   ohne buildQuiz() komplett aus app.js zu reißen.
   ════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var VERSION = 'G45.0-phase7-compatible';

  if (window.EGTBranchQuestionPools && window.EGTBranchQuestionPools.__version === VERSION) return;

  var DEFAULT_PROFILE = Object.freeze({
    branch: 'wissen',
    label: 'Allgemeiner Pool',
    modeDefaults: Object.freeze({ jogging: 'general', assessments: 'general', novuraExams: 'it' }),
    aliases: Object.freeze(['bookGeneralKnowledge','knowledge','bookTextComprehension','english','logic','arithmetic','attention','codeCompare','focusScanner']),
    weights: Object.freeze({ common: 55, branch: 45 }),
    blocks: Object.freeze(['Allgemeinwissen','Mathe','Logik','Konzentration']),
    tags: Object.freeze(['wissen','allgemein','deutsch','englisch','logik','mathe']),
    guard: 'fallback-general'
  });

  var PROFILES = Object.freeze({
    it: Object.freeze({
      branch: 'it',
      label: 'IT / FISI QuestionPool',
      modeDefaults: Object.freeze({ novuraExams: 'it-novura-exams', assessments: 'it-assessments', jogging: 'it-jogging' }),
      aliases: Object.freeze(['bookIT','it','itScenario','novuraExamsMathSprint','bookTextMath','matrixBook','bookNumberSeries','bookVisualLogic','focusScanner','symbolSearch','tableComparePro','codeCompare','routeMemory','bigEDVMulti','bigEDVCovered']),
      weights: Object.freeze({ common: 35, branch: 65 }),
      blocks: Object.freeze(['Allgemeinwissen','Mathe','Logik','Konzentration','EDV Kenntnisse']),
      tags: Object.freeze(['it','fisi','netzwerk','hardware','software','security','osi','edv']),
      guard: 'branch-it-preserve-novuraExams-blocks'
    }),
    kaufm: Object.freeze({
      branch: 'kaufm',
      label: 'Kaufmännisch / Verwaltung QuestionPool',
      modeDefaults: Object.freeze({ assessments: 'kaufm-assessments', jogging: 'kaufm-jogging' }),
      aliases: Object.freeze(['bookKaufmRechnen','bookBueroWissen','bookTextMath','bookGeneralKnowledge','bookTextComprehension','opinionFact','attention','codeCompare','tableComparePro','focusScanner','series','statementLogic']),
      weights: Object.freeze({ common: 40, branch: 60 }),
      blocks: Object.freeze(['Kaufmännisches Rechnen','Bürowissen','Sprache/Wissen','Logik','Konzentration']),
      tags: Object.freeze(['kaufm','büro','buero','verwaltung','wirtschaft','din5008','rabatt','skonto']),
      guard: 'branch-kaufm-weighted-assessments'
    }),
    sozial: Object.freeze({
      branch: 'sozial',
      label: 'Sozialpädagogik QuestionPool',
      modeDefaults: Object.freeze({ assessments: 'sozial-assessments', jogging: 'sozial-jogging' }),
      aliases: Object.freeze(['bookPaedagogik','bookSituationen','bookTextComprehension','sentenceCompletion','bookGeneralKnowledge','opinionFact','statementLogic','attention','focusScanner','tableComparePro','series','knowledge']),
      weights: Object.freeze({ common: 42, branch: 58 }),
      blocks: Object.freeze(['Pädagogik','Situationen','Sprache/Wissen','Logik','Konzentration']),
      tags: Object.freeze(['sozial','pädagogik','paedagogik','entwicklung','bindung','beobachtung','dokumentation','kommunikation']),
      guard: 'branch-sozial-weighted-assessments'
    }),
    wissen: DEFAULT_PROFILE
  });

  function clone(value) {
    try { return JSON.parse(JSON.stringify(value)); } catch (e) { return value; }
  }

  function normalizeBranch(branch) {
    var key = String(branch || '').trim().toLowerCase();
    if (PROFILES[key]) return key;
    try {
      if (window.AppModuleHost && typeof AppModuleHost.getBranch === 'function') {
        var current = AppModuleHost.getBranch();
        key = String(current && current.id || '').trim().toLowerCase();
        if (PROFILES[key]) return key;
      }
    } catch (e) {}
    try {
      key = String(localStorage.getItem('assessments_branch') || '').trim().toLowerCase();
      if (PROFILES[key]) return key;
    } catch (e2) {}
    return 'wissen';
  }

  function resolve(branch, mode, options) {
    var key = normalizeBranch(branch);
    var profile = PROFILES[key] || DEFAULT_PROFILE;
    var selectedMode = String(mode || '').trim() || 'jogging';
    var raw = clone(profile);
    raw.mode = selectedMode;
    raw.poolKey = (profile.modeDefaults && profile.modeDefaults[selectedMode]) || (profile.modeDefaults && profile.modeDefaults.assessments) || 'general';
    raw.source = 'branch-question-pools-phase6';
    raw.resolvedAt = new Date().toISOString();
    raw.options = clone(options || {});
    return raw;
  }

  function list() {
    return Object.keys(PROFILES).map(function (key) { return clone(PROFILES[key]); });
  }

  function scoreQuestionForBranch(question, branch) {
    var profile = PROFILES[normalizeBranch(branch)] || DEFAULT_PROFILE;
    var hay = [
      question && question.group,
      question && question.cat,
      question && question.category,
      question && question.source,
      question && question.id,
      Array.isArray(question && question.tags) ? question.tags.join(' ') : ''
    ].join(' ').toLowerCase();
    return (profile.tags || []).reduce(function (score, tag) {
      return score + (hay.indexOf(String(tag).toLowerCase()) !== -1 ? 1 : 0);
    }, 0);
  }

  window.EGTBranchQuestionPools = Object.freeze({
    __version: VERSION,
    resolve: resolve,
    list: list,
    scoreQuestionForBranch: scoreQuestionForBranch
  });
})();
