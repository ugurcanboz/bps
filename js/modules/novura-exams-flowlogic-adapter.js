/* Novura · Novura Exams FlowLogic Adapter
   Zweck: FlowLogic NUR in Simulation → IT/FISI → Novura Exams integrieren.
   Kein Training, kein Novura Assessments, kein Sozial, kein Kaufmännisch, kein Einzeltraining. */
(function(){
  'use strict';

  var VERSION = 'G54.3-phase27-novura-exams-flowlogic-adapter';
  var TASK_TYPE = 'novuraExamsFlowLogic';
  var TIME_SECONDS = 13 * 60;
  var INJECT_INDEX = 61; // Finalblock: Novura Exams-Logik nach Allgemeinwissen, Mathe, Regelrechnung, Buchstaben und Tabellen.

  function clone(value){ try { return JSON.parse(JSON.stringify(value)); } catch(e){ return value; } }
  function esc(value){ return String(value == null ? '' : value).replace(/[&<>"']/g, function(ch){ return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[ch]; }); }
  function activeProfile(){
    try { if(window.EGT_ACTIVE_SIMULATION_PROFILE) return window.EGT_ACTIVE_SIMULATION_PROFILE; } catch(e0) {}
    try { if(window.ProductStructureEngine && ProductStructureEngine.diagnostics) return ProductStructureEngine.diagnostics().activeSimulationProfile; } catch(e1) {}
    return null;
  }
  function activeQuestionProfile(){
    try { if(window.EGT_ACTIVE_QUESTION_PROFILE) return window.EGT_ACTIVE_QUESTION_PROFILE; } catch(e0) {}
    return null;
  }
  function normalizedScope(input){
    input = input || {};
    var sim = input.profile || activeProfile() || {};
    var qp = input.questionProfile || activeQuestionProfile() || {};
    return {
      branch: String(input.branch || sim.branch || qp.branch || '').toLowerCase(),
      simType: String(input.simType || sim.simType || sim.testType || '').toLowerCase(),
      mode: String(input.mode || sim.mode || qp.mode || '').trim(),
      pool: String(input.pool || sim.pool || sim.poolKey || qp.poolKey || '').toLowerCase(),
      source: input.source || 'novura-exams-flowlogic-adapter'
    };
  }
  function isStrictItNovuraExamsScope(input){
    var s = normalizedScope(input || {});
    return s.branch === 'it' && s.mode === 'novuraExams' && (s.simType === 'novuraExams' || s.pool === 'it-novura-exams') && s.pool === 'it-novura-exams';
  }
  function shouldInject(payload){
    payload = payload || {};
    if(!isStrictItNovuraExamsScope(payload)) return false;
    var index = Number(payload.index || 0);
    return index === INJECT_INDEX;
  }
  function assertDependencies(){
    var missing = [];
    ['FlowLogicGenerator','FlowLogicInput','FlowLogicScorer','FlowLogicRenderer','FlowLogicValidator'].forEach(function(name){ if(!window[name]) missing.push(name); });
    if(missing.length) throw new Error('FlowLogic nicht vollständig geladen: ' + missing.join(', '));
  }
  function createTask(seed){
    assertDependencies();
    var built = window.FlowLogicGenerator.createTask({
      difficulty: 'novuraExams',
      seed: seed || ('it-novura-exams-flowlogic-' + Date.now()),
      minErrorCount: 11,
      maxErrorCount: 11,
      expectedErrorCount: 11
    });
    if(!built || !built.ok || !built.task) throw new Error('FlowLogic konnte keine gültige Novura Exams-Aufgabe erzeugen.');
    return built;
  }
  function createQuestion(payload){
    payload = payload || {};
    if(!isStrictItNovuraExamsScope(payload)) {
      throw new Error('Novura Exams FlowLogic blockiert: Aufgabe darf nur in Simulation → IT/FISI → Novura Exams erzeugt werden.');
    }
    var seed = 'G54.3|it|novuraExams|flowlogic|' + String(payload.index || INJECT_INDEX) + '|' + String(payload.total || 62) + '|' + Math.floor(Date.now() / 1000);
    var built = createTask(seed);
    var task = built.task;
    var session = window.FlowLogicInput.createSession(task, { mode:'novura-exams' });
    return {
      id: 'novura_exams_flowlogic_' + String(task.id || 'task') + '_' + Math.abs(String(built.signature || seed).split('').reduce(function(a,c){ return ((a << 5) - a + c.charCodeAt(0)) | 0; }, 0)).toString(36),
      type: TASK_TYPE,
      cat: 'Novura Exams-Logik: Wenn-Dann-Ablauf',
      group: 'Logik',
      block: '6. Novura Exams-Logik: Wenn-Dann-Ablauf',
      q: '<b>Novura Exams-Logik: Wenn-Dann-Ablauf</b><br><span class="small">Finde die versteckten Fehler im Ablaufplan. Handlung = Quadrat/Rechteck, Frage = Raute, Ja/Nein = Pfeile. Prüfe Form, Inhalt und Pfeilrichtung.</span>',
      a: ['Ablaufplan-Fehlersuche'],
      correct: 0,
      ex: 'Diese Novura Exams-Aufgabe bewertet strukturierte Fehler in Form, Inhalt und Ja/Nein-Pfeilen.',
      time: TIME_SECONDS,
      specialTimeSeconds: TIME_SECONDS,
      helpAllowed: false,
      coachDuring: false,
      branch: 'it',
      simType: 'novuraExams',
      poolKey: 'it-novura-exams',
      novuraExamsOnly: true,
      flowLogicTask: task,
      flowLogicSession: session,
      flowLogicMeta: {
        title: 'Novura Exams-Logik: Wenn-Dann-Ablauf',
        subtitle: 'Finde die versteckten Fehler.',
        expectedErrors: session.options && session.options.maxAnswers || 11,
        timeSeconds: TIME_SECONDS,
        adapterVersion: VERSION,
        generatorSignature: built.signature,
        scenarioId: task.id,
        source: 'simulation-it-novura-exams-only'
      },
      signature: 'novura-exams-flowlogic|' + String(task.id || '') + '|' + String(built.signature || seed)
    };
  }
  function introHtml(question){
    var meta = question && question.flowLogicMeta || {};
    return ''+
      '<section class="novura-exams-flowlogic-intro" aria-label="Novura Exams FlowLogic Einführung">'+
        '<div class="novura-exams-flowlogic-title"><span>⚡</span><div><b>Novura Exams-Logik: Wenn-Dann-Ablauf</b><small>Finde die versteckten Fehler.</small></div></div>'+ 
        '<div class="novura-exams-flowlogic-rules">'+
          '<div><b>▭ Handlung</b><span>Quadrat/Rechteck = Aktion, z. B. „Paket übergeben“</span></div>'+ 
          '<div><b>◇ Frage</b><span>Raute = Entscheidung, z. B. „Adresse korrekt?“</span></div>'+ 
          '<div><b>Ja/Nein</b><span>Pfeile = logischer Weg. Ja muss zum Ja-Fall, Nein zum Nein-Fall führen.</span></div>'+ 
        '</div>'+ 
        '<div class="novura-exams-flowlogic-example"><b>Mini-Beispiel:</b> Frage „Passwort korrekt?“ → <b>Ja</b> führt zu „Login erlauben“, <b>Nein</b> führt zu „Fehler anzeigen“. Wenn ein Pfeil vertauscht ist, ist das ein Logikfehler.</div>'+ 
        '<div class="novura-exams-flowlogic-time">Zeit für diese Aufgabe: <b>13 Minuten</b> · Erwartete Fehler: <b>'+esc(meta.expectedErrors || 11)+'</b> · keine Hilfe</div>'+ 
      '</section>';
  }
  function renderTo(container, question, options){
    assertDependencies();
    if(!container) return null;
    var q = question || {};
    if(!q.flowLogicTask){
      var built = createTask('render-fallback-' + Date.now());
      q.flowLogicTask = built.task;
      q.flowLogicSession = window.FlowLogicInput.createSession(built.task, { mode:'novura-exams' });
    }
    if(!q.flowLogicSession) q.flowLogicSession = window.FlowLogicInput.createSession(q.flowLogicTask, { mode:'novura-exams' });
    container.innerHTML = introHtml(q) + '<div class="novura-exams-flowlogic-host" data-novura-exams-flowlogic-host></div>';
    var host = container.querySelector('[data-novura-exams-flowlogic-host]');
    var handle = window.FlowLogicInput.renderTo(host, q.flowLogicSession, Object.assign({ mode:'novura-exams', rendererOptions:{ compact:true } }, options || {}));
    q.flowLogicHandle = handle;
    try { host.querySelectorAll('.flowlogic-eyebrow').forEach(function(el){ el.textContent = 'Novura Exams · Fehlersuche'; }); } catch(e) {}
    return handle;
  }
  function summaryFromSession(session){
    assertDependencies();
    var report = window.FlowLogicScorer.scoreSession(session || {});
    return report || { summary:{ score:0, maxScore:11, percentage:0 } };
  }
  function diagnostics(){
    return {
      ok: true,
      version: VERSION,
      taskType: TASK_TYPE,
      timeSeconds: TIME_SECONDS,
      injectIndex: INJECT_INDEX,
      scope: normalizedScope(),
      activeAllowed: isStrictItNovuraExamsScope(),
      deps: {
        generator: !!window.FlowLogicGenerator,
        input: !!window.FlowLogicInput,
        scorer: !!window.FlowLogicScorer,
        renderer: !!window.FlowLogicRenderer,
        validator: !!window.FlowLogicValidator
      }
    };
  }
  window.NovuraExamsFlowLogicAdapter = Object.freeze({
    __version: VERSION,
    taskType: TASK_TYPE,
    timeSeconds: TIME_SECONDS,
    injectIndex: INJECT_INDEX,
    isStrictItNovuraExamsScope: isStrictItNovuraExamsScope,
    shouldInject: shouldInject,
    createQuestion: createQuestion,
    renderTo: renderTo,
    summaryFromSession: summaryFromSession,
    diagnostics: diagnostics
  });
  window.NovuraExamsFlowLogicAdapter = window.NovuraExamsFlowLogicAdapter;
  window.NovuraExamsFlowLogicAdapter = window.NovuraExamsFlowLogicAdapter;
})();
