/* Eignungstest-Trainer · G53.0 Phase 24
   Coach / Analyse / Fehlerprofil Domain Engine
   Kapselt KI-Coach, Lernanalyse, Fehlerprofil, Empfehlungen, adaptive Schwierigkeit
   und Analyse-Rendering als stabile Domain-Fassade. */
(function(){
  'use strict';

  const VERSION = 'G53.0-phase24';

  function safeCall(target, method, args, fallback){
    try {
      if(target && typeof target[method] === 'function') return target[method].apply(target, args || []);
    } catch(e) {
      try { console.warn('[CoachAnalysisDomainEngine]', method, e); } catch(_e) {}
    }
    return fallback;
  }
  function emit(name, detail){
    try { window.dispatchEvent(new CustomEvent('egt:coach-analysis-domain:' + name, { detail: detail || {} })); } catch(e) {}
    try { if(window.AppEvents && typeof AppEvents.emit === 'function') AppEvents.emit('coach-analysis-domain:' + name, detail || {}); } catch(e2) {}
  }
  function arr(v){ return Array.isArray(v) ? v : []; }
  function obj(v){ return v && typeof v === 'object' ? v : {}; }
  function escFallback(v){
    return String(v == null ? '' : v).replace(/[&<>'"]/g, function(c){ return ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#039;','"':'&quot;'}[c]); });
  }
  function fmtDateFallback(date){
    try { return new Intl.DateTimeFormat('de-DE', { dateStyle:'short', timeStyle:'short' }).format(date instanceof Date ? date : new Date(date)); }
    catch(e){ return String(date || ''); }
  }

  function create(deps){
    deps = deps || {};
    const $ = typeof deps.$ === 'function' ? deps.$ : function(id){ return document.getElementById(id); };
    const escHTML = typeof deps.escHTML === 'function' ? deps.escHTML : escFallback;
    const formatDate = typeof deps.formatDate === 'function' ? deps.formatDate : fmtDateFallback;

    function getResults(){
      try { return arr(typeof deps.getResults === 'function' ? deps.getResults() : []); }
      catch(e){ return []; }
    }
    function normalizeResults(results){
      const list = arr(results == null ? getResults() : results);
      const guard = deps.Guard || null;
      return list.map(function(r){ return safeCall(guard, 'normalizeResult', [r], r || {}); }).filter(Boolean);
    }
    function buildAnalyticsFromHistory(history, modeTitle){
      return safeCall(deps.AnalyticsEngine, 'buildFromHistory', [history || [], modeTitle || 'Aktueller Test'], { total:0, cats:{}, recommendations:[] });
    }
    function buildAnalyticsFromResults(results){
      return safeCall(deps.AnalyticsEngine, 'buildFromResults', [normalizeResults(results)], { empty:true });
    }
    function buildSession(history, mode, title){
      return safeCall(deps.SessionTracker, 'buildSession', [history || [], mode, title], null);
    }
    function buildErrorMemory(results){
      return safeCall(deps.ErrorMemory, 'aggregate', [normalizeResults(results)], { byGroup:{}, byError:{}, totalAttempts:0, totalWrong:0 });
    }
    function readiness(results){
      return safeCall(deps.DataReadiness, 'evaluate', [normalizeResults(results)], { percent:0, ready:false, remaining:3, simulationCount:0, required:3, status:'sammelt' });
    }
    function weaknessProfile(memory){
      return safeCall(deps.WeaknessProfile, 'build', [obj(memory)], []);
    }
    function cognitiveProfile(memory, ready){
      return safeCall(deps.CognitiveProfile, 'build', [obj(memory), obj(ready)], []);
    }
    function recommendation(ready, weaknesses, memory){
      return safeCall(deps.RecommendationEngine, 'build', [obj(ready), arr(weaknesses), obj(memory)], { title:'Coach sammelt Daten', text:'Starte weitere Läufe, damit der Coach belastbar empfehlen kann.', mode:'novuraExams' });
    }
    function adaptive(ready, weaknesses, memory){
      return safeCall(deps.AdaptiveDifficultyEngine, 'build', [obj(ready), arr(weaknesses), obj(memory)], { active:false, globalLevel:'medium', precision:0, pressureRate:0, label:'sammelt Daten' });
    }
    function dynamicMix(coach){
      return safeCall(deps.DynamicGeneratorEngine, 'buildMix', [obj(coach)], []);
    }
    function learningMemory(results, memory){
      return safeCall(deps.LearningMemoryEngine, 'build', [normalizeResults(results), obj(memory)], { repeatErrors:[], trend:0, direction:'sammelt', openTasks:0, paceRisk:'niedrig', totalRuns:0 });
    }
    function fullSimulation(results, coach, learning){
      return safeCall(deps.FullSimulationEngine, 'build', [normalizeResults(results), obj(coach), obj(learning)], { simulationCount:0, coverage:0, covered:[], missing:[], risk:'niedrig', ready:false, next:'gezieltes Training' });
    }
    function explainMix(mix){
      return safeCall(deps.DynamicGeneratorEngine, 'explainMix', [arr(mix)], '');
    }
    function learningSummary(learning){
      return safeCall(deps.LearningMemoryEngine, 'summary', [obj(learning)], 'Keine wiederkehrenden Fehler erkannt.');
    }
    function simulationLabel(simulation){
      return safeCall(deps.FullSimulationEngine, 'label', [obj(simulation)], 'sammelt Daten');
    }
    function levelForGroup(group, baseLevel, coach){
      return safeCall(deps.AdaptiveDifficultyEngine, 'levelForGroup', [group, baseLevel, coach], baseLevel || 'medium');
    }
    function timeFor(question, coach){
      return safeCall(deps.AdaptiveDifficultyEngine, 'timeFor', [question, coach], question && question.time || 25);
    }
    function buildAdaptiveQuestion(index, total, coach){
      const c = coach || buildCoach(getResults());
      return safeCall(deps.DynamicGeneratorEngine, 'buildQuestion', [index || 0, total || 1, c], null);
    }

    function buildCoach(results){
      const normalized = normalizeResults(results);
      if(deps.CoachEngine && typeof deps.CoachEngine.build === 'function') {
        const built = safeCall(deps.CoachEngine, 'build', [normalized], null);
        if(built) return Object.assign({ domainVersion:VERSION }, built, { version: built.version || 'internal', domainVersion:VERSION });
      }
      const r = readiness(normalized);
      const memory = buildErrorMemory(normalized);
      const weaknesses = weaknessProfile(memory);
      const cognitive = cognitiveProfile(memory, r);
      const rec = recommendation(r, weaknesses, memory);
      const adapt = adaptive(r, weaknesses, memory);
      const baseCoach = { readiness:r, memory:memory, weaknesses:weaknesses, cognitive:cognitive, recommendation:rec, adaptive:adapt };
      const mix = dynamicMix(baseCoach);
      const learning = learningMemory(normalized, memory);
      const simulation = fullSimulation(normalized, Object.assign({}, baseCoach, { dynamicMix:mix }), learning);
      return { version:'domain-fallback', domainVersion:VERSION, readiness:r, memory:memory, weaknesses:weaknesses, cognitive:cognitive, recommendation:rec, adaptive:adapt, dynamicMix:mix, learning:learning, simulation:simulation, focus:currentFocus(), updatedAt:new Date().toISOString() };
    }

    function renderDashboard(coach){
      const c = coach || buildCoach(getResults());
      return safeCall(deps.CoachEngine, 'renderDashboard', [c], '<section class="coach-ui-screen"><div class="coach-panel"><h3>Coach</h3><p class="small">Coach-Dashboard derzeit nicht verfügbar.</p></div></section>');
    }

    function currentFocus(){
      return safeCall(deps.TrainingFocusEngine, 'current', [], { key:'auto', label:'KI Auto', group:null, mode:'novuraExams', hint:'KI darf den Schwerpunkt frei empfehlen.' });
    }
    function readFocus(){ return safeCall(deps.TrainingFocusEngine, 'read', [], 'auto'); }
    function writeFocus(key){ return safeCall(deps.TrainingFocusEngine, 'write', [key], 'auto'); }
    function renderFocus(){ return safeCall(deps.TrainingFocusEngine, 'render', [], null); }
    function isManualFocus(){ return !!safeCall(deps.TrainingFocusEngine, 'isManual', [], false); }
    function setTrainingFocus(key){
      const safe = writeFocus(key);
      const cur = currentFocus();
      try { const modes = deps.MODES || (typeof deps.getModes === 'function' ? deps.getModes() : null); if(cur && cur.key !== 'auto' && modes && modes[cur.mode] && typeof deps.selectMode === 'function') deps.selectMode(cur.mode); } catch(e) {}
      try { if(typeof deps.renderRuntimeDashboard === 'function') deps.renderRuntimeDashboard(); } catch(e2) {}
      renderFocus();
      emit('focus-changed', { key:safe, current:cur, version:VERSION });
      return cur;
    }

    function renderAnalysisHtml(data){
      const results = normalizeResults(data);
      if(!results.length) return '<div class="box">Noch keine gespeicherten Testläufe. Starte zuerst einen Test.</div>';
      const coach = buildCoach(results);
      try {
        const review = typeof deps.resultReviewEngine === 'function' ? deps.resultReviewEngine() : window.EGTResultReviewEngine;
        if(review && typeof review.renderAnalysis === 'function') {
          return review.renderAnalysis({
            data: results,
            coach: coach,
            escHTML: escHTML,
            formatDate: formatDate,
            dynamicExplain: explainMix,
            learningSummary: learningSummary,
            simulationLabel: simulationLabel
          });
        }
      } catch(e) { try { console.warn('CoachAnalysisDomainEngine review fallback', e); } catch(_e) {} }
      const r = coach.readiness || { percent:0, simulationCount:0, required:3 };
      const rec = coach.recommendation || {};
      const adapt = coach.adaptive || {};
      const sim = coach.simulation || {};
      const learning = coach.learning || {};
      const aiPanel = '<div class="box"><h3>AI Coach Engine</h3>'
        + '<div class="ai-readiness-bar"><div class="ai-readiness-fill" style="width:' + Math.max(0, Math.min(100, Number(r.percent)||0)) + '%"></div></div>'
        + '<p><b>Datenbasis:</b> ' + (r.percent||0) + '% · Simulationen ' + (r.simulationCount||0) + '/' + (r.required||3) + '</p>'
        + '<p><b>Empfehlung:</b> ' + escHTML(rec.title || 'Coach sammelt Daten') + ' — ' + escHTML(rec.text || 'Weitere Läufe verbessern die Empfehlung.') + '</p>'
        + '<p><b>Adaptive Engine:</b> ' + escHTML(adapt.label || 'sammelt Daten') + ' · Level ' + escHTML(adapt.globalLevel || 'medium') + ' · Fokus ' + escHTML(adapt.focusGroup || 'ausgeglichen') + '</p>'
        + '<p><b>Dynamic Generator:</b> ' + escHTML(explainMix(coach.dynamicMix)) + '</p>'
        + '<p><b>Learning Memory:</b> ' + escHTML(learningSummary(learning)) + '</p>'
        + '<p><b>Full Simulation:</b> ' + escHTML(simulationLabel(sim)) + ' · Abdeckung ' + (sim.coverage||0) + '% · Risiko ' + escHTML(sim.risk || 'niedrig') + '</p>'
        + '<div class="ai-list">' + (arr(coach.weaknesses).slice(0,4).map(function(w,i){ return '<div>' + (i+1) + '. <b>' + escHTML(w.group) + '</b> · ' + (w.percent||0) + '% · ' + (w.wrong||0) + ' Fehler</div>'; }).join('') || '<div>Noch keine Schwächen berechnet.</div>') + '</div></div>';
      const best = results.reduce(function(a,b){ return (b.percent||0) > (a.percent||0) ? b : a; }, results[0]);
      const last = results[results.length-1];
      const avg = Math.round(results.reduce(function(s,x){ return s + (x.percent||0); }, 0) / Math.max(1, results.length));
      const recent = results.slice(-12);
      const chart = '<div class="chart">' + recent.map(function(x){ return '<div class="barChart" style="height:' + Math.max(8, (x.percent||0)*1.35) + 'px" title="' + (x.percent||0) + '%">' + (x.percent||0) + '</div>'; }).join('') + '</div>';
      const catAgg = {};
      results.forEach(function(item){ Object.keys(item.cats || {}).forEach(function(c){ const o = item.cats[c] || {}; if(!catAgg[c]) catAgg[c] = { n:0, r:0 }; catAgg[c].n += o.n || o.total || 0; catAgg[c].r += o.r || o.correct || 0; }); });
      const catRows = Object.keys(catAgg).map(function(c){ return { c:c, p:Math.round((catAgg[c].r || 0) / Math.max(1, catAgg[c].n || 1) * 100), n:catAgg[c].n || 0 }; }).sort(function(a,b){ return a.p-b.p; });
      const weak = catRows[0], strong = catRows[catRows.length-1];
      return aiPanel
        + '<div class="statsgrid"><div class="stat"><b>Tests gesamt</b><br><strong>' + results.length + '</strong></div><div class="stat"><b>Durchschnitt</b><br><strong>' + avg + '%</strong></div><div class="stat"><b>Beste Leistung</b><br><strong>' + (best.percent||0) + '%</strong><br><span class="small">' + escHTML(best.title || best.mode || '') + '</span></div><div class="stat"><b>Letzter Test</b><br><strong>' + (last.percent||0) + '%</strong><br><span class="small">' + escHTML(formatDate(new Date(last.date))) + '</span></div></div>'
        + '<div class="box"><h3>Fortschritt letzte Läufe</h3>' + chart + '</div>'
        + '<div class="box"><h3>Kategorieanalyse</h3>' + catRows.map(function(x){ return '<div><b>' + escHTML(x.c) + '</b> ' + x.p + '% (' + x.n + ' Aufgaben)<div class="hbar" style="width:' + Math.max(35,x.p) + '%">' + x.p + '%</div></div>'; }).join('') + '</div>'
        + '<div class="tipBox"><b>Empfehlung:</b> ' + (weak ? 'Arbeite als Nächstes an <b>' + escHTML(weak.c) + '</b>. Deine stärkste Kategorie ist aktuell <b>' + escHTML(strong && strong.c || '') + '</b>.' : 'Noch zu wenig Daten.') + '</div>'
        + '<div class="box"><h3>Letzte Testläufe</h3><table class="analysisTable"><tr><th>Datum</th><th>Modus</th><th>Ergebnis</th></tr>' + results.slice(-10).reverse().map(function(item){ return '<tr><td>' + escHTML(formatDate(new Date(item.date))) + '</td><td>' + escHTML(item.title || item.mode || '') + '</td><td>' + (item.score||0) + '/' + (item.total||0) + ' · ' + (item.percent||0) + '%</td></tr>'; }).join('') + '</table></div>';
    }

    function showAnalysis(){
      try { if(typeof deps.showOnly === 'function') deps.showOnly('analysis'); } catch(e) {}
      const el = $('analysisContent');
      if(el) el.innerHTML = renderAnalysisHtml(getResults());
      emit('analysis-rendered', { version:VERSION, runs:getResults().length });
      return true;
    }

    function state(){
      const results = normalizeResults(getResults());
      const coach = buildCoach(results);
      return {
        version: VERSION,
        provider: 'coach-analysis-domain-facade',
        runs: results.length,
        readiness: coach.readiness || null,
        weaknesses: arr(coach.weaknesses).slice(0,5),
        recommendation: coach.recommendation || null,
        adaptive: coach.adaptive || null,
        focus: currentFocus(),
        simulation: coach.simulation || null,
        updatedAt: coach.updatedAt || null
      };
    }
    function diagnostics(){
      const depsStatus = {
        CoachEngine: !!(deps.CoachEngine && typeof deps.CoachEngine.build === 'function'),
        AnalyticsEngine: !!deps.AnalyticsEngine,
        SessionTracker: !!deps.SessionTracker,
        ErrorMemory: !!deps.ErrorMemory,
        DataReadiness: !!deps.DataReadiness,
        WeaknessProfile: !!deps.WeaknessProfile,
        CognitiveProfile: !!deps.CognitiveProfile,
        RecommendationEngine: !!deps.RecommendationEngine,
        TrainingFocusEngine: !!deps.TrainingFocusEngine,
        AdaptiveDifficultyEngine: !!deps.AdaptiveDifficultyEngine,
        DynamicGeneratorEngine: !!deps.DynamicGeneratorEngine,
        LearningMemoryEngine: !!deps.LearningMemoryEngine,
        FullSimulationEngine: !!deps.FullSimulationEngine,
        ResultReviewEngine: !!(typeof deps.resultReviewEngine === 'function' ? deps.resultReviewEngine() : window.EGTResultReviewEngine)
      };
      const missing = Object.keys(depsStatus).filter(function(k){ return !depsStatus[k]; });
      return { ok: missing.length === 0 || !!deps.CoachEngine, version:VERSION, provider:'coach-analysis-domain-facade', missing:missing, deps:depsStatus, focus:currentFocus() };
    }

    const api = {
      __version: VERSION,
      __provider: 'coach-analysis-domain-facade',
      normalizeResults: normalizeResults,
      buildAnalyticsFromHistory: buildAnalyticsFromHistory,
      buildAnalyticsFromResults: buildAnalyticsFromResults,
      buildSession: buildSession,
      buildErrorMemory: buildErrorMemory,
      readiness: readiness,
      weaknessProfile: weaknessProfile,
      cognitiveProfile: cognitiveProfile,
      recommendation: recommendation,
      adaptive: adaptive,
      dynamicMix: dynamicMix,
      learningMemory: learningMemory,
      fullSimulation: fullSimulation,
      explainMix: explainMix,
      learningSummary: learningSummary,
      simulationLabel: simulationLabel,
      levelForGroup: levelForGroup,
      timeFor: timeFor,
      buildAdaptiveQuestion: buildAdaptiveQuestion,
      buildCoach: buildCoach,
      renderDashboard: renderDashboard,
      renderAnalysisHtml: renderAnalysisHtml,
      showAnalysis: showAnalysis,
      currentFocus: currentFocus,
      readFocus: readFocus,
      writeFocus: writeFocus,
      renderFocus: renderFocus,
      isManualFocus: isManualFocus,
      setTrainingFocus: setTrainingFocus,
      state: state,
      snapshot: state,
      diagnostics: diagnostics
    };
    return api;
  }

  window.EGTCoachAnalysisDomainEngine = Object.freeze({ __version: VERSION, create:create });
})();
