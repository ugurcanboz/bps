/* Eignungstest-Trainer · Phase 4 Aufgabenbank-Qualitätsengine
   Prüft und harmonisiert Aufgaben vor dem Runtime-Import. Keine Aufgabeninhalte werden gelöscht. */
(function(){
  'use strict';

  var DIFFICULTY_MAP = { easy:1, leicht:1, medium:2, mittel:2, hard:3, schwer:3, expert:4 };
  var TARGETS = ['bps','ctc','bosch','both'];
  var GROUP_ALIASES = {
    'mathematik':'Mathe', 'mathe':'Mathe', 'kaufm. rechnen':'Mathe', 'kaufm-rechnen':'Mathe',
    'logik':'Logik', 'logisches denken':'Logik',
    'it/fisi':'IT/FISI', 'it':'IT/FISI', 'fisi':'IT/FISI',
    'allgemeinwissen':'Allgemeinwissen', 'sprache':'Allgemeinwissen', 'pädagogik':'Allgemeinwissen', 'paedagogik':'Allgemeinwissen',
    'englisch':'Englisch', 'konzentration':'Konzentration', 'gedächtnis':'Gedächtnis', 'gedaechtnis':'Gedächtnis'
  };

  function text(v){ return String(v == null ? '' : v).trim(); }
  function lower(v){ return text(v).toLowerCase(); }
  function stableGroup(value, fallback){
    var key = lower(value || fallback || '');
    return GROUP_ALIASES[key] || text(value || fallback || 'Allgemeinwissen');
  }
  function difficultyNumber(value){
    if(typeof value === 'number' && isFinite(value)) return Math.max(1, Math.min(5, Math.round(value)));
    return DIFFICULTY_MAP[lower(value)] || 2;
  }
  function difficultyLabel(n){ return n <= 1 ? 'easy' : n >= 3 ? 'hard' : 'medium'; }
  function target(value){
    var t = lower(value || 'both');
    return TARGETS.indexOf(t) >= 0 ? t : 'both';
  }
  function signature(q){
    return lower(q.question).replace(/\s+/g,' ') + '::' + (Array.isArray(q.answers) ? q.answers.map(lower).join('|') : '');
  }
  function ensureArray(v){ return Array.isArray(v) ? v : []; }
  function skillFrom(q){
    if(q.dna && q.dna.skill) return text(q.dna.skill);
    var tags = ensureArray(q.tags).map(lower).join(' ');
    var cat = lower(q.category + ' ' + q.subtype + ' ' + tags);
    if(cat.indexOf('prozent') >= 0 || cat.indexOf('rabatt') >= 0) return 'prozentrechnung_anwenden';
    if(cat.indexOf('satz') >= 0 || cat.indexOf('grammatik') >= 0) return 'sprachlogik_und_grammatik';
    if(cat.indexOf('netz') >= 0 || cat.indexOf('osi') >= 0) return 'it_netzwerkgrundlagen';
    if(cat.indexOf('matrix') >= 0 || cat.indexOf('logik') >= 0) return 'logische_muster_erkennen';
    return 'grundkompetenz_pruefen';
  }
  function expectedTimeMs(q, diff){
    if(q.dna && Number(q.dna.expectedTimeMs) > 0) return Number(q.dna.expectedTimeMs);
    if(q.group === 'IT/FISI') return 18000 + diff * 2500;
    if(q.group === 'Mathe') return 16000 + diff * 3500;
    if(q.group === 'Logik') return 18000 + diff * 4500;
    return 12000 + diff * 3000;
  }
  function qualityCheck(q, seenIds, seenSignatures){
    var issues = [];
    if(!text(q.id)) issues.push('id fehlt');
    if(seenIds[q.id]) issues.push('doppelte id');
    if(!text(q.question) || text(q.question).length < 8) issues.push('frage zu kurz');
    if(!Array.isArray(q.answers) || q.answers.length < 2) issues.push('antworten fehlen');
    if(Number(q.correct) < 0 || Number(q.correct) >= ensureArray(q.answers).length) issues.push('korrekte antwort ungültig');
    if(!text(q.explanation)) issues.push('erklärung fehlt');
    if(!ensureArray(q.tags).length) issues.push('tags fehlen');
    var sig = signature(q);
    if(seenSignatures[sig]) issues.push('mögliche dublette');
    return issues;
  }
  function normalizeOne(q, index, seenIds, seenSignatures){
    q = q || {};
    q.id = text(q.id) || ('qb_auto_' + String(index+1).padStart(4,'0'));
    q.group = stableGroup(q.group, q.category);
    q.category = text(q.category || q.cat || q.group);
    q.subtype = text(q.subtype || q.type || 'mc');
    var diff = difficultyNumber(q.difficulty || (q.dna && q.dna.difficulty));
    q.difficulty = difficultyLabel(diff);
    q.tags = ensureArray(q.tags).map(function(t){ return lower(t).replace(/\s+/g,'-'); }).filter(Boolean);
    q.examTarget = target(q.examTarget || (q.dna && q.dna.examTarget));
    q.phase4 = {
      schema:'question-bank-phase-4',
      difficultyLevel:diff,
      group:q.group,
      skill:skillFrom(q),
      expectedTimeMs:expectedTimeMs(q, diff),
      examTarget:q.examTarget,
      quality:'unchecked'
    };
    q.dna = Object.assign({}, q.dna || {}, {
      category: (q.dna && q.dna.category) || lower(q.group),
      subtype: (q.dna && q.dna.subtype) || lower(q.subtype),
      difficulty: diff,
      skill: q.phase4.skill,
      expectedTimeMs: q.phase4.expectedTimeMs,
      examTarget: q.examTarget
    });
    var issues = qualityCheck(q, seenIds, seenSignatures);
    q.phase4.issues = issues;
    q.phase4.quality = issues.length ? 'needsReview' : 'verified';
    if(!q.status || q.status === 'raw') q.status = issues.length ? 'needsReview' : 'verified';
    if(issues.length === 0) q.verified = true;
    seenIds[q.id] = true;
    seenSignatures[signature(q)] = true;
    return q;
  }
  function audit(list){
    var byGroup={}, byDifficulty={}, byTarget={}, byStatus={}, bySkill={}, issues=[];
    ensureArray(list).forEach(function(q){
      byGroup[q.group] = (byGroup[q.group] || 0) + 1;
      byDifficulty[q.difficulty] = (byDifficulty[q.difficulty] || 0) + 1;
      byTarget[q.examTarget || 'both'] = (byTarget[q.examTarget || 'both'] || 0) + 1;
      byStatus[(q.phase4 && q.phase4.quality) || q.status || 'unknown'] = (byStatus[(q.phase4 && q.phase4.quality) || q.status || 'unknown'] || 0) + 1;
      var skill = q.phase4 && q.phase4.skill || q.dna && q.dna.skill || 'unspezifisch';
      bySkill[skill] = (bySkill[skill] || 0) + 1;
      if(q.phase4 && q.phase4.issues && q.phase4.issues.length) issues.push({id:q.id, issues:q.phase4.issues});
    });
    return {
      ready: issues.length === 0,
      total: ensureArray(list).length,
      byGroup: byGroup,
      byDifficulty: byDifficulty,
      byTarget: byTarget,
      byStatus: byStatus,
      topSkills: Object.keys(bySkill).sort(function(a,b){return bySkill[b]-bySkill[a];}).slice(0,12).map(function(k){return {skill:k,count:bySkill[k]};}),
      issues: issues.slice(0,50),
      generatedAt: new Date().toISOString()
    };
  }
  function validateGeneratedQuestion(q) {
    if (!q) return false;
    if (typeof q.time !== 'number' || q.time < 15) return false;
    if (!Array.isArray(q.a) || q.a.length < 4) return false;
    var uniqueOpts = {};
    for (var i = 0; i < q.a.length; i++) {
      var opt = q.a[i];
      if (uniqueOpts[opt]) return false;
      uniqueOpts[opt] = true;
    }
    if (typeof q.correct !== 'number' || q.correct < 0 || q.correct >= q.a.length) return false;
    if (q.type === 'focusgrid' || q.subtype === 'focusgrid' || q.focusHTML) {
      var html = q.focusHTML || "";
      var tokens = html.match(/class=["'](focus-token|pq-token)["']/g) || [];
      if (tokens.length > 60) return false;
    }
    if (q.cat === "Symbolreihen" || q.category === "Symbolreihen") {
      var ans = q.a[q.correct];
      var isNum = /^\d+$/.test(ans);
      for (var j = 0; j < q.a.length; j++) {
        if (/^\d+$/.test(q.a[j]) !== isNum) return false;
      }
    }
    return true;
  }
  function run(){
    var list = Array.isArray(window.QUESTION_BANK_EXTERNAL) ? window.QUESTION_BANK_EXTERNAL : [];
    var seenIds={}, seenSignatures={};
    for(var i=0;i<list.length;i++) list[i] = normalizeOne(list[i], i, seenIds, seenSignatures);
    var report = audit(list);
    window.EGTQuestionBankQuality = Object.freeze({
      status:'ready',
      phase:'4',
      normalizeOne:normalizeOne,
      audit:function(){ return audit(Array.isArray(window.QUESTION_BANK_EXTERNAL) ? window.QUESTION_BANK_EXTERNAL : []); },
      report:report,
      validateGeneratedQuestion:validateGeneratedQuestion
    });
    try { window.dispatchEvent(new CustomEvent('egt:question-bank-quality-ready', { detail: report })); } catch(e){}
    return report;
  }
  run();
})();
