/* AUTO-GENERATED BUNDLE aus js/src/ · Änderungen bitte in den Source-Modulen machen. */
/* AUTO-GENERATED BUNDLE aus js/src/ · Änderungen bitte in den Source-Schichten machen. */
/* Bootstrap, Version, Feature Flags, PWA Config, Hilfsfunktionen und Framework-Metadaten. */
"use strict";

/*
===============================================================================
Eignungstest-Trainer V7.0.2 · Clean Stable
===============================================================================
Struktur:
- Core: Modi, Quiz-Ablauf, Timer, Navigation, Wertung
- Generatoren: Wissen, Mathe, Logik, Konzentration, Route-Memory, EDV
- Renderer: Multiple Choice, visuelle Aufgaben, Route-Sequenz, EDV-Multi-Choice
- Storage: IndexedDB als Hauptspeicher, localStorage als Fallback
- PWA: Manifest, Service Worker, Cache-Bereinigung
- Qualität: Guard, Framework-Health, Simulation-Checks

Framework Refactor V7.0.2:
- Versions- und Cache-Bezeichnungen vereinheitlicht
- Legacy-EDV-Einzelfrage aus Export und Runtime entfernt
- EDV-Modul auf Multi-Choice-Gesamtauswertung stabilisiert
- MigrationPath auf V7.0.2 aktualisiert
- alte V3/V4-Kommentarblöcke bereinigt
===============================================================================
*/


window.App = (() => {
  const STORE_KEY = "eignungstest_trainer_v702_results";
  const LEGACY_STORE_KEYS = ["eignungstest_trainer_v700_results","eignungstest_trainer_v514_results","eignungstest_trainer_v512_results","eignungstest_trainer_v501_results","eignungstest_trainer_v42_results","eignungstest_trainer_v36_results","eignungstest_trainer_v355_results","eignungstest_trainer_v354_results","eignungstest_trainer_v353_results","eignungstest_trainer_v35_results","eignungstest_trainer_v341_results","eignungstest_trainer_v34_results","eignungstest_trainer_v332_results","eignungstest_trainer_v33_results","eignungstest_trainer_v331_results","eignungstest_trainer_v321_results","eignungstest_trainer_v32_results","eignungstest_trainer_v311_results","eignungstest_trainer_v31_results","eignungstest_trainer_v292_results","eignungstest_trainer_v291_results","eignungstest_trainer_v29_results","eignungstest_trainer_v281_results","eignungstest_trainer_v28_results","eignungstest_trainer_v231_results","eignungstest_trainer_v251_results","eignungstest_trainer_v23_results","eignungstest_trainer_v19_results","eignungstest_trainer_v18_results","eignungstest_trainer_v17_results","eignungstest_trainer_v16_results"];
  const APP_VERSION = "7.0.2-deep-cleanup";
  const PROFILE_KEY = "eignungstest_trainer_profile_v702";
  const PROFILE_LEGACY_KEYS = ["eignungstest_trainer_profile_v700","eignungstest_trainer_profile_v514","eignungstest_trainer_profile_v512","eignungstest_trainer_profile_v501","eignungstest_trainer_profile_v42","eignungstest_trainer_profile_v36","eignungstest_trainer_profile_v355","eignungstest_trainer_profile_v354","eignungstest_trainer_profile_v353","eignungstest_trainer_profile_v35","eignungstest_trainer_profile_v341","eignungstest_trainer_profile_v34","eignungstest_trainer_profile_v332","eignungstest_trainer_profile_v33","eignungstest_trainer_profile_v331","eignungstest_trainer_profile_v321","eignungstest_trainer_profile_v32","eignungstest_trainer_profile_v311","eignungstest_trainer_profile_v31","eignungstest_trainer_profile_v292","eignungstest_trainer_profile_v291","eignungstest_trainer_profile_v29","eignungstest_trainer_profile_v281","eignungstest_trainer_profile_v27","eignungstest_trainer_profile_v251","eignungstest_trainer_profile_v23","eignungstest_trainer_profile_v19"];
  const FOCUS_KEY = "eignungstest_trainer_focus_v702";
  const $ = id => document.getElementById(id);
  const rand = (a,b) => Math.floor(Math.random()*(b-a+1))+a;
  const choice = arr => arr[rand(0, arr.length-1)];
  const shuffle = arr => { const b=[...arr]; for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1)); [b[i],b[j]]=[b[j],b[i]];} return b; };
  const gcd = (a,b) => { a=Math.abs(a); b=Math.abs(b); while(b){const t=b; b=a%b; a=t;} return a||1; };
  const norm = v => String(v).replace(".",",");
  const fracHTML = (n,d) => `<span class="frac"><span class="top">${n}</span><span class="bottom">${d}</span></span>`;
  const mixedHTML = (w,n,d) => `<span class="mixed"><span>${w}</span>${fracHTML(n,d)}</span>`;
  const optIdx = (opts,c) => opts.indexOf(c);
  const fmtClock = sec => `${String(Math.floor(Math.max(0,sec)/60)).padStart(2,"0")}:${String(Math.max(0,sec)%60).padStart(2,"0")}`;
  const formatTime = d => d ? d.toLocaleTimeString("de-DE",{hour:"2-digit",minute:"2-digit",second:"2-digit"}) : "-";
  const formatDate = d => d ? d.toLocaleDateString("de-DE") + " " + formatTime(d) : "-";
  const formatDuration = ms => { let s=Math.max(0,Math.floor(ms/1000)),m=Math.floor(s/60),h=Math.floor(m/60); s%=60; m%=60; return (h?h+" Std. ":"")+m+" Min. "+s+" Sek."; };
  const escHTML = value => String(value).replace(/[&<>"]/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[ch]));
  const jsArg = value => JSON.stringify(String(value)).replace(/</g,"\u003c").replace(/>/g,"\u003e");

  const MODULE_TREE = {
    core:["modes","quiz","timer","navigation","scoring"],
    render:["mc","matrix","series","fraction","visual","routeMemory","focusgrid","bigschema","edvmulti","visualIQ"],
    modules:["math","logic","knowledge","english","it","concentration","routeMemory","simulation","visualIQ","blockTraining"],
    storage:["results","categoryStats","review"],
    nextBranches:["adaptiveErrorTraining","visualIQHardcore","pwaOfflineCache","indexedDbDatabase","profileSystem"]
  };

  const FEATURE_FLAGS = Object.freeze({
    questionBankRuntimeImport:false,
    questionBankGeneration:false,
    ocrPipeline:false,
    indexedDbMigration:true,
    indexedDbMigrationPrep:true,
    indexedDbFoundation:true,
    indexedDbWriteTest:true,
    indexedDbPrimaryStorage:true,
    pwaManifestTemplate:true,
    pwaServiceWorkerRuntime:true,
    pwaOfflineCache:true,
    pwaInstall:true,
    highscoreDashboard:true,
    highscoreCloudSync:true,
    cloudLeaderboard:true
  });

  const FEATURE_STATUS = Object.freeze({
    stable:["coreQuiz","modeHub","simulation","focusGuard","analysis","backup","indexedDbPrimary","localStorageFallback","cloudHighscoreFallback","pwaMetadata","pwaCleanup","pwaOfflineEngine","cacheRecovery","iconFinalReady","indexedDbFoundation","databaseSelftest","migrationActive"],
    prepared:["questionBankSchema","ocrImportSchema","pwaStructure","manifestTemplate","serviceWorkerTemplate","appShell","highscoreStore","leaderboardSchema","cloudHighscoreAdapter","supabaseRestAdapter","activeCloudLeaderboard"],
    disabled:["questionBankRuntimeImport","questionBankGeneration","ocrPipeline"]
  });

  const PWA_CONFIG = Object.freeze({
    appName:"Eignungstest-Trainer",
    shortName:"Trainer",
    startUrl:"./index.html",
    scope:"./",
    display:"standalone",
    orientation:"portrait",
    themeColor:"#0f172a",
    backgroundColor:"#eef3f9",
    manifestFile:"manifest.json",
    serviceWorkerFile:"service-worker.js",
    cacheName:"eignungstest-trainer-v702-clean-stable-cache",
    icons:["icons/icon-180.png","icons/icon-192.png","icons/icon-512.png","icons/maskable-512.png"],
    status:"indexeddb-primary-active",
    note:"V7.0.2 Clean Stable: EDV-Multi-Choice, Route-Memory und Visual-Fixes stabil zusammengeführt, Legacy-Reste bereinigt und Cache/Version vereinheitlicht."
  });

  

  const SYSTEM_RUNTIME = Object.freeze({
    autosave:true,
    crashRecovery:true,
    duplicateProtection:true,
    cloudRetryQueue:true,
    offlineFirst:true,
    syncMode:"safe-sync-v702"
  });

const FRAMEWORK = {
    name:"Eignungstest-Trainer",
    version:"7.0.2",
    storageVersion:"2",
    offline:true,
    database:"IndexedDB primary + localStorage fallback",
    moduleContract:{
      generator:"function(level) -> question",
      question:"{cat,time,type,q,a,correct,ex,group,...extra}",
      visual:"renderVisual(type)",
      scoring:"correct boolean, open = false"
    },
    plannedBranches:[
      "interaktives EDV-Diagramm",
      "Blocktraining einzeln",
      "IndexedDB-Datenbank",
      "PWA-Offline-Cache",
      "Benutzerprofile",
      "Export & Druckansicht",
      "erweiterte Heatmap",
      "saubere Modulregistrierung",
      "zentrale Helper-Funktionen",
      "Visual IQ System",
      "SVG Visual Engine",
      "Blocktraining PRO",
      "Fehlertraining Vorbereitung",
      "Schwächenbasierte Sprints",
      "AI Evolution Engine",
      "Coach Datenbasis",
      "Error Intelligence",
      "Adaptive Recommendation Engine",
      "Cognitive Profile System",
      "Adaptive Difficulty Engine",
      "Dynamic Generator PRO",
      "Smart Mix Engine",
      "UX Mode Hub",
      "Question Bank Framework",
      "OCR Import Pipeline vorbereitet",
      "zentrale Aufgabenliste nach Kategorien",
      "Learning Memory Engine",
      "Full Simulation Framework",
      "AI Completion Layer",
      "Focus Guard",
      "Manual Training Override",
      "Feature Flags für Zukunftsfunktionen",
      "Stable Framework Baseline",
      "Offline Engine",
      "Manifest Template",
      "Service Worker aktiv mit sicherem Runtime Cache",
      "IndexedDB Full Activation",
      "Production Stable V7.0.2",
      "Highscore Engine vorbereitet",
      "Active Cloud Highscore Board",
      "Geräteübergreifende Bestenliste vorbereitet",
      "lokale Datenbank-Stores vorbereitet",
      "Migration aktiv und nicht-destruktiv"
    ],
    featureFlags:FEATURE_FLAGS,
    featureStatus:FEATURE_STATUS,
    pwaConfig:PWA_CONFIG
  };




/* StorageEngine, IndexedDBEngine, DatabaseBridge und Datenmigration. */

  const StorageEngine = {
    key: STORE_KEY,
    maxRecords:300,
    memory:null,
    mode:"indexedDB-primary",
    fallback:false,
    lastSync:"nicht gestartet",
    bootstrapFromLocalStorage(defaultValue=[]) {
      try {
        let raw = localStorage.getItem(this.key);
        if(!raw) {
          for(const legacyKey of LEGACY_STORE_KEYS) {
            const legacyRaw = localStorage.getItem(legacyKey);
            if(legacyRaw) { raw = legacyRaw; break; }
          }
        }
        if(!raw) return defaultValue;
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : defaultValue;
      } catch(error) {
        this.quarantine(error);
        return defaultValue;
      }
    },
    read(defaultValue=[]) {
      if(Array.isArray(this.memory)) return this.memory;
      this.memory = this.bootstrapFromLocalStorage(defaultValue).map(entry=>({ ...entry }));
      return this.memory;
    },
    write(value) {
      try {
        const normalized = Array.isArray(value) ? value.slice(-this.maxRecords) : [];
        this.memory = normalized;
        if(IndexedDBEngine.status.supported) {
          IndexedDBEngine.replaceAll("sessions", normalized).then(()=>{
            this.lastSync = new Date().toISOString();
            this.fallback = false;
          }).catch(error=>{
            this.fallback = true;
            this.quarantine(error);
            try { localStorage.setItem(this.key + "_fallback", JSON.stringify(normalized)); } catch(e) {}
          });
        } else {
          this.fallback = true;
          localStorage.setItem(this.key + "_fallback", JSON.stringify(normalized));
        }
        return true;
      } catch(error) {
        this.fallback = true;
        this.quarantine(error);
        return false;
      }
    },
    async loadFromIndexedDB() {
      try {
        if(!IndexedDBEngine.status.supported) throw new Error("IndexedDB nicht verfügbar");
        const records = await IndexedDBEngine.getAll("sessions");
        if(records && records.length) {
          this.memory = records.map(entry=>Guard.normalizeResult(entry)).slice(-this.maxRecords);
          this.lastSync = new Date().toISOString();
          return {ok:true, source:"IndexedDB", records:this.memory.length};
        }
        const legacy = this.bootstrapFromLocalStorage([]).map(entry=>DatabaseBridge.createResultRecord(entry)).slice(-this.maxRecords);
        this.memory = legacy;
        if(legacy.length) await IndexedDBEngine.replaceAll("sessions", legacy);
        this.lastSync = new Date().toISOString();
        return {ok:true, source:legacy.length?"localStorage-migrated":"empty", records:legacy.length};
      } catch(error) {
        this.fallback = true;
        this.memory = this.bootstrapFromLocalStorage([]);
        this.quarantine(error);
        return {ok:false, source:"fallback", records:this.memory.length, error:String(error && error.message ? error.message : error)};
      }
    },
    clear() {
      try {
        this.memory = [];
        if(IndexedDBEngine.status.supported) IndexedDBEngine.clearStore("sessions").catch(error=>this.quarantine(error));
        try { localStorage.removeItem(this.key + "_fallback"); } catch(e) {}
        return true;
      } catch(error) { this.quarantine(error); return false; }
    },
    quarantine(error) {
      try {
        localStorage.setItem(this.key + "_last_error", JSON.stringify({
          time:new Date().toISOString(),
          message:String(error && error.message ? error.message : error)
        }));
      } catch(e) {}
    },
    health() {
      const data = this.read([]);
      return {ok:Array.isArray(data), records:Array.isArray(data)?data.length:0, key:"IndexedDB:sessions", fallbackKey:this.key + "_fallback", legacyKeys:LEGACY_STORE_KEYS, engine:this.mode, fallback:this.fallback, lastSync:this.lastSync, maxRecords:this.maxRecords, schemaVersion:DATA_MODEL.version};
    }
  };


  const DATA_MODEL = {
    version:"7.0.2",
    stores:{
      results:{
        id:"auto",
        fields:["date","mode","title","score","total","percent","duration","avg","cats","exam","meta"]
      },
      attempts:{
        id:"auto",
        fields:["resultId","question","category","group","correct","time","answer","expected","errorType"]
      },
      profiles:{
        id:"profileId",
        fields:["name","createdAt","settings","stats"]
      },
      settings:{
        id:"key",
        fields:["value","updatedAt"]
      },
      analysis:{
        id:"auto",
        fields:["date","mode","profile","recommendations","stress","timeProfile"]
      },
      aiSignals:{
        id:"auto",
        fields:["date","mode","category","errorType","duration","pressure","correct"]
      },
      coachProfile:{
        id:"profileId",
        fields:["dataReadiness","weaknesses","recommendations","cognitiveProfile","updatedAt"]
      },
      adaptiveState:{
        id:"profileId",
        fields:["difficulty","mix","weaknessWeights","lastAdaptation","updatedAt"]
      },
      generatorMemory:{
        id:"auto",
        fields:["mode","group","difficulty","source","weight","createdAt"]
      },
      learningMemory:{
        id:"profileId",
        fields:["repeatErrors","openTasks","paceProfile","stability","updatedAt"]
      },
      simulationFramework:{
        id:"profileId",
        fields:["readiness","coverage","risk","nextSimulation","updatedAt"]
      },
      focusPreference:{
        id:"profileId",
        fields:["focus","group","mode","updatedAt"]
      },
      pwaSettings:{
        id:"profileId",
        fields:["installed","standalone","lastLaunch","cacheVersion","updateAvailable","updatedAt"]
      },
      importedQuestions:{
        id:"questionId",
        fields:["source","sourcePage","category","group","subtype","difficulty","question","answers","correct","explanation","tags","verified","createdAt"]
      },
      questionBankAudit:{
        id:"auto",
        fields:["source","imported","duplicates","invalid","reviewNeeded","createdAt"]
      }
    },
    migrationPath:["1.0","1.1","1.2","1.2.1","1.3","1.4","1.4.1","1.5","1.5.1","1.6","1.6.1","1.7","1.7.1","1.7.2","1.8","1.8.1","1.9","1.9.1","2.0","2.1","2.2","2.3","2.3.1","2.4","2.5","2.5.1","2.6","2.7","2.8","2.8.1","2.9","2.9.1","3.1","3.1.1","3.2","3.3","3.3.1","3.3.2","3.4","3.4.1","3.5","3.5.1","3.5.2","3.5.3","3.5.4","3.5.5","3.6.0","3.6.1","3.6.2","4.0.0","4.1.0","4.1.1","4.2.0","4.2.1","5.0.0","5.0.1","5.0.2","5.1.0","5.1.1","5.1.2","5.1.3","5.1.4","6.0.0","6.1.0","6.1.1","7.0.0","7.0.2"],
    futureEngine:"active",
    currentEngine:"IndexedDB-primary",
    migrationPolicy:{active:true,mode:"full-activation",source:"localStorage",target:"IndexedDB",requiresManualCleanup:false,noDataDeletion:true},
    indexedDbName:"EignungstestTrainerDB",
    indexedDbVersion:1
  };

  const MigrationPlanner = {
    phase:"full-activation",
    active:true,
    source:"localStorage",
    target:"IndexedDB",
    version:"7.0.2",
    rules:[
      "Keine automatische Datenlöschung",
      "IndexedDB ist Hauptspeicher",
      "localStorage dient nur als Fallback",
      "Migration läuft beim Start nicht-destruktiv",
      "Backup vor jeder echten Migration erforderlich"
    ],
    sourceKeys(){ return [STORE_KEY, ...LEGACY_STORE_KEYS].filter((v,i,a)=>a.indexOf(v)===i); },
    inspect(){
      const keys=this.sourceKeys();
      let found=[];
      try {
        found = keys.map(key=>{
          const raw=localStorage.getItem(key);
          let records=0, valid=false;
          if(raw){
            try { const parsed=JSON.parse(raw); valid=Array.isArray(parsed); records=valid?parsed.length:0; } catch(e){}
          }
          return {key, exists:!!raw, valid, records};
        }).filter(x=>x.exists);
      } catch(error) { found=[{key:"localStorage", exists:false, valid:false, records:0, error:String(error && error.message ? error.message : error)}]; }
      const totalRecords=found.reduce((s,x)=>s+(x.records||0),0);
      return {phase:this.phase, active:this.active, source:this.source, target:this.target, sourceKeys:keys, found, totalRecords, ready:IndexedDBEngine.status.ok && StorageEngine.health().ok, blockers:[]};
    },
    summary(){
      const status=this.inspect();
      const blockers=[];
      if(!IndexedDBEngine.status.supported) blockers.push("IndexedDB nicht verfügbar");
      if(!StorageEngine.health().ok) blockers.push("localStorage nicht stabil lesbar");
      if(!this.active) blockers.push("Migration sollte aktiv sein");
      status.blockers=blockers;
      status.ready=blockers.length===0;
      status.rules=this.rules;
      return status;
    }
  };

  const IndexedDBEngine = {
    name:"EignungstestTrainerDB",
    version:2,
    status:{supported:typeof indexedDB !== "undefined", initialized:false, ok:false, error:"", stores:[], lastTest:"nicht gestartet", mode:"primary"},
    storeNames:["profiles","sessions","highscores","analytics","questionBank","settings","aiSignals","backups","migrationLog"],
    open() {
      return new Promise((resolve,reject)=>{
        if(typeof indexedDB === "undefined") return reject(new Error("IndexedDB wird in dieser Umgebung nicht unterstützt."));
        const request = indexedDB.open(this.name, this.version);
        request.onupgradeneeded = event => {
          const db = event.target.result;
          this.storeNames.forEach(name=>{
            if(!db.objectStoreNames.contains(name)) {
              if(name === "settings") db.createObjectStore(name, {keyPath:"key"});
              else if(name === "profiles") db.createObjectStore(name, {keyPath:"profileId"});
              else if(name === "questionBank") db.createObjectStore(name, {keyPath:"questionId"});
              else db.createObjectStore(name, {keyPath:"id", autoIncrement:true});
            }
          });
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error || new Error("IndexedDB konnte nicht geöffnet werden."));
      });
    },
    async init() {
      this.status.supported = typeof indexedDB !== "undefined";
      if(!this.status.supported) {
        this.status.initialized=false; this.status.ok=false; this.status.error="IndexedDB nicht unterstützt"; return this.status;
      }
      try {
        const db = await this.open();
        this.status.stores = Array.from(db.objectStoreNames || []);
        db.close();
        await this.selfTest();
        this.status.initialized=true; this.status.ok=true; this.status.error="";
      } catch(error) {
        this.status.initialized=false; this.status.ok=false; this.status.error=String(error && error.message ? error.message : error);
      }
      return this.status;
    },
    async put(storeName, value) {
      const db = await this.open();
      return new Promise((resolve,reject)=>{
        const tx = db.transaction(storeName,"readwrite");
        tx.objectStore(storeName).put(value);
        tx.oncomplete = () => { db.close(); resolve(true); };
        tx.onerror = () => { const err=tx.error; db.close(); reject(err); };
      });
    },
    async get(storeName, key) {
      const db = await this.open();
      return new Promise((resolve,reject)=>{
        const tx = db.transaction(storeName,"readonly");
        const req = tx.objectStore(storeName).get(key);
        req.onsuccess = () => { db.close(); resolve(req.result || null); };
        req.onerror = () => { const err=req.error; db.close(); reject(err); };
      });
    },
    async getAll(storeName) {
      const db = await this.open();
      return new Promise((resolve,reject)=>{
        const tx = db.transaction(storeName,"readonly");
        const req = tx.objectStore(storeName).getAll();
        req.onsuccess = () => { db.close(); resolve(Array.isArray(req.result) ? req.result : []); };
        req.onerror = () => { const err=req.error; db.close(); reject(err); };
      });
    },
    async clearStore(storeName) {
      const db = await this.open();
      return new Promise((resolve,reject)=>{
        const tx = db.transaction(storeName,"readwrite");
        tx.objectStore(storeName).clear();
        tx.oncomplete = () => { db.close(); resolve(true); };
        tx.onerror = () => { const err=tx.error; db.close(); reject(err); };
      });
    },
    async replaceAll(storeName, records=[]) {
      const db = await this.open();
      return new Promise((resolve,reject)=>{
        const tx = db.transaction(storeName,"readwrite");
        const store = tx.objectStore(storeName);
        store.clear();
        (records || []).forEach(record=>store.put(record));
        tx.oncomplete = () => { db.close(); resolve(true); };
        tx.onerror = () => { const err=tx.error; db.close(); reject(err); };
      });
    },
    async selfTest() {
      const testRecord={key:"indexeddb-foundation-selftest", value:"ok", updatedAt:new Date().toISOString(), appVersion:APP_VERSION};
      await this.put("settings", testRecord);
      const readBack=await this.get("settings", testRecord.key);
      const ok=!!readBack && readBack.value === "ok";
      this.status.lastTest = ok ? "OK" : "Lesetest fehlgeschlagen";
      if(!ok) throw new Error("IndexedDB Schreib-/Lesetest fehlgeschlagen.");
      return ok;
    },
    diagnostics() {
      return {...this.status, name:this.name, version:this.version, expectedStores:this.storeNames};
    }
  };

  const DatabaseBridge = {
    engine:"IndexedDB-primary",
    indexedDbReady:typeof indexedDB !== "undefined",
    indexedDb:IndexedDBEngine,
    schema:DATA_MODEL,
    createResultRecord(entry) {
      const normalized = Guard.normalizeResult(entry);
      return {
        ...normalized,
        schemaVersion:DATA_MODEL.version,
        id:entry?.id || "run_" + Date.now() + "_" + Math.random().toString(36).slice(2,8),
        meta:{
          createdBy:FRAMEWORK.name,
          storageEngine:this.engine,
          indexedDbPrimary:IndexedDBEngine.status.ok,
          appVersion:APP_VERSION
        }
      };
    },
    exportPayload() {
      const results = StorageEngine.read([]).map(entry=>Guard.normalizeResult(entry));
      return {
        app:FRAMEWORK.name,
        version:FRAMEWORK.version,
        exportedAt:new Date().toISOString(),
        dataModel:DATA_MODEL,
        profile:typeof readProfile === "function" ? readProfile() : null,
        results,
        indexedDb:IndexedDBEngine.diagnostics(),
        migration:MigrationPlanner.summary()
      };
    },
    importPayload(payload) {
      try {
        if(!payload || !Array.isArray(payload.results)) return {ok:false,message:"Keine gültigen Ergebnisdaten gefunden."};
        const existing = StorageEngine.read([]);
        const merged = [...existing, ...payload.results.map(r=>this.createResultRecord(r))].slice(-StorageEngine.maxRecords);
        StorageEngine.write(merged);
        if(payload.profile && typeof writeProfile === "function") writeProfile(payload.profile);
        return {ok:true,message:`${payload.results.length} Einträge importiert.`};
      } catch(error) {
        StorageEngine.quarantine(error);
        return {ok:false,message:String(error && error.message ? error.message : error)};
      }
    },
    diagnostics() {
      const health = StorageEngine.health();
      const payload = this.exportPayload();
      const approxSize = JSON.stringify(payload).length;
      return {
        engine:this.engine,
        indexedDbReady:this.indexedDbReady,
        schemaVersion:DATA_MODEL.version,
        records:health.records,
        key:health.key,
        approxSizeBytes:approxSize,
        approxSizeKb:Math.round(approxSize/1024*10)/10,
        maxRecords:StorageEngine.maxRecords,
        ok:health.ok,
        indexedDb:IndexedDBEngine.diagnostics(),
        migration:MigrationPlanner.summary()
      };
    }
  };






/* Guard, Analytics, SessionTracker, ErrorMemory, Coach/Adaptive/Dynamic/Learning/Highscore Engines. */
  const Guard = {
    safeNumber(value, fallback=0) { return Number.isFinite(Number(value)) ? Number(value) : fallback; },
    validQuestion(q) {
      if(!q || typeof q !== "object") return false;
      if(typeof q.q !== "string") return false;
      if(!Array.isArray(q.a) || q.a.length < 1) return false;
      if(q.type === "routeMemory") return Array.isArray(q.routeStreets) && q.routeStreets.length >= 6;
      if(q.type === "edvmulti") return Array.isArray(q.edvCorrectIds) && q.edvCorrectIds.length > 0;
      if(q.type === "edvcovered") return true;
      return typeof q.correct === "number" && q.correct >= 0 && q.correct < q.a.length;
    },
    repairQuestion(q) {
      if(this.validQuestion(q)) return q;
      return makeMC("System",20,"Diese Aufgabe konnte nicht geladen werden. Fahre mit „Weiter“ fort.",["Weiter"],0,"Die Aufgabe wurde durch einen sicheren Platzhalter ersetzt.");
    },
    normalizeResult(entry) {
      return {
        date:entry?.date || new Date().toISOString(),
        mode:entry?.mode || "unknown",
        title:entry?.title || "Unbekannter Modus",
        score:this.safeNumber(entry?.score,0),
        total:Math.max(1,this.safeNumber(entry?.total,1)),
        percent:Math.max(0,Math.min(100,this.safeNumber(entry?.percent,0))),
        duration:entry?.duration || "nicht erfasst",
        avg:this.safeNumber(entry?.avg,0),
        cats:entry?.cats && typeof entry.cats === "object" ? entry.cats : {},
        exam:entry?.exam && typeof entry.exam === "object" ? entry.exam : {},
        aiSession:entry?.aiSession && typeof entry.aiSession === "object" ? entry.aiSession : null,
        schemaVersion:entry?.schemaVersion || DATA_MODEL.version,
        id:entry?.id || null,
        meta:entry?.meta && typeof entry.meta === "object" ? entry.meta : {},
        appVersion:entry?.appVersion || APP_VERSION
      };
    }
  };


  const AnalyticsEngine = {
    buildFromHistory(history, modeTitle="Aktueller Test") {
      const items=(history||[]).filter(Boolean);
      const total=items.length||1;
      const wrong=items.filter(x=>!x.correct);
      const correct=items.filter(x=>x.correct);
      const open=items.filter(x=>x.givenIndex===null || x.skipped || x.timeout);
      const avg=items.reduce((s,x)=>s+(x.duration||0),0)/total;
      const fastWrong=wrong.filter(x=>(x.duration||0)<2500).length;
      const timeoutWrong=wrong.filter(x=>x.timeout || x.givenIndex===null).length;
      const cats={};
      items.forEach(x=>{
        const key=x.group||x.cat||"Sonstiges";
        cats[key] ||= {total:0,correct:0,wrong:0,time:0,open:0};
        cats[key].total++;
        cats[key].time += x.duration||0;
        if(x.correct) cats[key].correct++; else cats[key].wrong++;
        if(x.givenIndex===null || x.skipped || x.timeout) cats[key].open++;
      });
      Object.values(cats).forEach(c=>{c.percent=Math.round((c.correct/Math.max(1,c.total))*100); c.avgMs=Math.round(c.time/Math.max(1,c.total));});
      const timeProfile=items.map((x,i)=>({i:i+1,ms:x.duration||0,correct:!!x.correct,cat:x.group||x.cat||"Sonstiges"}));
      const stress={fastWrong,timeoutWrong,openCount:open.length,avgMs:Math.round(avg),risk:(fastWrong>=3||timeoutWrong>=3||open.length>=3)?"hoch":(fastWrong>=1||timeoutWrong>=1)?"mittel":"niedrig"};
      return {modeTitle,total,correct:correct.length,wrong:wrong.length,percent:Math.round((correct.length/total)*100),cats,stress,timeProfile,recommendations:this.recommend(cats,stress)};
    },
    recommend(cats,stress) {
      const rec=[];
      const sorted=Object.entries(cats).sort((a,b)=>a[1].percent-b[1].percent || b[1].wrong-a[1].wrong);
      if(sorted.length && sorted[0][1].percent<75) rec.push({title:`Schwerpunkt: ${sorted[0][0]}`,text:`Trefferquote ${sorted[0][1].percent}%. Trainiere diesen Bereich gezielt.`});
      const slow=Object.entries(cats).sort((a,b)=>b[1].avgMs-a[1].avgMs)[0];
      if(slow && slow[1].avgMs>12000) rec.push({title:`Zeitfresser: ${slow[0]}`,text:`Ø ${Math.round(slow[1].avgMs/1000)} Sekunden. Setze Zeitlimit und überspringe Blockierer schneller.`});
      if(stress.fastWrong>=2) rec.push({title:"Schnellklick-Risiko",text:"Mehrere Fehler entstanden sehr schnell. Regel komplett lesen, dann klicken."});
      if(stress.timeoutWrong>=2) rec.push({title:"Zeitmanagement",text:"Mehrere Aufgaben blieben offen oder liefen ab. Schwierige Aufgaben markieren und weitergehen."});
      if(stress.risk==="niedrig" && (!sorted.length || sorted[0][1].percent>=80)) rec.push({title:"Stabiler Lauf",text:"Leistung wirkt kontrolliert. Erhöhe Prüfungsmodus oder Schwierigkeit."});
      if(!rec.length) rec.push({title:"Solide Basis",text:"Wiederhole den Modus und achte auf konstante Bearbeitungszeiten."});
      return rec.slice(0,4);
    },
    buildFromResults(results) {
      const data=(results||[]).filter(Boolean);
      if(!data.length) return {empty:true};
      const avg=Math.round(data.reduce((s,r)=>s+(r.percent||0),0)/data.length);
      const best=data.reduce((a,b)=>(b.percent||0)>(a.percent||0)?b:a,data[0]);
      const modes={};
      data.forEach(r=>{const k=r.title||r.mode; modes[k] ||= {runs:0,avg:0,sum:0,best:0}; modes[k].runs++; modes[k].sum+=r.percent||0; modes[k].best=Math.max(modes[k].best,r.percent||0);});
      Object.values(modes).forEach(m=>m.avg=Math.round(m.sum/Math.max(1,m.runs)));
      return {empty:false,runs:data.length,avg,best,modes,recent:data.slice(-10)};
    }
  };

  const SessionTracker = {
    classifyAttempt(h) {
      if(!h) return "unknown";
      if(h.correct) return "correct";
      if(h.timeout) return "timeout";
      if(h.givenIndex === null || h.skipped) return "open";
      const allowedMs = Math.max(1, Number(h.allowed || 0)) * 1000;
      if((h.duration || 0) < 2500) return "fastWrong";
      if(allowedMs > 1000 && (h.duration || 0) > allowedMs * 0.85) return "pressureWrong";
      if(String(h.group||"").includes("Konzentration")) return "attentionError";
      if(String(h.group||"").includes("Visual")) return "patternError";
      if(String(h.group||"").includes("Mathe")) return "calculationError";
      return "wrong";
    },
    buildSession(history, mode, title) {
      const items=(history||[]).filter(Boolean);
      const total=Math.max(1,items.length);
      const errors={};
      const groups={};
      items.forEach(h=>{
        const group=h.group||groupFor(h.cat)||"Sonstiges";
        const err=this.classifyAttempt(h);
        groups[group] ||= {total:0,correct:0,wrong:0,time:0,open:0,pressure:0};
        groups[group].total++;
        if(h.correct) groups[group].correct++; else groups[group].wrong++;
        groups[group].time += h.duration||0;
        if(h.givenIndex===null || h.skipped || h.timeout) groups[group].open++;
        if(["timeout","pressureWrong"].includes(err)) groups[group].pressure++;
        if(err!=="correct") errors[err]=(errors[err]||0)+1;
      });
      Object.values(groups).forEach(g=>{g.percent=Math.round(g.correct/Math.max(1,g.total)*100); g.avgMs=Math.round(g.time/Math.max(1,g.total));});
      return {
        version:"7.0.2",
        mode,
        title,
        total,
        correct:items.filter(h=>h.correct).length,
        percent:Math.round(items.filter(h=>h.correct).length/total*100),
        groups,
        errors,
        pressureErrors:(errors.timeout||0)+(errors.pressureWrong||0),
        openCount:(errors.open||0),
        fastWrong:errors.fastWrong||0,
        createdAt:new Date().toISOString()
      };
    }
  };

  const ErrorMemory = {
    aggregate(results) {
      const memory={byGroup:{}, byError:{}, totalAttempts:0, totalWrong:0};
      (results||[]).forEach(r=>{
        const session=r.aiSession;
        if(session && session.groups) {
          memory.totalAttempts += session.total||0;
          memory.totalWrong += Math.max(0,(session.total||0)-(session.correct||0));
          Object.entries(session.groups).forEach(([group,g])=>{
            memory.byGroup[group] ||= {total:0,correct:0,wrong:0,time:0,pressure:0,open:0};
            memory.byGroup[group].total += g.total||0;
            memory.byGroup[group].correct += g.correct||0;
            memory.byGroup[group].wrong += g.wrong||0;
            memory.byGroup[group].time += (g.avgMs||0) * (g.total||0);
            memory.byGroup[group].pressure += g.pressure||0;
            memory.byGroup[group].open += g.open||0;
          });
          Object.entries(session.errors||{}).forEach(([k,v])=>memory.byError[k]=(memory.byError[k]||0)+v);
        } else {
          Object.entries(r.cats||{}).forEach(([group,g])=>{
            memory.byGroup[group] ||= {total:0,correct:0,wrong:0,time:0,pressure:0,open:0};
            memory.byGroup[group].total += g.n||0;
            memory.byGroup[group].correct += g.r||0;
            memory.byGroup[group].wrong += Math.max(0,(g.n||0)-(g.r||0));
            memory.byGroup[group].time += g.t||0;
            memory.totalAttempts += g.n||0;
            memory.totalWrong += Math.max(0,(g.n||0)-(g.r||0));
          });
        }
      });
      Object.values(memory.byGroup).forEach(g=>{g.percent=Math.round(g.correct/Math.max(1,g.total)*100); g.avgMs=Math.round(g.time/Math.max(1,g.total));});
      return memory;
    }
  };

  const DataReadiness = {
    requiredSimulations:3,
    evaluate(results) {
      const sims=(results||[]).filter(r=>r.mode==="ctcLohr" && (r.total||0)>=90);
      const simulationCount=sims.length;
      const percent=Math.min(100, Math.round(simulationCount/this.requiredSimulations*100));
      const remaining=Math.max(0,this.requiredSimulations-simulationCount);
      const status=percent>=100?"aktiv":"sammelt";
      return {percent,simulationCount,required:this.requiredSimulations,remaining,status,ready:percent>=100};
    }
  };

  const WeaknessProfile = {
    build(memory) {
      return Object.entries(memory.byGroup||{}).map(([group,g])=>{
        const wrongRate=1-(g.correct/Math.max(1,g.total));
        const pressureRate=(g.pressure||0)/Math.max(1,g.total);
        const openRate=(g.open||0)/Math.max(1,g.total);
        const score=Math.round((wrongRate*70 + pressureRate*20 + openRate*10)*100)/100;
        return {group,total:g.total,percent:g.percent,wrong:g.wrong,avgMs:g.avgMs,pressure:g.pressure||0,score};
      }).filter(x=>x.total>0).sort((a,b)=>b.score-a.score || a.percent-b.percent).slice(0,5);
    }
  };

  const CognitiveProfile = {
    build(memory, readiness) {
      const g=memory.byGroup||{};
      const scoreFor=(names)=>{
        const items=Object.entries(g).filter(([k])=>names.some(n=>k.includes(n)));
        const total=items.reduce((s,[,v])=>s+(v.total||0),0);
        if(!total) return readiness.ready ? 50 : 0;
        return Math.round(items.reduce((s,[,v])=>s+(v.correct||0),0)/total*100);
      };
      const precision=memory.totalAttempts?Math.round((1-memory.totalWrong/Math.max(1,memory.totalAttempts))*100):0;
      const pressureErrors=(memory.byError.timeout||0)+(memory.byError.pressureWrong||0)+(Object.values(g).reduce((s,v)=>s+(v.pressure||0),0));
      const pressure=Math.max(0, Math.min(100, 100-Math.round(pressureErrors/Math.max(1,memory.totalAttempts)*220)));
      const profile={
        "Rechengeschwindigkeit":scoreFor(["Mathe"]),
        "Mustererkennung":scoreFor(["Logik","Visual"]),
        "Technisches Denken":scoreFor(["Mechanik","IT/FISI","Visual"]),
        "Konzentration":scoreFor(["Konzentration"]),
        "Präzision":precision,
        "Druckstabilität":memory.totalAttempts?pressure:0
      };
      return Object.entries(profile).map(([name,score])=>({name,score,label:this.label(score,readiness)}));
    },
    label(score,readiness){ if(!readiness.ready && score===0) return "sammelt"; if(score>=85) return "sehr hoch"; if(score>=70) return "hoch"; if(score>=55) return "mittel"; if(score>=40) return "aufbauen"; return "kritisch"; }
  };

  const TrainingFocusEngine = {
    options:{
      auto:{key:"auto",label:"KI Auto",group:null,mode:"ctc",hint:"KI darf den Schwerpunkt frei empfehlen."},
      math:{key:"math",label:"Mathe",group:"Mathe",mode:"mathSprint",hint:"Manueller Schwerpunkt: Kopfrechnen, Prozent, Bruch und Dreisatz."},
      mental:{key:"mental",label:"Kopfrechnen",group:"Mathe",mode:"math",hint:"Fokus auf Mathe-Grundtraining und schnelles Rechnen."},
      concentration:{key:"concentration",label:"Konzentration",group:"Konzentration",mode:"concentrationSprint",hint:"Fokus auf Aufmerksamkeit und Scanneraufgaben."},
      visual:{key:"visual",label:"Visual IQ",group:"Visual IQ",mode:"visualIQSprint",hint:"Fokus auf Würfel, Matrizen, Zahnräder und Technikbilder."},
      it:{key:"it",label:"IT/FISI",group:"IT/FISI",mode:"itSprint",hint:"Fokus auf Netzwerk, Hardware, Security und FISI."}
    },
    read(){
      try{ const key=localStorage.getItem(FOCUS_KEY)||"auto"; return this.options[key]?key:"auto"; }
      catch(e){ return "auto"; }
    },
    write(key){
      const safe=this.options[key]?key:"auto";
      try{ localStorage.setItem(FOCUS_KEY,safe); }catch(e){}
      return safe;
    },
    current(){ return this.options[this.read()] || this.options.auto; },
    isManual(){ return this.current().key !== "auto"; },
    render(){
      const el=$("focusControls"); if(!el) return;
      const active=this.read();
      const buttons=Object.values(this.options).map(o=>`<button class="${active===o.key?"active":""}" onclick="App.setTrainingFocus('${o.key}')">${escHTML(o.label)}</button>`).join("");
      const cur=this.current();
      el.innerHTML=`${buttons}<div class="focus-note"><b>KI-Fokus:</b> ${escHTML(cur.hint)} Normale Trainingsmodi bleiben strikt bei ihrem gewählten Bereich. Die KI darf nur innerhalb dieses Rahmens justieren.</div>`;
    }
  };

  const RecommendationEngine = {
    modeForGroup(group) {
      if(!group) return "ctcLohr";
      if(group.includes("Mathe")) return "mathSprint";
      if(group.includes("Konzentration")) return "concentrationSprint";
      if(group.includes("Visual") || group.includes("Mechanik") || group.includes("Raum")) return "visualIQSprint";
      if(group.includes("IT")) return "itSprint";
      if(group.includes("Allgemein")) return "knowledgeSprint";
      if(group.includes("Logik")) return "logicSprint";
      return "errorTrainingPrep";
    },
    build(readiness, weaknesses, memory) {
      const focus = TrainingFocusEngine.current();
      if(focus.key !== "auto") {
        const suffix = readiness.ready ? "Die KI wertet Schwächen weiter im Hintergrund aus." : `Datenbasis wird weiter gesammelt: noch ${readiness.remaining} Simulation${readiness.remaining===1?"":"en"}.`;
        return {title:`Fokus: ${focus.label}`,text:`Manueller Trainingsfokus aktiv. ${suffix}`,mode:focus.mode,manualFocus:true,focusGroup:focus.group};
      }
      if(!readiness.ready) return {title:"KI sammelt Daten",text:`Noch ${readiness.remaining} vollständige Simulation${readiness.remaining===1?"":"en"} nötig. Blocktraining zählt als Zusatzdaten, ersetzt aber die Diagnose nicht.`,mode:"ctcLohr"};
      const top=weaknesses[0];
      if(top) return {title:`Fokus: ${top.group}`,text:`Aktuelle Trefferquote ${top.percent}%. Empfehlung basiert auf ${top.total} Aufgaben und globalem Fehlerprofil.`,mode:this.modeForGroup(top.group)};
      if((memory.byError.fastWrong||0)>=3) return {title:"Tempo kontrollieren",text:"Mehrere schnelle Fehler erkannt. Starte Konzentration Sprint mit ruhigerem Vorgehen.",mode:"concentrationSprint"};
      return {title:"Stabilisierung",text:"Datenbasis ist aktiv. Nächster sinnvoller Lauf: Simulation unter Prüfungsbedingungen.",mode:"ctcLohr"};
    }
  };

  const AdaptiveDifficultyEngine = {
    levelFromPercent(percent) {
      const p = Number(percent)||0;
      if(p >= 85) return "hard";
      if(p >= 65) return "medium";
      return "easy";
    },
    build(readiness, weaknesses, memory) {
      const total = Math.max(1, memory.totalAttempts || 0);
      const precision = Math.round((1 - (memory.totalWrong || 0) / total) * 100);
      const pressureErrors = (memory.byError.timeout || 0) + (memory.byError.pressureWrong || 0) + Object.values(memory.byGroup||{}).reduce((s,g)=>s+(g.pressure||0),0);
      const pressureRate = pressureErrors / total;
      const topWeak = weaknesses[0] || null;
      let globalLevel = this.levelFromPercent(precision);
      if(!readiness.ready) globalLevel = "medium";
      if(topWeak && topWeak.percent < 45) globalLevel = "easy";
      if(precision >= 82 && pressureRate < .12 && readiness.ready) globalLevel = "hard";
      const timeFactor = pressureRate > .22 ? 1.15 : pressureRate < .08 && precision >= 75 ? .90 : 1;
      const focusGroup = topWeak ? topWeak.group : null;
      return {
        globalLevel,
        precision,
        pressureRate:Math.round(pressureRate*100),
        timeFactor,
        focusGroup,
        active:readiness.ready,
        label:readiness.ready ? (globalLevel==="hard"?"fordernd":globalLevel==="easy"?"stabilisierend":"realistisch") : "sammelt Daten"
      };
    },
    levelForGroup(group, baseLevel, coach) {
      if(!coach || !coach.adaptive || !coach.adaptive.active) return baseLevel;
      const weak = (coach.weaknesses||[]).find(w=>w.group===group);
      if(weak && weak.percent < 50) return "easy";
      if(weak && weak.percent < 70) return "medium";
      return coach.adaptive.globalLevel || baseLevel;
    },
    timeFor(q, coach) {
      if(!q || !coach || !coach.adaptive || !coach.adaptive.active) return q?.time || 25;
      const factor = coach.adaptive.timeFactor || 1;
      return Math.max(10, Math.round((q.time || 25) * factor));
    }
  };

  const DynamicGeneratorEngine = {
    allGroups:["Mathe","Logik","Allgemeinwissen","Englisch","IT/FISI","Konzentration","Mechanik","Raumdenken","Visual IQ","Gedächtnis"],
    buildMix(coach, mode="ctc") {
      const mix=[];
      const focus=TrainingFocusEngine.current();
      if(focus.key !== "auto" && focus.group) mix.push({group:focus.group,weight:160,source:"manualFocus"});
      const weaknessGroups=(coach?.weaknesses||[]).slice(0,4).map(w=>w.group);
      weaknessGroups.forEach((group,i)=>{
        if(focus.key !== "auto" && group === focus.group) return;
        mix.push({group,weight:focus.key !== "auto" ? Math.max(8,18-i*4) : Math.max(18,34-i*6),source:"weakness"});
      });
      if((coach?.memory?.byError?.fastWrong||0)>=3 && !(focus.key!=="auto" && focus.group!=="Konzentration")) mix.push({group:"Konzentration",weight:focus.key!=="auto"?10:24,source:"fastWrong"});
      if((coach?.memory?.byError?.patternError||0)>=3 && !(focus.key!=="auto" && focus.group!=="Visual IQ")) mix.push({group:"Visual IQ",weight:focus.key!=="auto"?10:24,source:"pattern"});
      if((coach?.memory?.byError?.calculationError||0)>=3) mix.push({group:"Mathe",weight:focus.group==="Mathe"?32:24,source:"calculation"});
      this.allGroups.forEach(group=>{ if(!mix.some(x=>x.group===group)) mix.push({group,weight:focus.key !== "auto" ? 2 : 8,source:"coverage"}); });
      return mix.filter(x=>x.group).slice(0,12);
    },
    weightedPick(mix) {
      const list=(mix&&mix.length?mix:this.allGroups.map(group=>({group,weight:1,source:"fallback"})));
      const total=list.reduce((s,x)=>s+(x.weight||1),0);
      let r=Math.random()*total;
      for(const item of list){ r -= item.weight||1; if(r<=0) return item; }
      return list[list.length-1];
    },
    buildQuestion(index,total,coach) {
      const warmup = index < Math.min(12,total*.18);
      const focus=TrainingFocusEngine.current();
      const mix=this.buildMix(coach,"ctc");
      const picked = focus.key !== "auto" && focus.group
        ? (warmup ? {group:focus.group, source:"manualFocusWarmup", weight:160} : this.weightedPick(mix))
        : (warmup ? {group:this.allGroups[index % this.allGroups.length], source:"coverage", weight:10} : this.weightedPick(mix));
      const baseLevel = warmup ? "medium" : (coach?.adaptive?.globalLevel || "medium");
      const level = AdaptiveDifficultyEngine.levelForGroup(picked.group, baseLevel, coach);
      const gen=generatorByCat(picked.group);
      const q=gen(level);
      q.group=picked.group;
      q.aiSource=picked.source;
      q.aiLevel=level;
      q.aiAdaptive=true;
      q.time=AdaptiveDifficultyEngine.timeFor(q, coach);
      q.signature=stableSignature(q)+"|ai|"+picked.group+"|"+picked.source+"|"+index;
      return Guard.repairQuestion(q);
    },
    explainMix(mix) {
      return (mix||[]).slice(0,5).map(x=>`${x.group}: ${x.weight}`).join(" · ");
    }
  };

  const LearningMemoryEngine = {
    build(results, memory) {
      const repeatErrors = Object.entries(memory.byGroup||{}).map(([group,g])=>({
        group,
        wrong:g.wrong||0,
        open:g.open||0,
        pressure:g.pressure||0,
        percent:g.percent||0,
        avgMs:g.avgMs||0,
        priority:Math.round(((g.wrong||0)*2 + (g.open||0)*1.4 + (g.pressure||0)*1.2) * 10) / 10
      })).filter(x=>x.wrong || x.open || x.pressure).sort((a,b)=>b.priority-a.priority).slice(0,6);
      const recent=(results||[]).slice(-6);
      const trend=recent.length ? Math.round(recent.reduce((s,r)=>s+(r.percent||0),0)/recent.length) : 0;
      const last=recent[recent.length-1]||null;
      const previous=recent.length>1 ? recent[recent.length-2] : null;
      const direction=last&&previous ? (last.percent>previous.percent?"steigend":last.percent<previous.percent?"fallend":"stabil") : "sammelt";
      const openTasks=repeatErrors.reduce((s,x)=>s+(x.open||0),0);
      const paceRisk=Object.values(memory.byGroup||{}).some(g=>(g.avgMs||0)>15000) ? "hoch" : Object.values(memory.byGroup||{}).some(g=>(g.avgMs||0)>10000) ? "mittel" : "niedrig";
      return {repeatErrors,trend,direction,openTasks,paceRisk,totalRuns:(results||[]).length};
    },
    summary(learning) {
      if(!learning || !learning.repeatErrors || !learning.repeatErrors.length) return "Keine wiederkehrenden Fehler erkannt.";
      const top=learning.repeatErrors[0];
      return `${top.group}: ${top.wrong} Fehler, ${top.open} offen, Priorität ${top.priority}`;
    }
  };

  const FullSimulationEngine = {
    build(results, coach, learning) {
      const sims=(results||[]).filter(r=>r.mode==="ctcLohr" && (r.total||0)>=90);
      const lastSim=sims[sims.length-1]||null;
      const bestSim=sims.length ? sims.reduce((a,b)=>(b.percent||0)>(a.percent||0)?b:a,sims[0]) : null;
      const groups=["Allgemeinwissen","Mathe","Logik","Konzentration","IT/FISI","Visual IQ","Mechanik","Gedächtnis"];
      const covered=groups.filter(g=>coach.memory.byGroup && coach.memory.byGroup[g] && coach.memory.byGroup[g].total>0);
      const coverage=Math.round(covered.length/groups.length*100);
      const riskScore=(coach.weaknesses||[]).slice(0,3).reduce((s,w)=>s+(100-(w.percent||0)),0);
      const risk=riskScore>130 || learning.paceRisk==="hoch" ? "hoch" : riskScore>75 || learning.paceRisk==="mittel" ? "mittel" : "niedrig";
      const ready=coach.readiness.ready && coverage>=60 && risk!=="hoch";
      const next=ready ? "Simulation unter Prüfungsbedingungen wiederholen" : (coach.recommendation?.title || "gezieltes Blocktraining");
      return {simulationCount:sims.length,lastSim,bestSim,coverage,covered,missing:groups.filter(g=>!covered.includes(g)),risk,ready,next};
    },
    label(sim) {
      if(!sim) return "sammelt Daten";
      if(sim.ready) return "prüfungsnah bereit";
      if(sim.risk==="hoch") return "noch stabilisieren";
      return "im Aufbau";
    }
  };



  const CloudHighscoreEngine = {
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
    headers(extra={}) {
      const c=this.config();
      const base = {"apikey":c.anonKey,"Authorization":"Bearer "+c.anonKey,"Content-Type":"application/json"};
      return {...base, ...extra};
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
        app_version:APP_VERSION
      };
    },
    async submit(result) {
      if(!this.isConfigured()) return {ok:false,reason:"Cloud Highscore nicht verbunden",missing:this.missingFields()};
      const payload=this.cleanRecord(result);
      if(!payload.total || !Number.isFinite(payload.percent)) return {ok:false,reason:"Ungültiger Highscore-Datensatz"};
      const response=await fetch(this.endpoint(), {method:"POST", headers:this.headers({"Prefer":"return=minimal"}), body:JSON.stringify(payload)});
      if(!response.ok) {
        const text = await response.text().catch(()=>"");
        throw new Error("Cloud Highscore Upload fehlgeschlagen: "+response.status+(text?" · "+text.slice(0,180):""));
      }
      return {ok:true,record:payload};
    },
    async fetchTop(period="all") {
      if(!this.isConfigured()) return {ok:false,reason:"Cloud Highscore nicht verbunden",missing:this.missingFields(),items:[]};
      const c=this.config();
      const filters=[
        "select=player_name,mode,title,percent,score,total,duration,rank,created_at,app_version",
        "class_code=eq."+encodeURIComponent(c.classCode),
        "order=percent.desc,score.desc,created_at.asc",
        "limit="+encodeURIComponent(c.limit)
      ];
      const start=this.periodStart(period);
      if(start) filters.push("created_at=gte."+encodeURIComponent(start));
      const response=await fetch(this.endpoint("?"+filters.join("&")), {method:"GET", headers:this.headers({"Cache-Control":"no-cache"})});
      if(!response.ok) {
        const text = await response.text().catch(()=>"");
        throw new Error("Cloud Highscore Abruf fehlgeschlagen: "+response.status+(text?" · "+text.slice(0,180):""));
      }
      const items=await response.json();
      return {ok:true,period,items:Array.isArray(items)?items:[]};
    },
    async fetchBoards() {
      if(!this.isConfigured()) return {ok:false,boards:{},reason:"Cloud Highscore nicht verbunden",missing:this.missingFields()};
      const boards={};
      for(const p of this.periods) {
        try { boards[p.key]=(await this.fetchTop(p.key)).items || []; }
        catch(error) { boards[p.key]={error:String(error && error.message ? error.message : error)}; }
      }
      return {ok:true,boards};
    },
    renderRows(rows, limit=5) {
      if(rows && rows.error) return `<div class="small">${escHTML(rows.error)}</div>`;
      const list=Array.isArray(rows) ? rows.slice(0,limit) : [];
      if(!list.length) return `<div class="small">Noch keine Einträge in diesem Zeitraum.</div>`;
      return `<div class="cloud-rank-list">${list.map((r,i)=>`<div class="cloud-rank-row"><span class="cloud-rank-pos">#${i+1}</span><span class="cloud-rank-main"><b>${escHTML(r.player_name||"Gast")}</b><small>${escHTML(r.title||r.mode||"Test")}</small></span><span class="cloud-rank-score">${Number(r.percent)||0}%<small>${escHTML(r.rank||this.rankLabel(r.percent))}</small></span></div>`).join("")}</div>`;
    },
    renderShell() {
      const configured=this.isConfigured();
      const miss=this.missingFields();
      return `<div class="premium-card cloud-highscore-card" id="cloudHighscoreCard"><span class="coach-badge">Cloud Highscore</span><div class="coach-action">${configured?"Online-Ranking wird geladen":"Cloud nicht verbunden"}</div><div class="small">${configured?"Tägliche, wöchentliche und monatliche Ranglisten werden mit Supabase synchronisiert.":"Keine Fake-Daten. Fehlende Konfiguration: "+escHTML(miss.join(", "))+"."}</div></div>`;
    },
    async refreshDashboard() {
      const el=$("cloudHighscoreCard");
      if(!el) return;
      if(!this.isConfigured()) {
        const miss=this.missingFields();
        el.innerHTML=`<span class="coach-badge">Cloud Highscore · aktivierbar</span><div class="coach-action">Cloud nicht verbunden</div><div class="small">Keine Fake-Rangliste. Trage echte Supabase URL und anon key in <code>data/cloud-config.js</code> ein. Fehlend: ${escHTML(miss.join(", "))}.</div>`;
        return;
      }
      el.innerHTML=`<span class="coach-badge">Cloud Highscore · Online</span><div class="coach-action">Ranking wird geladen...</div><div class="small">Supabase wird live abgefragt.</div>`;
      try {
        const res=await this.fetchBoards();
        const boards=res.boards||{};
        const total=Object.values(boards).reduce((s,rows)=>s+(Array.isArray(rows)?rows.length:0),0);
        el.innerHTML=`<span class="coach-badge">Cloud Highscore · Online</span><div class="coach-action">Ranking aktiv</div><div class="cloud-board-grid">${this.periods.map(p=>`<section class="cloud-board"><h4>${escHTML(p.label)}</h4>${this.renderRows(boards[p.key], p.key==="all"?8:5)}</section>`).join("")}</div><div class="small">${total?"Live aus Supabase geladen":"Noch keine Cloud-Highscores gespeichert"} · Klasse: ${escHTML(this.config().classCode)} · Tabelle: ${escHTML(this.config().table)}</div>`;
      } catch(error) {
        el.innerHTML=`<span class="coach-badge">Cloud Highscore · Fehler</span><div class="coach-action">Verbindung fehlgeschlagen</div><div class="small">${escHTML(error && error.message ? error.message : error)}</div>`;
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
        const qs=`?select=player_name,percent,created_at&class_code=eq.${encodeURIComponent(c.classCode)}&order=created_at.desc&limit=1`;
        const response=await fetch(this.endpoint(qs), {method:"GET", headers:this.headers({"Cache-Control":"no-cache"})});
        const text=await response.text().catch(()=>"");
        if(!response.ok) {
          return {...d, online:false, readOk:false, writeReady:false, status:"supabase-error", httpStatus:response.status, error:text.slice(0,240) || response.statusText};
        }
        let items=[];
        try { items=JSON.parse(text || "[]"); } catch(_) { items=[]; }
        return {...d, online:true, readOk:true, writeReady:true, status:"online", httpStatus:response.status, sampleCount:Array.isArray(items)?items.length:0, error:""};
      } catch(error) {
        return {...d, online:false, readOk:false, writeReady:false, status:"network-error", error:String(error && error.message ? error.message : error)};
      }
    }
  };

  const HighscoreEngine = {
    maxItems:10,
    build(results=[]) {
      const list=(results||[]).map(r=>Guard.normalizeResult(r)).filter(r=>Number.isFinite(Number(r.percent))).sort((a,b)=>(b.percent||0)-(a.percent||0) || (b.score||0)-(a.score||0));
      const bestOverall=list[0]||null;
      const bestSimulation=list.filter(r=>r.mode==="ctcLohr")[0]||null;
      const byMode={};
      list.forEach(r=>{ const key=r.mode||r.title||"unknown"; if(!byMode[key]) byMode[key]=r; });
      return {total:list.length,bestOverall,bestSimulation,top:list.slice(0,this.maxItems),byMode,updatedAt:new Date().toISOString(),source:"local"};
    },
    rankLabel(percent) {
      const p=Number(percent)||0;
      if(p>=85) return "Diamond";
      if(p>=70) return "Platin";
      if(p>=55) return "Gold";
      if(p>=40) return "Silber";
      return "Bronze";
    },
    toRecord(result) {
      const r=Guard.normalizeResult(result||{});
      const p=readProfile(); return {date:r.date,mode:r.mode,title:r.title,percent:r.percent,score:r.score,total:r.total,duration:r.duration,rank:this.rankLabel(r.percent),player_name:p.name||"Gast",player_id:p.player_id,source:"session",createdAt:new Date().toISOString()};
    },
    async persistFromResults(results=[]) {
      if(!IndexedDBEngine.status.supported) return {ok:false,reason:"IndexedDB nicht verfügbar"};
      try {
        const hs=this.build(results).top.map(r=>this.toRecord(r));
        await IndexedDBEngine.replaceAll("highscores", hs);
        return {ok:true,count:hs.length};
      } catch(error) {
        return {ok:false,reason:String(error && error.message ? error.message : error)};
      }
    },
    renderDashboard(results=[]) {
      const hs=this.build(results);
      const top=hs.top.slice(0,3);
      const local = !top.length
        ? `<div class="premium-card"><span class="coach-badge">Lokaler Highscore</span><div class="coach-action">Noch kein Rekord</div><div class="small">Starte einen Test. Danach erscheint hier deine lokale Bestenliste live im Dashboard.</div></div>`
        : `<div class="premium-card"><span class="coach-badge">Lokaler Highscore</span><div class="coach-action">Bestwert: ${hs.bestOverall.percent}%</div><div class="ai-list">${top.map((r,i)=>`<div>${i+1}. <b>${escHTML(r.title||r.mode)}</b> · ${r.percent}% · ${escHTML(this.rankLabel(r.percent))}</div>`).join("")}</div><div class="small">Lokale Sicherheits-Bestenliste auf diesem Gerät.</div></div>`;
      setTimeout(()=>CloudHighscoreEngine.refreshDashboard(),0);
      return CloudHighscoreEngine.renderShell() + local;
    }
  };

  const CoachEngine = {
    build(results) {
      const normalized=(results||[]).map(r=>Guard.normalizeResult(r));
      const readiness=DataReadiness.evaluate(normalized);
      const memory=ErrorMemory.aggregate(normalized);
      const weaknesses=WeaknessProfile.build(memory);
      const cognitive=CognitiveProfile.build(memory,readiness);
      const recommendation=RecommendationEngine.build(readiness,weaknesses,memory);
      const adaptive=AdaptiveDifficultyEngine.build(readiness,weaknesses,memory);
      const baseCoach={readiness,memory,weaknesses,cognitive,recommendation,adaptive};
      const dynamicMix=DynamicGeneratorEngine.buildMix(baseCoach);
      const learning=LearningMemoryEngine.build(normalized,memory);
      const simulation=FullSimulationEngine.build(normalized,{...baseCoach,dynamicMix},learning);
      return {version:"7.0.2",readiness,memory,weaknesses,cognitive,recommendation,adaptive,dynamicMix,learning,simulation,focus:TrainingFocusEngine.current(),updatedAt:new Date().toISOString()};
    },
    renderDashboard(coach) {
      const r=coach.readiness;
      const weak=coach.weaknesses.slice(0,3).map((w,i)=>`<div>${i+1}. <b>${escHTML(w.group)}</b> · ${w.percent}% · ${w.wrong} Fehler</div>`).join("") || `<div>Noch keine belastbaren Schwächen erkannt.</div>`;
      const cog=coach.cognitive.slice(0,4).map(x=>`<div class="ai-profile-meter"><span>${escHTML(x.name)}</span><i style="width:${Math.max(8,x.score)}%"></i><b>${x.score?x.score+"%":"–"}</b></div>`).join("");
      return `<div class="premium-card ai-card">
        <span class="coach-badge">AI Stable Core V7.0.2</span>
        <div class="coach-action">KI Datenbasis: ${r.percent}%</div>
        <div class="ai-readiness-bar"><div class="ai-readiness-fill" style="width:${r.percent}%"></div></div>
        <div class="small ${r.ready?"ai-status-ready":"ai-status-locked"}">${r.ready?"Coach aktiv. Schwächenprofil wird verwertet.":`Daten werden gesammelt. Noch ${r.remaining} vollständige Simulation${r.remaining===1?"":"en"} nötig.`}</div>
        <div class="ai-grid"><div class="ai-chip"><b>Simulationen</b>${r.simulationCount}/${r.required}</div><div class="ai-chip"><b>Versuche</b>${coach.memory.totalAttempts}</div><div class="ai-chip"><b>Fehler</b>${coach.memory.totalWrong}</div></div>
        <div class="ai-list"><b>Schwächenprofil</b>${weak}</div>
      </div>
      <div class="premium-card ai-card">
        <span class="coach-badge">Cognitive Profile</span>
        <div class="coach-action">Denkprofil</div>
        <div class="small">${r.ready?"Aus Simulationen und Trainingsläufen berechnet.":"Vorläufig, bis 3 Simulationen abgeschlossen sind."}</div>
        ${cog}
      </div>
      <div class="premium-card ai-card ai-adaptive-card">
        <span class="coach-badge">Adaptive Engine</span>
        <div class="coach-action">Schwierigkeit: ${coach.adaptive.label}</div>
        <span class="ai-difficulty-pill">Level ${coach.adaptive.globalLevel}</span>
        <div class="ai-grid"><div class="ai-chip"><b>Präzision</b>${coach.adaptive.precision}%</div><div class="ai-chip"><b>Druckfehler</b>${coach.adaptive.pressureRate}%</div><div class="ai-chip"><b>Fokus</b>${escHTML(coach.adaptive.focusGroup || "ausgeglichen")}</div></div>
        <div class="ai-engine-note">V2.4 passt Schwierigkeit und Zeitfenster datenbasiert an, sobald die KI-Datenbasis aktiv ist.</div>
      </div>
      <div class="premium-card ai-card ai-adaptive-card">
        <span class="coach-badge">Dynamic Generator PRO</span>
        <div class="coach-action">Aufgabenmix</div>
        ${(coach.dynamicMix||[]).slice(0,5).map(x=>`<div class="ai-mix-row"><span>${escHTML(x.group)}</span><i style="width:${Math.max(8,Math.min(100,x.weight*2))}%"></i><b>${x.weight}</b></div>`).join("")}
        <div class="ai-engine-note">V2.5 gewichtet neue Aufgaben nach Schwächen, Fehlerarten und Grundabdeckung.</div>
      </div>
      <div class="premium-card ai-card ai-final-card">
        <span class="coach-badge">Learning Memory V2.6</span>
        <div class="coach-action">Wiederholungsmuster</div>
        <div class="ai-final-grid"><div class="ai-chip"><b>Trend</b>${escHTML(coach.learning.direction)}</div><div class="ai-chip"><b>Offene Aufgaben</b>${coach.learning.openTasks}</div><div class="ai-chip"><b>Tempo-Risiko</b>${escHTML(coach.learning.paceRisk)}</div></div>
        <div class="ai-list"><div>${escHTML(LearningMemoryEngine.summary(coach.learning))}</div></div>
      </div>
      <div class="premium-card ai-card ai-final-card">
        <span class="coach-badge">Full Simulation V2.7</span>
        <div class="coach-action">${escHTML(FullSimulationEngine.label(coach.simulation))}</div>
        <div class="ai-readiness-bar"><div class="ai-readiness-fill" style="width:${coach.simulation.coverage}%"></div></div>
        <div class="ai-final-grid"><div class="ai-chip"><b>Abdeckung</b>${coach.simulation.coverage}%</div><div class="ai-chip"><b>Risiko</b><span class="${coach.simulation.risk==='hoch'?'ai-risk-high':coach.simulation.risk==='mittel'?'ai-risk-mid':'ai-risk-low'}">${escHTML(coach.simulation.risk)}</span></div><div class="ai-chip"><b>Simulationen</b>${coach.simulation.simulationCount}</div></div>
        <div class="ai-engine-note">Nächster sinnvoller Schritt: ${escHTML(coach.simulation.next)}</div>
      </div>`;
    }
  };






/* Question Bank Schema, Quality Engine, Modusverträge, Blocklimits und Blockinfo. */
  const QUESTION_BANK_SCHEMA = {
    version:"1.0",
    required:["id","source","category","group","question","answers","correct","explanation","tags"],
    groups:["Mathe","Logik","Konzentration","Visual IQ","Mechanik","Raumdenken","IT/FISI","Allgemeinwissen","Englisch","Gedächtnis"],
    importStatuses:["raw","needsReview","verified","disabled"],
    note:"V2.8 vorbereitet für spätere OCR/Buchaufgaben. Die App kann später aus einer zentralen Aufgabenliste filtern, statt Generatoren hart zu verdrahten."
  };

  const QUESTION_BANK = {
    items:[],
    sources:[],
    lastImport:null
  };

  const QuestionBankEngine = {
    normalize(raw={}, source="manual") {
      const id = raw.id || ("qb_" + String(source).replace(/[^a-z0-9]/gi,"_").toLowerCase() + "_" + Date.now() + "_" + Math.random().toString(36).slice(2,7));
      const group = raw.group || groupFor(raw.category || raw.cat || "");
      const answers = Array.isArray(raw.answers) ? raw.answers : Array.isArray(raw.a) ? raw.a : [];
      const correct = Number.isInteger(raw.correct) ? raw.correct : Number.isInteger(raw.correctIndex) ? raw.correctIndex : 0;
      return {
        id,
        source,
        sourcePage:raw.sourcePage || raw.page || "",
        category:raw.category || raw.cat || group,
        group,
        subtype:raw.subtype || raw.type || "mc",
        difficulty:raw.difficulty || "medium",
        question:raw.question || raw.q || "",
        answers,
        correct,
        explanation:raw.explanation || raw.ex || "",
        tags:Array.isArray(raw.tags) ? raw.tags : [],
        verified:!!raw.verified,
        status:raw.status || "needsReview",
        createdAt:raw.createdAt || new Date().toISOString()
      };
    },
    validate(item) {
      const q=this.normalize(item,item?.source||"audit");
      const issues=[];
      if(!q.question || q.question.length<3) issues.push("question missing");
      if(!Array.isArray(q.answers) || q.answers.length<2) issues.push("answers missing");
      if(q.correct<0 || q.correct>=q.answers.length) issues.push("correct index invalid");
      if(!QUESTION_BANK_SCHEMA.groups.includes(q.group)) issues.push("unknown group: "+q.group);
      return {ok:issues.length===0, issues, item:q};
    },
    filter({group,category,difficulty,tag,verifiedOnly=false}={}) {
      return QUESTION_BANK.items.filter(item=>{
        if(group && item.group!==group) return false;
        if(category && item.category!==category) return false;
        if(difficulty && item.difficulty!==difficulty) return false;
        if(tag && !(item.tags||[]).includes(tag)) return false;
        if(verifiedOnly && !item.verified) return false;
        return true;
      });
    },
    stats() {
      const byGroup={};
      QUESTION_BANK.items.forEach(item=>{byGroup[item.group]=(byGroup[item.group]||0)+1;});
      return {total:QUESTION_BANK.items.length, byGroup, schema:QUESTION_BANK_SCHEMA.version, ready:true};
    },
    importBatch(rawItems=[], source="ocr-import") {
      if(!FEATURE_FLAGS.questionBankRuntimeImport) {
        const validation = rawItems.map(x=>this.validate(this.normalize(x,source)));
        QUESTION_BANK.lastImport={source, imported:0, invalid:validation.filter(v=>!v.ok).length, reviewed:validation.length, blocked:true, reason:"Question Bank Runtime Import ist in V7.0.2 bewusst deaktiviert.", createdAt:new Date().toISOString()};
        return QUESTION_BANK.lastImport;
      }
      const normalized=rawItems.map(x=>this.normalize(x,source));
      const valid=normalized.map(x=>this.validate(x));
      const accepted=valid.filter(v=>v.ok).map(v=>v.item);
      QUESTION_BANK.items.push(...accepted);
      QUESTION_BANK.lastImport={source, imported:accepted.length, invalid:valid.length-accepted.length, blocked:false, createdAt:new Date().toISOString()};
      return QUESTION_BANK.lastImport;
    },
    blueprint() {
      return {
        schema:QUESTION_BANK_SCHEMA,
        example:{
          source:"Buch OCR Seite 12",
          sourcePage:"12",
          category:"Prozentrechnung",
          group:"Mathe",
          subtype:"mc",
          difficulty:"medium",
          question:"25% von 240 sind?",
          answers:["40","50","60","80"],
          correct:2,
          explanation:"240 · 0,25 = 60",
          tags:["mathe","prozent","kopfrechnen"],
          verified:false
        }
      };
    }
  };

  const QualityEngine = {
    sampleMemory() {
      return [
        {time:"08:00",task:"A",place:"P1"},{time:"09:00",task:"B",place:"P2"},
        {time:"10:00",task:"C",place:"P3"},{time:"11:00",task:"D",place:"P4"},
        {time:"12:00",task:"E",place:"P5"},{time:"13:00",task:"F",place:"P6"},
        {time:"14:00",task:"G",place:"P7"},{time:"15:00",task:"H",place:"P8"}
      ];
    },
    validateModes() {
      const oldMode = state.selectedMode;
      const oldMemory = state.memoryItems;
      const results = [];
      Object.keys(MODES).forEach(mode=>{
        try {
          state.selectedMode = mode;
          state.memoryItems = this.sampleMemory();
          const quiz = buildQuiz();
          const invalid = quiz.filter(q=>!Guard.validQuestion(q)).length;
          results.push({mode,count:quiz.length,invalid});
        } catch(error) {
          results.push({mode,count:0,invalid:1,error:String(error && error.message ? error.message : error)});
        }
      });
      state.selectedMode = oldMode;
      state.memoryItems = oldMemory;
      return results;
    },
    validateSimulation() {
      const oldMode = state.selectedMode;
      state.selectedMode = "ctcLohr";
      const quiz = buildQuiz();
      state.selectedMode = oldMode;
      const blocks = {};
      quiz.forEach(q=>{ blocks[q.block || "none"] = (blocks[q.block || "none"] || 0) + 1; });
      return {count:quiz.length, blocks};
    },
    validateModeContracts() {
      const oldMode = state.selectedMode;
      const oldMemory = state.memoryItems;
      const issues = [];
      Object.keys(MODE_CONTRACTS || {}).forEach(mode=>{
        const contract = MODE_CONTRACTS[mode];
        if(!MODES[mode]) return;
        try {
          state.selectedMode = mode;
          state.memoryItems = this.sampleMemory();
          const quiz = buildQuiz();
          if(contract.adaptive && quiz.length < 1) issues.push(`${mode}: adaptiver Modus erzeugt keine Startaufgabe`);
          if(contract.requiredCount && quiz.length !== contract.requiredCount) issues.push(`${mode}: erwartet ${contract.requiredCount}, erhalten ${quiz.length}`);
          if(contract.allowedTypes) {
            const badTypes = [...new Set(quiz.filter(q=>!contract.allowedTypes.includes(q.type)).map(q=>q.type))];
            if(badTypes.length) issues.push(`${mode}: unerlaubte Typen ${badTypes.join(", ")}`);
          }
          if(contract.allowedGroups) {
            const badGroups = [...new Set(quiz.filter(q=>!contract.allowedGroups.includes(q.group||groupFor(q.cat))).map(q=>q.group||groupFor(q.cat)))];
            if(badGroups.length) issues.push(`${mode}: unerlaubte Gruppen ${badGroups.join(", ")}`);
          }
        } catch(error) {
          issues.push(`${mode}: Vertragsprüfung fehlgeschlagen ${String(error && error.message ? error.message : error)}`);
        }
      });
      state.selectedMode = oldMode;
      state.memoryItems = oldMemory;
      return issues;
    },
    validateQuestionBank() {
      try {
        const sample=QuestionBankEngine.normalize(QuestionBankEngine.blueprint().example,"selftest");
        const validation=QuestionBankEngine.validate(sample);
        const blocked=QuestionBankEngine.importBatch([QuestionBankEngine.blueprint().example],"selftest-blocked");
        const stats=QuestionBankEngine.stats();
        return {ok:validation.ok && stats.ready && blocked.blocked===true && stats.total===0, schema:QUESTION_BANK_SCHEMA.version, total:stats.total, sampleGroup:sample.group, runtimeImport:"disabled"};
      } catch(error) {
        return {ok:false,error:String(error && error.message ? error.message : error)};
      }
    },
    validatePWA() {
      try {
        const ok = !!PWA_CONFIG.appName && !!PWA_CONFIG.shortName && PWA_CONFIG.display === "standalone" && !!PWA_CONFIG.manifestFile && FEATURE_FLAGS.pwaManifestTemplate === true && FEATURE_FLAGS.pwaServiceWorkerRuntime === true;
        return {ok, manifest:PWA_CONFIG.manifestFile, serviceWorker:PWA_CONFIG.serviceWorkerFile, cacheRuntime:FEATURE_FLAGS.pwaOfflineCache, install:FEATURE_FLAGS.pwaInstall, status:PWA_CONFIG.status};
      } catch(error) {
        return {ok:false,error:String(error && error.message ? error.message : error)};
      }
    },
    validateIndexedDB() {
      try {
        const diag = IndexedDBEngine.diagnostics();
        const expected = IndexedDBEngine.storeNames.length;
        const storeCount = Array.isArray(diag.stores) ? diag.stores.length : 0;
        const prepared = FEATURE_FLAGS.indexedDbMigration === true && DATA_MODEL.indexedDbName === IndexedDBEngine.name;
        const ok = prepared && (diag.supported ? (diag.ok && storeCount >= expected) : true);
        return {ok, supported:diag.supported, initialized:diag.initialized, storeCount, expectedStores:expected, lastTest:diag.lastTest, mode:diag.mode, error:diag.error || ""};
      } catch(error) {
        return {ok:false,error:String(error && error.message ? error.message : error)};
      }
    },
    validateMigrationPrep() {
      try {
        const plan = typeof MigrationPlanner !== "undefined" && MigrationPlanner.summary ? MigrationPlanner.summary() : null;
        const ok = !!plan && plan.active === true && DATA_MODEL.migrationPolicy && DATA_MODEL.migrationPolicy.active === true;
        return {
          ok,
          phase: plan ? plan.phase : "unknown",
          active: plan ? plan.active : false,
          source: plan ? plan.source : "localStorage",
          target: plan ? plan.target : "IndexedDB",
          totalRecords: plan ? plan.totalRecords : 0,
          ready: plan ? plan.ready : false,
          blockers: plan ? plan.blockers : ["MigrationPlanner fehlt"]
        };
      } catch(error) {
        return {ok:false,error:String(error && error.message ? error.message : error)};
      }
    },
    validateHighscore() {
      try {
        const sample=[{mode:"math",title:"Mathe",score:18,total:20,percent:90,duration:"1 Min.",cats:{}},{mode:"ctcLohr",title:"Simulation",score:70,total:93,percent:75,duration:"10 Min.",cats:{}}];
        const hs=HighscoreEngine.build(sample);
        return {ok:hs.total===2 && hs.bestOverall.percent===90 && hs.bestSimulation.percent===75, total:hs.total, best:hs.bestOverall.percent};
      } catch(error) { return {ok:false,error:String(error && error.message ? error.message : error)}; }
    },
    validateCloudHighscore() {
      try {
        const d = CloudHighscoreEngine.diagnostics();
        return {ok:d.configured, configured:d.configured, enabled:d.enabled, provider:d.provider, table:d.table, classCode:d.classCode, urlSet:d.urlSet, keySet:d.keySet, configLoaded:d.configLoaded, missing:d.missing};
      } catch(error) {
        return {ok:false, configured:false, error:String(error && error.message ? error.message : error)};
      }
    },
    validateAIEngines() {
      try {
        const fakeResults=[
          {mode:"ctcLohr",title:"Simulation",total:93,score:60,percent:65,cats:{Mathe:{n:9,r:5,t:1000}},aiSession:{total:93,correct:60,groups:{Mathe:{total:9,correct:5,wrong:4,avgMs:10000,pressure:2,open:1}},errors:{pressureWrong:2}}},
          {mode:"ctcLohr",title:"Simulation",total:93,score:70,percent:75,cats:{"Visual IQ":{n:10,r:4,t:1000}},aiSession:{total:93,correct:70,groups:{"Visual IQ":{total:10,correct:4,wrong:6,avgMs:12000,pressure:3,open:0}},errors:{patternError:6}}},
          {mode:"ctcLohr",title:"Simulation",total:93,score:75,percent:81,cats:{Konzentration:{n:15,r:8,t:1000}},aiSession:{total:93,correct:75,groups:{Konzentration:{total:15,correct:8,wrong:7,avgMs:13000,pressure:4,open:2}},errors:{timeout:2,pressureWrong:4}}}
        ];
        const coach=CoachEngine.build(fakeResults);
        const aiQuestion = DynamicGeneratorEngine.buildQuestion(5,100,coach);
        const oldFocus=TrainingFocusEngine.read();
        TrainingFocusEngine.write("math");
        const focusCoach=CoachEngine.build(fakeResults);
        const focusQuestions=Array.from({length:20},(_,i)=>DynamicGeneratorEngine.buildQuestion(i,100,focusCoach));
        const mathCount=focusQuestions.filter(q=>(q.group||groupFor(q.cat))==="Mathe").length;
        TrainingFocusEngine.write(oldFocus);
        const ok=!!coach && coach.readiness.ready && coach.readiness.percent===100 && coach.weaknesses.length>0 && coach.cognitive.length>=4 && !!coach.recommendation.mode && !!coach.adaptive && Array.isArray(coach.dynamicMix) && coach.dynamicMix.length>0 && Guard.validQuestion(aiQuestion) && mathCount>=14;
        return {ok, readiness:coach.readiness.percent, weaknesses:coach.weaknesses.length, cognitive:coach.cognitive.length, adaptive:coach.adaptive.globalLevel, mix:coach.dynamicMix.length, focusGuard:`Mathe ${mathCount}/20`, learning:coach.learning.repeatErrors.length, simulation:coach.simulation.coverage};
      } catch(error) {
        return {ok:false,error:String(error && error.message ? error.message : error)};
      }
    },
    summary() {
      const modes = this.validateModes();
      const storage = StorageEngine.health();
      const simulation = this.validateSimulation();
      const contracts = this.validateModeContracts();
      const ai = this.validateAIEngines();
      const questionBank = this.validateQuestionBank();
      const pwa = this.validatePWA();
      const highscore = this.validateHighscore();
      const cloudHighscore = this.validateCloudHighscore();
      const indexedDb = this.validateIndexedDB();
      const migration = this.validateMigrationPrep();
      return {framework:FRAMEWORK.name + " " + FRAMEWORK.version, modes, storage, simulation, contracts, ai, questionBank, pwa, highscore, cloudHighscore, indexedDb, migration, ok:modes.every(m=>m.invalid===0) && simulation.count===93 && contracts.length===0 && ai.ok && questionBank.ok && pwa.ok && indexedDb.ok && migration.ok};
    }
  };


const MODES = {
    math:{title:"1. Mathe 1x1 Training",amount:40,memory:false,instant:true,desc:"Kopfrechnen, Division, Prozent, Brüche, Dreisatz und Grundrechnen.",tags:["Kopfrechnen","Brüche","Prozent"]},
    logic:{title:"2. Logik Übungen",amount:20,memory:false,instant:true,desc:"Zahlenreihen, Matrizen, Symbolfolgen, Mechanik und Aussagenlogik.",tags:["20 Aufgaben","Matrizen","Zahnräder"]},
    jogging:{title:"3. Eignungstest Jogging",amount:20,memory:false,instant:true,desc:"Kurzer gemischter Warm-up-Test für jeden Tag.",tags:["20 Aufgaben","gemischt","warm"]},
    bps:{title:"4. Basisprofil+ Niveau",amount:100,memory:true,instant:false,desc:"Berufspsychologischer-Service-Stil, aber schwerer als reine Beispielaufgaben.",tags:["100 Aufgaben","Gedächtnis","Basisprofil+"]},
    ctc:{title:"5. Eignungstest Elite",amount:100,memory:true,instant:false,desc:"Harter Elite-Modus mit Zeitdruck, Gedächtnis, IT, Logik, Mathematik, Konzentration und angepasster Trainingssteuerung.",tags:["Elite","Zeitdruck","Leistungsprofil"]},
    general:{title:"6. Allgemeinwissen",amount:40,memory:false,instant:true,desc:"Politik, Geschichte, Geografie, Wissenschaft, Technik, Alltag und Wirtschaft.",tags:["Wissen","Welt","Deutschland"]},
    english:{title:"7. Englisch",amount:40,memory:false,instant:true,desc:"Vokabeln, Übersetzen, Grammatik, Lückensätze und Berufsenglisch.",tags:["Vokabeln","Grammatik","Schule"]},
    it:{title:"8. IT & FISI Grundlagen",amount:50,memory:false,instant:true,desc:"Netzwerk, Hardware, Betriebssysteme, Server, Security und FISI-Logik.",tags:["FISI","Netzwerk","Server"]},
    concentrationPro:{title:"9. Konzentration PRO 2.0",amount:45,memory:false,instant:true,desc:"Scanner, Blicksprung, Tabellenvergleich, Zeichenfehler, Zahlenscan und visuelle Genauigkeit unter Zeitdruck.",tags:["Scanner","Blicksprung","Zeitdruck"]},
    routeMemoryMode:{title:"10. Route Memory Spezial",amount:8,memory:false,instant:true,desc:"Busroute ansehen, Straßen merken und danach die Straßen in der richtigen Reihenfolge antippen.",tags:["Gedächtnisroute","Animation","Reihenfolge"]},
    visualIQ:{title:"11. Visual IQ System",amount:36,memory:false,instant:true,desc:"Zahnräder, Spiegelungen, Würfelrotation, Faltfiguren, Matrizen, Stromlaufpläne, Mechanik und technisches Verständnis.",tags:["Visual IQ","SVG","Technik"]},
    mathSprint:{title:"12. Blocktraining · Mathe Sprint",amount:20,memory:false,instant:true,desc:"Kurze, schnelle Mathe-Einheit mit Kopfrechnen, Prozent, Dreisatz, Bruch und Textaufgaben.",tags:["Blocktraining","Mathe","Sprint"]},
    logicSprint:{title:"13. Blocktraining · Logik Sprint",amount:20,memory:false,instant:true,desc:"Zahlenreihen, Matrizen, Aussagenlogik, Symbolfolgen und Wortlogik als kompakter Sprint.",tags:["Blocktraining","Logik","Muster"]},
    concentrationSprint:{title:"14. Blocktraining · Konzentration Sprint",amount:25,memory:false,instant:true,desc:"Scanner, Tabellenvergleich, Zeichenfehler, Zahlenscan und Blicksprung unter Zeitdruck.",tags:["Blocktraining","Konzentration","Tempo"]},
    visualIQSprint:{title:"15. Blocktraining · Visual IQ Sprint",amount:20,memory:false,instant:true,desc:"Gezielte Visual-IQ-Einheit mit Zahnrädern, Spiegelung, Würfel, Faltung, Strom und Mechanik.",tags:["Blocktraining","Visual IQ","Technik"]},
    itSprint:{title:"16. Blocktraining · IT/FISI Sprint",amount:20,memory:false,instant:true,desc:"Netzwerk, Hardware, Security, Server, Windows, Linux und FISI-Grundlagen kompakt.",tags:["Blocktraining","IT/FISI","Netzwerk"]},
    knowledgeSprint:{title:"17. Blocktraining · Allgemeinwissen Sprint",amount:25,memory:false,instant:true,desc:"Kurzer Wissensblock mit Politik, Geografie, Geschichte, Alltag, Technik und Wirtschaft.",tags:["Blocktraining","Wissen","Zeitdruck"]},
    techniqueSprint:{title:"18. Blocktraining · Technik Sprint",amount:20,memory:false,instant:true,desc:"Technisches Verständnis, Mechanik, Hebel, Rollen, Stromlaufpläne, Zahnräder und räumliches Denken.",tags:["Blocktraining","Technik","Mechanik"]},
    errorTrainingPrep:{title:"19. Fehlertraining · Vorbereitung",amount:20,memory:false,instant:true,desc:"Gemischter Trainingsmodus als Vorbereitung für späteres echtes Schwächenlernen und Fehlertraining.",tags:["Fehlertraining","Vorbereitung","V1.9"]},
    ctcLohr:{title:"20. Eignungstest-Simulation",amount:93,memory:false,instant:false,desc:"5 Blöcke mit Startseiten, Blocktimern, fairer Wertung und EDV-Großschema mit 11 Fehlern.",tags:["Simulation","5 Blöcke","EDV 11 Fehler"]}
  };

  const MODE_CONTRACTS = {
    routeMemoryMode:{allowedTypes:["routeMemory"], allowedGroups:["Gedächtnis"]},
    visualIQ:{allowedTypes:["visualIQ"], allowedGroups:["Visual IQ","Mechanik"]},
    mathSprint:{requiredCount:20, allowedGroups:["Mathe"]},
    logicSprint:{requiredCount:20, allowedGroups:["Logik"]},
    concentrationSprint:{requiredCount:25, allowedGroups:["Konzentration"]},
    visualIQSprint:{requiredCount:20, allowedTypes:["visualIQ"], allowedGroups:["Visual IQ","Mechanik"]},
    itSprint:{requiredCount:20, allowedGroups:["IT/FISI"]},
    knowledgeSprint:{requiredCount:25, allowedGroups:["Allgemeinwissen"]},
    techniqueSprint:{requiredCount:20, allowedGroups:["Visual IQ","Mechanik","Raumdenken"]},
    errorTrainingPrep:{requiredCount:20},
    ctcLohr:{requiredCount:93},
    ctc:{adaptive:true}
  };

  const CTC_BLOCK_LIMITS = {
    "1. Allgemeinwissen": 8*60,
    "2. Mathe": 5*60,
    "3. Logik": 9*60,
    "4. Konzentration": 8*60,
    "5. EDV Kenntnisse": 15*60
  };

  const BLOCK_INFO = {
    "1. Allgemeinwissen": {title:"Block 1: Allgemeinwissen", text:"40 kurze Wissensfragen. Nicht extrem schwer, aber unter Zeitdruck.", rules:["Politik, Geografie, Geschichte, Alltag, Technik","Sichere Antworten sofort holen","Unsichere Fragen markieren und weitergehen"]},
    "2. Mathe": {title:"Block 2: Mathe-Sprint", text:"9 Kopf- und Textaufgaben mit sehr knapper Blockzeit.", rules:["Leichte Aufgaben zuerst sicher lösen","Zeitfallen überspringen","Nicht zu lange rechnen"]},
    "3. Logik": {title:"Block 3: Logik", text:"Zahlenreihen, Matrizen, Formen, Aussagenlogik und Meinung/Tatsache.", rules:["Muster suchen","Nur sichere Folgerungen wählen","Bei Formen die Reihenfolge prüfen"]},
    "4. Konzentration": {title:"Block 4: Konzentration", text:"Aufmerksamkeit unter Druck. Nicht vorne festbeißen.", rules:["p/q/b-Aufgaben systematisch scannen","Von leicht zu schwer arbeiten","Markieren statt mental festfahren"]},
    "5. EDV Kenntnisse": {title:"Block 5: EDV-Kenntnisse / Logikdiagramm", text:"Großes EDV-Schema mit 11 Fehlern.", rules:["Geschichte lesen","Schemaeinträge gegen die Story prüfen","Fehlerart beachten: Logik, Pfeilrichtung oder Inhalt"]}
  };





/* Question Factory, Group Mapping, EDV-Schema, Generatoren, Route- und EDV-Fragenaufbau. */
  function makeMC(cat,time,q,a,correct,ex,type="mc",extra={}) {
    return {cat,time,type,q,a,correct,ex,group:groupFor(cat),signature:"",...extra};
  }
  function shuffleWithCorrect(arr, idx) {
    const correct = arr[idx], opts = shuffle(arr);
    return {opts, correct: opts.indexOf(correct)};
  }
  function optionsFromCorrect(correct,spread=10,decimals=false,unit="") {
    const c=norm(correct), num=Number(String(correct).replace(",","."));
    const vals=new Set([c+unit]); let tries=0;
    while(vals.size<4 && tries<500) {
      tries++;
      let off=rand(1,spread)*(Math.random()<.5?-1:1);
      let v=num+off; if(decimals) v=Math.round(v*10)/10;
      if(v>=0 && String(v)!==String(num)) vals.add(norm(v)+unit);
    }
    return shuffle([...vals]);
  }
  function groupFor(cat) {
    cat=String(cat||"");
    if(cat.includes("Englisch") || cat.includes("Berufsenglisch") || cat.includes("IT-Englisch")) return "Englisch";
    if(cat.includes("IT") || cat.includes("FISI") || cat.includes("Server") || cat.includes("Linux") || cat.includes("Windows") || cat.includes("Security") || cat.includes("Netzwerk") || cat.includes("Hardware") || cat.includes("Betriebssystem") || cat.includes("EDV")) return "IT/FISI";
    if(cat.includes("Gedächtnis") || cat.includes("Route")) return "Gedächtnis";
    if(["Allgemeinwissen","Politik","Geografie","Europa","Wissenschaft","Technik","Geschichte","Natur","Wirtschaft","Alltag","Deutschland"].includes(cat)) return "Allgemeinwissen";
    if(cat.includes("Visual IQ") || cat.includes("Spiegel") || cat.includes("Würfel") || cat.includes("Falt") || cat.includes("Stromlauf") || cat.includes("Technisches Verständnis")) return "Visual IQ";
    if(cat.includes("Mechanik")) return "Mechanik";
    if(cat.includes("Tabellen") || cat.includes("Aufmerksamkeit") || cat.includes("Konzentration") || cat.includes("Code")) return "Konzentration";
    if(cat.includes("Räum")) return "Raumdenken";
    if(cat.includes("Mathe") || cat.includes("Rechnen") || cat.includes("Prozent") || cat.includes("Bruch") || cat.includes("Dreisatz") || cat.includes("Geometrie") || cat.includes("Textrechnen") || cat.includes("Grundrechnen") || cat.includes("Dezimal") || cat.includes("Division")) return "Mathe";
    return "Logik";
  }
  function stableSignature(q) {
    return [q.cat,q.q,q.type,JSON.stringify(q.grid||q.series||q.symbols||q.visual||q.tableRows||q.schemaRows||q.fraction||q.fractionRule||q.routeStreets||q.signatureSeed||{}),String(q.correct),JSON.stringify(q.a)].join("|");
  }



  const generalPool = [
    ["Allgemeinwissen","Wie viele Bundesländer hat Deutschland?",["14","15","16","17"],2,"Deutschland hat 16 Bundesländer."],
    ["Geografie","Was ist die Hauptstadt von Australien?",["Sydney","Melbourne","Canberra","Perth"],2,"Canberra ist die Hauptstadt Australiens."],
    ["Geografie","Wie heißt das frühere Persien heute?",["Iran","Irak","Syrien","Jordanien"],0,"Das frühere Persien heißt heute Iran."],
    ["Politik","Wie heißt die Staatsform Deutschlands?",["parlamentarische Demokratie","absolute Monarchie","Militärdiktatur","Einparteienstaat"],0,"Deutschland ist eine parlamentarische Demokratie."],
    ["Politik","Was bedeutet Demokratie?",["Herrschaft des Volkes","Herrschaft einer Firma","Herrschaft des Militärs","Herrschaft einer Person"],0,"Demokratie bedeutet Herrschaft des Volkes."],
    ["Politik","Was bedeutet Gewaltenteilung?",["Aufteilung in Legislative, Exekutive, Judikative","Aufteilung der Polizei","Aufteilung von Steuern","Aufteilung von Bundesländern"],0,"Gewaltenteilung trennt Gesetzgebung, Ausführung und Rechtsprechung."],
    ["Geschichte","In welchem Jahr fiel die Berliner Mauer?",["1987","1988","1989","1990"],2,"Die Berliner Mauer fiel 1989."],
    ["Geschichte","Wann wurde die BRD gegründet?",["1945","1949","1961","1990"],1,"Die Bundesrepublik Deutschland wurde 1949 gegründet."],
    ["Geschichte","Wann begann der Zweite Weltkrieg?",["1939","1914","1945","1961"],0,"Der Zweite Weltkrieg begann 1939."],
    ["Geschichte","Wann war die deutsche Wiedervereinigung?",["1990","1989","1949","1961"],0,"Die Wiedervereinigung war 1990."],
    ["Deutschland","Was ist der 3. Oktober in Deutschland?",["Tag der Deutschen Einheit","Tag der Arbeit","Volkstrauertag","Reformationstag"],0,"Am 3. Oktober ist Tag der Deutschen Einheit."],
    ["Deutschland","Welche Stadt ist Landeshauptstadt von Baden-Württemberg?",["Stuttgart","Ulm","Karlsruhe","Freiburg"],0,"Stuttgart ist Landeshauptstadt von Baden-Württemberg."],
    ["Deutschland","Wie viele Nachbarländer hat Deutschland?",["9","6","7","12"],0,"Deutschland hat 9 Nachbarländer."],
    ["Europa","Welche Währung nutzt die Schweiz?",["Euro","Franken","Krone","Pfund"],1,"Die Schweiz nutzt den Schweizer Franken."],
    ["Europa","Welches Land gehört nicht zur EU?",["Schweiz","Frankreich","Italien","Spanien"],0,"Die Schweiz ist nicht Mitglied der EU."],
    ["Wissenschaft","Welche Einheit misst elektrische Spannung?",["Volt","Watt","Ampere","Ohm"],0,"Spannung wird in Volt gemessen."],
    ["Wissenschaft","Welche Einheit misst elektrische Stromstärke?",["Ampere","Volt","Watt","Ohm"],0,"Stromstärke misst man in Ampere."],
    ["Wissenschaft","Welche Einheit misst Leistung?",["Watt","Volt","Ampere","Ohm"],0,"Leistung wird in Watt gemessen."],
    ["Wissenschaft","Was ist H2O?",["Wasser","Sauerstoff","Kohlendioxid","Salz"],0,"H2O ist Wasser."],
    ["Wissenschaft","Was ist CO2?",["Kohlendioxid","Sauerstoff","Wasserstoff","Stickstoff"],0,"CO2 ist Kohlendioxid."],
    ["Technik","Welche Aufgabe hat eine Sicherung?",["Stromkreis bei Überlast unterbrechen","Internet beschleunigen","Bildschirm heller machen","Daten sortieren"],0,"Eine Sicherung schützt vor Überlast und Kurzschluss."],
    ["Technik","Was macht ein Transformator?",["Spannung ändern","Daten drucken","Bilder speichern","Wasser filtern"],0,"Ein Transformator kann Wechselspannung ändern."],
    ["Wirtschaft","Was ist Brutto?",["Betrag vor Abzügen","Betrag nach Abzügen","nur Gewinn","nur Steuer"],0,"Brutto ist vor Abzügen."],
    ["Wirtschaft","Was beschreibt Inflation?",["allgemeiner Preisanstieg","sinkende Preise immer","mehr Urlaubstage","höhere Internetgeschwindigkeit"],0,"Inflation bedeutet allgemeiner Preisanstieg."],
    ["Alltag","Wie viele Minuten hat eine Stunde?",["60","100","24","90"],0,"Eine Stunde hat 60 Minuten."],
    ["Alltag","Wie viele Gramm sind ein Kilogramm?",["1000","100","10","60"],0,"Ein Kilogramm hat 1000 Gramm."],
    ["Natur","Welches Organ pumpt Blut?",["Herz","Lunge","Magen","Leber"],0,"Das Herz pumpt Blut."],
    ["Natur","Welches Organ ist hauptsächlich für Atmung zuständig?",["Lunge","Herz","Magen","Niere"],0,"Die Lunge ist für die Atmung zuständig."],
    ["Geografie","Welche Hauptstadt gehört zu Frankreich?",["Paris","Madrid","Rom","Wien"],0,"Paris ist die Hauptstadt Frankreichs."],
    ["Geografie","Welche Hauptstadt gehört zu Spanien?",["Madrid","Lissabon","Rom","Athen"],0,"Madrid ist die Hauptstadt Spaniens."],
    ["Geografie","Welche Hauptstadt gehört zu Italien?",["Rom","Mailand","Neapel","Turin"],0,"Rom ist die Hauptstadt Italiens."],
    ["Geografie","Welche Hauptstadt gehört zu Österreich?",["Wien","Bern","Prag","Budapest"],0,"Wien ist die Hauptstadt Österreichs."],
    ["Geografie","Welche Hauptstadt gehört zu Polen?",["Warschau","Krakau","Danzig","Breslau"],0,"Warschau ist die Hauptstadt Polens."],
    ["Geografie","Welcher Ozean ist der größte?",["Pazifik","Atlantik","Indischer Ozean","Arktischer Ozean"],0,"Der Pazifik ist der größte Ozean."],
    ["Deutschland","Welche Stadt ist Hauptstadt von Bayern?",["München","Nürnberg","Augsburg","Regensburg"],0,"München ist die Hauptstadt Bayerns."],
    ["Deutschland","Welche Stadt ist Hauptstadt von Hessen?",["Wiesbaden","Frankfurt","Kassel","Darmstadt"],0,"Wiesbaden ist die Hauptstadt Hessens."],
    ["Deutschland","Welche Stadt ist Hauptstadt von NRW?",["Düsseldorf","Köln","Dortmund","Bonn"],0,"Düsseldorf ist die Hauptstadt von Nordrhein-Westfalen."],
    ["Alltag","Wie viele Zentimeter hat ein Meter?",["100","10","1000","60"],0,"Ein Meter hat 100 Zentimeter."],
    ["Natur","Welches Tier ist ein Säugetier?",["Wal","Hai","Karpfen","Forelle"],0,"Wale sind Säugetiere."],
    ["Politik","Wer ist das Staatsoberhaupt Deutschlands?",["Bundespräsident","Bundeskanzler","Bundestagspräsident","Innenminister"],0,"Das Staatsoberhaupt ist der Bundespräsident."]
  ];

  const capitalPool = [
    ["Australien","Canberra","Sydney","Melbourne","Perth"],["Kanada","Ottawa","Toronto","Vancouver","Montreal"],["USA","Washington, D.C.","New York","Los Angeles","Chicago"],["Türkei","Ankara","Istanbul","Izmir","Bursa"],["Griechenland","Athen","Thessaloniki","Patras","Kreta"],["Portugal","Lissabon","Porto","Faro","Coimbra"],["Niederlande","Amsterdam","Rotterdam","Den Haag","Utrecht"],["Belgien","Brüssel","Antwerpen","Gent","Brügge"],["Schweden","Stockholm","Göteborg","Malmö","Uppsala"],["Norwegen","Oslo","Bergen","Trondheim","Stavanger"],["Dänemark","Kopenhagen","Aarhus","Odense","Aalborg"],["Tschechien","Prag","Brünn","Pilsen","Ostrava"],["Ungarn","Budapest","Debrecen","Szeged","Pécs"],["Rumänien","Bukarest","Cluj","Timișoara","Iași"]
  ];



  const englishPool = [
    ["Englisch Vokabeln","Deutsch → Englisch: schnell",["fast","slow","late","weak"],0,"fast = schnell"],["Englisch Vokabeln","Deutsch → Englisch: günstig",["cheap","heavy","wide","angry"],0,"cheap = günstig"],["Englisch Vokabeln","Deutsch → Englisch: zuverlässig",["reliable","avlable","dangerous","foreign"],0,"reliable = zuverlässig"],["Englisch Vokabeln","Deutsch → Englisch: notwendig",["necessary","noisy","narrow","native"],0,"necessary = notwendig"],["Englisch Vokabeln","Deutsch → Englisch: Gerät",["device","advice","invoice","choice"],0,"device = Gerät"],["Englisch Übersetzen","Englisch → Deutsch: network",["Netzwerk","Bildschirm","Werkzeug","Rechnung"],0,"network = Netzwerk"],["Englisch Übersetzen","Englisch → Deutsch: schedule",["Zeitplan","Schalter","Bildschirm","Rechnung"],0,"schedule = Zeitplan"],["Englisch Übersetzen","Englisch → Deutsch: appointment",["Termin","Bewerbung","Passwort","Fehler"],0,"appointment = Termin"],["Englisch Übersetzen","Englisch → Deutsch: requirement",["Anforderung","Rückmeldung","Betriebssystem","Lieferung"],0,"requirement = Anforderung"],["Englisch Grammatik","Which sentence is correct?",["He goes to work.","He go to work.","He going work.","He gone work."],0,"Bei he/she/it bekommt das Verb im Simple Present ein -s."],["Englisch Grammatik","Fill in: I ___ a computer.",["have","has","having","had been"],0,"I have = ich habe."],["Englisch Grammatik","Fill in: We ___ ready.",["are","is","am","be"],0,"We are ready."],["Englisch Grammatik","Fill in: He ___ a ticket yesterday.",["bought","buy","buys","buying"],0,"Yesterday verlangt Vergangenheit: bought."],["Englisch Zeiten","Tomorrow I ___ call you.",["will","was","did","have"],0,"Tomorrow weist auf Zukunft hin: will."],["Englisch Schule","Plural of child",["children","childs","childes","childrens"],0,"child → children."],["Englisch Schule","Opposite of expensive",["cheap","clean","early","empty"],0,"cheap ist das Gegenteil von expensive."],["Englisch Schule","Opposite of strong",["weak","wide","cheap","early"],0,"weak ist das Gegenteil von strong."],["Berufsenglisch","Translate: application",["Bewerbung","Stecker","Kabel","Besprechung"],0,"application kann Bewerbung bedeuten."],["Berufsenglisch","Translate: invoice",["Rechnung","Werkzeug","Urlaub","Monitor"],0,"invoice = Rechnung."],["Berufsenglisch","Translate: customer",["Kunde","Kollege","Chef","Lieferant"],0,"customer = Kunde."],["Berufsenglisch","Translate: employee",["Mitarbeiter","Arbeitgeber","Kunde","Lieferant"],0,"employee = Mitarbeiter"],["Berufsenglisch","Translate: deadline",["Frist/Abgabetermin","Bewerbung","Rechnung","Urlaub"],0,"deadline = Frist/Abgabetermin"],["IT-Englisch","Translate: password",["Passwort","Bildschirm","Drucker","Ordner"],0,"password = Passwort"],["IT-Englisch","Translate: folder",["Ordner","Router","Kabel","Sicherung"],0,"folder = Ordner."],["IT-Englisch","Translate: access denied",["Zugriff verweigert","Netzwerk bereit","Datei gelöscht","Drucker aktiv"],0,"access denied = Zugriff verweigert."],["IT-Englisch","Translate: backup",["Datensicherung","Bildschirm","Fehler","Tastatur"],0,"backup = Datensicherung"],["IT-Englisch","Translate: settings",["Einstellungen","Dateien","Fehler","Schalter"],0,"settings = Einstellungen"],["IT-Englisch","Translate: connection",["Verbindung","Bewerbung","Rechnung","Lieferung"],0,"connection = Verbindung"]
  ];



  const itPool = [
    ["IT Netzwerk","Was macht DNS?",["Namen in IP-Adressen übersetzen","RAM erweitern","Dateien drucken","Strom speichern"],0,"DNS löst Domainnamen zu IP-Adressen auf."],["IT Netzwerk","Was vergibt DHCP typischerweise?",["IP-Adressen","Bildschirmauflösung","Passwortlänge","CPU-Takt"],0,"DHCP vergibt automatisch Netzwerkkonfigurationen."],["IT Netzwerk","Welche IPv4-Adresse ist privat?",["192.168.1.20","8.8.8.8","1.1.1.1","217.160.0.1"],0,"192.168.x.x ist privat."],["IT Netzwerk","Was macht ein Switch im LAN?",["Geräte im lokalen Netz verbinden","IP-Adressen weltweit registrieren","Strom speichern","Bilder komprimieren"],0,"Ein Switch verbindet Geräte im lokalen Netzwerk."],["IT Netzwerk","Was macht ein Router?",["Netzwerke miteinander verbinden","Texte korrigieren","RAM austauschen","Dateien verschlüsseln"],0,"Router verbinden verschiedene Netzwerke."],["IT Netzwerk","Was ist eine Subnetzmaske?",["Grenze zwischen Netz- und Hostanteil","Passwortregel","Bildformat","Druckersprache"],0,"Die Subnetzmaske trennt Netzanteil und Hostanteil."],["IT Netzwerk","Welche Portnummer nutzt HTTP typischerweise?",["80","22","25","3389"],0,"HTTP nutzt typischerweise Port 80."],["IT Netzwerk","Welche Portnummer nutzt HTTPS typischerweise?",["443","21","53","110"],0,"HTTPS nutzt typischerweise Port 443."],["IT Netzwerk","Welche Portnummer nutzt DNS typischerweise?",["53","80","443","3389"],0,"DNS nutzt typischerweise Port 53."],["IT Netzwerk","Was prüft der Befehl ping?",["Erreichbarkeit über Netzwerk","Festplattenplatz","Benutzerrechte","Druckerfarbe"],0,"ping prüft Erreichbarkeit."],["IT Hardware","Welche Komponente führt Rechenoperationen aus?",["CPU","SSD","Netzteil","Gehäuse"],0,"Die CPU ist der Prozessor."],["IT Hardware","Was macht RAM?",["flüchtiger Arbeitsspeicher","dauerhafte Archivierung","Netzwerk-Routing","Stromwandlung"],0,"RAM ist flüchtiger Arbeitsspeicher."],["IT Hardware","Was speichert Daten dauerhaft?",["SSD/HDD","RAM","CPU-Cache nur","Netzwerkkabel"],0,"SSD/HDD speichern Daten dauerhaft."],["IT Betriebssystem","Was sind Benutzerrechte?",["Berechtigungen für Aktionen im System","Bildschirmauflösung","Kabelstandard","Prozessorfrequenz"],0,"Benutzerrechte steuern Berechtigungen."],["IT FISI","Was ist Active Directory?",["Verzeichnisdienst für Benutzer und Ressourcen","Grafikkartentreiber","Antivirusprogramm","Browser"],0,"AD verwaltet Benutzer, Gruppen und Ressourcen."],["IT FISI","Was sind GPOs?",["Gruppenrichtlinien","Grafikprozessoren","Datenbanktabellen","Routerports"],0,"GPOs sind Gruppenrichtlinien."],["IT FISI","Was ist ein Ticket-System?",["System zur Bearbeitung von Anfragen/Störungen","Netzwerkkabel","Festplattentyp","Bildschirmmodus"],0,"Tickets dokumentieren Supportfälle."],["IT FISI","Warum dokumentiert man Änderungen?",["Nachvollziehbarkeit","mehr Stromverbrauch","schnelleres WLAN automatisch","weniger Sicherheit"],0,"Dokumentation macht Änderungen nachvollziehbar."],["IT Security","Was ist Phishing?",["Betrugsversuch über gefälschte Nachrichten","Festplattenformatierung","Netzteiltest","Monitorfehler"],0,"Phishing versucht Zugangsdaten zu stehlen."],["IT Security","Was macht eine Firewall?",["Netzwerkverkehr nach Regeln filtern","Bilder sortieren","CPU kühlen","Dateinamen übersetzen"],0,"Eine Firewall filtert Netzwerkverkehr."],["IT Security","Was bedeutet MFA?",["Mehrfaktor-Authentifizierung","Monitor-Farb-Anzeige","Mnboard-Fehleranalyse","Manuelle Freigabe"],0,"MFA nutzt mehrere Faktoren."],["IT Security","Was ist Ransomware?",["Erpressersoftware","Backupsoftware","Netzteilfehler","Bildschirmtreiber"],0,"Ransomware ist Erpressersoftware."],["IT Server","Was bedeutet Backup?",["Datensicherung","Bildvergrößerung","Internetvertrag","Druckauftrag"],0,"Backup = Datensicherung."],["IT Server","Was ist Virtualisierung?",["mehrere virtuelle Systeme auf Hardware betreiben","Kabel doppelt verlegen","Tastatur sperren","Monitor teilen"],0,"Virtualisierung ermöglicht VMs."],["IT Linux","Welcher Befehl listet Dateien?",["ls","cd","ping","mkdir"],0,"ls listet Dateien/Ordner auf."],["IT Linux","Welcher Befehl wechselt den Ordner?",["cd","ls","ipconfig","mkdir"],0,"cd wechselt das Verzeichnis."],["IT Windows","Welcher Befehl zeigt Netzwerkkonfiguration in Windows?",["ipconfig","ls","chmod","grep"],0,"ipconfig zeigt IP-Konfigurationen."]
  ];

  const opinionFacts = [
    ["Alle Menschen mögen Bücher.","Meinung","'mögen' ist subjektiv."],["Deutschland hat 16 Bundesländer.","Tatsache","Das ist objektiv überprüfbar."],["Mathematik ist schwerer als Englisch.","Meinung","Das ist eine persönliche Bewertung."],["Ein Kilometer hat 1000 Meter.","Tatsache","Das ist eine feste Maßeinheit."],["Pizza schmeckt besser als Nudeln.","Meinung","Geschmack ist subjektiv."],["Die Erde dreht sich um die Sonne.","Tatsache","Das ist wissenschaftlich überprüfbar."],["Wasser gefriert ungefähr bei 0 °C.","Tatsache","Das ist naturwissenschaftlich überprüfbar."],["Linux ist besser als Windows.","Meinung","Das ist eine Bewertung."],["DNS übersetzt Namen in IP-Adressen.","Tatsache","Das ist eine technische Funktion."],["Alle Chefs sind streng.","Meinung","Das ist pauschal und subjektiv."]
  ];

  const symbolPatterns = [
    {seq:["○","△","○","△","○","?"],ans:"△",ex:"Kreis und Dreieck wechseln sich ab."},{seq:["▲","▶","▼","◀","▲","?"],ans:"▶",ex:"Die Spitze dreht sich im Uhrzeigersinn."},{seq:["■","□","■","□","■","?"],ans:"□",ex:"Gefüllt und leer wechseln sich ab."},{seq:["●","●","▲","●","●","▲","?"],ans:"●",ex:"Zwei Kreise, ein Dreieck."},{seq:["◇","◆","◇","◆","◇","?"],ans:"◆",ex:"Leer und gefüllt wechseln."},{seq:["|","||","|||","||||","|||||","?"],ans:"||||||",ex:"Es kommt ein Strich dazu."},{seq:["⬆","➡","⬇","⬅","⬆","?"],ans:"➡",ex:"Richtung dreht im Uhrzeigersinn."},{seq:["2","3","5","8","13","?"],ans:"21",ex:"Fibonacci-ähnlich: Summe der zwei vorherigen."},{seq:["S","M","L","S","M","?"],ans:"L",ex:"Größenfolge S-M-L wiederholt sich."},{seq:["+","-","+","-","+","?"],ans:"-",ex:"Plus und Minus wechseln."}
  ];



  const EDV_STORY = `Firma Nova richtet einen kleinen Schulungsraum ein. Es gibt einen Router, einen Switch, einen Server, zwei PCs, einen Drucker, ein Backup-Ziel und ein Ticketsystem. Der Plan soll zeigen, wie Netzwerk, Sicherheit, Benutzerrechte, Backup und Support zusammenhängen. In der dargestellten Seite sind genau 11 Fehler versteckt.`;
  const EDV_SCHEMA = [
    {id:"A1", text:"Router LAN: 192.168.10.1", ok:true},
    {id:"A2", text:"Switch verbindet PC-1, PC-2, Server und Drucker", ok:true},
    {id:"A3", text:"PC-1: 192.168.10.21 / Gateway 192.168.10.1", ok:true},
    {id:"A4", text:"PC-2: 192.168.99.22 / Gateway 192.168.10.1", ok:false, nd:"Logikfehler", ex:"PC-2 liegt nicht im gleichen Netz wie Gateway 192.168.10.1."},
    {id:"A5", text:"DNS-Server zeigt auf 192.168.10.10", ok:true},
    {id:"A6", text:"DHCP verteilt 192.168.10.50 bis 192.168.10.100", ok:true},
    {id:"A7", text:"Client bekommt 10.0.0.55 aus dem DHCP-Bereich", ok:false, nd:"Logikfehler", ex:"10.0.0.55 passt nicht zum DHCP-Bereich 192.168.10.50 bis 100."},
    {id:"A8", text:"Server stellt Benutzerfreigabe bereit", ok:true},
    {id:"A9", text:"Gastbenutzer darf Systemdateien löschen", ok:false, nd:"Inhaltsfehler", ex:"Ein Gastbenutzer darf keine Systemdateien löschen."},
    {id:"A10", text:"Admin-Gruppe darf Software installieren", ok:true},
    {id:"B1", text:"PC-1 → Switch → Router → Internet", ok:true},
    {id:"B2", text:"Internet → Tastatur → Server", ok:false, nd:"Pfeilfehler", ex:"Eine Tastatur ist kein Netzwerkziel zwischen Internet und Server."},
    {id:"B3", text:"Drucker ist über Netzwerkfreigabe erreichbar", ok:true},
    {id:"B4", text:"Backup: Quelle → Ziel → Prüfung", ok:true},
    {id:"B5", text:"Backup-Ablauf endet mit: Originaldaten löschen", ok:false, nd:"Inhaltsfehler", ex:"Nach einem normalen Backup löscht man nicht die Originaldaten."},
    {id:"B6", text:"USV schützt Server bei kurzem Stromausfall", ok:true},
    {id:"B7", text:"Stromausfall führt trotz USV sofort zu Datenverlust", ok:false, nd:"Logikfehler", ex:"Eine USV soll den sofortigen Ausfall abfedern."},
    {id:"C1", text:"Firewall erlaubt HTTP Port 80", ok:true},
    {id:"C2", text:"Firewall erlaubt HTTPS Port 443", ok:true},
    {id:"C3", text:"Firewallregel: SSH läuft über Port 9999", ok:false, nd:"Inhaltsfehler", ex:"SSH nutzt typischerweise Port 22, nicht 9999."},
    {id:"C4", text:"Passwörter werden mit MFA abgesichert", ok:true},
    {id:"C5", text:"Passwortliste hängt ausgedruckt am Monitor", ok:false, nd:"Inhaltsfehler", ex:"Passwörter dürfen nicht offen am Monitor hängen."},
    {id:"D1", text:"Ticket aufnehmen → Priorität setzen → Lösung dokumentieren", ok:true},
    {id:"D2", text:"Kritisches Ticket wird ignoriert, wenn der Nutzer nervt", ok:false, nd:"Inhaltsfehler", ex:"Ein kritisches Ticket darf nicht ignoriert werden."},
    {id:"D3", text:"Pfeil: Prüfung → Einlagerung → Ausgabe", ok:true},
    {id:"D4", text:"Pfeil: Ausgabe → Wareneingang ohne Rückgabegrund", ok:false, nd:"Pfeilfehler", ex:"Der Ablauf springt ohne Grund zurück zum Wareneingang."},
    {id:"D5", text:"Monitor verarbeitet SMTP und löscht E-Mails", ok:false, nd:"Inhaltsfehler", ex:"Ein Monitor verarbeitet kein SMTP."},
    {id:"D6", text:"Router WAN-Port geht zum Internetanschluss", ok:true},
    {id:"D7", text:"HDMI-Kabel wird korrekt als Bildschirmverbindung dokumentiert", ok:true}
  ];
  const EDV_ERRORS = EDV_SCHEMA.filter(x=>!x.ok);



  let state = {
    selectedMode:"jogging", quiz:[], current:0, score:0, timer:null, memoryTimer:null,
    questionStartedAt:null, timeLeft:0, totalTimeForQuestion:0, testStart:null, testEnd:null,
    history:[], questionStates:[], markedQuestions:[], memoryItems:[], adaptiveMemoryPool:[],
    usedQuestions:new Set(), ctcBlockRemaining:{}, ctcCurrentBlock:null, shownBlockIntro:{}, pendingBlock:null, routeTimers:[], activeModeTab:"basic", activeAppSection:"dashboard", exam:{enabled:false,hardcore:false,lockBack:false,started:false}
  };

  function isAdaptiveElite() {
    return state.selectedMode === "ctc";
  }

  function readExamOptions() {
    const enabled = !!$("optExamMode")?.checked;
    const hardcore = !!$("optHardcore")?.checked;
    const lockBack = !!$("optLockBack")?.checked;
    state.exam = {enabled, hardcore, lockBack, started:false};
    if(hardcore) state.exam.enabled = true;
    if(lockBack) state.exam.enabled = true;
  }

  function applyExamBodyClass() {
    document.body.classList.toggle("exam-active", !!state.exam.enabled);
    document.body.classList.toggle("exam-hardcore", !!state.exam.hardcore);
    document.body.classList.toggle("exam-lockback", !!state.exam.lockBack);
    document.body.classList.toggle("exam-focus", !!state.exam.enabled);
  }

  function clearExamBodyClass() {
    document.body.classList.remove("exam-active","exam-hardcore","exam-lockback","exam-focus");
  }

  function examStatusHtml() {
    const parts=[];
    if(state.exam.enabled) parts.push("Prüfungsmodus");
    if(state.exam.hardcore) parts.push("Hardcore");
    if(state.exam.lockBack) parts.push("Zurück gesperrt");
    return parts.length ? `<div class="exam-status">${parts.map(x=>`<span>${x}</span>`).join("")}</div>` : "";
  }

  function isInstantFeedbackAllowed() {
    return MODES[state.selectedMode].instant && !state.exam.hardcore;
  }


  function fromPool(pool, level) {
    const candidates = shuffle(pool);
    let x = candidates.find(item => !state.usedQuestions.has(item[1])) || choice(pool);
    state.usedQuestions.add(x[1]);
    const sh = shuffleWithCorrect(x[2], x[3]);
    return makeMC(x[0], level==="hard"?18:24, x[1], sh.opts, sh.correct, x[4]);
  }
  function levelFor(mode,index,total) {
    const phase=index/Math.max(1,total);
    if(mode==="ctc") return phase<.20?"medium":"hard";
    if(mode==="bps") return phase<.3?"easy":phase<.75?"medium":"hard";
    if(["mathSprint","logicSprint","concentrationSprint","visualIQSprint","itSprint","knowledgeSprint","techniqueSprint","errorTrainingPrep"].includes(mode)) return phase<.25?"medium":"hard";
    return "medium";
  }



  const Generators = {


    knowledge(level) {
      if(Math.random()<.30) {
        const c=choice(capitalPool), opts=shuffle([c[1],c[2],c[3],c[4]]);
        return makeMC("Geografie",20,`Was ist die Hauptstadt von ${c[0]}?`,opts,optIdx(opts,c[1]),`${c[1]} ist die Hauptstadt von ${c[0]}.`);
      }
      return fromPool(generalPool,level);
    },
    english(level) { return fromPool(englishPool,level); },


    it(level) {
      if(Math.random()<.25) return Generators.itScenario(level);
      return fromPool(itPool,level);
    },
    itScenario() {
      return choice([
        ()=>makeMC("IT Fehleranalyse",35,"Ein PC hat IP 192.168.1.50, Gateway 192.168.1.1, DNS leer. Internet per IP geht, Webseiten-Namen gehen nicht. Was ist wahrscheinlich falsch?",["DNS fehlt","RAM defekt","Monitor defekt","Tastatur defekt"],0,"Wenn IP geht, aber Namen nicht, ist DNS wahrscheinlich das Problem."),
        ()=>makeMC("IT Netzwerk",35,"Ein Client bekommt 169.254.x.x als IP-Adresse. Was ist wahrscheinlich passiert?",["DHCP nicht erreichbar","DNS ist zu schnell","CPU überhitzt","Passwort falsch"],0,"169.254.x.x ist meist APIPA, wenn DHCP nicht klappt."),
        ()=>makeMC("IT FISI",35,"Ein neuer Benutzer soll dieselben Rechte wie alle Azubis bekommen. Was ist sinnvoll?",["in passende Gruppe aufnehmen","lokal Admin machen","Passwort öffentlich teilen","Firewall abschalten"],0,"Rechte werden sinnvoll über Gruppen vergeben."),
        ()=>makeMC("IT Security",30,"Welche Maßnahme ist am sinnvollsten gegen Kontoübernahme?",["MFA aktivieren","Bildschirm heller machen","DNS löschen","Drucker tauschen"],0,"MFA schützt zusätzlich.")
      ])();
    },


    mul(level) {
      let a,b; if(level==="easy"){a=rand(2,10);b=rand(2,10)} else if(level==="medium"){a=rand(6,16);b=rand(4,14)} else {a=rand(11,25);b=rand(6,19)}
      const res=a*b, opts=optionsFromCorrect(res,level==="hard"?40:18,false);
      return makeMC("Mathe 1x1",level==="hard"?16:18,`${a} × ${b} = ?`,opts,optIdx(opts,String(res)),`${a} × ${b} = ${res}.`);
    },
    div(level) {
      const b=level==="easy"?rand(2,10):level==="medium"?rand(4,16):rand(7,24), res=level==="easy"?rand(2,12):level==="medium"?rand(5,18):rand(8,30), a=b*res, opts=optionsFromCorrect(res,18,false);
      return makeMC("Mathe Division",18,`${a} : ${b} = ?`,opts,optIdx(opts,String(res)),`${b} × ${res} = ${a}.`);
    },
    percent(level) {
      const n=level==="easy"?choice([80,100,120,150,200,240,300]):level==="medium"?choice([160,180,240,320,360,480,640,840]):rand(180,980);
      const p=level==="easy"?choice([10,20,25,50]):level==="medium"?choice([12.5,15,20,25,30,40,60]):choice([7.5,12.5,17.5,22,28,37,42,63,78]);
      const raw=Math.round(n*p)/100, c=Number.isInteger(raw)?String(raw):norm(Math.round(raw*10)/10), opts=optionsFromCorrect(c,level==="hard"?30:18,String(c).includes(","));
      return makeMC("Prozentrechnung",level==="hard"?24:26,`${norm(p)}% von ${n} sind?`,opts,optIdx(opts,c),`${norm(p)}% von ${n} = ${c}.`);
    },
    percentReverse(level) {
      const old=choice([60,80,100,120,150,200,240,300,400,500]), p=choice(level==="hard"?[12.5,15,20,25,30,35,40]:[10,20,25,30]), now=Math.round(old*(100-p))/100, opts=optionsFromCorrect(old,60,false," €");
      return makeMC("Textrechnen",level==="hard"?38:45,`Eine Ware wurde um ${norm(p)}% reduziert und kostet jetzt ${norm(now)} €. Wie viel kostete sie vorher?`,opts,optIdx(opts,old+" €"),`Nach der Reduktion sind ${100-p}% übrig. ${norm(now)} ÷ ${norm((100-p)/100)} = ${old} €.`);
    },
    fraction(level) {
      const den1=choice([3,4,5,6,8,10,12]), den2=level==="easy"?den1:choice([4,6,8,10,12]), a=rand(1,den1-1), b=rand(1,den2-1);
      const lcm=den1*den2/gcd(den1,den2), sum=a*(lcm/den1)+b*(lcm/den2), g=gcd(sum,lcm), sn=sum/g, sd=lcm/g;
      const correct=sn>=sd?(sn%sd===0?String(sn/sd):mixedHTML(Math.floor(sn/sd),sn%sd,sd)):fracHTML(sn,sd);
      const opts=shuffle([correct,fracHTML(Math.max(1,sn-1),sd),fracHTML(sn,lcm),fracHTML(a+b,Math.max(den1,den2))]);
      return makeMC("Bruchrechnen",34,`Berechne: ${fracHTML(a,den1)} + ${fracHTML(b,den2)}`,opts,optIdx(opts,correct),`Erweitern und kürzen: Ergebnis ist ${correct}.`,"fraction",{fraction:{a,b,den1,den2,sn,sd}});
    },
    arithmetic(level) {
      const t=choice(["add","sub","mulBig","divBig"]);
      if(t==="add"){const a=rand(200,level==="hard"?9000:1500),b=rand(100,level==="hard"?8000:1500),res=a+b,opts=optionsFromCorrect(res,90,false); return makeMC("Grundrechnen",35,`${a} + ${b} = ?`,opts,optIdx(opts,String(res)),`${a}+${b}=${res}.`);}
      if(t==="sub"){const a=rand(700,level==="hard"?9500:2500),b=rand(100,Math.min(a-1,level==="hard"?3000:900)),res=a-b,opts=optionsFromCorrect(res,100,false); return makeMC("Grundrechnen",38,`${a} − ${b} = ?`,opts,optIdx(opts,String(res)),`${a}-${b}=${res}.`);}
      if(t==="mulBig"){const a=rand(24,level==="hard"?98:76),b=rand(12,level==="hard"?39:24),res=a*b,opts=optionsFromCorrect(res,120,false); return makeMC("Grundrechnen",40,`${a} × ${b} = ?`,opts,optIdx(opts,String(res)),`${a} × ${b} = ${res}.`);}
      const b=rand(12,34),res=rand(8,89),a=b*res,opts=optionsFromCorrect(res,20,false); return makeMC("Grundrechnen",40,`${a} : ${b} = ?`,opts,optIdx(opts,String(res)),`${b} × ${res} = ${a}.`);
    },
    dreisatz(level) {
      let workers=rand(3,8),hours=rand(4,10),newWorkers=rand(2,9); while(newWorkers===workers)newWorkers=rand(2,9);
      const res=Math.round(workers*hours/newWorkers*10)/10, c=Number.isInteger(res)?String(res):norm(res), opts=optionsFromCorrect(c,8,true," Std.");
      return makeMC("Dreisatz",level==="hard"?45:50,`${workers} Arbeiter benötigen ${hours} Stunden. Wie lange brauchen ${newWorkers} Arbeiter?`,opts,optIdx(opts,c+" Std."),`${workers} × ${hours} = ${workers*hours} Arbeiterstunden. Geteilt durch ${newWorkers} = ${c}.`);
    },
    area(level) {
      const l=rand(12,level==="hard"?95:50), w=rand(5,level==="hard"?48:25), ask=Math.random()<.5?"Fläche":"Umfang", res=ask==="Fläche"?l*w:2*(l+w), unit=ask==="Fläche"?" m²":" m", opts=optionsFromCorrect(res,80,false,unit);
      return makeMC("Geometrie",35,`Ein Grundstück ist ${l} m lang und ${w} m breit. Gesucht: ${ask}.`,opts,optIdx(opts,res+unit),ask==="Fläche"?`${l} × ${w} = ${res} m².`:`2 × (${l}+${w}) = ${res} m.`);
    },
    math(level) { return choice([Generators.mul,Generators.div,Generators.percent,Generators.fraction,Generators.arithmetic,Generators.dreisatz,Generators.area])(level); },


    series(level) {
      let nd=rand(1,8),seq=[],n1,n2,ex="";
      if(nd===1){const s=rand(2,9),start=rand(1,20); for(let i=0;i<7;i++)seq.push(start+i*s); n1=start+7*s; n2=start+8*s; ex=`Immer +${s}.`;}
      else if(nd===2){const start=rand(2,8),steps=[2,3]; seq=[start]; for(let i=1;i<7;i++)seq.push(seq[i-1]+steps[(i-1)%2]); n1=seq[6]+steps[0]; n2=n1+steps[1]; ex="Abwechselnd +2 und +3.";}
      else if(nd===3){const start=choice([2,3,4]),m=choice([2,3]); for(let i=0;i<7;i++)seq.push(start*Math.pow(m,i)); n1=start*Math.pow(m,7); n2=start*Math.pow(m,8); ex=`Immer ×${m}.`;}
      else if(nd===4){seq=[4,8,16,20,40,44,88]; n1=92; n2=184; ex="Muster: ×2, +4, ×2, +4.";}
      else if(nd===5){seq=[3,6,11,18,27,38,51]; n1=66; n2=83; ex="Abstände +3,+5,+7,+9,+11,+13,+15,+17.";}
      else if(nd===6){seq=[2,6,12,20,30,42,56]; n1=72; n2=90; ex="Muster n²+n.";}
      else if(nd===7){seq=[1,4,9,16,25,36,49]; n1=64; n2=81; ex="Quadratzahlen.";}
      else {seq=[2,3,5,8,13,21,34]; n1=55; n2=89; ex="Summe der zwei vorherigen Zahlen.";}
      const correct=`${norm(n1)} und ${norm(n2)}`, opts=shuffle([correct,`${norm(n1+1)} und ${norm(n2+1)}`,`${norm(n1)} und ${norm(n2+2)}`,`${norm(n1+2)} und ${norm(n2)}`]);
      return makeMC("Zahlenreihen",level==="hard"?28:35,`Setze die Reihe um zwei Zahlen fort: ${seq.map(norm).join("  ")}  __  __`,opts,optIdx(opts,correct),ex,"series",{series:[...seq,"?","?"]});
    },
    matrix(level) {
      let nd=rand(1,6),grid,correct,ex;
      if(nd===1){const a=rand(2,9),b=rand(2,9),c=rand(2,9); grid=[[a,b,a+b],[b,c,b+c],[c,a,"?"]]; correct=c+a; ex="Rechts steht Summe aus links und Mitte.";}
      else if(nd===2){const a=rand(2,8),b=rand(2,8),c=rand(2,8); grid=[[a,a+2,a*2+2],[b,b+2,b*2+2],[c,c+2,"?"]]; correct=c*2+2; ex="Rechts: linke Zahl ×2 +2.";}
      else if(nd===3){grid=[["●","▲","■"],["▲","■","●"],["■","●","?"]]; return makeMC("Matrizen",30,"Welche Form fehlt unten rechts?",["●","▲","■","◆"],1,"Die Formen wandern je Zeile weiter.","matrix",{grid});}
      else if(nd===4){const a=rand(2,6),b=rand(2,6),c=rand(2,6); grid=[[a,b,a*b],[b,c,b*c],[c,a,"?"]]; correct=c*a; ex="Rechts steht das Produkt.";}
      else if(nd===5){grid=[[2,5,11],[3,7,17],[4,9,"?"]]; correct=22; ex="Rechts: links + 2×Mitte -1.";}
      else {grid=[[1,4,9],[2,6,12],[3,8,"?"]]; correct=15; ex="Von links nach rechts steigen die Abstände je Zeile.";}
      const opts=optionsFromCorrect(correct,18,false);
      return makeMC("Matrizen",level==="hard"?30:38,"Welche Zahl fehlt in der Matrix?",opts,optIdx(opts,String(correct)),ex,"matrix",{grid});
    },
    symbolSeries() {
      const p=choice(symbolPatterns), distractors=shuffle(["○","△","□","■","▲","▶","▼","◀","◆","◇","||||||","32","21","L","-","◓"].filter(x=>x!==p.ans)).slice(0,3), opts=shuffle([p.ans,...distractors]);
      return makeMC("Symbolreihen",24,"Welche Figur setzt die Reihe fort?",opts,optIdx(opts,p.ans),p.ex,"symbols",{symbols:p.seq});
    },
    gear(level) {
      const n=level==="hard"?rand(5,7):rand(3,5), first=Math.random()<.5?"↻":"↺", labels="ABCDEFG".split("").slice(0,n), dirs=labels.map((_,i)=>i%2===0?first:(first==="↻"?"↺":"↻")), correct=dirs[n-1];
      const startText=first==="↻"?"im Uhrzeigersinn":"gegen den Uhrzeigersinn";
      return makeMC("Mechanik",level==="hard"?22:30,`Zahnrad A dreht sich ${startText}. In welche Richtung dreht sich Zahnrad ${labels[n-1]}?`,["↻ Uhrzeigersinn","↺ Gegenuhrzeigersinn","Dreht sich nicht","Nicht bestimmbar"],correct==="↻"?0:1,"Direkt greifende Zahnräder wechseln bei jedem Kontakt die Richtung.","visual",{visual:{nd:"gear",labels,dirs:dirs.map((d,i)=>i===0?d:"?")}});
    },
    belt() {
      const big=rand(40,80), small=rand(10,35), ans="kleines Rad", opts=shuffle([ans,"großes Rad","beide gleich schnell","nicht bestimmbar"]);
      return makeMC("Mechanik",30,`Ein großes Rad (${big} cm) treibt über einen Riemen ein kleines Rad (${small} cm) an. Welches Rad dreht sich schneller?`,opts,optIdx(opts,ans),"Bei gleicher Riemengeschwindigkeit macht das kleinere Rad mehr Umdrehungen.","visual",{visual:{nd:"belt",big,small}});
    },
    spatial() {
      const shapes=[{name:"L-Körper",grid:[[1,0],[1,0],[1,1]],faces:18},{name:"2x2 Platte",grid:[[1,1],[1,1]],faces:16},{name:"Treppenform",grid:[[1,0,0],[1,1,0],[1,1,1]],faces:24}], s=choice(shapes), opts=optionsFromCorrect(s.faces,6,false);
      return makeMC("Räumliches Denken",42,"Wie viele Außenflächen hat der dargestellte Körper?",opts,optIdx(opts,String(s.faces)),"Außenflächen zählen. Berührungsflächen zwischen Würfeln zählen nicht außen.","visual",{visual:{nd:"blocks",shape:s}});
    },
    net() {
      const ans="Würfel", opts=shuffle([ans,"Kegel","Zylinder","Kugel"]);
      return makeMC("Räumliches Denken",35,"Welcher Körper entsteht aus diesem Netz?",opts,optIdx(opts,ans),"Sechs Quadrate können zu einem Würfel gefaltet werden.","visual",{visual:{nd:"net"}});
    },
    statementLogic() {
      return choice([
        ()=>makeMC("Aussagenlogik",28,"Alle A sind B. Kein B ist C. Was folgt sicher?",["Kein A ist C","Alle C sind A","Einige A sind C","Nichts"],0,"Wenn A immer B ist und B nie C, dann kann A nicht C sein."),
        ()=>makeMC("Aussagenlogik",32,"Mara ist größer als Tim. Tim ist größer als Ali. Wer ist am kleinsten?",["Ali","Tim","Mara","Nicht bestimmbar"],0,"Mara > Tim > Ali."),
        ()=>makeMC("Aussagenlogik",35,"A arbeitet schneller als B. C arbeitet langsamer als B. D arbeitet schneller als A. Wer ist am schnellsten?",["D","A","B","C"],0,"D > A > B > C."),
        ()=>makeMC("Aussagenlogik",30,"Alle roten Kabel sind markiert. Dieses Kabel ist nicht markiert. Was folgt?",["Es ist nicht rot","Es ist rot","Es ist blau","Keine Aussage möglich"],0,"Wenn alle roten Kabel markiert sind, kann ein nicht markiertes nicht rot sein.")
      ])();
    },
    opinionFact() {
      const d=choice(opinionFacts), opts=shuffle(["Meinung","Tatsache","weder noch","nicht entscheidbar"]);
      return makeMC("Meinung/Tatsache",20,`Ist die Aussage eine Meinung oder eine Tatsache?<br><b>${d[0]}</b>`,opts,optIdx(opts,d[1]),d[2]);
    },
    analogy() {
      const data=[["groß","klein","breit","schmal",["dick","riesig","Körpergröße"]],["Bleistift","spitzen","Messer","schleifen",["schneiden","stechen","essen"]],["Tag","hell","Nacht","dunkel",["spät","Mond","kurz"]],["Motor","Auto","Herz","Mensch",["Blut","Lunge","Körper"]],["Baum","Wald","Stern","Galaxie",["Himmel","Planet","Licht"]]], d=choice(data), opts=shuffle([d[3],...d[4]]);
      return makeMC("Wortlogik",28,`${d[0]} : ${d[1]} = ${d[2]} : ?`,opts,optIdx(opts,d[3]),`${d[1]} passt zu ${d[0]} wie ${d[3]} zu ${d[2]}.`);
    },
    logic(level) { return choice([Generators.series,Generators.matrix,Generators.symbolSeries,Generators.gear,Generators.belt,Generators.statementLogic,Generators.spatial,Generators.net,Generators.opinionFact,Generators.analogy,Generators.visualIQ])(level); },


    attention(level) {
      const len=level==="hard"?34:level==="medium"?24:16, chars=["q","p","b","d","g","9"], target=choice(chars); let s=""; for(let i=0;i<len;i++)s+=choice(chars); const count=[...s].filter(x=>x===target).length, opts=shuffle([count,count+1,Math.max(0,count-1),count+2]).map(String);
      return makeMC("Aufmerksamkeit",level==="hard"?16:20,`Wie oft kommt „${target}“ vor? ${s}`,opts,optIdx(opts,String(count)),`„${target}“ kommt ${count}-mal vor.`);
    },
    codeCompare(level) {
      const chars="ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; let base=""; for(let i=0;i<(level==="hard"?10:8);i++)base+=choice(chars.split(""));
      let changed=base.split(""),pos=rand(0,changed.length-1); changed[pos]=choice(chars.split("").filter(x=>x!==changed[pos])); changed=changed.join("");
      const same=Math.random()<.35, right=same?"gleich":"verschieden", opts=shuffle(["gleich","verschieden","nicht prüfbar","nur Zahlen anders"]);
      return makeMC("Aufmerksamkeit",level==="hard"?18:22,`Vergleiche die Codes: ${base} | ${same?base:changed}`,opts,optIdx(opts,right),same?"Die Codes sind identisch.":`An Position ${pos+1} unterscheiden sich die Codes.`);
    },
    fractionRuleEignungstest() {
      const a=rand(7,39),b=rand(6,38),c=rand(10,55),d=rand(5,45), za=a+b, ne=c+d, res=za>ne?za-ne:za+ne;
      const q=`Oben steht: ${a} + ${b}. Unten steht: ${c} + ${d}.<br>Regel: Wenn oben größer ist, unten abziehen. Wenn unten größer ist, oben zu unten addieren. Ergebnis?`;
      const opts=optionsFromCorrect(res,18,false), ex=za>ne?`Oben: ${za}, unten: ${ne}. Oben ist größer, also ${za} - ${ne} = ${res}.`:`Oben: ${za}, unten: ${ne}. Unten ist größer, also ${ne} + ${za} = ${res}.`;
      return makeMC("Konzentration",32,q,opts,optIdx(opts,String(res)),ex,"fractionRule",{fractionRule:{a,b,c,d,za,ne}});
    },
    tableCode() {
      const names=shuffle(["KAYA","MÜLLER","SCHMIDT","YILMAZ","WEBER","BOZKURT"]), colors=shuffle(["rot","blau","grün","gelb","weiß","schwarz"]), nums=shuffle(["12","27","34","46","58","73"]);
      const rows=names.slice(0,4).map((n,i)=>({name:n,color:colors[i],num:nums[i],code:n[0]+colors[i][0].toUpperCase()+nums[i]})), target=choice(rows), ask=choice(["name","color"]), correct=ask==="name"?target.code:target.name;
      const opts=ask==="name"?shuffle(rows.map(r=>r.code)):shuffle(rows.map(r=>r.name)), q=ask==="name"?`Welche Kennung gehört zu <b>${target.name}</b>?`:`Welche Person gehört zur Farbe <b>${target.color}</b>?`;
      return makeMC("Tabellenlogik",35,q,opts,optIdx(opts,correct),`In der Tabelle gehört ${target.name} / ${target.color} / ${target.num} zusammen.`,"tablecode",{tableRows:rows});
    },
    pqStrike(level) {
      const total=level==="hard"?192:160, items=[]; let target=0;
      for(let i=0;i<total;i++){ const ch=choice(["p","q","b"]), bars=choice([0,1,1,2,2,3]); if(ch==="p" && bars===2)target++; items.push({txt:ch+(bars===0?"":"'".repeat(bars))});}
      const opts=shuffle([target,target+1,Math.max(0,target-1),target+2]).map(String);
      const sheet=`<div class="visualBox"><div class="pq-sheet">${items.map(x=>`<span class="pq-token">${x.txt}</span>`).join("")}</div></div>`;
      return makeMC("p/q/b Konzentration",45,`Zähle die <b>p</b>, die genau <b>zwei Striche</b> haben.`,opts,optIdx(opts,String(target)),`Gesucht waren nur p mit genau zwei Strichen. Anzahl: ${target}.`,"pqsheet",{pqHTML:sheet,pqTarget:target});
    },

    focusScanner(level) {
      const total=level==="hard"?120:level==="medium"?90:70;
      const chars=["p","q","b","d"];
      const marks=["","'","''","´","``"];
      const targetChar=choice(chars);
      const targetMarks=choice(["''","'","´"]);
      let items=[],target=0;
      for(let i=0;i<total;i++){
        const ch=choice(chars), mk=choice(marks);
        const txt=ch+mk;
        if(ch===targetChar && mk===targetMarks)target++;
        items.push(txt);
      }
      const opts=shuffle([target,target+1,Math.max(0,target-1),target+2]).map(String);
      const html=`<div class="visualBox"><b>Scannerfeld</b><div class="focus-grid">${items.map(x=>`<span class="focus-token">${x}</span>`).join("")}</div></div>`;
      return makeMC("Konzentration Scanner",level==="hard"?32:40,`Zähle alle <b>${targetChar}</b> mit genau diesem Zeichen: <b>${targetMarks || "ohne Zeichen"}</b>`,opts,optIdx(opts,String(target)),`Gesucht waren nur ${targetChar}${targetMarks}. Anzahl: ${target}.`,"focusgrid",{focusHTML:html,signatureSeed:items.join("")+"|"+targetChar+"|"+targetMarks});
    },
    symbolSearch(level) {
      const symbols=["◆","◇","▲","△","●","○","■","□","⬟","★"];
      const total=level==="hard"?96:72;
      const target=choice(symbols);
      let arr=[],count=0;
      for(let i=0;i<total;i++){const s=choice(symbols); if(s===target)count++; arr.push(s);}
      const opts=shuffle([count,count+1,Math.max(0,count-1),count+2]).map(String);
      const html=`<div class="visualBox"><b>Symbolfeld</b><div class="focus-grid">${arr.map(x=>`<span class="focus-token">${x}</span>`).join("")}</div></div>`;
      return makeMC("Konzentration Symbolsuche",level==="hard"?28:36,`Wie oft kommt das Symbol <b>${target}</b> vor?`,opts,optIdx(opts,String(count)),`${target} kommt ${count}-mal vor.`,"focusgrid",{focusHTML:html,signatureSeed:arr.join("")+"|"+target});
    },
    tableScan(level) {
      const rows=level==="hard"?8:6;
      const letters="ABCDEFGHJKLMNPQRSTUVWXYZ".split("");
      const nums=["12","27","34","46","58","73","81","95","06","49"];
      const table=[];
      for(let i=0;i<rows;i++){
        table.push({
          k: choice(letters)+choice(nums),
          a: choice(["rot","blau","grün","gelb","weiß"]),
          b: choice(["Nord","Süd","Ost","West","Mitte"]),
          c: choice(["A1","B2","C3","D4","E5"])
        });
      }
      const target=choice(table);
      const ask=choice(["farbe","zone","code"]);
      let question, correct;
      if(ask==="farbe"){question=`Welche Farbe gehört zu Kennung <b>${target.k}</b>?`; correct=target.a;}
      else if(ask==="zone"){question=`Welche Zone gehört zu Kennung <b>${target.k}</b>?`; correct=target.b;}
      else {question=`Welcher Code gehört zu Kennung <b>${target.k}</b>?`; correct=target.c;}
      const pool=ask==="farbe"?table.map(r=>r.a):ask==="zone"?table.map(r=>r.b):table.map(r=>r.c);
      const opts=shuffle([...new Set([correct,...shuffle(pool.filter(x=>x!==correct)).slice(0,3),...["rot","Nord","A1"]])]).slice(0,4);
      if(!opts.includes(correct)){opts[0]=correct;}
      const tableHtml=`<div class="visualBox"><table class="scan-table"><tr><th>Kennung</th><th>Farbe</th><th>Zone</th><th>Code</th></tr>${table.map(r=>`<tr><td>${r.k}</td><td>${r.a}</td><td>${r.b}</td><td>${r.c}</td></tr>`).join("")}</table></div>`;
      const finalOpts=shuffle(opts); return makeMC("Konzentration Tabellenabgleich",level==="hard"?34:42,question,finalOpts,optIdx(finalOpts,correct),`In der Tabelle gehört ${target.k} zu ${target.a}, ${target.b}, ${target.c}.`,"focusgrid",{focusHTML:tableHtml,signatureSeed:JSON.stringify(table)+"|"+question});
    },

    visualJump(level) {
      const rows = level==="hard" ? 8 : 6;
      const letters = "ABCDEFGHJKLMNPQRSTUVWXYZ".split("");
      const areas = ["Nord","Süd","Ost","West","Mitte","Lager","Büro","Server"];
      const states = ["OK","PRÜFEN","STOP","WARTEN","AKTIV"];
      const table = [];
      for(let i=0;i<rows;i++) {
        table.push({
          code: choice(letters)+rand(10,99)+choice(letters),
          area: choice(areas),
          state: choice(states),
          value: rand(100,999)
        });
      }
      const target = choice(table);
      const ask = choice(["area","state","value"]);
      let correct, question;
      if(ask==="area"){correct=target.area; question=`Suche den Code <b>${target.code}</b>. Welcher Bereich gehört dazu?`;}
      else if(ask==="state"){correct=target.state; question=`Suche den Code <b>${target.code}</b>. Welcher Status gehört dazu?`;}
      else {correct=String(target.value); question=`Suche den Code <b>${target.code}</b>. Welche Zahl gehört dazu?`;}
      const pool = ask==="area"?areas:ask==="state"?states:table.map(r=>String(r.value));
      const opts = shuffle([...new Set([correct,...shuffle(pool.filter(x=>x!==correct)).slice(0,3)])]).slice(0,4);
      if(!opts.includes(correct)) opts[0]=correct;
      const finalOpts=shuffle(opts);
      const visual=`<div class="visualBox"><div class="concentration-rule"><b>Blicksprung:</b> Merke den Zielcode und springe dann in die Tabelle.</div><div class="jump-grid"><div class="jump-card"><b>Zielcode</b><div class="jump-code">${target.code}</div></div><div class="jump-card"><b>Tabelle</b><table class="scan-table"><tr><th>Code</th><th>Bereich</th><th>Status</th><th>Zahl</th></tr>${table.map(r=>`<tr><td>${r.code}</td><td>${r.area}</td><td>${r.state}</td><td>${r.value}</td></tr>`).join("")}</table></div></div></div>`;
      return makeMC("Konzentration Blicksprung",level==="hard"?30:38,question,finalOpts,optIdx(finalOpts,correct),`Beim Code ${target.code} steht: ${target.area}, ${target.state}, ${target.value}.`,"focusgrid",{focusHTML:visual,signatureSeed:JSON.stringify(table)+"|"+question});
    },
    errorSearch(level) {
      const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
      const len = level==="hard" ? 12 : 9;
      const rows = level==="hard" ? 7 : 5;
      let base = "";
      for(let i=0;i<len;i++) base += choice(chars.split(""));
      const lines = [];
      const diffIndex = rand(0, rows-1);
      let diffPos = rand(0, len-1);
      for(let r=0;r<rows;r++) {
        if(r===diffIndex) {
          let arr = base.split("");
          arr[diffPos] = choice(chars.split("").filter(x=>x!==arr[diffPos]));
          lines.push(arr.join(""));
        } else lines.push(base);
      }
      const correct = String(diffIndex+1);
      const opts = shuffle(["1","2","3","4","5","6","7"].slice(0,rows));
      const visual=`<div class="visualBox"><div class="concentration-rule"><b>Zeichenfehler-Suche:</b> Genau eine Zeile unterscheidet sich.</div>${lines.map((l,i)=>`<div class="error-line">${i+1}: ${l}</div>`).join("")}</div>`;
      return makeMC("Konzentration Zeichenfehler",level==="hard"?28:36,"Welche Zeile unterscheidet sich von den anderen?",opts,optIdx(opts,correct),`Zeile ${correct} unterscheidet sich an Position ${diffPos+1}.`,"focusgrid",{focusHTML:visual,signatureSeed:lines.join("|")});
    },
    numberScan(level) {
      const total = level==="hard" ? 100 : 70;
      const targetRule = choice(["even7","gt80","double","ends5"]);
      let nums=[], count=0, ruleText="";
      for(let i=0;i<total;i++) {
        const n = rand(10,99);
        nums.push(n);
        if(targetRule==="even7" && n%2===0 && String(n).includes("7")) count++;
        if(targetRule==="gt80" && n>80) count++;
        if(targetRule==="double" && String(n)[0]===String(n)[1]) count++;
        if(targetRule==="ends5" && n%10===5) count++;
      }
      if(targetRule==="even7") ruleText="gerade Zahlen, die eine 7 enthalten";
      if(targetRule==="gt80") ruleText="Zahlen größer als 80";
      if(targetRule==="double") ruleText="Doppelzahlen wie 22, 33, 44";
      if(targetRule==="ends5") ruleText="Zahlen, die auf 5 enden";
      const opts=shuffle([count,count+1,Math.max(0,count-1),count+2]).map(String);
      const visual=`<div class="visualBox"><div class="concentration-rule"><b>Zahlenscan:</b> Zähle nur: ${ruleText}.</div><div class="focus-grid">${nums.map(n=>`<span class="focus-token">${n}</span>`).join("")}</div></div>`;
      return makeMC("Konzentration Zahlenscan",level==="hard"?30:38,`Wie viele Treffer erfüllen die Regel: <b>${ruleText}</b>?`,opts,optIdx(opts,String(count)),`Treffer nach Regel „${ruleText}“: ${count}.`,"focusgrid",{focusHTML:visual,signatureSeed:nums.join("-")+"|"+targetRule});
    },
    tableComparePro(level) {
      const rows = level==="hard" ? 9 : 7;
      const items = [];
      const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ".split("");
      for(let i=0;i<rows;i++) {
        const id = choice(chars)+rand(100,999);
        const qty = rand(1,9);
        const shelf = choice(["A1","B2","C3","D4","E5","F6"]);
        items.push({id,qty,shelf});
      }
      const changedIndex = rand(0, rows-1);
      const right = items.map((r,i)=>{
        if(i!==changedIndex) return {...r};
        const type=choice(["qty","shelf"]);
        if(type==="qty") return {...r,qty:r.qty+rand(1,3)};
        return {...r,shelf:choice(["A1","B2","C3","D4","E5","F6"].filter(x=>x!==r.shelf))};
      });
      const correct = items[changedIndex].id;
      const opts = shuffle([correct,...shuffle(items.filter((_,i)=>i!==changedIndex).map(r=>r.id)).slice(0,3)]);
      const visual=`<div class="visualBox"><div class="concentration-rule"><b>Tabellenvergleich:</b> Links und rechts vergleichen. Genau ein Datensatz ist verändert.</div><div class="jump-grid"><div class="jump-card"><b>Liste A</b><table class="scan-table"><tr><th>ID</th><th>Menge</th><th>Fach</th></tr>${items.map(r=>`<tr><td>${r.id}</td><td>${r.qty}</td><td>${r.shelf}</td></tr>`).join("")}</table></div><div class="jump-card"><b>Liste B</b><table class="scan-table"><tr><th>ID</th><th>Menge</th><th>Fach</th></tr>${right.map(r=>`<tr><td>${r.id}</td><td>${r.qty}</td><td>${r.shelf}</td></tr>`).join("")}</table></div></div></div>`;
      return makeMC("Konzentration Tabellenvergleich",level==="hard"?42:52,"Welche ID wurde in Liste B verändert?",opts,optIdx(opts,correct),`Verändert wurde die ID ${correct}.`,"focusgrid",{focusHTML:visual,signatureSeed:JSON.stringify(items)+"|"+JSON.stringify(right)});
    },




    visualGearsPro(level) {
      const count=level==="hard"?rand(5,7):rand(4,6), labels="ABCDEFG".split("").slice(0,count), first=Math.random()<.5?"↻":"↺";
      const sameAxis = count>=5 && Math.random()<.55 ? rand(1,count-2) : -1;
      const beltAt = count>=5 && Math.random()<.45 ? rand(2,count-2) : -1;
      const dirs=[];
      for(let i=0;i<count;i++){
        if(i===0) dirs[i]=first;
        else if(i===sameAxis) dirs[i]=dirs[i-1];
        else if(i===beltAt) dirs[i]=dirs[i-1];
        else dirs[i]=dirs[i-1]==="↻"?"↺":"↻";
      }
      const target=count-1, correct=dirs[target]==="↻"?"↻ Uhrzeigersinn":"↺ Gegenuhrzeigersinn";
      const opts=shuffle(["↻ Uhrzeigersinn","↺ Gegenuhrzeigersinn","blockiert","nicht bestimmbar"]);
      return makeMC("Visual IQ Zahnräder",32,`Zahnrad A dreht ${first==="↻"?"im Uhrzeigersinn":"gegen den Uhrzeigersinn"}. In welche Richtung dreht sich Zahnrad ${labels[target]}?`,opts,optIdx(opts,correct),`Greifende Zahnräder wechseln die Richtung. Gleiche Achse und offener Riemen behalten die Richtung. Ergebnis: ${correct}.`,"visualIQ",{visualIQ:{nd:"gearsPro",labels,dirs,shown:dirs.map((d,i)=>i===0?d:"?"),sameAxis,beltAt}});
    },
    visualMirror(level) {
      const axis=choice(["vertical","horizontal","point"]);
      const shapes=["triangle","arrow","lshape","dotbar"], shape=choice(shapes);
      const map={vertical:"vertikal",horizontal:"horizontal",point:"punktgespiegelt"};
      const correct=axis==="vertical"?"Bild B":axis==="horizontal"?"Bild C":"Bild D";
      const opts=shuffle(["Bild A","Bild B","Bild C","Bild D"]);
      return makeMC("Visual IQ Spiegelung",30,`Welche Antwort zeigt die Figur korrekt ${map[axis]} gespiegelt?`,opts,optIdx(opts,correct),`Die korrekte ${map[axis]}e Spiegelung ist ${correct}.`,"visualIQ",{visualIQ:{nd:"mirror",axis,shape}});
    },
    visualCubeRotation(level) {
      const variant=choice(["same","opposite","impossible"]);
      const correct=variant==="same"?"Würfel B":variant==="opposite"?"Würfel C":"Würfel D";
      const opts=shuffle(["Würfel A","Würfel B","Würfel C","Würfel D"]);
      return makeMC("Visual IQ Würfelrotation",38,"Welcher Würfel kann durch Drehen des Ausgangswürfels entstehen?",opts,optIdx(opts,correct),`Bei Würfelrotation bleiben Nachbarschaften der Symbole erhalten. Richtig ist ${correct}.`,"visualIQ",{visualIQ:{nd:"cube",variant}});
    },
    visualFolding(level) {
      const pattern=choice(["corner","diagonal","double"]);
      const correct=pattern==="corner"?"Muster A":pattern==="diagonal"?"Muster C":"Muster D";
      const opts=shuffle(["Muster A","Muster B","Muster C","Muster D"]);
      return makeMC("Visual IQ Faltfiguren",36,"Ein Blatt wird gefaltet und gelocht. Welches Muster entsteht nach dem Aufklappen?",opts,optIdx(opts,correct),`Beim Aufklappen spiegeln sich die Löcher an den Faltachsen. Richtig ist ${correct}.`,"visualIQ",{visualIQ:{nd:"fold",pattern}});
    },
    visualMatrixIQ(level) {
      const rule=choice(["addShape","rotate","fill"]);
      let correct="Option C";
      if(rule==="rotate") correct="Option B";
      if(rule==="fill") correct="Option D";
      const opts=shuffle(["Option A","Option B","Option C","Option D"]);
      return makeMC("Visual IQ Matrizen",40,"Welche Option ergänzt die Matrix logisch?",opts,optIdx(opts,correct),`Die Matrix kombiniert eine feste Regel pro Zeile und Spalte. Richtig ist ${correct}.`,"visualIQ",{visualIQ:{nd:"matrixIQ",rule}});
    },
    visualCircuit(level) {
      const scenario=choice(["openSwitch","parallel","short"]);
      let correct, q, ex;
      if(scenario==="openSwitch"){q="Welche Lampe leuchtet, wenn Schalter S1 offen und S2 geschlossen ist?"; correct="nur Lampe 2"; ex="Der offene Schalter S1 unterbricht den linken Zweig. Der rechte Zweig ist geschlossen.";}
      else if(scenario==="parallel"){q="Was passiert, wenn Lampe 1 im Parallelzweig defekt ist?"; correct="Lampe 2 leuchtet weiter"; ex="Bei Parallelschaltung bleibt der andere Zweig funktionsfähig.";}
      else {q="Wo liegt der Fehler im Stromlaufplan?"; correct="Kurzschluss über Lampe 1"; ex="Die Leitung überbrückt Lampe 1. Strom nimmt den direkten Weg.";}
      const opts=shuffle([correct,"beide Lampen aus","beide Lampen leuchten","nicht bestimmbar"]);
      return makeMC("Visual IQ Stromlaufplan",42,q,opts,optIdx(opts,correct),ex,"visualIQ",{visualIQ:{nd:"circuit",scenario}});
    },
    visualMechanicsPro(level) {
      const scenario=choice(["lever","pulley","water","slope"]);
      let q, correct, ex;
      if(scenario==="lever"){q="Welche Seite des Hebels sinkt nach unten?"; correct="rechts"; ex="Drehmoment = Kraft × Abstand. Rechts wirkt das größere Drehmoment.";}
      else if(scenario==="pulley"){q="Welche Last ist leichter zu heben?"; correct="System B"; ex="Mehr tragende Seilabschnitte verringern die benötigte Zugkraft.";}
      else if(scenario==="water"){q="Welcher Behälter füllt sich zuerst?"; correct="Behälter 2"; ex="Der offene, tiefere Kanal wird zuerst erreicht.";}
      else {q="Welcher Körper rollt schneller nach unten?"; correct="der glatte Zylinder"; ex="Weniger Reibung und günstige Form bedeuten schnelleres Rollen.";}
      const opts=shuffle([correct,"links","beide gleich","nicht bestimmbar"]);
      return makeMC("Visual IQ Mechanik",40,q,opts,optIdx(opts,correct),ex,"visualIQ",{visualIQ:{nd:"mechanics",scenario}});
    },
    visualTechnical(level) {
      const scenario=choice(["pressure","support","block","drive"]);
      let q, correct, ex;
      if(scenario==="pressure"){q="Wo ist der Druck am größten?"; correct="unten am tiefsten Punkt"; ex="Flüssigkeitsdruck steigt mit der Tiefe.";}
      else if(scenario==="support"){q="Welche Konstruktion ist am stabilsten?"; correct="Dreieckskonstruktion"; ex="Dreiecke versteifen Konstruktionen besser als offene Rechtecke.";}
      else if(scenario==="block"){q="Welches Bauteil blockiert die Bewegung?"; correct="Bauteil C"; ex="C liegt quer zur Bewegungsrichtung und verhindert den Lauf.";}
      else {q="Welche Scheibe dreht sich am schnellsten?"; correct="die kleinste Scheibe"; ex="Bei gleicher Riemengeschwindigkeit dreht die kleinste Scheibe am schnellsten.";}
      const opts=shuffle([correct,"Bauteil A","Bauteil B","nicht bestimmbar"]);
      return makeMC("Technisches Verständnis",38,q,opts,optIdx(opts,correct),ex,"visualIQ",{visualIQ:{nd:"technical",scenario}});
    },
    visualIQ(level) { return choice([Generators.visualGearsPro,Generators.visualMirror,Generators.visualCubeRotation,Generators.visualFolding,Generators.visualMatrixIQ,Generators.visualCircuit,Generators.visualMechanicsPro,Generators.visualTechnical])(level); },


    ctcMathSprint(level) {
      const q=choice([Generators.mul,Generators.div,Generators.percent,Generators.arithmetic,Generators.percentReverse,Generators.dreisatz])(level);
      q.cat="Mathe-Sprint"; q.group="Mathe"; q.time=27; q.ex=(q.ex||"")+" Mathe-Sprint: 9 Aufgaben in 5 Minuten bedeutet schnelle Priorisierung.";
      return q;
    },


    routeMemory(level) {
      const streetPool=["Bahnhofstraße","Gartenweg","Schulstraße","Lindenallee","Marktstraße","Hafenweg","Rosenweg","Mozartstraße","Berliner Straße","Ulmer Weg","Eselsbergstraße","Donaustraße","Buchenweg","Kirchplatz","Mühlweg","Parkallee","Sonnenstraße","Jahnstraße","Friedrichstraße","Kanalweg","Wiesenweg","Neue Straße"];
      const count=level==="hard"?rand(8,10):level==="easy"?rand(6,7):rand(7,9);
      const route=shuffle(streetPool).slice(0,count);
      const distractors=shuffle(streetPool.filter(x=>!route.includes(x))).slice(0,Math.max(2,10-count));
      const optionPool=shuffle([...route,...distractors]);
      return makeMC(
        "Gedächtnisroute",
        90,
        "Merke dir die Busroute. Nach der Animation tippe die Straßen <b>in der richtigen Reihenfolge</b> an.",
        optionPool,
        -1,
        `Richtige Reihenfolge: ${route.join(" → ")}.`,
        "routeMemory",
        {routeStreets:route,routeOptions:optionPool,routeDuration:20,routeReady:false,routeSelected:[],routeChecked:false,signatureSeed:route.join("|")}
      );
    },


    bigEDV(errorIndex) {
      // Legacy-EDV-Einzelfragen werden nicht mehr erzeugt.
      // Fallback bleibt nur als Kompatibilitätsanker für alte Speicherstände bestehen.
      return this.bigEDVMulti();
    },
    bigEDVMulti() {
      const correctIds=EDV_ERRORS.map(x=>x.id);
      return makeMC(
        "EDV Diagramm PRO",
        15*60,
        `EDV-Großschema: In der dargestellten Seite sind <b>genau ${correctIds.length} Fehler</b> versteckt. Tippe alle fehlerhaften Schema-Einträge an. Erneutes Tippen wählt wieder ab.`,
        EDV_SCHEMA.map(x=>`${x.id}: ${x.text}`),
        0,
        `Richtige Fehler: ${correctIds.join(", ")}.`,
        "edvmulti",
        {edvCorrectIds:correctIds, edvMultiSelected:[], edvRequiredCount:correctIds.length, block:"5. EDV Kenntnisse", signatureSeed:"edv-multi-v702-cloud-highscore"}
      );
    },
    bigEDVCovered(slot) {
      return makeMC(
        "EDV Diagramm PRO",
        1,
        "EDV-Platzhalter: Dieser Punkt wird durch die Gesamt-EDV-Aufgabe automatisch ausgewertet.",
        ["EDV-Gesamtaufgabe"],
        0,
        "Die EDV-Fehler werden gesammelt über die Multi-Auswahl bewertet.",
        "edvcovered",
        {block:"5. EDV Kenntnisse", signatureSeed:"edv-covered-v702-"+slot}
      );
    }
  };




  function renderEdvProHTML(q) {
    const selectedList = q && Array.isArray(q.edvMultiSelected) ? q.edvMultiSelected : [];
    return `<div class="visualBox edv-pro-wrap">
      <div class="edv-pro-story"><b>EDV-Großschema:</b> ${EDV_STORY}<br><span class="small">Aufgabe: Tippe alle fehlerhaften Einträge an. Erneutes Tippen entfernt die Auswahl.</span></div>
      <div class="edv-mini-legend"><span>Logikfehler</span><span>Pfeilfehler</span><span>Inhaltsfehler</span><span>${EDV_ERRORS.length} Fehler versteckt</span></div>
      <div class="edv-pro-grid">
        ${EDV_SCHEMA.map(x=>{
          const n = selectedList.indexOf(x.id);
          const cls = n >= 0 ? " selected" : "";
          return `<div class="edv-node${cls}" id="edvNode_${x.id}" onclick="App.toggleEdvMultiNode('${x.id}')">
            <span class="edv-node-id">${x.id}</span>${n>=0 ? `<span class="edv-node-order">${n+1}</span>` : ""}
            <div class="edv-node-text">${x.text}</div>
          </div>`;
        }).join("")}
      </div>
    </div>`;
  }





/* MultiChoiceModule, Memory, Route-Memory, Profilverwaltung und interaktive Spezialmodule. */
  const MultiChoiceModule = {
    init(q, field, maxCount) {
      if(!q[field] || !Array.isArray(q[field])) q[field] = [];
      if(maxCount) q[field] = q[field].slice(0, maxCount);
      return q[field];
    },
    toggle(q, field, value, maxCount) {
      const list=this.init(q, field, maxCount);
      const pos=list.indexOf(value);
      if(pos>=0){ list.splice(pos,1); return {ok:true, action:"removed", list}; }
      if(maxCount && list.length>=maxCount) return {ok:false, action:"max", list};
      list.push(value); return {ok:true, action:"added", list};
    },
    undo(q, field){ const list=this.init(q, field); list.pop(); return list; },
    clear(q, field){ q[field]=[]; return q[field]; },
    chips(list, labelFn, onClickFn){ return (list||[]).map((value,i)=>`<span class="route-chip clickable" onclick="${onClickFn(value)}">${i+1}. ${escHTML(labelFn(value))}</span>`).join(""); },
    sameOrder(selected, correct){ return selected.length===correct.length && correct.every((v,i)=>selected[i]===v); }
  };


  function memoryItems() {
    const tasks=["Kartonagen abholen","Monatsabrechnung prüfen","Druckauftrag abliefern","Werkzeugkoffer abholen","Unterlagen abgeben","Materialliste kontrollieren","Besprechung mit Ausbilder","Ersatzteil abholen","PC-Arbeitsplatz prüfen","Ausgangspost wegbringen"], places=["Lager Nord","Büro 2","Druckerei Melzer","Werkstatt Brandel","Hauptverwaltung","Poststelle Kitzingen","Raum 304","IT-Service","Empfang Süd","Archiv Keller"], times=["08:00","08:35","09:10","09:45","10:20","11:05","12:15","13:10","14:30","15:05","16:20","17:00","17:35"];
    const items=[],usedT=new Set(),usedTask=new Set(),usedPlace=new Set();
    while(items.length<8){const t=choice(times),ta=choice(tasks),p=choice(places); if(!usedT.has(t)&&!usedTask.has(ta)&&!usedPlace.has(p)){usedT.add(t);usedTask.add(ta);usedPlace.add(p);items.push({time:t,task:ta,place:p});}}
    return items.sort((a,b)=>a.time.localeCompare(b.time));
  }
  function generateMemoryQuestions() {
    const qs=[];
    state.memoryItems.forEach(item=>{
      const type=rand(1,3);
      if(type===1){const wrong=shuffle(state.memoryItems.filter(x=>x!==item).map(x=>x.place)).slice(0,3), opts=shuffle([item.place,...wrong]); qs.push(makeMC("Gedächtnis",22,`Wo findet/liegt „${item.task}“ statt?`,opts,optIdx(opts,item.place),`Merkliste: ${item.time}, ${item.task}, ${item.place}.`));}
      else if(type===2){const wrong=shuffle(state.memoryItems.filter(x=>x!==item).map(x=>x.time)).slice(0,3), opts=shuffle([item.time,...wrong]); qs.push(makeMC("Gedächtnis",22,`Um wie viel Uhr steht „${item.task}“ an?`,opts,optIdx(opts,item.time),`Merkliste: ${item.task} um ${item.time}.`));}
      else {const wrong=shuffle(state.memoryItems.filter(x=>x!==item).map(x=>x.task)).slice(0,3), opts=shuffle([item.task,...wrong]); qs.push(makeMC("Gedächtnis",22,`Welche Aufgabe gehört zu ${item.time} / ${item.place}?`,opts,optIdx(opts,item.task),`Merkliste: ${item.time}, ${item.task}, ${item.place}.`));}
    });
    return shuffle(qs).slice(0,6);
  }

  function memoryHtml(){return `<table class="mem-table"><tr><th>Zeit</th><th>Aufgabe</th><th>Ort</th></tr>${state.memoryItems.map(i=>`<tr><td>${i.time}</td><td>${i.task}</td><td>${i.place}</td></tr>`).join("")}</table>`;}

  function adaptiveWeakCats() {
    const stats={};
    state.history.filter(Boolean).forEach(h=>{ if(!stats[h.group])stats[h.group]={n:0,bad:0,slow:0}; stats[h.group].n++; if(!h.correct)stats[h.group].bad++; if(h.duration>h.allowed*750)stats[h.group].slow++; });
    const arr=Object.keys(stats).map(k=>({cat:k,score:(stats[k].bad*2+stats[k].slow)/Math.max(1,stats[k].n)})).sort((a,b)=>b.score-a.score);
    return arr.length?arr.slice(0,3).map(x=>x.cat):[];
  }
  function generatorByCat(cat) {
    const map = {
      "Mathe":Generators.math,"Logik":Generators.logic,"Allgemeinwissen":Generators.knowledge,"Englisch":Generators.english,"IT/FISI":Generators.it,
      "Konzentration":()=>choice([Generators.attention,Generators.codeCompare,Generators.focusScanner,Generators.symbolSearch,Generators.tableScan,Generators.visualJump,Generators.errorSearch,Generators.numberScan,Generators.tableComparePro])("medium"),"Mechanik":()=>choice([Generators.gear,Generators.belt])("medium"),
      "Raumdenken":()=>choice([Generators.spatial,Generators.net])("medium"),"Visual IQ":()=>Generators.visualIQ("medium"),"Gedächtnis":()=>{ if(Math.random()<.45)return Generators.routeMemory("medium"); if(!state.adaptiveMemoryPool.length)state.adaptiveMemoryPool=generateMemoryQuestions(); const q=state.adaptiveMemoryPool.shift()||Generators.knowledge("medium"); q.group="Gedächtnis"; return q;}
    };
    return map[cat] || Generators.math;
  }
  function buildAdaptiveQuestion(i,total) {
    const coach=CoachEngine.build(getResults());
    return DynamicGeneratorEngine.buildQuestion(i,total,coach);
  }

  function generateQuestionForMode(mode,index,total) {
    const level=levelFor(mode,index,total);
    if(mode==="ctcLohr") {
      let q;
      if(index<40){ q=Generators.knowledge("medium"); q.block="1. Allgemeinwissen"; }
      else if(index<49){ q=Generators.ctcMathSprint(index<44?"easy":"medium"); q.block="2. Mathe"; }
      else if(index<67){ q=choice([Generators.series,Generators.matrix,Generators.opinionFact,Generators.statementLogic,Generators.symbolSeries])("medium"); q.block="3. Logik"; }
      else if(index<82){ q=choice([Generators.pqStrike,Generators.focusScanner,Generators.symbolSearch,Generators.tableScan,Generators.visualJump,Generators.errorSearch,Generators.numberScan,Generators.tableComparePro,Generators.attention,Generators.codeCompare,Generators.fractionRuleEignungstest,Generators.tableCode])("medium"); q.block="4. Konzentration"; }
      else { q=(index===82?Generators.bigEDVMulti():Generators.bigEDVCovered(index-82)); q.block="5. EDV Kenntnisse"; }
      q.group=groupFor(q.cat); q.signature=stableSignature(q)+"|ctc|"+(q.signatureSeed||index); return q;
    }
    if(mode==="ctc") return buildAdaptiveQuestion(index,total);
    const pools = {
      math:[Generators.math], logic:[Generators.logic],
      jogging:[Generators.math,Generators.logic,Generators.knowledge,Generators.english,Generators.it,Generators.attention,Generators.codeCompare,Generators.focusScanner,Generators.symbolSearch,Generators.visualJump,Generators.numberScan,Generators.routeMemory,Generators.visualIQ],
      bps:[Generators.analogy,Generators.series,Generators.symbolSeries,Generators.spatial,Generators.net,Generators.belt,Generators.arithmetic,Generators.fraction,Generators.percentReverse,Generators.area,Generators.dreisatz,Generators.knowledge,Generators.english,Generators.it,Generators.attention,Generators.codeCompare,Generators.focusScanner,Generators.symbolSearch,Generators.tableScan,Generators.visualJump,Generators.errorSearch,Generators.numberScan,Generators.tableComparePro,Generators.opinionFact,Generators.routeMemory,Generators.visualIQ],
      ctc:[Generators.ctcMathSprint,Generators.series,Generators.matrix,Generators.gear,Generators.belt,Generators.arithmetic,Generators.percentReverse,Generators.fraction,Generators.dreisatz,Generators.attention,Generators.codeCompare,Generators.focusScanner,Generators.symbolSearch,Generators.tableScan,Generators.visualJump,Generators.errorSearch,Generators.numberScan,Generators.tableComparePro,Generators.statementLogic,Generators.spatial,Generators.analogy,Generators.english,Generators.it,Generators.opinionFact,Generators.fractionRuleEignungstest,Generators.tableCode,Generators.routeMemory,Generators.visualIQ],
      general:[Generators.knowledge], english:[Generators.english], it:[Generators.it], concentrationPro:[Generators.focusScanner,Generators.symbolSearch,Generators.tableScan,Generators.visualJump,Generators.errorSearch,Generators.numberScan,Generators.tableComparePro,Generators.codeCompare,Generators.attention,Generators.pqStrike], routeMemoryMode:[Generators.routeMemory],
      visualIQ:[Generators.visualIQ,Generators.visualGearsPro,Generators.visualMirror,Generators.visualCubeRotation,Generators.visualFolding,Generators.visualMatrixIQ,Generators.visualCircuit,Generators.visualMechanicsPro,Generators.visualTechnical],
      mathSprint:[Generators.ctcMathSprint,Generators.mul,Generators.div,Generators.percent,Generators.percentReverse,Generators.fraction,Generators.arithmetic,Generators.dreisatz,Generators.area],
      logicSprint:[Generators.series,Generators.matrix,Generators.symbolSeries,Generators.statementLogic,Generators.opinionFact,Generators.analogy],
      concentrationSprint:[Generators.focusScanner,Generators.symbolSearch,Generators.tableScan,Generators.visualJump,Generators.errorSearch,Generators.numberScan,Generators.tableComparePro,Generators.codeCompare,Generators.attention,Generators.pqStrike],
      visualIQSprint:[Generators.visualIQ,Generators.visualGearsPro,Generators.visualMirror,Generators.visualCubeRotation,Generators.visualFolding,Generators.visualMatrixIQ,Generators.visualCircuit,Generators.visualMechanicsPro,Generators.visualTechnical],
      itSprint:[Generators.it,Generators.itScenario],
      knowledgeSprint:[Generators.knowledge],
      techniqueSprint:[Generators.visualGearsPro,Generators.visualCircuit,Generators.visualMechanicsPro,Generators.visualTechnical,Generators.gear,Generators.belt,Generators.spatial,Generators.net],
      errorTrainingPrep:[Generators.ctcMathSprint,Generators.series,Generators.matrix,Generators.focusScanner,Generators.tableComparePro,Generators.visualIQ,Generators.it,Generators.knowledge,Generators.routeMemory]
    };
    const q=choice(pools[mode]||pools.jogging)(level); q.group=groupFor(q.cat); q.signature=stableSignature(q); return q;
  }
  function buildQuiz() {
    state.usedQuestions.clear();
    const mode=state.selectedMode, m=MODES[mode], seen=new Set(), out=[]; let tries=0;
    if(mode==="ctc") { state.adaptiveMemoryPool=generateMemoryQuestions(); return [Guard.repairQuestion(buildAdaptiveQuestion(0,m.amount))]; }

    const memoryQs = m.memory ? generateMemoryQuestions().map(q=>{q.group="Gedächtnis"; q.signature=stableSignature(q); return q;}) : [];
    const targetCoreAmount = Math.max(0, m.amount - memoryQs.length);

    while(out.length<targetCoreAmount && tries<m.amount*180) {
      tries++;
      const q=generateQuestionForMode(mode,out.length,m.amount);
      if(!seen.has(q.signature)){seen.add(q.signature); out.push(q);}
    }
    while(out.length<targetCoreAmount) {
      const q=generateQuestionForMode(mode,out.length,m.amount);
      q.signature=stableSignature(q)+"|fallback|"+out.length+"|"+Math.random();
      out.push(q);
    }
    memoryQs.forEach(q=>{ if(!seen.has(q.signature)){out.push(q); seen.add(q.signature);} });
    const finalQuiz = mode==="ctcLohr" ? out : shuffle(out);
    return finalQuiz.slice(0,m.amount);
  }

  function clearRouteTimers(){
    (state.routeTimers||[]).forEach(t=>{ if(t.kind==="interval") clearInterval(t.id); else clearTimeout(t.id); });
    state.routeTimers=[];
  }
  function hideAll(){["start","memory","blockIntro","quiz","result","analysis"].forEach(id=>$(id).classList.add("hidden"));}

  function createPlayerId(){
    try{
      if(window.crypto && crypto.randomUUID) return "plr_" + crypto.randomUUID();
    }catch(e){}
    return "plr_" + Math.random().toString(36).slice(2) + Date.now().toString(36);
  }
  function normalizeProfile(profile={}){
    const base={player_id:createPlayerId(),name:"",createdAt:new Date().toISOString(),settings:{mobileCompact:true},stats:{}};
    const p = profile && typeof profile === "object" ? profile : {};
    const migratedName = String(p.name || p.display_name || "").trim().slice(0,32);
    return {...base,...p,player_id:String(p.player_id || p.profileId || p.id || base.player_id),name:migratedName,display_name:migratedName,settings:{...base.settings,...(p.settings||{})},stats:{...base.stats,...(p.stats||{})}};
  }
  function readProfile(){
    try{
      let raw=localStorage.getItem(PROFILE_KEY);
      if(!raw){
        for(const legacyKey of PROFILE_LEGACY_KEYS){
          const legacyRaw=localStorage.getItem(legacyKey);
          if(legacyRaw){ raw=legacyRaw; break; }
        }
      }
      const profile = normalizeProfile(raw ? JSON.parse(raw) : {});
      localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
      return profile;
    } catch(e){
      const profile=normalizeProfile({});
      try{localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));}catch(_e){}
      return profile;
    }
  }
  function writeProfile(profile){
    try{
      const normalized=normalizeProfile({...readProfile(),...(profile||{}),updatedAt:new Date().toISOString()});
      localStorage.setItem(PROFILE_KEY,JSON.stringify(normalized));
      return true;
    }catch(e){return false;}
  }
  function saveProfileName(sourceEl){
    const active = sourceEl && sourceEl.value !== undefined ? sourceEl : document.activeElement;
    const profileInput = $("profileEditNameInput");
    const setupInput = $("profileNameInput");
    const candidates = [active, profileInput, setupInput].filter(Boolean);
    const input = candidates.find(el => el && el.value !== undefined && String(el.value || "").trim()) || profileInput || setupInput;
    const name=(input && input.value ? input.value : "").trim().replace(/\s+/g," ").slice(0,32);
    if(!name){
      if(input) { input.focus(); input.classList.add("input-error"); setTimeout(()=>input.classList.remove("input-error"),900); }
      showProfileSaveState("Bitte Namen eingeben");
      return false;
    }
    const p=readProfile();
    const ok=writeProfile({...p,name,display_name:name});
    if(ok){
      syncLocalResultNames(name, p.player_id);
      renderModes();
      requestAnimationFrame(()=>{
        if($("profileNameInput")) $("profileNameInput").value = name;
        if($("profileEditNameInput")) $("profileEditNameInput").value = name;
        showProfileSaveState("Gespeichert ✓");
      });
    } else {
      showProfileSaveState("Speichern fehlgeschlagen");
    }
    return ok;
  }
  function syncLocalResultNames(name, playerId){
    try{
      const results=getResults();
      if(!Array.isArray(results) || !results.length) return;
      const updated=results.map(r=>{
        const belongsToPlayer = playerId && r.player_id && String(r.player_id) === String(playerId);
        const hasNoPlayer = !r.player_id || r.player_name === "Gast" || r.player_name === "Tablet Test";
        return (belongsToPlayer || hasNoPlayer) ? {...r,player_id:playerId,player_name:name,display_name:name} : r;
      });
      StorageEngine.write(updated);
    }catch(_e){}
  }
  function showProfileSaveState(text){
    try{
      let el=$("profileSaveState");
      if(!el){
        el=document.createElement("div");
        el.id="profileSaveState";
        el.className="profile-save-state floating-profile-state";
        document.body.appendChild(el);
      }
      el.textContent=text;
      el.classList.add("show");
      setTimeout(()=>el.classList.remove("show"),1800);
    }catch(_e){}
  }
  function renderProfileManager(){
    const p=readProfile();
    const idShort=String(p.player_id||"").replace(/^plr_/,'').slice(0,12) || "lokal";
    return `<div class="premium-card profile-manager-card">
      <span class="coach-badge">Profilverwaltung V7.0.2</span>
      <div class="coach-action">Name ändern</div>
      <p class="small">Dein sichtbarer Name kann geändert werden. Die interne Spieler-ID bleibt gleich, damit lokale Ergebnisse und spätere Sync-Funktionen stabil bleiben.</p>
      <div class="profile-edit-row"><input id="profileEditNameInput" data-profile-name-input="1" maxlength="32" value="${escHTML(p.name||"")}" placeholder="Dein Name" autocomplete="name" enterkeyhint="done"><button type="button" data-action="save-profile-name" onclick="App.saveProfileName()">Speichern</button></div><div id="profileSaveState" class="profile-save-state" aria-live="polite"></div>
      <div class="profile-meta"><span>Spieler-ID</span><code>${escHTML(idShort)}</code></div>
      <div class="profile-meta"><span>Stand</span><b>${escHTML(APP_VERSION)}</b></div>
    </div>`;
  }
  function rankForPercent(percent){
    const p=Math.max(0,Math.min(100,Number(percent)||0));
    if(p>=85) return {name:"Diamond",min:85,next:100,color:"#67e8f9",progress:100,label:"Elite-Niveau"};
    if(p>=70) return {name:"Platin",min:70,next:85,color:"#a78bfa",progress:Math.round((p-70)/15*100),label:`${85-p}% bis Diamond`};
    if(p>=55) return {name:"Gold",min:55,next:70,color:"#f59e0b",progress:Math.round((p-55)/15*100),label:`${70-p}% bis Platin`};
    if(p>=40) return {name:"Silber",min:40,next:55,color:"#94a3b8",progress:Math.round((p-40)/15*100),label:`${55-p}% bis Gold`};
    return {name:"Bronze",min:0,next:40,color:"#b45309",progress:Math.round(p/40*100),label:`${40-p}% bis Silber`};
  }
  function timeGreeting(){
    const h=new Date().getHours();
    if(h<11) return "Guten Morgen";
    if(h<17) return "Guten Tag";
    if(h<22) return "Guten Abend";
    return "Bereit für eine Nachtschicht";
  }
  function dashboardStats(){
    const results=getResults();
    const last=results[results.length-1]||null;
    const best=results.length?results.reduce((a,b)=>(b.percent||0)>(a.percent||0)?b:a,results[0]):null;
    const avg=results.length?Math.round(results.reduce((s,r)=>s+(r.percent||0),0)/results.length):0;
    const cats={};
    results.forEach(r=>Object.entries(r.cats||{}).forEach(([cat,o])=>{cats[cat] ||= {n:0,r:0}; cats[cat].n += o.n||0; cats[cat].r += o.r||0;}));
    const weakest=Object.entries(cats).map(([cat,o])=>({cat,p:o.n?Math.round(o.r/o.n*100):0})).sort((a,b)=>a.p-b.p)[0]||null;
    return {results,last,best,avg,weakest,recent:results.slice(-7)};
  }
  function coachRecommendation(stats){
    if(!stats.results.length) return {title:"Erster Lauf",text:"Starte mit Eignungstest Jogging und baue danach gezielt Blocktraining ein.",mode:"jogging"};
    if(stats.weakest){
      const c=stats.weakest.cat;
      if(c.includes("Visual")) return {title:"Visual IQ Sprint",text:`Schwächster Bereich: ${c} (${stats.weakest.p}%).`,mode:"visualIQSprint"};
      if(c.includes("Mathe")) return {title:"Mathe Sprint",text:`Schwächster Bereich: ${c} (${stats.weakest.p}%).`,mode:"mathSprint"};
      if(c.includes("Konzentration")) return {title:"Konzentration Sprint",text:`Schwächster Bereich: ${c} (${stats.weakest.p}%).`,mode:"concentrationSprint"};
      if(c.includes("IT")) return {title:"IT/FISI Sprint",text:`Schwächster Bereich: ${c} (${stats.weakest.p}%).`,mode:"itSprint"};
    }
    return {title:"CTC Elite",text:"Du hast eine solide Basis. Jetzt zählt stabiler Zeitdruck.",mode:"ctc"};
  }
  function renderPremiumDashboard(){
    document.body.classList.add("premium-ui");
    const profile=readProfile();
    const stats=dashboardStats();
    const basePercent=stats.best?.percent || stats.avg || 0;
    const rank=rankForPercent(basePercent);
    const coach=CoachEngine.build(stats.results);
    const coachRec=coach.recommendation;
    if($("premiumGreeting")) $("premiumGreeting").textContent = profile.name ? `${timeGreeting()}, ${profile.name}.` : "Willkommen im Premium Trainer.";
    if($("premiumSubtitle")) $("premiumSubtitle").textContent = profile.name ? "Knack deinen Rekord. Trainiere fokussiert, miss deine Leistung und steig im Rang auf." : "Lege ein lokales Profil an und starte dein persönliches Trainingsdashboard.";
    if($("profileSetup")) $("profileSetup").classList.toggle("hidden", !!profile.name);
    const bars=stats.recent.length ? stats.recent.map(r=>`<span title="${escHTML(r.title)}: ${r.percent}%" style="height:${Math.max(12,Math.min(76,r.percent||0))}px"></span>`).join("") : [18,28,38,48,58,68,78].map(h=>`<span style="height:${h}px;opacity:.35"></span>`).join("");
    const lastText=stats.last?`${stats.last.percent}% · ${stats.last.title}`:"Noch kein Test";
    const bestText=stats.best?`${stats.best.percent}%`:"0%";
    const dash=$("premiumDashboard");
    if(!dash) return;
    dash.innerHTML=`
      <div class="mobile-quick-strip">
        <button onclick="App.quickStartRecommended('${coachRec.mode}')"><b>Start</b><span>${escHTML(coachRec.title)}</span></button>
        <button onclick="App.setAppSection('practice')"><b>Üben</b><span>Module</span></button>
        <button onclick="App.setAppSection('simulation')"><b>CTC</b><span>Simulation</span></button>
        <button onclick="App.setAppSection('profile')"><b>Profil</b><span>Name</span></button>
      </div>
      <div class="premium-card dark dashboard-rank-card">
        <div class="profile-grid">
          <div class="rank-ring" style="--p:${rank.progress}"><div class="rank-ring-inner"><span>${rank.name}</span></div></div>
          <div>
            <div class="premium-mini-label">Dein Rang</div>
            <div class="rank-name">${rank.name}</div>
            <div class="rank-next">${rank.label}${stats.best && stats.best.mode==="ctcLohr" && stats.best.percent>=70 ? " · CTC Gold freigeschaltet" : ""}</div>
            <div class="kpi-row">
              <div class="kpi"><b>Letzter</b><strong>${stats.last?stats.last.percent+"%":"–"}</strong></div>
              <div class="kpi"><b>Rekord</b><strong>${bestText}</strong></div>
              <div class="kpi"><b>Ø</b><strong>${stats.avg}%</strong></div>
            </div>
          </div>
        </div>
      </div>
      <div class="premium-card coach-card dashboard-coach-card">
        <span class="coach-badge">Adaptive Coach</span>
        <div class="coach-action">${escHTML(coachRec.title)}</div>
        <div class="small">${escHTML(coachRec.text)}</div>
        <div class="spark-bars">${bars}</div>
        <div class="small"><b>Letzter Lauf:</b> ${escHTML(lastText)}</div>
        <button class="ghost" onclick="App.quickStartRecommended('${coachRec.mode}')">Empfohlen starten</button>
      </div>
      <details class="mobile-dashboard-more">
        <summary>Mehr Dashboard anzeigen</summary>
        <div class="mobile-more-grid">${HighscoreEngine.renderDashboard(stats.results)}${CoachEngine.renderDashboard(coach)}</div>
      </details>
      <div class="desktop-dashboard-extra">${HighscoreEngine.renderDashboard(stats.results)}${CoachEngine.renderDashboard(coach)}</div>`;
    if($("profileNameInput")) $("profileNameInput").value = profile.name || "";
  }
  function setTrainingFocus(focus){
    TrainingFocusEngine.write(focus);
    const current=TrainingFocusEngine.current();
    if(current.key !== "auto" && MODES[current.mode]) selectMode(current.mode);
    renderPremiumDashboard();
    TrainingFocusEngine.render();
  }

  function quickStartRecommended(mode){
    const focus=TrainingFocusEngine.current();
    const target = focus.key !== "auto" && MODES[focus.mode] ? focus.mode : mode;
    if(MODES[target]) selectMode(target);
    prepareTest();
  }





/* UI-Routing, Rendering, Quizablauf, Ergebnislogik, Review, Health Panel und App-Export. */
  const APP_SECTIONS = {
    dashboard:{title:"Dashboard", icon:"◷", desc:"Live-Status, Lernkurve und Analyse-Kurzblick."},
    practice:{title:"Üben", icon:"✎", desc:"Gezieltes Training ohne Simulationsballast."},
    home:{title:"Start", icon:"◆", desc:"Zentrale Startseite mit Empfehlung und Schnellzugriff.", home:true},
    highscore:{title:"Highscore", icon:"★", desc:"Lokale und Cloud-Ranglisten nach Zeitraum."},
    settings:{title:"Settings", icon:"⚙", desc:"Profil, Cloud, Datenbank und Framework verwalten."}
  };

  const MODE_TABS = {
    basic:{title:"Freies Üben", desc:"Einzelne Bereiche gezielt trainieren.", modes:["math","logic","general","english","it","concentrationPro","routeMemoryMode","visualIQ"]},
    block:{title:"Blocktraining", desc:"Kurze Sprintblöcke für Schwächen und Zeitdruck.", modes:["mathSprint","logicSprint","concentrationSprint","visualIQSprint","itSprint","knowledgeSprint","techniqueSprint","errorTrainingPrep"]}
  };
  const SIMULATION_MODES = ["ctcLohr","ctc","bps","jogging"];

  const TOP_NAV_TABS = {
    home:[
      {key:"start", icon:"🏠", label:"Start", action:"home"},
      {key:"ctc", icon:"▶️", label:"CTC", action:"mode", mode:"ctcLohr", section:"practice"},
      {key:"elite", icon:"⚡", label:"Elite", action:"mode", mode:"ctc", section:"practice"},
      {key:"score", icon:"🏆", label:"Score", action:"section", section:"highscore"}
    ],
    dashboard:[
      {key:"live", icon:"📊", label:"Live", action:"dashboard"},
      {key:"stats", icon:"📈", label:"Stats", action:"dashboard"},
      {key:"focus", icon:"🎯", label:"Fokus", action:"dashboard"},
      {key:"cloud", icon:"☁️", label:"Cloud", action:"dashboard"}
    ],
    practice:[
      {key:"mix", icon:"🧠", label:"Mix", action:"modeTab", tab:"basic"},
      {key:"mathe", icon:"➗", label:"Mathe", action:"mode", mode:"math"},
      {key:"edv", icon:"💻", label:"EDV", action:"mode", mode:"it"},
      {key:"logik", icon:"🧩", label:"Logik", action:"mode", mode:"logic"}
    ],
    highscore:[
      {key:"today", icon:"🔥", label:"Heute", action:"highscore", period:"daily"},
      {key:"week", icon:"📅", label:"Woche", action:"highscore", period:"weekly"},
      {key:"month", icon:"🏆", label:"Monat", action:"highscore", period:"monthly"},
      {key:"all", icon:"🌍", label:"Global", action:"highscore", period:"all"}
    ],
    settings:[
      {key:"profile", icon:"👤", label:"Profil", action:"settings"},
      {key:"cloud", icon:"☁️", label:"Cloud", action:"settings"},
      {key:"data", icon:"🧹", label:"Daten", action:"settings"},
      {key:"framework", icon:"🛠️", label:"System", action:"settings"}
    ]
  };

  function setVisible(selector, visible, display="") {
    const el = typeof selector === "string" ? document.querySelector(selector) : selector;
    if(el) el.style.display = visible ? display : "none";
  }

  function isMobileShellContext(){
    const activeRoot = !( $("start") && $("start").classList.contains("hidden") );
    const isMobile = window.matchMedia ? window.matchMedia("(max-width: 900px)").matches : window.innerWidth <= 900;
    return isMobile && activeRoot && !state.exam.started;
  }

  function bindTopNavSwipe(track){
    if(!track || track.dataset.swipeBound === "1") return;
    track.dataset.swipeBound = "1";
    let startX=0,startY=0,startLeft=0,dragging=false,moved=false;
    const begin=(x,y)=>{startX=x;startY=y;startLeft=track.scrollLeft;dragging=true;moved=false;track.classList.add("is-dragging");};
    const move=(x,y,ev)=>{
      if(!dragging) return;
      const dx=x-startX, dy=y-startY;
      if(Math.abs(dx)>6) moved=true;
      if(Math.abs(dx)>Math.abs(dy)){
        if(ev && ev.cancelable) ev.preventDefault();
        track.scrollLeft=startLeft-dx;
      }
    };
    const end=()=>{
      if(!dragging) return;
      dragging=false;
      track.classList.remove("is-dragging");
      if(moved){
        track.dataset.swiped="1";
        setTimeout(()=>{track.dataset.swiped="0";},180);
      }
    };
    track.addEventListener("touchstart",e=>{const t=e.touches&&e.touches[0]; if(t) begin(t.clientX,t.clientY);},{passive:true});
    track.addEventListener("touchmove",e=>{const t=e.touches&&e.touches[0]; if(t) move(t.clientX,t.clientY,e);},{passive:false});
    track.addEventListener("touchend",end,{passive:true});
    track.addEventListener("pointerdown",e=>{ if(e.pointerType==="mouse") begin(e.clientX,e.clientY); });
    track.addEventListener("pointermove",e=>{ if(dragging) move(e.clientX,e.clientY,e); });
    track.addEventListener("pointerup",end);
    track.addEventListener("pointercancel",end);
    track.addEventListener("click",e=>{ if(track.dataset.swiped==="1"){ e.preventDefault(); e.stopPropagation(); } }, true);
  }

  function renderAppNav(){
    const nav=$("appNav"); if(!nav) return;
    const mobile = isMobileShellContext();
    const start=$("start");
    const anchor=$("premiumDashboard");
    const intro=$("sectionIntro");
    // Stable fix V7.0.6: Hauptnavigation bleibt immer im App-Container.
    // Mobile-CSS darf sie fixed anzeigen, aber JS verschiebt sie nicht mehr in den Body.
    if(start && nav.parentElement !== start){
      if(anchor && anchor.parentElement === start) anchor.insertAdjacentElement("afterend", nav);
      else start.insertBefore(nav, intro || start.firstChild);
    }
    nav.setAttribute("role","navigation");
    nav.setAttribute("aria-label","Hauptnavigation");
    nav.classList.toggle("is-hidden", false);
    nav.classList.toggle("desktop-app-nav", !mobile);
    nav.classList.toggle("mobile-app-nav", mobile);
    nav.innerHTML=Object.entries(APP_SECTIONS).map(([key,s])=>{
      const active = (state.activeAppSection || "home") === key;
      const home = s.home ? " nav-home" : "";
      return `<button type="button" data-nav-section="${key}" class="${active?'active':''}${home}" onclick="App.setAppSection('${key}')" aria-label="${escHTML(s.title)}"><span>${s.icon}</span><em>${s.title}</em></button>`;
    }).join("");
  }

  function defaultTopTab(section){
    const tabs=TOP_NAV_TABS[section] || TOP_NAV_TABS.home;
    return tabs[0] ? tabs[0].key : "live";
  }

  function renderMobileTopNav(){
    const nav=$("mobileTopNav"); if(!nav) return;
    if(nav.parentElement !== document.body) document.body.insertBefore(nav, document.body.firstChild);
    const section=state.activeAppSection || "home";
    const tabs=TOP_NAV_TABS[section] || TOP_NAV_TABS.home;
    const visible = isMobileShellContext();
    nav.classList.toggle("is-hidden", !visible);
    document.body.classList.toggle("mobile-shell-active", visible);
    if(!tabs.length){ nav.innerHTML=""; return; }
    const activeKey = state.activeTopTab || defaultTopTab(section);
    nav.dataset.section = section;
    nav.setAttribute("aria-label", "Kontextnavigation: " + section);
    nav.innerHTML = `<div class="mobile-top-track" role="tablist" data-nav-key="${section}-${activeKey}">${tabs.map(tab=>`<button type="button" role="tab" data-top-tab="${escHTML(tab.key)}" aria-selected="${activeKey===tab.key?'true':'false'}" class="${activeKey===tab.key?'active':''}" title="${escHTML(tab.label)}" onclick="App.setTopTab('${section}','${tab.key}')"><span class="topnav-icon">${escHTML(tab.icon||"•")}</span><span class="topnav-label">${escHTML(tab.label)}</span></button>`).join("")}</div>`;
    requestAnimationFrame(()=>{
      const track = nav.querySelector(".mobile-top-track");
      const active = nav.querySelector(".mobile-top-track button.active");
      if(track){
        bindTopNavSwipe(track);
        const overflow = track.scrollWidth > track.clientWidth + 4;
        nav.classList.toggle("is-scrollable", overflow);
        if(active){
          const target = active.offsetLeft - (track.clientWidth - active.offsetWidth) / 2;
          track.scrollTo({left:Math.max(0,target), behavior:"smooth"});
        }
      }
    });
  }

  function setTopTab(section, tabKey){
    if(!TOP_NAV_TABS[section]) section = state.activeAppSection || "home";
    const tabs=TOP_NAV_TABS[section] || [];
    const tab=tabs.find(x=>x.key===tabKey) || tabs[0];
    if(!tab) return;
    state.activeAppSection = section;
    state.activeTopTab = tab.key;
    if(tab.action==="modeTab"){
      state.activeAppSection="practice";
      state.activeModeTab=tab.tab || "basic";
      const modes=(MODE_TABS[state.activeModeTab]||MODE_TABS.basic).modes;
      if(!modes.includes(state.selectedMode)) state.selectedMode=modes[0];
      renderModes();
      return;
    }
    if(tab.action==="mode" && MODES[tab.mode]){
      state.selectedMode=tab.mode;
      state.activeAppSection=tab.section || "practice";
      const modeTab=Object.keys(MODE_TABS).find(t=>MODE_TABS[t].modes.includes(tab.mode));
      if(modeTab) state.activeModeTab=modeTab;
      if(state.activeAppSection==="practice"){
        const direct=(TOP_NAV_TABS.practice||[]).find(t=>t.mode===tab.mode);
        state.activeTopTab = direct ? direct.key : (modeTab==="block" ? "sprint" : "mix");
      }
      renderModes();
      return;
    }
    if(tab.action==="section"){
      setAppSection(tab.section || "home");
      return;
    }
    if(tab.action==="analysis"){
      showAnalysis();
      return;
    }
    if(tab.action==="health"){
      renderModes();
      showFrameworkHealth();
      return;
    }
    renderModes();
  }

  function renderModeCard(k, extraClass="compact"){
    const m=MODES[k];
    if(!m) return "";
    return `<div class="modeCard ${extraClass} ${k===state.selectedMode?'selected':''}" onclick="App.selectMode('${k}')"><div class="modeTitle">${m.title}</div><div class="small">${m.desc}</div><div>${m.tags.map(t=>`<span class="tag">${t}</span>`).join("")}</div></div>`;
  }

  function renderModeTabs() {
    const tabsEl=$("modeTabs"), titleEl=$("modeSectionTitle");
    if(!tabsEl || !titleEl) return;
    if(state.activeAppSection!=="practice") { tabsEl.innerHTML=""; titleEl.innerHTML=""; return; }
    tabsEl.innerHTML = Object.entries(MODE_TABS).map(([key,tab]) => `<button class="modeTab ${state.activeModeTab===key?'active':''}" onclick="App.setModeTab('${key}')">${tab.title}</button>`).join("");
    const active = MODE_TABS[state.activeModeTab] || MODE_TABS.basic;
    titleEl.innerHTML = `<div><b>${active.title}</b><br><span>${active.desc}</span></div><span>${active.modes.length} Modi</span>`;
  }

  function renderSectionActions() {
    const el=$("sectionActions");
    if(!el) return;
    const section=state.activeAppSection || "home";
    el.classList.remove("show");
    el.innerHTML="";
    if(section==="practice") {
      const m=MODES[state.selectedMode];
      el.classList.add("show");
      el.innerHTML=`<button class="section-start-primary" onclick="App.prepareTest()">${escHTML(m ? m.title.replace(/^\d+\.\s*/,"") : "Training")} starten</button><button class="section-start-secondary" onclick="App.setAppSection('settings')">Settings</button>`;
    }
  }

  function renderHighscoreSection(){
    const results=getResults();
    const map={today:"daily",week:"weekly",month:"monthly",all:"all"};
    const period=map[state.activeTopTab] || "daily";
    const label=(TOP_NAV_TABS.highscore.find(t=>t.key===state.activeTopTab)||TOP_NAV_TABS.highscore[0]).label;
    const hs=HighscoreEngine.build(results);
    const localTop=hs.top.slice(0,5);
    const localCard = !localTop.length
      ? `<div class="premium-card"><span class="coach-badge">Lokaler Highscore</span><div class="coach-action">Noch kein Rekord</div><div class="small">Starte einen Test. Danach erscheint hier deine lokale Bestenliste.</div></div>`
      : `<div class="premium-card"><span class="coach-badge">Lokaler Highscore</span><div class="coach-action">Bestwert: ${hs.bestOverall.percent}%</div><div class="ai-list">${localTop.map((r,i)=>`<div>${i+1}. <b>${escHTML(r.title||r.mode)}</b> · ${r.percent}% · ${escHTML(HighscoreEngine.rankLabel(r.percent))}</div>`).join("")}</div><div class="small">Lokale Sicherheits-Bestenliste auf diesem Gerät.</div></div>`;
    return `<h2>Highscore · ${escHTML(label)}</h2><p>Cloud- und lokale Ranglisten sind nach Zeitraum getrennt. Oben kannst du horizontal zwischen Heute, Woche, Monat und Gesamt wischen.</p><div class="highscore-section-grid">${CloudHighscoreEngine.renderShell(period)}${localCard}</div>`;
  }

  function renderSettingsSection(){
    const tab=state.activeTopTab || "profile";
    const profileBlock=`<div class="profile-panel">${renderProfileManager()}</div>`;
    const cloudBlock=`<div class="premium-card"><b>Cloud & Supabase</b><p class="small">Live-Diagnose, Online-Highscore und Cache-Neuladen.</p><button class="ghost" onclick="App.showFrameworkHealth()">Cloud Diagnose öffnen</button></div>`;
    const audioBlock=`<div class="premium-card"><b>Audio & Feedback</b><p class="small">Platzhalter für Sound, Vibration und Prüfungsfeedback. Die Logik bleibt vorbereitet, ohne die Kernmodule zu berühren.</p></div>`;
    const dataBlock=`<div class="premium-card"><b>Daten & Backup</b><p class="small">Lokale Ergebnisse, IndexedDB, Export und Cache-Verwaltung.</p><div class="settings-button-row"><button class="ghost" onclick="App.exportBackup()">Backup exportieren</button><button class="ghost" onclick="App.showDatabaseInfo()">Datenbankstatus</button><button class="ghost" onclick="window.PWAEngine && PWAEngine.clearCaches()">PWA Cache zurücksetzen</button></div></div>`;
    const frameworkBlock=`<div class="premium-card"><b>Framework</b><p class="small">Core Cleanup V7.0.5 · Module bleiben getrennt: EDV, Route, Simulation, Storage und Cloud.</p><button class="ghost" onclick="App.showFrameworkHealth()">Framework prüfen</button></div>`;
    const blocks={profile:profileBlock,cloud:cloudBlock,audio:audioBlock,data:dataBlock,framework:frameworkBlock};
    return `<h2>Settings</h2><p>Profil, Cloud, Audio, Daten und Framework sind jetzt als Settings-Bereich gebündelt.</p>${blocks[tab] || profileBlock}<div class="settings-secondary-grid">${tab!=="profile"?profileBlock:""}${tab!=="cloud"?cloudBlock:""}${tab!=="audio"?audioBlock:""}${tab!=="data"?dataBlock:""}${tab!=="framework"?frameworkBlock:""}</div>`;
  }

  function renderDashboardSection(){
    const stats=dashboardStats();
    const coach=CoachEngine.build(stats.results);
    const tab=state.activeTopTab || "live";
    const liveCard=`<div class="premium-card"><b>Live Dashboard</b><p class="small">Läufe: ${stats.results.length} · Durchschnitt: ${stats.avg}% · Rekord: ${stats.best?stats.best.percent+"%":"–"}</p><button class="ghost" onclick="App.setAppSection('practice')">Training öffnen</button></div>`;
    const statsCard=`<div class="premium-card"><b>Statistik</b><p class="small">Deine lokale Lernkurve, Kategorien und Fehleranalyse liegen in der Analyseansicht.</p><button class="ghost" onclick="App.showAnalysis()">Analyse öffnen</button></div>`;
    const focusCard=`<div class="premium-card"><b>Fokus</b><p class="small">Der Coach priorisiert Schwächen und empfiehlt dir den nächsten Trainingsblock.</p>${CoachEngine.renderDashboard(coach)}</div>`;
    const cloudCard=`<div class="premium-card"><b>Cloud</b><p class="small">Supabase Highscore und Diagnose sind hier angebunden.</p><button class="ghost" onclick="App.showFrameworkHealth()">Cloud prüfen</button></div>`;
    const blocks={live:liveCard,stats:statsCard,focus:focusCard,cloud:cloudCard};
    return `<h2>Dashboard</h2><p>Oben steuerst du die Dashboard-Ansicht. Unten wechselst du den Hauptbereich.</p><div class="dashboard-section-grid">${blocks[tab] || liveCard}</div>`;
  }

  function renderSectionIntro(){
    const el=$("sectionIntro"); if(!el) return;
    const section=state.activeAppSection || "home";
    el.className = "section-intro section-" + section;
    const s=APP_SECTIONS[section] || APP_SECTIONS.home;
    if(section==="home"){
      el.innerHTML=`<h2>Startseite</h2><p>Dein zentraler Hub. Unten wechselst du Hauptbereiche, oben steuerst du den Kontext.</p><div class="hub-grid"><div class="hub-card" onclick="App.setAppSection('practice')"><span class="hub-icon">✎</span><b>Üben</b><p>Mathe, Logik, EDV, Konzentration und Route gezielt trainieren.</p></div><div class="hub-card" onclick="App.selectMode('ctcLohr')"><span class="hub-icon">▶</span><b>CTC Simulation</b><p>93 Aufgaben mit Blocklogik und Zeitdruck starten.</p></div><div class="hub-card" onclick="App.setAppSection('highscore')"><span class="hub-icon">★</span><b>Highscore</b><p>Tägliche, wöchentliche, monatliche und gesamte Rangliste öffnen.</p></div></div>`;
    } else if(section==="dashboard") {
      el.innerHTML=renderDashboardSection();
    } else if(section==="highscore") {
      el.innerHTML=renderHighscoreSection();
    } else if(section==="settings") {
      el.innerHTML=renderSettingsSection();
    } else if(section==="practice") {
      el.innerHTML=`<h2>${s.title}</h2><p>${s.desc}</p>`;
    } else {
      el.innerHTML=`<h2>${s.title}</h2><p>${s.desc}</p>`;
    }
  }

  function renderModes() {
    const section=state.activeAppSection || "home";
    if(!state.activeTopTab || !(TOP_NAV_TABS[section]||[]).some(t=>t.key===state.activeTopTab)) state.activeTopTab=defaultTopTab(section);
    document.body.dataset.appSection = section;
    document.body.classList.toggle("mobile-nav-attached", false);
    renderPremiumDashboard();
    renderAppNav();
    renderMobileTopNav();
    renderSectionIntro();
    renderModeTabs();
    renderSectionActions();
    TrainingFocusEngine.render();
    setVisible($("premiumDashboard"), section==="home", "grid");
    setVisible(".quick-actions", section==="home", "grid");
    setVisible($("focusControls"), section==="practice");
    setVisible(".exam-options", false);
    setVisible(".db-actions", false);
    const grid=$("modeGrid"); if(!grid) return;
    if(section==="practice"){
      const active = MODE_TABS[state.activeModeTab] || MODE_TABS.basic;
      grid.innerHTML = active.modes.filter(k=>MODES[k]).map(k=>renderModeCard(k)).join("");
    } else {
      grid.innerHTML="";
      if($("modeTabs")) $("modeTabs").innerHTML="";
      if($("modeSectionTitle")) $("modeSectionTitle").innerHTML="";
    }
    if(section==="highscore") setTimeout(()=>CloudHighscoreEngine.refreshDashboard(),0);
  }

  function setAppSection(section){
    if(section==="analysis") { showAnalysis(); return; }
    if(section==="simulation") { section="practice"; state.selectedMode="ctcLohr"; }
    if(section==="profile") section="settings";
    if(section==="start") section="home";
    if(!APP_SECTIONS[section]) section="home";
    state.activeAppSection=section;
    state.activeTopTab=defaultTopTab(section);
    hideAll();
    $("start").classList.remove("hidden");
    if(section==="practice" && !Object.values(MODE_TABS).some(t=>t.modes.includes(state.selectedMode))) state.selectedMode="math";
    renderModes();
  }

  function setModeTab(tab){
    if(!MODE_TABS[tab]) return;
    state.activeAppSection="practice";
    state.activeTopTab = tab==="block" ? "sprint" : "mix";
    state.activeModeTab=tab;
    if(!MODE_TABS[tab].modes.includes(state.selectedMode)) state.selectedMode=MODE_TABS[tab].modes[0];
    renderModes();
  }
  function selectMode(k){
    if(!MODES[k]) return;
    state.selectedMode=k;
    state.activeAppSection="practice";
    const tab=Object.keys(MODE_TABS).find(t=>MODE_TABS[t].modes.includes(k));
    if(tab) state.activeModeTab=tab;
    const practiceTabs=TOP_NAV_TABS.practice || [];
    const direct=practiceTabs.find(t=>t.mode===k);
    state.activeTopTab = direct ? direct.key : (tab==="block" ? "sprint" : "mix");
    hideAll();
    $("start").classList.remove("hidden");
    renderModes();
  }
  function prepareTest() {
    readExamOptions();
    applyExamBodyClass();
    const m=MODES[state.selectedMode];
    if(m.memory){state.memoryItems=memoryItems(); $("memoryTable").innerHTML=memoryHtml(); showMemoryPhase();}
    else startQuiz();
  }
  function showMemoryPhase() {
    clearInterval(state.memoryTimer); hideAll(); $("memory").classList.remove("hidden");
    let t=240; $("memoryTimer").textContent="Einprägezeit: "+t+" s"; $("memoryTimer").classList.remove("low");
    state.memoryTimer=setInterval(()=>{t--; $("memoryTimer").textContent="Einprägezeit: "+t+" s"; if(t<=25)$("memoryTimer").classList.add("low"); if(t<=0){clearInterval(state.memoryTimer); beginQuizAfterMemory();}},1000);
  }
  function beginQuizAfterMemory(){clearInterval(state.memoryTimer); startQuiz();}
  function cancelMemoryPhase(){clearInterval(state.memoryTimer); restart();}
  function startQuiz() {
    clearRouteTimers();
    state.adaptiveMemoryPool=[]; state.quiz=buildQuiz(); state.current=0; state.score=0; state.history=[]; state.questionStates=[]; state.markedQuestions=[];
    state.testStart=new Date(); state.testEnd=null; state.exam.started=true; applyExamBodyClass(); state.ctcBlockRemaining={...CTC_BLOCK_LIMITS}; state.ctcCurrentBlock=null; state.shownBlockIntro={}; state.pendingBlock=null;
    hideAll(); $("quiz").classList.remove("hidden"); showQuestion();
  }
  function startCtcBlockFromIntro() {
    if(state.pendingBlock) state.shownBlockIntro[state.pendingBlock]=true;
    state.pendingBlock=null; hideAll(); $("quiz").classList.remove("hidden"); showQuestion(true);
  }

  function showQuestion(spIntro=false) {
    clearInterval(state.timer);
    clearRouteTimers();
    const q=state.quiz[state.current];
    if(!q){showResult(); return;}
    if(q.type==="edvcovered") {
      const edvIndex=state.quiz.findIndex(item=>item && item.type==="edvmulti");
      if(edvIndex>=0 && !state.history[edvIndex]) { state.current=edvIndex; showQuestion(spIntro); return; }
      if(state.current<state.quiz.length-1) { state.current++; showQuestion(spIntro); return; }
      showResult(); return;
    }
    if(state.selectedMode==="ctcLohr" && q.block && !state.shownBlockIntro[q.block] && !spIntro) {
      state.pendingBlock=q.block; hideAll();
      const info=BLOCK_INFO[q.block] || {title:q.block,text:"Starte den nächsten Block.",rules:["Ruhig bleiben","Sichere Aufgaben zuerst","Markieren statt festbeißen"]};
      $("blockIntroTitle").textContent=info.title;
      $("blockIntroText").innerHTML=`<p>${info.text}</p><div class="blockRules"><b>Strategie:</b><ul>${info.rules.map(r=>`<li>${r}</li>`).join("")}</ul></div>`;
      $("blockIntro").classList.remove("hidden");
      return;
    }
    hideAll(); $("quiz").classList.remove("hidden");
    state.questionStartedAt=new Date();
    let totalDisplay=isAdaptiveElite()?MODES.ctc.amount:state.quiz.length;
    if(state.selectedMode==="ctcLohr") {
      if(state.ctcCurrentBlock!==q.block){state.ctcCurrentBlock=q.block; if(typeof state.ctcBlockRemaining[q.block]!="number")state.ctcBlockRemaining[q.block]=q.time||60;}
      state.timeLeft=state.ctcBlockRemaining[q.block]; state.totalTimeForQuestion=Math.max(1,state.timeLeft);
      $("timer").textContent=fmtClock(state.timeLeft); $("timer").classList.toggle("warn",state.timeLeft<=60); $("timer").classList.toggle("low",state.timeLeft<=30); $("timer").classList.toggle("critical",state.timeLeft<=30);
      const limit=CTC_BLOCK_LIMITS[q.block]||state.totalTimeForQuestion;
      $("meta").innerHTML=`<span class="badge">${MODES[state.selectedMode].title}</span><span class="badge">${q.block}</span><span class="badge">${q.cat}</span><span class="badge">Frage ${state.current+1}/${totalDisplay}</span><div class="block-timer-label">Blockzeit: ${fmtClock(state.timeLeft)} von ${fmtClock(limit)}</div>${examStatusHtml()}`;
    } else {
      state.timeLeft=state.selectedMode==="ctc"?Math.max(12,Math.floor((q.time||25)*.8)):(q.time||25); state.totalTimeForQuestion=state.timeLeft;
      $("timer").textContent=state.timeLeft; $("timer").classList.remove("low","warn","critical");
      $("meta").innerHTML=`<span class="badge ${state.selectedMode==="ctc"?"hardcore-badge":""}">${MODES[state.selectedMode].title}</span><span class="badge">${q.cat}</span><span class="badge">Frage ${state.current+1}/${totalDisplay}</span>${examStatusHtml()}`;
    }
    $("progressfill").style.width=`${state.current/totalDisplay*100}%`;
    $("question").innerHTML=q.q; $("feedback").classList.add("hidden"); $("feedback").innerHTML="";
    renderVisual(q); renderAnswers(q); updateQuestionNav();
    state.timer=setInterval(()=>tickTimer(),1000);
  }
  function tickTimer() {
    const q=state.quiz[state.current]; if(!q)return;
    if(state.selectedMode==="ctcLohr") {
      state.ctcBlockRemaining[q.block]=Math.max(0,(state.ctcBlockRemaining[q.block]||0)-1);
      state.timeLeft=state.ctcBlockRemaining[q.block]; $("timer").textContent=fmtClock(state.timeLeft); $("timer").classList.toggle("warn",state.timeLeft<=60); $("timer").classList.toggle("low",state.timeLeft<=30); $("timer").classList.toggle("critical",state.timeLeft<=30);
      if(state.timeLeft<=0){ clearInterval(state.timer); if(!state.history[state.current])recordAnswer(null,false,true); state.current=nextBlockIndex(state.current); if(state.current<state.quiz.length)showQuestion(); else showResult(); }
    } else {
      state.timeLeft--; $("timer").textContent=state.timeLeft; if(state.timeLeft<=10)$("timer").classList.add("warn"); if(state.timeLeft<=5)$("timer").classList.add("low","critical");
      if(state.timeLeft<=0){clearInterval(state.timer); recordAnswer(null,false,true); if(MODES[state.selectedMode].instant){$("feedback").textContent="Zeit abgelaufen."; $("feedback").classList.remove("hidden"); setTimeout(nextQuestion,650);} else nextQuestion();}
    }
  }
  function nextBlockIndex(from) {
    const curBlock=state.quiz[from]?.block;
    for(let i=from+1;i<state.quiz.length;i++){if(state.quiz[i]?.block!==curBlock)return i;}
    return state.quiz.length;
  }

  function renderAnswers(q) {
    $("answers").innerHTML="";
    if(q.type==="edvmulti") { renderEdvMultiAnswers(q); return; }
    if(q.type==="routeMemory") {
      if(!q.routeReady && !state.history[state.current]) {
        $("answers").innerHTML=`<div class="route-answer-wait">Merke dir die Straßen in der richtigen Reihenfolge. Nach der Animation verschwinden Bus und Straßen.</div>`;
        return;
      }
      renderRouteSequenceAnswers(q);
      return;
    }
    q.a.forEach((ans,idx)=>{
      const b=document.createElement("button"); b.innerHTML=ans; b.onclick=()=>chooseAnswer(idx,b);
      if(state.history[state.current]?.givenIndex===idx)b.classList.add("selected");
      $("answers").appendChild(b);
    });
    const h=state.history[state.current];
    if(isInstantFeedbackAllowed() && h) {
      const bs=document.querySelectorAll(".answers button");
      if(h.givenIndex!==null && bs[h.givenIndex])bs[h.givenIndex].classList.add(h.correct?"correct":"wrong");
      if(!h.correct && h.correctIndex!==undefined && bs[h.correctIndex])bs[h.correctIndex].classList.add("correct");
      if(h.explanation){$("feedback").innerHTML=(h.correct?"<b>Richtig.</b> ":"<b>Falsch.</b> ")+h.explanation; $("feedback").classList.remove("hidden");}
    }
  }



  function renderEdvMultiAnswers(q) {
    const need=q.edvRequiredCount || EDV_ERRORS.length;
    const selected=MultiChoiceModule.init(q,"edvMultiSelected",need);
    const chips=selected.length ? MultiChoiceModule.chips(selected, id=>id, id=>`App.toggleEdvMultiNode('${id}')`) : `<span class="small">Noch kein Schema-Eintrag ausgewählt.</span>`;
    $("answers").innerHTML=`
      <div class="edv-answer-panel">
        <b>EDV-Multi-Choice</b><br>
        <span class="small">Ausgewählt: ${selected.length}/${need}. Tippe direkt auf die Schema-Karten. Erneutes Tippen wählt ab.</span>
        <div class="route-selected-list">${chips}</div>
        <div class="route-action-row">
          <button class="secondary" onclick="App.undoEdvMultiSelection()">Letzte entfernen</button>
          <button class="secondary" onclick="App.clearEdvMultiSelection()">Auswahl leeren</button>
          <button onclick="App.submitEdvMultiAnswer()">Gesamtantwort werten</button>
        </div>
      </div>`;
    if(state.history[state.current]) {
      const h=state.history[state.current];
      $("feedback").innerHTML=(h.correct?"<b>Richtig.</b> ":"<b>Falsch.</b> ")+h.explanation;
      $("feedback").classList.remove("hidden");
    }
  }

  function toggleEdvMultiNode(id) {
    const q=state.quiz[state.current];
    if(!q || q.type!=="edvmulti" || state.history[state.current]) return;
    const need=q.edvRequiredCount || EDV_ERRORS.length;
    const result=MultiChoiceModule.toggle(q,"edvMultiSelected",id,need);
    if(!result.ok && result.action==="max"){
      $("feedback").innerHTML=`<b>Maximal ${need} Einträge.</b> Tippe eine gewählte Karte erneut an, um sie zu entfernen.`;
      $("feedback").classList.remove("hidden");
    }
    $("visual").innerHTML=renderEdvProHTML(q);
    renderEdvMultiAnswers(q);
  }

  function undoEdvMultiSelection(){
    const q=state.quiz[state.current];
    if(!q || q.type!=="edvmulti" || state.history[state.current]) return;
    MultiChoiceModule.undo(q,"edvMultiSelected");
    $("visual").innerHTML=renderEdvProHTML(q);
    renderEdvMultiAnswers(q);
  }

  function clearEdvMultiSelection(){
    const q=state.quiz[state.current];
    if(!q || q.type!=="edvmulti" || state.history[state.current]) return;
    MultiChoiceModule.clear(q,"edvMultiSelected");
    $("visual").innerHTML=renderEdvProHTML(q);
    renderEdvMultiAnswers(q);
  }

  function submitEdvMultiAnswer(){
    const q=state.quiz[state.current];
    if(!q || q.type!=="edvmulti" || state.history[state.current]) return;
    const selected=q.edvMultiSelected || [];
    const need=q.edvRequiredCount || EDV_ERRORS.length;
    if(selected.length!==need){
      $("feedback").innerHTML=`<b>EDV-Auswahl unvollständig.</b> Du hast ${selected.length}/${need} Fehler markiert. Markiere genau ${need} Einträge und werte dann die Gesamtantwort.`;
      $("feedback").classList.remove("hidden");
      return;
    }
    clearInterval(state.timer);
    recordEdvMultiAnswers(selected);
    state.score=state.history.filter(h=>h&&h.correct).length;
    for(let i=state.current;i<Math.min(state.quiz.length,state.current+need);i++) {
      state.questionStates[i]=state.markedQuestions[i]?"mark":"done";
      if(state.quiz[i] && state.quiz[i].type==="edvcovered") state.history[i]=state.history[i] || {q:"EDV-Großschema Platzhalter",cat:"EDV Diagramm PRO",group:"IT/FISI",block:"5. EDV Kenntnisse",answers:["EDV-Gesamtaufgabe"],correctIndex:0,givenIndex:0,correct:true,timeout:false,skipped:false,explanation:"Durch die EDV-Gesamtaufgabe bewertet.",visualType:"edvcovered",duration:0,allowed:state.totalTimeForQuestion,examMode:{...state.exam}};
    }
    updateQuestionNav();
    $("visual").innerHTML=renderEdvProHTML(q);
    const correctSet=new Set(EDV_ERRORS.map(e=>e.id));
    EDV_SCHEMA.forEach(x=>{
      const el=$("edvNode_"+x.id); if(!el) return;
      if(correctSet.has(x.id)) el.classList.add("correct-node");
      else if(selected.includes(x.id)) el.classList.add("wrong-node");
    });
    const found=EDV_ERRORS.filter(e=>selected.includes(e.id)).length;
    const falsePos=selected.filter(id=>!correctSet.has(id)).length;
    $("feedback").innerHTML=`<b>EDV ausgewertet.</b> ${found}/${need} Fehler korrekt gefunden${falsePos?`, ${falsePos} falsche Markierung(en)`:""}. Richtige Fehler: ${EDV_ERRORS.map(e=>e.id).join(", ")}.`;
    $("feedback").classList.remove("hidden");
    setTimeout(()=>{ state.current=Math.min(state.quiz.length-1,state.current+need-1); if(state.current<state.quiz.length-1) nextQuestion(); else showResult(); },1200);
  }

  function recordEdvMultiAnswers(selected){
    const startIndex=state.current;
    const ended=new Date();
    const totalDuration=(state.questionStartedAt?ended-state.questionStartedAt:0);
    const perDuration=Math.max(1, Math.round(totalDuration/Math.max(1, EDV_ERRORS.length)));
    const selectedSet=new Set(selected);
    EDV_ERRORS.forEach((err,i)=>{
      const q=state.quiz[startIndex+i] || Generators.bigEDV(i);
      const found=selectedSet.has(err.id);
      const selectedId=selected[i] || "";
      const givenIndex=selectedId ? EDV_SCHEMA.findIndex(x=>x.id===selectedId) : null;
      state.history[startIndex+i]={
        q:`EDV-Großschema: Fehler ${i+1} von ${EDV_ERRORS.length}`,
        cat:"EDV Diagramm PRO", group:"IT/FISI", block:"5. EDV Kenntnisse",
        answers:EDV_SCHEMA.map(x=>`${x.id}: ${x.text}`),
        correctIndex:EDV_SCHEMA.findIndex(x=>x.id===err.id),
        givenIndex:givenIndex>=0?givenIndex:null,
        correct:found, timeout:false, skipped:!found,
        explanation:`${err.nd}: ${err.ex}<br>Deine Gesamtauswahl: ${selected.join(", ")}.`,
        visualType:"edvmulti", schemaKind:err.nd, selectedKind:"Multi-Auswahl",
        duration:perDuration, allowed:state.totalTimeForQuestion,
        examMode:{...state.exam}
      };
    });
  }

  function renderRouteSequenceAnswers(q) {
    const need=(q.routeStreets||[]).length;
    const selected=MultiChoiceModule.init(q,"routeSelected",need);
    const selectedHtml = selected.length
      ? MultiChoiceModule.chips(selected, s=>s, s=>`App.selectRouteStreet(${jsArg(s)})`)
      : `<span class="small">Noch keine Straße ausgewählt.</span>`;

    $("answers").innerHTML = `
      <div class="route-sequence-panel">
        <b>Tippe die Straßen in der gemerkten Reihenfolge an:</b>
        <span class="small">Ausgewählt: ${selected.length}/${need}. Erneutes Tippen entfernt die Straße wieder.</span>
        <div class="route-selected-list">${selectedHtml}</div>
        <div class="route-option-grid">
          ${(q.routeOptions||q.a).map(street=>`<button class="${selected.includes(street)?"used":""}" onclick="App.selectRouteStreet(${jsArg(street)})">${escHTML(street)}</button>`).join("")}
        </div>
        <div class="route-action-row">
          <button class="secondary" onclick="App.clearRouteSelection()">Auswahl leeren</button>
          <button class="secondary" onclick="App.undoRouteStreet()">Letzte entfernen</button>
          <button onclick="App.submitRouteSequence()">Gesamtantwort werten</button>
        </div>
      </div>
    `;

    if(state.history[state.current]) {
      const h=state.history[state.current];
      $("feedback").innerHTML=(h.correct?"<b>Richtig.</b> ":"<b>Falsch.</b> ")+h.explanation;
      $("feedback").classList.remove("hidden");
    }
  }

  function selectRouteStreet(street) {
    const q=state.quiz[state.current];
    if(!q || q.type!=="routeMemory" || !q.routeReady || state.history[state.current]) return;
    const need=(q.routeStreets||[]).length;
    const result=MultiChoiceModule.toggle(q,"routeSelected",street,need);
    if(!result.ok && result.action==="max"){
      $("feedback").innerHTML=`<b>Route vollständig.</b> Tippe eine gewählte Straße erneut an, wenn du sie austauschen möchtest.`;
      $("feedback").classList.remove("hidden");
    }
    renderRouteSequenceAnswers(q);
  }

  function undoRouteStreet() {
    const q=state.quiz[state.current];
    if(!q || q.type!=="routeMemory" || state.history[state.current]) return;
    MultiChoiceModule.undo(q,"routeSelected");
    renderRouteSequenceAnswers(q);
  }

  function clearRouteSelection() {
    const q=state.quiz[state.current];
    if(!q || q.type!=="routeMemory" || state.history[state.current]) return;
    MultiChoiceModule.clear(q,"routeSelected");
    renderRouteSequenceAnswers(q);
  }

  function submitRouteSequence() {
    const q=state.quiz[state.current];
    if(!q || q.type!=="routeMemory" || state.history[state.current]) return;
    const selected=q.routeSelected||[];
    if(selected.length < q.routeStreets.length) {
      $("feedback").innerHTML=`<b>Noch nicht vollständig.</b> Du hast ${selected.length}/${q.routeStreets.length} Straßen ausgewählt.`;
      $("feedback").classList.remove("hidden");
      return;
    }
    clearInterval(state.timer);
    const ok = MultiChoiceModule.sameOrder(selected, q.routeStreets);
    recordRouteAnswer(selected, ok);
    state.questionStates[state.current]=state.markedQuestions[state.current]?"mark":"done";
    updateQuestionNav();
    $("feedback").innerHTML=(ok?"<b>Richtig.</b> ":"<b>Falsch.</b> ")+(q.ex||"");
    $("feedback").classList.remove("hidden");
    setTimeout(()=>{ if(state.current<state.quiz.length-1 || isAdaptiveElite())nextQuestion(); else showResult();},1100);
  }

  function recordRouteAnswer(selected, correct) {
    const q=state.quiz[state.current], ended=new Date(), prev=state.history[state.current];
    const duration=(prev?prev.duration:0)+(state.questionStartedAt?ended-state.questionStartedAt:0);
    state.history[state.current]={
      q:q.q,
      cat:q.cat,
      group:q.group||groupFor(q.cat),
      block:q.block||"",
      answers:[selected.join(" → ")],
      correctIndex:0,
      givenIndex:0,
      correct,
      timeout:false,
      skipped:false,
      explanation:(q.ex||"")+`<br>Deine Reihenfolge: ${selected.join(" → ")}.`,
      visualType:q.type||"routeMemory",
      duration,
      allowed:state.totalTimeForQuestion,
      examMode:{...state.exam}
    };
  }

  function chooseAnswer(idx,btn) {
    clearInterval(state.timer);
    const q=state.quiz[state.current], ok=idx===q.correct, wasCorrect=state.history[state.current]?.correct===true;
    recordAnswer(idx,ok,false);
    if(ok && !wasCorrect)state.score++; if(!ok && wasCorrect)state.score=Math.max(0,state.score-1);
    state.questionStates[state.current]=state.markedQuestions[state.current]?"mark":"done";
    updateQuestionNav();
    if(isInstantFeedbackAllowed()) {
      const bs=document.querySelectorAll(".answers button"); bs.forEach(b=>b.classList.remove("correct","wrong","selected"));
      if(ok){btn.classList.add("correct"); $("feedback").innerHTML="<b>Richtig.</b> "+(q.ex||"");}
      else {btn.classList.add("wrong"); if(bs[q.correct])bs[q.correct].classList.add("correct"); $("feedback").innerHTML="<b>Falsch.</b> "+(q.ex||"");}
      $("feedback").classList.remove("hidden");
      setTimeout(()=>{ if(state.current<state.quiz.length-1 || isAdaptiveElite())nextQuestion(); else showResult();},900);
    } else nextQuestion();
  }
  function recordAnswer(given, correct, timeout) {
    const q=state.quiz[state.current], ended=new Date(), prev=state.history[state.current];
    const duration=(prev?prev.duration:0)+(state.questionStartedAt?ended-state.questionStartedAt:0);
    state.history[state.current]={q:q.q,cat:q.cat,group:q.group||groupFor(q.cat),block:q.block||"",answers:q.a,correctIndex:q.correct,givenIndex:given,correct,timeout,skipped:given===null&&!timeout,explanation:q.ex||"",visualType:q.type||"mc",duration,allowed:state.totalTimeForQuestion,
      examMode:{...state.exam}};
    state.questionStates[state.current]=state.markedQuestions[state.current]?"mark":(given===null?"skip":"done");
  }
  function nextQuestion() {
    clearInterval(state.timer);
    const targetTotal=isAdaptiveElite()?MODES.ctc.amount:state.quiz.length;
    if(isAdaptiveElite()) {
      if(state.current<targetTotal-1){state.current++; if(!state.quiz[state.current])state.quiz[state.current]=buildAdaptiveQuestion(state.current,targetTotal); showQuestion();}
      else showResult();
      return;
    }
    if(state.current<state.quiz.length-1){state.current++; showQuestion();}
    else showResult();
  }
  function spQuestion(){clearInterval(state.timer); if(!state.history[state.current])recordAnswer(null,false,false); state.questionStates[state.current]="skip"; updateQuestionNav(); nextQuestion();}
  function skipQuestion(){
    const q=state.quiz[state.current];
    if(q && q.type==="edvmulti") {
      const fb=$("feedback");
      if(fb){fb.innerHTML="<b>EDV-Block:</b> Bitte die Gesamt-EDV-Aufgabe werten. Offene Auswahl wird sonst als 0/11 gezählt."; fb.classList.remove("hidden");}
      return;
    }
    spQuestion();
  }
  function manualNextQuestion(){
    const q=state.quiz[state.current];
    if(q && q.type==="edvmulti") { submitEdvMultiAnswer(); return; }
    clearInterval(state.timer);
    if(!state.history[state.current]){recordAnswer(null,false,false); state.questionStates[state.current]="skip";}
    if(isAdaptiveElite()&&state.current>=state.quiz.length-1&&state.current<MODES.ctc.amount-1)return nextQuestion();
    if(state.current<state.quiz.length-1){state.current++; showQuestion();} else showResult();
  }

  function showExamLockNotice() {
    const fb = $("feedback");
    if(!fb) return;
    fb.innerHTML = '<div class="exam-locked-note">Zurückspringen ist in diesem Prüfungsmodus gesperrt.</div>';
    fb.classList.add("force-show");
    fb.classList.remove("hidden");
    setTimeout(()=>{ fb.classList.remove("force-show"); if(state.exam.hardcore) fb.classList.add("hidden"); }, 1200);
  }

  function prevQuestion(){if(state.exam.lockBack){showExamLockNotice();return;} if(state.current>0){clearInterval(state.timer); state.current--; showQuestion();}}
  function jumpToQuestion(i){if(state.exam.lockBack && i<state.current){showExamLockNotice();return;} if(i<0||i>=state.quiz.length)return; clearInterval(state.timer); if(i!==state.current&&!state.history[state.current]){recordAnswer(null,false,false); state.questionStates[state.current]="skip";} state.current=i; showQuestion();}
  function toggleMarkQuestion(){state.markedQuestions[state.current]=!state.markedQuestions[state.current]; state.questionStates[state.current]=state.markedQuestions[state.current]?"mark":(state.history[state.current]?"done":"open"); updateQuestionNav();}
  function updateQuestionNav() {
    const total=isAdaptiveElite()?MODES.ctc.amount:state.quiz.length;
    $("questionNav").innerHTML="";
    for(let i=0;i<total;i++){const d=document.createElement("div"); let st=state.questionStates[i]||(state.history[i]?"done":"open"); if(state.markedQuestions[i])st="mark"; d.className="progress-dot "+st+(i===state.current?" current":""); d.textContent=i+1; d.title=`Aufgabe ${i+1}: ${st}`; if(i<state.quiz.length)d.onclick=()=>jumpToQuestion(i); $("questionNav").appendChild(d);}
  }

  function renderVisual(q) {
    const v=$("visual"); v.innerHTML="";
    if(q.type==="matrix")v.innerHTML=`<div class="matrix">${q.grid.flat().map(x=>`<div class="cell">${x}</div>`).join("")}</div>`;
    if(q.type==="series")v.innerHTML=`<div class="visualBox"><div class="series">${q.series.map(x=>`<span>${x}</span>`).join("")}</div></div>`;
    if(q.type==="symbols")v.innerHTML=`<div class="visualBox"><div class="shapeRow">${q.symbols.map(x=>`<span class="shape">${x}</span>`).join("")}</div></div>`;
    if(q.type==="fraction"){const f=q.fraction; v.innerHTML=`<div class="visualBox"><div class="barRow"><div>${fracHTML(f.a,f.den1)}</div><b>+</b><div>${fracHTML(f.b,f.den2)}</div></div></div>`;}
    if(q.type==="fractionRule"){const f=q.fractionRule; v.innerHTML=`<div class="visualBox"><div>${f.a} + ${f.b}</div><hr><div>${f.c} + ${f.d}</div></div>`;}
    if(q.type==="tablecode")v.innerHTML=`<div class="visualBox"><table class="analysisTable"><tr><th>Name</th><th>Farbe</th><th>Zahl</th><th>Kennung</th></tr>${q.tableRows.map(r=>`<tr><td>${r.name}</td><td>${r.color}</td><td>${r.num}</td><td>${r.code}</td></tr>`).join("")}</table></div>`;
    if(q.type==="pqsheet")v.innerHTML=q.pqHTML||"";
    if(q.type==="bigschema")v.innerHTML=q.bigSchemaHTML||"";
    if(q.type==="edvmulti")v.innerHTML=renderEdvProHTML(q);
    if(q.type==="focusgrid")v.innerHTML=q.focusHTML||"";
    if(q.type==="routeMemory")renderRouteMemory(q);
    if(q.type==="visual")renderMechanicVisual(q.visual);
    if(q.type==="visualIQ")renderVisualIQ(q.visualIQ);
  }

  function renderRouteMemory(q) {
    const v=$("visual"), route=q.routeStreets||[];
    const total=q.routeDuration||20;

    // Feste SVG-Punkte: alles bleibt garantiert im sichtbaren Bereich.
    const basePoints=[
      [70,80],[190,80],[310,80],[430,80],[550,80],
      [670,80],[670,170],[550,170],[430,170],[310,170],
      [190,170],[70,170],[70,260],[190,260],[310,260],
      [430,260],[550,260],[670,260]
    ];
    const points=basePoints.slice(0, Math.max(1, route.length));
    const pathD=points.map((p,i)=>(i===0?`M ${p[0]} ${p[1]}`:`L ${p[0]} ${p[1]}`)).join(" ");

    const labelY = (i,p) => {
      if(p[1] <= 95) return p[1] + 38;
      if(p[1] >= 240) return p[1] - 26;
      return (i % 2 === 0) ? p[1] - 24 : p[1] + 34;
    };

    v.innerHTML=`<div class="route-scene" id="routeScene">
      <svg class="route-svg" viewBox="0 0 740 330" preserveAspectRatio="xMidYMid meet">
        <path class="route-path" d="${pathD}"></path>
        <path class="route-dash" d="${pathD}"></path>
        ${route.map((s,i)=>{
          const p=points[i];
          return `<circle class="route-stop-dot" id="routeDot${i}" cx="${p[0]}" cy="${p[1]}" r="8"></circle>
                  <text class="route-stop-label" id="routeLabel${i}" x="${p[0]}" y="${labelY(i,p)}" text-anchor="middle">${i+1}. ${escHTML(s)}</text>`;
        }).join("")}
        <text class="route-bus-svg" id="routeBusSvg" x="${points[0]?.[0]||70}" y="${points[0]?.[1]||80}">🚌</text>
      </svg>
      <div class="route-status" id="routeStatus">Der Bus startet gleich. Merke dir die Straßennamen in Reihenfolge. <span class="route-countdown">${total}s</span></div>
    </div>`;

    // Wenn die Aufgabe schon gezeigt wurde, bei Rückkehr NICHT nochmal die Straßen anzeigen.
    if(q.routePlayed || state.history[state.current]) {
      q.routeReady=true;
      const scene=$("routeScene");
      if(scene) scene.innerHTML=`<div class="route-memory-ready" style="margin:90px 16px">Animation beendet. Wähle jetzt unten die Straßen in der richtigen Reihenfolge.</div>`;
      return;
    }

    q.routePlayed=true;
    q.routeReady=false;
    let elapsed=0;
    const bus=$("routeBusSvg"), status=$("routeStatus");
    const per=Math.max(1, Math.floor(total/Math.max(1, route.length)));

    route.forEach((_,i)=>{
      const tid=setTimeout(()=>{
        const p=points[i];
        const dot=$("routeDot"+i), lab=$("routeLabel"+i);
        if(dot)dot.classList.add("show");
        if(lab)lab.classList.add("show");
        if(i>0){
          const prev=$("routeDot"+(i-1));
          if(prev)prev.classList.add("past");
        }
        if(bus && p){
          bus.setAttribute("x", p[0]);
          bus.setAttribute("y", p[1]);
        }
      }, i*per*1000);
      state.routeTimers.push({kind:"timeout",id:tid});
    });

    const intv=setInterval(()=>{
      elapsed++;
      if(status)status.innerHTML=`Merke dir die Reihenfolge. Antwortmöglichkeiten erscheinen gleich. <span class="route-countdown">${Math.max(0,total-elapsed)}s</span>`;
      if(elapsed>=total){
        clearInterval(intv);
        state.routeTimers=state.routeTimers.filter(t=>t.id!==intv);

        // Nach der Animation müssen Straße + Punkte verschwinden.
        route.forEach((_,i)=>{
          const dot=$("routeDot"+i), lab=$("routeLabel"+i);
          if(dot){dot.classList.remove("show","past"); dot.style.display="none";}
          if(lab){lab.classList.remove("show"); lab.style.display="none";}
        });

        q.routeReady=true;
        const scene=$("routeScene");
        if(scene) scene.innerHTML=`<div class="route-memory-ready" style="margin:90px 16px">Animation beendet. Wähle jetzt unten die Straßen in der richtigen Reihenfolge.</div>`;
        renderAnswers(q);
      }
    },1000);
    state.routeTimers.push({kind:"interval",id:intv});
  }


  function renderVisualIQ(x) {
    const v=$("visual");
    if(!x){v.innerHTML="";return;}
    const gearPath=(cx,cy,r,teeth=18)=>{let d=""; for(let k=0;k<teeth*2;k++){const ang=(-Math.PI/2)+(k*Math.PI/teeth),rr=k%2===0?r+7:r,px=cx+Math.cos(ang)*rr,py=cy+Math.sin(ang)*rr; d+=(k===0?"M ":" L ")+px.toFixed(1)+" "+py.toFixed(1);} return d+" Z";};
    if(x.nd==="gearsPro"){
      const count=x.labels.length,gap=Math.min(112,700/(count-1||1)),startX=70,y=95;
      let h='<div class="visual-iq-canvas"><svg class="visual-iq-svg" viewBox="0 0 780 180" preserveAspectRatio="xMidYMid meet">';
      x.labels.forEach((lab,i)=>{const cx=startX+i*gap; h+=`<path d="${gearPath(cx,y,28)}" class="visual-iq-light"/><circle cx="${cx}" cy="${y}" r="18" fill="#fff" stroke="#111827" stroke-width="3"/><text x="${cx}" y="32" text-anchor="middle" class="visual-iq-label">${lab}</text><text x="${cx}" y="104" text-anchor="middle" font-size="27" font-weight="900">${x.shown[i]}</text>`; if(i<x.labels.length-1){const nx=startX+(i+1)*gap; h+=`<line x1="${cx+38}" y1="${y}" x2="${nx-38}" y2="${y}" stroke="#111827" stroke-width="4" stroke-linecap="round"/>`;}});
      if(x.sameAxis>0){const cx=startX+x.sameAxis*gap; h+=`<text x="${cx}" y="154" text-anchor="middle" class="visual-iq-muted">gleiche Achse</text>`;}
      if(x.beltAt>0){const cx=startX+(x.beltAt-1)*gap,nx=startX+x.beltAt*gap; h+=`<path d="M ${cx} 54 C ${cx+35} 20 ${nx-35} 20 ${nx} 54" class="visual-iq-wire-off"/><text x="${(cx+nx)/2}" y="20" text-anchor="middle" class="visual-iq-muted">Riemen</text>`;}
      v.innerHTML=h+'</svg></div>';
    }
    if(x.nd==="mirror"){
      const axisText=x.axis==="vertical"?"vertikale Achse":x.axis==="horizontal"?"horizontale Achse":"Punktspiegelung";
      v.innerHTML=`<div class="visual-iq-canvas"><div class="visual-iq-note"><b>Spiegelaufgabe:</b> Ausgangsfigur links. Gesucht ist die korrekte Spiegelung über ${axisText}.</div><svg class="visual-iq-svg" viewBox="0 0 760 260"><line x1="160" y1="35" x2="160" y2="225" stroke="#64748b" stroke-width="3" stroke-dasharray="7 7"/><text x="160" y="28" text-anchor="middle" class="visual-iq-muted">Spiegelachse</text><polygon points="80,70 125,130 80,190" class="visual-iq-shape"/><circle cx="105" cy="100" r="8" class="visual-iq-dark"/><g transform="translate(260,0)"><text x="40" y="28" class="visual-iq-label">A</text><polygon points="80,70 125,130 80,190" class="visual-iq-shape"/><circle cx="105" cy="100" r="8" class="visual-iq-dark"/></g><g transform="translate(390,0)"><text x="40" y="28" class="visual-iq-label">B</text><polygon points="125,70 80,130 125,190" class="visual-iq-shape"/><circle cx="100" cy="100" r="8" class="visual-iq-dark"/></g><g transform="translate(520,0)"><text x="40" y="28" class="visual-iq-label">C</text><polygon points="80,190 125,130 80,70" class="visual-iq-shape"/><circle cx="105" cy="160" r="8" class="visual-iq-dark"/></g><g transform="translate(640,0)"><text x="40" y="28" class="visual-iq-label">D</text><polygon points="125,190 80,130 125,70" class="visual-iq-shape"/><circle cx="100" cy="160" r="8" class="visual-iq-dark"/></g></svg></div>`;
    }
    if(x.nd==="cube"){
      const cube=(x0,label,front,top,right)=>`<g transform="translate(${x0},45)"><text x="55" y="-18" text-anchor="middle" class="visual-iq-label">${label}</text><polygon points="40,0 95,25 55,50 0,25" fill="#f8fafc" stroke="#111827" stroke-width="3"/><polygon points="0,25 55,50 55,115 0,88" fill="#e2e8f0" stroke="#111827" stroke-width="3"/><polygon points="55,50 95,25 95,90 55,115" fill="#cbd5e1" stroke="#111827" stroke-width="3"/><text x="48" y="32" text-anchor="middle" font-size="22">${top}</text><text x="28" y="82" text-anchor="middle" font-size="22">${front}</text><text x="75" y="82" text-anchor="middle" font-size="22">${right}</text></g>`;
      v.innerHTML=`<div class="visual-iq-canvas"><div class="visual-iq-note"><b>Würfelrotation:</b> Symbole dürfen durch Drehen ihre Position ändern, aber Nachbarschaften bleiben erhalten.</div><svg class="visual-iq-svg" viewBox="0 0 760 220">${cube(25,"Start","●","▲","■")}${cube(170,"A","■","●","◆")}${cube(315,"B","▲","■","●")}${cube(460,"C","●","◆","▲")}${cube(605,"D","◆","■","●")}</svg></div>`;
    }
    if(x.nd==="fold"){
      const holes=x.pattern==="corner"?[[45,45],[155,45],[45,155],[155,155]]:x.pattern==="diagonal"?[[55,55],[145,145],[55,145],[145,55]]:[[60,100],[140,100],[100,60],[100,140]];
      const answer=(x0,label,pts)=>`<g transform="translate(${x0},45)"><text x="50" y="-15" text-anchor="middle" class="visual-iq-label">${label}</text><rect x="0" y="0" width="100" height="100" fill="#fff" stroke="#111827" stroke-width="3"/>${pts.map(p=>`<circle cx="${p[0]/2}" cy="${p[1]/2}" r="5" class="visual-iq-dark"/>`).join("")}</g>`;
      v.innerHTML=`<div class="visual-iq-canvas"><div class="visual-iq-note"><b>Faltfigur:</b> Die gestrichelten Linien sind Faltachsen. Ein Loch wird im gefalteten Zustand gesetzt.</div><svg class="visual-iq-svg" viewBox="0 0 760 230"><g transform="translate(35,25)"><rect x="0" y="0" width="160" height="160" fill="#fff" stroke="#111827" stroke-width="3"/><line x1="80" y1="0" x2="80" y2="160" stroke="#64748b" stroke-dasharray="8 7" stroke-width="3"/><line x1="0" y1="80" x2="160" y2="80" stroke="#64748b" stroke-dasharray="8 7" stroke-width="3"/><circle cx="40" cy="40" r="7" class="visual-iq-dark"/><text x="80" y="185" text-anchor="middle" class="visual-iq-muted">gefaltet + gelocht</text></g>${answer(245,"A",[[45,45],[155,45],[45,155],[155,155]])}${answer(370,"B",[[45,45],[45,155]])}${answer(495,"C",[[55,55],[145,145],[55,145],[145,55]])}${answer(620,"D",[[60,100],[140,100],[100,60],[100,140]])}</svg></div>`;
    }
    if(x.nd==="matrixIQ"){
      const cell=(x0,y0,content)=>`<g transform="translate(${x0},${y0})"><rect width="70" height="70" rx="10" fill="#fff" stroke="#111827" stroke-width="3"/>${content}</g>`;
      const tri='<polygon points="35,13 58,55 12,55" class="visual-iq-shape"/>';
      const cir='<circle cx="35" cy="35" r="22" class="visual-iq-light"/>';
      const sq='<rect x="16" y="16" width="38" height="38" class="visual-iq-shape"/>';
      v.innerHTML=`<div class="visual-iq-canvas"><div class="visual-iq-note"><b>Matrix:</b> Pro Zeile verändert sich Form, Füllung oder Rotation. Unten rechts fehlt das Ergebnis.</div><svg class="visual-iq-svg" viewBox="0 0 760 330"><g transform="translate(40,35)">${cell(0,0,tri)}${cell(85,0,cir)}${cell(170,0,sq)}${cell(0,85,cir)}${cell(85,85,sq)}${cell(170,85,tri)}${cell(0,170,sq)}${cell(85,170,tri)}${cell(170,170,'<text x="35" y="46" text-anchor="middle" font-size="34" font-weight="900">?</text>')}</g><g transform="translate(365,35)">${cell(0,0,'<text x="35" y="46" text-anchor="middle" class="visual-iq-label">A</text>'+cir)}${cell(95,0,'<text x="35" y="46" text-anchor="middle" class="visual-iq-label">B</text>'+tri)}${cell(0,95,'<text x="35" y="46" text-anchor="middle" class="visual-iq-label">C</text>'+sq)}${cell(95,95,'<text x="35" y="46" text-anchor="middle" class="visual-iq-label">D</text>'+cir.replace('visual-iq-light','visual-iq-dark'))}</g></svg></div>`;
    }
    if(x.nd==="circuit"){
      const open=x.scenario==="openSwitch";
      const short=x.scenario==="short";
      v.innerHTML=`<div class="visual-iq-canvas"><svg class="visual-iq-svg" viewBox="0 0 760 300"><text x="35" y="28" class="visual-iq-label">Stromlaufplan</text><line x1="70" y1="70" x2="70" y2="230" class="visual-iq-wire"/><line x1="70" y1="70" x2="660" y2="70" class="visual-iq-wire"/><line x1="70" y1="230" x2="660" y2="230" class="visual-iq-wire"/><line x1="660" y1="70" x2="660" y2="230" class="visual-iq-wire"/><rect x="45" y="125" width="50" height="50" rx="8" class="visual-iq-hot"/><text x="70" y="156" text-anchor="middle" class="visual-iq-label">+</text><line x1="205" y1="70" x2="205" y2="230" class="visual-iq-wire"/><line x1="420" y1="70" x2="420" y2="230" class="visual-iq-wire"/><circle cx="205" cy="150" r="28" class="visual-iq-light"/><text x="205" y="156" text-anchor="middle" class="visual-iq-label">L1</text><circle cx="420" cy="150" r="28" class="visual-iq-light"/><text x="420" y="156" text-anchor="middle" class="visual-iq-label">L2</text><line x1="285" y1="70" x2="335" y2="70" class="${open?'visual-iq-wire-off':'visual-iq-wire'}"/><text x="310" y="50" text-anchor="middle" class="visual-iq-muted">S1</text><line x1="505" y1="70" x2="555" y2="70" class="visual-iq-wire"/><text x="530" y="50" text-anchor="middle" class="visual-iq-muted">S2</text>${short?'<path d="M 175 150 C 190 105 225 105 235 150" class="visual-iq-wire"/><text x="205" y="110" text-anchor="middle" class="visual-iq-muted">Überbrückung</text>':''}</svg></div>`;
    }
    if(x.nd==="mechanics"){
      v.innerHTML=`<div class="visual-iq-canvas"><svg class="visual-iq-svg" viewBox="0 0 760 300"><text x="35" y="28" class="visual-iq-label">Mechanik</text><line x1="110" y1="160" x2="360" y2="160" stroke="#111827" stroke-width="10" stroke-linecap="round"/><polygon points="235,170 205,240 265,240" class="visual-iq-hot"/><rect x="120" y="90" width="45" height="65" class="visual-iq-shape"/><text x="142" y="82" text-anchor="middle" class="visual-iq-label">10 kg</text><rect x="310" y="70" width="45" height="85" class="visual-iq-shape"/><text x="332" y="62" text-anchor="middle" class="visual-iq-label">8 kg</text><text x="235" y="270" text-anchor="middle" class="visual-iq-muted">Drehmoment beachten</text><g transform="translate(470,45)"><circle cx="60" cy="55" r="32" class="visual-iq-light"/><circle cx="145" cy="55" r="32" class="visual-iq-light"/><path d="M60 87 L60 190 L145 190 L145 87" class="visual-iq-wire-off"/><rect x="86" y="185" width="35" height="40" class="visual-iq-hot"/><text x="103" y="245" text-anchor="middle" class="visual-iq-label">System B</text></g></svg></div>`;
    }
    if(x.nd==="technical"){
      v.innerHTML=`<div class="visual-iq-canvas"><svg class="visual-iq-svg" viewBox="0 0 760 300"><text x="35" y="28" class="visual-iq-label">Technisches Verständnis</text><g transform="translate(60,60)"><rect x="0" y="40" width="180" height="150" fill="#eff6ff" stroke="#111827" stroke-width="3"/><path d="M0 115 H180" stroke="#60a5fa" stroke-width="45" opacity=".45"/><circle cx="90" cy="170" r="8" class="visual-iq-dark"/><text x="90" y="220" text-anchor="middle" class="visual-iq-muted">Druck steigt mit Tiefe</text></g><g transform="translate(320,60)"><rect x="0" y="80" width="160" height="100" fill="none" stroke="#111827" stroke-width="6"/><line x1="0" y1="180" x2="160" y2="80" stroke="#111827" stroke-width="6"/><line x1="0" y1="80" x2="160" y2="180" stroke="#111827" stroke-width="6"/><text x="80" y="220" text-anchor="middle" class="visual-iq-muted">Dreieck versteift</text></g><g transform="translate(570,70)"><circle cx="25" cy="90" r="24" class="visual-iq-light"/><circle cx="105" cy="90" r="42" class="visual-iq-light"/><path d="M25 66 C50 20 100 20 105 48" class="visual-iq-wire-off"/><text x="65" y="180" text-anchor="middle" class="visual-iq-muted">Riemenantrieb</text></g></svg></div>`;
    }
  }

  function renderMechanicVisual(x) {
    const v=$("visual");
    if(x.nd==="gear"){let h='<div class="visualBox"><svg width="100%" height="170" viewBox="0 0 900 170" preserveAspectRatio="xMidYMid meet">'; const count=x.labels.length,gap=Math.min(125,760/(count-1||1)),startX=80,y=92; function gearPath(cx,cy,r,teeth){let d=''; for(let k=0;k<teeth*2;k++){const ang=(-Math.PI/2)+(k*Math.PI/teeth),rr=k%2===0?r+8:r,px=cx+Math.cos(ang)*rr,py=cy+Math.sin(ang)*rr; d+=(k===0?'M ':' L ')+px.toFixed(1)+' '+py.toFixed(1);} return d+' Z';} x.labels.forEach((lab,i)=>{const cx=startX+i*gap, mark=x.dirs[i]; h+=`<path d="${gearPath(cx,y,31,18)}" fill="#f8fafc" stroke="#111827" stroke-width="3"/><circle cx="${cx}" cy="${y}" r="22" fill="#fff" stroke="#111827" stroke-width="3"/><circle cx="${cx}" cy="${y}" r="6" fill="#111827"/><text x="${cx}" y="28" text-anchor="middle" font-size="20" font-weight="900">${lab}</text><text x="${cx}" y="103" text-anchor="middle" class="spinArrow">${mark}</text>`; if(i<x.labels.length-1){const nx=startX+(i+1)*gap; h+=`<line x1="${cx+43}" y1="${y}" x2="${nx-43}" y2="${y}" stroke="#111827" stroke-width="4" stroke-linecap="round"/>`;}}); v.innerHTML=h+'</svg></div>';}
    if(x.nd==="belt")v.innerHTML=`<div class="visualBox"><svg width="320" height="150" viewBox="0 0 320 150"><circle cx="210" cy="75" r="${Math.min(55,x.big/1.3)}" fill="#fff" stroke="#111827" stroke-width="4"/><circle cx="80" cy="75" r="${Math.max(22,x.small)}" fill="#f8fafc" stroke="#111827" stroke-width="4"/><line x1="80" y1="${75-Math.max(22,x.small)}" x2="210" y2="${75-Math.min(55,x.big/1.3)}" stroke="#111827" stroke-width="3"/><line x1="80" y1="${75+Math.max(22,x.small)}" x2="210" y2="${75+Math.min(55,x.big/1.3)}" stroke="#111827" stroke-width="3"/><text x="75" y="140" font-weight="700">klein</text><text x="190" y="140" font-weight="700">groß</text></svg></div>`;
    if(x.nd==="blocks"){let cells=[]; x.shape.grid.forEach((row,r)=>row.forEach((c,col)=>{if(c)cells.push([col,r])})); v.innerHTML=`<div class="visualBox"><svg width="280" height="210" viewBox="0 0 280 210">${cells.map(p=>{const x0=80+p[0]*42,y0=40+p[1]*42; return `<rect x="${x0}" y="${y0}" width="40" height="40" fill="#e2e8f0" stroke="#111827" stroke-width="2"/><polygon points="${x0},${y0} ${x0+12},${y0-10} ${x0+52},${y0-10} ${x0+40},${y0}" fill="#f8fafc" stroke="#111827" stroke-width="2"/><polygon points="${x0+40},${y0} ${x0+52},${y0-10} ${x0+52},${y0+30} ${x0+40},${y0+40}" fill="#cbd5e1" stroke="#111827" stroke-width="2"/>`;}).join("")}</svg></div>`;}
    if(x.nd==="net")v.innerHTML=`<div class="visualBox"><div style="display:grid;grid-template-columns:repeat(4,46px);gap:2px;justify-content:center"><div></div><div class="cell" style="height:46px"></div><div></div><div></div><div class="cell" style="height:46px"></div><div class="cell" style="height:46px"></div><div class="cell" style="height:46px"></div><div class="cell" style="height:46px"></div><div></div><div class="cell" style="height:46px"></div><div></div><div></div></div></div>`;
  }

  function targetTotal() {return isAdaptiveElite()?MODES.ctc.amount:state.quiz.length;}
  function placeholderHistory(i, reason) {
    const q=state.quiz[i];
    return {q:q?.q || (reason==="notGenerated"?"Adaptive Aufgabe wurde nicht mehr erzeugt.":"Aufgabe wurde nicht bearbeitet."),cat:q?.cat||"Nicht bearbeitet",group:q?.group||(q?groupFor(q.cat):"Nicht bearbeitet"),block:q?.block||(state.selectedMode==="ctcLohr"?"Nicht bearbeitet":""),answers:q?.a||["Nicht bearbeitet"],correctIndex:typeof q?.correct==="number"?q.correct:0,givenIndex:null,correct:false,timeout:reason==="timeout",skipped:true,explanation:q?.ex||(reason==="notGenerated"?"Diese Aufgabe wurde nicht erreicht und zählt deshalb als falsch.":"Diese Aufgabe wurde offen gelassen und zählt deshalb als falsch."),visualType:q?.type||"mc",duration:0,allowed:q?.time||0};
  }
  function finalizeOpenAnswers(reason="open") {
    const total=targetTotal();
    for(let i=0;i<total;i++){ if(!state.history[i]){state.history[i]=i<state.quiz.length?placeholderHistory(i,reason):placeholderHistory(i,"notGenerated"); if(!state.questionStates[i])state.questionStates[i]="skip";} if(typeof state.history[i].correct!=="boolean")state.history[i].correct=false; }
  }
  function endEarly() {
    if(state.exam.enabled && !confirm("Prüfungsmodus wirklich beenden? Offene Aufgaben werden als falsch gezählt.")) return;
    clearInterval(state.timer);
    clearRouteTimers();
    finalizeOpenAnswers("manualEnd");
    showResult();
  }
  function showResult() {
    clearInterval(state.timer); clearRouteTimers(); finalizeOpenAnswers();
    state.testEnd=new Date(); hideAll(); $("result").classList.remove("hidden");
    state.score=state.history.filter(h=>h&&h.correct).length;
    const total=state.history.filter(Boolean).length||1, percent=Math.round(state.score/total*100), dur=state.testStart?formatDuration(state.testEnd-state.testStart):"nicht erfasst", target=state.selectedMode==="ctc"?70:state.selectedMode==="bps"?75:80, verdict=percent>=target?"Stark für diesen Modus.":percent>=target-10?"Knapp dran, aber noch instabil unter Druck.":"Noch zu fehleranfällig für einen sicheren Lauf.", avg=Math.round(state.history.reduce((s,h)=>s+(h?.duration||0),0)/total/100)/10;
    const trainingModes=["mathSprint","logicSprint","concentrationSprint","visualIQSprint","itSprint","knowledgeSprint","techniqueSprint","errorTrainingPrep"];
    const trainingNote=trainingModes.includes(state.selectedMode)?'<div class="training-note"><b>Blocktraining PRO:</b> Dieser Lauf zählt als gezielte Trainingseinheit. Nutze die Kategorieauswertung direkt für den nächsten Sprint.</div>':'';
    $("resultText").innerHTML=`${state.exam.enabled?'<div class="exam-banner">Prüfungsmodus abgeschlossen. Offene Aufgaben wurden streng gewertet.</div>':""}${trainingNote}<div class="bigScore">${state.score}/${total}</div><div class="statsgrid"><div class="stat"><b>Quote</b><br><strong>${percent}%</strong></div><div class="stat"><b>Beginn</b><br><strong>${formatTime(state.testStart)}</strong></div><div class="stat"><b>Ende</b><br><strong>${formatTime(state.testEnd)}</strong></div><div class="stat"><b>Dauer</b><br><strong>${dur}</strong></div><div class="stat"><b>Ø pro Aufgabe</b><br><strong>${avg}s</strong></div></div><div class="tipBox"><b>${verdict}</b></div>`;
    renderCategoryStats(); renderTips(percent); renderReview(); saveResult(percent,dur,avg);
  }
  function renderCategoryStats() {
    const answered=state.history.filter(Boolean), cats=[...new Set(answered.map(h=>h.group))];
    $("categoryStats").innerHTML=cats.map(cat=>{const items=answered.filter(h=>h.group===cat), r=items.filter(h=>h.correct).length, p=Math.round(r/items.length*100), avg=Math.round(items.reduce((s,h)=>s+h.duration,0)/items.length/100)/10; return `<div class="stat"><b>${cat}</b><br>${r}/${items.length} richtig<br><strong>${p}%</strong><br><span class="small">Ø ${avg}s</span></div>`;}).join("");
    if(state.selectedMode==="ctcLohr") {
      const blocks=["1. Allgemeinwissen","2. Mathe","3. Logik","4. Konzentration","5. EDV Kenntnisse","Nicht bearbeitet"];
      const rows=blocks.map(block=>{const items=answered.filter(h=>h.block===block); if(!items.length)return ""; const r=items.filter(h=>h.correct).length, p=Math.round(r/items.length*100), open=items.filter(h=>h.givenIndex===null).length; return `<div class="stat"><b>${block}</b><br>${r}/${items.length} richtig<br><strong>${p}%</strong><br><span class="small">offen/übersprungen: ${open}</span></div>`;}).join("");
      $("categoryStats").innerHTML+=`<div class="box" style="grid-column:1/-1"><h3>Blockauswertung</h3><div class="statsgrid">${rows}</div></div>`;
    }
  }
  function renderTips(percent) {
    const answered=state.history.filter(Boolean), cats=[...new Set(answered.map(h=>h.group))].map(cat=>{const items=answered.filter(h=>h.group===cat); return {cat,p:Math.round(items.filter(h=>h.correct).length/items.length*100),avg:items.reduce((s,h)=>s+h.duration,0)/items.length};}).sort((a,b)=>a.p-b.p);
    const weakest=cats[0], slow=[...cats].sort((a,b)=>b.avg-a.avg)[0], timeouts=answered.filter(h=>h.timeout).length, open=answered.filter(h=>h.givenIndex===null).length;
    const tips=[];
    if(state.selectedMode==="ctcLohr")tips.push("Prüfungsstrategie: Im Konzentrationsblock nicht vorne festbeißen. Erst sichere Aufgaben holen, dann schwere markieren und später prüfen.");
    if(weakest)tips.push(`Schwächste Kategorie: <b>${weakest.cat}</b>. Nächster Lauf: gezielt 15 Minuten diesen Bereich.`);
    if(slow)tips.push(`Langsamste Kategorie: <b>${slow.cat}</b>. Dort mit Stoppuhr üben.`);
    if(timeouts)tips.push(`Zeitabläufe: <b>${timeouts}</b>. Leichte Aufgaben zuerst sicher holen, schwere schneller überspringen.`);
    if(open)tips.push(`${open} offene oder übersprungene Aufgaben wurden als falsch gezählt.`);
    if(!isAdaptiveElite())tips.push("Für gezieltes Nachtrainieren nutze den Eignungstest-Elite-Modus."); else tips.push("Elite-Runde beendet: Wiederhole den Modus direkt, damit deine Schwächen erneut unter Druck trainiert werden.");
    $("tips").innerHTML=`<div class="box"><h3>Tipps zum Besserwerden</h3><ul>${tips.map(t=>`<li>${t}</li>`).join("")}</ul></div>`;
    if(state.selectedMode==="ctcLohr") {
      const blocks=["1. Allgemeinwissen","2. Mathe","3. Logik","4. Konzentration","5. EDV Kenntnisse"]; let weakestBlock=null;
      blocks.forEach(block=>{const items=answered.filter(h=>h.block===block); if(items.length){const p=Math.round(items.filter(h=>h.correct).length/items.length*100); if(!weakestBlock||p<weakestBlock.p)weakestBlock={block,p};}});
      if(weakestBlock)$("tips").innerHTML+=`<div class="tipBox"><b>Simulationsempfehlung:</b> Schwächster Block ist <b>${weakestBlock.block}</b> mit ${weakestBlock.p}%. Genau diesen Block gezielt trainieren.</div>`;
      const edv=answered.filter(h=>h.block==="5. EDV Kenntnisse"); if(edv.length){const byKind={}; edv.forEach(h=>{const nd=h.schemaKind||h.selectedKind||"EDV-Fehler"; if(!byKind[nd])byKind[nd]={n:0,r:0}; byKind[nd].n++; if(h.correct)byKind[nd].r++;}); const rows=Object.keys(byKind).map(k=>`${k}: ${byKind[k].r}/${byKind[k].n}`).join(" · "); $("tips").innerHTML+=`<div class="tipBox"><b>EDV-Diagramm Auswertung:</b> ${rows}. Trainiere das genaue Abgleichen von Geschichte, Pfeilrichtung und Inhalt.</div>`;}
    }
  }
  function renderReview() {
    const wrong=state.history.filter(h=>h&&!h.correct);
    if(!wrong.length){$("review").innerHTML='<div class="box">Keine Fehler. Sehr sauber.</div>';return;}
    const groups=[...new Set(wrong.map(h=>h.group||"Sonstiges"))];
    const filterHtml=`<div class="reviewFilter"><button onclick="App.filterReview('all')">Alle Fehler</button><button onclick="App.filterReview('open')">Nur offen/übersprungen</button>${groups.map(g=>`<button onclick="App.filterReview('${String(g).replace(/'/g,"\\'")}')">${g}</button>`).join("")}</div>`;
    $("review").innerHTML=filterHtml+wrong.map((h,i)=>{const given=h.givenIndex===null?(h.timeout?"Zeit abgelaufen":"Übersprungen/offen"):h.answers[h.givenIndex], corr=h.answers[h.correctIndex]; const isEdv=(h.visualType==="edvmulti"); const givenText=isEdv?`${given || "keine Auswahl"} · Fehlerart: ${h.selectedKind || "nicht gewählt"}`:given; const corrText=isEdv?`${corr} · Fehlerart: ${h.schemaKind || "unbekannt"}`:corr; return `<div class="reviewItem" data-group="${h.group||"Sonstiges"}" data-miss="${h.givenIndex===null?1:0}"><b>${i+1}. ${h.cat}</b><br><b>Aufgabe:</b> ${h.q}<p>Deine Antwort: <b>${givenText}</b><br>Richtig: <b>${corrText}</b></p><p class="small"><b>Erklärung:</b> ${h.explanation}</p><p class="small">Bearbeitungszeit: ${Math.round(h.duration/100)/10}s</p></div>`;}).join("");
  }

  function filterReview(nd) {
    const items=document.querySelectorAll("#review .reviewItem");
    items.forEach(el=>{
      if(nd==="all") {el.style.display="block"; return;}
      const type=el.getAttribute("data-group")||"";
      const miss=el.getAttribute("data-miss")||"";
      if(nd==="open") el.style.display=miss==="1"?"block":"none";
      else el.style.display=type===nd?"block":"none";
    });
  }

  function toggleReview(){$("review").classList.toggle("hidden");}
  function saveResult(percent,dur,avg) {
    const data=getResults(), cats={};
    state.history.filter(Boolean).forEach(h=>{if(!cats[h.group])cats[h.group]={n:0,r:0,t:0}; cats[h.group].n++; if(h.correct)cats[h.group].r++; cats[h.group].t+=h.duration;});
    const aiSession=SessionTracker.buildSession(state.history,state.selectedMode,MODES[state.selectedMode].title);
    const profile=readProfile();
    data.push({date:new Date().toISOString(),player_name:profile.name||"Gast",player_id:profile.player_id,mode:state.selectedMode,title:MODES[state.selectedMode].title,score:state.score,total:state.history.length,percent,duration:dur,avg,cats,exam:{...state.exam},aiSession,appVersion:APP_VERSION});
    StorageEngine.write(data.map(entry=>DatabaseBridge.createResultRecord(entry)).slice(-StorageEngine.maxRecords));
    const latest = data[data.length-1];
    HighscoreEngine.persistFromResults(data).catch(()=>{});
    CloudHighscoreEngine.submit(latest).then(()=>CloudHighscoreEngine.refreshDashboard()).catch(err=>{console.warn("Cloud Highscore Sync", err); CloudHighscoreEngine.refreshDashboard();});
  }
  function getResults(){return StorageEngine.read([]).map(entry=>Guard.normalizeResult(entry));}

  function renderCurrentRunAnalysis() {
    const profile=AnalyticsEngine.buildFromHistory(state.history, MODES[state.selectedMode]?.title||"Aktueller Test");
    const cells=Object.entries(profile.cats).map(([name,c])=>{const cls=c.percent>=80?"good":c.percent>=60?"mid":"bad"; return `<div class="heatcell ${cls}"><b>${name}</b>${c.percent}%<br><span class="small">${c.correct}/${c.total} richtig · Ø ${Math.round(c.avgMs/1000)}s</span></div>`;}).join("");
    const bars=profile.timeProfile.map(x=>`<div class="timebar" title="Aufgabe ${x.i}: ${Math.round(x.ms/1000)}s" style="height:${Math.max(8,Math.min(110,Math.round((x.ms||0)/250)))}px;background:${x.correct?"#111827":"#991b1b"}"></div>`).join("");
    const rec=profile.recommendations.map(r=>`<div class="reco-item"><strong>${r.title}</strong>${r.text}</div>`).join("");
    return `<h2>Visual IQ System</h2><div class="analysis-pro-grid"><div class="analysis-card"><b>Trefferquote</b><div class="analysis-score">${profile.percent}%</div></div><div class="analysis-card"><b>Stressrisiko</b><div class="analysis-score">${profile.stress.risk}</div></div><div class="analysis-card"><b>Ø Zeit</b><div class="analysis-score">${Math.round(profile.stress.avgMs/1000)}s</div></div></div><h3>Kategorieprofil</h3><div class="heatmap">${cells}</div><h3>Zeitprofil</h3><div class="timeline">${bars}</div><h3>Empfehlungen</h3><div class="reco-list">${rec}</div>`;
  }

  function showAnalysis() {
    hideAll(); $("analysis").classList.remove("hidden"); const data=getResults();
    if(!data.length){$("analysisContent").innerHTML='<div class="box">Noch keine gespeicherten Testläufe. Starte zuerst einen Test.</div>';return;}
    const coach=CoachEngine.build(data);
    const aiPanel=`<div class="box"><h3>AI Coach Engine</h3><div class="ai-readiness-bar"><div class="ai-readiness-fill" style="width:${coach.readiness.percent}%"></div></div><p><b>Datenbasis:</b> ${coach.readiness.percent}% · Simulationen ${coach.readiness.simulationCount}/${coach.readiness.required}</p><p><b>Empfehlung:</b> ${escHTML(coach.recommendation.title)} — ${escHTML(coach.recommendation.text)}</p><p><b>Adaptive Engine:</b> ${coach.adaptive.label} · Level ${coach.adaptive.globalLevel} · Fokus ${escHTML(coach.adaptive.focusGroup || "ausgeglichen")}</p><p><b>Dynamic Generator:</b> ${escHTML(DynamicGeneratorEngine.explainMix(coach.dynamicMix))}</p><p><b>Learning Memory:</b> ${escHTML(LearningMemoryEngine.summary(coach.learning))}</p><p><b>Full Simulation:</b> ${escHTML(FullSimulationEngine.label(coach.simulation))} · Abdeckung ${coach.simulation.coverage}% · Risiko ${escHTML(coach.simulation.risk)}</p><div class="ai-list">${coach.weaknesses.slice(0,4).map((w,i)=>`<div>${i+1}. <b>${escHTML(w.group)}</b> · ${w.percent}% · ${w.wrong} Fehler</div>`).join("") || "<div>Noch keine Schwächen berechnet.</div>"}</div></div>`;
    const best=data.reduce((a,b)=>b.percent>a.percent?b:a,data[0]), last=data[data.length-1], avg=Math.round(data.reduce((s,x)=>s+x.percent,0)/data.length), recent=data.slice(-12), chart=`<div class="chart">${recent.map(x=>`<div class="barChart" style="height:${Math.max(8,x.percent*1.35)}px" title="${x.percent}%">${x.percent}</div>`).join("")}</div>`;
    const catAgg={}; data.forEach(r=>Object.keys(r.cats||{}).forEach(c=>{const o=r.cats[c]; if(!catAgg[c])catAgg[c]={n:0,r:0}; catAgg[c].n+=o.n; catAgg[c].r+=o.r;}));
    const catRows=Object.keys(catAgg).map(c=>({c,p:Math.round(catAgg[c].r/catAgg[c].n*100),n:catAgg[c].n})).sort((a,b)=>a.p-b.p), weak=catRows[0], strong=catRows[catRows.length-1];
    $("analysisContent").innerHTML=`${aiPanel}<div class="statsgrid"><div class="stat"><b>Tests gesamt</b><br><strong>${data.length}</strong></div><div class="stat"><b>Durchschnitt</b><br><strong>${avg}%</strong></div><div class="stat"><b>Beste Leistung</b><br><strong>${best.percent}%</strong><br><span class="small">${best.title}</span></div><div class="stat"><b>Letzter Test</b><br><strong>${last.percent}%</strong><br><span class="small">${formatDate(new Date(last.date))}</span></div></div><div class="box"><h3>Fortschritt letzte Läufe</h3>${chart}</div><div class="box"><h3>Kategorieanalyse</h3>${catRows.map(x=>`<div><b>${x.c}</b> ${x.p}% (${x.n} Aufgaben)<div class="hbar" style="width:${Math.max(35,x.p)}%">${x.p}%</div></div>`).join("")}</div><div class="tipBox"><b>Empfehlung:</b> ${weak?`Arbeite als Nächstes an <b>${weak.c}</b>. Deine stärkste Kategorie ist aktuell <b>${strong.c}</b>.`:"Noch zu wenig Daten."}</div><div class="box"><h3>Letzte Testläufe</h3><table class="analysisTable"><tr><th>Datum</th><th>Modus</th><th>Ergebnis</th></tr>${data.slice(-10).reverse().map(r=>`<tr><td>${formatDate(new Date(r.date))}</td><td>${r.title}</td><td>${r.score}/${r.total} · ${r.percent}%</td></tr>`).join("")}</table></div>`;
  }


  function showDatabaseInfo() {
    const panel = $("healthPanel");
    if(!panel) return;
    const d = DatabaseBridge.diagnostics();
    panel.classList.add("show");
    panel.innerHTML = `
      <b>Datenbankstatus</b>
      <div class="health-row"><span>Aktive Engine</span><strong>${d.engine}</strong></div>
      <div class="health-row"><span>IndexedDB verfügbar</span><strong>${d.indexedDbReady ? "Ja" : "Nein"}</strong></div>
      <div class="health-row"><span>IndexedDB Foundation</span><strong>${d.indexedDb && d.indexedDb.ok ? "OK" : (d.indexedDb && d.indexedDb.supported ? "initialisiert..." : "nicht verfügbar")}</strong></div>
      <div class="health-row"><span>IndexedDB Stores</span><strong>${d.indexedDb && d.indexedDb.stores ? d.indexedDb.stores.length : 0}/${d.indexedDb && d.indexedDb.expectedStores ? d.indexedDb.expectedStores.length : 0}</strong></div><div class="health-row"><span>Highscore Store</span><strong>${d.indexedDb && d.indexedDb.stores && d.indexedDb.stores.includes("highscores") ? "bereit" : "prüfen"}</strong></div><div class="health-row"><span>Cloud Highscore Config</span><strong>${(window.App && App._test && App._test.CloudHighscoreEngine && App._test.CloudHighscoreEngine.diagnostics().configured) ? "geladen" : "nicht vollständig"}</strong></div>
      <div class="health-row"><span>Migration</span><strong>${d.migration && d.migration.ready ? "vorbereitet" : "prüfen"}</strong></div>
      <div class="health-row"><span>Migrationsmodus</span><strong>${d.migration ? d.migration.phase : "-"}</strong></div>
      <div class="health-row"><span>Quellläufe gefunden</span><strong>${d.migration ? d.migration.totalRecords : 0}</strong></div>
      <div class="health-row"><span>Schema</span><strong>${d.schemaVersion}</strong></div>
      <div class="health-row"><span>Gespeicherte Läufe</span><strong>${d.records}/${d.maxRecords}</strong></div>
      <div class="health-row"><span>Ungefähre Größe</span><strong>${d.approxSizeKb} KB</strong></div>
      <div class="db-status-card"><b>Vorbereitet für spätere Stores:</b><br>${Object.keys(DATA_MODEL.stores).join(", ")}</div>
      <div class="db-status-card"><b>Aufgabenbank-Import:</b><br><code>source, sourcePage, category, group, subtype, difficulty, question, answers, correct, explanation, tags, verified</code><br><span class="small">Status V7.0.5: vorbereitet, runtime-deaktiviert.</span></div>
      <div class="db-status-card"><b>Feature Flags:</b><br>Aktiv: ${FEATURE_STATUS.stable.join(", ")}<br>Geparkt: ${FEATURE_STATUS.disabled.join(", ")}</div>
      <div class="pwa-panel"><b>PWA & Datenbank Vorbereitung:</b><br><code>${PWA_CONFIG.manifestFile}</code> · <code>${PWA_CONFIG.serviceWorkerFile}</code><br><span class="small">${escHTML(PWA_CONFIG.note)}</span></div>
    `;
  }

  function exportBackup() {
    const payload = DatabaseBridge.exportPayload();
    const text = JSON.stringify(payload, null, 2);
    const blob = new Blob([text], {type:"application/json"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "eignungstest-trainer-backup-v7-0-5.json";
    document.body.appendChild(a);
    a.click();
    setTimeout(()=>{ URL.revokeObjectURL(url); a.remove(); }, 250);
  }

  async function showFrameworkHealth() {
    const panel = $("healthPanel");
    if(!panel) return;
    const summary = QualityEngine.summary();
    const cloudLive = await CloudHighscoreEngine.testConnection();
    panel.classList.toggle("show");
    panel.innerHTML = `
      <b>Framework-Status</b>
      <div class="health-row"><span>Version</span><strong>${summary.framework}</strong></div>
      <div class="health-row"><span>Speicher</span><strong>${summary.storage.engine} · ${summary.storage.records} Läufe</strong></div><div class="health-row"><span>Schema</span><strong>${DATA_MODEL.version}</strong></div>
      <div class="health-row"><span>Modi</span><strong>${summary.modes.length}</strong></div>
      <div class="health-row"><span>Simulation</span><strong>${summary.simulation.count} Aufgaben</strong></div>
      <div class="health-row"><span>Modus-Verträge</span><strong>${summary.contracts.length ? summary.contracts.length + " Problem(e)" : "OK"}</strong></div>
      <div class="health-row"><span>AI Engine</span><strong>${summary.ai && summary.ai.ok ? "OK" : "Prüfen"}</strong></div>
      <div class="health-row"><span>IndexedDB</span><strong>${summary.indexedDb && summary.indexedDb.ok ? "OK" : "Prüfen"}</strong></div><div class="health-row"><span>Highscore Engine</span><strong>${summary.highscore && summary.highscore.ok ? "OK" : "Prüfen"}</strong></div><div class="health-row"><span>Cloud Highscore</span><strong>${cloudLive.online ? "online" : (cloudLive.configured ? "konfiguriert · Verbindung prüfen" : "nicht verbunden")}</strong></div>
      <div class="health-row"><span>Migration</span><strong>${summary.migration && summary.migration.ok ? "Aktiv · nicht-destruktiv" : "Prüfen"}</strong></div>
      <div class="health-row"><span>Adaptive Engine</span><strong>${summary.ai && summary.ai.adaptive ? summary.ai.adaptive : "Prüfen"}</strong></div>
      <div class="health-row"><span>Dynamic Generator</span><strong>${summary.ai && summary.ai.mix ? summary.ai.mix + " Mix-Einträge" : "Prüfen"}</strong></div>
      <div class="health-row"><span>Focus Guard</span><strong>${summary.ai && summary.ai.focusGuard ? summary.ai.focusGuard : "Prüfen"}</strong></div>
      <div class="health-row"><span>Learning Memory</span><strong>${summary.ai && typeof summary.ai.learning === "number" ? summary.ai.learning + " Muster" : "Prüfen"}</strong></div>
      <div class="health-row"><span>Full Simulation</span><strong>${summary.ai && typeof summary.ai.simulation === "number" ? summary.ai.simulation + "% Abdeckung" : "Prüfen"}</strong></div>
      <div class="health-row"><span>Question Bank</span><strong>${summary.questionBank && summary.questionBank.ok ? "Schema OK · Runtime geparkt" : "Prüfen"}</strong></div>
      <div class="health-row"><span>PWA Ready</span><strong>${summary.pwa && summary.pwa.ok ? "Manifest aktiv · Cache an" : "Prüfen"}</strong></div>
      <div class="health-row"><span>Stabile Module</span><strong>${FEATURE_STATUS.stable.length}</strong></div>
      <div class="health-row"><span>Vorbereitet</span><strong>${FEATURE_STATUS.prepared.length}</strong></div>
      <div class="health-row"><span>Ausgeklammert</span><strong>${FEATURE_STATUS.disabled.length}</strong></div>
      <div class="db-status-card"><b>Supabase Cloud Diagnose:</b><br>Config geladen: <b>${cloudLive.configLoaded ? "Ja" : "Nein"}</b><br>URL: <b>${cloudLive.urlSet ? "Ja" : "Nein"}</b> · Key: <b>${cloudLive.keySet ? "Ja" : "Nein"}</b><br>Provider: <code>${escHTML(cloudLive.provider || "-")}</code> · Tabelle: <code>${escHTML(cloudLive.table || "-")}</code> · Klasse: <code>${escHTML(cloudLive.classCode || "-")}</code><br>Lesetest: <b>${cloudLive.readOk ? "OK" : "Fehler"}</b> · Status: <code>${escHTML(cloudLive.status || "-")}</code>${cloudLive.httpStatus ? " · HTTP "+cloudLive.httpStatus : ""}${cloudLive.error ? `<br><span class="small">${escHTML(cloudLive.error)}</span>` : ""}<br><span class="small">Wenn hier Config Ja, URL Ja und Key Ja steht, aber Lesetest Fehler zeigt, liegt es fast sicher an Supabase Tabelle/RLS/Policies oder Internet/CORS.</span></div>
      ${summary.contracts.length ? `<div class="db-status-card"><b>Vertragsprobleme:</b><br>${summary.contracts.map(escHTML).join("<br>")}</div>` : ""}
      <div class="health-row"><span>Status</span><strong>${summary.ok ? "OK" : "Prüfen"}</strong></div>
    `;
  }


  function clearProgress(){if(confirm("Wirklich alle gespeicherten Ergebnisse löschen?")){StorageEngine.clear(); showAnalysis();}}
  function restart(){clearInterval(state.timer); clearInterval(state.memoryTimer); clearRouteTimers(); clearExamBodyClass(); state.exam={enabled:false,hardcore:false,lockBack:false,started:false}; hideAll(); $("start").classList.remove("hidden"); renderModes();}


  function bindRuntimeEvents(){
    if(window.__ET_RUNTIME_EVENTS_BOUND__) return;
    window.__ET_RUNTIME_EVENTS_BOUND__ = true;
    document.addEventListener("click", function(ev){
      const saveBtn = ev.target && ev.target.closest ? ev.target.closest('[data-action="save-profile-name"]') : null;
      if(saveBtn){ ev.preventDefault(); saveProfileName(); }
    });
    document.addEventListener("keydown", function(ev){
      if(ev.key !== "Enter") return;
      const target = ev.target;
      if(target && target.matches && target.matches('[data-profile-name-input="1"], #profileNameInput, #profileEditNameInput')){
        ev.preventDefault();
        saveProfileName(target);
      }
    });
  }

  bindRuntimeEvents();
  IndexedDBEngine.init().then(()=>StorageEngine.loadFromIndexedDB()).then(()=>{ try { renderModes(); if($("healthPanel") && $("healthPanel").classList.contains("show")) showDatabaseInfo(); } catch(e){} });
  renderModes();

  return {setAppSection,setTopTab,selectMode,setModeTab,setTrainingFocus,saveProfileName,quickStartRecommended,prepareTest,beginQuizAfterMemory,cancelMemoryPhase,startCtcBlockFromIntro,chooseAnswer,toggleEdvMultiNode,undoEdvMultiSelection,clearEdvMultiSelection,submitEdvMultiAnswer,selectRouteStreet,undoRouteStreet,clearRouteSelection,submitRouteSequence,spQuestion,skipQuestion,prevQuestion,manualNextQuestion,toggleMarkQuestion,jumpToQuestion,endEarly,restart,toggleReview,filterReview,showAnalysis,showFrameworkHealth,showDatabaseInfo,exportBackup,clearProgress,
    _test:{FRAMEWORK,FEATURE_FLAGS,FEATURE_STATUS,PWA_CONFIG,MODULE_TREE,DATA_MODEL,MigrationPlanner,IndexedDBEngine,DatabaseBridge,StorageEngine,Guard,AnalyticsEngine,SessionTracker,ErrorMemory,DataReadiness,WeaknessProfile,CognitiveProfile,RecommendationEngine,TrainingFocusEngine,AdaptiveDifficultyEngine,DynamicGeneratorEngine,LearningMemoryEngine,FullSimulationEngine,HighscoreEngine,CloudHighscoreEngine,QuestionBankEngine,QUESTION_BANK_SCHEMA,QUESTION_BANK,CoachEngine,QualityEngine,readExamOptions,applyExamBodyClass,showExamLockNotice,MODES,buildQuiz,Generators,stableSignature,state,finalizeOpenAnswers,showResult,selectMode,startQuiz,EDV_SCHEMA,EDV_ERRORS,CTC_BLOCK_LIMITS}};
})();
