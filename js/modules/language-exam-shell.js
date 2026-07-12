/* Language Academy · Phase 38E.5
   Mini-Übungssets auswerten und Trainingsfortschritt speichern. */
(function(){
  'use strict';

  var VERSION = 'G54.46.12-transparent-speaking';
  var STORAGE_KEY = 'language-academy-exam-shell-session-v28-de-en-full-simulation';
  var HISTORY_KEY = 'language-academy-exam-shell-history-v1';
  var PARTS = ['reading','listening','grammar','writing','speaking'];
  var PART_LABELS = { reading:'Lesen', listening:'Hören', grammar:'Grammatik & Sprachbausteine', writing:'Schreiben', speaking:'Sprechen' };
  var PART_ICONS = { reading:'📖', listening:'🎧', grammar:'🧩', writing:'✍️', speaking:'🎤' };
  var TRAINING_KEY = 'language-academy-exam-training-session-v1';
  var TRAINING_PROGRESS_KEY = 'language-academy-mini-training-progress-v1';
  var CONTEXT_KEY = 'language-academy-exam-context-v1';
  var SIMULATION_READY_LEVELS = ['A1','A2','B1','B2','C1','C2'];
  var SIMULATION_PENDING_LEVELS = [];

  function esc(value){
    return String(value == null ? '' : value).replace(/[&<>"]/g,function(ch){
      return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[ch]);
    });
  }
  function nowIso(){ return new Date().toISOString(); }
  function isoMs(value){ var t = Date.parse(value || ''); return Number.isFinite(t) ? t : Date.now(); }
  function clamp(n,min,max){ n = Number(n || 0); return Math.max(min, Math.min(max, n)); }
  function two(n){ n = Math.max(0, Math.floor(Number(n || 0))); return n < 10 ? '0' + n : String(n); }
  function formatSeconds(total){ total = Math.max(0, Math.floor(Number(total || 0))); return two(total / 60) + ':' + two(total % 60); }
  function engine(){ return window.LanguageExamEngine || null; }
  function calibrationEngine(){ return window.LanguageExamCalibrationEngine || null; }
  function calibrateVariantPool(level, language, pool){ var c=calibrationEngine(); return c&&typeof c.calibratePool==='function'?c.calibratePool(level,language,pool):pool; }
  function blueprints(){ return window.LanguageExamBlueprints || null; }
  function setContext(value){ try{ localStorage.setItem(CONTEXT_KEY, value || 'training'); }catch(e){} return value || 'training'; }
  function getContext(){ try{ return localStorage.getItem(CONTEXT_KEY) || 'training'; }catch(e){ return 'training'; } }
  function normalizeExamLanguage(value){ value=String(value||'de').toLowerCase(); return value==='en'||value==='english'||value==='englisch'?'en':'de'; }
  function simulationLanguage(value){ var ctx=String(value || getContext() || 'training').toLowerCase(); return ctx==='simulation-en'?'en':'de'; }
  function simulationLanguageLabel(value){ return simulationLanguage(value)==='en'?'Englisch':'Deutsch'; }
  function simulationContextFor(language){ return normalizeExamLanguage(language)==='en'?'simulation-en':'simulation-de'; }
  function isSimulationContext(value){ var ctx = value || getContext(); return ctx === 'simulation-de' || ctx === 'simulation-en'; }
  function difficultyRules(){ return window.LanguageLevelDifficultyRules || null; }
  function difficulty(level){ return difficultyRules() && difficultyRules().get ? difficultyRules().get(normalizeLevel(level)) : null; }
  function pilotForLevel(level){
    level = normalizeLevel(level);
    if(level === 'B1') return window.LanguageB1ExamPilot || null;
    if(level === 'B2') return window.LanguageB2ExamPilot || null;
    return null;
  }
  function generatedFullExamReady(level){
    var bp = getBlueprint(level);
    return !!(bp && bp.parts && bp.parts.reading && bp.parts.listening && bp.parts.grammar && bp.parts.writing && bp.parts.speaking);
  }
  function fullExamReadyForSimulation(level){
    level = normalizeLevel(level);
    return SIMULATION_READY_LEVELS.indexOf(level) >= 0 && (generatedFullExamReady(level) || !!pilotForLevel(level));
  }
  function simulationLevelStatus(level){
    level = normalizeLevel(level);
    if(fullExamReadyForSimulation(level)) return { ready:true, label:'aktiv', note:'Vollprüfung mit fünf Pflichtteilen verfügbar. Objektive Teile werden aus dem Level-Pool generiert, Schreiben/Sprechen aus dem Blueprint.' };
    return { ready:false, label:'in Vorbereitung', note:'Blueprint unvollständig. Simulation bleibt gesperrt, bis alle fünf Pflichtteile vorhanden sind.' };
  }
  function attemptKeyForLevel(level){ return String(normalizeLevel(level)).toLowerCase() + 'ExamAttempt'; }
  function normalizeLevel(level){
    var value = String(level || 'B1').toUpperCase();
    return /^(A1|A2|B1|B2|C1|C2)$/.test(value) ? value : 'B1';
  }
  function getBlueprint(level){
    if(engine() && engine().getBlueprint) return engine().getBlueprint(level);
    if(blueprints() && blueprints().get) return blueprints().get(level);
    return null;
  }
  function defaultSession(level, examVariant){
    level = normalizeLevel(level || 'B1');
    var base = engine() && engine().createSession ? engine().createSession(level) : null;
    var selectedVariant = normalizeExamVariant(level, examVariant || selectExamVariant(level, null, simulationLanguage()), simulationLanguage());
    return Object.assign({
      id:'exam-shell-' + level.toLowerCase() + '-' + Date.now(),
      level:level,
      status:'created',
      currentPart:'reading',
      startedAt:nowIso(),
      updatedAt:nowIso(),
      strictMode:true,
      calibrationSchema:calibrationEngine()&&calibrationEngine().schema||null,
      calibrationVersion:calibrationEngine()&&calibrationEngine().__version||null,
      timeModel:calibrationEngine()&&calibrationEngine().timeModel?calibrationEngine().timeModel(level,getBlueprint(level)):null,
      partOrder:PARTS.slice(),
      answers:{ reading:{}, listening:{}, grammar:{}, writing:'', speaking:'' },
      listeningAudio:{},
      transcriptConfirmed:false,
      speakingEvidence:null,
      parts:{ reading:null, listening:null, grammar:null, writing:null, speaking:null },
      final:null,
      examVariant:selectedVariant,
      examVariantSelectionMode:(examVariant === 'random' ? 'random' : 'chosen'),
      partStartedAt:{ reading:nowIso() },
      partCompletedAt:{ reading:null, listening:null, grammar:null, writing:null, speaking:null },
      examWarnings:[],
      b1ExamAttempt: level === 'B1' && window.LanguageB1ExamPilot && window.LanguageB1ExamPilot.buildAttempt ? window.LanguageB1ExamPilot.buildAttempt(String(Date.now())) : null,
      b2ExamAttempt: level === 'B2' && window.LanguageB2ExamPilot && window.LanguageB2ExamPilot.buildAttempt ? window.LanguageB2ExamPilot.buildAttempt(String(Date.now())) : null
    }, base || {});
  }
  function loadSession(){
    try{
      var raw = localStorage.getItem(STORAGE_KEY);
      if(!raw) return null;
      var parsed = JSON.parse(raw);
      if(!parsed || !parsed.level) return null;
      return normalizeSession(parsed);
    }catch(e){ return null; }
  }
  function normalizeSession(session){
    session = session || defaultSession('B1');
    session.level = normalizeLevel(session.level || 'B1');
    session.status = session.status || 'created';
    session.examVariant = normalizeExamVariant(session.level, session.examVariant);
    session.examVariantSelectionMode = session.examVariantSelectionMode || 'chosen';
    session.currentPart = PARTS.indexOf(session.currentPart) >= 0 ? session.currentPart : 'reading';
    session.answers = Object.assign({ reading:{}, listening:{}, grammar:{}, writing:'', speaking:'' }, session.answers || {});
    session.listeningAudio = Object.assign({}, session.listeningAudio || {});
    session.speakingEvidence=session.speakingEvidence&&typeof session.speakingEvidence==='object'?session.speakingEvidence:null;
    session.parts = Object.assign({ reading:null, listening:null, grammar:null, writing:null, speaking:null }, session.parts || {});
    session.partOrder = PARTS.slice();
    session.partStartedAt = Object.assign({}, session.partStartedAt || {});
    session.partCompletedAt = Object.assign({ reading:null, listening:null, grammar:null, writing:null, speaking:null }, session.partCompletedAt || {});
    session.examWarnings = Array.isArray(session.examWarnings) ? session.examWarnings : [];
    if(calibrationEngine()&&calibrationEngine().timeModel){ session.timeModel=calibrationEngine().timeModel(session.level,getBlueprint(session.level)); session.calibrationSchema=calibrationEngine().schema; session.calibrationVersion=calibrationEngine().__version; }
    session.trainingFocus = session.trainingFocus && session.trainingFocus.part ? session.trainingFocus : null;
    if(session.status === 'training' && session.trainingFocus && PARTS.indexOf(session.trainingFocus.part) >= 0){
      session.currentPart = session.trainingFocus.part;
      session.strictMode = false;
    }
    if(!session.partStartedAt[session.currentPart]) session.partStartedAt[session.currentPart] = nowIso();
    var pilot = pilotForLevel(session.level);
    var attemptKey = attemptKeyForLevel(session.level);
    if(pilot && pilot.buildAttempt && !session[attemptKey]){
      session[attemptKey] = pilot.buildAttempt(session.id || Date.now());
    }
    session.updatedAt = nowIso();
    return session;
  }
  function saveSession(session){
    session = normalizeSession(session);
    try{
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
      __lastOwnedSessionId = session && session.id || null;
      refreshTabLock(session);
    }catch(e){
      /* G54.44.6: QuotaExceeded → Verlauf rotieren und einmal erneut versuchen, sonst sichtbar warnen */
      var retried = false;
      try{
        var hist = loadHistory();
        if(hist.length > 10){ localStorage.setItem(HISTORY_KEY, JSON.stringify(hist.slice(0,10))); }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
        __lastOwnedSessionId = session && session.id || null;
        retried = true;
      }catch(e2){}
      if(!retried){
        try{ console.error('[LanguageExamShell] Speicher voll — Session nicht gespeichert:', e); }catch(x){}
        try{ showShellErrorNotice('quota', 'Gerätespeicher voll: Fortschritt kann nicht gespeichert werden. Bitte alte Browserdaten/Verläufe löschen.'); }catch(x){}
      }
    }
    return session;
  }
  function clearSession(){ try{ localStorage.removeItem(STORAGE_KEY); }catch(e){} releaseTabLock(); }

  /* === G54.44.6 · Tab-Lock gegen Prüfungs-Doppelstart =============
     Problem (Stresstest): Zwei Tabs teilen denselben Session-Key —
     last-write-wins mischt Antworten unterschiedlicher Prüfungen.
     Lösung: Heartbeat-Lock. Ein zweiter Tab wird beim Start gewarnt
     und kann bewusst übernehmen; stilles Überschreiben wird gemeldet. */
  var TAB_LOCK_KEY = 'language-academy-exam-tab-lock-v1';
  var TAB_ID = 'tab-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2,8);
  var TAB_LOCK_TTL_MS = 12000;
  var __lastOwnedSessionId = null;
  var __tabLockTimer = null;
  function readTabLock(){
    try{ return JSON.parse(localStorage.getItem(TAB_LOCK_KEY) || 'null'); }catch(e){ return null; }
  }
  function writeTabLock(session){
    try{ localStorage.setItem(TAB_LOCK_KEY, JSON.stringify({ tabId:TAB_ID, sessionId:(session&&session.id)||null, at:Date.now() })); }catch(e){}
  }
  function lockHeldByOtherTab(){
    var lock = readTabLock();
    return !!(lock && lock.tabId && lock.tabId !== TAB_ID && (Date.now() - Number(lock.at || 0)) < TAB_LOCK_TTL_MS);
  }
  function ownsTabLock(){
    var lock = readTabLock();
    return !!(lock && lock.tabId === TAB_ID);
  }
  function refreshTabLock(session){
    if(!session || session.status !== 'running') return;
    if(lockHeldByOtherTab()) return; // fremdes frisches Lock nie stillschweigend überschreiben
    writeTabLock(session);
    if(!__tabLockTimer){
      __tabLockTimer = setInterval(function(){
        var s = loadSession();
        if(s && s.status === 'running' && !lockHeldByOtherTab()) writeTabLock(s);
        else if(!s || s.status !== 'running'){ clearInterval(__tabLockTimer); __tabLockTimer = null; if(ownsTabLock()) releaseTabLock(); }
      }, 5000);
    }
  }
  function releaseTabLock(){
    try{ var lock = readTabLock(); if(lock && lock.tabId === TAB_ID) localStorage.removeItem(TAB_LOCK_KEY); }catch(e){}
    if(__tabLockTimer){ clearInterval(__tabLockTimer); __tabLockTimer = null; }
  }
  try{
    window.addEventListener('pagehide', releaseTabLock);
    window.addEventListener('storage', function(ev){
      if(!ev || ev.key !== STORAGE_KEY || !__lastOwnedSessionId) return;
      try{
        var incoming = ev.newValue ? JSON.parse(ev.newValue) : null;
        if(incoming && incoming.id && incoming.id !== __lastOwnedSessionId){
          __lastOwnedSessionId = null; // nur einmal warnen
          releaseTabLock();
          showShellErrorNotice('tab-conflict', 'Achtung: In einem anderen Tab wurde eine neue Prüfung gestartet. Dieser Tab ist nicht mehr aktuell — bitte nur in EINEM Tab prüfen.');
        }
      }catch(e){}
    });
  }catch(e){}
  function renderTabLockWarning(level, examVariant){
    var body = '<div class="la-dashboard la-exam-shell">' +
      '<section class="la-exam-hero"><span class="la-section-kicker">Prüfung bereits aktiv</span>' +
      '<h3>⚠️ In einem anderen Tab läuft gerade eine Prüfung</h3>' +
      '<p>Wenn du hier startest, wird die laufende Prüfung im anderen Tab ungültig. Prüfe immer nur in EINEM Tab, damit keine Antworten verloren gehen.</p></section>' +
      '<div class="la-exam-actions">' +
      '<button type="button" class="la-primary" data-ui-action="language-exam-simulation-home">Abbrechen · zurück zur Übersicht</button>' +
      '<button type="button" class="la-secondary" data-ui-action="language-exam-takeover-start" data-la-exam-level="'+esc(level)+'" data-la-exam-variant="'+esc(examVariant || 'random')+'">Trotzdem HIER starten (anderer Tab wird ungültig)</button>' +
      '</div></div>';
    return openSheet('Prüfung läuft bereits', 'Nur ein Tab gleichzeitig', body, '⚠️');
  }
  function openSheet(title, subtitle, body, icon){
    try{
      if(window.EGTUILayer && typeof window.EGTUILayer.openDeepSheet === 'function'){
        var res = window.EGTUILayer.openDeepSheet({ type:'language-exam-shell', theme:'blue', title:title, kicker:(isSimulationContext() ? 'Sprachtest-Simulation' : 'Sprachtraining Prüfung'), subtitle:subtitle, iconHtml:icon || '🎓', bodyHtml:body });
        setTimeout(bindInputs,40);
        return res;
      }
    }catch(e){ try{ console.error('[LanguageExamShell] openDeepSheet fehlgeschlagen, nutze Fallback-Host:', e); }catch(x){} }
    var host = document.getElementById('language-exam-shell-fallback');
    if(!host){ host = document.createElement('div'); host.id='language-exam-shell-fallback'; document.body.appendChild(host); }
    host.innerHTML = '<div class="la-exam-fallback">'+body+'</div>';
    setTimeout(bindInputs,40);
    return true;
  }
  function levelList(){
    var list = blueprints() && blueprints().listLevels ? blueprints().listLevels() : ['A1','A2','B1','B2','C1','C2'];
    return list.map(normalizeLevel);
  }
  function summaryCardHtml(){
    return '<section class="la-card la-exam-entry-card" data-la-exam-entry="phase8q">' +
      '<div class="la-exam-entry-head"><span class="la-section-kicker">Deutsch-Vollprüfung</span><em>Simulation</em></div>' +
      '<h3>Deutsch-Prüfungsübersicht A1 bis C2 · Grammatik & Sprachbausteine</h3>' +
      '<p class="la-note">Diese Prüfungsübersicht ist bewusst streng und prüfungsnah. Wer sie stabil besteht, soll echte Prüfungen mit Reserve angehen können. Zusätzlich zu Lesen, Hören, Schreiben und Sprechen wird jetzt Grammatik & Sprachbausteine als Pflichtblock geprüft.</p>' +
      '<div class="la-exam-mini-grid"><div><b>5</b><small>Pflichtteile</small></div><div><b>3</b><small>Varianten</small></div><div><b>Grammatik</b><small>Sprachbausteine zählen</small></div><div><b>streng</b><small>Punktdeckelung</small></div></div>' +
      '<div class="la-level-actions"><button type="button" class="la-primary" data-ui-action="language-exam-open">Sprachtest-Übersicht öffnen</button><button type="button" class="la-secondary" data-ui-action="language-exam-open" data-la-exam-resume="1">Fortsetzen</button></div>' +
    '</section>';
  }
  function levelCard(level){
    var bp = getBlueprint(level) || {};
    var parts = bp.parts || {};
    var profile = difficulty(level) || {};
    var duration = PARTS.reduce(function(sum,p){ return sum + Number((parts[p] && parts[p].durationMinutes) || 0); }, 0);
    var strict = level === 'C1' || level === 'C2' ? 'sehr streng' : (level === 'B1' || level === 'B2' ? 'streng' : 'grundlegend');
    var write = profile.writingWords ? (profile.writingWords[0]+'–'+profile.writingWords[1]+' Wörter') : 'niveauabhängig';
    var skill = profile.skills && profile.skills.length ? profile.skills[0] : (bp.description || 'Prüfungssimulation');
    var grammar = profile.grammar && profile.grammar.length ? profile.grammar.slice(0,2).join(' · ') : 'Sprachbausteine';
    var sim = isSimulationContext();
    var state = simulationLevelStatus(level);
    var disabled = sim && !state.ready;
    var action = disabled ? 'language-exam-level-pending' : 'language-exam-select-variant';
    return '<button type="button" class="la-exam-level-card la-exam-level-card-'+esc(level.toLowerCase())+(disabled?' is-planned':'')+'" data-ui-action="'+esc(action)+'" data-la-exam-level="'+esc(level)+'" '+(disabled?'aria-disabled="true"':'')+'>' +
      '<span>'+esc(level)+'</span><b>'+esc(profile.label || bp.description || 'Prüfungssimulation')+'</b>' +
      '<small>'+esc(duration || '—')+' Min · Bestehen ab '+esc(bp.passScore || 70)+'% · '+esc(strict)+'</small>' +
      (sim ? '<em class="la-level-difficulty-line"><b>'+esc(state.label)+':</b> '+esc(state.note)+'</em>' : '') +
      '<em class="la-level-difficulty-line">Schreiben: '+esc(write)+'</em>' +
      '<em class="la-level-difficulty-line">Fokus: '+esc(skill)+'</em>' +
      '<em class="la-level-difficulty-line">Grammatik: '+esc(grammar)+'</em>' +
    '</button>';
  }

  function partPoolCount(level, part){
    var pilot = pilotForLevel(level);
    var poolName = part + 'Pool';
    if(pilot && Array.isArray(pilot[poolName])) return pilot[poolName].length;
    var bp = getBlueprint(level) || {};
    if(part === 'writing' && Array.isArray(bp.writingTasks)) return bp.writingTasks.length;
    if(part === 'speaking' && Array.isArray(bp.speakingTasks)) return bp.speakingTasks.length;
    return level === 'B2' ? 8 : (level === 'B1' && (part === 'reading' || part === 'listening' || part === 'grammar') ? 3 : 1);
  }
  function levelCombinationCount(level){
    return PARTS.reduce(function(sum, part){ return sum * Math.max(1, partPoolCount(level, part)); }, 1);
  }
  function loadHistory(){
    try{
      var raw = localStorage.getItem(HISTORY_KEY);
      var list = raw ? JSON.parse(raw) : [];
      return Array.isArray(list) ? list.filter(function(x){ return x && x.level; }).slice(0, 40) : [];
    }catch(e){ return []; }
  }
  function saveHistory(list){
    list = (Array.isArray(list)?list:[]).slice(0,40);
    try{ localStorage.setItem(HISTORY_KEY, JSON.stringify(list)); }
    catch(e){
      try{ localStorage.setItem(HISTORY_KEY, JSON.stringify(list.slice(0,10))); }
      catch(e2){
        try{ console.error('[LanguageExamShell] Speicher voll — Ergebnis-Archiv nicht gespeichert:', e2); }catch(x){}
        try{ showShellErrorNotice('quota', 'Gerätespeicher voll: Das Prüfungsergebnis konnte nicht archiviert werden.'); }catch(x){}
      }
    }
  }
  function attemptFingerprint(session){
    return [session && session.id, session && session.level, session && session.final && session.final.overallScore, session && session.final && session.final.completedParts].join('|');
  }
  function activityIdentity(){
    var out={};
    try{ if(window.EGTAuthProfileShell&&typeof window.EGTAuthProfileShell.highscoreIdentity==='function') out=window.EGTAuthProfileShell.highscoreIdentity()||{}; }catch(e){}
    try{ var p=window.EGTUserDatabase&&window.EGTUserDatabase.activeProfile||{}; out=Object.assign({},p,out); }catch(e2){}
    return {userId:out.userId||out.firebaseUid||out.profileId||out.code||'GUEST',profileId:out.profileId||out.firebaseUid||'',courseId:(window.AppConfig&&window.AppConfig.courseId)||out.courseId||'course_2026_gk',groupId:out.groupId||'',role:out.role||'participant'};
  }
  function recordFinalAttemptActivity(session){
    try{
      var ledger=window.EGTActivityLedgerEngine; if(!ledger||typeof ledger.sessionFromLanguageExam!=='function') return null;
      var activitySession=ledger.sessionFromLanguageExam(session,activityIdentity());
      var stored=ledger.storeSession(activitySession);
      if(stored&&stored.created&&window.EGTAdminPortal&&typeof window.EGTAdminPortal.trackEvent==='function'){
        Promise.resolve(window.EGTAdminPortal.trackEvent({activitySession:activitySession,module:'language',mode:activitySession.mode,score:activitySession.score,passed:activitySession.passed})).catch(function(){});
      }
      return activitySession;
    }catch(e){ try{console.warn('[LanguageExamShell] Activity Ledger:',e);}catch(_e){} return null; }
  }
  function archiveFinalAttempt(session){
    if(!session || !session.final) return;
    var fingerprint = attemptFingerprint(session);
    var list = loadHistory().filter(function(item){ return item.fingerprint !== fingerprint; });
    var breakdown = Array.isArray(session.final.partBreakdown) ? session.final.partBreakdown : [];
    list.unshift({
      id:session.id || ('attempt-' + Date.now()),
      fingerprint:fingerprint,
      level:normalizeLevel(session.level),
      examLanguage:normalizeExamLanguage(session.examLanguage||simulationLanguage(session.context)),
      examVariantId:session.examVariant&&session.examVariant.id||'',
      examVariantLabel:session.examVariant&&session.examVariant.label||'',
      calibrationVersion:session.calibrationVersion||null,
      createdAt:session.startedAt || nowIso(),
      completedAt:session.final.generatedAt || session.updatedAt || nowIso(),
      overallScore:Number(session.final.overallScore || 0),
      passed:!!session.final.passed,
      readiness:session.final.readiness || '',
      readinessProbability:Number(session.final.readinessProbability || 0),
      completedParts:Number(session.final.completedParts || 0),
      partScores:breakdown.reduce(function(map, item){ map[item.part] = Number(item.score || 0); return map; }, {}),
      criticalWeaknesses:Array.isArray(session.final.criticalWeaknesses) ? session.final.criticalWeaknesses.slice(0,8) : [],
      recommendations:Array.isArray(session.final.recommendations) ? session.final.recommendations.slice(0,8) : [],
      nextRequiredAction:session.final.nextRequiredAction || '',
      speakingAssessmentScope:session.parts&&session.parts.speaking&&session.parts.speaking.assessmentScope||null,
      speakingAudioMeasured:!!(session.parts&&session.parts.speaking&&session.parts.speaking.audioMeasured)
    });
    saveHistory(list);
    recordFinalAttemptActivity(session);
  }
  function bestHistoryByLevel(){
    return loadHistory().reduce(function(map,item){
      var level = normalizeLevel(item.level);
      if(!map[level] || Number(item.overallScore || 0) > Number(map[level].overallScore || 0)) map[level] = item;
      return map;
    }, {});
  }
  function currentProgressByLevel(existing){
    var map = bestHistoryByLevel();
    if(existing && existing.level){
      var partsDone = PARTS.filter(function(p){ return !!(existing.parts && existing.parts[p]); }).length;
      var scores = PARTS.map(function(p){ var r = existing.parts && existing.parts[p]; return r ? Number(r.overallScore || r.score || 0) : null; }).filter(function(v){ return v != null; });
      var avg = scores.length ? Math.round(scores.reduce(function(a,b){ return a+b; },0) / scores.length) : 0;
      map[normalizeLevel(existing.level)] = Object.assign({}, map[normalizeLevel(existing.level)] || {}, { active:true, completedParts:partsDone, overallScore:avg, readiness:'aktiver Versuch', partScores:(existing.parts||{}) });
    }
    return map;
  }
  function requirementMini(level){
    var r = difficulty(level) || {};
    var bp = getBlueprint(level) || {};
    var parts = bp.parts || {};
    return {
      writing:r.writingWords ? r.writingWords[0]+'–'+r.writingWords[1] : ((parts.writing&&parts.writing.minWords)||'—'),
      speaking:r.speakingWords ? r.speakingWords[0]+'–'+r.speakingWords[1] : ((parts.speaking&&parts.speaking.minWords)||'—'),
      grammar:r.grammar && r.grammar.length ? r.grammar.slice(0,2).join(', ') : (((parts.grammar&&parts.grammar.format)||[]).slice(0,2).join(', ') || 'niveauabhängig'),
      focus:r.skills && r.skills.length ? r.skills.slice(0,2).join(', ') : (bp.description || 'Prüfung')
    };
  }
  function nextRecommendation(level, item){
    level = normalizeLevel(level);
    if(!item || !item.completedParts) return 'Ersten Hardmode-Versuch starten';
    if(item.active && item.completedParts < PARTS.length) return 'Aktiven Versuch beenden';
    if(item.passed && Number(item.readinessProbability || item.overallScore || 0) >= 82) return level === 'B2' ? 'B2 halten oder C1-Vorbereitung starten' : 'Nächstes Niveau vorbereiten';
    if(item.passed) return 'Bestehen stabilisieren, schwächsten Teil wiederholen';
    return 'Schwächste Prüfungsteile gezielt trainieren';
  }

  function levelTarget(level){
    var bp = getBlueprint(level) || {};
    return Number(bp.passScore || (level === 'B2' ? 76 : 70));
  }
  function partMinTarget(level, part){
    var bp = getBlueprint(level) || {};
    var cfg = bp.parts && bp.parts[part] ? bp.parts[part] : {};
    return Number(cfg.minScore || bp.partMinScore || (level === 'B2' ? 65 : 55));
  }
  function partScoreFromItem(item, part){
    if(!item) return null;
    if(item.partScores && item.partScores[part] != null){
      var v = item.partScores[part];
      if(typeof v === 'object') return Number(v.overallScore || v.score || 0);
      return Number(v || 0);
    }
    return null;
  }
  function weaknessBand(score, min){
    if(score == null) return 'open';
    if(score < Math.max(35, min - 20)) return 'critical';
    if(score < min) return 'weak';
    if(score < min + 8) return 'borderline';
    return 'stable';
  }
  function partWeaknessReason(part, band, score, min){
    var label = PART_LABELS[part] || part;
    if(band === 'open') return label + ': noch nicht abgeschlossen';
    if(band === 'critical') return label + ': deutlich unter Mindestleistung (' + score + '% / Ziel ' + min + '%)';
    if(band === 'weak') return label + ': unter Mindestleistung (' + score + '% / Ziel ' + min + '%)';
    if(band === 'borderline') return label + ': knapp, noch nicht stabil (' + score + '% / Ziel ' + min + '%)';
    return label + ': stabil (' + score + '%)';
  }
  function trainingPlanForPart(level, part, band){
    var hard = normalizeLevel(level) === 'B2';
    var base = {
      reading:['Hauptaussage und Autorabsicht markieren','Ablenker aktiv begründen','2 Varianten unter Zeitdruck lösen'],
      listening:['erst ohne Transkript hören','Sprecherhaltung und Bedingungen notieren','danach Fehler mit Transkript kontrollieren'],
      grammar:['Konnektoren, Satzstellung und Register wiederholen','falsche Optionen begründen','mindestens 24 Sprachbausteine am Stück trainieren'],
      writing:['Pflichtpunkte vor dem Schreiben abhaken','Einleitung, Argumente, Beispiel, Fazit sauber trennen','Text nach Register, Umfang und Thema prüfen'],
      speaking:['Antwort als Mini-Struktur sprechen','eigene Position, Begründung und Beispiel erzwingen','Transkript bestätigen und Schwächen korrigieren']
    }[part] || ['Teil wiederholen','Fehleranalyse durchführen','zweiten Versuch starten'];
    var intensity = band === 'critical' ? 'Sofort-Fokus' : (band === 'weak' ? 'Pflichttraining' : (band === 'borderline' ? 'Stabilisierung' : 'Erhaltung'));
    var minutes = band === 'critical' ? 35 : (band === 'weak' ? 25 : 15);
    return {
      part:part,
      label:PART_LABELS[part] || part,
      band:band,
      intensity:intensity,
      minutes:minutes,
      target: hard ? 'B2-Hardmode-Reserve aufbauen' : normalizeLevel(level)+' sicher bestehen',
      steps:base
    };
  }


  function miniTrainingSetFor(level, part, band){
    level = normalizeLevel(level || 'B2');
    part = PARTS.indexOf(part) >= 0 ? part : 'grammar';
    band = band || 'open';
    var isB2 = level === 'B2';
    var label = PART_LABELS[part] || part;
    var prefix = level + ' · ' + label;
    var pressure = band === 'critical' || band === 'weak' ? 'Pflicht-Rettung' : (band === 'borderline' ? 'Stabilisierung' : 'Reserveaufbau');
    var sets = {
      reading:[
        { kind:'Markieren', title:prefix+' · Hauptaussage sichern', prompt:isB2 ? 'Lies einen argumentativen Text und formuliere in einem Satz: Was will der Autor wirklich erreichen?' : 'Lies einen kurzen Text und notiere die wichtigste Information.', expected:'Eine Hauptaussage, keine zufällige Detailangabe.', solution:isB2 ? 'Nicht: „Es geht um Digitalisierung.“ Besser: „Der Autor befürwortet digitale Weiterbildung, warnt aber vor sozialer Ungleichheit durch fehlende Unterstützung.“' : 'Wer? Was? Wann? Wo? in einem klaren Satz.', checklist:['Thema erkannt','Autorabsicht oder Kerninfo benannt','keine Nebeninformation als Hauptaussage'] },
        { kind:'Ablenker', title:prefix+' · falsche Antwort begründen', prompt:'Wähle bei einer Aufgabe bewusst eine falsche Option und erkläre, welches Wort oder welche Übertreibung sie falsch macht.', expected:'Ablenker aktiv entlarven.', solution:'Typische Fehler: „immer“, „nie“, falsche Ursache, falsche zeitliche Reihenfolge, Aussage steht ähnlich, aber nicht gleich im Text.', checklist:['Signalwort gefunden','Belegstelle im Text gesucht','falsche Schlussfolgerung erkannt'] },
        { kind:'Tempo', title:prefix+' · 6-Minuten-Lesedurchlauf', prompt:'Bearbeite einen Text in drei Runden: 1 Minute Überblick, 3 Minuten Fragen, 2 Minuten Belege kontrollieren.', expected:'Zeitstruktur statt planloses Lesen.', solution:'Bei B2 zählt nicht jedes Wort, sondern These, Einschränkung, Gegenargument, Fazit und Beleg.', checklist:['erst Überblick','dann Fragen','am Ende Belege'] }
      ],
      listening:[
        { kind:'Ohne Transkript', title:prefix+' · erstes Hören ohne Hilfe', prompt:'Höre einmal ohne Transkript. Notiere nur Sprecher, Thema und Zielkonflikt.', expected:'Hörverstehen ohne visuelle Hilfe.', solution:isB2 ? 'B2-Ziel: nicht nur Fakten hören, sondern Haltung, indirekte Kritik und Bedingungen erkennen.' : 'Ziel: Ort, Zeit, Person und Hauptinformation sichern.', checklist:['Transkript nicht geöffnet','Haltung notiert','eine Bedingung oder Änderung erkannt'] },
        { kind:'Sprecherhaltung', title:prefix+' · Meinung erkennen', prompt:'Notiere zwei Wörter, die zeigen, ob die Person zustimmt, zweifelt oder kritisiert.', expected:'Ton und Absicht erkennen.', solution:'Beispiele: „grundsätzlich sinnvoll, aber…“ = teilweise Zustimmung mit Einschränkung; „problematisch finde ich…“ = Kritik.', checklist:['Zustimmung/Kritik erkannt','Einschränkung markiert','nicht nur Einzelwort geraten'] },
        { kind:'Kontrolle', title:prefix+' · Transkript erst danach', prompt:'Öffne das Transkript erst nach dem Hören und markiere genau die Stelle, an der dein Fehler entstanden ist.', expected:'Fehlerquelle finden.', solution:'Fehler entstehen oft durch ähnliche Zahlen, negierte Aussagen, Bedingungen oder vertauschte Reihenfolge.', checklist:['Fehlerstelle gefunden','Grund benannt','zweites Hören gezielt genutzt'] }
      ],
      grammar:[
        { kind:'Konnektor', title:prefix+' · Satzverknüpfung', prompt:isB2 ? 'Setze passend ein: ___ die Maßnahme kurzfristig teuer ist, kann sie langfristig Kosten senken.' : 'Setze passend ein: Ich lerne Deutsch, ___ ich in Deutschland arbeiten möchte.', expected:isB2 ? 'obwohl / auch wenn' : 'weil', solution:isB2 ? '„Obwohl“ passt, weil ein Gegensatz zwischen kurzfristigen Kosten und langfristigem Nutzen entsteht.' : '„weil“ passt, weil ein Grund genannt wird.', checklist:['Bedeutung geprüft','Nebensatzstellung beachtet','Register passend'] },
        { kind:'Satzstellung', title:prefix+' · Umformung', prompt:isB2 ? 'Forme um: „Viele Menschen nutzen KI. Sie kennen die Risiken nicht.“ → mit „ohne dass“.' : 'Forme um: „Ich habe Zeit. Ich komme.“ → mit „wenn“.', expected:isB2 ? 'Viele Menschen nutzen KI, ohne dass sie die Risiken kennen.' : 'Wenn ich Zeit habe, komme ich.', solution:'Achte auf Verbposition und darauf, dass der Sinn gleich bleibt.', checklist:['Verb am richtigen Platz','Sinn bleibt gleich','kein unnötiger Wortsalat'] },
        { kind:'Register', title:prefix+' · formeller Ausdruck', prompt:isB2 ? 'Ersetze „Das ist blöd“ durch einen formellen Ausdruck.' : 'Ersetze „Hi“ in einer formellen Nachricht.', expected:isB2 ? 'Das ist problematisch / Dies halte ich für unangemessen.' : 'Sehr geehrte Damen und Herren / Guten Tag', solution:'Im Hardmode zählt Register: Alltagssprache kann Schreiben und Sprechen deckeln.', checklist:['formell','präzise','nicht beleidigend'] }
      ],
      writing:[
        { kind:'Planung', title:prefix+' · Schreibgerüst vor dem Text', prompt:isB2 ? 'Plane 5 Abschnitte: Einleitung, Pro, Contra, eigene Position mit Beispiel, Fazit/Forderung.' : 'Plane 4 Sätze: Anrede, Grund, Bitte, Abschluss.', expected:'Struktur vor Formulierung.', solution:isB2 ? 'B2 ohne klare Struktur wirkt wie B1. Erst Gliederung, dann Text.' : 'Kurze Texte brauchen trotzdem Anlass, Bitte und Abschluss.', checklist:['alle Pflichtpunkte geplant','Reihenfolge logisch','Beispiel vorgesehen'] },
        { kind:'Pflichtpunkt', title:prefix+' · Beispiel erzwingen', prompt:isB2 ? 'Schreibe zwei Sätze mit „Zum Beispiel…“ und „Daraus folgt…“ zum aktuellen Thema.' : 'Schreibe einen konkreten Satz mit Uhrzeit, Ort oder Bitte.', expected:'Konkretheit statt leere Meinung.', solution:'Schwach: „Das ist gut.“ Stark: „Zum Beispiel könnten Beschäftigte zwei Tage pro Woche im Homeoffice arbeiten, wenn die Erreichbarkeit geregelt ist.“', checklist:['konkretes Beispiel','Folge erklärt','nicht nur Meinung'] },
        { kind:'Revision', title:prefix+' · 90-Sekunden-Korrektur', prompt:'Prüfe deinen Text auf Umfang, Thema, Register, Pflichtpunkte und Konnektoren.', expected:'Endkontrolle wie in echter Prüfung.', solution:'Vor Abgabe immer fragen: Habe ich alle Punkte beantwortet oder nur schön formuliert?', checklist:['Wortzahl passt','Register passt','Pflichtpunkte sichtbar'] }
      ],
      speaking:[
        { kind:'Sprechgerüst', title:prefix+' · 60-Sekunden-Antwort planen', prompt:isB2 ? 'Plane: Einstieg, Pro, Contra, eigene Position, Beispiel, Empfehlung.' : 'Plane: Wer bist du? Was ist das Thema? Was möchtest du sagen?', expected:'Sprechen mit Struktur.', solution:isB2 ? 'B2-Sprechen braucht hörbare Ordnung: „Zunächst… Andererseits… Aus meiner Sicht… Zum Beispiel… Daher empfehle ich…“' : 'Kurze, klare Sätze sind besser als einzelne Wörter.', checklist:['eigene Position','Begründung','Beispiel'] },
        { kind:'Transkript', title:prefix+' · Stichpunkte in Sätze verwandeln', prompt:'Nimm drei Stichpunkte und formuliere daraus mindestens fünf vollständige Sätze.', expected:'Keine Stichpunktantwort.', solution:'Stichpunkte werden hart gedeckelt. Das bestätigte Transkript muss zusammenhängend klingen.', checklist:['vollständige Sätze','Verbindungswörter','keine Liste'] },
        { kind:'Nachfrage', title:prefix+' · Gegenposition beantworten', prompt:isB2 ? 'Reagiere auf: „Das ist zu teuer und unrealistisch.“ Antworte mit Einschränkung und Kompromiss.' : 'Reagiere auf eine einfache Rückfrage und begründe kurz.', expected:'Spontane Reaktion trainieren.', solution:isB2 ? '„Der Einwand ist nachvollziehbar. Trotzdem könnte ein begrenztes Pilotprojekt zeigen, ob der Nutzen die Kosten rechtfertigt.“' : '„Ich verstehe die Frage. Ich denke…, weil…“', checklist:['Gegenargument aufgegriffen','nicht ausgewichen','Kompromiss oder Begründung'] }
      ]
    };
    return { level:level, part:part, band:band, label:label, pressure:pressure, title:prefix+' · Mini-Übungsset', tasks:sets[part] || [] };
  }


  function loadTrainingProgress(){
    try{
      var raw = localStorage.getItem(TRAINING_PROGRESS_KEY);
      var parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    }catch(e){ return []; }
  }
  function saveTrainingProgressList(list){
    list = Array.isArray(list) ? list.slice(-80) : [];
    try{ localStorage.setItem(TRAINING_PROGRESS_KEY, JSON.stringify(list)); }catch(e){}
    return list;
  }
  function miniTaskState(session, idx){
    var f = session && session.trainingFocus ? session.trainingFocus : {};
    var answers = f.miniAnswers || {};
    var checks = f.miniChecks || {};
    return { answer:String(answers[idx] || ''), checks:Array.isArray(checks[idx]) ? checks[idx] : [] };
  }
  function evaluateMiniTraining(session){
    session = normalizeSession(session || loadSession() || defaultSession('B2'));
    var f = session.trainingFocus || {};
    var set = f.miniSet && Array.isArray(f.miniSet.tasks) ? f.miniSet : miniTrainingSetFor(session.level, f.part, f.band);
    var tasks = set.tasks || [];
    var details = tasks.map(function(task, idx){
      var state = miniTaskState(session, idx);
      var words = state.answer.trim() ? state.answer.trim().split(/\s+/).filter(Boolean).length : 0;
      var checklistTotal = Array.isArray(task.checklist) ? task.checklist.length : 0;
      var checked = state.checks.length;
      var answerOk = words >= (task.kind === 'Tempo' ? 3 : 8);
      var checklistOk = checklistTotal ? checked >= Math.max(1, Math.ceil(checklistTotal * 0.67)) : true;
      var done = answerOk && checklistOk;
      var score = Math.round((answerOk ? 55 : Math.min(45, words * 5)) + (checklistTotal ? (checked / Math.max(1, checklistTotal)) * 45 : 45));
      return { index:idx, title:task.title || ('Mini-Übung '+(idx+1)), kind:task.kind || 'Übung', words:words, checked:checked, checklistTotal:checklistTotal, done:done, score:clamp(score,0,100) };
    });
    var completed = details.filter(function(x){ return x.done; }).length;
    var score = details.length ? Math.round(details.reduce(function(sum,x){ return sum + x.score; },0) / details.length) : 0;
    var passed = details.length > 0 && completed === details.length && score >= 70;
    var status = passed ? 'completed' : (completed ? 'partial' : 'open');
    var nextAction = passed ? 'Mini-Übungsset abgeschlossen. Jetzt den Transfer-Prüfungsteil bearbeiten und danach eine neue Simulation starten.' : 'Noch nicht stabil: Bearbeite alle Mini-Aufgaben mit kurzer Antwort und hake mindestens zwei Drittel der Checkliste ab.';
    return { id:'mini-training-'+Date.now(), level:normalizeLevel(session.level), part:f.part || session.currentPart, label:f.label || PART_LABELS[f.part] || f.part, band:f.band || 'open', score:score, completed:completed, total:details.length, passed:passed, status:status, details:details, nextAction:nextAction, createdAt:nowIso(), source:'mini-training-set' };
  }
  function persistTrainingProgress(session, result){
    result = result || evaluateMiniTraining(session);
    var list = loadTrainingProgress();
    list.push(result);
    saveTrainingProgressList(list);
    try{ localStorage.setItem(TRAINING_KEY, JSON.stringify(Object.assign({}, result, { updatedAt:nowIso() }))); }catch(e){}
    return result;
  }
  function latestTrainingProgress(level, part){
    level = normalizeLevel(level || 'B2');
    part = PARTS.indexOf(part) >= 0 ? part : null;
    var list = loadTrainingProgress().filter(function(x){ return normalizeLevel(x.level) === level && (!part || x.part === part); });
    return list.length ? list[list.length - 1] : null;
  }
  function trainingProgressSummaryHtml(level){
    var list = loadTrainingProgress().filter(function(x){ return normalizeLevel(x.level) === normalizeLevel(level || 'B2'); }).slice(-5).reverse();
    if(!list.length) return '<div class="la-training-progress-summary"><b>Noch kein gespeicherter Trainingsfortschritt</b><small>Starte ein Mini-Training und werte es aus.</small></div>';
    var rows = list.map(function(item){
      return '<li><b>'+esc(PART_LABELS[item.part] || item.part)+' · '+esc(item.score)+'%</b><small>'+esc(item.completed)+'/'+esc(item.total)+' Mini-Aufgaben · '+esc(item.status)+' · '+esc((item.createdAt || '').slice(0,16).replace('T',' '))+'</small></li>';
    }).join('');
    return '<div class="la-training-progress-summary"><b>Gespeicherter Trainingsfortschritt</b><ul>'+rows+'</ul></div>';
  }
  function miniTrainingResultHtml(session){
    if(!session || session.status !== 'training' || !session.trainingFocus) return '';
    var result = session.trainingFocus.miniProgress || null;
    if(!result) return '<div class="la-mini-training-result is-open"><b>Noch nicht ausgewertet</b><small>Bearbeite die Mini-Aufgaben und klicke danach auf „Mini-Übungen auswerten“.</small></div>';
    var details = (result.details || []).map(function(d){ return '<li class="'+(d.done?'is-done':'is-open')+'"><b>'+esc(two(d.index+1))+' · '+esc(d.kind)+'</b><small>'+esc(d.score)+'% · '+esc(d.words)+' Wörter · '+esc(d.checked)+'/'+esc(d.checklistTotal)+' Checkpunkte</small></li>'; }).join('');
    return '<div class="la-mini-training-result '+(result.passed?'is-pass':'is-partial')+'"><b>'+esc(result.score)+'% · '+esc(result.completed)+'/'+esc(result.total)+' Mini-Aufgaben abgeschlossen</b><small>'+esc(result.nextAction)+'</small><ul>'+details+'</ul></div>';
  }

  function miniTrainingSetHtml(session){
    if(!session || session.status !== 'training' || !session.trainingFocus) return '';
    var f = session.trainingFocus;
    var set = f.miniSet && Array.isArray(f.miniSet.tasks) ? f.miniSet : miniTrainingSetFor(session.level, f.part, f.band);
    var tasks = (set.tasks || []).map(function(task, idx){
      var state = miniTaskState(session, idx);
      var checklist = (task.checklist || []).map(function(item, cidx){
        var checked = state.checks.indexOf(cidx) >= 0 ? ' checked' : '';
        return '<label><input type="checkbox" data-la-mini-check="'+esc(idx)+'" data-la-mini-check-index="'+esc(cidx)+'"'+checked+'> <span>'+esc(item)+'</span></label>';
      }).join('');
      return '<article class="la-mini-training-task" data-la-mini-training-task="'+esc(idx+1)+'"><div class="la-mini-training-task-head"><span>'+esc(two(idx+1))+'</span><b>'+esc(task.title || ('Mini-Übung '+(idx+1)))+'</b><em>'+esc(task.kind || 'Übung')+'</em></div><p>'+esc(task.prompt || '')+'</p><div class="la-mini-training-expected"><b>Ziel:</b> '+esc(task.expected || 'gezielt üben')+'</div><label class="la-mini-training-answer-label">Deine Kurzlösung / Notiz<textarea data-la-mini-answer="'+esc(idx)+'" rows="4" placeholder="Schreibe hier deine Lösung, Begründung oder Kontrollnotiz…">'+esc(state.answer)+'</textarea></label>'+(checklist?'<div class="la-mini-training-checklist">'+checklist+'</div>':'')+'<details class="la-mini-training-solution"><summary>Musterlösung / Prüflogik anzeigen</summary><p>'+esc(task.solution || '')+'</p></details></article>';
    }).join('');
    return '<section class="la-mini-training-set" data-la-mini-training-set="phase38e5"><div class="la-exam-entry-head"><span class="la-section-kicker">Mini-Übungsset mit Fortschritt · Phase 38E.5</span><em>'+esc(set.pressure || 'Training')+'</em></div><h4>'+esc(set.title || 'Mini-Übungsset')+'</h4><p class="la-note">Bearbeite die Mini-Aufgaben schriftlich, hake die Checkliste ab und werte das Set aus. Der Fortschritt wird lokal gespeichert und im Dashboard sichtbar.</p><div class="la-mini-training-grid">'+tasks+'</div>'+miniTrainingResultHtml(session)+'<div class="la-level-actions"><button type="button" class="la-secondary" data-ui-action="language-exam-mini-evaluate">Mini-Übungen auswerten</button><button type="button" class="la-secondary" data-ui-action="language-exam-mini-reset">Mini-Antworten zurücksetzen</button></div></section>';
  }

  function buildWeaknessProfile(level, item){
    level = normalizeLevel(level || (item && item.level) || 'B1');
    item = item || null;
    var entries = PARTS.map(function(part){
      var min = partMinTarget(level, part);
      var score = partScoreFromItem(item, part);
      var band = weaknessBand(score, min);
      return { part:part, label:PART_LABELS[part], score:score, minScore:min, band:band, reason:partWeaknessReason(part, band, score, min), training:trainingPlanForPart(level, part, band) };
    });
    var priority = entries.slice().sort(function(a,b){
      var weight = { critical:0, weak:1, open:2, borderline:3, stable:4 };
      var wa = weight[a.band] == null ? 5 : weight[a.band];
      var wb = weight[b.band] == null ? 5 : weight[b.band];
      if(wa !== wb) return wa - wb;
      return Number(a.score == null ? -1 : a.score) - Number(b.score == null ? -1 : b.score);
    });
    var critical = entries.filter(function(e){ return e.band === 'critical' || e.band === 'weak' || e.band === 'open'; });
    var borderline = entries.filter(function(e){ return e.band === 'borderline'; });
    var stable = entries.filter(function(e){ return e.band === 'stable'; });
    var action = critical.length ? 'Erst ' + critical[0].label + ' gezielt trainieren, dann neue Simulation starten.' : (borderline.length ? borderline[0].label + ' stabilisieren, damit das Bestehen nicht kippt.' : 'Niveau halten und nächsthöhere Prüfung vorbereiten.');
    return { level:level, targetScore:levelTarget(level), entries:entries, priority:priority, critical:critical, borderline:borderline, stable:stable, action:action };
  }
  function weaknessProfileHtml(level, item){
    var profile = buildWeaknessProfile(level, item);
    var cards = profile.priority.slice(0,5).map(function(entry){
      var score = entry.score == null ? 'offen' : entry.score + '%';
      return '<article class="la-weakness-card is-'+esc(entry.band)+'" data-la-training-card="'+esc(entry.part)+'"><div><span>'+esc(entry.label)+'</span><b>'+esc(score)+'</b><small>Ziel: '+esc(entry.minScore)+'%</small></div><p>'+esc(entry.reason)+'</p><em>'+esc(entry.training.intensity)+' · ca. '+esc(entry.training.minutes)+' Min. · 3 Mini-Übungen</em><ul>'+entry.training.steps.map(function(step){ return '<li>'+esc(step)+'</li>'; }).join('')+'</ul>'+(isSimulationContext()?'<button type="button" class="la-secondary la-training-start" data-ui-action="language-course-open">Im Sprachtraining üben</button>':'<button type="button" class="la-primary la-training-start" data-ui-action="language-exam-training-start" data-la-training-level="'+esc(profile.level)+'" data-la-training-part="'+esc(entry.part)+'">Mini-Training starten</button>')+'</article>';
    }).join('');
    var summary = '<div class="la-weakness-summary"><div><b>'+esc(profile.critical.length)+'</b><small>kritisch/offen</small></div><div><b>'+esc(profile.borderline.length)+'</b><small>knapp</small></div><div><b>'+esc(profile.stable.length)+'</b><small>stabil</small></div></div>';
    return '<section class="la-card la-weakness-profile" data-la-weakness-profile="phase38e5"><div class="la-exam-entry-head"><span class="la-section-kicker">Schwächenprofil · Phase 38E.5</span><em>'+esc(profile.level)+' Trainingspfad</em></div><h3>Lernstandsdetails und gezielte Trainingspfade</h3><p class="la-note">Die App betrachtet nicht nur den Gesamtscore, sondern jeden Prüfungsteil einzeln. Kritische oder offene Teile werden zuerst trainiert, knappe Teile werden stabilisiert, starke Teile bleiben im Erhaltungsmodus.</p>'+summary+'<div class="la-weakness-grid">'+cards+'</div><div class="la-exam-report-box is-next"><h4>Nächster gezielter Schritt</h4><p>'+esc(profile.action)+'</p></div></section>';
  }
  function saveTrainingState(session){
    try{ localStorage.setItem(TRAINING_KEY, JSON.stringify({ level:normalizeLevel(session.level), part:session.trainingFocus && session.trainingFocus.part, band:session.trainingFocus && session.trainingFocus.band, miniProgress:session.trainingFocus && session.trainingFocus.miniProgress || null, updatedAt:nowIso() })); }catch(e){}
  }
  function trainingProfileFor(level, part, sourceItem){
    var profile = buildWeaknessProfile(level, sourceItem || null);
    var found = profile.entries.filter(function(entry){ return entry.part === part; })[0];
    return found || { part:part, label:PART_LABELS[part] || part, score:null, minScore:partMinTarget(level,part), band:'open', training:trainingPlanForPart(level,part,'open') };
  }
  function startTraining(level, part){
    level = normalizeLevel(level || 'B2');
    part = PARTS.indexOf(part) >= 0 ? part : 'grammar';
    var history = loadHistory();
    var item = history.filter(function(x){ return normalizeLevel(x.level) === level; })[0] || null;
    var entry = trainingProfileFor(level, part, item);
    var session = defaultSession(level);
    session.status = 'training';
    session.strictMode = false;
    session.currentPart = part;
    session.trainingFocus = {
      level:level,
      part:part,
      label:entry.label,
      band:entry.band,
      targetScore:entry.minScore,
      minutes:entry.training && entry.training.minutes ? entry.training.minutes : 20,
      intensity:entry.training && entry.training.intensity ? entry.training.intensity : 'Training',
      steps:entry.training && entry.training.steps ? entry.training.steps.slice(0,5) : [],
      miniSet:miniTrainingSetFor(level, part, entry.band),
      createdAt:nowIso(),
      source:'weakness-profile',
      miniAnswers:{},
      miniChecks:{},
      miniProgress:null
    };
    session.partStartedAt = Object.assign({}, session.partStartedAt || {});
    session.partStartedAt[part] = nowIso();
    saveTrainingState(session);
    return renderSession(saveSession(session));
  }
  function trainingModeBanner(session){
    if(!session || session.status !== 'training' || !session.trainingFocus) return '';
    var f = session.trainingFocus;
    var steps = Array.isArray(f.steps) ? f.steps : [];
    return '<section class="la-card la-training-mode-banner" data-la-training-mode="phase38e5"><div class="la-exam-entry-head"><span class="la-section-kicker">Trainingsmodus · Phase 38E.5</span><em>'+esc(f.intensity || 'Training')+' · '+esc(f.minutes || 20)+' Min.</em></div><h3>'+esc(PART_ICONS[f.part] || '🎯')+' '+esc(f.label || PART_LABELS[f.part] || f.part)+' gezielt trainieren</h3><p class="la-note">Dieser Modus startet direkt aus deinem Schwächenprofil. Er ist kein kompletter Prüfungsversuch, sondern ein fokussierter Trainingsblock für genau den Teil, der dich aktuell am stärksten bremst.</p><div class="la-training-target-grid"><div><b>'+esc(session.level)+'</b><small>Niveau</small></div><div><b>'+esc(f.targetScore || partMinTarget(session.level,f.part))+'%</b><small>Zielwert</small></div><div><b>'+esc(f.band || 'open')+'</b><small>Status</small></div></div>'+(steps.length?'<ul class="la-training-step-list">'+steps.map(function(step){ return '<li>'+esc(step)+'</li>'; }).join('')+'</ul>':'')+miniTrainingSetHtml(session)+'<div class="la-level-actions"><button type="button" class="la-secondary" data-ui-action="language-exam-home">Zur Übersicht</button><button type="button" class="la-primary" data-ui-action="language-exam-training-finish">Training abschließen</button></div></section>';
  }
  function finishTraining(){
    var session = loadSession() || defaultSession('B2');
    if(session.status === 'training'){
      var miniResult = evaluateMiniTraining(session);
      session.trainingFocus.miniProgress = miniResult;
      persistTrainingProgress(session, miniResult);
      session.status = 'training-completed';
      session.updatedAt = nowIso();
      session.examWarnings = (session.examWarnings || []).concat(['Trainingsmodus aus Schwächenprofil abgeschlossen. Für Prüfungsreife anschließend vollständige Simulation starten.']);
      saveSession(session);
    }
    return renderHome();
  }

  function dashboardHtml(existing){
    var progress = currentProgressByLevel(existing);
    var levels = ['A1','A2','B1','B2'];
    var rows = levels.map(function(level){
      var req = requirementMini(level);
      var item = progress[level] || null;
      var score = item ? Number(item.overallScore || 0) : 0;
      var status = !item ? 'noch offen' : (item.active ? 'aktiv' : (item.passed ? 'bestanden' : 'nicht bestanden'));
      var cls = !item ? 'is-open' : (item.passed ? 'is-pass' : (item.active ? 'is-active' : 'is-fail'));
      return '<article class="la-exam-dashboard-level '+cls+'" data-la-dashboard-level="'+esc(level)+'"><div><span>'+esc(level)+'</span><b>'+esc(score || '—')+(score?'%':'')+'</b><small>'+esc(status)+' · '+esc(item ? ((item.completedParts||0)+'/'+PARTS.length+' Teile') : '0/'+PARTS.length+' Teile')+'</small>'+pctBar(score)+'</div><ul><li>Schreiben: '+esc(req.writing)+' Wörter</li><li>Sprechen: '+esc(req.speaking)+' Wörter</li><li>Grammatik: '+esc(req.grammar)+'</li><li>Fokus: '+esc(req.focus)+'</li></ul><em>'+esc(nextRecommendation(level,item))+'</em><button type="button" class="la-secondary" data-ui-action="language-exam-start" data-la-exam-level="'+esc(level)+'">'+esc(level)+' starten</button></article>';
    }).join('');
    var history = loadHistory();
    var hist = history.length ? history.slice(0,5).map(function(item){ return '<li><b>'+esc(item.level)+' · '+esc(item.overallScore)+'%</b><span>'+esc(item.passed?'bestanden':'nicht bestanden')+' · '+esc(item.readiness || 'Bewertung')+'</span></li>'; }).join('') : '<li><span>Noch kein abgeschlossener Versuch gespeichert.</span></li>';
    return '<section class="la-card la-exam-dashboard-overview" data-la-exam-dashboard="phase8s"><div class="la-exam-entry-head"><span class="la-section-kicker">Prüfungsdashboard</span><em>A1–B2</em></div><h3>Gesamtübersicht: Niveau, Lernstand und nächste Schritte</h3><p class="la-note">Das Dashboard vergleicht A1 bis B2 nicht nur optisch, sondern nach echten Anforderungen: Wortumfang, Grammatik, Aufgabenhärte, Pflichtteile und gespeicherte Versuchsergebnisse.</p><div class="la-exam-dashboard-grid">'+rows+'</div><div class="la-exam-history"><b>Letzte abgeschlossene Versuche</b><ul>'+hist+'</ul></div>'+trainingProgressSummaryHtml((existing&&existing.level)||'B2')+weaknessProfileHtml((existing&&existing.level)||'B2', progress[(existing&&existing.level)||'B2'] || history[0] || null)+'<div class="la-exam-warning"><b>Arbeitslogik:</b> Nicht nur Gesamtscore zählen. Für Prüfungsreife müssen alle fünf Teile abgeschlossen sein und die Mindestleistungen pro Teil stabil sitzen. Die Auswertung zeigt daraus konkrete Trainingspfade.</div></section>';
  }


  function variantDurationSummary(level, variant){
    var bp = getBlueprint(level) || {};
    var model = calibrationEngine()&&calibrationEngine().timeModel?calibrationEngine().timeModel(level,bp):null;
    var total = model?Number(model.totalMinutes||0):PARTS.reduce(function(sum,p){ var parts=bp.parts||{}; return sum+Number((parts[p]&&parts[p].durationMinutes)||0); },0);
    return total ? (total + ' Min · kalibriert') : 'niveauabhängig';
  }
  function variantPreviewHtml(level, variant){
    level = normalizeLevel(level);
    var lang = simulationLanguage();
    var v = normalizeExamVariant(level, variant, lang);
    var reading = generatedObjectivePart(level,'reading',v,lang);
    var listening = generatedObjectivePart(level,'listening',v,lang);
    var grammar = generatedObjectivePart(level,'grammar',v,lang);
    var writing = generatedFreeTask(level,'writing',v,lang);
    var speaking = generatedFreeTask(level,'speaking',v,lang);
    var calibrated=v&&v.calibration&&v.calibration.calibrated;
    return '<ul class="la-exam-variant-parts"><li><b>Lesen</b><span>'+esc(reading.title || 'Lesen')+' · '+esc((reading.questions||[]).length)+' Fragen</span></li><li><b>Hören</b><span>'+esc(listening.title || 'Hören')+' · '+esc((listening.questions||[]).length)+' Fragen</span></li><li><b>Grammatik</b><span>'+esc(grammar.title || 'Grammatik')+' · '+esc((grammar.questions||[]).length)+' Fragen</span></li><li><b>Schreiben</b><span>'+esc(writing.title || 'Schreiben')+' · '+esc(writing.minWords)+'–'+esc(writing.maxWords)+' Wörter</span></li><li><b>Sprechen</b><span>'+esc(speaking.title || 'Sprechen')+' · '+esc(speaking.minWords)+'–'+esc(speaking.maxWords)+' Wörter</span></li></ul>'+(calibrated?'<div class="la-exam-calibration-badge"><b>Kalibrierte Hardmode-Variante</b><span>Aufgabenumfang, Zeitmodell und Teilgewichtung geprüft.</span></div>':'');
  }
  function variantCard(level, variant, index){
    var v = normalizeExamVariant(level, variant);
    return '<article class="la-card la-exam-variant-card" data-la-exam-variant-card="'+esc(v.id)+'"><div class="la-exam-entry-head"><span class="la-section-kicker">Variante '+esc(index+1)+' · '+esc(level)+'</span><em>'+esc(variantDurationSummary(level,v))+'</em></div><h3>'+esc(v.label)+' · '+esc(v.theme)+'</h3><p class="la-note">Komplette Vollprüfung mit allen fünf Pflichtteilen. Diese Variante bleibt bis zum Neustart gespeichert.</p>'+variantPreviewHtml(level,v)+'<div class="la-level-actions"><button type="button" class="la-primary" data-ui-action="language-exam-start" data-la-exam-level="'+esc(level)+'" data-la-exam-variant="'+esc(v.id)+'">Diese Variante starten</button></div></article>';
  }
  function randomVariantSeed(level){
    var salt = String(Date.now()) + '|' + Math.random() + '|' + String(level || 'B1');
    var hash = 0;
    for(var i=0;i<salt.length;i++){ hash = ((hash << 5) - hash) + salt.charCodeAt(i); hash |= 0; }
    return Math.abs(hash);
  }
  function renderVariantSelection(level){
    level = normalizeLevel(level || 'B1');
    setContext(isSimulationContext() ? simulationContextFor(simulationLanguage()) : getContext());
    var lang = simulationLanguage();
    var langLabel = simulationLanguageLabel();
    if(isSimulationContext() && !fullExamReadyForSimulation(level)) return renderSimulationHome(lang);
    var pool = fullExamVariantPool(level, lang);
    var body = '<div class="la-dashboard la-exam-shell la-exam-variant-selection" data-la-exam-variant-selection="G54.44.4" data-la-exam-language="'+esc(lang)+'" data-la-exam-level="'+esc(level)+'">' +
      '<section class="la-card la-exam-hero"><span class="la-section-kicker">Variantenauswahl · '+esc(langLabel)+' '+esc(level)+'</span><h3>Welche Vollprüfungsvariante willst du starten?</h3><p>Jede Variante ist eine vollständige Sprachtest-Simulation mit Lesen, Hören, Grammatik & Sprachbausteinen, Schreiben und Sprechen. Der Random-Modus wählt eine Variante automatisch, damit du nicht auswendig lernst.</p><div class="la-exam-warning"><b>Regel bleibt aktiv:</b> Auch bei Variantenauswahl gibt es keine Teiltests als Simulation. Gestartet wird immer eine komplette Vollprüfung.</div></section>'+
      '<section class="la-card la-exam-random-card"><div class="la-exam-entry-head"><span class="la-section-kicker">Empfohlen</span><em>Anti-Auswendiglernen</em></div><h3>Random-Modus starten</h3><p class="la-note">Wählt automatisch eine der '+esc(pool.length)+' Varianten. Ideal für echte Prüfungsnähe und Wiederholung ohne Vorwissen.</p><div class="la-exam-mini-grid"><div><b>'+esc(pool.length)+'</b><small>Varianten</small></div><div><b>5/5</b><small>Pflichtteile</small></div><div><b>Coach</b><small>nach Abschluss</small></div></div><div class="la-level-actions"><button type="button" class="la-primary" data-ui-action="language-exam-start" data-la-exam-level="'+esc(level)+'" data-la-exam-variant="random">Zufällige Variante starten</button><button type="button" class="la-secondary" data-ui-action="language-exam-simulation-home">Zur Übersicht</button></div></section>'+
      '<section class="la-exam-variant-grid">'+pool.map(function(v,i){ return variantCard(level,v,i); }).join('')+'</section>'+
      '<section class="la-card"><div class="la-level-actions"><button type="button" class="la-secondary" data-ui-action="language-exam-simulation-home">Zurück zur Sprachtest-Übersicht</button><button type="button" class="la-secondary" data-ui-action="language-course-open">Sprachtraining öffnen</button></div></section>'+
      '</div>';
    return openSheet(langLabel+' '+level+' · Variantenauswahl', 'Vollprüfung wählen oder Random-Modus starten.', body, '🎲');
  }

  function renderSimulationHome(language){
    language = normalizeExamLanguage(language || 'de');
    setContext(simulationContextFor(language));
    var langLabel = language === 'en' ? 'Englisch' : 'Deutsch';
    var activeContext = simulationContextFor(language);
    var existing = loadSession();
    var active = existing && existing.context === activeContext ? existing : null;
    var body = '<div class="la-dashboard la-exam-shell la-simulation-language-exam" data-la-exam-shell="phase44-3" data-la-simulation-language="'+esc(language)+'">' +
      '<section class="la-card la-exam-hero"><span class="la-section-kicker">Sprachtest-Simulation · '+esc(langLabel)+'</span><h3>'+esc(langLabel)+'-Vollprüfung A1–C2 aktiv · mehrere Varianten</h3><p>Diese Simulation ist immer eine komplette Prüfung. Es gibt keine Teilprüfungsauswahl und keine Hilfen während des Tests. Jedes Niveau besitzt mehrere Vollprüfungsvarianten. Auswertung, Prognose und Coach-Hinweise erscheinen erst nach Abschluss.</p><div class="la-exam-warning"><b>Simulationsregel:</b> Alles hier ist Vollprüfung. Einzelne Bereiche wie Lesen, Hören, Schreiben oder Sprechen gehören ins Sprachtraining.</div></section>' +
      (active ? '<section class="la-card la-exam-active"><span class="la-section-kicker">Aktiver '+esc(langLabel)+'-Sprachtest</span><h3>'+esc(active.level)+' Vollprüfung fortsetzen</h3><p>Aktueller Pflichtteil: <b>'+esc(PART_LABELS[active.currentPart] || active.currentPart)+'</b> · Status: '+esc(active.status)+'</p><div class="la-level-actions"><button type="button" class="la-primary" data-ui-action="language-exam-resume">Fortsetzen</button><button type="button" class="la-secondary" data-ui-action="language-exam-reset">Neu starten</button></div></section>' : '') +
      '<section class="la-card"><span class="la-section-kicker">Niveau wählen</span><h3>Welche fertige '+esc(langLabel)+'-Vollprüfung willst du simulieren?</h3><p class="la-note">Wähle zuerst das Niveau. Danach erscheint die Variantenauswahl mit Random-Modus. '+esc(langLabel)+' läuft als echte Vollprüfung im Simulation Center.</p><div class="la-exam-level-grid">'+levelList().map(levelCard).join('')+'</div></section>' +
      '<section class="la-card"><span class="la-section-kicker">Prüfungsumfang</span><div class="la-exam-mini-grid"><div><b>5</b><small>Pflichtteile</small></div><div><b>Vollprüfung</b><small>keine Teiltests</small></div><div><b>ohne Hilfe</b><small>Coach danach</small></div></div><div class="la-exam-warning"><b>Trennung aktiv:</b> Sprachtraining bleibt Lernen/Üben. Sprachtest-Simulation bleibt Prüfen/Simulieren.</div><div class="la-level-actions"><button type="button" class="la-secondary" data-ui-action="language-exam-language-choice">Sprache wechseln</button><button type="button" class="la-secondary" data-ui-action="simulation-center">Zurück zum Simulation Center</button><button type="button" class="la-secondary" data-ui-action="language-course-open">Sprachtraining öffnen</button></div></section>' +
    '</div>';
    return openSheet('Sprachtest-Simulation · '+langLabel, 'Vollprüfung ohne Hilfe · Ergebnis und Coach danach.', body, '🎓');
  }

  function renderSimulationHomeGerman(){
    return renderSimulationHome('de');
  }
  function renderSimulationHomeEnglish(){
    return renderSimulationHome('en');
  }
  function renderSimulationLanguageChoice(){
    setContext('training');
    var body='<div class="la-dashboard la-exam-shell la-simulation-language-choice" data-la-exam-language-choice="G54.44.4">'+
      '<section class="la-card la-exam-hero"><span class="la-section-kicker">Sprachtest-Simulation</span><h3>Deutsch oder Englisch als Vollprüfung starten</h3><p>Wähle die Sprache. Danach wählst du A1–C2, Variante oder Random. Es werden immer alle fünf Pflichtteile geprüft.</p><div class="la-exam-warning"><b>Regel:</b> Simulation Center = Vollprüfung. Teilbereiche bleiben im Sprachtraining.</div></section>'+
      '<section class="la-exam-variant-grid"><article class="la-card la-exam-variant-card"><span class="la-section-kicker">Deutsch A1–C2</span><h3>Deutsch-Vollprüfung</h3><p class="la-note">3 Varianten pro Level, Random-Modus, Ergebnis- und Coach-Auswertung.</p><div class="la-level-actions"><button class="la-primary" type="button" data-ui-action="language-exam-open-de">Deutsch öffnen</button></div></article><article class="la-card la-exam-variant-card"><span class="la-section-kicker">Englisch A1–C2</span><h3>English Full Exam</h3><p class="la-note">3 variants per level, random mode, full result and coach report.</p><div class="la-level-actions"><button class="la-primary" type="button" data-ui-action="language-exam-open-en">Englisch öffnen</button></div></article></section>'+
      '</div>';
    return openSheet('Sprachtest-Simulation', 'Deutsch und Englisch als Vollprüfung.', body, '🎓');
  }

  function renderSimulationHomeGermanOldDisabled(){
    setContext('simulation-de');
    var existing = loadSession();
    var active = existing && existing.context === 'simulation-de' ? existing : null;
    var body = '<div class="la-dashboard la-exam-shell la-simulation-language-exam" data-la-exam-shell="phase8s" data-la-simulation-language="de">' +
      '<section class="la-card la-exam-hero"><span class="la-section-kicker">Sprachtest-Simulation · Deutsch</span><h3>Deutsch-Vollprüfung A1–C2 aktiv · mehrere Varianten</h3><p>Diese Simulation ist immer eine komplette Prüfung. Es gibt keine Teilprüfungsauswahl und keine Hilfen während des Tests. Jedes Niveau besitzt jetzt mehrere Vollprüfungsvarianten. Auswertung, Prognose und Coach-Hinweise erscheinen erst nach Abschluss.</p><div class="la-exam-warning"><b>Simulationsregel:</b> Alles hier ist Vollprüfung. Einzelne Bereiche wie Lesen, Hören, Schreiben oder Sprechen gehören ins Sprachtraining.</div></section>' +
      (active ? '<section class="la-card la-exam-active"><span class="la-section-kicker">Aktiver Deutsch-Sprachtest</span><h3>'+esc(active.level)+' Vollprüfung fortsetzen</h3><p>Aktueller Pflichtteil: <b>'+esc(PART_LABELS[active.currentPart] || active.currentPart)+'</b> · Status: '+esc(active.status)+'</p><div class="la-level-actions"><button type="button" class="la-primary" data-ui-action="language-exam-resume">Fortsetzen</button><button type="button" class="la-secondary" data-ui-action="language-exam-reset">Neu starten</button></div></section>' : '') +
      '<section class="la-card"><span class="la-section-kicker">Niveau wählen</span><h3>Welche fertige Deutsch-Vollprüfung willst du simulieren?</h3><p class="la-note">Wähle zuerst das Niveau. Danach erscheint die Variantenauswahl mit Random-Modus. Deutsch ist zuerst aktiv; Englisch folgt später sauber getrennt.</p><div class="la-exam-level-grid">'+levelList().map(levelCard).join('')+'</div></section>' +
      '<section class="la-card"><span class="la-section-kicker">Prüfungsumfang</span><div class="la-exam-mini-grid"><div><b>5</b><small>Pflichtteile</small></div><div><b>Vollprüfung</b><small>keine Teiltests</small></div><div><b>ohne Hilfe</b><small>Coach danach</small></div></div><div class="la-exam-warning"><b>Trennung aktiv:</b> Sprachtraining bleibt Lernen/Üben. Sprachtest-Simulation bleibt Prüfen/Simulieren.</div><div class="la-level-actions"><button type="button" class="la-secondary" data-ui-action="simulation-center">Zurück zum Simulation Center</button><button type="button" class="la-secondary" data-ui-action="language-course-open">Sprachtraining öffnen</button></div></section>' +
    '</div>';
    return openSheet('Sprachtest-Simulation · Deutsch', 'Vollprüfung ohne Hilfe · Ergebnis und Coach danach.', body, '🎓');
  }

  function renderHome(){
    if(!isSimulationContext()) setContext('training');
    var existing = loadSession();
    var body = '<div class="la-dashboard la-exam-shell" data-la-exam-shell="phase8s">' +
      '<section class="la-card la-exam-hero"><span class="la-section-kicker">Prüfungsübersicht</span><h3>Prüfungsnahe Deutsch-Vollprüfung</h3><p>Diese Prüfungsübersicht prüft mit Reserve: Mindestleistung, Pflichtpunkte, Themenbezug, Zeitdruck, Punktdeckelung und Prüfungsreife. Ziel: Wer diese Simulation stabil besteht, hat realistische Chancen, echte Prüfungen deutlich sicherer anzugehen. A1 bis B2 werden im Dashboard vergleichbar: Versuchsergebnisse, Wortumfang, Grammatikniveau, Pflichtteile und nächste Trainingsschritte werden sichtbar gebündelt.</p><div class="la-exam-warning"><b>Wichtig:</b> Kein offizielles Zertifikat und keine Garantie. Es ist eine interne Deutsch-Prüfungssimulation mit bewusst strenger Messlatte.</div></section>' + dashboardHtml(existing) +
      (existing ? '<section class="la-card la-exam-active"><span class="la-section-kicker">Aktiver Versuch</span><h3>'+esc(existing.level)+' Prüfung fortsetzen</h3><p>Aktueller Teil: <b>'+esc(PART_LABELS[existing.currentPart] || existing.currentPart)+'</b> · Status: '+esc(existing.status)+'</p><div class="la-level-actions"><button type="button" class="la-primary" data-ui-action="language-exam-resume">Fortsetzen</button><button type="button" class="la-secondary" data-ui-action="language-exam-reset">Neuen Versuch starten</button></div></section>' : '') +
      '<section class="la-card"><span class="la-section-kicker">Niveau wählen</span><h3>Welche Prüfung willst du simulieren?</h3><div class="la-exam-level-grid">'+levelList().map(levelCard).join('')+'</div></section>' +
      '<section class="la-card"><span class="la-section-kicker">Bewertungsprinzip</span><div class="la-exam-warning"><b>Level-Garantie:</b> Der Aufbau bleibt gleich, aber Textlänge, Wortumfang, Grammatik, Pflichtpunkte, Punktdeckelung und Groq-Prüferrolle sind pro Niveau unterschiedlich. Eine A1-Antwort darf B2 nicht bestehen.</div><div class="la-exam-rubric-grid"><div><b>Lesen/Hören</b><small>lokal, objektiv, zeitlich geführt</small></div><div><b>Grammatik</b><small>lokal, hart, keine KI-Limits</small></div><div><b>Schreiben/Sprechen</b><small>prüfungsnah bewertet</small></div><div><b>Prüfungsdruck</b><small>Timer, Status, Warnungen</small></div></div></section>' +
      '<section class="la-card"><div class="la-level-actions"><button type="button" class="la-secondary" data-ui-action="language-course-open">Zurück zum Sprachtraining</button></div></section>' +
    '</div>';
    return openSheet('Sprachtest-Übersicht', 'Training-nahe Prüfungsübersicht · Vollsimulation ist im Simulation Center.', body, '🎓');
  }
  function partDurationSeconds(session, partName){
    var bp = getBlueprint(session.level) || {};
    var model = calibrationEngine()&&calibrationEngine().timeModel?calibrationEngine().timeModel(session.level,bp):null;
    var minutes = model&&model.parts?Number(model.parts[partName]||0):0;
    if(!minutes){ var part = (bp.parts && bp.parts[partName]) || {}; minutes=Number(part.durationMinutes || 10); }
    return Math.max(60, minutes * 60);
  }
  function partTimeState(session, partName){
    session = normalizeSession(session || defaultSession('B1'));
    partName = partName || session.currentPart || 'reading';
    var total = partDurationSeconds(session, partName);
    var started = session.partStartedAt && session.partStartedAt[partName] ? session.partStartedAt[partName] : session.startedAt;
    var elapsed = Math.max(0, Math.floor((Date.now() - isoMs(started)) / 1000));
    var remaining = Math.max(0, total - elapsed);
    var pctLeft = clamp(Math.round((remaining / total) * 100), 0, 100);
    var state = remaining <= 0 ? 'expired' : (pctLeft <= 15 ? 'danger' : (pctLeft <= 35 ? 'warning' : 'ok'));
    return { total:total, elapsed:elapsed, remaining:remaining, pctLeft:pctLeft, state:state, startedAt:started };
  }
  function completionState(session){
    var done = PARTS.filter(function(p){ return !!(session.parts && session.parts[p]); }).length;
    return { done:done, total:PARTS.length, pct:Math.round((done / PARTS.length) * 100) };
  }
  function partPressureNotice(session){
    var ts = partTimeState(session, session.currentPart);
    if(ts.state === 'expired') return 'Zeit rechnerisch abgelaufen. Du kannst technisch weiterarbeiten, aber der Bericht markiert den Teil als kritisch.';
    if(ts.state === 'danger') return 'Nur noch wenig Zeit. Jetzt nicht perfektionieren, sondern Pflichtpunkte vollständig sichern.';
    if(ts.state === 'warning') return 'Zeitdruck beginnt. Prüfe Pflichtpunkte, bevor du weitergehst.';
    return 'Bearbeite ruhig, aber prüfungsnah. Die Simulation speichert deine Eingaben automatisch.';
  }
  function examPressureBar(session){
    var current = session.currentPart || 'reading';
    var ts = partTimeState(session, current);
    var cs = completionState(session);
    return '<section class="la-card la-exam-pressure is-'+esc(ts.state)+'" data-la-exam-timer-root="1">' +
      '<div class="la-exam-pressure-top"><span class="la-section-kicker">Prüfungsdruck aktiv</span><b>'+esc(PART_LABELS[current])+' · <span data-la-exam-timer="1" data-la-exam-start="'+esc(ts.startedAt)+'" data-la-exam-total="'+esc(ts.total)+'">'+esc(formatSeconds(ts.remaining))+'</span></b></div>' +
      '<div class="la-exam-timebar"><span data-la-exam-timebar="1" style="width:'+esc(ts.pctLeft)+'%"></span></div>' +
      '<div class="la-exam-pressure-grid"><div><b>'+esc(formatSeconds(ts.elapsed))+'</b><small>verstrichen</small></div><div><b>'+esc(cs.done)+'/'+esc(cs.total)+'</b><small>Teile bewertet</small></div><div><b>'+esc(cs.pct)+'%</b><small>Fortschritt</small></div></div>' +
      '<p>'+esc(partPressureNotice(session))+'</p>' +
      '</section>';
  }
  function partNav(session){
    return '<div class="la-exam-part-nav">' + PARTS.map(function(p,idx){
      var done = !!(session.parts && session.parts[p]);
      var cls = 'la-exam-part-tab' + (session.currentPart === p ? ' is-active' : '') + (done ? ' is-done' : '');
      return '<button type="button" class="'+cls+'" data-ui-action="language-exam-open-part" data-la-exam-part="'+esc(p)+'"><span>'+esc(idx+1)+'</span><b>'+esc(PART_LABELS[p])+'</b><small>'+esc(done ? 'fertig' : 'offen')+'</small></button>';
    }).join('') + '</div>';
  }
  function variantStatusHtml(session){
    var v = normalizeExamVariant(session && session.level, session && session.examVariant, session && session.examLanguage);
    var mode = session && session.examVariantSelectionMode === 'random' ? 'Random-Modus' : 'gewählte Variante';
    return '<div class="la-exam-variant-status"><b>'+esc(mode)+': '+esc(v.label || v.id)+'</b><span>'+esc(v.theme || 'Vollprüfung')+'</span><small>Diese Variante gilt für alle fünf Prüfungsteile.</small></div>';
  }
  function examHeader(session){
    var bp = getBlueprint(session.level) || {};
    var current = session.currentPart || 'reading';
    var part = (bp.parts && bp.parts[current]) || {};
    return '<section class="la-card la-exam-session-head"><span class="la-section-kicker">'+esc(session.level)+' '+esc(simulationLanguageLabel(session.context))+'-Vollprüfung</span><h3>'+esc(PART_ICONS[current])+' '+esc(PART_LABELS[current])+'</h3><p>'+esc(bp.description || 'Prüfungsmodus')+'</p><div class="la-exam-mini-grid"><div><b>'+esc(part.durationMinutes || '—')+'</b><small>Minuten</small></div><div><b>'+esc(part.minScore || bp.partMinScore || '—')+'%</b><small>Mindestteil</small></div><div><b>'+esc(bp.passScore || 70)+'%</b><small>Bestehen</small></div></div><div class="la-exam-status-strip"><span>Automatisch gespeichert</span><span>Keine Hilfe im Prüfungsmodus</span><span>Pflichtpunkte zählen hart</span></div>'+partNav(session)+'</section>';
  }
  function getPilotPart(session, partName){
    if(session && isSimulationContext(session.context) && (partName === 'reading' || partName === 'listening' || partName === 'grammar')){
      return generatedObjectivePart(session.level, partName, session.examVariant, session.examLanguage || simulationLanguage(session.context));
    }
    var pilot = session ? pilotForLevel(session.level) : null;
    if(pilot){
      var key = attemptKeyForLevel(session.level);
      if(session[key] && typeof pilot.getAttemptPart === 'function') return pilot.getAttemptPart(session[key], partName);
      if(typeof pilot.get === 'function') return pilot.get(partName);
    }
    if(partName === 'reading' || partName === 'listening' || partName === 'grammar'){
      return generatedObjectivePart(session && session.level ? session.level : 'B1', partName, session && session.examVariant, session && session.examLanguage);
    }
    return null;
  }
  function listeningState(session, pilot){
    var key = pilot && pilot.id ? pilot.id : 'default-listening';
    var all = Object.assign({}, session.listeningAudio || {});
    return Object.assign({
      key:key,
      plays:0,
      revealed:false,
      lastPlayedAt:null,
      lastTextLength:0,
      audioMode:'not-started',
      strictAudio:true,
      helperMode:false,
      fallbackUsed:false,
      lastError:null
    }, all[key] || {});
  }
  function defaultListeningTexts(level){
    level = normalizeLevel(level || 'B1');
    if(level === 'B2'){
      return [
        { title:'Interview Weiterbildung', body:'Moderatorin: Viele Betriebe bieten Onlineweiterbildungen an. Expertin: Onlinekurse können sinnvoll sein, aber nur, wenn Betriebe feste Lernzeiten, klare Ziele und Rückmeldungen einplanen. Ohne diese Struktur brechen viele Teilnehmende ab oder wenden das Gelernte nicht an.' },
        { title:'Radiobeitrag Verkehr', body:'In der Innenstadt sollen Buslinien ausgebaut und Parkplätze reduziert werden. Einige Geschäftsleute fürchten weniger Kundschaft. Die Verwaltung erwartet dagegen weniger Staus, bessere Luft und zuverlässigere Wege. Entscheidend sei, dass Menschen ohne Auto nicht benachteiligt werden.' }
      ];
    }
    if(level === 'A1') return [{ title:'Kurze Durchsage', body:'Der Deutschkurs beginnt heute um achtzehn Uhr in Raum zwei. Bitte bringen Sie einen Stift und Ihren Ausweis mit.' }];
    if(level === 'A2') return [{ title:'Telefonnotiz', body:'Guten Tag, hier ist die Praxis Schneider. Ihr Termin morgen um zehn Uhr muss leider verschoben werden. Bitte kommen Sie am Freitag um elf Uhr oder rufen Sie uns zurück.' }];
    return [
      { title:'Durchsage im Bürgerbüro', body:'Wegen einer technischen Störung können heute keine neuen Ausweise beantragt werden. Fertige Ausweise können am Schalter drei abgeholt werden. Ersatztermine werden automatisch per E-Mail verschickt.' },
      { title:'Telefonnotiz der Arztpraxis', body:'Ihr Termin am Dienstag um neun Uhr muss verschoben werden. Wir bieten Ihnen Freitag um fünfzehn Uhr an. Bitte rufen Sie bis morgen zwölf Uhr zurück, wenn der Termin nicht passt.' }
    ];
  }
  function normalizeListeningTexts(list){
    return (Array.isArray(list) ? list : []).map(function(t, idx){
      if(typeof t === 'string') return { title:'Hörtext '+(idx+1), body:t };
      return { title:(t && (t.title || t.heading || t.label)) || ('Hörtext '+(idx+1)), body:String((t && (t.body || t.text || t.transcript || t.content)) || '').trim() };
    }).filter(function(t){ return t.body && t.body.length > 10; });
  }
  function listeningPayload(pilot, level){
    var raw = [];
    var source = 'fallback';
    if(pilot && Array.isArray(pilot.texts) && pilot.texts.length){ raw = pilot.texts; source = 'pilot-texts'; }
    if((!raw || !raw.length) && pilot && Array.isArray(pilot.audioTexts) && pilot.audioTexts.length){ raw = pilot.audioTexts; source = 'pilot-audioTexts'; }
    if((!raw || !raw.length) && pilot && pilot.transcript){ raw = [{ title:'Hörtext', body:String(pilot.transcript) }]; source = 'pilot-transcript'; }
    var texts = normalizeListeningTexts(raw);
    var fallbackUsed = false;
    if(!texts.length){ texts = normalizeListeningTexts(defaultListeningTexts(level)); fallbackUsed = true; source = 'level-fallback'; }
    var plain = texts.map(function(t, idx){ return 'Hörtext ' + (idx+1) + '. ' + (t.title || 'Situation') + '. ' + t.body; }).join(' ').replace(/\s+/g,' ').trim();
    if(!plain || plain.length < 20){
      texts = normalizeListeningTexts(defaultListeningTexts(level));
      fallbackUsed = true;
      source = 'emergency-fallback';
      plain = texts.map(function(t, idx){ return 'Hörtext ' + (idx+1) + '. ' + (t.title || 'Situation') + '. ' + t.body; }).join(' ').replace(/\s+/g,' ').trim();
    }
    return { texts:texts, plain:plain, source:source, fallbackUsed:fallbackUsed, textLength:plain.length };
  }
  function listeningTextsForPilot(pilot, level){ return listeningPayload(pilot, level).texts; }
  function listeningPlainText(pilot, level){ return listeningPayload(pilot, level).plain; }


  function fullExamLevelProfile(level){
    level = normalizeLevel(level || 'B1');
    var data = {
      A1:{
        readingTitle:'A1 Lesen · Alltagshinweis', listeningTitle:'A1 Hören · kurze Durchsage', grammarTitle:'A1 Grammatik · einfache Sätze',
        readingText:'Im Sprachkurs hängt ein Hinweis: Der A1-Kurs beginnt am Montag um 18 Uhr in Raum 204. Die Teilnehmenden sollen einen Ausweis, einen Stift und ein kleines Heft mitbringen. Wer zu spät kommt, soll an der Rezeption warten.',
        listeningText:'Guten Abend. Der Deutschkurs A1 beginnt heute um achtzehn Uhr. Bitte gehen Sie in Raum zwei null vier und bringen Sie Ihren Ausweis mit. Der Lehrer heißt Herr Schneider.',
        questions:{
          reading:[['a1r1','Wann beginnt der Kurs?','Am Montag um 18 Uhr','Am Freitag um 8 Uhr','Am Sonntag um 20 Uhr','a','Zeitangabe im Hinweis.'],['a1r2','Was sollen die Teilnehmenden mitbringen?','Ausweis, Stift und Heft','Sportkleidung und Wasser','Fahrkarte und Foto','a','Die Gegenstände stehen direkt im Text.'],['a1r3','Wo ist der Kurs?','In Raum 204','In der Cafeteria','Online zu Hause','a','Der Raum wird genannt.']],
          listening:[['a1l1','Wie heißt der Lehrer?','Herr Schneider','Frau Kaya','Herr Müller','a','Name im Hörtext.'],['a1l2','Wann beginnt der Kurs heute?','Um 18 Uhr','Um 10 Uhr','Um 15 Uhr','a','Zeitangabe im Hörtext.'],['a1l3','Was soll man mitbringen?','Den Ausweis','Den Laptop','Das Wörterbuch','a','Der Ausweis wird genannt.']],
          grammar:[['a1g1','Welche Form ist richtig?','Ich bin müde.','Ich ist müde.','Ich bist müde.','a','ich bin.'],['a1g2','Welche Frage ist korrekt?','Wo wohnst du?','Wo du wohnst?','Wo wohnen du?','a','Verbposition in der Frage.'],['a1g3','Setze ein: Das ___ mein Heft.','ist','bist','sind','a','Das ist.'],['a1g4','Welche Antwort passt zu „Guten Morgen“?','Guten Morgen','Gute Nacht','Tschüss','a','Passende Begrüßung.']]
        }
      },
      A2:{
        readingTitle:'A2 Lesen · Terminänderung', listeningTitle:'A2 Hören · Telefonnotiz', grammarTitle:'A2 Grammatik · Alltag und Perfekt',
        readingText:'Frau Demir schreibt an ihre Nachbarin: Morgen kann ich nicht zum gemeinsamen Einkauf kommen, weil ich einen Arzttermin habe. Ich kann aber am Freitag um 16 Uhr mitkommen. Wenn das nicht passt, rufen Sie mich bitte nach 18 Uhr an.',
        listeningText:'Hallo, hier ist die Praxis Schneider. Ihr Termin am Donnerstag um zehn Uhr muss leider verschoben werden. Wir können Ihnen Freitag um elf Uhr anbieten. Bitte rufen Sie bis morgen zurück.',
        questions:{
          reading:[['a2r1','Warum kann Frau Demir morgen nicht einkaufen?','Sie hat einen Arzttermin.','Sie fährt in den Urlaub.','Sie muss arbeiten.','a','Der Grund wird genannt.'],['a2r2','Wann kann sie stattdessen mitkommen?','Freitag um 16 Uhr','Montag um 9 Uhr','Donnerstag um 10 Uhr','a','Ersatztermin im Text.'],['a2r3','Was soll die Nachbarin tun, wenn es nicht passt?','Nach 18 Uhr anrufen','Eine E-Mail löschen','Zur Praxis gehen','a','Handlungsanweisung im Text.']],
          listening:[['a2l1','Welcher Termin wird verschoben?','Donnerstag um 10 Uhr','Freitag um 11 Uhr','Morgen um 18 Uhr','a','Alter Termin.'],['a2l2','Welcher neue Termin wird angeboten?','Freitag um 11 Uhr','Samstag um 16 Uhr','Montag um 8 Uhr','a','Neuer Vorschlag.'],['a2l3','Was soll die Person tun?','Bis morgen zurückrufen','Sofort bezahlen','Den Ausweis schicken','a','Bitte der Praxis.']],
          grammar:[['a2g1','Setze ein: Ich habe gestern Deutsch ___.','gelernt','lernen','lerne','a','Perfekt mit Partizip II.'],['a2g2','Welche Satzstellung ist korrekt?','Am Freitag kann ich kommen.','Am Freitag ich kann kommen.','Kann ich am Freitag kommen ich.','a','Verb auf Position 2.'],['a2g3','Setze ein: Ich komme nicht, ___ ich krank bin.','weil','deshalb','trotzdem','a','weil leitet den Grund ein.'],['a2g4','Welche Form ist höflich?','Könnten Sie mir bitte helfen?','Hilf sofort!','Du musst helfen!','a','Höfliche Bitte.']]
        }
      },
      B1:{
        readingTitle:'B1 Lesen · Kursanbieter und Beschwerde', listeningTitle:'B1 Hören · Bürgerbüro', grammarTitle:'B1 Grammatik · Sprachbausteine',
        readingText:'Ein Kursanbieter informiert: Wegen technischer Probleme fällt der Online-Unterricht am Dienstag aus. Die Teilnehmenden erhalten einen Ersatztermin am Donnerstag und zusätzlich Zugang zu einer Aufzeichnung. Wer an diesem Termin nicht teilnehmen kann, soll dem Sekretariat bis Mittwoch schreiben.',
        listeningText:'Wegen einer technischen Störung können heute im Bürgerbüro keine neuen Ausweise beantragt werden. Fertige Ausweise können am Schalter drei abgeholt werden. Ersatztermine werden automatisch per E-Mail verschickt.',
        questions:{
          reading:[['b1r1','Warum fällt der Unterricht aus?','Wegen technischer Probleme','Wegen Krankheit aller Teilnehmenden','Wegen Ferien','a','Ursache im Text.'],['b1r2','Welche Lösung bietet der Anbieter?','Ersatztermin und Aufzeichnung','Nur Geld zurück','Keine Lösung','a','Zwei Maßnahmen.'],['b1r3','Bis wann soll man schreiben, wenn der Termin nicht passt?','Bis Mittwoch','Bis Freitag','Bis Sonntag','a','Frist im Text.']],
          listening:[['b1l1','Was ist heute nicht möglich?','Neue Ausweise beantragen','Fertige Ausweise abholen','Eine E-Mail lesen','a','Störung betrifft neue Ausweise.'],['b1l2','Wo kann man fertige Ausweise abholen?','Am Schalter drei','In Raum 204','Am Bahnhof','a','Ort im Hörtext.'],['b1l3','Wie bekommt man Ersatztermine?','Automatisch per E-Mail','Nur telefonisch','Per Postkarte','a','Verfahren wird genannt.']],
          grammar:[['b1g1','Welche Satzstellung ist korrekt?','Wenn der Termin nicht passt, schreibe ich eine E-Mail.','Wenn passt der Termin nicht, ich schreibe eine E-Mail.','Wenn nicht passt Termin, schreibe ich.','a','Nebensatz + Hauptsatz.'],['b1g2','Setze ein: Ich interessiere mich ___ den Kurs.','für','auf','an','a','sich interessieren für.'],['b1g3','Welche Formulierung passt formell?','Ich bitte um eine Rückmeldung.','Schreib mir sofort.','Mach das schnell.','a','Formelle Bitte.'],['b1g4','Setze ein: Der Termin wurde ___.','verschoben','verschieben','verschiebt','a','Passiv/Partizip.']]
        }
      },
      B2:{
        readingTitle:'B2 Lesen · Stellungnahme digitale Bildung', listeningTitle:'B2 Hören · Interview Weiterbildung', grammarTitle:'B2 Grammatik · Register und Kohärenz',
        readingText:'Ein Kommentar beschreibt digitale Bildung als Chance, warnt aber vor sozialer Ungleichheit. Lernplattformen könnten individuelles Lernen erleichtern, sofern Schulen Geräte, Datenschutz und begleitete Lernzeiten sicherstellen. Ohne diese Voraussetzungen würden vor allem ohnehin benachteiligte Lernende zurückfallen.',
        listeningText:'Moderatorin: Viele Betriebe bieten Onlineweiterbildungen an. Expertin: Onlinekurse können sinnvoll sein, aber nur, wenn Betriebe feste Lernzeiten, klare Ziele und Rückmeldungen einplanen. Ohne diese Struktur brechen viele Teilnehmende ab oder wenden das Gelernte nicht an.',
        questions:{
          reading:[['b2r1','Welche Position vertritt der Kommentar?','Digitale Bildung ist möglich, braucht aber Bedingungen.','Digitale Bildung soll vollständig verboten werden.','Geräte allein lösen alle Probleme.','a','Ausgewogene Hauptaussage.'],['b2r2','Welche Voraussetzung wird genannt?','Datenschutz und begleitete Lernzeiten','Nur mehr Prüfungen','Weniger Unterricht','a','Bedingungen im Text.'],['b2r3','Wer wäre ohne Unterstützung besonders betroffen?','Benachteiligte Lernende','Nur Lehrkräfte','Nur Eltern','a','Folge im Text.']],
          listening:[['b2l1','Wann sind Onlinekurse laut Expertin sinnvoll?','Wenn Struktur, Ziele und Rückmeldung vorhanden sind','Wenn sie völlig freiwillig sind','Wenn niemand kontrolliert','a','Bedingung im Interview.'],['b2l2','Was passiert ohne Struktur?','Viele brechen ab oder nutzen das Gelernte nicht.','Alle bestehen automatisch.','Die Kurse werden günstiger.','a','Folge im Hörtext.'],['b2l3','Worauf zielt die Kritik?','Fehlende Begleitung im Betrieb','Zu viele Bücher','Zu lange Pausen','a','Indirekter Kritikpunkt.']],
          grammar:[['b2g1','___ digitale Angebote praktisch sind, ersetzen sie nicht jede persönliche Beratung.','Obwohl','Weil','Deshalb','a','Gegensatz.'],['b2g2','Welche Formulierung ist formell?','Ich halte diese Regelung für problematisch.','Das ist mega schlecht.','Gar kein Bock darauf.','a','Sachliches Register.'],['b2g3','Setze ein: Die Unterlagen ___ vor Kursbeginn verschickt.','werden','wird','hat','a','Plural Passiv.'],['b2g4','Welche Verknüpfung passt?','Die Maßnahme ist teuer; dennoch kann sie langfristig helfen.','Die Maßnahme ist teuer, weil trotzdem.','Teuer die Maßnahme dennoch helfen.','a','Kohärente Verknüpfung.']]
        }
      },
      C1:{
        readingTitle:'C1 Lesen · komplexer Sachtext', listeningTitle:'C1 Hören · Fachgespräch', grammarTitle:'C1 Sprachbausteine · Präzision und Nominalstil',
        readingText:'Der Text argumentiert, dass KI-gestützte Lernsysteme weder als bloße Effizienzwerkzeuge noch als Ersatz pädagogischer Beziehung verstanden werden sollten. Entscheidend sei, ob ihre Einführung didaktisch begründet, transparent evaluiert und sozial abgefedert werde. Andernfalls bestehe die Gefahr, dass technische Innovation pädagogische Verantwortung verdeckt.',
        listeningText:'In der Diskussion betont die Expertin, dass Automatisierung zwar Routinetätigkeiten entlasten könne, aber nur dann produktiv wirke, wenn Beschäftigte qualifiziert und Entscheidungswege transparent bleiben. Kritisch sieht sie, dass Unternehmen Effizienz versprechen, ohne Weiterbildung verbindlich einzuplanen.',
        questions:{
          reading:[['c1r1','Welche Hauptthese passt am besten?','KI-Lernsysteme brauchen didaktische Begründung und soziale Absicherung.','KI ersetzt pädagogische Beziehung vollständig.','Technische Innovation ist immer pädagogisch neutral.','a','Abgewogene Hauptthese.'],['c1r2','Welche Gefahr wird beschrieben?','Technik kann pädagogische Verantwortung verdecken.','Schulen bekommen zu viele Bücher.','Lernende schreiben weniger mit der Hand.','a','Implizite Kritik.'],['c1r3','Was bedeutet „transparent evaluiert“ im Kontext?','Wirkung und Grenzen müssen nachvollziehbar geprüft werden.','Alle Daten werden öffentlich verkauft.','Es gibt keine Bewertung.','a','Kontextuelle Bedeutung.']],
          listening:[['c1l1','Unter welcher Bedingung wirkt Automatisierung produktiv?','Bei Qualifizierung und transparenten Entscheidungen','Wenn Weiterbildung wegfällt','Wenn Entscheidungen verborgen bleiben','a','Bedingung im Hörtext.'],['c1l2','Was kritisiert die Expertin?','Effizienzversprechen ohne verbindliche Weiterbildung','Zu viele Pausen im Betrieb','Zu wenig Werbung','a','Indirekte Kritik.'],['c1l3','Welche Haltung hat die Expertin?','Differenziert zustimmend, aber kritisch','Vollständig ablehnend','Uninteressiert','a','Nuancierte Sprecherhaltung.']],
          grammar:[['c1g1','Welche Formulierung ist am präzisesten?','Die Einführung bedarf einer transparenten Evaluation.','Man soll das irgendwie anschauen.','Das Ding muss getestet werden oder so.','a','Nominalstil und Präzision.'],['c1g2','Setze ein: Die Maßnahme ist sinnvoll, ___ ihre Grenzen klar benannt werden.','sofern','trotzdem','denn deshalb','a','Bedingung.'],['c1g3','Welche Aussage ist kohärent?','Einerseits erhöht KI die Effizienz, andererseits entstehen neue Verantwortungsfragen.','KI ist effizient und aber weil Verantwortung.','Einerseits KI gut andererseits.','a','Abwägung.'],['c1g4','Welche Formulierung passt ins formelle Register?','Dies lässt sich nur bedingt auf alle Lernkontexte übertragen.','Das passt halt nicht überall.','Überall ist anders, egal.','a','Formelles Register.']]
        }
      },
      C2:{
        readingTitle:'C2 Lesen · Nuance und implizite Wertung', listeningTitle:'C2 Hören · abstrakte Debatte', grammarTitle:'C2 Sprachpräzision · Register und Nuancen',
        readingText:'Der Essay bezweifelt nicht den Nutzen personalisierter Lernsysteme, sondern die Selbstverständlichkeit, mit der ihr Einsatz als Fortschritt etikettiert wird. Gerade dort, wo algorithmische Empfehlungssysteme scheinbar individuelle Förderung versprechen, verschieben sie pädagogische Entscheidungen in schwer überprüfbare technische Infrastrukturen.',
        listeningText:'Der Redner ironisiert die Vorstellung, jede soziale Frage lasse sich durch eine weitere Plattform lösen. Er räumt zwar ein, dass datenbasierte Systeme blinde Flecken sichtbar machen können, warnt jedoch davor, politische Verantwortung in technische Optimierung zu übersetzen.',
        questions:{
          reading:[['c2r1','Was kritisiert der Essay primär?','Die unkritische Gleichsetzung von Technologieeinsatz mit Fortschritt','Dass Lernen überhaupt personalisiert wird','Dass Schulen keine Technik nutzen','a','Nuancierte Kritik.'],['c2r2','Was ist mit „verschieben Entscheidungen“ gemeint?','Verantwortung wird in technische Systeme verlagert.','Entscheidungen werden schneller getroffen.','Lehrkräfte entscheiden mehr als vorher.','a','Implizite Bedeutung.'],['c2r3','Welche Haltung zeigt der Text?','Skeptisch-differenziert, nicht technikfeindlich','Naiv begeistert','Völlig themenfremd','a','Nuance im Essay.']],
          listening:[['c2l1','Welche Funktion hat die Ironie des Redners?','Sie kritisiert überzogene Techniklösungen für soziale Probleme.','Sie lobt Plattformen uneingeschränkt.','Sie erklärt eine Bedienungsanleitung.','a','Ironische Distanz.'],['c2l2','Was erkennt der Redner dennoch an?','Datenbasierte Systeme können blinde Flecken sichtbar machen.','Daten lösen alle Konflikte.','Politik wird überflüssig.','a','Zugeständnis.'],['c2l3','Wovor warnt er?','Politische Verantwortung in technische Optimierung zu übersetzen','Mehr Unterricht anzubieten','Zu viel Literatur zu lesen','a','Kernwarnung.']],
          grammar:[['c2g1','Welche Formulierung ist stilistisch am differenziertesten?','Der Befund ist plausibel, greift jedoch analytisch zu kurz.','Das ist halt okay, aber nicht so.','Irgendwie stimmt es nicht.','a','C2-Präzision.'],['c2g2','Setze ein: Die These überzeugt nur ___, als sie soziale Machtverhältnisse mitdenkt.','insofern','obwohl','trotzdem weil','a','insofern als.'],['c2g3','Welche Version wahrt Register und Nuance?','Die Argumentation verkennt nicht den Nutzen, relativiert jedoch dessen Reichweite.','Es ist gut, aber auch schlecht und so.','Der Nutzen ist egal.','a','Nuancierte Einschränkung.'],['c2g4','Welche Aussage vermeidet Übertreibung?','Die Maßnahme kann unter bestimmten Bedingungen wirksam sein.','Die Maßnahme löst alles immer.','Die Maßnahme ist komplett nutzlos.','a','Präzise Einschränkung.']]
        }
      }
    };
    return data[level] || data.B1;
  }

  function examOptions(row){
    return [['a',row[2]],['b',row[3]],['c',row[4]]];
  }
  function generatedObjectivePart(level, partName, variant, language){
    level = normalizeLevel(level || 'B1');
    language = normalizeExamLanguage(language || (variant && variant.language) || simulationLanguage());
    partName = PARTS.indexOf(partName) >= 0 ? partName : 'reading';
    var profile = fullExamLevelProfile(level);
    var v = normalizeExamVariant(level, variant);
    if(v){
      profile = { readingTitle:v.readingTitle, listeningTitle:v.listeningTitle, grammarTitle:level+' Grammatik · '+v.theme, readingText:v.readingText, listeningText:v.listeningText, questions:{ reading:v.readingQuestions, listening:v.listeningQuestions, grammar:v.grammarQuestions } };
    }
    var pool = profile.questions && profile.questions[partName] ? profile.questions[partName] : [];
    var isListening = partName === 'listening';
    var isGrammar = partName === 'grammar';
    return {
      id:'generated-'+level.toLowerCase()+'-'+partName+'-'+(((v && v.id) || 'v1'))+'-full-exam',
      level:level,
      title: isGrammar ? profile.grammarTitle : (isListening ? profile.listeningTitle : profile.readingTitle),
      variantTitle:((window.AppConfig&&window.AppConfig.version)||'G54.45.0')+' · '+(language==='en'?'Englisch':'Deutsch')+' '+level+' Vollprüfung · ' + ((v && v.label) || 'Variante') + ((v && v.theme) ? ' · ' + v.theme : ''),
      intro: isGrammar ? 'Bearbeite die Sprachbausteine ohne Hilfe. Jede Antwort zählt für den Pflichtteil Grammatik.' : (isListening ? 'Höre den Text prüfungsnah und beantworte danach die Fragen.' : 'Lies den Text prüfungsnah und beantworte die Fragen ohne Hilfe.'),
      passScore:(getBlueprint(level) && ((getBlueprint(level).parts||{})[partName]||{}).minScore) || 55,
      maxPlays:isListening ? examListeningPolicy(level).maxPlays : undefined,
      showTranscriptAfterPlays:isListening ? examListeningPolicy(level).maxPlays : undefined,
      audioInstruction:isListening ? 'Der Hörtext wird mit niveauabhängigem Tempo, natürlichen Pausen und – sofern das Gerät passende Stimmen anbietet – wechselnden Sprecherstimmen wiedergegeben. In der Simulation bleibt das Transkript gesperrt.' : undefined,
      audioSimulationNote:isListening ? 'Hören ist Pflichtteil der Vollprüfung. Browser-Audio wird als simulationsnahes Trainingsaudio dokumentiert; ein Transkript zählt ausschließlich als technischer Fallback.' : undefined,
      texts:isListening ? [{ title:profile.listeningTitle, body:profile.listeningText }] : (isGrammar ? [] : [{ title:profile.readingTitle, body:profile.readingText }]),
      questions:pool.map(function(row){ return shuffledExamQuestion(row); })
    };
  }

  /* G54.45.0: Deterministische Options-Mischung.
     Vorher stand die richtige Antwort IMMER auf Position A (examOptions
     ohne Shuffle) — ein "immer A"-Bot erreichte 100 %. Der Seed aus der
     Fragen-ID macht die Reihenfolge stabil über Rendern UND Bewertung
     (beides regeneriert den Teil), aber pro Frage unterschiedlich. */
  var EXAM_OPTION_PERMS = [[0,1,2],[0,2,1],[1,0,2],[1,2,0],[2,0,1],[2,1,0]];
  function examQuestionSeed(str){
    var h = 0; str = String(str || '');
    for(var i=0;i<str.length;i++){ h = ((h * 31) + str.charCodeAt(i)) >>> 0; }
    return h;
  }
  function shuffledExamQuestion(row){
    var texts = [row[2], row[3], row[4]];
    var perm = EXAM_OPTION_PERMS[examQuestionSeed(row[0]) % EXAM_OPTION_PERMS.length];
    var letters = ['a','b','c'];
    var options = perm.map(function(srcIdx, pos){ return [letters[pos], texts[srcIdx]]; });
    return {
      id:row[0],
      question:row[1],
      options:options,
      correct:letters[perm.indexOf(0)],
      explanation:row[6] || 'Aus dem Prüfungstext ableitbar.'
    };
  }


  function qrow(id, question, correct, wrong1, wrong2, explanation){ return [id, question, correct, wrong1, wrong2, 'a', explanation || 'Die Antwort ergibt sich eindeutig aus der Variante.']; }
  function buildVariant(level, idx, cfg){
    var id = normalizeLevel(level).toLowerCase() + '-v' + idx;
    return Object.assign({ id:id, index:idx, level:normalizeLevel(level), label:'Variante ' + idx }, cfg || {});
  }
  function fullExamVariantPool(level, language){
    level = normalizeLevel(level || 'B1');
    language = normalizeExamLanguage(language || simulationLanguage());
    if(language === 'en') return calibrateVariantPool(level, language, englishFullExamVariantPool(level));
    var commonGrammar = {
      A1:[
        [qrow('a1g-v-a','Welche Form ist korrekt?','Ich heiße Sara.','Ich heißen Sara.','Ich heißt Sara.','A1: ich heiße.'), qrow('a1g-v-b','Welche Frage ist korrekt?','Wo wohnst du?','Wo du wohnst?','Wo wohnen du?','Verbposition in der Frage.'), qrow('a1g-v-c','Setze ein: Das ___ mein Buch.','ist','bist','sind','Das ist.'), qrow('a1g-v-d','Welche Antwort passt zu „Danke“?','Bitte.','Gute Nacht.','Ich komme aus.','Höfliche Antwort.')],
        [qrow('a1g2-v-a','Setze ein: Wir ___ im Kurs.','sind','ist','bist','wir sind.'), qrow('a1g2-v-b','Welche Form ist richtig?','Ich habe einen Stift.','Ich hat einen Stift.','Ich haben einen Stift.','ich habe.'), qrow('a1g2-v-c','Welche Frage passt?','Wie spät ist es?','Wie spät es ist?','Wie ist spät?','A1-Uhrzeitfrage.'), qrow('a1g2-v-d','Setze ein: Sie ___ aus Ulm.','kommt','komme','kommen','sie kommt.')],
        [qrow('a1g3-v-a','Welche Form ist korrekt?','Der Kurs beginnt heute.','Der Kurs beginnen heute.','Der Kurs beginnst heute.','Singular: beginnt.'), qrow('a1g3-v-b','Setze ein: Ich lerne ___.','Deutsch','deutscher','deutschen','Sprachname ohne Artikel.'), qrow('a1g3-v-c','Welche Antwort passt zu „Wie geht es dir?“','Gut, danke.','Am Bahnhof.','Um sieben Uhr.','A1 Alltagsantwort.'), qrow('a1g3-v-d','Welche Frage ist korrekt?','Was kostet das?','Was das kostet?','Was kosten das?','Verbposition.')]
      ],
      A2:[
        [qrow('a2g-v-a','Setze ein: Ich habe gestern einen Termin ___.','vereinbart','vereinbaren','vereinbare','Perfekt mit Partizip II.'), qrow('a2g-v-b','Welche Satzstellung ist korrekt?','Morgen kann ich nicht kommen.','Morgen ich kann nicht kommen.','Kann ich morgen nicht kommen ich.','Verb auf Position 2.'), qrow('a2g-v-c','Setze ein: Ich rufe an, ___ ich eine Frage habe.','weil','deshalb','trotzdem','Grund mit weil.'), qrow('a2g-v-d','Welche Bitte ist höflich?','Könnten Sie mir bitte helfen?','Hilf sofort!','Du musst helfen.','Höfliche Bitte.')],
        [qrow('a2g2-v-a','Setze ein: Wir sind gestern nach Stuttgart ___.','gefahren','fahren','fährt','Perfekt mit sein.'), qrow('a2g2-v-b','Welche Form passt?','Ich möchte einen Termin machen.','Ich möchten einen Termin machen.','Ich möchtet einen Termin machen.','ich möchte.'), qrow('a2g2-v-c','Setze ein: Der Kurs ist ___ als der alte Kurs.','besser','gut','am besten','Komparativ.'), qrow('a2g2-v-d','Welche Frage ist höflich?','Darf ich Sie etwas fragen?','Du sagst jetzt Antwort.','Antwort sofort!','Höfliche Rückfrage.')],
        [qrow('a2g3-v-a','Setze ein: Wenn es regnet, ___ wir zu Hause.','bleiben','bleibt','bleibe ich wir','Hauptsatz nach wenn.'), qrow('a2g3-v-b','Welche Form ist korrekt?','Ich habe die E-Mail gelesen.','Ich bin die E-Mail gelesen.','Ich habe die E-Mail lesen.','Perfekt mit haben.'), qrow('a2g3-v-c','Setze ein: Ich interessiere mich ___ den Kurs.','für','auf','bei','sich interessieren für.'), qrow('a2g3-v-d','Welche Form passt in eine Nachricht?','Viele Grüße','Mach schnell','Ey du','angemessener Abschluss.')]
      ],
      B1:[
        [qrow('b1g-v-a','Welche Satzstellung ist korrekt?','Obwohl der Termin spät ist, nehme ich teil.','Obwohl ist der Termin spät, ich teilnehme.','Obwohl der Termin ist spät, nehme ich teil.','Nebensatz mit Verb am Ende.'), qrow('b1g-v-b','Setze ein: Ich bitte ___ eine Rückmeldung.','um','für','bei','bitten um.'), qrow('b1g-v-c','Welche Formulierung ist formell?','Ich würde mich über eine Antwort freuen.','Schreib sofort zurück.','Mach mal Antwort.','formeller Abschluss.'), qrow('b1g-v-d','Setze ein: Der Kurs wurde ___.','verschoben','verschieben','verschiebt','Passiv/Partizip.')],
        [qrow('b1g2-v-a','Setze ein: Ich konnte nicht kommen, ___ mein Kind krank war.','weil','trotzdem','deshalb','Grundsatz.'), qrow('b1g2-v-b','Welche Form ist korrekt?','Nachdem ich angerufen hatte, bekam ich einen Termin.','Nachdem ich hatte angerufen, bekam ich.','Nachdem angerufen ich hatte.','Plusquamperfekt/Nebensatz.'), qrow('b1g2-v-c','Welche Bitte passt formell?','Könnten Sie den Termin bestätigen?','Bestätig jetzt!','Du bestätigst.','höflicher Konjunktiv.'), qrow('b1g2-v-d','Setze ein: Ich nehme ___ dem Kurs teil.','an','bei','für','teilnehmen an.')],
        [qrow('b1g3-v-a','Welche Verbindung ist korrekt?','Ich habe mich beworben, aber noch keine Antwort erhalten.','Ich habe mich beworben, weil aber Antwort.','Ich beworben mich aber Antwort.','Kontrast mit aber.'), qrow('b1g3-v-b','Setze ein: Die Unterlagen müssen bis Freitag ___ werden.','eingereicht','einreichen','reicht ein','Passivähnliche Konstruktion.'), qrow('b1g3-v-c','Welche Formulierung ist sachlich?','Aus diesem Grund bitte ich um Ersatz.','Das ist voll mies.','Ihr seid schuld.','sachliches Register.'), qrow('b1g3-v-d','Setze ein: Ich freue mich ___ Ihre Antwort.','auf','über bei','für zu','sich freuen auf.')]
      ],
      B2:[
        [qrow('b2g-v-a','___ die Maßnahme teuer ist, kann sie langfristig sinnvoll sein.','Obwohl','Weil','Deshalb','Gegensatz.'), qrow('b2g-v-b','Welche Formulierung ist am sachlichsten?','Ich halte die Regelung für problematisch.','Das ist mega schlecht.','Kein Bock darauf.','formelles Register.'), qrow('b2g-v-c','Setze ein: Die Ergebnisse ___ vor der Sitzung ausgewertet.','werden','wird','hat','Passiv Plural.'), qrow('b2g-v-d','Welche Verknüpfung passt?','Die Maßnahme ist umstritten; dennoch bietet sie Chancen.','Die Maßnahme ist umstritten, weil dennoch Chancen.','Dennoch weil Chance.','kohärente Verknüpfung.')],
        [qrow('b2g2-v-a','Setze ein: Die Teilnahme hängt davon ab, ___ die Kosten übernommen werden.','ob','weil','trotz','indirekte Abhängigkeit.'), qrow('b2g2-v-b','Welche Version ist formell?','Ich möchte auf folgende Punkte hinweisen.','Ich sag mal was.','Hör zu, Punkt.','formeller Einstieg.'), qrow('b2g2-v-c','Setze ein: Die Beschwerde sollte sorgfältig ___ werden.','geprüft','prüfen','prüfte','Passiv.'), qrow('b2g2-v-d','Welche Aussage ist differenziert?','Einerseits spart das Zeit, andererseits entstehen neue Kosten.','Es ist gut und schlecht halt.','Alles ist immer perfekt.','Abwägung.')],
        [qrow('b2g3-v-a','Setze ein: Die Entscheidung ist nachvollziehbar, ___ sie nicht alle Probleme löst.','auch wenn','weil deshalb','trotzdem weil','Einräumung.'), qrow('b2g3-v-b','Welche Formulierung ist neutral?','Die Datenlage ist noch nicht ausreichend.','Das ist Quatsch.','Totaler Unsinn.','neutraler Stil.'), qrow('b2g3-v-c','Setze ein: Der Antrag ___ fristgerecht eingereicht.','wurde','hat','ist werden','Passiv Präteritum.'), qrow('b2g3-v-d','Welche Verbindung passt?','Folglich sollte die Maßnahme begleitet werden.','Folglich weil sollte.','Begleitet folglich aber.','folgernde Verknüpfung.')]
      ],
      C1:[
        [qrow('c1g-v-a','Welche Formulierung ist präzise?','Die Einführung bedarf einer transparenten Evaluation.','Man sollte das Ding anschauen.','Das muss irgendwie getestet werden.','Nominalstil/Präzision.'), qrow('c1g-v-b','Setze ein: Die Maßnahme ist tragfähig, ___ ihre Grenzen benannt werden.','sofern','trotzdem','denn deshalb','Bedingung.'), qrow('c1g-v-c','Welche Aussage ist kohärent?','Einerseits steigt die Effizienz, andererseits entstehen Verantwortungsfragen.','Effizienz aber Verantwortung irgendwie.','Einerseits gut andererseits.','Abwägung.'), qrow('c1g-v-d','Welche Version passt formell?','Dies lässt sich nur bedingt übertragen.','Das passt halt nicht überall.','Egal, überall anders.','formelles Register.')],
        [qrow('c1g2-v-a','Setze ein: Der Befund ist relevant, ___ er methodisch begrenzt ist.','wenngleich','deshalb','weil trotzdem','konzessiver Anschluss.'), qrow('c1g2-v-b','Welche Formulierung ist akademisch?','Die These ist nur eingeschränkt belastbar.','Die Idee ist so lala.','Das ist halt schwierig.','akademisches Register.'), qrow('c1g2-v-c','Setze ein: Eine differenzierte Bewertung setzt voraus, ___ mehrere Perspektiven berücksichtigt werden.','dass','weil','trotz','dass-Satz.'), qrow('c1g2-v-d','Welche Verbindung ist präzise?','Daraus ergibt sich jedoch kein Automatismus.','Also immer so.','Deshalb alles klar.','präzise Einschränkung.')],
        [qrow('c1g3-v-a','Setze ein: Die Kritik richtet sich weniger gegen die Technik ___ gegen ihren unreflektierten Einsatz.','als vielmehr','weil','trotzdem','Korrekturstruktur.'), qrow('c1g3-v-b','Welche Formulierung wahrt Distanz?','Es erscheint fraglich, ob dieser Ansatz übertragbar ist.','Das klappt nie.','Das ist Quatsch.','wissenschaftliche Distanz.'), qrow('c1g3-v-c','Setze ein: Die Daten wurden ___ ausgewertet.','systematisch','systematische','System','Adverb.'), qrow('c1g3-v-d','Welche Version ist kohärent?','Zunächst wird der Nutzen beschrieben, anschließend werden Grenzen analysiert.','Nutzen dann Grenzen irgendwie.','Erst Nutzen aber weil Grenzen.','Textstruktur.')]
      ],
      C2:[
        [qrow('c2g-v-a','Welche Formulierung ist nuanciert?','Der Befund ist plausibel, greift jedoch analytisch zu kurz.','Das ist okay, aber nicht so.','Irgendwie stimmt es nicht.','C2-Präzision.'), qrow('c2g-v-b','Setze ein: Die These überzeugt nur ___, als sie Machtverhältnisse mitdenkt.','insofern','obwohl','trotzdem weil','insofern als.'), qrow('c2g-v-c','Welche Version wahrt Register und Nuance?','Die Argumentation relativiert den Nutzen, ohne ihn zu negieren.','Gut und schlecht und so.','Der Nutzen ist egal.','nuancierte Einschränkung.'), qrow('c2g-v-d','Welche Aussage vermeidet Übertreibung?','Die Maßnahme kann unter bestimmten Bedingungen wirksam sein.','Die Maßnahme löst alles immer.','Die Maßnahme ist komplett nutzlos.','präzise Einschränkung.')],
        [qrow('c2g2-v-a','Setze ein: Der Text problematisiert nicht die Innovation selbst, ___ deren Legitimationslogik.','sondern','weil','obwohl','präziser Gegensatz.'), qrow('c2g2-v-b','Welche Formulierung ist stilistisch kontrolliert?','Diese Lesart unterschätzt die institutionellen Nebenfolgen.','Das checkt die Folgen nicht.','Die Folge ist halt dumm.','gehobenes Register.'), qrow('c2g2-v-c','Setze ein: Die Kritik bleibt anschlussfähig, ___ sie polemische Zuspitzungen vermeidet.','weil','trotzdem','obwohl denn','Begründung.'), qrow('c2g2-v-d','Welche Version ist am differenziertesten?','Die Position ist nicht falsch, aber erklärungsbedürftig.','Die Position ist falsch.','Alles stimmt immer.','differenzierte Bewertung.')],
        [qrow('c2g3-v-a','Setze ein: Der Autor deutet an, ___ Effizienz nicht automatisch Gerechtigkeit erzeugt.','dass','weil trotzdem','obwohl dass','indirekter Inhalt.'), qrow('c2g3-v-b','Welche Formulierung erkennt Ambivalenz?','Der Ansatz eröffnet Möglichkeiten, verlagert aber zugleich Verantwortung.','Der Ansatz ist super.','Der Ansatz ist Mist.','Ambivalenz.'), qrow('c2g3-v-c','Setze ein: Diese Schlussfolgerung wirkt nur auf den ersten Blick ___.','zwingend','zwingende','Zwang','Adjektiv/Adverbgebrauch.'), qrow('c2g3-v-d','Welche Version ist registerstark?','Die Pointe liegt in der scheinbaren Selbstverständlichkeit der Annahme.','Der Witz ist halt klar.','Es ist irgendwie selbstverständlich.','C2-Stil.')]
      ]
    };
    var variants = {
      A1:[
        buildVariant('A1',1,{ theme:'Kursstart', readingTitle:'A1 Lesen · Kursstart', readingText:'Am Montag beginnt der A1-Deutschkurs um 18 Uhr in Raum 204. Die Teilnehmenden bringen einen Ausweis, einen Stift und ein kleines Heft mit. Wer zu spät kommt, wartet bitte an der Rezeption.', listeningTitle:'A1 Hören · Kursraum', listeningText:'Guten Abend. Der A1-Kurs beginnt heute um achtzehn Uhr in Raum zwei null vier. Bitte bringen Sie Ihren Ausweis mit.', readingQuestions:[qrow('a1v1r1','Wann beginnt der Kurs?','Am Montag um 18 Uhr','Am Freitag um 8 Uhr','Am Sonntag um 20 Uhr','Zeit und Tag stehen im Hinweis.'),qrow('a1v1r2','Was sollen die Teilnehmenden mitbringen?','Ausweis, Stift und Heft','Sportkleidung und Wasser','Fahrkarte und Foto','Gegenstände im Text.'),qrow('a1v1r3','Wo wartet man bei Verspätung?','An der Rezeption','Im Park','Im Bahnhof','Hinweis bei Verspätung.')], listeningQuestions:[qrow('a1v1l1','In welchem Raum ist der Kurs?','In Raum 204','In Raum 15','Online','Raum wird genannt.'),qrow('a1v1l2','Wann beginnt der Kurs heute?','Um 18 Uhr','Um 10 Uhr','Um 15 Uhr','Zeit im Hörtext.'),qrow('a1v1l3','Was soll man mitbringen?','Den Ausweis','Den Laptop','Das Wörterbuch','Ausweis wird genannt.')]}),
        buildVariant('A1',2,{ theme:'Supermarkt', readingTitle:'A1 Lesen · Einkaufshinweis', readingText:'Der Supermarkt ist heute bis 20 Uhr geöffnet. Brot, Milch und Äpfel sind im Angebot. An der Kasse kann man mit Karte oder bar bezahlen.', listeningTitle:'A1 Hören · Marktansage', listeningText:'Achtung, unser Supermarkt schließt heute um zwanzig Uhr. Brot und Äpfel sind heute günstiger. Sie können an der Kasse bar oder mit Karte bezahlen.', readingQuestions:[qrow('a1v2r1','Bis wann ist der Supermarkt geöffnet?','Bis 20 Uhr','Bis 12 Uhr','Bis 23 Uhr','Öffnungszeit im Text.'),qrow('a1v2r2','Was ist im Angebot?','Brot, Milch und Äpfel','Schuhe und Jacken','Bücher und Hefte','Angebotsartikel.'),qrow('a1v2r3','Wie kann man bezahlen?','Mit Karte oder bar','Nur online','Nur per Rechnung','Zahlungsarten.')], listeningQuestions:[qrow('a1v2l1','Wann schließt der Supermarkt?','Um 20 Uhr','Um 18 Uhr','Um 10 Uhr','Schließzeit.'),qrow('a1v2l2','Was ist günstiger?','Brot und Äpfel','Fahrkarten','Kleidung','Angebot im Hörtext.'),qrow('a1v2l3','Wo bezahlt man?','An der Kasse','Im Büro','Im Kursraum','Ort der Zahlung.')]}),
        buildVariant('A1',3,{ theme:'Bibliothek', readingTitle:'A1 Lesen · Bibliothek', readingText:'Die Bibliothek öffnet um 9 Uhr. Neue Leser brauchen einen Ausweis und ein Foto. Kinderbücher stehen links, Deutschbücher stehen im zweiten Regal.', listeningTitle:'A1 Hören · Bibliotheksinfo', listeningText:'Willkommen in der Bibliothek. Wir öffnen um neun Uhr. Für einen neuen Ausweis brauchen Sie ein Foto und Ihren Personalausweis.', readingQuestions:[qrow('a1v3r1','Wann öffnet die Bibliothek?','Um 9 Uhr','Um 18 Uhr','Um 21 Uhr','Öffnungszeit.'),qrow('a1v3r2','Was brauchen neue Leser?','Ausweis und Foto','Sporttasche','Fahrkarte','Unterlagen.'),qrow('a1v3r3','Wo stehen Deutschbücher?','Im zweiten Regal','An der Kasse','Im Park','Ort im Text.')], listeningQuestions:[qrow('a1v3l1','Was braucht man für einen neuen Ausweis?','Foto und Personalausweis','Stift und Heft','Brot und Milch','Dokumente im Hörtext.'),qrow('a1v3l2','Wann öffnet die Bibliothek?','Um 9 Uhr','Um 7 Uhr','Um 20 Uhr','Zeit im Hörtext.'),qrow('a1v3l3','Worum geht die Ansage?','Um die Bibliothek','Um einen Zug','Um eine Praxis','Thema.')]} )
      ],
      A2:[
        buildVariant('A2',1,{ theme:'Praxis', readingTitle:'A2 Lesen · Terminänderung', readingText:'Die Praxis Schneider verschiebt den Termin von Donnerstag 10 Uhr auf Freitag 11 Uhr. Wenn der neue Termin nicht passt, soll man bis morgen zurückrufen.', listeningTitle:'A2 Hören · Telefonnotiz', listeningText:'Hallo, hier ist die Praxis Schneider. Ihr Termin am Donnerstag um zehn Uhr muss verschoben werden. Wir bieten Freitag um elf Uhr an. Bitte rufen Sie bis morgen zurück.', readingQuestions:[qrow('a2v1r1','Welcher Termin wird verschoben?','Donnerstag um 10 Uhr','Freitag um 11 Uhr','Montag um 18 Uhr','Alter Termin.'),qrow('a2v1r2','Welcher neue Termin wird angeboten?','Freitag um 11 Uhr','Samstag um 16 Uhr','Dienstag um 8 Uhr','Neuer Termin.'),qrow('a2v1r3','Was soll man tun, wenn es nicht passt?','Bis morgen zurückrufen','Sofort bezahlen','Den Ausweis schicken','Handlungsanweisung.')], listeningQuestions:[qrow('a2v1l1','Wer ruft an?','Die Praxis Schneider','Der Supermarkt','Die Bibliothek','Anrufer.'),qrow('a2v1l2','Wann ist der neue Termin?','Freitag um 11 Uhr','Donnerstag um 10 Uhr','Sonntag um 9 Uhr','Angebot.'),qrow('a2v1l3','Bis wann soll man zurückrufen?','Bis morgen','Bis nächstes Jahr','Gar nicht','Frist.')]}),
        buildVariant('A2',2,{ theme:'Nachbarschaft', readingTitle:'A2 Lesen · Einkauf', readingText:'Frau Kaya kann morgen nicht mit ihrer Nachbarin einkaufen, weil sie länger arbeiten muss. Sie schlägt Samstag um 15 Uhr vor und bittet um eine kurze Nachricht.', listeningTitle:'A2 Hören · Nachbarschaft', listeningText:'Hallo Frau Meier, ich kann morgen nicht einkaufen gehen, weil ich länger arbeite. Passt Samstag um fünfzehn Uhr? Bitte schreiben Sie mir kurz.', readingQuestions:[qrow('a2v2r1','Warum kann Frau Kaya morgen nicht einkaufen?','Sie muss länger arbeiten.','Sie ist im Urlaub.','Sie hat keine Tasche.','Grund.'),qrow('a2v2r2','Wann schlägt sie vor?','Samstag um 15 Uhr','Freitag um 8 Uhr','Montag um 20 Uhr','Vorschlag.'),qrow('a2v2r3','Was bittet sie um?','Eine kurze Nachricht','Eine Rechnung','Einen neuen Ausweis','Bitte.')], listeningQuestions:[qrow('a2v2l1','Was kann die Sprecherin nicht tun?','Morgen einkaufen gehen','Heute zahlen','Einen Kurs starten','Information.'),qrow('a2v2l2','Warum nicht?','Sie arbeitet länger.','Sie ist krank.','Sie fährt Zug.','Grund.'),qrow('a2v2l3','Was fragt sie?','Ob Samstag um 15 Uhr passt','Ob Montag frei ist','Ob die Bibliothek öffnet','Rückfrage.')]}),
        buildVariant('A2',3,{ theme:'Reise', readingTitle:'A2 Lesen · Zugverspätung', readingText:'Der Zug nach Stuttgart hat 25 Minuten Verspätung. Reisende nach Ulm sollen auf Gleis 5 umsteigen. Die Fahrkarten bleiben gültig.', listeningTitle:'A2 Hören · Bahnhof', listeningText:'Der Zug nach Stuttgart fährt heute fünfundzwanzig Minuten später. Fahrgäste nach Ulm steigen bitte auf Gleis fünf um. Ihre Fahrkarte bleibt gültig.', readingQuestions:[qrow('a2v3r1','Wie viel Verspätung hat der Zug?','25 Minuten','5 Stunden','10 Minuten','Verspätung.'),qrow('a2v3r2','Wohin sollen Reisende nach Ulm gehen?','Zu Gleis 5','Zur Praxis','Nach Hause','Umstieg.'),qrow('a2v3r3','Was passiert mit den Fahrkarten?','Sie bleiben gültig.','Sie werden gelöscht.','Sie kosten doppelt.','Gültigkeit.')], listeningQuestions:[qrow('a2v3l1','Wohin fährt der Zug?','Nach Stuttgart','Nach Berlin','Nach Hamburg','Ziel.'),qrow('a2v3l2','Wie lange ist die Verspätung?','25 Minuten','2 Minuten','90 Minuten','Zeit.'),qrow('a2v3l3','Was sollen Fahrgäste nach Ulm tun?','Auf Gleis 5 umsteigen','Ein Foto bringen','Die Praxis anrufen','Anweisung.')]} )
      ],
      B1:[
        buildVariant('B1',1,{ theme:'Kursausfall', readingTitle:'B1 Lesen · Kursanbieter', readingText:'Der Online-Unterricht am Dienstag fällt wegen technischer Probleme aus. Als Ersatz gibt es Donnerstag einen Zusatztermin und eine Aufzeichnung. Wer nicht teilnehmen kann, schreibt bis Mittwoch an das Sekretariat.', listeningTitle:'B1 Hören · Bürgerbüro', listeningText:'Wegen einer technischen Störung können heute keine neuen Ausweise beantragt werden. Fertige Ausweise können am Schalter drei abgeholt werden. Ersatztermine werden automatisch per E-Mail verschickt.', readingQuestions:[qrow('b1v1r1','Warum fällt der Unterricht aus?','Wegen technischer Probleme','Wegen Ferien','Wegen Raumwechsel','Ursache.'),qrow('b1v1r2','Welche Ersatzlösung gibt es?','Zusatztermin und Aufzeichnung','Nur Geld zurück','Gar keine Lösung','Maßnahmen.'),qrow('b1v1r3','Bis wann soll man schreiben?','Bis Mittwoch','Bis Sonntag','Bis Freitagabend','Frist.')], listeningQuestions:[qrow('b1v1l1','Was ist heute nicht möglich?','Neue Ausweise beantragen','Fertige Ausweise abholen','Eine E-Mail lesen','Störung.'),qrow('b1v1l2','Wo holt man fertige Ausweise ab?','Am Schalter drei','In Raum 204','Am Bahnhof','Ort.'),qrow('b1v1l3','Wie kommen Ersatztermine?','Automatisch per E-Mail','Nur per Postkarte','Gar nicht','Verfahren.')]}),
        buildVariant('B1',2,{ theme:'Wohnung', readingTitle:'B1 Lesen · Hausverwaltung', readingText:'Die Hausverwaltung informiert, dass am Mittwoch zwischen 8 und 12 Uhr das Wasser abgestellt wird. Grund ist eine Reparatur im Keller. Mieter sollen vorher Wasser bereitstellen.', listeningTitle:'B1 Hören · Hausansage', listeningText:'Am Mittwoch wird im Haus von acht bis zwölf Uhr das Wasser abgestellt. Die Reparatur findet im Keller statt. Bitte stellen Sie vorher ausreichend Wasser bereit.', readingQuestions:[qrow('b1v2r1','Wann wird das Wasser abgestellt?','Mittwoch von 8 bis 12 Uhr','Freitag ab 18 Uhr','Montag ganztägig','Zeitfenster.'),qrow('b1v2r2','Warum wird das Wasser abgestellt?','Wegen einer Reparatur im Keller','Wegen einer Feier','Wegen neuer Möbel','Grund.'),qrow('b1v2r3','Was sollen Mieter tun?','Vorher Wasser bereitstellen','Die Miete zahlen','Zum Bahnhof gehen','Anweisung.')], listeningQuestions:[qrow('b1v2l1','Wo findet die Reparatur statt?','Im Keller','Auf dem Dach','Im Supermarkt','Ort.'),qrow('b1v2l2','Wie lange ist das Wasser abgestellt?','Von 8 bis 12 Uhr','Von 20 bis 22 Uhr','Nur 5 Minuten','Dauer.'),qrow('b1v2l3','Was wird empfohlen?','Wasser bereitstellen','Fenster schließen','Fahrkarte kaufen','Empfehlung.')]}),
        buildVariant('B1',3,{ theme:'Arbeit', readingTitle:'B1 Lesen · Dienstplan', readingText:'Im Betrieb wird der Dienstplan geändert, weil zwei Mitarbeitende krank sind. Die Frühschicht beginnt diese Woche um 6 Uhr. Wer tauschen möchte, soll die Teamleitung bis Montag informieren.', listeningTitle:'B1 Hören · Teaminfo', listeningText:'Wegen zwei Krankmeldungen ändern wir den Dienstplan. Die Frühschicht beginnt diese Woche um sechs Uhr. Bitte informieren Sie die Teamleitung bis Montag, wenn Sie tauschen möchten.', readingQuestions:[qrow('b1v3r1','Warum wird der Dienstplan geändert?','Weil zwei Mitarbeitende krank sind','Wegen Urlaub aller Kunden','Wegen Renovierung','Grund.'),qrow('b1v3r2','Wann beginnt die Frühschicht?','Um 6 Uhr','Um 10 Uhr','Um 18 Uhr','Zeit.'),qrow('b1v3r3','Wen soll man informieren?','Die Teamleitung','Die Bibliothek','Die Praxis','Kontakt.')], listeningQuestions:[qrow('b1v3l1','Was ändert sich?','Der Dienstplan','Die Adresse','Die Fahrkarte','Thema.'),qrow('b1v3l2','Bis wann soll man sich melden?','Bis Montag','Bis Freitagabend','Bis Sonntag','Frist.'),qrow('b1v3l3','Warum gibt es die Änderung?','Wegen Krankmeldungen','Wegen Wetter','Wegen Prüfung','Grund.')]} )
      ],
      B2:[
        buildVariant('B2',1,{ theme:'Digitale Bildung', readingTitle:'B2 Lesen · Digitale Bildung', readingText:'Ein Kommentar sieht digitale Bildung als Chance, warnt aber vor sozialer Ungleichheit. Lernplattformen helfen nur, wenn Schulen Geräte, Datenschutz und begleitete Lernzeiten sicherstellen. Ohne Unterstützung fallen benachteiligte Lernende weiter zurück.', listeningTitle:'B2 Hören · Weiterbildung', listeningText:'Onlineweiterbildungen können sinnvoll sein, aber nur mit festen Lernzeiten, klaren Zielen und Rückmeldungen. Ohne diese Struktur brechen viele Teilnehmende ab oder wenden das Gelernte nicht an.', readingQuestions:[qrow('b2v1r1','Welche Hauptposition vertritt der Kommentar?','Digitale Bildung braucht klare Bedingungen.','Geräte allein lösen alles.','Digitale Bildung soll verboten werden.','Hauptaussage.'),qrow('b2v1r2','Welche Voraussetzung wird genannt?','Datenschutz und begleitete Lernzeiten','Weniger Unterricht','Mehr Prüfungen','Bedingung.'),qrow('b2v1r3','Wer wäre ohne Unterstützung besonders betroffen?','Benachteiligte Lernende','Nur Lehrkräfte','Nur Eltern','Folge.')], listeningQuestions:[qrow('b2v1l1','Wann sind Onlinekurse sinnvoll?','Mit Struktur, Zielen und Rückmeldung','Wenn niemand begleitet','Wenn sie sehr kurz sind','Bedingung.'),qrow('b2v1l2','Was passiert ohne Struktur?','Viele brechen ab oder nutzen das Gelernte nicht.','Alle bestehen automatisch.','Die Kurse werden billiger.','Folge.'),qrow('b2v1l3','Worauf zielt die Kritik?','Fehlende Begleitung im Betrieb','Zu viele Bücher','Zu lange Pausen','indirekte Kritik.')]}),
        buildVariant('B2',2,{ theme:'Mobilität', readingTitle:'B2 Lesen · Verkehrskonzept', readingText:'Die Stadt plant weniger Parkplätze und mehr Busspuren. Befürworter erwarten bessere Luft und zuverlässigere Fahrzeiten. Kritiker befürchten Nachteile für Geschäfte, wenn die Umstellung ohne Lieferzonen und Übergangsphase erfolgt.', listeningTitle:'B2 Hören · Stadtdiskussion', listeningText:'Das neue Verkehrskonzept soll Busse zuverlässiger machen. Geschäftsleute unterstützen bessere Luft, warnen aber vor fehlenden Lieferzonen. Die Verwaltung verspricht eine Übergangsphase.', readingQuestions:[qrow('b2v2r1','Was ist das Ziel des Konzepts?','Bessere Luft und zuverlässigere Fahrzeiten','Mehr Parkplätze überall','Weniger Busse','Ziel.'),qrow('b2v2r2','Welche Sorge haben Kritiker?','Nachteile für Geschäfte','Zu viele Fahrräder im Park','Mehr Bücher in Schulen','Sorge.'),qrow('b2v2r3','Welche Bedingung wird indirekt wichtig?','Lieferzonen und Übergangsphase','Nur neue Ampeln','Gratis Parken','Bedingung.')], listeningQuestions:[qrow('b2v2l1','Was soll zuverlässiger werden?','Die Busse','Die Bibliothek','Die Arztpraxis','Ziel.'),qrow('b2v2l2','Wovor warnen Geschäftsleute?','Vor fehlenden Lieferzonen','Vor zu viel Werbung','Vor mehr Unterricht','Kritik.'),qrow('b2v2l3','Was verspricht die Verwaltung?','Eine Übergangsphase','Eine vollständige Absage','Eine neue Prüfung','Zugeständnis.')]}),
        buildVariant('B2',3,{ theme:'Weiterbildung', readingTitle:'B2 Lesen · Betriebliche Weiterbildung', readingText:'Betriebliche Weiterbildung wirkt nur dann nachhaltig, wenn Lernzeit nicht zusätzlich zur Arbeitsbelastung erwartet wird. Studien zeigen, dass klare Lernziele, Praxisaufgaben und Feedback entscheidend für den Transfer sind.', listeningTitle:'B2 Hören · Personalgespräch', listeningText:'Die Personalabteilung empfiehlt, Weiterbildung als Arbeitszeit zu planen. Wer nach Feierabend lernen soll, bricht häufiger ab. Besonders wichtig sind Praxisaufgaben und Feedback durch Vorgesetzte.', readingQuestions:[qrow('b2v3r1','Wann wirkt Weiterbildung nachhaltig?','Wenn Lernzeit real eingeplant wird','Wenn sie nur nach Feierabend stattfindet','Wenn es keine Ziele gibt','Kernaussage.'),qrow('b2v3r2','Was unterstützt den Transfer?','Praxisaufgaben und Feedback','Längere Pausen','Mehr Werbung','Faktoren.'),qrow('b2v3r3','Was wird kritisiert?','Lernen zusätzlich zur Arbeitsbelastung','Zu wenige Parkplätze','Zu viele E-Mails','Problem.')], listeningQuestions:[qrow('b2v3l1','Was empfiehlt die Personalabteilung?','Weiterbildung als Arbeitszeit planen','Lernen komplett streichen','Nur Bücher kaufen','Empfehlung.'),qrow('b2v3l2','Was passiert bei Lernen nach Feierabend häufiger?','Teilnehmende brechen ab.','Alle lernen schneller.','Feedback wird besser.','Folge.'),qrow('b2v3l3','Was ist besonders wichtig?','Praxisaufgaben und Feedback','Nur ein Zertifikat','Keine Ziele','Bedingung.')]} )
      ],
      C1:[
        buildVariant('C1',1,{ theme:'KI im Unterricht', readingTitle:'C1 Lesen · Bildungsanalyse', readingText:'Der Text argumentiert, dass KI-Systeme Lernprozesse differenzierter begleiten können, sofern Transparenz, Datenschutz und pädagogische Verantwortung institutionell gesichert sind. Ohne diese Sicherungen droht Effizienzrhetorik echte Bildungsziele zu verdrängen.', listeningTitle:'C1 Hören · Fachgespräch KI', listeningText:'Die Expertin betont, dass KI Lehrkräfte nicht ersetzt. Sie kann Muster sichtbar machen, aber Entscheidungen über Förderung und Bewertung müssen pädagogisch verantwortet bleiben.', readingQuestions:[qrow('c1v1r1','Welche Bedingung nennt der Text für KI-Einsatz?','Transparenz, Datenschutz und pädagogische Verantwortung','Nur schnellere Geräte','Weniger Unterricht','Bedingungen.'),qrow('c1v1r2','Was wird kritisch gesehen?','Effizienzrhetorik kann Bildungsziele verdrängen.','KI ist grundsätzlich nutzlos.','Lernen soll verboten werden.','Kritik.'),qrow('c1v1r3','Welche Haltung ist erkennbar?','Differenziert und bedingungsorientiert','Naiv begeistert','Völlig ablehnend','Haltung.')], listeningQuestions:[qrow('c1v1l1','Was ersetzt KI laut Expertin nicht?','Lehrkräfte','Lernmuster','Datenschutz','Aussage.'),qrow('c1v1l2','Was kann KI sichtbar machen?','Muster','Ferienzeiten','Fahrkarten','Nutzen.'),qrow('c1v1l3','Wer muss Entscheidungen verantworten?','Pädagogische Akteure','Nur Software','Niemand','Verantwortung.')]}),
        buildVariant('C1',2,{ theme:'Arbeitswelt', readingTitle:'C1 Lesen · Transformation', readingText:'Die Analyse beschreibt flexible Arbeit nicht als Selbstzweck, sondern als Organisationsfrage. Autonomie kann Motivation fördern, erzeugt aber neue Anforderungen an Kommunikation, Erreichbarkeit und soziale Einbindung.', listeningTitle:'C1 Hören · Organisationsgespräch', listeningText:'Der Berater warnt davor, Homeoffice allein als Kostenersparnis zu verstehen. Entscheidend seien klare Kommunikationsregeln, Vertrauen und regelmäßige Teamkontakte.', readingQuestions:[qrow('c1v2r1','Wie wird flexible Arbeit eingeordnet?','Als Organisationsfrage','Als reines Freizeitproblem','Als Technikverbot','Einordnung.'),qrow('c1v2r2','Was kann Autonomie fördern?','Motivation','Parkgebühren','Prüfungspflicht','Chance.'),qrow('c1v2r3','Welche neue Anforderung entsteht?','Kommunikation und soziale Einbindung','Mehr Papierformulare','Weniger Verantwortung','Anforderung.')], listeningQuestions:[qrow('c1v2l1','Wovor warnt der Berater?','Homeoffice nur als Kostenersparnis zu sehen','Homeoffice zu erklären','Teams zu kontaktieren','Warnung.'),qrow('c1v2l2','Was ist entscheidend?','Kommunikationsregeln und Vertrauen','Nur neue Möbel','Längere Pausen','Kriterien.'),qrow('c1v2l3','Welche Haltung zeigt der Berater?','Differenziert-pragmatisch','Völlig ablehnend','Uninformiert','Haltung.')]}),
        buildVariant('C1',3,{ theme:'Medienkompetenz', readingTitle:'C1 Lesen · Medienurteil', readingText:'Der Beitrag unterscheidet zwischen bloßer Informationsaufnahme und reflektierter Medienkompetenz. Entscheidend sei nicht die Menge verfügbarer Quellen, sondern die Fähigkeit, Interessen, Perspektiven und Auslassungen zu erkennen.', listeningTitle:'C1 Hören · Medienpodcast', listeningText:'Im Podcast wird betont, dass Faktenprüfung allein nicht reicht. Nutzerinnen müssen auch erkennen, welche Interessen eine Darstellung prägen und welche Stimmen fehlen.', readingQuestions:[qrow('c1v3r1','Worin liegt der Unterschied?','Zwischen Aufnahme und reflektierter Bewertung','Zwischen Büchern und Stiften','Zwischen Freizeit und Arbeit','Kernunterscheidung.'),qrow('c1v3r2','Was ist entscheidend?','Interessen, Perspektiven und Auslassungen erkennen','Viele Quellen sammeln','Alles sofort teilen','Kriterium.'),qrow('c1v3r3','Welche Aussage passt zum Text?','Medienkompetenz ist mehr als Informationsmenge.','Mehr Quellen lösen automatisch alles.','Bewertung ist unnötig.','Hauptaussage.')], listeningQuestions:[qrow('c1v3l1','Was reicht laut Podcast nicht aus?','Faktenprüfung allein','Sprechen lernen','Eine Fahrkarte kaufen','Aussage.'),qrow('c1v3l2','Was soll man erkennen?','Interessen und fehlende Stimmen','Nur die Lautstärke','Nur das Datum','Analyse.'),qrow('c1v3l3','Welche Kompetenz wird betont?','Kritische Einordnung','Schnelles Klicken','Auswendiglernen','Kompetenz.')]} )
      ],
      C2:[
        buildVariant('C2',1,{ theme:'Algorithmische Bildung', readingTitle:'C2 Lesen · Nuance und Macht', readingText:'Der Essay bezweifelt nicht den Nutzen personalisierter Lernsysteme, sondern die Selbstverständlichkeit, mit der ihr Einsatz als Fortschritt etikettiert wird. Pädagogische Entscheidungen verschieben sich dadurch in schwer überprüfbare technische Infrastrukturen.', listeningTitle:'C2 Hören · Debatte Algorithmus', listeningText:'Der Redner ironisiert die Vorstellung, jede soziale Frage lasse sich durch eine weitere Plattform lösen. Daten können blinde Flecken sichtbar machen, ersetzen aber keine politische Verantwortung.', readingQuestions:[qrow('c2v1r1','Was kritisiert der Essay primär?','Die Gleichsetzung von Technologieeinsatz mit Fortschritt','Personalisierung grundsätzlich','Dass Schulen Technik nutzen','Nuancierte Kritik.'),qrow('c2v1r2','Was bedeutet die Verschiebung?','Verantwortung wandert in technische Systeme.','Lehrkräfte entscheiden mehr.','Alles wird einfacher.','implizite Bedeutung.'),qrow('c2v1r3','Welche Haltung zeigt der Essay?','Skeptisch-differenziert','Naiv begeistert','Thematisch ablehnend','Haltung.')], listeningQuestions:[qrow('c2v1l1','Welche Funktion hat die Ironie?','Sie kritisiert überzogene Techniklösungen.','Sie lobt Plattformen uneingeschränkt.','Sie erklärt eine Bedienungsanleitung.','Funktion.'),qrow('c2v1l2','Was erkennt der Redner an?','Daten können blinde Flecken sichtbar machen.','Daten lösen alle Konflikte.','Politik wird unnötig.','Zugeständnis.'),qrow('c2v1l3','Was ersetzen Daten nicht?','Politische Verantwortung','Eine Plattform','Eine Statistik','Warnung.')]}),
        buildVariant('C2',2,{ theme:'Öffentliche Debatte', readingTitle:'C2 Lesen · Diskurskritik', readingText:'Der Kommentar kritisiert nicht die Zuspitzung als rhetorisches Mittel, sondern deren inflationären Gebrauch. Wo jede Nuance als Schwäche gilt, verliert öffentliche Debatte ihre Fähigkeit zur Selbstkorrektur.', listeningTitle:'C2 Hören · Rhetorikanalyse', listeningText:'Die Sprecherin unterscheidet pointierte Kritik von bloßer Empörung. Pointierung kann klären, Empörung kann jedoch Komplexität verdecken und Gesprächsräume verengen.', readingQuestions:[qrow('c2v2r1','Was wird primär kritisiert?','Der inflationäre Gebrauch von Zuspitzung','Jede Form von Kritik','Alle öffentlichen Debatten','Kernkritik.'),qrow('c2v2r2','Was passiert ohne Nuance?','Debatte verliert Selbstkorrektur.','Debatte wird automatisch besser.','Alle einigen sich sofort.','Folge.'),qrow('c2v2r3','Welche Unterscheidung ist wichtig?','Zuspitzung als Mittel vs. Übergebrauch','Lesen vs. Hören','Termin vs. Uhrzeit','Nuance.')], listeningQuestions:[qrow('c2v2l1','Was unterscheidet die Sprecherin?','Pointierte Kritik und bloße Empörung','Bücher und Hefte','Züge und Busse','Unterscheidung.'),qrow('c2v2l2','Was kann Pointierung leisten?','Sie kann klären.','Sie ersetzt Argumente.','Sie beendet jede Debatte.','Funktion.'),qrow('c2v2l3','Was kann Empörung verdecken?','Komplexität','Uhrzeiten','Preise','Risiko.')]}),
        buildVariant('C2',3,{ theme:'Recht und Sprache', readingTitle:'C2 Lesen · Policy-Sprache', readingText:'Die Richtlinie wirkt auf den ersten Blick neutral, rahmt aber bestimmte Handlungen bereits als Risiko. Dadurch entsteht eine normative Vorentscheidung, bevor der eigentliche Abwägungsprozess beginnt.', listeningTitle:'C2 Hören · Policy-Kommentar', listeningText:'Der Jurist weist darauf hin, dass scheinbar neutrale Begriffe oft Vorentscheidungen enthalten. Wer ein Verhalten als Risiko bezeichnet, verschiebt die Begründungslast.', readingQuestions:[qrow('c2v3r1','Was zeigt der Text über die Richtlinie?','Sie rahmt Handlungen bereits als Risiko.','Sie ist nur eine Terminliste.','Sie verbietet Sprache vollständig.','Analyse.'),qrow('c2v3r2','Was entsteht dadurch?','Eine normative Vorentscheidung','Eine einfache Übersetzung','Ein neuer Kursraum','Folge.'),qrow('c2v3r3','Wann passiert diese Vorentscheidung?','Vor dem eigentlichen Abwägungsprozess','Nach der Prüfung','Beim Einkaufen','Zeitliche Logik.')], listeningQuestions:[qrow('c2v3l1','Was sagt der Jurist über neutrale Begriffe?','Sie enthalten oft Vorentscheidungen.','Sie sind immer eindeutig.','Sie haben keine Wirkung.','Kernaussage.'),qrow('c2v3l2','Was bewirkt die Bezeichnung als Risiko?','Sie verschiebt die Begründungslast.','Sie beendet das Verfahren.','Sie erzeugt einen Termin.','Wirkung.'),qrow('c2v3l3','Welche Kompetenz wird geprüft?','Implizite Wertung erkennen','Uhrzeit verstehen','Name merken','C2-Ziel.')]})
      ]
    };
    var rawPool = (variants[level] || variants.B1).map(function(v, i){
      v.grammarQuestions = commonGrammar[level][i] || commonGrammar[level][0];
      /* G54.45.0: DE-Supplement — erweitert Texte und hebt Lesen/Hören auf 4 Fragen. */
      try{
        var sup = (typeof window !== 'undefined' && window.LanguageGermanExamSupplement) ? window.LanguageGermanExamSupplement[v.id] : null;
        if(sup){
          if(sup.readingExtra && v.readingText.indexOf(sup.readingExtra) === -1) v.readingText = v.readingText + ' ' + sup.readingExtra;
          if(sup.listeningExtra && v.listeningText.indexOf(sup.listeningExtra) === -1) v.listeningText = v.listeningText + ' ' + sup.listeningExtra;
          if(sup.readingQ && !v.readingQuestions.some(function(q){ return q[0] === sup.readingQ[0]; })) v.readingQuestions = v.readingQuestions.concat([sup.readingQ]);
          if(sup.listeningQ && !v.listeningQuestions.some(function(q){ return q[0] === sup.listeningQ[0]; })) v.listeningQuestions = v.listeningQuestions.concat([sup.listeningQ]);
        }
      }catch(e){}
      return v;
    });
    return calibrateVariantPool(level, language, rawPool);
  }

  function englishLevelRows(level){
    level = normalizeLevel(level || 'B1');
    var themes = {
      A1:['Course start','Supermarket','Library'],
      A2:['Clinic appointment','Neighbourhood help','Travel information'],
      B1:['Course cancellation','New apartment','Work schedule'],
      B2:['Digital learning','Public transport policy','Professional development'],
      C1:['AI in education','Workplace transformation','Media literacy'],
      C2:['Algorithmic education','Public debate','Policy language']
    }[level] || ['Exam situation','Everyday situation','Review situation'];
    return themes;
  }
  function englishGrammarRows(level, idx, theme){
    var n = idx || 1;
    var rows = {
      A1:[qrow('en-a1g'+n+'a','Which sentence is correct?','I am a student.','I is a student.','I are a student.','A1: be with I = am.'),qrow('en-a1g'+n+'b','Choose the correct question.','Where do you live?','Where you live?','Where lives you?','Simple present question.'),qrow('en-a1g'+n+'c','Complete: This ___ my book.','is','are','am','This is.'),qrow('en-a1g'+n+'d','Which reply is polite?','Thank you.','Window bus.','Yesterday no.','Basic polite expression.')],
      A2:[qrow('en-a2g'+n+'a','Complete: I ___ to the doctor yesterday.','went','go','going','Past simple.'),qrow('en-a2g'+n+'b','Choose the correct sentence.','I am going to call you tomorrow.','I going call tomorrow.','I called tomorrow yesterday.','Future plan.'),qrow('en-a2g'+n+'c','Complete: I cannot come ___ I am ill.','because','but','although therefore','Reason with because.'),qrow('en-a2g'+n+'d','Which request is polite?','Could you help me, please?','Help now!','You must help me!','Polite request.')],
      B1:[qrow('en-b1g'+n+'a','Which sentence is correct?','Although the appointment is late, I can attend.','Although is the appointment late, I attend.','Although late appointment attend.','Subordination.'),qrow('en-b1g'+n+'b','Complete: I am interested ___ the course.','in','on','at','interested in.'),qrow('en-b1g'+n+'c','Which phrase is suitable in a formal message?','I would appreciate a reply.','Write back now!','Do answer fast.','Formal register.'),qrow('en-b1g'+n+'d','Complete: The meeting was ___.','postponed','postpone','postponing','Past participle/passive.')],
      B2:[qrow('en-b2g'+n+'a','___ the measure is expensive, it may be useful in the long term.','Although','Because','Therefore','Contrast.'),qrow('en-b2g'+n+'b','Which wording is most professional?','I consider this arrangement problematic.','This is mega bad.','No chance, terrible.','Professional register.'),qrow('en-b2g'+n+'c','Complete: The results ___ before the meeting.','will be analysed','will analysed','will analysing','Future passive.'),qrow('en-b2g'+n+'d','Which connector fits?','The policy is controversial; nevertheless, it has advantages.','The policy is controversial because nevertheless.','Nevertheless because advantage.','Cohesion.')],
      C1:[qrow('en-c1g'+n+'a','Which sentence is precise and academic?','The implementation requires transparent evaluation.','We need to check the thing.','It should be looked at somehow.','Academic precision.'),qrow('en-c1g'+n+'b','Complete: The approach is viable ___ its limits are acknowledged.','provided that','despite','therefore because','Condition.'),qrow('en-c1g'+n+'c','Which statement is coherent?','On the one hand, efficiency increases; on the other hand, accountability issues arise.','Efficiency but accountability somehow.','Good and bad, done.','Structured contrast.'),qrow('en-c1g'+n+'d','Which wording maintains formal distance?','This can only be transferred to a limited extent.','This just does not fit everywhere.','Whatever, it is different.','Formal register.')],
      C2:[qrow('en-c2g'+n+'a','Which wording is most nuanced?','The claim is plausible but analytically incomplete.','It is kind of okay but not.','Somehow it is wrong.','C2 nuance.'),qrow('en-c2g'+n+'b','Complete: The argument is convincing only ___ it addresses power relations.','insofar as','although','therefore because','insofar as.'),qrow('en-c2g'+n+'c','Which sentence preserves nuance?','The argument qualifies the benefit without denying it.','It is good and bad and so on.','The benefit is irrelevant.','Nuanced restriction.'),qrow('en-c2g'+n+'d','Which claim avoids overstatement?','The measure may be effective under specific conditions.','The measure solves everything.','The measure is entirely useless.','Controlled claim.')]
    };
    return rows[level] || rows.B1;
  }
  function englishFullExamVariantPool(level){
    level = normalizeLevel(level || 'B1');
    /* G54.45.0: Handgeschriebene EN-Inhalte aus data/language-english-exam-variants.js.
       Vorher waren alle Varianten Template-Klone mit identischem Lesetext und
       Meta-Fragen ohne Verstehensanteil. Der alte Generator bleibt nur als
       Fallback, falls die Datendatei fehlt. */
    var authored = (typeof window !== 'undefined' && window.LanguageEnglishExamVariants) ? window.LanguageEnglishExamVariants[level] : null;
    if(Array.isArray(authored) && authored.length){
      return authored.map(function(src, i){
        var idx = i + 1;
        var id = 'en-' + level.toLowerCase() + '-v' + idx;
        return {
          id:id, index:idx, language:'en', level:level, label:'Variant '+idx, theme:src.theme,
          readingTitle:src.readingTitle || (level+' Reading · '+src.theme),
          listeningTitle:src.listeningTitle || (level+' Listening · '+src.theme),
          readingText:src.readingText, listeningText:src.listeningText,
          readingQuestions:src.reading, listeningQuestions:src.listening,
          grammarQuestions:src.grammar
        };
      });
    }
    return englishLevelRows(level).map(function(theme, i){
      var idx = i + 1;
      var id = 'en-' + level.toLowerCase() + '-v' + idx;
      var complexity = {A1:'short everyday notice',A2:'simple everyday message',B1:'clear public information',B2:'professional argument',C1:'analytical text',C2:'nuanced discourse'}[level] || 'exam text';
      var readingText = {
        A1:'A notice says: The English course starts on Monday at six o clock in room 204. Students should bring an ID card, a pen and a small notebook. Late students should wait at reception.',
        A2:'A message says: I cannot come to the appointment tomorrow because I have to work. I can come on Friday at four o clock. Please call me after six if this is not possible.',
        B1:'The provider informs students that the online lesson on Tuesday is cancelled because of a technical problem. A replacement lesson will take place on Thursday, and students will also receive a recording. Anyone who cannot attend should email the office by Wednesday.',
        B2:'The article argues that digital learning can support individual progress, but only if schools provide devices, data protection and guided learning time. Without these conditions, disadvantaged learners may fall further behind.',
        C1:'The text argues that AI-supported learning systems should not be treated merely as efficiency tools or as replacements for educational relationships. Their use must be transparent, didactically justified and socially monitored.',
        C2:'The essay does not reject personalised learning systems; rather, it questions the ease with which their use is labelled progress. Educational decisions may move into technical infrastructures that are difficult to scrutinise.'
      }[level];
      var listeningText = {
        A1:'Good evening. The English course starts today at six o clock. Please go to room two zero four and bring your ID card. The teacher is Mr Brown.',
        A2:'Hello, this is Green Medical Practice. Your appointment on Thursday at ten must be moved. We can offer Friday at eleven. Please call us back by tomorrow.',
        B1:'Because of a technical problem, new ID cards cannot be requested today. Finished cards can be collected at counter three. Replacement appointments will be sent automatically by email.',
        B2:'The expert says that online training can work well, but only when companies provide fixed learning time, clear goals and feedback. Without structure, many participants stop or do not use what they learned.',
        C1:'The speaker emphasises that automation can reduce routine work, but it is productive only when employees are trained and decision-making processes remain transparent.',
        C2:'The speaker ironically challenges the idea that every social problem can be solved with another platform. Data may reveal blind spots, but it cannot replace political responsibility.'
      }[level];
      var rq = [
        qrow(id+'r1','What is the main point of the text?','It gives information about '+theme+'.','It advertises a holiday only.','It explains a recipe.','Main idea.'),
        qrow(id+'r2','Which detail is stated in the text?','A specific condition or action is required.','Nothing needs to be done.','The situation is unrelated to learning.','Detail.'),
        qrow(id+'r3','What should the reader understand?','The situation requires attention and an appropriate response.','The text has no practical purpose.','The speaker is joking only.','Inference.')
      ];
      var lq = [
        qrow(id+'l1','What is the listening text mainly about?','A practical message about '+theme+'.','A song about travel.','A weather forecast only.','Main idea.'),
        qrow(id+'l2','What does the speaker ask or explain?','A change, condition or important instruction.','A random personal opinion only.','A sports result.','Listening detail.'),
        qrow(id+'l3','Which response would be appropriate?','Notice the key information and react politely.','Ignore the message completely.','Answer with unrelated facts.','Pragmatic response.')
      ];
      return { id:id, index:idx, language:'en', level:level, label:'Variant '+idx, theme:theme, readingTitle:level+' Reading · '+theme, listeningTitle:level+' Listening · '+theme, readingText:readingText, listeningText:listeningText, readingQuestions:rq, listeningQuestions:lq, grammarQuestions:englishGrammarRows(level, idx, theme) };
    });
  }

  function normalizeExamVariant(level, value, language){
    language = normalizeExamLanguage(language || simulationLanguage());
    var pool = fullExamVariantPool(level, language);
    if(value === 'random') return selectExamVariant(level, randomVariantSeed(level), language);
    if(typeof value === 'string' && value){
      var foundByString = pool.filter(function(v){ return v.id === value; })[0];
      if(foundByString) return foundByString;
    }
    if(value && value.id){
      var found = pool.filter(function(v){ return v.id === value.id; })[0];
      if(found) return found;
    }
    return pool[0];
  }
  function selectExamVariant(level, seed, language){
    var pool = fullExamVariantPool(level, language);
    var n = Number(seed || Date.now());
    var idx = Math.abs(Math.floor(n)) % pool.length;
    return pool[idx] || pool[0];
  }
  function generatedFreeTask(level, partName, variant, language){
    level = normalizeLevel(level || 'B1');
    language = normalizeExamLanguage(language || (variant && variant.language) || simulationLanguage());
    var v = normalizeExamVariant(level, variant, language);
    var high = ['B2','C1','C2'].indexOf(level) >= 0;
    if(partName === 'writing'){
      var min = ({A1:30,A2:60,B1:100,B2:180,C1:220,C2:300})[level] || 100;
      var max = ({A1:70,A2:110,B1:170,B2:280,C1:340,C2:520})[level] || 180;
      var writingPrompt = language === 'en'
        ? (high ? 'Write a structured response on “'+v.theme+'”. Present the issue, weigh different aspects, state your position, include an example and end with a clear conclusion.' : 'Write an appropriate message about “'+v.theme+'”. Explain the situation, give a reason or request and close politely.')
        : (high ? 'Schreibe eine strukturierte Stellungnahme zum Thema „'+v.theme+'“. Arbeite Problem, Abwägung, eigene Position, Beispiel und Fazit heraus.' : 'Schreibe eine passende Nachricht zum Thema „'+v.theme+'“. Erkläre die Situation, nenne Grund/Bitte und schließe höflich ab.');
      var writingPoints = language === 'en'
        ? (high ? ['clear introduction/thesis','at least two arguments','limitation or counterpoint','specific example','own conclusion','appropriate register'] : ['greeting/opening','state the situation','give a reason','specific request or suggestion','polite closing'])
        : (high ? ['klarer Anlass/These','mindestens zwei Argumente','Gegenposition oder Einschränkung','konkretes Beispiel','eigenes Fazit','passendes Register'] : ['Anrede/Einstieg','Situation nennen','Grund erklären','konkrete Bitte oder Vorschlag','höflicher Abschluss']);
      return { id:v.id+'-writing', level:level, language:language, variantTitle:((window.AppConfig&&window.AppConfig.version)||'G54.45.0')+' · '+(language==='en'?'Englisch ':'Deutsch ')+v.label+' · '+v.theme, title:level+' '+(language==='en'?'Writing':'Schreiben')+' · '+v.theme, prompt:writingPrompt, requiredPoints:writingPoints, minWords:min, maxWords:max };
    }
    var smin = ({A1:15,A2:35,B1:65,B2:180,C1:130,C2:170})[level] || 70;
    var smax = ({A1:60,A2:100,B1:180,B2:350,C1:320,C2:420})[level] || 190;
    var speakingPrompt = language === 'en'
      ? (high ? 'Speak coherently about “'+v.theme+'”. Frame the topic, mention opportunities, risks, an example and a reasoned recommendation.' : 'Speak in full sentences about “'+v.theme+'”. Explain the situation, give important information and ask a suitable follow-up question.')
      : (high ? 'Sprich zusammenhängend über „'+v.theme+'“. Ordne das Thema ein, nenne Chancen, Risiken, Beispiel und eine begründete Empfehlung.' : 'Sprich in ganzen Sätzen über „'+v.theme+'“. Erkläre die Situation, nenne wichtige Informationen und stelle eine passende Rückfrage.');
    var speakingPoints = language === 'en'
      ? (high ? ['frame the topic','name opportunities','name risks or limits','state your position','give a specific example','conclusion or recommendation'] : ['opening','explain the situation','give a reason or key information','suggestion or follow-up question','polite closing'])
      : (high ? ['Thema einordnen','Chancen nennen','Risiken/Grenzen nennen','eigene Position','konkretes Beispiel','Fazit oder Empfehlung'] : ['Begrüßung/Einstieg','Situation erklären','Grund oder wichtige Information','Vorschlag/Rückfrage','höflicher Abschluss']);
    return { id:v.id+'-speaking', level:level, language:language, variantTitle:((window.AppConfig&&window.AppConfig.version)||'G54.45.0')+' · '+(language==='en'?'Englisch ':'Deutsch ')+v.label+' · '+v.theme, title:level+' '+(language==='en'?'Speaking':'Sprechen')+' · '+v.theme, prompt:speakingPrompt, requiredPoints:speakingPoints, minWords:smin, maxWords:smax, prepSeconds:level==='A1'?20:60, responseSeconds:level==='A1'?60:(high?240:120) };
  }

  function audioRealism(){ return (typeof window !== 'undefined' && window.LanguageAudioRealismEngine) || null; }
  function browserSpeechAvailable(){
    var a=audioRealism();
    if(a && typeof a.supported==='function') return !!a.supported();
    return typeof window !== 'undefined' && 'speechSynthesis' in window && typeof SpeechSynthesisUtterance !== 'undefined';
  }
  function examListeningPolicy(level){
    var a=audioRealism();
    if(a && typeof a.replayPolicy==='function') return a.replayPolicy(level,'simulation');
    return {maxPlays:2,transcriptLocked:true,level:normalizeLevel(level)};
  }
  function listeningConsoleHtml(session, pilot, textsHtml){
    var st = listeningState(session, pilot);
    var payload = listeningPayload(pilot, session.level);
    var max = Number((pilot && pilot.maxPlays) || 2);
    var canPlay = st.plays < max;
    var hasListened = st.plays > 0;
    var isHelper = !!(st.helperMode || st.lastError || !st.strictAudio || (!browserSpeechAvailable() && st.revealed));
    var shouldReveal = st.revealed || st.plays >= Number((pilot && pilot.showTranscriptAfterPlays) || max);
    var tts = browserSpeechAvailable();
    var simStrict = isSimulationContext(session.context);
    if(simStrict && tts && st.revealed){ st.revealed = false; shouldReveal = false; }
    if(simStrict && tts){ shouldReveal = false; }
    var progress = Math.max(0, Math.min(100, Math.round((st.plays / Math.max(1,max)) * 100)));
    var lockText = hasListened ? (isHelper ? 'Antworten im Hilfsmodus freigeschaltet' : 'Antworten prüfungsnah freigeschaltet') : 'Antworten gesperrt bis zum ersten Hören';
    var realism=audioRealism();
    var audioProfile=realism&&typeof realism.getProfile==='function'?realism.getProfile(session.level):null;
    var statusText = isHelper ? 'Hilfsmodus aktiv: Transkript/Audio-Fallback genutzt. Ergebnis wird als Audio-Fallback markiert.' : (tts ? (simStrict ? 'Strenge Simulation: niveauabhängiges Audio mit natürlichen Pausen; Transkript bleibt verborgen.' : 'Realistisches Browser-Audio verfügbar. Tempo und Pausen folgen dem Niveau.') : 'Browser-Audio nicht verfügbar. Starte den Hilfsmodus und lies das Transkript bewusst erst danach.');
    var sourceText = payload.fallbackUsed ? 'Fallback-Hörtext · '+esc(payload.textLength)+' Zeichen' : 'Aufgaben-Hörtext · '+esc(payload.textLength)+' Zeichen';
    var realismText=audioProfile?('Tempo '+esc(Math.round(audioProfile.rate*100))+'% · '+esc(audioProfile.dialogueMode)+' · '+esc(audioProfile.maxPlays)+' Wiedergabe'+(audioProfile.maxPlays===1?'':'n')):'Standard-Browser-Audio';
    return '<div class="la-listening-console" data-la-listening-key="'+esc(st.key)+'" data-la-listening-mode="'+esc(isHelper?'helper':'strict')+'">' +
      '<div class="la-listening-head"><div><span class="la-section-kicker">'+esc(session.level || 'B1')+' '+esc(simulationLanguageLabel(session.context))+'-Hörprüfung</span><h4>Hören vor Antworten</h4><p>'+esc((pilot && pilot.audioInstruction) || 'Höre die Situation aufmerksam. Erst danach werden die Antworten freigeschaltet. Das Transkript ist nur Fallback/Hilfsmodus.')+'</p></div><div class="la-listening-counter"><b>'+esc(st.plays)+'/'+esc(max)+'</b><small>Hörvorgänge</small></div></div>'+ 
      '<div class="la-listening-sourcebar"><span>'+sourceText+'</span><span>'+esc(tts?'Audio bereit':'Audio eingeschränkt')+'</span><span>'+realismText+'</span><span>'+esc(isHelper?'Hilfsmodus':'Strenge Simulation')+'</span></div>'+ 
      '<div class="la-listening-progress"><span style="width:'+esc(progress)+'%"></span></div>'+ 
      '<div class="la-listening-actions"><button type="button" class="la-primary" data-ui-action="language-exam-play-listening" data-la-listening-key="'+esc(st.key)+'" '+(canPlay?'':'aria-disabled="true"')+'>'+(canPlay?'▶ Hörtext abspielen':'Hörlimit erreicht')+'</button>'+(simStrict && tts ? '<span class="la-exam-lock-pill">Transkript in Simulation gesperrt</span>' : '<button type="button" class="la-secondary" data-ui-action="language-exam-reveal-listening" data-la-listening-key="'+esc(st.key)+'" '+((hasListened || !tts)?'':'aria-disabled="true"')+'>'+(tts?'Transkript anzeigen':'Hilfsmodus: Transkript öffnen')+'</button>')+'</div>'+ 
      '<div class="la-listening-status '+(hasListened?'is-unlocked':'is-locked')+' '+(isHelper?'is-helper':'')+'"><b>'+esc(lockText)+'</b><small>'+esc(statusText)+'</small>'+(st.lastError?'<small class="la-listening-error">Audiohinweis: '+esc(st.lastError)+'</small>':'')+'</div>'+ 
      '<div class="la-exam-warning"><b>Harte Hörregel:</b> Eine Antwort zählt nur prüfungsnah, wenn der Hörtext mindestens einmal abgespielt wurde.'+(simStrict && tts ? ' In der Sprachtest-Simulation bleibt das Transkript gesperrt.' : ' Transkript ist Hilfsmodus und wird im Bericht markiert.')+'</div>'+ 
      (shouldReveal ? '<div class="la-exam-sources is-transcript"><div class="la-transcript-label">Transkript / Hilfsmodus</div>'+textsHtml+'</div>' : '<div class="la-listening-transcript-locked"><b>Transkript verborgen</b><small>Erst hören. Danach darfst du zur Kontrolle oder bei Audiofehlern den Hilfsmodus öffnen.</small></div>')+
      '</div>';
  }
  function playListening(btn){
    var session = loadSession() || defaultSession('B1');
    var pilot = getPilotPart(session, 'listening');
    var st = listeningState(session, pilot);
    var max = Number((pilot && pilot.maxPlays) || 2);
    if(st.plays >= max) return renderSession(session);
    var payload = listeningPayload(pilot, session.level);
    session.listeningAudio = Object.assign({}, session.listeningAudio || {});
    st.plays += 1;
    st.lastPlayedAt = nowIso();
    st.lastTextLength = payload.textLength;
    st.fallbackUsed = !!payload.fallbackUsed;
    st.audioMode = browserSpeechAvailable() ? 'browser-tts' : 'no-tts-helper';
    st.strictAudio = browserSpeechAvailable();
    st.helperMode = !browserSpeechAvailable();
    st.lastError = null;
    try{
      if(browserSpeechAvailable()){
        var audio=audioRealism();
        if(audio && typeof audio.play==='function'){
          st.audioMode='realistic-browser-tts';
          var dialogueHint=/(moderator|expert|sprecher|speaker|interview|dialog|dialogue|gespräch|discussion)\s*:?/i.test(payload.plain+' '+String(pilot&&pilot.title||''));
          var run=audio.play({id:st.key+'-'+st.plays,text:payload.plain,level:session.level,language:normalizeExamLanguage(session.examLanguage || simulationLanguage(session.context)),mode:'simulation',dialogueHint:dialogueHint,callbacks:{
            onstart:function(plan){
              var fresh=loadSession()||session; fresh.listeningAudio=Object.assign({},fresh.listeningAudio||{}); var cur=listeningState(fresh,pilot);
              cur.audioMode='realistic-browser-tts';cur.segmentCount=plan.segmentCount;cur.voiceCount=plan.voiceCount;cur.distinctVoices=!!plan.distinctVoices;cur.estimatedDurationMs=plan.estimatedDurationMs;cur.realism=plan.realism;fresh.listeningAudio[cur.key]=cur;saveSession(fresh);
            },
            onerror:function(err){
              var fresh=loadSession()||session; fresh.listeningAudio=Object.assign({},fresh.listeningAudio||{}); var cur=listeningState(fresh,pilot);
              cur.helperMode=true;cur.strictAudio=false;cur.lastError='Browser-Audio konnte nicht vollständig abgespielt werden: '+String(err&&err.message||err||'Fehler');fresh.listeningAudio[cur.key]=cur;saveSession(fresh);
            }
          }});
          if(!run||run.started===false)throw new Error('Audio-Engine konnte nicht starten.');
        }else{
          window.speechSynthesis.cancel();
          var utter = new SpeechSynthesisUtterance(payload.plain);
          utter.lang = normalizeExamLanguage(session.examLanguage || simulationLanguage(session.context)) === 'en' ? 'en-US' : 'de-DE';
          utter.rate = ({A1:0.82,A2:0.87,B1:0.93,B2:0.99,C1:1.04,C2:1.08})[normalizeLevel(session.level)] || 0.93;
          utter.pitch = 1;
          utter.onerror = function(){
            var fresh = loadSession() || session;
            fresh.listeningAudio = Object.assign({}, fresh.listeningAudio || {});
            var cur = listeningState(fresh, pilot);
            cur.helperMode = true;
            cur.strictAudio = false;
            cur.lastError = 'Browser-Stimme konnte nicht sauber abgespielt werden.';
            fresh.listeningAudio[cur.key] = cur;
            saveSession(fresh);
          };
          window.speechSynthesis.speak(utter);
        }
      }else{
        st.revealed = true;
        st.lastError = 'Browser-Stimme ist auf diesem Gerät/Browser nicht verfügbar.';
      }
    }catch(err){
      st.helperMode = true;
      st.strictAudio = false;
      st.revealed = true;
      st.lastError = 'Audio konnte nicht gestartet werden.';
    }
    session.listeningAudio[st.key] = st;
    return renderSession(saveSession(session));
  }
  function revealListening(){
    var session = loadSession() || defaultSession('B1');
    if(isSimulationContext(session.context) && browserSpeechAvailable()) return renderSession(session);
    var pilot = getPilotPart(session, 'listening');
    var st = listeningState(session, pilot);
    var tts = browserSpeechAvailable();
    if(st.plays <= 0 && tts) return renderSession(session);
    session.listeningAudio = Object.assign({}, session.listeningAudio || {});
    st.revealed = true;
    if(st.plays <= 0 || !tts){
      st.helperMode = true;
      st.strictAudio = false;
      st.audioMode = 'transcript-helper';
      st.lastError = st.lastError || 'Transkript wurde ohne strengen Hördurchlauf geöffnet.';
    }
    session.listeningAudio[st.key] = st;
    return renderSession(saveSession(session));
  }

  function renderObjectivePart(session, partName){
    var pilot = getPilotPart(session, partName);
    var isReading = partName === 'reading';
    var title = pilot ? pilot.title : (isReading ? 'Lesen · Pilotaufgabe' : 'Hören · Pilotaufgabe');
    var intro = pilot ? pilot.intro : 'Bearbeite die Aufgabe aufmerksam und beantworte die Fragen.';
    var texts = isReading ? (pilot && Array.isArray(pilot.texts) ? pilot.texts : [
      { title:'Nachricht', body:'Der Kurs beginnt heute um 18 Uhr in Raum 204. Bitte bring deinen Ausweis mit.' }
    ]) : listeningTextsForPilot(pilot, session.level);
    var questions = pilot && Array.isArray(pilot.questions) ? pilot.questions : [
      { id:'q1', question:isReading ? 'Welche Information ist richtig?' : 'Wann ist der neue Termin?', options:isReading ? [['a','Der Kurs beginnt um 18 Uhr in Raum 204.'], ['b','Der Kurs fällt aus.'], ['c','Der Kurs ist online.']] : [['a','Montag um 10 Uhr'], ['b','Freitag um 15 Uhr'], ['c','Sonntag um 18 Uhr']], correct:isReading ? 'a' : 'b', explanation:'Pilotfrage.' }
    ];
    var selectedMap = (session.answers && session.answers[partName] && session.answers[partName].answers) || {};
    var result = session.parts && session.parts[partName];
    var textHtml = texts.map(function(t){ return '<article class="la-exam-source"><b>'+esc(t.title || 'Text')+'</b><p>'+esc(t.body || '')+'</p></article>'; }).join('');
    var listeningSt = partName === 'listening' ? listeningState(session, pilot) : null;
    var listeningUnlocked = partName !== 'listening' || (listeningSt && listeningSt.plays > 0);
    var questionsHtml = questions.map(function(q, idx){
      var selected = selectedMap[q.id];
      var opts = (q.options || []).map(function(a){
        var cls = 'la-answer-choice' + (selected === a[0] ? ' is-selected' : '');
        if(!listeningUnlocked){ cls += ' is-disabled'; }
        if(result){ cls += a[0] === q.correct ? ' is-correct' : (selected === a[0] ? ' is-wrong' : ''); }
        return '<button type="button" class="'+cls+'" data-ui-action="language-exam-objective-answer" data-la-exam-part="'+esc(partName)+'" data-la-question-id="'+esc(q.id)+'" data-la-answer="'+esc(a[0])+'" '+(listeningUnlocked?'':'aria-disabled="true"')+'><span>'+esc(String(a[0]).toUpperCase())+'</span><b>'+esc(a[1])+'</b></button>';
      }).join('');
      var explanation = result ? '<small class="la-exam-explanation">'+esc(q.explanation || '')+'</small>' : '';
      return '<div class="la-exam-question"><h4>'+esc(idx+1)+'. '+esc(q.question || '')+'</h4><div class="la-answer-grid">'+opts+'</div>'+explanation+'</div>';
    }).join('');
    var note = pilot && pilot.audioSimulationNote ? '<div class="la-exam-warning"><b>Hörhinweis:</b> '+esc(pilot.audioSimulationNote)+'</div>' : '';
    var sourceBlock = partName === 'listening' ? listeningConsoleHtml(session, pilot, textHtml) : '<div class="la-exam-sources">'+textHtml+'</div>';
    return '<section class="la-card la-exam-task la-exam-paper" data-la-exam-objective="'+esc(partName)+'"><div class="la-exam-proctor-line"><b>Prüfungsmodus</b><span>Keine Soforthilfe · keine Übersetzung · erst beantworten, dann bewerten.</span></div><span class="la-section-kicker">'+esc(PART_LABELS[partName])+' · '+esc(session.level)+' Aufgabenpool hart</span><h3>'+esc(title)+'</h3>' + (pilot && pilot.variantTitle ? '<div class="la-exam-pool-badge">'+esc(pilot.variantTitle)+'</div>' : '') + '<p class="la-exam-prompt">'+esc(intro)+'</p>'+note+sourceBlock+'<div class="la-exam-questions '+(listeningUnlocked?'':'is-locked')+'">'+questionsHtml+'</div><div class="la-level-actions"><button type="button" class="la-primary" data-ui-action="language-exam-complete-objective" data-la-exam-part="'+esc(partName)+'" '+(listeningUnlocked?'':'aria-disabled="true"')+'>Teil bewerten</button></div>'+scoreBox(result)+'</section>';
  }
  function currentTask(session, partName){
    if(session && isSimulationContext(session.context) && (partName === 'writing' || partName === 'speaking')){ return generatedFreeTask(session.level, partName, session.examVariant, session.examLanguage || simulationLanguage(session.context)); }
    var pilot = session ? pilotForLevel(session.level) : null;
    if(pilot && typeof pilot.getFreeTask === 'function'){
      var pilotTask = pilot.getFreeTask(partName, session[attemptKeyForLevel(session.level)]);
      if(pilotTask) return pilotTask;
    }
    var bp = getBlueprint(session.level) || {};
    var list = partName === 'writing' ? bp.writingTasks : bp.speakingTasks;
    return (list && list[0]) || { level:session.level, title:PART_LABELS[partName], prompt:'Bearbeite die Aufgabe vollständig.', requiredPoints:['Aufgabe vollständig erfüllen'], minWords: partName === 'writing' ? 80 : 50 };
  }

  function defaultGrammarTask(level){
    level = normalizeLevel(level || 'B1');
    var generated = generatedObjectivePart(level, 'grammar');
    if(generated && generated.questions && generated.questions.length) return generated;
    if(level === 'B2') return {
      id:'fallback-b2-grammar-hard', variantTitle:'B2 Grammatik · Fallback', title:'Grammatik & Sprachbausteine · B2', durationMinutes:22, intro:'B2-Hardmode prüft Konnektoren, Register, Satzbau und Präzision.', passScore:76,
      questions:[
        {id:'fgb21', skill:'Konnektor', question:'___ digitale Angebote praktisch sind, ersetzen sie nicht jede persönliche Beratung.', options:[['a','Obwohl'],['b','Weil'],['c','Deshalb']], correct:'a', explanation:'Gegensatz mit obwohl.'},
        {id:'fgb22', skill:'Passiv', question:'Die Teilnahmebedingungen ___ vor Kursbeginn verschickt.', options:[['a','werden'],['b','wird'],['c','hat']], correct:'a', explanation:'Plural Passiv Präsens.'},
        {id:'fgb23', skill:'Register', question:'Welche Formulierung ist formell?', options:[['a','Das ist mega schlecht.'],['b','Ich halte diese Regelung für problematisch.'],['c','Gar kein Bock darauf.']], correct:'b', explanation:'Sachliches Register.'},
        {id:'fgb24', skill:'Präposition', question:'Viele Teilnehmende sind ___ eine klare Struktur angewiesen.', options:[['a','auf'],['b','an'],['c','über']], correct:'a', explanation:'angewiesen auf + Akkusativ.'},
        {id:'fgb25', skill:'Konjunktiv II', question:'Es ___ sinnvoll, die Frist zu verlängern.', options:[['a','wäre'],['b','warst'],['c','hatte']], correct:'a', explanation:'Vorsichtige Bewertung mit Konjunktiv II.'}
      ]
    };
    return {
      id:'fallback-b1-grammar-hard', variantTitle:'B1 Grammatik · Fallback', title:'Grammatik & Sprachbausteine · B1', durationMinutes:20, intro:'B1-Hardmode prüft Satzstellung, Konnektoren, Präpositionen und höfliche Formen.', passScore:75,
      questions:[
        {id:'fg1', skill:'Konnektor', question:'Ich kann nicht kommen, ___ ich krank bin.', options:[['a','weil'],['b','deshalb'],['c','trotzdem']], correct:'a', explanation:'Nebensatz mit weil.'},
        {id:'fg2', skill:'Satzstellung', question:'Welche Satzstellung ist korrekt?', options:[['a','Morgen habe ich einen Termin.'],['b','Morgen ich habe einen Termin.'],['c','Ich morgen habe einen Termin.']], correct:'a', explanation:'Verb auf Position 2.'},
        {id:'fg3', skill:'Präposition', question:'Ich interessiere mich ___ den Kurs.', options:[['a','für'],['b','auf'],['c','bei']], correct:'a', explanation:'sich interessieren für.'},
        {id:'fg4', skill:'Höflichkeit', question:'Welche Bitte ist höflich?', options:[['a','Gib Termin!'],['b','Könnten Sie mir bitte einen Termin geben?'],['c','Du machst Termin.']], correct:'b', explanation:'Konjunktiv II + bitte.'},
        {id:'fg5', skill:'Perfekt', question:'Der Zugang ___ nicht funktioniert.', options:[['a','hat'],['b','ist'],['c','wird']], correct:'a', explanation:'funktionieren bildet Perfekt mit haben.'}
      ]
    };
  }
  function getGrammarTask(session){
    if(session && isSimulationContext(session.context)){
      var simPart = getPilotPart(session, 'grammar');
      if(simPart) return simPart;
    }
    var pilot = session ? pilotForLevel(session.level) : null;
    if(pilot && typeof pilot.getGrammarTask === 'function'){
      var g = pilot.getGrammarTask(session[attemptKeyForLevel(session.level)]);
      if(g) return g;
    }
    var part = getPilotPart(session, 'grammar');
    return part || defaultGrammarTask(session && session.level);
  }
  function renderGrammarPart(session){
    var task = getGrammarTask(session);
    var questions = Array.isArray(task.questions) ? task.questions : [];
    var result = session.parts && session.parts.grammar;
    var answers = Object.assign({}, (session.answers && session.answers.grammar && session.answers.grammar.answers) || {});
    var answered = questions.filter(function(q){ return !!answers[q.id]; }).length;
    var qHtml = questions.map(function(q,idx){
      var selected = answers[q.id];
      var opts = (q.options || []).map(function(opt){ var key=opt[0], label=opt[1]; var cls = selected===key ? 'is-selected' : ''; return '<button type="button" class="la-answer-option '+cls+'" data-ui-action="language-exam-objective-answer" data-la-exam-part="grammar" data-la-question-id="'+esc(q.id)+'" data-la-answer="'+esc(key)+'"><span>'+esc(key.toUpperCase())+'</span><b>'+esc(label)+'</b></button>'; }).join('');
      return '<article class="la-exam-question la-grammar-question"><div class="la-question-head"><span>Aufgabe '+esc(idx+1)+'</span><em>'+esc(q.skill || q.type || 'Sprachbaustein')+'</em></div><h4>'+esc(q.question || '')+'</h4><div class="la-answer-grid">'+opts+'</div></article>';
    }).join('');
    return '<section class="la-card la-exam-task la-exam-paper la-grammar-panel"><div class="la-exam-proctor-line"><b>Prüfungsmodus</b><span>Grammatik zählt als eigener Pflichtblock. Raten reicht nicht.</span></div><span class="la-section-kicker">🧩 '+esc(session.level)+' Grammatik & Sprachbausteine</span><h3>'+esc(task.title || 'Grammatik & Sprachbausteine')+'</h3>'+(task.variantTitle?'<div class="la-exam-pool-badge">'+esc(task.variantTitle)+'</div>':'')+'<p class="la-exam-prompt">'+esc(task.intro || 'Wähle die grammatisch und kommunikativ beste Lösung.')+'</p><div class="la-exam-mini-grid"><div><b>'+esc(questions.length)+'</b><small>Aufgaben</small></div><div><b>'+esc(task.passScore || 75)+'%</b><small>Mindestwert</small></div><div><b>'+esc(answered)+'/'+esc(questions.length)+'</b><small>beantwortet</small></div></div><div class="la-exam-warning"><b>Harte Regel:</b> Grammatik & Sprachbausteine sind kein Bonus. Wer hier stark schwach ist, bekommt im Ergebnis eine echte Prüfungswarnung.</div>'+qHtml+'<div class="la-level-actions"><button type="button" class="la-primary" data-ui-action="language-exam-complete-objective" data-la-exam-part="grammar">Grammatikblock bewerten</button></div>'+scoreBox(result)+'</section>';
  }

  function renderWritingRubric(task, value){
    var rubric = task && task.assessmentRubric;
    var structure = (rubric && rubric.requiredStructure) || task.requiredStructure || ['Betreff/Anlass','formelle Anrede','Problem/Sachverhalt','Folge/Begründung','konkrete Bitte/Forderung','höflicher Abschluss'];
    var lower = String(value || '').toLowerCase();
    var wordsNow = (String(value || '').trim().match(/\b[\wÄÖÜäöüß-]+\b/g) || []).length;
    var subjectHit = /(betreff|beschwerde|anfrage|bitte um|termin|schichttausch|lärm|onlinekurs|rückerstattung|reparatur|entschuldigung)/i.test(lower);
    var greetingHit = /(sehr geehrte|guten tag|hallo|liebe)/i.test(lower);
    var closingHit = /(mit freundlichen grüßen|freundliche grüße|vielen dank|danke|beste grüße|gruß)/i.test(lower);
    var requestHit = /(bitte|ich bitte|ich fordere|lösung|ersatz|rückzahlung|termin|maßnahme|rückmeldung|bestätigung)/i.test(lower);
    var rows = structure.map(function(item){
      var check = /betreff|anlass/i.test(item) ? subjectHit : (/anrede/i.test(item) ? greetingHit : (/abschluss/i.test(item) ? closingHit : (/bitte|forderung|rückfrage|erwartung/i.test(item) ? requestHit : null)));
      return '<li class="'+(check===true?'is-ok':(check===false?'is-risk':''))+'"><span>'+esc(check===true?'✓':(check===false?'!':'•'))+'</span>'+esc(item)+'</li>';
    }).join('');
    return '<div class="la-writing-rubric"><div><b>'+esc((task.level || (task.assessmentRubric && task.assessmentRubric.level) || 'B1'))+'-Schreibcheck hart</b><small>'+esc(wordsNow)+' Wörter · Ziel: '+esc(task.minWords || 110)+'–'+esc(task.maxWords || 180)+'</small></div><ul>'+rows+'</ul><p>Wichtig: Gute Grammatik reicht nicht, wenn Pflichtpunkte, Anlass oder formeller Aufbau fehlen.</p></div>';
  }

  function speakingEvidenceEngine(){ return window.LanguageSpeakingEvidenceEngine || null; }
  function normalizedSpeakingEvidence(session,text){
    var raw=Object.assign({},session&&session.speakingEvidence||{}); raw.transcript=text||'';
    if(speakingEvidenceEngine()&&speakingEvidenceEngine().createEvidence)return speakingEvidenceEngine().createEvidence(raw);
    return {source:raw.source||'manual-transcript',audioAnalyzed:false,assessmentScope:'transcript-only',assessmentCompleteness:67,capabilities:{content:!!text,language:!!text},disclosure:'Die Bewertung basiert nur auf dem bestätigten Transkript. Aussprache, Intonation und tatsächliche mündliche Flüssigkeit wurden nicht gemessen.'};
  }
  function speakingEvidenceHtml(session,value,result){
    var ev=(result&&result.evidence)||normalizedSpeakingEvidence(session,value);
    var label=ev.audioAnalyzed?'Audio + Transkript analysiert':(ev.source==='speech-recognition-transcript'?'Spracherkennung · nur Transkript':'Manuelles Transkript');
    var confidence=ev.transcriptConfidence==null?'':('<li>Transkript-Erkennungswert: '+esc(Math.round(ev.transcriptConfidence*100))+'% — kein Aussprachewert</li>');
    return '<div class="la-speaking-evidence '+(ev.audioAnalyzed?'is-complete':'is-limited')+'" data-speaking-evidence="G54.46.12"><div><b>'+esc(label)+'</b><span>'+esc(ev.assessmentCompleteness||67)+'% Bewertungsumfang</span></div><p>'+esc(ev.disclosure||'')+'</p><ul><li>Inhalt und Aufgabenbezug: '+(ev.capabilities&&ev.capabilities.content?'bewertbar':'offen')+'</li><li>Grammatik, Wortschatz und Textfluss: '+(ev.capabilities&&ev.capabilities.language?'bewertbar':'offen')+'</li><li>Aussprache, Intonation und Audio-Flüssigkeit: '+(ev.audioAnalyzed?'gemessen':'nicht gemessen')+'</li>'+confidence+'</ul></div>';
  }
  function renderSpeakingRubric(task, value){
    var rubric = task && task.assessmentRubric;
    var structure = (rubric && rubric.requiredSpeechStructure) || task.requiredSpeechStructure || ['Begrüßung/Einstieg','Situation/Grund erklären','konkrete Information','Vorschlag/Lösung/Rückfrage','höflicher Abschluss','zusammenhängende Antwort'];
    var lower = String(value || '').toLowerCase();
    var wordsNow = (String(value || '').trim().match(/\b[\wÄÖÜäöüß-]+\b/g) || []).length;
    var argumentative = Number(task && task.minWords || 0) >= 160 || /argument|vorteil|nachteil|position|fazit|empfehlung|kompromiss/i.test(String((task && task.prompt) || '') + ' ' + structure.join(' '));
    var greetingHit = /(guten tag|hallo|liebe|sehr geehrte|merhaba)/i.test(lower);
    var reasonHit = /(weil|wegen|da |denn|grund|begründ|argument|aufgrund|deshalb|daher|dadurch|folge|problem|leider)/i.test(lower);
    var concreteHit = /(montag|dienstag|mittwoch|donnerstag|freitag|samstag|sonntag|morgen|heute|uhr|termin|treffpunkt|bestellnummer|lieferdatum|30 minuten|nächste|zum beispiel|beispielsweise|konkret|in meinem alltag|bei der arbeit|ein beispiel)/i.test(lower);
    var requestHit = /(bitte|könnten|würden|möglich|vorschlagen|lösung|ersatz|rückerstattung|tauschen|rückmeldung|bestätigung|frage|empfehlen|empfehlung|kompromiss|sollte)/i.test(lower);
    var closingHit = /(vielen dank|danke|auf wiederhören|freundliche grüße|bis bald|ich freue mich|rückmeldung|fazit|abschließend|zusammenfassend|empfehlung)/i.test(lower);
    var connectedHit = wordsNow >= (task.minWords || 70) && /(weil|deshalb|außerdem|zudem|allerdings|dennoch|andererseits|einerseits|aber|während|obwohl)/i.test(lower);
    var proContraHit = /(vorteil|vorteile|nachteil|nachteile|chance|chancen|risiko|risiken|einerseits|andererseits|dafür|dagegen|kosten|grenzen)/i.test(lower);
    var ownPositionHit = /(meiner meinung|meine meinung|ich bin der meinung|ich halte|ich finde|aus meiner sicht|meines erachtens|ich empfehle|ich würde empfehlen)/i.test(lower);
    var exampleHit = /(zum beispiel|beispielsweise|konkret|in meinem alltag|bei der arbeit|ein beispiel|etwa)/i.test(lower);
    var conclusionHit = /(fazit|abschließend|zusammenfassend|empfehlung|ich empfehle|kompromiss|lösung|daher sollte|deshalb sollte|realistisch wäre)/i.test(lower);
    var rows = structure.map(function(item){
      var check;
      if(argumentative){
        check = /einleitung|themenbezug|thema/i.test(item) ? (wordsNow >= 30) : (/dafür|pro|vorteil|argumente dafür/i.test(item) ? proContraHit : (/dagegen|contra|nachteil|argumente dagegen|grenzen/i.test(item) ? proContraHit : (/position|meinung/i.test(item) ? ownPositionHit : (/beispiel/i.test(item) ? exampleHit : (/fazit|empfehlung|kompromiss|lösung/i.test(item) ? conclusionHit : connectedHit)))));
      }else{
        check = /begrüßung|einstieg/i.test(item) ? greetingHit : (/grund|situation/i.test(item) ? reasonHit : (/konkrete|information/i.test(item) ? concreteHit : (/vorschlag|lösung|rückfrage/i.test(item) ? requestHit : (/abschluss/i.test(item) ? closingHit : (/zusammenhängend/i.test(item) ? connectedHit : null)))));
      }
      return '<li class="'+(check===true?'is-ok':(check===false?'is-risk':''))+'"><span>'+esc(check===true?'✓':(check===false?'!':'•'))+'</span>'+esc(item)+'</li>';
    }).join('');
    var note = argumentative ? 'Wichtig: Die textbasierte Bewertung prüft Pro/Contra, Position, Begründung, Beispiel und Fazit. Aussprache und Intonation werden nur mit ausgewiesener Audioanalyse bewertet.' : 'Wichtig: Ohne ausgewiesene Audioanalyse werden Inhalt, Sprachqualität und Textfluss des bestätigten Transkripts bewertet — nicht Aussprache oder Intonation.';
    return '<div class="la-writing-rubric la-speaking-rubric"><div><b>'+esc((task.level || (task.assessmentRubric && task.assessmentRubric.level) || 'B1'))+'-Sprechcheck hart</b><small>'+esc(wordsNow)+' Wörter · Ziel: '+esc(task.minWords || 75)+'–'+esc(task.maxWords || 190)+'</small></div><ul>'+rows+'</ul><p>'+esc(note)+'</p></div>';
  }

  function renderFreePart(session, partName){
    var task = currentTask(session, partName);
    var value = (session.answers && session.answers[partName]) || '';
    var result = session.parts && session.parts[partName];
    var isSpeaking = partName === 'speaking';
    var simStrict = isSimulationContext(session.context);
    var actionButtons = simStrict ? '<div class="la-level-actions"><button type="button" class="la-primary" data-ui-action="language-exam-hybrid-check" data-la-exam-part="'+esc(partName)+'">Prüfungsteil bewerten und abschließen</button></div>' : '<div class="la-level-actions"><button type="button" class="la-secondary" data-ui-action="language-exam-local-check" data-la-exam-part="'+esc(partName)+'">Lokale Vorprüfung</button><button type="button" class="la-primary" data-ui-action="language-exam-hybrid-check" data-la-exam-part="'+esc(partName)+'">Prüfungsteil bewerten</button></div>';
    var meta = [];
    if(task.minWords) meta.push('mind. '+task.minWords+' Wörter');
    if(task.maxWords) meta.push('max. '+task.maxWords+' Wörter');
    if(task.prepSeconds) meta.push(task.prepSeconds+' Sek. Vorbereitung');
    if(task.responseSeconds) meta.push(task.responseSeconds+' Sek. Antwortzeit');
    var hardHints = Array.isArray(task.hardFailHints) && task.hardFailHints.length ? '<div class="la-exam-warning"><b>Harte Regeln:</b><ul>'+task.hardFailHints.map(function(h){ return '<li>'+esc(h)+'</li>'; }).join('')+'</ul></div>' : '';
    var examLang = normalizeExamLanguage(session.examLanguage || simulationLanguage(session.context));
    var structureSteps = isSpeaking
      ? (examLang === 'en' ? 'Greeting/opening → describe the situation → give a reason → make a concrete suggestion → polite closing' : 'Begrüßung/Einstieg → Situation schildern → Grund nennen → konkreten Vorschlag machen → höflicher Abschluss')
      : (examLang === 'en' ? 'Greeting/salutation → state the situation → give a reason → concrete request → polite closing' : 'Anrede → Situation/Anlass nennen → Grund erklären → konkrete Bitte/Forderung → höflicher Abschluss');
    var structureHint = '<div class="la-exam-structure-hint"><b>So wird bewertet:</b><span>'+esc(structureSteps)+'. Fehlt ein Baustein, wird der Teil hart abgewertet – gute Grammatik allein reicht nicht.</span></div>';
    var writingRubric = !isSpeaking ? renderWritingRubric(task, value) : '';
    var speakingRubric = isSpeaking ? renderSpeakingRubric(task, value) : '';
    return '<section class="la-card la-exam-task la-exam-paper" data-la-exam-free="'+esc(partName)+'"><div class="la-exam-proctor-line"><b>Prüfungsmodus</b><span>Antwort vollständig formulieren. Stichpunkte werden hart abgewertet.</span></div><span class="la-section-kicker">'+esc(PART_LABELS[partName])+' · '+esc(isSpeaking ? ((task.level || session.level || 'B1') + ' Sprechprüfung hart') : ((task.level || session.level || 'B1') + ' Schreibprüfung hart'))+'</span><h3>'+esc(task.title || PART_LABELS[partName])+'</h3>'+(task.variantTitle?'<div class="la-exam-pool-badge">'+esc(task.variantTitle)+'</div>':'')+(meta.length?'<div class="la-exam-mini-grid"><div><b>'+esc(meta[0]||'streng')+'</b><small>Vorgabe</small></div><div><b>'+esc(meta[1]||session.level||'B1')+'</b><small>Rahmen</small></div><div><b>'+esc(meta[2]||'bewertet')+'</b><small>Prüfung</small></div></div>':'')+'<p class="la-exam-prompt">'+esc(task.prompt || '')+'</p>'+structureHint+writingRubric+speakingRubric+'<div class="la-exam-required"><b>Pflichtpunkte:</b><ul>'+((task.requiredPoints||[]).map(function(p){return '<li>'+esc(p)+'</li>';}).join(''))+'</ul></div>' + hardHints +
      (isSpeaking ? '<div class="la-exam-warning"><b>Transparente Sprechbewertung:</b> Sprich frei und bestätige das Transkript. Ohne echten Audio-Analyzer bewertet die App nur Inhalt, Grammatik, Wortschatz und Textfluss. Aussprache, Intonation und tatsächliche mündliche Flüssigkeit bleiben offen.</div>'+speakingEvidenceHtml(session,value,result) : '<div class="la-exam-warning"><b>Schreiben hart:</b> Bewertung als strenger '+esc(task.level || session.level || 'B1')+'-Schreibprüfer. Thema, Pflichtpunkte, formeller Aufbau, Betreff/Anlass, Register und Kohärenz zählen. Zu kurze oder nur höfliche, aber inhaltsarme Texte werden gedeckelt.</div>') +
      '<label class="la-exam-textarea-label"><span>'+esc(isSpeaking ? 'Bestätigtes Transkript · Grundlage der textbasierten Bewertung' : 'Schriftliche Antwort mit formellem Aufbau')+'</span><textarea data-la-exam-answer="'+esc(partName)+'" rows="10" placeholder="Sprechen B2: Einleitung, Pro/Contra, eigene Position, Begründung, Beispiel, Fazit/Empfehlung. Schreiben: Betreff/Anlass, Anrede, Problem, Folge, Bitte, Abschluss …">'+esc(value)+'</textarea></label>' +
      (isSpeaking ? examDictationHtml(session) : '') +
      actionButtons + scoreBox(result) + '</section>';
  }

  /* G54.45.0: Echtes Sprechen in der Prüfung — Browser-Spracherkennung
     diktiert direkt in die Antwortbox. Ohne Unterstützung (z. B. iOS-PWA)
     bleibt der bewährte Transkript-Weg unverändert bestehen. */
  function examSpeechSupported(){
    try{ return typeof window !== 'undefined' && !!(window.SpeechRecognition || window.webkitSpeechRecognition); }catch(e){ return false; }
  }
  function examDictationHtml(session){
    if(!examSpeechSupported()){
      return '<p class="la-note">🎙️ Automatisches Diktat ist auf diesem Gerät nicht verfügbar. Tippe dein bestätigtes Transkript ein. Aussprache und Intonation werden dabei nicht bewertet.</p>';
    }
    var lang = normalizeExamLanguage(session && session.examLanguage || simulationLanguage(session && session.context));
    return '<div class="la-exam-dictation"><button type="button" class="la-secondary" data-ui-action="language-exam-dictate" data-la-dictate-lang="'+esc(lang)+'">🎙️ Sprechen &amp; diktieren</button><small data-la-dictate-status>Sprich frei — die Browser-Spracherkennung erzeugt nur ein Transkript. Prüfe es vor der Bewertung; der Erkennungswert ist kein Aussprachewert.</small></div>';
  }
  var __examRecognition = null;
  function toggleExamDictation(btn){
    var status = document.querySelector('[data-la-dictate-status]');
    function setStatus(t){ if(status) status.textContent = t; }
    if(__examRecognition){
      try{ __examRecognition.stop(); }catch(e){}
      __examRecognition = null;
      btn.classList.remove('is-recording');
      btn.innerHTML = '🎙️ Sprechen &amp; diktieren';
      setStatus('Aufnahme beendet. Prüfe und korrigiere dein Transkript vor der Bewertung.');
      return true;
    }
    var Rec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if(!Rec){ setStatus('Spracherkennung auf diesem Gerät nicht verfügbar.'); return true; }
    var lang = btn.getAttribute('data-la-dictate-lang') === 'en' ? 'en-GB' : 'de-DE';
    var rec = new Rec();
    var recognitionStartedAt=Date.now(), confidenceValues=[];
    rec.lang = lang; rec.continuous = true; rec.interimResults = false;
    rec.onresult = function(ev){
      try{
        try{for(var ci=ev.resultIndex||0;ci<(ev.results||[]).length;ci++){var cr=ev.results[ci];for(var cj=0;cj<(cr&&cr.length||0);cj++){if(typeof cr[cj].confidence==='number'&&cr[cj].confidence>0)confidenceValues.push(cr[cj].confidence);}}}catch(_confidenceError){}
        var ta = document.querySelector('#uiSheet textarea[data-la-exam-answer]') || document.querySelector('textarea[data-la-exam-answer]');
        if(!ta) return;
        var chunk = '';
        for(var i = ev.resultIndex; i < ev.results.length; i++){
          if(ev.results[i].isFinal) chunk += ev.results[i][0].transcript + ' ';
        }
        if(chunk){
          ta.value = (ta.value ? ta.value.replace(/\s+$/,'') + ' ' : '') + chunk.trim();
          ta.dispatchEvent(new Event('input', { bubbles:true }));
        }
      }catch(e){}
    };
    rec.onerror = function(ev){
      setStatus(ev && ev.error === 'not-allowed' ? 'Mikrofonberechtigung fehlt oder wurde blockiert.' : 'Erkennung unterbrochen — du kannst weitersprechen oder tippen.');
    };
    rec.onend = function(){
      try{var es=loadSession()||defaultSession('B1');var avg=confidenceValues.length?confidenceValues.reduce(function(a,b){return a+b;},0)/confidenceValues.length:null;es.speakingEvidence={source:'speech-recognition-transcript',recognizerUsed:true,transcriptConfidence:avg,durationMs:Date.now()-recognitionStartedAt,hasRawAudio:false,audioAnalyzed:false,edited:false};saveSession(es);}catch(_evidenceError){}
      if(__examRecognition === rec){
        __examRecognition = null;
        btn.classList.remove('is-recording');
        btn.innerHTML = '🎙️ Sprechen &amp; diktieren';
      }
    };
    try{
      rec.start();
      __examRecognition = rec;
      btn.classList.add('is-recording');
      btn.innerHTML = '⏹️ Aufnahme beenden';
      setStatus('Ich höre zu … Sprich ruhig und in vollständigen Sätzen.');
    }catch(e){ setStatus('Mikrofonstart fehlgeschlagen. Bitte Browserberechtigung prüfen.'); }
    return true;
  }
  function scoreBox(result){
    if(!result) return '<div class="la-exam-score is-empty"><b>Noch nicht bewertet</b><small>Bearbeite diesen Prüfungsteil und starte die Bewertung.</small></div>';
    var score = typeof result.overallScore === 'number' ? result.overallScore : result.score;
    var passed = result.passed === true || result.passedLocal === true;
    var reasons = result.hardFailReasons || result.capReasons || [];
    var aiInfo = result.aiError ? '<small class="is-warning">KI-Bewertung nicht erreichbar: '+esc(result.aiError)+'</small>' : '';
    var details = result.local ? '<small>Lokal: '+esc(result.local.score)+'% · Bewertungsgewicht: '+esc(Math.round(((result.weights&&result.weights.ai)||0)*100))+'%</small>' : '';
    var scopeInfo=result.part==='speaking'||result.speakingAssessment?'<small class="la-speaking-score-scope">Bewertungsart: '+esc(result.scoreLabel||((result.evidence&&result.evidence.audioAnalyzed)?'Sprechleistung mit Audioanalyse':'textbasierte Sprechaufgabe'))+' · '+esc(result.assessmentCompleteness||((result.evidence&&result.evidence.audioAnalyzed)?100:67))+'% Bewertungsumfang</small>':'';
    return '<div class="la-exam-score '+(passed?'is-pass':'is-fail')+'"><b>'+esc(score || 0)+'% · '+esc(passed ? 'bestanden' : 'nicht bestanden')+'</b><small>'+esc(result.readiness || (passed?'realistische Chancen':'noch nicht prüfungsbereit'))+'</small>'+scopeInfo+details+aiInfo+(reasons.length?'<ul>'+reasons.map(function(r){return '<li>'+esc(r)+'</li>';}).join('')+'</ul>':'')+'</div>';
  }
  function renderCurrentPart(session){
    if(session.currentPart === 'reading') return renderObjectivePart(session,'reading');
    if(session.currentPart === 'listening') return renderObjectivePart(session,'listening');
    if(session.currentPart === 'grammar') return renderGrammarPart(session);
    if(session.currentPart === 'writing') return renderFreePart(session,'writing');
    return renderFreePart(session,'speaking');
  }
  function pctBar(score){
    var value = Math.max(0, Math.min(100, Number(score || 0)));
    return '<div class="la-exam-progress"><span style="width:'+esc(value)+'%"></span></div>';
  }
  function listHtml(items, emptyText){
    items = Array.isArray(items) ? items : [];
    if(!items.length) return '<p class="la-note">'+esc(emptyText || 'Keine Einträge.')+'</p>';
    return '<ul>'+items.map(function(item){ return '<li>'+esc(item)+'</li>'; }).join('')+'</ul>';
  }
  function partStatusLabel(item){
    if(!item || item.score == null) return 'offen';
    if(item.passed) return 'bestanden';
    if(item.score < item.minScore) return 'unter Mindestleistung';
    return 'kritisch';
  }

  function examCoachReportHtml(final){
    final = final || {};
    var rows = Array.isArray(final.partBreakdown) ? final.partBreakdown.slice() : [];
    var weak = rows.filter(function(x){ return x.score == null || x.passed === false || Number(x.score||0) < Number(x.minScore||0)+8; }).sort(function(a,b){ return Number(a.score||0)-Number(b.score||0); }).slice(0,3);
    var strong = rows.filter(function(x){ return x.passed && Number(x.score||0) >= Number(x.minScore||0)+12; }).sort(function(a,b){ return Number(b.score||0)-Number(a.score||0); }).slice(0,3);
    var plan = weak.map(function(x){
      var part = x.part || 'grammar';
      var label = PART_LABELS[part] || part;
      var action = part === 'reading' ? '2 Lesetexte mit Belegstellen trainieren.' : part === 'listening' ? 'Hörtext zuerst ohne Transkript, danach Fehlerstelle markieren.' : part === 'grammar' ? 'Sprachbausteine nach Fehlertyp clustern und 20 Minuten wiederholen.' : part === 'writing' ? 'Pflichtpunkte vor dem Schreiben abhaken und Textaufbau kontrollieren.' : 'Antwort laut strukturieren: Einstieg, Begründung, Beispiel, Abschluss.';
      return label + ': ' + action;
    });
    if(!plan.length) plan.push('Nächste Variante starten und Ergebnis stabilisieren. Ziel: gleiche Leistung in mindestens zwei Varianten.');
    var risk = final.passed ? (Number(final.readinessProbability||0) >= 80 ? 'gering' : 'mittel') : 'hoch';
    return '<div class="la-exam-report-box is-coach" data-la-exam-coach-report="G54.44.4"><h4>Coach-Auswertung · nächste Trainingsentscheidung</h4><p><b>Risiko:</b> '+esc(risk)+' · <b>Prognose:</b> '+esc(final.readiness || 'offen')+' · '+esc(final.readinessProbability || 0)+'%</p><div class="la-exam-report-grid"><div><b>Priorität</b>'+listHtml(plan,'Keine Sofortmaßnahme nötig.')+'</div><div><b>Stabile Bereiche</b>'+listHtml(strong.map(function(x){ return (PART_LABELS[x.part]||x.part)+': '+x.score+'%'; }),'Noch keine stabilen Bereiche.')+'</div></div><p class="la-note">Coach-Regel: Eine positive Trainingsprognose wird erst nach mindestens zwei unterschiedlichen bestandenen Varianten stabiler. Sie bleibt trotzdem keine Garantie für eine offizielle Prüfung.</p></div>';
  }

  function resultActionBar(session){
    var sim = isSimulationContext(session && session.context);
    if(sim){
      return '<div class="la-level-actions la-exam-result-actions"><button type="button" class="la-primary" data-ui-action="language-exam-reset">Neue Vollprüfung</button><button type="button" class="la-secondary" data-ui-action="language-exam-simulation-home">Zurück zur Sprachtest-Simulation</button><button type="button" class="la-secondary" data-ui-action="language-course-open">Im Sprachtraining gezielt üben</button></div>';
    }
    return '<div class="la-level-actions la-exam-result-actions"><button type="button" class="la-primary" data-ui-action="language-exam-reset">Neue Prüfung</button><button type="button" class="la-secondary" data-ui-action="language-course-open">Zurück zum Sprachtraining</button></div>';
  }
  function resultNextStepBox(session, final){
    var sim = isSimulationContext(session && session.context);
    var title = sim ? 'Nächster Schritt nach der Simulation' : 'Nächster Schritt im Sprachtraining';
    var intro = sim ? 'Die Vollprüfung ist abgeschlossen. Die Simulation bleibt Prüfung. Üben und Nacharbeiten passiert getrennt im Sprachtraining.' : 'Nutze die Auswertung als Trainingsplan und starte danach bei Bedarf eine neue Simulation.';
    var action = sim ? 'Gehe ins Sprachtraining, wiederhole die schwächsten Teile gezielt und starte danach eine neue Vollprüfung.' : (final.nextRequiredAction || 'Gezielt wiederholen und erneut prüfen.');
    return '<div class="la-exam-report-box is-next la-exam-result-next-step"><h4>'+esc(title)+'</h4><p>'+esc(intro)+'</p>'+listHtml(final.recommendations, 'Weitere Simulation durchführen.')+'<p class="la-note"><b>Empfehlung:</b> '+esc(action)+'</p></div>';
  }
  function renderResult(session){
    var final = session.final || (engine() && engine().computeFinal ? engine().computeFinal(session) : null);
    if(!final) return '';
    var parts = Array.isArray(final.partBreakdown) ? final.partBreakdown : PARTS.map(function(p){
      var r = session.parts && session.parts[p];
      return { part:p, label:PART_LABELS[p], score:r ? (r.overallScore || r.score || 0) : null, minScore:55, passed:!!(r && (r.passed || r.passedLocal)), status:r?'bewertet':'offen', hardFailReasons:[], missingPoints:[] };
    });
    var rows = parts.map(function(item){
      var scoreText = item.score == null ? 'offen' : item.score + '%';
      var cls = item.passed ? 'is-pass' : (item.score == null ? 'is-open' : 'is-fail');
      var issues = (item.hardFailReasons || []).concat(item.missingPoints || []).slice(0, 3);
      return '<tr class="'+cls+'"><td><b>'+esc(item.label || PART_LABELS[item.part] || item.part)+'</b></td><td>'+esc(scoreText)+'<small> Mindestwert: '+esc(item.minScore || '—')+'% · Gewicht: '+esc(item.weight || 20)+'%</small>'+pctBar(item.score || 0)+'</td><td>'+esc(partStatusLabel(item))+'</td><td>'+(issues.length ? issues.map(function(x){ return '<small>• '+esc(x)+'</small>'; }).join('') : '<small>Keine kritischen Hinweise.</small>')+'</td></tr>';
    }).join('');
    var probability = final.readinessProbability == null ? 0 : final.readinessProbability;
    var finalCls = final.passed ? 'is-pass' : 'is-fail';
    var sim = isSimulationContext(session.context);
    return '<section class="la-card la-exam-final '+finalCls+'" data-la-exam-result="phase8s">' +
      '<span class="la-section-kicker">'+esc(sim ? 'Vollprüfung · Ergebnisbericht' : 'Prüfungsübersicht · Ergebnisbericht')+'</span>' +
      '<h3>'+esc(final.passed?'Bestanden':'Nicht bestanden')+' · '+esc(final.overallScore)+'%</h3>' +
      '<div class="la-exam-verdict"><b>Trainingsprognose: '+esc(final.readiness)+'</b><small>'+esc(final.readinessVerdict || '')+'</small>'+pctBar(probability)+'</div>' +
      '<div class="la-exam-mini-grid"><div><b>'+esc(final.completedParts)+'/'+esc(final.totalParts || PARTS.length)+'</b><small>Pflichtteile abgeschlossen</small></div><div><b>'+esc(final.passScore)+'%</b><small>Bestehensgrenze</small></div><div><b>'+esc(probability)+'%</b><small>interne Trainingsprognose</small></div></div>' +
      '<div class="la-exam-teacher-summary"><b>'+esc(sim ? 'Prüferkommentar nach Abgabe' : 'Prüferkommentar')+'</b><p>'+esc(final.teacherSummary || '')+'</p></div>' +
      '<div data-calibration-note><b>Kalibrierungsbasis:</b> gewichtete fünf Teilbereiche, nicht kompensierbare Mindestwerte und '+esc(final.readinessEvidence || 'single-variant')+'. Hilfsmodus, lokale Freitextbewertung und Sprechen ohne ausgewiesene Audioanalyse begrenzen die Prognose bewusst.</div>' +
      '<div class="la-exam-table-scroll" role="region" aria-label="Sprachtest-Vollprüfung Ergebnisübersicht"><table class="la-table la-exam-result-table"><thead><tr><th>Teil</th><th>Punkte</th><th>Status</th><th>Hinweise</th></tr></thead><tbody>'+rows+'</tbody></table></div>' +
      '<div class="la-exam-report-grid"><div class="la-exam-report-box is-critical"><h4>Kritische Schwächen</h4>'+listHtml(final.criticalWeaknesses, 'Keine kritischen Schwächen erkannt.')+'</div><div class="la-exam-report-box is-strength"><h4>Stärken</h4>'+listHtml(final.strengths, 'Noch keine stabilen Stärken erkannt.')+'</div></div>' + examCoachReportHtml(final) +
      weaknessProfileHtml(session.level, { level:session.level, overallScore:final.overallScore, passed:final.passed, completedParts:final.completedParts, partScores:parts.reduce(function(map,item){ map[item.part] = Number(item.score || 0); return map; }, {}) }) +
      resultNextStepBox(session, final) +
      '<div class="la-exam-warning"><b>Rechtlicher Hinweis:</b> '+esc(final.certificateNote || 'Dies ist eine interne Prüfungssimulation und kein offizielles Sprachzertifikat.')+'</div>' +
      resultActionBar(session) +
      '</section>';
  }
  function examStabilityEvidence(session){
    var level=normalizeLevel(session&&session.level), lang=normalizeExamLanguage(session&&session.examLanguage||simulationLanguage(session&&session.context));
    var seen={};
    loadHistory().forEach(function(item){ if(!item||!item.passed||normalizeLevel(item.level)!==level)return; var il=normalizeExamLanguage(item.examLanguage||'de'); if(il!==lang)return; var id=String(item.examVariantId||''); if(id)seen[id]=true; });
    return {distinctPassedVariants:Object.keys(seen).length,variantIds:Object.keys(seen),language:lang,level:level};
  }
  function renderSession(session){
    session = saveSession(session || loadSession() || defaultSession('B1'));
    var allDone = PARTS.every(function(p){ return !!(session.parts && session.parts[p]); });
    if(allDone && engine() && engine().computeFinal){ session.stabilityEvidence=examStabilityEvidence(session); session.final = engine().computeFinal(session); if(session.status !== 'finished'){ session.status = 'finished'; session.finishedAt = new Date().toISOString(); } saveSession(session); archiveFinalAttempt(session); }
    var body = '<div class="la-dashboard la-exam-shell" data-la-exam-shell="phase8s" data-la-exam-level="'+esc(session.level)+'">' +
      examHeader(session) + (session.status === 'training' ? trainingModeBanner(session) : examPressureBar(session)) + renderCurrentPart(session) + (allDone ? renderResult(session) : '<section class="la-card"><div class="la-level-actions"><button type="button" class="la-secondary" data-ui-action="language-exam-prev-part">Vorheriger Teil</button><button type="button" class="la-primary" data-ui-action="language-exam-next-part">Nächster Teil</button><button type="button" class="la-secondary" data-ui-action="language-exam-home">Prüfungsübersicht</button></div></section>') + '</div>';
    var opened = openSheet(session.level + (isSimulationContext(session.context) ? (' '+simulationLanguageLabel(session.context)+'-Vollprüfung') : ' Prüfung'), isSimulationContext(session.context) ? 'Sprachtest-Simulation · Vollprüfung ohne Hilfe.' : 'Teilnavigation, Bewertung und Ergebnisbericht.', body, '🎓');
    setTimeout(function(){ bindInputs(); startVisualTimers(); }, 0);
    return opened;
  }
  function start(level, examVariant){
    level = normalizeLevel(level || 'B1');
    if(lockHeldByOtherTab()) return renderTabLockWarning(level, examVariant);
    var sim = isSimulationContext();
    if(sim && !fullExamReadyForSimulation(level)) return renderSimulationHome(simulationLanguage());
    var session = defaultSession(level, examVariant || 'random');
    session.status = 'running';
    session.examVariantSelectionMode = examVariant === 'random' || !examVariant ? 'random' : 'chosen';
    session.currentPart = 'reading';
    session.context = getContext();
    session.examLanguage = isSimulationContext(session.context) ? simulationLanguage(session.context) : (session.examLanguage || 'de');
    session.simulationMode = isSimulationContext(session.context) ? (session.examLanguage+'-full-exam') : 'training-linked-exam';
    return renderSession(saveSession(session));
  }
  function resume(){ return renderSession(loadSession() || defaultSession('B1')); }
  function setPart(part){
    var session = loadSession() || defaultSession('B1');
    if(PARTS.indexOf(part) >= 0){ session.currentPart = part; session.partStartedAt = Object.assign({}, session.partStartedAt || {}); if(!session.partStartedAt[part]) session.partStartedAt[part] = nowIso(); saveSession(session); }
    return renderSession(session);
  }
  function move(delta){
    var session = loadSession() || defaultSession('B1');
    var idx = Math.max(0, PARTS.indexOf(session.currentPart));
    idx = Math.max(0, Math.min(PARTS.length - 1, idx + delta));
    session.currentPart = PARTS[idx];
    session.partStartedAt = Object.assign({}, session.partStartedAt || {});
    if(!session.partStartedAt[session.currentPart]) session.partStartedAt[session.currentPart] = nowIso();
    return renderSession(saveSession(session));
  }
  function bindInputs(){
    document.querySelectorAll('[data-la-mini-answer]').forEach(function(input){
      if(input.getAttribute('data-la-bound') === '1') return;
      input.setAttribute('data-la-bound','1');
      input.addEventListener('input',function(){
        var idx = input.getAttribute('data-la-mini-answer');
        var session = loadSession() || defaultSession('B2');
        if(!session.trainingFocus) return;
        session.trainingFocus.miniAnswers = Object.assign({}, session.trainingFocus.miniAnswers || {});
        session.trainingFocus.miniAnswers[idx] = input.value;
        session.trainingFocus.miniProgress = null;
        saveTrainingState(session);
        saveSession(session);
      });
    });
    document.querySelectorAll('[data-la-mini-check]').forEach(function(input){
      if(input.getAttribute('data-la-bound') === '1') return;
      input.setAttribute('data-la-bound','1');
      input.addEventListener('change',function(){
        var idx = input.getAttribute('data-la-mini-check');
        var cidx = Number(input.getAttribute('data-la-mini-check-index') || 0);
        var session = loadSession() || defaultSession('B2');
        if(!session.trainingFocus) return;
        session.trainingFocus.miniChecks = Object.assign({}, session.trainingFocus.miniChecks || {});
        var arr = Array.isArray(session.trainingFocus.miniChecks[idx]) ? session.trainingFocus.miniChecks[idx].slice() : [];
        if(input.checked && arr.indexOf(cidx) < 0) arr.push(cidx);
        if(!input.checked) arr = arr.filter(function(x){ return x !== cidx; });
        session.trainingFocus.miniChecks[idx] = arr;
        session.trainingFocus.miniProgress = null;
        saveTrainingState(session);
        saveSession(session);
      });
    });
    document.querySelectorAll('[data-la-exam-answer]').forEach(function(input){
      if(input.getAttribute('data-la-bound') === '1') return;
      input.setAttribute('data-la-bound','1');
      input.addEventListener('input',function(){
        var part = input.getAttribute('data-la-exam-answer');
        var session = loadSession() || defaultSession('B1');
        session.answers[part] = input.value;
        if(part==='speaking'){var prior=session.speakingEvidence||{};session.speakingEvidence=Object.assign({},prior,{source:prior.source||'manual-transcript',edited:!!prior.source,hasRawAudio:false,audioAnalyzed:false});}
        saveSession(session);
      });
    });
  }
  function completeObjective(part){
    var session = loadSession() || defaultSession('B1');
    var pilot = getPilotPart(session, part);
    if(part === 'listening'){
      var lst = listeningState(session, pilot);
      if(!lst || lst.plays <= 0){
        session.parts[part] = { part:part, mode:'b1-listening-locked', passed:false, overallScore:0, score:0, readiness:'Hörteil nicht prüfungsnah bearbeitet', hardFailReasons:['Der Hörtext wurde noch nicht abgespielt. In der realistischen Hörprüfung müssen die Fragen nach dem Hören beantwortet werden.'], generatedAt:nowIso() };
        return renderSession(saveSession(session));
      }
    }
    var questions = pilot && Array.isArray(pilot.questions) ? pilot.questions : null;
    var selectedMap = session.answers && session.answers[part] && session.answers[part].answers ? session.answers[part].answers : {};
    if(questions && questions.length){
      var correctCount = questions.filter(function(q){ return selectedMap[q.id] === q.correct; }).length;
      var answeredCount = questions.filter(function(q){ return !!selectedMap[q.id]; }).length;
      var score = Math.round((correctCount / questions.length) * 100);
      if(answeredCount < questions.length){ score = Math.min(score, Math.round((answeredCount / questions.length) * 70)); }
      var listeningMeta = part === 'listening' ? listeningState(session, pilot) : null;
      var helperPenalty = listeningMeta && (listeningMeta.helperMode || listeningMeta.strictAudio === false || listeningMeta.audioMode === 'transcript-helper');
      if(helperPenalty){ score = Math.min(score, 84); }
      var min = Number(pilot.passScore || 70);
      var timeState = partTimeState(session, part);
      session.partCompletedAt = Object.assign({}, session.partCompletedAt || {});
      session.partCompletedAt[part] = nowIso();
      session.parts[part] = {
        part:part, mode:part === 'listening' ? 'academy-hard-listening-final' : (part === 'grammar' ? 'academy-hard-grammar-language-elements' : 'academy-hard-objective'), timedOut: timeState.remaining <= 0, passed:score >= min && answeredCount === questions.length && timeState.remaining > 0,
        overallScore:score, score:score, correctCount:correctCount, totalQuestions:questions.length, answeredCount:answeredCount,
        helperMode:!!helperPenalty,
        audioMode:listeningMeta ? listeningMeta.audioMode : null,
        readiness: score >= min && answeredCount === questions.length ? (part === 'grammar' ? 'Grammatik & Sprachbausteine bestanden' : (helperPenalty ? 'Hörteil im Hilfsmodus bestanden · nicht ganz streng' : 'Objektiver '+session.level+'-Teil bestanden')) : session.level+'-Teil noch nicht prüfungsreif',
        hardFailReasons: (score >= min && answeredCount === questions.length && timeState.remaining > 0) ? (helperPenalty ? ['Hinweis: Transkript-/Audio-Hilfsmodus wurde genutzt. Für maximale Prüfungsnähe später ohne Hilfsmodus wiederholen.'] : []) : [session.level+'-Mindestleistung nicht erreicht, nicht alle Fragen beantwortet oder Zeit rechnerisch überschritten.'],
        generatedAt:nowIso()
      };
      return renderSession(saveSession(session));
    }
    var ans = session.answers && session.answers[part] && session.answers[part].answer;
    var correct = part === 'reading' ? 'a' : 'b';
    var fallbackScore = ans === correct ? 100 : (ans ? 20 : 0);
    var bp = getBlueprint(session.level) || {};
    var fallbackMin = (bp.parts && bp.parts[part] && bp.parts[part].minScore) || bp.partMinScore || 55;
    var fallbackTimeState = partTimeState(session, part); session.partCompletedAt = Object.assign({}, session.partCompletedAt || {}); session.partCompletedAt[part] = nowIso();
    session.parts[part] = { part:part, timedOut:fallbackTimeState.remaining <= 0, passed:fallbackScore >= fallbackMin && fallbackTimeState.remaining > 0, overallScore:fallbackScore, score:fallbackScore, readiness: fallbackScore >= fallbackMin ? 'Objektiver Teil bestanden' : 'Objektiver Teil schwach', hardFailReasons: fallbackScore >= fallbackMin ? [] : ['Antwort falsch oder nicht beantwortet.'], generatedAt:nowIso() };
    return renderSession(saveSession(session));
  }
  function setObjectiveAnswer(part, answer, questionId){
    var session = loadSession() || defaultSession('B1');
    var current = Object.assign({ answers:{} }, session.answers[part] || {});
    if(questionId){ current.answers[questionId] = answer; }
    else { current.answer = answer; }
    session.answers[part] = current;
    return renderSession(saveSession(session));
  }
  async function assessFree(part, hybrid){
    var session = loadSession() || defaultSession('B1');
    var text = session.answers && session.answers[part] ? session.answers[part] : '';
    var task = currentTask(session, part);
    try{
      if(part === 'speaking' && hybrid && engine() && engine().assessSpeakingExam){
        session.parts[part] = await engine().assessSpeakingExam({ level:session.level, task:task, userText:text, evidence:normalizedSpeakingEvidence(session,text) });
      }else if(part === 'writing' && hybrid && engine() && engine().assessWritingExam){
        session.parts[part] = await engine().assessWritingExam({ level:session.level, task:task, userText:text });
      }else if(engine() && engine().localAssessResponse){
        var local = engine().localAssessResponse({ level:session.level, part:part, task:task, userText:text });
        session.parts[part] = Object.assign({}, local, { overallScore:local.score, passed:local.passedLocal, evidence:part==='speaking'?normalizedSpeakingEvidence(session,text):null, assessmentScope:part==='speaking'?'transcript-only':null, assessmentCompleteness:part==='speaking'?67:null, scoreLabel:part==='speaking'?'Textbasierte Sprechaufgabe':null, readiness:part==='speaking'?(local.passedLocal?'Textbasierter Sprechauftrag bestanden · Audio offen':'Textbasierter Sprechauftrag nicht bestanden · Audio offen'):(local.passedLocal?'lokal bestanden':'lokal nicht bestanden') });
      }else{
        session.parts[part] = { part:part, overallScore:0, passed:false, hardFailReasons:['Prüfungsengine nicht geladen.'] };
      }
    }catch(error){
      var fallback = engine() && engine().localAssessResponse ? engine().localAssessResponse({ level:session.level, part:part, task:task, userText:text }) : { score:0, passedLocal:false };
      session.parts[part] = Object.assign({}, fallback, { overallScore:fallback.score || 0, passed:!!fallback.passedLocal, evidence:part==='speaking'?normalizedSpeakingEvidence(session,text):null, assessmentScope:part==='speaking'?'transcript-only':null, assessmentCompleteness:part==='speaking'?67:null, scoreLabel:part==='speaking'?'Textbasierte Sprechaufgabe':null, aiError:error && error.message ? error.message : String(error), readiness:part==='speaking'?'Textbasierter Fallback · Aussprache/Intonation offen':'lokaler Fallback' });
    }
    var tsFree = partTimeState(session, part);
    session.partCompletedAt = Object.assign({}, session.partCompletedAt || {});
    session.partCompletedAt[part] = nowIso();
    if(session.parts && session.parts[part]){
      session.parts[part].timedOut = tsFree.remaining <= 0;
      if(tsFree.remaining <= 0){
        session.parts[part].passed = false;
        session.parts[part].hardFailReasons = (session.parts[part].hardFailReasons || []).concat(['Zeit rechnerisch überschritten.']);
        session.parts[part].readiness = 'Zeit überschritten · nicht prüfungsreif';
      }
    }
    return renderSession(saveSession(session));
  }
  function startVisualTimers(){
    document.querySelectorAll('[data-la-exam-timer]').forEach(function(node){
      var start = isoMs(node.getAttribute('data-la-exam-start'));
      var total = Number(node.getAttribute('data-la-exam-total') || 0);
      var elapsed = Math.max(0, Math.floor((Date.now() - start) / 1000));
      var remaining = Math.max(0, total - elapsed);
      node.textContent = formatSeconds(remaining);
      var bar = document.querySelector('[data-la-exam-timebar]');
      if(bar){ bar.style.width = clamp(Math.round((remaining / Math.max(1,total)) * 100), 0, 100) + '%'; }
      var root = document.querySelector('[data-la-exam-timer-root]');
      if(root){
        root.classList.toggle('is-danger', remaining <= Math.round(total * 0.15));
        root.classList.toggle('is-warning', remaining > Math.round(total * 0.15) && remaining <= Math.round(total * 0.35));
      }
    });
  }
  setInterval(startVisualTimers, 1000);
  function diagnostics(){
    return { ok:!!(engine() && blueprints()), phase:'G54.46.12', version:VERSION, hasEngine:!!engine(), hasBlueprints:!!blueprints(), routes:['language-exam-open','language-exam-start','language-exam-hybrid-check','language-exam-dashboard'], levels:levelList(), storageKey:STORAGE_KEY, features:['visible exam shell','level selection','part navigation','B1 hard reading pool','B1 hard listening pool','B1 writing task pool','B1 speaking task pool','Groq examiner for free answers','strict final report','readiness prognosis','critical weakness report','repeat recommendations','no exam release gate','B1 expanded pool','hard edge case detection','visual exam pressure','countdown timer','completion status strip','mobile exam layout','realistic listening mode','browser tts playback','listening repeat limit','locked answers before listening','hidden transcript','strict b1 writing rubric','formal structure checklist','subject reason check','writing hard caps','strict b1 speaking rubric','speaking structure checklist','confirmed transcript mode','speaking hard caps','B1 full exam QA scenarios','pass/fail regression test','Groq fallback validation','incomplete exam validation','B2 exam architecture active','B2 hard reading pool active','B2 hard listening pool active','B2 hard grammar pool active','B2 hard writing pool active','B2 hard speaking pool active','B2 speaking 8 variants','B2 speaking 180-350 words','B2 speaking example hard cap','B2 speaking own-position hard cap','B2 writing formal complaint','B2 writing argumentative essay','B2 writing strict word count','B2 writing register hard caps','B2 grammar nominalization','B2 grammar passive reported speech','B2 grammar register correction','B2 grammar sentence order','B2 listening speaker attitude','B2 listening indirect criticism','B2 listening conditions and constraints','level difficulty matrix','A1 vs B2 differentiation guarantee','dynamic examiner profile per level','level-specific hard caps','B2 reading author intent','B2 reading indirect meaning','B2 reading hard distractors','B2 reading/listening/writing/speaking starter pool','B2 argumentation requirements','B2 strict Groq examiner','listening final helper mode','audio fallback marking','transcript helper mode','listening source validation','grammar language elements required block','B1/B2 grammar pool','five-part hardmode exam','B1 hardmode total QA','grammar required in final QA','B2 full exam QA scenarios','B2 endsimulation matrix','B2 hardmode total regression','B2 all five parts validation','B2 incomplete part fail validation','B2 Groq fallback regression','B2 helper listening marking','B2 A1/B1 answer rejection','listening helper mode marked in final QA','B2 visual device QA','desktop ipad iphone viewport simulation','result table scroll guard','touch target guard','deployment cache validation','service worker network-first deployment check','exam dashboard overview','A1-B2 learning status comparison','attempt history archive','next-step recommendation matrix','level requirement comparison cards','weakness profile','part-specific training paths','critical-borderline-stable bands','result-linked training plan','dashboard learning details','weakness profile direct training start','focused training session','training mode banner','training completion route','part-specific training launch buttons','real mini exercise sets per weakness','mini training set renderer','reading listening grammar writing speaking mini drills','pattern solution and checklist per mini task','mini training evaluation','mini task answer persistence','local training progress history','dashboard training progress summary','full exam multiple variants per level','variant-specific writing speaking','post-exam coach report','G54.46.10 calibrated DE/EN full simulation QA','G54.46.11 realistic multi-voice listening engine','level-specific listening pace and pauses','iOS speech heartbeat','voice fallback diagnostics','transparent speaking evidence','transcript-only disclosure','pronunciation and intonation remain null without audio analyzer' ] };
  }
  function handleClick(ev){
    var btn = ev.target && ev.target.closest && ev.target.closest('[data-ui-action]');
    if(!btn) return false;
    var action = btn.getAttribute('data-ui-action') || '';
    if(action.indexOf('language-exam-') !== 0) return false;
    if(btn.getAttribute('aria-disabled') === 'true'){ ev.preventDefault(); ev.stopPropagation(); return true; }
    ev.preventDefault(); ev.stopPropagation();
    try{
      return dispatchAction(action, btn);
    }catch(err){
      try{ console.error('[LanguageExamShell] Aktion fehlgeschlagen:', action, err); }catch(e){}
      try{ showShellErrorNotice(action); }catch(e){}
      return true;
    }
  }
  function showShellErrorNotice(action, message){
    var host = document.getElementById('la-exam-shell-error-notice');
    if(!host){
      host = document.createElement('div');
      host.id = 'la-exam-shell-error-notice';
      host.setAttribute('role','alert');
      host.style.cssText = 'position:fixed;left:50%;bottom:96px;transform:translateX(-50%);z-index:2147483647;max-width:92vw;background:#7f1d1d;color:#fef2f2;border:1px solid rgba(254,202,202,.55);border-radius:14px;padding:12px 16px;font-weight:700;font-size:14px;box-shadow:0 18px 44px rgba(0,0,0,.4);text-align:center;';
      document.body.appendChild(host);
    }
    host.textContent = message || 'Da ist etwas schiefgelaufen. Bitte erneut versuchen oder die App neu laden.';
    host.style.display = 'block';
    clearTimeout(host.__t);
    host.__t = setTimeout(function(){ host.style.display = 'none'; }, 7000);
  }
  function dispatchAction(action, btn){
    if(action === 'language-exam-open') return renderHome();
    if(action === 'language-exam-language-choice') return renderSimulationLanguageChoice();
    if(action === 'language-exam-open-de') return renderSimulationHome('de');
    if(action === 'language-exam-open-en') return renderSimulationHome('en');
    if(action === 'language-exam-simulation-home') return isSimulationContext() ? renderSimulationHome(simulationLanguage()) : renderSimulationLanguageChoice();
    if(action === 'language-exam-home') return isSimulationContext() ? renderSimulationHome(simulationLanguage()) : renderHome();
    if(action === 'language-exam-level-pending') return renderSimulationHome(simulationLanguage());
    if(action === 'language-exam-select-variant') return renderVariantSelection(btn.getAttribute('data-la-exam-level') || 'B1');
    if(action === 'language-exam-start') return start(btn.getAttribute('data-la-exam-level') || 'B1', btn.getAttribute('data-la-exam-variant') || 'random');
    if(action === 'language-exam-dictate') return toggleExamDictation(btn);
    if(action === 'language-exam-takeover-start'){ try{ localStorage.removeItem(TAB_LOCK_KEY); }catch(e){} return start(btn.getAttribute('data-la-exam-level') || 'B1', btn.getAttribute('data-la-exam-variant') || 'random'); }
    if(action === 'language-exam-training-start') return startTraining(btn.getAttribute('data-la-training-level') || btn.getAttribute('data-la-exam-level') || 'B2', btn.getAttribute('data-la-training-part') || 'grammar');
    if(action === 'language-exam-training-finish') return finishTraining();
    if(action === 'language-exam-mini-evaluate'){ var ms = loadSession() || defaultSession('B2'); if(ms.trainingFocus){ ms.trainingFocus.miniProgress = evaluateMiniTraining(ms); saveTrainingState(ms); return renderSession(saveSession(ms)); } return renderSession(ms); }
    if(action === 'language-exam-mini-reset'){ var rs = loadSession() || defaultSession('B2'); if(rs.trainingFocus){ rs.trainingFocus.miniAnswers = {}; rs.trainingFocus.miniChecks = {}; rs.trainingFocus.miniProgress = null; saveTrainingState(rs); return renderSession(saveSession(rs)); } return renderSession(rs); }
    if(action === 'language-exam-resume') return resume();
    if(action === 'language-exam-reset'){ var sim=isSimulationContext(); var lang=simulationLanguage(); clearSession(); return sim ? renderSimulationHome(lang) : renderHome(); }
    if(action === 'language-exam-open-part') return setPart(btn.getAttribute('data-la-exam-part') || 'reading');
    if(action === 'language-exam-prev-part') return move(-1);
    if(action === 'language-exam-next-part') return move(1);
    if(action === 'language-exam-objective-answer') return setObjectiveAnswer(btn.getAttribute('data-la-exam-part') || 'reading', btn.getAttribute('data-la-answer') || '', btn.getAttribute('data-la-question-id') || '');
    if(action === 'language-exam-play-listening') return playListening(btn);
    if(action === 'language-exam-reveal-listening') return revealListening();
    if(action === 'language-exam-complete-objective') return completeObjective(btn.getAttribute('data-la-exam-part') || 'reading');
    if(action === 'language-exam-local-check') return assessFree(btn.getAttribute('data-la-exam-part') || 'writing', false);
    if(action === 'language-exam-hybrid-check') return assessFree(btn.getAttribute('data-la-exam-part') || 'speaking', true);
    return true;
  }



  function simulationVariantUxQaSnapshot(){
    var findings = [];
    var levels = levelList().map(function(level){
      var pool = fullExamVariantPool(level);
      if(pool.length < 3) findings.push(level+': weniger als 3 Varianten.');
      var rendered = renderVariantSelection ? true : false;
      var ids = pool.map(function(v){ return v.id; });
      var dup = ids.filter(function(x,i,a){ return a.indexOf(x)!==i; });
      if(dup.length) findings.push(level+': doppelte Varianten-IDs.');
      return { level:level, variants:pool.length, ids:ids, hasRandomMode:true, hasVisibleSelection:rendered, ready:fullExamReadyForSimulation(level) };
    });
    return { phase:'G54.46.12', version:VERSION, ok:findings.length===0 && levels.every(function(x){return x.ready && x.hasRandomMode && x.hasVisibleSelection;}), language:simulationLanguage(), context:'simulation-center-full-exam-only', levels:levels, findings:findings, features:['sichtbare Variantenauswahl','Random-Modus','variantenspezifische Vorschau','Start speichert Variante','keine Teiltest-Auswahl'] };
  }

  function simulationFullExamQaSnapshot(){
    var levels = levelList();
    var findings = [];
    var rows = levels.map(function(level){
      var variants = fullExamVariantPool(level);
      var variantRows = variants.map(function(v){
        var reading = generatedObjectivePart(level,'reading',v);
        var listening = generatedObjectivePart(level,'listening',v);
        var grammar = generatedObjectivePart(level,'grammar',v);
        var writing = generatedFreeTask(level,'writing',v);
        var speaking = generatedFreeTask(level,'speaking',v);
        var keys = [reading.title, listening.title, grammar.title, writing.title, speaking.title].join('|').toLowerCase();
        var ready = fullExamReadyForSimulation(level) && reading.questions.length >= 3 && listening.questions.length >= 3 && grammar.questions.length >= 4 && writing.minWords > 0 && speaking.minWords > 0;
        if(!ready) findings.push(level+' '+v.label+': unvollständige Vollprüfung');
        return { id:v.id, label:v.label, theme:v.theme, ready:ready, parts:{ reading:reading.questions.length, listening:listening.questions.length, grammar:grammar.questions.length, writing:!!writing.id, speaking:!!speaking.id }, fingerprint:keys };
      });
      var duplicateFingerprints = variantRows.map(function(v){return v.fingerprint;}).filter(function(x,i,a){ return a.indexOf(x)!==i; });
      if(duplicateFingerprints.length) findings.push(level+': Varianten-Fingerprints wiederholen sich.');
      return { level:level, ready:variantRows.every(function(v){return v.ready;}), variants:variantRows.length, variantRows:variantRows, simulationStatus:simulationLevelStatus(level).label };
    });
    return { phase:'G54.46.12', version:VERSION, ok:rows.every(function(r){return r.ready;}) && findings.length===0, language:simulationLanguage(), context:'simulation-center-full-exam-only', levels:rows, findings:findings, features:['3 Varianten je Level','sichtbare Variantenauswahl','Random-Modus','variantenspezifische Lese-/Hör-/Grammatikteile','variantenspezifisches Schreiben und Sprechen','Coach-Auswertung nach Abschluss','Varianten-Fingerprint-QA'], rule:'Sprachtest-Simulation ist Vollprüfung: Lesen, Hören, Grammatik, Schreiben und Sprechen. Teiltests bleiben Training.' };
  }

  function simulationCalibrationQaSnapshot(){
    var c=calibrationEngine(), findings=[], rows=[];
    if(!c||typeof c.auditLevel!=='function')return {phase:'G54.46.12',ok:false,findings:['Kalibrierungsengine fehlt.']};
    ['de','en'].forEach(function(lang){ levelList().forEach(function(level){ var audit=c.auditLevel(level,lang,fullExamVariantPool(level,lang),getBlueprint(level)); rows.push(audit); (audit.findings||[]).forEach(function(x){findings.push(x);}); }); });
    return {phase:'G54.46.12',version:VERSION,ok:findings.length===0,schema:c.schema,levels:rows,findings:findings,rule:'Interne Hardmode-Kalibrierung; kein offizieller Sprachtest und kein Zertifikat.'};
  }

  window.LanguageExamShell = Object.freeze({
    __version:VERSION,
    open:renderHome,
    openSimulation:renderSimulationLanguageChoice,
    openSimulationGerman:renderSimulationHomeGerman,
    openSimulationEnglish:renderSimulationHomeEnglish,
    start:start,
    resume:resume,
    summaryCardHtml:summaryCardHtml,
    diagnostics:diagnostics,
    simulationFullExamQaSnapshot:simulationFullExamQaSnapshot,
    simulationCalibrationQaSnapshot:simulationCalibrationQaSnapshot,
    simulationVariantUxQaSnapshot:simulationVariantUxQaSnapshot,
    openVariantSelection:renderVariantSelection,
    fullExamVariantPool:fullExamVariantPool,
    fullExamReadyForSimulation:fullExamReadyForSimulation,
    loadSession:loadSession,
    clearSession:clearSession,
    dashboardHtml:dashboardHtml,
    buildWeaknessProfile:buildWeaknessProfile,
    weaknessProfileHtml:weaknessProfileHtml,
    loadHistory:loadHistory,
    startTraining:startTraining,
    trainingModeBanner:trainingModeBanner,
    miniTrainingSetFor:miniTrainingSetFor,
    miniTrainingSetHtml:miniTrainingSetHtml,
    evaluateMiniTraining:evaluateMiniTraining,
    loadTrainingProgress:loadTrainingProgress,
    trainingProgressSummaryHtml:trainingProgressSummaryHtml
  });

  document.addEventListener('click', handleClick, true);
  document.addEventListener('change', bindInputs, true);
})();
