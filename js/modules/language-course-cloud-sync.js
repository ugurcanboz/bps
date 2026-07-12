/* Language Academy · Phase 28
   Cloud-Sync-Adapter für Sprachtrainingsfortschritt.
   Ziel: cloudfähig ohne Highscore/Admin/Novura Exams zu verändern.
*/
(function(){
  'use strict';
  var VERSION='G54.7-phase28-language-course-cloud-sync-adapter-v1';
  var MIRROR_KEY='language_academy_course_cloud_mirror_v1';
  var QUEUE_KEY='language_academy_course_cloud_queue_v1';
  var STATUS_KEY='language_academy_course_cloud_status_v1';
  var CONFIG=Object.assign({
    enabled:true,
    provider:'firebase-profile-bridge',
    mode:'local-first-cloud-ready',
    profileField:'languageCourseProgress',
    queueType:'languageCourseProgress',
    autoPush:true,
    allowGuestLocalMirror:true
  }, window.LANGUAGE_COURSE_SYNC_CONFIG||{});

  function now(){return new Date().toISOString();}
  function safeJsonParse(raw,fallback){try{return raw?JSON.parse(raw):fallback;}catch(e){return fallback;}}
  function readLS(key,fallback){try{return safeJsonParse(localStorage.getItem(key),fallback);}catch(e){return fallback;}}
  function writeLS(key,val){try{localStorage.setItem(key,JSON.stringify(val)); return true;}catch(e){return false;}}
  function userDb(){return window.EGTUserDatabase||null;}
  function session(){
    var db=userDb();
    try{ if(db&&typeof db.getSession==='function') return db.getSession()||{}; }catch(e){}
    try{ if(db&&db.activeProfile) return db.activeProfile||{}; }catch(e){}
    try{ if(window.EGTAuthProfileShell&&typeof window.EGTAuthProfileShell.currentSession==='function') return window.EGTAuthProfileShell.currentSession()||{}; }catch(e){}
    return {};
  }
  function userKey(){
    var s=session();
    return String(s.firebaseUid||s.profileId||s.userId||s.code||s.loginName||s.nickname||'guest').trim()||'guest';
  }
  function isGuest(){return userKey()==='guest';}
  function statusPatch(patch){
    var base=readLS(STATUS_KEY,{ok:false,enabled:!!CONFIG.enabled,provider:CONFIG.provider,mode:CONFIG.mode,pending:0,lastSyncAt:null,lastError:''});
    var st=Object.assign({},base,patch||{}, {enabled:!!CONFIG.enabled,provider:CONFIG.provider,mode:CONFIG.mode,pending:queue().length});
    writeLS(STATUS_KEY,st); return st;
  }
  function queue(){return readLS(QUEUE_KEY,[]).filter(Boolean);}
  function saveQueue(q){writeLS(QUEUE_KEY,(q||[]).slice(-25)); statusPatch({});}
  function envelope(progress,meta){
    return {
      schema:'language-course-cloud-sync-v1',
      version:VERSION,
      provider:CONFIG.provider,
      userKey:userKey(),
      source:'language-academy',
      clientUpdatedAt:(progress&&progress.updatedAt)||now(),
      queuedAt:now(),
      meta:meta||{},
      progress:progress||{},
      coachSnapshot:(window.LanguageAcademyCourseEntry&&window.LanguageAcademyCourseEntry.coachQaSnapshot)?window.LanguageAcademyCourseEntry.coachQaSnapshot():null
    };
  }
  function mirror(env){
    var all=readLS(MIRROR_KEY,{}); all[env.userKey||userKey()]=env; writeLS(MIRROR_KEY,all); return env;
  }
  function localRemote(){var all=readLS(MIRROR_KEY,{}); return all[userKey()]||null;}
  function remoteFromProfile(){
    var s=session();
    return (s&&s.modules&&s.modules.languageCourse&&s.modules.languageCourse.syncEnvelope) || (s&&s[CONFIG.profileField]) || null;
  }
  function newest(a,b){
    if(!a) return b||null; if(!b) return a||null;
    var ta=Date.parse(a.clientUpdatedAt||(a.progress&&a.progress.updatedAt)||0)||0;
    var tb=Date.parse(b.clientUpdatedAt||(b.progress&&b.progress.updatedAt)||0)||0;
    return tb>ta?b:a;
  }
  async function writeProfileEnvelope(env){
    var db=userDb();
    if(!db||typeof db.saveProfile!=='function') throw new Error('UserDatabase nicht verfügbar');
    var s=session();
    if(!s||isGuest()) throw new Error('Kein angemeldetes Cloud-Profil');
    var next=Object.assign({},s);
    next.modules=Object.assign({},next.modules||{});
    next.modules.languageCourse=Object.assign({},next.modules.languageCourse||{}, {syncEnvelope:env, updatedAt:now()});
    next[CONFIG.profileField]=env;
    await db.saveProfile(next,true);
    return env;
  }
  async function push(progress,meta){
    if(!CONFIG.enabled) return statusPatch({ok:false,lastError:'Cloud-Sync deaktiviert'});
    var env=mirror(envelope(progress,meta));
    if(isGuest() && CONFIG.allowGuestLocalMirror){
      statusPatch({ok:true,mode:'local-mirror',lastSyncAt:now(),lastError:'Gastmodus: lokal gespiegelt, Cloud wartet auf Login'});
      return {ok:true,mode:'local-mirror',envelope:env};
    }
    try{
      await writeProfileEnvelope(env);
      statusPatch({ok:true,mode:'cloud-profile',lastSyncAt:now(),lastError:''});
      return {ok:true,mode:'cloud-profile',envelope:env};
    }catch(e){
      var q=queue(); q.push(env); saveQueue(q);
      try{var db=userDb(); if(db&&typeof db.queuePendingSync==='function') db.queuePendingSync(CONFIG.queueType,env);}catch(_e){}
      statusPatch({ok:false,mode:'queued',lastError:e&&e.message?e.message:String(e)});
      return {ok:false,mode:'queued',envelope:env,error:e&&e.message?e.message:String(e)};
    }
  }
  function queuePush(progress,meta){
    if(!CONFIG.autoPush) return false;
    try{setTimeout(function(){push(progress,meta);},0); return true;}catch(e){return false;}
  }
  async function pull(meta){
    var remote=newest(remoteFromProfile(),localRemote());
    if(remote&&remote.progress){
      mirror(remote);
      statusPatch({ok:true,mode:remoteFromProfile()?'cloud-profile':'local-mirror',lastSyncAt:now(),lastError:''});
      return {ok:true,progress:remote.progress,envelope:remote,meta:meta||{}};
    }
    statusPatch({ok:false,lastError:'Kein Cloud-/Mirror-Fortschritt gefunden'});
    return {ok:false,progress:null,meta:meta||{}};
  }
  async function flush(){
    var q=queue(); if(!q.length) return {ok:true,flushed:0};
    var done=0, rest=[];
    for(var i=0;i<q.length;i++){
      try{ await writeProfileEnvelope(q[i]); done++; }catch(e){ rest.push(q[i]); }
    }
    saveQueue(rest);
    statusPatch({ok:rest.length===0,lastSyncAt:done?now():null,lastError:rest.length?('Noch '+rest.length+' Sync-Eintrag(e) offen'):''});
    return {ok:rest.length===0,flushed:done,pending:rest.length};
  }
  function status(){
    var st=readLS(STATUS_KEY,{ok:false,enabled:!!CONFIG.enabled,provider:CONFIG.provider,mode:CONFIG.mode,pending:queue().length,lastSyncAt:null,lastError:''});
    st.pending=queue().length;
    st.provider=CONFIG.provider;
    st.enabled=!!CONFIG.enabled;
    if(localRemote()&&!st.lastSyncAt) st.lastSyncAt=localRemote().queuedAt||localRemote().clientUpdatedAt||null;
    return st;
  }
  function diagnostics(){return {ok:true,phase:'28',version:VERSION,config:CONFIG,status:status(),userKey:userKey(),guest:isGuest(),hasUserDatabase:!!userDb(),hasProfileBridge:!!(userDb()&&typeof userDb().saveProfile==='function'),hasLocalMirror:!!localRemote(),queueLength:queue().length};}
  window.LanguageCourseCloudSync={version:VERSION,config:CONFIG,envelope:envelope,push:push,queuePush:queuePush,pull:pull,flush:flush,status:status,diagnostics:diagnostics};
  statusPatch({ok:!!localRemote(), lastError:localRemote()?'':'Cloud-Sync bereit · noch kein Sprachtrainingsstand gespiegelt'});
})();
