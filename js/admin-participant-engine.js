/* Eignungstest-Trainer · Admin Portal, Teilnehmerverwaltung und Coach-Profil-Engine */
(function(){
  'use strict';

  var INTERNAL_VERSION = 'g34-1-duel-sync-foundation';
  var cfg = window.EGT_SYNC_CONFIG || { enabled:false };
  var LOCAL_KEY = 'egt_global_learner_profiles';
  var LOCAL_ACCESS_CODES_KEY = 'egt_access_code_cache_v1';
  var USERDB_SESSION_KEY = 'egt_userdatabase_session_v1';
  var PENDING_SYNC_KEY = 'egt_userdatabase_pending_sync_v1';
  var LAST_SYNC_FLUSH_KEY = 'egt_userdatabase_last_sync_flush_v1';
  var ACTIVE_KEY = 'egt_active_learner';
  var ADMIN_PIN_KEY = 'egt_admin_pin';
  var ADMIN_OPEN_KEY = 'egt_admin_open';
  var ADMIN_BOOTSTRAP_KEY = 'egt_admin_bootstrap_password';
  var DOZENT_PIN_KEY = 'egt_dozent_pin';
  var DOZENT_OPEN_KEY = 'egt_dozent_open';
  var PORTAL_ROLE_KEY = 'egt_portal_role';
  var DOZENT_PROFILE_KEY = 'egt_active_dozent_profile';
  var DEMO_DOZENT_PIN = 'Dozent12345!';
  var DEMO_DOZENT_PINS = { 'DOZENT-A': 'DozentA123!', 'DOZENT-B': 'DozentB123!' };

  var state = {
    ready:false, online:false, authReady:false, error:'', user:null, learner:null, profile:null,
    sync:null, db:null, auth:null, courseId:(cfg.courseId || 'course_2026_gk'), busy:false
  };

  function nowIso(){ try{return new Date().toISOString();}catch(e){return '';}}
  function isoHoursAgo(hours){ try{ return new Date(Date.now() - Number(hours||0)*3600000).toISOString(); }catch(e){ return nowIso(); } }
  function pad(n,d){ return String(n).padStart(d||3,'0'); }
  function normalizeCode(code){ return String(code||'').toUpperCase().replace(/[^A-Z0-9]+/g,'-').replace(/^-+|-+$/g,''); }
  function safeId(value){ return normalizeCode(value).toLowerCase().replace(/[^a-z0-9]+/g,'_').replace(/^_+|_+$/g,'') || ('id_'+Date.now()); }
  function clone(obj){ try{return JSON.parse(JSON.stringify(obj||{}));}catch(e){return obj||{};} }
  function emit(name, detail){ try{ window.dispatchEvent(new CustomEvent(name,{ detail:detail||{} })); }catch(e){} }
  function config(){ return window.EGT_SYNC_CONFIG || cfg || {}; }
  function escapeHtml(s){ return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];}); }
  function setStatus(msg){ var el=document.querySelector('[data-fb-status]'); if(el) el.textContent=msg||''; }
  function bodySheetLock(on){ try{ document.documentElement.classList.toggle('egt-admin-sheet-open', !!on); document.body.classList.toggle('egt-admin-sheet-open', !!on); }catch(e){} }
  function sheetToTop(){ try{ var p=document.querySelector('#egtAdminModal .egt-admin-panel'); if(p) p.scrollTop=0; }catch(e){} }
  function announcePortalState(text){ setStatus(text); try{ var live=document.querySelector('[data-portal-live]'); if(live) live.textContent=text||''; }catch(e){} }


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
    if(adminOpen()) return 'Angemeldet als Admin · Vollzugriff aktiv';
    if(dozentOpen()) return 'Angemeldet als '+portalDisplayName('dozent')+' · '+groupAccessForRole('dozent').label;
    if(state.profile && state.profile.mustChangePassword) return 'Angemeldet als Teilnehmer · Passwortwechsel erforderlich';
    if(state.online && state.learner) return 'Angemeldet als Teilnehmer · '+(state.learner.displayName || state.learner.code || 'Teilnehmer');
    if(state.online) return 'System bereit · kein Teilnehmer aktiv';
    if(state.error) return 'Lokaler Modus · Daten werden auf diesem Gerät gespeichert';
    return 'System startet…';
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
      coachStyle:{ explanationLevel:'einfach_plus_fachbegriff', tone:'direkt_motivierend', examplesPreferred:true, slangAccepted:true },
      recentEvents:[], attempts:[]
    };
  }

  function localAll(){ try{return JSON.parse(localStorage.getItem(LOCAL_KEY)||'{}')||{};}catch(e){return {};}}
  function localSaveAll(data){ try{localStorage.setItem(LOCAL_KEY, JSON.stringify(data||{}));}catch(e){} }
  function localSetActive(code){ try{localStorage.setItem(ACTIVE_KEY, normalizeCode(code));}catch(e){} }
  function localGetActive(){ try{return localStorage.getItem(ACTIVE_KEY)||'';}catch(e){return '';} }
  function localProfile(code){ var all=localAll(); code=normalizeCode(code); return all[code] || null; }
  function localAccessCodes(){ try{return JSON.parse(localStorage.getItem(LOCAL_ACCESS_CODES_KEY)||'{}')||{};}catch(e){return {};} }
  function localSaveAccessCodes(data){ try{localStorage.setItem(LOCAL_ACCESS_CODES_KEY, JSON.stringify(data||{}));}catch(e){} }

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
    return { provider:state.online?'firebase-firestore':'local-cache', online:state.online, firebaseConfigured:firebaseConfigReady(), ready:state.ready, courseId:state.courseId, pending:pending.length, pendingCount:pending.length, lastFlushAt:last, error:state.error||'' };
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
    var group=normalizeCode(groupId || getCourseSettings().prefix || 'BPS').replace(/-/g,'').slice(0,12) || 'BPS';
    return normalizeCode('BPS-'+rolePrefix+'-'+group+'-'+randomCodeChunk(4)+'-'+randomCodeChunk(3));
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
      createdByName: portalRole==='dozent' && scope.dozent ? scope.dozent.displayName : 'Admin',
      courseId: state.courseId, createdAt: nowIso(), updatedAt: nowIso(), source:'portal-access-code-generator'
    };
  }
  async function createAccessCode(opts){
    var payload=normalizeAccessCodeInput(opts||{});
    await init();
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
      var qs=await state.sync.fsMod.getDocs(colRef('courses/'+state.courseId+'/accessCodes'));
      qs.forEach(function(d){ var x=d.data()||{}; x.id=d.id; if(accessCodeVisibleFor(role,x)) list.push(x); });
    }else{
      var all=localAccessCodes();
      Object.keys(all).forEach(function(k){ var x=all[k]||{}; x.id=x.id||k; if(accessCodeVisibleFor(role,x)) list.push(x); });
    }
    return list.sort(function(a,b){ return String(b.createdAt||'').localeCompare(String(a.createdAt||'')); }).slice(0,80);
  }
  async function revokeAccessCode(code){
    code=normalizeCode(code); if(!code) throw new Error('Zugangscode fehlt.');
    var id=accessCodeId(code); var role=currentPortalRole();
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
    if(!firebaseConfigReady()){
      throw new Error('Firebase-Konfiguration fehlt: apiKey, authDomain, projectId und appId eintragen.');
    }
    if(state.sync && state.db) return state.sync;
    var base=firebaseSdkBase();
    var appMod=await import(base+'firebase-app.js');
    var authMod=await import(base+'firebase-auth.js');
    var fsMod=await import(base+'firebase-firestore.js');
    var appName='egt-userdb';
    var app;
    try{ app=appMod.getApp(appName); }catch(e){ app=appMod.initializeApp(c.firebaseConfig || c.syncConfig, appName); }
    var db=fsMod.getFirestore(app);
    var auth=authMod.getAuth(app);
    state.sync={ appMod:appMod, authMod:authMod, fsMod:fsMod, app:app, db:db, auth:auth, provider:'firebase-firestore' };
    state.db=db; state.auth=auth;
    return state.sync;
  }
  async function signIn(){
    await loadSync();
    var c=config()||{}, authMod=state.sync.authMod;
    if(c.useAnonymousAuth === false){ state.user=state.auth.currentUser || null; return state.user; }
    if(state.auth.currentUser){ state.user=state.auth.currentUser; return state.user; }
    var cred=await authMod.signInAnonymously(state.auth);
    state.user=cred && cred.user || state.auth.currentUser || null;
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
    var fs=state.sync.fsMod;
    await fs.setDoc(docRef('courses/'+state.courseId), {
      courseId:state.courseId,
      title:config().courseTitle || state.courseId,
      provider:'firebase-firestore',
      updatedAt:nowIso(),
      appVersion:window.TRAINER_BUILD_VERSION || ''
    }, {merge:true});
    return state.courseId;
  }

  async function init(){
    if(state.ready) return state;
    state.ready=true;
    state.online=false;
    state.error='Firebase UserDatabase wird geprüft…';
    try{
      await loadSync();
      await signIn();
      state.online=true;
      state.error='Firebase UserDatabase verbunden';
      await ensureCourse().catch(function(e){ state.error='Firebase verbunden · Kurs konnte nicht angelegt werden: '+(e.message||e); });
      await flushPendingSync().catch(function(e){ state.error='Firebase verbunden · Offline-Warteschlange konnte nicht übertragen werden: '+(e.message||e); });
    }catch(e){
      state.online=false;
      state.error=(config().requireRemoteUserDatabase ? 'Firebase UserDatabase erforderlich: ' : 'Firebase nicht verbunden · lokaler Cache aktiv: ')+(e.message||e);
      if(config().requireRemoteUserDatabase) console.warn('[EGT Firebase]', state.error);
    }
    patchCoach(); buildUI(); updateUI();
    var activeLocal=localGetActive();
    if(activeLocal){
      var lp=localProfile(activeLocal);
      if(lp && lp.mustChangePassword!==true){
        state.learner={ id:safeId(activeLocal), userId:activeLocal, code:activeLocal, displayName:lp.displayName||lp.alias||activeLocal, alias:lp.alias||activeLocal, status:lp.status||'active' };
        state.profile=lp;
      }
    }
    emit('egt:sync-ready', { state:snapshot() });
    return state;
  }
  function snapshot(){ var ss=syncStatus(); return { internalState:"bereit", online:state.online, ready:state.ready, error:state.error, provider:state.online?'firebase-firestore':'local-cache', firebaseConfigured:firebaseConfigReady(), courseId:state.courseId, pendingSync:ss.pending, lastSyncFlushAt:ss.lastFlushAt, user:state.user && { uid:state.user.uid, isAnonymous:state.user.isAnonymous }, learner:state.learner, profile:state.profile }; }

  async function fetchProfile(code){
    code=normalizeCode(code); var id=safeId(code);
    if(state.online){
      await ensureCourse(); var fs=state.sync.fsMod;
      var access=await fs.getDoc(docRef('courses/'+state.courseId+'/accessCodes/'+id));
      if(!access.exists()) throw new Error('Zugang nicht gefunden. Bitte Admin kontaktieren.');
      var acc=access.data()||{}; if(acc.status && acc.status !== 'active') throw new Error('Dieser Zugang ist deaktiviert.');
      var learnerId=acc.learnerId || id; var lsnap=await fs.getDoc(docRef('courses/'+state.courseId+'/learners/'+learnerId));
      if(!lsnap.exists()) throw new Error('Teilnehmerprofil fehlt. Bitte Admin kontaktieren.');
      var profile=lsnap.data()||{}; profile.userId=profile.userId||code; profile.code=profile.code||code; profile.loginName=profile.loginName||code; profile.id=learnerId;
      return { id:learnerId, profile:profile };
    }
    var p=localProfile(code); if(!p) throw new Error('Zugang nicht gefunden. Bitte Admin kontaktieren.');
    return { id:safeId(code), profile:p };
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
    var profileId = acc.learnerId || acc.profileId || safeId((state.user&&state.user.uid) || (baseCode+'-'+Date.now()));
    var profile=defaultProfile(nickname, baseCode, { isAnonymous:false, course:acc.course||getCourseSettings().course, year:acc.year||getCourseSettings().year, track:acc.track||getCourseSettings().track, groupId:acc.groupId||acc.group_id||groupLabel('') });
    profile.id=profileId; profile.profileId=profileId;
    profile.nickname=nickname; profile.displayName=nickname; profile.alias=nickname;
    profile.role=role; profile.accessRole=role; profile.roleLabel=roleDisplayValue(role);
    profile.participantRole=role==='participant'?'teilnehmer':role;
    profile.groupId=acc.groupId||acc.group_id||profile.groupId;
    profile.courseId=state.courseId; profile.status='active'; profile.mustChangePassword=false;
    profile.accessCode=normalizeCode(acc.code); profile.accessCodeId=acc.id||accessCodeId(acc.code);
    profile.createdByAccessCode=true; profile.createdVia='access-code'; profile.createdAt=profile.createdAt||nowIso(); profile.updatedAt=nowIso();
    profile.firebaseUid=state.user&&state.user.uid||'';
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
    payload=payload||{}; var code=normalizeCode(payload.code); var nickname=String(payload.nickname||'').trim(); var password=String(payload.password||'');
    if(!code) throw new Error('Bitte Zugangscode eingeben.');
    if(nickname.length < 3) throw new Error('Nickname braucht mindestens 3 Zeichen.');
    if(password && password.length < 8) throw new Error('Das Passwort braucht mindestens 8 Zeichen.');
    await init();
    if(!state.online && config().requireRemoteUserDatabase) throw new Error('Firebase UserDatabase ist erforderlich, aber nicht verbunden.');
    var acc=await fetchAccessCode(code);
    var profile=profileFromAccess(acc, { nickname:nickname });
    return writeRedeemedProfile(profile, acc, password);
  }
  function getSession(){
    if(state.profile) return sessionProfilePayload(state.profile);
    return readUserSession();
  }
  function setSession(profile){ if(profile){ state.profile=profile; state.learner={ id:profile.profileId||profile.id||safeId(profile.userId||profile.code), userId:profile.userId||profile.code, code:profile.code||profile.userId, displayName:profile.nickname||profile.displayName||profile.alias, alias:profile.alias||profile.nickname||profile.displayName, status:profile.status||'active', role:normalizeRoleValue(profile.role||'participant'), groupId:profile.groupId||'' }; saveUserSession(profile); localUpsert(profile, true); emit('egt:learner-login',{ learner:state.learner, profile:profile }); } return getSession(); }
  function getRole(){ return normalizeRoleValue((state.profile&&state.profile.role) || (readUserSession()&&readUserSession().role) || 'guest'); }
  function getGroup(){ return (state.profile&&state.profile.groupId) || (readUserSession()&&readUserSession().groupId) || ''; }
  async function saveProfile(profile, setActive){
    var code=normalizeCode(profile.userId || profile.code || profile.loginName); var id=safeId(code);
    profile.userId=code; profile.code=code; profile.loginName=profile.loginName||code; ensureProfileGroup(profile); profile.updatedAt=nowIso();
    if(state.online){
      await ensureCourse(); var fs=state.sync.fsMod;
      await fs.setDoc(docRef('courses/'+state.courseId+'/learners/'+id), profile, {merge:true});
      await fs.setDoc(docRef('courses/'+state.courseId+'/accessCodes/'+id), { learnerId:id, code:code, loginName:code, status:profile.status||'active', updatedAt:nowIso() }, {merge:true});
    }
    return localUpsert(profile, setActive);
  }

  async function createLearner(opts){
    opts = typeof opts === 'string' ? { code:opts } : (opts||{});
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
    var all=localAll(), removed=[];
    Object.keys(all).forEach(function(k){ var p=all[k]||{}; if(p.createdBy==='demo-admin-portal' || p.isDemo===true){ removed.push(normalizeCode(p.userId||p.code||k)); delete all[k]; } });
    localSaveAll(all);
    if(state.learner && removed.indexOf(normalizeCode(state.learner.userId||state.learner.code))>=0) logout();
    updateUI(); emit('egt:demo-learners-deleted',{ removed:removed });
    return { removed:removed };
  }


  function demoDozentProfiles(){
    var cs=getCourseSettings();
    return [
      { dozentId:'DOZENT-A', displayName:'Demo Dozent A', assignedGroups:[buildGroupId(cs.year, cs.course, 'A')], badge:'Gruppe A' },
      { dozentId:'DOZENT-B', displayName:'Demo Dozent B', assignedGroups:[buildGroupId(cs.year, cs.course, 'B')], badge:'Gruppe B' }
    ];
  }
  function activeDozentProfile(){
    try{ var raw=sessionStorage.getItem(DOZENT_PROFILE_KEY); if(raw){ var p=JSON.parse(raw); if(p && p.dozentId) return p; } }catch(e){}
    var list=demoDozentProfiles();
    return dozentOpen() ? list[0] : null;
  }
  function setActiveDozentProfile(id){
    var list=demoDozentProfiles();
    var found=list.find(function(x){ return String(x.dozentId).toUpperCase()===String(id||'').toUpperCase(); }) || list[0];
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
      await ensureCourse(); var fs=state.sync.fsMod; var qs=await fs.getDocs(colRef('courses/'+state.courseId+'/learners'));
      var list=[]; qs.forEach(function(d){ var x=d.data()||{}; x.id=d.id; x.userId=x.userId||x.code||d.id; list.push(x); });
      return list.sort(function(a,b){ return String(a.userId||a.code).localeCompare(String(b.userId||b.code)); });
    }
    var all=localAll(); return Object.keys(all).map(function(k){ var x=all[k]; x.id=safeId(k); x.userId=x.userId||k; return x; }).sort(function(a,b){return String(a.userId).localeCompare(String(b.userId));});
  }

  function computeNextCodeFromList(list){
    var cs=getCourseSettings(); var prefix=cs.prefix; var digits=Number(cs.digits||3);
    var used={}; (list||[]).forEach(function(x){ used[normalizeCode(x.userId||x.code||x.loginName||x.id)]=true; });
    var i=1, code=''; do{ code=normalizeCode(prefix + pad(i,digits)); i++; } while(used[code] && i<100000);
    return code;
  }
  async function nextCode(){ return computeNextCodeFromList(await listLearners().catch(function(){return Object.keys(localAll()).map(function(k){return {userId:k};});})); }

  async function loginWithCode(code, password, opts){
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
    var got=await fetchProfile(code); var profile=got.profile; var salt=randomBytes(16); var hash=await hashPassword(newPassword, salt);
    profile.passwordSalt=salt; profile.passwordHash=hash; profile.mustChangePassword=false; profile.passwordChangedAt=nowIso();
    await saveProfile(profile, true); state.profile=profile; state.learner={ id:got.id, userId:code, code:code, displayName:profile.displayName||profile.alias||code, alias:profile.alias||profile.displayName||code, status:profile.status||'active' };
    updateUI(); emit('egt:password-changed',{userId:code}); setStatus('Passwort geändert. Du bist angemeldet.');
    return profile;
  }

  async function resetPassword(userId){
    userId=normalizeCode(userId); if(!userId) throw new Error('Teilnehmer-ID fehlt.');
    var got=await fetchProfile(userId); var profile=got.profile; var pw=generatePassword(); var salt=randomBytes(16); var hash=await hashPassword(pw, salt);
    profile.passwordSalt=salt; profile.passwordHash=hash; profile.mustChangePassword=true; profile.passwordResetAt=nowIso();
    await saveProfile(profile, false); emit('egt:password-reset',{userId:userId}); return { userId:userId, firstPassword:pw };
  }

  async function setLearnerStatus(learnerId, status){
    var list=await listLearners(); var item=list.find(function(x){return safeId(x.userId||x.code||x.id)===learnerId || normalizeCode(x.userId||x.code)===normalizeCode(learnerId);});
    if(!item) throw new Error('Teilnehmer nicht gefunden.'); item.status=status; await saveProfile(item, false); updateUI();
  }
  async function deleteLearner(learnerId){
    var code=normalizeCode(learnerId); if(!code){ var list=await listLearners(); var item=list.find(function(x){return x.id===learnerId;}); code=item&&(item.userId||item.code); }
    code=normalizeCode(code||learnerId); var id=safeId(code);
    if(state.online){ var fs=state.sync.fsMod; var base='courses/'+state.courseId+'/learners/'+id; var sub=['progress','attempts','events']; for(var i=0;i<sub.length;i++){ var qs=await fs.getDocs(colRef(base+'/'+sub[i])); var promises=[]; qs.forEach(function(d){ promises.push(fs.deleteDoc(d.ref)); }); await Promise.all(promises); } await fs.deleteDoc(docRef(base)).catch(function(){}); await fs.deleteDoc(docRef('courses/'+state.courseId+'/accessCodes/'+id)).catch(function(){}); }
    var all=localAll(); delete all[code]; localSaveAll(all); if(state.learner && state.learner.userId===code) logout(); updateUI();
  }

  function moduleFromPayload(payload){
    var s=String((payload&& (payload.module || payload.cat || payload.group || payload.category || payload.mode || payload.levelId)) || '').toLowerCase();
    if(/python|py_/.test(s)) return 'python'; if(/mathe|math|prozent|dreisatz/.test(s)) return 'mathe'; if(/logik|matrix|zahlenreihe|visual|würfel|wuerfel/.test(s)) return 'logik'; if(/edv|it|fisi|netzwerk|hardware/.test(s)) return 'edv'; if(/konzentration|zeichen|attention/.test(s)) return 'konzentration'; if(/simulation|bps|ctc|bosch|test/.test(s)) return 'simulation'; return 'global';
  }
  function summarizeAttempt(payload){
    payload=payload||{}; var module=moduleFromPayload(payload); var score = Number(payload.score != null ? payload.score : (payload.correct ? 100 : 0));
    var errors = payload.errors || payload.mainErrors || []; if(!Array.isArray(errors)) errors=[String(errors)];
    if(payload.mistakeType) errors.push(payload.mistakeType); if(payload.diagnosis && payload.diagnosis.type) errors.push(payload.diagnosis.type);
    return { module:module, levelId:payload.levelId||payload.level||'', type:payload.type||payload.mode||'event', score:isFinite(score)?score:0, passed:!!(payload.passed || payload.correct || score>=85), correct:!!payload.correct, errors:errors.filter(Boolean).slice(0,10), createdAt:nowIso() };
  }
  function mergeProfileEvent(profile, attempt){
    profile=profile||defaultProfile('Teilnehmer',''); profile.modules=profile.modules||{}; profile.global=profile.global||{recurringErrors:{}};
    var mod=attempt.module||'global'; if(!profile.modules[mod]) profile.modules[mod]={answered:0,correct:0,averageScore:0,strengths:[],weaknesses:[],recurringErrors:{}};
    var m=profile.modules[mod]; m.answered=(m.answered||0)+1; if(attempt.passed||attempt.correct) m.correct=(m.correct||0)+1;
    var oldAvg=Number(m.averageScore||0); m.averageScore=Math.round(((oldAvg*Math.max(0,(m.answered-1)))+Number(attempt.score||0))/Math.max(1,m.answered));
    m.recurringErrors=m.recurringErrors||{}; profile.global.recurringErrors=profile.global.recurringErrors||{};
    (attempt.errors||[]).forEach(function(err){ err=String(err); m.recurringErrors[err]=(m.recurringErrors[err]||0)+1; profile.global.recurringErrors[err]=(profile.global.recurringErrors[err]||0)+1; });
    if(mod==='python' && attempt.levelId){ var mat=String(attempt.levelId).match(/(\d+)/); var n=parseInt(mat?mat[1]:attempt.levelId,10); if(isFinite(n)){ m.currentLevel=Math.max(Number(m.currentLevel||1), attempt.passed?n+1:n); m.unlockedLevels=Array.isArray(m.unlockedLevels)?m.unlockedLevels:[1]; if(attempt.passed && m.unlockedLevels.indexOf(n+1)<0) m.unlockedLevels.push(n+1); } }
    profile.global.lastModule=mod; profile.global.totalSessions=(profile.global.totalSessions||0)+1; profile.global.riskLevel = riskFromProfile(profile);
    addRecent(profile, attempt); profile.lastActiveAt=nowIso(); return profile;
  }
  function riskFromProfile(profile){ var mods=profile.modules||{}, total=0, good=0, err=0; Object.keys(mods).forEach(function(k){ var m=mods[k]||{}; total+=(m.answered||0); good+=(m.correct||0); Object.keys(m.recurringErrors||{}).forEach(function(e){ err+=(m.recurringErrors[e]||0); }); }); if(total<3) return 'unbekannt'; var q=good/Math.max(1,total); if(q>=.75 && err<Math.max(3,total*.3)) return 'stabil'; if(q>=.55) return 'riskant'; return 'kritisch'; }

  async function writeRemoteAttempt(learner, profile, attempt){
    if(!state.online || !learner) throw new Error('Firebase nicht verbunden oder kein aktiver Lernender.');
    var fs=state.sync.fsMod, base='courses/'+state.courseId+'/learners/'+learner.id;
    var remoteAttempt=Object.assign({}, attempt, { learnerId:learner.id, userId:learner.userId||learner.code, groupId:profile&&profile.groupId||'', firebaseWrittenAt:nowIso(), appVersion:window.TRAINER_BUILD_VERSION||'' });
    await fs.addDoc(colRef(base+'/attempts'), remoteAttempt);
    await fs.addDoc(colRef(base+'/events'), { type:'training-event', attempt:remoteAttempt, createdAt:nowIso() });
    await fs.setDoc(docRef(base+'/progress/'+attempt.module), profile.modules[attempt.module]||{}, {merge:true});
    await fs.setDoc(docRef(base+'/coach/context'), { profile:profile, lastAttempt:remoteAttempt, updatedAt:nowIso(), riskLevel:profile.global&&profile.global.riskLevel||'unbekannt' }, {merge:true});
    return remoteAttempt;
  }
  async function flushPendingSync(){
    if(!state.online) return { ok:false, reason:'offline', pending:pendingSyncQueue().length };
    var list=pendingSyncQueue();
    if(!list.length) return { ok:true, flushed:0, pending:0 };
    var keep=[], flushed=0;
    for(var i=0;i<list.length;i++){
      var item=list[i]||{};
      try{
        if(item.type==='attempt'){
          var pl=item.payload||{};
          var learner=pl.learner || state.learner;
          var profile=pl.profile || state.profile;
          var attempt=pl.attempt;
          if(learner && profile && attempt){ await writeRemoteAttempt(learner, profile, attempt); flushed++; }
          else { item.error='unvollständiger pending attempt'; keep.push(item); }
        } else {
          item.error='unbekannter sync typ'; keep.push(item);
        }
      }catch(e){ item.attempts=Number(item.attempts||0)+1; item.error=e.message||String(e); keep.push(item); }
    }
    savePendingSyncQueue(keep);
    try{ localStorage.setItem(LAST_SYNC_FLUSH_KEY, nowIso()); }catch(e){}
    emit('egt:sync-flushed', { flushed:flushed, pending:keep.length });
    return { ok:true, flushed:flushed, pending:keep.length };
  }

  async function trackEvent(payload){
    if(!state.profile || state.profile.mustChangePassword) return null;
    var attempt=summarizeAttempt(payload); var profile=mergeProfileEvent(clone(state.profile), attempt); state.profile=profile; await saveProfile(profile, true);
    if(state.online && state.learner){
      await writeRemoteAttempt(state.learner, profile, attempt).catch(function(e){ state.error=e.message||String(e); queuePendingSync('attempt', { learner:state.learner, profile:profile, attempt:attempt }); });
    } else if(state.learner){
      queuePendingSync('attempt', { learner:state.learner, profile:profile, attempt:attempt });
    }
    emit('egt:learner-profile-updated',{ profile:profile, attempt:attempt, provider:state.online?'firebase-firestore':'local-cache' }); updateUI(); return attempt;
  }
  async function exportCourse(){ var out={ exportedAt:nowIso(), courseId:state.courseId, learners:await listLearners() }; var blob=new Blob([JSON.stringify(out,null,2)],{type:'application/json'}); var url=URL.createObjectURL(blob); var a=document.createElement('a'); a.href=url; a.download='eignungstest-trainer-'+state.courseId+'-export-'+new Date().toISOString().slice(0,10)+'.json'; document.body.appendChild(a); a.click(); setTimeout(function(){URL.revokeObjectURL(url); a.remove();},300); return out; }
  async function resetCourse(){ var learners=await listLearners(); for(var i=0;i<learners.length;i++){ await deleteLearner(learners[i].userId||learners[i].code||learners[i].id); } return { deleted:learners.length }; }
  function enrichCoachPayload(payload){ payload=payload||{}; if(state.learner){ payload.userId=state.learner.userId||state.learner.code; payload.learnerCode=state.learner.code; payload.learnerAlias=state.learner.displayName||state.learner.alias; payload.profileId=state.learner.id; } if(state.profile){ payload.groupId=state.profile.groupId||''; payload.userProfile=clone(state.profile); } payload.userDatabaseProvider=state.online?'firebase-firestore':'local-cache'; return payload; }
  function coachDnaSnapshot(userId){ try{ return window.EGTCoachDNA ? window.EGTCoachDNA.dashboard(userId || (state.learner&&state.learner.userId)) : null; }catch(e){ return null; } }
  async function loadCoachContext(userId){
    var code=normalizeCode(userId || (state.learner && (state.learner.userId||state.learner.code)));
    if(!code) return { provider:state.online?'firebase-firestore':'local-cache', profile:null, attempts:[] };
    var got=null; try{ got=await fetchProfile(code); }catch(e){ got={ profile:localProfile(code), id:safeId(code) }; }
    var attempts=[];
    if(state.online && got && got.id){
      try{ var qs=await state.sync.fsMod.getDocs(colRef('courses/'+state.courseId+'/learners/'+got.id+'/attempts')); qs.forEach(function(d){ var x=d.data()||{}; x.id=d.id; attempts.push(x); }); }catch(e2){ state.error=e2.message||String(e2); }
    }
    if((!attempts.length) && got && got.profile && Array.isArray(got.profile.attempts)) attempts=got.profile.attempts.slice();
    return { provider:state.online?'firebase-firestore':'local-cache', courseId:state.courseId, profile:got&&got.profile||null, attempts:attempts.slice(-80), coachDna:coachDnaSnapshot(code) };
  }

  var COURSE_SETTINGS_KEY = 'egt_admin_course_settings';
  function getCourseSettings(){
    var base={ year:2026, course:'GK', track:'A', digits:Number(config().learnerCodeDigits||3), title:'2026-GK' };
    try{ var saved=JSON.parse(localStorage.getItem(COURSE_SETTINGS_KEY)||'{}'); Object.keys(saved||{}).forEach(function(k){ if(saved[k]!=='' && saved[k]!=null) base[k]=saved[k]; }); }catch(e){}
    base.year=Number(base.year||2026); base.course=normalizeCode(base.course||'GK').replace(/-/g,'') || 'GK'; base.track=normalizeCode(base.track||'A').replace(/-/g,'') || 'A'; base.digits=Math.max(2, Math.min(5, Number(base.digits||3))); base.title=base.year+'-'+base.course;
    base.prefix=base.year+'-'+base.course+'-'+base.track;
    return base;
  }
  function saveCourseSettings(settings){
    var cur=getCourseSettings(); settings=settings||{};
    ['year','course','track','digits'].forEach(function(k){ if(settings[k]!=null && settings[k]!=='') cur[k]=settings[k]; });
    localStorage.setItem(COURSE_SETTINGS_KEY, JSON.stringify(cur));
    state.courseId='course_'+String(cur.year)+'_'+String(cur.course).toLowerCase();
    return getCourseSettings();
  }
  function profileProgress(profile){
    var mods=profile&&profile.modules||{}, answered=0, correct=0, avgSum=0, avgCount=0;
    Object.keys(mods).forEach(function(k){ var m=mods[k]||{}; answered+=Number(m.answered||0); correct+=Number(m.correct||0); if(m.averageScore!=null){ avgSum+=Number(m.averageScore||0); avgCount++; } });
    var accuracy = answered ? Math.round(correct/answered*100) : 0;
    return { answered:answered, correct:correct, accuracy:accuracy, averageScore:avgCount?Math.round(avgSum/avgCount):0, risk:riskFromProfile(profile), modules:Object.keys(mods).length };
  }
  async function courseStats(){
    var list=await listLearners();
    var stats={ total:list.length, active:0, inactive:0, mustChange:0, stable:0, riskant:0, kritisch:0, unknown:0, attempts:0, avgAccuracy:0 };
    var accSum=0, accCount=0;
    list.forEach(function(p){ var status=p.status||'active'; if(status==='active') stats.active++; else stats.inactive++; if(p.mustChangePassword) stats.mustChange++; var pr=profileProgress(p); stats.attempts+=pr.answered; if(pr.answered){ accSum+=pr.accuracy; accCount++; } if(pr.risk==='stabil') stats.stable++; else if(pr.risk==='riskant') stats.riskant++; else if(pr.risk==='kritisch') stats.kritisch++; else stats.unknown++; });
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
    return '<div class="egt-profile-bar '+band.cls+'"><div class="egt-profile-bar-head"><span>'+escapeHtml(label)+'</span><b>'+v+'%</b></div><div class="egt-profile-bar-track"><i style="width:'+v+'%"></i></div><small>'+escapeHtml(meta || band.label)+'</small></div>';
  }
  function infoBarHtml(label, value, meta, cls){
    cls=cls||'neutral';
    return '<div class="egt-profile-info-bar '+cls+'"><span>'+escapeHtml(label)+'</span><b>'+escapeHtml(value)+'</b><small>'+escapeHtml(meta||'')+'</small></div>';
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
      return '<div class="egt-admin-progress-row '+band.cls+'"><div class="egt-progress-main"><span>'+escapeHtml(k.toUpperCase())+'</span><b>'+q+'%</b></div><div class="egt-progress-track"><i style="width:'+normalizePercent(q)+'%"></i></div><small>'+escapeHtml(band.label)+' · '+Number(m.answered||0)+' Versuche</small></div>';
    }).join('');
  }
  function adminOpen(){ return sessionStorage.getItem(ADMIN_OPEN_KEY)==='1'; }
  function adminLockedText(){ return 'Admin gesperrt. Bitte zuerst Admin-PIN eingeben.'; }


  function dozentOpen(){ return sessionStorage.getItem(DOZENT_OPEN_KEY)==='1'; }
  function currentPortalRole(){
    if(adminOpen()) return 'admin';
    if(dozentOpen()) return 'dozent';
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
  async function unlockDozent(pin){
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
    var list=[];
    try{ list=Object.keys(localAll()).map(function(k){ return ensureProfileGroup(localAll()[k]); }).filter(Boolean); }catch(e){ list=[]; }
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
    if(status==='stabil') return 'ok';
    if(status==='riskant') return 'warn';
    if(status==='kritisch') return 'danger';
    if(status==='inaktiv') return 'neutral';
    return 'neutral';
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
    return '<article class="egt-admin-learner '+(compact?'compact':'')+' egt-profile-card egt-profile-bars-card" data-participant-card data-status="'+escapeHtml(filterStatus)+'"><div class="egt-learner-head"><div><strong>'+escapeHtml(participantDisplayName(x))+'</strong><small>'+escapeHtml(userId)+'</small></div><span class="egt-admin-pill '+risk.cls+'">'+escapeHtml(risk.label)+'</span>'+(x.isDemo?'<span class="egt-admin-pill">Demo</span>':'')+'</div><div class="egt-profile-status-strip '+risk.cls+'"><span>'+escapeHtml(risk.desc)+'</span><b>'+escapeHtml(help.label)+'</b></div><div class="egt-profile-bars">'+profileBars+'</div><div class="egt-profile-info-bars">'+infoBars+'</div><div class="egt-profile-timeline"><div><b>Letzte Aktivität</b><span>'+escapeHtml(formatDateShort(x.lastActiveAt))+'</span></div><div><b>Letzte Simulation</b><span>'+escapeHtml(sim.label)+' · '+escapeHtml(sim.when)+'</span></div></div><div class="egt-profile-recommendation"><b>Empfehlung</b><span>'+escapeHtml(recommendationForProfile(x))+'</span></div><div class="egt-admin-progress egt-profile-modules">'+moduleSummaryHtml(x)+'</div></article>';
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
      return '<button class="egt-participant-name-btn" type="button" data-pick-participant="'+escapeHtml(userId)+'" data-role="'+escapeHtml(role)+'" data-status="'+escapeHtml(fStatus)+'"><span>'+escapeHtml(participantDisplayName(x))+'</span><small>'+escapeHtml(userId)+'</small><i class="'+help.cls+'">'+escapeHtml(participantStatusLabel(fStatus))+'</i></button>';
    }).join('');
    return '<details class="egt-participant-dropdown" data-participant-dropdown data-role="'+escapeHtml(role)+'"><summary><span>Teilnehmerliste</span><b>'+list.length+'</b></summary><div class="egt-participant-picker"><div class="egt-participant-picker-head"><p>Alphabetisch sortiert. Filtere nach Hilfebedarf oder wähle zuerst einen Namen, dann erscheinen die Details.</p><button class="egt-admin-btn secondary" type="button" data-show-all-participants data-role="'+escapeHtml(role)+'">Alle Teilnehmer anzeigen</button></div>'+statusFilterChipsHtml(role)+'<div class="egt-participant-name-list">'+names+'</div><div class="egt-participant-detail" data-participant-detail><div class="egt-empty-state">Noch kein Teilnehmer ausgewählt.</div></div><div class="egt-participant-all egt-admin-hidden" data-participant-all><h4>Alle Teilnehmer</h4><div class="egt-admin-list egt-participant-list-compact">'+participantListHtml(role,true)+'</div></div></div></details>';
  }

  function quoteRingHtml(value, label, subLabel){
    var ring=Math.max(0,Math.min(100,Number(value)||0));
    return '<div class="egt-quote-card" aria-label="'+escapeHtml(label)+' '+ring+' Prozent"><div class="egt-donut egt-donut-unified" style="--p:'+ring+'"><strong>'+ring+'%</strong><span>'+escapeHtml(label)+'</span></div><small>'+escapeHtml(subLabel||'Gesamtblick')+'</small></div>';
  }

  function portalDashboardHtml(role){
    var st=overviewStatsFor(role), list=filteredLearnersForRole(role);
    var title = role==='admin' ? 'Admin Übersicht' : 'Dozenten Übersicht';
    var access=groupAccessForRole(role); var sub = role==='admin' ? 'Gesamtblick über alle Gruppen, Teilnehmer, Hilfebedarf und Lernaktivität.' : 'Nur zugewiesene Teilnehmerdaten: '+access.label+'.';
    var modules={ 'IT / FISI':0, 'Kaufmännisch':0, 'Sozialpädagogik':0, 'Allgemeinwissen':0 };
    list.forEach(function(p){
      var w=(p.global&&p.global.weaknesses)||p.weaknesses||[];
      var s=String((w&&w[0]) || (p.global&&p.global.lastModule) || '').toLowerCase();
      if(s.indexOf('sozial')>=0) modules['Sozialpädagogik']++;
      else if(s.indexOf('kauf')>=0 || s.indexOf('dreisatz')>=0) modules['Kaufmännisch']++;
      else if(s.indexOf('it')>=0 || s.indexOf('subnet')>=0 || s.indexOf('python')>=0) modules['IT / FISI']++;
      else modules['Allgemeinwissen']++;
    });
    var max=Math.max(1, st.total);
    var bars=Object.keys(modules).map(function(k){ var v=modules[k]; var pct=Math.max(v?8:0, Math.round((v/max)*100)); return '<div class="egt-metric-bar"><span>'+escapeHtml(k)+'</span><i style="width:'+pct+'%"></i><b>'+v+'</b></div>'; }).join('');
    return '<div class="egt-portal-dashboard egt-admin-card-wide"><div class="egt-portal-dashboard-head"><div><span class="egt-session-kicker">Dashboard</span><h3>'+escapeHtml(title)+'</h3><p>'+escapeHtml(sub)+'</p></div>'+quoteRingHtml(st.avg,'Ø Quote',(role==='admin'?'Alle Teilnehmer':'Zugewiesene Teilnehmer'))+'</div><div class="egt-admin-stat-grid egt-dashboard-stats"><div><b>'+st.total+'</b><span>Teilnehmer</span></div><div><b>'+st.active+'</b><span>aktiv</span></div><div><b>'+st.help+'</b><span>Hilfebedarf</span></div><div><b>'+st.answered+'</b><span>Aufgaben</span></div></div><div class="egt-chart-card"><h4>Schwerpunkte / Hilfebereiche</h4>'+bars+'</div>'+helpPriorityDropdownHtml(role)+participantDropdownHtml(role)+'</div>';
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
    return '<div class="egt-system-card '+escapeHtml(tone||'neutral')+'"><span>'+escapeHtml(label)+'</span><b>'+escapeHtml(value)+'</b><small>'+escapeHtml(sub||'')+'</small></div>';
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
  function reportRows(role){
    return reportLearners(role).map(function(p){
      var pr=profileProgress(p), h=learnerHelpLabel(p), st=participantFilterStatus(p);
      return { userId:normalizeCode(p.userId||p.code||p.loginName||p.id), name:participantDisplayName(p), groupId:p.groupId||'', course:p.course||'', track:p.track||'', status:participantStatusLabel(st), help:h.label, quote:pr.accuracy, answered:pr.answered, lastActivity:formatDateShort(p.lastActiveAt), lastSimulation:(function(){var sim=lastSimulationInfo(p); return sim.label+' · '+sim.when;})(), strongest:topStrength(p), weakest:topWeakness(p), recommendation:recommendationForProfile(p) };
    });
  }
  function reportSummary(role){
    var list=reportLearners(role), st=overviewStatsFor(role), counts={stabil:0,riskant:0,kritisch:0,inaktiv:0,unbekannt:0};
    list.forEach(function(p){ var s=participantFilterStatus(p); counts[s]=(counts[s]||0)+1; });
    return { total:st.total, active:st.active, help:st.help, answered:st.answered, avg:st.avg, counts:counts, scope:reportScopeLabel(role), role:role||currentPortalRole() };
  }
  function reportCsv(role, onlyHelp){
    var rows=reportRows(role).filter(function(r){ return !onlyHelp || (r.help!=='stabil' && r.help!=='Keine Daten'); });
    var head=['Teilnehmer-ID','Name','Gruppe','Kurs','Track','Status','Hilfebedarf','Quote','Aufgaben','Letzte Aktivität','Letzte Simulation','Stärkster Bereich','Schwächster Bereich','Empfehlung'];
    var all=[head].concat(rows.map(function(r){ return [r.userId,r.name,r.groupId,r.course,r.track,r.status,r.help,r.quote,r.answered,r.lastActivity,r.lastSimulation,r.strongest,r.weakest,r.recommendation]; }));
    return all.map(function(r){ return r.map(toCsvCell).join(';'); }).join('\n');
  }
  function reportJson(role, onlyHelp){
    var rows=reportRows(role).filter(function(r){ return !onlyHelp || (r.help!=='stabil' && r.help!=='Keine Daten'); });
    return JSON.stringify({ exportedAt:nowIso(), version:'G33.5', role:role||currentPortalRole(), scope:reportScopeLabel(role), summary:reportSummary(role), participants:rows }, null, 2);
  }
  function reportText(role){
    var sum=reportSummary(role), rows=reportRows(role);
    var lines=[];
    lines.push('BPS-Trainer · G33.5 Bericht');
    lines.push('Export: '+nowIso());
    lines.push('Rolle: '+(role||currentPortalRole()));
    lines.push('Bereich: '+sum.scope);
    lines.push('Teilnehmer: '+sum.total+' · aktiv: '+sum.active+' · Hilfebedarf: '+sum.help+' · Ø Quote: '+sum.avg+'%');
    lines.push('Status: stabil '+sum.counts.stabil+' · riskant '+sum.counts.riskant+' · kritisch '+sum.counts.kritisch+' · inaktiv '+sum.counts.inaktiv);
    lines.push('');
    rows.forEach(function(r){ lines.push(r.name+' ('+r.userId+') · '+r.status+' · '+r.help+' · '+r.quote+'% · '+r.weakest+' · '+r.recommendation); });
    return lines.join('\n');
  }
  function reportSummaryCardsHtml(role){
    var s=reportSummary(role);
    return '<div class="egt-report-summary egt-admin-stat-grid">'
      +'<div><b>'+s.total+'</b><span>Teilnehmer</span></div>'
      +'<div><b>'+s.help+'</b><span>Hilfebedarf</span></div>'
      +'<div><b>'+s.avg+'%</b><span>Ø Quote</span></div>'
      +'<div><b>'+s.answered+'</b><span>Aufgaben</span></div>'
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
  function reportsPanelHtml(){
    var role=currentPortalRole(); if(role==='locked') return '<div class="egt-empty-state">Bitte zuerst einloggen.</div>';
    var admin=role==='admin';
    var title=admin?'Admin-Berichte & Export':'Dozenten-Berichte & Export';
    var sub=admin?'Exportiert alle sichtbaren Gruppen und Teilnehmer.':'Exportiert nur deine zugewiesene Gruppe und sichtbare Teilnehmer.';
    return '<div class="egt-admin-card egt-admin-card-wide egt-reports-panel"><div class="egt-portal-dashboard-head"><div><span class="egt-session-kicker">Berichte</span><h3>'+escapeHtml(title)+'</h3><p>'+escapeHtml(sub)+'</p><small>'+escapeHtml(reportScopeLabel(role))+'</small></div>'+quoteRingHtml(reportSummary(role).avg,'Ø Quote','Berichtsbereich')+'</div>'+reportSummaryCardsHtml(role)+'<div class="egt-portal-grid egt-report-grid"><div class="egt-admin-subcard"><strong>Export</strong><p>CSV für Tabellen, JSON für Backup/Weiterverarbeitung, Textbericht zum Kopieren.</p><div class="egt-admin-row"><button class="egt-admin-btn secondary" data-export-report-csv type="button">CSV Bericht</button><button class="egt-admin-btn secondary" data-export-report-json type="button">JSON Bericht</button><button class="egt-admin-btn secondary" data-copy-report type="button">Bericht kopieren</button></div></div><div class="egt-admin-subcard"><strong>Hilfebedarf Export</strong><p>Nur Teilnehmer mit Unterstützungsbedarf oder Beobachtung.</p><div class="egt-admin-row"><button class="egt-admin-btn secondary" data-export-help-csv type="button">Hilfebedarf CSV</button><button class="egt-admin-btn secondary" data-export-help-json type="button">Hilfebedarf JSON</button></div></div>'+reportStatusBarsHtml(role)+'</div><details class="egt-report-preview"><summary>Berichtsvorschau anzeigen</summary><pre>'+escapeHtml(reportText(role))+'</pre></details></div>';
  }
  function updateReportsPanel(){ var panel=document.querySelector('[data-reports-panel]'); if(panel) panel.innerHTML=reportsPanelHtml(); }

  function accessRolePickerHtml(role){
    if(role==='dozent'){
      var scope=accessCodeScopeFor('dozent');
      return '<div class="egt-admin-kv egt-access-scope"><b>Rolle</b><span>Teilnehmer</span><b>Gruppe</b><span>'+escapeHtml(scope.label)+'</span></div>';
    }
    var roles=[['participant','Teilnehmer'],['teacher','Dozent'],['admin','Admin'],['demo','Demo']];
    return '<div class="egt-access-role-grid">'+roles.map(function(r,i){ return '<label class="egt-check egt-access-role"><input type="radio" name="egtAccessRole" data-access-role value="'+escapeHtml(r[0])+'" '+(i===0?'checked':'')+'> '+escapeHtml(r[1])+'</label>'; }).join('')+'</div>';
  }
  function accessCodesPanelHtml(role){
    role=role||currentPortalRole();
    var isDozent=role==='dozent';
    var scope=accessCodeScopeFor(role);
    var defaultGroup=isDozent ? (scope.groups[0] || '') : getCourseSettings().prefix;
    var title=isDozent ? 'Zugangscodes für meine Gruppe' : 'Zugangscodes';
    var desc=isDozent ? 'Dozenten erzeugen ausschließlich Teilnehmercodes für die eigene Gruppe.' : 'Admin erzeugt Codes für Teilnehmer, Dozenten, Admins oder Demo-Zugänge.';
    return '<div class="egt-access-code-panel" data-access-panel="'+escapeHtml(role)+'">'
      +'<div class="egt-portal-dashboard-head"><div><span class="egt-session-kicker">Firebase UserDatabase</span><h3>'+escapeHtml(title)+'</h3><p>'+escapeHtml(desc)+'</p><small>'+escapeHtml(scope.label||'')+'</small></div></div>'
      +'<div class="egt-admin-mini-grid egt-access-generator">'
        +'<div class="egt-admin-subcard"><strong>Code-Typ</strong>'+accessRolePickerHtml(role)+'</div>'
        +'<div class="egt-admin-subcard"><strong>Gruppe & Regeln</strong>'
          +'<input class="egt-admin-input" data-access-group placeholder="Gruppe" value="'+escapeHtml(defaultGroup)+'" '+(isDozent?'readonly':'')+'>'
          +'<input class="egt-admin-input" data-access-max-uses type="number" min="1" max="99" value="1" placeholder="Einlösungen">'
          +'<input class="egt-admin-input" data-access-note maxlength="140" placeholder="Notiz optional">'
          +'<button class="egt-admin-btn" data-generate-access-code type="button">Code generieren</button>'
        +'</div>'
      +'</div>'
      +'<div class="egt-admin-status" data-access-result>Noch kein Code erzeugt.</div>'
      +'<div class="egt-admin-row"><button class="egt-admin-btn secondary" data-refresh-access-codes type="button">Codes aktualisieren</button></div>'
      +'<div class="egt-access-code-list" data-access-code-list="'+escapeHtml(role)+'">Codes werden geladen…</div>'
    +'</div>';
  }
  function accessCodeRowHtml(x){
    x=x||{};
    var code=normalizeCode(x.code||x.id||'');
    var status=String(x.status||'active').toLowerCase();
    var cls=status==='active'?'ok':(status==='revoked'||status==='used'?'danger':'warn');
    var uses=Number(x.usedCount!=null?x.usedCount:x.used_count||0)+'/'+Number(x.maxUses!=null?x.maxUses:x.max_uses||1);
    return '<div class="egt-admin-learner egt-access-code-row">'
      +'<div class="egt-learner-head"><div><strong>'+escapeHtml(code)+'</strong><small>'+escapeHtml(roleDisplayValue(x.role))+' · '+escapeHtml(x.groupId||x.group_id||'ohne Gruppe')+'</small></div><span class="egt-admin-pill '+cls+'">'+escapeHtml(status)+'</span></div>'
      +'<div class="egt-admin-kv"><b>Nutzung</b><span>'+escapeHtml(uses)+'</span><b>Erstellt von</b><span>'+escapeHtml(x.createdByName||x.createdBy||x.createdByRole||'—')+'</span><b>Erstellt</b><span>'+escapeHtml(formatDateShort(x.createdAt||''))+'</span><b>Notiz</b><span>'+escapeHtml(x.note||'—')+'</span></div>'
      +'<div class="egt-admin-row"><button class="egt-admin-btn secondary" data-copy-access-code="'+escapeHtml(code)+'" type="button">Code kopieren</button>'+(status==='active'?'<button class="egt-admin-btn danger" data-revoke-access-code="'+escapeHtml(code)+'" type="button">Widerrufen</button>':'')+'</div>'
    +'</div>';
  }
  async function renderAccessCodes(role){
    role=role||currentPortalRole();
    var box=document.querySelector('[data-access-code-list="'+role+'"]');
    if(!box) return;
    if(!(role==='admin' || role==='dozent')){ box.innerHTML='<div class="egt-empty-state">Bitte zuerst einloggen.</div>'; return; }
    box.innerHTML='<div class="egt-empty-state">Zugangscodes werden geladen…</div>';
    try{
      var list=await listAccessCodes(role);
      box.innerHTML=list.length ? list.map(accessCodeRowHtml).join('') : '<div class="egt-empty-state">Noch keine sichtbaren Zugangscodes.</div>';
    }catch(e){ box.innerHTML='<div class="egt-empty-state">Codes konnten nicht geladen werden: '+escapeHtml(e.message||e)+'</div>'; }
  }
  function renderAccessCodePanels(){
    if(adminOpen()) renderAccessCodes('admin');
    if(dozentOpen()) renderAccessCodes('dozent');
  }

  function systemInfoHtml(){
    var sw='nicht verfügbar';
    try{ sw = ('serviceWorker' in navigator) ? 'verfügbar' : 'nicht verfügbar'; }catch(e){}
    var storageOk='OK'; try{ localStorage.setItem('__egt_probe','1'); localStorage.removeItem('__egt_probe'); }catch(e2){ storageOk='Fehler'; }
    var profiles=Object.keys(localAll()).filter(function(k){ var p=localProfile(k); return p && p.status!=='deleted'; }).length;
    var cacheName='bps-trainer-g324-firebase-userdatabase-foundation';
    var build=(window.TRAINER_BUILD_VERSION||'G33.5-DEMO-GATES-HIGHSCORE-PROFILE-2026-06-08');
    var fbStatus = state.online ? 'verbunden' : (firebaseConfigReady() ? 'nicht verbunden' : 'Konfiguration fehlt');
    var online = (typeof navigator!=='undefined' && 'onLine' in navigator) ? (navigator.onLine?'online':'offline') : 'unbekannt';
    var cards=''
      +systemCardHtml('Version','G33.5','Demo Gates + Highscore Profile','ok')
      +systemCardHtml('Build',build,'aktueller App-Build','info')
      +systemCardHtml('Service Worker',sw,cacheName, sw==='verfügbar'?'ok':'warn')
      +systemCardHtml('Speicher',storageOk,formatBytes(localStorageBytes())+' LocalStorage', storageOk==='OK'?'ok':'danger')
      +systemCardHtml('IndexedDB',window.indexedDB?'verfügbar':'nicht verfügbar','lokaler Gerätecache', window.indexedDB?'ok':'warn')
      +systemCardHtml('Firebase',fbStatus,'UserDatabase / Firestore', state.online?'ok':(firebaseConfigReady()?'warn':'danger'))
      +systemCardHtml('Teilnehmer',profiles+' Profile','lokaler Cache + Firebase-Sync','info')
      +systemCardHtml('Aufgaben',taskCount()+' Aufgaben','geladene Aufgabenbank','info')
      +systemCardHtml('Status',online,'Netzwerkstatus','neutral');
    return '<div class="egt-system-dashboard">'+cards+'</div><div class="egt-admin-kv egt-system-kv"><b>Aktiver Kurs</b><span>'+escapeHtml(state.courseId)+'</span><b>Rolle</b><span>'+escapeHtml(roleLabel())+'</span><b>Cache-Name</b><span>'+escapeHtml(cacheName)+'</span><b>UserDatabase</b><span>'+escapeHtml(state.online?'Firebase Firestore verbunden':'Firebase nicht verbunden · lokaler Cache aktiv')+'</span></div><div class="egt-system-diagnostics" data-system-diagnostics>Cache-/Service-Worker- und Firebase-Details noch nicht ausgelesen. Klicke auf „Diagnose aktualisieren“.</div>';
  }
  async function systemDiagnosticsText(){
    var lines=[];
    lines.push('BPS Trainer · G33.5 Demo Gates Diagnose');
    lines.push('Build: '+(window.TRAINER_BUILD_VERSION||'G33.5-DEMO-GATES-HIGHSCORE-PROFILE-2026-06-08'));
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
      regs.forEach(function(r,idx){ lines.push('SW '+(idx+1)+': '+(r.scope||'ohne scope')); });
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
    lines.push('Teilnehmer lokal: '+Object.keys(localAll()).length);
    lines.push('Aufgaben geladen: '+taskCount());
    try{ var qbs=questionBankSnapshot(); lines.push('Aufgaben-Quellen/Einträge: '+qbs.sourceChunks); lines.push('Aufgaben-Gruppen: '+Object.keys(qbs.groups||{}).map(function(k){return k+'='+qbs.groups[k];}).join(', ')); }catch(e3){}
    return lines.join('\n');
  }
  async function updateSystemDiagnostics(){
    var box=document.querySelector('[data-system-diagnostics]');
    if(!box) return;
    box.textContent='Diagnose wird ausgelesen…';
    try{ box.textContent = await systemDiagnosticsText(); }
    catch(e){ box.textContent='Diagnosefehler: '+(e.message||e); }
  }
  function roadmapHtml(){
    return '<div class="egt-roadmap-list"><div><b>✅ Erledigt</b><span>Neon UI stabil, Rollen/Gruppenmodell, Dozent A/B, Teilnehmerprofile, Balkenansicht, Aufgabenbank und Berichte.</span></div><div><b>🟣 Aktuell</b><span>G33.5: Demo-Gates aktiv, Highscore nutzt Profil/Nickname, Codegenerator bleibt über Firebase aktiv.</span></div><div><b>🔵 Nächstes Ziel</b><span>Nächstes Ziel: Coach-Personalisierung über Firebase UserDatabase kontrolliert anbinden.</span></div><div><b>🟡 Danach</b><span>Danach: Duell-Vorbereitung und Rollen-Regeln härten.</span></div></div>';
  }
  async function renderDozentStats(){
    var dash=document.querySelector('[data-dozent-dashboard]');
    var box=document.querySelector('[data-dozent-stats]'); if(!box && !dash) return;
    if(!dozentOpen() && !adminOpen()){ if(box) box.textContent='Dozentenbereich gesperrt.'; if(dash) dash.innerHTML=''; return; }
    var role=adminOpen()?'admin':'dozent'; var st=overviewStatsFor(role);
    if(dash) dash.innerHTML=portalDashboardHtml(role);
    if(box) box.innerHTML='<div class="egt-admin-stat-grid"><div><b>'+st.total+'</b><span>Teilnehmer</span></div><div><b>'+st.active+'</b><span>aktiv</span></div><div><b>'+st.help+'</b><span>Hilfebedarf</span></div><div><b>'+st.avg+'%</b><span>Ø Quote</span></div></div><p>Dozenten sehen nur zugewiesene bzw. kursbezogene Teilnehmer. Admins sehen alle Daten.</p>';
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


  function relabelPortalTabs(role){
    var labels = role==='dozent'
      ? { login:'Login', dozent:'Übersicht', reports:'Berichte' }
      : { login:'Login', dozent:'Dozentenblick', admin:'Admin Übersicht', reports:'Berichte', system:'System', qbank:'Aufgabenbank', roadmap:'Roadmap' };
    document.querySelectorAll('[data-tab]').forEach(function(el){
      var key=el.getAttribute('data-tab');
      if(labels[key]) el.textContent=labels[key];
    });
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
      else if(role==='admin') visible = (key==='dozent'||key==='admin'||key==='reports'||key==='system'||key==='qbank'||key==='roadmap');
      else if(role==='dozent') visible = (key==='dozent'||key==='reports');
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
  }

  function patchCoach(){ if(window.__EGT_COACH_PATCHED__) return; window.__EGT_COACH_PATCHED__=true; window.addEventListener('egt:training-event', function(e){ trackEvent(e.detail||{}); }); }

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
            <p data-fb-status>System startet…</p>
            <span class="egt-sr-only" data-portal-live aria-live="polite"></span>
          </div>
          <button class="egt-admin-x" data-admin-close-portal type="button" aria-label="Portal schließen">×</button>
        </div>
        <div class="egt-admin-body egt-portal-body">
          <div class="egt-admin-tabs egt-portal-tabs egt-portal-tabbar">
            <div class="egt-portal-tab-group">
              <button class="egt-admin-tab active" data-tab="login">Login</button>
              <button class="egt-admin-tab" data-tab="dozent">Dozentenblick</button>
              <button class="egt-admin-tab" data-tab="admin">Admin Übersicht</button>
              <button class="egt-admin-tab" data-tab="reports">Berichte</button>
              <button class="egt-admin-tab" data-tab="system">System</button>
              <button class="egt-admin-tab" data-tab="qbank">Aufgabenbank</button>
              <button class="egt-admin-tab" data-tab="roadmap">Roadmap</button>
            </div>
            <button class="egt-admin-tab egt-logout-tab egt-admin-hidden" data-admin-full-logout type="button">Logout</button>
          </div>

          <section data-panel="login">
            <div class="egt-portal-grid">
              <div class="egt-admin-card">
                <h3>Admin Login</h3>
                <p>Vollzugriff auf Teilnehmer, Inhalte, Systeminfo, Roadmap und Exporte.</p>
                <input class="egt-admin-input" data-admin-pin type="password" placeholder="Admin-PIN" autocomplete="current-password">
                <div class="egt-admin-row"><button class="egt-admin-btn" data-admin-unlock>Admin öffnen</button></div>
              </div>
              <div class="egt-admin-card">
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
              <div class="egt-admin-card">
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

          <section data-panel="dozent" class="egt-admin-hidden">
            <div class="egt-admin-card egt-admin-card-wide egt-admin-hidden" data-dozent-session-panel></div>
            <div data-dozent-dashboard></div>
            <div class="egt-portal-grid" data-dozent-visible>
              <div class="egt-admin-card"><h3>Übersicht meiner Gruppen</h3><div data-dozent-stats>Dozentenbereich gesperrt.</div></div>
              <div class="egt-admin-card"><h3>Wichtige Hinweise</h3><ul><li>Nur relevante Teilnehmerdaten sichtbar.</li><li>Hilfebedarf steht vor Gesamtüberwachung.</li><li>Keine technischen Adminfunktionen.</li></ul></div>
            </div>
            <div class="egt-admin-card egt-admin-card-wide" data-dozent-access-codes>${accessCodesPanelHtml('dozent')}</div>
            <div class="egt-admin-hidden" data-dozent-learner-list></div>
          </section>

          <section data-panel="admin" class="egt-admin-hidden">
            <div class="egt-admin-card egt-admin-card-wide egt-admin-hidden" data-admin-session-panel></div>
            <div data-admin-dashboard></div>
            <div data-admin-only>
              <div class="egt-portal-grid">
                <div class="egt-admin-card"><h3>Kursgruppe</h3><p>Steuert automatisch sortierte Teilnehmer-IDs.</p><div class="egt-admin-mini-grid"><input class="egt-admin-input" data-course-year type="number" min="2024" max="2099" placeholder="Jahr"><input class="egt-admin-input" data-course-code placeholder="Kurs, z. B. GK"><input class="egt-admin-input" data-course-track placeholder="Reihe, z. B. A"><input class="egt-admin-input" data-course-digits type="number" min="2" max="5" placeholder="Stellen"></div><div class="egt-admin-row"><button class="egt-admin-btn secondary" data-save-course>Gruppe speichern</button><span class="egt-admin-pill" data-current-course></span></div></div>
                <div class="egt-admin-card"><h3>Teilnehmer erstellen</h3><p>Die nächste freie ID wird automatisch vorgeschlagen.</p><input class="egt-admin-input" data-new-learner-code placeholder="2026-GK-A001" readonly><input class="egt-admin-input" data-display-name placeholder="Name optional"><label class="egt-check"><input type="checkbox" data-anonymous checked> anonym bleiben</label><div class="egt-admin-row"><button class="egt-admin-btn secondary" data-suggest-code>Nächste ID laden</button><button class="egt-admin-btn" data-create-custom>Teilnehmer erstellen</button></div><div class="egt-admin-status" data-create-result>Noch kein Teilnehmer erstellt.</div></div>
              </div>
              <div class="egt-admin-card egt-admin-card-wide" data-admin-access-codes>${accessCodesPanelHtml('admin')}</div>
              <div class="egt-portal-grid" style="margin-top:14px">
                <div class="egt-admin-card"><h3>Kurs-Dashboard</h3><div data-admin-stats>Admin gesperrt.</div></div>
                <div class="egt-admin-card"><h3>Demo-Gruppen & Dozenten</h3><p>Erzeugt 2 Gruppen, 2 Demo-Dozenten und 6 Testprofile. Demo Dozent A sieht Gruppe A, Demo Dozent B sieht Gruppe B.</p><div class="egt-admin-row"><button class="egt-admin-btn secondary" data-create-demo>Demo-Daten erzeugen</button><button class="egt-admin-btn danger" data-delete-demo>Demo-Daten löschen</button></div><div class="egt-admin-status" data-demo-result>Noch keine Demo-Daten erzeugt.</div></div>
                <div class="egt-admin-card"><h3>Kursverwaltung</h3><p>Export vor Reset empfohlen. Gefährliche Aktionen sind abgesichert.</p><div class="egt-admin-row"><button class="egt-admin-btn secondary" data-refresh-learners>Teilnehmerliste aktualisieren</button><button class="egt-admin-btn secondary" data-export>Export JSON</button><button class="egt-admin-btn secondary" data-export-csv>Export CSV</button></div><div class="egt-admin-row"><input class="egt-admin-input" data-reset-confirm placeholder="RESET eingeben zum Kurs-Reset"><button class="egt-admin-btn danger" data-reset>Kurs resetten</button></div></div>
              </div>
              <div class="egt-admin-hidden" data-learner-list></div>
            </div>
          </section>

          <section data-panel="reports" class="egt-admin-hidden"><div data-reports-panel>${reportsPanelHtml()}</div></section>

          <section data-panel="system" class="egt-admin-hidden"><div class="egt-admin-card egt-admin-card-wide"><h3>Systeminfo & Diagnose</h3><p>Nur Admin. Version, Cache, Service Worker, Speicher, Aufgabenbank und lokaler Datenzustand.</p><div data-system-info-panel>${systemInfoHtml()}</div><div class="egt-admin-row"><button class="egt-admin-btn secondary" data-refresh-system>Diagnose aktualisieren</button><button class="egt-admin-btn secondary" data-copy-diagnostics>Diagnose kopieren</button><button class="egt-admin-btn danger" data-clear-site-cache>Cache-Hinweis anzeigen</button></div></div></section>
          <section data-panel="qbank" class="egt-admin-hidden"><div class="egt-admin-card egt-admin-card-wide"><h3>Aufgabenbank-Qualitätsprüfung</h3><p>Nur Admin. Prüft Anzahl, Fachgruppen, Lösungen, Antwortoptionen, Dubletten, Erklärungen, Tags und fachliche Sonderregeln.</p><div data-qbank-quality>Qualitätsdaten werden geladen…</div><div class="egt-admin-row"><button class="egt-admin-btn secondary" data-refresh-qbank type="button">Aufgabenbank prüfen</button><button class="egt-admin-btn secondary" data-copy-qbank type="button">Prüfbericht kopieren</button></div></div></section>
          <section data-panel="roadmap" class="egt-admin-hidden"><div class="egt-portal-grid"><div class="egt-admin-card"><h3>Roadmap & Status</h3><div data-roadmap-panel>${roadmapHtml()}</div></div><div class="egt-admin-card"><h3>Aufgabenbank Kurzstatus</h3><div data-qbank-quality-summary>${questionBankQualitySummaryHtml()}</div></div></div></section>
        </div>
      </div>`;
    document.body.appendChild(modal);
    modal.addEventListener('click', function(e){ if(e.target===modal) closeModal(); });
    modal.addEventListener('wheel', function(e){ if(!modal.classList.contains('show')) return; var canScroll = modal.scrollHeight > modal.clientHeight + 4; if(canScroll){ modal.scrollTop += e.deltaY; } }, {passive:true});
    // G23.16: iOS/iPadOS scroll assist. Das Portal-Overlay ist die einzige Scrollfläche,
    // damit Fingerziehen im Admin-/Dozenten-Dashboard zuverlässig funktioniert.
    var egtTouchLastY = null;
    modal.addEventListener('touchstart', function(e){
      if(!modal.classList.contains('show')) return;
      var t = e.touches && e.touches[0];
      egtTouchLastY = t ? t.clientY : null;
    }, {passive:true});
    modal.addEventListener('touchmove', function(e){
      if(!modal.classList.contains('show') || egtTouchLastY == null) return;
      var t = e.touches && e.touches[0];
      if(!t) return;
      var dy = egtTouchLastY - t.clientY;
      egtTouchLastY = t.clientY;
      var canScroll = modal.scrollHeight > modal.clientHeight + 4;
      if(canScroll){ modal.scrollTop += dy; }
    }, {passive:true});
    modal.addEventListener('touchend', function(){ egtTouchLastY = null; }, {passive:true});
    document.addEventListener('keydown', function(e){ if(e.key==='Escape'){ var m=document.getElementById('egtAdminModal'); if(m && m.classList.contains('show')) closeModal(); } });
    modal.querySelectorAll('[data-tab]').forEach(function(btn){ btn.onclick=function(){ switchTab(btn.getAttribute('data-tab')); }; });
    function syncCourseInputs(){ var cs=getCourseSettings(); var y=modal.querySelector('[data-course-year]'); if(!y) return; y.value=cs.year; modal.querySelector('[data-course-code]').value=cs.course; modal.querySelector('[data-course-track]').value=cs.track; modal.querySelector('[data-course-digits]').value=cs.digits; var pill=modal.querySelector('[data-current-course]'); if(pill) pill.textContent=cs.prefix+'001'; var sys=modal.querySelector('[data-system-course]'); if(sys) sys.textContent=state.courseId; }
    syncCourseInputs();
    modal.querySelector('[data-login-btn]').onclick=async function(){ var code=String(modal.querySelector('[data-login-code]').value).trim(); var pw=String(modal.querySelector('[data-login-password]').value).trim(); try{ if(!code) throw new Error('Bitte Teilnehmer-ID eingeben.'); setStatus('Login läuft…'); await loginWithCode(code,pw); }catch(e){ setStatus('Fehler: '+(e.message||e)); } };
    modal.querySelector('[data-logout-btn]').onclick=function(){ logout(); setStatus('Teilnehmer abgemeldet.'); };
    modal.querySelector('[data-forgot-password]').onclick=function(){ alert('Passwort vergessen? Bitte Admin oder Dozent kontaktieren. Der Admin kann dein Passwort zurücksetzen.'); };
    modal.querySelectorAll('[data-dozent-unlock]').forEach(function(btn){ btn.onclick=function(){ var card=btn.closest('.egt-admin-card')||modal; var inp=card.querySelector('[data-dozent-pin]')||modal.querySelector('[data-dozent-pin]'); unlockDozent(inp&&inp.value); }; });
    modal.querySelectorAll('[data-demo-dozent-login]').forEach(function(btn){ btn.onclick=function(){
      var id=btn.getAttribute('data-demo-dozent-login');
      var card=btn.closest('.egt-admin-subcard')||modal;
      var inp=card.querySelector('[data-demo-dozent-pin="'+id+'"]');
      var pin=String(inp&&inp.value||'').trim();
      var expected=DEMO_DOZENT_PINS[id];
      if(!expected) return setStatus('Unbekannter Demo-Dozent.');
      if(pin!==expected) return setStatus('Falsche PIN für '+(id==='DOZENT-A'?'Demo Dozent A':'Demo Dozent B')+'.');
      setActiveDozentProfile(id);
      sessionStorage.setItem(DOZENT_OPEN_KEY,'1');
      sessionStorage.setItem(PORTAL_ROLE_KEY,'dozent');
      setStatus('Angemeldet als '+portalDisplayName('dozent')+'.');
      updateRoleUi(); renderDozentStats(); renderDozentLearners(); switchTab('dozent');
    }; });
    modal.querySelectorAll('[data-admin-unlock]').forEach(function(btn){ btn.onclick=function(){ var card=btn.closest('.egt-admin-card')||modal; var inp=card.querySelector('[data-admin-pin]')||modal.querySelector('[data-admin-pin]'); unlockAdmin(inp&&inp.value); }; });
    modal.querySelectorAll('[data-admin-close-portal]').forEach(function(closePortalBtn){
      var doClose=function(e){
        try{ if(e){ e.preventDefault(); e.stopPropagation(); } }catch(_e){}
        closeModal(e);
      };
      closePortalBtn.addEventListener('click', doClose, {passive:false});
      closePortalBtn.addEventListener('touchstart', doClose, {passive:false});
      closePortalBtn.addEventListener('pointerdown', doClose, {passive:false});
    });
    modal.querySelector('[data-admin-full-logout]').onclick=function(){ sessionStorage.removeItem(ADMIN_OPEN_KEY); sessionStorage.removeItem(DOZENT_OPEN_KEY); sessionStorage.removeItem(PORTAL_ROLE_KEY); sessionStorage.removeItem(DOZENT_PROFILE_KEY); closeModal(); setStatus('Portal abgemeldet.'); updateRoleUi(); emit('egt:admin-lock'); };
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
      }
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
        var maxInput=panel.querySelector('[data-access-max-uses]');
        var noteInput=panel.querySelector('[data-access-note]');
        var out=panel.querySelector('[data-access-result]');
        try{
          if(out) out.textContent='Code wird in Firebase erstellt…';
          var r=await createAccessCode({ role:targetRole, groupId:groupInput&&groupInput.value, maxUses:maxInput&&maxInput.value, note:noteInput&&noteInput.value });
          var txt='Code erstellt\n\n'+r.code+'\nRolle: '+roleDisplayValue(r.role)+'\nGruppe: '+(r.groupId||'—')+'\nProvider: '+(r.provider||'firebase-firestore');
          if(out) out.textContent=txt;
          try{ if(navigator.clipboard && navigator.clipboard.writeText) await navigator.clipboard.writeText(r.code); }catch(copyErr){}
          setStatus('Zugangscode erstellt: '+r.code);
          renderAccessCodes(role);
        }catch(err){ if(out) out.textContent='Fehler: '+(err.message||err); setStatus('Fehler: '+(err.message||err)); }
        return;
      }
      var refresh=e.target.closest('[data-refresh-access-codes]');
      if(refresh){ e.preventDefault(); var p=refresh.closest('[data-access-panel]'); var r=(p&&p.getAttribute('data-access-panel'))||currentPortalRole(); renderAccessCodes(r); setStatus('Zugangscodes aktualisiert.'); return; }
      var copy=e.target.closest('[data-copy-access-code]');
      if(copy){ e.preventDefault(); var c=copy.getAttribute('data-copy-access-code')||''; try{ if(navigator.clipboard && navigator.clipboard.writeText){ await navigator.clipboard.writeText(c); setStatus('Code kopiert: '+c); } else { alert(c); } }catch(err2){ setStatus('Code: '+c); } return; }
      var revoke=e.target.closest('[data-revoke-access-code]');
      if(revoke){ e.preventDefault(); var code=revoke.getAttribute('data-revoke-access-code')||''; if(!confirm('Zugangscode widerrufen?\n\n'+code)) return; try{ await revokeAccessCode(code); setStatus('Zugangscode widerrufen: '+code); renderAccessCodes(currentPortalRole()); }catch(err3){ setStatus('Fehler: '+(err3.message||err3)); } return; }
    });
    modal.querySelector('[data-save-course]').onclick=async function(){ if(!adminOpen()) return setStatus('Admin gesperrt.'); var cs=saveCourseSettings({ year:modal.querySelector('[data-course-year]').value, course:modal.querySelector('[data-course-code]').value, track:modal.querySelector('[data-course-track]').value, digits:modal.querySelector('[data-course-digits]').value }); syncCourseInputs(); modal.querySelector('[data-new-learner-code]').value=await nextCode(); setStatus('Kursgruppe gespeichert: '+cs.prefix); renderAdminStats(); renderDozentStats(); };
    modal.querySelector('[data-suggest-code]').onclick=async function(){ if(!adminOpen()) return setStatus('Admin gesperrt.'); modal.querySelector('[data-new-learner-code]').value=await nextCode(); };
    modal.querySelector('[data-create-custom]').onclick=async function(){ if(!adminOpen()) return setStatus('Admin gesperrt.'); try{ var course=getCourseSettings(); var code=modal.querySelector('[data-new-learner-code]').value || await nextCode(); var name=modal.querySelector('[data-display-name]').value; var anon=modal.querySelector('[data-anonymous]').checked; var x=await createLearner({code:code, displayName:name, isAnonymous:anon, course:course.course, year:course.year}); modal.querySelector('[data-new-learner-code]').value=await nextCode(); modal.querySelector('[data-display-name]').value=''; modal.querySelector('[data-anonymous]').checked=true; setCreateResult('Teilnehmer erstellt\n\nID: '+x.code+'\nEinmalpasswort: '+x.firstPassword+'\n\nDieses Passwort wird später nicht mehr angezeigt.'); setStatus('Teilnehmer erstellt: '+x.code); renderLearners(); renderAdminStats(); renderDozentStats(); renderDozentLearners(); }catch(e){ setCreateResult('Fehler: '+(e.message||e)); setStatus('Fehler: '+(e.message||e)); } };
    modal.querySelector('[data-create-demo]').onclick=async function(){ if(!adminOpen()) return setStatus('Admin gesperrt.'); var out=modal.querySelector('[data-demo-result]'); try{ var r=await createDemoLearners(); var text='Demo-Daten bereit\n\nIDs: '+r.created.join(', ')+'\nPasswort für alle: '+r.password; if(r.skipped&&r.skipped.length) text+='\nNicht überschrieben: '+r.skipped.join(', '); if(out) out.textContent=text; setStatus('Demo-Teilnehmer erzeugt: '+r.created.length); renderLearners(); renderAdminStats(); renderDozentStats(); renderDozentLearners(); }catch(e){ if(out) out.textContent='Fehler: '+(e.message||e); setStatus('Fehler: '+(e.message||e)); } };
    modal.querySelector('[data-delete-demo]').onclick=async function(){ if(!adminOpen()) return setStatus('Admin gesperrt.'); if(!confirm('Alle Demo-Teilnehmer löschen? Echte Teilnehmer bleiben erhalten.')) return; var out=modal.querySelector('[data-demo-result]'); try{ var r=await deleteDemoLearners(); if(out) out.textContent='Demo-Daten gelöscht: '+r.removed.join(', '); setStatus('Demo-Teilnehmer gelöscht: '+r.removed.length); renderLearners(); renderAdminStats(); renderDozentStats(); renderDozentLearners(); }catch(e){ if(out) out.textContent='Fehler: '+(e.message||e); setStatus('Fehler: '+(e.message||e)); } };
    modal.querySelector('[data-refresh-learners]').onclick=function(){ if(!adminOpen()) return setStatus('Admin gesperrt.'); renderLearners(); renderAdminStats(); };
    modal.querySelector('[data-export]').onclick=async function(){ if(!adminOpen()) return setStatus('Admin gesperrt.'); await exportCourse(); setStatus('JSON-Export erstellt.'); };
    modal.querySelector('[data-export-csv]').onclick=async function(){ if(!adminOpen()) return setStatus('Admin gesperrt.'); var r=await exportCourseCsv(); setStatus('CSV-Export erstellt. Teilnehmer: '+r.rows); };
    modal.querySelector('[data-reset]').onclick=async function(){ if(!adminOpen()) return setStatus('Admin gesperrt.'); var confirmText=String(modal.querySelector('[data-reset-confirm]').value||'').trim().toUpperCase(); if(confirmText!=='RESET') return setStatus('Zum Kurs-Reset bitte RESET eingeben.'); if(confirm('Wirklich alle Teilnehmerdaten dieses Kurses löschen? Vorher Export empfohlen.')){ var r=await resetCourse(); modal.querySelector('[data-reset-confirm]').value=''; setStatus('Reset erledigt. Gelöscht: '+r.deleted); renderLearners(); renderAdminStats(); renderDozentStats(); renderDozentLearners(); } };
    modal.querySelector('[data-refresh-system]').onclick=function(){ updateRoleUi(); updateSystemDiagnostics(); setStatus('Systemdiagnose aktualisiert.'); };
    var copyDiag=modal.querySelector('[data-copy-diagnostics]'); if(copyDiag) copyDiag.onclick=async function(){ if(!adminOpen()) return setStatus('Nur Admin.'); try{ var txt=await systemDiagnosticsText(); if(navigator.clipboard && navigator.clipboard.writeText){ await navigator.clipboard.writeText(txt); setStatus('Diagnose in die Zwischenablage kopiert.'); } else { alert(txt); } }catch(e){ setStatus('Diagnose konnte nicht kopiert werden: '+(e.message||e)); } };
    modal.querySelector('[data-clear-site-cache]').onclick=function(){ if(!adminOpen()) return setStatus('Nur Admin.'); alert('Cache gezielt löschen: Edge → F12 → Anwendung → Speicher → Websitedaten löschen + Service Worker Registrierung aufheben.'); };
    var refreshQ=modal.querySelector('[data-refresh-qbank]'); if(refreshQ) refreshQ.onclick=function(){ if(!adminOpen()) return setStatus('Nur Admin.'); var q=document.querySelector('[data-qbank-quality]'); if(q) q.innerHTML=questionBankQualityHtml(); var qs=document.querySelector('[data-qbank-quality-summary]'); if(qs) qs.innerHTML=questionBankQualitySummaryHtml();
    updateReportsPanel(); setStatus('Aufgabenbank geprüft.'); };
    var copyQ=modal.querySelector('[data-copy-qbank]'); if(copyQ) copyQ.onclick=async function(){ if(!adminOpen()) return setStatus('Nur Admin.'); var txt=questionBankQualityReportText(); try{ if(navigator.clipboard && navigator.clipboard.writeText){ await navigator.clipboard.writeText(txt); setStatus('Aufgabenbank-Prüfbericht kopiert.'); } else { alert(txt); } }catch(e){ setStatus('Prüfbericht konnte nicht kopiert werden: '+(e.message||e)); } };
    modal.addEventListener('click', async function(e){
      var role=currentPortalRole();
      var btn=e.target.closest('[data-export-report-csv],[data-export-report-json],[data-export-help-csv],[data-export-help-json],[data-copy-report]');
      if(!btn) return;
      e.preventDefault();
      if(!can(role,'exportReports')) return setStatus('Für diese Rolle ist Export nicht erlaubt.');
      var prefix=role==='admin'?'admin-gesamt':'dozent-gruppe';
      if(btn.hasAttribute('data-export-report-csv')){ downloadTextFile('bps-'+prefix+'-bericht-'+reportSafeDate()+'.csv', reportCsv(role,false), 'text/csv;charset=utf-8'); setStatus('CSV-Bericht erstellt.'); }
      else if(btn.hasAttribute('data-export-report-json')){ downloadTextFile('bps-'+prefix+'-bericht-'+reportSafeDate()+'.json', reportJson(role,false), 'application/json;charset=utf-8'); setStatus('JSON-Bericht erstellt.'); }
      else if(btn.hasAttribute('data-export-help-csv')){ downloadTextFile('bps-'+prefix+'-hilfebedarf-'+reportSafeDate()+'.csv', reportCsv(role,true), 'text/csv;charset=utf-8'); setStatus('Hilfebedarf-CSV erstellt.'); }
      else if(btn.hasAttribute('data-export-help-json')){ downloadTextFile('bps-'+prefix+'-hilfebedarf-'+reportSafeDate()+'.json', reportJson(role,true), 'application/json;charset=utf-8'); setStatus('Hilfebedarf-JSON erstellt.'); }
      else if(btn.hasAttribute('data-copy-report')){ var txt=reportText(role); try{ if(navigator.clipboard && navigator.clipboard.writeText){ await navigator.clipboard.writeText(txt); setStatus('Bericht kopiert.'); } else { alert(txt); } }catch(err){ setStatus('Bericht konnte nicht kopiert werden: '+(err.message||err)); } }
    });

    updateRoleUi();
  }

  function openModal(){
    var m=document.getElementById('egtAdminModal');
    if(m){
      bodySheetLock(true);
      m.classList.add('show');
      m.setAttribute('aria-hidden','false');
      setTimeout(sheetToTop, 25);
      updateUI(); updateRoleUi(); renderDozentStats(); renderDozentLearners();
      var startTab=defaultPortalTabForSession();
      if(startTab!=='login') switchTab(startTab);
      if(adminOpen()) nextCode().then(function(c){ var inp=m.querySelector('[data-new-learner-code]'); if(inp && !inp.value) inp.value=c; });
      renderLearners(); renderAdminStats();
    }
  }
  function closeModal(e){ try{ if(e && e.cancelable) e.preventDefault(); if(e) e.stopPropagation(); }catch(_e){} var m=document.getElementById('egtAdminModal'); if(m){ m.classList.remove('show'); m.setAttribute('aria-hidden','true'); } bodySheetLock(false); try{ document.documentElement.classList.remove('egt-admin-sheet-open'); document.body.classList.remove('egt-admin-sheet-open'); }catch(_e2){} }
  function switchTab(tab){
    var m=document.getElementById('egtAdminModal'); if(!m) return;
    var role=currentPortalRole();
    if(role==='locked' && tab!=='login') tab='login';
    if(tab==='login' && roleSessionActive()) tab=defaultPortalTabForSession();
    if(role==='dozent' && !(tab==='dozent' || tab==='reports')) tab='dozent';
    if((tab==='system' || tab==='roadmap' || tab==='qbank') && role!=='admin'){
      setStatus(lockedTextFor(tab));
      tab = role==='dozent' ? 'dozent' : 'login';
    }
    m.querySelectorAll('[data-tab]').forEach(function(b){
      var key=b.getAttribute('data-tab');
      var visible=!b.classList.contains('egt-admin-hidden');
      var locked=!visible;
      b.classList.toggle('active', key===tab);
      b.disabled=locked;
      b.classList.toggle('locked', locked);
      if(locked) b.setAttribute('title', 'Für diese Rolle nicht sichtbar.'); else b.removeAttribute('title');
    });
    m.querySelectorAll('[data-panel]').forEach(function(p){ p.classList.toggle('egt-admin-hidden', p.getAttribute('data-panel')!==tab); });
    if(tab==='admin'){ renderLearners(); renderAdminStats(); renderAccessCodes('admin'); }
    if(tab==='dozent'){ renderDozentStats(); renderDozentLearners(); if(role==='dozent') renderAccessCodes('dozent'); }
    if(tab==='system'){ updateSystemDiagnostics(); }
    if(tab==='reports'){ updateReportsPanel(); }
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
  function objTotal(obj){ return Object.keys(obj||{}).reduce(function(a,k){return a+Number(obj[k]||0);},0); }
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
    return '<div class="egt-qbank-summary"><span class="egt-admin-pill '+qbankToneFor(a.status)+'">'+escapeHtml(a.status)+'</span><b>'+a.total+' Aufgaben</b><small>'+a.score+'% Qualitätswert · '+a.issueTotal+' Hinweise</small></div>';
  }
  function questionBankQualityReportText(){
    var a=qbankDeepAudit();
    var lines=[];
    lines.push('BPS Trainer · G33.5 Aufgabenbank-Qualitätsprüfung');
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
  function questionBankQualityHtml(){
    var a=qbankDeepAudit();
    var tone=qbankToneFor(a.status);
    var criticalText = a.critical ? (a.critical+' kritisch') : '0 kritisch';
    var fachText = a.fachIssues.length ? (a.fachIssues.length+' Fachhinweise') : 'Fachregeln OK';
    return '<div class="egt-qbank-panel">'
      +'<div class="egt-qbank-head"><div><span class="egt-session-kicker">Aufgabenbank</span><h3>Qualitätsprüfung</h3><p>Prüft Schema, Lösungen, Antwortoptionen, Dubletten, Fachgruppen und Metadaten.</p></div><div class="egt-qbank-score '+tone+'"><b>'+a.score+'%</b><span>'+escapeHtml(a.status)+'</span></div></div>'
      +'<div class="egt-admin-stat-grid egt-qbank-stats"><div><b>'+a.total+'</b><span>Aufgaben</span></div><div><b>'+a.issueTotal+'</b><span>Hinweise</span></div><div><b>'+criticalText+'</b><span>kritische Punkte</span></div><div><b>'+fachText+'</b><span>Fachlogik</span></div></div>'
      +'<div class="egt-portal-grid egt-qbank-grid"><div class="egt-admin-subcard"><strong>Fachgruppen</strong>'+qbankBars(a.byGroup,10)+'</div><div class="egt-admin-subcard"><strong>Schwierigkeit</strong>'+qbankBars(a.byDifficulty,8)+'</div></div>'
      +'<div class="egt-admin-subcard"><strong>Hinweisarten</strong><div class="egt-qbank-pills">'+issuePills(a.issueCounts)+'</div></div>'
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
  async function renderAdminStats(){
    var dash=document.querySelector('[data-admin-dashboard]');
    var box=document.querySelector('[data-admin-stats]'); if(!box && !dash) return;
    if(!adminOpen()){ if(box) box.textContent=adminLockedText(); if(dash) dash.innerHTML=''; return; }
    try{
      if(dash) dash.innerHTML=portalDashboardHtml('admin');
      var st=await courseStats();
      if(box) box.innerHTML='<div class="egt-admin-stat-grid"><div><b>'+st.total+'</b><span>Teilnehmer</span></div><div><b>'+st.active+'</b><span>aktiv</span></div><div><b>'+st.mustChange+'</b><span>Einmalpasswort</span></div><div><b>'+st.avgAccuracy+'%</b><span>Ø Quote</span></div></div><div style="margin-top:10px"><span class="egt-admin-pill">stabil · '+st.stable+'</span><span class="egt-admin-pill">riskant · '+st.riskant+'</span><span class="egt-admin-pill">kritisch · '+st.kritisch+'</span><span class="egt-admin-pill">unbekannt · '+st.unknown+'</span><span class="egt-admin-pill">Versuche · '+st.attempts+'</span></div>';
    }catch(e){ if(box) box.textContent='Fehler: '+(e.message||e); }
  }

  async function renderLearners(){
    var box=document.querySelector('[data-learner-list]'); if(!box) return; if(!adminOpen()){ box.textContent='Admin gesperrt.'; return; } box.textContent='Lade Teilnehmer…';
    try{ var list=await listLearners(); if(!list.length){ box.textContent='Noch keine Teilnehmer.'; return; }
      box.innerHTML=list.map(function(x){ var userId=normalizeCode(x.userId||x.code||x.loginName||x.id); var pr=profileProgress(x); var status=x.status||'active'; var action=status==='active'?'Deaktivieren':'Aktivieren'; var nextStatus=status==='active'?'inactive':'active'; return '<div class="egt-admin-learner"><strong>'+escapeHtml(x.displayName||x.alias||userId)+'</strong> <span class="egt-admin-pill">'+escapeHtml(status)+'</span><span class="egt-admin-pill">'+escapeHtml(pr.risk)+'</span>'+(x.isDemo?'<span class="egt-admin-pill">Demo</span>':'')+'<div class="egt-admin-kv"><b>ID</b><span>'+escapeHtml(userId)+'</span><b>Passwort</b><span>'+(x.mustChangePassword?'Einmalpasswort aktiv':'geändert')+'</span><b>Quote</b><span>'+pr.accuracy+'% · '+pr.correct+'/'+pr.answered+'</span><b>Letzte Aktivität</b><span>'+escapeHtml(x.lastActiveAt||'-')+'</span></div><div class="egt-admin-progress">'+moduleSummaryHtml(x)+'</div><div class="egt-admin-row"><button class="egt-admin-btn secondary" data-copy-code="'+escapeHtml(userId)+'">ID kopieren</button><button class="egt-admin-btn secondary" data-reset-pass="'+escapeHtml(userId)+'">Passwort zurücksetzen</button><button class="egt-admin-btn secondary" data-set-status="'+escapeHtml(userId)+'" data-next-status="'+escapeHtml(nextStatus)+'">'+action+'</button><button class="egt-admin-btn danger" data-delete="'+escapeHtml(userId)+'">Löschen</button></div></div>'; }).join('');
      box.querySelectorAll('[data-copy-code]').forEach(function(b){ b.onclick=async function(){ var c=b.getAttribute('data-copy-code')||''; try{ await navigator.clipboard.writeText(c); setStatus('ID kopiert: '+c); }catch(e){ setStatus('ID: '+c); } }; });
      box.querySelectorAll('[data-reset-pass]').forEach(function(b){ b.onclick=async function(){ try{ var r=await resetPassword(b.getAttribute('data-reset-pass')); setStatus('Passwort zurückgesetzt: '+r.userId); alert('Neues Einmalpasswort für '+r.userId+':\n\n'+r.firstPassword+'\n\nDer Teilnehmer muss beim nächsten Login ein neues Passwort setzen.'); renderLearners(); renderAdminStats(); }catch(e){ setStatus('Fehler: '+(e.message||e)); } }; });
      box.querySelectorAll('[data-set-status]').forEach(function(b){ b.onclick=async function(){ await setLearnerStatus(b.getAttribute('data-set-status'), b.getAttribute('data-next-status')||'inactive'); renderLearners(); renderAdminStats(); }; });
      box.querySelectorAll('[data-delete]').forEach(function(b){ b.onclick=async function(){ if(confirm('Teilnehmer wirklich löschen?')){ await deleteLearner(b.getAttribute('data-delete')); renderLearners(); renderAdminStats(); } }; });
    }catch(e){ box.textContent='Fehler: '+(e.message||e); }
  }

  function showPasswordChange(code){
    var old=document.getElementById('egtPasswordChangeModal'); if(old) old.remove();
    var m=document.createElement('div'); m.id='egtPasswordChangeModal'; m.className='egt-admin-modal show';
    m.innerHTML='<div class="egt-admin-panel egt-password-panel"><div class="egt-sheet-handle" aria-hidden="true"></div><div class="egt-admin-head"><div><h2>Willkommen</h2><p>Login erfolgreich. Bitte vergib jetzt ein neues Passwort.</p></div></div><div class="egt-admin-body"><div class="egt-admin-card"><input class="egt-admin-input" data-new-pass type="password" placeholder="Neues Passwort" autocomplete="new-password"><input class="egt-admin-input" data-new-pass-2 type="password" placeholder="Neues Passwort bestätigen" autocomplete="new-password"><div class="egt-admin-status" data-pass-status>Mindestens 8 Zeichen.</div><div class="egt-admin-row"><button class="egt-admin-btn" data-save-pass>Passwort speichern</button></div></div></div></div>';
    document.body.appendChild(m);
    m.querySelector('[data-save-pass]').onclick=async function(){ var p1=m.querySelector('[data-new-pass]').value; var p2=m.querySelector('[data-new-pass-2]').value; var st=m.querySelector('[data-pass-status]'); try{ if(p1!==p2) throw new Error('Die Passwörter stimmen nicht überein.'); await changePassword(code,p1); m.remove(); closeModal(); }catch(e){ st.textContent='Fehler: '+(e.message||e); } };
  }


  if(!window.__EGT_USERDB_SYNC_LISTENERS__){
    window.__EGT_USERDB_SYNC_LISTENERS__=true;
    window.addEventListener('online', function(){ state.ready=false; init().then(function(){ return flushPendingSync(); }).catch(function(e){ state.error=e.message||String(e); }); });
    window.addEventListener('offline', function(){ state.online=false; state.error='Offline · lokaler Cache aktiv'; emit('egt:sync-status', syncStatus()); });
  }

  /* ============================================================
     DUELL-CLOUD · Online-Duelle über Firestore.
     Dokumente unter courses/{courseId}/duels/{CODE}. Nutzt die
     bestehende loadSync/signIn/docRef-Plumbing inkl. Offline-Fehler.
     ============================================================ */
  function duellMakeCode(){ var chars='ABCDEFGHJKLMNPQRSTUVWXYZ23456789', c=''; for(var i=0;i<6;i++) c+=chars[Math.floor(Math.random()*chars.length)]; return c; }
  function duellPath(code){ return 'courses/'+state.courseId+'/duels/'+code; }
  function snapExists(snap){ return typeof snap.exists==='function' ? snap.exists() : !!snap.exists; }
  async function duellCreate(payload){
    payload=payload||{};
    await loadSync(); await signIn();
    for(var attempt=0; attempt<5; attempt++){
      var code=duellMakeCode();
      var ref=docRef(duellPath(code));
      var snap=await state.sync.fsMod.getDoc(ref);
      if(snapExists(snap)) continue;
      var doc={
        code:code, status:'waiting', createdAt:nowIso(), expiresAt:Date.now()+2*60*60*1000,
        host:{ name:String(payload.hostName||'Spieler 1').slice(0,18) },
        guest:null,
        quiz:JSON.stringify(payload.quiz||[]),
        results:{}
      };
      await state.sync.fsMod.setDoc(ref, doc);
      return { code:code };
    }
    throw new Error('Kein freier Duell-Code verfügbar. Bitte erneut versuchen.');
  }
  async function duellJoin(code, payload){
    payload=payload||{};
    await loadSync(); await signIn();
    code=String(code||'').trim().toUpperCase();
    if(!/^[A-Z0-9]{6}$/.test(code)) throw new Error('Ungültiger Duell-Code (6 Zeichen).');
    var ref=docRef(duellPath(code));
    var snap=await state.sync.fsMod.getDoc(ref);
    if(!snapExists(snap)) throw new Error('Duell-Code nicht gefunden.');
    var d=snap.data();
    if(d.expiresAt && Date.now()>d.expiresAt) throw new Error('Dieses Duell ist abgelaufen.');
    if(d.guest && d.guest.name) throw new Error('Diesem Duell ist bereits ein Gegner beigetreten.');
    var guest={ name:String(payload.name||'Spieler 2').slice(0,18), joinedAt:nowIso() };
    await state.sync.fsMod.setDoc(ref, { guest:guest, status:'active' }, { merge:true });
    var quiz=[]; try{ quiz=JSON.parse(d.quiz||'[]'); }catch(e){}
    if(!quiz.length) throw new Error('Duell-Daten unvollständig.');
    return { code:code, host:d.host||{name:'Spieler 1'}, quiz:quiz };
  }
  async function duellSubmit(code, role, result){
    await loadSync(); await signIn();
    code=String(code||'').trim().toUpperCase();
    role=role==='guest'?'guest':'host';
    var patch={ results:{} };
    patch.results[role]=Object.assign({ finishedAt:nowIso() }, result||{});
    await state.sync.fsMod.setDoc(docRef(duellPath(code)), patch, { merge:true });
    return true;
  }
  async function duellFetch(code){
    await loadSync(); await signIn();
    code=String(code||'').trim().toUpperCase();
    var snap=await state.sync.fsMod.getDoc(docRef(duellPath(code)));
    if(!snapExists(snap)) throw new Error('Duell nicht gefunden.');
    var d=snap.data();
    return { code:d.code, status:d.status, host:d.host, guest:d.guest, results:d.results||{} };
  }

  window.EGTAdminPortal = { status:"bereit", init:init, state:snapshot, loginWithCode:loginWithCode, logout:logout, createLearner:createLearner, listLearners:listLearners, deleteLearner:deleteLearner, setLearnerStatus:setLearnerStatus, exportCourse:exportCourse, exportCourseCsv:exportCourseCsv, resetCourse:resetCourse, courseStats:courseStats, getCourseSettings:getCourseSettings, saveCourseSettings:saveCourseSettings, trackEvent:trackEvent, enrichCoachPayload:enrichCoachPayload, loadCoachContext:loadCoachContext, open:openModal, close:closeModal, riskFromProfile:riskFromProfile, coachDnaSnapshot:coachDnaSnapshot, nextCode:nextCode, resetPassword:resetPassword, changePassword:changePassword, createAccessCode:createAccessCode, listAccessCodes:listAccessCodes, revokeAccessCode:revokeAccessCode, generatePassword:generatePassword, hashPassword:hashPassword, verifyPassword:verifyPassword, isAdminOpen:adminOpen, isDozentOpen:dozentOpen, currentRole:currentPortalRole, can:can, canViewLearner:canViewLearner, canViewGroup:canViewGroup, activeDozentProfile:activeDozentProfile, setActiveDozentProfile:setActiveDozentProfile, createDemoLearners:createDemoLearners, deleteDemoLearners:deleteDemoLearners, syncStatus:syncStatus, flushPendingSync:flushPendingSync, duellCreate:duellCreate, duellJoin:duellJoin, duellSubmit:duellSubmit, duellFetch:duellFetch };
  window.EGTUserDatabase = { provider:'firebase-firestore', init:init, state:snapshot, getSession:getSession, setSession:setSession, logout:logout, redeemAccessCode:redeemAccessCode, createProfile:saveProfile, updateProfile:saveProfile, loadCoachContext:loadCoachContext, trackEvent:trackEvent, saveProfile:saveProfile, fetchProfile:fetchProfile, fetchAccessCode:fetchAccessCode, createAccessCode:createAccessCode, listAccessCodes:listAccessCodes, revokeAccessCode:revokeAccessCode, listLearners:listLearners, getRole:getRole, getGroup:getGroup, syncStatus:syncStatus, flushPendingSync:flushPendingSync, queuePendingSync:queuePendingSync, get activeProfile(){ return state.profile; }, get activeLearner(){ return state.learner; } };
  window.EGTPhase2Health = { required:['createLearner','loginWithCode','changePassword','resetPassword','nextCode','trackEvent','loadCoachContext'], storageKeys:{ profiles:LOCAL_KEY, active:ACTIVE_KEY, adminOpen:ADMIN_OPEN_KEY }, get activeLearner(){ return state.learner && state.learner.userId || ''; }, get provider(){ return snapshot().provider; } };
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
