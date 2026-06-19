/* Eignungstest-Trainer · Question Factory · G47.0-phase9
   Phase 9: trennt generateQuestionForMode(...) als kontrollierte Core-Grenze von js/app.js.
   Die Factory besitzt weiterhin keine Generatoren selbst. Generatoren, Datenbankzugriffe,
   Branch-Pools, Coach-Adaption und Signatur-Hooks kommen explizit aus der App-Shell. */
(function(){
  'use strict';

  var VERSION = 'G54.3-ctc-lohr-stability-hardened';
  if (window.EGTQuestionFactory && window.EGTQuestionFactory.__version === VERSION) return;

  function asFn(fn, fallback){ return typeof fn === 'function' ? fn : fallback; }
  function asObj(value){ return value && typeof value === 'object' ? value : {}; }
  function toIndex(value){ var n = Number(value); return Number.isFinite(n) ? n : 0; }
  function pick(choice, list){ return asFn(choice, function(arr){ return arr && arr[0]; })(list || []); }
  function callFallback(ctx){
    if (typeof ctx.fallbackGenerate === 'function') {
      return ctx.fallbackGenerate(ctx.mode, ctx.index, ctx.total, ctx.coach);
    }
    return null;
  }
  function hasMinimumHooks(ctx){
    return !!(
      ctx && ctx.generators &&
      typeof ctx.choice === 'function' &&
      typeof ctx.groupFor === 'function' &&
      typeof ctx.stableSignature === 'function' &&
      typeof ctx.attachBranchPoolMeta === 'function' &&
      typeof ctx.resolveBranchGeneratorPool === 'function' &&
      typeof ctx.levelFor === 'function'
    );
  }
  function hashQuestionId(q){
    q = asObj(q);
    var cleanCat = String(q.cat || 'unknown').toLowerCase().replace(/[^a-z0-9]/g, '');
    var textToHash = String(q.q || '') + '|' + String(q.cat || '');
    var hash = 0;
    for (var i = 0; i < textToHash.length; i++) {
      hash = (hash << 5) - hash + textToHash.charCodeAt(i);
      hash |= 0;
    }
    return 'dyn_' + cleanCat + '_' + Math.abs(hash).toString(36);
  }
  function ensureDynamicId(q){
    q = asObj(q);
    if (!q.id) q.id = hashQuestionId(q);
    return q;
  }
  function ensureRandomId(q){
    q = asObj(q);
    if (!q.id) q.id = 'dyn_' + Math.random().toString(36).substr(2, 8);
    return q;
  }
  function withGroup(ctx, q){
    q = asObj(q);
    q.group = ctx.groupFor(q.cat);
    return q;
  }
  function withMeta(ctx, q, mode){
    return ctx.attachBranchPoolMeta(asObj(q), mode || ctx.mode);
  }
  function fromBank(ctx, filter, fallback, level){
    if (typeof ctx.fromQuestionBank === 'function') return ctx.fromQuestionBank(filter, fallback, level);
    return typeof fallback === 'function' ? fallback() : callFallback(ctx);
  }
  function adaptiveEngine(ctx){
    return ctx.adaptiveDifficultyEngine || window.AdaptiveDifficultyEngine || null;
  }
  function applyAdaptiveTime(ctx, q, coach){
    var engine = adaptiveEngine(ctx);
    if (coach && coach.adaptive && coach.adaptive.active && engine && typeof engine.timeFor === 'function') {
      q.time = engine.timeFor(q, coach);
    }
    return q;
  }

  function generateDuel(ctx){
    var g = ctx.generators;
    var index = toIndex(ctx.index);
    var q;
    if(index < 4){
      q = index < 3
        ? fromBank(ctx, { group:'Allgemeinwissen', excludeCategory:'Satzergänzung' }, function(){ return g.knowledge('medium'); }, 'medium')
        : fromBank(ctx, { group:'Allgemeinwissen', category:'Satzergänzung' }, function(){ return g.sentenceCompletion('medium'); }, 'medium');
      q.block = 'Wissen';
    } else if(index < 7){
      q = fromBank(ctx, { group:'Mathe' }, function(){ return g.arithmetic('medium'); }, 'medium');
      q.block = 'Mathe';
    } else if(index < 10){
      q = fromBank(ctx, { group:'Logik' }, function(){ return pick(ctx.choice, [g.series, g.statementLogic, g.symbolSeries])('medium'); }, 'medium');
      q.block = 'Logik';
    } else {
      q = pick(ctx.choice, [g.fractionRuleEignungstest, g.focusScanner, g.attention, g.tableCode])('medium');
      q.block = 'Konzentration';
    }
    q.time = 25;
    return q;
  }

  function generateCtcLohr(ctx){
    var g = ctx.generators;
    var index = toIndex(ctx.index);
    var q;
    try {
      var profile = null;
      try { if(window.EGT_ACTIVE_QUESTION_PROFILE) profile = window.EGT_ACTIVE_QUESTION_PROFILE; } catch(e0) {}
      if(window.EGTCTCLohrExamStructureEngine && typeof window.EGTCTCLohrExamStructureEngine.createQuestion === 'function'){
        var realQ = window.EGTCTCLohrExamStructureEngine.createQuestion({ index:index, mode:ctx.mode, questionProfile:profile, source:'question-factory-g54-2' });
        if(realQ) return withMeta(ctx, realQ, ctx.mode);
      }
    } catch(realCtcError) {
      try { console.warn('[EGTQuestionFactory] CTC Lohr real exam fallback:', realCtcError && realCtcError.message ? realCtcError.message : realCtcError); } catch(logErr) {}
    }
    if(index < 40){
      if(index < 28){
        q = fromBank(ctx, { group:'Allgemeinwissen', excludeCategory:'Satzergänzung' }, function(){ return g.knowledge('medium'); }, 'medium');
      } else {
        q = fromBank(ctx, { group:'Allgemeinwissen', category:'Satzergänzung' }, function(){ return g.sentenceCompletion('medium'); }, 'medium');
      }
      q.block = '1. Allgemeinwissen';
    } else if(index < 49){
      q = fromBank(ctx, { group:'Mathe' }, function(){ return pick(ctx.choice, [g.ctcMathSprint, g.bookTextMath])(index < 44 ? 'easy' : 'medium'); }, index < 44 ? 'easy' : 'medium');
      q.block = '2. Mathe';
    } else if(index < 67){
      if(index < 52){
        q = g.matrixBook('medium');
      } else if(index < 54){
        q = g.opinionFact('medium');
      } else {
        q = fromBank(ctx, { group:'Logik' }, function(){
          return pick(ctx.choice, [g.matrixBook, g.bookNumberSeries, g.bookVisualLogic, g.series, g.matrix, g.opinionFact, g.statementLogic, g.symbolSeries])('medium');
        }, 'medium');
      }
      q.block = '3. Logik';
    } else if(index < 82){
      q = pick(ctx.choice, [g.pqStrike, g.focusScanner, g.symbolSearch, g.tableScan, g.visualJump, g.errorSearch, g.numberScan, g.tableComparePro, g.attention, g.codeCompare, g.fractionRuleEignungstest, g.tableCode])('medium');
      q.block = '4. Konzentration';
    } else {
      q = (index === 82 ? g.bigEDVMulti() : g.bigEDVCovered(index - 82));
      q.block = '5. EDV Kenntnisse';
    }
    q = withGroup(ctx, q);
    q = applyAdaptiveTime(ctx, q, ctx.coach);
    q.signature = ctx.stableSignature(q) + '|ctc|' + (q.signatureSeed || index);
    ensureRandomId(q);
    return withMeta(ctx, q, ctx.mode);
  }

  function generateCtc(ctx){
    if (typeof ctx.buildAdaptiveQuestion !== 'function') return callFallback(ctx);
    return withMeta(ctx, ctx.buildAdaptiveQuestion(ctx.index, ctx.total), ctx.mode);
  }

  function generateStandard(ctx){
    var baseLevel = ctx.levelFor(ctx.mode, ctx.index, ctx.total);
    var pool = ctx.resolveBranchGeneratorPool(ctx.mode) || [];
    var gen = pick(ctx.choice, pool);
    if (typeof gen !== 'function') return callFallback(ctx);
    var q = gen(baseLevel);
    q = withGroup(ctx, q);
    var engine = adaptiveEngine(ctx);
    if(ctx.coach && ctx.coach.adaptive && ctx.coach.adaptive.active && engine) {
      if (typeof engine.levelForGroup === 'function') {
        var adaptedLevel = engine.levelForGroup(q.group, baseLevel, ctx.coach);
        if(adaptedLevel !== baseLevel) {
          q = gen(adaptedLevel);
          q = withGroup(ctx, q);
        }
      }
      if (typeof engine.timeFor === 'function') q.time = engine.timeFor(q, ctx.coach);
    }
    q.signature = ctx.stableSignature(q);
    ensureDynamicId(q);
    return withMeta(ctx, q, ctx.mode);
  }

  function resolveSource(ctx){
    ctx = asObj(ctx);
    var mode = String(ctx.mode || '').trim() || 'jogging';
    if(mode === 'duell') return { type:'fixed-duel-mix', mode:mode };
    if(mode === 'ctcLohr') return { type:'fixed-ctc-lohr-blocks', mode:mode };
    if(mode === 'ctc') return { type:'adaptive-ctc-generator', mode:mode };
    return { type:'branch-generator-pool', mode:mode };
  }

  function generate(ctx){
    ctx = asObj(ctx);
    ctx.mode = String(ctx.mode || 'jogging');
    ctx.index = toIndex(ctx.index);
    ctx.total = toIndex(ctx.total);
    if(!hasMinimumHooks(ctx)) return callFallback(ctx);
    try {
      if(ctx.mode === 'duell') return generateDuel(ctx);
      if(ctx.mode === 'ctcLohr') return generateCtcLohr(ctx);
      if(ctx.mode === 'ctc') return generateCtc(ctx);
      return generateStandard(ctx);
    } catch(e) {
      try { console.warn('[EGTQuestionFactory] Fallback nach Fehler:', e && e.message ? e.message : e); } catch(logErr) {}
      return callFallback(ctx);
    }
  }

  window.EGTQuestionFactory = Object.freeze({
    __version: VERSION,
    generate: generate,
    resolveSource: resolveSource,
    _private: {
      hashQuestionId: hashQuestionId,
      ensureDynamicId: ensureDynamicId
    }
  });
})();
