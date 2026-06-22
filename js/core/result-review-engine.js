/* Eignungstest-Trainer · Result Review Engine · G49.0-phase11
   Phase 11: trennt Ergebniszusammenfassung, Kategorieauswertung,
   Fehlerrückblick, Tipps und Analyse-HTML als kontrollierte Core-Grenze
   von js/app.js. Keine Speicherung, keine Navigation, keine DOM-Selektion. */
(function(){
  'use strict';

  var VERSION = 'G49.0-phase11';
  if (window.EGTResultReviewEngine && window.EGTResultReviewEngine.__version === VERSION) return;

  var TRAINING_MODES = ['mathSprint','textMathSprint','logicSprint','concentrationSprint','visualIQSprint','itSprint','knowledgeSprint','techniqueSprint','errorTrainingPrep'];
  var CTC_BLOCKS = ['1. Allgemeinwissen','2. Mathe','3. Logik','4. Konzentration','5. EDV Kenntnisse'];

  function asArr(value){ return Array.isArray(value) ? value : []; }
  function asObj(value){ return value && typeof value === 'object' ? value : {}; }
  function safeNumber(value, fallback){ var n = Number(value); return Number.isFinite(n) ? n : (fallback || 0); }
  function safePercent(right, total){ return total ? Math.round((safeNumber(right) / total) * 100) : 0; }
  function escHTML(value){
    return String(value == null ? '' : value)
      .replace(/&/g,'&amp;')
      .replace(/</g,'&lt;')
      .replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;')
      .replace(/'/g,'&#39;');
  }
  function jsArg(value){
    return String(value == null ? '' : value).replace(/\\/g,'\\\\').replace(/'/g,"\\'").replace(/\n/g,' ');
  }
  function htmlMaybe(value){ return value == null ? '' : String(value); }
  function questionText(item){ return htmlMaybe(asObj(item).q); }
  function explanationText(item){ return htmlMaybe(asObj(item).explanation); }
  function historyFrom(ctx){ return asArr(asObj(ctx).history || (asObj(ctx).state && asObj(ctx).state.history)).filter(Boolean); }
  function selectedMode(ctx){ return String(asObj(ctx).selectedMode || (asObj(ctx).state && asObj(ctx).state.selectedMode) || ''); }
  function modeTitle(ctx){
    var mode = selectedMode(ctx);
    var modes = asObj(asObj(ctx).modes);
    return (modes[mode] && modes[mode].title) || mode || 'Test';
  }
  function averageSeconds(items){
    var list = asArr(items).filter(Boolean);
    if(!list.length) return 0;
    return Math.round(list.reduce(function(sum,h){ return sum + safeNumber(h && h.duration, 0); }, 0) / list.length / 100) / 10;
  }
  function formatFallbackDate(date){
    try { return new Date(date).toLocaleDateString('de-DE', {day:'2-digit',month:'2-digit',year:'2-digit',hour:'2-digit',minute:'2-digit'}); }
    catch(e){ return String(date || ''); }
  }

  function buildSummary(ctx){
    ctx = asObj(ctx);
    var state = asObj(ctx.state);
    var history = historyFrom(ctx);
    var score = typeof ctx.score === 'number' ? ctx.score : history.filter(function(h){ return h && h.correct; }).length;
    var total = history.length || safeNumber(ctx.total, 1) || 1;
    var percent = safePercent(score, total);
    var testStart = ctx.testStart || state.testStart;
    var testEnd = ctx.testEnd || state.testEnd || new Date();
    var duration = 'nicht erfasst';
    if(testStart && typeof ctx.formatDuration === 'function') duration = ctx.formatDuration(testEnd - testStart);
    var avg = averageSeconds(history);
    var mode = selectedMode(ctx);
    var target = mode === 'ctc' ? 70 : mode === 'bps' ? 75 : 80;
    var verdict = percent >= target
      ? 'Stark für diesen Modus.'
      : percent >= target - 10
        ? 'Knapp dran, aber noch instabil unter Druck.'
        : 'Noch zu fehleranfällig für einen sicheren Lauf.';
    return {
      version: VERSION,
      mode: mode,
      title: modeTitle(ctx),
      score: score,
      total: total,
      percent: percent,
      duration: duration,
      avg: avg,
      target: target,
      verdict: verdict,
      examEnabled: !!(state.exam && state.exam.enabled),
      isTrainingMode: TRAINING_MODES.indexOf(mode) !== -1,
      testStart: testStart || null,
      testEnd: testEnd || null,
      source: 'EGTResultReviewEngine.buildSummary'
    };
  }

  function renderResultHeader(summary, hooks){
    summary = asObj(summary); hooks = asObj(hooks);
    var formatTime = typeof hooks.formatTime === 'function' ? hooks.formatTime : function(v){ return v ? formatFallbackDate(v) : '-'; };
    var examBanner = summary.examEnabled ? '<div class="exam-banner">Prüfungsmodus abgeschlossen. Offene Aufgaben wurden streng gewertet.</div>' : '';
    var trainingNote = summary.isTrainingMode ? '<div class="training-note"><b>Blocktraining PRO:</b> Dieser Lauf zählt als gezielte Trainingseinheit. Nutze die Kategorieauswertung direkt für den nächsten Sprint.</div>' : '';
    return examBanner + trainingNote + '<div class="bigScore">' + safeNumber(summary.score) + '/' + safeNumber(summary.total,1) + '</div>' +
      '<div class="statsgrid">' +
      '<div class="stat"><b>Quote</b><br><strong>' + safeNumber(summary.percent) + '%</strong></div>' +
      '<div class="stat"><b>Beginn</b><br><strong>' + escHTML(formatTime(summary.testStart)) + '</strong></div>' +
      '<div class="stat"><b>Ende</b><br><strong>' + escHTML(formatTime(summary.testEnd)) + '</strong></div>' +
      '<div class="stat"><b>Dauer</b><br><strong>' + escHTML(summary.duration) + '</strong></div>' +
      '<div class="stat"><b>Ø pro Aufgabe</b><br><strong>' + safeNumber(summary.avg) + 's</strong></div>' +
      '</div><div class="tipBox"><b>' + escHTML(summary.verdict) + '</b></div>';
  }

  function aggregateBy(items, keyFn){
    var groups = {};
    asArr(items).forEach(function(item){
      var key = keyFn(item) || 'Sonstiges';
      if(!groups[key]) groups[key] = [];
      groups[key].push(item);
    });
    return groups;
  }

  function renderCategoryStats(ctx){
    ctx = asObj(ctx);
    var answered = historyFrom(ctx);
    var byGroup = aggregateBy(answered, function(h){ return h && h.group; });
    var html = Object.keys(byGroup).map(function(cat){
      var items = byGroup[cat];
      var right = items.filter(function(h){ return h && h.correct; }).length;
      var p = safePercent(right, items.length);
      var avg = averageSeconds(items);
      return '<div class="stat"><b>' + escHTML(cat) + '</b><br>' + right + '/' + items.length + ' richtig<br><strong>' + p + '%</strong><br><span class="small">Ø ' + avg + 's</span></div>';
    }).join('');
    if(selectedMode(ctx) === 'ctcLohr'){
      var blocks = CTC_BLOCKS.concat(['Nicht bearbeitet']);
      var rows = blocks.map(function(block){
        var items = answered.filter(function(h){ return h && h.block === block; });
        if(!items.length) return '';
        var right = items.filter(function(h){ return h && h.correct; }).length;
        var p = safePercent(right, items.length);
        var open = items.filter(function(h){ return h && h.givenIndex === null; }).length;
        return '<div class="stat"><b>' + escHTML(block) + '</b><br>' + right + '/' + items.length + ' richtig<br><strong>' + p + '%</strong><br><span class="small">offen/übersprungen: ' + open + '</span></div>';
      }).join('');
      html += '<div class="box" style="grid-column:1/-1"><h3>Blockauswertung</h3><div class="statsgrid">' + rows + '</div></div>';
    }
    return html;
  }

  function buildTipItems(ctx, percent){
    ctx = asObj(ctx);
    var answered = historyFrom(ctx);
    var byGroup = aggregateBy(answered, function(h){ return h && h.group; });
    var cats = Object.keys(byGroup).map(function(cat){
      var items = byGroup[cat];
      return {
        cat: cat,
        p: safePercent(items.filter(function(h){ return h && h.correct; }).length, items.length),
        avg: items.length ? items.reduce(function(s,h){ return s + safeNumber(h && h.duration, 0); }, 0) / items.length : 0
      };
    }).sort(function(a,b){ return a.p - b.p; });
    var weakest = cats[0];
    var slow = cats.slice().sort(function(a,b){ return b.avg - a.avg; })[0];
    var timeouts = answered.filter(function(h){ return h && h.timeout; }).length;
    var open = answered.filter(function(h){ return h && h.givenIndex === null; }).length;
    var tips = [];
    if(selectedMode(ctx) === 'ctcLohr') tips.push('Prüfungsstrategie: Im Konzentrationsblock nicht vorne festbeißen. Erst sichere Aufgaben holen, dann schwere markieren und später prüfen.');
    if(weakest) tips.push('Schwächste Kategorie: <b>' + escHTML(weakest.cat) + '</b>. Nächster Lauf: gezielt 15 Minuten diesen Bereich.');
    if(slow) tips.push('Langsamste Kategorie: <b>' + escHTML(slow.cat) + '</b>. Dort mit Stoppuhr üben.');
    if(timeouts) tips.push('Zeitabläufe: <b>' + timeouts + '</b>. Leichte Aufgaben zuerst sicher holen, schwere schneller überspringen.');
    if(open) tips.push(open + ' offene oder übersprungene Aufgaben wurden als falsch gezählt.');
    if(!ctx.adaptiveElite) tips.push('Für gezieltes Nachtrainieren nutze den Eignungstest-Elite-Modus.');
    else tips.push('Elite-Runde beendet: Wiederhole den Modus direkt, damit deine Schwächen erneut unter Druck trainiert werden.');
    return {tips: tips, cats: cats, answered: answered};
  }

  function renderTips(ctx, percent){
    ctx = asObj(ctx);
    var built = buildTipItems(ctx, percent);
    var html = '<div class="box"><h3>Tipps zum Besserwerden</h3><ul>' + built.tips.map(function(t){ return '<li>' + t + '</li>'; }).join('') + '</ul></div>';
    var answered = built.answered;
    if(selectedMode(ctx) === 'ctcLohr'){
      var weakestBlock = null;
      CTC_BLOCKS.forEach(function(block){
        var items = answered.filter(function(h){ return h && h.block === block; });
        if(items.length){
          var p = safePercent(items.filter(function(h){ return h && h.correct; }).length, items.length);
          if(!weakestBlock || p < weakestBlock.p) weakestBlock = {block:block, p:p};
        }
      });
      if(weakestBlock) html += '<div class="tipBox"><b>Simulationsempfehlung:</b> Schwächster Block ist <b>' + escHTML(weakestBlock.block) + '</b> mit ' + weakestBlock.p + '%. Genau diesen Block gezielt trainieren.</div>';
      var edv = answered.filter(function(h){ return h && h.block === '5. EDV Kenntnisse'; });
      if(edv.length){
        var byKind = {};
        edv.forEach(function(h){
          var nd = h.schemaKind || h.selectedKind || 'EDV-Fehler';
          if(!byKind[nd]) byKind[nd] = {n:0, r:0};
          byKind[nd].n++;
          if(h.correct) byKind[nd].r++;
        });
        var rows = Object.keys(byKind).map(function(k){ return escHTML(k) + ': ' + byKind[k].r + '/' + byKind[k].n; }).join(' · ');
        html += '<div class="tipBox"><b>EDV-Diagramm Auswertung:</b> ' + rows + '. Trainiere das genaue Abgleichen von Geschichte, Pfeilrichtung und Inhalt.</div>';
      }
    }
    return html;
  }

  function renderReview(ctx){
    var wrong = historyFrom(ctx).filter(function(h){ return h && !h.correct; });
    if(!wrong.length) return '<div class="box">Keine Fehler. Sehr sauber.</div>';
    var groups = [];
    wrong.forEach(function(h){ var g = h.group || 'Sonstiges'; if(groups.indexOf(g) === -1) groups.push(g); });
    var filterHtml = '<div class="reviewFilter"><button onclick="App.filterReview(\'all\')">Alle Fehler</button><button onclick="App.filterReview(\'open\')">Nur offen/übersprungen</button>' + groups.map(function(g){ return '<button onclick="App.filterReview(\'' + jsArg(g) + '\')">' + escHTML(g) + '</button>'; }).join('') + '</div>';
    var rows = wrong.map(function(h, i){
      var answers = asArr(h.answers);
      var given = h.givenIndex === null ? (h.timeout ? 'Zeit abgelaufen' : 'Übersprungen/offen') : (answers[h.givenIndex] || '');
      var corr = answers[h.correctIndex] || '';
      var isEdv = h.visualType === 'edvmulti';
      var givenText = isEdv ? (htmlMaybe(given || 'keine Auswahl') + ' · Fehlerart: ' + escHTML(h.selectedKind || 'nicht gewählt')) : htmlMaybe(given);
      var corrText = isEdv ? (htmlMaybe(corr) + ' · Fehlerart: ' + escHTML(h.schemaKind || 'unbekannt')) : htmlMaybe(corr);
      return '<div class="reviewItem" data-group="' + escHTML(h.group || 'Sonstiges') + '" data-miss="' + (h.givenIndex === null ? 1 : 0) + '"><b>' + (i+1) + '. ' + escHTML(h.cat || 'Aufgabe') + '</b><br><b>Aufgabe:</b> ' + questionText(h) + '<p>Deine Antwort: <b>' + givenText + '</b><br>Richtig: <b>' + corrText + '</b></p><p class="small"><b>Erklärung:</b> ' + explanationText(h) + '</p><p class="small">Bearbeitungszeit: ' + (Math.round(safeNumber(h.duration,0)/100)/10) + 's</p></div>';
    }).join('');
    return filterHtml + rows;
  }

  function buildCategoryMap(ctx){
    ctx = asObj(ctx);
    var cats = {};
    var normalizeCategory = typeof ctx.normalizeCategory === 'function' ? ctx.normalizeCategory : function(v){ return v; };
    historyFrom(ctx).forEach(function(h){
      var group = normalizeCategory(h.group || h.cat || h.category) || 'Allgemein';
      if(!cats[group]) cats[group] = {n:0, r:0, t:0};
      cats[group].n++;
      if(h.correct) cats[group].r++;
      cats[group].t += safeNumber(h.duration,0);
    });
    return cats;
  }

  function renderAnalysis(ctx){
    ctx = asObj(ctx);
    var data = asArr(ctx.data);
    if(!data.length) return '<div class="box">Noch keine gespeicherten Testläufe. Starte zuerst einen Test.</div>';
    var coach = asObj(ctx.coach);
    var esc = typeof ctx.escHTML === 'function' ? ctx.escHTML : escHTML;
    var formatDate = typeof ctx.formatDate === 'function' ? ctx.formatDate : formatFallbackDate;
    var dynamicExplain = typeof ctx.dynamicExplain === 'function' ? ctx.dynamicExplain : function(){ return '-'; };
    var learningSummary = typeof ctx.learningSummary === 'function' ? ctx.learningSummary : function(){ return '-'; };
    var simulationLabel = typeof ctx.simulationLabel === 'function' ? ctx.simulationLabel : function(){ return '-'; };
    var readiness = coach.readiness || {percent:0, simulationCount:0, required:0};
    var recommendation = coach.recommendation || {title:'-', text:'-'};
    var adaptive = coach.adaptive || {label:'-', globalLevel:'-', focusGroup:'-'};
    var simulation = coach.simulation || {coverage:0, risk:'-'};
    var learning = coach.learning || {};
    var weaknesses = asArr(coach.weaknesses);
    var aiPanel = '<div class="box"><h3>AI Coach Engine</h3><div class="ai-readiness-bar"><div class="ai-readiness-fill" style="width:' + safeNumber(readiness.percent) + '%"></div></div>' +
      '<p><b>Datenbasis:</b> ' + safeNumber(readiness.percent) + '% · Simulationen ' + safeNumber(readiness.simulationCount) + '/' + safeNumber(readiness.required) + '</p>' +
      '<p><b>Empfehlung:</b> ' + esc(recommendation.title) + ' — ' + esc(recommendation.text) + '</p>' +
      '<p><b>Adaptive Engine:</b> ' + esc(adaptive.label) + ' · Level ' + esc(adaptive.globalLevel) + ' · Fokus ' + esc(adaptive.focusGroup || 'ausgeglichen') + '</p>' +
      '<p><b>Dynamic Generator:</b> ' + esc(dynamicExplain(coach.dynamicMix)) + '</p>' +
      '<p><b>Learning Memory:</b> ' + esc(learningSummary(learning)) + '</p>' +
      '<p><b>Full Simulation:</b> ' + esc(simulationLabel(simulation)) + ' · Abdeckung ' + safeNumber(simulation.coverage) + '% · Risiko ' + esc(simulation.risk) + '</p>' +
      '<div class="ai-list">' + (weaknesses.slice(0,4).map(function(w,i){ return '<div>' + (i+1) + '. <b>' + esc(w.group) + '</b> · ' + safeNumber(w.percent) + '% · ' + safeNumber(w.wrong) + ' Fehler</div>'; }).join('') || '<div>Noch keine Schwächen berechnet.</div>') + '</div></div>';
    var best = data.reduce(function(a,b){ return safeNumber(b.percent) > safeNumber(a.percent) ? b : a; }, data[0]);
    var last = data[data.length-1];
    var avg = Math.round(data.reduce(function(s,x){ return s + safeNumber(x.percent); }, 0) / data.length);
    var recent = data.slice(-12);
    var chart = '<div class="chart">' + recent.map(function(x){ return '<div class="barChart" style="height:' + Math.max(8, safeNumber(x.percent)*1.35) + 'px" title="' + safeNumber(x.percent) + '%">' + safeNumber(x.percent) + '</div>'; }).join('') + '</div>';
    var catAgg = {};
    data.forEach(function(r){ Object.keys(r.cats || {}).forEach(function(c){ var o = r.cats[c] || {}; if(!catAgg[c]) catAgg[c] = {n:0, r:0}; catAgg[c].n += safeNumber(o.n); catAgg[c].r += safeNumber(o.r); }); });
    var catRows = Object.keys(catAgg).map(function(c){ return {c:c, p:safePercent(catAgg[c].r, catAgg[c].n), n:catAgg[c].n}; }).sort(function(a,b){ return a.p - b.p; });
    var weak = catRows[0];
    var strong = catRows[catRows.length-1];
    return aiPanel + '<div class="statsgrid"><div class="stat"><b>Tests gesamt</b><br><strong>' + data.length + '</strong></div><div class="stat"><b>Durchschnitt</b><br><strong>' + avg + '%</strong></div><div class="stat"><b>Beste Leistung</b><br><strong>' + safeNumber(best.percent) + '%</strong><br><span class="small">' + esc(best.title) + '</span></div><div class="stat"><b>Letzter Test</b><br><strong>' + safeNumber(last.percent) + '%</strong><br><span class="small">' + esc(formatDate(new Date(last.date))) + '</span></div></div>' +
      '<div class="box"><h3>Fortschritt letzte Läufe</h3>' + chart + '</div>' +
      '<div class="box"><h3>Kategorieanalyse</h3>' + catRows.map(function(x){ return '<div><b>' + esc(x.c) + '</b> ' + x.p + '% (' + x.n + ' Aufgaben)<div class="hbar" style="width:' + Math.max(35,x.p) + '%">' + x.p + '%</div></div>'; }).join('') + '</div>' +
      '<div class="tipBox"><b>Empfehlung:</b> ' + (weak ? 'Arbeite als Nächstes an <b>' + esc(weak.c) + '</b>. Deine stärkste Kategorie ist aktuell <b>' + esc(strong && strong.c) + '</b>.' : 'Noch zu wenig Daten.') + '</div>' +
      '<div class="box"><h3>Letzte Testläufe</h3><table class="analysisTable"><tr><th>Datum</th><th>Modus</th><th>Ergebnis</th></tr>' + data.slice(-10).reverse().map(function(r){ return '<tr><td>' + esc(formatDate(new Date(r.date))) + '</td><td>' + esc(r.title) + '</td><td>' + safeNumber(r.score) + '/' + safeNumber(r.total) + ' · ' + safeNumber(r.percent) + '%</td></tr>'; }).join('') + '</table></div>';
  }

  window.EGTResultReviewEngine = Object.freeze({
    __version: VERSION,
    buildSummary: buildSummary,
    renderResultHeader: renderResultHeader,
    renderCategoryStats: renderCategoryStats,
    buildTipItems: buildTipItems,
    renderTips: renderTips,
    renderReview: renderReview,
    buildCategoryMap: buildCategoryMap,
    renderAnalysis: renderAnalysis,
    _test: Object.freeze({safePercent:safePercent, averageSeconds:averageSeconds})
  });
})();
