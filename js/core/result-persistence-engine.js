/* Eignungstest-Trainer · Result Persistence Engine
   Phase 12: Kapselt Speichern, Highscore-Sync und Coach-/Portal-Hooks als eigene Core-Grenze. */
(function(){
  "use strict";
  if(window.EGTResultPersistenceEngine && window.EGTResultPersistenceEngine.__ready) return;

  function safeFn(fn, fallback){ return typeof fn === "function" ? fn : fallback; }
  function safeObject(value){ return value && typeof value === "object" ? value : {}; }
  function nowIso(){ return new Date().toISOString(); }
  function modeTitle(ctx){
    const state = safeObject(ctx.state);
    const modes = safeObject(ctx.modes);
    const mode = state.selectedMode || ctx.mode || "unknown";
    return (modes[mode] && modes[mode].title) || ctx.title || mode;
  }
  function defaultNormalizeResult(entry){ return entry || {}; }
  function getNormalizeResult(ctx){
    const guard = ctx.guard || window.Guard;
    return guard && typeof guard.normalizeResult === "function" ? guard.normalizeResult.bind(guard) : defaultNormalizeResult;
  }
  function defaultNormalizeCategory(value){ return value || "Allgemein"; }
  function resolveNormalizeCategory(ctx){
    if(typeof ctx.normalizeCategory === "function") return ctx.normalizeCategory;
    const coachDNA = ctx.coachDNA || window.EGTCoachDNA;
    if(coachDNA && typeof coachDNA.normalizeCategory === "function") return coachDNA.normalizeCategory.bind(coachDNA);
    return defaultNormalizeCategory;
  }

  function fallbackCategoryMap(ctx){
    const state = safeObject(ctx.state);
    const history = Array.isArray(ctx.history) ? ctx.history : (Array.isArray(state.history) ? state.history : []);
    const normalizeCategory = resolveNormalizeCategory(ctx);
    const cats = {};
    history.filter(Boolean).forEach(function(h){
      const raw = h.group || h.cat || h.category || "Allgemein";
      const group = normalizeCategory(raw) || "Allgemein";
      if(!cats[group]) cats[group] = {n:0,r:0,t:0};
      cats[group].n++;
      if(h.correct) cats[group].r++;
      cats[group].t += Number(h.duration || 0);
    });
    return cats;
  }

  function buildCategoryMap(ctx){
    ctx = safeObject(ctx);
    try {
      if(typeof ctx.buildCategoryMap === "function") {
        const direct = ctx.buildCategoryMap(ctx);
        if(direct && Object.keys(direct).length) return direct;
      }
    } catch(e) { console.warn("ResultPersistence category direct fallback", e); }
    try {
      const engine = ctx.resultReviewEngine || window.EGTResultReviewEngine;
      if(engine && typeof engine.buildCategoryMap === "function") {
        const baseCtx = typeof ctx.resultReviewContext === "function"
          ? ctx.resultReviewContext({ normalizeCategory: resolveNormalizeCategory(ctx) })
          : ctx;
        const routed = engine.buildCategoryMap(baseCtx);
        if(routed && Object.keys(routed).length) return routed;
      }
    } catch(e) { console.warn("ResultPersistence review-category fallback", e); }
    return fallbackCategoryMap(ctx);
  }

  function fallbackSession(ctx){
    const state = safeObject(ctx.state);
    const history = Array.isArray(ctx.history) ? ctx.history : (Array.isArray(state.history) ? state.history : []);
    const total = Math.max(1, history.filter(Boolean).length);
    const correct = history.filter(function(h){ return h && h.correct; }).length;
    const groups = {};
    history.filter(Boolean).forEach(function(h){
      const group = h.group || h.cat || "Sonstiges";
      groups[group] = groups[group] || {total:0, correct:0, wrong:0, time:0, open:0, pressure:0};
      groups[group].total++;
      if(h.correct) groups[group].correct++; else groups[group].wrong++;
      groups[group].time += Number(h.duration || 0);
      if(h.givenIndex === null || h.skipped || h.timeout) groups[group].open++;
    });
    Object.keys(groups).forEach(function(k){
      const g = groups[k];
      g.percent = Math.round(g.correct / Math.max(1, g.total) * 100);
      g.avgMs = Math.round(g.time / Math.max(1, g.total));
    });
    return {
      version:"persistence-fallback",
      mode: state.selectedMode || ctx.mode || "unknown",
      title: modeTitle(ctx),
      total: total,
      correct: correct,
      percent: Math.round(correct / total * 100),
      groups: groups,
      errors: {},
      pressureErrors: 0,
      openCount: history.filter(function(h){ return h && (h.givenIndex === null || h.skipped || h.timeout); }).length,
      fastWrong: 0,
      createdAt: nowIso()
    };
  }

  function buildSession(ctx){
    ctx = safeObject(ctx);
    const state = safeObject(ctx.state);
    const tracker = ctx.sessionTracker || window.SessionTracker;
    try {
      if(tracker && typeof tracker.buildSession === "function") {
        return tracker.buildSession(state.history || ctx.history || [], state.selectedMode || ctx.mode || "unknown", modeTitle(ctx));
      }
    } catch(e) { console.warn("ResultPersistence session fallback", e); }
    return fallbackSession(ctx);
  }

  function resolveIdentity(ctx){
    ctx = safeObject(ctx);
    const state = safeObject(ctx.state);
    const profile = safeObject(typeof ctx.readProfile === "function" ? ctx.readProfile() : ctx.profile);
    let authIdentity = safeObject(ctx.authIdentity);
    try {
      const auth = ctx.authProfileShell || window.EGTAuthProfileShell;
      if(auth && typeof auth.highscoreIdentity === "function") authIdentity = safeObject(auth.highscoreIdentity());
    } catch(e) {}
    let userId = authIdentity.userId;
    try { if(!userId && typeof ctx.activeLearnerId === "function") userId = ctx.activeLearnerId(); } catch(e) {}
    userId = userId || profile.userId || "GUEST";
    const visibleName = authIdentity.playerName || authIdentity.nickname || profile.name || userId || "Gast";
    return {
      authIdentity: authIdentity,
      profile: profile,
      userId: userId,
      visibleName: visibleName,
      mode: state.selectedMode || ctx.mode || "unknown",
      title: modeTitle(ctx)
    };
  }

  function buildRecord(ctx){
    ctx = safeObject(ctx);
    const state = safeObject(ctx.state);
    const identity = resolveIdentity(ctx);
    const cats = ctx.cats || buildCategoryMap(ctx);
    const aiSession = ctx.aiSession || buildSession(ctx);
    const date = nowIso();
    var record = {
      date: date,
      userId: identity.userId,
      learnerId: identity.userId,
      player_name: identity.visibleName,
      player_id: identity.authIdentity.profileId || identity.profile.player_id || identity.userId,
      profileId: identity.authIdentity.profileId || "",
      role: identity.authIdentity.role || "",
      groupId: identity.authIdentity.groupId || "",
      mode: identity.mode,
      title: identity.title,
      score: Number(state.score || ctx.score || 0),
      total: Array.isArray(state.history) ? state.history.length : Number(ctx.total || 0),
      percent: Number(ctx.percent || 0),
      duration: ctx.duration || ctx.dur || "",
      avg: Number(ctx.avg || 0),
      cats: cats,
      exam: Object.assign({}, state.exam || ctx.exam || {}),
      aiSession: aiSession,
      appVersion: ctx.appVersion || (window.AppConfig && window.AppConfig.build) || "unknown"
    };
    try { if(window.NovuraExamsAdminReportEngine && typeof NovuraExamsAdminReportEngine.enrichRecord === 'function') record = NovuraExamsAdminReportEngine.enrichRecord(record, Object.assign({}, ctx, { state: state, history: state.history || ctx.history, quiz: state.quiz || ctx.quiz })); } catch(e) { console.warn('Novura Exams Admin Report enrich fallback', e); }
    return record;
  }

  function readExistingRecords(ctx){
    const storage = ctx.storageEngine;
    const normalize = getNormalizeResult(ctx);
    try {
      if(storage && typeof storage.read === "function") {
        const rows = storage.read([]);
        return Array.isArray(rows) ? rows.map(function(entry){ return normalize(entry); }) : [];
      }
    } catch(e) { console.warn("ResultPersistence read fallback", e); }
    try {
      if(typeof ctx.getResults === "function") return (ctx.getResults() || []).map(function(entry){ return normalize(entry); });
    } catch(e) {}
    return [];
  }

  function writeRecords(ctx, records){
    const storage = ctx.storageEngine;
    const bridge = ctx.databaseBridge;
    const maxRecords = Math.max(10, Number(ctx.maxRecords || (storage && storage.maxRecords) || 300));
    const payload = records.slice(-maxRecords).map(function(entry){
      try { return bridge && typeof bridge.createResultRecord === "function" ? bridge.createResultRecord(entry) : entry; }
      catch(e) { return entry; }
    });
    if(!storage || typeof storage.write !== "function") return {ok:false, reason:"StorageEngine fehlt"};
    storage.write(payload);
    return {ok:true, count:payload.length};
  }

  function dispatchHooks(ctx, latest){
    const cats = latest.cats || {};
    const state = safeObject(ctx.state);
    const resultsGetter = typeof ctx.getResults === "function" ? ctx.getResults : function(){ return []; };
    const hookResults = {coach:false, admin:false, demo:false, highscore:false, cloud:false};

    try {
      const coachDNA = ctx.coachDNA || window.EGTCoachDNA;
      if(coachDNA && typeof coachDNA.recordResult === "function") {
        coachDNA.recordResult(latest);
        hookResults.coach = true;
      }
    } catch(e) { console.warn("Coach DNA", e); }

    try {
      const adminPortal = ctx.adminPortal || window.EGTAdminPortal;
      if(adminPortal && typeof adminPortal.trackEvent === "function") {
        var adminPayload = Object.assign({}, latest, {
          userId: latest.userId,
          module: latest.mode,
          mode: latest.mode,
          score: latest.percent,
          rawScore: latest.score,
          passed: latest.percent >= 70,
          correct: latest.percent >= 70,
          errors: Object.keys(cats).filter(function(k){ return cats[k].r < cats[k].n; }),
          total: Array.isArray(state.history) ? state.history.length : latest.total,
          categoryStats: cats,
          coachSession: latest.aiSession
        });
        try { if(window.NovuraExamsAdminReportEngine && typeof NovuraExamsAdminReportEngine.toAdminEvent === 'function') adminPayload = NovuraExamsAdminReportEngine.toAdminEvent(adminPayload, ctx); } catch(e2) { console.warn('Novura Exams Admin Event enrich fallback', e2); }
        adminPortal.trackEvent(adminPayload);
        hookResults.admin = true;
      }
    } catch(e) { console.warn("AdminPortal trackEvent", e); }

    try {
      const auth = ctx.authProfileShell || window.EGTAuthProfileShell;
      if(auth && typeof auth.recordDemoSimulation === "function") {
        auth.recordDemoSimulation({
          mode: latest.mode,
          runId: String(state.testStart ? state.testStart.getTime() : latest.date),
          date: latest.date,
          percent: latest.percent
        });
        hookResults.demo = true;
      }
    } catch(e) { console.warn("Demo-Zähler", e); }

    try {
      const hs = ctx.highscoreEngine || window.HighscoreEngine;
      if(hs && typeof hs.persistFromResults === "function") {
        Promise.resolve(hs.persistFromResults(resultsGetter())).catch(function(){});
        hookResults.highscore = true;
      }
    } catch(e) { console.warn("Highscore persist", e); }

    try {
      const cloud = ctx.cloudHighscoreEngine || window.CloudHighscoreEngine;
      if(cloud && typeof cloud.submit === "function") {
        Promise.resolve(cloud.submit(latest))
          .then(function(){ if(cloud && typeof cloud.refreshDashboard === "function") return cloud.refreshDashboard(); })
          .catch(function(err){ console.warn("Cloud Highscore Sync", err); if(cloud && typeof cloud.refreshDashboard === "function") cloud.refreshDashboard(); });
        hookResults.cloud = true;
      }
    } catch(e) { console.warn("Cloud Highscore dispatch", e); }

    return hookResults;
  }

  function persistResult(ctx){
    ctx = safeObject(ctx);
    try {
      if(typeof ctx.activeLearnerNeedsPasswordChange === "function" && ctx.activeLearnerNeedsPasswordChange()) {
        console.warn("Fortschritt wird erst nach dem Pflicht-Passwortwechsel gespeichert.");
        return {ok:false, skipped:true, reason:"password-change-required"};
      }
    } catch(e) {}
    const latest = buildRecord(ctx);
    var activitySession = null;
    try {
      const ledger = ctx.activityLedger || window.EGTActivityLedgerEngine;
      if(ledger && typeof ledger.sessionFromResult === "function") {
        activitySession = ledger.sessionFromResult({
          record: latest,
          state: ctx.state,
          history: (ctx.state && ctx.state.history) || ctx.history || [],
          profile: typeof ctx.readProfile === "function" ? ctx.readProfile() : ctx.profile,
          authIdentity: ctx.authIdentity,
          userId: latest.userId,
          profileId: latest.profileId,
          groupId: latest.groupId,
          courseId: (window.AppConfig && window.AppConfig.courseId) || "course_2026_gk",
          sourceRunId: latest.date
        });
        if(activitySession) {
          latest.sessionId = activitySession.sessionId;
          latest.sessionType = activitySession.kind;
          latest.activitySession = activitySession;
          if(typeof ledger.storeSession === "function") ledger.storeSession(activitySession);
        }
      }
    } catch(activityError) { console.warn("Activity ledger result capture fallback", activityError); }
    const rows = readExistingRecords(ctx);
    rows.push(latest);
    const storageResult = writeRecords(ctx, rows);
    const hooks = dispatchHooks(ctx, latest);
    return {ok:!!storageResult.ok, latest:latest, activitySession:activitySession, storage:storageResult, hooks:hooks};
  }

  function recordAnswerAttempt(ctx){
    ctx = safeObject(ctx);
    const state = safeObject(ctx.state);
    const historyItem = ctx.historyItem || (Array.isArray(state.history) ? state.history[state.current] : null);
    const question = ctx.question || (Array.isArray(state.quiz) ? state.quiz[state.current] : null);
    const outcome = {learning:false, coachDNA:false};
    try {
      const learning = ctx.learningCoach || window.EGTLearningCoach;
      if(learning && typeof learning.onAnswerRecorded === "function") {
        learning.onAnswerRecorded(historyItem, question);
        outcome.learning = true;
      }
    } catch(e) { console.warn("Learning coach answer hook", e); }
    try {
      const needsChange = typeof ctx.activeLearnerNeedsPasswordChange === "function" ? ctx.activeLearnerNeedsPasswordChange() : false;
      const coachDNA = ctx.coachDNA || window.EGTCoachDNA;
      if(coachDNA && typeof coachDNA.recordAttempt === "function" && !needsChange) {
        const userId = typeof ctx.activeLearnerId === "function" ? ctx.activeLearnerId() : "GUEST";
        coachDNA.recordAttempt(Object.assign({}, historyItem || {}, {mode: state.selectedMode || ctx.mode || "", userId:userId}));
        outcome.coachDNA = true;
      }
    } catch(e) { console.warn("Coach DNA answer hook", e); }
    return outcome;
  }

  function finishCoachSession(ctx){
    ctx = safeObject(ctx);
    const state = safeObject(ctx.state);
    try {
      const learning = ctx.learningCoach || window.EGTLearningCoach;
      if(learning && typeof learning.onSessionFinished === "function") {
        learning.onSessionFinished({
          percent: Number(ctx.percent || 0),
          total: Number(ctx.total || 0),
          score: Number(ctx.score != null ? ctx.score : state.score || 0),
          duration: ctx.duration || ctx.dur || "",
          avg: Number(ctx.avg || 0)
        });
        return {ok:true, learning:true};
      }
      return {ok:true, learning:false};
    } catch(e) {
      console.warn("Coach session hook failed", e);
      return {ok:false, error:String(e && e.message ? e.message : e)};
    }
  }

  window.EGTResultPersistenceEngine = {
    __ready:true,
    version:"G54.46.4-activity-ledger",
    buildCategoryMap:buildCategoryMap,
    buildSession:buildSession,
    buildRecord:buildRecord,
    persistResult:persistResult,
    recordAnswerAttempt:recordAnswerAttempt,
    finishCoachSession:finishCoachSession,
    dispatchHooks:dispatchHooks
  };
})();
