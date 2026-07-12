/* Eignungstest-Trainer · Highscore Dashboard Engine
   G52.0 / Phase 14: Lokale Highscore-/Dashboard-Grenze aus app.js lösen. */
(function(){
  "use strict";
  if(window.EGTHighscoreDashboardEngine && window.EGTHighscoreDashboardEngine.__ready) return;

  var VERSION = "G52.0-phase14";

  function safeObject(value){ return value && typeof value === "object" ? value : {}; }
  function safeNumber(value, fallback){
    var n = Number(value);
    return Number.isFinite(n) ? n : (fallback || 0);
  }
  function defaultEscape(value){
    return String(value == null ? "" : value).replace(/[&<>\"']/g, function(c){
      return {"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[c];
    });
  }
  function defaultNormalize(entry){ return entry || {}; }
  function resolveGuard(deps){
    var guard = deps.guard || deps.Guard || window.Guard;
    return guard && typeof guard.normalizeResult === "function" ? guard : {normalizeResult:defaultNormalize};
  }
  function resolveProfile(deps){
    if(typeof deps.readProfile === "function") {
      try { return safeObject(deps.readProfile()); } catch(e) { return {}; }
    }
    try { return JSON.parse(localStorage.getItem("egt_profile") || "{}"); } catch(e) { return {}; }
  }
  function emit(name, detail){
    try { document.dispatchEvent(new CustomEvent("egt:highscore-dashboard:" + name, {detail: detail || {}})); } catch(e) {}
    try { if(window.AppEvents && typeof AppEvents.emit === "function") AppEvents.emit("highscore-dashboard:" + name, detail || {}); } catch(e2) {}
  }

  function create(deps){
    deps = safeObject(deps);
    var guard = resolveGuard(deps);
    var escHTML = typeof deps.escHTML === "function" ? deps.escHTML : defaultEscape;
    var maxItems = Math.max(3, Math.min(50, Number(deps.maxItems || 10)));

    function getCloud(){
      if(typeof deps.getCloudHighscoreEngine === "function") {
        try { return deps.getCloudHighscoreEngine(); } catch(e) { return null; }
      }
      return deps.cloudHighscoreEngine || window.CloudHighscoreEngine || null;
    }
    function getIndexedDb(){ return deps.indexedDBEngine || deps.IndexedDBEngine || window.IndexedDBEngine || null; }

    var api = {
      __version: VERSION,
      maxItems: maxItems,
      build:function(results){
        results = Array.isArray(results) ? results : [];
        var list = results.map(function(r){
          try { return guard.normalizeResult(r); } catch(e) { return r || {}; }
        }).filter(function(r){ return Number.isFinite(Number(r && r.percent)); })
          .sort(function(a,b){
            return safeNumber(b.percent) - safeNumber(a.percent) || safeNumber(b.score) - safeNumber(a.score) || String(b.date || "").localeCompare(String(a.date || ""));
          });
        var bestOverall = list[0] || null;
        var bestSimulation = list.filter(function(r){ return r.mode === "novuraExams"; })[0] || null;
        var byMode = {};
        list.forEach(function(r){
          var key = r.mode || r.title || "unknown";
          if(!byMode[key]) byMode[key] = r;
        });
        return {total:list.length,bestOverall:bestOverall,bestSimulation:bestSimulation,top:list.slice(0,api.maxItems),byMode:byMode,updatedAt:new Date().toISOString(),source:"local",engine:VERSION};
      },
      rankLabel:function(percent){
        var p = safeNumber(percent);
        if(p >= 85) return "Diamond";
        if(p >= 70) return "Platin";
        if(p >= 55) return "Gold";
        if(p >= 40) return "Silber";
        return "Start";
      },
      toRecord:function(result){
        var r;
        try { r = guard.normalizeResult(result || {}); } catch(e) { r = result || {}; }
        var profile = resolveProfile(deps);
        return {
          date:r.date,
          mode:r.mode,
          title:r.title,
          percent:r.percent,
          score:r.score,
          total:r.total,
          duration:r.duration,
          rank:api.rankLabel(r.percent),
          player_name:profile.name || "Gast",
          player_id:profile.player_id,
          source:"session",
          createdAt:new Date().toISOString(),
          engine:VERSION
        };
      },
      persistFromResults:async function(results){
        var indexed = getIndexedDb();
        if(!indexed || !indexed.status || !indexed.status.supported) return {ok:false,reason:"IndexedDB nicht verfügbar",engine:VERSION};
        try {
          var hs = api.build(results).top.map(function(r){ return api.toRecord(r); });
          await indexed.replaceAll("highscores", hs);
          emit("persisted", {count:hs.length, engine:VERSION});
          return {ok:true,count:hs.length,engine:VERSION};
        } catch(error) {
          var reason = String(error && error.message ? error.message : error);
          emit("persist-error", {reason:reason, engine:VERSION});
          return {ok:false,reason:reason,engine:VERSION};
        }
      },
      renderLocalCard:function(results){
        var hs = api.build(results);
        var top = hs.top.slice(0,3);
        if(!top.length) {
          return '<div class="ui-card"><span class="coach-badge">Lokaler Highscore</span><div class="coach-action">Noch kein Rekord</div><div class="small">Starte einen Test. Danach erscheint hier deine lokale Bestenliste live im Dashboard.</div></div>';
        }
        return '<div class="ui-card"><span class="coach-badge">Lokaler Highscore</span><div class="coach-action">Bestwert: ' + escHTML(hs.bestOverall.percent) + '%</div><div class="ai-list">' + top.map(function(r,i){
          return '<div>' + (i+1) + '. <b>' + escHTML(r.title || r.mode || "Training") + '</b> · ' + escHTML(r.percent) + '% · ' + escHTML(api.rankLabel(r.percent)) + '</div>';
        }).join("") + '</div><div class="small">Lokale Sicherheits-Bestenliste auf diesem Gerät.</div></div>';
      },
      renderDashboard:function(results){
        var cloud = getCloud();
        var shell = "";
        try { if(cloud && typeof cloud.renderShell === "function") shell = cloud.renderShell(); } catch(e) { shell = ""; }
        try { if(cloud && typeof cloud.refreshDashboard === "function") setTimeout(function(){ cloud.refreshDashboard(); }, 0); } catch(e2) {}
        return shell + api.renderLocalCard(results || []);
      },
      diagnostics:function(results){
        var built = api.build(Array.isArray(results) ? results : []);
        var cloud = getCloud();
        var cloudDiag = null;
        try { if(cloud && typeof cloud.diagnostics === "function") cloudDiag = cloud.diagnostics(); } catch(e) {}
        return {ok:true,version:VERSION,total:built.total,topCount:built.top.length,bestPercent:built.bestOverall ? built.bestOverall.percent : null,cloudConfigured:!!(cloudDiag && cloudDiag.configured),cloud:cloudDiag};
      }
    };
    return api;
  }

  window.EGTHighscoreDashboardEngine = Object.freeze({__ready:true,version:VERSION,create:create});
})();
