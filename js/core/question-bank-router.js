/* Eignungstest-Trainer · QuestionBank Router · G48.0-phase10
   Phase 10: trennt fachliche Datenpool-/QuestionBank-Auswahl von app.js.
   Die eigentlichen Daten bleiben in data/question-bank-*.js und die App-Engine bleibt
   Fallback. Diese Schicht priorisiert nur Quelle, Branch, Modus und ExamTarget. */
(function(){
  'use strict';

  var VERSION = 'G48.0-phase10';
  if (window.EGTQuestionBankRouter && window.EGTQuestionBankRouter.__version === VERSION) return;

  var BRANCHES = Object.freeze({
    it: Object.freeze({
      id: 'it',
      label: 'IT / FISI',
      groups: Object.freeze(['IT/FISI']),
      sourceHints: Object.freeze(['question-bank-it', 'it-extra', 'it-bank', 'fisi', 'edv']),
      categoryHints: Object.freeze(['it', 'edv', 'netzwerk', 'hardware', 'software', 'security', 'osi', 'fisi']),
      tagHints: Object.freeze(['it', 'fisi', 'edv', 'netzwerk', 'hardware', 'software', 'security', 'osi'])
    }),
    kaufm: Object.freeze({
      id: 'kaufm',
      label: 'Kaufmännisch / Verwaltung',
      groups: Object.freeze(['Kaufmännisch']),
      sourceHints: Object.freeze(['question-bank-kaufm', 'kaufm-bank', 'kaufmaennisch', 'kaufmännisch']),
      categoryHints: Object.freeze(['kaufm', 'bürowissen', 'buerowissen', 'büro', 'buero', 'verwaltung', 'wirtschaft', 'rabatt', 'skonto']),
      tagHints: Object.freeze(['kaufm', 'kaufmaennisch', 'kaufm-rechnen', 'büro', 'buero', 'verwaltung', 'wirtschaft', 'rabatt', 'skonto'])
    }),
    sozial: Object.freeze({
      id: 'sozial',
      label: 'Sozialpädagogik',
      groups: Object.freeze(['Sozialpädagogik']),
      sourceHints: Object.freeze(['question-bank-sozial', 'sozial-bank', 'paedagogik', 'pädagogik']),
      categoryHints: Object.freeze(['pädagogik', 'paedagogik', 'situationen', 'sozial', 'entwicklung', 'bindung', 'beobachtung']),
      tagHints: Object.freeze(['sozial', 'pädagogik', 'paedagogik', 'entwicklung', 'bindung', 'beobachtung', 'dokumentation', 'kommunikation'])
    }),
    wissen: Object.freeze({
      id: 'wissen',
      label: 'Allgemein / Common',
      groups: Object.freeze(['Allgemeinwissen','Mathe','Logik','Konzentration','Englisch','Visual IQ','Mechanik','Raumdenken','Gedächtnis']),
      sourceHints: Object.freeze(['question-bank.js', 'question-bank-mathe', 'satzergänzung', 'general', 'mathe']),
      categoryHints: Object.freeze(['mathematik', 'satzergänzung', 'allgemeinwissen', 'logik', 'englisch', 'konzentration']),
      tagHints: Object.freeze(['allgemeinwissen', 'mathe', 'logik', 'deutsch', 'englisch', 'konzentration', 'bps', 'ctc'])
    })
  });

  function asObj(value){ return value && typeof value === 'object' ? value : {}; }
  function asArr(value){ return Array.isArray(value) ? value : []; }
  function lower(value){ return String(value || '').toLowerCase(); }
  function normalizeBranch(branch){
    var key = lower(branch).trim();
    return BRANCHES[key] ? key : 'wissen';
  }
  function includesAny(haystack, needles){
    var hay = lower(haystack);
    return asArr(needles).some(function(n){ return hay.indexOf(lower(n)) !== -1; });
  }
  function itemText(item){
    item = asObj(item);
    return [
      item.id, item.source, item.sourceId, item.category, item.cat, item.group,
      item.subtype, item.skill, item.examTarget,
      item.dna && item.dna.category, item.dna && item.dna.subtype, item.dna && item.dna.skill,
      item.phase4 && item.phase4.skill,
      asArr(item.tags).join(' ')
    ].join(' ');
  }
  function inferBranch(item){
    item = asObj(item);
    var group = String(item.group || '');
    if (group === 'IT/FISI') return 'it';
    if (group === 'Kaufmännisch') return 'kaufm';
    if (group === 'Sozialpädagogik') return 'sozial';
    var text = itemText(item);
    var order = ['it','kaufm','sozial'];
    for (var i = 0; i < order.length; i++) {
      var rule = BRANCHES[order[i]];
      if (includesAny(text, rule.sourceHints) || includesAny(text, rule.categoryHints) || includesAny(text, rule.tagHints)) return order[i];
    }
    return 'wissen';
  }
  function examTargetForMode(mode){
    var selected = String(mode || '').trim();
    if (selected === 'ctcLohr' || selected === 'ctc') return 'ctc';
    if (selected === 'bps') return 'bps';
    return '';
  }
  function matchesFilter(item, filter){
    item = asObj(item); filter = asObj(filter);
    if (filter.group && item.group !== filter.group) return false;
    if (filter.category && item.category !== filter.category) return false;
    if (filter.excludeCategory && item.category === filter.excludeCategory) return false;
    if (filter.difficulty && item.difficulty !== filter.difficulty) return false;
    if (filter.tag && asArr(item.tags).indexOf(filter.tag) === -1) return false;
    if (filter.verifiedOnly && !item.verified) return false;
    if (filter.examTarget) {
      var itemTarget = item.examTarget || (item.dna && item.dna.examTarget) || (item.phase4 && item.phase4.examTarget) || 'both';
      if (itemTarget !== 'both' && itemTarget !== filter.examTarget) return false;
    }
    return true;
  }
  function branchScore(item, branch){
    var wanted = normalizeBranch(branch);
    var inferred = inferBranch(item);
    if (wanted === 'wissen') return inferred === 'wissen' ? 3 : 1;
    if (inferred === wanted) return 30;
    if (inferred === 'wissen') return 10;
    return 0;
  }
  function stableSortByBranch(candidates, branch){
    return asArr(candidates).map(function(item, index){
      return { item:item, index:index, score:branchScore(item, branch) };
    }).sort(function(a,b){
      if (b.score !== a.score) return b.score - a.score;
      return a.index - b.index;
    }).map(function(x){ return x.item; });
  }
  function filterItems(items, filter){
    return asArr(items).filter(function(item){ return matchesFilter(item, filter); });
  }
  function resolve(input){
    var ctx = asObj(input);
    var mode = String(ctx.mode || '').trim() || 'jogging';
    var branch = normalizeBranch(ctx.branch);
    var filter = Object.assign({}, asObj(ctx.filter));
    var target = filter.examTarget || examTargetForMode(mode);
    if (target) filter.examTarget = target;
    var items = asArr(ctx.items);
    var candidates = filterItems(items, filter);
    var fallbackApplied = false;
    if (!candidates.length && filter.examTarget) {
      var relaxed = Object.assign({}, filter);
      delete relaxed.examTarget;
      candidates = filterItems(items, relaxed);
      filter = relaxed;
      fallbackApplied = true;
    }
    var sorted = stableSortByBranch(candidates, branch);
    return {
      routeId: 'qbank-router-' + VERSION,
      version: VERSION,
      mode: mode,
      branch: branch,
      filter: filter,
      candidates: sorted,
      total: sorted.length,
      fallbackApplied: fallbackApplied,
      source: ctx.source || 'question-bank-router'
    };
  }
  function index(items){
    var list = asArr(items);
    var byBranch = {}, byGroup = {}, byTarget = {}, bySource = {};
    Object.keys(BRANCHES).forEach(function(k){ byBranch[k] = 0; });
    list.forEach(function(item){
      var branch = inferBranch(item);
      byBranch[branch] = (byBranch[branch] || 0) + 1;
      byGroup[item.group || 'unknown'] = (byGroup[item.group || 'unknown'] || 0) + 1;
      byTarget[item.examTarget || (item.dna && item.dna.examTarget) || 'both'] = (byTarget[item.examTarget || (item.dna && item.dna.examTarget) || 'both'] || 0) + 1;
      bySource[item.source || 'unknown'] = (bySource[item.source || 'unknown'] || 0) + 1;
    });
    return { version: VERSION, total: list.length, byBranch: byBranch, byGroup: byGroup, byTarget: byTarget, bySource: bySource, ready: true };
  }
  function describeBranch(branch){
    var key = normalizeBranch(branch);
    var rule = BRANCHES[key] || BRANCHES.wissen;
    return { id: rule.id, label: rule.label, groups: asArr(rule.groups).slice(), tags: asArr(rule.tagHints).slice() };
  }
  function listBranches(){
    return Object.keys(BRANCHES).map(function(key){ return describeBranch(key); });
  }

  window.EGTQuestionBankRouter = Object.freeze({
    __version: VERSION,
    resolve: resolve,
    index: index,
    inferBranch: inferBranch,
    branchScore: branchScore,
    listBranches: listBranches,
    describeBranch: describeBranch,
    _private: Object.freeze({ matchesFilter: matchesFilter, examTargetForMode: examTargetForMode })
  });
})();
