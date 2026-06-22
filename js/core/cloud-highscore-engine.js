/* Eignungstest-Trainer · Cloud Highscore Engine
   G52.1 / Phase 15: Supabase-/Cloud-Ranking-Grenze aus app.js lösen. */
(function(){
  "use strict";
  if(window.EGTCloudHighscoreEngine && window.EGTCloudHighscoreEngine.__ready) return;

  var VERSION = "G52.1-phase15";

  function safeObject(value){ return value && typeof value === "object" ? value : {}; }
  function defaultEscape(value){
    return String(value == null ? "" : value).replace(/[&<>\"']/g, function(c){
      return {"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[c];
    });
  }
  function fallbackRankLabel(percent){
    var p = Number(percent) || 0;
    if(p >= 85) return "Diamond";
    if(p >= 70) return "Platin";
    if(p >= 55) return "Gold";
    if(p >= 40) return "Silber";
    return "Start";
  }

  function create(deps){
    deps = safeObject(deps);
    const APP_VERSION = deps.APP_VERSION || (window.AppConfig && (window.AppConfig.build || window.AppConfig.fullVersion || window.AppConfig.version)) || VERSION;
    const $ = typeof deps.$ === "function" ? deps.$ : function(id){ return document.getElementById(id); };
    const getResults = typeof deps.getResults === "function" ? deps.getResults : function(){ return []; };
    const readProfile = typeof deps.readProfile === "function" ? deps.readProfile : function(){
      try { return JSON.parse(localStorage.getItem("egt_profile") || "{}"); } catch(e) { return {}; }
    };
    const Guard = deps.Guard && typeof deps.Guard.normalizeResult === "function" ? deps.Guard : {
      normalizeResult:function(result){ return result || {}; }
    };
    const escHTML = typeof deps.escHTML === "function" ? deps.escHTML : defaultEscape;
    function resolveLocalHighscoreEngine(){
      try {
        if(typeof deps.getHighscoreEngine === "function") {
          var resolved = deps.getHighscoreEngine();
          if(resolved && typeof resolved === "object") return resolved;
        }
      } catch(e) {}
      return deps.HighscoreEngine || null;
    }
    const HighscoreEngine = {
      rankLabel:function(percent){
        var engine = resolveLocalHighscoreEngine();
        if(engine && engine !== HighscoreEngine && typeof engine.rankLabel === "function") {
          try { return engine.rankLabel(percent); } catch(e) {}
        }
        return fallbackRankLabel(percent);
      },
      build:function(results){
        var engine = resolveLocalHighscoreEngine();
        if(engine && engine !== HighscoreEngine && typeof engine.build === "function") {
          try { return engine.build(results || []); } catch(e) {}
        }
        var top = (Array.isArray(results) ? results : []).slice().sort(function(a,b){
          return (Number(b && b.percent)||0) - (Number(a && a.percent)||0) || (Number(b && b.score)||0) - (Number(a && a.score)||0);
        }).slice(0,20);
        return {top:top,total:top.length,source:"cloud-fallback"};
      }
    };

    const engine = {
    periods:[
      {key:"daily", label:"Heute"},
      {key:"weekly", label:"Woche"},
      {key:"monthly", label:"Monat"},
      {key:"all", label:"Gesamt"}
    ],
    config() {
      const defaults = {
        enabled:false,
        provider:"local",
        supabaseUrl:"",
        anonKey:"",
        table:"highscores",
        limit:20,
        allowAnonymous:true,
        classCode:"default"
      };
      const cfg = (typeof window !== "undefined" && window.CLOUD_HIGHSCORE_CONFIG && typeof window.CLOUD_HIGHSCORE_CONFIG === "object") ? window.CLOUD_HIGHSCORE_CONFIG : {};
      const merged = {...defaults, ...cfg};
      merged.limit = Math.max(3, Math.min(100, Number(merged.limit || defaults.limit)));
      merged.supabaseUrl = String(merged.supabaseUrl || "").trim().replace(/\/$/, "");
      merged.anonKey = String(merged.anonKey || "").trim();
      merged.table = String(merged.table || "highscores").trim();
      merged.classCode = String(merged.classCode || "default").trim() || "default";
      return merged;
    },
    missingFields() {
      const c=this.config();
      const miss=[];
      if(!c.enabled) miss.push("enabled=false");
      if(c.provider !== "supabase") miss.push("provider");
      if(!/^https:\/\/[^\s]+\.supabase\.co$/i.test(c.supabaseUrl)) miss.push("supabaseUrl");
      if(!c.anonKey || c.anonKey.length < 30) miss.push("anonKey");
      if(!c.table) miss.push("table");
      return miss;
    },
    isConfigured() {
      return this.missingFields().length === 0;
    },
    endpoint(path="") {
      const c=this.config();
      return c.supabaseUrl + "/rest/v1/" + encodeURIComponent(c.table) + path;
    },
    isJwtKey(key) {
      return /^eyJ[A-Za-z0-9_-]+\./.test(String(key||""));
    },
    isPublishableKey(key) {
      return /^sb_publishable_/i.test(String(key||""));
    },
    headers(extra={}, mode="auto") {
      const c=this.config();
      const base = {"apikey":c.anonKey,"Content-Type":"application/json"};
      // Legacy anon JWTs brauchen Authorization. Neue sb_publishable Keys funktionieren über apikey;
      // falls ein Gateway Authorization erwartet, macht requestJson/readJson automatisch einen zweiten Versuch.
      if(mode === "auth" || (mode === "auto" && this.isJwtKey(c.anonKey))) base.Authorization = "Bearer "+c.anonKey;
      return {...base, ...extra};
    },
    async request(url, options={}, timeoutMs=4500) {
      const controller = typeof AbortController !== "undefined" ? new AbortController() : null;
      let timer = null;
      if(controller) {
        timer = setTimeout(()=>{ try{ controller.abort(); }catch(e){} }, timeoutMs);
        options = {...options, signal:controller.signal};
      }
      try {
        return await fetch(url, options);
      } finally {
        if(timer) clearTimeout(timer);
      }
    },
    async readJson(path, timeoutMs=6000) {
      const url=this.endpoint(path);
      const attempts=["auto"];
      if(this.isPublishableKey(this.config().anonKey)) attempts.push("auth");
      let lastError=null;
      for(const mode of attempts) {
        try {
          const response=await this.request(url, {method:"GET", headers:this.headers({"Cache-Control":"no-cache"}, mode)}, timeoutMs);
          const text=await response.text().catch(()=>"");
          if(response.ok) {
            try { return {ok:true,status:response.status,items:JSON.parse(text || "[]"),authMode:mode}; }
            catch(e) { return {ok:true,status:response.status,items:[],authMode:mode,parseWarning:String(e&&e.message?e.message:e)}; }
          }
          lastError=new Error("GET "+response.status+(text?" · "+text.slice(0,240):""));
          lastError.status=response.status; lastError.body=text; lastError.authMode=mode;
        } catch(error) { lastError=error; }
      }
      throw lastError || new Error("Supabase GET fehlgeschlagen");
    },
    async writeJson(body, timeoutMs=6500, prefer="return=minimal") {
      const url=this.endpoint();
      const attempts=["auto"];
      if(this.isPublishableKey(this.config().anonKey)) attempts.push("auth");
      let lastError=null;
      for(const mode of attempts) {
        try {
          const response=await this.request(url, {method:"POST", headers:this.headers({"Prefer":prefer}, mode), body:JSON.stringify(body)}, timeoutMs);
          const text=await response.text().catch(()=>"");
          if(response.ok || response.status===201) {
            let items=[];
            if(text) { try { items=JSON.parse(text); } catch(e) { items=[]; } }
            return {ok:true,status:response.status,authMode:mode,items,text};
          }
          lastError=new Error("POST "+response.status+(text?" · "+text.slice(0,300):""));
          lastError.status=response.status; lastError.body=text; lastError.authMode=mode;
        } catch(error) { lastError=error; }
      }
      throw lastError || new Error("Supabase POST fehlgeschlagen");
    },
    localFallbackBoards() {
      const rows = HighscoreEngine.build(getResults ? getResults() : []).top.map(r=>({
        player_name:r.player_name || (readProfile().name || "Gast"),
        title:r.title || r.mode || "Training",
        mode:r.mode || "local",
        percent:Number(r.percent)||0,
        score:Number(r.score)||0,
        total:Number(r.total)||0,
        duration:r.duration || "",
        rank:this.rankLabel(r.percent),
        created_at:r.date || new Date().toISOString(),
        app_version:APP_VERSION
      }));
      return {daily:rows.slice(0,5), weekly:rows.slice(0,5), monthly:rows.slice(0,5), all:rows.slice(0,8)};
    },
    deviceId() {
      const key="eignungstest_trainer_device_id_v1";
      try {
        let id=localStorage.getItem(key);
        if(!id){ id="dev_"+Math.random().toString(36).slice(2)+Date.now().toString(36); localStorage.setItem(key,id); }
        return id;
      } catch(e) { return "dev_session"; }
    },
    playerName() {
      try {
        if(window.EGTAuthProfileShell && typeof EGTAuthProfileShell.highscoreIdentity === "function") {
          const identity = EGTAuthProfileShell.highscoreIdentity();
          const nick = String(identity && (identity.playerName || identity.nickname) || "").trim().slice(0,32);
          if(nick) return nick;
        }
      } catch(e) {}
      const p = typeof readProfile === "function" ? readProfile() : {};
      const raw = String(p.name || "").trim().slice(0,32);
      if(raw) return raw;
      return this.config().allowAnonymous ? "Gast" : "Unbenannt";
    },
    profileIdentity() {
      try {
        if(window.EGTAuthProfileShell && typeof EGTAuthProfileShell.highscoreIdentity === "function") return EGTAuthProfileShell.highscoreIdentity() || {};
      } catch(e) {}
      return {};
    },
    rankLabel(percent) {
      return HighscoreEngine.rankLabel(percent);
    },
    periodStart(period) {
      const now=new Date();
      if(period==="daily") return new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
      if(period==="weekly") {
        const d=new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const day=(d.getDay()+6)%7;
        d.setDate(d.getDate()-day);
        return d.toISOString();
      }
      if(period==="monthly") return new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      return "";
    },
    cleanRecord(result) {
      const r=Guard.normalizeResult(result||{});
      const c=this.config();
      const identity = this.profileIdentity();
      return {
        player_name:this.playerName(),
        class_code:String(identity.groupId || c.classCode || "default").slice(0,40),
        device_id:String(identity.deviceId || this.deviceId()).slice(0,160),
        mode:String(r.mode || "unknown").slice(0,60),
        title:String(r.title || "Unbekannter Test").slice(0,120),
        percent:Math.max(0,Math.min(100,Number(r.percent)||0)),
        score:Number(r.score)||0,
        total:Number(r.total)||0,
        duration:String(r.duration || "").slice(0,60),
        rank:this.rankLabel(r.percent),
        app_version:APP_VERSION
      };
    },
    async submit(result) {
      if(!this.isConfigured()) return {ok:false,reason:"Cloud Highscore nicht verbunden",missing:this.missingFields()};
      const payload=this.cleanRecord(result);
      if(!payload.total || !Number.isFinite(payload.percent)) return {ok:false,reason:"Ungültiger Highscore-Datensatz"};
      const minimalPayload = {
        player_name: payload.player_name,
        class_code: payload.class_code,
        mode: payload.mode,
        title: payload.title,
        percent: payload.percent,
        score: payload.score,
        total: payload.total
      };
      try {
        const res=await this.writeJson(payload, 6500);
        return {ok:true,record:payload,variant:"full",authMode:res.authMode,status:res.status};
      } catch(firstError) {
        // Rettungsweg: falls das echte Tabellenschema nur Kernspalten akzeptiert.
        const res=await this.writeJson(minimalPayload, 6500);
        return {ok:true,record:minimalPayload,variant:"minimal",authMode:res.authMode,status:res.status,warning:String(firstError && firstError.message ? firstError.message : firstError)};
      }
    },
    async fetchTop(period="all") {
      if(!this.isConfigured()) return {ok:false,reason:"Cloud Highscore nicht verbunden",missing:this.missingFields(),items:[]};
      const c=this.config();
      const start=this.periodStart(period);
      const buildQuery=(withClass=true, wide=false)=>{
        const filters=[
          wide ? "select=*" : "select=player_name,mode,title,percent,score,total,created_at,rank,class_code",
          withClass ? "class_code=eq."+encodeURIComponent(c.classCode) : "",
          "order=percent.desc,score.desc,created_at.asc",
          "limit="+encodeURIComponent(c.limit)
        ].filter(Boolean);
        if(start) filters.push("created_at=gte."+encodeURIComponent(start));
        return "?"+filters.join("&");
      };
      async function read(engine, query){
        const res=await engine.readJson(query, 6500);
        return Array.isArray(res.items) ? res.items : [];
      }
      let items=[];
      try { items=await read(this, buildQuery(true,false)); } catch(first){ items=await read(this, buildQuery(false,true)); }
      if(Array.isArray(items) && !items.length) {
        try { items=await read(this, buildQuery(false,false)); } catch(e){}
      }
      const normalized=(Array.isArray(items)?items:[]).map(r=>({
        player_name:r.player_name || r.name || r.player || "Gast",
        mode:r.mode || r.test_mode || "unknown",
        title:r.title || r.test_title || r.mode || "Test",
        percent:Number(r.percent ?? r.percentage ?? r.score_percent ?? 0) || 0,
        score:Number(r.score ?? r.points ?? 0) || 0,
        total:Number(r.total ?? r.max_score ?? 0) || 0,
        rank:r.rank || this.rankLabel(Number(r.percent ?? r.percentage ?? r.score_percent ?? 0) || 0),
        created_at:r.created_at || r.date || r.inserted_at || ""
      })).sort((a,b)=>(b.percent-a.percent)||(b.score-a.score));
      return {ok:true,period,items:normalized};
    },
    async fetchBoards() {
      if(!this.isConfigured()) return {ok:false,boards:{},reason:"Cloud Highscore nicht verbunden",missing:this.missingFields()};
      const boards={};
      const jobs = this.periods.map(p => this.fetchTop(p.key).then(res=>({key:p.key, items:res.items||[]})).catch(error=>({key:p.key, error:String(error && error.message ? error.message : error)})));
      const settled = await Promise.all(jobs);
      settled.forEach(entry=>{ boards[entry.key] = entry.error ? {error:entry.error} : entry.items; });
      return {ok:true,boards};
    },
    async backfillLocalTopOnce(max=3) {
      if(!this.isConfigured()) return {ok:false,reason:"not-configured",count:0};
      let rows=[];
      try { rows = HighscoreEngine.build(getResults ? getResults() : []).top.slice(0,max); } catch(e) { rows=[]; }
      if(!rows.length) return {ok:true,count:0,reason:"no-local-results"};
      let count=0;
      for(const r of rows) {
        const payload=this.cleanRecord(r);
        const sig=[payload.player_name,payload.mode,payload.title,payload.percent,payload.score,payload.total].join("|");
        const key="cloud_sync_v2_"+btoa(unescape(encodeURIComponent(sig))).replace(/=+$/,"").slice(0,80);
        try {
          if(localStorage.getItem(key)) continue;
          await this.submit(r);
          localStorage.setItem(key, new Date().toISOString());
          count++;
        } catch(e) { /* stiller Fallback: Ranking darf nie hängen */ }
      }
      return {ok:true,count};
    },
    renderRows(rows, limit=5) {
      if(rows && rows.error) return `<div class="small cloud-error-note">${escHTML(rows.error)}</div>`;
      const list=Array.isArray(rows) ? rows.slice(0,limit) : [];
      if(!list.length) return `<div class="small">Keine Einträge vorhanden.</div>`;
      return `<div class="cloud-rank-list">${list.map((r,i)=>`<div class="cloud-rank-row"><span class="cloud-rank-pos">#${i+1}</span><span class="cloud-rank-main"><b>${escHTML(r.player_name||"Gast")}</b><small>${escHTML(r.title||r.mode||"Test")}</small></span><span class="cloud-rank-score">${Number(r.percent)||0}%<small>${escHTML(r.rank||this.rankLabel(r.percent))}</small></span></div>`).join("")}</div>`;
    },
    boardCount(boards) {
      return Object.values(boards || {}).reduce((sum, rows)=> sum + (Array.isArray(rows) ? rows.length : 0), 0);
    },
    renderBoardStats(boards, source="Cloud") {
      const total=this.boardCount(boards);
      const per=this.periods.map(p=>`${p.label}: ${Array.isArray(boards && boards[p.key]) ? boards[p.key].length : 0}`).join(" · ");
      return `<div class="small cloud-debug-line">${escHTML(source)} · Datensätze gefunden: <b>${total}</b>${per ? " · "+escHTML(per) : ""}</div>`;
    },
    async insertDebugEntry() {
      if(!this.isConfigured()) return {ok:false,reason:"Cloud nicht verbunden"};
      const stamp = new Date().toISOString();
      const demo={
        player_name:this.playerName(),
        class_code:this.config().classCode.slice(0,40),
        device_id:this.deviceId(),
        mode:"cloud-debug",
        title:"Cloud Testeintrag "+stamp.slice(11,19),
        percent:88,
        score:22,
        total:25,
        duration:"Test",
        rank:this.rankLabel(88),
        app_version:APP_VERSION
      };
      const minimal={
        player_name:demo.player_name, class_code:demo.class_code, mode:demo.mode, title:demo.title,
        percent:demo.percent, score:demo.score, total:demo.total
      };
      let insert=null;
      try { insert = await this.writeJson(demo, 8000, "return=representation"); }
      catch(firstError) {
        insert = await this.writeJson(minimal, 8000, "return=representation");
        insert.warning = String(firstError && firstError.message ? firstError.message : firstError);
        insert.variant = "minimal";
      }
      const verify = await this.fetchTop("all").catch(error=>({ok:false,items:[],error:String(error && error.message ? error.message : error)}));
      const found = Array.isArray(verify.items) && verify.items.some(r => String(r.title||"") === demo.title || (String(r.mode||"") === "cloud-debug" && Number(r.percent) === 88));
      return {ok:true, record:demo, status:insert.status, authMode:insert.authMode, variant:insert.variant || "full", warning:insert.warning || "", verifyCount:Array.isArray(verify.items)?verify.items.length:0, verified:found};
    },
    cloudButtons(note="") {
      const safeNote = note ? `<span class="small">${escHTML(note)}</span>` : `<span class="small">Status wird automatisch aktualisiert.</span>`;
      // Doppelte Absicherung: data-action für Eventdelegation UND onclick als harter Fallback.
      return `<div class="cloud-refresh-row cloud-runtime-actions">${safeNote}<button class="btn btn-secondary cloud-refresh-btn" type="button" data-action="cloud-refresh" onclick="try{App.refreshCloudRanking()}catch(e){console.error(e)}">Ranking neu laden</button><button class="btn btn-secondary cloud-test-btn" type="button" data-action="cloud-test" onclick="try{App.addCloudTestScore()}catch(e){console.error(e)}">Cloud-Testeintrag</button></div>`;
    },
    renderShell() {
      const configured=this.isConfigured();
      const miss=this.missingFields();
      return `<div class="ui-card cloud-highscore-card" id="cloudHighscoreCard"><span class="coach-badge">Cloud Highscore</span><div class="coach-action">${configured?"Online-Ranking wird geladen":"Cloud nicht verbunden"}</div><div class="small">${configured?"Tägliche, wöchentliche und monatliche Ranglisten werden mit Supabase synchronisiert. Falls Supabase nicht antwortet, erscheint automatisch die lokale Rangliste.":"Keine Fake-Daten. Fehlende Konfiguration: "+escHTML(miss.join(", "))+"."}</div>${this.cloudButtons()}</div>`;
    },
    async refreshDashboard() {
      const el=$("cloudHighscoreCard");
      if(!el) return;
      const runId = Date.now().toString(36)+Math.random().toString(36).slice(2);
      el.dataset.cloudRun = runId;
      const stillCurrent = () => el.dataset.cloudRun === runId;
      if(!this.isConfigured()) {
        const miss=this.missingFields();
        if(stillCurrent()) el.innerHTML=`<span class="coach-badge">Cloud Highscore · aktivierbar</span><div class="coach-action">Cloud nicht verbunden</div><div class="small">Keine Fake-Rangliste. Trage echte Supabase URL und anon key in <code>data/cloud-config.js</code> ein. Fehlend: ${escHTML(miss.join(", "))}.</div>${this.cloudButtons("Config prüfen")}`;
        return;
      }
      el.innerHTML=`<span class="coach-badge">Cloud Highscore · Online</span><div class="coach-action">Ranking wird geladen...</div><div class="small">Supabase wird live abgefragt. Spätestens nach wenigen Sekunden erscheint Cloud-Ergebnis oder lokaler Fallback.</div>${this.cloudButtons("Ladevorgang läuft")}`;
      const watchdog = setTimeout(()=>{ try{ if(stillCurrent() && el && /Ranking wird geladen/.test(el.textContent||"")){ const boards=this.localFallbackBoards(); el.innerHTML=`<span class="coach-badge">Cloud Highscore · Timeout-Schutz</span><div class="coach-action">Lokales Ranking aktiv</div><div class="small">Supabase braucht zu lange. Die App bleibt bedienbar und nutzt lokale Ergebnisse.</div><div class="cloud-board-grid">${this.periods.map(p=>`<section class="cloud-board"><h4>${escHTML(p.label)}</h4>${this.renderRows(boards[p.key], p.key==="all"?8:5)}</section>`).join("")}</div>`; } }catch(e){} }, 7000);
      try {
        const res=await this.fetchBoards();
        clearTimeout(watchdog);
        let boards=res.boards||{};
        let total=Object.values(boards).reduce((s,rows)=>s+(Array.isArray(rows)?rows.length:0),0);
        let backfill=null;
        if(!total) {
          backfill=await this.backfillLocalTopOnce(3);
          if(backfill && backfill.count) {
            const retry=await this.fetchBoards().catch(()=>null);
            if(retry && retry.boards) {
              boards=retry.boards;
              total=Object.values(boards).reduce((s,rows)=>s+(Array.isArray(rows)?rows.length:0),0);
            }
          }
        }
        const note = total ? "Live aus Supabase geladen" : (backfill && backfill.count ? "Cloud Sync durchgeführt, Tabelle aktualisiert sich" : "Cloud erreichbar, aber noch keine Einträge vorhanden. Speichere einen Test oder nutze den Cloud-Testeintrag zur Prüfung.");
        if(stillCurrent()) el.innerHTML=`<span class="coach-badge">Cloud Highscore · Online</span><div class="coach-action">Ranking aktiv</div>${this.renderBoardStats(boards,"Supabase")}<div class="cloud-board-grid">${this.periods.map(p=>`<section class="cloud-board"><h4>${escHTML(p.label)}</h4>${this.renderRows(boards[p.key], p.key==="all"?8:5)}</section>`).join("")}</div>${this.cloudButtons(`${note} · Klasse: ${this.config().classCode} · Tabelle: ${this.config().table}`)}`;
      } catch(error) {
        clearTimeout(watchdog);
        const boards=this.localFallbackBoards();
        const total=Object.values(boards).reduce((sum,rows)=>sum+(Array.isArray(rows)?rows.length:0),0);
        if(stillCurrent()) el.innerHTML=`<span class="coach-badge">Cloud Highscore · Fallback</span><div class="coach-action">Lokales Ranking aktiv</div><div class="small cloud-error-note">Supabase hat nicht sauber geantwortet: ${escHTML(error && error.message ? error.message : error)}</div><div class="cloud-board-grid">${this.periods.map(p=>`<section class="cloud-board"><h4>${escHTML(p.label)}</h4>${this.renderRows(boards[p.key], p.key==="all"?8:5)}</section>`).join("")}</div>${this.cloudButtons(total?"Lokale Highscores angezeigt. Cloud-Sync versucht es beim nächsten Ergebnis erneut.":"Noch keine lokalen Highscores vorhanden.")}`;
      }
    },
    diagnostics() {
      const c=this.config();
      const missing=this.missingFields();
      return {
        enabled:!!c.enabled,
        configured:missing.length===0,
        missing,
        provider:c.provider,
        table:c.table,
        classCode:c.classCode || "default",
        urlSet:!!c.supabaseUrl,
        keySet:!!c.anonKey,
        urlHost:c.supabaseUrl ? c.supabaseUrl.replace(/^https?:\/\//,"") : "",
        configLoaded:!!(typeof window !== "undefined" && window.CLOUD_HIGHSCORE_CONFIG),
        source:"data/cloud-config.js",
        periods:this.periods.map(p=>p.key)
      };
    },
    async testConnection() {
      const d=this.diagnostics();
      if(!d.configured) return {...d, online:false, readOk:false, writeReady:false, status:"config-missing", error:"Fehlende Konfiguration: "+d.missing.join(", ")};
      try {
        const c=this.config();
        const qs=`?select=player_name,percent,created_at,class_code&class_code=eq.${encodeURIComponent(c.classCode)}&order=created_at.desc&limit=1`;
        let res=null;
        try { res=await this.readJson(qs, 5500); }
        catch(first) { res=await this.readJson(`?select=player_name,percent,created_at,class_code&order=created_at.desc&limit=1`, 5500); }
        const items=Array.isArray(res.items)?res.items:[];
        return {...d, online:true, readOk:true, writeReady:true, status:"online", httpStatus:res.status, authMode:res.authMode, sampleCount:items.length, error:""};
      } catch(error) {
        return {...d, online:false, readOk:false, writeReady:false, status:"network-error", error:String(error && error.message ? error.message : error)};
      }
    }
  };

    engine.__version = VERSION;
    engine.__source = "js/core/cloud-highscore-engine.js";
    engine.__phase = "15";
    return engine;
  }

  window.EGTCloudHighscoreEngine = Object.freeze({__ready:true,version:VERSION,create:create});
})();
