/* ════════════════════════════════════════════════════════════════
   egt-analysis-data-adapter.js — G54.43.5 Coach-Auswertung
   Zweck: Einheitliche Analyse-Datenquelle für Dashboard V2.
   Liest vorhandene lokale Trainings-/Simulationsergebnisse sicher aus,
   normalisiert sie pro Modul/Bereich und liefert Fallbacks ohne Absturz.
   ════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var VERSION = 'G54.43.5-coach-interpretation-final';

  var MODULES = {
    all:        { label:'Alle Bereiche',   keys:['all'],        lines:['Mathematik','Logik','Sprachtraining','Simulation','IT/FISI'], focus:'Zahlenreihen', base:58 },
    language:   { label:'Sprachtraining',      keys:['language','sprachtraining','deutsch-a1-c2','language-course','speaking','hoeren','hören'], lines:['Lesen','Hören','Schreiben','Sprechen','Grammatik'], focus:'Grammatik', base:62 },
    simulation: { label:'Simulation',      keys:['simulation','sim','vollsimulation','exam','prüfung','pruefung'], lines:['Allgemeinwissen','Mathematik','Koordinaten','Wenn-Dann','Zeit'], focus:'Zeitdruck', base:56 },
    novuraExams:        { label:'Novura Exams/Novura Assessments',         keys:['novuraExams','assessments','lohr','novuraExams/assessments'], lines:['Allgemeinwissen','Mathematik','Zahlenreihen','Koordinaten','Wenn-Dann'], focus:'Zahlenreihen', base:54 },
    math:       { label:'Mathematik',      keys:['math','mathe','mathematik','rechnen','zahlenreihen','dreisatz','prozent'], lines:['Grundrechnen','Dreisatz','Prozent','Zahlenreihen','Textaufgaben'], focus:'Zahlenreihen', base:52 },
    logic:      { label:'Logik',           keys:['logic','logik','muster','matrix','matrizen','rätsel','raetsel'], lines:['Muster','Regeln','Reihen','Figuren','Tempo'], focus:'Regelwechsel', base:60 },
    knowledge:  { label:'Allgemeinwissen', keys:['knowledge','allgemeinwissen','wissen','politik','geschichte','geografie'], lines:['Politik','Geschichte','Geografie','Wirtschaft','Aktuelles'], focus:'Wirtschaft', base:59 },
    german:     { label:'Deutsch',         keys:['german','deutsch','aufsatz','lesen','grammatik'], lines:['Lesen','Grammatik','Wortschatz','Schreiben','Verstehen'], focus:'Satzbau', base:61 },
    english:    { label:'Englisch',        keys:['english','englisch'], lines:['Reading','Vocabulary','Grammar','Listening','Use of English'], focus:'Grammar', base:57 },
    it:         { label:'IT/FISI',         keys:['it','edv','fisi','netzwerk','linux','windows','security'], lines:['Netzwerk','Hardware','Linux','Windows','Security'], focus:'Netzwerkgrundlagen', base:55 }
  };

  var PERIOD_DAYS = { today:1, days7:7, days30:30, days90:90, alltime:99999 };
  var PERIOD_LABELS = { today:'Heute', days7:'7 Tage', days30:'30 Tage', days90:'90 Tage', alltime:'Gesamt' };
  var VIEW_LABELS = { overview:'Übersicht', trend:'Verlauf', strengths:'Stärken & Schwächen', forecast:'Prognose', errors:'Fehleranalyse' };

  function clamp(n, min, max) {
    n = Number(n);
    if (!isFinite(n)) n = 0;
    return Math.max(min, Math.min(max, n));
  }

  function safeJson(raw, fallback) {
    try { return raw ? JSON.parse(raw) : fallback; } catch (e) { return fallback; }
  }

  function safeDateValue(x) {
    var v = x && (x.date || x.createdAt || x.created_at || x.time || x.timestamp || (x.meta && (x.meta.date || x.meta.createdAt)));
    var t = v ? new Date(v).getTime() : 0;
    return isFinite(t) && t > 0 ? t : 0;
  }

  function scoreOf(x) {
    if (!x) return 0;
    var candidates = [x.percent, x.score, x.accuracy, x.successRate, x.avg, x.averageScore];
    for (var i=0; i<candidates.length; i++) {
      var n = Number(candidates[i]);
      if (isFinite(n) && n > 0) {
        if (n <= 1) n = n * 100;
        return Math.round(clamp(n, 0, 100));
      }
    }
    if (Number(x.total) > 0 && Number(x.correct) >= 0) {
      return Math.round(clamp((Number(x.correct) / Number(x.total)) * 100, 0, 100));
    }
    return 0;
  }

  function textOf(x) {
    var parts = [];
    try {
      ['module','moduleId','mode','type','title','category','group','exam','branch'].forEach(function(k){ if (x && x[k] != null) parts.push(String(x[k])); });
      if (x && x.meta) ['module','moduleId','mode','type','category','group','branch'].forEach(function(k){ if (x.meta[k] != null) parts.push(String(x.meta[k])); });
      if (x && x.cats) parts.push(Object.keys(x.cats).join(' '));
    } catch(e) {}
    return parts.join(' ').toLowerCase();
  }

  function readStorageResults() {
    var out = [];
    try {
      if (window.App && App._test && App._test.StorageEngine && typeof App._test.StorageEngine.read === 'function') {
        var list = App._test.StorageEngine.read([]) || [];
        if (Array.isArray(list)) out = out.concat(list);
      }
    } catch (e0) {}
    try {
      var keys = ['eignungstest_trainer_results_v1','eignungstest_trainer_results','egt_results','egt_results_v1','trainer_results','assessments_results'];
      keys.forEach(function(k){
        var parsed = safeJson(localStorage.getItem(k), null);
        if (Array.isArray(parsed)) out = out.concat(parsed);
      });
    } catch (e1) {}
    return out.filter(function(x){ return x && typeof x === 'object'; }).map(function(x){
      var copy = {};
      for (var k in x) { if (Object.prototype.hasOwnProperty.call(x,k)) copy[k] = x[k]; }
      copy.__score = scoreOf(x);
      copy.__time = safeDateValue(x) || Date.now();
      copy.__text = textOf(x);
      return copy;
    }).filter(function(x){ return x.__score >= 0; }).slice(-500);
  }

  function matchesArea(item, area) {
    if (!item || area === 'all') return true;
    var def = MODULES[area] || MODULES.all;
    var hay = item.__text || '';
    return def.keys.some(function(k){ return hay.indexOf(String(k).toLowerCase()) !== -1; });
  }

  function filterByPeriod(list, period) {
    if (period === 'alltime') return list.slice();
    var days = PERIOD_DAYS[period] || 30;
    var min = Date.now() - (days * 24 * 60 * 60 * 1000);
    return list.filter(function(x){ return !x.__time || x.__time >= min; });
  }

  function avg(list) {
    if (!list.length) return 0;
    var sum = list.reduce(function(a,x){ return a + (Number(x.__score)||0); }, 0);
    return Math.round(clamp(sum / list.length, 0, 100));
  }

  function best(list) {
    return list.reduce(function(a,x){ return Math.max(a, Number(x.__score)||0); }, 0);
  }

  function lineTrend(list, fallbackBase) {
    var base = Number(fallbackBase) || 58;
    if (!list.length) return [Math.max(15, base-18), Math.max(20, base-10), Math.max(25, base-7), Math.min(100, base-1), Math.min(100, base+5)];
    var sorted = list.slice().sort(function(a,b){ return (a.__time||0) - (b.__time||0); });
    var buckets = [[],[],[],[],[]];
    if (sorted.length <= 5) {
      sorted.forEach(function(x,i){ buckets[Math.min(4,i)].push(x); });
    } else {
      sorted.forEach(function(x,i){ buckets[Math.min(4, Math.floor((i / sorted.length) * 5))].push(x); });
    }
    var last = avg(sorted) || base;
    return buckets.map(function(b){ if (b.length) { last = avg(b); return last; } return last; });
  }

  function normalizeCatScore(cat) {
    var v = 0;
    if (typeof cat === 'number') v = cat;
    else if (cat && typeof cat === 'object') v = scoreOf(cat);
    if (v && v <= 1) v = v * 100;
    return v ? Math.round(clamp(v, 0, 100)) : 0;
  }

  function labelAliases(label) {
    var l = String(label || '').toLowerCase();
    var out = [l];
    if (l === 'hören') out.push('hoeren', 'listening', 'hörverstehen', 'hoerverstehen');
    if (l === 'sprechen') out.push('speaking', 'aussprache', 'mündlich', 'muendlich');
    if (l === 'schreiben') out.push('writing', 'aufsatz', 'text');
    if (l === 'lesen') out.push('reading', 'leseverstehen');
    if (l === 'grammatik') out.push('grammar', 'sprachbausteine');
    if (l === 'zahlenreihen') out.push('zahlenreihe', 'reihen');
    if (l === 'wenn-dann') out.push('wenn dann', 'simulation', 'regel');
    if (l === 'it/fisi') out.push('it', 'fisi', 'edv');
    return out;
  }

  function categoryScores(list, def, area) {
    /* G54.43.1/43.2 · echte Datenbindung der Stärken-/Schwächen-Balken.
       Jede Kategorie sammelt Treffer aus cats-Objekten, Modultexten und
       Scorefeldern. Fallback-Werte werden markiert, damit die UI zwischen
       echten Balken und Vorschau unterscheiden kann. */
    var labels = def.lines.slice(0,5);
    var derived = labels.map(function(label){ return { label:label, values:[], hits:0, real:false }; });
    list.forEach(function(item){
      var hay = item.__text || '';
      derived.forEach(function(row){
        var aliases = labelAliases(row.label);
        var matchedText = aliases.some(function(key){ return key && hay.indexOf(key) !== -1; });
        if (matchedText) { row.values.push(item.__score); row.hits += 1; row.real = true; }
      });
      if (item.cats && typeof item.cats === 'object') {
        Object.keys(item.cats).forEach(function(k){
          var kLower = String(k).toLowerCase();
          var found = derived.filter(function(r){ return labelAliases(r.label).some(function(a){ return a === kLower; }); })[0];
          var v = normalizeCatScore(item.cats[k]);
          if (found && v) { found.values.push(v); found.hits += 1; found.real = true; }
        });
      }
      if (item.breakdown && typeof item.breakdown === 'object') {
        Object.keys(item.breakdown).forEach(function(k){
          var kLower = String(k).toLowerCase();
          var found = derived.filter(function(r){ return labelAliases(r.label).some(function(a){ return a === kLower; }); })[0];
          var v = normalizeCatScore(item.breakdown[k]);
          if (found && v) { found.values.push(v); found.hits += 1; found.real = true; }
        });
      }
    });
    var base = avg(list) || def.base || 58;
    var spread = [0, 8, -6, 5, -10];
    return derived.map(function(row, i){
      var real = row.values.length > 0;
      var v = real ? Math.round(row.values.reduce(function(a,b){return a+b;},0) / row.values.length) : Math.round(clamp(base + (spread[i] || 0), 18, 98));
      var weakness = Math.round(clamp(100 - v, 0, 100));
      return { label: row.label, value: clamp(v, 0, 100), weakness: weakness, count: row.hits, real: real, source: real ? 'adapter-category' : 'adapter-fallback' };
    });
  }

  function buildStrengthWeaknessSummary(bars, hasReal) {
    var realBars = (bars || []).filter(function(b){ return b && b.real; });
    var sourceBars = realBars.length ? realBars : (hasReal ? (bars || []) : []);
    var weaknesses = sourceBars.slice().sort(function(a,b){ return (Number(a.value)||0) - (Number(b.value)||0); }).slice(0,3);
    var strengths = sourceBars.slice().sort(function(a,b){ return (Number(b.value)||0) - (Number(a.value)||0); }).slice(0,3);
    return {
      topWeaknesses: weaknesses.map(function(b, i){ return { rank:i+1, label:b.label, value:b.value, gap:Math.max(0, 75 - (Number(b.value)||0)), count:b.count || 0, real:!!b.real }; }),
      topStrengths: strengths.map(function(b, i){ return { rank:i+1, label:b.label, value:b.value, count:b.count || 0, real:!!b.real }; }),
      barsDisplay: (bars || []).slice().sort(function(a,b){ return (Number(a.value)||0) - (Number(b.value)||0); }).slice(0,6),
      realBarCount: realBars.length,
      barsReady: hasReal && sourceBars.length > 0
    };
  }

  function focusFromBars(bars, fallback) {
    if (!bars || !bars.length) return fallback || 'Grundlagen';
    var sorted = bars.slice().sort(function(a,b){ return (Number(a.value)||0) - (Number(b.value)||0); });
    return sorted[0] && sorted[0].label ? sorted[0].label : (fallback || 'Grundlagen');
  }


  function normalizeErrorLabel(raw) {
    var s = String(raw || '').toLowerCase().trim();
    if (!s) return '';
    s = s.replace(/[\-_]+/g, ' ').replace(/\s+/g, ' ');
    if (s.indexOf('zahlen') !== -1 || s.indexOf('reihe') !== -1) return 'Zahlenreihen';
    if (s.indexOf('koordin') !== -1) return 'Koordinaten';
    if (s.indexOf('wenn') !== -1 || s.indexOf('regel') !== -1) return 'Wenn-Dann-Regeln';
    if (s.indexOf('zeit') !== -1 || s.indexOf('tempo') !== -1) return 'Zeitdruck';
    if (s.indexOf('gramm') !== -1 || s.indexOf('artikel') !== -1 || s.indexOf('satz') !== -1) return 'Grammatik/Satzbau';
    if (s.indexOf('hör') !== -1 || s.indexOf('hoer') !== -1 || s.indexOf('listen') !== -1) return 'Hörverstehen';
    if (s.indexOf('sprech') !== -1 || s.indexOf('aussprache') !== -1 || s.indexOf('münd') !== -1 || s.indexOf('muend') !== -1) return 'Sprechen/Aussprache';
    if (s.indexOf('schreib') !== -1 || s.indexOf('aufsatz') !== -1 || s.indexOf('text') !== -1) return 'Schreiben/Textaufbau';
    if (s.indexOf('les') !== -1 || s.indexOf('reading') !== -1) return 'Lesen/Textverständnis';
    if (s.indexOf('prozent') !== -1) return 'Prozentrechnung';
    if (s.indexOf('dreisatz') !== -1) return 'Dreisatz';
    if (s.indexOf('grundrechnen') !== -1 || s.indexOf('rechnen') !== -1 || s.indexOf('mathe') !== -1) return 'Grundrechnen';
    if (s.indexOf('netz') !== -1) return 'Netzwerkgrundlagen';
    if (s.indexOf('linux') !== -1) return 'Linux';
    if (s.indexOf('windows') !== -1) return 'Windows';
    if (s.indexOf('security') !== -1 || s.indexOf('sicherheit') !== -1) return 'Security';
    return String(raw || '').trim().replace(/^[#•\s]+/, '').slice(0, 36) || 'Fehlergruppe';
  }

  function priorityFromSeverity(severity, count) {
    severity = Number(severity) || 0;
    count = Number(count) || 0;
    if (severity >= 35 || count >= 5) return 'hoch';
    if (severity >= 18 || count >= 2) return 'mittel';
    return 'niedrig';
  }

  function trainingHintFor(label, priority) {
    var l = String(label || '').toLowerCase();
    var prefix = priority === 'hoch' ? 'Kurz und gezielt trainieren: ' : (priority === 'mittel' ? 'Wiederholen: ' : 'Stabilisieren: ');
    if (l.indexOf('zahlen') !== -1) return prefix + '10 kurze Zahlenreihen mit Regelbegründung, danach Tempo steigern.';
    if (l.indexOf('koordin') !== -1) return prefix + 'Koordinaten langsam markieren, Achsen prüfen, erst dann antworten.';
    if (l.indexOf('wenn') !== -1 || l.indexOf('regel') !== -1) return prefix + 'Wenn-Dann-Regeln in Einzelschritte zerlegen und jede Bedingung abhaken.';
    if (l.indexOf('zeit') !== -1 || l.indexOf('tempo') !== -1) return prefix + '3-Minuten-Sets nutzen, aber Genauigkeit vor Geschwindigkeit halten.';
    if (l.indexOf('gramm') !== -1 || l.indexOf('satz') !== -1) return prefix + 'Artikel, Satzstellung und Verbposition mit kurzen Lückensätzen üben.';
    if (l.indexOf('hör') !== -1) return prefix + 'Hörtext zweimal hören, Schlüsselwörter notieren und erst dann auswählen.';
    if (l.indexOf('sprech') !== -1 || l.indexOf('aussprache') !== -1) return prefix + 'Antwort laut sprechen, aufnehmen und Satzmelodie bewusst wiederholen.';
    if (l.indexOf('schreib') !== -1 || l.indexOf('text') !== -1) return prefix + 'Einleitung, Hauptteil, Schluss als feste Struktur trainieren.';
    if (l.indexOf('les') !== -1) return prefix + 'Frage zuerst lesen, Signalwörter markieren, dann den Text abschnittsweise prüfen.';
    if (l.indexOf('prozent') !== -1) return prefix + 'Grundwert, Prozentwert und Prozentsatz sauber trennen.';
    if (l.indexOf('dreisatz') !== -1) return prefix + 'Einheiten untereinander schreiben und Zwischenschritt nicht überspringen.';
    if (l.indexOf('netz') !== -1) return prefix + 'IP, DNS, Gateway und Subnetzmaske in Mini-Fällen unterscheiden.';
    return prefix + '2–3 Mini-Trainings mit direkter Fehlerkontrolle durchführen.';
  }

  function collectExplicitErrorTerms(item) {
    var out = [];
    if (!item || typeof item !== 'object') return out;
    ['error','errors','mistake','mistakes','wrong','wrongAreas','failed','failedCategories','weaknesses','issues','tags'].forEach(function(k){
      var v = item[k];
      if (!v && item.meta) v = item.meta[k];
      if (!v) return;
      if (Array.isArray(v)) v.forEach(function(x){ out.push(typeof x === 'object' ? (x.label || x.name || x.category || x.type || JSON.stringify(x)) : x); });
      else if (typeof v === 'object') Object.keys(v).forEach(function(key){ if (v[key]) out.push(key); });
      else out.push(v);
    });
    var blocks = [item.cats, item.breakdown];
    blocks.forEach(function(obj){
      if (!obj || typeof obj !== 'object') return;
      Object.keys(obj).forEach(function(k){
        var v = normalizeCatScore(obj[k]);
        if (v && v < 65) out.push(k);
      });
    });
    return out.map(normalizeErrorLabel).filter(Boolean);
  }

  function buildErrorAnalysis(list, bars, sw, def, forecastDetail) {
    /* G54.43.5 · echte Fehlergruppen + Priorität + Trainingshinweis.
       Priorität entsteht aus expliziten Fehlerfeldern, schwachen Kategorien
       und Abstand zur Zielmarke. Keine Garantien, nur handlungsorientierte
       Trainingshinweise. */
    var map = {};
    function add(label, severity, count, source) {
      label = normalizeErrorLabel(label);
      if (!label) return;
      if (!map[label]) map[label] = { label:label, severity:0, count:0, sources:{} };
      map[label].severity += Number(severity) || 0;
      map[label].count += Number(count) || 1;
      map[label].sources[source || 'adapter'] = true;
    }
    (list || []).forEach(function(item){
      collectExplicitErrorTerms(item).forEach(function(label){ add(label, Math.max(8, 100 - (Number(item.__score)||70)), 1, 'explicit'); });
      if (Number(item.total) > 0 && Number(item.correct) >= 0) {
        var miss = Math.max(0, Number(item.total) - Number(item.correct));
        if (miss > 0) add('Allgemeine Fehlerquote', Math.round((miss / Number(item.total)) * 100), miss, 'score');
      }
    });
    var weak = sw && Array.isArray(sw.topWeaknesses) ? sw.topWeaknesses : [];
    weak.forEach(function(w){
      var gap = Math.max(0, Number(w.gap || (75 - Number(w.value || 0))));
      add(w.label, gap || Math.max(1, 100 - Number(w.value || 0)), w.count || 1, w.real ? 'weak-category' : 'fallback-weakness');
    });
    if (!Object.keys(map).length && def && def.focus) add(def.focus, 12, 1, 'fallback-focus');
    var groups = Object.keys(map).map(function(label){
      var row = map[label];
      var weighted = Math.round(clamp((row.severity / Math.max(1, row.count)) + Math.min(20, row.count * 2), 0, 100));
      var priority = priorityFromSeverity(weighted, row.count);
      return {
        label: row.label,
        severity: weighted,
        count: row.count,
        priority: priority,
        source: Object.keys(row.sources).join(', '),
        trainingHint: trainingHintFor(row.label, priority)
      };
    }).sort(function(a,b){
      var order = { hoch:3, mittel:2, niedrig:1 };
      return (order[b.priority] - order[a.priority]) || (b.severity - a.severity) || (b.count - a.count);
    }).slice(0,5);
    var top = groups[0] || { label:(def && def.focus) || 'Grundlagen', priority:'niedrig', trainingHint:'Weitere Trainings sammeln und danach erneut bewerten.' };
    return {
      ready: !!(list && list.length),
      groups: groups,
      topPriority: top.priority,
      topLabel: top.label,
      trainingHint: top.trainingHint,
      riskLabel: forecastDetail && forecastDetail.riskLabel ? forecastDetail.riskLabel : top.label,
      note: (list && list.length) ? 'Fehlergruppen aus gespeicherten Ergebnissen und schwachen Kategorien.' : 'Noch keine echte Fehlerbasis vorhanden.'
    };
  }


  function bucketValues(list, count) {
    count = count || 5;
    var sorted = list.slice().sort(function(a,b){ return (a.__time||0) - (b.__time||0); });
    var buckets = [];
    for (var i=0; i<count; i++) buckets.push([]);
    if (!sorted.length) return buckets;
    if (sorted.length <= count) {
      sorted.forEach(function(x,i){ buckets[Math.min(count-1,i)].push(x); });
    } else {
      sorted.forEach(function(x,i){ buckets[Math.min(count-1, Math.floor((i / sorted.length) * count))].push(x); });
    }
    return buckets;
  }

  function shortDateLabel(ts, index, total) {
    if (!ts || !isFinite(ts)) return String(index + 1);
    try {
      var d = new Date(ts);
      if (total <= 5) return d.toLocaleDateString('de-DE', { day:'2-digit', month:'2-digit' });
      return d.toLocaleDateString('de-DE', { day:'2-digit', month:'2-digit' });
    } catch(e) { return String(index + 1); }
  }

  function bucketLabelsFrom(list, count) {
    var buckets = bucketValues(list, count || 5);
    if (!list.length) return ['Start','Woche 1','Woche 2','Woche 3','Heute'];
    return buckets.map(function(b,i){
      var ref = b.length ? b[b.length-1].__time : 0;
      return shortDateLabel(ref, i, buckets.length);
    });
  }

  function lineMatchForLabel(item, label, area) {
    if (!item) return false;
    var key = String(label || '').toLowerCase();
    var hay = item.__text || '';
    if (area === 'all') {
      var target = Object.keys(MODULES).filter(function(k){ return MODULES[k].label === label || k === label; })[0];
      if (target && target !== 'all') return matchesArea(item, target);
      if (label === 'Sprachtraining') return matchesArea(item, 'language');
      if (label === 'Simulation') return matchesArea(item, 'simulation');
      if (label === 'Mathematik') return matchesArea(item, 'math');
      if (label === 'Logik') return matchesArea(item, 'logic');
      if (label === 'IT/FISI') return matchesArea(item, 'it');
    }
    if (hay.indexOf(key) !== -1) return true;
    if (item.cats && typeof item.cats === 'object') {
      return Object.keys(item.cats).some(function(k){ return String(k).toLowerCase() === key; });
    }
    return false;
  }

  function scoreForLineItem(item, label) {
    if (item && item.cats && typeof item.cats === 'object') {
      var keys = Object.keys(item.cats);
      for (var i=0; i<keys.length; i++) {
        if (String(keys[i]).toLowerCase() === String(label).toLowerCase()) {
          var cat = item.cats[keys[i]];
          if (typeof cat === 'number') return clamp(cat <= 1 ? cat * 100 : cat, 0, 100);
          if (cat && typeof cat === 'object') return scoreOf(cat);
        }
      }
    }
    return item ? item.__score : 0;
  }

  function buildLineSeries(list, def, area, fallbackTrend) {
    var labels = def.lines.slice(0,5);
    var buckets = bucketValues(list, 5);
    var xLabels = bucketLabelsFrom(list, 5);
    var offsets = [0, -7, 6, -11, 10];
    var baseTrend = (fallbackTrend && fallbackTrend.length) ? fallbackTrend.slice(0,5) : lineTrend(list, def.base);
    var realAny = false;
    var series = labels.map(function(label, idx){
      var values = buckets.map(function(bucket, bi){
        var matched = bucket.filter(function(item){ return lineMatchForLabel(item, label, area); });
        if (matched.length) {
          realAny = true;
          var sum = matched.reduce(function(a,item){ return a + (Number(scoreForLineItem(item, label)) || 0); }, 0);
          return Math.round(clamp(sum / matched.length, 0, 100));
        }
        return Math.round(clamp((baseTrend[bi] || def.base || 58) + (offsets[idx] || 0), 0, 100));
      });
      return {
        label: label,
        values: values,
        source: realAny ? 'mixed-adapter' : 'adapter-fallback',
        latest: values.length ? values[values.length-1] : 0
      };
    });
    return { labels:xLabels, series:series, hasRealSeries:realAny };
  }

  function scoreStd(list) {
    if (!list || !list.length) return 0;
    var m = avg(list);
    var variance = list.reduce(function(a,x){ var d=(Number(x.__score)||0)-m; return a + (d*d); },0) / list.length;
    return Math.sqrt(variance);
  }

  function trendInfo(trend, score) {
    var first = (trend && trend.length) ? Number(trend[0]) : Number(score || 0);
    var last = (trend && trend.length) ? Number(trend[trend.length-1]) : Number(score || 0);
    var delta = Math.round((isFinite(last) ? last : 0) - (isFinite(first) ? first : 0));
    var direction = delta >= 6 ? 'steigend' : (delta <= -6 ? 'fallend' : 'stabil');
    return { first:first || 0, last:last || 0, delta:delta, direction:direction };
  }

  function confidenceFromRuns(runs, realBarCount) {
    runs = Number(runs) || 0;
    realBarCount = Number(realBarCount) || 0;
    if (runs >= 10 && realBarCount >= 3) return { level:'hoch', value:82, label:'hohe Datenbasis' };
    if (runs >= 5 && realBarCount >= 2) return { level:'mittel', value:62, label:'mittlere Datenbasis' };
    if (runs >= 2) return { level:'niedrig', value:38, label:'noch wenig Daten' };
    return { level:'leer', value:0, label:'noch keine echte Datenbasis' };
  }

  function riskFromWeakness(topWeaknesses, score) {
    var weak = topWeaknesses && topWeaknesses[0] ? topWeaknesses[0] : null;
    var value = weak ? Number(weak.value || 0) : Number(score || 0);
    var gap = weak ? Number(weak.gap || Math.max(0, 75 - value)) : Math.max(0, 75 - value);
    var level = value < 50 || gap >= 25 ? 'hoch' : (value < 65 || gap >= 10 ? 'mittel' : 'niedrig');
    return { level:level, label: weak && weak.label ? weak.label : 'Gesamtleistung', value:Math.round(value || 0), gap:Math.round(gap || 0) };
  }

  function buildForecast(score, bestScore, runs, trend, topWeaknesses, realBarCount, list) {
    score = Math.round(clamp(score, 0, 100));
    bestScore = Math.round(clamp(bestScore || score, 0, 100));
    runs = Number(runs) || 0;
    var t = trendInfo(trend, score);
    var confidence = confidenceFromRuns(runs, realBarCount);
    var risk = riskFromWeakness(topWeaknesses, score);
    var stabilityPenalty = Math.round(clamp(scoreStd(list || []) * 0.45, 0, 10));
    var activityBonus = Math.round(clamp(Math.min(runs, 20) * 0.55, 0, 11));
    var trendBonus = Math.round(clamp(t.delta * 0.35, -8, 10));
    var riskPenalty = risk.level === 'hoch' ? 11 : (risk.level === 'mittel' ? 6 : 2);
    var raw = (score * 0.58) + (bestScore * 0.16) + activityBonus + trendBonus + (confidence.value * 0.10) - riskPenalty - stabilityPenalty;
    var probability = Math.round(clamp(raw, 0, 96));
    var label = probability >= 80 ? 'sehr gute Tendenz' : (probability >= 65 ? 'realistische Tendenz' : (probability >= 45 ? 'unsichere Tendenz' : 'kritische Tendenz'));
    var weeks = probability >= 80 ? 'kurzfristig möglich' : (probability >= 65 ? 'bei stabilem Training realistisch' : (probability >= 45 ? 'erst nach gezielter Stabilisierung' : 'aktuell noch nicht belastbar'));
    var wording = 'Prognose vorsichtig: ' + label + '. Risiko-Bereich: ' + risk.label + ' (' + risk.value + '%). Trend: ' + t.direction + (t.delta ? ' (' + (t.delta > 0 ? '+' : '') + t.delta + ' Punkte)' : '') + '. Keine Bestehensgarantie.';
    var recommendation = risk.level === 'niedrig'
      ? 'Stärkste Bereiche halten und weiter regelmäßig testen.'
      : ('Gezielt ' + risk.label + ' trainieren und nach 2–3 weiteren Läufen neu bewerten.');
    return {
      probability: probability,
      label: label,
      target: 75,
      trend: t.direction,
      trendDelta: t.delta,
      confidence: confidence.level,
      confidenceLabel: confidence.label,
      riskLevel: risk.level,
      riskLabel: risk.label,
      riskValue: risk.value,
      riskGap: risk.gap,
      readiness: weeks,
      stabilityPenalty: stabilityPenalty,
      activityBonus: activityBonus,
      trendBonus: trendBonus,
      riskPenalty: riskPenalty,
      wording: wording,
      recommendation: recommendation,
      formula: [
        { label:'Ø Leistung', value:score, weight:'58%' },
        { label:'Bestwert', value:bestScore, weight:'16%' },
        { label:'Aktivität', value:activityBonus, weight:'Bonus' },
        { label:'Trend', value:trendBonus, weight:'Bonus/Malus' },
        { label:'Risiko', value:riskPenalty, weight:'Malus' },
        { label:'Stabilität', value:stabilityPenalty, weight:'Malus' }
      ],
      ready: runs >= 2
    };
  }

  function forecastScore(score, bestScore, runs, trend) {
    return buildForecast(score, bestScore, runs, trend, [], 0, []).probability;
  }
  function buildForecastChart(scoped, trend, forecastDetail) {
    /* G54.43.3 · Prognose-Diagramm: echte Leistung + vorsichtige Prognoselinie + Zielmarke.
       Die Prognose wird aus der bestehenden Forecast-Engine abgeleitet und bewusst als
       Tendenz dargestellt, nicht als sichere Zusage. */
    var target = Number((forecastDetail && forecastDetail.target) || 75) || 75;
    var actualValues = (Array.isArray(trend) && trend.length) ? trend.slice(0,5).map(function(v){ return Math.round(clamp(v,0,100)); }) : [0,0,0,0,0];
    while (actualValues.length < 5) actualValues.push(actualValues.length ? actualValues[actualValues.length-1] : 0);
    var labels = bucketLabelsFrom(scoped || [], 5).slice(0,5);
    while (labels.length < 5) labels.push(labels.length ? ('P' + (labels.length+1)) : 'Start');
    var last = actualValues[actualValues.length-1] || 0;
    var tDelta = Number(forecastDetail && forecastDetail.trendDelta);
    if (!isFinite(tDelta)) tDelta = last - (actualValues[0] || last);
    var step = clamp(Math.round(tDelta / Math.max(1, actualValues.length-1)), -6, 8);
    if (!step && forecastDetail && forecastDetail.label && String(forecastDetail.label).indexOf('gute') !== -1) step = 3;
    if (!step && last < target) step = 2;
    var riskLevel = forecastDetail && forecastDetail.riskLevel ? forecastDetail.riskLevel : 'mittel';
    var riskBrake = riskLevel === 'hoch' ? -2 : (riskLevel === 'mittel' ? -1 : 0);
    var forecastValues = [];
    var current = last;
    for (var i=1; i<=3; i++) {
      current = clamp(current + step + riskBrake + (i === 1 ? 1 : 0), 0, 96);
      forecastValues.push(Math.round(current));
    }
    var allLabels = labels.concat(['Prognose 1','Prognose 2','Prognose 3']);
    return {
      labels: allLabels,
      actual: actualValues.concat([null,null,null]),
      forecast: [null,null,null,null,last].concat(forecastValues),
      target: allLabels.map(function(){ return target; }),
      targetValue: target,
      hasRealActual: !!(scoped && scoped.length),
      hasForecast: !!(forecastDetail && forecastDetail.ready),
      note: (forecastDetail && forecastDetail.ready) ? 'Tendenz aus echter Leistung, Trend und Risiko.' : 'Noch vorsichtig: mehr Läufe verbessern die Aussagekraft.'
    };
  }


  function buildCoachInsight(ctx) {
    /* G54.43.5 · finale Coach-Auswertung.
       Kurze, verständliche Interpretation aus Prognose, Top-Schwäche,
       Fehleranalyse und Datenbasis. Keine Bestehensgarantie. */
    ctx = ctx || {};
    var hasReal = !!ctx.dataReady;
    var runs = Number(ctx.runs || 0) || 0;
    var forecast = ctx.forecastDetail || {};
    var errorAnalysis = ctx.errorAnalysis || {};
    var topWeak = (ctx.topWeaknesses && ctx.topWeaknesses[0]) ? ctx.topWeaknesses[0] : null;
    var topStrength = (ctx.topStrengths && ctx.topStrengths[0]) ? ctx.topStrengths[0] : null;
    var focus = (topWeak && topWeak.label) || (errorAnalysis && errorAnalysis.topLabel) || (forecast && forecast.riskLabel) || (ctx.def && ctx.def.focus) || 'Grundlagen';
    var strength = (topStrength && topStrength.label) || 'stabile Bereiche';
    var trend = forecast.trend || 'stabil';
    var probability = Math.round(Number(forecast.probability) || 0);
    var riskLevel = forecast.riskLevel || (errorAnalysis.topPriority === 'hoch' ? 'hoch' : 'mittel');
    var confidence = forecast.confidenceLabel || 'noch wenig Daten';
    var priority = errorAnalysis.topPriority || (riskLevel === 'hoch' ? 'hoch' : 'mittel');
    var trainingHint = errorAnalysis.trainingHint || forecast.recommendation || ('Gezielt ' + focus + ' trainieren und danach erneut prüfen.');
    var title = 'Noch keine belastbare Auswertung';
    var summary = 'Für diese Auswahl liegen noch keine gespeicherten Ergebnisse vor. Starte zuerst ein Training, eine Simulation oder einen Sprachtraining. Danach bewertet der Coach Leistung, Risiko und nächsten Fokus automatisch.';
    var nextStep = 'Ersten passenden Lauf starten und danach Analyse erneut öffnen.';
    var tone = 'empty';
    if (hasReal) {
      if (probability >= 75 && riskLevel === 'niedrig') { tone = 'good'; title = 'Stabile Entwicklung erkennbar'; }
      else if (probability >= 60) { tone = 'watch'; title = 'Gute Basis, aber Fokus nötig'; }
      else if (riskLevel === 'hoch' || priority === 'hoch') { tone = 'risk'; title = 'Klarer Trainingsfokus notwendig'; }
      else { tone = 'watch'; title = 'Auswertung noch vorsichtig'; }
      var trendText = trend === 'steigend' ? 'Dein Trend zeigt nach oben' : (trend === 'fallend' ? 'Dein Trend ist aktuell rückläufig' : 'Dein Trend wirkt aktuell stabil');
      var forecastText = probability ? ('Die Prognose liegt vorsichtig bei ' + probability + '%.') : 'Die Prognose ist noch nicht belastbar.';
      var weaknessText = focus ? ('Der wichtigste Hebel ist ' + focus + '.') : 'Der wichtigste Hebel wird nach weiteren Läufen genauer.';
      var strengthText = strength ? ('Stark wirkt aktuell ' + strength + '.') : '';
      summary = trendText + '. ' + forecastText + ' ' + weaknessText + (strengthText ? ' ' + strengthText : '') + ' Datenbasis: ' + runs + ' passende Einträge (' + confidence + ').';
      nextStep = trainingHint;
    }
    return {
      ready: hasReal,
      title: title,
      summary: summary,
      nextStep: nextStep,
      focus: focus,
      strength: strength,
      riskLevel: riskLevel,
      priority: priority,
      confidence: confidence,
      tone: tone,
      bullets: hasReal ? [
        'Prognose vorsichtig lesen, nicht als Garantie.',
        'Top-Schwäche zuerst trainieren: ' + focus + '.',
        'Nach 2–3 passenden Läufen erneut bewerten.'
      ] : [
        'Noch keine echte Datenbasis.',
        'Training oder Simulation starten.',
        'Analyse aktualisiert sich danach automatisch.'
      ]
    };
  }


  function dashboard(area, period, view) {
    area = MODULES[area] ? area : 'all';
    period = PERIOD_DAYS[period] ? period : 'days30';
    view = VIEW_LABELS[view] ? view : 'overview';
    var def = MODULES[area] || MODULES.all;
    var all = readStorageResults();
    var periodList = filterByPeriod(all, period);
    var scoped = periodList.filter(function(x){ return matchesArea(x, area); });
    if (!scoped.length && area !== 'all') scoped = periodList.filter(function(x){ return matchesArea(x, 'all'); }).slice(-20);
    var hasReal = scoped.length > 0;
    var score = hasReal ? avg(scoped) : def.base;
    var trend = lineTrend(scoped, score);
    var bars = categoryScores(scoped, def, area);
    var sw = buildStrengthWeaknessSummary(bars, hasReal);
    var focus = (sw.topWeaknesses && sw.topWeaknesses[0] && sw.topWeaknesses[0].label) ? sw.topWeaknesses[0].label : focusFromBars(bars, def.focus);
    var bestScore = hasReal ? best(scoped) : Math.min(100, score + 12);
    var forecastDetail = buildForecast(score, bestScore, scoped.length, trend, sw.topWeaknesses, sw.realBarCount, scoped);
    var forecast = forecastDetail.probability;
    var chart = buildLineSeries(scoped, def, area, trend);
    var forecastChart = buildForecastChart(scoped, trend, forecastDetail);
    var errorAnalysis = buildErrorAnalysis(scoped, bars, sw, def, forecastDetail);
    var coachInsight = buildCoachInsight({
      dataReady: hasReal,
      runs: scoped.length,
      def: def,
      forecastDetail: forecastDetail,
      errorAnalysis: errorAnalysis,
      topWeaknesses: sw.topWeaknesses,
      topStrengths: sw.topStrengths
    });
    return {
      cfg: { label:def.label, lines:def.lines.slice(0,5), focus:focus, score:score, best:bestScore },
      bars: bars,
      barsDisplay: sw.barsDisplay,
      barsMeta: { realBarCount: sw.realBarCount, barsReady: sw.barsReady, sorted:'weakest-first', maxItems:6 },
      topWeaknesses: sw.topWeaknesses,
      topStrengths: sw.topStrengths,
      trend: trend,
      chart: chart,
      forecast: forecast,
      forecastDetail: forecastDetail,
      forecastChart: forecastChart,
      errorAnalysis: errorAnalysis,
      coachInsight: coachInsight,
      viewLabel: VIEW_LABELS[view] || 'Übersicht',
      periodLabel: PERIOD_LABELS[period] || '30 Tage',
      runs: scoped.length,
      best: bestScore,
      source: hasReal ? 'real-storage' : 'fallback',
      dataReady: hasReal,
      totalRecords: all.length,
      scopedRecords: scoped.length,
      adapterVersion: VERSION,
      emptyState: !hasReal,
      kpiReady: hasReal,
      note: hasReal ? 'aus gespeicherten Trainingsdaten' : 'noch keine echten Daten für diese Auswahl'
    };
  }

  function apiHealth() {
    var all = readStorageResults();
    return { ok:true, version:VERSION, records:all.length, modules:Object.keys(MODULES) };
  }

  window.EGTAnalysisDataAdapter = Object.freeze({ __version: VERSION, getDashboard: dashboard, health: apiHealth, modules: MODULES });
})();
