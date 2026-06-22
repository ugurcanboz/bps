/* Eignungstest-Trainer · Quiz Orchestrator · G46.0-phase8
   Phase 8: trennt den Quiz-Aufbau als kontrollierte Orchestrator-Grenze von js/app.js.
   Der Orchestrator besitzt keine Fachgeneratoren selbst, sondern arbeitet über explizite Hooks.
   Dadurch bleiben Generatoren/State vorerst stabil, während buildQuiz() aus dem Monolithen gelöst wird. */
(function(){
  'use strict';

  var VERSION = 'G46.0-phase8';
  if (window.EGTQuizOrchestrator && window.EGTQuizOrchestrator.__version === VERSION) return;

  function noop(){ }
  function asFn(fn, fallback){ return typeof fn === 'function' ? fn : fallback; }
  function asArray(value){ return Array.isArray(value) ? value : []; }
  function numberOr(value, fallback){ var n = Number(value); return Number.isFinite(n) ? n : fallback; }

  function defaultSignature(question){
    try { return JSON.stringify(question || {}); } catch(e) { return String(Math.random()); }
  }

  function defaultShuffle(list){
    var arr = asArray(list).slice();
    for(var i = arr.length - 1; i > 0; i--){
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
    }
    return arr;
  }

  function repairList(list, repairQuestion){
    var repair = asFn(repairQuestion, function(q){ return q; });
    return asArray(list).map(function(q){
      try { return repair(q); } catch(e) { return q; }
    });
  }

  function createDuplicate(original, signature, index){
    var dup = Object.assign({}, original || {});
    dup.signature = signature(original || {}) + '|dup|' + index + '|' + Math.random();
    return dup;
  }

  function build(ctx){
    ctx = ctx || {};
    var state = ctx.state || {};
    var mode = String(ctx.mode || (state && state.selectedMode) || 'jogging');
    var modeDef = ctx.modeDef || (ctx.MODES && ctx.MODES[mode]) || {};
    var amount = Math.max(0, numberOr(modeDef.amount, 0));
    var signature = asFn(ctx.signature, defaultSignature);
    var shuffle = asFn(ctx.shuffle, defaultShuffle);
    var validateQuestion = asFn(ctx.validateQuestion, function(){ return true; });
    var generateCoreQuestion = asFn(ctx.generateCoreQuestion, null);
    var buildCoach = asFn(ctx.buildCoach, function(){ return null; });
    var buildMemoryQuestions = asFn(ctx.buildMemoryQuestions, function(){ return []; });
    var resetUsed = asFn(ctx.resetUsed, noop);
    var setupMode = asFn(ctx.setupMode, noop);
    var repairQuestion = ctx.repairQuestion;

    try { resetUsed(); } catch(e0) {}

    if(mode === 'matrixOnlySprint' && typeof ctx.buildMatrixOnlyQuiz === 'function'){
      return repairList(ctx.buildMatrixOnlyQuiz(amount), repairQuestion);
    }

    if(!generateCoreQuestion){
      if(typeof ctx.fallbackBuild === 'function') return ctx.fallbackBuild();
      return [];
    }

    try { setupMode(mode, modeDef); } catch(e1) {}

    // CTC-Lohr: feste, eindeutige Blockfolge direkt aus der Exam-Structure-Engine.
    // KEINE Dedup-Schleife (identische Aufgabentexte würden sonst als Duplikate
    // verworfen und die garantierte Blockreihenfolge zerstören).
    if(mode === 'ctcLohr'){
      var ctcCoach = null;
      try { ctcCoach = buildCoach(mode, modeDef); } catch(eCC) { ctcCoach = null; }
      var ctcList = [];
      for(var cIdx=0; cIdx<amount; cIdx++){
        var ctcQ = generateCoreQuestion({ mode: mode, index: cIdx, total: amount, coach: ctcCoach, modeDef: modeDef, state: state });
        ctcQ = ctcQ || {};
        if(!ctcQ.signature || String(ctcQ.signature).indexOf('|pos') === -1){
          ctcQ.signature = (ctcQ.signature || signature(ctcQ)) + '|pos' + cIdx;
        }
        ctcList.push(ctcQ);
      }
      return repairList(ctcList.slice(0, amount), repairQuestion);
    }

    var seen = new Set();
    var out = [];
    var coach = null;
    try { coach = buildCoach(mode, modeDef); } catch(e2) { coach = null; }

    var memoryQs = [];
    if(mode !== 'ctc' && modeDef.memory){
      memoryQs = asArray(buildMemoryQuestions(mode, modeDef)).map(function(q){
        q = q || {};
        q.group = q.group || 'Gedächtnis';
        q.signature = q.signature || signature(q);
        return q;
      });
    }

    var targetCoreAmount = Math.max(0, amount - memoryQs.length);
    var consecutiveFailures = 0;

    while(out.length < targetCoreAmount){
      var q = null;
      var dnaValid = false;
      var dnaAttempts = 0;

      while(!dnaValid && dnaAttempts < 3){
        dnaAttempts++;
        q = generateCoreQuestion({ mode: mode, index: out.length, total: amount, coach: coach, modeDef: modeDef, state: state });
        try { dnaValid = validateQuestion(q, { mode: mode, index: out.length, total: amount }); }
        catch(e3) { dnaValid = true; }
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
          out.push(createDuplicate(uniqueGenerated[dupIndex % uniqueGenerated.length], signature, out.length));
          dupIndex++;
        }
      } else {
        while(out.length < targetCoreAmount){
          var fq = generateCoreQuestion({ mode: mode, index: out.length, total: amount, coach: coach, modeDef: modeDef, state: state }) || {};
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

    var finalQuiz = (mode === 'ctcLohr' || mode === 'ctc') ? out : shuffle(out);
    return finalQuiz.slice(0, amount);
  }

  window.EGTQuizOrchestrator = {
    __version: VERSION,
    build: build,
    _private: {
      defaultSignature: defaultSignature,
      defaultShuffle: defaultShuffle
    }
  };
})();
