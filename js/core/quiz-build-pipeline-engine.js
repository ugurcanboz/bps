/* Eignungstest-Trainer · Quiz Build Pipeline Engine · G52.7-phase21
   Phase 21: bündelt BuildQuiz, Generator-Auswahl, Branch-Pool-Auflösung
   und Aufgabenpipeline als eigene Core-Grenze. Die App-Shell liefert nur noch
   Generatoren, State und kleine Adapter-Hooks. */
(function(){
  'use strict';

  var VERSION = 'G54.3-novura-exams-stability-hardened';
  if (window.EGTQuizBuildPipelineEngine && window.EGTQuizBuildPipelineEngine.__version === VERSION) return;

  function asFn(fn, fallback){ return typeof fn === 'function' ? fn : fallback; }
  function asObj(value){ return value && typeof value === 'object' ? value : {}; }
  function asArray(value){ return Array.isArray(value) ? value : []; }
  function numberOr(value, fallback){ var n = Number(value); return Number.isFinite(n) ? n : fallback; }
  function noop(){}
  function defaultChoice(arr){ arr = asArray(arr); return arr[Math.floor(Math.random() * arr.length)] || arr[0]; }
  function defaultShuffle(list){
    var arr = asArray(list).slice();
    for(var i = arr.length - 1; i > 0; i--){
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
    }
    return arr;
  }
  function defaultSignature(q){
    try { return JSON.stringify(q || {}); } catch(e) { return String(Math.random()); }
  }
  function hashQuestionId(q){
    q = asObj(q);
    var cleanCat = String(q.cat || 'unknown').toLowerCase().replace(/[^a-z0-9]/g, '');
    var textToHash = String(q.q || '') + '|' + String(q.cat || '');
    var hash = 0;
    for(var i = 0; i < textToHash.length; i++){
      hash = (hash << 5) - hash + textToHash.charCodeAt(i);
      hash |= 0;
    }
    return 'dyn_' + cleanCat + '_' + Math.abs(hash).toString(36);
  }
  function ensureDynamicId(q){ q = asObj(q); if(!q.id) q.id = hashQuestionId(q); return q; }
  function ensureRandomId(q){ q = asObj(q); if(!q.id) q.id = 'dyn_' + Math.random().toString(36).substr(2, 8); return q; }
  function pick(choice, list){ return asFn(choice, defaultChoice)(asArray(list)); }
  function callGenerator(fn, level, fallback){
    try { if(typeof fn === 'function') return fn(level); } catch(e) {}
    return typeof fallback === 'function' ? fallback() : null;
  }

  function create(ctx){
    ctx = ctx || {};
    var state = ctx.state || {};
    var modes = ctx.MODES || ctx.modes || {};
    var generators = ctx.Generators || ctx.generators || {};
    var choice = asFn(ctx.choice, defaultChoice);
    var shuffle = asFn(ctx.shuffle, defaultShuffle);
    var signature = asFn(ctx.signature || ctx.stableSignature, defaultSignature);
    var levelFor = asFn(ctx.levelFor, function(){ return 'medium'; });
    var groupFor = asFn(ctx.groupFor, function(cat){ return cat || 'Allgemein'; });
    var repairQuestion = asFn(ctx.repairQuestion, function(q){ return q; });
    var fromQuestionBank = asFn(ctx.fromQuestionBank, function(filter, fallback){ return typeof fallback === 'function' ? fallback() : null; });
    var buildAdaptiveQuestion = asFn(ctx.buildAdaptiveQuestion, function(){ return null; });
    var buildMatrixOnlyQuiz = asFn(ctx.buildMatrixOnlyQuiz, function(){ return []; });
    var buildMemoryQuestionsHook = asFn(ctx.buildMemoryQuestions, function(){ return []; });
    var buildCoach = asFn(ctx.buildCoach, function(){ return null; });
    var validateQuestion = asFn(ctx.validateQuestion, function(){ return true; });
    var getAppModuleHost = asFn(ctx.getAppModuleHost, function(){ return window.AppModuleHost; });
    var getBranchPoolResolver = asFn(ctx.getBranchPoolResolver, function(){ return window.EGTBranchQuestionPools; });
    var getGeneratorRegistry = asFn(ctx.getGeneratorRegistry, function(){ return window.EGTGeneratorRegistry; });
    var getQuestionFactory = asFn(ctx.getQuestionFactory, function(){ return window.EGTQuestionFactory; });
    var getQuizOrchestrator = asFn(ctx.getQuizOrchestrator, function(){ return window.EGTQuizOrchestrator; });
    var adaptiveDifficultyEngine = ctx.adaptiveDifficultyEngine || window.AdaptiveDifficultyEngine || null;

    function modeDef(mode){ return modes && modes[mode] ? modes[mode] : {}; }
    function currentMode(mode){ return String(mode || state.selectedMode || 'jogging'); }

    function activeBranchIdForQuiz(){
      try {
        var host = getAppModuleHost();
        if(host && typeof host.getBranch === 'function'){
          var branch = host.getBranch();
          if(branch && branch.id) return String(branch.id);
        }
      } catch(e0) {}
      try { if(window.EGT_ACTIVE_QUESTION_PROFILE && window.EGT_ACTIVE_QUESTION_PROFILE.branch) return String(window.EGT_ACTIVE_QUESTION_PROFILE.branch); } catch(e1) {}
      try { return String(localStorage.getItem('assessments_branch') || 'wissen'); } catch(e2) {}
      return 'wissen';
    }

    function activeQuestionPoolProfile(mode){
      mode = currentMode(mode);
      var branch = activeBranchIdForQuiz();
      try {
        var resolver = getBranchPoolResolver();
        if(resolver && typeof resolver.resolve === 'function'){
          var profile = resolver.resolve(branch, mode, { source:'quiz-build-pipeline-phase21' });
          try { window.EGT_ACTIVE_QUESTION_PROFILE = profile; } catch(e0) {}
          return profile;
        }
      } catch(e1) {}
      try { return window.EGT_ACTIVE_QUESTION_PROFILE || { branch:branch, mode:mode, poolKey:'legacy' }; } catch(e2) {}
      return { branch:branch, mode:mode, poolKey:'legacy' };
    }

    function fallbackGeneratorPool(mode){
      mode = currentMode(mode);
      var g = generators;
      var fallback = {
        math:[g.assessmentsMathTrainer],
        logic:[g.logic, g.bookSymbolArithmetic, g.bookStatementLogic, g.bookRatioLogic],
        kaufmRechnen:[g.bookKaufmRechnen],
        bueroWissen:[g.bookBueroWissen],
        paedagogik:[g.bookPaedagogik],
        situationen:[g.bookSituationen],
        jogging:[g.math, g.bookTextMath, g.logic, g.bookNumberSeries, g.bookVisualLogic, g.bookTextComprehension, g.bookGeneralKnowledge, g.knowledge, g.english, g.it, g.attention, g.codeCompare, g.focusScanner, g.symbolSearch, g.visualJump, g.numberScan, g.routeMemory, g.visualIQ],
        assessments:[g.analogy, g.series, g.symbolSeries, g.spatial, g.net, g.belt, g.arithmetic, g.fraction, g.percentReverse, g.area, g.dreisatz, g.bookGeneralKnowledge, g.knowledge, g.english, g.it, g.attention, g.codeCompare, g.focusScanner, g.symbolSearch, g.tableScan, g.visualJump, g.errorSearch, g.numberScan, g.tableComparePro, g.opinionFact, g.routeMemory, g.visualIQ]
      };
      return asArray(fallback[mode] || fallback.jogging).filter(function(fn){ return typeof fn === 'function'; });
    }

    function resolveBranchGeneratorPool(mode){
      mode = currentMode(mode);
      var profile = activeQuestionPoolProfile(mode);
      try {
        var registry = getGeneratorRegistry();
        if(registry && typeof registry.resolvePool === 'function'){
          var resolved = registry.resolvePool(mode, { generators:generators, profile:profile, source:'quiz-build-pipeline-phase21' });
          if(Array.isArray(resolved) && resolved.length) return resolved;
        }
      } catch(e0) {}
      return fallbackGeneratorPool(mode);
    }

    function attachBranchPoolMeta(q, mode){
      q = asObj(q);
      mode = currentMode(mode);
      var profile = activeQuestionPoolProfile(mode);
      try {
        var registry = getGeneratorRegistry();
        if(registry && typeof registry.attachMeta === 'function'){
          return registry.attachMeta(q, mode, profile, { source:'quiz-build-pipeline-phase21' });
        }
      } catch(e0) {}
      q.branch = q.branch || (profile && profile.branch) || activeBranchIdForQuiz();
      q.poolKey = q.poolKey || (profile && profile.poolKey) || 'legacy';
      q.poolSource = q.poolSource || 'phase21-build-pipeline-fallback';
      return q;
    }

    function bank(filter, fallback, level, mode){
      return fromQuestionBank(filter, fallback, level, currentMode(mode));
    }

    function generateDuelQuestion(index){
      var g = generators;
      var q;
      if(index < 4){
        q = index < 3
          ? bank({ group:'Allgemeinwissen', excludeCategory:'Satzergänzung' }, function(){ return callGenerator(g.knowledge, 'medium', function(){ return {}; }); }, 'medium', 'duell')
          : bank({ group:'Allgemeinwissen', category:'Satzergänzung' }, function(){ return callGenerator(g.sentenceCompletion, 'medium', function(){ return callGenerator(g.knowledge, 'medium', function(){ return {}; }); }); }, 'medium', 'duell');
        q.block = 'Wissen';
      } else if(index < 7){
        q = bank({ group:'Mathe' }, function(){ return callGenerator(g.arithmetic, 'medium', function(){ return callGenerator(g.math, 'medium', function(){ return {}; }); }); }, 'medium', 'duell');
        q.block = 'Mathe';
      } else if(index < 10){
        q = bank({ group:'Logik' }, function(){ return callGenerator(pick(choice, [g.series, g.statementLogic, g.symbolSeries]), 'medium', function(){ return callGenerator(g.logic, 'medium', function(){ return {}; }); }); }, 'medium', 'duell');
        q.block = 'Logik';
      } else {
        q = callGenerator(pick(choice, [g.fractionRuleEignungstest, g.focusScanner, g.attention, g.tableCode]), 'medium', function(){ return callGenerator(g.attention, 'medium', function(){ return {}; }); });
        q.block = 'Konzentration';
      }
      q = asObj(q);
      q.time = 25;
      return q;
    }

    function generateNovuraExamsLohrQuestion(index, coach){
      var g = generators;
      var q;
      try {
        var activeProfileForNovuraExams = activeQuestionPoolProfile('novuraExams');
        if(window.NovuraExamsStructureEngine && typeof window.NovuraExamsStructureEngine.createQuestion === 'function'){
          q = window.NovuraExamsStructureEngine.createQuestion({ index:index, mode:'novuraExams', questionProfile:activeProfileForNovuraExams, source:'quiz-build-pipeline-g54-2', coach:coach });
          if(q){
            q.group = q.group || groupFor(q.cat);
            q.signature = q.signature || (signature(q) + '|novura-exams-real|' + index);
            return attachBranchPoolMeta(q, 'novuraExams');
          }
        }
      } catch(realNovuraExamsError) {
        try { console.warn('[QuizBuildPipeline] Novura Exams Lohr real exam fallback:', realNovuraExamsError && realNovuraExamsError.message ? realNovuraExamsError.message : realNovuraExamsError); } catch(logErr) {}
      }
      if(index < 40){
        if(index < 28){
          q = bank({ group:'Allgemeinwissen', excludeCategory:'Satzergänzung' }, function(){ return callGenerator(g.knowledge, 'medium', function(){ return {}; }); }, 'medium', 'novuraExams');
        } else {
          q = bank({ group:'Allgemeinwissen', category:'Satzergänzung' }, function(){ return callGenerator(g.sentenceCompletion, 'medium', function(){ return callGenerator(g.knowledge, 'medium', function(){ return {}; }); }); }, 'medium', 'novuraExams');
        }
        q.block = '1. Allgemeinwissen';
      } else if(index < 49){
        var mathLevel = index < 44 ? 'easy' : 'medium';
        q = bank({ group:'Mathe' }, function(){ return callGenerator(pick(choice, [g.novuraExamsMathSprint, g.bookTextMath]), mathLevel, function(){ return callGenerator(g.math, mathLevel, function(){ return {}; }); }); }, mathLevel, 'novuraExams');
        q.block = '2. Mathe';
      } else if(index < 67){
        if(index < 52){
          q = callGenerator(g.matrixBook, 'medium', function(){ return callGenerator(g.visualIQ, 'medium', function(){ return {}; }); });
        } else if(index < 54){
          q = callGenerator(g.opinionFact, 'medium', function(){ return callGenerator(g.statementLogic, 'medium', function(){ return {}; }); });
        } else {
          q = bank({ group:'Logik' }, function(){ return callGenerator(pick(choice, [g.matrixBook, g.bookNumberSeries, g.bookVisualLogic, g.series, g.matrix, g.opinionFact, g.statementLogic, g.symbolSeries]), 'medium', function(){ return callGenerator(g.logic, 'medium', function(){ return {}; }); }); }, 'medium', 'novuraExams');
        }
        q.block = '3. Logik';
      } else if(index < 82){
        q = callGenerator(pick(choice, [g.pqStrike, g.focusScanner, g.symbolSearch, g.tableScan, g.visualJump, g.errorSearch, g.numberScan, g.tableComparePro, g.attention, g.codeCompare, g.fractionRuleEignungstest, g.tableCode]), 'medium', function(){ return callGenerator(g.attention, 'medium', function(){ return {}; }); });
        q.block = '4. Konzentration';
      } else {
        try { q = (index === 82 && typeof g.bigEDVMulti === 'function') ? g.bigEDVMulti() : (typeof g.bigEDVCovered === 'function' ? g.bigEDVCovered(index - 82) : {}); } catch(e0) { q = {}; }
        q.block = '5. EDV Kenntnisse';
      }
      q = asObj(q);
      q.group = groupFor(q.cat);
      if(coach && coach.adaptive && coach.adaptive.active && adaptiveDifficultyEngine && typeof adaptiveDifficultyEngine.timeFor === 'function'){
        q.time = adaptiveDifficultyEngine.timeFor(q, coach);
      }
      q.signature = signature(q) + '|novuraExams|' + (q.signatureSeed || index);
      ensureRandomId(q);
      return attachBranchPoolMeta(q, 'novuraExams');
    }

    function generateStandardQuestion(mode, index, total, coach){
      var baseLevel = levelFor(mode, index, total);
      var pool = resolveBranchGeneratorPool(mode);
      var gen = pick(choice, pool);
      if(typeof gen !== 'function') return {};
      var q = callGenerator(gen, baseLevel, function(){ return {}; });
      q = asObj(q);
      q.group = groupFor(q.cat);
      if(coach && coach.adaptive && coach.adaptive.active && adaptiveDifficultyEngine){
        if(typeof adaptiveDifficultyEngine.levelForGroup === 'function'){
          var adaptedLevel = adaptiveDifficultyEngine.levelForGroup(q.group, baseLevel, coach);
          if(adaptedLevel !== baseLevel){
            q = asObj(callGenerator(gen, adaptedLevel, function(){ return q; }));
            q.group = groupFor(q.cat);
          }
        }
        if(typeof adaptiveDifficultyEngine.timeFor === 'function') q.time = adaptiveDifficultyEngine.timeFor(q, coach);
      }
      q.signature = signature(q);
      ensureDynamicId(q);
      return attachBranchPoolMeta(q, mode);
    }

    function generateQuestionForModeInternal(mode, index, total, coach){
      mode = currentMode(mode);
      index = numberOr(index, 0);
      total = numberOr(total, (modeDef(mode).amount || 0));
      var q;
      if(mode === 'duell') q = generateDuelQuestion(index);
      else if(mode === 'novuraExams') q = generateNovuraExamsLohrQuestion(index, coach);
      else if(mode === 'novuraExams') q = attachBranchPoolMeta(buildAdaptiveQuestion(index, total), mode);
      else q = generateStandardQuestion(mode, index, total, coach);
      return attachBranchPoolMeta(q, mode);
    }

    function generateQuestionForMode(mode, index, total, coach){
      mode = currentMode(mode);
      index = numberOr(index, 0);
      total = numberOr(total, (modeDef(mode).amount || 0));
      var factory = getQuestionFactory();
      if(factory && typeof factory.generate === 'function'){
        try {
          return factory.generate({
            mode:mode,
            index:index,
            total:total,
            coach:coach,
            generators:generators,
            levelFor:levelFor,
            groupFor:groupFor,
            choice:choice,
            fromQuestionBank:function(qbFilter, qbFallback, qbLevel){ return bank(qbFilter, qbFallback, qbLevel, mode); },
            resolveBranchGeneratorPool:resolveBranchGeneratorPool,
            attachBranchPoolMeta:attachBranchPoolMeta,
            stableSignature:signature,
            buildAdaptiveQuestion:buildAdaptiveQuestion,
            adaptiveDifficultyEngine:adaptiveDifficultyEngine,
            fallbackGenerate:generateQuestionForModeInternal
          });
        } catch(e0) {
          try { console.warn('[QuizBuildPipeline] QuestionFactory fallback:', e0 && e0.message ? e0.message : e0); } catch(logErr) {}
        }
      }
      return generateQuestionForModeInternal(mode, index, total, coach);
    }

    function buildMemoryQuestions(mode, modeDefValue){
      return asArray(buildMemoryQuestionsHook(mode, modeDefValue)).map(function(q){
        q = asObj(q);
        q.group = q.group || 'Gedächtnis';
        q.signature = q.signature || signature(q);
        return q;
      });
    }

    function createDuplicate(original, index){
      var dup = Object.assign({}, original || {});
      dup.signature = signature(original || {}) + '|dup|' + index + '|' + Math.random();
      return dup;
    }

    function buildQuizInternal(mode){
      mode = currentMode(mode);
      var m = modeDef(mode);
      var amount = Math.max(0, numberOr(m.amount, 0));
      if(state.usedQuestions && typeof state.usedQuestions.clear === 'function') state.usedQuestions.clear();
      if(mode === 'matrixOnlySprint') return asArray(buildMatrixOnlyQuiz(amount)).map(repairQuestion);
      if(mode === 'novuraExams'){
        try { if(typeof ctx.setupMode === 'function') ctx.setupMode(mode, m); } catch(e0) {}
      }
      // Novura Exams-Lohr: Die Exam-Structure-Engine liefert bereits eine fest sortierte,
      // eindeutige Blockfolge (Allgemeinwissen → Mathe → Regelrechnung → Zahlenreihen
      // → Buchstaben → Tabellen → FlowLogic). Hier KEINE Dedup-Schleife verwenden,
      // da identische Aufgabentexte (z. B. "Berechne die Aufgabe…") sonst als
      // Duplikate verworfen würden und die Blockfolge zerstört wird.
      if(mode === 'novuraExams'){
        var coachNovuraExams = null;
        try { coachNovuraExams = buildCoach(mode, m); } catch(eC) { coachNovuraExams = null; }
        var novuraExamsOut = [];
        for(var ci=0; ci<amount; ci++){
          var cq = generateQuestionForMode(mode, ci, amount, coachNovuraExams);
          cq = asObj(cq);
          // Signatur eindeutig pro Position halten (verhindert spätere Kollisionen)
          if(!cq.signature || String(cq.signature).indexOf('|pos') === -1){
            cq.signature = (cq.signature || signature(cq)) + '|pos' + ci;
          }
          ensureDynamicId(cq);
          novuraExamsOut.push(cq);
        }
        return novuraExamsOut.slice(0, amount).map(repairQuestion);
      }
      var seen = new Set();
      var out = [];
      var coach = null;
      try { coach = buildCoach(mode, m); } catch(e1) { coach = null; }
      var memoryQs = (mode !== 'novuraExams' && m.memory) ? buildMemoryQuestions(mode, m) : [];
      var targetCoreAmount = Math.max(0, amount - memoryQs.length);
      var consecutiveFailures = 0;
      while(out.length < targetCoreAmount){
        var q = null;
        var dnaValid = false;
        var dnaAttempts = 0;
        while(!dnaValid && dnaAttempts < 3){
          dnaAttempts++;
          q = generateQuestionForMode(mode, out.length, amount, coach);
          try { dnaValid = validateQuestion(q, { mode:mode, index:out.length, total:amount }); }
          catch(e2) { dnaValid = true; }
        }
        var baseSig = signature(q);
        if(!seen.has(baseSig)){
          seen.add(baseSig);
          out.push(q);
          consecutiveFailures = 0;
        } else {
          consecutiveFailures++;
          if(consecutiveFailures > 150) break;
        }
      }
      if(out.length < targetCoreAmount){
        if(out.length > 0){
          var uniqueGenerated = out.slice();
          var dupIndex = 0;
          while(out.length < targetCoreAmount){
            out.push(createDuplicate(uniqueGenerated[dupIndex % uniqueGenerated.length], out.length));
            dupIndex++;
          }
        } else {
          while(out.length < targetCoreAmount){
            var fq = asObj(generateQuestionForMode(mode, out.length, amount, coach));
            fq.signature = signature(fq) + '|fallback|' + out.length + '|' + Math.random();
            out.push(fq);
          }
        }
      }
      memoryQs.forEach(function(q){
        var baseSig = signature(q);
        if(!seen.has(baseSig)){
          out.push(q);
          seen.add(baseSig);
        }
      });
      var finalQuiz = (mode === 'novuraExams' || mode === 'novuraExams') ? out : shuffle(out);
      return finalQuiz.slice(0, amount).map(repairQuestion);
    }

    function buildQuiz(mode){
      mode = currentMode(mode);
      var orchestrator = getQuizOrchestrator();
      var m = modeDef(mode);
      if(orchestrator && typeof orchestrator.build === 'function'){
        try {
          return orchestrator.build({
            state:state,
            mode:mode,
            modeDef:m,
            MODES:modes,
            resetUsed:function(){ if(state.usedQuestions && typeof state.usedQuestions.clear === 'function') state.usedQuestions.clear(); },
            setupMode:function(currentModeValue){ if(currentModeValue === 'novuraExams' && typeof ctx.setupMode === 'function') ctx.setupMode(currentModeValue, m); },
            buildMatrixOnlyQuiz:buildMatrixOnlyQuiz,
            repairQuestion:repairQuestion,
            buildCoach:function(){ return buildCoach(mode, m); },
            buildMemoryQuestions:buildMemoryQuestions,
            generateCoreQuestion:function(payload){
              payload = payload || {};
              return generateQuestionForMode(payload.mode || mode, numberOr(payload.index, 0), numberOr(payload.total, m.amount || 0), payload.coach || null);
            },
            validateQuestion:validateQuestion,
            signature:signature,
            shuffle:shuffle,
            fallbackBuild:function(){ return buildQuizInternal(mode); }
          });
        } catch(e0) {
          try { console.warn('[QuizBuildPipeline] QuizOrchestrator fallback:', e0 && e0.message ? e0.message : e0); } catch(logErr) {}
        }
      }
      return buildQuizInternal(mode);
    }

    function diagnostics(){
      var mode = currentMode();
      var profile = null;
      try { profile = activeQuestionPoolProfile(mode); } catch(e) {}
      return {
        ok:true,
        provider:'EGTQuizBuildPipelineEngine',
        version:VERSION,
        mode:mode,
        amount:numberOr(modeDef(mode).amount, 0),
        branch:profile && profile.branch,
        poolKey:profile && profile.poolKey,
        hasQuizOrchestrator:!!(getQuizOrchestrator() && typeof getQuizOrchestrator().build === 'function'),
        hasQuestionFactory:!!(getQuestionFactory() && typeof getQuestionFactory().generate === 'function'),
        fallbackPoolSize:resolveBranchGeneratorPool(mode).length
      };
    }

    function snapshot(){
      return {
        version:VERSION,
        selectedMode:currentMode(),
        quizLength:Array.isArray(state.quiz) ? state.quiz.length : 0,
        usedQuestions:state.usedQuestions && typeof state.usedQuestions.size === 'number' ? state.usedQuestions.size : null,
        activeBranch:activeBranchIdForQuiz()
      };
    }

    return Object.freeze({
      __version:VERSION,
      activeBranchIdForQuiz:activeBranchIdForQuiz,
      activeQuestionPoolProfile:activeQuestionPoolProfile,
      fallbackGeneratorPool:fallbackGeneratorPool,
      resolveBranchGeneratorPool:resolveBranchGeneratorPool,
      attachBranchPoolMeta:attachBranchPoolMeta,
      generateQuestionForMode:generateQuestionForMode,
      generateQuestionForModeInternal:generateQuestionForModeInternal,
      buildQuiz:buildQuiz,
      buildQuizInternal:buildQuizInternal,
      diagnostics:diagnostics,
      snapshot:snapshot
    });
  }

  window.EGTQuizBuildPipelineEngine = Object.freeze({
    __version:VERSION,
    create:create
  });
})();
