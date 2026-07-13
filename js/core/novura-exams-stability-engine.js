/* Novura · Novura Exams Simulation Stability Engine · G54.3
   QA-/Hardening-Grenze für Simulation → IT/FISI → Novura Exams. Prüft Scope, Zeiten,
   Spezialaufgabentypen und verbietet versehentliche Nutzung außerhalb Novura Exams. */
(function(){
  'use strict';
  var VERSION = 'G54.3-phase27-novura-exams-stability-hardening';
  if (window.NovuraExamsStabilityEngine && window.NovuraExamsStabilityEngine.__version === VERSION) return;

  var STRICT_PROFILE = Object.freeze({ branch:'it', simType:'novuraExams', pool:'it-novura-exams', poolKey:'it-novura-exams', mode:'novuraExams' });
  var EXPECTED = Object.freeze({
    totalCount: 62,
    totalSeconds: 1978,
    blocks: Object.freeze({
      generalKnowledge: { count:40, seconds:420 },
      mathSprint: { count:9, seconds:198 },
      ruleArithmetic: { count:6, seconds:240, type:'novuraExamsRuleArithmeticInput', noMultipleChoice:true, noFractionBar:true },
      letterScan: { count:4, seconds:160, type:'novuraExamsLetterScanInput', noMultipleChoice:true },
      coordinateTable: { count:2, seconds:180, type:'novuraExamsCoordinateTableInput', noMultipleChoice:true },
      flowLogic: { count:1, seconds:780, type:'novuraExamsFlowLogic', specialTimeSeconds:780 }
    })
  });

  function examEngine(){ return window.NovuraExamsStructureEngine || window.NovuraExamsStructureEngine || window.NovuraExamsStructureEngine || null; }
  function clone(o){ try { return JSON.parse(JSON.stringify(o)); } catch(e){ return o; } }
  function isItNovuraExamsScope(input){
    input = input || {};
    var profile = input.questionProfile || input.profile || input;
    var branch = String(input.branch || profile.branch || '');
    var mode = String(input.mode || profile.mode || '');
    var pool = String(input.pool || input.poolKey || profile.pool || profile.poolKey || '');
    var simType = String(input.simType || profile.simType || '');
    return branch === 'it' && mode === 'novuraExams' && pool === 'it-novura-exams' && simType === 'novuraExams';
  }
  function canUseFlowLogic(input){ return isItNovuraExamsScope(input); }
  function assertScope(input){
    if (!isItNovuraExamsScope(input)) {
      return { ok:false, reason:'blocked-outside-simulation-it-novura-exams', expected:clone(STRICT_PROFILE), got:clone(input || {}) };
    }
    return { ok:true, reason:'allowed-simulation-it-novura-exams' };
  }
  function questionsFor(input){
    var engine = examEngine();
    if (!engine || typeof engine.createExam !== 'function') return [];
    return engine.createExam(Object.assign({}, STRICT_PROFILE, input || {})).filter(Boolean);
  }
  function summarize(questions){
    var byBlock = {};
    var totalSeconds = 0;
    (questions || []).forEach(function(q){
      var key = q.novuraExamsBlockKey || q.block || 'unknown';
      if (!byBlock[key]) byBlock[key] = { count:0, seconds:0, types:{}, helpViolations:0, coachViolations:0, mcInputViolations:0, fractionBarViolations:0 };
      byBlock[key].count += 1;
      byBlock[key].seconds += Number(q.specialTimeSeconds || q.time || 0);
      totalSeconds += Number(q.specialTimeSeconds || q.time || 0);
      byBlock[key].types[q.type || 'unknown'] = (byBlock[key].types[q.type || 'unknown'] || 0) + 1;
      if (q.helpAllowed !== false) byBlock[key].helpViolations += 1;
      if (q.coachDuring !== false) byBlock[key].coachViolations += 1;
      if ((q.type === 'novuraExamsRuleArithmeticInput' || q.type === 'novuraExamsLetterScanInput' || q.type === 'novuraExamsCoordinateTableInput') && Array.isArray(q.a) && q.a.length > 1) byBlock[key].mcInputViolations += 1;
      if (q.type === 'novuraExamsRuleArithmeticInput' && /[-_=]{3,}|<hr|fraction|frac|brucht/i.test(String(q.formula || '') + String(q.q || ''))) byBlock[key].fractionBarViolations += 1;
    });
    return { totalCount:(questions || []).length, totalSeconds:totalSeconds, byBlock:byBlock };
  }
  function validate(input){
    var scope = assertScope(Object.assign({}, STRICT_PROFILE, input || {}));
    var questions = questionsFor(input);
    var summary = summarize(questions);
    var errors = [];
    if (!scope.ok) errors.push(scope.reason);
    if (summary.totalCount !== EXPECTED.totalCount) errors.push('total-count-mismatch:'+summary.totalCount);
    if (summary.totalSeconds !== EXPECTED.totalSeconds) errors.push('total-seconds-mismatch:'+summary.totalSeconds);
    Object.keys(EXPECTED.blocks).forEach(function(key){
      var exp = EXPECTED.blocks[key];
      var got = summary.byBlock[key] || { count:0, seconds:0, types:{}, helpViolations:0, coachViolations:0, mcInputViolations:0, fractionBarViolations:0 };
      if (got.count !== exp.count) errors.push(key+':count-mismatch:'+got.count);
      if (got.seconds !== exp.seconds) errors.push(key+':seconds-mismatch:'+got.seconds);
      if (exp.type && !got.types[exp.type]) errors.push(key+':type-missing:'+exp.type);
      if (got.helpViolations) errors.push(key+':help-violations:'+got.helpViolations);
      if (got.coachViolations) errors.push(key+':coach-violations:'+got.coachViolations);
      if (got.mcInputViolations) errors.push(key+':mc-input-violations:'+got.mcInputViolations);
      if (got.fractionBarViolations) errors.push(key+':fractionbar-violations:'+got.fractionBarViolations);
    });
    return { ok:errors.length === 0, errors:errors, summary:summary, version:VERSION };
  }
  function negativeScopeMatrix(){
    var cases = [
      { label:'it-assessments', branch:'it', simType:'assessments', pool:'it-assessments', mode:'assessments' },
      { label:'sozial-assessments', branch:'sozial', simType:'assessments', pool:'sozial-assessments', mode:'assessments' },
      { label:'kauf-assessments', branch:'kauf', simType:'assessments', pool:'kauf-assessments', mode:'assessments' },
      { label:'training-it', branch:'it', simType:'training', pool:'it-training', mode:'training' },
      { label:'single-training', branch:'general', simType:'training', pool:'single', mode:'training' },
      { label:'it-novura-exams', branch:'it', simType:'novuraExams', pool:'it-novura-exams', mode:'novuraExams' }
    ];
    return cases.map(function(c){ return Object.assign({}, c, { allowed:isItNovuraExamsScope(c), flowLogicAllowed:canUseFlowLogic(c) }); });
  }
  function diagnostics(){
    var engine = examEngine();
    return { version:VERSION, examEngineVersion: engine && engine.__version || null, expected:clone(EXPECTED), validate:validate().ok, negativeScopeMatrix:negativeScopeMatrix() };
  }

  window.NovuraExamsStabilityEngine = { __version:VERSION, expected:EXPECTED, strictProfile:STRICT_PROFILE, isItNovuraExamsScope:isItNovuraExamsScope, canUseFlowLogic:canUseFlowLogic, assertScope:assertScope, summarize:summarize, validate:validate, negativeScopeMatrix:negativeScopeMatrix, diagnostics:diagnostics };
  window.NovuraExamsStabilityEngine = window.NovuraExamsStabilityEngine;
  window.NovuraExamsStabilityEngine = window.NovuraExamsStabilityEngine;
})();
