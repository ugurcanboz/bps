/* Eignungstest-Trainer · Result Flow Engine
   Phase 19: Kapselt Ergebnisabschluss, Auswertungsrouting und Persistenz-Hooks als eigene Core-Grenze. */
(function(){
  "use strict";
  if(window.EGTResultFlowEngine && window.EGTResultFlowEngine.__ready) return;

  var VERSION = "G52.5-phase19";

  function safeObj(value){ return value && typeof value === "object" ? value : {}; }
  function safeArr(value){ return Array.isArray(value) ? value : []; }
  function safeNum(value, fallback){ var n = Number(value); return Number.isFinite(n) ? n : (fallback || 0); }
  function html(value){ return String(value == null ? "" : value); }
  function getById(ctx, id){
    try { if(typeof ctx.$ === "function") return ctx.$(id); } catch(e) {}
    try { return document.getElementById(id); } catch(e) { return null; }
  }
  function setHtml(ctx, id, value){ var el = getById(ctx, id); if(el) el.innerHTML = html(value); return !!el; }
  function appendHtml(ctx, id, value){ var el = getById(ctx, id); if(el) el.insertAdjacentHTML("beforeend", html(value)); return !!el; }
  function call(fn, args, fallback, label){
    try { if(typeof fn === "function") return fn.apply(null, args || []); }
    catch(e){ try { console.warn(label || "ResultFlow call failed", e); } catch(ignore) {} }
    return typeof fallback === "function" ? fallback() : fallback;
  }
  function selectedMode(ctx){ var state = safeObj(ctx.state); return state.selectedMode || ctx.mode || "unknown"; }
  function modeTitle(ctx){
    var mode = selectedMode(ctx);
    var modes = safeObj(ctx.modes);
    return (modes[mode] && modes[mode].title) || ctx.title || mode;
  }
  function formatTime(ctx, value){
    if(typeof ctx.formatTime === "function") return ctx.formatTime(value);
    try { return value ? new Date(value).toLocaleTimeString("de-DE", {hour:"2-digit", minute:"2-digit"}) : "-"; } catch(e) { return "-"; }
  }
  function formatDuration(ctx, ms){
    if(typeof ctx.formatDuration === "function") return ctx.formatDuration(ms);
    var seconds = Math.max(0, Math.round(safeNum(ms, 0) / 1000));
    return Math.floor(seconds / 60) + ":" + String(seconds % 60).padStart(2, "0") + " min";
  }
  function averageSeconds(history){
    history = safeArr(history).filter(Boolean);
    if(!history.length) return 0;
    return Math.round(history.reduce(function(sum, item){ return sum + safeNum(item && item.duration, 0); }, 0) / history.length / 100) / 10;
  }
  function fallbackSummary(ctx){
    var state = safeObj(ctx.state);
    var history = safeArr(state.history).filter(Boolean);
    var total = history.length || 1;
    var score = history.filter(function(h){ return h && h.correct; }).length;
    var percent = Math.round(score / Math.max(1, total) * 100);
    var mode = selectedMode(ctx);
    var target = mode === "ctc" ? 70 : mode === "bps" ? 75 : 80;
    var verdict = percent >= target ? "Stark für diesen Modus." : percent >= target - 10 ? "Knapp dran, aber noch instabil unter Druck." : "Noch zu fehleranfällig für einen sicheren Lauf.";
    return {
      version: VERSION + "-fallback-summary",
      mode: mode,
      title: modeTitle(ctx),
      score: score,
      total: total,
      percent: percent,
      duration: state.testStart && state.testEnd ? formatDuration(ctx, state.testEnd - state.testStart) : "nicht erfasst",
      avg: averageSeconds(history),
      target: target,
      verdict: verdict,
      examEnabled: !!(state.exam && state.exam.enabled),
      testStart: state.testStart || null,
      testEnd: state.testEnd || null,
      isTrainingMode: ["mathSprint","textMathSprint","logicSprint","concentrationSprint","visualIQSprint","itSprint","knowledgeSprint","techniqueSprint","errorTrainingPrep"].indexOf(mode) !== -1
    };
  }
  function fallbackResultHeader(ctx, summary){
    summary = safeObj(summary);
    var examBanner = summary.examEnabled ? '<div class="exam-banner">Prüfungsmodus abgeschlossen. Offene Aufgaben wurden streng gewertet.</div>' : '';
    var trainingNote = summary.isTrainingMode ? '<div class="training-note"><b>Blocktraining PRO:</b> Dieser Lauf zählt als gezielte Trainingseinheit. Nutze die Kategorieauswertung direkt für den nächsten Sprint.</div>' : '';
    return examBanner + trainingNote + '<div class="bigScore">' + safeNum(summary.score) + '/' + safeNum(summary.total, 1) + '</div>' +
      '<div class="statsgrid">' +
      '<div class="stat"><b>Quote</b><br><strong>' + safeNum(summary.percent) + '%</strong></div>' +
      '<div class="stat"><b>Beginn</b><br><strong>' + formatTime(ctx, summary.testStart) + '</strong></div>' +
      '<div class="stat"><b>Ende</b><br><strong>' + formatTime(ctx, summary.testEnd) + '</strong></div>' +
      '<div class="stat"><b>Dauer</b><br><strong>' + html(summary.duration) + '</strong></div>' +
      '<div class="stat"><b>Ø pro Aufgabe</b><br><strong>' + safeNum(summary.avg) + 's</strong></div>' +
      '</div><div class="tipBox"><b>' + html(summary.verdict) + '</b></div>';
  }
  function finishSimulation(ctx, summary, source){
    try {
      var sim = ctx.simulationEngine || window.EGTSimulation;
      if(sim && typeof sim.finish === "function") {
        sim.finish({
          mode: selectedMode(ctx),
          total: safeArr(safeObj(ctx.state).quiz).length,
          answered: safeNum(summary.total, 0),
          score: safeNum(summary.score, 0),
          percent: safeNum(summary.percent, 0),
          duration: summary.duration || "",
          avg: safeNum(summary.avg, 0),
          source: source || VERSION
        });
        return true;
      }
    } catch(e) { try { console.warn("ResultFlow simulation finish fallback", e); } catch(ignore) {} }
    return false;
  }
  function prepareResult(ctx){
    ctx = safeObj(ctx);
    var state = safeObj(ctx.state);
    var packet = null;
    try {
      var sim = ctx.simulationEngine || window.EGTSimulation;
      if(sim && typeof sim.prepareResult === "function") packet = sim.prepareResult({ state: state, mode: selectedMode(ctx) });
    } catch(e) { try { console.warn("EGTSimulation.prepareResult fallback", e); } catch(ignore) {} }

    if(packet && packet.summary) {
      var simSummary = packet.summary;
      state.score = safeNum(simSummary.score, state.score || 0);
      setHtml(ctx, "resultText", packet.html || "");
      finishSimulation(ctx, simSummary, "simulation-packet");
      return {
        ok: true,
        source: "simulation-packet",
        summary: {
          score: safeNum(simSummary.score, 0),
          total: safeNum(simSummary.total, 0),
          percent: safeNum(simSummary.percent, 0),
          duration: simSummary.duration || "",
          avg: safeNum(simSummary.avg, 0)
        }
      };
    }

    try {
      var review = ctx.resultReviewEngine || window.EGTResultReviewEngine;
      if(review && typeof review.buildSummary === "function") {
        var reviewCtx = typeof ctx.resultReviewContext === "function" ? ctx.resultReviewContext({ testEnd: state.testEnd }) : ctx;
        var summary = review.buildSummary(reviewCtx);
        state.score = safeNum(summary.score, state.score || 0);
        if(typeof review.renderResultHeader === "function") setHtml(ctx, "resultText", review.renderResultHeader(summary, { formatTime: ctx.formatTime }));
        else setHtml(ctx, "resultText", fallbackResultHeader(ctx, summary));
        finishSimulation(ctx, summary, "review-engine");
        return {ok:true, source:"result-review-engine", summary:summary};
      }
    } catch(e) { try { console.warn("EGTResultReviewEngine summary fallback", e); } catch(ignore) {} }

    var fallback = fallbackSummary(ctx);
    state.score = fallback.score;
    setHtml(ctx, "resultText", fallbackResultHeader(ctx, fallback));
    finishSimulation(ctx, fallback, "fallback-summary");
    return {ok:true, source:"fallback", summary:fallback};
  }
  function renderSecondaryPanels(ctx, summary){
    summary = safeObj(summary);
    call(ctx.renderCategoryStats, [], null, "ResultFlow category render fallback");
    call(ctx.renderTips, [summary.percent], null, "ResultFlow tips render fallback");
    call(ctx.renderReview, [], null, "ResultFlow review render fallback");
    try {
      if(typeof ctx.prognosisCardHtml === "function") {
        var pg = ctx.prognosisCardHtml();
        if(pg) appendHtml(ctx, "resultText", pg);
      }
    } catch(e) { try { console.warn("ResultFlow prognosis fallback", e); } catch(ignore) {} }
  }
  function persistResult(ctx, summary){
    summary = safeObj(summary);
    try {
      if(typeof ctx.resultPersistenceContext === "function") {
        var persistence = ctx.resultPersistenceEngine || window.EGTResultPersistenceEngine;
        if(persistence && typeof persistence.persistResult === "function") {
          return persistence.persistResult(ctx.resultPersistenceContext({
            percent: safeNum(summary.percent, 0),
            total: safeNum(summary.total, 0),
            score: safeNum(summary.score, 0),
            duration: summary.duration || "",
            dur: summary.duration || "",
            avg: safeNum(summary.avg, 0)
          }));
        }
      }
    } catch(e) { try { console.warn("ResultFlow persistence-engine fallback", e); } catch(ignore) {} }
    return call(ctx.saveResult, [summary.percent, summary.duration, summary.avg], {ok:false, fallback:true}, "ResultFlow saveResult fallback");
  }
  function finishCoachSession(ctx, summary){
    try {
      var persistence = ctx.resultPersistenceEngine || window.EGTResultPersistenceEngine;
      if(persistence && typeof persistence.finishCoachSession === "function" && typeof ctx.resultPersistenceContext === "function") {
        return persistence.finishCoachSession(ctx.resultPersistenceContext({
          percent: safeNum(summary.percent, 0),
          total: safeNum(summary.total, 0),
          score: safeNum(summary.score, 0),
          duration: summary.duration || "",
          dur: summary.duration || "",
          avg: safeNum(summary.avg, 0)
        }));
      }
      var learning = ctx.learningCoach || window.EGTLearningCoach;
      if(learning && typeof learning.onSessionFinished === "function") {
        learning.onSessionFinished({percent:summary.percent, total:summary.total, score:summary.score, duration:summary.duration, avg:summary.avg});
        return {ok:true, fallback:true};
      }
    } catch(e) { try { console.warn("Coach session hook failed", e); } catch(ignore) {} }
    return {ok:false, skipped:true};
  }
  function showResult(ctx){
    ctx = safeObj(ctx);
    var state = safeObj(ctx.state);
    if(state.duel && typeof ctx.showDuellResult === "function") return ctx.showDuellResult();
    call(ctx.clearTimer, [], null, "ResultFlow timer clear fallback");
    call(ctx.clearRouteTimers, [], null, "ResultFlow route-timer clear fallback");
    call(ctx.finalizeOpenAnswers, [], null, "ResultFlow finalize fallback");
    state.testEnd = new Date();
    call(ctx.showOnly, ["result"], null, "ResultFlow screen-route fallback");
    var prepared = prepareResult(ctx);
    var summary = safeObj(prepared.summary || fallbackSummary(ctx));
    renderSecondaryPanels(ctx, summary);
    var saved = persistResult(ctx, summary);
    var coach = finishCoachSession(ctx, summary);
    return {ok:true, version:VERSION, source:prepared.source || "unknown", summary:summary, persistence:saved, coach:coach};
  }
  function create(baseCtx){
    baseCtx = safeObj(baseCtx);
    return Object.freeze({
      __version: VERSION,
      diagnostics: function(){ return {ok:true, provider:"result-flow-engine", version:VERSION}; },
      showResult: function(extra){ return showResult(Object.assign({}, baseCtx, safeObj(extra))); },
      prepareResult: function(extra){ return prepareResult(Object.assign({}, baseCtx, safeObj(extra))); },
      renderSecondaryPanels: function(extra, summary){ return renderSecondaryPanels(Object.assign({}, baseCtx, safeObj(extra)), summary); },
      persistResult: function(extra, summary){ return persistResult(Object.assign({}, baseCtx, safeObj(extra)), summary); }
    });
  }

  window.EGTResultFlowEngine = Object.freeze({
    __ready: true,
    version: VERSION,
    create: create,
    showResult: showResult,
    _test: Object.freeze({fallbackSummary:fallbackSummary, averageSeconds:averageSeconds})
  });
})();
