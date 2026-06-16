/* Eignungstest-Trainer · G52.3 Phase 17
   Duell Runtime Engine / Control-Flow-Grenze
   Ziel: Duell-Ablauf, Online-Polling, lokale Handover-Logik und Setup-Steuerung
   aus app.js herauslösen, während die UI-Renderer in highscore-duel-ui-engine.js bleiben. */
(function(){
  "use strict";

  function create(deps){
    deps = deps || {};
    const state = deps.state || {};
    const $ = typeof deps.$ === "function" ? deps.$ : function(id){ return (typeof document !== "undefined") ? document.getElementById(id) : null; };
    const escHTML = typeof deps.escHTML === "function" ? deps.escHTML : function(value){
      return String(value == null ? "" : value).replace(/[&<>\"']/g, function(ch){ return {"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[ch]; });
    };
    const ui = deps.HighscoreDuelUIEngine || {};
    const getHistory = typeof deps.getHistory === "function" ? deps.getHistory : function(){ return []; };
    const saveHistory = typeof deps.saveHistory === "function" ? deps.saveHistory : function(){};
    const myName = typeof deps.getMyName === "function" ? deps.getMyName : function(){ return ""; };
    const portal = function(){ return (typeof deps.getPortal === "function" ? deps.getPortal() : (typeof window !== "undefined" ? window.EGTAdminPortal : null)); };
    const clearRouteTimers = typeof deps.clearRouteTimers === "function" ? deps.clearRouteTimers : function(){};
    const finalizeOpenAnswers = typeof deps.finalizeOpenAnswers === "function" ? deps.finalizeOpenAnswers : function(){};
    const showOnly = typeof deps.showOnly === "function" ? deps.showOnly : function(){};
    const buildQuiz = typeof deps.buildQuiz === "function" ? deps.buildQuiz : function(){ return []; };
    const startQuiz = typeof deps.startQuiz === "function" ? deps.startQuiz : function(){};
    const restart = typeof deps.restart === "function" ? deps.restart : function(){};

    function diagnostics(){
      return {
        ok:true,
        provider:"js/core/duell-runtime-engine.js",
        version:"G52.3-phase17",
        hasState:!!state,
        hasUI:!!ui,
        onlinePortal:!!portal(),
        active:!!state.duel,
        mode:state.duel && state.duel.mode || null
      };
    }

    function clone(value){
      try { return JSON.parse(JSON.stringify(value)); } catch(e) { return value; }
    }

    function clearPoll(){
      if(state.duel && state.duel.pollTimer){
        clearInterval(state.duel.pollTimer);
        state.duel.pollTimer = null;
      }
    }

    function playerStats(){
      const answered = Array.isArray(state.history) ? state.history.filter(Boolean) : [];
      const correct = answered.filter(function(h){ return h && h.correct; }).length;
      const timeMs = answered.reduce(function(sum,h){ return sum + (Number(h && h.duration) || 0); }, 0);
      const perBlock = {};
      answered.forEach(function(h){
        const b = h && h.block ? h.block : "Sonstige";
        if(!perBlock[b]) perBlock[b] = {c:0,n:0,t:0};
        perBlock[b].n++;
        if(h.correct) perBlock[b].c++;
        perBlock[b].t += Number(h.duration) || 0;
      });
      return {
        correct: correct,
        total: Array.isArray(state.quiz) ? state.quiz.length : answered.length,
        timeMs: timeMs,
        perQuestion: answered.map(function(h){ return !!(h && h.correct); }),
        perBlock: perBlock
      };
    }

    function fmtTime(ms){
      return ui && typeof ui.fmtTime === "function" ? ui.fmtTime(ms) : (Math.round((Number(ms)||0)/1000) + " s");
    }

    function winnerOf(a,b){
      if(ui && typeof ui.winnerOf === "function") return ui.winnerOf(a,b);
      if(!a || !b || !a.result || !b.result) return null;
      if(a.result.correct !== b.result.correct) return a.result.correct > b.result.correct ? a : b;
      if(a.result.timeMs !== b.result.timeMs) return a.result.timeMs < b.result.timeMs ? a : b;
      return null;
    }

    function renderComparison(p1,p2,opts){
      return ui && typeof ui.renderDuellComparison === "function"
        ? ui.renderDuellComparison(p1,p2,opts)
        : '<div class="duel-result"><div class="cloud-error-note">Duell-Auswertung nicht verfügbar.</div></div>';
    }

    function finishComparison(p1,p2){
      const winner = winnerOf(p1,p2);
      try {
        saveHistory({
          ts: Date.now(),
          mode: state.duel && state.duel.mode || "local",
          p1: {name:p1.name, correct:p1.result.correct, timeMs:p1.result.timeMs},
          p2: {name:p2.name, correct:p2.result.correct, timeMs:p2.result.timeMs},
          total: p1.result.total,
          winner: winner ? winner.name : null
        });
      } catch(e) {}
    }

    function setResultHtml(html){
      const el = $("resultText");
      if(el) el.innerHTML = html;
    }

    function showResult(){
      clearInterval(state.timer);
      clearRouteTimers();
      finalizeOpenAnswers();
      state.testEnd = new Date();
      showOnly("result");
      const cat = $("categoryStats"); if(cat) cat.innerHTML = "";
      const tips = $("tips"); if(tips) tips.innerHTML = "";
      const review = $("review"); if(review) review.innerHTML = "";
      const d = state.duel;
      if(!d){ return; }
      const stats = playerStats();
      if(d.mode === "online") return onlineFinished(stats);
      if(d.phase === "p1"){
        d.p1.result = stats;
        setResultHtml(`<div class="duel-handover">
          <div class="duel-handover-icon">⚔️</div>
          <h2>Runde 1 beendet!</h2>
          <p><b>${escHTML(d.p1.name)}</b> hat abgeschlossen. Das Ergebnis bleibt geheim, bis <b>${escHTML(d.p2.name)}</b> dieselben Aufgaben gelöst hat.</p>
          <div class="duel-handover-card">📱 Gerät jetzt an <b>${escHTML(d.p2.name)}</b> übergeben.<br><small>Gleiche Fragen · gleiche Reihenfolge · gleiche Zeit (25 s/Aufgabe)</small></div>
          <button type="button" class="duel-primary-btn" onclick="App.duellStartP2()">Ich bin ${escHTML(d.p2.name)} – Los geht's! 🚀</button>
          <button type="button" class="duel-secondary-btn" onclick="App.duellExit()">Duell abbrechen</button>
        </div>`);
        return;
      }
      d.p2.result = stats;
      setResultHtml(renderComparison(d.p1,d.p2));
      finishComparison(d.p1,d.p2);
    }

    function onlineFinished(stats){
      const d = state.duel;
      if(!d) return;
      d.me.result = stats;
      const p = portal();
      setResultHtml(`<div class="duel-handover">
        <div class="duel-handover-icon">📡</div>
        <h2>Fertig! Ergebnis wird übertragen…</h2>
        <div class="duel-wait-card"><span class="duel-spinner"></span> Warte auf <b>${escHTML(d.opp.name||"Gegner")}</b> …<br><small>Der Vergleich erscheint automatisch, sobald beide fertig sind.</small></div>
        <button type="button" class="duel-secondary-btn" onclick="App.duellExit()">Duell verlassen</button>
      </div>`);
      if(!p || typeof p.duellSubmit !== "function"){
        setResultHtml(`<div class="duel-handover"><div class="duel-handover-icon">⚠️</div><h2>Übertragung nicht verfügbar</h2><p>Online-Duell ist auf diesem Build nicht verbunden.</p>
          <button type="button" class="duel-secondary-btn" onclick="App.duellExit()">Duell verlassen</button></div>`);
        return;
      }
      const myPayload = { name:d.me.name, correct:stats.correct, total:stats.total, timeMs:stats.timeMs, perQuestion:stats.perQuestion, perBlock:stats.perBlock };
      p.duellSubmit(d.code, d.role, myPayload).catch(function(err){
        setResultHtml(`<div class="duel-handover"><div class="duel-handover-icon">⚠️</div><h2>Übertragung fehlgeschlagen</h2><p>${escHTML(err && err.message || String(err))}</p>
          <button type="button" class="duel-primary-btn" onclick="App.duellRetrySubmit()">Erneut senden</button>
          <button type="button" class="duel-secondary-btn" onclick="App.duellExit()">Duell verlassen</button></div>`);
      }).then(function(ok){ if(ok) pollForOpponent(); });
    }

    function retrySubmit(){
      if(state.duel && state.duel.me && state.duel.me.result) onlineFinished(state.duel.me.result);
    }

    function pollForOpponent(){
      const d = state.duel;
      if(!d) return;
      const p = portal();
      if(!p || typeof p.duellFetch !== "function") return;
      clearPoll();
      const oppRole = d.role === "host" ? "guest" : "host";
      let tries = 0;
      const tick = async function(){
        tries++;
        if(!state.duel){ clearPoll(); return; }
        try {
          const doc = await p.duellFetch(d.code);
          const opp = (doc.results || {})[oppRole];
          if(opp && typeof opp.correct === "number"){
            clearPoll();
            if(doc.guest && doc.guest.name) d.opp.name = d.role === "host" ? doc.guest.name : (doc.host||{}).name || d.opp.name;
            const me = {name:d.me.name, result:d.me.result};
            const op = {name:opp.name || d.opp.name || "Gegner", result:{correct:opp.correct,total:opp.total,timeMs:opp.timeMs,perQuestion:opp.perQuestion||[],perBlock:opp.perBlock||{}}};
            const first = d.role === "host" ? me : op;
            const second = d.role === "host" ? op : me;
            setResultHtml(renderComparison(first, second, {actions:
              `<button type="button" class="duel-secondary-btn" onclick="App.openDuellSetup()">Neues Duell</button>
               <button type="button" class="duel-secondary-btn" onclick="App.duellExit()">Zum Start</button>`}));
            finishComparison(first,second);
          } else if(tries > 240){
            clearPoll();
            const el = $("resultText"); if(el) el.innerHTML += '<div class="cloud-error-note">Der Gegner hat nach 10 Minuten kein Ergebnis übertragen. Du kannst weiter warten oder das Duell verlassen.</div>';
          }
        } catch(e) { /* transienter Fehler: weiter pollen */ }
      };
      d.pollTimer = setInterval(tick, 2500);
      tick();
    }

    function openSetup(){
      let ov = $("duellSetupOverlay");
      if(!ov && typeof document !== "undefined"){
        ov = document.createElement("div");
        ov.id = "duellSetupOverlay";
        document.body.appendChild(ov);
      }
      if(!ov) return;
      ov.innerHTML = ui && typeof ui.renderDuelSetup === "function" ? ui.renderDuelSetup({ history:getHistory(), myName:myName() }) : '<div class="duel-setup-card"><div class="cloud-error-note">Duell-Setup nicht verfügbar.</div></div>';
      ov.classList.add("open");
    }

    function closeSetup(){
      const ov = $("duellSetupOverlay");
      if(ov){ ov.classList.remove("open"); ov.innerHTML = ""; }
    }

    function setupTab(which){
      const on = $("duellPaneOnline"), lo = $("duellPaneLocal"), tOn = $("duellTabOnline"), tLo = $("duellTabLocal");
      if(!on || !lo) return;
      if(which === "local"){
        on.classList.add("hidden"); lo.classList.remove("hidden");
        if(tOn) tOn.classList.remove("active"); if(tLo) tLo.classList.add("active");
      } else {
        lo.classList.add("hidden"); on.classList.remove("hidden");
        if(tLo) tLo.classList.remove("active"); if(tOn) tOn.classList.add("active");
      }
    }

    function setStatus(html){ const el = $("duellOnlineStatus"); if(el) el.innerHTML = html; }

    function buildFreshQuiz(){
      state.selectedMode = "duell";
      state.usedQuestions = new Set();
      return buildQuiz();
    }

    async function createOnline(){
      const p = portal();
      if(!p || typeof p.duellCreate !== "function"){
        setStatus('<div class="cloud-error-note">Online-Duell ist auf diesem Build nicht verfügbar.</div>');
        return;
      }
      const name = (($("duellMyName")||{}).value || "").trim() || "Spieler 1";
      setStatus('<div class="duel-wait-card"><span class="duel-spinner"></span> Duell wird erstellt …</div>');
      try {
        const quiz = buildFreshQuiz();
        const res = await p.duellCreate({hostName:name, quiz:quiz});
        state.duel = {mode:"online", role:"host", code:res.code, me:{name:name,result:null}, opp:{name:"",result:null}, quizSnapshot:clone(quiz), pollTimer:null};
        setStatus(`<div class="duel-code-card">Dein Duell-Code:<div class="duel-code">${escHTML(res.code)}</div><small>Code an deinen Gegner senden. Das Duell startet, sobald er beitritt.</small></div>
          <div class="duel-wait-card"><span class="duel-spinner"></span> Warte auf Gegner …</div>`);
        waitForGuest();
      } catch(e) {
        setStatus(`<div class="cloud-error-note">Online-Duell nicht möglich: ${escHTML(e && e.message || String(e))}<br><small>Tipp: Internetverbindung prüfen – oder lokal am selben Gerät duellieren.</small></div>`);
      }
    }

    function waitForGuest(){
      const d = state.duel;
      const p = portal();
      if(!d || !p || typeof p.duellFetch !== "function") return;
      clearPoll();
      let tries = 0;
      const tick = async function(){
        tries++;
        if(!state.duel){ clearPoll(); return; }
        try {
          const doc = await p.duellFetch(d.code);
          if(doc.guest && doc.guest.name){
            clearPoll();
            d.opp.name = doc.guest.name;
            setStatus(`<div class="duel-code-card ok">⚔️ <b>${escHTML(doc.guest.name)}</b> ist beigetreten!</div>
              <button type="button" class="duel-primary-btn" onclick="App.duellBeginOnlineRun()">Duell starten 🚀</button>`);
          } else if(tries > 240){
            clearPoll();
            setStatus('<div class="cloud-error-note">Nach 10 Minuten ist niemand beigetreten. Erstelle ein neues Duell oder versuche es erneut.</div>');
          }
        } catch(e) { /* weiter pollen */ }
      };
      d.pollTimer = setInterval(tick, 2500);
      tick();
    }

    async function joinOnline(){
      const p = portal();
      if(!p || typeof p.duellJoin !== "function"){
        setStatus('<div class="cloud-error-note">Online-Duell ist auf diesem Build nicht verfügbar.</div>');
        return;
      }
      const name = (($("duellMyName")||{}).value || "").trim() || "Spieler 2";
      const code = (($("duellJoinCode")||{}).value || "").trim().toUpperCase();
      setStatus('<div class="duel-wait-card"><span class="duel-spinner"></span> Trete Duell bei …</div>');
      try {
        const res = await p.duellJoin(code,{name:name});
        state.duel = {mode:"online", role:"guest", code:code, me:{name:name,result:null}, opp:{name:(res.host||{}).name||"Spieler 1",result:null}, quizSnapshot:res.quiz, pollTimer:null};
        setStatus(`<div class="duel-code-card ok">⚔️ Duell gegen <b>${escHTML(state.duel.opp.name)}</b> bereit!</div>
          <button type="button" class="duel-primary-btn" onclick="App.duellBeginOnlineRun()">Duell starten 🚀</button>`);
      } catch(e) {
        setStatus(`<div class="cloud-error-note">${escHTML(e && e.message || String(e))}</div>`);
      }
    }

    function beginOnlineRun(){
      if(!state.duel || !Array.isArray(state.duel.quizSnapshot) || !state.duel.quizSnapshot.length) return;
      closeSetup();
      state.selectedMode = "duell";
      state.exam = {enabled:false,hardcore:false,lockBack:false,started:false};
      startQuiz();
    }

    function cancelSetup(){ clearPoll(); state.duel = null; closeSetup(); }

    function startLocal(){
      const n1 = (($("duellP1Name")||{}).value || "Spieler 1").trim() || "Spieler 1";
      const n2 = (($("duellP2Name")||{}).value || "Spieler 2").trim() || "Spieler 2";
      closeSetup();
      state.duel = {mode:"local", phase:"p1", p1:{name:n1,result:null}, p2:{name:n2,result:null}, quizSnapshot:null, pollTimer:null};
      state.selectedMode = "duell";
      state.exam = {enabled:false,hardcore:false,lockBack:false,started:false};
      startQuiz();
    }

    function startP2(){ if(!state.duel) return; state.duel.phase = "p2"; startQuiz(); }

    function rematch(){
      if(!state.duel) return;
      if(state.duel.mode === "online"){ openSetup(); return; }
      const p1 = state.duel.p1.name;
      const p2 = state.duel.p2.name;
      state.duel = {mode:"local", phase:"p1", p1:{name:p1,result:null}, p2:{name:p2,result:null}, quizSnapshot:null, pollTimer:null};
      state.selectedMode = "duell";
      startQuiz();
    }

    function exit(){ clearPoll(); state.duel = null; restart(); }

    function historyList(){ return getHistory(); }

    return {
      __version:"G52.3-phase17",
      diagnostics:diagnostics,
      clearPoll:clearPoll,
      playerStats:playerStats,
      fmtTime:fmtTime,
      winnerOf:winnerOf,
      renderComparison:renderComparison,
      finishComparison:finishComparison,
      showResult:showResult,
      onlineFinished:onlineFinished,
      retrySubmit:retrySubmit,
      pollForOpponent:pollForOpponent,
      openSetup:openSetup,
      closeSetup:closeSetup,
      setupTab:setupTab,
      setStatus:setStatus,
      buildFreshQuiz:buildFreshQuiz,
      createOnline:createOnline,
      waitForGuest:waitForGuest,
      joinOnline:joinOnline,
      beginOnlineRun:beginOnlineRun,
      cancelSetup:cancelSetup,
      startLocal:startLocal,
      startP2:startP2,
      rematch:rematch,
      exit:exit,
      historyList:historyList
    };
  }

  window.EGTDuellRuntimeEngine = { create:create, version:"G52.3-phase17" };
})();
