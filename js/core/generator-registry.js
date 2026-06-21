/* ════════════════════════════════════════════════════════════════
   generator-registry.js — Phase 7 GeneratorRegistry / Pool Boundary
   Zweck: Generator-Pool-Definitionen aus app.js herausziehen und über
   eine stabile Resolver-API bereitstellen. app.js liefert nur noch die
   Generator-Funktionen, diese Registry entscheidet Pool, Branch-Gewicht
   und Metadaten. Fallbacks bleiben bewusst erhalten.
   ════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var VERSION = 'G45.0-phase7';
  if (window.EGTGeneratorRegistry && window.EGTGeneratorRegistry.__version === VERSION) return;

  var POOLS = Object.freeze({
    math: Object.freeze(['bpsMathTrainer']),
    logic: Object.freeze(['logic','bookSymbolArithmetic','bookStatementLogic','bookRatioLogic']),
    kaufmRechnen: Object.freeze(['bookKaufmRechnen']),
    bueroWissen: Object.freeze(['bookBueroWissen']),
    paedagogik: Object.freeze(['bookPaedagogik']),
    situationen: Object.freeze(['bookSituationen']),
    jogging: Object.freeze(['math','bookTextMath','logic','bookNumberSeries','bookVisualLogic','bookTextComprehension','bookGeneralKnowledge','knowledge','english','it','attention','codeCompare','focusScanner','symbolSearch','visualJump','numberScan','routeMemory','visualIQ']),
    bps: Object.freeze(['analogy','series','symbolSeries','spatial','net','belt','arithmetic','fraction','percentReverse','area','dreisatz','bookGeneralKnowledge','knowledge','english','it','attention','codeCompare','focusScanner','symbolSearch','tableScan','visualJump','errorSearch','numberScan','tableComparePro','opinionFact','routeMemory','visualIQ']),
    ctc: Object.freeze(['ctcMathSprint','bookTextMath','matrixBook','bookNumberSeries','bookVisualLogic','bookTextComprehension','series','matrix','gear','belt','arithmetic','percentReverse','fraction','dreisatz','attention','codeCompare','focusScanner','symbolSearch','tableScan','visualJump','errorSearch','numberScan','tableComparePro','statementLogic','spatial','analogy','english','it','opinionFact','fractionRuleEignungstest','tableCode','routeMemory','visualIQ']),
    general: Object.freeze(['bookGeneralKnowledge','knowledge']),
    english: Object.freeze(['english']),
    it: Object.freeze(['bookIT','it']),
    concentrationPro: Object.freeze(['focusScanner','symbolSearch','tableScan','visualJump','errorSearch','numberScan','tableComparePro','codeCompare','attention','pqStrike']),
    routeMemoryMode: Object.freeze(['routeMemory']),
    visualIQ: Object.freeze(['visualIQ','visualGearsPro','visualMirror','visualCubeRotation','visualFolding','visualMatrixIQ','visualCircuit','visualMechanicsPro','visualTechnical']),
    mathSprint: Object.freeze(['ctcMathSprint','bookTextMath','bookAlgebra','mul','div','percent','percentReverse','fraction','arithmetic','dreisatz','area']),
    logicSprint: Object.freeze(['matrixBook','bookNumberSeries','bookVisualLogic','bookSymbolArithmetic','bookStatementLogic','bookRatioLogic','series','matrix','symbolSeries','statementLogic','opinionFact','analogy']),
    concentrationSprint: Object.freeze(['focusScanner','symbolSearch','tableScan','visualJump','errorSearch','numberScan','tableComparePro','codeCompare','attention','pqStrike']),
    visualIQSprint: Object.freeze(['matrixBook','bookVisualLogic','visualIQ','visualGearsPro','visualMirror','visualCubeRotation','visualFolding','visualMatrixIQ','visualCircuit','visualMechanicsPro','visualTechnical']),
    itSprint: Object.freeze(['bookIT','it','itScenario']),
    knowledgeSprint: Object.freeze(['bookGeneralKnowledge','knowledge','sentenceCompletion','bookTextComprehension']),
    matrixOnlySprint: Object.freeze(['matrixBook','matrixBook','matrix','visualMatrixIQ']),
    sentenceSprint: Object.freeze(['sentenceCompletion']),
    numberSeriesBookSprint: Object.freeze(['bookNumberSeries']),
    textMathSprint: Object.freeze(['bookTextMath']),
    algebraSprint: Object.freeze(['bookAlgebra']),
    textComprehensionSprint: Object.freeze(['bookTextComprehension']),
    visualLogicBookSprint: Object.freeze(['bookVisualLogic']),
    symbolLogicSprint: Object.freeze(['bookSymbolArithmetic']),
    statementLogicSprint: Object.freeze(['bookStatementLogic']),
    ratioLogicSprint: Object.freeze(['bookRatioLogic']),
    generalKnowledgeBookSprint: Object.freeze(['bookGeneralKnowledge']),
    techniqueSprint: Object.freeze(['visualGearsPro','visualCircuit','visualMechanicsPro','visualTechnical','gear','belt','spatial','net']),
    errorTrainingPrep: Object.freeze(['matrixBook','ctcMathSprint','series','matrix','focusScanner','tableComparePro','visualIQ','it','knowledge','routeMemory'])
  });

  function clone(value) {
    try { return JSON.parse(JSON.stringify(value)); } catch (e) { return value; }
  }

  function createAliasMap(generators) {
    var g = generators || {};
    return {
      bpsMathTrainer: g.bpsMathTrainer,
      math: g.math, mul: g.mul, div: g.div, percent: g.percent, percentReverse: g.percentReverse,
      fraction: g.fraction, arithmetic: g.arithmetic, dreisatz: g.dreisatz, area: g.area,
      ctcMathSprint: g.ctcMathSprint, bookTextMath: g.bookTextMath, bookAlgebra: g.bookAlgebra,
      logic: g.logic, analogy: g.analogy, series: g.series, symbolSeries: g.symbolSeries,
      statementLogic: g.statementLogic, opinionFact: g.opinionFact, matrix: g.matrix,
      matrixBook: g.matrixBook, bookNumberSeries: g.bookNumberSeries, bookVisualLogic: g.bookVisualLogic,
      bookSymbolArithmetic: g.bookSymbolArithmetic, bookStatementLogic: g.bookStatementLogic, bookRatioLogic: g.bookRatioLogic,
      spatial: g.spatial, net: g.net, belt: g.belt, gear: g.gear,
      bookGeneralKnowledge: g.bookGeneralKnowledge, knowledge: g.knowledge, english: g.english,
      sentenceCompletion: g.sentenceCompletion, bookTextComprehension: g.bookTextComprehension,
      bookIT: g.bookIT, it: g.it, itScenario: g.itScenario,
      focusScanner: g.focusScanner, symbolSearch: g.symbolSearch, tableScan: g.tableScan,
      visualJump: g.visualJump, errorSearch: g.errorSearch, numberScan: g.numberScan,
      tableComparePro: g.tableComparePro, codeCompare: g.codeCompare, attention: g.attention,
      pqStrike: g.pqStrike, fractionRuleEignungstest: g.fractionRuleEignungstest, tableCode: g.tableCode,
      routeMemory: g.routeMemory,
      visualIQ: g.visualIQ, visualGearsPro: g.visualGearsPro, visualMirror: g.visualMirror,
      visualCubeRotation: g.visualCubeRotation, visualFolding: g.visualFolding, visualMatrixIQ: g.visualMatrixIQ,
      visualCircuit: g.visualCircuit, visualMechanicsPro: g.visualMechanicsPro, visualTechnical: g.visualTechnical,
      bookKaufmRechnen: g.bookKaufmRechnen, bookBueroWissen: g.bookBueroWissen,
      bookPaedagogik: g.bookPaedagogik, bookSituationen: g.bookSituationen
    };
  }

  function aliasesToGenerators(aliasMap, names) {
    return (names || []).map(function (name) { return aliasMap[name]; }).filter(function (fn) { return typeof fn === 'function'; });
  }

  function buildPoolMap(generators) {
    var aliases = createAliasMap(generators || {});
    var out = {};
    Object.keys(POOLS).forEach(function (key) {
      out[key] = aliasesToGenerators(aliases, POOLS[key]);
    });
    return out;
  }

  function safeProfile(profile, mode) {
    if (profile && typeof profile === 'object') return profile;
    try {
      if (window.EGT_ACTIVE_QUESTION_PROFILE && typeof window.EGT_ACTIVE_QUESTION_PROFILE === 'object') return window.EGT_ACTIVE_QUESTION_PROFILE;
    } catch (e0) {}
    try {
      if (window.EGTBranchQuestionPools && typeof EGTBranchQuestionPools.resolve === 'function') {
        var branch = (window.AppModuleHost && AppModuleHost.getBranch && AppModuleHost.getBranch()) || null;
        return EGTBranchQuestionPools.resolve(branch && branch.id ? branch.id : null, mode, { source: 'generator-registry-fallback-profile' });
      }
    } catch (e1) {}
    return { branch: 'wissen', mode: mode || 'jogging', poolKey: 'legacy', weights: { common: 55, branch: 45 }, aliases: [] };
  }

  function resolvePool(mode, options) {
    var opts = options && typeof options === 'object' ? options : {};
    var selectedMode = String(mode || '').trim() || 'jogging';
    var aliasMap = createAliasMap(opts.generators || {});
    var baseNames = POOLS[selectedMode] || POOLS.jogging;
    var base = aliasesToGenerators(aliasMap, baseNames);
    var profile = safeProfile(opts.profile, selectedMode);
    var branch = String(profile && profile.branch || '').toLowerCase();
    var branchEligible = (selectedMode === 'bps' || selectedMode === 'jogging') && ['it','kaufm','sozial'].indexOf(branch) !== -1;
    if (!branchEligible) return base;
    var branchFns = aliasesToGenerators(aliasMap, profile.aliases || []);
    if (!branchFns.length) return base;
    var commonWeight = Math.max(1, Math.round(((profile.weights && profile.weights.common) || 40) / 25));
    var branchWeight = Math.max(1, Math.round(((profile.weights && profile.weights.branch) || 60) / 25));
    var weighted = [];
    for (var i = 0; i < commonWeight; i++) weighted.push.apply(weighted, base);
    for (var j = 0; j < branchWeight; j++) weighted.push.apply(weighted, branchFns);
    return weighted.length ? weighted : base;
  }

  function attachMeta(question, mode, profile, options) {
    if (!question || typeof question !== 'object') return question;
    var p = safeProfile(profile, mode);
    var opts = options && typeof options === 'object' ? options : {};
    question.branch = question.branch || p.branch || 'wissen';
    question.poolKey = question.poolKey || p.poolKey || String(mode || 'legacy');
    question.poolSource = question.poolSource || opts.source || 'phase7-generator-registry';
    if (!question.generatorRegistryVersion) question.generatorRegistryVersion = VERSION;
    return question;
  }

  function listPools() {
    return clone(POOLS);
  }

  window.EGTGeneratorRegistry = Object.freeze({
    __version: VERSION,
    createAliasMap: createAliasMap,
    buildPoolMap: buildPoolMap,
    resolvePool: resolvePool,
    attachMeta: attachMeta,
    listPools: listPools
  });
})();
