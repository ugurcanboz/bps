/* Eignungstest-Trainer · Runtime
   Hauptlogik für Training, Auswertung, Speicherung und PWA-Betrieb. */
"use strict";

/*
===============================================================================
Eignungstest-Trainer · Stabilitäts-Audit + Matrix-Pflichtübernahme
===============================================================================
Struktur:
- Core: Modi, Quiz-Ablauf, Timer, Navigation, Wertung
- Generatoren: Wissen, Mathe, Logik, Konzentration, Route-Memory, EDV
- Renderer: Multiple Choice, visuelle Aufgaben, Route-Sequenz, EDV-Multi-Choice
- Storage: IndexedDB als Hauptspeicher, localStorage als Fallback
- PWA: Manifest, Service Worker, Cache-Bereinigung
- Qualität: Guard, Framework-Health, Simulation-Checks

Strukturpflege :
- Versions- und Cache-Bezeichnungen vereinheitlicht
- EDV-Einzelfrage aus Export und Runtime entfernt
- EDV-Modul auf Multi-Choice-Gesamtauswertung stabilisiert
- MigrationPath auf  aktualisiert
- ältere Kommentarblöcke bereinigt
===============================================================================
*/

window.App = (() => {
  const STORE_KEY = "eignungstest_trainer_results";
  const LEGACY_STORE_KEYS = ["eignungstest_trainer_v8012_results","eignungstest_trainer_v700_results","eignungstest_trainer_v514_results","eignungstest_trainer_v512_results","eignungstest_trainer_v501_results","eignungstest_trainer_v42_results","eignungstest_trainer_v36_results","eignungstest_trainer_v355_results","eignungstest_trainer_v354_results","eignungstest_trainer_v353_results","eignungstest_trainer_v35_results","eignungstest_trainer_v341_results","eignungstest_trainer_v34_results","eignungstest_trainer_v332_results","eignungstest_trainer_v33_results","eignungstest_trainer_v331_results","eignungstest_trainer_v321_results","eignungstest_trainer_v32_results","eignungstest_trainer_v311_results","eignungstest_trainer_v31_results","eignungstest_trainer_v292_results","eignungstest_trainer_v291_results","eignungstest_trainer_v29_results","eignungstest_trainer_v281_results","eignungstest_trainer_v28_results","eignungstest_trainer_v231_results","eignungstest_trainer_v251_results","eignungstest_trainer_v23_results","eignungstest_trainer_v19_results","eignungstest_trainer_v18_results","eignungstest_trainer_v17_results","eignungstest_trainer_v16_results"];
  const APP_VERSION = (window.AppConfig && window.AppConfig.build) || "G40.7-2026-06-15";
  const PROFILE_KEY = "eignungstest_trainer_profile";
  const PROFILE_LEGACY_KEYS = ["eignungstest_trainer_profile_v8012","eignungstest_trainer_profile_v700","eignungstest_trainer_profile_v514","eignungstest_trainer_profile_v512","eignungstest_trainer_profile_v501","eignungstest_trainer_profile_v42","eignungstest_trainer_profile_v36","eignungstest_trainer_profile_v355","eignungstest_trainer_profile_v354","eignungstest_trainer_profile_v353","eignungstest_trainer_profile_v35","eignungstest_trainer_profile_v341","eignungstest_trainer_profile_v34","eignungstest_trainer_profile_v332","eignungstest_trainer_profile_v33","eignungstest_trainer_profile_v331","eignungstest_trainer_profile_v321","eignungstest_trainer_profile_v32","eignungstest_trainer_profile_v311","eignungstest_trainer_profile_v31","eignungstest_trainer_profile_v292","eignungstest_trainer_profile_v291","eignungstest_trainer_profile_v29","eignungstest_trainer_profile_v281","eignungstest_trainer_profile_v27","eignungstest_trainer_profile_v251","eignungstest_trainer_profile_v23","eignungstest_trainer_profile_v19"];
  const FOCUS_KEY = "eignungstest_trainer_focus";
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
    nextBranches:["adaptiveErrorTraining","visualIQHardcore","pwaCacheRuntimeDisabled","indexedDbDatabase","profileSystem"]
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
    pwaServiceWorkerRuntime:false,
    pwaCacheRuntimeDisabled:false,
    pwaInstall:true,
    highscoreDashboard:true,
    highscoreCloudSync:true,
    cloudLeaderboard:true
  });

  const FEATURE_STATUS = Object.freeze({
    stable:["coreQuiz","modeHub","simulation","focusGuard","analysis","backup","indexedDbPrimary","localStorageFallback","cloudHighscoreFallback","pwaMetadata","pwaCleanup","pwaMetadata","cacheRecovery","iconFinalReady","indexedDbFoundation","databaseSelftest","migrationActive"],
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
    cacheName:"cache-kill-switch-v8012-no-runtime-cache",
    icons:["icons/icon-180.png","icons/icon-192.png","icons/icon-512.png","icons/maskable-512.png"],
    status:"indexeddb-primary-active-cache-diagnose",
    note:" Lokaler Start, Desktop/Mobile-Ansicht, relative Pfade und Update-Hinweise sind vorbereitet."
  });

  

  const SYSTEM_RUNTIME = Object.freeze({
    autosave:true,
    crashRecovery:true,
    duplicateProtection:true,
    cloudRetryQueue:true,
    offlineFirst:true,
    syncMode:"safe-sync-v8012"
  });

const FRAMEWORK = {
    name:"Eignungstest-Trainer",
    version:"internal",
    storageVersion:"2",
    offline:false,
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
      "Stabile Grundstruktur",
      "Offline-Modus",
      "Manifest Template",
      "Service Worker temporär deaktiviert bis Layout/Deploy stabil ist",
      "IndexedDB Full Activation",
      "Produktmodus",
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
    version:"internal",
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
    migrationPath:["1.0","1.1","1.2","1.2.1","1.3","1.4","1.4.1","1.5","1.5.1","1.6","1.6.1","1.7","1.7.1","1.7.2","1.8","1.8.1","1.9","1.9.1","2.0","2.1","2.2","2.3","2.3.1","2.4","2.5","2.5.1","2.6","2.7","2.8","2.8.1","2.9","2.9.1","3.1","3.1.1","3.2","3.3","3.3.1","3.3.2","3.4","3.4.1","3.5","3.5.1","3.5.2","3.5.3","3.5.4","3.5.5","3.6.0","3.6.1","3.6.2","4.0.0","4.1.0","4.1.1","4.2.0","4.2.1","5.0.0","5.0.1","5.0.2","5.1.0","5.1.1","5.1.2","5.1.3","5.1.4","6.0.0","6.1.0","6.1.1","7.0.0","8.4.2","8.4.2"],
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
    version:"internal",
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

  function bootstrapExternalQuestionBank() {
    const raw = Array.isArray(window.QUESTION_BANK_EXTERNAL) ? window.QUESTION_BANK_EXTERNAL : [];
    const accepted = [];
    raw.forEach((entry, index) => {
      const normalized = QuestionBankEngine.normalize(entry, entry.source || "external-question-bank");
      if(!normalized.id) normalized.id = "qb_external_" + index;
      const validation = QuestionBankEngine.validate(normalized);
      if(validation.ok) accepted.push(validation.item);
    });
    const seen = new Set(QUESTION_BANK.items.map(item => item.id));
    accepted.forEach(item => {
      if(!seen.has(item.id)) { QUESTION_BANK.items.push(item); seen.add(item.id); }
    });
    if(raw.length) {
      let routerIndex = null;
      try {
        if(window.EGTQuestionBankRouter && typeof EGTQuestionBankRouter.index === "function") {
          routerIndex = EGTQuestionBankRouter.index(QUESTION_BANK.items);
          QUESTION_BANK.branchIndex = routerIndex;
        }
      } catch(e0) {}
      QUESTION_BANK.sources.push({source:"data/question-bank.js", imported:accepted.length, reviewed:raw.length, branchIndex:routerIndex, createdAt:new Date().toISOString()});
      QUESTION_BANK.lastImport = {source:"data/question-bank.js", imported:accepted.length, invalid:raw.length-accepted.length, reviewed:raw.length, branchIndex:routerIndex, blocked:false, createdAt:new Date().toISOString()};
    }
    return QUESTION_BANK.lastImport;
  }

  function legacyQuestionBankCandidates(finalFilter) {
    let candidates = QuestionBankEngine.filter(finalFilter);
    if (!candidates.length && finalFilter.examTarget) {
      // Fallback: search without the specific examTarget constraint
      const {examTarget, ...rest} = finalFilter;
      candidates = QuestionBankEngine.filter(rest);
    }
    return candidates;
  }

  function routeQuestionBankCandidates(filter, level, modeOverride) {
    const activeMode = modeOverride || state.selectedMode;
    const activeBranch = activeBranchIdForQuiz();
    try {
      if(window.EGTQuestionBankRouter && typeof EGTQuestionBankRouter.resolve === "function") {
        const route = EGTQuestionBankRouter.resolve({
          filter,
          level,
          mode: activeMode,
          branch: activeBranch,
          items: QUESTION_BANK.items,
          source: "app-fromQuestionBank-phase10"
        });
        if(route && Array.isArray(route.candidates)) return route;
      }
    } catch(e) {}

    let finalFilter = {...filter};
    if ((activeMode === "ctcLohr" || activeMode === "ctc") && !finalFilter.examTarget) {
      finalFilter.examTarget = "ctc";
    } else if (activeMode === "bps" && !finalFilter.examTarget) {
      finalFilter.examTarget = "bps";
    }
    return {
      routeId:"legacy-question-bank-filter",
      version:"legacy-app",
      mode:activeMode,
      branch:activeBranch,
      filter:finalFilter,
      candidates:legacyQuestionBankCandidates(finalFilter),
      fallbackApplied:false,
      source:"app-fromQuestionBank-legacy-fallback"
    };
  }

  function fromQuestionBank(filter={}, fallback=null, level="medium", modeOverride=null) {
    const route = routeQuestionBankCandidates(filter, level, modeOverride);
    const candidates = route && Array.isArray(route.candidates) ? route.candidates : [];
    if(!candidates.length) return typeof fallback === "function" ? fallback() : fallback;
    const pool = shuffle(candidates);
    const item = pool.find(x => !state.usedQuestions.has(x.question)) || choice(candidates);
    state.usedQuestions.add(item.question);
    let inferredBankBranch = "";
    try {
      if(window.EGTQuestionBankRouter && typeof EGTQuestionBankRouter.inferBranch === "function") {
        inferredBankBranch = EGTQuestionBankRouter.inferBranch(item);
      }
    } catch(e0) {}
    // Bildaufgaben: Antworten NICHT mischen. "A"–"E" beziehen sich auf Optionen IM Bild –
    // gemischte Reihenfolge würde Buttonbeschriftung und Bildoption auseinanderreißen.
    const sh = item.imageSrc
      ? {opts: item.answers.slice(), correct: item.correct}
      : shuffleWithCorrect(item.answers, item.correct);
    const qType = item.imageSrc ? "imageTask" : "mc";
    return makeMC(item.category, level==="hard"?18:24, item.question, sh.opts, sh.correct, item.explanation, qType, {
      id:item.id,
      sourceId:item.id,
      signatureSeed:item.id,
      subtype:item.subtype || qType,
      difficulty:item.difficulty || level,
      tags:item.tags || [],
      imageSrc:item.imageSrc || "",
      imageAlt:item.imageAlt || item.question || item.category,
      tip:item.tip || "",
      trick:item.trick || "",
      stepByStep:item.stepByStep || "",
      testedConcept:item.testedConcept || "",
      similarQuestion:item.similarQuestion || "",
      examTarget:item.examTarget || "both",
      dna:item.dna || null,
      phase4:item.phase4 || null,
      skill:item.skill || item.dna?.skill || "",
      expectedTimeMs:item.expectedTimeMs || item.dna?.expectedTimeMs || 0,
      difficultyLevel:item.difficultyLevel || item.dna?.difficulty || 0,
      quality:item.quality || item.status || "needsReview",
      questionBankRoute:route && route.routeId || "legacy",
      questionBankRouterVersion:route && route.version || "legacy",
      bankBranch:inferredBankBranch,
      activeBranch:route && route.branch || activeBranchIdForQuiz(),
      bankSource:item.source || ""
    });
  }

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
        version:"internal",
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
      const sims=(results||[]).filter(r=>r.mode==="ctcLohr" && (r.total||0)>=60);
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
      const el=$("__removed_focus"); if(!el) return;
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
      if(!readiness.ready) return {title:"Coach sammelt Daten",text:`Noch ${readiness.remaining} vollständige Simulation${readiness.remaining===1?"":"en"} nötig. Blocktraining zählt als Zusatzdaten, ersetzt aber die Diagnose nicht.`,mode:"ctcLohr"};
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
      const sims=(results||[]).filter(r=>r.mode==="ctcLohr" && (r.total||0)>=60);
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

  const CloudHighscoreEngine = (window.EGTCloudHighscoreEngine && typeof window.EGTCloudHighscoreEngine.create === "function") ? window.EGTCloudHighscoreEngine.create({
    escHTML:escHTML,
    APP_VERSION:APP_VERSION,
    $:$,
    getResults:getResults,
    readProfile:readProfile,
    Guard:Guard,
    getHighscoreEngine:function(){ return HighscoreEngine; }
  }) : {
    __version:"G52.1-phase15-fallback",
    __source:"app.js-fallback",
    periods:[{key:"daily",label:"Heute"},{key:"weekly",label:"Woche"},{key:"monthly",label:"Monat"},{key:"all",label:"Gesamt"}],
    missingFields:function(){ return ["cloud-highscore-engine.js fehlt"]; },
    isConfigured:function(){ return false; },
    diagnostics:function(){ return {enabled:false,configured:false,missing:this.missingFields(),provider:"fallback",source:this.__source,periods:this.periods.map(function(p){return p.key;})}; },
    rankLabel:function(percent){ const p=Number(percent)||0; if(p>=85) return "Diamond"; if(p>=70) return "Platin"; if(p>=55) return "Gold"; if(p>=40) return "Silber"; return "Start"; },
    localFallbackBoards:function(){ return {daily:[],weekly:[],monthly:[],all:[]}; },
    cloudButtons:function(note){ return '<div class="small">Cloud Highscore Modul nicht geladen. '+escHTML(note||'')+'</div>'; },
    renderShell:function(){ return '<div class="ui-card cloud-highscore-card" id="cloudHighscoreCard"><span class="coach-badge">Cloud Highscore</span><div class="coach-action">Cloud-Modul nicht geladen</div><div class="small">Lokale Highscore-Anzeige bleibt verfügbar.</div></div>'; },
    refreshDashboard:async function(){ return {ok:false,source:this.__source,reason:"cloud-highscore-engine missing"}; },
    submit:async function(){ return {ok:false,reason:"Cloud Highscore nicht verbunden",missing:this.missingFields()}; },
    fetchTop:async function(){ return {ok:false,items:[],reason:"Cloud Highscore nicht verbunden",missing:this.missingFields()}; },
    testConnection:async function(){ return {...this.diagnostics(),online:false,readOk:false,writeReady:false,status:"fallback"}; },
    insertDebugEntry:async function(){ return {ok:false,status:"fallback",warning:"Cloud-Modul nicht geladen"}; }
  };
  try { window.CloudHighscoreEngine = CloudHighscoreEngine; } catch(e) {}

  const HighscoreEngine = (window.EGTHighscoreDashboardEngine && typeof window.EGTHighscoreDashboardEngine.create === "function") ? window.EGTHighscoreDashboardEngine.create({
    Guard:Guard,
    readProfile:readProfile,
    IndexedDBEngine:IndexedDBEngine,
    escHTML:escHTML,
    getResults:getResults,
    getCloudHighscoreEngine:function(){ return CloudHighscoreEngine; },
    maxItems:10
  }) : {
    maxItems:10,
    build(results=[]) {
      const list=(results||[]).map(r=>Guard.normalizeResult(r)).filter(r=>Number.isFinite(Number(r.percent))).sort((a,b)=>(b.percent||0)-(a.percent||0) || (b.score||0)-(a.score||0));
      const bestOverall=list[0]||null;
      const bestSimulation=list.filter(r=>r.mode==="ctcLohr")[0]||null;
      const byMode={};
      list.forEach(r=>{ const key=r.mode||r.title||"unknown"; if(!byMode[key])byMode[key]=r; });
      return {total:list.length,bestOverall,bestSimulation,top:list.slice(0,this.maxItems),byMode,updatedAt:new Date().toISOString(),source:"local"};
    },
    rankLabel(percent) {
      const p=Number(percent)||0;
      if(p>=85) return "Diamond";
      if(p>=70) return "Platin";
      if(p>=55) return "Gold";
      if(p>=40) return "Silber";
      return "Start";
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
        ? `<div class="ui-card"><span class="coach-badge">Lokaler Highscore</span><div class="coach-action">Noch kein Rekord</div><div class="small">Starte einen Test. Danach erscheint hier deine lokale Bestenliste live im Dashboard.</div></div>`
        : `<div class="ui-card"><span class="coach-badge">Lokaler Highscore</span><div class="coach-action">Bestwert: ${hs.bestOverall.percent}%</div><div class="ai-list">${top.map((r,i)=>`<div>${i+1}. <b>${escHTML(r.title||r.mode)}</b> · ${r.percent}% · ${escHTML(this.rankLabel(r.percent))}</div>`).join("")}</div><div class="small">Lokale Sicherheits-Bestenliste auf diesem Gerät.</div></div>`;
      setTimeout(()=>CloudHighscoreEngine.refreshDashboard(),0);
      return CloudHighscoreEngine.renderShell() + local;
    }
  };

  /* G37.0 · Premium-Highscore-Bridge
     Wichtig: Die vorhandene Highscore-Architektur wird NICHT überschrieben.
     Das ausgelagerte Modul js/modules/highscore-engine.js wird nur als Renderer-/Cloud-Upgrade
     auf das bereits existierende CloudHighscoreEngine-Objekt gemischt. */
  try {
    if (typeof window !== "undefined" && typeof window.createCloudHighscoreEngine === "function") {
      const premiumHighscoreEngine = window.createCloudHighscoreEngine({
        escHTML, APP_VERSION, $, getResults, readProfile, Guard, HighscoreEngine
      });
      Object.keys(premiumHighscoreEngine || {}).forEach(function(key){
        CloudHighscoreEngine[key] = premiumHighscoreEngine[key];
      });
      CloudHighscoreEngine.__source = "js/modules/highscore-engine.js";
      CloudHighscoreEngine.__customerReady = true;
      try { window.CloudHighscoreEngine = CloudHighscoreEngine; } catch(exposeError) {}
    }
  } catch(highscoreBridgeError) {
    console.warn("Premium Highscore Bridge konnte nicht geladen werden:", highscoreBridgeError);
  }

  const HighscoreDuelUIEngine = (window.EGTHighscoreDuelUIEngine && typeof window.EGTHighscoreDuelUIEngine.create === "function") ? window.EGTHighscoreDuelUIEngine.create({
    escHTML: escHTML,
    getResults: getResults,
    getDuels: function(){ return duellHistory(); },
    getPrognosisHtml: function(){ return prognosisCardHtml(); }
  }) : {
    __version: "G52.2-phase16-fallback",
    diagnostics: function(){ return {ok:false, provider:"app.js-fallback", missing:["highscore-duel-ui-engine.js fehlt"]}; },
    duellAvatarHtml: function(name, size){
      const n=String(name||"?").trim()||"?";
      const initials=n.split(/\s+/).map(w=>w[0]).join("").slice(0,2).toUpperCase();
      return `<span class="duel-avatar" style="width:${size||40}px;height:${size||40}px">${escHTML(initials)}</span>`;
    },
    fmtTime: function(ms){ const s=Math.round((ms||0)/1000); return Math.floor(s/60)+":"+String(s%60).padStart(2,"0")+" min"; },
    winnerOf: function(a,b){ if(a.result.correct!==b.result.correct) return a.result.correct>b.result.correct?a:b; if(a.result.timeMs!==b.result.timeMs) return a.result.timeMs<b.result.timeMs?a:b; return null; },
    renderDuelSetup: function(){ return '<div class="duel-setup-card"><div class="cloud-error-note">Highscore-/Duell-UI-Modul nicht geladen.</div><button type="button" class="duel-secondary-btn" onclick="App.duellCancelSetup()">Schließen</button></div>'; },
    renderDuellComparison: function(){ return '<div class="duel-result"><div class="cloud-error-note">Duell-Auswertung nicht verfügbar.</div></div>'; },
    highscoreData: function(input){ const res=(input&&input.results)||getResults(); return {top:[],recent:[],duels:duellHistory(),prognosisHtml:prognosisCardHtml(),avatarHtml:this.duellAvatarHtml,__source:this.__version}; }
  };
  try { window.HighscoreDuelUIEngine = HighscoreDuelUIEngine; } catch(e) {}

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
      return {version:"internal",readiness,memory,weaknesses,cognitive,recommendation,adaptive,dynamicMix,learning,simulation,focus:TrainingFocusEngine.current(),updatedAt:new Date().toISOString()};
    },
    renderDashboard(coach) {
      const r=coach.readiness || {percent:0,ready:false,remaining:3,simulationCount:0,required:3};
      const recommendation=coach.recommendation || {};
      const adaptive=coach.adaptive || {};
      const simulation=coach.simulation || {};
      const learning=coach.learning || {};
      const focusTitle = recommendation.title || simulation.next || adaptive.focusGroup || "gezieltes Training";
      const focusText = recommendation.text || (r.ready ? "Der Coach nutzt deine gespeicherten Ergebnisse für die nächste sinnvolle Einheit." : `Der Coach sammelt noch Daten. Es fehlen ${r.remaining||0} vollständige Simulation${(r.remaining||0)===1?"":"en"}.`);
      const weakRows=(coach.weaknesses||[]).slice(0,5).map((w,i)=>{
        const risk=Math.max(0, Math.min(100, 100-(w.percent||0)));
        return `<div class="coach-weakness-row"><b>${i+1}. ${escHTML(w.group)}</b><div class="coach-row-track"><span class="coach-row-fill" style="width:${Math.max(8,risk)}%"></span></div><span>${w.percent||0}% · ${w.wrong||0} Fehler</span></div>`;
      }).join("") || `<div class="coach-focus-card"><strong>Noch keine belastbaren Schwächen</strong><p class="small">Starte weitere Simulationen. Danach entstehen hier echte Fokusbereiche statt Platzhalter.</p></div>`;
      const cog=(coach.cognitive||[]).slice(0,4).map(x=>`<div class="coach-profile-meter"><span>${escHTML(x.name)}</span><div class="coach-progress-track"><span class="coach-progress-fill" style="display:block;width:${Math.max(8,x.score||0)}%"></span></div><b>${x.score?x.score+"%":"–"}</b></div>`).join("") || `<p class="small">Noch keine belastbaren Denkprofil-Daten vorhanden.</p>`;
      const mix=(coach.dynamicMix||[]).slice(0,6).map(x=>`<div class="coach-mix-row"><b>${escHTML(x.group)}</b><div class="coach-row-track"><span class="coach-row-fill" style="width:${Math.max(8,Math.min(100,(x.weight||0)*2))}%"></span></div><span>${x.weight||0}</span></div>`).join("") || `<p class="small">Der Aufgabenmix wird nach weiteren Ergebnissen genauer.</p>`;
      const riskClass=simulation.risk==='hoch'?'coach-risk-high':simulation.risk==='mittel'?'coach-risk-mid':'coach-risk-low';
      return `<section class="coach-ui-screen">
        <div class="coach-hero">
          <div class="coach-hero-top">
            <span class="coach-kicker">Coach-DNA aktiv</span>
            <span class="coach-readiness-pill">Datenbasis ${r.percent||0}%</span>
          </div>
          <div class="coach-hero-main">
            <h2 class="coach-hero-title">Dein nächster sinnvoller Schritt</h2>
            <p class="coach-hero-copy">${escHTML(focusText)}</p>
          </div>
          <div class="coach-focus-card">
            <strong>${escHTML(focusTitle)}</strong>
            <div class="coach-progress-track"><span class="coach-progress-fill" style="display:block;width:${Math.max(4,Math.min(100,r.percent||0))}%"></span></div>
          </div>
          <div class="coach-hero-stats">
            <div class="coach-stat-tile"><b>${r.simulationCount||0}/${r.required||3}</b><span>Simulationen</span></div>
            <div class="coach-stat-tile"><b>${coach.memory&&coach.memory.totalAttempts||0}</b><span>Versuche</span></div>
            <div class="coach-stat-tile"><b>${coach.memory&&coach.memory.totalWrong||0}</b><span>Fehler</span></div>
            <div class="coach-stat-tile"><b>${adaptive.precision||0}%</b><span>Präzision</span></div>
          </div>
        </div>

        <div class="coach-ui-grid">
          <article class="coach-panel">
            <div class="coach-panel-head"><h3>Fehlerschwerpunkte</h3><span class="coach-readiness-pill">Top Fokus</span></div>
            <div class="coach-weakness-list">${weakRows}</div>
          </article>

          <article class="coach-panel">
            <div class="coach-panel-head"><h3>Denkprofil</h3><span class="coach-readiness-pill">Live</span></div>
            <p class="small">Aus deinen Trainingsläufen berechnet. Je mehr echte Läufe, desto genauer wird das Profil.</p>
            ${cog}
          </article>

          <article class="coach-panel">
            <div class="coach-panel-head"><h3>Adaptive Schwierigkeit</h3><span class="coach-readiness-pill">Level ${escHTML(adaptive.globalLevel||'medium')}</span></div>
            <div class="coach-metric-grid">
              <div class="coach-mini-metric"><b>${adaptive.precision||0}%</b><span>Präzision</span></div>
              <div class="coach-mini-metric"><b>${adaptive.pressureRate||0}%</b><span>Druckfehler</span></div>
              <div class="coach-mini-metric"><b>${escHTML(adaptive.focusGroup||'ausgeglichen')}</b><span>Fokus</span></div>
            </div>
            <p class="small">Schwierigkeit und Zeitfenster orientieren sich an deiner aktuellen Leistung.</p>
          </article>

          <article class="coach-panel">
            <div class="coach-panel-head"><h3>Aufgabenmix</h3><span class="coach-readiness-pill">Empfohlen</span></div>
            <div class="coach-weakness-list">${mix}</div>
          </article>

          <article class="coach-panel coach-panel-wide">
            <div class="coach-panel-head"><h3>Simulation & Lernverlauf</h3><span class="coach-readiness-pill ${riskClass}">Risiko ${escHTML(simulation.risk||'niedrig')}</span></div>
            <div class="coach-metric-grid">
              <div class="coach-mini-metric"><b>${simulation.coverage||0}%</b><span>Abdeckung</span></div>
              <div class="coach-mini-metric"><b>${escHTML(learning.direction||'neutral')}</b><span>Trend</span></div>
              <div class="coach-mini-metric"><b>${learning.openTasks||0}</b><span>offene Aufgaben</span></div>
            </div>
            <p class="small">${escHTML(LearningMemoryEngine.summary(learning))}</p>
            <p class="small">Nächster sinnvoller Schritt: ${escHTML(simulation.next||focusTitle)}</p>
          </article>
        </div>
      </section>`;
    }  };

  const CoachAnalysisDomainEngine = (window.EGTCoachAnalysisDomainEngine && typeof window.EGTCoachAnalysisDomainEngine.create === "function") ? window.EGTCoachAnalysisDomainEngine.create({
    APP_VERSION: APP_VERSION,
    $: $,
    escHTML: escHTML,
    formatDate: formatDate,
    Guard: Guard,
    AnalyticsEngine: AnalyticsEngine,
    SessionTracker: SessionTracker,
    ErrorMemory: ErrorMemory,
    DataReadiness: DataReadiness,
    WeaknessProfile: WeaknessProfile,
    CognitiveProfile: CognitiveProfile,
    RecommendationEngine: RecommendationEngine,
    TrainingFocusEngine: TrainingFocusEngine,
    AdaptiveDifficultyEngine: AdaptiveDifficultyEngine,
    DynamicGeneratorEngine: DynamicGeneratorEngine,
    LearningMemoryEngine: LearningMemoryEngine,
    FullSimulationEngine: FullSimulationEngine,
    CoachEngine: CoachEngine,
    getResults: function(){ return getResults(); },
    showOnly: function(section){ return showOnly(section); },
    selectMode: function(mode){ return selectMode(mode); },
    renderRuntimeDashboard: function(){ return renderRuntimeDashboard(); },
    getModes: function(){ return MODES; },
    resultReviewEngine: function(){ return window.EGTResultReviewEngine; }
  }) : {
    __version: "G53.0-phase24-fallback",
    __provider: "app.js-fallback",
    diagnostics: function(){ return {ok:false, provider:"app.js-fallback", missing:["coach-analysis-domain-engine.js fehlt"]}; },
    buildCoach: function(results){ return CoachEngine.build(results || getResults()); },
    renderDashboard: function(coach){ return CoachEngine.renderDashboard(coach || CoachAnalysisDomainEngine.buildCoach(getResults())); },
    renderAnalysisHtml: function(){ return '<div class="box">Coach-/Analyse-Domain nicht geladen. Analyse-Fallback aktiv.</div>'; },
    showAnalysis: function(){ showOnly("analysis"); var el=$("analysisContent"); if(el) el.innerHTML=this.renderAnalysisHtml(getResults()); return true; },
    setTrainingFocus: function(focus){ TrainingFocusEngine.write(focus); var current=TrainingFocusEngine.current(); if(current.key !== "auto" && MODES[current.mode]) selectMode(current.mode); renderRuntimeDashboard(); TrainingFocusEngine.render(); return current; },
    currentFocus: function(){ return TrainingFocusEngine.current(); },
    buildAdaptiveQuestion: function(index,total,coach){ return DynamicGeneratorEngine.buildQuestion(index,total,coach || CoachAnalysisDomainEngine.buildCoach(getResults())); },
    explainMix: function(mix){ return DynamicGeneratorEngine.explainMix(mix); },
    learningSummary: function(learning){ return LearningMemoryEngine.summary(learning); },
    simulationLabel: function(simulation){ return FullSimulationEngine.label(simulation); },
    state: function(){ return {version:this.__version, provider:this.__provider}; },
    snapshot: function(){ return this.state(); }
  };
  try { window.CoachAnalysisDomainEngine = CoachAnalysisDomainEngine; } catch(e) {}


  const ReleaseQAEngine = (window.EGTReleaseQAEngine && typeof window.EGTReleaseQAEngine.create === "function") ? window.EGTReleaseQAEngine.create({
    APP_VERSION: APP_VERSION,
    $: $,
    getResults: function(){ return getResults(); }
  }) : {
    __version: "G53.1-phase25-fallback",
    __provider: "app.js-fallback",
    diagnostics: function(){ return { ok:false, provider:"app.js-fallback", missing:["release-qa-engine.js fehlt"] }; },
    runHealth: function(label){ return this.diagnostics(label); }
  };
  try { window.ReleaseQAEngine = ReleaseQAEngine; } catch(e) {}

/* Question Bank Schema, Quality Engine, Modusverträge, Blocklimits und Blockinfo. */
  const QUESTION_BANK_SCHEMA = {
    version:"internal",
    required:["id","source","category","group","question","answers","correct","explanation","tags"],
    groups:["Mathe","Logik","Konzentration","Visual IQ","Mechanik","Raumdenken","IT/FISI","Allgemeinwissen","Englisch","Gedächtnis","Kaufmännisch","Sozialpädagogik"],
    importStatuses:["raw","needsReview","verified","disabled"],
    note:"Die Aufgabenlogik ist auf unterschiedliche Trainingsbereiche vorbereitet."
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
        imageSrc:raw.imageSrc || raw.image || "",
        imageAlt:raw.imageAlt || raw.alt || "",
        tags:Array.isArray(raw.tags) ? raw.tags.map(function(t){
          var s = String(t).toLowerCase().trim();
          if (s.indexOf("verh") >= 0 || s.indexOf("ratio") >= 0) return "verhaeltnislogik";
          return s;
        }) : [],
        verified:!!raw.verified,
        status:raw.status || "needsReview",
        createdAt:raw.createdAt || new Date().toISOString(),
        tip:raw.tip || "",
        trick:raw.trick || "",
        stepByStep:raw.stepByStep || "",
        testedConcept:raw.testedConcept || "",
        similarQuestion:raw.similarQuestion || "",
        examTarget:raw.examTarget || raw.dna?.examTarget || raw.phase4?.examTarget || "both",
        dna: raw.dna || null,
        phase4: raw.phase4 || null,
        skill: raw.phase4?.skill || raw.dna?.skill || "",
        expectedTimeMs: raw.phase4?.expectedTimeMs || raw.dna?.expectedTimeMs || 0,
        difficultyLevel: raw.phase4?.difficultyLevel || raw.dna?.difficulty || 0,
        quality: raw.phase4?.quality || raw.status || "needsReview"
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
    filter({group,category,excludeCategory,difficulty,tag,verifiedOnly=false,examTarget}={}) {
      return QUESTION_BANK.items.filter(item=>{
        if(group && item.group!==group) return false;
        if(category && item.category!==category) return false;
        if(excludeCategory && item.category===excludeCategory) return false;
        if(difficulty && item.difficulty!==difficulty) return false;
        if(tag && !(item.tags||[]).includes(tag)) return false;
        if(verifiedOnly && !item.verified) return false;
        if(examTarget) {
          const itemTarget = item.examTarget || "both";
          if(itemTarget !== "both" && itemTarget !== examTarget) return false;
        }
        return true;
      });
    },
    stats() {
      const byGroup={};
      QUESTION_BANK.items.forEach(item=>{byGroup[item.group]=(byGroup[item.group]||0)+1;});
      const byDifficulty={}, byTarget={}, byQuality={};
      QUESTION_BANK.items.forEach(item=>{
        byDifficulty[item.difficulty || "unknown"]=(byDifficulty[item.difficulty || "unknown"]||0)+1;
        byTarget[item.examTarget || "both"]=(byTarget[item.examTarget || "both"]||0)+1;
        byQuality[item.quality || item.status || "unknown"]=(byQuality[item.quality || item.status || "unknown"]||0)+1;
      });
      return {total:QUESTION_BANK.items.length, byGroup, byDifficulty, byTarget, byQuality, schema:QUESTION_BANK_SCHEMA.version, ready:true};
    },
    importBatch(rawItems=[], source="ocr-import") {
      if(!FEATURE_FLAGS.questionBankRuntimeImport) {
        const validation = rawItems.map(x=>this.validate(this.normalize(x,source)));
        QUESTION_BANK.lastImport={source, imported:0, invalid:validation.filter(v=>!v.ok).length, reviewed:validation.length, blocked:true, reason:"Question Bank Runtime Import ist bis zur OCR-/Import-Freigabe deaktiviert.", createdAt:new Date().toISOString()};
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

  bootstrapExternalQuestionBank();

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
        const quality = window.EGTQuestionBankQuality && typeof window.EGTQuestionBankQuality.audit === "function" ? window.EGTQuestionBankQuality.audit() : null;
        return {ok:validation.ok && stats.ready && blocked.blocked===true && (!quality || quality.ready), schema:QUESTION_BANK_SCHEMA.version, total:stats.total, sampleGroup:sample.group, runtimeImport:"disabled", externalItems:stats.total, quality:quality};
      } catch(error) {
        return {ok:false,error:String(error && error.message ? error.message : error)};
      }
    },
    validatePWA() {
      try {
        const ok = !!PWA_CONFIG.appName && !!PWA_CONFIG.shortName && PWA_CONFIG.display === "standalone" && !!PWA_CONFIG.manifestFile && FEATURE_FLAGS.pwaManifestTemplate === true && FEATURE_FLAGS.pwaServiceWorkerRuntime === true;
        return {ok, manifest:PWA_CONFIG.manifestFile, serviceWorker:PWA_CONFIG.serviceWorkerFile, cacheRuntime:FEATURE_FLAGS.pwaCacheRuntimeDisabled, install:FEATURE_FLAGS.pwaInstall, status:PWA_CONFIG.status};
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
        const sample=[{mode:"math",title:"Mathe",score:18,total:20,percent:90,duration:"1 Min.",cats:{}},{mode:"ctcLohr",title:"Simulation",score:70,total:62,percent:75,duration:"10 Min.",cats:{}}];
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
        const validationResults=[
          {mode:"ctcLohr",title:"Simulation",total:62,score:60,percent:65,cats:{Mathe:{n:9,r:5,t:1000}},aiSession:{total:62,correct:60,groups:{Mathe:{total:9,correct:5,wrong:4,avgMs:10000,pressure:2,open:1}},errors:{pressureWrong:2}}},
          {mode:"ctcLohr",title:"Simulation",total:62,score:70,percent:75,cats:{"Visual IQ":{n:10,r:4,t:1000}},aiSession:{total:62,correct:70,groups:{"Visual IQ":{total:10,correct:4,wrong:6,avgMs:12000,pressure:3,open:0}},errors:{patternError:6}}},
          {mode:"ctcLohr",title:"Simulation",total:62,score:75,percent:81,cats:{Konzentration:{n:15,r:8,t:1000}},aiSession:{total:62,correct:75,groups:{Konzentration:{total:15,correct:8,wrong:7,avgMs:13000,pressure:4,open:2}},errors:{timeout:2,pressureWrong:4}}}
        ];
        const coach=CoachAnalysisDomainEngine.buildCoach(validationResults);
        const aiQuestion = DynamicGeneratorEngine.buildQuestion(5,100,coach);
        const oldFocus=TrainingFocusEngine.read();
        TrainingFocusEngine.write("math");
        const focusCoach=CoachAnalysisDomainEngine.buildCoach(validationResults);
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
    bps:{title:"BPS-Simulation",amount:100,memory:true,instant:false,desc:"BPS-Prüfungssimulation mit 50 Sekunden pro Aufgabe, ohne Hilfe während der Prüfung und Auswertung erst am Ende.",tags:["BPS","50 Sek./Aufgabe","keine Hilfe"]},
    ctc:{title:"5. Eignungstest Elite",amount:100,memory:true,instant:false,desc:"Harter Elite-Modus mit Zeitdruck, Gedächtnis, IT, Logik, Mathematik, Konzentration und angepasster Trainingssteuerung.",tags:["Elite","Zeitdruck","Leistungsprofil"]},
    general:{title:"6. Allgemeinwissen",amount:40,memory:false,instant:true,desc:"Politik, Geschichte, Geografie, Wissenschaft, Technik, Alltag, Wirtschaft und Satzergänzung.",tags:["Wissen","Welt","Deutschland"]},
    english:{title:"7. Englisch",amount:25,memory:false,instant:true,desc:"Vokabeln, Übersetzen, Grammatik, Lückensätze und Berufsenglisch.",tags:["Vokabeln","Grammatik","Schule"]},
    it:{title:"8. IT & FISI Grundlagen",amount:50,memory:false,instant:true,desc:"Netzwerk, Hardware, Betriebssysteme, Server, Security und FISI-Logik.",tags:["FISI","Netzwerk","Server"]},
    concentrationPro:{title:"9. Konzentration PRO 2.0",amount:45,memory:false,instant:true,desc:"Scanner, Blicksprung, Tabellenvergleich, Zeichenfehler, Zahlenscan und visuelle Genauigkeit unter Zeitdruck.",tags:["Scanner","Blicksprung","Zeitdruck"]},
    routeMemoryMode:{title:"10. Route Memory Spezial",amount:8,memory:false,instant:true,desc:"Busroute ansehen, Straßen merken und danach die Straßen in der richtigen Reihenfolge antippen.",tags:["Gedächtnisroute","Animation","Reihenfolge"]},
    duell:{title:"35. Duell-Modus ⚔️",amount:12,memory:false,instant:true,desc:"Zwei Spieler treten am selben Gerät mit identischen Aufgaben gegeneinander an. Gleiche Fragen, gleiche Reihenfolge, gleiche Zeit – wer holt mehr Punkte?",tags:["2 Spieler","identische Aufgaben","Hot-Seat"]},
    visualIQ:{title:"11. Visual IQ System",amount:36,memory:false,instant:true,desc:"Zahnräder, Spiegelungen, Würfelrotation, Faltfiguren, Matrizen, Stromlaufpläne, Mechanik und technisches Verständnis.",tags:["Visual IQ","SVG","Technik"]},
    mathSprint:{title:"12. Blocktraining · Mathe Sprint",amount:20,memory:false,instant:true,desc:"Kurze, schnelle Mathe-Einheit mit Kopfrechnen, Prozent, Dreisatz, Bruch und Textaufgaben.",tags:["Blocktraining","Mathe","Sprint"]},
    textMathSprint:{title:"24. Blocktraining · Textaufgaben",amount:12,memory:false,instant:true,desc:"Digitale Textaufgaben mit Dreisatz, Prozent, Durchschnitt, Geschwindigkeit, Arbeitszeit und Verhältnisrechnung.",tags:["Blocktraining","Textaufgaben","Mathe"]},
    logicSprint:{title:"13. Blocktraining · Logik Sprint",amount:20,memory:false,instant:true,desc:"Zahlenreihen, Matrizen, Aussagenlogik, Symbolfolgen und Wortlogik als kompakter Sprint.",tags:["Blocktraining","Logik","Muster"]},
    concentrationSprint:{title:"14. Blocktraining · Konzentration Sprint",amount:25,memory:false,instant:true,desc:"Scanner, Tabellenvergleich, Zeichenfehler, Zahlenscan und Blicksprung unter Zeitdruck.",tags:["Blocktraining","Konzentration","Tempo"]},
    visualIQSprint:{title:"15. Blocktraining · Visual IQ Sprint",amount:20,memory:false,instant:true,desc:"Gezielte Visual-IQ-Einheit mit Zahnrädern, Spiegelung, Würfel, Faltung, Strom und Mechanik.",tags:["Blocktraining","Visual IQ","Technik"]},
    itSprint:{title:"16. Blocktraining · IT/FISI Sprint",amount:20,memory:false,instant:true,desc:"Netzwerk, Hardware, Security, Server, Windows, Linux und FISI-Grundlagen kompakt.",tags:["Blocktraining","IT/FISI","Netzwerk"]},
    knowledgeSprint:{title:"17. Blocktraining · Allgemeinwissen Sprint",amount:35,memory:false,instant:true,desc:"Kurzer Wissensblock mit Politik, Geografie, Geschichte, Alltag, Technik, Wirtschaft und Satzergänzung.",tags:["Blocktraining","Wissen","Zeitdruck"]},
    matrixOnlySprint:{title:"18. Blocktraining · Nur Matrizen",amount:24,memory:false,instant:true,desc:"Gezielter Matrizenblock: Buch-Matrizen aus dem PDF plus generierte Matrixmuster. Ideal zum Musterverstehen vor dem Test.",tags:["Blocktraining","Matrizen","PDF"]},
    sentenceSprint:{title:"19. Blocktraining · Nur Satzergänzung",amount:30,memory:false,instant:true,desc:"Gezielter Sprachlogikblock mit Lückensätzen aus der Aufgabenbank. Hinweise und Erklärungen sind in der Übung ausdrücklich aktiv.",tags:["Blocktraining","Satzergänzung","Sprache"]},
    numberSeriesBookSprint:{title:"20. Blocktraining · Zahlenreihen Buch",amount:30,memory:false,instant:true,desc:"Digitale Zahlenreihen aus dem PDF mit Lösungen und Regel-Erklärungen. Ideal für Mathe-/Logik-Zeitdruck.",tags:["Blocktraining","Zahlenreihen","Buch"]},
    textComprehensionSprint:{title:"21. Blocktraining · Textverständnis",amount:15,memory:false,instant:true,desc:"Textpassagen mit stimmt/stimmt-nicht-Aussagen. Trainiert präzises Lesen unter Zeitdruck.",tags:["Blocktraining","Textverständnis","Sprache"]},
    visualLogicBookSprint:{title:"22. Blocktraining · Visuelle Buchlogik",amount:12,memory:false,instant:true,desc:"Gemeinsamkeiten finden und Zugehörigkeiten identifizieren als Bildaufgaben aus den PDFs.",tags:["Blocktraining","Visual","Buch"]},
    techniqueSprint:{title:"23. Blocktraining · Technik Sprint",amount:25,memory:false,instant:true,desc:"Technisches Verständnis, Mechanik, Hebel, Rollen, Stromlaufpläne, Zahnräder und räumliches Denken.",tags:["Blocktraining","Technik","Mechanik"]},
    algebraSprint:{title:"24. Blocktraining · Algebra",amount:10,memory:false,instant:true,desc:"Digitale Gleichungen und Formelumstellungen mit Schritt-Erklärungen.",tags:["Blocktraining","Algebra","Gleichungen"]},
    symbolLogicSprint:{title:"25. Blocktraining · Symbolarithmetik",amount:10,memory:false,instant:true,desc:"Symbol-für-Zahl-Aufgaben mit Ziffernlogik und Gleichungsdenken.",tags:["Blocktraining","Symbolarithmetik","Logik"]},
    statementLogicSprint:{title:"26. Blocktraining · Aussagenlogik",amount:10,memory:false,instant:true,desc:"Wahr/Falsch-Ketten, Lügnerlogik und Schlussfolgerungen.",tags:["Blocktraining","Aussagenlogik","Logik"]},
    ratioLogicSprint:{title:"27. Blocktraining · Verhältnislogik",amount:10,memory:false,instant:true,desc:"Verhältnisse aus Texten erkennen, Gleichungen bilden und Denkfallen vermeiden.",tags:["Blocktraining","Verhältnislogik","Logik"]},
    generalKnowledgeBookSprint:{title:"28. Blocktraining · Allgemeinwissen Buch",amount:25,memory:false,instant:true,desc:"Politik, Geschichte, Geografie, Wirtschaft, Wissenschaft, Kunst und Literatur aus den Buchseiten.",tags:["Blocktraining","Allgemeinwissen","Buch"]},
    errorTrainingPrep:{title:"29. Fehlertraining · Vorbereitung",amount:25,memory:false,instant:true,desc:"Gemischter Trainingsmodus als Vorbereitung für späteres echtes Schwächenlernen und Fehlertraining.",tags:["Fehlertraining","Vorbereitung","Training"]},
    kaufmRechnen:{title:"30. Blocktraining · Kaufm. Rechnen",amount:20,memory:false,instant:true,desc:"Kaufmännisches Rechnen, Prozent, Skonto, Rabatt und Dreisatz.",tags:["Blocktraining","Kaufmännisch","Mathe"]},
    bueroWissen:{title:"31. Blocktraining · Büro & Verwaltung",amount:20,memory:false,instant:true,desc:"Büroorganisation, Gesetze, DIN 5008, Archivierung und Abläufe.",tags:["Blocktraining","Kaufmännisch","Wissen"]},
    paedagogik:{title:"32. Blocktraining · Pädagogik",amount:10,memory:false,instant:true,desc:"Pädagogisches Fachwissen, Entwicklungstheorien, Bindungstheorie und SGB VIII.",tags:["Blocktraining","Soziales","Fachwissen"]},
    situationen:{title:"33. Blocktraining · Praxissituationen",amount:10,memory:false,instant:true,desc:"Situationsaufgaben, Konfliktlösung, Elternarbeit, Teamarbeit und Kinderschutz.",tags:["Blocktraining","Soziales","Praxis"]},
    ctcLohr:{title:"CTC-Lohr Simulation",amount:(window.EGTCTCLohrExamStructureEngine&&window.EGTCTCLohrExamStructureEngine.totalCount&&window.EGTCTCLohrExamStructureEngine.totalCount())||68,memory:false,instant:false,desc:"Realer CTC-Lohr Ablauf mit 7 Blöcken: 40 Allgemeinwissen in 7 Minuten, Mathe-Sprint, Regelrechnung, Zahlenreihen, Buchstaben-Zählen, Tabellenlesen und 13-Minuten-FlowLogic.",tags:["CTC-Lohr","ca. 37 Min.","keine Hilfe"]}
  };

  const MODE_CONTRACTS = {
    routeMemoryMode:{allowedTypes:["routeMemory"], allowedGroups:["Gedächtnis"]},
    visualIQ:{allowedTypes:["visualIQ"], allowedGroups:["Visual IQ","Mechanik"]},
    mathSprint:{requiredCount:20, allowedGroups:["Mathe"]},
    textMathSprint:{requiredCount:12, allowedGroups:["Mathe"], allowedTypes:["mc"]},
    logicSprint:{requiredCount:20, allowedGroups:["Logik"]},
    concentrationSprint:{requiredCount:25, allowedGroups:["Konzentration"]},
    visualIQSprint:{requiredCount:20, allowedTypes:["visualIQ","imageTask"], allowedGroups:["Visual IQ","Mechanik","Logik"]},
    itSprint:{requiredCount:20, allowedGroups:["IT/FISI"]},
    knowledgeSprint:{requiredCount:35, allowedGroups:["Allgemeinwissen"]},
    matrixOnlySprint:{requiredCount:24, allowedGroups:["Logik","Visual IQ"], allowedTypes:["mc","matrix","visualIQ","imageTask"]},
    sentenceSprint:{requiredCount:30, allowedGroups:["Allgemeinwissen"], allowedTypes:["mc"]},
    numberSeriesBookSprint:{requiredCount:30, allowedGroups:["Logik"]},
    textComprehensionSprint:{requiredCount:15, allowedGroups:["Allgemeinwissen"]},
    visualLogicBookSprint:{requiredCount:12, allowedTypes:["imageTask"], allowedGroups:["Logik","Visual IQ"]},
    techniqueSprint:{requiredCount:25, allowedGroups:["Visual IQ","Mechanik","Raumdenken"]},
    algebraSprint:{requiredCount:10, allowedGroups:["Mathe"]},
    symbolLogicSprint:{requiredCount:10, allowedGroups:["Logik"]},
    statementLogicSprint:{requiredCount:10, allowedGroups:["Logik"]},
    ratioLogicSprint:{requiredCount:10, allowedGroups:["Logik"]},
    generalKnowledgeBookSprint:{requiredCount:25, allowedGroups:["Allgemeinwissen"]},
    kaufmRechnen:{requiredCount:20, allowedGroups:["Mathe"], allowedTypes:["mc"]},
    bueroWissen:{requiredCount:20, allowedGroups:["Allgemeinwissen"], allowedTypes:["mc"]},
    paedagogik:{requiredCount:10, allowedGroups:["Allgemeinwissen"], allowedTypes:["mc"]},
    situationen:{requiredCount:10, allowedGroups:["Allgemeinwissen"], allowedTypes:["mc"]},
    errorTrainingPrep:{requiredCount:25},
    ctcLohr:{requiredCount:(window.EGTCTCLohrExamStructureEngine&&window.EGTCTCLohrExamStructureEngine.totalCount&&window.EGTCTCLohrExamStructureEngine.totalCount())||68},
    ctc:{adaptive:true}
  };

  const CTC_BLOCK_LIMITS = {
    "1. Allgemeinwissen": 7*60,
    "2. Mathematik Sprint": 22,
    "3. CTC-Regelrechnung": 40,
    "4. Buchstaben-Konzentration": 40,
    "5. Tabellen ablesen": 90,
    "6. CTC-Logik: Wenn-Dann-Ablauf": 13*60
  };

  const BLOCK_INFO = {
    "1. Allgemeinwissen": {title:"Block 1: Allgemeinwissen", text:"40 Fragen in 7 Minuten. Die Fragen sind nicht kindlich formuliert, sondern indirekt und leicht irritierend.", rules:["Ca. 10,5 Sekunden pro Frage","Antworten schnell auswählen","Formulierungen genau lesen: oft ist die Frage anders gestellt als erwartet","Beispiel: höchster Punkt ab Meeresspiegel = Mount Everest"]},
    "2. Mathematik Sprint": {title:"Block 2: Mathematik Sprint", text:"9 Aufgaben mit 22 Sekunden pro Aufgabe. Alles ist ohne Taschenrechner lösbar, aber Dezimalstellen, Einheiten und Textformulierung sollen verwirren.", rules:["Leichte Aufgaben zuerst sichern","Bei schweren Textaufgaben nicht festbeißen","Komma und Einheit bewusst prüfen","Keine Hilfe während der Simulation"]},
    "3. CTC-Regelrechnung": {title:"Block 3: CTC-Regelrechnung", text:"Rechne Aufgaben wie 23-17+2/66-29-7 im Kopf. Es gibt keinen Bruchstrich und kein Multiple Choice – du musst das Ergebnis eingeben.", rules:["Vor dem / = oberer Teil, nach dem / = unterer Teil","Wenn unten kleiner als oben: oben minus unten","Wenn unten größer oder gleich oben: oben plus unten","Ca. 40 Sekunden pro Aufgabe"]},
    "4. Buchstaben-Konzentration": {title:"Block 4: Buchstaben-Konzentration", text:"Finde und zähle den abweichenden Buchstaben in einer langen Zeichenreihe. Eingabe statt Multiple Choice.", rules:["Zielbuchstaben merken","nicht die ganze Reihe mehrfach neu starten","Anzahl eintippen","Schnell und präzise arbeiten"]},
    "5. Tabellen ablesen": {title:"Block 5: Tabellen ablesen", text:"Lies Koordinaten aus einer Zeilen-/Spaltentabelle ab. Existiert ein Buchstabe oder eine Zeile nicht, trägst du X ein.", rules:["Spalte und Zeile sauber kreuzen","Mehrere Eingaben pro Tabellenblock","Fehlende Koordinate = X","Genauigkeit zählt stärker als Raten"]},
    "6. CTC-Logik: Wenn-Dann-Ablauf": {title:"Block 6: CTC-Logik: Wenn-Dann-Ablauf", text:"Finde versteckte Fehler in einem Ablaufplan. Handlung = Quadrat/Rechteck, Frage = Raute, Ja/Nein = Pfeile.", rules:["Form, Inhalt und Pfeilrichtung prüfen","Ja/Nein-Wege wie if/else lesen","13 Minuten für diese Aufgabe","Keine Hilfe, Auswertung erst am Ende"]}
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
  // Garantiert 4 verschiedene, nicht-negative Antwortoptionen für Zählaufgaben.
  // Behebt den Duplikat-Bug bei count=0: [0,1,Math.max(0,-1),2] erzeugte zweimal "0".
  function distinctCountOpts(n) {
    const set = new Set([n]);
    const cands = [n+1, n-1, n+2, n+3, n-2, n+4, n+5];
    for (const c of cands) { if (c >= 0) set.add(c); if (set.size === 4) break; }
    return shuffle([...set]).map(String);
  }
  function groupFor(cat) {
    cat=String(cat||"");
    if(cat.includes("Englisch") || cat.includes("Berufsenglisch") || cat.includes("IT-Englisch")) return "Englisch";
    if(cat.includes("IT") || cat.includes("FISI") || cat.includes("Server") || cat.includes("Linux") || cat.includes("Windows") || cat.includes("Security") || cat.includes("Netzwerk") || cat.includes("Hardware") || cat.includes("Betriebssystem") || cat.includes("EDV")) return "IT/FISI";
    if(cat.includes("Gedächtnis") || cat.includes("Route")) return "Gedächtnis";
    if(["Allgemeinwissen","Politik","Geografie","Europa","Wissenschaft","Technik","Geschichte","Natur","Wirtschaft","Alltag","Deutschland","Satzergänzung","Bürowissen","Pädagogik","Situationen"].includes(cat) || cat.includes("Satzergänzung") || cat.includes("Bürowissen") || cat.includes("Pädagogik") || cat.includes("Situationen")) return "Allgemeinwissen";
    if(cat.includes("Visual IQ") || cat.includes("Spiegel") || cat.includes("Würfel") || cat.includes("Falt") || cat.includes("Stromlauf") || cat.includes("Technisches Verständnis")) return "Visual IQ";
    if(cat.includes("Mechanik")) return "Mechanik";
    if(cat.includes("Tabellen") || cat.includes("Aufmerksamkeit") || cat.includes("Konzentration") || cat.includes("Code")) return "Konzentration";
    if(cat.includes("Räum")) return "Raumdenken";
    if(cat.includes("Algebra") || cat.includes("Formelumstellung") || cat.includes("Mathe") || cat.includes("Rechnen") || cat.includes("Prozent") || cat.includes("Bruch") || cat.includes("Dreisatz") || cat.includes("Geometrie") || cat.includes("Textrechnen") || cat.includes("Grundrechnen") || cat.includes("Dezimal") || cat.includes("Division")) return "Mathe";
    return "Logik";
  }
  function stableSignature(q) {
    return [q.cat,q.q,q.type,JSON.stringify(q.grid||q.series||q.symbols||q.visual||q.tableRows||q.schemaRows||q.fraction||q.fractionRule||q.routeStreets||q.signatureSeed||{}),JSON.stringify(q.visualIQ||{})].join("|");
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
    ["IT Netzwerk","Was macht DNS?",["Namen in IP-Adressen übersetzen","RAM erweitern","Dateien drucken","Strom speichern"],0,"DNS löst Domainnamen zu IP-Adressen auf."],["IT Netzwerk","Was vergibt DHCP typischerweise?",["IP-Adressen","Bildschirmauflösung","Passwortlänge","CPU-Takt"],0,"DHCP vergibt automatisch Netzwerkkonfigurationen."],["IT Netzwerk","Welche IPv4-Adresse ist privat?",["192.168.4.2","8.4.2.8","1.1.1.1","217.160.0.1"],0,"192.168.x.x ist privat."],["IT Netzwerk","Was macht ein Switch im LAN?",["Geräte im lokalen Netz verbinden","IP-Adressen weltweit registrieren","Strom speichern","Bilder komprimieren"],0,"Ein Switch verbindet Geräte im lokalen Netzwerk."],["IT Netzwerk","Was macht ein Router?",["Netzwerke miteinander verbinden","Texte korrigieren","RAM austauschen","Dateien verschlüsseln"],0,"Router verbinden verschiedene Netzwerke."],["IT Netzwerk","Was ist eine Subnetzmaske?",["Grenze zwischen Netz- und Hostanteil","Passwortregel","Bildformat","Druckersprache"],0,"Die Subnetzmaske trennt Netzanteil und Hostanteil."],["IT Netzwerk","Welche Portnummer nutzt HTTP typischerweise?",["80","22","25","3389"],0,"HTTP nutzt typischerweise Port 80."],["IT Netzwerk","Welche Portnummer nutzt HTTPS typischerweise?",["443","21","53","110"],0,"HTTPS nutzt typischerweise Port 443."],["IT Netzwerk","Welche Portnummer nutzt DNS typischerweise?",["53","80","443","3389"],0,"DNS nutzt typischerweise Port 53."],["IT Netzwerk","Was prüft der Befehl ping?",["Erreichbarkeit über Netzwerk","Festplattenplatz","Benutzerrechte","Druckerfarbe"],0,"ping prüft Erreichbarkeit."],["IT Hardware","Welche Komponente führt Rechenoperationen aus?",["CPU","SSD","Netzteil","Gehäuse"],0,"Die CPU ist der Prozessor."],["IT Hardware","Was macht RAM?",["flüchtiger Arbeitsspeicher","dauerhafte Archivierung","Netzwerk-Routing","Stromwandlung"],0,"RAM ist flüchtiger Arbeitsspeicher."],["IT Hardware","Was speichert Daten dauerhaft?",["SSD/HDD","RAM","CPU-Cache nur","Netzwerkkabel"],0,"SSD/HDD speichern Daten dauerhaft."],["IT Betriebssystem","Was sind Benutzerrechte?",["Berechtigungen für Aktionen im System","Bildschirmauflösung","Kabelstandard","Prozessorfrequenz"],0,"Benutzerrechte steuern Berechtigungen."],["IT FISI","Was ist Active Directory?",["Verzeichnisdienst für Benutzer und Ressourcen","Grafikkartentreiber","Antivirusprogramm","Browser"],0,"AD verwaltet Benutzer, Gruppen und Ressourcen."],["IT FISI","Was sind GPOs?",["Gruppenrichtlinien","Grafikprozessoren","Datenbanktabellen","Routerports"],0,"GPOs sind Gruppenrichtlinien."],["IT FISI","Was ist ein Ticket-System?",["System zur Bearbeitung von Anfragen/Störungen","Netzwerkkabel","Festplattentyp","Bildschirmmodus"],0,"Tickets dokumentieren Supportfälle."],["IT FISI","Warum dokumentiert man Änderungen?",["Nachvollziehbarkeit","mehr Stromverbrauch","schnelleres WLAN automatisch","weniger Sicherheit"],0,"Dokumentation macht Änderungen nachvollziehbar."],["IT Security","Was ist Phishing?",["Betrugsversuch über gefälschte Nachrichten","Festplattenformatierung","Netzteiltest","Monitorfehler"],0,"Phishing versucht Zugangsdaten zu stehlen."],["IT Security","Was macht eine Firewall?",["Netzwerkverkehr nach Regeln filtern","Bilder sortieren","CPU kühlen","Dateinamen übersetzen"],0,"Eine Firewall filtert Netzwerkverkehr."],["IT Security","Was bedeutet MFA?",["Mehrfaktor-Authentifizierung","Monitor-Farb-Anzeige","Mnboard-Fehleranalyse","Manuelle Freigabe"],0,"MFA nutzt mehrere Faktoren."],["IT Security","Was ist Ransomware?",["Erpressersoftware","Backupsoftware","Netzteilfehler","Bildschirmtreiber"],0,"Ransomware ist Erpressersoftware."],["IT Server","Was bedeutet Backup?",["Datensicherung","Bildvergrößerung","Internetvertrag","Druckauftrag"],0,"Backup = Datensicherung."],["IT Server","Was ist Virtualisierung?",["mehrere virtuelle Systeme auf Hardware betreiben","Kabel doppelt verlegen","Tastatur sperren","Monitor teilen"],0,"Virtualisierung ermöglicht VMs."],["IT Linux","Welcher Befehl listet Dateien?",["ls","cd","ping","mkdir"],0,"ls listet Dateien/Ordner auf."],["IT Linux","Welcher Befehl wechselt den Ordner?",["cd","ls","ipconfig","mkdir"],0,"cd wechselt das Verzeichnis."],["IT Windows","Welcher Befehl zeigt Netzwerkkonfiguration in Windows?",["ipconfig","ls","chmod","grep"],0,"ipconfig zeigt IP-Konfigurationen."]
  ];

  const opinionFacts = [
    ["Alle Menschen mögen Bücher.","Meinung","'mögen' ist subjektiv."],["Deutschland hat 16 Bundesländer.","Tatsache","Das ist objektiv überprüfbar."],["Mathematik ist schwerer als Englisch.","Meinung","Das ist eine persönliche Bewertung."],["Ein Kilometer hat 1000 Meter.","Tatsache","Das ist eine feste Maßeinheit."],["Pizza schmeckt besser als Nudeln.","Meinung","Geschmack ist subjektiv."],["Die Erde dreht sich um die Sonne.","Tatsache","Das ist wissenschaftlich überprüfbar."],["Wasser gefriert ungefähr bei 0 °C.","Tatsache","Das ist naturwissenschaftlich überprüfbar."],["Linux ist besser als Windows.","Meinung","Das ist eine Bewertung."],["DNS übersetzt Namen in IP-Adressen.","Tatsache","Das ist eine technische Funktion."],["Alle Chefs sind streng.","Meinung","Das ist pauschal und subjektiv."]
  ];

  const symbolPatterns = [
    {seq:["○","△","○","△","○","?"],ans:"△",ex:"Kreis und Dreieck wechseln sich ab."},{seq:["▲","▶","▼","◀","▲","?"],ans:"▶",ex:"Die Spitze dreht sich im Uhrzeigersinn."},{seq:["■","□","■","□","■","?"],ans:"□",ex:"Gefüllt und leer wechseln sich ab."},{seq:["●","●","▲","●","●","▲","?"],ans:"●",ex:"Zwei Kreise, ein Dreieck."},{seq:["◇","◆","◇","◆","◇","?"],ans:"◆",ex:"Leer und gefüllt wechseln."},{seq:["|","||","|||","||||","|||||","?"],ans:"||||||",ex:"Es kommt ein Strich dazu."},{seq:["⬆","➡","⬇","⬅","⬆","?"],ans:"➡",ex:"Richtung dreht im Uhrzeigersinn."},{seq:["2","3","5","8","13","?"],ans:"21",ex:"Fibonacci-ähnlich: Summe der zwei vorherigen."},{seq:["S","M","L","S","M","?"],ans:"L",ex:"Größenfolge S-M-L wiederholt sich."},{seq:["+","-","+","-","+","?"],ans:"-",ex:"Plus und Minus wechseln."}
  ];

  const EDV_STORY = `Firma Nova richtet einen kleinen Schulungsraum ein. Es gibt einen Router, einen Switch, einen Server, zwei PCs, einen Drucker, ein Backup-Ziel und ein Ticketsystem. Der Plan soll zeigen, wie Netzwerk, Sicherheit, Benutzerrechte, Backup und Support zusammenhängen. In der dargestellten Seite sind genau 11 Fehler versteckt.`;
  const EDV_SCHEMA = [
    {id:"A1", text:"Router LAN: 192.168.4.2", ok:true},
    {id:"A2", text:"Switch verbindet PC-1, PC-2, Server und Drucker", ok:true},
    {id:"A3", text:"PC-1: 192.168.4.2 / Gateway 192.168.4.2", ok:true},
    {id:"A4", text:"PC-2: 192.168.4.2 / Gateway 192.168.4.2", ok:false, nd:"Logikfehler", ex:"PC-2 liegt nicht im gleichen Netz wie Gateway 192.168.4.2."},
    {id:"A5", text:"DNS-Server zeigt auf 192.168.4.2", ok:true},
    {id:"A6", text:"DHCP verteilt 192.168.4.2 bis 192.168.4.2", ok:true},
    {id:"A7", text:"Client bekommt 10.0.0.55 aus dem DHCP-Bereich", ok:false, nd:"Logikfehler", ex:"10.0.0.55 passt nicht zum DHCP-Bereich 192.168.4.2 bis 100."},
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
    usedQuestions:new Set(),duel:null, ctcBlockRemaining:{}, ctcCurrentBlock:null, shownBlockIntro:{}, pendingBlock:null, routeTimers:[], activeModeTab:"basic", activeSheetCategory:0, activeAppSection:"dashboard", exam:{enabled:false,hardcore:false,lockBack:false,started:false}
  };

  const AdminPortalDomainEngine = (window.EGTAdminPortalDomainEngine && typeof window.EGTAdminPortalDomainEngine.create === "function") ? window.EGTAdminPortalDomainEngine.create({
    APP_VERSION: APP_VERSION,
    state: state
  }) : (window.AdminPortalDomainEngine || {
    __version:"G52.8-phase22-fallback",
    diagnostics:function(){ return {ok:false, provider:"app.js-fallback", missing:["admin-portal-domain-engine.js fehlt"]}; },
    getPortal:function(){ return window.EGTAdminPortal || null; },
    open:function(){ try{ return !!(window.EGTAdminPortal && EGTAdminPortal.open && EGTAdminPortal.open()); }catch(e){ return false; } },
    state:function(){ try{ return window.EGTAdminPortal && EGTAdminPortal.state ? EGTAdminPortal.state() : {}; }catch(e){ return {}; } },
    currentRole:function(){ try{ return window.EGTAdminPortal && EGTAdminPortal.currentRole ? EGTAdminPortal.currentRole() : "gast"; }catch(e){ return "gast"; } },
    trackEvent:function(evt){ try{ return Promise.resolve(window.EGTAdminPortal && EGTAdminPortal.trackEvent ? EGTAdminPortal.trackEvent(evt) : null); }catch(e){ return Promise.reject(e); } },
    duellCreate:function(payload){ return Promise.resolve(window.EGTAdminPortal && EGTAdminPortal.duellCreate ? EGTAdminPortal.duellCreate(payload) : null); },
    duellJoin:function(code,payload){ return Promise.resolve(window.EGTAdminPortal && EGTAdminPortal.duellJoin ? EGTAdminPortal.duellJoin(code,payload) : null); },
    duellSubmit:function(code,role,result){ return Promise.resolve(window.EGTAdminPortal && EGTAdminPortal.duellSubmit ? EGTAdminPortal.duellSubmit(code,role,result) : null); },
    duellFetch:function(code){ return Promise.resolve(window.EGTAdminPortal && EGTAdminPortal.duellFetch ? EGTAdminPortal.duellFetch(code) : null); }
  });
  try { window.AdminPortalDomainEngine = AdminPortalDomainEngine; } catch(e) {}

  const ProfileAuthDomainEngine = (window.EGTProfileAuthDomainEngine && typeof window.EGTProfileAuthDomainEngine.create === "function") ? window.EGTProfileAuthDomainEngine.create({
    APP_VERSION: APP_VERSION,
    profileKey: PROFILE_KEY,
    profileLegacyKeys: PROFILE_LEGACY_KEYS,
    sessionKey: (window.AppConfig && AppConfig.sessionKey) || "egt_auth_profile_session_v1",
    $: $,
    escHTML: escHTML,
    adminPortal: AdminPortalDomainEngine,
    readLocalProfile: function(){ return readProfile(); },
    writeLocalProfile: function(profile){ return writeProfile(profile); }
  }) : (window.ProfileAuthDomainEngine || {
    __version:"G52.9-phase23-fallback",
    diagnostics:function(){ return {ok:false, provider:"app.js-fallback", missing:["profile-auth-domain-engine.js fehlt"]}; },
    currentSession:function(){ try{ return window.EGTAuthProfileShell && EGTAuthProfileShell.currentSession ? EGTAuthProfileShell.currentSession() : null; }catch(e){ return null; } },
    highscoreIdentity:function(){ try{ return window.EGTAuthProfileShell && EGTAuthProfileShell.highscoreIdentity ? EGTAuthProfileShell.highscoreIdentity() : {}; }catch(e){ return {}; } },
    activeLearnerId:function(){ try{ const snap=AdminPortalDomainEngine && AdminPortalDomainEngine.state ? AdminPortalDomainEngine.state() : {}; if(snap && snap.learner && (snap.learner.userId || snap.learner.code)) return String(snap.learner.userId || snap.learner.code); }catch(e){} try{ return localStorage.getItem("egt_active_learner") || "GUEST"; }catch(e){ return "GUEST"; } },
    activeLearnerNeedsPasswordChange:function(){ try{ const snap=AdminPortalDomainEngine && AdminPortalDomainEngine.state ? AdminPortalDomainEngine.state() : {}; return !!(snap && snap.profile && snap.profile.mustChangePassword); }catch(e){ return false; } },
    recordDemoSimulation:function(payload){ try{ return window.EGTAuthProfileShell && EGTAuthProfileShell.recordDemoSimulation ? EGTAuthProfileShell.recordDemoSimulation(payload||{}) : false; }catch(e){ return false; } },
    canStartMode:function(mode){ try{ return window.EGTAuthProfileShell && EGTAuthProfileShell.canStartMode ? EGTAuthProfileShell.canStartMode(mode) : true; }catch(e){ return true; } },
    handleAction:function(action, el){ try{ return window.EGTAuthProfileShell && EGTAuthProfileShell.handleAction ? EGTAuthProfileShell.handleAction(action, el) : false; }catch(e){ return false; } },
    guardAction:function(action, el){ try{ return window.EGTAuthProfileShell && EGTAuthProfileShell.guardAction ? EGTAuthProfileShell.guardAction(action, el) : true; }catch(e){ return true; } },
    state:function(){ return {version:"G52.9-phase23-fallback", session:this.currentSession(), identity:this.highscoreIdentity()}; },
    syncStatus:function(){ return {version:"G52.9-phase23-fallback"}; }
  });
  try { window.ProfileAuthDomainEngine = ProfileAuthDomainEngine; } catch(e) {}

  const DuellRuntimeEngine = (window.EGTDuellRuntimeEngine && typeof window.EGTDuellRuntimeEngine.create === "function") ? window.EGTDuellRuntimeEngine.create({
    APP_VERSION: APP_VERSION,
    state: state,
    $: $,
    escHTML: escHTML,
    HighscoreDuelUIEngine: HighscoreDuelUIEngine,
    getHistory: function(){ return duellHistory(); },
    saveHistory: function(entry){ return duellSaveHistory(entry); },
    getMyName: function(){ return duellMyName(); },
    getPortal: function(){ return AdminPortalDomainEngine; },
    clearRouteTimers: function(){ return clearRouteTimers(); },
    finalizeOpenAnswers: function(reason){ return finalizeOpenAnswers(reason); },
    showOnly: function(screen){ return showOnly(screen); },
    buildQuiz: function(){ return buildQuiz(); },
    startQuiz: function(){ return startQuiz(); },
    restart: function(){ return restart(); }
  }) : {
    __version:"G52.3-phase17-fallback",
    diagnostics:function(){ return {ok:false, provider:"app.js-fallback", missing:["duell-runtime-engine.js fehlt"]}; },
    clearPoll:function(){ if(state.duel && state.duel.pollTimer){ clearInterval(state.duel.pollTimer); state.duel.pollTimer=null; } },
    showResult:function(){ state.duel=null; return showResult(); },
    openSetup:function(){ alert("Duell-Runtime-Modul nicht geladen."); },
    closeSetup:function(){ const ov=$("duellSetupOverlay"); if(ov){ ov.classList.remove("open"); ov.innerHTML=""; } },
    setupTab:function(){}, setStatus:function(){}, createOnline:async function(){}, joinOnline:async function(){}, beginOnlineRun:function(){}, retrySubmit:function(){}, cancelSetup:function(){ state.duel=null; this.closeSetup(); }, startLocal:function(){}, startP2:function(){}, rematch:function(){}, exit:function(){ state.duel=null; restart(); }, historyList:function(){ return duellHistory(); }, playerStats:function(){ return {}; }, fmtTime:function(ms){ return String(ms||0); }, winnerOf:function(a,b){ return HighscoreDuelUIEngine.winnerOf(a,b); }, renderComparison:function(p1,p2,o){ return HighscoreDuelUIEngine.renderDuellComparison(p1,p2,o); }, buildFreshQuiz:function(){ state.selectedMode="duell"; state.usedQuestions=new Set(); return buildQuiz(); }
  };
  try { window.DuellRuntimeEngine = DuellRuntimeEngine; } catch(e) {}

  const HighscoreDuelSheetRouterEngine = (window.EGTHighscoreDuelSheetRouterEngine && typeof window.EGTHighscoreDuelSheetRouterEngine.create === "function") ? window.EGTHighscoreDuelSheetRouterEngine.create({
    APP_VERSION: APP_VERSION,
    state: state,
    CloudHighscoreEngine: CloudHighscoreEngine,
    HighscoreDuelUIEngine: HighscoreDuelUIEngine,
    DuellRuntimeEngine: DuellRuntimeEngine,
    renderModes: function(){ return renderModes(); },
    showFrameworkHealth: function(){ return showFrameworkHealth(); }
  }) : (window.HighscoreDuelSheetRouterEngine || {
    __version:"G52.4-phase18-fallback",
    diagnostics:function(){ return {ok:false, provider:"app.js-fallback", missing:["highscore-duel-sheet-router-engine.js fehlt"]}; },
    routeTopTab:function(){ return false; }, routeSection:function(){ return false; }, handleDataAction:function(){ return false; },
    openHighscoreSheet:function(){ try{ CloudHighscoreEngine.refreshDashboard("fallback-router"); }catch(e){} return true; },
    openDuelSheet:function(opts){ if(opts && opts.direct) return DuellRuntimeEngine.openSetup(); try{ if(window.EGTUILayer && EGTUILayer.openDuelSheet) return EGTUILayer.openDuelSheet(); }catch(e){} return DuellRuntimeEngine.openSetup(); }
  });
  try { window.HighscoreDuelSheetRouterEngine = HighscoreDuelSheetRouterEngine; } catch(e) {}

  const ResultFlowEngine = (window.EGTResultFlowEngine && typeof window.EGTResultFlowEngine.create === "function") ? window.EGTResultFlowEngine.create({
    APP_VERSION: APP_VERSION,
    state: state,
    modes: MODES,
    $: $,
    formatTime: formatTime,
    formatDuration: formatDuration,
    clearTimer: function(){ try{ clearInterval(state.timer); }catch(e){} },
    clearRouteTimers: function(){ return clearRouteTimers(); },
    finalizeOpenAnswers: function(reason){ return finalizeOpenAnswers(reason); },
    showOnly: function(screen){ return showOnly(screen); },
    showDuellResult: function(){ return showDuellResult(); },
    resultReviewEngine: window.EGTResultReviewEngine,
    resultPersistenceEngine: window.EGTResultPersistenceEngine,
    simulationEngine: window.EGTSimulation,
    resultReviewContext: function(extra){ return resultReviewContext(extra); },
    resultPersistenceContext: function(extra){ return resultPersistenceContext(extra); },
    renderCategoryStats: function(){ return renderCategoryStats(); },
    renderTips: function(percent){ return renderTips(percent); },
    renderReview: function(){ return renderReview(); },
    saveResult: function(percent, dur, avg){ return saveResult(percent, dur, avg); },
    prognosisCardHtml: function(){ return prognosisCardHtml(); }
  }) : {
    __version: "G52.5-phase19-fallback",
    diagnostics: function(){ return {ok:false, provider:"app.js-fallback", missing:["result-flow-engine.js fehlt"]}; },
    showResult: function(){ return showResultLegacy(); }
  };
  try { window.ResultFlowEngine = ResultFlowEngine; } catch(e) {}

  const QuestionFlowEngine = (window.EGTQuestionFlowEngine && typeof window.EGTQuestionFlowEngine.create === "function") ? window.EGTQuestionFlowEngine.create({
    APP_VERSION: APP_VERSION,
    state: state,
    $: $,
    clearRouteTimers: function(){ return clearRouteTimers(); },
    showQuestionInternal: function(spIntro){ return showQuestionInternal(!!spIntro); },
    tickTimerInternal: function(){ return tickTimerInternal(); },
    nextQuestionInternal: function(){ return nextQuestionInternal(); },
    prevQuestionInternal: function(){ return prevQuestionInternal(); },
    jumpToQuestionInternal: function(index){ return jumpToQuestionInternal(index); },
    skipQuestionInternal: function(){ return skipQuestionInternal(); },
    spQuestionInternal: function(){ return spQuestionInternal(); },
    manualNextQuestionInternal: function(){ return manualNextQuestionInternal(); },
    chooseAnswerInternal: function(index, button){ return chooseAnswerInternal(index, button); },
    recordAnswerInternal: function(given, correct, timeout){ return recordAnswerInternal(given, correct, timeout); },
    toggleMarkQuestionInternal: function(){ return toggleMarkQuestionInternal(); },
    updateQuestionNavInternal: function(){ return updateQuestionNavInternal(); },
    nextBlockIndexInternal: function(from){ return nextBlockIndexInternal(from); }
  }) : {
    __version:"G52.6-phase20-fallback",
    diagnostics:function(){ return {ok:false, provider:"app.js-fallback", missing:["question-flow-engine.js fehlt"]}; },
    snapshot:function(){ return {mode:state.selectedMode,current:state.current,total:Array.isArray(state.quiz)?state.quiz.length:0}; },
    stopQuestionFlow:function(){ try{ clearInterval(state.timer); clearRouteTimers(); }catch(e){} },
    showQuestion:function(spIntro){ return showQuestionInternal(!!spIntro); },
    tickTimer:function(){ return tickTimerInternal(); },
    pauseTimer:function(){ return pauseTimerInternal(); },
    resumeTimer:function(){ return resumeTimerInternal(); },
    nextQuestion:function(){ return nextQuestionInternal(); },
    prevQuestion:function(){ return prevQuestionInternal(); },
    jumpToQuestion:function(index){ return jumpToQuestionInternal(index); },
    skipQuestion:function(){ return skipQuestionInternal(); },
    spQuestion:function(){ return spQuestionInternal(); },
    manualNextQuestion:function(){ return manualNextQuestionInternal(); },
    chooseAnswer:function(index, button){ return chooseAnswerInternal(index, button); },
    recordAnswer:function(given, correct, timeout){ return recordAnswerInternal(given, correct, timeout); },
    toggleMarkQuestion:function(){ return toggleMarkQuestionInternal(); },
    updateQuestionNav:function(){ return updateQuestionNavInternal(); },
    nextBlockIndex:function(from){ return nextBlockIndexInternal(from); }
  };
  try { window.QuestionFlowEngine = QuestionFlowEngine; } catch(e) {}

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
    if(["mathSprint","textMathSprint","logicSprint","concentrationSprint","visualIQSprint","itSprint","knowledgeSprint","techniqueSprint","algebraSprint","symbolLogicSprint","statementLogicSprint","ratioLogicSprint","generalKnowledgeBookSprint","errorTrainingPrep"].includes(mode)) return phase<.25?"medium":"hard";
    return "medium";
  }

  const BOOK_MATRIX_TASKS = [
    {n:1,img:"assets/matrix/matrix_task_1.png",correct:"D",ex:"Fünf Elemente wiederholen sich in jeder Reihe und wandern pro Reihe eine Stelle nach rechts. Oben fehlt deshalb der Kreis mit Strich."},
    {n:2,img:"assets/matrix/matrix_task_2.png",correct:"A",ex:"1. Reihe: arabische Zahlen, 2. Reihe: Buchstaben, 3. Reihe: römische Zahlen. Die Einträge wechseln links/rechts im Kästchen. Gesucht ist IV."},
    {n:3,img:"assets/matrix/matrix_task_3.png",correct:"C",ex:"Das leere Dreieck wandert im Uhrzeigersinn weiter. Gleichzeitig wechseln Stern/Farbe nach festem Positionsmuster. Nur C erfüllt beide Bedingungen."},
    {n:4,img:"assets/matrix/matrix_task_4.png",correct:"E",ex:"Die mittlere Reihe zeigt die vollständigen Figuren. Erste und dritte Reihe zeigen passende Teilstücke. Gesucht ist das Teilstück, das die Figur logisch ergänzt: E."},
    {n:5,img:"assets/matrix/matrix_task_5.png",correct:"B",ex:"Das Fliesenmuster kann durch B oder D fast ergänzt werden. Entscheidend ist die Lage von Plus bzw. Kreuz unten; damit passt B."},
    {n:6,img:"assets/matrix/matrix_task_6.png",correct:"D",ex:"Hintergrund und Sternform müssen zum Schachbrett- und Symbolwechsel passen. Nach Ausschluss bleibt D."},
    {n:7,img:"assets/matrix/matrix_task_7.png",correct:"B",ex:"Die durchgezogene Linie wandert/rotiert zeilenweise. Zusätzlich muss die Anzahl und Richtung der Striche zum Nachbarsystem passen. B erfüllt die Kombination."},
    {n:8,img:"assets/matrix/matrix_task_8.png",correct:"E",ex:"Achte besonders auf den rechten Winkel. Bei jeder zweiten Figur erscheint ein rechter Winkel. Deshalb ist E richtig."}
  ];

  function matrixBookQuestion(level="medium", fixedItem=null) {
    const item = fixedItem || choice(BOOK_MATRIX_TASKS);
    const answers=["A","B","C","D","E","keine Lösung richtig"];
    return makeMC("Matrizenaufgaben", level==="hard"?90:120, `Welche Antwort ergänzt die Matrix richtig?`, answers, answers.indexOf(item.correct), item.ex, "imageTask", {
      group:"Logik",
      block:"3. Logik",
      imageSrc:item.img,
      imageAlt:`Matrizenaufgabe ${item.n}`,
      source:"Matrizenaufgaben PDF",
      sourcePage:item.n===1?1:item.n<=3?2:item.n<=5?3:item.n<=7?4:5,
      subtype:"matrix-book",
      signatureSeed:`matrix-book-${item.n}`
    });
  }

  function buildMatrixOnlyQuiz(amount=24) {
    const seen = new Set();
    const out = shuffle(BOOK_MATRIX_TASKS).map(item => {
      const q = matrixBookQuestion("medium", item);
      q.group = "Logik";
      q.signature = stableSignature(q);
      seen.add(q.signature);
      return q;
    });
    let consecutiveFailures = 0;
    while(out.length < amount) {
      const q = choice([Generators.matrix, Generators.visualMatrixIQ])("medium");
      q.group = groupFor(q.cat);
      const baseSig = stableSignature(q);
      if(!seen.has(baseSig)) {
        seen.add(baseSig);
        out.push(q);
        consecutiveFailures = 0;
      } else {
        consecutiveFailures++;
        if(consecutiveFailures > 100) {
          break;
        }
      }
    }
    if(out.length < amount && out.length > 0) {
      const uniqueGenerated = [...out];
      let dupIndex = 0;
      while(out.length < amount) {
        const original = uniqueGenerated[dupIndex % uniqueGenerated.length];
        const dup = { ...original };
        dup.signature = stableSignature(original) + "|matrix-dup|" + out.length + "|" + Math.random();
        out.push(dup);
        dupIndex++;
      }
    }
    return shuffle(out).slice(0, amount);
  }

  const Generators = {

    matrixBook(level) { return matrixBookQuestion(level); },

    sentenceCompletion(level) {
      const q = fromQuestionBank({group:"Allgemeinwissen", category:"Satzergänzung"}, null, level);
      if(q) return q;
      return makeMC("Satzergänzung",24,"Ich prüfe die Antwort, ___ ich sie auswähle.",["bevor","obwohl","damit","aber"],0,"Erst prüfen, dann auswählen. Deshalb passt 'bevor'.","mc",{subtype:"satzergänzung-fallback",tags:["satzergänzung","sprachlogik","allgemeinwissen"]});
    },

    knowledge(level) {
      const sentenceShare = level==="hard" ? .30 : level==="medium" ? .24 : .18;
      if(Math.random()<sentenceShare) {
        const q = fromQuestionBank({group:"Allgemeinwissen", category:"Satzergänzung"}, null, level);
        if(q) return q;
      }
      if(Math.random()<.30) {
        const c=choice(capitalPool), opts=shuffle([c[1],c[2],c[3],c[4]]);
        return makeMC("Geografie",20,`Was ist die Hauptstadt von ${c[0]}?`,opts,optIdx(opts,c[1]),`${c[1]} ist die Hauptstadt von ${c[0]}.`);
      }
      return fromPool(generalPool,level);
    },
    english(level) { return fromPool(englishPool,level); },

    it(level) {
      if(Math.random()<.55) return Generators.bookIT(level);
      if(Math.random()<.30) return Generators.itScenario(level);
      return fromPool(itPool,level);
    },
    itScenario() {
      return choice([
        ()=>makeMC("IT Fehleranalyse",35,"Ein PC hat IP 192.168.4.2, Gateway 192.168.4.2, DNS leer. Internet per IP geht, Webseiten-Namen gehen nicht. Was ist wahrscheinlich falsch?",["DNS fehlt","RAM defekt","Monitor defekt","Tastatur defekt"],0,"Wenn IP geht, aber Namen nicht, ist DNS wahrscheinlich das Problem."),
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
      // Distraktoren nach WERT deduplizieren: verhindert doppelte Buttons (z. B. sn/lcm === sn/sd
      // bei nicht kürzbaren Brüchen) und wertgleiche Optionen wie 1/2 neben 2/4.
      const seenVals=new Set([Math.round(sum/lcm*100000)]);
      const candPairs=[[Math.max(1,sn-1),sd],[sn+1,sd],[a+b,Math.max(den1,den2)],[a+b,den1+den2],[sn,sd+1],[Math.max(1,sum-1),lcm],[sum+1,lcm],[sn+2,sd]];
      const opts=[correct];
      for(const [n,d] of candPairs){
        if(n<=0||d<=0) continue;
        const v=Math.round(n/d*100000);
        if(seenVals.has(v)) continue;
        const html=fracHTML(n,d);
        if(opts.includes(html)) continue;
        seenVals.add(v); opts.push(html);
        if(opts.length===4) break;
      }
      let safety=0;
      while(opts.length<4 && safety<200){
        safety++;
        const n=rand(1,sd*3), d=sd;
        const v=Math.round(n/d*100000);
        if(!seenVals.has(v)){ seenVals.add(v); opts.push(fracHTML(n,d)); }
      }
      const sh=shuffle(opts);
      return makeMC("Bruchrechnen",34,`Berechne: ${fracHTML(a,den1)} + ${fracHTML(b,den2)}`,sh,sh.indexOf(correct),`Erweitern und kürzen: Ergebnis ist ${correct}.`,"fraction",{fraction:{a,b,den1,den2,sn,sd}});
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
      else if(nd===3){const m=choice([2,3]); const start=m===3?choice([2,3]):choice([2,3,4]); const len=m===3?4:6; for(let i=0;i<len;i++)seq.push(start*Math.pow(m,i)); n1=start*Math.pow(m,len); n2=start*Math.pow(m,len+1); ex=`Immer ×${m}.`;}
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
        ()=>{
          const names = shuffle(["Mara","Laura","Emma","Mia","Tim","Ali","Leo","Max","Ben","Jonas","Lukas","Anna","Sophie","Paul","Felix"]);
          const n1 = names[0], n2 = names[1], n3 = names[2];
          const opts = shuffle([n3, n2, n1, "Nicht bestimmbar"]);
          return makeMC("Aussagenlogik",32,`${n1} ist größer als ${n2}. ${n2} ist größer als ${n3}. Wer ist am kleinsten?`,opts,opts.indexOf(n3),`${n1} > ${n2} > ${n3}.`);
        },
        ()=>{
          const names = shuffle(["A","B","C","D","E","F","X","Y","Z"]);
          const n1 = names[0], n2 = names[1], n3 = names[2], n4 = names[3];
          const opts = shuffle([n4, n1, n2, n3]);
          return makeMC("Aussagenlogik",35,`${n1} arbeitet schneller als ${n2}. ${n3} arbeitet langsamer als ${n2}. ${n4} arbeitet schneller als ${n1}. Wer ist am schnellsten?`,opts,opts.indexOf(n4),`${n4} > ${n1} > ${n2} > ${n3}.`);
        },
        ()=>{
          const items = shuffle([["roten","rot"], ["grünen","grün"], ["blauen","blau"], ["gelben","gelb"], ["weißen","weiß"], ["schwarzen","schwarz"]]);
          const colorName = items[0][0], colorBase = items[0][1], otherColor = items[1][1];
          const opts = shuffle([`Es ist nicht ${colorBase}`, `Es ist ${colorBase}`, `Es ist ${otherColor}`, "Keine Aussage möglich"]);
          return makeMC("Aussagenlogik",30,`Alle ${colorName} Kabel sind markiert. Dieses Kabel ist nicht markiert. Was folgt?`,opts,opts.indexOf(`Es ist nicht ${colorBase}`),`Wenn alle ${colorBase}en Kabel markiert sind, kann ein nicht markiertes nicht ${colorBase} sein.`);
        },
        ()=>makeMC("Aussagenlogik",28,"Alle A sind B. Kein B ist C. Was folgt sicher?",["Kein A ist C","Alle C sind A","Einige A sind C","Nichts"],0,"Wenn A immer B ist und B nie C, dann kann A nicht C sein.")
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
      const len=level==="hard"?34:level==="medium"?24:16, chars=["q","p","b","d","g","9"], target=choice(chars); let s=""; for(let i=0;i<len;i++)s+=choice(chars); const count=[...s].filter(x=>x===target).length, opts=distinctCountOpts(count);
      return makeMC("Aufmerksamkeit",level==="hard"?16:20,`Wie oft kommt „${target}“ vor? ${s}`,opts,optIdx(opts,String(count)),`„${target}“ kommt ${count}-mal vor.`);
    },
    codeCompare(level) {
      const chars="ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; let base=""; for(let i=0;i<(level==="hard"?10:8);i++)base+=choice(chars.split(""));
      let changed=base.split(""),pos=rand(0,changed.length-1); changed[pos]=choice(chars.split("").filter(x=>x!==changed[pos])); changed=changed.join("");
      const same=Math.random()<.35, right=same?"gleich":"verschieden", opts=shuffle(["gleich","verschieden","nicht prüfbar","nur Zahlen anders"]);
      return makeMC("Aufmerksamkeit",level==="hard"?18:22,`Vergleiche die Codes: ${base} | ${same?base:changed}`,opts,optIdx(opts,right),same?"Die Codes sind identisch.":`An Position ${pos+1} unterscheiden sich die Codes.`);
    },
    tableCode() {
      const names=shuffle(["KAYA","MÜLLER","SCHMIDT","YILMAZ","WEBER","BOZKURT"]), colors=shuffle(["rot","blau","grün","gelb","weiß","schwarz"]), nums=shuffle(["12","27","34","46","58","73"]);
      const rows=names.slice(0,4).map((n,i)=>({name:n,color:colors[i],num:nums[i],code:n[0]+colors[i][0].toUpperCase()+nums[i]})), target=choice(rows), ask=choice(["name","color"]), correct=ask==="name"?target.code:target.name;
      const opts=ask==="name"?shuffle(rows.map(r=>r.code)):shuffle(rows.map(r=>r.name)), q=ask==="name"?`Welche Kennung gehört zu <b>${target.name}</b>?`:`Welche Person gehört zur Farbe <b>${target.color}</b>?`;
      return makeMC("Tabellenlogik",35,q,opts,optIdx(opts,correct),`In der Tabelle gehört ${target.name} / ${target.color} / ${target.num} zusammen.`,"tablecode",{tableRows:rows});
    },

    fractionRuleEignungstest(level) {
      // CTC-Regel: Zähler > Nenner → Zähler minus Nenner; Nenner > Zähler → Zähler plus Nenner
      const count = level==="hard" ? 10 : level==="easy" ? 6 : 8;
      const pairs = [];
      for(let i=0;i<count;i++){
        const a=rand(1,30); let b=rand(1,30);
        while(b===a) b=rand(1,30); // a===b ist in der CTC-Regel nicht definiert → vermeiden
        pairs.push({a,b,result: a>b ? a-b : a+b});
      }
      const qPair = pairs[pairs.length-1]; // letztes Paar ist die Frage
      const correct = String(qPair.result);
      // Distraktoren garantiert verschieden von der richtigen Antwort und untereinander
      const distractorPool = [qPair.a+qPair.b, Math.abs(qPair.a-qPair.b), qPair.a, qPair.b, qPair.result+2, Math.max(0,qPair.result-2), qPair.result+10, qPair.result+1, qPair.result+5];
      const optSet = new Set([correct]);
      for (const d of distractorPool) { if (d >= 0) optSet.add(String(d)); if (optSet.size === 4) break; }
      const opts = shuffle([...optSet]);
      const seedStr = pairs.map(p=>p.a+'/'+p.b).join('-');
      // Visualisierung: Bruchreihe mit gesuchtem Ergebnis anzeigen
      const visual = `<div class="visualBox"><div class="concentration-rule"><b>CTC-Regel:</b> Zähler &gt; Nenner → Zähler <b>minus</b> Nenner &nbsp;|&nbsp; Nenner &gt; Zähler → Zähler <b>plus</b> Nenner</div><div class="ctc-fraction-grid">${pairs.slice(0,-1).map(p=>`<div class="ctc-fraction solved"><span class="frac-top">${p.a}</span><span class="frac-sep"></span><span class="frac-bot">${p.b}</span><span class="frac-eq">= ${p.result}</span></div>`).join('')}<div class="ctc-fraction question"><span class="frac-top">${qPair.a}</span><span class="frac-sep"></span><span class="frac-bot">${qPair.b}</span><span class="frac-eq">= <b>?</b></span></div></div></div>`;
      const expl = qPair.a>qPair.b
        ? `${qPair.a} > ${qPair.b}: Zähler minus Nenner → ${qPair.a} − ${qPair.b} = ${qPair.result}`
        : `${qPair.b} > ${qPair.a}: Zähler plus Nenner → ${qPair.a} + ${qPair.b} = ${qPair.result}`;
      return makeMC("CTC-Regel Konzentration",35,`Wende die CTC-Regel an: Was ergibt <b>${qPair.a}/${qPair.b}</b>?`,opts,optIdx(opts,correct),expl,"focusgrid",{focusHTML:visual,signatureSeed:seedStr});
    },

    pqStrike(level) {
      const total=level==="hard"?192:160, items=[]; let target=0;
      for(let i=0;i<total;i++){ const ch=choice(["p","q","b"]), bars=choice([0,1,1,2,2,3]); if(ch==="p" && bars===2)target++; items.push({txt:ch+(bars===0?"":"'".repeat(bars))});}
      const opts=distinctCountOpts(target);
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
      const opts=distinctCountOpts(target);
      const html=`<div class="visualBox"><b>Scannerfeld</b><div class="focus-grid">${items.map(x=>`<span class="focus-token">${x}</span>`).join("")}</div></div>`;
      return makeMC("Konzentration Scanner",level==="hard"?32:40,`Zähle alle <b>${targetChar}</b> mit genau diesem Zeichen: <b>${targetMarks || "ohne Zeichen"}</b>`,opts,optIdx(opts,String(target)),`Gesucht waren nur ${targetChar}${targetMarks}. Anzahl: ${target}.`,"focusgrid",{focusHTML:html,signatureSeed:items.join("")+"|"+targetChar+"|"+targetMarks});
    },
    symbolSearch(level) {
      const symbols=["◆","◇","▲","△","●","○","■","□","⬟","★"];
      const total=level==="hard"?96:72;
      const target=choice(symbols);
      let arr=[],count=0;
      for(let i=0;i<total;i++){const s=choice(symbols); if(s===target)count++; arr.push(s);}
      const opts=distinctCountOpts(count);
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
      const opts=distinctCountOpts(count);
      const visual=`<div class="visualBox"><div class="concentration-rule"><b>Zahlenscan:</b> Zähle nur: ${ruleText}.</div><div class="focus-grid">${nums.map(n=>`<span class="focus-token">${n}</span>`).join("")}</div></div>`;
      return makeMC("Konzentration Zahlenscan",level==="hard"?30:38,`Wie viele Treffer erfüllen die Regel: <b>${ruleText}</b>?`,opts,optIdx(opts,String(count)),`Treffer nach Regel „${ruleText}“: ${count}.`,"focusgrid",{focusHTML:visual,signatureSeed:nums.join("-")+"|"+targetRule});
    },
    tableComparePro(level) {
      const rows = level==="hard" ? 9 : 7;
      const items = [];
      const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ".split("");
      const usedIds = new Set();
      for(let i=0;i<rows;i++) {
        // IDs müssen eindeutig sein: doppelte IDs erzeugten doppelte Antwortbuttons und eine mehrdeutige Aufgabe
        let id;
        do { id = choice(chars)+rand(100,999); } while(usedIds.has(id));
        usedIds.add(id);
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
      let q, correct, ex, opts;
      if(scenario==="lever"){
        q="Welche Seite des Hebels sinkt nach unten?";
        correct="rechts";
        ex="Drehmoment = Kraft × Abstand. Rechts wirkt das größere Drehmoment.";
        opts=shuffle([correct,"links","beide gleich","nicht bestimmbar"]);
      }
      else if(scenario==="pulley"){
        q="Welche Last ist leichter zu heben?";
        correct="System B";
        ex="Mehr tragende Seilabschnitte verringern die benötigte Zugkraft.";
        opts=shuffle([correct,"System A","beide gleich","nicht bestimmbar"]);
      }
      else if(scenario==="water"){
        q="Welcher Behälter füllt sich zuerst?";
        correct="Behälter 2";
        ex="Der offene, tiefere Kanal wird zuerst erreicht.";
        opts=shuffle([correct,"Behälter 1","beide gleich","nicht bestimmbar"]);
      }
      else {
        q="Welcher Körper rollt schneller nach unten?";
        correct="der glatte Zylinder";
        ex="Weniger Reibung und günstige Form bedeuten schnelleres Rollen.";
        opts=shuffle([correct,"der raue Zylinder","beide gleich","nicht bestimmbar"]);
      }
      return makeMC("Visual IQ Mechanik",40,q,opts,optIdx(opts,correct),ex,"visualIQ",{visualIQ:{nd:"mechanics",scenario}});
    },
    visualTechnical(level) {
      const scenario=choice(["pressure","support","block","drive","lever","gearRatio","incline","pulley"]);
      let q, correct, ex;
      if(scenario==="pressure"){
        q="An welchem Punkt ist der hydrostatische Druck am größten?";
        correct="Punkt C (am tiefsten Punkt)";
        ex="Der Flüssigkeitsdruck steigt proportional mit der Tiefe der Wassersäule.";
      }
      else if(scenario==="support"){
        q="Welche Konstruktion ist am stabilsten?";
        correct="Konstruktion A (Dreieck)";
        ex="Dreiecke sind in sich formstabil (Fachwerkprinzip), während Rechtecke sich unter Scherbelastung leicht verziehen.";
      }
      else if(scenario==="block"){
        q="Welches Bauteil blockiert die Bewegung im Führungskanal?";
        correct="Bauteil C";
        ex="Bauteil C ist quer über der Nut fixiert und sperrt so mechanisch den Weg für die Schieber.";
      }
      else if(scenario==="drive"){
        q="Welche Scheibe dreht sich am schnellsten?";
        correct="Scheibe C (klein)";
        ex="Da alle Scheiben über denselben Riemen laufen, haben sie dieselbe Umfangsgeschwindigkeit. Die kleinste Scheibe muss sich daher am häufigsten drehen.";
      }
      else if(scenario==="lever"){
        q="An welchem Punkt muss die Kraft ansetzen, damit zum Anheben der Last die geringste Kraft benötigt wird?";
        correct="Punkt C (am Ende des Arms)";
        ex="Nach dem Hebelgesetz (Kraft × Kraftarm = Last × Lastarm) is die benötigte Kraft umso geringer, je länger der Kraftarm (Abstand zum Drehpunkt) ist.";
      }
      else if(scenario==="gearRatio"){
        q="Ein großes Zahnrad A (24 Zähne) treibt ein kleines B (8 Zähne) an. Wie oft dreht sich das kleine Rad B pro Umdrehung des großen Rades?";
        correct="3 mal";
        ex="Das Übersetzungsverhältnis beträgt 24 : 8 = 3. Das kleine Rad dreht sich also dreimal pro Umdrehung des großen.";
      }
      else if(scenario==="incline"){
        q="Eine Kiste soll auf eine Rampe geschoben werden. Bei welcher Rampe ist die benötigte Kraft am geringsten?";
        correct="Rampe B (lang und flach)";
        ex="Eine flachere, längere Rampe verringert die Steigungskraft – die Arbeit bleibt gleich, aber die Kraft wird über einen längeren Weg verteilt.";
      }
      else {
        q="Welches Prinzip ermöglicht es, schwere Lasten mit wenig Kraft vertikal anzuheben?";
        correct="Flaschenzug";
        ex="Ein Flaschenzug verteilt die Last auf mehrere tragende Seilstücke, wodurch sich die benötigte Zugkraft entsprechend reduziert.";
      }
      const distractors={
        pressure:["Punkt A (an der Oberfläche)","Punkt B (in der Mitte)","an allen Punkten gleich"],
        support:["Konstruktion B (Rechteck)","beide gleich stabil","nicht bestimmbar"],
        block:["Bauteil A","Bauteil B","nicht bestimmbar"],
        drive:["Scheibe A (groß)","Scheibe B (mittel)","alle gleich schnell"],
        lever:["Punkt A (nahe Drehpunkt)","Punkt B (in der Mitte)","nicht bestimmbar"],
        gearRatio:["1 mal","2 mal","4 mal"],
        incline:["Rampe A (kurz und steil)","beide erfordern gleich viel Kraft","nicht bestimmbar"],
        pulley:["Schraube","Rampe","Zahnrad"]
      };
      const opts=shuffle([correct,...(distractors[scenario]||["Bauteil A","Bauteil B","nicht bestimmbar"])]);
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
      // EDV-Einzelfragen werden nicht mehr erzeugt.
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
        {edvCorrectIds:correctIds, edvMultiSelected:[], edvRequiredCount:correctIds.length, block:"5. EDV Kenntnisse", signatureSeed:"edv-multi-v8012-cloud-highscore"}
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
        {block:"5. EDV Kenntnisse", signatureSeed:"edv-covered-v8012-"+slot}
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
          return `<button type="button" class="edv-node${cls}" id="edvNode_${x.id}" data-edv-id="${x.id}">
            <span class="edv-node-id">${x.id}</span>${n>=0 ? `<span class="edv-node-order">${n+1}</span>` : ""}
            <div class="edv-node-text">${x.text}</div>
          </button>`;
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

  //  Aufgabenbank-Generatoren: bereinigte digitale Aufgaben + PDF-Bildaufgaben.
  Generators.bookNumberSeries = function(level){
    return fromQuestionBank({tag:"zahlenreihen-buch", verifiedOnly:true}, Generators.series(level), level);
  };
  Generators.bookTextComprehension = function(level){
    return fromQuestionBank({tag:"textverstaendnis-buch", verifiedOnly:true}, Generators.opinionFact(), level);
  };
  Generators.bookTextMath = function(level){
    return fromQuestionBank({tag:"textaufgaben", verifiedOnly:true}, Generators.dreisatz(level), level);
  };
  Generators.bpsMathTrainer = function(level){
    return fromQuestionBank({category:"Mathematik", verifiedOnly:true}, Generators.math(level), level);
  };
  Generators.bookAlgebra = function(level){
    return fromQuestionBank({tag:"algebra", verifiedOnly:true}, Generators.arithmetic(level), level);
  };
  Generators.bookGeneralKnowledge = function(level){
    return fromQuestionBank({tag:"allgemeinwissen-buch", verifiedOnly:true}, Generators.knowledge(level), level);
  };
  Generators.bookIT = function(level){
    return fromQuestionBank({group:"IT/FISI", verifiedOnly:true}, Generators.itScenario(level), level);
  };
  Generators.bookKaufmRechnen = function(level){
    return fromQuestionBank({category:"Kaufm. Rechnen", verifiedOnly:true}, Generators.math(level), level);
  };
  Generators.bookBueroWissen = function(level){
    return fromQuestionBank({category:"Bürowissen", verifiedOnly:true}, Generators.knowledge(level), level);
  };
  Generators.bookPaedagogik = function(level){
    return fromQuestionBank({category:"Pädagogik", verifiedOnly:true}, Generators.knowledge(level), level);
  };
  Generators.bookSituationen = function(level){
    return fromQuestionBank({category:"Situationen", verifiedOnly:true}, Generators.knowledge(level), level);
  };
  Generators.bookSymbolArithmetic = function(level){
    // : schwache selbst erzeugte Symbolarithmetik-Aufgaben wurden aus der Bank entfernt.
    // Fallback bewusst auf Aussagenlogik statt neue Symbolbilder/-pseudoaufgaben.
    return fromQuestionBank({tag:"symbolarithmetik", verifiedOnly:true}, Generators.statementLogic(level), level);
  };
  Generators.bookStatementLogic = function(level){
    return fromQuestionBank({tag:"aussagenlogik", verifiedOnly:true}, Generators.statementLogic(level), level);
  };
  Generators.bookRatioLogic = function(level){
    return fromQuestionBank({tag:"verhaeltnislogik", verifiedOnly:true}, Generators.dreisatz(level), level);
  };
  Generators.bookGemeinsamkeiten = function(level){
    return fromQuestionBank({tag:"gemeinsamkeiten-buch", verifiedOnly:true}, Generators.visualIQ(level), level);
  };
  Generators.bookZugehoerigkeitI = function(level){
    return fromQuestionBank({tag:"zugehoerigkeiten-i-buch", verifiedOnly:true}, Generators.visualIQ(level), level);
  };
  Generators.bookZugehoerigkeitII = function(level){
    return fromQuestionBank({tag:"zugehoerigkeiten-ii-buch", verifiedOnly:true}, Generators.visualIQ(level), level);
  };
  Generators.bookVisualLogic = function(level){
    return choice([Generators.bookGemeinsamkeiten, Generators.bookZugehoerigkeitI, Generators.bookZugehoerigkeitII])(level);
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

    function generatorByCat(cat) {
    const map = {
      "Mathe":Generators.math,"Logik":Generators.logic,"Allgemeinwissen":Generators.knowledge,"Englisch":Generators.english,"IT/FISI":Generators.it,
      "Konzentration":()=>choice([Generators.attention,Generators.codeCompare,Generators.focusScanner,Generators.symbolSearch,Generators.tableScan,Generators.visualJump,Generators.errorSearch,Generators.numberScan,Generators.tableComparePro])("medium"),"Mechanik":()=>choice([Generators.gear,Generators.belt])("medium"),
      "Raumdenken":()=>choice([Generators.spatial,Generators.net])("medium"),"Visual IQ":()=>Generators.visualIQ("medium"),"Gedächtnis":()=>{ if(Math.random()<.45)return Generators.routeMemory("medium"); if(!state.adaptiveMemoryPool.length)state.adaptiveMemoryPool=generateMemoryQuestions(); const q=state.adaptiveMemoryPool.shift()||Generators.knowledge("medium"); q.group="Gedächtnis"; return q;}
    };
    return map[cat] || Generators.math;
  }
  function buildAdaptiveQuestion(i,total) {
    const coach=CoachAnalysisDomainEngine.buildCoach(getResults());
    const q=DynamicGeneratorEngine.buildQuestion(i,total,coach);
    if (!q.id) { q.id = "dyn_" + Math.random().toString(36).substr(2, 8); }
    return q;
  }

  const QuizBuildPipelineEngine = (window.EGTQuizBuildPipelineEngine && typeof window.EGTQuizBuildPipelineEngine.create === "function") ? window.EGTQuizBuildPipelineEngine.create({
    APP_VERSION: APP_VERSION,
    state: state,
    MODES: MODES,
    Generators: Generators,
    choice: choice,
    shuffle: shuffle,
    levelFor: levelFor,
    groupFor: groupFor,
    signature: stableSignature,
    repairQuestion: Guard.repairQuestion.bind(Guard),
    fromQuestionBank: function(filter, fallback, level, mode){ return fromQuestionBank(filter, fallback, level, mode); },
    buildAdaptiveQuestion: function(index, total){ return buildAdaptiveQuestion(index, total); },
    buildMatrixOnlyQuiz: function(amount){ return buildMatrixOnlyQuiz(amount); },
    buildMemoryQuestions: function(){
      return generateMemoryQuestions().map(function(q){
        q.group = "Gedächtnis";
        q.signature = stableSignature(q);
        return q;
      });
    },
    setupMode: function(mode){ if(mode === "ctc") state.adaptiveMemoryPool = generateMemoryQuestions(); },
    buildCoach: function(){ return CoachAnalysisDomainEngine.buildCoach(getResults()); },
    validateQuestion: function(q){
      return (window.EGTQuestionBankQuality && typeof window.EGTQuestionBankQuality.validateGeneratedQuestion === "function")
        ? window.EGTQuestionBankQuality.validateGeneratedQuestion(q)
        : true;
    },
    adaptiveDifficultyEngine: AdaptiveDifficultyEngine,
    getAppModuleHost: function(){ return window.AppModuleHost; },
    getBranchPoolResolver: function(){ return window.EGTBranchQuestionPools; },
    getGeneratorRegistry: function(){ return window.EGTGeneratorRegistry; },
    getQuestionFactory: function(){ return window.EGTQuestionFactory; },
    getQuizOrchestrator: function(){ return window.EGTQuizOrchestrator; }
  }) : {
    __version:"G52.7-phase21-fallback",
    diagnostics:function(){ return {ok:false, provider:"app.js-fallback", missing:["quiz-build-pipeline-engine.js fehlt"]}; },
    snapshot:function(){ return {mode:state.selectedMode, quizLength:Array.isArray(state.quiz)?state.quiz.length:0}; },
    activeBranchIdForQuiz:function(){ try { return String(localStorage.getItem("bps_branch") || "wissen"); } catch(e) { return "wissen"; } },
    activeQuestionPoolProfile:function(mode){ return {branch:this.activeBranchIdForQuiz(), mode:mode || state.selectedMode, poolKey:"legacy"}; },
    fallbackGeneratorPool:function(){ return []; },
    resolveBranchGeneratorPool:function(){ return []; },
    attachBranchPoolMeta:function(q){ return q; },
    generateQuestionForMode:function(mode,index,total,coach){ return generateQuestionForModeInternal(mode,index,total,coach); },
    buildQuiz:function(){ return buildQuizInternal(); }
  };
  try { window.QuizBuildPipelineEngine = QuizBuildPipelineEngine; } catch(e) {}

  function activeBranchIdForQuiz() {
    return QuizBuildPipelineEngine.activeBranchIdForQuiz();
  }

  function activeQuestionPoolProfile(mode) {
    return QuizBuildPipelineEngine.activeQuestionPoolProfile(mode);
  }

  function fallbackGeneratorPool(mode) {
    return QuizBuildPipelineEngine.fallbackGeneratorPool(mode);
  }

  function resolveBranchGeneratorPool(mode) {
    return QuizBuildPipelineEngine.resolveBranchGeneratorPool(mode);
  }

  function attachBranchPoolMeta(q, mode) {
    return QuizBuildPipelineEngine.attachBranchPoolMeta(q, mode);
  }

  function generateQuestionForMode(mode,index,total,coach) {
    return QuizBuildPipelineEngine.generateQuestionForMode(mode,index,total,coach);
  }

  function generateQuestionForModeInternal(mode,index,total,coach) {
    const baseLevel=levelFor(mode,index,total);
    if(mode==="duell") {
      // Duell-Mix: prüfungsnaher Querschnitt. Nur JSON-serialisierbare Aufgabentypen,
      // damit der Fragensatz für Spieler 2 identisch geklont werden kann.
      let q;
      if(index<4){
        q = index<3
          ? fromQuestionBank({group:"Allgemeinwissen", excludeCategory:"Satzergänzung"}, () => Generators.knowledge("medium"), "medium")
          : fromQuestionBank({group:"Allgemeinwissen", category:"Satzergänzung"}, () => Generators.sentenceCompletion("medium"), "medium");
        q.block="Wissen";
      } else if(index<7){
        q = fromQuestionBank({group:"Mathe"}, () => Generators.arithmetic("medium"), "medium");
        q.block="Mathe";
      } else if(index<10){
        q = fromQuestionBank({group:"Logik"}, () => choice([Generators.series,Generators.statementLogic,Generators.symbolSeries])("medium"), "medium");
        q.block="Logik";
      } else {
        q = choice([Generators.fractionRuleEignungstest,Generators.focusScanner,Generators.attention,Generators.tableCode])("medium");
        q.block="Konzentration";
      }
      q.time = 25; // einheitliches Zeitbudget für faire Vergleichbarkeit
      return q;
    }
    if(mode==="ctcLohr") {
      let q;
      if(index<40){
        // Block 1: 28 kurze Wissensfragen + 12 Satzergänzung (quotiert, statt ~50% Satzergänzung durch Pool-Übergewicht)
        if(index<28){
          q = fromQuestionBank({group:"Allgemeinwissen", excludeCategory:"Satzergänzung"}, () => Generators.knowledge("medium"), "medium");
        } else {
          q = fromQuestionBank({group:"Allgemeinwissen", category:"Satzergänzung"}, () => Generators.sentenceCompletion("medium"), "medium");
        }
        q.block="1. Allgemeinwissen";
      }
      else if(index<49){
        q = fromQuestionBank({group:"Mathe"}, () => choice([Generators.ctcMathSprint,Generators.bookTextMath])(index<44?"easy":"medium"), index<44?"easy":"medium");
        q.block="2. Mathe";
      }
      else if(index<67){
        // Block 3: 3 Matrizen (Bild) + 2 Meinung/Tatsache fest, Rest Logik aus der Bank (wie im echten Test)
        if(index<52){
          q = Generators.matrixBook("medium");
        } else if(index<54){
          q = Generators.opinionFact("medium");
        } else {
          q = fromQuestionBank({group:"Logik"}, () => choice([Generators.matrixBook,Generators.bookNumberSeries,Generators.bookVisualLogic,Generators.series,Generators.matrix,Generators.opinionFact,Generators.statementLogic,Generators.symbolSeries])("medium"), "medium");
        }
        q.block="3. Logik";
      }
      else if(index<82){ q=choice([Generators.pqStrike,Generators.focusScanner,Generators.symbolSearch,Generators.tableScan,Generators.visualJump,Generators.errorSearch,Generators.numberScan,Generators.tableComparePro,Generators.attention,Generators.codeCompare,Generators.fractionRuleEignungstest,Generators.tableCode])("medium"); q.block="4. Konzentration"; }
      else { q=(index===82?Generators.bigEDVMulti():Generators.bigEDVCovered(index-82)); q.block="5. EDV Kenntnisse"; }
      q.group=groupFor(q.cat);
      if(coach && coach.adaptive && coach.adaptive.active) {
        q.time=AdaptiveDifficultyEngine.timeFor(q, coach);
      }
      q.signature=stableSignature(q)+"|ctc|"+(q.signatureSeed||index); 
      if (!q.id) { q.id = "dyn_" + Math.random().toString(36).substr(2, 8); }
      return attachBranchPoolMeta(q, mode);
    }
    if(mode==="ctc") return attachBranchPoolMeta(buildAdaptiveQuestion(index,total), mode);
    const branchPool = resolveBranchGeneratorPool(mode);
    const gen=choice(branchPool);
    let q=gen(baseLevel);
    q.group=groupFor(q.cat);
    if(coach && coach.adaptive && coach.adaptive.active) {
      const adaptedLevel=AdaptiveDifficultyEngine.levelForGroup(q.group, baseLevel, coach);
      if(adaptedLevel!==baseLevel) {
        q=gen(adaptedLevel);
        q.group=groupFor(q.cat);
      }
      q.time=AdaptiveDifficultyEngine.timeFor(q, coach);
    }
    q.signature=stableSignature(q); 
    if (!q.id) {
      const cleanCat = String(q.cat || "unknown").toLowerCase().replace(/[^a-z0-9]/g, "");
      const textToHash = (q.q || "") + "|" + (q.cat || "");
      let hash = 0;
      for (let i = 0; i < textToHash.length; i++) {
        hash = (hash << 5) - hash + textToHash.charCodeAt(i);
        hash |= 0;
      }
      q.id = "dyn_" + cleanCat + "_" + Math.abs(hash).toString(36);
    }
    return attachBranchPoolMeta(q, mode);
  }
  function buildQuiz() {
    return QuizBuildPipelineEngine.buildQuiz(state.selectedMode);
  }

  function buildQuizInternal() {
    state.usedQuestions.clear();
    const mode=state.selectedMode, m=MODES[mode], seen=new Set(), out=[];
    
    if(mode==="matrixOnlySprint") return buildMatrixOnlyQuiz(m.amount).map(Guard.repairQuestion.bind(Guard));

    const coach = CoachAnalysisDomainEngine.buildCoach(getResults());

    if(mode==="ctc") {
      state.adaptiveMemoryPool=generateMemoryQuestions();
    }

    const memoryQs = (mode !== "ctc" && m.memory) ? generateMemoryQuestions().map(q=>{q.group="Gedächtnis"; q.signature=stableSignature(q); return q;}) : [];
    const targetCoreAmount = Math.max(0, m.amount - memoryQs.length);

    let consecutiveFailures = 0;
    while(out.length < targetCoreAmount) {
      // Master-DNA: generierte Aufgabe validieren, bei Ablehnung bis zu 3x neu generieren
      let q, dnaValid = false, dnaAttempts = 0;
      while(!dnaValid && dnaAttempts < 3) {
        dnaAttempts++;
        q = (mode === "ctc")
          ? buildAdaptiveQuestion(out.length, m.amount)
          : generateQuestionForMode(mode, out.length, m.amount, coach);
        dnaValid = (window.EGTQuestionBankQuality && typeof window.EGTQuestionBankQuality.validateGeneratedQuestion === "function")
          ? window.EGTQuestionBankQuality.validateGeneratedQuestion(q)
          : true;
      }
      
      const baseSig = stableSignature(q);
      if(!seen.has(baseSig)) {
        seen.add(baseSig);
        out.push(q);
        consecutiveFailures = 0;
      } else {
        consecutiveFailures++;
        if(consecutiveFailures > 150) {
          break;
        }
      }
    }

    if(out.length < targetCoreAmount) {
      if(out.length > 0) {
        const uniqueGenerated = [...out];
        let dupIndex = 0;
        while(out.length < targetCoreAmount) {
          const original = uniqueGenerated[dupIndex % uniqueGenerated.length];
          const dup = { ...original };
          dup.signature = stableSignature(original) + "|dup|" + out.length + "|" + Math.random();
          out.push(dup);
          dupIndex++;
        }
      } else {
        while(out.length < targetCoreAmount) {
          const q = (mode === "ctc")
            ? buildAdaptiveQuestion(out.length, m.amount)
            : generateQuestionForMode(mode, out.length, m.amount, coach);
          q.signature = stableSignature(q) + "|fallback|" + out.length + "|" + Math.random();
          out.push(q);
        }
      }
    }

    memoryQs.forEach(q=>{
      const baseSig = stableSignature(q);
      if(!seen.has(baseSig)){out.push(q); seen.add(baseSig);}
    });

    const finalQuiz = (mode==="ctcLohr" || mode==="ctc") ? out : shuffle(out);
    return finalQuiz.slice(0,m.amount);
  }

  function clearRouteTimers(){
    (state.routeTimers||[]).forEach(t=>{ if(t.kind==="interval") clearInterval(t.id); else clearTimeout(t.id); });
    state.routeTimers=[];
  }

  // G51.1: Autoritativer Screen-Isolator.
  // Grund: Nur classList.add("hidden") war auf echten Geräten nicht hart genug.
  // Ergebnis/Auswertung -> Startseite konnte oben Home zeigen, während der alte
  // Simulationsscreen im Dokumentfluss/Scrollbereich noch sichtbar/erreichbar blieb.
  const CORE_SCREEN_IDS=["start","memory","blockIntro","quiz","result","analysis"];

  function hardHideScreen(el){
    if(!el) return;
    el.classList.add("hidden");
    el.setAttribute("hidden", "");
    el.setAttribute("aria-hidden", "true");
    el.style.setProperty("display", "none", "important");
    el.style.setProperty("max-height", "0", "important");
    el.style.setProperty("overflow", "hidden", "important");
    el.style.setProperty("pointer-events", "none", "important");
  }

  function hardShowScreen(el){
    if(!el) return;
    el.classList.remove("hidden");
    el.removeAttribute("hidden");
    el.setAttribute("aria-hidden", "false");
    el.style.removeProperty("display");
    el.style.removeProperty("max-height");
    el.style.removeProperty("overflow");
    el.style.removeProperty("pointer-events");
  }

  function hideAll(){ CORE_SCREEN_IDS.forEach(id=>hardHideScreen($(id))); }

  function showOnly(id){
    hideAll();
    hardShowScreen($(id));
  }

  // G51.0: Zentraler Screen-Lifecycle-Cleanup.
  // Problem aus iPad/Desktop-Test: Nach Ergebnis -> Startseite blieb der alte Simulations-/Result-Kontext
  // im Dokumentfluss/Scrollzustand hängen. Home muss deshalb wie ein harter, sauberer Screenwechsel arbeiten.
  function isScreenVisible(id){
    const el=$(id);
    return !!(el && !el.classList.contains("hidden"));
  }

  function closeRuntimeOverlaysForHome(){
    try{ closeTrainingSheet(); }catch(e){}
    try{ if(window.EGTUILayer && typeof EGTUILayer.closeSheet === "function") EGTUILayer.closeSheet(); }catch(e){}
    try{ const gd=$("globalDiagnosticsPanel"); if(gd) gd.classList.remove("show"); }catch(e){}
    try{ const fb=$("feedbackSheet"); if(fb) fb.classList.remove("show","is-visible"); }catch(e){}
    try{
      document.documentElement.classList.remove("egt-layer-open","ui-overlay-open");
      document.body.classList.remove(
        "egt-layer-open","egt-ui-layer-active","ui-overlay-open",
        "training-sheet-open","bps-sheet-open","training-sheet-compact","training-sheet-desktop",
        "qnav-drawer-open","egt-simulation-active","quiz-screen-active"
      );
      delete document.body.dataset.egtSimulation;
      delete document.body.dataset.egtSimulationMode;
    }catch(e){}
  }

  function stopActiveModuleForHome(reason){
    try{
      if(window.AppModuleHost && typeof AppModuleHost.getStatus === "function" && typeof AppModuleHost.stopActive === "function"){
        const st=AppModuleHost.getStatus() || {};
        if(st.activeModule && st.activeModule !== "home") AppModuleHost.stopActive(reason || "home-cleanup");
      }
    }catch(e){ console.warn("Home cleanup: ModuleHost stop failed", e); }
    try{
      if(window.EGTSimulation && typeof EGTSimulation.abort === "function"){
        const sess = typeof EGTSimulation.getSession === "function" ? EGTSimulation.getSession() : null;
        if(sess && /starting|running/i.test(String(sess.status||""))) EGTSimulation.abort(reason || "home-cleanup");
      }
    }catch(e){ console.warn("Home cleanup: Simulation abort failed", e); }
  }

  function persistInterruptedRunForHome(reason){
    try{
      const activeRuntime = isScreenVisible("quiz") || isScreenVisible("memory") || isScreenVisible("blockIntro");
      if(!activeRuntime || !state.testStart || state.testEnd || !Array.isArray(state.quiz) || !state.quiz.length) return false;
      clearInterval(state.timer);
      clearInterval(state.memoryTimer);
      clearRouteTimers();
      finalizeOpenAnswers(reason || "homeExit");
      state.testEnd = new Date();
      state.score = state.history.filter(h=>h && h.correct).length;
      const total = state.history.filter(Boolean).length || state.quiz.length || 1;
      const percent = Math.round(state.score / total * 100);
      const dur = formatDuration(state.testEnd - state.testStart);
      const avg = Math.round(state.history.reduce((sum,h)=>sum+(h && h.duration ? h.duration : 0),0) / total / 100) / 10;
      try{ saveResult(percent,dur,avg); }catch(saveError){ console.warn("Home cleanup: interrupted result save failed", saveError); }
      try{ if(window.EGTSimulation && typeof EGTSimulation.finish === "function") EGTSimulation.finish({ mode:state.selectedMode, total:state.quiz.length, answered:total, score:state.score, percent, duration:dur, avg, reason:reason || "homeExit" }); }catch(e){}
      return true;
    }catch(error){
      console.warn("Home cleanup: interrupted run persistence failed", error);
      return false;
    }
  }

  function resetRuntimeDomAfterHome(){
    try{
      const ids=["question","visual","answers","feedback","questionNav"];
      ids.forEach(id=>{ const el=$(id); if(el) el.innerHTML=""; });
      const feedback=$("feedback"); if(feedback) feedback.classList.add("hidden");
      const review=$("review"); if(review){ review.classList.add("hidden"); review.innerHTML=""; }
      const nav=$("questionNav"); if(nav) nav.classList.remove("qnav-drawer","show");
      const toggle=$("qnavDrawerToggle"); if(toggle) toggle.remove();
    }catch(e){}
  }

  function forceHomeScrollTop(){
    const run=()=>{
      try{ window.scrollTo({top:0,left:0,behavior:"auto"}); }catch(e){ try{ window.scrollTo(0,0); }catch(_e){} }
      try{
        [document.scrollingElement, document.documentElement, document.body, $("start"), $("uiShell"), $("uiHomeViewport"), $("uiTabContent"), $("uiModuleGridWrap")].forEach(el=>{
          if(el){ el.scrollTop=0; el.scrollLeft=0; }
        });
      }catch(e){}
    };
    run();
    try{ requestAnimationFrame(()=>{ run(); requestAnimationFrame(run); }); }catch(e){ setTimeout(run,0); }
    setTimeout(run,80);
  }

  function goHomeHard(reason){
    const cleanupReason = reason || "home";
    persistInterruptedRunForHome(cleanupReason);
    clearInterval(state.timer);
    clearInterval(state.memoryTimer);
    clearRouteTimers();
    try{ duellClearPoll(); }catch(e){}
    clearExamBodyClass();
    stopActiveModuleForHome(cleanupReason);
    closeRuntimeOverlaysForHome();
    state.exam={enabled:false,hardcore:false,lockBack:false,started:false};
    state.pendingBlock=null;
    state.ctcCurrentBlock=null;
    state.duel=null;
    state.testStart=null;
    state.testEnd=null;
    state.quiz=[];
    state.history=[];
    state.questionStates=[];
    state.markedQuestions=[];
    state.current=0;
    state.score=0;
    state.timeLeft=0;
    state.totalTimeForQuestion=0;
    state.questionStartedAt=null;
    state.activeAppSection="home";
    state.activeTopTab=defaultTopTab("home");
    showOnly("start");
    const startEl=$("start");
    resetRuntimeDomAfterHome();
    renderModes();
    try{ if(window.EGTUILayer && typeof EGTUILayer.switchTab === "function") EGTUILayer.switchTab("home"); }catch(e){}
    forceHomeScrollTop();
  }

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
            function renderRuntimeDashboard(){
    // UI-B Neon Final Purge: kein zweiter Home-/Dashboard-Renderer mehr.
    // Die sichtbare Startseite kommt ausschließlich aus js/ui-home-renderer.js.
    return;
  }
  function setTrainingFocus(focus){
    return CoachAnalysisDomainEngine.setTrainingFocus(focus);
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
    simulation:{title:"Simulationen", desc:"Realistische prüfungsnah-Testläufe mit Zeitdruck und Ergebnis erst am Ende.", modes:["ctcLohr","bps","ctc","jogging"]},
    basic:{title:"Freies Üben", desc:"Einzelne Bereiche gezielt trainieren.", modes:["math","logic","general","english","it","concentrationPro","routeMemoryMode","visualIQ"]},
    block:{title:"Blocktraining", desc:"Kurze Sprintblöcke für Schwächen und Zeitdruck. Spezialblöcke bleiben in sinnvollen Kategorien auffindbar.", modes:["mathSprint","textMathSprint","algebraSprint","ratioLogicSprint","logicSprint","symbolLogicSprint","statementLogicSprint","concentrationSprint","visualIQSprint","itSprint","knowledgeSprint","generalKnowledgeBookSprint","matrixOnlySprint","sentenceSprint","numberSeriesBookSprint","textComprehensionSprint","visualLogicBookSprint","techniqueSprint","errorTrainingPrep"]}
  };

  const TRAINING_SHEET_CATEGORIES = [
    {key:"simulation", label:"Simulationen", icon:"🎯", note:"Prüfungsnahe Läufe: BPS, CTC, Elite und Jogging. Im Test gibt es keine Hinweise.", modes:["ctcLohr","bps","ctc","jogging"]},
    {key:"math", label:"Mathe", icon:"➗", note:"Grundrechnen, Kopfrechnen, Algebra, Textaufgaben und Verhältnisrechnung.", modes:["math","mathSprint","textMathSprint","algebraSprint","ratioLogicSprint"]},
    {key:"logic", label:"Logik", icon:"🧩", note:"Zahlenreihen, Muster, Symbolfolgen, Aussagenlogik und klassische Logikaufgaben.", modes:["logic","logicSprint","numberSeriesBookSprint","symbolLogicSprint","statementLogicSprint","ratioLogicSprint"]},
    {key:"matrix", label:"Matrizen", icon:"▦", note:"Gezieltes Matrixtraining inklusive der übernommenen PDF-/Buch-Matrizen.", modes:["matrixOnlySprint"]},
    {key:"visual", label:"Visual IQ", icon:"👁️", note:"Zahnräder, Spiegelung, Würfel, Faltung, Mechanik und visuelles Denken.", modes:["visualIQ","visualIQSprint","visualLogicBookSprint","routeMemoryMode"]},
    {key:"language", label:"Sprache", icon:"✍️", note:"Englisch, Satzergänzung und Textverständnis gezielt üben.", modes:["english","sentenceSprint","textComprehensionSprint"]},
    {key:"knowledge", label:"Wissen", icon:"📚", note:"Allgemeinwissen, Alltag, Geschichte, Geografie, Politik und Wissens-Sprint.", modes:["general","knowledgeSprint","generalKnowledgeBookSprint"]},
    {key:"focus", label:"Konzentration", icon:"⚡", note:"Aufmerksamkeit, Tempo, Fehlersuche und Blicksprungtraining.", modes:["concentrationPro","concentrationSprint","errorTrainingPrep"]},
    {key:"it", label:"IT/FISI", icon:"🖥️", note:"Netzwerk, Hardware, Security, Windows, Linux und FISI-Grundlagen.", modes:["it","itSprint"]},
    {key:"technique", label:"Technik", icon:"⚙️", note:"Mechanik, Stromlaufpläne, Hebel, Rollen, Zahnräder und Technikverständnis.", modes:["techniqueSprint"]}
  ];

  function allTrainingModes(){
    const seen=new Set(), out=[];
    TRAINING_SHEET_CATEGORIES.forEach(cat=>{
      (cat.modes||[]).forEach(k=>{ if(MODES[k] && !seen.has(k)){ seen.add(k); out.push(k); } });
    });
    Object.keys(MODES).forEach(k=>{ if(!seen.has(k)){ seen.add(k); out.push(k); } });
    return out;
  }

  function categoryIndexForTab(tab){
    if(tab==="simulation") return Math.max(0, TRAINING_SHEET_CATEGORIES.findIndex(c=>c.key==="simulation"));
    if(tab==="block") return Math.max(0, TRAINING_SHEET_CATEGORIES.findIndex(c=>c.key==="matrix"));
    if(tab==="basic") return Math.max(0, TRAINING_SHEET_CATEGORIES.findIndex(c=>c.key==="math"));
    return 0;
  }

  function categoryIndexForMode(mode){
    const idx=TRAINING_SHEET_CATEGORIES.findIndex(c=>Array.isArray(c.modes) && c.modes.includes(mode));
    return idx >= 0 ? idx : 0;
  }

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
      {key:"simulation", icon:"🎯", label:"Tests", action:"modeTab", tab:"simulation"},
      {key:"mix", icon:"🧠", label:"Mix", action:"modeTab", tab:"basic"},
      {key:"sprint", icon:"⚡", label:"Blöcke", action:"modeTab", tab:"block"},
      {key:"mathe", icon:"➗", label:"Mathe", action:"mode", mode:"math"},
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

  
  
  
  function forceDesktopLayoutSanity(){
    // UI-B Neon Final Purge: keine Legacy-Navigation mehr verschieben.
    return;
  }

  
  function defaultTopTab(section){
    const tabs=TOP_NAV_TABS[section] || TOP_NAV_TABS.home;
    return tabs[0] ? tabs[0].key : "live";
  }

  
  function setTopTab(section, tabKey){
    if(!TOP_NAV_TABS[section]) section = state.activeAppSection || "home";
    const tabs=TOP_NAV_TABS[section] || [];
    const tab=tabs.find(x=>x.key===tabKey) || tabs[0];
    if(!tab) return;
    if(HighscoreDuelSheetRouterEngine && typeof HighscoreDuelSheetRouterEngine.routeTopTab === "function" && HighscoreDuelSheetRouterEngine.routeTopTab(section, tab)){
      return;
    }
    state.activeAppSection = section;
    state.activeTopTab = tab.key;
    if(tab.action==="modeTab"){
      state.activeAppSection="practice";
      state.activeModeTab=tab.tab || "basic";
      state.activeSheetCategory=Math.max(0, categoryIndexForTab(state.activeModeTab));
      const modes=(MODE_TABS[state.activeModeTab]||MODE_TABS.basic).modes;
      if(!modes.includes(state.selectedMode)) state.selectedMode=modes[0];
      renderModes();
      setTimeout(()=>{ try{ openTrainingSheet(state.activeModeTab); }catch(e){} },0);
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
      if(state.activeAppSection==="practice") setTimeout(()=>{ try{ openTrainingSheet(); }catch(e){} },0);
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

  
  
  
  function modesForTrainingCategory(category){
    if(!category) return allTrainingModes();
    return (category.modes || []).filter(k=>MODES[k]);
  }

  function renderTrainingModeButton(k){
    const m=MODES[k];
    if(!m) return "";
    const selected = k === state.selectedMode;
    const cleanTitle = String(m.title || k).replace(/^\d+\.\s*/, "");
    const tags = Array.isArray(m.tags) ? m.tags.slice(0,2) : [];
    const amount = Number(m.amount || 0) ? `${m.amount} Aufgaben` : "Training";
    return `<button type="button" class="training-mode-row ${selected?'selected':''}" onclick="App.chooseTrainingMode('${k}')" aria-label="${escHTML(cleanTitle)} auswählen"><span class="training-row-dot">${selected?'✓':'+'}</span><span class="training-row-main"><b>${escHTML(cleanTitle)}</b><small>${escHTML(amount)} · ${escHTML((m.desc || '').slice(0,110))}</small></span><span class="training-row-tags">${tags.map(t=>`<em>${escHTML(t)}</em>`).join("")}</span></button>`;
  }

  function renderTrainingHub(modes, sheetMode=false){
    const categories = TRAINING_SHEET_CATEGORIES.filter(c=>modesForTrainingCategory(c).length);
    const safeIndex = Math.max(0, Math.min(Number(state.activeSheetCategory || 0), Math.max(categories.length-1,0)));
    state.activeSheetCategory = safeIndex;
    const active = categories[safeIndex] || categories[0];
    const activeModes = modesForTrainingCategory(active);
    const selected = MODES[state.selectedMode];
    const selectedTitle = selected ? String(selected.title||'Training').replace(/^\d+\.\s*/, '') : 'Training wählen';
    const selectedAmount = selected && selected.amount ? `${selected.amount} Aufgaben` : 'bereit';
    return `<div class="training-sheet-router">
      <aside class="training-category-list" aria-label="Trainingskategorien">
        ${categories.map((g,idx)=>`<button type="button" class="training-category-row ${idx===safeIndex?'active':''}" onclick="App.setTrainingSheetCategory(${idx})"><span>${g.icon}</span><b>${escHTML(g.label)}</b><em>${modesForTrainingCategory(g).length}</em></button>`).join("")}
      </aside>
      <section class="training-mode-panel">
        <div class="training-panel-head"><div><span>${active.icon}</span><b>${escHTML(active.label)}</b><small>${escHTML(active.note)}</small></div><strong>${activeModes.length} Modi</strong></div>
        <div class="training-mode-list">${activeModes.map(renderTrainingModeButton).join("")}</div>
      </section>
      <footer class="training-sheet-startbar"><div><span>Ausgewählt</span><b>${escHTML(selectedTitle)}</b><small>${escHTML(selectedAmount)} · Aufgaben laden erst nach Start.</small></div><button type="button" onclick="App.prepareTest()">Starten</button></footer>
    </div>`;
  }

  function ensureTrainingSheetShell(){
    let backdrop=$("trainingSheetBackdrop");
    let sheet=$("trainingSheet");
    if(!backdrop){
      backdrop=document.createElement("div");
      backdrop.id="trainingSheetBackdrop";
      backdrop.className="training-sheet-backdrop";
      backdrop.setAttribute("aria-hidden","true");
      backdrop.addEventListener("click", closeTrainingSheet);
      document.body.appendChild(backdrop);
    }
    if(!sheet){
      sheet=document.createElement("aside");
      sheet.id="trainingSheet";
      sheet.className="training-sheet";
      sheet.setAttribute("role","dialog");
      sheet.setAttribute("aria-modal","true");
      sheet.setAttribute("aria-label","Trainingsmenü");
      sheet.innerHTML = `<div class="training-sheet-handle" aria-hidden="true"></div><div class="training-sheet-head"><div><b>Trainingsmenü</b><span id="trainingSheetSubtitle">Kategorien, Simulationen und Blocktraining</span></div><button class="training-sheet-close" type="button" aria-label="Trainingsmenü schließen" onclick="App.closeTrainingSheet()">×</button></div><div id="trainingSheetContent" class="training-sheet-content"></div>`;
      document.body.appendChild(sheet);
    }
    return {sheet, backdrop};
  }

  function syncTrainingSheetDeviceClass(){
    const shell=ensureTrainingSheetShell();
    const coarse = window.matchMedia ? window.matchMedia("(pointer: coarse)").matches : false;
    const compact = window.matchMedia ? window.matchMedia("(max-width: 760px), (max-height: 680px)").matches : (innerWidth<=760 || innerHeight<=680);
    const landscape = window.matchMedia ? window.matchMedia("(orientation: landscape)").matches : innerWidth>innerHeight;
    shell.sheet.dataset.device = compact ? "mobile" : "desktop";
    shell.sheet.dataset.pointer = coarse ? "touch" : "fine";
    shell.sheet.dataset.orientation = landscape ? "landscape" : "portrait";
    document.body.classList.toggle("training-sheet-compact", compact);
    document.body.classList.toggle("training-sheet-desktop", !compact);
  }

  function renderTrainingSheetContent(){
    const shell=ensureTrainingSheetShell();
    syncTrainingSheetDeviceClass();
    const el=$("trainingSheetContent");
    const subtitle=$("trainingSheetSubtitle");
    if(!el) return;
    const allModes = allTrainingModes();
    if(subtitle) subtitle.textContent = "Alle Kategorien · " + allModes.length + " Modi";
    el.innerHTML = renderTrainingHub(allModes, true);
  }

  function setTrainingSheetCategory(index){
    state.activeSheetCategory = Math.max(0, Number(index)||0);
    renderTrainingSheetContent();
  }

  function openTrainingSheet(tab){
    if(tab && MODE_TABS[tab]){ state.activeModeTab=tab; state.activeSheetCategory=Math.max(0, categoryIndexForTab(tab)); }
    else if(typeof state.activeSheetCategory !== "number") state.activeSheetCategory = categoryIndexForMode(state.selectedMode);
    renderTrainingSheetContent();
    const shell=ensureTrainingSheetShell();
    try{ const c=$("trainingSheetContent"); if(c) c.scrollTop=0; }catch(e){}
    requestAnimationFrame(()=>{
      if(shell.backdrop) shell.backdrop.classList.add("show");
      if(shell.sheet) shell.sheet.classList.add("show");
      document.body.classList.add("training-sheet-open","bps-sheet-open");
    });
  }

  function openSimulationSheet(){
    state.activeModeTab = "simulation";
    state.selectedMode = "ctcLohr";
    state.activeSheetCategory = Math.max(0, categoryIndexForTab("simulation"));
    // Kein Legacy-Frontend rendern: nur das bestehende Deep-Sheet/Trainingsmenü öffnen.
    try{ closeTrainingSheet(); }catch(e){}
    try{ renderTrainingSheetContent(); }catch(e){}
    openTrainingSheet("simulation");
  }

  function closeTrainingSheet(){
    const shell=ensureTrainingSheetShell();
    if(shell.backdrop) shell.backdrop.classList.remove("show");
    if(shell.sheet) shell.sheet.classList.remove("show");
    document.body.classList.remove("training-sheet-open","bps-sheet-open");
  }

  
  
  
  
  
  
  function renderModes() {
    const section = state.activeAppSection || "home";
    document.body.dataset.appSection = section;
    // UI-B Neon Final Purge: keine Legacy-Home-, Runtime- oder Hub-Renderer mehr.
    try { if(window.EGTUILayer && typeof EGTUILayer.refresh === "function") EGTUILayer.refresh(); } catch(e){}
  }

  function setAppSection(section){
    if(section==="analysis") { showAnalysis(); return; }
    if(section==="start" || section==="home") { goHomeHard("set-section-home"); return; }
    if(section==="simulation") { section="practice"; state.activeModeTab="simulation"; state.selectedMode="ctcLohr"; }
    if(section==="profile") section="settings";
    if(HighscoreDuelSheetRouterEngine && typeof HighscoreDuelSheetRouterEngine.routeSection === "function" && HighscoreDuelSheetRouterEngine.routeSection(section, {reason:"setAppSection"})){
      showOnly("start");
      return;
    }
    if(!APP_SECTIONS[section]) { goHomeHard("set-section-fallback-home"); return; }
    state.activeAppSection=section;
    state.activeTopTab=defaultTopTab(section);
    showOnly("start");
    if(section==="practice" && !Object.values(MODE_TABS).some(t=>t.modes.includes(state.selectedMode))) state.selectedMode=(state.activeModeTab==="simulation"?"ctcLohr":"math");
    renderModes();
    if(section==="practice") setTimeout(()=>{ try{ openTrainingSheet(); }catch(e){} }, 30);
  }

  function setModeTab(tab){
    if(!MODE_TABS[tab]) return;
    state.activeAppSection="practice";
    state.activeTopTab = tab==="block" ? "sprint" : (tab==="simulation" ? "simulation" : "mix");
    state.activeModeTab=tab;
    state.activeSheetCategory=Math.max(0, categoryIndexForTab(tab));
    if(!MODE_TABS[tab].modes.includes(state.selectedMode)) state.selectedMode=MODE_TABS[tab].modes[0];
    renderModes();
    setTimeout(()=>{ try{ openTrainingSheet(tab); }catch(e){} },0);
  }
  function chooseTrainingMode(k){
    if(!MODES[k]) return;
    state.selectedMode=k;
    state.activeAppSection="practice";
    const tab=Object.keys(MODE_TABS).find(t=>MODE_TABS[t].modes.includes(k));
    if(tab) state.activeModeTab=tab;
    state.activeSheetCategory = categoryIndexForMode(k);
    const practiceTabs=TOP_NAV_TABS.practice || [];
    const direct=practiceTabs.find(t=>t.mode===k);
    state.activeTopTab = direct ? direct.key : (tab==="block" ? "sprint" : (tab==="simulation" ? "simulation" : "mix"));
    renderModes();
    try{ renderTrainingSheetContent(); }catch(e){}
  }

  function selectMode(k){
    if(!MODES[k]) return;
    try{ closeTrainingSheet(); }catch(e){}
    state.selectedMode=k;
    state.activeAppSection="practice";
    const tab=Object.keys(MODE_TABS).find(t=>MODE_TABS[t].modes.includes(k));
    if(tab) state.activeModeTab=tab;
    state.activeSheetCategory = categoryIndexForMode(k);
    const practiceTabs=TOP_NAV_TABS.practice || [];
    const direct=practiceTabs.find(t=>t.mode===k);
    state.activeTopTab = direct ? direct.key : (tab==="block" ? "sprint" : "mix");
    showOnly("start");
    renderModes();
  }
  function isExerciseIntroMode(mode) {
    return ["math","logic","general","english","it","concentrationPro","routeMemoryMode","visualIQ","mathSprint","textMathSprint","logicSprint","concentrationSprint","visualIQSprint","itSprint","knowledgeSprint","matrixOnlySprint","sentenceSprint","numberSeriesBookSprint","textComprehensionSprint","visualLogicBookSprint","techniqueSprint","errorTrainingPrep"].includes(mode);
  }
  function showExerciseIntro() {
    const m=MODES[state.selectedMode];
    state.pendingBlock=null;
    $("blockIntroTitle").textContent="Übung verstehen";
    const focus=m?.title || "Training";
    const extra = state.selectedMode==="matrixOnlySprint"
      ? "<li>Bei Matrizen immer Reihe, Spalte und Wiederholung prüfen: Position, Form, Farbe, Anzahl, Drehung.</li>"
      : state.selectedMode==="sentenceSprint"
        ? "<li>Bei Satzergänzungen zuerst die Beziehung erkennen: Grund, Gegensatz, Zweck, Zeitfolge oder Bedingung.</li>"
        : "";
    $("blockIntroText").innerHTML=`<p><b>${escHTML(focus)}</b></p><p>Diese Einheit ist als Übung gedacht. Hier sind Hinweise, Erklärungen und Sofortfeedback sinnvoll, weil du das Muster verstehen und nicht nur raten sollst.</p><div class="blockRules"><b>So trainierst du sauber:</b><ul><li>Erst das Grundprinzip erkennen: Was verändert sich, was bleibt gleich?</li>${extra}<li>Bei Fehlern die Erklärung lesen und das Muster bewusst nachsprechen.</li><li>Im Testmodus gibt es keine Hinweise während der Aufgabe. Lösungen und Erklärungen kommen dort erst am Ende.</li></ul></div><p><b>Aufgabe verstanden?</b></p>`;
    const btn=$("blockIntroStartBtn"); if(btn) btn.textContent="JA – Übung beginnt";
    showOnly("blockIntro");
  }
  function prepareTest() {
    if(state.duel && state.selectedMode!=="duell"){ duellClearPoll(); state.duel=null; }
    try{
      if(window.EGTAuthProfileShell && typeof EGTAuthProfileShell.canStartMode === "function" && !EGTAuthProfileShell.canStartMode(state.selectedMode)) return;
    } catch(gateError) { console.warn("Feature Gate", gateError); return; }
    try{ closeTrainingSheet(); }catch(e){}
    readExamOptions();
    applyExamBodyClass();
    const m=MODES[state.selectedMode];
    if(m.memory){state.memoryItems=memoryItems(); $("memoryTable").innerHTML=memoryHtml(); showMemoryPhase();}
    else if(isExerciseIntroMode(state.selectedMode)) showExerciseIntro();
    else startQuiz();
  }
  function showMemoryPhase() {
    clearInterval(state.memoryTimer); showOnly("memory");
    let t=240; $("memoryTimer").textContent="Einprägezeit: "+t+" s"; $("memoryTimer").classList.remove("low");
    state.memoryTimer=setInterval(()=>{t--; $("memoryTimer").textContent="Einprägezeit: "+t+" s"; if(t<=25)$("memoryTimer").classList.add("low"); if(t<=0){clearInterval(state.memoryTimer); beginQuizAfterMemory();}},1000);
  }
  function beginQuizAfterMemory(){clearInterval(state.memoryTimer); startQuiz();}
  function cancelMemoryPhase(){clearInterval(state.memoryTimer); restart();}
  function startQuiz() {
    const m = MODES[state.selectedMode] || {};
    let hostSimulationConfig = null;
    try {
      if(window.AppModuleHost && typeof window.AppModuleHost.buildSimulationConfig === "function") {
        hostSimulationConfig = window.AppModuleHost.buildSimulationConfig({ mode: state.selectedMode, source: "app-startQuiz-phase3" });
      }
    } catch(hostConfigError) { console.warn("AppModuleHost simulation config", hostConfigError); }
    if(window.EGTSimulation && typeof window.EGTSimulation.start === "function" && window.EGTSimulation.isReady && window.EGTSimulation.isReady()) {
      return window.EGTSimulation.start({
        moduleHost: hostSimulationConfig,
        branch: hostSimulationConfig && hostSimulationConfig.branch,
        branchLabel: hostSimulationConfig && hostSimulationConfig.branchLabel,
        mode: state.selectedMode,
        modus: state.selectedMode === "ctcLohr" ? "BPS" : state.selectedMode,
        bereich: categoryIndexForMode(state.selectedMode),
        niveau: state.exam && state.exam.hardcore ? "hardcore" : "standard",
        titel: m.title || "Eignungstest-Simulation",
        fragenAnzahl: m.amount || 0,
        zeitProFrage: state.selectedMode === "ctcLohr" ? 22 : (state.selectedMode === "bps" ? 50 : 50),
        features: {
          coachHilfe: !(state.selectedMode === "ctcLohr" || state.selectedMode === "bps" || state.selectedMode === "ctc"),
          merken: true,
          skip: true,
          lockBack: !!(state.exam && state.exam.lockBack)
        },
        source: "app-shell"
      });
    }
    return startQuizInternal();
  }

  function simulationHostCall(method, args, fallback) {
    try {
      if (window.EGTSimulation && typeof window.EGTSimulation[method] === "function" && window.EGTSimulation.isReady && window.EGTSimulation.isReady()) {
        return window.EGTSimulation[method].apply(window.EGTSimulation, Array.isArray(args) ? args : []);
      }
    } catch (hostError) { console.warn("EGTSimulation." + method + " fallback", hostError); }
    return typeof fallback === "function" ? fallback() : null;
  }

  function startQuizInternal() {
    try{ closeTrainingSheet(); }catch(e){}
    clearRouteTimers();
    state.adaptiveMemoryPool=[];
    if(state.duel && state.selectedMode==="duell" && Array.isArray(state.duel.quizSnapshot) && (state.duel.mode==="online" || state.duel.phase==="p2")){
      // Online (beide Spieler) bzw. lokal Spieler 2: identischer Fragensatz inkl. Antwortreihenfolge
      state.quiz=JSON.parse(JSON.stringify(state.duel.quizSnapshot));
    } else {
      state.quiz=buildQuiz();
      if(state.duel && state.duel.phase==="p1"){
        state.duel.quizSnapshot=JSON.parse(JSON.stringify(state.quiz));
      }
    }
    state.current=0; state.score=0; state.history=[]; state.questionStates=[]; state.markedQuestions=[];
    state.testStart=new Date(); state.testEnd=null; state.exam.started=true; applyExamBodyClass(); state.ctcBlockRemaining={...CTC_BLOCK_LIMITS}; state.ctcCurrentBlock=null; state.shownBlockIntro={}; state.pendingBlock=null;
    showOnly("quiz");
    simulationHostCall("showQuestion", [], function(){ return showQuestion(); });
  }
  function startCtcBlockFromIntro() {
    try{ closeTrainingSheet(); }catch(e){}
    if(!state.pendingBlock){ startQuiz(); return; }
    if(state.pendingBlock) state.shownBlockIntro[state.pendingBlock]=true;
    state.pendingBlock=null; showOnly("quiz");
    const btn=$("blockIntroStartBtn"); if(btn) btn.textContent="Block starten";
    simulationHostCall("showQuestion", [true], function(){ return showQuestion(true); });
  }

  function updateTrainingCockpitUi(q, totalDisplay) {
    const quizEl = $("quiz");
    const timerEl = $("timer");
    if(!quizEl || !timerEl || !q) return;
    // G37.0: Training-Cockpit wieder aktiv. Die Frageübersicht liegt nicht mehr im
    // Inhaltsfluss unten, sondern in einem einklappbaren Drawer. Dadurch bekommt
    // die eigentliche Aufgabe sichtbar Vorrang.
    quizEl.classList.add("training-cockpit");
    quizEl.dataset.mode = String(state.selectedMode || "training");
    quizEl.dataset.questionType = String(q.type || "mc");
    const total = Math.max(1, Number(totalDisplay || state.quiz.length || 1));
    const answered = state.history.filter(Boolean).length;
    quizEl.style.setProperty("--egt-question-index", String(state.current + 1));
    quizEl.style.setProperty("--egt-question-total", String(total));
    quizEl.style.setProperty("--egt-answered-total", String(answered));
    const max = Math.max(1, Number(state.totalTimeForQuestion || q.time || 25));
    const left = Math.max(0, Number(state.timeLeft || 0));
    const percent = Math.max(0, Math.min(100, Math.round((left / max) * 100)));
    timerEl.style.setProperty("--egt-timer-progress", percent + "%");
    timerEl.dataset.label = state.selectedMode === "ctcLohr" ? "Blockzeit" : "Zeit";
    timerEl.classList.toggle("is-low", percent <= 25);
    timerEl.classList.toggle("is-warn", percent <= 45 && percent > 25);
    timerEl.setAttribute("aria-label", `${timerEl.dataset.label}: ${timerEl.textContent}`);
  }


  function safeMathMasteryFlag(questionId) {
    try {
      if(!questionId) return false;
      return localStorage.getItem("bps_math_understood_" + questionId) === "true";
    } catch(e) { return false; }
  }

  function showQuestionInternal(spIntro=false) {
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
      state.pendingBlock=q.block;
      const info=BLOCK_INFO[q.block] || {title:q.block,text:"Starte den nächsten Block.",rules:["Ruhig bleiben","Sichere Aufgaben zuerst","Markieren statt festbeißen"]};
      $("blockIntroTitle").textContent=info.title;
      $("blockIntroText").innerHTML=`<p>${info.text}</p><div class="blockRules"><b>Strategie:</b><ul>${info.rules.map(r=>`<li>${r}</li>`).join("")}</ul></div>`;
      const btn=$("blockIntroStartBtn"); if(btn) btn.textContent="Block starten";
      showOnly("blockIntro");
      return;
    }
    showOnly("quiz");
    state.questionStartedAt=new Date();
    let totalDisplay=isAdaptiveElite()?MODES.ctc.amount:state.quiz.length;
    const isMastered = q.id ? safeMathMasteryFlag(q.id) : false;
    const masteredBadge = isMastered ? `<span class="badge mastered-badge">✓ Gelernt</span>` : "";
    if(state.selectedMode==="ctcLohr") {
      if(state.ctcCurrentBlock!==q.block){state.ctcCurrentBlock=q.block;}
      const isFlowLogicTask = q.type === "ctcFlowLogic";
      const ctcQuestionTime = Math.max(1, Number(q.specialTimeSeconds || q.time || (isFlowLogicTask ? 780 : 22)));
      state.timeLeft = ctcQuestionTime;
      state.totalTimeForQuestion = ctcQuestionTime;
      $("timer").textContent=state.timeLeft; $("timer").classList.toggle("warn",state.timeLeft<=60); $("timer").classList.toggle("low",state.timeLeft<=30); $("timer").classList.toggle("critical",state.timeLeft<=15);
      const ctcRuleLabel = isFlowLogicTask ? 'CTC-Logik: 13 Minuten · keine Hilfe · Fehler erst am Ende werten' : (q.timeModel === 'block' ? 'CTC-Lohr: 7-Minuten-Wissensblock · ca. 10,5 Sek./Frage · keine Hilfe' : `CTC-Lohr: ${ctcQuestionTime} Sekunden · Eingabe/Antwort ohne Hilfe`);
      $("meta").innerHTML=`<span class="badge">${MODES[state.selectedMode].title}</span><span class="badge">${q.block}</span><span class="badge">${q.cat}</span><span class="badge">Frage ${state.current+1}/${totalDisplay}</span>${masteredBadge}<div class="block-timer-label">${ctcRuleLabel}</div>${examStatusHtml()}`;
    } else {
      const simulationBps = state.selectedMode==="bps";
      const trainingTime = Math.max(Number(q.time||25), 50);
      state.timeLeft=state.selectedMode==="ctc"?Math.max(12,Math.floor((q.time||25)*.8)):(simulationBps?50:trainingTime); state.totalTimeForQuestion=state.timeLeft;
      $("timer").textContent=state.timeLeft; $("timer").classList.remove("low","warn","critical");
      $("meta").innerHTML=`<span class="badge ${state.selectedMode==="ctc"?"hardcore-badge":""}">${MODES[state.selectedMode].title}</span><span class="badge">${q.cat}</span><span class="badge">Frage ${state.current+1}/${totalDisplay}</span>${masteredBadge}${simulationBps?'<span class="badge">50 Sek./Aufgabe · keine Hilfe</span>':''}${examStatusHtml()}`;
    }
    $("progressfill").style.width=`${state.current/totalDisplay*100}%`;
    $("question").innerHTML=q.q; $("feedback").classList.add("hidden"); $("feedback").innerHTML="";
    updateTrainingCockpitUi(q,totalDisplay);
    renderVisual(q);
    simulationHostCall("renderAnswers", [q], function(){ return renderAnswers(q); });
    simulationHostCall("updateQuestionNav", [], function(){ return updateQuestionNav(); });
    // Show/hide help button: Simulationen bleiben prüfungsnah ohne Hilfe. Training darf helfen.
    const helpContainer = $("quizHelpContainer");
    if(helpContainer) {
      const isStrictSimulation = state.selectedMode === "ctcLohr" || state.selectedMode === "bps" || state.selectedMode === "ctc";
      if(!isStrictSimulation && q.group === "Mathe") {
        helpContainer.classList.remove("hidden");
        const btn = $("uiHelpBtn");
        if(btn) {
          btn.onclick = () => App.openMathHelp(q);
        }
      } else {
        helpContainer.classList.add("hidden");
      }
    }
    // Layout-Guard: nach jedem Render automatisch Layout-Invarianten prüfen
    try{ document.dispatchEvent(new CustomEvent("egt:question-rendered")); }catch(e){}
    state.timer=setInterval(()=>simulationHostCall("tickTimer", [], function(){ return tickTimer(); }),1000);
  }
  function tickTimerInternal() {
    const q=state.quiz[state.current]; if(!q)return;
    if(state.selectedMode==="ctcLohr") {
      state.timeLeft=Math.max(0,(state.timeLeft||0)-1); $("timer").textContent=state.timeLeft; $("timer").classList.toggle("warn",state.timeLeft<=10); $("timer").classList.toggle("low",state.timeLeft<=5); $("timer").classList.toggle("critical",state.timeLeft<=5);
      updateTrainingCockpitUi(q, isAdaptiveElite()?MODES.ctc.amount:state.quiz.length);
      if(state.timeLeft<=0){ clearInterval(state.timer); if(q.type==="ctcFlowLogic" && !state.history[state.current]){ submitCtcFlowLogicAnswer(true); return; } if((q.type==="ctcRuleArithmeticInput" || q.type==="ctcLetterScanInput" || q.type==="ctcCoordinateTableInput" || q.type==="ctcNumberSeriesInput") && !state.history[state.current]){ submitCtcLohrInputAnswer(true); return; } if(!state.history[state.current])recordAnswer(null,false,true); nextQuestion(); }
    } else {
      state.timeLeft--; $("timer").textContent=state.timeLeft; if(state.timeLeft<=10)$("timer").classList.add("warn"); if(state.timeLeft<=5)$("timer").classList.add("low","critical");
      updateTrainingCockpitUi(q, isAdaptiveElite()?MODES.ctc.amount:state.quiz.length);
      if(state.timeLeft<=0){clearInterval(state.timer); recordAnswer(null,false,true); if(MODES[state.selectedMode].instant){$("feedback").textContent="Zeit abgelaufen."; $("feedback").classList.remove("hidden"); setTimeout(nextQuestion,650);} else nextQuestion();}
    }
  }
  function pauseTimerInternal() {
    clearInterval(state.timer);
  }
  function resumeTimerInternal() {
    clearInterval(state.timer);
    state.timer=setInterval(()=>simulationHostCall("tickTimer", [], function(){ return tickTimer(); }),1000);
  }
  function nextBlockIndexInternal(from) {
    const curBlock=state.quiz[from]?.block;
    for(let i=from+1;i<state.quiz.length;i++){if(state.quiz[i]?.block!==curBlock)return i;}
    return state.quiz.length;
  }

  function renderAnswers(q) {
    $("answers").innerHTML="";
    if(q.type==="ctcFlowLogic") {
      return renderCtcFlowLogicAnswers(q);
    }
    if(q.type==="ctcRuleArithmeticInput" || q.type==="ctcLetterScanInput" || q.type==="ctcCoordinateTableInput" || q.type==="ctcNumberSeriesInput") {
      return renderCtcLohrInputAnswers(q);
    }
    if(q.type==="edvmulti") {
      // Phase 2G: EDV-Multi-Rendering und Interaktion liegen physisch im Simulationsmodul.
      return simulationHostCall("renderEdvMultiAnswers", [q], function(){
        return renderEdvMultiAnswersInternal(q);
      });
    }
    if(q.type==="routeMemory") {
      // Phase 2F: Route-Memory-Rendering und Interaktion liegen physisch im Simulationsmodul.
      // Dieser Zweig bleibt nur als kontrollierter Legacy-Fallback erhalten.
      return simulationHostCall("renderRouteSequenceAnswers", [q], function(){
        return renderRouteSequenceAnswersInternal(q);
      });
    }
    // Phase 2C: Standard-Multiple-Choice-Rendering liegt physisch im Modul
    // `js/modules/egt-simulation-engine.js` (`renderStandardAnswers`).
    // `app.js` behält hier nur noch EDV-Multi als echten Spezialadapter; Route-Memory ist seit Phase 2F im Modul.
    return simulationHostCall("renderStandardAnswers", [q], function(){
      console.warn("EGTSimulation.renderStandardAnswers nicht verfügbar; Standard-MC konnte nicht modular gerendert werden.");
      return null;
    });
  }


  function renderCtcLohrInputAnswers(q) {
    const answersEl = $("answers");
    if(!answersEl || !q) return null;
    const esc = escHTML;
    const previous = state.history[state.current] || null;
    if(q.type === "ctcRuleArithmeticInput") {
      answersEl.innerHTML = `
        <div class="ctc-lohr-input-panel ctc-rule-panel">
          <div class="ctc-lohr-task-kicker">CTC-Regelrechnung · Eingabe · kein Multiple Choice</div>
          <div class="ctc-rule-formula" aria-label="Regelrechnung">${esc(q.formula || q.q || "")}</div>
          <div class="ctc-lohr-rule-box">Regel: Rechne zuerst den Teil vor dem <b>/</b> und den Teil nach dem <b>/</b>. Wenn der Nenner kleiner ist als der Zähler: <b>Zähler minus Nenner</b>. Wenn der Nenner größer oder gleich ist: <b>Zähler plus Nenner</b>.</div>
          <label class="ctc-lohr-input-label">Deine Antwort<input id="ctcLohrAnswerInput" class="ctc-lohr-answer-input" inputmode="numeric" autocomplete="off" ${previous?"disabled":""} value="${previous && previous.givenIndex != null ? esc(previous.givenIndex) : ""}"></label>
          <button type="button" class="btn btn-primary ctc-lohr-submit" data-action="ctc-input-submit" ${previous?"disabled":""}>Antwort werten</button>
        </div>`;
    } else if(q.type === "ctcLetterScanInput") {
      answersEl.innerHTML = `
        <div class="ctc-lohr-input-panel ctc-letter-panel">
          <div class="ctc-lohr-task-kicker">Buchstaben-Konzentration · Eingabe · kein Multiple Choice</div>
          <div class="ctc-letter-sequence" aria-label="Buchstabenfolge">${esc(q.sequence || "")}</div>
          <div class="ctc-lohr-rule-box">Zähle nur den abweichenden Buchstaben: <b>${esc(q.targetLetter || "")}</b>. Trage die Anzahl ein.</div>
          <label class="ctc-lohr-input-label">Anzahl<input id="ctcLohrAnswerInput" class="ctc-lohr-answer-input" inputmode="numeric" autocomplete="off" ${previous?"disabled":""} value="${previous && previous.givenIndex != null ? esc(previous.givenIndex) : ""}"></label>
          <button type="button" class="btn btn-primary ctc-lohr-submit" data-action="ctc-input-submit" ${previous?"disabled":""}>Antwort werten</button>
        </div>`;
    } else if(q.type === "ctcNumberSeriesInput") {
      const seq = Array.isArray(q.sequence) ? q.sequence : [];
      answersEl.innerHTML = `
        <div class="ctc-lohr-input-panel ctc-series-panel">
          <div class="ctc-lohr-task-kicker">Zahlenreihen · Eingabe · kein Multiple Choice</div>
          <div class="ctc-series-sequence" aria-label="Zahlenreihe">${seq.map(n=>`<span class="ctc-series-num">${esc(n)}</span>`).join('<span class="ctc-series-sep">,</span>')}<span class="ctc-series-sep">,</span><span class="ctc-series-num ctc-series-q">?</span></div>
          <div class="ctc-lohr-rule-box">Erkenne das Muster der Reihe und gib die <b>nächste Zahl</b> ein.</div>
          <label class="ctc-lohr-input-label">Nächste Zahl<input id="ctcLohrAnswerInput" class="ctc-lohr-answer-input" inputmode="numeric" autocomplete="off" ${previous?"disabled":""} value="${previous && previous.givenIndex != null ? esc(previous.givenIndex) : ""}"></label>
          <button type="button" class="btn btn-primary ctc-lohr-submit" data-action="ctc-input-submit" ${previous?"disabled":""}>Antwort werten</button>
        </div>`;
    } else if(q.type === "ctcCoordinateTableInput") {
      const cols = q.cols || [];
      const rows = q.rows || [];
      const grid = q.grid || [];
      const prompts = q.prompts || [];
      const prevVals = previous && previous.givenIndex ? String(previous.givenIndex).split('|') : [];
      const head = `<tr><th></th>${cols.map(c=>`<th>${esc(c)}</th>`).join("")}</tr>`;
      const body = rows.map((r,ri)=>`<tr><th>${esc(r)}</th>${cols.map((c,ci)=>`<td>${esc((grid[ri]||[])[ci]||"")}</td>`).join("")}</tr>`).join("");
      const inputs = prompts.map((p,i)=>`<label class="ctc-coordinate-input"><span>${esc(p.key)}</span><input data-ctc-coord-index="${i}" maxlength="1" autocapitalize="characters" autocomplete="off" ${previous?"disabled":""} value="${esc(prevVals[i]||"")}"></label>`).join("");
      answersEl.innerHTML = `
        <div class="ctc-lohr-input-panel ctc-coordinate-panel">
          <div class="ctc-lohr-task-kicker">Tabellen ablesen · mehrere Eingaben · fehlend = X</div>
          <div class="ctc-table-wrap"><table class="ctc-coordinate-table">${head}${body}</table></div>
          <div class="ctc-lohr-rule-box">Lies die Koordinaten ab. Existiert eine Spalte oder Zeile nicht, trage <b>X</b> ein.</div>
          <div class="ctc-coordinate-grid">${inputs}</div>
          <button type="button" class="btn btn-primary ctc-lohr-submit" data-action="ctc-input-submit" ${previous?"disabled":""}>Antworten werten</button>
        </div>`;
    }
    if(previous) {
      $("feedback").innerHTML=(previous.correct?"<b>Richtig.</b> ":"<b>Falsch.</b> ")+(previous.explanation||q.ex||"");
      $("feedback").classList.remove("hidden");
    } else {
      const inp=$("ctcLohrAnswerInput");
      if(inp) setTimeout(()=>{ try{ inp.focus(); }catch(e){} }, 80);
    }
    return true;
  }

  function submitCtcLohrInputAnswer(timeout=false){
    const q = state.quiz[state.current];
    if(!q || !["ctcRuleArithmeticInput","ctcLetterScanInput","ctcCoordinateTableInput","ctcNumberSeriesInput"].includes(q.type) || state.history[state.current]) return;
    let value = "";
    if(q.type === "ctcCoordinateTableInput") {
      value = Array.from(document.querySelectorAll('[data-ctc-coord-index]')).sort((a,b)=>Number(a.dataset.ctcCoordIndex)-Number(b.dataset.ctcCoordIndex)).map(el=>String(el.value||"").trim().toUpperCase()).join('|');
    } else {
      const inp = $("ctcLohrAnswerInput");
      value = String(inp && inp.value || "").trim().replace(',', '.');
    }
    if(!timeout && !value.replace(/\|/g,'')) {
      const fb=$("feedback");
      if(fb){ fb.innerHTML="<b>Eingabe fehlt.</b> Trage eine Antwort ein oder überspringe die Aufgabe."; fb.classList.remove("hidden"); }
      return;
    }
    clearInterval(state.timer);
    const expected = String(q.answer || "").trim().replace(',', '.').toUpperCase();
    const given = String(value || "").trim().toUpperCase();
    const correct = given === expected;
    recordAnswer(given || null, correct, !!timeout);
    if(correct) state.score++;
    state.questionStates[state.current]=state.markedQuestions[state.current]?"mark":"done";
    updateQuestionNav();
    const fb=$("feedback");
    if(fb){ fb.innerHTML=(correct?"<b>Richtig.</b> ":"<b>Falsch.</b> ")+(q.ex||""); fb.classList.remove("hidden"); }
    setTimeout(()=>{ if(state.current<state.quiz.length-1) nextQuestion(); else showResult(); }, 700);
  }

  function renderEdvMultiAnswers(q) {
    return simulationHostCall("renderEdvMultiAnswers", [q], function(){
      return renderEdvMultiAnswersInternal(q);
    });
  }

  function renderEdvMultiAnswersInternal(q) {
    const need=q.edvRequiredCount || EDV_ERRORS.length;
    const selected=MultiChoiceModule.init(q,"edvMultiSelected",need);
    const chips=selected.length ? MultiChoiceModule.chips(selected, id=>id, id=>`App.toggleEdvMultiNode('${id}')`) : `<span class="small">Noch kein Schema-Eintrag ausgewählt.</span>`;
    const optionButtons = EDV_SCHEMA.map(x=>`<button type="button" class="edv-select-btn answer-card ${selected.includes(x.id)?"used":""}" data-edv-id="${x.id}"><b>${x.id}</b><span>${escHTML(x.text)}</span></button>`).join("");
    $("answers").innerHTML=`
      <div class="edv-answer-panel">
        <b>EDV-Multi-Select</b><br>
        <span class="small">Ausgewählt: ${selected.length}/${need}. Du kannst entweder die Schema-Karten oben oder die Auswahlbuttons unten antippen. Erneutes Tippen wählt ab.</span>
        <div class="route-selected-list">${chips}</div>
        <div class="edv-option-grid">${optionButtons}</div>
        <div class="route-action-row">
          <button type="button" class="btn btn-secondary" data-action="edv-undo">Letzte entfernen</button>
          <button type="button" class="btn btn-secondary" data-action="edv-clear">Auswahl leeren</button>
          <button type="button" class="btn btn-primary" data-action="edv-submit">Gesamtantwort werten</button>
        </div>
      </div>`;
    if(state.history[state.current]) {
      const h=state.history[state.current];
      $("feedback").innerHTML=(h.correct?"<b>Richtig.</b> ":"<b>Falsch.</b> ")+h.explanation;
      $("feedback").classList.remove("hidden");
    }
  }

  function toggleEdvMultiNode(id) {
    return simulationHostCall("toggleEdvMultiNode", [id], function(){
      return toggleEdvMultiNodeInternal(id);
    });
  }

  function toggleEdvMultiNodeInternal(id) {
    const q=state.quiz[state.current];
    if(!q || q.type!=="edvmulti" || state.history[state.current]) return;
    const need=q.edvRequiredCount || EDV_ERRORS.length;
    const result=MultiChoiceModule.toggle(q,"edvMultiSelected",id,need);
    if(!result.ok && result.action==="max"){
      $("feedback").innerHTML=`<b>Maximal ${need} Einträge.</b> Tippe eine gewählte Karte erneut an, um sie zu entfernen.`;
      $("feedback").classList.remove("hidden");
    }
    $("visual").innerHTML=renderEdvProHTML(q);
    renderEdvMultiAnswersInternal(q);
  }

  function undoEdvMultiSelection(){
    return simulationHostCall("undoEdvMultiSelection", [], function(){
      return undoEdvMultiSelectionInternal();
    });
  }

  function undoEdvMultiSelectionInternal(){
    const q=state.quiz[state.current];
    if(!q || q.type!=="edvmulti" || state.history[state.current]) return;
    MultiChoiceModule.undo(q,"edvMultiSelected");
    $("visual").innerHTML=renderEdvProHTML(q);
    renderEdvMultiAnswersInternal(q);
  }

  function clearEdvMultiSelection(){
    return simulationHostCall("clearEdvMultiSelection", [], function(){
      return clearEdvMultiSelectionInternal();
    });
  }

  function clearEdvMultiSelectionInternal(){
    const q=state.quiz[state.current];
    if(!q || q.type!=="edvmulti" || state.history[state.current]) return;
    MultiChoiceModule.clear(q,"edvMultiSelected");
    $("visual").innerHTML=renderEdvProHTML(q);
    renderEdvMultiAnswersInternal(q);
  }

  function submitEdvMultiAnswer(){
    return simulationHostCall("submitEdvMultiAnswer", [], function(){
      return submitEdvMultiAnswerInternal();
    });
  }

  function submitEdvMultiAnswerInternal(){
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
    recordEdvMultiAnswersInternal(selected);
    markEdvMultiCoveredDone(need);
    updateQuestionNav();
    $("visual").innerHTML=renderEdvProHTML(q);
    highlightEdvMultiResult(selected);
    const correctSet=new Set(EDV_ERRORS.map(e=>e.id));
    const found=EDV_ERRORS.filter(e=>selected.includes(e.id)).length;
    const falsePos=selected.filter(id=>!correctSet.has(id)).length;
    $("feedback").innerHTML=`<b>EDV ausgewertet.</b> ${found}/${need} Fehler korrekt gefunden${falsePos?`, ${falsePos} falsche Markierung(en)`:""}. Richtige Fehler: ${EDV_ERRORS.map(e=>e.id).join(", ")}.`;
    $("feedback").classList.remove("hidden");
    setTimeout(()=>afterEdvMultiSubmit(need, selected),1200);
  }

  function markEdvMultiCoveredDone(need){
    state.score=state.history.filter(h=>h&&h.correct).length;
    for(let i=state.current;i<Math.min(state.quiz.length,state.current+need);i++) {
      state.questionStates[i]=state.markedQuestions[i]?"mark":"done";
      if(state.quiz[i] && state.quiz[i].type==="edvcovered") state.history[i]=state.history[i] || {q:"EDV-Großschema Platzhalter",cat:"EDV Diagramm PRO",group:"IT/FISI",block:"5. EDV Kenntnisse",answers:["EDV-Gesamtaufgabe"],correctIndex:0,givenIndex:0,correct:true,timeout:false,skipped:false,explanation:"Durch die EDV-Gesamtaufgabe bewertet.",visualType:"edvcovered",duration:0,allowed:state.totalTimeForQuestion,examMode:{...state.exam}};
    }
  }

  function highlightEdvMultiResult(selected){
    const correctSet=new Set(EDV_ERRORS.map(e=>e.id));
    EDV_SCHEMA.forEach(x=>{
      const el=$("edvNode_"+x.id); if(!el) return;
      if(correctSet.has(x.id)) el.classList.add("correct-node");
      else if((selected||[]).includes(x.id)) el.classList.add("wrong-node");
    });
  }

  function afterEdvMultiSubmit(need){
    state.current=Math.min(state.quiz.length-1,state.current+need-1);
    if(state.current<state.quiz.length-1) nextQuestion(); else showResult();
  }

  function recordEdvMultiAnswers(selected){
    return recordEdvMultiAnswersInternal(selected);
  }

  function recordEdvMultiAnswersInternal(selected){
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
    return simulationHostCall("renderRouteSequenceAnswers", [q], function(){
      return renderRouteSequenceAnswersInternal(q);
    });
  }

  function renderRouteSequenceAnswersInternal(q) {
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
          ${(q.routeOptions||q.a).map(street=>`<button type="button" class="answer-card ${selected.includes(street)?"used":""}" data-route-street="${escHTML(street)}">${escHTML(street)}</button>`).join("")}
        </div>
        <div class="route-action-row">
          <button type="button" class="btn btn-secondary" data-action="route-clear">Auswahl leeren</button>
          <button type="button" class="btn btn-secondary" data-action="route-undo">Letzte entfernen</button>
          <button type="button" class="btn btn-primary" data-action="route-submit">Gesamtantwort werten</button>
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
    return simulationHostCall("selectRouteStreet", [street], function(){
      return selectRouteStreetInternal(street);
    });
  }

  function undoRouteStreet() {
    return simulationHostCall("undoRouteStreet", [], function(){
      return undoRouteStreetInternal();
    });
  }

  function clearRouteSelection() {
    return simulationHostCall("clearRouteSelection", [], function(){
      return clearRouteSelectionInternal();
    });
  }

  function submitRouteSequence() {
    return simulationHostCall("submitRouteSequence", [], function(){
      return submitRouteSequenceInternal();
    });
  }

  function selectRouteStreetInternal(street) {
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

  function undoRouteStreetInternal() {
    const q=state.quiz[state.current];
    if(!q || q.type!=="routeMemory" || state.history[state.current]) return;
    MultiChoiceModule.undo(q,"routeSelected");
    renderRouteSequenceAnswers(q);
  }

  function clearRouteSelectionInternal() {
    const q=state.quiz[state.current];
    if(!q || q.type!=="routeMemory" || state.history[state.current]) return;
    MultiChoiceModule.clear(q,"routeSelected");
    renderRouteSequenceAnswers(q);
  }

  function submitRouteSequenceInternal() {
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

  function chooseAnswerInternal(idx,btn) {
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
  function recordAnswerInternal(given, correct, timeout) {
    const q=state.quiz[state.current], ended=new Date(), prev=state.history[state.current];
    const duration=(prev?prev.duration:0)+(state.questionStartedAt?ended-state.questionStartedAt:0);
    state.history[state.current]={q:q.q,cat:q.cat,group:q.group||groupFor(q.cat),block:q.block||"",answers:q.a,correctIndex:q.correct,givenIndex:given,correct,timeout,skipped:given===null&&!timeout,explanation:q.ex||"",visualType:q.type||"mc",duration,allowed:state.totalTimeForQuestion,
      examMode:{...state.exam}};
    state.questionStates[state.current]=state.markedQuestions[state.current]?"mark":(given===null?"skip":"done");
    try {
      if(window.EGTResultPersistenceEngine && typeof EGTResultPersistenceEngine.recordAnswerAttempt === "function") {
        EGTResultPersistenceEngine.recordAnswerAttempt(resultPersistenceContext({
          question:q,
          historyItem:state.history[state.current]
        }));
        return;
      }
    } catch (e) {
      console.warn("ResultPersistence answer hook fallback", e);
    }
    try {
      if (window.EGTLearningCoach && typeof window.EGTLearningCoach.onAnswerRecorded === "function") {
        window.EGTLearningCoach.onAnswerRecorded(state.history[state.current], q);
      }
      try { if(window.EGTCoachDNA && !activeLearnerNeedsPasswordChange()) window.EGTCoachDNA.recordAttempt(Object.assign({}, state.history[state.current]||{}, {mode:state.selectedMode, userId:activeLearnerId()})); } catch(e) {}
    } catch (e) {
      console.warn("Coach answer hook failed", e);
    }
  }
  function nextQuestionInternal() {
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
  function spQuestionInternal(){clearInterval(state.timer); if(!state.history[state.current])recordAnswer(null,false,false); state.questionStates[state.current]="skip"; updateQuestionNav(); nextQuestion();}
  function skipQuestionInternal(){
    const q=state.quiz[state.current];
    if(q && q.type==="edvmulti") {
      const fb=$("feedback");
      if(fb){fb.innerHTML="<b>EDV-Block:</b> Bitte die Gesamt-EDV-Aufgabe werten. Offene Auswahl wird sonst als 0/11 gezählt."; fb.classList.remove("hidden");}
      return;
    }
    if(q && q.type==="ctcFlowLogic") {
      const fb=$("feedback");
      if(fb){fb.innerHTML="<b>CTC-Logik:</b> Diese 13-Minuten-Aufgabe muss über „Ablaufplan werten“ abgeschlossen werden."; fb.classList.remove("hidden");}
      return;
    }
    if(q && (q.type==="ctcRuleArithmeticInput" || q.type==="ctcLetterScanInput" || q.type==="ctcCoordinateTableInput" || q.type==="ctcNumberSeriesInput")) { submitCtcLohrInputAnswer(true); return; }
    spQuestion();
  }
  function manualNextQuestionInternal(){
    const q=state.quiz[state.current];
    if(q && q.type==="edvmulti") { submitEdvMultiAnswer(); return; }
    if(q && q.type==="ctcFlowLogic") { submitCtcFlowLogicAnswer(); return; }
    if(q && (q.type==="ctcRuleArithmeticInput" || q.type==="ctcLetterScanInput" || q.type==="ctcCoordinateTableInput" || q.type==="ctcNumberSeriesInput")) { submitCtcLohrInputAnswer(); return; }
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

  function setQuestionDrawer(open){
    try {
      document.body.classList.toggle("qnav-drawer-open", !!open);
      const nav=$("questionNav");
      if(nav) nav.classList.toggle("is-open", !!open);
      const btn=$("qnavDrawerToggle");
      if(btn){
        btn.setAttribute("aria-expanded", open ? "true" : "false");
        btn.innerHTML = "";
      }
    } catch(e) {}
  }
  function toggleQuestionDrawer(){
    const open=!document.body.classList.contains("qnav-drawer-open");
    setQuestionDrawer(open);
  }
  function ensureQuestionDrawerToggle(){
    const quizEl=$("quiz");
    if(!quizEl) return;
    let btn=$("qnavDrawerToggle");
    if(!btn){
      btn=document.createElement("button");
      btn.type="button";
      btn.id="qnavDrawerToggle";
      btn.className="qnav-drawer-toggle";
      btn.setAttribute("data-action","qnav-toggle");
      btn.setAttribute("aria-controls","questionNav");
      btn.setAttribute("aria-expanded","false");
      btn.innerHTML="";
      // An body anhängen (nicht an #quiz), damit position:fixed zuverlässig
      // zum Viewport rechnet und der Button auf iOS nicht aus dem Bild rutscht.
      document.body.appendChild(btn);
    } else if(btn.parentElement !== document.body){
      document.body.appendChild(btn);
    }
  }
  function prevQuestionInternal(){if(state.exam.lockBack){showExamLockNotice();return;} if(state.current>0){clearInterval(state.timer); state.current--; showQuestion();}}
  function jumpToQuestionInternal(i){if(state.exam.lockBack && i<state.current){showExamLockNotice();return;} if(i<0||i>=state.quiz.length)return; clearInterval(state.timer); if(i!==state.current&&!state.history[state.current]){recordAnswer(null,false,false); state.questionStates[state.current]="skip";} qnavManualPage=null; state.current=i; showQuestion();}
  function toggleMarkQuestionInternal(){state.markedQuestions[state.current]=!state.markedQuestions[state.current]; state.questionStates[state.current]=state.markedQuestions[state.current]?"mark":(state.history[state.current]?"done":"open"); updateQuestionNav();}
  let qnavManualPage = null; // Legacy-Fallback: null = Seite folgt automatisch der aktuellen Frage
  function updateQuestionNav() {
    return simulationHostCall("updateQuestionNav", [], function(){ return updateQuestionNavInternal(); });
  }
  function updateQuestionNavInternal() {
    const total=isAdaptiveElite()?MODES.ctc.amount:state.quiz.length;
    const nav=$("questionNav");
    ensureQuestionDrawerToggle();
    nav.classList.add("qnav-drawer");
    nav.setAttribute("aria-label", "Frageübersicht");
    nav.innerHTML="";
    const PER_PAGE=30;
    const pages=Math.max(1, Math.ceil(total/PER_PAGE));
    let page = qnavManualPage !== null ? qnavManualPage : Math.floor(state.current/PER_PAGE);
    if(page>=pages) page=pages-1;
    if(page<0) page=0;
    // WICHTIG: #questionNav ist in mehreren CSS-Varianten ein Grid (5 Spalten).
    // Daher werden Dots als DIREKTE Kinder gerendert (alle bestehenden Styles greifen)
    // und die Seitenleiste belegt per grid-column:1/-1 eine volle Zeile.
    if(pages>1){
      const bar=document.createElement("div");
      bar.className="qnav-pages";
      for(let p=0;p<pages;p++){
        const b=document.createElement("button");
        b.type="button";
        b.className="qnav-page-btn"+(p===page?" active":"");
        const from=p*PER_PAGE+1, to=Math.min(total,(p+1)*PER_PAGE);
        b.textContent=`${from}–${to}`;
        b.title=`Fragen ${from} bis ${to} anzeigen`;
        b.onclick=()=>{ qnavManualPage=p; updateQuestionNav(); };
        bar.appendChild(b);
      }
      nav.appendChild(bar);
    }
    const start=page*PER_PAGE, end=Math.min(total,start+PER_PAGE);
    for(let i=start;i<end;i++){const d=document.createElement("div"); let st=state.questionStates[i]||(state.history[i]?"done":"open"); if(state.markedQuestions[i])st="mark"; d.className="progress-dot "+st+(i===state.current?" current":""); d.textContent=i+1; d.title=`Aufgabe ${i+1}: ${st}`; if(i<state.quiz.length)d.onclick=()=>{ setQuestionDrawer(false); jumpToQuestion(i); }; nav.appendChild(d);}
  }

  // G52.6 Phase 20: öffentliche Quiz-/Question-Control-Aufrufe laufen über die QuestionFlowEngine.
  // Die schweren Renderer bleiben vorerst als Internal-Adapter erhalten, damit die UI-Stabilität aus G51.x nicht riskiert wird.
  function showQuestion(spIntro=false){ return QuestionFlowEngine.showQuestion(!!spIntro); }
  function tickTimer(){ return QuestionFlowEngine.tickTimer(); }
  function pauseTimer(){ return QuestionFlowEngine.pauseTimer(); }
  function resumeTimer(){ return QuestionFlowEngine.resumeTimer(); }
  function nextBlockIndex(from){ return QuestionFlowEngine.nextBlockIndex(from); }
  function chooseAnswer(idx,btn){ return QuestionFlowEngine.chooseAnswer(idx,btn); }
  function recordAnswer(given,correct,timeout){ return QuestionFlowEngine.recordAnswer(given,correct,timeout); }
  function nextQuestion(){ return QuestionFlowEngine.nextQuestion(); }
  function spQuestion(){ return QuestionFlowEngine.spQuestion(); }
  function skipQuestion(){ return QuestionFlowEngine.skipQuestion(); }
  function manualNextQuestion(){ return QuestionFlowEngine.manualNextQuestion(); }
  function prevQuestion(){ return QuestionFlowEngine.prevQuestion(); }
  function jumpToQuestion(i){ return QuestionFlowEngine.jumpToQuestion(i); }
  function toggleMarkQuestion(){ return QuestionFlowEngine.toggleMarkQuestion(); }

  // Gemeinsamer SVG-Zahnkranz-Helfer. Früher nur im "gear"-Zweig deklariert,
  // wurde aber auch von gearsPro/Visual-IQ-Szenen aufgerufen → Laufzeit-Crash
  // ("gearPath is not a function"), da die Blockdeklaration dort nie ausgeführt war.
  function gearPath(cx,cy,r,teeth,tooth){
    teeth = teeth || 16; tooth = tooth || 8;
    let d='';
    for(let k=0;k<teeth*2;k++){
      const ang=(-Math.PI/2)+(k*Math.PI/teeth), rr=k%2===0?r+tooth:r,
            px=cx+Math.cos(ang)*rr, py=cy+Math.sin(ang)*rr;
      d+=(k===0?'M ':' L ')+px.toFixed(1)+' '+py.toFixed(1);
    }
    return d+' Z';
  }

  function flowLogicAnswerText(answer){
    if(!answer) return "";
    return `Raster ${answer.grid || "?"} · ${answer.category || "?"} · ${answer.errorType || "?"} · ${answer.fixCode || "?"}`;
  }

  function renderCtcFlowLogic(q) {
    const v=$("visual");
    if(!v) return;
    try {
      if(window.CTCFlowLogicAdapter && typeof CTCFlowLogicAdapter.renderTo === "function") {
        CTCFlowLogicAdapter.renderTo(v, q, { mode:"ctc-simulation" });
        if(state.history[state.current]) {
          v.classList.add("ctc-flowlogic-locked");
        } else {
          v.classList.remove("ctc-flowlogic-locked");
        }
        return;
      }
      throw new Error("CTCFlowLogicAdapter fehlt.");
    } catch(error) {
      v.innerHTML = `<div class="visualBox"><b>CTC-Logik konnte nicht geladen werden.</b><br><span class="small">${escHTML(error && error.message ? error.message : error)}</span></div>`;
    }
  }

  function renderCtcFlowLogicAnswers(q) {
    const box=$("answers");
    if(!box) return false;
    const expected = Number(q?.flowLogicMeta?.expectedErrors || q?.flowLogicSession?.options?.maxAnswers || 11);
    const entered = (q && q.flowLogicSession && Array.isArray(q.flowLogicSession.answers)) ? q.flowLogicSession.answers.length : 0;
    const h = state.history[state.current];
    if(h) {
      const fl = h.flowLogicSummary || {};
      box.innerHTML = `<div class="ctc-flowlogic-submit-panel ctc-flowlogic-result-summary">
        <div><b>CTC-Logik ausgewertet</b><br><span class="small">${escHTML(h.explanation || "Ablaufplan wurde bewertet.")}</span></div>
        <span class="score-pill">${Number(fl.score || 0)} / ${Number(fl.maxScore || expected)} Punkte</span>
      </div>`;
      return true;
    }
    box.innerHTML = `<div class="ctc-flowlogic-submit-panel">
      <div><b>Fehler erst vollständig eintragen.</b><br><span class="small">Eingetragen: <b>${entered}/${expected}</b>. Bewertet werden Rasterfeld, Kategorie Form/Pfeil/Inhalt, Fehlertyp und Korrektur.</span></div>
      <button type="button" class="btn btn-primary" data-action="ctc-flowlogic-submit">Ablaufplan werten</button>
    </div>`;
    return true;
  }

  function submitCtcFlowLogicAnswer(force) {
    const q=state.quiz[state.current];
    if(!q || q.type!=="ctcFlowLogic" || state.history[state.current]) return;
    const session = q.flowLogicSession;
    const expected = Number(q?.flowLogicMeta?.expectedErrors || session?.options?.maxAnswers || 11);
    const entered = session && Array.isArray(session.answers) ? session.answers.length : 0;
    if(!force && entered < expected) {
      const fb=$("feedback");
      if(fb){ fb.innerHTML=`<b>Noch nicht vollständig.</b> Du hast ${entered}/${expected} Fehler eingetragen. Trage alle ${expected} Fehler ein oder warte bis die Zeit abläuft.`; fb.classList.remove("hidden"); }
      return;
    }
    clearInterval(state.timer);
    const ended=new Date(), prev=state.history[state.current];
    const duration=(prev?prev.duration:0)+(state.questionStartedAt?ended-state.questionStartedAt:0);
    let report={summary:{score:0,maxScore:expected,percentage:0,correct:0,partial:0,wrong:0,missed:expected}};
    try { if(window.CTCFlowLogicAdapter && typeof CTCFlowLogicAdapter.summaryFromSession === "function") report=CTCFlowLogicAdapter.summaryFromSession(session); } catch(e) {}
    const summary = report.summary || {};
    const scorePoints = Number(summary.score || 0);
    const maxPoints = Number(summary.maxScore || expected || 11);
    const percent = maxPoints ? Math.round((scorePoints / maxPoints) * 100) : 0;
    const correct = scorePoints >= maxPoints;
    const wasCorrect=state.history[state.current]?.correct===true;
    state.history[state.current]={
      q:q.q,
      cat:q.cat,
      group:q.group||groupFor(q.cat),
      block:q.block||"3. Logik",
      answers:(session && Array.isArray(session.answers) && session.answers.length ? session.answers.map(flowLogicAnswerText) : ["Keine vollständige Fehlerliste abgegeben"]),
      correctIndex:0,
      givenIndex:correct?0:null,
      correct:correct,
      timeout:force===true && entered < expected,
      skipped:false,
      explanation:`CTC-Logik: ${scorePoints}/${maxPoints} Punkte (${percent}%). Korrekt: ${Number(summary.correct||0)}, Teilpunkte: ${Number(summary.partial||0)}, falsch: ${Number(summary.wrong||0)}, verpasst: ${Number(summary.missed||0)}.`,
      visualType:"ctcFlowLogic",
      duration,
      allowed:state.totalTimeForQuestion,
      flowLogicSummary:{score:scorePoints,maxScore:maxPoints,percentage:percent,correct:Number(summary.correct||0),partial:Number(summary.partial||0),wrong:Number(summary.wrong||0),missed:Number(summary.missed||0)},
      flowLogicReport:report,
      examMode:{...state.exam}
    };
    if(correct && !wasCorrect) state.score++;
    if(!correct && wasCorrect) state.score=Math.max(0,state.score-1);
    state.questionStates[state.current]=state.markedQuestions[state.current]?"mark":"done";
    updateQuestionNav();
    renderCtcFlowLogicAnswers(q);
    const fb=$("feedback");
    if(fb){ fb.innerHTML=`<b>CTC-Logik ausgewertet.</b> ${scorePoints}/${maxPoints} Punkte (${percent}%).`; fb.classList.remove("hidden"); }
    setTimeout(()=>{ if(state.current<state.quiz.length-1 || isAdaptiveElite()) nextQuestion(); else showResult(); }, 1200);
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
    if(q.type==="ctcFlowLogic")renderCtcFlowLogic(q);
    if(q.type==="visual")renderMechanicVisual(q.visual);
    if(q.type==="visualIQ")renderVisualIQ(q.visualIQ);
    if(q.type==="imageTask" && q.imageSrc) v.innerHTML=`<div class="visualBox image-task-box"><img class="image-task-img" src="${escHTML(q.imageSrc)}" alt="${escHTML(q.imageAlt||q.cat||"Aufgabe")}" loading="lazy"></div>`;
  }

  function renderRouteMemory(q) {
    const v=$("visual"), route=q.routeStreets||[];
    const total=q.routeDuration||20;

    // Feste SVG-Punkte: alles bleibt garantiert im sichtbaren Bereich.
    // G51.3: Route-Memory darf keine horizontale Innen-Scrollbar erzeugen.
    // Die alte Punktreihe hatte bis zu 6 lange Straßennamen in einer Linie;
    // dadurch überlappten Labels und echte Geräte zeigten Scrollbalken.
    // Neues Raster: max. 4 Haltestellen pro Zeile, als Snake-Route.
    const buildRoutePoints = (count) => {
      const xs = [92, 276, 464, 648];
      const ys = [74, 174, 274];
      const out = [];
      for(let i=0;i<count;i++){
        const row = Math.floor(i / xs.length);
        const col = i % xs.length;
        const rowXs = row % 2 === 0 ? xs : xs.slice().reverse();
        out.push([rowXs[col], ys[Math.min(row, ys.length - 1)]]);
      }
      return out;
    };
    const points=buildRoutePoints(Math.max(1, route.length));
    const pathD=points.map((p,i)=>(i===0?`M ${p[0]} ${p[1]}`:`L ${p[0]} ${p[1]}`)).join(" ");

    const labelY = (i,p) => {
      if(p[1] <= 95) return p[1] + 34;
      if(p[1] >= 240) return p[1] - 22;
      return (i % 2 === 0) ? p[1] - 20 : p[1] + 31;
    };

    v.innerHTML=`<div class="route-scene" id="routeScene">
      <svg class="route-svg" viewBox="0 0 740 330" preserveAspectRatio="xMidYMid meet">
        <path class="route-road-casing" d="${pathD}"></path>
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
        if(state.quiz[state.current] === q && !state.history[state.current]) {
          renderAnswers(q);
        }
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
      x.labels.forEach((lab,i)=>{const cx=startX+i*gap; h+=`<path d="${gearPath(cx,y,28)}" class="visual-iq-light"/><circle cx="${cx}" cy="${y}" r="18" fill="#0b1730" stroke="#94a3b8" stroke-width="2.5"/><circle cx="${cx}" cy="${y}" r="4" fill="#cbd5e1"/><text x="${cx}" y="32" text-anchor="middle" class="visual-iq-label">${lab}</text><text x="${cx}" y="104" text-anchor="middle" font-size="27" font-weight="900" fill="${x.shown[i]==='?'?'#94a3b8':'#fbbf24'}">${x.shown[i]}</text>`; if(i<x.labels.length-1){const nx=startX+(i+1)*gap; h+=`<line x1="${cx+38}" y1="${y}" x2="${nx-38}" y2="${y}" stroke="rgba(148,163,184,.55)" stroke-width="4" stroke-linecap="round" stroke-dasharray="2 7"/>`;}});
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
      v.innerHTML=`<div class="visual-iq-canvas"><div class="visual-iq-note"><b>Matrix:</b> Pro Zeile verändert sich Form, Füllung oder Rotation. Unten rechts fehlt das Ergebnis.</div><svg class="visual-iq-svg" viewBox="0 0 760 330"><g transform="translate(40,35)">${cell(0,0,tri)}${cell(85,0,cir)}${cell(170,0,sq)}${cell(0,85,cir)}${cell(85,85,sq)}${cell(170,85,tri)}${cell(0,170,sq)}${cell(85,170,tri)}${cell(170,170,'<text x="35" y="46" text-anchor="middle" font-size="34" font-weight="900">?</text>')}</g><g transform="translate(365,35)">${cell(0,0,cir+'<text x="35" y="-8" text-anchor="middle" class="visual-iq-label" font-size="16">A</text>')}${cell(95,0,tri+'<text x="35" y="-8" text-anchor="middle" class="visual-iq-label" font-size="16">B</text>')}${cell(0,95,sq+'<text x="35" y="-8" text-anchor="middle" class="visual-iq-label" font-size="16">C</text>')}${cell(95,95,cir.replace('visual-iq-light','visual-iq-dark')+'<text x="35" y="-8" text-anchor="middle" class="visual-iq-label" font-size="16">D</text>')}</g></svg></div>`;
    }
    if(x.nd==="circuit"){
      const open=x.scenario==="openSwitch";
      const short=x.scenario==="short";
      v.innerHTML=`<div class="visual-iq-canvas"><svg class="visual-iq-svg" viewBox="0 0 760 300"><text x="35" y="28" class="visual-iq-label">Stromlaufplan</text><line x1="70" y1="70" x2="70" y2="230" class="visual-iq-wire"/><line x1="70" y1="70" x2="660" y2="70" class="visual-iq-wire"/><line x1="70" y1="230" x2="660" y2="230" class="visual-iq-wire"/><line x1="660" y1="70" x2="660" y2="230" class="visual-iq-wire"/><rect x="45" y="125" width="50" height="50" rx="8" class="visual-iq-hot"/><text x="70" y="156" text-anchor="middle" class="visual-iq-label">+</text><line x1="205" y1="70" x2="205" y2="230" class="visual-iq-wire"/><line x1="420" y1="70" x2="420" y2="230" class="visual-iq-wire"/><circle cx="205" cy="150" r="28" class="visual-iq-light"/><text x="205" y="156" text-anchor="middle" class="visual-iq-label">L1</text><circle cx="420" cy="150" r="28" class="visual-iq-light"/><text x="420" y="156" text-anchor="middle" class="visual-iq-label">L2</text><line x1="285" y1="70" x2="335" y2="70" class="${open?'visual-iq-wire-off':'visual-iq-wire'}"/><text x="310" y="50" text-anchor="middle" class="visual-iq-muted">S1</text><line x1="505" y1="70" x2="555" y2="70" class="visual-iq-wire"/><text x="530" y="50" text-anchor="middle" class="visual-iq-muted">S2</text>${short?'<path d="M 175 150 C 190 105 225 105 235 150" class="visual-iq-wire"/><text x="205" y="110" text-anchor="middle" class="visual-iq-muted">Überbrückung</text>':''}</svg></div>`;
    }
    if(x.nd==="mechanics"){
      let svgContent = '';
      if(x.scenario==="lever"){
        svgContent = `<text x="380" y="28" text-anchor="middle" class="visual-iq-label">Hebelgesetz (Welche Seite sinkt nach unten?)</text>
        <line x1="160" y1="160" x2="600" y2="160" stroke="#cbd5e1" stroke-width="10" stroke-linecap="round"/>
        <polygon points="380,165 350,235 410,235" class="visual-iq-hot"/>
        <rect x="200" y="95" width="50" height="65" class="visual-iq-shape"/>
        <text x="225" y="85" text-anchor="middle" class="visual-iq-label">6 kg</text>
        <text x="225" y="135" text-anchor="middle" font-size="12" fill="#94a3b8">Abstand: 160cm</text>
        <rect x="460" y="80" width="50" height="80" class="visual-iq-shape"/>
        <text x="485" y="70" text-anchor="middle" class="visual-iq-label">12 kg</text>
        <text x="485" y="125" text-anchor="middle" font-size="12" fill="#94a3b8">Abstand: 100cm</text>
        <line x1="100" y1="235" x2="660" y2="235" stroke="#64748b" stroke-width="3"/>`;
      }
      else if(x.scenario==="pulley"){
        svgContent = `<text x="380" y="28" text-anchor="middle" class="visual-iq-label">Flaschenzug (Welches System benötigt weniger Kraft?)</text>
        <g transform="translate(100, 30)">
          <text x="100" y="25" text-anchor="middle" class="visual-iq-label">System A (Feste Rolle)</text>
          <line x1="50" y1="45" x2="150" y2="45" stroke="#cbd5e1" stroke-width="4"/>
          <circle cx="100" cy="95" r="25" class="visual-iq-light"/>
          <circle cx="100" cy="95" r="4" fill="#cbd5e1"/>
          <line x1="100" y1="45" x2="100" y2="70" stroke="#cbd5e1" stroke-width="3"/>
          <line x1="75" y1="95" x2="75" y2="200" stroke="#cbd5e1" stroke-width="2"/>
          <rect x="55" y="200" width="40" height="40" class="visual-iq-shape"/>
          <text x="75" y="225" text-anchor="middle" font-size="12" fill="#e2e8f0">10 kg</text>
          <line x1="125" y1="95" x2="125" y2="180" stroke="#cbd5e1" stroke-width="2"/>
          <path d="M125,180 L120,170 M125,180 L130,170" stroke="#cbd5e1" stroke-width="2"/>
          <text x="140" y="175" font-size="12" fill="#ef4444">Kraft F</text>
        </g>
        <g transform="translate(460, 30)">
          <text x="100" y="25" text-anchor="middle" class="visual-iq-label">System B (Lose + Feste Rolle)</text>
          <line x1="50" y1="45" x2="150" y2="45" stroke="#cbd5e1" stroke-width="4"/>
          <circle cx="120" cy="95" r="25" class="visual-iq-light"/>
          <circle cx="120" cy="95" r="4" fill="#cbd5e1"/>
          <line x1="120" y1="45" x2="120" y2="70" stroke="#cbd5e1" stroke-width="3"/>
          <circle cx="70" cy="175" r="25" class="visual-iq-light"/>
          <circle cx="70" cy="175" r="4" fill="#cbd5e1"/>
          <line x1="70" y1="200" x2="70" y2="215" stroke="#cbd5e1" stroke-width="3"/>
          <rect x="50" y="215" width="40" height="35" class="visual-iq-shape"/>
          <text x="70" y="238" text-anchor="middle" font-size="12" fill="#e2e8f0">10 kg</text>
          <line x1="45" y1="45" x2="45" y2="175" stroke="#cbd5e1" stroke-width="2"/>
          <path d="M45,175 A25,25 0 0,0 95,175" fill="none" stroke="#cbd5e1" stroke-width="2"/>
          <line x1="95" y1="175" x2="95" y2="95" stroke="#cbd5e1" stroke-width="2"/>
          <path d="M95,95 A25,25 0 0,1 145,95" fill="none" stroke="#cbd5e1" stroke-width="2"/>
          <line x1="145" y1="95" x2="145" y2="180" stroke="#cbd5e1" stroke-width="2"/>
          <path d="M145,180 L140,170 M145,180 L150,170" stroke="#cbd5e1" stroke-width="2"/>
          <text x="160" y="175" font-size="12" fill="#22c55e">Kraft F/2</text>
        </g>`;
      }
      else if(x.scenario==="water"){
        svgContent = `<text x="380" y="28" text-anchor="middle" class="visual-iq-label">Flüssigkeitssystem (Welcher Behälter füllt sich zuerst?)</text>
        <rect x="330" y="50" width="100" height="90" fill="none" stroke="#cbd5e1" stroke-width="3"/>
        <text x="380" y="100" text-anchor="middle" font-size="12" fill="#0284c7">Zulauf</text>
        <path d="M380,40 L380,75" stroke="#0284c7" stroke-width="6" stroke-dasharray="4 4"/>
        <path d="M330,90 L260,90 L260,180" fill="none" stroke="#cbd5e1" stroke-width="8" stroke-linejoin="round"/>
        <path d="M430,130 L500,130 L500,180" fill="none" stroke="#cbd5e1" stroke-width="8" stroke-linejoin="round"/>
        <rect x="210" y="180" width="100" height="80" fill="none" stroke="#cbd5e1" stroke-width="3"/>
        <text x="260" y="225" text-anchor="middle" class="visual-iq-label">Behälter 1</text>
        <rect x="450" y="180" width="100" height="80" fill="none" stroke="#cbd5e1" stroke-width="3"/>
        <text x="500" y="225" text-anchor="middle" class="visual-iq-label">Behälter 2</text>
        <text x="380" y="285" text-anchor="middle" class="visual-iq-muted">Beachte die Höhe der Abzweigungen an den Seitenwänden des Haupttanks.</text>`;
      }
      else {
        svgContent = `<text x="380" y="28" text-anchor="middle" class="visual-iq-label">Schiefe Ebene (Welcher Zylinder rollt schneller?)</text>
        <g transform="translate(80, 50)">
          <text x="120" y="25" text-anchor="middle" class="visual-iq-label">Ebene A (Glatte Oberfläche)</text>
          <polygon points="40,180 240,180 40,80" fill="none" stroke="#cbd5e1" stroke-width="4" stroke-linejoin="round"/>
          <circle cx="100" cy="110" r="22" class="visual-iq-light"/>
          <text x="100" y="115" text-anchor="middle" font-size="10" fill="#e2e8f0">glatt</text>
        </g>
        <g transform="translate(440, 50)">
          <text x="120" y="25" text-anchor="middle" class="visual-iq-label">Ebene B (Raue Oberfläche / Widerstand)</text>
          <polygon points="40,180 240,180 40,80" fill="none" stroke="#cbd5e1" stroke-width="4" stroke-linejoin="round"/>
          <circle cx="100" cy="110" r="22" class="visual-iq-light" stroke-dasharray="4 3"/>
          <text x="100" y="115" text-anchor="middle" font-size="10" fill="#e2e8f0">rau</text>
        </g>`;
      }
      v.innerHTML=`<div class="visual-iq-canvas"><svg class="visual-iq-svg" viewBox="0 0 760 300">${svgContent}</svg></div>`;
    }
    if(x.nd==="technical"){
      let svgContent = '';
      if(x.scenario==="pressure"){
        svgContent = `<text x="380" y="28" text-anchor="middle" class="visual-iq-label">Hydrostatischer Druck (Wo ist er am größten?)</text>
        <rect x="280" y="60" width="200" height="180" fill="#eff6ff" stroke="#111827" stroke-width="4"/>
        <line x1="280" y1="80" x2="480" y2="80" stroke="#60a5fa" stroke-width="4"/>
        <circle cx="380" cy="100" r="10" class="visual-iq-dark"/>
        <text x="405" y="105" class="visual-iq-label">Punkt A</text>
        <circle cx="380" cy="150" r="10" class="visual-iq-dark"/>
        <text x="405" y="155" class="visual-iq-label">Punkt B</text>
        <circle cx="380" cy="210" r="10" class="visual-iq-dark"/>
        <text x="405" y="215" class="visual-iq-label">Punkt C</text>
        <text x="380" y="275" text-anchor="middle" class="visual-iq-muted">Der Druck in einer Flüssigkeit hängt von der Tiefe der Wassersäule ab.</text>`;
      }
      else if(x.scenario==="support"){
        svgContent = `<text x="380" y="28" text-anchor="middle" class="visual-iq-label">Fachwerk & Statik (Welche Form verzieht sich nicht?)</text>
        <g transform="translate(140, 60)">
          <text x="80" y="20" text-anchor="middle" class="visual-iq-label">Konstruktion A (Dreieck)</text>
          <polygon points="80,50 10,170 150,170" fill="none" stroke="#cbd5e1" stroke-width="6"/>
          <line x1="10" y1="170" x2="150" y2="170" stroke="#cbd5e1" stroke-width="6"/>
        </g>
        <g transform="translate(460, 60)">
          <text x="80" y="20" text-anchor="middle" class="visual-iq-label">Konstruktion B (Rechteck)</text>
          <rect x="15" y="50" width="130" height="120" fill="none" stroke="#cbd5e1" stroke-width="6"/>
          <path d="M15,50 L-10,50" stroke="#ef4444" stroke-width="3" fill="none"/>
          <path d="M15,50 L5,45 M15,50 L5,55" stroke="#ef4444" stroke-width="3"/>
          <text x="-15" y="40" font-size="11" fill="#ef4444">Schubkraft</text>
        </g>`;
      }
      else if(x.scenario==="block"){
        svgContent = `<text x="380" y="28" text-anchor="middle" class="visual-iq-label">Mechanische Blockade (Welches Bauteil verhindert die Bewegung?)</text>
        <rect x="150" y="120" width="460" height="60" fill="#f1f5f9" stroke="#94a3b8" stroke-width="3"/>
        <rect x="180" y="130" width="80" height="40" class="visual-iq-light"/>
        <text x="220" y="155" text-anchor="middle" class="visual-iq-label">A</text>
        <rect x="290" y="130" width="80" height="40" class="visual-iq-light"/>
        <text x="330" y="155" text-anchor="middle" class="visual-iq-label">B</text>
        <rect x="420" y="90" width="30" height="120" class="visual-iq-dark"/>
        <text x="435" y="155" text-anchor="middle" fill="#fff" font-weight="bold">C</text>
        <text x="380" y="260" text-anchor="middle" class="visual-iq-muted">Bauteil C ist fest montiert und sperrt den Führungskanal.</text>`;
      }
      else if(x.scenario==="drive"){
        svgContent = `<text x="380" y="28" text-anchor="middle" class="visual-iq-label">Riemenantrieb (Welche Scheibe dreht sich am schnellsten?)</text>
        <circle cx="160" cy="150" r="50" class="visual-iq-light"/>
        <circle cx="160" cy="150" r="8" fill="#111827"/>
        <text x="160" y="220" text-anchor="middle" class="visual-iq-label">Scheibe A (Groß)</text>
        <circle cx="380" cy="150" r="32" class="visual-iq-light"/>
        <circle cx="380" cy="150" r="6" fill="#111827"/>
        <text x="380" y="202" text-anchor="middle" class="visual-iq-label">Scheibe B (Mittel)</text>
        <circle cx="580" cy="150" r="18" class="visual-iq-light"/>
        <circle cx="580" cy="150" r="4" fill="#111827"/>
        <text x="580" y="188" text-anchor="middle" class="visual-iq-label">Scheibe C (Klein)</text>
        <line x1="160" y1="100" x2="580" y2="132" stroke="#cbd5e1" stroke-width="4"/>
        <line x1="160" y1="200" x2="580" y2="168" stroke="#cbd5e1" stroke-width="4"/>
        <text x="380" y="265" text-anchor="middle" class="visual-iq-muted">Alle Scheiben sind über denselben Riemen verbunden und haben dieselbe Umfangsgeschwindigkeit.</text>`;
      }
      else if(x.scenario==="lever"){
        svgContent = `<text x="380" y="28" text-anchor="middle" class="visual-iq-label">Hebelarm (Wo ist die benötigte Kraft am geringsten?)</text>
        <rect x="80" y="80" width="20" height="140" fill="#64748b"/>
        <circle cx="100" cy="150" r="12" class="visual-iq-dark"/>
        <rect x="100" y="145" width="480" height="10" fill="#111827"/>
        <circle cx="220" cy="150" r="10" class="visual-iq-hot"/>
        <text x="220" y="130" text-anchor="middle" class="visual-iq-label">A</text>
        <circle cx="380" cy="150" r="10" class="visual-iq-hot"/>
        <text x="380" y="130" text-anchor="middle" class="visual-iq-label">B</text>
        <circle cx="540" cy="150" r="10" class="visual-iq-hot"/>
        <text x="540" y="130" text-anchor="middle" class="visual-iq-label">C</text>
        <rect x="580" y="125" width="40" height="40" class="visual-iq-shape"/>
        <text x="600" y="115" text-anchor="middle" font-size="11">Last</text>
        <text x="380" y="255" text-anchor="middle" class="visual-iq-muted">Je größer der Abstand zum Drehpunkt (Hebelarm), desto weniger Kraft ist nötig.</text>`;
      }
      else if(x.scenario==="gearRatio"){
        svgContent = `<text x="380" y="28" text-anchor="middle" class="visual-iq-label">Zahnradübersetzung (Drehzahlverhältnis)</text>
        <g transform="translate(240, 150)">
          <path d="${gearPath(240,150,50,24)}" class="visual-iq-light"/>
          <circle cx="240" cy="150" r="15" fill="#fff" stroke="#111827" stroke-width="2"/>
          <text x="240" y="155" text-anchor="middle" class="visual-iq-label">A (24 Zähne)</text>
        </g>
        <g transform="translate(440, 150)">
          <path d="${gearPath(440,150,17,8)}" class="visual-iq-light"/>
          <circle cx="440" cy="150" r="8" fill="#fff" stroke="#111827" stroke-width="2"/>
          <text x="440" y="178" text-anchor="middle" class="visual-iq-label">B (8 Zähne)</text>
        </g>
        <text x="380" y="265" text-anchor="middle" class="visual-iq-muted">Zahnrad A treibt Zahnrad B an. Das Umdrehungsverhältnis verhält sich umgekehrt proportional zur Zähnezahl.</text>`;
      }
      else if(x.scenario==="incline"){
        svgContent = `<text x="380" y="28" text-anchor="middle" class="visual-iq-label">Schiefe Ebene (Welche Rampe erfordert am wenigsten Kraft?)</text>
        <g transform="translate(100, 50)">
          <text x="100" y="25" text-anchor="middle" class="visual-iq-label">Rampe A (Kurz & Steil)</text>
          <polygon points="20,180 140,180 20,80" fill="none" stroke="#cbd5e1" stroke-width="4"/>
          <rect x="50" y="110" width="30" height="30" class="visual-iq-shape" transform="rotate(-40, 65, 125)"/>
        </g>
        <g transform="translate(420, 50)">
          <text x="120" y="25" text-anchor="middle" class="visual-iq-label">Rampe B (Lang & Flach)</text>
          <polygon points="20,180 220,180 20,110" fill="none" stroke="#cbd5e1" stroke-width="4"/>
          <rect x="90" y="125" width="30" height="30" class="visual-iq-shape" transform="rotate(-18, 105, 140)"/>
        </g>`;
      }
      else {
        svgContent = `<text x="380" y="28" text-anchor="middle" class="visual-iq-label">Flaschenzug (Kraftübersetzung)</text>
        <line x1="280" y1="60" x2="480" y2="60" stroke="#cbd5e1" stroke-width="5"/>
        <circle cx="350" cy="110" r="30" class="visual-iq-light"/>
        <circle cx="350" cy="110" r="5" fill="#111827"/>
        <line x1="350" y1="60" x2="350" y2="80" stroke="#cbd5e1" stroke-width="4"/>
        <circle cx="410" cy="190" r="30" class="visual-iq-light"/>
        <circle cx="410" cy="190" r="5" fill="#111827"/>
        <line x1="410" y1="220" x2="410" y2="240" stroke="#cbd5e1" stroke-width="4"/>
        <rect x="375" y="240" width="70" height="40" class="visual-iq-shape"/>
        <text x="410" y="265" text-anchor="middle" class="visual-iq-label">Last (50 kg)</text>
        <line x1="440" y1="60" x2="440" y2="190" stroke="#cbd5e1" stroke-width="2"/>
        <path d="M440,190 A30,30 0 0,1 380,190" fill="none" stroke="#cbd5e1" stroke-width="2"/>
        <line x1="380" y1="190" x2="380" y2="110" stroke="#cbd5e1" stroke-width="2"/>
        <path d="M380,110 A30,30 0 0,1 320,110" fill="none" stroke="#cbd5e1" stroke-width="2"/>
        <line x1="320" y1="110" x2="320" y2="210" stroke="#cbd5e1" stroke-width="2"/>
        <path d="M320,210 L315,200 M320,210 L325,200" stroke="#cbd5e1" stroke-width="2"/>
        <text x="300" y="200" class="visual-iq-label" fill="#22c55e">Zugkraft</text>`;
      }
      v.innerHTML=`<div class="visual-iq-canvas"><svg class="visual-iq-svg" viewBox="0 0 760 300">${svgContent}</svg></div>`;
    }
  }

  function renderMechanicVisual(x) {
    const v=$("visual");
    if(x.nd==="gear"){
      // Greifende Zahnräder: Räder berühren sich (kein irreführender Verbindungsstrich),
      // Dark-Theme-Farben, sichtbare Labels und Drehrichtungspfeile.
      const count=x.labels.length, R=30, TOOTH=8;
      const step=2*R+TOOTH+4; // Zahnkränze greifen ineinander
      const startX=70, y=96, W=Math.max(360,startX*2+(count-1)*step);
      let h=`<div class="visualBox"><svg width="100%" viewBox="0 0 ${W} 185" preserveAspectRatio="xMidYMid meet" style="max-width:${W}px">`;
      x.labels.forEach((lab,i)=>{
        const cx=startX+i*step, mark=x.dirs[i], isFirst=i===0;
        h+=`<path d="${gearPath(cx,y,R,16)}" fill="${isFirst?'rgba(56,189,248,.20)':'#1e293b'}" stroke="${isFirst?'#38bdf8':'#cbd5e1'}" stroke-width="2.5" stroke-linejoin="round"/>
            <circle cx="${cx}" cy="${y}" r="${R-11}" fill="#0b1730" stroke="${isFirst?'#38bdf8':'#94a3b8'}" stroke-width="2"/>
            <circle cx="${cx}" cy="${y}" r="5" fill="${isFirst?'#38bdf8':'#cbd5e1'}"/>
            <text x="${cx}" y="30" text-anchor="middle" font-size="19" font-weight="900" fill="#f8fafc">${lab}</text>
            <text x="${cx}" y="${y+R+TOOTH+26}" text-anchor="middle" font-size="22" font-weight="900" fill="${mark==='?'?'#94a3b8':'#fbbf24'}">${mark}</text>`;
      });
      v.innerHTML=h+'</svg></div>';
    }
    if(x.nd==="belt"){
      // Kettentrieb: deutlich sichtbare Kette (Tangenten mit Gliederoptik),
      // gezahnte Räder, Drehrichtungspfeile und Durchmesser-Beschriftung.
      const rBig=Math.min(58,Math.max(40,x.big*0.85)), rSmall=Math.max(20,Math.min(34,x.small*0.95));
      const cxS=110, cxB=320, cy=98;
      function ring(cx,r,hl){
        let teeth='';
        const n=Math.max(10,Math.round(r/3.2));
        for(let k=0;k<n;k++){const a=k/n*2*Math.PI, x1=cx+Math.cos(a)*(r-2), y1=cy+Math.sin(a)*(r-2), x2=cx+Math.cos(a)*(r+5), y2=cy+Math.sin(a)*(r+5);
          teeth+=`<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="#cbd5e1" stroke-width="3" stroke-linecap="round"/>`;}
        return `${teeth}<circle cx="${cx}" cy="${cy}" r="${r}" fill="#1e293b" stroke="${hl?'#38bdf8':'#cbd5e1'}" stroke-width="3"/><circle cx="${cx}" cy="${cy}" r="${Math.max(8,r*0.34)}" fill="#0b1730" stroke="#94a3b8" stroke-width="2"/><circle cx="${cx}" cy="${cy}" r="4.5" fill="#cbd5e1"/>`;
      }
      const chain=`<line x1="${cxS}" y1="${cy-rSmall-5}" x2="${cxB}" y2="${cy-rBig-5}" stroke="#0b1730" stroke-width="9" stroke-linecap="round"/>
        <line x1="${cxS}" y1="${cy-rSmall-5}" x2="${cxB}" y2="${cy-rBig-5}" stroke="#38bdf8" stroke-width="5" stroke-linecap="round" stroke-dasharray="7 6"/>
        <line x1="${cxS}" y1="${cy+rSmall+5}" x2="${cxB}" y2="${cy+rBig+5}" stroke="#0b1730" stroke-width="9" stroke-linecap="round"/>
        <line x1="${cxS}" y1="${cy+rSmall+5}" x2="${cxB}" y2="${cy+rBig+5}" stroke="#38bdf8" stroke-width="5" stroke-linecap="round" stroke-dasharray="7 6"/>`;
      const arrows=`<path d="M ${cxB-14} ${cy-rBig-22} a ${rBig+16} ${rBig+16} 0 0 1 30 8" fill="none" stroke="#fbbf24" stroke-width="3" stroke-linecap="round" marker-end="url(#beltArrow)"/>
        <text x="${(cxS+cxB)/2}" y="${cy-rBig-26}" text-anchor="middle" font-size="13" font-weight="800" fill="#7dd3fc">Kette</text>`;
      v.innerHTML=`<div class="visualBox"><svg width="100%" viewBox="0 0 430 210" preserveAspectRatio="xMidYMid meet" style="max-width:480px">
        <defs><marker id="beltArrow" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill="#fbbf24"/></marker></defs>
        ${chain}${ring(cxS,rSmall,false)}${ring(cxB,rBig,false)}${arrows}
        <text x="${cxS}" y="${cy+rSmall+38}" text-anchor="middle" font-size="14" font-weight="800" fill="#f8fafc">kleines Rad</text>
        <text x="${cxS}" y="${cy+rSmall+56}" text-anchor="middle" font-size="13" font-weight="700" fill="#94a3b8">⌀ ${x.small} cm</text>
        <text x="${cxB}" y="${cy+rBig+38}" text-anchor="middle" font-size="14" font-weight="800" fill="#f8fafc">großes Rad (Antrieb)</text>
        <text x="${cxB}" y="${cy+rBig+56}" text-anchor="middle" font-size="13" font-weight="700" fill="#94a3b8">⌀ ${x.big} cm</text>
      </svg></div>`;
    }
    if(x.nd==="blocks"){
      let cells=[];
      x.shape.grid.forEach((row,r)=>row.forEach((c,col)=>{if(c)cells.push([col,r])}));
      const svgCubes = cells.map(p=>{
        const col=p[0], r=p[1];
        const cx = 140 + (col - r) * 30;
        const cy = 90 + (col + r) * 15;
        return `<g class="iso-cube">
          <polygon points="${cx-30},${cy-5} ${cx},${cy+10} ${cx},${cy+40} ${cx-30},${cy+25}" fill="#cbd5e1" stroke="#111827" stroke-width="2" stroke-linejoin="round"/>
          <polygon points="${cx},${cy+10} ${cx+30},${cy-5} ${cx+30},${cy+25} ${cx},${cy+40}" fill="#94a3b8" stroke="#cbd5e1" stroke-width="2" stroke-linejoin="round"/>
          <polygon points="${cx},${cy-20} ${cx+30},${cy-5} ${cx},${cy+10} ${cx-30},${cy-5}" fill="#f8fafc" stroke="#111827" stroke-width="2" stroke-linejoin="round"/>
        </g>`;
      }).join("");
      v.innerHTML=`<div class="visualBox"><svg width="280" height="210" viewBox="0 0 280 210">${svgCubes}</svg></div>`;
    }
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
  function resultReviewContext(extra) {
    return Object.assign({
      state,
      history: state.history,
      selectedMode: state.selectedMode,
      modes: MODES,
      formatTime,
      formatDuration,
      adaptiveElite: isAdaptiveElite()
    }, extra || {});
  }

  function showResultLegacy() {
    if(state.duel){ return showDuellResult(); }
    clearInterval(state.timer); clearRouteTimers(); finalizeOpenAnswers();
    state.testEnd=new Date(); showOnly("result");
    let resultPacket=null;
    try{
      if(window.EGTSimulation && typeof window.EGTSimulation.prepareResult === "function") {
        resultPacket = window.EGTSimulation.prepareResult({ state, mode: state.selectedMode });
      }
    }catch(e){ console.warn("EGTSimulation.prepareResult fallback", e); }
    if(resultPacket && resultPacket.summary) {
      state.score = resultPacket.summary.score;
      $("resultText").innerHTML = resultPacket.html;
      try{ if(window.EGTSimulation && typeof window.EGTSimulation.finish === "function") window.EGTSimulation.finish(Object.assign({ total: state.quiz.length }, resultPacket.summary)); }catch(e){}
      var total=resultPacket.summary.total, percent=resultPacket.summary.percent, dur=resultPacket.summary.duration, avg=resultPacket.summary.avg;
    } else {
      var summary=null;
      try{
        if(window.EGTResultReviewEngine && typeof EGTResultReviewEngine.buildSummary === "function") {
          summary = EGTResultReviewEngine.buildSummary(resultReviewContext({ testEnd: state.testEnd }));
          state.score = summary.score;
          $("resultText").innerHTML = EGTResultReviewEngine.renderResultHeader(summary, { formatTime });
          var total=summary.total, percent=summary.percent, dur=summary.duration, avg=summary.avg;
          try{ if(window.EGTSimulation && typeof window.EGTSimulation.finish === "function") window.EGTSimulation.finish({ mode: state.selectedMode, total: state.quiz.length, answered: total, score: state.score, percent, duration: dur, avg }); }catch(e){}
        }
      }catch(e){ console.warn("EGTResultReviewEngine summary fallback", e); summary=null; }
      if(!summary){
        state.score=state.history.filter(h=>h&&h.correct).length;
        var total=state.history.filter(Boolean).length||1, percent=Math.round(state.score/total*100), dur=state.testStart?formatDuration(state.testEnd-state.testStart):"nicht erfasst", target=state.selectedMode==="ctc"?70:state.selectedMode==="bps"?75:80, verdict=percent>=target?"Stark für diesen Modus.":percent>=target-10?"Knapp dran, aber noch instabil unter Druck.":"Noch zu fehleranfällig für einen sicheren Lauf.", avg=Math.round(state.history.reduce((s,h)=>s+(h?.duration||0),0)/total/100)/10;
        try{ if(window.EGTSimulation && typeof window.EGTSimulation.finish === "function") window.EGTSimulation.finish({ mode: state.selectedMode, total: state.quiz.length, answered: total, score: state.score, percent, duration: dur, avg }); }catch(e){}
        const trainingModes=["mathSprint","textMathSprint","logicSprint","concentrationSprint","visualIQSprint","itSprint","knowledgeSprint","techniqueSprint","errorTrainingPrep"];
        const trainingNote=trainingModes.includes(state.selectedMode)?'<div class="training-note"><b>Blocktraining PRO:</b> Dieser Lauf zählt als gezielte Trainingseinheit. Nutze die Kategorieauswertung direkt für den nächsten Sprint.</div>':'';
        $("resultText").innerHTML=`${state.exam.enabled?'<div class="exam-banner">Prüfungsmodus abgeschlossen. Offene Aufgaben wurden streng gewertet.</div>':""}${trainingNote}<div class="bigScore">${state.score}/${total}</div><div class="statsgrid"><div class="stat"><b>Quote</b><br><strong>${percent}%</strong></div><div class="stat"><b>Beginn</b><br><strong>${formatTime(state.testStart)}</strong></div><div class="stat"><b>Ende</b><br><strong>${formatTime(state.testEnd)}</strong></div><div class="stat"><b>Dauer</b><br><strong>${dur}</strong></div><div class="stat"><b>Ø pro Aufgabe</b><br><strong>${avg}s</strong></div></div><div class="tipBox"><b>${verdict}</b></div>`;
      }
    }
    renderCategoryStats(); renderTips(percent); renderReview(); saveResult(percent,dur,avg);
    try{ const pg=prognosisCardHtml(); if(pg) $("resultText").innerHTML+=pg; }catch(e){}
    try {
      if(window.EGTResultPersistenceEngine && typeof EGTResultPersistenceEngine.finishCoachSession === "function") {
        EGTResultPersistenceEngine.finishCoachSession(resultPersistenceContext({percent, total, score:state.score, duration:dur, avg}));
      } else if (window.EGTLearningCoach && typeof window.EGTLearningCoach.onSessionFinished === "function") {
        window.EGTLearningCoach.onSessionFinished({percent, total, score: state.score, duration: dur, avg});
      }
    } catch (e) {
      console.warn("Coach session hook failed", e);
    }
  }
  function showResult() {
    try {
      if(ResultFlowEngine && typeof ResultFlowEngine.showResult === "function") {
        return ResultFlowEngine.showResult();
      }
    } catch(e) {
      console.warn("ResultFlowEngine fallback", e);
    }
    return showResultLegacy();
  }

  function renderCategoryStats() {
    try{
      if(window.EGTResultReviewEngine && typeof EGTResultReviewEngine.renderCategoryStats === "function") {
        $("categoryStats").innerHTML = EGTResultReviewEngine.renderCategoryStats(resultReviewContext());
        return;
      }
    }catch(e){ console.warn("EGTResultReviewEngine category fallback", e); }
    const answered=state.history.filter(Boolean), cats=[...new Set(answered.map(h=>h.group))];
    $("categoryStats").innerHTML=cats.map(cat=>{const items=answered.filter(h=>h.group===cat), r=items.filter(h=>h.correct).length, p=Math.round(r/items.length*100), avg=Math.round(items.reduce((s,h)=>s+h.duration,0)/items.length/100)/10; return `<div class="stat"><b>${cat}</b><br>${r}/${items.length} richtig<br><strong>${p}%</strong><br><span class="small">Ø ${avg}s</span></div>`;}).join("");
    if(state.selectedMode==="ctcLohr") {
      const blocks=["1. Allgemeinwissen","2. Mathe","3. Logik","4. Konzentration","5. EDV Kenntnisse","Nicht bearbeitet"];
      const rows=blocks.map(block=>{const items=answered.filter(h=>h.block===block); if(!items.length)return ""; const r=items.filter(h=>h.correct).length, p=Math.round(r/items.length*100), open=items.filter(h=>h.givenIndex===null).length; return `<div class="stat"><b>${block}</b><br>${r}/${items.length} richtig<br><strong>${p}%</strong><br><span class="small">offen/übersprungen: ${open}</span></div>`;}).join("");
      $("categoryStats").innerHTML+=`<div class="box" style="grid-column:1/-1"><h3>Blockauswertung</h3><div class="statsgrid">${rows}</div></div>`;
    }
  }
  function renderTips(percent) {
    try{
      if(window.EGTResultReviewEngine && typeof EGTResultReviewEngine.renderTips === "function") {
        $("tips").innerHTML = EGTResultReviewEngine.renderTips(resultReviewContext(), percent);
        return;
      }
    }catch(e){ console.warn("EGTResultReviewEngine tips fallback", e); }
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
    try{
      if(window.EGTResultReviewEngine && typeof EGTResultReviewEngine.renderReview === "function") {
        $("review").innerHTML = EGTResultReviewEngine.renderReview(resultReviewContext());
        return;
      }
    }catch(e){ console.warn("EGTResultReviewEngine review fallback", e); }
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
  function activeLearnerId() {
    try {
      if(ProfileAuthDomainEngine && typeof ProfileAuthDomainEngine.activeLearnerId === "function") return ProfileAuthDomainEngine.activeLearnerId();
    } catch(e) {}
    try {
      if(window.EGTAdminPortal && EGTAdminPortal.state) {
        const snap = EGTAdminPortal.state();
        if(snap && snap.learner && (snap.learner.userId || snap.learner.code)) return String(snap.learner.userId || snap.learner.code);
      }
      return localStorage.getItem("egt_active_learner") || "GUEST";
    } catch(e) { return "GUEST"; }
  }
  function activeLearnerNeedsPasswordChange() {
    try {
      if(ProfileAuthDomainEngine && typeof ProfileAuthDomainEngine.activeLearnerNeedsPasswordChange === "function") return !!ProfileAuthDomainEngine.activeLearnerNeedsPasswordChange();
    } catch(e) {}
    try {
      if(window.EGTAdminPortal && EGTAdminPortal.state) {
        const snap = EGTAdminPortal.state();
        return !!(snap && snap.profile && snap.profile.mustChangePassword);
      }
    } catch(e) {}
    return false;
  }
  function resultPersistenceContext(extra) {
    return Object.assign({
      state,
      modes:MODES,
      appVersion:APP_VERSION,
      storageEngine:StorageEngine,
      databaseBridge:DatabaseBridge,
      guard:Guard,
      resultReviewEngine:window.EGTResultReviewEngine,
      resultReviewContext,
      sessionTracker:SessionTracker,
      readProfile,
      getResults,
      activeLearnerId,
      activeLearnerNeedsPasswordChange,
      coachDNA:window.EGTCoachDNA,
      adminPortal:AdminPortalDomainEngine,
      authProfileShell:ProfileAuthDomainEngine,
      highscoreEngine:HighscoreEngine,
      cloudHighscoreEngine:CloudHighscoreEngine,
      maxRecords:StorageEngine.maxRecords,
      normalizeCategory:function(value){ return window.EGTCoachDNA ? EGTCoachDNA.normalizeCategory(value) : value; }
    }, extra || {});
  }

  function saveResult(percent,dur,avg) {
    try {
      if(window.EGTResultPersistenceEngine && typeof EGTResultPersistenceEngine.persistResult === "function") {
        const persisted = EGTResultPersistenceEngine.persistResult(resultPersistenceContext({percent, duration:dur, dur, avg}));
        if(persisted && (persisted.ok || persisted.skipped)) return persisted;
      }
    } catch(e) {
      console.warn("EGTResultPersistenceEngine save fallback", e);
    }
    return saveResultInternal(percent,dur,avg);
  }

  function saveResultInternal(percent,dur,avg) {
    if(activeLearnerNeedsPasswordChange()) {
      console.warn("Fortschritt wird erst nach dem Pflicht-Passwortwechsel gespeichert.");
      return;
    }
    const allData=StorageEngine.read([]).map(entry=>Guard.normalizeResult(entry));
    const data=getResults();
    let cats={};
    try{
      if(window.EGTResultReviewEngine && typeof EGTResultReviewEngine.buildCategoryMap === "function") {
        cats = EGTResultReviewEngine.buildCategoryMap(resultReviewContext({
          normalizeCategory: function(value){ return window.EGTCoachDNA ? EGTCoachDNA.normalizeCategory(value) : value; }
        }));
      }
    }catch(e){ console.warn("EGTResultReviewEngine category-map fallback", e); }
    if(!cats || !Object.keys(cats).length) state.history.filter(Boolean).forEach(h=>{const group=(window.EGTCoachDNA?EGTCoachDNA.normalizeCategory(h.group||h.cat||h.category):h.group)||"Allgemein"; if(!cats[group])cats[group]={n:0,r:0,t:0}; cats[group].n++; if(h.correct)cats[group].r++; cats[group].t+=h.duration;});
    const aiSession=SessionTracker.buildSession(state.history,state.selectedMode,MODES[state.selectedMode].title);
    const profile=readProfile();
    let authIdentity={};
    try { if(ProfileAuthDomainEngine && typeof ProfileAuthDomainEngine.highscoreIdentity === "function") authIdentity = ProfileAuthDomainEngine.highscoreIdentity() || {}; } catch(e) {}
    const userId=authIdentity.userId || activeLearnerId();
    const visibleName=authIdentity.playerName || authIdentity.nickname || profile.name || userId || "Gast";
    let latest={date:new Date().toISOString(),userId,learnerId:userId,player_name:visibleName,player_id:authIdentity.profileId || profile.player_id || userId,profileId:authIdentity.profileId || "",role:authIdentity.role || "",groupId:authIdentity.groupId || "",mode:state.selectedMode,title:MODES[state.selectedMode].title,score:state.score,total:state.history.length,percent,duration:dur,avg,cats,exam:{...state.exam},aiSession,appVersion:APP_VERSION};
    try { if(window.EGTCTCAdminReportEngine && typeof EGTCTCAdminReportEngine.enrichRecord === "function") latest = EGTCTCAdminReportEngine.enrichRecord(latest, { state, history:state.history, quiz:state.quiz, mode:state.selectedMode, branch:"it", simType:"ctc", pool:"it-ctc" }); } catch(e) { console.warn("CTC Admin Report fallback", e); }
    allData.push(latest);
    StorageEngine.write(allData.map(entry=>DatabaseBridge.createResultRecord(entry)).slice(-StorageEngine.maxRecords));
    try { if(window.EGTCoachDNA) window.EGTCoachDNA.recordResult(latest); } catch(e) { console.warn("Coach DNA", e); }
    try { if(AdminPortalDomainEngine && AdminPortalDomainEngine.trackEvent) { let adminPayload = Object.assign({}, latest, {userId, module:state.selectedMode, mode:state.selectedMode, score:percent, rawScore:state.score, passed:percent>=70, correct:percent>=70, errors:Object.keys(cats).filter(k=>cats[k].r<cats[k].n), total:state.history.length, categoryStats:cats, coachSession:aiSession}); try { if(window.EGTCTCAdminReportEngine && typeof EGTCTCAdminReportEngine.toAdminEvent === "function") adminPayload = EGTCTCAdminReportEngine.toAdminEvent(adminPayload, { state, history:state.history, quiz:state.quiz, mode:state.selectedMode, branch:"it", simType:"ctc", pool:"it-ctc" }); } catch(e2){} AdminPortalDomainEngine.trackEvent(adminPayload); } } catch(e) {}
    try { if(ProfileAuthDomainEngine && typeof ProfileAuthDomainEngine.recordDemoSimulation === "function") ProfileAuthDomainEngine.recordDemoSimulation({ mode:state.selectedMode, runId:String(state.testStart ? state.testStart.getTime() : latest.date), date:latest.date, percent:percent }); } catch(e) { console.warn("Demo-Zähler", e); }
    HighscoreEngine.persistFromResults(getResults()).catch(()=>{});
    CloudHighscoreEngine.submit(latest).then(()=>CloudHighscoreEngine.refreshDashboard()).catch(err=>{console.warn("Cloud Highscore Sync", err); CloudHighscoreEngine.refreshDashboard();});
  }
  /* ============================================================
     BESTEHENSPROGNOSE · datengetrieben und erklärbar:
     gewichtete jüngste Leistung vs. Zielquote des Tests, abzüglich
     Schwankungs-Malus, plus Abdeckungs-Bonus. Keine Blackbox.
     ============================================================ */
  function passPrognosis(){
    const res=getResults();
    if(!res.length) return null;
    const targets={ctcLohr:{label:"CTC / Bosch",target:70},bps:{label:"Basisprofil+",target:75}};
    const out={};
    Object.entries(targets).forEach(([modeKey,cfg])=>{
      // Relevante Läufe: Simulation des Modus + gemischte Tests, jüngste zuerst
      const relevant=res.filter(r=>r.mode===modeKey||r.mode==="ctc"||r.mode==="jogging").slice(-10).reverse();
      if(!relevant.length){ out[modeKey]=null; return; }
      // Gewichtete Quote: jüngere Läufe zählen stärker (Gewicht 1.0, 0.85, 0.72, …)
      let wSum=0,w=1,acc=0;
      const percents=[];
      relevant.forEach(r=>{ const pct=Number(r.percent)||0; percents.push(pct); acc+=pct*w; wSum+=w; w*=0.85; });
      const weighted=acc/wSum;
      // Schwankung: Standardabweichung der letzten Läufe als Unsicherheits-Malus
      const mean=percents.reduce((a,b)=>a+b,0)/percents.length;
      const sd=Math.sqrt(percents.reduce((a,b)=>a+(b-mean)*(b-mean),0)/percents.length);
      const volatilityPenalty=Math.min(12,sd*0.6);
      // Abdeckung: mehr abgeschlossene Läufe = belastbarere Prognose (max +6)
      const coverageBonus=Math.min(6,relevant.length*1.2);
      const raw=50+(weighted-cfg.target)*2.2+coverageBonus-volatilityPenalty;
      const prob=Math.max(3,Math.min(97,Math.round(raw)));
      // Kritischster Bereich: schwächste Gruppe über die letzten Läufe (min. 5 Aufgaben)
      const groups={};
      relevant.forEach(r=>{ Object.entries(r.cats||{}).forEach(([g,v])=>{ if(!groups[g])groups[g]={n:0,r:0}; groups[g].n+=v.n||0; groups[g].r+=v.r||0; }); });
      let critical=null,critPct=101;
      Object.entries(groups).forEach(([g,v])=>{ if(v.n>=5){ const pct=v.r/v.n*100; if(pct<critPct){critPct=pct;critical=g;} } });
      out[modeKey]={label:cfg.label,target:cfg.target,prob,weighted:Math.round(weighted),runs:relevant.length,sd:Math.round(sd),critical,criticalPct:critical?Math.round(critPct):null};
    });
    return (out.ctcLohr||out.bps)?out:null;
  }
  function prognosisCardHtml(){
    const p=passPrognosis();
    if(!p) return "";
    const bar=(x)=>{
      if(!x) return "";
      const cls=x.prob>=70?"good":x.prob>=45?"mid":"low";
      return `<div class="prognosis-row"><div class="prognosis-head"><b>${escHTML(x.label)}</b><span class="prognosis-prob ${cls}">${x.prob} %</span></div>
        <div class="prognosis-bar"><div class="prognosis-fill ${cls}" style="width:${x.prob}%"></div><div class="prognosis-target" style="left:${x.target}%" title="Zielquote ${x.target}%"></div></div>
        <div class="prognosis-meta">Basis: ${x.runs} Läufe · Ø gewichtet ${x.weighted} % · Ziel ${x.target} %${x.critical?` · Kritischster Bereich: <b>${escHTML(x.critical)}</b> (${x.criticalPct} %)`:""}</div></div>`;
    };
    return `<div class="prognosis-card"><div class="prognosis-title">🎯 Bestehensprognose</div>${bar(p.ctcLohr)}${bar(p.bps)}
      <div class="prognosis-note">Prognose aus deinen letzten Läufen: jüngere Ergebnisse zählen stärker, starke Schwankungen senken die Sicherheit. Trainiere gezielt den kritischsten Bereich, um die Quote am schnellsten zu heben.</div></div>`;
  }
  function getResults(){
    const active=activeLearnerId();
    return StorageEngine.read([]).map(entry=>Guard.normalizeResult(entry)).filter(entry=>{
      const owner=entry.userId||entry.learnerId||entry.player_id||"GUEST";
      return !active || active==="GUEST" || String(owner)===String(active);
    });
  }

  
  function showAnalysis() {
    return CoachAnalysisDomainEngine.showAnalysis();
  }

  function showDatabaseInfo() {
    const d = DatabaseBridge.diagnostics();
    setDiagnosticsContent(`
      <b>Datenbankstatus</b>
      <div class="health-row"><span>Aktive Engine</span><strong>${d.engine}</strong></div>
      <div class="health-row"><span>IndexedDB verfügbar</span><strong>${d.indexedDbReady ? "Ja" : "Nein"}</strong></div>
      <div class="health-row"><span>IndexedDB Foundation</span><strong>${d.indexedDb && d.indexedDb.ok ? "OK" : (d.indexedDb && d.indexedDb.supported ? "initialisiert..." : "nicht verfügbar")}</strong></div>
      <div class="health-row"><span>IndexedDB Stores</span><strong>${d.indexedDb && d.indexedDb.stores ? d.indexedDb.stores.length : 0}/${d.indexedDb && d.indexedDb.expectedStores ? d.indexedDb.expectedStores.length : 0}</strong></div>
      <div class="health-row"><span>Highscore Store</span><strong>${d.indexedDb && d.indexedDb.stores && d.indexedDb.stores.includes("highscores") ? "bereit" : "prüfen"}</strong></div>
      <div class="health-row"><span>Cloud Highscore Config</span><strong>${(window.App && App._test && App._test.CloudHighscoreEngine && App._test.CloudHighscoreEngine.diagnostics().configured) ? "geladen" : "nicht vollständig"}</strong></div>
      <div class="health-row"><span>Migration</span><strong>${d.migration && d.migration.ready ? "vorbereitet" : "prüfen"}</strong></div>
      <div class="health-row"><span>Migrationsmodus</span><strong>${d.migration ? d.migration.phase : "-"}</strong></div>
      <div class="health-row"><span>Quellläufe gefunden</span><strong>${d.migration ? d.migration.totalRecords : 0}</strong></div>
      <div class="health-row"><span>Schema</span><strong>${d.schemaVersion}</strong></div>
      <div class="health-row"><span>Gespeicherte Läufe</span><strong>${d.records}/${d.maxRecords}</strong></div>
      <div class="health-row"><span>Ungefähre Größe</span><strong>${d.approxSizeKb} KB</strong></div>
      <div class="db-status-card"><b>Vorbereitete Stores:</b><br>${Object.keys(DATA_MODEL.stores).join(", ")}</div>
      <div class="db-status-card"><b>Aufgabenbank-Import:</b><br><code>source, sourcePage, category, group, subtype, difficulty, question, answers, correct, explanation, tags, verified</code></div>
      <div class="pwa-panel"><b>PWA & Datenbank Status:</b><br><code>${PWA_CONFIG.manifestFile}</code> · <code>${PWA_CONFIG.serviceWorkerFile}</code><br><span class="small">${escHTML(PWA_CONFIG.note)}</span></div>
    `);
  }

  function exportBackup() {
    const payload = DatabaseBridge.exportPayload();
    const text = JSON.stringify(payload, null, 2);
    const blob = new Blob([text], {type:"application/json"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "eignungstest-trainer-backup-v7-4-2.json";
    document.body.appendChild(a);
    a.click();
    setTimeout(()=>{ URL.revokeObjectURL(url); a.remove(); }, 250);
  }

  function ensureGlobalDiagnosticsPanel(){
    let panel = document.getElementById("globalDiagnosticsPanel");
    if(panel) return panel;
    panel = document.createElement("div");
    panel.id = "globalDiagnosticsPanel";
    panel.className = "global-diagnostics-panel";
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-modal", "false");
    panel.innerHTML = '<div class="global-diagnostics-card"><button type="button" class="global-diagnostics-close" aria-label="Diagnose schließen" onclick="document.getElementById(\'globalDiagnosticsPanel\')?.classList.remove(\'show\')">×</button><div id="globalDiagnosticsContent"><b>Diagnose wird geladen...</b></div></div>';
    document.body.appendChild(panel);
    return panel;
  }

  function setDiagnosticsContent(html){
    const globalPanel = ensureGlobalDiagnosticsPanel();
    const content = document.getElementById("globalDiagnosticsContent");
    if(content) content.innerHTML = html;
    globalPanel.classList.add("show");
  }

  async function showFrameworkHealth() {
    setDiagnosticsContent('<b>Framework-Status</b><br><span class="small">Diagnose wird geladen...</span>');
    let summary = null;
    let cloudLive = null;
    let guardHtml = "";
    try { summary = QualityEngine.summary(); } catch(error) { summary = {framework:FRAMEWORK.name + " " + FRAMEWORK.version, modes:[], simulation:{count:0}, contracts:["QualityEngine Fehler: " + String(error && error.message ? error.message : error)], storage:{engine:"unbekannt",records:0}, ok:false}; }
    try { cloudLive = await CloudHighscoreEngine.testConnection(); } catch(error) { cloudLive = {online:false, configured:false, configLoaded:false, urlSet:false, keySet:false, provider:"-", table:"-", classCode:"-", readOk:false, status:"error", error:String(error && error.message ? error.message : error)}; }
    try {
      if(window.ArchitectureGuard && typeof ArchitectureGuard.run === "function" && typeof ArchitectureGuard.render === "function"){
        guardHtml = ArchitectureGuard.render(await ArchitectureGuard.run());
      }
    } catch(error) {
      guardHtml = `<div class="db-status-card"><b>Architecture Guard:</b><br><span class="small">Fehler: ${escHTML(error && error.message ? error.message : error)}</span></div>`;
    }
    const contracts = Array.isArray(summary.contracts) ? summary.contracts : [];
    const html = `
      <b>Framework-Status</b>
      <div class="health-row"><span>System</span><strong>OK</strong></div>
      <div class="health-row"><span>Speicher</span><strong>${escHTML((summary.storage && summary.storage.engine) || "-")} · ${summary.storage && typeof summary.storage.records !== "undefined" ? summary.storage.records : 0} Läufe</strong></div><div class="health-row"><span>Schema</span><strong>${escHTML(DATA_MODEL.version)}</strong></div>
      <div class="health-row"><span>Modi</span><strong>${summary.modes && summary.modes.length ? summary.modes.length : 0}</strong></div>
      <div class="health-row"><span>Simulation</span><strong>${summary.simulation && summary.simulation.count ? summary.simulation.count : 0} Aufgaben</strong></div>
      <div class="health-row"><span>Modus-Verträge</span><strong>${contracts.length ? contracts.length + " Problem(e)" : "OK"}</strong></div>
      <div class="health-row"><span>AI Engine</span><strong>${summary.ai && summary.ai.ok ? "OK" : "Prüfen"}</strong></div>
      <div class="health-row"><span>IndexedDB</span><strong>${summary.indexedDb && summary.indexedDb.ok ? "OK" : "Prüfen"}</strong></div><div class="health-row"><span>Highscore Engine</span><strong>${summary.highscore && summary.highscore.ok ? "OK" : "Prüfen"}</strong></div><div class="health-row"><span>Cloud Highscore</span><strong>${cloudLive.online ? "online" : (cloudLive.configured ? "konfiguriert · Verbindung prüfen" : "nicht verbunden")}</strong></div>
      <div class="health-row"><span>Migration</span><strong>${summary.migration && summary.migration.ok ? "Aktiv · nicht-destruktiv" : "Prüfen"}</strong></div>
      <div class="health-row"><span>Adaptive Engine</span><strong>${summary.ai && summary.ai.adaptive ? escHTML(summary.ai.adaptive) : "Prüfen"}</strong></div>
      <div class="health-row"><span>Dynamic Generator</span><strong>${summary.ai && summary.ai.mix ? summary.ai.mix + " Mix-Einträge" : "Prüfen"}</strong></div>
      <div class="health-row"><span>Focus Guard</span><strong>${summary.ai && summary.ai.focusGuard ? escHTML(summary.ai.focusGuard) : "Prüfen"}</strong></div>
      <div class="health-row"><span>Learning Memory</span><strong>${summary.ai && typeof summary.ai.learning === "number" ? summary.ai.learning + " Muster" : "Prüfen"}</strong></div>
      <div class="health-row"><span>Full Simulation</span><strong>${summary.ai && typeof summary.ai.simulation === "number" ? summary.ai.simulation + "% Abdeckung" : "Prüfen"}</strong></div>
      <div class="health-row"><span>Question Bank</span><strong>${summary.questionBank && summary.questionBank.ok ? "Schema OK · Runtime geparkt" : "Prüfen"}</strong></div>
      <div class="health-row"><span>PWA Status</span><strong>${summary.pwa && summary.pwa.ok ? "Manifest aktiv · Cache aus" : "Prüfen"}</strong></div>
      <div class="health-row"><span>Stabile Module</span><strong>${FEATURE_STATUS.stable.length}</strong></div>
      <div class="health-row"><span>Vorbereitet</span><strong>${FEATURE_STATUS.prepared.length}</strong></div>
      <div class="health-row"><span>Ausgeklammert</span><strong>${FEATURE_STATUS.disabled.length}</strong></div>
      <div class="db-status-card"><b>Supabase Cloud Diagnose:</b><br>Config geladen: <b>${cloudLive.configLoaded ? "Ja" : "Nein"}</b><br>URL: <b>${cloudLive.urlSet ? "Ja" : "Nein"}</b> · Key: <b>${cloudLive.keySet ? "Ja" : "Nein"}</b><br>Provider: <code>${escHTML(cloudLive.provider || "-")}</code> · Tabelle: <code>${escHTML(cloudLive.table || "-")}</code> · Klasse: <code>${escHTML(cloudLive.classCode || "-")}</code><br>Lesetest: <b>${cloudLive.readOk ? "OK" : "Fehler"}</b> · Status: <code>${escHTML(cloudLive.status || "-")}</code>${cloudLive.httpStatus ? " · HTTP "+cloudLive.httpStatus : ""}${cloudLive.error ? `<br><span class="small">${escHTML(cloudLive.error)}</span>` : ""}<br><span class="small">Wenn hier Config Ja, URL Ja und Key Ja steht, aber Lesetest Fehler zeigt, liegt es fast sicher an Supabase Tabelle/RLS/Policies oder Internet/CORS.</span></div>
      ${contracts.length ? `<div class="db-status-card"><b>Vertragsprobleme:</b><br>${contracts.map(escHTML).join("<br>")}</div>` : ""}
      ${guardHtml}
      <div class="health-row"><span>Status</span><strong>${summary.ok ? "OK" : "Prüfen"}</strong></div>
    `;
    setDiagnosticsContent(html);
  }

  function clearProgress(){if(confirm("Wirklich alle gespeicherten Ergebnisse löschen?")){StorageEngine.clear(); showAnalysis();}}
  function restart(){ goHomeHard("restart-home-button"); }

  /* ============================================================
     DUELL-MODUS · Lokal (Hot-Seat) + ONLINE (Firestore, Code-basiert).
     Online: Host erstellt Duell → Fragensatz wird hochgeladen → Gast
     tritt per 6-stelligem Code bei und erhält den IDENTISCHEN Satz.
     Beide spielen, Ergebnisse werden synchronisiert, der Vergleich
     (Gesamt, pro Bereich, Zeiten) erscheint auf beiden Geräten.
     Nach jedem Duell wird neu gepoolt (Revanche = neuer Satz).
     ============================================================ */
  const DUELL_HISTORY_KEY="egt-duell-history";
  function duellHistory(){ try{ return JSON.parse(localStorage.getItem(DUELL_HISTORY_KEY)||"[]"); }catch(e){ return []; } }
  function duellSaveHistory(entry){ try{ const h=duellHistory(); h.unshift(entry); localStorage.setItem(DUELL_HISTORY_KEY, JSON.stringify(h.slice(0,20))); }catch(e){} }
  function duellMyName(){
    try{ const id=ProfileAuthDomainEngine && ProfileAuthDomainEngine.highscoreIdentity ? (ProfileAuthDomainEngine.highscoreIdentity()||{}) : {};
      return (id.playerName||id.nickname||"").trim(); }catch(e){ return ""; }
  }

  /* G52.3 · Phase 17
     Duell-Runtime/Control-Flow ist jetzt in js/core/duell-runtime-engine.js gekapselt.
     app.js behält nur schmale öffentliche Wrapper für bestehende onclick="App..."-Aufrufe
     und für interne Legacy-Aufrufe wie showResult() / prepareTest(). */
  function duellAvatarHtml(name, size){ return HighscoreDuelUIEngine.duellAvatarHtml(name, size); }
  function duellPlayerStats(){ return DuellRuntimeEngine.playerStats(); }
  function duellFmtTime(ms){ return DuellRuntimeEngine.fmtTime(ms); }
  function duellClearPoll(){ return DuellRuntimeEngine.clearPoll(); }
  function duellWinnerOf(a,b){ return DuellRuntimeEngine.winnerOf(a,b); }
  function renderDuellComparison(p1,p2,opts){ return DuellRuntimeEngine.renderComparison(p1,p2,opts); }
  function duellFinishComparison(p1,p2){ return DuellRuntimeEngine.finishComparison(p1,p2); }
  function showDuellResult(){ return DuellRuntimeEngine.showResult(); }
  function duellOnlineFinished(stats){ return DuellRuntimeEngine.onlineFinished(stats); }
  function duellRetrySubmit(){ return DuellRuntimeEngine.retrySubmit(); }
  function duellPollForOpponent(){ return DuellRuntimeEngine.pollForOpponent(); }
  function openDuellSetup(){ return DuellRuntimeEngine.openSetup(); }
  function duellSetupTab(which){ return DuellRuntimeEngine.setupTab(which); }
  function duellSetStatus(html){ return DuellRuntimeEngine.setStatus(html); }
  function duellBuildFreshQuiz(){ return DuellRuntimeEngine.buildFreshQuiz(); }
  async function duellCreateOnline(){ return DuellRuntimeEngine.createOnline(); }
  function duellWaitForGuest(){ return DuellRuntimeEngine.waitForGuest(); }
  async function duellJoinOnline(){ return DuellRuntimeEngine.joinOnline(); }
  function duellBeginOnlineRun(){ return DuellRuntimeEngine.beginOnlineRun(); }
  function duellCancelSetup(){ return DuellRuntimeEngine.cancelSetup(); }
  function closeDuellSetup(){ return DuellRuntimeEngine.closeSetup(); }
  function startDuell(){ return DuellRuntimeEngine.startLocal(); }
  function duellStartP2(){ return DuellRuntimeEngine.startP2(); }
  function duellRematch(){ return DuellRuntimeEngine.rematch(); }
  function duellExit(){ return DuellRuntimeEngine.exit(); }
  function duellHistoryList(){ return DuellRuntimeEngine.historyList(); }
  function highscoreData(){
    return HighscoreDuelUIEngine.highscoreData({
      results: getResults(),
      duels: duellHistory(),
      prognosisHtml: prognosisCardHtml()
    });
  }


  function bindRuntimeEvents(){
    if(window.__ET_RUNTIME_EVENTS_BOUND__) return;
    window.__ET_RUNTIME_EVENTS_BOUND__ = true;
    document.addEventListener("click", function(ev){
      const cloudTargetEarly = ev.target && ev.target.closest ? ev.target.closest('[data-action="cloud-test"],[data-action="cloud-refresh"]') : null;
      if(cloudTargetEarly){
        const cloudAction = cloudTargetEarly.getAttribute('data-action');
        ev.preventDefault(); ev.stopPropagation(); if(typeof ev.stopImmediatePropagation === "function") ev.stopImmediatePropagation();
        if(cloudAction === "cloud-test") addCloudTestScore(); else CloudHighscoreEngine.refreshDashboard();
        return;
      }
      if(window.__ET_SPECIAL_TOUCH_TS__ && Date.now() - window.__ET_SPECIAL_TOUCH_TS__ < 420) return;
      const saveBtn = ev.target && ev.target.closest ? ev.target.closest('[data-action="save-profile-name"]') : null;
      if(saveBtn && !ev.defaultPrevented){ ev.preventDefault(); saveProfileName(); }

      const edvTarget = ev.target && ev.target.closest ? ev.target.closest('[data-edv-id]') : null;
      if(edvTarget){ ev.preventDefault(); ev.stopPropagation(); toggleEdvMultiNode(edvTarget.getAttribute('data-edv-id')); return; }

      const routeTarget = ev.target && ev.target.closest ? ev.target.closest('[data-route-street]') : null;
      if(routeTarget){ ev.preventDefault(); ev.stopPropagation(); selectRouteStreet(routeTarget.getAttribute('data-route-street')); return; }

      const actionTarget = ev.target && ev.target.closest ? ev.target.closest('[data-action]') : null;
      if(actionTarget){
        const action = actionTarget.getAttribute('data-action');
        if(action === 'cloud-test'){ ev.preventDefault(); ev.stopPropagation(); addCloudTestScore(); return; }
        if(HighscoreDuelSheetRouterEngine && typeof HighscoreDuelSheetRouterEngine.handleDataAction === "function" && HighscoreDuelSheetRouterEngine.handleDataAction(action, actionTarget)){ ev.preventDefault(); ev.stopPropagation(); return; }
        if(action === 'qnav-toggle'){ ev.preventDefault(); ev.stopPropagation(); toggleQuestionDrawer(); return; }
        if(action === 'route-clear'){ ev.preventDefault(); clearRouteSelection(); return; }
        if(action === 'route-undo'){ ev.preventDefault(); undoRouteStreet(); return; }
        if(action === 'route-submit'){ ev.preventDefault(); submitRouteSequence(); return; }
        if(action === 'edv-clear'){ ev.preventDefault(); clearEdvMultiSelection(); return; }
        if(action === 'edv-undo'){ ev.preventDefault(); undoEdvMultiSelection(); return; }
        if(action === 'edv-submit'){ ev.preventDefault(); submitEdvMultiAnswer(); return; }
        if(action === 'ctc-flowlogic-submit'){ ev.preventDefault(); submitCtcFlowLogicAnswer(); return; }
        if(action === 'ctc-input-submit'){ ev.preventDefault(); submitCtcLohrInputAnswer(); return; }
      }
    });

    document.addEventListener("touchend", function(ev){
      const target = ev.target && ev.target.closest ? (ev.target.closest('[data-route-street]') || ev.target.closest('[data-edv-id]') || ev.target.closest('[data-action]')) : null;
      if(!target) return;
      window.__ET_SPECIAL_TOUCH_TS__ = Date.now();
      ev.preventDefault();
      if(typeof ev.stopImmediatePropagation === "function") ev.stopImmediatePropagation(); else ev.stopPropagation();
      if(target.hasAttribute('data-route-street')) { selectRouteStreet(target.getAttribute('data-route-street')); return; }
      if(target.hasAttribute('data-edv-id')) { toggleEdvMultiNode(target.getAttribute('data-edv-id')); return; }
      const action = target.getAttribute('data-action');
      if(action === 'cloud-test') addCloudTestScore();
      else if(HighscoreDuelSheetRouterEngine && typeof HighscoreDuelSheetRouterEngine.handleDataAction === "function" && HighscoreDuelSheetRouterEngine.handleDataAction(action, target)) return;
      else if(action === 'qnav-toggle') toggleQuestionDrawer();
      else if(action === 'route-clear') clearRouteSelection();
      else if(action === 'route-undo') undoRouteStreet();
      else if(action === 'route-submit') submitRouteSequence();
      else if(action === 'edv-clear') clearEdvMultiSelection();
      else if(action === 'edv-undo') undoEdvMultiSelection();
      else if(action === 'edv-submit') submitEdvMultiAnswer();
      else if(action === 'ctc-flowlogic-submit') submitCtcFlowLogicAnswer();
      else if(action === 'ctc-input-submit') submitCtcLohrInputAnswer();
    }, {passive:false});

    document.addEventListener("keydown", function(ev){
      if(ev.key === "Escape"){ try{ closeTrainingSheet(); }catch(e){} return; }
      if(ev.key !== "Enter") return;
      const target = ev.target;
      if(target && target.matches && target.matches('[data-profile-name-input="1"], #profileNameInput, #profileEditNameInput')){
        ev.preventDefault();
        saveProfileName(target);
      }
      if(target && target.matches && target.matches('#ctcLohrAnswerInput, [data-ctc-coord-index]')){
        ev.preventDefault();
        submitCtcLohrInputAnswer();
      }
    });
  }

  try {
    if(window.AppModuleLoader && !window.__CORE_MODULE_REGISTERED__) {
      window.__CORE_MODULE_REGISTERED__ = true;
      AppModuleLoader.register({id:"core-training-framework", version:APP_VERSION, enabled:true, description:"Kerntraining, Aufgabenbank, Highscore und Ranking-Anbindung", init:function(){}});
      /* initAll intentionally delayed until App exists */ setTimeout(function(){ try{ AppModuleLoader.initAll({App:window.App}); }catch(e){} },0);
    }
  } catch(e) { console.warn("Core module registration", e); }

  bindRuntimeEvents();
  window.addEventListener("resize",()=>{ try{ syncTrainingSheetDeviceClass(); renderModes(); }catch(e){} }, {passive:true});
  window.addEventListener("orientationchange",()=>{ setTimeout(()=>{ try{ syncTrainingSheetDeviceClass(); renderModes(); }catch(e){} },120); }, {passive:true});
  IndexedDBEngine.init().then(()=>StorageEngine.loadFromIndexedDB()).then(()=>{ try { renderModes();  } catch(e){} });
  renderModes();
  setTimeout(()=>{ try{ CloudHighscoreEngine.refreshDashboard(); }catch(e){} }, 350);
  setTimeout(()=>{ try{ CloudHighscoreEngine.refreshDashboard(); }catch(e){} }, 1800);
  forceDesktopLayoutSanity();
  try {
    if(window.AppState) window.AppState.set({activeSection:"start", activeTab:"training"});
    if(window.AppEvents) window.AppEvents.emit("app:mounted", {version: APP_VERSION});
  } catch(error) { console.warn("Component-State bridge", error); }

  async function addCloudTestScore(){
    const el=$("cloudHighscoreCard");
    if(window.__ET_CLOUD_TEST_RUNNING__) return;
    window.__ET_CLOUD_TEST_RUNNING__ = true;
    try {
      if(el) {
        el.dataset.cloudRun = "manual-test";
        el.innerHTML=`<span class="coach-badge">Cloud Highscore · Test läuft</span><div class="coach-action">Testeintrag wird gespeichert...</div><div class="small">Button erkannt · Insert gestartet · Quelle: App.addCloudTestScore · Supabase antwortet gleich sichtbar.</div>${CloudHighscoreEngine.cloudButtons("Bitte warten")}`;
      }
      const res = await CloudHighscoreEngine.insertDebugEntry();
      if(el) el.innerHTML=`<span class="coach-badge">Cloud Highscore · Test</span><div class="coach-action">${res && res.ok ? "Testeintrag gespeichert" : "Testeintrag fehlgeschlagen"}</div><div class="small">HTTP ${escHTML(res && res.status ? res.status : "?")} · ${escHTML(res && res.variant ? res.variant : "full")} · ${escHTML(res && res.authMode ? res.authMode : "auto")} · Verifikation: ${res && res.verified ? "gefunden" : "noch nicht in Topliste"} · Datensätze gelesen: ${escHTML(res && res.verifyCount != null ? res.verifyCount : "?")}</div>${res && res.warning ? `<div class="small cloud-error-note">Fallback-Hinweis: ${escHTML(res.warning)}</div>` : ""}${CloudHighscoreEngine.cloudButtons("Nach dem Speichern Ranking neu laden")}`;
      setTimeout(()=>CloudHighscoreEngine.refreshDashboard(), 1400);
    } catch(error) {
      if(el) el.innerHTML=`<span class="coach-badge">Cloud Highscore · Testfehler</span><div class="coach-action">Testeintrag konnte nicht gespeichert werden</div><div class="small cloud-error-note">${escHTML(error && error.message ? error.message : error)}</div>${CloudHighscoreEngine.cloudButtons("Fehler sichtbar · erneut testen möglich")}`;
    } finally {
      window.__ET_CLOUD_TEST_RUNNING__ = false;
    }
  }

  function highscoreRenderWatchdog(){
    try{
      const card = document.getElementById('cloudHighscoreCard');
      if(!card) return;
      const txt = card.textContent || '';
      if(/Ranking wird geladen|Online-Ranking wird geladen/i.test(txt)) {
        CloudHighscoreEngine.refreshDashboard();
      }
    }catch(e){ console.warn('Highscore watchdog failed', e); }
  }
  setInterval(highscoreRenderWatchdog, 2500);
  setTimeout(highscoreRenderWatchdog, 400);
  setTimeout(highscoreRenderWatchdog, 1600);

  function initSimulationModuleHost(){
    if(!window.EGTSimulation || typeof window.EGTSimulation.init !== "function") return false;
    try{
      window.EGTSimulation.init({
        beforeStart: function(session){
          try{
            document.body.classList.add("egt-simulation-active");
            document.body.dataset.egtSimulationMode = session && session.mode ? session.mode : String(state.selectedMode || "");
          }catch(e){}
        },
        beginRun: function(){
          return startQuizInternal();
        },
        beginLegacyRun: function(){
          return startQuizInternal();
        },
        showQuestion: function(spIntro){
          return showQuestion(!!spIntro);
        },
        tickTimer: function(){
          return tickTimer();
        },
        renderAnswers: function(question){
          return renderAnswers(question);
        },
        // Phase 2G: EDV-Multi wird vom Modul gerendert; dieser Hook bleibt nur als Fallback erreichbar.
        renderEdvMultiAnswers: function(question){
          return renderEdvMultiAnswersInternal(question);
        },
        renderEdvVisual: function(question){
          const q = question || state.quiz[state.current];
          $("visual").innerHTML = renderEdvProHTML(q);
          return true;
        },
        recordEdvMultiAnswers: function(selected){
          return recordEdvMultiAnswersInternal(selected || []);
        },
        markEdvMultiCoveredDone: function(need){
          return markEdvMultiCoveredDone(Number(need || EDV_ERRORS.length));
        },
        afterEdvMultiSubmit: function(need, selected){
          return afterEdvMultiSubmit(Number(need || EDV_ERRORS.length), selected || []);
        },
        // Phase 2F: Route-Memory wird vom Modul gerendert; dieser Hook bleibt nur als Fallback erreichbar.
        renderRouteSequenceAnswers: function(question){
          return renderRouteSequenceAnswersInternal(question);
        },
        recordRouteAnswer: function(selected, correct){
          return recordRouteAnswer(selected, !!correct);
        },
        markCurrentQuestionDone: function(){
          state.questionStates[state.current]=state.markedQuestions[state.current]?"mark":"done";
          return true;
        },
        isAdaptiveElite: function(){
          return isAdaptiveElite();
        },
        isInstantFeedbackAllowed: function(){
          return isInstantFeedbackAllowed();
        },
        getQuestionNavTotal: function(){
          return isAdaptiveElite() ? MODES.ctc.amount : state.quiz.length;
        },
        ensureQuestionDrawerToggle: function(){
          return ensureQuestionDrawerToggle();
        },
        setQuestionDrawer: function(open){
          return setQuestionDrawer(!!open);
        },
        jumpToQuestion: function(index){
          return jumpToQuestion(index);
        },
        updateQuestionNav: function(){
          return updateQuestionNavInternal();
        },
        chooseAnswer: function(index, button){
          return chooseAnswer(index, button);
        },
        recordAnswer: function(given, correct, timeout){
          return recordAnswer(given, correct, timeout);
        },
        nextQuestion: function(){
          return nextQuestion();
        },
        manualNextQuestion: function(){
          return manualNextQuestion();
        },
        skipQuestion: function(){
          return skipQuestion();
        },
        showResult: function(){
          return showResult();
        },
        stopTimer: function(){
          clearInterval(state.timer);
          clearInterval(state.memoryTimer);
          clearRouteTimers();
        },
        restart: function(){
          return restart();
        },
        getState: function(){
          return state;
        },
        getModeMeta: function(){
          return MODES[state.selectedMode] || {};
        },
        formatTime: function(value){
          return formatTime(value);
        },
        formatDuration: function(value){
          return formatDuration(value);
        },
        buildQuiz: function(){
          return buildQuiz();
        }
      });
      return true;
    }catch(error){
      console.warn("EGTSimulation init failed", error);
      return false;
    }
  }
  initSimulationModuleHost();

  let timerWasRunningBeforeHelp = false;

  function openMathHelp(q) {
    if (!q) return;
    
    // Pause timer
    if (state.timer) {
      clearInterval(state.timer);
      timerWasRunningBeforeHelp = true;
    } else {
      timerWasRunningBeforeHelp = false;
    }

    const backdrop = $("uiSheetBackdrop");
    const sheet = $("uiSheet");
    if (!backdrop || !sheet) return;

    const isMastered = q.id ? safeMathMasteryFlag(q.id) : false;

    // Helper to escape HTML safely
    const esc = (val) => String(val == null ? '' : val).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[c]));

    sheet.innerHTML = `
      <div class="ui-sheet-handle"></div>
      <div class="ui-sheet-header">
        <div class="ui-sheet-icon c-orange">➗</div>
        <div class="ui-sheet-info">
          <div class="ui-sheet-name">💡 Mathe-Hilfe</div>
          <div class="ui-sheet-kicker">${esc(q.cat)}</div>
        </div>
        <button class="ui-sheet-close" id="mathHelpCloseBtn" aria-label="Schließen">✕</button>
      </div>
      <div class="ui-sheet-sep"></div>
      <div class="ui-sheet-body ui-math-help-body">
        <p class="ui-math-help-intro">Löse die Aufgabe Schritt für Schritt. Öffne die Abschnitte nacheinander, um selbstständig zu lernen.</p>
        
        <details class="ui-math-help-card">
          <summary><strong>1. Tipp</strong> <small>kleiner Denkanstoß</small></summary>
          <div class="ui-math-help-content">${q.tip || "Lies die Aufgabe genau und markiere die gegebenen Werte."}</div>
        </details>

        <details class="ui-math-help-card">
          <summary><strong>2. Trick / Merkhilfe</strong> <small>wichtige Regel</small></summary>
          <div class="ui-math-help-content">${q.trick || "Achte auf Stolpersteine und Einheiten-Umrechnungen."}</div>
        </details>

        <details class="ui-math-help-card">
          <summary><strong>3. Lösungsweg</strong> <small>Schritt für Schritt</small></summary>
          <div class="ui-math-help-content">${q.stepByStep || "Löse die Teilrechnungen nacheinander auf."}</div>
        </details>

        <details class="ui-math-help-card">
          <summary><strong>4. vollständige Erklärung</strong> <small>Erläuterung</small></summary>
          <div class="ui-math-help-content">${q.ex || q.explanation || "Keine detaillierte Erklärung vorhanden."}</div>
        </details>

        <details class="ui-math-help-card">
          <summary><strong>5. was wird geprüft?</strong> <small>Lernziel</small></summary>
          <div class="ui-math-help-content">${q.testedConcept || "Mathematische Grundlagen und logisches Denken."}</div>
        </details>

        <details class="ui-math-help-card">
          <summary><strong>6. ähnliche Aufgabe</strong> <small>Transferbeispiel</small></summary>
          <div class="ui-math-help-content">${q.similarQuestion || "Versuche eine ähnliche Konstellation mit anderen Zahlen zu lösen."}</div>
        </details>

        <div class="ui-math-help-mastery">
          <button type="button" id="mathHelpMasteryBtn" class="ui-btn-mastery ${isMastered ? 'is-mastered' : ''}">
            ${isMastered ? '✓ Verstanden (Gelernt)' : 'Als verstanden markieren'}
          </button>
        </div>
      </div>
    `;

    backdrop.classList.add('show');
    sheet.offsetHeight; // Force reflow
    sheet.classList.add('show');

    // Wire buttons
    const closeBtn = $("mathHelpCloseBtn");
    if (closeBtn) closeBtn.onclick = closeMathHelp;

    backdrop.onclick = function (e) {
      if (e.target === backdrop) closeMathHelp();
    };

    const masteryBtn = $("mathHelpMasteryBtn");
    if (masteryBtn) {
      masteryBtn.onclick = function () {
        if (!q.id) return;
        const current = localStorage.getItem("bps_math_understood_" + q.id) === "true";
        const newVal = !current;
        localStorage.setItem("bps_math_understood_" + q.id, String(newVal));
        masteryBtn.classList.toggle("is-mastered", newVal);
        masteryBtn.textContent = newVal ? '✓ Verstanden (Gelernt)' : 'Als verstanden markieren';
        
        // Update the badge in the active question meta bar immediately
        const isMastered = newVal;
        const masteredBadge = isMastered ? `<span class="badge mastered-badge">✓ Gelernt</span>` : "";
        
        // Find existing meta or re-render meta
        const totalDisplay = isAdaptiveElite() ? MODES.ctc.amount : state.quiz.length;
        if (state.selectedMode === "ctcLohr") {
          const limit = CTC_BLOCK_LIMITS[q.block] || state.totalTimeForQuestion;
          $("meta").innerHTML = `<span class="badge">${MODES[state.selectedMode].title}</span><span class="badge">${q.block}</span><span class="badge">${q.cat}</span><span class="badge">Frage ${state.current+1}/${totalDisplay}</span>${masteredBadge}${examStatusHtml()}`;
        } else {
          $("meta").innerHTML = `<span class="badge ${state.selectedMode==="ctc"?"hardcore-badge":""}">${MODES[state.selectedMode].title}</span><span class="badge">${q.cat}</span><span class="badge">Frage ${state.current+1}/${totalDisplay}</span>${masteredBadge}${examStatusHtml()}`;
        }
      };
    }
  }

  function closeMathHelp() {
    const backdrop = $("uiSheetBackdrop");
    const sheet = $("uiSheet");
    if (backdrop) backdrop.classList.remove('show');
    if (sheet) sheet.classList.remove('show');

    // Resume timer
    if (timerWasRunningBeforeHelp) {
      clearInterval(state.timer);
      state.timer = setInterval(() => tickTimer(), 1000);
      timerWasRunningBeforeHelp = false;
    }
  }

  return {openDuellSetup,closeDuellSetup,startDuell,duellStartP2,duellRematch,duellExit,duellSetupTab,duellCreateOnline,duellJoinOnline,duellBeginOnlineRun,duellRetrySubmit,duellCancelSetup,duellHistoryList,openHighscoreSheet:(opts)=>HighscoreDuelSheetRouterEngine.openHighscoreSheet(opts||{}),openDuelSheet:(opts)=>HighscoreDuelSheetRouterEngine.openDuelSheet(opts||{}),passPrognosis,highscoreData,setAppSection,setTopTab,selectMode,chooseTrainingMode,setModeTab,setTrainingSheetCategory,openTrainingSheet,openSimulationSheet,closeTrainingSheet,setTrainingFocus,saveProfileName,currentSession:()=>ProfileAuthDomainEngine.currentSession(),profileIdentity:()=>ProfileAuthDomainEngine.highscoreIdentity(),profileAuthState:()=>ProfileAuthDomainEngine.state(),quickStartRecommended,prepareTest,refreshCloudRanking:()=>CloudHighscoreEngine.refreshDashboard(),addCloudTestScore,beginQuizAfterMemory,cancelMemoryPhase,startCtcBlockFromIntro,chooseAnswer,toggleEdvMultiNode,undoEdvMultiSelection,clearEdvMultiSelection,submitEdvMultiAnswer,renderCtcFlowLogicAnswers,submitCtcFlowLogicAnswer,renderCtcLohrInputAnswers,submitCtcLohrInputAnswer,selectRouteStreet,undoRouteStreet,clearRouteSelection,submitRouteSequence,spQuestion,skipQuestion,prevQuestion,manualNextQuestion,toggleMarkQuestion,jumpToQuestion,endEarly,restart,toggleReview,filterReview,showAnalysis,showFrameworkHealth,showDatabaseInfo,exportBackup,clearProgress,pauseTimer,resumeTimer,openMathHelp,closeMathHelp,
    _test:{FRAMEWORK,FEATURE_FLAGS,FEATURE_STATUS,PWA_CONFIG,EGTResultReviewEngine:window.EGTResultReviewEngine,MODULE_TREE,DATA_MODEL,MigrationPlanner,IndexedDBEngine,DatabaseBridge,StorageEngine,Guard,AnalyticsEngine,SessionTracker,ErrorMemory,DataReadiness,WeaknessProfile,CognitiveProfile,RecommendationEngine,TrainingFocusEngine,AdaptiveDifficultyEngine,DynamicGeneratorEngine,LearningMemoryEngine,FullSimulationEngine,HighscoreEngine,CloudHighscoreEngine,HighscoreDuelUIEngine,DuellRuntimeEngine,HighscoreDuelSheetRouterEngine,ResultFlowEngine,QuestionFlowEngine,QuizBuildPipelineEngine,AdminPortalDomainEngine,ProfileAuthDomainEngine,CoachAnalysisDomainEngine,ProductStructureEngine:window.ProductStructureEngine,CTCLohrExamStructureEngine:window.EGTCTCLohrExamStructureEngine,CTCFlowLogicAdapter:window.CTCFlowLogicAdapter,ReleaseQAEngine,QuestionBankEngine,QUESTION_BANK_SCHEMA,QUESTION_BANK,CoachEngine,QualityEngine,readExamOptions,applyExamBodyClass,showExamLockNotice,MODES,buildQuiz,Generators,stableSignature,state,finalizeOpenAnswers,showResult,showQuestion,selectMode,startQuiz,EDV_SCHEMA,EDV_ERRORS,CTC_BLOCK_LIMITS}};
})();
