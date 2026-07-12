/* Eignungstest-Trainer · G35.0 User Center Step 1
   Benutzerbereich oben rechts bündeln: zentraler Login/Benutzer-Button mit SVG/Avatar,
   verstreute Startseiten-Profilflächen werden nicht mehr gerendert. */
(function(){
  'use strict';

  var VERSION = 'G54.46.2-TRUSTED-SESSION-GATE-2026-07-10';
  var SESSION_KEY = 'egt_auth_profile_session_v1';
  var DEMO_KEY = 'egt_auth_demo_state_v1';
  var DEMO_RESERVATION_KEY = 'egt_auth_demo_reservation_v1';
  var FIRST_SEEN_KEY = 'egt_auth_gate_seen_v1';
  var AVATAR_DB = 'egt_profile_avatar_cache_v1';
  var AVATAR_STORE = 'avatars';
  var AVATAR_META_KEY = 'egt_profile_avatar_meta_v1';
  var MAX_AVATAR_SIZE = 360;
  var AVATAR_QUALITY = 0.84;
  var DEMO_MAX_SIMULATIONS = 2;
  var DEMO_SIMULATION_MODES = { novuraExams:true, novuraExams:true, assessments:true, simulation:true };
  var PUBLIC_FEATURES = { auth:true, profile:true, login:true, settings:true, feedback:true, cache:true, dashboard:true };

  function $(id){ return document.getElementById(id); }
  function q(sel, root){ try { return (root || document).querySelector(sel); } catch(e){ return null; } }
  function qa(sel, root){ try { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); } catch(e){ return []; } }
  function esc(v){ return String(v == null ? '' : v).replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }
  function nowIso(){ return new Date().toISOString(); }
  function safeJson(raw, fallback){ try { return JSON.parse(raw || ''); } catch(e){ return fallback; } }

  function storageGet(key){ try { return localStorage.getItem(key); } catch(e){ return null; } }
  function storageSet(key, value){ try { localStorage.setItem(key, value); return true; } catch(e){ return false; } }
  function storageRemove(key){ try { localStorage.removeItem(key); return true; } catch(e){ return false; } }
  function legacySessionAllowed(){
    try{
      var sec=window.EGTSecurityContext;
      return !!(sec&&sec.legacyCodeLoginAllowed&&sec.legacyCodeLoginAllowed());
    }catch(e){ return false; }
  }
  function trustedRoleSession(session){
    var role=String(session&&session.role||'guest').toLowerCase().replace('dozent','teacher');
    if(role==='demo') return true;
    if(!(role==='admin'||role==='teacher'||role==='participant')) return false;
    try{
      var sec=window.EGTSecurityContext;
      if(!(sec&&sec.snapshot)) return false;
      var snap=sec.snapshot();
      var actual=String(snap.trustedRole||'guest').toLowerCase().replace('dozent','teacher');
      return snap.claimsTrusted===true && !!snap.user && !snap.user.isAnonymous && String(snap.user.uid||'')===String(session&&session.firebaseUid||'') && actual===role;
    }catch(e){ return false; }
  }
  function sanitizeSessionRole(session){
    if(!session) return session;
    var role=String(session.role||'guest').toLowerCase().replace('dozent','teacher');
    if(role==='demo' || trustedRoleSession(session) || legacySessionAllowed()) return session;
    if(role==='admin'||role==='teacher'||role==='participant') return Object.assign({},session,{role:'guest',trustedClaims:false,untrustedStoredRole:role});
    return session;
  }
  function notice(msg){ try { if(window.EGTUILayer && typeof window.EGTUILayer.notice === 'function'){ window.EGTUILayer.notice(msg); return; } } catch(e){} try { console.info('[Auth/Profile]', msg); } catch(e){} }
  function emit(name, detail){ try { window.dispatchEvent(new CustomEvent(name, { detail: detail || {} })); } catch(e){} }

  function userDb(){ return window.EGTUserDatabase || null; }
  function adminPortal(){ return window.EGTAdminPortal || null; }
  function syncState(){ try { return userDb() && typeof userDb().state === 'function' ? userDb().state() : {}; } catch(e){ return {}; } }
  function localSession(){ return safeJson(storageGet(SESSION_KEY), null); }
  function saveLocalSession(session){ try { storageSet(SESSION_KEY, JSON.stringify(session || {})); } catch(e){} emit('egt:auth-profile-updated', { session: session || null }); refreshUi(); }
  function clearLocalSession(){ try { storageRemove(SESSION_KEY); } catch(e){} emit('egt:auth-profile-updated', { session: null }); refreshUi(); }

  function activeProfile(){
    var db = userDb();
    try { if(db && db.activeProfile) return db.activeProfile; } catch(e){}
    var s = syncState();
    return s && s.profile ? s.profile : null;
  }
  function activeLearner(){
    var db = userDb();
    try { if(db && db.activeLearner) return db.activeLearner; } catch(e){}
    var s = syncState();
    return s && s.learner ? s.learner : null;
  }
  function displayNameFrom(profile, learner, session){
    return (profile && (profile.nickname || profile.displayName || profile.alias)) ||
           (learner && (learner.displayName || learner.alias || learner.nickname || learner.userId || learner.code)) ||
           (session && (session.nickname || session.displayName || session.code)) || '';
  }
  function currentSession(){
    // 1) Firebase-Auth-Session (EGTAuthEngine) hat höchste Priorität
    var engineSession = null;
    try {
      engineSession = safeJson(storageGet(SESSION_KEY), null);
      // Nur als Engine-Session akzeptieren wenn nickname vorhanden (nicht nur email)
      if(engineSession && engineSession.source === 'firebase-auth' && engineSession.nickname) {
        return sanitizeSessionRole(engineSession);
      }
    } catch(e){}

    // 2) EGTUserDatabase (bestehendes System)
    var db = userDb();
    try { if(db && typeof db.getSession === 'function'){ var remoteSession = db.getSession(); if(remoteSession) return sanitizeSessionRole(Object.assign({ source: remoteSession.provider || 'userdatabase' }, remoteSession)); } } catch(e){}

    // 3) Profil aus aktivem Learner/Profile-Objekt
    var profile = activeProfile();
    var learner = activeLearner();
    var local = localSession();
    if(profile || learner){
      return sanitizeSessionRole({
        source: syncState().provider || 'userdatabase',
        role: (profile && profile.role) || (local && local.role) || 'participant',
        groupId: (profile && (profile.groupId || profile.group_id)) || (local && local.groupId) || '',
        nickname: displayNameFrom(profile, learner, local),
        code: (learner && (learner.userId || learner.code)) || (profile && (profile.userId || profile.code || profile.accessCode)) || (local && local.code) || '',
        firebaseUid: (profile && profile.firebaseUid) || (local && local.firebaseUid) || '',
        trustedClaims: !!(local && local.trustedClaims),
        profileId: (profile && (profile.profileId || profile.id)) || (local && local.profileId) || '',
        profile: profile || null,
        learner: learner || null,
        updatedAt: nowIso()
      });
    }

    // 4) Lokale Session (Fallback) - aber niemals email als Anzeige
    if(local){
      if(!local.nickname && local.email) {
        local = Object.assign({}, local, { nickname: local.email.split('@')[0] });
      }
    }
    return sanitizeSessionRole(local);
  }
  function roleLabel(role){
    var map = { participant:'Teilnehmer', teacher:'Dozent', dozent:'Dozent', admin:'Admin', demo:'Demo', guest:'Gast' };
    return map[String(role || '').toLowerCase()] || 'Gast';
  }
  function providerLabel(){
    var st = syncState();
    if(st && st.provider === 'firebase-firestore') return st.online ? 'Firebase verbunden' : 'Firebase vorbereitet';
    return 'lokaler Cache';
  }
  var COACH_CONTEXT_CACHE_KEY = 'egt_userdatabase_coach_context_v1';

  function scoreFromAttempt(a){
    a = a || {};
    var v = Number(a.score != null ? a.score : (a.percent != null ? a.percent : 0));
    return isFinite(v) ? Math.max(0, Math.round(v)) : 0;
  }
  function dateFromAttempt(a){
    a = a || {};
    return String(a.createdAt || a.date || a.firebaseWrittenAt || a.updatedAt || '');
  }
  function profileModuleEntries(profile){
    var mods = profile && profile.modules || {};
    return Object.keys(mods).map(function(k){
      var m = mods[k] || {};
      var answered = Number(m.answered || m.total || 0) || 0;
      var correct = Number(m.correct || 0) || 0;
      var avg = Number(m.averageScore || m.percent || (answered ? Math.round((correct/Math.max(1,answered))*100) : 0)) || 0;
      var errors = m.recurringErrors || {};
      var errorCount = Object.keys(errors).reduce(function(sum,key){ return sum + (Number(errors[key]||0)||0); }, 0);
      return { key:k, answered:answered, correct:correct, averageScore:Math.round(avg), errors:errors, errorCount:errorCount };
    }).sort(function(a,b){ return (b.answered-a.answered) || (a.averageScore-b.averageScore); });
  }
  function summarizeCoachContext(ctx){
    ctx = ctx || {};
    var profile = ctx.profile || activeProfile() || (currentSession() && currentSession().profile) || {};
    var attempts = Array.isArray(ctx.attempts) ? ctx.attempts.slice() : (Array.isArray(profile.attempts) ? profile.attempts.slice() : []);
    attempts.sort(function(a,b){ return Date.parse(dateFromAttempt(a)||0) - Date.parse(dateFromAttempt(b)||0); });
    var modules = profileModuleEntries(profile);
    var totalTests = attempts.length || Number(profile && profile.global && profile.global.totalSessions || 0) || modules.reduce(function(s,m){ return s+(m.answered||0); },0);
    var scores = attempts.map(scoreFromAttempt).filter(function(v){ return isFinite(v) && v>0; });
    var avg = scores.length ? Math.round(scores.reduce(function(a,b){return a+b;},0)/scores.length) : Math.round(modules.reduce(function(s,m){return s+(m.averageScore||0);},0)/Math.max(1,modules.length));
    var best = scores.length ? Math.max.apply(null, scores) : modules.reduce(function(m,x){ return Math.max(m, x.averageScore||0); },0);
    var weak = modules.filter(function(m){ return m.answered>0; }).sort(function(a,b){ return (a.averageScore-b.averageScore) || (b.errorCount-a.errorCount); })[0] || null;
    var strong = modules.filter(function(m){ return m.answered>0; }).sort(function(a,b){ return (b.averageScore-a.averageScore) || (b.correct-a.correct); })[0] || null;
    var global = profile && profile.global || {};
    var recurring = global.recurringErrors || {};
    var topError = Object.keys(recurring).sort(function(a,b){ return Number(recurring[b]||0)-Number(recurring[a]||0); })[0] || (weak && Object.keys(weak.errors||{}).sort(function(a,b){ return Number((weak.errors||{})[b]||0)-Number((weak.errors||{})[a]||0); })[0]) || '';
    var last = attempts.length ? attempts[attempts.length-1] : null;
    var trend = scores.length>=2 ? (scores[scores.length-1] - scores[Math.max(0,scores.length-2)]) : 0;
    var recommendationTitle = weak ? ('Fokus: '+moduleLabel(weak.key)) : 'Datenbasis aufbauen';
    var recommendationText = weak ? ('Trainiere gezielt '+moduleLabel(weak.key)+'. Aktuell ca. '+(weak.averageScore||0)+'% bei '+(weak.answered||0)+' gespeicherten Signalen.') : 'Starte eine Simulation oder kurze Coach-Runde, damit ich echte Schwächen und Stärken erkenne.';
    if(topError) recommendationText += ' Wiederkehrendes Signal: '+topError+'.';
    return {
      provider: ctx.provider || providerLabel(), courseId:ctx.courseId||'', profile:profile||{}, attempts:attempts, modules:modules,
      totalTests:totalTests, averageScore:isFinite(avg)?avg:0, bestScore:isFinite(best)?best:0, riskLevel:(global.riskLevel || (ctx.coachDna && ctx.coachDna.profile && ctx.coachDna.profile.riskLevel) || 'offen'),
      weakModule:weak, strongModule:strong, topError:topError, lastAttempt:last, trend:trend,
      recommendation:{ title:recommendationTitle, text:recommendationText }, updatedAt:nowIso()
    };
  }
  function moduleLabel(key){
    var map={simulation:'Simulation',mathe:'Mathe',logik:'Logik',edv:'IT/EDV',konzentration:'Konzentration',python:'Python',global:'Gesamt'};
    return map[String(key||'').toLowerCase()] || String(key||'Gesamt');
  }
  function saveCoachContextCache(summary){ try { localStorage.setItem(COACH_CONTEXT_CACHE_KEY, JSON.stringify(summary || {})); } catch(e){} }
  function readCoachContextCache(){ return safeJson(storageGet(COACH_CONTEXT_CACHE_KEY), null); }
  async function loadPersonalCoachContext(){
    var session = currentSession();
    if(!session) return summarizeCoachContext({ provider:providerLabel(), profile:null, attempts:[] });
    var db = userDb();
    var ctx = null;
    try {
      if(db && typeof db.loadCoachContext === 'function') ctx = await db.loadCoachContext(session.code || session.profileId || session.nickname || '');
    } catch(e){ ctx = { provider:providerLabel(), profile:activeProfile() || session.profile || null, attempts:[], error:e && e.message || String(e) }; }
    var summary = summarizeCoachContext(ctx || { provider:providerLabel(), profile:activeProfile() || session.profile || null, attempts:[] });
    summary.session = { nickname:session.nickname || '', role:session.role || '', groupId:session.groupId || '', profileId:session.profileId || '', code:session.code || '' };
    saveCoachContextCache(summary);
    emit('egt:coach-context-updated', { summary:summary });
    return summary;
  }
  function coachPersonalizationSnapshot(){
    var cached = readCoachContextCache();
    if(cached && cached.updatedAt) return cached;
    return summarizeCoachContext({ provider:providerLabel(), profile:activeProfile() || (currentSession() && currentSession().profile) || null, attempts:[] });
  }
  function miniTrendSvg(attempts){
    attempts = Array.isArray(attempts) ? attempts.slice(-7) : [];
    var values = attempts.map(scoreFromAttempt).filter(function(v){ return isFinite(v); });
    if(values.length < 2) return '<div class="up-mini-chart up-mini-chart-empty">noch keine Kurve</div>';
    var min = Math.min.apply(null, values), max = Math.max.apply(null, values), span = Math.max(1, max-min);
    var pts = values.map(function(v,i){ var x = values.length===1 ? 50 : Math.round((i/(values.length-1))*100); var y = Math.round(82 - ((v-min)/span)*64); return x+','+y; }).join(' ');
    return '<svg class="up-mini-chart" viewBox="0 0 100 90" role="img" aria-label="Leistungsverlauf"><polyline points="'+pts+'" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"></polyline></svg>';
  }
  function performanceHtml(summary){
    summary = summary || coachPersonalizationSnapshot();
    var weak = summary.weakModule, strong = summary.strongModule;
    var lastText = summary.lastAttempt ? (moduleLabel(summary.lastAttempt.module || summary.lastAttempt.mode)+' · '+scoreFromAttempt(summary.lastAttempt)+'%') : 'noch kein Versuch';
    return '<div class="up-performance-panel">' +
      '<div class="up-performance-head"><div><span class="up-kicker">Deine Leistung</span><b>Persönliches Profil-Dashboard</b><small>'+esc(summary.provider || providerLabel())+'</small></div><button type="button" class="ui-btn" data-ui-action="profile-refresh-context">Aktualisieren</button></div>' +
      '<div class="up-performance-grid">' +
        '<div><b>'+esc(summary.totalTests || 0)+'</b><span>Tests/Signale</span></div>' +
        '<div><b>'+esc(summary.averageScore || 0)+'%</b><span>Ø Leistung</span></div>' +
        '<div><b>'+esc(summary.bestScore || 0)+'%</b><span>Bestwert</span></div>' +
        '<div><b>'+esc(summary.riskLevel || 'offen')+'</b><span>Coach-Status</span></div>' +
      '</div>' +
      '<div class="up-performance-chart">'+miniTrendSvg(summary.attempts)+'<div><b>Letzter Versuch</b><span>'+esc(lastText)+'</span><small>Trend: '+(Number(summary.trend||0)>=0?'+':'')+esc(summary.trend||0)+' Punkte</small></div></div>' +
      '<div class="up-performance-focus">' +
        '<div><b>Stärke</b><span>'+esc(strong ? moduleLabel(strong.key)+' · '+strong.averageScore+'%' : 'noch offen')+'</span></div>' +
        '<div><b>Fokus</b><span>'+esc(weak ? moduleLabel(weak.key)+' · '+weak.averageScore+'%' : 'Daten sammeln')+'</span></div>' +
      '</div>' +
      '<div class="up-coach-reco"><b>'+esc(summary.recommendation && summary.recommendation.title || 'Coach-Empfehlung')+'</b><span>'+esc(summary.recommendation && summary.recommendation.text || 'Starte eine Simulation, damit der Coach dich besser einschätzen kann.')+'</span></div>' +
    '</div>';
  }
  function hydrateProfileDashboard(){
    var box = q('[data-up-performance]');
    if(!box) return;
    box.innerHTML = performanceHtml(coachPersonalizationSnapshot());
    loadPersonalCoachContext().then(function(summary){ var el=q('[data-up-performance]'); if(el) el.innerHTML = performanceHtml(summary); }).catch(function(){ });
  }
  function normalizeNickname(v){ return String(v || '').trim().replace(/\s+/g, ' '); }
  function validateNickname(v){
    var name = normalizeNickname(v);
    if(name.length < 3) throw new Error('Nickname braucht mindestens 3 Zeichen.');
    if(name.length > 20) throw new Error('Nickname darf maximal 20 Zeichen haben.');
    if(!/[A-Za-zÀ-ž0-9]/.test(name)) throw new Error('Nickname braucht mindestens einen Buchstaben oder eine Zahl.');
    if(!/^[A-Za-zÀ-ž0-9 ._\-]+$/.test(name)) throw new Error('Nickname enthält nicht erlaubte Sonderzeichen.');
    if(/^\d+$/.test(name)) throw new Error('Nickname darf nicht nur aus Zahlen bestehen.');
    return name;
  }
  function needsNickname(session){
    if(!session) return false;
    if(String(session.role || '').toLowerCase() === 'demo') return false;
    var name = normalizeNickname(session.nickname || session.displayName || '');
    if(name.length < 3) return true;
    var code = normalizeNickname(session.code || '');
    if(code && name.toUpperCase() === code.toUpperCase()) return true;
    return false;
  }

  function normalizeRole(role){ return String(role || 'guest').toLowerCase().replace('dozent','teacher'); }
  function demoState(){
    var demo = safeJson(storageGet(DEMO_KEY), null) || {};
    demo.used = Math.max(0, Number(demo.used || 0) || 0);
    demo.max = Math.max(1, Number(demo.max || DEMO_MAX_SIMULATIONS) || DEMO_MAX_SIMULATIONS);
    demo.createdAt = demo.createdAt || nowIso();
    demo.runIds = Array.isArray(demo.runIds) ? demo.runIds.slice(-30) : [];
    return demo;
  }
  function saveDemoState(demo){
    demo = demo || demoState();
    demo.updatedAt = nowIso();
    try { localStorage.setItem(DEMO_KEY, JSON.stringify(demo)); } catch(e){}
    return demo;
  }
  function isDemoSession(session){ return normalizeRole(session && session.role) === 'demo'; }
  function isSimulationMode(mode){ return !!DEMO_SIMULATION_MODES[String(mode || '')]; }
  function demoRemaining(){ var d = demoState(); return Math.max(0, Number(d.max || DEMO_MAX_SIMULATIONS) - Number(d.used || 0)); }
  function readDemoReservation(){
    var r = safeJson(sessionStorage.getItem(DEMO_RESERVATION_KEY), null);
    if(!r || !r.id) return null;
    if(r.expiresAt && Date.parse(r.expiresAt) < Date.now()){
      try { sessionStorage.removeItem(DEMO_RESERVATION_KEY); } catch(e){}
      return null;
    }
    return r;
  }
  function saveDemoReservation(r){ try { if(r) sessionStorage.setItem(DEMO_RESERVATION_KEY, JSON.stringify(r)); else sessionStorage.removeItem(DEMO_RESERVATION_KEY); } catch(e){} }
  function clearDemoReservation(){ saveDemoReservation(null); }
  function hasStartedDemoReservation(){ var r = readDemoReservation(); return !!(r && r.status === 'started'); }
  function reserveDemoAttempt(reason){
    var d = demoState();
    var left = Math.max(0, Number(d.max || DEMO_MAX_SIMULATIONS) - Number(d.used || 0));
    if(left <= 0) return null;
    var id = 'demo-' + Date.now() + '-' + Math.random().toString(36).slice(2,8);
    d.used = Number(d.used || 0) + 1;
    d.runIds = Array.isArray(d.runIds) ? d.runIds.slice(-30) : [];
    d.runIds.push(id);
    d.lastReservedAt = nowIso();
    d.lastReservedReason = reason || 'demo-warning-open';
    saveDemoState(d);
    var reservation = { id:id, status:'reserved', reason:reason || 'demo-warning-open', createdAt:nowIso(), expiresAt:new Date(Date.now()+4*60*60*1000).toISOString() };
    saveDemoReservation(reservation);
    refreshUi();
    return reservation;
  }
  function markDemoReservationStarted(){
    var r = readDemoReservation();
    if(!r) return null;
    r.status = 'started';
    r.startedAt = nowIso();
    saveDemoReservation(r);
    return r;
  }
  function demoCounterHtml(){ var d = demoState(); return '<div class="up-demo-counter"><b>' + esc(Math.max(0, d.max - d.used)) + '</b><span>von ' + esc(d.max) + ' Demo-Simulationen übrig</span></div>'; }

  /* === G54.44.5 · Zentrale Aktions→Feature-Registry ================
     Ein Ort für die Zuordnung Aktion → Gate-Feature. Neue Module
     registrieren ihre Aktionen selbst, statt dass featureForAction
     hier still auf 'practice' zurückfällt (Ursache des Demo-Gate-Bugs
     in 44.3). Andere Module: EGTActionFeatureRegistry.register(...) */
  var ACTION_FEATURE_RULES = [
    { test: /^(auth|profile)-/,            feature: 'auth' },
    { exact: ['login','login-open-core'],  feature: 'auth' },
    { exact: ['settings','clear-cache','more-menu'], feature: 'settings' },
    { exact: ['feedback','feedback-open-core'],      feature: 'feedback' },
    { exact: ['start-training','auth-demo-simulation-start','simulation-center',
              'language-test-simulation-open','start-branch-simulation',
              'start-simulation-profile'],  feature: 'simulation' },
    { test: /^language-exam-/,             feature: 'simulation' },
    { exact: ['training-center','branch-training','branch-sheet','single-training',
              'start-training-mix'],        feature: 'practice' },
    { test: /^language-course-/,           feature: 'practice' },
    { exact: ['practice'],                 feature: 'practice' },
    { exact: ['learn'],                    feature: 'learn' },
    { exact: ['coach','coach-open-core'],  feature: 'coach' },
    { exact: ['analysis','analysis-open-core','progress'], feature: 'progress' },
    { exact: ['python-quest','python-quest-open-core'],    feature: 'python' },
    { exact: ['scan','scan-open-core'],    feature: 'scan' },
    { exact: ['backup','clear-progress'],  feature: 'data' }
  ];
  function lookupActionFeature(action){
    for(var i=0;i<ACTION_FEATURE_RULES.length;i++){
      var r = ACTION_FEATURE_RULES[i];
      if(r.exact && r.exact.indexOf(action) !== -1) return r.feature;
      if(r.test && r.test.test(action)) return r.feature;
    }
    return null;
  }
  try{
    window.EGTActionFeatureRegistry = {
      register: function(actionOrRegex, feature){
        if(!feature) return false;
        if(actionOrRegex instanceof RegExp) ACTION_FEATURE_RULES.unshift({ test:actionOrRegex, feature:String(feature) });
        else ACTION_FEATURE_RULES.unshift({ exact:[String(actionOrRegex)], feature:String(feature) });
        return true;
      },
      resolve: function(action){ return lookupActionFeature(String(action || '')); },
      list: function(){ return ACTION_FEATURE_RULES.slice(); }
    };
  }catch(e){}

  function featureForAction(action, el){
    action = String(action || '');
    var moduleId = el && el.getAttribute ? String(el.getAttribute('data-module') || '') : '';
    var tab = el && el.getAttribute ? String(el.getAttribute('data-tab') || '') : '';
    if(tab){
      if(tab === '0') return 'dashboard';
      if(tab === '1') return 'practice';
      if(tab === '2') return 'progress';
      if(tab === '3') return 'coach';
      if(tab === '4') return 'settings';
    }
    if(action === 'open-module' || action === 'area' || action === 'branch-menu'){
      if(moduleId === 'simulation') return 'simulation';
      if(moduleId === 'python_quest') return 'python';
      if(moduleId === 'coach_card') return 'coach';
      if(moduleId === 'analyse_card') return 'progress';
      return 'practice';
    }
    var resolved = lookupActionFeature(action);
    if(resolved) return resolved;
    return 'practice';
  }
  function accessDecision(feature, meta){
    feature = String(feature || 'practice');
    if(PUBLIC_FEATURES[feature]) return { ok:true, feature:feature, reason:'public' };
    var session = currentSession();
    if(!session){ return { ok:false, feature:feature, reason:'auth-required', title:'Zugang erforderlich', text:'Melde dich an, löse einen Zugangscode ein oder starte die Demo-Version.' }; }
    if(needsNickname(session) && feature !== 'profile' && feature !== 'auth'){
      return { ok:false, feature:feature, reason:'nickname-required', title:'Nickname erforderlich', text:'Lege zuerst deinen Nickname fest. Er wird für Highscore, Profil und Coach genutzt.' };
    }
    var role = normalizeRole(session.role);
    if(role === 'admin' || role === 'teacher' || role === 'participant') {
      if(trustedRoleSession(session) || legacySessionAllowed()) return { ok:true, feature:feature, reason:(trustedRoleSession(session)?'trusted-claims:':'development-legacy:')+role };
      return { ok:false, feature:feature, reason:'untrusted-role-session', title:'Sitzung nicht bestätigt', text:'Melde dich erneut mit deinem Firebase-Konto an. Rollen aus Browser-Speicher oder Profildaten werden nicht als Berechtigung akzeptiert.' };
    }
    if(role === 'demo') {
      if(feature === 'simulation') {
        if(hasStartedDemoReservation()) return { ok:true, feature:feature, reason:'demo-reserved-start', remaining:demoRemaining() };
        var left = demoRemaining();
        if(left > 0) return { ok:true, feature:feature, reason:'demo-simulation', remaining:left };
        return { ok:false, feature:feature, reason:'demo-limit', title:'Demo beendet', text:'Die 2 freien Simulationen sind verbraucht. Für den vollen Zugang brauchst du einen Zugangscode.' };
      }
      return { ok:false, feature:feature, reason:'demo-locked', title:'Demo-Version', text:'In der Demo-Version ist nur die Simulation freigeschaltet. Alle anderen Bereiche benötigen einen Zugangscode.' };
    }
    return { ok:false, feature:feature, reason:'unknown-role', title:'Zugang prüfen', text:'Diese Funktion ist für deine aktuelle Sitzung nicht freigeschaltet.' };
  }
  /* === G54.44.5 · Demo-Upsell nach letzter Demo-Simulation =========
     Wird nach Verbrauch der 2. Demo-Simulation EINMAL angezeigt —
     bewusst verzögert und erst nach der nächsten Nutzerinteraktion,
     damit der Endbericht der Simulation nicht überdeckt wird. */
  var DEMO_UPSELL_FLAG = 'egt_demo_upsell_pending_v1';
  function scheduleDemoUpsell(){
    try{ localStorage.setItem(DEMO_UPSELL_FLAG, nowIso()); }catch(e){}
    armDemoUpsell(0);
  }
  function armDemoUpsell(attempt){
    attempt = attempt || 0;
    if(attempt > 6) return;
    setTimeout(function(){
      var once = function(){
        document.removeEventListener('click', once, true);
        setTimeout(function(){ maybeShowDemoUpsell(attempt); }, 900);
      };
      document.addEventListener('click', once, true);
    }, attempt === 0 ? 2000 : 400);
  }
  function maybeShowDemoUpsell(attempt){
    var pending = null;
    try{ pending = localStorage.getItem(DEMO_UPSELL_FLAG); }catch(e){}
    if(!pending) return;
    var session = currentSession();
    if(!isDemoSession(session) || demoRemaining() > 0){
      try{ localStorage.removeItem(DEMO_UPSELL_FLAG); }catch(e){}
      return;
    }
    var examSheet = document.querySelector('.ui-sheet.ui-deep-sheet.show[data-ui-deep-sheet="language-exam-shell"], #uiSheet.show');
    if(examSheet){ armDemoUpsell((attempt||0)+1); return; }
    try{ localStorage.removeItem(DEMO_UPSELL_FLAG); }catch(e){}
    openDemoUpsell();
  }
  function openDemoUpsell(){
    var body = '<div class="up-required-note"><b>Beide Demo-Simulationen abgeschlossen 🎯</b>' +
      '<span>Deine Ergebnisse, Prognosen und der Lernfortschritt bleiben gespeichert und werden mit einem Zugangscode sofort wieder freigeschaltet — zusammen mit Training, Coach und Analyse.</span></div>' +
      demoCounterHtml() +
      '<div class="ui-deep-grid">' +
      card('auth-redeem-code','Zugangscode einlösen','Vollzugang sofort freischalten','▣') +
      card('feedback-open-core','Kaufinteresse / Fragen','Kontakt für Zugangscodes','✉') +
      card('profile-open','Profil öffnen','Sitzung und Status prüfen','👤') +
      '</div>';
    return openDeepSheet({ type:'demo-upsell', theme:'blue', title:'Weiter geht’s mit Vollzugang', kicker:'Demo abgeschlossen', subtitle:'Ergebnisse bleiben erhalten — Freischaltung übernimmt deinen Stand.', iconHtml:'🚀', bodyHtml:body });
  }

  function openFeatureLocked(decision){
    decision = decision || {};
    var session = currentSession();
    var body = '<div class="up-required-note"><b>' + esc(decision.title || 'Funktion gesperrt') + '</b><span>' + esc(decision.text || 'Diese Funktion ist aktuell nicht freigeschaltet.') + '</span></div>';
    if(isDemoSession(session)) body += demoCounterHtml();
    body += '<div class="ui-deep-grid">';
    if(!session) body += card('auth-login','Login','Mit bestehendem Zugang anmelden','🔐') + card('auth-redeem-code','Zugangscode einlösen','Rolle und Gruppe freischalten','▣') + card('auth-demo-start','Demo starten','2 Simulationen testen','▶');
    else if(decision.reason === 'nickname-required') body += card('profile-edit','Nickname festlegen','Profil vervollständigen','✎');
    else body += card('auth-redeem-code','Zugangscode einlösen','Vollversion freischalten','▣') + card('profile-open','Profil öffnen','Sitzung und Status prüfen','👤');
    if(isDemoSession(session) && demoRemaining() > 0) body += card('auth-demo-simulation-start','Simulation starten','Demo-Simulation öffnen','▶');
    body += '</div>';
    return openDeepSheet({ type:'feature-locked', theme:'blue', title:decision.title || 'Zugang erforderlich', kicker:'Rechte', subtitle:'Feature-Gate schützt Demo, Rollen und Profilzustand.', iconHtml:'🔒', bodyHtml:body });
  }
  function canAccess(feature, meta){ return accessDecision(feature, meta).ok; }
  function guardAction(action, el){
    var feature = featureForAction(action, el);
    var decision = accessDecision(feature, { action:action, element:el });
    if(decision.ok) return true;
    openFeatureLocked(decision);
    return false;
  }
  function canStartMode(mode){
    var feature = isSimulationMode(mode) ? 'simulation' : 'practice';
    var decision = accessDecision(feature, { mode:mode });
    if(decision.ok) return true;
    openFeatureLocked(decision);
    return false;
  }
  function openDemoSimulation(){
    var decision = accessDecision('simulation', { mode:'novuraExams', action:'auth-demo-simulation-start' });
    if(!decision.ok){ openFeatureLocked(decision); return true; }
    var before = demoRemaining();
    var reservation = reserveDemoAttempt('demo-warning-open');
    if(!reservation){ openFeatureLocked({ ok:false, reason:'demo-limit', title:'Demo beendet', text:'Die 2 freien Simulationen sind verbraucht. Für den vollen Zugang brauchst du einen Zugangscode.' }); return true; }
    var after = demoRemaining();
    var body = '' +
      '<div class="up-required-note up-danger-card"><b>Warnhinweis</b><span>Du hast die Demo-Simulation geöffnet. Dieser Versuch ist jetzt reserviert. Wenn du abbrichst oder das Fenster schließt, ist dieser Versuch trotzdem verbraucht.</span></div>' +
      '<div class="ui-deep-benefits">' +
        '<div class="ui-deep-benefit"><b>' + esc(before) + '</b><span>vor dem Öffnen</span></div>' +
        '<div class="ui-deep-benefit"><b>' + esc(after) + '</b><span>danach übrig</span></div>' +
        '<div class="ui-deep-benefit"><b>1</b><span>Versuch reserviert</span></div>' +
      '</div>' +
      '<div class="ui-deep-startbox">' +
        '<div><b>Vollwertige Simulation starten</b><span>Prüfungsnaher Lauf mit Zeitdruck. Nach dem Start geht es direkt in die Simulation.</span></div>' +
        '<button type="button" class="ui-deep-primary" data-ui-action="auth-demo-confirm-start">Simulation starten</button>' +
      '</div>' +
      '<div class="ui-deep-grid">' +
        card('auth-redeem-code','Zugangscode einlösen','Vollversion freischalten','▣') +
        card('auth-demo-cancel-reserved','Abbrechen','Versuch bleibt verbraucht','×','up-danger-card') +
      '</div>';
    return openDeepSheet({
      type:'demo-simulation-warning', theme:'blue', title:'Demo-Simulation', kicker:'Warnhinweis',
      subtitle:'Es bleiben nur noch ' + after + ' von ' + DEMO_MAX_SIMULATIONS + ' Demo-Versuchen.', iconHtml:'🔒', bodyHtml:body
    });
  }

  function startReservedDemoSimulation(){
    var r = markDemoReservationStarted();
    if(!r){ notice('Kein reservierter Demo-Versuch gefunden. Bitte Simulation erneut öffnen.'); return true; }
    closeSheet();
    window.setTimeout(function(){
      var started = false;
      try { if(window.App && typeof window.App.chooseTrainingMode === 'function') window.App.chooseTrainingMode('novuraExams'); } catch(e0){}
      try { if(window.App && typeof window.App.prepareTest === 'function'){ window.App.prepareTest(); started = true; } } catch(e1){ console.warn('Demo-Simulation Start', e1); }
      if(started) notice('Demo-Simulation gestartet. Der Versuch wurde verbraucht.');
      else notice('Simulation konnte nicht gestartet werden. Der Versuch bleibt verbraucht. Bitte App neu laden.');
    }, 80);
    return true;
  }

  function cancelReservedDemoSimulation(){
    closeSheet();
    notice('Abbruch: Der reservierte Demo-Versuch bleibt verbraucht.');
    return true;
  }

  function recordDemoSimulation(details){
    details = details || {};
    var session = currentSession();
    if(!isDemoSession(session) || !isSimulationMode(details.mode || details.selectedMode || '')) return { ok:false, reason:'not-demo-simulation' };
    var reserved = readDemoReservation();
    if(reserved && reserved.status === 'started'){
      var dReserved = demoState();
      dReserved.lastRunAt = nowIso();
      dReserved.lastCompletedReservation = reserved.id;
      saveDemoState(dReserved);
      clearDemoReservation();
      refreshUi();
      if(demoRemaining() <= 0) scheduleDemoUpsell();
      return { ok:true, remaining:demoRemaining(), state:dReserved, reserved:true };
    }
    var demo = demoState();
    var runId = String(details.runId || details.date || details.startedAt || details.createdAt || nowIso());
    if(demo.runIds.indexOf(runId) >= 0) return { ok:true, unchanged:true, used:demo.used, max:demo.max };
    if(demo.used >= demo.max) return { ok:false, reason:'demo-limit', used:demo.used, max:demo.max };
    demo.used += 1; demo.lastSimulationAt = nowIso(); demo.runIds.push(runId); demo.runIds = demo.runIds.slice(-30); saveDemoState(demo);
    session.demo = demo; session.updatedAt = nowIso(); saveLocalSession(session);
    if(demo.used >= demo.max){ notice('Demo-Limit erreicht. Für weitere Bereiche brauchst du einen Zugangscode.'); scheduleDemoUpsell(); }
    else notice('Demo-Simulation gezählt. Noch ' + (demo.max-demo.used) + ' übrig.');
    return { ok:true, used:demo.used, max:demo.max, remaining:Math.max(0, demo.max-demo.used) };
  }
  function highscoreIdentity(){
    var session = currentSession() || {};
    var nickname = normalizeNickname(session.nickname || session.displayName || '');
    var profileId = String(session.profileId || (session.profile && (session.profile.profileId || session.profile.id)) || session.code || '').trim();
    var groupId = String(session.groupId || (session.profile && (session.profile.groupId || session.profile.group_id)) || '').trim();
    return {
      nickname: nickname || '',
      playerName: nickname || '',
      profileId: profileId || '',
      userId: profileId || String(session.code || ''),
      groupId: groupId || '',
      role: normalizeRole(session.role),
      deviceId: profileId ? 'profile_' + profileId.replace(/[^A-Za-z0-9_.\-]/g,'_').slice(0,120) : ''
    };
  }

  function duelReadinessSnapshot(){
    var session = currentSession() || {};
    var summary = coachPersonalizationSnapshot() || {};
    var nickname = normalizeNickname(session.nickname || session.displayName || '');
    var profileId = String(session.profileId || (session.profile && (session.profile.profileId || session.profile.id)) || '').trim();
    var groupId = String(session.groupId || (session.profile && (session.profile.groupId || session.profile.group_id)) || '').trim();
    var role = normalizeRole(session.role);
    var ready = !!(nickname && profileId && groupId && role !== 'guest' && role !== 'demo');
    var missing = [];
    if(!nickname) missing.push('Nickname');
    if(!profileId) missing.push('Profil-ID');
    if(!groupId) missing.push('Gruppe');
    if(role === 'demo') missing.push('Vollzugang');
    if(role === 'guest') missing.push('Sitzung');
    return {
      ready: ready,
      role: role,
      nickname: nickname,
      profileId: profileId,
      groupId: groupId,
      totalTests: Number(summary.totalTests || 0) || 0,
      averageScore: Number(summary.averageScore || 0) || 0,
      bestScore: Number(summary.bestScore || 0) || 0,
      rankReady: !!profileId,
      missing: missing,
      note: ready ? 'Duellfähig vorbereitet. Es wird noch keine echte Anfrage verschickt.' : 'Für echte Duelle fehlen noch Voraussetzungen.'
    };
  }

  function syncStatusSnapshot(){
    var db = userDb();
    var st = syncState() || {};
    var extra = {};
    try { if(db && typeof db.syncStatus === 'function') extra = db.syncStatus() || {}; } catch(e){}
    return {
      provider: st.provider || extra.provider || providerLabel(),
      online: !!(st.online || extra.online),
      firebaseConfigured: !!(st.firebaseConfigured || extra.firebaseConfigured),
      courseId: st.courseId || extra.courseId || '',
      pending: Number(extra.pending || extra.pendingCount || 0) || 0,
      lastFlushAt: extra.lastFlushAt || '',
      error: st.error || extra.error || ''
    };
  }

  function openDuelPreparation(){
    var d = duelReadinessSnapshot();
    var body = '<div class="up-duel-panel">' +
      '<div class="up-duel-status ' + (d.ready ? 'is-ready' : 'is-warn') + '"><b>' + (d.ready ? 'Duell-Vorbereitung aktiv' : 'Noch nicht duellbereit') + '</b><span>' + esc(d.note) + '</span></div>' +
      '<div class="ui-deep-benefits">' +
        '<div class="ui-deep-benefit"><b>' + esc(d.nickname || '—') + '</b><span>Nickname</span></div>' +
        '<div class="ui-deep-benefit"><b>' + esc(d.groupId || '—') + '</b><span>Gruppe</span></div>' +
        '<div class="ui-deep-benefit"><b>' + esc(roleLabel(d.role)) + '</b><span>Rolle</span></div>' +
      '</div>' +
      '<div class="up-performance-focus">' +
        '<div><b>Später möglich</b><span>Platz 1 herausfordern, Spieler vor dir wählen, Duell annehmen.</span></div>' +
        '<div><b>Jetzt vorbereitet</b><span>Profil-ID, Nickname, Gruppe und Leistungswerte sind als Hooks vorhanden.</span></div>' +
      '</div>' +
      (d.missing.length ? '<div class="up-required-note"><b>Fehlt noch</b><span>' + esc(d.missing.join(', ')) + '</span></div>' : '') +
      '<div class="ui-deep-grid">' +
        card('profile-open','Profil prüfen','Profil, Gruppe und Leistung ansehen','👤') +
        card('profile-sync-status','Sync-Status','Firebase und lokale Warteschlange prüfen','☁') +
      '</div>' +
    '</div>';
    return openDeepSheet({ type:'duel-preparation', theme:'blue', title:'Duelle vorbereiten', kicker:'Demnächst', subtitle:'Vorbereitung ohne Fake-Duelle und ohne Datenbank-Schreibvorgang.', iconHtml:'⚔️', bodyHtml:body });
  }

  function openSyncStatus(){
    var st = syncStatusSnapshot();
    var body = '<div class="up-sync-panel">' +
      '<div class="up-duel-status ' + (st.online ? 'is-ready' : 'is-warn') + '"><b>' + (st.online ? 'Firebase verbunden' : 'Lokaler Cache aktiv') + '</b><span>' + esc(st.error || (st.online ? 'UserDatabase ist erreichbar.' : 'Änderungen bleiben lokal, bis Firebase wieder erreichbar ist.')) + '</span></div>' +
      '<div class="ui-deep-benefits">' +
        '<div class="ui-deep-benefit"><b>' + esc(st.provider || '—') + '</b><span>Provider</span></div>' +
        '<div class="ui-deep-benefit"><b>' + esc(st.pending || 0) + '</b><span>Warteschlange</span></div>' +
        '<div class="ui-deep-benefit"><b>' + esc(st.courseId || '—') + '</b><span>Kurs</span></div>' +
      '</div>' +
      '<div class="up-auth-note">Offline-Sync ist vorbereitet: lokale Coach-/Versuchsdaten werden zwischengespeichert und bei Firebase-Verbindung erneut übertragen.</div>' +
      '<div class="ui-deep-grid">' +
        card('profile-sync-flush','Sync jetzt versuchen','Warteschlange erneut an Firebase senden','↻') +
        card('profile-refresh-context','Coach-Kontext aktualisieren','Persönliche Daten neu lesen','✦') +
      '</div>' +
    '</div>';
    return openDeepSheet({ type:'profile-sync-status', theme:'blue', title:'Sync-Status', kicker:'UserDatabase', subtitle:'Firebase, lokaler Cache und Warteschlange prüfen.', iconHtml:'☁', bodyHtml:body });
  }

  async function flushProfileSync(){
    var db = userDb();
    if(!db || typeof db.flushPendingSync !== 'function'){ notice('Sync-Warteschlange ist noch nicht verfügbar.'); return true; }
    try {
      var res = await db.flushPendingSync();
      notice('Sync geprüft: ' + (res && res.flushed != null ? res.flushed + ' Einträge übertragen' : 'fertig'));
      setTimeout(openSyncStatus, 120);
    } catch(e){ notice('Sync nicht möglich: ' + (e.message || e)); }
    return true;
  }

  function avatarKeyFor(session){
    session = session || currentSession() || {};
    return String(session.profileId || (session.profile && (session.profile.profileId || session.profile.id)) || session.code || session.nickname || 'local-device').replace(/[^A-Za-z0-9_.\-]/g, '_').slice(0,80) || 'local-device';
  }
  function initialsFor(session){ return String((session && (session.nickname || session.displayName || session.code)) || 'U').trim().slice(0,1).toUpperCase() || 'U'; }

  function openAvatarDb(){
    return new Promise(function(resolve, reject){
      if(!('indexedDB' in window)) return reject(new Error('IndexedDB ist auf diesem Gerät nicht verfügbar.'));
      var req = indexedDB.open(AVATAR_DB, 1);
      req.onupgradeneeded = function(ev){ try { ev.target.result.createObjectStore(AVATAR_STORE); } catch(e){} };
      req.onsuccess = function(){ resolve(req.result); };
      req.onerror = function(){ reject(req.error || new Error('Avatar-Speicher konnte nicht geöffnet werden.')); };
    });
  }
  function avatarPut(key, value){
    return openAvatarDb().then(function(db){ return new Promise(function(resolve, reject){
      var tx = db.transaction(AVATAR_STORE, 'readwrite');
      tx.objectStore(AVATAR_STORE).put(value, key);
      tx.oncomplete = function(){ try { db.close(); } catch(e){} resolve(true); };
      tx.onerror = function(){ try { db.close(); } catch(e){} reject(tx.error || new Error('Avatar konnte nicht gespeichert werden.')); };
    }); });
  }
  function avatarGet(key){
    return openAvatarDb().then(function(db){ return new Promise(function(resolve, reject){
      var tx = db.transaction(AVATAR_STORE, 'readonly');
      var req = tx.objectStore(AVATAR_STORE).get(key);
      req.onsuccess = function(){ resolve(req.result || ''); };
      req.onerror = function(){ reject(req.error || new Error('Avatar konnte nicht gelesen werden.')); };
      tx.oncomplete = function(){ try { db.close(); } catch(e){} };
    }); }).catch(function(){
      var meta = safeJson(storageGet(AVATAR_META_KEY), {});
      return meta && meta[key] && meta[key].dataUrl ? meta[key].dataUrl : '';
    });
  }
  function saveAvatarMeta(key, session){
    try {
      var meta = safeJson(storageGet(AVATAR_META_KEY), {}) || {};
      meta[key] = { updatedAt: nowIso(), profileId: session && session.profileId || '', code: session && session.code || '', mode:'local' };
      localStorage.setItem(AVATAR_META_KEY, JSON.stringify(meta));
    } catch(e){}
  }
  function dataUrlFromFile(file){
    return new Promise(function(resolve, reject){
      if(!file || !/^image\//.test(file.type || '')) return reject(new Error('Bitte ein Bild aus der Galerie auswählen.'));
      var reader = new FileReader();
      reader.onload = function(){
        var img = new Image();
        img.onload = function(){
          try {
            var ratio = Math.min(1, MAX_AVATAR_SIZE / Math.max(img.width, img.height));
            var w = Math.max(1, Math.round(img.width * ratio));
            var h = Math.max(1, Math.round(img.height * ratio));
            var canvas = document.createElement('canvas'); canvas.width = w; canvas.height = h;
            var ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0, w, h);
            resolve(canvas.toDataURL('image/jpeg', AVATAR_QUALITY));
          } catch(e){ reject(e); }
        };
        img.onerror = function(){ reject(new Error('Bild konnte nicht gelesen werden.')); };
        img.src = String(reader.result || '');
      };
      reader.onerror = function(){ reject(reader.error || new Error('Bild konnte nicht geöffnet werden.')); };
      reader.readAsDataURL(file);
    });
  }
  function avatarHtml(session, cls){
    var key = avatarKeyFor(session);
    return '<div class="up-avatar-ring ' + esc(cls || '') + '" data-up-avatar-key="' + esc(key) + '" aria-hidden="true">' + esc(initialsFor(session)) + '</div>';
  }

  function avatarFileInputHtml(label){
    return '<input class="up-avatar-file" data-up-avatar-file="1" type="file" accept="image/*" aria-label="' + esc(label || 'Avatar aus Galerie wählen') + '">';
  }
  function avatarPickerCard(session, title, desc, icon){
    return '<label class="ui-deep-card up-avatar-upload" data-up-avatar-upload="1">' +
      '<span class="ui-deep-card-icon">' + esc(icon || '◎') + '</span>' +
      '<span class="ui-deep-card-copy"><b>' + esc(title || 'Avatar aus Galerie wählen') + '</b><small>' + esc(desc || 'Bild bleibt nur auf diesem Gerät gespeichert.') + '</small></span>' +
      '<span class="ui-deep-card-arrow" aria-hidden="true">›</span>' + avatarFileInputHtml(title || 'Avatar aus Galerie wählen') +
    '</label>';
  }
  function avatarHeroUpload(session, title, desc){
    return '<label class="up-profile-card up-avatar-hero-upload" data-up-avatar-upload="1">' +
      avatarHtml(session) +
      '<span class="up-profile-main"><b>' + esc(title || 'Profil bearbeiten') + '</b><span>' + esc(desc || 'Nickname und Avatar bearbeiten.') + '</span><small>Avatar antippen, um die Galerie zu öffnen.</small></span>' +
      '<span class="up-avatar-upload-pill">Avatar ändern</span>' + avatarFileInputHtml('Avatar ändern') +
    '</label>';
  }
  function hydrateAvatars(root){
    qa('[data-up-avatar-key]', root || document).forEach(function(el){
      var key = el.getAttribute('data-up-avatar-key') || '';
      if(!key || el.getAttribute('data-up-avatar-loaded') === '1') return;
      el.setAttribute('data-up-avatar-loaded', '1');
      avatarGet(key).then(function(dataUrl){ if(dataUrl){ el.innerHTML = '<img src="' + esc(dataUrl) + '" alt="">'; el.classList.add('has-avatar'); } }).catch(function(){});
    });
  }

  function card(action, title, desc, icon, extraClass){
    return '<button type="button" class="ui-deep-card ' + esc(extraClass || '') + '" data-ui-action="' + esc(action) + '">' +
      '<span class="ui-deep-card-icon">' + esc(icon || '›') + '</span>' +
      '<span class="ui-deep-card-copy"><b>' + esc(title || '') + '</b><small>' + esc(desc || '') + '</small></span>' +
      '<span class="ui-deep-card-arrow" aria-hidden="true">›</span>' +
    '</button>';
  }
  function openDeepSheet(opts){
    if(window.EGTUILayer && typeof window.EGTUILayer.openDeepSheet === 'function'){
      var ok = window.EGTUILayer.openDeepSheet(opts);
      setTimeout(function(){ hydrateAvatars(document); }, 80);
      return ok;
    }
    notice('Profilbereich noch nicht bereit. Bitte kurz neu laden.');
    return false;
  }
  function closeSheet(){ try { if(window.EGTUILayer && typeof window.EGTUILayer.closeSheet === 'function') window.EGTUILayer.closeSheet(); } catch(e){} }

  function authGateBody(){
    var session = currentSession();
    if(session){
      var warning = needsNickname(session) ? '<div class="up-required-note"><b>Nickname fehlt</b><span>Lege einen sichtbaren Nickname fest, bevor Profil, Highscore und Coach vollständig genutzt werden.</span></div>' : '';
      return '<div class="up-profile-mini">' + avatarHtml(session) +
          '<div><b>' + esc(session.nickname || 'Profil aktiv') + '</b><span>' + esc(roleLabel(session.role)) + (session.groupId ? ' · ' + esc(session.groupId) : '') + '</span></div>' +
        '</div>' + warning +
        '<div class="ui-deep-benefits">' +
          '<div class="ui-deep-benefit"><b>' + esc(roleLabel(session.role)) + '</b><span>Rolle</span></div>' +
          '<div class="ui-deep-benefit"><b>' + esc(session.groupId || '—') + '</b><span>Gruppe</span></div>' +
          '<div class="ui-deep-benefit"><b>' + esc(providerLabel()) + '</b><span>UserDatabase</span></div>' +
        '</div>' +
        '<div class="ui-deep-grid">' +
          card('profile-open','Profil öffnen','Nickname, Avatar, Rolle, Gruppe und Coach-Kontext ansehen','👤') +
          card('profile-edit','Profil bearbeiten','Nickname und Profilbasis speichern','✎') +
          avatarPickerCard(session,'Avatar ändern','Bild aus Galerie wählen, nur lokal auf diesem Gerät speichern','◎') +
          card('login-open-core','Admin/Teilnehmer-Portal','Bestehendes Admin-Portal öffnen','🔐') +
          card('profile-logout','Abmelden','Lokale Sitzung beenden','×','up-danger-card') +
        '</div>';
    }
    return '<div class="up-auth-hero">' +
        '<b>Starte mit deinem Zugang</b>' +
        '<span>Login, Zugangscode und Demo laufen über den Profil-Ast. Demo-Sperren aktiv: ohne Zugangscode bleiben nur 2 Simulationen frei.</span>' +
      '</div>' +
      '<div class="ui-deep-grid">' +
        card('auth-login','Login','Bestehenden Teilnehmer, Dozenten oder Admin anmelden','🔐') +
        card('auth-redeem-code','Zugangscode einlösen','Registrierung mit Rolle und Gruppe vorbereiten','▣') +
        card('auth-demo-start','Demo starten','2 Simulationen testen, danach Zugangscode erforderlich','▶') +
        card('login-open-core','Admin-Portal','Bestehendes lokales/Admin-Portal öffnen','⚙') +
      '</div>' +
      '<div class="up-auth-note">Firebase UserDatabase: ' + esc(providerLabel()) + '. Zugangscode-Prüfung und Codegenerator nutzen Firebase, sobald die Config eingetragen ist.</div>';
  }

  function openAuthGate(){
    var session = currentSession();
    return openDeepSheet({
      type:'auth-profile-gate', theme:'blue', title:'Benutzerbereich', kicker: session ? 'Benutzer' : 'Login',
      subtitle: session ? 'Profil, Avatar, Zugang und Abmeldung an einem Ort.' : 'Einloggen, Zugangscode einlösen oder Demo-Account starten.', iconHtml:'👤',
      bodyHtml: authGateBody()
    });
  }

  function openLogin(){
    var body = '<form class="up-auth-form" data-up-form="login">' +
      '<label><span>Teilnehmer-ID / Code</span><input class="ui-input" name="code" autocomplete="username" placeholder="z. B. 2026-GK-A001" required></label>' +
      '<label><span>Passwort</span><input class="ui-input" name="password" type="password" autocomplete="current-password" placeholder="Passwort" required></label>' +
      '<div class="up-form-state" data-up-state></div>' +
      '<button type="submit" class="ui-deep-primary">Einloggen</button>' +
    '</form>' +
    '<div class="up-auth-note">Nutzt aktuell die vorhandene Teilnehmer-/AdminPortal-Loginlogik. Firebase-Sync greift, sobald die Config korrekt eingetragen ist.</div>';
    return openDeepSheet({ type:'auth-login', theme:'blue', title:'Login', kicker:'UserDatabase', subtitle:'Melde dich mit deinem bestehenden Teilnehmercode an.', iconHtml:'🔐', bodyHtml:body });
  }

  function openRedeemCode(){
    var body = '<form class="up-auth-form" data-up-form="redeem">' +
      '<label><span>Zugangscode</span><input class="ui-input" name="code" autocomplete="one-time-code" placeholder="Code eingeben" required></label>' +
      '<label><span>Nickname Pflichtfeld</span><input class="ui-input" name="nickname" maxlength="20" placeholder="Name für Highscore" required></label>' +
      '<label><span>Passwort setzen</span><input class="ui-input" name="password" type="password" autocomplete="new-password" placeholder="mindestens 8 Zeichen"></label>' +
      '<div class="up-form-state" data-up-state>Nickname ist Pflicht und wird später im Highscore sichtbar. Ohne gültigen Firebase-Code werden keine Rechte vergeben.</div>' +
      '<button type="submit" class="ui-deep-primary">Code einlösen</button>' +
    '</form>' +
    '<div class="up-auth-note">Der Zugangscode erstellt bei gültigem Firebase-Code ein Profil mit Rolle, Gruppe und Nickname.</div>';
    return openDeepSheet({ type:'auth-redeem', theme:'blue', title:'Zugangscode einlösen', kicker:'Registrierung', subtitle:'Rolle und Gruppe werden über Firebase AccessCodes geprüft.', iconHtml:'▣', bodyHtml:body });
  }

  function startDemo(){
    var demo = demoState();
    demo.max = DEMO_MAX_SIMULATIONS;
    saveDemoState(demo);
    var session = { source:'local-demo', role:'demo', nickname:'Demo-Nutzer', groupId:'demo', demo:demo, updatedAt:nowIso() };
    saveLocalSession(session);
    notice('Demo gestartet: 2 Simulationen frei. Alle anderen Bereiche benötigen einen Zugangscode.');
    openProfile();
    return true;
  }

  function openNicknameRequired(){
    var session = currentSession() || { role:'participant', nickname:'' };
    var body = '<div class="up-required-note"><b>Nickname erforderlich</b><span>Der Nickname ist Pflicht, weil er später im Highscore, Profil und Coach-Kontext genutzt wird. Persönliche Daten bleiben freiwillig.</span></div>' +
      '<form class="up-auth-form" data-up-form="profile-edit">' +
        '<label><span>Nickname</span><input class="ui-input" name="nickname" maxlength="20" value="" placeholder="Name für Highscore" required autofocus></label>' +
        '<input type="hidden" name="groupId" value="' + esc(session.groupId || '') + '">' +
        '<div class="up-form-state" data-up-state>3–20 Zeichen. Sichtbar im Highscore.</div>' +
        '<button type="submit" class="ui-deep-primary">Nickname speichern</button>' +
      '</form>';
    return openDeepSheet({ type:'profile-nickname-required', theme:'blue', title:'Nickname festlegen', kicker:'Pflichtfeld', subtitle:'Erst danach ist dein Profil vollständig.', iconHtml:'✎', bodyHtml:body });
  }

  function openProfile(){
    var session = currentSession();
    if(!session) return openAuthGate();
    if(needsNickname(session)) return openNicknameRequired();
    var profile = session.profile || {};
    var body = '<div class="up-profile-card up-profile-card-hero">' +
        avatarHtml(session, 'up-avatar-lg') +
        '<div class="up-profile-main"><b>' + esc(session.nickname || 'Profil') + '</b><span>' + esc(roleLabel(session.role)) + (session.groupId ? ' · ' + esc(session.groupId) : '') + '</span><small>' + esc(providerLabel()) + '</small></div>' +
      '</div>' +
      '<div class="ui-deep-benefits">' +
        '<div class="ui-deep-benefit"><b>' + esc(session.code || '—') + '</b><span>Code</span></div>' +
        '<div class="ui-deep-benefit"><b>' + esc(roleLabel(session.role)) + '</b><span>Rolle</span></div>' +
        '<div class="ui-deep-benefit"><b>' + esc((coachPersonalizationSnapshot() && coachPersonalizationSnapshot().riskLevel) || (profile && profile.global && profile.global.riskLevel) || 'offen') + '</b><span>Coach-Status</span></div>' +
      '</div>' +
      '<div data-up-performance>' + performanceHtml(coachPersonalizationSnapshot()) + '</div>' +
      '<div class="ui-deep-grid">' +
        card('profile-edit','Profil bearbeiten','Nickname und Profilbasis speichern','✎') +
        card('profile-duel-ready','Duelle vorbereiten','Profil ist später für Simulation-Duelle nutzbar','⚔️') +
        card('profile-sync-status','Sync-Status','Firebase, Cache und Warteschlange prüfen','☁') +
        (isDemoSession(session) ? card('auth-demo-simulation-start','Demo-Simulation starten','Nur Simulation ist in der Demo freigeschaltet','▶') : '') +
        avatarPickerCard(session,'Avatar ändern','Galeriebild lokal auf diesem Gerät speichern','◎') +
        card('auth-redeem-code','Zugangscode wechseln','Anderen Code einlösen','▣') +
        card('login-open-core','Admin-Portal öffnen','Bestehende Verwaltung nutzen','⚙') +
        card('profile-logout','Abmelden','Sitzung auf diesem Gerät beenden','×','up-danger-card') +
      '</div>' +
      '<div class="up-auth-note">Avatar: Das Bild wird nur im Gerätecache gespeichert, nicht in Firebase hochgeladen. Nickname und Rolle werden für UserDatabase, Highscore und Coach-Kontext vorbereitet.</div>';
    var opened = openDeepSheet({ type:'profile', theme:'blue', title:'Benutzerprofil', kicker:'Profil', subtitle:'Profil-Dashboard, Firebase UserDatabase und persönlicher Coach-Kontext.', iconHtml:'👤', bodyHtml:body });
    setTimeout(hydrateProfileDashboard, 120);
    return opened;
  }

  function openProfileEdit(){
    var session = currentSession() || { role:'guest', nickname:'' };
    var body = avatarHeroUpload(session, 'Profil bearbeiten', 'Nickname ist Pflicht. Persönliche Daten bleiben freiwillig.') +
    '<form class="up-auth-form" data-up-form="profile-edit">' +
      '<label><span>Nickname Pflichtfeld</span><input class="ui-input" name="nickname" maxlength="20" value="' + esc(needsNickname(session) ? '' : (session.nickname || '')) + '" placeholder="Name für Highscore" required></label>' +
      '<label><span>Gruppe</span><input class="ui-input" name="groupId" maxlength="40" value="' + esc(session.groupId || '') + '" placeholder="wird per Code gesetzt"></label>' +
      '<div class="up-form-state" data-up-state>3–20 Zeichen. Nickname wird später im Highscore sichtbar. Avatar bleibt lokal.</div>' +
      '<button type="submit" class="ui-deep-primary">Profil speichern</button>' +
    '</form>' +
    '<div class="ui-deep-grid up-avatar-actions">' + avatarPickerCard(session,'Avatar aus Galerie wählen','Kein Datenbank-Upload, nur Gerätecache','◎') + '</div>';
    return openDeepSheet({ type:'profile-edit', theme:'blue', title:'Profil bearbeiten', kicker:'Profil', subtitle:'Nickname festlegen und Avatar lokal vorbereiten.', iconHtml:'✎', bodyHtml:body });
  }

  function processAvatarFile(file, sessionOverride, stateEl){
    var session = sessionOverride || currentSession();
    if(!session){ openAuthGate(); return Promise.resolve(false); }
    if(needsNickname(session)){ openNicknameRequired(); return Promise.resolve(false); }
    if(!file) return Promise.resolve(false);
    var key = avatarKeyFor(session);
    if(stateEl) stateEl.textContent = 'Avatar wird lokal vorbereitet…';
    notice('Avatar wird lokal vorbereitet…');
    return dataUrlFromFile(file).then(function(dataUrl){
      return avatarPut(key, dataUrl).catch(function(){
        var meta = safeJson(storageGet(AVATAR_META_KEY), {}) || {};
        meta[key] = { dataUrl:dataUrl, updatedAt:nowIso(), mode:'local' };
        localStorage.setItem(AVATAR_META_KEY, JSON.stringify(meta));
        return true;
      }).then(function(){ return dataUrl; });
    }).then(async function(){
      saveAvatarMeta(key, session);
      var local = currentSession() || session;
      local.avatarMode = 'local'; local.avatarUpdatedAt = nowIso(); saveLocalSession(local);
      try {
        var db = userDb(); var profile = activeProfile();
        if(db && typeof db.updateProfile === 'function' && profile){
          await db.updateProfile(Object.assign({}, profile, { avatarMode:'local', avatarUpdatedAt:nowIso(), updatedAt:nowIso() }), true);
        }
      } catch(e){}
      if(stateEl) stateEl.textContent = 'Avatar gespeichert. Das Bild bleibt nur auf diesem Gerät.';
      notice('Avatar gespeichert. Das Bild bleibt nur auf diesem Gerät.');
      setTimeout(openProfile, 160);
      return true;
    }).catch(function(e){
      var msg = 'Avatar-Fehler: ' + (e && e.message ? e.message : e);
      if(stateEl) stateEl.textContent = msg;
      notice(msg);
      return false;
    });
  }

  function openAvatarPicker(){
    var session = currentSession();
    if(!session) return openAuthGate();
    if(needsNickname(session)) return openNicknameRequired();
    var body = '<div class="up-profile-card up-profile-card-hero">' + avatarHtml(session, 'up-avatar-lg') +
      '<div class="up-profile-main"><b>Avatar ändern</b><span>Wähle ein Bild aus deiner Galerie.</span><small>Kein Upload zu Firebase. Das Bild bleibt nur auf diesem Gerät.</small></div></div>' +
      '<div class="ui-deep-grid">' + avatarPickerCard(session, 'Galerie öffnen', 'Bild auswählen und lokal im Gerätecache speichern', '◎') + '</div>' +
      '<div class="up-form-state" data-up-avatar-state>Bereit. Tippe auf „Galerie öffnen“.</div>';
    return openDeepSheet({ type:'profile-avatar', theme:'blue', title:'Avatar ändern', kicker:'Profilbild', subtitle:'Lokaler Geräteavatar ohne Datenbank-Upload.', iconHtml:'◎', bodyHtml:body });
  }

  function onAvatarChange(ev){
    var input = ev.target && ev.target.matches && ev.target.matches('[data-up-avatar-file="1"]') ? ev.target : null;
    if(!input) return;
    var file = input.files && input.files[0];
    var stateEl = q('[data-up-avatar-state]', input.closest('.ui-sheet') || document) || q('[data-up-state]', input.closest('.ui-sheet') || document);
    try { input.value = ''; } catch(e){}
    if(!file){ if(stateEl) stateEl.textContent = 'Keine Datei ausgewählt.'; return; }
    processAvatarFile(file, currentSession(), stateEl);
  }

  function logout(){
    try { if(adminPortal() && typeof adminPortal().logout === 'function') adminPortal().logout(); } catch(e){}
    clearLocalSession();
    notice('Abgemeldet.');
    openAuthGate();
    return true;
  }

  function renderSlot(){
    var slot = $('upAuthGateSlot');
    if(!slot){ updateTopLogin(); return false; }
    // G35.0 Step 1: Dashboard/Auth-Kachel wurde bewusst entfernt.
    // Falls ältere HTML-Reste den Slot noch enthalten, bleibt er leer.
    slot.innerHTML = '';
    slot.hidden = true;
    updateTopLogin();
    return true;
  }

  function userIconSvg(){
    return '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M20 21a8 8 0 0 0-16 0"/><circle cx="12" cy="7" r="4"/></svg>';
  }

  function updateTopLogin(){
    var btn = $('uiLoginBtn');
    if(!btn) return;
    var session = currentSession();
    var isActive = !!session;
    btn.setAttribute('data-ui-action', isActive ? 'profile-open' : 'auth-open');
    btn.setAttribute('aria-label', isActive ? 'Profil öffnen' : 'Login / Registrierung');
    btn.classList.toggle('is-user-active', isActive);
    var key = session ? avatarKeyFor(session) : '';
    if(isActive){
      var nick = esc(session.nickname || session.displayName || session.alias || 'Profil');
      var role = session.role ? roleLabel(session.role) : '';
      // Rolle als farbiger Punkt + kurzes Label, sauber neben Nickname
      var roleBadgeColor = {'Admin':'#f87171','Dozent':'#7dd3fc','Teilnehmer':'#86efac','Demo':'#fbbf24','Gast':'#94a3b8'}[role] || '#94a3b8';
      var roleDot = '<span style="display:inline-block;width:7px;height:7px;border-radius:50%;background:'+roleBadgeColor+';margin-left:6px;vertical-align:middle;flex-shrink:0;"></span>';
      btn.innerHTML =
        '<span class="ui-login-avatar" data-ui-login-avatar="1"' + (key ? ' data-up-avatar-key="' + esc(key) + '"' : '') + '>' + userIconSvg() + '</span>' +
        '<span style="display:flex;flex-direction:column;align-items:flex-start;gap:1px;min-width:0;max-width:120px;">'+
          '<span style="font-size:.85rem;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%;line-height:1.2;">' + nick + '</span>'+
          '<span style="font-size:.65rem;color:'+roleBadgeColor+';font-weight:600;white-space:nowrap;line-height:1;">'+esc(role)+'</span>'+
        '</span>';
    } else {
      btn.innerHTML = '<span class="ui-login-avatar" data-ui-login-avatar="1">' + userIconSvg() + '</span><span class="ui-login-label">Login</span>';
    }
    if(key){ setTimeout(function(){ hydrateAvatars(btn); }, 40); }
  }

  function refreshUi(){ renderSlot(); updateTopLogin(); setTimeout(function(){ hydrateAvatars(document); }, 80); }
  try { window.updateLoginBtnState = updateTopLogin; } catch(e){}

  async function handleLoginSubmit(form){
    var stateEl = q('[data-up-state]', form);
    var code = String((form.elements.code && form.elements.code.value) || '').trim();
    var pass = String((form.elements.password && form.elements.password.value) || '');
    try{
      if(!code || !pass) throw new Error('Bitte Code und Passwort eingeben.');
      if(stateEl) stateEl.textContent = 'Prüfe Zugang…';
      if(!adminPortal() || typeof adminPortal().loginWithCode !== 'function') throw new Error('Login-Service ist noch nicht bereit.');
      var profile = await adminPortal().loginWithCode(code, pass);
      var nickname = displayNameFrom(profile, null, null) || code;
      var session = {
        source:'userdatabase', role:(profile && profile.role) || 'participant', groupId:(profile && (profile.groupId || profile.group_id)) || '',
        nickname:nickname, code:code, profileId:(profile && (profile.profileId || profile.id)) || '', updatedAt:nowIso()
      };
      saveLocalSession(session);
      if(stateEl) stateEl.textContent = 'Login erfolgreich.';
      notice('Angemeldet: ' + (session.nickname || code));
      setTimeout(function(){ needsNickname(session) ? openNicknameRequired() : openProfile(); }, 180);
    } catch(e){ if(stateEl) stateEl.textContent = 'Fehler: ' + (e.message || e); }
  }

  async function handleRedeemSubmit(form){
    var stateEl = q('[data-up-state]', form);
    var code = String((form.elements.code && form.elements.code.value) || '').trim();
    var nicknameRaw = String((form.elements.nickname && form.elements.nickname.value) || '').trim();
    var password = String((form.elements.password && form.elements.password.value) || '');
    try{
      if(!code) throw new Error('Bitte Zugangscode eingeben.');
      var nickname = validateNickname(nicknameRaw);
      if(password && password.length < 8) throw new Error('Das Passwort braucht mindestens 8 Zeichen.');
      var db = userDb();
      if(!db || typeof db.redeemAccessCode !== 'function') throw new Error('Firebase UserDatabase ist noch nicht bereit. Bitte Seite neu laden.');
      if(stateEl) stateEl.textContent = 'Prüfe Zugangscode in der UserDatabase…';
      var result = await db.redeemAccessCode({ code:code, nickname:nickname, password:password });
      var profile = result && result.profile || {};
      var session = { source:result.provider || 'firebase-firestore', role:profile.role || result.role || 'participant', groupId:profile.groupId || result.groupId || '', nickname:profile.nickname || profile.displayName || nickname, code:profile.code || code, profileId:profile.profileId || profile.id || '', avatarMode:'local', updatedAt:nowIso() };
      saveLocalSession(session);
      if(stateEl) stateEl.textContent = 'Zugangscode eingelöst. Profil wurde angelegt.';
      notice('Zugang freigeschaltet: ' + roleLabel(session.role));
      setTimeout(openProfile, 220);
    } catch(e){ if(stateEl) stateEl.textContent = 'Fehler: ' + (e.message || e); }
  }

  async function handleProfileEditSubmit(form){
    var stateEl = q('[data-up-state]', form);
    var nicknameRaw = String((form.elements.nickname && form.elements.nickname.value) || '').trim();
    var groupId = String((form.elements.groupId && form.elements.groupId.value) || '').trim();
    try{
      var nickname = validateNickname(nicknameRaw);
      var session = currentSession() || { role:'participant' };
      session.nickname = nickname;
      session.displayName = nickname;
      session.groupId = groupId || session.groupId || '';
      session.updatedAt = nowIso();
      saveLocalSession(session);
      var profile = activeProfile();
      if(profile && userDb() && typeof userDb().updateProfile === 'function'){
        var next = Object.assign({}, profile, { nickname:nickname, displayName:nickname, alias:nickname, groupId:session.groupId, avatarMode:profile.avatarMode || 'local', updatedAt:nowIso() });
        try { await userDb().updateProfile(next, true); } catch(e2){}
      }
      if(stateEl) stateEl.textContent = 'Profil gespeichert.';
      notice('Profil gespeichert.');
      setTimeout(openProfile, 180);
    } catch(e){ if(stateEl) stateEl.textContent = 'Fehler: ' + (e.message || e); }
  }

  function handleAction(action){
    if(action === 'auth-open') return openAuthGate();
    if(action === 'auth-login') return openLogin();
    if(action === 'auth-register' || action === 'auth-redeem-code') return openRedeemCode();
    if(action === 'auth-demo-start') return startDemo();
    if(action === 'auth-demo-simulation-start') return openDemoSimulation();
    if(action === 'auth-demo-confirm-start') return startReservedDemoSimulation();
    if(action === 'auth-demo-cancel-reserved') return cancelReservedDemoSimulation();
    if(action === 'profile-open') return openProfile();
    if(action === 'profile-edit') return openProfileEdit();
    if(action === 'profile-avatar') return openAvatarPicker();
    if(action === 'profile-refresh-context') { hydrateProfileDashboard(); notice('Coach-Kontext wird aktualisiert…'); return true; }
    if(action === 'profile-duel-ready') return openDuelPreparation();
    if(action === 'profile-sync-status') return openSyncStatus();
    if(action === 'profile-sync-flush') return flushProfileSync();
    if(action === 'profile-logout') return logout();
    return false;
  }

  function onSubmit(ev){
    var form = ev.target && ev.target.closest ? ev.target.closest('[data-up-form]') : null;
    if(!form) return;
    ev.preventDefault();
    var kind = form.getAttribute('data-up-form');
    if(kind === 'login') handleLoginSubmit(form);
    else if(kind === 'redeem') handleRedeemSubmit(form);
    else if(kind === 'profile-edit') handleProfileEditSubmit(form);
  }

  function boot(){
    try { if(userDb() && typeof userDb().init === 'function') userDb().init().then(refreshUi).catch(function(){}); } catch(e){}
    document.addEventListener('submit', onSubmit, true);
    document.addEventListener('change', onAvatarChange, true);
    ['egt:learner-login','egt:learner-logout','egt:learner-profile-updated','egt:auth-profile-updated','egt:access-code-redeemed'].forEach(function(name){ window.addEventListener(name, refreshUi); });
    try{ if(localStorage.getItem(DEMO_UPSELL_FLAG)) armDemoUpsell(1); }catch(e){}
    var tries = 0;
    (function waitForShell(){
      tries++;
      if(renderSlot()){
        try { if(!storageGet(FIRST_SEEN_KEY)){ storageSet(FIRST_SEEN_KEY, nowIso()); } } catch(e){}
        return;
      }
      if(tries < 40) setTimeout(waitForShell, 100);
    })();
  }

  window.EGTAuthProfileShell = {
    version: VERSION,
    currentSession: currentSession,
    refresh: refreshUi,
    updateTopLogin: updateTopLogin,
    openAuthGate: openAuthGate,
    openLogin: openLogin,
    openRedeemCode: openRedeemCode,
    openProfile: openProfile,
    openProfileEdit: openProfileEdit,
    openAvatarPicker: openAvatarPicker,
    startDemo: startDemo,
    canAccess: canAccess,
    guardAction: guardAction,
    canStartMode: canStartMode,
    recordDemoSimulation: recordDemoSimulation,
    startReservedDemoSimulation: startReservedDemoSimulation,
    highscoreIdentity: highscoreIdentity,
    loadPersonalCoachContext: loadPersonalCoachContext,
    coachPersonalizationSnapshot: coachPersonalizationSnapshot,
    profilePerformanceSnapshot: coachPersonalizationSnapshot,
    duelReadinessSnapshot: duelReadinessSnapshot,
    openDuelPreparation: openDuelPreparation,
    syncStatusSnapshot: syncStatusSnapshot,
    openSyncStatus: openSyncStatus,
    logout: logout,
    handleAction: handleAction
  };

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
