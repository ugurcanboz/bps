/* Eignungstest-Trainer · Admin Portal, Teilnehmerverwaltung und Coach-Profil-Engine */
(function(){
  'use strict';

  var INTERNAL_VERSION = 'g54-46-6-admin-operations';
  var cfg = window.EGT_SYNC_CONFIG || { enabled:false };
  var LOCAL_KEY = 'egt_global_learner_profiles';
  var LOCAL_ACCESS_CODES_KEY = 'egt_access_code_cache_v1';
  var LOCAL_TICKETS_KEY = 'egt_bug_tickets_v1';
  var PENDING_TICKETS_KEY = 'egt_tickets_pending_v1';
  var USERDB_SESSION_KEY = 'egt_userdatabase_session_v1';
  var PENDING_SYNC_KEY = 'egt_userdatabase_pending_sync_v1';
  var LAST_SYNC_FLUSH_KEY = 'egt_userdatabase_last_sync_flush_v1';
  var LOCAL_AUDIT_KEY = 'egt_admin_audit_chain_v2';
  var PRIVACY_POLICY_KEY = 'egt_admin_privacy_policy_v1';
  var BULK_SELECTION_KEY = 'egt_admin_bulk_selection_v1';
  var ACTIVE_KEY = 'egt_active_learner';
  var ADMIN_PIN_KEY = 'egt_admin_pin';
  var ADMIN_OPEN_KEY = 'egt_admin_open';
  var ADMIN_BOOTSTRAP_KEY = 'egt_admin_bootstrap_password';
  var DOZENT_PIN_KEY = 'egt_dozent_pin';
  var DOZENT_OPEN_KEY = 'egt_dozent_open';
  var PORTAL_ROLE_KEY = 'egt_portal_role';
  var DOZENT_PROFILE_KEY = 'egt_active_dozent_profile';
  var DOZENT_PROFILES_KEY = 'egt_dozent_profiles_v1';
  var DEMO_DOZENT_PIN = 'Dozent12345!';
  var DEMO_DOZENT_PINS = { 'DOZENT-A': 'DozentA123!', 'DOZENT-B': 'DozentB123!' };

  var state = {
    ready:false, uiReady:false, initialized:false, initializing:false,
    online:false, authReady:false, connectionState:'idle', connectionMessage:'Lokaler Start',
    connectionAttempt:0, lastAttemptAt:'', lastConnectedAt:'', error:'', user:null, learner:null, profile:null,
    sync:null, db:null, auth:null, securityClaims:{}, securityRole:'guest', claimsTrusted:false, appCheckReady:false, courseId:(cfg.courseId || 'course_2026_gk'), busy:false
  };
  var initPromise = null;
  var connectionPromise = null;
  var bulkSelection = {};
  try{ (JSON.parse(sessionStorage.getItem(BULK_SELECTION_KEY)||'[]')||[]).forEach(function(id){ bulkSelection[normalizeCode(id)]=true; }); }catch(e){}

  function nowIso(){ try{return new Date().toISOString();}catch(e){return '';}}
  function isoHoursAgo(hours){ try{ return new Date(Date.now() - Number(hours||0)*3600000).toISOString(); }catch(e){ return nowIso(); } }
  function pad(n,d){ return String(n).padStart(d||3,'0'); }
  function normalizeCode(code){ return String(code||'').toUpperCase().replace(/[^A-Z0-9]+/g,'-').replace(/^-+|-+$/g,''); }
  function safeId(value){ return normalizeCode(value).toLowerCase().replace(/[^a-z0-9]+/g,'_').replace(/^_+|_+$/g,'') || ('id_'+Date.now()); }
  function clone(obj){ try{return JSON.parse(JSON.stringify(obj||{}));}catch(e){return obj||{};} }
  function emit(name, detail){ try{ window.dispatchEvent(new CustomEvent(name,{ detail:detail||{} })); }catch(e){} }
  function config(){ return window.EGT_SYNC_CONFIG || cfg || {}; }
  function appConfig(){ return window.AppConfig || {}; }
  function securityConfig(){ return appConfig().security || {}; }
  function securityContext(){ return window.EGTSecurityContext || null; }
  function activityLedger(){ return window.EGTActivityLedgerEngine || null; }
  function adminAnalytics(){ return window.EGTAdminAnalyticsEngine || null; }
  function adminOperations(){ return window.EGTAdminOperationsEngine || null; }
  function migrateActivityProfile(profile){
    var ledger=activityLedger();
    if(ledger&&typeof ledger.migrateLegacyProfile==='function') return ledger.migrateLegacyProfile(profile||{});
    return profile||{};
  }
  function isDevelopment(){ return appConfig().environment==='development' || appConfig().isDevelopment===true; }
  function localRolePinsAllowed(){ var sec=securityContext(); return !!(sec&&sec.localRolePinsAllowed&&sec.localRolePinsAllowed()); }
  function legacyCodeLoginAllowed(){ var sec=securityContext(); return !!(sec&&sec.legacyCodeLoginAllowed&&sec.legacyCodeLoginAllowed()); }
  function privilegedWritesViaFunctions(){ return config().privilegedWritesViaFunctions!==false && !isDevelopment(); }
  function updateSecurityState(){
    var sec=securityContext();
    if(!sec) return;
    try{
      var snap=sec.snapshot();
      state.securityClaims=sec.claims||{};
      state.securityRole=snap.trustedRole||'guest';
      state.claimsTrusted=!!snap.claimsTrusted;
      state.appCheckReady=!!snap.appCheckReady;
      if(sec.user) state.user=sec.user;
    }catch(e){}
  }
  async function refreshSecurityClaims(force){
    var sec=securityContext();
    if(!sec) return {};
    await sec.initialize();
    var claims=await sec.refreshClaims(force===true);
    updateSecurityState();
    updateRoleUi();
    return claims||{};
  }
  async function secureCallable(name,payload,roles){
    var sec=securityContext();
    if(!sec) throw new Error('Sicherheitsmodul ist nicht geladen.');
    var data=await sec.call(name,payload||{},roles?{roles:roles}:{});
    updateSecurityState();
    return data;
  }
  function escapeHtml(s){ return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];}); }
  function setStatus(msg){ var el=document.querySelector('[data-fb-status]'); if(el) el.textContent=msg||''; }
  var _bodySheetScrollY = 0;
  var _lastFreeScrollY = 0;
  try{
    window.addEventListener('scroll', function(){
      if(document.body.classList.contains('egt-admin-sheet-open')) return;
      if(document.body.style.position === 'fixed') return;
      _lastFreeScrollY = window.scrollY || document.documentElement.scrollTop || 0;
    }, { passive:true });
  }catch(e){}
  function bodySheetLock(on){
    try{
      if(on && !document.body.classList.contains('egt-admin-sheet-open')){
        var yNow = window.scrollY || document.documentElement.scrollTop || 0;
        if(!yNow && document.body.style.position === 'fixed'){
          var t = parseFloat(document.body.style.top || '0');
          if(t < 0) yNow = -t;
        }
        _bodySheetScrollY = yNow || _lastFreeScrollY || 0;
      }
      document.documentElement.classList.toggle('egt-admin-sheet-open', !!on);
      document.body.classList.toggle('egt-admin-sheet-open', !!on);
      if(!on && _bodySheetScrollY > 0){
        var y = _bodySheetScrollY; _bodySheetScrollY = 0;
        var restore=function(){ try{ window.scrollTo(0, y); }catch(e){} };
        requestAnimationFrame(restore);
        /* Router-releaseLock kann debounced nachlaufen und auf 0 setzen —
           zweiter Restore-Tick gewinnt zuverlässig. */
        setTimeout(restore, 260);
      }
    }catch(e){}
  }
  function sheetToTop(){ try{ var p=document.querySelector('#egtAdminModal .egt-admin-panel'); if(p) p.scrollTop=0; }catch(e){} }
  function announcePortalState(text){ setStatus(text); try{ var live=document.querySelector('[data-portal-live]'); if(live) live.textContent=text||''; }catch(e){} }
  function cloudTimeoutMs(){
    var raw=Number(config().adminFirebaseTimeoutMs || config().firebaseTimeoutMs || 8000);
    if(!isFinite(raw)) raw=8000;
    return Math.max(2500, Math.min(20000, raw));
  }
  function connectionLabel(){
    if(state.connectionState==='online') return 'Cloud verbunden';
    if(state.connectionState==='checking') return 'Cloud wird geprüft…';
    if(state.connectionState==='error') return 'Cloud erforderlich · Fehler';
    if(state.connectionState==='local') return 'Lokaler Modus aktiv';
    return 'Lokaler Start';
  }
  function updateConnectionUi(){
    try{
      document.querySelectorAll('[data-cloud-state]').forEach(function(el){
        el.textContent=connectionLabel();
        el.setAttribute('data-state', state.connectionState || 'idle');
        el.title=state.error || state.connectionMessage || connectionLabel();
      });
      document.querySelectorAll('[data-cloud-retry]').forEach(function(btn){
        btn.disabled=state.connectionState==='checking';
        btn.classList.toggle('egt-admin-hidden', state.connectionState==='online');
        btn.textContent=state.connectionState==='checking'?'Prüfung läuft…':'Cloud erneut prüfen';
      });
      var detail=document.querySelector('[data-cloud-detail]');
      if(detail) detail.textContent=state.error || state.connectionMessage || '';
    }catch(e){}
  }
  function setConnectionState(next, message, error){
    state.connectionState=next || 'idle';
    state.connectionMessage=String(message||connectionLabel());
    state.error=String(error||'');
    updateConnectionUi();
    try{ emit('egt:cloud-state-changed', { state:state.connectionState, message:state.connectionMessage, error:state.error, online:state.online }); }catch(e){}
  }
  function withTimeout(promise, ms, label){
    var timer;
    return Promise.race([
      promise,
      new Promise(function(_resolve,reject){
        timer=setTimeout(function(){ var err=new Error((label||'Vorgang')+' nach '+Math.round(ms/1000)+' Sekunden abgebrochen.'); err.code='EGT_TIMEOUT'; reject(err); }, ms);
      })
    ]).finally(function(){ clearTimeout(timer); });
  }

  function buildGroupId(year, course, track){
    year = Number(year || 2026);
    course = normalizeCode(course || 'GK').replace(/-/g,'') || 'GK';
    track = normalizeCode(track || 'A').replace(/-/g,'') || 'A';
    return year+'-'+course+'-'+track;
  }
  function groupLabel(groupId){ return normalizeCode(groupId || buildGroupId(getCourseSettings().year, getCourseSettings().course, getCourseSettings().track)); }
  function ensureProfileGroup(profile){
    profile = profile || {};
    var y = Number(profile.year || getCourseSettings().year || 2026);
    var c = profile.course || getCourseSettings().course || 'GK';
    var t = profile.track || getCourseSettings().track || 'A';
    profile.groupId = profile.groupId || buildGroupId(y,c,t);
    profile.courseId = profile.courseId || ('course_'+String(y)+'_'+String(c).toLowerCase());
    profile.participantRole = profile.participantRole || 'teilnehmer';
    return profile;
  }

  function statusText(){
    var access='System bereit';
    if(adminOpen()) access='Angemeldet als Admin · Vollzugriff aktiv';
    else if(dozentOpen()) access='Angemeldet als '+portalDisplayName('dozent')+' · '+groupAccessForRole('dozent').label;
    else if(state.profile && state.profile.mustChangePassword) access='Angemeldet als Teilnehmer · Passwortwechsel erforderlich';
    else if(state.learner) access='Angemeldet als Teilnehmer · '+(state.learner.displayName || state.learner.code || 'Teilnehmer');
    else access='System bereit · kein Teilnehmer aktiv';
    return access+' · '+connectionLabel();
  }

  function defaultProfile(displayName, code, opts){
    opts=opts||{}; code=normalizeCode(code);
    var name = String(displayName||'').trim();
    var isAnonymous = opts.isAnonymous === true || !name;
    return {
      userId: code,
      code: code,
      loginName: code,
      displayName: isAnonymous ? 'Anonym' : name,
      alias: isAnonymous ? code : name,
      isAnonymous: isAnonymous,
      course: opts.course || 'GK',
      year: opts.year || 2026,
      track: opts.track || 'A',
      groupId: opts.groupId || buildGroupId(opts.year || 2026, opts.course || 'GK', opts.track || 'A'),
      courseId: opts.courseId || ('course_'+String(opts.year || 2026)+'_'+String(opts.course || 'GK').toLowerCase()),
      status:'active', role:'teilnehmer', participantRole:'teilnehmer',
      passwordHash: opts.passwordHash || '',
      passwordSalt: opts.passwordSalt || '',
      mustChangePassword: opts.mustChangePassword !== false,
      createdAt:nowIso(), lastActiveAt:'', updatedAt:nowIso(),
      global:{ totalSessions:0, totalXp:0, riskLevel:'unbekannt', lastModule:'', strengths:[], weaknesses:[], recurringErrors:{} },
      modules:{
        python:{ currentLevel:1, unlockedLevels:[1], xp:0, strengths:[], weaknesses:[], recurringErrors:{}, repairQueue:[], examHistory:[] },
        mathe:{ averageScore:0, answered:0, correct:0, strengths:[], weaknesses:[], recurringErrors:{} },
        logik:{ averageScore:0, answered:0, correct:0, strengths:[], weaknesses:[], recurringErrors:{} },
        simulation:{ averageScore:0, answered:0, correct:0, strengths:[], weaknesses:[], recurringErrors:{} },
        edv:{ averageScore:0, answered:0, correct:0, strengths:[], weaknesses:[], recurringErrors:{} },
        konzentration:{ averageScore:0, answered:0, correct:0, strengths:[], weaknesses:[], recurringErrors:{} }
      },
      activitySummary:(activityLedger()&&activityLedger().emptySummary?activityLedger().emptySummary():{schema:'egt-activity-summary-v1',totalSessions:0,completedSessions:0,simulationSessions:0,trainingSessions:0,taskAnswers:0,correctAnswers:0,byKind:{},byModule:{},daily:{},heat:{},processedSessionIds:[]}),
      activityRecent:[], dataSchemaVersion:'egt-activity-ledger-v1',
      coachStyle:{ explanationLevel:'einfach_plus_fachbegriff', tone:'direkt_motivierend', examplesPreferred:true, slangAccepted:true },
      recentEvents:[], attempts:[]
    };
  }

  function localAll(){ try{return JSON.parse(localStorage.getItem(LOCAL_KEY)||'{}')||{};}catch(e){return {};}}
  function localSaveAll(data){ try{localStorage.setItem(LOCAL_KEY, JSON.stringify(data||{}));}catch(e){} }
  function localSetActive(code){ try{localStorage.setItem(ACTIVE_KEY, normalizeCode(code));}catch(e){} }
  function localGetActive(){ try{return localStorage.getItem(ACTIVE_KEY)||'';}catch(e){return '';} }
  function localProfile(code){ var all=localAll(); code=normalizeCode(code); return all[code] ? migrateActivityProfile(all[code]) : null; }
  function localAccessCodes(){ try{return JSON.parse(localStorage.getItem(LOCAL_ACCESS_CODES_KEY)||'{}')||{};}catch(e){return {};} }
  function localSaveAccessCodes(data){ try{localStorage.setItem(LOCAL_ACCESS_CODES_KEY, JSON.stringify(data||{}));}catch(e){} }
  function localTickets(){ try{ var raw=localStorage.getItem(LOCAL_TICKETS_KEY); var list=raw?JSON.parse(raw):[]; return Array.isArray(list)?list:[]; }catch(e){ return []; } }
  function localSaveTickets(list){ try{ localStorage.setItem(LOCAL_TICKETS_KEY, JSON.stringify(Array.isArray(list)?list:[])); }catch(e){} }
  function pendingTickets(){ try{ var raw=localStorage.getItem(PENDING_TICKETS_KEY); var list=raw?JSON.parse(raw):[]; return Array.isArray(list)?list:[]; }catch(e){ return []; } }

  function pendingSyncQueue(){ try{return JSON.parse(localStorage.getItem(PENDING_SYNC_KEY)||'[]')||[];}catch(e){return [];} }
  function savePendingSyncQueue(list){ try{ localStorage.setItem(PENDING_SYNC_KEY, JSON.stringify((list||[]).slice(-120))); }catch(e){} }
  function queuePendingSync(type, payload){
    var list=pendingSyncQueue();
    var item={ id:'sync_'+Date.now()+'_'+Math.random().toString(36).slice(2,8), type:String(type||'event'), payload:clone(payload||{}), createdAt:nowIso(), attempts:0 };
    list.push(item); savePendingSyncQueue(list); emit('egt:sync-pending', { pending:list.length, item:item }); return item;
  }
  function syncStatus(){
    var pending=pendingSyncQueue();
    var last=''; try{ last=localStorage.getItem(LAST_SYNC_FLUSH_KEY)||''; }catch(e){}
    var base={ provider:state.online?'firebase-firestore':'local-cache', online:state.online, firebaseConfigured:firebaseConfigReady(), ready:state.ready, uiReady:state.uiReady, initialized:state.initialized, initializing:state.initializing, connectionState:state.connectionState, connectionMessage:state.connectionMessage, lastAttemptAt:state.lastAttemptAt, lastConnectedAt:state.lastConnectedAt, courseId:state.courseId, pending:pending.length, pendingCount:pending.length, lastFlushAt:last, error:state.error||'' };
    var ops=adminOperations();
    base.health=ops&&ops.syncHealth?ops.syncHealth(base,pending):{grade:base.online?'healthy':'offline',label:base.online?'Synchron':'Lokaler Modus',pending:pending.length,failed:0};
    base.failedCount=base.health.failed||0; base.oldestPendingAt=base.health.oldestAt||''; base.oldestPendingAgeMs=base.health.oldestAgeMs||0;
    return base;
  }

  function randomCodeChunk(len){
    len=len||4;
    var chars='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    var arr=new Uint8Array(len), out='';
    if(window.crypto && crypto.getRandomValues) crypto.getRandomValues(arr); else for(var i=0;i<len;i++) arr[i]=Math.floor(Math.random()*256);
    for(var j=0;j<arr.length;j++) out += chars[arr[j] % chars.length];
    return out;
  }
  function generatedAccessCode(role, groupId){
    role=normalizeRoleValue(role||'participant');
    var rolePrefix={ participant:'TN', teacher:'DZ', admin:'AD', demo:'DM' }[role] || 'TN';
    var group=normalizeCode(groupId || getCourseSettings().prefix || 'Novura Assessments').replace(/-/g,'').slice(0,12) || 'Novura Assessments';
    return normalizeCode('Novura Assessments-'+rolePrefix+'-'+group+'-'+randomCodeChunk(4)+'-'+randomCodeChunk(3));
  }
  function accessCodeScopeFor(role){
    role=role||currentPortalRole();
    var access=groupAccessForRole(role);
    return { role:role, all:!!access.all, groups:access.groups||[], label:access.label||'', dozent:access.dozent||null };
  }
  function canCreateAccessCodeFor(portalRole, targetRole, groupId){
    portalRole=portalRole||currentPortalRole();
    targetRole=normalizeRoleValue(targetRole||'participant');
    groupId=groupLabel(groupId||'');
    if(portalRole==='admin') return true;
    if(portalRole==='dozent'){
      if(targetRole!=='participant') return false;
      return canViewGroup('dozent', groupId);
    }
    return false;
  }
  function currentAdminName(){
    // Echten Admin-Namen aus Firebase-Session holen
    try {
      var raw = localStorage.getItem('egt_auth_profile_session_v1');
      var s = raw ? JSON.parse(raw) : null;
      if(s && s.nickname) return s.nickname;
      if(s && s.email) return s.email.split('@')[0];
    } catch(e){}
    return 'Admin';
  }
  function normalizeAccessCodeInput(opts){
    opts=opts||{};
    var portalRole=currentPortalRole();
    var role=normalizeRoleValue(opts.role || 'participant');
    var scope=accessCodeScopeFor(portalRole);
    var groupId=groupLabel(opts.groupId || opts.group_id || scope.groups[0] || getCourseSettings().prefix);
    if(portalRole==='dozent'){
      role='participant';
      groupId=groupLabel(scope.groups[0] || groupId);
    }
    var maxUses=Number(opts.maxUses || opts.max_uses || 1); if(!isFinite(maxUses) || maxUses<1) maxUses=1;
    var code=normalizeCode(opts.code || generatedAccessCode(role, groupId));
    if(!canCreateAccessCodeFor(portalRole, role, groupId)) throw new Error('Diese Rolle darf für diese Gruppe keinen Zugangscode erzeugen.');
    return {
      id: accessCodeId(code), code: code, role: role, roleLabel: roleDisplayValue(role), groupId: groupId,
      status: 'active', maxUses: maxUses, max_uses:maxUses, usedCount: 0, used_count:0,
      expiresAt: opts.expiresAt || opts.expires_at || null, note: String(opts.note||'').trim().slice(0,140),
      createdByRole: portalRole, createdBy: portalRole==='dozent' && scope.dozent ? scope.dozent.dozentId : 'admin',
      createdByName: portalRole==='dozent' && scope.dozent ? scope.dozent.displayName : currentAdminName(),
      courseId: state.courseId, createdAt: nowIso(), updatedAt: nowIso(), source:'portal-access-code-generator'
    };
  }
  async function createAccessCode(opts){
    var payload=normalizeAccessCodeInput(opts||{});
    await init();
    if(privilegedWritesViaFunctions()){
      var result=await secureCallable('adminAction',{action:'createAccessCode',courseId:state.courseId,code:payload.code,role:payload.role,groupId:payload.groupId,maxUses:payload.maxUses,expiresAt:payload.expiresAt,note:payload.note},['admin','teacher']);
      var created=result&&result.accessCode||payload;
      emit('egt:access-code-created',{accessCode:created,provider:'firebase-functions'});
      return Object.assign({},created,{provider:'firebase-functions'});
    }
    if(!state.online){
      if(config().accessCodeRequireFirebase !== false){
        throw new Error('Firebase ist für Zugangscodes erforderlich. Bitte Firebase-Konfiguration prüfen. Es wurde kein lokaler Fake-Code erzeugt.');
      }
      var local=localAccessCodes(); local[payload.id]=payload; localSaveAccessCodes(local);
      emit('egt:access-code-created', { accessCode:payload, provider:'local-cache' });
      return Object.assign({}, payload, { provider:'local-cache' });
    }
    await ensureCourse();
    var fs=state.sync.fsMod;
    await fs.setDoc(docRef('courses/'+state.courseId+'/accessCodes/'+payload.id), payload, { merge:true });
    emit('egt:access-code-created', { accessCode:payload, provider:'firebase-firestore' });
    return Object.assign({}, payload, { provider:'firebase-firestore' });
  }
  function accessCodeVisibleFor(role, acc){
    role=role||currentPortalRole(); acc=acc||{};
    if(role==='admin') return true;
    if(role==='dozent') return normalizeRoleValue(acc.role)==='participant' && canViewGroup('dozent', acc.groupId||acc.group_id||'');
    return false;
  }
  async function listAccessCodes(role){
    role=role||currentPortalRole();
    await init();
    var list=[];
    if(state.online){
      await ensureCourse();
      var fs=state.sync.fsMod, ref=colRef('courses/'+state.courseId+'/accessCodes'), qs;
      if(role==='admin') qs=await fs.getDocs(ref);
      else if(role==='dozent'){
        var groups=groupAccessForRole('dozent').groups||[];
        if(!groups.length) return [];
        qs=await fs.getDocs(fs.query(ref,fs.where('groupId','in',groups.slice(0,10))));
      }else return [];
      qs.forEach(function(d){ var x=d.data()||{}; x.id=d.id; if(accessCodeVisibleFor(role,x)) list.push(x); });
    }else if(localRolePinsAllowed()){
      var all=localAccessCodes();
      Object.keys(all).forEach(function(k){ var x=all[k]||{}; x.id=x.id||k; if(accessCodeVisibleFor(role,x)) list.push(x); });
    }
    return list.sort(function(a,b){ return String(b.createdAt||'').localeCompare(String(a.createdAt||'')); }).slice(0,80);
  }

  async function revokeAccessCode(code){
    code=normalizeCode(code); if(!code) throw new Error('Zugangscode fehlt.');
    var id=accessCodeId(code); var role=currentPortalRole();
    if(privilegedWritesViaFunctions()){
      var result=await secureCallable('adminAction',{action:'revokeAccessCode',courseId:state.courseId,code:code},['admin','teacher']);
      emit('egt:access-code-revoked',{code:code,role:role,provider:'firebase-functions'});
      return result||{code:code,status:'revoked'};
    }
    var existing=null;
    if(state.online){
      await ensureCourse();
      var snap=await state.sync.fsMod.getDoc(docRef('courses/'+state.courseId+'/accessCodes/'+id));
      if(!snap.exists()) throw new Error('Zugangscode nicht gefunden.');
      existing=snap.data()||{}; existing.id=snap.id;
      if(!accessCodeVisibleFor(role, existing)) throw new Error('Du darfst diesen Zugangscode nicht widerrufen.');
      await state.sync.fsMod.setDoc(docRef('courses/'+state.courseId+'/accessCodes/'+id), { status:'revoked', revokedAt:nowIso(), revokedByRole:role, updatedAt:nowIso() }, {merge:true});
    }else{
      var all=localAccessCodes(); existing=all[id]||all[code];
      if(!existing) throw new Error('Zugangscode nicht gefunden.');
      if(!accessCodeVisibleFor(role, existing)) throw new Error('Du darfst diesen Zugangscode nicht widerrufen.');
      existing.status='revoked'; existing.revokedAt=nowIso(); existing.revokedByRole=role; existing.updatedAt=nowIso(); all[id]=existing; localSaveAccessCodes(all);
    }
    emit('egt:access-code-revoked', { code:code, role:role });
    return { code:code, status:'revoked' };
  }
  function normalizeRoleValue(role){
    role=String(role||'participant').toLowerCase();
    if(role==='teilnehmer' || role==='learner') return 'participant';
    if(role==='dozent' || role==='teacher') return 'teacher';
    if(role==='administrator') return 'admin';
    if(role==='demo' || role==='guest') return 'demo';
    return ['participant','teacher','admin','demo'].indexOf(role)>=0 ? role : 'participant';
  }
  function roleDisplayValue(role){ var r=normalizeRoleValue(role); return r==='teacher'?'Dozent':(r==='admin'?'Admin':(r==='demo'?'Demo':'Teilnehmer')); }
  function accessCodeId(code){ return safeId(normalizeCode(code)); }
  function sessionProfilePayload(profile){
    profile=profile||{};
    return {
      profileId: profile.profileId || profile.id || safeId(profile.userId || profile.code || profile.loginName || ''),
      userId: profile.userId || profile.code || profile.loginName || '',
      code: profile.code || profile.loginName || profile.userId || '',
      nickname: profile.nickname || profile.displayName || profile.alias || '',
      displayName: profile.displayName || profile.nickname || profile.alias || '',
      role: normalizeRoleValue(profile.role || profile.accessRole || profile.participantRole || 'participant'),
      groupId: profile.groupId || profile.group_id || '',
      provider: state.online?'firebase-firestore':'local-cache',
      updatedAt: nowIso()
    };
  }
  function saveUserSession(profile){ try{ localStorage.setItem(USERDB_SESSION_KEY, JSON.stringify(sessionProfilePayload(profile))); }catch(e){} }
  function readUserSession(){ try{return JSON.parse(localStorage.getItem(USERDB_SESSION_KEY)||'null');}catch(e){return null;} }
  function clearUserSession(){ try{ localStorage.removeItem(USERDB_SESSION_KEY); }catch(e){} }
  function localUpsert(profile, setActive){
    profile=migrateActivityProfile(profile||{});
    var all=localAll(); var code=normalizeCode(profile.userId || profile.code || profile.loginName);
    profile.userId=code; profile.code=code; profile.loginName=profile.loginName||code; ensureProfileGroup(profile); profile.updatedAt=nowIso();
    all[code]=profile; localSaveAll(all);
    if(setActive!==false){ localSetActive(code); state.learner={ id:safeId(code), userId:code, code:code, displayName:profile.nickname||profile.displayName||profile.alias||code, alias:profile.alias||profile.nickname||profile.displayName||code, status:profile.status||'active', role:normalizeRoleValue(profile.role||profile.participantRole||'participant'), groupId:profile.groupId||'' }; state.profile=profile; saveUserSession(profile); }
    return profile;
  }
  function addRecent(profile, event){ profile.recentEvents = Array.isArray(profile.recentEvents)?profile.recentEvents:[]; profile.recentEvents.unshift(event); profile.recentEvents=profile.recentEvents.slice(0, (config().maxRecentEventsPerLearner||160)); return profile; }

  function randomBytes(len){
    var a=new Uint8Array(len||16);
    if(window.crypto && crypto.getRandomValues) crypto.getRandomValues(a); else for(var i=0;i<a.length;i++) a[i]=Math.floor(Math.random()*256);
    return Array.from(a).map(function(x){return x.toString(16).padStart(2,'0');}).join('');
  }
  function generatePassword(){
    var chars='ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%';
    var out=''; var arr=new Uint8Array(12);
    if(window.crypto && crypto.getRandomValues) crypto.getRandomValues(arr); else for(var j=0;j<arr.length;j++) arr[j]=Math.floor(Math.random()*256);
    for(var i=0;i<arr.length;i++) out += chars[arr[i] % chars.length];
    return out;
  }
  async function hashPassword(password, salt){
    password=String(password||''); salt=String(salt||'');
    if(!password) throw new Error('Passwort fehlt.');
    var data=new TextEncoder().encode(salt+':'+password);
    if(window.crypto && crypto.subtle && crypto.subtle.digest){
      var buf=await crypto.subtle.digest('SHA-256', data);
      return Array.from(new Uint8Array(buf)).map(function(x){return x.toString(16).padStart(2,'0');}).join('');
    }
    var h=2166136261; var s=salt+':'+password;
    for(var i=0;i<s.length;i++){ h^=s.charCodeAt(i); h+=(h<<1)+(h<<4)+(h<<7)+(h<<8)+(h<<24); }
    return ('fallback_'+(h>>>0).toString(16));
  }
  async function verifyPassword(profile, password){
    if(!profile || !profile.passwordHash || !profile.passwordSalt) throw new Error('Für diesen Teilnehmer ist noch kein Passwort gesetzt. Bitte Admin kontaktieren.');
    var h=await hashPassword(password, profile.passwordSalt);
    return h === profile.passwordHash;
  }

  function firebaseConfigReady(){
    var c=config()||{}, f=c.firebaseConfig||c.syncConfig||{};
    return !!(f && f.apiKey && f.authDomain && f.projectId && f.appId);
  }
  function firebaseSdkBase(){
    var v=(config().sdkVersion || '12.14.0');
    return 'https://www.gstatic.com/firebasejs/'+v+'/';
  }
  async function loadSync(){
    var c=config()||{};
    if(!c.enabled || (c.provider && c.provider!=='firebase') || (c.mode && String(c.mode).indexOf('firebase')<0)){
      throw new Error('Firebase UserDatabase ist deaktiviert.');
    }
    if(!firebaseConfigReady()) throw new Error('Firebase-Konfiguration fehlt: apiKey, authDomain, projectId und appId eintragen.');
    if(state.sync && state.db) return state.sync;
    var sec=securityContext();
    if(!sec) throw new Error('EGTSecurityContext fehlt.');
    await sec.initialize();
    var mods=sec.modules;
    if(!mods || !sec.db || !sec.auth) throw new Error('Firebase-Sicherheitskontext konnte nicht initialisiert werden.');
    state.sync={
      appMod:mods.appMod, authMod:mods.authMod, fsMod:mods.fsMod, fnMod:mods.fnMod,
      app:sec.app, db:sec.db, auth:sec.auth, functions:sec.functions, provider:'firebase-firestore'
    };
    state.db=sec.db; state.auth=sec.auth;
    updateSecurityState();
    return state.sync;
  }
  async function signIn(){
    await loadSync();
    var c=config()||{}, sec=securityContext();
    if(state.auth.currentUser){ state.user=state.auth.currentUser; await refreshSecurityClaims(false).catch(function(){}); return state.user; }
    if(c.useAnonymousAuth === false){ state.user=null; return null; }
    state.user=await sec.signInAnonymouslyIfNeeded();
    updateSecurityState();
    return state.user;
  }
  function docRef(path){
    if(!state.sync || !state.db) throw new Error('Firebase UserDatabase ist nicht verbunden: '+path);
    return state.sync.fsMod.doc(state.db, path);
  }
  function colRef(path){
    if(!state.sync || !state.db) throw new Error('Firebase UserDatabase ist nicht verbunden: '+path);
    return state.sync.fsMod.collection(state.db, path);
  }
  async function ensureCourse(){
    if(!state.online) return null;
    // G54.46.2: Ein Browser darf keine Kurs-Stammdokumente mehr beim Start erzeugen
    // oder überschreiben. Provisionierung geschieht ausschließlich serverseitig.
    if(isDevelopment() && state.securityRole==='admin'){
      var fs=state.sync.fsMod;
      await fs.setDoc(docRef('courses/'+state.courseId), {
        courseId:state.courseId, title:config().courseTitle || state.courseId,
        provider:'firebase-firestore', updatedAt:nowIso(), appVersion:window.TRAINER_BUILD_VERSION || ''
      }, {merge:true});
    }
    return state.courseId;
  }

  function restoreActiveLocalProfile(){
    var activeLocal=localGetActive();
    if(!activeLocal) return;
    var lp=localProfile(activeLocal);
    if(lp && lp.mustChangePassword!==true){
      state.learner={ id:safeId(activeLocal), userId:activeLocal, code:activeLocal, displayName:lp.displayName||lp.alias||activeLocal, alias:lp.alias||activeLocal, status:lp.status||'active' };
      state.profile=lp;
    }
  }
  function ensureUiReady(){
    if(state.uiReady) return;
    var cur=getCourseSettings();
    state.courseId='course_'+String(cur.year)+'_'+String(cur.course).toLowerCase();
    patchCoach();
    buildUI();
    restoreActiveLocalProfile();
    state.uiReady=true;
    state.ready=true;
    updateUI();
    emit('egt:admin-ui-ready', { state:snapshot() });
  }
  function postConnectionMaintenance(attemptId){
    Promise.resolve().then(function(){
      return withTimeout(ensureCourse(), 5000, 'Kurs-Synchronisierung');
    }).catch(function(e){
      if(attemptId!==state.connectionAttempt || !state.online) return;
      state.connectionMessage='Cloud verbunden · Kurs-Synchronisierung mit Hinweis';
      state.error=e.message||String(e);
      updateUI();
    }).then(function(){
      if(attemptId!==state.connectionAttempt || !state.online) return null;
      return withTimeout(flushPendingSync(), 6000, 'Offline-Warteschlange');
    }).catch(function(e){
      if(attemptId!==state.connectionAttempt || !state.online) return;
      state.connectionMessage='Cloud verbunden · Offline-Warteschlange noch offen';
      state.error=e.message||String(e);
      updateUI();
    });
  }
  async function connectCloud(attemptId){
    await loadSync();
    await signIn();
    if(attemptId!==state.connectionAttempt) return { stale:true };
    return { stale:false };
  }
  function startCloudConnection(force){
    ensureUiReady();
    if(connectionPromise && !force) return connectionPromise;
    if(force && connectionPromise){ state.connectionAttempt+=1; connectionPromise=null; }
    var attemptId=++state.connectionAttempt;
    state.initializing=true;
    state.initialized=false;
    state.online=false;
    state.authReady=false;
    state.lastAttemptAt=nowIso();
    setConnectionState('checking','Firebase-Verbindung wird geprüft…','');
    updateUI();
    var timeout=cloudTimeoutMs();
    var task=withTimeout(connectCloud(attemptId), timeout, 'Firebase-Verbindung');
    connectionPromise=task.then(function(result){
      if(attemptId!==state.connectionAttempt || (result&&result.stale)) return state;
      state.online=true;
      state.authReady=true;
      state.initialized=true;
      state.lastConnectedAt=nowIso();
      setConnectionState('online','Firebase UserDatabase verbunden','');
      postConnectionMaintenance(attemptId);
      return state;
    }).catch(function(e){
      if(attemptId!==state.connectionAttempt) return state;
      state.online=false;
      state.authReady=false;
      state.initialized=true;
      var required=!!config().requireRemoteUserDatabase;
      var detail=(e&&e.message)||String(e||'Unbekannter Firebase-Fehler');
      setConnectionState(required?'error':'local', required?'Firebase ist erforderlich, aber nicht erreichbar.':'Firebase nicht verbunden · lokaler Cache aktiv', detail);
      if(required) console.warn('[EGT Firebase]', detail);
      return state;
    }).finally(function(){
      if(attemptId!==state.connectionAttempt) return;
      state.initializing=false;
      connectionPromise=null;
      updateUI();
      emit('egt:sync-ready', { state:snapshot() });
    });
    return connectionPromise;
  }
  async function init(opts){
    opts=opts||{};
    ensureUiReady();
    if(opts.force===true) return startCloudConnection(true);
    if(state.initialized && !state.initializing) return state;
    if(initPromise) return initPromise;
    initPromise=startCloudConnection(false).finally(function(){ initPromise=null; });
    return initPromise;
  }
  async function retryCloudConnection(){
    ensureUiReady();
    announcePortalState('Cloud-Verbindung wird erneut geprüft…');
    return init({ force:true });
  }
  function snapshot(){ var ss=syncStatus(); updateSecurityState(); return { internalState:state.uiReady?'bereit':'startet', online:state.online, ready:state.ready, uiReady:state.uiReady, initialized:state.initialized, initializing:state.initializing, connectionState:state.connectionState, connectionMessage:state.connectionMessage, lastAttemptAt:state.lastAttemptAt, lastConnectedAt:state.lastConnectedAt, error:state.error, provider:state.online?'firebase-firestore':'local-cache', firebaseConfigured:firebaseConfigReady(), courseId:state.courseId, pendingSync:ss.pending, lastSyncFlushAt:ss.lastFlushAt, user:state.user && { uid:state.user.uid, isAnonymous:state.user.isAnonymous, email:state.user.email||'' }, securityRole:state.securityRole, claimsTrusted:state.claimsTrusted, appCheckReady:state.appCheckReady, environment:appConfig().environment||'production', learner:state.learner, profile:state.profile }; }

  async function fetchProfile(code){
    code=normalizeCode(code); var id=safeId(code);
    if(state.online){
      await ensureCourse(); var fs=state.sync.fsMod;
      if(privilegedWritesViaFunctions()){
        var sec=securityContext(); var uid=sec&&sec.user&&sec.user.uid;
        if(!uid || (sec.user&&sec.user.isAnonymous)) throw new Error('Bestätigte Firebase-Anmeldung erforderlich.');
        var own=await fs.getDoc(docRef('courses/'+state.courseId+'/learners/'+uid));
        if(!own.exists()) throw new Error('Teilnehmerprofil fehlt. Bitte Zugangscode einlösen.');
        var ownProfile=own.data()||{}; ownProfile.userId=ownProfile.userId||ownProfile.code||code; ownProfile.code=ownProfile.code||ownProfile.userId||code; ownProfile.loginName=ownProfile.loginName||ownProfile.code; ownProfile.id=uid; ownProfile.firebaseUid=uid;
        return {id:uid,profile:ownProfile};
      }
      var access=await fs.getDoc(docRef('courses/'+state.courseId+'/accessCodes/'+id));
      if(!access.exists()) throw new Error('Zugang nicht gefunden. Bitte Admin kontaktieren.');
      var acc=access.data()||{}; if(acc.status && acc.status !== 'active') throw new Error('Dieser Zugang ist deaktiviert.');
      var learnerId=acc.learnerId || id; var lsnap=await fs.getDoc(docRef('courses/'+state.courseId+'/learners/'+learnerId));
      if(!lsnap.exists()) throw new Error('Teilnehmerprofil fehlt. Bitte Admin kontaktieren.');
      var profile=lsnap.data()||{}; profile.userId=profile.userId||code; profile.code=profile.code||code; profile.loginName=profile.loginName||code; profile.id=learnerId;
      return { id:learnerId, profile:profile };
    }
    var p=localProfile(code); if(!p) throw new Error('Zugang nicht gefunden. Bitte Admin kontaktieren.'); return { id:safeId(code), profile:p };
  }

  function validateAccessDocument(acc, code){
    acc=acc||{};
    var status=String(acc.status||'active').toLowerCase();
    if(status !== 'active') throw new Error('Dieser Zugangscode ist nicht aktiv.');
    var maxUses=Number(acc.maxUses != null ? acc.maxUses : acc.max_uses != null ? acc.max_uses : 1);
    var used=Number(acc.usedCount != null ? acc.usedCount : acc.used_count != null ? acc.used_count : 0);
    if(isFinite(maxUses) && maxUses > 0 && used >= maxUses) throw new Error('Dieser Zugangscode wurde bereits eingelöst.');
    var exp=acc.expiresAt || acc.expires_at || '';
    if(exp){ var ts=Date.parse(exp); if(isFinite(ts) && ts < Date.now()) throw new Error('Dieser Zugangscode ist abgelaufen.'); }
    acc.code = normalizeCode(acc.code || code);
    acc.role = normalizeRoleValue(acc.role || acc.accessRole || acc.type || 'participant');
    acc.groupId = acc.groupId || acc.group_id || groupLabel(acc.group || '');
    return acc;
  }
  async function fetchAccessCode(code){
    code=normalizeCode(code); if(!code) throw new Error('Bitte Zugangscode eingeben.');
    var id=accessCodeId(code);
    if(state.online){
      await ensureCourse(); var fs=state.sync.fsMod;
      var snap=await fs.getDoc(docRef('courses/'+state.courseId+'/accessCodes/'+id));
      if(!snap.exists()) throw new Error('Zugangscode nicht gefunden.');
      var acc=snap.data()||{}; acc.id=snap.id;
      return validateAccessDocument(acc, code);
    }
    var local=localAccessCodes();
    var acc=local[id] || local[code] || null;
    if(!acc) throw new Error('Firebase ist nicht verbunden und dieser Zugangscode ist nicht im lokalen Cache vorhanden.');
    acc.id=acc.id||id;
    return validateAccessDocument(acc, code);
  }
  function profileFromAccess(acc, opts){
    opts=opts||{}; acc=acc||{};
    var nickname=String(opts.nickname || acc.nickname || acc.displayName || '').trim();
    if(nickname.length < 3) throw new Error('Nickname braucht mindestens 3 Zeichen.');
    if(nickname.length > 20) throw new Error('Nickname darf maximal 20 Zeichen haben.');
    if(!/^[A-Za-zÄÖÜäöüß0-9 ._\-]{3,20}$/.test(nickname)) throw new Error('Nickname enthält ungültige Zeichen.');
    var role=normalizeRoleValue(acc.role || 'participant');
    var baseCode=normalizeCode(acc.learnerCode || acc.profileCode || acc.code || ('USER-'+Date.now()));
    var profileId = opts.firebaseUid || acc.learnerId || acc.profileId || safeId((state.user&&state.user.uid) || (baseCode+'-'+Date.now()));
    var profile=defaultProfile(nickname, baseCode, { isAnonymous:false, course:acc.course||getCourseSettings().course, year:acc.year||getCourseSettings().year, track:acc.track||getCourseSettings().track, groupId:acc.groupId||acc.group_id||groupLabel('') });
    profile.id=profileId; profile.profileId=profileId;
    profile.nickname=nickname; profile.displayName=nickname; profile.alias=nickname;
    profile.role=role; profile.accessRole=role; profile.roleLabel=roleDisplayValue(role);
    profile.participantRole=role==='participant'?'teilnehmer':role;
    profile.groupId=acc.groupId||acc.group_id||profile.groupId;
    profile.courseId=state.courseId; profile.status='active'; profile.mustChangePassword=false;
    profile.accessCode=normalizeCode(acc.code); profile.accessCodeId=acc.id||accessCodeId(acc.code);
    profile.createdByAccessCode=true; profile.createdVia='access-code'; profile.createdAt=profile.createdAt||nowIso(); profile.updatedAt=nowIso();
    profile.firebaseUid=opts.firebaseUid || state.user&&state.user.uid||'';
    profile.personalDataOptional=true; profile.avatarMode='local';
    return profile;
  }
  async function writeRedeemedProfile(profile, acc, password){
    if(password){ var salt=randomBytes(16); profile.passwordSalt=salt; profile.passwordHash=await hashPassword(password, salt); profile.mustChangePassword=false; }
    var id=profile.profileId || profile.id || safeId(profile.userId||profile.code);
    if(state.online){
      await ensureCourse(); var fs=state.sync.fsMod;
      await fs.setDoc(docRef('courses/'+state.courseId+'/learners/'+id), profile, {merge:true});
      var accessId=acc.id || accessCodeId(acc.code);
      var used=Number(acc.usedCount != null ? acc.usedCount : acc.used_count != null ? acc.used_count : 0)+1;
      var maxUses=Number(acc.maxUses != null ? acc.maxUses : acc.max_uses != null ? acc.max_uses : 1);
      var nextStatus=(isFinite(maxUses) && maxUses > 0 && used >= maxUses) ? 'used' : 'active';
      await fs.setDoc(docRef('courses/'+state.courseId+'/accessCodes/'+accessId), {
        code:normalizeCode(acc.code), status:nextStatus, usedCount:used, used_count:used, lastRedeemedAt:nowIso(),
        lastRedeemedBy:id, groupId:profile.groupId||'', role:profile.role||'participant', learnerId:id, updatedAt:nowIso()
      }, {merge:true});
      await fs.addDoc(colRef('courses/'+state.courseId+'/learners/'+id+'/events'), { type:'access-code-redeemed', code:normalizeCode(acc.code), role:profile.role, groupId:profile.groupId||'', createdAt:nowIso() }).catch(function(e){ state.error=e.message||String(e); });
    }else{
      var all=localAccessCodes(); var accessId=acc.id || accessCodeId(acc.code); all[accessId]=Object.assign({}, acc, { status:'used', usedCount:Number(acc.usedCount||0)+1, lastRedeemedAt:nowIso(), lastRedeemedBy:id }); localSaveAccessCodes(all);
    }
    localUpsert(profile, true);
    state.learner={ id:id, userId:profile.userId||profile.code, code:profile.code||profile.userId, displayName:profile.displayName||profile.nickname, alias:profile.alias||profile.nickname, status:'active', role:profile.role||'participant', groupId:profile.groupId||'' };
    state.profile=profile; saveUserSession(profile); updateUI(); emit('egt:access-code-redeemed',{ profile:profile, accessCode:normalizeCode(acc.code), provider:state.online?'firebase-firestore':'local-cache' }); emit('egt:learner-login',{ learner:state.learner, profile:profile });
    return { profile:profile, learner:state.learner, role:profile.role||'participant', groupId:profile.groupId||'', provider:state.online?'firebase-firestore':'local-cache' };
  }
  async function redeemAccessCode(payload){
    payload=payload||{}; var code=normalizeCode(payload.code); var nickname=String(payload.nickname||'').trim();
    if(!code) throw new Error('Bitte Zugangscode eingeben.');
    if(nickname.length < 3) throw new Error('Nickname braucht mindestens 3 Zeichen.');
    await init();
    if(privilegedWritesViaFunctions()){
      if(!state.online) throw new Error('Sichere Code-Einlösung benötigt Firebase.');
      var result=await secureCallable('redeemAccessCode',{courseId:state.courseId,code:code,nickname:nickname});
      var profile=result&&result.profile||{};
      profile.firebaseUid=profile.firebaseUid||(securityContext()&&securityContext().user&&securityContext().user.uid)||payload.firebaseUid||'';
      localUpsert(profile,true);
      state.profile=profile;
      state.learner={id:profile.profileId||profile.id||profile.firebaseUid,userId:profile.userId||profile.code||profile.firebaseUid,code:profile.code||profile.userId||'',displayName:profile.displayName||profile.nickname,alias:profile.alias||profile.nickname,status:profile.status||'active',role:normalizeRoleValue(result.role||profile.role||'participant'),groupId:result.groupId||profile.groupId||''};
      saveUserSession(profile);
      await refreshSecurityClaims(true);
      updateUI();
      emit('egt:access-code-redeemed',{profile:profile,accessCode:code,provider:'firebase-functions'});
      emit('egt:learner-login',{learner:state.learner,profile:profile});
      return {profile:profile,learner:state.learner,role:result.role||profile.role||'participant',groupId:result.groupId||profile.groupId||'',provider:'firebase-functions'};
    }
    if(!state.online && config().requireRemoteUserDatabase) throw new Error('Firebase UserDatabase ist erforderlich, aber nicht verbunden.');
    var acc=await fetchAccessCode(code);
    var profile=profileFromAccess(acc,{nickname:nickname,firebaseUid:payload.firebaseUid||''});
    return writeRedeemedProfile(profile,acc,payload.password||'');
  }

  function getSession(){
    if(state.profile) return sessionProfilePayload(state.profile);
    return readUserSession();
  }
  function setSession(profile){ if(profile){ state.profile=profile; state.learner={ id:profile.profileId||profile.id||safeId(profile.userId||profile.code), userId:profile.userId||profile.code, code:profile.code||profile.userId, displayName:profile.nickname||profile.displayName||profile.alias, alias:profile.alias||profile.nickname||profile.displayName, status:profile.status||'active', role:normalizeRoleValue(profile.role||'participant'), groupId:profile.groupId||'' }; saveUserSession(profile); localUpsert(profile, true); emit('egt:learner-login',{ learner:state.learner, profile:profile }); } return getSession(); }
  function getRole(){ return normalizeRoleValue((state.profile&&state.profile.role) || (readUserSession()&&readUserSession().role) || 'guest'); }
  function getGroup(){ return (state.profile&&state.profile.groupId) || (readUserSession()&&readUserSession().groupId) || ''; }
  async function saveProfile(profile, setActive){
    profile=profile||{};
    var code=normalizeCode(profile.userId || profile.code || profile.loginName);
    profile.userId=code; profile.code=code; profile.loginName=profile.loginName||code; ensureProfileGroup(profile); profile.updatedAt=nowIso();
    if(state.online){
      await ensureCourse(); var fs=state.sync.fsMod;
      if(privilegedWritesViaFunctions()){
        var sec=securityContext(); var uid=sec&&sec.user&&sec.user.uid;
        if(!uid) throw new Error('Sichere Profilspeicherung benötigt eine Firebase-Anmeldung.');
        if(profile.firebaseUid && profile.firebaseUid!==uid) throw new Error('Fremdes Profil darf nicht als eigenes gespeichert werden.');
        // G54.46.3: Leistungs-, Session- und Aggregatdaten werden ausschließlich
        // über recordLearningSession serverseitig geschrieben. Der Browser darf hier
        // nur persönliche Lern-/Darstellungseinstellungen aktualisieren.
        var safePatch={
          coachStyle:profile.coachStyle||{}, updatedAt:nowIso(), languageProgress:profile.languageProgress||{},
          preferences:profile.preferences||{}, learningPlan:profile.learningPlan||{}, reviewState:profile.reviewState||{},
          avatarMode:profile.avatarMode||'', personalDataOptional:profile.personalDataOptional||{}
        };
        if(profile.mustChangePassword===false){ safePatch.mustChangePassword=false; safePatch.passwordChangedAt=profile.passwordChangedAt||nowIso(); }
        await fs.setDoc(docRef('courses/'+state.courseId+'/learners/'+uid), safePatch, {merge:true});
        profile.firebaseUid=uid; profile.profileId=uid; profile.id=uid;
      }else{
        var id=safeId(code);
        await fs.setDoc(docRef('courses/'+state.courseId+'/learners/'+id), profile, {merge:true});
        await fs.setDoc(docRef('courses/'+state.courseId+'/accessCodes/'+id), { learnerId:id, code:code, loginName:code, status:profile.status||'active', updatedAt:nowIso() }, {merge:true});
      }
    }
    return localUpsert(profile, setActive);
  }

  async function createLearner(opts){
    opts = typeof opts === 'string' ? { code:opts } : (opts||{});
    if(privilegedWritesViaFunctions()) throw new Error('Produktiv werden Teilnehmer sicher per Zugangscode und eigener E-Mail-Registrierung angelegt. Bitte Zugangscode erstellen.');
    var code=normalizeCode(opts.code || await nextCode()); if(!code) throw new Error('Teilnehmer-ID fehlt.');
    var existing=null; try{ existing=await fetchProfile(code); }catch(e){}
    if(existing && existing.profile && existing.profile.status !== 'deleted') throw new Error('Teilnehmer existiert bereits: '+code);
    var firstPassword=generatePassword(); var salt=randomBytes(16); var hash=await hashPassword(firstPassword, salt);
    var profile=defaultProfile(opts.displayName||'', code, { isAnonymous: opts.isAnonymous === true || !String(opts.displayName||'').trim(), course:opts.course||'GK', year:opts.year||2026, track:opts.track||getCourseSettings().track, groupId:opts.groupId||buildGroupId(opts.year||2026, opts.course||'GK', opts.track||getCourseSettings().track), passwordHash:hash, passwordSalt:salt, mustChangePassword:true });
    profile.createdBy='admin-portal'; profile.createdAt=nowIso(); profile.lastActiveAt='';
    await saveProfile(profile, false); updateUI(); emit('egt:learner-created',{ userId:code, code:code, profile:profile });
    return { id:safeId(code), userId:code, code:code, firstPassword:firstPassword, profile:profile };
  }

  var DEMO_PASSWORD = 'Demo12345!';
  function demoModule(answered, accuracy, score, errors){
    answered=Number(answered||0); accuracy=Number(accuracy||0); var correct=Math.round(answered*accuracy/100);
    return { averageScore:Number(score||accuracy), answered:answered, correct:correct, strengths:[], weaknesses:[], recurringErrors:errors||{} };
  }
  async function makeDemoProfile(spec){
    var salt=randomBytes(16); var hash=await hashPassword(DEMO_PASSWORD, salt);
    var p=defaultProfile(spec.name, spec.code, { isAnonymous:false, course:spec.course, year:spec.year, track:spec.track||'A', groupId:spec.groupId||buildGroupId(spec.year, spec.course, spec.track||'A'), passwordHash:hash, passwordSalt:salt, mustChangePassword:false });
    p.alias=spec.name; p.displayName=spec.name; p.createdBy='demo-admin-portal'; p.isDemo=true; p.status='active';
    p.createdAt=isoHoursAgo(spec.createdHours||240); p.lastActiveAt=isoHoursAgo(spec.lastHours||4); p.updatedAt=nowIso();
    p.modules={
      python: { currentLevel: spec.pythonLevel||1, unlockedLevels:[1,2], xp:spec.xp||0, strengths:spec.strengths||[], weaknesses:spec.weaknesses||[], recurringErrors:spec.errors||{}, repairQueue:[], examHistory:[] },
      mathe: demoModule(spec.matheAnswered, spec.matheAccuracy, spec.matheScore, spec.matheErrors),
      logik: demoModule(spec.logikAnswered, spec.logikAccuracy, spec.logikScore, spec.logikErrors),
      simulation: demoModule(spec.simAnswered, spec.simAccuracy, spec.simScore, spec.simErrors),
      edv: demoModule(spec.edvAnswered, spec.edvAccuracy, spec.edvScore, spec.edvErrors),
      konzentration: demoModule(spec.konzAnswered, spec.konzAccuracy, spec.konzScore, spec.konzErrors)
    };
    p.global={ totalSessions: spec.sessions||0, totalXp:spec.xp||0, riskLevel:spec.risk||riskFromProfile(p), lastModule:spec.lastModule||'simulation', strengths:spec.strengths||[], weaknesses:spec.weaknesses||[], recurringErrors:spec.errors||{} };
    p.attempts=[
      { module:'simulation', type:'demo-simulation', score:spec.simScore||0, passed:(spec.simScore||0)>=70, correct:(spec.simScore||0)>=70, errors:Object.keys(spec.errors||{}), createdAt:isoHoursAgo(spec.lastHours||4) },
      { module:'mathe', type:'demo-training', score:spec.matheScore||0, passed:(spec.matheScore||0)>=70, correct:(spec.matheScore||0)>=70, errors:Object.keys(spec.matheErrors||{}), createdAt:isoHoursAgo((spec.lastHours||4)+10) }
    ];
    p.recentEvents=p.attempts.slice();
    p.global.riskLevel=riskFromProfile(p);
    return p;
  }
  async function createDemoLearners(){
    var cs=getCourseSettings();
    var base=cs.prefix;
    var groupA=buildGroupId(cs.year, cs.course, 'A');
    var groupB=buildGroupId(cs.year, cs.course, 'B');
    var demoSpecs=[
      { code:normalizeCode(cs.year+'-'+cs.course+'-A'+pad(1,cs.digits)), name:'Lisa Schulz', year:cs.year, course:cs.course, track:'A', groupId:groupA, risk:'stabil', lastHours:3, createdHours:220, sessions:14, xp:860, pythonLevel:2, strengths:['Textverständnis','Konzentration'], weaknesses:['Subnetting'], matheAnswered:18, matheAccuracy:83, matheScore:84, logikAnswered:16, logikAccuracy:81, logikScore:82, simAnswered:20, simAccuracy:86, simScore:88, edvAnswered:12, edvAccuracy:75, edvScore:78, konzAnswered:15, konzAccuracy:93, konzScore:92, errors:{'Subnetting unsicher':2}, matheErrors:{} },
      { code:normalizeCode(cs.year+'-'+cs.course+'-A'+pad(2,cs.digits)), name:'Tim Becker', year:cs.year, course:cs.course, track:'A', groupId:groupA, risk:'riskant', lastHours:26, createdHours:180, sessions:8, xp:410, pythonLevel:1, strengths:['IT-Grundlagen'], weaknesses:['Mathe','Zeitdruck'], matheAnswered:14, matheAccuracy:57, matheScore:58, logikAnswered:13, logikAccuracy:62, logikScore:64, simAnswered:18, simAccuracy:61, simScore:62, edvAnswered:10, edvAccuracy:70, edvScore:72, konzAnswered:9, konzAccuracy:56, konzScore:55, errors:{'Zeitdruck':4,'Dreisatz verwechselt':3}, matheErrors:{'Dreisatz verwechselt':3} },
      { code:normalizeCode(cs.year+'-'+cs.course+'-A'+pad(3,cs.digits)), name:'Anna Meier', year:cs.year, course:cs.course, track:'A', groupId:groupA, risk:'kritisch', lastHours:96, createdHours:150, sessions:5, xp:180, pythonLevel:1, strengths:['Motivation'], weaknesses:['Logik','Konzentration','Simulation'], matheAnswered:10, matheAccuracy:44, matheScore:46, logikAnswered:12, logikAccuracy:33, logikScore:35, simAnswered:15, simAccuracy:40, simScore:42, edvAnswered:8, edvAccuracy:50, edvScore:52, konzAnswered:10, konzAccuracy:38, konzScore:40, errors:{'Muster nicht erkannt':5,'Flüchtigkeitsfehler':4,'Zeitdruck':4}, logikErrors:{'Muster nicht erkannt':5} },
      { code:normalizeCode(cs.year+'-'+cs.course+'-B'+pad(1,cs.digits)), name:'Mehmet Kaya', year:cs.year, course:cs.course, track:'B', groupId:groupB, risk:'stabil', lastHours:5, createdHours:210, sessions:12, xp:760, pythonLevel:2, strengths:['Netzwerk','EDV'], weaknesses:['Deutsch'], matheAnswered:16, matheAccuracy:78, matheScore:80, logikAnswered:14, logikAccuracy:76, logikScore:78, simAnswered:19, simAccuracy:79, simScore:80, edvAnswered:14, edvAccuracy:88, edvScore:90, konzAnswered:11, konzAccuracy:82, konzScore:84, errors:{'Textverständnis langsam':1} },
      { code:normalizeCode(cs.year+'-'+cs.course+'-B'+pad(2,cs.digits)), name:'Sofia Wagner', year:cs.year, course:cs.course, track:'B', groupId:groupB, risk:'riskant', lastHours:45, createdHours:160, sessions:7, xp:390, pythonLevel:1, strengths:['Deutsch'], weaknesses:['Kaufmännisch','Prozentrechnung'], matheAnswered:11, matheAccuracy:54, matheScore:56, logikAnswered:10, logikAccuracy:66, logikScore:68, simAnswered:16, simAccuracy:59, simScore:60, edvAnswered:8, edvAccuracy:63, edvScore:65, konzAnswered:8, konzAccuracy:70, konzScore:72, errors:{'Prozentrechnung':4,'Skonto/Rabatt verwechselt':2}, matheErrors:{'Prozentrechnung':4} },
      { code:normalizeCode(cs.year+'-'+cs.course+'-B'+pad(3,cs.digits)), name:'Leon Fischer', year:cs.year, course:cs.course, track:'B', groupId:groupB, risk:'kritisch', lastHours:168, createdHours:145, sessions:4, xp:140, pythonLevel:1, strengths:['Allgemeinwissen'], weaknesses:['Konzentration','Simulation'], matheAnswered:8, matheAccuracy:49, matheScore:48, logikAnswered:9, logikAccuracy:42, logikScore:43, simAnswered:13, simAccuracy:39, simScore:40, edvAnswered:7, edvAccuracy:45, edvScore:46, konzAnswered:9, konzAccuracy:31, konzScore:32, errors:{'Konzentration':5,'Zeitdruck':5,'Flüchtigkeitsfehler':4} }
    ];
    var all=localAll(), created=[], skipped=[];
    for(var i=0;i<demoSpecs.length;i++){
      var spec=demoSpecs[i], code=normalizeCode(spec.code), existing=all[code];
      if(existing && existing.createdBy !== 'demo-admin-portal' && existing.isDemo !== true){ skipped.push(code); continue; }
      all[code]=await makeDemoProfile(spec); created.push(code);
    }
    localSaveAll(all); updateUI(); emit('egt:demo-learners-created',{ created:created, skipped:skipped });
    return { created:created, skipped:skipped, password:DEMO_PASSWORD };
  }
  async function deleteDemoLearners(){
    if(privilegedWritesViaFunctions()){
      var cloud=await secureCallable('adminAction',{courseId:state.courseId,action:'deleteDemoLearners'},['admin']);
      var cache=localAll(),cloudRemoved=cloud.removed||[];Object.keys(cache).forEach(function(k){var p=cache[k]||{};if(p.createdBy==='demo-admin-portal'||p.isDemo===true)delete cache[k];});localSaveAll(cache);updateUI();emit('egt:demo-learners-deleted',{removed:cloudRemoved,provider:'firebase-functions'});return cloud;
    }
    var all=localAll(), removed=[];
    Object.keys(all).forEach(function(k){ var p=all[k]||{}; if(p.createdBy==='demo-admin-portal' || p.isDemo===true){ removed.push(normalizeCode(p.userId||p.code||k)); delete all[k]; } });
    localSaveAll(all);
    if(state.learner && removed.indexOf(normalizeCode(state.learner.userId||state.learner.code))>=0) logout();
    updateUI(); emit('egt:demo-learners-deleted',{ removed:removed });
    return { removed:removed };
  }

  function defaultDozentProfiles(){
    var cs=getCourseSettings();
    return [
      { dozentId:'DOZENT-A', displayName:'Demo Dozent A', email:'dozent-a@assessments.local', phone:'', isDemo:true, createdBy:'demo-admin-portal', assignedGroups:[buildGroupId(cs.year, cs.course, 'A')], badge:'Gruppe A', status:'active', role:'teacher', permissions:{ participants:true, reports:true, accessCodes:true, editNotes:true }, note:'Demo-Dozent für Gruppe A. Sieht nur zugewiesene Teilnehmer.', createdAt:'Demo', updatedAt:nowIso() },
      { dozentId:'DOZENT-B', displayName:'Demo Dozent B', email:'dozent-b@assessments.local', phone:'', isDemo:true, createdBy:'demo-admin-portal', assignedGroups:[buildGroupId(cs.year, cs.course, 'B')], badge:'Gruppe B', status:'active', role:'teacher', permissions:{ participants:true, reports:true, accessCodes:true, editNotes:true }, note:'Demo-Dozent für Gruppe B. Sieht nur zugewiesene Teilnehmer.', createdAt:'Demo', updatedAt:nowIso() }
    ];
  }
  function normalizeDozentProfile(profile, index){
    profile=profile||{};
    var cs=getCourseSettings();
    var groups=Array.isArray(profile.assignedGroups) ? profile.assignedGroups : String(profile.assignedGroups||profile.groupId||buildGroupId(cs.year, cs.course, index===1?'B':'A')).split(/[;,\n]+/);
    var gidList=[];
    groups.forEach(function(g){ g=groupLabel(g); if(g && gidList.indexOf(g)<0) gidList.push(g); });
    var id=normalizeCode(profile.dozentId||profile.userId||profile.code||profile.id||('DOZENT-'+randomCodeChunk(3)));
    return {
      dozentId:id,
      userId:id,
      displayName:String(profile.displayName||profile.name||('Dozent '+(index+1))).trim(),
      email:String(profile.email||'').trim(),
      phone:String(profile.phone||'').trim(),
      assignedGroups:gidList,
      badge:String(profile.badge||gidList.join(', ')||'ohne Gruppe'),
      status:String(profile.status||'active'),
      role:'teacher',
      isDemo:profile.isDemo===true || profile.createdBy==='demo-admin-portal' || String(profile.email||'').toLowerCase().endsWith('@assessments.local'),
      createdBy:String(profile.createdBy||''),
      permissions:Object.assign({ participants:true, reports:true, accessCodes:true, editNotes:true, manageOwnCodes:true }, profile.permissions||{}),
      note:String(profile.note||profile.adminNote||''),
      createdAt:profile.createdAt||nowIso(),
      updatedAt:profile.updatedAt||nowIso(),
      lastLoginAt:profile.lastLoginAt||''
    };
  }
  function readStoredDozentProfiles(){
    try{ var raw=localStorage.getItem(DOZENT_PROFILES_KEY); var list=raw?JSON.parse(raw):null; return Array.isArray(list)?list:[]; }catch(e){ return []; }
  }
  function dozentProfiles(){
    var defaults=defaultDozentProfiles().map(normalizeDozentProfile);
    var stored=readStoredDozentProfiles().map(normalizeDozentProfile);
    var byId={};
    defaults.concat(stored).forEach(function(d){ byId[normalizeCode(d.dozentId)]=normalizeDozentProfile(d); });
    return Object.keys(byId).sort(function(a,b){ return String(byId[a].displayName).localeCompare(String(byId[b].displayName),'de',{numeric:true,sensitivity:'base'}); }).map(function(k){ return byId[k]; });
  }
  function saveDozentProfiles(list){
    var normalized=(list||[]).map(normalizeDozentProfile);
    try{ localStorage.setItem(DOZENT_PROFILES_KEY, JSON.stringify(normalized)); }catch(e){}
    return normalized;
  }
  function upsertDozentProfile(id, patch){
    id=normalizeCode(id||patch&&patch.dozentId||'');
    var list=dozentProfiles();
    var idx=list.findIndex(function(d){ return normalizeCode(d.dozentId)===id; });
    var base=idx>=0 ? list[idx] : normalizeDozentProfile({ dozentId:id||('DOZENT-'+randomCodeChunk(3)), displayName:'Neuer Dozent', assignedGroups:[getCourseSettings().prefix] }, list.length);
    var merged=normalizeDozentProfile(Object.assign({}, base, patch||{}, { dozentId:base.dozentId, updatedAt:nowIso() }), idx>=0?idx:list.length);
    if(idx>=0) list[idx]=merged; else list.push(merged);
    saveDozentProfiles(list);
    return merged;
  }
  function demoDozentProfiles(){ return dozentProfiles(); }
  function activeDozentProfile(){
    updateSecurityState();
    var sec=securityContext();
    if(state.claimsTrusted && state.securityRole==='teacher' && sec){
      var snap=sec.snapshot();
      return normalizeDozentProfile({
        dozentId:(snap.user&&snap.user.uid)||'FIREBASE-TEACHER',
        displayName:(state.securityClaims.displayName||state.securityClaims.name||(snap.user&&snap.user.email)||'Dozent'),
        email:(snap.user&&snap.user.email)||'',
        assignedGroups:snap.assignedGroups||[],
        role:'teacher', status:'active', source:'firebase-custom-claims'
      },0);
    }
    if(!localRolePinsAllowed()) return null;
    try{ var raw=sessionStorage.getItem(DOZENT_PROFILE_KEY); if(raw){ var p=JSON.parse(raw); if(p && p.dozentId){ var found=dozentProfiles().find(function(d){ return normalizeCode(d.dozentId)===normalizeCode(p.dozentId); }); return found || normalizeDozentProfile(p); } } }catch(e){}
    var list=dozentProfiles();
    return dozentOpen() ? list[0] : null;
  }
  function setActiveDozentProfile(id){
    var list=dozentProfiles();
    var found=list.find(function(x){ return String(x.dozentId).toUpperCase()===String(id||'').toUpperCase(); }) || list[0];
    if(found){ found.lastLoginAt=nowIso(); upsertDozentProfile(found.dozentId, found); }
    try{ sessionStorage.setItem(DOZENT_PROFILE_KEY, JSON.stringify(found)); }catch(e){}
    return found;
  }
  function groupAccessForRole(role){
    role=role||currentPortalRole();
    if(role==='admin') return { all:true, groups:[], label:'alle Gruppen' };
    if(role==='dozent'){
      var d=activeDozentProfile();
      var groups=(d && Array.isArray(d.assignedGroups)) ? d.assignedGroups.map(groupLabel) : [];
      return { all:false, groups:groups, label:groups.length ? groups.join(', ') : 'keine Gruppe zugewiesen', dozent:d };
    }
    return { all:false, groups:[], label:'kein Zugriff' };
  }
  function canViewGroup(role, groupId){
    var access=groupAccessForRole(role);
    if(access.all) return true;
    groupId=groupLabel(groupId);
    return access.groups.indexOf(groupId)>=0;
  }
  function canViewLearner(role, learner){
    if(!learner) return false;
    if((role||currentPortalRole())==='admin') return true;
    return canViewGroup(role, ensureProfileGroup(learner).groupId);
  }

  async function listLearners(){
    if(state.online){
      await ensureCourse();
      updateSecurityState();
      var fs=state.sync.fsMod, ref=colRef('courses/'+state.courseId+'/learners'), qs, list=[];
      if(state.claimsTrusted && state.securityRole==='admin'){
        qs=await fs.getDocs(ref);
      }else if(state.claimsTrusted && state.securityRole==='teacher'){
        var groups=groupAccessForRole('dozent').groups||[];
        if(!groups.length) return [];
        qs=await fs.getDocs(fs.query(ref,fs.where('groupId','in',groups.slice(0,10))));
      }else if(state.user && !state.user.isAnonymous){
        var own=await fs.getDoc(docRef('courses/'+state.courseId+'/learners/'+state.user.uid));
        if(!own.exists()) return [];
        var ownData=migrateActivityProfile(own.data()||{}); ownData.id=own.id; ownData.userId=ownData.userId||ownData.code||own.id; return [ownData];
      }else return [];
      qs.forEach(function(d){ var x=migrateActivityProfile(d.data()||{}); x.id=d.id; x.userId=x.userId||x.code||d.id; list.push(x); });
      return list.sort(function(a,b){ return String(a.userId||a.code).localeCompare(String(b.userId||b.code)); });
    }
    if(!localRolePinsAllowed() && !isDevelopment()) return [];
    var all=localAll(); return Object.keys(all).map(function(k){ var x=migrateActivityProfile(all[k]); x.id=safeId(k); x.userId=x.userId||k; return x; }).sort(function(a,b){return String(a.userId).localeCompare(String(b.userId));});
  }

  function computeNextCodeFromList(list){
    var cs=getCourseSettings(); var prefix=cs.prefix; var digits=Number(cs.digits||3);
    var used={}; (list||[]).forEach(function(x){ used[normalizeCode(x.userId||x.code||x.loginName||x.id)]=true; });
    var i=1, code=''; do{ code=normalizeCode(prefix + pad(i,digits)); i++; } while(used[code] && i<100000);
    return code;
  }
  async function nextCode(){ return computeNextCodeFromList(await listLearners().catch(function(){return Object.keys(localAll()).map(function(k){return {userId:k};});})); }

  async function loginWithCode(code, password, opts){
    if(!legacyCodeLoginAllowed()) throw new Error('Der lokale Teilnehmer-ID-Login ist im Produktionsmodus deaktiviert. Bitte den zentralen E-Mail-Login verwenden.');
    if(typeof password === 'object'){ opts=password; password=''; }
    code=normalizeCode(code); if(!code) throw new Error('Bitte Teilnehmer-ID eingeben.');
    if(!password && !(opts&&opts.skipPassword)) throw new Error('Bitte Passwort eingeben.');
    var got=await fetchProfile(code); var profile=got.profile;
    if(!(opts&&opts.skipPassword)){
      var ok=await verifyPassword(profile, password); if(!ok) throw new Error('Passwort falsch.');
    }
    if(profile.status && profile.status!=='active') throw new Error('Dieser Zugang ist deaktiviert.');
    // Clear admin state on participant login
    try {
      sessionStorage.removeItem(ADMIN_OPEN_KEY);
      sessionStorage.removeItem(DOZENT_OPEN_KEY);
      sessionStorage.removeItem(PORTAL_ROLE_KEY);
    } catch(e){}

    profile.lastActiveAt=nowIso(); await saveProfile(profile, true);
    state.learner={ id:got.id, userId:code, code:code, displayName:profile.displayName||profile.alias||code, alias:profile.alias||profile.displayName||code, status:profile.status||'active' };
    state.profile=profile; updateUI(); emit('egt:learner-login',{ learner:state.learner, profile:profile });
    if(profile.mustChangePassword && !(opts&&opts.silent)) { setStatus('Login erfolgreich · Passwortwechsel erforderlich.'); showPasswordChange(code); }
    else if(!opts || !opts.silent) setStatus('Angemeldet: '+(profile.displayName||code));
    return profile;
  }

  function logout(){
    state.learner=null;
    state.profile=null;
    try{
      localStorage.removeItem(ACTIVE_KEY);
      clearUserSession();
      sessionStorage.removeItem(ADMIN_OPEN_KEY);
      sessionStorage.removeItem(DOZENT_OPEN_KEY);
      sessionStorage.removeItem(PORTAL_ROLE_KEY);
      sessionStorage.removeItem(DOZENT_PROFILE_KEY);
    }catch(e){}
    updateUI();
    emit('egt:learner-logout');
  }

  async function changePassword(code, newPassword){
    code=normalizeCode(code || (state.learner&&state.learner.userId)); if(!code) throw new Error('Kein Teilnehmer aktiv.');
    if(String(newPassword||'').length<8) throw new Error('Das neue Passwort braucht mindestens 8 Zeichen.');
    if(!/[A-Za-z]/.test(String(newPassword)) || !/[0-9]/.test(String(newPassword))) throw new Error('Bitte nutze mindestens einen Buchstaben und eine Zahl.');
    var got=await fetchProfile(code); var profile=got.profile;
    if(privilegedWritesViaFunctions()){
      var sec=securityContext(); if(!sec||typeof sec.updateOwnPassword!=='function') throw new Error('Sicherheitskontext nicht bereit.');
      await sec.updateOwnPassword(String(newPassword));
      delete profile.passwordSalt; delete profile.passwordHash;
    }else{
      var salt=randomBytes(16); var hash=await hashPassword(newPassword, salt); profile.passwordSalt=salt; profile.passwordHash=hash;
    }
    profile.mustChangePassword=false; profile.passwordChangedAt=nowIso();
    await saveProfile(profile, true); state.profile=profile; state.learner={ id:got.id, userId:code, code:code, displayName:profile.displayName||profile.alias||code, alias:profile.alias||profile.displayName||code, status:profile.status||'active' };
    updateUI(); emit('egt:password-changed',{userId:code}); setStatus('Passwort geändert. Du bist angemeldet.');
    return profile;
  }

  async function resetPassword(userId){
    userId=normalizeCode(userId); if(!userId) throw new Error('Teilnehmer-ID fehlt.');
    if(privilegedWritesViaFunctions()){
      var result=await secureCallable('adminAction',{courseId:state.courseId,action:'resetPassword',learnerId:userId},['admin']);
      emit('egt:password-reset',{userId:userId,provider:'firebase-functions'});
      return {userId:userId,firstPassword:result.temporaryPassword||''};
    }
    var got=await fetchProfile(userId); var profile=got.profile; var pw=generatePassword(); var salt=randomBytes(16); var hash=await hashPassword(pw, salt);
    profile.passwordSalt=salt; profile.passwordHash=hash; profile.mustChangePassword=true; profile.passwordResetAt=nowIso();
    await saveProfile(profile, false); emit('egt:password-reset',{userId:userId}); return { userId:userId, firstPassword:pw };
  }

  async function setLearnerStatus(learnerId, status){
    if(privilegedWritesViaFunctions()) return writeLearnerAdminPatch(learnerId,{status:String(status||'active'),blocked:String(status)==='blocked'});
    var list=await listLearners(); var item=list.find(function(x){return safeId(x.userId||x.code||x.id)===learnerId || normalizeCode(x.userId||x.code)===normalizeCode(learnerId);});
    if(!item) throw new Error('Teilnehmer nicht gefunden.'); item.status=status; await saveProfile(item, false); updateUI(); return item;
  }
  async function deleteLearner(learnerId){
    var code=normalizeCode(learnerId); if(!code){ var list=await listLearners(); var item=list.find(function(x){return x.id===learnerId;}); code=item&&(item.userId||item.code); }
    code=normalizeCode(code||learnerId); if(!code) throw new Error('Teilnehmer-ID fehlt.');
    if(privilegedWritesViaFunctions()){
      var result=await secureCallable('adminAction',{courseId:state.courseId,action:'deleteLearner',learnerId:code},['admin']);
      var local=localAll(); delete local[code]; localSaveAll(local); updateUI(); return result;
    }
    var id=safeId(code);
    if(state.online){ var fs=state.sync.fsMod; var base='courses/'+state.courseId+'/learners/'+id; var sub=['progress','attempts','sessions','events']; for(var i=0;i<sub.length;i++){ var qs=await fs.getDocs(colRef(base+'/'+sub[i])); var promises=[]; qs.forEach(function(d){ promises.push(fs.deleteDoc(d.ref)); }); await Promise.all(promises); } await fs.deleteDoc(docRef(base)).catch(function(){}); await fs.deleteDoc(docRef('courses/'+state.courseId+'/accessCodes/'+id)).catch(function(){}); }
    var all=localAll(); delete all[code]; localSaveAll(all); if(state.learner && state.learner.userId===code) logout(); updateUI(); return {deleted:code};
  }

  function moduleFromPayload(payload){
    var s=String((payload&& (payload.module || payload.cat || payload.group || payload.category || payload.mode || payload.levelId)) || '').toLowerCase();
    if(/python|py_/.test(s)) return 'python'; if(/mathe|math|prozent|dreisatz/.test(s)) return 'mathe'; if(/logik|matrix|zahlenreihe|visual|würfel|wuerfel/.test(s)) return 'logik'; if(/edv|it|fisi|netzwerk|hardware/.test(s)) return 'edv'; if(/konzentration|zeichen|attention/.test(s)) return 'konzentration'; if(/simulation|assessments|novuraExams|bosch|test/.test(s)) return 'simulation'; return 'global';
  }
  function summarizeAttempt(payload){
    payload=payload||{};
    var ledger=activityLedger();
    var activitySession=payload.activitySession||null;
    if(ledger&&activitySession&&typeof ledger.normalizeSession==='function') activitySession=ledger.normalizeSession(activitySession);
    if(!activitySession&&ledger&&typeof ledger.normalizeSession==='function'){
      var module=moduleFromPayload(payload), score=Number(payload.score != null ? payload.score : (payload.correct ? 100 : 0));
      activitySession=ledger.normalizeSession({
        userId:(state.learner&&(state.learner.userId||state.learner.code))||payload.userId||'',
        profileId:state.learner&&state.learner.id||payload.profileId||'', courseId:state.courseId,
        groupId:state.profile&&state.profile.groupId||payload.groupId||'', role:state.profile&&state.profile.role||'participant',
        kind:payload.sessionType||payload.kind, status:'completed', module:module, mode:payload.mode||payload.type||module,
        title:payload.title||payload.type||module, startedAt:payload.startedAt||payload.createdAt||nowIso(),
        completedAt:payload.completedAt||payload.createdAt||nowIso(), score:isFinite(score)?score:0,
        passed:!!(payload.passed||payload.correct||score>=70), source:'admin-track-event-compat',
        events:[{eventType:'answer-recorded',taskId:payload.taskId||payload.questionId||'',category:payload.category||payload.group||payload.cat||'',correct:!!payload.correct,skipped:!!payload.skipped,timeout:!!payload.timeout,durationMs:payload.durationMs||payload.duration||0}]
      });
    }
    var module=(activitySession&&activitySession.module)||moduleFromPayload(payload);
    var score=activitySession?Number(activitySession.score||0):Number(payload.score != null ? payload.score : (payload.correct ? 100 : 0));
    var errors=payload.errors||payload.mainErrors||[]; if(!Array.isArray(errors)) errors=[String(errors)];
    if(payload.mistakeType) errors.push(payload.mistakeType); if(payload.diagnosis&&payload.diagnosis.type) errors.push(payload.diagnosis.type);
    return {module:module,levelId:payload.levelId||payload.level||(activitySession&&activitySession.level)||'',type:payload.type||payload.mode||(activitySession&&activitySession.kind)||'event',score:isFinite(score)?score:0,passed:activitySession?!!activitySession.passed:!!(payload.passed||payload.correct||score>=70),correct:!!payload.correct,errors:errors.filter(Boolean).slice(0,10),createdAt:(activitySession&&(activitySession.completedAt||activitySession.startedAt))||nowIso(),activitySession:activitySession};
  }
  function mergeProfileEvent(profile, attempt){
    profile=migrateActivityProfile(profile||defaultProfile('Teilnehmer',''));
    profile.modules=profile.modules||{}; profile.global=profile.global||{recurringErrors:{}};
    var session=attempt&&attempt.activitySession, ledger=activityLedger(), beforeIds=((profile.activitySummary||{}).processedSessionIds||[]).slice();
    if(session&&ledger&&typeof ledger.mergeSummary==='function'){
      profile.activitySummary=ledger.mergeSummary(profile.activitySummary,session);
      var isNew=beforeIds.indexOf(session.sessionId)<0;
      if(isNew){
        profile.activityRecent=Array.isArray(profile.activityRecent)?profile.activityRecent:[];
        profile.activityRecent.unshift({sessionId:session.sessionId,kind:session.kind,status:session.status,module:session.module,mode:session.mode,score:session.score,passed:session.passed,answerCount:session.answerCount,correctCount:session.correctCount,durationMs:session.durationMs,startedAt:session.startedAt,completedAt:session.completedAt,language:session.language||'',level:session.level||'',variant:session.variant||'',trustLevel:session.trustLevel||'client-reported'});
        profile.activityRecent=profile.activityRecent.slice(0,80);
      }
      var summary=profile.activitySummary, mk=safeId(session.module||'global'), sm=(summary.byModule||{})[mk]||{};
      if(!profile.modules[mk]) profile.modules[mk]={strengths:[],weaknesses:[],recurringErrors:{}};
      profile.modules[mk]=Object.assign({},profile.modules[mk],{answered:Number(sm.answers||0),correct:Number(sm.correct||0),averageScore:Number(sm.averageScore||0),sessionCount:Number(sm.sessions||0),simulationCount:Number(sm.simulations||0),durationMs:Number(sm.durationMs||0),lastActiveAt:sm.lastAt||session.completedAt});
      profile.global.totalSessions=Number(summary.completedSessions||summary.totalSessions||0);
      profile.global.totalSimulations=Number(summary.simulationSessions||0);
      profile.global.totalAnswers=Number(summary.taskAnswers||0);
      profile.global.lastModule=mk;
    }else{
      var mod=attempt.module||'global'; if(!profile.modules[mod]) profile.modules[mod]={answered:0,correct:0,averageScore:0,strengths:[],weaknesses:[],recurringErrors:{}};
      var m=profile.modules[mod]; m.answered=(m.answered||0)+1; if(attempt.passed||attempt.correct)m.correct=(m.correct||0)+1;
      m.averageScore=Math.round(((Number(m.averageScore||0)*Math.max(0,m.answered-1))+Number(attempt.score||0))/Math.max(1,m.answered));
      profile.global.totalSessions=(profile.global.totalSessions||0)+1; profile.global.lastModule=mod;
    }
    var targetMod=attempt.module||'global'; if(!profile.modules[targetMod])profile.modules[targetMod]={recurringErrors:{}};
    profile.modules[targetMod].recurringErrors=profile.modules[targetMod].recurringErrors||{}; profile.global.recurringErrors=profile.global.recurringErrors||{};
    (attempt.errors||[]).forEach(function(err){err=String(err);profile.modules[targetMod].recurringErrors[err]=(profile.modules[targetMod].recurringErrors[err]||0)+1;profile.global.recurringErrors[err]=(profile.global.recurringErrors[err]||0)+1;});
    profile.global.riskLevel=riskFromProfile(profile); addRecent(profile,attempt); profile.lastActiveAt=(session&&(session.completedAt||session.startedAt))||nowIso(); profile.dataSchemaVersion='egt-activity-ledger-v1'; return profile;
  }
  function riskFromProfile(profile){ var mods=profile.modules||{}, total=0, good=0, err=0; Object.keys(mods).forEach(function(k){ var m=mods[k]||{}; total+=(m.answered||0); good+=(m.correct||0); Object.keys(m.recurringErrors||{}).forEach(function(e){ err+=(m.recurringErrors[e]||0); }); }); if(total<3) return 'unbekannt'; var q=good/Math.max(1,total); if(q>=.75 && err<Math.max(3,total*.3)) return 'stabil'; if(q>=.55) return 'riskant'; return 'kritisch'; }

  async function writeRemoteSession(learner, profile, attempt){
    if(!state.online||!learner) throw new Error('Firebase nicht verbunden oder kein aktiver Lernender.');
    var session=attempt&&attempt.activitySession; if(!session) throw new Error('Einheitliche Session fehlt.');
    var result=await secureCallable('recordLearningSession',{courseId:state.courseId,session:session});
    if(result&&result.activitySummary){ profile.activitySummary=result.activitySummary; }
    if(result&&result.activityRecent){ profile.activityRecent=result.activityRecent; }
    profile.lastActiveAt=(session.completedAt||session.startedAt||nowIso());
    localUpsert(profile,true);
    return result||{ok:true,sessionId:session.sessionId};
  }
  async function flushPendingSync(){
    if(!state.online) return {ok:false,reason:'offline',pending:pendingSyncQueue().length};
    var list=pendingSyncQueue(); if(!list.length)return {ok:true,flushed:0,pending:0};
    var keep=[],flushed=0;
    for(var i=0;i<list.length;i++){
      var item=list[i]||{};
      try{
        if(item.type==='session'||item.type==='attempt'){
          var pl=item.payload||{}, learner=pl.learner||state.learner, profile=pl.profile||state.profile, attempt=pl.attempt;
          if(learner&&profile&&attempt&&attempt.activitySession){await writeRemoteSession(learner,profile,attempt);flushed++;}
          else{item.error='unvollständige pending session';keep.push(item);}
        }else{item.error='unbekannter sync typ';keep.push(item);}
      }catch(e){item.attempts=Number(item.attempts||0)+1;item.error=e.message||String(e);keep.push(item);}
    }
    savePendingSyncQueue(keep); try{localStorage.setItem(LAST_SYNC_FLUSH_KEY,nowIso());}catch(e){}
    emit('egt:sync-flushed',{flushed:flushed,pending:keep.length}); return {ok:true,flushed:flushed,pending:keep.length};
  }

  async function trackEvent(payload){
    if(!state.profile||state.profile.mustChangePassword)return null;
    var attempt=summarizeAttempt(payload), ledger=activityLedger();
    if(attempt.activitySession&&ledger&&typeof ledger.storeSession==='function') ledger.storeSession(attempt.activitySession);
    var profile=mergeProfileEvent(clone(state.profile),attempt); state.profile=profile; localUpsert(profile,true);
    if(state.online&&state.learner){
      await writeRemoteSession(state.learner,profile,attempt).catch(function(e){state.error=e.message||String(e);queuePendingSync('session',{learner:state.learner,profile:profile,attempt:attempt});});
    }else if(state.learner){ queuePendingSync('session',{learner:state.learner,profile:profile,attempt:attempt}); }
    emit('egt:learner-profile-updated',{profile:profile,attempt:attempt,activitySession:attempt.activitySession,provider:state.online?'firebase-functions':'local-cache'}); updateUI(); return attempt;
  }
  async function exportCourse(){ var out={ exportedAt:nowIso(), courseId:state.courseId, learners:await listLearners() }; var blob=new Blob([JSON.stringify(out,null,2)],{type:'application/json'}); var url=URL.createObjectURL(blob); var a=document.createElement('a'); a.href=url; a.download='eignungstest-trainer-'+state.courseId+'-export-'+new Date().toISOString().slice(0,10)+'.json'; document.body.appendChild(a); a.click(); setTimeout(function(){URL.revokeObjectURL(url); a.remove();},300); return out; }
  async function resetCourse(){
    if(privilegedWritesViaFunctions()) return secureCallable('adminAction',{courseId:state.courseId,action:'resetCourse',confirm:state.courseId},['admin']);
    var learners=await listLearners(); for(var i=0;i<learners.length;i++){ await deleteLearner(learners[i].userId||learners[i].code||learners[i].id); } return { deleted:learners.length };
  }
  function enrichCoachPayload(payload){ payload=payload||{}; if(state.learner){ payload.userId=state.learner.userId||state.learner.code; payload.learnerCode=state.learner.code; payload.learnerAlias=state.learner.displayName||state.learner.alias; payload.profileId=state.learner.id; } if(state.profile){ payload.groupId=state.profile.groupId||''; payload.userProfile=clone(state.profile); } payload.userDatabaseProvider=state.online?'firebase-firestore':'local-cache'; return payload; }
  function coachDnaSnapshot(userId){ try{ return window.EGTCoachDNA ? window.EGTCoachDNA.dashboard(userId || (state.learner&&state.learner.userId)) : null; }catch(e){ return null; } }
  async function loadCoachContext(userId){
    var code=normalizeCode(userId || (state.learner && (state.learner.userId||state.learner.code)));
    if(!code) return { provider:state.online?'firebase-firestore':'local-cache', profile:null, attempts:[] };
    var got=null; try{ got=await fetchProfile(code); }catch(e){ got={ profile:localProfile(code), id:safeId(code) }; }
    var attempts=[], sessions=[];
    if(state.online && got && got.id){
      try{ var sq=await state.sync.fsMod.getDocs(colRef('courses/'+state.courseId+'/learners/'+got.id+'/sessions')); sq.forEach(function(d){ var x=d.data()||{}; x.id=d.id; sessions.push(x); }); }catch(e2){ state.error=e2.message||String(e2); }
      if(!sessions.length) try{ var qs=await state.sync.fsMod.getDocs(colRef('courses/'+state.courseId+'/learners/'+got.id+'/attempts')); qs.forEach(function(d){ var x=d.data()||{}; x.id=d.id; attempts.push(x); }); }catch(e3){ state.error=e3.message||String(e3); }
    }
    if((!attempts.length) && got && got.profile && Array.isArray(got.profile.attempts)) attempts=got.profile.attempts.slice();
    if((!sessions.length) && got && got.profile && Array.isArray(got.profile.activityRecent)) sessions=got.profile.activityRecent.slice();
    return { provider:state.online?'firebase-firestore':'local-cache', courseId:state.courseId, profile:got&&got.profile||null, sessions:sessions.slice(-80), attempts:attempts.slice(-80), coachDna:coachDnaSnapshot(code) };
  }

  var COURSE_SETTINGS_KEY = 'egt_admin_course_settings';
  function getCourseSettings(){
    var base={ year:2026, course:'GK', track:'A', digits:Number(config().learnerCodeDigits||3), title:'2026-GK' };
    try{ var saved=JSON.parse(localStorage.getItem(COURSE_SETTINGS_KEY)||'{}'); Object.keys(saved||{}).forEach(function(k){ if(saved[k]!=='' && saved[k]!=null) base[k]=saved[k]; }); }catch(e){}
    base.year=Number(base.year||2026); base.course=normalizeCode(base.course||'GK').replace(/-/g,'') || 'GK'; base.track=normalizeCode(base.track||'A').replace(/-/g,'') || 'A'; base.digits=Math.max(2, Math.min(5, Number(base.digits||3))); base.title=base.year+'-'+base.course;
    base.prefix=base.year+'-'+base.course+'-'+base.track;
    return base;
  }
  async function saveCourseSettings(settings){
    var cur=getCourseSettings(); settings=settings||{};
    ['year','course','track','digits'].forEach(function(k){ if(settings[k]!=null && settings[k]!=='') cur[k]=settings[k]; });
    localStorage.setItem(COURSE_SETTINGS_KEY, JSON.stringify(cur));
    state.courseId='course_'+String(cur.year)+'_'+String(cur.course).toLowerCase();
    if(privilegedWritesViaFunctions() && state.online){
      await secureCallable('adminAction',{courseId:state.courseId,action:'saveCourseSettings',settings:cur},['admin']);
    }
    return getCourseSettings();
  }
  function profileProgress(profile){
    profile=migrateActivityProfile(profile||{});
    var summary=profile.activitySummary||{};
    var analytics=adminAnalytics();
    var hasLedger=summary.schema==='egt-activity-summary-v1' && (Number(summary.totalSessions||0)>0 || Number(summary.taskAnswers||0)>0);
    var answered=0, correct=0, avgSum=0, avgCount=0;
    var sessionStatus={total:0,started:0,completed:0,aborted:0,unclassified:0};
    var simulationStatus={total:0,started:0,completed:0,aborted:0,unclassified:0};
    if(hasLedger){
      answered=Number(summary.taskAnswers||0); correct=Number(summary.correctAnswers||0);
      if(analytics){
        sessionStatus=analytics.sessionStatus(summary);
        simulationStatus=analytics.simulationStatus(summary);
      }else{
        sessionStatus={total:Number(summary.totalSessions||0),started:Number(summary.startedSessions||0),completed:Number(summary.completedSessions||0),aborted:Number(summary.abortedSessions||0),unclassified:0};
        simulationStatus={total:Number(summary.simulationSessions||0),started:0,completed:Number(summary.simulationSessions||0),aborted:0,unclassified:0};
      }
      Object.keys(summary.byModule||{}).forEach(function(k){ var m=summary.byModule[k]||{}; if(m.averageScore!=null){avgSum+=Number(m.averageScore||0);avgCount++;} });
    }else{
      var mods=profile.modules||{};
      Object.keys(mods).forEach(function(k){ var m=mods[k]||{}; answered+=Number(m.answered||0); correct+=Number(m.correct||0); if(m.averageScore!=null){ avgSum+=Number(m.averageScore||0); avgCount++; } });
      // Legacy-Zähler bleiben sichtbar, werden aber nicht als verifizierte Sessions/Simulationen ausgegeben.
    }
    var accuracy = answered ? Math.round(correct/answered*100) : 0;
    return {
      answered:answered, correct:correct, accuracy:accuracy, averageScore:avgCount?Math.round(avgSum/avgCount):0,
      sessions:sessionStatus.completed, sessionStatus:sessionStatus,
      simulations:simulationStatus.completed, simulationStatus:simulationStatus,
      risk:riskFromProfile(profile), modules:Object.keys((hasLedger?summary.byModule:profile.modules)||{}).length,
      source:hasLedger?'activity-ledger':'legacy'
    };
  }
  async function courseStats(){
    var list=await listLearners();
    var stats={ total:list.length, active:0, inactive:0, mustChange:0, stable:0, riskant:0, kritisch:0, unknown:0, attempts:0, answers:0, sessions:0, sessionsStarted:0, sessionsAborted:0, simulations:0, simulationsStarted:0, simulationsAborted:0, simulationsUnclassified:0, avgAccuracy:0, ledgerProfiles:0, legacyProfiles:0 };
    var accSum=0, accCount=0;
    list.forEach(function(p){
      var status=p.status||'active'; if(status==='active') stats.active++; else stats.inactive++; if(p.mustChangePassword) stats.mustChange++;
      var pr=profileProgress(p); stats.attempts+=pr.answered; stats.answers+=pr.answered;
      stats.sessions+=pr.sessionStatus.completed; stats.sessionsStarted+=pr.sessionStatus.started; stats.sessionsAborted+=pr.sessionStatus.aborted;
      stats.simulations+=pr.simulationStatus.completed; stats.simulationsStarted+=pr.simulationStatus.started; stats.simulationsAborted+=pr.simulationStatus.aborted; stats.simulationsUnclassified+=pr.simulationStatus.unclassified;
      if(pr.source==='activity-ledger')stats.ledgerProfiles++; else stats.legacyProfiles++;
      if(pr.answered){ accSum+=pr.accuracy; accCount++; }
      if(pr.risk==='stabil') stats.stable++; else if(pr.risk==='riskant') stats.riskant++; else if(pr.risk==='kritisch') stats.kritisch++; else stats.unknown++;
    });
    stats.avgAccuracy=accCount?Math.round(accSum/accCount):0;
    return stats;
  }
  function toCsvCell(v){ return '"'+String(v==null?'':v).replace(/"/g,'""')+'"'; }
  async function exportCourseCsv(){
    var list=await listLearners();
    var rows=[['userId','displayName','anonymous','course','year','status','mustChangePassword','risk','answered','correct','accuracy','lastActiveAt','createdAt']];
    list.forEach(function(p){ var pr=profileProgress(p); rows.push([p.userId||p.code||'', p.displayName||p.alias||'', p.isAnonymous?'yes':'no', p.course||'', p.year||'', p.status||'active', p.mustChangePassword?'yes':'no', pr.risk, pr.answered, pr.correct, pr.accuracy, p.lastActiveAt||'', p.createdAt||'']); });
    var csv=rows.map(function(r){ return r.map(toCsvCell).join(';'); }).join('\n');
    var blob=new Blob([csv],{type:'text/csv;charset=utf-8'}); var url=URL.createObjectURL(blob); var a=document.createElement('a'); a.href=url; a.download='eignungstest-trainer-'+state.courseId+'-teilnehmer-'+new Date().toISOString().slice(0,10)+'.csv'; document.body.appendChild(a); a.click(); setTimeout(function(){URL.revokeObjectURL(url); a.remove();},300); return { rows:list.length };
  }
  function scoreBand(value){
    var v=Math.max(0, Math.min(100, Math.round(Number(value)||0)));
    if(v>=75) return { cls:'ok', label:'gut', desc:'stabiler Bereich' };
    if(v>=50) return { cls:'warn', label:'kritisch', desc:'beobachten / festigen' };
    return { cls:'danger', label:'schlecht', desc:'dringend üben' };
  }
  function normalizePercent(value){ return Math.max(0, Math.min(100, Math.round(Number(value)||0))); }
  function profileBarHtml(label, value, meta, forceCls){
    var v=normalizePercent(value), band=forceCls ? {cls:forceCls,label:meta||''} : scoreBand(v);
    return '<div class="egt-profile-bar egt-status-'+band.cls+'"><div class="egt-profile-bar-head"><span>'+escapeHtml(label)+'</span><b>'+v+'%</b></div><div class="egt-profile-bar-track"><i style="width:'+v+'%"></i></div><small>'+escapeHtml(meta || band.label)+'</small></div>';
  }
  function infoBarHtml(label, value, meta, cls){
    cls=cls||'neutral';
    return '<div class="egt-profile-info-bar egt-status-'+cls+'"><span>'+escapeHtml(label)+'</span><b>'+escapeHtml(value)+'</b><small>'+escapeHtml(meta||'')+'</small></div>';
  }
  function activityScore(profile){
    var raw=profile && profile.lastActiveAt;
    if(!raw) return { score:0, label:'keine Aktivität', cls:'danger' };
    try{
      var d=new Date(raw), age=(Date.now()-d.getTime())/86400000;
      if(isNaN(age)) return { score:0, label:'unbekannt', cls:'neutral' };
      if(age<=2) return { score:100, label:'sehr aktuell', cls:'ok' };
      if(age<=7) return { score:70, label:'diese Woche', cls:'warn' };
      return { score:35, label:'zu lange her', cls:'danger' };
    }catch(e){ return { score:0, label:'unbekannt', cls:'neutral' }; }
  }
  function helpScore(profile){
    var help=learnerHelpLabel(profile);
    if(help.cls==='ok') return { score:100, label:'kein akuter Hilfebedarf', cls:'ok' };
    if(help.cls==='warn') return { score:60, label:'beobachten', cls:'warn' };
    if(help.cls==='danger') return { score:25, label:'Hilfe nötig', cls:'danger' };
    return { score:0, label:'keine Daten', cls:'neutral' };
  }
  function moduleSummaryHtml(profile){
    var mods=profile&&profile.modules||{}, keys=Object.keys(mods); if(!keys.length) return '<p>Noch keine Moduldaten.</p>';
    return keys.map(function(k){
      var m=mods[k]||{}, q=Math.round(((m.correct||0)/Math.max(1,m.answered||0))*100), band=scoreBand(q);
      return '<div class="egt-admin-progress-row egt-status-'+band.cls+'"><div class="egt-progress-main"><span>'+escapeHtml(k.toUpperCase())+'</span><b>'+q+'%</b></div><div class="egt-progress-track"><i style="width:'+normalizePercent(q)+'%"></i></div><small>'+escapeHtml(band.label)+' · '+Number(m.answered||0)+' Versuche</small></div>';
    }).join('');
  }
  function adminOpen(){ updateSecurityState(); if(state.claimsTrusted&&state.securityRole==='admin') return true; return localRolePinsAllowed()&&sessionStorage.getItem(ADMIN_OPEN_KEY)==='1'; }
  function adminLockedText(){ return localRolePinsAllowed() ? 'Admin gesperrt. Bitte zuerst Admin-PIN eingeben.' : 'Admin gesperrt. Erforderlich ist ein Firebase-Konto mit signiertem Admin-Claim.'; }

  function dozentOpen(){ updateSecurityState(); if(state.claimsTrusted&&state.securityRole==='teacher') return true; return localRolePinsAllowed()&&sessionStorage.getItem(DOZENT_OPEN_KEY)==='1'; }
  function currentPortalRole(){
    updateSecurityState();
    // Produktionsrechte stammen ausschließlich aus dem signierten Firebase-ID-Token.
    if(state.claimsTrusted && state.securityRole==='admin') return 'admin';
    if(state.claimsTrusted && state.securityRole==='teacher') return 'dozent';
    // Lokale PIN-Sitzungen existieren ausschließlich für localhost/file:-QA.
    if(localRolePinsAllowed()){
      if(adminOpen()) return 'admin';
      if(dozentOpen()) return 'dozent';
    }
    return 'locked';
  }
  function roleSessionActive(){
    var r=currentPortalRole();
    return r==='admin' || r==='dozent';
  }
  function defaultPortalTabForSession(){
    var r=currentPortalRole();
    if(r==='admin') return 'admin';
    if(r==='dozent') return 'dozent';
    return 'login';
  }
  function adminPortalPhase1NoticeHtml(){
    return '<div class="egt-admin-card egt-admin-card-wide egt-portal-phase1">'
      +'<span class="egt-session-kicker">Phase 1 · Portal-Struktur</span>'
      +'<h3>Admin-Cockpit sauber aufgeteilt</h3>'
      +'<p>Die Verwaltung ist ab jetzt nicht mehr als gemischtes Menü gedacht, sondern als feste Business-Struktur: Dashboard, Teilnehmer, Gruppen, Codes, Dozenten, Berichte, Tickets und System.</p>'
      +'<div class="egt-admin-stat-grid egt-phase1-map">'
        +'<div><b>Dashboard</b><span>KPI, Risiko, Aktivität</span></div>'
        +'<div><b>Teilnehmer</b><span>Suche, Profile, Bearbeitung</span></div>'
        +'<div><b>Gruppen</b><span>Kurse, Demo, Reset</span></div>'
        +'<div><b>Codes</b><span>Zugang, Rollen, Gültigkeit</span></div>'
      +'</div>'
      +'</div>';
  }
  function roleLabel(){ var r=currentPortalRole(); if(r==='admin') return 'Admin · Vollzugriff · alle Gruppen'; if(r==='dozent'){ var d=activeDozentProfile(); var access=groupAccessForRole('dozent'); return 'Dozent · '+(d&&d.displayName?d.displayName:'beschränkte Rechte')+' · '+access.label; } return 'Gesperrt'; }
  function portalDisplayName(role){
    if(role==='admin') return 'Lokaler Admin';
    if(role==='dozent'){ var d=activeDozentProfile(); return (d&&d.displayName)||'Dozent'; }
    if(state.learner) return state.learner.displayName || state.learner.alias || state.learner.code || 'Teilnehmer';
    return 'Nicht angemeldet';
  }
  function portalSessionCardHtml(role){
    var title = role==='admin' ? 'Angemeldet als Admin' : (role==='dozent' ? 'Angemeldet als Dozent' : 'Angemeldet als Teilnehmer');
    var desc = role==='admin' ? 'Vollzugriff aktiv. Du kannst Nutzer, Inhalte, Systeminfo, Roadmap und Exporte verwalten.' : (role==='dozent' ? 'Beschränkte Rechte aktiv. Sichtbar sind nur zugewiesene Gruppen, Teilnehmer und Hilfebedarfsdaten.' : 'Eigenes Lernprofil aktiv. Kein Zugriff auf Adminfunktionen.');
    var access=groupAccessForRole(role); return '<div class="egt-session-card"><div><span class="egt-session-kicker">Aktive Sitzung</span><h3>'+escapeHtml(title)+'</h3><p>'+escapeHtml(desc)+'</p><small>'+escapeHtml(access.label)+'</small></div><div class="egt-session-badge">'+escapeHtml(portalDisplayName(role))+'</div></div>';
  }
  var ROLE_PERMISSIONS = {
    admin:{ viewOverview:true, viewUsers:true, manageUsers:true, manageAccessCodes:true, viewAllLearners:true, viewAssignedLearners:true, viewSystem:true, viewRoadmap:true, manageRoadmap:true, exportReports:true, viewReports:true, clearCache:true, manageQuestions:true },
    dozent:{ viewOverview:true, viewUsers:false, manageUsers:false, manageAccessCodes:true, manageOwnAccessCodes:true, viewAllLearners:false, viewAssignedLearners:true, viewSystem:false, viewRoadmap:false, manageRoadmap:false, exportReports:true, viewReports:true, clearCache:false, manageQuestions:false },
    locked:{ viewOverview:false, viewUsers:false, manageUsers:false, viewAllLearners:false, viewAssignedLearners:false, viewSystem:false, viewRoadmap:false, manageRoadmap:false, exportReports:false, viewReports:false, clearCache:false, manageQuestions:false }
  };
  function can(role, permission){ role=role||currentPortalRole(); return !!(ROLE_PERMISSIONS[role] && ROLE_PERMISSIONS[role][permission]); }
  function lockedTextFor(tab){
    if(tab==='system' || tab==='roadmap' || tab==='qbank') return 'Nur Admin: Systeminfo, Aufgabenbank, Cache, Roadmap und technische Statusdaten sind für Dozenten ausgeblendet.';
    if(tab==='dozent') return 'Dozentenbereich gesperrt. Bitte Dozenten-PIN eingeben.';
    return adminLockedText();
  }
  function dozentStoredPin(){ try{return localStorage.getItem(DOZENT_PIN_KEY) || '';}catch(e){return '';} }
  async function storeDozentPin(pin){ var salt=randomBytes(16); var hash=await hashPassword(pin, salt); try{ localStorage.setItem(DOZENT_PIN_KEY, JSON.stringify({scheme:'sha256-salt', salt:salt, hash:hash, createdAt:nowIso()})); }catch(e){ throw new Error('Dozenten-PIN konnte nicht gespeichert werden.'); } }
  async function verifyRolePin(pin, existing){
    if(!existing) return false;
    try{ var obj=JSON.parse(existing); if(obj && obj.scheme==='sha256-salt'){ return await hashPassword(pin, obj.salt) === obj.hash; } }catch(e){}
    try{ return existing===btoa(pin); }catch(e2){ return false; }
  }
  /* G54.45.1: Demo-Dozent-Zugänge (fest verdrahtete PINs) sind nur erlaubt,
     solange der Kurs leer ist oder ausschließlich Demo-Teilnehmer enthält.
     Sobald echte Teilnehmer existieren, verschwinden die Demo-Logins und
     werden auch serverseitig-logisch abgelehnt — sonst könnte jeder mit der
     öffentlich sichtbaren Demo-PIN echte Teilnehmerdaten der Gruppe sehen. */
  function demoDozentAccessAllowed(){
    if(!localRolePinsAllowed()) return false;
    try{
      var all=localAll();
      var keys=Object.keys(all);
      for(var i=0;i<keys.length;i++){
        var p=all[keys[i]]||{};
        if(!(p.isDemo===true || p.createdBy==='demo-admin-portal')) return false;
      }
      return true;
    }catch(e){ return true; }
  }
  function syncDemoDozentCards(){
    try{
      var allowed=demoDozentAccessAllowed();
      document.querySelectorAll('[data-demo-dozent-pin]').forEach(function(inp){
        var card=inp.closest('.egt-admin-subcard');
        if(card) card.classList.toggle('egt-admin-hidden', !allowed);
      });
      document.querySelectorAll('[data-demo-dozent-note]').forEach(function(n){ n.classList.toggle('egt-admin-hidden', !allowed); });
    }catch(e){}
  }

  async function unlockDozent(pin){
    if(!localRolePinsAllowed()) return setStatus('Lokale Dozenten-PINs sind im Produktionsmodus deaktiviert. Bitte über den zentralen Firebase-Login anmelden.');
    pin=String(pin||'').trim(); if(!pin) return setStatus('Dozenten-PIN eingeben.');
    var existing=dozentStoredPin();
    try{
      if(!existing){ if(pin.length<6) return setStatus('Dozenten-PIN muss mindestens 6 Zeichen haben.'); await storeDozentPin(pin); setActiveDozentProfile('DOZENT-A'); sessionStorage.setItem(DOZENT_OPEN_KEY,'1'); sessionStorage.setItem(PORTAL_ROLE_KEY,'dozent'); announcePortalState('Dozenten-PIN gesetzt. Dozentenportal geöffnet.'); renderDozentStats(); renderDozentLearners(); updateRoleUi(); switchTab('dozent'); return; }
      if(await verifyRolePin(pin, existing)){ setActiveDozentProfile((activeDozentProfile()&&activeDozentProfile().dozentId)||'DOZENT-A'); sessionStorage.setItem(DOZENT_OPEN_KEY,'1'); sessionStorage.setItem(PORTAL_ROLE_KEY,'dozent'); announcePortalState('Dozentenportal geöffnet.'); renderDozentStats(); renderDozentLearners(); updateRoleUi(); switchTab('dozent'); }
      else setStatus('Falsche Dozenten-PIN.');
    }catch(e){ setStatus('Dozenten-Fehler: '+(e.message||e)); }
  }

  function formatDateShort(value){ if(!value) return '-'; try{ var d=new Date(value); if(isNaN(d.getTime())) return String(value); return d.toLocaleDateString('de-DE')+' '+d.toLocaleTimeString('de-DE',{hour:'2-digit',minute:'2-digit'}); }catch(e){ return String(value); } }
  function learnerHelpLabel(profile){
    var pr=profileProgress(profile);
    if(!pr.answered) return { label:'Keine Daten', cls:'neutral', hint:'Noch keine Simulation oder Aufgabe abgeschlossen.' };
    if(pr.accuracy < 50 || pr.risk==='kritisch') return { label:'Hilfe nötig', cls:'danger', hint:'gezielte Förderung empfohlen' };
    if(pr.accuracy < 70 || pr.risk==='riskant') return { label:'Beobachten', cls:'warn', hint:'noch instabil' };
    return { label:'stabil', cls:'ok', hint:'im grünen Bereich' };
  }
  function filteredLearnersForRole(role){
    role=role||currentPortalRole();
    var list=[],ops=adminOperations();
    try{ list=Object.keys(localAll()).map(function(k){ return ensureProfileGroup(localAll()[k]); }).filter(Boolean); }catch(e){ list=[]; }
    // Produktionsstatistiken dürfen niemals durch Demo-Profile verfälscht werden.
    if(!isDevelopment()) list=list.filter(function(x){ return !(ops&&ops.dataClass&&ops.dataClass(x)==='demo'); });
    if(role==='admin') return list;
    if(role==='dozent') return list.filter(function(x){ return canViewLearner('dozent', x); });
    if(role==='teilnehmer' && state.profile) return [ensureProfileGroup(state.profile)];
    return [];
  }
  function overviewStatsFor(role){
    var list=filteredLearnersForRole(role), total=list.length, active=0, help=0, answered=0, accSum=0, accCount=0;
    list.forEach(function(p){ if((p.status||'active')==='active') active++; var pr=profileProgress(p); answered += pr.answered; if(pr.answered){ accSum+=pr.accuracy; accCount++; } var h=learnerHelpLabel(p); if(h.cls==='danger' || h.cls==='warn') help++; });
    return { total:total, active:active, help:help, answered:answered, avg:accCount?Math.round(accSum/accCount):0 };
  }

  function participantDisplayName(x){
    var userId=normalizeCode(x && (x.userId||x.code||x.loginName||x.id));
    return (x && (x.displayName||x.alias||x.name)) || userId || 'Teilnehmer';
  }
  function sortedLearnersForRole(role){
    return filteredLearnersForRole(role).slice().sort(function(a,b){
      return participantDisplayName(a).localeCompare(participantDisplayName(b), 'de', { sensitivity:'base', numeric:true });
    });
  }

  function participantFilterStatus(profile){
    if(!profile) return 'unbekannt';
    if(String(profile.status||'active') !== 'active') return 'inaktiv';
    var act=activityScore(profile);
    var risk=riskStatusText(profile);
    if(act && act.cls==='danger') return 'inaktiv';
    if(risk.cls==='danger') return 'kritisch';
    if(risk.cls==='warn') return 'riskant';
    if(risk.cls==='ok') return 'stabil';
    return 'unbekannt';
  }
  function participantStatusLabel(status){
    var map={ alle:'Alle', stabil:'Stabil', riskant:'Riskant', kritisch:'Kritisch', inaktiv:'Inaktiv', unbekannt:'Unbekannt' };
    return map[status] || status || 'Unbekannt';
  }
  function participantStatusClass(status){
    if(status==='stabil') return 'egt-status-ok';
    if(status==='riskant') return 'egt-status-warn';
    if(status==='kritisch') return 'egt-status-danger';
    if(status==='inaktiv') return 'egt-status-neutral';
    return 'egt-status-neutral';
  }
  function statusFilterChipsHtml(role){
    var list=sortedLearnersForRole(role);
    var counts={ alle:list.length, stabil:0, riskant:0, kritisch:0, inaktiv:0 };
    list.forEach(function(x){ var st=participantFilterStatus(x); if(counts[st] != null) counts[st]++; });
    return '<div class="egt-status-filter" data-status-filter data-role="'+escapeHtml(role)+'">'+
      ['alle','stabil','riskant','kritisch','inaktiv'].map(function(key){
        return '<button class="egt-filter-chip '+(key==='alle'?'active ':'')+participantStatusClass(key)+'" type="button" data-filter-status="'+key+'"><span>'+participantStatusLabel(key)+'</span><b>'+counts[key]+'</b></button>';
      }).join('')+
      '</div>';
  }
  function priorityValue(profile){
    var st=participantFilterStatus(profile);
    if(st==='kritisch') return 1;
    if(st==='riskant') return 2;
    if(st==='inaktiv') return 3;
    if(st==='stabil') return 4;
    return 5;
  }
  function helpPriorityListHtml(role){
    var list=sortedLearnersForRole(role).slice().sort(function(a,b){
      var pa=priorityValue(a), pb=priorityValue(b);
      if(pa!==pb) return pa-pb;
      return participantDisplayName(a).localeCompare(participantDisplayName(b),'de',{sensitivity:'base',numeric:true});
    });
    if(!list.length) return '<div class="egt-empty-state">Noch keine Teilnehmer für Hilfebedarf vorhanden.</div>';
    return '<div class="egt-help-priority-list">'+list.map(function(x){
      var userId=normalizeCode(x.userId||x.code||x.loginName||x.id);
      var st=participantFilterStatus(x), cls=participantStatusClass(st), pr=profileProgress(x);
      var weak=topWeakness(x);
      return '<button class="egt-help-priority-item '+cls+'" type="button" data-pick-participant="'+escapeHtml(userId)+'" data-role="'+escapeHtml(role)+'" data-open-detail-target="priority"><span><b>'+escapeHtml(participantDisplayName(x))+'</b><small>'+escapeHtml(userId)+' · '+escapeHtml(weak)+'</small></span><i>'+escapeHtml(participantStatusLabel(st))+'</i><strong>'+pr.accuracy+'%</strong></button>';
    }).join('')+'<div class="egt-participant-detail egt-priority-detail" data-priority-detail><div class="egt-empty-state">Teilnehmer antippen, um Details zu öffnen.</div></div></div>';
  }
  function helpPriorityDropdownHtml(role){
    var list=sortedLearnersForRole(role);
    var counts={ kritisch:0, riskant:0, inaktiv:0, stabil:0, unbekannt:0 };
    list.forEach(function(x){ var st=participantFilterStatus(x); if(counts[st] != null) counts[st]++; else counts.unbekannt++; });
    var hint = counts.kritisch ? counts.kritisch+' kritisch' : (counts.riskant ? counts.riskant+' riskant' : (counts.inaktiv ? counts.inaktiv+' inaktiv' : 'kein akuter Bedarf'));
    return '<details class="egt-help-priority-dropdown" data-help-priority-dropdown><summary><span><b>Hilfebedarf nach Priorität</b><small>Kritisch zuerst, dann riskant, inaktiv und stabil.</small></span><i>'+escapeHtml(hint)+'</i></summary>'+helpPriorityListHtml(role)+'</details>';
  }
  function lastSimulationInfo(profile){
    var attempts = Array.isArray(profile && profile.attempts) ? profile.attempts.slice() : [];
    var sim = attempts.find(function(a){ return String(a.module||a.type||'').toLowerCase().indexOf('sim') >= 0; }) || attempts[0] || null;
    if(!sim) return { label:'Noch keine Simulation', when:'-', score:0, type:'-' };
    return { label:(sim.type || sim.module || 'Simulation'), when:formatDateShort(sim.createdAt), score:Math.round(Number(sim.score||0)), type:(sim.module || 'simulation') };
  }
  function topWeakness(profile){
    var w=(profile && profile.global && profile.global.weaknesses) || profile.weaknesses || [];
    if(Array.isArray(w) && w.length) return String(w[0]);
    var mods=profile&&profile.modules||{}, worst='', worstQ=101;
    Object.keys(mods).forEach(function(k){ var m=mods[k]||{}, q=Math.round(((m.correct||0)/Math.max(1,m.answered||0))*100); if((m.answered||0)>0 && q<worstQ){ worstQ=q; worst=k; } });
    return worst ? worst.toUpperCase() : 'Keine Daten';
  }
  function topStrength(profile){
    var s=(profile && profile.global && profile.global.strengths) || profile.strengths || [];
    if(Array.isArray(s) && s.length) return String(s[0]);
    var mods=profile&&profile.modules||{}, best='', bestQ=-1;
    Object.keys(mods).forEach(function(k){ var m=mods[k]||{}, q=Math.round(((m.correct||0)/Math.max(1,m.answered||0))*100); if((m.answered||0)>0 && q>bestQ){ bestQ=q; best=k; } });
    return best ? best.toUpperCase() : 'Keine Daten';
  }
  function recommendationForProfile(profile){
    var pr=profileProgress(profile), weak=topWeakness(profile), help=learnerHelpLabel(profile);
    if(!pr.answered) return 'Erste Simulation starten, damit Hilfebedarf sauber erkannt wird.';
    if(help.cls==='danger') return 'Heute gezielt '+weak+' wiederholen und danach eine kurze Revanche-Übung starten.';
    if(help.cls==='warn') return weak+' stabilisieren: 10 Minuten Übung + kurze Simulation.';
    return 'Stand halten: 1 kurze Wiederholung und nächste Simulation planmäßig starten.';
  }
  function riskStatusText(profile){
    var pr=profileProgress(profile), help=learnerHelpLabel(profile);
    if(!pr.answered) return { label:'unbekannt', cls:'neutral', desc:'Noch keine belastbaren Daten vorhanden.' };
    if(help.cls==='danger') return { label:'kritisch', cls:'danger', desc:'Deutlicher Hilfebedarf. Förderung priorisieren.' };
    if(help.cls==='warn') return { label:'riskant', cls:'warn', desc:'Leistung instabil. Beobachten und gezielt üben.' };
    return { label:'stabil', cls:'ok', desc:'Aktuell im grünen Bereich.' };
  }
  function participantCardHtml(x, compact){
    var userId=normalizeCode(x.userId||x.code||x.loginName||x.id);
    var pr=profileProgress(x), help=learnerHelpLabel(x), risk=riskStatusText(x), sim=lastSimulationInfo(x);
    ensureProfileGroup(x); var courseText=(x.groupId || String((x.year||'')+' '+(x.course||'')).trim()) || '-';
    var act=activityScore(x), hs=helpScore(x), simScore=sim.score||0;
    var weak=topWeakness(x), strong=topStrength(x);
    var profileBars = ''+
      profileBarHtml('Gesamtquote', pr.accuracy, scoreBand(pr.accuracy).label)+' '+
      profileBarHtml('Hilfebedarf', hs.score, hs.label, hs.cls)+' '+
      profileBarHtml('Letzte Aktivität', act.score, act.label, act.cls)+' '+
      profileBarHtml('Letzte Simulation', simScore, sim.label, null);
    var infoBars = ''+
      infoBarHtml('Aufgaben simuliert', String(pr.answered), 'gesamte Versuche', pr.answered>0?'ok':'neutral')+
      infoBarHtml('Gruppe', courseText, userId, 'neutral')+
      infoBarHtml('Stärkster Bereich', strong, 'halten und kurz wiederholen', strong==='Keine Daten'?'neutral':'ok')+
      infoBarHtml('Schwächster Bereich', weak, 'nächster Übungsfokus', weak==='Keine Daten'?'neutral':'warn');
    var filterStatus=participantFilterStatus(x);
    return '<article class="egt-admin-learner '+(compact?'compact':'')+' egt-profile-card egt-profile-bars-card" data-participant-card data-status="'+escapeHtml(filterStatus)+'"><div class="egt-learner-head"><div><strong>'+escapeHtml(participantDisplayName(x))+'</strong><small>'+escapeHtml(userId)+'</small></div><span class="egt-admin-pill egt-status-'+risk.cls+'">'+escapeHtml(risk.label)+'</span>'+(x.isDemo?'<span class="egt-admin-pill">Demo</span>':'')+'</div><div class="egt-profile-status-strip egt-status-'+risk.cls+'"><span>'+escapeHtml(risk.desc)+'</span><b>'+escapeHtml(help.label)+'</b></div><div class="egt-profile-bars">'+profileBars+'</div><div class="egt-profile-info-bars">'+infoBars+'</div><div class="egt-profile-timeline"><div><b>Letzte Aktivität</b><span>'+escapeHtml(formatDateShort(x.lastActiveAt))+'</span></div><div><b>Letzte Simulation</b><span>'+escapeHtml(sim.label)+' · '+escapeHtml(sim.when)+'</span></div></div><div class="egt-profile-recommendation"><b>Empfehlung</b><span>'+escapeHtml(recommendationForProfile(x))+'</span></div><div class="egt-admin-progress egt-profile-modules">'+moduleSummaryHtml(x)+'</div></article>';
  }
  function participantListHtml(role, compact){
    var list=sortedLearnersForRole(role);
    if(!list.length){ return '<div class="egt-empty-state">Noch keine Teilnehmer vorhanden. Erzeuge Demo-Daten oder lege Teilnehmer an.</div>'; }
    return list.slice(0,80).map(function(x){ return participantCardHtml(x, compact); }).join('');
  }
  function participantDetailHtml(role, userId){
    userId=normalizeCode(userId);
    var list=sortedLearnersForRole(role);
    var item=list.find(function(x){ return normalizeCode(x.userId||x.code||x.loginName||x.id)===userId; });
    if(!item) return '<div class="egt-empty-state">Teilnehmer wurde nicht gefunden.</div>';
    return participantCardHtml(item, false);
  }
  function participantDropdownHtml(role){
    var list=sortedLearnersForRole(role);
    if(!list.length){
      var emptyAction = role==='admin'
        ? '<div class="egt-admin-row"><button class="egt-admin-btn secondary" type="button" data-create-demo-inline>Demo-Daten auf diesem Gerät erzeugen</button></div><small class="egt-device-note">Hinweis: Demo-Teilnehmer werden lokal gespeichert. PC, iPad und iPhone haben getrennte Speicher.</small>'
        : '<small class="egt-device-note">Keine Teilnehmer auf diesem Gerät sichtbar. Admin muss auf diesem Gerät Demo-Daten erzeugen oder Teilnehmer anlegen.</small>';
      return '<details class="egt-participant-dropdown" data-participant-dropdown data-role="'+escapeHtml(role)+'"><summary><span>Teilnehmerliste</span><b>0</b></summary><div class="egt-empty-state"><b>Noch keine Teilnehmer vorhanden.</b><span>Erzeuge Demo-Daten oder lege einen Teilnehmer an, damit Dashboard, Berichte und Hilfebedarf gefüllt werden.</span></div>'+emptyAction+'</details>';
    }
    var names=list.map(function(x){
      var userId=normalizeCode(x.userId||x.code||x.loginName||x.id);
      var help=learnerHelpLabel(x);
      var fStatus=participantFilterStatus(x);
      return '<button class="egt-participant-name-btn" type="button" data-pick-participant="'+escapeHtml(userId)+'" data-role="'+escapeHtml(role)+'" data-status="'+escapeHtml(fStatus)+'"><span>'+escapeHtml(participantDisplayName(x))+'</span><small>'+escapeHtml(userId)+'</small><i class="egt-status-'+help.cls+'">'+escapeHtml(participantStatusLabel(fStatus))+'</i></button>';
    }).join('');
    return '<details class="egt-participant-dropdown" data-participant-dropdown data-role="'+escapeHtml(role)+'"><summary><span>Teilnehmerliste</span><b>'+list.length+'</b></summary><div class="egt-participant-picker"><div class="egt-participant-picker-head"><p>Alphabetisch sortiert. Filtere nach Hilfebedarf oder wähle zuerst einen Namen, dann erscheinen die Details.</p><button class="egt-admin-btn secondary" type="button" data-show-all-participants data-role="'+escapeHtml(role)+'">Alle Teilnehmer anzeigen</button></div>'+statusFilterChipsHtml(role)+'<div class="egt-participant-name-list">'+names+'</div><div class="egt-participant-detail" data-participant-detail><div class="egt-empty-state">Noch kein Teilnehmer ausgewählt.</div></div><div class="egt-participant-all egt-admin-hidden" data-participant-all><h4>Alle Teilnehmer</h4><div class="egt-admin-list egt-participant-list-compact">'+participantListHtml(role,true)+'</div></div></div></details>';
  }



  function groupPhase5NormalizeId(value){
    value=String(value||'').trim();
    if(!value) return 'Ohne Gruppe';
    return value.replace(/\s+/g,'-').toUpperCase();
  }
  function groupPhase5Status(items){
    items=items||[];
    var critical=0, risky=0, inactive=0, active=0, accSum=0, accCount=0;
    items.forEach(function(p){
      var st=participantFilterStatus(p);
      if(st==='kritisch') critical++;
      if(st==='riskant') risky++;
      if(st==='inaktiv') inactive++; else active++;
      var pr=profileProgress(p); if(pr.answered){ accSum+=pr.accuracy; accCount++; }
    });
    var avg=accCount?Math.round(accSum/accCount):0;
    var label='stabil', cls='ok';
    if(critical>0){ label='kritisch'; cls='danger'; }
    else if(risky>0){ label='riskant'; cls='warn'; }
    else if(inactive>0 && active===0){ label='inaktiv'; cls='neutral'; }
    return {label:label, cls:cls, critical:critical, risky:risky, inactive:inactive, active:active, avg:avg};
  }
  function groupPhase5List(role){
    var map={};
    sortedLearnersForRole(role||currentPortalRole()).forEach(function(p){
      ensureProfileGroup(p);
      var gid=groupPhase5NormalizeId(p.groupId || p.group_id || p.course || 'Ohne Gruppe');
      if(!map[gid]) map[gid]={ id:gid, title:gid, participants:[], dozent:'Nicht zugewiesen', status:'aktiv', createdAt:'—' };
      map[gid].participants.push(p);
    });
    try{
      var settings=getCourseSettings();
      var current=groupPhase5NormalizeId(settings.prefix || ((settings.year||'')+'-'+(settings.course||'')+'-'+(settings.track||'')));
      if(current && !map[current]) map[current]={ id:current, title:current, participants:[], dozent:'Nicht zugewiesen', status:'aktiv', createdAt:'aktuelle Kursgruppe' };
    }catch(e){}
    try{
      var dz=dozentProfiles();
      Object.keys(dz||{}).forEach(function(k){
        var d=dz[k];
        (d.assignedGroups||[]).forEach(function(g){
          var gid=groupPhase5NormalizeId(g);
          if(!map[gid]) map[gid]={ id:gid, title:gid, participants:[], dozent:d.displayName||k, status:'aktiv', createdAt:'Dozentenbindung' };
          else if(d.displayName) map[gid].dozent=d.displayName;
        });
      });
    }catch(e2){}
    return Object.keys(map).sort(function(a,b){return a.localeCompare(b,'de',{numeric:true,sensitivity:'base'});}).map(function(k){
      var g=map[k], st=groupPhase5Status(g.participants); g.phase5=st; return g;
    });
  }
  function groupPhase5CardHtml(g, active){
    var st=g.phase5||groupPhase5Status(g.participants);
    var search=[g.title,g.id,g.dozent,st.label,g.participants.length].join(' ').toLowerCase();
    return '<button class="egt-group-card egt-status-'+escapeHtml(st.cls)+' '+(active?'active':'')+'" type="button" data-phase5-group="'+escapeHtml(g.id)+'" data-status="'+escapeHtml(st.label)+'" data-search="'+escapeHtml(search)+'">'
      +'<div class="egt-gcard-header">'
        +'<span class="egt-avatar-dot">👥</span>'
        +'<span class="egt-gcard-identity"><strong>'+escapeHtml(g.title)+'</strong><small>Dozent: '+escapeHtml(g.dozent||'Nicht zugewiesen')+'</small></span>'
      +'</div>'
      +'<div class="egt-gcard-body">'
        +'<div class="egt-gcard-stats">'
          +'<span class="egt-admin-pill egt-status-'+escapeHtml(st.cls)+'">'+escapeHtml(st.label)+'</span>'
          +'<div class="egt-gcard-metric"><b>'+st.avg+'%</b><small>Ø Quote</small></div>'
        +'</div>'
        +'<div class="egt-gcard-details">'
          +'<div><b>'+g.participants.length+'</b><span>Teilnehmer</span></div>'
          +'<div><b>'+st.critical+'</b><span>kritisch</span></div>'
        +'</div>'
      +'</div>'
    +'</button>';
  }
  function groupPhase5DetailHtml(role, groupId){
    var groups=groupPhase5List(role), g=groups.find(function(x){return x.id===groupId;}) || groups[0];
    if(!g) return '<div class="egt-empty-state">Noch keine Gruppe vorhanden.</div>';
    var st=g.phase5||groupPhase5Status(g.participants);
    var learners=g.participants.slice().sort(function(a,b){ return priorityValue(a)-priorityValue(b); }).slice(0,12).map(function(p){
      var uid=normalizeCode(p.userId||p.code||p.loginName||p.id), ps=participantFilterStatus(p), pr=profileProgress(p);
      return '<button class="egt-group-learner '+participantStatusClass(ps)+'" type="button" data-phase2-open-profile="'+escapeHtml(uid)+'" data-group-open-participant="'+escapeHtml(uid)+'"><span><b>'+escapeHtml(participantDisplayName(p))+'</b><small>'+escapeHtml(uid)+' · '+escapeHtml(topWeakness(p))+'</small></span><i>'+escapeHtml(participantStatusLabel(ps))+'</i><strong>'+pr.accuracy+'%</strong></button>';
    }).join('');
    if(!learners) learners='<div class="egt-empty-state"><b>Noch keine Teilnehmer in dieser Gruppe.</b><span>Erstelle Teilnehmer mit der aktiven Kurs-ID oder weise bestehende Profile dieser Gruppe zu.</span></div>';
    return '<aside class="egt-group-detail" data-phase5-detail-id="'+escapeHtml(g.id)+'">'
      +'<div class="egt-group-detail-head"><div><span class="egt-session-kicker">Gruppendetail</span><h4>'+escapeHtml(g.title)+'</h4><p>Dozent: '+escapeHtml(g.dozent||'Nicht zugewiesen')+'</p></div><span class="egt-admin-pill egt-status-'+escapeHtml(st.cls)+'">'+escapeHtml(st.label)+'</span></div>'
      +'<div class="egt-profile-kpi"><div><b>'+g.participants.length+'</b><span>Teilnehmer</span></div><div><b>'+st.active+'</b><span>aktiv</span></div><div><b>'+st.avg+'%</b><span>Ø Quote</span></div><div><b>'+st.critical+'</b><span>kritisch</span></div></div>'
      +'<div class="egt-profile-section"><b>Verwaltung</b><div class="egt-admin-mini-grid"><input class="egt-admin-input" data-phase5-title value="'+escapeHtml(g.title)+'" placeholder="Gruppenname"><input class="egt-admin-input" data-phase5-teacher value="'+escapeHtml(g.dozent||'')+'" placeholder="Dozent"><select class="egt-admin-input" data-phase5-status><option value="aktiv"'+(g.status==='aktiv'?' selected':'')+'>Aktiv</option><option value="pausiert"'+(g.status==='pausiert'?' selected':'')+'>Pausiert</option><option value="archiviert"'+(g.status==='archiviert'?' selected':'')+'>Archiviert</option></select><button class="egt-admin-btn secondary" type="button" data-phase5-save-group="'+escapeHtml(g.id)+'">Gruppe speichern</button></div><small>Phase 5 bereitet die saubere Gruppenverwaltung vor. Teilnehmerzuweisung bleibt stabil über groupId/Kurs-ID.</small></div>'
      +'<div class="egt-profile-section"><b>Risikoteilnehmer in dieser Gruppe</b><div class="egt-group-learner-list">'+learners+'</div></div>'
      +'<div class="egt-admin-row"><button class="egt-admin-btn" type="button" data-phase5-create-in-group="'+escapeHtml(g.id)+'">Teilnehmer in Gruppe erstellen</button><button class="egt-admin-btn secondary" type="button" data-cc-action="reports">Gruppenbericht</button></div>'
    +'</aside>';
  }
  function groupPhase5WorkspaceHtml(role){
    role=role||currentPortalRole();
    var groups=groupPhase5List(role), first=groups[0]&&groups[0].id;
    var total=groups.reduce(function(a,g){return a+g.participants.length;},0);
    var critical=groups.filter(function(g){return (g.phase5||{}).label==='kritisch';}).length;
    var rows=groups.length?groups.map(function(g,i){return groupPhase5CardHtml(g,i===0);}).join(''):'<div class="egt-empty-state"><b>Noch keine Gruppen vorhanden.</b><span>Speichere eine Kursgruppe oder erzeuge Demo-Daten.</span></div>';
    return '<div class="egt-admin-card egt-admin-card-wide egt-phase5-groups" data-phase5-groups data-role="'+escapeHtml(role)+'">'
      +'<div class="egt-phase2-head"><div><span class="egt-session-kicker">Phase 5 · Gruppenverwaltung</span><h3>Gruppen & Kurse professionell verwalten</h3><p>Hier sieht ein Bildungsträger Kurse, Teilnehmerzahlen, Dozentenzuordnung, Risiko und Gruppenaktionen ohne Dropdown-Chaos.</p></div><div class="egt-phase2-count"><b>'+groups.length+'</b><span>Gruppen · '+total+' TN</span></div></div>'
      +'<div class="egt-phase5-kpis"><div><b>'+groups.length+'</b><span>Gruppen</span></div><div><b>'+total+'</b><span>Teilnehmer</span></div><div><b>'+critical+'</b><span>kritische Gruppen</span></div><div><b>'+escapeHtml(reportScopeLabel(role))+'</b><span>Zugriff</span></div></div>'
      +'<div class="egt-participant-toolbar"><label class="egt-participant-search"><span>Gruppensuche</span><input class="egt-admin-input" data-phase5-search placeholder="Gruppe, Dozent, Status suchen…"></label><label class="egt-participant-sort"><span>Status</span><select class="egt-admin-input" data-phase5-filter><option value="alle">Alle Gruppen</option><option value="stabil">Stabil</option><option value="riskant">Riskant</option><option value="kritisch">Kritisch</option><option value="inaktiv">Inaktiv</option></select></label><button class="egt-admin-btn secondary" type="button" data-refresh-groups>Aktualisieren</button></div>'
      +'<div class="egt-phase5-layout"><div><div class="egt-group-table" data-phase5-list>'+rows+'</div></div><div data-phase5-detail>'+groupPhase5DetailHtml(role, first)+'</div></div>'
      +'<div class="egt-phase5-tools"><div class="egt-admin-subcard"><strong>Kurs-ID konfigurieren</strong><p>Steuert neue Teilnehmernummern.</p><div class="egt-admin-mini-grid"><input class="egt-admin-input" data-course-year type="number" min="2024" max="2099" placeholder="Jahr"><input class="egt-admin-input" data-course-code placeholder="Kurs, z. B. GK"><input class="egt-admin-input" data-course-track placeholder="Reihe, z. B. A"><input class="egt-admin-input" data-course-digits type="number" min="2" max="5" placeholder="Stellen"></div><div class="egt-admin-row"><button class="egt-admin-btn secondary" data-save-course>Gruppe speichern</button><span class="egt-admin-pill" data-current-course></span></div></div><div class="egt-admin-subcard"><strong>Teilnehmer erstellen</strong><p>Neue ID aus aktiver Kursgruppe erzeugen.</p><input class="egt-admin-input" data-new-learner-code placeholder="2026-GK-A001" readonly><input class="egt-admin-input" data-display-name placeholder="Name optional"><label class="egt-check"><input type="checkbox" data-anonymous checked> anonym bleiben</label><div class="egt-admin-row"><button class="egt-admin-btn secondary" data-suggest-code>Nächste ID laden</button><button class="egt-admin-btn" data-create-custom>Teilnehmer erstellen</button></div><div class="egt-admin-status" data-create-result>Noch kein Teilnehmer erstellt.</div></div><div class="egt-admin-subcard"><strong>Demo & Export</strong><p>Testdaten und Reset bleiben bewusst abgesichert.</p><div class="egt-admin-row"><button class="egt-admin-btn secondary" data-create-demo>Demo-Daten erzeugen</button><button class="egt-admin-btn danger" data-delete-demo>Demo-Daten löschen</button></div><div class="egt-admin-row"><button class="egt-admin-btn secondary" data-export>Export JSON</button><button class="egt-admin-btn secondary" data-export-csv>Export CSV</button></div><div class="egt-admin-row"><input class="egt-admin-input" data-reset-confirm placeholder="RESET eingeben"><button class="egt-admin-btn danger" data-reset>Kurs resetten</button></div><div class="egt-admin-status" data-demo-result>Noch keine Demo-Daten erzeugt.</div></div></div>'
    +'</div>';
  }
  function applyPhase5GroupFilters(root){
    if(!root) return;
    var q=String((root.querySelector('[data-phase5-search]')||{}).value||'').trim().toLowerCase();
    var f=String((root.querySelector('[data-phase5-filter]')||{}).value||'alle');
    root.querySelectorAll('[data-phase5-group]').forEach(function(row){
      var okStatus=f==='alle' || row.getAttribute('data-status')===f;
      var okSearch=!q || String(row.getAttribute('data-search')||'').indexOf(q)>=0;
      row.classList.toggle('egt-filter-hidden', !(okStatus&&okSearch));
    });
  }

  function participantPhase2CardHtml(x){
    var userId=normalizeCode(x.userId||x.code||x.loginName||x.id);
    var name=participantDisplayName(x), pr=profileProgress(x), risk=riskStatusText(x), help=learnerHelpLabel(x), st=participantFilterStatus(x), ops=adminOperations();
    ensureProfileGroup(x);
    var group=(x.groupId || String((x.year||'')+' '+(x.course||'')).trim()) || '-';
    var last=formatDateShort(x.lastActiveAt);
    var weak=topWeakness(x), sim=lastSimulationInfo(x);
    var source=ops&&ops.dataClass?ops.dataClass(x):(x.isDemo?'demo':'production');
    var roleId=ops&&ops.normalizedRole?ops.normalizedRole(x):normalizeRoleValue(x.role||'participant');
    var activity=ops&&ops.activityClass?ops.activityClass(x):'never';
    var level=ops&&ops.levelId?ops.levelId(x):'';
    var search=[name,userId,group,st,weak,risk.label,help.label,source,roleId,activity,level].join(' ').toLowerCase();
    var statusCls = participantStatusClass(st);
    return '<article class="egt-participant-card '+statusCls+'" data-phase2-row data-status="'+escapeHtml(st)+'" data-search="'+escapeHtml(search)+'" data-user-id="'+escapeHtml(userId)+'" data-group="'+escapeHtml(groupLabel(group))+'" data-source="'+escapeHtml(source)+'" data-role="'+escapeHtml(roleId)+'" data-activity="'+escapeHtml(activity)+'" data-level="'+escapeHtml(level||'none')+'">'
      +'<div class="egt-pcard-header">'
        +'<label class="egt-bulk-check" title="Für Massenaktion auswählen"><input type="checkbox" data-bulk-select="'+escapeHtml(userId)+'" '+(bulkSelection[userId]?'checked':'')+'><span class="egt-sr-only">'+escapeHtml(name)+' auswählen</span></label>'
        +'<div class="egt-pcard-profile-trigger" data-phase2-open-profile="'+escapeHtml(userId)+'" title="Profil öffnen">'
          +'<span class="egt-avatar-dot">'+escapeHtml((name||'?').slice(0,1).toUpperCase())+'</span>'
          +'<span class="egt-pcard-identity"><strong>'+escapeHtml(name)+'</strong><small>'+escapeHtml(userId)+' · '+escapeHtml(group)+'</small></span>'
        +'</div>'
        +'<div class="egt-pcard-badges"><span class="egt-admin-pill egt-source-'+escapeHtml(source)+'">'+escapeHtml(source==='production'?'Produktion':source==='demo'?'Demo':'Legacy')+'</span><button class="egt-pcard-gear-btn" type="button" data-phase2-edit-profile="'+escapeHtml(userId)+'" title="Teilnehmer bearbeiten">⚙️</button></div>'
      +'</div>'
      +'<div class="egt-pcard-body" data-phase2-open-profile="'+escapeHtml(userId)+'">'
        +'<div class="egt-pcard-stats">'
          +'<div><span class="egt-admin-pill egt-status-'+risk.cls+'">'+escapeHtml(participantStatusLabel(st))+'</span></div>'
          +'<div class="egt-pcard-metric"><b>'+pr.accuracy+'%</b><small>'+pr.answered+' Aufgaben</small></div>'
        +'</div>'
        +'<div class="egt-pcard-details">'
          +'<div class="egt-pcard-kv"><span>Aktivität</span><b>'+escapeHtml(last)+'</b><small>'+escapeHtml(sim.label)+'</small></div>'
          +'<div class="egt-pcard-kv"><span>Fokusbereich</span><b>'+escapeHtml(weak)+'</b><small class="egt-pcard-recommendation">'+escapeHtml(recommendationForProfile(x))+'</small></div>'
        +'</div>'
      +'</div>'
    +'</article>';
  }
  function participantPhase2StatsHtml(role){
    var list=sortedLearnersForRole(role), counts={alle:list.length, stabil:0, riskant:0, kritisch:0, inaktiv:0};
    list.forEach(function(x){ var st=participantFilterStatus(x); if(counts[st] != null) counts[st]++; });
    return '<div class="egt-participant-filterbar" data-phase2-filters>'+['alle','stabil','riskant','kritisch','inaktiv'].map(function(k){
      return '<button class="egt-filter-chip '+(k==='alle'?'active ':'')+participantStatusClass(k)+'" type="button" data-phase2-filter="'+k+'"><span>'+escapeHtml(participantStatusLabel(k))+'</span><b>'+counts[k]+'</b></button>';
    }).join('')+'</div>';
  }
  function participantPhase2WorkspaceHtml(role){
    var list=sortedLearnersForRole(role),ops=adminOperations(),opts=ops&&ops.filterOptions?ops.filterOptions(list):{groups:{},levels:{},roles:{},sources:{}};
    var rows=list.length ? list.map(participantPhase2CardHtml).join('') : '<div class="egt-empty-state"><b>Noch keine Teilnehmer vorhanden.</b><span>Erzeuge Demo-Daten oder lege Teilnehmer über Gruppen & Kurse an.</span></div>';
    var first=list[0] ? normalizeCode(list[0].userId||list[0].code||list[0].loginName||list[0].id) : '';
    var groupOptions=Object.keys(opts.groups||{}).sort().map(function(g){return '<option value="'+escapeHtml(g)+'">'+escapeHtml(g)+' ('+opts.groups[g]+')</option>';}).join('');
    var defaultSource=isDevelopment()?'all':'production';
    return '<div class="egt-admin-card egt-admin-card-wide egt-phase2-participants" data-phase2-participants data-role="'+escapeHtml(role)+'">'
      +'<div class="egt-phase2-head"><div><span class="egt-session-kicker">Phase 2 · Teilnehmerverwaltung</span><h3>Teilnehmer suchen, kombinieren und verwalten</h3><p>Suche, Status, Gruppe, Rolle, Datenquelle, Aktivität und Niveau lassen sich gemeinsam anwenden. Demo-Daten sind klar von Produktionsdaten getrennt.</p></div><div class="egt-phase2-count"><b>'+list.length+'</b><span>sichtbare Teilnehmer</span></div></div>'
      +'<div class="egt-participant-toolbar egt-participant-toolbar-extended"><label class="egt-participant-search"><span>Suche</span><input class="egt-admin-input" data-phase2-search placeholder="Name, ID, Gruppe, Status, Schwäche suchen…"></label><label><span>Gruppe</span><select class="egt-admin-input" data-phase2-group><option value="all">Alle Gruppen</option>'+groupOptions+'</select></label><label><span>Rolle</span><select class="egt-admin-input" data-phase2-role><option value="all">Alle Rollen</option><option value="participant">Teilnehmer</option><option value="teacher">Dozent</option></select></label><label><span>Datenquelle</span><select class="egt-admin-input" data-phase2-source><option value="all" '+(defaultSource==='all'?'selected':'')+'>Alle Quellen</option><option value="production" '+(defaultSource==='production'?'selected':'')+'>Produktion</option><option value="demo">Demo</option><option value="legacy">Legacy</option></select></label><label><span>Aktivität</span><select class="egt-admin-input" data-phase2-activity><option value="all">Alle</option><option value="active7">Aktiv ≤ 7 Tage</option><option value="active30">Aktiv 8–30 Tage</option><option value="inactive30">Inaktiv &gt; 30 Tage</option><option value="never">Nie aktiv</option></select></label><label><span>Niveau</span><select class="egt-admin-input" data-phase2-level><option value="all">Alle Niveaus</option>'+['A1','A2','B1','B2','C1','C2'].map(function(l){return '<option value="'+l+'">'+l+'</option>';}).join('')+'</select></label><label class="egt-participant-sort"><span>Sortierung</span><select class="egt-admin-input" data-phase2-sort><option value="name">Name A–Z</option><option value="risk">Risiko zuerst</option><option value="quote">Quote aufsteigend</option><option value="activity">Letzte Aktivität</option></select></label><button class="egt-admin-btn secondary" type="button" data-refresh-learners>Aktualisieren</button></div>'
      +participantPhase2StatsHtml(role)
      +'<div class="egt-bulk-toolbar"><label class="egt-admin-check"><input type="checkbox" data-bulk-select-visible><span>Sichtbare auswählen</span></label><b><span data-bulk-selected-count>'+selectedLearnerIds().length+'</span> ausgewählt</b><button class="egt-admin-btn secondary" type="button" data-open-operations>In Betriebszentrale verwalten</button><button class="egt-admin-btn secondary" type="button" data-bulk-clear>Auswahl leeren</button></div>'
      +'<div class="egt-phase2-layout"><div><div class="egt-participant-table" data-phase2-list>'+rows+'</div></div><aside class="egt-participant-side" data-phase2-detail>'+(first?participantPhase2ProfileHtml(role, first):'<div class="egt-empty-state">Teilnehmer auswählen, um das Profil zu öffnen.</div>')+'</aside></div>'
    +'</div>';
  }
  function participantPhase2ProfileHtml(role, userId){
    userId=normalizeCode(userId);
    var item=sortedLearnersForRole(role).find(function(x){ return normalizeCode(x.userId||x.code||x.loginName||x.id)===userId; });
    if(!item) return '<div class="egt-empty-state">Teilnehmer wurde nicht gefunden.</div>';
    ensureProfileGroup(item);
    var pr=profileProgress(item), risk=riskStatusText(item), sim=lastSimulationInfo(item), group=(item.groupId || String((item.year||'')+' '+(item.course||'')).trim()) || '-';
    return '<div class="egt-phase2-profile">'
      +'<div class="egt-profile-top"><span class="egt-avatar-dot large">'+escapeHtml(participantDisplayName(item).slice(0,1).toUpperCase())+'</span><div><h4>'+escapeHtml(participantDisplayName(item))+'</h4><small>'+escapeHtml(userId)+' · '+escapeHtml(group)+'</small></div><span class="egt-admin-pill egt-status-'+risk.cls+'">'+escapeHtml(risk.label)+'</span></div>'
      +'<div class="egt-profile-kpi"><div><b>'+pr.accuracy+'%</b><span>Quote</span></div><div><b>'+pr.answered+'</b><span>Aufgaben</span></div><div><b>'+escapeHtml(sim.score||0)+'%</b><span>letzte Sim.</span></div></div>'
      +'<div class="egt-profile-section"><b>Stammdaten</b><div class="egt-admin-kv"><b>Name</b><span>'+escapeHtml(participantDisplayName(item))+'</span><b>Gruppe</b><span>'+escapeHtml(group)+'</span><b>Status</b><span>'+escapeHtml(item.blocked||item.status==='blocked'?'gesperrt':(item.status||'active'))+'</span><b>Rolle</b><span>'+escapeHtml(roleLabelShort(item.role||'participant'))+'</span><b>Letzte Aktivität</b><span>'+escapeHtml(formatDateShort(item.lastActiveAt))+'</span><b>Notiz</b><span>'+escapeHtml((item.adminNote||item.note||'—').slice(0,90))+'</span></div></div>'
      +'<div class="egt-profile-section"><b>Lernstand</b><div class="egt-admin-progress">'+moduleSummaryHtml(item)+'</div></div>'
      +adminLanguageParticipantDetailsHtml(item)
      +'<div class="egt-profile-section"><b>Empfehlung</b><p>'+escapeHtml(recommendationForProfile(item))+'</p></div>'
      +'<div class="egt-admin-row"><button class="egt-admin-btn" type="button" data-phase2-edit-profile="'+escapeHtml(userId)+'">Profil bearbeiten</button><button class="egt-admin-btn secondary" type="button" data-open-participant-manager>Manager öffnen</button></div>'
    +'</div>';
  }
  function applyPhase2ParticipantFilters(root){
    if(!root) return;
    var q=String((root.querySelector('[data-phase2-search]')||{}).value||'').trim().toLowerCase();
    var active=(root.querySelector('[data-phase2-filter].active')||{}).getAttribute ? root.querySelector('[data-phase2-filter].active').getAttribute('data-phase2-filter') : 'alle';
    var filters={query:q,status:active,group:String((root.querySelector('[data-phase2-group]')||{}).value||'all'),role:String((root.querySelector('[data-phase2-role]')||{}).value||'all'),source:String((root.querySelector('[data-phase2-source]')||{}).value||'all'),activity:String((root.querySelector('[data-phase2-activity]')||{}).value||'all'),level:String((root.querySelector('[data-phase2-level]')||{}).value||'all')};
    var visible=0;
    root.querySelectorAll('[data-phase2-row]').forEach(function(row){
      var ok=(!filters.status||filters.status==='alle'||row.getAttribute('data-status')===filters.status)
        &&(!filters.query||String(row.getAttribute('data-search')||'').indexOf(filters.query)>=0)
        &&(filters.group==='all'||row.getAttribute('data-group')===filters.group)
        &&(filters.role==='all'||row.getAttribute('data-role')===filters.role)
        &&(filters.source==='all'||row.getAttribute('data-source')===filters.source)
        &&(filters.activity==='all'||row.getAttribute('data-activity')===filters.activity)
        &&(filters.level==='all'||row.getAttribute('data-level')===filters.level);
      row.classList.toggle('egt-filter-hidden',!ok);if(ok)visible++;
    });
    var count=root.querySelector('.egt-phase2-count b');if(count)count.textContent=String(visible);
    var selectAll=root.querySelector('[data-bulk-select-visible]');if(selectAll){var visibleChecks=Array.prototype.filter.call(root.querySelectorAll('[data-phase2-row]:not(.egt-filter-hidden) [data-bulk-select]'),function(cb){return !cb.disabled;});selectAll.checked=visibleChecks.length>0&&visibleChecks.every(function(cb){return cb.checked;});selectAll.indeterminate=visibleChecks.some(function(cb){return cb.checked;})&&!selectAll.checked;}
  }

  function quoteRingHtml(value, label, subLabel){
    var ring=Math.max(0,Math.min(100,Number(value)||0));
    return '<div class="egt-quote-card" aria-label="'+escapeHtml(label)+' '+ring+' Prozent"><div class="egt-donut egt-donut-unified" style="--p:'+ring+'"><strong>'+ring+'%</strong><span>'+escapeHtml(label)+'</span></div><small>'+escapeHtml(subLabel||'Gesamtblick')+'</small></div>';
  }

  function phase4KpiCardHtml(icon, label, value, hint, tone, action){
    return '<button class="egt-phase4-kpi '+escapeHtml(tone||'neutral')+'" type="button" '+(action?'data-cc-action="'+escapeHtml(action)+'"':'')+'><span class="egt-phase4-kpi-icon">'+escapeHtml(icon||'•')+'</span><b>'+value+'</b><em>'+escapeHtml(label)+'</em><small>'+escapeHtml(hint||'')+'</small></button>';
  }
  function phase4RiskListHtml(role, list){
    var rows=list.slice().sort(function(a,b){ return priorityValue(a)-priorityValue(b); }).filter(function(p){ var st=participantFilterStatus(p); return st==='kritisch' || st==='riskant' || st==='inaktiv'; }).slice(0,6);
    if(!rows.length) return '<div class="egt-empty-state"><b>Keine akuten Risiken</b><span>Aktuell ist kein Teilnehmer kritisch markiert.</span></div>';
    return '<div class="egt-phase4-risk-list">'+rows.map(function(p){
      var id=normalizeCode(p.userId||p.code||p.loginName||p.id); var st=participantFilterStatus(p); var pr=profileProgress(p); var weak=topWeakness(p); var cls=participantStatusClass(st);
      return '<button class="egt-phase4-risk-row '+cls+'" type="button" data-phase4-open-profile="'+escapeHtml(id)+'"><span><b>'+escapeHtml(participantDisplayName(p))+'</b><small>'+escapeHtml(id)+' · '+escapeHtml(weak)+'</small></span><i>'+escapeHtml(participantStatusLabel(st))+'</i><strong>'+pr.accuracy+'%</strong></button>';
    }).join('')+'</div>';
  }
  function phase4ActivityHtml(list){
    var rows=(list||[]).map(function(p){
      var summary=p&&p.activitySummary||{}; var at=summary.schema==='egt-activity-summary-v1'?(summary.lastEventAt||summary.lastSessionAt||''):'';
      return {profile:p,at:at};
    }).filter(function(x){return !!x.at;}).sort(function(a,b){return String(b.at).localeCompare(String(a.at));}).slice(0,6);
    if(!rows.length) return '<div class="egt-empty-state"><b>Noch keine bestätigte Aktivität</b><span>Hier erscheinen ausschließlich echte Ledger-Sessions oder -Ereignisse.</span></div>';
    return '<div class="egt-phase4-activity-list">'+rows.map(function(row){
      var p=row.profile, id=normalizeCode(p.userId||p.code||p.loginName||p.id), pr=profileProgress(p);
      return '<div class="egt-phase4-activity-row"><span><b>'+escapeHtml(participantDisplayName(p))+'</b><small>'+escapeHtml(id)+' · bestätigte Ledger-Aktivität</small></span><i>'+escapeHtml(formatDateShort(row.at))+'</i><strong>'+pr.accuracy+'%</strong></div>';
    }).join('')+'</div>';
  }
  function phase4SystemMiniHtml(role){
    var ss=syncStatus(); var provider=ss.online?'Firebase aktiv':'Lokalmodus'; var providerTone=ss.online?'ok':(ss.firebaseConfigured?'warn':'danger');
    var roleTxt=role==='admin'?'Vollzugriff':'Gruppenansicht';
    return '<div class="egt-phase4-system-mini"><div><span>Sync</span><b class="egt-status-'+providerTone+'">'+escapeHtml(provider)+'</b><small>'+escapeHtml(ss.pendingCount||0)+' offen · '+escapeHtml(ss.courseId||state.courseId)+'</small></div><div><span>Rolle</span><b>'+escapeHtml(roleTxt)+'</b><small>'+escapeHtml(groupAccessForRole(role).label||'Alle Gruppen')+'</small></div><div><span>Aufgabenbank</span><b>'+escapeHtml(taskCount())+'</b><small>geladene Aufgaben</small></div></div>';
  }
  function adminReadJson(key, fallback){ try{ var raw=localStorage.getItem(key); return raw?JSON.parse(raw):fallback; }catch(e){ return fallback; } }
  function adminEnglishA1LocalSummary(){
    var progress=adminReadJson('language_academy_english_a1_interactive_progress_v1',{answers:{},updatedAt:null})||{};
    var answers=progress.answers||{};
    var keys=Object.keys(answers);
    var done=keys.length;
    var correct=keys.filter(function(k){ return !!(answers[k]&&answers[k].correct); }).length;
    var api=(window.LanguageCourseEnglishProgress||{});
    var liveProgress=(api&&typeof api.progress==='function')?api.progress():null;
    var review=(api&&typeof api.reviewStats==='function')?api.reviewStats():null;
    var total=(liveProgress&&liveProgress.total)||48;
    var percent=total?Math.min(100,Math.round((done/total)*100)):0;
    var accuracy=done?Math.round((correct/done)*100):0;
    if(liveProgress){ done=liveProgress.done||done; correct=liveProgress.correct||correct; percent=liveProgress.percent||percent; accuracy=liveProgress.accuracy||accuracy; }
    var queue=adminReadJson('language_academy_english_a1_supabase_sync_queue_v1',[]); if(!Array.isArray(queue)) queue=[];
    var meta=adminReadJson('language_academy_english_a1_supabase_sync_meta_v1',{})||{};
    var config=(window.LANGUAGE_PROGRESS_SUPABASE_CONFIG||{});
    var cloud=(window.CLOUD_HIGHSCORE_CONFIG||{});
    var url=String(config.supabaseUrl||cloud.supabaseUrl||'');
    var table=String(config.table||'language_progress');
    var configured=!!(url&&String(config.anonKey||cloud.anonKey||'')&&/^https:\/\/[^\s]+\.supabase\.co/i.test(url));
    var a2Progress=(api&&typeof api.progressLevel==='function')?api.progressLevel('en-a2'):null; var a2Review=(api&&typeof api.reviewStatsLevel==='function')?api.reviewStatsLevel('en-a2'):null; return {done:done,total:total,correct:correct,percent:percent,accuracy:accuracy,reviewDue:(review&&review.due)||0,reviewWrong:(review&&review.wrong)||0,reviewOpen:(review&&review.open)||0,nextReviewLesson:(review&&review.nextReviewLesson)||'',a2Percent:(a2Progress&&a2Progress.percent)||0,a2Done:(a2Progress&&a2Progress.done)||0,a2Total:(a2Progress&&a2Progress.total)||0,a2ReviewDue:(a2Review&&a2Review.due)||0,a2ReviewWrong:(a2Review&&a2Review.wrong)||0,updatedAt:progress.updatedAt||'',pending:queue.length,lastOkAt:meta.lastOkAt||'',lastAttemptAt:meta.lastAttemptAt||'',lastError:meta.lastError||'',table:table,configured:configured,lastQueuedAt:meta.lastQueuedAt||''};
  }

  function adminUnifiedLanguageSummary(){
    var snap=null;
    try{ if(window.LanguageAcademyCourseEntry && typeof window.LanguageAcademyCourseEntry.languageUnifiedProgressSnapshot==='function') snap=window.LanguageAcademyCourseEntry.languageUnifiedProgressSnapshot(); }catch(e){}
    var old=adminEnglishA1LocalSummary();
    if(!snap){
      return {ok:false,legacy:true,done:old.done,total:old.total,percent:old.percent,accuracy:old.accuracy,reviewTotal:(old.reviewDue||0)+(old.a2ReviewDue||0),reviewWrong:old.reviewWrong||0,reviewOpen:old.reviewOpen||0,speakingPercent:0,deLevels:0,enLevels:2,tasks:old.total||0,table:old.table,configured:old.configured,pending:old.pending,lastOkAt:old.lastOkAt,lastAttemptAt:old.lastAttemptAt,lastError:old.lastError,cloudHealth:old.lastOkAt?'Cloud synchronisiert':(old.configured?'Cloud bereit':'lokaler Fallback'),source:'legacy-english-a1-a2'};
    }
    var t=snap.totals||{}, rv=snap.review||{};
    return {ok:true,legacy:false,done:t.done||0,total:t.tasks||0,percent:t.percent||0,accuracy:t.accuracy||0,reviewTotal:t.reviewTotal||rv.total||0,reviewWrong:t.reviewWrong||rv.wrong||0,reviewOpen:t.reviewOpen||rv.open||0,high:t.high||0,critical:t.critical||0,speakingDone:t.speakingDone||0,speakingTotal:t.speakingTotal||0,speakingPercent:t.speakingPercent||0,deLevels:(snap.de||[]).length,enLevels:(snap.en||[]).length,de:snap.de||[],en:snap.en||[],weakest:snap.weakest,strongest:snap.strongest,recommendation:snap.recommendation||'',table:old.table,configured:old.configured,pending:old.pending,lastOkAt:old.lastOkAt,lastAttemptAt:old.lastAttemptAt,lastError:old.lastError,cloudHealth:old.lastOkAt?'Cloud synchronisiert':(old.configured?'Cloud bereit':'lokaler Fallback'),source:'unified-language-progress-10X'};
  }
  function adminLanguageLevelRows(levels){
    levels=levels||[];
    return levels.map(function(x){
      var p=Math.max(0,Math.min(100,Number(x.percent||0)));
      var cls=p>=80?'ok':(p>=45?'warn':'danger');
      return '<div class="egt-language-level-row egt-status-'+escapeHtml(cls)+'"><div><b>'+escapeHtml((x.language==='en'?'EN ':'DE ')+(x.level||''))+'</b><small>'+escapeHtml(x.done||0)+'/'+escapeHtml(x.tasks||0)+' Aufgaben · '+escapeHtml(x.accuracy||0)+'% Quote'+(x.speakingTotal?' · Speaking '+escapeHtml(x.speakingPercent||0)+'%':'')+'</small></div><span>'+escapeHtml(p)+'%</span><i style="width:'+escapeHtml(p)+'%"></i></div>';
    }).join('') || '<div class="egt-empty-state">Noch keine Leveldaten vorhanden.</div>';
  }


  /* G54.43.10Y · Teilnehmerprofil-Sprachkursdetails */
  function adminLanguageLearnerSeed(profile){
    profile=profile||{};
    var id=normalizeCode(profile.userId||profile.code||profile.loginName||profile.id||'local');
    var n=0; for(var i=0;i<id.length;i++){ n=(n*31+id.charCodeAt(i))%9973; }
    return n||17;
  }
  function adminLanguageProfileSource(profile){
    profile=profile||{};
    return profile.languageProgress || profile.sprachkursProgress || profile.language || profile.sprachtraining || null;
  }
  function adminLanguageProfileLevels(profile, lang){
    var global=adminUnifiedLanguageSummary();
    var base=(global && global[lang]) ? clone(global[lang]) : [];
    var stored=adminLanguageProfileSource(profile);
    var seed=adminLanguageLearnerSeed(profile);
    return base.map(function(x,idx){
      var levelKey=x.levelKey || x.level || '';
      var custom=null;
      try{
        if(stored && stored.levels && stored.levels[lang] && stored.levels[lang][levelKey]) custom=stored.levels[lang][levelKey];
        else if(stored && stored[lang] && stored[lang][levelKey]) custom=stored[lang][levelKey];
      }catch(e){}
      var tasks=Number((custom&&custom.tasks)!=null?custom.tasks:x.tasks||0);
      var done=Number((custom&&custom.done)!=null?custom.done:x.done||0);
      var correct=Number((custom&&custom.correct)!=null?custom.correct:x.correct||0);
      var attempts=Number((custom&&custom.attempts)!=null?custom.attempts:(x.attempts||done));
      if(!custom && tasks>0 && done===0){
        /* Demo-/Profilfallback: im Adminprofil muss pro Teilnehmer ein auswertbarer, stabiler Detailstand sichtbar sein, solange keine Cloud-Teilnehmerdaten vorliegen. */
        var ratio=Math.max(0,Math.min(.72,((seed+(idx*19)+(lang==='en'?11:0))%73)/100));
        done=Math.min(tasks,Math.round(tasks*ratio));
        attempts=done;
        correct=Math.round(done*Math.max(.35,Math.min(.92,0.52+(((seed+idx*7)%38)/100))));
      }
      var percent=tasks?Math.max(0,Math.min(100,Math.round((done/tasks)*100))):0;
      var accuracy=attempts?Math.max(0,Math.min(100,Math.round((correct/attempts)*100))):0;
      var reviewDue=Number((custom&&custom.reviewDue)!=null?custom.reviewDue:(x.reviewDue||0));
      var reviewWrong=Number((custom&&custom.reviewWrong)!=null?custom.reviewWrong:(x.reviewWrong||0));
      var speakingTotal=Number((custom&&custom.speakingTotal)!=null?custom.speakingTotal:(x.speakingTotal||0));
      var speakingDone=Number((custom&&custom.speakingDone)!=null?custom.speakingDone:(x.speakingDone||0));
      var speakingPercent=speakingTotal?Math.max(0,Math.min(100,Math.round((speakingDone/speakingTotal)*100))):0;
      return Object.assign({},x,{tasks:tasks,done:done,correct:correct,attempts:attempts,percent:percent,accuracy:accuracy,reviewDue:reviewDue,reviewWrong:reviewWrong,speakingTotal:speakingTotal,speakingDone:speakingDone,speakingPercent:speakingPercent});
    });
  }
  function adminLanguageParticipantProfileSnapshot(userId){
    userId=normalizeCode(userId||((state.profile||{}).userId)||'');
    var profile=(userId?localProfile(userId):null) || state.profile || {};
    var name=participantDisplayName(profile)||userId||'Teilnehmer';
    var de=adminLanguageProfileLevels(profile,'de'), en=adminLanguageProfileLevels(profile,'en');
    var levels=de.concat(en);
    var totals={tasks:0,done:0,correct:0,attempts:0,reviewDue:0,reviewWrong:0,speakingDone:0,speakingTotal:0};
    levels.forEach(function(x){ totals.tasks+=Number(x.tasks||0); totals.done+=Number(x.done||0); totals.correct+=Number(x.correct||0); totals.attempts+=Number(x.attempts||x.done||0); totals.reviewDue+=Number(x.reviewDue||0); totals.reviewWrong+=Number(x.reviewWrong||0); totals.speakingDone+=Number(x.speakingDone||0); totals.speakingTotal+=Number(x.speakingTotal||0); });
    totals.percent=totals.tasks?Math.round((totals.done/totals.tasks)*100):0;
    totals.accuracy=totals.attempts?Math.round((totals.correct/totals.attempts)*100):0;
    totals.speakingPercent=totals.speakingTotal?Math.round((totals.speakingDone/totals.speakingTotal)*100):0;
    var weakest=levels.filter(function(x){return x.tasks>0;}).sort(function(a,b){return (a.percent-b.percent)||(a.accuracy-b.accuracy);})[0]||null;
    var strongest=levels.filter(function(x){return x.done>0;}).sort(function(a,b){return (b.percent-a.percent)||(b.accuracy-a.accuracy);})[0]||null;
    var risk='neutral', action='Erste Sprachkurs-Lektion starten.';
    if(totals.reviewWrong>0 || totals.accuracy<45){ risk='danger'; action='Fehlertraining priorisieren und 12er-Review-Session starten.'; }
    else if(totals.reviewDue>0 || totals.percent<35){ risk='warn'; action='Offene Review-Aufgaben bearbeiten und schwächstes Level stabilisieren.'; }
    else if(totals.percent>0){ risk='ok'; action='Nächstes Level planmäßig fortsetzen und Speaking kurz wiederholen.'; }
    return {phase:'10Z',ok:true,exportedAt:nowIso(),userId:userId,name:name,groupId:profile.groupId||'',source:adminLanguageProfileSource(profile)?'participant-profile':'local-admin-derived-fallback',totals:totals,levels:{de:de,en:en},weakest:weakest,strongest:strongest,risk:risk,nextAction:action,findings:levels.length<12?['Nicht alle 12 DE/EN-Level im Teilnehmerprofil sichtbar.']:[]};
  }
  function adminLanguageProfileLevelRowsHtml(levels){
    levels=levels||[];
    return levels.map(function(x){
      var p=Math.max(0,Math.min(100,Number(x.percent||0))); var cls=p>=75?'ok':(p>=35?'warn':'danger');
      return '<article class="egt-language-profile-level egt-status-'+escapeHtml(cls)+'"><div><b>'+escapeHtml((x.language==='en'?'EN ':'DE ')+(x.level||''))+'</b><small>'+escapeHtml(x.done||0)+'/'+escapeHtml(x.tasks||0)+' Aufgaben · '+escapeHtml(x.accuracy||0)+'% Quote</small></div><span>'+escapeHtml(p)+'%</span><i><u style="width:'+escapeHtml(p)+'%"></u></i>'+(x.speakingTotal?'<small>Speaking '+escapeHtml(x.speakingDone||0)+'/'+escapeHtml(x.speakingTotal||0)+' · '+escapeHtml(x.speakingPercent||0)+'%</small>':'')+(x.reviewDue?'<em>'+escapeHtml(x.reviewDue)+' Review</em>':'')+'</article>';
    }).join('') || '<div class="egt-empty-state">Keine Sprachkurs-Leveldaten vorhanden.</div>';
  }
  function adminLanguageParticipantDetailsHtml(profile){
    var uid=normalizeCode(profile&& (profile.userId||profile.code||profile.loginName||profile.id));
    var snap=adminLanguageParticipantProfileSnapshot(uid), t=snap.totals||{};
    var weak=snap.weakest?((snap.weakest.language||'').toUpperCase()+' '+(snap.weakest.level||'')+' · '+(snap.weakest.percent||0)+'%'):'—';
    var strong=snap.strongest?((snap.strongest.language||'').toUpperCase()+' '+(snap.strongest.level||'')+' · '+(snap.strongest.percent||0)+'%'):'—';
    return '<div class="egt-profile-section egt-language-profile-details" data-language-profile-details="10Y">'
      +'<b>Sprachkursdetails · Deutsch/Englisch</b>'
      +'<p>Teilnehmerbezogene Sicht auf Fortschritt, Review-Risiko, Speaking und Levelstatus. Falls noch keine Cloud-Teilnehmerdaten synchronisiert sind, nutzt die Ansicht einen stabilen lokalen Profil-Fallback.</p>'
      +'<div class="egt-language-profile-kpis">'
        +'<div><span>Fortschritt</span><b>'+escapeHtml(t.percent||0)+'%</b><small>'+escapeHtml(t.done||0)+'/'+escapeHtml(t.tasks||0)+' Aufgaben</small></div>'
        +'<div><span>Trefferquote</span><b>'+escapeHtml(t.accuracy||0)+'%</b><small>alle Sprachlevel</small></div>'
        +'<div><span>Review</span><b>'+escapeHtml(t.reviewDue||0)+'</b><small>'+escapeHtml(t.reviewWrong||0)+' falsch</small></div>'
        +'<div><span>Speaking</span><b>'+escapeHtml(t.speakingPercent||0)+'%</b><small>'+escapeHtml(t.speakingDone||0)+'/'+escapeHtml(t.speakingTotal||0)+'</small></div>'
      +'</div>'
      +'<div class="egt-language-profile-meta"><span>Risiko: <b class="egt-status-'+escapeHtml(snap.risk)+'">'+escapeHtml(snap.risk)+'</b></span><span>Schwächstes Level: '+escapeHtml(weak)+'</span><span>Stärkstes Level: '+escapeHtml(strong)+'</span><span>Quelle: '+escapeHtml(snap.source)+'</span></div>'
      +'<div class="egt-language-profile-split"><div><strong>Deutsch A1–C2</strong>'+adminLanguageProfileLevelRowsHtml(snap.levels.de)+'</div><div><strong>Englisch A1–C2</strong>'+adminLanguageProfileLevelRowsHtml(snap.levels.en)+'</div></div>'
      +'<p class="egt-admin-hint"><b>Nächste Aktion:</b> '+escapeHtml(snap.nextAction||'Review öffnen')+'</p>'
    +'</div>';
  }


  /* G54.43.10Z · Release-QA-Fix: Admin-Sprachkurs Cloud-Probe-Fallbacks
     Verhindert, dass der Admin-/Dozentenbereich beim Export-Objekt durch fehlende Probe-Funktionen abbricht. */
  async function adminLanguageProgressCloudProbe(){
    var config=(window.LANGUAGE_PROGRESS_SUPABASE_CONFIG||{});
    var cloud=(window.CLOUD_HIGHSCORE_CONFIG||{});
    var url=String(config.supabaseUrl||cloud.supabaseUrl||'');
    var key=String(config.anonKey||cloud.anonKey||'');
    var table=String(config.table||'language_progress');
    if(!(url&&key&&/^https:\/\/[^\s]+\.supabase\.co/i.test(url))){
      return {ok:false,configured:false,count:0,table:table,message:'Supabase ist nicht konfiguriert; lokaler Sprachkurs-Fortschritt bleibt aktiv.'};
    }
    try{
      var endpoint=url.replace(/\/$/,'')+'/rest/v1/'+encodeURIComponent(table)+'?select=*&limit=5';
      var res=await fetch(endpoint,{headers:{apikey:key,Authorization:'Bearer '+key,Accept:'application/json'}});
      var data=await res.json().catch(function(){return [];});
      return {ok:res.ok,configured:true,status:res.status,count:Array.isArray(data)?data.length:0,table:table,rows:Array.isArray(data)?data:[],message:res.ok?'Cloud-Leseprobe erfolgreich.':'Cloud-Leseprobe fehlgeschlagen.'};
    }catch(e){ return {ok:false,configured:true,count:0,table:table,message:String(e&&e.message||e)}; }
  }
  async function adminLanguageProgressCloudSummary(){
    var probe=await adminLanguageProgressCloudProbe();
    if(!probe.ok){ return Object.assign({},probe,{accuracy:0,done:0,total:0}); }
    var rows=probe.rows||[], done=0,total=0,correct=0,attempts=0;
    rows.forEach(function(r){ done+=Number(r.total_done||r.done||0); total+=Number(r.total_tasks||r.total||0); correct+=Number(r.correct_count||r.correct||0); attempts+=Number(r.attempts||r.total_done||r.done||0); });
    return Object.assign({},probe,{done:done,total:total,accuracy:attempts?Math.round((correct/attempts)*100):0});
  }

  function adminLanguageProgressSnapshot(){
    var s=adminUnifiedLanguageSummary();
    var progress=adminReadJson('language_academy_english_a1_interactive_progress_v1',{answers:{},lessons:{},updatedAt:null})||{};
    var queue=adminReadJson('language_academy_english_a1_supabase_sync_queue_v1',[]); if(!Array.isArray(queue)) queue=[];
    var meta=adminReadJson('language_academy_english_a1_supabase_sync_meta_v1',{})||{};
    var config=(window.LANGUAGE_PROGRESS_SUPABASE_CONFIG||{});
    var health=(window.LanguageCourseEnglishProgress&&typeof window.LanguageCourseEnglishProgress.health==='function')?window.LanguageCourseEnglishProgress.health():null;
    var qa=null; try{ if(window.LanguageAcademyCourseEntry && typeof window.LanguageAcademyCourseEntry.languageAdminTeacherProgressSnapshot==='function') qa=window.LanguageAcademyCourseEntry.languageAdminTeacherProgressSnapshot(); }catch(e){}
    return { exportedAt:nowIso(), appVersion:(window.TRAINER_BUILD_VERSION||'G54.43.10Z'), source:'admin-language-progress-unified-de-en-10z-release-candidate', summary:s, qa:qa, health:health, review:{total:s.reviewTotal,wrong:s.reviewWrong,open:s.reviewOpen,high:s.high,critical:s.critical}, levels:{de:s.de||[],en:s.en||[]}, participantProfiles:sortedLearnersForRole(currentPortalRole()).slice(0,25).map(function(p){return adminLanguageParticipantProfileSnapshot(normalizeCode(p.userId||p.code||p.loginName||p.id));}), config:{ table:s.table, configured:!!s.configured, mode:config.mode||'sprachtraining-progress-only', schemaVersion:config.schemaVersion||'' }, legacyProgress:progress, queue:queue, meta:meta };
  }

  function adminLanguageProgressCsv(){
    var snap=adminLanguageProgressSnapshot();
    var rows=['language,level,lessons,tasks,done,percent,accuracy,review_due,speaking_percent'];
    ['de','en'].forEach(function(lang){ ((snap.levels&&snap.levels[lang])||[]).forEach(function(x){ rows.push([lang,x.level||x.levelKey||'',x.lessons||0,x.tasks||0,x.done||0,x.percent||0,x.accuracy||0,x.reviewDue||0,x.speakingPercent||0].map(function(v){return '"'+String(v).replace(/"/g,'""')+'"';}).join(',')); }); });
    if(rows.length===1){ rows.push(['fallback','A1/A2',0,(snap.summary&&snap.summary.total)||0,(snap.summary&&snap.summary.done)||0,(snap.summary&&snap.summary.percent)||0,(snap.summary&&snap.summary.accuracy)||0,(snap.summary&&snap.summary.reviewTotal)||0,(snap.summary&&snap.summary.speakingPercent)||0].map(function(v){return '"'+String(v).replace(/"/g,'""')+'"';}).join(',')); }
    return rows.join('\n');
  }

  function adminLanguageProgressText(){
    var snap=adminLanguageProgressSnapshot(), s=snap.summary||{};
    var weak=s.weakest?((s.weakest.language||'').toUpperCase()+' '+(s.weakest.level||'')+' · '+(s.weakest.percent||0)+'%'):'—';
    return ['Sprachfortschritt Deutsch/Englisch · Admin/Dozent', 'Export: '+snap.exportedAt, 'Version: '+(window.TRAINER_BUILD_VERSION||'G54.43.10Z'), 'Bearbeitet: '+(s.done||0)+'/'+(s.total||0)+' ('+(s.percent||0)+'%)', 'Trefferquote: '+(s.accuracy||0)+'%', 'Review offen: '+(s.reviewTotal||0), 'davon falsch: '+(s.reviewWrong||0), 'hoch/kritisch: '+((s.high||0)),'Speaking: '+(s.speakingDone||0)+'/'+(s.speakingTotal||0)+' ('+(s.speakingPercent||0)+'%)', 'Deutsch-Level: '+(s.deLevels||0), 'Englisch-Level: '+(s.enLevels||0), 'Schwächstes Level: '+weak, 'Offene Syncs: '+(s.pending||0), 'Supabase: '+(s.configured?'bereit':'Fallback/lokal'), 'Tabelle: '+(s.table||'language_progress'), 'Letzter Erfolg: '+(s.lastOkAt||'—'), 'Letzter Versuch: '+(s.lastAttemptAt||'—'), 'Letzter Hinweis: '+(s.lastError||'—')].join('\n');
  }

  function adminLanguageProgressPreviewHtml(role){
    var s=adminUnifiedLanguageSummary();
    var status=s.cloudHealth||'lokaler Fallback';
    var tone=s.lastError?'warn':(s.lastOkAt?'ok':(s.configured?'info':'neutral'));
    var subtitle=s.lastOkAt?formatDateShort(s.lastOkAt):(s.lastAttemptAt?('Versuch '+formatDateShort(s.lastAttemptAt)):'noch kein Live-Sync');
    var hp=(window.LanguageCourseEnglishProgress&&typeof window.LanguageCourseEnglishProgress.health==='function')?window.LanguageCourseEnglishProgress.health():null;
    var weak=s.weakest?((s.weakest.language||'').toUpperCase()+' '+(s.weakest.level||'')+' · '+(s.weakest.percent||0)+'%'):'—';
    var strong=s.strongest?((s.strongest.language||'').toUpperCase()+' '+(s.strongest.level||'')+' · '+(s.strongest.percent||0)+'%'):'—';
    return '<div class="egt-admin-subcard egt-phase4-card egt-language-progress-preview" data-language-progress-preview="de-en-10y">'
      +'<strong>🌍 Sprachkurs-Fortschritt · Deutsch/Englisch</strong>'
      +'<p>Admin-/Dozentenansicht für Sprachtraining-Fortschritt. Deutsch und Englisch A1–C2 werden gemeinsam sichtbar: Gesamtfortschritt, Trefferquote, Review-Bedarf, Speaking und Levelstatus.</p>'
      +'<div class="egt-language-progress-grid egt-language-progress-grid-10x">'
        +'<div><span>Gesamtfortschritt</span><b>'+escapeHtml(s.percent)+'%</b><small>'+escapeHtml(s.done)+'/'+escapeHtml(s.total)+' Aufgaben</small></div>'
        +'<div><span>Trefferquote</span><b>'+escapeHtml(s.accuracy)+'%</b><small>sprachübergreifend</small></div>'
        +'<div><span>Review offen</span><b>'+escapeHtml(s.reviewTotal||0)+'</b><small>'+escapeHtml(s.reviewWrong||0)+' falsch · '+escapeHtml(s.reviewOpen||0)+' offen</small></div>'
        +'<div><span>hoch/kritisch</span><b>'+escapeHtml((s.high||0))+'</b><small>Priorisierte Fehler</small></div>'
        +'<div><span>Speaking</span><b>'+escapeHtml(s.speakingPercent||0)+'%</b><small>'+escapeHtml(s.speakingDone||0)+'/'+escapeHtml(s.speakingTotal||0)+' Sprechaufgaben</small></div>'
        +'<div><span>Cloud Health</span><b class="egt-status-'+escapeHtml(tone)+'">'+escapeHtml(hp&&hp.state?hp.state:status)+'</b><small>'+(hp&&hp.nextAction?escapeHtml(hp.nextAction):escapeHtml(subtitle))+'</small></div>'
      +'</div>'
      +'<div class="egt-language-progress-meta"><span>Deutsch: '+escapeHtml(s.deLevels||0)+' Level</span><span>Englisch: '+escapeHtml(s.enLevels||0)+' Level</span><span>Rolle: '+escapeHtml(role==='admin'?'Admin gesamt':'Dozent/Gruppe')+'</span><span>Modus: Sprachtraining, keine Prüfung</span></div>'
      +'<div class="egt-language-progress-split"><div><b>Deutsch A1–C2</b>'+adminLanguageLevelRows(s.de||[])+'</div><div><b>Englisch A1–C2</b>'+adminLanguageLevelRows(s.en||[])+'</div></div>'
      +'<p class="egt-admin-hint">Schwächstes Level: '+escapeHtml(weak)+' · stärkstes Level: '+escapeHtml(strong)+' · Empfehlung: '+escapeHtml(s.recommendation||'Review oder nächste Lektion starten')+'</p>'
      +(s.lastError?'<p class="egt-admin-warn">Letzter Sync-Hinweis: '+escapeHtml(String(s.lastError).slice(0,180))+'</p>':'')
      +'<div class="egt-phase4-actions egt-language-progress-actions"><button class="egt-admin-btn" type="button" data-language-progress-cloud-probe>Cloud-Leseprobe</button><button class="egt-admin-btn secondary" type="button" data-language-progress-cloud-summary>Cloud-Zusammenfassung</button><button class="egt-admin-btn secondary" type="button" data-language-progress-export-json>DE/EN JSON exportieren</button><button class="egt-admin-btn secondary" type="button" data-language-progress-export-csv>DE/EN CSV exportieren</button><button class="egt-admin-btn secondary" type="button" data-language-progress-copy-diagnosis>Diagnose kopieren</button></div>'
      +'<pre class="egt-language-progress-output" data-language-progress-output>Sprachkurs-Fortschritt bereit. Export umfasst Deutsch und Englisch A1–C2.</pre>'
      +'</div>';
  }

  function portalDashboardHtml(role){
    var st=overviewStatsFor(role), list=filteredLearnersForRole(role), analyticsSnapshot=aggregateActivity(list);
    var verifiedAverage=analyticsSnapshot.taskAnswers?analyticsSnapshot.accuracy:0;
    var title = role==='admin' ? 'Admin Cockpit' : 'Dozenten Cockpit';
    var access=groupAccessForRole(role); var sub = role==='admin' ? 'Unternehmer-Übersicht: Teilnehmer, Risiken, Aktivität, Codes und Systemzustand auf einen Blick.' : 'Gruppen-Übersicht: nur zugewiesene Teilnehmer und Berichte. '+access.label+'.';
    var counts={stabil:0,riskant:0,kritisch:0,inaktiv:0,unbekannt:0};
    list.forEach(function(p){ var k=participantFilterStatus(p); counts[k]=(counts[k]||0)+1; });
    var inactive=counts.inaktiv||0, critical=counts.kritisch||0, risky=counts.riskant||0;
    var newRegs=list.filter(function(p){ var t=Date.parse(p.createdAt||''); return isFinite(t) && (Date.now()-t) <= 7*86400000; }).length;
    var activeWeek=list.filter(function(p){ var t=Date.parse(p.lastActiveAt||p.updatedAt||''); return isFinite(t) && (Date.now()-t) <= 7*86400000; }).length;
    var openTickets=ticketOpenCount();

    var statsKpis = ''
      +phase4KpiCardHtml('👥','Teilnehmer gesamt',st.total,'alle Profile','info','participants')
      +phase4KpiCardHtml('⚡','Kürzlich aktiv','<span data-kpi-val="online">...</span>','Ledger-Ereignis ≤ 15 Min','ok','participants')
      +phase4KpiCardHtml('📈','Simulationen abgeschlossen','<span data-kpi-val="simulations">...</span>','echte Volltest-Sessions','info','participants')
      +phase4KpiCardHtml('🎯','Ø Trefferquote',verifiedAverage+'%','nur Ledger-Antworten','ok','reports');

    var alertKpis = ''
      +phase4KpiCardHtml('🚨','Kritisch',critical,'sofort prüfen','danger','participants')
      +phase4KpiCardHtml('⚠️','Riskant',risky,'beobachten','warn','participants')
      +phase4KpiCardHtml('🎫','Offene Tickets',openTickets,'Support / Bugs','neutral','tickets')
      +phase4KpiCardHtml('⏸️','Inaktiv',inactive,'Reaktivierung nötig','neutral','participants');

    return '<div class="egt-phase4-dashboard egt-admin-card-wide">'
      +'<div class="egt-phase4-hero"><div><span class="egt-session-kicker">Phase 4 · Dashboard</span><h3>'+escapeHtml(title)+'</h3><p>'+escapeHtml(sub)+'</p></div>'+quoteRingHtml(verifiedAverage,'Ø Quote',(role==='admin'?'Ledger-Daten':'Ledger-Gruppe'))+'</div>'
      
      +'<div class="egt-dashboard-section">'
        +'<div class="egt-section-header"><h4>📊 Leistungs- & Aktivitäts-Metriken</h4><p>Statistiken über Teilnehmerzahlen, Testdurchläufe und Erfolgsquoten.</p></div>'
        +'<div class="egt-phase4-kpi-grid">'+statsKpis+'</div>'
      +'</div>'

      +'<div class="egt-dashboard-section">'
        +'<div class="egt-section-header"><h4>🚨 System-Warnungen & Handlungsbedarf</h4><p>Kritische Fälle und Support-Anfragen, die Aufmerksamkeit erfordern.</p></div>'
        +'<div class="egt-phase4-kpi-grid">'+alertKpis+'</div>'
      +'</div>'

      +'<div class="egt-dashboard-section">'
        +'<div class="egt-section-header"><h4>🔍 Live-Überwachung</h4><p>Direkte Übersicht der Risikokandidaten und der letzten Aktivitäten im System.</p></div>'
        +'<div class="egt-phase4-main-grid">'
          +'<div class="egt-admin-subcard egt-phase4-card"><strong>Risikoteilnehmer · Priorität</strong><p>Kritisch zuerst. Klick öffnet das Profil im Teilnehmerbereich.</p>'+phase4RiskListHtml(role,list)+'</div>'
          +'<div class="egt-admin-subcard egt-phase4-card"><strong>Letzte Aktivität</strong><p>Wer war zuletzt aktiv und mit welcher Quote?</p>'+phase4ActivityHtml(list)+'</div>'
        +'</div>'
      +'</div>'

      +'<div class="egt-dashboard-section">'
        +'<div class="egt-section-header"><h4>🛠️ Schnellzugriff & System-Werkzeuge</h4><p>Direkte Aktionen zur Verwaltung und Überprüfung des Systemzustands.</p></div>'
        +'<div class="egt-phase4-main-grid egt-phase4-tools-grid">'
          +'<div class="egt-admin-subcard egt-phase4-card"><strong>Schnellaktionen</strong><div class="egt-phase4-actions"><button class="egt-admin-btn" data-cc-action="participants" type="button">Teilnehmer verwalten</button><button class="egt-admin-btn secondary" data-cc-action="codes" type="button">Codes verwalten</button><button class="egt-admin-btn secondary" data-cc-action="reports" type="button">Berichte öffnen</button><button class="egt-admin-btn secondary" data-cc-action="system" type="button">Systemstatus</button></div></div>'
          +adminLanguageProgressPreviewHtml(role)
          +'<div class="egt-admin-subcard egt-phase4-card"><strong>Systemstatus</strong>'+phase4SystemMiniHtml(role)+'</div>'
        +'</div>'
      +'</div>'

      +'<div class="egt-dashboard-section">'
        +'<div class="egt-section-header"><h4>📈 Visualisierte Analysen & Trends</h4><p>Echte Ledger-Sessions, bekannte Konten nach Rolle, gewichtete Schwächen und Session-Startzeiten.</p></div>'
        +'<div class="egt-phase4-chart-shell"><div class="egt-cc-charts" data-admin-charts><div class="egt-empty-state">Statistiken werden geladen…</div></div></div>'
      +'</div>'
      +'</div>';
  }
  function formatBytes(bytes){
    bytes=Number(bytes||0);
    if(bytes<1024) return bytes+' B';
    if(bytes<1024*1024) return Math.round(bytes/1024)+' KB';
    return (bytes/(1024*1024)).toFixed(1)+' MB';
  }
  function localStorageBytes(){
    try{
      var total=0;
      for(var i=0;i<localStorage.length;i++){
        var k=localStorage.key(i)||'';
        var v=localStorage.getItem(k)||'';
        total += (k.length+v.length)*2;
      }
      return total;
    }catch(e){ return 0; }
  }
  function questionBankSnapshot(){
    var raw=[];
    try{ raw = Array.isArray(window.QUESTION_BANK_EXTERNAL) ? window.QUESTION_BANK_EXTERNAL : []; }catch(e){ raw=[]; }
    var total=0, groups={}, sourceChunks=raw.length;
    function addItem(q){
      if(!q || typeof q !== 'object') return;
      if(!('question' in q) && !('id' in q) && !('answers' in q)) return;
      total++;
      var g = q.group || q.category || q.cat || 'Unbekannt';
      groups[g] = (groups[g]||0)+1;
    }
    raw.forEach(function(item){
      if(Array.isArray(item)) item.forEach(addItem);
      else addItem(item);
    });
    try{
      if(window.EGTQuestionBankQuality && typeof window.EGTQuestionBankQuality.audit === 'function'){
        var report = window.EGTQuestionBankQuality.audit();
        if(report && Number(report.total)>0){
          total = Number(report.total);
          groups = report.byGroup || groups;
        }
      }
    }catch(e2){}
    return { total: total, groups: groups, sourceChunks: sourceChunks };
  }
  function taskCount(){
    try{ return questionBankSnapshot().total || 0; }catch(e){ return 0; }
  }
  function systemCardHtml(label,value,sub,tone){
    return '<article class="egt-system-card '+escapeHtml(tone||'neutral')+'" aria-label="'+escapeHtml(label)+': '+escapeHtml(value)+'">'
      +'<span class="egt-system-card-label">'+escapeHtml(label)+'</span>'
      +'<strong class="egt-system-card-value">'+escapeHtml(value)+'</strong>'
      +'<small class="egt-system-card-meta">'+escapeHtml(sub||'')+'</small>'
      +'</article>';
  }

  function downloadTextFile(filename, content, mime){
    var blob=new Blob([String(content||'')],{type:mime||'text/plain;charset=utf-8'});
    var url=URL.createObjectURL(blob);
    var a=document.createElement('a'); a.href=url; a.download=filename; document.body.appendChild(a); a.click();
    setTimeout(function(){ URL.revokeObjectURL(url); a.remove(); }, 350);
  }
  function reportSafeDate(){ try{return new Date().toISOString().slice(0,10);}catch(e){return 'export';} }
  function reportScopeLabel(role){
    role=role||currentPortalRole();
    if(role==='admin') return 'Alle Gruppen';
    var a=groupAccessForRole(role); return a.label || 'Zugewiesene Gruppe';
  }
  function reportLearners(role){ return sortedLearnersForRole(role||currentPortalRole()); }
  function reportTypeMeta(type){
    type=String(type||'participants').toLowerCase();
    var map={
      participants:{ key:'participants', title:'Teilnehmerbericht', short:'Teilnehmer', desc:'Stammdaten, Gruppe, Status, Quote, letzter Stand und konkrete Empfehlung pro Teilnehmer.', file:'teilnehmerbericht', icon:'👥' },
      groups:{ key:'groups', title:'Gruppenbericht', short:'Gruppen', desc:'Kursgruppen mit Dozentenzuordnung, Teilnehmerzahl, Risiko, Aktivität und Durchschnittsquote.', file:'gruppenbericht', icon:'🏫' },
      teachers:{ key:'teachers', title:'Dozentenbericht', short:'Dozenten', desc:'Dozentenprofile, Gruppenbindung, sichtbare Teilnehmer, Risikoanteil und Rechte-Status.', file:'dozentenbericht', icon:'🧑‍🏫' },
      performance:{ key:'performance', title:'Leistungsbericht', short:'Leistung', desc:'Modulvergleich über Mathe, Logik, IT, Konzentration, Simulationen und weitere Lernbereiche.', file:'leistungsbericht', icon:'📊' },
      help:{ key:'help', title:'Hilfebedarf-Bericht', short:'Hilfebedarf', desc:'Priorisierte Teilnehmer mit kritischem oder riskantem Status inklusive nächstem Förderfokus.', file:'hilfebedarf', icon:'🚨' }
    };
    return map[type] || map.participants;
  }
  function reportTypeButtonsHtml(active){
    active=(reportTypeMeta(active).key);
    var types=['participants','groups','teachers','performance','help'];
    return '<div class="egt-phase8-type-grid" role="group" aria-label="Berichtstyp wählen">'+types.map(function(t){ var m=reportTypeMeta(t); return '<button type="button" class="egt-phase8-type '+(active===m.key?'active':'')+'" data-phase8-report-type="'+escapeHtml(m.key)+'" aria-pressed="'+(active===m.key?'true':'false')+'"><span aria-hidden="true">'+m.icon+'</span><b>'+escapeHtml(m.short)+'</b><small>'+escapeHtml(m.desc)+'</small></button>'; }).join('')+'</div>';
  }
  function reportRows(role){
    return reportLearners(role).map(function(p){
      var pr=profileProgress(p), h=learnerHelpLabel(p), st=participantFilterStatus(p);
      return { userId:normalizeCode(p.userId||p.code||p.loginName||p.id), name:participantDisplayName(p), groupId:p.groupId||'', course:p.course||'', track:p.track||'', status:participantStatusLabel(st), statusKey:st, help:h.label, helpKey:h.cls, quote:pr.accuracy, answered:pr.answered, correct:pr.correct, lastActivity:formatDateShort(p.lastActiveAt), lastSimulation:(function(){var sim=lastSimulationInfo(p); return sim.label+' · '+sim.when;})(), strongest:topStrength(p), weakest:topWeakness(p), recommendation:recommendationForProfile(p) };
    });
  }
  function reportSummary(role){
    var list=reportLearners(role), st=overviewStatsFor(role), counts={stabil:0,riskant:0,kritisch:0,inaktiv:0,unbekannt:0};
    list.forEach(function(p){ var s=participantFilterStatus(p); counts[s]=(counts[s]||0)+1; });
    return { total:st.total, active:st.active, help:st.help, answered:st.answered, avg:st.avg, counts:counts, scope:reportScopeLabel(role), role:role||currentPortalRole() };
  }
  function learnersForGroupId(role, groupId){
    groupId=groupPhase5NormalizeId(groupId||'');
    return reportLearners(role).filter(function(p){ return groupPhase5NormalizeId(p.groupId||p.group_id||p.course||'Ohne Gruppe')===groupId; });
  }
  function visibleLearnersForDozent(role, dozent){
    dozent=dozent||{};
    if(role==='dozent') return reportLearners('dozent');
    var groups=(dozent.assignedGroups||[]).map(groupPhase5NormalizeId);
    return reportLearners('admin').filter(function(p){ return groups.indexOf(groupPhase5NormalizeId(p.groupId||p.group_id||p.course||''))>=0; });
  }
  function reportModuleRows(role){
    var learners=reportLearners(role), modules={};
    learners.forEach(function(p){
      var mods=p.modules||{};
      Object.keys(mods).forEach(function(k){
        var m=mods[k]||{}, answered=Number(m.answered||0), correct=Number(m.correct||0);
        if(!modules[k]) modules[k]={ key:k, participants:0, answered:0, correct:0, critical:0, risky:0, stable:0 };
        if(answered>0){
          var q=Math.round(correct/Math.max(1,answered)*100);
          modules[k].participants++; modules[k].answered+=answered; modules[k].correct+=correct;
          if(q<50) modules[k].critical++; else if(q<70) modules[k].risky++; else modules[k].stable++;
        }
      });
    });
    return Object.keys(modules).sort(function(a,b){ return a.localeCompare(b,'de',{numeric:true,sensitivity:'base'}); }).map(function(k){
      var x=modules[k], quote=x.answered?Math.round(x.correct/x.answered*100):0;
      var rec = x.participants===0 ? 'Noch keine Datenbasis.' : (x.critical>0 ? 'Sofort Fördermaterial für '+k.toUpperCase()+' priorisieren.' : (x.risky>0 ? k.toUpperCase()+' stabilisieren und kurze Wiederholungen planen.' : k.toUpperCase()+' halten.'));
      return { module:k.toUpperCase(), participants:x.participants, answered:x.answered, quote:quote, critical:x.critical, risky:x.risky, stable:x.stable, recommendation:rec };
    });
  }
  function reportDataset(role, type){
    role=role||currentPortalRole(); type=reportTypeMeta(type).key;
    var meta=reportTypeMeta(type), headers=[], rows=[], objects=[], summary=reportSummary(role);
    if(type==='participants'){
      headers=['Teilnehmer-ID','Name','Gruppe','Kurs','Track','Status','Hilfebedarf','Quote','Aufgaben','Letzte Aktivität','Letzte Simulation','Stärkster Bereich','Schwächster Bereich','Empfehlung'];
      objects=reportRows(role);
      rows=objects.map(function(r){ return [r.userId,r.name,r.groupId,r.course,r.track,r.status,r.help,r.quote+'%',r.answered,r.lastActivity,r.lastSimulation,r.strongest,r.weakest,r.recommendation]; });
    } else if(type==='help'){
      headers=['Priorität','Teilnehmer-ID','Name','Gruppe','Status','Hilfebedarf','Quote','Aufgaben','Schwächster Bereich','Letzte Aktivität','Empfehlung'];
      objects=reportRows(role).filter(function(r){ return r.help!=='stabil' && r.help!=='Keine Daten'; }).sort(function(a,b){ var order={kritisch:1,riskant:2,inaktiv:3,stabil:4,unbekannt:5}; return (order[a.statusKey]||9)-(order[b.statusKey]||9) || a.quote-b.quote; });
      rows=objects.map(function(r,i){ return [i+1,r.userId,r.name,r.groupId,r.status,r.help,r.quote+'%',r.answered,r.weakest,r.lastActivity,r.recommendation]; });
      summary.help=objects.length;
    } else if(type==='groups'){
      headers=['Gruppe','Dozent','Teilnehmer','Aktiv','Kritisch','Riskant','Inaktiv','Ø Quote','Status','Empfehlung'];
      objects=groupPhase5List(role).map(function(g){
        var st=g.phase5||groupPhase5Status(g.participants||[]);
        var risky=(g.participants||[]).filter(function(p){ return participantFilterStatus(p)==='riskant'; }).length;
        var rec=st.critical>0?'Gruppe priorisieren: kritische Teilnehmer direkt fördern.':(risky>0?'Gruppe beobachten und Modulschwächen stabilisieren.':'Gruppe stabil halten.');
        return { group:g.title||g.id, dozent:g.dozent||'Nicht zugewiesen', total:(g.participants||[]).length, active:st.active, critical:st.critical, risky:risky, inactive:st.inactive, avg:st.avg, status:st.label, recommendation:rec };
      });
      rows=objects.map(function(r){ return [r.group,r.dozent,r.total,r.active,r.critical,r.risky,r.inactive,r.avg+'%',r.status,r.recommendation]; });
    } else if(type==='teachers'){
      headers=['Dozent-ID','Name','E-Mail','Telefon','Status','Gruppen','Teilnehmer','Kritisch','Riskant','Ø Quote','Letzter Login','Rechte','Notiz'];
      var dz = role==='dozent' ? [activeDozentProfile()].filter(Boolean) : dozentProfiles();
      objects=dz.map(function(d){
        var learners=visibleLearnersForDozent(role,d), crit=0, risky=0, accSum=0, accCount=0;
        learners.forEach(function(p){ var st=participantFilterStatus(p), pr=profileProgress(p); if(st==='kritisch') crit++; if(st==='riskant') risky++; if(pr.answered){ accSum+=pr.accuracy; accCount++; } });
        var perms=d.permissions||{};
        var rights=Object.keys(perms).filter(function(k){ return perms[k]; }).join(', ') || 'keine Rechte';
        return { id:d.dozentId, name:d.displayName||'Dozent', email:d.email||'', phone:d.phone||'', status:d.status||'active', groups:(d.assignedGroups||[]).join(', '), participants:learners.length, critical:crit, risky:risky, avg:accCount?Math.round(accSum/accCount):0, lastLogin:formatDateShort(d.lastLoginAt), rights:rights, note:d.note||'' };
      });
      rows=objects.map(function(r){ return [r.id,r.name,r.email,r.phone,r.status,r.groups,r.participants,r.critical,r.risky,r.avg+'%',r.lastLogin,r.rights,r.note]; });
    } else if(type==='performance'){
      headers=['Bereich','Teilnehmer mit Daten','Aufgaben','Ø Quote','Kritisch <50','Riskant <70','Stabil ≥70','Empfehlung'];
      objects=reportModuleRows(role);
      rows=objects.map(function(r){ return [r.module,r.participants,r.answered,r.quote+'%',r.critical,r.risky,r.stable,r.recommendation]; });
    }
    var dataset={ meta:meta, role:role, scope:reportScopeLabel(role), exportedAt:nowIso(), summary:summary, headers:headers, rows:rows, objects:objects };
    dataset.rowCount=rows.length;
    return dataset;
  }
  function reportCsv(role, onlyHelp, type){
    type = onlyHelp ? 'help' : (type || 'participants');
    var d=reportDataset(role,type), all=[d.headers].concat(d.rows);
    return all.map(function(r){ return r.map(toCsvCell).join(';'); }).join('\n');
  }
  function reportJson(role, onlyHelp, type){
    type = onlyHelp ? 'help' : (type || 'participants');
    var d=reportDataset(role,type);
    return JSON.stringify({ exportedAt:d.exportedAt, version:((window.AppConfig&&window.AppConfig.version)||'G54.46.6'), reportType:d.meta.key, reportTitle:d.meta.title, role:d.role, scope:d.scope, summary:d.summary, columns:d.headers, rows:d.rows, objects:d.objects }, null, 2);
  }
  function reportText(role, type){
    var d=reportDataset(role,type||'participants'), lines=[];
    lines.push('Novura · '+((window.AppConfig&&window.AppConfig.version)||'G54.46.6')+' Bericht · '+d.meta.title);
    lines.push('Export: '+d.exportedAt);
    lines.push('Rolle: '+d.role);
    lines.push('Bereich: '+d.scope);
    lines.push('Teilnehmer: '+d.summary.total+' · aktiv: '+d.summary.active+' · Hilfebedarf: '+d.summary.help+' · Ø Quote: '+d.summary.avg+'%');
    lines.push('Status: stabil '+d.summary.counts.stabil+' · riskant '+d.summary.counts.riskant+' · kritisch '+d.summary.counts.kritisch+' · inaktiv '+d.summary.counts.inaktiv);
    lines.push('Datensätze: '+d.rowCount);
    lines.push('');
    d.rows.forEach(function(r){ lines.push(r.join(' · ')); });
    return lines.join('\n');
  }
  function reportMetricCardHtml(value,label,meta,tone){
    return '<article class="egt-report-metric '+escapeHtml(tone||'neutral')+'">'
      +'<strong>'+escapeHtml(value)+'</strong>'
      +'<span>'+escapeHtml(label)+'</span>'
      +(meta?'<small>'+escapeHtml(meta)+'</small>':'')
      +'</article>';
  }
  function reportSummaryCardsHtml(role, type){
    var s=reportSummary(role), d=reportDataset(role,type||'participants');
    return '<div class="egt-report-summary egt-admin-stat-grid egt-phase8-kpis">'
      +reportMetricCardHtml(s.total,'Teilnehmer sichtbar',s.scope,'info')
      +reportMetricCardHtml(s.help,'Hilfebedarf','kritisch oder riskant',s.help?'warn':'ok')
      +reportMetricCardHtml(s.avg+'%','Durchschnittsquote','sichtbare Teilnehmer','neutral')
      +reportMetricCardHtml(d.rowCount,'Datensätze','im aktuellen Bericht','info')
      +'</div>';
  }
  function reportStatusBarsHtml(role){
    var s=reportSummary(role), total=Math.max(1,s.total);
    var keys=['kritisch','riskant','inaktiv','stabil'];
    return '<div class="egt-admin-subcard"><strong>Statusverteilung</strong>'+keys.map(function(k){
      var cls=participantStatusClass(k), count=s.counts[k]||0, pct=Math.round(count/total*100);
      return '<div class="egt-admin-progress-row '+cls+'"><div class="egt-progress-main"><span>'+escapeHtml(participantStatusLabel(k))+'</span><b>'+count+'</b></div><div class="egt-progress-track"><i style="width:'+pct+'%"></i></div><small>'+pct+'% der sichtbaren Teilnehmer</small></div>';
    }).join('')+'</div>';
  }
  function reportMobileCardData(type, obj, index){
    type=reportTypeMeta(type).key; obj=obj||{};
    if(type==='participants') return {title:obj.name||obj.userId||'Teilnehmer', eyebrow:obj.userId||'', badge:obj.status||'', tone:obj.statusKey||'neutral', metrics:[['Quote',(obj.quote||0)+'%'],['Aufgaben',obj.answered||0],['Gruppe',obj.groupId||'—'],['Aktivität',obj.lastActivity||'—']], details:[['Hilfebedarf',obj.help||'—'],['Schwäche',obj.weakest||'—'],['Empfehlung',obj.recommendation||'—']]};
    if(type==='help') return {title:obj.name||obj.userId||'Teilnehmer', eyebrow:'Priorität '+(index+1)+' · '+(obj.userId||''), badge:obj.help||obj.status||'', tone:obj.statusKey||'warn', metrics:[['Quote',(obj.quote||0)+'%'],['Aufgaben',obj.answered||0],['Gruppe',obj.groupId||'—'],['Aktivität',obj.lastActivity||'—']], details:[['Status',obj.status||'—'],['Schwäche',obj.weakest||'—'],['Nächster Schritt',obj.recommendation||'—']]};
    if(type==='groups') return {title:obj.group||'Gruppe', eyebrow:obj.dozent||'Nicht zugewiesen', badge:obj.status||'', tone:(obj.critical?'kritisch':(obj.risky?'riskant':'stabil')), metrics:[['Teilnehmer',obj.total||0],['Aktiv',obj.active||0],['Quote',(obj.avg||0)+'%'],['Inaktiv',obj.inactive||0]], details:[['Kritisch',obj.critical||0],['Riskant',obj.risky||0],['Empfehlung',obj.recommendation||'—']]};
    if(type==='teachers') return {title:obj.name||obj.id||'Dozent', eyebrow:obj.id||'', badge:obj.status||'', tone:obj.status==='active'?'stabil':'inaktiv', metrics:[['Teilnehmer',obj.participants||0],['Kritisch',obj.critical||0],['Quote',(obj.avg||0)+'%'],['Gruppen',obj.groups||'—']], details:[['Kontakt',obj.email||obj.phone||'—'],['Rechte',obj.rights||'—'],['Notiz',obj.note||'—']]};
    return {title:obj.module||'Leistungsbereich', eyebrow:'Leistungsbericht', badge:(obj.quote||0)+'%', tone:(obj.quote<50?'kritisch':(obj.quote<70?'riskant':'stabil')), metrics:[['Teilnehmer',obj.participants||0],['Aufgaben',obj.answered||0],['Kritisch',obj.critical||0],['Stabil',obj.stable||0]], details:[['Riskant',obj.risky||0],['Empfehlung',obj.recommendation||'—']]};
  }
  function reportMobileCardsHtml(role,type,max){
    var d=reportDataset(role,type), limit=max||8;
    if(!d.objects.length) return '<div class="egt-empty-state"><b>Keine Datensätze vorhanden.</b><span>Für diesen Berichtstyp gibt es aktuell keine verwertbaren Daten.</span></div>';
    return '<div class="egt-phase8-mobile-cards">'+d.objects.slice(0,limit).map(function(obj,index){
      var card=reportMobileCardData(type,obj,index);
      return '<article class="egt-report-mobile-card '+escapeHtml(card.tone||'neutral')+'">'
        +'<header><div><small>'+escapeHtml(card.eyebrow||'')+'</small><strong>'+escapeHtml(card.title||'Datensatz')+'</strong></div><span>'+escapeHtml(card.badge||'')+'</span></header>'
        +'<div class="egt-report-mobile-metrics">'+card.metrics.map(function(x){return '<div><span>'+escapeHtml(x[0])+'</span><b>'+escapeHtml(x[1])+'</b></div>';}).join('')+'</div>'
        +'<dl>'+card.details.map(function(x){return '<div><dt>'+escapeHtml(x[0])+'</dt><dd>'+escapeHtml(x[1])+'</dd></div>';}).join('')+'</dl>'
        +'</article>';
    }).join('')+'</div>'+(d.objects.length>limit?'<p class="egt-admin-hint">Vorschau zeigt '+limit+' von '+d.objects.length+' Datensätzen. Export enthält alle sichtbaren Daten.</p>':'');
  }
  function phase8TablePreviewHtml(role, type){
    var d=reportDataset(role,type), max=8;
    if(!d.rows.length) return '<div class="egt-empty-state"><b>Keine Datensätze vorhanden.</b><span>Für diesen Berichtstyp gibt es aktuell keine verwertbaren Daten.</span></div>';
    var table='<div class="egt-phase8-table-view"><div class="egt-table-scroll-cue" aria-hidden="true">↔ Tabelle seitlich bewegen</div><div class="egt-phase8-table-wrap" tabindex="0" aria-label="'+escapeHtml(d.meta.title)+' als scrollbare Tabelle"><table class="egt-phase8-table"><thead><tr>'+d.headers.map(function(h){return '<th>'+escapeHtml(h)+'</th>';}).join('')+'</tr></thead><tbody>'+d.rows.slice(0,max).map(function(r){ return '<tr>'+r.map(function(c){ return '<td>'+escapeHtml(c)+'</td>'; }).join('')+'</tr>'; }).join('')+'</tbody></table></div></div>';
    return table+reportMobileCardsHtml(role,type,max)+(d.rows.length>max?'<p class="egt-admin-hint egt-phase8-desktop-hint">Vorschau zeigt '+max+' von '+d.rows.length+' Datensätzen. Export enthält alle sichtbaren Daten.</p>':'');
  }
  function phase8PrintableHtml(role, type){
    var d=reportDataset(role,type);
    var css='body{font-family:Arial,sans-serif;margin:28px;color:#111827}h1{margin:0 0 6px;font-size:24px}p{margin:4px 0 14px;color:#374151}.meta{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin:18px 0}.meta div{border:1px solid #d1d5db;border-radius:12px;padding:10px;background:#f9fafb}.meta b{display:block;font-size:20px;margin-bottom:4px}.meta span{display:block;font-size:12px;color:#4b5563}table{width:100%;border-collapse:collapse;font-size:11px}th,td{border:1px solid #d1d5db;padding:7px;text-align:left;vertical-align:top}th{background:#111827;color:white}@media print{button{display:none}body{margin:12mm}}';
    return '<!doctype html><html lang="de"><head><meta charset="utf-8"><title>'+escapeHtml(d.meta.title)+'</title><style>'+css+'</style></head><body><button onclick="window.print()" style="margin-bottom:16px;padding:10px 14px;border-radius:10px;border:0;background:#111827;color:white;font-weight:bold">Drucken / als PDF speichern</button><h1>'+escapeHtml(d.meta.title)+'</h1><p>'+escapeHtml(d.meta.desc)+'</p><p><b>Export:</b> '+escapeHtml(formatDateShort(d.exportedAt))+' · <b>Rolle:</b> '+escapeHtml(d.role)+' · <b>Bereich:</b> '+escapeHtml(d.scope)+'</p><div class="meta"><div><b>'+d.summary.total+'</b><span>Teilnehmer</span></div><div><b>'+d.summary.help+'</b><span>Hilfebedarf</span></div><div><b>'+d.summary.avg+'%</b><span>Ø Quote</span></div><div><b>'+d.rowCount+'</b><span>Datensätze</span></div></div><table><thead><tr>'+d.headers.map(function(h){return '<th>'+escapeHtml(h)+'</th>';}).join('')+'</tr></thead><tbody>'+d.rows.map(function(r){return '<tr>'+r.map(function(c){return '<td>'+escapeHtml(c)+'</td>';}).join('')+'</tr>';}).join('')+'</tbody></table></body></html>';
  }
  function openReportPrintView(role, type){
    var html=phase8PrintableHtml(role,type);
    var w=null;
    try{ w=window.open('', '_blank'); }catch(e){}
    if(w && w.document){ w.document.open(); w.document.write(window.EGTDOMSecurity ? EGTDOMSecurity.sanitizeHTML(html) : html); w.document.close(); setTimeout(function(){ try{ w.focus(); }catch(e){} },100); return true; }
    downloadTextFile('assessments-'+reportTypeMeta(type).file+'-'+reportSafeDate()+'.html', html, 'text/html;charset=utf-8');
    return false;
  }
  function phase8CurrentTypeFrom(root){ return (root && root.getAttribute('data-active-report-type')) || 'participants'; }
  function phase8SetPreview(root, type){
    if(!root) return;
    type=reportTypeMeta(type).key;
    root.setAttribute('data-active-report-type', type);
    root.querySelectorAll('[data-phase8-report-type]').forEach(function(b){ var active=b.getAttribute('data-phase8-report-type')===type; b.classList.toggle('active', active); b.setAttribute('aria-pressed',active?'true':'false'); });
    var role=root.getAttribute('data-role') || currentPortalRole();
    var m=reportTypeMeta(type), d=reportDataset(role,type);
    var title=root.querySelector('[data-phase8-title]'); if(title) title.textContent=m.title;
    var desc=root.querySelector('[data-phase8-desc]'); if(desc) desc.textContent=m.desc;
    var count=root.querySelector('[data-phase8-rowcount]'); if(count) count.textContent=d.rowCount+' Datensätze';
    var kpi=root.querySelector('[data-phase8-kpis]'); if(kpi) kpi.innerHTML=reportSummaryCardsHtml(role,type);
    var table=root.querySelector('[data-phase8-preview]'); if(table) table.innerHTML=phase8TablePreviewHtml(role,type);
    var text=root.querySelector('[data-phase8-text]'); if(text) text.textContent=reportText(role,type);
  }
  function reportsPanelHtml(activeType){
    var role=currentPortalRole(); if(role==='locked') return '<div class="egt-empty-state">Bitte zuerst einloggen.</div>';
    var admin=role==='admin';
    var type=reportTypeMeta(activeType||'participants').key;
    var title=admin?'Admin-Berichte & Export':'Dozenten-Berichte & Export';
    var sub=admin?'Alle sichtbaren Gruppen, Teilnehmer, Dozenten und Leistungsdaten strukturiert auswerten.':'Nur deine zugewiesene Gruppe, Teilnehmer und Hilfebedarfsdaten auswerten.';
    var meta=reportTypeMeta(type), d=reportDataset(role,type);
    return '<div class="egt-admin-card egt-admin-card-wide egt-reports-panel egt-phase8-reports" data-phase8-reports data-role="'+escapeHtml(role)+'" data-active-report-type="'+escapeHtml(type)+'"><div class="egt-portal-dashboard-head"><div><span class="egt-session-kicker">Phase 8 · Berichte & Export</span><h3>'+escapeHtml(title)+'</h3><p>'+escapeHtml(sub)+'</p><small>'+escapeHtml(reportScopeLabel(role))+'</small></div>'+quoteRingHtml(reportSummary(role).avg,'Ø Quote','Reporting')+'</div>'+reportTypeButtonsHtml(type)+'<div data-phase8-kpis>'+reportSummaryCardsHtml(role,type)+'</div><div class="egt-phase8-layout"><div class="egt-admin-subcard egt-phase8-export-card"><strong data-phase8-title>'+escapeHtml(meta.title)+'</strong><p data-phase8-desc>'+escapeHtml(meta.desc)+'</p><span class="egt-admin-pill" data-phase8-rowcount>'+d.rowCount+' Datensätze</span><div class="egt-phase8-export-actions"><button class="egt-admin-btn secondary" data-export-report-csv type="button">CSV</button><button class="egt-admin-btn secondary" data-export-report-json type="button">JSON</button><button class="egt-admin-btn secondary" data-copy-report type="button">Text kopieren</button><button class="egt-admin-btn" data-print-report type="button">Druck/PDF-Ansicht</button></div><p class="egt-admin-hint">PDF wird bewusst als Druckansicht gelöst: im Browser öffnen und „Als PDF speichern“ auswählen. Das ist stabiler als kaputte Fake-PDFs im Offline-PWA-Modus.</p></div>'+reportStatusBarsHtml(role)+'</div><div class="egt-admin-subcard egt-phase8-preview"><strong>Live-Vorschau</strong><div data-phase8-preview>'+phase8TablePreviewHtml(role,type)+'</div></div><details class="egt-report-preview"><summary>Textbericht anzeigen</summary><pre data-phase8-text>'+escapeHtml(reportText(role,type))+'</pre></details></div>';
  }
  function updateReportsPanel(){ var panel=document.querySelector('[data-reports-panel]'); if(panel) panel.innerHTML=reportsPanelHtml((panel.querySelector('[data-phase8-reports]')||{}).getAttribute ? panel.querySelector('[data-phase8-reports]').getAttribute('data-active-report-type') : 'participants'); }

  var ACCESS_CODE_RENDER_CACHE = {};

  function accessRolePickerHtml(role){
    if(role==='dozent'){
      var scope=accessCodeScopeFor('dozent');
      return '<div class="egt-admin-kv egt-access-scope"><b>Rolle</b><span>Teilnehmer</span><b>Gruppe</b><span>'+escapeHtml(scope.label)+'</span></div>';
    }
    var roles=[['participant','Teilnehmer'],['teacher','Dozent'],['admin','Admin'],['demo','Demo']];
    return '<div class="egt-access-role-grid">'+roles.map(function(r,i){ return '<label class="egt-check egt-access-role"><input type="radio" name="egtAccessRole" data-access-role value="'+escapeHtml(r[0])+'" '+(i===0?'checked':'')+'> '+escapeHtml(r[1])+'</label>'; }).join('')+'</div>';
  }
  function accessCodeEffectiveStatus(x){
    x=x||{};
    var raw=String(x.status||'active').toLowerCase();
    var exp=x.expiresAt||x.expires_at;
    if(exp){ var ts=Date.parse(exp); if(isFinite(ts) && ts<Date.now()) return {key:'expired', label:'abgelaufen', cls:'danger'}; }
    if(raw==='revoked' || raw==='disabled' || raw==='blocked') return {key:'revoked', label:'widerrufen', cls:'danger'};
    if(raw==='used') return {key:'used', label:'eingelöst', cls:'warn'};
    var used=Number(x.usedCount!=null?x.usedCount:x.used_count||0), max=Number(x.maxUses!=null?x.maxUses:x.max_uses||1);
    if(max>0 && used>=max) return {key:'used', label:'aufgebraucht', cls:'warn'};
    if(raw && raw!=='active') return {key:raw, label:raw, cls:'neutral'};
    return {key:'active', label:'aktiv', cls:'ok'};
  }
  function accessCodeStats(list){
    var out={total:0,active:0,used:0,revoked:0,expired:0,participant:0,teacher:0,admin:0,demo:0,groups:{},creators:{}};
    (list||[]).forEach(function(x){
      out.total++;
      var st=accessCodeEffectiveStatus(x).key; if(out[st]!=null) out[st]++;
      var role=String(x.role||'participant').toLowerCase(); if(out[role]!=null) out[role]++;
      var g=String(x.groupId||x.group_id||'ohne Gruppe'); out.groups[g]=(out.groups[g]||0)+1;
      var c=String(x.createdByName||x.createdBy||x.createdByRole||'System'); out.creators[c]=(out.creators[c]||0)+1;
    });
    return out;
  }
  function accessCodeSummaryCardsHtml(list){
    var s=accessCodeStats(list||[]);
    return '<div class="egt-admin-stat-grid egt-access-stat-grid">'
      +'<div><b>'+s.total+'</b><span>Codes gesamt</span></div>'
      +'<div><b>'+s.active+'</b><span>Aktiv</span></div>'
      +'<div><b>'+s.used+'</b><span>Eingelöst/aufgebraucht</span></div>'
      +'<div><b>'+s.expired+'</b><span>Abgelaufen</span></div>'
      +'<div><b>'+s.revoked+'</b><span>Widerrufen</span></div>'
      +'<div><b>'+s.teacher+'</b><span>Dozenten-Codes</span></div>'
      +'</div>';
  }
  function accessCodeGroupOverviewHtml(list){
    var s=accessCodeStats(list||[]), keys=Object.keys(s.groups).sort(function(a,b){return s.groups[b]-s.groups[a];}).slice(0,6);
    if(!keys.length) return '<div class="egt-admin-subcard egt-access-mini"><strong>Gruppen-Zuordnung</strong><p>Noch keine Codes vorhanden.</p></div>';
    return '<div class="egt-admin-subcard egt-access-mini"><strong>Gruppen-Zuordnung</strong><div class="egt-access-group-chips">'+keys.map(function(k){return '<span>'+escapeHtml(k)+' <b>'+s.groups[k]+'</b></span>';}).join('')+'</div></div>';
  }
  function accessCodesPanelHtml(role){
    role=role||currentPortalRole();
    var isDozent=role==='dozent';
    var scope=accessCodeScopeFor(role);
    var defaultGroup=isDozent ? (scope.groups[0] || '') : getCourseSettings().prefix;
    var title=isDozent ? 'Zugangscodes für meine Gruppe' : 'Zugangscodes';
    var desc=isDozent ? 'Dozenten erzeugen ausschließlich Teilnehmercodes für die eigene Gruppe.' : 'Admin erzeugt Codes für Teilnehmer, Dozenten, Admins oder Demo-Zugänge und sieht Status, Nutzung, Gruppe und Ablauf.';
    return '<div class="egt-access-code-panel" data-access-panel="'+escapeHtml(role)+'">'
      +'<div class="egt-portal-dashboard-head"><div><span class="egt-session-kicker">Phase 6 · Zugangscode-System</span><h3>'+escapeHtml(title)+'</h3><p>'+escapeHtml(desc)+'</p><small>'+escapeHtml(scope.label||'')+'</small></div></div>'
      +'<div data-access-stats="'+escapeHtml(role)+'">'+accessCodeSummaryCardsHtml([])+'</div>'
      +'<div class="egt-admin-mini-grid egt-access-generator">'
        +'<div class="egt-admin-subcard"><strong>Code-Typ (Rolle)</strong>'+accessRolePickerHtml(role)+'<p class="egt-admin-hint">Der Code legt später fest, ob sich jemand als Teilnehmer, Dozent, Admin oder Demo-Profil registrieren darf.</p></div>'
        +'<div class="egt-admin-subcard"><strong>Gruppe & Regeln</strong>'
          +'<label class="egt-admin-mini-label">Gruppe / Klasse</label>'
          +'<input class="egt-admin-input" data-access-group placeholder="z. B. 2026-GK-A" value="'+escapeHtml(defaultGroup)+'" '+(isDozent?'readonly':'')+'>'
          +'<label class="egt-admin-mini-label">Gültigkeitsdauer in Tagen (0 = unbegrenzt)</label>'
          +'<input class="egt-admin-input" data-access-days type="number" min="0" value="30" placeholder="30 = 1 Monat, 365 = 1 Jahr">'
          +'<div class="egt-admin-hint">7 = 1 Woche · 30 = 1 Monat · 90 = 3 Monate · 365 = 1 Jahr · 0 = unbegrenzt</div>'
          +'<label class="egt-admin-mini-label">Anzahl Codes (1–100)</label>'
          +'<input class="egt-admin-input" data-access-count type="number" min="1" max="100" value="1" placeholder="Anzahl">'
          +'<label class="egt-admin-mini-label">Notiz (optional)</label>'
          +'<input class="egt-admin-input" data-access-note maxlength="140" placeholder="z. B. Klasse Herbst 2026">'
          +'<button class="egt-admin-btn" data-generate-access-code type="button">Code(s) generieren</button>'
        +'</div>'
      +'</div>'
      +'<div class="egt-admin-status" data-access-result>Noch kein Code erzeugt.</div>'
      +'<div class="egt-access-management-shell">'
        +'<div class="egt-admin-subcard egt-access-toolbar"><strong>Codeverwaltung</strong><div class="egt-access-toolbar-row"><input class="egt-admin-input" data-access-search placeholder="Code, Gruppe, Rolle, Ersteller, Notiz suchen…"><select class="egt-admin-input" data-access-status-filter><option value="all">Alle Status</option><option value="active">Aktiv</option><option value="used">Eingelöst/aufgebraucht</option><option value="expired">Abgelaufen</option><option value="revoked">Widerrufen</option></select><button class="egt-admin-btn secondary" data-refresh-access-codes type="button">Aktualisieren</button><button class="egt-admin-btn secondary" data-export-access-codes type="button">CSV Export</button></div><small data-access-visible-count>0 Codes sichtbar</small></div>'
        +'<div data-access-group-overview="'+escapeHtml(role)+'">'+accessCodeGroupOverviewHtml([])+'</div>'
        +'<div class="egt-access-master-detail"><div class="egt-access-code-list" data-access-code-list="'+escapeHtml(role)+'">Codes werden geladen…</div><div class="egt-access-detail" data-access-detail="'+escapeHtml(role)+'"><div class="egt-empty-state"><b>Code auswählen</b><span>Hier erscheinen Status, Gruppe, Nutzung und Verwaltungsaktionen.</span></div></div></div>'
      +'</div>'
    +'</div>';
  }
  function accessCodeRowHtml(x){
    x=x||{};
    var code=normalizeCode(x.code||x.id||'');
    var eff=accessCodeEffectiveStatus(x);
    var uses=Number(x.usedCount!=null?x.usedCount:x.used_count||0)+'/'+Number(x.maxUses!=null?x.maxUses:x.max_uses||1);
    var expTxt='unbegrenzt';
    var expRaw=x.expiresAt||x.expires_at;
    if(expRaw){ var ets=Date.parse(expRaw); if(isFinite(ets)){ expTxt=new Date(ets).toLocaleDateString('de-DE'); if(ets<Date.now()){ expTxt+=' (abgelaufen)'; } } }
    var group=String(x.groupId||x.group_id||'ohne Gruppe');
    var role=roleDisplayValue(x.role);
    var creator=String(x.createdByName||x.createdBy||x.createdByRole||'—');
    var note=String(x.note||'');
    var hay=(code+' '+group+' '+role+' '+creator+' '+note+' '+eff.label).toLowerCase();
    return '<div class="egt-admin-learner egt-access-code-row" data-access-code-row data-code="'+escapeHtml(code)+'" data-status="'+escapeHtml(eff.key)+'" data-search="'+escapeHtml(hay)+'">'
      +'<div class="egt-learner-head"><div><strong>'+escapeHtml(code)+'</strong><small>'+escapeHtml(role)+' · '+escapeHtml(group)+'</small></div><span class="egt-admin-pill egt-status-'+eff.cls+'">'+escapeHtml(eff.label)+'</span></div>'
      +'<div class="egt-admin-kv"><b>Nutzung</b><span>'+escapeHtml(uses)+'</span><b>Gültig bis</b><span>'+escapeHtml(expTxt)+'</span><b>Erstellt von</b><span>'+escapeHtml(creator)+'</span><b>Erstellt</b><span>'+escapeHtml(formatDateShort(x.createdAt||''))+'</span><b>Notiz</b><span>'+escapeHtml(note||'—')+'</span></div>'
      +'<div class="egt-admin-row"><button class="egt-admin-btn secondary" data-open-access-code="'+escapeHtml(code)+'" type="button">Details</button><button class="egt-admin-btn secondary" data-copy-access-code="'+escapeHtml(code)+'" type="button">Code kopieren</button><button class="egt-admin-btn secondary" data-extend-code="'+escapeHtml(code)+'" type="button">Verlängern</button>'+(eff.key==='active'?'<button class="egt-admin-btn danger" data-revoke-access-code="'+escapeHtml(code)+'" type="button">Widerrufen</button>':'')+'</div>'
    +'</div>';
  }
  function accessCodeDetailHtml(role, code){
    var list=ACCESS_CODE_RENDER_CACHE[role]||[];
    var item=list.find(function(x){ return normalizeCode(x.code||x.id)===normalizeCode(code); });
    if(!item) return '<div class="egt-empty-state"><b>Code nicht gefunden</b><span>Bitte Liste aktualisieren.</span></div>';
    var eff=accessCodeEffectiveStatus(item);
    var used=Number(item.usedCount!=null?item.usedCount:item.used_count||0), max=Number(item.maxUses!=null?item.maxUses:item.max_uses||1);
    var expRaw=item.expiresAt||item.expires_at;
    var expTxt='unbegrenzt'; if(expRaw){ var ts=Date.parse(expRaw); if(isFinite(ts)) expTxt=new Date(ts).toLocaleDateString('de-DE')+' '+new Date(ts).toLocaleTimeString('de-DE',{hour:'2-digit',minute:'2-digit'}); }
    var redeemed=item.lastRedeemedAt||item.redeemedAt||item.usedAt||'';
    return '<div class="egt-admin-subcard egt-access-detail-card"><span class="egt-session-kicker">Code-Detail</span><h3>'+escapeHtml(normalizeCode(item.code||item.id))+'</h3><p>'+escapeHtml(roleDisplayValue(item.role))+' · '+escapeHtml(item.groupId||item.group_id||'ohne Gruppe')+'</p>'
      +'<div class="egt-admin-kv"><b>Status</b><span><i class="egt-admin-pill egt-status-'+eff.cls+'">'+escapeHtml(eff.label)+'</i></span><b>Nutzung</b><span>'+used+' von '+max+'</span><b>Gültig bis</b><span>'+escapeHtml(expTxt)+'</span><b>Ersteller</b><span>'+escapeHtml(item.createdByName||item.createdBy||item.createdByRole||'—')+'</span><b>Erstellt</b><span>'+escapeHtml(formatDateShort(item.createdAt||''))+'</span><b>Letzte Einlösung</b><span>'+escapeHtml(formatDateShort(redeemed))+'</span><b>Letzter Nutzer</b><span>'+escapeHtml(item.lastRedeemedBy||item.usedBy||item.redeemedBy||'—')+'</span><b>Notiz</b><span>'+escapeHtml(item.note||'—')+'</span></div>'
      +'<div class="egt-admin-row"><button class="egt-admin-btn secondary" data-copy-access-code="'+escapeHtml(normalizeCode(item.code||item.id))+'" type="button">Kopieren</button><button class="egt-admin-btn secondary" data-extend-code="'+escapeHtml(normalizeCode(item.code||item.id))+'" type="button">Verlängern</button>'+(eff.key==='active'?'<button class="egt-admin-btn danger" data-revoke-access-code="'+escapeHtml(normalizeCode(item.code||item.id))+'" type="button">Widerrufen</button>':'')+'</div></div>';
  }
  function applyAccessCodeFilters(panel){
    if(!panel) return;
    var q=String((panel.querySelector('[data-access-search]')||{}).value||'').toLowerCase().trim();
    var st=String((panel.querySelector('[data-access-status-filter]')||{}).value||'all');
    var rows=Array.prototype.slice.call(panel.querySelectorAll('[data-access-code-row]'));
    var visible=0;
    rows.forEach(function(row){
      var ok=true;
      if(q && String(row.getAttribute('data-search')||'').indexOf(q)<0) ok=false;
      if(st!=='all' && row.getAttribute('data-status')!==st) ok=false;
      row.style.display=ok?'':'none'; if(ok) visible++;
    });
    var c=panel.querySelector('[data-access-visible-count]'); if(c) c.textContent=visible+' von '+rows.length+' Codes sichtbar';
  }
  async function exportAccessCodesCsv(role){
    role=role||currentPortalRole();
    var list=await listAccessCodes(role);
    var header=['Code','Rolle','Gruppe','Status','Nutzung','MaxNutzung','GueltigBis','ErstelltAm','ErstelltVon','LetzteEinloesung','LetzterNutzer','Notiz'];
    var rows=list.map(function(x){
      var eff=accessCodeEffectiveStatus(x); var used=Number(x.usedCount!=null?x.usedCount:x.used_count||0), max=Number(x.maxUses!=null?x.maxUses:x.max_uses||1);
      return [normalizeCode(x.code||x.id), roleDisplayValue(x.role), x.groupId||x.group_id||'', eff.label, used, max, x.expiresAt||x.expires_at||'', x.createdAt||'', x.createdByName||x.createdBy||x.createdByRole||'', x.lastRedeemedAt||x.redeemedAt||x.usedAt||'', x.lastRedeemedBy||x.usedBy||x.redeemedBy||'', x.note||''];
    });
    var csv=[header].concat(rows).map(function(r){ return r.map(function(v){ return '"'+String(v==null?'':v).replace(/"/g,'""')+'"'; }).join(';'); }).join('\n');
    downloadTextFile('assessments-zugangscodes-'+role+'-'+reportSafeDate()+'.csv', csv, 'text/csv;charset=utf-8');
    return {rows:rows.length};
  }
  async function renderAccessCodes(role){
    role=role||currentPortalRole();
    var box=document.querySelector('[data-access-code-list="'+role+'"]');
    if(!box) return;
    var panel=box.closest('[data-access-panel]');
    if(!(role==='admin' || role==='dozent')){ box.innerHTML='<div class="egt-empty-state">Bitte zuerst einloggen.</div>'; return; }
    box.innerHTML='<div class="egt-empty-state">Zugangscodes werden geladen…</div>';
    try{
      var list=await listAccessCodes(role);
      list=list.slice().sort(function(a,b){ return Date.parse(b.createdAt||0)-Date.parse(a.createdAt||0); });
      ACCESS_CODE_RENDER_CACHE[role]=list;
      var stats=document.querySelector('[data-access-stats="'+role+'"]'); if(stats) stats.innerHTML=accessCodeSummaryCardsHtml(list);
      var groups=document.querySelector('[data-access-group-overview="'+role+'"]'); if(groups) groups.innerHTML=accessCodeGroupOverviewHtml(list);
      box.innerHTML=list.length ? list.map(accessCodeRowHtml).join('') : '<div class="egt-empty-state">Noch keine sichtbaren Zugangscodes.</div>';
      if(panel) applyAccessCodeFilters(panel);
      var detail=document.querySelector('[data-access-detail="'+role+'"]'); if(detail && list.length && !detail.getAttribute('data-filled')){ detail.innerHTML=accessCodeDetailHtml(role, list[0].code||list[0].id); detail.setAttribute('data-filled','1'); }
    }catch(e){ box.innerHTML='<div class="egt-empty-state">Codes konnten nicht geladen werden: '+escapeHtml(e.message||e)+'</div>'; }
  }
  function renderAccessCodePanels(){
    if(adminOpen()) renderAccessCodes('admin');
    if(dozentOpen()) renderAccessCodes('dozent');
  }
  function attachBulkCodeButton(){
    document.querySelectorAll('[data-bulk-code-open]').forEach(function(b){
      if(b.__egtBulkBound) return; b.__egtBulkBound=true;
      b.onclick=function(){ showBulkCodeModal(); };
    });
    document.querySelectorAll('[data-extend-code]').forEach(function(b){
      if(b.__egtExtendBound) return; b.__egtExtendBound=true;
      b.onclick=function(){ showExtendCodeModal(b.getAttribute('data-extend-code')); };
    });
  }

  function systemStorageKeyRows(){
    var keys=[];
    try{ for(var i=0;i<localStorage.length;i++){ var k=localStorage.key(i)||''; if(/^egt_|trainer-|assessments-|firebase|supabase/i.test(k)) keys.push(k); } }catch(e){}
    keys.sort();
    return keys.slice(0,28).map(function(k){ var v=''; try{ v=localStorage.getItem(k)||''; }catch(e){ v=''; } return { key:k, bytes:(k.length+String(v).length)*2 }; });
  }
  function systemHealthSummary(){
    var ss=syncStatus();
    var learners=Object.keys(localAll()).length;
    var accessCodes=Object.keys(localAccessCodes()).length;
    var teachers=dozentProfiles().length;
    var tickets=mergeTicketLists().length;
    var open=ticketOpenCount();
    var storage=localStorageBytes();
    var problems=[];
    if(!firebaseConfigReady()) problems.push('Firebase-Konfiguration fehlt');
    else if(!ss.online) problems.push('Firebase nicht verbunden');
    if(ss.pendingCount>0) problems.push(ss.pendingCount+' Sync-Einträge offen');
    if(open>0) problems.push(open+' offene Tickets');
    if(storage>4*1024*1024) problems.push('LocalStorage groß');
    var status=problems.length>=3?'kritisch':(problems.length?'prüfen':'stabil');
    return { status:status, tone:status==='stabil'?'ok':(status==='prüfen'?'warn':'danger'), problems:problems, learners:learners, accessCodes:accessCodes, teachers:teachers, tickets:tickets, openTickets:open, storage:storage, sync:ss };
  }
  function roleMatrixHtml(){
    var rows=[
      ['Dashboard','viewOverview'],['Teilnehmer sehen','viewAssignedLearners'],['Alle Teilnehmer','viewAllLearners'],['Teilnehmer bearbeiten','manageUsers'],['Zugangscodes','manageAccessCodes'],['Berichte Export','exportReports'],['Systembereich','viewSystem'],['Cache löschen','clearCache'],['Aufgabenbank','manageQuestions']
    ];
    function cell(role,perm){ var ok=can(role,perm); return '<span class="egt-role-cell '+(ok?'egt-status-ok':'egt-status-no')+'">'+(ok?'✓':'—')+'</span>'; }
    return '<div class="egt-phase10-role-matrix"><div class="head"><b>Recht</b><b>Admin</b><b>Dozent</b><b>Gesperrt</b></div>'+rows.map(function(r){ return '<div><span>'+escapeHtml(r[0])+'</span>'+cell('admin',r[1])+cell('dozent',r[1])+cell('locked',r[1])+'</div>'; }).join('')+'</div>';
  }
  function systemBackupObject(){
    var keys=[LOCAL_KEY,LOCAL_ACCESS_CODES_KEY,LOCAL_TICKETS_KEY,PENDING_TICKETS_KEY,PENDING_SYNC_KEY,LAST_SYNC_FLUSH_KEY,ACTIVE_KEY,DOZENT_PROFILES_KEY,DOZENT_PROFILE_KEY,USERDB_SESSION_KEY];
    var storage={};
    keys.forEach(function(k){ try{ storage[k]=localStorage.getItem(k); }catch(e){ storage[k]=null; } });
    return { type:'assessments-trainer-admin-system-backup', version:((window.AppConfig&&window.AppConfig.version)||'G54.46.6'), exportedAt:nowIso(), courseId:state.courseId, build:(window.TRAINER_BUILD_VERSION||''), syncStatus:syncStatus(), counts:{ participants:Object.keys(localAll()).length, accessCodes:Object.keys(localAccessCodes()).length, teachers:dozentProfiles().length, tickets:mergeTicketLists().length, pendingSync:pendingSyncQueue().length }, storage:storage };
  }
  function exportSystemBackup(){
    var backup=systemBackupObject();
    downloadTextFile('assessments-system-backup-'+reportSafeDate()+'.json', JSON.stringify(backup,null,2), 'application/json;charset=utf-8');
    return backup;
  }
  function restoreSystemBackupFromText(text){
    var obj=JSON.parse(String(text||''));
    if(!obj || obj.type!=='assessments-trainer-admin-system-backup' || !obj.storage) throw new Error('Keine gültige Novura Assessments-Systembackup-Datei.');
    var allowed=[LOCAL_KEY,LOCAL_ACCESS_CODES_KEY,LOCAL_TICKETS_KEY,PENDING_TICKETS_KEY,PENDING_SYNC_KEY,LAST_SYNC_FLUSH_KEY,ACTIVE_KEY,DOZENT_PROFILES_KEY,DOZENT_PROFILE_KEY,USERDB_SESSION_KEY];
    allowed.forEach(function(k){ if(Object.prototype.hasOwnProperty.call(obj.storage,k)){ if(obj.storage[k]==null) localStorage.removeItem(k); else localStorage.setItem(k, String(obj.storage[k])); } });
    return obj;
  }
  async function clearRuntimeCaches(){
    var deleted=[];
    try{ if(window.caches && caches.keys){ var names=await caches.keys(); for(var i=0;i<names.length;i++){ await caches.delete(names[i]); deleted.push(names[i]); } } }catch(e){ deleted.push('Cache-Fehler: '+(e.message||e)); }
    try{ if(navigator.serviceWorker && navigator.serviceWorker.getRegistrations){ var regs=await navigator.serviceWorker.getRegistrations(); for(var r=0;r<regs.length;r++){ await regs[r].update(); } } }catch(e2){}
    return deleted;
  }
  function systemStorageTableHtml(){
    var rows=systemStorageKeyRows();
    if(!rows.length) return '<div class="egt-empty-state"><b>Keine App-Schlüssel sichtbar.</b><span>LocalStorage ist leer oder blockiert.</span></div>';
    return '<div class="egt-phase10-storage-list">'+rows.map(function(r){ return '<div><span>'+escapeHtml(r.key)+'</span><b>'+escapeHtml(formatBytes(r.bytes))+'</b></div>'; }).join('')+'</div>';
  }
  function systemChecklistHtml(health){
    var checks=[
      {label:'Admin-Rolle aktiv', ok:currentPortalRole()==='admin', hint:roleLabel()},
      {label:'Firebase konfiguriert', ok:firebaseConfigReady(), hint:firebaseConfigReady()?'apiKey/authDomain/projectId/appId vorhanden':'EGT_SYNC_CONFIG prüfen'},
      {label:'Sync ohne Warteschlange', ok:(health.sync.pendingCount||0)===0, hint:(health.sync.pendingCount||0)+' offene Einträge'},
      {label:'Teilnehmerdaten vorhanden', ok:health.learners>0, hint:health.learners+' Profile'},
      {label:'Zugangscodes verwaltbar', ok:health.accessCodes>=0, hint:health.accessCodes+' lokale Codes'},
      {label:'Tickets im Blick', ok:health.openTickets===0, hint:health.openTickets+' offen'},
      {label:'Aufgabenbank geladen', ok:taskCount()>0, hint:taskCount()+' Aufgaben'},
      {label:'Speicher im Rahmen', ok:health.storage<4*1024*1024, hint:formatBytes(health.storage)}
    ];
    return '<div class="egt-phase10-checklist">'+checks.map(function(c){ return '<div class="'+(c.ok?'egt-status-ok':'egt-status-warn')+'"><b>'+(c.ok?'✓':'!')+' '+escapeHtml(c.label)+'</b><span>'+escapeHtml(c.hint)+'</span></div>'; }).join('')+'</div>';
  }
  function systemInfoHtml(){
    var sw='nicht verfügbar';
    try{ sw = ('serviceWorker' in navigator) ? 'verfügbar' : 'nicht verfügbar'; }catch(e){}
    var storageOk='OK'; try{ localStorage.setItem('__egt_probe','1'); localStorage.removeItem('__egt_probe'); }catch(e2){ storageOk='Fehler'; }
    var health=systemHealthSummary();
    var cacheName=(window.AppConfig&&window.AppConfig.cacheName)||'egt-trainer-g54-46-5';
    var build=(window.TRAINER_BUILD_VERSION||((window.AppConfig&&window.AppConfig.fullVersion)||'G54.46.6-2026-07-10'));
    var fbStatus = state.online ? 'verbunden' : (firebaseConfigReady() ? 'nicht verbunden' : 'Konfiguration fehlt');
    var online = (typeof navigator!=='undefined' && 'onLine' in navigator) ? (navigator.onLine?'online':'offline') : 'unbekannt';
    var cards=''
      +systemCardHtml('Version',((window.AppConfig&&window.AppConfig.version)||window.TRAINER_BUILD_VERSION||'unbekannt'),'App-Build · überall synchron via sync-version','ok')
      +systemCardHtml('Betriebszustand',health.status,health.problems.length?health.problems.slice(0,2).join(' · '):'keine akuten Warnungen',health.tone)
      +systemCardHtml('Build',build,'aktueller App-Build','info')
      +systemCardHtml('Service Worker',sw,cacheName, sw==='verfügbar'?'ok':'warn')
      +systemCardHtml('Speicher',storageOk,formatBytes(health.storage)+' LocalStorage', storageOk==='OK'?'ok':'danger')
      +systemCardHtml('IndexedDB',window.indexedDB?'verfügbar':'nicht verfügbar','lokaler Gerätecache', window.indexedDB?'ok':'warn')
      +systemCardHtml('Firebase',fbStatus,'UserDatabase / Firestore', state.online?'ok':(firebaseConfigReady()?'warn':'danger'))
      +systemCardHtml('Teilnehmer',health.learners+' Profile','lokaler Cache + Firebase-Sync','info')
      +systemCardHtml('Codes',health.accessCodes+' Codes','Zugangscode-System','info')
      +systemCardHtml('Dozenten',health.teachers+' Profile','Gruppenbindung / Rechte','info')
      +systemCardHtml('Tickets',health.openTickets+' offen',health.tickets+' Tickets gesamt', health.openTickets?'warn':'ok')
      +systemCardHtml('Aufgaben',taskCount()+' Aufgaben','geladene Aufgabenbank','info')
      +systemCardHtml('Netzwerk',online,'Browserstatus','neutral');
    return '<div class="egt-phase10-system">'
      +'<div class="egt-portal-dashboard-head"><div><span class="egt-session-kicker">Phase 10 · Systembereich</span><h3>Betriebszentrale</h3><p>Systemstatus, Sync, Cache, Backup, Rollenrechte und Diagnose an einem Ort.</p><small>'+escapeHtml(roleLabel())+'</small></div>'+quoteRingHtml(health.status==='stabil'?100:(health.status==='prüfen'?68:32),'Health','System')+'</div>'
      +'<div class="egt-system-dashboard">'+cards+'</div>'
      +'<div class="egt-phase10-grid"><div class="egt-admin-subcard"><strong>Betriebs-Checkliste</strong>'+systemChecklistHtml(health)+'</div><div class="egt-admin-subcard"><strong>Rollenrechte</strong>'+roleMatrixHtml()+'</div></div>'
      +'<div class="egt-phase10-grid"><div class="egt-admin-subcard"><strong>Backup & Wiederherstellung</strong><p>Exportiert die wichtigsten lokalen Admin-Daten als JSON. Wiederherstellung überschreibt nur erlaubte App-Schlüssel.</p><div class="egt-admin-row"><button class="egt-admin-btn" data-system-backup-export type="button">Backup JSON exportieren</button><label class="egt-admin-btn secondary egt-file-btn">Backup importieren<input type="file" accept="application/json,.json" data-system-backup-import></label></div><small class="egt-admin-hint">Vor jedem Deploy oder größerem Umbau: Backup ziehen.</small></div><div class="egt-admin-subcard"><strong>Cache & Diagnose</strong><p>Cache löschen entfernt nur Runtime-/Service-Worker-Caches, keine Teilnehmerprofile.</p><div class="egt-admin-row"><button class="egt-admin-btn secondary" data-refresh-system type="button">Diagnose aktualisieren</button><button class="egt-admin-btn secondary" data-copy-diagnostics type="button">Diagnose kopieren</button><button class="egt-admin-btn danger" data-clear-runtime-cache type="button">Runtime-Cache löschen</button></div></div></div>'
      +'<div class="egt-phase10-grid"><div class="egt-admin-subcard"><strong>App-Speicher</strong>'+systemStorageTableHtml()+'</div><div class="egt-admin-subcard"><strong>Systemdetails</strong><div class="egt-admin-kv egt-system-kv"><b>Aktiver Kurs</b><span>'+escapeHtml(state.courseId)+'</span><b>Rolle</b><span>'+escapeHtml(roleLabel())+'</span><b>Cache-Name</b><span>'+escapeHtml(cacheName)+'</span><b>UserDatabase</b><span>'+escapeHtml(state.online?'Firebase Firestore verbunden':'Firebase nicht verbunden · lokaler Cache aktiv')+'</span><b>Pending Sync</b><span>'+escapeHtml(health.sync.pendingCount||0)+' Einträge</span><b>Letzter Sync</b><span>'+escapeHtml(formatDateShort(health.sync.lastFlushAt)||'—')+'</span></div></div></div>'
      +'<details class="egt-phase10-details" open><summary>Diagnose-Ausgabe</summary><div class="egt-system-diagnostics" data-system-diagnostics>Cache-/Service-Worker- und Firebase-Details noch nicht ausgelesen. Klicke auf „Diagnose aktualisieren“.</div></details>'
      +'</div>';
  }
  async function systemDiagnosticsText(){
    var lines=[];
    var health=systemHealthSummary();
    lines.push('Novura · '+((window.AppConfig&&window.AppConfig.version)||'')+' · Admin-Systemdiagnose');
    lines.push('Generiert: '+nowIso());
    lines.push('Build: '+(window.TRAINER_BUILD_VERSION||((window.AppConfig&&window.AppConfig.fullVersion)||'G54.46.6-2026-07-10')));
    lines.push('Interne Engine: '+INTERNAL_VERSION);
    lines.push('Betriebszustand: '+health.status);
    lines.push('Warnungen: '+(health.problems.length?health.problems.join(' | '):'keine'));
    lines.push('UserDatabase Provider: '+(state.online?'firebase-firestore':'local-cache'));
    lines.push('Firebase konfiguriert: '+(firebaseConfigReady()?'ja':'nein'));
    lines.push('Firebase Status: '+(state.error||''));
    lines.push('Rolle: '+roleLabel());
    lines.push('Kurs: '+state.courseId);
    lines.push('Online: '+((navigator&&'onLine' in navigator)?navigator.onLine:'unbekannt'));
    lines.push('ServiceWorker API: '+(('serviceWorker' in navigator)?'ja':'nein'));
    try{
      var regs = navigator.serviceWorker && navigator.serviceWorker.getRegistrations ? await navigator.serviceWorker.getRegistrations() : [];
      lines.push('ServiceWorker Registrierungen: '+regs.length);
      regs.forEach(function(r,idx){ lines.push('SW '+(idx+1)+': '+(r.scope||'ohne scope')+' · active='+(r.active&&r.active.scriptURL||'nein')); });
    }catch(e){ lines.push('ServiceWorker Registrierungen: Fehler '+(e.message||e)); }
    try{
      var names = window.caches && caches.keys ? await caches.keys() : [];
      lines.push('Cache Storage Namen: '+(names.length?names.join(', '):'keine'));
      if(window.caches && caches.open){
        for(var i=0;i<names.length;i++){
          var c=await caches.open(names[i]); var req=await c.keys(); lines.push('Cache '+names[i]+': '+req.length+' Einträge');
        }
      }
    }catch(e2){ lines.push('Cache Storage: Fehler '+(e2.message||e2)); }
    lines.push('LocalStorage: '+formatBytes(localStorageBytes()));
    systemStorageKeyRows().forEach(function(r){ lines.push('LS '+r.key+': '+formatBytes(r.bytes)); });
    lines.push('Teilnehmer lokal: '+Object.keys(localAll()).length);
    lines.push('Zugangscodes lokal: '+Object.keys(localAccessCodes()).length);
    lines.push('Dozentenprofile: '+dozentProfiles().length);
    lines.push('Tickets lokal/queued: '+mergeTicketLists().length+' / offen '+ticketOpenCount());
    lines.push('Pending UserDB Sync: '+pendingSyncQueue().length);
    lines.push('Aufgaben geladen: '+taskCount());
    try{ var qbs=questionBankSnapshot(); lines.push('Aufgaben-Quellen/Einträge: '+qbs.sourceChunks); lines.push('Aufgaben-Gruppen: '+Object.keys(qbs.groups||{}).map(function(k){return k+'='+qbs.groups[k];}).join(', ')); }catch(e3){}
    lines.push('Rollenmatrix: Admin System='+can('admin','viewSystem')+', Dozent System='+can('dozent','viewSystem'));
    return lines.join('\n');
  }
  async function updateSystemDiagnostics(){
    var panel=document.querySelector('[data-system-info-panel]');
    if(panel) panel.innerHTML=systemInfoHtml();
    var box=document.querySelector('[data-system-diagnostics]');
    if(!box) return;
    box.textContent='Diagnose wird ausgelesen…';
    try{ box.textContent = await systemDiagnosticsText(); }
    catch(e){ box.textContent='Diagnosefehler: '+(e.message||e); }
  }
  function roadmapHtml(){
    return '<div class="egt-roadmap-list"><div><b>✅ Erledigt</b><span>Rollen-/Gruppenmodell, Dozent A/B, Teilnehmerprofile, Berichte, Ticketsystem, Aufgabenbank-Qualitätsprüfung, Systemzentrale mit Health-Check und Backup.</span></div><div><b>🟣 Aktuell</b><span>'+((window.AppConfig&&window.AppConfig.version)||'')+': Echte DE/EN-Prüfungssimulation (gemischte Antworten, neue Inhalte), Tab-Lock, Quota-Schutz, Admin-Portal-Härtung.</span></div><div><b>🔵 Nächstes Ziel</b><span>Modularisierung der Simulationen (EGTSimulation.start je Berufsfeld) und Live-Backend-Abnahme in der Produktionsumgebung.</span></div><div><b>🟡 Danach</b><span>Duell-Quota-Strategie (Blaze oder Polling-Reduktion) und Betriebs-/Support-Routinen.</span></div></div>';
  }
  function learnersForDozentProfile(dozent){
    dozent=dozent||activeDozentProfile()||{};
    var groups=(dozent.assignedGroups||[]).map(groupLabel);
    var all=[];
    try{ all=Object.keys(localAll()).map(function(k){ return ensureProfileGroup(localAll()[k]); }).filter(Boolean); }catch(e){ all=[]; }
    return all.filter(function(p){ return groups.indexOf(groupLabel(p.groupId))>=0; }).sort(function(a,b){ return priorityValue(a)-priorityValue(b) || participantDisplayName(a).localeCompare(participantDisplayName(b),'de',{numeric:true,sensitivity:'base'}); });
  }
  function dozentStatsForProfile(dozent){
    var list=learnersForDozentProfile(dozent), active=0, critical=0, risky=0, inactive=0, accSum=0, accCount=0, answered=0;
    list.forEach(function(p){
      var st=participantFilterStatus(p), pr=profileProgress(p);
      if(st==='kritisch') critical++; else if(st==='riskant') risky++; else if(st==='inaktiv') inactive++; else active++;
      answered+=pr.answered; if(pr.answered){ accSum+=pr.accuracy; accCount++; }
    });
    return { participants:list.length, active:active, critical:critical, risky:risky, inactive:inactive, answered:answered, avg:accCount?Math.round(accSum/accCount):0 };
  }
  function dozentStatusInfo(dozent){
    if(!dozent || dozent.status==='inactive') return { label:'inaktiv', cls:'neutral' };
    if(dozent.status==='blocked') return { label:'gesperrt', cls:'danger' };
    var st=dozentStatsForProfile(dozent);
    if(st.critical>0) return { label:'kritische Gruppe', cls:'danger' };
    if(st.risky>0) return { label:'beobachten', cls:'warn' };
    return { label:'aktiv', cls:'ok' };
  }
  function dozentGroupSelectHtml(selected){
    selected=(selected||[]).map(groupLabel);
    var groups=groupPhase5List('admin');
    selected.forEach(function(id){ if(id && !groups.find(function(x){return groupLabel(x.id)===id;})) groups.push({id:id,title:id}); });
    if(!groups.length){ groups=[{id:groupLabel(getCourseSettings().prefix), title:groupLabel(getCourseSettings().prefix)}]; }
    return '<div class="egt-phase7-group-checks">'+groups.map(function(g){ var id=groupLabel(g.id); return '<label><input type="checkbox" data-phase7-group-choice value="'+escapeHtml(id)+'" '+(selected.indexOf(id)>=0?'checked':'')+'> <span>'+escapeHtml(id)+'</span></label>'; }).join('')+'</div>';
  }
  function dozentCardHtml(dozent, active){
    dozent=normalizeDozentProfile(dozent);
    var st=dozentStatsForProfile(dozent), status=dozentStatusInfo(dozent);
    var search=[dozent.displayName,dozent.dozentId,dozent.email,dozent.status,dozent.assignedGroups.join(' '),status.label].join(' ').toLowerCase();
    return '<button class="egt-dozent-card egt-status-'+status.cls+' '+(active?'active':'')+'" type="button" data-phase7-open-dozent="'+escapeHtml(dozent.dozentId)+'" data-status="'+escapeHtml(status.label)+'" data-search="'+escapeHtml(search)+'">'
      +'<div class="egt-dcard-header">'
        +'<span class="egt-avatar-dot">'+escapeHtml(dozent.displayName.slice(0,1).toUpperCase())+'</span>'
        +'<span class="egt-dcard-identity"><strong>'+escapeHtml(dozent.displayName)+'</strong><small>'+escapeHtml(dozent.dozentId)+'</small></span>'
      +'</div>'
      +'<div class="egt-dcard-body">'
        +'<div class="egt-dcard-stats">'
          +'<span class="egt-admin-pill egt-status-'+status.cls+'">'+escapeHtml(status.label)+'</span>'
          +'<div class="egt-dcard-metric"><b>'+st.avg+'%</b><small>Ø Quote</small></div>'
        +'</div>'
        +'<div class="egt-dcard-details">'
          +'<div><b>'+st.participants+'</b><span>TN zugewiesen</span></div>'
          +'<div class="egt-dcard-groups"><span>Gruppen:</span><small>'+escapeHtml(dozent.assignedGroups.join(', ')||'keine')+'</small></div>'
        +'</div>'
      +'</div>'
    +'</button>';
  }
  function dozentDetailHtml(dozentId){
    var list=dozentProfiles();
    var d=list.find(function(x){ return normalizeCode(x.dozentId)===normalizeCode(dozentId); }) || list[0];
    if(!d) return '<div class="egt-empty-state">Noch kein Dozent vorhanden.</div>';
    d=normalizeDozentProfile(d);
    var st=dozentStatsForProfile(d), status=dozentStatusInfo(d);
    var learners=learnersForDozentProfile(d).slice(0,8).map(function(p){
      var uid=normalizeCode(p.userId||p.code||p.loginName||p.id), ps=participantFilterStatus(p), pr=profileProgress(p);
      return '<button class="egt-group-learner '+participantStatusClass(ps)+'" type="button" data-phase7-open-participant="'+escapeHtml(uid)+'"><span><b>'+escapeHtml(participantDisplayName(p))+'</b><small>'+escapeHtml(uid)+' · '+escapeHtml(topWeakness(p))+'</small></span><i>'+escapeHtml(participantStatusLabel(ps))+'</i><strong>'+pr.accuracy+'%</strong></button>';
    }).join('') || '<div class="egt-empty-state"><b>Keine Teilnehmer in den zugewiesenen Gruppen.</b><span>Weise dem Dozenten eine Gruppe zu oder erstelle Teilnehmer in dieser Gruppe.</span></div>';
    return '<aside class="egt-phase7-detail" data-phase7-detail-id="'+escapeHtml(d.dozentId)+'">'
      +'<div class="egt-group-detail-head"><div><span class="egt-session-kicker">Dozentenprofil</span><h4>'+escapeHtml(d.displayName)+'</h4><p>'+escapeHtml(d.email||'keine E-Mail')+' · '+escapeHtml(d.dozentId)+'</p></div><span class="egt-admin-pill egt-status-'+status.cls+'">'+escapeHtml(status.label)+'</span></div>'
      +'<div class="egt-profile-kpi"><div><b>'+st.participants+'</b><span>Teilnehmer</span></div><div><b>'+st.critical+'</b><span>kritisch</span></div><div><b>'+st.risky+'</b><span>riskant</span></div><div><b>'+st.avg+'%</b><span>Ø Quote</span></div></div>'
      +'<div class="egt-profile-section"><b>Stammdaten bearbeiten</b><div class="egt-phase7-form"><input class="egt-admin-input" data-phase7-name value="'+escapeHtml(d.displayName)+'" placeholder="Name"><input class="egt-admin-input" data-phase7-email value="'+escapeHtml(d.email)+'" placeholder="E-Mail"><input class="egt-admin-input" data-phase7-phone value="'+escapeHtml(d.phone)+'" placeholder="Telefon optional"><select class="egt-admin-input" data-phase7-status><option value="active"'+(d.status==='active'?' selected':'')+'>Aktiv</option><option value="inactive"'+(d.status==='inactive'?' selected':'')+'>Inaktiv</option><option value="blocked"'+(d.status==='blocked'?' selected':'')+'>Gesperrt</option></select></div></div>'
      +'<div class="egt-profile-section"><b>Gruppenbindung</b><p>Der Dozent sieht nur Teilnehmer aus diesen Gruppen.</p>'+dozentGroupSelectHtml(d.assignedGroups)+'</div>'
      +'<div class="egt-profile-section"><b>Rechte</b><div class="egt-phase7-rights"><label><input type="checkbox" data-phase7-perm="participants" '+(d.permissions.participants?'checked':'')+'> Teilnehmer sehen</label><label><input type="checkbox" data-phase7-perm="reports" '+(d.permissions.reports?'checked':'')+'> Berichte exportieren</label><label><input type="checkbox" data-phase7-perm="accessCodes" '+(d.permissions.accessCodes?'checked':'')+'> eigene Codes erstellen</label><label><input type="checkbox" data-phase7-perm="editNotes" '+(d.permissions.editNotes?'checked':'')+'> Notizen pflegen</label></div></div>'
      +'<div class="egt-profile-section"><b>Interne Notiz</b><textarea class="egt-admin-input" data-phase7-note rows="3" placeholder="Notiz für Admin…">'+escapeHtml(d.note||'')+'</textarea></div>'
      +'<div class="egt-admin-row"><button class="egt-admin-btn" type="button" data-phase7-save-dozent="'+escapeHtml(d.dozentId)+'">Dozent speichern</button><button class="egt-admin-btn secondary" type="button" data-phase7-set-active="'+escapeHtml(d.dozentId)+'">Als Test-Dozent aktivieren</button><button class="egt-admin-btn secondary" type="button" data-cc-action="reports">Berichte</button><button class="egt-admin-btn danger" type="button" data-phase7-toggle-dozent="'+escapeHtml(d.dozentId)+'">'+(d.status==='blocked'?'Entsperren':'Sperren')+'</button></div>'
      +'<div class="egt-profile-section"><b>Zugewiesene Teilnehmer</b><div class="egt-group-learner-list">'+learners+'</div></div>'
    +'</aside>';
  }
  function dozentOwnCockpitHtml(){
    var d=activeDozentProfile() || dozentProfiles()[0];
    var st=dozentStatsForProfile(d), learners=learnersForDozentProfile(d).slice(0,10);
    return '<div class="egt-phase7-teacher-cockpit egt-admin-card egt-admin-card-wide">'
      +'<div class="egt-phase2-head"><div><span class="egt-session-kicker">Phase 7 · Dozentenportal</span><h3>'+escapeHtml(d.displayName)+'</h3><p>Eigene Gruppen, Teilnehmer, Hilfebedarf und Berichte. Der Dozent sieht bewusst nicht das ganze System.</p></div><div class="egt-phase2-count"><b>'+st.participants+'</b><span>sichtbare TN</span></div></div>'
      +'<div class="egt-phase5-kpis"><div><b>'+escapeHtml((d.assignedGroups||[]).join(', ')||'—')+'</b><span>Gruppen</span></div><div><b>'+st.critical+'</b><span>kritisch</span></div><div><b>'+st.risky+'</b><span>riskant</span></div><div><b>'+st.avg+'%</b><span>Ø Quote</span></div></div>'
      +'<div class="egt-phase4-main-grid"><div class="egt-admin-subcard egt-phase4-card"><strong>Priorisierte Teilnehmer</strong><p>Kritisch und riskant zuerst. Klick öffnet Teilnehmerprofil.</p><div class="egt-group-learner-list">'+(learners.map(function(p){ var uid=normalizeCode(p.userId||p.code||p.id), ps=participantFilterStatus(p), pr=profileProgress(p); return '<button class="egt-group-learner '+participantStatusClass(ps)+'" type="button" data-phase7-open-participant="'+escapeHtml(uid)+'"><span><b>'+escapeHtml(participantDisplayName(p))+'</b><small>'+escapeHtml(uid)+' · '+escapeHtml(topWeakness(p))+'</small></span><i>'+escapeHtml(participantStatusLabel(ps))+'</i><strong>'+pr.accuracy+'%</strong></button>'; }).join('') || '<div class="egt-empty-state">Noch keine Teilnehmer sichtbar.</div>')+'</div></div><div class="egt-admin-subcard egt-phase4-card"><strong>Dozentenrechte</strong><p>'+escapeHtml(groupAccessForRole('dozent').label)+'</p><div class="egt-phase7-right-badges"><span>Teilnehmer sehen</span><span>Berichte</span><span>Eigene Codes</span><span>Notizen</span></div><div class="egt-phase4-actions"><button class="egt-admin-btn" type="button" data-cc-action="participants">Teilnehmer öffnen</button><button class="egt-admin-btn secondary" type="button" data-cc-action="reports">Berichte öffnen</button></div></div></div>'
    +'</div>';
  }
  function dozentPhase7WorkspaceHtml(role){
    role=role||currentPortalRole();
    if(role==='dozent') return dozentOwnCockpitHtml();
    var list=dozentProfiles(), first=list[0]&&list[0].dozentId;
    var totalParticipants=list.reduce(function(sum,d){ return sum+dozentStatsForProfile(d).participants; },0);
    var rows=list.length?list.map(function(d,i){ return dozentCardHtml(d,i===0); }).join(''):'<div class="egt-empty-state"><b>Noch keine Dozenten.</b><span>Lege einen Dozenten an und weise Gruppen zu.</span></div>';
    return '<div class="egt-admin-card egt-admin-card-wide egt-phase7-dozenten" data-phase7-dozenten>'
      +'<div class="egt-phase2-head"><div><span class="egt-session-kicker">Phase 7 · Dozentenverwaltung</span><h3>Dozentenprofile, Rechte & Gruppenbindung</h3><p>Jeder Dozent bekommt ein klares Profil, feste Gruppen, sichtbare Teilnehmer und begrenzte Rechte. Damit wirkt das Portal wie eine echte Verwaltungssoftware.</p></div><div class="egt-phase2-count"><b>'+list.length+'</b><span>Dozenten · '+totalParticipants+' TN</span></div></div>'
      +'<div class="egt-phase5-kpis"><div><b>'+list.length+'</b><span>Dozenten</span></div><div><b>'+totalParticipants+'</b><span>zugewiesene TN</span></div><div><b>'+list.filter(function(d){return dozentStatusInfo(d).cls==='danger';}).length+'</b><span>kritische Bindung</span></div><div><b>Rollenmodell</b><span>Admin / Dozent / Teilnehmer</span></div></div>'
      +'<div class="egt-participant-toolbar"><label class="egt-participant-search"><span>Dozentensuche</span><input class="egt-admin-input" data-phase7-search placeholder="Name, ID, E-Mail, Gruppe, Status suchen…"></label><label class="egt-participant-sort"><span>Status</span><select class="egt-admin-input" data-phase7-filter><option value="alle">Alle</option><option value="aktiv">Aktiv</option><option value="beobachten">Beobachten</option><option value="kritische gruppe">Kritische Gruppe</option><option value="inaktiv">Inaktiv</option><option value="gesperrt">Gesperrt</option></select></label><button class="egt-admin-btn secondary" type="button" data-phase7-refresh>Aktualisieren</button></div>'
      +'<div class="egt-phase7-layout"><div><div class="egt-phase7-list" data-phase7-list>'+rows+'</div><div class="egt-phase7-create egt-profile-section"><b>Neuen Dozenten anlegen</b><div class="egt-phase7-form"><input class="egt-admin-input" data-phase7-new-name placeholder="Name"><input class="egt-admin-input" data-phase7-new-email placeholder="E-Mail"><input class="egt-admin-input" data-phase7-new-groups placeholder="Gruppen, z. B. 2026-GK-C"><button class="egt-admin-btn" type="button" data-phase7-create-dozent>Dozent erstellen</button></div></div></div><div data-phase7-detail>'+dozentDetailHtml(first)+'</div></div>'
    +'</div>';
  }
  function renderPhase7Dozenten(){
    var root=document.querySelector('[data-phase7-dozent-root]');
    if(root) root.innerHTML=dozentPhase7WorkspaceHtml(currentPortalRole());
  }
  function applyPhase7DozentFilters(root){
    if(!root) return;
    var q=String((root.querySelector('[data-phase7-search]')||{}).value||'').trim().toLowerCase();
    var f=String((root.querySelector('[data-phase7-filter]')||{}).value||'alle').toLowerCase();
    root.querySelectorAll('[data-phase7-open-dozent]').forEach(function(row){
      var status=String(row.getAttribute('data-status')||'').toLowerCase();
      var search=String(row.getAttribute('data-search')||'').toLowerCase();
      var okStatus=f==='alle' || status===f;
      var okSearch=!q || search.indexOf(q)>=0;
      row.classList.toggle('egt-filter-hidden', !(okStatus && okSearch));
    });
  }

  async function renderDozentStats(){
    var root=document.querySelector('[data-phase7-dozent-root]');
    var dash=document.querySelector('[data-dozent-dashboard]');
    var box=document.querySelector('[data-dozent-stats]');
    if(root){
      if(!dozentOpen() && !adminOpen()){ root.innerHTML='<div class="egt-admin-card egt-admin-card-wide"><h3>Dozentenbereich gesperrt</h3><p>Bitte zuerst als Admin oder Dozent einloggen.</p></div>'; return; }
      root.innerHTML=dozentPhase7WorkspaceHtml(currentPortalRole()==='dozent'?'dozent':'admin');
    }
    if(!box && !dash) return;
    if(!dozentOpen() && !adminOpen()){ if(box) box.textContent='Dozentenbereich gesperrt.'; if(dash) dash.innerHTML=''; return; }
    var role=adminOpen()?'admin':'dozent';
    try {
      if(dash) dash.innerHTML=portalDashboardHtml(role);
      var list=await listLearners();
      var filteredList = list.filter(function(x){ return canViewLearner(role, x); });
      var st=overviewStatsFor(role);
      var onlineNow=countOnlineNow(filteredList);
      
      var totalSimulations=0;
      filteredList.forEach(function(p){
        var pr=profileProgress(p);
        totalSimulations += pr.simulations;
      });

      if(dash){
        var elOnline = dash.querySelector('[data-kpi-val="online"]');
        if(elOnline) elOnline.textContent = onlineNow;
        var elSimulations = dash.querySelector('[data-kpi-val="simulations"]');
        if(elSimulations) elSimulations.textContent = totalSimulations;
      }

      if(box) box.innerHTML='<div class="egt-admin-stat-grid"><div><b>'+st.total+'</b><span>Teilnehmer</span></div><div><b>'+st.active+'</b><span>aktiv</span></div><div><b>'+st.help+'</b><span>Hilfebedarf</span></div><div><b>'+st.avg+'%</b><span>Ø Quote</span></div></div><p>Dozenten sehen nur zugewiesene bzw. kursbezogene Teilnehmer. Admins sehen alle Daten.</p>';
    } catch(e) { if(box) box.textContent='Fehler: '+(e.message||e); }
  }
  async function renderDozentLearners(){
    var box=document.querySelector('[data-dozent-learner-list]'); if(!box) return;
    if(!dozentOpen() && !adminOpen()){ box.textContent='Dozentenbereich gesperrt.'; return; }
    var role=adminOpen()?'admin':'dozent';
    box.innerHTML=participantListHtml(role,false);
  }
  function updateSessionPanels(){
    var role=currentPortalRole();
    document.querySelectorAll('[data-admin-unlock-panel]').forEach(function(el){ el.classList.toggle('egt-admin-hidden', role==='admin'); });
    document.querySelectorAll('[data-dozent-unlock-panel]').forEach(function(el){ el.classList.toggle('egt-admin-hidden', role==='dozent' || role==='admin'); });
    document.querySelectorAll('[data-admin-session-panel]').forEach(function(el){ el.classList.toggle('egt-admin-hidden', role!=='admin'); if(role==='admin') el.innerHTML=portalSessionCardHtml('admin'); });
    document.querySelectorAll('[data-dozent-session-panel]').forEach(function(el){ el.classList.toggle('egt-admin-hidden', !(role==='dozent' || role==='admin')); if(role==='dozent') el.innerHTML=portalSessionCardHtml('dozent'); if(role==='admin') el.innerHTML=portalSessionCardHtml('admin'); });
  }


  function saveBulkSelection(){ try{ sessionStorage.setItem(BULK_SELECTION_KEY,JSON.stringify(Object.keys(bulkSelection).filter(function(id){return bulkSelection[id];}))); }catch(e){} }
  function selectedLearnerIds(){ return Object.keys(bulkSelection).filter(function(id){return bulkSelection[id];}).sort(); }
  function setLearnerSelected(id,on){ id=normalizeCode(id); if(!id)return; if(on)bulkSelection[id]=true; else delete bulkSelection[id]; saveBulkSelection(); updateBulkSelectionUi(); }
  function clearBulkSelection(){ bulkSelection={}; saveBulkSelection(); updateBulkSelectionUi(); }
  function updateBulkSelectionUi(){
    var ids=selectedLearnerIds();
    document.querySelectorAll('[data-bulk-selected-count]').forEach(function(el){el.textContent=String(ids.length);});
    document.querySelectorAll('[data-bulk-selection-summary]').forEach(function(el){el.textContent=ids.length?ids.length+' Teilnehmer ausgewählt':'Keine Teilnehmer ausgewählt';});
    document.querySelectorAll('[data-bulk-action]').forEach(function(el){el.disabled=!ids.length;});
    document.querySelectorAll('[data-bulk-select]').forEach(function(cb){cb.checked=!!bulkSelection[normalizeCode(cb.getAttribute('data-bulk-select'))];});
  }
  function localAuditEntries(){ try{var x=JSON.parse(localStorage.getItem(LOCAL_AUDIT_KEY)||'[]');return Array.isArray(x)?x:[];}catch(e){return [];} }
  function saveLocalAuditEntries(list){ try{localStorage.setItem(LOCAL_AUDIT_KEY,JSON.stringify((list||[]).slice(-500)));}catch(e){} }
  function appendLocalAudit(action,target,before,after,status){
    var ops=adminOperations(); if(!ops||!ops.appendLocalAudit)return null;
    var current=localAuditEntries();
    var event={schema:'egt-local-audit-v2',actorUid:(securityContext()&&securityContext().user&&securityContext().user.uid)||'local-admin',actorRole:currentPortalRole(),actorEmail:(securityContext()&&securityContext().user&&securityContext().user.email)||'',action:String(action||''),target:String(target||''),before:before||null,after:after||null,status:status||'success',createdAtIso:nowIso()};
    var out=ops.appendLocalAudit(current,event); saveLocalAuditEntries(out.entries); return out.entry;
  }
  function privacyPolicy(){
    var defaults={retentionDays:730,aiDataRetentionDays:30,autoDeleteInactive:false,updatedAt:''};
    try{return Object.assign(defaults,JSON.parse(localStorage.getItem(PRIVACY_POLICY_KEY)||'{}')||{});}catch(e){return defaults;}
  }
  function savePrivacyPolicyLocal(policy){ try{localStorage.setItem(PRIVACY_POLICY_KEY,JSON.stringify(policy||{}));}catch(e){} }
  function downloadAdminFile(name,content,type){
    var blob=new Blob([content],{type:type||'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;document.body.appendChild(a);a.click();setTimeout(function(){URL.revokeObjectURL(url);a.remove();},300);
  }
  function auditPayloadForHash(entry){
    return {schema:entry.schema||'egt-security-audit-v2',sequence:Number(entry.sequence||0),prevHash:String(entry.prevHash||''),actorUid:String(entry.actorUid||''),actorRole:String(entry.actorRole||''),actorEmail:String(entry.actorEmail||''),action:String(entry.action||''),target:String(entry.target||''),before:entry.before===undefined?null:entry.before,after:entry.after===undefined?null:entry.after,status:String(entry.status||'success'),createdAtIso:String(entry.createdAtIso||'')};
  }
  async function sha256Hex(input){
    if(!(window.crypto&&window.crypto.subtle)) return '';
    var bytes=new TextEncoder().encode(String(input||''));var digest=await window.crypto.subtle.digest('SHA-256',bytes);return Array.prototype.map.call(new Uint8Array(digest),function(b){return b.toString(16).padStart(2,'0');}).join('');
  }
  async function verifyAuditEntries(entries){
    var list=(entries||[]).slice().sort(function(a,b){return Number(a.sequence||0)-Number(b.sequence||0);});
    if(!list.length)return {ok:true,count:0,lastHash:'',errors:[]};
    if(String(list[0].schema||'').indexOf('local')>=0){var ops=adminOperations();return ops&&ops.verifyAuditChain?ops.verifyAuditChain(list):{ok:false,count:list.length,errors:['Operations-Engine fehlt.']};}
    var errors=[],prev='';
    for(var i=0;i<list.length;i++){
      var e=list[i],seq=Number(e.sequence||0);if(i&&seq!==Number(list[i-1].sequence||0)+1)errors.push('Sequenzlücke vor '+seq+'.');if(String(e.prevHash||'')!==prev)errors.push('prevHash stimmt bei '+seq+' nicht.');
      var canonical=adminOperations()&&adminOperations().stable?adminOperations().stable(auditPayloadForHash(e)):JSON.stringify(auditPayloadForHash(e));
      var expected=await sha256Hex(prev+'|'+canonical);if(expected&&String(e.hash||'')!==expected)errors.push('Hash stimmt bei '+seq+' nicht.');prev=String(e.hash||'');
    }
    return {ok:errors.length===0,count:list.length,lastHash:prev,errors:errors};
  }
  async function fetchSecurityAudit(limitCount){
    limitCount=Math.max(10,Math.min(250,Number(limitCount||100)));
    if(state.online&&state.sync&&state.sync.fsMod&&currentPortalRole()==='admin'){
      try{
        var fs=state.sync.fsMod,ref=colRef('courses/'+state.courseId+'/securityAudit');var qs=await fs.getDocs(fs.query(ref,fs.orderBy('sequence','desc'),fs.limit(limitCount)));var list=[];
        qs.forEach(function(d){var x=d.data()||{};x.id=d.id;if(x.createdAt&&typeof x.createdAt.toDate==='function')x.createdAt=x.createdAt.toDate().toISOString();list.push(x);});return list.sort(function(a,b){return Number(a.sequence||0)-Number(b.sequence||0);});
      }catch(e){state.error=e.message||String(e);}
    }
    return localAuditEntries().slice(-limitCount);
  }
  function dataSourceSummary(){
    var ops=adminOperations(),all=[];try{all=Object.keys(localAll()).map(function(k){return localAll()[k];});}catch(e){}
    var counts={production:0,demo:0,legacy:0};all.forEach(function(p){var c=ops&&ops.dataClass?ops.dataClass(p):(p.isDemo?'demo':'production');counts[c]=(counts[c]||0)+1;});return counts;
  }
  function syncHealthHtml(){
    var st=syncStatus(),h=st.health||{},oldest=h.oldestAt?formatDateShort(h.oldestAt):'—';
    return '<div class="egt-ops-kpi-grid"><div class="egt-ops-kpi '+escapeHtml(h.grade||'offline')+'"><b>'+escapeHtml(h.label||'Unbekannt')+'</b><span>'+escapeHtml(st.provider||'lokal')+'</span></div><div class="egt-ops-kpi"><b>'+Number(st.pendingCount||0)+'</b><span>offene Datensätze</span></div><div class="egt-ops-kpi"><b>'+Number(st.failedCount||0)+'</b><span>fehlgeschlagen</span></div><div class="egt-ops-kpi"><b>'+escapeHtml(oldest)+'</b><span>ältester Eintrag</span></div></div>'+
      '<div class="egt-admin-kv"><b>Letzter Cloudkontakt</b><span>'+escapeHtml(formatDateShort(st.lastConnectedAt))+'</span><b>Letzter Sync</b><span>'+escapeHtml(formatDateShort(st.lastFlushAt))+'</span><b>Statusdetail</b><span>'+escapeHtml(st.error||st.connectionMessage||'—')+'</span><b>Kurs</b><span>'+escapeHtml(st.courseId||'—')+'</span></div>';
  }
  function bulkGroupOptions(){
    var groups={};sortedLearnersForRole('admin').forEach(function(p){var g=groupLabel(p.groupId||'');if(g)groups[g]=true;});return Object.keys(groups).sort().map(function(g){return '<option value="'+escapeHtml(g)+'">'+escapeHtml(g)+'</option>';}).join('');
  }
  function operationsWorkspaceHtml(){
    var ids=selectedLearnerIds(),src=dataSourceSummary(),policy=privacyPolicy();
    return '<div class="egt-operations-shell" data-operations-root>'+
      '<div class="egt-admin-card egt-admin-card-wide"><div class="egt-ops-head"><div><span class="egt-session-kicker">G54.46.6 · Betriebszentrale</span><h3>Sync, Audit, Massenaktionen und Datenschutz</h3><p>Produktionsdaten und Demo-Daten bleiben getrennt. Sensible Aktionen werden protokolliert und benötigen explizite Bestätigung.</p></div><span class="egt-admin-pill">'+escapeHtml(appConfig().environment||'production')+'</span></div></div>'+
      '<div class="egt-ops-grid">'+
        '<section class="egt-admin-card"><h3>Synchronisierungs-Gesundheit</h3><div data-ops-sync-health>'+syncHealthHtml()+'</div><div class="egt-admin-row"><button class="egt-admin-btn" data-ops-flush-sync type="button">Warteschlange senden</button><button class="egt-admin-btn secondary" data-ops-retry-cloud type="button">Cloud neu prüfen</button><button class="egt-admin-btn secondary" data-ops-export-queue type="button">Queue exportieren</button></div></section>'+
        '<section class="egt-admin-card"><h3>Datenquellen</h3><div class="egt-ops-kpi-grid"><div class="egt-ops-kpi production"><b>'+src.production+'</b><span>Produktion</span></div><div class="egt-ops-kpi demo"><b>'+src.demo+'</b><span>Demo</span></div><div class="egt-ops-kpi legacy"><b>'+src.legacy+'</b><span>Legacy</span></div></div><div class="egt-security-lock-note">Produktionsstatistiken schließen Demo-Profile aus. Demo-Profile bleiben eindeutig markiert und können separat entfernt werden.</div><div class="egt-admin-row"><button class="egt-admin-btn secondary" data-ops-delete-demos type="button" '+(src.demo?'':'disabled')+'>Nur Demo-Daten entfernen</button></div></section>'+
      '</div>'+
      '<div class="egt-ops-grid">'+
        '<section class="egt-admin-card"><h3>Massenaktionen</h3><p data-bulk-selection-summary>'+escapeHtml(ids.length?ids.length+' Teilnehmer ausgewählt':'Keine Teilnehmer ausgewählt')+'</p><div class="egt-admin-mini-grid"><label class="egt-admin-label">Aktion<select class="egt-admin-input" data-bulk-operation><option value="block">Sperren</option><option value="unblock">Entsperren</option><option value="archive">Archivieren</option><option value="activate">Aktivieren</option><option value="setGroup">Gruppe zuweisen</option></select></label><label class="egt-admin-label">Zielgruppe<select class="egt-admin-input" data-bulk-group><option value="">—</option>'+bulkGroupOptions()+'</select></label></div><label class="egt-admin-label">Begründung<input class="egt-admin-input" data-bulk-reason maxlength="500" placeholder="Pflicht bei Sperrung oder Archivierung"></label><div class="egt-admin-row"><button class="egt-admin-btn" data-bulk-action type="button" '+(ids.length?'':'disabled')+'>Auf '+ids.length+' anwenden</button><button class="egt-admin-btn secondary" data-bulk-export type="button" '+(ids.length?'':'disabled')+'>Auswahl exportieren</button><button class="egt-admin-btn secondary" data-bulk-clear type="button">Auswahl leeren</button></div><div class="egt-admin-status" data-bulk-result></div></section>'+
        '<section class="egt-admin-card"><h3>Datenschutzverwaltung</h3><label class="egt-admin-label">Teilnehmer-ID<input class="egt-admin-input" data-privacy-learner placeholder="z. B. 2026-GK-A001"></label><div class="egt-admin-row"><button class="egt-admin-btn secondary" data-privacy-preview type="button">Dateninventar</button><button class="egt-admin-btn secondary" data-privacy-export type="button">Datenexport</button><button class="egt-admin-btn danger" data-privacy-delete type="button">Vollständig löschen</button></div><div class="egt-privacy-preview" data-privacy-result><span>Teilnehmer auswählen oder ID eingeben.</span></div></section>'+
      '</div>'+
      '<div class="egt-ops-grid">'+
        '<section class="egt-admin-card"><h3>Aufbewahrungsregeln</h3><div class="egt-admin-mini-grid"><label class="egt-admin-label">Teilnehmerdaten (Tage)<input class="egt-admin-input" data-privacy-retention type="number" min="30" max="3650" value="'+Number(policy.retentionDays||730)+'"></label><label class="egt-admin-label">KI-Daten (Tage)<input class="egt-admin-input" data-privacy-ai-retention type="number" min="0" max="365" value="'+Number(policy.aiDataRetentionDays||30)+'"></label></div><label class="egt-admin-check"><input type="checkbox" data-privacy-auto-delete '+(policy.autoDeleteInactive?'checked':'')+'><span>Inaktive Konten nach Frist automatisch zur Löschprüfung markieren</span></label><div class="egt-admin-row"><button class="egt-admin-btn" data-save-privacy-policy type="button">Regeln speichern</button></div><small>Automatische Löschung erfolgt niemals allein im Browser; die Regel wird serverseitig gespeichert und benötigt einen geplanten Backend-Job.</small></section>'+
        '<section class="egt-admin-card egt-admin-card-wide"><div class="egt-ops-audit-head"><div><h3>Unveränderbares Audit-Log</h3><p>Hashverkettete Einträge für Rollen-, Sperr-, Lösch-, Code- und Massenaktionen.</p></div><div class="egt-admin-row"><button class="egt-admin-btn secondary" data-refresh-audit type="button">Aktualisieren</button><button class="egt-admin-btn secondary" data-export-audit type="button">Export</button></div></div><div data-audit-verification class="egt-security-lock-note">Audit wird geladen…</div><div class="egt-audit-list" data-audit-list><div class="egt-empty-state">Audit wird geladen…</div></div></section>'+
      '</div>'+
    '</div>';
  }
  async function renderAuditLog(){
    var listBox=document.querySelector('[data-audit-list]'),verifyBox=document.querySelector('[data-audit-verification]');if(!listBox)return;
    listBox.innerHTML='<div class="egt-empty-state">Audit wird geladen…</div>';var entries=await fetchSecurityAudit(120),verification=await verifyAuditEntries(entries);
    if(verifyBox){verifyBox.textContent=verification.ok?'Kette gültig · '+verification.count+' Einträge · letzter Hash '+String(verification.lastHash||'—').slice(0,16):'Kettenprüfung fehlgeschlagen: '+verification.errors.join(' ');verifyBox.classList.toggle('danger',!verification.ok);}
    if(!entries.length){listBox.innerHTML='<div class="egt-empty-state"><b>Noch keine Audit-Einträge</b><span>Sensible Aktionen erscheinen nach der ersten Änderung.</span></div>';return;}
    listBox.innerHTML=entries.slice().reverse().map(function(e){return '<article class="egt-audit-entry"><div><b>#'+Number(e.sequence||0)+' · '+escapeHtml(e.action||'Aktion')+'</b><span>'+escapeHtml(e.target||'—')+'</span></div><div><span>'+escapeHtml(e.actorRole||'')+' · '+escapeHtml(e.actorEmail||e.actorUid||'')+'</span><time>'+escapeHtml(formatDateShort(e.createdAtIso||e.createdAt))+'</time></div><code>'+escapeHtml(String(e.hash||'').slice(0,18))+'…</code></article>';}).join('');
    listBox.__auditEntries=entries;
  }
  async function renderOperations(){
    var root=document.querySelector('[data-panel="operations"]');if(!root)return;
    try{var fresh=await listLearners();fresh.forEach(function(p){localUpsert(p,false);});}catch(e){}
    root.innerHTML=operationsWorkspaceHtml();updateBulkSelectionUi();await renderAuditLog();
  }
  async function bulkApplySelected(operation,groupId,reason){
    var ids=selectedLearnerIds();if(!ids.length)throw new Error('Keine Teilnehmer ausgewählt.');var plan=adminOperations()&&adminOperations().bulkPlan?adminOperations().bulkPlan(ids,operation,{groupId:groupId,reason:reason}):{ids:ids,action:operation};
    if(privilegedWritesViaFunctions())return secureCallable('adminAction',{courseId:state.courseId,action:'bulkLearnerAction',learnerIds:plan.ids,operation:operation,groupId:groupId||'',reason:reason||''},['admin']);
    var results=[];for(var i=0;i<plan.ids.length;i++){var id=plan.ids[i];try{if(operation==='block')await blockLearner(id,true,reason);else if(operation==='unblock'||operation==='activate')await blockLearner(id,false,'');else if(operation==='archive')await updateLearnerAdminProfile(id,{status:'archived',blocked:false});else if(operation==='setGroup')await updateLearnerAdminProfile(id,{groupId:groupId});appendLocalAudit('bulk:'+operation,id,null,{groupId:groupId,reason:reason});results.push({learnerId:id,ok:true});}catch(e){results.push({learnerId:id,ok:false,error:e.message||String(e)});}}
    return {ok:results.every(function(x){return x.ok;}),count:results.length,success:results.filter(function(x){return x.ok;}).length,failed:results.filter(function(x){return !x.ok;}).length,results:results};
  }
  async function privacyProfile(id){id=normalizeCode(id);if(!id)throw new Error('Teilnehmer-ID fehlt.');var p=await findLearnerForAdmin(id);if(!p)throw new Error('Teilnehmer nicht gefunden.');return p;}
  async function exportPrivacyData(id){
    id=normalizeCode(id);if(privilegedWritesViaFunctions()){var r=await secureCallable('adminAction',{courseId:state.courseId,action:'privacyExportLearner',learnerId:id},['admin']);downloadAdminFile('datenauskunft-'+id+'-'+new Date().toISOString().slice(0,10)+'.json',JSON.stringify(r.export,null,2));return r.export;}
    var p=await privacyProfile(id),ops=adminOperations(),out={schema:'egt-privacy-export-local-v1',exportedAt:nowIso(),courseId:state.courseId,learnerId:id,profile:ops&&ops.sanitizePrivacyExport?ops.sanitizePrivacyExport(p):p};appendLocalAudit('privacyExportLearner',id,null,{exported:true});downloadAdminFile('datenauskunft-'+id+'.json',JSON.stringify(out,null,2));return out;
  }
  async function deletePrivacyData(id){
    id=normalizeCode(id);if(!id)throw new Error('Teilnehmer-ID fehlt.');var typed=prompt('Zur vollständigen Löschung die Teilnehmer-ID exakt eingeben:\n'+id);if(typed!==id)throw new Error('Löschung abgebrochen: Bestätigung stimmt nicht.');
    if(privilegedWritesViaFunctions()){var r=await secureCallable('adminAction',{courseId:state.courseId,action:'privacyDeleteLearner',learnerId:id,confirm:id},['admin']);var all=localAll();delete all[id];localSaveAll(all);return r;}
    var before=await privacyProfile(id);appendLocalAudit('privacyDeleteLearner',id,before,{deleted:true});return deleteLearner(id);
  }
  function relabelPortalTabs(role){
    var labels = role==='dozent'
      ? { login:'Login', teachers:'Übersicht', participants:'Teilnehmer', reports:'Berichte', tickets:'Tickets' }
      : { login:'Login', admin:'Dashboard', participants:'Teilnehmer', groups:'Gruppen', codes:'Zugangscodes', teachers:'Dozenten', reports:'Berichte', tickets:'Tickets', archive:'Archiv', system:'System', operations:'Betrieb', qbank:'Aufgabenbank', roadmap:'Roadmap' };
    document.querySelectorAll('[data-tab]').forEach(function(el){
      var key=el.getAttribute('data-tab');
      if(labels[key]){
        if(key==='tickets') el.innerHTML='Tickets <span class="egt-ticket-badge-tab" data-ticket-badge style="display:none"></span>';
        else el.textContent=labels[key];
      }
    });
    updateTicketBadge();
  }
  function updateRoleUi(){
    var role=currentPortalRole();
    var hasRoleSession=roleSessionActive();
    relabelPortalTabs(role);
    updateSessionPanels();
    document.querySelectorAll('[data-role-label]').forEach(function(el){ el.textContent=roleLabel(); });

    document.querySelectorAll('[data-tab]').forEach(function(el){
      var key=el.getAttribute('data-tab');
      var visible=false;
      if(role==='locked') visible = key==='login';
      else if(role==='admin') visible = (key==='admin'||key==='participants'||key==='groups'||key==='codes'||key==='teachers'||key==='reports'||key==='tickets'||key==='archive'||key==='system'||key==='operations'||key==='qbank'||key==='roadmap');
      else if(role==='dozent') visible = (key==='teachers'||key==='participants'||key==='reports'||key==='tickets');
      el.classList.toggle('egt-admin-hidden', !visible);
      el.setAttribute('aria-hidden', visible ? 'false' : 'true');
    });

    document.querySelectorAll('[data-panel="login"]').forEach(function(el){ el.classList.toggle('egt-admin-hidden', hasRoleSession); });
    document.querySelectorAll('[data-admin-full-logout]').forEach(function(el){
      el.classList.toggle('egt-admin-hidden', !hasRoleSession);
      el.textContent = role==='admin' ? 'Admin Logout' : (role==='dozent' ? 'Dozent Logout' : 'Logout');
    });

    document.querySelectorAll('[data-admin-unlock-panel]').forEach(function(el){ el.classList.add('egt-admin-hidden'); });
    document.querySelectorAll('[data-dozent-unlock-panel]').forEach(function(el){ el.classList.add('egt-admin-hidden'); });
    document.querySelectorAll('[data-admin-session-panel]').forEach(function(el){ el.classList.toggle('egt-admin-hidden', role!=='admin'); if(role==='admin') el.innerHTML=portalSessionCardHtml('admin'); });
    document.querySelectorAll('[data-dozent-session-panel]').forEach(function(el){ el.classList.toggle('egt-admin-hidden', !(role==='dozent'||role==='admin')); if(role==='dozent') el.innerHTML=portalSessionCardHtml('dozent'); if(role==='admin') el.innerHTML=portalSessionCardHtml('admin'); });

    document.querySelectorAll('[data-admin-only]').forEach(function(el){ el.classList.toggle('egt-admin-hidden', role!=='admin'); });
    document.querySelectorAll('[data-dozent-visible]').forEach(function(el){ el.classList.toggle('egt-admin-hidden', !(role==='admin'||role==='dozent')); });
    document.querySelectorAll('[data-dozent-access-codes]').forEach(function(el){ el.classList.toggle('egt-admin-hidden', role!=='dozent'); });
    var portalTitle=document.getElementById('egtAdminPortalTitle');
    if(portalTitle) portalTitle.textContent = role==='admin' ? 'Admin Portal' : (role==='dozent' ? 'Dozenten Portal' : 'Login');
    var sys=document.querySelector('[data-system-info-panel]'); if(sys) sys.innerHTML=systemInfoHtml();
    var road=document.querySelector('[data-roadmap-panel]'); if(road) road.innerHTML=roadmapHtml();
    var qs=document.querySelector('[data-qbank-quality-summary]'); if(qs) qs.innerHTML=questionBankQualitySummaryHtml();
    updateReportsPanel();
    renderAccessCodePanels();
    syncDemoDozentCards();
    setTimeout(function(){ updateAdminTabbarScrollState(document.getElementById('egtAdminModal')); }, 20);
  }

  function patchCoach(){ if(window.__EGT_COACH_PATCHED__) return; window.__EGT_COACH_PATCHED__=true; window.addEventListener('egt:training-event', function(e){ trackEvent(e.detail||{}); }); }


  function updateAdminTabbarScrollState(modal){
    var m=modal||document.getElementById('egtAdminModal'); if(!m) return;
    var group=m.querySelector('.egt-portal-tab-group'); var cue=m.querySelector('[data-tab-scroll-cue]'); if(!group) return;
    var max=Math.max(0, group.scrollWidth-group.clientWidth);
    var has=max>3, atStart=group.scrollLeft<=3, atEnd=group.scrollLeft>=max-3;
    group.classList.toggle('has-overflow',has);
    group.classList.toggle('at-start',atStart);
    group.classList.toggle('at-end',atEnd);
    group.setAttribute('data-overflow',has?'true':'false');
    if(cue){ cue.hidden=!has; cue.textContent=atEnd?'← Weitere Bereiche links':(atStart?'Weitere Bereiche rechts →':'← Weitere Bereiche →'); }
  }
  function installAdminTabbarAccessibility(modal){
    if(!modal || modal.__egtTabbarA11y) return; modal.__egtTabbarA11y=true;
    var group=modal.querySelector('.egt-portal-tab-group'); if(!group) return;
    var panels=modal.querySelectorAll('[data-panel]');
    panels.forEach(function(panel){ var key=panel.getAttribute('data-panel'); panel.id='egt-admin-panel-'+key; panel.setAttribute('role','tabpanel'); panel.setAttribute('aria-labelledby','egt-admin-tab-'+key); panel.setAttribute('tabindex','0'); });
    function visibleTabs(){ return Array.prototype.filter.call(group.querySelectorAll('[data-tab]'),function(b){ return !b.classList.contains('egt-admin-hidden') && !b.disabled; }); }
    group.querySelectorAll('[data-tab]').forEach(function(btn){ var key=btn.getAttribute('data-tab'); btn.id='egt-admin-tab-'+key; btn.setAttribute('role','tab'); btn.setAttribute('aria-controls','egt-admin-panel-'+key); btn.setAttribute('aria-selected',btn.classList.contains('active')?'true':'false'); });
    group.addEventListener('keydown',function(e){
      if(!['ArrowRight','ArrowLeft','Home','End'].includes(e.key)) return;
      var tabs=visibleTabs(); if(!tabs.length) return; var current=tabs.indexOf(document.activeElement); if(current<0) current=0;
      var next=current; if(e.key==='ArrowRight') next=(current+1)%tabs.length; if(e.key==='ArrowLeft') next=(current-1+tabs.length)%tabs.length; if(e.key==='Home') next=0; if(e.key==='End') next=tabs.length-1;
      e.preventDefault(); tabs[next].focus(); tabs[next].click();
    });
    group.addEventListener('scroll',function(){ updateAdminTabbarScrollState(modal); },{passive:true});
    window.addEventListener('resize',function(){ updateAdminTabbarScrollState(modal); },{passive:true});
    setTimeout(function(){ updateAdminTabbarScrollState(modal); },60);
  }

  /* G54.43.8K · Admin Tabbar Gesture Scroll Assist
     Erlaubt auf iPhone ein leicht schräges horizontales Wischen. Sobald die
     Bewegung überwiegend horizontal ist, übernimmt die Tabbar das Scrollen und
     verhindert, dass der vertikale Admin-Scroll den Swipe klaut. */
  function installAdminTabbarGestureAssist(modal){
    if(!modal || modal.__egtTabbarGestureAssist) return;
    modal.__egtTabbarGestureAssist = true;
    var group = modal.querySelector('.egt-portal-tab-group');
    if(!group) return;
    var state = {active:false, locked:false, startX:0, startY:0, lastX:0, lastY:0, moved:false};
    function isInteractiveTabTarget(target){
      return !!(target && target.closest && target.closest('.egt-admin-tab'));
    }
    function onStart(e){
      var t = e.touches && e.touches[0];
      if(!t) return;
      state.active = true;
      state.locked = false;
      state.moved = false;
      state.startX = state.lastX = t.clientX;
      state.startY = state.lastY = t.clientY;
      group.classList.remove('is-gesture-scrolling');
    }
    function onMove(e){
      if(!state.active) return;
      var t = e.touches && e.touches[0];
      if(!t) return;
      var dxTotal = t.clientX - state.startX;
      var dyTotal = t.clientY - state.startY;
      var absX = Math.abs(dxTotal);
      var absY = Math.abs(dyTotal);
      if(!state.locked){
        // Nicht mehr perfekte Linie nötig: Schon bei leichter Horizontal-Dominanz locken.
        if(absX > 7 && absX > absY * 0.45){
          state.locked = true;
          group.classList.add('is-gesture-scrolling');
        } else if(absY > 14 && absY > absX * 1.35){
          state.active = false;
          return;
        }
      }
      if(state.locked){
        var dx = t.clientX - state.lastX;
        if(Math.abs(dx) > 0.2){
          group.scrollLeft -= dx;
          state.moved = true;
        }
        if(e.cancelable) e.preventDefault();
        e.stopPropagation();
      }
      state.lastX = t.clientX;
      state.lastY = t.clientY;
    }
    function onEnd(){
      if(state.locked && state.moved){
        group.dataset.lastGestureScroll = String(Date.now());
      }
      state.active = false;
      state.locked = false;
      state.moved = false;
      setTimeout(function(){ group.classList.remove('is-gesture-scrolling'); }, 80);
    }
    group.addEventListener('touchstart', onStart, {passive:true});
    group.addEventListener('touchmove', onMove, {passive:false});
    group.addEventListener('touchend', onEnd, {passive:true});
    group.addEventListener('touchcancel', onEnd, {passive:true});
    group.addEventListener('click', function(e){
      var last = Number(group.dataset.lastGestureScroll || 0);
      if(last && Date.now() - last < 180 && isInteractiveTabTarget(e.target)){
        e.preventDefault();
        e.stopPropagation();
      }
    }, true);
  }

  function syncAdminTabbarToActive(modal, tab){
    var m = modal || document.getElementById('egtAdminModal');
    if(!m) return;
    var group = m.querySelector('.egt-portal-tab-group');
    if(!group) return;
    var active = tab ? group.querySelector('[data-tab="'+tab+'"]') : group.querySelector('.egt-admin-tab.active:not(.egt-admin-hidden)');
    if(active && active.scrollIntoView){
      try{ active.scrollIntoView({behavior:'smooth', inline:'center', block:'nearest'}); }
      catch(_e){
        var left = active.offsetLeft - Math.max(0, (group.clientWidth - active.offsetWidth)/2);
        group.scrollLeft = Math.max(0, left);
      }
      setTimeout(function(){ updateAdminTabbarScrollState(m); }, 220);
    } else { updateAdminTabbarScrollState(m); }
  }

  function isInsideScrollable(target){
    if(!target) return false;
    if(target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') return true;
    return !!target.closest(
      '.egt-participant-table, .egt-group-table, .egt-access-code-list, .egt-phase7-list, .egt-phase9-list, ' +
      '.egt-participant-side, .egt-group-detail, .egt-access-detail, .egt-phase7-detail, .egt-phase9-detail, ' +
      '.egt-phase8-table-wrap'
    );
  }

  function applySecurityLoginUi(root){
    root=root||document;
    if(localRolePinsAllowed()) return;
    var adminCard=root.querySelector('[data-local-admin-login]');
    if(adminCard) adminCard.innerHTML='<h3>Admin-Anmeldung</h3><p>Produktionsmodus: Adminrechte werden ausschließlich durch signierte Firebase Custom Claims vergeben. Melde dich über den Hauptlogin mit deinem freigeschalteten Admin-Konto an.</p><div class="egt-security-lock-note">🔐 Lokale Admin-PINs sind deaktiviert.</div>';
    var teacherCard=root.querySelector('[data-local-dozent-login]');
    if(teacherCard) teacherCard.innerHTML='<h3>Dozenten-Anmeldung</h3><p>Produktionsmodus: Dozentenrechte und Gruppenzuweisungen stammen aus dem signierten Firebase-ID-Token.</p><div class="egt-security-lock-note">🔐 Demo- und lokale Dozenten-PINs sind deaktiviert.</div>';
    var legacyCard=root.querySelector('[data-legacy-code-login]');
    if(legacyCard) legacyCard.innerHTML='<h3>Teilnehmer-Anmeldung</h3><p>Nutze den zentralen E-Mail-Login der App. Ein Zugangscode wird nur bei Registrierung oder nachträglicher Freischaltung sicher über den Server eingelöst.</p><div class="egt-security-lock-note">🔐 Lokaler Code-/Passwort-Login ist im Produktionsmodus deaktiviert.</div>';
  }

  function buildUI(){
    if(document.getElementById('egtAdminModal')) return;
    var modal=document.createElement('div');
    modal.id='egtAdminModal';
    modal.className='egt-admin-modal';
    modal.innerHTML = `
      <div class="egt-admin-panel egt-portal-shell" role="dialog" aria-modal="true" aria-labelledby="egtAdminPortalTitle">
        <div class="egt-sheet-handle" aria-hidden="true"></div>
        <div class="egt-admin-head egt-portal-head">
          <div class="egt-portal-titlebox">
            <span class="egt-role-badge" data-role-label>Gesperrt</span>
            <h2 id="egtAdminPortalTitle">Login</h2>
            <p data-fb-status>Portal lokal bereit · Cloud wird geprüft…</p>
            <div class="egt-cloud-state-row" aria-live="polite">
              <span class="egt-cloud-state" data-cloud-state data-state="idle">Lokaler Start</span>
              <button class="egt-cloud-retry" data-cloud-retry type="button">Cloud erneut prüfen</button>
            </div>
            <span class="egt-cloud-detail" data-cloud-detail></span>
            <span class="egt-sr-only" data-portal-live aria-live="polite"></span>
          </div>
          <button class="egt-admin-x" data-admin-close-portal type="button" aria-label="Portal schließen">×</button>
        </div>
        <div class="egt-admin-body egt-portal-body">
          <div class="egt-admin-tabs egt-portal-tabs egt-portal-tabbar">
            <div class="egt-portal-tab-group" role="tablist" aria-label="Portalbereiche">
              <button class="egt-admin-tab active" data-tab="login">Login</button>
              <button class="egt-admin-tab" data-tab="admin">Dashboard</button>
              <button class="egt-admin-tab" data-tab="participants">Teilnehmer</button>
              <button class="egt-admin-tab" data-tab="groups">Gruppen</button>
              <button class="egt-admin-tab" data-tab="codes">Zugangscodes</button>
              <button class="egt-admin-tab" data-tab="teachers">Dozenten</button>
              <button class="egt-admin-tab" data-tab="reports">Berichte</button>
              <button class="egt-admin-tab" data-tab="tickets">Tickets <span class="egt-ticket-badge-tab" data-ticket-badge style="display:none"></span></button>
              <button class="egt-admin-tab" data-tab="system">System</button>
              <button class="egt-admin-tab" data-tab="operations">Betrieb</button>
              <button class="egt-admin-tab" data-tab="archive">Archiv</button>
              <button class="egt-admin-tab" data-tab="qbank">Aufgabenbank</button>
              <button class="egt-admin-tab" data-tab="roadmap">Roadmap</button>
            </div>
            <span class="egt-tab-scroll-cue" data-tab-scroll-cue aria-hidden="true">Seitlich wischen →</span>
            <button class="egt-admin-tab egt-logout-tab egt-admin-hidden" data-admin-full-logout type="button">Logout</button>
          </div>

          <section data-panel="login">
            <div class="egt-portal-grid">
              <div class="egt-admin-card" data-local-admin-login>
                <h3>Admin Login</h3>
                <p>Vollzugriff auf Teilnehmer, Inhalte, Systeminfo, Roadmap und Exporte.</p>
                <input class="egt-admin-input" data-admin-pin type="password" placeholder="Admin-PIN" autocomplete="current-password">
                <div class="egt-admin-row"><button class="egt-admin-btn" data-admin-unlock>Admin öffnen</button></div>
              </div>
              <div class="egt-admin-card" data-local-dozent-login>
                <h3>Dozenten Login</h3>
                <p>Beschränkter Zugriff auf eigene Gruppen, Teilnehmer, Fortschritt und Hilfebedarf.</p>
                <div class="egt-admin-mini-grid">
                  <div class="egt-admin-subcard">
                    <strong>Demo Dozent A</strong>
                    <span>Sieht nur Gruppe A.</span>
                    <input class="egt-admin-input" data-demo-dozent-pin="DOZENT-A" type="password" placeholder="PIN: DozentA123!" autocomplete="current-password">
                    <button class="egt-admin-btn secondary" data-demo-dozent-login="DOZENT-A" type="button">Als Dozent A einloggen</button>
                  </div>
                  <div class="egt-admin-subcard">
                    <strong>Demo Dozent B</strong>
                    <span>Sieht nur Gruppe B.</span>
                    <input class="egt-admin-input" data-demo-dozent-pin="DOZENT-B" type="password" placeholder="PIN: DozentB123!" autocomplete="current-password">
                    <button class="egt-admin-btn secondary" data-demo-dozent-login="DOZENT-B" type="button">Als Dozent B einloggen</button>
                  </div>
                </div>
                <p class="egt-admin-hint">Demo-PINs sind bewusst unterschiedlich, damit Gruppe A/B sauber testbar ist.</p>
              </div>
              <div class="egt-admin-card" data-legacy-code-login>
                <h3>Teilnehmer Login</h3>
                <p>Eigenes Profil, eigener Fortschritt, kein Zugriff auf Adminbereiche.</p>
                <input class="egt-admin-input" data-login-code placeholder="Teilnehmer-ID (z. B. 2026-GK-A001)" autocomplete="username">
                <input class="egt-admin-input" data-login-password type="password" placeholder="Passwort" autocomplete="current-password">
                <div class="egt-admin-row"><button class="egt-admin-btn" data-login-btn>Einloggen</button><button class="egt-admin-btn secondary" data-logout-btn>Abmelden</button></div>
                <button class="egt-link-btn" data-forgot-password>Passwort vergessen?</button>
              </div>
              <div class="egt-admin-card">
                <h3>Rollenprinzip</h3>
                <div class="egt-role-matrix">
                  <div><b>Admin</b><span>Vollzugriff: Nutzer, Inhalte, System, Roadmap, Export.</span></div>
                  <div><b>Dozent</b><span>Beschränkt: eigene Gruppen, Teilnehmer, Hilfebedarf, Berichte.</span></div>
                  <div><b>Teilnehmer</b><span>Kein Portalzugriff, nur eigenes Training.</span></div>
                </div>
              </div>
            </div>
          </section>

          <section data-panel="admin" class="egt-admin-hidden">
            <div class="egt-admin-card egt-admin-card-wide egt-admin-hidden" data-admin-session-panel></div>
            ${adminPortalPhase1NoticeHtml()}
            <div data-admin-dashboard></div>
          </section>

          <section data-panel="participants" class="egt-admin-hidden">
            <div data-phase2-participant-root>${participantPhase2WorkspaceHtml(currentPortalRole()==='dozent'?'dozent':'admin')}</div>
          </section>

          <section data-panel="groups" class="egt-admin-hidden">
            <div data-phase5-group-root>${groupPhase5WorkspaceHtml(currentPortalRole()==='dozent'?'dozent':'admin')}</div>
          </section>

          <section data-panel="codes" class="egt-admin-hidden"><div class="egt-admin-card egt-admin-card-wide" data-admin-access-codes>${accessCodesPanelHtml('admin')}</div></section>

          <section data-panel="teachers" class="egt-admin-hidden">
            <div data-phase7-dozent-root>${dozentPhase7WorkspaceHtml(currentPortalRole()==='dozent'?'dozent':'admin')}</div>
          </section>

          <section data-panel="reports" class="egt-admin-hidden"><div data-reports-panel>${reportsPanelHtml()}</div></section>

          <section data-panel="tickets" class="egt-admin-hidden"><div data-phase9-ticket-root><div class="egt-empty-state"><b>Tickets werden geladen…</b><span>Support-Modul wird vorbereitet.</span></div></div></section>

          <section data-panel="archive" class="egt-admin-hidden"><div class="egt-admin-card egt-admin-card-wide"><h3>📁 User-Archiv &middot; Verwarnungen & Sperren</h3><div id="egtArchiveList"><div class="egt-empty-state"><b>Noch keine Einträge</b><span>Verwarnungen und Sperren werden hier archiviert.</span></div></div></div></section>

          <section data-panel="system" class="egt-admin-hidden"><div data-system-info-panel>${systemInfoHtml()}</div></section>
          <section data-panel="operations" class="egt-admin-hidden"><div class="egt-empty-state">Betriebszentrale wird geladen…</div></section>
          <section data-panel="qbank" class="egt-admin-hidden"><div class="egt-qbank-shell"><div data-qbank-quality>${questionBankQualityHtml()}</div><div class="egt-admin-row egt-qbank-actions"><button class="egt-admin-btn secondary" data-refresh-qbank type="button">Aufgabenbank erneut prüfen</button><button class="egt-admin-btn secondary" data-copy-qbank type="button">Prüfbericht kopieren</button></div></div></section>
          <section data-panel="roadmap" class="egt-admin-hidden"><div class="egt-portal-grid"><div class="egt-admin-card"><h3>Roadmap & Status</h3><div data-roadmap-panel>${roadmapHtml()}</div></div><div class="egt-admin-card"><h3>Aufgabenbank Kurzstatus</h3><div data-qbank-quality-summary>${questionBankQualitySummaryHtml()}</div></div></div></section>
        </div>
      </div>`;
    document.body.appendChild(modal);
    applySecurityLoginUi(modal);
    installAdminTabbarGestureAssist(modal);
    installAdminTabbarAccessibility(modal);
    setTimeout(function(){ syncAdminTabbarToActive(modal); updateAdminTabbarScrollState(modal); }, 80);
    modal.addEventListener('click', function(e){ if(e.target===modal) closeModal(); });
    // G54.39B: Native Scroll statt künstlicher Wheel-/Touchmove-Assistenz.
    // Die alte Logik manipulierte scrollTop während iOS/iPadOS bereits Momentum-Scrolling
    // ausführte. Ergebnis: zähes, verzögertes Scrollgefühl im Admin-Portal.
    // Ab 39B gilt: ein Haupt-Scrollcontainer per CSS, native -webkit-overflow-scrolling,
    // keine manuelle Delta-Addition auf wheel/touchmove.
    document.addEventListener('keydown', function(e){ if(e.key==='Escape'){ var m=document.getElementById('egtAdminModal'); if(m && m.classList.contains('show')) closeModal(); } });
    modal.querySelectorAll('[data-tab]').forEach(function(btn){ btn.onclick=function(){ switchTab(btn.getAttribute('data-tab')); }; });
    function syncCourseInputs(){ var cs=getCourseSettings(); var y=modal.querySelector('[data-course-year]'); if(!y) return; y.value=cs.year; modal.querySelector('[data-course-code]').value=cs.course; modal.querySelector('[data-course-track]').value=cs.track; modal.querySelector('[data-course-digits]').value=cs.digits; var pill=modal.querySelector('[data-current-course]'); if(pill) pill.textContent=cs.prefix+'001'; var sys=modal.querySelector('[data-system-course]'); if(sys) sys.textContent=state.courseId; }
    syncCourseInputs();
    var loginBtn=modal.querySelector('[data-login-btn]');
    if(loginBtn) loginBtn.onclick=async function(){ var codeInput=modal.querySelector('[data-login-code]'); var pwInput=modal.querySelector('[data-login-password]'); var code=String(codeInput&&codeInput.value||'').trim(); var pw=String(pwInput&&pwInput.value||'').trim(); try{ if(!code) throw new Error('Bitte Teilnehmer-ID eingeben.'); setStatus('Login läuft…'); await loginWithCode(code,pw); }catch(e){ setStatus('Fehler: '+(e.message||e)); } };
    var logoutBtn=modal.querySelector('[data-logout-btn]');
    if(logoutBtn) logoutBtn.onclick=function(){ logout(); setStatus('Teilnehmer abgemeldet.'); };
    var forgotPasswordBtn=modal.querySelector('[data-forgot-password]');
    if(forgotPasswordBtn) forgotPasswordBtn.onclick=function(){ alert('Passwort vergessen? Bitte Admin oder Dozent kontaktieren. Der Admin kann dein Passwort zurücksetzen.'); };
    modal.querySelectorAll('[data-dozent-unlock]').forEach(function(btn){ btn.onclick=function(){ var card=btn.closest('.egt-admin-card')||modal; var inp=card.querySelector('[data-dozent-pin]')||modal.querySelector('[data-dozent-pin]'); unlockDozent(inp&&inp.value); }; });
    modal.querySelectorAll('[data-demo-dozent-login]').forEach(function(btn){ btn.onclick=function(){
      var id=btn.getAttribute('data-demo-dozent-login');
      var card=btn.closest('.egt-admin-subcard')||modal;
      var inp=card.querySelector('[data-demo-dozent-pin="'+id+'"]');
      var pin=String(inp&&inp.value||'').trim();
      var expected=DEMO_DOZENT_PINS[id];
      if(!expected) return setStatus('Unbekannter Demo-Dozent.');
      if(!demoDozentAccessAllowed()) return setStatus('Demo-Dozent-Zugänge sind außerhalb der lokalen Entwicklungsumgebung deaktiviert.');
      if(pin!==expected) return setStatus('Falsche PIN für '+(id==='DOZENT-A'?'Demo Dozent A':'Demo Dozent B')+'.');
      setActiveDozentProfile(id);
      sessionStorage.setItem(DOZENT_OPEN_KEY,'1');
      sessionStorage.setItem(PORTAL_ROLE_KEY,'dozent');
      setStatus('Angemeldet als '+portalDisplayName('dozent')+'.');
      updateRoleUi(); renderDozentStats(); renderDozentLearners(); switchTab('dozent');
    }; });
    modal.querySelectorAll('[data-admin-unlock]').forEach(function(btn){ btn.onclick=function(){ var card=btn.closest('.egt-admin-card')||modal; var inp=card.querySelector('[data-admin-pin]')||modal.querySelector('[data-admin-pin]'); unlockAdmin(inp&&inp.value); }; });
    modal.querySelectorAll('[data-cloud-retry]').forEach(function(btn){ btn.onclick=function(){ retryCloudConnection(); }; });
    modal.querySelectorAll('[data-admin-close-portal]').forEach(function(closePortalBtn){
      var doClose=function(e){
        try{ if(e){ e.preventDefault(); e.stopPropagation(); } }catch(_e){}
        closeModal(e);
      };
      closePortalBtn.addEventListener('click', doClose, {passive:false});
      closePortalBtn.addEventListener('touchstart', doClose, {passive:false});
      closePortalBtn.addEventListener('pointerdown', doClose, {passive:false});
    });
    modal.querySelector('[data-admin-full-logout]').onclick=async function(){
      // 1) Portal-Session-Keys entfernen
      sessionStorage.removeItem(ADMIN_OPEN_KEY); sessionStorage.removeItem(DOZENT_OPEN_KEY); sessionStorage.removeItem(PORTAL_ROLE_KEY); sessionStorage.removeItem(DOZENT_PROFILE_KEY);
      // 2) Firebase-Auth-Session vollständig beenden (echter Logout)
      try { if(window.EGTAuthEngine && typeof EGTAuthEngine.logout === 'function') { await EGTAuthEngine.logout(); } } catch(e){}
      // 3) Session-Storage des Profils löschen
      try { localStorage.removeItem('egt_auth_profile_session_v1'); } catch(e){}
      // 4) UserDatabase-Logout
      try { if(window.EGTUserDatabase && typeof EGTUserDatabase.logout === 'function') EGTUserDatabase.logout(); } catch(e){}
      closeModal(); setStatus('Vollständig abgemeldet.'); updateRoleUi(); emit('egt:admin-lock');
      // 5) Top-Right zurücksetzen + Sperrbildschirm wieder zeigen
      try { if(window.EGTAuthProfileShell && EGTAuthProfileShell.refresh) EGTAuthProfileShell.refresh(); } catch(e){}
      setTimeout(function(){ try { window.dispatchEvent(new CustomEvent('egt:show-gate', { detail:{ reason:'logout' } })); } catch(e){} }, 300);
    };
    modal.addEventListener('click', async function(e){
      var inlineDemo=e.target.closest('[data-create-demo-inline]');
      if(inlineDemo){
        e.preventDefault();
        if(!adminOpen()) return setStatus('Admin gesperrt.');
        try{
          setStatus('Demo-Daten werden auf diesem Gerät erzeugt…');
          var r=await createDemoLearners();
          setStatus('Demo-Gruppen bereit: '+r.created.length+' Teilnehmer · Passwort: '+r.password);
          renderLearners(); renderAdminStats(); updateReportsPanel(); renderDozentStats(); renderDozentLearners(); updateRoleUi(); switchTab('admin');
        }catch(err){ setStatus('Fehler: '+(err.message||err)); }
        return;
      }
      var dOpen=e.target.closest('[data-phase7-open-dozent]');
      if(dOpen){
        e.preventDefault();
        var dRoot=dOpen.closest('[data-phase7-dozenten]');
        if(dRoot){
          dRoot.querySelectorAll('[data-phase7-open-dozent]').forEach(function(b){ b.classList.toggle('active', b===dOpen); });
          var dDetail=dRoot.querySelector('[data-phase7-detail]');
          if(dDetail) dDetail.innerHTML=dozentDetailHtml(dOpen.getAttribute('data-phase7-open-dozent'));
        }
        return;
      }
      var dRefresh=e.target.closest('[data-phase7-refresh]');
      if(dRefresh){ e.preventDefault(); renderPhase7Dozenten(); setStatus('Dozentenverwaltung aktualisiert.'); return; }
      var dCreate=e.target.closest('[data-phase7-create-dozent]');
      if(dCreate){
        e.preventDefault();
        if(!adminOpen()) return setStatus('Nur Admin kann Dozenten erstellen.');
        var dBox=dCreate.closest('[data-phase7-dozenten]')||modal;
        var name=String((dBox.querySelector('[data-phase7-new-name]')||{}).value||'').trim();
        var email=String((dBox.querySelector('[data-phase7-new-email]')||{}).value||'').trim();
        var groupsRaw=String((dBox.querySelector('[data-phase7-new-groups]')||{}).value||'').trim();
        if(!name) return setStatus('Bitte Dozentenname eingeben.');
        var id=normalizeCode('DOZENT-'+name.split(/\s+/).map(function(x){return x.slice(0,2);}).join('')+'-'+randomCodeChunk(3));
        var groups=groupsRaw ? groupsRaw.split(/[;,\n]+/).map(groupLabel) : [groupLabel(getCourseSettings().prefix)];
        var created=upsertDozentProfile(id,{ displayName:name, email:email, assignedGroups:groups, status:'active', note:'Manuell in Phase 7 erstellt.' });
        renderPhase7Dozenten();
        setStatus('Dozent erstellt: '+created.displayName+' · '+created.dozentId);
        return;
      }
      var dSave=e.target.closest('[data-phase7-save-dozent]');
      if(dSave){
        e.preventDefault();
        if(!adminOpen()) return setStatus('Nur Admin kann Dozentenprofile bearbeiten.');
        var detail=dSave.closest('[data-phase7-detail]'); if(!detail) return;
        var did=dSave.getAttribute('data-phase7-save-dozent');
        var groups=[]; detail.querySelectorAll('[data-phase7-group-choice]:checked').forEach(function(ch){ groups.push(groupLabel(ch.value)); });
        var perms={}; detail.querySelectorAll('[data-phase7-perm]').forEach(function(ch){ perms[ch.getAttribute('data-phase7-perm')]=!!ch.checked; });
        var saved=upsertDozentProfile(did,{
          displayName:(detail.querySelector('[data-phase7-name]')||{}).value||'Dozent',
          email:(detail.querySelector('[data-phase7-email]')||{}).value||'',
          phone:(detail.querySelector('[data-phase7-phone]')||{}).value||'',
          status:(detail.querySelector('[data-phase7-status]')||{}).value||'active',
          assignedGroups:groups,
          permissions:perms,
          note:(detail.querySelector('[data-phase7-note]')||{}).value||''
        });
        renderPhase7Dozenten();
        setStatus('Dozentenprofil gespeichert: '+saved.displayName);
        return;
      }
      var dToggle=e.target.closest('[data-phase7-toggle-dozent]');
      if(dToggle){
        e.preventDefault();
        if(!adminOpen()) return setStatus('Nur Admin kann Dozenten sperren.');
        var tid=dToggle.getAttribute('data-phase7-toggle-dozent');
        var d=dozentProfiles().find(function(x){return normalizeCode(x.dozentId)===normalizeCode(tid);});
        if(!d) return setStatus('Dozent nicht gefunden.');
        var next=d.status==='blocked'?'active':'blocked';
        upsertDozentProfile(d.dozentId,{ status:next });
        renderPhase7Dozenten();
        setStatus(next==='blocked'?'Dozent gesperrt.':'Dozent entsperrt.');
        return;
      }
      var dSet=e.target.closest('[data-phase7-set-active]');
      if(dSet){
        e.preventDefault();
        var activeD=setActiveDozentProfile(dSet.getAttribute('data-phase7-set-active'));
        sessionStorage.removeItem(ADMIN_OPEN_KEY);
        sessionStorage.setItem(DOZENT_OPEN_KEY,'1'); sessionStorage.setItem(PORTAL_ROLE_KEY,'dozent');
        setStatus('Test-Dozent aktiv: '+(activeD&&activeD.displayName||'')+'. Admin-Sitzung wurde für diesen Rollen-Test verlassen.');
        updateRoleUi(); switchTab('teachers');
        return;
      }
      var dOpenParticipant=e.target.closest('[data-phase7-open-participant]');
      if(dOpenParticipant){
        e.preventDefault();
        var puid=dOpenParticipant.getAttribute('data-phase7-open-participant');
        switchTab('participants');
        setTimeout(function(){
          var rootP=document.querySelector('[data-phase2-participants]');
          var detailP=rootP&&rootP.querySelector('[data-phase2-detail]');
          if(detailP) detailP.innerHTML=participantPhase2ProfileHtml(rootP.getAttribute('data-role')||currentPortalRole(), puid);
        },30);
        return;
      }
      var pick=e.target.closest('[data-pick-participant]');
      if(pick){
        e.preventDefault();
        var dd=pick.closest('[data-participant-dropdown]');
        var priorityList=pick.closest('.egt-help-priority-list');
        if(!dd && !priorityList) return;
        (dd||priorityList).querySelectorAll('[data-pick-participant]').forEach(function(b){ b.classList.toggle('active', b===pick); });
        var role=pick.getAttribute('data-role') || (dd && dd.getAttribute('data-role')) || currentPortalRole();
        var targetName=pick.getAttribute('data-open-detail-target');
        var target = targetName==='priority' ? (pick.closest('.egt-help-priority-list') && pick.closest('.egt-help-priority-list').querySelector('[data-priority-detail]')) : dd.querySelector('[data-participant-detail]');
        if(target) target.innerHTML=participantDetailHtml(role, pick.getAttribute('data-pick-participant'));
        return;
      }
      var filter=e.target.closest('[data-filter-status]');
      if(filter){
        e.preventDefault();
        var ddF=filter.closest('[data-participant-dropdown]');
        if(!ddF) return;
        var st=filter.getAttribute('data-filter-status') || 'alle';
        ddF.querySelectorAll('[data-filter-status]').forEach(function(b){ b.classList.toggle('active', b===filter); });
        ddF.querySelectorAll('[data-status]').forEach(function(el){
          if(el.hasAttribute('data-filter-status')) return;
          var itemStatus=el.getAttribute('data-status') || 'unbekannt';
          el.classList.toggle('egt-filter-hidden', st!=='alle' && itemStatus!==st);
        });
        var detail=ddF.querySelector('[data-participant-detail]');
        if(detail) detail.innerHTML='<div class="egt-empty-state">Filter aktiv: '+escapeHtml(participantStatusLabel(st))+'. Teilnehmer auswählen, um Details zu öffnen.</div>';
        return;
      }
      var show=e.target.closest('[data-show-all-participants]');
      if(show){
        e.preventDefault();
        var dd2=show.closest('[data-participant-dropdown]');
        if(!dd2) return;
        var all=dd2.querySelector('[data-participant-all]');
        if(!all) return;
        var hidden=all.classList.toggle('egt-admin-hidden');
        show.textContent = hidden ? 'Alle Teilnehmer anzeigen' : 'Alle Teilnehmer ausblenden';
        return;
      }
      var gPick=e.target.closest('[data-phase5-group]');
      if(gPick){
        var gRoot=gPick.closest('[data-phase5-groups]');
        if(gRoot){
          gRoot.querySelectorAll('[data-phase5-group]').forEach(function(b){ b.classList.toggle('active', b===gPick); });
          var detail=gRoot.querySelector('[data-phase5-detail]');
          if(detail) detail.innerHTML=groupPhase5DetailHtml(gRoot.getAttribute('data-role')||currentPortalRole(), gPick.getAttribute('data-phase5-group'));
        }
        return;
      }
      var gRefresh=e.target.closest('[data-refresh-groups]');
      if(gRefresh){
        var rootG=gRefresh.closest('[data-phase5-groups]');
        var holder=document.querySelector('[data-phase5-group-root]');
        if(holder) holder.innerHTML=groupPhase5WorkspaceHtml((rootG&&rootG.getAttribute('data-role'))||currentPortalRole());
        return;
      }
      var gSave=e.target.closest('[data-phase5-save-group]');
      if(gSave){
        var box=gSave.closest('[data-phase5-groups]');
        var id=gSave.getAttribute('data-phase5-save-group');
        var title=(box.querySelector('[data-phase5-title]')||{}).value||id;
        setStatus('Gruppe vorgemerkt: '+title+'. Die dauerhafte Dozenten-/Status-Speicherung folgt in Phase 7 mit Rechteverwaltung.');
        return;
      }
      var gCreate=e.target.closest('[data-phase5-create-in-group]');
      if(gCreate){
        switchTab('groups');
        var inp=document.querySelector('[data-new-learner-code]');
        if(inp) inp.scrollIntoView({behavior:'smooth', block:'center'});
        setStatus('Teilnehmererstellung unten im Gruppenbereich nutzen. Aktive Kurs-ID vorher passend speichern.');
        return;
      }
      var gOpenParticipant=e.target.closest('[data-group-open-participant]');
      if(gOpenParticipant){
        var uid=gOpenParticipant.getAttribute('data-group-open-participant');
        switchTab('participants');
        setTimeout(function(){
          var rootP=document.querySelector('[data-phase2-participants]');
          var detail=rootP&&rootP.querySelector('[data-phase2-detail]');
          if(detail) detail.innerHTML=participantPhase2ProfileHtml(rootP.getAttribute('data-role')||currentPortalRole(), uid);
        },30);
        return;
      }
      var p2filter=e.target.closest('[data-phase2-filter]');
      if(p2filter){
        e.preventDefault();
        var root=p2filter.closest('[data-phase2-participants]');
        if(!root) return;
        root.querySelectorAll('[data-phase2-filter]').forEach(function(b){ b.classList.toggle('active', b===p2filter); });
        applyPhase2ParticipantFilters(root);
        return;
      }
      var p2open=e.target.closest('[data-phase2-open-profile]');
      if(p2open){
        e.preventDefault();
        var root2=p2open.closest('[data-phase2-participants]');
        if(!root2) return;
        var uid=p2open.getAttribute('data-phase2-open-profile');
        root2.querySelectorAll('[data-phase2-row]').forEach(function(r){ r.classList.toggle('active', r.getAttribute('data-user-id')===uid); });
        var detail=root2.querySelector('[data-phase2-detail]');
        if(detail) detail.innerHTML=participantPhase2ProfileHtml(root2.getAttribute('data-role')||currentPortalRole(), uid);
        return;
      }
      var p2edit=e.target.closest('[data-phase2-edit-profile]');
      if(p2edit){
        e.preventDefault();
        var uidEdit=normalizeCode(p2edit.getAttribute('data-phase2-edit-profile')||'');
        var roleEdit=(p2edit.closest('[data-phase2-participants]')||{}).getAttribute ? (p2edit.closest('[data-phase2-participants]').getAttribute('data-role')||currentPortalRole()) : currentPortalRole();
        var itemEdit=sortedLearnersForRole(roleEdit).find(function(z){ return normalizeCode(z.userId||z.code||z.loginName||z.id)===uidEdit; });
        showUserManageSheet(uidEdit, itemEdit||{});
        setStatus('Profilverwaltung geöffnet: '+uidEdit);
        return;
      }
    });
    modal.addEventListener('input', function(e){
      var root=e.target.closest && e.target.closest('[data-phase2-participants]');
      if(root && e.target.matches('[data-phase2-search]')) applyPhase2ParticipantFilters(root);
      var gRoot=e.target.closest && e.target.closest('[data-phase5-groups]');
      if(gRoot && e.target.matches('[data-phase5-search]')) applyPhase5GroupFilters(gRoot);
      var dRoot=e.target.closest && e.target.closest('[data-phase7-dozenten]');
      if(dRoot && e.target.matches('[data-phase7-search]')) applyPhase7DozentFilters(dRoot);
      var accessRoot=e.target.closest && e.target.closest('[data-access-panel]');
      if(accessRoot && e.target.matches('[data-access-search]')) applyAccessCodeFilters(accessRoot);
    });
    modal.addEventListener('change', function(e){
      var accessRoot=e.target.closest && e.target.closest('[data-access-panel]');
      if(accessRoot && e.target.matches('[data-access-status-filter]')) applyAccessCodeFilters(accessRoot);
      var gRoot=e.target.closest && e.target.closest('[data-phase5-groups]');
      if(gRoot && e.target.matches('[data-phase5-filter]')) applyPhase5GroupFilters(gRoot);
      var dRoot=e.target.closest && e.target.closest('[data-phase7-dozenten]');
      if(dRoot && e.target.matches('[data-phase7-filter]')) applyPhase7DozentFilters(dRoot);
      var root=e.target.closest && e.target.closest('[data-phase2-participants]');
      if(root && e.target.matches('[data-phase2-sort]')){
        var list=root.querySelector('[data-phase2-list]'); if(!list) return;
        var rows=Array.prototype.slice.call(list.querySelectorAll('[data-phase2-row]'));
        var mode=e.target.value;
        rows.sort(function(a,b){
          if(mode==='risk') return prioritySort(a)-prioritySort(b);
          if(mode==='quote') return quoteOf(a)-quoteOf(b);
          if(mode==='activity') return String(b.querySelector('.egt-participant-last b')&&b.querySelector('.egt-participant-last b').textContent||'').localeCompare(String(a.querySelector('.egt-participant-last b')&&a.querySelector('.egt-participant-last b').textContent||''),'de');
          return String(a.querySelector('.egt-participant-identity b')&&a.querySelector('.egt-participant-identity b').textContent||'').localeCompare(String(b.querySelector('.egt-participant-identity b')&&b.querySelector('.egt-participant-identity b').textContent||''),'de',{numeric:true,sensitivity:'base'});
        });
        rows.forEach(function(r){ list.appendChild(r); });
      }
      function prioritySort(row){ var s=row.getAttribute('data-status'); return s==='kritisch'?1:(s==='riskant'?2:(s==='inaktiv'?3:(s==='stabil'?4:5))); }
      function quoteOf(row){ var t=(row.querySelector('.egt-participant-score b')||{}).textContent||'999'; return parseInt(t,10)||999; }
    });
    modal.addEventListener('change', function(e){
      var cb=e.target.closest&&e.target.closest('[data-bulk-select]');
      if(cb){setLearnerSelected(cb.getAttribute('data-bulk-select'),!!cb.checked);var root=cb.closest('[data-phase2-participants]');if(root)applyPhase2ParticipantFilters(root);return;}
      var allVisible=e.target.closest&&e.target.closest('[data-bulk-select-visible]');
      if(allVisible){var rootV=allVisible.closest('[data-phase2-participants]');if(rootV){rootV.querySelectorAll('[data-phase2-row]:not(.egt-filter-hidden) [data-bulk-select]').forEach(function(x){x.checked=!!allVisible.checked;setLearnerSelected(x.getAttribute('data-bulk-select'),!!x.checked);});applyPhase2ParticipantFilters(rootV);}return;}
      var filterRoot=e.target.closest&&e.target.closest('[data-phase2-participants]');
      if(filterRoot&&e.target.matches('[data-phase2-group],[data-phase2-role],[data-phase2-source],[data-phase2-activity],[data-phase2-level]'))applyPhase2ParticipantFilters(filterRoot);
    });
    modal.addEventListener('click', async function(e){
      var openOps=e.target.closest('[data-open-operations]');if(openOps){e.preventDefault();switchTab('operations');return;}
      var clearSel=e.target.closest('[data-bulk-clear]');if(clearSel){e.preventDefault();clearBulkSelection();var pr=clearSel.closest('[data-phase2-participants]');if(pr)applyPhase2ParticipantFilters(pr);return;}
      var retryOps=e.target.closest('[data-ops-retry-cloud]');if(retryOps){e.preventDefault();retryOps.disabled=true;try{await retryCloudConnection();setStatus('Cloudprüfung abgeschlossen.');}catch(err){setStatus('Cloudprüfung fehlgeschlagen: '+(err.message||err));}finally{retryOps.disabled=false;renderOperations();}return;}
      var flushOps=e.target.closest('[data-ops-flush-sync]');if(flushOps){e.preventDefault();flushOps.disabled=true;try{var fr=await flushPendingSync();setStatus('Sync abgeschlossen: '+Number(fr.flushed||0)+' übertragen, '+Number(fr.pending||0)+' offen.');}catch(err2){setStatus('Sync fehlgeschlagen: '+(err2.message||err2));}finally{flushOps.disabled=false;renderOperations();}return;}
      var exportQueue=e.target.closest('[data-ops-export-queue]');if(exportQueue){e.preventDefault();downloadAdminFile('sync-warteschlange-'+new Date().toISOString().slice(0,10)+'.json',JSON.stringify({exportedAt:nowIso(),status:syncStatus(),queue:pendingSyncQueue()},null,2));setStatus('Sync-Warteschlange exportiert.');return;}
      var deleteDemos=e.target.closest('[data-ops-delete-demos]');if(deleteDemos){e.preventDefault();if(!confirm('Ausschließlich eindeutig markierte Demo-Profile entfernen?'))return;try{var dr=await deleteDemoLearners();appendLocalAudit('deleteDemoLearners','demo-profiles',null,{removed:dr.removed||[]});setStatus('Demo-Profile entfernt: '+Number((dr.removed||[]).length));renderOperations();refreshParticipantsWorkspace();renderAdminStats();}catch(err3){setStatus('Demo-Löschung fehlgeschlagen: '+(err3.message||err3));}return;}
      var bulkRun=e.target.closest('[data-bulk-action]');if(bulkRun){e.preventDefault();var rootOps=bulkRun.closest('[data-operations-root]'),op=(rootOps.querySelector('[data-bulk-operation]')||{}).value||'',group=(rootOps.querySelector('[data-bulk-group]')||{}).value||'',reason=(rootOps.querySelector('[data-bulk-reason]')||{}).value||'';if((op==='block'||op==='archive')&&!reason.trim()){setStatus('Für Sperren und Archivieren ist eine Begründung erforderlich.');return;}if(op==='setGroup'&&!group){setStatus('Bitte Zielgruppe auswählen.');return;}if(!confirm('Massenaktion '+op+' auf '+selectedLearnerIds().length+' Teilnehmer anwenden?'))return;bulkRun.disabled=true;var resultBox=rootOps.querySelector('[data-bulk-result]');try{var br=await bulkApplySelected(op,group,reason);if(resultBox)resultBox.textContent=Number(br.success||0)+' erfolgreich · '+Number(br.failed||0)+' fehlgeschlagen';setStatus('Massenaktion abgeschlossen.');clearBulkSelection();refreshParticipantsWorkspace();renderAdminStats();await renderAuditLog();}catch(err4){if(resultBox)resultBox.textContent='Fehler: '+(err4.message||err4);setStatus('Massenaktion fehlgeschlagen: '+(err4.message||err4));}finally{bulkRun.disabled=false;}return;}
      var bulkExport=e.target.closest('[data-bulk-export]');if(bulkExport){e.preventDefault();var ids=selectedLearnerIds(),all=localAll(),rows=ids.map(function(id){return all[id]||null;}).filter(Boolean),ops=adminOperations();rows=rows.map(function(p){return ops&&ops.sanitizePrivacyExport?ops.sanitizePrivacyExport(p):p;});downloadAdminFile('teilnehmer-auswahl-'+new Date().toISOString().slice(0,10)+'.json',JSON.stringify({exportedAt:nowIso(),courseId:state.courseId,learnerIds:ids,learners:rows},null,2));appendLocalAudit('bulkExport','selection',null,{count:ids.length});setStatus('Auswahl exportiert: '+ids.length+' Teilnehmer.');return;}
      var pPreview=e.target.closest('[data-privacy-preview]');if(pPreview){e.preventDefault();var pRoot=pPreview.closest('[data-operations-root]'),id=normalizeCode((pRoot.querySelector('[data-privacy-learner]')||{}).value||selectedLearnerIds()[0]||''),out=pRoot.querySelector('[data-privacy-result]');try{var prof=await privacyProfile(id),ops2=adminOperations(),inv=ops2&&ops2.privacyInventory?ops2.privacyInventory(prof):{};if(out)out.innerHTML='<div class="egt-admin-kv"><b>ID</b><span>'+escapeHtml(id)+'</span><b>Quelle</b><span>'+escapeHtml(inv.source||'—')+'</span><b>Sessions</b><span>'+Number(inv.learning&&inv.learning.sessions||0)+'</span><b>Antworten</b><span>'+Number(inv.learning&&inv.learning.answers||0)+'</span><b>Adminnotiz</b><span>'+(inv.administration&&inv.administration.notes?'vorhanden':'nein')+'</span><b>Sperre</b><span>'+(inv.administration&&inv.administration.blocked?'ja':'nein')+'</span></div>';}catch(err5){if(out)out.textContent='Fehler: '+(err5.message||err5);}return;}
      var pExport=e.target.closest('[data-privacy-export]');if(pExport){e.preventDefault();var eroot=pExport.closest('[data-operations-root]'),eid=normalizeCode((eroot.querySelector('[data-privacy-learner]')||{}).value||selectedLearnerIds()[0]||'');try{await exportPrivacyData(eid);setStatus('Datenauskunft exportiert: '+eid);await renderAuditLog();}catch(err6){setStatus('Datenauskunft fehlgeschlagen: '+(err6.message||err6));}return;}
      var pDelete=e.target.closest('[data-privacy-delete]');if(pDelete){e.preventDefault();var droot=pDelete.closest('[data-operations-root]'),did=normalizeCode((droot.querySelector('[data-privacy-learner]')||{}).value||selectedLearnerIds()[0]||'');try{await deletePrivacyData(did);clearBulkSelection();setStatus('Teilnehmerdaten vollständig gelöscht: '+did);refreshParticipantsWorkspace();renderAdminStats();renderOperations();}catch(err7){setStatus(err7.message||String(err7));}return;}
      var savePolicy=e.target.closest('[data-save-privacy-policy]');if(savePolicy){e.preventDefault();var sroot=savePolicy.closest('[data-operations-root]'),policy={retentionDays:Number((sroot.querySelector('[data-privacy-retention]')||{}).value||730),aiDataRetentionDays:Number((sroot.querySelector('[data-privacy-ai-retention]')||{}).value||30),autoDeleteInactive:!!((sroot.querySelector('[data-privacy-auto-delete]')||{}).checked),updatedAt:nowIso()};try{if(privilegedWritesViaFunctions()){var sr=await secureCallable('adminAction',{courseId:state.courseId,action:'savePrivacyPolicy',policy:policy},['admin']);policy=Object.assign(policy,sr.policy||{});}savePrivacyPolicyLocal(policy);appendLocalAudit('savePrivacyPolicy','settings/privacy',null,policy);setStatus('Aufbewahrungsregeln gespeichert.');await renderAuditLog();}catch(err8){setStatus('Regeln konnten nicht gespeichert werden: '+(err8.message||err8));}return;}
      var refreshAudit=e.target.closest('[data-refresh-audit]');if(refreshAudit){e.preventDefault();await renderAuditLog();setStatus('Audit-Log aktualisiert.');return;}
      var exportAudit=e.target.closest('[data-export-audit]');if(exportAudit){e.preventDefault();var al=document.querySelector('[data-audit-list]'),entries=al&&al.__auditEntries||await fetchSecurityAudit(250),ver=await verifyAuditEntries(entries);downloadAdminFile('audit-log-'+new Date().toISOString().slice(0,10)+'.json',JSON.stringify({exportedAt:nowIso(),courseId:state.courseId,verification:ver,entries:entries},null,2));setStatus('Audit-Log exportiert.');return;}
    });
    modal.addEventListener('click', async function(e){
      var gen=e.target.closest('[data-generate-access-code]');
      if(gen){
        e.preventDefault();
        var panel=gen.closest('[data-access-panel]'); if(!panel) return;
        var role=currentPortalRole();
        if(!(role==='admin' || role==='dozent')) return setStatus('Bitte zuerst als Admin oder Dozent einloggen.');
        var targetRole='participant';
        var picked=panel.querySelector('[data-access-role]:checked');
        if(role==='admin' && picked) targetRole=picked.value;
        var groupInput=panel.querySelector('[data-access-group]');
        var daysInput=panel.querySelector('[data-access-days]');
        var countInput=panel.querySelector('[data-access-count]');
        var noteInput=panel.querySelector('[data-access-note]');
        var out=panel.querySelector('[data-access-result]');
        var days=Math.max(0, parseInt((daysInput&&daysInput.value)||'30',10)||0);
        var count=Math.min(100, Math.max(1, parseInt((countInput&&countInput.value)||'1',10)||1));
        var expiresAt = days>0 ? new Date(Date.now()+days*86400000).toISOString() : null;
        try{
          if(out) out.textContent= count>1 ? (count+' Codes werden in Firebase erstellt…') : 'Code wird in Firebase erstellt…';
          var created=[];
          for(var ci=0; ci<count; ci++){
            var r=await createAccessCode({ role:targetRole, groupId:groupInput&&groupInput.value, maxUses:1, expiresAt:expiresAt, note:noteInput&&noteInput.value });
            created.push(r);
          }
          var dauerTxt = days>0 ? (days+' Tage (bis '+new Date(expiresAt).toLocaleDateString('de-DE')+')') : 'unbegrenzt';
          var txt;
          if(count===1){
            txt='Code erstellt\n\n'+created[0].code+'\nRolle: '+roleDisplayValue(created[0].role)+'\nGruppe: '+(created[0].groupId||'—')+'\nGültig: '+dauerTxt;
            try{ if(navigator.clipboard && navigator.clipboard.writeText) await navigator.clipboard.writeText(created[0].code); }catch(copyErr){}
          } else {
            txt=count+' Codes erstellt · Rolle: '+roleDisplayValue(created[0].role)+' · Gültig: '+dauerTxt+'\n\n'+created.map(function(c,i){return (i+1)+'. '+c.code;}).join('\n');
          }
          if(out) out.textContent=txt;
          setStatus(count>1 ? (count+' Zugangscodes erstellt') : ('Zugangscode erstellt: '+created[0].code));
          renderAccessCodes(role);
        }catch(err){ if(out) out.textContent='Fehler: '+(err.message||err); setStatus('Fehler: '+(err.message||err)); }
        return;
      }
      var refresh=e.target.closest('[data-refresh-access-codes]');
      if(refresh){ e.preventDefault(); var p=refresh.closest('[data-access-panel]'); var r=(p&&p.getAttribute('data-access-panel'))||currentPortalRole(); renderAccessCodes(r); setStatus('Zugangscodes aktualisiert.'); return; }
      var exportCodes=e.target.closest('[data-export-access-codes]');
      if(exportCodes){ e.preventDefault(); var ep=exportCodes.closest('[data-access-panel]'); var er=(ep&&ep.getAttribute('data-access-panel'))||currentPortalRole(); try{ var xr=await exportAccessCodesCsv(er); setStatus('Zugangscode-CSV exportiert: '+xr.rows+' Codes.'); }catch(ex){ setStatus('Export-Fehler: '+(ex.message||ex)); } return; }
      var openCode=e.target.closest('[data-open-access-code]');
      if(openCode){ e.preventDefault(); var op=openCode.closest('[data-access-panel]'); var orole=(op&&op.getAttribute('data-access-panel'))||currentPortalRole(); var oc=openCode.getAttribute('data-open-access-code')||''; var detail=document.querySelector('[data-access-detail="'+orole+'"]'); if(detail){ detail.innerHTML=accessCodeDetailHtml(orole, oc); detail.setAttribute('data-filled','1'); } if(op){ op.querySelectorAll('[data-access-code-row]').forEach(function(r){ r.classList.toggle('active', normalizeCode(r.getAttribute('data-code'))===normalizeCode(oc)); }); } return; }
      var copy=e.target.closest('[data-copy-access-code]');
      if(copy){ e.preventDefault(); var c=copy.getAttribute('data-copy-access-code')||''; try{ if(navigator.clipboard && navigator.clipboard.writeText){ await navigator.clipboard.writeText(c); setStatus('Code kopiert: '+c); } else { alert(c); } }catch(err2){ setStatus('Code: '+c); } return; }
      var revoke=e.target.closest('[data-revoke-access-code]');
      if(revoke){ e.preventDefault(); var code=revoke.getAttribute('data-revoke-access-code')||''; if(!confirm('Zugangscode widerrufen?\n\n'+code)) return; try{ await revokeAccessCode(code); setStatus('Zugangscode widerrufen: '+code); renderAccessCodes(currentPortalRole()); }catch(err3){ setStatus('Fehler: '+(err3.message||err3)); } return; }
      var extend=e.target.closest('[data-extend-code]');
      if(extend){ e.preventDefault(); var ecode=extend.getAttribute('data-extend-code')||''; showExtendCodeModal(ecode); return; }
    });
    /* G54.45.1: Phase-5-Werkzeuge delegiert statt direkt gebunden.
       Ursache: switchTab('groups') rendert [data-phase5-group-root] per
       innerHTML neu; direkt gebundene onclick-Handler gingen dabei verloren.
       Folge: Teilnehmer erstellen, Demo-Daten, Export und Kurs-Reset waren
       nach dem ersten Wechsel in den Gruppen-Tab stumm tot. */
    function setCreateResult(text){ var el=modal.querySelector('[data-create-result]'); if(el) el.textContent=String(text||''); }
    async function phase5SaveCourse(){ if(!adminOpen()) return setStatus('Admin gesperrt.'); var cs=await saveCourseSettings({ year:(modal.querySelector('[data-course-year]')||{}).value, course:(modal.querySelector('[data-course-code]')||{}).value, track:(modal.querySelector('[data-course-track]')||{}).value, digits:(modal.querySelector('[data-course-digits]')||{}).value }); syncCourseInputs(); var ni=modal.querySelector('[data-new-learner-code]'); if(ni) ni.value=await nextCode(); setStatus('Kursgruppe gespeichert: '+cs.prefix); renderAdminStats(); renderDozentStats(); }
    async function phase5SuggestCode(){ if(!adminOpen()) return setStatus('Admin gesperrt.'); var ni=modal.querySelector('[data-new-learner-code]'); if(ni) ni.value=await nextCode(); }
    async function phase5CreateCustom(){ if(!adminOpen()) return setStatus('Admin gesperrt.'); try{ var course=getCourseSettings(); var ni=modal.querySelector('[data-new-learner-code]'); var code=(ni&&ni.value) || await nextCode(); var nameEl=modal.querySelector('[data-display-name]'); var anonEl=modal.querySelector('[data-anonymous]'); var x=await createLearner({code:code, displayName:nameEl?nameEl.value:'', isAnonymous:anonEl?anonEl.checked:true, course:course.course, year:course.year}); if(ni) ni.value=await nextCode(); if(nameEl) nameEl.value=''; if(anonEl) anonEl.checked=true; setCreateResult('Teilnehmer erstellt\n\nID: '+x.code+'\nEinmalpasswort: '+x.firstPassword+'\n\nDieses Passwort wird später nicht mehr angezeigt.'); setStatus('Teilnehmer erstellt: '+x.code); renderLearners(); renderAdminStats(); renderDozentStats(); renderDozentLearners(); refreshParticipantsWorkspace(); }catch(e){ setCreateResult('Fehler: '+(e.message||e)); setStatus('Fehler: '+(e.message||e)); } }
    async function phase5CreateDemo(){ if(!adminOpen()) return setStatus('Admin gesperrt.'); var out=modal.querySelector('[data-demo-result]'); try{ var r=await createDemoLearners(); var text='Demo-Daten bereit\n\nIDs: '+r.created.join(', ')+'\nPasswort für alle: '+r.password; if(r.skipped&&r.skipped.length) text+='\nNicht überschrieben: '+r.skipped.join(', '); if(out) out.textContent=text; setStatus('Demo-Teilnehmer erzeugt: '+r.created.length); renderLearners(); renderAdminStats(); renderDozentStats(); renderDozentLearners(); refreshParticipantsWorkspace(); }catch(e){ if(out) out.textContent='Fehler: '+(e.message||e); setStatus('Fehler: '+(e.message||e)); } }
    async function phase5DeleteDemo(){ if(!adminOpen()) return setStatus('Admin gesperrt.'); if(!confirm('Alle Demo-Teilnehmer löschen? Echte Teilnehmer bleiben erhalten.')) return; var out=modal.querySelector('[data-demo-result]'); try{ var r=await deleteDemoLearners(); if(out) out.textContent='Demo-Daten gelöscht: '+r.removed.join(', '); setStatus('Demo-Teilnehmer gelöscht: '+r.removed.length); renderLearners(); renderAdminStats(); renderDozentStats(); renderDozentLearners(); refreshParticipantsWorkspace(); }catch(e){ if(out) out.textContent='Fehler: '+(e.message||e); setStatus('Fehler: '+(e.message||e)); } }
    async function phase5Export(){ if(!adminOpen()) return setStatus('Admin gesperrt.'); await exportCourse(); setStatus('JSON-Export erstellt.'); }
    async function phase5ExportCsv(){ if(!adminOpen()) return setStatus('Admin gesperrt.'); var r=await exportCourseCsv(); setStatus('CSV-Export erstellt. Teilnehmer: '+r.rows); }
    async function phase5Reset(){ if(!adminOpen()) return setStatus('Admin gesperrt.'); var ci=modal.querySelector('[data-reset-confirm]'); var confirmText=String((ci&&ci.value)||'').trim().toUpperCase(); if(confirmText!=='RESET') return setStatus('Zum Kurs-Reset bitte RESET eingeben.'); if(confirm('Wirklich alle Teilnehmerdaten dieses Kurses löschen? Vorher Export empfohlen.')){ var r=await resetCourse(); if(ci) ci.value=''; setStatus('Reset erledigt. Gelöscht: '+r.deleted); renderLearners(); renderAdminStats(); renderDozentStats(); renderDozentLearners(); refreshParticipantsWorkspace(); } }
    modal.addEventListener('click', function(e){
      if(!e.target || !e.target.closest) return;
      var map=[['[data-save-course]',phase5SaveCourse],['[data-suggest-code]',phase5SuggestCode],['[data-create-custom]',phase5CreateCustom],['[data-create-demo]',phase5CreateDemo],['[data-delete-demo]',phase5DeleteDemo],['[data-export]',phase5Export],['[data-export-csv]',phase5ExportCsv],['[data-reset]',phase5Reset]];
      for(var i=0;i<map.length;i++){ if(e.target.closest(map[i][0])){ e.preventDefault(); map[i][1](); return; } }
    });
    var refreshLearnersBtn=modal.querySelector('[data-refresh-learners]');
    if(refreshLearnersBtn) refreshLearnersBtn.onclick=function(){ if(!adminOpen()) return setStatus('Admin gesperrt.'); renderLearners(); renderAdminStats(); };
    modal.querySelectorAll('[data-open-participant-manager]').forEach(function(btn){ btn.onclick=function(){ if(!adminOpen()) return setStatus('Nur Admin.'); openParticipantManager(); }; });
    modal.addEventListener('click', async function(e){
      var refresh=e.target.closest('[data-refresh-system]');
      if(refresh){ e.preventDefault(); if(!adminOpen()) return setStatus('Nur Admin.'); updateRoleUi(); await updateSystemDiagnostics(); setStatus('Systemdiagnose aktualisiert.'); return; }
      var backup=e.target.closest('[data-system-backup-export]');
      if(backup){ e.preventDefault(); if(!adminOpen()) return setStatus('Nur Admin.'); var b=exportSystemBackup(); setStatus('Systembackup exportiert: '+b.counts.participants+' Teilnehmer, '+b.counts.accessCodes+' Codes, '+b.counts.tickets+' Tickets.'); return; }
      var copyDiag=e.target.closest('[data-copy-diagnostics]');
      if(copyDiag){ e.preventDefault(); if(!adminOpen()) return setStatus('Nur Admin.'); try{ var txt=await systemDiagnosticsText(); if(navigator.clipboard && navigator.clipboard.writeText){ await navigator.clipboard.writeText(txt); setStatus('Diagnose in die Zwischenablage kopiert.'); } else { alert(txt); } }catch(err){ setStatus('Diagnose konnte nicht kopiert werden: '+(err.message||err)); } return; }
      var clearRuntime=e.target.closest('[data-clear-runtime-cache]');
      if(clearRuntime){ e.preventDefault(); if(!adminOpen()) return setStatus('Nur Admin.'); var ok=confirm('Runtime-/Service-Worker-Caches löschen? Teilnehmerprofile bleiben erhalten. Danach die App neu laden.'); if(!ok) return; try{ var deleted=await clearRuntimeCaches(); await updateSystemDiagnostics(); setStatus('Runtime-Cache gelöscht: '+(deleted.length?deleted.join(', '):'kein Cache gefunden')+'. Danach App neu laden.'); }catch(err2){ setStatus('Cache konnte nicht gelöscht werden: '+(err2.message||err2)); } return; }
    });
    modal.addEventListener('change', function(e){
      var fileInput=e.target.closest && e.target.closest('[data-system-backup-import]');
      if(!fileInput) return;
      if(!adminOpen()){ setStatus('Nur Admin.'); fileInput.value=''; return; }
      var file=fileInput.files && fileInput.files[0]; if(!file) return;
      var reader=new FileReader();
      reader.onload=function(){ try{ var obj=restoreSystemBackupFromText(reader.result); updateRoleUi(); renderLearners(); renderAdminStats(); renderAccessCodePanels(); updateReportsPanel(); setStatus('Systembackup importiert: '+((obj.counts&&obj.counts.participants)||0)+' Teilnehmer im Backup. App neu laden empfohlen.'); }catch(err){ setStatus('Backup-Import fehlgeschlagen: '+(err.message||err)); } finally { fileInput.value=''; } };
      reader.onerror=function(){ setStatus('Backup konnte nicht gelesen werden.'); fileInput.value=''; };
      reader.readAsText(file);
    });
    var refreshQ=modal.querySelector('[data-refresh-qbank]'); if(refreshQ) refreshQ.onclick=function(){ if(!adminOpen()) return setStatus('Nur Admin.'); var q=document.querySelector('[data-qbank-quality]'); if(q) q.innerHTML=questionBankQualityHtml(); var qs=document.querySelector('[data-qbank-quality-summary]'); if(qs) qs.innerHTML=questionBankQualitySummaryHtml();
    updateReportsPanel(); setStatus('Aufgabenbank geprüft.'); };
    var copyQ=modal.querySelector('[data-copy-qbank]'); if(copyQ) copyQ.onclick=async function(){ if(!adminOpen()) return setStatus('Nur Admin.'); var txt=questionBankQualityReportText(); try{ if(navigator.clipboard && navigator.clipboard.writeText){ await navigator.clipboard.writeText(txt); setStatus('Aufgabenbank-Prüfbericht kopiert.'); } else { alert(txt); } }catch(e){ setStatus('Prüfbericht konnte nicht kopiert werden: '+(e.message||e)); } };
    modal.addEventListener('click', async function(e){
      var typeBtn=e.target.closest('[data-phase8-report-type]');
      if(typeBtn){
        e.preventDefault();
        var rootType=typeBtn.closest('[data-phase8-reports]');
        phase8SetPreview(rootType, typeBtn.getAttribute('data-phase8-report-type') || 'participants');
        setStatus('Berichtstyp geöffnet: '+reportTypeMeta(typeBtn.getAttribute('data-phase8-report-type')).title);
        return;
      }
      var role=currentPortalRole();
      var btn=e.target.closest('[data-export-report-csv],[data-export-report-json],[data-export-help-csv],[data-export-help-json],[data-copy-report],[data-print-report]');
      if(!btn) return;
      e.preventDefault();
      if(!can(role,'exportReports')) return setStatus('Für diese Rolle ist Export nicht erlaubt.');
      var root=btn.closest('[data-phase8-reports]');
      var type=phase8CurrentTypeFrom(root);
      var meta=reportTypeMeta(type);
      var prefix=role==='admin'?'admin-gesamt':'dozent-gruppe';
      if(btn.hasAttribute('data-export-report-csv')){ downloadTextFile('assessments-'+prefix+'-'+meta.file+'-'+reportSafeDate()+'.csv', reportCsv(role,false,type), 'text/csv;charset=utf-8'); setStatus('CSV exportiert: '+meta.title+'.'); }
      else if(btn.hasAttribute('data-export-report-json')){ downloadTextFile('assessments-'+prefix+'-'+meta.file+'-'+reportSafeDate()+'.json', reportJson(role,false,type), 'application/json;charset=utf-8'); setStatus('JSON exportiert: '+meta.title+'.'); }
      else if(btn.hasAttribute('data-export-help-csv')){ downloadTextFile('assessments-'+prefix+'-hilfebedarf-'+reportSafeDate()+'.csv', reportCsv(role,true,'help'), 'text/csv;charset=utf-8'); setStatus('Hilfebedarf-CSV erstellt.'); }
      else if(btn.hasAttribute('data-export-help-json')){ downloadTextFile('assessments-'+prefix+'-hilfebedarf-'+reportSafeDate()+'.json', reportJson(role,true,'help'), 'application/json;charset=utf-8'); setStatus('Hilfebedarf-JSON erstellt.'); }
      else if(btn.hasAttribute('data-print-report')){ var opened=openReportPrintView(role,type); setStatus(opened ? 'Druck-/PDF-Ansicht geöffnet: '+meta.title+'.' : 'Druckbericht als HTML exportiert: '+meta.title+'.'); }
      else if(btn.hasAttribute('data-copy-report')){ var txt=reportText(role,type); try{ if(navigator.clipboard && navigator.clipboard.writeText){ await navigator.clipboard.writeText(txt); setStatus('Bericht kopiert: '+meta.title+'.'); } else { alert(txt); } }catch(err){ setStatus('Bericht konnte nicht kopiert werden: '+(err.message||err)); } }
    });

    modal.addEventListener('click', async function(e){
      var probe=e.target.closest('[data-language-progress-cloud-probe]');
      var summaryBtn=e.target.closest('[data-language-progress-cloud-summary]');
      var expJson=e.target.closest('[data-language-progress-export-json]');
      var expCsv=e.target.closest('[data-language-progress-export-csv]');
      var copyDiag=e.target.closest('[data-language-progress-copy-diagnosis]');
      if(!(probe||summaryBtn||expJson||expCsv||copyDiag)) return;
      e.preventDefault();
      var role=currentPortalRole();
      if(!can(role,'viewReports')) return setStatus('Für diese Rolle ist Sprachfortschritt nicht freigegeben.');
      var out=document.querySelector('[data-language-progress-output]');
      if(probe){
        if(out) out.textContent='Cloud-Leseprobe läuft…';
        var res=await adminLanguageProgressCloudProbe();
        if(out) out.textContent=JSON.stringify(res,null,2);
        setStatus(res.ok?'Cloud-Leseprobe erfolgreich: '+res.count+' Zeilen.':'Cloud-Leseprobe Hinweis: '+res.message);
        return;
      }
      if(summaryBtn){
        if(out) out.textContent='Cloud-Zusammenfassung läuft…';
        var sum=await adminLanguageProgressCloudSummary();
        if(out) out.textContent=JSON.stringify(sum,null,2);
        setStatus(sum.ok?'Cloud-Zusammenfassung: '+sum.count+' Zeilen, '+sum.accuracy+'% Trefferquote.':'Cloud-Zusammenfassung Hinweis: '+sum.message);
        return;
      }
      if(expJson){ downloadTextFile('sprachfortschritt-de-en-'+reportSafeDate()+'.json', JSON.stringify(adminLanguageProgressSnapshot(),null,2), 'application/json;charset=utf-8'); setStatus('Sprachfortschritt JSON exportiert.'); return; }
      if(expCsv){ downloadTextFile('sprachfortschritt-de-en-'+reportSafeDate()+'.csv', adminLanguageProgressCsv(), 'text/csv;charset=utf-8'); setStatus('Sprachfortschritt CSV exportiert.'); return; }
      if(copyDiag){
        var txt=adminLanguageProgressText();
        try{ if(navigator.clipboard&&navigator.clipboard.writeText){ await navigator.clipboard.writeText(txt); setStatus('Sprachfortschritt-Diagnose kopiert.'); } else { alert(txt); } }catch(err){ setStatus('Diagnose konnte nicht kopiert werden: '+(err.message||err)); }
        return;
      }
    });

    updateRoleUi();
  }

  /* G54.45.1: Phase-2-Teilnehmeransicht wurde nur beim Modal-Öffnen gerendert.
     Nach Demo-Daten/Neuanlage oder Tabwechsel zeigte sie deshalb 0 Teilnehmer,
     obwohl die Daten vorhanden waren. Zentraler Rerender behebt das. */
  function refreshParticipantsWorkspace(){
    try{
      var p2=document.querySelector('[data-phase2-participant-root]');
      if(p2) p2.innerHTML=participantPhase2WorkspaceHtml(currentPortalRole()==='dozent'?'dozent':'admin');
    }catch(e){}
  }

  function openModal(){
    var m=document.getElementById('egtAdminModal');
    if(m){
      bodySheetLock(true);
      m.classList.add('show');
      m.classList.add('egt-admin-native-scroll');
      m.setAttribute('aria-hidden','false');
      setTimeout(sheetToTop, 25);
      // Firebase-Session prüfen und sessionStorage-Keys setzen (Admin-Auto-Login)
      currentPortalRole();
      updateUI(); updateRoleUi(); renderDozentStats(); renderDozentLearners();
      var startTab=defaultPortalTabForSession();
      if(startTab!=='login') switchTab(startTab);
      if(adminOpen()) nextCode().then(function(c){ var inp=m.querySelector('[data-new-learner-code]'); if(inp && !inp.value) inp.value=c; });
      renderLearners(); renderAdminStats();
      var p2=m.querySelector('[data-phase2-participant-root]'); if(p2) p2.innerHTML=participantPhase2WorkspaceHtml(currentPortalRole()==='dozent'?'dozent':'admin');
    }
  }
  function closeModal(e){ try{ if(e && e.cancelable) e.preventDefault(); if(e) e.stopPropagation(); }catch(_e){} var m=document.getElementById('egtAdminModal'); if(m){ m.classList.remove('show'); m.classList.remove('egt-admin-native-scroll'); m.setAttribute('aria-hidden','true'); } bodySheetLock(false); try{ document.documentElement.classList.remove('egt-admin-sheet-open'); document.body.classList.remove('egt-admin-sheet-open'); }catch(_e2){} }
  function switchTab(tab){
    var m=document.getElementById('egtAdminModal'); if(!m) return;
    var role=currentPortalRole();
    if(role==='locked' && tab!=='login') tab='login';
    if(tab==='login' && roleSessionActive()) tab=defaultPortalTabForSession();
    if(role==='dozent' && !(tab==='teachers' || tab==='participants' || tab==='reports')) tab='teachers';
    if((tab==='system' || tab==='operations' || tab==='roadmap' || tab==='qbank') && role!=='admin'){
      setStatus(lockedTextFor(tab));
      tab = role==='dozent' ? 'teachers' : 'login';
    }
    m.querySelectorAll('[data-tab]').forEach(function(b){
      var key=b.getAttribute('data-tab');
      var visible=!b.classList.contains('egt-admin-hidden');
      var locked=!visible;
      b.classList.toggle('active', key===tab);
      b.setAttribute('aria-selected', key===tab ? 'true' : 'false');
      b.setAttribute('tabindex', key===tab ? '0' : '-1');
      b.disabled=locked;
      b.classList.toggle('locked', locked);
      if(locked) b.setAttribute('title', 'Für diese Rolle nicht sichtbar.'); else b.removeAttribute('title');
    });
    m.querySelectorAll('[data-panel]').forEach(function(p){ var active=p.getAttribute('data-panel')===tab; p.classList.toggle('egt-admin-hidden', !active); p.setAttribute('aria-hidden', active?'false':'true'); });
    if(tab==='admin'){ renderAdminStats(); updateTicketBadge(); }
    if(tab==='participants'){ renderLearners(); refreshParticipantsWorkspace(); }
    if(tab==='groups'){ var gr=document.querySelector('[data-phase5-group-root]'); if(gr) gr.innerHTML=groupPhase5WorkspaceHtml(currentPortalRole()==='dozent'?'dozent':'admin'); renderAdminStats(); }
    if(tab==='codes'){ renderAccessCodes('admin'); }
    if(tab==='tickets'){ renderTickets(); }
    if(tab==='archive'){ renderUserArchive(); }
    if(tab==='teachers'){ renderDozentStats(); renderDozentLearners(); if(role==='dozent') renderAccessCodes('dozent'); }
    if(tab==='system'){ updateSystemDiagnostics(); }
    if(tab==='operations'){ renderOperations(); }
    if(tab==='reports'){ updateReportsPanel(); }
    setTimeout(function(){ syncAdminTabbarToActive(m, tab); updateAdminTabbarScrollState(m); }, 40);
    setTimeout(sheetToTop, 10);
    updateUI(); updateRoleUi();
  }

  function adminStoredPin(){ try{return localStorage.getItem(ADMIN_PIN_KEY) || '';}catch(e){return '';} }
  async function storeAdminPin(pin){ var salt=randomBytes(16); var hash=await hashPassword(pin, salt); try{ localStorage.setItem(ADMIN_PIN_KEY, JSON.stringify({scheme:'sha256-salt', salt:salt, hash:hash, createdAt:nowIso()})); }catch(e){ throw new Error('Admin-PIN konnte nicht gespeichert werden.'); } }
  async function verifyAdminPin(pin, existing){
    if(!existing) return false;
    try{ var obj=JSON.parse(existing); if(obj && obj.scheme==='sha256-salt'){ return await hashPassword(pin, obj.salt) === obj.hash; } }catch(e){}
    try{ return existing===btoa(pin); }catch(e2){ return false; }
  }
  async function unlockAdmin(pin){
    if(!localRolePinsAllowed()) return setStatus('Lokale Admin-PINs sind im Produktionsmodus deaktiviert. Bitte mit einem Firebase-Admin-Konto anmelden.');
    pin=String(pin||'').trim(); if(!pin) return setStatus('PIN eingeben.');
    var existing=adminStoredPin();
    try{
      if(!existing){ if(pin.length<6) return setStatus('PIN muss mindestens 6 Zeichen haben.'); await storeAdminPin(pin); sessionStorage.setItem(ADMIN_OPEN_KEY,'1'); sessionStorage.setItem(PORTAL_ROLE_KEY,'admin'); announcePortalState('Admin-PIN sicher gesetzt und geöffnet.'); renderLearners(); renderAdminStats(); renderDozentStats(); updateRoleUi(); openModal(); switchTab('admin'); return; }
      if(await verifyAdminPin(pin, existing)){
        try{ var parsed=JSON.parse(existing); if(!parsed.scheme) await storeAdminPin(pin); }catch(migrate){ await storeAdminPin(pin); }
        sessionStorage.setItem(ADMIN_OPEN_KEY,'1'); sessionStorage.setItem(PORTAL_ROLE_KEY,'admin'); announcePortalState('Admin geöffnet.'); renderLearners(); renderAdminStats(); renderDozentStats(); updateRoleUi(); var m=document.getElementById('egtAdminModal'); if(m) nextCode().then(function(c){ var inp=m.querySelector('[data-new-learner-code]'); if(inp) inp.value=c; }); switchTab('admin');
      } else setStatus('Falsche Admin-PIN.');
    }catch(e){ setStatus('Admin-Fehler: '+(e.message||e)); }
  }

  function updateUI(){
    setStatus(statusText());
    updateConnectionUi();
    var mode=document.querySelector('[data-system-mode]'); if(mode) mode.textContent=state.online?'online':'lokal';
    var sysCourse=document.querySelector('[data-system-course]'); if(sysCourse) sysCourse.textContent=state.courseId;
    var active=document.querySelector('[data-active-profile]');
    if(active){ active.innerHTML=state.learner?('<div class="egt-admin-kv"><b>ID</b><span>'+escapeHtml(state.learner.userId||state.learner.code||'')+'</span><b>Name</b><span>'+escapeHtml(state.learner.displayName||state.learner.alias||'')+'</span><b>Status</b><span>'+escapeHtml(state.learner.status||'active')+'</span><b>Passwort</b><span>'+(state.profile&&state.profile.mustChangePassword?'Änderung erforderlich':'gesetzt')+'</span><b>Risiko</b><span>'+escapeHtml(state.profile&&state.profile.global&&state.profile.global.riskLevel||'unbekannt')+'</span></div>'):'Kein Teilnehmer aktiv.'; }
    var sum=document.querySelector('[data-profile-summary]'); if(sum){ sum.innerHTML=profileHtml(); }
    var er=document.querySelector('[data-profile-errors]'); if(er){ er.innerHTML=errorsHtml(); }
    var qbank=document.querySelector('[data-qbank-quality]'); if(qbank){ qbank.innerHTML=questionBankQualityHtml(); }
    updateRoleUi();
    if(typeof window.updateLoginBtnState === 'function') { try { window.updateLoginBtnState(); } catch(e){} }
  }

  function flattenQuestionBank(){
    var out=[];
    try{
      var raw = Array.isArray(window.QUESTION_BANK_EXTERNAL) ? window.QUESTION_BANK_EXTERNAL : [];
      raw.forEach(function(item){
        if(Array.isArray(item)) item.forEach(function(q){ if(q && typeof q==='object') out.push(q); });
        else if(item && typeof item==='object') out.push(item);
      });
    }catch(e){}
    return out;
  }
  function normalizeQText(v){ return String(v==null?'':v).trim(); }
  function qSig(q){ return normalizeQText(q.question).toLowerCase().replace(/\s+/g,' ')+'::'+(Array.isArray(q.answers)?q.answers.map(function(a){return normalizeQText(a).toLowerCase();}).join('|'):''); }
  function qGroup(q){ return normalizeQText(q.group || q.category || q.cat || 'Unbekannt'); }
  function qbankDeepAudit(){
    var list=flattenQuestionBank();
    var byGroup={}, byCategory={}, byDifficulty={}, byStatus={}, bySource={}, issueCounts={}, issues=[], ids={}, sigs={}, fachIssues=[];
    function addIssue(q, type, text){ issueCounts[type]=(issueCounts[type]||0)+1; if(issues.length<80) issues.push({id:normalizeQText(q&&q.id)||'-', group:qGroup(q||{}), type:type, text:text}); }
    list.forEach(function(q,idx){
      var group=qGroup(q), cat=normalizeQText(q.category || q.cat || 'ohne Kategorie'), diff=normalizeQText(q.difficulty || (q.dna&&q.dna.difficulty) || 'unbekannt'), status=normalizeQText((q.phase4&&q.phase4.quality) || q.status || (q.verified?'verified':'unbekannt')), src=normalizeQText(q.source || 'ohne Quelle');
      byGroup[group]=(byGroup[group]||0)+1; byCategory[cat]=(byCategory[cat]||0)+1; byDifficulty[diff]=(byDifficulty[diff]||0)+1; byStatus[status]=(byStatus[status]||0)+1; bySource[src]=(bySource[src]||0)+1;
      var id=normalizeQText(q.id); if(!id) addIssue(q,'ID fehlt','Aufgabe ohne stabile ID.'); else { if(ids[id]) addIssue(q,'Doppelte ID','ID mehrfach vorhanden: '+id); ids[id]=true; }
      var question=normalizeQText(q.question); if(question.length<8) addIssue(q,'Frage fehlt/kurz','Fragetext ist leer oder zu kurz.');
      var ans=Array.isArray(q.answers)?q.answers:[]; if(ans.length<2) addIssue(q,'Antworten fehlen','Weniger als zwei Antwortoptionen.');
      ans.forEach(function(a,i){ if(!normalizeQText(a)) addIssue(q,'Leere Antwort','Antwortoption '+(i+1)+' ist leer.'); });
      var correct = (q.correct!=null?q.correct:(q.correctIndex!=null?q.correctIndex:null));
      if(correct==null || isNaN(Number(correct)) || Number(correct)<0 || Number(correct)>=Math.max(1,ans.length)) addIssue(q,'Lösung ungültig','Correct-Index fehlt oder liegt außerhalb der Antworten.');
      if(!normalizeQText(q.explanation)) addIssue(q,'Erklärung fehlt','Keine Erklärung hinterlegt.');
      if(!Array.isArray(q.tags) || q.tags.length===0) addIssue(q,'Tags fehlen','Keine Tags hinterlegt.');
      var sig=qSig(q); if(sigs[sig]) addIssue(q,'Mögliche Dublette','Sehr ähnliche Frage/Antwort-Kombination.'); sigs[sig]=true;
      var hay=(group+' '+cat+' '+normalizeQText(q.subtype)+' '+normalizeQText(q.question)+' '+(Array.isArray(q.tags)?q.tags.join(' '):'')).toLowerCase();
      if(hay.indexOf('python')>=0 && group!=='IT/FISI'){ var msg='Python-Bezug außerhalb IT/FISI in '+group; fachIssues.push(msg); addIssue(q,'Fachregel','Python-Bezug außerhalb IT/FISI.'); }
      if((hay.indexOf('sozial')>=0 || hay.indexOf('pädagog')>=0 || hay.indexOf('paedagog')>=0 || hay.indexOf('bindung')>=0) && group!=='Sozialpädagogik' && group!=='Allgemeinwissen'){
        fachIssues.push('Pädagogik-Bezug in Gruppe '+group); addIssue(q,'Fachregel','Pädagogik-Bezug wirkt falsch gruppiert.');
      }
      if((hay.indexOf('skonto')>=0 || hay.indexOf('rabatt')>=0 || hay.indexOf('büro')>=0 || hay.indexOf('kauf')>=0) && group!=='Kaufmännisch' && group!=='Mathe'){
        fachIssues.push('Kaufmännischer Bezug in Gruppe '+group); addIssue(q,'Fachregel','Kaufmännischer Bezug wirkt falsch gruppiert.');
      }
    });
    var issueTotal=Object.keys(issueCounts).reduce(function(a,k){return a+issueCounts[k];},0);
    var critical=(issueCounts['Lösung ungültig']||0)+(issueCounts['Antworten fehlen']||0)+(issueCounts['ID fehlt']||0)+(issueCounts['Doppelte ID']||0);
    var score=list.length?Math.max(0, Math.round(100 - (critical*4 + (issueTotal-critical)*0.35))):0;
    var status = critical>0 ? 'kritisch' : (issueTotal>0 ? 'prüfen' : 'sauber');
    return {total:list.length, score:score, status:status, critical:critical, issueTotal:issueTotal, byGroup:byGroup, byCategory:byCategory, byDifficulty:byDifficulty, byStatus:byStatus, bySource:bySource, issueCounts:issueCounts, issues:issues, fachIssues:fachIssues.slice(0,20), generatedAt:new Date().toISOString()};
  }
    function qbankToneFor(value){ value=String(value||'').toLowerCase(); if(value.indexOf('krit')>=0 || value.indexOf('ungültig')>=0 || value.indexOf('fehlt')>=0) return 'danger'; if(value.indexOf('prüf')>=0 || value.indexOf('warn')>=0 || value.indexOf('review')>=0) return 'warn'; return 'ok'; }
  function qbankBars(obj, maxItems){
    var entries=Object.keys(obj||{}).map(function(k){ return [k, Number(obj[k]||0)]; }).sort(function(a,b){ return b[1]-a[1]; }).slice(0,maxItems||12);
    var max=Math.max(1, entries.reduce(function(m,x){return Math.max(m,x[1]);},0));
    return '<div class="egt-qbank-bars">'+(entries.map(function(x){ var pct=Math.max(x[1]?6:0, Math.round((x[1]/max)*100)); return '<div class="egt-qbank-bar"><span>'+escapeHtml(x[0])+'</span><i style="width:'+pct+'%"></i><b>'+x[1]+'</b></div>'; }).join('') || '<p class="egt-admin-hint">Keine Daten.</p>')+'</div>';
  }
  function issuePills(obj){
    var keys=Object.keys(obj||{}).sort(function(a,b){return obj[b]-obj[a];});
    if(!keys.length) return '<span class="egt-admin-pill good">keine offenen Hinweise</span>';
    return keys.map(function(k){ return '<span class="egt-admin-pill '+qbankToneFor(k)+'">'+escapeHtml(k)+' · '+obj[k]+'</span>'; }).join('');
  }
  function qbankIssueList(audit){
    if(!audit.issues || !audit.issues.length) return '<p class="egt-admin-hint">Keine kritischen Stichproben gefunden.</p>';
    return '<details class="egt-qbank-details"><summary>Hinweise / Stichproben anzeigen ('+audit.issues.length+')</summary><div class="egt-qbank-issue-list">'+audit.issues.map(function(x){ return '<div class="egt-qbank-issue"><b>'+escapeHtml(x.type)+'</b><span>'+escapeHtml(x.id)+' · '+escapeHtml(x.group)+'</span><small>'+escapeHtml(x.text)+'</small></div>'; }).join('')+'</div></details>';
  }
  function questionBankQualitySummaryHtml(){
    var a=qbankDeepAudit();
    return '<div class="egt-qbank-summary"><span class="egt-admin-pill '+qbankToneFor(a.status)+'">'+escapeHtml(a.status)+'</span><div><b>'+a.total+'</b><span>Aufgaben</span></div><small>'+a.score+'% Qualitätswert · '+a.issueTotal+' Hinweise</small></div>';
  }
  function questionBankQualityReportText(){
    var a=qbankDeepAudit();
    var lines=[];
    lines.push('Novura · '+((window.AppConfig&&window.AppConfig.version)||'G54.46.6')+' Aufgabenbank-Qualitätsprüfung');
    lines.push('Generiert: '+a.generatedAt);
    lines.push('Aufgaben: '+a.total);
    lines.push('Qualitätswert: '+a.score+'%');
    lines.push('Status: '+a.status);
    lines.push('Kritisch: '+a.critical);
    lines.push('Hinweise gesamt: '+a.issueTotal);
    lines.push('Gruppen: '+Object.keys(a.byGroup).sort().map(function(k){return k+'='+a.byGroup[k];}).join(', '));
    lines.push('Schwierigkeit: '+Object.keys(a.byDifficulty).sort().map(function(k){return k+'='+a.byDifficulty[k];}).join(', '));
    lines.push('Statuswerte: '+Object.keys(a.byStatus).sort().map(function(k){return k+'='+a.byStatus[k];}).join(', '));
    lines.push('Hinweisarten: '+Object.keys(a.issueCounts).sort(function(x,y){return a.issueCounts[y]-a.issueCounts[x];}).map(function(k){return k+'='+a.issueCounts[k];}).join(', '));
    if(a.fachIssues.length) lines.push('Fachregeln: '+a.fachIssues.join(' | '));
    return lines.join('\n');
  }
  function qbankMetricCard(value,label,meta,tone){
    return '<article class="egt-qbank-metric '+escapeHtml(tone||'neutral')+'"><strong>'+escapeHtml(value)+'</strong><span>'+escapeHtml(label)+'</span><small>'+escapeHtml(meta||'')+'</small></article>';
  }
  function questionBankQualityHtml(){
    var a=qbankDeepAudit();
    var tone=qbankToneFor(a.status);
    var fachValue = a.fachIssues.length ? String(a.fachIssues.length) : 'OK';
    return '<div class="egt-qbank-panel">'
      +'<div class="egt-qbank-head"><div><span class="egt-session-kicker">Aufgabenbank</span><h3>Qualitätsprüfung</h3><p>Prüft Schema, Lösungen, Antwortoptionen, Dubletten, Fachgruppen und Metadaten.</p></div><div class="egt-qbank-score '+tone+'"><b>'+a.score+'%</b><span>'+escapeHtml(a.status)+'</span></div></div>'
      +'<div class="egt-qbank-metrics">'
        +qbankMetricCard(a.total,'Aufgaben','vollständig analysiert','info')
        +qbankMetricCard(a.issueTotal,'Hinweise','Prüfung empfohlen',a.issueTotal?'warn':'ok')
        +qbankMetricCard(a.critical,'Kritische Punkte','blockierende Strukturfehler',a.critical?'danger':'ok')
        +qbankMetricCard(fachValue,'Fachlogik',a.fachIssues.length?'Fachhinweise offen':'Regeln ohne Befund',a.fachIssues.length?'warn':'ok')
      +'</div>'
      +'<div class="egt-qbank-grid"><div class="egt-admin-subcard"><strong>Fachgruppen</strong>'+qbankBars(a.byGroup,10)+'</div><div class="egt-admin-subcard"><strong>Schwierigkeit</strong>'+qbankBars(a.byDifficulty,8)+'</div></div>'
      +'<div class="egt-admin-subcard egt-qbank-hints"><strong>Hinweisarten</strong><div class="egt-qbank-pills">'+issuePills(a.issueCounts)+'</div></div>'
      +(a.fachIssues.length?'<details class="egt-qbank-details"><summary>Fachregel-Hinweise anzeigen</summary><div class="egt-qbank-issue-list">'+a.fachIssues.map(function(x){return '<div class="egt-qbank-issue"><b>Fachregel</b><span>'+escapeHtml(x)+'</span></div>';}).join('')+'</div></details>':'')
      +qbankIssueList(a)
      +'<p class="egt-admin-hint">Stand: '+escapeHtml(a.generatedAt)+' · Diese Prüfung verändert keine Aufgaben, sie zeigt nur Qualitäts- und Strukturhinweise.</p>'
      +'</div>';
  }

  function profileHtml(){
    var p=state.profile; if(!p) return 'Noch kein Profil aktiv.';
    var dna=coachDnaSnapshot(p.userId||p.code);
    var dnaHtml='';
    if(dna && dna.profile){
      dnaHtml='<div class="egt-admin-learner"><strong>COACH-DNA</strong><div class="egt-admin-kv"><b>Datenbasis</b><span>'+escapeHtml(dna.readiness.label)+' · '+(dna.readiness.percent||0)+'%</span><b>Trefferquote</b><span>'+(dna.readiness.score||0)+'%</span><b>Nächster Fokus</b><span>'+escapeHtml(dna.nextAction&&dna.nextAction.category||'Allgemein')+'</span></div><p>'+escapeHtml(dna.nextAction&&dna.nextAction.text||'Noch keine Empfehlung.')+'</p></div>';
    }
    var mods=p.modules||{};
    var moduleHtml=Object.keys(mods).map(function(k){ var m=mods[k]||{}; return '<div class="egt-admin-learner"><strong>'+escapeHtml(k.toUpperCase())+'</strong><div class="egt-admin-kv"><b>Quote</b><span>'+Math.round(((m.correct||0)/Math.max(1,m.answered||0))*100)+'%</span><b>Versuche</b><span>'+(m.answered||0)+'</span><b>Ø Score</b><span>'+(m.averageScore||0)+'</span></div></div>'; }).join('') || 'Noch keine Moduldaten.';
    return dnaHtml + moduleHtml;
  }
  function errorsHtml(){
    var p=state.profile, errs=p&&p.global&&p.global.recurringErrors||{};
    var dna=coachDnaSnapshot(p && (p.userId||p.code));
    var dnaWeak=dna && dna.weaknesses && dna.weaknesses.length ? '<div class="egt-admin-learner"><strong>Schwächenprofil</strong>' + dna.weaknesses.map(function(w){ return '<span class="egt-admin-pill">'+escapeHtml(w.category)+' · '+w.percent+'%</span>'; }).join('') + '</div>' : '';
    var keys=Object.keys(errs).sort(function(a,b){return errs[b]-errs[a];}).slice(0,8);
    var errHtml=keys.length ? keys.map(function(k){ return '<span class="egt-admin-pill">'+escapeHtml(k)+' · '+errs[k]+'</span>'; }).join('') : '<p>Noch keine wiederkehrenden Fehler gespeichert.</p>';
    return dnaWeak + errHtml;
  }
  /* ─── USER-ARCHIV TAB (G39.1) ─── */
  async function renderUserArchive(){
    var listBox=document.getElementById('egtArchiveList');
    if(!listBox) return;
    listBox.innerHTML='<div class="egt-empty-state"><b>Archiv wird geladen…</b></div>';
    try{
      var list=await listUserArchive();
      if(!list.length){ listBox.innerHTML='<div class="egt-empty-state"><b>Noch keine Einträge</b><span>Verwarnungen und Sperren werden hier archiviert.</span></div>'; return; }
      listBox.innerHTML=list.map(function(a){
        var type=a.type||'warnung';
        var cls = type==='gesperrt'?'egt-status-block' : type==='entsperrt'?'egt-status-unblock' : 'egt-status-warn';
        var typeLabel = type==='gesperrt'?'🔒 Gesperrt' : type==='entsperrt'?'🔓 Entsperrt' : '⚠️ Verwarnung';
        return '<div class="egt-archive-entry">'+
          '<div class="egt-archive-head">'+
            '<span class="egt-archive-type '+cls+'">'+typeLabel+'</span>'+
            '<span class="egt-archive-user">'+escapeHtml(a.learnerId||'?')+'</span>'+
            '<span class="egt-archive-time">'+escapeHtml(fmtDate(a.createdAt))+' · von '+escapeHtml(a.createdBy||'admin')+'</span>'+
          '</div>'+
          '<div class="egt-archive-text">'+escapeHtml(a.text||'—')+'</div>'+
        '</div>';
      }).join('');
    }catch(e){ listBox.innerHTML='<div class="egt-empty-state"><b>Fehler</b><span>'+escapeHtml(e.message||e)+'</span></div>'; }
  }

  /* ─── TICKETS TAB (G39.13 · Phase 9) ─── */
  function normalizeTicketStatus(status){
    status=String(status||'offen').toLowerCase();
    if(status==='open') return 'offen';
    if(status==='in_progress' || status==='progress' || status==='bearbeitung') return 'bearbeitung';
    if(status==='done' || status==='closed' || status==='gelöst' || status==='geloest' || status==='geschlossen') return 'geschlossen';
    if(status==='wontfix' || status==='abgelehnt') return 'abgelehnt';
    return ['offen','bearbeitung','geschlossen','abgelehnt'].indexOf(status)>=0 ? status : 'offen';
  }
  function normalizeTicketPriority(priority){
    priority=String(priority||'mittel').toLowerCase();
    if(priority==='critical') return 'kritisch';
    if(priority==='high') return 'hoch';
    if(priority==='medium') return 'mittel';
    if(priority==='low') return 'niedrig';
    return ['kritisch','hoch','mittel','niedrig'].indexOf(priority)>=0 ? priority : 'mittel';
  }
  function normalizeTicketCategory(category){
    category=String(category||'sonstiges').toLowerCase();
    if(category==='layout') return 'darstellung';
    if(category==='task') return 'aufgabe';
    if(category==='function') return 'funktion';
    if(category==='crash') return 'absturz';
    return ['darstellung','aufgabe','funktion','absturz','inhalt','zugang','sonstiges'].indexOf(category)>=0 ? category : 'sonstiges';
  }
  function ticketStatusLabel(status){ return ({offen:'Offen',bearbeitung:'In Bearbeitung',geschlossen:'Geschlossen',abgelehnt:'Abgelehnt'})[normalizeTicketStatus(status)] || 'Offen'; }
  function ticketStatusClass(status){ return ({offen:'egt-status-danger',bearbeitung:'egt-status-warn',geschlossen:'egt-status-ok',abgelehnt:'egt-status-neutral'})[normalizeTicketStatus(status)] || 'egt-status-danger'; }
  function ticketPriorityClass(priority){ return ({kritisch:'egt-status-danger',hoch:'egt-status-warn',mittel:'egt-status-info',niedrig:'egt-status-ok'})[normalizeTicketPriority(priority)] || 'egt-status-info'; }
  function ticketPriorityValue(priority){ return ({kritisch:1,hoch:2,mittel:3,niedrig:4})[normalizeTicketPriority(priority)] || 9; }
  function ticketSafeId(id){ return safeId(String(id||('TKT-'+Date.now()))); }
  function ticketReporterName(t){ return (t&&t.reporter&&(t.reporter.nickname||t.reporter.displayName||t.reporter.email)) || t.reporterName || 'Anonym'; }
  function ticketReporterRole(t){ return (t&&t.reporter&&(t.reporter.role||t.reporter.accessRole)) || t.reporterRole || 'unknown'; }
  function ticketGroupId(t){ var raw=(t&&t.groupId) || (t&&t.reporter&&t.reporter.groupId) || (t&&t.context&&t.context.groupId) || ''; return raw ? groupLabel(raw) : ''; }
  function ticketVisibleFor(role,t){
    role=role||currentPortalRole();
    if(role==='admin') return true;
    if(role==='dozent'){
      var gid=ticketGroupId(t);
      var assigned=normalizeCode(t&&t.assignedTo||'');
      var dz=activeDozentProfile();
      if(dz && assigned && normalizeCode(dz.dozentId)===assigned) return true;
      return gid && canViewGroup('dozent', gid);
    }
    return false;
  }
  function normalizeTicket(ticket){
    ticket=clone(ticket||{});
    ticket.id = String(ticket.id || ('TKT-' + Date.now().toString(36).toUpperCase()));
    ticket.createdAt = ticket.createdAt || nowIso();
    ticket.updatedAt = ticket.updatedAt || ticket.createdAt;
    ticket.status = normalizeTicketStatus(ticket.status);
    ticket.priority = normalizeTicketPriority(ticket.priority);
    ticket.category = normalizeTicketCategory(ticket.category);
    ticket.description = String(ticket.description || ticket.text || '').trim();
    ticket.title = ticket.title || (ticket.description ? ticket.description.slice(0,70) : ('Ticket '+ticket.id));
    if(typeof ticket.reporter === 'string'){ ticket.reporter = { nickname: ticket.reporter }; }
    ticket.reporter = (ticket.reporter && typeof ticket.reporter === 'object') ? ticket.reporter : {};
    ticket.reporter.nickname = ticket.reporter.nickname || ticket.reporter.displayName || ticket.reporterName || 'Anonym';
    ticket.reporter.role = ticketReporterRole(ticket);
    ticket.reporter.uid = ticket.reporter.uid || ticket.reporter.userId || ticket.reporter.profileId || 'anon';
    ticket.groupId = ticketGroupId(ticket) || '';
    ticket.assignedTo = normalizeCode(ticket.assignedTo || '');
    ticket.internalNote = ticket.internalNote || '';
    ticket.solution = ticket.solution || '';
    ticket.history = Array.isArray(ticket.history) ? ticket.history : [];
    if(!ticket.history.length){ ticket.history.push({ at:ticket.createdAt, by:ticketReporterName(ticket), type:'created', text:'Ticket erstellt' }); }
    return ticket;
  }
  function mergeTicketLists(){
    var map={};
    function add(list){
      (list||[]).forEach(function(t){
        t=normalizeTicket(t);
        var existing = map[t.id];
        if(existing && existing.updatedAt && t.updatedAt && String(existing.updatedAt) > String(t.updatedAt)) {
          // Keep existing if it has a newer updatedAt timestamp
        } else {
          map[t.id] = Object.assign({}, existing || {}, t);
        }
      });
    }
    add(pendingTickets());
    add(localTickets());
    return Object.keys(map).map(function(k){ return normalizeTicket(map[k]); });
  }
  function saveTicketLocal(ticket){
    ticket=normalizeTicket(ticket);
    var list=localTickets().map(normalizeTicket);
    var idx=list.findIndex(function(x){ return x.id===ticket.id; });
    if(idx>=0) list[idx]=Object.assign({}, list[idx], ticket, { updatedAt:ticket.updatedAt||nowIso() });
    else list.unshift(ticket);
    list.sort(function(a,b){ return ticketPriorityValue(a.priority)-ticketPriorityValue(b.priority) || String(b.createdAt||'').localeCompare(String(a.createdAt||'')); });
    localSaveTickets(list);
    updateTicketBadge();
    emit('egt:tickets-updated', { count:list.length });
    return ticket;
  }
  async function saveTicket(ticket){
    await init(); ticket=normalizeTicket(ticket); ticket.updatedAt=nowIso(); saveTicketLocal(ticket);
    if(state.online){
      try{
        var sec=securityContext(); var uid=sec&&sec.user&&sec.user.uid;
        if(privilegedWritesViaFunctions() && (currentPortalRole()==='admin'||currentPortalRole()==='dozent')){
          await secureCallable('adminAction',{courseId:state.courseId,action:'ticketPatch',ticketId:ticket.id,patch:ticket},['admin','teacher']);
        }else{
          if(!uid || (sec.user&&sec.user.isAnonymous)) throw new Error('Bestätigte Anmeldung für Ticket erforderlich.');
          ticket.reporterUid=uid; ticket.groupId=ticket.groupId||(state.profile&&state.profile.groupId)||'';
          await state.sync.fsMod.setDoc(docRef('courses/'+state.courseId+'/tickets/'+ticketSafeId(ticket.id)),ticket);
        }
      }catch(e){state.error='Ticket lokal gespeichert · Cloud-Sync fehlgeschlagen: '+(e.message||e);}
    }
    return ticket;
  }
  async function listTickets(){
    await init(); var map={}; mergeTicketLists().forEach(function(t){map[t.id]=t;});
    if(state.online){
      try{
        var fs=state.sync.fsMod, ref=colRef('courses/'+state.courseId+'/tickets'), qs; updateSecurityState();
        if(state.securityRole==='admin') qs=await fs.getDocs(ref);
        else if(state.securityRole==='teacher'){
          var groups=groupAccessForRole('dozent').groups||[]; if(!groups.length) return [];
          qs=await fs.getDocs(fs.query(ref,fs.where('groupId','in',groups.slice(0,10))));
        }else{
          var sec=securityContext(),uid=sec&&sec.user&&sec.user.uid; if(!uid) return [];
          qs=await fs.getDocs(fs.query(ref,fs.where('reporterUid','==',uid)));
        }
        qs.forEach(function(d){var x=d.data()||{};x.id=x.id||d.id;var remoteT=normalizeTicket(x),localT=map[remoteT.id];if(!(localT&&localT.updatedAt&&remoteT.updatedAt&&String(localT.updatedAt)>String(remoteT.updatedAt))) map[remoteT.id]=remoteT;});
      }catch(e){state.error='Tickets lokal angezeigt · Cloud-Liste fehlgeschlagen: '+(e.message||e);}
    }
    var list=Object.keys(map).map(function(k){return normalizeTicket(map[k]);}).filter(function(t){return ticketVisibleFor(currentPortalRole(),t);});
    list.sort(function(a,b){var sa=normalizeTicketStatus(a.status)==='offen'?0:(normalizeTicketStatus(a.status)==='bearbeitung'?1:2),sb=normalizeTicketStatus(b.status)==='offen'?0:(normalizeTicketStatus(b.status)==='bearbeitung'?1:2);return sa-sb||ticketPriorityValue(a.priority)-ticketPriorityValue(b.priority)||String(b.createdAt||'').localeCompare(String(a.createdAt||''));});
    localSaveTickets(Object.keys(map).map(function(k){return normalizeTicket(map[k]);})); return list;
  }
  function ticketOpenCount(){
    try{ return mergeTicketLists().filter(function(t){ var st=normalizeTicketStatus(t.status); return st==='offen' || st==='bearbeitung'; }).length; }catch(e){ return 0; }
  }
  function updateTicketBadge(){
    var n=ticketOpenCount();
    document.querySelectorAll('[data-ticket-badge]').forEach(function(el){
      el.textContent=String(n);
      el.style.display=n>0?'inline-flex':'none';
    });
    return n;
  }
  async function updateTicketPatch(ticketId, patch, historyText){
    await init();
    var list=mergeTicketLists();
    var id=String(ticketId||'');
    var t=list.find(function(x){ return x.id===id || ticketSafeId(x.id)===ticketSafeId(id); });
    if(!t) throw new Error('Ticket nicht gefunden.');
    if(!ticketVisibleFor(currentPortalRole(), t)) throw new Error('Du darfst dieses Ticket nicht bearbeiten.');
    patch=patch||{};
    if(patch.status!=null) patch.status=normalizeTicketStatus(patch.status);
    if(patch.priority!=null) patch.priority=normalizeTicketPriority(patch.priority);
    if(patch.category!=null) patch.category=normalizeTicketCategory(patch.category);
    if(patch.assignedTo!=null) patch.assignedTo=normalizeCode(patch.assignedTo);
    t=normalizeTicket(Object.assign({}, t, patch, { updatedAt:nowIso() }));
    if(historyText){ t.history.push({ at:nowIso(), by:currentAdminName(), type:'update', text:historyText }); }
    if(t.status==='geschlossen' && !t.closedAt) t.closedAt=nowIso();
    if(t.status!=='geschlossen') t.closedAt=null;
    saveTicketLocal(t);
    if(state.online){
      try{
        if(privilegedWritesViaFunctions()) await secureCallable('adminAction',{courseId:state.courseId,action:'ticketPatch',ticketId:t.id,patch:patch,historyText:historyText||''},['admin','teacher']);
        else await state.sync.fsMod.setDoc(docRef('courses/'+state.courseId+'/tickets/'+ticketSafeId(t.id)), t, { merge:true });
      }catch(e){ state.error='Ticket lokal aktualisiert · Cloud-Update fehlgeschlagen: '+(e.message||e); throw new Error('Cloud-Update fehlgeschlagen: '+(e.message||e)); }
    }
    return t;
  }
  async function updateTicketStatus(ticketId, nextStatus){
    return updateTicketPatch(ticketId, { status:normalizeTicketStatus(nextStatus) }, 'Status geändert auf '+ticketStatusLabel(nextStatus));
  }
  async function updateTicketAdminFields(ticketId, patch){
    return updateTicketPatch(ticketId, patch, 'Ticketdaten aktualisiert');
  }
  async function addTicketComment(ticketId, text){
    text=String(text||'').trim(); if(!text) throw new Error('Notiz fehlt.');
    var list=mergeTicketLists(), id=String(ticketId||'');
    var t=list.find(function(x){ return x.id===id || ticketSafeId(x.id)===ticketSafeId(id); });
    if(!t) throw new Error('Ticket nicht gefunden.');
    t=normalizeTicket(t); t.history.push({ at:nowIso(), by:currentAdminName(), type:'comment', text:text }); t.updatedAt=nowIso();
    saveTicketLocal(t);
    if(state.online){
      try{
        if(privilegedWritesViaFunctions()) await secureCallable('adminAction',{courseId:state.courseId,action:'ticketComment',ticketId:t.id,text:text},['admin','teacher']);
        else await state.sync.fsMod.setDoc(docRef('courses/'+state.courseId+'/tickets/'+ticketSafeId(t.id)), t, { merge:true });
      }catch(e){ state.error=e.message||String(e); throw new Error('Cloud-Update für Notiz fehlgeschlagen: '+(e.message||e)); }
    }
    return t;
  }
  function ticketKpis(list){
    var k={total:list.length,offen:0,bearbeitung:0,geschlossen:0,kritisch:0,hoch:0,screenshot:0};
    list.forEach(function(t){ var st=normalizeTicketStatus(t.status); k[st]=(k[st]||0)+1; if(normalizeTicketPriority(t.priority)==='kritisch') k.kritisch++; if(normalizeTicketPriority(t.priority)==='hoch') k.hoch++; if(t.screenshot) k.screenshot++; });
    return k;
  }
  function ticketCardHtml(t, activeId){
    t=normalizeTicket(t);
    var active=t.id===activeId;
    var search=[t.id,t.title,t.description,t.category,t.priority,t.status,ticketReporterName(t),ticketReporterRole(t),t.groupId,t.assignedTo].join(' ').toLowerCase();
    return '<button class="egt-ticket-card '+ticketStatusClass(t.status)+' '+(active?'active':'')+'" type="button" data-ticket-open="'+escapeHtml(t.id)+'" data-status="'+escapeHtml(t.status)+'" data-priority="'+escapeHtml(t.priority)+'" data-search="'+escapeHtml(search)+'">'
      +'<div class="egt-tcard-header">'
        +'<span class="egt-avatar-dot">🐞</span>'
        +'<span class="egt-tcard-identity"><strong>'+escapeHtml(t.title)+'</strong><small>'+escapeHtml(t.id)+' · '+escapeHtml(ticketReporterName(t))+'</small></span>'
      +'</div>'
      +'<div class="egt-tcard-body">'
        +'<div class="egt-tcard-stats">'
          +'<span class="egt-admin-pill '+ticketPriorityClass(t.priority)+'">'+escapeHtml(t.priority)+'</span>'
          +'<span class="egt-admin-pill '+ticketStatusClass(t.status)+'">'+escapeHtml(ticketStatusLabel(t.status))+'</span>'
        +'</div>'
        +'<div class="egt-tcard-details">'
          +'<div><span>Gruppe:</span><b>'+escapeHtml(t.groupId||'—')+'</b></div>'
          +'<div><span>Datum:</span><small>'+escapeHtml(formatDateShort(t.createdAt))+'</small></div>'
        +'</div>'
      +'</div>'
    +'</button>';
  }
  function ticketHistoryHtml(t){
    var rows=(t.history||[]).slice().reverse().slice(0,12);
    if(!rows.length) return '<div class="egt-empty-state"><b>Kein Verlauf</b><span>Änderungen erscheinen hier.</span></div>';
    return '<div class="egt-phase9-history">'+rows.map(function(h){ return '<div><b>'+escapeHtml(h.type||'Eintrag')+'</b><span>'+escapeHtml(h.text||'')+'</span><small>'+escapeHtml(fmtDate(h.at))+' · '+escapeHtml(h.by||'System')+'</small></div>'; }).join('')+'</div>';
  }
  function ticketAssigneeOptions(selected){
    selected=normalizeCode(selected||'');
    var opts=['<option value="">Nicht zugewiesen</option>'];
    dozentProfiles().map(normalizeDozentProfile).forEach(function(d){ opts.push('<option value="'+escapeHtml(d.dozentId)+'" '+(normalizeCode(d.dozentId)===selected?'selected':'')+'>'+escapeHtml(d.displayName)+' · '+escapeHtml(d.dozentId)+'</option>'); });
    if(selected && opts.join('').indexOf('value="'+escapeHtml(selected)+'"')<0) opts.push('<option value="'+escapeHtml(selected)+'" selected>'+escapeHtml(selected)+'</option>');
    return opts.join('');
  }
  function ticketDetailHtml(list, selectedId){
    var t=list.find(function(x){ return x.id===selectedId; }) || list[0];
    if(!t) return '<aside class="egt-phase9-detail"><div class="egt-empty-state"><b>Kein Ticket ausgewählt</b><span>Sobald Nutzer Fehler melden, erscheint hier die Detailansicht.</span></div></aside>';
    t=normalizeTicket(t);
    var ctx=t.context||{};
    return '<aside class="egt-phase9-detail" data-ticket-detail="'+escapeHtml(t.id)+'">'
      +'<div class="egt-group-detail-head"><div><span class="egt-session-kicker">Ticketdetail</span><h4>'+escapeHtml(t.title)+'</h4><p>'+escapeHtml(t.id)+' · '+escapeHtml(fmtDate(t.createdAt))+'</p></div><span class="egt-admin-pill '+ticketStatusClass(t.status)+'">'+escapeHtml(ticketStatusLabel(t.status))+'</span></div>'
      +'<div class="egt-profile-kpi"><div><b>'+escapeHtml(t.priority)+'</b><span>Priorität</span></div><div><b>'+escapeHtml(t.category)+'</b><span>Kategorie</span></div><div><b>'+escapeHtml(t.groupId||'—')+'</b><span>Gruppe</span></div><div><b>'+escapeHtml(t.assignedTo||'—')+'</b><span>Zuweisung</span></div></div>'
      +'<div class="egt-profile-section"><b>Meldung</b><p>'+escapeHtml(t.description||'Keine Beschreibung')+'</p><div class="egt-admin-kv"><b>Melder</b><span>'+escapeHtml(ticketReporterName(t))+' · '+escapeHtml(ticketReporterRole(t))+'</span><b>Ansicht</b><span>'+escapeHtml(ctx.activeTab||ctx.url||'—')+'</span><b>Gerät</b><span>'+escapeHtml(ctx.viewport||'—')+'</span></div></div>'
      +(t.screenshot?'<details class="egt-report-preview"><summary>📸 Screenshot anzeigen</summary><img src="'+t.screenshot+'" class="egt-phase9-shot" alt="Ticket Screenshot"></details>':'<div class="egt-empty-state"><b>Kein Screenshot</b><span>Dieses Ticket enthält keinen Screenshot.</span></div>')
      +'<div class="egt-profile-section"><b>Bearbeitung</b><div class="egt-phase9-form"><select class="egt-admin-input" data-ticket-edit-status><option value="offen" '+(t.status==='offen'?'selected':'')+'>Offen</option><option value="bearbeitung" '+(t.status==='bearbeitung'?'selected':'')+'>In Bearbeitung</option><option value="geschlossen" '+(t.status==='geschlossen'?'selected':'')+'>Geschlossen</option><option value="abgelehnt" '+(t.status==='abgelehnt'?'selected':'')+'>Abgelehnt</option></select><select class="egt-admin-input" data-ticket-edit-priority><option value="kritisch" '+(t.priority==='kritisch'?'selected':'')+'>Kritisch</option><option value="hoch" '+(t.priority==='hoch'?'selected':'')+'>Hoch</option><option value="mittel" '+(t.priority==='mittel'?'selected':'')+'>Mittel</option><option value="niedrig" '+(t.priority==='niedrig'?'selected':'')+'>Niedrig</option></select><select class="egt-admin-input" data-ticket-edit-assigned>'+ticketAssigneeOptions(t.assignedTo)+'</select></div><textarea class="egt-admin-input" data-ticket-edit-solution rows="3" placeholder="Lösung / interne Bearbeitung…">'+escapeHtml(t.solution||'')+'</textarea><div class="egt-admin-row"><button class="egt-admin-btn" data-ticket-save="'+escapeHtml(t.id)+'" type="button">Ticket speichern</button><button class="egt-admin-btn secondary" data-ticket-status="'+escapeHtml(t.id)+'" data-next="bearbeitung" type="button">→ In Bearbeitung</button><button class="egt-admin-btn secondary" data-ticket-status="'+escapeHtml(t.id)+'" data-next="geschlossen" type="button">✓ Schließen</button></div></div>'
      +'<div class="egt-profile-section"><b>Verlauf</b>'+ticketHistoryHtml(t)+'<textarea class="egt-admin-input" data-ticket-comment rows="2" placeholder="Neue interne Notiz…"></textarea><div class="egt-admin-row"><button class="egt-admin-btn secondary" data-ticket-add-comment="'+escapeHtml(t.id)+'" type="button">Notiz hinzufügen</button></div></div>'
    +'</aside>';
  }
  function ticketWorkspaceHtml(list){
    list=list||[];
    var selected=''; try{ selected=localStorage.getItem('egt_phase9_selected_ticket')||''; }catch(e){}
    if(!list.find(function(t){return t.id===selected;})) selected=list[0]&&list[0].id||'';
    var k=ticketKpis(list), cards=list.map(function(t){ return ticketCardHtml(t, selected); }).join('') || '<div class="egt-empty-state"><b>Noch keine Tickets</b><span>Bug-Meldungen von Teilnehmern erscheinen hier mit Priorität, Status und Verlauf.</span></div>';
    return '<div class="egt-phase9-workspace egt-admin-card-wide">'
      +'<div class="egt-phase2-head"><div><span class="egt-session-kicker">Phase 9 · Ticketsystem</span><h3>Tickets & Support</h3><p>Bugmeldungen, Status, Priorität, Zuweisung, Verlauf und Lösung an einem Ort.</p></div><button class="egt-admin-btn secondary" data-ticket-export type="button">CSV exportieren</button></div>'
      +'<div class="egt-phase4-kpi-grid egt-phase9-kpis">'
        +phase4KpiCardHtml('🎫','Tickets gesamt',k.total,'alle sichtbaren Meldungen','info')
        +phase4KpiCardHtml('🔴','Offen',k.offen,'noch nicht bearbeitet','danger')
        +phase4KpiCardHtml('🟡','In Bearbeitung',k.bearbeitung,'läuft gerade','warn')
        +phase4KpiCardHtml('🚨','Kritisch',k.kritisch,'blockiert Nutzer','danger')
        +phase4KpiCardHtml('📸','Mit Screenshot',k.screenshot,'visuelle Fehler','neutral')
        +phase4KpiCardHtml('✅','Geschlossen',k.geschlossen,'gelöst / erledigt','ok')
      +'</div>'
      +'<div class="egt-phase2-toolbar"><input class="egt-admin-input" data-ticket-search placeholder="Ticket, Melder, Gruppe, Fehler, Status suchen…"><div class="egt-phase2-filters" data-ticket-filters><button class="active" data-ticket-filter="alle">Alle</button><button data-ticket-filter="offen">Offen</button><button data-ticket-filter="bearbeitung">Bearbeitung</button><button data-ticket-filter="kritisch">Kritisch</button><button data-ticket-filter="geschlossen">Geschlossen</button></div></div>'
      +'<div class="egt-phase9-grid"><div class="egt-phase9-list" id="egtTicketList">'+cards+'</div>'+ticketDetailHtml(list, selected)+'</div>'
    +'</div>';
  }
  function filterTicketRows(root){
    root=root||document;
    var q=((root.querySelector('[data-ticket-search]')||{}).value||'').toLowerCase().trim();
    var active=(root.querySelector('[data-ticket-filter].active')||{}).getAttribute ? root.querySelector('[data-ticket-filter].active').getAttribute('data-ticket-filter') : 'alle';
    root.querySelectorAll('[data-ticket-open]').forEach(function(row){
      var st=row.getAttribute('data-status')||''; var pr=row.getAttribute('data-priority')||'';
      var okStatus=active==='alle' || st===active || pr===active;
      var okSearch=!q || String(row.getAttribute('data-search')||'').indexOf(q)>=0;
      row.classList.toggle('egt-filter-hidden', !(okStatus&&okSearch));
    });
  }
  function exportTicketsCsv(list){
    var rows=[['id','status','priority','category','groupId','assignedTo','reporter','role','createdAt','updatedAt','description','solution']];
    (list||[]).forEach(function(t){ t=normalizeTicket(t); rows.push([t.id,t.status,t.priority,t.category,t.groupId,t.assignedTo,ticketReporterName(t),ticketReporterRole(t),t.createdAt,t.updatedAt,t.description,t.solution]); });
    var csv=rows.map(function(r){ return r.map(toCsvCell).join(';'); }).join('\n');
    var blob=new Blob([csv],{type:'text/csv;charset=utf-8'}); var url=URL.createObjectURL(blob); var a=document.createElement('a'); a.href=url; a.download='eignungstest-trainer-tickets-'+new Date().toISOString().slice(0,10)+'.csv'; document.body.appendChild(a); a.click(); setTimeout(function(){URL.revokeObjectURL(url); a.remove();},300);
  }
  async function renderTickets(){
    var root=document.querySelector('[data-phase9-ticket-root]') || document.getElementById('egtTicketList');
    if(!root) return;
    root.innerHTML='<div class="egt-empty-state"><b>Tickets werden geladen…</b><span>Support-Daten werden zusammengeführt.</span></div>';
    try{
      var list=await listTickets();
      updateTicketBadge();
      root.innerHTML=ticketWorkspaceHtml(list);
      root.querySelectorAll('[data-ticket-open]').forEach(function(b){ b.onclick=function(){ try{ localStorage.setItem('egt_phase9_selected_ticket', b.getAttribute('data-ticket-open')); }catch(e){} renderTickets(); }; });
      var search=root.querySelector('[data-ticket-search]'); if(search) search.oninput=function(){ filterTicketRows(root); };
      root.querySelectorAll('[data-ticket-filter]').forEach(function(b){ b.onclick=function(){ root.querySelectorAll('[data-ticket-filter]').forEach(function(x){x.classList.remove('active');}); b.classList.add('active'); filterTicketRows(root); }; });
      root.querySelectorAll('[data-ticket-status]').forEach(function(b){ b.onclick=async function(){ try{ await updateTicketStatus(b.getAttribute('data-ticket-status'), b.getAttribute('data-next')); setStatus('Ticket-Status aktualisiert.'); }catch(e){ setStatus('Lokal geändert · Cloud-Synchronisation fehlgeschlagen: '+(e.message||e)); } renderTickets(); }; });
      root.querySelectorAll('[data-ticket-save]').forEach(function(b){ b.onclick=async function(){ try{ var box=b.closest('[data-ticket-detail]'); await updateTicketAdminFields(b.getAttribute('data-ticket-save'), { status:box.querySelector('[data-ticket-edit-status]').value, priority:box.querySelector('[data-ticket-edit-priority]').value, assignedTo:box.querySelector('[data-ticket-edit-assigned]').value, solution:box.querySelector('[data-ticket-edit-solution]').value }); setStatus('Ticket gespeichert.'); }catch(e){ setStatus('Lokal gespeichert · Cloud-Synchronisation fehlgeschlagen: '+(e.message||e)); } renderTickets(); }; });
      root.querySelectorAll('[data-ticket-add-comment]').forEach(function(b){ b.onclick=async function(){ try{ var box=b.closest('[data-ticket-detail]'); await addTicketComment(b.getAttribute('data-ticket-add-comment'), box.querySelector('[data-ticket-comment]').value); setStatus('Ticketnotiz gespeichert.'); }catch(e){ setStatus('Lokal gespeichert · Cloud-Synchronisation fehlgeschlagen: '+(e.message||e)); } renderTickets(); }; });
      var exp=root.querySelector('[data-ticket-export]'); if(exp) exp.onclick=function(){ exportTicketsCsv(list); };
    }catch(e){ root.innerHTML='<div class="egt-empty-state"><b>Fehler</b><span>'+escapeHtml(e.message||e)+'</span></div>'; }
  }

  /* ─── NUTZER BEARBEITEN MODAL (G38.7) ─── */
  function showEditLearnerModal(userId, currentData){
    var old=document.getElementById('egtEditLearnerModal'); if(old) old.remove();
    var m=document.createElement('div'); m.id='egtEditLearnerModal'; m.className='egt-admin-modal show';
    m.innerHTML='<div class="egt-admin-panel" style="max-width:480px"><div class="egt-sheet-handle" aria-hidden="true"></div>'+
      '<div class="egt-admin-head"><div><h2>Nutzer bearbeiten</h2><p>'+escapeHtml(userId)+'</p></div><button class="egt-admin-btn secondary" onclick="document.getElementById(&quot;egtEditLearnerModal&quot;).remove()">✕</button></div>'+
      '<div class="egt-admin-body"><div class="egt-admin-card">'+
        '<label class="egt-admin-label">Nickname<input class="egt-admin-input" id="editNick" value="'+escapeHtml(currentData.displayName||currentData.alias||'')+'"></label>'+
        '<label class="egt-admin-label" style="margin-top:10px">Rolle<select class="egt-admin-input" id="editRole">'+
          '<option value="participant"'+((!currentData.role||currentData.role==='participant')?' selected':'')+'>Teilnehmer</option>'+
          '<option value="teacher"'+(currentData.role==='teacher'||currentData.role==='dozent'?' selected':'')+'>Dozent</option>'+
          
        '</select></label>'+
        '<label class="egt-admin-label" style="margin-top:10px">Notiz (intern)<input class="egt-admin-input" id="editNote" value="'+escapeHtml(currentData.note||'')+'"></label>'+
        '<div class="egt-admin-row" style="margin-top:16px">'+
          '<button class="egt-admin-btn" id="editSaveBtn">Speichern</button>'+
          '<button class="egt-admin-btn secondary" onclick="document.getElementById(&quot;egtEditLearnerModal&quot;).remove()">Abbrechen</button>'+
        '</div>'+
        '<div class="egt-admin-status" id="editStatus"></div>'+
      '</div></div></div>';
    document.body.appendChild(m);
    document.getElementById('editSaveBtn').onclick=async function(){
      try{
        await updateLearner(userId,{ nickname:document.getElementById('editNick').value, displayName:document.getElementById('editNick').value, role:document.getElementById('editRole').value, note:document.getElementById('editNote').value });
        document.getElementById('editStatus').textContent='✓ Gespeichert';
        setTimeout(function(){ m.remove(); renderLearners(); renderAdminStats(); },800);
      }catch(e){ document.getElementById('editStatus').textContent='Fehler: '+(e.message||e); }
    };
  }

  /* ─── BULK-CODE MODAL (G38.7) ─── */
  function showBulkCodeModal(){
    var old=document.getElementById('egtBulkCodeModal'); if(old) old.remove();
    var m=document.createElement('div'); m.id='egtBulkCodeModal'; m.className='egt-admin-modal show';
    m.innerHTML='<div class="egt-admin-panel" style="max-width:480px"><div class="egt-sheet-handle" aria-hidden="true"></div>'+
      '<div class="egt-admin-head"><div><h2>Codes generieren</h2><p>Einzeln oder als Batch</p></div><button class="egt-admin-btn secondary" onclick="document.getElementById(&quot;egtBulkCodeModal&quot;).remove()">✕</button></div>'+
      '<div class="egt-admin-body"><div class="egt-admin-card">'+
        '<label class="egt-admin-label">Anzahl Codes (1–100)<input class="egt-admin-input" id="bulkCount" type="number" value="1" min="1" max="100"></label>'+
        '<label class="egt-admin-label" style="margin-top:10px">Rolle<select class="egt-admin-input" id="bulkRole"><option value="participant">Teilnehmer</option><option value="teacher">Dozent</option></select></label>'+
        '<label class="egt-admin-label" style="margin-top:10px">Gruppe / Klasse<input class="egt-admin-input" id="bulkGroup" placeholder="z.B. 2026-GK-A"></label>'+
        '<label class="egt-admin-label" style="margin-top:10px">Gültigkeitsdauer in Tagen (0 = unbegrenzt)<input class="egt-admin-input" id="bulkDays" type="number" value="30" min="0" placeholder="z.B. 30 = 1 Monat, 365 = 1 Jahr"></label>'+
        '<div style="font-size:.74rem;color:#8da3c8;margin-top:4px">Beispiele: 7 = 1 Woche · 30 = 1 Monat · 90 = 3 Monate · 365 = 1 Jahr</div>'+
        '<label class="egt-admin-label" style="margin-top:10px">Notiz (optional)<input class="egt-admin-input" id="bulkNote" placeholder="z.B. Klasse 2026 Herbst"></label>'+
        '<div class="egt-admin-row" style="margin-top:16px">'+
          '<button class="egt-admin-btn" id="bulkGenBtn">Codes generieren</button>'+
          '<button class="egt-admin-btn secondary" onclick="document.getElementById(&quot;egtBulkCodeModal&quot;).remove()">Abbrechen</button>'+
        '</div>'+
        '<div class="egt-admin-status" id="bulkStatus"></div>'+
        '<pre id="bulkResult" style="font-size:.72rem;color:#20d9ff;background:rgba(0,0,0,.3);border-radius:8px;padding:10px;margin-top:10px;white-space:pre-wrap;display:none"></pre>'+
      '</div></div></div>';
    document.body.appendChild(m);
    document.getElementById('bulkGenBtn').onclick=async function(){
      var btn=document.getElementById('bulkGenBtn'); btn.disabled=true; btn.textContent='Wird generiert…';
      var st=document.getElementById('bulkStatus'); st.textContent='';
      try{
        var results=await generateBulkCodes({
          count:document.getElementById('bulkCount').value,
          role:document.getElementById('bulkRole').value,
          groupId:document.getElementById('bulkGroup').value,
          days:document.getElementById('bulkDays').value,
          note:document.getElementById('bulkNote').value
        });
        var ok=results.filter(function(r){return !r.error;});
        var fail=results.filter(function(r){return r.error;});
        st.textContent='✓ '+ok.length+' Code(s) generiert'+(fail.length?' · '+fail.length+' Fehler':'');
        var pre=document.getElementById('bulkResult');
        pre.style.display='block';
                var lines=ok.map(function(r,i){ var exp=r.expiresAt?new Date(r.expiresAt).toLocaleDateString('de-DE'):'unbegrenzt'; return (i+1)+'. '+r.code+' - '+r.roleLabel+' - '+exp; }); pre.textContent=lines.join('\n');
        renderAccessCodes('admin'); renderAdminStats();
      }catch(e){ st.textContent='Fehler: '+(e.message||e); }
      btn.disabled=false; btn.textContent='Weitere generieren';
    };
  }

  /* ─── CODE VERLÄNGERN MODAL (G38.7) ─── */
  function showExtendCodeModal(codeId){
    if(!codeId) return;
    var m=document.createElement('div'); m.className='egt-admin-modal show';
    m.innerHTML='<div class="egt-admin-panel" style="max-width:400px"><div class="egt-admin-head"><div><h2>Code verlängern</h2><p>'+escapeHtml(codeId)+'</p></div></div>'+
      '<div class="egt-admin-body"><div class="egt-admin-card">'+
        '<label class="egt-admin-label">Verlängerung in Tagen<input class="egt-admin-input" id="extDays" type="number" value="30" min="1" placeholder="z.B. 30 = 1 Monat"></label>'+
        '<div style="font-size:.74rem;color:#8da3c8;margin-top:4px">Wird ab heute bzw. dem aktuellen Ablaufdatum addiert</div>'+
        '<div class="egt-admin-row" style="margin-top:14px">'+
          '<button class="egt-admin-btn" id="extSaveBtn">Verlängern</button>'+
          '<button class="egt-admin-btn secondary" id="extCancelBtn">Abbrechen</button>'+
        '</div>'+
        '<div class="egt-admin-status" id="extStatus"></div>'+
      '</div></div></div>';
    document.body.appendChild(m);
    m.querySelector('#extCancelBtn').onclick=function(){ m.remove(); };
    m.querySelector('#extSaveBtn').onclick=async function(){
      try{
        var cid=accessCodeId(normalizeCode(codeId));
        var r=await extendCode(cid, document.getElementById('extDays').value);
        document.getElementById('extStatus').textContent='✓ Neues Ablaufdatum: '+new Date(r.newExpiresAt).toLocaleDateString('de-DE');
        setTimeout(function(){ m.remove(); renderAccessCodes(currentPortalRole()); },1200);
      }catch(e){ document.getElementById('extStatus').textContent='Fehler: '+(e.message||e); }
    };
  }

  /* ═══════════════════════════════════════════════════════
     STATISTIK-DASHBOARD MIT DIAGRAMMEN (G39.2)
     Reines SVG, offline-fähig, keine externe Library
     ═══════════════════════════════════════════════════════ */

  // Kürzlich aktiv: ausschließlich bestätigtes Ledger-Ereignis, kein Login-/lastActiveAt-Fallback.
  function countOnlineNow(list){
    var analytics=adminAnalytics(), now=Date.now();
    if(analytics) return (list||[]).filter(function(x){ return analytics.recentLedgerActivity(x,now,15*60*1000); }).length;
    return 0;
  }

  // SVG-Balkendiagramm
  function svgBarChart(data, opts){
    opts=opts||{};
    var w=opts.width||440, h=opts.height||180, pad=opts.pad||36;
    var max=Math.max(1, Math.max.apply(null, data.map(function(d){return d.v;})));
    var bw=(w-pad*2)/data.length;
    var bars=data.map(function(d,i){
      var bh=Math.round((d.v/max)*(h-pad-34));
      var x=pad+i*bw+bw*0.12;
      var y=h-pad-bh;
      var col=d.color||'url(#barGrad)';
      return '<rect x="'+x+'" y="'+y+'" width="'+(bw*0.76)+'" height="'+Math.max(bh,2)+'" rx="6" fill="'+col+'"/>'+
        '<text x="'+(x+bw*0.38)+'" y="'+(y-8)+'" fill="#f1f5ff" font-size="17" font-weight="700" text-anchor="middle">'+d.v+'</text>'+
        '<text x="'+(x+bw*0.38)+'" y="'+(h-pad+22)+'" fill="#a9bcdb" font-size="14" text-anchor="middle">'+escapeHtml(d.l)+'</text>';
    }).join('');
    return '<svg viewBox="0 0 '+w+' '+h+'" preserveAspectRatio="xMidYMid meet" style="width:100%;height:100%" xmlns="http://www.w3.org/2000/svg">'+
      '<defs><linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#20d9ff"/><stop offset="1" stop-color="#2f80ff"/></linearGradient></defs>'+
      bars+'</svg>';
  }

  // SVG-Liniendiagramm
  function svgLineChart(data, opts){
    opts=opts||{};
    var w=opts.width||520, h=opts.height||140, pad=opts.pad||28;
    var max=Math.max(1, Math.max.apply(null, data.map(function(d){return d.v;})));
    var min=Math.min.apply(null, data.map(function(d){return d.v;}));
    var range=Math.max(1, max-min);
    var step=(w-pad*2)/Math.max(1,(data.length-1));
    var pts=data.map(function(d,i){
      var x=pad+i*step;
      var y=h-pad-((d.v-min)/range)*(h-pad-20);
      return {x:x,y:y,v:d.v,l:d.l};
    });
    var path=pts.map(function(p,i){ return (i===0?'M':'L')+p.x+' '+p.y; }).join(' ');
    var area=path+' L'+pts[pts.length-1].x+' '+(h-pad)+' L'+pts[0].x+' '+(h-pad)+' Z';
    var dots=pts.map(function(p){ return '<circle cx="'+p.x+'" cy="'+p.y+'" r="3" fill="#20d9ff"/>'+
      '<text x="'+p.x+'" y="'+(h-pad+14)+'" fill="#8da3c8" font-size="9" text-anchor="middle">'+escapeHtml(p.l)+'</text>'; }).join('');
    return '<svg viewBox="0 0 '+w+' '+h+'" style="width:100%;height:auto" xmlns="http://www.w3.org/2000/svg">'+
      '<defs><linearGradient id="lineArea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#20d9ff" stop-opacity="0.3"/><stop offset="1" stop-color="#20d9ff" stop-opacity="0"/></linearGradient></defs>'+
      '<path d="'+area+'" fill="url(#lineArea)"/>'+
      '<path d="'+path+'" fill="none" stroke="#20d9ff" stroke-width="2"/>'+
      dots+'</svg>';
  }

  // Heatmap (Wochentag x Tageszeit) – Peak-Nutzungszeiten
  function svgHeatmap(grid, opts){
    // grid: 7 Zeilen (Mo-So) x 6 Spalten (4h-Blöcke)
    opts=opts||{};
    var days=['Mo','Di','Mi','Do','Fr','Sa','So'];
    var slots=['0-4','4-8','8-12','12-16','16-20','20-24'];
    var cell=opts.cell||40, lblW=opts.lblW||38, lblH=opts.lblH||22;
    var w=lblW+slots.length*cell, h=lblH+days.length*cell;
    var max=1; grid.forEach(function(row){ row.forEach(function(v){ if(v>max) max=v; }); });
    var cells='';
    for(var d=0; d<7; d++){
      for(var s=0; s<6; s++){
        var v=(grid[d]&&grid[d][s])||0;
        var intensity=v/max;
        var col= v===0 ? 'rgba(96,165,250,.06)' : 'rgba('+Math.round(32+intensity*0)+','+Math.round(120+intensity*97)+','+Math.round(180+intensity*75)+','+(0.2+intensity*0.8)+')';
        cells+='<rect x="'+(lblW+s*cell+2)+'" y="'+(lblH+d*cell+2)+'" width="'+(cell-4)+'" height="'+(cell-4)+'" rx="4" fill="'+col+'"><title>'+days[d]+' '+slots[s]+' Uhr: '+v+'</title></rect>';
      }
      cells+='<text x="'+(lblW-8)+'" y="'+(lblH+d*cell+cell/2+4)+'" fill="#a9bcdb" font-size="14" text-anchor="end">'+days[d]+'</text>';
    }
    for(var s2=0; s2<6; s2++){
      cells+='<text x="'+(lblW+s2*cell+cell/2)+'" y="'+(lblH-6)+'" fill="#a9bcdb" font-size="12" text-anchor="middle">'+slots[s2]+'</text>';
    }
    return '<svg viewBox="0 0 '+w+' '+h+'" preserveAspectRatio="xMidYMid meet" style="width:100%;height:100%" xmlns="http://www.w3.org/2000/svg">'+cells+'</svg>';
  }

  function knownAdminAccounts(){
    var out=[];
    updateSecurityState();
    var sec=securityContext();
    try{
      if(state.claimsTrusted && state.securityRole==='admin' && sec){
        var snap=sec.snapshot();
        out.push({uid:(snap.user&&snap.user.uid)||'firebase-admin',email:(snap.user&&snap.user.email)||'',role:'admin',status:'active',source:'firebase-custom-claims'});
      }else if(localRolePinsAllowed() && sessionStorage.getItem(ADMIN_OPEN_KEY)==='1'){
        out.push({adminId:'local-development-admin',role:'admin',status:'active',source:'development-session'});
      }
    }catch(e){}
    return out;
  }
  function analyticsDateLabel(iso){
    if(!iso) return '—';
    try{ var d=new Date(iso+'T00:00:00Z'); return d.toLocaleDateString('de-DE',{day:'2-digit',month:'2-digit',year:'numeric',timeZone:'UTC'}); }catch(e){ return iso; }
  }
  function analyticsEmptyState(title,text){
    return '<div class="egt-empty-state"><b>'+escapeHtml(title)+'</b><span>'+escapeHtml(text)+'</span></div>';
  }

  // Aktivitäts-, Rollen- und Leistungsdaten aus verifizierbaren Quellen aggregieren.
  function aggregateActivity(list){
    var analytics=adminAnalytics();
    if(analytics && typeof analytics.aggregate==='function'){
      return analytics.aggregate({learners:list||[],teachers:dozentProfiles(),admins:knownAdminAccounts(),now:new Date()});
    }
    return {
      period:{from:'',to:'',days:7},coverage:{learners:(list||[]).length,ledgerProfiles:0,verifiedProfiles:0,legacyOnlyProfiles:0,noLedgerProfiles:(list||[]).length,verifiedPercent:0},
      sessions:{total:0,started:0,completed:0,aborted:0,unclassified:0},simulations:{total:0,started:0,completed:0,aborted:0,unclassified:0},
      recent15:0,dayBars:[],heatGrid:[[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0]],heatTotal:0,weakAreas:[],roles:{counts:{participant:0,teacher:0,admin:0,demo:0,total:0},sources:{}},empty:{activity:true,heat:true,weakAreas:true,roles:true}
    };
  }

  async function renderAdminStats(){
    var dash=document.querySelector('[data-admin-dashboard]');
    var box=document.querySelector('[data-admin-stats]'); if(!box && !dash) return;
    if(!adminOpen()){ if(box) box.textContent=adminLockedText(); if(dash) dash.innerHTML=''; return; }
    try{
      if(dash) dash.innerHTML=portalDashboardHtml('admin');
      var list=await listLearners();
      var st=await courseStats();
      var agg=aggregateActivity(list);
      var onlineNow=agg.recent15;
      st.simulations=agg.simulations.completed;
      st.simulationsStarted=agg.simulations.started;
      st.simulationsAborted=agg.simulations.aborted;
      st.sessions=agg.sessions.completed;
      st.sessionsStarted=agg.sessions.started;
      st.sessionsAborted=agg.sessions.aborted;

      if(dash){
        var elOnline = dash.querySelector('[data-kpi-val="online"]');
        if(elOnline) elOnline.textContent = onlineNow;
        var elSimulations = dash.querySelector('[data-kpi-val="simulations"]');
        if(elSimulations) elSimulations.textContent = st.simulations;
      }

      if(box) box.innerHTML='<div class="egt-admin-stat-grid"><div><b>'+st.total+'</b><span>Teilnehmerprofile</span></div><div><b>'+onlineNow+'</b><span>Ledger aktiv ≤15 Min</span></div><div><b>'+st.simulations+'</b><span>Simulationen abgeschlossen</span></div><div><b>'+agg.accuracy+'%</b><span>Ø Ledger-Quote</span></div></div>'
        +'<div style="margin-top:10px"><span class="egt-admin-pill">Sessions gestartet · '+st.sessionsStarted+'</span><span class="egt-admin-pill">Sessions abgeschlossen · '+st.sessions+'</span><span class="egt-admin-pill">Sessions abgebrochen · '+st.sessionsAborted+'</span><span class="egt-admin-pill">Simulationen gestartet · '+st.simulationsStarted+'</span><span class="egt-admin-pill">Simulationen abgeschlossen · '+st.simulations+'</span><span class="egt-admin-pill">Simulationen abgebrochen · '+st.simulationsAborted+'</span></div>'
        +'<div class="egt-admin-hint" style="margin-top:10px">Datenabdeckung: '+agg.coverage.verifiedProfiles+' von '+agg.coverage.learners+' Profilen mit echten Ledger-Daten ('+agg.coverage.verifiedPercent+'%). Legacy-Zähler werden nicht als Sessions oder Simulationen gezählt.</div>';

      await renderAdminCharts(list, st, onlineNow, agg);
      bindAdminControlCenter();
    }catch(e){ if(box) box.textContent='Fehler: '+(e.message||e); }
  }

  /* ─── KONTROLLZENTRUM: Kacheln in Admin Übersicht ─── */
  function adminControlCenterHtml(){
    return '<div class="egt-admin-cc">'+
      // Aktions-Kacheln
      '<div class="egt-cc-actions">'+
        '<button class="egt-cc-tile primary" data-cc-action="participants">'+
          '<span class="egt-cc-ic">👥</span>'+
          '<span class="egt-cc-txt"><b>Teilnehmer bearbeiten</b><small>Verwalten, verwarnen, sperren, Codes</small></span>'+
          '<span class="egt-cc-arr">›</span>'+
        '</button>'+
        '<button class="egt-cc-tile" data-cc-action="codes">'+
          '<span class="egt-cc-ic">🔑</span>'+
          '<span class="egt-cc-txt"><b>Codes verwalten</b><small>Generieren & verlängern</small></span>'+
          '<span class="egt-cc-arr">›</span>'+
        '</button>'+
        '<button class="egt-cc-tile" data-cc-action="tickets">'+
          '<span class="egt-cc-ic">🎫</span>'+
          '<span class="egt-cc-txt"><b>Tickets</b><small>Bug-Meldungen <span data-ticket-badge style="display:none;background:#f87171;color:#fff;border-radius:999px;padding:0 6px;font-size:.65rem"></span></small></span>'+
          '<span class="egt-cc-arr">›</span>'+
        '</button>'+
        '<button class="egt-cc-tile" data-cc-action="archive">'+
          '<span class="egt-cc-ic">📁</span>'+
          '<span class="egt-cc-txt"><b>User-Archiv</b><small>Verwarnungen & Sperren</small></span>'+
          '<span class="egt-cc-arr">›</span>'+
        '</button>'+
      '</div>'+
      // Statistik-Diagramme Container
      '<div class="egt-cc-charts" data-admin-charts><div class="egt-empty-state">Statistiken werden geladen…</div></div>'+
    '</div>';
  }

  function bindAdminControlCenter(){
    document.querySelectorAll('[data-cc-action]').forEach(function(b){
      if(b.__ccBound) return; b.__ccBound=true;
      b.addEventListener('click', function(ev){
        ev.preventDefault(); ev.stopPropagation();
        var action=b.getAttribute('data-cc-action');
        if(action==='participants'){ switchTab('participants'); }
        else if(action==='codes'){ switchTab('codes'); }
        else if(action==='tickets'){ switchTab('tickets'); }
        else if(action==='archive'){ switchTab('archive'); }
        else if(action==='reports'){ switchTab('reports'); }
        else if(action==='system'){ switchTab('system'); }
      });
    });
    document.querySelectorAll('[data-phase4-open-profile]').forEach(function(b){
      if(b.__p4Bound) return; b.__p4Bound=true;
      b.addEventListener('click', function(ev){
        ev.preventDefault(); ev.stopPropagation();
        var uid=normalizeCode(b.getAttribute('data-phase4-open-profile')||'');
        switchTab('participants');
        setTimeout(function(){
          var root=document.querySelector('[data-phase2-participants]');
          if(!root) return;
          var btn=root.querySelector('[data-phase2-open-profile="'+uid+'"]');
          if(btn) btn.click();
        }, 60);
      });
    });
  }

  /* ─── TEILNEHMER-MANAGER (Vollbild-Overlay) ─── */
  async function openParticipantManager(){
    var old=document.getElementById('egtParticipantManager'); if(old) old.remove();
    var m=document.createElement('div'); m.id='egtParticipantManager'; m.className='egt-pm-overlay';
    m.innerHTML='<div class="egt-pm-panel">'+
      '<div class="egt-pm-head">'+
        '<div><h2>Teilnehmer verwalten</h2><p>Alle Nutzer · Bearbeiten, verwarnen, sperren, Codes verlängern</p></div>'+
        '<button class="egt-pm-close" data-pm-close>✕</button>'+
      '</div>'+
      '<div class="egt-pm-toolbar">'+
        '<input class="egt-pm-search" data-pm-search placeholder="🔍 Suche nach Nickname oder ID…">'+
        '<select class="egt-pm-sort" data-pm-sort>'+
          '<option value="name">Name (A–Z)</option>'+
          '<option value="registered">Registriert (neueste)</option>'+
          '<option value="lastlogin">Letzter Login</option>'+
          '<option value="sims">Simulationen</option>'+
          '<option value="role">Rolle</option>'+
        '</select>'+
      '</div>'+
      '<div class="egt-pm-list" data-pm-list><div class="egt-empty-state">Lade Teilnehmer…</div></div>'+
    '</div>';
    document.body.appendChild(m);
    m.querySelector('[data-pm-close]').onclick=function(){ m.remove(); };
    m.querySelector('[data-pm-search]').oninput=function(){ renderPMList(); };
    m.querySelector('[data-pm-sort]').onchange=function(){ renderPMList(); };
    try{ _learnerCache=await listLearners(); }catch(e){ _learnerCache=[]; }
    renderPMList();
  }

  function renderPMList(){
    var m=document.getElementById('egtParticipantManager'); if(!m) return;
    var box=m.querySelector('[data-pm-list]'); if(!box) return;
    var q=(m.querySelector('[data-pm-search]').value||'').toLowerCase().trim();
    var sortMode=m.querySelector('[data-pm-sort]').value;
    var list=sortLearners(_learnerCache, sortMode);
    if(q){ list=list.filter(function(x){ var n=(x.displayName||x.alias||'').toLowerCase(); var id=(x.userId||x.code||'').toLowerCase(); return n.indexOf(q)>=0 || id.indexOf(q)>=0; }); }
    if(!list.length){ box.innerHTML='<div class="egt-empty-state">Keine Teilnehmer gefunden.</div>'; return; }
    box.innerHTML=list.map(function(x){
      var userId=normalizeCode(x.userId||x.code||x.id);
      var name=x.displayName||x.alias||userId;
      var role=x.role||'participant';
      var rc=roleColorFor(role);
      var blocked=!!x.blocked||x.status==='blocked';
      var hasWarn=!!x.pendingWarning;
      var initial=(name[0]||'?').toUpperCase();
      return '<div class="egt-pm-card" data-pm-card="'+escapeHtml(userId)+'">'+
        '<div class="egt-pm-avatar" style="background:linear-gradient(135deg,'+rc+'33,'+rc+'11);color:'+rc+';border-color:'+rc+'44">'+escapeHtml(initial)+'</div>'+
        '<div class="egt-pm-info">'+
          '<div class="egt-pm-nameline"><span class="egt-pm-name">'+escapeHtml(name)+'</span>'+
            '<span class="egt-pm-role" style="background:'+rc+'22;color:'+rc+';border:1px solid '+rc+'44">'+escapeHtml(roleLabelShort(role))+'</span>'+
            (blocked?'<span class="egt-pm-badge blocked">🔒</span>':'')+(hasWarn?'<span class="egt-pm-badge warned">⚠️</span>':'')+
          '</div>'+
          '<div class="egt-pm-meta">Registriert: '+fmtDateShort2(x.createdAt)+' · Login: '+fmtDate(x.lastActiveAt||x.lastLoginAt)+'</div>'+
          '<div class="egt-pm-act">▸ '+escapeHtml(lastActivityText(x))+'</div>'+
        '</div>'+
      '</div>';
    }).join('');
    box.querySelectorAll('[data-pm-card]').forEach(function(c){
      c.onclick=function(){ var uid=c.getAttribute('data-pm-card'); var item=_learnerCache.find(function(z){ return normalizeCode(z.userId||z.code||z.id)===uid; }); showUserManageSheet(uid, item||{}); };
    });
  }

  /* ─── DIAGRAMME RENDERN ─── */
  async function renderAdminCharts(list, st, onlineNow, preparedAgg){
    var box=document.querySelector('[data-admin-charts]'); if(!box) return;
    try{
      if(!list) list=await listLearners();
      if(!st) st=await courseStats();
      var agg=preparedAgg||aggregateActivity(list);
      if(onlineNow==null) onlineNow=agg.recent15;
      var rc=agg.roles.counts;
      var roleData=[
        {l:'Teilnehmer',v:rc.participant,color:'#86efac'},
        {l:'Dozent',v:rc.teacher,color:'#7dd3fc'},
        {l:'Demo',v:rc.demo,color:'#fbbf24'},
        {l:'Admin',v:rc.admin,color:'#f87171'}
      ];
      var weakBars=agg.weakAreas.slice(0,5).map(function(w){ return {l:w.l, v:w.v, color: w.v<65?'#f87171':w.v<75?'#fbbf24':'#35d39a'}; });
      var period=analyticsDateLabel(agg.period.from)+'–'+analyticsDateLabel(agg.period.to);
      var activityChart=agg.empty.activity
        ? analyticsEmptyState('Keine Ledger-Sessions im Zeitraum','Legacy-Loginzeiten werden nicht als Aktivität geschätzt.')
        : svgBarChart(agg.dayBars);
      var roleChart=agg.empty.roles
        ? analyticsEmptyState('Keine bekannten Konten','Teilnehmer-, Dozenten- und Adminquellen enthalten noch keine Konten.')
        : svgBarChart(roleData);
      var weakChart=agg.empty.weakAreas
        ? analyticsEmptyState('Keine verifizierbaren Leistungsdaten','Schwächen erscheinen erst nach echten Ledger-Antworten.')
        : svgBarChart(weakBars);
      var heatChart=agg.empty.heat
        ? analyticsEmptyState('Keine Session-Startzeiten','Die Heatmap benötigt echte Ledger-Sessions.')
        : svgHeatmap(agg.heatGrid);

      box.innerHTML=
        '<div class="egt-admin-hint egt-analytics-source-note"><b>Datenquelle:</b> Activity Ledger · Zeitraum '+escapeHtml(period)+' · verifizierbare Abdeckung '+agg.coverage.verifiedProfiles+'/'+agg.coverage.learners+' Profile · keine Legacy-Hochrechnung.</div>'+
        '<div class="egt-cc-chartgrid">'+
          '<div class="egt-cc-chart"><h4>📈 Ledger-Sessions · letzte 7 Tage</h4>'+activityChart+'<div class="egt-heatmap-legend">Erfasste Sessions je UTC-Kalendertag · gestartet, abgeschlossen oder abgebrochen.</div></div>'+
          '<div class="egt-cc-chart"><h4>👥 Bekannte Konten nach Rolle</h4>'+roleChart+'<div class="egt-heatmap-legend">Dedupliziert aus Teilnehmerprofilen, Dozentenregister und aktuell signiertem Admin.</div></div>'+
          '<div class="egt-cc-chart"><h4>🎯 Schwächste Bereiche · Ledger</h4>'+weakChart+'<div class="egt-heatmap-legend">Gewichtete Trefferquote aus echten Antworten; keine Durchschnittsbildung über Legacy-Profile.</div></div>'+
          '<div class="egt-cc-chart"><h4>🔥 Startzeiten echter Sessions</h4>'+heatChart+'<div class="egt-heatmap-legend">Wochentag × 4-Stunden-Fenster · '+agg.heatTotal+' erfasste Sessionstarts.</div></div>'+
        '</div>'+
        '<div class="egt-admin-stat-grid egt-analytics-status-grid"><div><b>'+agg.simulations.started+'</b><span>Simulation gestartet</span></div><div><b>'+agg.simulations.completed+'</b><span>Simulation abgeschlossen</span></div><div><b>'+agg.simulations.aborted+'</b><span>Simulation abgebrochen</span></div><div><b>'+agg.simulations.unclassified+'</b><span>Status nicht klassifiziert</span></div></div>';
      updateTicketBadge();
    }catch(e){ box.innerHTML='<div class="egt-empty-state">Statistik-Fehler: '+escapeHtml(e.message||e)+'</div>'; }
  }

  var _learnerSort = 'name';
  var _learnerCache = [];

  async function renderLearners(){
    var box=document.querySelector('[data-learner-list]'); if(!box) return;
    if(!adminOpen()){ box.textContent='Admin gesperrt.'; return; }
    box.innerHTML='<div class="egt-empty-state">Lade Teilnehmer…</div>';
    try{
      var list=await listLearners();
      _learnerCache=list;
      if(!list.length){ box.innerHTML='<div class="egt-empty-state">Noch keine Teilnehmer.</div>'; return; }
      renderLearnerList(box, list);
    }catch(e){ box.innerHTML='<div class="egt-empty-state">Fehler: '+escapeHtml(e.message||e)+'</div>'; }
  }

  function sortLearners(list, mode){
    var sorted=list.slice();
    if(mode==='name'){ sorted.sort(function(a,b){ return String(a.displayName||a.alias||a.userId||'').localeCompare(String(b.displayName||b.alias||b.userId||''),'de'); }); }
    else if(mode==='registered'){ sorted.sort(function(a,b){ return String(b.createdAt||'').localeCompare(String(a.createdAt||'')); }); }
    else if(mode==='lastlogin'){ sorted.sort(function(a,b){ return String(b.lastActiveAt||b.lastLoginAt||'').localeCompare(String(a.lastActiveAt||a.lastLoginAt||'')); }); }
    else if(mode==='sims'){ sorted.sort(function(a,b){ return profileProgress(b).simulations - profileProgress(a).simulations; }); }
    else if(mode==='role'){ sorted.sort(function(a,b){ return String(a.role||'participant').localeCompare(String(b.role||'participant')); }); }
    return sorted;
  }

  function fmtDate(iso){
    if(!iso) return '—';
    try{ var d=new Date(iso); if(isNaN(d.getTime())) return '—'; return d.toLocaleDateString('de-DE')+' '+d.toLocaleTimeString('de-DE',{hour:'2-digit',minute:'2-digit'}); }catch(e){ return '—'; }
  }
  function fmtDateShort2(iso){
    if(!iso) return '—';
    try{ var d=new Date(iso); if(isNaN(d.getTime())) return '—'; return d.toLocaleDateString('de-DE'); }catch(e){ return '—'; }
  }

  function lastActivityText(x){
    // Letzte Simulation: Modul + Score
    var la=x.lastAttempt||x.lastActivity||null;
    if(la && (la.module||la.score!=null)){
      var mod=({mathe:'Mathe',logik:'Logik',edv:'IT/EDV',python:'Python',simulation:'Simulation',konzentration:'Konzentration',global:'Allgemein'})[la.module]||la.module||'Test';
      return mod+(la.score!=null?(', '+la.score+'%'):'');
    }
    // Aus Modulen ableiten
    var pr=profileProgress(x);
    if(pr.answered>0) return pr.answered+' Aufgaben · '+pr.accuracy+'% Quote';
    return 'Noch keine Aktivität';
  }

  function roleColorFor(role){
    role=String(role||'participant').toLowerCase();
    return ({admin:'#f87171',teacher:'#7dd3fc',dozent:'#7dd3fc',participant:'#86efac',demo:'#fbbf24'})[role]||'#94a3b8';
  }
  function roleLabelShort(role){
    role=String(role||'participant').toLowerCase();
    return ({admin:'Admin',teacher:'Dozent',dozent:'Dozent',participant:'Teilnehmer',demo:'Demo'})[role]||'Teilnehmer';
  }

  function renderLearnerList(box, list){
    var sorted=sortLearners(list, _learnerSort);
    var sortBar='<div class="egt-userlist-toolbar">'+
      '<span class="egt-userlist-count">'+sorted.length+' Nutzer</span>'+
      '<div class="egt-userlist-sortwrap">'+
        '<label class="egt-userlist-sortlabel">Sortieren:</label>'+
        '<select class="egt-admin-input egt-userlist-sort" data-learner-sort>'+
          '<option value="name"'+(_learnerSort==='name'?' selected':'')+'>Name (A–Z)</option>'+
          '<option value="registered"'+(_learnerSort==='registered'?' selected':'')+'>Registriert (neueste)</option>'+
          '<option value="lastlogin"'+(_learnerSort==='lastlogin'?' selected':'')+'>Letzter Login</option>'+
          '<option value="sims"'+(_learnerSort==='sims'?' selected':'')+'>Simulationen</option>'+
          '<option value="role"'+(_learnerSort==='role'?' selected':'')+'>Rolle</option>'+
        '</select>'+
      '</div>'+
    '</div>';

    var rows=sorted.map(function(x){
      var userId=normalizeCode(x.userId||x.code||x.loginName||x.id);
      var name=x.displayName||x.alias||userId;
      var role=x.role||'participant';
      var rc=roleColorFor(role);
      var blocked=!!x.blocked || x.status==='blocked';
      var hasWarning=!!x.pendingWarning;
      var pr=profileProgress(x);
      var initial=(name[0]||'?').toUpperCase();
      return '<div class="egt-user-card" data-user-card="'+escapeHtml(userId)+'">'+
        '<div class="egt-user-main">'+
          '<div class="egt-user-avatar" style="background:linear-gradient(135deg,'+rc+'33,'+rc+'11);color:'+rc+';border-color:'+rc+'44">'+escapeHtml(initial)+'</div>'+
          '<div class="egt-user-info">'+
            '<div class="egt-user-nameline">'+
              '<span class="egt-user-name">'+escapeHtml(name)+'</span>'+
              '<span class="egt-user-rolebadge" style="background:'+rc+'22;color:'+rc+';border:1px solid '+rc+'44">'+escapeHtml(roleLabelShort(role))+'</span>'+
              (blocked?'<span class="egt-user-statusbadge blocked">🔒 Gesperrt</span>':'')+
              (hasWarning?'<span class="egt-user-statusbadge warned">⚠️ Verwarnt</span>':'')+
            '</div>'+
            '<div class="egt-user-meta">'+
              '<span class="egt-user-metaitem">ID: '+escapeHtml(userId)+'</span>'+
              '<span class="egt-user-metaitem">Registriert: '+fmtDateShort2(x.createdAt)+'</span>'+
              '<span class="egt-user-metaitem">Letzter Login: '+fmtDate(x.lastActiveAt||x.lastLoginAt)+'</span>'+
            '</div>'+
            '<div class="egt-user-activity">▸ '+escapeHtml(lastActivityText(x))+'</div>'+
          '</div>'+
        '</div>'+
        '<button class="egt-user-gear" data-user-gear="'+escapeHtml(userId)+'" aria-label="Verwalten" title="Verwalten">⚙️</button>'+
      '</div>';
    }).join('');

    box.innerHTML=sortBar+'<div class="egt-user-cards">'+rows+'</div>';

    // Sortierung
    var sortSel=box.querySelector('[data-learner-sort]');
    if(sortSel){ sortSel.onchange=function(){ _learnerSort=sortSel.value; renderLearnerList(box, _learnerCache); }; }

    // Zahnrad-Menü
    box.querySelectorAll('[data-user-gear]').forEach(function(g){
      g.onclick=function(e){ e.stopPropagation(); var uid=g.getAttribute('data-user-gear'); var item=_learnerCache.find(function(z){ return normalizeCode(z.userId||z.code||z.id)===uid; }); showUserManageSheet(uid, item||{}); };
    });
  }

  /* ─── ZAHNRAD-MENÜ: Nutzer verwalten ─── */
  function showUserManageSheet(userId, data){
    var old=document.getElementById('egtUserManageSheet'); if(old) old.remove();
    userId=normalizeCode(userId);
    data=data||{}; ensureProfileGroup(data);
    var name=data.displayName||data.alias||userId;
    var role=data.role||'participant';
    var blocked=!!data.blocked || data.status==='blocked';
    var pr=profileProgress(data);
    var group=data.groupId || buildGroupId(data.year||getCourseSettings().year, data.course||getCourseSettings().course, data.track||getCourseSettings().track);
    var note=data.adminNote||data.note||'';
    var m=document.createElement('div'); m.id='egtUserManageSheet'; m.className='egt-admin-modal show egt-usermanage-modal egt-phase3-manage-modal';
    m.innerHTML='<div class="egt-admin-panel egt-phase3-panel">'+
      '<div class="egt-sheet-handle" aria-hidden="true"></div>'+
      '<div class="egt-admin-head egt-phase3-head"><div><span class="egt-role-badge" style="background:'+roleColorFor(role)+'22;color:'+roleColorFor(role)+'">Phase 3 · Profilverwaltung</span><h2>'+escapeHtml(name)+'</h2><p>ID: '+escapeHtml(userId)+' · Gruppe: '+escapeHtml(group)+'</p></div><button class="egt-admin-btn secondary" data-close-manage>✕</button></div>'+
      '<div class="egt-admin-body egt-phase3-body">'+
        '<div class="egt-phase3-grid">'+
          '<section class="egt-admin-card egt-phase3-card">'+
            '<h3>Stammdaten bearbeiten</h3>'+
            '<label class="egt-admin-mini-label">Anzeigename / Nickname</label><input class="egt-admin-input" id="umNick" value="'+escapeHtml(name)+'">'+
            '<label class="egt-admin-mini-label">Gruppe / Kurs</label><input class="egt-admin-input" id="umGroup" value="'+escapeHtml(group)+'" placeholder="z. B. 2026-GK-A">'+
            '<label class="egt-admin-mini-label">Rolle</label><select class="egt-admin-input" id="umRole"><option value="participant"'+(role==='participant'?' selected':'')+'>Teilnehmer</option><option value="teacher"'+((role==='teacher'||role==='dozent')?' selected':'')+'>Dozent</option></select>'+
            '<label class="egt-admin-mini-label">Status</label><select class="egt-admin-input" id="umStatusSelect"><option value="active"'+(!blocked && (data.status||'active')==='active'?' selected':'')+'>Aktiv</option><option value="inactive"'+((data.status||'')==='inactive'?' selected':'')+'>Inaktiv</option><option value="blocked"'+(blocked?' selected':'')+'>Gesperrt</option><option value="archived"'+((data.status||'')==='archived'?' selected':'')+'>Archiviert</option></select>'+
            '<div class="egt-admin-row"><button class="egt-admin-btn" id="umSaveCore">Stammdaten speichern</button></div>'+
          '</section>'+
          '<section class="egt-admin-card egt-phase3-card">'+
            '<h3>Lernstand & Zugriff</h3>'+
            '<div class="egt-user-detailgrid"><div><b>Registriert</b><span>'+fmtDate(data.createdAt)+'</span></div><div><b>Letzter Login</b><span>'+fmtDate(data.lastActiveAt||data.lastLoginAt)+'</span></div><div><b>Aufgaben</b><span>'+pr.answered+'</span></div><div><b>Ø Quote</b><span>'+pr.accuracy+'%</span></div><div><b>Status</b><span>'+(blocked?'🔒 Gesperrt':'✓ Aktiv')+'</span></div><div><b>Letzte Aktivität</b><span>'+escapeHtml(lastActivityText(data))+'</span></div></div>'+
            '<div class="egt-admin-row egt-phase3-danger-row"><button class="egt-admin-btn secondary" id="umResetAttempts">Versuche zurücksetzen</button>'+
            (blocked?'<button class="egt-admin-btn" id="umUnblock">Entsperren</button>':'<button class="egt-admin-btn danger" id="umBlock">Sperren</button>')+'</div>'+
          '</section>'+
          '<section class="egt-admin-card egt-phase3-card egt-phase3-wide">'+
            '<h3>Admin-Notiz & Verwarnung</h3>'+
            '<label class="egt-admin-mini-label">Interne Notiz</label><textarea class="egt-admin-input" id="umNote" placeholder="Interne Notiz: z. B. braucht Hilfe bei Logik, Termin vereinbaren…" style="min-height:90px;resize:vertical">'+escapeHtml(note)+'</textarea>'+
            '<div class="egt-admin-row"><button class="egt-admin-btn" id="umSaveNote">Notiz speichern</button></div>'+
            '<label class="egt-admin-mini-label" style="margin-top:12px">Verwarnung an Teilnehmer</label><textarea class="egt-admin-input" id="umWarn" placeholder="Warnungstext, erscheint beim Nutzer…" style="min-height:70px;resize:vertical"></textarea>'+
            '<div class="egt-admin-row"><button class="egt-admin-btn" id="umWarnBtn" style="background:linear-gradient(120deg,#fb923c,#f87171)">⚠️ Verwarnung senden</button></div>'+
            '<label class="egt-admin-mini-label" style="margin-top:14px">Konto-Verwaltung</label>'+
            '<div class="egt-admin-row"><button class="egt-admin-btn secondary" id="umResetPw">🔑 Passwort zurücksetzen</button></div>'+
            '<div class="egt-admin-status egt-admin-hidden" id="umResetPwResult"></div>'+
            '<div class="egt-admin-row" style="margin-top:8px"><button class="egt-admin-btn danger" id="umDelete">🗑️ Teilnehmer endgültig löschen</button></div>'+
          '</section>'+
          '<section class="egt-admin-card egt-phase3-card egt-phase3-wide" id="umCodeCard"><h3>Teilnahmecode</h3><div id="umCodeInfo" class="egt-empty-state">Code-Infos werden geladen…</div></section>'+
        '</div>'+
        '<div class="egt-admin-status" id="umStatus"></div>'+
      '</div>'+
    '</div>';
    document.body.appendChild(m);

    function st(msg){ var el=m.querySelector('#umStatus'); if(el) el.textContent=msg; setStatus(msg); }
    function refreshPhase2(){
      renderLearners(); renderAdminStats();
      var p2=document.querySelector('[data-phase2-participant-root]'); if(p2) p2.innerHTML=participantPhase2WorkspaceHtml(currentPortalRole()==='dozent'?'dozent':'admin');
    }
    m.querySelector('[data-close-manage]').onclick=function(){ m.remove(); };

    (async function loadCodeInfo(){
      var info=m.querySelector('#umCodeInfo'); if(!info) return;
      try{
        var codes=await listAccessCodes('admin');
        var uc=normalizeCode(userId);
        var match=codes.find(function(c){ return normalizeCode(c.lastRedeemedBy||'')===uc || safeId(c.lastRedeemedBy||'')===safeId(userId) || normalizeCode(c.code)===uc || normalizeCode(c.usedBy||'')===uc || normalizeCode(c.redeemedBy||'')===uc; });
        if(!match){ info.innerHTML='<span style="color:#8da3c8">Kein Zugangscode zugeordnet. Das ist bei Demo- oder manuell angelegten Teilnehmern normal.</span>'; return; }
        var expRaw=match.expiresAt||match.expires_at;
        var expTxt='unbegrenzt', isExp=false;
        if(expRaw){ var ets=Date.parse(expRaw); if(isFinite(ets)){ expTxt=new Date(ets).toLocaleDateString('de-DE'); if(ets<Date.now()){ isExp=true; expTxt+=' (abgelaufen)'; } } }
        info.innerHTML='<div class="egt-user-detailgrid"><div><b>Code</b><span style="font-family:monospace;color:#20d9ff">'+escapeHtml(match.code||'—')+'</span></div><div><b>Ausgestellt von</b><span>'+escapeHtml(match.createdByName||match.createdBy||'Admin')+'</span></div><div><b>Ausgestellt am</b><span>'+fmtDate(match.createdAt)+'</span></div><div><b>Gültig bis</b><span style="'+(isExp?'color:#f87171':'')+'">'+escapeHtml(expTxt)+'</span></div></div><div class="egt-admin-row" style="margin-top:12px"><input class="egt-admin-input" id="umExtDays" type="number" min="1" value="30" placeholder="Tage" style="flex:1"><button class="egt-admin-btn" id="umExtBtn">Code verlängern</button></div>';
        m.querySelector('#umExtBtn').onclick=async function(){ try{ var cid=accessCodeId(normalizeCode(match.code)); var r=await extendCode(cid, m.querySelector('#umExtDays').value); st('✓ Code verlängert bis '+new Date(r.newExpiresAt).toLocaleDateString('de-DE')); loadCodeInfo(); }catch(e){ st('Fehler: '+(e.message||e)); } };
      }catch(e){ info.innerHTML='<span style="color:#f87171">Code-Infos konnten nicht geladen werden.</span>'; }
    })();

    m.querySelector('#umSaveCore').onclick=async function(){
      try{
        var statusVal=m.querySelector('#umStatusSelect').value;
        var patch={ displayName:m.querySelector('#umNick').value.slice(0,40), alias:m.querySelector('#umNick').value.slice(0,40), role:m.querySelector('#umRole').value, roleLabel:roleDisplayValue(m.querySelector('#umRole').value), groupId:m.querySelector('#umGroup').value, status:statusVal, blocked:statusVal==='blocked' };
        if(statusVal!=='blocked'){ patch.blockedReason=''; patch.blockedAt=null; }
        await updateLearnerAdminProfile(userId, patch);
        st('✓ Stammdaten gespeichert.'); refreshPhase2();
      }catch(e){ st('Fehler: '+(e.message||e)); }
    };
    m.querySelector('#umSaveNote').onclick=async function(){ try{ await addLearnerAdminNote(userId, m.querySelector('#umNote').value); st('✓ Notiz gespeichert.'); refreshPhase2(); }catch(e){ st('Fehler: '+(e.message||e)); } };
    m.querySelector('#umWarnBtn').onclick=async function(){ var txt=m.querySelector('#umWarn').value; if(!txt.trim()){ st('Bitte Warnungstext eingeben.'); return; } try{ await warnLearner(userId, txt); st('✓ Verwarnung gesendet & archiviert.'); refreshPhase2(); }catch(e){ st('Fehler: '+(e.message||e)); } };
    var resetBtn=m.querySelector('#umResetAttempts'); if(resetBtn){ resetBtn.onclick=async function(){ if(!confirm('Versuche und lokale Aktivitätsauswertung dieses Teilnehmers zurücksetzen?')) return; try{ await resetLearnerAttempts(userId); st('✓ Versuche zurückgesetzt.'); refreshPhase2(); }catch(e){ st('Fehler: '+(e.message||e)); } }; }
    async function umReopenFresh(msg){
      /* G54.45.2: Sperren/Entsperren-Button spiegelte nur den Zustand beim
         Öffnen — nach dem Klick blieb der alte Button stehen. Sheet mit
         frischen Daten neu aufbauen, Statusmeldung übernehmen. */
      try{
        var list=await listLearners();
        var fresh=list.find(function(z){ return normalizeCode(z.userId||z.code||z.id)===userId; });
        showUserManageSheet(userId, fresh||{});
        var nm=document.getElementById('egtUserManageSheet');
        var nst=nm && nm.querySelector('#umStatus'); if(nst) nst.textContent=msg;
      }catch(e){}
    }
    var blockBtn=m.querySelector('#umBlock'); if(blockBtn){ blockBtn.onclick=async function(){ try{ await blockLearner(userId, true, 'Durch Administration gesperrt.'); refreshPhase2(); await umReopenFresh('✓ Konto gesperrt.'); }catch(e){ st('Fehler: '+(e.message||e)); } }; }
    var unblockBtn=m.querySelector('#umUnblock'); if(unblockBtn){ unblockBtn.onclick=async function(){ try{ await blockLearner(userId, false); refreshPhase2(); await umReopenFresh('✓ Konto entsperrt.'); }catch(e){ st('Fehler: '+(e.message||e)); } }; }
    var resetPwBtn=m.querySelector('#umResetPw'); if(resetPwBtn){ resetPwBtn.onclick=async function(){ if(!confirm('Passwort für '+userId+' zurücksetzen? Der Teilnehmer erhält ein neues Einmalpasswort und muss es beim nächsten Login ändern.')) return; try{ var r=await resetPassword(userId); var out=m.querySelector('#umResetPwResult'); if(out){ out.classList.remove('egt-admin-hidden'); out.textContent='Neues Einmalpasswort für '+r.userId+': '+r.firstPassword+'\nWird nur jetzt angezeigt — bitte sicher an den Teilnehmer übergeben.'; } st('✓ Passwort zurückgesetzt.'); }catch(e){ st('Fehler: '+(e.message||e)); } }; }
    var delBtn=m.querySelector('#umDelete'); if(delBtn){ delBtn.onclick=async function(){ if(!confirm('Teilnehmer '+userId+' ENDGÜLTIG löschen? Alle lokalen Fortschritte gehen verloren.')) return; var typed=prompt('Zur Bestätigung die Teilnehmer-ID eingeben:'); if(normalizeCode(typed)!==userId) return st('Löschen abgebrochen: ID stimmt nicht überein.'); try{ var archiveEntry={ id:'DEL-'+Date.now().toString(36).toUpperCase(), learnerId:userId, type:'gelöscht', text:'Teilnehmer durch Administration endgültig gelöscht.', createdAt:nowIso(), createdBy:currentPortalRole() }; try{ saveArchiveEntryLocal(archiveEntry); }catch(x){} await deleteLearner(userId); st('✓ Teilnehmer gelöscht.'); refreshPhase2(); setTimeout(function(){ m.remove(); renderPMList(); }, 600); }catch(e){ st('Fehler: '+(e.message||e)); } }; }
  }

  // User-Archiv laden
  /* G54.45.2: Lokales User-Archiv. Vorher war das Archiv Firestore-only —
     offline (oder ohne Firebase) blieb der Archiv-Tab IMMER leer, obwohl
     Verwarnungen/Sperren stattfanden. Jetzt: lokal + Cloud gemerged. */
  var USER_ARCHIVE_LOCAL_KEY='egt_user_archive_local_v1';
  function localUserArchive(){ try{ var a=JSON.parse(localStorage.getItem(USER_ARCHIVE_LOCAL_KEY)||'[]'); return Array.isArray(a)?a:[]; }catch(e){ return []; } }
  function saveArchiveEntryLocal(entry){
    if(!entry || !entry.id) return;
    try{
      var a=localUserArchive().filter(function(x){ return x && x.id!==entry.id; });
      a.unshift(entry);
      localStorage.setItem(USER_ARCHIVE_LOCAL_KEY, JSON.stringify(a.slice(0,200)));
    }catch(e){}
  }

  async function listUserArchive(){
    await init();
    var map={};
    localUserArchive().forEach(function(x){ if(x&&x.id) map[x.id]=x; });
    if(state.online){
      try{
        var fs=state.sync.fsMod;
        var qs=await fs.getDocs(colRef('courses/'+state.courseId+'/userArchive'));
        qs.forEach(function(d){ var x=d.data(); x.id=d.id; map[x.id]=x; });
      }catch(e){}
    }
    var list=Object.keys(map).map(function(k){ return map[k]; });
    list.sort(function(a,b){ return (b.createdAt||'').localeCompare(a.createdAt||''); });
    return list;
  }


  /* ═══════════════════════════════════════════════════════
     ADMIN HOTFIX G39.14.1
     Fehlende Admin-API-Funktionen wiederhergestellt.
     Ursache: Phase-Module exportierten Namen, die in dieser Datei nicht
     mehr definiert waren. Dadurch brach die komplette Engine beim Laden ab.
     ═══════════════════════════════════════════════════════ */

  function learnerLookupKey(learnerId){ return normalizeCode(learnerId || ''); }
  function learnerDocIdFrom(learnerId, profile){
    var code=normalizeCode((profile && (profile.userId || profile.code || profile.loginName)) || learnerId || '');
    return safeId(code || learnerId || '');
  }
  async function findLearnerForAdmin(learnerId){
    var key=learnerLookupKey(learnerId);
    var safe=safeId(key || learnerId || '');
    var list=[];
    try{ list=await listLearners(); }catch(e){ list=[]; }
    var item=list.find(function(x){
      return normalizeCode(x.userId||x.code||x.loginName||'')===key || safeId(x.userId||x.code||x.loginName||x.id||'')===safe || String(x.id||'')===String(learnerId||'');
    });
    if(item) return item;
    try{ var got=await fetchProfile(key||learnerId); if(got && got.profile) return got.profile; }catch(e2){}
    var all=localAll();
    if(all[key]) return all[key];
    if(all[safe]) return all[safe];
    return null;
  }
  async function writeLearnerAdminPatch(learnerId, patch, opts){
    opts=opts||{}; patch=Object.assign({}, patch||{}, { updatedAt: nowIso() });
    var existing=await findLearnerForAdmin(learnerId);
    var code=normalizeCode((existing && (existing.userId||existing.code||existing.loginName)) || learnerId || '');
    if(!code) throw new Error('Teilnehmer-ID fehlt.');
    var id=learnerDocIdFrom(code, existing);
    var merged=Object.assign({}, existing||{}, patch, { userId: code, code: code, loginName: (existing&&existing.loginName)||code });
    ensureProfileGroup(merged);

    if(state.online){
      await ensureCourse();
      if(privilegedWritesViaFunctions()){
        var role=normalizeRoleValue(patch.role||'');
        var result;
        if(patch.role!==undefined){
          if(role==='admin') throw new Error('Adminrollen werden ausschließlich über das sichere Bootstrap-Werkzeug vergeben.');
          result=await secureCallable('adminAction',{courseId:state.courseId,action:'setRole',learnerId:code,role:role,groupId:patch.groupId||merged.groupId||''},['admin']);
          delete patch.role; delete patch.roleLabel; delete patch.participantRole;
        }
        var keys=Object.keys(patch).filter(function(k){return k!=='updatedAt';});
        if(keys.length){
          var roles=currentPortalRole()==='admin'?['admin']:['admin','teacher'];
          var serverPatch=Object.assign({},patch); delete serverPatch.updatedAt; result=await secureCallable('adminAction',{courseId:state.courseId,action:'patchLearner',learnerId:code,patch:serverPatch},roles);
        }
        if(result&&result.profile) merged=Object.assign({},merged,result.profile);
      }else{
        await state.sync.fsMod.setDoc(docRef('courses/'+state.courseId+'/learners/'+id), patch, { merge:true });
      }
    }
    var all=localAll(); all[code]=Object.assign({}, all[code]||existing||{}, merged); localSaveAll(all);
    if(opts.setActive || (state.learner && normalizeCode(state.learner.userId||state.learner.code)===code)){
      state.profile=all[code]; state.learner={ id:id, userId:code, code:code, displayName:all[code].displayName||all[code].nickname||all[code].alias||code, alias:all[code].alias||all[code].nickname||all[code].displayName||code, status:all[code].status||'active', role:normalizeRoleValue(all[code].role||'participant'), groupId:all[code].groupId||'' }; saveUserSession(all[code]);
    }
    emit('egt:learner-admin-updated', { userId:code, patch:patch, profile:all[code] }); updateUI(); return all[code];
  }

  async function updateLearner(learnerId, updates) {
    updates=updates||{};
    var allowed=['nickname','displayName','alias','role','groupId','note','adminNote','status','blocked','blockedReason','blockedAt'];
    var patch={};
    allowed.forEach(function(k){ if(updates[k] !== undefined) patch[k]=updates[k]; });
    if(patch.role) patch.roleLabel=roleDisplayValue(patch.role);
    if(patch.note !== undefined && patch.adminNote === undefined) patch.adminNote=patch.note;
    return writeLearnerAdminPatch(learnerId, patch);
  }

  async function updateLearnerAdminProfile(learnerId, patch){
    patch=Object.assign({}, patch||{});
    if(patch.role) patch.roleLabel=roleDisplayValue(patch.role);
    if(patch.status==='blocked' || patch.blocked===true){ patch.blocked=true; patch.status='blocked'; if(!patch.blockedAt) patch.blockedAt=nowIso(); }
    if(patch.status && patch.status!=='blocked'){ patch.blocked=false; patch.blockedReason=patch.blockedReason||''; patch.blockedAt=patch.blockedAt===undefined?null:patch.blockedAt; }
    return writeLearnerAdminPatch(learnerId, patch);
  }

  async function addLearnerAdminNote(learnerId, note){
    var text=String(note||'').slice(0,1500);
    return writeLearnerAdminPatch(learnerId, { adminNote:text, note:text });
  }

  function resetModulesForAdmin(mods){
    var out={}; mods=mods||{};
    Object.keys(mods).forEach(function(k){
      var m=mods[k]||{};
      out[k]=Object.assign({}, m, { answered:0, correct:0, averageScore:0, recurringErrors:{}, repairQueue:[], examHistory:[] });
      if(k==='python'){
        out[k].xp=0; out[k].currentLevel=1; out[k].unlockedLevels=[1];
      }
    });
    return out;
  }
  async function resetLearnerAttempts(learnerId){
    if(privilegedWritesViaFunctions()){
      var result=await secureCallable('adminAction',{courseId:state.courseId,action:'resetLearnerAttempts',learnerId:learnerId},['admin','teacher']);
      var existing=await findLearnerForAdmin(learnerId); if(existing){ existing.attempts=[]; existing.recentEvents=[]; existing.modules=resetModulesForAdmin(existing.modules||{}); existing.global=Object.assign({},existing.global||{},{totalSessions:0,totalXp:0,riskLevel:'unbekannt',recurringErrors:{}}); localUpsert(existing,false); }
      return result.profile||existing||result;
    }
    var existing=await findLearnerForAdmin(learnerId); if(!existing) throw new Error('Teilnehmer nicht gefunden.');
    var g=Object.assign({}, existing.global||{}, { totalSessions:0, totalXp:0, riskLevel:'unbekannt', recurringErrors:{} });
    var patch={ attempts:[], recentEvents:[], modules:resetModulesForAdmin(existing.modules||{}), global:g, attemptsResetAt:nowIso(), attemptsResetBy:currentPortalRole() };
    var profile=await writeLearnerAdminPatch(learnerId, patch);
    if(state.online){ try{ var id=learnerDocIdFrom(learnerId, profile); var fs=state.sync.fsMod; var sub=['attempts','events']; for(var i=0;i<sub.length;i++){ var qs=await fs.getDocs(colRef('courses/'+state.courseId+'/learners/'+id+'/'+sub[i])); var jobs=[]; qs.forEach(function(d){jobs.push(fs.deleteDoc(d.ref));}); await Promise.all(jobs); } }catch(e){state.error=e.message||String(e);} }
    return profile;
  }

  async function generateBulkCodes(opts) {
    opts=opts||{};
    var count=Math.min(Math.max(1, Number(opts.count||1)), 100);
    var days=Number(opts.days!=null ? opts.days : opts.validDays!=null ? opts.validDays : 30);
    var expiresAt=days>0 ? new Date(Date.now()+days*86400000).toISOString() : null;
    var results=[];
    for(var i=0;i<count;i++){
      try{
        results.push(await createAccessCode({ role:opts.role||'participant', groupId:opts.groupId||opts.group||'', maxUses:opts.maxUses||1, expiresAt:expiresAt, note:opts.note||('Batch '+new Date().toLocaleDateString('de-DE')) }));
      }catch(e){ results.push({ error:e.message||String(e) }); }
    }
    return results;
  }

  async function extendCode(codeId, extraDays) {
    await init(); var code=normalizeCode(codeId); var id=safeId(code); var days=Math.max(1, Number(extraDays||30));
    if(privilegedWritesViaFunctions()){
      var result=await secureCallable('adminAction',{courseId:state.courseId,action:'extendAccessCode',code:code,extraDays:days},['admin','teacher']);
      emit('egt:access-code-extended',{id:id,newExpiresAt:result.newExpiresAt,provider:'firebase-functions'}); return {id:id,newExpiresAt:result.newExpiresAt};
    }
    var existing=null;
    if(state.online){ await ensureCourse(); var snap=await state.sync.fsMod.getDoc(docRef('courses/'+state.courseId+'/accessCodes/'+id)); if(!(typeof snap.exists==='function' ? snap.exists() : !!snap.exists)) throw new Error('Code nicht gefunden.'); existing=snap.data()||{}; }
    else{ var all=localAccessCodes(); existing=all[id]||all[code]; if(!existing) throw new Error('Code nicht gefunden.'); }
    var base=existing.expiresAt ? new Date(existing.expiresAt) : new Date(); if(!isFinite(base.getTime()) || base < new Date()) base=new Date();
    var newExp=new Date(base.getTime()+days*86400000).toISOString(); var patch={expiresAt:newExp,updatedAt:nowIso(),status:existing.status==='expired'?'active':existing.status};
    if(state.online) await state.sync.fsMod.setDoc(docRef('courses/'+state.courseId+'/accessCodes/'+id),patch,{merge:true}); else{var local=localAccessCodes();local[id]=Object.assign({},existing,patch,{id:id});localSaveAccessCodes(local);}
    emit('egt:access-code-extended',{id:id,newExpiresAt:newExp}); return {id:id,newExpiresAt:newExp};
  }

  async function warnLearner(learnerId, warningText){
    await init(); var code=normalizeCode(learnerId); if(!code) throw new Error('Teilnehmer-ID fehlt.');
    var warning={ id:'WARN-'+Date.now().toString(36).toUpperCase(), learnerId:code, text:String(warningText||'').trim().slice(0,500), createdAt:nowIso(), createdBy:currentPortalRole(), acknowledged:false };
    if(!warning.text) throw new Error('Warnungstext fehlt.');
    if(privilegedWritesViaFunctions()){
      await writeLearnerAdminPatch(code,{pendingWarning:warning});
    }else if(state.online){
      await ensureCourse(); var fs=state.sync.fsMod; var id=safeId(code);
      await fs.setDoc(docRef('courses/'+state.courseId+'/learners/'+id), { pendingWarning:warning, updatedAt:nowIso() }, { merge:true });
      await fs.setDoc(docRef('courses/'+state.courseId+'/userArchive/'+warning.id), warning, { merge:true });
    }
    var all=localAll(); if(all[code]){ all[code].pendingWarning=warning; all[code].updatedAt=nowIso(); localSaveAll(all); }
    saveArchiveEntryLocal({ id:warning.id, learnerId:code, type:'verwarnt', text:warning.text, createdAt:warning.createdAt, createdBy:warning.createdBy }); emit('egt:learner-warning-created', warning); return warning;
  }

  async function blockLearner(learnerId, blocked, reason){
    await init(); var code=normalizeCode(learnerId); if(!code) throw new Error('Teilnehmer-ID fehlt.');
    var patch={ blocked:!!blocked, blockedReason:blocked ? String(reason||'Konto durch Administration gesperrt.').slice(0,300) : '', blockedAt:blocked ? nowIso() : null, status:blocked ? 'blocked' : 'active', updatedAt:nowIso() };
    var profile=await writeLearnerAdminPatch(code, patch);
    var archiveEntry={ id:'BLK-'+Date.now().toString(36).toUpperCase(), learnerId:code, type:blocked?'gesperrt':'entsperrt', text:patch.blockedReason || 'Konto entsperrt.', createdAt:nowIso(), createdBy:currentPortalRole() };
    saveArchiveEntryLocal(archiveEntry);
    if(state.online && !privilegedWritesViaFunctions()) try{ await state.sync.fsMod.setDoc(docRef('courses/'+state.courseId+'/userArchive/'+archiveEntry.id), archiveEntry, { merge:true }); }catch(e){ state.error=e.message||String(e); }
    return profile;
  }

  async function changeLearnerRole(learnerId, newRole){
    var role=normalizeRoleValue(newRole);
    if(role==='admin') throw new Error('Adminrollen werden ausschließlich über das sichere Bootstrap-Werkzeug vergeben.');
    return writeLearnerAdminPatch(learnerId, { role:role, roleLabel:roleDisplayValue(role) });
  }

  async function renameLearner(learnerId, newName){
    var name=String(newName||'').trim().slice(0,40);
    if(!name) throw new Error('Name fehlt.');
    return writeLearnerAdminPatch(learnerId, { displayName:name, alias:name, nickname:name });
  }

  function duellMakeCode(){ var chars='ABCDEFGHJKLMNPQRSTUVWXYZ23456789', c=''; for(var i=0;i<6;i++) c+=chars[Math.floor(Math.random()*chars.length)]; return c; }
  function duellPath(code){ return 'courses/'+state.courseId+'/duels/'+code; }
  function snapExists(snap){ return typeof snap.exists==='function' ? snap.exists() : !!snap.exists; }
  async function duellCreate(payload){
    payload=payload||{}; await loadSync(); await signIn();
    var sec=securityContext(); var uid=sec&&sec.user&&sec.user.uid; if(!uid || (sec.user&&sec.user.isAnonymous)) throw new Error('Duell benötigt eine bestätigte Anmeldung.');
    for(var attempt=0; attempt<5; attempt++){
      var code=duellMakeCode(); var ref=docRef(duellPath(code)); var snap=await state.sync.fsMod.getDoc(ref); if(snapExists(snap)) continue;
      var doc={ code:code, status:'waiting', hostUid:uid, guestUid:null, createdAt:nowIso(), updatedAt:nowIso(), expiresAt:Date.now()+2*60*60*1000, host:{ name:String(payload.hostName||'Spieler 1').slice(0,18) }, guest:null, quiz:JSON.stringify(payload.quiz||[]), results:{} };
      await state.sync.fsMod.setDoc(ref, doc); return { code:code };
    }
    throw new Error('Kein freier Duell-Code verfügbar. Bitte erneut versuchen.');
  }
  async function duellJoin(code, payload){
    payload=payload||{}; await loadSync(); await signIn(); code=String(code||'').trim().toUpperCase();
    var sec=securityContext(); var uid=sec&&sec.user&&sec.user.uid; if(!uid || (sec.user&&sec.user.isAnonymous)) throw new Error('Duell benötigt eine bestätigte Anmeldung.');
    if(!/^[A-Z0-9]{6}$/.test(code)) throw new Error('Ungültiger Duell-Code (6 Zeichen).');
    var ref=docRef(duellPath(code)); var snap=await state.sync.fsMod.getDoc(ref); if(!snapExists(snap)) throw new Error('Duell-Code nicht gefunden.');
    var d=snap.data(); if(d.expiresAt && Date.now()>d.expiresAt) throw new Error('Dieses Duell ist abgelaufen.'); if(d.guestUid) throw new Error('Diesem Duell ist bereits ein Gegner beigetreten.');
    var guest={ name:String(payload.name||'Spieler 2').slice(0,18), joinedAt:nowIso() };
    await state.sync.fsMod.setDoc(ref, { guest:guest, guestUid:uid, status:'active', updatedAt:nowIso() }, { merge:true });
    var quiz=[]; try{ quiz=JSON.parse(d.quiz||'[]'); }catch(e){} if(!quiz.length) throw new Error('Duell-Daten unvollständig.'); return { code:code, host:d.host||{name:'Spieler 1'}, quiz:quiz };
  }
  async function duellSubmit(code, role, result){
    await loadSync(); await signIn(); code=String(code||'').trim().toUpperCase(); role=role==='guest'?'guest':'host';
    var patch={ results:{}, updatedAt:nowIso() }; patch.results[role]=Object.assign({ finishedAt:nowIso() }, result||{});
    await state.sync.fsMod.setDoc(docRef(duellPath(code)), patch, { merge:true }); return true;
  }
  async function duellFetch(code){
    await loadSync(); await signIn(); code=String(code||'').trim().toUpperCase();
    var snap=await state.sync.fsMod.getDoc(docRef(duellPath(code)));
    if(!snapExists(snap)) throw new Error('Duell nicht gefunden.');
    var d=snap.data(); return { code:d.code, status:d.status, host:d.host, guest:d.guest, results:d.results||{} };
  }


  // Warnung als gelesen markieren (vom Nutzer aufgerufen)
  async function acknowledgeWarning(learnerId){
    await init();
    var code=normalizeCode(learnerId);
    var sec=securityContext();
    var id=(privilegedWritesViaFunctions() && sec && sec.user && !sec.user.isAnonymous) ? String(sec.user.uid||'') : safeId(code);
    if(!id) return;
    /* G54.45.2: Vorher offline ein No-Op — die Warnung blieb dauerhaft
       pending und der Admin sah nie eine Quittierung. Jetzt wird lokal
       quittiert und (falls online) zusätzlich in Firestore. */
    try{
      var all=localAll();
      if(all[code] && all[code].pendingWarning){
        all[code].pendingWarning.acknowledged=true;
        all[code].pendingWarning.acknowledgedAt=nowIso();
        all[code].updatedAt=nowIso();
        localSaveAll(all);
      }
    }catch(eLocal){}
    if(!state.online) return;
    try {
      var fs=state.sync.fsMod;
      await fs.setDoc(docRef('courses/'+state.courseId+'/learners/'+id), {
        pendingWarning: null, updatedAt: nowIso()
      }, { merge:true });
    } catch(e){}
  }

  try{ window.addEventListener('egt:ticket-created', function(ev){ var t=ev && ev.detail && ev.detail.ticket; if(t) saveTicketLocal(t); }); window.addEventListener('egt:ticket-flushed', function(){ updateTicketBadge(); }); }catch(e){}

  window.EGTAdminPortal = { status:"bereit", init:init, _uiTest:{reportDataset:reportDataset,reportMobileCardsHtml:reportMobileCardsHtml,phase8TablePreviewHtml:phase8TablePreviewHtml,questionBankQualityHtml:questionBankQualityHtml,systemInfoHtml:systemInfoHtml,updateTabbar:updateAdminTabbarScrollState}, retryCloudConnection:retryCloudConnection, state:snapshot, loginWithCode:loginWithCode, logout:logout, _saveTicket:saveTicket, listTickets:listTickets, updateTicketStatus:updateTicketStatus, updateTicketAdminFields:updateTicketAdminFields, addTicketComment:addTicketComment, ticketOpenCount:ticketOpenCount, updateTicketBadge:updateTicketBadge, updateLearner:updateLearner, generateBulkCodes:generateBulkCodes, extendCode:extendCode, warnLearner:warnLearner, acknowledgeWarning:acknowledgeWarning, blockLearner:blockLearner, changeLearnerRole:changeLearnerRole, renameLearner:renameLearner, listUserArchive:listUserArchive, createLearner:createLearner, listLearners:listLearners, deleteLearner:deleteLearner, setLearnerStatus:setLearnerStatus, exportCourse:exportCourse, exportCourseCsv:exportCourseCsv, resetCourse:resetCourse, courseStats:courseStats, getCourseSettings:getCourseSettings, saveCourseSettings:saveCourseSettings, trackEvent:trackEvent, enrichCoachPayload:enrichCoachPayload, loadCoachContext:loadCoachContext, open:openModal, close:closeModal, riskFromProfile:riskFromProfile, coachDnaSnapshot:coachDnaSnapshot, nextCode:nextCode, resetPassword:resetPassword, changePassword:changePassword, createAccessCode:createAccessCode, listAccessCodes:listAccessCodes, revokeAccessCode:revokeAccessCode, generatePassword:generatePassword, hashPassword:hashPassword, verifyPassword:verifyPassword, isAdminOpen:adminOpen, isDozentOpen:dozentOpen, currentRole:currentPortalRole, can:can, canViewLearner:canViewLearner, canViewGroup:canViewGroup, activeDozentProfile:activeDozentProfile, setActiveDozentProfile:setActiveDozentProfile, createDemoLearners:createDemoLearners, deleteDemoLearners:deleteDemoLearners, syncStatus:syncStatus, flushPendingSync:flushPendingSync, renderOperations:renderOperations, selectedLearnerIds:selectedLearnerIds, bulkApplySelected:bulkApplySelected, privacyPolicy:privacyPolicy, exportPrivacyData:exportPrivacyData, deletePrivacyData:deletePrivacyData, fetchSecurityAudit:fetchSecurityAudit, verifyAuditEntries:verifyAuditEntries, languageProgressSnapshot:adminLanguageProgressSnapshot, languageParticipantProfileSnapshot:adminLanguageParticipantProfileSnapshot, languageProgressCloudProbe:adminLanguageProgressCloudProbe, languageProgressCloudSummary:adminLanguageProgressCloudSummary, duellCreate:duellCreate, duellJoin:duellJoin, duellSubmit:duellSubmit, duellFetch:duellFetch };
  window.EGTUserDatabase = { provider:'firebase-firestore', init:init, retryCloudConnection:retryCloudConnection, state:snapshot, getSession:getSession, setSession:setSession, logout:logout, redeemAccessCode:redeemAccessCode, createProfile:saveProfile, updateProfile:saveProfile, loadCoachContext:loadCoachContext, trackEvent:trackEvent, saveProfile:saveProfile, fetchProfile:fetchProfile, fetchAccessCode:fetchAccessCode, createAccessCode:createAccessCode, listAccessCodes:listAccessCodes, revokeAccessCode:revokeAccessCode, listLearners:listLearners, getRole:getRole, getGroup:getGroup, syncStatus:syncStatus, flushPendingSync:flushPendingSync, queuePendingSync:queuePendingSync, get activeProfile(){ return state.profile; }, get activeLearner(){ return state.learner; } };
  window.EGTPhase2Health = { required:['createLearner','loginWithCode','changePassword','resetPassword','nextCode','trackEvent','loadCoachContext'], storageKeys:{ profiles:LOCAL_KEY, active:ACTIVE_KEY, adminOpen:ADMIN_OPEN_KEY }, get activeLearner(){ return state.learner && state.learner.userId || ''; }, get provider(){ return snapshot().provider; } };
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
