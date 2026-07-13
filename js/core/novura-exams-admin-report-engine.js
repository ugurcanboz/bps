/* Novura · Novura Exams Admin Report Engine · G54.4 / Phase 29
   Zweck: Novura Exams-Lohr-Blockauswertung für Admin-/Dozentenportal, Coach-Hooks
   und Ergebnis-Persistence. Scope bleibt ausschließlich Simulation → IT/FISI → Novura Exams. */
(function(){
  'use strict';
  var VERSION = 'G54.4-phase29-novuraExams-admin-report-engine';
  if (window.NovuraExamsAdminReportEngine && window.NovuraExamsAdminReportEngine.__version === VERSION) return;

  var DEFAULT_BLOCKS = [
    { key:'generalKnowledge', label:'1. Allgemeinwissen', expected:40, seconds:420, group:'Allgemeinwissen' },
    { key:'mathSprint', label:'2. Mathematik Sprint', expected:9, seconds:198, group:'Mathe' },
    { key:'ruleArithmetic', label:'3. Regelrechnung', expected:6, seconds:240, group:'Mathe' },
    { key:'letterScan', label:'4. Buchstaben-Konzentration', expected:4, seconds:160, group:'Konzentration' },
    { key:'coordinateTable', label:'5. Tabellen ablesen', expected:2, seconds:180, group:'Konzentration' },
    { key:'flowLogic', label:'6. Novura Exams-Logik: Wenn-Dann-Ablauf', expected:1, seconds:780, group:'Logik' }
  ];

  function clone(v){ try { return JSON.parse(JSON.stringify(v)); } catch(e){ return v; } }
  function safeArr(v){ return Array.isArray(v) ? v : []; }
  function safeObj(v){ return v && typeof v === 'object' ? v : {}; }
  function n(v, fallback){ v = Number(v); return Number.isFinite(v) ? v : (fallback || 0); }
  function pct(correct, total){ return total > 0 ? Math.round((correct / total) * 100) : 0; }
  function blocks(){
    try {
      if(window.NovuraExamsStructureEngine && Array.isArray(window.NovuraExamsStructureEngine.blocks)) {
        return window.NovuraExamsStructureEngine.blocks.map(function(b){
          return {
            key: b.key,
            label: b.label,
            expected: n(b.count, 0),
            seconds: b.timeModel === 'block' ? n(b.blockSeconds, 0) : n(b.count, 1) * n(b.questionSeconds, 0),
            group: b.group || ''
          };
        });
      }
    } catch(e) {}
    return DEFAULT_BLOCKS.map(clone);
  }
  function totalExpected(){ return blocks().reduce(function(s,b){ return s + n(b.expected,0); }, 0); }
  function totalSeconds(){ return blocks().reduce(function(s,b){ return s + n(b.seconds,0); }, 0); }
  function isNovuraExamsContext(input){
    input = safeObj(input);
    var record = safeObj(input.record);
    var state = safeObj(input.state);
    var profile = input.questionProfile || input.profile || safeObj(state.questionProfile) || safeObj(window.EGT_ACTIVE_QUESTION_PROFILE);
    var mode = String(input.mode || record.mode || state.selectedMode || profile.mode || '');
    var branch = String(input.branch || record.branch || profile.branch || 'it');
    var simType = String(input.simType || record.simType || profile.simType || 'novuraExams');
    var pool = String(input.pool || input.poolKey || record.poolKey || profile.poolKey || profile.pool || 'it-novura-exams');
    if(mode === 'novuraExams' && branch === 'it' && simType === 'novuraExams' && pool === 'it-novura-exams') return true;
    if(record && record.novuraExamsReport && record.novuraExamsReport.scope === 'it-novura-exams-lohr') return true;
    return false;
  }
  function blockByIndex(index){
    var list = blocks(), cursor = 0;
    index = n(index, 0);
    for(var i=0;i<list.length;i++){
      if(index < cursor + list[i].expected) return list[i];
      cursor += list[i].expected;
    }
    return list[list.length - 1];
  }
  function blockFromLabel(label){
    label = String(label || '').toLowerCase();
    var list = blocks();
    for(var i=0;i<list.length;i++){
      var b = list[i];
      if(label === String(b.key).toLowerCase()) return b;
      if(label.indexOf(String(b.key).toLowerCase()) >= 0) return b;
      if(label.indexOf(String(b.label || '').toLowerCase()) >= 0) return b;
    }
    if(label.indexOf('allgemein') >= 0) return list[0];
    if(label.indexOf('mathematik sprint') >= 0 || label.indexOf('mathe sprint') >= 0) return list[1];
    if(label.indexOf('regel') >= 0) return list[2];
    if(label.indexOf('buchstaben') >= 0) return list[3];
    if(label.indexOf('tabellen') >= 0 || label.indexOf('koordinat') >= 0) return list[4];
    if(label.indexOf('flow') >= 0 || label.indexOf('wenn-dann') >= 0 || label.indexOf('ablauf') >= 0) return list[5];
    return null;
  }
  function resolveBlock(item, question, index){
    item = safeObj(item); question = safeObj(question);
    return blockFromLabel(item.novuraExamsBlockKey || question.novuraExamsBlockKey || item.blockKey || question.blockKey || item.block || question.block || item.cat || question.cat) || blockByIndex(index);
  }
  function emptyBlockStat(block){
    return {
      key: block.key,
      label: block.label,
      expected: n(block.expected, 0),
      seconds: n(block.seconds, 0),
      total: 0,
      correct: 0,
      wrong: 0,
      open: 0,
      timeout: 0,
      skipped: 0,
      inputTasks: 0,
      multipleChoiceTasks: 0,
      durationMs: 0,
      avgSeconds: 0,
      percent: 0,
      status: 'offen'
    };
  }
  function taskAnswerMode(item, question){
    var type = String((question && question.type) || (item && item.visualType) || '');
    if(/Input|FlowLogic|novuraExamsRule|novuraExamsLetter|novuraExamsCoordinate/i.test(type)) return 'input';
    var answers = (question && Array.isArray(question.a) && question.a) || (item && Array.isArray(item.answers) && item.answers) || [];
    return answers.length > 1 ? 'multiple-choice' : 'input';
  }
  function buildReport(input){
    input = safeObj(input);
    if(!isNovuraExamsContext(input)) return null;
    var state = safeObj(input.state);
    var record = safeObj(input.record);
    var history = safeArr(input.history || state.history || record.history || (record.aiSession && record.aiSession.history));
    var quiz = safeArr(input.quiz || state.quiz || record.quiz);
    var list = blocks();
    var byKey = {};
    list.forEach(function(b){ byKey[b.key] = emptyBlockStat(b); });

    var totalCount = Math.max(history.length, quiz.length, totalExpected());
    for(var i=0;i<totalCount;i++){
      var h = safeObj(history[i]);
      var q = safeObj(quiz[i]);
      var block = resolveBlock(h, q, i);
      var s = byKey[block.key] || (byKey[block.key] = emptyBlockStat(block));
      var hasAttempt = !!(history[i] || quiz[i]);
      s.total += 1;
      var given = h.givenIndex;
      var isOpen = !history[i] || given === null || given === undefined || h.skipped === true;
      var isTimeout = h.timeout === true;
      var correct = h.correct === true;
      if(correct) s.correct += 1;
      else if(hasAttempt) s.wrong += 1;
      if(isOpen) s.open += 1;
      if(isTimeout) s.timeout += 1;
      if(h.skipped === true) s.skipped += 1;
      if(taskAnswerMode(h, q) === 'input') s.inputTasks += 1; else s.multipleChoiceTasks += 1;
      s.durationMs += n(h.duration, 0);
    }

    var blockStats = list.map(function(b){
      var s = byKey[b.key] || emptyBlockStat(b);
      if(s.total > s.expected && s.expected > 0) s.total = s.expected;
      s.percent = pct(s.correct, Math.max(1, s.total || s.expected));
      s.avgSeconds = s.total ? Math.round((s.durationMs / Math.max(1, s.total)) / 100) / 10 : 0;
      if(s.percent >= 75) s.status = 'stark';
      else if(s.percent >= 55) s.status = 'kritisch';
      else s.status = 'schwach';
      return s;
    });
    var expected = totalExpected();
    var correctTotal = blockStats.reduce(function(sum,b){ return sum + b.correct; }, 0);
    var answeredTotal = blockStats.reduce(function(sum,b){ return sum + b.total; }, 0);
    var openTotal = blockStats.reduce(function(sum,b){ return sum + b.open; }, 0);
    var timeoutTotal = blockStats.reduce(function(sum,b){ return sum + b.timeout; }, 0);
    var weakest = blockStats.slice().sort(function(a,b){ return a.percent - b.percent || b.expected - a.expected; })[0] || null;
    return {
      version: VERSION,
      scope: 'it-novura-exams-lohr',
      mode: 'novuraExams',
      title: 'Novura Exams Blockauswertung',
      expectedTotal: expected,
      total: answeredTotal || expected,
      correct: correctTotal,
      percent: pct(correctTotal, Math.max(1, answeredTotal || expected)),
      totalSeconds: totalSeconds(),
      durationLabel: '32:58 Min. reine Prüfungszeit · ca. 33–35 Min. mit Übergang',
      open: openTotal,
      timeout: timeoutTotal,
      weakestBlock: weakest ? { key: weakest.key, label: weakest.label, percent: weakest.percent, status: weakest.status } : null,
      blocks: blockStats,
      createdAt: new Date().toISOString()
    };
  }
  function compactStats(report){
    report = report || null;
    if(!report) return null;
    var out = {};
    (report.blocks || []).forEach(function(b){ out[b.key] = { label:b.label, percent:b.percent, correct:b.correct, total:b.total, open:b.open, timeout:b.timeout, avgSeconds:b.avgSeconds, status:b.status }; });
    return out;
  }
  function enrichRecord(record, ctx){
    record = record || {};
    var report = buildReport(Object.assign({}, ctx || {}, { record:record }));
    if(!report) return record;
    record.novuraExamsReport = report;
    record.novuraExamsBlockStats = compactStats(report);
    record.novuraExamsWeakestBlock = report.weakestBlock;
    record.exam = Object.assign({}, record.exam || {}, { novuraExams:true, novuraExamsReportVersion:VERSION, novuraExamsTotalSeconds:report.totalSeconds });
    return record;
  }
  function toAdminEvent(payload, ctx){
    payload = Object.assign({}, payload || {});
    var report = buildReport(Object.assign({}, ctx || {}, { record:payload }));
    if(!report) return payload;
    payload.novuraExamsReport = report;
    payload.novuraExamsBlockStats = compactStats(report);
    payload.novuraExamsWeakestBlock = report.weakestBlock;
    payload.novuraExamsReportSummary = report.blocks.map(function(b){ return b.label + ': ' + b.correct + '/' + b.total + ' (' + b.percent + '%)'; }).join(' · ');
    return payload;
  }
  function renderAdminSummary(report){
    report = report && report.blocks ? report : buildReport(report || {});
    if(!report) return '<div class="novuraExams-admin-report-card"><b>Novura Exams Auswertung</b><br><span class="small">Keine Novura-Exams-Daten verfügbar.</span></div>';
    var rows = report.blocks.map(function(b){
      return '<div class="novuraExams-admin-report-row" data-status="'+b.status+'"><b>'+b.label+'</b><span>'+b.correct+'/'+b.total+' · '+b.percent+'%</span><small>offen '+b.open+' · Ø '+b.avgSeconds+'s</small></div>';
    }).join('');
    return '<section class="novuraExams-admin-report-card"><div class="coach-badge">Novura Exams</div><h3>Blockauswertung</h3><p class="small">'+report.durationLabel+'</p><div class="novuraExams-admin-report-grid">'+rows+'</div><p class="small"><b>Schwächster Block:</b> '+(report.weakestBlock ? report.weakestBlock.label + ' (' + report.weakestBlock.percent + '%)' : '-')+'</p></section>';
  }
  function diagnostics(sample){
    var report = sample ? buildReport(sample) : null;
    return { ok:true, version:VERSION, blocks:blocks(), totalExpected:totalExpected(), totalSeconds:totalSeconds(), sampleReport:report };
  }

  window.NovuraExamsAdminReportEngine = {
    __version: VERSION,
    blocks: blocks,
    totalExpected: totalExpected,
    totalSeconds: totalSeconds,
    isNovuraExamsContext: isNovuraExamsContext,
    buildReport: buildReport,
    compactStats: compactStats,
    enrichRecord: enrichRecord,
    toAdminEvent: toAdminEvent,
    renderAdminSummary: renderAdminSummary,
    diagnostics: diagnostics
  };
  window.NovuraExamsAdminReportEngine = window.NovuraExamsAdminReportEngine;
  window.NovuraExamsAdminReportEngine = window.NovuraExamsAdminReportEngine;
})();
