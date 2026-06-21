/* Ablaufplan-Detektiv · FlowLogic Generator · Phase 11
   Kontrollierter Aufgaben-Generator Version 2.
   Variiert Szenario, Layout, Fehlerpositionen und Begriffe, ohne die Auswertbarkeit zu verlieren.
   Jede Aufgabe muss Schema + Verteilungs-Validator + Musterloesung-Scoring bestehen. */
(function(){
  'use strict';

  var VERSION = 'G39.26-FLOWLOGIC-STANDALONE-PHASE12-2026-06-14';
  var MODULE_ID = 'flowlogic';
  var DEFAULT_ERROR_COUNT = 11;
  var DEFAULT_MAX_ATTEMPTS = 120;
  var LAYOUT_VARIANTS = Object.freeze(['identity','mirror-x','row-shift-a','row-shift-b','mirror-shift-a','mirror-shift-b','zigzag-a','zigzag-b']);
  var TERMINOLOGY_VARIANTS = Object.freeze(['neutral','fachlich','kurz']);

  function schema(){ if(!window.FlowLogicSchema) throw new Error('FlowLogicSchema fehlt fuer Generator.'); return window.FlowLogicSchema; }
  function scenarios(){ if(!window.FlowLogicScenarios) throw new Error('FlowLogicScenarios fehlt fuer Generator.'); return window.FlowLogicScenarios; }
  function mutations(){ if(!window.FlowLogicMutations) throw new Error('FlowLogicMutations fehlt fuer Generator.'); return window.FlowLogicMutations; }
  function validator(){ if(!window.FlowLogicValidator) throw new Error('FlowLogicValidator fehlt fuer Generator.'); return window.FlowLogicValidator; }
  function scorer(){ if(!window.FlowLogicScorer) throw new Error('FlowLogicScorer fehlt fuer Generator.'); return window.FlowLogicScorer; }
  function clone(value){ return schema().clone ? schema().clone(value) : JSON.parse(JSON.stringify(value)); }
  function asArray(value){ return Array.isArray(value) ? value : []; }
  function nowIso(){ return new Date().toISOString(); }

  function hashSeed(input){
    var str = String(input || 'flowlogic');
    var h = 2166136261 >>> 0;
    for(var i=0; i<str.length; i++){
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619) >>> 0;
    }
    return h >>> 0;
  }
  function mulberry32(seed){
    var a = seed >>> 0;
    return function(){
      a = (a + 0x6D2B79F5) >>> 0;
      var t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function seededRandom(seed){ return mulberry32(hashSeed(seed)); }
  function shuffle(list, seed){
    var out = asArray(list).slice();
    var rnd = seededRandom(seed);
    for(var i=out.length-1; i>0; i--){
      var j = Math.floor(rnd() * (i+1));
      var tmp = out[i]; out[i] = out[j]; out[j] = tmp;
    }
    return out;
  }
  function pick(arr, rnd){ return arr[Math.floor(rnd() * arr.length)]; }
  function unique(list){
    var seen = Object.create(null), out = [];
    asArray(list).forEach(function(x){ if(x && !seen[x]){ seen[x] = true; out.push(x); } });
    return out;
  }
  function countBy(list, fn){
    var out = Object.create(null);
    asArray(list).forEach(function(x){ var k = fn(x); out[k] = (out[k] || 0) + 1; });
    return out;
  }

  function scenarioIdsFromOptions(options){
    options = options || {};
    if(options.scenarioId) return [options.scenarioId];
    if(Array.isArray(options.scenarioIds) && options.scenarioIds.length) return options.scenarioIds.slice();
    return scenarios().getAll().map(function(s){ return s.id; });
  }
  function getScenario(id){ return typeof id === 'string' ? scenarios().get(id) : clone(id); }

  function gridToCell(grid, cols){
    cols = Number(cols || 10);
    var g = Math.max(1, Number(grid || 1));
    return { row: Math.floor((g-1)/cols), col: (g-1) % cols };
  }
  function cellToGrid(row, col, cols){ return (row * cols) + col + 1; }
  function wrapCol(col, cols){ return ((col % cols) + cols) % cols; }

  function chooseLayoutVariant(seed, forced){
    if(forced && LAYOUT_VARIANTS.indexOf(forced) !== -1) return forced;
    var rnd = seededRandom(seed + ':layout');
    return LAYOUT_VARIANTS[Math.floor(rnd() * LAYOUT_VARIANTS.length)];
  }
  function transformGrid(grid, gridInfo, variant){
    var cols = Number(gridInfo && gridInfo.cols || 10);
    var rows = Number(gridInfo && gridInfo.rows || 7);
    if(!Number.isInteger(grid) || grid < 1 || grid > cols * rows) return grid;
    var cell = gridToCell(grid, cols);
    var row = cell.row;
    var col = cell.col;
    var shiftA = [0,1,2,0,-1,-2,1,0,-1,2,0,1,0,0];
    var shiftB = [2,0,-2,1,-1,2,0,-1,1,-2,0,2,0,0];
    if(variant === 'mirror-x' || variant === 'mirror-shift-a' || variant === 'mirror-shift-b') col = cols - 1 - col;
    if(variant === 'row-shift-a' || variant === 'mirror-shift-a') col = wrapCol(col + shiftA[row % shiftA.length], cols);
    if(variant === 'row-shift-b' || variant === 'mirror-shift-b') col = wrapCol(col + shiftB[row % shiftB.length], cols);
    if(variant === 'zigzag-a') col = wrapCol(col + (row % 2 === 0 ? 2 : -1), cols);
    if(variant === 'zigzag-b') col = wrapCol(col + (row % 2 === 0 ? -2 : 1), cols);
    return cellToGrid(row, col, cols);
  }
  function applyLayoutVariant(scenario, variant){
    var s = clone(scenario);
    var gridInfo = s.grid || { cols:10, rows:7 };
    asArray(s.nodes).forEach(function(n){ n.grid = transformGrid(n.grid, gridInfo, variant); });
    asArray(s.edges).forEach(function(e){ if(Number.isInteger(e.grid)) e.grid = transformGrid(e.grid, gridInfo, variant); });
    s.metadata = Object.assign({}, s.metadata || {}, { layoutVariant: variant, layoutVariantReady:true });
    return s;
  }

  function chooseTerminologyVariant(seed, forced){
    if(forced && TERMINOLOGY_VARIANTS.indexOf(forced) !== -1) return forced;
    var rnd = seededRandom(seed + ':terms');
    return TERMINOLOGY_VARIANTS[Math.floor(rnd() * TERMINOLOGY_VARIANTS.length)];
  }
  function replaceWords(text, variant){
    var out = String(text == null ? '' : text);
    if(variant === 'neutral') return out;
    var fachlich = [
      ['prüfen','kontrollieren'], ['Prüfen','Kontrollieren'], ['gefunden?','auffindbar?'], ['korrekt?','gültig?'], ['korrekt','gültig'],
      ['erfolgreich?','erfolgreich abgeschlossen?'], ['Betrag vollständig bezahlt?','Zahlung vollständig?'], ['Person öffnet?','Kontakt hergestellt?'],
      ['Paket übergeben','Sendung übergeben'], ['Benachrichtigung einwerfen','Benachrichtigung hinterlegen'], ['Ende: erfolgreich','Abschluss: erfolgreich']
    ];
    var kurz = [
      ['Ende: ','Abschluss: '], ['vollständig','komplett'], ['erfolgreich abgeschlossen?','erfolgreich?'], ['Berechtigung / Zustand korrekt?','Berechtigung ok?'],
      ['Zusatzbedingung erfüllt?','Zusatz ok?'], ['Sonderfall vorhanden?','Sonderfall?'], ['Prüfung an Fachstelle geben','Fachstelle einschalten'],
      ['Vorgang sicher stoppen','Vorgang stoppen'], ['Warten und später erneut prüfen','später erneut prüfen']
    ];
    (variant === 'fachlich' ? fachlich : kurz).forEach(function(pair){ out = out.split(pair[0]).join(pair[1]); });
    return out;
  }
  function applyTerminologyVariant(scenario, variant){
    var s = clone(scenario);
    if(variant === 'neutral'){
      s.metadata = Object.assign({}, s.metadata || {}, { terminologyVariant:variant, terminologyVariantReady:true });
      return s;
    }
    s.title = replaceWords(s.title, variant);
    asArray(s.nodes).forEach(function(n){ n.label = replaceWords(n.label, variant); if(n.renderedLabel) n.renderedLabel = replaceWords(n.renderedLabel, variant); });
    asArray(s.edges).forEach(function(e){ if(e.label !== 'Ja' && e.label !== 'Nein') e.label = replaceWords(e.label, variant); if(e.renderedLabel && e.renderedLabel !== 'Ja' && e.renderedLabel !== 'Nein') e.renderedLabel = replaceWords(e.renderedLabel, variant); });
    asArray(s.conditions).forEach(function(c){ c.label = replaceWords(c.label, variant); });
    asArray(s.routes).forEach(function(r){ r.label = replaceWords(r.label, variant); });
    s.metadata = Object.assign({}, s.metadata || {}, { terminologyVariant:variant, terminologyVariantReady:true });
    return s;
  }
  function createScenarioVariant(baseScenario, seed, options){
    options = options || {};
    var layoutVariant = chooseLayoutVariant(seed, options.layoutVariant);
    var terminologyVariant = chooseTerminologyVariant(seed, options.terminologyVariant);
    var s = applyLayoutVariant(baseScenario, layoutVariant);
    s = applyTerminologyVariant(s, terminologyVariant);
    s.metadata = Object.assign({}, s.metadata || {}, {
      phase: Math.max(Number(s.metadata && s.metadata.phase || 0), 11),
      baseScenarioId: baseScenario.id,
      variantSeed: seed,
      layoutVariant: layoutVariant,
      terminologyVariant: terminologyVariant,
      generatorV2Ready: true,
      antiMemorizationReady: true
    });
    return s;
  }

  function policyForDifficulty(difficulty, overrides){
    var base = validator().mergePolicy ? validator().mergePolicy({}) : Object.assign({}, validator().defaultPolicy || {});
    difficulty = difficulty || 'ctc';
    if(difficulty === 'easy'){
      base.errorCount = 5; base.minZones = 3; base.minRoutes = 2; base.maxPerZone = 2; base.maxPerRoute = 4; base.minRouteLogicRequired = 2; base.minCategoryCounts = { Form:1, Pfeil:1, Inhalt:1 }; base.minUniqueFixCodes = 5;
    }
    if(difficulty === 'training'){
      base.errorCount = 8; base.minZones = 4; base.minRoutes = 3; base.maxPerZone = 3; base.maxPerRoute = 5; base.minRouteLogicRequired = 4; base.minCategoryCounts = { Form:1, Pfeil:2, Inhalt:1 }; base.minUniqueFixCodes = 7;
    }
    if(difficulty === 'ctc' || difficulty === 'exam'){
      base.errorCount = DEFAULT_ERROR_COUNT; base.minZones = 5; base.minRoutes = 4; base.maxPerZone = 3; base.maxPerRoute = 6; base.minRouteLogicRequired = 6; base.minCategoryCounts = { Form:2, Pfeil:2, Inhalt:2 }; base.minUniqueFixCodes = 10;
    }
    if(difficulty === 'hard'){
      base.errorCount = 11; base.minZones = 6; base.minRoutes = 5; base.maxPerZone = 2; base.maxPerRoute = 5; base.minRouteLogicRequired = 7; base.minCategoryCounts = { Form:2, Pfeil:3, Inhalt:3 }; base.minUniqueFixCodes = 11;
    }
    return validator().mergePolicy ? validator().mergePolicy(Object.assign({}, base, overrides || {})) : Object.assign(base, overrides || {});
  }

  function basicAllowed(scenario, item, chosen, policy){
    if(!item || !item.id) return false;
    if(chosen.some(function(x){ return x.id === item.id; })) return false;
    if(policy.noDuplicateTargets !== false && chosen.some(function(x){ return (x.targetType+':'+x.targetId) === (item.targetType+':'+item.targetId); })) return false;
    if(policy.noDuplicateGrids !== false && chosen.some(function(x){ return x.grid === item.grid; })) return false;
    if(policy.blockOrthogonalAdjacentGrids !== false && chosen.some(function(x){ return validator().areOrthogonalAdjacent(x.grid, item.grid, scenario.grid && scenario.grid.cols || 10); })) return false;
    var zones = countBy(chosen.concat([item]), function(x){ return x.zone || ''; });
    if(zones[item.zone] > policy.maxPerZone) return false;
    var routeCounts = countBy([].concat.apply([], chosen.concat([item]).map(function(x){ return asArray(x.routes); })), function(x){ return x; });
    if(asArray(item.routes).some(function(r){ return routeCounts[r] > policy.maxPerRoute; })) return false;
    return true;
  }

  function selectWithSeed(scenario, seed, policy){
    policy = policyForDifficulty(policy && policy.difficulty || 'ctc', policy);
    var all = mutations().candidatesForScenario(scenario);
    var bestFailure = null;
    function remember(report){ if(report && (!bestFailure || asArray(report.errors).length < asArray(bestFailure.errors).length)) bestFailure = report; }
    function counts(list, key){ return countBy(list, function(x){ return x[key] || ''; }); }
    for(var attempt=0; attempt<90; attempt++){
      var attemptSeed = seed + ':select:' + attempt;
      var rnd = seededRandom(attemptSeed);
      var pool = shuffle(all, attemptSeed);
      var chosen = [];
      var minCats = policy.minCategoryCounts || {};
      function chooseFrom(filterFn){
        var candidates = pool.filter(function(item){ return filterFn(item) && basicAllowed(scenario, item, chosen, policy); });
        if(!candidates.length) return false;
        candidates.sort(function(a,b){
          var newZoneA = counts(chosen,'zone')[a.zone] ? 0 : 4;
          var newZoneB = counts(chosen,'zone')[b.zone] ? 0 : 4;
          var newRouteA = asArray(a.routes).some(function(r){ return !counts([].concat.apply([], chosen.map(function(x){ return asArray(x.routes); })), function(x){ return x; })[r]; }) ? 3 : 0;
          var newRouteB = asArray(b.routes).some(function(r){ return !counts([].concat.apply([], chosen.map(function(x){ return asArray(x.routes); })), function(x){ return x; })[r]; }) ? 3 : 0;
          var sa = (a.routeLogicRequired ? 5 : 0) + newZoneA + newRouteA + rnd();
          var sb = (b.routeLogicRequired ? 5 : 0) + newZoneB + newRouteB + rnd();
          return sb - sa;
        });
        var item = candidates[0];
        chosen.push(item);
        pool = pool.filter(function(x){ return x.id !== item.id; });
        return true;
      }
      var catNames = shuffle(Object.keys(minCats), attemptSeed+':cats');
      var catOk = true;
      catNames.forEach(function(cat){
        for(var n=0; n<(minCats[cat] || 0); n++){
          if(!chooseFrom(function(item){ return item.category === cat; })) catOk = false;
        }
      });
      if(!catOk) continue;
      while(chosen.filter(function(x){ return x.routeLogicRequired; }).length < policy.minRouteLogicRequired && chosen.length < policy.errorCount){
        if(!chooseFrom(function(item){ return !!item.routeLogicRequired; })) break;
      }
      while(chosen.length < policy.errorCount){
        if(!chooseFrom(function(){ return true; })) break;
      }
      if(chosen.length !== policy.errorCount) continue;
      var report = validator().validateDistribution(scenario, chosen, policy);
      if(report.ok) return chosen.slice();
      remember(report);
    }
    try { return validator().selectDistributedSet(scenario, policy); }
    catch(err){
      var e = new Error('Generator konnte keine gueltige Variante erzeugen: '+scenario.id);
      e.report = err && err.report ? err.report : bestFailure;
      throw e;
    }
  }

  function answerGridPattern(task){ return asArray(task && task.answerKey).map(function(x){ return x.grid; }).sort(function(a,b){ return a-b; }).join('-'); }
  function makeSignature(scenarioId, selected, variantMeta, task){
    return scenarioId + '::' + (variantMeta.layoutVariant || 'identity') + '::' + (variantMeta.terminologyVariant || 'neutral') + '::' +
      asArray(selected).map(function(m){ return m.id+'@'+m.grid+'#'+m.fixCode; }).sort().join('|') + '::g=' + answerGridPattern(task || { answerKey:selected });
  }

  function createTask(options){
    options = options || {};
    var ids = scenarioIdsFromOptions(options);
    var rnd = seededRandom(options.seed || 'flowlogic-default');
    var scenarioId = options.scenarioId || pick(shuffle(ids, String(options.seed || 'flowlogic')+':scenario-order'), rnd);
    var baseScenario = getScenario(scenarioId);
    var seed = String(options.seed || ('FLOW-' + baseScenario.id + '-' + Date.now()));
    var difficulty = options.difficulty || 'ctc';
    var policy = policyForDifficulty(difficulty, options.policy || {});
    var maxAttempts = Math.max(1, Number(options.maxAttempts || DEFAULT_MAX_ATTEMPTS));
    var lastError = null;
    for(var attempt=0; attempt<maxAttempts; attempt++){
      var attemptSeed = seed + ':attempt:' + attempt;
      try {
        var variantScenario = createScenarioVariant(baseScenario, attemptSeed, options);
        var selected = selectWithSeed(variantScenario, attemptSeed, Object.assign({}, policy, { difficulty:difficulty }));
        var distribution = validator().validateDistribution(variantScenario, selected, policy);
        if(!distribution.ok){ lastError = { message:'Distribution invalid', report:distribution }; continue; }
        var task = mutations().applyMutationSet(variantScenario, selected);
        var variantMeta = { layoutVariant:variantScenario.metadata.layoutVariant, terminologyVariant:variantScenario.metadata.terminologyVariant };
        task.metadata = task.metadata || {};
        task.metadata.phase = Math.max(Number(task.metadata.phase || 0), 11);
        task.metadata.generatorReady = true;
        task.metadata.generatorV2Ready = true;
        task.metadata.generatorVersion = VERSION;
        task.metadata.generatorSeed = seed;
        task.metadata.generatorAttempt = attempt;
        task.metadata.generatorDifficulty = difficulty;
        task.metadata.baseScenarioId = baseScenario.id;
        task.metadata.layoutVariant = variantMeta.layoutVariant;
        task.metadata.terminologyVariant = variantMeta.terminologyVariant;
        task.metadata.selectedMutationIds = selected.map(function(m){ return m.id; });
        task.metadata.selectedGrids = selected.map(function(m){ return m.grid; });
        task.metadata.variantSignature = makeSignature(baseScenario.id, selected, variantMeta, task);
        task.metadata.answerGridPattern = answerGridPattern(task);
        task.metadata.createdAt = nowIso();
        var schemaReport = schema().validateScenario(task);
        if(!schemaReport.ok){ lastError = { message:'Schema invalid', report:schemaReport }; continue; }
        if(window.FlowLogicRenderer && typeof window.FlowLogicRenderer.buildLayout === 'function'){
          var layout = window.FlowLogicRenderer.buildLayout(task);
          var layoutReport = window.FlowLogicRenderer.validateLayout(layout);
          if(!layoutReport.ok){ lastError = { message:'Renderer layout invalid', report:layoutReport }; continue; }
        }
        var scoreReport = scorer().scoreModelSolution(task);
        if(scoreReport.summary.score !== scoreReport.summary.maxScore){ lastError = { message:'Model solution invalid', report:scoreReport }; continue; }
        return { ok:true, scenario:baseScenario, variantScenario:variantScenario, task:task, mutations:selected, seed:seed, attempt:attempt, difficulty:difficulty, signature:task.metadata.variantSignature, layoutVariant:variantMeta.layoutVariant, terminologyVariant:variantMeta.terminologyVariant, gridPattern:task.metadata.answerGridPattern, report:distribution, schemaReport:schemaReport, scoreReport:scoreReport.summary };
      } catch(err){ lastError = { message:err && err.message ? err.message : String(err), error:err, report:err && err.report ? err.report : null }; }
    }
    var fail = new Error('FlowLogic Generator V2 konnte nach '+maxAttempts+' Versuchen keine gueltige Aufgabe erzeugen: '+scenarioId);
    fail.report = lastError;
    throw fail;
  }

  function chooseScenarioForBatch(ids, i, seed){
    var cycle = Math.floor(i / ids.length);
    var order = shuffle(ids, seed + ':cycle:' + cycle);
    return order[i % ids.length];
  }
  function antiMemorizationReport(items, options){
    options = options || {};
    var amount = items.length;
    var signatures = countBy(items, function(x){ return x.signature; });
    var gridPatterns = countBy(items, function(x){ return x.gridPattern; });
    var families = unique(items.map(function(x){ return x.family; }));
    var scenarioSet = unique(items.map(function(x){ return x.scenarioId; }));
    var layoutSet = unique(items.map(function(x){ return x.layoutVariant; }));
    var termSet = unique(items.map(function(x){ return x.terminologyVariant; }));
    var uniqueSignatures = Object.keys(signatures).length;
    var uniqueGridPatterns = Object.keys(gridPatterns).length;
    var duplicateSignatures = Object.keys(signatures).filter(function(k){ return signatures[k] > 1; }).length;
    var duplicateGridPatterns = Object.keys(gridPatterns).filter(function(k){ return gridPatterns[k] > 1; }).length;
    var minScenarios = Math.min(Number(options.minScenarioCoverage || 10), scenarioSet.length || 10, amount);
    var minLayouts = Math.min(Number(options.minLayoutCoverage || 5), LAYOUT_VARIANTS.length, amount);
    var minTerms = Math.min(Number(options.minTerminologyCoverage || 3), TERMINOLOGY_VARIANTS.length, amount);
    var ok = true;
    var warnings = [];
    function require(cond, msg, details){ if(!cond){ ok = false; warnings.push({ message:msg, details:details || null }); } }
    require(scenarioSet.length >= Math.min(minScenarios, unique(scenarioIdsFromOptions(options)).length), 'Zu wenig Szenario-Wechsel im Batch.', { scenarios:scenarioSet });
    require(layoutSet.length >= minLayouts, 'Zu wenig Layout-Variation im Batch.', { layouts:layoutSet });
    require(termSet.length >= minTerms, 'Zu wenig Begriffsvariation im Batch.', { terminology:termSet });
    require(uniqueSignatures >= Math.max(1, Math.floor(amount * 0.70)), 'Zu wenig eindeutige Variantensignaturen.', { uniqueSignatures:uniqueSignatures, amount:amount });
    require(uniqueGridPatterns >= Math.max(1, Math.floor(amount * 0.45)), 'Zu wenig unterschiedliche Fehler-Rastermuster.', { uniqueGridPatterns:uniqueGridPatterns, amount:amount });
    return { ok:ok, amount:amount, scenarios:scenarioSet, families:families, layouts:layoutSet, terminology:termSet, uniqueSignatures:uniqueSignatures, duplicateSignatures:duplicateSignatures, uniqueGridPatterns:uniqueGridPatterns, duplicateGridPatterns:duplicateGridPatterns, warnings:warnings };
  }

  function generateBatch(options){
    options = options || {};
    var amount = Math.max(1, Number(options.amount || 30));
    var ids = scenarioIdsFromOptions(options);
    var seedPrefix = String(options.seed || 'FLOWLOGIC_BATCH_V2');
    var items = [];
    for(var i=0; i<amount; i++){
      var scenarioId = options.scenarioId ? options.scenarioId : chooseScenarioForBatch(ids, i, seedPrefix);
      var built = createTask(Object.assign({}, options, { scenarioId:scenarioId, seed:seedPrefix+':'+scenarioId+':'+i }));
      items.push({
        ok:true,
        scenarioId: scenarioId,
        family: built.task.family,
        seed: built.seed,
        attempt: built.attempt,
        signature: built.signature,
        gridPattern: built.gridPattern,
        layoutVariant: built.layoutVariant,
        terminologyVariant: built.terminologyVariant,
        answerKey: built.task.answerKey.length,
        zones: built.report.summary.zoneCount,
        routes: built.report.summary.routeCount,
        categories: built.report.summary.categories,
        score: built.scoreReport.score,
        maxScore: built.scoreReport.maxScore
      });
    }
    var expectedErrorCount = Number((options.policy && options.policy.errorCount) || policyForDifficulty(options.difficulty || 'ctc', options.policy || {}).errorCount || DEFAULT_ERROR_COUNT);
    var baseOk = items.every(function(x){ return x.ok && x.answerKey === expectedErrorCount && x.score === x.maxScore; });
    var anti = antiMemorizationReport(items, options);
    return Object.assign({ ok: baseOk && (options.skipAntiMemorization ? true : anti.ok), amount:amount, items:items }, anti);
  }

  function selfCheck(options){
    options = options || {};
    var scenarioIds = scenarioIdsFromOptions(options);
    var samples = [];
    scenarioIds.forEach(function(id){
      var built = createTask({ scenarioId:id, seed:'SELFTEST:PHASE11:'+id, difficulty:'ctc' });
      if(!built.ok) throw new Error('Generator-Aufgabe nicht ok: '+id);
      if(built.task.answerKey.length !== DEFAULT_ERROR_COUNT) throw new Error('Generator-Aufgabe hat falsche Fehleranzahl: '+id);
      if(!built.report.ok) throw new Error('Generator-Aufgabe verletzt Verteilungsregeln: '+id);
      if(built.scoreReport.score !== built.scoreReport.maxScore) throw new Error('Musterloesung nicht voll korrekt: '+id);
      samples.push({ scenarioId:id, seed:built.seed, signature:built.signature, layoutVariant:built.layoutVariant, terminologyVariant:built.terminologyVariant, gridPattern:built.gridPattern, zones:built.report.summary.zoneCount, routes:built.report.summary.routeCount });
    });
    var batch = generateBatch({ amount:Number(options.amount || 80), seed:'SELFTEST:PHASE11:BATCH', difficulty:'ctc', scenarioIds:scenarioIds, minScenarioCoverage:Math.min(10, scenarioIds.length), minLayoutCoverage:5, minTerminologyCoverage:3 });
    if(!batch.ok) throw new Error('Generator-V2-Batch nicht ok: '+JSON.stringify(batch.warnings || []));
    return { ok:true, samples:samples, batch:{ amount:batch.amount, uniqueSignatures:batch.uniqueSignatures, uniqueGridPatterns:batch.uniqueGridPatterns, scenarios:batch.scenarios, layouts:batch.layouts, terminology:batch.terminology, warnings:batch.warnings } };
  }

  var api = Object.freeze({
    __version: VERSION,
    moduleId: MODULE_ID,
    hashSeed: hashSeed,
    seededRandom: seededRandom,
    shuffle: shuffle,
    layoutVariants: LAYOUT_VARIANTS,
    terminologyVariants: TERMINOLOGY_VARIANTS,
    transformGrid: transformGrid,
    applyLayoutVariant: applyLayoutVariant,
    applyTerminologyVariant: applyTerminologyVariant,
    createScenarioVariant: createScenarioVariant,
    policyForDifficulty: policyForDifficulty,
    selectWithSeed: selectWithSeed,
    createTask: createTask,
    generateBatch: generateBatch,
    antiMemorizationReport: antiMemorizationReport,
    selfCheck: selfCheck
  });

  window.FlowLogicGenerator = api;

  if(window.FlowLogicSelfTest && typeof window.FlowLogicSelfTest.register === 'function'){
    window.FlowLogicSelfTest.register('phase9.generator-api', 'Phase 9/11: Generator-API vorhanden', function(t){
      t.assert(window.FlowLogicGenerator && window.FlowLogicGenerator.__version.indexOf('G39.26') !== -1, 'FlowLogicGenerator fehlt oder hat falsche Version.');
      t.assert(typeof window.FlowLogicGenerator.createTask === 'function', 'createTask fehlt.');
      t.assert(typeof window.FlowLogicGenerator.generateBatch === 'function', 'generateBatch fehlt.');
      return { version:window.FlowLogicGenerator.__version, layouts:window.FlowLogicGenerator.layoutVariants, terminology:window.FlowLogicGenerator.terminologyVariants };
    }, { phase:'9', critical:true });

    window.FlowLogicSelfTest.register('phase9.generator-single-task-per-scenario', 'Phase 9/11: Generator erzeugt pro Szenario valide 11-Fehler-Aufgaben', function(t){
      var items = [];
      window.FlowLogicScenarios.getAll().forEach(function(s){
        var built = window.FlowLogicGenerator.createTask({ scenarioId:s.id, seed:'SELFTEST:SINGLE:PHASE11:'+s.id, difficulty:'ctc' });
        t.assert(built.ok && built.report.ok, 'Generator-Aufgabe ist nicht valide: '+s.id, built);
        t.assert(built.task.answerKey.length === 11, 'Generator-Aufgabe braucht exakt 11 Fehler: '+s.id, built.task.answerKey);
        t.assert(built.scoreReport.score === built.scoreReport.maxScore, 'Generator-Aufgabe ist nicht voll scoringfaehig: '+s.id, built.scoreReport);
        t.assert(!!built.layoutVariant && !!built.terminologyVariant, 'Generator V2 muss Layout- und Begriffsvariante setzen.', built);
        items.push({ scenarioId:s.id, seed:built.seed, signature:built.signature, layoutVariant:built.layoutVariant, terminologyVariant:built.terminologyVariant, zones:built.report.summary.zoneCount, routes:built.report.summary.routeCount });
      });
      return items;
    }, { phase:'9', critical:true });

    window.FlowLogicSelfTest.register('phase11.generator-v2-anti-memorization', 'Phase 11: Generator V2 variiert Szenario, Layout, Begriffe und Rastermuster', function(t){
      var batch = window.FlowLogicGenerator.generateBatch({ amount:80, seed:'SELFTEST:BATCH:PHASE11:80', difficulty:'ctc', minScenarioCoverage:10, minLayoutCoverage:5, minTerminologyCoverage:3 });
      t.assert(batch.ok, 'Generator-V2-Batch enthaelt ungueltige oder zu aehnliche Aufgaben.', batch);
      t.assert(batch.scenarios.length >= 10, 'Generator muss alle 10 Szenarien nutzen.', batch.scenarios);
      t.assert(batch.layouts.length >= 5, 'Generator muss mehrere Layoutvarianten nutzen.', batch.layouts);
      t.assert(batch.terminology.length >= 3, 'Generator muss mehrere Begriffsvarianten nutzen.', batch.terminology);
      t.assert(batch.uniqueSignatures >= 56, 'Generator V2 liefert zu wenig eindeutige Signaturen.', batch);
      t.assert(batch.uniqueGridPatterns >= 36, 'Generator V2 liefert zu wenig unterschiedliche Rastermuster.', batch);
      return { amount:batch.amount, scenarios:batch.scenarios, layouts:batch.layouts, terminology:batch.terminology, uniqueSignatures:batch.uniqueSignatures, uniqueGridPatterns:batch.uniqueGridPatterns, duplicateSignatures:batch.duplicateSignatures };
    }, { phase:'11', critical:true });

    window.FlowLogicSelfTest.register('phase11.generator-v2-render-sample', 'Phase 11: V2-Varianten bleiben renderbar und scoringfaehig', function(t){
      var samples = [];
      ['flow_master_postbote_nachnahme','flow_master_parksensor','flow_master_login_2fa','flow_master_router_diagnose','flow_master_online_bestellung'].forEach(function(id, idx){
        var built = window.FlowLogicGenerator.createTask({ scenarioId:id, seed:'SELFTEST:RENDER:PHASE11:'+idx, difficulty:'ctc' });
        var layout = window.FlowLogicRenderer.buildLayout(built.task);
        var report = window.FlowLogicRenderer.validateLayout(layout);
        var score = window.FlowLogicScorer.scoreModelSolution(built.task).summary;
        t.assert(report.ok, 'V2-Variante ist nicht renderbar: '+id, report);
        t.assert(score.score === score.maxScore, 'V2-Variante ist nicht scoringfaehig: '+id, score);
        samples.push({ id:id, layoutVariant:built.layoutVariant, terminologyVariant:built.terminologyVariant, gridPattern:built.gridPattern, render:report.summary, score:score });
      });
      return samples;
    }, { phase:'11', critical:true });
  }
})();
