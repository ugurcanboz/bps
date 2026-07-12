/* Eignungstest-Trainer · Highscore Engine Modul · G32.0 Stability Cut
   Aus js/app.js ausgelagert, damit Highscore-/Cloud-Logik eine klare Zuständigkeit hat. */
(function(){
  "use strict";

  window.createCloudHighscoreEngine = function createCloudHighscoreEngine(deps){
    deps = deps || {};
    const escHTML = typeof deps.escHTML === "function" ? deps.escHTML : function(value){
      return String(value).replace(/[&<>"]/g, function(ch){ return ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"})[ch]; });
    };
    const APP_VERSION = deps.APP_VERSION || (window.AppConfig && (window.AppConfig.build || window.AppConfig.version)) || "G32.1-HIGHSCORE-MODULE-HOTFIX-2026-06-08";

    // G32.1 Hotfix: Das Modul läuft außerhalb der app.js-Closure.
    // Deshalb müssen alle früher lokalen Abhängigkeiten explizit injiziert oder sicher ersetzt werden.
    const $ = typeof deps.$ === "function" ? deps.$ : function(id){ return document.getElementById(id); };
    const getResults = typeof deps.getResults === "function" ? deps.getResults : function(){ return []; };
    const readProfile = typeof deps.readProfile === "function" ? deps.readProfile : function(){
      try { return JSON.parse(localStorage.getItem("egt_profile") || "{}"); } catch(e) { return {}; }
    };
    const Guard = deps.Guard && typeof deps.Guard.normalizeResult === "function" ? deps.Guard : {
      normalizeResult:function(result){ return result || {}; }
    };
    const HighscoreEngine = deps.HighscoreEngine && typeof deps.HighscoreEngine.build === "function" ? deps.HighscoreEngine : {
      rankLabel:function(percent){
        const p = Number(percent) || 0;
        if(p >= 90) return "Elite";
        if(p >= 75) return "Stark";
        if(p >= 60) return "Solide";
        return "Aufbau";
      },
      build:function(results){
        const top = (Array.isArray(results) ? results : []).slice().sort(function(a,b){
          return (Number(b.percent)||0) - (Number(a.percent)||0) || (Number(b.score)||0) - (Number(a.score)||0);
        }).slice(0,20);
        return {top:top};
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
            enabled:true,
            provider:"supabase",
            supabaseUrl:"",
            anonKey:"",
            table:"highscores",
            limit:20,
            allowAnonymous:true,
            classCode:"default",
            refreshIntervalMs:20000
          };
          const cfg = (typeof window !== "undefined" && window.CLOUD_HIGHSCORE_CONFIG && typeof window.CLOUD_HIGHSCORE_CONFIG === "object") ? window.CLOUD_HIGHSCORE_CONFIG : {};
          const merged = {...defaults, ...cfg};
          merged.limit = Math.max(3, Math.min(250, Number(merged.limit || defaults.limit)));
          merged.supabaseUrl = String(merged.supabaseUrl || "").trim().replace(/\/$/, "");
          merged.anonKey = String(merged.anonKey || "").trim();
          merged.table = String(merged.table || "highscores").trim();
          merged.classCode = String(merged.classCode || "default").trim() || "default";
          merged.refreshIntervalMs = Math.max(10000, Math.min(120000, Number(merged.refreshIntervalMs || defaults.refreshIntervalMs)));
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
          const p = typeof readProfile === "function" ? readProfile() : {};
          const raw = String(p.name || "").trim().slice(0,32);
          if(raw) return raw;
          return this.config().allowAnonymous ? "Gast" : "Unbenannt";
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
          return {
            player_name:this.playerName(),
            class_code:c.classCode.slice(0,40),
            device_id:this.deviceId(),
            mode:String(r.mode || "unknown").slice(0,60),
            title:String(r.title || "Unbekannter Test").slice(0,120),
            percent:Math.max(0,Math.min(100,Number(r.percent)||0)),
            score:Number(r.score)||0,
            total:Number(r.total)||0,
            duration:String(r.duration || "").slice(0,60),
            rank:this.rankLabel(r.percent),
            app_version:APP_VERSION,
            created_at:new Date().toISOString()
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
            total: payload.total,
            created_at: payload.created_at
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
              wide ? "select=*" : "select=player_name,mode,title,percent,score,total,duration,created_at,rank,class_code,device_id",
              withClass ? "class_code=eq."+encodeURIComponent(c.classCode) : "",
              "order=created_at.desc",
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
            duration:r.duration || r.time || "",
            rank:r.rank || this.rankLabel(Number(r.percent ?? r.percentage ?? r.score_percent ?? 0) || 0),
            class_code:r.class_code || r.classCode || "",
            device_id:r.device_id || r.player_id || r.deviceId || "",
            created_at:r.created_at || r.date || r.inserted_at || ""
          })).sort((a,b)=>this.rowTimestamp(b)-this.rowTimestamp(a));
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
        boardCount(boards) {
          return Object.values(boards || {}).reduce((sum, rows)=> sum + (Array.isArray(rows) ? rows.length : 0), 0);
        },
        healthBadge(label, ok, detail="") {
          const cls = ok ? "is-ok" : "is-bad";
          const icon = this.icon(ok ? "cloud-check" : "cloud-x");
          return `<div class="cloud-health-badge ${cls}"><span class="cloud-health-icon">${icon}</span><span><b>${escHTML(label)}</b><small>${escHTML(detail || (ok ? "OK" : "Fehler"))}</small></span></div>`;
        },
        renderCloudHealth(health={}) {
          const checked = health.checkedAt || new Date().toLocaleTimeString("de-DE", {hour:"2-digit", minute:"2-digit", second:"2-digit"});
          const serverDetail = health.serverOk ? "Verbindung aktiv" : (health.serverDetail || "keine Verbindung");
          const readDetail = health.readOk ? "Tabelle lesbar" : (health.readDetail || "nicht lesbar");
          const ok=!!(health.serverOk && health.readOk);
          const stateClass=ok ? "is-ok" : (health.status==="prüft" || health.status==="wartet" ? "is-waiting" : "is-bad");
          const shortError = health.error ? String(health.error).slice(0,140) : "";
          return `<button type="button" class="cloud-health-panel ${stateClass}" data-action="cloud-health-check" aria-label="Cloud Status prüfen"><div class="cloud-health-title"><b>Cloud-Check</b><small>letzter Check: ${escHTML(checked)}</small></div><div class="cloud-health-grid">${this.healthBadge("Server", !!health.serverOk, serverDetail)}${this.healthBadge("Lesbar", !!health.readOk, readDetail)}</div>${shortError ? `<div class="small cloud-error-note">${escHTML(shortError)}</div>` : ""}</button>`;
        },
        healthOk(extra={}) {
          return {serverOk:true, readOk:true, status:"online", serverDetail:"Verbindung aktiv", readDetail:"Tabelle lesbar", checkedAt:new Date().toLocaleTimeString("de-DE", {hour:"2-digit", minute:"2-digit", second:"2-digit"}), ...extra};
        },
        healthFromError(error, extra={}) {
          return {serverOk:false, readOk:false, status:"error", serverDetail:"keine Verbindung", readDetail:"nicht lesbar", checkedAt:new Date().toLocaleTimeString("de-DE", {hour:"2-digit", minute:"2-digit", second:"2-digit"}), error:String(error && error.message ? error.message : error || "Unbekannter Cloud-Fehler"), ...extra};
        },
        async cloudHealthCheck() {
          const d=this.diagnostics();
          if(!d.configured) return {...d, serverOk:false, readOk:false, online:false, status:"config-missing", serverDetail:"Config fehlt", readDetail:"nicht prüfbar", checkedAt:new Date().toLocaleTimeString("de-DE", {hour:"2-digit", minute:"2-digit", second:"2-digit"}), error:"Fehlende Konfiguration: "+d.missing.join(", ")};
          const query="?select=id,created_at&order=created_at.desc&limit=1";
          const attempts=["auto"];
          if(this.isPublishableKey(this.config().anonKey)) attempts.push("auth");
          let last=null;
          for(const mode of attempts) {
            try {
              const response=await this.request(this.endpoint(query), {method:"GET", headers:this.headers({"Cache-Control":"no-cache"}, mode)}, 5500);
              const text=await response.text().catch(()=>"");
              if(response.ok) {
                return {...d, serverOk:true, readOk:true, online:true, status:"online", httpStatus:response.status, authMode:mode, serverDetail:"Verbindung aktiv", readDetail:"Tabelle lesbar", checkedAt:new Date().toLocaleTimeString("de-DE", {hour:"2-digit", minute:"2-digit", second:"2-digit"})};
              }
              last={response,text,mode};
            } catch(error) {
              last={error,mode};
            }
          }
          if(last && last.response) {
            return {...d, serverOk:true, readOk:false, online:true, status:"read-error", httpStatus:last.response.status, authMode:last.mode, serverDetail:"Server antwortet", readDetail:"Tabelle/RLS nicht lesbar", checkedAt:new Date().toLocaleTimeString("de-DE", {hour:"2-digit", minute:"2-digit", second:"2-digit"}), error:(last.text || "HTTP "+last.response.status).slice(0,260)};
          }
          return this.healthFromError(last && last.error ? last.error : new Error("Keine Antwort vom Server"), {...d, status:"network-error"});
        },
        cloudButtons(note="") {
          const safeNote = note ? `<span class="small">${escHTML(note)}</span>` : `<span class="small">Status wird automatisch aktualisiert.</span>`;
          return `<div class="cloud-refresh-row cloud-runtime-actions">${safeNote}<button class="btn btn-secondary cloud-refresh-btn" type="button" data-action="cloud-refresh">Ranking neu laden</button><button class="btn btn-secondary cloud-health-btn" type="button" data-action="cloud-health-check">Cloud prüfen</button></div>`;
        },
        icon(name) {
          name = String(name || "trophy").toLowerCase();
          const paths={
            trophy:'<path d="M8 4h8v3a4 4 0 0 1-8 0V4Z"/><path d="M8 6H5.5a2 2 0 0 0 2 3.5H8"/><path d="M16 6h2.5a2 2 0 0 1-2 3.5H16"/><path d="M12 11v4"/><path d="M9 20h6"/><path d="M10 15h4v5h-4z"/>',
            crown:'<path d="m4 8 4 4 4-7 4 7 4-4-1.5 10h-13L4 8Z"/><path d="M6.5 18h11"/>',
            medal:'<path d="M8 4h8l-2 5h-4L8 4Z"/><circle cx="12" cy="14" r="5"/><path d="m10.7 14 1 1 2-2"/>',
            refresh:'<path d="M20 12a8 8 0 0 1-14.2 5"/><path d="M4 17v4h4"/><path d="M4 12A8 8 0 0 1 18.2 7"/><path d="M20 7V3h-4"/>',
            user:'<circle cx="12" cy="8" r="3.4"/><path d="M5 20a7 7 0 0 1 14 0"/>',
            target:'<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/>',
            cloud:'<path d="M7 18h10.5a4.5 4.5 0 0 0 .5-9 6 6 0 0 0-11.4-1.8A5.2 5.2 0 0 0 7 18Z"/>',
            'cloud-check':'<path d="M7 18h10.5a4.5 4.5 0 0 0 .5-9 6 6 0 0 0-11.4-1.8A5.2 5.2 0 0 0 7 18Z"/><path d="m10 13 2 2 4-4"/>',
            'cloud-x':'<path d="M7 18h10.5a4.5 4.5 0 0 0 .5-9 6 6 0 0 0-11.4-1.8A5.2 5.2 0 0 0 7 18Z"/><path d="m10 12 5 5"/><path d="m15 12-5 5"/>',
            pencil:'<path d="M4 20h4l10.5-10.5a2.1 2.1 0 0 0-3-3L5 17v3Z"/><path d="m13.5 6.5 4 4"/>',
            users:'<path d="M16 11a3 3 0 1 0-2.5-4.7"/><path d="M8 11a3 3 0 1 1 2.5-4.7"/><path d="M3.5 20a5.8 5.8 0 0 1 9 0"/><path d="M12 20a5.8 5.8 0 0 1 8.5 0"/>',
            crosshair:'<circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="2"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/>',
            swords:'<path d="M14 4 20 10"/><path d="M18 4 4 18"/><path d="m5 19-2 2"/><path d="M10 4 4 10"/><path d="M6 4l14 14"/><path d="m19 19 2 2"/>',
            gift:'<path d="M20 12v8H4v-8"/><path d="M2 8h20v4H2z"/><path d="M12 8v12"/><path d="M12 8H8.5A2.5 2.5 0 1 1 12 5.5V8Z"/><path d="M12 8h3.5A2.5 2.5 0 1 0 12 5.5V8Z"/>',
            diamond:'<path d="M6 3h12l4 6-10 12L2 9l4-6Z"/><path d="M2 9h20"/><path d="m8 3 4 18 4-18"/>',
            flame:'<path d="M12 22c4 0 7-2.7 7-6.6 0-2.8-1.7-5.1-4-7.4-.7 2.1-2.1 3.2-3.8 4.2.2-2.8-.7-5.3-3.2-8.2C7.3 8.6 5 11.2 5 15.4 5 19.3 8 22 12 22Z"/>',
            chart:'<path d="M4 19V5"/><path d="M4 19h16"/><path d="m7 15 3-4 3 2 4-7"/>',
            calendar:'<rect x="4" y="5" width="16" height="16" rx="3"/><path d="M8 3v4M16 3v4M4 10h16"/>',
            chevron:'<path d="m9 18 6-6-6-6"/>',
            lock:'<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
            check:'<path d="m5 13 4 4L19 7"/>',
            x:'<path d="M6 6l12 12"/><path d="M18 6 6 18"/>'
          };
          return `<svg class="hs-svg hs-svg-${escHTML(name)}" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${paths[name]||paths.trophy}</g></svg>`;
        },
        activePeriod(el) {
          const raw = el && (el.dataset.hsPeriod || el.dataset.cloudPeriod);
          return this.periods.some(p=>p.key===raw) ? raw : "all";
        },
        periodLabel(key) {
          const p=this.periods.find(x=>x.key===key);
          return p ? p.label : "Gesamt";
        },
        formatNumber(value) {
          try { return new Intl.NumberFormat("de-DE").format(Number(value)||0); } catch(e) { return String(Number(value)||0); }
        },
        normalizeName(value) {
          return String(value || "").trim().replace(/\s+/g," ").toLowerCase();
        },
        participantKey(row) {
          if(!row) return "unknown";
          const device=String(row.device_id || row.player_id || row.deviceId || "").trim();
          if(device) return "device:"+device;
          const name=this.normalizeName(row.player_name || row.name || row.player || "Gast");
          return "name:"+(name || "gast");
        },
        arenaPoints(row) {
          if(!row) return 0;
          if(Number.isFinite(Number(row.arena_points))) return Math.max(0, Math.round(Number(row.arena_points)||0));
          const percent=Math.max(0, Math.min(100, Number(row.percent)||0));
          // Ein einheitliches Punktesystem: Ranking, Badges, Challenges und Abstand arbeiten alle mit Arena-Punkten.
          // Basis: 1% = 10 Arena-Punkte. Der gespeicherte score bleibt sichtbar im Rohdatensatz, steuert aber nicht mehr uneinheitlich das Ranking.
          return Math.round(percent * 10);
        },
        scoreValue(row) {
          return this.arenaPoints(row);
        },
        scoreUnit(row) {
          return "Arena-Punkte";
        },
        scoreText(row) {
          if(!row) return "—";
          return this.formatNumber(this.scoreValue(row));
        },
        rowTimestamp(row) {
          const raw=row && (row.created_at || row.date || row.inserted_at);
          const d=new Date(raw || "");
          return isFinite(d.getTime()) ? d.getTime() : 0;
        },
        isSelfRow(row) {
          if(!row) return false;
          const ownDevice=this.deviceId();
          const rowDevice=String(row.device_id || row.player_id || row.deviceId || "").trim();
          if(rowDevice && ownDevice && rowDevice === String(ownDevice)) return true;
          const ownName=this.normalizeName(this.playerName());
          const rowName=this.normalizeName(row.player_name || row.name || row.player || "");
          return !!(ownName && ownName !== "gast" && rowName && rowName === ownName);
        },
        rawRows(rows) {
          if(!Array.isArray(rows)) return [];
          const out=[];
          rows.forEach(row=>{
            if(row && Array.isArray(row.rawRows)) out.push(...row.rawRows);
            else if(row) out.push(row);
          });
          return out;
        },
        aggregatePlayers(rows=[]) {
          const groups=new Map();
          this.rawRows(rows).forEach(row=>{
            if(!row) return;
            const key=this.participantKey(row);
            const points=this.arenaPoints(row);
            const percent=Math.max(0, Math.min(100, Number(row.percent)||0));
            const ts=this.rowTimestamp(row);
            let g=groups.get(key);
            if(!g) {
              g={
                participant_key:key,
                player_name:row.player_name || row.name || row.player || "Gast",
                device_id:row.device_id || row.player_id || row.deviceId || "",
                class_code:row.class_code || this.config().classCode || "default",
                title:row.title || row.mode || "Training",
                mode:row.mode || "training",
                rank:row.rank || this.rankLabel(percent),
                percent:percent,
                best_percent:percent,
                best_score:Number(row.score)||0,
                total:Number(row.total)||0,
                score:0,
                arena_points:0,
                test_count:0,
                duration_minutes:0,
                last_activity_ts:0,
                created_at:row.created_at || row.date || row.inserted_at || "",
                rawRows:[],
                is_player_summary:true
              };
              groups.set(key,g);
            }
            g.rawRows.push(row);
            g.test_count += 1;
            g.arena_points += points;
            g.score = g.arena_points;
            g.duration_minutes += this.parseDurationMinutes(row && row.duration);
            if(percent > g.best_percent || (percent === g.best_percent && points > this.arenaPoints({percent:g.best_percent}))) {
              g.best_percent=percent;
              g.percent=percent;
              g.best_score=Number(row.score)||0;
              g.total=Number(row.total)||g.total||0;
              g.rank=row.rank || this.rankLabel(percent);
              g.title=row.title || row.mode || "Training";
              g.mode=row.mode || "training";
            }
            if(ts >= g.last_activity_ts) {
              g.last_activity_ts=ts;
              g.created_at=row.created_at || row.date || row.inserted_at || g.created_at;
              if(row.player_name) g.player_name=row.player_name;
            }
          });
          return Array.from(groups.values()).sort((a,b)=>
            (b.arena_points-a.arena_points) ||
            (b.best_percent-a.best_percent) ||
            (b.test_count-a.test_count) ||
            (b.last_activity_ts-a.last_activity_ts)
          );
        },
        boardRows(boards={}, key="all") {
          const rows=boards && boards[key];
          return Array.isArray(rows) ? rows : [];
        },
        playerListForPeriod(boards={}, key="all") {
          return this.aggregatePlayers(this.boardRows(boards,key));
        },
        periodCount(boards, key) {
          return this.playerListForPeriod(boards || {}, key).length;
        },
        renderPeriodChips(active, boards={}) {
          return `<div class="hs-filter-row" role="group" aria-label="Zeitraum wählen">${this.periods.map(p=>{
            const count=this.periodCount(boards,p.key);
            return `<button type="button" class="hs-filter-chip ${p.key===active?"is-active":""}" data-action="hs-period" data-period="${escHTML(p.key)}"><span>${escHTML(p.label)}</span><small>${this.formatNumber(count)}</small></button>`;
          }).join("")}</div>`;
        },
        podiumCard(row, place, extraClass="") {
          const title = place===1 ? "Platz 1" : (place===2 ? "Platz 2" : "Platz 3");
          if(!row) {
            return `<div class="hs-podium-card ${extraClass} is-empty"><div class="hs-podium-place">${escHTML(title)}</div><div class="hs-avatar">${this.icon(place===1?"crown":"medal")}</div><b>Noch frei</b><small>Keine Teilnehmer im Zeitraum.</small></div>`;
          }
          const name=escHTML(row.player_name || "Gast");
          const tests=Number(row.test_count)||1;
          const subtitle=`${this.formatNumber(tests)} Test${tests===1?"":"s"} · beste Quote ${Math.round(Number(row.best_percent ?? row.percent)||0)}%`;
          return `<button type="button" class="hs-podium-card ${extraClass}" data-action="hs-player-preview" aria-label="${escHTML(title)} ${name}">
            <span class="hs-podium-place">${escHTML(title)}</span>
            <span class="hs-avatar">${this.icon(place===1?"crown":"medal")}</span>
            <b>${name}</b>
            <strong>${this.scoreText(row)}</strong>
            <small>${escHTML(subtitle)}</small>
          </button>`;
        },
        localBestRow() {
          try {
            const results = (typeof getResults === "function" ? getResults() : []) || [];
            if(!results.length) return null;
            const top = HighscoreEngine.build(results).top || [];
            const best = top[0] || results[results.length-1];
            if(!best) return null;
            return {
              player_name:this.playerName(),
              mode:best.mode || "local",
              title:best.title || best.mode || "Lokaler Test",
              percent:Number(best.percent)||0,
              best_percent:Number(best.percent)||0,
              score:this.arenaPoints(best),
              arena_points:this.arenaPoints(best),
              total:Number(best.total)||0,
              rank:best.rank || this.rankLabel(best.percent),
              device_id:this.deviceId(),
              created_at:best.date || best.created_at || new Date().toISOString(),
              test_count:1,
              rawRows:[best],
              localOnly:true,
              is_player_summary:true
            };
          } catch(e) { return null; }
        },
        rowDate(row) {
          const raw=row && (row.created_at || row.date || row.inserted_at);
          if(!raw) return "";
          const d=new Date(raw);
          if(!isFinite(d.getTime())) return "";
          try { return d.toLocaleDateString("de-DE", {day:"2-digit", month:"2-digit"}); } catch(e) { return ""; }
        },
        safeTitle(row) {
          if(!row) return "Training";
          if(row.is_player_summary) return `${this.formatNumber(row.test_count||0)} Tests · beste Quote ${Math.round(Number(row.best_percent ?? row.percent)||0)}%`;
          return row.title || row.mode || "Training";
        },
        currentLimit(el) {
          const raw=Number(el && el.dataset.hsLimit);
          return Math.max(10, Math.min(50, Number.isFinite(raw) && raw ? raw : 10));
        },
        buildRankSummary(list, boards={}, active="all") {
          const safeList=Array.isArray(list) ? list : [];
          const ownIndex=safeList.findIndex(r=>this.isSelfRow(r));
          let own=ownIndex>=0 ? safeList[ownIndex] : null;
          let ownRank=ownIndex>=0 ? ownIndex+1 : null;
          let isLocalOnly=false;
          if(!own) {
            const local=this.localBestRow();
            if(local) {
              own=local;
              isLocalOnly=true;
              const better=safeList.filter(r=>this.scoreValue(r)>this.scoreValue(local)).length;
              ownRank=safeList.length ? better+1 : null;
            }
          }
          const top10=safeList[9] || safeList[Math.min(safeList.length-1, 2)] || null;
          let gapText="Schließe einen Test ab, um dich einzutragen.";
          let progress=0;
          let distance=0;
          if(own) {
            if(!isLocalOnly && ownRank && ownRank<=10) { gapText="Du bist bereits in den Top 10."; progress=100; }
            else if(top10) {
              distance=Math.max(0, this.scoreValue(top10)-this.scoreValue(own)+1);
              gapText=distance ? `Noch ${this.formatNumber(distance)} Arena-Punkte bis Top 10` : "Top 10 ist in Reichweite.";
              progress=Math.max(8, Math.min(96, Math.round((this.scoreValue(own)/(this.scoreValue(top10)||1))*100)));
            } else {
              gapText=isLocalOnly ? "Dein lokaler Bestwert wartet auf den nächsten Cloud-Sync." : "Top 10 baut sich gerade auf.";
              progress=isLocalOnly ? 38 : 45;
            }
          }
          const periodLabel=this.periodLabel(active);
          const periodEntries=safeList.length;
          const allEntries=this.playerListForPeriod(boards,"all").length || safeList.length;
          return {own, ownRank, isLocalOnly, gapText, progress, distance, periodLabel, periodEntries, allEntries, list:safeList};
        },
        allRows(boards={}) {
          const rows=[];
          const seen=new Set();
          ["all","monthly","weekly","daily"].forEach(key=>{
            const part=boards && boards[key];
            if(!Array.isArray(part)) return;
            this.rawRows(part).forEach(row=>{
              const sig=[row.device_id,row.player_name,row.title,row.percent,row.score,row.created_at].join("|");
              if(seen.has(sig)) return;
              seen.add(sig); rows.push(row);
            });
          });
          return rows;
        },
        ownRows(boards={}) {
          return this.allRows(boards).filter(row=>this.isSelfRow(row));
        },
        periodStartDate(period) {
          const iso=this.periodStart(period);
          if(!iso) return null;
          const d=new Date(iso);
          return isFinite(d.getTime()) ? d : null;
        },
        rowsForPeriod(rows=[], period="all") {
          const start=this.periodStartDate(period);
          if(!start) return Array.isArray(rows) ? rows : [];
          const startTs=start.getTime();
          return (Array.isArray(rows)?rows:[]).filter(row=>this.rowTimestamp(row)>=startTs);
        },
        sumScore(rows=[]) {
          return (Array.isArray(rows)?rows:[]).reduce((sum,row)=>sum+this.arenaPoints(row),0);
        },
        dateKey(row) {
          const ts=this.rowTimestamp(row);
          if(!ts) return "";
          const d=new Date(ts);
          const y=d.getFullYear();
          const m=String(d.getMonth()+1).padStart(2,"0");
          const day=String(d.getDate()).padStart(2,"0");
          return `${y}-${m}-${day}`;
        },
        dateKeyFromDate(d) {
          return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
        },
        currentStreak(rows=[]) {
          const set=new Set((Array.isArray(rows)?rows:[]).map(r=>this.dateKey(r)).filter(Boolean));
          const today=new Date();
          const todayKey=this.dateKeyFromDate(today);
          let anchor=new Date(today.getFullYear(), today.getMonth(), today.getDate());
          let todayActive=set.has(todayKey);
          if(!todayActive) anchor.setDate(anchor.getDate()-1);
          let count=0;
          for(let i=0;i<60;i++) {
            const key=this.dateKeyFromDate(anchor);
            if(!set.has(key)) break;
            count++;
            anchor.setDate(anchor.getDate()-1);
          }
          return {count, todayActive, days:Array.from(set).sort()};
        },
        challengeData(boards={}, summary={}) {
          const ownAll=this.ownRows(boards);
          const ownDaily=this.rowsForPeriod(ownAll,"daily");
          const ownWeekly=this.rowsForPeriod(ownAll,"weekly");
          const todayPoints=this.sumScore(ownDaily);
          const targetToday=1000;
          const top10Done=!!(summary.ownRank && summary.ownRank<=10 && !summary.isLocalOnly);
          const top10Progress=top10Done ? 100 : Math.max(0, Math.min(100, Number(summary.progress)||0));
          const streak=this.currentStreak(ownAll);
          return {ownAll, ownDaily, ownWeekly, todayPoints, targetToday, top10Done, top10Progress, streak:streak.count, todayActive:streak.todayActive};
        },
        challengeCard(icon, title, text, progress, meta) {
          const pct=Math.max(0,Math.min(100,Math.round(Number(progress)||0)));
          return `<div class="hs-challenge-card">
            <span class="hs-mini-icon">${this.icon(icon)}</span>
            <div class="hs-challenge-main"><b>${escHTML(title)}</b><small>${escHTML(text)}</small><div class="hs-micro-track"><i style="width:${pct}%"></i></div></div>
            <em>${escHTML(meta || pct + "%")}</em>
          </div>`;
        },
        renderChallenges(boards={}, summary={}) {
          const d=this.challengeData(boards, summary);
          const todayPct=Math.min(100, Math.round((d.todayPoints/(d.targetToday||1))*100));
          const streakText=d.todayActive ? `${d.streak} / 7 aktive Tage` : `${d.streak} / 7 · heute offen`;
          return `<section class="hs-panel hs-challenges-panel">
            <div class="hs-panel-head"><span>${this.icon("flame")}</span><div><b>Herausforderungen</b><small>Nur aus deinen eigenen Highscore-Daten berechnet.</small></div><button type="button" data-action="hs-challenges-info">Alle</button></div>
            ${this.challengeCard("target", "Top 10 angreifen", d.top10Done ? "Du bist bereits in den Top 10." : (summary.gapText || "Arbeite dich in die Top 10."), d.top10Progress, d.top10Done ? "erreicht" : Math.round(d.top10Progress)+"%")} 
            ${this.challengeCard("trophy", "Heute 1.000 Punkte", this.formatNumber(d.todayPoints)+" / "+this.formatNumber(d.targetToday)+" Arena-Punkte", todayPct, this.formatNumber(d.targetToday-Math.min(d.todayPoints,d.targetToday))+" offen")}
            ${this.challengeCard("flame", "7-Tage-Serie", streakText, Math.round((Math.min(7,d.streak)/7)*100), d.streak+" Tage")}
          </section>`;
        },
        renderActionGrid(summary={}) {
          return `<section class="hs-action-grid" aria-label="Highscore Aktionen">
            <button type="button" class="hs-action-card is-primary" data-ui-action="start-training"><span>${this.icon("target")}</span><b>Training starten</b><small>Punkte sammeln und Rang verbessern</small></button>
            <button type="button" class="hs-action-card" data-action="cloud-refresh"><span>${this.icon("refresh")}</span><b>Ranking aktualisieren</b><small>Cloud und lokale Daten neu laden</small></button>
            <button type="button" class="hs-action-card" data-action="hs-class-info"><span>${this.icon("trophy")}</span><b>Klassenranking</b><small>Aktuelle Klasse: ${escHTML(this.config().classCode || "default")}</small></button>
            <button type="button" class="hs-action-card" data-action="hs-profile-info"><span>${this.icon("user")}</span><b>Profil prüfen</b><small>Name, Gruppe und Lernstand öffnen</small></button>
          </section>`;
        },
        renderDuelPreview(summary={}) {
          const targetName = summary.ownRank && summary.ownRank > 1 ? "den Platz vor dir" : "einen Top-Spieler";
          return `<section class="hs-panel hs-duel-panel">
            <div class="hs-panel-head"><span>${this.icon("swords")}</span><div><b>Duelle</b><small>Vorbereitet für Simulation-Challenges.</small></div><button type="button" data-action="hs-duel-info" data-duel="overview">Alle</button></div>
            <div class="hs-duel-card">
              <div><b>Fordere ${escHTML(targetName)} heraus</b><small>Demnächst: gleicher Aufgabenblock, direkte Auswertung, Gewinner-Badge.</small></div>
              <div class="hs-duel-actions"><button type="button" data-action="hs-duel-info" data-duel="accept">Planen</button><button type="button" data-action="hs-duel-info" data-duel="decline">Später</button></div>
            </div>
          </section>`;
        },
        pointValue(row) {
          return this.arenaPoints(row);
        },
        parseDurationMinutes(value) {
          const raw=String(value || "").trim().toLowerCase();
          if(!raw) return 0;
          const parts=raw.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
          if(parts) return (Number(parts[1])||0)*60 + (Number(parts[2])||0);
          const h=raw.match(/(\d+(?:[\.,]\d+)?)\s*(h|std|stunde|stunden)/);
          const m=raw.match(/(\d+(?:[\.,]\d+)?)\s*(m|min|minute|minuten)/);
          let total=0;
          if(h) total += Number(String(h[1]).replace(",","."))*60;
          if(m) total += Number(String(m[1]).replace(",","."));
          if(total) return Math.round(total);
          const n=Number(raw.replace(",",".").replace(/[^0-9.]/g,""));
          return Number.isFinite(n) ? Math.round(n) : 0;
        },
        formatMinutes(minutes) {
          const m=Math.max(0, Math.round(Number(minutes)||0));
          if(!m) return "—";
          const h=Math.floor(m/60), rest=m%60;
          return h ? `${h}h ${String(rest).padStart(2,"0")}m` : `${rest}m`;
        },
        last7Buckets(rows=[]) {
          const days=[];
          const today=new Date();
          for(let i=6;i>=0;i--) {
            const d=new Date(today.getFullYear(), today.getMonth(), today.getDate()-i);
            days.push({key:this.dateKeyFromDate(d), label:d.toLocaleDateString("de-DE", {weekday:"short"}).replace(".",""), value:0, count:0});
          }
          const map=new Map(days.map(d=>[d.key,d]));
          (Array.isArray(rows)?rows:[]).forEach(row=>{
            const key=this.dateKey(row);
            const bucket=map.get(key);
            if(!bucket) return;
            bucket.value += this.pointValue(row);
            bucket.count += 1;
          });
          return days;
        },
        miniChartSvg(buckets=[]) {
          const vals=(Array.isArray(buckets)?buckets:[]).map(b=>Number(b.value)||0);
          const max=Math.max(1, ...vals);
          const w=220, h=72, pad=9;
          const denom=Math.max(1, vals.length-1);
          const pts=vals.map((v,i)=>{
            const x=pad + (i*((w-pad*2)/denom));
            const y=h-pad - ((v/max)*(h-pad*2));
            return `${x.toFixed(1)},${y.toFixed(1)}`;
          }).join(" ");
          const dots=vals.map((v,i)=>{
            const x=pad + (i*((w-pad*2)/denom));
            const y=h-pad - ((v/max)*(h-pad*2));
            return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="2.4"/>`;
          }).join("");
          return `<svg class="hs-mini-chart" viewBox="0 0 ${w} ${h}" role="img" aria-label="Entwicklung der letzten sieben Tage"><path d="M${pad} ${h-pad}H${w-pad}"/><polyline points="${pts}"/>${dots}</svg>`;
        },
        renderDevelopment(boards={}) {
          const own=this.ownRows(boards);
          const buckets=this.last7Buckets(own);
          const total=buckets.reduce((s,b)=>s+(Number(b.value)||0),0);
          const count=buckets.reduce((s,b)=>s+(Number(b.count)||0),0);
          const labels=buckets.map(b=>`<span>${escHTML(b.label)}</span>`).join("");
          const last3=buckets.slice(-3).reduce((s,b)=>s+b.value,0);
          const prev3=buckets.slice(1,4).reduce((s,b)=>s+b.value,0);
          const trend=last3>prev3 ? "steigend" : (last3<prev3 ? "rückläufig" : "konstant");
          return `<section class="hs-panel hs-chart-card">
            <div class="hs-panel-head"><span>${this.icon("chart")}</span><div><b>Deine Entwicklung</b><small>Nur deine letzten 7 Tage</small></div><button type="button" data-action="hs-profile-info">Details</button></div>
            <div class="hs-chart-body"><div><strong>+${this.formatNumber(total)}</strong><small>Arena-Punkte · ${this.formatNumber(count)} Tests · Trend: ${escHTML(trend)}</small></div>${this.miniChartSvg(buckets)}<div class="hs-chart-labels">${labels}</div></div>
          </section>`;
        },
        rewardData(boards={}, summary={}) {
          const points=this.sumScore(this.ownRows(boards));
          const fallback=(!points && summary && summary.own) ? this.pointValue(summary.own) : 0;
          const totalPoints=points || fallback;
          const tiers=[
            {name:"Bronze", points:1000},
            {name:"Silber", points:2500},
            {name:"Gold", points:5000},
            {name:"Platin", points:10000},
            {name:"Diamond", points:20000}
          ];
          const current=[...tiers].reverse().find(t=>totalPoints>=t.points) || {name:"Start", points:0};
          const next=tiers.find(t=>totalPoints<t.points) || {name:"Champion", points:totalPoints};
          const base=current.points||0;
          const span=Math.max(1,(next.points||totalPoints)-base);
          const progress=next.name==="Champion" ? 100 : Math.max(0,Math.min(100,Math.round(((totalPoints-base)/span)*100)));
          const missing=Math.max(0,(next.points||totalPoints)-totalPoints);
          return {points:totalPoints,current,next,progress,missing};
        },
        renderReward(boards={}, summary={}) {
          const r=this.rewardData(boards, summary);
          const done=r.next.name==="Champion";
          return `<section class="hs-panel hs-reward-card">
            <div class="hs-panel-head"><span>${this.icon("gift")}</span><div><b>Nächste Belohnung</b><small>Kumulierte persönliche Arena-Punkte</small></div><button type="button" data-action="hs-challenges-info">Badges</button></div>
            <div class="hs-reward-body"><span class="hs-reward-medal">${this.icon(done?"crown":"diamond")}</span><div><b>${done ? "Champion" : r.next.name+"-Badge"}</b><small>${this.formatNumber(r.points)} / ${this.formatNumber(r.next.points)} Arena-Punkte</small><div class="hs-micro-track hs-reward-track"><i style="width:${r.progress}%"></i></div><em>${done ? "maximal" : this.formatNumber(r.missing)+" Punkte fehlen"}</em></div></div>
          </section>`;
        },
        renderActivity(boards={}) {
          const rows=this.rowsForPeriod(this.ownRows(boards), "weekly");
          const count=rows.length;
          const total=this.sumScore(rows);
          const avg=count ? Math.round(total/count) : 0;
          const minutes=rows.reduce((s,row)=>s+this.parseDurationMinutes(row && row.duration),0);
          return `<section class="hs-panel hs-activity-card">
            <div class="hs-panel-head"><span>${this.icon("calendar")}</span><div><b>Aktivität diese Woche</b><small>Nur deine eigenen Tests.</small></div></div>
            <div class="hs-activity-grid"><span><b>${this.formatNumber(count)}</b><small>Tests</small></span><span><b>${avg ? "+"+this.formatNumber(avg) : "—"}</b><small>Ø Arena-Punkte</small></span><span><b>${this.formatMinutes(minutes)}</b><small>Lernzeit</small></span></div>
          </section>`;
        },
        rankCard(summary, active) {
          const own=summary.own;
          const rankText=summary.ownRank ? summary.ownRank+"." : "—";
          const totalText=summary.periodEntries || summary.allEntries || 0;
          const ownScore=own ? this.scoreText(own) : "—";
          const syncNote=summary.isLocalOnly ? "lokaler Bestwert" : (own ? "Cloud-Ranking" : "noch nicht platziert");
          return `<div class="hs-rank-card hs-rank-card-v2">
            <div class="hs-rank-main-stat"><span>Dein Rang</span><strong>${rankText}</strong><small>${summary.ownRank ? "von " + this.formatNumber(totalText) + " Teilnehmern im Zeitraum " + escHTML(summary.periodLabel) : syncNote}</small></div>
            <div class="hs-rank-main-stat"><span>Deine Punkte</span><strong>${ownScore}</strong><small>Arena-Punkte</small></div>
            <div class="hs-rank-target"><span>${this.icon("target")}</span><div><b>${escHTML(summary.gapText)}</b><small>${summary.isLocalOnly ? "Cloud-Platzierung nach dem nächsten gespeicherten Test" : "Abstand wird mit Arena-Punkten berechnet"}</small></div></div>
            <div class="hs-progress-track" aria-label="Top 10 Fortschritt"><i style="width:${summary.progress}%"></i></div>
            <div class="hs-rank-meta-grid">
              <span><b>${escHTML(summary.periodLabel)}</b><small>aktiver Filter</small></span>
              <span><b>${this.formatNumber(summary.periodEntries)}</b><small>Teilnehmer</small></span>
              <span><b>${summary.ownRank && summary.ownRank<=10 ? "Top 10" : "Aufholen"}</b><small>Status</small></span>
            </div>
            <button type="button" class="hs-start-btn" data-ui-action="start-training">Training starten</button>
          </div>`;
        },
        rankingRow(row, rank, isMe=false) {
          const percent=Math.max(0,Math.min(100,Number(row && (row.best_percent ?? row.percent))||0));
          const date=this.rowDate(row);
          const title=this.safeTitle(row);
          const tests=Number(row && row.test_count)||1;
          return `<button type="button" class="hs-ranking-row ${isMe?"is-me":""}" data-action="hs-player-preview" aria-label="${isMe?"Deine Position":"Teilnehmer"} Rang ${rank}">
            <span class="hs-rank-no">#${rank}</span>
            <span class="hs-rank-person"><b>${isMe?"Du":escHTML((row && row.player_name) || "Gast")}</b><small>${escHTML(title)}${date?" · "+escHTML(date):""}</small></span>
            <span class="hs-rank-percent"><b>${percent}%</b><small>beste Quote</small></span>
            <span class="hs-rank-points"><b>${this.scoreText(row)}</b><small>${tests} Test${tests===1?"":"s"}</small></span>
          </button>`;
        },
        rankingListHtml(list, summary, active, limit) {
          const safeList=Array.isArray(list) ? list : [];
          if(!safeList.length) return `<div class="hs-loading-card"><b>Noch keine Teilnehmer für ${escHTML(this.periodLabel(active))}</b><small>Starte ein Training und sichere dir den ersten Platz in diesem Zeitraum.</small></div>`;
          const mainRows=safeList.slice(3, Math.min(safeList.length, limit));
          const visibleEnd=Math.min(safeList.length, limit);
          const ownInVisible=summary.ownRank && summary.ownRank>=4 && summary.ownRank<=visibleEnd && !summary.isLocalOnly;
          const ownExtra=(summary.own && !ownInVisible && summary.ownRank && summary.ownRank>3) ? this.rankingRow(summary.own, summary.ownRank, true) : "";
          const rowsHtml=mainRows.map((r,idx)=>{
            const rank=idx+4;
            return this.rankingRow(r, rank, this.isSelfRow(r));
          }).join("") + ownExtra;
          const hasMore=safeList.length>limit;
          return rowsHtml + (hasMore ? `<button type="button" class="hs-more-btn" data-action="hs-show-more">Mehr anzeigen · ${this.formatNumber(Math.min(50, safeList.length)-limit)} weitere</button>` : `<div class="hs-list-end">Alle sichtbaren Teilnehmer geladen.</div>`);
        },
        renderPremiumArena(boards={}, health={}, options={}) {
          const el=$("cloudHighscoreCard");
          const active=this.activePeriod(el);
          const limit=this.currentLimit(el);
          const rowsRaw=boards && boards[active];
          const hasBoardError=rowsRaw && rowsRaw.error;
          const list=this.playerListForPeriod(boards, active);
          const top=list.slice(0,3);
          const summary=this.buildRankSummary(list, boards, active);
          const loading=!!options.loading;
          const statusText = options.error ? "Verbindung prüfen" : (loading ? "Ranking wird geladen" : "Live Ranking · aktuell");
          const checked = health && health.checkedAt ? health.checkedAt : (options.updatedAt || new Date().toLocaleTimeString("de-DE", {hour:"2-digit", minute:"2-digit"}));
          const cloudOk=!!(health && health.serverOk && health.readOk);
          return `<div class="hs-arena-inner ${options.error?"is-error":(loading?"is-loading":"is-live")}">
            <div class="hs-header">
              <div class="hs-title-block"><span class="hs-title-icon">${this.icon("trophy")}</span><div><h2>Highscore</h2><p>${statusText} · ${escHTML(this.periodLabel(active))}</p></div></div>
              <button type="button" class="hs-profile-pill" data-action="hs-profile-info" aria-label="Profil Vorschau"><span class="hs-profile-avatar">${this.icon("user")}</span><span><b>Dein Profil</b><small>nächstes Upgrade</small></span></button>
            </div>
            <div class="hs-top-controls">${this.renderPeriodChips(active, boards)}<button class="hs-refresh-mini" type="button" data-action="cloud-refresh" aria-label="Ranking neu laden">${this.icon("refresh")}</button></div>
            ${hasBoardError ? `<div class="cloud-error-note hs-error-strip">${escHTML(rowsRaw.error)}</div>` : ""}
            <div class="hs-period-summary"><span>${this.icon(cloudOk?"cloud-check":"cloud-x")} ${cloudOk ? "Live verbunden" : (loading ? "Verbindung wird geprüft" : "Cloud prüfen")}</span><span>${this.formatNumber(summary.periodEntries)} Teilnehmer · aktualisiert ${escHTML(checked)}</span></div>
            <div class="hs-grid">
              <section class="hs-main-column">
                <div class="hs-podium" aria-label="Top 3">
                  ${this.podiumCard(top[1],2,"is-second")}
                  ${this.podiumCard(top[0],1,"is-first")}
                  ${this.podiumCard(top[2],3,"is-third")}
                </div>
                ${this.rankCard(summary, active)}
                ${this.renderActionGrid(summary)}
                <div class="hs-ranking-list">
                  <div class="hs-list-head"><b>Rangliste</b><small>${this.formatNumber(list.length)} Teilnehmer · ${escHTML(this.periodLabel(active))}</small></div>
                  ${loading ? `<div class="hs-loading-card"><b>Ranking wird geladen...</b><small>Bitte einen Moment Geduld.</small></div>` : this.rankingListHtml(list, summary, active, limit)}
                </div>
              </section>
              <aside class="hs-side-column">
                ${this.renderChallenges(boards, summary)}
                ${this.renderDevelopment(boards)}
                ${this.renderReward(boards, summary)}
                ${this.renderActivity(boards)}
                <div class="hs-mini-card"><b>Live-Status</b><small>Aktualisiert: ${escHTML(checked)}</small><small>${cloudOk ? "Server verbunden · Tabelle lesbar" : (loading ? "Verbindung wird geprüft" : "Cloud prüfen")}</small></div>
              </aside>
            </div>
            ${this.cloudButtons(options.note || (loading ? "Ladevorgang läuft" : "Ranking aktuell"))}
            ${this.renderCloudHealth(health)}
          </div>`;
        },
        renderShell() {
          const configured=this.isConfigured();
          const miss=this.missingFields();
          const health = configured ? {serverOk:false, readOk:false, status:"wartet", serverDetail:"noch nicht geprüft", readDetail:"noch nicht geprüft"} : {serverOk:false, readOk:false, status:"config-missing", serverDetail:"Config fehlt", readDetail:"nicht prüfbar", error:"Fehlend: "+miss.join(", ")};
          return `<div class="ui-card cloud-highscore-card hs-arena" id="cloudHighscoreCard" data-hs-period="all" data-cloud-period="all">${this.renderPremiumArena({}, health, {loading:configured, note:configured?"Live-Ranking wird vorbereitet":"Config unvollständig"})}</div>`;
        },
        isVisible() {
          const el=$("cloudHighscoreCard");
          if(!el) return false;
          try {
            const rect=el.getBoundingClientRect();
            const style=window.getComputedStyle ? window.getComputedStyle(el) : null;
            if(style && (style.display==="none" || style.visibility==="hidden")) return false;
            return rect.width > 0 && rect.height > 0;
          } catch(e) { return true; }
        },
        async refreshCloudHealthOnly(reason="manual-health-check") {
          const el=$("cloudHighscoreCard");
          if(!el) return {ok:false, reason:"card-missing"};
          if(this._healthRunning) return {ok:false, reason:"health-already-running"};
          this._healthRunning = true;
          const boards=this._lastBoards || {};
          try {
            el.innerHTML=this.renderPremiumArena(boards, {serverOk:false, readOk:false, status:"prüft", serverDetail:"wird geprüft", readDetail:"wird geprüft", checkedAt:new Date().toLocaleTimeString("de-DE", {hour:"2-digit", minute:"2-digit", second:"2-digit"})}, {loading:false, note:"Cloud-Verbindung wird geprüft"});
            const health=await this.cloudHealthCheck();
            this._lastHealth=health;
            this._lastUpdatedAt=health.checkedAt || new Date().toLocaleTimeString("de-DE", {hour:"2-digit", minute:"2-digit", second:"2-digit"});
            this._lastNote=health.serverOk && health.readOk ? "Cloud-Check erfolgreich" : "Cloud-Check zeigt ein Problem";
            el.innerHTML=this.renderPremiumArena(this._lastBoards || {}, health, {note:this._lastNote, updatedAt:this._lastUpdatedAt});
            return {ok:!!(health.serverOk && health.readOk), health, reason};
          } catch(error) {
            const health=this.healthFromError(error);
            this._lastHealth=health;
            this._lastNote="Cloud-Check fehlgeschlagen";
            el.innerHTML=this.renderPremiumArena(this._lastBoards || {}, health, {error:String(error && error.message ? error.message : error), note:this._lastNote});
            return {ok:false, error:String(error && error.message ? error.message : error), health, reason};
          } finally {
            this._healthRunning = false;
          }
        },
        async refreshDashboard(reason="manual") {
          const el=$("cloudHighscoreCard");
          if(!el) return {ok:false, reason:"card-missing"};
          const reasonText = String(reason || "manual");
          const isHealthOnly = /health-check|cloud-health/i.test(reasonText);
          if(isHealthOnly) return this.refreshCloudHealthOnly(reasonText);
          const isManual = /manual|button|test|score-saved|profile|force/i.test(reasonText);
          const isOpen = /highscore-open|tab-open|open/i.test(reasonText);
          const minGap = Math.max(3000, Math.min(15000, Number(this.config().minRefreshGapMs || 12000)));
          const manualGap = Math.max(650, Math.min(2500, Number(this.config().manualRefreshGapMs || 900)));
          const nowTs = Date.now();
          if(!this.isVisible() && !isManual && !isOpen) return {ok:false, reason:"highscore-not-visible"};
          if(isManual && this._lastManualRefreshAt && (nowTs - this._lastManualRefreshAt) < manualGap) {
            return {ok:false, reason:"manual-refresh-throttled", waitMs:manualGap - (nowTs - this._lastManualRefreshAt)};
          }
          if(!isManual && this._lastRefreshStartedAt && (nowTs - this._lastRefreshStartedAt) < minGap) {
            return {ok:false, reason:"refresh-throttled", waitMs:minGap - (nowTs - this._lastRefreshStartedAt)};
          }
          if(this._refreshRunning) return {ok:false, reason:"refresh-already-running"};
          if(isManual) this._lastManualRefreshAt = nowTs;
          this._lastRefreshStartedAt = nowTs;
          this._refreshRunning = true;
          const runId = Date.now().toString(36)+Math.random().toString(36).slice(2);
          el.dataset.cloudRun = runId;
          const stillCurrent = () => el.dataset.cloudRun === runId;
          const finishedAt = () => {
            const d = new Date();
            return d.toLocaleTimeString("de-DE", {hour:"2-digit", minute:"2-digit", second:"2-digit"});
          };
          try {
            if(!this.isConfigured()) {
              const miss=this.missingFields();
              if(stillCurrent()) el.innerHTML=this.renderPremiumArena({}, {serverOk:false, readOk:false, status:"config-missing", serverDetail:"Config fehlt", readDetail:"nicht prüfbar", error:"Fehlend: "+miss.join(", ")}, {error:"Config unvollständig", note:"Automatik wartet auf gültige Config"});
              return {ok:false, reason:"config-missing", missing:miss};
            }
            el.innerHTML=this.renderPremiumArena({}, {serverOk:false, readOk:false, status:"prüft", serverDetail:"wird geprüft", readDetail:"wird geprüft"}, {loading:true, note:"Ladevorgang läuft"});
            const watchdog = setTimeout(()=>{ try{ if(stillCurrent() && el && /Ranking wird geladen|Live-Ranking wird vorbereitet/i.test(el.textContent||"")){ el.innerHTML=this.renderPremiumArena({}, {serverOk:false, readOk:false, status:"wartet", serverDetail:"langsame Antwort", readDetail:"noch nicht bestätigt"}, {loading:true, note:"Timeout-Schutz aktiv"}); } }catch(e){} }, 8000);
            try {
              const res=await this.fetchBoards();
              clearTimeout(watchdog);
              let boards=res.boards||{};
              let total=Object.values(boards).reduce((s,rows)=>s+(Array.isArray(rows)?rows.length:0),0);
              const note = total ? "Cloud live geladen" : "Cloud erreichbar, aber noch keine Einträge vorhanden";
              const boardsHaveError = Object.values(boards || {}).some(rows => rows && rows.error);
              const health = boardsHaveError ? await this.cloudHealthCheck().catch(error=>this.healthFromError(error)) : this.healthOk({status:"online", checkedAt:finishedAt(), httpStatus:"OK"});
              this._lastBoards=boards; this._lastHealth=health; this._lastNote=note; this._lastUpdatedAt=finishedAt();
              if(stillCurrent()) el.innerHTML=this.renderPremiumArena(boards, health, {note:`${note} · aktualisiert ${this._lastUpdatedAt} · Auto alle ${Math.round(this.config().refreshIntervalMs/1000)}s`, updatedAt:this._lastUpdatedAt});
              return {ok:true, source:"supabase", total, boards, health};
            } catch(error) {
              clearTimeout(watchdog);
              const boards=this.localFallbackBoards();
              const total=Object.values(boards).reduce((sum,rows)=>sum+(Array.isArray(rows)?rows.length:0),0);
              const health=await this.cloudHealthCheck().catch(healthError=>this.healthFromError(healthError));
              this._lastBoards=boards; this._lastHealth=health; this._lastNote=total?"Lokaler Fallback sichtbar · Cloud-Retry läuft automatisch":"Noch keine lokalen Highscores vorhanden · Cloud-Retry läuft automatisch";
              if(stillCurrent()) el.innerHTML=this.renderPremiumArena(boards, health, {error:String(error && error.message ? error.message : error), note:this._lastNote});
              return {ok:false, source:"fallback", error:String(error && error.message ? error.message : error), health};
            }
          } finally {
            this._refreshRunning = false;
          }
        },
        setPeriod(period) {
          const key=this.periods.some(p=>p.key===period) ? period : "all";
          const el=$("cloudHighscoreCard");
          if(el) { el.dataset.hsPeriod=key; el.dataset.cloudPeriod=key; el.dataset.hsLimit="10"; }
          if(el && this._lastBoards) {
            el.innerHTML=this.renderPremiumArena(this._lastBoards, this._lastHealth || {serverOk:false, readOk:false, status:"wartet"}, {note:this._lastNote || "Zeitraum gewechselt", updatedAt:this._lastUpdatedAt});
            return {ok:true, period:key, source:"cache"};
          }
          return this.refreshDashboard("manual-period-change");
        },
        showMore() {
          const el=$("cloudHighscoreCard");
          if(!el) return {ok:false, reason:"card-missing"};
          const next=Math.min(50, this.currentLimit(el)+10);
          el.dataset.hsLimit=String(next);
          if(this._lastBoards) {
            el.innerHTML=this.renderPremiumArena(this._lastBoards, this._lastHealth || {serverOk:false, readOk:false, status:"wartet"}, {note:this._lastNote || "Weitere Einträge geladen", updatedAt:this._lastUpdatedAt});
            return {ok:true, limit:next, source:"cache"};
          }
          return this.refreshDashboard("manual-show-more");
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
          const health = await this.cloudHealthCheck();
          return {...health, writeReady:!!health.readOk};
        }
      };

    return engine;
  };
})();
