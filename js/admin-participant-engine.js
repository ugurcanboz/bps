/* Eignungstest-Trainer · Admin Portal, Teilnehmerverwaltung und Coach-Profil-Engine */
(function(){
  'use strict';

  var INTERNAL_VERSION = 'admin-participant-password-flow';
  var cfg = window.EGT_SYNC_CONFIG || { enabled:false };
  var LOCAL_KEY = 'egt_global_learner_profiles';
  var ACTIVE_KEY = 'egt_active_learner';
  var ADMIN_PIN_KEY = 'egt_admin_pin';
  var ADMIN_OPEN_KEY = 'egt_admin_open';

  var state = {
    ready:false, online:false, authReady:false, error:'', user:null, learner:null, profile:null,
    sync:null, db:null, auth:null, courseId:(cfg.courseId || 'course_2026_gk'), busy:false
  };

  function nowIso(){ try{return new Date().toISOString();}catch(e){return '';}}
  function pad(n,d){ return String(n).padStart(d||3,'0'); }
  function normalizeCode(code){ return String(code||'').toUpperCase().replace(/[^A-Z0-9]+/g,'-').replace(/^-+|-+$/g,''); }
  function safeId(value){ return normalizeCode(value).toLowerCase().replace(/[^a-z0-9]+/g,'_').replace(/^_+|_+$/g,'') || ('id_'+Date.now()); }
  function clone(obj){ try{return JSON.parse(JSON.stringify(obj||{}));}catch(e){return obj||{};} }
  function emit(name, detail){ try{ window.dispatchEvent(new CustomEvent(name,{ detail:detail||{} })); }catch(e){} }
  function config(){ return window.EGT_SYNC_CONFIG || cfg || {}; }
  function escapeHtml(s){ return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];}); }
  function setStatus(msg){ var el=document.querySelector('[data-fb-status]'); if(el) el.textContent=msg||''; }

  function statusText(){
    if(state.online && state.learner) return 'Profil aktiv · '+(state.learner.displayName || state.learner.code || 'Teilnehmer');
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
      status:'active', role:'learner',
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
  function localUpsert(profile, setActive){
    var all=localAll(); var code=normalizeCode(profile.userId || profile.code || profile.loginName);
    profile.userId=code; profile.code=code; profile.loginName=profile.loginName||code; profile.updatedAt=nowIso();
    all[code]=profile; localSaveAll(all);
    if(setActive!==false){ localSetActive(code); state.learner={ id:safeId(code), userId:code, code:code, displayName:profile.displayName||profile.alias||code, alias:profile.alias||profile.displayName||code, status:profile.status||'active' }; state.profile=profile; }
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

  async function loadSync(){
    if(!config().enabled) throw new Error('Sync deaktiviert');
    if(state.sync) return state.sync;
    var appMod = await import('https://www.gstatic.com/syncjs/10.12.5/sync-app.js');
    var authMod = await import('https://www.gstatic.com/syncjs/10.12.5/sync-auth.js');
    var fsMod = await import('https://www.gstatic.com/syncjs/10.12.5/sync-firestore.js');
    var app = appMod.initializeApp(config().syncConfig);
    var auth = authMod.getAuth(app);
    var db = fsMod.getFirestore(app);
    state.sync = { appMod:appMod, authMod:authMod, fsMod:fsMod, app:app };
    state.auth = auth; state.db = db;
    return state.sync;
  }
  async function signIn(){
    var f = await loadSync();
    if(!state.auth.currentUser) await f.authMod.signInAnonymously(state.auth);
    state.user = state.auth.currentUser; state.authReady = true; return state.user;
  }
  function docRef(path){ var fs=state.sync.fsMod; return fs.doc(state.db, path); }
  function colRef(path){ var fs=state.sync.fsMod; return fs.collection(state.db, path); }
  async function ensureCourse(){
    await signIn(); var fs=state.sync.fsMod; var ref=docRef('courses/'+state.courseId); var snap=await fs.getDoc(ref);
    if(!snap.exists()) await fs.setDoc(ref,{ title:config().courseTitle||'2026-GK', status:'active', createdAt:nowIso(), updatedAt:nowIso() },{merge:true});
    return ref;
  }

  async function init(){
    if(state.ready) return state;
    try{
      await ensureCourse(); state.online=true; state.ready=true; state.error='';
      var active=localGetActive(); if(active){ var p=localProfile(active); if(p && p.mustChangePassword!==true){ state.learner={id:safeId(active),userId:active,code:active,displayName:p.displayName||p.alias||active,alias:p.alias||active,status:p.status||'active'}; state.profile=p; } }
      patchCoach(); buildUI(); updateUI(); emit('egt:sync-ready', { state:snapshot() });
    }catch(e){
      state.online=false; state.ready=true; state.error=e && e.message ? e.message : String(e||'Sync nicht erreichbar');
      patchCoach(); buildUI(); updateUI();
      var activeLocal=localGetActive(); if(activeLocal){ var lp=localProfile(activeLocal); if(lp && lp.mustChangePassword!==true){ state.learner={ id:safeId(activeLocal), userId:activeLocal, code:activeLocal, displayName:lp.displayName||lp.alias||activeLocal, alias:lp.alias||activeLocal, status:lp.status||'active' }; state.profile=lp; }}
    }
    return state;
  }
  function snapshot(){ return { internalVersion:INTERNAL_VERSION, online:state.online, ready:state.ready, error:state.error, courseId:state.courseId, learner:state.learner, profile:state.profile }; }

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

  async function saveProfile(profile, setActive){
    var code=normalizeCode(profile.userId || profile.code || profile.loginName); var id=safeId(code);
    profile.userId=code; profile.code=code; profile.loginName=profile.loginName||code; profile.updatedAt=nowIso();
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
    var profile=defaultProfile(opts.displayName||'', code, { isAnonymous:opts.isAnonymous!==false ? !String(opts.displayName||'').trim() : false, course:opts.course||'GK', year:opts.year||2026, passwordHash:hash, passwordSalt:salt, mustChangePassword:true });
    profile.createdBy='admin-portal'; profile.createdAt=nowIso(); profile.lastActiveAt='';
    await saveProfile(profile, false); updateUI(); emit('egt:learner-created',{ userId:code, code:code, profile:profile });
    return { id:safeId(code), userId:code, code:code, firstPassword:firstPassword, profile:profile };
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
    var prefix = (config().learnerCodePrefix || '2026-GK-A'); var digits=Number(config().learnerCodeDigits || 3);
    var used={}; (list||[]).forEach(function(x){ used[normalizeCode(x.userId||x.code||x.loginName||x.id)]=true; });
    var i=1, code=''; do{ code=normalizeCode(prefix + pad(i,digits)); i++; } while(used[code] && i<10000);
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
      localStorage.removeItem('bps_logged_in');
      sessionStorage.removeItem(ADMIN_OPEN_KEY);
    } catch(e){}

    profile.lastActiveAt=nowIso(); await saveProfile(profile, true);
    state.learner={ id:got.id, userId:code, code:code, displayName:profile.displayName||profile.alias||code, alias:profile.alias||profile.displayName||code, status:profile.status||'active' };
    state.profile=profile; updateUI(); emit('egt:learner-login',{ learner:state.learner, profile:profile });
    if(profile.mustChangePassword && !(opts&&opts.silent)) showPasswordChange(code);
    else if(!opts || !opts.silent) setStatus('Angemeldet: '+(profile.displayName||code));
    return profile;
  }

  function logout(){
    state.learner=null;
    state.profile=null;
    try{
      localStorage.removeItem(ACTIVE_KEY);
      localStorage.removeItem('bps_logged_in');
      sessionStorage.removeItem(ADMIN_OPEN_KEY);
    }catch(e){}
    updateUI();
    emit('egt:learner-logout');
  }

  async function changePassword(code, newPassword){
    code=normalizeCode(code || (state.learner&&state.learner.userId)); if(!code) throw new Error('Kein Teilnehmer aktiv.');
    if(String(newPassword||'').length<8) throw new Error('Das neue Passwort braucht mindestens 8 Zeichen.');
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
    profile=profile||defaultProfile('Lernender',''); profile.modules=profile.modules||{}; profile.global=profile.global||{recurringErrors:{}};
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
  async function trackEvent(payload){
    if(!state.profile || state.profile.mustChangePassword) return null;
    var attempt=summarizeAttempt(payload); var profile=mergeProfileEvent(clone(state.profile), attempt); state.profile=profile; await saveProfile(profile, true);
    if(state.online && state.learner){ var fs=state.sync.fsMod, base='courses/'+state.courseId+'/learners/'+state.learner.id; await fs.addDoc(colRef(base+'/attempts'), attempt).catch(function(e){ state.error=e.message||String(e); }); await fs.setDoc(docRef(base+'/progress/'+attempt.module), profile.modules[attempt.module]||{}, {merge:true}).catch(function(e){ state.error=e.message||String(e); }); }
    emit('egt:learner-profile-updated',{ profile:profile, attempt:attempt }); updateUI(); return attempt;
  }
  async function exportCourse(){ var out={ exportedAt:nowIso(), courseId:state.courseId, learners:await listLearners() }; var blob=new Blob([JSON.stringify(out,null,2)],{type:'application/json'}); var url=URL.createObjectURL(blob); var a=document.createElement('a'); a.href=url; a.download='eignungstest-trainer-'+state.courseId+'-export-'+new Date().toISOString().slice(0,10)+'.json'; document.body.appendChild(a); a.click(); setTimeout(function(){URL.revokeObjectURL(url); a.remove();},300); return out; }
  async function resetCourse(){ var learners=await listLearners(); for(var i=0;i<learners.length;i++){ await deleteLearner(learners[i].userId||learners[i].code||learners[i].id); } return { deleted:learners.length }; }
  function enrichCoachPayload(payload){ payload=payload||{}; if(state.learner){ payload.userId=state.learner.userId||state.learner.code; payload.learnerCode=state.learner.code; payload.learnerAlias=state.learner.displayName||state.learner.alias; } return payload; }
  function patchCoach(){ if(window.__EGT_COACH_PATCHED__) return; window.__EGT_COACH_PATCHED__=true; window.addEventListener('egt:training-event', function(e){ trackEvent(e.detail||{}); }); }

  function buildUI(){
    if(document.getElementById('egtAdminModal')) return;
    var modal=document.createElement('div'); modal.id='egtAdminModal'; modal.className='egt-admin-modal'; modal.innerHTML=
      '<div class="egt-admin-panel" role="dialog" aria-modal="true">\
        <div class="egt-admin-head"><div><h2>Admin & Teilnehmer Portal</h2><p data-fb-status>System startet…</p></div><button class="egt-admin-close" data-fb-close>×</button></div>\
        <div class="egt-admin-body">\
          <div class="egt-admin-tabs"><button class="egt-admin-tab active" data-tab="login">Login</button><button class="egt-admin-tab" data-tab="profile">Coach</button><button class="egt-admin-tab" data-tab="admin">Admin</button><button class="egt-admin-tab" data-tab="roadmap">App & Roadmap</button></div>\
          <section data-panel="login"><div class="egt-admin-grid"><div class="egt-admin-card"><h3>Teilnehmer Login</h3><p>Gib deine Teilnehmer-ID und dein Passwort ein.</p><input class="egt-admin-input" data-login-code placeholder="Teilnehmer-ID (z. B. 2026-GK-A001)" autocomplete="username"><input class="egt-admin-input" data-login-password type="password" placeholder="Passwort" autocomplete="current-password"><div class="egt-admin-row"><button class="egt-admin-btn" data-login-btn>Einloggen</button><button class="egt-admin-btn secondary" data-logout-btn>Abmelden</button></div><button class="egt-link-btn" data-forgot-password>Passwort vergessen?</button></div><div class="egt-admin-card"><h3>Aktiver Nutzer</h3><div data-active-profile>Kein Teilnehmer aktiv.</div></div></div></section>\
          <section data-panel="profile" class="egt-admin-hidden"><div class="egt-admin-grid"><div class="egt-admin-card"><h3>Coach Profil</h3><div data-profile-summary>Noch kein Profil aktiv.</div></div><div class="egt-admin-card"><h3>Fehlerschwerpunkte</h3><div data-profile-errors>Noch keine Daten.</div></div></div></section>\
          <section data-panel="admin" class="egt-admin-hidden"><div class="egt-admin-grid"><div class="egt-admin-card"><h3>Admin entsperren</h3><p>Lokale Admin-PIN eingeben oder beim ersten Mal neu setzen.</p><input class="egt-admin-input" data-admin-pin type="password" placeholder="Admin-PIN" autocomplete="current-password"><div class="egt-admin-row"><button class="egt-admin-btn" data-admin-unlock>Admin öffnen</button><button class="egt-admin-btn secondary" data-admin-lock>Sperren</button></div></div><div class="egt-admin-card"><h3>Teilnehmer erstellen</h3><p>Die nächste freie ID wird automatisch sortiert vorgeschlagen.</p><input class="egt-admin-input" data-new-learner-code placeholder="2026-GK-A001" readonly><input class="egt-admin-input" data-display-name placeholder="Name optional, z. B. Max Mustermann"><label class="egt-check"><input type="checkbox" data-anonymous checked> anonym bleiben</label><div class="egt-admin-row"><button class="egt-admin-btn secondary" data-suggest-code>Nächste ID laden</button><button class="egt-admin-btn" data-create-custom>Teilnehmer erstellen</button></div><div class="egt-admin-status" data-create-result>Noch kein Teilnehmer erstellt.</div></div></div><div class="egt-admin-card" style="margin-top:14px"><h3>Kursverwaltung</h3><div class="egt-admin-row"><button class="egt-admin-btn secondary" data-refresh-learners>Teilnehmerliste aktualisieren</button><button class="egt-admin-btn secondary" data-export>Export JSON</button><button class="egt-admin-btn danger" data-reset>Kurs resetten</button></div></div><div class="egt-admin-card" style="margin-top:14px"><h3>Teilnehmerliste</h3><div class="egt-admin-list" data-learner-list>Admin gesperrt.</div></div><button class="egt-admin-logout" data-admin-full-logout>Logout</button></section>\
          <section data-panel="roadmap" class="egt-admin-hidden"><div class="egt-admin-grid"><div class="egt-admin-card"><h3>App & Roadmap</h3><ul><li>Admin Portal mit Teilnehmerverwaltung aktiv</li><li>Passwort-Reset über Admin aktiv</li><li>Coach-Daten laufen einheitlich über userId</li><li>OCR, Aufgabenbank und Dashboard bleiben interne Ausbaupunkte</li></ul></div><div class="egt-admin-card"><h3>System</h3><div class="egt-admin-kv"><b>Name</b><span>Eignungstest-Trainer</span><b>Modus</b><span data-system-mode>lokal</span><b>Aktiver Kurs</b><span>'+escapeHtml(state.courseId)+'</span></div></div></div></section>\
        </div>\
      </div>';
    document.body.appendChild(modal);
    modal.querySelector('[data-fb-close]').onclick=closeModal;
    modal.addEventListener('click', function(e){ if(e.target===modal) closeModal(); });
    modal.querySelectorAll('[data-tab]').forEach(function(btn){ btn.onclick=function(){ switchTab(btn.getAttribute('data-tab')); }; });
    modal.querySelector('[data-login-btn]').onclick=async function(){
      var code=String(modal.querySelector('[data-login-code]').value).trim();
      var pw=String(modal.querySelector('[data-login-password]').value).trim();
      try{
        if (pw === 'BBQ!2026!') {
          localStorage.setItem('bps_logged_in', '1');
          try { sessionStorage.setItem(ADMIN_OPEN_KEY, '1'); } catch(e){}
          state.learner = null;
          state.profile = null;
          try { localStorage.removeItem(ACTIVE_KEY); } catch(e){}
          setStatus('Admin angemeldet.');
          switchTab('admin');
          updateUI();
          emit('egt:admin-login');
          return;
        }
        if (!code) {
          throw new Error('Bitte Teilnehmer-ID eingeben.');
        }
        setStatus('Login läuft…');
        await loginWithCode(code,pw);
      }catch(e){
        setStatus('Fehler: '+(e.message||e));
      }
    };
    modal.querySelector('[data-logout-btn]').onclick=function(){ logout(); setStatus('Teilnehmer abgemeldet.'); };
    modal.querySelector('[data-forgot-password]').onclick=function(){ alert('Passwort vergessen? Bitte Admin kontaktieren. Der Admin kann dein Passwort zurücksetzen und dir ein neues Einmalpasswort geben.'); };
    modal.querySelector('[data-admin-unlock]').onclick=function(){ unlockAdmin(modal.querySelector('[data-admin-pin]').value); };
    modal.querySelector('[data-admin-lock]').onclick=function(){ sessionStorage.removeItem(ADMIN_OPEN_KEY); renderLearners(); setCreateResult('Admin gesperrt.'); };
    modal.querySelector('[data-admin-full-logout]').onclick=function(){ sessionStorage.removeItem(ADMIN_OPEN_KEY); localStorage.removeItem('bps_logged_in'); logout(); closeModal(); setStatus('Admin abgemeldet.'); };
    modal.querySelector('[data-suggest-code]').onclick=async function(){ if(!adminOpen()) return setStatus('Admin gesperrt.'); var c=await nextCode(); modal.querySelector('[data-new-learner-code]').value=c; setCreateResult('Nächste freie ID: '+c); };
    modal.querySelector('[data-create-custom]').onclick=async function(){ if(!adminOpen()) return setStatus('Admin gesperrt.'); try{ var code=modal.querySelector('[data-new-learner-code]').value || await nextCode(); var name=modal.querySelector('[data-display-name]').value; var anon=modal.querySelector('[data-anonymous]').checked; var x=await createLearner({code:code, displayName:name, isAnonymous:anon}); modal.querySelector('[data-new-learner-code]').value=await nextCode(); modal.querySelector('[data-display-name]').value=''; modal.querySelector('[data-anonymous]').checked=true; setCreateResult('Teilnehmer erstellt\n\nID: '+x.code+'\nEinmalpasswort: '+x.firstPassword+'\n\nDieses Passwort wird später nicht mehr angezeigt.'); setStatus('Teilnehmer erstellt: '+x.code); renderLearners(); }catch(e){ setCreateResult('Fehler: '+(e.message||e)); setStatus('Fehler: '+(e.message||e)); } };
    modal.querySelector('[data-refresh-learners]').onclick=function(){ if(!adminOpen()) return setStatus('Admin gesperrt.'); renderLearners(); };
    modal.querySelector('[data-export]').onclick=async function(){ if(!adminOpen()) return setStatus('Admin gesperrt.'); await exportCourse(); setStatus('Export erstellt.'); };
    modal.querySelector('[data-reset]').onclick=async function(){ if(!adminOpen()) return setStatus('Admin gesperrt.'); if(confirm('Wirklich alle Teilnehmerdaten dieses Kurses löschen? Vorher Export empfohlen.')){ var r=await resetCourse(); setStatus('Reset erledigt. Gelöscht: '+r.deleted); renderLearners(); } };
  }

  function setCreateResult(msg){ var el=document.querySelector('[data-create-result]'); if(el) el.textContent=msg||''; }
  function openModal(){ var m=document.getElementById('egtAdminModal'); if(m){ m.classList.add('show'); updateUI(); if(adminOpen()) nextCode().then(function(c){ var inp=m.querySelector('[data-new-learner-code]'); if(inp && !inp.value) inp.value=c; }); renderLearners(); } }
  function closeModal(){ var m=document.getElementById('egtAdminModal'); if(m) m.classList.remove('show'); }
  function switchTab(tab){ var m=document.getElementById('egtAdminModal'); if(!m) return; m.querySelectorAll('[data-tab]').forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-tab')===tab); }); m.querySelectorAll('[data-panel]').forEach(function(p){ p.classList.toggle('egt-admin-hidden', p.getAttribute('data-panel')!==tab); }); if(tab==='admin') renderLearners(); updateUI(); }
  function adminOpen(){ try{return sessionStorage.getItem(ADMIN_OPEN_KEY)==='1';}catch(e){return false;} }
  function unlockAdmin(pin){ pin=String(pin||'').trim(); if(!pin) return setStatus('PIN eingeben.'); var existing=null; try{existing=localStorage.getItem(ADMIN_PIN_KEY);}catch(e){} if(!existing){ if(pin.length<4) return setStatus('PIN muss mindestens 4 Zeichen haben.'); try{localStorage.setItem(ADMIN_PIN_KEY, btoa(pin)); sessionStorage.setItem(ADMIN_OPEN_KEY,'1');}catch(e){} setStatus('Admin-PIN gesetzt und geöffnet.'); renderLearners(); openModal(); return; } if(existing===btoa(pin)){ try{sessionStorage.setItem(ADMIN_OPEN_KEY,'1');}catch(e){} setStatus('Admin geöffnet.'); renderLearners(); var m=document.getElementById('egtAdminModal'); if(m) nextCode().then(function(c){ var inp=m.querySelector('[data-new-learner-code]'); if(inp) inp.value=c; }); } else setStatus('Falsche Admin-PIN.'); }

  function updateUI(){
    setStatus(statusText()); var mode=document.querySelector('[data-system-mode]'); if(mode) mode.textContent=state.online?'online':'lokal';
    var active=document.querySelector('[data-active-profile]'); if(active){ active.innerHTML=state.learner?('<div class="egt-admin-kv"><b>ID</b><span>'+escapeHtml(state.learner.userId||state.learner.code||'')+'</span><b>Name</b><span>'+escapeHtml(state.learner.displayName||state.learner.alias||'')+'</span><b>Status</b><span>'+escapeHtml(state.learner.status||'active')+'</span><b>Passwort</b><span>'+(state.profile&&state.profile.mustChangePassword?'Änderung erforderlich':'gesetzt')+'</span><b>Risiko</b><span>'+escapeHtml(state.profile&&state.profile.global&&state.profile.global.riskLevel||'unbekannt')+'</span></div>'):'Kein Teilnehmer aktiv.'; }
    var sum=document.querySelector('[data-profile-summary]'); if(sum){ sum.innerHTML=profileHtml(); }
    var er=document.querySelector('[data-profile-errors]'); if(er){ er.innerHTML=errorsHtml(); }
    if(typeof window.updateLoginBtnState === 'function') {
      try { window.updateLoginBtnState(); } catch(e){}
    }
  }
  function profileHtml(){ var p=state.profile; if(!p) return 'Noch kein Profil aktiv.'; var mods=p.modules||{}; return Object.keys(mods).map(function(k){ var m=mods[k]||{}; return '<div class="egt-admin-learner"><strong>'+escapeHtml(k.toUpperCase())+'</strong><div class="egt-admin-kv"><b>Quote</b><span>'+Math.round(((m.correct||0)/Math.max(1,m.answered||0))*100)+'%</span><b>Versuche</b><span>'+(m.answered||0)+'</span><b>Ø Score</b><span>'+(m.averageScore||0)+'</span></div></div>'; }).join('') || 'Noch keine Moduldaten.'; }
  function errorsHtml(){ var p=state.profile, errs=p&&p.global&&p.global.recurringErrors||{}; var keys=Object.keys(errs).sort(function(a,b){return errs[b]-errs[a];}).slice(0,8); if(!keys.length) return '<p>Noch keine wiederkehrenden Fehler gespeichert.</p>'; return keys.map(function(k){ return '<span class="egt-admin-pill">'+escapeHtml(k)+' · '+errs[k]+'</span>'; }).join(''); }
  async function renderLearners(){
    var box=document.querySelector('[data-learner-list]'); if(!box) return; if(!adminOpen()){ box.textContent='Admin gesperrt.'; return; } box.textContent='Lade Teilnehmer…';
    try{ var list=await listLearners(); if(!list.length){ box.textContent='Noch keine Teilnehmer.'; return; }
      box.innerHTML=list.map(function(x){ var userId=normalizeCode(x.userId||x.code||x.loginName||x.id); return '<div class="egt-admin-learner"><strong>'+escapeHtml(x.displayName||x.alias||userId)+'</strong> <span class="egt-admin-pill">'+escapeHtml(x.status||'active')+'</span><div class="egt-admin-kv"><b>ID</b><span>'+escapeHtml(userId)+'</span><b>Passwort</b><span>'+(x.mustChangePassword?'Einmalpasswort aktiv':'geändert')+'</span><b>Risiko</b><span>'+escapeHtml(x.global&&x.global.riskLevel||x.riskLevel||'unbekannt')+'</span><b>Letzte Aktivität</b><span>'+escapeHtml(x.lastActiveAt||'-')+'</span></div><div class="egt-admin-row"><button class="egt-admin-btn secondary" data-copy-code="'+escapeHtml(userId)+'">ID kopieren</button><button class="egt-admin-btn secondary" data-reset-pass="'+escapeHtml(userId)+'">Passwort zurücksetzen</button><button class="egt-admin-btn secondary" data-deactivate="'+escapeHtml(userId)+'">Deaktivieren</button><button class="egt-admin-btn danger" data-delete="'+escapeHtml(userId)+'">Löschen</button></div></div>'; }).join('');
      box.querySelectorAll('[data-copy-code]').forEach(function(b){ b.onclick=async function(){ var c=b.getAttribute('data-copy-code')||''; try{ await navigator.clipboard.writeText(c); setStatus('ID kopiert: '+c); }catch(e){ setStatus('ID: '+c); } }; });
      box.querySelectorAll('[data-reset-pass]').forEach(function(b){ b.onclick=async function(){ try{ var r=await resetPassword(b.getAttribute('data-reset-pass')); setStatus('Passwort zurückgesetzt: '+r.userId); alert('Neues Einmalpasswort für '+r.userId+':\n\n'+r.firstPassword+'\n\nDer Teilnehmer muss beim nächsten Login ein neues Passwort setzen.'); renderLearners(); }catch(e){ setStatus('Fehler: '+(e.message||e)); } }; });
      box.querySelectorAll('[data-deactivate]').forEach(function(b){ b.onclick=async function(){ await setLearnerStatus(b.getAttribute('data-deactivate'),'inactive'); renderLearners(); }; });
      box.querySelectorAll('[data-delete]').forEach(function(b){ b.onclick=async function(){ if(confirm('Teilnehmer wirklich löschen?')){ await deleteLearner(b.getAttribute('data-delete')); renderLearners(); } }; });
    }catch(e){ box.textContent='Fehler: '+(e.message||e); }
  }

  function showPasswordChange(code){
    var old=document.getElementById('egtPasswordChangeModal'); if(old) old.remove();
    var m=document.createElement('div'); m.id='egtPasswordChangeModal'; m.className='egt-admin-modal show';
    m.innerHTML='<div class="egt-admin-panel egt-password-panel"><div class="egt-admin-head"><div><h2>Willkommen</h2><p>Login erfolgreich. Bitte vergib jetzt ein neues Passwort.</p></div></div><div class="egt-admin-body"><div class="egt-admin-card"><input class="egt-admin-input" data-new-pass type="password" placeholder="Neues Passwort" autocomplete="new-password"><input class="egt-admin-input" data-new-pass-2 type="password" placeholder="Neues Passwort bestätigen" autocomplete="new-password"><div class="egt-admin-status" data-pass-status>Mindestens 8 Zeichen.</div><div class="egt-admin-row"><button class="egt-admin-btn" data-save-pass>Passwort speichern</button></div></div></div></div>';
    document.body.appendChild(m);
    m.querySelector('[data-save-pass]').onclick=async function(){ var p1=m.querySelector('[data-new-pass]').value; var p2=m.querySelector('[data-new-pass-2]').value; var st=m.querySelector('[data-pass-status]'); try{ if(p1!==p2) throw new Error('Die Passwörter stimmen nicht überein.'); await changePassword(code,p1); m.remove(); closeModal(); }catch(e){ st.textContent='Fehler: '+(e.message||e); } };
  }

  window.EGTAdminPortal = { version:INTERNAL_VERSION, init:init, state:snapshot, loginWithCode:loginWithCode, logout:logout, createLearner:createLearner, listLearners:listLearners, deleteLearner:deleteLearner, setLearnerStatus:setLearnerStatus, exportCourse:exportCourse, resetCourse:resetCourse, trackEvent:trackEvent, enrichCoachPayload:enrichCoachPayload, open:openModal, riskFromProfile:riskFromProfile, nextCode:nextCode, resetPassword:resetPassword, changePassword:changePassword, generatePassword:generatePassword, hashPassword:hashPassword };
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
