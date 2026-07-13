/* Ablaufplan-Detektiv · FlowLogic Scoring Engine · Phase 11
   Bewertet strukturierte Fehlereintraege deterministisch gegen den Antwortschluessel.
   Freitext/Notiz wird NICHT als harte Wertung genutzt. */
(function(){
  'use strict';

  var VERSION = 'G39.26-FLOWLOGIC-STANDALONE-PHASE12-2026-06-14';
  var MODULE_ID = 'flowlogic';

  function schema(){ if(!window.FlowLogicSchema) throw new Error('FlowLogicSchema fehlt fuer Scoring Engine.'); return window.FlowLogicSchema; }
  function validator(){ if(!window.FlowLogicValidator) throw new Error('FlowLogicValidator fehlt fuer Scoring Engine.'); return window.FlowLogicValidator; }
  function input(){ if(!window.FlowLogicInput) throw new Error('FlowLogicInput fehlt fuer Scoring Engine.'); return window.FlowLogicInput; }
  function clone(value){ return value == null ? value : JSON.parse(JSON.stringify(value)); }
  function asArray(value){ return Array.isArray(value) ? value : []; }
  function nowIso(){ return new Date().toISOString(); }
  function round(value, digits){ var p = Math.pow(10, digits || 2); return Math.round((Number(value) || 0) * p) / p; }

  function taskFrom(taskOrSession){
    if(taskOrSession && taskOrSession.task && taskOrSession.task.nodes) return taskOrSession.task;
    if(taskOrSession && taskOrSession.nodes && taskOrSession.edges) return taskOrSession;
    if(typeof taskOrSession === 'string') return validator().createValidatedTask(taskOrSession).task;
    throw new Error('FlowLogicScorer braucht eine Aufgabe oder Session.');
  }

  function answersFrom(taskOrSession, answers){
    if(Array.isArray(answers)) return answers;
    if(taskOrSession && Array.isArray(taskOrSession.answers)) return taskOrSession.answers;
    return [];
  }

  function normalizeAnswer(answer, index){
    answer = answer || {};
    return {
      id: answer.id || ('answer_'+index),
      index: index,
      grid: answer.grid === '' || answer.grid == null ? null : Number(answer.grid),
      category: String(answer.category || '').trim(),
      errorType: String(answer.errorType || '').trim(),
      fixCode: String(answer.fixCode || '').trim(),
      note: String(answer.note || '').trim()
    };
  }

  function normalizeKey(item, index){
    item = item || {};
    return {
      id: item.id || ('key_'+index),
      index: index,
      targetType: item.targetType || '',
      targetId: item.targetId || '',
      grid: Number(item.grid),
      category: String(item.category || '').trim(),
      errorType: String(item.errorType || '').trim(),
      fixCode: String(item.fixCode || '').trim(),
      expected: String(item.expected || '').trim(),
      zone: item.zone || '',
      routes: asArray(item.routes).slice(),
      mutationId: item.mutationId || '',
      routeLogicRequired: !!item.routeLogicRequired
    };
  }

  function answerKey(task){
    return asArray(task && task.answerKey).map(normalizeKey);
  }

  function answerSignature(answer){
    return [answer.grid || '', answer.category || '', answer.errorType || '', answer.fixCode || ''].join('|');
  }

  function buildStats(keys){
    var cats = Object.create(null);
    var types = Object.create(null);
    var zones = Object.create(null);
    function ensure(map, name){
      if(!map[name]) map[name] = { expected:0, correct:0, partial:0, wrong:0, missed:0, score:0, max:0, percentage:0 };
      return map[name];
    }
    keys.forEach(function(k){
      var c = ensure(cats, k.category || 'Unbekannt'); c.expected += 1; c.max += 1;
      var t = ensure(types, k.errorType || 'Unbekannt'); t.expected += 1; t.max += 1;
      var z = ensure(zones, k.zone || 'Unbekannt'); z.expected += 1; z.max += 1;
    });
    return { categories:cats, errorTypes:types, zones:zones };
  }

  function markStat(bucket, name, status, points){
    if(!bucket[name]) bucket[name] = { expected:0, correct:0, partial:0, wrong:0, missed:0, score:0, max:0, percentage:0 };
    if(status === 'correct') bucket[name].correct += 1;
    else if(status === 'partial') bucket[name].partial += 1;
    else if(status === 'wrong') bucket[name].wrong += 1;
    else if(status === 'missed') bucket[name].missed += 1;
    bucket[name].score += Number(points || 0);
  }

  function finalizeStats(map){
    Object.keys(map).forEach(function(key){
      var item = map[key];
      item.score = round(item.score, 2);
      item.percentage = item.max ? round((item.score / item.max) * 100, 1) : 0;
    });
    return map;
  }

  function bestMatch(answer, keys, usedKeyIds){
    var available = keys.filter(function(k){ return !usedKeyIds[k.id]; });
    var full = available.filter(function(k){
      return k.grid === answer.grid && k.category === answer.category && k.errorType === answer.errorType && k.fixCode === answer.fixCode;
    })[0];
    if(full) return { status:'correct', points:1, key:full, reason:'FULL_MATCH' };

    var partial = available.filter(function(k){
      return k.grid === answer.grid && k.category === answer.category && (k.errorType === answer.errorType || k.fixCode === answer.fixCode);
    })[0];
    if(partial) return { status:'partial', points:0.5, key:partial, reason: partial.fixCode === answer.fixCode ? 'PARTIAL_FIXCODE_MATCH' : 'PARTIAL_ERRORTYPE_MATCH' };

    var gridOnly = available.filter(function(k){ return k.grid === answer.grid; })[0];
    if(gridOnly) return { status:'wrong', points:0, key:gridOnly, reason:'GRID_MATCH_BUT_CATEGORY_OR_FIX_WRONG' };

    return { status:'wrong', points:0, key:null, reason:'NO_MATCHING_ERROR_AT_GRID' };
  }

  function validateAnswerShape(task, answer){
    var report = { ok:true, errors:[], warnings:[] };
    var maxGrid = ((task.grid && task.grid.cols) || 10) * ((task.grid && task.grid.rows) || 7);
    var constants = schema().constants || {};
    var categories = asArray(constants.ERROR_CATEGORIES);
    var errorTypes = asArray(constants.ERROR_TYPES);
    var fixCodes = Object.create(null);
    answerKey(task).forEach(function(k){ if(k.fixCode) fixCodes[k.fixCode] = true; });
    function err(code, message, details){ report.ok = false; report.errors.push({ code:code, message:message, details:details || null }); }
    if(!Number.isInteger(answer.grid) || answer.grid < 1 || answer.grid > maxGrid) err('SCORE_GRID_INVALID', 'Rasterfeld ist ungueltig.', { grid:answer.grid, maxGrid:maxGrid });
    if(categories.indexOf(answer.category) === -1) err('SCORE_CATEGORY_INVALID', 'Kategorie ist ungueltig.', { category:answer.category });
    if(errorTypes.indexOf(answer.errorType) === -1) err('SCORE_ERRORTYPE_INVALID', 'Fehlertyp ist ungueltig.', { errorType:answer.errorType });
    if(!fixCodes[answer.fixCode]) err('SCORE_FIXCODE_INVALID', 'Korrektur-Code gehoert nicht zum Antwortschluessel dieser Aufgabe.', { fixCode:answer.fixCode });
    return report;
  }

  function score(taskOrSession, answers, options){
    options = options || {};
    var task = taskFrom(taskOrSession);
    var rawAnswers = answersFrom(taskOrSession, answers);
    var keys = answerKey(task);
    var usedKeyIds = Object.create(null);
    var seenAnswerSignatures = Object.create(null);
    var seenAnswerGrids = Object.create(null);
    var stats = buildStats(keys);
    var results = [];
    var totalScore = 0;

    rawAnswers.map(normalizeAnswer).forEach(function(answer){
      var signature = answerSignature(answer);
      var duplicateSignature = !!seenAnswerSignatures[signature];
      var duplicateGrid = !!seenAnswerGrids[String(answer.grid)];
      seenAnswerSignatures[signature] = true;
      seenAnswerGrids[String(answer.grid)] = true;
      var shape = validateAnswerShape(task, answer);
      if(!shape.ok){
        results.push({ answer:answer, status:'invalid', points:0, reason:'INVALID_ANSWER_SHAPE', validation:shape, matchedKeyId:null, expected:null });
        return;
      }
      if(duplicateSignature || duplicateGrid){
        results.push({ answer:answer, status:'duplicate', points:0, reason: duplicateGrid ? 'DUPLICATE_GRID' : 'DUPLICATE_ANSWER', matchedKeyId:null, expected:null });
        return;
      }
      var match = bestMatch(answer, keys, usedKeyIds);
      if(match.key && (match.status === 'correct' || match.status === 'partial')) usedKeyIds[match.key.id] = true;
      var points = Number(match.points || 0);
      totalScore += points;
      if(match.key){
        markStat(stats.categories, match.key.category || 'Unbekannt', match.status, points);
        markStat(stats.errorTypes, match.key.errorType || 'Unbekannt', match.status, points);
        markStat(stats.zones, match.key.zone || 'Unbekannt', match.status, points);
      }
      results.push({
        answer:answer,
        status:match.status,
        points:points,
        reason:match.reason,
        matchedKeyId:match.key ? match.key.id : null,
        expected:match.key ? {
          grid:match.key.grid,
          category:match.key.category,
          errorType:match.key.errorType,
          fixCode:match.key.fixCode,
          expected:match.key.expected,
          zone:match.key.zone,
          routes:match.key.routes
        } : null
      });
    });

    var missing = keys.filter(function(k){ return !usedKeyIds[k.id]; });
    missing.forEach(function(k){
      markStat(stats.categories, k.category || 'Unbekannt', 'missed', 0);
      markStat(stats.errorTypes, k.errorType || 'Unbekannt', 'missed', 0);
      markStat(stats.zones, k.zone || 'Unbekannt', 'missed', 0);
    });

    var maxScore = keys.length;
    var summary = {
      score: round(totalScore, 2),
      maxScore: maxScore,
      percentage: maxScore ? round((totalScore / maxScore) * 100, 1) : 0,
      expectedErrors: keys.length,
      submittedAnswers: rawAnswers.length,
      correct: results.filter(function(r){ return r.status === 'correct'; }).length,
      partial: results.filter(function(r){ return r.status === 'partial'; }).length,
      wrong: results.filter(function(r){ return r.status === 'wrong'; }).length,
      invalid: results.filter(function(r){ return r.status === 'invalid'; }).length,
      duplicate: results.filter(function(r){ return r.status === 'duplicate'; }).length,
      missed: missing.length,
      passed70: maxScore ? (totalScore / maxScore) >= 0.70 : false
    };

    return {
      ok:true,
      version:VERSION,
      module:MODULE_ID,
      generatedAt:nowIso(),
      taskId:task.id,
      title:task.title,
      scenarioFamily:task.family,
      mode: taskOrSession && taskOrSession.mode || options.mode || 'unknown',
      summary:summary,
      categoryStats:finalizeStats(stats.categories),
      errorTypeStats:finalizeStats(stats.errorTypes),
      zoneStats:finalizeStats(stats.zones),
      results:results,
      missing:missing.map(function(k){
        return { id:k.id, grid:k.grid, category:k.category, errorType:k.errorType, fixCode:k.fixCode, expected:k.expected, zone:k.zone, routes:k.routes };
      }),
      hardScoringNote:'Freitext/Notiz wurde nicht fuer die harte Wertung genutzt. Bewertet wurden Raster, Kategorie, Fehlertyp und Korrektur-Code.'
    };
  }

  function scoreSession(session, options){
    return score(session, null, options || {});
  }

  function makeModelAnswers(taskOrSession){
    var task = taskFrom(taskOrSession);
    return answerKey(task).map(function(k){
      return {
        id:'model_'+k.id,
        grid:k.grid,
        category:k.category,
        errorType:k.errorType,
        fixCode:k.fixCode,
        note:k.expected || 'Musterloesung'
      };
    });
  }

  function makeEmptyResult(taskOrSession){
    return score(taskOrSession, []);
  }

  function scoreModelSolution(taskOrScenarioId){
    var task = taskFrom(taskOrScenarioId);
    return score(task, makeModelAnswers(task), { mode:'model' });
  }

  function scoreWrongCategoryProbe(taskOrScenarioId){
    var task = taskFrom(taskOrScenarioId);
    var keys = answerKey(task);
    if(!keys.length) throw new Error('WrongCategoryProbe braucht Antwortschluessel.');
    var first = keys[0];
    var cats = asArray(schema().constants.ERROR_CATEGORIES).filter(function(cat){ return cat !== first.category; });
    return score(task, [{ grid:first.grid, category:cats[0] || 'Form', errorType:first.errorType, fixCode:first.fixCode, note:'Kategorie absichtlich falsch' }], { mode:'probe' });
  }

  function scorePartialProbe(taskOrScenarioId){
    var task = taskFrom(taskOrScenarioId);
    var keys = answerKey(task);
    if(keys.length < 2) throw new Error('PartialProbe braucht mindestens 2 Antwortschluessel.');
    var first = keys[0];
    var replacement = keys.filter(function(k){ return k.fixCode !== first.fixCode; })[0] || keys[1];
    return score(task, [{ grid:first.grid, category:first.category, errorType:first.errorType, fixCode:replacement.fixCode, note:'Fix-Code absichtlich falsch, Fehlerart korrekt' }], { mode:'probe' });
  }

  function assertScoringInvariant(task, report){
    if(!report || !report.summary) throw new Error('Scoring-Report fehlt.');
    if(report.summary.score < 0) throw new Error('Score darf nicht negativ sein.');
    if(report.summary.score > report.summary.maxScore) throw new Error('Score darf MaxScore nicht uebersteigen.');
    if(report.summary.maxScore !== answerKey(task).length) throw new Error('MaxScore muss Antwortschluessel-Laenge entsprechen.');
    return true;
  }

  function selfCheck(){
    var output = [];
    validator().validateAllScenarioPools().items.forEach(function(item){
      if(!item.ok) throw new Error('SelfCheck kann Szenario nicht validieren: '+item.scenarioId);
      var task = validator().createValidatedTask(item.scenarioId).task;
      var model = scoreModelSolution(task);
      assertScoringInvariant(task, model);
      if(model.summary.score !== model.summary.maxScore) throw new Error('Musterloesung ergibt nicht volle Punktzahl: '+item.scenarioId);
      var empty = makeEmptyResult(task);
      if(empty.summary.score !== 0 || empty.summary.missed !== model.summary.maxScore) throw new Error('Leere Loesung wird falsch bewertet: '+item.scenarioId);
      var wrongCat = scoreWrongCategoryProbe(task);
      if(wrongCat.summary.score !== 0) throw new Error('Falsche Kategorie darf keine Punkte geben: '+item.scenarioId);
      var partial = scorePartialProbe(task);
      if(partial.summary.score !== 0.5) throw new Error('Teilantwort muss 0,5 Punkte ergeben: '+item.scenarioId+' / '+partial.summary.score);
      output.push({ scenarioId:item.scenarioId, model:model.summary.score+'/'+model.summary.maxScore, empty:empty.summary.score, wrongCategory:wrongCat.summary.score, partial:partial.summary.score });
    });
    return { ok:true, scenarios:output.length, items:output };
  }

  var api = Object.freeze({
    __version: VERSION,
    moduleId: MODULE_ID,
    score: score,
    scoreSession: scoreSession,
    makeModelAnswers: makeModelAnswers,
    makeEmptyResult: makeEmptyResult,
    scoreModelSolution: scoreModelSolution,
    scoreWrongCategoryProbe: scoreWrongCategoryProbe,
    scorePartialProbe: scorePartialProbe,
    assertScoringInvariant: assertScoringInvariant,
    selfCheck: selfCheck
  });

  window.FlowLogicScorer = api;

  if(window.FlowLogicSelfTest && typeof window.FlowLogicSelfTest.register === 'function'){
    window.FlowLogicSelfTest.register('phase8.scorer-api', 'Phase 8: Scoring-API vorhanden', function(t){
      t.assert(window.FlowLogicScorer && window.FlowLogicScorer.__version.indexOf('G39.26') !== -1, 'FlowLogicScorer fehlt oder hat falsche Version.');
      t.assert(typeof window.FlowLogicScorer.scoreSession === 'function', 'scoreSession fehlt.');
      t.assert(typeof window.FlowLogicScorer.makeModelAnswers === 'function', 'makeModelAnswers fehlt.');
      return { version:window.FlowLogicScorer.__version };
    }, { phase:'8', critical:true });

    window.FlowLogicSelfTest.register('phase8.model-solution-full-score', 'Phase 8: Musterloesung ergibt fuer jedes Master-Szenario volle Punktzahl', function(t){
      var items = [];
      window.FlowLogicScenarios.getAll().forEach(function(s){
        var built = window.FlowLogicValidator.createValidatedTask(s.id);
        var report = window.FlowLogicScorer.scoreModelSolution(built.task);
        t.assert(report.summary.score === report.summary.maxScore, 'Musterloesung nicht voll korrekt: '+s.id, report.summary);
        t.assert(report.summary.correct === report.summary.maxScore, 'Correct-Zaehler falsch: '+s.id, report.summary);
        items.push({ scenarioId:s.id, score:report.summary.score, max:report.summary.maxScore, percentage:report.summary.percentage });
      });
      return items;
    }, { phase:'8', critical:true });

    window.FlowLogicSelfTest.register('phase8.empty-and-wrong-category-zero', 'Phase 8: Leere Loesung und falsche Kategorie ergeben keine Punkte', function(t){
      var built = window.FlowLogicValidator.createValidatedTask('flow_master_postbote_nachnahme');
      var empty = window.FlowLogicScorer.makeEmptyResult(built.task);
      t.assert(empty.summary.score === 0 && empty.summary.missed === built.task.answerKey.length, 'Leere Loesung falsch bewertet.', empty.summary);
      var wrong = window.FlowLogicScorer.scoreWrongCategoryProbe(built.task);
      t.assert(wrong.summary.score === 0, 'Falsche Kategorie wurde faelschlich bepunktet.', wrong.summary);
      return { empty:empty.summary, wrongCategory:wrong.summary };
    }, { phase:'8', critical:true });

    window.FlowLogicSelfTest.register('phase8.partial-and-duplicate-safe', 'Phase 8: Teilpunkte und Doppelantworten werden kontrolliert bewertet', function(t){
      var built = window.FlowLogicValidator.createValidatedTask('flow_master_login_2fa');
      var partial = window.FlowLogicScorer.scorePartialProbe(built.task);
      t.assert(partial.summary.score === 0.5 && partial.summary.partial === 1, 'Teilantwort wurde nicht mit 0,5 bewertet.', partial.summary);
      var model = window.FlowLogicScorer.makeModelAnswers(built.task);
      var duplicateSet = [model[0], model[0]];
      var dup = window.FlowLogicScorer.score(built.task, duplicateSet);
      t.assert(dup.summary.score === 1 && dup.summary.duplicate === 1, 'Doppelantwort wurde nicht neutralisiert.', dup.summary);
      return { partial:partial.summary, duplicate:dup.summary };
    }, { phase:'8', critical:true });

    window.FlowLogicSelfTest.register('phase8.score-session-no-mutation', 'Phase 8: Scoring veraendert Session und Aufgabe nicht', function(t){
      var built = window.FlowLogicValidator.createValidatedTask('flow_master_parksensor');
      var session = window.FlowLogicInput.createSession(built.task, { mode:'selftest' });
      var model = window.FlowLogicScorer.makeModelAnswers(built.task);
      model.forEach(function(a){ window.FlowLogicInput.addAnswer(session, a); });
      var before = JSON.stringify(session);
      var report = window.FlowLogicScorer.scoreSession(session);
      var after = JSON.stringify(session);
      t.assert(before === after, 'Scoring darf Session nicht mutieren.');
      t.assert(report.summary.score === report.summary.maxScore, 'Session-Musterloesung nicht voll korrekt.', report.summary);
      return { score:report.summary.score, max:report.summary.maxScore };
    }, { phase:'8', critical:true });
  }
})();
